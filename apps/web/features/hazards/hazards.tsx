'use client';
import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { LIVE_AUTHORITIES } from '../../../../packages/contracts/live';
import { parseClimateContext, parseTerrainSteepness, type ClimateContext, type ModelRelease, type TerrainSteepness } from '../../../../packages/contracts/model-release';
import { ADMIN_MANIFESTS, loadDataset } from '../../lib/datasets';
import { buildIndex, parseEvidenceCorpus, retrieve, type EvidenceAnswer, type EvidenceIndex } from '../../lib/evidence';
import {
  CLIMATE_VIEWS, cellPolygon, classify, freshness, monthLabel, nationalPrecipSeries, SPI_SCALE, spiShare, STEEP_SCALE, steepestDistricts, UNKNOWN_FILL,
  type ClimateView, type ScaleClass,
} from '../../lib/hazard-context';
import { formatNumber, LanguageSwitch, useLanguage, type Lang } from '../../lib/i18n';
import { loadModelArtifact, loadModelRelease, manifestPath, MODEL_RELEASES, type ModelKey } from '../../lib/model-release';
import { hz, type HzCopy } from './copy';
import { ChoroplethMap, type ChoroplethFeature } from './hazards-map';

type Loaded<T> = { release: ModelRelease; data: T };
type State<T> = { value: Loaded<T> | null; error: string | null; retry: () => void };

function useRelease<T>(key: ModelKey, artifact: string, parse: (value: unknown, release: ModelRelease) => T): State<T> {
  const [value, setValue] = useState<Loaded<T> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      const release = await loadModelRelease(MODEL_RELEASES[key], controller.signal);
      return { release, data: parse(await loadModelArtifact(release, artifact, controller.signal), release) };
    })().then(v => { setValue(v); setError(null); }, reason => { if (!controller.signal.aborted) setError(reason instanceof Error ? reason.message : 'Unavailable'); });
    return () => controller.abort();
    // parse is a stable module-level function at every call site
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, artifact, attempt]);
  return { value, error, retry: () => { setError(null); setAttempt(a => a + 1); } };
}
const parseClimate = (v: unknown, r: ModelRelease) => parseClimateContext(v, r.summary as { cells: number; latest_month: string });
const parseTerrain = (v: unknown, r: ModelRelease) => parseTerrainSteepness(v, r.summary as { districts: number });
const parseCorpus = (v: unknown, r: ModelRelease) => buildIndex(parseEvidenceCorpus(v, r.summary as { chunks: number; documents: number }));

const pct = (v: number, lang: Lang, f = 0) => `${formatNumber(v * 100, lang, f)}%`;

export function Hazards() {
  const [lang, setLang] = useLanguage();
  const c = hz(lang);
  const climate = useRelease('climate', 'context', parseClimate);
  const terrain = useRelease('terrain', 'steepness', parseTerrain);
  const corpus = useRelease('evidence', 'corpus', parseCorpus);
  const sections: Array<[string, string]> = [['overview', c.overview], ['climate', c.climateTitle], ['terrain', c.terrainTitle], ['gated', c.gatedTitle], ['evidence', c.evidenceTitle]];

  return <div className="hz-page" lang={lang}>
    <header className="hz-hero">
      <div className="hz-hero-top"><p className="eyebrow">{c.eyebrow}</p><LanguageSwitch lang={lang} onChange={setLang} /></div>
      <h1>{c.title}</h1>
      <p className="intro">{c.intro}</p>
      <div className="hz-notice" role="note"><span aria-hidden="true">◇</span><div><strong>{c.notice}</strong> {c.authorities} {LIVE_AUTHORITIES.map((a, i) => <span key={a.name}>{i > 0 && ' · '}<a href={a.url} rel="noopener">{a.name}</a></span>)}.</div></div>
      <nav className="hz-jump" aria-label={c.jump}>{sections.map(([id, label]) => <a key={id} href={`#${id}`}>{label}</a>)}</nav>
    </header>
    <Overview c={c} lang={lang} climate={climate.value} terrain={terrain.value} />
    <Section id="climate" title={c.climateTitle} badge={c.modelled} lead={c.climateLead} state={climate} c={c}>
      {climate.value && <ClimatePanel loaded={climate.value} c={c} lang={lang} />}
    </Section>
    <Section id="terrain" title={c.terrainTitle} badge={c.derived} lead={c.terrainLead} state={terrain} c={c}>
      {terrain.value && <TerrainPanel loaded={terrain.value} c={c} lang={lang} />}
    </Section>
    <section id="gated" className="hz-section" aria-labelledby="gated-title">
      <div className="hz-section-head"><h2 id="gated-title">{c.gatedTitle}</h2><span className="hz-badge hz-badge-gated">{c.gated}</span></div>
      <p className="hz-lead">{c.gatedLead}</p>
      <ul className="hz-gated">{c.gatedCards.map(([title, text], i) => <li key={title}><span className="hz-badge hz-badge-gated">{c.gated} · F{[44, 50, 52][i]}</span><h3>{title}</h3><p>{text}</p></li>)}</ul>
      <p className="hz-provenance"><a href="/methodology/#hazards-hub-method">{c.methodology}</a> · <a href="https://github.com/prasidupadhya/Himalayan-Disaster-Atlas/blob/main/docs/hazards-hub.md">docs/hazards-hub.md</a></p>
    </section>
    <Section id="evidence" title={c.evidenceTitle} badge={c.derived} lead={c.evidenceLead} state={corpus} c={c}>
      {corpus.value && <EvidencePanel index={corpus.value.data} release={corpus.value.release} c={c} />}
    </Section>
  </div>;
}

