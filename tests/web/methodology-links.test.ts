import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { currentProductionRecords, parseProvenanceCatalog } from '../../packages/contracts/provenance';

const catalog = parseProvenanceCatalog(JSON.parse(readFileSync('data/releases/atlas-provenance/1.8.0/manifest.json', 'utf8')));
// The methodology is one article per language; both must keep every section target.
const articles = ['apps/web/app/methodology/article-en.tsx', 'apps/web/app/methodology/article-ne.tsx'].map(path => readFileSync(path, 'utf8'));
const methodologySource = articles[0];

describe('methodology navigation', () => {
  it('provides a stable section target for every current production release', () => {
    for (const record of currentProductionRecords(catalog)) {
      const anchor = record.methodology_href.split('#')[1];
      for (const article of articles) expect(article, record.key).toContain(`id="${anchor}"`);
    }
  });
  it('documents all public evidence classes and core processing concepts', () => {
    for (const term of ['Observed', 'Historical', 'Derived', 'Estimated', 'Modelled', 'Simulated', 'Unknown', 'OGC:CRS84', 'EPSG:6933', 'simplification', 'tiling']) {
      expect(methodologySource).toContain(term);
    }
  });
});
