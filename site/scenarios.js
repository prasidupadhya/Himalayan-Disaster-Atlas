import { c, esc, num, duration, load, failed } from './app.js';
import { baseMap, maplibregl } from './basemap.js';
import * as M from './models.js';

const form = document.getElementById('form'), out = document.getElementById('result'), status = document.getElementById('status');
const BAND_COLORS = ['', '#ffd57a', '#ffab45', '#f4743b', '#d7402b', '#8f1d21'], BEYOND = '#8a959c';
const bandLabel = i => i === M.PGA_BANDS.length - 1 ? `≥ ${num(M.PGA_BANDS[i], 2)} g` : i === 0 ? `< ${num(M.PGA_BANDS[1], 2)} g` : `${num(M.PGA_BANDS[i], 2)}–${num(M.PGA_BANDS[i + 1], 2)} g`;
const field = (name, label, value, attrs = '') => `<label class="field"><span>${esc(label)}</span><input name="${name}" value="${esc(value)}" inputmode="decimal" autocomplete="off" ${attrs}></label>`;
const select = (name, label, options, value) => `<label class="field"><span>${esc(label)}</span><select name="${name}">${options.map(([v, t]) => `<option value="${esc(v)}"${String(v) === String(value) ? ' selected' : ''}>${esc(t)}</option>`).join('')}</select></label>`;
const range = (a, b, f = num) => a === b ? f(a) : `${f(a)}–${f(b)}`;
/** Reads a typed number: Nepali digits, thousands separators and spaces are accepted; empty is not a number. */
const parse = v => { const t = String(v ?? '').replace(/[०-९]/g, d => '०१२३४५६७८९'.indexOf(d)).replace(/[,\s]/g, ''); return t === '' ? NaN : +t; };
const mark = (errors, fields) => { form.querySelectorAll('input').forEach(i => i.removeAttribute('aria-invalid')); errors.flatMap(e => fields[e] ?? []).forEach(n => form[n]?.setAttribute('aria-invalid', 'true')); };
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const params = () => new URLSearchParams(location.hash.slice(1));
/** Inputs live in the link (shareable); an unchanged link still re-runs. */
const go = hash => { if (`#${hash}` === location.hash) route(); else location.hash = hash; };

let map;
try { map = await baseMap('map', ['Rivers: HydroRIVERS / FAO', 'Lakes: Glacial Lake Observatory', 'Population: Meta & CIESIN HRSL', 'Ground motion: BSSA14']); }
catch { failed(out, () => location.reload()); throw new Error('map unavailable'); }
const empty = { type: 'FeatureCollection', features: [] };
for (const id of ['path', 'rupture', 'points']) map.addSource(id, { type: 'geojson', data: empty });
map.addLayer({ id: 'path', type: 'line', source: 'path', paint: { 'line-color': '#ffd400', 'line-width': 5 }, layout: { 'line-cap': 'round' } });
map.addLayer({ id: 'rupture', type: 'line', source: 'rupture', paint: { 'line-color': '#18232a', 'line-width': 4 } });
map.addLayer({ id: 'points', type: 'circle', source: 'points', paint: { 'circle-radius': ['get', 'r'], 'circle-color': ['get', 'fill'], 'circle-stroke-color': '#fff', 'circle-stroke-width': 2 } });
const set = (id, features) => map.getSource(id).setData({ type: 'FeatureCollection', features });
const point = (coordinates, fill, r = 6) => ({ type: 'Feature', geometry: { type: 'Point', coordinates }, properties: { fill, r } });
const fit = (coords, maxZoom = 9) => { const b = coords.reduce((b, p) => b.extend(p), new maplibregl.LngLatBounds(coords[0], coords[0])); map.fitBounds(b, { padding: 40, maxZoom, duration: reduced ? 0 : 800 }); };
let mode = null, seq = 0, stop = () => {};
/** Every run starts from a clean map, so an error never leaves an older result on screen. */
function clearMap() { stop(); stop = () => {}; ['path', 'rupture', 'points'].forEach(id => set(id, [])); if (map.getLayer('shaking-img')) map.setLayoutProperty('shaking-img', 'visibility', 'none'); }