function Section<T>({ id, title, badge, lead, state, c, children }: { id: string; title: string; badge: string; lead: string; state: State<T>; c: HzCopy; children: ReactNode }) {
  return <section id={id} className="hz-section" aria-labelledby={`${id}-title`}>
    <div className="hz-section-head"><h2 id={`${id}-title`}>{title}</h2><span className="hz-badge">◇ {badge}</span></div>
    <p className="hz-lead">{lead}</p>
    {state.error ? <div className="hz-problem" role="alert"><p><strong>{c.failed}</strong> {state.error}</p><button type="button" onClick={state.retry}>{c.retry}</button></div>
      : !state.value ? <p role="status" className="hz-loading">{c.loading}</p> : children}
  </section>;
}

function Overview({ c, lang, climate, terrain }: { c: HzCopy; lang: Lang; climate: Loaded<ClimateContext> | null; terrain: Loaded<TerrainSteepness> | null }) {
  const latest = climate?.data.national[11];
  const wet = latest ? latest.spi3_area_share['moderately-wet'] + latest.spi3_area_share['severely-wet'] + latest.spi3_area_share['extremely-wet'] : null;
  const dry = latest ? latest.spi3_area_share['moderately-dry'] + latest.spi3_area_share['severely-dry'] + latest.spi3_area_share['extremely-dry'] : null;
  const steep = terrain ? terrain.data.national_slope_class_share['30-45'] + terrain.data.national_slope_class_share['45+'] : null;
  const card = (key: keyof HzCopy['cards'], href: string, badge: string, figure?: ReactNode) => {
    const [title, text, action] = c.cards[key];
    return <li className="hz-card"><span className="hz-badge">{badge}</span><h3>{title}</h3><p>{text}</p>{figure}<a href={href}>{action} →</a></li>;
  };
  return <section id="overview" className="hz-section" aria-labelledby="overview-title">
    <div className="hz-section-head"><h2 id="overview-title">{c.overview}</h2></div>
    <ul className="hz-cards">
      {card('flood', '/simulate/', c.scenario)}
      {card('quake', '/simulate/?tab=earthquake', c.scenario)}
      {card('landslide', '#terrain', c.derived, steep !== null && <p className="hz-figure"><strong>{pct(steep, lang)}</strong> {c.steepShare}</p>)}
      {card('rain', '#climate', c.modelled, climate && <p className="hz-figure"><strong>{monthLabel(climate.data.latest_month, lang)}</strong> {c.latestMonth}</p>)}
      {card('drought', '#climate', c.modelled, wet !== null && dry !== null && <p className="hz-figure"><strong>{pct(dry, lang)}</strong> {c.dryShare} · <strong>{pct(wet, lang)}</strong> {c.wetShare}</p>)}
    </ul>
  </section>;
}

