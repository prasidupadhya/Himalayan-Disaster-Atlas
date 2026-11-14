import { c, esc, num, duration, load } from './app.js';
import { baseMap, maplibregl } from './basemap.js';
import * as M from './models.js';

const form = document.getElementById('form'), out = document.getElementById('result');
const BAND_COLORS = ['#fff3c4', '#ffd57a', '#ffab45', '#f4743b', '#d7402b', '#8f1d21'];
const bandLabel = i => i === M.PGA_BANDS.length - 1 ? `≥ ${num(M.PGA_BANDS[i], 2)} g` : `${num(M.PGA_BANDS[i], 2)}–${num(M.PGA_BANDS[i + 1], 2)} g`;
const empty = { type: 'FeatureCollection', features: [] };
const field = (name, label, value, attrs = '') => `<label class="field"><span>${esc(label)}</span><input name="${name}" value="${esc(value)}" inputmode="decimal" ${attrs}></label>`;
const select = (name, label, options, value) => `<label class="field"><span>${esc(label)}</span><select name="${name}">${options.map(([v, t]) => `<option value="${esc(v)}"${String(v) === String(value) ? ' selected' : ''}>${esc(t)}</option>`).join('')}</select></label>`;
const range = (a, b, f = num) => a === b ? f(a) : `${f(a)}–${f(b)}`;
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

const map = await baseMap('map', ['Rivers: HydroRIVERS / FAO', 'Lakes: Glacial Lake Observatory', 'Population: Meta & CIESIN HRSL', 'Ground motion: BSSA14']);
for (const id of ['path', 'rupture', 'points']) map.addSource(id, { type: 'geojson', data: empty });
map.addLayer({ id: 'path', type: 'line', source: 'path', paint: { 'line-color': '#ffd400', 'line-width': 5 }, layout: { 'line-cap': 'round' } });
map.addLayer({ id: 'rupture', type: 'line', source: 'rupture', paint: { 'line-color': '#13212b', 'line-width': 4 } });
map.addLayer({ id: 'points', type: 'circle', source: 'points', paint: { 'circle-radius': ['get', 'r'], 'circle-color': ['get', 'fill'], 'circle-stroke-color': '#fff', 'circle-stroke-width': 2 } });
const set = (id, features) => map.getSource(id).setData({ type: 'FeatureCollection', features });
const point = (coordinates, fill, r = 6) => ({ type: 'Feature', geometry: { type: 'Point', coordinates }, properties: { fill, r } });
const params = () => new URLSearchParams(location.hash.slice(1));
/** Puts the inputs in the link (shareable); an unchanged link still re-runs. */
const go = hash => { if (`#${hash}` === location.hash) route(); else location.hash = hash; };
const fit = (coords, maxZoom = 9) => { const b = coords.reduce((b, p) => b.extend(p), new maplibregl.LngLatBounds(coords[0], coords[0])); map.fitBounds(b, { padding: 40, maxZoom, duration: reduced ? 0 : 800 }); };
let mode = null, stop = () => {};

