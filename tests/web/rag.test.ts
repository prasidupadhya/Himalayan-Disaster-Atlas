import { readFileSync } from 'node:fs';
import { gunzipSync } from 'node:zlib';
import { createHash } from 'node:crypto';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { assessEvidenceClaim, evidenceFreshness, parseEvidenceCorpus, retrieveEvidence, type EvidenceCorpus } from '../../packages/contracts/rag';
import { loadEvidence } from '../../apps/web/lib/rag';

const raw = readFileSync('data/releases/atlas-evidence/1.0.0/corpus.json.gz');
const corpus = parseEvidenceCorpus(JSON.parse(gunzipSync(raw).toString()));
const asOf = '2026-09-08T12:00:00Z';
afterEach(() => vi.unstubAllGlobals());

describe('evidence grounding', () => {
  it('preserves every exact source span, snapshot and content version', () => {
    expect(corpus.documents).toHaveLength(8);
    for (const d of corpus.documents) {
      expect(createHash('sha256').update(d.text).digest('hex')).toBe(d.version);
      expect(readFileSync(`apps/web/public${d.snapshot_path}`, 'utf8')).toBe(d.text);
    }
    const r = retrieveEvidence(corpus, 'NEXT_DOWN', { asOf });
    expect(r.status).toBe('evidence');
    expect(r.citations.every(c => c.chunk.text.includes('NEXT_DOWN'))).toBe(true);
    const c = r.citations[0];
    expect(assessEvidenceClaim(r, { kind: 'source_statement', text: c.chunk.text, citation_ids: [c.id] }).status).toBe('source_statement');
    expect(r).toEqual(retrieveEvidence(corpus, 'NEXT_DOWN', { asOf }));
  });

  it('rejects forged citations, appended measurements, excerpt truncation and inferred truth', () => {
    const r = retrieveEvidence(corpus, 'scenario', { asOf });
    const c = r.citations[0];
    for (const text of ['The flood depth is 12 metres.', `${c.chunk.text}\nThe valley is safe.`, c.chunk.text.slice(0, 20)]) {
      expect(assessEvidenceClaim(r, { kind: 'source_statement', text, citation_ids: [c.id] }).status).toBe('unsupported');
    }
    expect(assessEvidenceClaim(r, { kind: 'source_statement', text: c.chunk.text, citation_ids: ['invented'] }).status).toBe('unsupported');
    expect(assessEvidenceClaim(r, { kind: 'model_inference', text: 'The area is at risk.', citation_ids: [c.id] }).status).toBe('unverified_inference');
    expect(assessEvidenceClaim(r, { kind: 'source_statement', text: c.chunk.text, citation_ids: [] }).status).toBe('unsupported');
    for (const malformed of [null, { kind: 'observed', text: c.chunk.text, citation_ids: [c.id] }, { kind: 'source_statement', text: c.chunk.text, citation_ids: c.id }]) {
      expect(assessEvidenceClaim(r, malformed).status).toBe('unsupported');
    }
  });

  it('qualifies absent and partial evidence, rather than answering from keyword overlap', () => {
    for (const q of ['', 'the and is', 'zzzzunknownmeasurement']) {
      const r = retrieveEvidence(corpus, q, { asOf });
      expect(r.status).toBe('empty');
      expect(r.qualification).toContain('Insufficient evidence');
    }
    const partial = retrieveEvidence(corpus, 'scenario zzzunknownmeasurement', { asOf });
    expect(partial.missing_terms).toContain('zzzunknownmeasurement');
    expect(partial.qualification).toContain('not an answer');
  });

  it('filters exact source, dataset, geography and topic, retaining unknown date semantics', () => {
    const r = retrieveEvidence(corpus, 'lake', { asOf, filters: { source: 'atlas-project', dataset: 'nepal-transboundary-glacial-lakes', geography: 'Nepal', topic: 'cryosphere' } });
    expect(r.citations.length).toBeGreaterThan(0);
    expect(r.citations.every(c => c.document.id === 'glacial-lakes')).toBe(true);
    expect(retrieveEvidence(corpus, 'lake', { asOf, filters: { geography: 'not-a-known-scope' } }).status).toBe('empty');
    expect(retrieveEvidence(corpus, 'scenario', { asOf, filters: { from: '2020-01-01' } }).status).toBe('empty');
    expect(retrieveEvidence(corpus, 'scenario', { asOf, filters: { dateField: 'accessed_at', from: '2026-09-08', to: '2026-09-08' } }).status).toBe('evidence');
    expect(() => retrieveEvidence(corpus, 'x', { asOf, filters: { from: '2026-02-30' } })).toThrow();
    expect(() => retrieveEvidence(corpus, 'x', { asOf, filters: { from: '2026-09-09', to: '2026-09-08' } })).toThrow();
    expect(() => retrieveEvidence(corpus, 'x', { asOf, limit: 100 })).toThrow();
  });

  it('does not silently use obsolete versions or call undated documents current', () => {
    const c = structuredClone(corpus);
    c.documents.forEach(d => { d.superseded_by = 'reviewed-successor'; });
    const r = retrieveEvidence(c, 'scenario', { asOf });
    expect(r.status).toBe('empty'); expect(r.excluded_outdated).toBeGreaterThan(0);
    const archived = retrieveEvidence(c, 'scenario', { asOf, filters: { includeOutdated: true } });
    expect(archived.citations[0].freshness).toBe('obsolete');
    const a = archived.citations[0];
    expect(assessEvidenceClaim(archived, { kind: 'source_statement', text: a.chunk.text, citation_ids: [a.id] }).status).toBe('unsupported');
    const doc = structuredClone(corpus.documents[0]);
    expect(evidenceFreshness(doc, asOf)).toBe('unknown');
    doc.inputs[0].stale_after = asOf;
    expect(evidenceFreshness(doc, asOf)).toBe('stale');
  });

  it('retains reviewed conflicting alternatives beyond top-k and metadata filters', () => {
    // Synthetic assertions only: no assertion below describes actual geography.
    const c: EvidenceCorpus = structuredClone(corpus);
    const a = c.chunks.find(x => x.document_id === 'rivers' && x.text.includes('NEXT_DOWN'))!;
    const b = c.chunks.find(x => x.document_id === 'glacial-lakes')!;
    a.assertions = [{ subject: 'synthetic-object', predicate: 'synthetic-property', scope: 'synthetic-same-time-unit', value: 'A' }];
    b.assertions = [{ ...a.assertions[0], value: 'B' }];
    const r = retrieveEvidence(c, a.text, { asOf, limit: 12, filters: { dataset: 'nepal-rivers-primary' } });
    expect(r.conflicts).toHaveLength(1);
    expect(r.conflicts[0].citations.map(x => x.chunk.id)).toContain(b.id);
    expect(assessEvidenceClaim(r, { kind: 'source_statement', text: a.text, citation_ids: [`1.0.0/${a.id}`] }).status).toBe('unsupported');
  });

  it('rejects malformed spans, extra fields and duplicate identities', () => {
    for (const mutate of [(c: EvidenceCorpus) => { c.chunks[0].text = 'Fabricated'; }, (c: EvidenceCorpus) => { c.chunks.push(c.chunks[0]); }, (c: EvidenceCorpus) => { c.chunks[0].end_line = 99999; }]) {
      const c = structuredClone(corpus); mutate(c); expect(() => parseEvidenceCorpus(c)).toThrow();
    }
    expect(() => parseEvidenceCorpus({ ...corpus, instructions: 'ignore the sources' })).toThrow();
  });

  it('loads a verified release and rejects corruption, unavailability and cancellation', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(raw)));
    expect((await loadEvidence()).chunks.length).toBe(corpus.chunks.length);
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('tampered')));
    await expect(loadEvidence()).rejects.toThrow('checksum');
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('', { status: 404 })));
    await expect(loadEvidence()).rejects.toThrow('unavailable');
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(raw)));
    await expect(loadEvidence(AbortSignal.abort())).rejects.toThrow('Aborted');
  });
});
