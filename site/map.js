import { c, esc, num, load, failed, lang } from './app.js';
import { searchBox, placeIndex, placeHtml, flyTo } from './search.js';
import { COPY } from './copy.js';
import { baseMap, explorerTerrain, popup, color, maplibregl } from './basemap.js';
import * as P from './places.js';
import { routeData, routeHtml, routeStage } from './route.js';

const D = id => `/data/${id}/features.geojson.gz`;

/** Each layer: its data, how it is drawn, its legend symbol and what its popup says. */
const LAYERS = [
  { id: 'rivers', key: 'riverNet', on: true, sym: ['line', '--color-water'], data: () => load(D('nepal-rivers-primary/1.0.0')), type: 'line',
    paint: () => ({ 'line-color': color('--color-water'), 'line-opacity': 0.6, 'line-width': ['interpolate', ['linear'], ['get', 'flow_order'], 3, 0.4, 5, 1, 8, 2.6] }),
    info: p => [c.reach(p.source_id), [[c.flow, `${num(p.average_discharge_m3s, 1)} m³/s`], [c.order, num(p.flow_order)]]] },
  { id: 'lakes', key: 'lakes', on: true, sym: ['dot', '--color-lake'], data: () => load(D('nepal-transboundary-glacial-lakes/1.0.0')), type: 'circle',
    paint: () => ({ 'circle-color': color('--color-lake'), 'circle-stroke-color': '#fff', 'circle-stroke-width': 0.6, 'circle-radius': ['interpolate', ['linear'], ['zoom'], 5, ['interpolate', ['linear'], ['get', 'area_km2'], 0, 1.5, 1, 5], 10, ['interpolate', ['linear'], ['get', 'area_km2'], 0, 4, 1, 14]] }),
    info: p => [p.lake_name ?? `${c.lake} ${p.source_id}`, [[c.area, `${num(p.area_km2, 3)} km²`], [c.elevation, `${num(p.elevation_mean_m)} m`], [c.connectivity, p.connectivity], [c.basin, p.basin], [c.country, p.country]]] },
  { id: 'glaciers', key: 'glaciers', on: false, sym: ['area', '#ffffff'], type: 'fill', paint: () => ({ 'fill-color': '#ffffff', 'fill-opacity': 0.75, 'fill-outline-color': '#7fb6d1' }),
    data: async () => ({ type: 'FeatureCollection', features: (await Promise.all(['west', 'central', 'east'].map(r => load(D(`nepal-glaciers-${r}/1.0.0`))))).flatMap(fc => fc.features) }),
    info: p => [p.glacier_name ?? p.source_id, [[c.area, `${num(p.area_km2, 2)} km²`], [c.elevation, `${num(p.elevation_min_m)}–${num(p.elevation_max_m)} m`]]] },
  { id: 'districts', key: 'districts', on: false, sym: ['line', '--color-muted'], data: () => load(D('nepal-admin-districts/2.0.1')), type: 'line', paint: () => ({ 'line-color': '#fff', 'line-width': 0.8, 'line-opacity': 0.8 }) },
];

/** The legend symbol drawn the way the map draws the layer. */
const symbol = ([kind, fill]) => {
  const f = fill.startsWith('--') ? `var(${fill})` : fill;
  const shape = { line: `<path d="M2 14c5-6 9 2 16-6" style="stroke:${f}" stroke-width="2.5" fill="none" stroke-linecap="round"/>`, dot: `<circle cx="10" cy="10" r="6" style="fill:${f}" stroke="#fff"/>`,
    area: `<path d="M3 15 7 5l5 4 5-3-1 10z" style="fill:${f}" stroke="#7fb6d1"/>` }[kind];
  return `<svg viewBox="0 0 20 20" width="22" height="22" aria-hidden="true">${shape}</svg>`;
};
const info = document.getElementById('info'), list = document.getElementById('layers');
let map;
try { map = await baseMap('map', ['Rivers: HydroRIVERS / FAO', 'Lakes: Glacial Lake Observatory', 'Glaciers: RGI 7.0', c.peaksCredit]); }
catch { failed(info, () => location.reload()); throw new Error('map unavailable'); }

