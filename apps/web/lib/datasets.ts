import { parseDataset, type Dataset } from '../../../packages/contracts';

export const SAMPLE_MANIFEST = '/data/foundation-sample/1.0.0/manifest.json';
export const ADMIN_MANIFESTS = [
  '/data/nepal-admin-country/2.0.1/manifest.json',
  '/data/nepal-admin-provinces/2.0.1/manifest.json',
  '/data/nepal-admin-districts/2.0.1/manifest.json',
  '/data/nepal-admin-local-levels/2.0.1/manifest.json',
] as const;
export const MOUNTAINS_MANIFEST = '/data/nepal-mountains/1.0.0/manifest.json';
export const RIVER_MANIFESTS = [
  '/data/nepal-rivers-primary/1.0.0/manifest.json',
  '/data/nepal-rivers-headwaters/1.0.0/manifest.json',
] as const;
export const GLACIER_MANIFESTS = [
  '/data/nepal-glaciers-west/1.0.0/manifest.json',
  '/data/nepal-glaciers-central/1.0.0/manifest.json',
  '/data/nepal-glaciers-east/1.0.0/manifest.json',
] as const;
export const GLACIAL_LAKES_MANIFEST = '/data/nepal-transboundary-glacial-lakes/1.0.0/manifest.json';
export const HYDROLOGY_MANIFEST = '/data/nepal-hydrology-stations/1.0.0/manifest.json';
export const MAX_GEOJSON_BYTES = 2_097_152;
export const MAX_DECODED_GEOJSON_BYTES = 8_388_608;
export class UnavailableError extends Error {}

export async function readBounded(response: Response, limit: number): Promise<Uint8Array<ArrayBuffer>> {
  if (!response.ok) {
    if (response.status === 404 || response.status === 503) throw new UnavailableError('This dataset is currently unavailable.');
    throw new Error(`Dataset request failed (${response.status}).`);
  }
  if (!response.body) throw new Error('Dataset response has no content.');
  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > limit) throw new Error('Dataset exceeds the small-GeoJSON budget. Use tiled delivery.');
      chunks.push(value);
    }
  } finally { await reader.cancel(); }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
  return bytes;
}

export async function loadDataset(manifestPath: string, signal?: AbortSignal): Promise<Dataset> {
  if (!/^\/data\/[a-z0-9-]+\/\d+\.\d+\.\d+\/manifest\.json$/.test(manifestPath)) throw new Error('Only versioned local manifests are supported.');
  const manifestBytes = await readBounded(await fetch(manifestPath, { signal }), 65_536);
  const metadata: unknown = JSON.parse(new TextDecoder().decode(manifestBytes));
  const validated = parseDataset({ metadata, collection: { type: 'FeatureCollection', features: [] } }).metadata;
  if (manifestPath !== validated.artifact.path.replace(/features\.geojson(?:\.gz)?$/, 'manifest.json')) throw new Error('Manifest identity mismatch.');
  const bytes = await readBounded(await fetch(validated.artifact.path, { signal }), MAX_GEOJSON_BYTES);
  if (bytes.length !== validated.artifact.byte_size) throw new Error('Dataset size does not match its manifest.');
  const hash = await crypto.subtle.digest('SHA-256', bytes);
  const digest = Array.from(new Uint8Array(hash), n => n.toString(16).padStart(2, '0')).join('');
  if (digest !== validated.artifact.sha256) throw new Error('Dataset checksum failed.');
  const decoded = validated.artifact.format === 'GeoJSON+gzip'
    ? await readBounded(new Response(new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'))), MAX_DECODED_GEOJSON_BYTES)
    : bytes;
  return parseDataset({ metadata: validated, collection: JSON.parse(new TextDecoder().decode(decoded)) });
}
