'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { Map, MapLayerMouseEvent } from 'maplibre-gl';
import { isStale, type Dataset } from '../../../../packages/contracts';
import { DataState } from '../../components/data-state';
import { Evidence } from '../../components/evidence';
import { GLACIAL_LAKES_MANIFEST, loadDataset, UnavailableError } from '../../lib/datasets';
import { mountGlacialLakeDataset } from '../../lib/map-layers';
import type { Resource } from '../../lib/resource';
import { digits, useLanguage } from '../../lib/i18n';

function measurement(value: number | null | undefined, fraction = 4, lang: 'en' | 'ne' = 'en') {
  if (value === null || value === undefined) return lang === 'ne' ? 'अज्ञात (UNKNOWN)' : 'UNKNOWN';
  return digits(value.toLocaleString('en-US', { maximumFractionDigits: fraction }), lang);
}
const COUNTRY_NE: Record<string, string> = { Nepal: 'नेपाल', China: 'चीन', India: 'भारत' };

export interface LakeChoice { id: string; label: string; lonLat: [number, number] }

export function GlacialLakes({ map, onSelect, onTrace }: { map: Map | null; onSelect?: (lake: LakeChoice | null) => void; onTrace?: (lake: LakeChoice) => void }) {
  const [resource, setResource] = useState<Resource<Dataset>>({ status: 'loading' });
  const [attempt, setAttempt] = useState(0);
  const [visible, setVisible] = useState(true);
  const [selected, setSelected] = useState('');
  const [query, setQuery] = useState('');
  const mounted = useRef<ReturnType<typeof mountGlacialLakeDataset> | null>(null);
  const dataset = 'data' in resource ? resource.data : null;
  const [lang] = useLanguage();
  const t = (en: string, ne: string) => lang === 'ne' ? ne : en;
  const n = (value: number) => digits(value.toLocaleString('en-US'), lang);
  const unknown = t('UNKNOWN', 'अज्ञात (UNKNOWN)');

  useEffect(() => {
    if (!map) return;
    const controller = new AbortController();
    let handle: ReturnType<typeof mountGlacialLakeDataset> | null = null;
    let onClick: ((event: MapLayerMouseEvent) => void) | null = null;
    void (async () => {
      try {
        const data = await loadDataset(GLACIAL_LAKES_MANIFEST, controller.signal);
        if (controller.signal.aborted) return;
        handle = mountGlacialLakeDataset(map, data);
        mounted.current = handle;
        handle.setVisible(visible);
        onClick = event => {
          const id = event.features?.[0]?.id;
          if (id === undefined) return;
          const value = String(id);
          setSelected(value);
          handle?.setSelected(value);
        };
        map.on('click', handle.interactiveLayers, onClick);
        setResource({ status: isStale(data.metadata) ? 'stale' : data.collection.features.length ? 'ready' : 'empty', data });
      } catch (error) {
        handle?.dispose();
        if (!controller.signal.aborted) setResource({
          status: error instanceof UnavailableError ? 'unavailable' : 'error',
          message: error instanceof Error ? error.message : 'Glacial lake inventory unavailable',
        });
      }
    })();
    return () => {
      controller.abort();
      if (handle && onClick) map.off('click', handle.interactiveLayers, onClick);
      handle?.dispose();
      if (mounted.current === handle) mounted.current = null;
    };
  // Visibility changes do not reacquire immutable releases.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, attempt]);

  useEffect(() => { mounted.current?.setVisible(visible); }, [visible]);

  const matches = useMemo(() => {
    if (!dataset) return [];
    const needle = query.trim().toLocaleLowerCase('en-US');
    const items = needle ? dataset.collection.features.filter(feature => feature.properties.search_terms?.some(term => term.toLocaleLowerCase('en-US').includes(needle))) : dataset.collection.features;
    return items.slice().sort((a, b) => (b.properties.area_km2 ?? 0) - (a.properties.area_km2 ?? 0) || a.properties.source_id!.localeCompare(b.properties.source_id!)).slice(0, 180);
  }, [dataset, query]);
  const feature = dataset?.collection.features.find(item => item.id === selected);
  const choice = useMemo<LakeChoice | null>(() => feature && feature.geometry.type === 'Point'
    ? { id: String(feature.properties.source_id), label: String(feature.properties.lake_name ?? feature.properties.source_id), lonLat: feature.geometry.coordinates as [number, number] }
    : null, [feature]);
  useEffect(() => { onSelect?.(choice); }, [choice, onSelect]);
  const counts = useMemo(() => {
    const result = { Nepal: 0, China: 0, India: 0 };
    for (const item of dataset?.collection.features ?? []) {
      const country = item.properties.country;
      if (country && country in result) result[country as keyof typeof result] += 1;
    }
    return result;
  }, [dataset]);

  function choose(id: string) {
    setSelected(id);
    mounted.current?.setSelected(id || null);
    const item = dataset?.collection.features.find(featureItem => featureItem.id === id);
    if (!item || !map || item.geometry.type !== 'Point') return;
    map.easeTo({ center: item.geometry.coordinates as [number, number], zoom: Math.max(map.getZoom(), 9), duration: 0 });
  }

  return <section className="thematic-controls glacial-lakes-controls" aria-label={t('Glacial lakes', 'हिमतालहरू')} data-glacial-lakes-state={resource.status}>
    <h2>{t('Glacial lakes', 'हिमतालहरू')}</h2>
    <p>Glacial Lake Observatory v1.02 · Sentinel-2 · {digits('2017–2024', lang)}</p>
    {map ? <DataState state={resource} retry={() => { setResource({ status: 'loading' }); setSelected(''); setAttempt(value => value + 1); }} /> : <p className="muted">{t('Glacial-lake controls require the interactive map.', 'हिमताल नियन्त्रणका लागि अन्तरक्रियात्मक नक्सा चाहिन्छ।')}</p>}
    <label><input type="checkbox" checked={visible} disabled={!dataset} onChange={event => setVisible(event.target.checked)} /> {t('Show GLO unique lakes', 'GLO का अद्वितीय तालहरू देखाउनुहोस्')}</label>
    {dataset && <p className="muted">{lang === 'ne'
      ? `नेपाल/सीमापार जलाधारमा ${n(dataset.collection.features.length)} अद्वितीय तालहरू · नेपाल ${n(counts.Nepal)} · चीन ${n(counts.China)} · भारत ${n(counts.India)}।`
      : `${dataset.collection.features.length.toLocaleString('en-US')} unique lakes in Nepal/transboundary catchments · Nepal ${counts.Nepal.toLocaleString('en-US')} · China ${counts.China.toLocaleString('en-US')} · India ${counts.India.toLocaleString('en-US')}.`}</p>}
    <p className="muted">{t('Points are published GLO centroids. Circle size uses the source dissolved maximum mapped extent across 2017–2024; it is not a 2026 lake-area measurement.', 'बिन्दुहरू प्रकाशित GLO केन्द्रबिन्दु (centroid) हुन्। वृत्तको आकार स्रोतले २०१७–२०२४ ई. सम्ममा नक्सांकन गरेको अधिकतम एकीकृत (dissolved) विस्तारमा आधारित छ; यो २०२६ को ताल-क्षेत्रफल मापन होइन।')}</p>
    <label className="thematic-picker">{t('Search lakes', 'ताल खोज्नुहोस्')}<input type="search" value={query} disabled={!dataset} placeholder="GLO_87.08864_27.79792, Koshi, Nepal…" onChange={event => setQuery(event.target.value)} /></label>
    <label className="thematic-picker">{t('Lake record', 'ताल अभिलेख')}<select value={selected} disabled={!dataset} onChange={event => choose(event.target.value)}>
      <option value="">{t('Select a lake…', 'ताल छान्नुहोस्…')}</option>
      {matches.map(item => <option key={String(item.id)} value={String(item.id)}>{item.properties.source_id} · {lang === 'ne' ? COUNTRY_NE[String(item.properties.country)] ?? item.properties.country : item.properties.country} · {measurement(item.properties.area_km2, 3, lang)} km²</option>)}
    </select></label>
    <div className="selection" aria-live="polite">{feature ? <>
      <p className="eyebrow">{t('satellite-derived glacial lake record', 'भू-उपग्रहबाट प्राप्त हिमताल अभिलेख')}</p><h3>{feature.properties.lake_name ?? feature.properties.source_id}</h3>
      <dl>
        <dt>{t('Lake name', 'तालको नाम')}</dt><dd>{feature.properties.lake_name ?? unknown}</dd>
        <dt>GLO ID</dt><dd>{feature.properties.source_id}</dd>
        <dt>{t('Country', 'देश')}</dt><dd>{lang === 'ne' ? COUNTRY_NE[String(feature.properties.country)] ?? feature.properties.country : feature.properties.country}</dd>
        <dt>{t('Basin', 'जलाधार')}</dt><dd>{feature.properties.basin}</dd>
        <dt>{t('Connectivity', 'जडान')}</dt><dd>{feature.properties.connectivity}</dd>
        <dt>{t('Mapped extent', 'नक्सांकित विस्तार')}</dt><dd>{measurement(feature.properties.area_km2, 4, lang)} km² {t('(dissolved maximum, 2017–2024)', '(एकीकृत अधिकतम, २०१७–२०२४ ई.)')}</dd>
        <dt>{t('Perimeter', 'परिधि')}</dt><dd>{measurement(feature.properties.perimeter_km, 4, lang)} km</dd>
        <dt>{t('Mean elevation', 'औसत उचाइ')}</dt><dd>{measurement(feature.properties.elevation_mean_m, 0, lang)} m</dd>
        <dt>{t('Expansion rate', 'विस्तार दर')}</dt><dd>{feature.properties.expansion_rate_km2_per_year === null ? unknown : `${measurement(feature.properties.expansion_rate_km2_per_year, 4, lang)} ± ${measurement(feature.properties.expansion_uncertainty_km2_per_year, 4, lang)} ${t('km²/year', 'km²/वर्ष')}`}</dd>
        <dt>{t('Expansion significance', 'विस्तारको सार्थकता')}</dt><dd>{feature.properties.expansion_significant === null ? unknown : feature.properties.expansion_significant ? t('TRUE (source statistical flag)', 'सत्य — TRUE (स्रोतको तथ्याङ्कीय सङ्केत)') : t('FALSE (source statistical flag)', 'असत्य — FALSE (स्रोतको तथ्याङ्कीय सङ्केत)')}</dd>
        <dt>{t('Specific glacier', 'सम्बन्धित हिमनदी')}</dt><dd>{t('UNKNOWN — not identified by this source layer', 'अज्ञात (UNKNOWN) — यस स्रोत तहले पहिचान गरेको छैन')}</dd>
        <dt>{t('Specific river', 'सम्बन्धित नदी')}</dt><dd>{t('UNKNOWN — basin only; no river ID supplied', 'अज्ञात (UNKNOWN) — जलाधार मात्र; नदीको ID दिइएको छैन')}</dd>
        <dt>{t('Downstream trace', 'तलतिरको मार्ग')}</dt><dd>{t('The real outlet is UNKNOWN. The trace starts at the mapped river reach nearest the lake centroid and shows network connectivity only.', 'वास्तविक निकास अज्ञात (UNKNOWN) छ। मार्ग तालको केन्द्रबिन्दुसँग सबैभन्दा नजिकको नक्सांकित नदी खण्डबाट सुरु हुन्छ र सञ्जालको जडान मात्र देखाउँछ।')}{choice && onTrace && <><br /><button type="button" className="trace-lake" onClick={() => onTrace(choice)}>{t('Trace water downstream', 'पानी तलतिर पछ्याउनुहोस्')}</button></>}</dd>
        <dt>{t('Hazard status', 'जोखिम स्थिति')}</dt><dd>{t('NOT ASSESSED — glacial-lake presence or expansion is not a GLOF hazard classification', 'मूल्याङ्कन गरिएको छैन (NOT ASSESSED) — हिमताल हुनु वा फैलिनु हिमताल विस्फोट (GLOF) जोखिम वर्गीकरण होइन')}</dd>
      </dl>
    </> : <p>{t('Select a GLO record to inspect mapped extent, source connectivity, basin, elevation and change statistics without implying hazard status.', 'जोखिम स्थिति नजनाई नक्सांकित विस्तार, स्रोतको जडान, जलाधार, उचाइ र परिवर्तनको तथ्याङ्क हेर्न GLO अभिलेख छान्नुहोस्।')}</p>}</div>
    {dataset && <details><summary>{t('Glacial-lake source & limitations', 'हिमतालको स्रोत र सीमाहरू')}</summary><Evidence metadata={dataset.metadata} /></details>}
  </section>;
}
