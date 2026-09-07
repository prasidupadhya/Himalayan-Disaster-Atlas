import { parseExposure, parseExposureSpatial, type ExposureResult, type ExposureSpatial } from '../../../packages/contracts/exposure';
import { readBounded } from './datasets';

export const EXPOSURE_MANIFESTS = [
  { label: 'Hypothetical trace corridor · 250 m each side', path: '/data/exposure-trace-40669746-250m/1.0.0/manifest.json' },
  { label: 'Hypothetical trace corridor · 1,000 m each side', path: '/data/exposure-trace-40669746-1000m/1.0.0/manifest.json' },
] as const;
export interface ExposureDataset { result: ExposureResult; spatial: ExposureSpatial }
export async function loadExposure(path: string, signal: AbortSignal): Promise<ExposureDataset> {
  if (!EXPOSURE_MANIFESTS.some(item => item.path === path)) throw new Error('Unregistered exposure result');
  const result = parseExposure(JSON.parse(new TextDecoder().decode(await readBounded(await fetch(path, { signal }), 2_097_152))));
  if (path !== `/data/${result.result_id}/${result.version}/manifest.json`) throw new Error('Exposure manifest identity mismatch');
  const artifact = result.artifacts.spatial;
  const bytes = await readBounded(await fetch(artifact.path, { signal }), 2_097_152);
  const hash = Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', bytes)), n => n.toString(16).padStart(2, '0')).join('');
  if (hash !== artifact.sha256 || bytes.length !== artifact.byte_size) throw new Error('Exposure spatial checksum/size mismatch');
  const decoded = await readBounded(new Response(new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'))), 8_388_608);
  return { result, spatial: parseExposureSpatial(JSON.parse(new TextDecoder().decode(decoded)), result) };
}
