import type { ExpressionSpecification, FilterSpecification, Map } from 'maplibre-gl';
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

/** Mount the GLO unique-lake centroid inventory without implying hazard status. */
export function mountGlacialLakeDataset(map: Map, dataset: Dataset) {
  if (dataset.collection.features.some(feature => feature.properties.entity_type !== 'glacial_lake')) throw new Error('Glacial lake dataset contains a non-lake feature');
  const source = `${dataset.metadata.dataset_id}@${dataset.metadata.dataset_version}`;
  if (map.getSource(source)) throw new Error(`Dataset already mounted: ${source}`);
  const data = { ...dataset.collection, features: dataset.collection.features.map(feature => ({
    ...feature, properties: { ...feature.properties, __atlas_id: feature.id },
  })) };
  map.addSource(source, { type: 'geojson', data, promoteId: '__atlas_id', attribution: escapeAttribution(dataset.metadata.attribution) });
  const points = `${source}-points`;
  const sourceColor: ExpressionSpecification = ['match', ['get', 'connectivity'], 'Glacier-fed', '#38bdf8', 'Non Glacier-fed', '#67e8f9', '#67e8f9'];
  map.addLayer({ id: points, source, type: 'circle', minzoom: 5.5, paint: {
    'circle-radius': ['case', ['boolean', ['feature-state', 'selected'], false], 9,
      ['interpolate', ['linear'], ['get', 'area_km2'], 0.001, 2.4, 0.1, 4.2, 1, 7, 5.6, 10.5]],
    'circle-color': ['case', ['boolean', ['feature-state', 'selected'], false], '#ffffff', sourceColor],
    'circle-opacity': 0.86,
    'circle-stroke-color': '#14364a',
    'circle-stroke-width': ['case', ['boolean', ['feature-state', 'selected'], false], 2.5, 1],
  } });
  const ids = new Set(dataset.collection.features.map(feature => String(feature.id)));
  let selected: string | null = null;
  return {
    source,
    layers: [points],
    interactiveLayers: [points],
    setVisible(visible: boolean) { map.setLayoutProperty(points, 'visibility', visible ? 'visible' : 'none'); },
    setSelected(id: string | null) {
      if (selected && ids.has(selected)) map.setFeatureState({ source, id: selected }, { selected: false });
      selected = id && ids.has(id) ? id : null;
      if (selected) map.setFeatureState({ source, id: selected }, { selected: true });
    },
    dispose() {
      if (map.getLayer(points)) map.removeLayer(points);
      if (map.getSource(source)) map.removeSource(source);
    },
  };
}

/** Mount BIPAD/DHM hydrology stations; source status colors describe only the station reading. */
export function mountHydrologyDataset(map: Map, dataset: Dataset) {
  if (dataset.collection.features.some(feature => feature.properties.entity_type !== 'hydrology_station')) throw new Error('Hydrology dataset contains a non-station feature');
  const source = `${dataset.metadata.dataset_id}@${dataset.metadata.dataset_version}`;
  if (map.getSource(source)) throw new Error(`Dataset already mounted: ${source}`);
  const data = { ...dataset.collection, features: dataset.collection.features.map(feature => ({ ...feature, properties: { ...feature.properties, __atlas_id: feature.id } })) };
  map.addSource(source, { type: 'geojson', data, promoteId: '__atlas_id', attribution: escapeAttribution(dataset.metadata.attribution) });
  const points = `${source}-points`;
  const statusColor: ExpressionSpecification = ['match', ['get', 'station_status'], 'ABOVE DANGER LEVEL', '#d1495b', 'ABOVE WARNING LEVEL', '#f4a261', '#2a9d8f'];
  map.addLayer({ id: points, source, type: 'circle', minzoom: 5, paint: {
    'circle-radius': ['case', ['boolean', ['feature-state', 'selected'], false], 9, 5.5],
    'circle-color': ['case', ['boolean', ['feature-state', 'selected'], false], '#ffffff', statusColor],
    'circle-stroke-color': '#102a3a', 'circle-stroke-width': 1.3, 'circle-opacity': 0.9,
  } });
  const ids = new Set(dataset.collection.features.map(feature => String(feature.id)));
  let selected: string | null = null;
  return {
    source, layers: [points], interactiveLayers: [points],
    setVisible(visible: boolean) { map.setLayoutProperty(points, 'visibility', visible ? 'visible' : 'none'); },
    setSelected(id: string | null) {
      if (selected && ids.has(selected)) map.setFeatureState({ source, id: selected }, { selected: false });
      selected = id && ids.has(id) ? id : null;
      if (selected) map.setFeatureState({ source, id: selected }, { selected: true });
    },
    dispose() { if (map.getLayer(points)) map.removeLayer(points); if (map.getSource(source)) map.removeSource(source); },
  };
}

