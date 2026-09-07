import gzip
import json
import unittest

from pipelines.atlas_pipeline.admin_boundaries import category
from pipelines.atlas_pipeline.contracts import ROOT, validate_dataset


class AdministrativeBoundariesTest(unittest.TestCase):
    def load(self, dataset_id):
        directory = ROOT / f'data/releases/{dataset_id}/2.0.0'
        metadata = json.loads((directory / 'manifest.json').read_text())
        collection = json.loads(gzip.decompress((directory / 'features.geojson.gz').read_bytes()))
        validate_dataset(metadata, collection)
        return metadata, collection

    def test_release_hierarchy_and_categories(self):
        expected = {
            'nepal-admin-country': 1,
            'nepal-admin-provinces': 7,
            'nepal-admin-districts': 77,
            'nepal-admin-local-levels': 775,
        }
        parent_ids = set()
        releases = []
        for dataset_id, count in expected.items():
            metadata, collection = self.load(dataset_id)
            self.assertEqual(count, len(collection['features']))
            self.assertEqual('OGC:CRS84', metadata['crs'])
            self.assertFalse(metadata['is_fixture'])
            releases.append(collection)
        for level, collection in enumerate(releases):
            ids = {feature['properties']['pcode'] for feature in collection['features']}
            self.assertEqual(len(ids), len(collection['features']))
            if level:
                self.assertTrue(all(feature['properties']['parent_pcode'] in parent_ids for feature in collection['features']))
            parent_ids = ids
        categories = [feature['properties']['admin_category'] for feature in releases[3]['features']]
        self.assertEqual(753, categories.count('local_level'))
        self.assertEqual(22, categories.count('special_area'))

    def test_qa_report_records_coverage_and_neighbors(self):
        report = json.loads((ROOT / 'data/releases/nepal-admin-boundaries/2.0.0/qa.json').read_text())
        for level in ('0', '1', '2', '3'):
            self.assertTrue(report['levels'][level]['coverage_valid'])
        self.assertLess(report['levels']['3']['country_symmetric_difference_ratio'], 1e-8)
        self.assertGreaterEqual(report['levels']['3']['minimum_neighbors'], 1)

    def test_special_area_suffix_mapping(self):
        self.assertEqual('country', category(0, 'NP'))
        self.assertEqual('local_level', category(3, 'NP0101301'))
        self.assertEqual('special_area', category(3, 'NP0101395'))


if __name__ == '__main__':
    unittest.main()
