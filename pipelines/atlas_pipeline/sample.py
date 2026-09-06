"""Run: python -m pipelines.atlas_pipeline.sample. No network or credentials."""
import csv
import hashlib
import io
import json
from pathlib import Path

from .contracts import ROOT, validate_dataset

DATASET_ID = 'foundation-sample'
VERSION = '1.0.0'
DATE = '2026-09-06T00:00:00Z'


def encode(value):
    return (json.dumps(value, indent=2, allow_nan=False) + '\n').encode()


def write(path, content, immutable=False):
    path.parent.mkdir(parents=True, exist_ok=True)
    if immutable and path.exists() and path.read_bytes() != content:
        raise ValueError(f'Release already exists with different content: {path}; bump the version')
    path.write_bytes(content)


def run(root=ROOT, source=None):
    # Acquisition: retain the exact source and its digest, without altering it.
    source = source or ROOT / 'tests/fixtures/sample-source.csv'
    content = Path(source).read_bytes()
    source_hash = hashlib.sha256(content).hexdigest()
    write(root / f'data/raw/{DATASET_ID}/{source_hash}.csv', content)
    features = []
    # Cleaning/normalization: strip strings, parse coordinates, preserve missing values.
    for row in csv.DictReader(io.StringIO(content.decode())):
        row = {key: value.strip() for key, value in row.items()}
        features.append({
            'type': 'Feature', 'id': row['id'],
            'properties': {'dataset_id': DATASET_ID, 'dataset_version': VERSION,
                           'name': row['name'], 'is_fixture': True,
                           'value': float(row['value']) if row['value'] else None,
                           'unit': row['unit'] or None},
            'geometry': {'type': 'Point', 'coordinates': [float(row['longitude']), float(row['latitude'])]}
        })
    collection = {'type': 'FeatureCollection', 'features': features}
    artifact = encode(collection)
    metadata = {
        'schema_version': '1.0.0', 'dataset_id': DATASET_ID,
        'dataset_name': 'Foundation synthetic points', 'dataset_version': VERSION,
        'source': 'Atlas development fixture; hand-authored coordinates', 'source_url': None,
        'license': 'CC0-1.0', 'license_url': 'https://creativecommons.org/publicdomain/zero/1.0/',
        'attribution': 'Himalayan Disaster Atlas — synthetic development fixture',
        'observation_date': None, 'publication_date': None,
        'retrieval_date': DATE, 'processing_date': DATE, 'processing_version': 'sample-pipeline-1.0.0',
        'method': f'Local CSV acquisition (SHA-256 {source_hash}); whitespace cleaning; numeric normalization; CRS84 validation; static GeoJSON export. No real-world observations.',
        'spatial_resolution': {'value': None, 'unit': None}, 'temporal_resolution': None,
        'spatial_coverage': {'description': 'Synthetic test extent in the Nepal-focused viewport; not a boundary dataset', 'bbox': [85.5, 27.5, 86.5, 28.5]},
        'temporal_coverage': {'start': None, 'end': None}, 'crs': 'OGC:CRS84',
        'status': 'UNKNOWN', 'evidence_type': 'unknown', 'is_fixture': True,
        'limitations': ['All positions and labels are synthetic. They do not identify real geographic features.', 'No terrain, hazard, monitoring, exposure, or simulation data is included.'],
        'uncertainty': 'Not applicable to synthetic fixtures; no scientific measurements are supplied.',
        'update_frequency': 'static', 'stale_after': None,
        'artifact': {'path': f'/data/{DATASET_ID}/{VERSION}/features.geojson', 'format': 'GeoJSON',
                     'sha256': hashlib.sha256(artifact).hexdigest(), 'byte_size': len(artifact)}
    }
    validate_dataset(metadata, collection)
    write(root / f'data/processed/{DATASET_ID}/{VERSION}/features.geojson', artifact)
    # Preflight both targets before publishing either, preserving immutable versions.
    outputs = []
    for target in [root / f'data/releases/{DATASET_ID}/{VERSION}', root / f'apps/web/public/data/{DATASET_ID}/{VERSION}']:
        outputs.extend([(target / 'manifest.json', encode(metadata)), (target / 'features.geojson', artifact)])
    for path, blob in outputs:
        if path.exists() and path.read_bytes() != blob:
            raise ValueError(f'Immutable release conflict: {path}; bump the version')
    for path, blob in outputs:
        write(path, blob, immutable=True)
    print(f'Validated and published {DATASET_ID}@{VERSION} ({len(features)} synthetic features)')
    return metadata, collection


if __name__ == '__main__':
    run()
