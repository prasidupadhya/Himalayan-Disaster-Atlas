import gzip
import json
import unittest

from pipelines.atlas_pipeline.contracts import ROOT, validate_dataset

IDS = ["2015-2016", "2017-2018", "2019-2020", "2021-2022", "2023", "2024", "2025", "2026"]


class DisasterEventsTest(unittest.TestCase):
    def test_archive_complete_unique_and_bounded(self):
        total = 0
        ids = set()
        for period in IDS:
            base = ROOT / f"data/releases/nepal-disaster-events-{period}/1.0.0"
            m = json.loads((base / "manifest.json").read_text())
            content = (base / "features.geojson.gz").read_bytes()
            c = json.loads(gzip.decompress(content))
            validate_dataset(m, c)
            self.assertLess(len(content), 2_097_152)
            self.assertLess(len(gzip.decompress(content)), 8_388_608)
            total += len(c["features"])
            for f in c["features"]:
                self.assertNotIn(f["id"], ids)
                ids.add(f["id"])
        self.assertEqual(total, 57216)
        self.assertEqual(len(ids), 57216)


if __name__ == "__main__":
    unittest.main()
