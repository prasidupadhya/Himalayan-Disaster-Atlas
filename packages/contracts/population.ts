import { lazyValidator } from './lazy-validator';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import commonSchema from '../../schemas/dataset.schema.json';
import schema from '../../schemas/population.schema.json';
import type { Metadata } from './index';

export interface PopulationManifest {
  metadata: Omit<Metadata, 'schema_version' | 'artifact' | 'status' | 'evidence_type'> & {
    schema_version: '3.0.0'; status: 'MODELLED'; evidence_type: 'modelled';
    artifact: { path: '/data/nepal-population/1.0.0/tiles.json'; format: 'PopulationRGBA-index'; sha256: string; byte_size: number };
  };
  raster: { crs: 'EPSG:3857'; tile_size: 256; minzoom: 5; maxzoom: 10; encoding: 'RGBA-log-intensity';
    resampling: 'bilinear-display-only'; tile_count: number; display_semantics: string };
  analysis: { source_filename: string; source_sha256: string; crs: 'EPSG:4326'; width: 9773; height: 4921;
    resolution_degree: number; nodata: -99999; unit: 'people/source-grid-cell'; valid_cells: 5706074; zero_cells: 105654;
    population_sum: number; max_cell_value: number; display_reference_value: number };
}
export type PopulationIndex = Record<string, { sha256: string; byte_size: number }>;

const ajv = new Ajv({ allErrors: true, strict: true });
addFormats(ajv);
ajv.addSchema(commonSchema);
const validate = lazyValidator(() => ajv.compile<PopulationManifest>(schema));

function tileRange(bbox: [number, number, number, number], z: number) {
  const [west, south, east, north] = bbox;
  const n = 2 ** z;
  const x = (lon: number) => Math.floor((lon + 180) / 360 * n);
  const y = (lat: number) => Math.floor((1 - Math.asinh(Math.tan(lat * Math.PI / 180)) / Math.PI) / 2 * n);
  return { x0: x(west), x1: x(east), y0: y(north), y1: y(south) };
}

export function parsePopulationManifest(input: unknown): PopulationManifest {
  if (!validate(input)) throw new Error(`Invalid population manifest: ${ajv.errorsText(validate.errors)}`);
  const m = input.metadata;
  if (m.dataset_id !== 'nepal-population' || m.dataset_version !== '1.0.0') throw new Error('Population identity mismatch');
  if (Date.parse(m.processing_date) < Date.parse(m.retrieval_date)) throw new Error('Population processing precedes retrieval');
  if (m.observation_date !== '2025-01-01T00:00:00Z') throw new Error('Population year mismatch');
  const expected = [80.0583322931, 26.346666897279988, 88.20249892718999, 30.447500214209988];
  if (m.spatial_coverage.bbox.some((value, index) => Math.abs(value - expected[index]) > 1e-9)) throw new Error('Population bounds mismatch');
  return input;
}

export function parsePopulationIndex(input: unknown, manifest: PopulationManifest): PopulationIndex {
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw new Error('Invalid population tile index');
  const entries = input as PopulationIndex;
  const expected = new Set<string>();
  for (let z = manifest.raster.minzoom; z <= manifest.raster.maxzoom; z++) {
    const range = tileRange(manifest.metadata.spatial_coverage.bbox, z);
    for (let x = range.x0; x <= range.x1; x++) for (let y = range.y0; y <= range.y1; y++) expected.add(`${z}/${x}/${y}.png`);
  }
  if (Object.keys(entries).length !== expected.size || manifest.raster.tile_count !== expected.size) throw new Error('Incomplete population tile index');
  for (const key of expected) {
    const item = entries[key];
    if (!item || !/^[a-f0-9]{64}$/.test(item.sha256) || !Number.isInteger(item.byte_size) || item.byte_size < 1 || item.byte_size > 262144) throw new Error('Invalid population tile entry');
  }
  return entries;
}
