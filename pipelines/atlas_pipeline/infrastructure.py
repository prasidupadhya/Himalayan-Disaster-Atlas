"""Build static Nepal infrastructure releases from pinned OpenStreetMap extracts.

The facility/settlement/bridge snapshot is a build-time Overpass export with
centres. Major-road geometry is acquired separately in small longitude slices
with ``out geom`` so roads are never represented by misleading centre points.
All records are clipped/filtered against the pinned unsimplified Nepal COD-AB
country polygon before publication. Visitors make no OpenStreetMap requests.
"""

import argparse
import gzip
import hashlib
import json
from collections import Counter, defaultdict
from datetime import datetime, timedelta, timezone
from pathlib import Path

from shapely.geometry import LineString, MultiLineString, Point, mapping, shape

from .admin_boundaries import acquire as acquire_country
from .admin_boundaries import read_levels
from .contracts import ROOT
from .vector_release import encode, publish_vector, write_immutable

VERSION = "1.0.0"
OSM_URL = "https://www.openstreetmap.org/"
OVERPASS_URL = "https://overpass-api.de/"
LICENSE_URL = "https://opendatacommons.org/licenses/odbl/1-0/"
NEPAL_BBOX = [80.05846710800012, 26.347762022000154, 88.20154995700005, 30.44719846700019]
ROAD_TYPES = {"motorway", "motorway_link", "trunk", "trunk_link", "primary", "primary_link"}
BRIDGE_ROADS = ROAD_TYPES | {"secondary", "secondary_link", "tertiary", "tertiary_link"}
POINT_DATASET_IDS = {
    "bridge": "nepal-osm-major-bridges",
    "school": "nepal-osm-schools",
    "health": "nepal-osm-health-facilities",
    "emergency": "nepal-osm-emergency-facilities",
    "settlement": "nepal-osm-settlements",
}
SCHOOL_PARTITIONS = {
    "west": "nepal-osm-schools-west",
    "central-west": "nepal-osm-schools-central-west",
    "central-east": "nepal-osm-schools-central-east",
    "east": "nepal-osm-schools-east",
}
ROAD_PARTITIONS = {
    "west": "nepal-osm-major-roads-west",
    "central": "nepal-osm-major-roads-central",
    "east": "nepal-osm-major-roads-east",
}
SOURCE_SNAPSHOT_SHA256 = "b663bf66858b92942656d5c76c7284db63df6be07326b33f50bb2cc8a67a712c"
ROAD_SOURCE_SHA256 = {
    "roads-west.json": "475689d6238f49920dfd8c2fda34568694b2854cba7f557353aeaf1d2e7c2de5",
    "roads-central1.json": "7f595c6d50d4f726e261fae9ac74ba5d2908442436c5d8d5df626ba4563341e1",
    "roads-central2.json": "09ae9994914b6741a7a8d546e8084c657d4ea9688e1b9e9186e6f4dca922828a",
    "roads-east1.json": "bdd5bf0b501d8a6996d854c9975c66d359e473a867babc10a1cfd87f20a2d99d",
    "roads-east2.json": "236c6c4fa566cbe135987f7162ed73b0cedbef71d99b526cdbf48ff60f1855d1",
}


def utc_now():
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z")


def sha256(path):
    return hashlib.sha256(Path(path).read_bytes()).hexdigest()


def load_extract(path, expected_sha):
    path = Path(path)
    if sha256(path) != expected_sha:
        raise ValueError(f"Pinned OSM source checksum changed: {path.name}")
    data = json.loads(path.read_text())
    timestamp = data.get("osm3s", {}).get("timestamp_osm_base")
    if not timestamp or not timestamp.endswith("Z"):
        raise ValueError(f"OSM source timestamp missing: {path.name}")
    return data, timestamp


def classes(tags):
    result = []
    amenity = tags.get("amenity")
    if amenity == "school":
        result.append("school")
    if amenity in {"hospital", "clinic", "doctors"}:
        result.append("health")
    if amenity in {"fire_station", "police"} or tags.get("emergency") == "ambulance_station":
        result.append("emergency")
    return result


def subtype(tags, klass):
    if klass in {"road", "bridge"}:
        return tags.get("highway") or "unknown"
    return tags.get("amenity") or tags.get("emergency") or tags.get("place") or "unknown"


