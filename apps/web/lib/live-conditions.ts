import policy from '../../../packages/contracts/live-conditions-policy.json';
import offlinePolicy from '../../../packages/contracts/offline-shell-policy.json';
import { liveFreshness, type LiveFeed, type LiveSnapshot } from '../../../packages/contracts/live';
import type { LastKnown, LiveDelivery, LivePublication } from './live';

// Presentation only: every value shown here comes from a verified snapshot or is UNKNOWN.
export const LIVE_CONDITIONS_POLICY = policy;
export const OFFLINE_POLICY = offlinePolicy;
export type Lang = 'en' | 'ne';
export type Freshness = keyof typeof policy.freshness;
export type Purpose = keyof typeof policy.purposes;
export type CopyKey = keyof typeof policy.copy.en;
export type FeedState = 'ready' | 'empty' | 'stale' | 'unavailable' | 'error';

const NEPAL_OFFSET_MINUTES = 345;
const NE_DIGITS = '०१२३४५६७८९';
const FEED_PURPOSE: Record<string, Purpose> = { usgs: 'reported_event', 'noaa-gfs': 'forecast', openaq: 'observation' };
export const FEED_TITLES: Record<string, string> = { usgs: 'USGS earthquake summaries', 'noaa-gfs': 'NOAA GFS precipitation forecast', openaq: 'OpenAQ PM2.5' };

export function localDigits(text: string, lang: Lang) {
  return lang === 'ne' ? text.replace(/[0-9]/g, digit => NE_DIGITS[Number(digit)]) : text;
}

const fill = (text: string, lang: Lang, values: Record<string, string>) => text.replace(/\{(\w+)\}/g, (_, name: string) => values[name] ?? policy.copy[lang].unknown);
export function copy(lang: Lang, key: CopyKey, values: Record<string, string> = {}) {
  return fill(policy.copy[lang][key], lang, values);
}
export function offlineCopy(lang: Lang, key: keyof typeof offlinePolicy.copy.en, values: Record<string, string> = {}) {
  return fill(offlinePolicy.copy[lang][key], lang, values);
}
/** UTC with Nepal Time (UTC+05:45) alongside. Null stays UNKNOWN; no time is substituted. */
export function formatTime(iso: string | null, lang: Lang = 'en') {
  if (iso === null) return policy.copy[lang].unknown;
  const instant = Date.parse(iso);
  if (!Number.isFinite(instant)) return policy.copy[lang].unknown;
  const utc = new Date(instant).toISOString();
  const npt = new Date(instant + NEPAL_OFFSET_MINUTES * 60_000).toISOString();
  const local = utc.slice(0, 10) === npt.slice(0, 10) ? npt.slice(11, 16) : `${npt.slice(0, 10)} ${npt.slice(11, 16)}`;
  return localDigits(`${utc.slice(0, 10)} ${utc.slice(11, 16)} UTC (${local} ${policy.copy[lang].npt})`, lang);
}

/** Source numbers are shown as published; only display rounding to 0.01 is applied to model summaries. */
export function formatValue(value: number | null, lang: Lang = 'en', round = false) {
  if (value === null) return policy.copy[lang].unknown;
  if (!round) return localDigits(String(value), lang);
  const rounded = Math.round(value * 100) / 100;
  // A source zero stays 0; a positive amount that rounds to zero is shown as <0.01, never as 0.
  return localDigits(rounded === 0 && value > 0 ? '<0.01' : String(rounded), lang);
}

export interface FeedView {
  feed: LiveFeed; snapshot: LiveSnapshot | null; error: string | null;
  purpose: Purpose; freshness: Freshness; state: FeedState; reason: string; deadline: string | null;
  /** Non-null when the copy came from this device's offline store or cannot be rechecked while offline. */
  lastKnown: LastKnown | null;
}

export function feedPurpose(feed: LiveFeed, snapshot: LiveSnapshot | null): Purpose {
  const product = snapshot?.product_type;
  return product && product in policy.purposes ? product as Purpose : FEED_PURPOSE[feed.feed_id] ?? 'observation';
}

export function feedView(publication: LivePublication, delivery: LiveDelivery, now: number, offline: LastKnown | null = null): FeedView {
  const purpose = feedPurpose(delivery.feed, delivery.snapshot);
  const lastKnown = delivery.lastKnown ?? publication.lastKnown ?? offline;
  if (delivery.error) return { ...delivery, lastKnown: null, purpose, freshness: 'UNAVAILABLE', state: 'error', reason: `Verification failed: ${delivery.error}. Content is withheld.`, deadline: null };
  const result = liveFreshness(publication.index, delivery.feed, delivery.snapshot, now);
  const freshness: Freshness = result.status === 'ready' || result.status === 'empty' ? 'FRESH' : result.status === 'stale' ? 'STALE' : 'UNAVAILABLE';
  const reason = !delivery.feed.enabled ? 'Feed is not configured in this publication.' : result.reason;
  return { ...delivery, lastKnown: delivery.snapshot ? lastKnown : null, purpose, freshness, state: result.status, reason, deadline: result.deadline };
}

