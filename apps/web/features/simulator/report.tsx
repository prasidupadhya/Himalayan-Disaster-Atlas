'use client';
import { useEffect, useState } from 'react';
import { LIVE_AUTHORITIES } from '../../../../packages/contracts/live';
import { parseCorridorCatalogue, parsePopulationGrid, type CorridorCatalogue, type ModelRelease } from '../../../../packages/contracts/model-release';
import { ADMIN_MANIFESTS, loadDataset } from '../../lib/datasets';
import { computeShaking, PGA_BANDS, validateScenario, type GmpeModel, type QuakeScenario, type ShakingResult } from '../../lib/earthquake';
import { arrivals, decodeScenario, exposureRange, formatDuration, hydrograph, hydrographVolume, validateFlood, type FloodScenario, type Scenario } from '../../lib/flood-scenario';
import { loadModelArtifact, loadModelRelease, manifestPath, MODEL_RELEASES } from '../../lib/model-release';
import { originLabel } from './flood-panel';
import { loadAssets } from './quake-panel';

const NOTICE = 'Scenario / educational estimate, not a forecast or warning';
type InputRecord = { id: string; version: string; manifest: string; sha256: string };
type Report = { scenario: Scenario; inputs: InputRecord[]; release: ModelRelease[]; body: FloodBody | QuakeBody };
type FloodBody = { kind: 'flood'; catalogue: CorridorCatalogue; scenario: FloodScenario };
type QuakeBody = { kind: 'earthquake'; result: ShakingResult; scenario: QuakeScenario; model: GmpeModel };

async function manifestHash(key: { id: string; version: string }, signal: AbortSignal): Promise<InputRecord> {
  const response = await fetch(manifestPath(key), { signal, credentials: 'omit', redirect: 'error' });
  if (!response.ok) throw new Error(`Manifest unavailable: ${key.id}`);
  const bytes = new Uint8Array(await response.arrayBuffer());
  const sha = Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', bytes)), b => b.toString(16).padStart(2, '0')).join('');
  return { id: key.id, version: key.version, manifest: manifestPath(key), sha256: sha };
}

async function build(scenario: Scenario, signal: AbortSignal): Promise<Report> {
  if (scenario.kind === 'flood') {
    const release = await loadModelRelease(MODEL_RELEASES.corridors, signal);
    const catalogue = parseCorridorCatalogue(await loadModelArtifact(release, 'catalogue', signal), Number(release.summary.origins));
    const errors = validateFlood(scenario, catalogue);
    if (errors.length) throw new Error(errors.join(' '));
    return { scenario, inputs: [await manifestHash(MODEL_RELEASES.corridors, signal), await manifestHash(MODEL_RELEASES.population, signal)], release: [release], body: { kind: 'flood', catalogue, scenario } };
  }
  const [release, popRelease] = await Promise.all([loadModelRelease(MODEL_RELEASES.gmpe, signal), loadModelRelease(MODEL_RELEASES.population, signal)]);
  const model = await loadModelArtifact<GmpeModel>(release, 'model', signal);
  const errors = validateScenario(model, scenario);
  if (errors.length) throw new Error(errors.join(' '));
  const population = parsePopulationGrid(await loadModelArtifact(popRelease, 'grid', signal), popRelease.summary as never);
  const districts = await loadDataset(ADMIN_MANIFESTS[2], signal);
  const sites = districts.collection.features.filter(f => f.properties.label_longitude != null).map(f => ({ label: String(f.properties.name), longitude: f.properties.label_longitude as number, latitude: f.properties.label_latitude as number }));
  const result = computeShaking(model, scenario, population, await loadAssets(signal), sites);
  return { scenario, inputs: [await manifestHash(MODEL_RELEASES.gmpe, signal), await manifestHash(MODEL_RELEASES.population, signal)], release: [release, popRelease], body: { kind: 'earthquake', result, scenario, model } };
}