function Legend({ scale, lang, c, shares }: { scale: ScaleClass[]; lang: Lang; c: HzCopy; shares?: Record<string, number> }) {
  return <ul className="hz-legend" aria-label={c.legend}>
    {scale.map(s => <li key={s.id}><span className="hz-swatch" style={{ background: s.color }} aria-hidden="true" />{s.label[lang]}{shares && <strong> {pct(shares[s.id] ?? 0, lang)}</strong>}</li>)}
    <li><span className="hz-swatch hz-swatch-unknown" aria-hidden="true" />{c.unknown}</li>
  </ul>;
}

function ClimatePanel({ loaded, c, lang }: { loaded: Loaded<ClimateContext>; c: HzCopy; lang: Lang }) {
  const ctx = loaded.data;
  const [month, setMonth] = useState(11);
  const [view, setView] = useState<ClimateView>('spi3');
  const [selected, setSelected] = useState<string | null>(null);
  const scale = CLIMATE_VIEWS[view].scale;
  const features = useMemo<ChoroplethFeature[]>(() => ctx.cells.map(cell => {
    const cls = classify(scale, CLIMATE_VIEWS[view].value(cell, month));
    return { id: cell.id, name: cell.id, fill: cls?.color ?? UNKNOWN_FILL, unknown: !cls, geometry: cellPolygon(cell) };
  }), [ctx, scale, view, month]);
  const shares = view === 'spi3' ? Object.fromEntries(spiShare(ctx, month).map(s => [s.id, s.share])) : undefined;
  const cell = ctx.cells.find(x => x.id === selected) ?? null;
  const status = freshness(loaded.release.metadata.stale_after ?? null);
  const onSelect = useCallback((id: string) => setSelected(id), []);
  const coord = (v: number, ax: 'N' | 'E') => `${formatNumber(v, lang, ax === 'E' ? 3 : 2)}°${ax}`;
  return <>
    <div className="hz-controls">
      <label className="hz-field"><span>{c.month}</span>
        <select value={month} onChange={e => setMonth(Number(e.target.value))}>{ctx.recent_months.map((m, i) => <option key={m} value={i}>{monthLabel(m, lang)}</option>)}</select></label>
      <fieldset className="hz-segmented"><legend>{c.view}</legend>
        {(Object.keys(CLIMATE_VIEWS) as ClimateView[]).map(v => <label key={v}><input type="radio" name="hz-view" checked={view === v} onChange={() => setView(v)} /><span>{c.views[v]}</span></label>)}
      </fieldset>
      <p className="hz-fresh"><span className={`hz-badge ${status === 'STALE' ? 'hz-badge-stale' : ''}`}>{status}</span> {c.freshness}: {monthLabel(ctx.latest_month, lang)}{status === 'STALE' && <> — {c.staleNote}</>}</p>
    </div>
    <p className="hz-view-note">{c.viewNotes[view]}</p>
    <div className="hz-map-layout">
      <ChoroplethMap features={features} selected={selected} onSelect={onSelect} label={`${c.climateTitle}: ${c.views[view]}, ${monthLabel(ctx.recent_months[month], lang)}`} messages={{ loading: c.mapLoading, failed: c.mapFailed, noWebgl: c.mapNoWebgl }} />
      <aside className="hz-side">
        <Legend scale={scale} lang={lang} c={c} shares={shares} />
        <div className="hz-detail" aria-live="polite">
          {cell ? <><h3>{c.selected}: {coord(cell.lat, 'N')}, {coord(cell.lon, 'E')}</h3>
            <dl>
              <div><dt>{c.nepalArea}</dt><dd>{formatNumber(cell.nepal_area_km2, lang)} km² / {formatNumber(cell.cell_area_km2, lang)} km²</dd></div>
              <div><dt>{c.precip}</dt><dd>{formatNumber(cell.recent[month].precip_mm_day, lang, 2)} ({formatNumber(cell.recent[month].precip_percent_of_normal, lang)}{cell.recent[month].precip_percent_of_normal === null ? '' : '%'})</dd></div>
              <div><dt>{c.spi}</dt><dd>{formatNumber(cell.recent[month].spi3, lang, 2)} · {SPI_SCALE.find(s => s.id === cell.recent[month].spi3_class)!.label[lang]}</dd></div>
              <div><dt>{c.tmax}</dt><dd>{formatNumber(cell.recent[month].tmax_anomaly_c, lang, 2)} ({formatNumber(cell.recent[month].tmax_c, lang, 1)} °C)</dd></div>
              <div><dt>{c.snowCover}</dt><dd>{pct(cell.recent[month].snow_cover_fraction, lang, 1)} ({formatNumber(cell.recent[month].snow_cover_anomaly * 100, lang, 1)})</dd></div>
            </dl></> : <p className="hz-muted">{c.clickHint}</p>}
        </div>
      </aside>
    </div>
    <div className="hz-charts">
      <SpiShares ctx={ctx} c={c} lang={lang} month={month} onMonth={setMonth} />
      <NationalPrecip ctx={ctx} c={c} lang={lang} month={month} />
    </div>
    <details className="hz-details"><summary>{c.cellTable} ({monthLabel(ctx.recent_months[month], lang)}, {formatNumber(ctx.cells.length, lang)})</summary>
      <div className="hz-table-scroll" role="region" aria-label={c.cellTable} tabIndex={0}>
        <table className="hz-stack" role="table"><thead><tr role="row">{[c.cell, c.nepalArea, c.precip, c.pctNormal, c.spi, c.tmax, c.snowCover].map(h => <th key={h} scope="col" role="columnheader">{h}</th>)}</tr></thead>
          <tbody>{ctx.cells.map(cl => { const r = cl.recent[month]; return <tr key={cl.id} role="row" aria-selected={cl.id === selected} onClick={() => setSelected(cl.id)}>
            <th scope="row" role="rowheader"><button type="button" className="hz-link-button" onClick={() => setSelected(cl.id)}>{coord(cl.lat, 'N')}, {coord(cl.lon, 'E')}</button></th>
            <td role="cell" data-label={c.nepalArea}>{formatNumber(cl.nepal_area_km2, lang)} km²</td>
            <td role="cell" data-label={c.precip}>{formatNumber(r.precip_mm_day, lang, 2)}</td>
            <td role="cell" data-label={c.pctNormal}>{r.precip_percent_of_normal === null ? c.unknown : `${formatNumber(r.precip_percent_of_normal, lang)}%`}</td>
            <td role="cell" data-label={c.spi}>{formatNumber(r.spi3, lang, 2)}</td>
            <td role="cell" data-label={c.tmax}>{formatNumber(r.tmax_anomaly_c, lang, 2)}</td>
            <td role="cell" data-label={c.snowCover}>{pct(r.snow_cover_fraction, lang, 1)}</td>
          </tr>; })}</tbody></table>
      </div>
    </details>
    <Provenance release={loaded.release} anchor="climate-context" c={c} />
  </>;
}

