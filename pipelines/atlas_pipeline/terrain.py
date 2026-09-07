"""Offline Copernicus GLO-90 acquisition and immutable web terrain release."""
import argparse
import hashlib
import json
import math
import shutil
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timezone
from urllib.request import urlopen

import numpy as np
import rasterio
from PIL import Image
from rasterio.enums import Resampling
from rasterio.merge import merge
from rasterio.transform import from_bounds
from rasterio.vrt import WarpedVRT
from rasterio.windows import Window

from .contracts import ROOT

VERSION = '1.0.0'
RAW = ROOT / 'data/raw/terrain'
WORK = ROOT / 'data/processed/terrain'
RELEASE = ROOT / f'data/releases/nepal-terrain/{VERSION}'
PUBLIC = ROOT / f'apps/web/public/data/nepal-terrain/{VERSION}'
BASE = f'/data/nepal-terrain/{VERSION}'
RADIUS = 6378137
HALF = math.pi * RADIUS
SOURCE = 'https://copernicus-dem-90m.s3.amazonaws.com'
LICENSE = 'https://dataspace.copernicus.eu/sites/default/files/media/files/2025-06/copernicus_contributing_mission_data_access_v2_cop_dem_licenses.pdf'
ATTRIBUTION = ('produced using Copernicus WorldDEM™-90 © DLR e.V. 2010-2014 and '
               '© Airbus Defence and Space GmbH 2014-2018 provided under COPERNICUS '
               'by the European Union and ESA; all rights reserved')
NOTICE = ('The organisations in charge of the Copernicus programme by law or by '
          'delegation do not incur any liability for any use of the Copernicus WorldDEM™-90')


def now():
    return datetime.now(timezone.utc).isoformat().replace('+00:00', 'Z')


def digest(content):
    return hashlib.sha256(content).hexdigest()


def write_json(path, value):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, sort_keys=True, separators=(',', ':'), allow_nan=False) + '\n')


def acquire():
    """Full XYZ root tile plus a native-pixel halo, with no invented edge elevations."""
    RAW.mkdir(parents=True, exist_ok=True)
    lock = ROOT / 'pipelines/terrain-sources.json'
    pinned = {r['name']: r for r in json.loads(lock.read_text())} if lock.exists() else {}

    def fetch(pair):
        lat, lon = pair
        name = f'Copernicus_DSM_COG_30_N{lat:02}_00_E{lon:03}_00_DEM'
        url = f'{SOURCE}/{name}/{name}.tif'
        path = RAW / f'{name}.tif'
        if not path.exists():
            with urlopen(url, timeout=120) as response:
                content = response.read()
                if len(content) != int(response.headers['Content-Length']):
                    raise ValueError(f'Incomplete source: {name}')
            path.write_bytes(content)
        content = path.read_bytes()
        sha = digest(content)
        if name in pinned and pinned[name]['sha256'] != sha:
            raise ValueError(f'Source checksum changed: {name}')
        with rasterio.open(path) as src:
            data = src.read(1, masked=True)
            if src.crs.to_epsg() != 4326 or src.count != 1 or src.shape != (1200, 1200):
                raise ValueError(f'Unexpected source grid: {name}')
            if src.dtypes != ('float32',) or not np.all(np.isfinite(data)) or np.any(data.mask):
                raise ValueError(f'Invalid or missing source elevations: {name}')
            if not (-500 < float(data.min()) <= float(data.max()) < 9000):
                raise ValueError(f'Implausible source elevations: {name}')
            expected = (1 / 1200, 0, lon - 1 / 2400, 0, -1 / 1200, lat + 1 + 1 / 2400)
            if not np.allclose(tuple(src.transform)[:6], expected, atol=1e-10):
                raise ValueError(f'Source alignment changed: {name}')
            return {'name': name, 'url': url, 'sha256': sha, 'byte_size': len(content),
                    'retrieval_date': pinned.get(name, {}).get('retrieval_date', now()),
                    'crs': 'EPSG:4326', 'transform': list(src.transform)[:6],
                    'width': src.width, 'height': src.height, 'nodata': src.nodata,
                    'dtype': src.dtypes[0], 'min_m': float(data.min()), 'max_m': float(data.max())}

    # XYZ 5/23/13 spans 78.75–90 E and ~21.94–31.95 N. Full native tiles
    # cover it plus a halo for bilinear interpolation; these are contextual data.
    with ThreadPoolExecutor(max_workers=6) as pool:
        records = list(pool.map(fetch, [(lat, lon) for lat in range(21, 32) for lon in range(78, 91)]))
    if not pinned:
        write_json(lock, records)
    print(f'Verified {len(records)} native COG sources', flush=True)
    return records


