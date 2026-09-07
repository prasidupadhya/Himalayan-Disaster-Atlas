"""Acquire and publish Nepal COD administrative boundaries.

Run with a pinned local archive for reproducible/offline processing:
  python -m pipelines.atlas_pipeline.admin_boundaries --source /path/to/archive.zip
"""

import argparse
import gzip
import hashlib
import json
import urllib.request
import zipfile
from collections import Counter
from pathlib import Path

import shapely
from shapely.geometry import Point, mapping, shape
from shapely.ops import unary_union
from shapely.strtree import STRtree

from .contracts import ROOT, validate_dataset

SOURCE_URL = (
    "https://data.humdata.org/dataset/07db728a-4f0f-4e98-8eb0-8fa9df61f01c/"
    "resource/dea34e50-37d5-4e36-98ae-2b7b1b4c43de/download/"
    "npl_admin_boundaries.geojson.zip"
)
SOURCE_PAGE = "https://data.humdata.org/dataset/cod-ab-npl"
SOURCE_SHA256 = "9f6713c41d65396f611ddce5879faecf8e2d494edbd1d6611612445ad46b6707"
SOURCE_VERSION = "v02"
VERSION = "2.0.0"
RETRIEVAL_DATE = "2026-09-07T00:00:00Z"
PROCESSING_DATE = "2026-09-07T00:00:00Z"
OBSERVATION_DATE = "2024-01-01T00:00:00Z"
PUBLICATION_DATE = "2024-03-14T00:00:00Z"
STALE_AFTER = "2026-10-30T23:59:59Z"
BBOX = [80.05846710800012, 26.347762022000154, 88.20154995700005, 30.44719846700019]
EXPECTED_COUNTS = {0: 1, 1: 7, 2: 77, 3: 775}
DATASET_IDS = {
    0: "nepal-admin-country",
    1: "nepal-admin-provinces",
    2: "nepal-admin-districts",
    3: "nepal-admin-local-levels",
}
LEVEL_NAMES = {0: "country", 1: "province", 2: "district", 3: "local level"}
SIMPLIFICATION_TOLERANCE = 0.002


def encode(value):
    return (json.dumps(value, ensure_ascii=False, separators=(",", ":")) + "\n").encode()


def write_immutable(path, content):
    path.parent.mkdir(parents=True, exist_ok=True)
    if path.exists() and path.read_bytes() != content:
        raise ValueError(f"Immutable release conflict: {path}; bump the version")
    path.write_bytes(content)


def sha256(content):
    return hashlib.sha256(content).hexdigest()


def acquire(root, source=None):
    raw = root / f"data/raw/hdx-cod-ab-npl/{SOURCE_SHA256}.geojson.zip"
    if source:
        content = Path(source).read_bytes()
    elif raw.exists():
        content = raw.read_bytes()
    else:
        request = urllib.request.Request(SOURCE_URL, headers={"User-Agent": "Himalayan-Disaster-Atlas/0.1"})
        with urllib.request.urlopen(request, timeout=60) as response:
            content = response.read(70_000_001)
    if len(content) > 70_000_000:
        raise ValueError("Administrative source archive exceeds the acquisition budget")
    if sha256(content) != SOURCE_SHA256:
        raise ValueError("Administrative source checksum mismatch")
    raw.parent.mkdir(parents=True, exist_ok=True)
    if not raw.exists():
        raw.write_bytes(content)
    return raw


def read_levels(archive):
    levels = {}
    with zipfile.ZipFile(archive) as bundle:
        names = set(bundle.namelist())
        expected = {f"npl_admin{level}.geojson" for level in EXPECTED_COUNTS}
        if not expected.issubset(names):
            raise ValueError("Administrative archive is missing required GeoJSON levels")
        if any(name.startswith("/") or ".." in Path(name).parts for name in names):
            raise ValueError("Administrative archive contains an unsafe path")
        for level in EXPECTED_COUNTS:
            name = f"npl_admin{level}.geojson"
            if bundle.getinfo(name).file_size > 50_000_000:
                raise ValueError(f"Administrative level {level} exceeds the processing budget")
            content = bundle.read(name)
            if len(content) > 50_000_000:
                raise ValueError(f"Administrative level {level} exceeds the processing budget")
            levels[level] = json.loads(content)
    return levels


def category(level, pcode):
    if level == 0:
        return "country"
    if level == 1:
        return "province"
    if level == 2:
        return "district"
    # COD v02 uses 95-99 suffixes for protected/special-area pieces.
    return "special_area" if int(pcode[-2:]) >= 95 else "local_level"


