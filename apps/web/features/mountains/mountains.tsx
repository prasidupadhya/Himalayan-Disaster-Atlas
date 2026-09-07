'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { Map, MapLayerMouseEvent } from 'maplibre-gl';
import { isStale, type Dataset } from '../../../../packages/contracts';
import { DataState } from '../../components/data-state';
import { Evidence } from '../../components/evidence';
import { loadDataset, MOUNTAINS_MANIFEST, UnavailableError } from '../../lib/datasets';
import { mountMountainDataset } from '../../lib/map-layers';
import type { Resource } from '../../lib/resource';

export function Mountains({ map }: { map: Map | null }) {
  const [resource, setResource] = useState<Resource<Dataset>>({ status: 'loading' });
  const [attempt, setAttempt] = useState(0);
  const [visible, setVisible] = useState(true);
  const [selected, setSelected] = useState<string>('');
  const [query, setQuery] = useState('');
  const mounted = useRef<ReturnType<typeof mountMountainDataset> | null>(null);
  const dataset = 'data' in resource ? resource.data : null;

  useEffect(() => {
    if (!map) return;
    const controller = new AbortController();
    let handle: ReturnType<typeof mountMountainDataset> | null = null;
    let onClick: ((event: MapLayerMouseEvent) => void) | null = null;
    void (async () => {
      try {
        const data = await loadDataset(MOUNTAINS_MANIFEST, controller.signal);
        if (controller.signal.aborted) return;
        handle = mountMountainDataset(map, data);
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
        setResource({
          status: isStale(data.metadata) ? 'stale' : data.collection.features.length ? 'ready' : 'empty',
          data,
        });
      } catch (error) {
        if (!controller.signal.aborted) setResource({
          status: error instanceof UnavailableError ? 'unavailable' : 'error',
          message: error instanceof Error ? error.message : 'Mountain catalogue unavailable',
        });
      }
    })();
    return () => {
      controller.abort();
      if (handle && onClick) map.off('click', handle.interactiveLayers, onClick);
      handle?.dispose();
      if (mounted.current === handle) mounted.current = null;
    };
  // Visibility is applied imperatively so toggling it does not reload the dataset.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, attempt]);

  useEffect(() => { mounted.current?.setVisible(visible); }, [visible]);

  const filtered = useMemo(() => {
    if (!dataset) return [];
    const needle = query.trim().toLocaleLowerCase('en-US');
    const items = needle ? dataset.collection.features.filter(feature =>
      feature.properties.search_terms?.some(term => term.toLocaleLowerCase('en-US').includes(needle)) ||
      feature.properties.source_id?.includes(needle)
    ) : dataset.collection.features;
    return items
      .slice()
      .sort((a, b) => (b.properties.value ?? -1) - (a.properties.value ?? -1) || a.properties.name.localeCompare(b.properties.name))
      .slice(0, 120);
  }, [dataset, query]);
  const feature = dataset?.collection.features.find(item => item.id === selected);

  function choose(id: string) {
    setSelected(id);
    mounted.current?.setSelected(id || null);
    const point = dataset?.collection.features.find(item => item.id === id);
    if (point && map && point.geometry.type === 'Point') map.easeTo({ center: point.geometry.coordinates as [number, number], zoom: Math.max(map.getZoom(), 8), duration: 0 });
  }

  return <section className="thematic-controls mountains-controls" aria-label="Mountains" data-mountains-state={resource.status}>
    <h2>Mountains</h2>
    <p>GeoNames Nepal peak catalogue · stable source IDs</p>
    {map ? <DataState state={resource} retry={() => { setResource({ status: 'loading' }); setSelected(''); setAttempt(value => value + 1); }} /> : <p className="muted">Mountain controls require the interactive map.</p>}
    <label><input type="checkbox" checked={visible} disabled={!dataset} onChange={event => setVisible(event.target.checked)} /> Show mountains</label>
    <p className="muted">Peaks at 7,000 m and above appear from the national view; lower peaks appear as you zoom in. Labels prioritize 6,000 m+ records to avoid visual crowding.</p>
    <label className="thematic-picker">Search peaks<input type="search" value={query} disabled={!dataset} placeholder="Everest, Manaslu, GeoNames ID…" onChange={event => setQuery(event.target.value)} /></label>
    <label className="thematic-picker">Mountain record<select value={selected} disabled={!dataset} onChange={event => choose(event.target.value)}>
      <option value="">Select a mountain…</option>
      {filtered.map(item => <option key={String(item.id)} value={String(item.id)}>{item.properties.name}{item.properties.value === null ? '' : ` — ${item.properties.value.toLocaleString('en-US')} m`}</option>)}
    </select></label>
    {query && dataset && <p className="muted">Showing up to 120 of {dataset.collection.features.filter(featureItem => featureItem.properties.search_terms?.some(term => term.toLocaleLowerCase('en-US').includes(query.trim().toLocaleLowerCase('en-US'))) || featureItem.properties.source_id?.includes(query.trim())).length} matches.</p>}
    <div className="selection" aria-live="polite">{feature ? <>
      <p className="eyebrow">mountain / peak</p>
      <h3>{feature.properties.name}</h3>
      <dl>
        <dt>Elevation</dt><dd>{feature.properties.value === null ? 'UNKNOWN' : `${feature.properties.value.toLocaleString('en-US')} m`}</dd>
        <dt>Coordinates</dt><dd>{feature.geometry.type === 'Point' ? `${feature.geometry.coordinates[1].toFixed(5)}, ${feature.geometry.coordinates[0].toFixed(5)}` : 'UNKNOWN'}</dd>
        <dt>GeoNames ID</dt><dd>{feature.properties.source_id}</dd>
        <dt>Feature code</dt><dd>{feature.properties.feature_code}</dd>
        <dt>Aliases</dt><dd>{feature.properties.aliases?.length ? feature.properties.aliases.join(', ') : 'UNKNOWN'}</dd>
        <dt>Source modified</dt><dd>{feature.properties.source_modified}</dd>
        <dt>Elevation reference</dt><dd>{feature.properties.elevation_reference}</dd>
      </dl>
    </> : <p>Select or search a mountain to inspect its stable ID, coordinates, elevation record, aliases, and source provenance.</p>}</div>
    {dataset && <details><summary>Mountain source & limitations</summary><Evidence metadata={dataset.metadata} /></details>}
  </section>;
}
