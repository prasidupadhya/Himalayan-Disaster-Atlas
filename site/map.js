import { c, esc, num, load, failed } from './app.js';
import { baseMap, popup, color } from './basemap.js';

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
try { map = await baseMap('map', ['Rivers: HydroRIVERS / FAO', 'Lakes: Glacial Lake Observatory', 'Glaciers: RGI 7.0']); }
catch { failed(info, () => location.reload()); throw new Error('map unavailable'); }

// Downstream trace: follow each reach's published downstream link until it leaves the network.
map.addSource('trace', { type: 'geojson', data: { type: 'FeatureCollection', features: [] } });
map.addLayer({ id: 'trace', type: 'line', source: 'trace', paint: { 'line-color': '#ffd400', 'line-width': 5 }, layout: { 'line-cap': 'round' } });
let rivers = null;
function trace(id) {
  const byId = new Map(rivers.features.map(f => [f.properties.source_id, f])), path = [], seen = new Set();
  for (let f = byId.get(id); f && !seen.has(f.properties.source_id); f = f.properties.downstream_in_release ? byId.get(f.properties.downstream_id) : null) { seen.add(f.properties.source_id); path.push(f); }
  map.getSource('trace').setData({ type: 'FeatureCollection', features: path });
  info.innerHTML = `<p class="note">${esc(c.traced(num(path.reduce((t, f) => t + f.properties.length_km, 0)), num(path.length)))} ${esc(c.traceExit)}</p><button type="button" id="clear">${esc(c.clearTrace)}</button>`;
  document.getElementById('clear').onclick = () => { map.getSource('trace').setData({ type: 'FeatureCollection', features: [] }); info.innerHTML = ''; };
}

// Layers load on first use; the checkbox, not the order of loads, decides what is visible.
const loading = new Map();
const checked = id => list.querySelector(`[data-id="${id}"]`)?.checked;
function show(layer) {
  if (map.getLayer(layer.id)) return map.setLayoutProperty(layer.id, 'visibility', checked(layer.id) ? 'visible' : 'none');
  if (!checked(layer.id) || loading.has(layer.id)) return loading.get(layer.id);
  const job = layer.data().then(data => {
    if (layer.id === 'rivers') rivers = data;
    map.addSource(layer.id, { type: 'geojson', data });
    map.addLayer({ id: layer.id, type: layer.type, source: layer.id, paint: layer.paint(), layout: { visibility: checked(layer.id) ? 'visible' : 'none' } }, 'trace');
  }, () => { loading.delete(layer.id); info.insertAdjacentHTML('afterbegin', `<p class="note warn">${esc(c.failed)}</p>`); });
  loading.set(layer.id, job);
  return job;
}
const toggle = (id, key, on, sym) => `<label class="check"><input type="checkbox" data-id="${id}"${on ? ' checked' : ''}> ${esc(c[key])}${sym ? symbol(sym) : ''}</label>`;
list.innerHTML = LAYERS.map(l => toggle(l.id, l.key, l.on, l.sym)).join('') + toggle('relief', 'relief', true) + toggle('tilt', 'tilt', false)
  ;
list.onchange = e => {
  const id = e.target.dataset.id, on = e.target.checked;
  if (id === 'relief') ['relief', 'hillshade'].forEach(l => map.setLayoutProperty(l, 'visibility', on ? 'visible' : 'none'));
  else if (id === 'tilt') { map.setTerrain(on ? { source: 'dem', exaggeration: 1.4 } : null); map.easeTo({ pitch: on ? 60 : 0 }); on ? map.dragRotate.enable() : map.dragRotate.disable(); }
  else show(LAYERS.find(l => l.id === id));
};
addEventListener('themechange', () => LAYERS.forEach(l => map.getLayer(l.id) && Object.entries(l.paint()).forEach(([k, v]) => map.setPaintProperty(l.id, k, v))));

const catalogue = load('/data/atlas-flood-corridors/1.0.0/catalogue.json.gz').catch(() => ({ origins: [] }));
const clickable = () => LAYERS.filter(l => l.info && map.getLayer(l.id) && map.getLayoutProperty(l.id, 'visibility') !== 'none').map(l => l.id).reverse();
map.on('click', async e => {
  const pad = 8, hit = map.queryRenderedFeatures([[e.point.x - pad, e.point.y - pad], [e.point.x + pad, e.point.y + pad]], { layers: clickable() })[0];
  if (!hit) return;
  const layer = LAYERS.find(l => l.id === hit.layer.id), [title, rows] = layer.info(hit.properties);
  let extra = '';
  if (layer.id === 'rivers') extra = `<button type="button" class="primary" data-trace="${esc(hit.properties.source_id)}">${esc(c.trace)}</button>`;
  if (layer.id === 'lakes') { const o = (await catalogue).origins.find(o => o.lake?.glo_id === hit.properties.source_id); if (o) extra = `<a href="/scenarios/#flood=${esc(o.id)}">${esc(c.glofLink)}</a>`; }
  const p = popup(map, e.lngLat, `<h3>${esc(title)}</h3><dl>${rows.map(([k, v]) => `<dt>${esc(k)}</dt><dd>${esc(v ?? c.unknown)}</dd>`).join('')}</dl>${extra}`);
  p.getElement().querySelector('[data-trace]')?.addEventListener('click', ev => { trace(ev.target.dataset.trace); p.remove(); });
});
for (const l of LAYERS) { map.on('mouseenter', l.id, () => { map.getCanvas().style.cursor = 'pointer'; }); map.on('mouseleave', l.id, () => { map.getCanvas().style.cursor = ''; }); }
await Promise.all(LAYERS.filter(l => l.on).map(show));
document.getElementById('map').dataset.ready = 'true';
