"""Offline scenario execution and immutable static publication."""
import argparse
import gzip
import json
import shutil
from datetime import datetime, timezone
from pathlib import Path

from processing.scenario.engine import (
    MODEL_ASSUMPTIONS,
    RESULT,
    ScenarioError,
    encoded,
    reference,
    run_scenario,
)

from .contracts import ROOT
from .exposure import read_dataset
from .hazard_graph import digest


def inputs():
    return [read_dataset(id) for id in ['nepal-rivers-headwaters', 'nepal-rivers-primary']]


def definitions(datasets):
    refs = sorted([reference(d['metadata']) for d in datasets], key=lambda i: i['dataset_id'])
    for model, level in [('network-path', 1), ('constant-celerity-pulse', 2)]:
        yield {'schema_version': '1.0.0', 'kind': 'scenario-definition', 'id': 'scenario-' + ('network' if level == 1 else 'pulse') + '-40669746', 'version': '1.0.0', 'is_fixture': False,
               'model': {'id': model, 'version': '1.0.0'}, 'simulation_level': level, 'source_reach_id': '40669746', 'inputs': refs, 'assumptions': MODEL_ASSUMPTIONS[model],
               'parameters': {} if level == 1 else {'celerity': {'value': 2, 'unit': 'm/s'}, 'release_volume': {'value': 100000, 'unit': 'm3'}, 'release_duration': {'value': 3600, 'unit': 's'}}}


def verify_scenario(path, public=None, datasets=None):
    manifest = json.loads((path / 'manifest.json').read_text())
    if manifest['kind'] != 'scenario-release' or manifest['version'] != '1.0.0':
        raise ValueError('Invalid scenario release')
    for artifact in manifest['artifacts'].values():
        content = (path / Path(artifact['path']).name).read_bytes()
        if len(content) != artifact['byte_size'] or digest(content) != artifact['sha256'] or len(content) > 2_097_152:
            raise ValueError('Scenario artifact checksum or size mismatch')
    request = json.loads((path / 'request.json').read_bytes())
    raw = gzip.decompress((path / 'result.json.gz').read_bytes())
    if len(raw) > 2_097_152:
        raise ValueError('Scenario result exceeds decoded budget')
    result = json.loads(raw)
    RESULT.validate(result)
    if result['definition'] != request or manifest['id'] != request['id']:
        raise ValueError('Scenario identity/definition mismatch')
    datasets = datasets or inputs()
    reproduced = run_scenario(request, datasets, result['calculated_at'])
    # Runtime provenance belongs to the original run; numerical reproducibility is checked independently.
    reproduced['runtime'] = result['runtime']
    if reproduced != result:
        raise ValueError('Scenario numerical result does not reproduce')
    spatial = json.loads(gzip.decompress((path / 'path.geojson.gz').read_bytes()))
    by_id = {f['properties']['source_id']: f for d in datasets for f in d['collection']['features']}
    expected = spatial_output(result, by_id)
    if spatial != expected:
        raise ValueError('Scenario mapped pathway differs from source geometry')
    names = {'manifest.json', 'request.json', 'result.json.gz', 'path.geojson.gz'}
    if {p.name for p in path.iterdir() if p.is_file()} != names:
        raise ValueError('Unregistered scenario file')
    if public and ({p.name for p in public.iterdir() if p.is_file()} != names or any((path / name).read_bytes() != (public / name).read_bytes() for name in names)):
        raise ValueError('Public scenario differs')
    return result


def spatial_output(result, by_id):
    return {'type': 'FeatureCollection', 'features': [{'type': 'Feature', 'id': row['reach_id'], 'geometry': by_id[row['reach_id']]['geometry'], 'properties': {'reach_id': row['reach_id'], 'evidence_type': 'modelled', 'role': 'source_network_pathway_not_hazard_footprint'}} for row in result['path']]}


def publish(request, datasets):
    # Validate and calculate before constructing any output path or publishing files.
    result = run_scenario(request, datasets, datetime.now(timezone.utc).replace(microsecond=0).isoformat().replace('+00:00', 'Z'))
    base = f"/data/{request['id']}/{request['version']}/"
    release, public = ROOT / ('data/releases' + base[5:]), ROOT / ('apps/web/public' + base)
    if release.exists():
        existing = verify_scenario(release, public, datasets)
        if existing['definition'] != request:
            raise ScenarioError('immutable_version', 'Scenario definition differs from published version; use a new run identity/version')
        return existing
    by_id = {f['properties']['source_id']: f for d in datasets for f in d['collection']['features']}
    files = {'request.json': encoded(request), 'result.json.gz': gzip.compress(encoded(result), mtime=0), 'path.geojson.gz': gzip.compress(encoded(spatial_output(result, by_id)), mtime=0)}
    manifest = {'kind': 'scenario-release', 'id': request['id'], 'version': '1.0.0', 'artifacts': {key: {'path': base + name, 'sha256': digest(files[name]), 'byte_size': len(files[name])} for key, name in [('request', 'request.json'), ('result', 'result.json.gz'), ('spatial', 'path.geojson.gz')]}}
    files['manifest.json'] = encoded(manifest)
    stage = ROOT / 'data/staging' / request['id']
    stage.mkdir(parents=True, exist_ok=True)
    for name, raw in files.items():
        (stage / name).write_bytes(raw)
    verify_scenario(stage, datasets=datasets)
    release.parent.mkdir(parents=True, exist_ok=True)
    shutil.copytree(stage, release)
    shutil.copytree(stage, public)
    print(f"Published {request['id']} — {result['status']}, {len(result['path'])} source reaches")
    return result


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--request', type=Path, help='Versioned scenario-definition JSON. Omit to publish/verify the two registered examples.')
    args = parser.parse_args()
    try:
        datasets = inputs()
        requests = [json.loads(args.request.read_text())] if args.request else definitions(datasets)
        for request in requests:
            publish(request, datasets)
    except (ValueError, KeyError, TypeError, OverflowError) as error:
        parser.exit(1, f"Scenario failed [{getattr(error, 'code', 'validation_failure')}]: {error}\nNo new scenario result was published.\n")


if __name__ == '__main__':
    main()
