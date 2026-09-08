'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { Map, Marker } from 'maplibre-gl';
import type { Dataset } from '../../../../packages/contracts';
import { DataState } from '../../components/data-state';
import {
  DISASTER_EVENT_MANIFESTS,
  EARTHQUAKES_MANIFEST,
  FLOODS_MANIFEST,
  GLACIAL_LAKES_MANIFEST,
  GLACIER_MANIFESTS,
  HYDROPOWER_MANIFEST,
  INFRASTRUCTURE_MANIFESTS,
  LANDSLIDES_MANIFEST,
  RIVER_MANIFESTS,
  loadDataset,
} from '../../lib/datasets';
import {
  NEARBY_RULES,
  adminAtPoint,
  candidateFromFeature,
  nearbyCandidates,
  pointInGeometry,
  validLocation,
  type LocationCandidate,
  type LocationCategory,
} from '../../lib/location-explorer';
import { loadPopulation, type PopulationDataset } from '../../lib/population';
import type { Resource } from '../../lib/resource';
import { loadTerrain, sampleTerrain, type TerrainDataset } from '../../lib/terrain';

interface Sources {
  datasets: Dataset[];
  terrain: TerrainDataset | null;
  population: PopulationDataset | null;
  failed: string[];
}

const GROUPS: Array<{ label: string; paths: readonly string[] }> = [
  { label: 'Rivers', paths: RIVER_MANIFESTS },
  { label: 'Glaciers', paths: GLACIER_MANIFESTS },
  { label: 'Glacial lakes', paths: [GLACIAL_LAKES_MANIFEST] },
  { label: 'Hydropower', paths: [HYDROPOWER_MANIFEST] },
  { label: 'Infrastructure', paths: INFRASTRUCTURE_MANIFESTS },
  { label: 'Earthquakes', paths: [EARTHQUAKES_MANIFEST] },
  { label: 'Reported floods', paths: [FLOODS_MANIFEST] },
  { label: 'Reported landslides', paths: [LANDSLIDES_MANIFEST] },
  { label: 'Historical events', paths: DISASTER_EVENT_MANIFESTS },
];

type Nearby = ReturnType<typeof nearbyCandidates>;

function ResultList({ title, items, radius }: { title: string; items: Nearby; radius: number }) {
  return <section className="location-result-group">
    <h3>{title}</h3>
    <p className="muted">Spatial relationship only · within {radius} km · nearest results capped by the documented rule.</p>
    {items.length ? <ul>{items.map(item => <li key={item.key}>
      <details>
        <summary><strong>{item.label}</strong> — {item.distance_km.toFixed(2)} km</summary>
        <dl>
          <dt>Relationship</dt><dd>minimum distance to published geometry</dd>
          <dt>Entity type</dt><dd>{item.context}</dd>
          <dt>Stable source ID</dt><dd>{item.source_id}</dd>
          <dt>Dataset</dt><dd>{item.dataset_id}@{item.dataset_version}</dd>
          <dt>Source date</dt><dd>{item.source_date ?? 'UNKNOWN'}</dd>
        </dl>
        <p><Link href="/sources/">Open source notes</Link>{item.detail_href ? <> · <Link href={item.detail_href}>Open detailed record</Link></> : null}</p>
      </details>
    </li>)}</ul> : <p>UNAVAILABLE — no published feature falls inside this documented proximity threshold. This does not prove the category is absent.</p>}
  </section>;
}

