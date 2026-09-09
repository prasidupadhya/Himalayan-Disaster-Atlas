import validateManifestGenerated from './generated/search.cjs';
import validateShardGenerated from './generated/search-shard.cjs';
import { validationErrors } from './validation-errors';
import { compiledValidator } from './validation-errors';

export type SearchEntityType = 'administrative_unit' | 'mountain' | 'river' | 'glacier' | 'glacial_lake' | 'hydropower' | 'infrastructure' | 'event';

export interface SearchRecord {
  key: string;
  type: SearchEntityType;
  dataset_id: string;
  dataset_version: string;
  feature_id: string;
  source_id: string;
  name: string;
  aliases: string[];
  normalized_name: string;
  normalized_aliases: string[];
  context: string;
  longitude: number;
  latitude: number;
  date: string | null;
  manifest_path: string;
  detail_href: string | null;
}

export interface SearchManifest {
  kind: 'search-index';
  schema_version: '1.0.0';
  version: '1.0.0';
  shards: Array<{ id: 'core' | 'infra-network' | 'infra-schools' | 'infra-services' | 'events-2015-2020' | 'events-2021-2024' | 'events-2025-2026' | 'earthquakes'; path: string; sha256: string; byte_size: number; decoded_byte_size: number; count: number }>;
  inputs: Array<{ path: string; sha256: string; byte_size: number }>;
  limitations: string[];
}

const validateManifest = compiledValidator<SearchManifest>(validateManifestGenerated);
const validateShard = compiledValidator<SearchRecord[]>(validateShardGenerated);

export function normalizeSearchTerm(value: string) {
  return value.normalize('NFKD').replace(/\p{M}/gu, '').toLocaleLowerCase('en-US').replace(/[^\p{L}\p{N}]+/gu, ' ').trim().replace(/\s+/g, ' ');
}

export function parseSearchManifest(input: unknown): SearchManifest {
  if (!validateManifest(input)) throw new Error(`Invalid search manifest: ${validationErrors(validateManifest.errors)}`);
  const manifest = input as SearchManifest;
  if (new Set(manifest.shards.map(item => item.id)).size !== 8) throw new Error('Search shard inventory is incomplete');
  if (new Set(manifest.inputs.map(item => item.path)).size !== manifest.inputs.length) throw new Error('Search inputs contain duplicates');
  return manifest;
}

export function parseSearchShard(input: unknown): SearchRecord[] {
  if (!validateShard(input)) throw new Error(`Invalid search shard: ${validationErrors(validateShard.errors)}`);
  const records = input as SearchRecord[];
  const keys = new Set<string>();
  for (const record of records) {
    if (keys.has(record.key)) throw new Error('Duplicate search entity key');
    keys.add(record.key);
    if (record.normalized_name !== normalizeSearchTerm(record.name)) throw new Error('Search canonical normalization mismatch');
    if (record.normalized_aliases.length !== record.aliases.length || record.normalized_aliases.some((value, index) => value !== normalizeSearchTerm(record.aliases[index]))) throw new Error('Search alias normalization mismatch');
  }
  return records;
}

const TYPE_TERMS: Record<SearchEntityType, string[]> = {
  administrative_unit: ['administrative', 'administrative unit', 'province', 'district', 'municipality', 'location'],
  mountain: ['mountain', 'mountains', 'peak', 'peaks'],
  river: ['river', 'rivers', 'river reach'],
  glacier: ['glacier', 'glaciers'],
  glacial_lake: ['lake', 'lakes', 'glacial lake', 'glacial lakes'],
  hydropower: ['hydropower', 'hydropower plant', 'power plant'],
  infrastructure: ['infrastructure', 'road', 'bridge', 'school', 'hospital', 'health', 'emergency', 'settlement'],
  event: ['event', 'events', 'disaster', 'earthquake', 'flood', 'landslide', 'avalanche'],
};

export function searchScore(record: SearchRecord, query: string): number | null {
  const needle = normalizeSearchTerm(query);
  if (needle.length < 2) return null;
  if (record.normalized_name === needle) return 0;
  if (record.normalized_aliases.includes(needle)) return 1;
  if (record.normalized_name.startsWith(needle)) return 2;
  if (record.normalized_aliases.some(alias => alias.startsWith(needle))) return 3;
  if (record.normalized_name.includes(needle)) return 4;
  if (record.normalized_aliases.some(alias => alias.includes(needle))) return 5;
  if (TYPE_TERMS[record.type].some(term => normalizeSearchTerm(term) === needle)) return 6;
  return null;
}

export function searchRecords(records: SearchRecord[], query: string, limit = 60) {
  return records
    .map(record => ({ record, score: searchScore(record, query) }))
    .filter((item): item is { record: SearchRecord; score: number } => item.score !== null)
    .sort((a, b) => a.score - b.score || a.record.name.localeCompare(b.record.name, 'en') || a.record.context.localeCompare(b.record.context, 'en') || a.record.key.localeCompare(b.record.key))
    .slice(0, limit)
    .map(item => item.record);
}

export function hasAmbiguousName(records: SearchRecord[], selected: SearchRecord) {
  return records.some(record => record.key !== selected.key && record.normalized_name === selected.normalized_name);
}
