import unittest

from pipelines.atlas_pipeline.contracts import ROOT
from pipelines.atlas_pipeline.provenance import verify_provenance


class ProvenanceTest(unittest.TestCase):
    def test_registry_covers_every_release_and_marks_superseded_versions(self):
        catalog = verify_provenance()
        source_manifests = [
            path
            for path in (ROOT / "data/releases").glob("*/*/manifest.json")
            if path.parent.parent.name != "atlas-provenance"
        ]
        self.assertEqual(catalog["generated_from_count"], len(source_manifests))
        current = [
            record
            for record in catalog["records"]
            if record["state"] == "current" and not record["is_fixture"]
        ]
        self.assertTrue(current)
        self.assertTrue(
            all(
                record["source"]
                and record["license"]
                and record["method"]
                and record["limitations"]
                for record in current
            )
        )
        self.assertTrue(
            any(
                record["id"] == "nepal-admin-country"
                and record["version"] == "2.0.0"
                and record["state"] == "superseded"
                for record in catalog["records"]
            )
        )
        self.assertTrue(
            any(record["id"] == "atlas-search-index" and record["parents"] for record in current)
        )
        self.assertTrue(
            any(
                record["id"] == "scenario-pulse-40669746" and record["evidence_type"] == "simulated"
                for record in current
            )
        )


if __name__ == "__main__":
    unittest.main()
