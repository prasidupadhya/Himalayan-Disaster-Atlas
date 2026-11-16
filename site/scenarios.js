import { c, esc, num, duration, load, failed } from './app.js';
import { baseMap, maplibregl, color } from './basemap.js';
import * as M from './models.js';
import * as P from './places.js';
import { routeData, routeHtml, routeStage, mapLabel, province } from './route.js';

const form = document.getElementById('form'), out = document.getElementById('result'), status = document.getElementById('status'), mapNotes = document.querySelectorAll('.map-note');
const BAND_COLORS = ['', '#ffd57a', '#ffab45', '#f4743b', '#d7402b', '#8f1d21'], BEYOND = '#8a959c';
const bandLabel = i => i === M.PGA_BANDS.length - 1 ? `≥ ${num(M.PGA_BANDS[i], 2)} g` : i === 0 ? `< ${num(M.PGA_BANDS[1], 2)} g` : `${num(M.PGA_BANDS[i], 2)}–${num(M.PGA_BANDS[i + 1], 2)} g`;
const field = (name, label, value, attrs = '') => `<label class="field"><span>${esc(label)}</span><input name="${name}" value="${esc(value)}" inputmode="decimal" autocomplete="off" ${attrs}></label>`;
const select = (name, label, options, value) => `<label class="field"><span>${esc(label)}</span><select name="${name}">${options.map(([v, t]) => `<option value="${esc(v)}"${String(v) === String(value) ? ' selected' : ''}>${esc(t)}</option>`).join('')}</select></label>`;
const step = (n, title, body) => `<section class="step"><h2><span class="n">${num(n)}</span>${esc(title)}</h2>${body}</section>`;
const figure = (label, value, note = '') => `<div class="fig"><span>${esc(label)}</span><strong>${value}</strong>${note ? `<small>${esc(note)}</small>` : ''}</div>`;
const range = (a, b, f = num) => a === b ? f(a) : `${f(a)}–${f(b)}`;
/** Reads a typed number: Nepali digits, thousands separators and spaces are accepted; empty is not a number. */
const parse = v => { const t = String(v ?? '').replace(/[०-९]/g, d => '०१२३४५६७८९'.indexOf(d)).replace(/[,\s]/g, ''); return t === '' ? NaN : +t; };
const mark = (errors, fields) => { form.querySelectorAll('input').forEach(i => i.removeAttribute('aria-invalid')); errors.flatMap(e => fields[e] ?? []).forEach(n => form[n]?.setAttribute('aria-invalid', 'true')); };
const actions = `<div class="actions"><button class="primary">${esc(c.run)}</button><button type="button" id="share">${esc(c.share)}</button></div>`;
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const params = () => new URLSearchParams(location.hash.slice(1));
/** Inputs live in the link (shareable); an unchanged link still re-runs. */
const go = hash => { if (`#${hash}` === location.hash) route(); else location.hash = hash; };

/** The release hydrograph at the source as a small line chart: hours across, m³/s up. */
function hydrographChart(points, peak, title) {
  const W = 320, H = 120, T = points.at(-1)[0], x = t => (t / T * W).toFixed(1), y = q => (H - q / peak * (H - 8)).toFixed(1);
  return `<figure class="chart"><figcaption>${esc(title)}</figcaption><svg viewBox="-36 -6 ${W + 44} ${H + 26}" role="img" aria-label="${esc(title)}">
    <path class="axis" d="M0 0V${H}H${W}"/><path class="line" d="M${points.map(([t, q]) => `${x(t)} ${y(q)}`).join('L')}"/>
    <text x="-6" y="12" text-anchor="end">${num(peak)}</text><text x="-6" y="${H}" text-anchor="end">0</text>
    <text x="0" y="${H + 18}">0 h</text><text x="${W}" y="${H + 18}" text-anchor="end">${esc(duration(T))}</text></svg></figure>`;
}

