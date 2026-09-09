import { lazyValidator } from './lazy-validator';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import schema from '../../schemas/water-change.schema.json';
import type { Metadata } from './index';

export interface WaterArtifact { path: string; sha256: string; byte_size: number }
export interface WaterObservation {
  id: string; acquired_at: string; published_at: string | null; scene_id: string; platform: string;
  valid_fraction: number; water_km2: number;
  classification: WaterArtifact; quality: WaterArtifact; water: WaterArtifact; quality_preview: WaterArtifact; true_colour: WaterArtifact;
}
export interface WaterComparison {
  before: string; after: string; available: boolean; comparable_fraction: number; water_comparable_fraction: number | null; pixel_counts: Record<string, number>;
  gain_km2: number | null; loss_km2: number | null; persistence_km2: number | null; classification: WaterArtifact; preview: WaterArtifact;
}
export interface WaterManifest {
  metadata: Omit<Metadata, 'schema_version' | 'artifact'> & { schema_version: '4.0.0'; artifact: WaterArtifact };
  method: 'ndwi-scl-water/1.0.0'; grid: { crs: 'EPSG:32644'; transform: number[]; width: 505; height: 512 };
  coordinates: [[number, number], [number, number], [number, number], [number, number]]; observations: WaterObservation[]; comparisons: WaterComparison[];
}
const ajv = new Ajv({ allErrors: true, strict: true });
addFormats(ajv);
const validate = lazyValidator(() => ajv.compile<WaterManifest>(schema));
export function parseWaterManifest(input: unknown): WaterManifest {
  if (!validate(input)) throw new Error(`Invalid water manifest: ${ajv.errorsText(validate.errors)}`);
  const ids = input.observations.map(o => o.id);
  if (new Set(ids).size !== ids.length || ids.join() !== [...ids].sort().join() || input.observations.some(o => o.id !== o.acquired_at.slice(0, 10))) throw new Error('Duplicate or unordered water dates');
  const pairs = new Set<string>();
  for (const pair of input.comparisons) {
    const key = `${pair.before}/${pair.after}`;
    if (!ids.includes(pair.before) || !ids.includes(pair.after) || pair.before >= pair.after || pairs.has(key)) throw new Error('Invalid water comparison dates');
    pairs.add(key);
    const count = pair.pixel_counts;
    if (Object.values(count).reduce((a, b) => a + b, 0) !== 505 * 512 || Math.abs(pair.comparable_fraction - (1 - count['0'] / (505 * 512))) > 1e-12 || pair.available !== (pair.comparable_fraction >= .8 && pair.water_comparable_fraction !== null && pair.water_comparable_fraction >= .8)) throw new Error('Invalid comparable coverage');
    for (const [metric, code] of [['gain_km2', '3'], ['loss_km2', '4'], ['persistence_km2', '2']] as const) {
      if (pair[metric] !== (pair.available ? count[code] * .0004 : null)) throw new Error('Invalid water area/UNKNOWN semantics');
    }
  }
  return input;
}
