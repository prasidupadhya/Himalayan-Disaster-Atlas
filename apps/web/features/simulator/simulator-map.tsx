'use client';
import { useEffect, useRef, useState } from 'react';
import type { GeoJSONSource, Map, Marker } from 'maplibre-gl';
import { ADMIN_MANIFESTS, loadDataset } from '../../lib/datasets';

export type Corners = [[number, number], [number, number], [number, number], [number, number]];
export interface MapScene {
  origins?: Array<{ id: string; label: string; coordinates: [number, number]; kind: 'glof' | 'river' | 'event'; selected: boolean }>;
  corridors?: Array<{ width: number; geometry: GeoJSON.Geometry }>;
  path?: GeoJSON.Geometry | null;
  checkpoints?: Array<{ label: string; coordinates: [number, number] }>;
  /** Canvas raster (no data: URL fetch, which the site CSP forbids). Corners are linear in web-mercator. */
  shaking?: { canvas: HTMLCanvasElement; coordinates: Corners } | null;
  epicentre?: [number, number] | null;
  rupture?: [number, number][] | null;
  fit?: [number, number, number, number] | null;
}
const EMPTY: GeoJSON.FeatureCollection = { type: 'FeatureCollection', features: [] };
const CORRIDOR_SHADES = ['#9fd7e4', '#5fb3cb', '#2f86a6'];
const SOURCES = ['sim-corridors', 'sim-path', 'sim-origins', 'sim-epicentre', 'sim-rupture'] as const;

