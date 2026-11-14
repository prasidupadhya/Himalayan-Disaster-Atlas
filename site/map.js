import { c, esc, num, when, load } from './app.js';
import { baseMap, popup, color } from './basemap.js';

const D = id => `/data/${id}/features.geojson.gz`;
const days30 = new Date(Date.now() - 30 * 864e5).toISOString().slice(0, 10);
const USGS = `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=${days30}&minlatitude=26&maxlatitude=31&minlongitude=80&maxlongitude=89&minmagnitude=2.5`;
const STATUS = ['match', ['get', 'st'], 'ABOVE DANGER LEVEL', '#c62828', 'ABOVE WARNING LEVEL', '#ef8f00', 'BELOW WARNING LEVEL', '#2e7d4f', '#8a959c'];
const quakeCircle = (fill, scale) => ({ 'circle-color': fill, 'circle-opacity': 0.75, 'circle-stroke-color': '#fff', 'circle-stroke-width': 1,
  'circle-radius': ['interpolate', ['linear'], ['get', 'magnitude'], 2.5, 2 * scale, 5, 5 * scale, 7.8, 14 * scale] });
const gov = load('/data/gov/latest.json').then(g => Object.fromEntries(g.sources.map(s => [s.id, s.content]))).catch(() => ({}));

/** Each layer: where its data comes from, how it is drawn, and what its popup says. */
const LAYERS = [
  { id: 'rivers', key: 'riverNet', on: true, swatch: '--river', data: () => load(D('nepal-rivers-primary/1.0.0')), type: 'line',
    paint: () => ({ 'line-color': color('--river'), 'line-width': ['interpolate', ['linear'], ['get', 'flow_order'], 3, 0.6, 5, 1.4, 8, 3.5] }),
    info: p => [c.reach(p.source_id), [[c.flow, `${num(p.average_discharge_m3s, 1)} m³/s`], [c.order, num(p.flow_order)]]] },
  { id: 'lakes', key: 'lakes', on: true, swatch: '--lake', data: () => load(D('nepal-transboundary-glacial-lakes/1.0.0')), type: 'circle',
    paint: () => ({ 'circle-color': color('--lake'), 'circle-stroke-color': '#fff', 'circle-stroke-width': 0.6, 'circle-radius': ['interpolate', ['linear'], ['zoom'], 5, ['interpolate', ['linear'], ['get', 'area_km2'], 0, 1.5, 1, 5], 10, ['interpolate', ['linear'], ['get', 'area_km2'], 0, 4, 1, 14]] }),
    info: p => [p.lake_name ?? `${c.lake} ${p.source_id}`, [[c.area, `${num(p.area_km2, 3)} km²`], [c.elevation, `${num(p.elevation_mean_m)} m`], [c.connectivity, p.connectivity], [c.basin, p.basin], [c.country, p.country]]] },
  { id: 'riverStations', key: 'riverStations', on: true, swatch: '--ok', type: 'circle',
    data: async () => { const [fc, g] = await Promise.all([load(D('nepal-hydrology-stations/1.0.0')), gov]); const r = g['bipad-river'] ?? {};
      const stale = new Set((r.stale_alert_stations ?? []).map(s => s.id));
      fc.features.forEach(f => { const s = r.statuses?.[f.properties.source_id]; f.properties.st = stale.has(f.properties.source_id) ? 'OLD' : s?.[1] ?? 'UNKNOWN'; }); return fc; },
    paint: () => ({ 'circle-color': STATUS, 'circle-radius': 6, 'circle-stroke-color': '#fff', 'circle-stroke-width': 1.5 }),
    info: p => [p.station_name, [[c.basin, p.basin], [c.status, p.st === 'OLD' ? c.oldReading : p.st === 'UNKNOWN' ? c.unknown : p.st]]] },
  { id: 'rainStations', key: 'rainStations', on: false, swatch: '--river', type: 'circle',
    data: async () => { const [fc, g] = await Promise.all([load(D('nepal-rainfall-stations/1.0.0')), gov]);
      const wet = Object.fromEntries((g['bipad-rain']?.wettest_24h ?? []).map(s => [s.id, s]));
      return { type: 'FeatureCollection', features: fc.features.filter(f => wet[f.properties.source_id]).map(f => ({ ...f, properties: { ...f.properties, mm: wet[f.properties.source_id].rain_24h_mm } })) }; },
    paint: () => ({ 'circle-color': color('--river'), 'circle-stroke-color': '#fff', 'circle-stroke-width': 1.5, 'circle-radius': ['interpolate', ['linear'], ['get', 'mm'], 0, 4, 100, 14] }),
    info: p => [p.station_name, [[c.basin, p.basin], [c.h24, `${num(p.mm, 1)} mm`]]] },
  { id: 'quakesRecent', key: 'quakesRecent', on: true, swatch: '--bad', type: 'circle',
    data: async () => { const fc = await load(USGS); fc.features.forEach(f => { const p = f.properties; f.properties = { magnitude: p.mag, place_name: p.place, event_time: new Date(p.time).toISOString(), depth_km: f.geometry.coordinates[2] }; }); return fc; },
    paint: () => quakeCircle('#d93a2b', 1.2), info: p => quakeInfo(p) },
  { id: 'quakesHistory', key: 'quakesHistory', on: false, swatch: '--warn', data: () => load(D('nepal-region-earthquakes/1.0.0')), type: 'circle', paint: () => quakeCircle('#e08a1e', 1), info: p => quakeInfo(p) },
  { id: 'floods', key: 'floodsPast', on: false, swatch: '--river', data: () => load(D('nepal-reported-floods/1.0.0')), type: 'circle',
    paint: () => ({ 'circle-color': '#3f51b5', 'circle-radius': 3.5, 'circle-opacity': 0.7 }), info: p => [p.name, [[c.when, p.event_local_date ?? when(p.event_time)]]] },
  { id: 'slides', key: 'slidesPast', on: false, swatch: '--warn', data: () => load(D('nepal-reported-landslides/1.0.0')), type: 'circle',
    paint: () => ({ 'circle-color': '#7b4a1e', 'circle-radius': 3.5, 'circle-opacity': 0.7 }), info: p => [p.name, [[c.when, p.event_local_date ?? when(p.event_time)]]] },
  { id: 'glaciers', key: 'glaciers', on: false, swatch: '--surface', type: 'fill', paint: () => ({ 'fill-color': '#ffffff', 'fill-opacity': 0.75, 'fill-outline-color': '#7fb6d1' }),
    data: async () => ({ type: 'FeatureCollection', features: (await Promise.all(['west', 'central', 'east'].map(r => load(D(`nepal-glaciers-${r}/1.0.0`))))).flatMap(fc => fc.features) }),
    info: p => [p.glacier_name ?? p.source_id, [[c.area, `${num(p.area_km2, 2)} km²`], [c.elevation, `${num(p.elevation_min_m)}–${num(p.elevation_max_m)} m`]]] },
  { id: 'districts', key: 'districts', on: false, swatch: '--muted', data: () => load(D('nepal-admin-districts/2.0.1')), type: 'line', paint: () => ({ 'line-color': '#fff', 'line-width': 0.8, 'line-opacity': 0.8 }) },
];
function quakeInfo(p) { return [`M ${num(p.magnitude, 1)} · ${p.place_name ?? c.unknown}`, [[c.when, when(p.event_time)], [c.depth, `${num(p.depth_km)} km`]]]; }

