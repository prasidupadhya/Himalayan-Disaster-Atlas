/**
 * Feature 58 evidence analyst: deterministic lexical retrieval over the verified public corpus. It quotes passages
 * with citations and never generates or paraphrases factual text. No model, network service or storage is used.
 */
export interface EvidenceChunk { id: string; source: string; title: string; section: string; text: string; start_line?: number; end_line?: number }
export interface EvidenceDocument { id: string; path: string; title: string; sha256: string; kind: 'atlas-document' | 'release-metadata' }
export interface EvidenceCorpus { format: 'atlas-public-evidence@1'; documents: EvidenceDocument[]; chunks: EvidenceChunk[] }
export interface EvidenceHit { chunk: EvidenceChunk; score: number; matched: string[]; missing: string[] }
export interface EvidenceAnswer { query: string; terms: string[]; hits: EvidenceHit[]; status: 'answered' | 'partial' | 'insufficient' }

const STOPWORDS = new Set('a an and are as at be by can do does for from how i in is it its me of on or the this to was what when where which who why will with you your about there their them than then into not no'.split(' '));
export const MAX_QUERY = 500;

export function tokens(text: string): string[] {
  return text.normalize('NFKD').replace(/[̀-ͯ]/g, '').toLowerCase().match(/[a-z0-9]+(?:[._-][a-z0-9]+)*/g) ?? [];
}
export function parseEvidenceCorpus(value: unknown, summary: { chunks: number; documents: number }): EvidenceCorpus {
  const c = value as EvidenceCorpus;
  if (!c || c.format !== 'atlas-public-evidence@1' || !Array.isArray(c.chunks) || c.chunks.length !== summary.chunks || c.documents.length !== summary.documents) throw new Error('Unsupported evidence corpus');
  const ids = new Set<string>();
  for (const chunk of c.chunks) {
    if (ids.has(chunk.id) || typeof chunk.text !== 'string' || !chunk.text || chunk.text.length > 4000) throw new Error('Invalid evidence passage');
    ids.add(chunk.id);
  }
  return c;
}

export function buildIndex(corpus: EvidenceCorpus) {
  const body = corpus.chunks.map(c => new Set(tokens(c.text)));
  const meta = corpus.chunks.map(c => new Set(tokens(`${c.title} ${c.section}`)));
  const df = new Map<string, number>();
  for (const set of body) for (const t of set) df.set(t, (df.get(t) ?? 0) + 1);
  return { corpus, body, meta, df };
}
export type EvidenceIndex = ReturnType<typeof buildIndex>;

/** score = Σ log(1 + N/(1+df)) over matched terms, +1 per term also in title/section, × matched fraction. */
export function retrieve(index: EvidenceIndex, query: string, k = 4): EvidenceAnswer {
  const q = query.slice(0, MAX_QUERY);
  const terms = [...new Set(tokens(q).filter(t => !STOPWORDS.has(t) && t.length > 1))];
  if (!terms.length) return { query: q, terms, hits: [], status: 'insufficient' };
  const N = index.corpus.chunks.length;
  const hits: EvidenceHit[] = [];
  index.corpus.chunks.forEach((chunk, i) => {
    const matched = terms.filter(t => index.body[i].has(t));
    if (!matched.length) return;
    let score = 0;
    for (const t of matched) score += Math.log(1 + N / (1 + (index.df.get(t) ?? 0))) + (index.meta[i].has(t) ? 1 : 0);
    score *= matched.length / terms.length;
    hits.push({ chunk, score, matched, missing: terms.filter(t => !matched.includes(t)) });
  });
  hits.sort((a, b) => b.score - a.score || a.chunk.id.localeCompare(b.chunk.id));
  const top = hits.slice(0, k);
  const status = !top.length ? 'insufficient' : top[0].missing.length === 0 ? 'answered' : 'partial';
  return { query: q, terms, hits: top, status };
}
