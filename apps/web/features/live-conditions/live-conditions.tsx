'use client';
import dynamic from 'next/dynamic';
import { useEffect, useMemo, useState, useSyncExternalStore } from 'react';
import { EVIDENCE_LABELS, LIVE_AUTHORITIES, workflowHealth } from '../../../../packages/contracts/live';
import { AIR_QUALITY_PUBLIC_ENABLED, AIR_QUALITY_STATUS } from '../../../../packages/contracts/live-air-quality';
import { UnavailableError } from '../../lib/datasets';
import { useCopy, useLanguage } from '../../lib/i18n';
import { loadLivePublication, watchLiveClock, type LastKnown, type LivePublication } from '../../lib/live';
import { buildBulletin, earthquakeRows, FORECAST_CLASSES, feedReason, feedTitle, feedView, forecastCells, formatTime, formatValue, freshnessText, LIVE_CONDITIONS_POLICY as policy, localDigits, nextDeadline, offlineCopy, OFFLINE_POLICY, type FeedView, type Freshness, type Lang, type Purpose } from '../../lib/live-conditions';
import { AUTHORITY_NAMES, EVIDENCE_LABELS_NE, LIVE } from './copy';

function MapUnavailable() {
  const c = useCopy(LIVE);
  return <div className="live-map-shell" data-map-state="unavailable"><p className="live-map-status live-map-failure" role="status">{c.mapCodeNotAvailable}</p></div>;
}
function MapLoading() {
  const c = useCopy(LIVE);
  return <div className="live-map-shell"><p className="live-map-status" role="status">{c.loadingMap}</p></div>;
}
// A failed chunk load (e.g. offline before the map was ever cached) degrades to the tables instead of an error page.
const LiveMap = dynamic(() => import('./live-map').then(module => module.LiveMap).catch(() => MapUnavailable), { ssr: false, loading: () => <MapLoading /> });
type Load = { status: 'loading' } | { status: 'ready'; data: LivePublication; loadedAt: string } | { status: 'unavailable' | 'error'; message: string };
const PAGE_SIZE = 50;

async function fetchPublication(signal: AbortSignal): Promise<Load> {
  try { const data = await loadLivePublication(signal); return { status: 'ready', data, loadedAt: new Date().toISOString() }; }
  catch (error) {
    if (signal.aborted) throw error;
    return { status: error instanceof UnavailableError ? 'unavailable' : 'error', message: error instanceof Error ? error.message : 'Publication unavailable.' };
  }
}

export function PurposeLabel({ purpose, lang = 'en' }: { purpose: Purpose; lang?: Lang }) {
  const item = policy.purposes[purpose];
  return <span className={`live-label live-purpose purpose-${purpose}`} data-purpose={purpose}><span aria-hidden="true">{item.glyph}</span> {item[lang]}</span>;
}
export function FreshnessLabel({ freshness, lastKnown = null, lang = 'en' }: { freshness: Freshness; lastKnown?: LastKnown | null; lang?: Lang }) {
  const item = policy.freshness[freshness];
  // An offline copy is never labelled FRESH: it shows LAST KNOWN, plus STALE/UNAVAILABLE when they apply.
  if (lastKnown) return <span className={`live-label live-freshness freshness-last-known${freshness === 'FRESH' ? '' : ` freshness-${freshness.toLowerCase()}`}`} data-freshness={freshness === 'FRESH' ? 'LAST_KNOWN' : freshness} data-delivery="last-known"><span aria-hidden="true">{OFFLINE_POLICY.last_known.glyph}</span> {freshnessText({ freshness, lastKnown }, lang)}</span>;
  return <span className={`live-label live-freshness freshness-${freshness.toLowerCase()}`} data-freshness={freshness}><span aria-hidden="true">{item.glyph}</span> {item[lang]}</span>;
}
const subscribeOnline = (update: () => void) => { window.addEventListener('online', update); window.addEventListener('offline', update); return () => { window.removeEventListener('online', update); window.removeEventListener('offline', update); }; };
function Time({ value, lang = 'en' }: { value: string | null; lang?: Lang }) {
  return value === null ? <span className="unknown">{policy.copy[lang].unknown}</span> : <time dateTime={value}>{formatTime(value, lang)}</time>;
}
/** Workflow health code; Nepali shows the translated word with the code alongside. */
const healthText = (health: keyof typeof policy.health, lang: Lang) => lang === 'ne' ? `${policy.health[health].ne} (${health})` : health;