function SpiShares({ ctx, c, lang, month, onMonth }: { ctx: ClimateContext; c: HzCopy; lang: Lang; month: number; onMonth: (m: number) => void }) {
  return <figure className="hz-chart">
    <figcaption><strong>{c.shareTitle}</strong><span>{c.shareCaption}</span></figcaption>
    <ol className="hz-share-rows">
      {ctx.recent_months.map((m, i) => <li key={m} className={i === month ? 'is-current' : undefined}>
        <button type="button" className="hz-share-month" aria-pressed={i === month} onClick={() => onMonth(i)}>{monthLabel(m, lang)}</button>
        <span className="hz-share-bar" role="img" aria-label={`${monthLabel(m, lang)}: ${spiShare(ctx, i).filter(s => s.share > 0).map(s => `${SPI_SCALE.find(x => x.id === s.id)!.label[lang]} ${pct(s.share, lang)}`).join(', ')}`}>
          {spiShare(ctx, i).filter(s => s.share > 0).map(s => <span key={s.id} style={{ width: `${s.share * 100}%`, background: SPI_SCALE.find(x => x.id === s.id)!.color }} title={`${SPI_SCALE.find(x => x.id === s.id)!.label[lang]}: ${pct(s.share, lang, 1)}`} />)}
        </span>
      </li>)}
    </ol>
  </figure>;
}

