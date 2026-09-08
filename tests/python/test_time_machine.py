import unittest

from pipelines.atlas_pipeline.contracts import ROOT
from pipelines.atlas_pipeline.time_machine import verify_time_index


class TimeMachineTest(unittest.TestCase):
    def test_index_reproduces_dates_and_counts_from_versioned_inputs(self):
        index = verify_time_index(ROOT / 'data/releases/atlas-time-index/1.0.0', ROOT / 'apps/web/public/data/atlas-time-index/1.0.0')
        products = {p['id']: p for p in index['products']}
        self.assertEqual(len(products['climate']['observations']), 360)
        self.assertEqual(sum(o['count'] for o in products['events']['observations']), 57216)
        self.assertEqual(len(products['water']['observations']), 3)
        for product in products.values():
            dates = [o['start'] for o in product['observations']]
            self.assertEqual(dates, sorted(set(dates)))
        self.assertTrue(all(o['compatibility'] is None for o in products['satellite']['observations']))
