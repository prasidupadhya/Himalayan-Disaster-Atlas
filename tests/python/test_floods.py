import gzip
import json
import unittest

from pipelines.atlas_pipeline.contracts import ROOT, validate_dataset


class FloodsTest(unittest.TestCase):
    def test_reported_flood_release_never_claims_footprints(self):
        base = ROOT / 'data/releases/nepal-reported-floods/1.0.0'
        metadata = json.loads((base / 'manifest.json').read_text())
        collection = json.loads(gzip.decompress((base / 'features.geojson.gz').read_bytes()))
        validate_dataset(metadata, collection)
        self.assertEqual(len(collection['features']), 2407)
        self.assertTrue(all(feature['properties']['evidence_status'] == 'reported' for feature in collection['features']))
        self.assertTrue(all(feature['properties']['hazard_footprint'] is False for feature in collection['features']))
        self.assertLess(metadata['artifact']['byte_size'], 2_097_152)


if __name__ == '__main__':
    unittest.main()
