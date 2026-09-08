'use client';

import { useRef, useState } from 'react';
import { compareEntities, formatCompareValue, type CompareEntity, type CompareResult } from '../../../../packages/contracts/compare';
import type { SearchRecord } from '../../../../packages/contracts/search';
import { loadCompareEntity } from '../../lib/compare';
import { searchAtlas } from '../../lib/search';

const SUPPORTED = new Set(['administrative_unit', 'mountain', 'river', 'glacier', 'glacial_lake', 'event']);

function selectable(record: SearchRecord) {
  return SUPPORTED.has(record.type) && (record.type !== 'administrative_unit' || record.context.startsWith('district ·'));
}

function SearchPicker({ side, value, onChange }: { side: 'A' | 'B'; value: SearchRecord | null; onChange: (record: SearchRecord | null) => void }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchRecord[]>([]);
  const [state, setState] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle');
  const [message, setMessage] = useState('Search for a supported entity.');
  const request = useRef<AbortController | null>(null);

  async function find() {
    const term = query.trim();
    onChange(null);
    if (term.length < 2) { setResults([]); setState('ready'); setMessage('Enter at least two characters.'); return; }
    request.current?.abort();
    const controller = new AbortController(); request.current = controller;
    setState('loading'); setMessage('Searching verified index…');
    try {
      const response = await searchAtlas(term, controller.signal);
      if (controller.signal.aborted) return;
      const filtered = response.results.filter(selectable);
      setResults(filtered); setState('ready');
      setMessage(filtered.length ? `${filtered.length} supported matches shown.` : 'No supported comparison entity matched this query.');
    } catch (error) {
      if (!controller.signal.aborted) { setResults([]); setState('error'); setMessage(error instanceof Error ? error.message : 'Compare search unavailable.'); }
    }
  }

  return <fieldset className="compare-picker" data-compare-picker-state={state}>
    <legend>Entity {side}</legend>
    <form role="search" onSubmit={event => { event.preventDefault(); void find(); }}>
      <label>Search {side}<input type="search" value={query} placeholder="Everest, district, RGI ID…" onChange={event => setQuery(event.target.value)} /></label>
      <button type="submit" disabled={state === 'loading'}>Find {side}</button>
    </form>
    <p className={state === 'error' ? 'data-state error' : 'muted'} aria-live="polite">{message}</p>
    <label>Entity {side}<select value={value?.key ?? ''} disabled={!results.length} onChange={event => onChange(results.find(record => record.key === event.target.value) ?? null)}>
      <option value="">Select entity {side}…</option>
      {results.map(record => <option key={record.key} value={record.key}>{record.name} — {record.context}</option>)}
    </select></label>
  </fieldset>;
}

function coverage(entity: CompareEntity) {
  const { start, end } = entity.provenance.temporal_coverage;
  return start && end ? `${start} → ${end}` : 'UNKNOWN';
}

function ProvenanceTable({ a, b }: { a: CompareEntity; b: CompareEntity }) {
  const rows = [
    ['Entity type', a.type, b.type],
    ['Stable source ID', a.source_id, b.source_id],
    ['Source', a.provenance.source, b.provenance.source],
    ['Dataset / version', `${a.provenance.dataset_id}@${a.provenance.dataset_version}`, `${b.provenance.dataset_id}@${b.provenance.dataset_version}`],
    ['Feature date', a.provenance.feature_date ?? 'UNKNOWN', b.provenance.feature_date ?? 'UNKNOWN'],
    ['Observation date', a.provenance.observation_date ?? 'UNKNOWN', b.provenance.observation_date ?? 'UNKNOWN'],
    ['Temporal coverage', coverage(a), coverage(b)],
    ['Spatial resolution', a.provenance.spatial_resolution, b.provenance.spatial_resolution],
    ['Evidence type', a.provenance.evidence_type, b.provenance.evidence_type],
  ];
  return <table className="compare-table"><caption>Source, date, version and resolution</caption><thead><tr><th scope="col">Provenance</th><th scope="col">A · {a.label}</th><th scope="col">B · {b.label}</th></tr></thead><tbody>
    {rows.map(([label, left, right]) => <tr key={label}><th scope="row">{label}</th><td>{left}</td><td>{right}</td></tr>)}
  </tbody></table>;
}

