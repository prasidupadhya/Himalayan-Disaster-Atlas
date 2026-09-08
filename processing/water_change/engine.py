"""Conservative Sentinel-2 mapped open-water candidates on a shared 20 m grid."""
import numpy as np
from rasterio.features import sieve

METHOD = 'ndwi-scl-water/1.0.0'


def reflectance_20m(dn, scale, offset):
    if dn.ndim != 2 or dn.shape[0] % 2 or dn.shape[1] % 2:
        raise ValueError('10 m band must align exactly to 2x2 blocks on the 20 m grid')
    blocks = dn.reshape(dn.shape[0] // 2, 2, dn.shape[1] // 2, 2)
    valid = (blocks != 0).all(axis=(1, 3))
    return blocks.astype('float64').mean(axis=(1, 3)) * scale + offset, valid


def classify(green, nir, scl, valid, minimum_pixels=9):
    if not (green.shape == nir.shape == scl.shape == valid.shape):
        raise ValueError('Misaligned observation bands')
    # Quality: 0 valid; 1 source/SCL excluded; 2 one-cell exclusion buffer;
    # 3 uncertain reflectance/index or disagreement; 4 sub-MMU water.
    excluded = ~valid | ~np.isin(scl, [4, 5, 6])
    pad = np.pad(excluded, 1, constant_values=True)
    buffered = np.logical_or.reduce([pad[r:r + scl.shape[0], c:c + scl.shape[1]] for r in range(3) for c in range(3)])
    good = ~buffered & np.isfinite(green) & np.isfinite(nir) & (green >= 0) & (nir >= 0) & (green + nir > 0)
    ndwi = np.divide(green - nir, green + nir, out=np.full(green.shape, np.nan), where=green + nir > 0)
    water = good & (ndwi > 0.05) & (scl == 6)
    land = good & (ndwi < -0.05) & (scl != 6)
    retained = sieve(water.astype('uint8'), size=minimum_pixels, connectivity=8).astype(bool) & water
    small = water & ~retained
    classes = np.zeros(scl.shape, dtype='uint8')
    classes[land] = 1
    classes[retained] = 2
    quality = np.full(scl.shape, 3, dtype='uint8')
    quality[classes > 0] = 0
    quality[small] = 4
    quality[buffered] = 2
    quality[excluded] = 1
    return classes, quality


def compare(before, after, before_grid, after_grid, minimum_coverage=0.8):
    if before_grid != after_grid or before.shape != after.shape:
        raise ValueError('Water observations require exactly the same CRS, transform, resolution and dimensions')
    if not np.isin(before, [0, 1, 2]).all() or not np.isin(after, [0, 1, 2]).all():
        raise ValueError('Invalid water mask classes')
    if before_grid.get('crs') != 'EPSG:32644' or before_grid.get('transform', [])[:2] != [20, 0] or before_grid['transform'][3:5] != [0, -20]:
        raise ValueError('Water area requires the native 20 m UTM grid')
    valid = (before > 0) & (after > 0)
    # 0 unknown; 1 persistent land; 2 persistent water; 3 water gain; 4 water loss.
    change = np.zeros(before.shape, dtype='uint8')
    change[valid & (before == 1) & (after == 1)] = 1
    change[valid & (before == 2) & (after == 2)] = 2
    change[valid & (before == 1) & (after == 2)] = 3
    change[valid & (before == 2) & (after == 1)] = 4
    counts = {str(code): int(np.count_nonzero(change == code)) for code in range(5)}
    coverage = float(valid.mean())
    water_domain = (before == 2) | (after == 2)
    water_coverage = float(valid[water_domain].mean()) if water_domain.any() else None
    available = coverage >= minimum_coverage and water_coverage is not None and water_coverage >= minimum_coverage
    return change, {'available': available, 'comparable_fraction': coverage, 'water_comparable_fraction': water_coverage, 'pixel_counts': counts,
                    'gain_km2': counts['3'] * 0.0004 if available else None,
                    'loss_km2': counts['4'] * 0.0004 if available else None,
                    'persistence_km2': counts['2'] * 0.0004 if available else None}
