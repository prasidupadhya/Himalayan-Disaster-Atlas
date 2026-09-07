import gzip
import json
import unittest

from pipelines.atlas_pipeline.contracts import ROOT, validate_dataset


class EarthquakesTest(unittest.TestCase):
    def test_comcat_release_is_traceable_and_bounded(self):
        base = ROOT / 'data/releases/nepal-region-earthquakes/1.0.0'
        metadata = json.loads((base / 'manifest.json').read_text())
        collection = json.loads(gzip.decompress((base / 'features.geojson.gz').read_bytes()))
        validate_dataset(metadata, collection)
        self.assertEqual(len(collection['features']), 1273)
        self.assertEqual(len({feature['properties']['source_id'] for feature in collection['features']}), 1273)
        self.assertEqual(max(feature['properties']['magnitude'] for feature in collection['features']), 7.8)
        self.assertTrue(all(feature['properties']['epicenter_only'] for feature in collection['features']))
        self.assertLess(metadata['artifact']['byte_size'], 2_097_152)


if __name__ == '__main__':
    unittest.main()