export function mountRainfallDataset(map: Map, dataset: Dataset) {
  if (dataset.collection.features.some(feature => feature.properties.entity_type !== 'rainfall_station')) throw new Error('Rainfall dataset contains a non-station feature');
  const source = `${dataset.metadata.dataset_id}@${dataset.metadata.dataset_version}`;
  if (map.getSource(source)) throw new Error(`Dataset already mounted: ${source}`);
  const data = { ...dataset.collection, features: dataset.collection.features.map(feature => ({ ...feature, properties: { ...feature.properties, __atlas_id: feature.id } })) };
  map.addSource(source, { type: 'geojson', data, promoteId: '__atlas_id', attribution: escapeAttribution(dataset.metadata.attribution) });
  const points = `${source}-points`;
  const statusColor: ExpressionSpecification = ['match', ['get', 'station_status'], 'ABOVE WARNING LEVEL', '#f4a261', '#457b9d'];
  map.addLayer({ id: points, source, type: 'circle', minzoom: 5, paint: {
    'circle-radius': ['case', ['boolean', ['feature-state', 'selected'], false], 9, 5],
    'circle-color': ['case', ['boolean', ['feature-state', 'selected'], false], '#ffffff', statusColor],
    'circle-stroke-color': '#102a3a', 'circle-stroke-width': 1.2, 'circle-opacity': 0.88,
  } });
  const ids = new Set(dataset.collection.features.map(f => String(f.id))); let selected: string | null = null;
  return { source, layers:[points], interactiveLayers:[points], setVisible(v:boolean){map.setLayoutProperty(points,'visibility',v?'visible':'none');}, setSelected(id:string|null){if(selected&&ids.has(selected))map.setFeatureState({source,id:selected},{selected:false}); selected=id&&ids.has(id)?id:null; if(selected)map.setFeatureState({source,id:selected},{selected:true});}, dispose(){if(map.getLayer(points))map.removeLayer(points); if(map.getSource(source))map.removeSource(source);} };
}

