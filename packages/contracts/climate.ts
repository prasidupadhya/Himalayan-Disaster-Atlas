import { lazyValidator } from './lazy-validator';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import schema from '../../schemas/climate.schema.json';
import type { Metadata } from './index';

export interface ClimateRecord {
  period: string;
  year: number;
  month: number;
  temperature_c: number;
  precipitation_mm_day: number;
  coverage_percent: number;
}

export interface ClimateNormal {
  month: number;
  temperature_c: number;
  precipitation_mm_day: number;
  temperature_min_c: number;
  temperature_max_c: number;
  precipitation_min_mm_day: number;
  precipitation_max_mm_day: number;
  years: 30;
}

export interface ClimateProduct {
  provider: 'NASA POWER';
  product_type: 'reanalysis-derived';
  source_model: 'MERRA-2';
  api_version: 'v2.9.8';
  time_standard: 'UTC';
  baseline: '1991-2020';
  native_grid: { latitude_degrees: 0.5; longitude_degrees: 0.625 };
  source_grid_points: 165;
  contributing_grid_cells: number;
  boundary_source: 'Nepal COD-AB v02 unsimplified admin0';
  boundary_sha256: '9f6713c41d65396f611ddce5879faecf8e2d494edbd1d6611612445ad46b6707';
  variables: Array<{ id: 'T2M' | 'PRECTOTCORR'; label: string; source_unit: 'C' | 'mm/day'; published_unit: 'degC' | 'mm/day' }>;
}

export interface ClimateManifest {
  metadata: Omit<Metadata, 'schema_version' | 'artifact'> & {
    schema_version: '4.0.0';
    artifact: { path: '/data/nepal-power-climate/1.0.0/series.json'; format: 'ClimateSeries'; sha256: string; byte_size: number };
  };
  product: ClimateProduct;
  series: ClimateRecord[];
  normals: ClimateNormal[];
}

const ajv = new Ajv({ allErrors: true, strict: true });
addFormats(ajv);
const validate = lazyValidator(() => ajv.compile<ClimateManifest>(schema));

export function parseClimateManifest(input: unknown): ClimateManifest {
  if (!validate(input)) throw new Error(`Invalid climate manifest: ${ajv.errorsText(validate.errors)}`);
  const manifest = input as ClimateManifest;
  if (Date.parse(manifest.metadata.processing_date) < Date.parse(manifest.metadata.retrieval_date)) throw new Error('Climate processing precedes retrieval');
  const periods = manifest.series.map(item => item.period);
  if (new Set(periods).size !== 360) throw new Error('Climate periods must be unique');
  if (manifest.normals.map(item => item.month).join(',') !== '1,2,3,4,5,6,7,8,9,10,11,12') throw new Error('Climate normal months are incomplete');
  if (manifest.series.some(item => item.coverage_percent < 99.99)) throw new Error('Climate release has incomplete Nepal coverage');
  if (new Set(manifest.product.variables.map(item => item.id)).size !== 2 || !['T2M', 'PRECTOTCORR'].every(id => manifest.product.variables.some(item => item.id === id))) throw new Error('Climate variable inventory mismatch');
  for (const normal of manifest.normals) {
    if (normal.temperature_min_c > normal.temperature_c || normal.temperature_c > normal.temperature_max_c) throw new Error('Climate temperature normal is outside annual range');
    if (normal.precipitation_min_mm_day > normal.precipitation_mm_day || normal.precipitation_mm_day > normal.precipitation_max_mm_day) throw new Error('Climate precipitation normal is outside annual range');
  }
  return manifest;
}
