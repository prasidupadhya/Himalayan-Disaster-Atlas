'use client';
import dynamic from 'next/dynamic';
import { useEffect, useMemo, useState, useSyncExternalStore } from 'react';
import { EVIDENCE_LABELS, LIVE_AUTHORITIES, workflowHealth } from '../../../../packages/contracts/live';
import { AIR_QUALITY_PUBLIC_ENABLED, AIR_QUALITY_STATUS } from '../../../../packages/contracts/live-air-quality';
import { UnavailableError } from '../../lib/datasets';
import { useLanguage, useT } from '../../lib/i18n';
import { loadLivePublication, watchLiveClock, type LastKnown, type LivePublication } from '../../lib/live';
import { buildBulletin, copy, earthquakeRows, FORECAST_CLASSES, feedReason, feedTitle, feedView, forecastCells, formatTime, formatValue, freshnessText, LIVE_CONDITIONS_POLICY as policy, localDigits, nextDeadline, offlineCopy, OFFLINE_POLICY, type FeedView, type Freshness, type Lang, type Purpose } from '../../lib/live-conditions';
import { AIR_QUALITY_STATUS_NE, AUTHORITY_NAMES, EVIDENCE_LABELS_NE } from './copy';

function MapUnavailable() {
  const t = useT();
  return <div className="live-map-shell" data-map-state="unavailable"><p className="live-map-status live-map-failure" role="status">{t('The map code is not available on this device (for example while offline). Every verified record remains listed in the tables below.', 'यस उपकरणमा नक्साको कोड उपलब्ध छैन (जस्तै अफलाइन हुँदा)। सबै प्रमाणित अभिलेखहरू तलका तालिकाहरूमा सूचीबद्ध नै छन्।')}</p></div>;
}
function MapLoading() {
  const t = useT();
  return <div className="live-map-shell"><p className="live-map-status" role="status">{t('Loading map…', 'नक्सा लोड हुँदैछ…')}</p></div>;
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
  const t = useT();
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
  const announcement = lang === 'ne'
    ? load.status === 'loading' ? 'प्रत्यक्ष प्रकाशन लोड र प्रमाणित गर्दै…' : publication ? `${lastKnown ? `${offlineCopy('ne', 'last_known_notice', { time: formatTime(lastKnown.savedAt, 'ne') })} ` : 'प्रकाशन प्रमाणित भयो। '}कार्यप्रवाह (workflow) को अवस्था: ${healthText(health, 'ne')}। ${views.map(view => `${feedTitle(view.feed.feed_id, 'ne')}: ${freshnessText(view, 'ne')}`).join('। ')}।` : `प्रत्यक्ष प्रकाशन ${load.status === 'error' ? 'प्रमाणित गर्न सकिएन (ERROR)' : 'उपलब्ध छैन (UNAVAILABLE)'}।`
    : load.status === 'loading' ? 'Loading and verifying the live publication…' : publication ? `${lastKnown ? `${offlineCopy('en', 'last_known_notice', { time: formatTime(lastKnown.savedAt) })} ` : 'Publication verified. '}Workflow health ${health}. ${views.map(view => `${feedTitle(view.feed.feed_id)}: ${freshnessText(view)}`).join('. ')}.` : `Live publication ${load.status.toUpperCase()}.`;
  const lastKnownDetail = lastKnown ? (lang === 'ne'
    ? `${offlineCopy('ne', 'last_known_notice', { time: formatTime(lastKnown.savedAt, 'ne') }).replace(/^पछिल्लो ज्ञात \(LAST KNOWN\) — /, '')} तलको स्रोत ताजापन अझै पनि मूल स्रोत, डाउनलोड र कार्यप्रवाहका समयबाट नै गणना गरिएको हो।`
    : `${offlineCopy('en', 'last_known_notice', { time: formatTime(lastKnown.savedAt) }).replace(/^LAST KNOWN — /, '')} Source freshness below is still computed from the original source, fetch and workflow times.`) : '';

  return <div className="live-page">
    <header className="live-hero">
      <p className="eyebrow">{t('Live conditions', 'प्रत्यक्ष अवस्था')}</p>
      <h1>{t('Periodically updated conditions', 'आवधिक रूपमा अद्यावधिक गरिएको अवस्था')}</h1>
      <p className="intro">{t('Verified USGS earthquake summaries and NOAA GFS model forecasts around Nepal, compiled from checksum-checked static snapshots. Each record keeps its source, times and freshness state. This is not a warning service.', 'नेपाल र वरपरका प्रमाणित USGS भूकम्प सारांश र NOAA GFS मोडेल पूर्वानुमान, चेकसम जाँच गरिएका स्थिर स्न्यापसटबाट संकलित। प्रत्येक अभिलेखमा त्यसको स्रोत, समय र ताजापनको अवस्था राखिएको छ। यो चेतावनी सेवा होइन।')}</p>
      <aside className="live-authorities" aria-label={t('Official warning authorities', 'आधिकारिक चेतावनी निकायहरू')}>
        <p className="live-authorities-title"><span aria-hidden="true">▲</span> {t('Official forecasts and warnings', 'आधिकारिक पूर्वानुमान र चेतावनी')}</p>
        <p>{t('Follow Nepal\'s authoritative sources. This atlas does not issue, relay or replace warnings.', 'नेपालका आधिकारिक स्रोतहरूलाई अनुसरण गर्नुहोस्। यो एटलसले चेतावनी जारी, प्रसारण वा प्रतिस्थापन गर्दैन।')}</p>
        <ul>{LIVE_AUTHORITIES.map(authority => <li key={authority.name}><a href={authority.url} rel="noopener"><strong>{authority.name}</strong><span>{AUTHORITY_NAMES[lang][authority.name] ?? authority.name}</span></a></li>)}</ul>
      </aside>
    </header>

    <section className="live-health" aria-labelledby="live-health-heading" data-health={health} data-delivery={lastKnown ? 'last-known' : 'network'}>
      <div className="live-health-head">
        <h2 id="live-health-heading">{t('Publication and workflow health', 'प्रकाशन र कार्यप्रवाह (workflow) को अवस्था')}</h2>
        <button type="button" onClick={() => { setLoad({ status: 'loading' }); setAttempt(value => value + 1); }} disabled={load.status === 'loading'}>{t('Check for a newer publication', 'नयाँ प्रकाशन छ कि जाँच्नुहोस्')}</button>
      </div>
      <p role="status" aria-live="polite" aria-atomic="true" className={lastKnown ? 'live-announcement sr-only' : 'live-announcement'}>{announcement}</p>
      {lastKnown && <p className="live-last-known" data-delivery="last-known"><strong><span aria-hidden="true">{OFFLINE_POLICY.last_known.glyph}</span> {OFFLINE_POLICY.last_known[lang]}</strong> {lastKnownDetail}</p>}
      {load.status === 'loading' && <p className="live-muted">{t('Reading the same-origin index, then verifying each snapshot\'s byte size and SHA-256 before display.', 'यही साइट (same-origin) को सूचकाङ्क पढ्दै, त्यसपछि देखाउनुअघि प्रत्येक स्न्यापसटको बाइट आकार र SHA-256 प्रमाणित गर्दै।')}</p>}
      {(load.status === 'error' || load.status === 'unavailable') && <div className="live-problem" role="alert"><p>{lang === 'ne'
        ? <><strong>प्रत्यक्ष प्रकाशन {load.status === 'error' ? 'प्रमाणित गर्न सकिएन' : 'उपलब्ध छैन'}।</strong> कुनै मापन देखाइएको छैन। {load.message}</>
        : <><strong>Live publication {load.status === 'error' ? 'could not be verified' : 'is unavailable'}.</strong> No readings are shown. {load.message}</>}</p><button type="button" onClick={() => { setLoad({ status: 'loading' }); setAttempt(value => value + 1); }}>{t('Try again', 'फेरि प्रयास गर्नुहोस्')}</button></div>}
      {publication && <dl className="live-health-grid">
        <div><dt>{t('Workflow health', 'कार्यप्रवाहको अवस्था')}</dt><dd><strong className="live-label" data-workflow-health={health}>{healthText(health, lang)}</strong>{lastKnown && <> <span className="live-label freshness-last-known">{OFFLINE_POLICY.last_known.glyph} {OFFLINE_POLICY.last_known[lang]}</span></>}</dd></div>
        <div><dt>{t('Last successful fetch', 'पछिल्लो सफल डाउनलोड')}</dt><dd><Time value={publication.index.workflow.last_successful_fetch_at} lang={lang} /></dd></div>
        <div><dt>{t('Last attempt', 'पछिल्लो प्रयास')}</dt><dd><Time value={publication.index.workflow.last_attempt_at} lang={lang} /> · {publication.index.workflow.status.replace('_', ' ').toUpperCase()}</dd></div>
        <div><dt>{t('Publication generated', 'प्रकाशन तयार भएको समय')}</dt><dd><Time value={publication.index.generated_at} lang={lang} /></dd></div>
        <div><dt>{t('Update schedule', 'अद्यावधिक तालिका')}</dt><dd>{t('No automatic schedule is active. Snapshots are published manually and reach this site through a verified static deployment.', 'कुनै स्वचालित तालिका सक्रिय छैन। स्न्यापसटहरू हातैले प्रकाशित गरिन्छन् र प्रमाणित स्थिर डिप्लोयमेन्ट (deployment) मार्फत यस साइटमा आइपुग्छन्।')}</dd></div>
        <div><dt>{t('Workflow run', 'कार्यप्रवाह रन (workflow run)')}</dt><dd>{publication.index.workflow.run_url ? <a href={publication.index.workflow.run_url}>{t('Acquisition workflow run', 'तथ्याङ्क संकलन कार्यप्रवाह रन')}</a> : <span className="unknown">{policy.copy[lang].unknown}</span>}</dd></div>
      </dl>}
      {publication?.index.workflow.status === 'not_configured' && <p className="live-callout">{t('No live publication is pinned to this deployment. No readings are shown and none are implied.', copy('ne', 'not_configured'))}</p>}
    </section>

    <div className="live-layout">
      <section className="live-bulletin" aria-labelledby="live-bulletin-heading">
        <div className="live-bulletin-head">
          <h2 id="live-bulletin-heading">{lang === 'en' ? 'Conditions bulletin' : 'अवस्था बुलेटिन'}</h2>
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
        <h2 id="live-map-heading">{t('Map', 'नक्सा')}</h2>
        {/* The skip link's accessible name stays English in both languages: keyboard tests reach it by this name after switching to Nepali. */}
        <a className="map-skip-link" href="#live-records">Skip map to record tables</a>
        <fieldset className="live-layer-controls">
          <legend>{t('Layers', 'तहहरू')}</legend>
          <label><input type="checkbox" checked={visible.earthquakes} onChange={event => setVisible(value => ({ ...value, earthquakes: event.target.checked }))} /> <span>{t('Reported earthquake epicentres', 'प्रतिवेदित भूकम्पका केन्द्रबिन्दु (epicentre)')}</span> {usgs && <FreshnessLabel freshness={usgs.freshness} lastKnown={usgs.lastKnown} lang={lang} />}</label>
          <label><input type="checkbox" checked={visible.forecast} onChange={event => setVisible(value => ({ ...value, forecast: event.target.checked }))} /> <span>{t('Model 6-hour precipitation (GFS grid cells)', 'मोडेलको ६ घण्टे वर्षा (GFS ग्रिड कक्ष)')}</span> {gfs && <FreshnessLabel freshness={gfs.freshness} lastKnown={gfs.lastKnown} lang={lang} />}</label>
        </fieldset>
        <LiveMap earthquakes={quakeLayer} forecast={forecastLayer} visible={visible} />
        <div className="live-legend" aria-label={t('Map legend', 'नक्साको संकेत-सूची')}>
          <p><span className="live-key live-key-quake" aria-hidden="true" /> {t('● REPORTED epicentre (circle size follows source magnitude; not a shaking or impact footprint)', '● प्रतिवेदित (REPORTED) केन्द्रबिन्दु (वृत्तको आकार स्रोतले दिएको म्याग्निच्युड अनुसार; यो कम्पन वा प्रभाव क्षेत्र होइन)')}</p>
          <p>{lang === 'ne' ? <><strong>◇ मोडेल पूर्वानुमान (MODEL FORECAST)</strong> — ६ घण्टे सञ्चित वर्षा, प्रदर्शनका लागि मात्र वर्ग (जोखिम सीमा होइनन्):</> : <><strong>◇ MODEL FORECAST</strong> — 6-hour accumulation, display bins (not hazard thresholds):</>}</p>
          <ul>{FORECAST_CLASSES.map(item => <li key={item.label}><span className="live-swatch" style={{ background: item.color }} aria-hidden="true" />{lang === 'ne' ? item.ne : item.label}</li>)}<li><span className="live-swatch live-swatch-unknown" aria-hidden="true" />{t('Dashed outline: UNKNOWN value', 'टुक्रे रेखाको किनारा: मान अज्ञात (UNKNOWN)')}</li></ul>
          <p className="live-muted">{t('Squares outline native 0.25° grid cells for display; values are not interpolated. Faded layers are STALE. Unavailable layers are not drawn.', 'वर्गहरूले प्रदर्शनका लागि मूल ०.२५° ग्रिड कक्षको किनारा देखाउँछन्; मानहरू अन्तर्वेशन (interpolate) गरिएका छैनन्। धमिला तहहरू पुरानो (STALE) हुन्। उपलब्ध नभएका तहहरू देखाइँदैनन्।')}</p>
        </div>
      </section>
    </div>

    <section className="live-feeds" aria-labelledby="live-feeds-heading">
      <h2 id="live-feeds-heading">{t('Feed status and provenance', 'फिडको अवस्था र स्रोत विवरण (provenance)')}</h2>
      <div className="live-feed-grid">
        {views.map(view => <FeedCard key={view.feed.feed_id} view={view} />)}
        <article className="live-feed-card" aria-label={t('Air quality availability', 'वायु गुणस्तर उपलब्धता')} data-feed-state="disabled">
          <header><h3>{t('Air quality — PM2.5', 'वायु गुणस्तर — PM2.5')}</h3><div className="live-labels"><PurposeLabel purpose="observation" lang={lang} /><span className="live-label live-status">{t('OFF', 'बन्द (OFF)')}</span></div></header>
          <p>{lang === 'ne'
            ? AIR_QUALITY_PUBLIC_ENABLED ? 'सक्रिय।' : `${AIR_QUALITY_STATUS_NE[AIR_QUALITY_STATUS] ?? AIR_QUALITY_STATUS}। सार्वजनिक संस्करणमा बन्द (OFF); प्रदायक इजाजतपत्रको अनुमति-सूची (allowlist) खाली भएकाले कुनै मापन माग वा लोड गरिँदैन।`
            : AIR_QUALITY_PUBLIC_ENABLED ? 'Enabled.' : `${AIR_QUALITY_STATUS}. OFF in the public build; the provider licence allowlist is empty, so no readings are requested or loaded.`}</p>
          <p>AQI: <span className="unknown">{policy.copy[lang].unknown}</span> — {t('no calculation standard and sufficiency rule have been reviewed.', 'कुनै गणना मापदण्ड र तथ्याङ्क पर्याप्तताको नियम समीक्षा गरिएको छैन।')}</p>
        </article>
        <article className="live-feed-card" aria-label={t('Official warnings availability', 'आधिकारिक चेतावनी उपलब्धता')} data-feed-state="not-ingested">
          <header><h3>{t('Official warnings', 'आधिकारिक चेतावनी')}</h3><div className="live-labels"><PurposeLabel purpose="official_warning" lang={lang} /><span className="live-label live-status">{t('NOT INGESTED', 'समावेश गरिएको छैन (NOT INGESTED)')}</span></div></header>
          <p>{t('DHM and NDRRMA/BIPAD warnings are not ingested. Their absence on this page does not mean there are no warnings.', 'DHM र NDRRMA/BIPAD का चेतावनीहरू यहाँ समावेश गरिएका छैनन्। यस पृष्ठमा चेतावनी नदेखिनुको अर्थ चेतावनी छैन भन्ने होइन।')}</p>
          <p><a href="https://dhm.gov.np/mfd/" target="_blank" rel="noopener noreferrer">{t('DHM Meteorological Forecasting Division — official weather forecasts (opens in a new tab)', 'DHM मौसम पूर्वानुमान महाशाखा — आधिकारिक मौसम पूर्वानुमान (नयाँ ट्याबमा खुल्छ)')}</a></p>
        </article>
      </div>
      <p className="live-impacts">{lang === 'ne' ? <><strong>क्षति, नोक्सानी, डुबान र हताहत: अज्ञात (UNKNOWN)।</strong> यस पृष्ठको कुनै पनि सामग्रीले यिनको अनुमान गर्दैन।</> : <><strong>Damage, loss, inundation and casualties: UNKNOWN.</strong> Nothing on this page estimates them.</>}</p>
    </section>

    <section id="live-records" className="live-records" aria-labelledby="live-records-heading" tabIndex={-1}>
      <h2 id="live-records-heading">{t('Verified records', 'प्रमाणित अभिलेखहरू')}</h2>
      <p className="live-muted">{t('These tables carry every mapped record and stay usable without the map. Times are UTC with Nepal Time (UTC+05:45).', 'यी तालिकाहरूमा नक्सामा देखाइएका सबै अभिलेख छन् र नक्सा बिना पनि प्रयोग गर्न सकिन्छ। समय UTC मा, साथमा नेपाली समय (UTC+05:45) सहित देखाइएको छ।')}</p>
      <EarthquakeTable view={usgs} />
      <ForecastTable view={gfs} />
    </section>
  </div>;
}

