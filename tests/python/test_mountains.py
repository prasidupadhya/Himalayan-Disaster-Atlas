import gzip
import json
import unittest

from pipelines.atlas_pipeline.contracts import ROOT, validate_dataset


class MountainsTest(unittest.TestCase):
    def setUp(self):
        directory = ROOT / 'data/releases/nepal-mountains/1.0.0'
        self.metadata = json.loads((directory / 'manifest.json').read_text())
        self.collection = json.loads(gzip.decompress((directory / 'features.geojson.gz').read_bytes()))

    def test_release_is_valid_and_searchable(self):
        validate_dataset(self.metadata, self.collection)
        self.assertEqual(747, len(self.collection['features']))
        ids = {feature['properties']['source_id'] for feature in self.collection['features']}
        self.assertEqual(747, len(ids))
        everest = next(feature for feature in self.collection['features'] if feature['properties']['source_id'] == '1283416')
        self.assertEqual('Mount Everest', everest['properties']['name'])
        self.assertEqual(8848, everest['properties']['value'])
        self.assertEqual('m', everest['properties']['unit'])
        self.assertIn('Mount Everest', everest['properties']['search_terms'])

    def test_unknown_elevations_remain_unknown(self):
        unknown = [feature for feature in self.collection['features'] if feature['properties']['value'] is None]
        self.assertGreater(len(unknown), 600)
        self.assertTrue(all(feature['properties']['unit'] is None for feature in unknown))


if __name__ == '__main__':
    unittest.main()
