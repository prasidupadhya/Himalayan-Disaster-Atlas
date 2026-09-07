'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { Map, MapLayerMouseEvent } from 'maplibre-gl';
import { isStale, type Dataset } from '../../../../packages/contracts';
import { DataState } from '../../components/data-state';
import { Evidence } from '../../components/evidence';
import { INFRASTRUCTURE_MANIFESTS, loadDataset, UnavailableError } from '../../lib/datasets';
import { mountInfrastructureDataset } from '../../lib/map-layers';
import type { Resource } from '../../lib/resource';

type InfrastructureClass = 'road' | 'bridge' | 'school' | 'health' | 'emergency' | 'settlement';
const CLASSES: { value: InfrastructureClass; label: string }[] = [
  { value: 'road', label: 'Major roads' }, { value: 'bridge', label: 'Major bridges' }, { value: 'school', label: 'Schools' },
  { value: 'health', label: 'Health facilities' }, { value: 'emergency', label: 'Emergency facilities' }, { value: 'settlement', label: 'Settlements' },
];

function centerOf(feature: Dataset['collection']['features'][number]): [number, number] | null {
  if (feature.geometry.type === 'Point') return feature.geometry.coordinates as [number, number];
  if (feature.geometry.type === 'LineString') return feature.geometry.coordinates[Math.floor(feature.geometry.coordinates.length / 2)] as [number, number];
  if (feature.geometry.type === 'MultiLineString') {
    const line = feature.geometry.coordinates.find(part => part.length > 0);
    return line ? line[Math.floor(line.length / 2)] as [number, number] : null;
  }
  return null;
}

