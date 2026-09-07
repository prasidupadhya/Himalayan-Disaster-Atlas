import gzip
import json
import unittest

from pipelines.atlas_pipeline.contracts import ROOT, validate_dataset


class GlaciersTest(unittest.TestCase):
    def load(self, dataset_id):
        directory = ROOT / f"data/releases/{dataset_id}/1.0.0"
        metadata = json.loads((directory / "manifest.json").read_text())
        collection = json.loads(gzip.decompress((directory / "features.geojson.gz").read_bytes()))
        validate_dataset(metadata, collection)
        return metadata, collection

    def test_inventory_partitions_are_valid_and_complete(self):
        expected = {
            "nepal-glaciers-west": 2786,
            "nepal-glaciers-central": 815,
            "nepal-glaciers-east": 992,
        }
        ids = set()
        total = 0
        for dataset_id, count in expected.items():
            metadata, collection = self.load(dataset_id)
            self.assertEqual(count, len(collection["features"]))
            self.assertEqual("VERIFIED_SOURCE", metadata["status"])
            self.assertEqual("OGC:CRS84", metadata["crs"])
            self.assertLess(len(gzip.decompress((ROOT / f"data/releases/{dataset_id}/1.0.0/features.geojson.gz").read_bytes())), 8_388_608)
            for feature in collection["features"]:
                source_id = feature["properties"]["source_id"]
                self.assertNotIn(source_id, ids)
                ids.add(source_id)
            total += len(collection["features"])
        self.assertEqual(4593, total)

    def test_dated_inventory_metadata_is_preserved(self):
        _, east = self.load("nepal-glaciers-east")
        record = next(feature for feature in east["features"] if feature["properties"]["source_id"] == "RGI2000-v7.0-G-15-06763")
        props = record["properties"]
        self.assertEqual("Imja/Lhotse Shar Gl.", props["glacier_name"])
        self.assertEqual("glacier", props["entity_type"])
        self.assertTrue(props["glims_id"].startswith("G"))
        self.assertGreater(props["area_km2"], 17)
        self.assertLess(props["area_km2"], 18)
        self.assertRegex(props["outline_date"], r"^\d{4}-\d{2}-\d{2}$")
        self.assertLessEqual(props["elevation_min_m"], props["elevation_mean_m"])
        self.assertLessEqual(props["elevation_mean_m"], props["elevation_max_m"])

    def test_qa_records_repairs_and_temporal_range(self):
        report = json.loads((ROOT / "data/releases/nepal-glaciers-inventory/1.0.0/qa.json").read_text())
        self.assertEqual(4593, report["features"])
        self.assertEqual(95, report["named_glaciers"])
        self.assertEqual(287, report["display_geometries_repaired"])
        self.assertEqual("1992-09-22", report["outline_date_min"])
        self.assertEqual("2010-06-10", report["outline_date_max"])


if __name__ == "__main__":
    unittest.main()
