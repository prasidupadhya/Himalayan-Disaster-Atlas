'use client';
import { useEffect, useRef, useState } from 'react';
import { ANALYST_EXAMPLES, ANALYST_TOPICS, type AnalystAnswer } from '../../../../packages/contracts/analyst';
import { askAnalyst } from '../../lib/analyst';
import { UnavailableError } from '../../lib/datasets';
import { DataState } from '../../components/data-state';
import type { Resource } from '../../lib/resource';

export function Analyst() {
  const [question, setQuestion] = useState<string>(ANALYST_EXAMPLES[0]);
  const [state, setState] = useState<Resource<AnalystAnswer> | null>(null);
  const [submitted, setSubmitted] = useState('');
  const controller = useRef<AbortController | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  useEffect(() => () => controller.current?.abort(), []);
  async function submit(text: string) {
    controller.current?.abort();
    const active = new AbortController(); controller.current = active;
    setSubmitted(text); setState({ status: 'loading' });
    try {
      const answer = await askAnalyst(text, active.signal);
      if (!active.signal.aborted) { setState({ status: 'ready', data: answer }); requestAnimationFrame(() => resultRef.current?.focus()); }
    } catch (e) {
      if (!active.signal.aborted) setState({ status: e instanceof UnavailableError ? 'unavailable' : 'error', message: e instanceof Error ? e.message : 'The evidence could not be verified.' });
    }
  }
  function clear() { controller.current?.abort(); setState(null); setSubmitted(''); }
  const answer = state?.status === 'ready' ? state.data : null;
  function download() {
    if (!answer) return;
    const url = URL.createObjectURL(new Blob([JSON.stringify(answer, null, 2)], { type: 'application/json' }));
    const link = document.createElement('a'); link.href = url; link.download = 'atlas-analyst-answer.json'; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return <section aria-label="AI Analyst" className="analyst">
    <p><strong>Local evidence mode</strong> · This assistant uses explicit question rules, verified sources and deterministic calculations. No language model or external AI service is connected.</p>
    <details><summary>Supported questions and scope</summary>
      <p>Ask “Explain …” or “What are the limitations of …?” for {Object.values(ANALYST_TOPICS).map(t => t.title).join(', ')}.</p>
      <p>Use “Trace downstream from HYRIV …” with one exact river ID, or “Summarize scenario …” with scenario-network-40669746 or scenario-pulse-40669746.</p>
      <p>Questions about local safety, forecasts, affected assets, lake outlets, arbitrary measurements and event comparisons are unsupported here. River names are not resolved to IDs. Every question stands alone; “it” does not reuse a previous location.</p>
    </details>
    <div className="analyst-examples" aria-label="Example questions">{ANALYST_EXAMPLES.map(text => <button key={text} type="button" onClick={() => setQuestion(text)}>{text}</button>)}</div>
    <form onSubmit={e => { e.preventDefault(); void submit(question); }}>
      <label htmlFor="analyst-question">Your question</label>
      <textarea id="analyst-question" rows={3} maxLength={500} required value={question} onChange={e => setQuestion(e.target.value)} />
      <p>Questions stay in this page’s memory. Only approved static data files are requested.</p>
      <div className="analyst-actions"><button type="submit">Ask analyst</button><button type="button" onClick={clear}>{state?.status === 'loading' ? 'Cancel request' : 'Clear answer'}</button></div>
    </form>
    <div ref={resultRef} tabIndex={-1} aria-label="Analyst answer">
      {submitted && <p><strong>Submitted question:</strong> {submitted}</p>}
      {state && <DataState state={state} retry={() => void submit(submitted)} />}
      {answer && <>
        <p role="status"><strong>{answer.status.toUpperCase()}</strong> · {answer.summary}</p>
        <p>Evidence checked as of {answer.request.as_of} · {answer.engine}</p>
        {answer.claims.map((c, i) => <article className="analyst-claim" key={i}>
          <h3>{c.kind.replaceAll('_', ' ').toUpperCase()}</h3>
          <p className={c.kind === 'source_statement' ? 'evidence-excerpt' : undefined}>{c.text}</p>
          {c.kind !== 'source_statement' && <p><strong>{c.value === null ? 'UNKNOWN' : c.value}</strong>{c.value !== null && c.unit ? ` ${c.unit}` : ''}</p>}
          <p>Evidence: {c.citation_ids.map((id, index) => <span key={id}>{index ? ' · ' : ''}<a href={`#analyst-source-${answer.sources.findIndex(s => s.id === id)}`}>{id}</a></span>)}</p>
        </article>)}
        {answer.limitations.length > 0 && <aside aria-label="Answer limitations"><h3>Uncertainty and limitations</h3><ul>{answer.limitations.map((s, i) => <li key={i}>{s}</li>)}</ul></aside>}
        {answer.trace && <details><summary>Inspect ordered downstream reaches</summary><p>Complete ordered IDs are included in the download. Displaying the first {Math.min(200, answer.trace.reach_ids.length)} here.</p><p className="analyst-reaches">{answer.trace.reach_ids.slice(0, 200).join(' → ')}</p></details>}
        {answer.sources.length > 0 && <section aria-label="Answer sources"><h2>Inspect the sources</h2>{answer.sources.map((s, i) => <article id={`analyst-source-${i}`} key={s.id} className="analyst-source">
          <h3><a href={s.href}>{s.title}</a></h3><p>{s.evidence}</p>
          <details><summary>Source, dates, version and processing</summary><dl>
            <dt>Source</dt><dd>{s.source}</dd><dt>Version</dt><dd>{s.version}</dd><dt>SHA-256</dt><dd><code>{s.sha256}</code></dd>
            <dt>Observation date</dt><dd>{s.observation_date ?? 'UNKNOWN'}</dd><dt>Publication date</dt><dd>{s.publication_date ?? 'UNKNOWN'}</dd>
            <dt>Access date</dt><dd>{s.accessed_at ?? 'UNKNOWN'}</dd><dt>Licence</dt><dd>{s.license ?? 'UNKNOWN — inspect upstream source terms'}</dd>
          </dl><ul>{s.details.map((detail, j) => <li key={j}>{detail}</li>)}</ul></details>
        </article>)}</section>}
        <button type="button" onClick={download}>Download answer and provenance</button>
      </>}
    </div>
  </section>;
}
