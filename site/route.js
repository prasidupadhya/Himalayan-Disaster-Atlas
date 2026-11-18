// A path on the map with its places: the districts it runs through light up and are named as the front reaches them,
// towns near it appear as it passes, and a glowing head marks where the front is. Shared by Scenarios and the Map trace.
import { c, esc, num, load, lang } from './app.js';
import { maplibregl } from './basemap.js';
import * as P from './places.js';

let cache;
/** On Nepali pages, district names as printed in Schedule 4 of the constitution, by P-code; English stays if they cannot load. */
const nepaliNames = () => lang !== 'ne' ? null : load('/data/nepal-district-names-ne/1.0.0/names.json')
  .then(d => new Map(d.districts.map(r => [r.pcode, r.name_ne])), () => null);
const named = (features, names) => !names ? features
  : features.map(f => ({ ...f, properties: { ...f.properties, name_en: f.properties.name, name: names.get(f.properties.pcode) ?? f.properties.name } }));
/** Districts, settlements and stream names, loaded once. */
export const routeData = () => cache ??= Promise.all([...['nepal-admin-districts/2.0.1', 'nepal-osm-settlements/1.0.0', 'nepal-river-names/1.0.0'].map(d => load(`/data/${d}/features.geojson.gz`)), nepaliNames()])
  .then(([districts, osm, geonames, names]) => { const d = named(districts.features, names); return { districts: d, find: P.districtFinder(d), places: P.settlements(osm), streams: P.streams(geonames) }; })
  .catch(e => { cache = null; throw e; });   // a failed load may be retried

export const province = name => c.provinces[name] ?? name;
/** "Gorkha and Tanahun (along their border)", "Manang", or "outside Nepal". */
export function stretchName(part) {
  const names = part.names.map(n => n ?? c.outsideNepal);
  return names.length === 1 ? names[0] : c.borderOf(names.slice(0, -1).join(', '), names.at(-1));
}

/** Where a front is, as a phrase that reads on its own: "in Lamjung, near Besisahar" or "outside Nepal". */
export function placeNow(part, town) {
  const outside = part.names.length === 1 && part.names[0] === null;
  return outside ? c.outsideNepal : town ? c.inNear(stretchName(part), town.name) : c.inPlace(stretchName(part));
}

/** The route in words. `time(km)` gives the arrival text for a distance, or is omitted where there is no timing. */
export function routeHtml(r, totalKm, time) {
  const t = km => time ? ` <span class="t">${esc(time(km))}</span>` : '', km = v => `${num(v)} km`;
  const towns = r.towns.map(p => `<li><strong>${esc(p.name)}</strong> <small>${esc(c.townAt(km(p.km), num(p.offKm, 1)))}</small>${t(p.km)}</li>`).join('');
  return `<section class="route"><h3>${esc(c.routeTitle)}</h3>
    <ol class="route-list">${r.parts.map(part => `<li><strong>${esc(stretchName(part))}</strong>${part.provinces.length ? ` <small>${esc(part.provinces.map(province).join(', '))}</small>` : ''}
      <small>${esc(c.kmRange(num(part.fromKm), num(part.toKm)))}</small>${t(part.fromKm)}</li>`).join('')}</ol>
    <p class="muted">${esc(r.leavesNepalKm !== null ? c.leavesNepal(km(r.leavesNepalKm)) : c.pathEnds(km(totalKm)))}</p>
    <h3>${esc(c.townsTitle)}</h3>${towns ? `<ul class="plain">${towns}</ul>` : `<p class="muted">${esc(c.noTowns)}</p>`}
    <p class="muted">${esc(c.villagesNear(num(r.villages)))}</p>
    ${r.rivers.length ? `<details><summary>${esc(c.streamsCount(num(r.rivers.length)))}</summary><p>${r.rivers.map(s => `${esc(s.name)} <small>(${km(s.km)})</small>`).join(', ')}</p></details>` : ''}
    <p class="src">${esc(c.routeSource)}</p></section>`;
}