let map;
try { map = await baseMap('map', ['Rivers: HydroRIVERS / FAO', 'Lakes: Glacial Lake Observatory', 'Population: Meta & CIESIN HRSL', 'Ground motion: BSSA14']); }
catch { failed(out, () => location.reload()); throw new Error('map unavailable'); }
const empty = { type: 'FeatureCollection', features: [] };
for (const id of ['origins', 'rupture', 'points']) map.addSource(id, { type: 'geojson', data: empty });
// The path carries line metrics so the water can be painted along it by distance.
map.addSource('path', { type: 'geojson', data: empty, lineMetrics: true });
map.addLayer({ id: 'path-casing', type: 'line', source: 'path', paint: { 'line-color': '#ffffff', 'line-width': 8, 'line-opacity': 0.85 }, layout: { 'line-cap': 'round', 'line-join': 'round' } });
map.addLayer({ id: 'path', type: 'line', source: 'path', paint: { 'line-width': 5, 'line-gradient': '#c9b26b' }, layout: { 'line-cap': 'round', 'line-join': 'round' } });
map.addLayer({ id: 'rupture', type: 'line', source: 'rupture', paint: { 'line-color': '#18232a', 'line-width': 4 } });
// Every verified release point, clickable: lakes in lake colour, river points in ink; the chosen one is larger.
map.addLayer({ id: 'origins', type: 'circle', source: 'origins', paint: { 'circle-radius': ['case', ['get', 'on'], 9, 6], 'circle-color': ['case', ['get', 'lake'], color('--color-lake'), color('--color-ink')], 'circle-stroke-color': '#fff', 'circle-stroke-width': 2 } });
map.addLayer({ id: 'points', type: 'circle', source: 'points', paint: { 'circle-radius': ['get', 'r'], 'circle-color': ['get', 'fill'], 'circle-stroke-color': '#fff', 'circle-stroke-width': 2 } });
const set = (id, features) => map.getSource(id).setData({ type: 'FeatureCollection', features });
const point = (coordinates, fill, r = 6) => ({ type: 'Feature', geometry: { type: 'Point', coordinates }, properties: { fill, r } });
const stage = routeStage(map, 'path-casing');
const fit = (coords, maxZoom = 9) => { const b = coords.reduce((b, p) => b.extend(p), new maplibregl.LngLatBounds(coords[0], coords[0])); map.fitBounds(b, { padding: 40, maxZoom, duration: reduced ? 0 : 800 }); };
let mode = null, seq = 0, stop = () => {}, cityLabels = [];
const shakeCanvas = Object.assign(document.createElement('canvas'), { width: 448, height: 420 });
/** Every run starts from a clean map, so an error never leaves an older result on screen. */
function clearMap() {
  stop(); stop = () => {}; stage.clear(); cityLabels.forEach(l => l.marker.remove()); cityLabels = [];
  ['origins', 'path', 'rupture', 'points'].forEach(id => set(id, [])); map.setPaintProperty('path', 'line-gradient', '#c9b26b');
  if (map.getLayer('shaking')) map.setLayoutProperty('shaking', 'visibility', 'none');
}

