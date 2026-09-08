import { describe, expect, it } from 'vitest';
import { buildEventPage, parseEventPage } from '../../packages/contracts/event-page';
import type { Dataset } from '../../packages/contracts';

function fixture(): Dataset {
  return {
    metadata: {
      schema_version: '1.0.0', dataset_id: 'nepal-disaster-events-2026', dataset_name: 'events', dataset_version: '1.0.0',
      source: 'BIPAD', source_url: 'https://bipadportal.gov.np/', license: 'source terms', license_url: null, attribution: 'BIPAD',
      observation_date: null, publication_date: null, retrieval_date: '2026-09-01T00:00:00Z', processing_date: '2026-09-01T01:00:00Z', processing_version: '1',
      method: 'archive', spatial_resolution: { value: null, unit: null }, temporal_resolution: 'event', spatial_coverage: { description: 'Nepal', bbox: [80, 26, 89, 31] },
      temporal_coverage: { start: '2026-01-01T00:00:00Z', end: '2026-12-31T23:59:59Z' }, crs: 'OGC:CRS84', status: 'HISTORICAL', evidence_type: 'historical',
      is_fixture: false, limitations: ['Archive values can be incomplete or revised.'], uncertainty: 'Source-reported', update_frequency: 'static', stale_after: null,
      artifact: { path: '/data/nepal-disaster-events-2026/1.0.0/features.geojson.gz', format: 'GeoJSON+gzip', sha256: '0'.repeat(64), byte_size: 1 },
    },
    collection: { type: 'FeatureCollection', features: [{
      type: 'Feature', id: 'bipad-123', geometry: { type: 'Point', coordinates: [85.2, 27.7] },
      properties: {
        dataset_id: 'nepal-disaster-events-2026', dataset_version: '1.0.0', name: 'Reported flood incident', is_fixture: false, value: null, unit: null,
        entity_type: 'disaster_event', source_id: '123', search_terms: ['Reported flood incident'], hazard_id: 'flood', hazard_name: 'Flood', hazard_type: 'natural',
        event_time: '2026-07-01T10:00:00Z', event_year: 2026, event_local_date: '2026-07-01', reported_time: '2026-07-01T12:00:00Z', verified: true, approved: true,
        source_label: 'BIPAD', data_source_name: null, loss_reference_id: null, reported_deaths: 0, reported_injured: null, reported_missing: null, reported_affected: 12,
        estimated_loss_npr: null, street_address: 'Example municipality', event_description: null,
      },
    }] },
  };
}

describe('event-page contract', () => {
  it('keeps zero distinct from UNKNOWN and traces every factual field to the source record', () => {
    const page = buildEventPage(fixture(), 'bipad-123');
    expect(page.impacts.find(item => item.kind === 'deaths')?.value).toBe(0);
    expect(page.impacts.find(item => item.kind === 'injured')?.value).toBeNull();
    expect(page.description.value).toBeNull();
    expect(page.location.source_path).toContain('#feature:bipad-123');
    expect(page.impacts.every(item => item.source_path === page.location.source_path)).toBe(true);
  });

  it('rejects missing impact categories rather than silently omitting unsupported fields', () => {
    const page = buildEventPage(fixture(), 'bipad-123');
    const invalid = structuredClone(page);
    invalid.impacts.pop();
    expect(() => parseEventPage(invalid)).toThrow();
  });
});
