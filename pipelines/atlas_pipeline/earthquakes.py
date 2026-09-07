"""Publish a Nepal-region USGS ComCat earthquake snapshot."""

import argparse
import hashlib
import json
from datetime import datetime, timedelta, timezone
from pathlib import Path

from .contracts import ROOT
from .vector_release import publish_vector, write_immutable

VERSION = "1.0.0"
DATASET_ID = "nepal-region-earthquakes"
QUERY = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2000-01-01&endtime=2026-09-08&minlatitude=26&maxlatitude=31&minlongitude=80&maxlongitude=89&minmagnitude=2.5&orderby=time-asc&limit=20000"


def iso(ms):
    return datetime.fromtimestamp(ms / 1000, timezone.utc).isoformat().replace("+00:00", "Z")


def run(root=ROOT, source=None):
    if source is None:
        raise ValueError("Pinned USGS source required for first publication")
    content = Path(source).read_bytes()
    digest = hashlib.sha256(content).hexdigest()
    payload = json.loads(content)
    features = []
    for item in payload.get("features", []):
        p = item["properties"]
        lon, lat, depth = map(float, item["geometry"]["coordinates"])
        mag = float(p["mag"])
        sid = str(item["id"])
        place = p.get("place") or None
        time = iso(int(p["time"]))
        features.append(
            {
                "type": "Feature",
                "id": f"usgs-earthquake-{sid.lower()}",
                "properties": {
                    "dataset_id": DATASET_ID,
                    "dataset_version": VERSION,
                    "name": place or f"USGS earthquake {sid}",
                    "is_fixture": False,
                    "value": None,
                    "unit": None,
                    "entity_type": "earthquake",
                    "source_id": sid,
                    "search_terms": list(dict.fromkeys([sid, place or "UNKNOWN", str(mag)])),
                    "event_time": time,
                    "magnitude": mag,
                    "depth_km": depth,
                    "place_name": place,
                    "magnitude_type": p.get("magType") or None,
                    "network": str(p.get("net") or "USGS"),
                    "significance": int(p.get("sig") or 0),
                    "event_status": str(p.get("status") or "unknown"),
                    "epicenter_only": True,
                },
                "geometry": {"type": "Point", "coordinates": [lon, lat]},
            }
        )
    if not features:
        raise ValueError("USGS query returned no earthquakes")
    features.sort(key=lambda f: f["properties"]["event_time"])
    now = datetime.now(timezone.utc).replace(microsecond=0)
    times = [f["properties"]["event_time"] for f in features]
    metadata = {
        "schema_version": "1.0.0",
        "dataset_id": DATASET_ID,
        "dataset_name": "USGS ComCat earthquakes in Nepal-region bounding box",
        "dataset_version": VERSION,
        "source": "USGS ANSS Comprehensive Earthquake Catalog (ComCat)",
        "source_url": QUERY,
        "license": "U.S. Geological Survey public data / public-domain and CC0 guidance",
        "license_url": "https://www.usgs.gov/data-management/data-licensing",
        "attribution": "U.S. Geological Survey, ANSS Comprehensive Earthquake Catalog",
        "observation_date": max(times),
        "publication_date": None,
        "retrieval_date": now.isoformat().replace("+00:00", "Z"),
        "processing_date": now.isoformat().replace("+00:00", "Z"),
        "processing_version": "earthquakes-pipeline-1.0.0",
        "method": f"Pinned USGS FDSN GeoJSON response by SHA-256 {digest}; query covers 2000-01-01 through 2026-09-08, latitude 26–31, longitude 80–89 and minimum magnitude 2.5; retained preferred magnitude, depth, time, place, network and status.",
        "spatial_resolution": {"value": None, "unit": None},
        "temporal_resolution": "earthquake origin event",
        "spatial_coverage": {
            "description": "Regional search box around Nepal; events may lie outside Nepal political boundary",
            "bbox": [80, 26, 89, 31],
        },
        "temporal_coverage": {"start": min(times), "end": max(times)},
        "crs": "OGC:CRS84",
        "status": "HISTORICAL",
        "evidence_type": "historical",
        "is_fixture": False,
        "limitations": [
            "Points are epicenters; they are not shaking, damage or affected-area footprints.",
            "Catalog completeness varies through time and by magnitude; the release intentionally uses a minimum magnitude of 2.5.",
            "Depth is generally less constrained than horizontal location and may use network-dependent reference conventions.",
            "The rectangular query includes neighboring-country earthquakes as regional context.",
        ],
        "uncertainty": "Magnitude, location and depth inherit ComCat event uncertainties and preferred-origin updates.",
        "update_frequency": "periodic",
        "stale_after": (now + timedelta(days=30)).isoformat().replace("+00:00", "Z"),
    }
    publish_vector(root, metadata, {"type": "FeatureCollection", "features": features})
    qa = {
        "source_sha256": digest,
        "features": len(features),
        "min_magnitude": min(f["properties"]["magnitude"] for f in features),
        "max_magnitude": max(f["properties"]["magnitude"] for f in features),
        "start": min(times),
        "end": max(times),
    }
    write_immutable(
        root / f"data/releases/{DATASET_ID}/{VERSION}/qa.json",
        (json.dumps(qa, indent=2) + "\n").encode(),
    )
    print(f"Validated and published {len(features)} USGS earthquakes")


if __name__ == "__main__":
    p = argparse.ArgumentParser()
    p.add_argument("--source", type=Path, required=True)
    a = p.parse_args()
    run(source=a.source)