// Labels are shaped by the browser. Reserve each measured box in height
// order so a lower summit cannot cover a higher one during a pan or tilt.
async function peakLabels() {
  const { features } = await load(D('nepal-mountains/1.0.0'));
  const peaks = features.map(({ properties: p, geometry }) => {
    const name = (lang === 'ne' && p.aliases?.find(a => /[\u0900-\u097f]/u.test(a))) || p.name || c.unknown;
    return { xy: geometry.coordinates, elevation: p.value, text: c.peakLabel(name, p.value == null ? c.unknown : c.peakMetres(num(p.value))) };
  }).sort((a, b) => (b.elevation ?? -Infinity) - (a.elevation ?? -Infinity));
  const pane = document.createElement('div');
  pane.className = 'peak-labels';
  map.getCanvas().after(pane);
  let visible = [], dirty = true;
  const invalidate = () => { dirty = true; };
  const fontsChanged = () => { peaks.forEach(p => { p.size = null; }); invalidate(); map.triggerRepaint(); };
  document.fonts.addEventListener('loadingdone', fontsChanged); document.fonts.ready.then(fontsChanged);
  map.on('move', invalidate); map.on('resize', invalidate); map.on('terrain', invalidate);
  map.on('sourcedata', e => { if (e.sourceId === 'dem') invalidate(); });
  function layout() {
    if (!dirty) return;
    dirty = false;
    const z = map.getZoom(), bounds = map.getBounds(), width = pane.clientWidth, height = pane.clientHeight;
    const min = z < 6 ? 7500 : z < 8 ? 6500 : z < 10 ? 4500 : -Infinity;
    const gap = Math.max(3, 24 - z * 2), placed = [], next = [];
    for (const peak of peaks) {
      if ((peak.elevation ?? -Infinity) < min) break;
      if (!bounds.contains(peak.xy)) continue;
      const p = map.project(peak.xy);
      if (p.x < 0 || p.x > width || p.y < 0 || p.y > height) continue;
      if (!peak.el) {
        peak.el = document.createElement('span'); peak.el.className = 'peak-label';
        peak.el.textContent = peak.text;
      }
      if (!peak.size) {
        pane.append(peak.el);
        peak.size = [peak.el.offsetWidth, peak.el.offsetHeight]; peak.el.remove();
      }
      const [w, h] = peak.size;
      const left = Math.round(p.x - w / 2), top = Math.round(p.y - h - 4), right = left + w, bottom = top + h;
      if (left < 2 || top < 2 || right > width - 2 || bottom > height - 2 || (right > width - 60 && top < 152)) continue;
      if (placed.some(b => left < b.right + gap && right + gap > b.left && top < b.bottom + gap && bottom + gap > b.top)) continue;
      if (!peak.el.isConnected) pane.append(peak.el);
      peak.el.style.transform = `translate(${left}px, ${top}px)`;
      placed.push({ left, right, top, bottom }); next.push(peak);
    }
    for (const peak of visible) if (!next.includes(peak)) peak.el.remove();
    visible = next;
  }
  map.on('render', layout); layout();
}

