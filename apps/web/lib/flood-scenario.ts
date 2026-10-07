import type { CorridorCatalogue, CorridorExposure, CorridorOrigin } from '../../../packages/contracts/model-release';
import type { QuakeScenario } from './earthquake';

export type HydrographShape = 'rectangular' | 'triangular';
export interface FloodScenario {
  kind: 'flood'; version: 1; origin: string; shape: HydrographShape;
  volume_m3: number; duration_s: number; peak_fraction: number;
  /** Declared celerity ensemble [minimum, central, maximum] in m/s, ordered min ≤ central ≤ max. */
  celerity_m_s: [number, number, number];
}
export const FLOOD_LIMITS = {
  volume_m3: [1_000, 500_000_000], duration_s: [600, 172_800], peak_fraction: [0.05, 0.95], celerity_m_s: [0.1, 10],
} as const;

export function validateFlood(s: FloodScenario, catalogue?: CorridorCatalogue): string[] {
  const e: string[] = [];
  const within = (v: number, [a, b]: readonly [number, number]) => Number.isFinite(v) && v >= a && v <= b;
  if (!within(s.volume_m3, FLOOD_LIMITS.volume_m3)) e.push('Release volume must be 1,000–500,000,000 m³ (declared demonstration bounds).');
  if (!within(s.duration_s, FLOOD_LIMITS.duration_s)) e.push('Release duration must be 10 minutes to 48 hours.');
  if (s.shape === 'triangular' && !within(s.peak_fraction, FLOOD_LIMITS.peak_fraction)) e.push('Time to peak must be 5–95% of the duration.');
  const [lo, mid, hi] = s.celerity_m_s;
  if (![lo, mid, hi].every(v => within(v, FLOOD_LIMITS.celerity_m_s))) e.push('Each assumed celerity must be 0.1–10 m/s.');
  else if (!(lo <= mid && mid <= hi)) e.push('Celerities must be ordered: minimum ≤ central ≤ maximum.');
  if (catalogue && !catalogue.origins.some(o => o.id === s.origin)) e.push('Release point is not in the verified corridor catalogue.');
  return e;
}

/** Release hydrograph at the source. Both shapes conserve volume exactly: ∫Q dt = V. */
export function hydrograph(s: FloodScenario) {
  const T = s.duration_s;
  if (s.shape === 'rectangular') {
    const q = s.volume_m3 / T;
    return { peak_m3_s: q, time_to_peak_s: 0, points: [[0, 0], [0, q], [T, q], [T, 0]] as [number, number][] };
  }
  const tp = s.peak_fraction * T, qp = 2 * s.volume_m3 / T;
  return { peak_m3_s: qp, time_to_peak_s: tp, points: [[0, 0], [tp, qp], [T, 0]] as [number, number][] };
}
export function hydrographVolume(points: [number, number][]) {
  let v = 0;
  for (let i = 1; i < points.length; i++) v += (points[i][0] - points[i - 1][0]) * (points[i][1] + points[i - 1][1]) / 2;
  return v;
}

export interface Arrival { distance_km: number; front_s: [number, number, number]; peak_s: [number, number, number]; end_s: [number, number, number] }
/** Pure translation at each declared celerity (no attenuation): earliest uses the fastest celerity. */
export function arrivals(s: FloodScenario, distance_km: number): Arrival {
  const [lo, mid, hi] = s.celerity_m_s;
  const t = (c: number) => 1000 * distance_km / c;
  const front: [number, number, number] = [t(hi), t(mid), t(lo)];
  const shift = s.shape === 'triangular' ? s.peak_fraction * s.duration_s : 0;
  return { distance_km, front_s: front, peak_s: front.map(v => v + shift) as [number, number, number], end_s: front.map(v => v + s.duration_s) as [number, number, number] };
}

