import type { Map } from 'maplibre-gl';
import type { Dataset } from '../../../packages/contracts';

/** One source per immutable dataset version. Dispose layers before the source. */
export function mountDataset(map: Map, dataset: Dataset) {
  const id = `${dataset.metadata.dataset_id}@${dataset.metadata.dataset_version}`;
  if (map.getSource(id)) throw new Error(`Dataset already mounted: ${id}`);
  // Vector-tile IDs are numeric; promote a private render property to retain canonical string IDs.
  const data = { ...dataset.collection, features: dataset.collection.features.map(feature => ({
    ...feature, properties: { ...feature.properties, __atlas_id: feature.id },
  })) };
  map.addSource(id, { type: 'geojson', data, promoteId: '__atlas_id', attribution: escapeAttribution(dataset.metadata.attribution) });
  const layers = [`${id}-fill`, `${id}-line`, `${id}-point`];
  map.addLayer({ id: layers[0], source: id, type: 'fill', filter: ['==', '$type', 'Polygon'], paint: { 'fill-color': '#5eead4', 'fill-opacity': 0.2 } });
  map.addLayer({ id: layers[1], source: id, type: 'line', filter: ['!=', '$type', 'Point'], paint: { 'line-color': '#5eead4', 'line-width': 2 } });
  map.addLayer({ id: layers[2], source: id, type: 'circle', filter: ['==', '$type', 'Point'], paint: { 'circle-radius': 9, 'circle-color': '#5eead4', 'circle-stroke-width': 3, 'circle-stroke-color': '#0f172a' } });
  return {
    layers,
    setVisible(visible: boolean) { for (const layer of layers) map.setLayoutProperty(layer, 'visibility', visible ? 'visible' : 'none'); },
    dispose() { for (const layer of [...layers].reverse()) if (map.getLayer(layer)) map.removeLayer(layer); if (map.getSource(id)) map.removeSource(id); }
  };
}

/** MapLibre attribution accepts HTML; metadata is treated as plain text. */
export function escapeAttribution(value: string): string {
  return value.replace(/[&<>\"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '\"': '&quot;', "'": '&#39;' })[char]!);
}
