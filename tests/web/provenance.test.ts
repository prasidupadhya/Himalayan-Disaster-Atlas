import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { currentProductionRecords, filterProvenanceRecords, parseProvenanceCatalog } from '../../packages/contracts/provenance';

const catalog = parseProvenanceCatalog(JSON.parse(readFileSync('data/releases/atlas-provenance/1.0.0/manifest.json', 'utf8')));

describe('provenance catalog', () => {
  it('keeps complete current production provenance and derived parents', () => {
    const current = currentProductionRecords(catalog);
    expect(current.length).toBeGreaterThan(40);
    expect(current.every(record => record.source && record.license && record.method && record.transformations.length >= 3)).toBe(true);
    expect(current.find(record => record.id === 'nepal-hazard-graph')?.parents.length).toBeGreaterThan(0);
    expect(current.find(record => record.id === 'scenario-pulse-40669746')?.evidence_type).toBe('simulated');
  });
  it('keeps superseded releases visible instead of silently dropping them', () => {
    expect(catalog.records.find(record => record.key === 'nepal-admin-districts@2.0.0')?.state).toBe('superseded');
    expect(catalog.records.find(record => record.key === 'nepal-admin-districts@2.0.1')?.state).toBe('current');
  });
  it('filters catalog records by text, category, source and release state', () => {
    const glaciers = filterProvenanceRecords(catalog.records, { query: 'glacier', category: 'Cryosphere' });
    expect(glaciers.length).toBeGreaterThan(0);
    expect(glaciers.every(record => record.category === 'Cryosphere' && record.state === 'current')).toBe(true);
    const source = glaciers[0].source;
    expect(filterProvenanceRecords(catalog.records, { source }).every(record => record.source === source)).toBe(true);
    expect(filterProvenanceRecords(catalog.records, { query: 'nepal-admin-country', includeNonCurrent: true }).some(record => record.version === '2.0.0' && record.state === 'superseded')).toBe(true);
  });
});
