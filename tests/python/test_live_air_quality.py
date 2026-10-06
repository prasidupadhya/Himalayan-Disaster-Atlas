"""Explicit synthetic OpenAQ v3 source fixtures, never published readings."""

import copy
import json
import tempfile
import unittest
from unittest.mock import patch

from jsonschema.exceptions import ValidationError

from pipelines.atlas_pipeline.contracts import ROOT
from pipelines.atlas_pipeline.live_air_quality import (
    POLICY,
    acquire,
    collection,
    normalize,
    parse_air_quality,
)
from pipelines.atlas_pipeline.live_contracts import live_freshness, parse_live_index, time
from pipelines.atlas_pipeline.live_fixtures import encode

NOW = time("2026-10-06T12:00:00Z")
REVIEW = {
    "status": "PERMITTED",
    "provider_id": 1,
    "provider_name": "TEST ONLY provider",
    "location_id": 1,
    "sensor_id": 2,
    "license_ids": [1],
    "license_urls": ["https://opensource.org/license/mit/"],
    "license": "MIT test data",
    "attribution": "TEST ONLY original synthetic fixture; not provider data.",
    "reviewed_on": "2026-10-06",
    "evidence_urls": ["https://opensource.org/license/mit/"],
    "obligations": "Synthetic test use only.",
}
LOCATION = {
    "meta": {"page": 1, "found": 1},
    "results": [
        {
            "id": 1,
            "name": "TEST ONLY station",
            "provider": {"id": 1, "name": "TEST ONLY provider"},
            "isMobile": False,
            "country": {"code": "NP"},
            "coordinates": {"longitude": 85, "latitude": 28},
            "licenses": [{"id": 1, "sourceUrl": "https://opensource.org/license/mit/"}],
            "sensors": [{"id": 2, "parameter": {"name": "pm25", "units": "ug/m3"}}],
        }
    ],
}
MEASUREMENTS = {
    "meta": {"page": 1, "found": 1},
    "results": [
        {
            "value": 0,
            "parameter": {"name": "pm25", "units": "ug/m3"},
            "flagInfo": {"hasFlags": False},
            "coordinates": None,
            "period": {
                "interval": "01:00:00",
                "datetimeFrom": {"utc": "2026-10-06T11:00:00Z"},
                "datetimeTo": {"utc": "2026-10-06T12:00:00Z"},
            },
        }
    ],
}


def fixture():
    return normalize(encode(LOCATION), encode(MEASUREMENTS), REVIEW, NOW, "1.0.1")


