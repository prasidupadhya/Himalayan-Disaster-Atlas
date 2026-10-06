"""Feature 42: shared live contracts, not source acquisition or model execution."""

import hashlib
import json
import math
from datetime import datetime, timedelta, timezone
from pathlib import Path
from urllib.parse import urlparse

from jsonschema import Draft7Validator, FormatChecker
from referencing import Registry, Resource

from .contracts import ROOT

INDEX_BYTES = 65_536
SNAPSHOT_BYTES = 524_288
POLICY = json.loads((ROOT / "packages/contracts/live-policy.json").read_text())
UNITS = {
    "magnitude": "magnitude", "depth": "km", "precipitation_accumulation": "mm",
    "precipitation_rate": "mm/h", "temperature": "degC", "water_level": "m",
    "discharge": "m3/s", "pm25": "ug/m3", "aqi": "dimensionless",
}
SNAPSHOT_SCHEMA = json.loads((ROOT / "schemas/live-snapshot.schema.json").read_text())
INDEX_SCHEMA = json.loads((ROOT / "schemas/live-index.schema.json").read_text())
REGISTRY = Registry().with_resource(SNAPSHOT_SCHEMA["$id"], Resource.from_contents(SNAPSHOT_SCHEMA))
SNAPSHOT_VALIDATOR = Draft7Validator(SNAPSHOT_SCHEMA, format_checker=FormatChecker())
INDEX_VALIDATOR = Draft7Validator(INDEX_SCHEMA, registry=REGISTRY, format_checker=FormatChecker())
REFERENCE_VALIDATOR = INDEX_VALIDATOR.evolve(schema={
    "$id": INDEX_SCHEMA["$id"], "$ref": "#/definitions/reference",
    "definitions": INDEX_SCHEMA["definitions"],
})


def require(condition, message):
    if not condition:
        raise ValueError(message)


def time(value):
    return None if value is None else datetime.fromisoformat(value.replace("Z", "+00:00"))


def finite_json(value):
    if isinstance(value, (int, float)) and not isinstance(value, bool):
        try:
            finite = math.isfinite(value)
        except OverflowError:
            finite = False
        require(finite, "Live numbers must be finite in both runtimes")
    elif isinstance(value, dict):
        for item in value.values():
            finite_json(item)
    elif isinstance(value, list):
        for item in value:
            finite_json(item)


def chronological(earlier, later, message):
    require(earlier is None or (later is not None and time(earlier) <= time(later)), message)


def fixture_identity(feed, fixture):
    require((feed == "contract-fixture") == fixture, "Live fixture identity mismatch")


def safe_source(url):
    parsed = urlparse(url)
    require(parsed.scheme == "https" and parsed.hostname and not parsed.username
            and not parsed.password, "Live source URL must be credential-free HTTPS")


