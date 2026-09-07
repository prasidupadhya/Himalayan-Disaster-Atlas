'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { Map, MapLayerMouseEvent } from 'maplibre-gl';
import { isStale, type Dataset } from '../../../../packages/contracts';
import { DataState } from '../../components/data-state';
import { Evidence } from '../../components/evidence';
import { GLACIER_MANIFESTS, loadDataset, UnavailableError } from '../../lib/datasets';
import { mountGlacierDataset } from '../../lib/map-layers';
import type { Resource } from '../../lib/resource';

export function Glaciers({ map }: { map: Map | null }) {
  const [resource, setResource] = useState<Resource<Dataset[]>>({ status: 'loading' });
  const [attempt, setAttempt] = useState(0);
  const [visible, setVisible] = useState(true);
  const [selected, setSelected] = useState('');
  const [query, setQuery] = useState('');
  const mounted = useRef<ReturnType<typeof mountGlacierDataset>[]>([]);
  const datasets = 'data' in resource ? resource.data : null;

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

  return <section className="thematic-controls glaciers-controls" aria-label="Glaciers" data-glaciers-state={resource.status}>
    <h2>Glaciers</h2>
    <p>Randolph Glacier Inventory 7.0 · source-dated outlines</p>
    {map ? <DataState state={resource} retry={() => { setResource({ status: 'loading' }); setSelected(''); setAttempt(value => value + 1); }} /> : <p className="muted">Glacier controls require the interactive map.</p>}
    <label><input type="checkbox" checked={visible} disabled={!datasets} onChange={event => setVisible(event.target.checked)} /> Show glacier inventory</label>
    <p className="muted">These are RGI inventory outlines, not 2026 glacier margins. Individual source dates range from 1992 to 2010 and are shown per glacier.</p>
    <label className="thematic-picker">Search glaciers<input type="search" value={query} disabled={!datasets} placeholder="Imja, Barun, RGI ID, GLIMS ID…" onChange={event => setQuery(event.target.value)} /></label>
    <label className="thematic-picker">Glacier record<select value={selected} disabled={!datasets} onChange={event => choose(event.target.value)}>
      <option value="">Select a glacier…</option>
      {matches.map(item => <option key={String(item.id)} value={String(item.id)}>{item.properties.glacier_name ?? item.properties.source_id} · {item.properties.area_km2?.toLocaleString('en-US', { maximumFractionDigits: 2 })} km²</option>)}
    </select></label>
    <div className="selection" aria-live="polite">{feature ? <>
      <p className="eyebrow">glacier inventory outline</p><h3>{feature.properties.glacier_name ?? 'Unnamed glacier'}</h3>
      <dl>
        <dt>RGI ID</dt><dd>{feature.properties.source_id}</dd>
        <dt>GLIMS ID</dt><dd>{feature.properties.glims_id}</dd>
        <dt>Name</dt><dd>{feature.properties.glacier_name ?? 'UNKNOWN'}</dd>
        <dt>Source area</dt><dd>{feature.properties.area_km2?.toLocaleString('en-US', { maximumFractionDigits: 3 })} km²</dd>
        <dt>Outline date</dt><dd>{feature.properties.outline_date}</dd>
        <dt>Mean elevation</dt><dd>{feature.properties.elevation_mean_m?.toLocaleString('en-US', { maximumFractionDigits: 0 })} m</dd>
        <dt>Elevation range</dt><dd>{feature.properties.elevation_min_m?.toLocaleString('en-US', { maximumFractionDigits: 0 })}–{feature.properties.elevation_max_m?.toLocaleString('en-US', { maximumFractionDigits: 0 })} m</dd>
        <dt>DEM source</dt><dd>{feature.properties.dem_source}</dd>
        <dt>Inventory region</dt><dd>{feature.properties.inventory_region}</dd>
        <dt>Display repair</dt><dd>{feature.properties.display_geometry_repaired ? 'Yes — source WFS display geometry was repaired for rendering' : 'No'}</dd>
        <dt>Downstream trace</dt><dd>UNKNOWN — this inventory does not identify a river outlet. <a href="#downstream-trace">Trace a separately selected river reach</a>.</dd>
      </dl>
    </> : <p>Select a glacier to inspect its stable RGI/GLIMS identity, dated outline, source area and inventory metadata.</p>}</div>
    {evidence && <details><summary>Glacier source & limitations</summary><Evidence metadata={evidence} /></details>}
  </section>;
}
