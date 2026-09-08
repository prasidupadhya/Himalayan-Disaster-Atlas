import { readFileSync } from 'node:fs';
import { gunzipSync } from 'node:zlib';
import { describe, expect, it } from 'vitest';
import { parseHazardGraph, traverseGraph } from '../../packages/contracts/hazard-graph';
const graph = parseHazardGraph(JSON.parse(gunzipSync(readFileSync('data/releases/nepal-hazard-graph/1.0.0/graph.json.gz')).toString()));
describe('evidence graph', () => {
  it('preserves source identities, conditional assumptions and UNKNOWN confidence', () => {
    expect(graph.nodes).toHaveLength(18811); expect(graph.edges).toHaveLength(18620);
    expect(graph.edges.every(e => e.confidence === null)).toBe(true);
    expect(graph.edges.filter(e => e.evidence === 'modelled').every(e => e.assumptions.length > 0)).toBe(true);
    expect(traverseGraph(graph, 'river:40669746', 30).truncated).toBe(true);
  });
  it('rejects absent nodes, duplicate edges and misleading evidence', () => {
    for (const kind of ['missing', 'duplicate', 'evidence', 'assumptions']) {
      const bad = structuredClone(graph);
      if (kind === 'missing') bad.edges[0].to = 'absent';
      if (kind === 'duplicate') bad.edges.push(bad.edges[0]);
      if (kind === 'evidence') bad.edges.find(e => e.type === 'river_downstream')!.evidence = 'observed';
      if (kind === 'assumptions') bad.edges.find(e => e.evidence === 'modelled')!.assumptions = [];
      expect(() => parseHazardGraph(bad)).toThrow();
    }
  });
  it('terminates cycles deterministically without inferring transitive causality', () => {
    const nodes = graph.nodes.filter(n => n.type === 'river').slice(0, 3);
    const edges = nodes.map((n, i) => ({ ...graph.edges.find(e => e.type === 'river_downstream')!, id: `test-${i}`, from: n.id, to: nodes[(i + 1) % 3].id }));
    const cyclic = parseHazardGraph({ ...graph, nodes, edges });
    expect(traverseGraph(cyclic, nodes[0].id).nodes).toHaveLength(3);
    expect(traverseGraph(cyclic, nodes[0].id).truncated).toBe(false);
    expect(traverseGraph(cyclic, nodes[0].id, 2).truncated).toBe(true);
  });
});