def parse_live_snapshot(snapshot):
    finite_json(snapshot)
    SNAPSHOT_VALIDATOR.validate(snapshot)
    fixture_identity(snapshot["feed_id"], snapshot["is_fixture"])
    expected_id = "atlas-live-contracts" if snapshot["is_fixture"] else f"live-{snapshot['feed_id']}"
    require(snapshot["dataset_id"] == expected_id, "Live dataset identity mismatch")
    source = snapshot["source"]
    safe_source(source["url"])
    if source["license_url"]:
        safe_source(source["license_url"])
    require(snapshot["is_fixture"] or source["raw_sha256"] is not None,
            "Live source bytes require a checksum")
    chronological(snapshot["source_issued_at"], snapshot["fetched_at"], "Live issue time follows fetch")
    chronological(snapshot["freshness"]["as_of"], snapshot["fetched_at"], "Live freshness time follows fetch")
    product, evidence = snapshot["product_type"], snapshot["evidence_type"]
    require(product != "forecast" or evidence == "modelled", "Forecast must remain modelled")
    require(product != "reported_event" or evidence == "reported", "Event must remain reported")
    require(product != "observation" or evidence in ("observed", "derived"), "Observation evidence mismatch")
    require(product != "official_warning" or (evidence == "reported" and source["is_official"]
            and snapshot["feed_id"] == "dhm"), "Official warning authority mismatch")
    require(product != "scenario" or (evidence == "hypothetical" and snapshot["assumptions"]),
            "Scenario needs hypothetical evidence and assumptions")
    require(product != "unknown" or evidence == "unknown", "Unknown product evidence mismatch")
    records = snapshot["records"]
    require(len({record["id"] for record in records}) == len(records), "Duplicate live record")
    for record in records:
        require(record["evidence_type"] == evidence, "Live record evidence mismatch")
        chronological(record["observed_at"], snapshot["fetched_at"], "Observation follows fetch")
        chronological(record["issued_at"], snapshot["fetched_at"], "Record issue follows fetch")
        require((record["valid_from"] is None) == (record["valid_until"] is None),
                "Live validity interval is incomplete")
        chronological(record["valid_from"], record["valid_until"], "Live validity interval is reversed")
        require(record["valid_from"] is None or time(record["valid_from"]) < time(record["valid_until"]),
                "Live validity interval must have duration")
        if product == "forecast":
            require(time(record["issued_at"]) == time(snapshot["source_issued_at"])
                    and record["issued_at"] is not None and record["valid_from"] is not None,
                    "Forecast needs issue and validity times")
        variables = set()
        for measurement in record["measurements"]:
            variable, value = measurement["variable"], measurement["value"]
            require(variable not in variables, "Duplicate live measurement")
            variables.add(variable)
            require(measurement["unit"] == UNITS[variable], "Live measurement unit mismatch")
            require(measurement["evidence_type"] != "unknown" or value is None,
                    "UNKNOWN measurement cannot have a value")
            require(evidence != "unknown" or value is None, "UNKNOWN record cannot have a value")
            require(product != "forecast" or measurement["evidence_type"] == "modelled",
                    "Forecast measurement must remain modelled")
            if variable in ("precipitation_accumulation", "precipitation_rate", "discharge", "pm25", "aqi"):
                require(value is None or value >= 0, "Live nonnegative measurement is negative")
            if variable in ("magnitude", "water_level", "precipitation_accumulation", "aqi"):
                require(value is None or measurement["qualifier"] is not None,
                        "Live measurement requires type, datum, interval or AQI standard")
    if snapshot["freshness"]["basis"] == "source_issue":
        expected = time(snapshot["source_issued_at"])
    else:
        observed = [time(record["observed_at"]) for record in records]
        expected = min(observed) if observed and all(item is not None for item in observed) else None
    require(time(snapshot["freshness"]["as_of"]) == expected,
            "Live freshness must use source time, not fetch time")
    return snapshot


def parse_live_index(index):
    finite_json(index)
    INDEX_VALIDATOR.validate(index)
    feeds = index["feeds"]
    require(len({feed["feed_id"] for feed in feeds}) == len(feeds), "Duplicate live feed")
    enabled = [feed for feed in feeds if feed["enabled"]]
    for feed in feeds:
        fixture_identity(feed["feed_id"], index["is_fixture"])
        chronological(feed["last_successful_fetch_at"], feed["last_attempt_at"], "Live success follows attempt")
        chronological(feed["last_attempt_at"], index["generated_at"], "Live attempt follows publication")
        status = feed["attempt_status"]
        if status == "success":
            require(feed["enabled"] and feed["snapshot"] is not None and feed["error_code"] is None
                    and feed["last_attempt_at"] is not None
                    and time(feed["last_attempt_at"]) == time(feed["last_successful_fetch_at"]),
                    "Live success requires a snapshot and successful fetch time")
        if status == "failed":
            require(feed["enabled"] and feed["last_attempt_at"] is not None
                    and feed["error_code"] not in (None, "disabled", "license_unresolved"),
                    "Live failure requires a failed attempt")
        if status == "not_configured":
            require(not feed["enabled"] and feed["snapshot"] is None
                    and feed["last_attempt_at"] is None and feed["last_successful_fetch_at"] is None
                    and feed["error_code"] in (None, "disabled", "license_unresolved"),
                    "Disabled feed cannot carry observations")
        require((feed["snapshot"] is not None) == (feed["last_successful_fetch_at"] is not None),
                "Live snapshot/success mismatch")
        if feed["snapshot"]:
            ref = feed["snapshot"]
            dataset_id = "atlas-live-contracts" if index["is_fixture"] else f"live-{feed['feed_id']}"
            expected = f"/data/{ref['dataset_id']}/{ref['version']}/{ref['id']}.json"
            require(ref["dataset_id"] == dataset_id and ref["path"] == expected,
                    "Live reference identity mismatch")
    successes = sum(feed["attempt_status"] == "success" for feed in enabled)
    expected_status = "not_configured" if not enabled else (
        "success" if successes == len(enabled) else "partial" if successes else "failed")
    require(index["workflow"]["status"] == expected_status, "Live workflow status differs from feeds")
    for key in ("last_attempt_at", "last_successful_fetch_at"):
        known = [time(feed[key]) for feed in feeds if feed[key] is not None]
        require(time(index["workflow"][key]) == (max(known) if known else None),
                "Live workflow timestamps differ from feeds")
    return index


