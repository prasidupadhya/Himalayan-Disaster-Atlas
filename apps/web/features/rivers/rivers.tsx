'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { Map, MapLayerMouseEvent } from 'maplibre-gl';
import { isStale, type Dataset } from '../../../../packages/contracts';
import { DataState } from '../../components/data-state';
import { Evidence } from '../../components/evidence';
import { loadDataset, RIVER_MANIFESTS, UnavailableError } from '../../lib/datasets';
import { mountRiverDataset } from '../../lib/map-layers';
import type { Resource } from '../../lib/resource';
import { DownstreamTrace } from '../downstream-trace/downstream-trace';

export function Rivers({ map }: { map: Map | null }) {
  const [resource, setResource] = useState<Resource<Dataset[]>>({ status: 'loading' });
  const [attempt, setAttempt] = useState(0);
  const [visible, setVisible] = useState(true);
  const [selected, setSelected] = useState('');
  const [query, setQuery] = useState('');
  const mounted = useRef<ReturnType<typeof mountRiverDataset>[]>([]);
  const datasets = 'data' in resource ? resource.data : null;

  useEffect(() => {
    if (!map) return;
    const controller = new AbortController();
    const handles: ReturnType<typeof mountRiverDataset>[] = [];
    let onClick: ((event: MapLayerMouseEvent) => void) | null = null;
    void (async () => {
      try {
        const data = await Promise.all(RIVER_MANIFESTS.map(path => loadDataset(path, controller.signal)));
        if (controller.signal.aborted) return;
        handles.push(...data.map(dataset => mountRiverDataset(map, dataset)));
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
          message: error instanceof Error ? error.message : 'River network unavailable',
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
    return filtered.slice().sort((a, b) => (a.properties.flow_order ?? 99) - (b.properties.flow_order ?? 99) || (b.properties.average_discharge_m3s ?? 0) - (a.properties.average_discharge_m3s ?? 0)).slice(0, 150);
  }, [features, query]);
  const feature = features.find(item => item.id === selected);
  const evidence = datasets?.find(dataset => dataset.metadata.dataset_id === feature?.properties.dataset_id)?.metadata ?? datasets?.[0]?.metadata;

  function choose(id: string) {
    setSelected(id);
    mounted.current.forEach(handle => handle.setSelected(id || null));
    const item = features.find(featureItem => featureItem.id === id);
    if (!item || !map) return;
    const coordinates = item.geometry.type === 'LineString' ? item.geometry.coordinates[0] : item.geometry.type === 'MultiLineString' ? item.geometry.coordinates[0]?.[0] : null;
    if (coordinates) map.easeTo({ center: coordinates as [number, number], zoom: Math.max(map.getZoom(), 8), duration: 0 });
  }

  return <section className="thematic-controls rivers-controls" aria-label="Rivers" data-rivers-state={resource.status}>
    <h2>Rivers</h2>
    <p>FAO Rivers 2026 / HydroRIVERS · connected reach IDs</p>
    {map ? <DataState state={resource} retry={() => { setResource({ status: 'loading' }); setSelected(''); setAttempt(value => value + 1); }} /> : <p className="muted">River controls require the interactive map.</p>}
    <label><input type="checkbox" checked={visible} disabled={!datasets} onChange={event => setVisible(event.target.checked)} /> Show river network</label>
    <p className="muted">Primary and mid-order reaches appear first; headwater/minor reaches load from zoom 6.5. The two web partitions preserve one continuous HYRIV_ID/NEXT_DOWN network.</p>
    <label className="thematic-picker">Find a reach<input type="search" value={query} disabled={!datasets} placeholder="HYRIV 40669746…" onChange={event => setQuery(event.target.value)} /></label>
    <label className="thematic-picker">River reach<select value={selected} disabled={!datasets} onChange={event => choose(event.target.value)}>
      <option value="">Select a reach…</option>
      {feature && !matches.some(item => item.id === feature.id) && <option value={String(feature.id)}>HYRIV {feature.properties.source_id} (selected on map)</option>}
      {matches.map(item => <option key={String(item.id)} value={String(item.id)}>HYRIV {item.properties.source_id} · order {item.properties.flow_order} · {item.properties.average_discharge_m3s?.toLocaleString('en-US')} m³/s</option>)}
    </select></label>
    <p className="muted">The source does not provide river names for these reaches. Search and selection therefore use stable HYRIV_ID values.</p>
    <div className="selection" aria-live="polite">{feature ? <>
      <p className="eyebrow">river reach</p><h3>HYRIV {feature.properties.source_id}</h3>
      <dl>
        <dt>River name</dt><dd>{feature.properties.river_name ?? 'UNKNOWN'}</dd>
        <dt>Flow order</dt><dd>{feature.properties.flow_order}</dd>
        <dt>Average discharge</dt><dd>{feature.properties.average_discharge_m3s?.toLocaleString('en-US')} m³/s</dd>
        <dt>Flow regime</dt><dd>{feature.properties.flow_regime}</dd>
        <dt>Reach length</dt><dd>{feature.properties.length_km?.toLocaleString('en-US')} km</dd>
        <dt>Upstream area</dt><dd>{feature.properties.upstream_area_km2?.toLocaleString('en-US')} km²</dd>
        <dt>Catchment area</dt><dd>{feature.properties.catchment_area_km2?.toLocaleString('en-US')} km²</dd>
        <dt>Next downstream</dt><dd>{feature.properties.downstream_id ? `HYRIV ${feature.properties.downstream_id}${feature.properties.downstream_in_release ? '' : ' (outside Nepal release)'}` : 'Source outlet'}</dd>
        <dt>Main river ID</dt><dd>{feature.properties.main_river_id}</dd>
        <dt>HydroBASINS L12</dt><dd>{feature.properties.hydrobasin_level12_id}</dd>
      </dl>
    </> : <p>Select a reach to inspect its topology, source measurements and stable downstream linkage.</p>}</div>
    {evidence && <details><summary>River source & limitations</summary><Evidence metadata={evidence} /></details>}
    <DownstreamTrace key={`${selected}-${attempt}`} map={map} datasets={datasets} start={feature?.properties.source_id} />
  </section>;
}
