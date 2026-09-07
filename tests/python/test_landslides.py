import gzip
import json
import unittest

from pipelines.atlas_pipeline.contracts import ROOT, validate_dataset


class LandslidesTest(unittest.TestCase):
    def test_reported_landslide_release_does_not_invent_confidence(self):
        base = ROOT / 'data/releases/nepal-reported-landslides/1.0.0'
        metadata = json.loads((base / 'manifest.json').read_text())
        collection = json.loads(gzip.decompress((base / 'features.geojson.gz').read_bytes()))
        validate_dataset(metadata, collection)
        self.assertEqual(len(collection['features']), 5742)
        self.assertTrue(all(feature['properties']['confidence'] is None for feature in collection['features']))
        self.assertTrue(all(feature['properties']['susceptibility_output'] is False for feature in collection['features']))
        self.assertEqual(len({feature['id'] for feature in collection['features']}), 5742)
        self.assertLess(metadata['artifact']['byte_size'], 2_097_152)


if __name__ == '__main__':
    unittest.main()
