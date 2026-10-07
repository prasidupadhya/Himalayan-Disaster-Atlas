import { cellCentre, type PopulationCells } from '../../../packages/contracts/model-release';

/** BSSA14 model as published in atlas-gmpe-bssa14 (verified against pygmm reference cases offline). */
export interface GmpeModel {
  format: 'atlas-gmpe@1'; model: 'BSSA14'; reference: string; doi: string; region: string;
  constants: Record<'Mref' | 'Rref' | 'Vref' | 'f1' | 'f3' | 'v1' | 'v2', number>;
  coefficients: Record<'pga' | 'pgv', Record<string, number>>;
  mechanisms: Record<Mechanism, string>;
  domain: { magnitude: [number, number]; normal_magnitude_max: number; rjb_km: [number, number]; vs30_m_s: [number, number] };
  units: Record<string, string>; omitted: string[];
}
export const MECHANISMS = ['unspecified', 'strike-slip', 'normal', 'reverse'] as const;
export type Mechanism = typeof MECHANISMS[number];
/** Uniform site classes offered by the simulator (m/s). */
export const VS30_CLASSES = [760, 360, 270, 180] as const;
export type Rupture = { type: 'point' } | { type: 'line'; length_km: number; strike_deg: number };
export interface QuakeScenario { kind: 'earthquake'; version: 1; preset: string | null; longitude: number; latitude: number; magnitude: number; mechanism: Mechanism; rupture: Rupture; vs30: number }

export const PGA_BANDS = [
  { min: 0, max: 0.02, label: '< 0.02 g', color: '#a8440f' },
  { min: 0.02, max: 0.05, label: '0.02–0.05 g', color: '#cf5a14' },
  { min: 0.05, max: 0.1, label: '0.05–0.1 g', color: '#ec7a24' },
  { min: 0.1, max: 0.2, label: '0.1–0.2 g', color: '#fb9f45' },
  { min: 0.2, max: 0.4, label: '0.2–0.4 g', color: '#ffc77d' },
  { min: 0.4, max: Infinity, label: '≥ 0.4 g', color: '#ffe7c2' },
] as const;
export const bandOf = (pga: number) => PGA_BANDS.findIndex(b => pga >= b.min && pga < b.max);

const EARTH_KM = 6371.0088;
const RAD = Math.PI / 180;
function toLocal(lon: number, lat: number, lon0: number, lat0: number): [number, number] {
  return [(lon - lon0) * RAD * EARTH_KM * Math.cos(lat0 * RAD), (lat - lat0) * RAD * EARTH_KM];
}
/** Great-circle distance (km); the 400 km domain limit is judged on this, not on a flat projection. */
export function greatCircleKm(lon1: number, lat1: number, lon2: number, lat2: number) {
  const a = Math.sin((lat2 - lat1) * RAD / 2) ** 2 + Math.cos(lat1 * RAD) * Math.cos(lat2 * RAD) * Math.sin((lon2 - lon1) * RAD / 2) ** 2;
  return 2 * EARTH_KM * Math.asin(Math.min(1, Math.sqrt(a)));
}
/** Joyner-Boore distance to the surface projection: the epicentre (point) or a declared surface line centred on it. */
export function joynerBoore(s: Pick<QuakeScenario, 'longitude' | 'latitude' | 'rupture'>, lon: number, lat: number) {
  if (s.rupture.type === 'point') return greatCircleKm(s.longitude, s.latitude, lon, lat);
  const [x, y] = toLocal(lon, lat, s.longitude, s.latitude);
  const theta = s.rupture.strike_deg * RAD;
  const ux = Math.sin(theta), uy = Math.cos(theta), half = s.rupture.length_km / 2;
  const t = Math.max(-half, Math.min(half, x * ux + y * uy));
  // The nearest point is located along the declared line (same geometry as ruptureLine); its distance is great-circle.
  const nearestLon = s.longitude + t * ux / (EARTH_KM * Math.cos(s.latitude * RAD)) / RAD;
  const nearestLat = s.latitude + t * uy / EARTH_KM / RAD;
  return greatCircleKm(nearestLon, nearestLat, lon, lat);
}
export function ruptureLine(s: QuakeScenario): [number, number][] {
  if (s.rupture.type === 'point') return [[s.longitude, s.latitude]];
  const theta = s.rupture.strike_deg * Math.PI / 180, half = s.rupture.length_km / 2, k = 180 / Math.PI;
  const end = (sign: number): [number, number] => [s.longitude + sign * half * Math.sin(theta) / (EARTH_KM * Math.cos(s.latitude / k)) * k, s.latitude + sign * half * Math.cos(theta) / EARTH_KM * k];
  return [end(-1), end(1)];
}

