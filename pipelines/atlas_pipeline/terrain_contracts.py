"""Validate the central raster contract, full tile inventory and publication copies."""
import hashlib
import json

import numpy as np
from jsonschema import Draft7Validator, FormatChecker
from PIL import Image
from referencing import Registry, Resource

from .contracts import ROOT, SCHEMA, timestamp

TERRAIN_SCHEMA = json.loads((ROOT / 'schemas/terrain.schema.json').read_text())
VALIDATOR = Draft7Validator(TERRAIN_SCHEMA, format_checker=FormatChecker(),
                           registry=Registry().with_resource(SCHEMA['$id'], Resource.from_contents(SCHEMA)))


def verify_terrain(path, public=None):
    manifest = json.loads((path / 'manifest.json').read_text())
    VALIDATOR.validate(manifest)
    m = manifest['metadata']
    if m['dataset_id'] != 'nepal-terrain' or m['artifact']['path'] != f"/data/nepal-terrain/{m['dataset_version']}/tiles.json":
        raise ValueError('Terrain identity mismatch')
    if m['status'] != 'ATLAS_DERIVED' or m['evidence_type'] != 'derived' or m['is_fixture']:
        raise ValueError('Incorrect terrain evidence')
    if timestamp(m['processing_date']) < timestamp(m['retrieval_date']):
        raise ValueError('Terrain processing precedes retrieval')
    expected_bounds = [78.75, 21.943045533438177, 90, 31.952162238024968]
    if not np.allclose(m['spatial_coverage']['bbox'], expected_bounds, atol=1e-9, rtol=0):
        raise ValueError('Terrain tile coverage mismatch')
    content = (path / 'tiles.json').read_bytes()
    if hashlib.sha256(content).hexdigest() != m['artifact']['sha256'] or len(content) != m['artifact']['byte_size']:
        raise ValueError('Terrain index checksum mismatch')
    index = json.loads(content)
    expected = {f'{z}/{x}/{y}.png' for z in range(5, 10) for x in range(23 * 2 ** (z - 5), 24 * 2 ** (z - 5))
                for y in range(13 * 2 ** (z - 5), 14 * 2 ** (z - 5))}
    if set(index) != expected or len(index) != manifest['raster']['tile_count']:
        raise ValueError('Missing or unexpected terrain tiles')
    for key, item in index.items():
        content = (path / key).read_bytes()
        if len(content) != item['byte_size'] or len(content) > 262144 or hashlib.sha256(content).hexdigest() != item['sha256']:
            raise ValueError(f'Terrain tile checksum mismatch: {key}')
        with Image.open(path / key) as image:
            if image.size != (256, 256) or image.mode != 'RGB':
                raise ValueError('Invalid terrain PNG')
            values = np.asarray(image).astype('float64')
            elevation = (values[..., 0] * 65536 + values[..., 1] * 256 + values[..., 2]) * 0.1 - 10000
            if np.any(elevation < -500) or np.any(elevation > 9000):
                raise ValueError('Invalid terrain elevations')
    sources = json.loads((path / 'sources.json').read_text())
    if sources != json.loads((ROOT / 'pipelines/terrain-sources.json').read_text()) or len(sources) != 143:
        raise ValueError('Terrain source inventory mismatch')
    files = expected | {'manifest.json', 'tiles.json', 'sources.json', 'qa.json', 'LICENSE.txt'}
    if {str(p.relative_to(path)) for p in path.rglob('*') if p.is_file()} != files:
        raise ValueError('Unregistered terrain artifacts')
    if public:
        if {str(p.relative_to(public)) for p in public.rglob('*') if p.is_file()} != files:
            raise ValueError('Public terrain inventory differs')
        for name in files:
            if (path / name).read_bytes() != (public / name).read_bytes():
                raise ValueError(f'Public terrain differs: {name}')
    return manifest
