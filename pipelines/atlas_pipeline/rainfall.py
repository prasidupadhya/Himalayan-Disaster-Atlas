"""Publish a static BIPAD/DHM rainfall-station snapshot."""

import argparse
import hashlib
import json
import urllib.request
from datetime import datetime, timedelta, timezone
from pathlib import Path

from .contracts import ROOT
from .vector_release import publish_vector, write_immutable

VERSION = "1.0.0"
DATASET_ID = "nepal-rainfall-stations"
SOURCE_URL = "https://bipadportal.gov.np/api/v1/rain-stations/?limit=1000"
API_DOCS = "https://bipadportal.gov.np/api/"


def utc(value):
    return (
        datetime.fromisoformat(value).astimezone(timezone.utc).isoformat().replace("+00:00", "Z")
        if value
        else None
    )


def acquire(root, source=None):
    if source:
        content = Path(source).read_bytes()
    else:
        request = urllib.request.Request(
            SOURCE_URL, headers={"User-Agent": "Himalayan-Disaster-Atlas/0.1"}
        )
        with urllib.request.urlopen(request, timeout=60) as response:
            content = response.read(4_000_000)
    digest = hashlib.sha256(content).hexdigest()
    path = root / f"data/raw/bipad/{digest}-rain-stations.json"
    path.parent.mkdir(parents=True, exist_ok=True)
    if not path.exists():
        path.write_bytes(content)
    return path, digest


def normalize(path):
    rows = json.loads(path.read_text()).get("results")
    if not isinstance(rows, list) or not rows:
        raise ValueError("BIPAD rainfall response has no results")
    features, seen = [], set()
    for row in rows:
        source_id = str(row["id"])
        if source_id in seen:
            raise ValueError(f"Duplicate rainfall station {source_id}")
        seen.add(source_id)
        lon, lat = map(float, row["point"]["coordinates"])
        if not (80 <= lon <= 89.5 and 26 <= lat <= 31.5):
            raise ValueError(f"Rainfall station outside Nepal: {source_id}")
        intervals = {
            int(item["interval"]): (None if item.get("value") is None else float(item["value"]))
            for item in row.get("averages", [])
        }
        values = {hours: intervals.get(hours) for hours in (1, 3, 6, 12, 24)}
        if any(value is not None and value < 0 for value in values.values()):
            raise ValueError(f"Negative rainfall at {source_id}")
        quality_warning = any(value is not None and value > 5000 for value in values.values())
        name = str(row.get("title") or f"BIPAD rainfall station {source_id}")
        basin = row.get("basin") or None
        features.append(
            {
                "type": "Feature",
                "id": f"bipad-rain-station-{source_id}",
                "properties": {
                    "dataset_id": DATASET_ID,
                    "dataset_version": VERSION,
                    "name": name,
                    "is_fixture": False,
                    "value": values[24],
                    "unit": "mm" if values[24] is not None else None,
                    "entity_type": "rainfall_station",
                    "source_id": source_id,
                    "search_terms": list(
                        dict.fromkeys([name, source_id, *([str(basin)] if basin else [])])
                    ),
                    "station_name": name,
                    "basin": basin,
                    "observation_time": utc(row.get("measuredOn")),
                    "station_status": str(row.get("status") or "UNKNOWN"),
                    "station_series_id": str(row.get("stationSeriesId") or source_id),
                    "provider": "hydrology.gov.np",
                    "elevation_m": None
                    if row.get("elevation") is None
                    else float(row["elevation"]),
                    "coordinate_order_repaired": False,
                    **{f"rainfall_{hours}h_mm": values[hours] for hours in (1, 3, 6, 12, 24)},
                    "rainfall_quality_warning": quality_warning,
                },
                "geometry": {"type": "Point", "coordinates": [lon, lat]},
            }
        )
    features.sort(key=lambda f: int(f["properties"]["source_id"]))
    return features


def run(root=ROOT, source=None):
    release = root / f"data/releases/{DATASET_ID}/{VERSION}/manifest.json"
    if release.exists() and source is None:
        print(f"Existing immutable {DATASET_ID}@{VERSION} release retained")
        return
    path, digest = acquire(root, source)
    features = normalize(path)
    observed = [
        f["properties"]["observation_time"] for f in features if f["properties"]["observation_time"]
    ]
    now = datetime.now(timezone.utc).replace(microsecond=0)
    coords = [f["geometry"]["coordinates"] for f in features]
    metadata = {
        "schema_version": "1.0.0",
        "dataset_id": DATASET_ID,
        "dataset_name": "Nepal rainfall monitoring stations — BIPAD / DHM snapshot",
        "dataset_version": VERSION,
        "source": "BIPAD rain-stations API; underlying rainfall observations from Department of Hydrology and Meteorology",
        "source_url": API_DOCS,
        "license": "Government of Nepal public API; standalone redistribution licence is not stated in the API documentation",
        "license_url": API_DOCS,
        "attribution": "BIPAD Portal, NDRRMA; Department of Hydrology and Meteorology, Government of Nepal",
        "observation_date": max(observed),
        "publication_date": None,
        "retrieval_date": now.isoformat().replace("+00:00", "Z"),
        "processing_date": now.isoformat().replace("+00:00", "Z"),
        "processing_version": "rainfall-pipeline-1.0.0",
        "method": f"Pinned one BIPAD rain-station response by SHA-256 {digest}; retained station identity, point, measurement time and 1/3/6/12/24-hour source accumulation values. Missing values remain null; nonnegative values are not converted to hazard classes.",
        "spatial_resolution": {"value": None, "unit": None},
        "temporal_resolution": "source rolling accumulation intervals: 1, 3, 6, 12 and 24 hours",
        "spatial_coverage": {
            "description": "BIPAD rainfall monitoring stations in Nepal",
            "bbox": [
                min(c[0] for c in coords),
                min(c[1] for c in coords),
                max(c[0] for c in coords),
                max(c[1] for c in coords),
            ],
        },
        "temporal_coverage": {"start": min(observed), "end": max(observed)},
        "crs": "OGC:CRS84",
        "status": "VERIFIED_SOURCE",
        "evidence_type": "observed",
        "is_fixture": False,
        "limitations": [
            "Cached snapshot, not a live rainfall service.",
            "Missing source accumulations remain UNKNOWN and are never converted to zero.",
            "Two stations contain source accumulation values above 5,000 mm in at least one interval; values are preserved but explicitly quality-flagged rather than treated as ordinary measurements.",
            "Station status is source-reported and not a spatial rainfall hazard classification.",
            "BIPAD API documentation does not publish a standalone redistribution licence; source terms should be re-audited before external redistribution.",
        ],
        "uncertainty": "Gauge calibration, maintenance, telemetry quality and representativeness between stations are not independently validated by the atlas.",
        "update_frequency": "operational",
        "stale_after": (now + timedelta(hours=24)).isoformat().replace("+00:00", "Z"),
    }
    publish_vector(root, metadata, {"type": "FeatureCollection", "features": features})
    qa = {
        "source_sha256": digest,
        "features": len(features),
        "rainfall_24h_known": sum(f["properties"]["rainfall_24h_mm"] is not None for f in features),
        "quality_warning": sum(f["properties"]["rainfall_quality_warning"] for f in features),
        "observation_time_min": min(observed),
        "observation_time_max": max(observed),
    }
    write_immutable(
        root / f"data/releases/{DATASET_ID}/{VERSION}/qa.json",
        (json.dumps(qa, indent=2) + "\n").encode(),
    )
    print(f"Validated and published {len(features)} BIPAD rainfall stations")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--source", type=Path)
    args = parser.parse_args()
    run(source=args.source)
