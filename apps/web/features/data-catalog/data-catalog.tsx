'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { filterProvenanceRecords, type ProvenanceCategory, type ProvenanceRecord } from '../../../../packages/contracts/provenance';

function formatDate(value: string | null) {
  return value ?? 'UNKNOWN / not applicable';
}

function EvidenceBadge({ record }: { record: ProvenanceRecord }) {
  return <span className={`badge evidence-label evidence-${record.evidence_type}`}>Evidence: {record.evidence_type}</span>;
}

export function DataCatalog({ records }: { records: ProvenanceRecord[] }) {
  const categories = useMemo(() => [...new Set(records.map(record => record.category))].sort(), [records]);
  const sources = useMemo(() => [...new Set(records.filter(record => record.state === 'current' && !record.is_fixture).map(record => record.source))].sort(), [records]);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<ProvenanceCategory | ''>('');
  const [source, setSource] = useState('');
  const [includeNonCurrent, setIncludeNonCurrent] = useState(false);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const catalogRef = useRef<HTMLDivElement>(null);
  const detailRef = useRef<HTMLElement>(null);
  const filtered = useMemo(() => filterProvenanceRecords(records, { query, category, source, includeNonCurrent }), [records, query, category, source, includeNonCurrent]);
  const selected = records.find(record => record.key === selectedKey) ?? null;

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('dataset'); const version = params.get('version');
    const match = records.find(record => record.id === id && (!version || record.version === version));
    if (match) queueMicrotask(() => { setIncludeNonCurrent(match.state !== 'current' || match.is_fixture); setSelectedKey(match.key); });
  }, [records]);

  useEffect(() => {
    if (catalogRef.current) catalogRef.current.dataset.catalogInteractive = 'ready';
  }, []);

  function select(record: ProvenanceRecord) {
    setSelectedKey(record.key);
    const params = new URLSearchParams(window.location.search);
    params.set('dataset', record.id); params.set('version', record.version);
    window.history.replaceState(null, '', `${window.location.pathname}?${params.toString()}#catalog-detail`);
  }

  function activateFromKeyboard(event: React.KeyboardEvent<HTMLButtonElement>, record: ProvenanceRecord) {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    // Prevent the browser from synthesizing its own click/focus sequence.
    // This keeps the dynamic-detail focus move deterministic for keyboard users.
    event.preventDefault();
    event.stopPropagation();
    select(record);
    setTimeout(() => detailRef.current?.focus({ preventScroll: true }), 0);
  }

  return <div ref={catalogRef} className="catalog-browser" data-catalog-interactive="loading">
    <form className="catalog-filters" role="search" onSubmit={event => event.preventDefault()}>
      <label>Search datasets<input type="search" value={query} placeholder="Glacier, WorldPop, HydroRIVERS, scenario…" onChange={event => setQuery(event.target.value)} /></label>
      <label>Category<select value={category} onChange={event => setCategory(event.target.value as ProvenanceCategory | '')}><option value="">All categories</option>{categories.map(value => <option key={value}>{value}</option>)}</select></label>
      <label>Source<select value={source} onChange={event => setSource(event.target.value)}><option value="">All sources</option>{sources.map(value => <option key={value}>{value}</option>)}</select></label>
      <label className="catalog-noncurrent"><input type="checkbox" checked={includeNonCurrent} onChange={event => setIncludeNonCurrent(event.target.checked)} /> Include superseded releases and development fixtures</label>
    </form>
    <p className="muted" role="status" aria-live="polite">{filtered.length} release record{filtered.length === 1 ? '' : 's'} shown. Current production releases are the default.</p>
    <div className="catalog-layout">
      <section aria-label="Dataset results" className="catalog-results">
        {categories.map(group => {
          const items = filtered.filter(record => record.category === group);
          return items.length ? <section key={group} className="catalog-group"><h2>{group}</h2><ul>{items.map(record => <li key={record.key}>
            <button className="catalog-record" type="button" aria-pressed={selectedKey === record.key} aria-controls="catalog-detail" onClick={() => select(record)} onKeyDown={event => activateFromKeyboard(event, record)}>
              <strong>{record.title}</strong><span>{record.id}@{record.version}</span><span>{record.source}</span>
              <span className="badges"><EvidenceBadge record={record} />{record.state !== 'current' && <span className="badge">{record.state.toUpperCase()}</span>}</span>
            </button>
          </li>)}</ul></section> : null;
        })}
        {!filtered.length && <p className="data-state">No catalog record matches these filters. This does not imply the dataset or real-world feature is absent.</p>}
      </section>
      <section ref={detailRef} id="catalog-detail" className="catalog-detail" tabIndex={-1} aria-label="Dataset detail">
        {selected ? <>
          <p className="eyebrow">{selected.category}</p><h2>{selected.title}</h2>
          <div className="badges"><EvidenceBadge record={selected} /><span className="badge">{selected.status}</span>{selected.state !== 'current' && <span className="badge">{selected.state.toUpperCase()}</span>}</div>
          {selected.state === 'superseded' && <p className="data-state">This checked-in version is superseded by a newer release. It remains visible for reproducibility and lineage.</p>}
          <dl>
            <dt>Stable identity</dt><dd>{selected.key}</dd><dt>Source</dt><dd>{selected.source_url ? <a href={selected.source_url}>{selected.source}</a> : selected.source}</dd>
            <dt>Dataset version</dt><dd>{selected.version}</dd><dt>Access date</dt><dd>{formatDate(selected.access_date)}</dd><dt>Observation date</dt><dd>{formatDate(selected.observation_date)}</dd>
            <dt>Publication date</dt><dd>{formatDate(selected.publication_date)}</dd><dt>Processing date</dt><dd>{formatDate(selected.processing_date)}</dd><dt>Processing version</dt><dd>{selected.processing_version}</dd>
            <dt>Resolution</dt><dd>{selected.spatial_resolution}</dd><dt>Spatial coverage</dt><dd>{selected.spatial_coverage}</dd><dt>Temporal coverage</dt><dd>{selected.temporal_coverage}</dd>
            <dt>License</dt><dd>{selected.license_url ? <a href={selected.license_url}>{selected.license}</a> : selected.license}</dd><dt>Manifest SHA-256</dt><dd><code>{selected.manifest_sha256}</code></dd>
          </dl>
          <h3>Processing and transformation</h3><p>{selected.method}</p><ol>{selected.transformations.map(step => <li key={step}>{step}</li>)}</ol>
          <h3>Parent inputs</h3>{selected.parents.length ? <ul>{selected.parents.map(parent => <li key={`${parent.id}@${parent.version}`}><strong>{parent.id}@{parent.version}</strong> — {parent.source}{parent.manifest_path ? <> · <a href={parent.manifest_path}>manifest</a></> : null}</li>)}</ul> : <p>No Atlas parent release is declared; this record is source-level or its external source is cited directly.</p>}
          <h3>Uncertainty and limitations</h3><p>{selected.uncertainty}</p><ul>{selected.limitations.map(item => <li key={item}>{item}</li>)}</ul>
          <h3>Published artifacts</h3><ul>{selected.artifacts.map(artifact => <li key={artifact.path}><a href={artifact.path}>{artifact.path}</a> · {artifact.byte_size.toLocaleString('en-US')} bytes · <code>{artifact.sha256}</code></li>)}</ul>
          <nav className="catalog-detail-links" aria-label="Dataset related links">{selected.map_href && <Link href={selected.map_href}>Open Atlas</Link>}<Link href={selected.methodology_href}>Methodology</Link><Link href={selected.source_href}>Source directory</Link><a href={selected.manifest_path}>Raw manifest</a></nav>
          <p className="muted">No acquisition credentials, tokens or private source configuration are published in this catalog.</p>
        </> : <><h2>Dataset details</h2><p>Select a catalog record to inspect exact source, version, lineage, dates, processing, limitations and artifact checksums.</p></>}
      </section>
    </div>
  </div>;
}
