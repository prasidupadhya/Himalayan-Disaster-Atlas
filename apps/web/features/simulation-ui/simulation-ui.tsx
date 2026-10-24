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
import { digits, useLanguage, type Lang } from '../../lib/i18n';
import type { Resource } from '../../lib/resource';
import {
  loadSimulationBasis,
  runBrowserSimulation,
  simulationSpatial,
  type BrowserSimulationRun,
  type SimulationBasis,
} from '../../lib/simulation-ui';
import { ASSUMPTIONS_NE, COMPARISON_ROWS_NE, PARAMETERS_NE, REASONS_NE, validationNe } from './copy';

type RunState =
  | { status: 'idle' }
  | { status: 'running' }
  | { status: 'ready'; data: BrowserSimulationRun }
  | { status: 'error'; message: string };

const MODELLED_LABEL_NE = 'मोडेल गरिएको परिदृश्य (MODELLED SCENARIO) — आधिकारिक पूर्वानुमान होइन';

function numberInput(value: string) {
  return value.trim() === '' ? Number.NaN : Number(value);
}

function format(value: number | null, maximumFractionDigits = 3, lang: Lang = 'en') {
  return value === null ? (lang === 'ne' ? 'अज्ञात (UNKNOWN)' : 'UNKNOWN') : digits(value.toLocaleString('en-US', { maximumFractionDigits }), lang);
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
    <h3>{lang === 'ne' ? 'यस तहले प्रयोग गर्ने मान्यताहरू' : 'Assumptions used by this level'}</h3>
    {simulationAssumptions(level).map(item => <p key={item.id}><strong>{item.id}@{item.version}</strong>: {statement(item, lang)}</p>)}
  </div>;
}

