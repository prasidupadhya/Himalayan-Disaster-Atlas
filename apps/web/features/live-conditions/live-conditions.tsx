'use client';
import dynamic from 'next/dynamic';
import { useEffect, useMemo, useState, useSyncExternalStore } from 'react';
import { EVIDENCE_LABELS, LIVE_AUTHORITIES, workflowHealth } from '../../../../packages/contracts/live';
import { AIR_QUALITY_PUBLIC_ENABLED, AIR_QUALITY_STATUS } from '../../../../packages/contracts/live-air-quality';
import { UnavailableError } from '../../lib/datasets';
import { loadLivePublication, watchLiveClock, type LastKnown, type LivePublication } from '../../lib/live';
import { buildBulletin, earthquakeRows, FEED_TITLES, FORECAST_CLASSES, feedView, forecastCells, formatTime, formatValue, freshnessText, LIVE_CONDITIONS_POLICY as policy, nextDeadline, offlineCopy, OFFLINE_POLICY, type FeedView, type Freshness, type Lang, type Purpose } from '../../lib/live-conditions';

function MapUnavailable() {
  return <div className="live-map-shell" data-map-state="unavailable"><p className="live-map-status live-map-failure" role="status">The map code is not available on this device (for example while offline). Every verified record remains listed in the tables below.</p></div>;
}
// A failed chunk load (e.g. offline before the map was ever cached) degrades to the tables instead of an error page.
const LiveMap = dynamic(() => import('./live-map').then(module => module.LiveMap).catch(() => MapUnavailable), { ssr: false, loading: () => <div className="live-map-shell"><p className="live-map-status" role="status">Loading map…</p></div> });
type Load = { status: 'loading' } | { status: 'ready'; data: LivePublication; loadedAt: string } | { status: 'unavailable' | 'error'; message: string };
const AUTHORITY_NAMES: Record<string, string> = { DHM: 'Department of Hydrology and Meteorology', NDRRMA: 'National Disaster Risk Reduction and Management Authority', BIPAD: 'BIPAD disaster information portal' };
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
function Time({ value }: { value: string | null }) {
  return value === null ? <span className="unknown">UNKNOWN</span> : <time dateTime={value}>{formatTime(value)}</time>;
}

