import { lazyValidator } from './lazy-validator';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import schema from '../../schemas/exposure.schema.json';
import type { FeatureCollection, Geometry } from 'geojson';

export interface ExposurePopulation {
  known_population: number | null; total_population: number | null; valid_area_km2: number;
  unknown_area_km2: number; outside_grid_area_km2: number; intersected_valid_cells: number;
}
export interface ExposureResult {
  schema_version: '4.0.0'; kind: 'exposure-result'; result_id: string; version: string; name: string;
  calculated_at: string; method: 'exposure-overlay/1.0.0'; run_sha256: string; status: 'ESTIMATED'; evidence_type: 'derived';
  input_crs: 'OGC:CRS84'; area_crs: 'EPSG:6933'; footprint_kind: 'hypothetical_corridor' | 'modelled_scenario' | 'observed_footprint';
  footprint_area_km2: number; population: ExposurePopulation; population_resolution_degree: number; unique_assets: number;
  inputs: { dataset_id: string; dataset_version: string; sha256: string; source: string; license: string }[];
  categories: { category: string; count: number | null; coverage: 'mapped_inventory_only' | 'not_available' }[];
  assets: { id: string; name: string | null; categories: string[]; dataset_ids: string[]; admin_pcode: string | null; position_basis: string }[];
  administration: { pcode: string | null; name: string; area_km2: number; population: ExposurePopulation; unique_assets: number }[];
  limitations: string[];
  artifacts: Record<'request' | 'spatial', { path: string; sha256: string; byte_size: number }>;
}
export type ExposureSpatial = FeatureCollection<Geometry, { kind: 'asset' | 'footprint'; asset_id?: string; name?: string | null; categories?: string[] }>;
const ajv = new Ajv({ allErrors: true, strict: true });
addFormats(ajv);
const validate = lazyValidator(() => ajv.compile<ExposureResult>(schema));

export function parseExposure(input: unknown): ExposureResult {
  if (!validate(input)) throw new Error(`Invalid exposure result: ${ajv.errorsText(validate.errors)}`);
  if (!/^exposure-[a-z0-9-]+$/.test(input.result_id)) throw new Error('Invalid exposure identity');
  for (const [kind, artifact] of Object.entries(input.artifacts)) {
    const name = kind === 'request' ? 'request.json' : 'spatial.geojson.gz';
    if (artifact.path !== `/data/${input.result_id}/${input.version}/${name}`) throw new Error('Exposure artifact identity mismatch');
  }
  const ids = new Set(input.assets.map(asset => asset.id));
  if (ids.size !== input.assets.length || ids.size !== input.unique_assets) throw new Error('Duplicate/count mismatch in exposure assets');
  if (input.administration.reduce((sum, row) => sum + row.unique_assets, 0) !== input.unique_assets) throw new Error('Administrative exposure counts do not reconcile');
  for (const category of input.categories) {
    if (category.coverage === 'not_available' ? category.count !== null : category.count !== input.assets.filter(asset => asset.categories.includes(category.category)).length) throw new Error('Exposure category coverage/count mismatch');
  }
  for (const pop of [input.population, ...input.administration.map(row => row.population)]) {
    if (pop.unknown_area_km2 > 0 && pop.total_population !== null) throw new Error('Unknown population area cannot produce a complete total');
    if (pop.outside_grid_area_km2 > pop.unknown_area_km2 + 1e-6) throw new Error('Invalid population coverage');
  }
  return input;
}

export function parseExposureSpatial(value: unknown, result: ExposureResult): ExposureSpatial {
  const data = value as ExposureSpatial;
  if (data?.type !== 'FeatureCollection' || !Array.isArray(data.features) || data.features.length > 100000) throw new Error('Invalid exposure spatial collection');
  const ids = new Set(result.assets.map(asset => asset.id));
  const seen = new Set<string>();
  let footprints = 0;
  const coordinates = (value: unknown, depth = 0): void => {
    if (!Array.isArray(value) || value.length === 0 || depth > 5) throw new Error('Invalid result coordinates');
    if (typeof value[0] === 'number') {
      if (value.length !== 2 || !value.every(Number.isFinite) || value[0] < 79 || value[0] > 89 || value[1] < 25 || value[1] > 32) throw new Error('Exposure coordinates outside supported CRS84 bounds');
    } else for (const item of value) coordinates(item, depth + 1);
  };
  for (const f of data.features) {
    if (f.type !== 'Feature' || !f.properties || !f.geometry || f.geometry.type === 'GeometryCollection') throw new Error('Invalid exposure geometry');
    if (!['Point', 'MultiPoint', 'LineString', 'MultiLineString', 'Polygon', 'MultiPolygon'].includes(f.geometry.type)) throw new Error('Invalid exposure geometry type');
    coordinates(f.geometry.coordinates);
    if (f.properties.kind === 'footprint') { footprints++; if (!['Polygon', 'MultiPolygon'].includes(f.geometry.type)) throw new Error('Footprint must be polygonal'); }
    else if (f.properties.kind !== 'asset' || !f.properties.asset_id || !ids.has(f.properties.asset_id)) throw new Error('Unknown exposure asset');
    else seen.add(f.properties.asset_id);
  }
  if (footprints !== 1 || seen.size !== ids.size) throw new Error('Incomplete exposure spatial output');
  return data;
}
