"""Bounded offline USGS/GFS acquisition and atomic immutable static publication."""

import argparse
import hashlib
import json
import math
import os
import shutil
import socket
import ssl
import tempfile
import time as clock
from datetime import datetime, timedelta, timezone
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.parse import urlencode, urlsplit
from urllib.request import HTTPRedirectHandler, HTTPSHandler, Request, build_opener

import certifi
import numpy as np
from jsonschema import Draft7Validator, FormatChecker
from rasterio.io import MemoryFile

from .contracts import ROOT
from .live_contracts import parse_live_index, parse_live_snapshot, require, validate_live_pair
from .live_fixtures import encode

POLICY_BYTES = (ROOT / "licensing/live-sources.json").read_bytes()
SOURCES = json.loads(POLICY_BYTES)["sources"]
POLICY_HASH = hashlib.sha256(POLICY_BYTES).hexdigest()
BOUNDS = (80, 26, 89, 31)
HISTORY_LIMIT = 8
RAW_LIMIT = 2 * 1024 * 1024
NOTICE = "Periodically updated conditions; not a real-time warning service."
OUTPUTS = dict.fromkeys(
    (
        "physical_inundation",
        "destroyed_buildings",
        "casualties",
        "repair_costs",
        "hydropower_downtime",
        "economic_loss",
    )
)


def iso(value):
    return value.astimezone(timezone.utc).isoformat(timespec="milliseconds").replace("+00:00", "Z")


def number(value, nullable=True):
    require(
        (value is None and nullable)
        or (
            isinstance(value, (int, float)) and not isinstance(value, bool) and math.isfinite(value)
        ),
        "Invalid source number",
    )
    return value


class FeedError(ValueError):
    def __init__(self, code):
        self.code = code
        super().__init__(code)  # Never include request headers, credentials or response bodies.


class ValidEmptyResponse(bytes):
    """Documented USGS HTTP 204, distinct from a malformed empty HTTP 200 body."""


