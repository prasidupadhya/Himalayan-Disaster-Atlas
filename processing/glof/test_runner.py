"""Optional end-to-end adapter test; run in the pinned physical-model environment."""
import hashlib
import json
import tempfile
import unittest
from pathlib import Path

from .contracts import REQUIRED_EVIDENCE
from .runner import run


class PhysicalRunnerTest(unittest.TestCase):
    def test_synthetic_release_preserves_mass_and_never_claims_real_damage(self):
        import anuga
        import numpy as np
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            domain = anuga.rectangular_cross_domain(40, 4, len1=40, len2=2, origin=(500000, 3000000))
            count = len(domain.triangles)
            np.savez(root / 'mesh.npz', points=domain.get_nodes(), triangles=domain.triangles,
                     bed_m=np.zeros(count), initial_stage_m=np.where(domain.centroid_coordinates[:, 0] < 500020, 2., 0.),
                     manning_n=np.zeros(count))
            request = {'schema_version': '1.0.0', 'model': 'anuga-swe-4.0.1',
                       'scenario_type': 'instantaneous-breach', 'lake_id': None, 'is_fixture': True,
                       'evidence_type': 'MODELLED', 'real_event_validated': False,
                       'vertical_unit': 'm', 'vertical_datum': 'synthetic flat bed', 'horizontal_crs': 'EPSG:32645',
                       'boundary': 'reflective', 'duration_s': 1., 'output_interval_s': .1, 'wet_threshold_m': .01,
                       'mesh': {'path': 'mesh.npz', 'sha256': hashlib.sha256((root / 'mesh.npz').read_bytes()).hexdigest()},
                       'evidence': {key: {'source': 'Synthetic verification fixture', 'date': '2026-09-22',
                                         'license': 'MIT', 'limitations': 'Not Nepal geography'} for key in REQUIRED_EVIDENCE}}
            path = root / 'request.json'
            path.write_text(json.dumps(request))
            result = run(path, root / 'output')
            self.assertLess(abs(result['mass_residual_m3']), 1e-6)
            self.assertEqual(result['publication_status'], 'RESEARCH_ONLY')
            self.assertIsNone(result['damage'])
            self.assertIsNone(result['exposure'])
            self.assertTrue(result['is_fixture'])
            self.assertFalse(result['real_event_validated'])
            fields = root / 'output/fields.npz'
            self.assertEqual(hashlib.sha256(fields.read_bytes()).hexdigest(), result['fields_sha256'])
            with np.load(fields) as data:
                self.assertTrue(np.isfinite(data['max_depth_m']).all())
                self.assertTrue(np.any(np.isnan(data['first_wet_s'])))
            with self.assertRaisesRegex(ValueError, 'Output already exists'):
                run(path, root / 'output')
