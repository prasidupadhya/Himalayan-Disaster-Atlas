import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import commonSchema from '../../schemas/dataset.schema.json';
import schema from '../../schemas/terrain.schema.json';
import type { Metadata } from './index';

export interface TerrainManifest {
  metadata: Omit<Metadata, 'schema_version' | 'artifact'> & {
    schema_version: '2.0.0';
    artifact: { path: string; format: 'TerrainRGB-index'; sha256: string; byte_size: number };
  };
  raster: { crs: 'EPSG:3857'; vertical_datum: string; unit: 'm'; tile_size: 256;
    minzoom: 5; maxzoom: 9; encoding: 'mapbox'; nodata: null; native_crs: 'EPSG:4326';
    native_resolution_degree: number; resampling: 'bilinear'; tile_count: 341 };
}
export type TerrainIndex = Record<string, { sha256: string; byte_size: number }>;
const ajv = new Ajv({ allErrors: true, strict: true });
addFormats(ajv);
ajv.addSchema(commonSchema);
const validate = ajv.compile<TerrainManifest>(schema);

export function parseTerrainManifest(input: unknown): TerrainManifest {
  if (!validate(input)) throw new Error(`Invalid terrain manifest: ${ajv.errorsText(validate.errors)}`);
  const m = input.metadata;
  if (m.dataset_id !== 'nepal-terrain' || m.artifact.path !== `/data/${m.dataset_id}/${m.dataset_version}/tiles.json`) throw new Error('Terrain identity mismatch');
  if (m.status !== 'ATLAS_DERIVED' || m.evidence_type !== 'derived' || m.is_fixture) throw new Error('Terrain evidence mismatch');
  if (Date.parse(m.processing_date) < Date.parse(m.retrieval_date)) throw new Error('Processing precedes retrieval');
  const expected = [78.75, 21.943045533438177, 90, 31.952162238024968];
  if (m.spatial_coverage.bbox.some((v, i) => Math.abs(v - expected[i]) > 1e-9)) throw new Error('Terrain tile coverage mismatch');
  return input;
}

export function parseTerrainIndex(input: unknown, manifest: TerrainManifest): TerrainIndex {
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw new Error('Invalid terrain index');
  const entries = input as TerrainIndex;
  if (Object.keys(entries).length !== manifest.raster.tile_count) throw new Error('Incomplete terrain tile index');
  for (let z = 5; z <= 9; z++) {
    const scale = 2 ** (z - 5);
    for (let x = 23 * scale; x < 24 * scale; x++) for (let y = 13 * scale; y < 14 * scale; y++) {
      const entry = entries[`${z}/${x}/${y}.png`];
      if (!entry || !/^[a-f0-9]{64}$/.test(entry.sha256) || !Number.isInteger(entry.byte_size) || entry.byte_size < 1 || entry.byte_size > 262144) throw new Error('Invalid terrain tile entry');
    }
  }
  return entries;
}

export function terrainPixel(longitude: number, latitude: number, z = 9) {
  if (!Number.isFinite(longitude) || !Number.isFinite(latitude) || longitude < 78.75 || longitude >= 90 || latitude <= 21.943045533438177 || latitude > 31.952162238024968) return null;
  const n = 2 ** z;
  const x = (longitude + 180) / 360 * n;
  const y = (1 - Math.asinh(Math.tan(latitude * Math.PI / 180)) / Math.PI) / 2 * n;
  return { key: `${z}/${Math.floor(x)}/${Math.floor(y)}.png`, x: Math.floor((x % 1) * 256), y: Math.floor((y % 1) * 256) };
}