/** Text label for a feed: an offline copy is LAST KNOWN and never FRESH; STALE/UNAVAILABLE stay visible. */
export function freshnessText(view: Pick<FeedView, 'freshness' | 'lastKnown'>, lang: Lang = 'en') {
  const base = policy.freshness[view.freshness][lang];
  if (!view.lastKnown) return base;
  return view.freshness === 'FRESH' ? offlinePolicy.last_known[lang] : `${offlinePolicy.last_known[lang]} · ${base}`;
}

/** Earliest future source or workflow deadline, so freshness changes without a new fetch. */
export function nextDeadline(publication: LivePublication | null, views: FeedView[], now: number) {
  if (!publication) return null;
  const workflow = publication.index.workflow.last_attempt_at === null ? null : Date.parse(publication.index.workflow.last_attempt_at) + publication.index.workflow.stale_after_seconds * 1000;
  const candidates = [...views.map(view => view.deadline === null ? null : Date.parse(view.deadline)), workflow].filter((value): value is number => value !== null && value > now);
  return candidates.length ? new Date(Math.min(...candidates)).toISOString() : null;
}

export interface EarthquakeRow {
  id: string; label: string | null; url: string | null; coordinates: [number, number] | null;
  magnitude: number | null; magnitudeType: string | null; depth: number | null; observedAt: string | null; revisedAt: string | null;
}
export function earthquakeRows(snapshot: LiveSnapshot): EarthquakeRow[] {
  return snapshot.records.map(record => {
    const magnitude = record.measurements.find(m => m.variable === 'magnitude');
    const depth = record.measurements.find(m => m.variable === 'depth');
    return { id: record.id, label: record.label, url: record.source_url ?? null, coordinates: record.coordinates, magnitude: magnitude?.value ?? null, magnitudeType: magnitude?.qualifier ?? null, depth: depth?.value ?? null, observedAt: record.observed_at, revisedAt: record.source_revision_at ?? null };
  }).sort((a, b) => (b.observedAt === null ? -Infinity : Date.parse(b.observedAt)) - (a.observedAt === null ? -Infinity : Date.parse(a.observedAt)));
}

export interface ForecastCell { id: string; coordinates: [number, number] | null; value: number | null; issuedAt: string | null; validFrom: string | null; validUntil: string | null }
export function forecastCells(snapshot: LiveSnapshot): ForecastCell[] {
  return snapshot.records.map(record => ({ id: record.id, coordinates: record.coordinates, value: record.measurements.find(m => m.variable === 'precipitation_accumulation')?.value ?? null, issuedAt: record.issued_at, validFrom: record.valid_from, validUntil: record.valid_until }));
}
const shared = (values: Array<string | null>) => values.length && values.every(value => value === values[0]) ? values[0] : null;
export function forecastSummary(snapshot: LiveSnapshot) {
  const cells = forecastCells(snapshot);
  const known = cells.map(cell => cell.value).filter((value): value is number => value !== null);
  return {
    total: cells.length, known: known.length, unknown: cells.length - known.length,
    min: known.length ? Math.min(...known) : null, max: known.length ? Math.max(...known) : null,
    issuedAt: shared(cells.map(cell => cell.issuedAt)) ?? snapshot.source_issued_at,
    validFrom: shared(cells.map(cell => cell.validFrom)), validUntil: shared(cells.map(cell => cell.validUntil)),
  };
}

export interface BulletinSection { id: string; heading: string; purpose: Purpose | null; status: string; freshness: Freshness | null; lastKnown: boolean; sentences: string[] }
export interface Bulletin { lang: Lang; title: string; notice: string; authorities: string; publication: string; sections: BulletinSection[] }

function statusSentences(view: FeedView | undefined, lang: Lang, content: () => string[]) {
  if (!view) return [copy(lang, 'unavailable')];
  if (view.state === 'error') return [copy(lang, 'error')];
  if (view.state === 'unavailable' || !view.snapshot) return [copy(lang, 'unavailable')];
  const offline = view.lastKnown ? [offlineCopy(lang, 'last_known_feed', { time: formatTime(view.lastKnown.savedAt, lang) })] : [];
  return [...offline, ...(view.state === 'stale' ? [copy(lang, 'stale_prefix')] : []), ...content()];
}
const sectionStatus = (view: FeedView | undefined, lang: Lang) => view ? freshnessText(view, lang) : policy.freshness.UNAVAILABLE[lang];

