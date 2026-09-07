import json
import unittest

from pipelines.atlas_pipeline.contracts import ROOT
from pipelines.atlas_pipeline.population_contracts import verify_population


class PopulationTest(unittest.TestCase):
    def test_population_keeps_native_analysis_separate_from_display_tiles(self):
        release = ROOT / "data/releases/nepal-population/1.0.0"
        public = ROOT / "apps/web/public/data/nepal-population/1.0.0"
        manifest = verify_population(release, public)
        analysis = manifest["analysis"]
        self.assertEqual(analysis["source_sha256"], "b7b581e181df5e2f84b2e20d3455429393829395619a9600e45c6907674a0639")
        self.assertEqual((analysis["width"], analysis["height"]), (9773, 4921))
        self.assertEqual(analysis["nodata"], -99999)
        self.assertEqual(analysis["valid_cells"], 5706074)
        self.assertEqual(analysis["zero_cells"], 105654)
        self.assertAlmostEqual(analysis["population_sum"], 29628159.021271188, places=3)
        self.assertEqual(manifest["raster"]["tile_count"], 485)
        self.assertIn("not numerical population counts", manifest["raster"]["display_semantics"].lower())
        qa = json.loads((release / "qa.json").read_text())
        self.assertTrue(qa["display_only"])
        self.assertEqual(qa["source_sha256"], analysis["source_sha256"])


if __name__ == "__main__":
    unittest.main()
