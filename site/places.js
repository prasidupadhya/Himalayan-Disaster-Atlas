// Where a path runs and what lies near a point: lookups against the published boundary and place datasets. No DOM.
// A place is only ever "near" a path or "at" a level of shaking; nothing here says a place would be flooded or damaged.

const RAD = Math.PI / 180;
/** Flat-earth distance in km: accurate to well under 1% over the tens of km these lookups span. */
export const flatKm = (a, b) => Math.hypot((a[0] - b[0]) * Math.cos((a[1] + b[1]) / 2 * RAD) * 111.32, (a[1] - b[1]) * 110.57);

/** Points every `step` km along a line whose published length is `totalKm`: [{ km, p }]. */
export function sample(line, totalKm, step = 0.5) {
  const seg = line.slice(1).map((p, i) => flatKm(line[i], p)), geo = seg.reduce((a, b) => a + b, 0) || 1, out = [];
  let i = 0, before = 0;
  for (let n = 0, count = Math.max(1, Math.ceil(totalKm / step)); n <= count; n++) {
    const km = Math.min(totalKm, n * step), d = km / totalKm * geo;
    while (i < seg.length - 1 && d > before + seg[i]) before += seg[i++];
    const k = seg[i] ? Math.min(1, Math.max(0, (d - before) / seg[i])) : 0;
    out.push({ km, p: [line[i][0] + (line[i + 1][0] - line[i][0]) * k, line[i][1] + (line[i + 1][1] - line[i][1]) * k] });
  }
  return out;
}
/** The point at a distance along sampled points. */
export function pointAt(samples, km) {
  const step = samples[1] ? samples[1].km - samples[0].km : 1, i = Math.min(samples.length - 2, Math.max(0, Math.floor(km / step)));
  if (!samples[i + 1]) return samples[0].p;
  const a = samples[i], b = samples[i + 1], k = Math.min(1, Math.max(0, (km - a.km) / (b.km - a.km || 1)));
  return [a.p[0] + (b.p[0] - a.p[0]) * k, a.p[1] + (b.p[1] - a.p[1]) * k];
}

function inRing([x, y], ring) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i], [xj, yj] = ring[j];
    if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}
/** District lookup over COD-AB polygons: find([lon, lat]) -> { name, province, feature } or null outside Nepal. */
export function districtFinder(features) {
  const areas = features.map(f => {
    const polys = f.geometry.type === 'Polygon' ? [f.geometry.coordinates] : f.geometry.coordinates;
    let w = Infinity, s = Infinity, e = -Infinity, n = -Infinity;
    for (const poly of polys) for (const [x, y] of poly[0]) { w = Math.min(w, x); e = Math.max(e, x); s = Math.min(s, y); n = Math.max(n, y); }
    return { name: f.properties.name, province: f.properties.parent_name, feature: f, polys, box: [w, s, e, n] };
  });
  let last = null;
  const has = (a, p) => p[0] >= a.box[0] && p[0] <= a.box[2] && p[1] >= a.box[1] && p[1] <= a.box[3]
    && a.polys.some(poly => poly.reduce((inside, ring) => inRing(p, ring) ? !inside : inside, false));   // even-odd, so holes count
  return p => (last && has(last, p) ? last : (last = areas.find(a => has(a, p)) ?? null));
}

/**
 * The districts a sampled path runs through, in order: [{ names, provinces, features, fromKm, toKm }].
 * Rivers are often district borders, so a stretch may carry two or more names (the path runs along their border);
 * a null name is outside Nepal. Each sample is read with its neighbours 1.5 km either side, so a border river
 * becomes one "A and B" stretch instead of flipping between them every few hundred metres.
 */
