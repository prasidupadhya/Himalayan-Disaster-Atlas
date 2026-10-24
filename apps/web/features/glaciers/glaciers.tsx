'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { Map, MapLayerMouseEvent } from 'maplibre-gl';
import { isStale, type Dataset } from '../../../../packages/contracts';
import { DataState } from '../../components/data-state';
import { Evidence } from '../../components/evidence';
import { GLACIER_MANIFESTS, loadDataset, UnavailableError } from '../../lib/datasets';
import { mountGlacierDataset } from '../../lib/map-layers';
import type { Resource } from '../../lib/resource';
import { digits, useLanguage, useT } from '../../lib/i18n';

export function Glaciers({ map }: { map: Map | null }) {
  const [resource, setResource] = useState<Resource<Dataset[]>>({ status: 'loading' });
  const [attempt, setAttempt] = useState(0);
  const [visible, setVisible] = useState(true);
  const [selected, setSelected] = useState('');
  const [query, setQuery] = useState('');
  const mounted = useRef<ReturnType<typeof mountGlacierDataset>[]>([]);
  const datasets = 'data' in resource ? resource.data : null;
  const [lang] = useLanguage();
  const t = useT();
  const num = (value: number | null | undefined, fraction: number) => value === null || value === undefined ? undefined : digits(value.toLocaleString('en-US', { maximumFractionDigits: fraction }), lang);

  useEffect(() => {
    if (!map) return;
    const controller = new AbortController();
    const handles: ReturnType<typeof mountGlacierDataset>[] = [];
    let onClick: ((event: MapLayerMouseEvent) => void) | null = null;
    void (async () => {
      try {
        const data = await Promise.all(GLACIER_MANIFESTS.map(path => loadDataset(path, controller.signal)));
        if (controller.signal.aborted) return;
        handles.push(...data.map(dataset => mountGlacierDataset(map, dataset)));
        mounted.current = handles;
        handles.forEach(handle => handle.setVisible(visible));
        onClick = event => {
          const id = event.features?.[0]?.id;
          if (id === undefined) return;
          const value = String(id);
          setSelected(value);
          handles.forEach(handle => handle.setSelected(value));
        };
        map.on('click', handles.flatMap(handle => handle.interactiveLayers), onClick);
        setResource({
          status: data.some(dataset => isStale(dataset.metadata)) ? 'stale' : data.every(dataset => dataset.collection.features.length) ? 'ready' : 'empty',
          data,
        });
      } catch (error) {
        handles.forEach(handle => handle.dispose());
        if (!controller.signal.aborted) setResource({
          status: error instanceof UnavailableError ? 'unavailable' : 'error',
          message: error instanceof Error ? error.message : 'Glacier inventory unavailable',
        });
      }
    })();
    return () => {
      controller.abort();
      if (onClick && handles.length) map.off('click', handles.flatMap(handle => handle.interactiveLayers), onClick);
      handles.forEach(handle => handle.dispose());
      mounted.current = [];
    };
  // Visibility changes do not reacquire immutable releases.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, attempt]);

  useEffect(() => { mounted.current.forEach(handle => handle.setVisible(visible)); }, [visible]);

  const features = useMemo(() => datasets?.flatMap(dataset => dataset.collection.features) ?? [], [datasets]);
  const matches = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase('en-US');
    const filtered = needle ? features.filter(feature => feature.properties.search_terms?.some(term => term.toLocaleLowerCase('en-US').includes(needle))) : features;
    return filtered.slice().sort((a, b) => (b.properties.area_km2 ?? 0) - (a.properties.area_km2 ?? 0) || a.properties.name.localeCompare(b.properties.name)).slice(0, 150);
  }, [features, query]);
  const feature = features.find(item => item.id === selected);
  const evidence = datasets?.find(dataset => dataset.metadata.dataset_id === feature?.properties.dataset_id)?.metadata ?? datasets?.[0]?.metadata;

  function choose(id: string) {
    setSelected(id);
    mounted.current.forEach(handle => handle.setSelected(id || null));
    const item = features.find(featureItem => featureItem.id === id);
    if (!item || !map) return;
    const lon = item.properties.centroid_longitude;
    const lat = item.properties.centroid_latitude;
    if (lon !== undefined && lat !== undefined) map.easeTo({ center: [lon, lat], zoom: Math.max(map.getZoom(), 9), duration: 0 });
  }

  return <section className="thematic-controls glaciers-controls" aria-label={t('Glaciers', 'हिमनदीहरू')} data-glaciers-state={resource.status}>
    <h2>{t('Glaciers', 'हिमनदीहरू')}</h2>
    <p>Randolph Glacier Inventory 7.0 · {t('source-dated outlines', 'स्रोतमा मिति उल्लेख भएका रूपरेखा')}</p>
    {map ? <DataState state={resource} retry={() => { setResource({ status: 'loading' }); setSelected(''); setAttempt(value => value + 1); }} /> : <p className="muted">{t('Glacier controls require the interactive map.', 'हिमनदी नियन्त्रणका लागि अन्तरक्रियात्मक नक्सा चाहिन्छ।')}</p>}
    <label><input type="checkbox" checked={visible} disabled={!datasets} onChange={event => setVisible(event.target.checked)} /> {t('Show glacier inventory', 'हिमनदी अभिलेख (inventory) देखाउनुहोस्')}</label>
    <p className="muted">{t('These are RGI inventory outlines, not 2026 glacier margins. Individual source dates range from 1992 to 2010 and are shown per glacier.', 'यी RGI अभिलेखका रूपरेखा हुन्, सन् २०२६ का हिमनदी किनारा होइनन्। स्रोतका मितिहरू हिमनदी अनुसार १९९२ देखि २०१० सम्मका छन् र प्रत्येक हिमनदीसँग देखाइएका छन्।')}</p>
    <label className="thematic-picker">{t('Search glaciers', 'हिमनदी खोज्नुहोस्')}<input type="search" value={query} disabled={!datasets} placeholder="Imja, Barun, RGI ID, GLIMS ID…" onChange={event => setQuery(event.target.value)} /></label>
    <label className="thematic-picker">{t('Glacier record', 'हिमनदी अभिलेख')}<select value={selected} disabled={!datasets} onChange={event => choose(event.target.value)}>
      <option value="">{t('Select a glacier…', 'हिमनदी छान्नुहोस्…')}</option>
      {matches.map(item => <option key={String(item.id)} value={String(item.id)}>{item.properties.glacier_name ?? item.properties.source_id} · {num(item.properties.area_km2, 2)} km²</option>)}
    </select></label>
    <div className="selection" aria-live="polite">{feature ? <>
      <p className="eyebrow">{t('glacier inventory outline', 'हिमनदी अभिलेखको रूपरेखा')}</p><h3>{feature.properties.glacier_name ?? t('Unnamed glacier', 'नाम नभएको हिमनदी')}</h3>
      <dl>
        <dt>RGI ID</dt><dd>{feature.properties.source_id}</dd>
        <dt>GLIMS ID</dt><dd>{feature.properties.glims_id}</dd>
        <dt>{t('Name', 'नाम')}</dt><dd>{feature.properties.glacier_name ?? t('UNKNOWN', 'अज्ञात (UNKNOWN)')}</dd>
        <dt>{t('Source area', 'स्रोतको क्षेत्रफल')}</dt><dd>{num(feature.properties.area_km2, 3)} km²</dd>
        <dt>{t('Outline date', 'रूपरेखाको मिति')}</dt><dd>{feature.properties.outline_date}</dd>
        <dt>{t('Mean elevation', 'औसत उचाइ')}</dt><dd>{num(feature.properties.elevation_mean_m, 0)} m</dd>
        <dt>{t('Elevation range', 'उचाइको दायरा')}</dt><dd>{num(feature.properties.elevation_min_m, 0)}–{num(feature.properties.elevation_max_m, 0)} m</dd>
        <dt>{t('DEM source', 'DEM स्रोत')}</dt><dd>{feature.properties.dem_source}</dd>
        <dt>{t('Inventory region', 'अभिलेख क्षेत्र')}</dt><dd>{feature.properties.inventory_region}</dd>
        <dt>{t('Display repair', 'प्रदर्शनका लागि मर्मत')}</dt><dd>{feature.properties.display_geometry_repaired ? t('Yes — source WFS display geometry was repaired for rendering', 'हो — देखाउनका लागि स्रोत WFS को प्रदर्शन ज्यामिति (geometry) मर्मत गरिएको') : t('No', 'होइन')}</dd>
        <dt>{t('Downstream trace', 'तलतिरको मार्ग')}</dt><dd>{t('UNKNOWN — this inventory does not identify a river outlet. ', 'अज्ञात (UNKNOWN) — यो अभिलेखले नदीको निकास पहिचान गर्दैन। ')}<a href="#downstream-trace">{t('Trace a separately selected river reach', 'छुट्टै छानिएको नदी खण्डको मार्ग पछ्याउनुहोस्')}</a>{t('.', '।')}</dd>
      </dl>
    </> : <p>{t('Select a glacier to inspect its stable RGI/GLIMS identity, dated outline, source area and inventory metadata.', 'हिमनदीको स्थिर RGI/GLIMS पहिचान, मिति सहितको रूपरेखा, स्रोतको क्षेत्रफल र अभिलेखको मेटाडाटा हेर्न हिमनदी छान्नुहोस्।')}</p>}</div>
    {evidence && <details><summary>{t('Glacier source & limitations', 'हिमनदीको स्रोत र सीमाहरू')}</summary><Evidence metadata={evidence} /></details>}
  </section>;
}