export function CompareMode({ onFocus }: { onFocus: (a: SearchRecord, b: SearchRecord) => void }) {
  const [choiceA, setChoiceA] = useState<SearchRecord | null>(null);
  const [choiceB, setChoiceB] = useState<SearchRecord | null>(null);
  const [entities, setEntities] = useState<[CompareEntity, CompareEntity] | null>(null);
  const [result, setResult] = useState<CompareResult | null>(null);
  const [state, setState] = useState<'idle' | 'loading' | 'ready' | 'blocked' | 'error'>('idle');
  const [message, setMessage] = useState('Choose two supported entities. Only scientifically compatible definitions are compared.');
  const request = useRef<AbortController | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  async function runComparison() {
    if (!choiceA || !choiceB) { setState('blocked'); setMessage('Choose both entity A and entity B before comparing.'); return; }
    request.current?.abort();
    const controller = new AbortController(); request.current = controller;
    setState('loading'); setMessage('Loading the two exact versioned source records…'); setResult(null); setEntities(null);
    try {
      const [a, b] = await Promise.all([loadCompareEntity(choiceA, controller.signal), loadCompareEntity(choiceB, controller.signal)]);
      if (controller.signal.aborted) return;
      if (!a || !b) { setState('blocked'); setMessage('This entity type is indexed but not supported by the current comparison contract.'); return; }
      const comparison = compareEntities(a, b);
      setEntities([a, b]); setResult(comparison); onFocus(choiceA, choiceB);
      if (comparison.state === 'blocked') { setState('blocked'); setMessage(comparison.reason ?? 'Comparison blocked.'); }
      else { setState('ready'); setMessage('Compatible source metrics are shown side by side. No better/worse ranking is calculated.'); }
      requestAnimationFrame(() => resultRef.current?.focus());
    } catch (error) {
      if (!controller.signal.aborted) { setState('error'); setMessage(error instanceof Error ? error.message : 'Comparison source unavailable.'); }
    }
  }

  return <section id="compare-mode" className="thematic-controls compare-mode" aria-label="Compare Mode" data-compare-state={state}>
    <h2>Compare mode</h2>
    <p>Districts, mountains, river reaches, glaciers, glacial lakes, BIPAD disaster events and USGS earthquakes.</p>
    <p className="muted">Same-type only. Sharing a unit is not enough: metric meaning and source definition must also be compatible. Versioned Location Explorer snapshots are not yet published, so arbitrary locations are not comparable here.</p>
    <div className="compare-pickers"><SearchPicker side="A" value={choiceA} onChange={setChoiceA} /><SearchPicker side="B" value={choiceB} onChange={setChoiceB} /></div>
    <button type="button" disabled={state === 'loading'} onClick={() => void runComparison()}>Compare selected</button>
    <p className={state === 'error' || state === 'blocked' ? 'data-state error' : 'muted'} aria-live="polite">{message}</p>
    {entities && <div ref={resultRef} tabIndex={-1} className="compare-results" aria-label="Comparison results">
      {result?.state === 'ready' ? <table className="compare-table"><caption>Scientifically compatible metrics</caption><thead><tr><th scope="col">Metric</th><th scope="col">A · {entities[0].label}</th><th scope="col">B · {entities[1].label}</th><th scope="col">Compatibility</th></tr></thead><tbody>
        {result.rows.map(row => <tr key={row.key}><th scope="row">{row.label}</th><td>{formatCompareValue(row.a, row.unit_a)}{row.basis_a ? <span className="compare-basis">{row.basis_a}</span> : null}</td><td>{formatCompareValue(row.b, row.unit_b)}{row.basis_b ? <span className="compare-basis">{row.basis_b}</span> : null}</td><td>{row.state === 'comparable' ? 'Comparable definition' : row.state === 'unavailable' ? `UNAVAILABLE — ${row.reason}` : `NOT COMPARABLE — ${row.reason}`}</td></tr>)}
      </tbody></table> : null}
      <ProvenanceTable a={entities[0]} b={entities[1]} />
    </div>}
    <p className="muted">The table never ranks entities. Reported, derived, estimated or modelled bases remain labelled. Unsupported values stay UNKNOWN or NOT COMPARABLE rather than being converted or guessed.</p>
  </section>;
}
