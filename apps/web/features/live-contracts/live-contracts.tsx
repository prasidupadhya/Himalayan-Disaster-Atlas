'use client';

import { Fragment, useEffect, useRef, useState } from 'react';
import manifest from '../../public/data/atlas-live-contracts/1.0.0/manifest.json';
import { EVIDENCE_LABELS, LIVE_AUTHORITIES, liveFreshness, PRODUCT_LABELS, SCENARIO_NOTICE, workflowHealth } from '../../../../packages/contracts/live';
import { loadLiveFeed, watchLiveClock, type VerifiedLiveFeed } from '../../lib/live';
import { UnavailableError } from '../../lib/datasets';
import type { Resource } from '../../lib/resource';

const CASES = {
  ready: 'Successful fetch with a synthetic record', empty: 'Successful fetch with no records',
  failed: 'Failed fetch with a retained snapshot', unavailable: 'Feed not configured', unknown: 'UNKNOWN source freshness',
} as const;
type Case = keyof typeof CASES;

export function LiveContractChecks() {
  const [selected, setSelected] = useState<Case>('ready');
  const [resource, setResource] = useState<Resource<VerifiedLiveFeed> | null>(null);
  const [now, setNow] = useState(0);
  const controller = useRef<AbortController | null>(null);
  useEffect(() => () => controller.current?.abort(), []);

  function change(value: Case) { controller.current?.abort(); setSelected(value); setResource(null); }
  async function verify() {
    controller.current?.abort();
    const active = new AbortController(); controller.current = active;
    setResource({ status: 'loading' });
    try {
      const reference = manifest.artifacts[`index-${selected}`];
      const data = await loadLiveFeed(reference, 'contract-fixture', active.signal, true);
      if (!active.signal.aborted) setResource({ status: 'ready', data });
    } catch (error) {
      if (!active.signal.aborted) setResource({ status: error instanceof UnavailableError ? 'unavailable' : 'error', message: error instanceof Error ? error.message : 'Live contract could not be verified.' });
    }
  }

  const data = resource && 'data' in resource ? resource.data : null;
  const freshness = data ? liveFreshness(data.index, data.index.feeds[0], data.snapshot, now) : null;
  const state = freshness?.status ?? resource?.status ?? 'not_loaded';
  const deadline = data?.index.workflow.last_attempt_at ? new Date(Math.min(
    Date.parse(data.index.workflow.last_attempt_at) + data.index.workflow.stale_after_seconds * 1000,
    freshness?.deadline ? Date.parse(freshness.deadline) : Infinity,
  )).toISOString() : null;
  useEffect(() => watchLiveClock(setNow, deadline), [deadline]);
  return <section id="live-contract-checks" aria-label="Live contract verification">
    <h2>Live contract verification</h2>
    <p>Feature 42 prepares contracts for periodically updated conditions. Source acquisition is not configured in this feature.</p>
    <details><summary>Inspect synthetic contract cases</summary>
      <p><strong>SYNTHETIC FIXTURE — not current conditions.</strong> These cases contain no measurements or locations. Every timestamp and workflow result is a fixed test input, not an actual fetch.</p>
      <p>{SCENARIO_NOTICE}</p>
      <label htmlFor="live-contract-case">Contract case</label>
      <select id="live-contract-case" value={selected} onChange={event => change(event.target.value as Case)}>{Object.entries(CASES).map(([id, label]) => <option key={id} value={id}>{label}</option>)}</select>
      <button type="button" onClick={verify} disabled={resource?.status === 'loading'}>Verify synthetic contract</button>
      <section aria-label="Synthetic live contract result" data-live-contract-state={state}>
        <p role="status" aria-live="polite">{state === 'not_loaded' ? 'Select a case and verify its immutable artifacts.' : `Contract resource: ${state.toUpperCase()}`}</p>
        {resource && 'message' in resource && <p>{resource.message}</p>}
        {data && <>
          <p>{freshness?.reason}</p>
          <dl>
            <dt>Fixture workflow health</dt><dd>{workflowHealth(data.index, now)}</dd>
            <dt>Fixture last successful fetch</dt><dd>{data.index.workflow.last_successful_fetch_at ?? 'UNKNOWN'}</dd>
            <dt>Fixture last attempt</dt><dd>{data.index.workflow.last_attempt_at ?? 'UNKNOWN'}</dd>
            <dt>Source freshness deadline</dt><dd>{freshness?.deadline ?? 'UNKNOWN'}</dd>
            <dt>Evidence</dt><dd>{data.snapshot ? EVIDENCE_LABELS[data.snapshot.evidence_type] : 'UNKNOWN'}</dd>
            <dt>Product</dt><dd>{data.snapshot ? PRODUCT_LABELS[data.snapshot.product_type] : 'UNKNOWN'}</dd>
            <dt>Records in this synthetic case</dt><dd>{data.snapshot?.records.length ?? 'UNKNOWN'}</dd>
          </dl>
          {data.snapshot && <><h3>Unsupported physical and loss outputs</h3><dl>{Object.keys(data.snapshot.unsupported_outputs).map(key => <Fragment key={key}><dt>{key.replaceAll('_', ' ')}</dt><dd>UNKNOWN</dd></Fragment>)}</dl><p>{data.snapshot.limitations.join(' ')}</p></>}
        </>}
      </section>
      <p><a href={manifest.artifacts[`index-${selected}`].path}>Synthetic case JSON</a> · <a href="/data/atlas-live-contracts/1.0.0/manifest.json">Fixture provenance and checksums</a></p>
    </details>
    <p>Official authorities: {LIVE_AUTHORITIES.map((authority, i) => <span key={authority.name}>{i > 0 && ' · '}<a href={authority.url}>{authority.name}</a></span>)}.</p>
  </section>;
}
