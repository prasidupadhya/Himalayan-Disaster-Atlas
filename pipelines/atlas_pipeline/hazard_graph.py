"""Publish source-linked drainage and conditional exposure relationships."""
import gzip
import hashlib
import json
import shutil

from jsonschema import Draft7Validator
from shapely.geometry import shape

from processing.hazard_graph.engine import validate_graph

from .contracts import ROOT
from .exposure import read_dataset
from .exposure_contracts import verify_exposure

BASE = '/data/nepal-hazard-graph/1.0.0/'


def encoded(value):
    return (json.dumps(value, sort_keys=True, separators=(',', ':'), allow_nan=False) + '\n').encode()


def digest(raw):
    return hashlib.sha256(raw).hexdigest()


def derive():
    inputs, nodes, edges, rivers = [], [], [], {}

    def reference(dataset, version, metadata, artifact_hash):
        raw = (ROOT / f'data/releases/{dataset}/{version}/manifest.json').read_bytes()
        inputs.append({'dataset_id': dataset, 'version': version, 'path': f'/data/{dataset}/{version}/manifest.json', 'sha256': digest(raw), 'artifact_sha256': artifact_hash,
                       'source': metadata.get('source', 'Atlas exposure overlay'), 'license': metadata.get('license', 'Underlying source licences retained in exposure manifest'), 'date': metadata.get('observation_date')})
        return len(inputs) - 1

    for dataset in ['nepal-rivers-primary', 'nepal-rivers-headwaters']:
        data = read_dataset(dataset)
        ref = reference(dataset, '1.0.0', data['metadata'], data['metadata']['artifact']['sha256'])
        for f in data['collection']['features']:
            p = f['properties']
            point = shape(f['geometry']).representative_point()
            node = {'id': 'river:' + p['source_id'], 'type': 'river', 'label': 'HYRIV ' + p['source_id'], 'input': ref, 'record_id': str(f['id']), 'coordinates': [point.x, point.y], 'boundary_next_id': p['downstream_id'] if not p['downstream_in_release'] else None}
            nodes.append(node)
            rivers[p['source_id']] = (node, p)
    for source, (node, p) in sorted(rivers.items()):
        target = p['downstream_id']
        if p['downstream_in_release'] != (target in rivers):
            raise ValueError('Inconsistent retained river topology')
        if target in rivers:
            edges.append({'id': f'next:{source}:{target}', 'from': node['id'], 'to': 'river:' + target, 'type': 'river_downstream', 'evidence': 'derived', 'confidence': None, 'input': node['input'], 'record_id': node['record_id'], 'method': 'HYRIV_ID/NEXT_DOWN source pointer', 'assumptions': [], 'limitations': ['Connectivity only; not measured flow, hazard propagation or travel time.']})
    for width in [250, 1000]:
        dataset = f'exposure-trace-40669746-{width}m'
        folder = ROOT / f'data/releases/{dataset}/1.0.0'
        result = verify_exposure(folder)
        ref = reference(dataset, '1.0.0', result, result['artifacts']['spatial']['sha256'])
        spatial = json.loads(gzip.decompress((folder / 'spatial.geojson.gz').read_bytes()))
        centre = shape(spatial['features'][0]['geometry']).representative_point()
        for prefix, type in [('scenario', 'scenario'), ('exposure', 'exposure')]:
            nodes.append({'id': prefix + ':' + dataset, 'type': type, 'label': f'Hypothetical {width} m corridor {prefix}', 'input': ref, 'record_id': 'request.json' if prefix == 'scenario' else result['result_id'], 'coordinates': [centre.x, centre.y], 'boundary_next_id': None})
        assumption = ['Conditioned on the recorded hypothetical corridor, not an observed hazard footprint.']
        edges.append({'id': 'scenario:' + dataset, 'from': 'scenario:' + dataset, 'to': 'exposure:' + dataset, 'type': 'scenario_exposure', 'evidence': 'modelled', 'confidence': None, 'input': ref, 'record_id': result['result_id'], 'method': result['method'], 'assumptions': assumption, 'limitations': ['Spatial exposure estimate, not vulnerability, damage or risk.']})
        positions = {f['properties']['asset_id']: shape(f['geometry']).representative_point() for f in spatial['features'] if f['properties']['kind'] == 'asset'}
        for asset in result['assets']:
            id = 'asset:' + dataset + ':' + asset['id']
            point = positions[asset['id']]
            nodes.append({'id': id, 'type': 'infrastructure', 'label': asset['name'] or asset['id'], 'input': ref, 'record_id': asset['id'], 'coordinates': [point.x, point.y], 'boundary_next_id': None})
            edges.append({'id': 'intersects:' + id, 'from': 'exposure:' + dataset, 'to': id, 'type': 'footprint_intersection', 'evidence': 'modelled', 'confidence': None, 'input': ref, 'record_id': asset['id'], 'method': result['method'], 'assumptions': assumption, 'limitations': ['Mapped asset intersects the assumed footprint; not confirmed impact.']})
    return validate_graph({'schema_version': '1.0.0', 'kind': 'hazard-graph', 'version': '1.0.0', 'method': 'evidence-relationships/1.0.0', 'inputs': inputs, 'nodes': sorted(nodes, key=lambda n: n['id']), 'edges': sorted(edges, key=lambda e: e['id']), 'limitations': ['No glacier-to-lake, lake outlet, hazard-to-exposure or landslide blockage links are asserted without supporting evidence.', 'Missing edges mean unknown relationships, not geographic absence. No causal or transitive hazard inference is performed.', 'Confidence is UNKNOWN where the sources provide no relationship accuracy. Asset nodes are scoped to their exposure result; matching OSM IDs do not create extra relationships.', 'Node coordinates are representative map positions, not proof of connectivity. River pointers leaving this release remain explicit coverage exits.']})


