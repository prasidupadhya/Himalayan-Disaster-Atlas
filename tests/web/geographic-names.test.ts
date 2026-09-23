import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { gunzipSync } from 'node:zlib';
import { parseDataset } from '../../packages/contracts';
import { administrativeName, administrativeNameReview } from '../../apps/web/lib/administrative-names';
describe('reviewed names preserve source identities', () => {
  it('keeps source names while correcting reviewed administrative display names', () => {
    const metadata = JSON.parse(readFileSync('data/releases/nepal-admin-local-levels/2.0.1/manifest.json', 'utf8'));
    const collection = JSON.parse(gunzipSync(readFileSync('data/releases/nepal-admin-local-levels/2.0.1/features.geojson.gz')).toString());
    const dataset = parseDataset({ metadata, collection });
    const p = dataset.collection.features.find(f => f.properties.pcode === 'NP0438401')!.properties;
    expect(p.name).toBe('Ngisyang');
    expect(administrativeName(p)).toBe('Manang Ngisyang');
    expect(administrativeNameReview(p)).toContain('manangngisyangmun.gov.np');
  });
  it('named stream points do not invent HydroRIVERS links', () => {
    const metadata = JSON.parse(readFileSync('data/releases/nepal-river-names/1.0.0/manifest.json', 'utf8'));
    const collection = JSON.parse(gunzipSync(readFileSync('data/releases/nepal-river-names/1.0.0/features.geojson.gz')).toString());
    const dataset = parseDataset({ metadata, collection });
    expect(dataset.collection.features).toHaveLength(12831);
    for (const f of dataset.collection.features) {
      expect(f.geometry.type).toBe('Point');
      expect(f.properties.downstream_id).toBeUndefined();
      expect(f.properties.main_river_id).toBeUndefined();
      expect(f.properties.name).not.toBe('UNKNOWN');
    }
  });
});
