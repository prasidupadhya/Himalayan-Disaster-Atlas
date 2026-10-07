'use client';
import { useEffect, useRef, useState } from 'react';
import type { GeoJSONSource, Map } from 'maplibre-gl';
import { ADMIN_MANIFESTS, loadDataset } from '../../lib/datasets';
import { FORECAST_CLASSES, gridCellPolygon, type EarthquakeRow, type ForecastCell, type Freshness } from '../../lib/live-conditions';

export interface LiveMapLayer<T> { rows: T[]; freshness: Freshness }
export interface LiveMapProps {
  earthquakes: LiveMapLayer<EarthquakeRow> | null;
  forecast: LiveMapLayer<ForecastCell> | null;
  visible: { earthquakes: boolean; forecast: boolean };
}

const SOURCES = { outline: 'live-nepal-outline', forecast: 'live-forecast-cells', earthquakes: 'live-earthquakes' } as const;
const STALE_OPACITY = 0.35;

function forecastCollection(layer: LiveMapLayer<ForecastCell> | null): GeoJSON.FeatureCollection {
  return { type: 'FeatureCollection', features: (layer?.rows ?? []).filter(cell => cell.coordinates).map(cell => ({ type: 'Feature', id: cell.id, properties: { id: cell.id, value: cell.value, unknown: cell.value === null }, geometry: { type: 'Polygon', coordinates: gridCellPolygon(cell.coordinates!) } })) };
}
function earthquakeCollection(layer: LiveMapLayer<EarthquakeRow> | null): GeoJSON.FeatureCollection {
  return { type: 'FeatureCollection', features: (layer?.rows ?? []).filter(row => row.coordinates).map(row => ({ type: 'Feature', id: row.id, properties: { id: row.id, label: row.label, magnitude: row.magnitude, type: row.magnitudeType, observed: row.observedAt }, geometry: { type: 'Point', coordinates: row.coordinates! } })) };
}