export function LiveConditions() {
  const [load, setLoad] = useState<Load>({ status: 'loading' });
  const [attempt, setAttempt] = useState(0);
  const [now, setNow] = useState(0);
  const [lang] = useLanguage();
  const c = useCopy(LIVE);
  const [visible, setVisible] = useState({ earthquakes: true, forecast: true });

  const online = useSyncExternalStore(subscribeOnline, () => navigator.onLine, () => true);

  useEffect(() => {
    const controller = new AbortController();
    void fetchPublication(controller.signal).then(result => setLoad(result), () => undefined);
    return () => controller.abort();
  }, [attempt]);
  // Returning online rechecks the publication instead of keeping a last-known copy on screen.
  useEffect(() => {
    const recheck = () => { setLoad({ status: 'loading' }); setAttempt(value => value + 1); };
    window.addEventListener('online', recheck);
    return () => window.removeEventListener('online', recheck);
  }, []);

  const publication = load.status === 'ready' ? load.data : null;
  const loadedAt = load.status === 'ready' ? load.loadedAt : null;
  const lastKnown = useMemo<LastKnown | null>(() => publication?.lastKnown ?? (!online && publication ? { savedAt: loadedAt } : null), [publication, online, loadedAt]);
  const views = useMemo(() => publication && now ? publication.deliveries.map(delivery => feedView(publication, delivery, now, online ? null : { savedAt: loadedAt })) : [], [publication, now, online, loadedAt]);
  const deadline = nextDeadline(publication, views, now);
  useEffect(() => watchLiveClock(setNow, deadline), [deadline]);

  const health = publication && now ? workflowHealth(publication.index, now) : 'UNAVAILABLE';
  const bulletin = useMemo(() => buildBulletin(publication, views, lang, lastKnown), [publication, views, lang, lastKnown]);
  const usgs = views.find(view => view.feed.feed_id === 'usgs');
  const gfs = views.find(view => view.feed.feed_id === 'noaa-gfs');
  const usgsSnapshot = usgs?.snapshot ?? null, usgsFreshness = usgs?.freshness ?? 'UNAVAILABLE';
  const gfsSnapshot = gfs?.snapshot ?? null, gfsFreshness = gfs?.freshness ?? 'UNAVAILABLE';
  const quakeLayer = useMemo(() => usgsSnapshot ? { rows: earthquakeRows(usgsSnapshot), freshness: usgsFreshness } : null, [usgsSnapshot, usgsFreshness]);
  const forecastLayer = useMemo(() => gfsSnapshot ? { rows: forecastCells(gfsSnapshot), freshness: gfsFreshness } : null, [gfsSnapshot, gfsFreshness]);
  const announcement = load.status === 'loading' ? c.announceLoading : load.status === 'ready'
    ? `${lastKnown ? `${offlineCopy(lang, 'last_known_notice', { time: formatTime(lastKnown.savedAt, lang) })} ` : c.announceVerified}${c.announceHealth(healthText(health, lang), views.map(view => `${feedTitle(view.feed.feed_id, lang)}: ${freshnessText(view, lang)}`))}`
    : c.announceFailed(load.status);
  const lastKnownDetail = lastKnown ? c.lastKnownDetail(offlineCopy(lang, 'last_known_notice', { time: formatTime(lastKnown.savedAt, lang) })) : '';

  return <div className="live-page">
    <header className="live-hero">
      <p className="eyebrow">{c.liveConditions}</p>
      <h1>{c.periodicallyUpdatedConditions}</h1>
      <p className="intro">{c.verifiedUsgsEarthquakeSummaries}</p>
      <aside className="live-authorities" aria-label={c.officialWarningAuthorities}>
        <p className="live-authorities-title"><span aria-hidden="true">▲</span> {c.officialForecastsWarnings}</p>
        <p>{c.followNepalSAuthoritative}</p>
        <ul>{LIVE_AUTHORITIES.map(authority => <li key={authority.name}><a href={authority.url} rel="noopener"><strong>{authority.name}</strong><span>{AUTHORITY_NAMES[lang][authority.name] ?? authority.name}</span></a></li>)}</ul>
      </aside>
    </header>

    <section className="live-health" aria-labelledby="live-health-heading" data-health={health} data-delivery={lastKnown ? 'last-known' : 'network'}>
      <div className="live-health-head">
        <h2 id="live-health-heading">{c.publicationWorkflowHealth}</h2>
        <button type="button" onClick={() => { setLoad({ status: 'loading' }); setAttempt(value => value + 1); }} disabled={load.status === 'loading'}>{c.checkNewerPublication}</button>
      </div>
      <p role="status" aria-live="polite" aria-atomic="true" className={lastKnown ? 'live-announcement sr-only' : 'live-announcement'}>{announcement}</p>
      {lastKnown && <p className="live-last-known" data-delivery="last-known"><strong><span aria-hidden="true">{OFFLINE_POLICY.last_known.glyph}</span> {OFFLINE_POLICY.last_known[lang]}</strong> {lastKnownDetail}</p>}
      {load.status === 'loading' && <p className="live-muted">{c.readingSameOriginIndex}</p>}
      {(load.status === 'error' || load.status === 'unavailable') && <div className="live-problem" role="alert"><p>{c.problem(load.status, load.message)}</p><button type="button" onClick={() => { setLoad({ status: 'loading' }); setAttempt(value => value + 1); }}>{c.tryAgain}</button></div>}
      {publication && <dl className="live-health-grid">
        <div><dt>{c.workflowHealth}</dt><dd><strong className="live-label" data-workflow-health={health}>{healthText(health, lang)}</strong>{lastKnown && <> <span className="live-label freshness-last-known">{OFFLINE_POLICY.last_known.glyph} {OFFLINE_POLICY.last_known[lang]}</span></>}</dd></div>
        <div><dt>{c.lastSuccessfulFetch}</dt><dd><Time value={publication.index.workflow.last_successful_fetch_at} lang={lang} /></dd></div>
        <div><dt>{c.lastAttempt}</dt><dd><Time value={publication.index.workflow.last_attempt_at} lang={lang} /> · {publication.index.workflow.status.replace('_', ' ').toUpperCase()}</dd></div>
        <div><dt>{c.publicationGenerated}</dt><dd><Time value={publication.index.generated_at} lang={lang} /></dd></div>
        <div><dt>{c.updateSchedule}</dt><dd>{c.noAutomaticScheduleActive}</dd></div>
        <div><dt>{c.workflowRun}</dt><dd>{publication.index.workflow.run_url ? <a href={publication.index.workflow.run_url}>{c.acquisitionWorkflowRun}</a> : <span className="unknown">{policy.copy[lang].unknown}</span>}</dd></div>
      </dl>}
      {publication?.index.workflow.status === 'not_configured' && <p className="live-callout">{c.notConfigured}</p>}
    </section>

    <div className="live-layout">
      <section className="live-bulletin" aria-labelledby="live-bulletin-heading">
        <div className="live-bulletin-head">
          <h2 id="live-bulletin-heading">{c.bulletinTitle}</h2>
        </div>
        <div lang={lang} className="live-bulletin-body" aria-live="polite">
          <p className="live-bulletin-notice">{bulletin.notice}</p>
          <p className="live-bulletin-meta">{load.status === 'loading' ? c.verifying : bulletin.publication}</p>
          {bulletin.sections.map(section => <article key={section.id} className="live-bulletin-section" data-section={section.id} aria-label={section.heading}>
            <header>
              <h3>{section.heading}</h3>
              <div className="live-labels">
                {section.purpose && <PurposeLabel purpose={section.purpose} lang={lang} />}
                {section.freshness ? <FreshnessLabel freshness={section.freshness} lastKnown={section.lastKnown ? lastKnown ?? { savedAt: null } : null} lang={lang} /> : <span className="live-label live-status">{section.status}</span>}
              </div>
            </header>
            {section.sentences.map(sentence => <p key={sentence}>{sentence}</p>)}
          </article>)}
          <p className="live-bulletin-authorities">{bulletin.authorities} {LIVE_AUTHORITIES.map((authority, index) => <span key={authority.name}>{index > 0 && ' · '}<a href={authority.url} rel="noopener">{authority.name}</a></span>)}</p>
        </div>
      </section>

      <section className="live-map-section" aria-labelledby="live-map-heading">
        <h2 id="live-map-heading">{c.map}</h2>
        {/* The skip link's accessible name stays English in both languages: keyboard tests reach it by this name after switching to Nepali. */}
        <a className="map-skip-link" href="#live-records">{c.skipMap}</a>
        <fieldset className="live-layer-controls">
          <legend>{c.layers}</legend>
          <label><input type="checkbox" checked={visible.earthquakes} onChange={event => setVisible(value => ({ ...value, earthquakes: event.target.checked }))} /> <span>{c.reportedEarthquakeEpicentres}</span> {usgs && <FreshnessLabel freshness={usgs.freshness} lastKnown={usgs.lastKnown} lang={lang} />}</label>
          <label><input type="checkbox" checked={visible.forecast} onChange={event => setVisible(value => ({ ...value, forecast: event.target.checked }))} /> <span>{c.model6HourPrecipitation}</span> {gfs && <FreshnessLabel freshness={gfs.freshness} lastKnown={gfs.lastKnown} lang={lang} />}</label>
        </fieldset>
        <LiveMap earthquakes={quakeLayer} forecast={forecastLayer} visible={visible} />
        <div className="live-legend" aria-label={c.mapLegend}>
          <p><span className="live-key live-key-quake" aria-hidden="true" /> {c.reportedEpicentreCircleSize}</p>
          <p>{c.forecastKey}</p>
          <ul>{FORECAST_CLASSES.map(item => <li key={item.label}><span className="live-swatch" style={{ background: item.color }} aria-hidden="true" />{lang === 'ne' ? item.ne : item.label}</li>)}<li><span className="live-swatch live-swatch-unknown" aria-hidden="true" />{c.dashedOutlineUnknownValue}</li></ul>
          <p className="live-muted">{c.squaresOutlineNative0}</p>
        </div>
      </section>
    </div>

    <section className="live-feeds" aria-labelledby="live-feeds-heading">
      <h2 id="live-feeds-heading">{c.feedStatusProvenance}</h2>
      <div className="live-feed-grid">
        {views.map(view => <FeedCard key={view.feed.feed_id} view={view} />)}
        <article className="live-feed-card" aria-label={c.airQualityAvailability} data-feed-state="disabled">
          <header><h3>{c.airQualityPm25}</h3><div className="live-labels"><PurposeLabel purpose="observation" lang={lang} /><span className="live-label live-status">{c.off}</span></div></header>
          <p>{c.airQuality(AIR_QUALITY_PUBLIC_ENABLED, AIR_QUALITY_STATUS)}</p>
          <p>AQI: <span className="unknown">{policy.copy[lang].unknown}</span> — {c.noCalculationStandardSufficiency}</p>
        </article>
        <article className="live-feed-card" aria-label={c.officialWarningsAvailability} data-feed-state="not-ingested">
          <header><h3>{c.officialWarnings}</h3><div className="live-labels"><PurposeLabel purpose="official_warning" lang={lang} /><span className="live-label live-status">{c.notIngested}</span></div></header>
          <p>{c.dhmNdrrmaBipadWarnings}</p>
          <p><a href="https://dhm.gov.np/mfd/" target="_blank" rel="noopener noreferrer">{c.dhmMeteorologicalForecastingDivision}</a></p>
        </article>
      </div>
      <p className="live-impacts">{c.impacts}</p>
    </section>

    <section id="live-records" className="live-records" aria-labelledby="live-records-heading" tabIndex={-1}>
      <h2 id="live-records-heading">{c.verifiedRecords}</h2>
      <p className="live-muted">{c.theseTablesCarryEvery}</p>
      <EarthquakeTable view={usgs} />
      <ForecastTable view={gfs} />
    </section>
  </div>;
}

