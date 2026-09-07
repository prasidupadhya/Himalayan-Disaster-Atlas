"""Publish a pinned OpenStreetMap hydropower-plant snapshot for Nepal."""

import argparse
import hashlib
import json
import re
from datetime import datetime, timezone
from pathlib import Path

from .contracts import ROOT
from .vector_release import publish_vector, write_immutable

VERSION = "1.0.0"
DATASET_ID = "nepal-osm-hydropower"
QUERY = """[out:json][timeout:180];
area[\"ISO3166-1\"=\"NP\"][admin_level=2]->.searchArea;
nwr[\"power\"=\"plant\"][\"plant:source\"~\"hydro|water\",i](area.searchArea);
out center tags qt;"""


def capacity_mw(value):
    if value is None or str(value).strip().lower() in {"", "yes", "unknown"}:
        return None
    match = re.fullmatch(r"\s*([0-9]+(?:\.[0-9]+)?)\s*(mw|kw|w)\s*", str(value), flags=re.I)
    if not match:
        return None
    number = float(match.group(1))
    unit = match.group(2).lower()
    return number if unit == "mw" else number / 1000 if unit == "kw" else number / 1_000_000


def run(source, root=ROOT):
    content = Path(source).read_bytes()
    digest = hashlib.sha256(content).hexdigest()
    payload = json.loads(content)
    source_time = payload.get("osm3s", {}).get("timestamp_osm_base")
    if not source_time:
        raise ValueError("OSM response lacks source timestamp")
    features = []
    seen = set()
    for element in payload.get("elements", []):
        tags = element.get("tags", {})
        if tags.get("power") != "plant" or not re.search(
            r"hydro|water", tags.get("plant:source", ""), flags=re.I
        ):
            continue
        osm_type = str(element["type"])
        osm_id = str(element["id"])
        source_id = f"{osm_type}/{osm_id}"
        if source_id in seen:
            raise ValueError(f"Duplicate OSM hydropower ID {source_id}")
        seen.add(source_id)
        center = element if osm_type == "node" else element.get("center", {})
        lon, lat = float(center["lon"]), float(center["lat"])
        if not (80 <= lon <= 89 and 26 <= lat <= 31):
            raise ValueError(f"OSM hydropower center outside Nepal context bounds: {source_id}")
        name = tags.get("name") or tags.get("name:en") or None
        capacity = capacity_mw(tags.get("plant:output:electricity"))
        search_terms = list(
            dict.fromkeys(
                term
                for term in [name, source_id, tags.get("operator"), tags.get("plant:method")]
                if term
            )
        )
        features.append(
            {
                "type": "Feature",
                "id": f"osm-hydropower-{osm_type}-{osm_id}",
                "properties": {
                    "dataset_id": DATASET_ID,
                    "dataset_version": VERSION,
                    "name": name or f"OSM hydropower plant {source_id}",
                    "is_fixture": False,
                    "value": capacity,
                    "unit": "MW" if capacity is not None else None,
                    "entity_type": "hydropower_facility",
                    "source_id": source_id,
                    "search_terms": search_terms,
                    "facility_name": name,
                    "facility_status": "mapped as power=plant; operational status not independently verified",
                    "facility_type": "hydropower plant",
                    "capacity_mw": capacity,
                    "plant_method": tags.get("plant:method") or None,
                    "operator_name": tags.get("operator") or None,
                    "osm_element_type": osm_type,
                    "osm_element_id": osm_id,
                    "osm_source_timestamp": source_time,
                },
                "geometry": {"type": "Point", "coordinates": [lon, lat]},
            }
        )
    features.sort(key=lambda feature: feature["properties"]["source_id"])
    if not features:
        raise ValueError("No OSM hydropower plants found")
    now = datetime.now(timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z")
    capacities = [
        feature["properties"]["capacity_mw"]
        for feature in features
        if feature["properties"]["capacity_mw"] is not None
    ]
    metadata = {
        "schema_version": "1.0.0",
        "dataset_id": DATASET_ID,
        "dataset_name": "Nepal OpenStreetMap hydropower plants",
        "dataset_version": VERSION,
        "source": "OpenStreetMap contributors; controlled Overpass extraction",
        "source_url": "https://www.openstreetmap.org/copyright",
        "license": "Open Data Commons Open Database License (ODbL) 1.0",
        "license_url": "https://opendatacommons.org/licenses/odbl/1-0/",
        "attribution": "© OpenStreetMap contributors · ODbL",
        "observation_date": source_time,
        "publication_date": None,
        "retrieval_date": now,
        "processing_date": now,
        "processing_version": "hydropower-pipeline-1.0.0",
        "method": f"One-time Overpass extraction from the Nepal ISO3166-1 area; only power=plant with plant:source matching hydro/water retained. Ways/relations use source-provided center points. Query: {QUERY}",
        "spatial_resolution": {"value": None, "unit": None},
        "temporal_resolution": None,
        "spatial_coverage": {
            "description": "OpenStreetMap hydropower plants mapped in Nepal",
            "bbox": [80, 26, 89, 31],
        },
        "temporal_coverage": {"start": source_time, "end": source_time},
        "crs": "OGC:CRS84",
        "status": "VERIFIED_SOURCE",
        "evidence_type": "observed",
        "is_fixture": False,
        "limitations": [
            "OpenStreetMap completeness, tagging and update frequency vary; absence does not mean a facility does not exist.",
            "Way/relation presentation uses the OSM-reported center rather than full plant geometry.",
            "power=plant is a mapping tag, not independent confirmation that a facility is currently operational.",
            "Capacity is parsed only from explicit plant:output:electricity values with numeric W/kW/MW units; values such as 'yes' remain UNKNOWN.",
            "Nearby hazards are geographic context only and do not establish vulnerability or damage risk.",
        ],
        "uncertainty": "Facility position and attributes inherit contributor mapping uncertainty; lifecycle status and missing capacities are UNKNOWN.",
        "update_frequency": "static",
        "stale_after": None,
    }
    publish_vector(root, metadata, {"type": "FeatureCollection", "features": features})
    qa = {
        "source_sha256": digest,
        "source_timestamp": source_time,
        "features": len(features),
        "named": sum(feature["properties"]["facility_name"] is not None for feature in features),
        "capacity_known": len(capacities),
        "capacity_total_mw_for_known_records": round(sum(capacities), 3),
    }
    write_immutable(
        root / f"data/releases/{DATASET_ID}/{VERSION}/qa.json",
        (json.dumps(qa, indent=2) + "\n").encode(),
    )
    print(f"Validated and published {len(features)} OSM hydropower plants")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--source", type=Path, required=True)
    args = parser.parse_args()
    run(args.source)