// Downstream trace: follow each reach's published downstream link until it leaves the network,
// then draw that path from the tapped reach to its end, and keep a slow dash moving along it to show the flow direction.
const none = { type: 'FeatureCollection', features: [] }, reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
map.addSource('trace', { type: 'geojson', data: none, lineMetrics: true });
map.addSource('trace-ends', { type: 'geojson', data: none });
map.addLayer({ id: 'trace-casing', type: 'line', source: 'trace', paint: { 'line-color': '#ffffff', 'line-width': 9, 'line-opacity': 0.9, 'line-gradient': '#ffffff' }, layout: { 'line-cap': 'round', 'line-join': 'round' } });
map.addLayer({ id: 'trace', type: 'line', source: 'trace', paint: { 'line-width': 5, 'line-gradient': '#ffd400' }, layout: { 'line-cap': 'round', 'line-join': 'round' } });
map.addLayer({ id: 'trace-flow', type: 'line', source: 'trace', paint: { 'line-color': '#18232a', 'line-width': 2, 'line-opacity': 0, 'line-dasharray': [0, 4, 3] }, layout: { 'line-join': 'round' } });
map.addLayer({ id: 'trace-ends', type: 'circle', source: 'trace-ends', paint: { 'circle-radius': 7, 'circle-color': ['get', 'fill'], 'circle-stroke-color': '#18232a', 'circle-stroke-width': 2 } });
const stage = routeStage(map, 'trace-casing');
let rivers = null, stopTrace = () => {};
const DASHES = [[0, 4, 3], [0.5, 4, 2.5], [1, 4, 2], [1.5, 4, 1.5], [2, 4, 1], [2.5, 4, 0.5], [3, 4, 0], [0, 0.5, 3, 3.5], [0, 1, 3, 3], [0, 1.5, 3, 2.5], [0, 2, 3, 2], [0, 2.5, 3, 1.5], [0, 3, 3, 1], [0, 3.5, 3, 0.5]];
/** The reaches as one line in flow order: each reach is turned to start where the previous one ended. */
function joined(path) {
  const parts = path.map(f => f.geometry.type === 'MultiLineString' ? f.geometry.coordinates.flat() : f.geometry.coordinates), out = [];
  const gap = (a, b) => (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2;
  parts.forEach((part, i) => {
    // The first reach faces the second; every later reach starts nearest to where the line so far ends.
    const near = (p, q) => q ? Math.min(gap(p, q[0]), gap(p, q.at(-1))) : 0;
    const flip = i === 0 ? near(part[0], parts[1]) < near(part.at(-1), parts[1]) : gap(part.at(-1), out.at(-1)) < gap(part[0], out.at(-1));
    out.push(...(flip ? [...part].reverse() : part));
  });
  return out;
}
async function trace(id) {
  stopTrace();
  const byId = new Map(rivers.features.map(f => [f.properties.source_id, f])), path = [], seen = new Set();
  for (let f = byId.get(id); f && !seen.has(f.properties.source_id); f = f.properties.downstream_in_release ? byId.get(f.properties.downstream_id) : null) { seen.add(f.properties.source_id); path.push(f); }
  const line = joined(path), totalKm = path.reduce((t, f) => t + f.properties.length_km, 0);
  let frame = 0, timer = 0, live = true;
  stopTrace = () => { live = false; cancelAnimationFrame(frame); clearInterval(timer); map.setPaintProperty('trace-flow', 'line-opacity', 0); };
  const clear = () => { stopTrace(); stage.clear(); map.getSource('trace').setData(none); map.getSource('trace-ends').setData(none); info.innerHTML = ''; };
  const show = p => ['trace', 'trace-casing'].forEach(l => map.setPaintProperty(l, 'line-gradient', ['step', ['line-progress'], l === 'trace' ? '#ffd400' : '#ffffff', Math.max(1e-6, p), 'rgba(0,0,0,0)']));
  show(0);
  map.getSource('trace').setData({ type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates: line } });
  map.getSource('trace-ends').setData({ type: 'FeatureCollection', features: [[line[0], '#ffd400'], [line.at(-1), '#ffffff']].map(([p, fill]) => ({ type: 'Feature', properties: { fill }, geometry: { type: 'Point', coordinates: p } })) });
  map.fitBounds(line.reduce((b, p) => b.extend(p), new maplibregl.LngLatBounds(line[0], line[0])), { padding: 60, maxZoom: 10, duration: reduced ? 0 : 900 });
  const summary = `<p class="note">${esc(c.traced(num(totalKm), num(path.length)))} ${esc(c.traceExit)}</p>`, clearBtn = `<button type="button" id="clear">${esc(c.clearTrace)}</button>`;
  info.innerHTML = `${summary}${clearBtn}`;
  document.getElementById('clear').onclick = clear;
  // The places along the path: districts in order, towns near it and stream names. If they cannot load, the line still draws.
  const places = await routeData().catch(() => null);
  if (!live) return;
  const r = places && P.describePath(line, totalKm, places.find, places.places, places.streams);
  if (r) {
    stage.show(r);
    info.innerHTML = `${summary}<p class="clock" id="now" aria-live="polite"></p>${clearBtn}<h2>${esc(c.traceRoute)}</h2>${routeHtml(r, totalKm)}`;
    document.getElementById('clear').onclick = clear;
  }
  const now = document.getElementById('now');
  const at = k => { show(k); if (r) { const place = stage.progress(k * totalKm, k < 1 ? P.pointAt(r.samples, k * totalKm) : null); const text = k < 1 ? c.tracing(place) : ''; if (now && now.textContent !== text) now.textContent = text; } };
  // After the line is drawn, a slow dash keeps moving along it to show the direction of flow.
  const flow = () => { map.setPaintProperty('trace-flow', 'line-opacity', 0.55); let n = 0; timer = setInterval(() => map.setPaintProperty('trace-flow', 'line-dasharray', DASHES[n++ % DASHES.length]), 80); };
  if (reduced) { at(1); return; }
  const t0 = performance.now() + 900, ms = Math.min(14000, Math.max(3500, totalKm * 28));   // waits for the camera, then about 28 ms per km
  frame = requestAnimationFrame(function draw(nowMs) {
    const k = Math.min(1, Math.max(0, (nowMs - t0) / ms));
    at(k);
    if (k < 1) frame = requestAnimationFrame(draw); else flow();
  });
}

