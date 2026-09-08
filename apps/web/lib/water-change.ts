import { parseWaterManifest, type WaterArtifact } from '../../../packages/contracts/water-change';
import { readBounded } from './datasets';
export const WATER_MANIFEST = '/data/phewa-water-change/1.0.0/manifest.json';
export async function loadWaterArtifact(ref: WaterArtifact, signal?: AbortSignal) {
  const bytes = await readBounded(await fetch(ref.path, { signal }), 4_194_304);
  const hash = await crypto.subtle.digest('SHA-256', bytes);
  if (bytes.length !== ref.byte_size || Array.from(new Uint8Array(hash), v => v.toString(16).padStart(2, '0')).join('') !== ref.sha256) throw new Error('Water artifact checksum failed');
  return bytes;
}
export async function loadWaterChange(signal?: AbortSignal) {
  const bytes = await readBounded(await fetch(WATER_MANIFEST, { signal }), 262_144);
  const manifest = parseWaterManifest(JSON.parse(new TextDecoder().decode(bytes)));
  const index = JSON.parse(new TextDecoder().decode(await loadWaterArtifact(manifest.metadata.artifact, signal)));
  if (JSON.stringify(index.observations) !== JSON.stringify(manifest.observations) || JSON.stringify(index.comparisons) !== JSON.stringify(manifest.comparisons)) throw new Error('Water index mismatch');
  return manifest;
}
