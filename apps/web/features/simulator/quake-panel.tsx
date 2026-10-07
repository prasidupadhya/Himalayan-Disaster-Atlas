'use client';
import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { parsePopulationGrid, type ModelRelease, type PopulationCells } from '../../../../packages/contracts/model-release';
import type { Dataset } from '../../../../packages/contracts';
import { ADMIN_MANIFESTS, loadDataset } from '../../lib/datasets';
import { computeShaking, PGA_BANDS, ruptureLine, validateScenario, type Asset, type GmpeModel, type Mechanism, type QuakeScenario, type ShakingResult } from '../../lib/earthquake';
import { digits, formatNumber, UI, type Lang } from '../../lib/i18n';
import { loadModelArtifact, loadModelRelease, MODEL_RELEASES } from '../../lib/model-release';
import { BandBars } from './charts';
import type { Corners, MapScene } from './simulator-map';
import { revealResult } from './reveal';
import { errorText, simCopy } from './copy';
import { NumberField } from './flood-panel';

const ASSET_SETS: Array<[string, string]> = [
  ['nepal-osm-schools-west', 'school'], ['nepal-osm-schools-central-west', 'school'], ['nepal-osm-schools-central-east', 'school'], ['nepal-osm-schools-east', 'school'],
  ['nepal-osm-health-facilities', 'health'], ['nepal-osm-emergency-facilities', 'emergency'], ['nepal-osm-hydropower', 'hydropower'], ['nepal-osm-major-bridges', 'bridge'],
];
const GORKHA = 'us20002926';
type Preset = { id: string; label: string; longitude: number; latitude: number; magnitude: number; time: string; depth: number | null; magnitudeType: string | null };
type Loaded = { release: ModelRelease; model: GmpeModel; population: PopulationCells; populationRelease: ModelRelease; presets: Preset[]; districts: Dataset };

/** A preset identity is kept only when the scenario still matches that catalogue record exactly. */
function reconcilePreset(s: QuakeScenario, presets: Preset[]): QuakeScenario {
  const p = presets.find(x => x.id === s.preset);
  return p && p.longitude === s.longitude && p.latitude === s.latitude && p.magnitude === s.magnitude ? s : { ...s, preset: null };
}
export function defaultQuake(preset: Preset): QuakeScenario {
  return { kind: 'earthquake', version: 1, preset: preset.id, longitude: preset.longitude, latitude: preset.latitude, magnitude: preset.magnitude, mechanism: 'unspecified', rupture: { type: 'point' }, vs30: 760 };
}

export async function loadAssets(signal: AbortSignal): Promise<Asset[]> {
  const sets = await Promise.all(ASSET_SETS.map(([id]) => loadDataset(`/data/${id}/1.0.0/manifest.json`, signal)));
  const seen = new Set<string>(); const assets: Asset[] = [];
  sets.forEach((dataset, i) => {
    for (const f of dataset.collection.features) {
      const p = f.properties as unknown as Record<string, unknown>;
      const id = `osm/${p.osm_element_type}/${p.osm_element_id}/${ASSET_SETS[i][1]}`;
      if (seen.has(id)) continue; seen.add(id);
      const g = f.geometry as GeoJSON.Geometry;
      const coords = g.type === 'Point' ? g.coordinates : g.type === 'LineString' ? g.coordinates[Math.floor(g.coordinates.length / 2)] : g.type === 'MultiLineString' ? g.coordinates[0][Math.floor(g.coordinates[0].length / 2)] : null;
      if (coords) assets.push({ id, category: ASSET_SETS[i][1], name: (p.asset_name ?? p.facility_name ?? null) as string | null, coordinates: [coords[0], coords[1]] });
    }
  });
  return assets;
}