/** Mount one historical BIPAD incident partition. Colors distinguish hazard categories, not severity. */
export function mountDisasterEventDataset(map: Map, dataset: Dataset) {
  if (dataset.collection.features.some(feature => feature.properties.entity_type !== 'disaster_event')) throw new Error('Disaster archive contains a non-event feature');
  const source = `${dataset.metadata.dataset_id}@${dataset.metadata.dataset_version}`;
  if (map.getSource(source)) throw new Error(`Dataset already mounted: ${source}`);
  const data = { ...dataset.collection, features: dataset.collection.features.map(feature => ({ ...feature, properties: { ...feature.properties, __atlas_id: feature.id } })) };
  map.addSource(source, { type: 'geojson', data, promoteId: '__atlas_id', attribution: escapeAttribution(dataset.metadata.attribution) });
  const points = `${source}-points`;
  const categoryColor: ExpressionSpecification = ['match', ['get', 'hazard_name'],
    'Flood', '#3b82f6', 'Landslide', '#a16207', 'Earthquake', '#f97316', 'Heavy Rainfall', '#60a5fa',
    'Fire', '#dc2626', 'Forest Fire', '#b91c1c', 'Thunderbolt', '#eab308', '#8b9aaa'];
  map.addLayer({ id: points, source, type: 'circle', minzoom: 6.5, paint: {
    'circle-radius': ['case', ['boolean', ['feature-state', 'selected'], false], 7, 3.2],
    'circle-color': ['case', ['boolean', ['feature-state', 'selected'], false], '#ffffff', categoryColor],
    'circle-opacity': 0.8, 'circle-stroke-color': '#132b3a', 'circle-stroke-width': 0.7,
  } });
  const ids = new Set(dataset.collection.features.map(feature => String(feature.id))); let selected: string | null = null;
  return {
    source, layers: [points], interactiveLayers: [points],
    setVisible(visible: boolean) { map.setLayoutProperty(points, 'visibility', visible ? 'visible' : 'none'); },
    setArchiveFilter(hazard: string, start: string, end: string) {
      const clauses: FilterSpecification[] = [];
      if (hazard) clauses.push(['==', ['get', 'hazard_name'], hazard]);
      if (start) clauses.push(['>=', ['get', 'event_time'], `${start}T00:00:00Z`]);
      if (end) clauses.push(['<=', ['get', 'event_time'], `${end}T23:59:59Z`]);
      const filter = clauses.length === 0 ? null : clauses.length === 1 ? clauses[0] : ['all', ...clauses] as FilterSpecification;
      map.setFilter(points, filter);
    },
    setSelected(id: string | null) { if (selected && ids.has(selected)) map.setFeatureState({ source, id: selected }, { selected: false }); selected = id && ids.has(id) ? id : null; if (selected) map.setFeatureState({ source, id: selected }, { selected: true }); },
    dispose() { if (map.getLayer(points)) map.removeLayer(points); if (map.getSource(source)) map.removeSource(source); },
  };
}

/** Mount USGS ComCat epicenters. Radius is a monotonic display transform of magnitude, not a damage footprint. */
export function mountEarthquakeDataset(map: Map, dataset: Dataset) {
  if (dataset.collection.features.some(feature => feature.properties.entity_type !== 'earthquake')) throw new Error('Earthquake dataset contains a non-earthquake feature');
  const source = `${dataset.metadata.dataset_id}@${dataset.metadata.dataset_version}`;
  if (map.getSource(source)) throw new Error(`Dataset already mounted: ${source}`);
  const data = { ...dataset.collection, features: dataset.collection.features.map(feature => ({ ...feature, properties: { ...feature.properties, __atlas_id: feature.id } })) };
  map.addSource(source, { type: 'geojson', data, promoteId: '__atlas_id', attribution: escapeAttribution(dataset.metadata.attribution) });
  const points = `${source}-points`;
  map.addLayer({ id: points, source, type: 'circle', minzoom: 4.5, paint: {
    'circle-radius': ['case', ['boolean', ['feature-state', 'selected'], false], 15,
      ['interpolate', ['exponential', 1.45], ['get', 'magnitude'], 2.5, 3, 4, 4.5, 5, 6.2, 6, 8.8, 7, 12.2, 8, 16]],
    'circle-color': ['case', ['boolean', ['feature-state', 'selected'], false], '#ffffff', '#ef8354'],
    'circle-opacity': 0.78, 'circle-stroke-color': '#402218', 'circle-stroke-width': 1.1,
  } });
  const ids = new Set(dataset.collection.features.map(feature => String(feature.id))); let selected: string | null = null;
  return {
    source, layers: [points], interactiveLayers: [points],
    setVisible(visible: boolean) { map.setLayoutProperty(points, 'visibility', visible ? 'visible' : 'none'); },
    setFilter(minMagnitude: number, start: string, end: string) {
      const clauses: FilterSpecification[] = [['>=', ['get', 'magnitude'], minMagnitude]];
      if (start) clauses.push(['>=', ['get', 'event_time'], `${start}T00:00:00Z`]);
      if (end) clauses.push(['<=', ['get', 'event_time'], `${end}T23:59:59Z`]);
      map.setFilter(points, ['all', ...clauses] as FilterSpecification);
    },
    setSelected(id: string | null) { if (selected && ids.has(selected)) map.setFeatureState({ source, id: selected }, { selected: false }); selected = id && ids.has(id) ? id : null; if (selected) map.setFeatureState({ source, id: selected }, { selected: true }); },
    dispose() { if (map.getLayer(points)) map.removeLayer(points); if (map.getSource(source)) map.removeSource(source); },
  };
}

