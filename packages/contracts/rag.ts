import validateGenerated from './generated/rag.cjs';
import { validationErrors } from './validation-errors';
import { compiledValidator } from './validation-errors';

export interface EvidenceDocument {
  id: string; title: string; source_id: string; version: string; text: string;
  publication_date: string | null; version_date: string | null; accessed_at: string;
  license: string | null; geographies: string[]; topics: string[]; snapshot_path: string;
  superseded_by: string | null; stale_after: string | null;
  inputs: { dataset_id: string; dataset_version: string; manifest_path: string; sha256: string; stale_after: string | null }[];
}
export interface EvidenceChunk {
  id: string; document_id: string; section: string; start_line: number; end_line: number; text: string;
  // Only reviewed, explicitly comparable assertions; never LLM-extracted facts.
  assertions: { subject: string; predicate: string; scope: string; value: string }[];
}
export interface EvidenceCorpus {
  schema_version: '1.0.0'; kind: 'evidence-corpus'; version: string;
  documents: EvidenceDocument[]; chunks: EvidenceChunk[];
}
const validate = compiledValidator<EvidenceCorpus>(validateGenerated);
export function parseEvidenceCorpus(value: unknown): EvidenceCorpus {
  if (!validate(value)) throw new Error(`Invalid evidence corpus: ${validationErrors(validate.errors)}`);
  const docs = new Map(value.documents.map(d => [d.id, d]));
  if (docs.size !== value.documents.length) throw new Error('Duplicate evidence document');
  const ids = new Set<string>();
  for (const d of docs.values()) {
    if (d.snapshot_path !== `/data/atlas-evidence/${value.version}/documents/${d.id}.txt`) throw new Error('Snapshot identity mismatch');
  }
  for (const c of value.chunks) {
    const d = docs.get(c.document_id);
    if (!d || ids.has(c.id)) throw new Error('Unknown document or duplicate evidence chunk');
    ids.add(c.id);
    const lines = d.text.split('\n');
    if (c.end_line < c.start_line || c.end_line > lines.length || lines.slice(c.start_line - 1, c.end_line).join('\n') !== c.text) throw new Error('Citation does not reproduce source lines');
  }
  return value;
}