// Layers load on first use; the checkbox, not the order of loads, decides what is visible.
const loading = new Map();
const setTerrain = explorerTerrain(map, reduced);
const checked = id => list.querySelector(`[data-id="${id}"]`)?.checked;
function paintLayer(layer) {
  const paint = layer.paint();
  if (!map.getTerrain()) return paint;
  if (layer.id === 'lakes') Object.assign(paint, { 'circle-pitch-alignment': 'map', 'circle-pitch-scale': 'map',
    'circle-color': '#47cfda', 'circle-stroke-color': '#194a60', 'circle-stroke-width': 1.4 });
  if (layer.id === 'glaciers') Object.assign(paint, { 'fill-color': '#c4e9f1', 'fill-opacity': 0.78, 'fill-outline-color': '#387589' });
  return paint;
}
function refreshLayers() {
  for (const layer of LAYERS) {
    if (!map.getLayer(layer.id)) continue;
    const paint = paintLayer(layer);
    if (layer.id === 'lakes' && !map.getTerrain()) Object.assign(paint, { 'circle-pitch-alignment': 'viewport', 'circle-pitch-scale': 'map' });
    for (const [key, value] of Object.entries(paint)) map.setPaintProperty(layer.id, key, value);
  }
}
function show(layer) {
  if (map.getLayer(layer.id)) return map.setLayoutProperty(layer.id, 'visibility', checked(layer.id) ? 'visible' : 'none');
  if (!checked(layer.id) || loading.has(layer.id)) return loading.get(layer.id);
  const job = layer.data().then(data => {
    if (layer.id === 'rivers') rivers = data;
    map.addSource(layer.id, { type: 'geojson', data });
    map.addLayer({ id: layer.id, type: layer.type, source: layer.id, paint: paintLayer(layer), layout: { visibility: checked(layer.id) ? 'visible' : 'none' } }, 'trace-casing');
  }, () => { loading.delete(layer.id); info.insertAdjacentHTML('afterbegin', `<p class="note warn">${esc(c.failed)}</p>`); });
  loading.set(layer.id, job);
  return job;
}
const toggle = (id, key, on, sym) => `<label class="check"><input type="checkbox" data-id="${id}"${on ? ' checked' : ''}> ${esc(c[key])}${sym ? symbol(sym) : ''}</label>`;
list.innerHTML = LAYERS.map(l => toggle(l.id, l.key, l.on, l.sym)).join('') + toggle('relief', 'relief', true) + toggle('tilt', 'tilt', false);
list.onchange = e => {
  const id = e.target.dataset.id, on = e.target.checked;
  if (id === 'relief') ['relief', 'hillshade'].forEach(l => map.setLayoutProperty(l, 'visibility', on ? 'visible' : 'none'));
  else if (id === 'tilt') { setTerrain(on); refreshLayers(); }
  else show(LAYERS.find(l => l.id === id));
};
addEventListener('themechange', refreshLayers);
matchMedia('(prefers-color-scheme: dark)').addEventListener('change', refreshLayers);