export function LiveMap({ earthquakes, forecast, visible }: LiveMapProps) {
  const container = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map | null>(null);
  const [ready, setReady] = useState(false);
  const [failure, setFailure] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    let map: Map | undefined;
    async function init() {
      try {
        const { Map: MapLibre, NavigationControl, Popup, setWorkerUrl, getVersion } = await import('maplibre-gl');
        if (controller.signal.aborted || !container.current) return;
        setWorkerUrl(`/vendor/maplibre-gl/${getVersion()}/maplibre-gl-worker.mjs`);
        map = new MapLibre({
          container: container.current,
          style: { version: 8, sources: {}, layers: [{ id: 'background', type: 'background', paint: { 'background-color': '#152737' } }] },
          bounds: [[79.6, 25.8], [89.4, 31.2]], fitBoundsOptions: { padding: 16 }, minZoom: 3, maxZoom: 10,
          maxBounds: [[60, 10], [110, 45]], renderWorldCopies: false, attributionControl: false,
          pixelRatio: Math.min(window.devicePixelRatio || 1, 1.5),
        });
        mapRef.current = map;
        map.addControl(new NavigationControl({ showCompass: false }), 'top-right');
        map.on('error', () => { if (!controller.signal.aborted) setFailure('The interactive map could not render. Every verified record remains listed in the tables below.'); });
        map.on('load', () => {
          if (controller.signal.aborted || !map) return;
          map.addSource(SOURCES.forecast, { type: 'geojson', data: { type: 'FeatureCollection', features: [] } });
          map.addLayer({ id: 'live-forecast-fill', type: 'fill', source: SOURCES.forecast, filter: ['==', ['get', 'unknown'], false], paint: {
            'fill-color': ['step', ['get', 'value'], FORECAST_CLASSES[0].color, ...FORECAST_CLASSES.slice(1).flatMap(item => [item.min, item.color])] as never,
            'fill-opacity': 0.82,
          } });
          map.addLayer({ id: 'live-forecast-unknown', type: 'line', source: SOURCES.forecast, filter: ['==', ['get', 'unknown'], true], paint: { 'line-color': '#9fb4bd', 'line-width': 0.8, 'line-dasharray': [2, 2] } });
          map.addSource(SOURCES.earthquakes, { type: 'geojson', data: { type: 'FeatureCollection', features: [] } });
          map.addLayer({ id: 'live-earthquakes', type: 'circle', source: SOURCES.earthquakes, paint: {
            'circle-radius': ['case', ['==', ['get', 'magnitude'], null], 5, ['interpolate', ['linear'], ['get', 'magnitude'], 2, 4, 5, 9, 7, 15]],
            'circle-color': '#f0b43c', 'circle-stroke-color': '#0b1d22', 'circle-stroke-width': 1.5,
          } });
          map.on('click', 'live-earthquakes', event => {
            const properties = event.features?.[0]?.properties;
            if (!properties || !map) return;
            const element = document.createElement('div');
            element.className = 'live-map-popup';
            const title = document.createElement('strong'); title.textContent = properties.label || 'Location label UNKNOWN';
            const detail = document.createElement('p'); detail.textContent = `REPORTED · magnitude ${properties.magnitude ?? 'UNKNOWN'} ${properties.type ?? ''} · ${properties.observed ?? 'time UNKNOWN'}`;
            element.append(title, detail);
            new Popup({ closeButton: true, maxWidth: '260px' }).setLngLat(event.lngLat).setDOMContent(element).addTo(map);
          });
          map.on('mouseenter', 'live-earthquakes', () => { map!.getCanvas().style.cursor = 'pointer'; });
          map.on('mouseleave', 'live-earthquakes', () => { map!.getCanvas().style.cursor = ''; });
          setReady(true);
          // The country outline is verified context only; live layers do not depend on it.
          void loadDataset(ADMIN_MANIFESTS[0], controller.signal).then(dataset => {
            if (controller.signal.aborted || !map) return;
            map.addSource(SOURCES.outline, { type: 'geojson', data: dataset.collection as GeoJSON.FeatureCollection });
            map.addLayer({ id: 'live-nepal-outline', type: 'line', source: SOURCES.outline, paint: { 'line-color': '#d8ece9', 'line-width': 1.4 } }, 'live-earthquakes');
          }).catch(() => undefined);
        });
      } catch {
        if (!controller.signal.aborted) setFailure('Interactive mapping is unavailable in this browser (WebGL could not start). Every verified record remains listed in the tables below.');
      }
    }
    void init();
    return () => { controller.abort(); map?.remove(); mapRef.current = null; };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!ready || !map) return;
    (map.getSource(SOURCES.forecast) as GeoJSONSource | undefined)?.setData(forecastCollection(forecast));
    (map.getSource(SOURCES.earthquakes) as GeoJSONSource | undefined)?.setData(earthquakeCollection(earthquakes));
    const forecastOpacity = forecast?.freshness === 'STALE' ? STALE_OPACITY : 0.82;
    map.setPaintProperty('live-forecast-fill', 'fill-opacity', forecastOpacity);
    map.setPaintProperty('live-earthquakes', 'circle-opacity', earthquakes?.freshness === 'STALE' ? 0.5 : 1);
    map.setPaintProperty('live-earthquakes', 'circle-stroke-opacity', earthquakes?.freshness === 'STALE' ? 0.5 : 1);
    for (const id of ['live-forecast-fill', 'live-forecast-unknown']) map.setLayoutProperty(id, 'visibility', visible.forecast && forecast ? 'visible' : 'none');
    map.setLayoutProperty('live-earthquakes', 'visibility', visible.earthquakes && earthquakes ? 'visible' : 'none');
  }, [ready, earthquakes, forecast, visible]);

  return <div className="live-map-shell" data-map-state={failure ? 'unavailable' : ready ? 'ready' : 'loading'}>
    <div ref={container} className="map" role="region" aria-label="Map of verified live layers. All mapped records are listed in the tables below." />
    {!ready && !failure && <p className="live-map-status" role="status">Loading map…</p>}
    {failure && <p className="live-map-status live-map-failure" role="status">{failure}</p>}
  </div>;
}
