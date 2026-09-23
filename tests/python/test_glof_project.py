import hashlib
import tempfile
import unittest
from pathlib import Path

from processing.glof.contracts import REQUIRED_EVIDENCE, validate_request
from processing.glof.inventory import inventory


class GlofProjectTest(unittest.TestCase):
    def request(self, root):
        mesh = root / 'mesh.npz'
        mesh.write_bytes(b'contract test only; solver validates actual arrays')
        return {'schema_version': '1.0.0', 'model': 'anuga-swe-4.0.1',
                'scenario_type': 'instantaneous-breach', 'lake_id': None, 'is_fixture': True,
                'evidence_type': 'MODELLED', 'real_event_validated': False,
                'vertical_unit': 'm', 'vertical_datum': 'synthetic', 'boundary': 'reflective',
                'duration_s': 10, 'output_interval_s': 1, 'wet_threshold_m': .01,
                'mesh': {'path': 'mesh.npz', 'sha256': hashlib.sha256(mesh.read_bytes()).hexdigest()},
                'evidence': {key: {'source': 'Synthetic fixture', 'date': '2026-09-22',
                                  'license': 'MIT', 'limitations': 'Not real geography'}
                             for key in REQUIRED_EVIDENCE}}

    def test_missing_evidence_nonfinite_and_false_identity_are_rejected(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            self.assertEqual(validate_request(self.request(root), root), (root / 'mesh.npz').resolve())
            for field, value in [('duration_s', float('nan')), ('output_interval_s', 20),
                                 ('boundary', 'assumed'), ('real_event_validated', True),
                                 ('lake_id', 'GLO_fake'), ('vertical_unit', 'feet')]:
                req = self.request(root)
                req[field] = value
                with self.subTest(field=field), self.assertRaises(ValueError):
                    validate_request(req, root)
            req = self.request(root)
            del req['evidence']['bathymetry']
            with self.assertRaises(ValueError):
                validate_request(req, root)
            req = self.request(root)
            req['mesh']['sha256'] = '0' * 64
            with self.assertRaises(ValueError):
                validate_request(req, root)

    def test_transboundary_inventory_does_not_invent_outlets_or_impacts(self):
        records = inventory()['lakes']
        self.assertEqual(len(records), 4150)
        self.assertEqual(len({r['lake_id'] for r in records}), 4150)
        self.assertEqual({r['country'] for r in records}, {'Nepal', 'China', 'India'})
        for record in records:
            self.assertIsNone(record['verified_outlet_to_nepal'])
            self.assertIsNone(record['damage'])
            self.assertIsNone(record['inundation'])
            self.assertEqual(record['missing_evidence'], list(REQUIRED_EVIDENCE))
