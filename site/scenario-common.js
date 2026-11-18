// What the Scenarios page and its printable report share: reading the inputs from the link, the shaking colours,
// the release hydrograph chart and the shaking grid. The science itself is in models.js.
import { c, esc, num, duration, load } from './app.js';
import * as M from './models.js';

/** A number typed in either digit set, with thousands separators allowed; NaN when empty. */
export const parse = v => { const t = String(v ?? '').replace(/[०-९]/g, d => '०१२३४५६७८९'.indexOf(d)).replace(/[,\s]/g, ''); return t === '' ? NaN : +t; };

/** Flood inputs from the link, with the page's defaults. */
export function floodInputs(q, origins) {
  const o = origins.find(o => o.id === q.get('flood')) ?? origins[0], speeds = (q.get('c') ?? '2,4,6').split(',');
  const s = { origin: o.id, shape: q.get('shape') === 'rectangular' ? 'rectangular' : 'triangular', volume_m3: parse(q.get('v') ?? 1e7), duration_s: parse(q.get('h') ?? 3) * 3600,
    peak_fraction: parse(q.get('p') ?? 25) / 100, celerity_m_s: [0, 1, 2].map(i => parse(speeds[i])) };
  return { o, s, speeds };
}

/** A release point as the reader knows it. Stream names are the nearest GeoNames point, for orientation only. */
export function originLabel(o) {
  const near = o.gazetteer_hint?.name ? `, ${c.near(o.gazetteer_hint.name)}` : '';
  return o.lake ? `${o.lake.basin}, ${num(o.lake.area_km2, 2)} km², ${num(o.lake.elevation_mean_m)} m${near}` : `${c.reach(o.start_reach)}${near}`;
}
export const presetLabel = f => `M${f.properties.magnitude}, ${f.properties.event_time.slice(0, 10)}, ${f.properties.place_name}`;

/** The ten largest past events (M6 to M8.5) offered as presets, the population grid and the ground-motion model. */
export const loadQuakeData = () => Promise.all(['/data/atlas-gmpe-bssa14/1.0.0/model.json', '/data/nepal-hrsl-population/1.0.0/grid.json.gz', '/data/nepal-region-earthquakes/1.0.0/features.geojson.gz'].map(u => load(u)))
  .then(([model, grid, events]) => ({ model, cells: M.populationCells(grid),
    presets: events.features.filter(f => f.properties.magnitude >= 6 && f.properties.magnitude <= 8.5).sort((a, b) => b.properties.magnitude - a.properties.magnitude).slice(0, 10) }));

/** Earthquake inputs from the link: a preset event, or custom values. */
export function quakeInputs(q, presets) {
  const pick = presets.find(f => f.properties.source_id === (q.get('preset') ?? 'us20002926')) ?? presets[0];
  const s = q.has('lon') ? { longitude: parse(q.get('lon')), latitude: parse(q.get('lat')), magnitude: parse(q.get('m')), mechanism: q.get('mech'), vs30: parse(q.get('vs30')), length_km: parse(q.get('len')), strike_deg: parse(q.get('strike')) }
    : { longitude: pick.geometry.coordinates[0], latitude: pick.geometry.coordinates[1], magnitude: pick.properties.magnitude, mechanism: 'unspecified', vs30: 760, length_km: 0, strike_deg: 0 };
  return { pick, s };
}

export const BAND_COLORS = ['', '#ffd57a', '#ffab45', '#f4743b', '#d7402b', '#8f1d21'], BEYOND = '#8a959c';
export const bandLabel = i => i === M.PGA_BANDS.length - 1 ? `≥ ${num(M.PGA_BANDS[i], 2)} g` : i === 0 ? `< ${num(M.PGA_BANDS[1], 2)} g` : `${num(M.PGA_BANDS[i], 2)}–${num(M.PGA_BANDS[i + 1], 2)} g`;

/** The release hydrograph at the source as a small line chart: hours across, m³/s up. */
export function hydrographChart(points, peak, title) {
  const W = 320, H = 120, T = points.at(-1)[0], x = t => (t / T * W).toFixed(1), y = q => (H - q / peak * (H - 8)).toFixed(1);
  return `<figure class="chart"><figcaption>${esc(title)}</figcaption><svg viewBox="-36 -6 ${W + 44} ${H + 26}" role="img" aria-label="${esc(title)}">
    <path class="axis" d="M0 0V${H}H${W}"/><path class="line" d="M${points.map(([t, q]) => `${x(t)} ${y(q)}`).join('L')}"/>
    <text x="-6" y="12" text-anchor="end">${num(peak)}</text><text x="-6" y="${H}" text-anchor="end">0</text>
    <text x="0" y="${H + 18}">0 h</text><text x="${W}" y="${H + 18}" text-anchor="end">${esc(duration(T))}</text></svg></figure>`;
}

/**
 * Shaking grid over the whole map area: for each pixel, the band of the middle case (255 beyond the model's range)
 * and its distance from the rupture. Rows are spaced evenly in map projection.
 */
export function shakeGrid(model, s, W, H) {
  const west = 78.8, east = 90, south = 22, north = 31.9, y = lat => Math.log(Math.tan(Math.PI / 4 + lat * Math.PI / 360));
  const band = new Uint8Array(W * H), dist = new Float32Array(W * H); let far = 0;
  for (let j = 0; j < H; j++) {
    const lat = Math.atan(Math.sinh(y(north) - (j + 0.5) / H * (y(north) - y(south)))) * 180 / Math.PI;
    for (let i = 0; i < W; i++) {
      const lon = west + (i + 0.5) / W * (east - west), p = M.pgaAt(model, s, lon, lat), k = j * W + i;
      band[k] = p ? M.bandOf(p[1]) : 255; dist[k] = M.rjb(s, lon, lat); far = Math.max(far, dist[k]);
    }
  }
  return { band, dist, far, extent: [[west, north], [east, north], [east, south], [west, south]] };
}

/** A colour as one 32-bit pixel (little-endian ABGR). */
export const pack = hex => (255 << 24 | parseInt(hex.slice(5, 7), 16) << 16 | parseInt(hex.slice(3, 5), 16) << 8 | parseInt(hex.slice(1, 3), 16)) >>> 0;
