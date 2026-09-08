import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import type { FeatureCollection, Geometry } from 'geojson';
import schema from '../../schemas/dataset.schema.json';

export type DataStatus = 'VERIFIED_SOURCE' | 'SATELLITE_DERIVED' | 'ATLAS_DERIVED' | 'ESTIMATED' | 'MODELLED' | 'HISTORICAL' | 'UNKNOWN';
export type EvidenceType = 'observed' | 'derived' | 'estimated' | 'modelled' | 'historical' | 'unknown';
export type Unit = 'm' | 'm2' | 'km2' | 'm3' | 'm3/s' | 'mm' | 'degC' | 'person' | 'MW';
export interface Metadata {
  schema_version: '1.0.0'; dataset_id: string; dataset_name: string; dataset_version: string;
  source: string; source_url: string | null; license: string; license_url: string | null; attribution: string;
  observation_date: string | null; publication_date: string | null; retrieval_date: string; processing_date: string;
  processing_version: string; method: string; spatial_resolution: { value: number | null; unit: 'm' | 'degree' | null };
  temporal_resolution: string | null; spatial_coverage: { description: string; bbox: [number, number, number, number] };
  temporal_coverage: { start: string | null; end: string | null }; crs: 'OGC:CRS84'; status: DataStatus;
  evidence_type: EvidenceType; is_fixture: boolean; limitations: string[]; uncertainty: string;
  update_frequency: 'static' | 'periodic' | 'operational'; stale_after: string | null;
  artifact: { path: string; format: 'GeoJSON' | 'GeoJSON+gzip'; sha256: string; byte_size: number };
}
export interface FeatureProperties {
  dataset_id: string; dataset_version: string; name: string; is_fixture: boolean; value: number | null; unit: Unit | null;
  admin_level?: 0 | 1 | 2 | 3;
  admin_category?: 'country' | 'province' | 'district' | 'local_level' | 'special_area';
  pcode?: string; parent_pcode?: string | null; parent_name?: string | null; aliases?: string[];
  label_longitude?: number; label_latitude?: number; valid_from?: string; valid_to?: string | null; source_version?: string;
  entity_type?: 'mountain' | 'river' | 'glacier' | 'glacial_lake' | 'hydrology_station' | 'rainfall_station' | 'disaster_event' | 'earthquake' | 'flood_event' | 'landslide_event' | 'hydropower_facility' | 'infrastructure_asset'; source_id?: string; search_terms?: string[]; feature_code?: string;
  source_modified?: string; elevation_reference?: string;
  river_name?: string | null; downstream_id?: string | null; downstream_in_release?: boolean; main_river_id?: string;
  flow_order?: number; length_km?: number; distance_downstream_km?: number; distance_upstream_km?: number;
  catchment_area_km2?: number; upstream_area_km2?: number; average_discharge_m3s?: number;
  flow_regime?: 'perennial' | 'intermittent' | 'unknown'; hydrobasin_level12_id?: string;
  glacier_name?: string | null; glims_id?: string; outline_date?: string; area_km2?: number;
  centroid_longitude?: number; centroid_latitude?: number; elevation_min_m?: number; elevation_max_m?: number;
  elevation_mean_m?: number; dem_source?: string; inventory_region?: string; display_geometry_repaired?: boolean;
  lake_name?: string | null; country?: string; basin?: string | null; connectivity?: 'Glacier-fed' | 'Non Glacier-fed';
  data_source?: string; inventory_period?: string; perimeter_km?: number; expansion_rate_km2_per_year?: number | null;
  expansion_uncertainty_km2_per_year?: number | null; expansion_significant?: boolean | null;
  station_name?: string; observation_time?: string | null; water_level_m?: number | null; warning_level_m?: number | null;
  danger_level_m?: number | null; threshold_order_valid?: boolean; station_status?: string; trend?: string | null; station_series_id?: string; provider?: string;
  elevation_m?: number | null; coordinate_order_repaired?: boolean;
  rainfall_1h_mm?: number | null; rainfall_3h_mm?: number | null; rainfall_6h_mm?: number | null; rainfall_12h_mm?: number | null;
  rainfall_24h_mm?: number | null; rainfall_quality_warning?: boolean;
  hazard_id?: string; hazard_name?: string; hazard_type?: 'natural' | 'non natural'; event_time?: string; event_year?: number; event_local_date?: string; reported_time?: string | null;
  verified?: boolean; approved?: boolean; source_label?: string | null; data_source_name?: string | null; loss_reference_id?: string | null;
  reported_deaths?: number | null; reported_injured?: number | null; reported_missing?: number | null; reported_affected?: number | null;
  estimated_loss_npr?: number | null; street_address?: string | null; event_description?: string | null;
  magnitude?: number; depth_km?: number; place_name?: string | null; magnitude_type?: string | null; network?: string;
  significance?: number; event_status?: string; epicenter_only?: boolean;
  evidence_status?: 'observed' | 'reported' | 'derived' | 'modelled'; hazard_footprint?: boolean; flood_class?: string;
  landslide_category?: string; confidence?: string | null; confidence_basis?: string; susceptibility_output?: boolean;
  facility_name?: string | null; facility_status?: string; facility_type?: string; capacity_mw?: number | null; plant_method?: string | null;
  operator_name?: string | null; osm_element_type?: 'node' | 'way' | 'relation'; osm_element_id?: string; osm_source_timestamp?: string;
  infrastructure_class?: 'road' | 'bridge' | 'school' | 'health' | 'emergency' | 'settlement'; asset_name?: string | null;
  asset_subtype?: string; position_basis?: string; display_geometry_simplified?: boolean; asset_ref?: string | null; surface?: string | null;
}
export type AtlasCollection = FeatureCollection<Exclude<Geometry, { type: 'GeometryCollection' }>, FeatureProperties>;
export interface Dataset { metadata: Metadata; collection: AtlasCollection }
const ajv = new Ajv({ allErrors: true, strict: true });
addFormats(ajv);
const validate = ajv.compile<Dataset>(schema);

