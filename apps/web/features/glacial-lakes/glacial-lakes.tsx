'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { Map, MapLayerMouseEvent } from 'maplibre-gl';
import { isStale, type Dataset } from '../../../../packages/contracts';
import { DataState } from '../../components/data-state';
import { Evidence } from '../../components/evidence';
import { GLACIAL_LAKES_MANIFEST, loadDataset, UnavailableError } from '../../lib/datasets';
import { mountGlacialLakeDataset } from '../../lib/map-layers';
import type { Resource } from '../../lib/resource';
import { digits, useLanguage, useCopy } from '../../lib/i18n';
import { LAKES } from './copy';

function measurement(value: number | null | undefined, fraction = 4, lang: 'en' | 'ne' = 'en') {
  if (value === null || value === undefined) return LAKES[lang].unknown;
  return digits(value.toLocaleString('en-US', { maximumFractionDigits: fraction }), lang);
}
const COUNTRY_NE: Record<string, string> = { Nepal: 'नेपाल', China: 'चीन', India: 'भारत' };

export interface LakeChoice { id: string; label: string; lonLat: [number, number] }

/** `onReveal` runs when a lake is chosen on the map, so the page can bring these controls into view. */
export function GlacialLakes({ map, onSelect, onTrace, onReveal }: { map: Map | null; onSelect?: (lake: LakeChoice | null) => void; onTrace?: (lake: LakeChoice) => void; onReveal?: () => void }) {
  const reveal = useRef(onReveal);
  useEffect(() => { reveal.current = onReveal; });
  const [resource, setResource] = useState<Resource<Dataset>>({ status: 'loading' });
  const [attempt, setAttempt] = useState(0);
  const [visible, setVisible] = useState(true);
  const [selected, setSelected] = useState('');
  const [query, setQuery] = useState('');
  const mounted = useRef<ReturnType<typeof mountGlacialLakeDataset> | null>(null);
  const dataset = 'data' in resource ? resource.data : null;
  const [lang] = useLanguage();
  const c = useCopy(LAKES);
  const n = (value: number) => digits(value.toLocaleString('en-US'), lang);
  const unknown = c.unknown;

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
          reveal.current?.();
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

  return <section className="thematic-controls glacial-lakes-controls" aria-label={c.glacialLakes} data-glacial-lakes-state={resource.status}>
    <h2>{c.glacialLakes}</h2>
    <p>Glacial Lake Observatory v1.02 · Sentinel-2 · {digits('2017–2024', lang)}</p>
    {map ? <DataState state={resource} retry={() => { setResource({ status: 'loading' }); setSelected(''); setAttempt(value => value + 1); }} /> : <p className="muted">{c.glacialLakeControlsRequire}</p>}
    <label><input type="checkbox" checked={visible} disabled={!dataset} onChange={event => setVisible(event.target.checked)} /> {c.showGloUniqueLakes}</label>
    {dataset && <p className="muted">{c.counts(n(dataset.collection.features.length), n(counts.Nepal), n(counts.China), n(counts.India))}</p>}
    <p className="muted">{c.pointsPublishedGloCentroids}</p>
    <label className="thematic-picker">{c.searchLakes}<input type="search" autoComplete="off" autoCapitalize="none" autoCorrect="off" spellCheck={false} enterKeyHint="search" value={query} disabled={!dataset} placeholder="GLO_87.08864_27.79792, Koshi, Nepal…" onChange={event => setQuery(event.target.value)} /></label>
    <label className="thematic-picker">{c.lakeRecord}<select value={selected} disabled={!dataset} onChange={event => choose(event.target.value)}>
      <option value="">{c.selectLake}</option>
      {matches.map(item => <option key={String(item.id)} value={String(item.id)}>{item.properties.source_id} · {lang === 'ne' ? COUNTRY_NE[String(item.properties.country)] ?? item.properties.country : item.properties.country} · {measurement(item.properties.area_km2, 3, lang)} km²</option>)}
    </select></label>
    <div className="selection" aria-live="polite">{feature ? <>
      <p className="eyebrow">{c.satelliteDerivedGlacialLake}</p><h3>{feature.properties.lake_name ?? feature.properties.source_id}</h3>
      <dl>
        <dt>{c.lakeName}</dt><dd>{feature.properties.lake_name ?? unknown}</dd>
        <dt>GLO ID</dt><dd>{feature.properties.source_id}</dd>
        <dt>{c.country}</dt><dd>{lang === 'ne' ? COUNTRY_NE[String(feature.properties.country)] ?? feature.properties.country : feature.properties.country}</dd>
        <dt>{c.basin}</dt><dd>{feature.properties.basin}</dd>
        <dt>{c.connectivity}</dt><dd>{feature.properties.connectivity}</dd>
        <dt>{c.mappedExtent}</dt><dd>{measurement(feature.properties.area_km2, 4, lang)} km² {c.dissolvedMaximum20172024}</dd>
        <dt>{c.perimeter}</dt><dd>{measurement(feature.properties.perimeter_km, 4, lang)} km</dd>
        <dt>{c.meanElevation}</dt><dd>{measurement(feature.properties.elevation_mean_m, 0, lang)} m</dd>
        <dt>{c.expansionRate}</dt><dd>{feature.properties.expansion_rate_km2_per_year === null ? unknown : `${measurement(feature.properties.expansion_rate_km2_per_year, 4, lang)} ± ${measurement(feature.properties.expansion_uncertainty_km2_per_year, 4, lang)} ${c.kmYear}`}</dd>
        <dt>{c.expansionSignificance}</dt><dd>{feature.properties.expansion_significant === null ? unknown : feature.properties.expansion_significant ? c.trueSourceStatisticalFlag : c.falseSourceStatisticalFlag}</dd>
        <dt>{c.specificGlacier}</dt><dd>{c.unknownNotIdentifiedSource}</dd>
        <dt>{c.specificRiver}</dt><dd>{c.unknownBasinOnlyNo}</dd>
        <dt>{c.downstreamTrace}</dt><dd>{c.realOutletUnknownTrace}{choice && onTrace && <><br /><button type="button" className="trace-lake" onClick={() => onTrace(choice)}>{c.traceWaterDownstream}</button></>}</dd>
        <dt>{c.hazardStatus}</dt><dd>{c.notAssessedGlacialLake}</dd>
      </dl>
    </> : <p>{c.selectGloRecordInspect}</p>}</div>
    {dataset && <details><summary>{c.glacialLakeSourceLimitations}</summary><Evidence metadata={dataset.metadata} /></details>}
  </section>;
}
