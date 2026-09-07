import unittest

import numpy as np

from pipelines.atlas_pipeline.terrain import decode_rgb, encode_rgb


class TerrainEncodingTests(unittest.TestCase):
    def test_high_low_negative_and_zero_samples(self):
        values = np.array([[-400, 0, 70.412, 1303.87, 8723.73, 8999.99]])
        np.testing.assert_allclose(decode_rgb(encode_rgb(values)), values, atol=0.050001)

    def test_missing_cells_are_rejected_not_relabelled_as_zero(self):
        for value in [np.nan, np.inf, -32768, 10000]:
            with self.assertRaises(ValueError):
                encode_rgb(np.array([[value]]))

    def test_tile_splitting_preserves_shared_grid_and_extreme_gradients(self):
        surface = np.linspace(0, 8800, 512 * 256).reshape(256, 512)
        whole = encode_rgb(surface)
        split = np.concatenate([encode_rgb(surface[:, :256]), encode_rgb(surface[:, 256:])], axis=1)
        np.testing.assert_array_equal(whole, split)