export function Infrastructure({ map }: { map: Map | null }) {
  const [enabled, setEnabled] = useState(false);
  const [resource, setResource] = useState<Resource<Dataset[]>>({ status: 'loading' });
  const [attempt, setAttempt] = useState(0);
  const [visible, setVisible] = useState<Record<InfrastructureClass, boolean>>({ road: true, bridge: true, school: true, health: true, emergency: true, settlement: true });
  const [selected, setSelected] = useState(''); const [query, setQuery] = useState(''); const [klass, setKlass] = useState<InfrastructureClass | ''>('');
  const mounted = useRef<ReturnType<typeof mountInfrastructureDataset>[]>([]);
  const datasets = 'data' in resource ? resource.data : null;

  useEffect(() => {
    if (!map || !enabled) return;
    const controller = new AbortController(); const handles: ReturnType<typeof mountInfrastructureDataset>[] = []; let click: ((event: MapLayerMouseEvent) => void) | null = null;
    void (async () => {
      try {
        const data = await Promise.all(INFRASTRUCTURE_MANIFESTS.map(path => loadDataset(path, controller.signal)));
        if (controller.signal.aborted) return;
        handles.push(...data.map(dataset => mountInfrastructureDataset(map, dataset))); mounted.current = handles;
        handles.forEach(handle => handle.setVisible(visible[handle.klass as InfrastructureClass]));
        click = event => { const id = event.features?.[0]?.id; if (id !== undefined) choose(String(id), data); };
        map.on('click', handles.flatMap(handle => handle.interactiveLayers), click);
        setResource({ status: data.some(dataset => isStale(dataset.metadata)) ? 'stale' : data.every(dataset => dataset.collection.features.length) ? 'ready' : 'empty', data });
      } catch (error) {
        handles.forEach(handle => handle.dispose());
        if (!controller.signal.aborted) setResource({ status: error instanceof UnavailableError ? 'unavailable' : 'error', message: error instanceof Error ? error.message : 'Infrastructure inventory unavailable' });
      }
    })();
    return () => { controller.abort(); if (click && handles.length) map.off('click', handles.flatMap(handle => handle.interactiveLayers), click); handles.forEach(handle => handle.dispose()); mounted.current = []; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, enabled, attempt]);
  useEffect(() => { mounted.current.forEach(handle => handle.setVisible(visible[handle.klass as InfrastructureClass])); }, [visible]);

  const features = useMemo(() => datasets?.flatMap(dataset => dataset.collection.features) ?? [], [datasets]);
  const counts = useMemo(() => Object.fromEntries(CLASSES.map(item => [item.value, features.filter(feature => feature.properties.infrastructure_class === item.value).length])) as Record<InfrastructureClass, number>, [features]);
  const matches = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return features.filter(feature => (!klass || feature.properties.infrastructure_class === klass) && (!needle || feature.properties.search_terms?.some(term => term.toLowerCase().includes(needle)))).slice(0, 200);
  }, [features, klass, query]);
  const feature = features.find(item => String(item.id) === selected);
  const evidence = datasets?.find(dataset => dataset.metadata.dataset_id === feature?.properties.dataset_id)?.metadata ?? datasets?.[0]?.metadata;

  function choose(id: string, data = datasets) {
    setSelected(id); mounted.current.forEach(handle => handle.setSelected(id || null));
    const item = data?.flatMap(dataset => dataset.collection.features).find(candidate => String(candidate.id) === id); const center = item ? centerOf(item) : null;
    if (center && map) map.easeTo({ center, zoom: Math.max(map.getZoom(), item?.properties.infrastructure_class === 'road' ? 8 : 10), duration: 0 });
  }

  return <section className="thematic-controls" aria-label="Infrastructure" data-infrastructure-state={enabled ? resource.status : 'idle'}>
    <h2>Infrastructure</h2><p>OpenStreetMap national infrastructure inventory</p>
    <label><input type="checkbox" checked={enabled} disabled={!map} onChange={event => { setEnabled(event.target.checked); if (event.target.checked) setResource({ status: 'loading' }); }} /> Load infrastructure inventory</label>
    {enabled && <><DataState state={resource} retry={() => { setResource({ status: 'loading' }); setAttempt(value => value + 1); }} />
      {CLASSES.map(item => <label key={item.value}><input type="checkbox" checked={visible[item.value]} disabled={!datasets} onChange={event => setVisible(current => ({ ...current, [item.value]: event.target.checked }))} /> {item.label}{datasets ? ` (${counts[item.value].toLocaleString('en-US')})` : ''}</label>)}
      <p className="muted">Major roads are motorway/trunk/primary classes and links. Major bridges are bridges on motorway through tertiary roads. OSM completeness varies; an absent feature does not prove an asset is absent.</p>
      <label className="thematic-picker">Class<select value={klass} disabled={!datasets} onChange={event => setKlass(event.target.value as InfrastructureClass | '')}><option value="">All infrastructure</option>{CLASSES.map(item => <option key={item.value} value={item.value}>{item.label}</option>)}</select></label>
      <label className="thematic-picker">Search infrastructure<input type="search" value={query} disabled={!datasets} placeholder="name, road ref, OSM way/…, operator…" onChange={event => setQuery(event.target.value)} /></label>
      <label className="thematic-picker">Asset<select value={selected} disabled={!datasets} onChange={event => choose(event.target.value)}><option value="">Select an asset…</option>{matches.map(item => <option key={String(item.id)} value={String(item.id)}>{item.properties.asset_name ?? item.properties.source_id} · {item.properties.infrastructure_class}</option>)}</select></label>
      <div className="selection" aria-live="polite">{feature ? <><p className="eyebrow">OSM {feature.properties.infrastructure_class}</p><h3>{feature.properties.asset_name ?? 'Name UNKNOWN'}</h3><dl>
        <dt>Subtype</dt><dd>{feature.properties.asset_subtype}</dd><dt>OSM ID</dt><dd>{feature.properties.source_id}</dd><dt>Reference</dt><dd>{feature.properties.asset_ref ?? 'UNKNOWN'}</dd><dt>Operator</dt><dd>{feature.properties.operator_name ?? 'UNKNOWN'}</dd><dt>Surface</dt><dd>{feature.properties.surface ?? 'UNKNOWN'}</dd><dt>Position/geometry</dt><dd>{feature.properties.position_basis}</dd><dt>Display simplified</dt><dd>{feature.properties.display_geometry_simplified ? 'yes' : 'no'}</dd><dt>OSM snapshot</dt><dd>{feature.properties.osm_source_timestamp}</dd>
      </dl></> : <p>Select an asset to inspect source identity and mapping attributes. This layer is inventory context, not an exposure, vulnerability, damage, or risk result.</p>}</div>
      {evidence && <details><summary>Infrastructure source & limitations</summary><Evidence metadata={evidence} /></details>}
    </>}
  </section>;
}
