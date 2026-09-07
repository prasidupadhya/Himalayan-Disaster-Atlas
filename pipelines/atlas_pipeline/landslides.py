"""Derive a traceable reported-landslide layer from the pinned BIPAD incident archive."""

import gzip
import json
from datetime import datetime, timezone

from .contracts import ROOT
from .vector_release import publish_vector, write_immutable

VERSION = "1.0.0"
DATASET_ID = "nepal-reported-landslides"


def run(root=ROOT):
    features = []
    source_manifests = []
    for manifest_path in sorted(
        (root / "data/releases").glob("nepal-disaster-events-*/1.0.0/manifest.json")
    ):
        metadata = json.loads(manifest_path.read_text())
        source_manifests.append(
            f"{metadata['dataset_id']}@{metadata['dataset_version']}:{metadata['artifact']['sha256']}"
        )
        collection = json.loads(
            gzip.decompress((manifest_path.parent / "features.geojson.gz").read_bytes())
        )
        for feature in collection["features"]:
            if feature["properties"]["hazard_name"] != "Landslide":
                continue
            properties = {
                **feature["properties"],
                "dataset_id": DATASET_ID,
                "dataset_version": VERSION,
                "entity_type": "landslide_event",
                "evidence_status": "reported",
                "hazard_footprint": False,
                "landslide_category": "Landslide",
                "confidence": None,
                "confidence_basis": "BIPAD does not publish a per-incident confidence class in this endpoint",
                "susceptibility_output": False,
            }
            features.append(
                {
                    **feature,
                    "id": f"bipad-landslide-{properties['source_id']}",
                    "properties": properties,
                }
            )
    features.sort(
        key=lambda feature: (
            feature["properties"]["event_time"],
            feature["properties"]["source_id"],
        )
    )
    if not features:
        raise ValueError("No BIPAD landslide incidents found")
    if len({feature["id"] for feature in features}) != len(features):
        raise ValueError("Duplicate BIPAD landslide identifiers")
    now = datetime.now(timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z")
    times = [feature["properties"]["event_time"] for feature in features]
    metadata = {
        "schema_version": "1.0.0",
        "dataset_id": DATASET_ID,
        "dataset_name": "Nepal reported landslide incidents — BIPAD archive",
        "dataset_version": VERSION,
        "source": "Atlas-filtered BIPAD incident archive (hazard=Landslide)",
        "source_url": "https://bipadportal.gov.np/api/",
        "license": "Government of Nepal public API; standalone redistribution licence is not stated in the API documentation",
        "license_url": "https://bipadportal.gov.np/api/",
        "attribution": "BIPAD Portal, NDRRMA, Government of Nepal",
        "observation_date": max(times),
        "publication_date": None,
        "retrieval_date": now,
        "processing_date": now,
        "processing_version": "landslides-pipeline-1.0.0",
        "method": "Deterministic filter of the pinned atlas BIPAD incident archive where the authoritative BIPAD hazard title equals Landslide; stable incident IDs, source points, dates, verification state and loss references retained.",
        "spatial_resolution": {"value": None, "unit": None},
        "temporal_resolution": "reported incident",
        "spatial_coverage": {
            "description": "BIPAD landslide incident points in Nepal",
            "bbox": [80, 26, 89, 31],
        },
        "temporal_coverage": {"start": min(times), "end": max(times)},
        "crs": "OGC:CRS84",
        "status": "HISTORICAL",
        "evidence_type": "historical",
        "is_fixture": False,
        "limitations": [
            "Points are reported event locations, not mapped landslide polygons or scar extents.",
            "BIPAD does not provide a per-incident confidence field in the source endpoint, so confidence remains UNKNOWN.",
            "This is not a landslide susceptibility, probability or forecast layer.",
            "Reporting completeness varies by place and year.",
            "BIPAD API documentation does not state a standalone redistribution licence; source terms should be re-audited before external redistribution.",
        ],
        "uncertainty": "Location and category inherit BIPAD reporting uncertainty; failure area, volume, trigger and confidence are UNKNOWN unless separately reported.",
        "update_frequency": "static",
        "stale_after": None,
    }
    publish_vector(root, metadata, {"type": "FeatureCollection", "features": features})
    qa = {
        "features": len(features),
        "source_releases": source_manifests,
        "start": min(times),
        "end": max(times),
        "confidence_known": sum(
            feature["properties"]["confidence"] is not None for feature in features
        ),
        "susceptibility_outputs": 0,
    }
    write_immutable(
        root / f"data/releases/{DATASET_ID}/{VERSION}/qa.json",
        (json.dumps(qa, indent=2) + "\n").encode(),
    )
    print(f"Validated and published {len(features)} reported BIPAD landslide incidents")


if __name__ == "__main__":
    run()
