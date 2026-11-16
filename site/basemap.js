import * as maplibregl from '/vendor/maplibre-gl/maplibre-gl.mjs';
import { load } from './app.js';

maplibregl.setWorkerUrl('/vendor/maplibre-gl/maplibre-gl-worker.mjs');
export { maplibregl };
export const NEPAL = [[80.0, 26.3], [88.3, 30.5]];
const TERRAIN = '/data/nepal-terrain/1.0.0';

/** Resolves a CSS colour token (light-dark() included) to a value MapLibre understands. */
export function color(token) {
  const probe = document.body.appendChild(document.createElement('i'));
  probe.style.color = `var(${token})`;
  const v = getComputedStyle(probe).color; probe.remove();
  // Browsers report token colours in oklch(), which MapLibre cannot read: paint one pixel and read it back as rgb.
  const ctx = Object.assign(document.createElement('canvas'), { width: 1, height: 1 }).getContext('2d', { willReadFrequently: true });
  ctx.fillStyle = v; ctx.fillRect(0, 0, 1, 1);
  const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data;
  return `rgba(${r}, ${g}, ${b}, ${(a / 255).toFixed(3)})`;
}
const dark = () => matchMedia('(prefers-color-scheme: dark)').matches && document.documentElement.dataset.theme !== 'light' || document.documentElement.dataset.theme === 'dark';

/** A map of Nepal on verified terrain with country and province borders. Resolves once the map is ready. */
export async function baseMap(container, attribution) {
  const meta = (await load(`${TERRAIN}/manifest.json`)).metadata;
  // East and west the view stays inside the terrain's coverage, so its edge never shows as a hard line.
  // North and south are left looser: a tall, narrow phone map needs the room to fit the whole country.
  const map = new maplibregl.Map({
    container, bounds: NEPAL, fitBoundsOptions: { padding: 12 }, maxBounds: [[meta.spatial_coverage.bbox[0] + 0.05, 19], [meta.spatial_coverage.bbox[2] - 0.05, 35]], minZoom: 4, maxPitch: 70,
    attributionControl: { compact: true, customAttribution: [`Terrain: Copernicus DEM GLO-90`, 'Boundaries: Survey Department of Nepal / OCHA', ...attribution] },
    style: { version: 8, sources: {
      dem: { type: 'raster-dem', tiles: [`${location.origin}${TERRAIN}/{z}/{x}/{y}.png`], tileSize: 256, minzoom: 5, maxzoom: 9, encoding: 'mapbox', bounds: meta.spatial_coverage.bbox },
    }, layers: [{ id: 'bg', type: 'background', paint: { 'background-color': color('--color-paper-3') } }] },
  });
  map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), 'top-right');
  map.dragRotate.disable(); map.touchZoomRotate.disableRotation();
  await new Promise(r => map.once('load', r));
  // Fit again once the container has its final size, so the whole country shows on a phone too.
  map.resize(); map.fitBounds(NEPAL, { padding: 12, duration: 0 });
  map.getContainer().querySelector('.maplibregl-compact-show')?.classList.remove('maplibregl-compact-show');
  // Borders are context: if one fails to load, the map still works without it.
  const [country, provinces] = await Promise.all(['country', 'provinces'].map(n => load(`/data/nepal-admin-${n}/2.0.1/features.geojson.gz`).catch(() => ({ type: 'FeatureCollection', features: [] }))));
  map.addSource('country', { type: 'geojson', data: country });
  map.addSource('provinces', { type: 'geojson', data: provinces });
  // One-degree graticule, as on a survey sheet.
  const line = coordinates => ({ type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates } });
  map.addSource('graticule', { type: 'geojson', data: { type: 'FeatureCollection', features: [
    ...Array.from({ length: 13 }, (_, i) => line([[78 + i, 24], [78 + i, 33]])), ...Array.from({ length: 10 }, (_, i) => line([[76, 24 + i], [92, 24 + i]]))] } });
  map.addLayer({ id: 'relief', type: 'color-relief', source: 'dem', paint: { 'color-relief-opacity': 0.85, 'color-relief-color': ['interpolate', ['linear'], ['elevation'],
    0, '#5f8a62', 800, '#86a26b', 2000, '#ab9f72', 3500, '#9c8670', 4800, '#c8c4c0', 6000, '#f4f6f8'] } });
  map.addLayer({ id: 'hillshade', type: 'hillshade', source: 'dem', paint: { 'hillshade-exaggeration': 0.6, 'hillshade-shadow-color': '#0b1a22', 'hillshade-highlight-color': '#ffffff' } });
  map.addLayer({ id: 'graticule', type: 'line', source: 'graticule', paint: { 'line-color': '#18232a', 'line-opacity': 0.18, 'line-width': 0.7 } });
  map.addLayer({ id: 'provinces', type: 'line', source: 'provinces', paint: { 'line-color': '#fff', 'line-opacity': 0.7, 'line-width': 1, 'line-dasharray': [3, 2] } });
  map.addLayer({ id: 'country', type: 'line', source: 'country', paint: { 'line-color': '#18232a', 'line-width': 2 } });
  const theme = () => {
    const d = dark();
    map.setPaintProperty('bg', 'background-color', color('--color-paper-3'));
    map.setPaintProperty('relief', 'color-relief-opacity', d ? 0.45 : 0.85);
    map.setPaintProperty('country', 'line-color', d ? '#e3e7e1' : '#18232a');
    map.setPaintProperty('graticule', 'line-color', d ? '#e3e7e1' : '#18232a');
  };
  theme(); addEventListener('themechange', theme); matchMedia('(prefers-color-scheme: dark)').addEventListener('change', theme);
  return map;
}

export const popup = (map, lngLat, html) => new maplibregl.Popup({ maxWidth: '300px', focusAfterOpen: false }).setLngLat(lngLat).setHTML(html).addTo(map);
