"""Acquire only pinned source windows, outside the browser (run before data:water-change)."""
import hashlib
import json

import rasterio
from affine import Affine
from rasterio.windows import from_bounds

from .contracts import ROOT
from .satellite import verify_remote


def acquire():
    sources = json.loads((ROOT / 'pipelines/water-change-sources.json').read_text())
    with rasterio.Env(GDAL_DISABLE_READDIR_ON_OPEN='EMPTY_DIR', CPL_VSIL_CURL_ALLOWED_EXTENSIONS='.tif', GDAL_HTTP_TIMEOUT=60):
        for source in sources:
            grid = source['grid']
            native = Affine(*grid['transform'])
            bounds = rasterio.transform.array_bounds(grid['height'], grid['width'], native)
            folder = ROOT / 'data/raw/water-change' / source['scene_id']
            folder.mkdir(parents=True, exist_ok=True)
            for key, pin in source['assets'].items():
                target = folder / (key + '.tif')
                if not target.exists():
                    verify_remote(pin['url'], pin['source_etag'], pin['source_byte_size'])
                    with rasterio.open(pin['url']) as src:
                        if src.crs.to_string() != grid['crs']:
                            raise ValueError('Source CRS changed')
                        window = from_bounds(*bounds, src.transform).round_offsets().round_lengths()
                        data = src.read(window=window)
                        with rasterio.open(target, 'w', driver='GTiff', width=data.shape[2], height=data.shape[1], count=data.shape[0], dtype=data.dtype, crs=src.crs, transform=src.window_transform(window), compress='deflate') as dst:
                            dst.write(data)
                if hashlib.sha256(target.read_bytes()).hexdigest() != pin['window_sha256']:
                    raise ValueError('Source window changed or raster writer version differs')


if __name__ == '__main__':
    acquire()
