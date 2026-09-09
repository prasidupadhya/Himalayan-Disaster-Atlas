import { createHash } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import { auditDatasets } from '../../scripts/check-licenses.mjs';
const bytes = Buffer.from('{}');
const review = (path: string, status = 'PERMITTED', parents: string[] = []) => ({ manifest_path: path, manifest_sha256: createHash('sha256').update(bytes).digest('hex'), status, parents, reviewed_on: '2026-09-09', reason: 'Fixture review', obligations: 'Retain attribution', evidence_urls: [] });
describe('publication licence coverage', () => {
  it('requires every release to have one current review', () => {
    expect(() => auditDatasets({}, [['/data/a/1/manifest.json', bytes]])).toThrow('Exactly one');
    expect(() => auditDatasets({ a: review('/a') }, [['/a', Buffer.from('changed')]])).toThrow('Stale');
    expect(() => auditDatasets({ a: review('/a'), b: review('/b') }, [['/a', bytes]])).toThrow('missing');
  });
  it('blocks unresolved parent rights transitively', () => {
    const reviews = { a: review('/a', 'REVIEW_REQUIRED'), b: review('/b', 'PERMITTED', ['a']), c: review('/c', 'PERMITTED', ['b']) };
    expect(auditDatasets(reviews, Object.keys(reviews).map(key => [`/${key}`, bytes]))).toEqual(['a', 'b', 'c']);
  });
  it('rejects missing parents, cycles and unknown statuses', () => {
    expect(() => auditDatasets({ a: review('/a', 'PERMITTED', ['b']) }, [['/a', bytes]])).toThrow('Unreviewed parent');
    expect(() => auditDatasets({ a: review('/a', 'PERMITTED', ['a']) }, [['/a', bytes]])).toThrow('cycle');
    expect(() => auditDatasets({ a: review('/a', 'probably fine') }, [['/a', bytes]])).toThrow('Incomplete');
  });
});