/** Mount reported BIPAD flood incident points; symbols never represent inundation extent. */
export function mountFloodDataset(map: Map, dataset: Dataset) {
  if (dataset.collection.features.some(feature => feature.properties.entity_type !== 'flood_event')) throw new Error('Flood dataset contains a non-flood feature');
  const source = `${dataset.metadata.dataset_id}@${dataset.metadata.dataset_version}`;
  if (map.getSource(source)) throw new Error(`Dataset already mounted: ${source}`);
  const data = { ...dataset.collection, features: dataset.collection.features.map(feature => ({ ...feature, properties: { ...feature.properties, __atlas_id: feature.id } })) };
  map.addSource(source, { type: 'geojson', data, promoteId: '__atlas_id', attribution: escapeAttribution(dataset.metadata.attribution) });
  const points = `${source}-reported-points`;
  map.addLayer({ id: points, source, type: 'circle', minzoom: 6, paint: {
    'circle-radius': ['case', ['boolean', ['feature-state', 'selected'], false], 8, 4],
    'circle-color': ['case', ['boolean', ['feature-state', 'selected'], false], '#ffffff', '#3182ce'],
    'circle-opacity': 0.82, 'circle-stroke-color': '#102a43', 'circle-stroke-width': 1,
  } });
  const ids = new Set(dataset.collection.features.map(feature => String(feature.id))); let selected: string | null = null;
  return {
    source, layers: [points], interactiveLayers: [points],
    setVisible(visible: boolean) { map.setLayoutProperty(points, 'visibility', visible ? 'visible' : 'none'); },
    setFilter(start: string, end: string) {
      const clauses: FilterSpecification[] = [];
      if (start) clauses.push(['>=', ['get', 'event_time'], `${start}T00:00:00Z`]);
      if (end) clauses.push(['<=', ['get', 'event_time'], `${end}T23:59:59Z`]);
      map.setFilter(points, clauses.length ? ['all', ...clauses] as FilterSpecification : null);
    },
    setSelected(id: string | null) { if (selected && ids.has(selected)) map.setFeatureState({ source, id: selected }, { selected: false }); selected = id && ids.has(id) ? id : null; if (selected) map.setFeatureState({ source, id: selected }, { selected: true }); },
    dispose() { if (map.getLayer(points)) map.removeLayer(points); if (map.getSource(source)) map.removeSource(source); },
  };
}

/** Mount reported BIPAD landslide points; this is not a susceptibility surface. */
export function mountLandslideDataset(map: Map, dataset: Dataset) {
  if (dataset.collection.features.some(feature => feature.properties.entity_type !== 'landslide_event')) throw new Error('Landslide dataset contains a non-landslide feature');
  const source = `${dataset.metadata.dataset_id}@${dataset.metadata.dataset_version}`;
  if (map.getSource(source)) throw new Error(`Dataset already mounted: ${source}`);
  const data = { ...dataset.collection, features: dataset.collection.features.map(feature => ({ ...feature, properties: { ...feature.properties, __atlas_id: feature.id } })) };
  map.addSource(source, { type: 'geojson', data, promoteId: '__atlas_id', attribution: escapeAttribution(dataset.metadata.attribution) });
  const points = `${source}-reported-points`;
  map.addLayer({ id: points, source, type: 'circle', minzoom: 6, paint: {
    'circle-radius': ['case', ['boolean', ['feature-state', 'selected'], false], 8, 4],
    'circle-color': ['case', ['boolean', ['feature-state', 'selected'], false], '#ffffff', '#a16207'],
    'circle-opacity': 0.82, 'circle-stroke-color': '#3f2d13', 'circle-stroke-width': 1,
  } });
  const ids = new Set(dataset.collection.features.map(feature => String(feature.id))); let selected: string | null = null;
  return {
    source, layers: [points], interactiveLayers: [points],
    setVisible(visible: boolean) { map.setLayoutProperty(points, 'visibility', visible ? 'visible' : 'none'); },
    setFilter(start: string, end: string, verifiedOnly: boolean) {
      const clauses: FilterSpecification[] = [];
      if (start) clauses.push(['>=', ['get', 'event_time'], `${start}T00:00:00Z`]);
      if (end) clauses.push(['<=', ['get', 'event_time'], `${end}T23:59:59Z`]);
      if (verifiedOnly) clauses.push(['==', ['get', 'verified'], true]);
      map.setFilter(points, clauses.length ? ['all', ...clauses] as FilterSpecification : null);
    },
    setSelected(id: string | null) { if (selected && ids.has(selected)) map.setFeatureState({ source, id: selected }, { selected: false }); selected = id && ids.has(id) ? id : null; if (selected) map.setFeatureState({ source, id: selected }, { selected: true }); },
    dispose() { if (map.getLayer(points)) map.removeLayer(points); if (map.getSource(source)) map.removeSource(source); },
  };
}

