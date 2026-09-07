import type { ExpressionSpecification, Map } from 'maplibre-gl';
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

const ADMIN_STYLE = {
  0: { color: '#f5f8fa', opacity: 0, width: 2.5, minzoom: 0 },
  1: { color: '#35b6a5', opacity: 0.34, width: 2.2, minzoom: 0 },
  2: { color: '#8fd8cf', opacity: 0, width: 0.85, minzoom: 6 },
  3: { color: '#c8eee9', opacity: 0.02, width: 0.55, minzoom: 8 },
} as const;

// Display-only palette: the colors distinguish provinces without encoding a
// measurement, status, or hazard classification.
const PROVINCE_COLORS: ExpressionSpecification = ['match', ['get', 'pcode'],
  'NP01', '#2f8f9d', 'NP02', '#c9825b', 'NP03', '#6f9ec8',
  'NP04', '#8b74b8', 'NP05', '#b58a4a', 'NP06', '#5f9c78',
  'NP07', '#b56576', '#35b6a5',
];

/** Mount one administrative level with zoom-aware polygons and selection state. */
export function mountAdministrativeDataset(map: Map, dataset: Dataset) {
  const first = dataset.collection.features[0]?.properties;
  if (first?.admin_level === undefined) throw new Error('Administrative dataset has no level');
  const level = first.admin_level;
  const style = ADMIN_STYLE[level];
  const source = `${dataset.metadata.dataset_id}@${dataset.metadata.dataset_version}`;
  if (map.getSource(source)) throw new Error(`Dataset already mounted: ${source}`);
  const data = { ...dataset.collection, features: dataset.collection.features.map(feature => ({
    ...feature, properties: { ...feature.properties, __atlas_id: feature.id },
  })) };
  const featureIds = new Set(dataset.collection.features.map(feature => String(feature.id)));
  let selected: string | null = null;
  map.addSource(source, { type: 'geojson', data, promoteId: '__atlas_id', attribution: escapeAttribution(dataset.metadata.attribution) });
  const fill = `${source}-fill`;
  const line = `${source}-line`;
  const specialColor: ExpressionSpecification = ['case', ['==', ['get', 'admin_category'], 'special_area'], '#f0ad4e', style.color];
  const fillColor = level === 1 ? PROVINCE_COLORS : specialColor;
  const lineColor = level === 1 ? '#e4faf6' : specialColor;
  map.addLayer({ id: fill, source, type: 'fill', minzoom: style.minzoom, paint: {
    'fill-color': fillColor,
    'fill-opacity': ['case', ['boolean', ['feature-state', 'selected'], false], Math.max(style.opacity, 0.42), style.opacity],
  } });
  map.addLayer({ id: line, source, type: 'line', minzoom: style.minzoom, paint: {
    'line-color': ['case', ['boolean', ['feature-state', 'selected'], false], '#ffffff', lineColor],
    'line-width': ['case', ['boolean', ['feature-state', 'selected'], false], 3, style.width],
  } });
  return {
    source,
    level,
    layers: [fill, line],
    interactiveLayers: [fill],
    setVisible(visible: boolean) {
      for (const layer of [fill, line]) map.setLayoutProperty(layer, 'visibility', visible ? 'visible' : 'none');
    },
    setSelected(id: string | null) {
      if (selected && featureIds.has(selected)) map.setFeatureState({ source, id: selected }, { selected: false });
      selected = id && featureIds.has(id) ? id : null;
      if (selected) map.setFeatureState({ source, id: selected }, { selected: true });
    },
    dispose() {
      for (const layer of [line, fill]) if (map.getLayer(layer)) map.removeLayer(layer);
      if (map.getSource(source)) map.removeSource(source);
    },
  };
}