// ---------- Flood or lake outburst ----------
const catalogue = load('/data/atlas-flood-corridors/1.0.0/catalogue.json.gz');
async function flood(run) {
  const [cat, places] = await Promise.all([catalogue, routeData()]);
  if (run !== seq) return;
  const q = params(), o = cat.origins.find(o => o.id === q.get('flood')) ?? cat.origins[0], speeds = (q.get('c') ?? '2,4,6').split(',');
  const s = { origin: o.id, shape: q.get('shape') === 'rectangular' ? 'rectangular' : 'triangular', volume_m3: parse(q.get('v') ?? 1e7), duration_s: parse(q.get('h') ?? 3) * 3600,
    peak_fraction: parse(q.get('p') ?? 25) / 100, celerity_m_s: [0, 1, 2].map(i => parse(speeds[i])) };
  // Stream names are the nearest GeoNames point, for orientation only.
  const near = o => o.gazetteer_hint?.name ? `, ${c.near(o.gazetteer_hint.name)}` : '';
  const label = o => o.lake ? `${o.lake.basin}, ${num(o.lake.area_km2, 2)} km², ${num(o.lake.elevation_mean_m)} m${near(o)}` : `${c.reach(o.start_reach)}${near(o)}`;
  const group = (name, list) => `<optgroup label="${esc(name)}">${list.map(x => `<option value="${esc(x.id)}"${x.id === s.origin ? ' selected' : ''}>${esc(label(x))}</option>`).join('')}</optgroup>`;
  form.innerHTML = step(1, c.chooseFlood, `<label class="field"><span>${esc(c.origin)}</span><select name="origin">${group(c.lakeOrigins, cat.origins.filter(o => o.lake))}${group(c.riverOrigins, cat.origins.filter(o => !o.lake))}</select></label><p class="muted">${esc(c.pickOrigin)}</p>`)
    + step(2, c.setRun, `<div class="row2">${field('v', `${c.volume}, m³`, Number.isFinite(s.volume_m3) ? s.volume_m3.toLocaleString('en-US') : (q.get('v') ?? ''))}${field('h', `${c.duration}, h`, q.get('h') ?? 3)}</div>`
      + `<div class="row2">${select('shape', c.shape, [['triangular', c.triangular], ['rectangular', c.rectangular]], s.shape)}${field('p', `${c.peakAt}, %`, q.get('p') ?? 25, s.shape === 'rectangular' ? 'disabled' : '')}</div>`
      + `<fieldset class="field"><legend>${esc(c.speed)}, m/s</legend><div class="row3">${[0, 1, 2].map(i => `<input name="c${i}" value="${esc(speeds[i] ?? '')}" inputmode="decimal" aria-label="${esc(c.speeds[i])}">`).join('')}</div></fieldset>${actions}`);
  form.origin.onchange = () => form.requestSubmit();
  form.shape.onchange = () => { form.p.disabled = form.shape.value === 'rectangular'; };
  form.onsubmit = e => { e.preventDefault(); const f = form, n = x => String(parse(x));
    go(new URLSearchParams({ flood: f.origin.value, v: n(f.v.value), h: n(f.h.value), shape: f.shape.value, p: n(f.p.value), c: [f.c0, f.c1, f.c2].map(i => n(i.value)).join(',') }).toString()); };
  clearMap();
  set('origins', cat.origins.map(x => ({ type: 'Feature', geometry: { type: 'Point', coordinates: x.lake ? [x.lake.longitude, x.lake.latitude] : x.start_coordinates }, properties: { id: x.id, lake: !!x.lake, on: x.id === o.id } })));
  const errors = M.validateFlood(s);
  mark(errors, { volume: ['v'], duration: ['h'], peak: ['p'], celerity: ['c0', 'c1', 'c2'] });
  if (errors.length) { out.innerHTML = step(3, c.results, `<p class="note bad" role="alert">${errors.map(e => esc(c.errors[e])).join('<br>')}</p>`); return; }

  const hg = M.hydrograph(s), t = ([a, , b]) => range(a, b, duration);
  const rows = o.checkpoints.map(cp => ({ cp, a: M.arrivals(s, cp.prefix_km), x: M.exposureRange(cp.by_width) }));
  const r = P.describePath(o.line.coordinates, o.path_length_km, places.find, places.places, places.streams);
  const frontAt = km => km <= 0 ? c.atRelease : c.frontAfter(t(M.arrivals(s, km).front));
  const first = rows[0], last = rows.at(-1), people = last.x.population ? range(Math.round(last.x.population[0]), Math.round(last.x.population[1])) : c.unknown;
  out.innerHTML = step(3, c.results, `<p class="summary">${esc(c.floodSummary(r.start ? c.startIn(r.start.name) : c.startOutside, num(last.cp.prefix_km), t(last.a.front), people))}</p>
    <div class="figs">${figure(c.frontAt(num(first.cp.prefix_km)), esc(t(first.a.front)))}${figure(c.frontAt(num(last.cp.prefix_km)), esc(t(last.a.front)))}
      ${figure(c.popCorridors, esc(people), last.x.partial ? c.partial : '')}${figure(c.assetsFull, esc(range(...last.x.assets)))}</div>
    <div class="player"><button type="button" id="play">${esc(c.pause)}</button><input type="range" id="scrub" min="0" max="1000" value="0" aria-label="${esc(c.timeAfter)}">
      <p class="clock" id="clock"></p>
      <div class="player-options"><label class="check"><input type="checkbox" id="follow"${reduced ? '' : ' checked'}> ${esc(c.follow)}</label><button type="button" id="speed" aria-label="${esc(c.speedLabel)} ${num(1)}×">${num(1)}×</button></div></div>
    <div class="legend"><span><i style="background:#1d5fa8"></i>${esc(c.wetMiddle)}</span><span><i style="background:#8ec5ff"></i>${esc(c.wetRange)}</span><span><i style="background:#7d8f9c"></i>${esc(c.passedPath)}</span><span><i style="background:#c9b26b"></i>${esc(c.dryPath)}</span></div>
    <div class="scroll" tabindex="0"><table><thead><tr><th class="n">${esc(c.checkpoint)}</th><th>${esc(c.arrives)}</th><th>${esc(c.peaks)}</th><th>${esc(c.ends)}</th><th class="n">${esc(c.people)}</th><th class="n">${esc(c.assets)}</th></tr></thead><tbody>
    ${rows.map(({ cp, a, x }) => `<tr data-km="${cp.prefix_km}"><td class="n">${num(cp.prefix_km)} km</td><td>${t(a.front)}</td><td>${t(a.peak)}</td><td>${t(a.end)}</td><td class="n">${x.population ? range(Math.round(x.population[0]), Math.round(x.population[1])) : esc(c.unknown)}${x.partial ? '*' : ''}</td><td class="n">${range(...x.assets)}</td></tr>`).join('')}</tbody></table></div>
    <p class="src">${esc(c.range)}</p>
    ${routeHtml(r, o.path_length_km, frontAt)}
    ${hydrographChart(hg.points, hg.peak_m3_s, c.hydroTitle(num(s.volume_m3), num(hg.peak_m3_s)))}
    <p class="note">${esc(c.floodLimits)} ${esc(c.damageNotModelled)}</p>`);

  const line = o.line.coordinates;
  set('path', [{ type: 'Feature', geometry: o.line, properties: {} }]); stage.show(r);
  stop = play(o, s, line, r);
}

