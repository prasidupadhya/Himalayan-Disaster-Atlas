"""Publish explicit, measurement-free Feature 42 fixtures; never fetch a provider."""

import copy
import hashlib
import json

from .contracts import ROOT
from .live_contracts import (
    parse_live_index,
    parse_live_snapshot,
    publish_immutable_files,
    verify_live_fixture,
)

VERSION = "1.0.0"
BASE = f"/data/atlas-live-contracts/{VERSION}/"
STAMP = "2026-10-06T12:00:00Z"
LATER = "2026-10-06T12:01:00Z"


def encode(value):
    return (json.dumps(value, sort_keys=True, separators=(",", ":"), ensure_ascii=False,
                       allow_nan=False) + "\n").encode()


def files():
    snapshot = {
        "schema_version": "1.0.0", "kind": "live-snapshot", "dataset_id": "atlas-live-contracts",
        "version": VERSION, "id": "snapshot-ready", "feed_id": "contract-fixture", "is_fixture": True,
        "source": {
            "name": "Himalayan Disaster Atlas synthetic contract fixtures",
            "url": "https://github.com/prasidupadhya/Himalayan-Disaster-Atlas",
            "version": VERSION, "raw_sha256": None, "license": "MIT",
            "license_url": "https://opensource.org/license/mit/",
            "attribution": "Himalayan Disaster Atlas contributors. Synthetic test cases, not provider observations.",
            "license_review": "PERMITTED", "is_official": False,
        },
        "fetched_at": STAMP, "source_issued_at": STAMP,
        "freshness": {"basis": "source_issue", "as_of": STAMP,
                      "stale_after_seconds": 21600, "expires_at": None},
        "crs": "OGC:CRS84", "evidence_type": "unknown", "product_type": "unknown",
        "records": [{"id": "synthetic-record", "label": "Synthetic record without readings or location",
                     "coordinates": None, "evidence_type": "unknown", "observed_at": None,
                     "issued_at": None, "valid_from": None, "valid_until": None, "measurements": []}],
        "assumptions": ["All timestamps and workflow states are fixed synthetic test inputs, not actual fetches."],
        "limitations": ["This fixture contains no geographic facts, measurements, forecasts or warnings."],
        "unsupported_outputs": {name: None for name in (
            "physical_inundation", "destroyed_buildings", "casualties", "repair_costs",
            "hydropower_downtime", "economic_loss")},
        "notice": "Periodically updated conditions; not a real-time warning service.",
    }
    payloads = {"snapshot-ready": snapshot}
    empty = copy.deepcopy(snapshot)
    empty.update(id="snapshot-empty", records=[])
    payloads[empty["id"]] = empty
    unknown = copy.deepcopy(snapshot)
    unknown.update(id="snapshot-unknown", source_issued_at=None)
    unknown["freshness"]["as_of"] = None
    payloads[unknown["id"]] = unknown
    encoded = {}
    artifacts = {}

    def add(identifier, payload):
        raw = encode(payload)
        encoded[f"{identifier}.json"] = raw
        artifacts[identifier] = {"dataset_id": "atlas-live-contracts", "version": VERSION,
                                 "id": identifier, "path": BASE + identifier + ".json",
                                 "sha256": hashlib.sha256(raw).hexdigest(), "byte_size": len(raw)}

    for identifier, payload in payloads.items():
        parse_live_snapshot(payload)
        add(identifier, payload)
    for case, snapshot_id in (("ready", "snapshot-ready"), ("empty", "snapshot-empty"),
                              ("failed", "snapshot-ready"), ("unavailable", None),
                              ("unknown", "snapshot-unknown")):
        disabled, failed = case == "unavailable", case == "failed"
        index = {
            "schema_version": "1.0.0", "kind": "live-index", "is_fixture": True, "generated_at": LATER,
            "workflow": {"status": "not_configured" if disabled else "failed" if failed else "success",
                         "last_attempt_at": None if disabled else LATER if failed else STAMP,
                         "last_successful_fetch_at": None if disabled else STAMP,
                         "run_url": None, "schedule_seconds": 10800, "stale_after_seconds": 21600},
            "feeds": [{"feed_id": "contract-fixture", "enabled": not disabled,
                       "attempt_status": "not_configured" if disabled else "failed" if failed else "success",
                       "last_attempt_at": None if disabled else LATER if failed else STAMP,
                       "last_successful_fetch_at": None if disabled else STAMP,
                       "error_code": "disabled" if disabled else "timeout" if failed else None,
                       "snapshot": None if disabled else artifacts[snapshot_id]}],
        }
        parse_live_index(index)
        add(f"index-{case}", index)
    manifest = {
        "schema_version": "1.0.0", "kind": "live-contract-fixture", "id": "atlas-live-contracts",
        "version": VERSION, "is_fixture": True,
        "source": snapshot["source"]["name"], "source_url": snapshot["source"]["url"],
        "license": "MIT", "license_url": snapshot["source"]["license_url"],
        "attribution": snapshot["source"]["attribution"],
        "method": "contract-fixtures/1.0.0: deterministic, measurement-free live protocol test cases",
        "limitations": snapshot["limitations"] + snapshot["assumptions"], "artifacts": artifacts,
    }
    encoded["manifest.json"] = encode(manifest)
    encoded["LICENSE.txt"] = (ROOT / "LICENSE").read_bytes()
    return encoded


def build():
    content = files()
    release = ROOT / "data/releases/atlas-live-contracts" / VERSION
    public = ROOT / "apps/web/public/data/atlas-live-contracts" / VERSION
    # Check both destinations before the first write, including an already published public copy.
    for directory in (release, public):
        if directory.exists():
            inventory = {str(path.relative_to(directory)) for path in directory.rglob("*") if path.is_file()}
            if not inventory.issubset(content):
                raise ValueError("Unregistered immutable live artifact")
        for name, raw in content.items():
            if (directory / name).exists() and (directory / name).read_bytes() != raw:
                raise ValueError("Immutable live release conflict")
    publish_immutable_files(release, content)
    publish_immutable_files(public, content)
    verify_live_fixture(release, public)
    print("Verified synthetic live contracts; no provider acquisition occurred.")


if __name__ == "__main__":
    build()