/** Mount the Nepal peak catalogue with elevation-aware zoom thresholds and selection. */
export function mountMountainDataset(map: Map, dataset: Dataset) {
  if (dataset.collection.features.some(feature => feature.properties.entity_type !== 'mountain')) throw new Error('Mountain dataset contains a non-mountain feature');
  const source = `${dataset.metadata.dataset_id}@${dataset.metadata.dataset_version}`;
  if (map.getSource(source)) throw new Error(`Dataset already mounted: ${source}`);
  const data = { ...dataset.collection, features: dataset.collection.features.map(feature => ({
    ...feature, properties: { ...feature.properties, __atlas_id: feature.id },
  })) };
  map.addSource(source, { type: 'geojson', data, promoteId: '__atlas_id', attribution: escapeAttribution(dataset.metadata.attribution) });
  const major = `${source}-major`;
  const peaks = `${source}-peaks`;
  const labels = `${source}-labels`;
  const selectedPaint: ExpressionSpecification = ['case', ['boolean', ['feature-state', 'selected'], false], '#ffffff', '#e9c46a'];
  map.addLayer({ id: major, source, type: 'circle', filter: ['>=', ['coalesce', ['get', 'value'], -1], 7000], minzoom: 4,
    paint: { 'circle-radius': ['interpolate', ['linear'], ['zoom'], 4, 4, 8, 7], 'circle-color': selectedPaint, 'circle-stroke-color': '#172a30', 'circle-stroke-width': 1.5 } });
  map.addLayer({ id: peaks, source, type: 'circle', filter: ['<', ['coalesce', ['get', 'value'], -1], 7000], minzoom: 7,
    paint: { 'circle-radius': ['interpolate', ['linear'], ['zoom'], 7, 2.5, 11, 5], 'circle-color': selectedPaint, 'circle-stroke-color': '#172a30', 'circle-stroke-width': 1 } });
  map.addLayer({ id: labels, source, type: 'symbol', minzoom: 5.5,
    filter: ['>=', ['coalesce', ['get', 'value'], -1], 6000], layout: {
      'text-field': ['get', 'name'], 'text-size': ['interpolate', ['linear'], ['zoom'], 5.5, 10, 9, 12], 'text-offset': [0, 1.1], 'text-anchor': 'top',
      'text-allow-overlap': false, 'text-ignore-placement': false,
    }, paint: { 'text-color': '#f7f3df', 'text-halo-color': '#172a30', 'text-halo-width': 1.2 } });
  const featureIds = new Set(dataset.collection.features.map(feature => String(feature.id)));
  let selected: string | null = null;
  const layers = [major, peaks, labels];
  return {
    source,
    layers,
    interactiveLayers: [major, peaks],
    setVisible(visible: boolean) { for (const layer of layers) map.setLayoutProperty(layer, 'visibility', visible ? 'visible' : 'none'); },
    setSelected(id: string | null) {
      if (selected && featureIds.has(selected)) map.setFeatureState({ source, id: selected }, { selected: false });
      selected = id && featureIds.has(id) ? id : null;
      if (selected) map.setFeatureState({ source, id: selected }, { selected: true });
    },
    dispose() {
      for (const layer of [...layers].reverse()) if (map.getLayer(layer)) map.removeLayer(layer);
      if (map.getSource(source)) map.removeSource(source);
    },
  };
}