function FeedCard({ view }: { view: FeedView }) {
  const [lang] = useLanguage();
  const c = useCopy(LIVE);
  const { feed, snapshot } = view;
  const title = feedTitle(feed.feed_id, lang);
  return <article className="live-feed-card" aria-label={c.feedStatus(title)} data-feed-state={view.state} data-freshness={view.lastKnown && view.freshness === 'FRESH' ? 'LAST_KNOWN' : view.freshness} data-delivery={view.lastKnown ? 'last-known' : 'network'}>
    <header><h3>{title}</h3><div className="live-labels"><PurposeLabel purpose={view.purpose} lang={lang} />{snapshot && <span className="live-label">{lang === 'ne' ? EVIDENCE_LABELS_NE[snapshot.evidence_type] : EVIDENCE_LABELS[snapshot.evidence_type]}</span>}<FreshnessLabel freshness={view.freshness} lastKnown={view.lastKnown} lang={lang} /></div></header>
    {view.lastKnown && <p className="live-last-known">{offlineCopy(lang, 'last_known_feed', { time: formatTime(view.lastKnown.savedAt, lang) })}</p>}
    <p>{feedReason(view, lang)}</p>
    <dl>
      <dt>{c.source}</dt><dd>{snapshot ? <a href={snapshot.source.url}>{snapshot.source.name}</a> : <span className="unknown">{policy.copy[lang].unknown}</span>}</dd>
      <dt>{view.purpose === 'forecast' ? c.issueTime : c.sourceGenerated}</dt><dd><Time value={snapshot?.source_issued_at ?? null} lang={lang} /></dd>
      <dt>{c.fetched}</dt><dd><Time value={snapshot?.fetched_at ?? null} lang={lang} /></dd>
      <dt>{c.freshUntil}</dt><dd><Time value={view.deadline} lang={lang} /></dd>
      <dt>{c.lastAttempt}</dt><dd><Time value={feed.last_attempt_at} lang={lang} /> · {feed.attempt_status.replace('_', ' ').toUpperCase()}{feed.error_code ? ` (${feed.error_code.replace('_', ' ')})` : ''}</dd>
      <dt>{c.lastSuccessfulFetch}</dt><dd><Time value={feed.last_successful_fetch_at} lang={lang} /></dd>
      {snapshot && <><dt>{c.licence}</dt><dd>{snapshot.source.license_url ? <a href={snapshot.source.license_url}>{snapshot.source.license}</a> : snapshot.source.license}</dd>
        <dt>{c.sourceRevision}</dt><dd>{snapshot.source.version ?? <span className="unknown">{policy.copy[lang].unknown}</span>}</dd></>}
    </dl>
    {snapshot && <><p className="live-attribution">{snapshot.source.attribution}</p>
      <details><summary>{c.limitations}</summary><ul>{snapshot.limitations.map(item => <li key={item}>{item}</li>)}</ul></details>
      <p className="live-links"><a href={feed.snapshot!.path}>{c.snapshotJson}</a> · <a href={feed.snapshot!.path.replace('/snapshot.json', '/manifest.json')}>{c.provenanceSourceReviewChecksums}</a></p></>}
  </article>;
}

