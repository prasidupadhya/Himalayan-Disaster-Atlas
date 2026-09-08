'use client';
import { useEffect, useState } from 'react';
import type { WaterObservation } from '../../../../packages/contracts/water-change';
import { loadWaterArtifact } from '../../lib/water-change';
import type { Resource } from '../../lib/resource';
import { DataState } from '../../components/data-state';
export function WaterComparisonImages({ before, after }: { before: WaterObservation; after: WaterObservation }) {
  const [resource, setResource] = useState<Resource<string[]>>({ status: 'loading' });
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    const urls: string[] = [];
    void Promise.all([before, after].map(o => loadWaterArtifact(o.true_colour, controller.signal))).then(images => {
      if (controller.signal.aborted) return;
      urls.push(...images.map(bytes => URL.createObjectURL(new Blob([bytes], { type: 'image/png' }))));
      setResource({ status: 'ready', data: urls });
    }).catch(() => { if (!controller.signal.aborted) setResource({ status: 'error', message: 'Before/after imagery could not be verified.' }); });
    return () => { controller.abort(); urls.forEach(url => URL.revokeObjectURL(url)); };
  }, [before, after, attempt]);
  return <section aria-label="Water before and after imagery"><h3>Before / after imagery</h3><p>Same display grid; source true colour retains clouds and shadows. Visual differences are not measured change.</p><DataState state={resource} retry={() => { setResource({ status: 'loading' }); setAttempt(v => v + 1); }} />{'data' in resource && <div className="water-comparison">{[before, after].map((o, i) => <figure className="water-preview" key={o.id}>
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img src={resource.data[i]} alt={`Phewa true colour acquired ${o.id}`} width="516" height="525" /><figcaption>{i === 0 ? 'Before' : 'After'}: {o.acquired_at} · {o.platform}</figcaption></figure>)}</div>}</section>;
}
