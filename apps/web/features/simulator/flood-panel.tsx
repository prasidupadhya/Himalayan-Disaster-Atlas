'use client';
import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { parseCorridorCatalogue, type CorridorCatalogue, type CorridorOrigin, type ModelRelease } from '../../../../packages/contracts/model-release';
import { arrivals, defaultFlood, exposureRange, hydrograph, validateFlood, type FloodScenario } from '../../lib/flood-scenario';
import { digits, formatNumber, UI, type Lang } from '../../lib/i18n';
import { loadModelArtifact, loadModelRelease, MODEL_RELEASES } from '../../lib/model-release';
import { HydrographChart } from './charts';
import { duration, errorText, shortTime, simCopy } from './copy';
import { revealResult } from './reveal';
import type { MapScene } from './simulator-map';

type Geometry = { format: string; corridors: Record<string, Record<string, GeoJSON.Geometry>> };
type Loaded = { release: ModelRelease; catalogue: CorridorCatalogue; geometry: Geometry };

/** English label used by the report and exports; the panel renders the localised form. */
export function originLabel(o: CorridorOrigin, lang: Lang = 'en') {
  const c = simCopy(lang);
  if (o.kind === 'glof-release-point') return c.glofOption(o.lake!.glo_id, o.lake!.basin, formatNumber(o.lake!.area_km2, lang, 2));
  return c.riverOption(o.start_reach, o.gazetteer_hint?.name ?? null);
}