def verify_hazard_graph(path, public=None):
    manifest = json.loads((path / 'manifest.json').read_text())
    raw = (path / 'graph.json.gz').read_bytes()
    if len(raw) > 2_097_152 or manifest['artifact']['sha256'] != digest(raw) or manifest['artifact']['byte_size'] != len(raw):
        raise ValueError('Graph checksum/size mismatch')
    decoded = gzip.decompress(raw)
    if len(decoded) > 16_777_216 or len(decoded) != manifest['artifact']['decoded_byte_size']:
        raise ValueError('Graph decoded size mismatch')
    graph = json.loads(decoded)
    Draft7Validator(json.loads((ROOT / 'schemas/hazard-graph.schema.json').read_text())).validate(graph)
    validate_graph(graph)
    if graph != derive():
        raise ValueError('Graph differs from pinned source records')
    if public and any((path / name).read_bytes() != (public / name).read_bytes() for name in ['manifest.json', 'graph.json.gz']):
        raise ValueError('Public graph differs')
    return graph


def build():
    release, public = ROOT / ('data/releases' + BASE[5:]), ROOT / ('apps/web/public' + BASE)
    if release.exists():
        verify_hazard_graph(release, public)
        return
    graph = derive()
    decoded = encoded(graph)
    raw = gzip.compress(decoded, mtime=0)
    manifest = {'kind': 'hazard-graph-release', 'version': '1.0.0', 'artifact': {'path': BASE + 'graph.json.gz', 'sha256': digest(raw), 'byte_size': len(raw), 'decoded_byte_size': len(decoded)}}
    stage = ROOT / 'data/staging/hazard-graph'
    stage.mkdir(parents=True, exist_ok=True)
    (stage / 'graph.json.gz').write_bytes(raw)
    (stage / 'manifest.json').write_bytes(encoded(manifest))
    verify_hazard_graph(stage)
    release.parent.mkdir(parents=True, exist_ok=True)
    shutil.copytree(stage, release)
    shutil.copytree(stage, public)
    print(f"Published {len(graph['nodes'])} nodes and {len(graph['edges'])} edges")


if __name__ == '__main__':
    build()