export function LocationExplorer({ map, adminDatasets }: { map: Map | null; adminDatasets: Dataset[] | null }) {
  const [enabled, setEnabled] = useState(false);
  const [resource, setResource] = useState<Resource<Sources>>({ status: 'loading' });
  const [attempt, setAttempt] = useState(0);
  const [point, setPoint] = useState<[number, number] | null>(null);
  const [longitude, setLongitude] = useState('85.324');
  const [latitude, setLatitude] = useState('27.7172');
  const [elevation, setElevation] = useState('Select a location to inspect elevation.');
  const marker = useRef<Marker | null>(null);
  const sources = enabled && 'data' in resource ? resource.data : null;

  useEffect(() => {
    if (!enabled) return;
    const controller = new AbortController();
    void (async () => {
      const settled = await Promise.all(GROUPS.map(async group => {
        try { return { label: group.label, datasets: await Promise.all(group.paths.map(path => loadDataset(path, controller.signal))) }; }
        catch { return { label: group.label, datasets: null }; }
      }));
      const [terrainResult, populationResult] = await Promise.allSettled([loadTerrain(controller.signal), loadPopulation(controller.signal)]);
      if (controller.signal.aborted) return;
      const failed = settled.filter(item => !item.datasets).map(item => item.label);
      if (terrainResult.status === 'rejected') failed.push('Terrain');
      if (populationResult.status === 'rejected') failed.push('Population metadata');
      const data: Sources = {
        datasets: settled.flatMap(item => item.datasets ?? []),
        terrain: terrainResult.status === 'fulfilled' ? terrainResult.value : null,
        population: populationResult.status === 'fulfilled' ? populationResult.value : null,
        failed,
      };
      if (data.datasets.length || data.terrain) setResource({ status: 'ready', data });
      else setResource({ status: 'error', message: 'Location context datasets unavailable' });
    })();
    return () => controller.abort();
  }, [enabled, attempt]);

  useEffect(() => {
    if (!map || !enabled) return;
    const click = (event: { lngLat: { lng: number; lat: number } }) => selectPoint([event.lngLat.lng, event.lngLat.lat]);
    map.on('click', click);
    return () => { map.off('click', click); };
  }, [map, enabled]);

  useEffect(() => {
    if (!map || !enabled || !point) {
      marker.current?.remove();
      marker.current = null;
      return;
    }
    let disposed = false;
    void import('maplibre-gl').then(({ Marker: MapMarker }) => {
      if (disposed) return;
      marker.current?.remove();
      marker.current = new MapMarker({ color: '#b56800' }).setLngLat(point).addTo(map);
    });
    return () => { disposed = true; marker.current?.remove(); marker.current = null; };
  }, [map, enabled, point]);

  useEffect(() => {
    if (!enabled || !sources?.terrain || !point) return;
    const controller = new AbortController();
    void sampleTerrain(sources.terrain, point[0], point[1], controller.signal).then(value => {
      if (!controller.signal.aborted) setElevation(value === null ? 'Elevation: UNKNOWN — outside verified terrain coverage.' : `Elevation: approximately ${Math.round(value).toLocaleString('en-US')} m above EGM2008`);
    }).catch(() => {
      if (!controller.signal.aborted) setElevation('Elevation: UNKNOWN — verified terrain sample unavailable.');
    });
    return () => controller.abort();
  }, [enabled, point, sources?.terrain]);

  useEffect(() => {
    if (!enabled) return;
    const params = new URLSearchParams(window.location.search);
    const lon = Number(params.get('lon'));
    const lat = Number(params.get('lat'));
    if (validLocation(lon, lat)) queueMicrotask(() => selectPoint([lon, lat]));
  }, [enabled]);

  const candidates = useMemo(() => sources?.datasets.flatMap(dataset => dataset.collection.features
    .map(feature => candidateFromFeature(dataset, feature))
    .filter((item): item is LocationCandidate => Boolean(item))) ?? [], [sources]);
  const country = point && adminDatasets?.[0]?.collection.features.find(feature => pointInGeometry(point, feature.geometry));
  const province = point && adminDatasets ? adminAtPoint(point, adminDatasets, 1) : null;
  const district = point && adminDatasets ? adminAtPoint(point, adminDatasets, 2) : null;
  const nearby = (category: LocationCategory) => point ? nearbyCandidates(point, candidates, category) : [];

  function selectPoint(next: [number, number]) {
    if (!validLocation(next[0], next[1])) return;
    setPoint(next);
    setLongitude(next[0].toFixed(5));
    setLatitude(next[1].toFixed(5));
    setElevation('Loading elevation…');
    const params = new URLSearchParams(window.location.search);
    params.set('lon', String(next[0]));
    params.set('lat', String(next[1]));
    window.history.replaceState(null, '', `${window.location.pathname}?${params.toString()}`);
  }

  return <section id="location-explorer" className="thematic-controls" aria-label="Location Explorer" data-location-explorer-state={enabled ? resource.status : 'idle'}>
    <h2>Location explorer</h2>
    <p>Click anywhere in Nepal or enter coordinates for deterministic spatial context.</p>
    <label><input type="checkbox" checked={enabled} disabled={!map || !adminDatasets} onChange={event => {
      setEnabled(event.target.checked);
      if (event.target.checked) setResource({ status: 'loading' });
    }} /> Load location context datasets</label>
    {enabled && <>
      <DataState state={resource} retry={() => { setResource({ status: 'loading' }); setAttempt(value => value + 1); }} />
      {sources?.failed.length ? <p className="data-state error">UNAVAILABLE categories: {sources.failed.join(', ')}. Other verified categories remain inspectable.</p> : null}
      <form className="location-coordinate-form" onSubmit={event => {
        event.preventDefault();
        const lon = Number(longitude);
        const lat = Number(latitude);
        if (validLocation(lon, lat)) selectPoint([lon, lat]);
      }}>
        <label>Longitude<input value={longitude} type="number" step="any" min="80" max="89.5" onChange={event => setLongitude(event.target.value)} /></label>
        <label>Latitude<input value={latitude} type="number" step="any" min="26" max="31" onChange={event => setLatitude(event.target.value)} /></label>
        <button type="submit">Inspect location</button>
      </form>
      {point && !country ? <div className="selection"><h3>Outside supported Nepal boundary</h3><p>The Location Explorer is Nepal-only. No proximity result is interpreted for this coordinate.</p></div> : null}
      {point && country ? <div className="location-context" aria-live="polite">
        <section className="selection">
          <p className="eyebrow">Selected location</p><h3>{point[1].toFixed(5)}, {point[0].toFixed(5)}</h3>
          <dl>
            <dt>Province</dt><dd>{province?.properties.name ?? 'UNKNOWN'}{province ? ` (${province.properties.pcode})` : ''}</dd>
            <dt>District</dt><dd>{district?.properties.name ?? 'UNKNOWN'}{district ? ` (${district.properties.pcode})` : ''}</dd>
            <dt>Terrain</dt><dd>{elevation}</dd>
          </dl>
          <p className="muted">Administrative containment uses COD-AB v02 geometry. Elevation uses verified Copernicus GLO-90 terrain and is independent of map exaggeration.</p>
        </section>
        <ResultList title="Nearest rivers" items={nearby('river')} radius={NEARBY_RULES.river.radius_km} />
        <ResultList title="Nearby glaciers" items={nearby('glacier')} radius={NEARBY_RULES.glacier.radius_km} />
        <ResultList title="Nearby glacial lakes" items={nearby('glacial_lake')} radius={NEARBY_RULES.glacial_lake.radius_km} />
        <ResultList title="Nearby hydropower" items={nearby('hydropower')} radius={NEARBY_RULES.hydropower.radius_km} />
        <ResultList title="Nearby infrastructure" items={nearby('infrastructure')} radius={NEARBY_RULES.infrastructure.radius_km} />
        <ResultList title="Nearby earthquake epicenters" items={nearby('earthquake')} radius={NEARBY_RULES.earthquake.radius_km} />
        <ResultList title="Nearby reported floods" items={nearby('flood')} radius={NEARBY_RULES.flood.radius_km} />
        <ResultList title="Nearby reported landslides" items={nearby('landslide')} radius={NEARBY_RULES.landslide.radius_km} />
        <ResultList title="Nearby historical events" items={nearby('event')} radius={NEARBY_RULES.event.radius_km} />
        <section className="location-result-group">
          <h3>Population</h3>
          {sources?.population ? <p><strong>UNAVAILABLE numeric point lookup.</strong> WorldPop {sources.population.manifest.metadata.observation_date?.slice(0, 4) ?? 'dated source'} is a modelled population surface, but the published browser PNGs are display-only log-scaled intensity and must not be sampled as people counts. Source date: {sources.population.manifest.metadata.observation_date ?? 'UNKNOWN'}.</p> : <p>UNAVAILABLE — population metadata could not be verified.</p>}
        </section>
        <p className="muted"><strong>Different dataset dates are preserved above.</strong> “Nearby” means distance only. It does not mean exposed, affected, connected, causal, dangerous, or at risk.</p>
      </div> : null}
    </>}
  </section>;
}
