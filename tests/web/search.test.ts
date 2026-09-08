import { describe, expect, it } from 'vitest';
import { hasAmbiguousName, normalizeSearchTerm, searchRecords, type SearchRecord } from '../../packages/contracts/search';

const record = (key: string, name: string, aliases: string[], context = 'mountain'): SearchRecord => ({
  key, type: 'mountain', dataset_id: 'mountains', dataset_version: '1.0.0', feature_id: key, source_id: key,
  name, aliases, normalized_name: normalizeSearchTerm(name), normalized_aliases: aliases.map(normalizeSearchTerm), context,
  longitude: 85, latitude: 28, date: null, manifest_path: '/data/mountains/1.0.0/manifest.json', detail_href: null,
});

describe('global search ranking', () => {
  it('normalizes diacritics without inventing a different-script transliteration', () => {
    expect(normalizeSearchTerm('Manāslu')).toBe('manaslu');
    expect(normalizeSearchTerm('मनास्लु')).not.toBe('manaslu');
  });

  it('ranks canonical exact before alias exact, prefix and substring deterministically', () => {
    const results = searchRecords([
      record('4', 'Everest Base', []),
      record('2', 'Sagarmatha', ['Everest']),
      record('1', 'Everest', []),
      record('3', 'Mount Everest View', []),
    ], 'Everest');
    expect(results.map(item => item.key)).toEqual(['1', '2', '4', '3']);
  });

  it('preserves duplicate-name ambiguity instead of auto-picking one entity', () => {
    const a = record('a', 'Bagmati', [], 'province');
    const b = record('b', 'Bagmati', [], 'local level');
    expect(hasAmbiguousName([a, b], a)).toBe(true);
  });
});
