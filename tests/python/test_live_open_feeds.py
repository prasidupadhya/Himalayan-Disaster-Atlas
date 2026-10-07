"""Offline source, transaction and failure tests. No network calls."""

import hashlib
import json
import tempfile
import unittest
from datetime import timedelta
from pathlib import Path
from unittest.mock import MagicMock, patch

from pipelines.atlas_pipeline.contracts import ROOT
from pipelines.atlas_pipeline.live_contracts import live_freshness, time
from pipelines.atlas_pipeline.live_open_feeds import (
    FeedError,
    atomic_file,
    grib_messages,
    immutable_directory,
    parse_gfs,
    parse_usgs,
    run,
    verify_publication,
)

FIXTURES = ROOT / "tests/fixtures/live-open-feeds"
META = json.loads((FIXTURES / "gfs-source.json").read_text())
NOW = time(META["fetched_at"])
GRIB = (FIXTURES / "gfs-apcp.grib2").read_bytes()


def usgs(empty=False):
    stamp = int(NOW.timestamp() * 1000)
    return json.dumps(
        {
            "type": "FeatureCollection",
            "metadata": {"status": 200, "generated": stamp, "count": 0 if empty else 1},
            "features": []
            if empty
            else [
                {
                    "id": "test-only",
                    "type": "Feature",
                    "geometry": {"type": "Point", "coordinates": [85, 28, None]},
                    "properties": {
                        "net": "us",
                        "type": "earthquake",
                        "time": stamp - 1000,
                        "updated": stamp,
                        "url": "https://earthquake.usgs.gov/earthquakes/eventpage/test-only",
                        "mag": 0,
                        "magType": "TEST ONLY",
                        "place": None,
                    },
                }
            ],
        }
    ).encode()


def fetch(url):
    return usgs() if "usgs" in url else GRIB