/** A text label on the map. The style carries no font glyphs, so labels are DOM markers; add the class "on" to show one. */
export function mapLabel(map, p, text, cls = '') {
  const el = document.createElement('div'); el.className = `map-label ${cls}`; el.innerHTML = `<span>${esc(text)}</span>`;
  return { el, marker: new maplibregl.Marker({ element: el, anchor: 'bottom', offset: [0, -10] }).setLngLat(p).addTo(map) };
}

/** Layers and labels for one path. `before` is the layer the district shading sits under. */
export function routeStage(map, before) {
  const none = { type: 'FeatureCollection', features: [] };
  map.addSource('route-districts', { type: 'geojson', data: none });
  map.addSource('route-head', { type: 'geojson', data: none });
  map.addLayer({ id: 'route-districts', type: 'fill', source: 'route-districts', filter: ['<=', ['get', 'from'], -1], paint: { 'fill-color': '#1d5fa8', 'fill-opacity': 0.16 } }, before);
  map.addLayer({ id: 'route-districts-line', type: 'line', source: 'route-districts', filter: ['<=', ['get', 'from'], -1], paint: { 'line-color': '#ffffff', 'line-width': 1.5, 'line-opacity': 0.9 } }, before);
  map.addLayer({ id: 'route-glow', type: 'circle', source: 'route-head', paint: { 'circle-radius': ['get', 'r'], 'circle-color': '#ffd400', 'circle-opacity': ['get', 'o'], 'circle-blur': 0.6 } });
  map.addLayer({ id: 'route-head', type: 'circle', source: 'route-head', paint: { 'circle-radius': 7, 'circle-color': '#ffd400', 'circle-stroke-color': '#18232a', 'circle-stroke-width': 2 } });
  let markers = [], route = null, froms = [], lit = -1;
  const label = (p, text, cls, km) => ({ km, ...mapLabel(map, p, text, cls) });
  return {
    /** Draw the districts and labels of a described path; nothing is lit until progress() is called. */
    show(r) {
      this.clear(); route = r;
      const first = new Map();
      for (const part of r.parts) for (const f of part.features) if (!first.has(f.properties.name)) first.set(f.properties.name, { f, from: part.fromKm });
      map.getSource('route-districts').setData({ type: 'FeatureCollection', features: [...first.values()].map(({ f, from }) => ({ type: 'Feature', geometry: f.geometry, properties: { from } })) });
      froms = [...first.values()].map(x => x.from); lit = -1;
      markers = [...[...first.values()].map(({ f, from }) => label([f.properties.label_longitude, f.properties.label_latitude], f.properties.name, 'district', from)),
        ...r.towns.map(t => label(t.p, t.name, t.kind, t.km))];
    },
    /** Light everything the front has reached and return where it is now: "in Lamjung, near Besisahar". */
    progress(km, head) {
      if (!route) return '';
      // The layer filter changes only when another district is reached, not on every frame.
      const count = froms.filter(f => f <= km).length;
      if (count !== lit) { lit = count; for (const id of ['route-districts', 'route-districts-line']) map.setFilter(id, ['<=', ['get', 'from'], km]); }
      for (const m of markers) m.el.classList.toggle('on', m.km <= km);
      const pulse = performance.now() % 1400 / 1400;
      map.getSource('route-head').setData(head ? { type: 'Feature', geometry: { type: 'Point', coordinates: head }, properties: { r: 10 + 16 * pulse, o: 0.55 * (1 - pulse) } } : none);
      const part = route.parts.findLast(p => p.fromKm <= km) ?? route.parts[0], town = route.towns.findLast(t => t.km <= km && km - t.km <= 8);
      return placeNow(part, town);
    },
    clear() {
      markers.forEach(m => m.marker.remove()); markers = []; route = null; froms = []; lit = -1;
      for (const id of ['route-districts', 'route-districts-line']) map.setFilter(id, ['<=', ['get', 'from'], -1]);
      map.getSource('route-districts').setData(none); map.getSource('route-head').setData(none);
    },
  };
}
