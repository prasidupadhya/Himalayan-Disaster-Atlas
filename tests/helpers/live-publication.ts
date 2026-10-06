// Explicit synthetic delivery harness. Nothing from this file is published as source readings.
import { createHash } from 'node:crypto';
import reviews from '../../licensing/live-sources.json';
import type { LiveIndex, LiveSnapshot } from '../../packages/contracts/live';
export type DeliveryCase = 'normal' | 'empty' | 'failed' | 'unavailable' | 'stale';
export function deliveryFixture(state: DeliveryCase = 'normal') {
  const source = reviews.sources.usgs;
  const snapshot: LiveSnapshot = {
    schema_version: '1.0.0', kind: 'live-snapshot', dataset_id: 'live-usgs', version: '1.0.1', id: 'snapshot', feed_id: 'usgs', is_fixture: false,
    source: { name: source.name, url: source.url, license: source.license, license_url: source.license_url, attribution: source.attribution, license_review: 'PERMITTED', is_official: false, version: 'TEST-ONLY-source-revision', raw_sha256: '0'.repeat(64) },
    fetched_at: '2026-10-06T12:00:00Z', source_issued_at: '2026-10-06T12:00:00Z',
    freshness: { as_of: '2026-10-06T12:00:00Z', basis: 'source_issue', stale_after_seconds: 21600, expires_at: null }, crs: 'OGC:CRS84', evidence_type: 'reported', product_type: 'reported_event',
    records: state === 'empty' ? [] : [{ id: 'test-only-event', label: 'TEST ONLY synthetic earthquake', coordinates: [85, 28], evidence_type: 'reported', observed_at: '2026-10-06T11:00:00Z', issued_at: null, valid_from: null, valid_until: null, source_revision_at: '2026-10-06T11:30:00Z', source_url: 'https://earthquake.usgs.gov/earthquakes/eventpage/test-only', source_network: 'us', measurements: [{ variable: 'magnitude', value: 0, unit: 'magnitude', qualifier: 'TEST ONLY magnitude type', evidence_type: 'reported' }, { variable: 'depth', value: null, unit: 'km', qualifier: null, evidence_type: 'reported' }] }],
    assumptions: ['Explicit synthetic test harness, not a provider observation.'], limitations: ['Test values, not public conditions.'], unsupported_outputs: { physical_inundation: null, destroyed_buildings: null, casualties: null, repair_costs: null, hydropower_downtime: null, economic_loss: null }, notice: 'Periodically updated conditions; not a real-time warning service.',
  };
  const raw = JSON.stringify(snapshot);
  const index: LiveIndex = { schema_version: '1.0.0', kind: 'live-index', is_fixture: false, generated_at: '2026-10-06T12:01:00Z', workflow: { status: state === 'unavailable' ? 'failed' : state === 'failed' ? 'failed' : 'success', last_attempt_at: state === 'failed' || state === 'unavailable' ? '2026-10-06T12:01:00Z' : snapshot.fetched_at, last_successful_fetch_at: state === 'unavailable' ? null : snapshot.fetched_at, run_url: null, schedule_seconds: 10800, stale_after_seconds: 21600 }, feeds: [{ feed_id: 'usgs', enabled: true, attempt_status: state === 'failed' || state === 'unavailable' ? 'failed' : 'success', last_attempt_at: state === 'failed' || state === 'unavailable' ? '2026-10-06T12:01:00Z' : snapshot.fetched_at, last_successful_fetch_at: state === 'unavailable' ? null : snapshot.fetched_at, error_code: state === 'failed' || state === 'unavailable' ? 'network_error' : null, snapshot: state === 'unavailable' ? null : { dataset_id: snapshot.dataset_id, version: snapshot.version, id: snapshot.id, path: '/data/live-usgs/1.0.1/snapshot.json', byte_size: Buffer.byteLength(raw), sha256: createHash('sha256').update(raw).digest('hex') } }, { feed_id: 'noaa-gfs', enabled: false, attempt_status: 'not_configured', last_attempt_at: null, last_successful_fetch_at: null, error_code: 'disabled', snapshot: null }] };
  return { index, snapshot, raw };
}
