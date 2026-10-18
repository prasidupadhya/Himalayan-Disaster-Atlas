'use client';
import dynamic from 'next/dynamic';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { Map, Marker } from 'maplibre-gl';
import { isStale, type Dataset } from '../../../../packages/contracts';
import { DataState } from '../../components/data-state';
import { Evidence } from '../../components/evidence';
import { ADMIN_MANIFESTS, loadDataset, UnavailableError } from '../../lib/datasets';
import { mountAdministrativeDataset } from '../../lib/map-layers';
import type { Resource } from '../../lib/resource';
import { administrativeName, administrativeNameReview } from '../../lib/administrative-names';
import { GlacialLakes, type LakeChoice } from '../glacial-lakes/glacial-lakes';
import { Hydropower } from '../hydropower/hydropower';
import { Infrastructure } from '../infrastructure/infrastructure';
import { Terrain } from '../terrain/terrain';
import { Rivers } from '../rivers/rivers';
import { Fold, openFoldFor } from './fold';
import { MapKey } from './map-key';
import { SimulationUI } from '../simulation-ui/simulation-ui';
import { Earthquakes } from '../earthquakes/earthquakes';

const Glaciers = dynamic(() => import('../glaciers/glaciers').then(m => m.Glaciers), { loading: () => <p role="status">Loading glacier outlines…</p> });

const LEVEL_LABELS = ['Country', 'Provinces', 'Districts', 'Local levels and special areas'] as const;

function frameNepal(map: Map, bbox: [number, number, number, number]) {
  const [west, south, east, north] = bbox;
  const element = map.getContainer();
  const horizontal = element.clientWidth < 600 ? 24 : 80;
  // In the full-screen layout the control drawer floats over the map's left edge.
  const drawer = element.closest('.atlas-mission') && element.clientWidth > 1000 ? 412 : 0;
  map.fitBounds([[west, south], [east, north]], {
    padding: { top: 80, right: horizontal, bottom: 80, left: horizontal + drawer }, maxZoom: 6, duration: 0,
  });
}

