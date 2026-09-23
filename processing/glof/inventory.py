"""Enumerate every source lake in Nepal/transboundary inventory without claiming flow connectivity."""
import argparse
import gzip
import hashlib
import json
from pathlib import Path

from .contracts import REQUIRED_EVIDENCE

ROOT = Path(__file__).resolve().parents[2]


def inventory():
    manifest = json.loads((ROOT / 'data/releases/nepal-transboundary-glacial-lakes/1.0.0/manifest.json').read_text())
    artifact = ROOT / 'apps/web/public' / manifest['artifact']['path'].lstrip('/')
    raw = artifact.read_bytes()
    if hashlib.sha256(raw).hexdigest() != manifest['artifact']['sha256']:
        raise ValueError('Lake inventory checksum mismatch')
    features = json.loads(gzip.decompress(raw))['features']
    return {'scope': 'All source lakes in Nepal and Nepal/transboundary catchments; not proof that each lake floods Nepal.',
            'source_sha256': manifest['artifact']['sha256'], 'source_version': manifest['dataset_version'],
            'lakes': [{'lake_id': f['properties']['source_id'], 'country': f['properties']['country'],
                       'coordinates': f['geometry']['coordinates'], 'state': 'INPUTS_REQUIRED',
                       'verified_outlet_to_nepal': None, 'missing_evidence': list(REQUIRED_EVIDENCE),
                       'inundation': None, 'damage': None} for f in features]}


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--output', type=Path, required=True)
    args = parser.parse_args()
    if args.output.exists():
        raise ValueError('Choose a new inventory output path')
    args.output.write_text(json.dumps(inventory(), indent=2) + '\n')
