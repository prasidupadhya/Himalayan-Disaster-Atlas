'use client';

import Link from 'next/link';
import { useRef, useState } from 'react';
import { hasAmbiguousName, type SearchEntityType, type SearchRecord } from '../../../../packages/contracts/search';
import { searchAtlas } from '../../lib/search';

const LABELS: Record<SearchEntityType, string> = {
  administrative_unit: 'Administrative units', mountain: 'Mountains', river: 'Rivers', glacier: 'Glaciers', glacial_lake: 'Glacial lakes',
  hydropower: 'Hydropower', infrastructure: 'Infrastructure', event: 'Events',
};

export function Search({ onFocus }: { onFocus: (record: SearchRecord) => void }) {
  const [query, setQuery] = useState('');
  const [submitted, setSubmitted] = useState('');
  const [state, setState] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle');
  const [results, setResults] = useState<SearchRecord[]>([]);
  const [selected, setSelected] = useState<SearchRecord | null>(null);
  const [message, setMessage] = useState('Search by verified name, alias, stable ID, type, or indexed source text.');
  const request = useRef<AbortController | null>(null);
  const groups = Array.from(new Set(results.map(item => item.type)));

  async function submit() {
    const value = query.trim();
    setSubmitted(value);
    setSelected(null);
    if (value.length < 2) {
      setResults([]); setState('ready'); setMessage('Enter at least two characters.'); return;
    }
    request.current?.abort();
    const controller = new AbortController(); request.current = controller;
    setState('loading'); setMessage('Searching the local verified index…');
    try {
      const found = await searchAtlas(value, controller.signal);
      if (controller.signal.aborted) return;
      setResults(found.results); setState('ready');
      setMessage(found.results.length ? `${found.results.length} matching indexed entities shown (maximum 60).` : 'No matching indexed entity. This does not imply the feature or place is absent geographically.');
    } catch (error) {
      if (!controller.signal.aborted) { setState('error'); setResults([]); setMessage(error instanceof Error ? error.message : 'Search index unavailable.'); }
    }
  }

  function choose(record: SearchRecord) {
    setSelected(record);
    onFocus(record);
  }

  return <section id="global-search" className="thematic-controls global-search" aria-label="Global Search" data-search-state={state}>
    <h2>Search</h2>
    <p>Global static index · source-backed names and aliases only</p>
    <form role="search" onSubmit={event => { event.preventDefault(); void submit(); }}>
      <label className="thematic-picker">Search the atlas<input type="search" value={query} placeholder="Everest, Bagmati, RGI ID, hydropower, landslide…" onChange={event => setQuery(event.target.value)} /></label>
      <button type="submit" disabled={state === 'loading'}>Search atlas</button>
    </form>
    <p className={state === 'error' ? 'data-state error' : 'muted'} aria-live="polite">{message}</p>
    {submitted && <p className="muted">Query: <strong>{submitted}</strong>. Diacritics are normalized; different-script transliterations are used only when a source-backed alias exists.</p>}
    {groups.map(type => <section className="search-result-group" key={type} aria-label={LABELS[type]}>
      <h3>{LABELS[type]}</h3>
      <ul>{results.filter(item => item.type === type).map(record => <li key={record.key}>
        <button type="button" className="search-result" onClick={() => choose(record)}>
          <strong>{record.name}</strong><span>{record.context}</span><span>{record.dataset_id}@{record.dataset_version}{record.date ? ` · ${record.date}` : ''}</span>
        </button>
        {record.detail_href ? <Link href={record.detail_href}>Open detailed event page</Link> : null}
      </li>)}</ul>
    </section>)}
    {selected && <div className="selection" aria-live="polite">
      <p className="eyebrow">{selected.type.replace('_', ' ')}</p><h3>{selected.name}</h3>
      {hasAmbiguousName(results, selected) ? <p><strong>Ambiguous name:</strong> another indexed entity has this canonical name. The type, context and stable identity below distinguish this selection.</p> : null}
      <dl><dt>Context</dt><dd>{selected.context}</dd><dt>Stable ID</dt><dd>{selected.source_id}</dd><dt>Dataset</dt><dd>{selected.dataset_id}@{selected.dataset_version}</dd><dt>Source date</dt><dd>{selected.date ?? 'UNKNOWN'}</dd><dt>Coordinates</dt><dd>{selected.latitude.toFixed(5)}, {selected.longitude.toFixed(5)}</dd></dl>
      <p className="muted">Selecting a result focuses its indexed representative position when the map is available. Search never manufactures a name absent from the verified source releases.</p>
    </div>}
  </section>;
}