export interface MapMessages { loading: string; failed: string; noWebgl: string }
export function SimulatorMap({ scene, onPick, onOrigin, label, messages }: { scene: MapScene; onPick?: (lon: number, lat: number) => void; onOrigin?: (id: string) => void; label: string; messages: MapMessages }) {
  const container = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map | null>(null);
  const handlers = useRef({ onPick, onOrigin });
  const markers = useRef<Marker[]>([]);
  const [ready, setReady] = useState(false);
  const [failure, setFailure] = useState<'failed' | 'noWebgl' | null>(null);
  useEffect(() => { handlers.current = { onPick, onOrigin }; }, [onPick, onOrigin]);

  useEffect(() => {
    const controller = new AbortController();
    let map: Map | undefined;
    async function init() {
      try {
        const { Map: MapLibre, NavigationControl, setWorkerUrl, getVersion } = await import('maplibre-gl');
        if (controller.signal.aborted || !container.current) return;
        setWorkerUrl(`/vendor/maplibre-gl/${getVersion()}/maplibre-gl-worker.mjs`);
        map = new MapLibre({
          container: container.current, attributionControl: false, renderWorldCopies: false,
          style: { version: 8, sources: {}, layers: [{ id: 'background', type: 'background', paint: { 'background-color': '#14262f' } }] },
          bounds: [[79.6, 25.9], [88.6, 30.7]], fitBoundsOptions: { padding: 12 }, minZoom: 3, maxZoom: 12, maxBounds: [[66, 15], [102, 40]],
          pixelRatio: Math.min(window.devicePixelRatio || 1, 1.5),
        });
        mapRef.current = map;
        map.addControl(new NavigationControl({ showCompass: false }), 'top-right');
        let loaded = false;
        // Only a failure before the first render is fatal; later source errors are non-blocking.
        map.on('error', () => { if (!loaded && !controller.signal.aborted) setFailure('failed'); });
        map.on('load', () => {
          if (!map || controller.signal.aborted) return;
          loaded = true;
          for (const id of SOURCES) map.addSource(id, { type: 'geojson', data: EMPTY });
          map.addLayer({ id: 'sim-corridors', type: 'fill', source: 'sim-corridors', paint: { 'fill-color': ['get', 'shade'], 'fill-opacity': 0.42, 'fill-outline-color': '#d9f1f6' } });
          map.addLayer({ id: 'sim-path', type: 'line', source: 'sim-path', paint: { 'line-color': '#f3fbfd', 'line-width': 2, 'line-dasharray': [2, 1.5] } });
          map.addLayer({ id: 'sim-rupture', type: 'line', source: 'sim-rupture', paint: { 'line-color': '#ffffff', 'line-width': 4 } });
          map.addLayer({ id: 'sim-origins', type: 'circle', source: 'sim-origins', paint: {
            'circle-radius': ['case', ['get', 'selected'], 9, 6],
            'circle-color': ['match', ['get', 'kind'], 'glof', '#9ee0ff', 'river', '#ffd27a', '#ff8f5a'],
            'circle-stroke-color': ['case', ['get', 'selected'], '#ffffff', '#0b1d22'], 'circle-stroke-width': ['case', ['get', 'selected'], 3, 1.5],
          } });
          map.addLayer({ id: 'sim-epicentre', type: 'circle', source: 'sim-epicentre', paint: { 'circle-radius': 8, 'circle-color': '#ffffff', 'circle-stroke-color': '#a8440f', 'circle-stroke-width': 4 } });
          map.on('click', 'sim-origins', event => { const id = event.features?.[0]?.properties?.id; if (id) handlers.current.onOrigin?.(String(id)); });
          map.on('click', event => {
            if (map!.queryRenderedFeatures(event.point, { layers: ['sim-origins'] }).length) return;
            handlers.current.onPick?.(event.lngLat.lng, event.lngLat.lat);
          });
          map.on('mouseenter', 'sim-origins', () => { map!.getCanvas().style.cursor = 'pointer'; });
          map.on('mouseleave', 'sim-origins', () => { map!.getCanvas().style.cursor = ''; });
          setReady(true);
          // Verified administrative context; the simulation does not depend on it.
          void Promise.all([loadDataset(ADMIN_MANIFESTS[0], controller.signal), loadDataset(ADMIN_MANIFESTS[1], controller.signal)]).then(([country, provinces]) => {
            if (!map || controller.signal.aborted) return;
            map.addSource('sim-provinces', { type: 'geojson', data: provinces.collection as GeoJSON.FeatureCollection });
            map.addLayer({ id: 'sim-provinces', type: 'line', source: 'sim-provinces', paint: { 'line-color': '#5f7f88', 'line-width': 0.8 } }, 'sim-corridors');
            map.addSource('sim-country', { type: 'geojson', data: country.collection as GeoJSON.FeatureCollection });
            map.addLayer({ id: 'sim-country', type: 'line', source: 'sim-country', paint: { 'line-color': '#cfe7ea', 'line-width': 1.4 } }, 'sim-corridors');
          }).catch(() => undefined);
        });
      } catch {
        if (!controller.signal.aborted) setFailure('noWebgl');
      }
    }
    void init();
    return () => { controller.abort(); markers.current.forEach(m => m.remove()); map?.remove(); mapRef.current = null; };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!ready || !map) return;
    const set = (id: string, data: GeoJSON.FeatureCollection) => (map.getSource(id) as GeoJSONSource | undefined)?.setData(data);
    const widths = [...(scene.corridors ?? [])].sort((a, b) => b.width - a.width);
    set('sim-corridors', { type: 'FeatureCollection', features: widths.map((c, i) => ({ type: 'Feature', properties: { width: c.width, shade: CORRIDOR_SHADES[Math.min(i, 2)] }, geometry: c.geometry })) });
    set('sim-path', { type: 'FeatureCollection', features: scene.path ? [{ type: 'Feature', properties: {}, geometry: scene.path }] : [] });
    set('sim-origins', { type: 'FeatureCollection', features: (scene.origins ?? []).map(o => ({ type: 'Feature', properties: { id: o.id, kind: o.kind, selected: o.selected, label: o.label }, geometry: { type: 'Point', coordinates: o.coordinates } })) });
    set('sim-epicentre', { type: 'FeatureCollection', features: scene.epicentre ? [{ type: 'Feature', properties: {}, geometry: { type: 'Point', coordinates: scene.epicentre } }] : [] });
    set('sim-rupture', { type: 'FeatureCollection', features: scene.rupture && scene.rupture.length > 1 ? [{ type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates: scene.rupture } }] : [] });
    if (map.getLayer('sim-shaking')) map.removeLayer('sim-shaking');
    if (map.getSource('sim-shaking')) map.removeSource('sim-shaking');
    if (scene.shaking) {
      map.addSource('sim-shaking', { type: 'canvas', canvas: scene.shaking.canvas, coordinates: scene.shaking.coordinates, animate: false });
      map.addLayer({ id: 'sim-shaking', type: 'raster', source: 'sim-shaking', paint: { 'raster-opacity': 0.82, 'raster-resampling': 'nearest', 'raster-fade-duration': 0 } }, map.getLayer('sim-provinces') ? 'sim-provinces' : 'sim-corridors');
    }
    markers.current.forEach(m => m.remove()); markers.current = [];
    if (scene.checkpoints?.length) void import('maplibre-gl').then(({ Marker }) => {
      if (mapRef.current !== map) return;
      markers.current = scene.checkpoints!.map(c => {
        const el = document.createElement('span'); el.className = 'sim-checkpoint-label'; el.textContent = c.label;
        return new Marker({ element: el, anchor: 'left', offset: [8, 0] }).setLngLat(c.coordinates).addTo(map);
      });
    });
    if (scene.fit) map.fitBounds([[scene.fit[0], scene.fit[1]], [scene.fit[2], scene.fit[3]]], { padding: 40, maxZoom: 9, duration: 0 });
  }, [ready, scene]);

  return <div className="sim-map" data-map-state={failure ? 'unavailable' : ready ? 'ready' : 'loading'}>
    <div ref={container} className="map" role="region" aria-label={label} />
    {!ready && !failure && <p className="sim-map-status" role="status">{messages.loading}</p>}
    {failure && <p className="sim-map-status sim-map-failure" role="status">{messages[failure]}</p>}
  </div>;
}
