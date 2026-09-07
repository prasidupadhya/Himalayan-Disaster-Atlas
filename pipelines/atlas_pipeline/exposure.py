"""Calculate and publish versioned exposure results offline from explicit footprints."""
import argparse
import gzip
import json
import platform
import resource
import shutil
import time
from datetime import datetime, timezone
from pathlib import Path

import rasterio
import shapely
from shapely.geometry import mapping, shape
from shapely.ops import unary_union

from processing.exposure.engine import (
    AREA_CRS,
    METHOD,
    administrative_overlay,
    asset_index,
    assign_assets,
    footprint_geometry,
    population_overlay,
    project,
    spatial_features,
    vector_overlay,
)

from .contracts import ROOT, verify_artifact
from .exposure_contracts import REQUEST, RESULT, digest, verify_exposure
from .population import EXPECTED_SHA256

ASSET_IDS = [
    'nepal-osm-major-roads-west', 'nepal-osm-major-roads-central', 'nepal-osm-major-roads-east',
    'nepal-osm-major-bridges', 'nepal-osm-schools-west', 'nepal-osm-schools-central-west',
    'nepal-osm-schools-central-east', 'nepal-osm-schools-east', 'nepal-osm-health-facilities',
    'nepal-osm-emergency-facilities', 'nepal-osm-settlements', 'nepal-osm-hydropower',
]
CATEGORIES = ['road', 'bridge', 'school', 'health', 'emergency', 'settlement', 'hydropower']
LIMITATIONS = [
    'Potential spatial exposure is distinct from vulnerability, probability of harm, risk, and confirmed damage or losses.',
    'Hypothetical corridors are user-defined areas of interest, not hydraulic inundation models or forecasts.',
    'WorldPop 2025 R2025A v1 is a modelled estimate, not a census. Native cell counts are allocated uniformly within each cell for partial-cell weighting.',
    'NoData and areas outside the native raster are UNKNOWN. Known-cell population is a partial subtotal; the full-footprint estimate is null whenever unknown area remains.',
    'OSM inventories are incomplete. Zero matches means no mapped records intersect, not that no infrastructure exists. Buildings and dams are unavailable.',
    'OSM way/relation facilities use representative centres, not building footprints. Roads use simplified, boundary-clipped presentation geometry; intersection near edges is approximate.',
    'Each OSM element is counted once globally. Category counts may overlap and must not be added as a unique total. Major-road counts are mapped OSM ways, not complete named roads.',
    'Points, lines and polygons count on any intersection, including boundary-only contact. Polygon counts are whole assets, not fractional assets.',
    'Administrative areas use COD-AB display districts. Lowest P-code wins polygon overlap; unassigned areas remain explicit. Assets use greatest intersected area/length, then P-code for ties.',
    'Input dates differ. Positional accuracy and per-cell confidence intervals are not supplied; neither confidence bounds nor future casualties can be inferred.',
]


def encoded(value):
    return (json.dumps(value, sort_keys=True, separators=(',', ':'), allow_nan=False) + '\n').encode()


def read_dataset(dataset_id, version='1.0.0'):
    base = ROOT / f'data/releases/{dataset_id}/{version}'
    metadata = json.loads((base / 'manifest.json').read_text())
    data = (base / Path(metadata['artifact']['path']).name).read_bytes()
    verify_artifact(metadata, data)
    return {'metadata': metadata, 'collection': json.loads(gzip.decompress(data) if metadata['artifact']['format'].endswith('+gzip') else data)}


def reference(metadata, sha=None):
    return {'dataset_id': metadata['dataset_id'], 'dataset_version': metadata['dataset_version'],
            'sha256': sha or metadata['artifact']['sha256'], 'source': metadata['source'], 'license': metadata['license']}


