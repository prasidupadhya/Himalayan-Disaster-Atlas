// Explicit synthetic two-feed harness for the /live/ page. Nothing here is published as conditions.
import { createHash } from 'node:crypto';
import reviews from '../../licensing/live-sources.json';
import type { LiveFeed, LiveIndex, LiveSnapshot } from '../../packages/contracts/live';
import { deliveryFixture, type DeliveryCase } from './live-publication';

export type FeedCase = DeliveryCase;
export const CYCLE = '2026-10-06T06:00:00Z';
export const FETCHED = '2026-10-06T12:00:00Z';
export const NORMAL_NOW = '2026-10-06T12:01:00Z';
export const STALE_NOW = '2026-10-06T18:00:00Z';
export const USGS_PATH = '/data/live-usgs/1.0.1/snapshot.json';
export const GFS_PATH = '/data/live-noaa-gfs/1.0.1/snapshot.json';

/** Test-only grid values: a source zero, a null (UNKNOWN) and positive model values. */
export const GFS_TEST_VALUES = [0, null, 0.05, 3.5, 12, 30] as const;

export function gfsSnapshot(state: FeedCase = 'normal'): LiveSnapshot {
  const source = reviews.sources['noaa-gfs'];
  const validFrom = '2026-10-07T00:00:00Z', validUntil = '2026-10-07T06:00:00Z';
  return {
    schema_version: '1.0.0', kind: 'live-snapshot', dataset_id: 'live-noaa-gfs', version: '1.0.1', id: 'snapshot', feed_id: 'noaa-gfs', is_fixture: false,
    source: { name: source.name, url: source.url, license: source.license, license_url: source.license_url, attribution: source.attribution, license_review: 'PERMITTED', is_official: false, version: 'TEST-ONLY-gfs-cycle', raw_sha256: '1'.repeat(64) },
    fetched_at: FETCHED, source_issued_at: CYCLE,
    freshness: { basis: 'source_issue', as_of: CYCLE, stale_after_seconds: 43200, expires_at: validUntil },
    crs: 'OGC:CRS84', evidence_type: 'modelled', product_type: 'forecast',
    records: state === 'empty' ? [] : GFS_TEST_VALUES.map((value, index) => ({
      id: `gfs-test-${index}`, label: null, coordinates: [84 + index * 0.25, 28] as [number, number], evidence_type: 'modelled' as const,
      observed_at: null, issued_at: CYCLE, valid_from: validFrom, valid_until: validUntil,
      measurements: [{ variable: 'precipitation_accumulation' as const, value, unit: 'mm' as const, qualifier: '6-hour accumulation; TEST ONLY synthetic value', evidence_type: 'modelled' as const }],
    })),
    assumptions: ['Explicit synthetic test harness, not a model output.'], limitations: ['Test values, not public conditions.'],
    unsupported_outputs: { physical_inundation: null, destroyed_buildings: null, casualties: null, repair_costs: null, hydropower_downtime: null, economic_loss: null },
    notice: 'Periodically updated conditions; not a real-time warning service.',
  };
}

function reference(snapshot: LiveSnapshot, raw: string, path: string) {
  return { dataset_id: snapshot.dataset_id, version: snapshot.version, id: snapshot.id, path, byte_size: Buffer.byteLength(raw), sha256: createHash('sha256').update(raw).digest('hex') };
}

/** Builds a consistent index for independent USGS and GFS feed states. */
export function conditionsFixture(usgsState: FeedCase = 'normal', gfsState: FeedCase = 'normal') {
  const usgs = deliveryFixture(usgsState);
  const gfs = gfsSnapshot(gfsState);
  const gfsRaw = JSON.stringify(gfs);
  const failed = gfsState === 'failed' || gfsState === 'unavailable';
  const gfsFeed: LiveFeed = {
    feed_id: 'noaa-gfs', enabled: true, attempt_status: failed ? 'failed' : 'success', last_attempt_at: failed ? NORMAL_NOW : FETCHED,
    last_successful_fetch_at: gfsState === 'unavailable' ? null : FETCHED, error_code: failed ? 'timeout' : null,
    snapshot: gfsState === 'unavailable' ? null : reference(gfs, gfsRaw, GFS_PATH),
  };
  const feeds = [usgs.index.feeds[0], gfsFeed];
  const attempts = feeds.map(feed => feed.last_attempt_at!).sort();
  const successes = feeds.map(feed => feed.last_successful_fetch_at).filter((value): value is string => value !== null).sort();
  const failures = feeds.filter(feed => feed.attempt_status === 'failed').length;
  const index: LiveIndex = {
    ...usgs.index, generated_at: NORMAL_NOW, feeds,
    workflow: { ...usgs.index.workflow, status: failures === 0 ? 'success' : failures === feeds.length ? 'failed' : 'partial', last_attempt_at: attempts.at(-1)!, last_successful_fetch_at: successes.at(-1) ?? null },
  };
  return { index, usgs: usgs.snapshot, usgsRaw: usgs.raw, gfs, gfsRaw };
}
