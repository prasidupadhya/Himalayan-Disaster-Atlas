"""Shared exposure request/result schema and immutable publication verification."""
import gzip
import hashlib
import json
import math

from jsonschema import Draft7Validator, FormatChecker
from shapely.geometry import shape

from .contracts import ROOT

REQUEST = Draft7Validator(json.loads((ROOT / 'schemas/exposure-request.schema.json').read_text()), format_checker=FormatChecker())
RESULT = Draft7Validator(json.loads((ROOT / 'schemas/exposure.schema.json').read_text()), format_checker=FormatChecker())


def digest(data):
    return hashlib.sha256(data).hexdigest()


def verify_exposure(release, public=None):
    content = (release / 'manifest.json').read_bytes()
    if len(content) > 2_097_152:
        raise ValueError('Exposure result exceeds 2 MiB budget')
    result = json.loads(content)
    RESULT.validate(result)
    if result['result_id'] != release.parent.name or result['version'] != release.name:
        raise ValueError('Exposure release identity mismatch')
    for kind, artifact in result['artifacts'].items():
        name = 'request.json' if kind == 'request' else 'spatial.geojson.gz'
        if artifact['path'] != f"/data/{result['result_id']}/{result['version']}/{name}":
            raise ValueError('Exposure artifact identity mismatch')
        data = (release / name).read_bytes()
        if len(data) != artifact['byte_size'] or digest(data) != artifact['sha256']:
            raise ValueError('Exposure checksum/size mismatch')
        if kind == 'request':
            REQUEST.validate(json.loads(data))
        else:
            decoded = gzip.decompress(data)
            if len(decoded) > 8_388_608:
                raise ValueError('Exposure spatial output exceeds decoded budget')
            collection = json.loads(decoded)
            if collection['type'] != 'FeatureCollection':
                raise ValueError('Exposure spatial output must be GeoJSON')
            for feature in collection['features']:
                geom = shape(feature['geometry'])
                if geom.is_empty or not geom.is_valid:
                    raise ValueError('Invalid result geometry')
        if public is not None and (public / name).read_bytes() != data:
            raise ValueError('Exposure public artifact mismatch')
    if public is not None and (public / 'manifest.json').read_bytes() != content:
        raise ValueError('Exposure public manifest mismatch')
    if result['unique_assets'] != len({item['id'] for item in result['assets']}):
        raise ValueError('Exposure asset duplication/count mismatch')
    if sum(item['unique_assets'] for item in result['administration']) != result['unique_assets']:
        raise ValueError('Administrative asset counts do not reconcile')
    if not math.isclose(sum(item['area_km2'] for item in result['administration']), result['footprint_area_km2'], abs_tol=1e-5):
        raise ValueError('Administrative footprint areas do not reconcile')
    for pop in [result['population']] + [row['population'] for row in result['administration']]:
        if pop['unknown_area_km2'] > 0 and pop['total_population'] is not None:
            raise ValueError('NoData cannot produce a complete population total')
    for category in result['categories']:
        expected = None if category['coverage'] == 'not_available' else sum(category['category'] in item['categories'] for item in result['assets'])
        if category['count'] != expected:
            raise ValueError('Category asset count mismatch')
    return result
