import { describe, expect, it } from 'vitest';
import { compareEntities, formatCompareValue, type CompareEntity } from '../../packages/contracts/compare';

const entity = (key: string, type: CompareEntity['type'], metrics: CompareEntity['metrics']): CompareEntity => ({
  key, label: key, source_id: key, type, compatibility: `${type}-family`, metrics,
  provenance: { dataset_id: 'd', dataset_version: '1.0.0', source: 'source', observation_date: null, temporal_coverage: { start: null, end: null }, spatial_resolution: 'UNKNOWN', evidence_type: 'observed', feature_date: null },
});

describe('scientific comparison compatibility', () => {
  it('blocks cross-type comparison even when units are identical', () => {
    const a = entity('a', 'glacier', [{ key: 'area', label: 'Area', value: 2, unit: 'km²', compatibility: 'glacier-area', basis: 'source' }]);
    const b = entity('b', 'district', [{ key: 'area', label: 'Area', value: 2, unit: 'km²', compatibility: 'district-area', basis: 'source' }]);
    expect(compareEntities(a, b).state).toBe('blocked');
  });

  it('preserves zero separately from UNKNOWN', () => {
    const a = entity('a', 'disaster_event', [
      { key: 'deaths', label: 'Deaths', value: 0, unit: 'count', compatibility: 'reported-deaths', basis: 'reported' },
      { key: 'affected', label: 'Affected', value: null, unit: 'count', compatibility: 'reported-affected', basis: 'reported' },
    ]);
    const b = entity('b', 'disaster_event', [
      { key: 'deaths', label: 'Deaths', value: 3, unit: 'count', compatibility: 'reported-deaths', basis: 'reported' },
      { key: 'affected', label: 'Affected', value: 20, unit: 'count', compatibility: 'reported-affected', basis: 'reported' },
    ]);
    const rows = compareEntities(a, b).rows;
    expect(rows.find(row => row.key === 'deaths')?.state).toBe('comparable');
    expect(formatCompareValue(rows[0].a, rows[0].unit)).toBe('0 count');
    expect(rows.find(row => row.key === 'affected')?.state).toBe('unavailable');
  });

  it('blocks incompatible metric definitions even when units match', () => {
    const a = entity('a', 'earthquake', [{ key: 'magnitude', label: 'Magnitude', value: 6, unit: 'Mw', compatibility: 'mw', basis: 'source' }]);
    const b = entity('b', 'earthquake', [{ key: 'magnitude', label: 'Magnitude', value: 6, unit: 'Mw', compatibility: 'mb', basis: 'source' }]);
    expect(compareEntities(a, b).rows[0].state).toBe('blocked');
  });
});
