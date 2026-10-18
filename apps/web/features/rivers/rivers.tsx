'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { Map, MapMouseEvent, Marker } from 'maplibre-gl';
import { isStale, type Dataset } from '../../../../packages/contracts';
import { DataState } from '../../components/data-state';
import { Evidence } from '../../components/evidence';
import { loadDataset, RIVER_MANIFESTS, UnavailableError } from '../../lib/datasets';
import { mountRiverDataset } from '../../lib/map-layers';
import { nearestReach } from '../../lib/river-snap';
import type { Resource } from '../../lib/resource';
import { digits, useLanguage } from '../../lib/i18n';
import { DownstreamTrace } from '../downstream-trace/downstream-trace';

const RIVER_NAMES = '/data/nepal-river-names/1.0.0/manifest.json';
const PICK_RADIUS_PX = 6;
const normalize = (value: string) => value.normalize('NFD').replace(/\p{M}/gu, '').toLocaleLowerCase('en-US');
type Place = { name: string; source: string; sourceId: string; lonLat: [number, number]; reachId: string; metres: number; caveat?: string };

export function Rivers({ map, snap = null }: { map: Map | null; snap?: { id: string; label: string; lonLat: [number, number]; n: number } | null }) {
  const [resource, setResource] = useState<Resource<Dataset[]>>({ status: 'loading' });
  const [names, setNames] = useState<Dataset | null>(null);
  const [namesFailed, setNamesFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [visible, setVisible] = useState(true);
  const [selected, setSelected] = useState('');
  const [place, setPlace] = useState<Place | null>(null);
  const [query, setQuery] = useState('');
  const [autoTrace, setAutoTrace] = useState(false);
  const mounted = useRef<ReturnType<typeof mountRiverDataset>[]>([]);
  const marker = useRef<Marker | null>(null);
  const datasets = 'data' in resource ? resource.data : null;
  const [lang] = useLanguage();
  const t = (en: string, ne: string) => lang === 'ne' ? ne : en;
  const num = (value: number | null | undefined) => value === null || value === undefined ? undefined : digits(value.toLocaleString('en-US'), lang);

  useEffect(() => {
    const controller = new AbortController();
    void loadDataset(RIVER_NAMES, controller.signal)
      .then(data => { if (!controller.signal.aborted) setNames(data); })
      .catch(() => { if (!controller.signal.aborted) setNamesFailed(true); });
    return () => controller.abort();
  }, [attempt]);

  useEffect(() => {
    if (!map) return;
    const controller = new AbortController();
    const handles: ReturnType<typeof mountRiverDataset>[] = [];
    let onClick: ((event: MapMouseEvent) => void) | null = null;
    void (async () => {
      try {
        const data = await Promise.all(RIVER_MANIFESTS.map(path => loadDataset(path, controller.signal)));
        if (controller.signal.aborted) return;
        handles.push(...data.map(dataset => mountRiverDataset(map, dataset)));
        mounted.current = handles;
        handles.forEach(handle => handle.setVisible(visible));
        onClick = event => {
          const layers = handles.flatMap(handle => handle.interactiveLayers);
          const { x, y } = event.point;
          const hit = map.queryRenderedFeatures([[x - PICK_RADIUS_PX, y - PICK_RADIUS_PX], [x + PICK_RADIUS_PX, y + PICK_RADIUS_PX]], { layers })[0];
          if (!hit || hit.id === undefined) return;
          const value = String(hit.id);
          setPlace(null);
          setAutoTrace(false);
          setSelected(value);
          handles.forEach(handle => handle.setSelected(value));
        };
        map.on('click', onClick);
        setResource({
          status: data.some(dataset => isStale(dataset.metadata)) ? 'stale' : data.every(dataset => dataset.collection.features.length) ? 'ready' : 'empty',
          data,
        });
      } catch (error) {
        handles.forEach(handle => handle.dispose());
        if (!controller.signal.aborted) setResource({
          status: error instanceof UnavailableError ? 'unavailable' : 'error',
          message: error instanceof Error ? error.message : 'River network unavailable',
        });
      }
    })();
    return () => {
      controller.abort();
      if (onClick) map.off('click', onClick);
      handles.forEach(handle => handle.dispose());
      mounted.current = [];
    };
  // Visibility changes do not reacquire immutable releases.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, attempt]);

  useEffect(() => { mounted.current.forEach(handle => handle.setVisible(visible)); }, [visible]);

  useEffect(() => {
    if (!map || !place) return;
    let cancelled = false;
    void import('maplibre-gl').then(({ Marker }) => {
      if (cancelled) return;
      const label = document.createElement('span');
      label.className = 'river-name-label';
      label.textContent = lang === 'ne'
        ? (place.source === 'GeoNames' ? `${place.name} · नाम भएको स्थान` : `${place.name} · ताल`)
        : (place.source === 'GeoNames' ? `${place.name} · named location` : `${place.name} · lake`);
      marker.current = new Marker({ element: label }).setLngLat(place.lonLat).addTo(map);
    });
    return () => { cancelled = true; marker.current?.remove(); marker.current = null; };
  }, [map, place, lang]);

  const features = useMemo(() => datasets?.flatMap(dataset => dataset.collection.features) ?? [], [datasets]);
  const reachMatches = useMemo(() => {
    const needle = normalize(query.trim());
    const filtered = needle ? features.filter(feature => feature.properties.search_terms?.some(term => normalize(term).includes(needle))) : features;
    return filtered.slice().sort((a, b) => (a.properties.flow_order ?? 99) - (b.properties.flow_order ?? 99) || (b.properties.average_discharge_m3s ?? 0) - (a.properties.average_discharge_m3s ?? 0)).slice(0, 150);
  }, [features, query]);
  const nameMatches = useMemo(() => {
    const needle = normalize(query.trim());
    if (!needle || !names) return [];
    return names.collection.features.filter(item => item.properties.search_terms?.some(term => normalize(term).includes(needle))).slice(0, 40);
  }, [names, query]);
  const feature = features.find(item => String(item.id) === selected);
  const evidence = datasets?.find(dataset => dataset.metadata.dataset_id === feature?.properties.dataset_id)?.metadata ?? datasets?.[0]?.metadata;

  // A new lake request (snap.n) selects the reach nearest its centroid; the map highlight follows in an effect.
  const [appliedSnap, setAppliedSnap] = useState(0);
  if (snap && snap.n !== appliedSnap && features.length) {
    setAppliedSnap(snap.n);
    const hit = nearestReach(features, snap.lonLat[0], snap.lonLat[1]);
    if (hit) {
      setPlace({ name: snap.label, source: 'GLO lake centroid', sourceId: snap.id, lonLat: snap.lonLat, reachId: hit.id, metres: hit.metres,
        caveat: 'The lake’s real outlet is UNKNOWN; this traces river-network connectivity only, not a flood.' });
      setSelected(hit.id);
      setAutoTrace(true);
    }
  }
  useEffect(() => { mounted.current.forEach(handle => handle.setSelected(selected || null)); }, [selected]);


  function choose(value: string) {
    setAutoTrace(false);
    if (!value) { setPlace(null); setSelected(''); mounted.current.forEach(handle => handle.setSelected(null)); return; }
    if (value.startsWith('name:')) {
      const named = names?.collection.features.find(item => String(item.id) === value.slice(5));
      if (!named || named.geometry.type !== 'Point' || !datasets) return;
      const [lon, lat] = named.geometry.coordinates as [number, number];
      const hit = nearestReach(features, lon, lat);
      if (!hit) return;
      setPlace({ name: String(named.properties.name), source: 'GeoNames', sourceId: String(named.properties.source_id), lonLat: [lon, lat], reachId: hit.id, metres: hit.metres });
      setSelected(hit.id);
      mounted.current.forEach(handle => handle.setSelected(hit.id));
      if (map) map.easeTo({ center: [lon, lat], zoom: Math.max(9, map.getZoom()), duration: 0 });
      return;
    }
    setPlace(null);
    setSelected(value);
    mounted.current.forEach(handle => handle.setSelected(value));
    const item = features.find(featureItem => String(featureItem.id) === value);
    if (!item || !map) return;
    const coordinates = item.geometry.type === 'LineString' ? item.geometry.coordinates[0] : item.geometry.type === 'MultiLineString' ? item.geometry.coordinates[0]?.[0] : null;
    if (coordinates) map.easeTo({ center: coordinates as [number, number], zoom: Math.max(map.getZoom(), 8), duration: 0 });
  }

  const selectValue = place?.source === 'GeoNames' ? `name:${place.sourceId}` : selected;
  return <section className="thematic-controls rivers-controls" aria-label={t('Rivers', 'नदीहरू')} data-rivers-state={resource.status}>
    <h2>{t('Rivers', 'नदीहरू')}</h2>
    <p>FAO Rivers {digits('2026', lang)} / HydroRIVERS · {t('connected reach IDs', 'जोडिएका खण्ड ID हरू')}</p>
    {map ? <DataState state={resource} retry={() => { setResource({ status: 'loading' }); setSelected(''); setPlace(null); setAttempt(value => value + 1); }} /> : <p className="muted">{t('River controls require the interactive map.', 'नदी नियन्त्रणका लागि अन्तरक्रियात्मक नक्सा चाहिन्छ।')}</p>}
    <label><input type="checkbox" checked={visible} disabled={!datasets} onChange={event => setVisible(event.target.checked)} /> {t('Show river network', 'नदी सञ्जाल देखाउनुहोस्')}</label>
    <p className="muted">{t('Primary and mid-order reaches appear first; headwater/minor reaches load from zoom 6.5. Click a river line on the map to select it, then trace downstream.', 'मुख्य र मध्यम क्रमका खण्डहरू पहिले देखिन्छन्; शिरभाग/साना खण्डहरू जुम ६.५ देखि लोड हुन्छन्। नक्सामा नदीको रेखामा क्लिक गरेर छान्नुहोस्, त्यसपछि तलतिर पछ्याउनुहोस्।')}</p>
    <label className="thematic-picker">{t('Find a river or reach', 'नदी वा खण्ड खोज्नुहोस्')}<input type="search" value={query} disabled={!datasets} placeholder="Trishuli, Koshi, HYRIV 40669746…" onChange={event => setQuery(event.target.value)} /></label>
    <label className="thematic-picker">{t('River or reach', 'नदी वा खण्ड')}<select aria-label={t('River or reach', 'नदी वा खण्ड')} value={selectValue} disabled={!datasets} onChange={event => choose(event.target.value)}>
      <option value="">{t('Select a river or reach…', 'नदी वा खण्ड छान्नुहोस्…')}</option>
      {feature && !reachMatches.some(item => String(item.id) === selected) && <option value={String(feature.id)}>HYRIV {feature.properties.source_id} {t('(selected on map)', '(नक्सामा छानिएको)')}</option>}
      <optgroup label={t('Reaches', 'खण्डहरू')}>
        {reachMatches.map(item => <option key={String(item.id)} value={String(item.id)}>HYRIV {item.properties.source_id} · {t('order', 'क्रम')} {num(item.properties.flow_order)} · {num(item.properties.average_discharge_m3s)} m³/s</option>)}
      </optgroup>
      {(nameMatches.length > 0 || place?.source === 'GeoNames') && <optgroup label={t('Named locations (GeoNames)', 'नाम भएका स्थानहरू (GeoNames)')}>
        {place?.source === 'GeoNames' && !nameMatches.some(item => String(item.id) === place.sourceId) && <option value={`name:${place.sourceId}`}>{place.name} · GeoNames {place.sourceId}</option>}
        {nameMatches.map(item => <option key={`name:${item.id}`} value={`name:${item.id}`}>{item.properties.name} · GeoNames {item.properties.source_id}</option>)}
      </optgroup>}
    </select></label>
    {namesFailed && <p className="muted">{t('Named locations are unavailable; reach search still works. ', 'नाम भएका स्थानहरू उपलब्ध छैनन्; खण्ड खोज भने काम गर्छ। ')}<button onClick={() => { setNamesFailed(false); setAttempt(value => value + 1); }}>{t('Retry named locations', 'नाम भएका स्थान फेरि लोड गर्नुहोस्')}</button></p>}
    {query.trim() && !reachMatches.length && !nameMatches.length && <p className="muted">{t('No matching reach or named location. This does not mean the river has no name.', 'मिल्ने खण्ड वा नाम भएको स्थान भेटिएन। यसको अर्थ नदीको नाम छैन भन्ने होइन।')}</p>}
    <p className="muted">{t('The source does not provide river names for these reaches. Reaches are identified by stable HYRIV_ID values; named places come from GeoNames points.', 'स्रोतले यी खण्डहरूका नदीको नाम दिँदैन। खण्डहरू स्थिर HYRIV_ID मानबाट चिनिन्छन्; नाम भएका स्थानहरू GeoNames बिन्दुबाट आउँछन्।')}</p>
    <div className="selection" aria-live="polite">{feature ? <>
      <p className="eyebrow">{t('river reach', 'नदी खण्ड')}</p><h3>HYRIV {feature.properties.source_id}</h3>
      {place && <p role="note">{lang === 'ne' ? <><strong>{place.name}</strong> ({place.source === 'GLO lake centroid' ? 'GLO ताल केन्द्रबिन्दु' : place.source} {place.sourceId}) यो सबैभन्दा नजिकको नक्सांकित खण्डबाट {digits(Math.round(place.metres).toLocaleString('en-US'), lang)} m टाढा छ। यो मिलान पछ्याउनका लागि सम्भावित खण्ड मात्र हो, प्रमाणित पहिचान होइन: स्रोतले यस खण्डको नाम दिँदैन, त्यसैले यसको नदी पहिचान अज्ञात (UNKNOWN) छ।{place.caveat ? ' तालको वास्तविक निकास अज्ञात (UNKNOWN) छ; यसले नदी सञ्जालको जडान मात्र पछ्याउँछ, बाढी होइन।' : ''}</>
        : <><strong>{place.name}</strong> ({place.source} {place.sourceId}) is {Math.round(place.metres).toLocaleString('en-US')} m from this nearest mapped reach. The match is a candidate for tracing, not a verified identity: the source gives this reach no name, so its river identity is UNKNOWN.{place.caveat ? ` ${place.caveat}` : ''}</>}</p>}
      <dl>
        <dt>{t('River name', 'नदीको नाम')}</dt><dd>{feature.properties.river_name ?? t('UNKNOWN', 'अज्ञात (UNKNOWN)')}</dd>
        <dt>{t('Flow order', 'प्रवाह क्रम')}</dt><dd>{num(feature.properties.flow_order)}</dd>
        <dt>{t('Average discharge', 'औसत बहाव')}</dt><dd>{num(feature.properties.average_discharge_m3s)} m³/s</dd>
        <dt>{t('Flow regime', 'प्रवाहको प्रकृति')}</dt><dd>{feature.properties.flow_regime}</dd>
        <dt>{t('Reach length', 'खण्डको लम्बाइ')}</dt><dd>{num(feature.properties.length_km)} km</dd>
        <dt>{t('Upstream area', 'माथिल्लो क्षेत्रफल')}</dt><dd>{num(feature.properties.upstream_area_km2)} km²</dd>
        <dt>{t('Catchment area', 'जलाधार क्षेत्रफल')}</dt><dd>{num(feature.properties.catchment_area_km2)} km²</dd>
        <dt>{t('Next downstream', 'तलतिरको अर्को खण्ड')}</dt><dd>{feature.properties.downstream_id ? `HYRIV ${feature.properties.downstream_id}${feature.properties.downstream_in_release ? '' : t(' (outside Nepal release)', ' (नेपाल रिलिजभन्दा बाहिर)')}` : t('Source outlet', 'स्रोतको निकास')}</dd>
        <dt>{t('Main river ID', 'मुख्य नदी ID')}</dt><dd>{feature.properties.main_river_id}</dd>
        <dt>HydroBASINS L12</dt><dd>{feature.properties.hydrobasin_level12_id}</dd>
      </dl>
      <p><a href="#downstream-trace">{t('Go to downstream trace', 'तलतिरको मार्गमा जानुहोस्')}</a></p>
    </> : <p>{t('Select a reach to inspect its topology, source measurements and stable downstream linkage.', 'खण्डको संरचना (topology), स्रोतका मापन र स्थिर तलतिरको जडान हेर्न खण्ड छान्नुहोस्।')}</p>}</div>
    {evidence && <details><summary>{t('River source & limitations', 'नदीको स्रोत र सीमाहरू')}</summary><Evidence metadata={evidence} /></details>}
    <DownstreamTrace key={`${selected}-${attempt}-${autoTrace ? snap?.n : 0}`} map={map} datasets={datasets} start={feature?.properties.source_id} autoRun={autoTrace} />
  </section>;
}