/** Mercator-warped raster of central PGA bands so the image lines up exactly on the web-mercator map. */
function shakingImage(result: ShakingResult, cells: PopulationCells): { canvas: HTMLCanvasElement; coordinates: Corners } {
  const g = cells.grid;
  const west = g.west, east = g.west + g.columns * g.cell_degree, north = g.north, south = g.north - g.rows * g.cell_degree;
  const merc = (lat: number) => Math.log(Math.tan(Math.PI / 4 + lat * Math.PI / 360));
  const yTop = merc(north), yBottom = merc(south);
  const width = g.columns, height = Math.round(g.rows * 1.1);
  const canvas = document.createElement('canvas'); canvas.width = width; canvas.height = height;
  const ctx = canvas.getContext('2d')!;
  result.cellKeys.forEach((key, i) => {
    const band = result.cellBands[i]; if (band < 0) return;
    const row = Math.floor(key / g.columns), col = key % g.columns;
    const latTop = north - row * g.cell_degree, latBottom = latTop - g.cell_degree;
    const y0 = (yTop - merc(latTop)) / (yTop - yBottom) * height, y1 = (yTop - merc(latBottom)) / (yTop - yBottom) * height;
    ctx.fillStyle = PGA_BANDS[band].color;
    ctx.fillRect(col, Math.floor(y0), 1, Math.max(1, Math.ceil(y1) - Math.floor(y0)));
  });
  return { canvas, coordinates: [[west, north], [east, north], [east, south], [west, south]] };
}

