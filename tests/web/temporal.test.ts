import { describe, expect, it } from 'vitest';
import index from '../../data/releases/atlas-time-index/1.0.0/index.json';
import { canCompare, dayInterval, observationOnDay, utcDay, validateTemporalIndex } from '../../packages/contracts/temporal';
import { ArtifactCache } from '../../apps/web/lib/temporal-cache';

describe('UTC temporal selection', () => {
  const parsed = validateTemporalIndex(index);
  const water = parsed.products.find(p => p.id === 'water')!;
  const climate = parsed.products.find(p => p.id === 'climate')!;
  it('selects actual acquisition days without using publication or retrieval dates', () => {
    expect(observationOnDay(water, '2025-04-01')?.id).toBe('2025-04-01');
    expect(observationOnDay(water, '2025-04-02')).toBeNull();
    expect(observationOnDay(water, '2026-09-08')).toBeNull();
    expect(observationOnDay(water, '2023-12-31')).toBeNull();
  });
  it('uses half-open whole monthly intervals, including leap days and year transitions', () => {
    expect(observationOnDay(climate, '2000-02-29')?.id).toBe('2000-02');
    expect(observationOnDay(climate, '2000-03-01')?.id).toBe('2000-03');
    expect(observationOnDay(climate, '2020-12-31')?.id).toBe('2020-12');
    expect(observationOnDay(climate, '2021-01-01')).toBeNull();
    expect(dayInterval('2020-12-31')[1]).toBe('2021-01-01T00:00:00.000Z');
    for (const date of ['2025-02-29', '2024-02-30', '2025-13-01', '2025-1-01', 'garbage']) expect(() => utcDay(date)).toThrow();
  });
  it('rejects duplicates, overlapping intervals, non-UTC timestamps and false monthly precision', () => {
    const duplicate = structuredClone(index); duplicate.products[0].observations[1] = duplicate.products[0].observations[0];
    expect(() => validateTemporalIndex(duplicate)).toThrow();
    const zone = structuredClone(index); zone.products[0].observations[0].start = '2024-04-19T00:00:00+05:45';
    expect(() => validateTemporalIndex(zone)).toThrow();
    const monthly = structuredClone(index); monthly.products[2].observations[0].end = '1991-01-02T00:00:00Z';
    expect(() => validateTemporalIndex(monthly)).toThrow();
  });
  it('only compares chronological compatible products and grids', () => {
    expect(canCompare(water.observations[0], water.observations[1])).toBe(true);
    expect(canCompare(water.observations[1], water.observations[0])).toBe(false);
    expect(canCompare(water.observations[0], water.observations[0])).toBe(false);
    expect(canCompare(water.observations[0], { ...water.observations[1], compatibility: 'different-grid-or-version' })).toBe(false);
    const satellite = parsed.products.find(p => p.id === 'satellite')!;
    expect(canCompare(satellite.observations[0], satellite.observations[1])).toBe(false);
  });
  it('keeps cached bytes bounded, isolated and least-recently-used', () => {
    const cache = new ArtifactCache(6);
    const bytes = new Uint8Array([1, 2, 3]); cache.set('a', bytes); bytes[0] = 9;
    cache.set('b', new Uint8Array([4, 5, 6]));
    const returned = cache.get('a')!; expect(returned[0]).toBe(1); returned[0] = 8;
    cache.set('c', new Uint8Array([7, 8, 9]));
    expect(cache.get('b')).toBeUndefined(); expect(cache.get('a')![0]).toBe(1);
    expect(cache.byteSize).toBe(6);
    cache.set('too-large', new Uint8Array(7)); expect(cache.byteSize).toBe(6);
  });
});
