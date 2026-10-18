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
import { digits, T, useLanguage } from '../../lib/i18n';
import { GlacialLakes, type LakeChoice } from '../glacial-lakes/glacial-lakes';
import { Hydropower } from '../hydropower/hydropower';
import { Infrastructure } from '../infrastructure/infrastructure';
import { Terrain } from '../terrain/terrain';
import { Rivers } from '../rivers/rivers';
import { Fold, openFoldFor } from './fold';
import { MapKey } from './map-key';
import { SimulationUI } from '../simulation-ui/simulation-ui';

const Glaciers = dynamic(() => import('../glaciers/glaciers').then(m => m.Glaciers), { loading: () => <p role="status"><T en="Loading glacier outlines…" ne="हिमनदीका रूपरेखा लोड गर्दै…" /></p> });

const LEVEL_LABELS = ['Country', 'Provinces', 'Districts', 'Local levels and special areas'] as const;
const LEVEL_LABELS_NE = ['देश', 'प्रदेश', 'जिल्ला', 'स्थानीय तह र विशेष क्षेत्र'] as const;
const MAP_ERRORS_NE: Record<string, string> = {
  'The map could not render. You can still inspect the boundary records below.': 'नक्सा देखाउन सकिएन। तलका सीमा अभिलेखहरू भने अझै हेर्न सकिन्छ।',
  'Interactive mapping is unavailable in this browser. The boundary records remain accessible below.': 'यो ब्राउजरमा अन्तरक्रियात्मक नक्सा उपलब्ध छैन। सीमा अभिलेखहरू तल हेर्न सकिन्छ।',
};

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
  const [lang] = useLanguage();
  const t = (en: string, ne: string) => lang === 'ne' ? ne : en;

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
        <p className="eyebrow">{t('Nepal / glacial lakes and rivers', 'नेपाल / हिमताल र नदीहरू')}</p>
        <h1>{t('Explore Nepal’s glacial lakes and rivers', 'नेपालका हिमताल र नदीहरू अन्वेषण गर्नुहोस्')}</h1>
        <p>{t('Pick a glacial lake and follow its water downstream, river by river.', 'एउटा हिमताल छान्नुहोस् र त्यसको पानी नदी-नदी हुँदै तल कहाँ जान्छ पछ्याउनुहोस्।')}</p>
        <DataState state={resource} retry={retry} />
        <nav className="atlas-shortcuts" aria-label={t('Atlas controls', 'एटलस नियन्त्रण')} onClickCapture={event => { const href = (event.target as Element).closest('a')?.getAttribute('href'); if (href?.startsWith('#')) openFoldFor(href.slice(1)); }}><a href="#lake-controls">{t('Lakes', 'तालहरू')}</a><a href="#river-controls">{t('Rivers', 'नदीहरू')}</a><a href="#terrain-controls">{t('Terrain', 'भू-आकृति')}</a><a href="#boundary-controls">{t('Boundaries', 'सीमाहरू')}</a><a href="#additional-controls">{t('Infrastructure', 'पूर्वाधार')}</a></nav>
      </div>
      <div id="lake-controls" tabIndex={-1} className="atlas-anchor"><GlacialLakes key={`lakes-${attempt}`} map={mapReady ? interactiveMap : null} onSelect={setLake} onTrace={choice => { setLakeTrace(previous => ({ ...choice, n: (previous?.n ?? 0) + 1 })); document.getElementById('downstream-trace')?.scrollIntoView({ block: 'nearest' }); }} />
        <section className="thematic-controls" aria-label={t('Glacier outlines', 'हिमनदीका रूपरेखा')}><h2>{t('Glaciers', 'हिमनदीहरू')}</h2><p>{t('Show the glacier outlines that feed the lakes (about 1.3 MB).', 'तालहरूलाई पानी दिने हिमनदीका रूपरेखा देखाउनुहोस् (करिब १.३ MB)।')}</p><button type="button" onClick={() => setGlaciers(value => !value)}>{glaciers ? t('Hide glacier outlines', 'हिमनदीका रूपरेखा लुकाउनुहोस्') : t('Show glacier outlines', 'हिमनदीका रूपरेखा देखाउनुहोस्')}</button>{glaciers && <Glaciers key={`glaciers-${attempt}`} map={mapReady ? interactiveMap : null} />}</section>
      </div>
      <div id="river-controls" tabIndex={-1} className="atlas-anchor"><Rivers key={`rivers-${attempt}`} map={mapReady ? interactiveMap : null} snap={lakeTrace} /></div>
      <section className="thematic-controls" aria-label={t('GLOF modelling availability', 'हिमताल विस्फोट (GLOF) मोडेलिङको उपलब्धता')}><h2>{t('Lake outburst modelling', 'हिमताल विस्फोट मोडेलिङ')}</h2><p>{lake ? t(`Selected lake: ${lake.id}. Physical model inputs required.`, `छानिएको ताल: ${lake.id}। भौतिक मोडेलका इनपुटहरू आवश्यक छन्।`) : t('Select a lake above to identify the modelling subject.', 'मोडेलिङको विषय पहिचान गर्न माथिबाट एउटा ताल छान्नुहोस्।')}</p><p>{t('Flood extent and damage: ', 'बाढीको क्षेत्र र क्षति: ')}<strong>{t('UNAVAILABLE', 'अनुपलब्ध (UNAVAILABLE)')}</strong>{t('. For a labelled hypothetical corridor with ranges, use the scenario simulator.', '। दायरासहित चिनाइएको काल्पनिक करिडोरका लागि परिदृश्य सिमुलेटर प्रयोग गर्नुहोस्।')}</p><p><a className="primary-action" href="/simulate/">{t('Run an outburst scenario', 'विस्फोट परिदृश्य चलाउनुहोस्')}</a></p><details><summary>{t('Why the map shows no flood extent', 'नक्सामा बाढीको क्षेत्र किन देखाइँदैन')}</summary><p>{t('A lake point or a downstream river line cannot identify inundated places or destroyed assets. This inventory has no verified lake outlet-to-river connection, breach parameters or validated hydraulic model.', 'तालको बिन्दु वा तलतिरको नदी रेखाले डुबानमा परेका ठाउँ वा नष्ट संरचना पहिचान गर्न सक्दैन। यस अभिलेखमा तालको निकास र नदीबीचको प्रमाणित जडान, फुटान (breach) मापदण्ड वा प्रमाणित जलगतिकीय (hydraulic) मोडेल छैन।')}</p><p>{t('Use river tracing for connectivity only. Infrastructure is geographic context, not a list of affected assets.', 'नदी पछ्याउने सुविधा जडान बुझ्न मात्र प्रयोग गर्नुहोस्। पूर्वाधार भौगोलिक सन्दर्भ मात्र हो, प्रभावित संरचनाको सूची होइन।')}</p><p><a href="/methodology/#glof-physical">{t('Physical GLOF project: scope, required inputs and validation', 'भौतिक हिमताल विस्फोट (GLOF) परियोजना: दायरा, आवश्यक इनपुट र प्रमाणीकरण')}</a></p></details><details onToggle={event => setEducationalSimulation(event.currentTarget.open)}><summary>{t('Educational river simulation', 'शैक्षिक नदी सिमुलेसन')}</summary>{educationalSimulation && <SimulationUI key={`focused-simulation-${attempt}`} map={mapReady ? interactiveMap : null} />}</details></section>
      <Fold title={t('More layers: terrain, boundaries and infrastructure', 'थप तहहरू: भू-आकृति, सीमा र पूर्वाधार')}>
      <div id="terrain-controls" tabIndex={-1} className="atlas-anchor"><Terrain key={attempt} map={mapReady ? interactiveMap : null} /></div>
      <section id="boundary-controls" tabIndex={-1} className="layer-controls" aria-label={t('Map layers', 'नक्साका तहहरू')}><h2>{t('Boundary levels', 'सीमाका तहहरू')}</h2>
        {LEVEL_LABELS.map((label, index) => <label key={label}><input type="checkbox" checked={visible[index]} onChange={() => toggle(index)} disabled={!datasets} /> {t(label, LEVEL_LABELS_NE[index])}</label>)}
        <p className="muted">{t('Districts appear from zoom 6; local levels from zoom 8. Orange areas are protected or special-area pieces in the source.', 'जिल्लाहरू जुम ६ देखि र स्थानीय तहहरू जुम ८ देखि देखिन्छन्। सुन्तला रङका क्षेत्रहरू स्रोतमा संरक्षित वा विशेष क्षेत्रका भाग हुन्।')}</p>
      </section>
      <div id="additional-controls" tabIndex={-1} className="atlas-anchor">
      <section className="thematic-controls" aria-label={t('Infrastructure context', 'पूर्वाधार सन्दर्भ')}><h2>{t('Infrastructure context', 'पूर्वाधार सन्दर्भ')}</h2><p>{t('Load roads, bridges, facilities and hydropower only when needed. Coverage is incomplete; proximity is not damage.', 'सडक, पुल, सेवा केन्द्र र जलविद्युत् आवश्यक परेको बेला मात्र लोड गर्नुहोस्। दायरा अपूर्ण छ; नजिक हुनु क्षति हुनु होइन।')}</p><button type="button" onClick={() => setAdditionalLayers(value => !value)}>{additionalLayers ? t('Unload infrastructure context', 'पूर्वाधार सन्दर्भ हटाउनुहोस्') : t('Load infrastructure context', 'पूर्वाधार सन्दर्भ लोड गर्नुहोस्')}</button>{additionalLayers && <><Hydropower key={`hydropower-${attempt}`} map={mapReady ? interactiveMap : null} /><Infrastructure key={`infrastructure-${attempt}`} map={mapReady ? interactiveMap : null} /></>}</section>
      </div>
      </Fold>
      {evidence && <Fold title={t('Sources and evidence for this map', 'यस नक्साका स्रोत र प्रमाण')}><Evidence metadata={evidence} /></Fold>}
    </aside>
    <div className="map-column">
      <div className="map-shell" id="atlas-map">
        <a className="map-skip-link" href="#accessible-boundary-records">{t('Skip interactive map to boundary records', 'अन्तरक्रियात्मक नक्सा छाडेर सीमा अभिलेखमा जानुहोस्')}</a>
        <p id="atlas-map-alternative" className="sr-only">{t('The map is a visual navigation surface. Administrative boundaries can also be identified with the labelled boundary selector and textual details immediately after the map. The Atlas panel contains labelled controls and evidence text for thematic layers.', 'नक्सा दृश्य मार्गनिर्देशनका लागि हो। नक्सापछि तुरुन्तै रहेको लेबलसहितको सीमा छनोट र पाठ विवरणबाट पनि प्रशासनिक सीमाहरू पहिचान गर्न सकिन्छ। एटलस प्यानलमा विषयगत तहहरूका लेबलसहितका नियन्त्रण र प्रमाणको पाठ छ।')}</p>
        <div ref={container} className="map" role="region" aria-label={t('Interactive Nepal administrative boundary map', 'नेपालको अन्तरक्रियात्मक प्रशासनिक सीमा नक्सा')} aria-describedby="atlas-map-alternative" data-map-ready={mapReady} />
        <div className="map-caption"><span className="boundary-key" /> COD-AB v02 · {t('click a boundary to inspect it', 'विवरण हेर्न सीमामा क्लिक गर्नुहोस्')}</div>
        {datasets && !mapReady && !mapError && <div className="map-message" role="status">{t('Preparing the interactive map…', 'अन्तरक्रियात्मक नक्सा तयार गर्दै…')}</div>}
        {mapError && <div className="map-message" role="alert">{t(mapError, MAP_ERRORS_NE[mapError] ?? mapError)}</div>}
        <button className="reset-map" disabled={!mapReady} onClick={() => {
          if (datasets && mapRef.current) {
            frameNepal(mapRef.current, datasets[0].metadata.spatial_coverage.bbox);
          }
        }}>{t('Reset view', 'दृश्य पहिलेजस्तै बनाउनुहोस्')}</button>
      </div>
      <MapKey />
      <p className="muted map-attribution-note">{t('Data attribution: ', 'डेटाको श्रेय: ')}<a href="https://www.openstreetmap.org/copyright">{t('© OpenStreetMap contributors (ODbL)', '© OpenStreetMap योगदानकर्ताहरू (ODbL)')}</a> · <a href="/licenses/">{t('Terrain and all source licences', 'भू-आकृति र सबै स्रोतका इजाजतपत्र')}</a></p>
      <section className="feature-list" id="accessible-boundary-records" tabIndex={-1} aria-label={t('Accessible boundary records', 'पहुँचयोग्य सीमा अभिलेख')}>
        <h2>{t('Identify an administrative unit', 'प्रशासनिक इकाइ पहिचान गर्नुहोस्')}</h2>
        <p className="muted">{t('The searchable list provides the same identification as clicking the map.', 'खोज्न मिल्ने यो सूचीले नक्सामा क्लिक गर्दा जस्तै पहिचान दिन्छ।')}</p>
        <label className="record-picker">{t('Find a district or municipality', 'जिल्ला वा नगरपालिका/गाउँपालिका खोज्नुहोस्')}<input type="search" value={boundaryQuery} onChange={event => setBoundaryQuery(event.target.value)} placeholder="Kathmandu, Chitwan, Manang Ngisyang…" /></label>
        <label className="record-picker">{t('Boundary record', 'सीमा अभिलेख')}<select value={selected ?? ''} onChange={event => selectFeature(event.target.value)} disabled={!datasets}>
          <option value="">{t('Select a boundary…', 'सीमा छान्नुहोस्…')}</option>
          {datasets?.map((dataset, level) => <optgroup key={level} label={t(LEVEL_LABELS[level], LEVEL_LABELS_NE[level])}>{dataset.collection.features.filter(item => String(item.id) === selected || [administrativeName(item.properties), item.properties.name, item.properties.pcode, ...(item.properties.aliases ?? [])].some(value => value?.toLocaleLowerCase('en-US').includes(boundaryQuery.trim().toLocaleLowerCase('en-US')))).map(item => <option key={item.id} value={String(item.id)}>{administrativeName(item.properties)} ({item.properties.pcode})</option>)}</optgroup>)}
        </select></label>
        <div className="selection" aria-live="polite">{feature ? <>
          <p className="eyebrow">{feature.properties.admin_category?.replace('_', ' ')}</p>
          <h3>{administrativeName(feature.properties)}</h3>{administrativeName(feature.properties) !== feature.properties.name && <p className="muted">{t('Source spelling: ', 'स्रोतको हिज्जे: ')}{feature.properties.name}. <a href={administrativeNameReview(feature.properties)}>{t('Name reference', 'नामको सन्दर्भ')}</a>.</p>}
          <dl><dt>P-code</dt><dd>{feature.properties.pcode}</dd><dt>{t('Parent', 'माथिल्लो एकाइ')}</dt><dd>{feature.properties.admin_level === 0 ? t('None (country)', 'छैन (देश)') : feature.properties.parent_name}</dd><dt>{t('Source area', 'स्रोतअनुसार क्षेत्रफल')}</dt><dd>{feature.properties.value === null ? t('UNKNOWN', 'अज्ञात (UNKNOWN)') : `${digits(feature.properties.value.toLocaleString('en-US', { maximumFractionDigits: 1 }), lang)} km²`}</dd><dt>{t('Valid from', 'लागू मिति')}</dt><dd>{feature.properties.valid_from?.slice(0, 10)}</dd><dt>{t('Source version', 'स्रोत संस्करण')}</dt><dd>{feature.properties.source_version}</dd><dt>{t('Aliases', 'अन्य नामहरू')}</dt><dd>{feature.properties.aliases?.length ? feature.properties.aliases.join(', ') : t('UNKNOWN', 'अज्ञात (UNKNOWN)')}</dd></dl>
        </> : <p>{t('Select a boundary to inspect its stable identifier, hierarchy, and source metadata.', 'स्थिर पहिचानकर्ता, तह संरचना र स्रोत मेटाडेटा हेर्न सीमा छान्नुहोस्।')}</p>}</div>
      </section>
    </div>
  </div>;
}