def calculate(request, population_path, assets, districts, calculated_at):
    REQUEST.validate(request)
    footprint = footprint_geometry(request)
    population_manifest = json.loads((ROOT / 'data/releases/nepal-population/1.0.0/manifest.json').read_text())
    if digest(Path(population_path).read_bytes()) != EXPECTED_SHA256:
        raise ValueError('Population source hash mismatch; display tiles and changed rasters are not accepted')
    if any(Path(str(population_path) + suffix).exists() for suffix in ['.msk', '.aux.xml']):
        raise ValueError('Unpinned raster sidecar may change masks/georeferencing; use the standalone pinned GeoTIFF')
    inputs = request['inputs'] + [reference(d['metadata']) for d in assets + [districts]] + [reference(population_manifest['metadata'], EXPECTED_SHA256)]
    fingerprint = digest(encoded({'request': request, 'inputs': inputs, 'method': METHOD}))
    matched = vector_overlay(footprint, asset_index(assets))
    pieces = administrative_overlay(footprint, districts['collection']['features'])
    assign_assets(matched, pieces)
    with rasterio.open(population_path) as raster:
        analysis = population_manifest['analysis']
        if (raster.width, raster.height, raster.nodata) != (analysis['width'], analysis['height'], analysis['nodata']):
            raise ValueError('Native population grid does not match its manifest')
        population = population_overlay(footprint, raster)
        administration = [{
            'pcode': piece['pcode'], 'name': piece['name'], 'area_km2': piece['geometry'].area / 1e6,
            'population': population_overlay(piece['geometry'], raster),
            'unique_assets': sum(item['admin_pcode'] == piece['pcode'] for item in matched),
        } for piece in pieces]
    result = {
        'schema_version': '4.0.0', 'kind': 'exposure-result', 'result_id': request['id'], 'version': request['version'],
        'name': request['name'], 'calculated_at': calculated_at, 'method': METHOD, 'run_sha256': fingerprint,
        'status': 'ESTIMATED', 'evidence_type': 'derived', 'input_crs': 'OGC:CRS84', 'area_crs': AREA_CRS,
        'footprint_kind': request['kind'], 'footprint_area_km2': footprint.area / 1e6, 'inputs': inputs,
        'population': population, 'population_resolution_degree': analysis['resolution_degree'],
        'unique_assets': len(matched),
        'categories': [{'category': c, 'count': sum(c in item['categories'] for item in matched), 'coverage': 'mapped_inventory_only'} for c in CATEGORIES]
            + [{'category': c, 'count': None, 'coverage': 'not_available'} for c in ['building', 'dam']],
        'assets': [{k: sorted(item[k]) if isinstance(item[k], set) else item[k] for k in ['id', 'name', 'categories', 'dataset_ids', 'admin_pcode', 'position_basis']} for item in matched],
        'administration': administration, 'limitations': LIMITATIONS + request['assumptions'],
    }
    spatial = spatial_features(matched)
    for feature in spatial['features']:
        feature['properties']['kind'] = 'asset'
    spatial['features'].insert(0, {'type': 'Feature', 'id': 'footprint', 'properties': {'kind': 'footprint'}, 'geometry': request['geometry']})
    return result, spatial


def publish(request, result, spatial):
    release = ROOT / f"data/releases/{request['id']}/{request['version']}"
    public = ROOT / f"apps/web/public/data/{request['id']}/{request['version']}"
    files = {'request.json': encoded(request), 'spatial.geojson.gz': gzip.compress(encoded(spatial), mtime=0)}
    result['artifacts'] = {}
    for key, name in [('request', 'request.json'), ('spatial', 'spatial.geojson.gz')]:
        result['artifacts'][key] = {'path': f"/data/{request['id']}/{request['version']}/{name}", 'sha256': digest(files[name]), 'byte_size': len(files[name])}
    RESULT.validate(result)
    files['manifest.json'] = encoded(result)
    if release.exists():
        prior = verify_exposure(release, public)
        if prior['run_sha256'] != result['run_sha256']:
            raise ValueError('Published exposure version is immutable; use a new result identity/version')
        # Recomputed numerical/spatial outputs must match, except actual calculation time.
        comparable = {**result, 'calculated_at': prior['calculated_at']}
        if comparable != prior or any((release / name).read_bytes() != data for name, data in files.items() if name != 'manifest.json'):
            raise ValueError('Recalculation differs from immutable result')
        return release
    stage = ROOT / f"data/processed/exposure/{request['id']}/{request['version']}"
    stage.mkdir(parents=True, exist_ok=True)
    for name, data in files.items():
        (stage / name).write_bytes(data)
    verify_exposure(stage)
    if public.exists():
        raise ValueError('Public result path already exists')
    shutil.copytree(stage, release)
    shutil.copytree(stage, public)
    verify_exposure(release, public)
    return release


