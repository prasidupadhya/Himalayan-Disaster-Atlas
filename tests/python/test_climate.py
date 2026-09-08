import unittest

from pipelines.atlas_pipeline.climate_contracts import verify_climate
from pipelines.atlas_pipeline.contracts import ROOT


class ClimateTest(unittest.TestCase):
    def test_climate_release_preserves_monthly_reanalysis_semantics(self):
        manifest = verify_climate(
            ROOT / "data/releases/nepal-power-climate/1.0.0",
            ROOT / "apps/web/public/data/nepal-power-climate/1.0.0",
        )
        self.assertEqual(manifest["product"]["product_type"], "reanalysis-derived")
        self.assertEqual(manifest["product"]["source_model"], "MERRA-2")
        self.assertEqual(
            manifest["product"]["native_grid"],
            {"latitude_degrees": 0.5, "longitude_degrees": 0.625},
        )
        self.assertEqual(manifest["product"]["contributing_grid_cells"], 66)
        self.assertEqual(len(manifest["series"]), 360)
        self.assertEqual(len(manifest["normals"]), 12)
        self.assertEqual({item["year"] for item in manifest["series"]}, set(range(1991, 2021)))
        self.assertTrue(all(item["coverage_percent"] == 100 for item in manifest["series"]))
        self.assertTrue(all(item["precipitation_mm_day"] >= 0 for item in manifest["series"]))
        variables = {item["id"]: item for item in manifest["product"]["variables"]}
        self.assertEqual(variables["T2M"]["published_unit"], "degC")
        self.assertEqual(variables["PRECTOTCORR"]["published_unit"], "mm/day")


if __name__ == "__main__":
    unittest.main()
