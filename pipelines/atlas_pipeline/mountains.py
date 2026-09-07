"""Acquire and publish Nepal mountain/peak records from the GeoNames country dump."""

import argparse
import csv
import hashlib
import io
import json
import urllib.request
import zipfile
from pathlib import Path

from .contracts import ROOT
from .vector_release import publish_vector, write_immutable

SOURCE_URL = "https://download.geonames.org/export/dump/NP.zip"
SOURCE_PAGE = "https://www.geonames.org/export/"
SOURCE_SHA256 = "91c9846e94a9bb37c54aae983bb203635566bbd4e353958653a7b2dfaea04262"
SOURCE_SNAPSHOT = "2026-09-07"
VERSION = "1.0.0"
RETRIEVAL_DATE = "2026-09-07T00:00:00Z"
PROCESSING_DATE = "2026-09-07T00:00:00Z"
PUBLICATION_DATE = "2026-09-07T03:50:00Z"
BBOX = [80.0, 26.0, 89.0, 31.0]
FEATURE_CODES = {"PK", "MT"}
MAX_SOURCE_BYTES = 8_000_000


def sha256(content):
    return hashlib.sha256(content).hexdigest()


def acquire(root, source=None):
    raw = root / f"data/raw/geonames-nepal/{SOURCE_SHA256}.zip"
    if source:
        content = Path(source).read_bytes()
    elif raw.exists():
        content = raw.read_bytes()
    else:
        request = urllib.request.Request(SOURCE_URL, headers={"User-Agent": "Himalayan-Disaster-Atlas/0.1"})
        with urllib.request.urlopen(request, timeout=60) as response:
            content = response.read(MAX_SOURCE_BYTES + 1)
    if len(content) > MAX_SOURCE_BYTES:
        raise ValueError("GeoNames source archive exceeds the acquisition budget")
    if sha256(content) != SOURCE_SHA256:
        raise ValueError("GeoNames source checksum mismatch")
    raw.parent.mkdir(parents=True, exist_ok=True)
    if not raw.exists():
        raw.write_bytes(content)
    return raw


def source_rows(archive):
    with zipfile.ZipFile(archive) as bundle:
        names = set(bundle.namelist())
        if "NP.txt" not in names or "readme.txt" not in names:
            raise ValueError("GeoNames archive is missing NP.txt or licensing README")
        if any(name.startswith("/") or ".." in Path(name).parts for name in names):
            raise ValueError("GeoNames archive contains an unsafe path")
        if bundle.getinfo("NP.txt").file_size > 25_000_000:
            raise ValueError("GeoNames Nepal table exceeds the processing budget")
        text = io.TextIOWrapper(bundle.open("NP.txt"), encoding="utf-8", newline="")
        yield from csv.reader(text, delimiter="\t")


def clean_aliases(name, ascii_name, alternate_names):
    candidates = [name, ascii_name, *(alternate_names.split(",") if alternate_names else [])]
    result = []
    seen = set()
    for candidate in candidates:
        value = candidate.strip()
        key = value.casefold()
        if value and key not in seen:
            seen.add(key)
            result.append(value)
        if len(result) == 24:
            break
    return result


def normalize(rows):
    features = []
    source_ids = set()
    coordinate_keys = set()
    suspicious_duplicate_coordinates = 0
    for row in rows:
        if len(row) < 19 or row[6] != "T" or row[7] not in FEATURE_CODES:
            continue
        geoname_id, name, ascii_name, alternate_names = row[:4]
        latitude, longitude = float(row[4]), float(row[5])
        if not (BBOX[0] <= longitude <= BBOX[2] and BBOX[1] <= latitude <= BBOX[3]):
            raise ValueError(f"Mountain record {geoname_id} falls outside the plausible Nepal envelope")
        if geoname_id in source_ids:
            raise ValueError(f"Duplicate GeoNames identifier {geoname_id}")
        source_ids.add(geoname_id)
        elevation = int(row[15]) if row[15].strip() else None
        if elevation is not None and not 0 <= elevation <= 9000:
            raise ValueError(f"Implausible mountain elevation for {geoname_id}")
        coordinate_key = (round(longitude, 5), round(latitude, 5), name.casefold())
        if coordinate_key in coordinate_keys:
            suspicious_duplicate_coordinates += 1
        coordinate_keys.add(coordinate_key)
        aliases = clean_aliases(name, ascii_name, alternate_names)
        feature_id = f"geonames-{geoname_id}"
        features.append(
            {
                "type": "Feature",
                "id": feature_id,
                "properties": {
                    "dataset_id": "nepal-mountains",
                    "dataset_version": VERSION,
                    "name": name,
                    "is_fixture": False,
                    "value": elevation,
                    "unit": "m" if elevation is not None else None,
                    "entity_type": "mountain",
                    "source_id": geoname_id,
                    "search_terms": aliases,
                    "aliases": aliases[1:],
                    "feature_code": row[7],
                    "source_modified": row[18],
                    "elevation_reference": (
                        "GeoNames elevation field (metres); source does not publish a per-record vertical datum or accuracy"
                        if elevation is not None
                        else "UNKNOWN"
                    ),
                },
                "geometry": {"type": "Point", "coordinates": [longitude, latitude]},
            }
        )
    if not features:
        raise ValueError("GeoNames source contains no supported peak/mountain records")
    features.sort(key=lambda feature: int(feature["properties"]["source_id"]))
    return features, suspicious_duplicate_coordinates


