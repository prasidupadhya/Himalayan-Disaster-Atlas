"""OpenAQ v3 PM2.5 adapter, disabled by default and never a public acquisition path."""

import argparse
import hashlib
import json
import os
import re
import socket
import ssl
from datetime import datetime, timedelta, timezone
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.parse import urlencode
from urllib.request import HTTPSHandler, Request, build_opener

import certifi
from jsonschema import Draft7Validator, FormatChecker
from referencing import Registry, Resource

from .contracts import ROOT
from .live_contracts import parse_live_snapshot, require, time
from .live_fixtures import encode
from .live_open_feeds import (
    NOTICE,
    OUTPUTS,
    FeedError,
    NoRedirect,
    immutable_directory,
    iso,
    number,
)

POLICY = json.loads((ROOT / "licensing/openaq-providers.json").read_bytes())
UNITS = ("ug/m3", "µg/m³", "μg/m³", "µg/m3")
AQI_REASON = "No reviewed AQI calculation standard or sufficient averaging/completeness inputs."


def parse_air_quality(value):
    dependency = json.loads((ROOT / "schemas/live-snapshot.schema.json").read_bytes())
    registry = Registry().with_resource(dependency["$id"], Resource.from_contents(dependency))
    Draft7Validator(
        json.loads((ROOT / "schemas/live-air-quality.schema.json").read_bytes()),
        registry=registry,
        format_checker=FormatChecker(),
    ).validate(value)
    snapshot = parse_live_snapshot(value["snapshot"])
    require(
        snapshot["feed_id"] == "openaq"
        and not snapshot["is_fixture"]
        and snapshot["product_type"] == "observation"
        and snapshot["evidence_type"] == "observed"
        and snapshot["freshness"]["basis"] == "observation",
        "Air quality identity/evidence mismatch",
    )
    require(
        len(value["records"]) == len(snapshot["records"])
        and len({r["id"] for r in value["records"]}) == len(value["records"]),
        "Air quality record identity mismatch",
    )
    for detail in value["records"]:
        record = next((r for r in snapshot["records"] if r["id"] == detail["id"]), None)
        require(
            record is not None and record["coordinates"] == value["station"]["coordinates"],
            "Air quality station mismatch",
        )
        require(
            record["observed_at"] == detail["period_end"], "Air quality observation time mismatch"
        )
        require(
            (detail["period_start"] is None)
            == (detail["period_end"] is None)
            == (detail["averaging_period_seconds"] is None),
            "Air quality period is incomplete",
        )
        if detail["period_start"]:
            require(
                (time(detail["period_end"]) - time(detail["period_start"])).total_seconds()
                == detail["averaging_period_seconds"]
                and time(detail["period_end"]) <= time(snapshot["fetched_at"]),
                "Air quality averaging period mismatch",
            )
        number(detail["reported_value"])
        expected = (
            detail["reported_value"]
            if detail["has_flags"] is False and detail["averaging_period_seconds"] is not None
            else None
        )
        measurements = record["measurements"]
        require(
            len(measurements) == 1
            and measurements[0]["variable"] == "pm25"
            and measurements[0]["unit"] == "ug/m3"
            and measurements[0]["value"] == expected,
            "Flagged or unknown-period PM2.5 must remain UNKNOWN",
        )
    from urllib.parse import urlsplit

    for ref in value["source_responses"]:
        url = urlsplit(ref["url"])
        require(
            url.scheme == "https"
            and url.hostname == "api.openaq.org"
            and not url.username
            and not url.password,
            "Unapproved air quality source",
        )
    return value


def collection(raw, limit):
    value = json.loads(raw)
    require(
        isinstance(value.get("results"), list) and isinstance(value.get("meta"), dict),
        "Malformed OpenAQ response",
    )
    require(
        value["meta"].get("page") == 1
        and value["meta"].get("found") == len(value["results"])
        and len(value["results"]) < limit,
        "Incomplete OpenAQ response",
    )
    return value["results"]


