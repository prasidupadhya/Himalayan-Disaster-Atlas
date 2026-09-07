"""Publish a static BIPAD/DHM river-station snapshot for the Nepal atlas."""

import argparse
import hashlib
import json
import urllib.request
from datetime import datetime, timedelta, timezone
from pathlib import Path

from .contracts import ROOT
from .vector_release import publish_vector, write_immutable

VERSION = "1.0.0"
DATASET_ID = "nepal-hydrology-stations"
SOURCE_URL = "https://bipadportal.gov.np/api/v1/river-stations/?limit=1000"
API_DOCS = "https://bipadportal.gov.np/api/"


def iso_utc(value):
    if value is None:
        return None
    return datetime.fromisoformat(value).astimezone(timezone.utc).isoformat().replace("+00:00", "Z")


def acquire(root, source=None):
    if source:
        content = Path(source).read_bytes()
    else:
        request = urllib.request.Request(SOURCE_URL, headers={"User-Agent": "Himalayan-Disaster-Atlas/0.1"})
        with urllib.request.urlopen(request, timeout=60) as response:
            content = response.read(2_000_000)
    digest = hashlib.sha256(content).hexdigest()
    path = root / f"data/raw/bipad/{digest}-river-stations.json"
    path.parent.mkdir(parents=True, exist_ok=True)
    if not path.exists():
        path.write_bytes(content)
    return path, digest


def normalize(path):
    payload = json.loads(path.read_text())
    rows = payload.get("results")
    if not isinstance(rows, list) or not rows:
        raise ValueError("BIPAD river-station response has no results")
    features = []
    seen = set()
    for row in rows:
        source_id = str(row["id"])
        if source_id in seen:
            raise ValueError(f"Duplicate BIPAD station ID {source_id}")
        seen.add(source_id)
        point = row.get("point") or {}
        coordinates = point.get("coordinates")
        if point.get("type") != "Point" or not coordinates or len(coordinates) != 2:
            raise ValueError(f"Station {source_id} has no valid point")
        lon, lat = map(float, coordinates)
        coordinate_order_repaired = False
        if not (80 <= lon <= 89.5 and 26 <= lat <= 31.5):
            if 80 <= lat <= 89.5 and 26 <= lon <= 31.5:
                lon, lat = lat, lon
                coordinate_order_repaired = True
            else:
                raise ValueError(f"Station {source_id} is outside Nepal plausibility bounds")
        water = None if row.get("waterLevel") is None else float(row["waterLevel"])
        warning = None if row.get("warningLevel") is None else float(row["warningLevel"])
        danger = None if row.get("dangerLevel") is None else float(row["dangerLevel"])
        threshold_order_valid = not (warning is not None and danger is not None and warning > danger)
        name = str(row.get("title") or f"BIPAD river station {source_id}")
        basin = row.get("basin") or None
        search_terms = list(dict.fromkeys([name, source_id, *( [str(basin)] if basin else [] )]))
        features.append({
            "type": "Feature",
            "id": f"bipad-river-station-{source_id}",
            "properties": {
                "dataset_id": DATASET_ID,
                "dataset_version": VERSION,
                "name": name,
                "is_fixture": False,
                "value": water,
                "unit": "m" if water is not None else None,
                "entity_type": "hydrology_station",
                "source_id": source_id,
                "search_terms": search_terms,
                "station_name": name,
                "basin": basin,
                "observation_time": iso_utc(row.get("waterLevelOn")),
                "water_level_m": water,
                "warning_level_m": warning,
                "danger_level_m": danger,
                "threshold_order_valid": threshold_order_valid,
                "station_status": str(row.get("status") or "UNKNOWN"),
                "trend": row.get("steady") or None,
                "station_series_id": str(row.get("stationSeriesId") or source_id),
                "provider": str(row.get("dataSource") or "hydrology.gov.np"),
                "elevation_m": None if row.get("elevation") is None else float(row["elevation"]),
                "coordinate_order_repaired": coordinate_order_repaired,
            },
            "geometry": {"type": "Point", "coordinates": [lon, lat]},
        })
    features.sort(key=lambda item: int(item["properties"]["source_id"]))
    return features


