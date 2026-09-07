import gzip
import json
import unittest

from pipelines.atlas_pipeline.contracts import ROOT, validate_dataset


class HydropowerTest(unittest.TestCase):
    def test_osm_hydropower_snapshot_preserves_ids_and_capacity_units(self):
        base = ROOT / 'data/releases/nepal-osm-hydropower/1.0.0'
        metadata = json.loads((base / 'manifest.json').read_text())
        collection = json.loads(gzip.decompress((base / 'features.geojson.gz').read_bytes()))
        validate_dataset(metadata, collection)
        self.assertEqual(len(collection['features']), 45)
        self.assertEqual(len({feature['properties']['source_id'] for feature in collection['features']}), 45)
        known = [feature for feature in collection['features'] if feature['properties']['capacity_mw'] is not None]
        self.assertEqual(len(known), 25)
        self.assertTrue(all(feature['properties']['unit'] == 'MW' for feature in known))
        self.assertEqual(max(feature['properties']['capacity_mw'] for feature in known), 456)
        self.assertLess(metadata['artifact']['byte_size'], 2_097_152)


if __name__ == '__main__':
    unittest.main()