export interface ExposureRange {
  population: { min: number | null; max: number | null; central: number | null; partial: boolean; unknownAreaMax: number };
  assets: { min: number; max: number; central: number };
  categories: Record<string, { min: number; max: number }>;
}
/** Range across declared corridor half-widths — a sensitivity range, not a confidence interval. */
export function exposureRange(row: Record<string, CorridorExposure>, widths: number[], central = 500): ExposureRange {
  const items = widths.map(w => row[String(w)]);
  const known = items.map(i => i.population_known);
  const numbers = known.filter((v): v is number => v !== null);
  const centralItem = row[String(central)] ?? items[Math.floor(items.length / 2)];
  const categories: ExposureRange['categories'] = {};
  for (const key of Object.keys(items[0].categories)) categories[key] = { min: Math.min(...items.map(i => i.categories[key])), max: Math.max(...items.map(i => i.categories[key])) };
  return {
    population: { min: numbers.length ? Math.min(...numbers) : null, max: numbers.length ? Math.max(...numbers) : null, central: centralItem.population_known,
      partial: items.some(i => i.population_total === null), unknownAreaMax: Math.max(...items.map(i => i.unknown_area_km2)) },
    assets: { min: Math.min(...items.map(i => i.unique_assets)), max: Math.max(...items.map(i => i.unique_assets)), central: centralItem.unique_assets },
    categories,
  };
}

export function defaultFlood(origin: CorridorOrigin): FloodScenario {
  return { kind: 'flood', version: 1, origin: origin.id, shape: 'triangular', volume_m3: 10_000_000, duration_s: 3 * 3600, peak_fraction: 0.25, celerity_m_s: [2, 4, 6] };
}

export type Scenario = FloodScenario | QuakeScenario;
const b64 = (text: string) => btoa(String.fromCharCode(...new TextEncoder().encode(text))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const unb64 = (text: string) => new TextDecoder('utf-8', { fatal: true }).decode(Uint8Array.from(atob(text.replace(/-/g, '+').replace(/_/g, '/')), c => c.charCodeAt(0)));
/** Shareable, account-free state: the full scenario definition lives in the URL query. */
export function encodeScenario(s: Scenario) { return b64(JSON.stringify(s)); }
export function decodeScenario(value: string): Scenario | null {
  if (value.length > 2048) return null;
  try {
    const s = JSON.parse(unb64(value)) as Scenario;
    if (s?.version !== 1) return null;
    if (s.kind === 'flood' && typeof s.origin === 'string' && (s.shape === 'rectangular' || s.shape === 'triangular') && Array.isArray(s.celerity_m_s) && s.celerity_m_s.length === 3
      && [s.volume_m3, s.duration_s, s.peak_fraction, ...s.celerity_m_s].every(v => typeof v === 'number' && Number.isFinite(v))) return { kind: 'flood', version: 1, origin: s.origin, shape: s.shape, volume_m3: s.volume_m3, duration_s: s.duration_s, peak_fraction: s.peak_fraction, celerity_m_s: [s.celerity_m_s[0], s.celerity_m_s[1], s.celerity_m_s[2]] };
    if (s.kind === 'earthquake' && [s.longitude, s.latitude, s.magnitude, s.vs30].every(v => typeof v === 'number' && Number.isFinite(v)) && typeof s.mechanism === 'string'
      && s.rupture && (s.rupture.type === 'point' || (s.rupture.type === 'line' && Number.isFinite(s.rupture.length_km) && Number.isFinite(s.rupture.strike_deg)))) {
      return { kind: 'earthquake', version: 1, preset: typeof s.preset === 'string' ? s.preset : null, longitude: s.longitude, latitude: s.latitude, magnitude: s.magnitude, mechanism: s.mechanism, vs30: s.vs30,
        rupture: s.rupture.type === 'point' ? { type: 'point' } : { type: 'line', length_km: s.rupture.length_km, strike_deg: s.rupture.strike_deg } };
    }
  } catch { return null; }
  return null;
}

/** Compact table form: 24m, 1h09, 2d 03h. */
export function shortDuration(seconds: number) {
  if (!Number.isFinite(seconds)) return 'UNKNOWN';
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60), m = minutes % 60;
  if (h < 48) return `${h}h${String(m).padStart(2, '0')}`;
  return `${Math.floor(h / 24)}d ${String(h % 24).padStart(2, '0')}h`;
}

export function formatDuration(seconds: number) {
  if (!Number.isFinite(seconds)) return 'UNKNOWN';
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60), m = minutes % 60;
  return h < 48 ? `${h} h ${String(m).padStart(2, '0')} min` : `${(seconds / 86400).toFixed(1)} days`;
}
