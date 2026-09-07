"""Acquire and publish RGI 7.0 glacier outlines intersecting Nepal."""

import argparse
import gzip
import hashlib
import json
import urllib.request
from pathlib import Path

import shapely
from shapely.geometry import mapping, shape

from .contracts import ROOT
from .vector_release import publish_vector, write_immutable

SOURCE_PAGE = "https://www.glims.org/rgi_user_guide/"
SOURCE_VERSION = "RGI 7.0"
VERSION = "1.0.0"
RETRIEVAL_DATE = "2026-09-07T00:00:00Z"
PROCESSING_DATE = "2026-09-07T00:00:00Z"
PUBLICATION_DATE = "2023-09-19T00:00:00Z"
DISPLAY_TOLERANCE = 0.0001
MAX_SOURCE_BYTES = 25_000_000
SOURCES = {
    "14": {
        "url": "https://www.glims.org/geoserver/ows?service=WFS&version=2.0.0&request=GetFeature&typeNames=GLIMS%3ARGI2000-v7.0-G-14_south_asia_west_epsg3857&bbox=80,26,89,31,EPSG:4326&srsName=EPSG:4326&outputFormat=application%2Fjson",
        "sha256": "89984645af2960a675e2b84c15d91de5058487e6ba15c8203eb41b597d4744b8",
    },
    "15": {
        "url": "https://www.glims.org/geoserver/ows?service=WFS&version=2.0.0&request=GetFeature&typeNames=GLIMS%3ARGI2000-v7.0-G-15_south_asia_east_epsg3857&bbox=80,26,89,31,EPSG:4326&srsName=EPSG:4326&outputFormat=application%2Fjson",
        "sha256": "f1b982d989b5647e50dd3fe7dd6891c6152da0b2a8aad8f089d29dd23fbf8be9",
    },
}
PARTITIONS = (
    ("nepal-glaciers-west", lambda lon: lon < 84.5, "western Nepal"),
    ("nepal-glaciers-central", lambda lon: 84.5 <= lon < 86.5, "central Nepal"),
    ("nepal-glaciers-east", lambda lon: lon >= 86.5, "eastern Nepal"),
)


def sha256(content):
    return hashlib.sha256(content).hexdigest()


def acquire(root, region, source=None):
    config = SOURCES[region]
    raw = root / f"data/raw/rgi7/{config['sha256']}-region-{region}.geojson"
    if source:
        content = Path(source).read_bytes()
    elif raw.exists():
        content = raw.read_bytes()
    else:
        request = urllib.request.Request(config["url"], headers={"User-Agent": "Himalayan-Disaster-Atlas/0.1"})
        with urllib.request.urlopen(request, timeout=90) as response:
            content = response.read(MAX_SOURCE_BYTES + 1)
    if len(content) > MAX_SOURCE_BYTES:
        raise ValueError(f"RGI region {region} source exceeds the acquisition budget")
    if sha256(content) != config["sha256"]:
        raise ValueError(f"RGI region {region} source checksum mismatch")
    raw.parent.mkdir(parents=True, exist_ok=True)
    if not raw.exists():
        raw.write_bytes(content)
    return raw


def nepal_geometry(root):
    path = root / "data/releases/nepal-admin-country/2.0.1/features.geojson.gz"
    collection = json.loads(gzip.decompress(path.read_bytes()))
    return shape(collection["features"][0]["geometry"])


def polygonal_display(source_geometry):
    original = shapely.force_2d(source_geometry)
    repaired = not original.is_valid
    geometry = shapely.make_valid(original) if repaired else original
    parts = [part for part in shapely.get_parts(geometry) if part.geom_type in {"Polygon", "MultiPolygon"}]
    if not parts:
        raise ValueError("RGI display repair produced no polygonal geometry")
    geometry = shapely.union_all(parts) if len(parts) > 1 else parts[0]
    geometry = shapely.simplify(geometry, DISPLAY_TOLERANCE, preserve_topology=True)
    if geometry.is_empty or not geometry.is_valid or geometry.geom_type not in {"Polygon", "MultiPolygon"}:
        raise ValueError("RGI display geometry is invalid after repair/simplification")
    return geometry, repaired