def properties(dataset_id, osm_type, osm_id, tags, klass, source_time, basis, simplified):
    name = tags.get("name") or tags.get("name:en") or None
    source_id = f"{osm_type}/{osm_id}"
    feature_subtype = subtype(tags, klass)
    terms = list(
        dict.fromkeys(
            filter(
                None,
                [
                    name,
                    tags.get("name:en"),
                    tags.get("ref"),
                    tags.get("operator"),
                    source_id,
                    str(osm_id),
                    feature_subtype,
                    klass,
                ],
            )
        )
    )
    return {
        "dataset_id": dataset_id,
        "dataset_version": VERSION,
        "name": name or f"OSM {klass} {source_id}",
        "is_fixture": False,
        "value": None,
        "unit": None,
        "entity_type": "infrastructure_asset",
        "source_id": source_id,
        "search_terms": terms,
        "infrastructure_class": klass,
        "asset_name": name,
        "asset_subtype": feature_subtype,
        "operator_name": tags.get("operator") or None,
        "osm_element_type": osm_type,
        "osm_element_id": str(osm_id),
        "osm_source_timestamp": source_time,
        "position_basis": basis,
        "display_geometry_simplified": simplified,
        "asset_ref": tags.get("ref") or None,
        "surface": tags.get("surface") or None,
    }


def source_point(element):
    if element.get("type") == "node" and "lon" in element and "lat" in element:
        return Point(element["lon"], element["lat"]), "source_node"
    center = element.get("center")
    if center and "lon" in center and "lat" in center:
        return Point(center["lon"], center["lat"]), f"overpass_{element['type']}_center"
    return None, None


def read_point_inventory(snapshot, source_time, country):
    by_class = defaultdict(list)
    seen = set()
    excluded = Counter()
    for element in snapshot.get("elements", []):
        tags = element.get("tags") or {}
        matched = classes(tags)
        if tags.get("place") in {"city", "town", "village"}:
            matched.append("settlement")
        if (
            element.get("type") == "way"
            and tags.get("highway") in BRIDGE_ROADS
            and tags.get("bridge") not in {None, "no"}
        ):
            matched.append("bridge")
        if not matched:
            continue
        point, basis = source_point(element)
        for klass in matched:
            key = (klass, element.get("type"), element.get("id"))
            if key in seen:
                continue
            seen.add(key)
            if point is None:
                excluded[f"{klass}_missing_position"] += 1
                continue
            if not country.covers(point):
                excluded[f"{klass}_outside_codab"] += 1
                continue
            dataset_id = POINT_DATASET_IDS[klass]
            props = properties(
                dataset_id,
                str(element["type"]),
                element["id"],
                tags,
                klass,
                source_time,
                basis,
                False,
            )
            by_class[klass].append(
                {
                    "type": "Feature",
                    "id": f"osm-{klass}-{element['type']}-{element['id']}",
                    "properties": props,
                    "geometry": {"type": "Point", "coordinates": [point.x, point.y]},
                }
            )
    return by_class, excluded


def line_parts(geometry):
    if geometry.geom_type == "LineString":
        parts = [geometry]
    elif geometry.geom_type == "MultiLineString":
        parts = list(geometry.geoms)
    elif geometry.geom_type == "GeometryCollection":
        parts = [part for part in geometry.geoms if part.geom_type == "LineString"]
    else:
        parts = []
    # GEOS can return an empty LineString for a disjoint line/polygon
    # intersection. Treat that as outside coverage, not as a simplification
    # failure, so QA accurately describes what was excluded.
    return [part for part in parts if not part.is_empty and part.length > 0]


def road_partition(geometry):
    lon = geometry.representative_point().x
    if lon < 83.5:
        return "west"
    if lon < 86.0:
        return "central"
    return "east"


def school_partition(feature):
    lon = feature["geometry"]["coordinates"][0]
    if lon < 83.0:
        return "west"
    if lon < 84.5:
        return "central-west"
    if lon < 86.0:
        return "central-east"
    return "east"


