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
import { digits, useCopy, useLanguage, type Lang } from '../../lib/i18n';
import type { Resource } from '../../lib/resource';
import {
  loadSimulationBasis,
  runBrowserSimulation,
  simulationSpatial,
  type BrowserSimulationRun,
  type SimulationBasis,
} from '../../lib/simulation-ui';
import { ASSUMPTIONS_NE, COMPARISON_ROWS_NE, PARAMETERS_NE, SIMUI, validationNe } from './copy';

type RunState =
  | { status: 'idle' }
  | { status: 'running' }
  | { status: 'ready'; data: BrowserSimulationRun }
  | { status: 'error'; message: string };


function numberInput(value: string) {
  return value.trim() === '' ? Number.NaN : Number(value);
}

function format(value: number | null, maximumFractionDigits = 3, lang: Lang = 'en') {
  return value === null ? SIMUI[lang].unknown : digits(value.toLocaleString('en-US', { maximumFractionDigits }), lang);
}

function coverage(run: BrowserSimulationRun, lang: Lang) {
  if (lang === 'ne') return run.status === 'partial_coverage'
    ? `आंशिक (PARTIAL) — स्रोत सञ्जालको कभरेज उपलब्ध नभएको HYRIV ${run.next_reach_id} भन्दा अघि नै सकिन्छ`
    : 'स्रोत सञ्जालको निकाससम्म पूर्ण';
  return run.status === 'partial_coverage'
    ? `PARTIAL — source network coverage stops before unavailable HYRIV ${run.next_reach_id}`
    : 'Complete to source-network outlet';
}

const statement = (item: { id: string; statement: string }, lang: Lang) => lang === 'ne' ? ASSUMPTIONS_NE[item.id] ?? item.statement : item.statement;

function assumptions(level: SimulationUiLevel, lang: Lang) {
  return <div className="simulation-assumptions">
    <h3>{SIMUI[lang].assumptionsTitle}</h3>
    {simulationAssumptions(level).map(item => <p key={item.id}><strong>{item.id}@{item.version}</strong>: {statement(item, lang)}</p>)}
  </div>;
}