function coordinates(value: unknown): number[][] {
  const items = value as unknown[];
  return typeof items[0] === 'number' ? [items as number[]] : items.flatMap(coordinates);
}

/** Browser safety checks complement the full offline Shapely topology gate. */
export function parseDataset(input: unknown): Dataset {
  if (!validate(input)) throw new Error(`Invalid dataset: ${ajv.errorsText(validate.errors)}`);
  const { metadata: m, collection } = input;
  const [west, south, east, north] = m.spatial_coverage.bbox;
  if (!(west >= -180 && west < east && east <= 180 && south >= -90 && south < north && north <= 90)) throw new Error('Invalid coverage bounds');
  if (Date.parse(m.processing_date) < Date.parse(m.retrieval_date)) throw new Error('Processing precedes retrieval');
  const { start, end } = m.temporal_coverage;
  if (Boolean(start) !== Boolean(end) || (start && end && Date.parse(start) > Date.parse(end))) throw new Error('Invalid temporal coverage');
  if ((m.spatial_resolution.value === null) !== (m.spatial_resolution.unit === null)) throw new Error('Resolution needs value and unit');
  if (m.update_frequency !== 'static' && !m.stale_after) throw new Error('Updating datasets need a stale deadline');
  if (m.stale_after && Date.parse(m.stale_after) < Date.parse(m.retrieval_date)) throw new Error('Stale deadline precedes retrieval');
  const suffix = m.artifact.format === 'GeoJSON+gzip' ? '.gz' : '';
  if (m.artifact.path !== `/data/${m.dataset_id}/${m.dataset_version}/features.geojson${suffix}`) throw new Error('Artifact identity mismatch');
  const ids = new Set();
  for (const f of collection.features) {
    if (ids.has(f.id)) throw new Error('Duplicate feature identifier');
    ids.add(f.id);
    if (f.properties.dataset_id !== m.dataset_id || f.properties.dataset_version !== m.dataset_version || f.properties.is_fixture !== m.is_fixture) throw new Error('Feature identity mismatch');
    if (f.properties.value !== null && f.properties.unit === null) throw new Error('Measurements require units');
    if (f.properties.admin_level !== undefined) {
      const p = f.properties;
      if (p.pcode === undefined || p.admin_category === undefined || p.aliases === undefined || p.label_longitude === undefined || p.label_latitude === undefined || p.valid_from === undefined || p.source_version === undefined) throw new Error('Administrative features require complete hierarchy metadata');
      if (p.admin_level === 0 ? p.parent_pcode !== null || p.parent_name !== null : !p.parent_pcode || !p.parent_name) throw new Error('Administrative parent metadata is inconsistent');
      const wrongCategory = (p.admin_level === 0 && p.admin_category !== 'country') || (p.admin_level === 1 && p.admin_category !== 'province') || (p.admin_level === 2 && p.admin_category !== 'district');
      if (wrongCategory) throw new Error('Administrative category is inconsistent with its level');
      if (p.admin_level === 3 && !['local_level', 'special_area'].includes(p.admin_category)) throw new Error('Level 3 category is inconsistent');
      if (p.label_longitude < west || p.label_longitude > east || p.label_latitude < south || p.label_latitude > north) throw new Error('Administrative label is outside coverage');
    }
    if (f.properties.entity_type === 'mountain') {
      const p = f.properties;
      if (f.geometry.type !== 'Point' || !p.source_id || !p.search_terms?.length || !p.feature_code || !p.source_modified || !p.elevation_reference) throw new Error('Mountain features require complete catalogue metadata');
      if (!['PK', 'MT'].includes(p.feature_code)) throw new Error('Mountain feature code is unsupported');
      if (p.value !== null && (p.unit !== 'm' || p.value < 0 || p.value > 9000)) throw new Error('Mountain elevation is implausible');
      if (!p.search_terms.includes(p.name)) throw new Error('Mountain search terms must include the canonical name');
    }
    if (f.properties.entity_type === 'river') {
      const p = f.properties;
      if (!['LineString', 'MultiLineString'].includes(f.geometry.type) || !p.source_id || !p.search_terms?.length || !p.main_river_id || p.flow_order === undefined || p.length_km === undefined || p.distance_downstream_km === undefined || p.distance_upstream_km === undefined || p.catchment_area_km2 === undefined || p.upstream_area_km2 === undefined || p.average_discharge_m3s === undefined || p.downstream_in_release === undefined || !p.flow_regime || !p.hydrobasin_level12_id) throw new Error('River features require complete network metadata');
      if (p.downstream_id === p.source_id) throw new Error('River reach cannot flow to itself');
      if (p.value !== p.average_discharge_m3s || p.unit !== 'm3/s') throw new Error('River measurement must be average discharge');
    }
    if (f.properties.entity_type === 'glacier') {
      const p = f.properties;
      if (!['Polygon', 'MultiPolygon'].includes(f.geometry.type) || !p.source_id || !p.glims_id || !p.outline_date || p.area_km2 === undefined || p.centroid_longitude === undefined || p.centroid_latitude === undefined || p.elevation_min_m === undefined || p.elevation_max_m === undefined || p.elevation_mean_m === undefined || !p.dem_source || !p.inventory_region || p.display_geometry_repaired === undefined || !p.search_terms?.length) throw new Error('Glacier features require complete inventory metadata');
      if (p.value !== p.area_km2 || p.unit !== 'km2' || p.area_km2 <= 0) throw new Error('Glacier measurement must be positive source area');
      if (p.elevation_min_m > p.elevation_mean_m || p.elevation_mean_m > p.elevation_max_m) throw new Error('Glacier elevation statistics are inconsistent');
    }
    if (f.properties.entity_type === 'glacial_lake') {
      const p = f.properties;
      if (f.geometry.type !== 'Point' || !p.source_id || !p.search_terms?.length || !p.country || !p.basin || !p.connectivity || !p.data_source || !p.inventory_period || p.area_km2 === undefined || p.perimeter_km === undefined || p.centroid_longitude === undefined || p.centroid_latitude === undefined || p.elevation_min_m === undefined || p.elevation_mean_m === undefined || p.expansion_rate_km2_per_year === undefined || p.expansion_uncertainty_km2_per_year === undefined || p.expansion_significant === undefined) throw new Error('Glacial lake features require complete inventory metadata');
      if (p.value !== p.area_km2 || p.unit !== 'km2' || p.area_km2 <= 0 || p.perimeter_km <= 0) throw new Error('Glacial lake measurement must be positive mapped extent');
      if (p.elevation_min_m > p.elevation_mean_m + 1) throw new Error('Glacial lake elevation statistics are inconsistent');
      if (!p.search_terms.includes(p.source_id)) throw new Error('Glacial lake search terms must include GLO ID');
      if (p.expansion_rate_km2_per_year === null !== (p.expansion_uncertainty_km2_per_year === null)) throw new Error('Glacial lake expansion rate and uncertainty must be known together');
    }
    if (f.properties.entity_type === 'hydrology_station') {
      const p = f.properties;
      if (f.geometry.type !== 'Point' || !p.source_id || !p.search_terms?.length || !p.station_name || !p.station_series_id || !p.provider || !p.station_status || p.water_level_m === undefined || p.warning_level_m === undefined || p.danger_level_m === undefined || p.threshold_order_valid === undefined || p.observation_time === undefined || p.trend === undefined || p.elevation_m === undefined || p.coordinate_order_repaired === undefined) throw new Error('Hydrology stations require complete station metadata');
      if (p.value !== p.water_level_m || (p.water_level_m === null ? p.unit !== null : p.unit !== 'm')) throw new Error('Hydrology station measurement must be water level in metres');
      if (p.threshold_order_valid !== !(p.warning_level_m !== null && p.danger_level_m !== null && p.warning_level_m > p.danger_level_m)) throw new Error('Hydrology threshold consistency flag is incorrect');
    }
    if (f.properties.entity_type === 'rainfall_station') {
      const p = f.properties;
      if (f.geometry.type !== 'Point' || !p.source_id || !p.search_terms?.length || !p.station_name || !p.station_series_id || !p.provider || !p.station_status || p.observation_time === undefined || p.elevation_m === undefined || p.coordinate_order_repaired === undefined || p.rainfall_1h_mm === undefined || p.rainfall_3h_mm === undefined || p.rainfall_6h_mm === undefined || p.rainfall_12h_mm === undefined || p.rainfall_24h_mm === undefined || p.rainfall_quality_warning === undefined) throw new Error('Rainfall stations require complete station metadata');
      if (p.value !== p.rainfall_24h_mm || (p.rainfall_24h_mm === null ? p.unit !== null : p.unit !== 'mm')) throw new Error('Rainfall station measurement must be 24-hour rainfall in millimetres');
      for (const value of [p.rainfall_1h_mm, p.rainfall_3h_mm, p.rainfall_6h_mm, p.rainfall_12h_mm, p.rainfall_24h_mm]) if (value !== null && value < 0) throw new Error('Rainfall cannot be negative');
    }
    if (f.properties.entity_type === 'disaster_event') {
      const p = f.properties;
      if (f.geometry.type !== 'Point' || !p.source_id || !p.search_terms?.length || !p.hazard_id || !p.hazard_name || !p.hazard_type || !p.event_time || p.event_year === undefined || !p.event_local_date || p.verified === undefined || p.approved === undefined || p.reported_time === undefined || p.source_label === undefined || p.data_source_name === undefined || p.loss_reference_id === undefined || p.reported_deaths === undefined || p.reported_injured === undefined || p.reported_missing === undefined || p.reported_affected === undefined || p.estimated_loss_npr === undefined || p.street_address === undefined || p.event_description === undefined) throw new Error('Disaster events require complete archive metadata');
      if (p.value !== null || p.unit !== null) throw new Error('Disaster event point is not a measurement');
    }
    if (f.properties.entity_type === 'earthquake') {
      const p=f.properties;
      if(f.geometry.type!=='Point'||!p.source_id||!p.search_terms?.length||p.magnitude===undefined||p.depth_km===undefined||p.place_name===undefined||p.magnitude_type===undefined||!p.network||p.significance===undefined||!p.event_status||p.epicenter_only!==true||!p.event_time) throw new Error('Earthquakes require complete ComCat metadata');
      if(p.value!==null||p.unit!==null) throw new Error('Earthquake point is not a linear measurement');
    }
    if (f.properties.entity_type === 'flood_event') {
      const p = f.properties;
      if (f.geometry.type !== 'Point' || !p.source_id || !p.search_terms?.length || p.hazard_name !== 'Flood' || p.evidence_status !== 'reported' || p.hazard_footprint !== false || !p.flood_class || !p.event_time) throw new Error('Flood events require reported point semantics');
      if (p.value !== null || p.unit !== null) throw new Error('Reported flood point is not a measurement');
    }
    if (f.properties.entity_type === 'landslide_event') {
      const p = f.properties;
      if (f.geometry.type !== 'Point' || !p.source_id || !p.search_terms?.length || p.hazard_name !== 'Landslide' || p.evidence_status !== 'reported' || p.hazard_footprint !== false || !p.landslide_category || p.confidence === undefined || !p.confidence_basis || p.susceptibility_output !== false || !p.event_time) throw new Error('Landslide events require reported-event semantics');
      if (p.value !== null || p.unit !== null) throw new Error('Reported landslide point is not a measurement');
    }
    if (f.properties.entity_type === 'hydropower_facility') {
      const p = f.properties;
      if (f.geometry.type !== 'Point' || !p.source_id || !p.search_terms?.length || p.facility_name === undefined || !p.facility_status || !p.facility_type || p.capacity_mw === undefined || p.plant_method === undefined || p.operator_name === undefined || !p.osm_element_type || !p.osm_element_id || !p.osm_source_timestamp) throw new Error('Hydropower facilities require complete OSM metadata');
      if (p.value !== p.capacity_mw || (p.capacity_mw === null ? p.unit !== null : p.unit !== 'MW')) throw new Error('Hydropower measurement must be capacity in MW');
      if (p.capacity_mw !== null && p.capacity_mw < 0) throw new Error('Hydropower capacity cannot be negative');
    }
    if (f.properties.entity_type === 'infrastructure_asset') {
      const p = f.properties;
      if (!p.source_id || !p.search_terms?.length || !p.infrastructure_class || p.asset_name === undefined || !p.asset_subtype || !p.osm_element_type || !p.osm_element_id || !p.osm_source_timestamp || !p.position_basis || p.display_geometry_simplified === undefined) throw new Error('Infrastructure assets require complete OSM traceability metadata');
      if (p.infrastructure_class === 'road' ? !['LineString', 'MultiLineString'].includes(f.geometry.type) : f.geometry.type !== 'Point') throw new Error('Infrastructure geometry does not match its class');
      if (p.value !== null || p.unit !== null) throw new Error('Infrastructure inventory features are not measurements');
    }
    if (coordinates(f.geometry.coordinates).some(([lon, lat]) => lon < west || lon > east || lat < south || lat > north)) throw new Error('Geometry outside coverage');
    const rings = f.geometry.type === 'Polygon' ? f.geometry.coordinates : f.geometry.type === 'MultiPolygon' ? f.geometry.coordinates.flat() : [];
    if (rings.some(r => r[0][0] !== r.at(-1)![0] || r[0][1] !== r.at(-1)![1])) throw new Error('Unclosed polygon');
    if (f.geometry.type === 'LineString' && new Set(f.geometry.coordinates.map(p => p.join(','))).size < 2) throw new Error('Degenerate line');
  }
  return input;
}

export function isStale(metadata: Metadata, now = Date.now()): boolean {
  return metadata.stale_after !== null && now >= Date.parse(metadata.stale_after);
}
export function formatMeasurement(value: number | null, unit: Unit | null): string {
  return value === null ? 'UNKNOWN' : `${value.toLocaleString('en-US')}${unit ? ` ${unit}` : ''}`;
}

export { parseSatelliteManifest } from './satellite';
export { parseClimateManifest } from './climate';
export { buildEventPage, eventSourcePath, parseEventPage } from './event-page';
export { normalizeSearchTerm, parseSearchManifest, parseSearchShard, searchRecords } from './search';
export { compareEntities, formatCompareValue } from './compare';
export { compareInteractiveSimulations, controlsForLevel, runInteractiveSimulation, simulationAssumptions, validateSimulationControls } from './simulation-ui';