def read_roads(paths, country):
    # A way intersecting a slice boundary can occur in two exports. Prefer the
    # newest source snapshot for that OSM way and keep one logical asset.
    candidates = {}
    sources = []
    duplicate_ids = 0
    for path in sorted(paths):
        expected = ROAD_SOURCE_SHA256.get(path.name)
        if not expected:
            raise ValueError(f"Unregistered road source: {path.name}")
        data, source_time = load_extract(path, expected)
        sources.append({"file": path.name, "sha256": expected, "timestamp": source_time})
        for element in data.get("elements", []):
            tags = element.get("tags") or {}
            if element.get("type") != "way" or tags.get("highway") not in ROAD_TYPES:
                continue
            existing = candidates.get(element["id"])
            if existing:
                duplicate_ids += 1
                if source_time <= existing[1]:
                    continue
            candidates[element["id"]] = (element, source_time)

    partitions = defaultdict(list)
    excluded = Counter()
    boundary_clipped = 0
    for osm_id, (element, source_time) in candidates.items():
        coordinates = element.get("geometry") or []
        coords = [(item["lon"], item["lat"]) for item in coordinates if "lon" in item and "lat" in item]
        if len(coords) < 2:
            excluded["missing_geometry"] += 1
            continue
        line = LineString(coords)
        if line.is_empty or not line.is_valid:
            excluded["invalid_geometry"] += 1
            continue
        clipped = line.intersection(country)
        parts = line_parts(clipped)
        if not parts:
            excluded["outside_codab"] += 1
            continue
        clipped = parts[0] if len(parts) == 1 else MultiLineString(parts)
        if not line.equals(clipped):
            boundary_clipped += 1
        simplified = clipped.simplify(0.0002, preserve_topology=True)
        if simplified.is_empty or simplified.geom_type not in {"LineString", "MultiLineString"}:
            excluded["simplification_failure"] += 1
            continue
        partition = road_partition(simplified)
        dataset_id = ROAD_PARTITIONS[partition]
        tags = element.get("tags") or {}
        props = properties(
            dataset_id,
            "way",
            osm_id,
            tags,
            "road",
            source_time,
            "source_way_geometry_clipped_to_codab_and_simplified_for_web",
            True,
        )
        partitions[partition].append(
            {
                "type": "Feature",
                "id": f"osm-road-way-{osm_id}",
                "properties": props,
                # Shapely's mapping() returns tuples; round-trip through JSON so
                # the shared JSON Schema sees canonical GeoJSON arrays.
                "geometry": json.loads(json.dumps(mapping(simplified))),
            }
        )
    return partitions, excluded, duplicate_ids, boundary_clipped, sources


def metadata(dataset_id, label, start, end, retrieval, source_hashes, geometry_note):
    return {
        "schema_version": "1.0.0",
        "dataset_id": dataset_id,
        "dataset_name": f"Nepal OpenStreetMap {label}",
        "dataset_version": VERSION,
        "source": "OpenStreetMap build-time extracts via Overpass API",
        "source_url": OSM_URL,
        "license": "Open Data Commons Open Database License (ODbL) 1.0",
        "license_url": LICENSE_URL,
        "attribution": "© OpenStreetMap contributors · ODbL",
        "observation_date": end,
        "publication_date": None,
        "retrieval_date": retrieval,
        "processing_date": retrieval,
        "processing_version": "infrastructure-pipeline-1.0.0",
        "method": (
            f"Build-time OSM extracts ({', '.join(source_hashes)}) were filtered/clipped with the pinned unsimplified Nepal "
            f"COD-AB v02 country polygon. {geometry_note} Stable OSM element type and ID are preserved. "
            "No visitor-time Overpass or OSM query is performed."
        ),
        "spatial_resolution": {"value": None, "unit": None},
        "temporal_resolution": None,
        "spatial_coverage": {"description": "Features retained or clipped to Nepal COD-AB v02", "bbox": NEPAL_BBOX},
        "temporal_coverage": {"start": start, "end": end},
        "crs": "OGC:CRS84",
        "status": "VERIFIED_SOURCE",
        "evidence_type": "observed",
        "is_fixture": False,
        "limitations": [
            "OpenStreetMap completeness and tagging vary geographically; absence in this layer does not prove an asset is absent.",
            "The acquisition bounding box includes neighboring territory, so every published record is filtered/clipped against pinned Nepal COD-AB v02.",
            "This release deliberately limits roads to motorway/trunk/primary classes and links, and bridges to motorway through tertiary road classes.",
            "School, health, emergency and bridge ways/relations are browser point representations using source-provided Overpass centres; source OSM geometry remains the analytical reference.",
            "Major roads are topology-preserving display simplifications at 0.0002 degree tolerance and must not replace source geometry for precise analysis.",
            "Buildings are not included because national OSM building completeness is too uneven for defensible exposure counting in this feature.",
            "No heuristic geographic deduplication is applied. Only repeated occurrences of the same OSM element/class or road way ID are removed, preserving stable source identity for future exposure deduplication.",
        ],
        "uncertainty": "Positional accuracy, completeness, naming and tag correctness inherit community-maintained OpenStreetMap uncertainty.",
        "update_frequency": "periodic",
        "stale_after": (
            datetime.fromisoformat(retrieval.replace("Z", "+00:00")) + timedelta(days=90)
        ).isoformat().replace("+00:00", "Z"),
    }


