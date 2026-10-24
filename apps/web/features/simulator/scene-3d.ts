/* Geometry for the 3D scenario playback. Pure functions over lon/lat; distances are great-circle km. */

export type LonLat = [number, number];
const R = 6371.0088;
const rad = (d: number) => d * Math.PI / 180;

export function haversineKm(a: LonLat, b: LonLat) {
  const dLat = rad(b[1] - a[1]), dLon = rad(b[0] - a[0]);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a[1])) * Math.cos(rad(b[1])) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)));
}

/** Initial compass bearing from a to b, degrees clockwise from north. */
export function bearing(a: LonLat, b: LonLat) {
  const y = Math.sin(rad(b[0] - a[0])) * Math.cos(rad(b[1]));
  const x = Math.cos(rad(a[1])) * Math.sin(rad(b[1])) - Math.sin(rad(a[1])) * Math.cos(rad(b[1])) * Math.cos(rad(b[0] - a[0]));
  return (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;
}

/** Flattens a LineString or MultiLineString into one ordered coordinate list. */
export function lineCoordinates(geometry: GeoJSON.Geometry | null | undefined): LonLat[] {
  if (!geometry) return [];
  if (geometry.type === 'LineString') return geometry.coordinates.map(c => [c[0], c[1]]);
  if (geometry.type === 'MultiLineString') return geometry.coordinates.flat().map(c => [c[0], c[1]]);
  return [];
}

export interface Measured { coords: LonLat[]; cumulative: number[]; length: number }
export function measure(coords: LonLat[]): Measured {
  const cumulative = [0];
  for (let i = 1; i < coords.length; i++) cumulative.push(cumulative[i - 1] + haversineKm(coords[i - 1], coords[i]));
  return { coords, cumulative, length: cumulative.at(-1) ?? 0 };
}

/** The point at `km` along the line (clamped to its ends). */
export function pointAt(line: Measured, km: number): LonLat {
  const { coords, cumulative } = line;
  if (coords.length === 0) return [0, 0];
  if (km <= 0) return coords[0];
  if (km >= line.length) return coords.at(-1)!;
  let lo = 0, hi = cumulative.length - 1;
  while (hi - lo > 1) { const mid = (lo + hi) >> 1; if (cumulative[mid] <= km) lo = mid; else hi = mid; }
  const span = cumulative[hi] - cumulative[lo] || 1, f = (km - cumulative[lo]) / span;
  return [coords[lo][0] + (coords[hi][0] - coords[lo][0]) * f, coords[lo][1] + (coords[hi][1] - coords[lo][1]) * f];
}

/** The part of the line between two distances, including both cut points; empty when the span is empty. */
export function slice(line: Measured, fromKm: number, toKm: number): LonLat[] {
  const a = Math.max(0, Math.min(fromKm, toKm)), b = Math.min(line.length, Math.max(fromKm, toKm));
  if (b - a <= 1e-6 || line.coords.length < 2) return [];
  const out: LonLat[] = [pointAt(line, a)];
  for (let i = 0; i < line.coords.length; i++) if (line.cumulative[i] > a && line.cumulative[i] < b) out.push(line.coords[i]);
  out.push(pointAt(line, b));
  return out;
}

/** Direction of travel at `km`, looking a few km ahead so the camera does not swing with every river bend. */
export function headingAt(line: Measured, km: number, lookKm = 6) {
  const from = pointAt(line, Math.max(0, km - lookKm / 3)), to = pointAt(line, Math.min(line.length, km + lookKm));
  return from[0] === to[0] && from[1] === to[1] ? 0 : bearing(from, to);
}

/** A circle of radius `km` around a centre, as a closed polygon ring. */
export function circle(center: LonLat, km: number, steps = 96): LonLat[] {
  const ring: LonLat[] = [], d = km / R, lat = rad(center[1]), lon = rad(center[0]);
  for (let i = 0; i <= steps; i++) {
    const b = 2 * Math.PI * i / steps;
    const lat2 = Math.asin(Math.sin(lat) * Math.cos(d) + Math.cos(lat) * Math.sin(d) * Math.cos(b));
    const lon2 = lon + Math.atan2(Math.sin(b) * Math.sin(d) * Math.cos(lat), Math.cos(d) - Math.sin(lat) * Math.sin(lat2));
    ring.push([lon2 * 180 / Math.PI, lat2 * 180 / Math.PI]);
  }
  return ring;
}

/** Where the declared pulse is at time t (s after release), in model km along the path, for one celerity (m/s). */
export function pulseAt(t: number, celerity: number, duration: number, pathKm: number) {
  const head = Math.min(pathKm, Math.max(0, celerity * t / 1000));
  const tail = Math.min(pathKm, Math.max(0, celerity * (t - duration) / 1000));
  return { head, tail };
}

/** Seconds until the slowest declared front has passed the end of the path. */
export function floodPlaybackSeconds(celerities: [number, number, number], duration: number, pathKm: number) {
  return pathKm * 1000 / Math.min(...celerities) + duration;
}