def normalize(location_raw, measurements_raw, review, fetched, version, source_requests=None):
    locations = collection(location_raw, 2)
    require(len(locations) == 1, "Station identity unavailable")
    location = locations[0]
    require(
        location["id"] == review["location_id"]
        and location["provider"]["id"] == review["provider_id"]
        and location["provider"]["name"] == review["provider_name"]
        and location["isMobile"] is False
        and location["country"]["code"] == "NP",
        "Unreviewed station/provider identity",
    )
    license_ids = sorted(item["id"] for item in location["licenses"])
    license_urls = sorted(item["sourceUrl"] for item in location["licenses"])
    require(
        license_ids == sorted(review["license_ids"])
        and license_urls == sorted(review["license_urls"]),
        "Provider licence identity changed",
    )
    sensors = [s for s in location["sensors"] if s["id"] == review["sensor_id"]]
    require(
        len(sensors) == 1
        and sensors[0]["parameter"]["name"] == "pm25"
        and sensors[0]["parameter"]["units"] in UNITS,
        "Station PM2.5 sensor mismatch",
    )
    coords = [
        number(location["coordinates"]["longitude"], False),
        number(location["coordinates"]["latitude"], False),
    ]
    require(
        80 <= coords[0] <= 89 and 26 <= coords[1] <= 31, "Station outside reviewed Nepal coverage"
    )
    records, details = [], []
    for item in collection(measurements_raw, 169):
        require(
            item["parameter"]["name"] == "pm25"
            and item["parameter"]["units"] == sensors[0]["parameter"]["units"],
            "PM2.5 units/identity changed",
        )
        require(item.get("coordinates") is None, "Mobile readings are not supported")
        original = number(item.get("value"))
        require(original is None or original >= 0, "Negative PM2.5")
        flags = item.get("flagInfo")
        flagged = None if flags is None else flags.get("hasFlags")
        require(flagged is None or isinstance(flagged, bool), "Malformed quality flags")
        period = item.get("period")
        start = end = seconds = None
        if period is not None:
            start = period.get("datetimeFrom", {}).get("utc")
            end = period.get("datetimeTo", {}).get("utc")
            require(start is not None and end is not None, "Unknown partial period")
            duration = re.fullmatch(r"(\d{1,3}):([0-5]\d):([0-5]\d)", period["interval"])
            require(duration is not None, "Unknown averaging interval syntax")
            seconds = int(duration[1]) * 3600 + int(duration[2]) * 60 + int(duration[3])
            require(
                0 < seconds <= 86400
                and (time(end) - time(start)).total_seconds() == seconds
                and time(end) <= fetched,
                "Invalid averaging period/timestamp",
            )
            start, end = iso(time(start)), iso(time(end))
        identifier = f"pm25-{review['sensor_id']}-{end or 'unknown'}"
        # Never treat absent quality flags or an unknown period as a validated concentration.
        value = original if flagged is False and seconds is not None else None
        details.append(
            {
                "id": identifier,
                "original_unit": item["parameter"]["units"],
                "averaging_period_seconds": seconds,
                "period_start": start,
                "period_end": end,
                "has_flags": flagged,
                "reported_value": original,
            }
        )
        records.append(
            {
                "id": identifier,
                "label": location.get("name"),
                "coordinates": coords,
                "evidence_type": "observed",
                "observed_at": end,
                "issued_at": None,
                "valid_from": None,
                "valid_until": None,
                "measurements": [
                    {
                        "variable": "pm25",
                        "value": value,
                        "unit": "ug/m3",
                        "qualifier": None
                        if seconds is None
                        else f"Original source {seconds}-second averaging interval; provider quality flag retained",
                        "evidence_type": "observed" if value is not None else "unknown",
                    }
                ],
            }
        )
    observed = [r["observed_at"] for r in records]
    as_of = min(observed) if observed and all(observed) else None
    response_urls = source_requests or [
        f"https://api.openaq.org/v3/locations/{review['location_id']}",
        f"https://api.openaq.org/v3/sensors/{review['sensor_id']}/measurements",
    ]
    payload = {
        "schema_version": "1.0.0",
        "kind": "live-air-quality",
        "profile": "research",
        "station": {
            "location_id": review["location_id"],
            "sensor_id": review["sensor_id"],
            "provider_id": review["provider_id"],
            "provider_name": review["provider_name"],
            "name": location.get("name"),
            "country": "NP",
            "coordinates": coords,
            "license_ids": license_ids,
            "license_urls": license_urls,
            "attribution": review["attribution"],
        },
        "records": details,
        "aqi": {"value": None, "standard": None, "reason": AQI_REASON},
        "source_responses": [
            {"url": url, "sha256": hashlib.sha256(raw).hexdigest()}
            for url, raw in zip(response_urls, (location_raw, measurements_raw), strict=True)
        ],
        "snapshot": {
            "schema_version": "1.0.0",
            "kind": "live-snapshot",
            "dataset_id": "live-openaq",
            "version": version,
            "id": "snapshot",
            "feed_id": "openaq",
            "is_fixture": False,
            "source": {
                "name": "OpenAQ via " + review["provider_name"],
                "url": "https://docs.openaq.org/resources/measurements",
                "version": "OpenAQ-v3;provider-" + str(review["provider_id"]),
                "raw_sha256": hashlib.sha256(location_raw + measurements_raw).hexdigest(),
                "license": review["license"],
                "license_url": review["license_urls"][0],
                "attribution": review["attribution"],
                "license_review": "PERMITTED",
                "is_official": False,
            },
            "fetched_at": iso(fetched),
            "source_issued_at": None,
            "freshness": {
                "basis": "observation",
                "as_of": as_of,
                "stale_after_seconds": 21600,
                "expires_at": None,
            },
            "crs": "OGC:CRS84",
            "evidence_type": "observed",
            "product_type": "observation",
            "records": records,
            "assumptions": [
                "Original provider averaging periods, not a computed daily mean or AQI."
            ],
            "limitations": [
                "Research only. Provider identity and terms must match a separately reviewed allowlist.",
                "Flagged or unknown-quality/period values remain UNKNOWN; sensor accuracy and flag details are unresolved.",
                "No AQI standard, completeness decision, health category, warning or impact estimate.",
            ],
            "unsupported_outputs": OUTPUTS.copy(),
            "notice": NOTICE,
        },
    }
    return parse_air_quality(payload)


