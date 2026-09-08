import { describe, expect, it } from 'vitest';
import manifest from '../../data/releases/phewa-water-change/1.0.0/manifest.json';
import { parseWaterManifest } from '../../packages/contracts/water-change';
describe('water release contracts', () => {
  it('accepts the published grid and rejects false area or date comparisons', () => {
    expect(parseWaterManifest(manifest).observations).toHaveLength(3);
    const invalid = structuredClone(manifest);
    invalid.comparisons[0].gain_km2 = 123;
    expect(() => parseWaterManifest(invalid)).toThrow();
    const reversed = structuredClone(manifest);
    reversed.comparisons[0].before = reversed.comparisons[0].after;
    expect(() => parseWaterManifest(reversed)).toThrow();
    const shifted = structuredClone(manifest);
    shifted.grid.transform[2] += 10;
    expect(() => parseWaterManifest(shifted)).toThrow();
  });
});
