import { parseHazardGraph } from '../../../packages/contracts/hazard-graph';
import manifest from '../public/data/nepal-hazard-graph/1.0.0/manifest.json';
import { readBounded } from './datasets';
export async function loadHazardGraph(signal?: AbortSignal) {
  const a = manifest.artifact;
  const bytes = await readBounded(await fetch(a.path, { signal }), 2_097_152);
  const hash = Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', bytes)), n => n.toString(16).padStart(2, '0')).join('');
  if (bytes.length !== a.byte_size || hash !== a.sha256) throw new Error('Hazard graph checksum mismatch');
  const decoded = await readBounded(new Response(new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'))), 16_777_216);
  if (decoded.length !== a.decoded_byte_size) throw new Error('Hazard graph decoded size mismatch');
  return parseHazardGraph(JSON.parse(new TextDecoder().decode(decoded)));
}
