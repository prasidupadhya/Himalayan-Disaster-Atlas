import copy
import hashlib
import json
import tempfile
import unittest
from pathlib import Path

from jsonschema import ValidationError

from pipelines.atlas_pipeline.contracts import ROOT, validate_dataset, verify_artifact
from pipelines.atlas_pipeline.sample import run


class ContractsTest(unittest.TestCase):
    def setUp(self):
        directory = ROOT / 'data/releases/foundation-sample/1.0.0'
        self.metadata = json.loads((directory / 'manifest.json').read_text())
        self.collection = json.loads((directory / 'features.geojson').read_text())

    def reject(self):
        with self.assertRaises((ValueError, ValidationError)):
            validate_dataset(self.metadata, self.collection)

    def test_fixture_valid_and_missing_not_zero(self):
        validate_dataset(self.metadata, self.collection)
        self.assertIsNone(self.collection['features'][0]['properties']['value'])

    def test_invalid_contract_matrix(self):
        cases = json.loads((ROOT / 'tests/fixtures/invalid-cases.json').read_text())
        for case in cases:
            with self.subTest(case['name']):
                bundle = copy.deepcopy({'metadata': self.metadata, 'collection': self.collection})
                target = bundle
                for part in case['path'][:-1]:
                    target = target[part]
                target[case['path'][-1]] = case['value']
                with self.assertRaises((ValueError, ValidationError)):
                    validate_dataset(bundle['metadata'], bundle['collection'])

    def test_nonfinite_measurements(self):
        for value in (float('nan'), float('inf'), float('-inf')):
            self.collection['features'][0]['properties']['value'] = value
            self.reject()

    def test_duplicate_ids(self):
        self.collection['features'].append(self.collection['features'][0])
        self.reject()

    def test_polygon_topology(self):
        feature = self.collection['features'][0]
        for coords in [
            [[[85.7, 27.7], [86.3, 28.3], [85.7, 28.3], [86.3, 27.7], [85.7, 27.7]]],
            [[[85.7, 27.7], [86.3, 27.7], [86.3, 28.3], [85.7, 28.3]]],
        ]:
            feature['geometry'] = {'type': 'Polygon', 'coordinates': coords}
            self.reject()

    def test_all_supported_geometry_types(self):
        p = [85.8, 28.1]
        q = [86.1, 27.9]
        ring = [p, q, [86.2, 28.2], p]
        for kind, coords in [('Point', p), ('MultiPoint', [p, q]), ('LineString', [p, q]), ('MultiLineString', [[p, q]]), ('Polygon', [ring]), ('MultiPolygon', [[ring]])]:
            with self.subTest(kind):
                self.collection['features'][0]['geometry'] = {'type': kind, 'coordinates': coords}
                validate_dataset(self.metadata, self.collection)

    def test_checksum_rejects_tampering(self):
        content = (ROOT / 'data/releases/foundation-sample/1.0.0/features.geojson').read_bytes()
        verify_artifact(self.metadata, content)
        with self.assertRaises(ValueError):
            verify_artifact(self.metadata, content.replace(b'point A', b'point X'))

    def test_empty_is_valid(self):
        self.collection['features'] = []
        validate_dataset(self.metadata, self.collection)

    def test_pipeline_reproducible_and_immutable(self):
        with tempfile.TemporaryDirectory() as folder:
            root = Path(folder)
            run(root)
            output = root / 'apps/web/public/data/foundation-sample/1.0.0/features.geojson'
            first = hashlib.sha256(output.read_bytes()).hexdigest()
            run(root)
            self.assertEqual(first, hashlib.sha256(output.read_bytes()).hexdigest())
            source = root / 'changed.csv'
            source.write_text((ROOT / 'tests/fixtures/sample-source.csv').read_text().replace('point A', 'point X'))
            with self.assertRaises(ValueError):
                run(root, source)
            self.assertEqual(first, hashlib.sha256(output.read_bytes()).hexdigest())

    def test_bad_acquisition_cannot_publish(self):
        with tempfile.TemporaryDirectory() as folder:
            root = Path(folder)
            source = root / 'bad.csv'
            source.write_text((ROOT / 'tests/fixtures/sample-source.csv').read_text().replace('85.8', '285.8'))
            with self.assertRaises((ValueError, ValidationError)):
                run(root, source)
            self.assertFalse((root / 'apps/web/public/data').exists())