def run(root=ROOT, source=None):
    release = root / f"data/releases/{DATASET_ID}/{VERSION}/manifest.json"
    if release.exists() and source is None:
        print(f"Existing immutable {DATASET_ID}@{VERSION} release retained")
        return
    path, digest = acquire(root, source)
    features = normalize(path)
    observed = [f["properties"]["observation_time"] for f in features if f["properties"]["observation_time"]]
    retrieval = datetime.now(timezone.utc).replace(microsecond=0)
    bounds = [
        min(f["geometry"]["coordinates"][0] for f in features),
        min(f["geometry"]["coordinates"][1] for f in features),
        max(f["geometry"]["coordinates"][0] for f in features),
        max(f["geometry"]["coordinates"][1] for f in features),
    ]
    metadata = {
        "schema_version": "1.0.0",
        "dataset_id": DATASET_ID,
        "dataset_name": "Nepal river monitoring stations — BIPAD / DHM snapshot",
        "dataset_version": VERSION,
        "source": "BIPAD river-stations API; underlying station observations from Department of Hydrology and Meteorology",
        "source_url": API_DOCS,
        "license": "Government of Nepal public API; standalone redistribution licence is not stated in the API documentation",
        "license_url": API_DOCS,
        "attribution": "BIPAD Portal, NDRRMA; Department of Hydrology and Meteorology, Government of Nepal",
        "observation_date": max(observed) if observed else retrieval.isoformat().replace("+00:00", "Z"),
        "publication_date": None,
        "retrieval_date": retrieval.isoformat().replace("+00:00", "Z"),
        "processing_date": retrieval.isoformat().replace("+00:00", "Z"),
        "processing_version": "hydrology-pipeline-1.0.0",
        "method": f"Fetched one public BIPAD river-station snapshot, pinned response bytes by SHA-256 {digest}, retained source station IDs, latest water level/timestamp, thresholds, status, trend, basin and provider without interpolation or fabricated values. One mechanically detectable [latitude, longitude] source coordinate pair is reversed only for browser presentation and explicitly flagged.",
        "spatial_resolution": {"value": None, "unit": None},
        "temporal_resolution": "latest station observation exposed by the BIPAD snapshot",
        "spatial_coverage": {"description": "BIPAD river monitoring stations in Nepal", "bbox": bounds},
        "temporal_coverage": {"start": min(observed) if observed else None, "end": max(observed) if observed else None},
        "crs": "OGC:CRS84",
        "status": "VERIFIED_SOURCE",
        "evidence_type": "observed",
        "is_fixture": False,
        "limitations": [
            "This is a cached operational snapshot, not a live feed; every value is shown with its source observation timestamp.",
            "Some stations have missing water levels, warning levels, danger levels, trend or elevation; missing source values remain UNKNOWN.",
            "BIPAD API pagination reports a sentinel count rather than a reliable total; this release contains every result returned by the pinned limit=1000 response.",
            "A station status is source-reported and must not be generalized to river conditions away from that gauge.",
            "The BIPAD API documentation does not publish a standalone redistribution licence; deployment owners should re-audit source terms before redistribution outside this project.",
            "One source record exposes latitude/longitude in reversed order; the presentation coordinate is repaired only when the raw pair is outside Nepal and the reversed pair is plausible, and the repair flag remains visible.",
        ],
        "uncertainty": "Gauge accuracy, datum, sensor maintenance state and local representativeness are not independently validated by the atlas.",
        "update_frequency": "operational",
        "stale_after": (retrieval + timedelta(hours=24)).isoformat().replace("+00:00", "Z"),
    }
    publish_vector(root, metadata, {"type": "FeatureCollection", "features": features})
    qa = {
        "source_sha256": digest,
        "features": len(features),
        "water_level_known": sum(f["properties"]["water_level_m"] is not None for f in features),
        "warning_level_known": sum(f["properties"]["warning_level_m"] is not None for f in features),
        "danger_level_known": sum(f["properties"]["danger_level_m"] is not None for f in features),
        "threshold_order_inconsistent": sum(not f["properties"]["threshold_order_valid"] for f in features),
        "coordinate_order_repaired": sum(f["properties"]["coordinate_order_repaired"] for f in features),
        "observation_time_min": min(observed) if observed else None,
        "observation_time_max": max(observed) if observed else None,
    }
    write_immutable(root / f"data/releases/{DATASET_ID}/{VERSION}/qa.json", (json.dumps(qa, indent=2) + "\n").encode())
    print(f"Validated and published {len(features)} BIPAD river stations")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--source", type=Path)
    args = parser.parse_args()
    run(source=args.source)
