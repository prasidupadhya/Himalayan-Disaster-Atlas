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
import { digits, useLanguage } from '../../lib/i18n';

type Sample = { kind: 'prompt' | 'loading' | 'outside' | 'failed' } | { kind: 'value'; metres: number };

let protocolId = 0;

export function Terrain({ map }: { map: Map | null }) {
  const [resource, setResource] = useState<Resource<TerrainDataset>>({ status: 'loading' });
  const [attempt, setAttempt] = useState(0);
  const [hillshade, setHillshade] = useState(true);
  const [threeD, setThreeD] = useState(false);
  const [exaggeration, setExaggeration] = useState(1);
  const [longitude, setLongitude] = useState('85.324');
  const [latitude, setLatitude] = useState('27.7172');
  const [sample, setSample] = useState<Sample>({ kind: 'prompt' });
  const [lang] = useLanguage();
  const t = (en: string, ne: string) => lang === 'ne' ? ne : en;
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
        // In 3D, a hypsometric tint from the same verified elevations (height only, not land cover or snow).
        map.addLayer({ id: `${id}-relief`, type: 'color-relief', source: id, layout: { visibility: 'none' }, paint: { 'color-relief-opacity': 0.85, 'color-relief-color': ['interpolate', ['linear'], ['elevation'],
          0, '#4e7a55', 600, '#6f9460', 1500, '#a3a96f', 2500, '#a8875c', 3800, '#8f7b6c', 4800, '#c9c6c2', 5600, '#f3f6f8', 8850, '#ffffff'] } },
          map.getStyle().layers.find(layer => layer.type !== 'background')?.id);
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
            if (map.getLayer(`${id}-relief`)) map.removeLayer(`${id}-relief`);
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
    map.setLayoutProperty(`${source.current}-relief`, 'visibility', threeD ? 'visible' : 'none');
    map.setSky(threeD ? { 'sky-color': '#7fa9c0', 'horizon-color': '#dbe7ea', 'fog-color': '#c9d8dc', 'sky-horizon-blend': 0.55, 'horizon-fog-blend': 0.7, 'fog-ground-blend': 0.25, 'atmosphere-blend': 0.6 } : {});
    map.easeTo({ pitch: threeD ? 60 : 0, duration: 0 });
  }, [map, dataset, hillshade, threeD, exaggeration]);

  useEffect(() => {
    if (!map || !dataset) return;
    const inspect = async (lon: number, lat: number) => {
      inspection.current?.abort();
      const controller = new AbortController(); inspection.current = controller;
      setLongitude(lon.toFixed(5)); setLatitude(lat.toFixed(5)); setSample({ kind: 'loading' });
      try {
        const value = await sampleTerrain(dataset, lon, lat, controller.signal);
        if (!controller.signal.aborted) setSample(value === null ? { kind: 'outside' } : { kind: 'value', metres: value });
      } catch { if (!controller.signal.aborted) setSample({ kind: 'failed' }); }
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

  const sampleText = sample.kind === 'prompt' ? t('Choose coordinates or click the map to inspect elevation.', 'उचाइ हेर्न निर्देशाङ्क (coordinates) छान्नुहोस् वा नक्सामा क्लिक गर्नुहोस्।')
    : sample.kind === 'loading' ? t('Loading elevation…', 'उचाइ लोड गर्दै…')
    : sample.kind === 'outside' ? t('Elevation: UNKNOWN — outside terrain coverage.', 'उचाइ: अज्ञात (UNKNOWN) — भू-आकृति दायराभन्दा बाहिर।')
    : sample.kind === 'failed' ? t('Elevation: UNKNOWN — tile could not be verified. Try inspecting again.', 'उचाइ: अज्ञात (UNKNOWN) — टाइल प्रमाणित गर्न सकिएन। फेरि हेर्ने प्रयास गर्नुहोस्।')
    : sample.kind !== 'value' ? '' : lang === 'ne' ? `उचाइ: EGM2008 भन्दा करिब ${digits(Math.round(sample.metres).toLocaleString('en-US'), lang)} m माथि` : `Elevation: approximately ${Math.round(sample.metres).toLocaleString('en-US')} m above EGM2008`;
  return <section className="terrain-controls" aria-label={t('Terrain', 'भू-आकृति')} data-terrain-state={resource.status}>
    <h2>{t('Terrain', 'भू-आकृति')}</h2>
    <p>Copernicus GLO-90 · {t('surface elevation', 'सतहको उचाइ')}</p>
    <p className="muted">{t('Asia overview: Mapzen terrain. Nepal elevation inspection: Copernicus GLO-90. Zoom out to explore the surrounding region.', 'एसियाको सिंहावलोकन: Mapzen भू-आकृति। नेपालको उचाइ निरीक्षण: Copernicus GLO-90। वरपरको क्षेत्र हेर्न जुम घटाउनुहोस्।')}</p>
    {map ? <DataState state={resource} retry={() => {
      setResource({ status: 'loading' }); setHillshade(true); setThreeD(false); setExaggeration(1);
      setAttempt(value => value + 1);
    }} /> : <p className="muted">{t('Terrain controls require the interactive map.', 'भू-आकृति नियन्त्रणका लागि अन्तरक्रियात्मक नक्सा चाहिन्छ।')}</p>}
    <label><input type="checkbox" checked={hillshade} disabled={!dataset} onChange={event => setHillshade(event.target.checked)} /> {t('Hillshade', 'पहाडी छायाँ (hillshade)')}</label>
    <label><input type="checkbox" checked={threeD} disabled={!dataset} onChange={event => setThreeD(event.target.checked)} /> {t('3D terrain', '3D भू-आकृति')}</label>
    <label>{t('Vertical exaggeration: ', 'ठाडो अतिरञ्जन (vertical exaggeration): ')}{digits(String(exaggeration), lang)}×<input type="range" min="1" max="2" step="0.25" value={exaggeration} disabled={!dataset || !threeD} onChange={event => setExaggeration(Number(event.target.value))} /></label>
    <p className="muted">{t('Hillshade and 3D are derived views. Exaggeration changes appearance only. Includes vegetation and buildings. Finest display pixels are about 270 m here; zooming closer adds no detail.', 'पहाडी छायाँ र 3D व्युत्पन्न दृश्य हुन्। अतिरञ्जनले देखावट मात्र बदल्छ। यसमा वनस्पति र भवनहरू पनि समावेश छन्। यहाँ सबैभन्दा सानो प्रदर्शन पिक्सेल करिब २७० m को छ; अझ नजिक जुम गर्दा थप विवरण आउँदैन।')}</p>
    <form id="terrain-inspect">
      <label>{t('Longitude', 'देशान्तर')}<input name="longitude" type="number" inputMode="decimal" autoComplete="off" enterKeyHint="done" min="-180" max="180" step="any" required value={longitude} onChange={event => setLongitude(event.target.value)} /></label>
      <label>{t('Latitude', 'अक्षांश')}<input name="latitude" type="number" inputMode="decimal" autoComplete="off" enterKeyHint="done" min="-85" max="85" step="any" required value={latitude} onChange={event => setLatitude(event.target.value)} /></label>
      <button disabled={!dataset} type="submit">{t('Inspect elevation', 'उचाइ हेर्नुहोस्')}</button>
    </form>
    <p role="status">{sampleText}</p>
    {dataset && <details><summary>{t('Terrain source & limitations', 'भू-आकृतिको स्रोत र सीमाहरू')}</summary><Evidence metadata={dataset.manifest.metadata} /></details>}
  </section>;
}
