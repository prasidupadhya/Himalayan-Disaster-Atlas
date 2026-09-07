import { readFileSync } from 'node:fs';
import { gunzipSync } from 'node:zlib';
import { describe, expect, it, vi } from 'vitest';
import type { Map } from 'maplibre-gl';
import { mountDownstreamTrace } from '../../apps/web/lib/downstream-layer';
import { parseDataset, type Dataset } from '../../packages/contracts';
import { buildRiverNetwork, RIVER_PARTITIONS, traceDownstream } from '../../packages/contracts/downstream';

const releases = RIVER_PARTITIONS.map(id => parseDataset({
  metadata: JSON.parse(readFileSync(`data/releases/${id}/1.0.0/manifest.json`, 'utf8')),
  collection: JSON.parse(gunzipSync(readFileSync(`data/releases/${id}/1.0.0/features.geojson.gz`)).toString()),
}));

// Tiny explicitly synthetic graph: a tributary confluence crosses the delivery partition.
function fixture(): Dataset[] {
  const datasets = structuredClone(releases);
  const template = datasets[0].collection.features[0];
  const reach = (id: string, next: string | null, length: number) => ({ ...template, id: `fixture-${id}`, properties: {
    ...template.properties, source_id: id, downstream_id: next, downstream_in_release: next !== null && next !== '99', length_km: length, is_fixture: true,
  } });
  datasets[0].collection.features = [reach('1', '3', 1.2), reach('2', '3', 9)];
  datasets[1].collection.features = [reach('3', '4', 2.3), reach('4', '99', 0)];
  return datasets;
}

describe('downstream topology', () => {
  it('crosses partitions, excludes upstream tributaries and stops at the coverage boundary', () => {
    const result = traceDownstream(buildRiverNetwork(fixture()), '1');
    expect(result.reach_ids).toEqual(['1', '3', '4']);
    expect(result.total_length_km).toBe(3.5);
    expect(result.termination).toBe('coverage_boundary');
    expect(result.next_reach_id).toBe('99');
    expect(result.inputs).toHaveLength(2);
    expect(result.status).toBe('ATLAS_DERIVED');
  });
  it('distinguishes a source outlet from missing coverage and supports a single zero-length reach', () => {
    const data = fixture(); data[1].collection.features[1].properties.downstream_id = null;
    const result = traceDownstream(buildRiverNetwork(data), '4');
    expect(result.reach_ids).toEqual(['4']); expect(result.total_length_km).toBe(0);
    expect(result.termination).toBe('source_outlet'); expect(result.next_reach_id).toBeNull();
  });
  it('requires both partitions and rejects missing targets advertised as internal', () => {
    expect(() => buildRiverNetwork(fixture().slice(0, 1))).toThrow(/both complete/);
    const data = fixture(); data[1].collection.features.pop();
    expect(() => buildRiverNetwork(data)).toThrow(/Broken downstream/);
  });
  it('rejects duplicate IDs, including duplicates across partitions', () => {
    const data = fixture(); data[1].collection.features.push(data[0].collection.features[0]);
    expect(() => buildRiverNetwork(data)).toThrow(/Duplicate/);
  });
  it.each(['1', '4'])('rejects cycles and self-links (%s)', id => {
    const data = fixture(); Object.assign(data[1].collection.features[1].properties, { downstream_id: id, downstream_in_release: true });
    expect(() => buildRiverNetwork(data)).toThrow(/Cycle/);
  });
  it.each([undefined, NaN, -1, Infinity])('does not turn an invalid length (%s) into zero', length => {
    const data = fixture(); data[0].collection.features[0].properties.length_km = length;
    expect(() => buildRiverNetwork(data)).toThrow(/length/);
  });
  it('rejects undefined topology instead of treating it as an outlet', () => {
    const data = fixture(); delete data[1].collection.features[1].properties.downstream_id;
    expect(() => buildRiverNetwork(data)).toThrow(/topology/);
  });
  it('never snaps an unknown start onto a nearby reach', () => {
    expect(() => traceDownstream(buildRiverNetwork(fixture()), '999')).toThrow(/Select a river/);
  });
  it('validates the whole published graph and reproduces a known cross-partition path', () => {
    const network = buildRiverNetwork(releases);
    expect(network.reaches.size).toBe(18299);
    const result = traceDownstream(network, '40669746');
    expect(result.reach_ids).toHaveLength(180);
    expect(result.reach_ids.slice(0, 2)).toEqual(['40669746', '40670088']);
    expect(result.next_reach_id).toBe('40768704');
    const start = [...network.reaches].find(([, f]) => f.properties.dataset_id.endsWith('headwaters') && network.reaches.get(f.properties.downstream_id!)?.properties.dataset_id.endsWith('primary'))!;
    const crossing = traceDownstream(network, start[0]);
    expect(crossing.reach_ids[1]).toBe(start[1].properties.downstream_id);
    const again = traceDownstream(buildRiverNetwork([...releases].reverse()), '40669746');
    expect(again).toEqual(result);
  });
});

it('reveals only ordered source reaches and removes the derived layers before their source', () => {
  const sources = new Set<string>(), layers = new Set<string>();
  const removed: string[] = [];
  const map = {
    on: vi.fn(), off: vi.fn(), addSource: vi.fn((id: string) => sources.add(id)),
    addLayer: ({ id }: { id: string }) => layers.add(id), getLayer: (id: string) => layers.has(id),
    getSource: (id: string) => sources.has(id), setFilter: vi.fn(),
    removeLayer: (id: string) => { layers.delete(id); removed.push(id); },
    removeSource: (id: string) => { expect(layers.size).toBe(0); sources.delete(id); removed.push('source'); },
  };
  const network = buildRiverNetwork(fixture());
  const result = traceDownstream(network, '1');
  const handle = mountDownstreamTrace(map as unknown as Map, network, result);
  handle.show(2);
  expect(map.setFilter).toHaveBeenCalledWith('downstream-trace@1.0.0-line', ['<', ['get', 'order'], 2]);
  handle.dispose(); handle.dispose();
  expect(removed.at(-1)).toBe('source'); expect(sources.size).toBe(0);
});
