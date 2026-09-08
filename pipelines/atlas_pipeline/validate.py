"""Verify every registered release and its exact public copy."""
import json
from pathlib import Path

from .climate_contracts import verify_climate
from .contracts import ROOT, verify_artifact
from .exposure_contracts import verify_exposure
from .hazard_graph import verify_hazard_graph
from .population_contracts import verify_population
from .provenance import verify_provenance
from .rag import verify_rag
from .satellite_contracts import verify_satellite
from .scenarios import verify_scenario
from .search import verify_search_index
from .terrain_contracts import verify_context, verify_terrain
from .time_machine import verify_time_index
from .water_change_contracts import verify_water_change


def main():
    releases = sorted((ROOT / 'data/releases').glob('*/*/manifest.json'))
    if not releases:
        raise ValueError('No release manifests found')
    for path in releases:
        metadata = json.loads(path.read_text())
        if metadata.get('kind') == 'provenance-catalog':
            verify_provenance(path.parent, ROOT / 'apps/web/public/data' / path.parent.relative_to(ROOT / 'data/releases'))
            print('Valid: atlas-provenance@1.0.0')
            continue
        if metadata.get('kind') == 'evidence-release':
            verify_rag(path.parent, ROOT / 'apps/web/public/data' / path.parent.relative_to(ROOT / 'data/releases'))
            print('Valid: atlas-evidence@' + metadata['version'])
            continue
        if metadata.get('kind') == 'scenario-release':
            verify_scenario(path.parent, ROOT / 'apps/web/public/data' / path.parent.relative_to(ROOT / 'data/releases'))
            print(f"Valid: {metadata['id']}@{metadata['version']}")
            continue
        if metadata.get('kind') == 'hazard-graph-release':
            verify_hazard_graph(path.parent, ROOT / 'apps/web/public/data' / path.parent.relative_to(ROOT / 'data/releases'))
            print('Valid: nepal-hazard-graph@1.0.0')
            continue
        if metadata.get('kind') == 'temporal-index':
            verify_time_index(path.parent, ROOT / 'apps/web/public/data' / path.parent.relative_to(ROOT / 'data/releases'))
            print('Valid: atlas-time-index@1.0.0')
            continue
        if metadata.get('kind') == 'search-index':
            verify_search_index(path.parent, ROOT / 'apps/web/public/data' / path.parent.relative_to(ROOT / 'data/releases'))
            print('Valid: atlas-search-index@1.0.0')
            continue
        if metadata.get('metadata', {}).get('dataset_id') == 'phewa-water-change':
            verify_water_change(path.parent, ROOT / 'apps/web/public/data' / path.parent.relative_to(ROOT / 'data/releases'))
            print('Valid: phewa-water-change@1.0.0')
            continue
        if metadata.get('kind') == 'exposure-result':
            verify_exposure(path.parent, ROOT / 'apps/web/public/data' / path.parent.relative_to(ROOT / 'data/releases'))
            print(f"Valid: {metadata['result_id']}@{metadata['version']}")
            continue
        if metadata.get('metadata', {}).get('dataset_id') == 'nepal-population':
            manifest = verify_population(path.parent, ROOT / 'apps/web/public/data' / path.parent.relative_to(ROOT / 'data/releases'))
            print(f"Valid: {manifest['metadata']['dataset_id']}@{manifest['metadata']['dataset_version']}")
            continue
        if metadata.get('metadata', {}).get('dataset_id') == 'nepal-sentinel-observations':
            manifest = verify_satellite(path.parent, ROOT / 'apps/web/public/data' / path.parent.relative_to(ROOT / 'data/releases'))
            print(f"Valid: {manifest['metadata']['dataset_id']}@{manifest['metadata']['dataset_version']}")
            continue
        if metadata.get('metadata', {}).get('dataset_id') == 'nepal-power-climate':
            manifest = verify_climate(path.parent, ROOT / 'apps/web/public/data' / path.parent.relative_to(ROOT / 'data/releases'))
            print(f"Valid: {manifest['metadata']['dataset_id']}@{manifest['metadata']['dataset_version']}")
            continue
        if 'raster' in metadata:
            verifier = verify_context if metadata['metadata']['dataset_id'] == 'asia-terrain-context' else verify_terrain
            manifest = verifier(path.parent, ROOT / 'apps/web/public/data' / path.parent.relative_to(ROOT / 'data/releases'))
            print(f"Valid: {manifest['metadata']['dataset_id']}@{manifest['metadata']['dataset_version']}")
            continue
        artifact_name = Path(metadata['artifact']['path']).name
        content = path.with_name(artifact_name).read_bytes()
        verify_artifact(metadata, content)
        public = ROOT / 'apps/web/public' / metadata['artifact']['path'].lstrip('/')
        if public.read_bytes() != content or public.with_name('manifest.json').read_bytes() != path.read_bytes():
            raise ValueError('Public artifact differs from validated release')
        print(f"Valid: {metadata['dataset_id']}@{metadata['dataset_version']}")


if __name__ == '__main__':
    main()