def normalize(root, source_paths):
    nepal = nepal_geometry(root)
    features = []
    seen = set()
    repaired_count = 0
    for region, source_path in source_paths.items():
        source = json.loads(source_path.read_text())
        if source.get("type") != "FeatureCollection":
            raise ValueError(f"RGI region {region} source is not a FeatureCollection")
        for source_feature in source.get("features", []):
            raw_geometry = shape(source_feature["geometry"])
            display_geometry, repaired = polygonal_display(raw_geometry)
            if not display_geometry.intersects(nepal):
                continue
            props = source_feature["properties"]
            source_id = props["rgi_id"]
            if source_id in seen:
                raise ValueError(f"Duplicate RGI ID {source_id}")
            seen.add(source_id)
            repaired_count += int(repaired)
            glacier_name = props.get("glac_name") or None
            name = glacier_name or f"RGI glacier {source_id}"
            search_terms = [name, source_id, props["glims_id"]]
            if glacier_name and glacier_name not in search_terms:
                search_terms.append(glacier_name)
            area = float(props["area_km2"])
            zmin, zmax, zmean = (float(props[key]) for key in ("zmin_m", "zmax_m", "zmean_m"))
            if area <= 0 or not zmin <= zmean <= zmax:
                raise ValueError(f"Implausible RGI attributes for {source_id}")
            features.append(
                {
                    "type": "Feature",
                    "id": source_id.lower().replace(".", "-"),
                    "properties": {
                        "dataset_id": "nepal-glaciers",
                        "dataset_version": VERSION,
                        "name": name,
                        "is_fixture": False,
                        "value": area,
                        "unit": "km2",
                        "entity_type": "glacier",
                        "source_id": source_id,
                        "search_terms": search_terms,
                        "glacier_name": glacier_name,
                        "glims_id": props["glims_id"],
                        "outline_date": props["src_date"][:10],
                        "area_km2": area,
                        "centroid_longitude": float(props["cenlon"]),
                        "centroid_latitude": float(props["cenlat"]),
                        "elevation_min_m": zmin,
                        "elevation_max_m": zmax,
                        "elevation_mean_m": zmean,
                        "dem_source": props["dem_source"],
                        "inventory_region": f"RGI {region} / {props['o2region']}",
                        "display_geometry_repaired": repaired,
                    },
                    "geometry": json.loads(json.dumps(mapping(display_geometry))),
                }
            )
    features.sort(key=lambda item: item["properties"]["source_id"])
    if not features:
        raise ValueError("RGI sources contain no glaciers intersecting Nepal")
    return features, repaired_count


def feature_bounds(features):
    bounds = [180.0, 90.0, -180.0, -90.0]
    for feature in features:
        west, south, east, north = shape(feature["geometry"]).bounds
        bounds = [min(bounds[0], west), min(bounds[1], south), max(bounds[2], east), max(bounds[3], north)]
    return bounds