def encode_rgb(elevation):
    if not np.all(np.isfinite(elevation)) or np.any(elevation < -500) or np.any(elevation > 9000):
        raise ValueError('Nodata or implausible elevation cannot be encoded as terrain')
    value = np.rint((elevation.astype('float64') + 10000) * 10).astype('uint32')
    return np.stack([value >> 16, (value >> 8) & 255, value & 255], axis=-1).astype('uint8')


def decode_rgb(rgb):
    value = rgb.astype('float64')
    return (value[..., 0] * 65536 + value[..., 1] * 256 + value[..., 2]) * 0.1 - 10000


def build(records):
    from .terrain_contracts import verify_terrain
    WORK.mkdir(parents=True, exist_ok=True)
    mosaic = WORK / 'analysis-native.tif'
    if not mosaic.exists():
        # An aligned Float32 mosaic retains native samples; overviews are not read.
        merge([RAW / (r['name'] + '.tif') for r in records], dst_path=mosaic,
              nodata=-32768, mem_limit=128,
              dst_kwds={'tiled': True, 'compress': 'deflate', 'predictor': 3, 'BIGTIFF': 'IF_SAFER'})
    if RELEASE.exists():
        verify_terrain(RELEASE, PUBLIC)
        expected = json.loads((RELEASE / 'qa.json').read_text())['native_mosaic']['sha256']
        if digest(mosaic.read_bytes()) != expected:
            raise ValueError('Native analysis mosaic checksum mismatch')
        print('Existing immutable terrain release and native mosaic verified', flush=True)
        return
    stage = WORK / 'release'
    if stage.exists():
        shutil.rmtree(stage)
    stage.mkdir()
    entries = {}
    checks = {}
    with rasterio.open(mosaic) as src:
        # Plausibility probes, not survey validation or peak-height measurements.
        for name, lon, lat, low, high in [('Everest vicinity', 86.925, 27.9881, 8000, 9000),
                                        ('Kathmandu valley', 85.324, 27.7172, 1100, 1600),
                                        ('Biratnagar plain', 87.27, 26.45, 30, 150)]:
            value = float(next(src.sample([(lon, lat)]))[0])
            if not low < value < high:
                raise ValueError(f'Terrain plausibility check failed: {name} = {value}')
            checks[name] = {'longitude': lon, 'latitude': lat, 'native_sample_m': value,
                            'plausibility_interval_m': [low, high]}
        for z in range(5, 10):
            scale = 2 ** (z - 5)
            size = 256 * scale
            # One aligned Web Mercator grid per zoom, then exact window splits.
            bounds = (HALF * (2 * 23 / 32 - 1), HALF * (1 - 2 * 14 / 32),
                      HALF * (2 * 24 / 32 - 1), HALF * (1 - 2 * 13 / 32))
            transform = from_bounds(*bounds, size, size)
            with WarpedVRT(src, crs='EPSG:3857', transform=transform, width=size, height=size,
                           resampling=Resampling.bilinear, nodata=-32768) as vrt:
                for row in range(scale):
                    for col in range(scale):
                        data = vrt.read(1, window=Window(col * 256, row * 256, 256, 256))
                        rgb = encode_rgb(data)
                        key = f'{z}/{23 * scale + col}/{13 * scale + row}.png'
                        path = stage / key
                        path.parent.mkdir(parents=True, exist_ok=True)
                        Image.fromarray(rgb).save(path, optimize=True)
                        content = path.read_bytes()
                        entries[key] = {'sha256': digest(content), 'byte_size': len(content)}
            print(f'Built terrain zoom {z}', flush=True)
    write_json(stage / 'tiles.json', entries)
    write_json(stage / 'sources.json', records)
    write_json(stage / 'qa.json', {'probes': checks, 'tiles': len(entries), 'native_mosaic': {
        'path': 'data/processed/terrain/analysis-native.tif', 'sha256': digest(mosaic.read_bytes()),
        'resampling': 'none; aligned native samples'}, 'display': {
        'resampling': 'bilinear', 'encoding_error_max_m': 0.05, 'nodata_cells': 0,
        'grid': 'EPSG:3857 XYZ, aligned at each zoom; full root tile 5/23/13'}})
    tile_bytes = (stage / 'tiles.json').read_bytes()
    metadata = {
        'schema_version': '2.0.0', 'dataset_id': 'nepal-terrain', 'dataset_name': 'Nepal terrain — Copernicus GLO-90',
        'dataset_version': VERSION, 'source': 'Copernicus DEM GLO-90, 2021 release; AWS COG distribution',
        'source_url': 'https://registry.opendata.aws/copernicus-dem/',
        'license': 'Copernicus WorldDEM-90 free and open licence', 'license_url': LICENSE,
        'attribution': ATTRIBUTION, 'observation_date': None, 'publication_date': None,
        'retrieval_date': max(r['retrieval_date'] for r in records), 'processing_date': now(),
        'processing_version': 'terrain/1.0.0; rasterio/1.4.4',
        'method': 'Native aligned Float32 COGs retained offline. Bilinear reprojection to aligned EPSG:3857 grids at zooms 5–9; Terrain RGB encoding to 0.1 m increments. Hillshade is derived by MapLibre for display.',
        'spatial_resolution': {'value': 90, 'unit': 'm'}, 'temporal_resolution': None,
        'spatial_coverage': {'description': 'Nepal and rectangular context buffer (XYZ root 5/23/13)',
                             'bbox': [78.75, 21.943045533438177, 90, 31.952162238024968]},
        'temporal_coverage': {'start': None, 'end': None}, 'crs': 'OGC:CRS84',
        'status': 'ATLAS_DERIVED', 'evidence_type': 'derived', 'is_fixture': False,
        'limitations': ['Digital surface model includes vegetation and buildings; not a bare-earth DTM.',
                        'Web pixels are about 270 m at 28° N at zoom 9 and coarser at overview zooms; zooming further adds no detail.',
                        '0.1 m encoding increments do not imply 0.1 m measurement accuracy. Steep summits are smoothed.',
                        'Regional plausibility checks are not independent survey validation. No local accuracy estimate is available.',
                        'No hydrological conditioning, slope/aspect analysis, hazard classification or forecast is supplied.', NOTICE],
        'uncertainty': 'Local vertical accuracy is UNKNOWN; mixed observation dates and source infill apply. Display resampling adds smoothing.',
        'update_frequency': 'static', 'stale_after': None,
        'artifact': {'path': BASE + '/tiles.json', 'format': 'TerrainRGB-index',
                     'sha256': digest(tile_bytes), 'byte_size': len(tile_bytes)},
    }
    manifest = {'metadata': metadata, 'raster': {'crs': 'EPSG:3857', 'vertical_datum': 'EGM2008 (EPSG:3855)',
                'unit': 'm', 'tile_size': 256, 'minzoom': 5, 'maxzoom': 9, 'encoding': 'mapbox',
                'nodata': None, 'native_crs': 'EPSG:4326', 'native_resolution_degree': 1 / 1200,
                'resampling': 'bilinear', 'tile_count': len(entries)}}
    write_json(stage / 'manifest.json', manifest)
    (stage / 'LICENSE.txt').write_text(ATTRIBUTION + '\n\n' + NOTICE + '\n\n' + LICENSE + '\n')
    if RELEASE.exists() or PUBLIC.exists():
        raise ValueError('Immutable release already exists; use validation or create a new version')
    verify_terrain(stage)
    shutil.copytree(stage, RELEASE)
    shutil.copytree(stage, PUBLIC)
    print(f'Published {len(entries)} tiles ({sum(x["byte_size"] for x in entries.values()) / 1048576:.1f} MiB)', flush=True)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--acquire-only', action='store_true')
    args = parser.parse_args()
    records = acquire()
    if not args.acquire_only:
        build(records)


if __name__ == '__main__':
    main()