export function validateScenario(model: GmpeModel, s: QuakeScenario): string[] {
  const errors: string[] = [];
  const upper = s.mechanism === 'normal' ? model.domain.normal_magnitude_max : model.domain.magnitude[1];
  if (!(s.magnitude >= model.domain.magnitude[0] && s.magnitude <= upper)) errors.push(`Magnitude must be ${model.domain.magnitude[0]}–${upper} for this mechanism (BSSA14 domain).`);
  if (!(s.vs30 >= model.domain.vs30_m_s[0] && s.vs30 <= model.domain.vs30_m_s[1])) errors.push(`V_S30 must be ${model.domain.vs30_m_s[0]}–${model.domain.vs30_m_s[1]} m/s.`);
  if (!(s.longitude >= 78 && s.longitude <= 90 && s.latitude >= 25 && s.latitude <= 32)) errors.push('Epicentre must lie within 78–90°E and 25–32°N.');
  if (!Object.prototype.hasOwnProperty.call(model.mechanisms, s.mechanism) || !(MECHANISMS as readonly string[]).includes(s.mechanism)) errors.push('Unknown mechanism.');
  if (s.rupture.type === 'line' && !(s.rupture.length_km >= 1 && s.rupture.length_km <= 400 && s.rupture.strike_deg >= 0 && s.rupture.strike_deg < 360)) errors.push('Line rupture needs a length of 1–400 km and strike 0–359°.');
  return errors;
}

/** ln-median and total sigma for one site (equations of Boore et al. 2014). */
export function groundMotion(model: GmpeModel, imt: 'pga' | 'pgv', magnitude: number, rjb: number, vs30: number, mechanism: Mechanism) {
  const K = model.constants;
  const base = (c: Record<string, number>) => {
    const m = magnitude - c.Mh;
    const fe = c[model.mechanisms[mechanism]] + (magnitude <= c.Mh ? c.e4 * m + c.e5 * m * m : c.e6 * m);
    const r = Math.sqrt(rjb * rjb + c.h * c.h);
    return fe + (c.c1 + c.c2 * (magnitude - K.Mref)) * Math.log(r / K.Rref) + (c.c3 + c.Dc3) * (r - K.Rref);
  };
  const c = model.coefficients[imt];
  const rock = Math.exp(base(model.coefficients.pga));
  const linear = c.c * Math.log(Math.min(vs30, c.Vc) / K.Vref);
  const f2 = c.f4 * (Math.exp(c.f5 * (Math.min(vs30, 760) - 360)) - Math.exp(c.f5 * (760 - 360)));
  const lnMedian = base(c) + linear + K.f1 + f2 * Math.log((rock + K.f3) / K.f3);
  const between = (a: number, b: number) => magnitude <= 4.5 ? a : magnitude >= 5.5 ? b : a + (b - a) * (magnitude - 4.5);
  const tau = between(c.tau1, c.tau2);
  let phi = between(c.phi1, c.phi2);
  if (rjb > c.R2) phi += c.DfR; else if (rjb > c.R1) phi += c.DfR * Math.log(rjb / c.R1) / Math.log(c.R2 / c.R1);
  if (vs30 <= K.v1) phi -= c.DfV; else if (vs30 < K.v2) phi -= c.DfV * Math.log(K.v2 / vs30) / Math.log(K.v2 / K.v1);
  return { lnMedian, median: Math.exp(lnMedian), sigma: Math.sqrt(tau * tau + phi * phi), tau, phi };
}

