import { describe, expect, it } from 'vitest';
import manifest from '../../data/releases/nepal-terrain/1.0.0/manifest.json';
import index from '../../data/releases/nepal-terrain/1.0.0/tiles.json';
import { parseTerrainManifest, parseTerrainIndex, terrainPixel } from '../../packages/contracts/terrain';

describe('terrain contract', () => {
  it('validates the full immutable tile pyramid', () => {
    expect(Object.keys(parseTerrainIndex(index, parseTerrainManifest(manifest)))).toHaveLength(341);
  });
  it('rejects evidence, datum, coverage and identity changes', () => {
    for (const update of [
      (m: typeof manifest) => { m.metadata.status = 'VERIFIED_SOURCE'; },
      (m: typeof manifest) => { m.raster.vertical_datum = 'ellipsoid'; },
      (m: typeof manifest) => { m.metadata.spatial_coverage.bbox[0] = 79; },
      (m: typeof manifest) => { m.metadata.dataset_version = '2.0.0'; },
    ]) {
      const copy = structuredClone(manifest); update(copy);
      expect(() => parseTerrainManifest(copy)).toThrow();
    }
  });
  it('rejects a missing tile and an oversized tile', () => {
    const copy: Record<string, {sha256: string; byte_size: number}> = structuredClone(index);
    delete copy['5/23/13.png'];
    expect(() => parseTerrainIndex(copy, parseTerrainManifest(manifest))).toThrow();
    copy['5/23/13.png'] = { ...index['5/23/13.png'], byte_size: 9999999 };
    expect(() => parseTerrainIndex(copy, parseTerrainManifest(manifest))).toThrow();
  });
  it('resolves tile borders without wrapping and treats outside coverage as unknown', () => {
    expect(terrainPixel(85.324, 27.7172)?.key).toMatch(/^9\//);
    expect(terrainPixel(84.375 - 0.000001, 28)?.key).not.toBe(terrainPixel(84.375, 28)?.key);
    expect(terrainPixel(90, 28)).toBeNull();
    expect(terrainPixel(0, 0)).toBeNull();
    expect(terrainPixel(NaN, 28)).toBeNull();
  });
});
