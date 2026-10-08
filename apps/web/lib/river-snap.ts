const EARTH_M = 6371008.8;
const RAD = Math.PI / 180;

function metresBetween(lon1: number, lat1: number, lon2: number, lat2: number) {
  const a = Math.sin((lat2 - lat1) * RAD / 2) ** 2 + Math.cos(lat1 * RAD) * Math.cos(lat2 * RAD) * Math.sin((lon2 - lon1) * RAD / 2) ** 2;
  return 2 * EARTH_M * Math.asin(Math.min(1, Math.sqrt(a)));
}

function segmentClosest(lon: number, lat: number, a: [number, number], b: [number, number]): [number, number] {
  const kx = Math.cos(lat * RAD);
  const ax = (a[0] - lon) * kx, ay = a[1] - lat, bx = (b[0] - lon) * kx, by = b[1] - lat;
  const dx = bx - ax, dy = by - ay;
  const length = dx * dx + dy * dy;
  const t = length === 0 ? 0 : Math.max(0, Math.min(1, -(ax * dx + ay * dy) / length));
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
}

/** Nearest reach to a point, by great-circle distance to its closest segment. The result is a candidate, not an identity. */
export function nearestReach(features: GeoJSON.Feature[], lon: number, lat: number): { id: string; metres: number } | null {
  let best: { id: string; metres: number } | null = null;
  for (const feature of features) {
    if (feature.id === undefined) continue;
    const lines = feature.geometry.type === 'LineString' ? [feature.geometry.coordinates as [number, number][]]
      : feature.geometry.type === 'MultiLineString' ? feature.geometry.coordinates as [number, number][][] : [];
    for (const line of lines) for (let i = 1; i < line.length; i++) {
      const [cx, cy] = segmentClosest(lon, lat, line[i - 1], line[i]);
      const metres = metresBetween(lon, lat, cx, cy);
      if (!best || metres < best.metres) best = { id: String(feature.id), metres };
    }
  }
  return best;
}
