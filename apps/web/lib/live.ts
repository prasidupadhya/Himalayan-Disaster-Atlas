import { assertReviewedLiveSource, assertLivePublicationAllowed, LIVE_INDEX_BYTES, LIVE_SNAPSHOT_BYTES, parseLiveIndex, parseLiveSnapshot, validateLivePair, type LiveFeed, type LiveIndex, type LiveReference, type LiveSnapshot } from '../../../packages/contracts/live';
import { readBounded, UnavailableError } from './datasets';

export interface VerifiedLiveFeed { index: LiveIndex; snapshot: LiveSnapshot | null }
type Reference = Pick<LiveReference, 'path' | 'sha256' | 'byte_size'>;
/** Set when the offline shell answered from a stored copy instead of the network. */
export interface LastKnown { savedAt: string | null }
export interface LiveDelivery { feed: LiveFeed; snapshot: LiveSnapshot | null; error: string | null; lastKnown?: LastKnown | null }
export interface LivePublication { index: LiveIndex; deliveries: LiveDelivery[]; lastKnown?: LastKnown | null }

/** Reads the offline shell's delivery headers. A copy marked last-known is never treated as freshly checked. */
export function lastKnownDelivery(response: Response): LastKnown | null {
  if (response.headers.get('x-atlas-delivery') !== 'last-known') return null;
  const savedAt = response.headers.get('x-atlas-cached-at');
  return { savedAt: savedAt !== null && Number.isFinite(Date.parse(savedAt)) ? new Date(Date.parse(savedAt)).toISOString() : null };
}

export async function loadLivePublication(signal?: AbortSignal): Promise<LivePublication> {
  const indexResponse = await fetch('/live/latest.json', { signal, cache: 'no-store', redirect: 'error', credentials: 'omit' });
  const lastKnown = lastKnownDelivery(indexResponse);
  const index = parseLiveIndex(await jsonBytes(indexResponse, LIVE_INDEX_BYTES));
  assertLivePublicationAllowed(index);
  const deliveries = await Promise.all(index.feeds.map(async (feed): Promise<LiveDelivery> => {
    if (!feed.enabled || !feed.snapshot) return { feed, snapshot: null, error: null, lastKnown };
    try {
      const response = await fetch(feed.snapshot.path, { signal, cache: 'no-store', redirect: 'error', credentials: 'omit' });
      const snapshot = parseLiveSnapshot(await jsonBytes(response, LIVE_SNAPSHOT_BYTES, feed.snapshot));
      validateLivePair(index, feed, snapshot); assertLivePublicationAllowed(index, snapshot); assertReviewedLiveSource(snapshot);
      return { feed, snapshot, error: null, lastKnown: lastKnownDelivery(response) ?? lastKnown };
    } catch (error) {
      if (signal?.aborted) throw error;
      return { feed, snapshot: null, error: error instanceof Error ? error.message : 'Snapshot unavailable.', lastKnown };
    }
  }));
  return { index, deliveries, lastKnown };
}

async function jsonBytes(response: Response, limit: number, reference?: Reference) {
  const bytes = await readBounded(response, limit);
  if (reference) {
    const hash = Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', bytes)), value => value.toString(16).padStart(2, '0')).join('');
    if (bytes.byteLength !== reference.byte_size || hash !== reference.sha256) throw new Error('Live artifact checksum mismatch');
  }
  return JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes));
}

export async function loadLiveFeed(reference: Reference | null, feedId: string, signal?: AbortSignal, allowFixture = false): Promise<VerifiedLiveFeed> {
  const path = reference?.path ?? '/live/latest.json';
  if (reference && !/^\/data\/[a-z0-9-]+\/\d+\.\d+\.\d+\/[a-z0-9-]+\.json$/.test(path)) throw new Error('Only versioned local live references are supported');
  const index = parseLiveIndex(await jsonBytes(await fetch(path, { signal, cache: 'no-store', redirect: 'error', credentials: 'omit' }), LIVE_INDEX_BYTES, reference ?? undefined));
  assertLivePublicationAllowed(index, undefined, allowFixture);
  const feed = index.feeds.find(item => item.feed_id === feedId);
  if (!feed) throw new UnavailableError('This feed is not configured.');
  if (!feed.enabled || !feed.snapshot) return { index, snapshot: null };
  const snapshot = parseLiveSnapshot(await jsonBytes(await fetch(feed.snapshot.path, { signal, redirect: 'error', credentials: 'omit' }), LIVE_SNAPSHOT_BYTES, feed.snapshot));
  validateLivePair(index, feed, snapshot);
  assertLivePublicationAllowed(index, snapshot, allowFixture);
  return { index, snapshot };
}

// The freshness clock is separate from acquisition. Timer throttling/tab suspension cannot keep a ready badge fresh.
export function watchLiveClock(update: (now: number) => void, deadline: string | null = null): () => void {
  const tick = () => update(Date.now());
  const timer = window.setInterval(tick, 1000);
  const delay = deadline === null ? 0 : Date.parse(deadline) - Date.now();
  const expiry = delay > 0 && delay <= 2_147_483_647 ? window.setTimeout(tick, delay) : null;
  window.addEventListener('pageshow', tick);
  document.addEventListener('visibilitychange', tick);
  tick();
  return () => { window.clearInterval(timer); if (expiry !== null) window.clearTimeout(expiry); window.removeEventListener('pageshow', tick); document.removeEventListener('visibilitychange', tick); };
}