export function LiveConditions() {
  const [load, setLoad] = useState<Load>({ status: 'loading' });
  const [attempt, setAttempt] = useState(0);
  const [now, setNow] = useState(0);
  const [lang, setLang] = useState<Lang>('en');
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
  const announcement = load.status === 'loading' ? 'Loading and verifying the live publication…' : publication ? `${lastKnown ? `${offlineCopy('en', 'last_known_notice', { time: formatTime(lastKnown.savedAt) })} ` : 'Publication verified. '}Workflow health ${health}. ${views.map(view => `${FEED_TITLES[view.feed.feed_id] ?? view.feed.feed_id}: ${freshnessText(view)}`).join('. ')}.` : `Live publication ${load.status.toUpperCase()}.`;

  return <div className="live-page">
    <header className="live-hero">
      <p className="eyebrow">Live conditions</p>
      <h1>Periodically updated conditions</h1>
      <p className="intro">Verified USGS earthquake summaries and NOAA GFS model forecasts around Nepal, compiled from checksum-checked static snapshots. Each record keeps its source, times and freshness state. This is not a warning service.</p>
      <aside className="live-authorities" aria-label="Official warning authorities">
        <p className="live-authorities-title"><span aria-hidden="true">▲</span> Official forecasts and warnings</p>
        <p>Follow Nepal&apos;s authoritative sources. This atlas does not issue, relay or replace warnings.</p>
        <ul>{LIVE_AUTHORITIES.map(authority => <li key={authority.name}><a href={authority.url} rel="noopener"><strong>{authority.name}</strong><span>{AUTHORITY_NAMES[authority.name] ?? authority.name}</span></a></li>)}</ul>
      </aside>
    </header>

    <section className="live-health" aria-labelledby="live-health-heading" data-health={health} data-delivery={lastKnown ? 'last-known' : 'network'}>
      <div className="live-health-head">
        <h2 id="live-health-heading">Publication and workflow health</h2>
        <button type="button" onClick={() => { setLoad({ status: 'loading' }); setAttempt(value => value + 1); }} disabled={load.status === 'loading'}>Check for a newer publication</button>
      </div>
      <p role="status" aria-live="polite" aria-atomic="true" className={lastKnown ? 'live-announcement sr-only' : 'live-announcement'}>{announcement}</p>
      {lastKnown && <p className="live-last-known" data-delivery="last-known"><strong><span aria-hidden="true">{OFFLINE_POLICY.last_known.glyph}</span> {OFFLINE_POLICY.last_known.en}</strong> {offlineCopy('en', 'last_known_notice', { time: formatTime(lastKnown.savedAt) }).replace(/^LAST KNOWN — /, '')} Source freshness below is still computed from the original source, fetch and workflow times.</p>}
      {load.status === 'loading' && <p className="live-muted">Reading the same-origin index, then verifying each snapshot&apos;s byte size and SHA-256 before display.</p>}
      {(load.status === 'error' || load.status === 'unavailable') && <div className="live-problem" role="alert"><p><strong>Live publication {load.status === 'error' ? 'could not be verified' : 'is unavailable'}.</strong> No readings are shown. {load.message}</p><button type="button" onClick={() => { setLoad({ status: 'loading' }); setAttempt(value => value + 1); }}>Try again</button></div>}
      {publication && <dl className="live-health-grid">
        <div><dt>Workflow health</dt><dd><strong className="live-label" data-workflow-health={health}>{health}</strong>{lastKnown && <> <span className="live-label freshness-last-known">{OFFLINE_POLICY.last_known.glyph} {OFFLINE_POLICY.last_known.en}</span></>}</dd></div>
        <div><dt>Last successful fetch</dt><dd><Time value={publication.index.workflow.last_successful_fetch_at} /></dd></div>
        <div><dt>Last attempt</dt><dd><Time value={publication.index.workflow.last_attempt_at} /> · {publication.index.workflow.status.replace('_', ' ').toUpperCase()}</dd></div>
        <div><dt>Publication generated</dt><dd><Time value={publication.index.generated_at} /></dd></div>
        <div><dt>Update schedule</dt><dd>No automatic schedule is active. Snapshots are published manually and reach this site through a verified static deployment.</dd></div>
        <div><dt>Workflow run</dt><dd>{publication.index.workflow.run_url ? <a href={publication.index.workflow.run_url}>Acquisition workflow run</a> : <span className="unknown">UNKNOWN</span>}</dd></div>
      </dl>}
      {publication?.index.workflow.status === 'not_configured' && <p className="live-callout">No live publication is pinned to this deployment. No readings are shown and none are implied.</p>}
    </section>

    <div className="live-layout">
      <section className="live-bulletin" aria-labelledby="live-bulletin-heading">
        <div className="live-bulletin-head">
          <h2 id="live-bulletin-heading">{lang === 'en' ? 'Conditions bulletin' : 'अवस्था बुलेटिन'}</h2>
          <div className="live-language" role="group" aria-label="Bulletin language / बुलेटिनको भाषा">
            <button type="button" aria-pressed={lang === 'en'} lang="en" onClick={() => setLang('en')}>English</button>
            <button type="button" aria-pressed={lang === 'ne'} lang="ne" onClick={() => setLang('ne')}>नेपाली</button>
          </div>
        </div>
        <div lang={lang} className="live-bulletin-body" aria-live="polite">
          <p className="live-bulletin-notice">{bulletin.notice}</p>
          <p className="live-bulletin-meta">{load.status === 'loading' ? (lang === 'en' ? 'Verifying publication…' : 'प्रकाशन प्रमाणित गर्दै…') : bulletin.publication}</p>
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
        <h2 id="live-map-heading">Map</h2>
        <a className="map-skip-link" href="#live-records">Skip map to record tables</a>
        <fieldset className="live-layer-controls">
          <legend>Layers</legend>
          <label><input type="checkbox" checked={visible.earthquakes} onChange={event => setVisible(value => ({ ...value, earthquakes: event.target.checked }))} /> <span>Reported earthquake epicentres</span> {usgs && <FreshnessLabel freshness={usgs.freshness} lastKnown={usgs.lastKnown} />}</label>
          <label><input type="checkbox" checked={visible.forecast} onChange={event => setVisible(value => ({ ...value, forecast: event.target.checked }))} /> <span>Model 6-hour precipitation (GFS grid cells)</span> {gfs && <FreshnessLabel freshness={gfs.freshness} lastKnown={gfs.lastKnown} />}</label>
        </fieldset>
        <LiveMap earthquakes={quakeLayer} forecast={forecastLayer} visible={visible} />
        <div className="live-legend" aria-label="Map legend">
          <p><span className="live-key live-key-quake" aria-hidden="true" /> ● REPORTED epicentre (circle size follows source magnitude; not a shaking or impact footprint)</p>
          <p><strong>◇ MODEL FORECAST</strong> — 6-hour accumulation, display bins (not hazard thresholds):</p>
          <ul>{FORECAST_CLASSES.map(item => <li key={item.label}><span className="live-swatch" style={{ background: item.color }} aria-hidden="true" />{item.label}</li>)}<li><span className="live-swatch live-swatch-unknown" aria-hidden="true" />Dashed outline: UNKNOWN value</li></ul>
          <p className="live-muted">Squares outline native 0.25° grid cells for display; values are not interpolated. Faded layers are STALE. Unavailable layers are not drawn.</p>
        </div>
      </section>
    </div>

    <section className="live-feeds" aria-labelledby="live-feeds-heading">
      <h2 id="live-feeds-heading">Feed status and provenance</h2>
      <div className="live-feed-grid">
        {views.map(view => <FeedCard key={view.feed.feed_id} view={view} />)}
        <article className="live-feed-card" aria-label="Air quality availability" data-feed-state="disabled">
          <header><h3>Air quality — PM2.5</h3><div className="live-labels"><PurposeLabel purpose="observation" /><span className="live-label live-status">OFF</span></div></header>
          <p>{AIR_QUALITY_PUBLIC_ENABLED ? 'Enabled.' : `${AIR_QUALITY_STATUS}. OFF in the public build; the provider licence allowlist is empty, so no readings are requested or loaded.`}</p>
          <p>AQI: <span className="unknown">UNKNOWN</span> — no calculation standard and sufficiency rule have been reviewed.</p>
        </article>
        <article className="live-feed-card" aria-label="Official warnings availability" data-feed-state="not-ingested">
          <header><h3>Official warnings</h3><div className="live-labels"><PurposeLabel purpose="official_warning" /><span className="live-label live-status">NOT INGESTED</span></div></header>
          <p>DHM and NDRRMA/BIPAD warnings are not ingested. Their absence on this page does not mean there are no warnings.</p>
          <p><a href="https://dhm.gov.np/mfd/" target="_blank" rel="noopener noreferrer">DHM Meteorological Forecasting Division — official weather forecasts (opens in a new tab)</a></p>
        </article>
      </div>
      <p className="live-impacts"><strong>Damage, loss, inundation and casualties: UNKNOWN.</strong> Nothing on this page estimates them.</p>
    </section>

    <section id="live-records" className="live-records" aria-labelledby="live-records-heading" tabIndex={-1}>
      <h2 id="live-records-heading">Verified records</h2>
      <p className="live-muted">These tables carry every mapped record and stay usable without the map. Times are UTC with Nepal Time (UTC+05:45).</p>
      <EarthquakeTable view={usgs} />
      <ForecastTable view={gfs} />
    </section>
  </div>;
}

