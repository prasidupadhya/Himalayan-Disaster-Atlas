"""Pinned Mapzen context tiles for display beyond Nepal; never analytical elevations."""
import io
import json
import shutil
from concurrent.futures import ThreadPoolExecutor
from urllib.request import urlopen

import numpy as np
from PIL import Image

from .contracts import ROOT
from .terrain import digest, now, write_json

ID = 'asia-terrain-context'
VERSION = '1.0.0'
RAW = ROOT / 'data/raw/terrain-context'
RELEASE = ROOT / f'data/releases/{ID}/{VERSION}'
PUBLIC = ROOT / f'apps/web/public/data/{ID}/{VERSION}'


def main():
    RAW.mkdir(parents=True, exist_ok=True)
    lock_path = ROOT / 'pipelines/terrain-context-sources.json'
    pinned = json.loads(lock_path.read_text()) if lock_path.exists() else {}
    stage = ROOT / 'data/processed/terrain-context'
    stage.mkdir(parents=True, exist_ok=True)
    keys = [f'{z}/{x}/{y}.png' for z in range(1, 6) for x in range(2 ** (z - 1), 2 ** z) for y in range(2 ** z)]

    def fetch(key):
        url = 'https://s3.amazonaws.com/elevation-tiles-prod/terrarium/' + key
        raw = RAW / key
        if not raw.exists():
            with urlopen(url, timeout=90) as response:
                content = response.read()
                if len(content) != int(response.headers['Content-Length']):
                    raise ValueError('Incomplete context tile')
                receipt = {'url': url, 'sha256': digest(content), 'byte_size': len(content),
                           'retrieval_date': now(), 'sources': response.headers.get('x-amz-meta-sources', 'UNKNOWN')}
            raw.parent.mkdir(parents=True, exist_ok=True)
            raw.write_bytes(content)
            write_json(raw.with_suffix('.json'), receipt)
        content = raw.read_bytes()
        receipt = json.loads(raw.with_suffix('.json').read_text())
        if digest(content) != receipt['sha256'] or (key in pinned and receipt['sha256'] != pinned[key]['sha256']):
            raise ValueError('Context source changed')
        receipt = pinned.get(key, receipt)
        with Image.open(io.BytesIO(content)) as image:
            if image.size != (256, 256) or image.mode != 'RGB':
                raise ValueError('Invalid context grid')
            rgb = np.asarray(image).astype('float64')
            heights = rgb[..., 0] * 256 + rgb[..., 1] + rgb[..., 2] / 256 - 32768
            if np.any(heights < -12000) or np.any(heights > 9000):
                raise ValueError('Invalid context heights')
            # Show the sea surface, not ocean-floor relief. No context measurements are exposed.
            encoded = np.rint((np.maximum(heights, 0) + 10000) * 10).astype('uint32')
            pixels = np.stack([encoded >> 16, (encoded >> 8) & 255, encoded & 255], axis=-1).astype('uint8')
            target = stage / key
            target.parent.mkdir(parents=True, exist_ok=True)
            Image.fromarray(pixels).save(target, optimize=True)
        tile = target.read_bytes()
        return key, receipt, {'sha256': digest(tile), 'byte_size': len(tile)}

    with ThreadPoolExecutor(max_workers=8) as pool:
        results = list(pool.map(fetch, keys))
    sources = {key: receipt for key, receipt, _ in results}
    index = {key: tile for key, _, tile in results}
    if not pinned:
        write_json(lock_path, sources)
    if RELEASE.exists():
        from .terrain_contracts import verify_context
        verify_context(RELEASE, PUBLIC)
        if index != json.loads((RELEASE / 'tiles.json').read_text()):
            raise ValueError('Rebuilt context tiles differ from immutable release')
        print('Pinned context sources and rebuilt tiles match the immutable release')
        return
    write_json(stage / 'tiles.json', index)
    write_json(stage / 'sources.json', sources)
    original = json.loads((ROOT / 'data/releases/nepal-terrain/1.0.0/manifest.json').read_text())
    manifest = json.loads(json.dumps(original))
    m = manifest['metadata']
    m.update(dataset_id=ID, dataset_name='Asia overview terrain', dataset_version=VERSION,
             source='Mapzen Terrain Tiles; pinned acquisition snapshot', source_url='https://registry.opendata.aws/terrain-tiles/',
             license='Source-specific open-data terms; see attribution and source inventory',
             license_url='https://github.com/tilezen/joerd/blob/master/docs/attribution.md',
             attribution='Mapzen terrain; USGS SRTM/GMTED2010; NOAA ETOPO1; additional source notices in the terrain context licence.',
             retrieval_date=max(v['retrieval_date'] for v in sources.values()), processing_date=now(),
             processing_version='terrain-context/1.0.0',
             method='Pinned Terrarium XYZ tiles converted to Mapbox RGB at 0.1 m increments; negative elevations rendered as sea surface. Overview display only.',
             spatial_resolution={'value': None, 'unit': None},
             spatial_coverage={'description': 'Eastern hemisphere context behind the Asia-limited map', 'bbox': [0, -85.0511287798066, 180, 85.0511287798066]},
             limitations=['Overview only; source resolution and vertical references vary. Not used for elevation inspection or analysis.',
                          'Context pixels are roughly 4.3 km at 28 degrees north at zoom 5; larger zooms interpolate the same data.',
                          'Negative source heights are shown at sea level for visualization. This is not bathymetry.',
                          'Context heights are not datum-normalized to the separate Copernicus analysis dataset.'],
             uncertainty='Local accuracy and unified vertical datum are UNKNOWN. See provider documentation.',
             artifact={'path': f'/data/{ID}/{VERSION}/tiles.json', 'format': 'TerrainRGB-index',
                       'sha256': digest((stage / 'tiles.json').read_bytes()), 'byte_size': (stage / 'tiles.json').stat().st_size})
    manifest['raster'].update(minzoom=1, maxzoom=5, tile_count=len(index), vertical_datum=None,
                              native_crs='EPSG:3857', native_resolution_degree=None, resampling='none')
    write_json(stage / 'manifest.json', manifest)
    with urlopen('https://raw.githubusercontent.com/tilezen/joerd/master/docs/attribution.md', timeout=60) as response:
        notices = response.read().decode()
    (stage / 'LICENSE.txt').write_text('Mapzen Terrain Tiles context. Converted from Terrarium to Mapbox RGB; negative heights rendered as sea surface.\n\n' + notices)
    if RELEASE.exists() or PUBLIC.exists():
        raise ValueError('Immutable context release exists')
    from .terrain_contracts import verify_context
    verify_context(stage)
    shutil.copytree(stage, RELEASE)
    shutil.copytree(stage, PUBLIC)
    print(f'Published {len(index)} context tiles: {sum(v["byte_size"] for v in index.values()) / 1048576:.1f} MiB')


if __name__ == '__main__':
    main()
