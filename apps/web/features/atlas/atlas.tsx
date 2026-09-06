'use client';
import { useEffect, useRef, useState } from 'react';
import type { Map } from 'maplibre-gl';
import { formatMeasurement, isStale, type Dataset } from '../../../../packages/contracts';
import { DataState } from '../../components/data-state';
import { Evidence } from '../../components/evidence';
import { loadDataset, SAMPLE_MANIFEST, UnavailableError } from '../../lib/datasets';
import { mountDataset } from '../../lib/map-layers';
import type { Resource } from '../../lib/resource';

export function Atlas() {
  const container = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map | null>(null);
  const layerRef = useRef<ReturnType<typeof mountDataset> | null>(null);
  const [resource, setResource] = useState<Resource<Dataset>>({ status: 'loading' });
  const [mapError, setMapError] = useState<string | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const [visible, setVisible] = useState(true);
  const visibleRef = useRef(true);
  const [selected, setSelected] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    let map: Map | undefined;
    let disposeLayer: (() => void) | undefined;
    const init = async () => {
      try {
        const dataset = await loadDataset(SAMPLE_MANIFEST, controller.signal);
        if (controller.signal.aborted) return;
        setResource({ status: isStale(dataset.metadata) ? 'stale' : dataset.collection.features.length ? 'ready' : 'empty', data: dataset });
        try {
          const { Map: MapLibre, NavigationControl, setWorkerUrl, getVersion } = await import('maplibre-gl');
          if (controller.signal.aborted || !container.current) return;
          setWorkerUrl(`/vendor/maplibre-gl/${getVersion()}/maplibre-gl-worker.mjs`);
          map = new MapLibre({ container: container.current, style: { version: 8, sources: {}, layers: [{ id: 'background', type: 'background', paint: { 'background-color': '#152737' } }] },
            center: [86, 28], zoom: 8, minZoom: 5, maxZoom: 15, maxBounds: [[79, 25], [90, 32]], renderWorldCopies: false });
          mapRef.current = map;
          map.addControl(new NavigationControl({ showCompass: false }), 'top-right');
          map.on('error', () => { if (!controller.signal.aborted) setMapError('The map could not render. You can still inspect the dataset below.'); });
          map.on('load', () => {
            if (controller.signal.aborted || !map) return;
            const mounted = mountDataset(map, dataset);
            layerRef.current = mounted;
            disposeLayer = mounted.dispose;
            mounted.setVisible(visibleRef.current);
            const [w, s, e, n] = dataset.metadata.spatial_coverage.bbox;
            map.fitBounds([[w, s], [e, n]], { padding: 60, duration: 0 });
            map.on('click', mounted.layers, event => { const id = event.features?.[0]?.id; if (id !== undefined) setSelected(String(id)); });
            map.once('idle', () => { if (!controller.signal.aborted) setMapReady(true); });
          });
        } catch {
          if (!controller.signal.aborted) setMapError('Interactive mapping is unavailable in this browser. The dataset remains accessible below.');
        }
      } catch (error) {
        if (!controller.signal.aborted) setResource({ status: error instanceof UnavailableError ? 'unavailable' : 'error', message: error instanceof Error ? error.message : 'Unable to load data.' });
      }
    };
    void init();
    return () => { controller.abort(); disposeLayer?.(); map?.remove(); mapRef.current = null; layerRef.current = null; };
  }, [attempt]);
  const dataset = 'data' in resource ? resource.data : null;
  const feature = dataset?.collection.features.find(f => f.id === selected);
  function toggle() { const next = !visible; visibleRef.current = next; setVisible(next); layerRef.current?.setVisible(next); }
  function retry() { setResource({ status: 'loading' }); setMapError(null); setMapReady(false); setSelected(null); setAttempt(value => value + 1); }
  return <div className="atlas-workspace">
    <aside className="atlas-panel">
      <p className="eyebrow">Foundation / development sample</p>
      <h1>Explore the atlas</h1>
      <p>Inspect a synthetic dataset to explore how map layers and their evidence fit together.</p>
      <DataState state={resource} retry={retry} />
      <section className="layer-controls" aria-label="Map layers"><h2>Layers</h2>
        <label><input type="checkbox" checked={visible} onChange={toggle} disabled={!dataset} /> Synthetic points</label>
        <p className="muted">No basemap or terrain dataset is loaded.</p>
      </section>
      {dataset && <Evidence metadata={dataset.metadata} />}
    </aside>
    <div className="map-column">
      <div className="map-shell">
        <div ref={container} className="map" role="region" aria-label="Interactive synthetic sample map" data-map-ready={mapReady} />
        <div className="map-caption"><span className="dot" /> Synthetic sample · not real features</div>
        {dataset && !mapReady && !mapError && <div className="map-message" role="status">Preparing the interactive map…</div>}
        {mapError && <div className="map-message" role="alert">{mapError}</div>}
        <button className="reset-map" disabled={!mapReady} onClick={() => { if (dataset) { const [w,s,e,n] = dataset.metadata.spatial_coverage.bbox; mapRef.current?.fitBounds([[w,s],[e,n]], { padding: 60, duration: 0 }); } }}>Reset view</button>
      </div>
      <section className="feature-list" aria-label="Accessible dataset features">
        <h2>Inspect a sample point</h2>
        <p className="muted">These controls provide the same selection as clicking the map.</p>
        <div className="feature-buttons">{dataset?.collection.features.map(f => <button key={f.id} aria-pressed={selected === f.id} onClick={() => setSelected(String(f.id))}>{f.properties.name}</button>)}</div>
        <div className="selection" aria-live="polite">{feature ? <><h3>{feature.properties.name}</h3><p>Measurement: <strong>{formatMeasurement(feature.properties.value, feature.properties.unit)}</strong></p><p>Geometry: {feature.geometry.type} · Coordinates: {JSON.stringify(feature.geometry.coordinates)} · OGC:CRS84 (longitude, latitude)</p><p>Synthetic position; no scientific measurement is available.</p></> : <p>Select a point to inspect its record.</p>}</div>
      </section>
    </div>
  </div>;
}
