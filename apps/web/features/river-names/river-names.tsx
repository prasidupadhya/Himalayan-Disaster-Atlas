'use client';
import { useEffect, useMemo, useState } from 'react';
import type { Map, Marker } from 'maplibre-gl';
import type { Dataset } from '../../../../packages/contracts';
import { loadDataset } from '../../lib/datasets';
import { Evidence } from '../../components/evidence';
const normalize = (value: string) => value.normalize('NFD').replace(/\p{M}/gu, '').toLocaleLowerCase('en-US');
export function RiverNames({ map }: { map: Map | null }) {
  const [data, setData] = useState<Dataset | null>(null);
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState('');
  useEffect(() => {
    const controller = new AbortController();
    void loadDataset('/data/nepal-river-names/1.0.0/manifest.json', controller.signal).then(setData).catch(error => {
      if (!controller.signal.aborted) setError(error instanceof Error ? error.message : 'River names unavailable');
    });
    return () => controller.abort();
  }, [attempt]);
  const results = useMemo(() => {
    const needle = normalize(query.trim());
    return needle ? data?.collection.features.filter(f => f.properties.search_terms?.some(term => normalize(term).includes(needle))).slice(0, 40) ?? [] : [];
  }, [data, query]);
  const feature = data?.collection.features.find(f => f.id === selected);
  useEffect(() => {
    if (!map || feature?.geometry.type !== 'Point') return;
    let cancelled = false; let marker: Marker | undefined;
    const coordinates = feature.geometry.coordinates as [number, number];
    void import('maplibre-gl').then(({ Marker }) => {
      if (cancelled) return;
      const label = document.createElement('span'); label.className = 'river-name-label';
      label.textContent = `${feature.properties.name} · named location`;
      marker = new Marker({ element: label }).setLngLat(coordinates).addTo(map);
      map.easeTo({ center: coordinates, zoom: Math.max(9, map.getZoom()), duration: 0 });
    });
    return () => { cancelled = true; marker?.remove(); };
  }, [map, feature]);
  return <section className="thematic-controls" aria-label="River names"><h2>Find a named river</h2>
    <p>Search source names and alternate spellings. Select a named location, then select the river line to trace its connections.</p>
    {error ? <p role="alert">{error} <button onClick={() => { setError(''); setAttempt(v => v + 1); }}>Retry river names</button></p> : !data && <p role="status">Loading verified river-name locations…</p>}
    <label className="thematic-picker">River name<input type="search" placeholder="Trishuli, Koshi, Karnali…" value={query} disabled={!data} onChange={e => { setQuery(e.target.value); setSelected(''); }} /></label>
    {query.trim() && <><label className="thematic-picker">Named river location<select value={selected} onChange={e => setSelected(e.target.value)}><option value="">Select a named location…</option>{results.map(f => <option key={f.id} value={String(f.id)}>{f.properties.name} · GeoNames {f.properties.source_id}</option>)}</select></label><p className="muted">{results.length ? `${results.length} matches shown (maximum 40).` : 'No matching name in this gazetteer. This does not mean the river has no name.'}</p></>}
    {feature && <dl><dt>Source name</dt><dd>{feature.properties.name}</dd><dt>Alternate names</dt><dd>{feature.properties.aliases?.join(', ') || 'UNKNOWN'}</dd><dt>Last source edit</dt><dd>{feature.properties.source_modified}</dd><dt>Verified reach identity</dt><dd>UNKNOWN — no HydroRIVERS crosswalk</dd></dl>}
    <p className="muted">GeoNames points are named reference locations, not river lines. A nearby reach must not inherit a name without verification.</p>
    {data && <details><summary>Name source & limitations</summary><Evidence metadata={data.metadata} /></details>}
  </section>;
}
