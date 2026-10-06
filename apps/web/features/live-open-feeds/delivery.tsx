'use client';
import { useEffect, useRef, useState } from 'react';
import { EVIDENCE_LABELS, LIVE_AUTHORITIES, liveFreshness, PRODUCT_LABELS, workflowHealth } from '../../../../packages/contracts/live';
import { loadLivePublication, watchLiveClock, type LivePublication } from '../../lib/live';
import { AIR_QUALITY_STATUS } from '../../../../packages/contracts/live-air-quality';
import type { Resource } from '../../lib/resource';
import { UnavailableError } from '../../lib/datasets';
export function LiveDeliveryChecks() {
  const [resource, setResource] = useState<Resource<LivePublication> | null>(null);
  const [now, setNow] = useState(0);
  const controller = useRef<AbortController | null>(null);
  useEffect(() => watchLiveClock(setNow), []);
  useEffect(() => () => controller.current?.abort(), []);
  async function load() {
    controller.current?.abort(); const active = new AbortController(); controller.current = active;
    setResource({ status: 'loading' });
    try { const data = await loadLivePublication(active.signal); if (!active.signal.aborted) setResource({ status: 'ready', data }); }
    catch (error) { if (!active.signal.aborted) setResource({ status: error instanceof UnavailableError ? 'unavailable' : 'error', message: error instanceof Error ? error.message : 'Publication unavailable.' }); }
  }
  const data = resource && 'data' in resource ? resource.data : null;
  return <section id="live-delivery" aria-label="Live feed delivery">
    <h2>Periodically updated feed delivery</h2>
    <p>Manually published USGS reported earthquakes and NOAA GFS model forecasts. No scheduled acquisition is active. Updates reach this site only through a verified static deployment.</p>
    <button type="button" onClick={load} disabled={resource?.status === 'loading'}>Check published feeds</button>
    <p role="status">{resource ? `Publication: ${resource.status.toUpperCase()}` : 'No publication checked in this session.'}</p>
    {resource && 'message' in resource && <p>{resource.message}</p>}
    {data && <><p>Workflow health: <strong>{workflowHealth(data.index, now)}</strong> · Last successful fetch: <time>{data.index.workflow.last_successful_fetch_at ?? 'UNKNOWN'}</time></p>
      {data.index.workflow.run_url && <p><a href={data.index.workflow.run_url}>Acquisition workflow run</a></p>}
      {data.deliveries.map(({ feed, snapshot, error }) => {
        const freshness = liveFreshness(data.index, feed, snapshot, now);
        return <section key={feed.feed_id} aria-label={`${feed.feed_id} delivery`} data-feed-state={error ? 'error' : freshness.status}>
          <h3>{feed.feed_id}</h3><p><strong>{error ? 'UNAVAILABLE — verification failed' : freshness.status.toUpperCase()}</strong> · {error ?? freshness.reason}</p>
          <p>Last attempt: {feed.last_attempt_at ?? 'UNKNOWN'} · Last successful fetch: {feed.last_successful_fetch_at ?? 'UNKNOWN'}</p>
          {snapshot && <><p>{EVIDENCE_LABELS[snapshot.evidence_type]} · {PRODUCT_LABELS[snapshot.product_type]} · {snapshot.records.length} records</p>
            <p>Source issue: {snapshot.source_issued_at ?? 'UNKNOWN'} · fetched_at: {snapshot.fetched_at} · freshness deadline: {freshness.deadline ?? 'UNKNOWN'}</p>
            <p><a href={snapshot.source.url}>{snapshot.source.name}</a> · {snapshot.source.license} · {snapshot.source.version ?? 'UNKNOWN'}</p>
            <p>{snapshot.limitations.join(' ')}</p>
            <p><a href={feed.snapshot!.path}>Snapshot JSON</a> · <a href={feed.snapshot!.path.replace('/snapshot.json', '/manifest.json')}>Provenance, source review and checksums</a></p>
          </>}
        </section>;
      })}</>}
    <section aria-label="Air quality availability"><h3>Air quality — PM2.5</h3><p>{AIR_QUALITY_STATUS}. OFF in the public build. No provider readings are loaded. AQI: UNKNOWN.</p></section>
    <p>Damage, loss, inundation and casualties: UNKNOWN.</p>
    <p>Official warning authorities: {LIVE_AUTHORITIES.map((authority, i) => <span key={authority.name}>{i > 0 && ' · '}<a href={authority.url}>{authority.name}</a></span>)}.</p>
  </section>;
}
