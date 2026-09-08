"""Publish pinned, conservative April water observations; never replace a release."""
import hashlib
import json
import shutil
from itertools import combinations

import numpy as np
import rasterio
from affine import Affine
from PIL import Image
from rasterio.enums import Resampling
from rasterio.warp import calculate_default_transform, reproject, transform

from processing.water_change.engine import METHOD, classify, compare, reflectance_20m

from .contracts import ROOT

BASE = '/data/phewa-water-change/1.0.0/'
STAMP = '2026-09-08T07:32:00Z'


def write_json(path, value):
    path.write_text(json.dumps(value, sort_keys=True, separators=(',', ':'), allow_nan=False) + '\n')


def build():
    from .water_change_contracts import verify_water_change
    release = ROOT / ('data/releases' + BASE[5:])
    public = ROOT / ('apps/web/public' + BASE)
    if release.exists():
        verify_water_change(release, public)
        return
    sources = json.loads((ROOT / 'pipelines/water-change-sources.json').read_text())
    grid = sources[0]['grid']
    if any(source['grid'] != grid for source in sources):
        raise ValueError('Source windows are not on the same grid')
    stage = ROOT / 'data/staging/phewa-water-change'
    stage.mkdir(parents=True, exist_ok=True)
    for old in stage.iterdir():
        old.unlink()
    native = Affine(*grid['transform'])
    width, height = grid['width'], grid['height']
    bounds = rasterio.transform.array_bounds(height, width, native)
    display, dw, dh = calculate_default_transform(grid['crs'], 'EPSG:3857', width, height, *bounds)
    left, bottom, right, top = rasterio.transform.array_bounds(dh, dw, display)
    lon, lat = transform('EPSG:3857', 'EPSG:4326', [left, right, right, left], [top, top, bottom, bottom])
    coordinates = list(map(list, zip(lon, lat, strict=True)))

    def artifact(name):
        content = (stage / name).read_bytes()
        return {'path': BASE + name, 'sha256': hashlib.sha256(content).hexdigest(), 'byte_size': len(content)}

    def png(name, array):
        Image.fromarray(array).save(stage / name, optimize=True)
        return artifact(name)

    def preview(name, array, palette=None):
        result = np.zeros((dh, dw), dtype='uint8') if array.ndim == 2 else np.zeros((array.shape[0], dh, dw), dtype='uint8')
        reproject(array, result, src_transform=native, src_crs=grid['crs'], dst_transform=display, dst_crs='EPSG:3857', resampling=Resampling.nearest)
        return png(name, np.array(palette, dtype='uint8')[result] if palette else np.moveaxis(result, 0, -1))

    observations, masks = [], {}
    for source in sources:
        arrays = {}
        for key, pin in source['assets'].items():
            path = ROOT / 'data/raw/water-change' / source['scene_id'] / (key + '.tif')
            if hashlib.sha256(path.read_bytes()).hexdigest() != pin['window_sha256']:
                raise ValueError('Pinned input window checksum mismatch')
            with rasterio.open(path) as raster:
                factor = 1 if key == 'scl' else 2
                if raster.crs.to_string() != grid['crs'] or raster.transform != native * Affine.scale(1 / factor) or raster.shape != (height * factor, width * factor):
                    raise ValueError('Source raster alignment mismatch')
                arrays[key] = raster.read() if key == 'visual' else raster.read(1)
        green, gv = reflectance_20m(arrays['green'], **{k: source['assets']['green'][k] for k in ['scale', 'offset']})
        nir, nv = reflectance_20m(arrays['nir'], **{k: source['assets']['nir'][k] for k in ['scale', 'offset']})
        mask, quality = classify(green, nir, arrays['scl'], gv & nv)
        date = source['acquired_at'][:10]
        masks[date] = mask
        # TCI 2x2 area mean is solely a visual aid, never an analytical input.
        rgb = arrays['visual'].reshape(3, height, 2, width, 2).mean(axis=(2, 4)).astype('uint8')
        observations.append({'id': date, 'acquired_at': source['acquired_at'], 'published_at': source['published_at'], 'scene_id': source['scene_id'], 'platform': source['platform'],
                             'valid_fraction': float((mask > 0).mean()), 'water_km2': float((mask == 2).sum()) * .0004,
                             'classification': png(date + '-mask.png', mask), 'quality': png(date + '-quality.png', quality),
                             'water': preview(date + '-water.png', mask, [[137, 137, 137, 110], [0, 0, 0, 0], [38, 152, 238, 240]]),
                             'quality_preview': preview(date + '-quality-preview.png', quality, [[0, 0, 0, 0], [115, 115, 115, 210], [180, 180, 180, 210], [225, 178, 77, 210], [180, 120, 215, 210]]),
                             'true_colour': preview(date + '-rgb.png', rgb)})
    comparisons = []
    for before, after in combinations(observations, 2):
        change, stats = compare(masks[before['id']], masks[after['id']], grid, grid)
        prefix = before['id'] + '-' + after['id']
        comparisons.append({'before': before['id'], 'after': after['id'], **stats,
                            'classification': png(prefix + '-change-mask.png', change),
                            'preview': preview(prefix + '-change.png', change, [[137, 137, 137, 110], [0, 0, 0, 0], [38, 152, 238, 220], [57, 221, 142, 255], [244, 140, 55, 255]])})
    limitations = ['Phewa Lake observation window only; not Nepal-wide water coverage.', 'Mapped open-water candidates require NDWI > 0.05 and SCL water. Land requires NDWI < -0.05 and non-water SCL. All other pixels are UNKNOWN.', 'Cloud, shadow, snow, defective, unclassified and NoData pixels plus a 20 m buffer are excluded. SCL and index errors can remain.', 'Minimum mapped water patch is 9 eight-connected 20 m cells (0.0036 km²). Narrow rivers and small ponds may be absent.', 'April observations differ in day, year, sensor and conditions. Gain/loss is a classification difference, not a causal claim, flood footprint, trend or forecast.', 'Only pixels valid on both dates contribute. Area is partial mapped area, not total lake area; comparisons below 80% jointly valid coverage of either the full window or the union of mapped water are unavailable.', 'No independent ground-truth accuracy estimate or confidence interval is available.']
    write_json(stage / 'observations.json', {'observations': observations, 'comparisons': comparisons})
    metadata = {'schema_version': '4.0.0', 'dataset_id': 'phewa-water-change', 'dataset_name': 'Phewa Lake April mapped-water comparison', 'dataset_version': '1.0.0',
                'source': 'Copernicus Sentinel-2 Collection 1 L2A via Element 84 Earth Search', 'source_url': 'https://earth-search.aws.element84.com/v1/collections/sentinel-2-c1-l2a',
                'license': 'Copernicus Sentinel Data Legal Notice', 'license_url': 'https://cds.climate.copernicus.eu/licences/ec-sentinel', 'attribution': 'Contains modified Copernicus Sentinel data (2024, 2025, 2026).',
                'observation_date': None, 'publication_date': None, 'retrieval_date': STAMP, 'processing_date': STAMP, 'processing_version': METHOD, 'method': 'Calibrated B03/B08 reflectance averaged to aligned 20 m cells; conservative NDWI/SCL agreement, quality buffering and 9-cell MMU; paired valid pixels only.',
                'spatial_resolution': {'value': 20, 'unit': 'm'}, 'temporal_resolution': 'irregular April snapshots', 'spatial_coverage': {'description': 'Phewa Lake and surroundings, Pokhara; snapped UTM window', 'bbox': [min(lon), min(lat), max(lon), max(lat)]},
                'temporal_coverage': {'start': observations[0]['acquired_at'], 'end': observations[-1]['acquired_at']}, 'crs': 'OGC:CRS84', 'status': 'ATLAS_DERIVED', 'evidence_type': 'derived', 'is_fixture': False,
                'limitations': limitations, 'uncertainty': 'UNKNOWN numerical accuracy; categorical exclusion masks supplied. Shoreline and cross-sensor differences remain.', 'update_frequency': 'static', 'stale_after': None, 'artifact': artifact('observations.json')}
    manifest = {'metadata': metadata, 'method': METHOD, 'grid': grid, 'coordinates': coordinates, 'observations': observations, 'comparisons': comparisons}
    write_json(stage / 'manifest.json', manifest)
    write_json(stage / 'sources.json', {'sources': sources, 'verification': 'SHA-256 of exact downloaded raster windows; remote object checksum is STAC-declared, not a local full-object verification.', 'reflectance': 'DN * 0.0001 - 0.1; raw DN 0 excluded before averaging.'})
    write_json(stage / 'qa.json', {'grid_equal': True, 'pixels': width * height, 'observation_coverage': {o['id']: o['valid_fraction'] for o in observations}, 'comparisons': [{k: v for k, v in pair.items() if k not in ['classification', 'preview']} for pair in comparisons], 'independent_accuracy': None})
    (stage / 'LICENSE.txt').write_text('Contains modified Copernicus Sentinel data (2024, 2025, 2026).\nCopernicus Sentinel Data Legal Notice: https://cds.climate.copernicus.eu/licences/ec-sentinel\nNo endorsement. Data supplied without warranty.\n')
    verify_water_change(stage)
    release.parent.mkdir(parents=True, exist_ok=True)
    shutil.copytree(stage, release)
    shutil.copytree(stage, public)
    verify_water_change(release, public)
    print(json.dumps(json.loads((stage / 'qa.json').read_text()), indent=2))


if __name__ == '__main__':
    build()