export function FloodPanel({ lang, initial, onScene, onShare, pick, slot }: { lang: Lang; initial: FloodScenario | null; onScene: (scene: MapScene) => void; onShare: (s: FloodScenario) => void; pick: { id: string; n: number } | null; slot: HTMLElement | null }) {
  const t = UI[lang], c = simCopy(lang);
  const [loaded, setLoaded] = useState<Loaded | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);
  const [draft, setDraft] = useState<FloodScenario | null>(initial);
  const [ack, setAck] = useState(false);
  const [run, setRun] = useState<FloodScenario | null>(null);
  const [seenPick, setSeenPick] = useState(0);
  if (pick && pick.n !== seenPick && draft) { setSeenPick(pick.n); setDraft({ ...draft, origin: pick.id }); setAck(false); }

  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      const release = await loadModelRelease(MODEL_RELEASES.corridors, controller.signal);
      const catalogue = parseCorridorCatalogue(await loadModelArtifact(release, 'catalogue', controller.signal), Number(release.summary.origins));
      const geometry = await loadModelArtifact<Geometry>(release, 'geometry', controller.signal);
      if (geometry.format !== 'atlas-flood-corridor-geometry@1' || catalogue.origins.some(o => !geometry.corridors[o.id])) throw new Error('Corridor geometry does not match the catalogue');
      return { release, catalogue, geometry };
    })().then(value => { setLoaded(value); setError(null); setDraft(d => d && value.catalogue.origins.some(o => o.id === d.origin) ? d : defaultFlood(value.catalogue.origins[0])); },
      reason => { if (!controller.signal.aborted) setError(reason instanceof Error ? reason.message : 'Unavailable'); });
    return () => controller.abort();
  }, [attempt]);

  const origin = loaded && draft ? loaded.catalogue.origins.find(o => o.id === draft.origin) ?? null : null;
  const errors = useMemo(() => draft && loaded ? validateFlood(draft, loaded.catalogue) : [], [draft, loaded]);
  const result = run && loaded ? loaded.catalogue.origins.find(o => o.id === run.origin) ?? null : null;

  useEffect(() => {
    if (!loaded) return;
    const selected = result ?? origin;
    const scene: MapScene = {
      origins: loaded.catalogue.origins.map(o => ({ id: o.id, label: originLabel(o), coordinates: o.lake ? [o.lake.longitude, o.lake.latitude] : o.start_coordinates, kind: o.kind === 'glof-release-point' ? 'glof' : 'river', selected: o.id === selected?.id })),
      path: selected?.line ?? null,
      corridors: result ? loaded.catalogue.widths_m.map(w => ({ width: w, geometry: loaded.geometry.corridors[result.id][String(w)] })) : [],
      checkpoints: result ? result.checkpoints.map(row => ({ label: `${digits(row.prefix_km.toFixed(0), lang)} km`, coordinates: row.end_coordinates })) : [],
      fit: selected ? bounds(selected.line) : null,
    };
    onScene(scene);
  }, [loaded, origin, result, onScene, lang]);

  if (error) return <div className="sim-problem" role="alert"><p><strong>{t.failed}</strong> {error}</p><button type="button" onClick={() => { setError(null); setAttempt(a => a + 1); }}>{t.retry}</button></div>;
  if (!loaded || !draft || !origin) return <p role="status" className="sim-loading">{t.loading}</p>;
  const update = (patch: Partial<FloodScenario>) => { setDraft({ ...draft, ...patch }); setAck(false); };
  const hydro = hydrograph(draft);
  const groups = [['glof-release-point', t.glofGroup], ['river-entry-point', t.riverGroup]] as const;
  const list = (values: number[]) => values.map(v => formatNumber(v, lang, v % 1 ? 1 : 0)).join(', ');
  const assumptions = c.floodAssumptions({
    reach: origin.start_reach, glof: origin.kind === 'glof-release-point', link: formatNumber(origin.link_distance_m ?? null, lang), shape: draft.shape,
    volume: formatNumber(draft.volume_m3, lang), duration: duration(draft.duration_s, lang), peak: formatNumber(hydro.peak_m3_s, lang, 1),
    celerities: list(draft.celerity_m_s), widths: list(loaded.catalogue.widths_m),
  });

  return <div className="sim-panel" data-sim="flood">
    <section className="sim-step" aria-labelledby="flood-step-1">
      <h2 id="flood-step-1"><span className="sim-step-number">{digits('1', lang)}</span> {t.step1}</h2>
      <label className="sim-field"><span>{c.releasePoint}</span>
        <select value={draft.origin} onChange={event => update({ origin: event.target.value })}>
          {groups.map(([kind, label]) => <optgroup key={kind} label={label}>
            {loaded.catalogue.origins.filter(o => o.kind === kind).map(o => <option key={o.id} value={o.id}>{originLabel(o, lang)}</option>)}
          </optgroup>)}
        </select>
      </label>
      <OriginCard origin={origin} lang={lang} />
      <p className="sim-muted">{c.onlyVerified(loaded.catalogue.origins.length)} <a href="/research/">{c.workbench}</a>{lang === 'en' ? ', ' : ''}{c.exposureUnknown}</p>
    </section>

    <section className="sim-step" aria-labelledby="flood-step-2">
      <h2 id="flood-step-2"><span className="sim-step-number">{digits('2', lang)}</span> {t.step2}</h2>
      <fieldset className="sim-fieldset"><legend>{c.shape}</legend>
        {(['triangular', 'rectangular'] as const).map(shape => <label key={shape} className="sim-radio"><input type="radio" name="flood-shape" checked={draft.shape === shape} onChange={() => update({ shape })} /> {shape === 'triangular' ? c.triangular : c.rectangular}</label>)}
      </fieldset>
      <div className="sim-grid-2">
        <NumberField label={c.volume} unit="m³" value={draft.volume_m3} step={100000} onChange={v => update({ volume_m3: v })} hint={c.volumeHint} />
        <NumberField label={c.durationLabel} unit={c.hours} value={round(draft.duration_s / 3600, 3)} step={0.25} onChange={v => update({ duration_s: v * 3600 })} hint={c.durationHint} />
        {draft.shape === 'triangular' && <NumberField label={c.timeToPeak} unit={c.ofDuration} value={round(draft.peak_fraction * 100, 1)} step={5} onChange={v => update({ peak_fraction: v / 100 })} hint={c.peakHint} />}
      </div>
      <fieldset className="sim-fieldset"><legend>{c.celerity}</legend>
        <div className="sim-grid-3">
          {[c.minimum, c.central, c.maximum].map((label, i) => <NumberField key={i} label={label} unit="m/s" value={draft.celerity_m_s[i]} step={0.5}
            onChange={v => { const next = [...draft.celerity_m_s] as [number, number, number]; next[i] = v; update({ celerity_m_s: next }); }} />)}
        </div>
      </fieldset>
      {errors.length > 0 && <ul className="sim-errors" role="alert">{errors.map(e => <li key={e}>{errorText(e, lang)}</li>)}</ul>}
      <div className="sim-assumptions">
        <h3>{t.assumptions}</h3>
        <ul>{assumptions.map(text => <li key={text}>{text}</li>)}</ul>
        <details><summary>{t.limitations}</summary><ul lang="en">{loaded.release.metadata.limitations.map(l => <li key={l}>{l}</li>)}</ul></details>
      </div>
      <label className="sim-ack"><input type="checkbox" checked={ack} onChange={event => setAck(event.target.checked)} /> <span>{t.acknowledge}</span></label>
      <button type="button" className="sim-run" disabled={!ack || errors.length > 0} onClick={() => { setRun(draft); onShare(draft); revealResult('flood-result'); }}>{t.run}</button>
    </section>

    {run && result && slot && createPortal(<FloodResult scenario={run} origin={result} catalogue={loaded.catalogue} release={loaded.release} lang={lang} />, slot)}
  </div>;
}