export function QuakePanel({ lang, initial, onScene, onShare, pick, slot }: { lang: Lang; initial: QuakeScenario | null; onScene: (scene: MapScene) => void; onShare: (s: QuakeScenario) => void; pick: { lon: number; lat: number; n: number } | null; slot: HTMLElement | null }) {
  const t = UI[lang], c = simCopy(lang);
  const [loaded, setLoaded] = useState<Loaded | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);
  const [draft, setDraft] = useState<QuakeScenario | null>(initial);
  const [ack, setAck] = useState(false);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<ShakingResult | null>(null);
  const [image, setImage] = useState<{ canvas: HTMLCanvasElement; coordinates: Corners } | null>(null);
  const [seenPick, setSeenPick] = useState(0);
  // A map click moves a custom epicentre (adjusting state during render, guarded by the click counter).
  if (pick && pick.n !== seenPick && draft) {
    setSeenPick(pick.n);
    setDraft({ ...draft, longitude: Math.round(pick.lon * 1000) / 1000, latitude: Math.round(pick.lat * 1000) / 1000, preset: null });
    setAck(false);
  }

  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      const [release, populationRelease, catalogue, districts] = await Promise.all([
        loadModelRelease(MODEL_RELEASES.gmpe, controller.signal), loadModelRelease(MODEL_RELEASES.population, controller.signal),
        loadDataset('/data/nepal-region-earthquakes/1.0.0/manifest.json', controller.signal), loadDataset(ADMIN_MANIFESTS[2], controller.signal)]);
      const model = await loadModelArtifact<GmpeModel>(release, 'model', controller.signal);
      if (model.format !== 'atlas-gmpe@1' || model.model !== 'BSSA14') throw new Error('Unsupported ground-motion model');
      const population = parsePopulationGrid(await loadModelArtifact(populationRelease, 'grid', controller.signal), populationRelease.summary as never);
      const presets: Preset[] = catalogue.collection.features
        .map(f => ({ f, p: f.properties as unknown as Record<string, unknown> }))
        .filter(({ p }) => typeof p.magnitude === 'number' && (p.magnitude as number) >= 6 && (p.magnitude as number) <= 8.5)
        .sort((a, b) => (b.p.magnitude as number) - (a.p.magnitude as number)).slice(0, 10)
        .map(({ f, p }) => { const [lon, lat] = (f.geometry as GeoJSON.Point).coordinates; return { id: String(p.source_id), label: `M${p.magnitude} ${p.magnitude_type ?? ''} · ${String(p.event_time).slice(0, 10)} · ${p.place_name ?? 'location UNKNOWN'}`, longitude: lon, latitude: lat, magnitude: p.magnitude as number, time: String(p.event_time), depth: (p.depth_km ?? null) as number | null, magnitudeType: (p.magnitude_type ?? null) as string | null }; });
      return { release, model, population, populationRelease, presets, districts };
    })().then(value => { setLoaded(value); setDraft(d => d ? reconcilePreset(d, value.presets) : defaultQuake(value.presets.find(p => p.id === GORKHA) ?? value.presets[0])); },
      reason => { if (!controller.signal.aborted) setError(reason instanceof Error ? reason.message : 'Unavailable'); });
    return () => controller.abort();
  }, [attempt]);

  const errors = useMemo(() => draft && loaded ? validateScenario(loaded.model, draft) : [], [draft, loaded]);
  useEffect(() => {
    if (!draft) return;
    const line = draft.rupture.type === 'line' ? ruptureLine(draft) : null;
    onScene({ epicentre: [draft.longitude, draft.latitude], rupture: line, shaking: result && image ? image : null,
      origins: [], fit: [Math.max(79.6, draft.longitude - 3.2), Math.max(25.9, draft.latitude - 2.2), Math.min(88.6, draft.longitude + 3.2), Math.min(30.7, draft.latitude + 2.2)] });
  }, [draft, result, image, onScene]);

  if (error) return <div className="sim-problem" role="alert"><p><strong>{t.failed}</strong> {error}</p><button type="button" onClick={() => { setError(null); setAttempt(a => a + 1); }}>{t.retry}</button></div>;
  if (!loaded || !draft) return <p role="status" className="sim-loading">{t.loading}</p>;
  const update = (patch: Partial<QuakeScenario>) => { setDraft({ ...draft, ...patch }); setAck(false); };
  const preset = loaded.presets.find(p => p.id === draft.preset) ?? null;

  async function run() {
    if (!loaded || !draft) return;
    setBusy(true);
    try {
      const assets = await loadAssets(new AbortController().signal);
      const sites = loaded.districts.collection.features.filter(f => f.properties.label_longitude != null)
        .map(f => ({ label: String(f.properties.name), longitude: f.properties.label_longitude as number, latitude: f.properties.label_latitude as number }));
      const next = computeShaking(loaded.model, draft, loaded.population, assets, sites);
      setResult(next); setImage(shakingImage(next, loaded.population)); onShare(draft); revealResult('quake-result');
    } catch (reason) { setError(reason instanceof Error ? reason.message : 'Calculation failed'); }
    finally { setBusy(false); }
  }

  return <div className="sim-panel" data-sim="earthquake">
    <section className="sim-step" aria-labelledby="quake-step-1">
      <h2 id="quake-step-1"><span className="sim-step-number">{digits('1', lang)}</span> {c.chooseQuake}</h2>
      <label className="sim-field"><span>{c.replay}</span>
        <select value={draft.preset ?? 'custom'} onChange={event => { const p = loaded.presets.find(x => x.id === event.target.value); update(p ? defaultQuake(p) : { preset: null }); }}>
          {loaded.presets.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
          <option value="custom">{c.custom}</option>
        </select>
      </label>
      <div className="sim-grid-3">
        <NumberField label={c.longitude} unit="°E" value={draft.longitude} step={0.01} onChange={v => update({ longitude: v, preset: null })} />
        <NumberField label={c.latitude} unit="°N" value={draft.latitude} step={0.01} onChange={v => update({ latitude: v, preset: null })} />
        <NumberField label={c.magnitude} unit="Mw" value={draft.magnitude} step={0.1} onChange={v => update({ magnitude: v, preset: draft.preset && preset && v === preset.magnitude ? draft.preset : null })} />
      </div>
      {preset && <p className="sim-muted">{c.presetNote(preset.id, preset.magnitudeType, preset.time, preset.depth)}</p>}
    </section>
    <section className="sim-step" aria-labelledby="quake-step-2">
      <h2 id="quake-step-2"><span className="sim-step-number">{digits('2', lang)}</span> {t.step2}</h2>
      <div className="sim-grid-2">
        <label className="sim-field"><span>{c.mechanism}</span>
          <select value={draft.mechanism} onChange={event => update({ mechanism: event.target.value as Mechanism })}>
            {(['unspecified', 'reverse', 'strike-slip', 'normal'] as const).map(m => <option key={m} value={m}>{c.mechanisms[m]}</option>)}
          </select></label>
        <label className="sim-field"><span>{c.site} V<sub>S30</sub> (m/s)</span>
          <select value={String(draft.vs30)} onChange={event => update({ vs30: Number(event.target.value) })}>
            {[760, 360, 270, 180].map(v => <option key={v} value={String(v)}>{c.vs30[v]}</option>)}
          </select></label>
      </div>
      <fieldset className="sim-fieldset"><legend>{c.rupture}</legend>
        <label className="sim-radio"><input type="radio" name="rupture" checked={draft.rupture.type === 'point'} onChange={() => update({ rupture: { type: 'point' } })} /> {c.point}</label>
        <label className="sim-radio"><input type="radio" name="rupture" checked={draft.rupture.type === 'line'} onChange={() => update({ rupture: { type: 'line', length_km: 100, strike_deg: 290 } })} /> {c.line}</label>
        {draft.rupture.type === 'line' && <div className="sim-grid-2">
          <NumberField label={c.length} unit="km" value={draft.rupture.length_km} step={5} onChange={v => update({ rupture: { type: 'line', length_km: v, strike_deg: (draft.rupture as { strike_deg: number }).strike_deg } })} hint={c.lengthHint} />
          <NumberField label={c.strike} unit={c.fromNorth} value={draft.rupture.strike_deg} step={5} onChange={v => update({ rupture: { type: 'line', length_km: (draft.rupture as { length_km: number }).length_km, strike_deg: v } })} />
        </div>}
      </fieldset>
      {errors.length > 0 && <ul className="sim-errors" role="alert">{errors.map(e => <li key={e}>{errorText(e, lang)}</li>)}</ul>}
      <div className="sim-assumptions">
        <h3>{t.assumptions}</h3>
        <ul>{c.quakeAssumptions(draft.rupture.type === 'point', draft.vs30).map(text => <li key={text}>{text}</li>)}</ul>
        <details><summary>{t.limitations}</summary><ul lang="en">{loaded.release.metadata.limitations.map(l => <li key={l}>{l}</li>)}</ul></details>
      </div>
      <label className="sim-ack"><input type="checkbox" checked={ack} onChange={event => setAck(event.target.checked)} /> <span>{t.acknowledge}</span></label>
      <button type="button" className="sim-run" disabled={!ack || errors.length > 0 || busy} onClick={() => void run()}>{busy ? t.running : t.run}</button>
    </section>
    {result && slot && createPortal(<QuakeResult result={result} loaded={loaded} lang={lang} />, slot)}
  </div>;
}

