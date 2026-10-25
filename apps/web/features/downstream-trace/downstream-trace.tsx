'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type { Map } from 'maplibre-gl';
import type { Dataset } from '../../../../packages/contracts';
import { buildRiverNetwork, traceDownstream, type DownstreamResult } from '../../../../packages/contracts/downstream';
import { fitTrace, mountDownstreamTrace } from '../../lib/downstream-layer';
import { digits, useLanguage, useCopy } from '../../lib/i18n';
import { TRACE } from './copy';

/** The parent keys this session by selection/retry so old routes and animation are disposed. */
/** `beforePlay` runs before the animation starts (the page uses it to bring the map into view); `statusSlot` is where the
 * map's live status line is drawn, so the trace announces itself on the map rather than in the panel. */
export function DownstreamTrace({ map, datasets, start, autoRun = false, beforePlay, statusSlot }: { map: Map | null; datasets: Dataset[] | null; start: string | undefined; autoRun?: boolean; beforePlay?: (play: () => void) => void; statusSlot?: HTMLElement | null }) {
  const graph = useMemo(() => {
    if (!datasets) return null;
    try { return { network: buildRiverNetwork(datasets) }; }
    catch (error) { return { error: error instanceof Error ? error.message : 'Invalid river network.' }; }
  }, [datasets]);
  const network = graph?.network;
  const [result, setResult] = useState<DownstreamResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [page, setPage] = useState(0);
  const overlay = useRef<ReturnType<typeof mountDownstreamTrace> | null>(null);
  const progressRef = useRef(0);
  const [lang] = useLanguage();
  const c = useCopy(TRACE);
  const num = (value: number, fraction?: number) => digits(value.toLocaleString('en-US', fraction === undefined ? undefined : { maximumFractionDigits: fraction }), lang);

  useEffect(() => {
    if (!map || !network || !result) return;
    const handle = mountDownstreamTrace(map, network, result);
    overlay.current = handle;
    handle.show(progressRef.current);
    return () => { handle.dispose(); overlay.current = null; };
  }, [map, network, result]);

  useEffect(() => { progressRef.current = progress; overlay.current?.show(progress); }, [progress]);

  useEffect(() => {
    if (!playing || !result) return;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;
    const initial = progressRef.current;
    const started = performance.now();
    const complete = () => { cancelAnimationFrame(frame); setProgress(result.reach_ids.length); setPlaying(false); };
    const tick = (now: number) => {
      if (motion.matches) { complete(); return; }
      const count = Math.min(result.reach_ids.length, initial + Math.floor((now - started) / 4000 * result.reach_ids.length));
      setProgress(count);
      if (count < result.reach_ids.length) frame = requestAnimationFrame(tick);
      else setPlaying(false);
    };
    motion.addEventListener('change', complete);
    frame = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(frame); motion.removeEventListener('change', complete); };
  }, [playing, result]);

  const autoStarted = useRef(false);
  useEffect(() => {
    if (!autoRun || autoStarted.current || !network || !start) return;
    autoStarted.current = true;
    run();
  // run reads the current network and start; it is invoked once per mounted session.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoRun, network, start]);

  function run() {
    if (!network || !start) return;
    try {
      const next = traceDownstream(network, start);
      const animate = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      progressRef.current = animate ? 0 : next.reach_ids.length;
      setProgress(progressRef.current); setPlaying(false); setPage(0); setError(null); setResult(next);
      if (map) fitTrace(map, network, next.reach_ids);
      // The animation waits until the map is in view, so nobody has to scroll to watch it; focus follows to the map's status.
      (beforePlay ?? (play => play()))(() => { if (animate) setPlaying(true); window.requestAnimationFrame(() => document.getElementById('trace-map-status')?.focus({ preventScroll: true })); });
    } catch (failure) { setError(failure instanceof Error ? failure.message : 'Trace failed.'); }
  }

  function download() {
    if (!result) return;
    const url = URL.createObjectURL(new Blob([JSON.stringify(result, null, 2)], { type: 'application/json' }));
    const link = document.createElement('a');
    link.href = url; link.download = `downstream-hyriv-${result.start_reach_id}.json`; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 0);
  }

  return <section id="downstream-trace" className="trace-controls" aria-label={c.downstreamTrace} data-trace-state={result ? 'ready' : graph?.error || error ? 'error' : !network ? 'unavailable' : 'idle'}>
    <h2>{c.downstreamTrace}</h2>
    <p>{c.followConnectedRiverReaches}</p>
    <p className="muted">{c.networkConnectivityOnlyDoes}</p>
    {!datasets && <p>{c.tracingNeedsBothRiver}</p>}
    {(graph?.error || error) && <p role="alert">{graph?.error ?? error}</p>}
    <p>{start ? c.start(start) : c.selectRiverReachAbove}</p>
    <button disabled={!network || !start} onClick={run}>{c.traceDownstream}</button>
    {result && network && <>
      <div className="trace-actions">
        <button onClick={() => { setPlaying(false); setResult(null); setProgress(0); }}>{c.clearTrace}</button>
        <button onClick={() => { if (map) fitTrace(map, network, result.reach_ids); }} disabled={!map}>{c.fitTrace}</button>
        <button onClick={download}>{c.downloadTraceJson}</button>
        <a href="#exposure-engine">{c.explorePreparedExposureScenarios}</a>
      </div>
      <div className="selection" aria-live="polite">
        <p className="eyebrow">{c.atlasDerivedNetworkAnalysis}</p>
        <dl><dt>{c.connectedReaches}</dt><dd>{num(result.reach_ids.length)}</dd>
          <dt>{c.summedSourceReachLength}</dt><dd>{num(result.total_length_km, 3)} km</dd>
          <dt>{c.traceEnd}</dt><dd>{result.termination === 'coverage_boundary' ? c.coverageBoundary(String(result.next_reach_id)) : c.sourceOutletNoDownstream}</dd>
        </dl>
      </div>
      <p>{c.goldLinesMarkTraced}</p>
      <div className="trace-actions">
        <button onClick={() => {
          if (playing) { setPlaying(false); return; }
          if (progress >= result.reach_ids.length) { progressRef.current = 0; setProgress(0); }
          setPlaying(true);
        }}>{playing ? c.pauseTraceAnimation : progress >= result.reach_ids.length ? c.replayTraceAnimation : c.resumeTraceAnimation}</button>
        <button onClick={() => { setPlaying(false); setProgress(result.reach_ids.length); }}>{c.showEntireTrace}</button>
      </div>
      <p className="muted" data-trace-progress={progress}>{c.progress(num(progress), num(result.reach_ids.length))}</p>
      <details><summary>{c.orderedDownstreamReaches} ({num(result.reach_ids.length)})</summary>
        <ol start={page * 50 + 1}>{result.reach_ids.slice(page * 50, (page + 1) * 50).map(id => <li key={id}>
          HYRIV {id} · {lang === 'ne' ? digits(String(network.reaches.get(id)!.properties.length_km), lang) : network.reaches.get(id)!.properties.length_km} km{' '}
          <button disabled={!map} aria-label={c.locateReach(id)} onClick={() => { if (map) fitTrace(map, network, [id]); }}>{c.locate}</button>
        </li>)}</ol>
        <div className="trace-actions"><button disabled={page === 0} onClick={() => setPage(value => value - 1)}>{c.previousReaches}</button>
          <button disabled={(page + 1) * 50 >= result.reach_ids.length} onClick={() => setPage(value => value + 1)}>{c.nextReaches}</button></div>
      </details>
      <details><summary>{c.traceMethodInputsLimitations}</summary>
        <p>{result.method} · OGC:CRS84 · {c.lengthsKmFollowsNext}</p>
        <ul>{result.inputs.map(input => <li key={input.dataset_id}>{input.dataset_id} / {input.dataset_version}<br /><span className="trace-hash">SHA-256: {input.artifact_sha256}</span></li>)}</ul>
        <ul>{result.limitations.map(item => <li key={item}>{item}</li>)}</ul>
        <a href="/methodology/#downstream-method">{c.downstreamMethodology}</a>
      </details>
    </>}
    {result && statusSlot && createPortal(<p id="trace-map-status" className="map-status" role="status" tabIndex={-1}>
      <span aria-hidden="true">{playing ? '▶' : '■'}</span> {c.mapStatus(num(progress), num(result.reach_ids.length), result.start_reach_id)}
    </p>, statusSlot)}
    <p className="muted">{c.glacierLakeOutletsUnknown}</p>
  </section>;
}