/**
 * Flood playback. At each moment the path is painted by distance: deep blue where the middle-speed pulse is passing,
 * light blue up to the fastest front (where water could already be), slate behind the pulse's tail, sand ahead.
 * Districts light up and are named as the middle front enters them, towns near the path appear as it passes,
 * and the checkpoints and their table rows mark its arrival. The camera can follow the front.
 */
function play(o, s, line, r) {
  // The timeline runs until the middle-speed pulse has passed the end of the path.
  const total = o.path_length_km, [slow, mid, fast] = s.celerity_m_s, end = 1000 * total / mid + s.duration_s;
  const rowsEl = [...document.querySelectorAll('#result tr[data-km]')], [btn, scrub, clock, follow, speedBtn] = ['play', 'scrub', 'clock', 'follow', 'speed'].map(id => document.getElementById(id));
  const DRY = '#c9b26b', PASSED = '#7d8f9c', PULSE = '#1d5fa8', RANGE = '#8ec5ff';
  const seconds = Math.min(40, Math.max(14, total / 10));   // a full run at 1×
  let t = reduced ? end : 0, playing = !reduced, last = null, frame = 0, speed = 1, hold = 0;
  function draw() {
    const km = v => Math.min(total, v * t / 1000), front = km(mid), tail = Math.min(total, Math.max(0, mid * (t - s.duration_s) / 1000)), lo = km(slow), hi = km(fast);
    const expr = ['step', ['line-progress'], tail > 0 ? PASSED : PULSE]; let prev = 0;
    for (const [d, col] of [...(tail > 0 ? [[tail, PULSE]] : []), [front, RANGE], [hi, DRY]]) {
      const p = Math.min(1, Math.max(prev + 1e-6, d / total));   // stops must rise strictly
      if (p > prev) { expr.push(p, col); prev = p; }
    }
    map.setPaintProperty('path', 'line-gradient', expr);
    const reached = o.checkpoints.map(cp => cp.prefix_km <= front + 1e-9), moving = front < total && t > 0, head = P.pointAt(r.samples, front);
    set('points', [point(o.lake ? [o.lake.longitude, o.lake.latitude] : o.start_coordinates, '#0f8fa6', 8), ...o.checkpoints.map((cp, i) => point(cp.end_coordinates, reached[i] ? PULSE : '#18232a', reached[i] ? 7 : 5))]);
    const place = stage.progress(front, moving ? head : null);
    rowsEl.forEach((row, i) => row.classList.toggle('reached', reached[i]));
    clock.textContent = c.clockAt(duration(t), num(front), place, num(lo), num(hi));
    scrub.value = Math.round(t / end * 1000); scrub.setAttribute('aria-valuetext', clock.textContent);
    btn.textContent = playing ? c.pause : t >= end ? c.replay : c.play;
    if (playing && follow.checked && moving && performance.now() > hold) map.jumpTo({ center: head });
  }
  function tick(now) {
    if (playing) {
      if (last !== null && now > hold) t = Math.min(end, t + (now - last) / (seconds * 1000) * end * speed);
      last = now;
      if (t >= end) { playing = false; if (follow.checked) fit(line); }
    }
    draw();
    if (playing) frame = requestAnimationFrame(tick); else last = null;
  }
  /** Start or resume: with Follow on, the camera first moves in on the front, then travels with it. */
  function start() {
    playing = true; last = null;
    if (follow.checked) { hold = performance.now() + (reduced ? 0 : 900); map.easeTo({ center: P.pointAt(r.samples, Math.min(total, mid * t / 1000)), zoom: Math.max(map.getZoom(), 9.2), duration: reduced ? 0 : 900 }); }
    frame = requestAnimationFrame(tick);
  }
  btn.onclick = () => { if (t >= end) t = 0; if (playing) { playing = false; draw(); } else start(); };
  scrub.oninput = () => { playing = false; t = scrub.value / 1000 * end; draw(); };
  speedBtn.onclick = () => { speed = speed === 4 ? 1 : speed * 2; speedBtn.textContent = `${num(speed)}×`; speedBtn.setAttribute('aria-label', `${c.speedLabel} ${num(speed)}×`); };
  // Turning Follow on moves in on the front; turning it off shows the whole path again.
  follow.onchange = () => { if (!follow.checked) fit(line); else if (playing) start(); else map.easeTo({ center: P.pointAt(r.samples, Math.min(total, mid * t / 1000)), zoom: Math.max(map.getZoom(), 9.2), duration: reduced ? 0 : 900 }); };
  // Moving the map by hand hands the camera back to the reader.
  const release = e => { if (e.originalEvent && follow.checked) follow.checked = false; };
  map.on('dragstart', release); map.on('zoomstart', release);
  fit(line);
  if (reduced) draw(); else start();
  return () => { playing = false; cancelAnimationFrame(frame); map.off('dragstart', release); map.off('zoomstart', release); };
}