// ---------- Flood or lake outburst ----------
const catalogue = load('/data/atlas-flood-corridors/1.0.0/catalogue.json.gz');
async function flood(run) {
  const cat = await catalogue;
  if (run !== seq) return;
  const q = params(), o = cat.origins.find(o => o.id === q.get('flood')) ?? cat.origins[0], speeds = (q.get('c') ?? '2,4,6').split(',');
  const s = { origin: o.id, shape: q.get('shape') === 'rectangular' ? 'rectangular' : 'triangular', volume_m3: parse(q.get('v') ?? 1e7), duration_s: parse(q.get('h') ?? 3) * 3600,
    peak_fraction: parse(q.get('p') ?? 25) / 100, celerity_m_s: [0, 1, 2].map(i => parse(speeds[i])) };
  // Stream names are the nearest GeoNames point, for orientation only.
  const near = o => o.gazetteer_hint?.name ? `, ${c.near(o.gazetteer_hint.name)}` : '';
  const label = o => o.lake ? `${o.lake.basin}, ${num(o.lake.area_km2, 2)} km², ${num(o.lake.elevation_mean_m)} m${near(o)}` : `${c.reach(o.start_reach)}${near(o)}`;
  const group = (name, list) => `<optgroup label="${esc(name)}">${list.map(x => `<option value="${esc(x.id)}"${x.id === s.origin ? ' selected' : ''}>${esc(label(x))}</option>`).join('')}</optgroup>`;
  form.innerHTML = `<label class="field"><span>${esc(c.origin)}</span><select name="origin">${group(c.lakeOrigins, cat.origins.filter(o => o.lake))}${group(c.riverOrigins, cat.origins.filter(o => !o.lake))}</select></label>`
    + `<div class="row2">${field('v', `${c.volume}, m³`, Number.isFinite(s.volume_m3) ? s.volume_m3.toLocaleString('en-US') : (q.get('v') ?? ''))}${field('h', `${c.duration}, h`, q.get('h') ?? 3)}</div>`
    + select('shape', c.shape, [['triangular', c.triangular], ['rectangular', c.rectangular]], s.shape)
    + field('p', `${c.peakAt}, %`, q.get('p') ?? 25, s.shape === 'rectangular' ? 'disabled' : '')
    + `<fieldset class="field" style="border:0;padding:0;margin:0 0 14px"><legend>${esc(c.speed)}, m/s</legend><div class="row3">${[0, 1, 2].map(i => `<input name="c${i}" value="${esc(speeds[i] ?? '')}" inputmode="decimal" aria-label="${esc(c.speeds[i])}">`).join('')}</div></fieldset>`
    + `<div class="actions"><button class="primary">${esc(c.run)}</button><button type="button" id="share">${esc(c.share)}</button></div>`;
  form.shape.onchange = () => { form.p.disabled = form.shape.value === 'rectangular'; };
  form.onsubmit = e => { e.preventDefault(); const f = form, n = x => String(parse(x));
    go(new URLSearchParams({ flood: f.origin.value, v: n(f.v.value), h: n(f.h.value), shape: f.shape.value, p: n(f.p.value), c: [f.c0, f.c1, f.c2].map(i => n(i.value)).join(',') }).toString()); };
  clearMap();
  const errors = M.validateFlood(s);
  mark(errors, { volume: ['v'], duration: ['h'], peak: ['p'], celerity: ['c0', 'c1', 'c2'] });
  if (errors.length) { out.innerHTML = `<p class="note bad" role="alert">${errors.map(e => esc(c.errors[e])).join('<br>')}</p>`; return; }

  const hg = M.hydrograph(s), t = ([a, , b]) => range(a, b, duration);
  const rows = o.checkpoints.map(cp => ({ cp, a: M.arrivals(s, cp.prefix_km), x: M.exposureRange(cp.by_width) }));
  out.innerHTML = `<p class="say">${c.floodSay(`<b>${num(hg.peak_m3_s)}</b>`, `<b>${num(o.path_length_km)}</b>`)}</p>
    <p class="clock" id="clock" aria-hidden="true"></p>
    <div class="scroll" tabindex="0"><table><thead><tr><th class="n">${esc(c.checkpoint)}</th><th>${esc(c.arrives)}</th><th class="wide">${esc(c.peaks)}</th><th class="wide">${esc(c.ends)}</th><th class="n">${esc(c.people)}</th><th class="n">${esc(c.assets)}</th></tr></thead><tbody>
    ${rows.map(({ cp, a, x }) => `<tr><td class="n">${num(cp.prefix_km)} km</td><td>${t(a.front)}</td><td class="wide">${t(a.peak)}</td><td class="wide">${t(a.end)}</td><td class="n">${x.population ? range(Math.round(x.population[0]), Math.round(x.population[1])) : esc(c.unknown)}${x.partial ? '*' : ''}</td><td class="n">${range(...x.assets)}</td></tr>`).join('')}</tbody></table></div>
    <p class="src">${esc(c.range)} ${rows.some(r => r.x.partial) ? esc(c.partial) : ''}</p><p class="note">${esc(c.floodLimits)}</p>`;

  const line = o.line.coordinates, marks = [point(o.lake ? [o.lake.longitude, o.lake.latitude] : o.start_coordinates, '#0f8fa6', 8), ...o.checkpoints.map(cp => point(cp.end_coordinates, '#18232a', 5))];
  set('path', [{ type: 'Feature', geometry: o.line, properties: {} }]); set('points', marks); fit(line);
  if (reduced) return;
  // Play the middle-speed pulse front down the path (about 8 seconds for the whole run).
  const seg = line.slice(1).map((p, i) => M.greatCircleKm(...line[i], ...p)), total = seg.reduce((a, b) => a + b, 0), start = performance.now(), clock = document.getElementById('clock');
  let frame = requestAnimationFrame(function step(now) {
    const f = Math.min(1, (now - start) / 8000); let d = f * total, i = 0;
    while (i < seg.length - 1 && d > seg[i]) d -= seg[i++];
    const k = seg[i] ? d / seg[i] : 0;
    set('points', [...marks, point([line[i][0] + (line[i + 1][0] - line[i][0]) * k, line[i][1] + (line[i + 1][1] - line[i][1]) * k], '#ffd400', 9)]);
    clock.textContent = c.clock(duration(1000 * f * o.path_length_km / s.celerity_m_s[1]), num(f * o.path_length_km));
    if (f < 1) frame = requestAnimationFrame(step);
  });
  stop = () => cancelAnimationFrame(frame);
}

