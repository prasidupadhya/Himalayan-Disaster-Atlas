'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { Map, Marker } from 'maplibre-gl';
import { isStale, type Dataset } from '../../../../packages/contracts';
import { DataState } from '../../components/data-state';
import { Evidence } from '../../components/evidence';
import { ADMIN_MANIFESTS, loadDataset, UnavailableError } from '../../lib/datasets';
import { mountAdministrativeDataset } from '../../lib/map-layers';
import type { Resource } from '../../lib/resource';
import { Terrain } from '../terrain/terrain';
import { Mountains } from '../mountains/mountains';
import { Rivers } from '../rivers/rivers';
import { Glaciers } from '../glaciers/glaciers';
import { GlacialLakes } from '../glacial-lakes/glacial-lakes';
import { Hydrology } from '../hydrology/hydrology';
import { Rainfall } from '../rainfall/rainfall';

const LEVEL_LABELS = ['Country', 'Provinces', 'Districts', 'Local levels and special areas'] as const;

function frameNepal(map: Map, bbox: [number, number, number, number]) {
  const [west, south, east, north] = bbox;
  const horizontal = map.getContainer().clientWidth < 600 ? 24 : 80;
  map.fitBounds([[west, south], [east, north]], {
    padding: { top: 80, right: horizontal, bottom: 80, left: horizontal }, maxZoom: 6, duration: 0,
  });
}

