"""Acquire and publish Nepal-intersecting FAO/HydroRIVERS reaches."""

import argparse
import gzip
import hashlib
import json
import urllib.request
from pathlib import Path

from shapely.geometry import shape

from .contracts import ROOT
from .vector_release import publish_vector, write_immutable

SOURCE_PAGE = "https://data.fao.org/catalog/dataset/e22667af-3977-4e9f-b58b-67fb91b0fa87"
SOURCE_URL = (
    "https://data.apps.fao.org/map/gsrv/gsrv1/aquamaps/wfs?service=WFS&version=2.0.0&"
    "request=GetFeature&typeNames=aquamaps%3Ariver_network&bbox=80,26,89,31,EPSG:4326&"
    "outputFormat=application%2Fjson"
)
SOURCE_SHA256 = "5c54a6f58516e24b944da0e5bb268448ef9d401aed6e0b404943e5a210081129"
SOURCE_EDITION = "2026"
VERSION = "1.0.0"
RETRIEVAL_DATE = "2026-09-07T00:00:00Z"
PROCESSING_DATE = "2026-09-07T00:00:00Z"
PUBLICATION_DATE = "2026-06-15T00:00:00Z"
BBOX = [80.0, 26.0, 89.0, 31.0]
MAX_SOURCE_BYTES = 35_000_000
PARTITIONS = {
    "nepal-rivers-primary": lambda order: order <= 6,
    "nepal-rivers-headwaters": lambda order: order >= 7,
}


def sha256(content):
    return hashlib.sha256(content).hexdigest()


def acquire(root, source=None):
    raw = root / f"data/raw/fao-rivers-2026/{SOURCE_SHA256}.geojson"
    if source:
        content = Path(source).read_bytes()
    elif raw.exists():
        content = raw.read_bytes()
    else:
        request = urllib.request.Request(SOURCE_URL, headers={"User-Agent": "Himalayan-Disaster-Atlas/0.1"})
        with urllib.request.urlopen(request, timeout=90) as response:
            content = response.read(MAX_SOURCE_BYTES + 1)
    if len(content) > MAX_SOURCE_BYTES:
        raise ValueError("FAO river source exceeds the acquisition budget")
    if sha256(content) != SOURCE_SHA256:
        raise ValueError("FAO river source checksum mismatch")
    raw.parent.mkdir(parents=True, exist_ok=True)
    if not raw.exists():
        raw.write_bytes(content)
    return raw


def nepal_geometry(root):
    path = root / "data/releases/nepal-admin-country/2.0.1/features.geojson.gz"
    collection = json.loads(gzip.decompress(path.read_bytes()))
    return shape(collection["features"][0]["geometry"])


def normalize(root, source_path):
    source = json.loads(source_path.read_text())
    if source.get("type") != "FeatureCollection":
        raise ValueError("FAO river source is not a FeatureCollection")
    nepal = nepal_geometry(root)
    selected = []
    ids = set()
    for feature in source.get("features", []):
        geom = shape(feature["geometry"])
        if geom.is_empty or not geom.is_valid or geom.geom_type not in {"LineString", "MultiLineString"}:
            raise ValueError("FAO river source contains invalid line geometry")
        if not geom.intersects(nepal):
            continue
        props = feature["properties"]
        source_id = str(int(props["hyriv_id"]))
        if source_id in ids:
            raise ValueError(f"Duplicate HYRIV_ID {source_id}")
        ids.add(source_id)
        selected.append((feature, source_id))
    if not selected:
        raise ValueError("No FAO river reaches intersect Nepal")

    features = []
    for feature, source_id in selected:
        props = feature["properties"]
        downstream = int(props["next_down"])
        downstream_id = None if downstream == 0 else str(downstream)
        discharge = float(props["dis_av_cms"])
        if discharge < 0:
            raise ValueError(f"Negative average discharge for HYRIV_ID {source_id}")
        flow_order = int(props["ord_flow"])
        if flow_order < 1:
            raise ValueError(f"Invalid flow order for HYRIV_ID {source_id}")
        flow_code = props.get("smooth_200")
        flow_regime = {"P": "perennial", "I": "intermittent"}.get(flow_code, "unknown")
        name = f"River reach {source_id}"
        features.append(
            {
                "type": "Feature",
                "id": f"hyriv-{source_id}",
                "properties": {
                    "dataset_id": "nepal-rivers",
                    "dataset_version": VERSION,
                    "name": name,
                    "is_fixture": False,
                    "value": discharge,
                    "unit": "m3/s",
                    "entity_type": "river",
                    "source_id": source_id,
                    "search_terms": [name, f"HYRIV {source_id}"],
                    "river_name": None,
                    "downstream_id": downstream_id,
                    "downstream_in_release": downstream_id in ids if downstream_id else False,
                    "main_river_id": str(int(props["main_riv"])),
                    "flow_order": flow_order,
                    "length_km": float(props["length_km"]),
                    "distance_downstream_km": float(props["dist_dn_km"]),
                    "distance_upstream_km": float(props["dist_up_km"]),
                    "catchment_area_km2": float(props["catch_skm"]),
                    "upstream_area_km2": float(props["upland_skm"]),
                    "average_discharge_m3s": discharge,
                    "flow_regime": flow_regime,
                    "hydrobasin_level12_id": str(int(float(props["hybas_l12"]))),
                },
                "geometry": feature["geometry"],
            }
        )
    features.sort(key=lambda item: int(item["properties"]["source_id"]))
    return features