const catalogue = load('/data/atlas-flood-corridors/1.0.0/catalogue.json.gz').catch(() => ({ origins: [] }));
const clickable = () => LAYERS.filter(l => l.info && map.getLayer(l.id) && map.getLayoutProperty(l.id, 'visibility') !== 'none').map(l => l.id).reverse();
map.on('click', async e => {
  const pad = 8, hit = map.queryRenderedFeatures([[e.point.x - pad, e.point.y - pad], [e.point.x + pad, e.point.y + pad]], { layers: clickable() })[0];
  if (!hit) return;
  const layer = LAYERS.find(l => l.id === hit.layer.id), [title, rows] = layer.info(hit.properties);
  const target = layer.id === 'lakes' ? hit.geometry.coordinates : e.lngLat;
  if (layer.id === 'rivers' || layer.id === 'lakes') {
    const camera = { center: target, zoom: Math.max(map.getZoom(), 9.5), pitch: map.getPitch(), bearing: map.getBearing() };
    if (reduced) map.jumpTo(camera); else map.flyTo({ ...camera, duration: 1000 });
  }
  let extra = '';
  if (layer.id === 'rivers') extra = `<button type="button" class="primary" data-trace="${esc(hit.properties.source_id)}">${esc(c.trace)}</button>`;
  if (layer.id === 'lakes') { const o = (await catalogue).origins.find(o => o.lake?.glo_id === hit.properties.source_id); if (o) extra = `<a href="/scenarios/#flood=${esc(o.id)}">${esc(c.glofLink)}</a>`; }
  const p = popup(map, target, `<h3>${esc(title)}</h3><dl>${rows.map(([k, v]) => `<dt>${esc(k)}</dt><dd>${esc(v ?? c.unknown)}</dd>`).join('')}</dl>${extra}`);
  p.getElement().querySelector('[data-trace]')?.addEventListener('click', ev => { trace(ev.target.dataset.trace); p.remove(); });
});
for (const l of LAYERS) { map.on('mouseenter', l.id, () => { map.getCanvas().style.cursor = 'pointer'; }); map.on('mouseleave', l.id, () => { map.getCanvas().style.cursor = ''; }); }
// Search: the camera moves to the place and its details open where it is; a verified lake links to its scenario.
let found = null;
searchBox(document.getElementById('search'), { c, esc, num, lang, index: () => placeIndex(load, [COPY.en.searchLakeWord, COPY.ne.searchLakeWord]), pick: r => {
  found?.remove();
  flyTo(map, r, reduced);
  const extra = r.kind === 'lake' ? `<a href="/scenarios/#flood=${esc(r.id)}">${esc(c.glofLink)}</a>` : '';
  found = popup(map, r.p, placeHtml(r, { c, esc, num, lang }, extra));
} });
await Promise.all([...LAYERS.filter(l => l.on).map(show), peakLabels().catch(() => { info.insertAdjacentHTML('afterbegin', `<p class="note warn">${esc(c.failed)}</p>`); })]);
document.getElementById('map').dataset.ready = 'true';