export function Atlas() {
  const container = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map | null>(null);
  const layerRef = useRef<ReturnType<typeof mountAdministrativeDataset>[]>([]);
  const [resource, setResource] = useState<Resource<Dataset[]>>({ status: 'loading' });
  const [mapError, setMapError] = useState<string | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const [visible, setVisible] = useState([true, true, true, true]);
  const visibleRef = useRef(visible);
  const [selected, setSelected] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    let map: Map | undefined;
    const markers: Marker[] = [];
    async function init() {
      try {
        const datasets = await Promise.all(ADMIN_MANIFESTS.map(path => loadDataset(path, controller.signal)));
        if (controller.signal.aborted) return;
        setResource({
          status: datasets.some(dataset => isStale(dataset.metadata)) ? 'stale' : datasets.every(dataset => dataset.collection.features.length) ? 'ready' : 'empty',
          data: datasets,
        });
        try {
          const { AttributionControl, Map: MapLibre, Marker: MapMarker, NavigationControl, setWorkerUrl, getVersion } = await import('maplibre-gl');
          if (controller.signal.aborted || !container.current) return;
          setWorkerUrl(`/vendor/maplibre-gl/${getVersion()}/maplibre-gl-worker.mjs`);
          map = new MapLibre({
            container: container.current,
            style: { version: 8, sources: {}, layers: [{ id: 'background', type: 'background', paint: { 'background-color': '#152737' } }] },
            center: [84.1, 28.4], zoom: 4.5, minZoom: 2, maxZoom: 13,
            attributionControl: false,
            // Broad Asia bounds cap zoom-out/panning without squeezing the Nepal view.
            maxBounds: [[30, -15], [165, 65]],
            renderWorldCopies: false,
          });
          mapRef.current = map;
          const limitAsiaView = () => {
            if (!map) return;
            const { clientWidth: width, clientHeight: height } = map.getContainer();
            const mercatorY = (latitude: number) => (1 - Math.asinh(Math.tan(latitude * Math.PI / 180)) / Math.PI) / 2;
            const zoom = Math.max(2, Math.log2(width * 360 / (512 * 135)), Math.log2(height / (512 * (mercatorY(-15) - mercatorY(65)))));
            // Match the geographic constraint with an explicit zoom floor so
            // the minus control disables at the actual overview limit.
            map.setMinZoom(Math.ceil(zoom * 100) / 100);
          };
          limitAsiaView();
          map.on('resize', limitAsiaView);
          map.addControl(new NavigationControl({ showCompass: false }), 'top-right');
          const attributionControl = new AttributionControl({ compact: true });
          map.addControl(attributionControl, 'bottom-right');
          const attribution = container.current?.querySelector<HTMLElement>('.maplibregl-ctrl-attrib');
          const collapseAttribution = () => attribution?.classList.remove('maplibregl-compact-show');
          let attributionOpened = false;
          attribution?.querySelector('.maplibregl-ctrl-attrib-button')?.addEventListener('click', () => { attributionOpened = true; }, { once: true });
          collapseAttribution();
          map.on('error', event => {
            const sourceId = 'sourceId' in event ? String(event.sourceId) : '';
            if (!controller.signal.aborted && !sourceId.startsWith('nepal-terrain@') && !/terrain/i.test(event.error.message)) setMapError('The map could not render. You can still inspect the boundary records below.');
          });
          map.on('load', () => {
            if (controller.signal.aborted || !map) return;
            const mounted = datasets.map(dataset => mountAdministrativeDataset(map!, dataset));
            layerRef.current = mounted;
            mounted.forEach((layer, index) => layer.setVisible(visibleRef.current[index]));
            map.on('click', mounted.flatMap(layer => layer.interactiveLayers).reverse(), event => {
              const id = event.features?.[0]?.id;
              if (id !== undefined) selectFeature(String(id));
            });
            for (const feature of datasets[1].collection.features) {
              const element = document.createElement('span');
              element.className = 'admin-map-label';
              element.textContent = feature.properties.name;
              markers.push(new MapMarker({ element, anchor: feature.properties.pcode === 'NP07' ? 'left' : 'center' }).setLngLat([
                feature.properties.label_longitude!, feature.properties.label_latitude!,
              ]).addTo(map));
            }
            const countryLabel = document.createElement('span');
            countryLabel.className = 'country-overview-label';
            countryLabel.textContent = 'Nepal';
            const country = datasets[0].collection.features[0].properties;
            const overviewMarker = new MapMarker({ element: countryLabel }).setLngLat([country.label_longitude!, country.label_latitude!]).addTo(map);
            const updateLabels = () => {
              const overview = map!.getZoom() < 4.5;
              for (const marker of markers) marker.getElement().style.display = overview ? 'none' : '';
              countryLabel.style.display = overview ? '' : 'none';
            };
            map.on('zoom', updateLabels);
            map.once('remove', () => overviewMarker.remove());
            updateLabels();
            frameNepal(map, datasets[0].metadata.spatial_coverage.bbox);
            map.once('idle', () => {
              if (controller.signal.aborted) return;
              // Attribution can refresh while source metadata settles. Keep it
              // collapsed during that initial refresh, while leaving the native
              // toggle interactive once the user opens it.
              const collapseTimer = window.setInterval(() => {
                if (attributionOpened) window.clearInterval(collapseTimer);
                else collapseAttribution();
              }, 100);
              window.setTimeout(() => window.clearInterval(collapseTimer), 5000);
              setMapReady(true);
            });
          });
        } catch {
          if (!controller.signal.aborted) setMapError('Interactive mapping is unavailable in this browser. The boundary records remain accessible below.');
        }
      } catch (error) {
        if (!controller.signal.aborted) setResource({ status: error instanceof UnavailableError ? 'unavailable' : 'error', message: error instanceof Error ? error.message : 'Unable to load data.' });
      }
    }
    void init();
    return () => {
      controller.abort();
      markers.forEach(marker => marker.remove());
      layerRef.current.forEach(layer => layer.dispose());
      map?.remove();
      mapRef.current = null;
      layerRef.current = [];
    };
  }, [attempt]);

  const datasets = 'data' in resource ? resource.data : null;
  const features = useMemo(() => datasets?.flatMap(dataset => dataset.collection.features) ?? [], [datasets]);
  const feature = features.find(item => item.id === selected);
  const evidence = datasets?.[feature?.properties.admin_level ?? 1]?.metadata;

  function selectFeature(id: string) {
    setSelected(id || null);
    layerRef.current.forEach(layer => layer.setSelected(id || null));
  }
  function toggle(index: number) {
    const next = visible.map((value, item) => item === index ? !value : value);
    visibleRef.current = next;
    setVisible(next);
    layerRef.current[index]?.setVisible(next[index]);
  }
  function retry() {
    setResource({ status: 'loading' });
    setMapError(null); setMapReady(false); setSelected(null);
    setAttempt(value => value + 1);
  }

  return <div className="atlas-workspace">
    <aside className="atlas-panel">
      <p className="eyebrow">Nepal / terrain & boundaries</p>
      <h1>Explore Nepal’s terrain & boundaries</h1>
      <p>Explore the landscape with Copernicus terrain and verified COD-AB v02 administrative records.</p>
      <DataState state={resource} retry={retry} />
      <section className="layer-controls" aria-label="Map layers"><h2>Boundary levels</h2>
        {LEVEL_LABELS.map((label, index) => <label key={label}><input type="checkbox" checked={visible[index]} onChange={() => toggle(index)} disabled={!datasets} /> {label}</label>)}
        <p className="muted">Districts appear from zoom 6; local levels from zoom 8. Orange areas are protected or special-area pieces in the source.</p>
      </section>
      <Terrain key={attempt} map={mapReady ? mapRef.current : null} />
      <Mountains key={`mountains-${attempt}`} map={mapReady ? mapRef.current : null} />
      <Rivers key={`rivers-${attempt}`} map={mapReady ? mapRef.current : null} />
      <Glaciers key={`glaciers-${attempt}`} map={mapReady ? mapRef.current : null} />
      <GlacialLakes key={`glacial-lakes-${attempt}`} map={mapReady ? mapRef.current : null} />
      <Hydrology key={`hydrology-${attempt}`} map={mapReady ? mapRef.current : null} />
      <Rainfall key={`rainfall-${attempt}`} map={mapReady ? mapRef.current : null} />
      {evidence && <Evidence metadata={evidence} />}
    </aside>
    <div className="map-column">
      <div className="map-shell">
        <div ref={container} className="map" role="region" aria-label="Interactive Nepal administrative boundary map" data-map-ready={mapReady} />
        <div className="map-caption"><span className="boundary-key" /> COD-AB v02 · click a boundary to inspect it</div>
        {datasets && !mapReady && !mapError && <div className="map-message" role="status">Preparing the interactive map…</div>}
        {mapError && <div className="map-message" role="alert">{mapError}</div>}
        <button className="reset-map" disabled={!mapReady} onClick={() => {
          if (datasets && mapRef.current) {
            frameNepal(mapRef.current, datasets[0].metadata.spatial_coverage.bbox);
          }
        }}>Reset view</button>
      </div>
      <section className="feature-list" aria-label="Accessible boundary records">
        <h2>Identify an administrative unit</h2>
        <p className="muted">The searchable list provides the same identification as clicking the map.</p>
        <label className="record-picker">Boundary record<select value={selected ?? ''} onChange={event => selectFeature(event.target.value)} disabled={!datasets}>
          <option value="">Select a boundary…</option>
          {datasets?.map((dataset, level) => <optgroup key={level} label={LEVEL_LABELS[level]}>{dataset.collection.features.map(item => <option key={item.id} value={String(item.id)}>{item.properties.name} ({item.properties.pcode})</option>)}</optgroup>)}
        </select></label>
        <div className="selection" aria-live="polite">{feature ? <>
          <p className="eyebrow">{feature.properties.admin_category?.replace('_', ' ')}</p>
          <h3>{feature.properties.name}</h3>
          <dl><dt>P-code</dt><dd>{feature.properties.pcode}</dd><dt>Parent</dt><dd>{feature.properties.admin_level === 0 ? 'None (country)' : feature.properties.parent_name}</dd><dt>Source area</dt><dd>{feature.properties.value === null ? 'UNKNOWN' : `${feature.properties.value.toLocaleString('en-US', { maximumFractionDigits: 1 })} km²`}</dd><dt>Valid from</dt><dd>{feature.properties.valid_from?.slice(0, 10)}</dd><dt>Source version</dt><dd>{feature.properties.source_version}</dd><dt>Aliases</dt><dd>{feature.properties.aliases?.length ? feature.properties.aliases.join(', ') : 'UNKNOWN'}</dd></dl>
        </> : <p>Select a boundary to inspect its stable identifier, hierarchy, and source metadata.</p>}</div>
      </section>
    </div>
  </div>;
}
