import Ajv from 'ajv';
import schema from '../../schemas/hazard-graph.schema.json';
export type GraphNodeType = 'glacier' | 'lake' | 'river' | 'hazard' | 'infrastructure' | 'population_area' | 'event' | 'scenario' | 'exposure';
export type GraphEvidence = 'observed' | 'derived' | 'inferred' | 'modelled';
export type Relation = 'glacier_lake' | 'lake_river' | 'river_downstream' | 'hazard_exposure' | 'landslide_blockage' | 'scenario_exposure' | 'footprint_intersection';
export interface GraphNode { id: string; type: GraphNodeType; label: string; input: number; record_id: string; coordinates: [number, number] | null; boundary_next_id: string | null }
export interface GraphEdge { id: string; from: string; to: string; type: Relation; evidence: GraphEvidence; confidence: 'low' | 'medium' | 'high' | null; input: number; record_id: string; method: string; assumptions: string[]; limitations: string[] }
export interface HazardGraph { schema_version: '1.0.0'; kind: 'hazard-graph'; version: '1.0.0'; method: 'evidence-relationships/1.0.0'; nodes: GraphNode[]; edges: GraphEdge[]; inputs: { dataset_id: string; version: string; path: string; sha256: string; artifact_sha256: string; source: string; license: string; date: string | null }[]; limitations: string[] }
export const RELATIONS: Record<Relation, { from: GraphNodeType[]; to: GraphNodeType[]; meaning: string }> = {
  glacier_lake: { from: ['glacier'], to: ['lake'], meaning: 'Documented glacier–lake relationship; proximity alone is insufficient.' },
  lake_river: { from: ['lake'], to: ['river'], meaning: 'Documented lake outlet connection, not a nearest-river assignment.' },
  river_downstream: { from: ['river'], to: ['river'], meaning: 'Source NEXT_DOWN drainage pointer; not hazard propagation.' },
  hazard_exposure: { from: ['hazard'], to: ['exposure', 'population_area', 'infrastructure'], meaning: 'Evidence-backed footprint overlay; not damage or risk.' },
  landslide_blockage: { from: ['event', 'hazard'], to: ['river'], meaning: 'Documented blockage evidence or explicit model/inference; not proximity.' },
  scenario_exposure: { from: ['scenario'], to: ['exposure'], meaning: 'Exposure estimate conditional on a hypothetical corridor.' },
  footprint_intersection: { from: ['exposure'], to: ['infrastructure', 'population_area'], meaning: 'Mapped record intersects an assumed footprint; not confirmed impact.' },
};
const ajv = new Ajv({ allErrors: true, strict: true });
const validate = ajv.compile<HazardGraph>(schema);
export function parseHazardGraph(input: unknown): HazardGraph {
  if (!validate(input)) throw new Error(`Invalid hazard graph: ${ajv.errorsText(validate.errors)}`);
  const nodes = new Map(input.nodes.map(n => [n.id, n]));
  if (nodes.size !== input.nodes.length) throw new Error('Duplicate graph nodes');
  const ids = new Set<string>(), links = new Set<string>();
  for (const n of input.nodes) {
    if (!input.inputs[n.input] || (n.coordinates && !(n.coordinates[0] >= 79 && n.coordinates[0] <= 89 && n.coordinates[1] >= 25 && n.coordinates[1] <= 32))) throw new Error('Invalid node source or CRS84 position');
  }
  for (const e of input.edges) {
    const a = nodes.get(e.from), b = nodes.get(e.to), type = RELATIONS[e.type];
    const key = JSON.stringify([e.from, e.to, e.type]);
    if (!a || !b || a.id === b.id || ids.has(e.id) || links.has(key)) throw new Error('Missing node or duplicate/self edge');
    if (!type.from.includes(a.type) || !type.to.includes(b.type) || !input.inputs[e.input]) throw new Error('Invalid edge type or evidence source');
    if (['inferred', 'modelled'].includes(e.evidence) && !e.assumptions.length) throw new Error('Inference/model output requires explicit assumptions');
    if (e.type === 'river_downstream' && e.evidence !== 'derived') throw new Error('Source drainage topology is derived');
    if (['scenario_exposure', 'footprint_intersection'].includes(e.type) && e.evidence !== 'modelled') throw new Error('Hypothetical relationships must remain modelled');
    ids.add(e.id); links.add(key);
  }
  return input;
}
export function traverseGraph(graph: HazardGraph, start: string, limit = 50) {
  if (!Number.isInteger(limit) || limit < 1 || limit > 500 || !graph.nodes.some(n => n.id === start)) throw new Error('Invalid graph traversal request');
  const adjacency = new Map<string, GraphEdge[]>();
  for (const e of [...graph.edges].sort((a, b) => a.id < b.id ? -1 : a.id > b.id ? 1 : 0)) {
    const outgoing = adjacency.get(e.from);
    if (outgoing) outgoing.push(e); else adjacency.set(e.from, [e]);
  }
  const queue = [start], visited = new Set<string>(), edges = new Set<string>();
  let cursor = 0;
  while (cursor < queue.length && visited.size < limit) {
    const id = queue[cursor++]; if (visited.has(id)) continue;
    visited.add(id);
    for (const edge of adjacency.get(id) ?? []) { edges.add(edge.id); if (!visited.has(edge.to)) queue.push(edge.to); }
  }
  return { nodes: [...visited].sort(), edges: [...edges].sort(), truncated: queue.slice(cursor).some(id => !visited.has(id)) };
}