// ---------- Flood or lake outburst ----------
const catalogue = load('/data/atlas-flood-corridors/1.0.0/catalogue.json.gz');
async function flood() {
  const cat = await catalogue, q = params(), o = cat.origins.find(o => o.id === q.get('flood')) ?? cat.origins[0];
  const s = { origin: o.id, shape: q.get('shape') ?? 'triangular', volume_m3: +(q.get('v') ?? 1e7), duration_s: +(q.get('h') ?? 3) * 3600, peak_fraction: +(q.get('p') ?? 25) / 100, celerity_m_s: (q.get('c') ?? '2,4,6').split(',').map(Number) };
  // Stream names are the nearest GeoNames point, for orientation only.
  const near = o => o.gazetteer_hint?.name ? ` · ${c.near(o.gazetteer_hint.name)}` : '';
  const label = o => o.lake ? `${o.lake.basin} · ${num(o.lake.area_km2, 2)} km² · ${num(o.lake.elevation_mean_m)} m${near(o)}` : `${c.reach(o.start_reach)}${near(o)}`;
  const group = (name, list) => `<optgroup label="${esc(name)}">${list.map(x => `<option value="${esc(x.id)}"${x.id === s.origin ? ' selected' : ''}>${esc(label(x))}</option>`).join('')}</optgroup>`;
  form.innerHTML = `<label class="field"><span>${esc(c.origin)}</span><select name="origin">${group(c.lakeOrigins, cat.origins.filter(o => o.lake))}${group(c.riverOrigins, cat.origins.filter(o => !o.lake))}</select></label>`
    + field('v', `${c.volume}, m³`, s.volume_m3) + field('h', `${c.duration}, h`, s.duration_s / 3600)
    + select('shape', c.shape, [['triangular', c.triangular], ['rectangular', c.rectangular]], s.shape)
    + field('p', `${c.peakAt}, %`, Math.round(s.peak_fraction * 100), s.shape === 'rectangular' ? 'disabled' : '')
    + `<fieldset class="field" style="border:0;padding:0;margin:0 0 14px"><legend style="font-weight:600;padding:0 0 4px">${esc(c.speed)}, m/s</legend><div class="row3">${s.celerity_m_s.map((v, i) => `<input name="c${i}" value="${v}" inputmode="decimal" aria-label="${esc(c.speed)} ${i + 1}">`).join('')}</div></fieldset>`
    + `<div class="actions"><button class="primary">${esc(c.run)}</button><button type="button" id="share">${esc(c.share)}</button></div>`;
  form.shape.onchange = () => { form.p.disabled = form.shape.value === 'rectangular'; };
  form.onsubmit = e => { e.preventDefault(); const f = form;
    go(new URLSearchParams({ flood: f.origin.value, v: f.v.value, h: f.h.value, shape: f.shape.value, p: f.p.value, c: [f.c0.value, f.c1.value, f.c2.value].join(',') }).toString()); };
  const errors = M.validateFlood(s);
  form.querySelectorAll('input').forEach(i => i.removeAttribute('aria-invalid'));
  if (errors.length) { errors.forEach(e => (e === 'celerity' ? ['c0', 'c1', 'c2'] : [{ volume: 'v', duration: 'h', peak: 'p' }[e]]).forEach(n => form[n].setAttribute('aria-invalid', 'true')));
    out.innerHTML = `<p class="note bad" role="alert">${errors.map(e => esc(c.errors[e])).join('<br>')}</p>`; return; }

  const hg = M.hydrograph(s), t = ([a, , b]) => range(a, b, duration);
  const rows = o.checkpoints.map(cp => { const a = M.arrivals(s, cp.prefix_km), x = M.exposureRange(cp.by_width);
    return `<tr><td class="n">${num(cp.prefix_km)} km</td><td>${t(a.front)}</td><td class="wide">${t(a.peak)}</td><td class="wide">${t(a.end)}</td><td class="n">${x.population ? range(Math.round(x.population[0]), Math.round(x.population[1])) : c.unknown}${x.partial ? '*' : ''}</td><td class="n">${range(...x.assets)}</td></tr>`; });
  out.innerHTML = `<div class="tiles"><div class="tile"><span class="label">${esc(c.peakFlow)}</span><span class="big">${num(hg.peak_m3_s)}</span><span>m³/s</span></div>
    <div class="tile"><span class="label">${esc(c.pathLen)}</span><span class="big">${num(o.path_length_km)}</span><span>km</span></div></div>
    <p id="clock" class="muted" aria-hidden="true"></p>
    <div class="scroll" tabindex="0"><table><thead><tr><th class="n">${esc(c.checkpoint)}</th><th>${esc(c.arrives)}</th><th class="wide">${esc(c.peaks)}</th><th class="wide">${esc(c.ends)}</th><th class="n">${esc(c.people)}</th><th class="n">${esc(c.assets)}</th></tr></thead><tbody>${rows.join('')}</tbody></table></div>
    <p class="src">${esc(c.range)} ${o.checkpoints.some(cp => M.exposureRange(cp.by_width).partial) ? esc(c.partial) : ''}</p><p class="note">${esc(c.floodLimits)}</p>`;

  const line = o.line.coordinates;
  if (map.getLayer('shaking-img')) map.setLayoutProperty('shaking-img', 'visibility', 'none');
  set('rupture', []);
  set('path', [{ type: 'Feature', geometry: o.line, properties: {} }]);
  const marks = [point(o.lake ? [o.lake.longitude, o.lake.latitude] : o.start_coordinates, '#0f9db3', 8), ...o.checkpoints.map(cp => point(cp.end_coordinates, '#13212b', 5))];
  set('points', marks); fit(line);
  // Play the central-speed pulse front down the path (about 8 seconds for the whole run).
  stop();
  if (reduced) return;
  const seg = line.slice(1).map((p, i) => M.greatCircleKm(...line[i], ...p)), total = seg.reduce((a, b) => a + b, 0), start = performance.now(), clock = document.getElementById('clock');
  let frame = requestAnimationFrame(function step(now) {
    const f = Math.min(1, (now - start) / 8000); let d = f * total, i = 0;
    while (i < seg.length - 1 && d > seg[i]) d -= seg[i++];
    const k = seg[i] ? d / seg[i] : 0, here = [line[i][0] + (line[i + 1][0] - line[i][0]) * k, line[i][1] + (line[i + 1][1] - line[i][1]) * k];
    set('points', [...marks, point(here, '#ffd400', 9)]);
    clock.textContent = `${duration(1000 * f * o.path_length_km / s.celerity_m_s[1])} · ${num(f * o.path_length_km)} km`;
    if (f < 1) frame = requestAnimationFrame(step);
  });
  stop = () => cancelAnimationFrame(frame);
}