/** Mount one immutable river-network partition while preserving stable reach selection IDs. */
export function mountRiverDataset(map: Map, dataset: Dataset) {
  if (dataset.collection.features.some(feature => feature.properties.entity_type !== 'river')) throw new Error('River dataset contains a non-river feature');
  const source = `${dataset.metadata.dataset_id}@${dataset.metadata.dataset_version}`;
  if (map.getSource(source)) throw new Error(`Dataset already mounted: ${source}`);
  const data = { ...dataset.collection, features: dataset.collection.features.map(feature => ({
    ...feature, properties: { ...feature.properties, __atlas_id: feature.id },
  })) };
  map.addSource(source, { type: 'geojson', data, promoteId: '__atlas_id', attribution: escapeAttribution(dataset.metadata.attribution) });
  const line = `${source}-line`;
  const minzoom = dataset.metadata.dataset_id.endsWith('headwaters') ? 6.5 : 4.5;
  const width: ExpressionSpecification = ['interpolate', ['linear'], ['get', 'flow_order'], 3, 4.2, 4, 3.2, 5, 2.1, 6, 1.4, 7, 0.9, 8, 0.6];
  map.addLayer({ id: line, source, type: 'line', minzoom, paint: {
    'line-color': ['case', ['boolean', ['feature-state', 'selected'], false], '#ffffff', '#4aa9d8'],
    'line-width': ['case', ['boolean', ['feature-state', 'selected'], false], 5, width],
    'line-opacity': ['case', ['boolean', ['feature-state', 'selected'], false], 1, 0.82],
  } });
  const ids = new Set(dataset.collection.features.map(feature => String(feature.id)));
  let selected: string | null = null;
  return {
    source,
    layers: [line],
    interactiveLayers: [line],
    setVisible(visible: boolean) { map.setLayoutProperty(line, 'visibility', visible ? 'visible' : 'none'); },
    setSelected(id: string | null) {
      if (selected && ids.has(selected)) map.setFeatureState({ source, id: selected }, { selected: false });
      selected = id && ids.has(id) ? id : null;
      if (selected) map.setFeatureState({ source, id: selected }, { selected: true });
    },
    dispose() {
      if (map.getLayer(line)) map.removeLayer(line);
      if (map.getSource(source)) map.removeSource(source);
    },
  };
}

/** Mount one RGI glacier partition with dated-inventory styling and stable selection IDs. */
export function mountGlacierDataset(map: Map, dataset: Dataset) {
  if (dataset.collection.features.some(feature => feature.properties.entity_type !== 'glacier')) throw new Error('Glacier dataset contains a non-glacier feature');
  const source = `${dataset.metadata.dataset_id}@${dataset.metadata.dataset_version}`;
  if (map.getSource(source)) throw new Error(`Dataset already mounted: ${source}`);
  const data = { ...dataset.collection, features: dataset.collection.features.map(feature => ({
    ...feature, properties: { ...feature.properties, __atlas_id: feature.id },
  })) };
  map.addSource(source, { type: 'geojson', data, promoteId: '__atlas_id', attribution: escapeAttribution(dataset.metadata.attribution) });
  const fill = `${source}-fill`;
  const line = `${source}-line`;
  map.addLayer({ id: fill, source, type: 'fill', minzoom: 5.5, paint: {
    'fill-color': ['case', ['boolean', ['feature-state', 'selected'], false], '#ffffff', '#9dd9ef'],
    'fill-opacity': ['case', ['boolean', ['feature-state', 'selected'], false], 0.72, 0.42],
  } });
  map.addLayer({ id: line, source, type: 'line', minzoom: 5.5, paint: {
    'line-color': ['case', ['boolean', ['feature-state', 'selected'], false], '#ffffff', '#d8f2fb'],
    'line-width': ['case', ['boolean', ['feature-state', 'selected'], false], 2.8, 0.9],
  } });
  const ids = new Set(dataset.collection.features.map(feature => String(feature.id)));
  let selected: string | null = null;
  const layers = [fill, line];
  return {
    source,
    layers,
    interactiveLayers: [fill],
    setVisible(visible: boolean) { for (const layer of layers) map.setLayoutProperty(layer, 'visibility', visible ? 'visible' : 'none'); },
    setSelected(id: string | null) {
      if (selected && ids.has(selected)) map.setFeatureState({ source, id: selected }, { selected: false });
      selected = id && ids.has(id) ? id : null;
      if (selected) map.setFeatureState({ source, id: selected }, { selected: true });
    },
    dispose() {
      for (const layer of [...layers].reverse()) if (map.getLayer(layer)) map.removeLayer(layer);
      if (map.getSource(source)) map.removeSource(source);
    },
  };
}

/** MapLibre attribution accepts HTML; metadata is treated as plain text. */
export function escapeAttribution(value: string): string {
  return value.replace(/[&<>\"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '\"': '&quot;', "'": '&#39;' })[char]!);
}
