import { parseTerrainIndex, parseTerrainManifest, terrainPixel, type TerrainIndex, type TerrainManifest } from '../../../packages/contracts/terrain';
import { readBounded } from './datasets';

export const TERRAIN_MANIFEST = '/data/nepal-terrain/1.0.0/manifest.json';
export const CONTEXT_MANIFEST = '/data/asia-terrain-context/1.0.0/manifest.json';
export interface TerrainDataset { manifest: TerrainManifest; index: TerrainIndex }

async function verified(path: string, expected: { byte_size: number; sha256: string }, signal?: AbortSignal) {
  const bytes = await readBounded(await fetch(path, { signal }), Math.min(expected.byte_size, 262144));
  const hash = await crypto.subtle.digest('SHA-256', bytes);
  if (bytes.length !== expected.byte_size || Array.from(new Uint8Array(hash), n => n.toString(16).padStart(2, '0')).join('') !== expected.sha256) throw new Error('Terrain checksum failed');
  return bytes;
}

export async function loadTerrain(signal?: AbortSignal, path = TERRAIN_MANIFEST): Promise<TerrainDataset> {
  if (![TERRAIN_MANIFEST, CONTEXT_MANIFEST].includes(path)) throw new Error('Unregistered terrain manifest');
  const bytes = await readBounded(await fetch(path, { signal }), 65536);
  const manifest = parseTerrainManifest(JSON.parse(new TextDecoder().decode(bytes)));
  if (manifest.metadata.artifact.path.replace('tiles.json', 'manifest.json') !== path) throw new Error('Terrain manifest identity mismatch');
  const indexBytes = await verified(manifest.metadata.artifact.path, manifest.metadata.artifact, signal);
  return { manifest, index: parseTerrainIndex(JSON.parse(new TextDecoder().decode(indexBytes)), manifest) };
}

export async function loadTerrainTile(dataset: TerrainDataset, key: string, signal?: AbortSignal) {
  if (!Object.hasOwn(dataset.index, key)) throw new Error('Terrain tile outside registered coverage');
  const bytes = await verified(dataset.manifest.metadata.artifact.path.replace('tiles.json', key), dataset.index[key], signal);
  return bytes.buffer;
}

/** Always samples zoom 9 independently of camera zoom and visual exaggeration. */
export async function sampleTerrain(dataset: TerrainDataset, longitude: number, latitude: number, signal?: AbortSignal) {
  const pixel = terrainPixel(longitude, latitude);
  if (!pixel) return null;
  const bytes = await loadTerrainTile(dataset, pixel.key, signal);
  const bitmap = await createImageBitmap(new Blob([bytes], { type: 'image/png' }), { colorSpaceConversion: 'none' });
  try {
    if (bitmap.width !== 256 || bitmap.height !== 256) throw new Error('Invalid terrain tile dimensions');
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 256;
    const context = canvas.getContext('2d', { willReadFrequently: true });
    if (!context) throw new Error('Elevation inspection unavailable');
    context.drawImage(bitmap, 0, 0);
    const [r, g, b, alpha] = context.getImageData(pixel.x, pixel.y, 1, 1).data;
    return alpha === 255 ? (r * 65536 + g * 256 + b) * 0.1 - 10000 : null;
  } finally { bitmap.close(); }
}