// ---------- Earthquake shaking ----------
const quakeData = Promise.all(['/data/atlas-gmpe-bssa14/1.0.0/model.json', '/data/nepal-hrsl-population/1.0.0/grid.json.gz', '/data/nepal-region-earthquakes/1.0.0/features.geojson.gz'].map(u => load(u)))
  .then(([model, grid, events]) => ({ model, cells: M.populationCells(grid),
    presets: events.features.filter(f => f.properties.magnitude >= 6 && f.properties.magnitude <= 8.5).sort((a, b) => b.properties.magnitude - a.properties.magnitude).slice(0, 10) }));
async function quake(run) {
  const [{ model, cells, presets }, places] = await Promise.all([quakeData, routeData()]), districts = places.districts;
  if (run !== seq) return;
  const q = params(), pick = presets.find(f => f.properties.source_id === (q.get('preset') ?? 'us20002926')) ?? presets[0];
  const s = q.has('lon') ? { longitude: parse(q.get('lon')), latitude: parse(q.get('lat')), magnitude: parse(q.get('m')), mechanism: q.get('mech'), vs30: parse(q.get('vs30')), length_km: parse(q.get('len')) || 0, strike_deg: parse(q.get('strike')) || 0 }
    : { longitude: pick.geometry.coordinates[0], latitude: pick.geometry.coordinates[1], magnitude: pick.properties.magnitude, mechanism: 'unspecified', vs30: 760, length_km: 0, strike_deg: 0 };
  const presetLabel = f => `M${f.properties.magnitude}, ${f.properties.event_time.slice(0, 10)}, ${f.properties.place_name}`;
  form.innerHTML = step(1, c.chooseQuake, select('preset', c.preset, [['', c.custom], ...presets.map(f => [f.properties.source_id, presetLabel(f)])], q.has('lon') ? '' : pick.properties.source_id)
      + `<p class="muted">${esc(c.pickHint)}</p><div class="row2">${field('lon', `${c.lon}, °E`, q.get('lon') ?? s.longitude)}${field('lat', `${c.lat}, °N`, q.get('lat') ?? s.latitude)}</div>`)
    + step(2, c.setRun, `<div class="row2">${field('m', c.magnitude, q.get('m') ?? s.magnitude)}${select('vs30', c.vs30, M.VS30.map(v => [v, c.soils[v]]), s.vs30)}</div>`
      + select('mech', c.mech, M.MECHANISMS.map(m => [m, c.mechs[m]]), s.mechanism)
      + `<div class="row2">${field('len', c.rupture, s.length_km)}${field('strike', c.strike, s.strike_deg)}</div>${actions}`);
  form.preset.onchange = () => { if (form.preset.value) location.hash = `quake&preset=${form.preset.value}`; };
  form.onsubmit = e => { e.preventDefault(); const f = form, n = x => String(parse(x));
    go('quake&' + new URLSearchParams({ lon: n(f.lon.value), lat: n(f.lat.value), m: n(f.m.value), mech: f.mech.value, vs30: f.vs30.value, len: n(f.len.value), strike: n(f.strike.value) })); };
  clearMap();
  const errors = M.validateQuake(model, s);
  mark(errors, { magnitude: ['m'], epicentre: ['lon', 'lat'], rupture: ['len', 'strike'] });
  if (errors.length) { out.innerHTML = step(3, c.results, `<p class="note bad" role="alert">${errors.map(e => esc(c.errors[e])).join('<br>')}</p>`); return; }

  const r = M.peopleByBand(model, s, cells), strong = k => r[k].slice(3).reduce((a, b) => a + b, 0);
  const g = v => num(v, v < 0.1 ? 3 : 2), pga = x => `<strong>${g(x.p[1])}</strong> <small>(${g(x.p[0])}–${g(x.p[2])})</small>`, bands = M.PGA_BANDS.map((_, i) => i).reverse();
  const sites = districts.map(f => ({ name: f.properties.name, province: f.properties.parent_name, p: M.pgaAt(model, s, f.properties.label_longitude, f.properties.label_latitude) })).filter(x => x.p).sort((a, b) => b.p[1] - a.p[1]).slice(0, 10);
  // Cities and towns, names as published by OpenStreetMap, with the model's value at each point.
  const towns = places.places.filter(x => x.kind !== 'village').map(x => ({ ...x, at: x.p, p: M.pgaAt(model, s, ...x.p), district: places.find(x.p)?.name ?? null })).filter(x => x.p).sort((a, b) => b.p[1] - a.p[1]);
  const home = places.find([s.longitude, s.latitude]), where = home ? c.epicentreIn(home.name, province(home.province)) : c.epicentreOutside;
  out.innerHTML = step(3, c.results, `<p class="summary">${esc(c.quakeSummary(num(s.magnitude, 1), where, num(strong('median')), num(strong('low')), num(strong('high'))))}</p>
    <div class="figs">${figure(c.peopleStrong, num(strong('median')), `${num(strong('low'))}–${num(strong('high'))}`)}${sites[0] ? figure(c.strongestAt(sites[0].name), `${g(sites[0].p[1])} g`, `${g(sites[0].p[0])}–${g(sites[0].p[2])} g`) : ''}</div>
    <div class="actions"><button type="button" id="sweep">${esc(c.replaySweep)}</button></div>
    <div class="legend">${bands.filter(i => i > 0).map(i => `<span><i style="background:${BAND_COLORS[i]}"></i>${bandLabel(i)}</span>`).join('')}<span><i style="background:transparent;box-shadow:inset 0 0 0 1px var(--color-rule)"></i>${esc(c.notShaded)}</span><span><i style="background:${BEYOND}"></i>${esc(c.beyondShade)}</span></div>
    <div class="scroll" tabindex="0"><table><caption>${esc(c.citiesTitle)}</caption><thead><tr><th>${esc(c.place)}</th><th>${esc(c.district)}</th><th class="n">${esc(c.pga)}</th></tr></thead><tbody>
    ${towns.slice(0, 10).map(x => `<tr><td>${esc(x.name)} <small>${esc(c.kinds[x.kind])}</small></td><td>${esc(x.district ?? c.outsideNepal)}</td><td class="n">${pga(x)}</td></tr>`).join('') || `<tr><td colspan="3">${esc(c.noTownsShaking)}</td></tr>`}</tbody></table></div>
    <div class="scroll" tabindex="0"><table><caption>${esc(c.strongest)}</caption><thead><tr><th>${esc(c.district)}</th><th>${esc(c.provinceCol)}</th><th class="n">${esc(c.pga)}</th></tr></thead><tbody>
    ${sites.map(x => `<tr><td>${esc(x.name)}</td><td>${esc(province(x.province))}</td><td class="n">${pga(x)}</td></tr>`).join('')}</tbody></table></div>
    <div class="scroll" tabindex="0"><table><caption>${esc(c.peopleBand)}</caption><thead><tr><th>${esc(c.band)}</th><th class="n">${esc(c.pLow)}</th><th class="n">${esc(c.pMid)}</th><th class="n">${esc(c.pHigh)}</th></tr></thead><tbody>
    ${bands.map(i => `<tr><td>${bandLabel(i)}</td><td class="n">${num(r.low[i])}</td><td class="n"><strong>${num(r.median[i])}</strong></td><td class="n">${num(r.high[i])}</td></tr>`).join('')}
    ${r.beyond ? `<tr><td>${esc(c.beyond)}</td><td class="n" colspan="3">${num(r.beyond)}</td></tr>` : ''}</tbody></table></div>
    <p class="src">${esc(c.peopleOutside)} ${esc(c.placesSource)}</p>
    <p class="note">${esc(c.quakeLimits)}</p>`);

  // Shaking grid: for each pixel, the band of the middle case and its distance from the rupture, computed once.
  // Rows are spaced evenly in map projection. Beyond the model's 400 km range is grey (UNKNOWN), never blank like weak shaking.
  const W = shakeCanvas.width, H = shakeCanvas.height, west = 78.8, east = 90, south = 22, north = 31.9,   // the whole map area
   y = lat => Math.log(Math.tan(Math.PI / 4 + lat * Math.PI / 360));
  const band = new Uint8Array(W * H), dist = new Float32Array(W * H); let far = 0;
  for (let j = 0; j < H; j++) {
    const lat = Math.atan(Math.sinh(y(north) - (j + 0.5) / H * (y(north) - y(south)))) * 180 / Math.PI;
    for (let i = 0; i < W; i++) {
      const lon = west + (i + 0.5) / W * (east - west), p = M.pgaAt(model, s, lon, lat), k = j * W + i;
      band[k] = p ? M.bandOf(p[1]) : 255; dist[k] = M.rjb(s, lon, lat); far = Math.max(far, dist[k]);
    }
  }
  // Colours packed as 32-bit pixels (little-endian ABGR), so a frame is one pass over the grid.
  const pack = hex => (255 << 24 | parseInt(hex.slice(5, 7), 16) << 16 | parseInt(hex.slice(3, 5), 16) << 8 | parseInt(hex.slice(1, 3), 16)) >>> 0;
  const fills = BAND_COLORS.map(h => h ? pack(h) : 0), grey = pack(BEYOND), ink = pack('#18232a');
  const ctx = shakeCanvas.getContext('2d'), image = ctx.createImageData(W, H), px = new Uint32Array(image.data.buffer);
  /** Paint everything within `radius` km of the rupture; `ring` draws the moving edge. */
  const paint = (radius, ring) => {
    for (let k = 0; k < band.length; k++) {
      const d = dist[k];
      px[k] = ring && Math.abs(d - radius) < 3 ? ink : d > radius ? 0 : band[k] === 255 ? grey : fills[band[k]];
    }
    ctx.putImageData(image, 0, 0);
  };
  if (!map.getSource('shaking')) {
    map.addSource('shaking', { type: 'canvas', canvas: shakeCanvas, coordinates: [[west, north], [east, north], [east, south], [west, south]], animate: true });
    map.addLayer({ id: 'shaking', type: 'raster', source: 'shaking', paint: { 'raster-opacity': 0.6, 'raster-resampling': 'nearest', 'raster-fade-duration': 0 } }, 'path-casing');
  }
  map.setLayoutProperty('shaking', 'visibility', 'visible');
  if (s.length_km) set('rupture', [{ type: 'Feature', geometry: { type: 'LineString', coordinates: M.ruptureLine(s) }, properties: {} }]);
  set('points', [point([s.longitude, s.latitude], '#d93a2b', 8)]);
  // Name the places: the strongest-shaken cities first, then towns, kept apart so labels do not pile up.
  const shown = [];
  for (const x of [...towns.filter(x => x.kind === 'city'), ...towns.filter(x => x.kind === 'town')]) {
    if (shown.length >= 9 || M.bandOf(x.p[1]) < 1) continue;
    if (shown.every(o => P.flatKm(o.at, x.at) > 35)) shown.push(x);
  }
  cityLabels = shown.map(x => ({ ...mapLabel(map, x.at, x.name, x.kind), d: M.rjb(s, ...x.at) }));
  fit([[s.longitude - 2.5, s.latitude - 2], [s.longitude + 2.5, s.latitude + 2]], 7);

  // The pattern spreads outward once so the eye can follow it from the source. It is a way of showing the map, not a timed wave.
  const source = map.getSource('shaking'); let frame = 0, sweeps = 0;
  // The source keeps uploading the canvas while it plays; it is paused one frame after the last paint, unless a newer sweep began.
  const settle = () => { const mine = sweeps; paint(Infinity, false); cityLabels.forEach(l => l.el.classList.add('on')); requestAnimationFrame(() => { if (mine === sweeps) source.pause(); }); };
  const sweep = () => {
    sweeps++; cancelAnimationFrame(frame); source.play();
    if (reduced) return settle();
    cityLabels.forEach(l => l.el.classList.remove('on'));
    const t0 = performance.now();
    frame = requestAnimationFrame(function tick(now) {
      const k = Math.min(1, (now - t0) / 3600), radius = k < 0.8 ? 400 * (1 - (1 - k / 0.8) ** 2) : 400 + (far - 400) * (k - 0.8) / 0.2;
      paint(radius, k < 0.8); cityLabels.forEach(l => l.el.classList.toggle('on', l.d <= radius));
      if (k < 1) frame = requestAnimationFrame(tick); else settle();
    });
  };
  document.getElementById('sweep').onclick = sweep;
  sweep();
  stop = () => { sweeps++; cancelAnimationFrame(frame); source.pause(); };
}