// ---------- Earthquake shaking ----------
const quakeData = Promise.all(['/data/atlas-gmpe-bssa14/1.0.0/model.json', '/data/nepal-hrsl-population/1.0.0/grid.json.gz', '/data/nepal-region-earthquakes/1.0.0/features.geojson.gz', '/data/nepal-admin-districts/2.0.1/features.geojson.gz'].map(u => load(u)))
  .then(([model, grid, events, districts]) => ({ model, cells: M.populationCells(grid), districts: districts.features,
    presets: events.features.filter(f => f.properties.magnitude >= 6 && f.properties.magnitude <= 8.5).sort((a, b) => b.properties.magnitude - a.properties.magnitude).slice(0, 10) }));
async function quake(run) {
  const { model, cells, presets, districts } = await quakeData;
  if (run !== seq) return;
  const q = params(), pick = presets.find(f => f.properties.source_id === (q.get('preset') ?? 'us20002926')) ?? presets[0];
  const s = q.has('lon') ? { longitude: parse(q.get('lon')), latitude: parse(q.get('lat')), magnitude: parse(q.get('m')), mechanism: q.get('mech'), vs30: parse(q.get('vs30')), length_km: parse(q.get('len')) || 0, strike_deg: parse(q.get('strike')) || 0 }
    : { longitude: pick.geometry.coordinates[0], latitude: pick.geometry.coordinates[1], magnitude: pick.properties.magnitude, mechanism: 'unspecified', vs30: 760, length_km: 0, strike_deg: 0 };
  const presetLabel = f => `M${f.properties.magnitude}, ${f.properties.event_time.slice(0, 10)}, ${f.properties.place_name}`;
  form.innerHTML = select('preset', c.preset, [['', c.custom], ...presets.map(f => [f.properties.source_id, presetLabel(f)])], q.has('lon') ? '' : pick.properties.source_id)
    + `<p class="muted">${esc(c.pickHint)}</p><div class="row2">${field('lon', `${c.lon}, °E`, q.get('lon') ?? s.longitude)}${field('lat', `${c.lat}, °N`, q.get('lat') ?? s.latitude)}</div>`
    + field('m', c.magnitude, q.get('m') ?? s.magnitude)
    + select('mech', c.mech, M.MECHANISMS.map(m => [m, c.mechs[m]]), s.mechanism) + select('vs30', c.vs30, M.VS30.map(v => [v, c.soils[v]]), s.vs30)
    + `<div class="row2">${field('len', c.rupture, s.length_km)}${field('strike', c.strike, s.strike_deg)}</div>`
    + `<div class="actions"><button class="primary">${esc(c.run)}</button><button type="button" id="share">${esc(c.share)}</button></div>`;
  form.preset.onchange = () => { if (form.preset.value) location.hash = `quake&preset=${form.preset.value}`; };
  form.onsubmit = e => { e.preventDefault(); const f = form, n = x => String(parse(x));
    go('quake&' + new URLSearchParams({ lon: n(f.lon.value), lat: n(f.lat.value), m: n(f.m.value), mech: f.mech.value, vs30: f.vs30.value, len: n(f.len.value), strike: n(f.strike.value) })); };
  clearMap();
  const errors = M.validateQuake(model, s);
  mark(errors, { magnitude: ['m'], epicentre: ['lon', 'lat'], rupture: ['len', 'strike'] });
  if (errors.length) { out.innerHTML = `<p class="note bad" role="alert">${errors.map(e => esc(c.errors[e])).join('<br>')}</p>`; return; }

  const r = M.peopleByBand(model, s, cells);
  const sites = districts.map(f => ({ name: f.properties.name, p: M.pgaAt(model, s, f.properties.label_longitude, f.properties.label_latitude) })).filter(x => x.p).sort((a, b) => b.p[1] - a.p[1]).slice(0, 8);
  const g = v => num(v, v < 0.1 ? 3 : 2), bands = M.PGA_BANDS.map((_, i) => i).reverse();
  out.innerHTML = `<h2>${esc(c.pgaTitle)}</h2><div class="legend">${bands.filter(i => i > 0).map(i => `<span><i style="background:${BAND_COLORS[i]}"></i>${bandLabel(i)}</span>`).join('')}<span><i style="background:transparent;border:1px solid var(--color-rule)"></i>${esc(c.notShaded)}</span><span><i style="background:${BEYOND}"></i>${esc(c.beyondShade)}</span></div>
    <div class="scroll" tabindex="0"><table><caption>${esc(c.peopleBand)}</caption><thead><tr><th>${esc(c.band)}</th><th class="n">${esc(c.pLow)}</th><th class="n">${esc(c.pMid)}</th><th class="n">${esc(c.pHigh)}</th></tr></thead><tbody>
    ${bands.map(i => `<tr><td>${bandLabel(i)}</td><td class="n">${num(r.low[i])}</td><td class="n"><strong>${num(r.median[i])}</strong></td><td class="n">${num(r.high[i])}</td></tr>`).join('')}
    ${r.beyond ? `<tr><td>${esc(c.beyond)}</td><td class="n" colspan="3">${num(r.beyond)}</td></tr>` : ''}</tbody></table></div>
    <p class="src">${esc(c.outsideNepal)}</p>
    <div class="scroll" tabindex="0" style="margin-top:20px"><table><caption>${esc(c.strongest)}</caption><thead><tr><th>${esc(c.district)}</th><th class="n">${esc(c.pga)}</th></tr></thead><tbody>
    ${sites.map(x => `<tr><td>${esc(x.name)}</td><td class="n"><strong>${g(x.p[1])}</strong> <small>(${g(x.p[0])}–${g(x.p[2])})</small></td></tr>`).join('')}</tbody></table></div>
    <p class="note">${esc(c.quakeLimits)}</p>`;

  // Shaking image: each pixel is the band of the middle case at its centre, rows spaced evenly in map projection.
  // Beyond the model's 400 km range is grey (UNKNOWN), never left blank like weak shaking.
  const W = 380, H = 224, west = 79.5, east = 89, south = 25.6, north = 31.2, y = lat => Math.log(Math.tan(Math.PI / 4 + lat * Math.PI / 360));
  const canvas = Object.assign(document.createElement('canvas'), { width: W, height: H }), ctx = canvas.getContext('2d');
  for (let j = 0; j < H; j++) {
    const lat = Math.atan(Math.sinh(y(north) - (j + 0.5) / H * (y(north) - y(south)))) * 180 / Math.PI;
    for (let i = 0; i < W; i++) {
      const p = M.pgaAt(model, s, west + (i + 0.5) / W * (east - west), lat), fill = p ? BAND_COLORS[M.bandOf(p[1])] : BEYOND;
      if (fill) { ctx.fillStyle = fill; ctx.fillRect(i, j, 1, 1); }
    }
  }
  const image = { url: canvas.toDataURL(), coordinates: [[west, north], [east, north], [east, south], [west, south]] };
  if (map.getSource('shaking-img')) map.getSource('shaking-img').updateImage(image);
  else map.addSource('shaking-img', { type: 'image', ...image }), map.addLayer({ id: 'shaking-img', type: 'raster', source: 'shaking-img', paint: { 'raster-opacity': 0.6, 'raster-resampling': 'nearest' } }, 'path');
  map.setLayoutProperty('shaking-img', 'visibility', 'visible');
  if (s.length_km) set('rupture', [{ type: 'Feature', geometry: { type: 'LineString', coordinates: M.ruptureLine(s) }, properties: {} }]);
  set('points', [point([s.longitude, s.latitude], '#d93a2b', 8)]);
  fit([[s.longitude - 2.5, s.latitude - 2], [s.longitude + 2.5, s.latitude + 2]], 7);
}