export function ScenarioReport() {
  const [scenario] = useState<Scenario | null>(() => { try { const s = new URLSearchParams(window.location.search).get('s'); return s ? decodeScenario(s) : null; } catch { return null; } });
  const [report, setReport] = useState<Report | null>(null);
  const [error, setError] = useState<string | null>(scenario ? null : 'No valid scenario was supplied in the link. Run a scenario in the simulator first.');
  const [generated] = useState(() => new Date().toISOString());
  useEffect(() => {
    if (!scenario) return;
    const controller = new AbortController();
    void build(scenario, controller.signal).then(setReport, reason => { if (!controller.signal.aborted) setError(reason instanceof Error ? reason.message : 'Report unavailable'); });
    return () => controller.abort();
  }, [scenario]);

  const json = () => {
    if (!report) return;
    const body = report.body.kind === 'flood' ? floodJson(report.body) : quakeJson(report.body);
    const data = { notice: NOTICE, generated_at_client_clock: generated, scenario: report.scenario, inputs: report.inputs, limitations: report.release.flatMap(r => r.metadata.limitations),
      unknown: ['inundation depth and extent', 'building damage', 'casualties', 'repair costs', 'hydropower downtime', 'economic loss'], authorities: LIVE_AUTHORITIES, results: body };
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2) + '\n'], { type: 'application/json' })); a.download = `atlas-scenario-report-${report.scenario.kind}.json`; a.click(); URL.revokeObjectURL(a.href);
  };

  return <article className="report-page">
    <header className="report-header">
      <p className="eyebrow">Scenario report</p>
      <h1>{scenario?.kind === 'earthquake' ? 'Educational earthquake shaking scenario' : 'Educational flood / GLOF corridor scenario'}</h1>
      <p className="report-notice"><strong>{NOTICE}.</strong> Official forecasts and warnings: {LIVE_AUTHORITIES.map((a, i) => <span key={a.name}>{i > 0 && ' · '}<a href={a.url}>{a.name}</a> ({a.url})</span>)}.</p>
      <p className="report-meta">Generated {generated} (viewer clock) · Himalayan Disaster Atlas · recomputed from verified static releases</p>
      <div className="report-actions"><button type="button" onClick={() => window.print()} disabled={!report}>Print / save as PDF</button><button type="button" onClick={json} disabled={!report}>Download report JSON</button><a href={scenario ? `/simulate/?s=${new URLSearchParams(window.location.search).get('s')}` : '/simulate/'}>Back to the simulator</a></div>
    </header>
    {error && <p className="sim-problem" role="alert">{error}</p>}
    {!report && !error && <p role="status">Recomputing the scenario from verified inputs…</p>}
    {report && <>
      <section><h2>Inputs and data versions</h2>
        <table><thead><tr><th scope="col">Release</th><th scope="col">Manifest SHA-256</th></tr></thead>
          <tbody>{report.inputs.map(i => <tr key={i.id}><th scope="row"><a href={i.manifest}>{i.id}@{i.version}</a></th><td className="report-hash">{i.sha256}</td></tr>)}</tbody></table>
        <pre className="report-json">{JSON.stringify(report.scenario, null, 2)}</pre>
      </section>
      {report.body.kind === 'flood' ? <FloodReport body={report.body} /> : <QuakeReport body={report.body} />}
      <section><h2>Limitations</h2><ul>{report.release.flatMap(r => r.metadata.limitations).map(l => <li key={l}>{l}</li>)}</ul></section>
      <section><h2>Not estimated (UNKNOWN)</h2><p>Inundation depth and extent, building damage, casualties, repair costs, hydropower downtime and economic loss are UNKNOWN: no reviewed inputs and validation exist. Absence of a value here is not zero.</p></section>
    </>}
  </article>;
}