function NationalPrecip({ ctx, c, lang, month }: { ctx: ClimateContext; c: HzCopy; lang: Lang; month: number }) {
  const series = nationalPrecipSeries(ctx);
  const max = Math.max(...series.flatMap(s => [s.value, s.normal])) * 1.1;
  const [hover, setHover] = useState<number | null>(null);
  const shown = hover ?? month;
  return <figure className="hz-chart">
    <figcaption><strong>{c.nationalTitle}</strong><span>{c.nationalCaption}</span></figcaption>
    <p className="hz-chart-readout" aria-live="polite">{monthLabel(series[shown].month, lang)}: <strong>{formatNumber(series[shown].value, lang, 2)} mm/day</strong> · normal {formatNumber(series[shown].normal, lang, 2)}</p>
    <div className="hz-columns" onPointerLeave={() => setHover(null)}>
      {series.map((s, i) => <div key={s.month} className={`hz-column${i === month ? ' is-current' : ''}`} onPointerEnter={() => setHover(i)}>
        <span className="hz-column-bar" style={{ height: `${(s.value / max) * 100}%` }} />
        <span className="hz-column-normal" style={{ bottom: `${(s.normal / max) * 100}%` }} aria-hidden="true" />
        <span className="hz-column-label">{monthLabel(s.month, lang).split(' ')[0].slice(0, 3)}</span>
      </div>)}
    </div>
    <details className="hz-details"><summary>{c.tableView}</summary>
      <table className="hz-mini"><thead><tr><th scope="col">{c.month}</th><th scope="col">mm/day</th><th scope="col">normal</th></tr></thead>
        <tbody>{series.map(s => <tr key={s.month}><th scope="row">{monthLabel(s.month, lang)}</th><td>{formatNumber(s.value, lang, 2)}</td><td>{formatNumber(s.normal, lang, 2)}</td></tr>)}</tbody></table>
    </details>
  </figure>;
}

function TerrainPanel({ loaded, c, lang }: { loaded: Loaded<TerrainSteepness>; c: HzCopy; lang: Lang }) {
  const t = loaded.data;
  const [geometry, setGeometry] = useState<Map<string, GeoJSON.Geometry> | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  useEffect(() => {
    const controller = new AbortController();
    loadDataset(ADMIN_MANIFESTS[2], controller.signal).then(d => setGeometry(new Map(d.collection.features.map(f => [String(f.properties.pcode), f.geometry as GeoJSON.Geometry]))), () => undefined);
    return () => controller.abort();
  }, []);
  const features = useMemo<ChoroplethFeature[]>(() => geometry ? t.districts.filter(d => geometry.has(d.district_id)).map(d => {
    const cls = classify(STEEP_SCALE, d.share_steeper_than_30_deg);
    return { id: d.district_id, name: d.name, fill: cls?.color ?? UNKNOWN_FILL, unknown: !cls, geometry: geometry.get(d.district_id)! };
  }) : [], [geometry, t]);
  const top = steepestDistricts(t.districts);
  const district = t.districts.find(d => d.district_id === selected) ?? null;
  const onSelect = useCallback((id: string) => setSelected(id), []);
  const sorted = [...t.districts].sort((a, b) => b.share_steeper_than_30_deg - a.share_steeper_than_30_deg);
  return <>
    <div className="hz-map-layout">
      <ChoroplethMap features={features} selected={selected} onSelect={onSelect} label={c.terrainTitle} messages={{ loading: c.mapLoading, failed: c.mapFailed, noWebgl: c.mapNoWebgl }} />
      <aside className="hz-side">
        <Legend scale={STEEP_SCALE} lang={lang} c={c} />
        <div className="hz-detail" aria-live="polite">
          {district ? <><h3>{district.name} <span className="hz-muted">· {district.province}</span></h3>
            <dl>
              <div><dt>{c.steep}</dt><dd>{pct(district.share_steeper_than_30_deg, lang, 1)}</dd></div>
              <div><dt>{c.meanSlope}</dt><dd>{formatNumber(district.slope_mean_deg, lang, 1)}°</dd></div>
              <div><dt>{c.elevation}</dt><dd>{formatNumber(district.elevation_mean_m, lang)} m ({formatNumber(district.elevation_min_m, lang)}–{formatNumber(district.elevation_max_m, lang)} m)</dd></div>
            </dl>
            <span className="hz-share-bar" role="img" aria-label={Object.entries(district.slope_class_share).map(([k, v]) => `${k}°: ${pct(v, lang)}`).join(', ')}>
              {Object.entries(district.slope_class_share).map(([k, v], i) => <span key={k} style={{ width: `${v * 100}%`, background: STEEP_SCALE[i].color }} title={`${k}°: ${pct(v, lang, 1)}`} />)}
            </span></> : <p className="hz-muted">{c.clickHint}</p>}
        </div>
      </aside>
    </div>
    <figure className="hz-chart">
      <figcaption><strong>{c.topSteep}</strong></figcaption>
      <ol className="hz-bars">{top.map(d => <li key={d.district_id}>
        <button type="button" className="hz-link-button" onClick={() => setSelected(d.district_id)}>{d.name}</button>
        <span className="hz-bar-track" aria-hidden="true"><span style={{ width: `${d.share_steeper_than_30_deg * 100}%` }} /></span>
        <strong>{pct(d.share_steeper_than_30_deg, lang)}</strong>
      </li>)}</ol>
    </figure>
    <p className="hz-muted">{c.reportedNote}</p>
    <details className="hz-details"><summary>{c.districtTable}</summary>
      <div className="hz-table-scroll" role="region" aria-label={c.districtTable} tabIndex={0}>
        <table className="hz-stack" role="table"><thead><tr role="row">{[c.district, c.province, c.steep, c.meanSlope, c.elevation].map(h => <th key={h} scope="col" role="columnheader">{h}</th>)}</tr></thead>
          <tbody>{sorted.map(d => <tr key={d.district_id} role="row" aria-selected={d.district_id === selected}>
            <th scope="row" role="rowheader"><button type="button" className="hz-link-button" onClick={() => setSelected(d.district_id)}>{d.name}</button></th>
            <td role="cell" data-label={c.province}>{d.province}</td>
            <td role="cell" data-label={c.steep}>{pct(d.share_steeper_than_30_deg, lang, 1)}</td>
            <td role="cell" data-label={c.meanSlope}>{formatNumber(d.slope_mean_deg, lang, 1)}°</td>
            <td role="cell" data-label={c.elevation}>{formatNumber(d.elevation_mean_m, lang)} m</td>
          </tr>)}</tbody></table>
      </div>
    </details>
    <Provenance release={loaded.release} anchor="terrain-steepness" c={c} />
  </>;
}

