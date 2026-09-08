import { validateTemporalIndex } from '../../../packages/contracts/temporal';
import { readBounded } from './datasets';
import { temporalCache } from './temporal-cache';
import release from '../public/data/atlas-time-index/1.0.0/manifest.json';
export async function loadTimeIndex(signal?: AbortSignal) {
  const { artifact } = release;
  const key = `${artifact.path}#${artifact.sha256}`;
  let bytes = temporalCache.get(key);
  if (!bytes) {
    bytes = await readBounded(await fetch(artifact.path, { signal }), 2_097_152);
    const hash = await crypto.subtle.digest('SHA-256', bytes);
    if (bytes.byteLength !== artifact.byte_size || Array.from(new Uint8Array(hash), v => v.toString(16).padStart(2, '0')).join('') !== artifact.sha256) throw new Error('Temporal index checksum failed');
  }
  const index = validateTemporalIndex(JSON.parse(new TextDecoder().decode(bytes)));
  if (!signal?.aborted) temporalCache.set(key, bytes);
  return index;
}