function floodJson(body: FloodBody) {
  const origin = body.catalogue.origins.find(o => o.id === body.scenario.origin)!;
  const h = hydrograph(body.scenario);
  return { origin: { id: origin.id, label: originLabel(origin), path_length_km: origin.path_length_km, termination: origin.termination }, hydrograph: { ...h, volume_check_m3: hydrographVolume(h.points) },
    checkpoints: origin.checkpoints.map(row => ({ prefix_km: row.prefix_km, arrival_s: arrivals(body.scenario, row.prefix_km), exposure_range: exposureRange(row.by_width, body.catalogue.widths_m) })),
    range_meaning: 'Arrival: declared celerity ensemble. Exposure: corridor half-width sensitivity (not confidence intervals).' };
}
function quakeJson(body: QuakeBody) {
  return { model: { name: body.model.model, doi: body.model.doi, region: body.model.region }, bands: PGA_BANDS.map((b, i) => ({ band: b.label, population_median: body.result.population.central[i], population_minus_1sigma: body.result.population.low[i], population_plus_1sigma: body.result.population.high[i] })),
    population_beyond_domain: body.result.population.beyond, assets: body.result.assets, district_points: body.result.sites };
}

function FloodReport({ body }: { body: FloodBody }) {
  const origin = body.catalogue.origins.find(o => o.id === body.scenario.origin)!;
  const h = hydrograph(body.scenario);
  return <section><h2>Results</h2>
    <p><strong>Release point:</strong> {originLabel(origin)} · path {origin.path_length_km.toFixed(1)} km ({origin.termination.replace('_', ' ')}).</p>
    <p><strong>Hydrograph:</strong> {body.scenario.shape}, {body.scenario.volume_m3.toLocaleString('en-US')} m³ over {formatDuration(body.scenario.duration_s)}, source peak {h.peak_m3_s.toFixed(1)} m³/s (volume check {hydrographVolume(h.points).toLocaleString('en-US')} m³). Translated without attenuation.</p>
    <table><caption>Arrival (declared celerities {body.scenario.celerity_m_s.join('/')} m/s) and potential exposure (corridors {body.catalogue.widths_m.join('/')} m each side)</caption>
      <thead><tr><th scope="col">Distance</th><th scope="col">Front arrival</th><th scope="col">Pulse ends</th><th scope="col">Population (range)</th><th scope="col">Mapped assets (range)</th></tr></thead>
      <tbody>{origin.checkpoints.map(row => { const a = arrivals(body.scenario, row.prefix_km); const r = exposureRange(row.by_width, body.catalogue.widths_m); return <tr key={row.prefix_km}>
        <th scope="row">{row.prefix_km.toFixed(1)} km</th><td>{formatDuration(a.front_s[0])} – {formatDuration(a.front_s[2])}</td><td>{formatDuration(a.end_s[0])} – {formatDuration(a.end_s[2])}</td>
        <td>{r.population.min === null ? 'UNKNOWN' : `${Math.round(r.population.min).toLocaleString('en-US')}–${Math.round(r.population.max!).toLocaleString('en-US')}`}{r.population.partial ? ' (known subtotal; part of the area UNKNOWN)' : ''}</td>
        <td>{r.assets.min}–{r.assets.max}</td></tr>; })}</tbody></table>
  </section>;
}

function QuakeReport({ body }: { body: QuakeBody }) {
  const s = body.scenario;
  return <section><h2>Results</h2>
    <p><strong>Scenario:</strong> M{s.magnitude} {s.mechanism} at {s.longitude.toFixed(3)}°E, {s.latitude.toFixed(3)}°N; {s.rupture.type === 'point' ? 'point source' : `${s.rupture.length_km} km line at ${s.rupture.strike_deg}°`}; uniform V<sub>S30</sub> {s.vs30} m/s. Model {body.model.model} (doi:{body.model.doi}).</p>
    <table><caption>Population by PGA band (median, −1σ, +1σ)</caption><thead><tr><th scope="col">Band</th><th scope="col">Median</th><th scope="col">−1σ</th><th scope="col">+1σ</th></tr></thead>
      <tbody>{PGA_BANDS.map((b, i) => <tr key={b.label}><th scope="row">{b.label}</th><td>{Math.round(body.result.population.central[i]).toLocaleString('en-US')}</td><td>{Math.round(body.result.population.low[i]).toLocaleString('en-US')}</td><td>{Math.round(body.result.population.high[i]).toLocaleString('en-US')}</td></tr>)}</tbody></table>
    <p>Population beyond the 400 km model domain (no band): {Math.round(body.result.population.beyond).toLocaleString('en-US')}.</p>
  </section>;
}
