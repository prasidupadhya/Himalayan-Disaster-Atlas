'use client';
import { useEffect, useRef, useState } from 'react';
import type { Map, MapMouseEvent } from 'maplibre-gl';
import { DataState } from '../../components/data-state';
import { Evidence } from '../../components/evidence';
import { UnavailableError } from '../../lib/datasets';
import { escapeAttribution } from '../../lib/map-layers';
import { CONTEXT_MANIFEST, loadTerrain, sampleTerrain, type TerrainDataset } from '../../lib/terrain';
import { createTerrainDisplay } from '../../lib/terrain-display';
import type { Resource } from '../../lib/resource';

let protocolId = 0;

export function Terrain({ map }: { map: Map | null }) {
  const [resource, setResource] = useState<Resource<TerrainDataset>>({ status: 'loading' });
  const [attempt, setAttempt] = useState(0);
  const [hillshade, setHillshade] = useState(true);
  const [threeD, setThreeD] = useState(false);
  const [exaggeration, setExaggeration] = useState(1);
  const [longitude, setLongitude] = useState('85.324');
  const [latitude, setLatitude] = useState('27.7172');
  const [sample, setSample] = useState('Choose coordinates or click the map to inspect elevation.');
  const source = useRef<string | null>(null);
  const inspection = useRef<AbortController | null>(null);
  const dataset = 'data' in resource ? resource.data : null;

  useEffect(() => {
    if (!map) return;
    const controller = new AbortController();
    let dispose: (() => void) | undefined;
    void (async () => {
      try {
        const [data, context] = await Promise.all([loadTerrain(controller.signal), loadTerrain(controller.signal, CONTEXT_MANIFEST)]);
        const displayTile = createTerrainDisplay(data, context);
        const { addProtocol, removeProtocol } = await import('maplibre-gl');
        if (controller.signal.aborted) return;
        const id = `nepal-terrain@${data.manifest.metadata.dataset_version}`;
        const protocol = `atlas-terrain-${++protocolId}`;
        addProtocol(protocol, async (request, abort) => {
          try {
            const key = request.url.slice(`${protocol}://`.length);
            return { data: await displayTile(key, abort.signal) };
          } catch (error) {
            if (!abort.signal.aborted && !controller.signal.aborted) {
              setResource({ status: error instanceof UnavailableError ? 'unavailable' : 'error', message: 'Terrain tiles could not be verified. Retry to reload this layer.' });
              map.setTerrain(null);
              map.setLayoutProperty(`${id}-hillshade`, 'visibility', 'none');
              setThreeD(false);
            }
            throw error;
          }
        });
        map.addSource(id, { type: 'raster-dem', tiles: [`${protocol}://{z}/{x}/{y}.png`],
          tileSize: 256, minzoom: 1, maxzoom: 9, encoding: 'mapbox',
          bounds: context.manifest.metadata.spatial_coverage.bbox, attribution: escapeAttribution(data.manifest.metadata.attribution + ' | ' + context.manifest.metadata.attribution) });
        map.addLayer({ id: `${id}-hillshade`, type: 'hillshade', source: id, paint: {
          'hillshade-shadow-color': '#172a30', 'hillshade-highlight-color': '#e4e8d3',
          'hillshade-accent-color': '#78917b', 'hillshade-exaggeration': 0.65,
          'hillshade-illumination-anchor': 'map',
        } }, map.getStyle().layers.find(layer => layer.type !== 'background')?.id);
        source.current = id;
        setResource({ status: 'ready', data });
        dispose = () => {
          if (map.getStyle()) {
            map.setTerrain(null);
            if (map.getLayer(`${id}-hillshade`)) map.removeLayer(`${id}-hillshade`);
            if (map.getSource(id)) map.removeSource(id);
          }
          removeProtocol(protocol);
          source.current = null;
        };
      } catch (error) {
        if (!controller.signal.aborted) setResource({ status: error instanceof UnavailableError ? 'unavailable' : 'error', message: error instanceof Error ? error.message : 'Terrain unavailable' });
      }
    })();
    return () => { controller.abort(); inspection.current?.abort(); dispose?.(); };
  }, [map, attempt]);

  useEffect(() => {
    if (!map || !source.current || !dataset) return;
    map.setLayoutProperty(`${source.current}-hillshade`, 'visibility', hillshade ? 'visible' : 'none');
    map.setTerrain(threeD ? { source: source.current, exaggeration } : null);
    map.easeTo({ pitch: threeD ? 50 : 0, duration: 0 });
  }, [map, dataset, hillshade, threeD, exaggeration]);

  useEffect(() => {
    if (!map || !dataset) return;
    const inspect = async (lon: number, lat: number) => {
      inspection.current?.abort();
      const controller = new AbortController(); inspection.current = controller;
      setLongitude(lon.toFixed(5)); setLatitude(lat.toFixed(5)); setSample('Loading elevation…');
      try {
        const value = await sampleTerrain(dataset, lon, lat, controller.signal);
        if (!controller.signal.aborted) setSample(value === null ? 'Elevation: UNKNOWN — outside terrain coverage.' : `Elevation: approximately ${Math.round(value).toLocaleString('en-US')} m above EGM2008`);
      } catch { if (!controller.signal.aborted) setSample('Elevation: UNKNOWN — tile could not be verified. Try inspecting again.'); }
    };
    const click = (event: MapMouseEvent) => { void inspect(event.lngLat.lng, event.lngLat.lat); };
    const form = document.getElementById('terrain-inspect');
    const submit = (event: Event) => {
      event.preventDefault();
      const values = new FormData(form as HTMLFormElement);
      void inspect(Number(values.get('longitude')), Number(values.get('latitude')));
    };
    map.on('click', click); form?.addEventListener('submit', submit);
    return () => { map.off('click', click); form?.removeEventListener('submit', submit); inspection.current?.abort(); };
  }, [map, dataset]);

  return <section className="terrain-controls" aria-label="Terrain" data-terrain-state={resource.status}>
    <h2>Terrain</h2>
    <p>Copernicus GLO-90 · surface elevation</p>
    <p className="muted">Asia overview: Mapzen terrain. Nepal elevation inspection: Copernicus GLO-90. Zoom out to explore the surrounding region.</p>
    {map ? <DataState state={resource} retry={() => {
      setResource({ status: 'loading' }); setHillshade(true); setThreeD(false); setExaggeration(1);
      setAttempt(value => value + 1);
    }} /> : <p className="muted">Terrain controls require the interactive map.</p>}
    <label><input type="checkbox" checked={hillshade} disabled={!dataset} onChange={event => setHillshade(event.target.checked)} /> Hillshade</label>
    <label><input type="checkbox" checked={threeD} disabled={!dataset} onChange={event => setThreeD(event.target.checked)} /> 3D terrain</label>
    <label>Vertical exaggeration: {exaggeration}×<input type="range" min="1" max="2" step="0.25" value={exaggeration} disabled={!dataset || !threeD} onChange={event => setExaggeration(Number(event.target.value))} /></label>
    <p className="muted">Hillshade and 3D are derived views. Exaggeration changes appearance only. Includes vegetation and buildings. Finest display pixels are about 270 m here; zooming closer adds no detail.</p>
    <form id="terrain-inspect">
      <label>Longitude<input name="longitude" type="number" min="-180" max="180" step="any" required value={longitude} onChange={event => setLongitude(event.target.value)} /></label>
      <label>Latitude<input name="latitude" type="number" min="-85" max="85" step="any" required value={latitude} onChange={event => setLatitude(event.target.value)} /></label>
      <button disabled={!dataset} type="submit">Inspect elevation</button>
    </form>
    <p role="status">{sample}</p>
    {dataset && <details><summary>Terrain source & limitations</summary><Evidence metadata={dataset.manifest.metadata} /></details>}
  </section>;
}
