import { loadTerrainTile, type TerrainDataset } from './terrain';

/** Display-only transition is entirely outside Nepal; inspector uses original GLO-90 bytes. */
export function detailWeight(lon: number, lat: number) {
  return Math.max(0, Math.min(1, lon - 78.75, 90 - lon, lat - 21.943045533438177, 31.952162238024968 - lat));
}

export function contextTile(key: string) {
  const match = /^(\d+)\/(\d+)\/(\d+)\.png$/.exec(key);
  if (!match) throw new Error('Invalid terrain display tile');
  const [z, x, y] = match.slice(1).map(Number);
  if (z < 1 || z > 9 || x < 2 ** (z - 1) || x >= 2 ** z || y >= 2 ** z) throw new Error('Terrain display tile outside context');
  const scale = 2 ** Math.max(0, z - 5);
  return { z, x, y, scale, key: `${Math.min(z, 5)}/${Math.floor(x / scale)}/${Math.floor(y / scale)}.png` };
}

async function pixels(buffer: ArrayBuffer) {
  const bitmap = await createImageBitmap(new Blob([buffer], { type: 'image/png' }), { colorSpaceConversion: 'none' });
  try {
    if (bitmap.width !== 256 || bitmap.height !== 256) throw new Error('Invalid terrain dimensions');
    const canvas = document.createElement('canvas'); canvas.width = canvas.height = 256;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) throw new Error('Terrain decoding unavailable');
    ctx.drawImage(bitmap, 0, 0);
    return ctx.getImageData(0, 0, 256, 256).data;
  } finally { bitmap.close(); }
}

function height(data: Uint8ClampedArray, x: number, y: number) {
  const index = (Math.max(0, Math.min(255, y)) * 256 + Math.max(0, Math.min(255, x))) * 4;
  return (data[index] * 65536 + data[index + 1] * 256 + data[index + 2]) * 0.1 - 10000;
}

export function createTerrainDisplay(nepal: TerrainDataset, context: TerrainDataset) {
  // Bounded decoded context cache; no cache of failed or pending requests.
  const cache = new Map<string, Uint8ClampedArray>();
  return async (key: string, signal: AbortSignal): Promise<ArrayBuffer> => {
    const tile = contextTile(key);
    const n = 2 ** tile.z;
    const lon = (x: number) => (tile.x + x / 256) / n * 360 - 180;
    const lat = (y: number) => Math.atan(Math.sinh(Math.PI * (1 - 2 * (tile.y + y / 256) / n))) * 180 / Math.PI;
    const detailed = Object.hasOwn(nepal.index, key);
    if (detailed && [detailWeight(lon(0), lat(0)), detailWeight(lon(256), lat(256))].every(w => w === 1)) return loadTerrainTile(nepal, key, signal);
    if (!detailed && tile.scale === 1) return loadTerrainTile(context, tile.key, signal);
    let overview = cache.get(tile.key);
    if (!overview) {
      overview = await pixels(await loadTerrainTile(context, tile.key, signal));
      if (cache.size >= 24) cache.delete(cache.keys().next().value!);
      cache.set(tile.key, overview);
    }
    const local = detailed ? await pixels(await loadTerrainTile(nepal, key, signal)) : null;
    signal.throwIfAborted();
    const output = new Uint8ClampedArray(256 * 256 * 4);
    for (let y = 0; y < 256; y++) for (let x = 0; x < 256; x++) {
      const px = ((tile.x % tile.scale) * 256 + x + 0.5) / tile.scale - 0.5;
      const py = ((tile.y % tile.scale) * 256 + y + 0.5) / tile.scale - 0.5;
      const ix = Math.floor(px), iy = Math.floor(py), dx = px - ix, dy = py - iy;
      const a = height(overview, ix, iy) * (1 - dx) + height(overview, ix + 1, iy) * dx;
      const b = height(overview, ix, iy + 1) * (1 - dx) + height(overview, ix + 1, iy + 1) * dx;
      const coarse = a * (1 - dy) + b * dy;
      const weight = local ? detailWeight(lon(x + 0.5), lat(y + 0.5)) : 0;
      const value = Math.round(((local ? height(local, x, y) : coarse) * weight + coarse * (1 - weight) + 10000) * 10);
      const i = (y * 256 + x) * 4;
      output[i] = value >> 16; output[i + 1] = (value >> 8) & 255; output[i + 2] = value & 255; output[i + 3] = 255;
    }
    const canvas = document.createElement('canvas'); canvas.width = canvas.height = 256;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Terrain encoding unavailable');
    ctx.putImageData(new ImageData(output, 256, 256), 0, 0);
    const blob = await new Promise<Blob>((resolve, reject) => canvas.toBlob(b => b ? resolve(b) : reject(new Error('Terrain encoding failed')), 'image/png'));
    signal.throwIfAborted();
    return blob.arrayBuffer();
  };
}