function FeedCard({ view }: { view: FeedView }) {
  const [lang] = useLanguage();
  const t = useT();
  const { feed, snapshot } = view;
  const title = feedTitle(feed.feed_id, lang);
  return <article className="live-feed-card" aria-label={t(`${title} status`, `${title} को अवस्था`)} data-feed-state={view.state} data-freshness={view.lastKnown && view.freshness === 'FRESH' ? 'LAST_KNOWN' : view.freshness} data-delivery={view.lastKnown ? 'last-known' : 'network'}>
    <header><h3>{title}</h3><div className="live-labels"><PurposeLabel purpose={view.purpose} lang={lang} />{snapshot && <span className="live-label">{lang === 'ne' ? EVIDENCE_LABELS_NE[snapshot.evidence_type] : EVIDENCE_LABELS[snapshot.evidence_type]}</span>}<FreshnessLabel freshness={view.freshness} lastKnown={view.lastKnown} lang={lang} /></div></header>
    {view.lastKnown && <p className="live-last-known">{offlineCopy(lang, 'last_known_feed', { time: formatTime(view.lastKnown.savedAt, lang) })}</p>}
    <p>{feedReason(view, lang)}</p>
    <dl>
      <dt>{t('Source', 'स्रोत')}</dt><dd>{snapshot ? <a href={snapshot.source.url}>{snapshot.source.name}</a> : <span className="unknown">{policy.copy[lang].unknown}</span>}</dd>
      <dt>{view.purpose === 'forecast' ? t('Issue time', 'जारी गरिएको समय') : t('Source generated', 'स्रोतले तयार पारेको समय')}</dt><dd><Time value={snapshot?.source_issued_at ?? null} lang={lang} /></dd>
      <dt>{t('fetched_at', 'डाउनलोड गरिएको समय (fetched_at)')}</dt><dd><Time value={snapshot?.fetched_at ?? null} lang={lang} /></dd>
      <dt>{t('Fresh until', 'ताजा मानिने अन्तिम समय')}</dt><dd><Time value={view.deadline} lang={lang} /></dd>
      <dt>{t('Last attempt', 'पछिल्लो प्रयास')}</dt><dd><Time value={feed.last_attempt_at} lang={lang} /> · {feed.attempt_status.replace('_', ' ').toUpperCase()}{feed.error_code ? ` (${feed.error_code.replace('_', ' ')})` : ''}</dd>
      <dt>{t('Last successful fetch', 'पछिल्लो सफल डाउनलोड')}</dt><dd><Time value={feed.last_successful_fetch_at} lang={lang} /></dd>
      {snapshot && <><dt>{t('Licence', 'इजाजतपत्र (licence)')}</dt><dd>{snapshot.source.license_url ? <a href={snapshot.source.license_url}>{snapshot.source.license}</a> : snapshot.source.license}</dd>
        <dt>{t('Source revision', 'स्रोत संशोधन (revision)')}</dt><dd>{snapshot.source.version ?? <span className="unknown">{policy.copy[lang].unknown}</span>}</dd></>}
    </dl>
    {snapshot && <><p className="live-attribution">{snapshot.source.attribution}</p>
      <details><summary>{t('Limitations', 'सीमाहरू')}</summary><ul>{snapshot.limitations.map(item => <li key={item}>{item}</li>)}</ul></details>
      <p className="live-links"><a href={feed.snapshot!.path}>{t('Snapshot JSON', 'स्न्यापसट JSON')}</a> · <a href={feed.snapshot!.path.replace('/snapshot.json', '/manifest.json')}>{t('Provenance, source review and checksums', 'स्रोत विवरण, स्रोत समीक्षा र चेकसम')}</a></p></>}
  </article>;
}

