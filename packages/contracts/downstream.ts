import type { AtlasCollection, Dataset, FeatureProperties } from './index';

export const TRACE_METHOD = 'hydrorivers-next-down/1.0.0' as const;
export const RIVER_PARTITIONS = ['nepal-rivers-primary', 'nepal-rivers-headwaters'] as const;
export type RiverFeature = AtlasCollection['features'][number];
export interface RiverNetwork {
  reaches: ReadonlyMap<string, RiverFeature>;
  inputs: { dataset_id: string; dataset_version: string; artifact_sha256: string }[];
}
export interface DownstreamResult {
  method: typeof TRACE_METHOD;
  status: 'ATLAS_DERIVED';
  evidence_type: 'derived';
  crs: 'OGC:CRS84';
  start_reach_id: string;
  reach_ids: string[];
  total_length_km: number;
  termination: 'coverage_boundary' | 'source_outlet';
  next_reach_id: string | null;
  inputs: RiverNetwork['inputs'];
  limitations: string[];
}

/** Called only after the shared schema/checksum loader validates both partitions. */
export function buildRiverNetwork(datasets: Dataset[]): RiverNetwork {
  if (datasets.length !== RIVER_PARTITIONS.length || RIVER_PARTITIONS.some(id => datasets.filter(d => d.metadata.dataset_id === id && d.metadata.dataset_version === '1.0.0').length !== 1)) {
    throw new Error('Tracing requires both complete river partitions at version 1.0.0.');
  }
  const reaches = new Map<string, RiverFeature>();
  for (const dataset of datasets) {
    if (!dataset.collection.features.length) throw new Error('A river partition is empty; tracing is unavailable.');
    for (const feature of dataset.collection.features) {
      const p = feature.properties;
      if (p.entity_type !== 'river' || !p.source_id || !['LineString', 'MultiLineString'].includes(feature.geometry.type)
        || p.downstream_id === undefined || (p.downstream_id !== null && !/^[1-9]\d*$/.test(p.downstream_id))
        || typeof p.downstream_in_release !== 'boolean' || p.length_km === undefined || !Number.isFinite(p.length_km) || p.length_km < 0) {
        throw new Error('River topology or reach length is missing or invalid.');
      }
      if (reaches.has(p.source_id)) throw new Error(`Duplicate river ID: ${p.source_id}.`);
      reaches.set(p.source_id, feature);
    }
  }
  for (const feature of reaches.values()) {
    const p = feature.properties;
    if (p.downstream_in_release !== (p.downstream_id !== null && reaches.has(p.downstream_id!))) {
      throw new Error(`Broken downstream link at HYRIV ${p.source_id}; the release is incomplete or inconsistent.`);
    }
  }
  // Iterative O(V+E) cycle detection, including components unrelated to the selected start.
  const checked = new Set<string>();
  for (const start of reaches.keys()) {
    const visiting = new Set<string>();
    let id: string | null = start;
    while (id !== null && reaches.has(id) && !checked.has(id)) {
      if (visiting.has(id)) throw new Error(`Cycle in river topology at HYRIV ${id}.`);
      visiting.add(id);
      id = reaches.get(id)!.properties.downstream_id!;
    }
    for (const visited of visiting) checked.add(visited);
  }
  return { reaches, inputs: datasets.map(({ metadata: m }) => ({ dataset_id: m.dataset_id, dataset_version: m.dataset_version, artifact_sha256: m.artifact.sha256 })).sort((a, b) => a.dataset_id.localeCompare(b.dataset_id)) };
}

/** Traverse source pointers, never proximity, line direction, basin membership or terrain. */
export function traceDownstream(network: RiverNetwork, start: string): DownstreamResult {
  if (!network.reaches.has(start)) throw new Error('Select a river reach in the loaded network.');
  const seen = new Set<string>();
  let next: string | null = start;
  let length = 0;
  while (next !== null && network.reaches.has(next)) {
    if (seen.has(next)) throw new Error('Cycle encountered; no trace was produced.');
    seen.add(next);
    const p: FeatureProperties = network.reaches.get(next)!.properties;
    length += p.length_km!;
    next = p.downstream_id!;
  }
  return {
    method: TRACE_METHOD, status: 'ATLAS_DERIVED', evidence_type: 'derived', crs: 'OGC:CRS84',
    start_reach_id: start, reach_ids: [...seen], total_length_km: Math.round(length * 1000) / 1000,
    termination: next === null ? 'source_outlet' : 'coverage_boundary', next_reach_id: next,
    inputs: network.inputs,
    limitations: [
      'Network connectivity only; not inundation, a forecast, travel time, or confirmed exposure.',
      'Distance sums source LENGTH_KM for complete reaches, including the entire selected reach; it is not distance from the click location.',
      'Stops at the first NEXT_DOWN outside the Nepal-selected release; no continuation or reconnection is inferred.',
      'Source outlet means no downstream connection in the source, not necessarily an ocean mouth.',
      'Lake/glacier outlets, settlements, infrastructure and population relationships are UNKNOWN in this trace.',
      'Animation reveals reaches in network order; playback speed and coordinate order have no physical meaning.',
    ],
  };
}
