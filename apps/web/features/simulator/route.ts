/* Where a scenario path runs: administrative units crossed, candidate river names, and places it passes near.
 * Everything is a lookup against checksum-verified releases (COD-AB v02 boundaries, GeoNames stream names,
 * OpenStreetMap settlements). Nothing is invented. GeoNames stream points are listed where the path passes them, at
 * their own position: the release warns that a point may be a mouth or other reference location and that nearby streams
 * must not inherit its name, so no stretch of the path is named after one. A place is only "near" the line, never "affected". */
import { haversineKm, pointAt, type LonLat, type Measured } from './scene-3d';

type Ring = number[][];
type Polygonal = GeoJSON.Polygon | GeoJSON.MultiPolygon;
export interface Area { name: string; pcode: string; parent?: string | null; geometry: Polygonal; bbox: [number, number, number, number] }
export interface NamedPoint { name: string; coordinates: LonLat; kind?: string }
export interface Unit { province: string | null; provinceCode: string | null; district: string | null; local: string | null; inNepal: boolean }
export interface Stretch { fromKm: number; toKm: number; unit: Unit }
export interface RiverRun { name: string; fromKm: number; toKm: number; at: LonLat; offKm: number }
export interface Place { name: string; kind: string; km: number; coordinates: LonLat; offKm: number }
export interface Route { stretches: Stretch[]; rivers: RiverRun[]; places: Place[]; start: Unit; end: Unit; leavesNepalKm: number | null; pathKm: number }

export function bboxOf(geometry: Polygonal): [number, number, number, number] {
  let w = Infinity, s = Infinity, e = -Infinity, n = -Infinity;
  const polys = geometry.type === 'Polygon' ? [geometry.coordinates] : geometry.coordinates;
  for (const poly of polys) for (const [x, y] of poly[0]) { w = Math.min(w, x); e = Math.max(e, x); s = Math.min(s, y); n = Math.max(n, y); }
  return [w, s, e, n];
}

function inRing([x, y]: LonLat, ring: Ring) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i], [xj, yj] = ring[j];
    if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

/** Even-odd test over every ring, so holes are respected. */
export function contains(area: Pick<Area, 'geometry' | 'bbox'>, p: LonLat) {
  const [w, s, e, n] = area.bbox;
  if (p[0] < w || p[0] > e || p[1] < s || p[1] > n) return false;
  const polys = area.geometry.type === 'Polygon' ? [area.geometry.coordinates] : area.geometry.coordinates;
  return polys.some(poly => poly.reduce((inside, ring) => inRing(p, ring) ? !inside : inside, false));
}

export function toArea(feature: GeoJSON.Feature): Area | null {
  const g = feature.geometry;
  if (!g || (g.type !== 'Polygon' && g.type !== 'MultiPolygon')) return null;
  const p = (feature.properties ?? {}) as Record<string, unknown>;
  return { name: String(p.name ?? 'UNKNOWN'), pcode: String(p.pcode ?? ''), parent: (p.parent_name as string | null) ?? null, geometry: g, bbox: bboxOf(g) };
}

/** Grid index for nearest-point lookups over thousands of named points. */
export function pointIndex(points: NamedPoint[], cell = 0.05) {
  const grid = new Map<string, NamedPoint[]>();
  const key = (x: number, y: number) => `${Math.floor(x / cell)}:${Math.floor(y / cell)}`;
  for (const p of points) { const k = key(p.coordinates[0], p.coordinates[1]); const list = grid.get(k); if (list) list.push(p); else grid.set(k, [p]); }
  return function nearest(at: LonLat, maxKm: number) {
    const reach = Math.ceil(maxKm / (111 * cell * Math.max(0.3, Math.cos(at[1] * Math.PI / 180)))) + 1;
    const cx = Math.floor(at[0] / cell), cy = Math.floor(at[1] / cell);
    let best: NamedPoint | null = null, bestKm = maxKm;
    for (let dx = -reach; dx <= reach; dx++) for (let dy = -reach; dy <= reach; dy++) {
      for (const p of grid.get(`${cx + dx}:${cy + dy}`) ?? []) { const d = haversineKm(at, p.coordinates); if (d <= bestKm) { best = p; bestKm = d; } }
    }
    return best ? { point: best, km: bestKm } : null;
  };
}

export interface RouteInputs { country: Area[]; provinces: Area[]; districts: Area[]; locals: Area[]; rivers: NamedPoint[]; places: NamedPoint[] }

const sameUnit = (a: Unit, b: Unit) => a.inNepal === b.inNepal && a.district === b.district && a.province === b.province;

/**
 * Walks the drawn path in 0.5 km steps. Distances are reported in model km (the drawn line is scaled to the
 * model path length, as in the playback), so they agree with the arrival table.
 * - river names: the nearest GeoNames stream point within 1.5 km; a name counts once it holds for 2 km.
 * - places: cities and towns within 4 km of the line, villages within 1 km; each listed once, at its closest point.
 */
