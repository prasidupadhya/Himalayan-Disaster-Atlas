'use client';
import { useEffect, useRef, useState } from 'react';
import type { Map } from 'maplibre-gl';
import { DataState } from '../../components/data-state';
import { Evidence } from '../../components/evidence';
import { UnavailableError } from '../../lib/datasets';
import { escapeAttribution } from '../../lib/map-layers';
import { loadPopulation, loadPopulationTile, type PopulationDataset } from '../../lib/population';
import type { Resource } from '../../lib/resource';

let protocolSequence = 0;

export function Population({ map }: { map: Map | null }) {
  const [resource, setResource] = useState<Resource<PopulationDataset>>({ status: 'loading' });
  const [attempt, setAttempt] = useState(0);
  const [visible, setVisible] = useState(false);
  const [opacity, setOpacity] = useState(0.72);
  const sourceRef = useRef<string | null>(null);
  const dataset = 'data' in resource ? resource.data : null;

  useEffect(() => {
    if (!map) return;
    const controller = new AbortController();
    let dispose: (() => void) | undefined;
    void (async () => {
      try {
        const data = await loadPopulation(controller.signal);
        const { addProtocol, removeProtocol } = await import('maplibre-gl');
        if (controller.signal.aborted) return;
        const id = `nepal-population@${data.manifest.metadata.dataset_version}`;
        const protocol = `atlas-population-${++protocolSequence}`;
        addProtocol(protocol, async (request, abort) => {
          const key = request.url.slice(`${protocol}://`.length);
          return { data: await loadPopulationTile(data, key, abort.signal) };
        });
        map.addSource(id, {
          type: 'raster',
          tiles: [`${protocol}://{z}/{x}/{y}.png`],
          tileSize: 256,
          minzoom: data.manifest.raster.minzoom,
          maxzoom: data.manifest.raster.maxzoom,
          bounds: data.manifest.metadata.spatial_coverage.bbox,
          attribution: escapeAttribution(data.manifest.metadata.attribution),
        });
        const layer = `${id}-display`;
        const before = map.getStyle().layers.find(item => item.type !== 'background')?.id;
        map.addLayer({ id: layer, type: 'raster', source: id, layout: { visibility: visible ? 'visible' : 'none' }, paint: { 'raster-opacity': opacity, 'raster-fade-duration': 0 } }, before);
        sourceRef.current = id;
        map.setLayoutProperty(layer, 'visibility', visible ? 'visible' : 'none');
        setResource({ status: 'ready', data });
        dispose = () => {
          if (map.getStyle()) {
            if (map.getLayer(layer)) map.removeLayer(layer);
            if (map.getSource(id)) map.removeSource(id);
          }
          removeProtocol(protocol);
          sourceRef.current = null;
        };
      } catch (error) {
        if (!controller.signal.aborted) setResource({
          status: error instanceof UnavailableError ? 'unavailable' : 'error',
          message: error instanceof Error ? error.message : 'Population layer unavailable',
        });
      }
    })();
    return () => { controller.abort(); dispose?.(); };
    // The retry counter intentionally remounts the immutable source and protocol.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, attempt]);

  useEffect(() => {
    if (!map || !sourceRef.current) return;
    const layer = `${sourceRef.current}-display`;
    if (!map.getLayer(layer)) return;
    map.setLayoutProperty(layer, 'visibility', visible ? 'visible' : 'none');
    map.setPaintProperty(layer, 'raster-opacity', opacity);
  }, [map, visible, opacity]);

  return <section className="thematic-controls" aria-label="Population" data-population-state={resource.status}>
    <h2>Population</h2>
    <p>WorldPop R2025A v1 · 2025 constrained estimate</p>
    {map ? <DataState state={resource} retry={() => { setResource({ status: 'loading' }); setAttempt(value => value + 1); }} /> : <p className="muted">Population controls require the map.</p>}
    <label><input type="checkbox" checked={visible} disabled={!dataset} onChange={event => setVisible(event.target.checked)} /> Show population intensity</label>
    <label className="population-opacity">Display opacity: {Math.round(opacity * 100)}%<input type="range" min="0.2" max="1" step="0.05" value={opacity} disabled={!dataset || !visible} onChange={event => setOpacity(Number(event.target.value))} /></label>
    <div className="population-legend" aria-label="Relative modelled population intensity legend"><span>Lower</span><span className="population-gradient" /><span>Higher</span></div>
    <p className="muted">Colors are a log-scaled visualization of modelled people per native WorldPop grid cell. They are not counts that can be read or summed from the web tiles.</p>
    {dataset && <div className="selection" aria-live="polite"><dl>
      <dt>Model year</dt><dd>2025</dd>
      <dt>Product</dt><dd>R2025A v1 (alpha)</dd>
      <dt>Native grid</dt><dd>3 arc-seconds (0.00083333333°; nominal ~100 m at the equator)</dd>
      <dt>Native CRS</dt><dd>{dataset.manifest.analysis.crs}</dd>
      <dt>NoData</dt><dd>{dataset.manifest.analysis.nodata}</dd>
      <dt>Modelled total</dt><dd>approximately {Math.round(dataset.manifest.analysis.population_sum).toLocaleString('en-US')} people across valid source cells</dd>
      <dt>Analysis source</dt><dd>{dataset.manifest.analysis.source_filename} retained separately from display tiles</dd>
      <dt>Web derivative</dt><dd>{dataset.manifest.raster.tile_count} display-only tiles · zoom {dataset.manifest.raster.minzoom}–{dataset.manifest.raster.maxzoom}</dd>
    </dl><p className="muted"><strong>Not a 2025 census.</strong> This is a modelled population estimate based on source census and settlement inputs. Future exposure calculations must use the pinned native raster, not these display tiles.</p></div>}
    {dataset && <details><summary>Population source & limitations</summary><Evidence metadata={dataset.manifest.metadata} /></details>}
  </section>;
}
