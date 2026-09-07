import gzip
import json
import unittest

from pipelines.atlas_pipeline.contracts import ROOT, validate_dataset


class RiversTest(unittest.TestCase):
    def load(self, dataset_id):
        directory = ROOT / f'data/releases/{dataset_id}/1.0.0'
        metadata = json.loads((directory / 'manifest.json').read_text())
        collection = json.loads(gzip.decompress((directory / 'features.geojson.gz').read_bytes()))
        validate_dataset(metadata, collection)
        return metadata, collection

    def test_network_partitions_preserve_connectivity(self):
        releases = [self.load('nepal-rivers-primary'), self.load('nepal-rivers-headwaters')]
        features = [feature for _, collection in releases for feature in collection['features']]
        self.assertEqual(18299, len(features))
        ids = {feature['properties']['source_id'] for feature in features}
        self.assertEqual(len(features), len(ids))
        self.assertEqual(18110, sum(feature['properties']['downstream_id'] in ids for feature in features))
        self.assertEqual(189, sum(feature['properties']['downstream_id'] not in ids for feature in features))
        self.assertTrue(all(feature['properties']['downstream_id'] != feature['properties']['source_id'] for feature in features))

    def test_browser_partitions_stay_within_geojson_budget(self):
        for dataset_id in ('nepal-rivers-primary', 'nepal-rivers-headwaters'):
            content = (ROOT / f'data/releases/{dataset_id}/1.0.0/features.geojson.gz').read_bytes()
            self.assertLessEqual(len(content), 2_097_152)
            self.assertLessEqual(len(gzip.decompress(content)), 8_388_608)

    def test_representative_reach_keeps_source_topology(self):
        _, primary = self.load('nepal-rivers-primary')
        reach = next(feature for feature in primary['features'] if feature['properties']['source_id'] == '40669746')
        self.assertEqual('40670088', reach['properties']['downstream_id'])
        self.assertTrue(reach['properties']['downstream_in_release'])
        self.assertEqual(6, reach['properties']['flow_order'])
        self.assertEqual(2.121, reach['properties']['average_discharge_m3s'])
        self.assertIsNone(reach['properties']['river_name'])


if __name__ == '__main__':
    unittest.main()
