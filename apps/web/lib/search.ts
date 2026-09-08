import { parseSearchManifest, parseSearchShard, searchRecords, type SearchManifest, type SearchRecord } from '../../../packages/contracts/search';
import { readBounded } from './datasets';

export const SEARCH_MANIFEST = '/data/atlas-search-index/1.0.0/manifest.json';

async function digest(bytes: Uint8Array<ArrayBuffer>) {
  const hash = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(hash), value => value.toString(16).padStart(2, '0')).join('');
}

async function loadManifest(signal?: AbortSignal): Promise<SearchManifest> {
  const bytes = await readBounded(await fetch(SEARCH_MANIFEST, { signal }), 65_536);
  return parseSearchManifest(JSON.parse(new TextDecoder().decode(bytes)));
}

async function loadShard(shard: SearchManifest['shards'][number], signal?: AbortSignal) {
  const compressed = await readBounded(await fetch(shard.path, { signal }), 2_097_152);
  if (compressed.length !== shard.byte_size || await digest(compressed) !== shard.sha256) throw new Error(`Search shard checksum failed: ${shard.id}`);
  const decoded = await readBounded(new Response(new Blob([compressed]).stream().pipeThrough(new DecompressionStream('gzip'))), 16_777_216);
  if (decoded.length !== shard.decoded_byte_size) throw new Error(`Search shard decoded size failed: ${shard.id}`);
  const records = parseSearchShard(JSON.parse(new TextDecoder().decode(decoded)));
  if (records.length !== shard.count) throw new Error(`Search shard count failed: ${shard.id}`);
  return records;
}

export async function searchAtlas(query: string, signal?: AbortSignal): Promise<{ manifest: SearchManifest; results: SearchRecord[] }> {
  const manifest = await loadManifest(signal);
  const candidates: SearchRecord[] = [];
  for (const shard of manifest.shards) {
    const records = await loadShard(shard, signal);
    candidates.push(...searchRecords(records, query, 100));
  }
  return { manifest, results: searchRecords(candidates, query, 60) };
}