// Map clicks: in Flood a release point chooses that release; in Earthquake any point moves the epicentre.
map.on('click', e => {
  if (mode === 'flood' && form.origin) {
    const hit = map.queryRenderedFeatures([[e.point.x - 10, e.point.y - 10], [e.point.x + 10, e.point.y + 10]], { layers: ['origins'] })[0];
    if (hit) { form.origin.value = hit.properties.id; form.requestSubmit(); }
  } else if (mode === 'quake' && form.lon) {
    form.lon.value = e.lngLat.lng.toFixed(3); form.lat.value = e.lngLat.lat.toFixed(3); form.preset.value = ''; form.requestSubmit();
  }
});
map.on('mouseenter', 'origins', () => { map.getCanvas().style.cursor = 'pointer'; });
map.on('mouseleave', 'origins', () => { map.getCanvas().style.cursor = ''; });
async function route() {
  const run = ++seq;
  mode = location.hash.startsWith('#quake') ? 'quake' : 'flood';
  for (const k of ['flood', 'quake']) document.getElementById(`tab-${k}`).setAttribute('aria-selected', String(k === mode));
  for (const n of mapNotes) n.textContent = mode === 'quake' ? c.mapNoteQuake : c.mapNoteFlood;
  clearMap(); form.innerHTML = ''; out.innerHTML = `<p>${esc(c.loading)}</p>`;
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
