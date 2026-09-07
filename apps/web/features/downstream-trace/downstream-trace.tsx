'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { Map } from 'maplibre-gl';
import type { Dataset } from '../../../../packages/contracts';
import { buildRiverNetwork, traceDownstream, type DownstreamResult } from '../../../../packages/contracts/downstream';
import { fitTrace, mountDownstreamTrace } from '../../lib/downstream-layer';

/** The parent keys this session by selection/retry so old routes and animation are disposed. */
export function DownstreamTrace({ map, datasets, start }: { map: Map | null; datasets: Dataset[] | null; start: string | undefined }) {
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

  function run() {
    if (!network || !start) return;
    try {
      const next = traceDownstream(network, start);
      const animate = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      progressRef.current = animate ? 0 : next.reach_ids.length;
      setProgress(progressRef.current); setPlaying(animate); setPage(0); setError(null); setResult(next);
      if (map) fitTrace(map, network, next.reach_ids);
    } catch (failure) { setError(failure instanceof Error ? failure.message : 'Trace failed.'); }
  }

  function download() {
    if (!result) return;
    const url = URL.createObjectURL(new Blob([JSON.stringify(result, null, 2)], { type: 'application/json' }));
    const link = document.createElement('a');
    link.href = url; link.download = `downstream-hyriv-${result.start_reach_id}.json`; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 0);
  }

  return <section id="downstream-trace" className="trace-controls" aria-label="Downstream trace" data-trace-state={result ? 'ready' : graph?.error || error ? 'error' : !network ? 'unavailable' : 'idle'}>
    <h2>Downstream trace</h2>
    <p>Follow connected river reaches from the selected HYRIV record.</p>
    <p className="muted">Network connectivity only. This does not show flooding, travel time or confirmed exposure.</p>
    {!datasets && <p>Tracing needs both river partitions. Load or retry the river network above.</p>}
    {(graph?.error || error) && <p role="alert">{graph?.error ?? error}</p>}
    <p>{start ? `Start: HYRIV ${start} (whole reach)` : 'Select a river reach above or click a river on the map.'}</p>
    <button disabled={!network || !start} onClick={run}>Trace downstream</button>
    {result && network && <>
      <div className="trace-actions">
        <button onClick={() => { setPlaying(false); setResult(null); setProgress(0); }}>Clear trace</button>
        <button onClick={() => { if (map) fitTrace(map, network, result.reach_ids); }} disabled={!map}>Fit trace</button>
        <button onClick={download}>Download trace JSON</button>
      </div>
      <div className="selection" aria-live="polite">
        <p className="eyebrow">ATLAS DERIVED · network analysis</p>
        <dl><dt>Connected reaches</dt><dd>{result.reach_ids.length.toLocaleString('en-US')}</dd>
          <dt>Summed source reach length</dt><dd>{result.total_length_km.toLocaleString('en-US', { maximumFractionDigits: 3 })} km</dd>
          <dt>Trace end</dt><dd>{result.termination === 'coverage_boundary' ? `Coverage boundary — next HYRIV ${result.next_reach_id} is outside this release. Downstream continuation is unavailable.` : 'Source outlet — no downstream connection is recorded; this may be an inland sink or an ocean outlet.'}</dd>
        </dl>
      </div>
      <p>Gold lines mark the traced network. Distance includes the entire selected reach and every retained downstream reach.</p>
      <div className="trace-actions">
        <button onClick={() => {
          if (playing) { setPlaying(false); return; }
          if (progress >= result.reach_ids.length) { progressRef.current = 0; setProgress(0); }
          setPlaying(true);
        }}>{playing ? 'Pause trace animation' : progress >= result.reach_ids.length ? 'Replay trace animation' : 'Resume trace animation'}</button>
        <button onClick={() => { setPlaying(false); setProgress(result.reach_ids.length); }}>Show entire trace</button>
      </div>
      <p className="muted" data-trace-progress={progress}>Showing {progress} of {result.reach_ids.length} reaches. Playback speed is illustrative; reduced-motion settings show the entire trace immediately.</p>
      <details><summary>Ordered downstream reaches ({result.reach_ids.length})</summary>
        <ol start={page * 50 + 1}>{result.reach_ids.slice(page * 50, (page + 1) * 50).map(id => <li key={id}>
          HYRIV {id} · {network.reaches.get(id)!.properties.length_km} km{' '}
          <button disabled={!map} aria-label={`Locate HYRIV ${id}`} onClick={() => { if (map) fitTrace(map, network, [id]); }}>Locate</button>
        </li>)}</ol>
        <div className="trace-actions"><button disabled={page === 0} onClick={() => setPage(value => value - 1)}>Previous reaches</button>
          <button disabled={(page + 1) * 50 >= result.reach_ids.length} onClick={() => setPage(value => value + 1)}>Next reaches</button></div>
      </details>
      <details><summary>Trace method, inputs & limitations</summary>
        <p>{result.method} · OGC:CRS84 · lengths in km. Follows NEXT_DOWN across both verified partitions. No geometry is joined across gaps.</p>
        <ul>{result.inputs.map(input => <li key={input.dataset_id}>{input.dataset_id} / {input.dataset_version}<br /><span className="trace-hash">SHA-256: {input.artifact_sha256}</span></li>)}</ul>
        <ul>{result.limitations.map(item => <li key={item}>{item}</li>)}</ul>
        <a href="/methodology/#downstream-method">Downstream methodology</a>
      </details>
    </>}
    <p className="muted">Glacier and lake outlets: UNKNOWN in the current inventories. Settlements, infrastructure and population intersections await their source layers and the exposure feature.</p>
  </section>;
}
