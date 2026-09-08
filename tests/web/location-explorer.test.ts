import { describe, expect, it } from 'vitest';
import { distanceToGeometryKm, nearbyCandidates, pointInGeometry, validLocation, type LocationCandidate } from '../../apps/web/lib/location-explorer';

const base: Omit<LocationCandidate, 'key' | 'geometry'> = {
  category: 'river', label: 'Reach', dataset_id: 'rivers', dataset_version: '1.0.0', source_id: '1', source_date: '2026-01-01', detail_href: null, context: 'river',
};

describe('location explorer spatial rules', () => {
  it('validates coordinates and polygon containment including holes', () => {
    expect(validLocation(85, 28)).toBe(true);
    expect(validLocation(Number.NaN, 28)).toBe(false);
    const polygon = { type: 'Polygon' as const, coordinates: [[[84, 27], [86, 27], [86, 29], [84, 29], [84, 27]], [[84.8, 27.8], [85.2, 27.8], [85.2, 28.2], [84.8, 28.2], [84.8, 27.8]]] };
    expect(pointInGeometry([84.5, 28], polygon)).toBe(true);
    expect(pointInGeometry([85, 28], polygon)).toBe(false);
  });

  it('uses geometry distance instead of centroid distance and treats containment as zero', () => {
    const line = { type: 'LineString' as const, coordinates: [[84, 28], [86, 28]] };
    expect(distanceToGeometryKm([85, 28.01], line)).toBeLessThan(2);
    const polygon = { type: 'Polygon' as const, coordinates: [[[84, 27], [86, 27], [86, 29], [84, 29], [84, 27]]] };
    expect(distanceToGeometryKm([85, 28], polygon)).toBe(0);
  });

  it('applies inclusive thresholds, deterministic ties and caps', () => {
    const candidates: LocationCandidate[] = [
      { ...base, key: 'b', source_id: 'b', geometry: { type: 'Point', coordinates: [85.01, 28] } },
      { ...base, key: 'a', source_id: 'a', geometry: { type: 'Point', coordinates: [84.99, 28] } },
      { ...base, key: 'far', source_id: 'far', geometry: { type: 'Point', coordinates: [86, 28] } },
    ];
    const found = nearbyCandidates([85, 28], candidates, 'river', { radius_km: 5, limit: 1 });
    expect(found).toHaveLength(1);
    expect(found[0].key).toBe('a');
  });
});
