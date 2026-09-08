'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { Map } from 'maplibre-gl';
import {
  compareInteractiveSimulations,
  controlsForLevel,
  SIMULATION_PARAMETER_SPECS,
  simulationAssumptions,
  validateSimulationControls,
  type SimulationUiLevel,
} from '../../../../packages/contracts/simulation-ui';
import { DataState } from '../../components/data-state';
import type { Resource } from '../../lib/resource';
import {
  loadSimulationBasis,
  runBrowserSimulation,
  simulationSpatial,
  type BrowserSimulationRun,
  type SimulationBasis,
} from '../../lib/simulation-ui';

type RunState =
  | { status: 'idle' }
  | { status: 'running' }
  | { status: 'ready'; data: BrowserSimulationRun }
  | { status: 'error'; message: string };

function numberInput(value: string) {
  return value.trim() === '' ? Number.NaN : Number(value);
}

function format(value: number | null, maximumFractionDigits = 3) {
  return value === null ? 'UNKNOWN' : value.toLocaleString('en-US', { maximumFractionDigits });
}

function coverage(run: BrowserSimulationRun) {
  return run.status === 'partial_coverage'
    ? `PARTIAL — source network coverage stops before unavailable HYRIV ${run.next_reach_id}`
    : 'Complete to source-network outlet';
}

function assumptions(level: SimulationUiLevel) {
  return <div className="simulation-assumptions">
    <h3>Assumptions used by this level</h3>
    {simulationAssumptions(level).map(item => <p key={item.id}><strong>{item.id}@{item.version}</strong>: {item.statement}</p>)}
  </div>;
}

function scientificDetails(run: BrowserSimulationRun) {
  return <details className="simulation-details">
    <summary>Scientific details, provenance and limitations</summary>
    <dl>
      <dt>Evidence type</dt><dd>MODELLED</dd>
      <dt>Simulation level</dt><dd>Level {run.simulation_level}</dd>
      <dt>Model/version</dt><dd>{run.model.id}@{run.model.version}</dd>
      <dt>Model class</dt><dd>{run.model_class.replaceAll('_', ' ')}</dd>
      <dt>Processing basis</dt><dd>{run.calculation_basis}</dd>
      <dt>Source reach</dt><dd>HYRIV {run.source_reach_id}</dd>
      <dt>Path basis fingerprint</dt><dd><code>{run.basis_run_sha256}</code></dd>
      <dt>Interactive run fingerprint</dt><dd><code>{run.run_sha256}</code></dd>
      <dt>Validation</dt><dd>Synthetic analytical cases only; no real-event validation</dd>
      <dt>Confidence interval</dt><dd>UNKNOWN — not available</dd>
    </dl>
    <h3>Input datasets</h3>
    {run.input_datasets.map(input => <p key={`${input.dataset_id}@${input.dataset_version}`}>
      <strong>{input.dataset_id}@{input.dataset_version}</strong> · processing {input.processing_version} · source date {input.observation_date ?? 'UNKNOWN'}<br />
      {input.source} · {input.license}<br />SHA-256: <code>{input.sha256}</code>
    </p>)}
    <h3>Versioned assumptions</h3>
    {run.assumptions.map(item => <p key={item.id}><strong>{item.id}@{item.version}</strong>: {item.statement}</p>)}
    <h3>Limitations</h3>
    {run.limitations.map(item => <p key={item}>{item}</p>)}
  </details>;
}

