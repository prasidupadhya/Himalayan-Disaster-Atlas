'use client';
import { useEffect, useRef, useState } from 'react';
import type { Map } from 'maplibre-gl';
import { DataState } from '../../components/data-state';
import { Evidence } from '../../components/evidence';
import { UnavailableError } from '../../lib/datasets';
import { loadSatellite, loadSatelliteImage, type SatelliteDataset } from '../../lib/satellite';
import type { Resource } from '../../lib/resource';

export function Satellite({ map }: { map: Map | null }) {
  const [resource, setResource] = useState<Resource<SatelliteDataset>>({ status: 'loading' });
  const [attempt, setAttempt] = useState(0); const [selected, setSelected] = useState('central'); const [visible, setVisible] = useState(false); const [opacity, setOpacity] = useState(.82);
  const mounted = useRef<{ source: string; layer: string; url: string } | null>(null); const dataset = 'data' in resource ? resource.data : null;
  useEffect(() => { const controller = new AbortController(); void loadSatellite(controller.signal).then(data => setResource({ status: 'ready', data })).catch(error => { if (!controller.signal.aborted) setResource({ status: error instanceof UnavailableError ? 'unavailable' : 'error', message: error instanceof Error ? error.message : 'Satellite unavailable' }); }); return () => controller.abort(); }, [attempt]);
  useEffect(() => {
    if (!map || !dataset) return; const item = dataset.observations.find(value => value.id === selected); if (!item) return; const controller = new AbortController();
    const clear = () => { const current = mounted.current; if (!current || !map.getStyle()) return; if (map.getLayer(current.layer)) map.removeLayer(current.layer); if (map.getSource(current.source)) map.removeSource(current.source); URL.revokeObjectURL(current.url); mounted.current = null; };
    clear(); void loadSatelliteImage(item, controller.signal).then(buffer => {
      if (controller.signal.aborted) return; const url = URL.createObjectURL(new Blob([buffer], { type: 'image/png' })); const source = `satellite-${item.id}@1.0.0`; const layer = `${source}-image`;
      map.addSource(source, { type: 'image', url, coordinates: item.coordinates });
      map.addLayer({ id: layer, type: 'raster', source, layout: { visibility: 'none' }, paint: { 'raster-opacity': .82, 'raster-fade-duration': 0 } }, map.getStyle().layers.find(value => value.type !== 'background')?.id);
      mounted.current = { source, layer, url };
    }).catch(error => { if (!controller.signal.aborted) setResource({ status: error instanceof UnavailableError ? 'unavailable' : 'error', message: 'Satellite preview could not be verified.' }); });
    return () => { controller.abort(); clear(); };
  }, [map, dataset, selected]);
  useEffect(() => { const current = mounted.current; if (!map || !current || !map.getLayer(current.layer)) return; map.setLayoutProperty(current.layer, 'visibility', visible ? 'visible' : 'none'); map.setPaintProperty(current.layer, 'raster-opacity', opacity); }, [map, visible, opacity]);
  const item = dataset?.observations.find(value => value.id === selected);
  return <section className="thematic-controls" aria-label="Satellite" data-satellite-state={resource.status}><h2>Satellite</h2><p>Sentinel-2 L2A · spring 2026 observation windows</p>
    {map ? <DataState state={resource} retry={() => { setResource({ status: 'loading' }); setAttempt(value => value + 1); }} /> : <p className="muted">Satellite controls require the map.</p>}
    <label className="thematic-picker">Observation window<select value={selected} disabled={!dataset} onChange={event => setSelected(event.target.value)}>{dataset?.observations.map(value => <option key={value.id} value={value.id}>{value.label} · {value.acquired_at.slice(0, 10)}</option>)}</select></label>
    <label><input type="checkbox" checked={visible} disabled={!dataset} onChange={event => setVisible(event.target.checked)} /> Show true-colour preview</label>
    <label className="population-opacity">Preview opacity: {Math.round(opacity * 100)}%<input type="range" min="0.2" max="1" step="0.05" value={opacity} disabled={!dataset || !visible} onChange={event => setOpacity(Number(event.target.value))} /></label>
    {item && <div className="selection"><dl><dt>Scene</dt><dd>{item.scene_id}</dd><dt>Acquired</dt><dd>{item.acquired_at}</dd><dt>Source grid</dt><dd>{item.source_crs} · {item.source_resolution_m} m</dd><dt>SCL cloud</dt><dd>{item.cloud_percent.toFixed(3)}%</dd><dt>SCL NoData</dt><dd>{item.nodata_percent.toFixed(3)}%</dd><dt>SCL snow/ice</dt><dd>{item.snow_ice_percent.toFixed(2)}%</dd></dl></div>}
    <p className="muted"><strong>Observation only.</strong> These are three separate dated windows, not seamless Nepal-wide coverage. Clouds, shadows and snow remain imagery; this feature does not infer water, land or change.</p>
    {dataset && <details><summary>Satellite source & limitations</summary><Evidence metadata={dataset.manifest.metadata} /></details>}
  </section>;
}