export function buildRoute(line: Measured, pathKm: number, data: RouteInputs, stepKm = 0.5): Route {
  const scale = pathKm / (line.length || 1);
  const nearestRiver = pointIndex(data.rivers), nearestPlace = pointIndex(data.places);
  const locate = (p: LonLat): Unit => {
    const inNepal = data.country.some(c => contains(c, p));
    const province = data.provinces.find(a => contains(a, p)) ?? null;
    const district = data.districts.find(a => contains(a, p)) ?? null;
    // A local level is looked up within its own district, so a river on a boundary never mixes the two sides.
    const local = district ? data.locals.find(a => a.parent === district.name && contains(a, p)) ?? null : null;
    return { inNepal, province: province?.name ?? null, provinceCode: province?.pcode ?? null, district: district?.name ?? null, local: local?.name ?? null };
  };
  const stretches: Stretch[] = [], names: Array<{ km: number; name: string | null; at: LonLat; offKm: number }> = [], seen = new Map<string, Place>();
  let leavesNepalKm: number | null = null, wasInNepal = false;
  for (let g = 0; g <= line.length + 1e-9; g += stepKm) {
    const at = pointAt(line, Math.min(g, line.length)), km = Math.min(pathKm, g * scale), unit = locate(at);
    const last = stretches.at(-1);
    if (last && sameUnit(last.unit, unit)) last.toKm = km; else stretches.push({ fromKm: last ? last.toKm : km, toKm: km, unit });
    if (wasInNepal && !unit.inNepal && leavesNepalKm === null) leavesNepalKm = km;
    wasInNepal = wasInNepal || unit.inNepal;
    const stream = nearestRiver(at, 1.5);
    names.push({ km, name: stream?.point.name ?? null, at: stream?.point.coordinates ?? at, offKm: stream?.km ?? Infinity });
    const near = nearestPlace(at, 4);
    if (near) {
      const limit = near.point.kind === 'village' ? 1 : 4;
      if (near.km <= limit) {
        const key = `${near.point.name}@${near.point.coordinates.join(',')}`, prior = seen.get(key);
        if (!prior || near.km < prior.offKm) seen.set(key, { name: near.point.name, kind: near.point.kind ?? 'place', km, coordinates: near.point.coordinates, offKm: near.km });
      }
    }
  }
  // Runs of one candidate name, bridging gaps under 3 km; short runs are dropped as noise.
  const rivers: RiverRun[] = [];
  for (const s of names) {
    if (!s.name) continue;
    const last = rivers.at(-1);
    if (last && last.name === s.name && s.km - last.toKm <= 3) last.toKm = s.km;
    else rivers.push({ name: s.name, fromKm: s.km, toKm: s.km, at: s.at, offKm: s.offKm });
    // The listed position is the named point itself, where the path came closest to it.
    const run = rivers.at(-1)!;
    if (s.offKm < run.offKm) { run.at = s.at; run.offKm = s.offKm; }
  }
  const kept = rivers.filter(r => r.toKm - r.fromKm >= 2);
  const merged: RiverRun[] = [];
  for (const r of kept) { const last = merged.at(-1); if (last && last.name === r.name) last.toKm = r.toKm; else merged.push(r); }
  return {
    stretches: stretches.filter(s => s.toKm > s.fromKm || stretches.length === 1),
    rivers: merged, places: [...seen.values()].sort((a, b) => a.km - b.km),
    start: stretches[0]?.unit ?? { province: null, provinceCode: null, district: null, local: null, inNepal: false },
    end: stretches.at(-1)?.unit ?? { province: null, provinceCode: null, district: null, local: null, inNepal: false },
    leavesNepalKm, pathKm,
  };
}

/** The stretch, river and nearest listed place at a model km along the path. */
export function whereAt(route: Route, km: number) {
  const stretch = route.stretches.find(s => km >= s.fromKm && km <= s.toKm) ?? route.stretches.at(-1) ?? null;
  const river = route.rivers.find(r => km >= r.fromKm - 1 && km <= r.toKm + 1) ?? null;
  let place: Place | null = null;
  for (const p of route.places) if (Math.abs(p.km - km) <= 4 && (!place || Math.abs(p.km - km) < Math.abs(place.km - km))) place = p;
  return { stretch, river, place };
}

export interface DistrictStretch {
  /** One district, or two joined with " / " where the path follows the boundary between them. */
  district: string | null; districts: string[]; province: string | null; provinceCode: string | null; provinces: string[];
  inNepal: boolean; boundary: boolean; fromKm: number; toKm: number;
}

/** Districts in the order the path enters them. Rivers often are district boundaries, so a path can cross between
 * the same two districts every few hundred metres; such back-and-forth stretches (each crossing under `shortKm`)
 * are kept together as one stretch naming both districts, instead of a long flickering list. */
export function districtSequence(route: Route, shortKm = 5) {
  const out: Array<DistrictStretch & { lastKm: number }> = [];
  for (const s of route.stretches) {
    const len = s.toKm - s.fromKm, name = s.unit.district, last = out.at(-1);
    const joins = last && last.inNepal === s.unit.inNepal && name !== null &&
      (last.districts.includes(name) || (last.districts.length < 2 && (len < shortKm || last.lastKm < shortKm)));
    if (last && (joins || (last.district === name && last.inNepal === s.unit.inNepal))) {
      if (name && !last.districts.includes(name)) last.districts.push(name);
      if (s.unit.province && !last.provinces.includes(s.unit.province)) last.provinces.push(s.unit.province);
      last.toKm = s.toKm; last.lastKm = len;
    } else {
      out.push({ district: name, districts: name ? [name] : [], province: s.unit.province, provinceCode: s.unit.provinceCode, provinces: s.unit.province ? [s.unit.province] : [],
        inNepal: s.unit.inNepal, boundary: false, fromKm: s.fromKm, toKm: s.toKm, lastKm: len });
    }
  }
  return out.filter(d => d.toKm - d.fromKm > 0.2 || out.length === 1).map((d): DistrictStretch => ({ district: d.districts.length ? d.districts.join(' / ') : null, districts: d.districts, province: d.province, provinceCode: d.provinceCode,
    provinces: d.provinces, inNepal: d.inNepal, boundary: d.districts.length > 1, fromKm: d.fromKm, toKm: d.toKm }));
}
