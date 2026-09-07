'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { Map, MapLayerMouseEvent } from 'maplibre-gl';
import { isStale, type Dataset } from '../../../../packages/contracts';
import { DataState } from '../../components/data-state';
import { Evidence } from '../../components/evidence';
import { GLACIAL_LAKES_MANIFEST, loadDataset, UnavailableError } from '../../lib/datasets';
import { mountGlacialLakeDataset } from '../../lib/map-layers';
import type { Resource } from '../../lib/resource';

function measurement(value: number | null | undefined, digits = 4) {
  return value === null || value === undefined ? 'UNKNOWN' : value.toLocaleString('en-US', { maximumFractionDigits: digits });
}

export function GlacialLakes({ map }: { map: Map | null }) {
  const [resource, setResource] = useState<Resource<Dataset>>({ status: 'loading' });
  const [attempt, setAttempt] = useState(0);
  const [visible, setVisible] = useState(true);
  const [selected, setSelected] = useState('');
  const [query, setQuery] = useState('');
  const mounted = useRef<ReturnType<typeof mountGlacialLakeDataset> | null>(null);
  const dataset = 'data' in resource ? resource.data : null;

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

  return <section className="thematic-controls glacial-lakes-controls" aria-label="Glacial lakes" data-glacial-lakes-state={resource.status}>
    <h2>Glacial lakes</h2>
    <p>Glacial Lake Observatory v1.02 · Sentinel-2 · 2017–2024</p>
    {map ? <DataState state={resource} retry={() => { setResource({ status: 'loading' }); setSelected(''); setAttempt(value => value + 1); }} /> : <p className="muted">Glacial-lake controls require the interactive map.</p>}
    <label><input type="checkbox" checked={visible} disabled={!dataset} onChange={event => setVisible(event.target.checked)} /> Show GLO unique lakes</label>
    {dataset && <p className="muted">{dataset.collection.features.length.toLocaleString('en-US')} unique lakes in Nepal/transboundary catchments · Nepal {counts.Nepal.toLocaleString('en-US')} · China {counts.China.toLocaleString('en-US')} · India {counts.India.toLocaleString('en-US')}.</p>}
    <p className="muted">Points are published GLO centroids. Circle size uses the source dissolved maximum mapped extent across 2017–2024; it is not a 2026 lake-area measurement.</p>
    <label className="thematic-picker">Search lakes<input type="search" value={query} disabled={!dataset} placeholder="GLO_87.08864_27.79792, Koshi, Nepal…" onChange={event => setQuery(event.target.value)} /></label>
    <label className="thematic-picker">Lake record<select value={selected} disabled={!dataset} onChange={event => choose(event.target.value)}>
      <option value="">Select a lake…</option>
      {matches.map(item => <option key={String(item.id)} value={String(item.id)}>{item.properties.source_id} · {item.properties.country} · {measurement(item.properties.area_km2, 3)} km²</option>)}
    </select></label>
    <div className="selection" aria-live="polite">{feature ? <>
      <p className="eyebrow">satellite-derived glacial lake record</p><h3>{feature.properties.lake_name ?? feature.properties.source_id}</h3>
      <dl>
        <dt>Lake name</dt><dd>{feature.properties.lake_name ?? 'UNKNOWN'}</dd>
        <dt>GLO ID</dt><dd>{feature.properties.source_id}</dd>
        <dt>Country</dt><dd>{feature.properties.country}</dd>
        <dt>Basin</dt><dd>{feature.properties.basin}</dd>
        <dt>Connectivity</dt><dd>{feature.properties.connectivity}</dd>
        <dt>Mapped extent</dt><dd>{measurement(feature.properties.area_km2, 4)} km² (dissolved maximum, 2017–2024)</dd>
        <dt>Perimeter</dt><dd>{measurement(feature.properties.perimeter_km, 4)} km</dd>
        <dt>Mean elevation</dt><dd>{measurement(feature.properties.elevation_mean_m, 0)} m</dd>
        <dt>Expansion rate</dt><dd>{feature.properties.expansion_rate_km2_per_year === null ? 'UNKNOWN' : `${measurement(feature.properties.expansion_rate_km2_per_year, 4)} ± ${measurement(feature.properties.expansion_uncertainty_km2_per_year, 4)} km²/year`}</dd>
        <dt>Expansion significance</dt><dd>{feature.properties.expansion_significant === null ? 'UNKNOWN' : feature.properties.expansion_significant ? 'TRUE (source statistical flag)' : 'FALSE (source statistical flag)'}</dd>
        <dt>Specific glacier</dt><dd>UNKNOWN — not identified by this source layer</dd>
        <dt>Specific river</dt><dd>UNKNOWN — basin only; no river ID supplied</dd>
        <dt>Hazard status</dt><dd>NOT ASSESSED — glacial-lake presence or expansion is not a GLOF hazard classification</dd>
      </dl>
    </> : <p>Select a GLO record to inspect mapped extent, source connectivity, basin, elevation and change statistics without implying hazard status.</p>}</div>
    {dataset && <details><summary>Glacial-lake source & limitations</summary><Evidence metadata={dataset.metadata} /></details>}
  </section>;
}
