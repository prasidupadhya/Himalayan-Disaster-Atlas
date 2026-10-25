'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { Map, MapLayerMouseEvent } from 'maplibre-gl';
import { isStale, type Dataset } from '../../../../packages/contracts';
import { DataState } from '../../components/data-state';
import { Evidence } from '../../components/evidence';
import { GLACIER_MANIFESTS, loadDataset, UnavailableError } from '../../lib/datasets';
import { mountGlacierDataset } from '../../lib/map-layers';
import type { Resource } from '../../lib/resource';
import { digits, useLanguage, useCopy } from '../../lib/i18n';
import { GLACIERS } from './copy';

export function Glaciers({ map, onReveal }: { map: Map | null; onReveal?: () => void }) {
  const reveal = useRef(onReveal);
  useEffect(() => { reveal.current = onReveal; });
  const [resource, setResource] = useState<Resource<Dataset[]>>({ status: 'loading' });
  const [attempt, setAttempt] = useState(0);
  const [visible, setVisible] = useState(true);
  const [selected, setSelected] = useState('');
  const [query, setQuery] = useState('');
  const mounted = useRef<ReturnType<typeof mountGlacierDataset>[]>([]);
  const datasets = 'data' in resource ? resource.data : null;
  const [lang] = useLanguage();
  const c = useCopy(GLACIERS);
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
          reveal.current?.();
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

  return <section className="thematic-controls glaciers-controls" aria-label={c.glaciers} data-glaciers-state={resource.status}>
    <h2>{c.glaciers}</h2>
    <p>Randolph Glacier Inventory 7.0 · {c.sourceDatedOutlines}</p>
    {map ? <DataState state={resource} retry={() => { setResource({ status: 'loading' }); setSelected(''); setAttempt(value => value + 1); }} /> : <p className="muted">{c.glacierControlsRequireInteractive}</p>}
    <label><input type="checkbox" checked={visible} disabled={!datasets} onChange={event => setVisible(event.target.checked)} /> {c.showGlacierInventory}</label>
    <p className="muted">{c.theseRgiInventoryOutlines}</p>
    <label className="thematic-picker">{c.searchGlaciers}<input type="search" autoComplete="off" autoCapitalize="none" autoCorrect="off" spellCheck={false} enterKeyHint="search" value={query} disabled={!datasets} placeholder="Imja, Barun, RGI ID, GLIMS ID…" onChange={event => setQuery(event.target.value)} /></label>
    <label className="thematic-picker">{c.glacierRecord}<select value={selected} disabled={!datasets} onChange={event => choose(event.target.value)}>
      <option value="">{c.selectGlacier}</option>
      {matches.map(item => <option key={String(item.id)} value={String(item.id)}>{item.properties.glacier_name ?? item.properties.source_id} · {num(item.properties.area_km2, 2)} km²</option>)}
    </select></label>
    <div className="selection" aria-live="polite">{feature ? <>
      <p className="eyebrow">{c.glacierInventoryOutline}</p><h3>{feature.properties.glacier_name ?? c.unnamedGlacier}</h3>
      <dl>
        <dt>RGI ID</dt><dd>{feature.properties.source_id}</dd>
        <dt>GLIMS ID</dt><dd>{feature.properties.glims_id}</dd>
        <dt>{c.name}</dt><dd>{feature.properties.glacier_name ?? c.unknown}</dd>
        <dt>{c.sourceArea}</dt><dd>{num(feature.properties.area_km2, 3)} km²</dd>
        <dt>{c.outlineDate}</dt><dd>{feature.properties.outline_date}</dd>
        <dt>{c.meanElevation}</dt><dd>{num(feature.properties.elevation_mean_m, 0)} m</dd>
        <dt>{c.elevationRange}</dt><dd>{num(feature.properties.elevation_min_m, 0)}–{num(feature.properties.elevation_max_m, 0)} m</dd>
        <dt>{c.demSource}</dt><dd>{feature.properties.dem_source}</dd>
        <dt>{c.inventoryRegion}</dt><dd>{feature.properties.inventory_region}</dd>
        <dt>{c.displayRepair}</dt><dd>{feature.properties.display_geometry_repaired ? c.yesSourceWfsDisplay : c.no}</dd>
        <dt>{c.downstreamTrace}</dt><dd>{c.unknownInventoryDoesNot}<a href="#downstream-trace">{c.traceSeparatelySelectedRiver}</a>{c.text}</dd>
      </dl>
    </> : <p>{c.selectGlacierInspectIts}</p>}</div>
    {evidence && <details><summary>{c.glacierSourceLimitations}</summary><Evidence metadata={evidence} /></details>}
  </section>;
}