function scientificDetails(run: BrowserSimulationRun, lang: Lang) {
  const c = SIMUI[lang];
  return <details className="simulation-details">
    <summary>{c.scientificDetailsProvenanceLimitations}</summary>
    <dl>
      <dt>{c.evidenceType}</dt><dd>{c.modelled}</dd>
      <dt>{c.simulationLevel}</dt><dd>{c.level} {digits(String(run.simulation_level), lang)}</dd>
      <dt>{c.modelVersion}</dt><dd>{run.model.id}@{run.model.version}</dd>
      <dt>{c.modelClass}</dt><dd>{run.model_class.replaceAll('_', ' ')}</dd>
      <dt>{c.processingBasis}</dt><dd>{run.calculation_basis}</dd>
      <dt>{c.sourceReach}</dt><dd>HYRIV {run.source_reach_id}</dd>
      <dt>{c.pathBasisFingerprint}</dt><dd><code>{run.basis_run_sha256}</code></dd>
      <dt>{c.interactiveRunFingerprint}</dt><dd><code>{run.run_sha256}</code></dd>
      <dt>{c.validation}</dt><dd>{c.syntheticAnalyticalCasesOnly}</dd>
      <dt>{c.confidenceInterval}</dt><dd>{c.unknownNotAvailable}</dd>
    </dl>
    <h3>{c.inputDatasets}</h3>
    {run.input_datasets.map(input => <p key={`${input.dataset_id}@${input.dataset_version}`}>
      <strong>{input.dataset_id}@{input.dataset_version}</strong> · {c.processing} {input.processing_version} · {c.sourceDate} {input.observation_date ?? c.unknown}<br />
      {input.source} · {input.license}<br />SHA-256: <code>{input.sha256}</code>
    </p>)}
    <h3>{c.versionedAssumptions}</h3>
    {run.assumptions.map(item => <p key={item.id}><strong>{item.id}@{item.version}</strong>: {statement(item, lang)}</p>)}
    <h3>{c.limitations}</h3>
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
  const resultRef = useRef<HTMLDivElement>(null);
  const basis = enabled && 'data' in basisResource ? basisResource.data : null;
  const [lang] = useLanguage();
  const c = useCopy(SIMUI);
  const n = (text: string) => digits(text, lang);
  // Contract messages are produced in English; Nepali is looked up for display only.
  const message = (text: string) => lang === 'ne' ? validationNe(text, n) : text;

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
      if (runSequence.current === token) {
        setRunState({ status: 'ready', data });
        requestAnimationFrame(() => resultRef.current?.focus());
      }
    } catch (error) {
      if (runSequence.current === token) setRunState({ status: 'error', message: error instanceof Error ? error.message : 'Simulation failed.' });
    }
  }

  function setPresentation(next: boolean) {
    setPerspective(next);
    if (map) map.easeTo({ pitch: next ? 55 : 0, duration: 0 });
  }

  return <section id="simulation-ui" className="thematic-controls simulation-ui" aria-label={c.simulationUi} data-simulation-state={!enabled ? 'idle' : basisResource.status}>
    <h2>{c.simulationUi}</h2>
    <div className="simulation-warning"><strong>{c.modelledLabel('MODELLED SCENARIO — NOT AN OFFICIAL FORECAST')}</strong><span>{c.researchEducationalNetworkApproximation}</span></div>
    <p>{c.changeTransparentLevel1}</p>
    <label><input type="checkbox" checked={enabled} onChange={event => {
      const next = event.target.checked;
      setEnabled(next);
      if (next) setBasisResource({ status: 'loading' });
      else {
        clearResult();
        setComparisonA(null);
        if (perspective) setPresentation(false);
      }
    }} /> {c.openSimulationWorkbench}</label>

    {enabled && <>
      <DataState state={basisResource} retry={() => { setBasisResource({ status: 'loading' }); setAttempt(value => value + 1); }} />
      {basis && <>
        <fieldset className="simulation-levels">
          <legend>{c.n1SelectSimulationLevel}</legend>
          <label><input type="radio" name="simulation-level" checked={level === 1} onChange={() => { setLevel(1); clearResult(); }} /> <span><strong>{c.level1SourceNetwork}</strong><small>{c.terrainNetworkCapabilityOnly}</small></span></label>
          <label><input type="radio" name="simulation-level" checked={level === 2} onChange={() => { setLevel(2); clearResult(); }} /> <span><strong>{c.level2ConstantCelerity}</strong><small>{c.parameterizedTranslationApproximationNot}</small></span></label>
          <label className="simulation-unavailable"><input type="radio" name="simulation-level" disabled /> <span><strong>{c.level3PhysicalModels}</strong><small>{c.noValidatedHydraulicBreach}</small></span></label>
        </fieldset>

        <section className="simulation-before-run">
          <h3>{c.verifiedBasisBeforeExecution}</h3>
          <dl>
            <dt>{c.selectedLevel}</dt><dd>{c.level} {n(String(level))}</dd>
            <dt>{c.modelVersion}</dt><dd>{controls.model}@1.0.0</dd>
            <dt>{c.sourcePathway}</dt><dd>{lang === 'ne'
              ? `HYRIV ${basis.network.result.definition.source_reach_id} · राखिएका ${n(String(basis.network.result.path.length))} खण्ड · ${n(basis.network.result.total_length_km.toFixed(3))} km`
              : <>HYRIV {basis.network.result.definition.source_reach_id} · {basis.network.result.path.length} retained reaches · {basis.network.result.total_length_km.toFixed(3)} km</>}</dd>
            <dt>{c.coverage}</dt><dd>{basis.network.result.status === 'partial_coverage' ? c.partial(String(basis.network.result.next_reach_id)) : c.sourceNetworkOutlet}</dd>
            <dt>{c.dataVersions}</dt><dd>{basis.network.result.definition.inputs.map(input => `${input.dataset_id}@${input.dataset_version}`).join(' + ')}</dd>
          </dl>
        </section>

        {level === 2 && <fieldset className="simulation-parameters">
          <legend>{c.n2SetLevel2}</legend>
          {SIMULATION_PARAMETER_SPECS.map(spec => {
            const value = spec.key === 'celerity' ? celerity : spec.key === 'release_volume' ? volume : duration;
            const error = validation.errors[spec.key];
            const label = lang === 'ne' ? PARAMETERS_NE[spec.key].label : spec.label;
            return <label key={spec.key}>
              <span><strong>{label}</strong> ({spec.unit})</span>
              <input
                aria-label={`${label} (${spec.unit})`}
                aria-invalid={Boolean(error)}
                aria-describedby={`${spec.key}-help${error ? ` ${spec.key}-error` : ''}`}
                type="number"
                inputMode="decimal"
                autoComplete="off"
                enterKeyHint="done"
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
              <small id={`${spec.key}-help`}>{lang === 'ne'
                ? `${PARAMETERS_NE[spec.key].explanation} मान्य दायरा (दुवै सीमा समेत): ${n(spec.minimum.toLocaleString('en-US'))}–${n(spec.maximum.toLocaleString('en-US'))} ${spec.unit}।`
                : <>{spec.explanation} Valid inclusive range: {spec.minimum.toLocaleString('en-US')}–{spec.maximum.toLocaleString('en-US')} {spec.unit}.</>}</small>
              {error ? <span className="simulation-error" id={`${spec.key}-error`} role="alert">{message(error)}</span> : null}
            </label>;
          })}
          <p className="muted">{c.theseRangesDemonstrationResource}</p>
        </fieldset>}

        <section className="simulation-before-run">
          <h3>{c.n3ReviewAssumptionsBefore}</h3>
          {assumptions(level, lang)}
        </section>

        <button type="button" className="simulation-run" disabled={!validation.valid || runState.status === 'running'} onClick={() => void runSimulation()}>{runState.status === 'running' ? c.runningSimulation : c.runLevel(n(String(level)))}</button>
        {!validation.valid ? <p className="data-state error">{c.invalidControlsBlockedBefore}</p> : null}
        {runState.status === 'running' ? <p className="data-state" role="status">{c.runningModel(controls.model)}</p> : null}
        {runState.status === 'error' ? <p className="data-state error" role="alert">{message(runState.message)}</p> : null}

        {current && <div ref={resultRef} tabIndex={-1} className="simulation-result" aria-live="polite" aria-label={c.simulationResult}>
          <div className="simulation-warning simulation-result-label"><strong>{c.modelledLabel(current.label)}</strong><span>{c.resultFrom(n(String(current.simulation_level)), `${current.model.id}@${current.model.version}`)}</span></div>
          <h3>{c.whatModelProduced}</h3>
          <dl>
            <dt>{c.evidence}</dt><dd>{c.modelledVisuallyTextuallySeparate}</dd>
            <dt>{c.coverage}</dt><dd>{coverage(current, lang)}</dd>
            <dt>{c.sourcePathway}</dt><dd>{c.pathway(n(String(current.path.length)), n(current.total_length_km.toFixed(3)))}</dd>
            <dt>{c.signalDischarge}</dt><dd>{current.pulse_discharge_m3_s === null ? c.unknownLevel1Has : `${format(current.pulse_discharge_m3_s, 3, lang)} m³/s`}</dd>
            <dt>{c.lastRetainedReachExit}</dt><dd>{current.path.at(-1)?.exit_delay_s === null ? c.unknownLevel1Has2 : c.exitDelay(format(current.path.at(-1)?.exit_delay_s ?? null, 1, lang))}</dd>
            <dt>{c.footprintDepthWaterVelocity}</dt><dd>{c.unknownNotCalculatedNetwork}</dd>
            <dt>{c.estimatedExposure}</dt><dd>{c.unavailableNoValidatedPolygon}</dd>
            <dt>{c.uncertainty}</dt><dd>{c.noQuantitativeConfidenceInterval}</dd>
            <dt>{c.qualityCheck}</dt><dd>{current.reference_reproduction === 'matched_published_level_2' ? c.defaultLevel2Parameters : c.customParameterRunValidated}</dd>
          </dl>

          <div className="simulation-map-controls">
            <label><input type="checkbox" checked={visible} disabled={!map} onChange={event => setVisible(event.target.checked)} /> {c.showModelledPathwayMap}</label>
            <button type="button" aria-pressed={perspective} disabled={!map} onClick={() => setPresentation(!perspective)}>{perspective ? c.return2dView : c.use3dPerspective}</button>
          </div>
          <p className="muted">{c.dashedPathwayModelledScenario}</p>

          <section className="simulation-evidence-key" aria-label={c.observedSimulatedDistinction}>
            <h3>{c.evidenceDistinction}</h3>
            <p>{c.sourceDerivedKey}</p>
            <p>{c.modelledKey(n(String(current.simulation_level)), current.simulation_level === 2)}</p>
            <p>{c.unavailableKey}</p>
          </section>

          <div className="simulation-compare-actions">
            <button type="button" onClick={() => setComparisonA(structuredClone(current))}>{c.setCurrentRunComparison}</button>
            {comparisonA ? <button type="button" onClick={() => setComparisonA(null)}>{c.clearComparison}</button> : null}
          </div>
          {comparisonA && <section className="simulation-comparison">
            <h3>{c.compatibleScenarioComparison}</h3>
            {comparison?.compatible ? <table className="compare-table stack-mobile"><caption>{c.comparisonVersusCurrentRun}</caption><thead><tr><th scope="col">{c.metric}</th><th scope="col">A</th><th scope="col">B</th></tr></thead><tbody>
              {comparison.rows.map(row => <tr key={row.label}><th scope="row">{lang === 'ne' ? COMPARISON_ROWS_NE[row.label] ?? row.label : row.label}</th><td>{format(row.a, 3, lang)} {row.unit}</td><td>{format(row.b, 3, lang)} {row.unit}</td></tr>)}
            </tbody></table> : <p className="data-state error">{c.notComparable(comparison?.reason ?? 'Run another scenario to compare with A.')}</p>}
          </section>}

          {scientificDetails(current, lang)}
        </div>}
      </>}
    </>}
  </section>;
}
