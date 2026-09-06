import { describe, expect, it } from 'vitest';
import { parseDataset, formatMeasurement, isStale } from '../../packages/contracts';
import metadata from '../../data/releases/foundation-sample/1.0.0/manifest.json';
import { readFileSync } from 'node:fs';
import cases from '../fixtures/invalid-cases.json';
const collection: unknown = JSON.parse(readFileSync('data/releases/foundation-sample/1.0.0/features.geojson', 'utf8'));
const fixture = () => parseDataset(structuredClone({ metadata, collection }));

describe('shared data contract', () => {
  it('preserves unknown separately from a real zero', () => {
    expect(fixture().collection.features[0].properties.value).toBeNull();
    expect(formatMeasurement(null, 'm')).toBe('UNKNOWN');
    expect(formatMeasurement(0, 'm')).toBe('0 m');
  });
  for (const test of cases) it(`rejects ${test.name}`, () => {
    const input = structuredClone({ metadata, collection });
    // JSON paths deliberately mutate values outside the static type contract.
    let target: Record<string | number, unknown> = input;
    for (const key of test.path.slice(0, -1)) target = target[key] as typeof target;
    target[test.path.at(-1)!] = test.value;
    expect(() => parseDataset(input)).toThrow();
  });
  it('rejects nonfinite measurements', () => {
    for (const value of [NaN, Infinity, -Infinity]) {
      const data = fixture(); data.collection.features[0].properties.value = value;
      expect(() => parseDataset(data)).toThrow();
    }
  });
  it('rejects duplicate IDs and missing metadata', () => {
    const data = fixture();
    data.collection.features.push(data.collection.features[0]);
    expect(() => parseDataset(data)).toThrow(/Duplicate/);
    expect(() => parseDataset({ metadata: {}, collection })).toThrow();
  });
  it('accepts empty feature collections without manufacturing data', () => {
    expect(parseDataset({ metadata, collection: { type: 'FeatureCollection', features: [] } }).collection.features).toEqual([]);
  });
  it('uses explicit stale deadlines; static fixtures do not pretend to be live', () => {
    const m = fixture().metadata;
    expect(isStale(m, Date.parse('2100-01-01'))).toBe(false);
    m.stale_after = '2026-09-07T00:00:00Z';
    expect(isStale(m, Date.parse('2026-09-06T23:59:59Z'))).toBe(false);
    expect(isStale(m, Date.parse(m.stale_after))).toBe(true);
  });
});
