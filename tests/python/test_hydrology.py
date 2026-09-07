import gzip
import json
import unittest

from pipelines.atlas_pipeline.contracts import ROOT, validate_dataset


class HydrologyTest(unittest.TestCase):
    def test_release_preserves_station_measurements_and_source_quality_flags(self):
        base = ROOT / 'data/releases/nepal-hydrology-stations/1.0.0'
        metadata = json.loads((base / 'manifest.json').read_text())
        collection = json.loads(gzip.decompress((base / 'features.geojson.gz').read_bytes()))
        validate_dataset(metadata, collection)
        self.assertEqual(len(collection['features']), 281)
        ids = {f['properties']['source_id'] for f in collection['features']}
        self.assertEqual(len(ids), 281)
        self.assertTrue(any(f['properties']['water_level_m'] is None for f in collection['features']))
        self.assertEqual(sum(not f['properties']['threshold_order_valid'] for f in collection['features']), 4)
        self.assertEqual(sum(f['properties']['coordinate_order_repaired'] for f in collection['features']), 1)
        self.assertLess(metadata['artifact']['byte_size'], 2_097_152)


if __name__ == '__main__':
    unittest.main()