export function SimulationUI({ map }: { map: Map | null }) {
  const [enabled, setEnabled] = useState(false);
  const [basisResource, setBasisResource] = useState<Resource<SimulationBasis>>({ status: 'loading' });
  const [attempt, setAttempt] = useState(0);
  const [level, setLevel] = useState<SimulationUiLevel>(1);
  const [celerity, setCelerity] = useState('2');
  const [volume, setVolume] = useState('100000');
  const [duration, setDuration] = useState('3600');
  const [runState, setRunState] = useState<RunState>({ status: 'idle' });
  const [visible, setVisible] = useState(false);
  const [perspective, setPerspective] = useState(false);
  const [comparisonA, setComparisonA] = useState<BrowserSimulationRun | null>(null);
  const runSequence = useRef(0);
  const basis = enabled && 'data' in basisResource ? basisResource.data : null;

  const controls = useMemo(() => controlsForLevel(level, level === 2 ? {
    celerity: numberInput(celerity),
    release_volume: numberInput(volume),
    release_duration: numberInput(duration),
  } : undefined), [level, celerity, volume, duration]);
  const validation = useMemo(() => validateSimulationControls(controls), [controls]);
  const current = runState.status === 'ready' ? runState.data : null;
  const comparison = comparisonA && current ? compareInteractiveSimulations(comparisonA, current) : null;

  useEffect(() => {
    if (!enabled) return;
    const controller = new AbortController();
    void loadSimulationBasis(controller.signal).then(data => {
      if (!controller.signal.aborted) setBasisResource({ status: 'ready', data });
    }).catch(error => {
      if (!controller.signal.aborted) setBasisResource({ status: 'error', message: error instanceof Error ? error.message : 'Simulation basis unavailable.' });
    });
    return () => controller.abort();
  }, [enabled, attempt]);

  useEffect(() => {
    if (!map || !enabled || !visible || !basis || !current) return;
    const sourceId = 'simulation-ui-pathway@1.0.0';
    const layerId = 'simulation-ui-modelled-pathway@1.0.0';
    map.addSource(sourceId, { type: 'geojson', data: simulationSpatial(basis) });
    map.addLayer({
      id: layerId,
      source: sourceId,
      type: 'line',
      paint: { 'line-color': '#ff9f1c', 'line-width': 5, 'line-dasharray': [1.5, 1.5], 'line-opacity': 0.95 },
    });
    return () => {
      if (!map.getStyle()) return;
      if (map.getLayer(layerId)) map.removeLayer(layerId);
      if (map.getSource(sourceId)) map.removeSource(sourceId);
    };
  }, [map, enabled, visible, basis, current]);

  function clearResult() {
    runSequence.current += 1;
    setRunState({ status: 'idle' });
    setVisible(false);
  }

  async function runSimulation() {
    if (!basis) return;
    if (!validation.valid) {
      setRunState({ status: 'error', message: Object.values(validation.errors)[0] ?? 'Invalid simulation parameters.' });
      return;
    }
    const token = ++runSequence.current;
    setRunState({ status: 'running' });
    try {
      const data = await runBrowserSimulation(basis, controls);
      if (runSequence.current === token) setRunState({ status: 'ready', data });
    } catch (error) {
      if (runSequence.current === token) setRunState({ status: 'error', message: error instanceof Error ? error.message : 'Simulation failed.' });
    }
  }

  function setPresentation(next: boolean) {
    setPerspective(next);
    if (map) map.easeTo({ pitch: next ? 55 : 0, duration: 0 });
  }

  return <section id="simulation-ui" className="thematic-controls simulation-ui" aria-label="Simulation UI" data-simulation-state={!enabled ? 'idle' : basisResource.status}>
    <h2>Simulation UI</h2>
    <div className="simulation-warning"><strong>MODELLED SCENARIO — NOT AN OFFICIAL FORECAST</strong><span>Research/educational network approximation only.</span></div>
    <p>Change transparent Level 1/2 scenario inputs and run the same bounded network logic validated by the Feature 28 engine. No hydraulic flood model is substituted.</p>
    <label><input type="checkbox" checked={enabled} onChange={event => {
      const next = event.target.checked;
      setEnabled(next);
      if (next) setBasisResource({ status: 'loading' });
      else {
        clearResult();
        setComparisonA(null);
        if (perspective) setPresentation(false);
      }
    }} /> Open simulation workbench</label>

    {enabled && <>
      <DataState state={basisResource} retry={() => { setBasisResource({ status: 'loading' }); setAttempt(value => value + 1); }} />
      {basis && <>
        <fieldset className="simulation-levels">
          <legend>1. Select simulation level</legend>
          <label><input type="radio" name="simulation-level" checked={level === 1} onChange={() => { setLevel(1); clearResult(); }} /> <span><strong>Level 1 — source network pathway</strong><small>Terrain/network capability only; no timing or physical quantity.</small></span></label>
          <label><input type="radio" name="simulation-level" checked={level === 2} onChange={() => { setLevel(2); clearResult(); }} /> <span><strong>Level 2 — constant-celerity pulse</strong><small>Parameterized translation approximation; not a hydraulic solver.</small></span></label>
          <label className="simulation-unavailable"><input type="radio" name="simulation-level" disabled /> <span><strong>Level 3+ — physical models unavailable</strong><small>No validated hydraulic, breach, blockage or GLOF adapter is registered.</small></span></label>
        </fieldset>

        <section className="simulation-before-run">
          <h3>Verified basis before execution</h3>
          <dl>
            <dt>Selected level</dt><dd>Level {level}</dd>
            <dt>Model/version</dt><dd>{controls.model}@1.0.0</dd>
            <dt>Source pathway</dt><dd>HYRIV {basis.network.result.definition.source_reach_id} · {basis.network.result.path.length} retained reaches · {basis.network.result.total_length_km.toFixed(3)} km</dd>
            <dt>Coverage</dt><dd>{basis.network.result.status === 'partial_coverage' ? `PARTIAL — stops before HYRIV ${basis.network.result.next_reach_id}` : 'Source-network outlet'}</dd>
            <dt>Data versions</dt><dd>{basis.network.result.definition.inputs.map(input => `${input.dataset_id}@${input.dataset_version}`).join(' + ')}</dd>
          </dl>
        </section>

        {level === 2 && <fieldset className="simulation-parameters">
          <legend>2. Set Level 2 parameters</legend>
          {SIMULATION_PARAMETER_SPECS.map(spec => {
            const value = spec.key === 'celerity' ? celerity : spec.key === 'release_volume' ? volume : duration;
            const error = validation.errors[spec.key];
            return <label key={spec.key}>
              <span><strong>{spec.label}</strong> ({spec.unit})</span>
              <input
                aria-label={`${spec.label} (${spec.unit})`}
                aria-invalid={Boolean(error)}
                aria-describedby={`${spec.key}-help${error ? ` ${spec.key}-error` : ''}`}
                type="number"
                min={spec.minimum}
                max={spec.maximum}
                step={spec.step}
                value={value}
                onChange={event => {
                  if (spec.key === 'celerity') setCelerity(event.target.value);
                  else if (spec.key === 'release_volume') setVolume(event.target.value);
                  else setDuration(event.target.value);
                  clearResult();
                }}
              />
              <small id={`${spec.key}-help`}>{spec.explanation} Valid inclusive range: {spec.minimum.toLocaleString('en-US')}–{spec.maximum.toLocaleString('en-US')} {spec.unit}.</small>
              {error ? <span className="simulation-error" id={`${spec.key}-error`} role="alert">{error}</span> : null}
            </label>;
          })}
          <p className="muted">These ranges are demonstration/resource limits, not Nepal-calibrated physical ranges.</p>
        </fieldset>}

        <section className="simulation-before-run">
          <h3>3. Review assumptions before execution</h3>
          {assumptions(level)}
        </section>

        <button type="button" className="simulation-run" disabled={!validation.valid || runState.status === 'running'} onClick={() => void runSimulation()}>{runState.status === 'running' ? 'Running simulation…' : `Run Level ${level} simulation`}</button>
        {!validation.valid ? <p className="data-state error">Invalid controls are blocked before the model runs. Correct the highlighted parameter values.</p> : null}
        {runState.status === 'running' ? <p className="data-state" role="status">Running deterministic {controls.model}@1.0.0 over the verified published pathway…</p> : null}
        {runState.status === 'error' ? <p className="data-state error" role="alert">{runState.message}</p> : null}

        {current && <div className="simulation-result" aria-live="polite">
          <div className="simulation-warning simulation-result-label"><strong>{current.label}</strong><span>Result from Level {current.simulation_level} · {current.model.id}@{current.model.version}</span></div>
          <h3>What the model produced</h3>
          <dl>
            <dt>Evidence</dt><dd>MODELLED — visually/textually separate from observed and source-derived map layers</dd>
            <dt>Coverage</dt><dd>{coverage(current)}</dd>
            <dt>Source pathway</dt><dd>{current.path.length} reaches · {current.total_length_km.toFixed(3)} km</dd>
            <dt>Signal discharge</dt><dd>{current.pulse_discharge_m3_s === null ? 'UNKNOWN — Level 1 has no pulse' : `${format(current.pulse_discharge_m3_s)} m³/s`}</dd>
            <dt>Last retained reach exit delay</dt><dd>{current.path.at(-1)?.exit_delay_s === null ? 'UNKNOWN — Level 1 has no timing' : `${format(current.path.at(-1)?.exit_delay_s ?? null, 1)} s relative to hypothetical release`}</dd>
            <dt>Footprint / depth / water velocity</dt><dd>UNKNOWN — not calculated by this network approximation</dd>
            <dt>Estimated exposure</dt><dd>UNAVAILABLE — no validated Polygon/MultiPolygon simulation footprint was produced, so the Exposure Engine is not invoked.</dd>
            <dt>Uncertainty</dt><dd>No quantitative confidence interval; assumptions, omitted processes and partial source coverage define the limitations.</dd>
            <dt>Quality check</dt><dd>{current.reference_reproduction === 'matched_published_level_2' ? 'Default Level 2 parameters reproduce the published Feature 28 reference result.' : 'Custom parameter run; validated equations and ranges apply, but no separate published reference exists for these values.'}</dd>
          </dl>

          <div className="simulation-map-controls">
            <label><input type="checkbox" checked={visible} disabled={!map} onChange={event => setVisible(event.target.checked)} /> Show modelled pathway on map</label>
            <button type="button" aria-pressed={perspective} disabled={!map} onClick={() => setPresentation(!perspective)}>{perspective ? 'Return to 2D view' : 'Use 3D perspective'}</button>
          </div>
          <p className="muted">Dashed pathway = MODELLED scenario presentation on source river geometry, not a hazard footprint. 2D and 3D perspective use the exact same simulation output; perspective does not change the model or its numbers.</p>

          <section className="simulation-evidence-key" aria-label="Observed and simulated distinction">
            <h3>Evidence distinction</h3>
            <p><strong>SOURCE-DERIVED:</strong> HydroRIVERS mapped reach geometry and length attributes.</p>
            <p><strong>MODELLED:</strong> Level {current.simulation_level} pathway interpretation{current.simulation_level === 2 ? ', assumed timing and rectangular signal discharge' : ''}.</p>
            <p><strong>UNAVAILABLE:</strong> inundation footprint, depth, hydraulic velocity, damage and validated exposure for this run.</p>
          </section>

          <div className="simulation-compare-actions">
            <button type="button" onClick={() => setComparisonA(structuredClone(current))}>Set current run as comparison A</button>
            {comparisonA ? <button type="button" onClick={() => setComparisonA(null)}>Clear comparison A</button> : null}
          </div>
          {comparisonA && <section className="simulation-comparison">
            <h3>Compatible scenario comparison</h3>
            {comparison?.compatible ? <table className="compare-table"><caption>Comparison A versus current run B — no better/worse ranking</caption><thead><tr><th scope="col">Metric</th><th scope="col">A</th><th scope="col">B</th></tr></thead><tbody>
              {comparison.rows.map(row => <tr key={row.label}><th scope="row">{row.label}</th><td>{format(row.a)} {row.unit}</td><td>{format(row.b)} {row.unit}</td></tr>)}
            </tbody></table> : <p className="data-state error">NOT COMPARABLE — {comparison?.reason ?? 'Run another scenario to compare with A.'}</p>}
          </section>}

          {scientificDetails(current)}
        </div>}
      </>}
    </>}
  </section>;
}