function scientificDetails(run: BrowserSimulationRun, lang: Lang) {
  const t = (en: string, ne: string) => lang === 'ne' ? ne : en;
  return <details className="simulation-details">
    <summary>{t('Scientific details, provenance and limitations', 'वैज्ञानिक विवरण, स्रोत विवरण र सीमाहरू')}</summary>
    <dl>
      <dt>{t('Evidence type', 'प्रमाणको प्रकार')}</dt><dd>{t('MODELLED', 'मोडेल गरिएको (MODELLED)')}</dd>
      <dt>{t('Simulation level', 'सिमुलेसन तह')}</dt><dd>{t('Level', 'तह')} {digits(String(run.simulation_level), lang)}</dd>
      <dt>{t('Model/version', 'मोडेल/संस्करण')}</dt><dd>{run.model.id}@{run.model.version}</dd>
      <dt>{t('Model class', 'मोडेलको वर्ग')}</dt><dd>{run.model_class.replaceAll('_', ' ')}</dd>
      <dt>{t('Processing basis', 'प्रशोधनको आधार')}</dt><dd>{run.calculation_basis}</dd>
      <dt>{t('Source reach', 'स्रोत खण्ड')}</dt><dd>HYRIV {run.source_reach_id}</dd>
      <dt>{t('Path basis fingerprint', 'मार्ग आधारको फिंगरप्रिन्ट (fingerprint)')}</dt><dd><code>{run.basis_run_sha256}</code></dd>
      <dt>{t('Interactive run fingerprint', 'अन्तरक्रियात्मक रनको फिंगरप्रिन्ट (fingerprint)')}</dt><dd><code>{run.run_sha256}</code></dd>
      <dt>{t('Validation', 'प्रमाणीकरण (validation)')}</dt><dd>{t('Synthetic analytical cases only; no real-event validation', 'कृत्रिम (synthetic) विश्लेषणात्मक केसहरू मात्र; वास्तविक घटनासँग प्रमाणीकरण गरिएको छैन')}</dd>
      <dt>{t('Confidence interval', 'विश्वास अन्तराल (confidence interval)')}</dt><dd>{t('UNKNOWN — not available', 'अज्ञात (UNKNOWN) — उपलब्ध छैन')}</dd>
    </dl>
    <h3>{t('Input datasets', 'इनपुट डेटासेटहरू')}</h3>
    {run.input_datasets.map(input => <p key={`${input.dataset_id}@${input.dataset_version}`}>
      <strong>{input.dataset_id}@{input.dataset_version}</strong> · {t('processing', 'प्रशोधन')} {input.processing_version} · {t('source date', 'स्रोत मिति')} {input.observation_date ?? t('UNKNOWN', 'अज्ञात (UNKNOWN)')}<br />
      {input.source} · {input.license}<br />SHA-256: <code>{input.sha256}</code>
    </p>)}
    <h3>{t('Versioned assumptions', 'संस्करण गरिएका मान्यताहरू')}</h3>
    {run.assumptions.map(item => <p key={item.id}><strong>{item.id}@{item.version}</strong>: {statement(item, lang)}</p>)}
    <h3>{t('Limitations', 'सीमाहरू')}</h3>
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
  const t = (en: string, ne: string) => lang === 'ne' ? ne : en;
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

  return <section id="simulation-ui" className="thematic-controls simulation-ui" aria-label={t('Simulation UI', 'सिमुलेसन कार्यस्थल')} data-simulation-state={!enabled ? 'idle' : basisResource.status}>
    <h2>{t('Simulation UI', 'सिमुलेसन कार्यस्थल')}</h2>
    <div className="simulation-warning"><strong>{t('MODELLED SCENARIO — NOT AN OFFICIAL FORECAST', MODELLED_LABEL_NE)}</strong><span>{t('Research/educational network approximation only.', 'अनुसन्धान/शैक्षिक प्रयोजनका लागि नदी सञ्जालमा आधारित अनुमानित गणना मात्र।')}</span></div>
    <p>{t('Change transparent Level 1/2 scenario inputs and run the same bounded network logic validated by the Feature 28 engine. No hydraulic flood model is substituted.', 'तह १/२ का पारदर्शी परिदृश्य इनपुट परिवर्तन गर्नुहोस् र Feature 28 इन्जिनले प्रमाणित गरेको उही सीमित सञ्जाल तर्क चलाउनुहोस्। यसले कुनै हाइड्रोलिक (hydraulic) बाढी मोडेलको स्थान लिँदैन।')}</p>
    <label><input type="checkbox" checked={enabled} onChange={event => {
      const next = event.target.checked;
      setEnabled(next);
      if (next) setBasisResource({ status: 'loading' });
      else {
        clearResult();
        setComparisonA(null);
        if (perspective) setPresentation(false);
      }
    }} /> {t('Open simulation workbench', 'सिमुलेसन कार्यस्थल खोल्नुहोस्')}</label>

    {enabled && <>
      <DataState state={basisResource} retry={() => { setBasisResource({ status: 'loading' }); setAttempt(value => value + 1); }} />
      {basis && <>
        <fieldset className="simulation-levels">
          <legend>{t('1. Select simulation level', '१. सिमुलेसन तह छान्नुहोस्')}</legend>
          <label><input type="radio" name="simulation-level" checked={level === 1} onChange={() => { setLevel(1); clearResult(); }} /> <span><strong>{t('Level 1 — source network pathway', 'तह १ — स्रोत सञ्जालको मार्ग')}</strong><small>{t('Terrain/network capability only; no timing or physical quantity.', 'भूभाग/सञ्जालको क्षमता मात्र; समय वा भौतिक परिमाण छैन।')}</small></span></label>
          <label><input type="radio" name="simulation-level" checked={level === 2} onChange={() => { setLevel(2); clearResult(); }} /> <span><strong>{t('Level 2 — constant-celerity pulse', 'तह २ — स्थिर गतिको पल्स (constant-celerity pulse)')}</strong><small>{t('Parameterized translation approximation; not a hydraulic solver.', 'प्यारामिटरमा आधारित स्थानान्तरणको अनुमान; हाइड्रोलिक (hydraulic) समाधानकर्ता होइन।')}</small></span></label>
          <label className="simulation-unavailable"><input type="radio" name="simulation-level" disabled /> <span><strong>{t('Level 3+ — physical models unavailable', 'तह ३+ — भौतिक मोडेलहरू उपलब्ध छैनन्')}</strong><small>{t('No validated hydraulic, breach, blockage or GLOF adapter is registered.', 'कुनै प्रमाणित हाइड्रोलिक, बाँध फुट्ने (breach), अवरोध (blockage) वा GLOF एडाप्टर दर्ता गरिएको छैन।')}</small></span></label>
        </fieldset>

        <section className="simulation-before-run">
          <h3>{t('Verified basis before execution', 'चलाउनुअघि प्रमाणित आधार')}</h3>
          <dl>
            <dt>{t('Selected level', 'छानिएको तह')}</dt><dd>{t('Level', 'तह')} {n(String(level))}</dd>
            <dt>{t('Model/version', 'मोडेल/संस्करण')}</dt><dd>{controls.model}@1.0.0</dd>
            <dt>{t('Source pathway', 'स्रोत मार्ग')}</dt><dd>{lang === 'ne'
              ? `HYRIV ${basis.network.result.definition.source_reach_id} · राखिएका ${n(String(basis.network.result.path.length))} खण्ड · ${n(basis.network.result.total_length_km.toFixed(3))} km`
              : <>HYRIV {basis.network.result.definition.source_reach_id} · {basis.network.result.path.length} retained reaches · {basis.network.result.total_length_km.toFixed(3)} km</>}</dd>
            <dt>{t('Coverage', 'कभरेज')}</dt><dd>{basis.network.result.status === 'partial_coverage' ? t(`PARTIAL — stops before HYRIV ${basis.network.result.next_reach_id}`, `आंशिक (PARTIAL) — HYRIV ${basis.network.result.next_reach_id} भन्दा अघि सकिन्छ`) : t('Source-network outlet', 'स्रोत सञ्जालको निकास')}</dd>
            <dt>{t('Data versions', 'डेटा संस्करणहरू')}</dt><dd>{basis.network.result.definition.inputs.map(input => `${input.dataset_id}@${input.dataset_version}`).join(' + ')}</dd>
          </dl>
        </section>

        {level === 2 && <fieldset className="simulation-parameters">
          <legend>{t('2. Set Level 2 parameters', '२. तह २ का प्यारामिटर तोक्नुहोस्')}</legend>
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
          <p className="muted">{t('These ranges are demonstration/resource limits, not Nepal-calibrated physical ranges.', 'यी दायराहरू प्रदर्शन/स्रोत-साधनका सीमा हुन्, नेपालका लागि क्यालिब्रेट (calibrate) गरिएका भौतिक दायरा होइनन्।')}</p>
        </fieldset>}

        <section className="simulation-before-run">
          <h3>{t('3. Review assumptions before execution', '३. चलाउनुअघि मान्यताहरू समीक्षा गर्नुहोस्')}</h3>
          {assumptions(level, lang)}
        </section>

        <button type="button" className="simulation-run" disabled={!validation.valid || runState.status === 'running'} onClick={() => void runSimulation()}>{runState.status === 'running' ? t('Running simulation…', 'सिमुलेसन चल्दैछ…') : t(`Run Level ${level} simulation`, `तह ${n(String(level))} सिमुलेसन चलाउनुहोस्`)}</button>
        {!validation.valid ? <p className="data-state error">{t('Invalid controls are blocked before the model runs. Correct the highlighted parameter values.', 'अमान्य इनपुट भएमा मोडेल चल्नुअघि नै रोकिन्छ। देखाइएका प्यारामिटरका मान सच्याउनुहोस्।')}</p> : null}
        {runState.status === 'running' ? <p className="data-state" role="status">{t(`Running deterministic ${controls.model}@1.0.0 over the verified published pathway…`, `प्रमाणित प्रकाशित मार्गमा निर्धारणात्मक (deterministic) ${controls.model}@1.0.0 चलाउँदै…`)}</p> : null}
        {runState.status === 'error' ? <p className="data-state error" role="alert">{message(runState.message)}</p> : null}

        {current && <div ref={resultRef} tabIndex={-1} className="simulation-result" aria-live="polite" aria-label={t('Simulation result', 'सिमुलेसनको नतिजा')}>
          <div className="simulation-warning simulation-result-label"><strong>{lang === 'ne' && current.label === 'MODELLED SCENARIO — NOT AN OFFICIAL FORECAST' ? MODELLED_LABEL_NE : current.label}</strong><span>{lang === 'ne' ? `तह ${n(String(current.simulation_level))} को नतिजा · ${current.model.id}@${current.model.version}` : <>Result from Level {current.simulation_level} · {current.model.id}@{current.model.version}</>}</span></div>
          <h3>{t('What the model produced', 'मोडेलले के निकाल्यो')}</h3>
          <dl>
            <dt>{t('Evidence', 'प्रमाण')}</dt><dd>{t('MODELLED — visually/textually separate from observed and source-derived map layers', 'मोडेल गरिएको (MODELLED) — अवलोकित र स्रोतबाट व्युत्पन्न नक्सा तहहरूभन्दा दृश्य र पाठ दुवैमा छुट्टै')}</dd>
            <dt>{t('Coverage', 'कभरेज')}</dt><dd>{coverage(current, lang)}</dd>
            <dt>{t('Source pathway', 'स्रोत मार्ग')}</dt><dd>{lang === 'ne' ? `${n(String(current.path.length))} खण्ड · ${n(current.total_length_km.toFixed(3))} km` : <>{current.path.length} reaches · {current.total_length_km.toFixed(3)} km</>}</dd>
            <dt>{t('Signal discharge', 'सङ्केत बहाव (discharge)')}</dt><dd>{current.pulse_discharge_m3_s === null ? t('UNKNOWN — Level 1 has no pulse', 'अज्ञात (UNKNOWN) — तह १ मा पल्स हुँदैन') : `${format(current.pulse_discharge_m3_s, 3, lang)} m³/s`}</dd>
            <dt>{t('Last retained reach exit delay', 'राखिएको अन्तिम खण्डबाट निस्कने ढिलाइ')}</dt><dd>{current.path.at(-1)?.exit_delay_s === null ? t('UNKNOWN — Level 1 has no timing', 'अज्ञात (UNKNOWN) — तह १ मा समय हुँदैन') : lang === 'ne' ? `काल्पनिक बहाव सुरु भएदेखि ${format(current.path.at(-1)?.exit_delay_s ?? null, 1, lang)} s` : `${format(current.path.at(-1)?.exit_delay_s ?? null, 1)} s relative to hypothetical release`}</dd>
            <dt>{t('Footprint / depth / water velocity', 'प्रभाव क्षेत्र / गहिराइ / पानीको वेग')}</dt><dd>{t('UNKNOWN — not calculated by this network approximation', 'अज्ञात (UNKNOWN) — यो सञ्जाल अनुमानले गणना गर्दैन')}</dd>
            <dt>{t('Estimated exposure', 'अनुमानित जोखिममा परेका (exposure)')}</dt><dd>{t('UNAVAILABLE — no validated Polygon/MultiPolygon simulation footprint was produced, so the Exposure Engine is not invoked.', 'उपलब्ध छैन (UNAVAILABLE) — कुनै प्रमाणित Polygon/MultiPolygon सिमुलेसन प्रभाव क्षेत्र बनेन, त्यसैले Exposure Engine चलाइएको छैन।')}</dd>
            <dt>{t('Uncertainty', 'अनिश्चितता')}</dt><dd>{t('No quantitative confidence interval; assumptions, omitted processes and partial source coverage define the limitations.', 'कुनै परिमाणात्मक विश्वास अन्तराल छैन; मान्यताहरू, छुटाइएका प्रक्रियाहरू र स्रोतको आंशिक कभरेजले सीमाहरू निर्धारण गर्छन्।')}</dd>
            <dt>{t('Quality check', 'गुणस्तर जाँच')}</dt><dd>{current.reference_reproduction === 'matched_published_level_2' ? t('Default Level 2 parameters reproduce the published Feature 28 reference result.', 'तह २ का पूर्वनिर्धारित प्यारामिटरले प्रकाशित Feature 28 सन्दर्भ नतिजा दोहोर्‍याउँछन्।') : t('Custom parameter run; validated equations and ranges apply, but no separate published reference exists for these values.', 'आफ्नै प्यारामिटरको रन; प्रमाणित समीकरण र दायरा लागू हुन्छन्, तर यी मानका लागि छुट्टै प्रकाशित सन्दर्भ छैन।')}</dd>
          </dl>

          <div className="simulation-map-controls">
            <label><input type="checkbox" checked={visible} disabled={!map} onChange={event => setVisible(event.target.checked)} /> {t('Show modelled pathway on map', 'मोडेल गरिएको मार्ग नक्सामा देखाउनुहोस्')}</label>
            <button type="button" aria-pressed={perspective} disabled={!map} onClick={() => setPresentation(!perspective)}>{perspective ? t('Return to 2D view', '2D दृश्यमा फर्कनुहोस्') : t('Use 3D perspective', '3D परिप्रेक्ष्य प्रयोग गर्नुहोस्')}</button>
          </div>
          <p className="muted">{t('Dashed pathway = MODELLED scenario presentation on source river geometry, not a hazard footprint. 2D and 3D perspective use the exact same simulation output; perspective does not change the model or its numbers.', 'टुक्रे रेखाको मार्ग = स्रोत नदी ज्यामितिमा देखाइएको मोडेल गरिएको (MODELLED) परिदृश्य, प्रकोप प्रभाव क्षेत्र होइन। 2D र 3D परिप्रेक्ष्य दुवैले ठ्याक्कै उही सिमुलेसन नतिजा प्रयोग गर्छन्; परिप्रेक्ष्यले मोडेल वा यसका अङ्क परिवर्तन गर्दैन।')}</p>

          <section className="simulation-evidence-key" aria-label={t('Observed and simulated distinction', 'अवलोकित र सिमुलेट गरिएकाबीचको भिन्नता')}>
            <h3>{t('Evidence distinction', 'प्रमाणको भिन्नता')}</h3>
            <p>{lang === 'ne' ? <><strong>स्रोतबाट व्युत्पन्न (SOURCE-DERIVED):</strong> HydroRIVERS का नक्सांकित खण्ड ज्यामिति र लम्बाइका विशेषता।</> : <><strong>SOURCE-DERIVED:</strong> HydroRIVERS mapped reach geometry and length attributes.</>}</p>
            <p>{lang === 'ne' ? <><strong>मोडेल गरिएको (MODELLED):</strong> तह {n(String(current.simulation_level))} को मार्ग व्याख्या{current.simulation_level === 2 ? ', मानिएको समय र आयताकार सङ्केत बहाव' : ''}।</> : <><strong>MODELLED:</strong> Level {current.simulation_level} pathway interpretation{current.simulation_level === 2 ? ', assumed timing and rectangular signal discharge' : ''}.</>}</p>
            <p>{lang === 'ne' ? <><strong>उपलब्ध छैन (UNAVAILABLE):</strong> यस रनका लागि डुबान क्षेत्र, गहिराइ, हाइड्रोलिक वेग, क्षति र प्रमाणित जोखिममा परेका (exposure)।</> : <><strong>UNAVAILABLE:</strong> inundation footprint, depth, hydraulic velocity, damage and validated exposure for this run.</>}</p>
          </section>

          <div className="simulation-compare-actions">
            <button type="button" onClick={() => setComparisonA(structuredClone(current))}>{t('Set current run as comparison A', 'हालको रनलाई तुलना A बनाउनुहोस्')}</button>
            {comparisonA ? <button type="button" onClick={() => setComparisonA(null)}>{t('Clear comparison A', 'तुलना A हटाउनुहोस्')}</button> : null}
          </div>
          {comparisonA && <section className="simulation-comparison">
            <h3>{t('Compatible scenario comparison', 'मिल्दो परिदृश्यको तुलना')}</h3>
            {comparison?.compatible ? <table className="compare-table stack-mobile"><caption>{t('Comparison A versus current run B — no better/worse ranking', 'तुलना A र हालको रन B — राम्रो/नराम्रो भनी क्रम दिइएको छैन')}</caption><thead><tr><th scope="col">{t('Metric', 'मापक')}</th><th scope="col">A</th><th scope="col">B</th></tr></thead><tbody>
              {comparison.rows.map(row => <tr key={row.label}><th scope="row">{lang === 'ne' ? COMPARISON_ROWS_NE[row.label] ?? row.label : row.label}</th><td>{format(row.a, 3, lang)} {row.unit}</td><td>{format(row.b, 3, lang)} {row.unit}</td></tr>)}
            </tbody></table> : <p className="data-state error">{lang === 'ne' ? <>तुलना गर्न मिल्दैन (NOT COMPARABLE) — {(() => { const reason = comparison?.reason ?? 'Run another scenario to compare with A.'; return REASONS_NE[reason] ?? reason; })()}</> : <>NOT COMPARABLE — {comparison?.reason ?? 'Run another scenario to compare with A.'}</>}</p>}
          </section>}

          {scientificDetails(current, lang)}
        </div>}
      </>}
    </>}
  </section>;
}
