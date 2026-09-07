'use client';
import { useEffect, useState } from 'react';
import type { Map } from 'maplibre-gl';
import type { ExposureSpatial } from '../../../../packages/contracts/exposure';
import { DataState } from '../../components/data-state';
import { EXPOSURE_MANIFESTS, loadExposure, type ExposureDataset } from '../../lib/exposure';
import { UnavailableError } from '../../lib/datasets';
import type { Resource } from '../../lib/resource';

const LABELS: Record<string, string> = { road: 'Major-road ways', bridge: 'Major bridges', school: 'Schools', health: 'Health facilities', emergency: 'Emergency facilities', settlement: 'Settlement records', hydropower: 'Hydropower plants', building: 'Buildings', dam: 'Dams' };
function number(value: number | null, digits = 0) { return value === null ? 'UNKNOWN' : value.toLocaleString('en-US', { maximumFractionDigits: digits }); }
function frame(map: Map, data: ExposureSpatial) {
  const bounds: [number, number, number, number] = [180, 90, -180, -90];
  function walk(value: unknown) {
    const a = value as number[];
    if (typeof a[0] === 'number') {
      bounds[0] = Math.min(bounds[0], a[0]); bounds[1] = Math.min(bounds[1], a[1]);
      bounds[2] = Math.max(bounds[2], a[0]); bounds[3] = Math.max(bounds[3], a[1]);
    } else (value as unknown[]).forEach(walk);
  }
  const footprint = data.features.find(feature => feature.properties.kind === 'footprint');
  if (footprint?.geometry && footprint.geometry.type !== 'GeometryCollection') walk(footprint.geometry.coordinates);
  if (bounds[0] <= bounds[2]) map.fitBounds(bounds, { padding: 65, maxZoom: 10, pitch: 0, bearing: 0, duration: 0 });
}

export function ExposureEngine({ map }: { map: Map | null }) {
  const [selection, setSelection] = useState('');
  return <section id="exposure-engine" className="thematic-controls exposure-controls" aria-label="Exposure engine">
    <h2>Exposure engine</h2>
    <p>Inspect estimates of population and mapped infrastructure potentially intersecting an explicit footprint.</p>
    <p className="muted">These prepared scenarios use hypothetical corridors along the trace beginning at HYRIV 40669746. Corridor widths are assumptions, not flood predictions. Exposure does not measure vulnerability, risk or confirmed damage.</p>
    <label className="thematic-picker">Exposure scenario<select value={selection} onChange={event => setSelection(event.target.value)}>
      <option value="">Choose a prepared scenario…</option>
      {EXPOSURE_MANIFESTS.map(item => <option key={item.path} value={item.path}>{item.label}</option>)}
    </select></label>
    {selection && <ExposureSession key={selection} map={map} path={selection} />}
    <p className="muted">Calculations use the native population grid offline. The viewer loads validated results; it does not calculate from population map colors.</p>
    <a href="/methodology/#exposure-method">Input requirements, weighting and limitations</a>
  </section>;
}

