import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { buildSourceDirectory, currentProductionRecords, parseProvenanceCatalog } from '../../packages/contracts/provenance';

const catalog = parseProvenanceCatalog(JSON.parse(readFileSync('data/releases/atlas-provenance/1.0.0/manifest.json', 'utf8')));
const sourcePage = readFileSync('apps/web/app/sources/page.tsx', 'utf8');

describe('public source directory', () => {
  it('has a stable source-section target for every current production release', () => {
    for (const record of currentProductionRecords(catalog)) {
      const anchor = record.source_href.split('#')[1];
      expect(sourcePage, record.key).toContain(`['${anchor}',`);
    }
  });
  it('keeps external source links and derived Atlas products distinguishable', () => {
    const directory = buildSourceDirectory(catalog.records);
    const external = directory.filter(entry => !entry.derived);
    expect(external.some(entry => entry.url?.startsWith('https://'))).toBe(true);
    expect(directory.filter(entry => entry.derived).every(entry => entry.name === 'Himalayan Disaster Atlas derived product')).toBe(true);
  });
});
