'use client';
import dynamic from 'next/dynamic';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Map, Marker } from 'maplibre-gl';
import { isStale, type Dataset } from '../../../../packages/contracts';
import { DataState } from '../../components/data-state';
import { Evidence } from '../../components/evidence';
import { ADMIN_MANIFESTS, loadDataset, UnavailableError } from '../../lib/datasets';
import { mountAdministrativeDataset } from '../../lib/map-layers';
import type { Resource } from '../../lib/resource';
import { administrativeName, administrativeNameReview } from '../../lib/administrative-names';
import { digits, useLanguage, useCopy } from '../../lib/i18n';
import { ATLAS } from './copy';
import { GlacialLakes, type LakeChoice } from '../glacial-lakes/glacial-lakes';
import { Hydropower } from '../hydropower/hydropower';
import { Infrastructure } from '../infrastructure/infrastructure';
import { Terrain } from '../terrain/terrain';
import { Rivers } from '../rivers/rivers';
import { Disclosure, Sheet, TabPanel, Tabs, type Snap } from '../../components/ui';
import { revealMapThenPlay } from '../../lib/reveal';
import { MapKey } from './map-key';
import { SimulationUI } from '../simulation-ui/simulation-ui';

function GlaciersLoading() { return <p role="status">{useCopy(ATLAS).loadingGlacierOutlines}</p>; }
const Glaciers = dynamic(() => import('../glaciers/glaciers').then(m => m.Glaciers), { loading: GlaciersLoading });


function frameNepal(map: Map, bbox: [number, number, number, number]) {
  const [west, south, east, north] = bbox;
  const element = map.getContainer();
  const horizontal = element.clientWidth < 600 ? 24 : 80;
  map.fitBounds([[west, south], [east, north]], {
    padding: { top: 64, right: horizontal, bottom: 48, left: horizontal }, maxZoom: 6, duration: 0,
  });
}

// The five groups of map controls. Each panel keeps its long-standing anchor, so links such as /atlas/#lake-controls
// from the home page and Today open the right tab.
const TABS = [
  { value: 'lakes', anchor: 'lake-controls', hue: 'var(--hz-glof)' },
  { value: 'rivers', anchor: 'river-controls', hue: 'var(--hz-flood)' },
  { value: 'terrain', anchor: 'terrain-controls' },
  { value: 'boundaries', anchor: 'boundary-controls' },
  { value: 'infrastructure', anchor: 'additional-controls' },
] as const;
type Tab = (typeof TABS)[number]['value'];

