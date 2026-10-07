'use client';
import { useEffect, useRef, useState } from 'react';
import type { GeoJSONSource, Map } from 'maplibre-gl';
import { ADMIN_MANIFESTS, loadDataset } from '../../lib/datasets';

export interface ChoroplethFeature { id: string; fill: string; unknown: boolean; geometry: GeoJSON.Geometry; name: string }
const EMPTY: GeoJSON.FeatureCollection = { type: 'FeatureCollection', features: [] };

/** One choropleth: fills carry their class colour; UNKNOWN cells are dark with a dashed outline. Tables mirror every value. */
export function ChoroplethMap({ features, selected, onSelect, label, messages }: {
  features: ChoroplethFeature[]; selected: string | null; onSelect: (id: string) => void; label: string;
  messages: { loading: string; failed: string; noWebgl: string };
}) {
  const container = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map | null>(null);
  const select = useRef(onSelect);
  const [ready, setReady] = useState(false);
  const [failure, setFailure] = useState<'failed' | 'noWebgl' | null>(null);
  useEffect(() => { select.current = onSelect; }, [onSelect]);

  useEffect(() => {
    const controller = new AbortController();
    let map: Map | undefined;
    (async () => {
      try {
        const { Map: MapLibre, NavigationControl, setWorkerUrl, getVersion } = await import('maplibre-gl');
        if (controller.signal.aborted || !container.current) return;
        setWorkerUrl(`/vendor/maplibre-gl/${getVersion()}/maplibre-gl-worker.mjs`);
        map = new MapLibre({
          container: container.current, attributionControl: false, renderWorldCopies: false,
          style: { version: 8, sources: {}, layers: [{ id: 'background', type: 'background', paint: { 'background-color': '#14262f' } }] },
          bounds: [[79.9, 26.2], [88.3, 30.5]], fitBoundsOptions: { padding: 16 }, minZoom: 4, maxZoom: 10, maxBounds: [[70, 18], [98, 38]],
          pixelRatio: Math.min(window.devicePixelRatio || 1, 1.5), cooperativeGestures: false,
        });
        mapRef.current = map;
        map.addControl(new NavigationControl({ showCompass: false }), 'top-right');
        let loaded = false;
        map.on('error', () => { if (!loaded && !controller.signal.aborted) setFailure('failed'); });
        map.on('load', () => {
          if (!map || controller.signal.aborted) return;
          loaded = true;
          map.addSource('hz-fill', { type: 'geojson', data: EMPTY, promoteId: 'id' });
          map.addLayer({ id: 'hz-fill', type: 'fill', source: 'hz-fill', paint: { 'fill-color': ['get', 'fill'], 'fill-opacity': 0.9 } });
          map.addLayer({ id: 'hz-unknown', type: 'line', source: 'hz-fill', filter: ['==', ['get', 'unknown'], true], paint: { 'line-color': '#8aa0a6', 'line-width': 1, 'line-dasharray': [2, 2] } });
          map.addLayer({ id: 'hz-edge', type: 'line', source: 'hz-fill', paint: { 'line-color': '#14262f', 'line-width': 1 } });
          map.addLayer({ id: 'hz-selected', type: 'line', source: 'hz-fill', filter: ['==', ['get', 'id'], ''], paint: { 'line-color': '#ffffff', 'line-width': 3 } });
          map.on('click', 'hz-fill', event => { const id = event.features?.[0]?.properties?.id; if (id) select.current(String(id)); });
          map.on('mouseenter', 'hz-fill', () => { map!.getCanvas().style.cursor = 'pointer'; });
          map.on('mouseleave', 'hz-fill', () => { map!.getCanvas().style.cursor = ''; });
          setReady(true);
          void loadDataset(ADMIN_MANIFESTS[0], controller.signal).then(country => {
            if (!map || controller.signal.aborted) return;
            map.addSource('hz-country', { type: 'geojson', data: country.collection as GeoJSON.FeatureCollection });
            map.addLayer({ id: 'hz-country', type: 'line', source: 'hz-country', paint: { 'line-color': '#e4f2f4', 'line-width': 1.6 } }, 'hz-selected');
          }).catch(() => undefined);
        });
      } catch {
        if (!controller.signal.aborted) setFailure('noWebgl');
      }
    })();
    return () => { controller.abort(); map?.remove(); mapRef.current = null; };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!ready || !map) return;
    (map.getSource('hz-fill') as GeoJSONSource | undefined)?.setData({ type: 'FeatureCollection', features: features.map(f => ({ type: 'Feature', properties: { id: f.id, fill: f.fill, unknown: f.unknown, name: f.name }, geometry: f.geometry })) });
  }, [ready, features]);
  useEffect(() => {
    const map = mapRef.current;
    if (!ready || !map) return;
    map.setFilter('hz-selected', ['==', ['get', 'id'], selected ?? '']);
  }, [ready, selected]);

  return <div className="hz-map" data-map-state={failure ? 'unavailable' : ready ? 'ready' : 'loading'}>
    <div ref={container} className="map" role="region" aria-label={label} />
    {!ready && !failure && <p className="hz-map-status" role="status">{messages.loading}</p>}
    {failure && <p className="hz-map-status hz-map-failure" role="status">{messages[failure]}</p>}
  </div>;
}
