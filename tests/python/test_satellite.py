import unittest

from pipelines.atlas_pipeline.contracts import ROOT
from pipelines.atlas_pipeline.satellite_contracts import verify_satellite


class SatelliteTest(unittest.TestCase):
    def test_satellite_release_is_three_dated_low_cloud_windows(self):
        manifest = verify_satellite(
            ROOT / "data/releases/nepal-sentinel-observations/1.0.0",
            ROOT / "apps/web/public/data/nepal-sentinel-observations/1.0.0",
        )
        self.assertEqual(
            {item["id"] for item in manifest["observations"]}, {"west", "central", "east"}
        )
        self.assertTrue(all(item["cloud_percent"] <= 5 for item in manifest["observations"]))
        self.assertTrue(all(item["nodata_percent"] == 0 for item in manifest["observations"]))
        self.assertIn(
            "not continuous national coverage",
            manifest["metadata"]["spatial_coverage"]["description"],
        )


if __name__ == "__main__":
    unittest.main()