def validate_live_pair(index, feed, snapshot):
    ref = feed["snapshot"]
    require(ref is not None and all(ref[key] == snapshot[key] for key in ("dataset_id", "version", "id"))
            and feed["feed_id"] == snapshot["feed_id"]
            and index["is_fixture"] == snapshot["is_fixture"], "Live index/snapshot identity mismatch")
    require(time(feed["last_successful_fetch_at"]) == time(snapshot["fetched_at"]),
            "Live index/snapshot fetch time mismatch")
    chronological(snapshot["fetched_at"], index["generated_at"], "Live snapshot follows publication")


def workflow_health(index, now):
    workflow = index["workflow"]
    if workflow["last_attempt_at"] is None or now < time(index["generated_at"]):
        return "UNAVAILABLE"
    if now >= time(workflow["last_attempt_at"]) + timedelta(seconds=workflow["stale_after_seconds"]):
        return "STALE"
    return {"success": "HEALTHY", "failed": "FAILED", "partial": "PARTIAL",
            "not_configured": "UNAVAILABLE"}[workflow["status"]]


def live_freshness(index, feed, snapshot, now):
    if not feed["enabled"] or snapshot is None:
        return {"status": "unavailable", "reason": "No verified snapshot is available.", "deadline": None}
    validate_live_pair(index, feed, snapshot)
    if now < time(index["generated_at"]):
        return {"status": "unavailable", "reason": "Clock or publication time cannot be verified.", "deadline": None}
    freshness = snapshot["freshness"]
    as_of = time(freshness["as_of"])
    deadlines = [] if as_of is None else [as_of + timedelta(seconds=freshness["stale_after_seconds"])]
    if freshness["expires_at"] is not None:
        deadlines.append(time(freshness["expires_at"]))
    if snapshot["product_type"] == "official_warning":
        deadlines += [time(record["valid_until"]) for record in snapshot["records"]
                      if record["valid_until"] is not None]
    deadline = min(deadlines) if as_of is not None else None
    result_deadline = None if deadline is None else deadline.isoformat(timespec="milliseconds").replace("+00:00", "Z")
    if feed["attempt_status"] == "failed":
        status, reason = "stale", "Latest fetch failed; this is the last verified snapshot."
    elif as_of is None:
        status, reason = "stale", "Source freshness is UNKNOWN."
    elif snapshot["product_type"] == "official_warning" and any(
            record["valid_until"] is None for record in snapshot["records"]):
        status, reason = "stale", "Official warning validity is UNKNOWN."
    elif now >= deadline:
        status, reason = "stale", "Source freshness deadline or validity has expired."
    elif workflow_health(index, now) in ("STALE", "UNAVAILABLE"):
        status, reason = "stale", "Workflow freshness cannot be confirmed."
    elif snapshot["records"]:
        status, reason = "ready", "Verified snapshot within its declared freshness policy."
    else:
        status, reason = "empty", "Valid empty snapshot; this is not a failed fetch or an all-clear."
    return {"status": status, "reason": reason, "deadline": result_deadline}


