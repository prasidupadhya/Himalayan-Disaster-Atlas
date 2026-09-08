import unittest

import numpy as np

from processing.water_change.engine import classify, compare, reflectance_20m

GRID = {'crs': 'EPSG:32644', 'transform': [20, 0, 0, 0, -20, 0], 'width': 12, 'height': 12}


class WaterChangeTests(unittest.TestCase):
    def test_calibration_and_nodata_before_averaging(self):
        dn = np.array([[2000, 2000], [2000, 0]])
        reflectance, valid = reflectance_20m(dn, .0001, -.1)
        self.assertAlmostEqual(reflectance[0, 0], .05)
        self.assertFalse(valid[0, 0])
        with self.assertRaises(ValueError):
            reflectance_20m(np.ones((3, 4)), .0001, -.1)

    def test_cloud_shadow_snow_and_small_water_are_unknown(self):
        scl = np.full((24, 24), 4, dtype='uint8')
        g, n = np.full(scl.shape, .1), np.full(scl.shape, .4)
        scl[3:9, 3:9] = 6
        g[3:9, 3:9], n[3:9, 3:9] = .4, .1
        scl[15, 15] = 6
        g[15, 15], n[15, 15] = .4, .1
        for col, code in zip(range(3, 10), [0, 2, 3, 8, 9, 10, 11], strict=True):
            scl[12, col] = code
        mask, quality = classify(g, n, scl, np.ones(scl.shape, dtype=bool))
        self.assertTrue((mask[4:8, 4:8] == 2).all())
        self.assertTrue((mask[11:14, 2:11] == 0).all())
        self.assertEqual(mask[15, 15], 0)
        self.assertEqual(quality[15, 15], 4)

    def test_change_only_on_jointly_valid_pixels(self):
        before = np.ones((12, 12), dtype='uint8')
        after = before.copy()
        before[0, :6] = [2, 2, 0, 2, 2, 2]
        after[0, :6] = [2, 1, 2, 2, 2, 2]
        after[1, 0] = 2
        _, result = compare(before, after, GRID, GRID)
        self.assertEqual(result['gain_km2'], .0004)
        self.assertEqual(result['loss_km2'], .0004)
        self.assertEqual(result['persistence_km2'], .0016)
        after[:] = 0
        _, missing = compare(before, after, GRID, GRID)
        self.assertFalse(missing['available'])
        self.assertIsNone(missing['gain_km2'])
        with self.assertRaises(ValueError):
            compare(before, after, GRID, {**GRID, 'crs': 'EPSG:32645'})
