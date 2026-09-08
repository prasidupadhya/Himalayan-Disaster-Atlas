import { parseEvidenceCorpus } from '../../../packages/contracts/rag';
import manifest from '../public/data/atlas-evidence/1.0.0/manifest.json';
import { readBounded } from './datasets';

export const EVIDENCE_MANIFEST = manifest;
async function sha256(bytes: Uint8Array<ArrayBuffer>) {
  return Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', bytes)), v => v.toString(16).padStart(2, '0')).join('');
}
export async function loadEvidence(signal?: AbortSignal) {
  const bytes = await readBounded(await fetch(manifest.artifact.path, { signal }), 524_288);
  if (bytes.byteLength !== manifest.artifact.byte_size || await sha256(bytes) !== manifest.artifact.sha256) throw new Error('Evidence corpus checksum mismatch');
  const decoded = await readBounded(new Response(new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'))), 2_097_152);
  const corpus = parseEvidenceCorpus(JSON.parse(new TextDecoder().decode(decoded)));
  if (corpus.version !== manifest.version) throw new Error('Evidence release version mismatch');
  for (const document of corpus.documents) {
    if (signal?.aborted) throw new DOMException('Aborted', 'AbortError');
    if (await sha256(new TextEncoder().encode(document.text)) !== document.version) throw new Error('Evidence document checksum mismatch');
  }
  return corpus;
}
