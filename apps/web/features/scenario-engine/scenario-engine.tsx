'use client';
import { useEffect, useState } from 'react';
import type { Map } from 'maplibre-gl';
import { DataState } from '../../components/data-state';
import { SCENARIO_RELEASES, loadScenario } from '../../lib/scenario';
import { UnavailableError } from '../../lib/datasets';
import type { Resource } from '../../lib/resource';
export function ScenarioEngine({ map }: { map: Map | null }) {
  const [enabled, setEnabled] = useState(false), [selected, setSelected] = useState('scenario-network-40669746'), [attempt, setAttempt] = useState(0), [visible, setVisible] = useState(false);
  const [resource, setResource] = useState<Resource<Awaited<ReturnType<typeof loadScenario>>>>({ status: 'loading' });
  const data = 'data' in resource && resource.data.result.id === selected ? resource.data : null;
  useEffect(() => {
    if (!enabled) return;
    const controller = new AbortController();
    void loadScenario(selected, controller.signal).then(data => { if (!controller.signal.aborted) setResource({ status: 'ready', data }); }).catch(e => { if (!controller.signal.aborted) setResource({ status: e instanceof UnavailableError ? 'unavailable' : 'error', message: e instanceof Error ? e.message : 'Scenario unavailable' }); });
    return () => controller.abort();
  }, [enabled, selected, attempt]);
  useEffect(() => {
    if (!map || !enabled || !visible || !data) return;
    const id = 'scenario-pathway@1.0.0';
    map.addSource(id, { type: 'geojson', data: data.spatial });
    map.addLayer({ id, source: id, type: 'line', paint: { 'line-color': '#ffcb74', 'line-width': 4, 'line-dasharray': [2, 2] } });
    return () => { if (map.getStyle()) { if (map.getLayer(id)) map.removeLayer(id); if (map.getSource(id)) map.removeSource(id); } };
  }, [map, enabled, visible, data]);
  const result = data?.result;
  return <section className="thematic-controls" aria-label="Scenario Engine" data-scenario-state={enabled ? resource.status : 'idle'}><h2>Scenario Engine</h2><p><strong>Hypothetical modelled scenarios — not forecasts.</strong></p><label><input type="checkbox" checked={enabled} onChange={e => setEnabled(e.target.checked)} /> Inspect prepared scenarios</label>
    {enabled && <><label className="thematic-picker">Prepared scenario<select value={selected} onChange={e => { setResource({ status: 'loading' }); setSelected(e.target.value); }}>{SCENARIO_RELEASES.map(m => <option key={m.id} value={m.id}>{m.id.includes('pulse') ? 'Level 2 · assumed pulse translation' : 'Level 1 · source network pathway'}</option>)}</select></label><DataState state={resource} retry={() => { setResource({ status: 'loading' }); setAttempt(v => v + 1); }} />
      {result && <><p>{result.label}</p><dl><dt>Simulation level</dt><dd>{result.simulation_level} · network approximation</dd><dt>Model/version</dt><dd>{result.model.id}@{result.model.version}</dd><dt>Coverage</dt><dd>{result.status === 'partial_coverage' ? `PARTIAL — stops before unavailable HYRIV ${result.next_reach_id}` : 'Source network outlet'}</dd><dt>Source path</dt><dd>{result.path.length} reaches · {result.total_length_km.toFixed(3)} km</dd><dt>Footprint / depth / water velocity</dt><dd>UNKNOWN — not calculated</dd><dt>Validation</dt><dd>Synthetic analytical cases only; no real-event validation</dd></dl>
        <label><input type="checkbox" checked={visible} disabled={!map} onChange={e => setVisible(e.target.checked)} /> Show hypothetical pathway</label><p>Dashed orange line: selected source river geometry, not a hazard footprint. Other map layers keep their own evidence and dates.</p>
        <h3>Recorded parameters</h3>{Object.entries(result.definition.parameters).length ? <dl>{Object.entries(result.definition.parameters).map(([key, p]) => <div key={key}><dt>{key.replaceAll('_', ' ')}</dt><dd>{p.value.toLocaleString('en-US')} {p.unit}</dd></div>)}</dl> : <p>No physical parameters; connectivity only.</p>}
        {result.simulation_level === 2 && <><p>Valid inputs: celerity 0.1–10 m/s; volume 0–10,000,000 m³; duration 60–86,400 s. These are explicit model limits, not Nepal-calibrated ranges.</p><p>Assumed rectangular pulse: {result.pulse_discharge_m3_s?.toFixed(3)} m³/s. Each section carries {result.volume_per_section_m3?.toLocaleString('en-US')} m³ by assumption; do not sum across reaches.</p><p>{result.time_basis}</p><p>Last retained reach: assumed signal exit delay {result.path.at(-1)?.exit_delay_s?.toFixed(1)} s. This is not a predicted arrival time.</p></>}
        <h3>Assumptions</h3>{result.assumptions.map(a => <p key={a.id}><strong>{a.id}@{a.version}</strong>: {a.statement}</p>)}
        <details style={{ overflowWrap: 'anywhere' }}><summary>Inputs, provenance and limitations</summary>{result.definition.inputs.map(i => <p key={i.dataset_id}>{i.dataset_id}@{i.dataset_version} · processing {i.processing_version} · source date {i.observation_date ?? 'UNKNOWN'} · {i.source} · {i.license}<br />SHA-256: <code>{i.sha256}</code></p>)}<p>Calculated {result.calculated_at} · {result.processing_version} · Python {result.runtime.python}</p><p>Run SHA-256: <code>{result.run_sha256}</code></p>{result.limitations.map(l => <p key={l}>{l}</p>)}</details>
        <p><a href={data!.manifest.artifacts.request.path} download>Download reproducible definition</a> · <a href={data!.manifest.artifacts.result.path} download>Full modelled result</a> · <a href={data!.manifest.artifacts.spatial.path} download>Source pathway</a></p><p>New parameters run through the offline engine and publish a new immutable result. Hydraulic, GLOF and blockage models are unavailable without an explicitly validated adapter.</p>
      </>}
    </>}
  </section>;
}
