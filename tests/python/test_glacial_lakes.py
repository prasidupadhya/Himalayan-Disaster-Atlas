import gzip
import json
import unittest

from pipelines.atlas_pipeline.contracts import ROOT, validate_dataset


class GlacialLakesTest(unittest.TestCase):
    def load(self):
        directory = ROOT / "data/releases/nepal-transboundary-glacial-lakes/1.0.0"
        metadata = json.loads((directory / "manifest.json").read_text())
        decoded = gzip.decompress((directory / "features.geojson.gz").read_bytes())
        collection = json.loads(decoded)
        validate_dataset(metadata, collection)
        return metadata, collection, decoded

    def test_release_is_complete_traceable_and_bounded(self):
        metadata, collection, decoded = self.load()
        self.assertEqual(4150, len(collection["features"]))
        self.assertEqual("SATELLITE_DERIVED", metadata["status"])
        self.assertEqual("derived", metadata["evidence_type"])
        self.assertEqual("OGC:CRS84", metadata["crs"])
        self.assertEqual(10, metadata["spatial_resolution"]["value"])
        self.assertLess(len(decoded), 8_388_608)
        ids = {feature["properties"]["source_id"] for feature in collection["features"]}
        self.assertEqual(4150, len(ids))

    def test_country_connectivity_and_change_statistics_match_qa(self):
        _, collection, _ = self.load()
        features = collection["features"]
        countries = {country: sum(f["properties"]["country"] == country for f in features) for country in ("Nepal", "China", "India")}
        self.assertEqual({"Nepal": 2347, "China": 1745, "India": 58}, countries)
        self.assertEqual(2535, sum(f["properties"]["connectivity"] == "Glacier-fed" for f in features))
        self.assertEqual(1615, sum(f["properties"]["connectivity"] == "Non Glacier-fed" for f in features))
        self.assertEqual(4144, sum(f["properties"]["expansion_rate_km2_per_year"] is not None for f in features))
        self.assertEqual(367, sum(f["properties"]["expansion_significant"] is True for f in features))

    def test_representative_record_keeps_source_values_without_hazard_inference(self):
        _, collection, _ = self.load()
        record = next(f for f in collection["features"] if f["properties"]["source_id"] == "GLO_87.08864_27.79792")
        props = record["properties"]
        self.assertEqual("Nepal", props["country"])
        self.assertEqual("Koshi", props["basin"])
        self.assertEqual("Glacier-fed", props["connectivity"])
        self.assertAlmostEqual(2.4768353525, props["area_km2"], places=8)
        self.assertAlmostEqual(0.082, props["expansion_rate_km2_per_year"], places=6)
        self.assertAlmostEqual(0.0132, props["expansion_uncertainty_km2_per_year"], places=6)
        self.assertTrue(props["expansion_significant"])
        self.assertIsNone(props["lake_name"])
        self.assertNotIn("hazard", props)
        self.assertEqual([87.08864, 27.79792], record["geometry"]["coordinates"])

    def test_float32_elevation_rounding_is_preserved_with_small_tolerance(self):
        _, collection, _ = self.load()
        record = next(f for f in collection["features"] if f["properties"]["source_id"] == "GLO_82.02553_29.97717")
        props = record["properties"]
        self.assertLess(abs(props["elevation_min_m"] - props["elevation_mean_m"]), 1)
        self.assertEqual(0.0, props["expansion_rate_km2_per_year"])
        self.assertIsNone(props["expansion_significant"])


if __name__ == "__main__":
    unittest.main()