/** Mount OSM hydropower facilities with display clustering; no proximity-based risk semantics. */
export function mountHydropowerDataset(map: Map, dataset: Dataset) {
  if (dataset.collection.features.some(feature => feature.properties.entity_type !== 'hydropower_facility')) throw new Error('Hydropower dataset contains a non-facility feature');
  const source = `${dataset.metadata.dataset_id}@${dataset.metadata.dataset_version}`;
  if (map.getSource(source)) throw new Error(`Dataset already mounted: ${source}`);
  const data = { ...dataset.collection, features: dataset.collection.features.map(feature => ({ ...feature, properties: { ...feature.properties, __atlas_id: feature.id } })) };
  map.addSource(source, { type: 'geojson', data, promoteId: '__atlas_id', cluster: true, clusterRadius: 42, clusterMaxZoom: 8, attribution: escapeAttribution(dataset.metadata.attribution) });
  const clusters = `${source}-clusters`; const points = `${source}-points`;
  map.addLayer({ id: clusters, source, type: 'circle', filter: ['has', 'point_count'], paint: {
    'circle-radius': ['interpolate', ['linear'], ['get', 'point_count'], 2, 11, 10, 17, 30, 23],
    'circle-color': '#2f855a', 'circle-opacity': 0.78, 'circle-stroke-color': '#d9f99d', 'circle-stroke-width': 1.5,
  } });
  map.addLayer({ id: points, source, type: 'circle', filter: ['!', ['has', 'point_count']], paint: {
    'circle-radius': ['case', ['boolean', ['feature-state', 'selected'], false], 10,
      ['interpolate', ['linear'], ['coalesce', ['get', 'capacity_mw'], 0], 0, 5, 10, 6, 100, 8, 500, 11]],
    'circle-color': ['case', ['boolean', ['feature-state', 'selected'], false], '#ffffff', '#65a30d'],
    'circle-stroke-color': '#26410e', 'circle-stroke-width': 1.2, 'circle-opacity': 0.9,
  } });
  const ids = new Set(dataset.collection.features.map(feature => String(feature.id))); let selected: string | null = null;
  return {
    source, layers: [clusters, points], interactiveLayers: [points],
    setVisible(visible: boolean) { for (const layer of [clusters, points]) map.setLayoutProperty(layer, 'visibility', visible ? 'visible' : 'none'); },
    setSelected(id: string | null) { if (selected && ids.has(selected)) map.setFeatureState({ source, id: selected }, { selected: false }); selected = id && ids.has(id) ? id : null; if (selected) map.setFeatureState({ source, id: selected }, { selected: true }); },
    dispose() { for (const layer of [points, clusters]) if (map.getLayer(layer)) map.removeLayer(layer); if (map.getSource(source)) map.removeSource(source); },
  };
}

