"""Validate native masks, paired counts, integrity and exact public mirrors."""
import hashlib
import json

import numpy as np
from jsonschema import Draft7Validator, FormatChecker
from PIL import Image

from processing.water_change.engine import compare

from .contracts import ROOT

VALIDATOR = Draft7Validator(json.loads((ROOT / 'schemas/water-change.schema.json').read_text()), format_checker=FormatChecker())


def verify_water_change(path, public=None):
    manifest = json.loads((path / 'manifest.json').read_text())
    VALIDATOR.validate(manifest)
    files = {'manifest.json', 'sources.json', 'qa.json', 'LICENSE.txt'}

    def verify(ref):
        name = ref['path'].split('/')[-1]
        files.add(name)
        raw = (path / name).read_bytes()
        if len(raw) != ref['byte_size'] or hashlib.sha256(raw).hexdigest() != ref['sha256']:
            raise ValueError('Water artifact checksum mismatch')
        return raw

    payload = json.loads(verify(manifest['metadata']['artifact']))
    if payload != {k: manifest[k] for k in ['observations', 'comparisons']}:
        raise ValueError('Water index mismatch')
    observations = manifest['observations']
    ids = [o['id'] for o in observations]
    if len(set(ids)) != len(ids) or ids != sorted(ids):
        raise ValueError('Duplicate or unordered water dates')
    masks = {}
    for o in observations:
        if o['id'] != o['acquired_at'][:10]:
            raise ValueError('Water acquisition date mismatch')
        for key in ['classification', 'quality', 'water', 'quality_preview', 'true_colour']:
            verify(o[key])
        mask = np.array(Image.open(path / o['classification']['path'].split('/')[-1]))
        quality = np.array(Image.open(path / o['quality']['path'].split('/')[-1]))
        if mask.shape != (512, 505) or quality.shape != mask.shape or not np.isin(mask, [0, 1, 2]).all() or not np.isin(quality, [0, 1, 2, 3, 4]).all() or not np.array_equal(mask == 0, quality > 0):
            raise ValueError('Invalid native water/quality masks')
        if o['valid_fraction'] != float((mask > 0).mean()) or o['water_km2'] != float((mask == 2).sum()) * .0004:
            raise ValueError('Water observation statistics mismatch')
        masks[o['id']] = mask
    pairs = set()
    for pair in manifest['comparisons']:
        before, after = pair['before'], pair['after']
        if before >= after or (before, after) in pairs:
            raise ValueError('Invalid water comparison order')
        pairs.add((before, after))
        expected, stats = compare(masks[before], masks[after], manifest['grid'], manifest['grid'])
        if any(pair[k] != v for k, v in stats.items()):
            raise ValueError('Water comparison statistics mismatch')
        verify(pair['classification'])
        verify(pair['preview'])
        if not np.array_equal(expected, np.array(Image.open(path / pair['classification']['path'].split('/')[-1]))):
            raise ValueError('Water comparison mask mismatch')
    if {p.name for p in path.iterdir() if p.is_file()} != files:
        raise ValueError('Unregistered water release file')
    if public:
        if {p.name for p in public.iterdir() if p.is_file()} != files or any((path / name).read_bytes() != (public / name).read_bytes() for name in files):
            raise ValueError('Public water artifacts differ')
    return manifest
