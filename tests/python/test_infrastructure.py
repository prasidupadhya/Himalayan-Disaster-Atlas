import gzip
import json
import unittest
from collections import Counter

from pipelines.atlas_pipeline.contracts import ROOT, validate_dataset


class InfrastructureTest(unittest.TestCase):
    def test_osm_inventory_is_traceable_partitioned_and_within_browser_budgets(self):
        datasets = [
            "nepal-osm-major-roads-west",
            "nepal-osm-major-roads-central",
            "nepal-osm-major-roads-east",
            "nepal-osm-major-bridges",
            "nepal-osm-schools-west",
            "nepal-osm-schools-central-west",
            "nepal-osm-schools-central-east",
            "nepal-osm-schools-east",
            "nepal-osm-health-facilities",
            "nepal-osm-emergency-facilities",
            "nepal-osm-settlements",
        ]
        counts = Counter()
        source_ids = {name: set() for name in ["road", "bridge", "school", "health", "emergency", "settlement"]}
        for dataset_id in datasets:
            base = ROOT / "data/releases" / dataset_id / "1.0.0"
            public = ROOT / "apps/web/public/data" / dataset_id / "1.0.0"
            metadata = json.loads((base / "manifest.json").read_text())
            compressed = (base / "features.geojson.gz").read_bytes()
            decoded = gzip.decompress(compressed)
            collection = json.loads(decoded)
            validate_dataset(metadata, collection)
            self.assertEqual((public / "manifest.json").read_bytes(), (base / "manifest.json").read_bytes())
            self.assertEqual((public / "features.geojson.gz").read_bytes(), compressed)
            self.assertLess(len(compressed), 2_097_152)
            self.assertLess(len(decoded), 8_388_608)
            for feature in collection["features"]:
                klass = feature["properties"]["infrastructure_class"]
                counts[klass] += 1
                self.assertNotIn(feature["properties"]["source_id"], source_ids[klass])
                source_ids[klass].add(feature["properties"]["source_id"])
                self.assertTrue(feature["properties"]["osm_source_timestamp"].endswith("Z"))
                if klass == "road":
                    self.assertIn(feature["geometry"]["type"], {"LineString", "MultiLineString"})
                    self.assertTrue(feature["properties"]["display_geometry_simplified"])
                else:
                    self.assertEqual(feature["geometry"]["type"], "Point")
                    self.assertFalse(feature["properties"]["display_geometry_simplified"])

        self.assertEqual(
            counts,
            Counter(road=5311, bridge=3004, school=25674, health=4654, emergency=923, settlement=4045),
        )

        qa = json.loads((ROOT / "data/releases/nepal-osm-infrastructure/1.0.0/qa.json").read_text())
        self.assertEqual(qa["source_snapshot"]["sha256"], "b663bf66858b92942656d5c76c7284db63df6be07326b33f50bb2cc8a67a712c")
        self.assertEqual(qa["repeated_road_way_occurrences_removed"], 61)
        self.assertEqual(qa["boundary_clipped_roads"], 32)
        self.assertEqual(qa["road_exclusions"], {"outside_codab": 14565})


if __name__ == "__main__":
    unittest.main()
