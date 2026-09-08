'use client';
import { useEffect, useState } from 'react';
import { canCompare, observationOnDay, type TemporalIndex, type TemporalProductId, type TemporalSelection } from '../../../../packages/contracts/temporal';
import { loadTimeIndex } from '../../lib/time-machine';
import type { Resource } from '../../lib/resource';
import { UnavailableError } from '../../lib/datasets';
import { DataState } from '../../components/data-state';

export function TimeMachine({ value, onChange }: { value: TemporalSelection | null; onChange: (value: TemporalSelection | null) => void }) {
  const [resource, setResource] = useState<Resource<TemporalIndex>>({ status: 'loading' });
  const [attempt, setAttempt] = useState(0);
  const [productId, setProductId] = useState<TemporalProductId>('water');
  const [local, setLocal] = useState<TemporalSelection>({ date: '2025-04-01', before: '2024-04-19' });
  const selection = value ?? local;
  useEffect(() => {
    const controller = new AbortController();
    void loadTimeIndex(controller.signal).then(data => setResource({ status: 'ready', data })).catch(error => {
      if (!controller.signal.aborted) setResource({ status: error instanceof UnavailableError ? 'unavailable' : 'error', message: error instanceof Error ? error.message : 'Time index unavailable' });
    });
    return () => controller.abort();
  }, [attempt]);
  const index = 'data' in resource ? resource.data : null;
  const product = index?.products.find(p => p.id === productId);
  const dates = product?.observations.map(o => o.start.slice(0, 10)) ?? [];
  const previous = dates.filter(d => d < selection.date).at(-1);
  const next = dates.find(d => d > selection.date);
  function change(update: Partial<TemporalSelection>) { const next = { ...selection, ...update }; setLocal(next); if (value) onChange(next); }
  return <section className="thematic-controls" aria-label="Time Machine" data-time-machine-state={resource.status}>
    <h2>Time Machine</h2><p>One UTC date for water, satellite imagery, monthly climate and reported disaster events.</p>
    <DataState state={resource} retry={() => { setResource({ status: 'loading' }); setAttempt(v => v + 1); }} />
    <label><input type="checkbox" checked={Boolean(value)} disabled={!index} onChange={e => onChange(e.target.checked ? local : null)} /> Synchronize observation date</label>
    <label className="thematic-picker">Observation date (UTC)<input type="date" value={selection.date} disabled={!index} onChange={e => { if (e.target.value) change({ date: e.target.value }); }} /></label>
    <label className="thematic-picker">Browse available dates for<select value={productId} onChange={e => setProductId(e.target.value as TemporalProductId)}><option value="water">Water Change</option><option value="satellite">Satellite</option><option value="climate">Climate months</option><option value="events">Disaster event days</option></select></label>
    <label className="thematic-picker">Available observations<select value={dates.includes(selection.date) ? selection.date : ''} disabled={!product} onChange={e => { if (e.target.value) change({ date: e.target.value }); }}><option value="">Choose an indexed observation…</option>{product?.observations.map(o => <option key={o.id} value={o.start.slice(0, 10)}>{product.resolution === 'month' ? o.start.slice(0, 7) : o.start.slice(0, 10)}{o.count !== null ? ` · ${o.count} reported events` : ''}</option>)}</select></label>
    <div className="temporal-navigation"><button disabled={!previous} onClick={() => change({ date: previous! })}>Previous available</button><button disabled={!next} onClick={() => change({ date: next! })}>Next available</button></div>
    <label className="thematic-picker">Compare water with earlier date (UTC)<input type="date" value={selection.before} disabled={!index} onChange={e => change({ before: e.target.value })} /></label>
    {value && index && <div aria-live="polite"><p><strong>Active UTC date: {value.date}</strong></p>{index.products.map(p => {
      const observation = observationOnDay(p, value.date);
      const before = value.before ? observationOnDay(p, value.before) : null;
      return <div className="selection" key={p.id} data-temporal-product={p.id}><strong>{p.label}</strong><p>{observation ? p.resolution === 'month' ? `${observation.id} · whole monthly aggregate; no daily estimate` : p.resolution === 'day' ? `${observation.count} reported events on this UTC day` : `Acquired ${observation.acquired_at} · ${observation.sensor}` : 'UNAVAILABLE — no indexed observation for this date.'}</p><p>{p.dataset_id}@{p.version} · {p.source}</p>
        {p.id === 'water' && <p>{before && observation && canCompare(before, observation) ? 'Date/grid-compatible pair; Water Change applies the quality coverage gate.' : 'Water comparison unavailable: missing, equal, reversed or incompatible dates.'}</p>}
        <details><summary>Dates and temporal precision</summary><dl><dt>Resolution</dt><dd>{p.resolution}</dd><dt>Observed interval (UTC, end exclusive)</dt><dd>{observation ? `${observation.start} → ${observation.end}` : 'UNKNOWN'}</dd><dt>Source publication / item creation</dt><dd>{observation?.published_at ?? p.published_at ?? 'UNKNOWN'}</dd><dt>Retrieved</dt><dd>{p.retrieved_at}</dd></dl></details>
      </div>;
    })}</div>}
    {value && <p><a href="#atlas-map">View the active map</a> · Other inventory layers retain their own dates.</p>}
    <p className="muted">Missing dates stay unavailable. Previous/next moves only when requested. Monthly climate stays monthly. Different satellite windows cannot form a change comparison. Water sensor differences remain part of its uncertainty.</p>
    <details><summary>Other layers retain their own inventory dates</summary><p>Boundaries, terrain, inventories, event-specific products and exposure scenarios are context; they are not reconstructed for the selected day.</p>{index?.context.map(p => <p key={`${p.dataset_id}@${p.version}`}>{p.dataset_id}@{p.version}: {p.observation_date ?? `${p.coverage.start ?? 'UNKNOWN'} to ${p.coverage.end ?? 'UNKNOWN'}`} · {p.resolution ?? 'UNKNOWN'} resolution</p>)}</details>
  </section>;
}