function OriginCard({ origin, lang }: { origin: CorridorOrigin; lang: Lang }) {
  const c = simCopy(lang);
  return <dl className="sim-origin">
    <div><dt>{c.type}</dt><dd>{origin.kind === 'glof-release-point' ? c.glofType : c.riverType}</dd></div>
    {origin.lake && <><div><dt>{c.lake}</dt><dd>{origin.lake.glo_id} · {origin.lake.connectivity}</dd></div>
      <div><dt>{c.mappedExtent}</dt><dd>{formatNumber(origin.lake.area_km2, lang, 3)} km² {c.extentNote}</dd></div>
      <div><dt>{c.lakeName}</dt><dd>{c.unknownInSource}</dd></div></>}
    <div><dt>{c.riverPath}</dt><dd>{formatNumber(origin.path_length_km, lang, 1)} km · {formatNumber(origin.path_reaches.length, lang)} {c.reaches} · {origin.termination === 'coverage_exit' ? c.stopsAtEdge(origin.next_unavailable_reach ?? 'UNKNOWN') : c.reachesOutlet}</dd></div>
    {origin.gazetteer_hint && <div><dt>{c.namedPoint}</dt><dd>{origin.gazetteer_hint.name} ({formatNumber(origin.gazetteer_hint.distance_m, lang)} m) — {c.orientationOnly}</dd></div>}
  </dl>;
}