def validate_source(levels):
    normalized = {}
    report = {"source_sha256": SOURCE_SHA256, "source_version": SOURCE_VERSION, "levels": {}}
    pcode_sets = {}
    name_maps = {}
    geometry_maps = {}

    for level, data in levels.items():
        if data.get("type") != "FeatureCollection" or len(data.get("features", [])) != EXPECTED_COUNTS[level]:
            raise ValueError(f"Unexpected administrative level {level} feature count")
        features = data["features"]
        geoms = [shape(feature["geometry"]) for feature in features]
        if any(geom.is_empty or not geom.is_valid for geom in geoms):
            raise ValueError(f"Invalid source geometry at administrative level {level}")
        if any(geom.geom_type not in {"Polygon", "MultiPolygon"} for geom in geoms):
            raise ValueError(f"Unexpected geometry type at administrative level {level}")
        if not shapely.coverage_is_valid(geoms):
            raise ValueError(f"Gaps or overlaps detected within administrative level {level}")

        pcodes = [feature["properties"][f"adm{level}_pcode"] for feature in features]
        if len(pcodes) != len(set(pcodes)):
            raise ValueError(f"Duplicate P-code at administrative level {level}")
        pcode_sets[level] = set(pcodes)
        name_maps[level] = {
            feature["properties"][f"adm{level}_pcode"]: feature["properties"][f"adm{level}_name"]
            for feature in features
        }
        geometry_maps[level] = dict(zip(pcodes, geoms))

        tree = STRtree(geoms)
        neighbor_counts = []
        if level:
            for index, geom in enumerate(geoms):
                neighbors = {int(other) for other in tree.query(geom, predicate="touches") if int(other) != index}
                neighbor_counts.append(len(neighbors))
            if min(neighbor_counts) == 0:
                raise ValueError(f"Administrative level {level} contains an unexplained isolated unit")

        report["levels"][str(level)] = {
            "features": len(features),
            "polygons": sum(geom.geom_type == "Polygon" for geom in geoms),
            "multipolygons": sum(geom.geom_type == "MultiPolygon" for geom in geoms),
            "minimum_neighbors": min(neighbor_counts) if neighbor_counts else None,
            "maximum_neighbors": max(neighbor_counts) if neighbor_counts else None,
            "coverage_valid": True,
        }
        normalized[level] = (features, geoms)

    country = geometry_maps[0]["NP"]
    for level in (1, 2, 3):
        difference = unary_union(normalized[level][1]).symmetric_difference(country).area / country.area
        if difference > 1e-8:
            raise ValueError(f"Administrative level {level} does not cover Nepal")
        report["levels"][str(level)]["country_symmetric_difference_ratio"] = difference

    for level in (1, 2, 3):
        parent_level = level - 1
        for feature, geom in zip(*normalized[level]):
            props = feature["properties"]
            parent = props[f"adm{parent_level}_pcode"]
            if parent not in pcode_sets[parent_level]:
                raise ValueError(f"Unknown parent P-code {parent}")
            if geom.difference(geometry_maps[parent_level][parent]).area > 1e-9:
                raise ValueError(f"Administrative unit {props[f'adm{level}_pcode']} escapes its parent")
            if props[f"adm{parent_level}_name"] != name_maps[parent_level][parent]:
                raise ValueError("Administrative parent name disagrees with its P-code")

    categories = Counter(
        category(3, feature["properties"]["adm3_pcode"]) for feature in normalized[3][0]
    )
    if categories != Counter({"local_level": 753, "special_area": 22}):
        raise ValueError(f"Unexpected level-3 category counts: {categories}")
    report["levels"]["3"]["categories"] = dict(categories)
    return normalized, report


def feature_properties(level, source, dataset_id):
    name = source[f"adm{level}_name"]
    pcode = source[f"adm{level}_pcode"]
    aliases = []
    for key in (f"adm{level}_name1", f"adm{level}_name2", f"adm{level}_name3"):
        alias = source.get(key)
        if alias and alias != name and alias not in aliases:
            aliases.append(alias)
    if level == 0:
        parent_pcode = parent_name = None
    else:
        parent_pcode = source[f"adm{level - 1}_pcode"]
        parent_name = source[f"adm{level - 1}_name"]
    valid_to = source.get("valid_to")
    return {
        "dataset_id": dataset_id,
        "dataset_version": VERSION,
        "name": name,
        "is_fixture": False,
        "value": source.get("area_sqkm"),
        "unit": "km2",
        "admin_level": level,
        "admin_category": category(level, pcode),
        "pcode": pcode,
        "parent_pcode": parent_pcode,
        "parent_name": parent_name,
        "aliases": aliases,
        "label_longitude": source["center_lon"],
        "label_latitude": source["center_lat"],
        "valid_from": f"{source['valid_on']}T00:00:00Z",
        "valid_to": f"{valid_to}T00:00:00Z" if valid_to else None,
        "source_version": source["version"],
    }