class AirQualityTests(unittest.TestCase):
    def test_common_ts_python_cases(self):
        for case in json.loads((ROOT / "tests/fixtures/air-quality-cases.json").read_bytes()):
            value = fixture()
            parent = value
            for key in case["path"][:-1]:
                parent = parent[key]
            key = case["path"][-1]
            if isinstance(parent, list) and key == len(parent):
                parent.append(case["value"])
            else:
                parent[key] = case["value"]
            with self.subTest(case=case["name"]):
                if case["valid"]:
                    parse_air_quality(value)
                else:
                    with self.assertRaises((ValueError, ValidationError)):
                        parse_air_quality(value)

    def test_flag_off_and_empty_allowlist_never_request_or_need_key(self):
        with tempfile.TemporaryDirectory() as temp:

            def forbidden(_url):
                raise AssertionError("No acquisition allowed")

            self.assertEqual(acquire(temp, requester=forbidden), "DISABLED")
            self.assertEqual(acquire(temp, enabled=True, requester=forbidden), "LICENSE_UNRESOLVED")
            self.assertEqual(POLICY["providers"], [])
            with self.assertRaises(ValueError):
                acquire(temp, enabled=True, profile="public", requester=forbidden)

    def test_keys_are_actions_only_and_values_are_never_logged(self):
        with tempfile.TemporaryDirectory() as temp, patch.dict("os.environ", {}, clear=True):
            with self.assertRaisesRegex(ValueError, "GitHub Actions"):
                acquire(temp, enabled=True, policy={**POLICY, "providers": [REVIEW]})
            with (
                patch.dict("os.environ", {"GITHUB_ACTIONS": "true"}),
                self.assertRaisesRegex(ValueError, "value withheld"),
            ):
                acquire(temp, enabled=True, policy={**POLICY, "providers": [REVIEW]})

    def test_unknown_and_flagged_values_are_withheld_aqi_stays_unknown(self):
        for flags in (True, None):
            measurements = copy.deepcopy(MEASUREMENTS)
            measurements["results"][0]["value"] = 25
            measurements["results"][0]["flagInfo"] = {} if flags is None else {"hasFlags": flags}
            value = normalize(encode(LOCATION), encode(measurements), REVIEW, NOW, "1.0.1")
            self.assertIsNone(value["snapshot"]["records"][0]["measurements"][0]["value"])
            self.assertEqual(value["records"][0]["reported_value"], 25)
            self.assertIsNone(value["aqi"]["value"])
        measurements = copy.deepcopy(MEASUREMENTS)
        measurements["results"][0]["period"] = None
        value = normalize(encode(LOCATION), encode(measurements), REVIEW, NOW, "1.0.1")
        self.assertIsNone(value["snapshot"]["freshness"]["as_of"])
        self.assertIsNone(value["records"][0]["averaging_period_seconds"])

    def test_station_provider_licence_units_and_future_time_fail(self):
        for field in ("station", "provider", "licence", "units", "future", "flags"):
            location, measurements = copy.deepcopy(LOCATION), copy.deepcopy(MEASUREMENTS)
            if field == "station":
                location["results"][0]["id"] = 99
            if field == "provider":
                location["results"][0]["provider"]["id"] = 99
            if field == "licence":
                location["results"][0]["licenses"][0]["id"] = 99
            if field == "units":
                measurements["results"][0]["parameter"]["units"] = "ppm"
            if field == "future":
                measurements["results"][0]["period"]["datetimeTo"]["utc"] = "2026-10-07T12:00:00Z"
            if field == "flags":
                measurements["results"][0]["flagInfo"]["hasFlags"] = "false"
            with self.subTest(field=field), self.assertRaises(ValueError):
                normalize(encode(location), encode(measurements), REVIEW, NOW, "1.0.1")

    def test_empty_valid_differs_from_failed_response(self):
        measurements = copy.deepcopy(MEASUREMENTS)
        measurements.update(meta={"page": 1, "found": 0}, results=[])
        value = normalize(encode(LOCATION), encode(measurements), REVIEW, NOW, "1.0.1")
        self.assertEqual(value["snapshot"]["records"], [])
        self.assertIsNone(value["snapshot"]["freshness"]["as_of"])
        for raw in (b"", b"{}", b'{"results":[],"meta":{"page":1,"found":100}}'):
            with self.assertRaises((ValueError, KeyError)):
                collection(raw, 169)

    def test_source_time_governs_staleness_and_missing_snapshot_is_unavailable(self):
        snap = fixture()["snapshot"]
        index = parse_live_index(
            {
                "schema_version": "1.0.0",
                "kind": "live-index",
                "is_fixture": False,
                "generated_at": snap["fetched_at"],
                "workflow": {
                    "status": "success",
                    "last_attempt_at": snap["fetched_at"],
                    "last_successful_fetch_at": snap["fetched_at"],
                    "run_url": None,
                    "schedule_seconds": 10800,
                    "stale_after_seconds": 21600,
                },
                "feeds": [
                    {
                        "feed_id": "openaq",
                        "enabled": True,
                        "attempt_status": "success",
                        "last_attempt_at": snap["fetched_at"],
                        "last_successful_fetch_at": snap["fetched_at"],
                        "error_code": None,
                        "snapshot": {
                            "dataset_id": "live-openaq",
                            "version": "1.0.1",
                            "id": "snapshot",
                            "path": "/data/live-openaq/1.0.1/snapshot.json",
                            "sha256": "0" * 64,
                            "byte_size": 1,
                        },
                    }
                ],
            }
        )
        self.assertEqual(
            live_freshness(index, index["feeds"][0], snap, time("2026-10-06T18:00:00Z"))["status"],
            "stale",
        )
        self.assertEqual(
            live_freshness(index, index["feeds"][0], None, NOW)["status"], "unavailable"
        )
