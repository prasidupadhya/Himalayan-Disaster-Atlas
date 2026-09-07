"""Publish a time-bounded historical BIPAD incident archive with loss summaries."""

import argparse
import hashlib
import json
from collections import Counter
from datetime import datetime, timedelta, timezone
from pathlib import Path

from .contracts import ROOT
from .vector_release import publish_vector, write_immutable

VERSION = "1.0.0"
API_DOCS = "https://bipadportal.gov.np/api/"
PARTITIONS = ((2015, 2016), (2017, 2018), (2019, 2020), (2021, 2022), (2023, 2023), (2024, 2024), (2025, 2025), (2026, 2026))


def utc(value):
    return (
        datetime.fromisoformat(value).astimezone(timezone.utc).isoformat().replace("+00:00", "Z")
        if value
        else None
    )


def read_results(paths):
    rows = []
    hashes = []
    for path in paths:
        content = Path(path).read_bytes()
        hashes.append(hashlib.sha256(content).hexdigest())
        rows.extend(json.loads(content).get("results", []))
    return rows, hashes


def normalize(incident_paths, loss_paths, hazard_path):
    incidents, incident_hashes = read_results(incident_paths)
    losses, loss_hashes = read_results(loss_paths)
    hazard_content = Path(hazard_path).read_bytes()
    hazard_hash = hashlib.sha256(hazard_content).hexdigest()
    hazards = {str(h["id"]): h for h in json.loads(hazard_content).get("results", [])}
    loss_by_id = {str(row["id"]): row for row in losses}
    unique = {}
    for row in incidents:
        key = str(row["id"])
        if key in unique and unique[key] != row:
            raise ValueError(f"Conflicting duplicate incident {key}")
        unique[key] = row
    features = []
    for source_id, row in unique.items():
        point = row.get("point") or {}
        coords = point.get("coordinates")
        if point.get("type") != "Point" or not coords:
            raise ValueError(f"Incident {source_id} has no point")
        lon, lat = map(float, coords)
        if not (80 <= lon <= 89.5 and 26 <= lat <= 31.5):
            raise ValueError(f"Incident {source_id} outside Nepal")
        hazard_id = str(row.get("hazard"))
        hazard = hazards.get(hazard_id)
        if not hazard:
            raise ValueError(f"Unknown hazard {hazard_id}")
        loss_id = None if row.get("loss") is None else str(row["loss"])
        loss = loss_by_id.get(loss_id) if loss_id else None
        if loss_id and loss is None:
            raise ValueError(f"Missing referenced loss {loss_id}")
        title = str(row.get("title") or f"{hazard['titleEn']} incident {source_id}")
        address = (row.get("streetAddress") or "").strip() or None
        desc = (row.get("description") or "").strip() or None
        features.append(
            {
                "type": "Feature",
                "id": f"bipad-incident-{source_id}",
                "properties": {
                    "dataset_id": "TEMP",
                    "dataset_version": VERSION,
                    "name": title,
                    "is_fixture": False,
                    "value": None,
                    "unit": None,
                    "entity_type": "disaster_event",
                    "source_id": source_id,
                    "search_terms": list(
                        dict.fromkeys(
                            [title, source_id, hazard["titleEn"], *([address] if address else [])]
                        )
                    ),
                    "hazard_id": hazard_id,
                    "hazard_name": hazard["titleEn"],
                    "hazard_type": hazard["type"],
                    "event_time": utc(row["incidentOn"]),
                    "event_year": int(row["incidentOn"][:4]),
                    "event_local_date": row["incidentOn"][:10],
                    "reported_time": utc(row.get("reportedOn")),
                    "verified": bool(row.get("verified")),
                    "approved": bool(row.get("approved")),
                    "source_label": row.get("source") or None,
                    "data_source_name": row.get("dataSource") or None,
                    "loss_reference_id": loss_id,
                    "reported_deaths": None
                    if loss is None
                    else int(loss.get("peopleDeathCount") or 0),
                    "reported_injured": None
                    if loss is None
                    else int(loss.get("peopleInjuredCount") or 0),
                    "reported_missing": None
                    if loss is None
                    else int(loss.get("peopleMissingCount") or 0),
                    "reported_affected": None
                    if loss is None
                    else int(loss.get("peopleAffectedCount") or 0),
                    "estimated_loss_npr": None
                    if loss is None or loss.get("estimatedLoss") is None
                    else float(loss["estimatedLoss"]),
                    "street_address": address,
                    "event_description": desc,
                },
                "geometry": {"type": "Point", "coordinates": [lon, lat]},
            }
        )
    features.sort(key=lambda f: (f["properties"]["event_time"], int(f["properties"]["source_id"])))
    return features, {"incidents": incident_hashes, "losses": loss_hashes, "hazards": hazard_hash}


