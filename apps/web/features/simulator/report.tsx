'use client';
import { useEffect, useState } from 'react';
import { LIVE_AUTHORITIES } from '../../../../packages/contracts/live';
import { parseCorridorCatalogue, parsePopulationGrid, type CorridorCatalogue, type ModelRelease } from '../../../../packages/contracts/model-release';
import { ADMIN_MANIFESTS, loadDataset } from '../../lib/datasets';
import { computeShaking, PGA_BANDS, validateScenario, type GmpeModel, type QuakeScenario, type ShakingResult } from '../../lib/earthquake';
import { arrivals, decodeScenario, exposureRange, hydrograph, hydrographVolume, validateFlood, type FloodScenario, type Scenario } from '../../lib/flood-scenario';
import { loadModelArtifact, loadModelRelease, manifestPath, MODEL_RELEASES } from '../../lib/model-release';
import { originLabel } from './flood-panel';
import { duration, REPORT } from './copy';
import { formatNumber, LanguageSwitch, UI, useLanguage, type Lang } from '../../lib/i18n';
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
  const [lang, setLang] = useLanguage();
  const r = REPORT[lang];
  const [scenario] = useState<Scenario | null>(() => { try { const s = new URLSearchParams(window.location.search).get('s'); return s ? decodeScenario(s) : null; } catch { return null; } });
  const [report, setReport] = useState<Report | null>(null);
  const [error, setError] = useState<string | null>(null);
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

  return <article className="report-page" lang={lang}>
    <header className="report-header">
      <div className="report-top"><p className="eyebrow">{r.eyebrow}</p><LanguageSwitch lang={lang} onChange={setLang} /></div>
      <h1>{scenario?.kind === 'earthquake' ? r.quakeTitle : r.floodTitle}</h1>
      <p className="report-notice"><strong>{UI[lang].scenarioNotice}.</strong> {r.official} {LIVE_AUTHORITIES.map((a, i) => <span key={a.name}>{i > 0 && ' · '}<a href={a.url}>{a.name}</a> ({a.url})</span>)}.</p>
      <p className="report-meta">{r.generated(generated)}</p>
      <div className="report-actions"><button type="button" onClick={() => window.print()} disabled={!report}>{r.print}</button><button type="button" onClick={json} disabled={!report}>{r.json}</button><a href={scenario ? `/simulate/?s=${new URLSearchParams(window.location.search).get('s')}` : '/simulate/'}>{r.back}</a></div>
    </header>
    {(error || !scenario) && <p className="sim-problem" role="alert">{error ?? r.invalid}</p>}
    {!report && !error && scenario && <p role="status">{r.recomputing}</p>}
    {report && <>
      <section><h2>{r.inputs}</h2>
        <table><thead><tr><th scope="col">{r.release}</th><th scope="col">{r.hash}</th></tr></thead>
          <tbody>{report.inputs.map(i => <tr key={i.id}><th scope="row"><a href={i.manifest}>{i.id}@{i.version}</a></th><td className="report-hash">{i.sha256}</td></tr>)}</tbody></table>
        <pre className="report-json">{JSON.stringify(report.scenario, null, 2)}</pre>
      </section>
      {report.body.kind === 'flood' ? <FloodReport body={report.body} lang={lang} /> : <QuakeReport body={report.body} lang={lang} />}
      <section><h2>{r.limitations}</h2>{lang === 'ne' && <p>{r.limitationsLang}</p>}<ul lang="en">{report.release.flatMap(r => r.metadata.limitations).map(l => <li key={l}>{l}</li>)}</ul></section>
      <section><h2>{r.unknownTitle}</h2><p>{r.unknownText}</p></section>
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

function FloodReport({ body, lang }: { body: FloodBody; lang: Lang }) {
  const r = REPORT[lang];
  const origin = body.catalogue.origins.find(o => o.id === body.scenario.origin)!;
  const h = hydrograph(body.scenario);
  const n = (v: number | null, f = 0) => formatNumber(v, lang, f);
  const list = (vs: number[]) => vs.map(v => n(v, v % 1 ? 1 : 0)).join('/');
  return <section><h2>{r.results}</h2>
    <p><strong>{r.releasePoint}:</strong> {originLabel(origin, lang)} · {r.path} {n(origin.path_length_km, 1)} km ({origin.termination.replace('_', ' ')}).</p>
    <p><strong>{r.hydrograph}:</strong> {r.hydroText(body.scenario.shape, n(body.scenario.volume_m3), duration(body.scenario.duration_s, lang), n(h.peak_m3_s, 1), n(hydrographVolume(h.points)))}</p>
    <table><caption>{r.floodCaption(list(body.scenario.celerity_m_s), list(body.catalogue.widths_m))}</caption>
      <thead><tr><th scope="col">{r.distance}</th><th scope="col">{r.front}</th><th scope="col">{r.ends}</th><th scope="col">{r.popRange}</th><th scope="col">{r.assetRange}</th></tr></thead>
      <tbody>{origin.checkpoints.map(row => { const a = arrivals(body.scenario, row.prefix_km); const x = exposureRange(row.by_width, body.catalogue.widths_m); return <tr key={row.prefix_km}>
        <th scope="row">{n(row.prefix_km, 1)} km</th><td>{duration(a.front_s[0], lang)} – {duration(a.front_s[2], lang)}</td><td>{duration(a.end_s[0], lang)} – {duration(a.end_s[2], lang)}</td>
        <td>{x.population.min === null ? n(null) : `${n(Math.round(x.population.min))}–${n(Math.round(x.population.max!))}`}{x.population.partial ? ` ${r.partial}` : ''}</td>
        <td>{n(x.assets.min)}–{n(x.assets.max)}</td></tr>; })}</tbody></table>
  </section>;
}

function QuakeReport({ body, lang }: { body: QuakeBody; lang: Lang }) {
  const r = REPORT[lang];
  const s = body.scenario;
  const n = (v: number | null, f = 0) => formatNumber(v, lang, f);
  return <section><h2>{r.results}</h2>
    <p><strong>{r.scenario}:</strong> M{n(s.magnitude, 1)} {s.mechanism} · {n(s.longitude, 3)}°E, {n(s.latitude, 3)}°N; {s.rupture.type === 'point' ? r.point : r.line(n(s.rupture.length_km), n(s.rupture.strike_deg))}; {r.uniform} V<sub>S30</sub> {n(s.vs30)} m/s. {r.model} {body.model.model} (doi:{body.model.doi}).</p>
    <table><caption>{r.bandCaption}</caption><thead><tr><th scope="col">{r.band}</th><th scope="col">{r.median}</th><th scope="col">−1σ</th><th scope="col">+1σ</th></tr></thead>
      <tbody>{PGA_BANDS.map((b, i) => <tr key={b.label}><th scope="row">{b.label}</th><td>{n(Math.round(body.result.population.central[i]))}</td><td>{n(Math.round(body.result.population.low[i]))}</td><td>{n(Math.round(body.result.population.high[i]))}</td></tr>)}</tbody></table>
    <p>{r.beyond(n(Math.round(body.result.population.beyond)))}</p>
  </section>;
}
