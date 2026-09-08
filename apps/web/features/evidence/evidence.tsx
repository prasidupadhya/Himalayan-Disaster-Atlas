'use client';
import { useEffect, useRef, useState } from 'react';
import { retrieveEvidence, type Citation, type EvidenceCorpus, type EvidenceFilters, type Retrieval } from '../../../../packages/contracts/rag';
import { DataState } from '../../components/data-state';
import { UnavailableError } from '../../lib/datasets';
import { loadEvidence } from '../../lib/rag';
import type { Resource } from '../../lib/resource';

function EvidenceCitation({ citation }: { citation: Citation }) {
  const { document: d, chunk: c } = citation;
  return <article className="evidence-citation">
    <h3>{d.title} · {c.section}</h3>
    <p><strong>SOURCE STATEMENT</strong> · Freshness: {citation.freshness === 'unknown' ? 'UNKNOWN' : citation.freshness.replaceAll('_', ' ')}</p>
    <blockquote><p className="evidence-excerpt">{c.text}</p></blockquote>
    <p><a href={d.snapshot_path}>Open exact document snapshot</a> · Lines {c.start_line}–{c.end_line} · Citation <code>{citation.id}</code></p>
    <details><summary>Source, dates and dataset versions</summary>
      <dl><dt>Source</dt><dd>{d.source_id} · Project documentation, not an independent observation</dd>
        <dt>Document version (SHA-256)</dt><dd><code>{d.version}</code></dd>
        <dt>Published</dt><dd>{d.publication_date ?? 'UNKNOWN'}</dd>
        <dt>Version date</dt><dd>{d.version_date ?? 'UNKNOWN'}</dd>
        <dt>Accessed</dt><dd>{d.accessed_at}</dd>
        <dt>Document licence</dt><dd>{d.license ?? 'UNKNOWN — upstream data terms still apply'}</dd>
        <dt>Superseded by</dt><dd>{d.superseded_by ?? 'UNKNOWN'}</dd>
        <dt>Scope</dt><dd>{d.geographies.join(', ')} · {d.topics.join(', ')}</dd></dl>
      <ul>{d.inputs.map(i => <li key={i.dataset_id}><a href={i.manifest_path}>{i.dataset_id}@{i.dataset_version}</a> · Manifest SHA-256 <code>{i.sha256}</code></li>)}</ul>
    </details>
  </article>;
}

export function EvidenceBrowser() {
  const [state, setState] = useState<Resource<EvidenceCorpus>>({ status: 'loading' });
  const [attempt, setAttempt] = useState(0);
  const [query, setQuery] = useState('scenario limitations');
  const [filters, setFilters] = useState<EvidenceFilters>({});
  const [result, setResult] = useState<Retrieval | null>(null);
  const [error, setError] = useState('');
  const results = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const controller = new AbortController();
    loadEvidence(controller.signal).then(data => { if (!controller.signal.aborted) setState({ status: data.chunks.length ? 'ready' : 'empty', data }); })
      .catch((e: unknown) => { if (!controller.signal.aborted) setState({ status: e instanceof UnavailableError ? 'unavailable' : 'error', message: e instanceof Error ? e.message : 'Evidence loading failed' }); });
    return () => controller.abort();
  }, [attempt]);
  if (state.status !== 'ready') return <DataState state={state} retry={() => { setState({ status: 'loading' }); setAttempt(n => n + 1); }} />;
  const corpus = state.data;
  const choices = {
    source: [...new Set(corpus.documents.map(d => d.source_id))],
    dataset: [...new Set(corpus.documents.flatMap(d => d.inputs.map(i => i.dataset_id)))],
    geography: [...new Set(corpus.documents.flatMap(d => d.geographies))],
    topic: [...new Set(corpus.documents.flatMap(d => d.topics))],
  };
  return <section aria-label="Evidence retrieval" className="evidence-browser">
    <p>{corpus.documents.length} approved project documents · {corpus.chunks.length} excerpts · Corpus {corpus.version}</p>
    <form onSubmit={event => {
      event.preventDefault(); setError('');
      try { setResult(retrieveEvidence(corpus, query, { asOf: new Date().toISOString(), filters })); }
      catch (e) { setResult(null); setError(e instanceof Error ? e.message : 'Invalid evidence query'); }
      requestAnimationFrame(() => results.current?.focus());
    }}>
      <label>Evidence keywords<input value={query} onChange={e => setQuery(e.target.value)} maxLength={500} required /></label>
      <fieldset><legend>Metadata filters</legend><div className="evidence-filters">
        {(Object.keys(choices) as (keyof typeof choices)[]).map(key => <label key={key}>{key[0].toUpperCase() + key.slice(1)}<select aria-label={key[0].toUpperCase() + key.slice(1)} value={filters[key] ?? ''} onChange={e => setFilters(f => ({ ...f, [key]: e.target.value }))}><option value="">All</option>{choices[key].sort().map(v => <option key={v}>{v}</option>)}</select></label>)}
        <label>Date basis<select aria-label="Date basis" value={filters.dateField ?? 'publication_date'} onChange={e => setFilters(f => ({ ...f, dateField: e.target.value as EvidenceFilters['dateField'] }))}><option value="publication_date">Publication date</option><option value="version_date">Document version date</option><option value="accessed_at">Access date</option></select></label>
        <label>From (UTC)<input type="date" value={filters.from ?? ''} onChange={e => setFilters(f => ({ ...f, from: e.target.value }))} /></label>
        <label>Through (UTC)<input type="date" value={filters.to ?? ''} onChange={e => setFilters(f => ({ ...f, to: e.target.value }))} /></label>
      </div><label><input type="checkbox" checked={filters.includeOutdated ?? false} onChange={e => setFilters(f => ({ ...f, includeOutdated: e.target.checked }))} /> Include stale or obsolete evidence</label>
      <p>Dates filter documents, not event or observation times. UNKNOWN dates are excluded when a date range is set. Geography matches document scope; it does not perform a spatial query.</p></fieldset>
      <button type="submit">Retrieve evidence</button>
    </form>
    <div ref={results} tabIndex={-1} aria-label="Retrieval results">
      {error && <p role="alert">{error}</p>}
      {result && <>
        <p role="status">{result.qualification}</p>
        <p>Submitted keywords: <strong>{result.query}</strong> · As of {result.as_of} · {result.excluded_outdated} outdated matching excerpts excluded.</p>
        <p>Submitted filters: {Object.entries(result.filters).filter(([, v]) => v !== '' && v !== undefined).map(([k, v]) => `${k}: ${String(v)}`).join(' · ') || 'None (outdated evidence excluded)'}</p>
        {result.missing_terms.length > 0 && <p>Terms absent from returned excerpts: {result.missing_terms.join(', ')}. No supported answer is implied.</p>}
        {result.conflicts.map(group => <aside key={group.key} aria-label="Conflicting evidence"><h2>Conflicting source statements</h2><p>These reviewed comparable assertions disagree. Alternatives are retained even outside the selected filters; review their scope and freshness.</p>{group.citations.map(c => <EvidenceCitation key={c.id} citation={c} />)}</aside>)}
        {result.citations.map(c => <EvidenceCitation key={c.id} citation={c} />)}
      </>}
    </div>
  </section>;
}