function RecordMeta({ view, lang }: { view: FeedView; lang: Lang }) {
  return <><td><a href={view.snapshot!.source.url}>{view.feed.feed_id === 'usgs' ? 'USGS' : 'NOAA GFS'}</a></td><td><Time value={view.snapshot!.fetched_at} lang={lang} /></td><td><FreshnessLabel freshness={view.freshness} lastKnown={view.lastKnown} lang={lang} /></td></>;
}

function EarthquakeTable({ view }: { view: FeedView | undefined }) {
  const [lang] = useLanguage();
  const c = useCopy(LIVE);
  const snapshot = view?.snapshot ?? null;
  const rows = useMemo(() => snapshot ? earthquakeRows(snapshot) : [], [snapshot]);
  return <section className="live-table-section" aria-labelledby="live-quake-table" data-feed-state={view?.state ?? 'unavailable'}>
    <h3 id="live-quake-table"><PurposeLabel purpose="reported_event" lang={lang} /> {c.earthquakeSummaries}</h3>
    {!view?.snapshot ? <p className="live-callout">{view?.state === 'error' ? c.verificationFailed : c.noSnapshot}</p>
      : !rows.length ? <p className="live-callout">{c.validEmptySnapshotNo}</p>
        : <div className="live-table-scroll" role="region" aria-label={c.earthquakeSummariesTable} tabIndex={0}><table className="stack-mobile">
          <thead><tr><th scope="col">{c.event}</th><th scope="col">{c.magnitude}</th><th scope="col">{c.depthKm}</th><th scope="col">{c.observedOriginTime}</th><th scope="col">{c.sourceRevision}</th><th scope="col">{c.source}</th><th scope="col">{c.fetched}</th><th scope="col">{c.freshness}</th></tr></thead>
          <tbody>{rows.map(row => <tr key={row.id}>
            <th scope="row">{row.url ? <a href={row.url}>{row.label ?? row.id}</a> : row.label ?? row.id}</th>
            <td>{formatValue(row.magnitude, lang)} <span className="live-muted">{row.magnitudeType ?? ''}</span></td><td>{formatValue(row.depth, lang)}</td>
            <td><Time value={row.observedAt} lang={lang} /></td><td><Time value={row.revisedAt} lang={lang} /></td><RecordMeta view={view} lang={lang} />
          </tr>)}</tbody>
        </table></div>}
  </section>;
}

