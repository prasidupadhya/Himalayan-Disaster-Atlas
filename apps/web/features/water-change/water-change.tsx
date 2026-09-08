'use client';
import { useEffect, useState } from 'react';
import type { Map } from 'maplibre-gl';
import type { WaterManifest } from '../../../../packages/contracts/water-change';
import { DataState } from '../../components/data-state';
import { Evidence } from '../../components/evidence';
import { loadWaterArtifact, loadWaterChange } from '../../lib/water-change';
import { UnavailableError } from '../../lib/datasets';
import type { Resource } from '../../lib/resource';

type Mode = 'change' | 'water' | 'quality_preview' | 'true_colour';
const area = (value: number | null) => value === null ? 'UNKNOWN' : `${value.toFixed(4)} km²`;
export function WaterChange({ map }: { map: Map | null }) {
  const [resource, setResource] = useState<Resource<WaterManifest>>({ status: 'loading' });
  const [attempt, setAttempt] = useState(0);
  const [before, setBefore] = useState('2024-04-19');
  const [after, setAfter] = useState('2025-04-01');
  const [mode, setMode] = useState<Mode>('change');
  const [visible, setVisible] = useState(false);
  const [imageState, setImageState] = useState<Resource<string>>({ status: 'empty', data: '' });
  const manifest = 'data' in resource ? resource.data : null;
  const observation = manifest?.observations.find(o => o.id === after);
  const pair = manifest?.comparisons.find(p => p.before === before && p.after === after);
  const artifact = mode === 'change' ? pair?.available ? pair.preview : undefined : observation?.[mode];
  useEffect(() => {
    const controller = new AbortController();
    void loadWaterChange(controller.signal).then(data => setResource({ status: 'ready', data })).catch(error => {
      if (!controller.signal.aborted) setResource({ status: error instanceof UnavailableError ? 'unavailable' : 'error', message: error instanceof Error ? error.message : 'Water data unavailable' });
    });
    return () => controller.abort();
  }, [attempt]);
  useEffect(() => {
    if (!artifact || !visible || !manifest) return;
    const controller = new AbortController();
    let url: string | undefined;
    const id = 'phewa-water-change@1.0.0';
    void loadWaterArtifact(artifact, controller.signal).then(bytes => {
      if (controller.signal.aborted) return;
      url = URL.createObjectURL(new Blob([bytes], { type: 'image/png' }));
      setImageState({ status: 'ready', data: url });
      if (map) {
        map.addSource(id, { type: 'image', url, coordinates: manifest.coordinates });
        map.addLayer({ id, source: id, type: 'raster', paint: { 'raster-opacity': 1, 'raster-fade-duration': 0, 'raster-resampling': 'nearest' } });
      }
    }).catch(error => { if (!controller.signal.aborted) setImageState({ status: error instanceof UnavailableError ? 'unavailable' : 'error', message: 'Water image could not be verified.' }); });
    return () => {
      controller.abort();
      if (map?.getStyle()) { if (map.getLayer(id)) map.removeLayer(id); if (map.getSource(id)) map.removeSource(id); }
      if (url) URL.revokeObjectURL(url);
    };
  }, [artifact, visible, manifest, map, attempt]);
  function loading() { setImageState({ status: 'loading' }); }
  return <section className="thematic-controls" aria-label="Water Change" data-water-change-state={resource.status}>
    <h2>Water Change</h2><p>Phewa Lake · April 2024 / 2025 / 2026 · 20 m mapped open-water candidates</p>
    <DataState state={resource} retry={() => { setResource({ status: 'loading' }); setAttempt(v => v + 1); }} />
    <label className="thematic-picker">Earlier water observation<select value={before} disabled={!manifest} onChange={e => { loading(); setBefore(e.target.value); }}>{manifest?.observations.map(o => <option key={o.id}>{o.id}</option>)}</select></label>
    <label className="thematic-picker">Later water observation<select value={after} disabled={!manifest} onChange={e => { loading(); setAfter(e.target.value); }}>{manifest?.observations.map(o => <option key={o.id}>{o.id}</option>)}</select></label>
    <label className="thematic-picker">Water display<select value={mode} onChange={e => { loading(); setMode(e.target.value as Mode); }}><option value="change">Gain / loss / persistence</option><option value="water">Later water mask</option><option value="quality_preview">Later exclusion / uncertainty mask</option><option value="true_colour">Later true-colour imagery</option></select></label>
    <label><input type="checkbox" checked={visible} disabled={!manifest} onChange={e => { loading(); setVisible(e.target.checked); }} /> Show water observation</label>
    <button disabled={!map || !manifest} onClick={() => { if (map && manifest) { const [w, s, e, n] = manifest.metadata.spatial_coverage.bbox; map.fitBounds([[w, s], [e, n]], { padding: 45, maxZoom: 12, duration: 0 }); } }}>Zoom to Phewa window</button>
    {manifest && mode === 'change' && !pair && <p role="status">Comparison unavailable. Choose two different dates in chronological order.</p>}
    {pair && <div className="selection" aria-live="polite"><p>{pair.before} → {pair.after} · comparable pixels: {(pair.comparable_fraction * 100).toFixed(2)}% · water union: {pair.water_comparable_fraction === null ? 'UNKNOWN' : `${(pair.water_comparable_fraction * 100).toFixed(2)}%`}</p>{!pair.available && <p>Comparison unavailable: less than 80% comparable coverage in the window or mapped-water union.</p>}<dl><dt>Mapped gain</dt><dd>{area(pair.gain_km2)}</dd><dt>Mapped loss</dt><dd>{area(pair.loss_km2)}</dd><dt>Persistent water</dt><dd>{area(pair.persistence_km2)}</dd></dl></div>}
    {visible && artifact && <><DataState state={imageState} retry={() => { loading(); setAttempt(v => v + 1); }} />{'data' in imageState && imageState.data && <figure className="water-preview">{/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={imageState.data} alt={`${mode.replaceAll('_', ' ')} for ${after}${mode === 'change' ? ` compared with ${before}` : ''}`} width="505" height="512" /><figcaption>{mode === 'quality_preview' ? 'Grey: source exclusion; light grey: 20 m buffer; gold: uncertain; purple: below minimum mapping unit.' : mode === 'true_colour' ? 'Source true colour for visual inspection; clouds and shadows are not removed from imagery.' : 'Blue: mapped water; green: gain; orange: loss; grey: UNKNOWN; transparent: mapped land.'}</figcaption></figure>}</>}
    {observation && <p>Acquired {observation.acquired_at} · {observation.platform} · valid {(observation.valid_fraction * 100).toFixed(2)}% · partial mapped water {area(observation.water_km2)}</p>}
    <p className="muted">Only jointly valid pixels count. Clouds, shadows, snow, uncertain pixels and water patches below 0.0036 km² are excluded. These April snapshots do not establish seasonal behaviour, a long-term trend or a cause. Cross-sensor and shoreline uncertainty remain.</p>
    {manifest && <details><summary>Water source, method & limitations</summary><Evidence metadata={manifest.metadata} /><a href="/data/phewa-water-change/1.0.0/sources.json">Pinned source inventory</a></details>}
  </section>;
}