def acquire(output, enabled=False, profile="research", policy=POLICY, requester=None):
    if profile != "research":
        raise ValueError("OpenAQ ingestion is prohibited for the public build")
    if not enabled:
        return "DISABLED"
    Draft7Validator(
        json.loads((ROOT / "schemas/openaq-policy.schema.json").read_bytes()),
        format_checker=FormatChecker(),
    ).validate(policy)
    if not policy["providers"]:
        return "LICENSE_UNRESOLVED"  # Do not even request an API key before a review exists.
    require(
        os.environ.get("GITHUB_ACTIONS") == "true",
        "OpenAQ credentials are supplied only by GitHub Actions secrets",
    )
    key = os.environ.get("OPENAQ_API_KEY")
    require(bool(key), "OPENAQ_API_KEY is required; value withheld")
    require(len(policy["providers"]) <= 4, "Provider request budget exceeded")

    def request(url):
        opener = build_opener(
            HTTPSHandler(context=ssl.create_default_context(cafile=certifi.where())), NoRedirect()
        )
        try:
            with opener.open(Request(url, headers={"X-API-Key": key}), timeout=20) as response:
                require(response.status == 200, "OpenAQ HTTP failure")
                raw = response.read(524289)
                require(0 < len(raw) <= 524288, "OpenAQ response budget exceeded")
                return raw
        except (HTTPError, URLError, TimeoutError, socket.timeout) as error:
            raise FeedError("network_error") from error

    fetch = requester or request
    fetched = datetime.now(timezone.utc)
    version = "1.0." + str(int(fetched.timestamp() * 1000000))
    for review in policy["providers"]:
        require(
            review["status"] == "PERMITTED"
            and review["reviewed_on"]
            and review["evidence_urls"]
            and review["obligations"],
            "Incomplete provider review",
        )
        location_url = f"https://api.openaq.org/v3/locations/{int(review['location_id'])}"
        measurements_url = (
            f"https://api.openaq.org/v3/sensors/{int(review['sensor_id'])}/measurements?"
            + urlencode(
                {
                    "datetime_from": iso(fetched - timedelta(days=1)),
                    "datetime_to": iso(fetched),
                    "limit": 169,
                    "page": 1,
                }
            )
        )
        location, measurements = fetch(location_url), fetch(measurements_url)
        payload = normalize(
            location,
            measurements,
            review,
            datetime.now(timezone.utc),
            version,
            [location_url, measurements_url],
        )
        immutable_directory(
            Path(output)
            / f"provider-{review['provider_id']}-sensor-{review['sensor_id']}"
            / version,
            {"snapshot.json": encode(payload), "review.json": encode(review)},
        )
    return "RESEARCH_ONLY"


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--enable-research", action="store_true")
    parser.add_argument("--output", type=Path, default=ROOT / "data/staging/openaq")
    args = parser.parse_args()
    print("OpenAQ adapter:", acquire(args.output, enabled=args.enable_research))