def example_request(distance):
    rivers = [read_dataset(f'nepal-rivers-{partition}') for partition in ['primary', 'headwaters']]
    network = {f['properties']['source_id']: f for d in rivers for f in d['collection']['features']}
    next_id, path = '40669746', []
    while next_id in network:
        if next_id in path:
            raise ValueError('Cycle in trace')
        path.append(next_id)
        next_id = network[next_id]['properties']['downstream_id']
    local_crs = '+proj=aeqd +lat_0=28.5 +lon_0=82 +datum=WGS84 +units=m +no_defs'
    lines = unary_union([shape(network[id]['geometry']) for id in path])
    corridor = project(lines, target=local_crs).buffer(distance, quad_segs=16).simplify(1, preserve_topology=True)
    geometry = json.loads(encoded(mapping(project(corridor, local_crs, 'EPSG:4326'))))
    return {
        'schema_version': '1.0.0', 'id': f'exposure-trace-40669746-{distance}m', 'version': '1.0.0',
        'name': f'Hypothetical HYRIV 40669746 trace corridor · {distance} m each side',
        'kind': 'hypothetical_corridor', 'crs': 'OGC:CRS84', 'geometry': geometry,
        'inputs': [reference(d['metadata']) for d in rivers],
        'assumptions': [f'Area-of-interest corridor around {len(path)} retained reaches from HYRIV 40669746, stopping before unavailable HYRIV {next_id}.',
                        f'Assumed buffer distance {distance} m each side in local azimuthal equidistant CRS centred at 82°E, 28.5°N; round joins/caps, 16 segments per quadrant, final 1 m topology-preserving footprint simplification.',
                        'The corridor width is hypothetical and has no calibrated relation to flood extent, discharge or terrain. No hazard severity or probability is assigned.'],
    }


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--population', required=True, type=Path, help='Pinned native WorldPop GeoTIFF; never web tiles')
    parser.add_argument('--request', type=Path, help='Versioned exposure-request JSON Polygon/MultiPolygon')
    parser.add_argument('--examples', action='store_true')
    parser.add_argument('--benchmark-nepal', action='store_true', help='Benchmark full-country overlay without publishing a hazard scenario')
    args = parser.parse_args()
    if sum([bool(args.request), args.examples, args.benchmark_nepal]) != 1:
        parser.error('Choose exactly one of --request, --examples or --benchmark-nepal')
    started = time.perf_counter()
    assets = [read_dataset(id) for id in ASSET_IDS]
    if args.benchmark_nepal:
        if digest(args.population.read_bytes()) != EXPECTED_SHA256:
            raise ValueError('Population source checksum mismatch')
        country = read_dataset('nepal-admin-country', '2.0.1')
        area = project(shape(country['collection']['features'][0]['geometry']))
        matched = vector_overlay(area, asset_index(assets))
        with rasterio.open(args.population) as raster:
            population = population_overlay(area, raster)
        report = {'scope': 'Full COD-AB Nepal footprint, native population raster, all asset partitions',
                  'seconds': time.perf_counter() - started, 'unique_assets': len(matched), 'population': population,
                  'peak_rss_bytes': resource.getrusage(resource.RUSAGE_SELF).ru_maxrss * (1 if platform.system() == 'Darwin' else 1024),
                  'platform': platform.platform(), 'method': METHOD}
        out = ROOT / 'data/processed/exposure/nepal-benchmark.json'
        out.parent.mkdir(parents=True, exist_ok=True)
        out.write_bytes(encoded(report))
        print(json.dumps(report, indent=2))
        return
    districts = read_dataset('nepal-admin-districts', '2.0.1')
    requests = [example_request(width) for width in [250, 1000]] if args.examples else [json.loads(args.request.read_text())]
    reports = []
    for request in requests:
        before = time.perf_counter()
        result, spatial = calculate(request, args.population, assets, districts, datetime.now(timezone.utc).isoformat().replace('+00:00', 'Z'))
        release = publish(request, result, spatial)
        reports.append({'id': request['id'], 'seconds': time.perf_counter() - before, 'unique_assets': result['unique_assets'], 'population': result['population'], 'area_km2': result['footprint_area_km2']})
        print(f'Published {release.relative_to(ROOT)}', flush=True)
    benchmark = {'method': METHOD, 'platform': platform.platform(), 'python': platform.python_version(), 'shapely': shapely.__version__, 'rasterio': rasterio.__version__,
                 'source_assets': sum(len(d['collection']['features']) for d in assets), 'native_grid': [9773, 4921], 'seconds': time.perf_counter() - started,
                 'peak_rss_bytes': resource.getrusage(resource.RUSAGE_SELF).ru_maxrss * (1 if platform.system() == 'Darwin' else 1024), 'results': reports}
    path = ROOT / 'data/processed/exposure/benchmark.json'
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_bytes(encoded(benchmark))
    print(json.dumps(benchmark, indent=2), flush=True)


if __name__ == '__main__':
    main()
