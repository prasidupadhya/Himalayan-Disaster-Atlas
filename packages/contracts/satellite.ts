import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import schema from '../../schemas/satellite.schema.json';
import type { Metadata } from './index';

export interface SatelliteObservation {
  id: 'west' | 'central' | 'east'; label: string; scene_id: string; acquired_at: string;
  cloud_percent: number; nodata_percent: number; snow_ice_percent: number; source_crs: string; source_resolution_m: 10;
  source_asset: string; source_scl: string; source_etag: string; source_byte_size: number;
  image: { path: string; sha256: string; byte_size: number; width: 768; height: 768 };
  coordinates: [[number, number], [number, number], [number, number], [number, number]];
}
export interface SatelliteManifest {
  metadata: Omit<Metadata, 'schema_version' | 'artifact' | 'status' | 'evidence_type'> & {
    schema_version: '4.0.0'; status: 'SATELLITE_DERIVED'; evidence_type: 'derived';
    artifact: { path: '/data/nepal-sentinel-observations/1.0.0/observations.json'; format: 'SatelliteObservation-index'; sha256: string; byte_size: number };
  };
  observations: SatelliteObservation[];
}
const ajv = new Ajv({ allErrors: true, strict: true }); addFormats(ajv);
const validate = ajv.compile<SatelliteManifest>(schema);
export function parseSatelliteManifest(input: unknown): SatelliteManifest {
  if (!validate(input)) throw new Error(`Invalid satellite manifest: ${ajv.errorsText(validate.errors)}`);
  const manifest = input as SatelliteManifest;
  if (Date.parse(manifest.metadata.processing_date) < Date.parse(manifest.metadata.retrieval_date)) throw new Error('Satellite processing precedes retrieval');
  const ids = manifest.observations.map(item => item.id);
  if (new Set(ids).size !== 3 || !['west', 'central', 'east'].every(id => ids.includes(id as SatelliteObservation['id']))) throw new Error('Satellite observation inventory mismatch');
  for (const item of manifest.observations) {
    if (item.nodata_percent !== 0) throw new Error('Published satellite preview must not contain source NoData');
    if (item.cloud_percent > 5) throw new Error('Published satellite preview exceeds cloud-selection rule');
  }
  return manifest;
}