export type EvidenceFreshness = 'unknown' | 'within_review_period' | 'stale' | 'obsolete';
export function evidenceFreshness(d: EvidenceDocument, asOf: string): EvidenceFreshness {
  if (!Number.isFinite(Date.parse(asOf))) throw new Error('An explicit valid as-of instant is required');
  if (d.superseded_by !== null) return 'obsolete';
  const deadlines = [d.stale_after, ...d.inputs.map(i => i.stale_after)].filter((s): s is string => s !== null);
  if (deadlines.some(s => Date.parse(s) <= Date.parse(asOf))) return 'stale';
  // Dataset deadlines do not certify the document itself as current.
  return d.stale_after === null ? 'unknown' : 'within_review_period';
}
export interface EvidenceFilters {
  source?: string; dataset?: string; geography?: string; topic?: string; document?: string;
  dateField?: 'publication_date' | 'version_date' | 'accessed_at'; from?: string; to?: string;
  includeOutdated?: boolean;
}
const stop = new Set('a an the is are was were be been of in on to for and or with what which how does do can it this that from by as at please tell me about'.split(' '));
export function evidenceTerms(text: string): string[] {
  return [...new Set(text.normalize('NFKD').replace(/\p{M}/gu, '').toLowerCase().match(/[\p{L}\p{N}_]+/gu) ?? [])].filter(t => !stop.has(t));
}
export interface Citation {
  id: string; corpus_version: string; document: EvidenceDocument; chunk: EvidenceChunk;
  freshness: EvidenceFreshness; score: number;
}
export interface Retrieval {
  status: 'evidence' | 'empty'; query: string; as_of: string; filters: EvidenceFilters;
  citations: Citation[]; excluded_outdated: number; missing_terms: string[];
  conflicts: { key: string; citations: Citation[] }[];
  qualification: string;
}
const order = (a: string, b: string) => a < b ? -1 : a > b ? 1 : 0;
export function retrieveEvidence(corpus: EvidenceCorpus, query: string, options: { asOf: string; filters?: EvidenceFilters; limit?: number }): Retrieval {
  const { asOf, filters = {}, limit = 6 } = options;
  if (!Number.isFinite(Date.parse(asOf)) || query.length > 500 || !Number.isInteger(limit) || limit < 1 || limit > 12) throw new Error('Invalid retrieval date, query or result budget');
  if (filters.dateField !== undefined && !['publication_date', 'version_date', 'accessed_at'].includes(filters.dateField)) throw new Error('Invalid date basis');
  for (const bound of [filters.from, filters.to]) if (bound && (!/^\d{4}-\d{2}-\d{2}$/.test(bound) || !Number.isFinite(Date.parse(bound)) || new Date(bound).toISOString().slice(0, 10) !== bound)) throw new Error('Date filters require valid UTC calendar dates');
  if (filters.from && filters.to && filters.from > filters.to) throw new Error('Reversed date range');
  const terms = evidenceTerms(query);
  const docs = new Map(corpus.documents.map(d => [d.id, d]));
  const eligible = (d: EvidenceDocument) => {
    const date = d[filters.dateField ?? 'publication_date']?.slice(0, 10);
    return (!filters.document || d.id === filters.document) && (!filters.source || d.source_id === filters.source) && (!filters.dataset || d.inputs.some(i => i.dataset_id === filters.dataset)) &&
      (!filters.geography || d.geographies.includes(filters.geography)) && (!filters.topic || d.topics.includes(filters.topic)) &&
      (!(filters.from || filters.to) || (date !== undefined && (!filters.from || date >= filters.from) && (!filters.to || date <= filters.to)));
  };
  const indexed = corpus.chunks.map(chunk => ({ chunk, doc: docs.get(chunk.document_id)!, words: evidenceTerms(chunk.text) }));
  // Deterministic lexical IDF + body coverage. Metadata boosts cannot create a body match.
  const frequencies = new Map(terms.map(t => [t, indexed.filter(c => c.words.includes(t)).length]));
  let excluded = 0;
  const citation = (chunk: EvidenceChunk, score = 0): Citation => {
    const document = docs.get(chunk.document_id)!;
    return { id: `${corpus.version}/${chunk.id}`, corpus_version: corpus.version, document, chunk, freshness: evidenceFreshness(document, asOf), score };
  };
  const ranked: Citation[] = [];
  for (const row of indexed) {
    if (!eligible(row.doc)) continue;
    const matched = terms.filter(t => row.words.includes(t));
    if (!matched.length) continue;
    const freshness = evidenceFreshness(row.doc, asOf);
    if (!filters.includeOutdated && ['stale', 'obsolete'].includes(freshness)) { excluded++; continue; }
    const title = evidenceTerms(`${row.doc.title} ${row.chunk.section}`);
    const score = matched.reduce((sum, t) => sum + Math.log(1 + indexed.length / (1 + frequencies.get(t)!)) + (title.includes(t) ? 1 : 0), 0) * matched.length / terms.length;
    ranked.push(citation(row.chunk, score));
  }
  ranked.sort((a, b) => b.score - a.score || order(a.id, b.id));
  const citations = ranked.slice(0, limit);
  const key = (a: EvidenceChunk['assertions'][number]) => JSON.stringify([a.subject, a.predicate, a.scope]);
  const relevant = new Set(citations.flatMap(c => c.chunk.assertions.map(key)));
  const conflicts: Retrieval['conflicts'] = [];
  // Include all alternatives in a relevant reviewed conflict group, even if stale or filtered out.
  // This avoids hiding disagreement behind ranking, date filters or the top-k cutoff.
  for (const k of relevant) {
    const alternatives = corpus.chunks.filter(c => c.assertions.some(a => key(a) === k));
    const values = new Set(alternatives.flatMap(c => c.assertions.filter(a => key(a) === k).map(a => a.value)));
    if (values.size > 1) conflicts.push({ key: k, citations: alternatives.map(c => citation(c)) });
  }
  return {
    status: citations.length ? 'evidence' : 'empty', query, as_of: asOf, filters, citations, excluded_outdated: excluded, conflicts,
    missing_terms: terms.filter(t => !citations.some(c => evidenceTerms(c.chunk.text).includes(t))),
    qualification: citations.length
      ? 'Retrieved source excerpts are context, not an answer or proof of a claim. Check scope, dates and limitations. Unannotated semantic conflicts may remain undetected.'
      : 'Insufficient evidence in the approved corpus for this query and filters. This does not establish geographic absence, safety or zero impact.',
  };
}

export interface EvidenceClaim { kind: 'source_statement' | 'model_inference'; text: string; citation_ids: string[] }
export function assessEvidenceClaim(retrieval: Retrieval, value: unknown): { status: 'source_statement' | 'unverified_inference' | 'unsupported'; reason: string } {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return { status: 'unsupported', reason: 'Malformed claim.' };
  const claim = value as EvidenceClaim;
  if (Object.keys(value).sort().join(',') !== 'citation_ids,kind,text' || !['source_statement', 'model_inference'].includes(claim.kind) ||
    typeof claim.text !== 'string' || claim.text.length > 10_000 || !Array.isArray(claim.citation_ids) || claim.citation_ids.length > 12 ||
    claim.citation_ids.some(id => typeof id !== 'string')) return { status: 'unsupported', reason: 'Malformed claim.' };
  // Citation presence alone never validates generated prose. Only a complete exact retrieved
  // excerpt can pass this deterministic gate. No inferred measurements become source facts.
  const cited = claim.citation_ids.map(id => retrieval.citations.find(c => c.id === id));
  if (!cited.length || cited.some(c => !c) || new Set(claim.citation_ids).size !== cited.length) return { status: 'unsupported', reason: 'Missing or non-retrieved citation.' };
  if (claim.kind === 'model_inference') return { status: 'unverified_inference', reason: 'Model-generated inference requires independent verification; citations do not establish entailment.' };
  if (cited.length !== 1 || claim.text !== cited[0]!.chunk.text) return { status: 'unsupported', reason: 'Source statements must reproduce a complete retrieved excerpt exactly.' };
  if (retrieval.conflicts.some(g => g.citations.some(c => c.id === cited[0]!.id)) || ['stale', 'obsolete'].includes(cited[0]!.freshness)) return { status: 'unsupported', reason: 'Conflicting or outdated evidence requires explicit qualification and review.' };
  return { status: 'source_statement', reason: 'Exact source excerpt only; no claim of independent truth or completeness.' };
}