export interface Asset { id: string; category: string; name: string | null; coordinates: [number, number] }
export interface ShakingResult {
  scenario: QuakeScenario; maxDistanceKm: number;
  population: { low: number[]; central: number[]; high: number[]; beyond: number; total: number; outsideDomainCells: number };
  assets: Record<string, { low: number[]; central: number[]; high: number[] }>;
  cellBands: Int8Array; cellKeys: Int32Array;
  /** Sites beyond the 400 km domain keep their distance but have null (UNKNOWN) motion: never extrapolated. */
  sites: Array<{ label: string; longitude: number; latitude: number; rjb: number; median: number | null; low: number | null; high: number | null; sigma: number | null }>;
}

/**
 * Counts population (HRSL grid cells) and mapped OSM assets by PGA band for the median and for ln PGA ± one
 * total sigma. Cells beyond 400 km R_JB are outside the model domain and are counted separately (UNKNOWN band).
 */
export function computeShaking(model: GmpeModel, scenario: QuakeScenario, cells: PopulationCells, assets: Asset[], sites: Array<{ label: string; longitude: number; latitude: number }> = []): ShakingResult {
  const errors = validateScenario(model, scenario);
  if (errors.length) throw new Error(errors.join(' '));
  const nb = PGA_BANDS.length;
  const pop = { low: new Array(nb).fill(0), central: new Array(nb).fill(0), high: new Array(nb).fill(0), beyond: 0, total: 0, outsideDomainCells: 0 };
  const keys = Int32Array.from(cells.index.keys());
  const cellBands = new Int8Array(keys.length);
  const maxR = model.domain.rjb_km[1];
  keys.forEach((key, i) => {
    const people = cells.index.get(key)!;
    const [lon, lat] = cellCentre(cells.grid, key);
    const rjb = joynerBoore(scenario, lon, lat);
    pop.total += people;
    if (rjb > maxR) { cellBands[i] = -1; pop.beyond += people; pop.outsideDomainCells += 1; return; }
    const g = groundMotion(model, 'pga', scenario.magnitude, rjb, scenario.vs30, scenario.mechanism);
    const central = bandOf(g.median);
    cellBands[i] = central;
    pop.central[central] += people;
    pop.low[bandOf(Math.exp(g.lnMedian - g.sigma))] += people;
    pop.high[bandOf(Math.exp(g.lnMedian + g.sigma))] += people;
  });
  const byCategory: ShakingResult['assets'] = {};
  for (const asset of assets) {
    const rjb = joynerBoore(scenario, ...asset.coordinates);
    const entry = byCategory[asset.category] ??= { low: new Array(nb).fill(0), central: new Array(nb).fill(0), high: new Array(nb).fill(0) };
    if (rjb > maxR) continue;
    const g = groundMotion(model, 'pga', scenario.magnitude, rjb, scenario.vs30, scenario.mechanism);
    entry.central[bandOf(g.median)] += 1;
    entry.low[bandOf(Math.exp(g.lnMedian - g.sigma))] += 1;
    entry.high[bandOf(Math.exp(g.lnMedian + g.sigma))] += 1;
  }
  const siteResults = sites.map(site => {
    const rjb = joynerBoore(scenario, site.longitude, site.latitude);
    if (rjb > maxR) return { ...site, rjb, median: null, low: null, high: null, sigma: null };
    const g = groundMotion(model, 'pga', scenario.magnitude, rjb, scenario.vs30, scenario.mechanism);
    return { ...site, rjb, median: g.median, low: Math.exp(g.lnMedian - g.sigma), high: Math.exp(g.lnMedian + g.sigma), sigma: g.sigma };
  });
  return { scenario, maxDistanceKm: maxR, population: pop, assets: byCategory, cellBands, cellKeys: keys, sites: siteResults };
}