/** Mount one OSM infrastructure delivery partition without implying exposure or risk. */
export function mountInfrastructureDataset(map: Map, dataset: Dataset) {
  if (dataset.collection.features.some(feature => feature.properties.entity_type !== 'infrastructure_asset')) throw new Error('Infrastructure dataset contains a non-infrastructure feature');
  const klass = dataset.collection.features[0]?.properties.infrastructure_class;
  if (!klass) throw new Error('Infrastructure dataset has no class');
  if (dataset.collection.features.some(feature => feature.properties.infrastructure_class !== klass)) throw new Error('Infrastructure delivery partition mixes classes');
  const source = `${dataset.metadata.dataset_id}@${dataset.metadata.dataset_version}`;
  if (map.getSource(source)) throw new Error(`Dataset already mounted: ${source}`);
  const data = { ...dataset.collection, features: dataset.collection.features.map(feature => ({ ...feature, properties: { ...feature.properties, __atlas_id: feature.id } })) };
  const pointClass = klass !== 'road';
  map.addSource(source, {
    type: 'geojson', data, promoteId: '__atlas_id', attribution: escapeAttribution(dataset.metadata.attribution),
    ...(pointClass ? { cluster: true, clusterRadius: 38, clusterMaxZoom: 9 } : {}),
  });
  const ids = new Set(dataset.collection.features.map(feature => String(feature.id))); let selected: string | null = null;
  const color: Record<string, string> = { road: '#f3c969', bridge: '#d7a65a', school: '#8cc7e8', health: '#62c59b', emergency: '#d88d8d', settlement: '#c3a4df' };
  if (klass === 'road') {
    const line = `${source}-line`;
    map.addLayer({ id: line, source, type: 'line', minzoom: 5, paint: {
      'line-color': ['case', ['boolean', ['feature-state', 'selected'], false], '#ffffff', color.road],
      'line-width': ['case', ['boolean', ['feature-state', 'selected'], false], 5,
        ['match', ['get', 'asset_subtype'], 'motorway', 3.2, 'trunk', 2.7, 'primary', 2.2, 1.5]],
      'line-opacity': 0.88,
    } });
    return {
      source, klass, layers: [line], interactiveLayers: [line],
      setVisible(visible: boolean) { map.setLayoutProperty(line, 'visibility', visible ? 'visible' : 'none'); },
      setSelected(id: string | null) { if (selected && ids.has(selected)) map.setFeatureState({ source, id: selected }, { selected: false }); selected = id && ids.has(id) ? id : null; if (selected) map.setFeatureState({ source, id: selected }, { selected: true }); },
      dispose() { if (map.getLayer(line)) map.removeLayer(line); if (map.getSource(source)) map.removeSource(source); },
    };
  }
  const clusters = `${source}-clusters`; const points = `${source}-points`;
  map.addLayer({ id: clusters, source, type: 'circle', filter: ['has', 'point_count'], minzoom: 5, paint: {
    'circle-radius': ['interpolate', ['linear'], ['get', 'point_count'], 2, 9, 25, 15, 250, 22],
    'circle-color': color[klass], 'circle-opacity': 0.72, 'circle-stroke-color': '#152a36', 'circle-stroke-width': 1,
  } });
  map.addLayer({ id: points, source, type: 'circle', filter: ['!', ['has', 'point_count']], minzoom: 5, paint: {
    'circle-radius': ['case', ['boolean', ['feature-state', 'selected'], false], 9, klass === 'settlement' ? 4.5 : 5.5],
    'circle-color': ['case', ['boolean', ['feature-state', 'selected'], false], '#ffffff', color[klass]],
    'circle-stroke-color': '#152a36', 'circle-stroke-width': 1, 'circle-opacity': 0.9,
  } });
  return {
    source, klass, layers: [clusters, points], interactiveLayers: [points],
    setVisible(visible: boolean) { for (const layer of [clusters, points]) map.setLayoutProperty(layer, 'visibility', visible ? 'visible' : 'none'); },
    setSelected(id: string | null) { if (selected && ids.has(selected)) map.setFeatureState({ source, id: selected }, { selected: false }); selected = id && ids.has(id) ? id : null; if (selected) map.setFeatureState({ source, id: selected }, { selected: true }); },
    dispose() { for (const layer of [points, clusters]) if (map.getLayer(layer)) map.removeLayer(layer); if (map.getSource(source)) map.removeSource(source); },
  };
}

/** MapLibre attribution accepts HTML; metadata is treated as plain text. */
export function escapeAttribution(value: string): string {
  return value.replace(/[&<>\"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '\"': '&quot;', "'": '&#39;' })[char]!);
}