def run(root=ROOT, incidents=None, losses=None, hazards=None):
    if not incidents or not losses or not hazards:
        raise ValueError(
            "Pinned incident, loss and hazard source files are required for first publication"
        )
    features, hashes = normalize(incidents, losses, hazards)
    now = datetime.now(timezone.utc).replace(microsecond=0)
    counts = {}
    outputs = []
    for start, end in PARTITIONS:
        period = str(start) if start == end else f"{start}-{end}"
        dataset_id = f"nepal-disaster-events-{period}"
        part = []
        for f in features:
            year = f["properties"]["event_year"]
            if start <= year <= end:
                p = {**f["properties"], "dataset_id": dataset_id}
                part.append({**f, "properties": p})
        counts[dataset_id] = len(part)
        coords = [f["geometry"]["coordinates"] for f in part]
        times = [f["properties"]["event_time"] for f in part]
        metadata = {
            "schema_version": "1.0.0",
            "dataset_id": dataset_id,
            "dataset_name": f"BIPAD reported disaster incidents {start}–{end}",
            "dataset_version": VERSION,
            "source": "BIPAD incident, hazard and loss public APIs",
            "source_url": API_DOCS,
            "license": "Government of Nepal public API; standalone redistribution licence is not stated in the API documentation",
            "license_url": API_DOCS,
            "attribution": "BIPAD Portal, NDRRMA, Government of Nepal",
            "observation_date": max(times),
            "publication_date": None,
            "retrieval_date": now.isoformat().replace("+00:00", "Z"),
            "processing_date": now.isoformat().replace("+00:00", "Z"),
            "processing_version": "disaster-events-pipeline-1.0.0",
            "method": "Joined pinned BIPAD incident records to BIPAD hazard categories and referenced BIPAD loss summaries by stable IDs; retained verified/approved point incidents from 2015 onward; deduplicated only byte-identical overlap between paginated responses; partitioned by incident year for browser budgets.",
            "spatial_resolution": {"value": None, "unit": None},
            "temporal_resolution": "incident record",
            "spatial_coverage": {
                "description": "Reported BIPAD incidents in Nepal",
                "bbox": [
                    min(c[0] for c in coords),
                    min(c[1] for c in coords),
                    max(c[0] for c in coords),
                    max(c[1] for c in coords),
                ],
            },
            "temporal_coverage": {"start": min(times), "end": max(times)},
            "crs": "OGC:CRS84",
            "status": "HISTORICAL",
            "evidence_type": "historical",
            "is_fixture": False,
            "limitations": [
                "Incident points are reported event locations, not hazard footprints or inundation/landslide extents.",
                "BIPAD loss counts and estimated loss values are source-reported administrative records; zero values may mean no recorded loss and are not independently confirmed by the atlas.",
                "The archive begins 2015-01-01 and is not presented as a complete record of every disaster in Nepal.",
                "Map density reflects reporting/data coverage as well as event occurrence.",
                "BIPAD API documentation does not publish a standalone redistribution licence; source terms should be re-audited before external redistribution.",
            ],
            "uncertainty": "Location precision, reporting completeness, loss assessment quality and event classification vary by source record.",
            "update_frequency": "periodic",
            "stale_after": (now + timedelta(days=30)).isoformat().replace("+00:00", "Z"),
        }
        outputs.append(
            publish_vector(root, metadata, {"type": "FeatureCollection", "features": part})
        )
    qa = {
        "source_sha256": hashes,
        "features": len(features),
        "partitions": counts,
        "hazards": dict(Counter(f["properties"]["hazard_name"] for f in features)),
        "start": features[0]["properties"]["event_time"],
        "end": features[-1]["properties"]["event_time"],
    }
    write_immutable(
        root / f"data/releases/nepal-disaster-events/{VERSION}/qa.json",
        (json.dumps(qa, indent=2, ensure_ascii=False) + "\n").encode(),
    )
    print(f"Validated and published {len(features)} BIPAD disaster incidents")
    return outputs, qa


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--incidents", type=Path, nargs="+", required=True)
    parser.add_argument("--losses", type=Path, nargs="+", required=True)
    parser.add_argument("--hazards", type=Path, required=True)
    args = parser.parse_args()
    run(incidents=args.incidents, losses=args.losses, hazards=args.hazards)