def run(root=ROOT, region14=None, region15=None):
    source_paths = {
        "14": acquire(root, "14", region14),
        "15": acquire(root, "15", region15),
    }
    features, repaired_count = normalize(root, source_paths)
    outputs = []
    partition_counts = {}
    for dataset_id, predicate, label in PARTITIONS:
        partition = []
        for feature in features:
            if not predicate(feature["properties"]["centroid_longitude"]):
                continue
            partition.append({**feature, "properties": {**feature["properties"], "dataset_id": dataset_id}})
        partition_counts[dataset_id] = len(partition)
        metadata = {
            "schema_version": "1.0.0",
            "dataset_id": dataset_id,
            "dataset_name": f"Nepal glaciers — {label} (RGI 7.0)",
            "dataset_version": VERSION,
            "source": "Randolph Glacier Inventory (RGI) 7.0 glacier product, regions 14 and 15",
            "source_url": SOURCE_PAGE,
            "license": "Creative Commons Attribution 4.0 International (CC BY 4.0)",
            "license_url": "https://creativecommons.org/licenses/by/4.0/",
            "attribution": "RGI 7.0 Consortium (2023); GLIMS contributors",
            "observation_date": None,
            "publication_date": PUBLICATION_DATE,
            "retrieval_date": RETRIEVAL_DATE,
            "processing_date": PROCESSING_DATE,
            "processing_version": "glaciers-pipeline-1.0.0",
            "method": (
                "Pinned RGI 7.0 South Asia West and South Asia East WFS subsets by SHA-256; selected complete glacier features intersecting the validated Nepal COD-AB polygon; retained stable RGI/GLIMS IDs, source area, representative point, source outline date and RGI topographic attributes. "
                f"The WFS presentation coordinates are force-2D, invalid exports are repaired with make_valid, and all display outlines are topology-preserving simplified at {DISPLAY_TOLERANCE} degree tolerance. Source area values are never recomputed from display geometry. Geographic partitions exist only to keep browser artifacts bounded."
            ),
            "spatial_resolution": {"value": None, "unit": None},
            "temporal_resolution": None,
            "spatial_coverage": {"description": f"RGI 7.0 glacier outlines intersecting Nepal — {label}", "bbox": feature_bounds(partition)},
            "temporal_coverage": {
                "start": min(feature["properties"]["outline_date"] for feature in partition) + "T00:00:00Z",
                "end": max(feature["properties"]["outline_date"] for feature in partition) + "T00:00:00Z",
            },
            "crs": "OGC:CRS84",
            "status": "VERIFIED_SOURCE",
            "evidence_type": "observed",
            "is_fixture": False,
            "limitations": [
                "RGI 7.0 is a dated inventory targeting approximately the year 2000; individual source outline dates in Nepal vary and are shown per glacier.",
                "Glacier outlines are inventory observations derived from remote-sensing source material and do not represent the current glacier margin in 2026.",
                "The GLIMS WFS display export rounds/reprojects coordinates; invalid presentation geometries are explicitly repaired and simplified. Source RGI area is retained as the measurement and display polygons must not be used to recompute area.",
                "Most RGI glacier records in this region have no published glacier name; the atlas shows UNKNOWN rather than inventing a name.",
                "RGI/GLIMS coverage and outline uncertainty varies with source imagery, mapping method and acquisition date.",
            ],
            "uncertainty": "Treat each outline as a source-dated inventory boundary with source-dependent positional uncertainty. Topographic elevation statistics are RGI attributes derived from the listed DEM source, not field survey measurements.",
            "update_frequency": "periodic",
            "stale_after": "2027-09-07T00:00:00Z",
        }
        outputs.append(publish_vector(root, metadata, {"type": "FeatureCollection", "features": partition}))
    report = {
        "source_version": SOURCE_VERSION,
        "source_sha256": {region: config["sha256"] for region, config in SOURCES.items()},
        "features": len(features),
        "named_glaciers": sum(feature["properties"]["glacier_name"] is not None for feature in features),
        "display_geometries_repaired": repaired_count,
        "total_source_area_km2": sum(feature["properties"]["area_km2"] for feature in features),
        "outline_date_min": min(feature["properties"]["outline_date"] for feature in features),
        "outline_date_max": max(feature["properties"]["outline_date"] for feature in features),
        "presentation_partitions": partition_counts,
        "display_simplification_tolerance_degrees": DISPLAY_TOLERANCE,
    }
    write_immutable(root / f"data/releases/nepal-glaciers-inventory/{VERSION}/qa.json", (json.dumps(report, indent=2) + "\n").encode())
    print(f"Validated and published {len(features)} RGI 7.0 glacier outlines intersecting Nepal")
    return outputs, report


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--region14", type=Path)
    parser.add_argument("--region15", type=Path)
    args = parser.parse_args()
    run(region14=args.region14, region15=args.region15)