def build_release(root, level, source_features, source_geometries):
    dataset_id = DATASET_IDS[level]
    simplified = shapely.coverage_simplify(
        source_geometries, SIMPLIFICATION_TOLERANCE, simplify_boundary=True
    )
    if not shapely.coverage_is_valid(simplified):
        raise ValueError(f"Display simplification broke level {level} coverage")
    features = []
    for source_feature, geom in zip(source_features, simplified):
        props = feature_properties(level, source_feature["properties"], dataset_id)
        if not geom.covers(Point(props["label_longitude"], props["label_latitude"])):
            point = geom.representative_point()
            props["label_longitude"], props["label_latitude"] = point.x, point.y
        features.append(
            {
                "type": "Feature",
                "id": props["pcode"].lower(),
                "properties": props,
                # Shapely exposes coordinate sequences as tuples. Round-trip the
                # mapping through JSON so the schema sees GeoJSON arrays.
                "geometry": json.loads(json.dumps(mapping(geom))),
            }
        )
    collection = {"type": "FeatureCollection", "features": features}
    decoded = encode(collection)
    artifact = gzip.compress(decoded, compresslevel=9, mtime=0)
    metadata = {
        "schema_version": "1.0.0",
        "dataset_id": dataset_id,
        "dataset_name": f"Nepal administrative {LEVEL_NAMES[level]} boundaries (COD-AB)",
        "dataset_version": VERSION,
        "source": "Nepal COD-AB v02 — Survey Department of Nepal and UN Resident Coordinator's Office; quality-assured by OCHA/HDX",
        "source_url": SOURCE_PAGE,
        "license": "Creative Commons Attribution 3.0 IGO (CC BY 3.0 IGO)",
        "license_url": "https://creativecommons.org/licenses/by/3.0/igo/legalcode",
        "attribution": "Survey Department of Nepal; UN Resident Coordinator's Office in Nepal; OCHA Field Information Services; HDX",
        "observation_date": OBSERVATION_DATE,
        "publication_date": PUBLICATION_DATE,
        "retrieval_date": RETRIEVAL_DATE,
        "processing_date": PROCESSING_DATE,
        "processing_version": "admin-boundaries-pipeline-1.0.0",
        "method": (
            f"Acquired pinned HDX COD-AB GeoJSON archive (SHA-256 {SOURCE_SHA256}); "
            "validated hierarchy, P-codes, polygon topology, parent containment, full-country coverage, "
            f"and label points; simplified the web display as a topology-preserving coverage at {SIMPLIFICATION_TOLERANCE} degree tolerance; "
            "serialized deterministic CRS84 GeoJSON and gzip. Unsimplified source geometry is retained in the content-addressed raw acquisition for analysis."
        ),
        "spatial_resolution": {"value": None, "unit": None},
        "temporal_resolution": None,
        "spatial_coverage": {"description": "Nepal national extent represented by COD-AB v02", "bbox": BBOX},
        "temporal_coverage": {"start": OBSERVATION_DATE, "end": OBSERVATION_DATE},
        "crs": "OGC:CRS84",
        "status": "VERIFIED_SOURCE",
        "evidence_type": "observed",
        "is_fixture": False,
        "limitations": [
            "Boundaries are COD-AB v02, created by the source in 2024 and reviewed by OCHA/HDX in 2025; later legal or cartographic changes may not be represented.",
            "Level 3 contains 753 local-government units plus 22 protected or special-area pieces encoded by the source; the interface distinguishes these categories.",
            "Ward boundaries are not included in this source release.",
            "English names are supplied; alternate-name fields are currently empty in the source.",
            "Web geometry is topology-preserving display simplification and must not be used for cadastral, legal, distance, area, exposure, or aggregation calculations.",
            "International-boundary representation follows this source and does not resolve disputed boundary claims.",
        ],
        "uncertainty": "No positional accuracy value is published in the dataset metadata. Treat boundary placement and source-reported areas as dataset representations, not cadastral measurements.",
        "update_frequency": "periodic",
        "stale_after": STALE_AFTER,
        "artifact": {
            "path": f"/data/{dataset_id}/{VERSION}/features.geojson.gz",
            "format": "GeoJSON+gzip",
            "sha256": sha256(artifact),
            "byte_size": len(artifact),
        },
    }
    validate_dataset(metadata, collection)
    outputs = []
    for base in (root / f"data/releases/{dataset_id}/{VERSION}", root / f"apps/web/public/data/{dataset_id}/{VERSION}"):
        outputs.extend(((base / "manifest.json", encode(metadata)), (base / "features.geojson.gz", artifact)))
    for path, content in outputs:
        if path.exists() and path.read_bytes() != content:
            raise ValueError(f"Immutable release conflict: {path}; bump the version")
    for path, content in outputs:
        write_immutable(path, content)
    return metadata, collection


def run(root=ROOT, source=None):
    archive = acquire(root, source)
    normalized, report = validate_source(read_levels(archive))
    releases = []
    for level in EXPECTED_COUNTS:
        releases.append(build_release(root, level, *normalized[level]))
    report["display_simplification_tolerance_degrees"] = SIMPLIFICATION_TOLERANCE
    report["release_version"] = VERSION
    report_path = root / f"data/releases/nepal-admin-boundaries/{VERSION}/qa.json"
    write_immutable(report_path, encode(report))
    print("Validated and published COD-AB v02: 1 country, 7 provinces, 77 districts, 753 local levels, and 22 special-area pieces")
    return releases, report


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--source", type=Path)
    args = parser.parse_args()
    run(source=args.source)
