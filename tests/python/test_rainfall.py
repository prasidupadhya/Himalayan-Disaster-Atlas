import gzip
import json
import unittest

from pipelines.atlas_pipeline.contracts import ROOT, validate_dataset


class RainfallTest(unittest.TestCase):
    def test_snapshot_preserves_missing_and_quality_flags(self):
        base = ROOT / "data/releases/nepal-rainfall-stations/1.0.0"
        m = json.loads((base / "manifest.json").read_text())
        c = json.loads(gzip.decompress((base / "features.geojson.gz").read_bytes()))
        validate_dataset(m, c)
        self.assertEqual(len(c["features"]), 657)
        self.assertEqual(
            sum(f["properties"]["rainfall_24h_mm"] is not None for f in c["features"]), 453
        )
        self.assertEqual(sum(f["properties"]["rainfall_quality_warning"] for f in c["features"]), 2)
        self.assertTrue(any(f["properties"]["rainfall_24h_mm"] is None for f in c["features"]))
        self.assertLess(m["artifact"]["byte_size"], 2_097_152)


if __name__ == "__main__":
    unittest.main()
