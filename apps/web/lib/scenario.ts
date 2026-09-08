import type { FeatureCollection, LineString, MultiLineString } from 'geojson';
import { parseScenarioDefinition, parseScenarioResult } from '../../../packages/contracts/scenario';
import network from '../public/data/scenario-network-40669746/1.0.0/manifest.json';
import pulse from '../public/data/scenario-pulse-40669746/1.0.0/manifest.json';
import { readBounded } from './datasets';
export const SCENARIO_RELEASES = [network, pulse];
export type ScenarioSpatial = FeatureCollection<LineString | MultiLineString, { reach_id: string; evidence_type: 'modelled'; role: 'source_network_pathway_not_hazard_footprint' }>;
async function artifact(ref: { path: string; sha256: string; byte_size: number }, signal?: AbortSignal) {
  const bytes = await readBounded(await fetch(ref.path, { signal }), 2_097_152);
  const hash = Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', bytes)), v => v.toString(16).padStart(2, '0')).join('');
  if (bytes.byteLength !== ref.byte_size || hash !== ref.sha256) throw new Error('Scenario artifact checksum mismatch');
  const raw = ref.path.endsWith('.gz') ? await readBounded(new Response(new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'))), 8_388_608) : bytes;
  return JSON.parse(new TextDecoder().decode(raw));
}
function canonical(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(canonical).join(',')}]`;
  if (value !== null && typeof value === 'object') return `{${Object.entries(value).sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0).map(([k, v]) => `${JSON.stringify(k)}:${canonical(v)}`).join(',')}}`;
  return JSON.stringify(value);
}
export async function loadScenario(id: string, signal?: AbortSignal) {
  const manifest = SCENARIO_RELEASES.find(m => m.id === id);
  if (!manifest) throw new Error('Unregistered scenario');
  const [requestValue, resultValue, spatialValue] = await Promise.all([artifact(manifest.artifacts.request, signal), artifact(manifest.artifacts.result, signal), artifact(manifest.artifacts.spatial, signal)]);
  const request = parseScenarioDefinition(requestValue), result = parseScenarioResult(resultValue);
  if (request.id !== id || canonical(request) !== canonical(result.definition)) throw new Error('Scenario request/result mismatch');
  // The run fingerprint is the exact published definition bytes, avoiding cross-language float/Unicode serialization changes.
  if (manifest.artifacts.request.sha256 !== result.run_sha256) throw new Error('Scenario definition fingerprint mismatch');
  const spatial = spatialValue as ScenarioSpatial;
  if (spatial.type !== 'FeatureCollection' || !Array.isArray(spatial.features) || spatial.features.length !== result.path.length || spatial.features.some((f, i) => f.type !== 'Feature' || !['LineString', 'MultiLineString'].includes(f.geometry?.type) || f.properties?.reach_id !== result.path[i].reach_id || f.properties?.evidence_type !== 'modelled' || f.properties?.role !== 'source_network_pathway_not_hazard_footprint')) throw new Error('Scenario spatial pathway mismatch');
  return { manifest, result, spatial };
}