function ExposureSession({ map, path }: { map: Map | null; path: string }) {
  const [resource, setResource] = useState<Resource<ExposureDataset>>({ status: 'loading' });
  const [attempt, setAttempt] = useState(0);
  const [visible, setVisible] = useState(true);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(0);
  const [mapPainted, setMapPainted] = useState(false);
  const dataset = 'data' in resource ? resource.data : null;
  useEffect(() => {
    const controller = new AbortController();
    loadExposure(path, controller.signal).then(data => { if (!controller.signal.aborted) setResource({ status: 'ready', data }); }).catch(error => {
      if (!controller.signal.aborted) setResource({ status: error instanceof UnavailableError ? 'unavailable' : 'error', message: error instanceof Error ? error.message : 'Exposure result unavailable' });
    });
    return () => controller.abort();
  }, [path, attempt]);

  useEffect(() => {
    if (!map || !dataset) return;
    let removed = false;
    const onRemove = () => { removed = true; };
    const source = `${dataset.result.result_id}@${dataset.result.version}`;
    const layers = [`${source}-area`, `${source}-edge`, `${source}-lines`, `${source}-points`];
    map.on('remove', onRemove);
    map.addSource(source, { type: 'geojson', data: dataset.spatial, attribution: 'Exposure estimates: WorldPop · OSM contributors (ODbL) · COD-AB v02' });
    map.addLayer({ id: layers[0], source, type: 'fill', filter: ['==', ['get', 'kind'], 'footprint'], paint: { 'fill-color': '#edb45b', 'fill-opacity': 0.22 } });
    map.addLayer({ id: layers[1], source, type: 'line', filter: ['==', ['get', 'kind'], 'footprint'], paint: { 'line-color': '#ffcd78', 'line-width': 2, 'line-dasharray': [3, 2] } });
    map.addLayer({ id: layers[2], source, type: 'line', filter: ['==', ['get', 'kind'], 'asset'], paint: { 'line-color': '#ee78d3', 'line-width': 3 } });
    map.addLayer({ id: layers[3], source, type: 'circle', filter: ['==', ['get', 'kind'], 'asset'], paint: { 'circle-color': '#ee78d3', 'circle-radius': 4, 'circle-stroke-width': 1, 'circle-stroke-color': '#10212b' } });
    for (const id of layers) map.setLayoutProperty(id, 'visibility', visible ? 'visible' : 'none');
    const onIdle = () => {
      if (removed || !map.getSource(source)) return;
      // Other independent inventories may finish loading after this result.
      // Keep the analysis overlay legible without changing their visibility state.
      const top = map.getStyle().layers.slice(-layers.length).map(layer => layer.id);
      if (top.some((id, index) => id !== layers[index])) {
        for (const id of layers) map.moveLayer(id);
        return;
      }
      if (map.isSourceLoaded(source)) setMapPainted(true);
    };
    map.on('idle', onIdle);
    return () => {
      if (removed) return;
      map.off('idle', onIdle);
      for (const id of [...layers].reverse()) if (map.getLayer(id)) map.removeLayer(id);
      if (map.getSource(source)) map.removeSource(source);
      map.off('remove', onRemove);
    };
  }, [map, dataset, visible]);

  const result = dataset?.result;
  const assets = result?.assets.filter(asset => `${asset.id} ${asset.name ?? ''} ${asset.categories.join(' ')}`.toLowerCase().includes(query.toLowerCase())) ?? [];
  return <div data-exposure-state={resource.status} data-exposure-map-ready={mapPainted}>
    <DataState state={resource} retry={() => { setResource({ status: 'loading' }); setAttempt(value => value + 1); }} />
    {dataset && result && <>
      <p className="eyebrow">ESTIMATED · {result.footprint_kind.replaceAll('_', ' ')}</p>
      <h3>{result.name}</h3>
      <label><input type="checkbox" checked={visible} onChange={event => setVisible(event.target.checked)} disabled={!map} /> Show exposure footprint and matched assets</label>
      <button disabled={!map} onClick={() => frame(map!, dataset.spatial)}>Fit exposure footprint</button>
      <p className="muted">Dashed amber outline: assumed footprint. Pink: intersecting mapped asset geometry. No hazard severity is encoded.</p>
      <div className="selection" aria-live="polite"><h4>Estimated population potentially intersecting the modelled scenario.</h4>
        <dl><dt>Within valid population cells</dt><dd>{number(result.population.known_population)} people (partial subtotal)</dd>
          <dt>Whole footprint estimate</dt><dd>{number(result.population.total_population)}{result.population.total_population !== null ? ' people' : ' — NoData or uncovered area remains'}</dd>
          <dt>Footprint area</dt><dd>{number(result.footprint_area_km2, 2)} km²</dd>
          <dt>Area with valid population cells</dt><dd>{number(result.population.valid_area_km2, 2)} km²</dd>
          <dt>Population coverage unknown</dt><dd>{number(result.population.unknown_area_km2, 2)} km²</dd>
          <dt>Unique mapped assets intersecting</dt><dd>{number(result.unique_assets)}</dd></dl>
        <p className="muted">Partial cells are weighted by intersected equal-area fraction. Population is modelled at approximately 100 m, with no local confidence interval supplied. Displayed people are rounded; downloads retain numerical precision for reproducibility.</p>
      </div>
      <h4>Potentially exposed mapped infrastructure</h4>
      <dl>{result.categories.map(item => <div key={item.category}><dt>{LABELS[item.category] ?? item.category}</dt><dd>{number(item.count)}{item.coverage === 'not_available' ? ' — inventory unavailable' : ' mapped records'}</dd></div>)}</dl>
      <p className="muted">Category counts may overlap. Zero means no matches in these inventories; it does not establish the absence of assets. Facilities may be represented by centres, and roads by simplified geometry.</p>
      <details><summary>Administrative summaries ({result.administration.length})</summary>
        <ul>{result.administration.map(item => <li key={item.pcode ?? 'unassigned'}><strong>{item.name}</strong> · {item.pcode ?? 'UNKNOWN'}<br />{number(item.area_km2, 2)} km² · {number(item.population.known_population)} people in valid cells · {item.unique_assets} unique mapped assets<br />Population-unknown area: {number(item.population.unknown_area_km2, 2)} km²</li>)}</ul>
        <p>Each asset is assigned to one district by greatest intersected area/length, then lowest P-code. Unassigned coverage is retained. Area pieces are disjoint; do not add independently overlapping footprints.</p>
      </details>
      <details><summary>Inspect matched assets ({result.unique_assets})</summary>
        <label>Find exposed inventory record<input type="search" value={query} onChange={event => { setQuery(event.target.value); setPage(0); }} /></label>
        <p>{assets.length} matching records</p>
        <ul>{assets.slice(page * 40, (page + 1) * 40).map(asset => <li key={asset.id}><strong>{asset.name ?? 'Name UNKNOWN'}</strong><br />{asset.id} · {asset.categories.map(c => LABELS[c]).join(', ')}<br />District: {asset.admin_pcode ?? 'UNASSIGNED'} · {asset.position_basis}</li>)}</ul>
        <div className="trace-actions"><button disabled={page === 0} onClick={() => setPage(value => value - 1)}>Previous assets</button><button disabled={(page + 1) * 40 >= assets.length} onClick={() => setPage(value => value + 1)}>Next assets</button></div>
      </details>
      <details><summary>Exposure provenance & uncertainty</summary>
        <p>{result.method} · calculated {result.calculated_at} · native geometry {result.input_crs} · equal-area weighting {result.area_crs}</p>
        <p className="trace-hash">Run SHA-256: {result.run_sha256}</p>
        <ul>{result.inputs.map(input => <li key={input.dataset_id}><a href={`/data/${input.dataset_id}/${input.dataset_version}/manifest.json`}>{input.dataset_id} / {input.dataset_version}</a><br />{input.source} · {input.license}<br /><span className="trace-hash">SHA-256: {input.sha256}</span></li>)}</ul>
        <ul>{result.limitations.map(item => <li key={item}>{item}</li>)}</ul>
      </details>
      <div className="trace-actions"><a href={path} download>Download result JSON</a><a href={result.artifacts.request.path} download>Download footprint request</a><a href={result.artifacts.spatial.path} download>Download spatial result</a></div>
    </>}
  </div>;
}