export function Atlas() {
  const container = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map | null>(null);
  const layerRef = useRef<ReturnType<typeof mountAdministrativeDataset>[]>([]);
  const [resource, setResource] = useState<Resource<Dataset[]>>({ status: 'loading' });
  const [mapError, setMapError] = useState<'render' | 'webgl' | null>(null);
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
  const [lang] = useLanguage();
  const c = useCopy(ATLAS);
  const [tab, setTab] = useState<Tab>('lakes');
  const [snap, setSnap] = useState<Snap>('peek');
  const [statusSlot, setStatusSlot] = useState<HTMLElement | null>(null);
  const tabRef = useRef(tab);
  useEffect(() => { tabRef.current = tab; }, [tab]);
  /** Shows a tab and, on a phone, raises the sheet enough to read it. */
  const show = useCallback((next: Tab, height: Snap = 'half') => {
    setTab(next);
    setSnap(current => height === 'full' ? 'full' : current === 'peek' ? height : current);
  }, []);
  // A feature picked on the map opens its tab, except on Terrain, where a click inspects the elevation instead.
  const revealer = useCallback((next: Tab) => () => { if (tabRef.current !== 'terrain') show(next); }, [show]);
  // A trace lowers the sheet and brings the map into view before it animates, so it never plays off screen.
  const beforeTrace = useCallback((play: () => void) => {
    setSnap('peek');
    window.requestAnimationFrame(() => revealMapThenPlay(document.getElementById('atlas-map'), play));
  }, []);
  // Links to a panel's anchor (from other pages, or the skip link) open its tab and focus it.
  useEffect(() => {
    const open = () => {
      const id = decodeURIComponent(window.location.hash.slice(1));
      const target = id ? document.getElementById(id) : null;
      const panel = target?.closest<HTMLElement>('[data-atlas-tab]');
      if (!target || !panel) return;
      show(panel.dataset.atlasTab as Tab, 'full');
      window.requestAnimationFrame(() => window.requestAnimationFrame(() => { target.focus({ preventScroll: true }); target.scrollIntoView({ block: 'start' }); }));
    };
    open();
    window.addEventListener('hashchange', open);
    return () => window.removeEventListener('hashchange', open);
  }, [show]);

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
            if (!controller.signal.aborted && !sourceId.startsWith('nepal-terrain@') && !/terrain/i.test(event.error.message)) setMapError('render');
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
          if (!controller.signal.aborted) setMapError('webgl');
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
  const tabLabels: Record<Tab, string> = { lakes: c.lakes, rivers: c.rivers, terrain: c.terrain, boundaries: c.boundaries, infrastructure: c.infrastructure };
  const panel = (value: Tab, children: React.ReactNode) => <TabPanel idPrefix="atlas" value={value} selected={tab === value} className="atlas-tabpanel"><div data-atlas-tab={value}>{children}</div></TabPanel>;
  return <div className="atlas" data-tab={tab}>
    <div className="atlas-stage">
      <div className="map-shell" id="atlas-map">
        <a className="map-skip-link" href="#accessible-boundary-records" onClick={() => show('boundaries', 'full')}>{c.skipInteractiveMapBoundary}</a>
        <p id="atlas-map-alternative" className="sr-only">{c.mapVisualNavigationSurface}</p>
        <div ref={container} className="map" role="region" aria-label={c.interactiveNepalAdministrativeBoundary} aria-describedby="atlas-map-alternative" data-map-ready={mapReady} />
        <div className="map-caption"><span className="boundary-key" aria-hidden="true" /> COD-AB v02 · {c.clickBoundaryInspect}</div>
        {datasets && !mapReady && !mapError && <div className="map-message" role="status">{c.preparingInteractiveMap}</div>}
        {mapError && <div className="map-message" role="alert">{c.mapErrors[mapError]}</div>}
        <div className="map-controls map-controls-end">
          <button type="button" className="reset-map" disabled={!mapReady} onClick={() => {
            if (datasets && mapRef.current) frameNepal(mapRef.current, datasets[0].metadata.spatial_coverage.bbox);
          }}><svg className="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M4 12a8 8 0 1 0 2.4-5.7M4 4v4h4" /></svg>{c.resetView}</button>
        </div>
        <div className="map-status-slot" ref={setStatusSlot} />
        <MapKey />
      </div>
      <Sheet id="atlas-controls" className="atlas-panel" label={c.atlasControls} snap={snap} onSnap={setSnap} labels={{ expand: c.expandPanel, collapse: c.collapsePanel }}
        header={<div className="atlas-panel-header">
          <p className="eyebrow">{c.nepalGlacialLakesRivers}</p>
          <h1>{c.exploreNepalSGlacial}</h1>
          <p className="atlas-lede">{c.pickGlacialLakeFollow}</p>
          <DataState state={resource} retry={retry} />
          <Tabs label={c.atlasControls} idPrefix="atlas" value={tab} onChange={next => show(next)}
            items={TABS.map(item => ({ value: item.value, label: tabLabels[item.value], hue: 'hue' in item ? item.hue : undefined }))} />
        </div>}>
        {panel('lakes', <>
          <div id="lake-controls" tabIndex={-1} className="atlas-anchor"><GlacialLakes key={`lakes-${attempt}`} map={mapReady ? interactiveMap : null} onSelect={setLake} onReveal={revealer('lakes')}
            onTrace={choice => { setLakeTrace(previous => ({ ...choice, n: (previous?.n ?? 0) + 1 })); show('rivers'); }} /></div>
          <section className="thematic-controls" aria-label={c.glofModellingAvailability}><h2>{c.lakeOutburstModelling}</h2><p>{lake ? c.selectedLake(lake.id) : c.selectLakeAboveIdentify}</p><p>{c.floodExtentDamage}<strong>{c.unavailable}</strong>{c.labelledHypotheticalCorridorRanges}</p><p><a className="primary-action" href="/simulate/">{c.runOutburstScenario}</a></p>
            <Disclosure summary={c.whyMapShowsNo}><p>{c.lakePointDownstreamRiver}</p><p>{c.useRiverTracingConnectivity}</p><p><a href="/methodology/#glof-physical">{c.physicalGlofProjectScope}</a></p></Disclosure></section>
          <section className="thematic-controls" aria-label={c.glacierOutlines}><h2>{c.glaciers}</h2><p>{c.showGlacierOutlinesThat}</p><button type="button" onClick={() => setGlaciers(value => !value)}>{glaciers ? c.hideGlacierOutlines : c.showGlacierOutlines}</button>{glaciers && <Glaciers key={`glaciers-${attempt}`} map={mapReady ? interactiveMap : null} onReveal={revealer('lakes')} />}</section>
        </>)}
        {panel('rivers', <>
          <div id="river-controls" tabIndex={-1} className="atlas-anchor"><Rivers key={`rivers-${attempt}`} map={mapReady ? interactiveMap : null} snap={lakeTrace} onReveal={revealer('rivers')} beforePlay={beforeTrace} statusSlot={statusSlot} /></div>
          <Disclosure className="atlas-educational" summary={c.educationalRiverSimulation} onToggle={setEducationalSimulation}>{educationalSimulation && <SimulationUI key={`focused-simulation-${attempt}`} map={mapReady ? interactiveMap : null} />}</Disclosure>
        </>)}
        {panel('terrain', <div id="terrain-controls" tabIndex={-1} className="atlas-anchor"><Terrain key={attempt} map={mapReady ? interactiveMap : null} /></div>)}
        {panel('boundaries', <>
          <section id="boundary-controls" tabIndex={-1} className="layer-controls" aria-label={c.mapLayers}><h2>{c.boundaryLevels}</h2>
            {c.levels.map((label, index) => <label key={index}><input type="checkbox" checked={visible[index]} onChange={() => toggle(index)} disabled={!datasets} /> {label}</label>)}
            <p className="muted">{c.districtsAppearFromZoom}</p>
          </section>
          <section className="feature-list" id="accessible-boundary-records" tabIndex={-1} aria-label={c.accessibleBoundaryRecords}>
            <h2>{c.identifyAdministrativeUnit}</h2>
            <p className="muted">{c.searchableListProvidesSame}</p>
            <label className="record-picker">{c.findDistrictMunicipality}<input type="search" autoComplete="off" autoCapitalize="none" autoCorrect="off" spellCheck={false} enterKeyHint="search" value={boundaryQuery} onChange={event => setBoundaryQuery(event.target.value)} placeholder="Kathmandu, Chitwan, Manang Ngisyang…" /></label>
            <label className="record-picker">{c.boundaryRecord}<select value={selected ?? ''} onChange={event => selectFeature(event.target.value)} disabled={!datasets}>
              <option value="">{c.selectBoundary}</option>
              {datasets?.map((dataset, level) => <optgroup key={level} label={c.levels[level]}>{dataset.collection.features.filter(item => String(item.id) === selected || [administrativeName(item.properties), item.properties.name, item.properties.pcode, ...(item.properties.aliases ?? [])].some(value => value?.toLocaleLowerCase('en-US').includes(boundaryQuery.trim().toLocaleLowerCase('en-US')))).map(item => <option key={item.id} value={String(item.id)}>{administrativeName(item.properties)} ({item.properties.pcode})</option>)}</optgroup>)}
            </select></label>
            <div className="selection" aria-live="polite">{feature ? <>
              <p className="eyebrow">{feature.properties.admin_category?.replace('_', ' ')}</p>
              <h3>{administrativeName(feature.properties)}</h3>{administrativeName(feature.properties) !== feature.properties.name && <p className="muted">{c.sourceSpelling}{feature.properties.name}. <a href={administrativeNameReview(feature.properties)}>{c.nameReference}</a>.</p>}
              <dl><dt>P-code</dt><dd>{feature.properties.pcode}</dd><dt>{c.parent}</dt><dd>{feature.properties.admin_level === 0 ? c.noneCountry : feature.properties.parent_name}</dd><dt>{c.sourceArea}</dt><dd>{feature.properties.value === null ? c.unknown : `${digits(feature.properties.value.toLocaleString('en-US', { maximumFractionDigits: 1 }), lang)} km²`}</dd><dt>{c.validFrom}</dt><dd>{feature.properties.valid_from?.slice(0, 10)}</dd><dt>{c.sourceVersion}</dt><dd>{feature.properties.source_version}</dd><dt>{c.aliases}</dt><dd>{feature.properties.aliases?.length ? feature.properties.aliases.join(', ') : c.unknown}</dd></dl>
            </> : <p>{c.selectBoundaryInspectIts}</p>}</div>
          </section>
          {evidence && <Disclosure summary={c.sourcesEvidenceMap}><Evidence metadata={evidence} /></Disclosure>}
        </>)}
        {panel('infrastructure', <div id="additional-controls" tabIndex={-1} className="atlas-anchor">
          <section className="thematic-controls" aria-label={c.infrastructureContext}><h2>{c.infrastructureContext}</h2><p>{c.loadRoadsBridgesFacilities}</p><button type="button" onClick={() => setAdditionalLayers(value => !value)}>{additionalLayers ? c.unloadInfrastructureContext : c.loadInfrastructureContext}</button>{additionalLayers && <><Hydropower key={`hydropower-${attempt}`} map={mapReady ? interactiveMap : null} onReveal={revealer('infrastructure')} /><Infrastructure key={`infrastructure-${attempt}`} map={mapReady ? interactiveMap : null} onReveal={revealer('infrastructure')} /></>}</section>
        </div>)}
        <p className="muted map-attribution-note">{c.dataAttribution}<a href="https://www.openstreetmap.org/copyright">{c.openstreetmapContributorsOdbl}</a> · <a href="/licenses/">{c.terrainAllSourceLicences}</a></p>
      </Sheet>
    </div>
  </div>;
}
