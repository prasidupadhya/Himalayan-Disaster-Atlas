"""Evidence semantics and bounded deterministic graph traversal."""
RELATIONS = {
    'glacier_lake': ({'glacier'}, {'lake'}),
    'lake_river': ({'lake'}, {'river'}),
    'river_downstream': ({'river'}, {'river'}),
    'hazard_exposure': ({'hazard'}, {'exposure', 'population_area', 'infrastructure'}),
    'landslide_blockage': ({'event', 'hazard'}, {'river'}),
    'scenario_exposure': ({'scenario'}, {'exposure'}),
    'footprint_intersection': ({'exposure'}, {'infrastructure', 'population_area'}),
}


def validate_graph(graph):
    nodes = {n['id']: n for n in graph['nodes']}
    if len(nodes) != len(graph['nodes']):
        raise ValueError('Duplicate graph node')
    seen, ids = set(), set()
    for node in nodes.values():
        if node['input'] >= len(graph['inputs']) or node['input'] < 0:
            raise ValueError('Missing node provenance')
        xy = node['coordinates']
        if xy is not None and not (79 <= xy[0] <= 89 and 25 <= xy[1] <= 32):
            raise ValueError('Invalid CRS84 graph position')
    for edge in graph['edges']:
        a, b = nodes.get(edge['from']), nodes.get(edge['to'])
        key = (edge['from'], edge['to'], edge['type'])
        if not a or not b or edge['id'] in ids or key in seen or a == b:
            raise ValueError('Missing node, duplicate edge or self-edge')
        source, target = RELATIONS[edge['type']]
        if a['type'] not in source or b['type'] not in target or not 0 <= edge['input'] < len(graph['inputs']):
            raise ValueError('Invalid relationship types/provenance')
        if edge['evidence'] in {'inferred', 'modelled'} and not edge['assumptions']:
            raise ValueError('Inference/model output requires assumptions')
        if edge['type'] == 'river_downstream' and edge['evidence'] != 'derived':
            raise ValueError('Source drainage topology is derived, not a field observation')
        if edge['type'] in {'scenario_exposure', 'footprint_intersection'} and edge['evidence'] != 'modelled':
            raise ValueError('Hypothetical footprint links must remain modelled')
        seen.add(key)
        ids.add(edge['id'])
    return graph


def traverse(graph, start, limit=50):
    if not isinstance(limit, int) or not 1 <= limit <= 500 or start not in {n['id'] for n in graph['nodes']}:
        raise ValueError('Invalid graph traversal request')
    adjacency = {}
    for edge in sorted(graph['edges'], key=lambda e: e['id']):
        adjacency.setdefault(edge['from'], []).append(edge)
    queue, visited, edges = [start], set(), []
    while queue and len(visited) < limit:
        node = queue.pop(0)
        if node in visited:
            continue
        visited.add(node)
        for edge in adjacency.get(node, []):
            edges.append(edge['id'])
            if edge['to'] not in visited:
                queue.append(edge['to'])
    return {'nodes': sorted(visited), 'edges': sorted(set(edges)), 'truncated': bool(set(queue) - visited)}
