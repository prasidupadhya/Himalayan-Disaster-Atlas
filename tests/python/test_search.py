import gzip
import json
import unittest
from pathlib import Path

from pipelines.atlas_pipeline.contracts import ROOT
from pipelines.atlas_pipeline.search import verify_search_index


class SearchIndexTest(unittest.TestCase):
    def test_release_is_source_derived_bounded_and_truthful(self):
        release = ROOT / "data/releases/atlas-search-index/1.0.0"
        manifest = verify_search_index(release, ROOT / "apps/web/public/data/atlas-search-index/1.0.0")
        self.assertEqual(
            [item["id"] for item in manifest["shards"]],
            ["core", "infra-network", "infra-schools", "infra-services", "events-2015-2020", "events-2021-2024", "events-2025-2026", "earthquakes"],
        )
        self.assertTrue(all(item["byte_size"] <= 2_097_152 for item in manifest["shards"]))
        records = []
        for shard in manifest["shards"]:
            records.extend(json.loads(gzip.decompress((release / Path(shard["path"]).name).read_bytes())))
        everest = [item for item in records if item["normalized_name"] == "mount everest" or "everest" in item["normalized_aliases"]]
        self.assertTrue(everest)
        self.assertTrue(any(item["type"] == "administrative_unit" and item["normalized_name"] == "bagmati" for item in records))
        river_names = [item for item in records if item["type"] == "river" and item["name"].startswith("HYRIV ")]
        self.assertTrue(river_names)
        self.assertTrue(all("source name UNKNOWN" in item["context"] for item in river_names))


if __name__ == "__main__":
    unittest.main()
