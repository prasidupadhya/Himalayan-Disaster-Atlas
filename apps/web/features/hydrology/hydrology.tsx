'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { Map, MapLayerMouseEvent } from 'maplibre-gl';
import { isStale, type Dataset } from '../../../../packages/contracts';
import { DataState } from '../../components/data-state';
import { Evidence } from '../../components/evidence';
import { HYDROLOGY_MANIFEST, loadDataset, UnavailableError } from '../../lib/datasets';
import { mountHydrologyDataset } from '../../lib/map-layers';
import type { Resource } from '../../lib/resource';

export function Hydrology({ map }: { map: Map | null }) {
  const [resource, setResource] = useState<Resource<Dataset>>({ status: 'loading' });
  const [attempt, setAttempt] = useState(0);
  const [visible, setVisible] = useState(true);
  const [selected, setSelected] = useState('');
  const [query, setQuery] = useState('');
  const mounted = useRef<ReturnType<typeof mountHydrologyDataset> | null>(null);
  const dataset = 'data' in resource ? resource.data : null;

  useEffect(() => {
    if (!map) return;
    const controller = new AbortController();
    let handle: ReturnType<typeof mountHydrologyDataset> | null = null;
    let onClick: ((event: MapLayerMouseEvent) => void) | null = null;
    void (async () => {
      try {
        const data = await loadDataset(HYDROLOGY_MANIFEST, controller.signal);
        if (controller.signal.aborted) return;
        handle = mountHydrologyDataset(map, data); mounted.current = handle; handle.setVisible(visible);
        onClick = event => { const id = event.features?.[0]?.id; if (id !== undefined) choose(String(id), data); };
        map.on('click', handle.interactiveLayers, onClick);
        setResource({ status: isStale(data.metadata) ? 'stale' : data.collection.features.length ? 'ready' : 'empty', data });
      } catch (error) {
        if (!controller.signal.aborted) setResource({ status: error instanceof UnavailableError ? 'unavailable' : 'error', message: error instanceof Error ? error.message : 'Hydrology stations unavailable' });
      }
    })();
    return () => { controller.abort(); if (handle && onClick) map.off('click', handle.interactiveLayers, onClick); handle?.dispose(); mounted.current = null; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, attempt]);
  useEffect(() => { mounted.current?.setVisible(visible); }, [visible]);

  const matches = useMemo(() => {
    if (!dataset) return [];
    const needle = query.trim().toLowerCase();
    const items = needle ? dataset.collection.features.filter(f => f.properties.search_terms?.some(term => term.toLowerCase().includes(needle))) : dataset.collection.features;
    return items.slice().sort((a, b) => (b.properties.observation_time ?? '').localeCompare(a.properties.observation_time ?? '')).slice(0, 150);
  }, [dataset, query]);
  const feature = dataset?.collection.features.find(item => String(item.id) === selected);

  function choose(id: string, data = dataset) {
    setSelected(id); mounted.current?.setSelected(id || null);
    const item = data?.collection.features.find(featureItem => String(featureItem.id) === id);
    if (item?.geometry.type === 'Point' && map) map.easeTo({ center: item.geometry.coordinates as [number, number], zoom: Math.max(map.getZoom(), 9), duration: 0 });
  }

  return <section className="thematic-controls" aria-label="Hydrology" data-hydrology-state={resource.status}>
    <h2>Hydrology</h2><p>BIPAD / DHM river-station snapshot</p>
    {map ? <DataState state={resource} retry={() => { setResource({ status: 'loading' }); setSelected(''); setAttempt(value => value + 1); }} /> : <p className="muted">Hydrology controls require the interactive map.</p>}
    <label><input type="checkbox" checked={visible} disabled={!dataset} onChange={event => setVisible(event.target.checked)} /> Show river stations</label>
    <p className="muted">Station colors reflect only the source-reported gauge status. This cached snapshot is not a live warning service.</p>
    <label className="thematic-picker">Find station<input type="search" value={query} disabled={!dataset} placeholder="Kali Gandaki, Narayani, station ID…" onChange={event => setQuery(event.target.value)} /></label>
    <label className="thematic-picker">River station<select value={selected} disabled={!dataset} onChange={event => choose(event.target.value)}><option value="">Select a station…</option>{matches.map(item => <option key={String(item.id)} value={String(item.id)}>{item.properties.station_name} · {item.properties.water_level_m === null ? 'UNKNOWN' : `${item.properties.water_level_m?.toFixed(2)} m`}</option>)}</select></label>
    <div className="selection" aria-live="polite">{feature ? <><p className="eyebrow">river monitoring station</p><h3>{feature.properties.station_name}</h3><dl>
      <dt>Water level</dt><dd>{feature.properties.water_level_m === null ? 'UNKNOWN' : `${feature.properties.water_level_m?.toLocaleString('en-US')} m`}</dd>
      <dt>Observed</dt><dd>{feature.properties.observation_time ?? 'UNKNOWN'}</dd><dt>Status</dt><dd>{feature.properties.station_status}</dd><dt>Trend</dt><dd>{feature.properties.trend ?? 'UNKNOWN'}</dd>
      <dt>Warning level</dt><dd>{feature.properties.warning_level_m === null ? 'UNKNOWN' : `${feature.properties.warning_level_m} m`}</dd><dt>Danger level</dt><dd>{feature.properties.danger_level_m === null ? 'UNKNOWN' : `${feature.properties.danger_level_m} m`}</dd>
      <dt>Threshold check</dt><dd>{feature.properties.threshold_order_valid ? 'source order plausible' : 'SOURCE INCONSISTENCY — warning exceeds danger'}</dd><dt>Basin</dt><dd>{feature.properties.basin ?? 'UNKNOWN'}</dd>
      <dt>Station ID</dt><dd>{feature.properties.source_id}</dd><dt>Provider</dt><dd>{feature.properties.provider}</dd><dt>Coordinate repair</dt><dd>{feature.properties.coordinate_order_repaired ? 'yes — source pair was reversed for presentation' : 'no'}</dd>
    </dl></> : <p>Select a station to inspect its latest cached observation and source metadata.</p>}</div>
    {dataset && <details><summary>Hydrology source & limitations</summary><Evidence metadata={dataset.metadata} /></details>}
  </section>;
}
