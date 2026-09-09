import { parseDataset, type Dataset } from '../../../packages/contracts';

export async function decodeDataset(metadata: unknown, bytes?: ArrayBuffer, compressed = false): Promise<Dataset> {
  if (!bytes) return parseDataset({ metadata, collection: { type: 'FeatureCollection', features: [] } });
  let decoded = new Uint8Array(bytes);
  if (compressed) {
    const reader = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip')).getReader();
    const parts: Uint8Array[] = []; let size = 0;
    try {
      while (true) {
        const { done, value } = await reader.read(); if (done) break;
        size += value.byteLength;
        if (size > 8_388_608) throw new Error('Dataset exceeds decoded budget');
        parts.push(value);
      }
    } finally { await reader.cancel(); }
    decoded = new Uint8Array(size); let offset = 0;
    for (const part of parts) { decoded.set(part, offset); offset += part.byteLength; }
  }
  if (decoded.byteLength > 8_388_608) throw new Error('Dataset exceeds decoded budget');
  return parseDataset({ metadata, collection: JSON.parse(new TextDecoder().decode(decoded)) });
}