function ForecastTable({ view }: { view: FeedView | undefined }) {
  const [page, setPage] = useState(0);
  const [lang] = useLanguage();
  const c = useCopy(LIVE);
  const snapshot = view?.snapshot ?? null;
  const cells = useMemo(() => snapshot ? forecastCells(snapshot) : [], [snapshot]);
  const pages = Math.max(1, Math.ceil(cells.length / PAGE_SIZE));
  const current = Math.min(page, pages - 1);
  const visible = cells.slice(current * PAGE_SIZE, (current + 1) * PAGE_SIZE);
  const first = current * PAGE_SIZE + 1, last = current * PAGE_SIZE + visible.length;
  return <section className="live-table-section" aria-labelledby="live-forecast-table" data-feed-state={view?.state ?? 'unavailable'}>
    <h3 id="live-forecast-table"><PurposeLabel purpose="forecast" lang={lang} /> {c.modelPrecipitationGridCells}</h3>
    {!view?.snapshot ? <p className="live-callout">{view?.state === 'error' ? c.verificationFailed : c.noSnapshot}</p>
      : !cells.length ? <p className="live-callout">{c.validEmptySnapshotNo2}</p>
        : <>
          <div className="live-table-scroll" role="region" aria-label={c.modelPrecipitationGridTable} tabIndex={0}><table className="stack-mobile">
            <thead><tr><th scope="col">{c.cellCentreLonLat}</th><th scope="col">{c.n6HourAccumulationMm}</th><th scope="col">{c.issuedModelCycle}</th><th scope="col">{c.validWindow}</th><th scope="col">{c.source}</th><th scope="col">{c.fetched}</th><th scope="col">{c.freshness}</th></tr></thead>
            <tbody>{visible.map(cell => <tr key={cell.id}>
              <th scope="row">{cell.coordinates ? localDigits(`${cell.coordinates[0].toFixed(2)}°E, ${cell.coordinates[1].toFixed(2)}°N`, lang) : policy.copy[lang].unknown}</th>
              <td>{formatValue(cell.value, lang)}</td><td><Time value={cell.issuedAt} lang={lang} /></td><td><Time value={cell.validFrom} lang={lang} /> → <Time value={cell.validUntil} lang={lang} /></td><RecordMeta view={view} lang={lang} />
            </tr>)}</tbody>
          </table></div>
          <nav className="live-pagination" aria-label={c.forecastTablePages}>
            <button type="button" onClick={() => setPage(current - 1)} disabled={current === 0}>{c.previous}</button>
            {c.cells(localDigits(String(first), lang), localDigits(String(last), lang), localDigits(String(cells.length), lang))}
            <button type="button" onClick={() => setPage(current + 1)} disabled={current >= pages - 1}>{c.next}</button>
          </nav>
        </>}
  </section>;
}
