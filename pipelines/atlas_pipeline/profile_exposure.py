"""Profile the published Nepal asset overlay without publishing a hazard or reading web pixels."""
import json
import platform
import resource
import time

from .contracts import ROOT
from .exposure import ASSET_IDS, asset_index, project, read_dataset, shape, vector_overlay


def main():
    start = time.perf_counter()
    assets = [read_dataset(dataset_id) for dataset_id in ASSET_IDS]
    country = read_dataset('nepal-admin-country', '2.0.1')
    area = project(shape(country['collection']['features'][0]['geometry']))
    loaded = time.perf_counter()
    index = asset_index(assets)
    indexed = time.perf_counter()
    matched = vector_overlay(area, index)
    report = {
        'scope': 'Full Nepal country polygon and published asset partitions; population excluded',
        'source_load_s': loaded - start, 'index_s': indexed - loaded,
        'overlay_s': time.perf_counter() - indexed,
        'source_assets': sum(len(d['collection']['features']) for d in assets),
        'matched_assets': len(matched),
        'peak_rss_bytes': resource.getrusage(resource.RUSAGE_SELF).ru_maxrss
        * (1 if platform.system() == 'Darwin' else 1024),
        'platform': platform.platform(),
    }
    path = ROOT / 'data/processed/performance/exposure.json'
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(report, indent=2) + '\n')
    print(json.dumps(report, indent=2))


if __name__ == '__main__':
    main()