function EvidencePanel({ index, release, c }: { index: EvidenceIndex; release: ModelRelease; c: HzCopy }) {
  const [query, setQuery] = useState('');
  const [answer, setAnswer] = useState<EvidenceAnswer | null>(null);
  const ask = (q: string) => { setQuery(q); setAnswer(retrieve(index, q)); };
  return <>
    <form className="hz-ask" onSubmit={e => { e.preventDefault(); ask(query); }}>
      <label className="hz-field"><span>{c.question}</span><input type="search" value={query} maxLength={500} onChange={e => setQuery(e.target.value)} /></label>
      <button type="submit">{c.ask}</button>
    </form>
    <p className="hz-suggest"><span>{c.suggestions}:</span> {c.suggested.map(q => <button key={q} type="button" className="hz-chip" onClick={() => ask(q)} lang="en">{q}</button>)}</p>
    <div aria-live="polite" className="hz-answer">
      {answer && <>
        <p className={`hz-answer-status hz-answer-${answer.status}`}>{answer.status === 'answered' ? c.answered : answer.status === 'partial' ? c.partial : c.insufficient}</p>
        <ol className="hz-passages">{answer.hits.map(h => <li key={h.chunk.id}>
          <blockquote lang="en">{h.chunk.text}</blockquote>
          <p className="hz-cite">{c.source}: <a href={h.chunk.source.includes('@') ? `/data/${h.chunk.source.replace('@', '/')}/manifest.json` : `https://github.com/prasidupadhya/Himalayan-Disaster-Atlas/blob/main/docs/${h.chunk.source}.md${h.chunk.start_line ? `#L${h.chunk.start_line}-L${h.chunk.end_line}` : ''}`}>{h.chunk.title} — {h.chunk.section}</a> <code>{h.chunk.id}</code>{h.missing.length > 0 && <> · {c.missing}: {h.missing.join(', ')}</>}</p>
        </li>)}</ol>
      </>}
    </div>
    <Provenance release={release} anchor="public-evidence" c={c} />
  </>;
}

function Provenance({ release, anchor, c }: { release: ModelRelease; anchor: string; c: HzCopy }) {
  const m = release.metadata;
  return <p className="hz-provenance">{c.provenance}: <a href={manifestPath({ id: m.dataset_id, version: m.dataset_version })}>{m.dataset_id}@{m.dataset_version}</a> · {m.license} · <a href={`/methodology/#${anchor}-method`}>{c.methodology}</a> · <a href={`/sources/#${anchor}`}>{c.sources}</a></p>;
}