def assert_live_publication_allowed(index, snapshot=None, allow_fixture=False):
    require(not index["is_fixture"] or allow_fixture, "Synthetic live fixtures are not conditions")
    for feed in index["feeds"]:
        if feed["enabled"]:
            allowed = allow_fixture if feed["feed_id"] == "contract-fixture" else POLICY["sources"][feed["feed_id"]]["enabled_by_default"]
            require(allowed, "Live source is disabled pending review")
    if snapshot:
        require(snapshot["source"]["license_review"] == "PERMITTED", "Live source redistribution is unresolved")


def verified_json(directory, reference, limit):
    # References cannot select directories, arbitrary URLs or unregistered release paths.
    REFERENCE_VALIDATOR.validate(reference)
    expected = f"/data/{reference['dataset_id']}/{reference['version']}/{reference['id']}.json"
    require(reference["path"] == expected, "Live reference identity mismatch")
    raw = (directory / f"{reference['id']}.json").read_bytes()
    require(0 < len(raw) <= limit and len(raw) == reference["byte_size"]
            and hashlib.sha256(raw).hexdigest() == reference["sha256"], "Live artifact checksum mismatch")
    return json.loads(raw)


def verify_live_fixture(directory, public=None):
    manifest = json.loads((directory / "manifest.json").read_text())
    require(manifest["kind"] == "live-contract-fixture" and manifest["id"] == "atlas-live-contracts"
            and manifest["version"] == "1.0.0" and manifest["is_fixture"] is True
            and manifest["license"] == "MIT", "Live fixture manifest identity mismatch")
    expected_files = {"manifest.json", "LICENSE.txt"}
    for reference in manifest["artifacts"].values():
        require(reference["dataset_id"] == manifest["id"] and reference["version"] == manifest["version"],
                "Live fixture artifact identity mismatch")
        expected_files.add(f"{reference['id']}.json")
        payload = verified_json(directory, reference, INDEX_BYTES if reference["id"].startswith("index-") else SNAPSHOT_BYTES)
        if payload.get("kind") == "live-snapshot":
            parse_live_snapshot(payload)
            require(payload["is_fixture"] is True, "Real data cannot be published as contract fixtures")
            require(all(record["coordinates"] is None and not record["measurements"]
                        for record in payload["records"]), "Contract fixtures cannot contain readings or locations")
        else:
            index = parse_live_index(payload)
            assert_live_publication_allowed(index, allow_fixture=True)
            for feed in index["feeds"]:
                if feed["snapshot"]:
                    snapshot = parse_live_snapshot(verified_json(directory, feed["snapshot"], SNAPSHOT_BYTES))
                    validate_live_pair(index, feed, snapshot)
                    assert_live_publication_allowed(index, snapshot, allow_fixture=True)
    actual = {str(path.relative_to(directory)) for path in directory.rglob("*") if path.is_file()}
    require(actual == expected_files, "Unregistered live fixture artifact")
    if public:
        require({str(path.relative_to(public)) for path in public.rglob("*") if path.is_file()} == expected_files,
                "Public live fixture inventory differs")
        for name in expected_files:
            require((directory / name).read_bytes() == (public / name).read_bytes(), "Public live fixture differs")
    return manifest


def publish_immutable_files(directory: Path, files):
    """Preflight ALL existing bytes before writing; never overwrite a published version."""
    for name, raw in files.items():
        path = directory / name
        require(not path.exists() or path.read_bytes() == raw, "Immutable live release conflict")
    if directory.exists():
        existing = {str(path.relative_to(directory)) for path in directory.rglob("*") if path.is_file()}
        require(existing.issubset(files), "Unregistered immutable live artifact")
    directory.mkdir(parents=True, exist_ok=True)
    for name, raw in files.items():
        path = directory / name
        if not path.exists():
            with path.open("xb") as output:
                output.write(raw)


def fixture_clock(value):
    """Explicit UTC clock for contract tests; never substituted for source timestamps."""
    return time(value).astimezone(timezone.utc)