const map = await baseMap('map', ['Rivers: HydroRIVERS / FAO', 'Lakes: Glacial Lake Observatory', 'Glaciers: RGI 7.0', 'Earthquakes: USGS', 'Stations and incidents: BIPAD']);
const info = document.getElementById('info'), list = document.getElementById('layers');
let rivers = null;

async function show(layer, visible) {
  if (!map.getLayer(layer.id)) {
    if (!visible) return;
    try { const data = await layer.data(); if (layer.id === 'rivers') rivers = data; map.addSource(layer.id, { type: 'geojson', data }); }
    catch { if (layer.id === 'quakesRecent') info.innerHTML = `<p class="note warn">${esc(c.liveFailed)}</p>`; return; }
    map.addLayer({ id: layer.id, type: layer.type, source: layer.id, paint: layer.paint() }, map.getLayer('trace') ? 'trace' : undefined);
  }
  map.setLayoutProperty(layer.id, 'visibility', visible ? 'visible' : 'none');
}
const toggle = (id, key, on, swatch) => `<label class="check"><input type="checkbox" data-id="${id}"${on ? ' checked' : ''}> ${esc(c[key])}${swatch ? `<span class="swatch" style="background:var(${swatch})"></span>` : ''}</label>`;
const dot = (fill, text) => `<span><i style="background:${fill}"></i>${esc(text)}</span>`;
list.innerHTML = LAYERS.map(l => toggle(l.id, l.key, l.on, l.swatch)).join('') + toggle('relief', 'relief', true) + toggle('tilt', 'tilt', false)
  + `<h3>${esc(c.riverStations)}</h3><div class="legend">${dot('#c62828', c.aboveDanger)}${dot('#ef8f00', c.aboveWarning)}${dot('#2e7d4f', c.belowWarning)}${dot('#8a959c', `${c.unknown} / ${c.oldReading}`)}</div>`;
list.onchange = e => {
  const id = e.target.dataset.id, on = e.target.checked;
  if (id === 'relief') ['relief', 'hillshade'].forEach(l => map.setLayoutProperty(l, 'visibility', on ? 'visible' : 'none'));
  else if (id === 'tilt') { map.setTerrain(on ? { source: 'dem', exaggeration: 1.4 } : null); map.easeTo({ pitch: on ? 60 : 0 }); on ? map.dragRotate.enable() : map.dragRotate.disable(); }
  else show(LAYERS.find(l => l.id === id), on);
};
for (const l of LAYERS) if (l.on) await show(l, true);
addEventListener('themechange', () => LAYERS.forEach(l => map.getLayer(l.id) && Object.entries(l.paint()).forEach(([k, v]) => map.setPaintProperty(l.id, k, v))));

// Downstream trace: follow each reach's published downstream link until it leaves the network.
map.addSource('trace', { type: 'geojson', data: { type: 'FeatureCollection', features: [] } });
map.addLayer({ id: 'trace', type: 'line', source: 'trace', paint: { 'line-color': '#ffd400', 'line-width': 5 }, layout: { 'line-cap': 'round' } });
function trace(id) {
  const byId = new Map(rivers.features.map(f => [f.properties.source_id, f])), path = [], seen = new Set();
  for (let f = byId.get(id); f && !seen.has(f.properties.source_id); f = f.properties.downstream_in_release ? byId.get(f.properties.downstream_id) : null) { seen.add(f.properties.source_id); path.push(f); }
  map.getSource('trace').setData({ type: 'FeatureCollection', features: path });
  const km = path.reduce((t, f) => t + f.properties.length_km, 0);
  info.innerHTML = `<p class="note">${esc(c.traced(num(km), num(path.length)))} ${esc(c.traceExit)}</p><button type="button" id="clear">${esc(c.clearTrace)}</button>`;
  document.getElementById('clear').onclick = () => { map.getSource('trace').setData({ type: 'FeatureCollection', features: [] }); info.innerHTML = ''; };
}

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
document.getElementById('map').dataset.ready = 'true';
