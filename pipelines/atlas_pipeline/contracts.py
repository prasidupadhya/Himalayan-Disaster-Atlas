"""The JSON schema is authoritative; this module adds spatial/release invariants."""
import hashlib
import json
from datetime import datetime
from pathlib import Path

from jsonschema import Draft7Validator, FormatChecker
from shapely.geometry import shape
from shapely.validation import explain_validity

ROOT = Path(__file__).resolve().parents[2]
SCHEMA = json.loads((ROOT / 'schemas/dataset.schema.json').read_text())
VALIDATOR = Draft7Validator(SCHEMA, format_checker=FormatChecker())


def timestamp(value):
    return datetime.fromisoformat(value.replace('Z', '+00:00'))


def positions(coordinates):
    if isinstance(coordinates[0], (int, float)):
        yield coordinates
    else:
        for child in coordinates:
            yield from positions(child)


def validate_dataset(metadata, collection):
    # JSON excludes NaN/Infinity even though Python floats and its decoder permit them.
    json.dumps({'metadata': metadata, 'collection': collection}, allow_nan=False)
    VALIDATOR.validate({'metadata': metadata, 'collection': collection})
    west, south, east, north = metadata['spatial_coverage']['bbox']
    if not (-180 <= west < east <= 180 and -90 <= south < north <= 90):
        raise ValueError('Invalid CRS84 coverage bounds; antimeridian releases need a separate contract')
    if timestamp(metadata['processing_date']) < timestamp(metadata['retrieval_date']):
        raise ValueError('Processing cannot precede retrieval')
    coverage = metadata['temporal_coverage']
    if bool(coverage['start']) != bool(coverage['end']):
        raise ValueError('Temporal coverage needs both endpoints or two nulls')
    if coverage['start'] and timestamp(coverage['start']) > timestamp(coverage['end']):
        raise ValueError('Temporal coverage is reversed')
    resolution = metadata['spatial_resolution']
    if (resolution['value'] is None) != (resolution['unit'] is None):
        raise ValueError('Resolution value and unit must both be known or null')
    if metadata['update_frequency'] != 'static' and metadata['stale_after'] is None:
        raise ValueError('Updating datasets require a stale_after timestamp')
    if metadata['stale_after'] and timestamp(metadata['stale_after']) < timestamp(metadata['retrieval_date']):
        raise ValueError('Stale deadline precedes retrieval')
    expected_path = f"/data/{metadata['dataset_id']}/{metadata['dataset_version']}/features.geojson"
    if metadata['artifact']['path'] != expected_path:
        raise ValueError('Artifact path must match dataset identity and version')
    identifiers = set()
    for feature in collection['features']:
        if feature['id'] in identifiers:
            raise ValueError('Duplicate feature identifier')
        identifiers.add(feature['id'])
        properties = feature['properties']
        for key in ('dataset_id', 'dataset_version', 'is_fixture'):
            if properties[key] != metadata[key]:
                raise ValueError(f'Feature disagrees with manifest: {key}')
        if properties['value'] is not None and properties['unit'] is None:
            raise ValueError('Known measurements require a unit')
        geometry = feature['geometry']
        rings = []
        if geometry['type'] == 'Polygon':
            rings = geometry['coordinates']
        elif geometry['type'] == 'MultiPolygon':
            rings = [ring for polygon in geometry['coordinates'] for ring in polygon]
        if any(ring[0] != ring[-1] for ring in rings):
            raise ValueError('Polygon rings must be closed explicitly')
        geom = shape(geometry)
        if geom.is_empty or not geom.is_valid:
            raise ValueError(f'Invalid geometry: {explain_validity(geom)}')
        for lon, lat in positions(geometry['coordinates']):
            if not (west <= lon <= east and south <= lat <= north):
                raise ValueError('Geometry outside declared spatial coverage')
    return {'metadata': metadata, 'collection': collection}


def verify_artifact(metadata, content):
    if len(content) != metadata['artifact']['byte_size']:
        raise ValueError('Artifact size mismatch')
    if hashlib.sha256(content).hexdigest() != metadata['artifact']['sha256']:
        raise ValueError('Artifact checksum mismatch')
    return validate_dataset(metadata, json.loads(content))