def run(root=ROOT, source=None):
    archive = acquire(root, source)
    features, duplicate_coordinate_count = normalize(source_rows(archive))
    collection = {"type": "FeatureCollection", "features": features}
    known_elevations = [f["properties"]["value"] for f in features if f["properties"]["value"] is not None]
    metadata = {
        "schema_version": "1.0.0",
        "dataset_id": "nepal-mountains",
        "dataset_name": "Nepal mountains and peaks (GeoNames)",
        "dataset_version": VERSION,
        "source": f"GeoNames Nepal country dump snapshot {SOURCE_SNAPSHOT}",
        "source_url": SOURCE_PAGE,
        "license": "Creative Commons Attribution 4.0 International (CC BY 4.0)",
        "license_url": "https://creativecommons.org/licenses/by/4.0/",
        "attribution": "GeoNames geographical database (geonames.org)",
        "observation_date": None,
        "publication_date": PUBLICATION_DATE,
        "retrieval_date": RETRIEVAL_DATE,
        "processing_date": PROCESSING_DATE,
        "processing_version": "mountains-pipeline-1.0.0",
        "method": (
            f"Pinned GeoNames NP.zip by SHA-256 {SOURCE_SHA256}; selected feature class T records with feature codes PK and MT; "
            "retained stable GeoNames IDs, source point coordinates, explicit source elevations when present, names and bounded aliases; "
            "validated identifiers, coordinate envelope, duplicate IDs, duplicate name/coordinate keys, and plausible elevation range; "
            "published deterministic CRS84 point GeoJSON."
        ),
        "spatial_resolution": {"value": None, "unit": None},
        "temporal_resolution": None,
        "spatial_coverage": {"description": "GeoNames mountain and peak records assigned to Nepal", "bbox": BBOX},
        "temporal_coverage": {"start": None, "end": None},
        "crs": "OGC:CRS84",
        "status": "VERIFIED_SOURCE",
        "evidence_type": "observed",
        "is_fixture": False,
        "limitations": [
            "GeoNames is a gazetteer, not a definitive mountaineering or geodetic peak inventory; completeness and naming vary by contributor and source.",
            "A GeoNames country assignment does not resolve international boundary disputes or imply that a transboundary summit belongs exclusively to Nepal.",
            "Only PK and MT feature codes are published here; mountain ranges (MTS) are intentionally excluded from the peak catalogue.",
            "Elevation is shown only when the GeoNames elevation field is populated. The DEM fallback field is not substituted for a missing summit elevation.",
            "GeoNames does not publish a per-record positional or elevation uncertainty, so source coordinate/elevation uncertainty remains unknown.",
        ],
        "uncertainty": "Per-record horizontal and vertical accuracy are not supplied by GeoNames. Conflicting summit coordinates or elevations from other authorities must be preserved as source differences rather than silently reconciled.",
        "update_frequency": "periodic",
        "stale_after": "2027-09-07T00:00:00Z",
    }
    result = publish_vector(root, metadata, collection)
    report = {
        "source_sha256": SOURCE_SHA256,
        "source_snapshot": SOURCE_SNAPSHOT,
        "features": len(features),
        "known_elevations": len(known_elevations),
        "minimum_known_elevation_m": min(known_elevations),
        "maximum_known_elevation_m": max(known_elevations),
        "duplicate_name_coordinate_keys": duplicate_coordinate_count,
        "supported_feature_codes": sorted(FEATURE_CODES),
    }
    write_immutable(root / f"data/releases/nepal-mountains/{VERSION}/qa.json", (json.dumps(report, indent=2) + "\n").encode())
    print(f"Validated and published {len(features)} GeoNames mountain/peak records")
    return result, report


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--source", type=Path)
    args = parser.parse_args()
    run(source=args.source)