def topology_report(features):
    ids = {feature["properties"]["source_id"] for feature in features}
    next_map = {feature["properties"]["source_id"]: feature["properties"]["downstream_id"] for feature in features}
    self_links = [source_id for source_id, downstream in next_map.items() if source_id == downstream]
    if self_links:
        raise ValueError(f"River source contains self-linked reaches: {self_links[:3]}")
    internal = sum(downstream in ids for downstream in next_map.values() if downstream)
    exits = sum(downstream is not None and downstream not in ids for downstream in next_map.values())
    outlets = sum(downstream is None for downstream in next_map.values())
    return {
        "features": len(features),
        "unique_hyriv_ids": len(ids),
        "internal_downstream_links": internal,
        "boundary_exit_links": exits,
        "source_outlets": outlets,
        "self_links": 0,
        "flow_order_counts": {
            str(order): sum(feature["properties"]["flow_order"] == order for feature in features)
            for order in sorted({feature["properties"]["flow_order"] for feature in features})
        },
    }


def run(root=ROOT, source=None):
    source_path = acquire(root, source)
    features = normalize(root, source_path)
    report = topology_report(features)
    metadata_base = {
        "schema_version": "1.0.0",
        "dataset_version": VERSION,
        "source": "FAO AQUASTAT Rivers (Global - edition 2026), derived from HydroRIVERS",
        "source_url": SOURCE_PAGE,
        "license": "Creative Commons Attribution 4.0 International (CC BY 4.0)",
        "license_url": "https://creativecommons.org/licenses/by/4.0/",
        "attribution": "FAO AQUASTAT; HydroRIVERS / HydroSHEDS; WWF-US; McGill University",
        "observation_date": None,
        "publication_date": PUBLICATION_DATE,
        "retrieval_date": RETRIEVAL_DATE,
        "processing_date": PROCESSING_DATE,
        "processing_version": "rivers-pipeline-1.0.0",
        "method": (
            f"Acquired a CRS84 WFS subset of FAO Rivers edition {SOURCE_EDITION} and pinned it by SHA-256 {SOURCE_SHA256}; "
            "retained every source reach whose line intersects the validated Nepal COD-AB country geometry without clipping or simplifying it; "
            "preserved HYRIV_ID, NEXT_DOWN, MAIN_RIV, ORD_FLOW, distances, catchment/upstream areas, average discharge, HydroBASINS level-12 ID and the smoothed flow-regime classification; "
            "validated unique IDs, line geometry, non-self downstream links and network boundary exits; serialized deterministic gzip GeoJSON."
        ),
        "spatial_resolution": {"value": 0.004166666666666667, "unit": "degree"},
        "temporal_resolution": None,
        "spatial_coverage": {"description": "River reaches intersecting Nepal; complete source reaches are retained across the border", "bbox": BBOX},
        "temporal_coverage": {"start": None, "end": None},
        "crs": "OGC:CRS84",
        "status": "VERIFIED_SOURCE",
        "evidence_type": "observed",
        "is_fixture": False,
        "limitations": [
            "The network is derived from HydroRIVERS/HydroSHEDS terrain-based hydrography; displayed lines are mapped/modelled river reaches, not a guarantee of present-day wetted channels.",
            "HydroRIVERS includes rivers meeting its catchment-area or average-flow thresholds, so smaller channels are absent.",
            "The FAO edition provides no river-name field for these reaches; the atlas therefore shows UNKNOWN for river name and uses HYRIV_ID as the stable identifier.",
            "Average discharge and flow-regime attributes are source dataset descriptors and are not live gauge observations.",
            "Reaches are selected by intersection with Nepal and are not clipped, preserving source geometry and downstream continuity at national boundaries where available.",
        ],
        "uncertainty": "Hydrography, flow class and discharge inherit uncertainties from the HydroSHEDS DEM, HydroRIVERS derivation and FAO classification. No local survey or current-flow validation is implied.",
        "update_frequency": "periodic",
        "stale_after": "2027-09-07T00:00:00Z",
    }
    results = []
    partition_counts = {}
    for dataset_id, predicate in PARTITIONS.items():
        partition = []
        for feature in features:
            if not predicate(feature["properties"]["flow_order"]):
                continue
            copied = {
                **feature,
                "properties": {**feature["properties"], "dataset_id": dataset_id},
            }
            partition.append(copied)
        partition_counts[dataset_id] = len(partition)
        label = "primary and mid-order reaches" if dataset_id.endswith("primary") else "headwater and minor reaches"
        metadata = {
            **metadata_base,
            "dataset_id": dataset_id,
            "dataset_name": f"Nepal river network — {label} (FAO Rivers 2026 / HydroRIVERS)",
            "method": metadata_base["method"] + f" The web presentation is partitioned by ORD_FLOW ({label}) solely to remain below the 8 MiB decoded GeoJSON budget; network IDs and NEXT_DOWN links span both partitions.",
        }
        results.append(publish_vector(root, metadata, {"type": "FeatureCollection", "features": partition}))
    report.update({"source_sha256": SOURCE_SHA256, "source_edition": SOURCE_EDITION})
    report["presentation_partitions"] = partition_counts
    write_immutable(root / f"data/releases/nepal-rivers-network/{VERSION}/qa.json", (json.dumps(report, indent=2) + "\n").encode())
    print(f"Validated and published {len(features)} FAO/HydroRIVERS reaches intersecting Nepal")
    return results, report


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--source", type=Path)
    args = parser.parse_args()
    run(source=args.source)
