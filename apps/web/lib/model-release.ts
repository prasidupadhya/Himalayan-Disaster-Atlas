import { parseModelRelease, type ModelRelease, type ModelReleaseType } from '../../../packages/contracts/model-release';
import { readBounded } from './datasets';

const MANIFEST_BYTES = 262_144;
const ARTIFACT_BYTES = 8_388_608;

export const MODEL_RELEASES = {
  population: { id: 'nepal-hrsl-population', version: '1.0.0', type: 'population-grid' },
  corridors: { id: 'atlas-flood-corridors', version: '1.0.0', type: 'corridor-catalogue' },
  gmpe: { id: 'atlas-gmpe-bssa14', version: '1.0.0', type: 'gmpe-model' },
  climate: { id: 'nepal-power-gridded-context', version: '1.0.0', type: 'climate-context' },
  terrain: { id: 'nepal-terrain-steepness', version: '1.0.0', type: 'terrain-context' },
  evidence: { id: 'atlas-public-evidence', version: '1.0.0', type: 'evidence-corpus' },
} as const satisfies Record<string, { id: string; version: string; type: ModelReleaseType }>;
export type ModelKey = keyof typeof MODEL_RELEASES;
export const manifestPath = (key: { id: string; version: string }) => `/data/${key.id}/${key.version}/manifest.json`;

async function sha256(bytes: Uint8Array<ArrayBuffer>) {
  return Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', bytes)), b => b.toString(16).padStart(2, '0')).join('');
}

async function gunzip(bytes: Uint8Array<ArrayBuffer>) {
  const reader = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip')).getReader();
  const parts: Uint8Array[] = []; let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read(); if (done) break;
      size += value.byteLength;
      if (size > 4 * ARTIFACT_BYTES) throw new Error('Artifact exceeds its decoded budget');
      parts.push(value);
    }
  } finally { await reader.cancel(); }
  const out = new Uint8Array(size); let offset = 0;
  for (const part of parts) { out.set(part, offset); offset += part.byteLength; }
  return out;
}

/** Loads a release manifest, validates its contract and identity; nothing renders before this passes. */
export async function loadModelRelease(expected: { id: string; version: string; type: ModelReleaseType }, signal?: AbortSignal): Promise<ModelRelease> {
  const bytes = await readBounded(await fetch(manifestPath(expected), { signal, redirect: 'error', credentials: 'omit' }), MANIFEST_BYTES);
  return parseModelRelease(JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes)), expected);
}

/** Fetches one artifact, verifies exact byte size and SHA-256 before decoding. */
export async function loadModelArtifact<T>(release: ModelRelease, name: string, signal?: AbortSignal): Promise<T> {
  const entry = release.artifacts[name];
  if (!entry) throw new Error(`Release has no artifact ${name}`);
  const bytes = await readBounded(await fetch(entry.path, { signal, redirect: 'error', credentials: 'omit' }), ARTIFACT_BYTES);
  if (bytes.byteLength !== entry.byte_size || await sha256(bytes) !== entry.sha256) throw new Error(`Checksum mismatch for ${name}; the artifact was not used`);
  const decoded = entry.media_type === 'application/json+gzip' ? await gunzip(bytes) : bytes;
  return JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(decoded)) as T;
}
