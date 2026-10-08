'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { Map, MapMouseEvent, Marker } from 'maplibre-gl';
import { isStale, type Dataset } from '../../../../packages/contracts';
import { DataState } from '../../components/data-state';
import { Evidence } from '../../components/evidence';
import { loadDataset, RIVER_MANIFESTS, UnavailableError } from '../../lib/datasets';
import { mountRiverDataset } from '../../lib/map-layers';
import { nearestReach } from '../../lib/river-snap';
import type { Resource } from '../../lib/resource';
import { DownstreamTrace } from '../downstream-trace/downstream-trace';

const RIVER_NAMES = '/data/nepal-river-names/1.0.0/manifest.json';
const PICK_RADIUS_PX = 6;
const normalize = (value: string) => value.normalize('NFD').replace(/\p{M}/gu, '').toLocaleLowerCase('en-US');
type Place = { name: string; sourceId: string; lonLat: [number, number]; reachId: string; metres: number };

export function Rivers({ map }: { map: Map | null }) {
  const [resource, setResource] = useState<Resource<Dataset[]>>({ status: 'loading' });
  const [names, setNames] = useState<Dataset | null>(null);
  const [namesFailed, setNamesFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [visible, setVisible] = useState(true);
  const [selected, setSelected] = useState('');
  const [place, setPlace] = useState<Place | null>(null);
  const [query, setQuery] = useState('');
  const mounted = useRef<ReturnType<typeof mountRiverDataset>[]>([]);
  const marker = useRef<Marker | null>(null);
  const datasets = 'data' in resource ? resource.data : null;

  useEffect(() => {
    const controller = new AbortController();
    void loadDataset(RIVER_NAMES, controller.signal)
      .then(data => { if (!controller.signal.aborted) setNames(data); })
      .catch(() => { if (!controller.signal.aborted) setNamesFailed(true); });
    return () => controller.abort();
  }, [attempt]);

  useEffect(() => {
    if (!map) return;
    const controller = new AbortController();
    const handles: ReturnType<typeof mountRiverDataset>[] = [];
    let onClick: ((event: MapMouseEvent) => void) | null = null;
    void (async () => {
      try {
        const data = await Promise.all(RIVER_MANIFESTS.map(path => loadDataset(path, controller.signal)));
        if (controller.signal.aborted) return;
        handles.push(...data.map(dataset => mountRiverDataset(map, dataset)));
        mounted.current = handles;
        handles.forEach(handle => handle.setVisible(visible));
        onClick = event => {
          const layers = handles.flatMap(handle => handle.interactiveLayers);
          const { x, y } = event.point;
          const hit = map.queryRenderedFeatures([[x - PICK_RADIUS_PX, y - PICK_RADIUS_PX], [x + PICK_RADIUS_PX, y + PICK_RADIUS_PX]], { layers })[0];
          if (!hit || hit.id === undefined) return;
          const value = String(hit.id);
          setPlace(null);
          setSelected(value);
          handles.forEach(handle => handle.setSelected(value));
        };
        map.on('click', onClick);
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
      if (onClick) map.off('click', onClick);
      handles.forEach(handle => handle.dispose());
      mounted.current = [];
    };
  // Visibility changes do not reacquire immutable releases.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, attempt]);

  useEffect(() => { mounted.current.forEach(handle => handle.setVisible(visible)); }, [visible]);

  useEffect(() => {
    if (!map || !place) return;
    let cancelled = false;
    void import('maplibre-gl').then(({ Marker }) => {
      if (cancelled) return;
      const label = document.createElement('span');
      label.className = 'river-name-label';
      label.textContent = `${place.name} · named location`;
      marker.current = new Marker({ element: label }).setLngLat(place.lonLat).addTo(map);
    });
    return () => { cancelled = true; marker.current?.remove(); marker.current = null; };
  }, [map, place]);

  const features = useMemo(() => datasets?.flatMap(dataset => dataset.collection.features) ?? [], [datasets]);
  const reachMatches = useMemo(() => {
    const needle = normalize(query.trim());
    const filtered = needle ? features.filter(feature => feature.properties.search_terms?.some(term => normalize(term).includes(needle))) : features;
    return filtered.slice().sort((a, b) => (a.properties.flow_order ?? 99) - (b.properties.flow_order ?? 99) || (b.properties.average_discharge_m3s ?? 0) - (a.properties.average_discharge_m3s ?? 0)).slice(0, 150);
  }, [features, query]);
  const nameMatches = useMemo(() => {
    const needle = normalize(query.trim());
    if (!needle || !names) return [];
    return names.collection.features.filter(item => item.properties.search_terms?.some(term => normalize(term).includes(needle))).slice(0, 40);
  }, [names, query]);
  const feature = features.find(item => String(item.id) === selected);
  const evidence = datasets?.find(dataset => dataset.metadata.dataset_id === feature?.properties.dataset_id)?.metadata ?? datasets?.[0]?.metadata;

  function choose(value: string) {
    if (!value) { setPlace(null); setSelected(''); mounted.current.forEach(handle => handle.setSelected(null)); return; }
    if (value.startsWith('name:')) {
      const named = names?.collection.features.find(item => String(item.id) === value.slice(5));
      if (!named || named.geometry.type !== 'Point' || !datasets) return;
      const [lon, lat] = named.geometry.coordinates as [number, number];
      const hit = nearestReach(features, lon, lat);
      if (!hit) return;
      setPlace({ name: String(named.properties.name), sourceId: String(named.properties.source_id), lonLat: [lon, lat], reachId: hit.id, metres: hit.metres });
      setSelected(hit.id);
      mounted.current.forEach(handle => handle.setSelected(hit.id));
      if (map) map.easeTo({ center: [lon, lat], zoom: Math.max(9, map.getZoom()), duration: 0 });
      return;
    }
    setPlace(null);
    setSelected(value);
    mounted.current.forEach(handle => handle.setSelected(value));
    const item = features.find(featureItem => String(featureItem.id) === value);
    if (!item || !map) return;
    const coordinates = item.geometry.type === 'LineString' ? item.geometry.coordinates[0] : item.geometry.type === 'MultiLineString' ? item.geometry.coordinates[0]?.[0] : null;
    if (coordinates) map.easeTo({ center: coordinates as [number, number], zoom: Math.max(map.getZoom(), 8), duration: 0 });
  }

  const selectValue = place ? `name:${place.sourceId}` : selected;
  return <section className="thematic-controls rivers-controls" aria-label="Rivers" data-rivers-state={resource.status}>
    <h2>Rivers</h2>
    <p>FAO Rivers 2026 / HydroRIVERS · connected reach IDs</p>
    {map ? <DataState state={resource} retry={() => { setResource({ status: 'loading' }); setSelected(''); setPlace(null); setAttempt(value => value + 1); }} /> : <p className="muted">River controls require the interactive map.</p>}
    <label><input type="checkbox" checked={visible} disabled={!datasets} onChange={event => setVisible(event.target.checked)} /> Show river network</label>
    <p className="muted">Primary and mid-order reaches appear first; headwater/minor reaches load from zoom 6.5. Click a river line on the map to select it, then trace downstream.</p>
    <label className="thematic-picker">Find a river or reach<input type="search" value={query} disabled={!datasets} placeholder="Trishuli, Koshi, HYRIV 40669746…" onChange={event => setQuery(event.target.value)} /></label>
    <label className="thematic-picker">River or reach<select value={selectValue} disabled={!datasets} onChange={event => choose(event.target.value)}>
      <option value="">Select a river or reach…</option>
      {feature && !reachMatches.some(item => String(item.id) === selected) && <option value={String(feature.id)}>HYRIV {feature.properties.source_id} (selected on map)</option>}
      <optgroup label="Reaches">
        {reachMatches.map(item => <option key={String(item.id)} value={String(item.id)}>HYRIV {item.properties.source_id} · order {item.properties.flow_order} · {item.properties.average_discharge_m3s?.toLocaleString('en-US')} m³/s</option>)}
      </optgroup>
      {(nameMatches.length > 0 || place) && <optgroup label="Named locations (GeoNames)">
        {place && !nameMatches.some(item => String(item.id) === place.sourceId) && <option value={`name:${place.sourceId}`}>{place.name} · GeoNames {place.sourceId}</option>}
        {nameMatches.map(item => <option key={`name:${item.id}`} value={`name:${item.id}`}>{item.properties.name} · GeoNames {item.properties.source_id}</option>)}
      </optgroup>}
    </select></label>
    {namesFailed && <p className="muted">Named locations are unavailable; reach search still works. <button onClick={() => { setNamesFailed(false); setAttempt(value => value + 1); }}>Retry named locations</button></p>}
    {query.trim() && !reachMatches.length && !nameMatches.length && <p className="muted">No matching reach or named location. This does not mean the river has no name.</p>}
    <p className="muted">The source does not provide river names for these reaches. Reaches are identified by stable HYRIV_ID values; named places come from GeoNames points.</p>
    <div className="selection" aria-live="polite">{feature ? <>
      <p className="eyebrow">river reach</p><h3>HYRIV {feature.properties.source_id}</h3>
      {place && <p role="note"><strong>{place.name}</strong> (GeoNames {place.sourceId}) is {Math.round(place.metres).toLocaleString('en-US')} m from this nearest mapped reach. The match is a candidate for tracing, not a verified identity: the source gives this reach no name, so its river identity is UNKNOWN.</p>}
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
      <p><a href="#downstream-trace">Go to downstream trace</a></p>
    </> : <p>Select a reach to inspect its topology, source measurements and stable downstream linkage.</p>}</div>
    {evidence && <details><summary>River source & limitations</summary><Evidence metadata={evidence} /></details>}
    <DownstreamTrace key={`${selected}-${attempt}`} map={map} datasets={datasets} start={feature?.properties.source_id} />
  </section>;
}
