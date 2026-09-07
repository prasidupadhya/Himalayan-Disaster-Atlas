import { parsePopulationIndex, parsePopulationManifest, type PopulationIndex, type PopulationManifest } from '../../../packages/contracts/population';
import { readBounded } from './datasets';

export const POPULATION_MANIFEST = '/data/nepal-population/1.0.0/manifest.json';
export interface PopulationDataset { manifest: PopulationManifest; index: PopulationIndex }

async function verified(path: string, expected: { byte_size: number; sha256: string }, limit: number, signal?: AbortSignal) {
  const bytes = await readBounded(await fetch(path, { signal }), limit);
  const hash = await crypto.subtle.digest('SHA-256', bytes);
  const digest = Array.from(new Uint8Array(hash), value => value.toString(16).padStart(2, '0')).join('');
  if (bytes.length !== expected.byte_size || digest !== expected.sha256) throw new Error('Population artifact checksum failed');
  return bytes;
}

export async function loadPopulation(signal?: AbortSignal): Promise<PopulationDataset> {
  const manifestBytes = await readBounded(await fetch(POPULATION_MANIFEST, { signal }), 65_536);
  const manifest = parsePopulationManifest(JSON.parse(new TextDecoder().decode(manifestBytes)));
  if (manifest.metadata.artifact.path.replace('tiles.json', 'manifest.json') !== POPULATION_MANIFEST) throw new Error('Population manifest identity mismatch');
  const indexBytes = await verified(manifest.metadata.artifact.path, manifest.metadata.artifact, 131_072, signal);
  return { manifest, index: parsePopulationIndex(JSON.parse(new TextDecoder().decode(indexBytes)), manifest) };
}

export async function loadPopulationTile(dataset: PopulationDataset, key: string, signal?: AbortSignal) {
  const expected = dataset.index[key];
  if (!expected) throw new Error('Population tile outside registered coverage');
  const base = dataset.manifest.metadata.artifact.path.replace('tiles.json', '');
  return (await verified(`${base}${key}`, expected, 262_144, signal)).buffer;
}
