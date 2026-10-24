import type { Map } from 'maplibre-gl';
import { escapeAttribution } from './map-layers';
import { CONTEXT_MANIFEST, loadTerrain } from './terrain';
import { createTerrainDisplay } from './terrain-display';

let protocolId = 0;

/** Adds the checksum-verified Copernicus terrain (Nepal detail inside the Asia context) as a raster-dem source with
 * hillshade. Every tile is verified before it is drawn; a failed tile turns 3D off instead of showing unverified relief.
 * Returns the source id and a dispose function. */
export async function addVerifiedTerrain(map: Map, signal: AbortSignal, onFailure: () => void, beforeLayer?: string) {
  const [data, context] = await Promise.all([loadTerrain(signal), loadTerrain(signal, CONTEXT_MANIFEST)]);
  const displayTile = createTerrainDisplay(data, context);
  const { addProtocol, removeProtocol } = await import('maplibre-gl');
  if (signal.aborted) throw new DOMException('Aborted', 'AbortError');
  const id = `sim-terrain@${data.manifest.metadata.dataset_version}`;
  const protocol = `atlas-sim-terrain-${++protocolId}`;
  let failed = false;
  addProtocol(protocol, async (request, abort) => {
    try {
      return { data: await displayTile(request.url.slice(`${protocol}://`.length), abort.signal) };
    } catch (error) {
      if (!abort.signal.aborted && !signal.aborted && !failed) { failed = true; map.setTerrain(null); onFailure(); }
      throw error;
    }
  });
  map.addSource(id, { type: 'raster-dem', tiles: [`${protocol}://{z}/{x}/{y}.png`], tileSize: 256, minzoom: 1, maxzoom: 9, encoding: 'mapbox',
    bounds: context.manifest.metadata.spatial_coverage.bbox, attribution: escapeAttribution(`${data.manifest.metadata.attribution} | ${context.manifest.metadata.attribution}`) });
  // Hypsometric tint from the same verified elevations: lowland green to brown hills to snow above about 5,000 m.
  // It shows height only; it is not land cover or snow cover.
  map.addLayer({ id: `${id}-relief`, type: 'color-relief', source: id, paint: { 'color-relief-opacity': 0.9, 'color-relief-color': ['interpolate', ['linear'], ['elevation'],
    0, '#4e7a55', 600, '#6f9460', 1500, '#a3a96f', 2500, '#a8875c', 3800, '#8f7b6c', 4800, '#c9c6c2', 5600, '#f3f6f8', 8850, '#ffffff'] } }, beforeLayer);
  map.addLayer({ id: `${id}-hillshade`, type: 'hillshade', source: id, paint: {
    'hillshade-shadow-color': '#0d1c2299', 'hillshade-highlight-color': '#ffffff55', 'hillshade-accent-color': '#5d7768',
    'hillshade-exaggeration': 0.55, 'hillshade-illumination-anchor': 'map',
  } }, beforeLayer);
  return {
    id,
    dispose() {
      if (map.getStyle()) {
        map.setTerrain(null);
        if (map.getLayer(`${id}-hillshade`)) map.removeLayer(`${id}-hillshade`);
        if (map.getLayer(`${id}-relief`)) map.removeLayer(`${id}-relief`);
        if (map.getSource(id)) map.removeSource(id);
      }
      removeProtocol(protocol);
    },
  };
}