function FloodResult({ scenario, origin, catalogue, release, lang }: { scenario: FloodScenario; origin: CorridorOrigin; catalogue: CorridorCatalogue; release: ModelRelease; lang: Lang }) {
  const t = UI[lang], c = simCopy(lang);
  const hydro = hydrograph(scenario);
  const rows = origin.checkpoints.map(row => ({ row, arrival: arrivals(scenario, row.prefix_km), range: exposureRange(row.by_width, catalogue.widths_m) }));
  const last = rows[rows.length - 1];
  const fmtRange = (a: number | null, b: number | null) => a === null || b === null ? formatNumber(null, lang) : a === b ? formatNumber(a, lang) : `${formatNumber(a, lang)}–${formatNumber(b, lang)}`;
  const span = (s: [number, number, number]) => `${duration(s[0], lang)} – ${duration(s[2], lang)}`;
  const short = (s: [number, number, number]) => `${shortTime(s[0], lang)}–${shortTime(s[2], lang)}`;
  const km = (v: number) => formatNumber(v, lang, 0);
  const slash = (values: number[]) => values.map(v => formatNumber(v, lang, v % 1 ? 1 : 0)).join('/');
  return <section className="sim-step sim-result" aria-labelledby="flood-result" data-sim-result="flood">
    <h2 id="flood-result"><span className="sim-step-number">{digits('3', lang)}</span> {t.step3}</h2>
    <p className="sim-label-row"><span className="sim-badge sim-badge-model">{c.modelled}</span><span className="sim-badge">{t.scenarioNotice}</span></p>
    <div className="sim-result-columns"><div className="sim-result-main">
    <div className="sim-headline">
      <div><span className="sim-kicker">{c.frontReaches(km(rows[0].row.prefix_km))}</span><strong>{span(rows[0].arrival.front_s)}</strong></div>
      <div><span className="sim-kicker">{c.frontEnd(km(last.row.prefix_km))}</span><strong>{span(last.arrival.front_s)}</strong></div>
      <div><span className="sim-kicker">{c.popCorridors}</span><strong>{fmtRange(last.range.population.min, last.range.population.max)}</strong>{last.range.population.partial && <span className="sim-muted">{c.knownSubtotal(formatNumber(last.range.population.unknownAreaMax, lang, 1))}</span>}</div>
      <div><span className="sim-kicker">{c.assetsFull}</span><strong>{fmtRange(last.range.assets.min, last.range.assets.max)}</strong></div>
    </div>
    <HydrographChart points={hydro.points} lang={lang} title={c.hydroTitle(formatNumber(scenario.volume_m3, lang))} />
    <p className="sim-muted">{c.volumeCheck}</p>
    </div><div className="sim-result-side">
    <div className="sim-table-scroll" role="region" aria-label={c.tableRegion} tabIndex={0}>
      <table className="sim-stack" role="table">
        <caption>{c.tableCaption(formatNumber(scenario.celerity_m_s[1], lang, 1), slash(scenario.celerity_m_s), slash(catalogue.widths_m))}</caption>
        <thead><tr role="row"><th scope="col" role="columnheader">{t.distance}</th><th scope="col" role="columnheader">{t.arrival}</th><th scope="col" role="columnheader">{t.peak}</th><th scope="col" role="columnheader">{t.end}</th><th scope="col" role="columnheader">{t.population}</th><th scope="col" role="columnheader">{t.assets}</th></tr></thead>
        <tbody>{rows.map(({ row, arrival, range }) => <tr key={row.prefix_km} role="row">
          <th scope="row" role="rowheader">{formatNumber(row.prefix_km, lang, 1)} km<span className="sim-muted sim-sub">{formatNumber(row.reach_count, lang)} {c.reaches}</span></th>
          <td role="cell" data-label={t.arrival}><strong>{shortTime(arrival.front_s[1], lang)}</strong><span className="sim-muted sim-sub">{short(arrival.front_s)}</span></td>
          <td role="cell" data-label={t.peak}><strong>{shortTime(arrival.peak_s[1], lang)}</strong><span className="sim-muted sim-sub">{short(arrival.peak_s)}</span></td>
          <td role="cell" data-label={t.end}><strong>{shortTime(arrival.end_s[1], lang)}</strong><span className="sim-muted sim-sub">{short(arrival.end_s)}</span></td>
          <td role="cell" data-label={t.population}><strong>{formatNumber(range.population.central, lang)}</strong><span className="sim-muted sim-sub">{fmtRange(range.population.min, range.population.max)}{range.population.partial ? ` · ${formatNumber(range.population.unknownAreaMax, lang, 2)} km² UNKNOWN` : ''}</span></td>
          <td role="cell" data-label={t.assets}><strong>{formatNumber(range.assets.central, lang)}</strong><span className="sim-muted sim-sub">{fmtRange(range.assets.min, range.assets.max)}</span></td>
        </tr>)}</tbody>
      </table>
    </div>
    <details className="sim-details"><summary>{c.categoriesSummary}</summary>
      <ul className="sim-categories">{Object.entries(last.range.categories).map(([k, v]) => <li key={k}><span>{c.categories[k] ?? k}</span><strong>{fmtRange(v.min, v.max)}</strong></li>)}</ul>
      <p className="sim-muted">{c.categoriesNote}</p>
    </details>
    </div></div>
    <div className="sim-unknown" role="note"><strong>{t.damage}:</strong> {t.notModelled}</div>
    <p className="sim-provenance">{c.inputs}: <a href={`/data/${release.metadata.dataset_id}/${release.metadata.dataset_version}/manifest.json`}>{release.metadata.dataset_id}@{release.metadata.dataset_version}</a> ({c.parents(release.inputs.length)}) · {c.method} {catalogue.method} · <a href="/methodology/#flood-corridors-method">{c.methodology}</a> · <a href="/data-catalog/">{c.catalog}</a></p>
  </section>;
}

export function NumberField({ label, unit, value, step, onChange, hint }: { label: string; unit: string; value: number; step: number; onChange: (v: number) => void; hint?: string }) {
  return <label className="sim-field"><span>{label} <span className="sim-unit">({unit})</span></span>
    <input type="number" inputMode="decimal" value={Number.isFinite(value) ? value : ''} step={step} onChange={event => onChange(event.target.value === '' ? NaN : Number(event.target.value))} />
    {hint && <span className="sim-hint">{hint}</span>}
  </label>;
}
const round = (v: number, d: number) => Math.round(v * 10 ** d) / 10 ** d;

function coordsOf(geometry: GeoJSON.Geometry): number[][] {
  if (geometry.type === 'LineString') return geometry.coordinates;
  if (geometry.type === 'MultiLineString') return geometry.coordinates.flat();
  return [];
}
export function bounds(geometry: GeoJSON.Geometry): [number, number, number, number] {
  const c = coordsOf(geometry);
  return [Math.min(...c.map(p => p[0])), Math.min(...c.map(p => p[1])), Math.max(...c.map(p => p[0])), Math.max(...c.map(p => p[1]))];
}