function QuakeResult({ result, loaded, lang }: { result: ShakingResult; loaded: Loaded; lang: Lang }) {
  const t = UI[lang], c = simCopy(lang);
  const s = result.scenario;
  const strong = (counts: number[]) => counts.slice(3).reduce((a, b) => a + b, 0);
  const topSites = [...result.sites].sort((a, b) => (b.median ?? -1) - (a.median ?? -1)).slice(0, 12);
  const kathmandu = result.sites.find(site => /kathmandu/i.test(site.label));
  return <section className="sim-step sim-result" aria-labelledby="quake-result" data-sim-result="earthquake">
    <h2 id="quake-result"><span className="sim-step-number">{digits('3', lang)}</span> {t.step3}</h2>
    <p className="sim-label-row"><span className="sim-badge sim-badge-model">{c.modelled}</span><span className="sim-badge">{t.scenarioNotice}</span></p>
    <div className="sim-headline">
      <div><span className="sim-kicker">{c.strongPeople}</span><strong>{formatNumber(strong(result.population.central), lang)}</strong><span className="sim-muted">−1σ {formatNumber(strong(result.population.low), lang)} · +1σ {formatNumber(strong(result.population.high), lang)}</span></div>
      {kathmandu && <div><span className="sim-kicker">{c.ktm}</span><strong>{kathmandu.median === null ? formatNumber(null, lang) : `${formatNumber(kathmandu.median, lang, 2)} g`}</strong><span className="sim-muted">{kathmandu.median !== null && `±1σ ${formatNumber(kathmandu.low, lang, 2)}–${formatNumber(kathmandu.high, lang, 2)} g · `}R<sub>JB</sub> {formatNumber(kathmandu.rjb, lang)} km</span></div>}
      <div><span className="sim-kicker">{c.scenario}</span><strong>M{formatNumber(s.magnitude, lang, 1)} · {c.mechanisms[s.mechanism].split(' (')[0]}</strong><span className="sim-muted">V<sub>S30</sub> {formatNumber(s.vs30, lang)} m/s · {s.rupture.type === 'point' ? c.pointSource : c.lineSource(s.rupture.length_km, s.rupture.strike_deg)}</span></div>
    </div>
    <div className="sim-result-columns"><div className="sim-result-main">
    <div className="sim-legend" aria-label={c.legend}>{PGA_BANDS.map(b => <span key={b.label}><span className="sim-swatch" style={{ background: b.color }} aria-hidden="true" />{b.label}</span>)}</div>
    <BandBars bands={PGA_BANDS} central={result.population.central} low={result.population.low} high={result.population.high} lang={lang}
      caption={c.bandsCaption(formatNumber(result.population.beyond, lang))} />
    </div><div className="sim-result-side">
    <div className="sim-table-scroll" role="region" aria-label={c.assetsRegion} tabIndex={0}>
      <table className="sim-stack" role="table"><caption>{c.assetsCaption}</caption>
        <thead><tr role="row"><th scope="col" role="columnheader">{c.assetType}</th>{PGA_BANDS.map(b => <th key={b.label} scope="col" role="columnheader">{b.label}</th>)}</tr></thead>
        <tbody>{Object.entries(result.assets).map(([k, v]) => <tr key={k} role="row"><th scope="row" role="rowheader">{c.assetLabels[k] ?? k}</th>{v.central.map((n, i) => <td key={i} role="cell" data-label={PGA_BANDS[i].label}><strong>{formatNumber(n, lang)}</strong><span className="sim-muted sim-sub">{formatNumber(v.low[i], lang)} / {formatNumber(v.high[i], lang)}</span></td>)}</tr>)}</tbody>
      </table>
    </div>
    <div className="sim-table-scroll" role="region" aria-label={c.sitesRegion} tabIndex={0}>
      <table className="sim-stack sim-stack-3" role="table"><caption>{c.sitesCaption}</caption>
        <thead><tr role="row"><th scope="col" role="columnheader">{c.districtPoint}</th><th scope="col" role="columnheader">R<sub>JB</sub> (km)</th><th scope="col" role="columnheader">{c.median}</th><th scope="col" role="columnheader">{c.sigmaRange}</th></tr></thead>
        <tbody>{topSites.map(site => <tr key={site.label} role="row"><th scope="row" role="rowheader">{site.label}</th><td role="cell" data-label="RJB (km)">{formatNumber(site.rjb, lang)}</td><td role="cell" data-label={c.median}><strong>{formatNumber(site.median, lang, 3)}</strong></td><td role="cell" data-label={c.sigmaRange}>{site.median === null ? formatNumber(null, lang) : `${formatNumber(site.low, lang, 3)}–${formatNumber(site.high, lang, 3)}`}</td></tr>)}</tbody>
      </table>
    </div>
    </div></div>
    {s.preset === GORKHA && <div className="sim-compare" role="note">
      <h3>{c.gorkhaTitle}</h3>
      <p>{c.gorkha1[0]}<strong>{c.gorkha1[1]}</strong>{c.gorkha1[2]}</p>
      <p>{c.gorkha2}</p>
    </div>}
    <div className="sim-unknown" role="note"><strong>{c.quakeUnknownLead}</strong> {c.quakeUnknown}</div>
    <p className="sim-provenance">{c.model} <a href={`/data/${loaded.release.metadata.dataset_id}/${loaded.release.metadata.dataset_version}/manifest.json`}>{loaded.release.metadata.dataset_id}@{loaded.release.metadata.dataset_version}</a> (doi:{loaded.model.doi}) · {c.population} <a href={`/data/${loaded.populationRelease.metadata.dataset_id}/${loaded.populationRelease.metadata.dataset_version}/manifest.json`}>{loaded.populationRelease.metadata.dataset_id}@{loaded.populationRelease.metadata.dataset_version}</a> · <a href="/methodology/#earthquake-shaking-method">{c.methodology}</a></p>
  </section>;
}