map.on('click', e => {
  if (mode !== 'quake' || !form.lon) return;
  form.lon.value = e.lngLat.lng.toFixed(3); form.lat.value = e.lngLat.lat.toFixed(3); form.preset.value = ''; form.requestSubmit();
});
async function route() {
  const run = ++seq;
  mode = location.hash.startsWith('#quake') ? 'quake' : 'flood';
  for (const k of ['flood', 'quake']) document.getElementById(`tab-${k}`).setAttribute('aria-selected', String(k === mode));
  form.innerHTML = ''; out.innerHTML = `<p>${esc(c.loading)}</p>`;
  try { await (mode === 'quake' ? quake(run) : flood(run)); } catch (e) { console.error(e); if (run === seq) failed(out, route); }
  if (run !== seq) return;
  status.textContent = c.resultsReady;
  document.getElementById('share')?.addEventListener('click', async ev => {
    try { await navigator.clipboard.writeText(location.href); ev.target.textContent = c.copiedLink; } catch { ev.target.textContent = c.copyFailed; }
  });
  document.getElementById('map').dataset.ready = 'true';
}
const tabs = ['flood', 'quake'].map(k => document.getElementById(`tab-${k}`));
tabs.forEach((t, i) => {
  t.setAttribute('aria-controls', 'form');
  t.onclick = () => { location.hash = i ? 'quake' : 'flood'; };
  t.onkeydown = e => { if (['ArrowLeft', 'ArrowRight'].includes(e.key)) { tabs[1 - i].focus(); tabs[1 - i].click(); } };
});
addEventListener('hashchange', route);
route();