function FeedCard({ view }: { view: FeedView }) {
  const { feed, snapshot } = view;
  return <article className="live-feed-card" aria-label={`${FEED_TITLES[feed.feed_id] ?? feed.feed_id} status`} data-feed-state={view.state} data-freshness={view.lastKnown && view.freshness === 'FRESH' ? 'LAST_KNOWN' : view.freshness} data-delivery={view.lastKnown ? 'last-known' : 'network'}>
    <header><h3>{FEED_TITLES[feed.feed_id] ?? feed.feed_id}</h3><div className="live-labels"><PurposeLabel purpose={view.purpose} />{snapshot && <span className="live-label">{EVIDENCE_LABELS[snapshot.evidence_type]}</span>}<FreshnessLabel freshness={view.freshness} lastKnown={view.lastKnown} /></div></header>
    {view.lastKnown && <p className="live-last-known">{offlineCopy('en', 'last_known_feed', { time: formatTime(view.lastKnown.savedAt) })}</p>}
    <p>{view.reason}</p>
    <dl>
      <dt>Source</dt><dd>{snapshot ? <a href={snapshot.source.url}>{snapshot.source.name}</a> : <span className="unknown">UNKNOWN</span>}</dd>
      <dt>{view.purpose === 'forecast' ? 'Issue time' : 'Source generated'}</dt><dd><Time value={snapshot?.source_issued_at ?? null} /></dd>
      <dt>fetched_at</dt><dd><Time value={snapshot?.fetched_at ?? null} /></dd>
      <dt>Fresh until</dt><dd><Time value={view.deadline} /></dd>
      <dt>Last attempt</dt><dd><Time value={feed.last_attempt_at} /> · {feed.attempt_status.replace('_', ' ').toUpperCase()}{feed.error_code ? ` (${feed.error_code.replace('_', ' ')})` : ''}</dd>
      <dt>Last successful fetch</dt><dd><Time value={feed.last_successful_fetch_at} /></dd>
      {snapshot && <><dt>Licence</dt><dd>{snapshot.source.license_url ? <a href={snapshot.source.license_url}>{snapshot.source.license}</a> : snapshot.source.license}</dd>
        <dt>Source revision</dt><dd>{snapshot.source.version ?? <span className="unknown">UNKNOWN</span>}</dd></>}
    </dl>
    {snapshot && <><p className="live-attribution">{snapshot.source.attribution}</p>
      <details><summary>Limitations</summary><ul>{snapshot.limitations.map(item => <li key={item}>{item}</li>)}</ul></details>
      <p className="live-links"><a href={feed.snapshot!.path}>Snapshot JSON</a> · <a href={feed.snapshot!.path.replace('/snapshot.json', '/manifest.json')}>Provenance, source review and checksums</a></p></>}
  </article>;
}

