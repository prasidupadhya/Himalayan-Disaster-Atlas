'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import type { Dataset } from '../../../../packages/contracts';
import type { EventPage } from '../../../../packages/contracts/event-page';
import { DataState } from '../../components/data-state';
import { Evidence } from '../../components/evidence';
import { EVENT_YEARS, loadEventYear, verifiedEventPages } from '../../lib/event-pages';
import { UnavailableError } from '../../lib/datasets';
import type { Resource } from '../../lib/resource';

function number(value: number | null, unit: 'person' | 'NPR') {
  if (value === null) return 'UNKNOWN';
  return unit === 'NPR' ? `NPR ${value.toLocaleString('en-US')}` : `${value.toLocaleString('en-US')} people`;
}

function sourcePath(page: EventPage) {
  return <p className="claim-source"><strong>Source record:</strong> <code>{page.location.source_path}</code></p>;
}

export function EventPages() {
  const [year, setYear] = useState(2026);
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState('');
  const [resource, setResource] = useState<Resource<Dataset>>({ status: 'loading' });
  const [attempt, setAttempt] = useState(0);
  const dataset = 'data' in resource ? resource.data : null;

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const requestedYear = Number(params.get('year'));
    const requestedId = params.get('id');
    queueMicrotask(() => {
      if (EVENT_YEARS.includes(requestedYear as (typeof EVENT_YEARS)[number])) {
        setResource({ status: 'loading' });
        setYear(requestedYear);
      }
      if (requestedId) setSelected(requestedId);
    });
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    void loadEventYear(year, controller.signal).then(data => {
      if (!controller.signal.aborted) setResource({ status: data.collection.features.length ? 'ready' : 'empty', data });
    }).catch(error => {
      if (!controller.signal.aborted) setResource({
        status: error instanceof UnavailableError ? 'unavailable' : 'error',
        message: error instanceof Error ? error.message : 'Historical event records unavailable',
      });
    });
    return () => controller.abort();
  }, [year, attempt]);

  const pages = useMemo(() => dataset ? verifiedEventPages(dataset, year, query) : [], [dataset, year, query]);
  const page = selected ? (() => {
    try { return dataset ? verifiedEventPages(dataset, year).find(item => item.event_id === selected) ?? null : null; }
    catch { return null; }
  })() : null;

  function choose(id: string) {
    setSelected(id);
    const params = new URLSearchParams(window.location.search);
    params.set('year', String(year));
    if (id) params.set('id', id); else params.delete('id');
    window.history.replaceState(null, '', `${window.location.pathname}?${params.toString()}`);
  }

  return <div className="page event-pages" data-event-pages-state={resource.status}>
    <p className="eyebrow">Historical events / evidence pages</p>
    <h1>Verified disaster event records</h1>
    <p className="intro">Read source-backed BIPAD incident records without opening the map. These pages organize reported facts; they do not add a narrative, mechanism, footprint, or damage interpretation that the source does not provide.</p>
    <DataState state={resource} retry={() => { setResource({ status: 'loading' }); setAttempt(value => value + 1); }} />
    <div className="event-page-controls">
      <label>Year<select value={year} onChange={event => { setResource({ status: 'loading' }); setYear(Number(event.target.value)); setSelected(''); }}>
        {EVENT_YEARS.map(item => <option key={item} value={item}>{item}</option>)}
      </select></label>
      <label>Search this year<input type="search" value={query} placeholder="hazard, location, incident ID…" onChange={event => setQuery(event.target.value)} /></label>
      <label>Verified event<select value={page ? selected : ''} disabled={!dataset} onChange={event => choose(event.target.value)}>
        <option value="">Select a verified event…</option>
        {pages.map(item => <option key={item.event_id} value={item.event_id}>{item.date.slice(0, 10)} · {item.hazard.value} · {item.title}</option>)}
      </select></label>
    </div>
    {dataset && <p className="muted">Showing up to 200 verified + approved source records for {year}. Search narrows this year partition only.</p>}

    {page && dataset ? <article className="event-case-study" aria-live="polite">
      <p className="eyebrow">{page.hazard.value} · source-reported event</p>
      <h2>{page.title}</h2>
      <dl>
        <dt>Incident time</dt><dd>{page.date}</dd>
        <dt>Location text</dt><dd>{page.location.label ?? 'UNKNOWN'}</dd>
        <dt>Reported point</dt><dd>{page.location.latitude.toFixed(5)}, {page.location.longitude.toFixed(5)}</dd>
        <dt>Verification</dt><dd>verified {page.verification.verified ? 'yes' : 'no'} · approved {page.verification.approved ? 'yes' : 'no'}</dd>
      </dl>
      {sourcePath(page)}

      <h3>Description</h3>
      <p>{page.description.value ?? 'UNKNOWN — this source record contains no event description.'}</p>
      {sourcePath(page)}

      <h3>Source-reported impacts</h3>
      <dl>{page.impacts.map(item => <span className="event-impact-row" key={item.kind}><dt>{item.kind.replace('_', ' ')}</dt><dd>{number(item.value, item.unit)}</dd></span>)}</dl>
      {sourcePath(page)}
      <p className="muted">A zero is shown only when the source records zero. Missing values remain UNKNOWN.</p>

      <h3>Timeline</h3>
      <ol>{page.timeline.map(item => <li key={item.label}><strong>{item.label}:</strong> {item.time}</li>)}</ol>
      {sourcePath(page)}

      <h3>Geographic context</h3>
      <p>This page uses the source-reported incident point only. It does not claim an affected area, hazard footprint, or causal relationship with nearby atlas layers.</p>
      <p><Link href={`/atlas/?lon=${page.location.longitude}&lat=${page.location.latitude}`}>Open this reported point in the Atlas →</Link></p>

      <h3>Uncertainty and limitations</h3>
      <ul>{page.uncertainty.map(item => <li key={item}>{item}</li>)}</ul>

      <h3>Evidence and navigation</h3>
      <p><Link href={`/data-catalog/`}>Data catalog</Link> · <Link href="/sources/">Sources</Link> · <Link href="/methodology/">Methodology</Link></p>
      <details><summary>Event archive evidence</summary><Evidence metadata={dataset.metadata} /></details>
    </article> : <section className="event-case-study empty-case"><h2>Select a verified event</h2><p>The event reader will show only fields present in the validated source record. Unsupported casualty, damage, area, mechanism, or financial details remain UNKNOWN or are omitted.</p></section>}
  </div>;
}
