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
  raster: { crs: 'EPSG:3857'; vertical_datum: string | null; unit: 'm'; tile_size: 256;
    minzoom: 1 | 5; maxzoom: 5 | 9; encoding: 'mapbox'; nodata: null; native_crs: 'EPSG:4326' | 'EPSG:3857';
    native_resolution_degree: number | null; resampling: 'bilinear' | 'none'; tile_count: 341 | 682 };
}
export type TerrainIndex = Record<string, { sha256: string; byte_size: number }>;
const ajv = new Ajv({ allErrors: true, strict: true });
addFormats(ajv);
ajv.addSchema(commonSchema);
const validate = ajv.compile<TerrainManifest>(schema);

export function parseTerrainManifest(input: unknown): TerrainManifest {
  if (!validate(input)) throw new Error(`Invalid terrain manifest: ${ajv.errorsText(validate.errors)}`);
  const m = input.metadata;
  if (!['nepal-terrain', 'asia-terrain-context'].includes(m.dataset_id) || m.artifact.path !== `/data/${m.dataset_id}/${m.dataset_version}/tiles.json`) throw new Error('Terrain identity mismatch');
  if (m.status !== 'ATLAS_DERIVED' || m.evidence_type !== 'derived' || m.is_fixture) throw new Error('Terrain evidence mismatch');
  if (Date.parse(m.processing_date) < Date.parse(m.retrieval_date)) throw new Error('Processing precedes retrieval');
  const context = m.dataset_id === 'asia-terrain-context';
  const expected = context ? [0, -85.0511287798066, 180, 85.0511287798066] : [78.75, 21.943045533438177, 90, 31.952162238024968];
  const r = input.raster;
  if (r.minzoom !== (context ? 1 : 5) || r.maxzoom !== (context ? 5 : 9) || r.tile_count !== (context ? 682 : 341) || r.vertical_datum !== (context ? null : 'EGM2008 (EPSG:3855)') || r.native_crs !== (context ? 'EPSG:3857' : 'EPSG:4326') || r.native_resolution_degree !== (context ? null : 1 / 1200) || r.resampling !== (context ? 'none' : 'bilinear')) throw new Error('Terrain grid metadata mismatch');
  if (m.spatial_coverage.bbox.some((v, i) => Math.abs(v - expected[i]) > 1e-9)) throw new Error('Terrain tile coverage mismatch');
  return input;
}

export function parseTerrainIndex(input: unknown, manifest: TerrainManifest): TerrainIndex {
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw new Error('Invalid terrain index');
  const entries = input as TerrainIndex;
  if (Object.keys(entries).length !== manifest.raster.tile_count) throw new Error('Incomplete terrain tile index');
  const context = manifest.metadata.dataset_id === 'asia-terrain-context';
  for (let z = manifest.raster.minzoom; z <= manifest.raster.maxzoom; z++) {
    const scale = 2 ** (z - 5);
    for (let x = context ? 2 ** (z - 1) : 23 * scale; x < (context ? 2 ** z : 24 * scale); x++) for (let y = context ? 0 : 13 * scale; y < (context ? 2 ** z : 14 * scale); y++) {
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