function RecordMeta({ view, lang }: { view: FeedView; lang: Lang }) {
  return <><td><a href={view.snapshot!.source.url}>{view.feed.feed_id === 'usgs' ? 'USGS' : 'NOAA GFS'}</a></td><td><Time value={view.snapshot!.fetched_at} lang={lang} /></td><td><FreshnessLabel freshness={view.freshness} lastKnown={view.lastKnown} lang={lang} /></td></>;
}

function EarthquakeTable({ view }: { view: FeedView | undefined }) {
  const [lang] = useLanguage();
  const t = useT();
  const snapshot = view?.snapshot ?? null;
  const rows = useMemo(() => snapshot ? earthquakeRows(snapshot) : [], [snapshot]);
  return <section className="live-table-section" aria-labelledby="live-quake-table" data-feed-state={view?.state ?? 'unavailable'}>
    <h3 id="live-quake-table"><PurposeLabel purpose="reported_event" lang={lang} /> {t('Earthquake summaries', 'भूकम्प सारांश')}</h3>
    {!view?.snapshot ? <p className="live-callout">{view?.state === 'error' ? t('UNAVAILABLE — verification failed; content withheld.', copy('ne', 'error')) : t('UNAVAILABLE — no verified snapshot.', copy('ne', 'unavailable'))}</p>
      : !rows.length ? <p className="live-callout">{t('Valid empty snapshot: no USGS-network summaries were retained for this query. This is not a failed fetch or an all-clear.', 'मान्य खाली स्न्यापसट: यस खोजमा USGS नेटवर्कको कुनै सारांश राखिएको छैन। यो असफल डाउनलोड होइन, सबै सुरक्षित छ भन्ने सूचना पनि होइन।')}</p>
        : <div className="live-table-scroll" role="region" aria-label={t('Earthquake summaries table', 'भूकम्प सारांश तालिका')} tabIndex={0}><table>
          <thead><tr><th scope="col">{t('Event', 'घटना')}</th><th scope="col">{t('Magnitude', 'म्याग्निच्युड')}</th><th scope="col">{t('Depth (km)', 'गहिराइ (km)')}</th><th scope="col">{t('Observed (origin time)', 'अवलोकन (उत्पत्ति समय)')}</th><th scope="col">{t('Source revision', 'स्रोत संशोधन (revision)')}</th><th scope="col">{t('Source', 'स्रोत')}</th><th scope="col">{t('fetched_at', 'डाउनलोड गरिएको समय (fetched_at)')}</th><th scope="col">{t('Freshness', 'ताजापन')}</th></tr></thead>
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
  const t = useT();
  const snapshot = view?.snapshot ?? null;
  const cells = useMemo(() => snapshot ? forecastCells(snapshot) : [], [snapshot]);
  const pages = Math.max(1, Math.ceil(cells.length / PAGE_SIZE));
  const current = Math.min(page, pages - 1);
  const visible = cells.slice(current * PAGE_SIZE, (current + 1) * PAGE_SIZE);
  const first = current * PAGE_SIZE + 1, last = current * PAGE_SIZE + visible.length;
  return <section className="live-table-section" aria-labelledby="live-forecast-table" data-feed-state={view?.state ?? 'unavailable'}>
    <h3 id="live-forecast-table"><PurposeLabel purpose="forecast" lang={lang} /> {t('Model precipitation grid cells', 'मोडेल वर्षाका ग्रिड कक्षहरू')}</h3>
    {!view?.snapshot ? <p className="live-callout">{view?.state === 'error' ? t('UNAVAILABLE — verification failed; content withheld.', copy('ne', 'error')) : t('UNAVAILABLE — no verified snapshot.', copy('ne', 'unavailable'))}</p>
      : !cells.length ? <p className="live-callout">{t('Valid empty snapshot: no grid cells. This is not a forecast of no precipitation.', 'मान्य खाली स्न्यापसट: कुनै ग्रिड कक्ष छैन। यसको अर्थ वर्षा नहुने पूर्वानुमान होइन।')}</p>
        : <>
          <div className="live-table-scroll" role="region" aria-label={t('Model precipitation grid table', 'मोडेल वर्षा ग्रिड तालिका')} tabIndex={0}><table>
            <thead><tr><th scope="col">{t('Cell centre (lon, lat)', 'कक्षको केन्द्र (देशान्तर, अक्षांश)')}</th><th scope="col">{t('6-hour accumulation (mm)', '६ घण्टे सञ्चित वर्षा (mm)')}</th><th scope="col">{t('Issued (model cycle)', 'जारी (मोडेल चक्र)')}</th><th scope="col">{t('Valid window', 'मान्य अवधि')}</th><th scope="col">{t('Source', 'स्रोत')}</th><th scope="col">{t('fetched_at', 'डाउनलोड गरिएको समय (fetched_at)')}</th><th scope="col">{t('Freshness', 'ताजापन')}</th></tr></thead>
            <tbody>{visible.map(cell => <tr key={cell.id}>
              <th scope="row">{cell.coordinates ? localDigits(`${cell.coordinates[0].toFixed(2)}°E, ${cell.coordinates[1].toFixed(2)}°N`, lang) : policy.copy[lang].unknown}</th>
              <td>{formatValue(cell.value, lang)}</td><td><Time value={cell.issuedAt} lang={lang} /></td><td><Time value={cell.validFrom} lang={lang} /> → <Time value={cell.validUntil} lang={lang} /></td><RecordMeta view={view} lang={lang} />
            </tr>)}</tbody>
          </table></div>
          <nav className="live-pagination" aria-label={t('Forecast table pages', 'पूर्वानुमान तालिकाका पृष्ठहरू')}>
            <button type="button" onClick={() => setPage(current - 1)} disabled={current === 0}>{t('Previous', 'अघिल्लो')}</button>
            {lang === 'ne' ? <span>कुल {localDigits(String(cells.length), lang)} मध्ये कक्ष {localDigits(String(first), lang)}–{localDigits(String(last), lang)}</span> : <span>Cells {first}–{last} of {cells.length}</span>}
            <button type="button" onClick={() => setPage(current + 1)} disabled={current >= pages - 1}>{t('Next', 'अर्को')}</button>
          </nav>
        </>}
  </section>;
}