// ---------- Earthquake shaking ----------
const quakeData = Promise.all([load('/data/atlas-gmpe-bssa14/1.0.0/model.json'), load('/data/nepal-hrsl-population/1.0.0/grid.json.gz'), load('/data/nepal-region-earthquakes/1.0.0/features.geojson.gz'), load('/data/nepal-admin-districts/2.0.1/features.geojson.gz')])
  .then(([model, grid, events, districts]) => ({ model, cells: M.populationCells(grid), districts: districts.features,
    presets: events.features.filter(f => f.properties.magnitude >= 6 && f.properties.magnitude <= 8.5).sort((a, b) => b.properties.magnitude - a.properties.magnitude).slice(0, 10) }));
async function quake() {
  const { model, cells, presets, districts } = await quakeData, q = params();
  const pick = presets.find(f => f.properties.source_id === (q.get('preset') ?? 'us20002926')) ?? presets[0];
  const s = q.has('lon') ? { longitude: +q.get('lon'), latitude: +q.get('lat'), magnitude: +q.get('m'), mechanism: q.get('mech'), vs30: +q.get('vs30'), length_km: +q.get('len') || 0, strike_deg: +q.get('strike') || 0 }
    : { longitude: pick.geometry.coordinates[0], latitude: pick.geometry.coordinates[1], magnitude: pick.properties.magnitude, mechanism: 'unspecified', vs30: 760, length_km: 0, strike_deg: 0 };
  const presetLabel = f => `M${f.properties.magnitude} · ${f.properties.event_time.slice(0, 10)} · ${f.properties.place_name}`;
  form.innerHTML = select('preset', c.preset, [['', c.custom], ...presets.map(f => [f.properties.source_id, presetLabel(f)])], q.has('lon') ? '' : pick.properties.source_id)
    + `<p class="muted">${esc(c.pickHint)}</p><div class="row2">${field('lon', `${c.lon}, °E`, s.longitude)}${field('lat', `${c.lat}, °N`, s.latitude)}</div>`
    + field('m', c.magnitude, s.magnitude)
    + select('mech', c.mech, M.MECHANISMS.map(m => [m, c.mechs[m]]), s.mechanism) + select('vs30', c.vs30, M.VS30.map(v => [v, c.soils[v]]), s.vs30)
    + `<div class="row2">${field('len', c.rupture, s.length_km)}${field('strike', c.strike, s.strike_deg)}</div>`
    + `<div class="actions"><button class="primary">${esc(c.run)}</button><button type="button" id="share">${esc(c.share)}</button></div>`;
  form.preset.onchange = () => { location.hash = form.preset.value ? `quake&preset=${form.preset.value}` : location.hash; };
  form.onsubmit = e => { e.preventDefault(); const f = form;
    go('quake&' + new URLSearchParams({ lon: f.lon.value, lat: f.lat.value, m: f.m.value, mech: f.mech.value, vs30: f.vs30.value, len: f.len.value, strike: f.strike.value })); };
  const errors = M.validateQuake(model, s);
  if (errors.length) { out.innerHTML = `<p class="note bad" role="alert">${errors.map(e => esc(c.errors[e])).join('<br>')}</p>`; return; }

  const r = M.peopleByBand(model, s, cells);
  const sites = districts.map(f => ({ name: f.properties.name, p: M.pgaAt(model, s, f.properties.label_longitude, f.properties.label_latitude) })).filter(x => x.p).sort((a, b) => b.p[1] - a.p[1]).slice(0, 8);
  const g = v => num(v, v < 0.1 ? 3 : 2);
  out.innerHTML = `<h2>${esc(c.pgaTitle)}</h2><div class="legend">${M.PGA_BANDS.map((_, i) => `<span><i style="background:${BAND_COLORS[i]}"></i>${bandLabel(i)}</span>`).join('')}</div>
    <div class="scroll" tabindex="0"><table><caption>${esc(c.peopleBand)}</caption><thead><tr><th>${esc(c.band)}</th><th class="n">${esc(c.pLow)}</th><th class="n">${esc(c.pMid)}</th><th class="n">${esc(c.pHigh)}</th></tr></thead><tbody>
    ${M.PGA_BANDS.map((_, i) => `<tr><td>${bandLabel(i)}</td><td class="n">${num(r.low[i])}</td><td class="n"><strong>${num(r.median[i])}</strong></td><td class="n">${num(r.high[i])}</td></tr>`).reverse().join('')}
    ${r.beyond ? `<tr><td>${esc(c.beyond)}</td><td class="n" colspan="3">${num(r.beyond)}</td></tr>` : ''}</tbody></table></div>
    <div class="scroll" tabindex="0" style="margin-top:12px"><table><caption>${esc(c.strongest)}</caption><thead><tr><th>${esc(c.district)}</th><th class="n">${esc(c.pga)}</th></tr></thead><tbody>
    ${sites.map(x => `<tr><td>${esc(x.name)}</td><td class="n"><strong>${g(x.p[1])}</strong> <small>(${g(x.p[0])}–${g(x.p[2])})</small></td></tr>`).join('')}</tbody></table></div>
    <p class="note">${esc(c.quakeLimits)}</p>`;

  // Shaking image: each pixel is the band of the middle case at its centre (rows spaced evenly in map projection).
  const W = 380, H = 224, west = 79.5, east = 89, south = 25.6, north = 31.2, y = lat => Math.log(Math.tan(Math.PI / 4 + lat * Math.PI / 360));
  const canvas = Object.assign(document.createElement('canvas'), { width: W, height: H }), ctx = canvas.getContext('2d');
  for (let j = 0; j < H; j++) {
    const lat = Math.atan(Math.sinh(y(north) - (j + 0.5) / H * (y(north) - y(south)))) * 180 / Math.PI;
    for (let i = 0; i < W; i++) {
      const p = M.pgaAt(model, s, west + (i + 0.5) / W * (east - west), lat), band = p ? M.bandOf(p[1]) : 0;
      if (band > 0) { ctx.fillStyle = BAND_COLORS[band]; ctx.fillRect(i, j, 1, 1); }
    }
  }
  const image = { url: canvas.toDataURL(), coordinates: [[west, north], [east, north], [east, south], [west, south]] };
  if (map.getSource('shaking-img')) map.getSource('shaking-img').updateImage(image);
  else { map.addSource('shaking-img', { type: 'image', ...image }); map.addLayer({ id: 'shaking-img', type: 'raster', source: 'shaking-img', paint: { 'raster-opacity': 0.6, 'raster-resampling': 'nearest' } }, 'path'); }
  map.setLayoutProperty('shaking-img', 'visibility', 'visible');
  stop(); set('path', []);
  set('rupture', s.length_km ? [{ type: 'Feature', geometry: { type: 'LineString', coordinates: M.ruptureLine(s) }, properties: {} }] : []);
  set('points', [point([s.longitude, s.latitude], '#d93a2b', 8)]);
  fit([[s.longitude - 2.5, s.latitude - 2], [s.longitude + 2.5, s.latitude + 2]], 7);
}

map.on('click', e => {
  if (mode !== 'quake') return;
  form.lon.value = e.lngLat.lng.toFixed(3); form.lat.value = e.lngLat.lat.toFixed(3); form.preset.value = ''; form.requestSubmit();
});
async function route() {
  mode = location.hash.startsWith('#quake') ? 'quake' : 'flood';
  for (const k of ['flood', 'quake']) document.getElementById(`tab-${k}`).setAttribute('aria-selected', String(k === mode));
  out.innerHTML = `<p>${esc(c.loading)}</p>`;
  try { await (mode === 'quake' ? quake() : flood()); } catch (e) { console.error(e); out.innerHTML = `<p class="note bad" role="alert">${esc(c.failed)}</p>`; }
  document.getElementById('share')?.addEventListener('click', async ev => { try { await navigator.clipboard.writeText(location.href); ev.target.textContent = c.copiedLink; } catch {} });
  document.getElementById('map').dataset.ready = 'true';
}
document.getElementById('tab-flood').onclick = () => { location.hash = 'flood'; };
document.getElementById('tab-quake').onclick = () => { location.hash = 'quake'; };
addEventListener('hashchange', route);
route();