class LiveOpenFeedsTests(unittest.TestCase):
    def test_source_fixture_hash_and_gfs_interval(self):
        self.assertEqual(hashlib.sha256(GRIB).hexdigest(), META["sha256"])
        result = parse_gfs(GRIB, NOW, "1.0.1", time(META["cycle"]))
        self.assertEqual(len(result["records"]), 777)
        self.assertEqual(result["freshness"]["as_of"], META["cycle"])
        record = result["records"][0]
        self.assertEqual(
            time(record["valid_until"]) - time(record["valid_from"]), timedelta(hours=6)
        )
        self.assertEqual(time(record["valid_from"]) - time(META["cycle"]), timedelta(hours=18))
        self.assertTrue(all(v is None for v in result["unsupported_outputs"].values()))

    def test_usgs_empty_is_valid_and_zero_is_not_unknown(self):
        self.assertEqual(parse_usgs(usgs(True), NOW, "1.0.1")["records"], [])
        record = parse_usgs(usgs(), NOW, "1.0.1")["records"][0]
        self.assertEqual(record["measurements"][0]["value"], 0)
        self.assertIsNone(record["measurements"][1]["value"])
        self.assertIsNone(record["label"])

    def test_malformed_truncated_and_nonfinite_usgs_fail(self):
        for mutation in ("count", "status", "time", "coordinate", "magnitude", "future_revision"):
            payload = json.loads(usgs())
            if mutation == "count":
                payload["metadata"]["count"] = 500
            if mutation == "status":
                payload["metadata"]["status"] = 500
            if mutation == "time":
                payload["features"][0]["properties"]["time"] = None
            if mutation == "coordinate":
                payload["features"][0]["geometry"]["coordinates"][0] = 180
            if mutation == "magnitude":
                payload["features"][0]["properties"]["mag"] = float("nan")
            if mutation == "future_revision":
                payload["features"][0]["properties"]["updated"] += 100000
            with self.subTest(mutation=mutation), self.assertRaises((ValueError, TypeError)):
                parse_usgs(json.dumps(payload).encode(), NOW, "1.0.1")

    def test_unreviewed_network_is_withheld_not_fabricated(self):
        payload = json.loads(usgs())
        payload["features"][0]["properties"]["net"] = "other"
        self.assertEqual(parse_usgs(json.dumps(payload).encode(), NOW, "1.0.1")["records"], [])

    def test_grib_rejects_empty_html_truncated_wrong_template_and_cycle(self):
        for raw in (b"", b"<html>Error</html>", GRIB[:-1], b"X" + GRIB[1:]):
            with self.assertRaises((ValueError, IndexError)):
                grib_messages(raw)
        with self.assertRaises(ValueError):
            parse_gfs(GRIB, NOW, "1.0.1", time(META["cycle"]) - timedelta(hours=6))
        message, sections = grib_messages(GRIB)[0]
        changed = bytearray(message)
        offset = message.index(sections[4])
        changed[offset + 9] = 2
        with self.assertRaises(ValueError):
            parse_gfs(bytes(changed), NOW, "1.0.1", time(META["cycle"]))

    def test_success_is_atomic_and_manifest_review_is_verified(self):
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp)
            index = run(root, fetch, NOW)
            self.assertEqual(index["workflow"]["status"], "success")
            self.assertEqual(verify_publication(root), index)
            self.assertEqual(len(list((root / "live/history").glob("*/index.json"))), 1)

    def test_failed_fetch_retains_last_verified_and_empty_is_success(self):
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp)
            first = run(root, fetch, NOW)

            def failed(_url):
                raise FeedError("timeout")

            second = run(root, failed, NOW + timedelta(seconds=1))
            self.assertEqual(second["workflow"]["status"], "failed")
            self.assertEqual(first["feeds"][0]["snapshot"], second["feeds"][0]["snapshot"])
            snap = json.loads(
                (root / second["feeds"][0]["snapshot"]["path"].lstrip("/")).read_bytes()
            )
            self.assertEqual(
                live_freshness(second, second["feeds"][0], snap, NOW + timedelta(seconds=2))[
                    "status"
                ],
                "stale",
            )
            third = run(
                root, lambda url: usgs(True) if "usgs" in url else GRIB, NOW + timedelta(seconds=2)
            )
            self.assertEqual(third["workflow"]["status"], "success")
            empty = json.loads(
                (root / third["feeds"][0]["snapshot"]["path"].lstrip("/")).read_bytes()
            )
            self.assertEqual(
                live_freshness(third, third["feeds"][0], empty, NOW + timedelta(seconds=3))[
                    "status"
                ],
                "empty",
            )

    def test_missing_snapshot_is_unavailable_and_failures_have_codes(self):
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp)
            index = run(root, lambda _url: b"{}", NOW)
            self.assertEqual(index["workflow"]["status"], "failed")
            self.assertIsNone(index["workflow"]["last_successful_fetch_at"])
            self.assertEqual(index["feeds"][0]["error_code"], "invalid_data")
            self.assertEqual(
                live_freshness(index, index["feeds"][0], None, NOW)["status"], "unavailable"
            )

    def test_corrupt_previous_and_unreviewed_terms_fail_closed(self):
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp)
            index = run(root, fetch, NOW)
            path = root / index["feeds"][0]["snapshot"]["path"].lstrip("/")
            original = path.read_bytes()
            path.write_bytes(b"{}")
            with self.assertRaises(ValueError):
                run(root, fetch, NOW + timedelta(seconds=1))
            path.write_bytes(original)
            manifest = path.with_name("manifest.json")
            value = json.loads(manifest.read_bytes())
            value["licence_review"]["obligations"] = "changed"
            manifest.write_text(json.dumps(value))
            with self.assertRaises(ValueError):
                verify_publication(root)

    def test_staging_failure_preserves_pointer_and_conflicts_never_overwrite(self):
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp)
            run(root, fetch, NOW)
            old = (root / "live/latest.json").read_bytes()
            with (
                patch(
                    "pipelines.atlas_pipeline.live_open_feeds.atomic_file",
                    side_effect=OSError("staging failure"),
                ),
                self.assertRaises(OSError),
            ):
                run(root, fetch, NOW + timedelta(seconds=1))
            self.assertEqual((root / "live/latest.json").read_bytes(), old)
            directory = root / "immutable"
            immutable_directory(directory, {"x.json": b"original"})
            with self.assertRaises(ValueError):
                immutable_directory(directory, {"x.json": b"changed"})
            self.assertEqual((directory / "x.json").read_bytes(), b"original")
            atomic_file(root / "test.json", b"complete")
            self.assertEqual((root / "test.json").read_bytes(), b"complete")

    def test_bounded_transport_and_url_policy(self):
        from pipelines.atlas_pipeline.live_open_feeds import download

        with self.assertRaises(ValueError):
            download("https://unapproved.invalid/data")
        response = MagicMock()
        response.__enter__.return_value = response
        response.status = 200
        response.headers = {"Content-Length": "99999999"}
        opener = MagicMock()
        opener.open.return_value = response
        with (
            patch("pipelines.atlas_pipeline.live_open_feeds.build_opener", return_value=opener),
            self.assertRaises(FeedError) as failure,
        ):
            download("https://earthquake.usgs.gov/fdsnws/event/1/query")
        self.assertEqual(failure.exception.code, "invalid_data")
        response.headers = {}
        response.read.return_value = b""
        with (
            patch("pipelines.atlas_pipeline.live_open_feeds.build_opener", return_value=opener),
            self.assertRaises(FeedError) as failure,
        ):
            download("https://earthquake.usgs.gov/fdsnws/event/1/query")
        self.assertEqual(failure.exception.code, "invalid_data")

    def test_usgs_documented_204_is_success_with_unknown_source_freshness(self):
        from pipelines.atlas_pipeline.live_open_feeds import ValidEmptyResponse, usgs_url

        self.assertIn("nodata=204", usgs_url(NOW))
        result = parse_usgs(ValidEmptyResponse(), NOW, "1.0.1")
        self.assertEqual(result["records"], [])
        self.assertIsNone(result["freshness"]["as_of"])
        with tempfile.TemporaryDirectory() as temp:
            index = run(
                Path(temp), lambda url: ValidEmptyResponse() if "usgs" in url else GRIB, NOW
            )
            self.assertEqual(index["workflow"]["status"], "success")
            published = json.loads(
                (Path(temp) / index["feeds"][0]["snapshot"]["path"].lstrip("/")).read_bytes()
            )
            self.assertEqual(
                live_freshness(index, index["feeds"][0], published, NOW)["status"], "stale"
            )

    def test_fdsn_empty_collection_can_omit_summary_count(self):
        payload = json.loads(usgs(True))
        del payload["metadata"]["count"]
        self.assertEqual(parse_usgs(json.dumps(payload).encode(), NOW, "1.0.1")["records"], [])