def publish(root, dataset_id, label, features, timestamps, retrieval, hashes, geometry_note):
    if not features:
        raise ValueError(f"No infrastructure features found for {dataset_id}")
    features.sort(key=lambda feature: str(feature["properties"]["source_id"]))
    collection = {"type": "FeatureCollection", "features": features}
    decoded = encode(collection)
    compressed = gzip.compress(decoded, compresslevel=9, mtime=0)
    if len(decoded) > 8_388_608 or len(compressed) > 2_097_152:
        raise ValueError(f"Infrastructure browser budget exceeded for {dataset_id}")
    meta = metadata(dataset_id, label, min(timestamps), max(timestamps), retrieval, hashes, geometry_note)
    published, _ = publish_vector(root, meta, collection)
    return {
        "dataset_id": dataset_id,
        "features": len(features),
        "named": sum(feature["properties"]["asset_name"] is not None for feature in features),
        "artifact_bytes": published["artifact"]["byte_size"],
        "decoded_bytes": len(decoded),
    }


def build(snapshot_path, roads_dir, root=ROOT):
    snapshot, snapshot_time = load_extract(snapshot_path, SOURCE_SNAPSHOT_SHA256)
    roads = [Path(roads_dir) / name for name in ROAD_SOURCE_SHA256]
    if any(not path.exists() for path in roads):
        missing = [path.name for path in roads if not path.exists()]
        raise ValueError(f"Missing pinned road geometry slices: {missing}")

    country_archive = acquire_country(root)
    country = shape(read_levels(country_archive)[0]["features"][0]["geometry"])
    if country.is_empty or not country.is_valid:
        raise ValueError("Pinned Nepal COD-AB country geometry is invalid")

    point_features, point_excluded = read_point_inventory(snapshot, snapshot_time, country)
    road_features, road_excluded, road_duplicates, clipped_roads, road_sources = read_roads(roads, country)
    retrieval = utc_now()
    stats = {}
    snapshot_hash_label = f"snapshot sha256:{SOURCE_SNAPSHOT_SHA256}"
    for klass, dataset_id in POINT_DATASET_IDS.items():
        if klass == "school":
            for partition, partition_dataset_id in SCHOOL_PARTITIONS.items():
                partition_features = []
                for feature in point_features[klass]:
                    if school_partition(feature) != partition:
                        continue
                    cloned = {
                        **feature,
                        "properties": {**feature["properties"], "dataset_id": partition_dataset_id},
                    }
                    partition_features.append(cloned)
                stats[f"school_{partition}"] = publish(
                    root,
                    partition_dataset_id,
                    f"schools — {partition}",
                    partition_features,
                    [snapshot_time],
                    retrieval,
                    [snapshot_hash_label],
                    "Point geometry is the source node coordinate or source-provided Overpass way/relation centre.",
                )
            continue
        stats[klass] = publish(
            root,
            dataset_id,
            klass.replace("_", " "),
            point_features[klass],
            [snapshot_time],
            retrieval,
            [snapshot_hash_label],
            "Point geometry is the source node coordinate or source-provided Overpass way/relation centre.",
        )
    road_times = [item["timestamp"] for item in road_sources]
    road_hashes = [f"{item['file']} sha256:{item['sha256']}" for item in road_sources]
    for partition, dataset_id in ROAD_PARTITIONS.items():
        stats[f"road_{partition}"] = publish(
            root,
            dataset_id,
            f"major roads — {partition}",
            road_features[partition],
            road_times,
            retrieval,
            road_hashes,
            "Road geometry comes from OSM way nodes, is clipped to COD-AB Nepal and simplified only for browser display.",
        )

    qa = {
        "source_snapshot": {
            "file": Path(snapshot_path).name,
            "sha256": SOURCE_SNAPSHOT_SHA256,
            "timestamp": snapshot_time,
        },
        "road_sources": road_sources,
        "country_boundary_source": "Nepal COD-AB v02 SHA-256 9f6713c41d65396f611ddce5879faecf8e2d494edbd1d6611612445ad46b6707",
        "repeated_road_way_occurrences_removed": road_duplicates,
        "boundary_clipped_roads": clipped_roads,
        "point_exclusions": dict(point_excluded),
        "road_exclusions": dict(road_excluded),
        "classes": stats,
    }
    content = (json.dumps(qa, indent=2, sort_keys=True) + "\n").encode()
    for base in (
        root / f"data/releases/nepal-osm-infrastructure/{VERSION}",
        root / f"apps/web/public/data/nepal-osm-infrastructure/{VERSION}",
    ):
        write_immutable(base / "qa.json", content)
    print("Published Nepal OSM infrastructure:", ", ".join(f"{key}={value['features']}" for key, value in stats.items()))


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--snapshot", type=Path, required=True)
    parser.add_argument("--roads-dir", type=Path, required=True)
    args = parser.parse_args()
    build(args.snapshot, args.roads_dir)
