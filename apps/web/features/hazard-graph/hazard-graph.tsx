'use client';
import { useEffect, useMemo, useState } from 'react';
import type { Map } from 'maplibre-gl';
import { RELATIONS, traverseGraph, type HazardGraph as Graph } from '../../../../packages/contracts/hazard-graph';
import { DataState } from '../../components/data-state';
import { loadHazardGraph } from '../../lib/hazard-graph';
import { UnavailableError } from '../../lib/datasets';
import type { Resource } from '../../lib/resource';

export function HazardGraph({ map }: { map: Map | null }) {
  const [enabled, setEnabled] = useState(false), [attempt, setAttempt] = useState(0);
  const [resource, setResource] = useState<Resource<Graph>>({ status: 'loading' });
  const [query, setQuery] = useState('40669746'), [selected, setSelected] = useState('river:40669746');
  const graph = 'data' in resource ? resource.data : null;
  useEffect(() => {
    if (!enabled) return;
    const controller = new AbortController();
    void loadHazardGraph(controller.signal).then(data => { if (!controller.signal.aborted) setResource({ status: data.nodes.length ? 'ready' : 'empty', data }); }).catch(e => { if (!controller.signal.aborted) setResource({ status: e instanceof UnavailableError ? 'unavailable' : 'error', message: e instanceof Error ? e.message : 'Graph unavailable' }); });
    return () => controller.abort();
  }, [enabled, attempt]);
  const node = graph?.nodes.find(n => n.id === selected);
  const matches = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const rank = (n: Graph['nodes'][number]) => n.id.toLowerCase() === needle ? 0 : n.record_id.toLowerCase() === needle || n.id.split(':').at(-1)?.toLowerCase() === needle ? 1 : 2;
    return graph?.nodes.filter(n => `${n.id} ${n.record_id} ${n.label}`.toLowerCase().includes(needle)).sort((a, b) => rank(a) - rank(b) || a.id.localeCompare(b.id, 'en')).slice(0, 100) ?? [];
  }, [graph, query]);
  const traversal = useMemo(() => graph && node ? traverseGraph(graph, node.id, 30) : null, [graph, node]);
  const nearby = useMemo(() => graph?.nodes.filter(n => traversal?.nodes.includes(n.id)) ?? [], [graph, traversal]);
  const links = graph?.edges.filter(e => traversal?.edges.includes(e.id) && traversal.nodes.includes(e.to)) ?? [];
  const outgoing = graph?.edges.filter(e => e.from === selected) ?? [];
  useEffect(() => {
    if (!map || !enabled || !node?.coordinates) return;
    const id = 'hazard-graph-selection';
    map.addSource(id, { type: 'geojson', data: { type: 'Feature', geometry: { type: 'Point', coordinates: node.coordinates }, properties: {} } });
    map.addLayer({ id, source: id, type: 'circle', paint: { 'circle-radius': 12, 'circle-color': '#ffffff', 'circle-opacity': .2, 'circle-stroke-color': '#ffca68', 'circle-stroke-width': 3 } });
    return () => { if (map.getStyle()) { if (map.getLayer(id)) map.removeLayer(id); if (map.getSource(id)) map.removeSource(id); } };
  }, [map, enabled, node]);
  const position = (id: string) => { const i = nearby.findIndex(n => n.id === id); return [25 + (i % 3) * 100, 25 + Math.floor(i / 3) * 55]; };
  return <section className="thematic-controls" aria-label="Hazard Graph" data-hazard-graph-state={enabled ? resource.status : 'idle'}><h2>Hazard Graph</h2><p>Evidence-backed relationships · no automatic causal inference</p>
    <label><input type="checkbox" checked={enabled} onChange={e => setEnabled(e.target.checked)} /> Load relationship graph</label>
    {enabled && <><DataState state={resource} retry={() => { setResource({ status: 'loading' }); setAttempt(v => v + 1); }} />
      {graph && <><p>{graph.nodes.length.toLocaleString('en-US')} nodes · {graph.edges.length.toLocaleString('en-US')} relationships</p><label className="thematic-picker">Find graph node<input type="search" value={query} onChange={e => setQuery(e.target.value)} /></label>
        <label className="thematic-picker">Graph node<select value={selected} onChange={e => setSelected(e.target.value)}><option value="">Select a node…</option>{node && !matches.some(n => n.id === selected) && <option value={selected}>{node.label} · selected</option>}{matches.map(n => <option key={n.id} value={n.id}>{n.label} · {n.type}</option>)}</select></label>{matches.length === 0 && <p>No indexed node matches. Missing relationships remain UNKNOWN.</p>}
        {node && <><h3>{node.label}</h3><p>{node.type} · record {node.record_id}</p><button disabled={!map || !node.coordinates} onClick={() => { if (node.coordinates && map) { map.easeTo({ center: node.coordinates, zoom: Math.max(map.getZoom(), 9), duration: 0 }); document.getElementById('atlas-map')?.scrollIntoView(); } }}>Locate graph node on map</button>
          <p><a href={graph.inputs[node.input].path}>Source manifest</a> · {graph.inputs[node.input].dataset_id}@{graph.inputs[node.input].version} · source date {graph.inputs[node.input].date ?? 'UNKNOWN'}</p>
          {node.boundary_next_id && <p>Coverage exit: NEXT_DOWN {node.boundary_next_id} is outside this release. No continuation is inferred.</p>}
          <svg viewBox={`0 0 280 ${Math.max(80, Math.ceil(nearby.length / 3) * 55)}`} role="img" aria-label="Directed relationship neighbourhood; schematic, not geographic">
            <defs><marker id="graph-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10z" fill="currentColor" /></marker></defs>
            {links.map(e => { const a = position(e.from), b = position(e.to); const distance = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1; return <line key={e.id} x1={a[0]} y1={a[1]} x2={b[0] - (b[0] - a[0]) * 10 / distance} y2={b[1] - (b[1] - a[1]) * 10 / distance} stroke={e.evidence === 'modelled' || e.evidence === 'inferred' ? '#b16b1e' : '#28776e'} strokeDasharray={e.evidence === 'modelled' || e.evidence === 'inferred' ? '5 4' : undefined} markerEnd="url(#graph-arrow)"><title>{e.type} · {e.evidence.toUpperCase()}</title></line>; })}
            {nearby.map((n, i) => { const p = position(n.id); return <g key={n.id}><circle cx={p[0]} cy={p[1]} r="8" fill={n.id === selected ? '#b16b1e' : '#28776e'} /><text x={p[0]} y={p[1] + 22} textAnchor="middle" fontSize="10">{i + 1}</text><title>{n.label}</title></g>; })}
          </svg><p>Solid: DERIVED/OBSERVED, distinguished in edge details. Dashed: INFERRED/MODELLED. Diagram positions are schematic. Confidence stays UNKNOWN unless supplied.</p>
          {traversal?.truncated && <p>Neighbourhood limited to 30 nodes. Select another node to continue.</p>}
          <details><summary>Neighbourhood nodes</summary>{nearby.map((n, i) => <p key={n.id}><button onClick={() => setSelected(n.id)}>{i + 1}. {n.label}</button></p>)}</details>
          <h4>Outgoing relationships</h4>{outgoing.length === 0 && <p>No retained outgoing relationship. This is not a zero-hazard conclusion.</p>}{outgoing.slice(0, 30).map(e => <div className="selection" key={e.id} data-graph-evidence={e.evidence}><strong>{e.evidence.toUpperCase()}</strong><p>{RELATIONS[e.type].meaning}</p><button onClick={() => setSelected(e.to)}>{graph.nodes.find(n => n.id === e.to)?.label}</button><p>Confidence: {e.confidence?.toUpperCase() ?? 'UNKNOWN'} · {e.method}</p><p>Evidence record: {e.record_id} · <a href={graph.inputs[e.input].path}>versioned source</a></p>{e.assumptions.map(a => <p key={a}>Assumption: {a}</p>)}{e.limitations.map(a => <p key={a}>{a}</p>)}</div>)}{outgoing.length > 30 && <p>Showing 30 of {outgoing.length} outgoing edges; search target records individually.</p>}
        </>}
        <details><summary>Relationship meanings and coverage</summary>{Object.entries(RELATIONS).map(([k, v]) => <p key={k}><strong>{k}</strong>: {v.meaning}</p>)}{graph.limitations.map(l => <p key={l}>{l}</p>)}</details>
      </>}
    </>}
  </section>;
}