export function Atlas() {
  const container = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map | null>(null);
  const layerRef = useRef<ReturnType<typeof mountAdministrativeDataset>[]>([]);
  const [resource, setResource] = useState<Resource<Dataset[]>>({ status: 'loading' });
  const [mapError, setMapError] = useState<string | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const [interactiveMap, setInteractiveMap] = useState<Map | null>(null);
  const [visible, setVisible] = useState([true, false, true, false]);
  const visibleRef = useRef(visible);
  const [selected, setSelected] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);
  const [additionalLayers, setAdditionalLayers] = useState(false);
  const [glaciers, setGlaciers] = useState(false);
  const [lake, setLake] = useState<LakeChoice | null>(null);
  const [lakeTrace, setLakeTrace] = useState<(LakeChoice & { n: number }) | null>(null);
  const [boundaryQuery, setBoundaryQuery] = useState('');
  const [educationalSimulation, setEducationalSimulation] = useState(false);

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
            maxTileCacheSize: 64,
            // Cap display rasterization cost; source samples and map coordinates are unchanged.
            pixelRatio: Math.min(window.devicePixelRatio || 1, 1.5),
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
              if (id !== undefined) {
                setSelected(String(id));
                layerRef.current.forEach(layer => layer.setSelected(String(id)));
              }
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
              setInteractiveMap(map ?? null);
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

  useEffect(() => {
    if (!mapReady || !mapRef.current || !feature || (feature.properties.admin_level ?? 0) < 2) return;
    const p = feature.properties;
    if (p.label_longitude == null || p.label_latitude == null) return;
    let cancelled = false; let marker: Marker | undefined;
    void import('maplibre-gl').then(({ Marker }) => {
      if (cancelled || !mapRef.current) return;
      const label = document.createElement('span'); label.className = 'administrative-name-label';
      label.textContent = administrativeName(p);
      marker = new Marker({ element: label }).setLngLat([p.label_longitude!, p.label_latitude!]).addTo(mapRef.current);
    });
    return () => { cancelled = true; marker?.remove(); };
  }, [mapReady, feature]);

  function selectFeature(id: string) {
    const item = features.find(f => f.id === id);
    if (item?.properties.label_longitude != null && item.properties.label_latitude != null) {
      mapRef.current?.easeTo({ center: [item.properties.label_longitude, item.properties.label_latitude], zoom: item.properties.admin_level === 3 ? 10 : 7, duration: 0 });
    }
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
    setMapError(null); setMapReady(false); setInteractiveMap(null); setSelected(null);
    setAttempt(value => value + 1);
  }
  return <div className="atlas-workspace atlas-mission">
    <aside className="atlas-panel">
      <div className="atlas-panel-header">
        <p className="eyebrow">Nepal / floods, glacial lakes and earthquakes</p>
        <h1>Explore Nepal’s lakes, rivers & earthquakes</h1>
        <p>Pick a glacial lake and follow its water downstream, or read the record of earthquakes around Nepal.</p>
        <DataState state={resource} retry={retry} />
        <nav className="atlas-shortcuts" aria-label="Atlas controls" onClickCapture={event => { const href = (event.target as Element).closest('a')?.getAttribute('href'); if (href?.startsWith('#')) openFoldFor(href.slice(1)); }}><a href="#lake-controls">Lakes</a><a href="#river-controls">Rivers</a><a href="#earthquake-controls">Earthquakes</a><a href="#terrain-controls">Terrain</a><a href="#boundary-controls">Boundaries</a><a href="#additional-controls">Infrastructure</a></nav>
      </div>
      <div id="lake-controls" tabIndex={-1} className="atlas-anchor"><GlacialLakes key={`lakes-${attempt}`} map={mapReady ? interactiveMap : null} onSelect={setLake} onTrace={choice => { setLakeTrace(previous => ({ ...choice, n: (previous?.n ?? 0) + 1 })); document.getElementById('downstream-trace')?.scrollIntoView({ block: 'nearest' }); }} />
        <section className="thematic-controls" aria-label="Glacier outlines"><h2>Glaciers</h2><p>Show the glacier outlines that feed the lakes (about 1.3 MB).</p><button type="button" onClick={() => setGlaciers(value => !value)}>{glaciers ? 'Hide glacier outlines' : 'Show glacier outlines'}</button>{glaciers && <Glaciers key={`glaciers-${attempt}`} map={mapReady ? interactiveMap : null} />}</section>
      </div>
      <div id="river-controls" tabIndex={-1} className="atlas-anchor"><Rivers key={`rivers-${attempt}`} map={mapReady ? interactiveMap : null} snap={lakeTrace} /></div>
      <div id="earthquake-controls" tabIndex={-1} className="atlas-anchor"><Earthquakes key={`earthquakes-${attempt}`} map={mapReady ? interactiveMap : null} /></div>
      <section className="thematic-controls" aria-label="GLOF modelling availability"><h2>Lake outburst modelling</h2><p>{lake ? `Selected lake: ${lake.id}. Physical model inputs required.` : 'Select a lake above to identify the modelling subject.'}</p><p>Flood extent and damage: <strong>UNAVAILABLE</strong>. For a labelled hypothetical corridor with ranges, use the scenario simulator.</p><p><a className="primary-action" href="/simulate/">Run an outburst scenario</a></p><details><summary>Why the map shows no flood extent</summary><p>A lake point or a downstream river line cannot identify inundated places or destroyed assets. This inventory has no verified lake outlet-to-river connection, breach parameters or validated hydraulic model.</p><p>Use river tracing for connectivity only. Infrastructure is geographic context, not a list of affected assets.</p><p><a href="/methodology/#glof-physical">Physical GLOF project: scope, required inputs and validation</a></p></details><details onToggle={event => setEducationalSimulation(event.currentTarget.open)}><summary>Educational river simulation</summary>{educationalSimulation && <SimulationUI key={`focused-simulation-${attempt}`} map={mapReady ? interactiveMap : null} />}</details></section>
      <Fold title="More layers: terrain, boundaries and infrastructure">
      <div id="terrain-controls" tabIndex={-1} className="atlas-anchor"><Terrain key={attempt} map={mapReady ? interactiveMap : null} /></div>
      <section id="boundary-controls" tabIndex={-1} className="layer-controls" aria-label="Map layers"><h2>Boundary levels</h2>
        {LEVEL_LABELS.map((label, index) => <label key={label}><input type="checkbox" checked={visible[index]} onChange={() => toggle(index)} disabled={!datasets} /> {label}</label>)}
        <p className="muted">Districts appear from zoom 6; local levels from zoom 8. Orange areas are protected or special-area pieces in the source.</p>
      </section>
      <div id="additional-controls" tabIndex={-1} className="atlas-anchor">
      <section className="thematic-controls" aria-label="Infrastructure context"><h2>Infrastructure context</h2><p>Load roads, bridges, facilities and hydropower only when needed. Coverage is incomplete; proximity is not damage.</p><button type="button" onClick={() => setAdditionalLayers(value => !value)}>{additionalLayers ? 'Unload infrastructure context' : 'Load infrastructure context'}</button>{additionalLayers && <><Hydropower key={`hydropower-${attempt}`} map={mapReady ? interactiveMap : null} /><Infrastructure key={`infrastructure-${attempt}`} map={mapReady ? interactiveMap : null} /></>}</section>
      </div>
      </Fold>
      {evidence && <Fold title="Sources and evidence for this map"><Evidence metadata={evidence} /></Fold>}
    </aside>
    <div className="map-column">
      <div className="map-shell" id="atlas-map">
        <a className="map-skip-link" href="#accessible-boundary-records">Skip interactive map to boundary records</a>
        <p id="atlas-map-alternative" className="sr-only">The map is a visual navigation surface. Administrative boundaries can also be identified with the labelled boundary selector and textual details immediately after the map. The Atlas panel contains labelled controls and evidence text for thematic layers.</p>
        <div ref={container} className="map" role="region" aria-label="Interactive Nepal administrative boundary map" aria-describedby="atlas-map-alternative" data-map-ready={mapReady} />
        <div className="map-caption"><span className="boundary-key" /> COD-AB v02 · click a boundary to inspect it</div>
        {datasets && !mapReady && !mapError && <div className="map-message" role="status">Preparing the interactive map…</div>}
        {mapError && <div className="map-message" role="alert">{mapError}</div>}
        <button className="reset-map" disabled={!mapReady} onClick={() => {
          if (datasets && mapRef.current) {
            frameNepal(mapRef.current, datasets[0].metadata.spatial_coverage.bbox);
          }
        }}>Reset view</button>
      </div>
      <MapKey />
      <p className="muted map-attribution-note">Data attribution: <a href="https://www.openstreetmap.org/copyright">© OpenStreetMap contributors (ODbL)</a> · <a href="/licenses/">Terrain and all source licences</a></p>
      <section className="feature-list" id="accessible-boundary-records" tabIndex={-1} aria-label="Accessible boundary records">
        <h2>Identify an administrative unit</h2>
        <p className="muted">The searchable list provides the same identification as clicking the map.</p>
        <label className="record-picker">Find a district or municipality<input type="search" value={boundaryQuery} onChange={event => setBoundaryQuery(event.target.value)} placeholder="Kathmandu, Chitwan, Manang Ngisyang…" /></label>
        <label className="record-picker">Boundary record<select value={selected ?? ''} onChange={event => selectFeature(event.target.value)} disabled={!datasets}>
          <option value="">Select a boundary…</option>
          {datasets?.map((dataset, level) => <optgroup key={level} label={LEVEL_LABELS[level]}>{dataset.collection.features.filter(item => String(item.id) === selected || [administrativeName(item.properties), item.properties.name, item.properties.pcode, ...(item.properties.aliases ?? [])].some(value => value?.toLocaleLowerCase('en-US').includes(boundaryQuery.trim().toLocaleLowerCase('en-US')))).map(item => <option key={item.id} value={String(item.id)}>{administrativeName(item.properties)} ({item.properties.pcode})</option>)}</optgroup>)}
        </select></label>
        <div className="selection" aria-live="polite">{feature ? <>
          <p className="eyebrow">{feature.properties.admin_category?.replace('_', ' ')}</p>
          <h3>{administrativeName(feature.properties)}</h3>{administrativeName(feature.properties) !== feature.properties.name && <p className="muted">Source spelling: {feature.properties.name}. <a href={administrativeNameReview(feature.properties)}>Name reference</a>.</p>}
          <dl><dt>P-code</dt><dd>{feature.properties.pcode}</dd><dt>Parent</dt><dd>{feature.properties.admin_level === 0 ? 'None (country)' : feature.properties.parent_name}</dd><dt>Source area</dt><dd>{feature.properties.value === null ? 'UNKNOWN' : `${feature.properties.value.toLocaleString('en-US', { maximumFractionDigits: 1 })} km²`}</dd><dt>Valid from</dt><dd>{feature.properties.valid_from?.slice(0, 10)}</dd><dt>Source version</dt><dd>{feature.properties.source_version}</dd><dt>Aliases</dt><dd>{feature.properties.aliases?.length ? feature.properties.aliases.join(', ') : 'UNKNOWN'}</dd></dl>
        </> : <p>Select a boundary to inspect its stable identifier, hierarchy, and source metadata.</p>}</div>
      </section>
    </div>
  </div>;
}
