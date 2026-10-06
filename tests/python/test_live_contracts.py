import copy
import json
import tempfile
import unittest
from pathlib import Path

from pipelines.atlas_pipeline.contracts import ROOT
from pipelines.atlas_pipeline.live_contracts import (
    assert_live_publication_allowed,
    live_freshness,
    parse_live_index,
    parse_live_snapshot,
    publish_immutable_files,
    time,
    validate_live_pair,
    verify_live_fixture,
    workflow_health,
)
from pipelines.atlas_pipeline.live_fixtures import files

BASE = ROOT / "data/releases/atlas-live-contracts/1.0.0"


def read(identifier):
    return json.loads((BASE / f"{identifier}.json").read_text())


def observed():
    snapshot = read("snapshot-ready")
    snapshot.update(product_type="observation", evidence_type="observed")
    snapshot["records"][0].update(evidence_type="observed", observed_at=snapshot["source_issued_at"])
    snapshot["records"][0]["measurements"] = [
        {"variable": "temperature", "value": 0, "unit": "degC", "qualifier": None, "evidence_type": "observed"}]
    return snapshot


class LiveContractTest(unittest.TestCase):
    def test_shared_contract_cases(self):
        cases = json.loads((ROOT / "tests/fixtures/live-contract-cases.json").read_text())
        names = {"snapshot": "snapshot-ready", "index": "index-ready", "empty-index": "index-empty",
                 "failed-index": "index-failed", "unavailable-index": "index-unavailable"}
        for case in cases:
            with self.subTest(case=case["name"]):
                value = observed() if case["target"] == "observed" else read(names[case["target"]])
                for edit in case["edits"]:
                    parent = value
                    for key in edit["path"][:-1]:
                        parent = parent[key]
                    parent[edit["path"][-1]] = edit["value"]
                parse = parse_live_index if "index" in case["target"] else parse_live_snapshot
                if case["valid"]:
                    parse(value)
                else:
                    with self.assertRaises(Exception):
                        parse(value)

    def test_fixture_is_reproducible_and_every_public_byte_is_verified(self):
        public = ROOT / "apps/web/public/data/atlas-live-contracts/1.0.0"
        manifest = verify_live_fixture(BASE, public)
        self.assertTrue(manifest["is_fixture"])
        for name, raw in files().items():
            self.assertEqual((BASE / name).read_bytes(), raw)
        for name in ("snapshot-ready", "snapshot-empty", "snapshot-unknown"):
            snapshot = read(name)
            self.assertTrue(all(record["coordinates"] is None and not record["measurements"]
                                for record in snapshot["records"]))
            self.assertTrue(all(value is None for value in snapshot["unsupported_outputs"].values()))

    def test_immutable_conflicts_cannot_partially_overwrite_a_release(self):
        with tempfile.TemporaryDirectory() as temporary:
            directory = Path(temporary)
            publish_immutable_files(directory, {"a.json": b"one"})
            with self.assertRaisesRegex(ValueError, "conflict"):
                publish_immutable_files(directory, {"new.json": b"new", "a.json": b"changed"})
            self.assertEqual((directory / "a.json").read_bytes(), b"one")
            self.assertFalse((directory / "new.json").exists())
            publish_immutable_files(directory, {"a.json": b"one"})

    def test_corrupt_bytes_extra_files_and_public_differences_fail_closed(self):
        with tempfile.TemporaryDirectory() as temporary:
            directory = Path(temporary)
            content = files()
            publish_immutable_files(directory, content)
            (directory / "snapshot-ready.json").write_bytes(b"{}")
            with self.assertRaisesRegex(ValueError, "checksum"):
                verify_live_fixture(directory)
            (directory / "snapshot-ready.json").write_bytes(content["snapshot-ready.json"])
            (directory / "extra.json").write_text("{}")
            with self.assertRaisesRegex(ValueError, "Unregistered"):
                verify_live_fixture(directory)
            (directory / "extra.json").unlink()
            # Keep the independent public tree outside the release inventory.
            with tempfile.TemporaryDirectory() as public_temporary:
                public = Path(public_temporary)
                publish_immutable_files(public, content)
                (public / "snapshot-ready.json").write_bytes(b"{}")
                with self.assertRaisesRegex(ValueError, "Public live fixture differs"):
                    verify_live_fixture(directory, public)

    def test_freshness_deadline_failure_and_unavailability(self):
        for case, expected in (("ready", "ready"), ("empty", "empty"), ("failed", "stale"),
                               ("unavailable", "unavailable"), ("unknown", "stale")):
            index = parse_live_index(read(f"index-{case}"))
            ref = index["feeds"][0]["snapshot"]
            snapshot = parse_live_snapshot(read(ref["id"])) if ref else None
            self.assertEqual(live_freshness(index, index["feeds"][0], snapshot,
                                          time("2026-10-06T12:01:00Z"))["status"], expected)
            if snapshot:
                self.assertEqual(live_freshness(index, index["feeds"][0], snapshot,
                                              time("2026-10-06T18:00:00Z"))["status"], "stale")
        self.assertEqual(workflow_health(read("index-failed"), time("2026-10-06T12:01:00Z")), "FAILED")

    def test_staleness_uses_oldest_observation_and_pair_identity(self):
        snapshot = observed()
        snapshot["freshness"]["basis"] = "observation"
        older = copy.deepcopy(snapshot["records"][0])
        older.update(id="older", observed_at="2026-10-06T08:00:00Z")
        snapshot["records"].append(older)
        snapshot["freshness"]["as_of"] = older["observed_at"]
        parse_live_snapshot(snapshot)
        snapshot["freshness"]["as_of"] = snapshot["fetched_at"]
        with self.assertRaisesRegex(ValueError, "source time"):
            parse_live_snapshot(snapshot)
        snapshot = read("snapshot-ready")
        snapshot["version"] = "9.0.0"
        index = read("index-ready")
        with self.assertRaisesRegex(ValueError, "identity"):
            validate_live_pair(index, index["feeds"][0], snapshot)

    def test_source_flags_and_unresolved_licences_are_independent_gates(self):
        index = read("index-ready")
        with self.assertRaisesRegex(ValueError, "fixtures"):
            assert_live_publication_allowed(index)
        for feed in ("dhm", "bipad", "openaq", "open-meteo", "imerg"):
            candidate = copy.deepcopy(index)
            candidate["is_fixture"] = False
            candidate["feeds"][0]["feed_id"] = feed
            with self.assertRaisesRegex(ValueError, "disabled"):
                assert_live_publication_allowed(candidate)
        snapshot = read("snapshot-ready")
        snapshot["source"]["license_review"] = "REVIEW_REQUIRED"
        with self.assertRaisesRegex(ValueError, "redistribution"):
            assert_live_publication_allowed(index, snapshot, allow_fixture=True)

    def test_nonfinite_and_duplicate_record_measurements_fail(self):
        for number in (float("nan"), float("inf"), -float("inf"), 10**400):
            snapshot = observed()
            snapshot["records"][0]["measurements"][0]["value"] = number
            with self.assertRaises(ValueError):
                parse_live_snapshot(snapshot)
        snapshot = observed()
        snapshot["records"].append(copy.deepcopy(snapshot["records"][0]))
        with self.assertRaisesRegex(ValueError, "Duplicate"):
            parse_live_snapshot(snapshot)


if __name__ == "__main__":
    unittest.main()