export function buildBulletin(publication: LivePublication | null, views: FeedView[], lang: Lang, lastKnown: LastKnown | null = null): Bulletin {
  const usgs = views.find(view => view.feed.feed_id === 'usgs');
  const gfs = views.find(view => view.feed.feed_id === 'noaa-gfs');
  const workflow = publication?.index.workflow;
  const earthquakes = statusSentences(usgs, lang, () => {
    const rows = earthquakeRows(usgs!.snapshot!);
    if (!rows.length) return [copy(lang, 'eq_empty')];
    const latest = rows[0];
    return [
      copy(lang, 'eq_ready', { n: localDigits(String(rows.length), lang) }),
      copy(lang, 'eq_recent', { mag: formatValue(latest.magnitude, lang), type: latest.magnitudeType ?? policy.copy[lang].unknown, place: latest.label ?? policy.copy[lang].unknown, time: formatTime(latest.observedAt, lang) }),
    ];
  });
  const forecast = statusSentences(gfs, lang, () => {
    const summary = forecastSummary(gfs!.snapshot!);
    if (!summary.total) return [copy(lang, 'fc_empty'), copy(lang, 'fc_caveat')];
    return [
      copy(lang, 'fc_ready', { from: formatTime(summary.validFrom, lang), until: formatTime(summary.validUntil, lang), issued: formatTime(summary.issuedAt, lang) }),
      copy(lang, 'fc_range', { min: formatValue(summary.min, lang, true), max: formatValue(summary.max, lang, true), known: localDigits(String(summary.known), lang), total: localDigits(String(summary.total), lang), unknown: localDigits(String(summary.unknown), lang) }),
      copy(lang, 'fc_caveat'),
    ];
  });
  return {
    lang,
    title: copy(lang, 'title'),
    notice: copy(lang, 'notice'),
    authorities: copy(lang, 'authorities'),
    publication: [
      ...(publication && lastKnown ? [offlineCopy(lang, 'last_known_notice', { time: formatTime(lastKnown.savedAt, lang) })] : []),
      !publication ? copy(lang, 'publication_unavailable') : workflow!.status === 'not_configured' ? copy(lang, 'not_configured') : copy(lang, 'published', { time: formatTime(publication.index.generated_at, lang) }),
    ].join(' '),
    sections: [
      { id: 'earthquakes', heading: copy(lang, 'eq_heading'), purpose: 'reported_event', status: sectionStatus(usgs, lang), freshness: usgs?.freshness ?? 'UNAVAILABLE', lastKnown: !!usgs?.lastKnown, sentences: earthquakes },
      { id: 'forecast', heading: copy(lang, 'fc_heading'), purpose: 'forecast', status: sectionStatus(gfs, lang), freshness: gfs?.freshness ?? 'UNAVAILABLE', lastKnown: !!gfs?.lastKnown, sentences: forecast },
      { id: 'air-quality', heading: copy(lang, 'aq_heading'), purpose: 'observation', status: copy(lang, 'status_off'), freshness: null, lastKnown: false, sentences: [copy(lang, 'aq_off')] },
      { id: 'warnings', heading: copy(lang, 'warn_heading'), purpose: 'official_warning', status: copy(lang, 'status_not_ingested'), freshness: null, lastKnown: false, sentences: [copy(lang, 'warn_text')] },
      { id: 'impacts', heading: copy(lang, 'impact_heading'), purpose: null, status: copy(lang, 'status_unknown'), freshness: null, lastKnown: false, sentences: [copy(lang, 'impact_text')] },
    ],
  };
}

// Sequential display classes for model accumulation. Breaks are presentation bins, not hazard thresholds.
export const FORECAST_CLASSES = [
  { min: 0, label: '0 to < 0.1 mm', color: '#e9f2f1' },
  { min: 0.1, label: '0.1 to < 1 mm', color: '#bcdcdf' },
  { min: 1, label: '1 to < 5 mm', color: '#7fbfcb' },
  { min: 5, label: '5 to < 10 mm', color: '#4797b2' },
  { min: 10, label: '10 to < 25 mm', color: '#2a6b96' },
  { min: 25, label: '25 mm or more', color: '#22406f' },
] as const;

/** Display-only cell outline around a native 0.25° grid centre; values are not interpolated. */
export function gridCellPolygon([lon, lat]: [number, number], size = 0.25): [number, number][][] {
  const h = size / 2;
  return [[[lon - h, lat - h], [lon + h, lat - h], [lon + h, lat + h], [lon - h, lat + h], [lon - h, lat - h]]];
}
