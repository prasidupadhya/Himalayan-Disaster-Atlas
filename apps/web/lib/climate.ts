import { parseClimateManifest, type ClimateManifest } from '../../../packages/contracts/climate';
import { readBounded } from './datasets';

import { temporalCache } from './temporal-cache';
export const CLIMATE_MANIFEST = '/data/nepal-power-climate/1.0.0/manifest.json';

export interface ClimateDataset {
  manifest: ClimateManifest;
}

async function verified(path: string, expected: { byte_size: number; sha256: string }, limit: number, signal?: AbortSignal) {
  const key = `${path}#${expected.sha256}`;
  const cached = temporalCache.get(key);
  if (cached) return cached;
  const bytes = await readBounded(await fetch(path, { signal }), limit);
  const hash = await crypto.subtle.digest('SHA-256', bytes);
  const digest = Array.from(new Uint8Array(hash), value => value.toString(16).padStart(2, '0')).join('');
  if (bytes.length !== expected.byte_size || digest !== expected.sha256) throw new Error('Climate artifact checksum failed');
  if (!signal?.aborted) temporalCache.set(key, bytes);
  return bytes;
}

export async function loadClimate(signal?: AbortSignal): Promise<ClimateDataset> {
  const manifestBytes = await readBounded(await fetch(CLIMATE_MANIFEST, { signal }), 262_144);
  const manifest = parseClimateManifest(JSON.parse(new TextDecoder().decode(manifestBytes)));
  const seriesBytes = await verified(manifest.metadata.artifact.path, manifest.metadata.artifact, 262_144, signal);
  const payload = JSON.parse(new TextDecoder().decode(seriesBytes)) as Pick<ClimateManifest, 'product' | 'series' | 'normals'>;
  if (
    JSON.stringify(payload.product) !== JSON.stringify(manifest.product) ||
    JSON.stringify(payload.series) !== JSON.stringify(manifest.series) ||
    JSON.stringify(payload.normals) !== JSON.stringify(manifest.normals)
  ) throw new Error('Climate series index mismatch');
  return { manifest };
}