export function stretches(samples, find, windowKm = 1.5) {
  const at = samples.map(s => find(s.p)), step = samples[1] ? samples[1].km - samples[0].km : 1, w = Math.max(1, Math.round(windowKm / step));
  const runs = [];
  at.forEach((_, i) => {
    const seen = new Map();
    for (let j = Math.max(0, i - w); j <= Math.min(at.length - 1, i + w); j++) seen.set(at[j]?.name ?? null, at[j]);
    // Names keep the order the path meets them (outside Nepal last); the key ignores order so a border stretch stays one run.
    const names = [...seen.keys()].sort((x, y) => (x === null) - (y === null)), key = [...names].sort().join('|'), prev = runs.at(-1);
    if (prev?.key === key) prev.toKm = samples[i].km;
    else { if (prev) prev.toKm = samples[i].km; runs.push({ key, names, found: names.map(n => seen.get(n)), fromKm: samples[i].km, toKm: samples[i].km }); }
  });
  // Short runs that add no new name (a sliver inside a border stretch, or the blur at a crossing) fold into their neighbours.
  // No district name is ever dropped: a run is folded only when its neighbours already carry all of its names.
  for (let changed = true; changed;) {
    changed = false;
    for (let i = 1; i < runs.length - 1; i++) {
      const r = runs[i], a = runs[i - 1], b = runs[i + 1];
      if (r.toKm - r.fromKm > 2 * windowKm + 3 || !r.names.every(n => a.names.includes(n) || b.names.includes(n))) continue;
      if (a.key === b.key) { a.toKm = b.toKm; runs.splice(i, 2); } else { const mid = (r.fromKm + r.toKm) / 2; a.toKm = mid; b.fromKm = mid; runs.splice(i, 1); }
      changed = true; i--;
    }
  }
  const end = runs.at(-1), before = runs.at(-2);
  if (before && end.toKm - end.fromKm < 1 && end.names.every(n => before.names.includes(n))) { before.toKm = end.toKm; runs.pop(); }
  return runs.map(r => ({ names: r.names, provinces: [...new Set(r.found.map(d => d?.province).filter(Boolean))], features: r.found.filter(Boolean).map(d => d.feature), fromKm: r.fromKm, toKm: r.toKm }));
}

/** Named points within maxKm of a sampled path, each once, at the path distance where it is nearest: [{ name, kind, km, offKm, p }] by km. */
export function nearPath(samples, points, maxKm) {
  let w = Infinity, s = Infinity, e = -Infinity, n = -Infinity;
  for (const { p } of samples) { w = Math.min(w, p[0]); e = Math.max(e, p[0]); s = Math.min(s, p[1]); n = Math.max(n, p[1]); }
  const pad = maxKm / 90, out = [];
  for (const pt of points) {
    const q = pt.p;
    if (q[0] < w - pad || q[0] > e + pad || q[1] < s - pad || q[1] > n + pad) continue;
    let at = 0, near = Infinity;
    samples.forEach((sm, i) => { const d = flatKm(sm.p, q); if (d < near) { near = d; at = i; } });
    if (near > maxKm + 1) continue;
    // Refine on the two segments that meet at the nearest sample, so the distance is to the line itself.
    let best = near, km = samples[at].km;
    for (const [a, b] of [[samples[at - 1], samples[at]], [samples[at], samples[at + 1]]]) {
      if (!a || !b) continue;
      const k = Math.cos(q[1] * RAD) * 111.32, ax = (a.p[0] - q[0]) * k, ay = (a.p[1] - q[1]) * 110.57, bx = (b.p[0] - q[0]) * k, by = (b.p[1] - q[1]) * 110.57;
      const dx = bx - ax, dy = by - ay, t = Math.min(1, Math.max(0, -(ax * dx + ay * dy) / (dx * dx + dy * dy || 1))), d = Math.hypot(ax + t * dx, ay + t * dy);
      if (d < best) { best = d; km = a.km + t * (b.km - a.km); }
    }
    if (best <= maxKm) out.push({ ...pt, km, offKm: best });
  }
  return out.sort((a, b) => a.km - b.km);
}

/** Cities, towns and villages from the OSM settlements release, names as published: [{ name, kind, p }]. */
// Only places OpenStreetMap actually names: the release fills `name` with a placeholder where `asset_name` is empty.
export const settlements = fc => fc.features.filter(f => ['city', 'town', 'village'].includes(f.properties.asset_subtype) && f.properties.asset_name)
  .map(f => ({ name: f.properties.asset_name, kind: f.properties.asset_subtype, p: f.geometry.coordinates }));
/** GeoNames stream points: a name marks a point, not a whole river. */
export const streams = fc => fc.features.filter(f => f.properties.name).map(f => ({ name: f.properties.name, kind: 'stream', p: f.geometry.coordinates }));

/** Everything named along a path: districts crossed, towns near it, a village count and stream names, all by distance. */
export function describePath(line, totalKm, find, places, streamPoints) {
  const samples = sample(line, totalKm), parts = stretches(samples, find);
  const towns = nearPath(samples, places.filter(p => p.kind !== 'village'), 5);
  const villages = nearPath(samples, places.filter(p => p.kind === 'village'), 2).length;
  const seen = new Set(), rivers = nearPath(samples, streamPoints, 1).filter(r => !seen.has(r.name) && seen.add(r.name));
  // Start and exit are read from the samples themselves, not from the smoothed stretches:
  // the path leaves Nepal at the first of the samples that end it outside the boundary.
  const inside = samples.map(sm => find(sm.p)), lastIn = inside.findLastIndex(Boolean);
  const leavesNepalKm = lastIn >= 0 && lastIn < samples.length - 1 ? samples[lastIn + 1].km : null;
  return { samples, parts, towns, villages, rivers, leavesNepalKm, start: inside[0] };
}