function RecordMeta({ view }: { view: FeedView }) {
  return <><td><a href={view.snapshot!.source.url}>{view.feed.feed_id === 'usgs' ? 'USGS' : 'NOAA GFS'}</a></td><td><Time value={view.snapshot!.fetched_at} /></td><td><FreshnessLabel freshness={view.freshness} lastKnown={view.lastKnown} /></td></>;
}

function EarthquakeTable({ view }: { view: FeedView | undefined }) {
  const snapshot = view?.snapshot ?? null;
  const rows = useMemo(() => snapshot ? earthquakeRows(snapshot) : [], [snapshot]);
  return <section className="live-table-section" aria-labelledby="live-quake-table" data-feed-state={view?.state ?? 'unavailable'}>
    <h3 id="live-quake-table"><PurposeLabel purpose="reported_event" /> Earthquake summaries</h3>
    {!view?.snapshot ? <p className="live-callout">{view?.state === 'error' ? 'UNAVAILABLE — verification failed; content withheld.' : 'UNAVAILABLE — no verified snapshot.'}</p>
      : !rows.length ? <p className="live-callout">Valid empty snapshot: no USGS-network summaries were retained for this query. This is not a failed fetch or an all-clear.</p>
        : <div className="live-table-scroll" role="region" aria-label="Earthquake summaries table" tabIndex={0}><table>
          <thead><tr><th scope="col">Event</th><th scope="col">Magnitude</th><th scope="col">Depth (km)</th><th scope="col">Observed (origin time)</th><th scope="col">Source revision</th><th scope="col">Source</th><th scope="col">fetched_at</th><th scope="col">Freshness</th></tr></thead>
          <tbody>{rows.map(row => <tr key={row.id}>
            <th scope="row">{row.url ? <a href={row.url}>{row.label ?? row.id}</a> : row.label ?? row.id}</th>
            <td>{formatValue(row.magnitude)} <span className="live-muted">{row.magnitudeType ?? ''}</span></td><td>{formatValue(row.depth)}</td>
            <td><Time value={row.observedAt} /></td><td><Time value={row.revisedAt} /></td><RecordMeta view={view} />
          </tr>)}</tbody>
        </table></div>}
  </section>;
}

function ForecastTable({ view }: { view: FeedView | undefined }) {
  const [page, setPage] = useState(0);
  const snapshot = view?.snapshot ?? null;
  const cells = useMemo(() => snapshot ? forecastCells(snapshot) : [], [snapshot]);
  const pages = Math.max(1, Math.ceil(cells.length / PAGE_SIZE));
  const current = Math.min(page, pages - 1);
  const visible = cells.slice(current * PAGE_SIZE, (current + 1) * PAGE_SIZE);
  return <section className="live-table-section" aria-labelledby="live-forecast-table" data-feed-state={view?.state ?? 'unavailable'}>
    <h3 id="live-forecast-table"><PurposeLabel purpose="forecast" /> Model precipitation grid cells</h3>
    {!view?.snapshot ? <p className="live-callout">{view?.state === 'error' ? 'UNAVAILABLE — verification failed; content withheld.' : 'UNAVAILABLE — no verified snapshot.'}</p>
      : !cells.length ? <p className="live-callout">Valid empty snapshot: no grid cells. This is not a forecast of no precipitation.</p>
        : <>
          <div className="live-table-scroll" role="region" aria-label="Model precipitation grid table" tabIndex={0}><table>
            <thead><tr><th scope="col">Cell centre (lon, lat)</th><th scope="col">6-hour accumulation (mm)</th><th scope="col">Issued (model cycle)</th><th scope="col">Valid window</th><th scope="col">Source</th><th scope="col">fetched_at</th><th scope="col">Freshness</th></tr></thead>
            <tbody>{visible.map(cell => <tr key={cell.id}>
              <th scope="row">{cell.coordinates ? `${cell.coordinates[0].toFixed(2)}°E, ${cell.coordinates[1].toFixed(2)}°N` : 'UNKNOWN'}</th>
              <td>{formatValue(cell.value)}</td><td><Time value={cell.issuedAt} /></td><td><Time value={cell.validFrom} /> → <Time value={cell.validUntil} /></td><RecordMeta view={view} />
            </tr>)}</tbody>
          </table></div>
          <nav className="live-pagination" aria-label="Forecast table pages">
            <button type="button" onClick={() => setPage(current - 1)} disabled={current === 0}>Previous</button>
            <span>Cells {current * PAGE_SIZE + 1}–{current * PAGE_SIZE + visible.length} of {cells.length}</span>
            <button type="button" onClick={() => setPage(current + 1)} disabled={current >= pages - 1}>Next</button>
          </nav>
        </>}
  </section>;
}
