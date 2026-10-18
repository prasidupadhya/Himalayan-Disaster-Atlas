'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { Map } from 'maplibre-gl';
import type { Dataset } from '../../../../packages/contracts';
import { buildRiverNetwork, traceDownstream, type DownstreamResult } from '../../../../packages/contracts/downstream';
import { fitTrace, mountDownstreamTrace } from '../../lib/downstream-layer';
import { digits, useLanguage } from '../../lib/i18n';

/** The parent keys this session by selection/retry so old routes and animation are disposed. */
export function DownstreamTrace({ map, datasets, start, autoRun = false }: { map: Map | null; datasets: Dataset[] | null; start: string | undefined; autoRun?: boolean }) {
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
  const t = (en: string, ne: string) => lang === 'ne' ? ne : en;
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

  return <section id="downstream-trace" className="trace-controls" aria-label={t('Downstream trace', 'तलतिरको मार्ग')} data-trace-state={result ? 'ready' : graph?.error || error ? 'error' : !network ? 'unavailable' : 'idle'}>
    <h2>{t('Downstream trace', 'तलतिरको मार्ग')}</h2>
    <p>{t('Follow connected river reaches from the selected HYRIV record.', 'छानिएको HYRIV अभिलेखबाट जोडिएका नदी खण्डहरू पछ्याउनुहोस्।')}</p>
    <p className="muted">{t('Network connectivity only. This does not show flooding, travel time or confirmed exposure.', 'सञ्जालको जडान मात्र। यसले बाढी, पानी पुग्ने समय वा पुष्टि भएको जोखिममा पर्ने अवस्था (exposure) देखाउँदैन।')}</p>
    {!datasets && <p>{t('Tracing needs both river partitions. Load or retry the river network above.', 'मार्ग पछ्याउन नदीका दुवै भाग चाहिन्छन्। माथि नदी सञ्जाल लोड गर्नुहोस् वा फेरि प्रयास गर्नुहोस्।')}</p>}
    {(graph?.error || error) && <p role="alert">{graph?.error ?? error}</p>}
    <p>{start ? t(`Start: HYRIV ${start} (whole reach)`, `सुरुवात: HYRIV ${start} (पूरै खण्ड)`) : t('Select a river reach above or click a river on the map.', 'माथिबाट नदी खण्ड छान्नुहोस् वा नक्सामा नदीमा क्लिक गर्नुहोस्।')}</p>
    <button disabled={!network || !start} onClick={run}>{t('Trace downstream', 'तलतिर पछ्याउनुहोस्')}</button>
    {result && network && <>
      <div className="trace-actions">
        <button onClick={() => { setPlaying(false); setResult(null); setProgress(0); }}>{t('Clear trace', 'मार्ग हटाउनुहोस्')}</button>
        <button onClick={() => { if (map) fitTrace(map, network, result.reach_ids); }} disabled={!map}>{t('Fit trace', 'मार्ग नक्सामा मिलाउनुहोस्')}</button>
        <button onClick={download}>{t('Download trace JSON', 'मार्ग JSON डाउनलोड गर्नुहोस्')}</button>
        <a href="#exposure-engine">{t('Explore prepared exposure scenarios', 'तयार पारिएका जोखिम-सम्पर्क (exposure) परिदृश्य हेर्नुहोस्')}</a>
      </div>
      <div className="selection" aria-live="polite">
        <p className="eyebrow">{t('ATLAS DERIVED · network analysis', 'एटलसद्वारा व्युत्पन्न (ATLAS DERIVED) · सञ्जाल विश्लेषण')}</p>
        <dl><dt>{t('Connected reaches', 'जोडिएका खण्डहरू')}</dt><dd>{num(result.reach_ids.length)}</dd>
          <dt>{t('Summed source reach length', 'स्रोत खण्डहरूको जम्मा लम्बाइ')}</dt><dd>{num(result.total_length_km, 3)} km</dd>
          <dt>{t('Trace end', 'मार्गको अन्त्य')}</dt><dd>{result.termination === 'coverage_boundary' ? t(`Coverage boundary — next HYRIV ${result.next_reach_id} is outside this release. Downstream continuation is unavailable.`, `दायराको सीमा — अर्को HYRIV ${result.next_reach_id} यस रिलिजभन्दा बाहिर छ। तलतिरको निरन्तरता उपलब्ध छैन।`) : t('Source outlet — no downstream connection is recorded; this may be an inland sink or an ocean outlet.', 'स्रोतको निकास — तलतिरको कुनै जडान अभिलेखित छैन; यो भित्री निकासविहीन क्षेत्र (inland sink) वा समुद्री निकास हुन सक्छ।')}</dd>
        </dl>
      </div>
      <p>{t('Gold lines mark the traced network. Distance includes the entire selected reach and every retained downstream reach.', 'सुनौला रेखाले पछ्याइएको सञ्जाल देखाउँछन्। दूरीमा छानिएको पूरै खण्ड र तलतिर समावेश गरिएका सबै खण्डहरू पर्छन्।')}</p>
      <div className="trace-actions">
        <button onClick={() => {
          if (playing) { setPlaying(false); return; }
          if (progress >= result.reach_ids.length) { progressRef.current = 0; setProgress(0); }
          setPlaying(true);
        }}>{playing ? t('Pause trace animation', 'मार्ग एनिमेसन रोक्नुहोस्') : progress >= result.reach_ids.length ? t('Replay trace animation', 'मार्ग एनिमेसन फेरि चलाउनुहोस्') : t('Resume trace animation', 'मार्ग एनिमेसन जारी राख्नुहोस्')}</button>
        <button onClick={() => { setPlaying(false); setProgress(result.reach_ids.length); }}>{t('Show entire trace', 'पूरै मार्ग देखाउनुहोस्')}</button>
      </div>
      <p className="muted" data-trace-progress={progress}>{lang === 'ne' ? `${num(result.reach_ids.length)} मध्ये ${num(progress)} खण्ड देखाइँदै। प्लेब्याकको गति उदाहरणका लागि मात्र हो; कम गति (reduced-motion) सेटिङमा पूरै मार्ग तुरुन्तै देखाइन्छ।` : <>Showing {progress} of {result.reach_ids.length} reaches. Playback speed is illustrative; reduced-motion settings show the entire trace immediately.</>}</p>
      <details><summary>{t('Ordered downstream reaches', 'क्रमबद्ध तलतिरका खण्डहरू')} ({num(result.reach_ids.length)})</summary>
        <ol start={page * 50 + 1}>{result.reach_ids.slice(page * 50, (page + 1) * 50).map(id => <li key={id}>
          HYRIV {id} · {lang === 'ne' ? digits(String(network.reaches.get(id)!.properties.length_km), lang) : network.reaches.get(id)!.properties.length_km} km{' '}
          <button disabled={!map} aria-label={t(`Locate HYRIV ${id}`, `HYRIV ${id} नक्सामा देखाउनुहोस्`)} onClick={() => { if (map) fitTrace(map, network, [id]); }}>{t('Locate', 'देखाउनुहोस्')}</button>
        </li>)}</ol>
        <div className="trace-actions"><button disabled={page === 0} onClick={() => setPage(value => value - 1)}>{t('Previous reaches', 'अघिल्ला खण्डहरू')}</button>
          <button disabled={(page + 1) * 50 >= result.reach_ids.length} onClick={() => setPage(value => value + 1)}>{t('Next reaches', 'अर्का खण्डहरू')}</button></div>
      </details>
      <details><summary>{t('Trace method, inputs & limitations', 'मार्ग पछ्याउने विधि, इनपुट र सीमाहरू')}</summary>
        <p>{result.method} · OGC:CRS84 · {t('lengths in km. Follows NEXT_DOWN across both verified partitions. No geometry is joined across gaps.', 'लम्बाइ km मा। प्रमाणित दुवै भागमा NEXT_DOWN पछ्याउँछ। खाली ठाउँहरूमा कुनै ज्यामिति (geometry) जोडिँदैन।')}</p>
        <ul>{result.inputs.map(input => <li key={input.dataset_id}>{input.dataset_id} / {input.dataset_version}<br /><span className="trace-hash">SHA-256: {input.artifact_sha256}</span></li>)}</ul>
        <ul>{result.limitations.map(item => <li key={item}>{item}</li>)}</ul>
        <a href="/methodology/#downstream-method">{t('Downstream methodology', 'तलतिरको मार्ग विधि')}</a>
      </details>
    </>}
    <p className="muted">{t('Glacier and lake outlets: UNKNOWN in the current inventories. Settlements, infrastructure and population intersections await their source layers and the exposure feature.', 'हिमनदी र तालका निकास: हालका अभिलेखमा अज्ञात (UNKNOWN)। बस्ती, पूर्वाधार र जनसंख्यासँगको प्रतिच्छेदन तिनका स्रोत तह र जोखिम-सम्पर्क (exposure) सुविधा आएपछि मात्र उपलब्ध हुनेछ।')}</p>
  </section>;
}