class NoRedirect(HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        raise FeedError("http_error")


def download(url, limit=RAW_LIMIT, headers=None):
    parsed = urlsplit(url)
    require(
        parsed.scheme == "https"
        and not parsed.username
        and not parsed.password
        and parsed.hostname in ("earthquake.usgs.gov", "nomads.ncep.noaa.gov"),
        "Unapproved source URL",
    )
    opener = build_opener(
        HTTPSHandler(context=ssl.create_default_context(cafile=certifi.where())), NoRedirect()
    )
    started = clock.monotonic()
    try:
        with opener.open(
            Request(url, headers={"User-Agent": "Himalayan-Disaster-Atlas/1.0", **(headers or {})}),
            timeout=20,
        ) as response:
            if response.status == 204 and parsed.hostname == "earthquake.usgs.gov":
                return ValidEmptyResponse()
            if response.status != 200:
                raise FeedError("http_error")
            length = response.headers.get("Content-Length")
            if length and (not length.isdigit() or int(length) > limit):
                raise FeedError("invalid_data")
            parts, size = [], 0
            while True:
                part = response.read(min(65536, limit + 1 - size))
                if not part:
                    break
                parts.append(part)
                size += len(part)
                if size > limit:
                    raise FeedError("invalid_data")
                if clock.monotonic() - started > 45:
                    raise FeedError("timeout")
            if not size:
                raise FeedError(
                    "invalid_data"
                )  # An empty HTTP body is NOT a valid empty collection.
            return b"".join(parts)
    except HTTPError as error:
        raise FeedError("http_error") from error
    except (TimeoutError, socket.timeout) as error:
        raise FeedError("timeout") from error
    except URLError as error:
        raise FeedError("network_error") from error


def snapshot(feed, raw, fetched, issued, records, version, limitations, source_version):
    source = {
        key: SOURCES[feed][key]
        for key in (
            "name",
            "url",
            "license",
            "license_url",
            "attribution",
            "license_review",
            "is_official",
        )
    }
    source.update(version=source_version, raw_sha256=hashlib.sha256(raw).hexdigest())
    return parse_live_snapshot(
        {
            "schema_version": "1.0.0",
            "kind": "live-snapshot",
            "dataset_id": "live-" + feed,
            "version": version,
            "id": "snapshot",
            "feed_id": feed,
            "is_fixture": False,
            "source": source,
            "fetched_at": iso(fetched),
            "source_issued_at": None if issued is None else iso(issued),
            "freshness": {
                "basis": "source_issue",
                "as_of": None if issued is None else iso(issued),
                "stale_after_seconds": 21600 if feed == "usgs" else 43200,
                "expires_at": None if feed == "usgs" else records[0]["valid_until"],
            },
            "crs": "OGC:CRS84",
            "evidence_type": "reported" if feed == "usgs" else "modelled",
            "product_type": "reported_event" if feed == "usgs" else "forecast",
            "records": records,
            "assumptions": [
                "Rectangular regional coverage is not a Nepal administrative boundary."
            ],
            "limitations": limitations,
            "unsupported_outputs": OUTPUTS.copy(),
            "notice": NOTICE,
        }
    )


def parse_usgs(raw, fetched, version):
    if isinstance(raw, ValidEmptyResponse):
        return snapshot(
            "usgs",
            raw,
            fetched,
            None,
            [],
            version,
            [
                "USGS HTTP 204 reports no records for this regional query; it is not a failed fetch or an all-clear.",
                "No source generation timestamp accompanies HTTP 204; freshness remains UNKNOWN / STALE.",
            ],
            "ComCat-HTTP-204-no-content",
        )
    payload = json.loads(raw)
    require(
        payload.get("type") == "FeatureCollection" and isinstance(payload.get("features"), list),
        "Malformed USGS collection",
    )
    meta = payload["metadata"]
    require(
        meta.get("status") == 200
        and (meta.get("count") is None or meta["count"] == len(payload["features"]))
        and len(payload["features"]) < 500,
        "Incomplete or truncated USGS collection",
    )
    issued = datetime.fromtimestamp(number(meta["generated"], False) / 1000, timezone.utc)
    require(
        issued <= fetched and fetched - issued <= timedelta(hours=1),
        "USGS source generation time invalid",
    )
    records = []
    for event in payload["features"]:
        p, geometry, identifier = event["properties"], event["geometry"], event["id"]
        require(
            event.get("type") == "Feature"
            and geometry["type"] == "Point"
            and isinstance(identifier, str)
            and 0 < len(identifier) <= 100,
            "Malformed USGS identity",
        )
        lon, lat, depth = geometry["coordinates"]
        number(lon, False), number(lat, False), number(depth)
        require(80 <= lon <= 89 and 26 <= lat <= 31, "USGS coordinate outside query")
        require(p.get("type") == "earthquake", "USGS product is not an earthquake")
        # Exact reviewed subset, not a blanket rights grant for other ComCat contributors.
        if p.get("net") != "us":
            continue
        observed = datetime.fromtimestamp(number(p["time"], False) / 1000, timezone.utc)
        revised = datetime.fromtimestamp(number(p["updated"], False) / 1000, timezone.utc)
        require(
            fetched - timedelta(days=7, minutes=5) <= observed <= fetched
            and observed <= revised <= fetched,
            "USGS chronology invalid",
        )
        url = p["url"]
        require(
            urlsplit(url).scheme == "https"
            and urlsplit(url).hostname == "earthquake.usgs.gov"
            and not urlsplit(url).username
            and not urlsplit(url).password,
            "Invalid USGS record URL",
        )
        mag, mag_type = number(p.get("mag")), p.get("magType")
        require(
            mag is None or (isinstance(mag_type, str) and bool(mag_type.strip())),
            "Magnitude type UNKNOWN",
        )
        label = p.get("place")
        require(
            label is None or (isinstance(label, str) and 0 < len(label) <= 240),
            "Malformed source place",
        )
        records.append(
            {
                "id": identifier,
                "label": label,
                "coordinates": [lon, lat],
                "evidence_type": "reported",
                "observed_at": iso(observed),
                "issued_at": None,
                "valid_from": None,
                "valid_until": None,
                "source_revision_at": iso(revised),
                "source_url": url,
                "source_network": "us",
                "measurements": [
                    {
                        "variable": "magnitude",
                        "value": mag,
                        "unit": "magnitude",
                        "qualifier": mag_type,
                        "evidence_type": "reported",
                    },
                    {
                        "variable": "depth",
                        "value": depth,
                        "unit": "km",
                        "qualifier": "Preferred source depth; vertical reference uncertainty retained",
                        "evidence_type": "reported",
                    },
                ],
            }
        )
    return snapshot(
        "usgs",
        raw,
        fetched,
        issued,
        records,
        version,
        [
            "USGS preferred network summaries only; other preferred networks are withheld pending review.",
            "Past seven days in 80–89 E, 26–31 N; an empty collection is not an all-clear or proof of no earthquakes.",
            "Epicentres are not shaking, damage or affected-area footprints. Completeness and source revisions vary.",
        ],
        "ComCat-generated-" + iso(issued),
    )


def grib_messages(raw):
    messages, offset = [], 0
    while offset < len(raw):
        require(raw[offset : offset + 4] == b"GRIB" and raw[offset + 7] == 2, "Not GRIB2")
        length = int.from_bytes(raw[offset + 8 : offset + 16], "big")
        require(20 <= length <= RAW_LIMIT and offset + length <= len(raw), "Truncated GRIB2")
        message = raw[offset : offset + length]
        require(message[-4:] == b"7777" and message[6] == 0, "Unsupported GRIB discipline")
        sections, position = {}, 16
        while position < length - 4:
            size = int.from_bytes(message[position : position + 4], "big")
            require(size >= 5 and position + size <= length - 4, "Malformed GRIB section")
            tag = message[position + 4]
            require(tag not in sections, "Multi-field GRIB unsupported")
            sections[tag] = message[position : position + size]
            position += size
        require(position == length - 4 and set(sections) == {1, 3, 4, 5, 6, 7}, "Incomplete GRIB")
        messages.append((message, sections))
        require(len(messages) <= 4, "Too many GRIB messages")
        offset += length
    require(messages, "Empty GRIB is not a forecast")
    return messages


def parse_gfs(raw, fetched, version, cycle, lead=24):
    require(
        lead == 24 and cycle.hour in (0, 6, 12, 18) and cycle.minute == cycle.second == 0,
        "Unreviewed GFS selection",
    )
    selected = []
    for message, sections in grib_messages(raw):
        ref, grid, p = sections[1], sections[3], sections[4]
        require(
            len(ref) == 21
            and int.from_bytes(ref[5:7], "big") == 7
            and ref[11] == 1
            and ref[19:] == bytes([0, 1]),
            "Not operational NCEP forecast",
        )
        actual = datetime(int.from_bytes(ref[12:14], "big"), *ref[14:19], tzinfo=timezone.utc)
        require(actual == cycle and actual <= fetched, "GFS reference cycle mismatch")
        require(
            len(grid) == 72
            and grid[12:14] == b"\x00\x00"
            and int.from_bytes(grid[30:34], "big") == 37
            and int.from_bytes(grid[34:38], "big") == 21,
            "Unreviewed GFS grid",
        )
        require(
            len(p) == 58
            and p[7:9] == b"\x00\x08"
            and p[9:11] == bytes([1, 8])
            and p[11] == 2
            and p[17] == 1
            and p[22] == 1
            and p[28] == 255
            and p[41] == 1
            and p[42:46] == bytes(4)
            and p[46:49] == bytes([1, 2, 1]),
            "Unreviewed GFS APCP interval template",
        )
        start, duration = int.from_bytes(p[18:22], "big"), int.from_bytes(p[49:53], "big")
        until = datetime(int.from_bytes(p[34:36], "big"), *p[36:41], tzinfo=timezone.utc)
        require(
            until == cycle + timedelta(hours=lead) and start + duration == lead,
            "GFS interval mismatch",
        )
        if (start, duration) == (18, 6):
            selected.append((message, p[13], until))
    require(len(selected) == 1, "Required six-hour APCP field missing or duplicated")
    message, process, until = selected[0]
    records = []
    with MemoryFile(message) as mem, mem.open() as ds:
        require(
            ds.driver == "GRIB"
            and ds.count == 1
            and ds.shape == (21, 37)
            and ds.tags(1).get("GRIB_UNIT") == "[kg/(m^2)]",
            "GFS unit or dimensions mismatch",
        )
        values = ds.read(1, masked=True)
        for row in range(21):
            for col in range(37):
                lon, lat = ds.xy(row, col)
                require(
                    abs(lon - (80 + col * 0.25)) < 1e-8 and abs(lat - (31 - row * 0.25)) < 1e-8,
                    "GFS grid alignment mismatch",
                )
                value = (
                    None if bool(np.ma.getmaskarray(values)[row, col]) else float(values[row, col])
                )
                number(value)
                require(value is None or value >= 0, "Negative GFS precipitation")
                records.append(
                    {
                        "id": f"gfs-{row}-{col}",
                        "label": None,
                        "coordinates": [lon, lat],
                        "evidence_type": "modelled",
                        "observed_at": None,
                        "issued_at": iso(cycle),
                        "valid_from": iso(cycle + timedelta(hours=18)),
                        "valid_until": iso(until),
                        "measurements": [
                            {
                                "variable": "precipitation_accumulation",
                                "value": value,
                                "unit": "mm",
                                "qualifier": "6-hour accumulation; 1 kg/m2 water equivalent = 1 mm",
                                "evidence_type": "modelled",
                            }
                        ],
                    }
                )
    return snapshot(
        "noaa-gfs",
        raw,
        fetched,
        cycle,
        records,
        version,
        [
            "One six-hour forecast interval, cycle +18 to +24 hours; not a daily total or station observation.",
            "Native 0.25 degree grid centres; mountainous sub-grid rainfall and uncertainty are unresolved.",
            "Model product and generating-process identifier are retained; exact operational solver build is UNKNOWN.",
            "No warning, anomaly classification, ensemble range or impact calculation is produced.",
        ],
        f"gfs.{cycle:%Y%m%d}/{cycle:%H};0p25;f024;process-{process}",
    )


def usgs_url(now):
    return "https://earthquake.usgs.gov/fdsnws/event/1/query?" + urlencode(
        {
            "format": "geojson",
            "starttime": iso(now - timedelta(days=7)),
            "endtime": iso(now),
            "minlongitude": 80,
            "maxlongitude": 89,
            "minlatitude": 26,
            "maxlatitude": 31,
            "eventtype": "earthquake",
            "orderby": "time-asc",
            "limit": 500,
            "nodata": 204,
        }
    )


def gfs_selection(now):
    candidate = now - timedelta(
        hours=5
    )  # Publication lag; never silently fall back to a different product.
    cycle = candidate.replace(hour=candidate.hour // 6 * 6, minute=0, second=0, microsecond=0)
    url = "https://nomads.ncep.noaa.gov/cgi-bin/filter_gfs_0p25.pl?" + urlencode(
        {
            "file": f"gfs.t{cycle:%H}z.pgrb2.0p25.f024",
            "lev_surface": "on",
            "var_APCP": "on",
            "subregion": "",
            "leftlon": 80,
            "rightlon": 89,
            "bottomlat": 26,
            "toplat": 31,
            "dir": f"/gfs.{cycle:%Y%m%d}/{cycle:%H}/atmos",
        }
    )
    return cycle, url


def atomic_file(path, raw):
    path.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.NamedTemporaryFile(dir=path.parent, delete=False) as output:
        temp = Path(output.name)
        try:
            output.write(raw)
            output.flush()
            os.fsync(output.fileno())
            os.replace(temp, path)
        finally:
            temp.unlink(missing_ok=True)


def immutable_directory(directory, content):
    if directory.exists():
        require(
            {p.name for p in directory.iterdir()} == set(content)
            and all((directory / name).read_bytes() == raw for name, raw in content.items()),
            "Immutable live release conflict",
        )
        return
    directory.parent.mkdir(parents=True, exist_ok=True)
    stage = Path(tempfile.mkdtemp(dir=directory.parent, prefix=".stage-"))
    try:
        for name, raw in content.items():
            with (stage / name).open("xb") as output:
                output.write(raw)
                output.flush()
                os.fsync(output.fileno())
        os.rename(stage, directory)  # Same-filesystem whole-release promotion.
    finally:
        if stage.exists():
            shutil.rmtree(stage)


def publish_snapshot(root, payload, url):
    raw = encode(parse_live_snapshot(payload))
    require(len(raw) <= 524288, "Normalized live snapshot exceeds budget")
    ref = {key: payload[key] for key in ("dataset_id", "version", "id")}
    ref.update(
        path=f"/data/{ref['dataset_id']}/{ref['version']}/{ref['id']}.json",
        sha256=hashlib.sha256(raw).hexdigest(),
        byte_size=len(raw),
    )
    review = SOURCES[payload["feed_id"]]
    manifest = {
        "schema_version": "1.0.0",
        "kind": "live-source-release",
        "snapshot": ref,
        "processing_version": "live-open-feeds/1.0.0",
        "source_request_url": url,
        "source_terms_policy_sha256": POLICY_HASH,
        "licence_review": {
            "status": "PERMITTED",
            "reviewed_on": json.loads(POLICY_BYTES)["reviewed_on"],
            "evidence_urls": review["evidence_urls"],
            "obligations": review["obligations"],
        },
    }
    immutable_directory(
        root / "data" / ref["dataset_id"] / ref["version"],
        {"snapshot.json": raw, "manifest.json": encode(manifest)},
    )
    return ref


def run(root, downloader=download, now=None, run_url=None):
    root = Path(root)
    started = now or datetime.now(timezone.utc)
    # Nanosecond transaction identity, not a measurement or source time; immutable semantic version.
    version = "1.0." + str(int(started.timestamp() * 1000000))
    pointer = root / "live/latest.json"
    previous = parse_live_index(json.loads(pointer.read_bytes())) if pointer.exists() else None
    if previous:
        verify_publication(root)  # Corrupt previous snapshots must not be silently re-promoted.
    feeds = []
    for feed_id in ("usgs", "noaa-gfs"):
        attempt = now or datetime.now(timezone.utc)
        old = (
            next((f for f in previous["feeds"] if f["feed_id"] == feed_id), None)
            if previous
            else None
        )
        feed = {
            "feed_id": feed_id,
            "enabled": True,
            "attempt_status": "failed",
            "last_attempt_at": iso(attempt),
            "last_successful_fetch_at": old["last_successful_fetch_at"] if old else None,
            "snapshot": old["snapshot"] if old else None,
            "error_code": "invalid_data",
        }
        try:
            if feed_id == "usgs":
                url = usgs_url(attempt)
                raw = downloader(url)
                fetched = now or datetime.now(timezone.utc)
                payload = parse_usgs(raw, fetched, version)
            else:
                cycle, url = gfs_selection(attempt)
                raw = downloader(url)
                fetched = now or datetime.now(timezone.utc)
                payload = parse_gfs(raw, fetched, version, cycle)
            # Keep raw source evidence locally, never ship arbitrary upstream response bodies to the browser.
            raw_path = ROOT / "data/raw/live" / payload["source"]["raw_sha256"]
            if downloader is download:
                if raw_path.exists():
                    require(raw_path.read_bytes() == raw, "Source hash conflict")
                else:
                    atomic_file(raw_path, raw)
            feed.update(
                snapshot=publish_snapshot(root, payload, url),
                attempt_status="success",
                error_code=None,
                last_attempt_at=iso(fetched),
                last_successful_fetch_at=iso(fetched),
            )
        except FeedError as error:
            feed["error_code"] = error.code
        except (ValueError, KeyError, TypeError, OverflowError, IndexError):
            feed["error_code"] = "invalid_data"
        feeds.append(feed)
    successful = sum(f["attempt_status"] == "success" for f in feeds)
    index = parse_live_index(
        {
            "schema_version": "1.0.0",
            "kind": "live-index",
            "is_fixture": False,
            "generated_at": iso(now or datetime.now(timezone.utc)),
            "workflow": {
                "status": "success"
                if successful == len(feeds)
                else "partial"
                if successful
                else "failed",
                "last_attempt_at": max(f["last_attempt_at"] for f in feeds),
                "last_successful_fetch_at": max(
                    (f["last_successful_fetch_at"] for f in feeds if f["last_successful_fetch_at"]),
                    default=None,
                ),
                "run_url": run_url,
                "schedule_seconds": 10800,
                "stale_after_seconds": 21600,
            },
            "feeds": feeds,
        }
    )
    for feed in index["feeds"]:
        if feed["snapshot"]:
            validate_live_pair(
                index,
                feed,
                parse_live_snapshot(
                    json.loads((root / feed["snapshot"]["path"].lstrip("/")).read_bytes())
                ),
            )
    verify_publication(root, index)
    raw = encode(index)
    history = root / "live/history" / version
    immutable_directory(history, {"index.json": raw})
    # Promotion is the final operation; a failed staging operation never alters the pointer.
    atomic_file(pointer, raw)
    verify_publication(root)
    return index


def verify_publication(root, index=None):
    from referencing import Registry, Resource

    schemas = [
        json.loads((ROOT / "schemas" / name).read_bytes())
        for name in ("live-snapshot.schema.json", "live-index.schema.json")
    ]
    registry = Registry().with_resources((s["$id"], Resource.from_contents(s)) for s in schemas)
    schema = json.loads((ROOT / "schemas/live-release.schema.json").read_bytes())
    validator = Draft7Validator(schema, registry=registry, format_checker=FormatChecker())
    index = parse_live_index(
        index if index is not None else json.loads((root / "live/latest.json").read_bytes())
    )
    require(not index["is_fixture"], "Fixtures are not conditions")
    for feed in index["feeds"]:
        require(feed["feed_id"] in SOURCES, "Unapproved public source")
        if not feed["snapshot"]:
            continue
        ref = feed["snapshot"]
        path = root / ref["path"].lstrip("/")
        raw = path.read_bytes()
        require(
            len(raw) == ref["byte_size"] and hashlib.sha256(raw).hexdigest() == ref["sha256"],
            "Live artifact checksum mismatch",
        )
        payload = parse_live_snapshot(json.loads(raw))
        validate_live_pair(index, feed, payload)
        manifest = json.loads(path.with_name("manifest.json").read_bytes())
        validator.validate(manifest)
        review = SOURCES[feed["feed_id"]]
        require(
            manifest["snapshot"] == ref and manifest["source_terms_policy_sha256"] == POLICY_HASH,
            "Live release review differs",
        )
        require(
            all(
                payload["source"][key] == review[key]
                for key in (
                    "name",
                    "url",
                    "license",
                    "license_url",
                    "attribution",
                    "license_review",
                    "is_official",
                )
            ),
            "Unreviewed live source",
        )
        require(
            manifest["licence_review"]
            == {
                "status": "PERMITTED",
                "reviewed_on": json.loads(POLICY_BYTES)["reviewed_on"],
                "evidence_urls": review["evidence_urls"],
                "obligations": review["obligations"],
            },
            "Unreviewed release terms",
        )
        url = urlsplit(manifest["source_request_url"])
        require(
            url.scheme == "https"
            and url.hostname == review["request_host"]
            and url.path == review["request_path"]
            and not url.username
            and not url.password,
            "Unreviewed source interface",
        )
        if feed["feed_id"] == "usgs":
            require(
                all(record.get("source_network") == "us" for record in payload["records"]),
                "Unreviewed contributor",
            )
    return index


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output", type=Path, default=ROOT / "data/live-publication")
    parser.add_argument("--run-url")
    args = parser.parse_args()
    result = run(args.output, run_url=args.run_url)
    print("Published workflow state:", result["workflow"]["status"])
