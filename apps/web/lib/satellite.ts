import { parseSatelliteManifest, type SatelliteManifest, type SatelliteObservation } from '../../../packages/contracts/satellite';
import { readBounded } from './datasets';

import { temporalCache } from './temporal-cache';
export const SATELLITE_MANIFEST = '/data/nepal-sentinel-observations/1.0.0/manifest.json';
export interface SatelliteDataset { manifest: SatelliteManifest; observations: SatelliteObservation[] }
async function verified(path: string, expected: { byte_size: number; sha256: string }, limit: number, signal?: AbortSignal) {
  const key = `${path}#${expected.sha256}`;
  const cached = temporalCache.get(key);
  if (cached) return cached;
  const bytes = await readBounded(await fetch(path, { signal }), limit);
  const hash = await crypto.subtle.digest('SHA-256', bytes);
  const digest = Array.from(new Uint8Array(hash), value => value.toString(16).padStart(2, '0')).join('');
  if (bytes.length !== expected.byte_size || digest !== expected.sha256) throw new Error('Satellite artifact checksum failed');
  if (!signal?.aborted) temporalCache.set(key, bytes);
  return bytes;
}
export async function loadSatellite(signal?: AbortSignal): Promise<SatelliteDataset> {
  const manifestBytes = await readBounded(await fetch(SATELLITE_MANIFEST, { signal }), 65_536);
  const manifest = parseSatelliteManifest(JSON.parse(new TextDecoder().decode(manifestBytes)));
  const indexBytes = await verified(manifest.metadata.artifact.path, manifest.metadata.artifact, 65_536, signal);
  const observations = JSON.parse(new TextDecoder().decode(indexBytes)) as SatelliteObservation[];
  if (JSON.stringify(observations) !== JSON.stringify(manifest.observations)) throw new Error('Satellite observation index mismatch');
  return { manifest, observations };
}
export async function loadSatelliteImage(item: SatelliteObservation, signal?: AbortSignal) {
  return (await verified(item.image.path, item.image, 4_194_304, signal)).buffer;
}
