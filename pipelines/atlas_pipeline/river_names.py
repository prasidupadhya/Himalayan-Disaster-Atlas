"""Publish named stream locations; deliberately not a HydroRIVERS name crosswalk."""
import argparse
import hashlib
import json
from pathlib import Path

from .contracts import ROOT
from .mountains import clean_aliases, source_rows
from .vector_release import publish_vector

SOURCE_SHA256 = '3d96bfd38e278e58877eeae6e69fdc534ebfacb6b954ce2c86939f7a768de3eb'


def run(source, root=ROOT):
    source = Path(source)
    if hashlib.sha256(source.read_bytes()).hexdigest() != SOURCE_SHA256:
        raise ValueError('River-name snapshot checksum mismatch')
    features = []
    for row in source_rows(source):
        if row[6] != 'H' or row[7] not in {'STM', 'STMI'}:
            continue
        aliases = clean_aliases(row[1], row[2], row[3])[:8]
        features.append({'type': 'Feature', 'id': f'geonames-{row[0]}', 'geometry': {
            'type': 'Point', 'coordinates': [float(row[5]), float(row[4])]}, 'properties': {
            'dataset_id': 'nepal-river-names', 'dataset_version': '1.0.0',
            'name': row[1], 'aliases': aliases[1:], 'search_terms': aliases,
            'source_id': row[0], 'source_modified': row[18], 'feature_code': row[7],
            'is_fixture': False, 'value': None, 'unit': None}})
    features.sort(key=lambda f: int(f['properties']['source_id']))
    metadata = json.loads((root / 'data/releases/nepal-mountains/1.0.0/manifest.json').read_text())
    metadata.pop('artifact')
    metadata.update(dataset_id='nepal-river-names', dataset_name='Nepal named stream locations (GeoNames)',
        source='GeoNames Nepal country dump, retrieved 2026-09-22',
        observation_date=None, publication_date='2026-09-22T01:51:37Z', retrieval_date='2026-09-22T19:15:00Z',
        processing_date='2026-09-22T19:20:00Z', processing_version='river-names-pipeline-1.0.0',
        method=f'Source publication time is the NP.zip HTTP Last-Modified timestamp. Pinned NP.zip SHA-256 {SOURCE_SHA256}; retained STM/STMI point locations, original names, up to eight source aliases and stable GeoNames IDs. No spatial join or name propagation onto HydroRIVERS reaches.',
        spatial_coverage={'description': 'Named stream points assigned to Nepal by GeoNames', 'bbox': [80, 26, 89, 31]},
        limitations=['Gazetteer points identify named locations, not river geometry or a verified HYRIV reach identity.',
            'Names and transliterations are preserved from GeoNames; coverage is incomplete and not an official exhaustive river register.',
            'A point may represent a mouth or another reference location. Nearby streams must not inherit its name.',
            'STM and STMI source classifications are not current flow measurements.'],
        uncertainty='Positional accuracy and correspondence to HydroRIVERS reaches are UNKNOWN.',
        stale_after='2027-09-22T00:00:00Z')
    return publish_vector(root, metadata, {'type': 'FeatureCollection', 'features': features})


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--source', required=True, type=Path)
    run(parser.parse_args().source)
