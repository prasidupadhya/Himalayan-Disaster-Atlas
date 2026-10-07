"""Feature 49: hypothetical flood/GLOF corridor catalogue with exposure-by-distance ranges.

For a registered catalogue of release points, follow the verified HydroRIVERS NEXT_DOWN path,
build explicit corridors of declared half-widths (sensitivity variants, not flood extents) around
path prefixes, and count potentially intersecting HRSL population and mapped OSM assets with the
exact equal-area method of the Exposure Engine. No depth, extent, damage or probability is made.
"""

import argparse
import json
import math
from datetime import datetime, timezone

import numpy as np
import rasterio
import shapely
from rasterio.features import rasterize
from rasterio.windows import Window, from_bounds
from shapely.geometry import mapping, shape
from shapely.ops import unary_union

from processing.exposure.engine import asset_index, project, vector_overlay

from .contracts import ROOT
from .exposure import ASSET_IDS, CATEGORIES, read_dataset
from .live_contracts import require
from .model_release import (
    encode,
    gzip_bytes,
    input_reference,
    publish,
    read_json_artifact,
    semantic,
)
from .population_hrsl import ID as POP_ID
from .population_hrsl import RAW as POP_RAW
from .population_hrsl import VERSION as POP_VERSION

ID, VERSION = "atlas-flood-corridors", "1.0.0"
METHOD = "corridor-catalogue/1.0.0"
WIDTHS_M = [250, 500, 1000]
CHECKPOINTS_KM = [10, 25, 50, 100, 200]
GLOF_ORIGINS, RIVER_ORIGINS = 10, 8
LAKE_LINK_MAX_M = 2000
GAZETTEER_MAX_M = 5000
AREA_CRS = "EPSG:6933"


def local_crs(lon, lat):
    return f"+proj=aeqd +lat_0={lat:.4f} +lon_0={lon:.4f} +datum=WGS84 +units=m +no_defs"


def rivers():
    sets = [read_dataset(f"nepal-rivers-{p}") for p in ("primary", "headwaters")]
    network = {}
    for dataset in sets:
        for feature in dataset["collection"]["features"]:
            p = feature["properties"]
            require(p["source_id"] not in network, f"Duplicate reach {p['source_id']}")
            network[p["source_id"]] = {"id": p["source_id"], "down": p["downstream_id"], "length": p["length_km"],
                                       "up_area": p["upstream_area_km2"], "order": p["flow_order"],
                                       "geometry": shape(feature["geometry"])}
    return sets, network


def trace(network, start):
    path, seen, current = [], set(), start
    while current in network:
        require(current not in seen, f"Cycle at {current}")
        seen.add(current)
        path.append(current)
        current = network[current]["down"]
    ended = "source_outlet" if current in (None, "0", 0, "") else "coverage_exit"
    return path, ended, None if ended == "source_outlet" else current


def glof_origins(network, tree, ids):
    lakes = read_dataset("nepal-transboundary-glacial-lakes")["collection"]["features"]
    candidates = sorted((f for f in lakes if f["properties"]["country"] == "Nepal" and f["properties"]["connectivity"] == "Glacier-fed"),
                        key=lambda f: (-f["properties"]["area_km2"], f["properties"]["source_id"]))
    chosen, used = [], set()
    for lake in candidates:
        p = lake["properties"]
        lon, lat = p["centroid_longitude"], p["centroid_latitude"]
        crs = local_crs(lon, lat)
        point = project(shapely.Point(lon, lat), "EPSG:4326", crs)
        best = None
        for index in tree.query(shapely.Point(lon, lat).buffer(0.03)):
            reach = network[ids[index]]
            distance = project(reach["geometry"], "EPSG:4326", crs).distance(point)
            if best is None or (distance, reach["id"]) < best:
                best = (distance, reach["id"])
        if best is None or best[0] > LAKE_LINK_MAX_M or best[1] in used:
            continue
        used.add(best[1])
        chosen.append({"kind": "glof-release-point", "start": best[1], "link_distance_m": round(best[0], 1), "lake": {
            "glo_id": p["source_id"], "area_km2": p["area_km2"], "basin": p["basin"], "connectivity": p["connectivity"],
            "elevation_mean_m": p["elevation_mean_m"], "longitude": lon, "latitude": lat,
            "dataset": "nepal-transboundary-glacial-lakes@1.0.0"}})
        if len(chosen) == GLOF_ORIGINS:
            break
    return chosen


def river_origins(network):
    upstream = {}
    for reach in network.values():
        if reach["down"] in network:
            upstream.setdefault(reach["down"], []).append(reach["id"])
    outlets = sorted((r for r in network.values() if r["down"] not in network), key=lambda r: (-r["up_area"], r["id"]))
    chosen = []
    for outlet in outlets[:RIVER_ORIGINS]:
        current = outlet["id"]
        while upstream.get(current):
            current = max(upstream[current], key=lambda rid: (network[rid]["up_area"], rid))
        chosen.append({"kind": "river-entry-point", "start": current, "outlet": outlet["id"],
                       "outlet_upstream_area_km2": outlet["up_area"]})
    return chosen


def gazetteer_hint(lon, lat, names):
    crs = local_crs(lon, lat)
    here = project(shapely.Point(lon, lat), "EPSG:4326", crs)
    best = None
    for feature in names:
        x, y = feature["geometry"]["coordinates"]
        if abs(x - lon) > 0.06 or abs(y - lat) > 0.06:
            continue
        distance = project(shapely.Point(x, y), "EPSG:4326", crs).distance(here)
        if best is None or distance < best[0]:
            best = (distance, feature)
    if best is None or best[0] > GAZETTEER_MAX_M:
        return None
    return {"name": best[1]["properties"]["name"], "geonames_id": best[1]["properties"]["source_id"],
            "distance_m": round(best[0], 1), "meaning": "Nearest GeoNames stream point for orientation only; not a verified reach name"}


def population_fractions(footprint_6933, footprint_4326, raster):
    """Exact equal-area cell fractions for candidate cells (all_touched pre-filter keeps every intersecting cell)."""
    t = raster.transform
    w, s, e, n = footprint_4326.bounds
    window = from_bounds(w, s, e, n, t)
    left, top = max(0, math.floor(window.col_off) - 1), max(0, math.floor(window.row_off) - 1)
    right = min(raster.width, math.ceil(window.col_off + window.width) + 1)
    bottom = min(raster.height, math.ceil(window.row_off + window.height) + 1)
    area = footprint_6933.area
    if right <= left or bottom <= top:
        return {"known_population": None, "total_population": None, "unknown_area_km2": area / 1e6, "valid_area_km2": 0.0}
    sub = Window(left, top, right - left, bottom - top)
    sub_t = raster.window_transform(sub)
    candidate = rasterize([(footprint_4326, 1)], out_shape=(sub.height, sub.width), transform=sub_t, all_touched=True, dtype="uint8").astype(bool)
    data = raster.read(1, window=sub)
    valid = candidate & (data != raster.nodata)
    rr, cc = np.nonzero(valid)
    total, valid_area, count = 0.0, 0.0, 0
    if len(rr):
        lon = sub_t.c + np.arange(sub.width + 1) * sub_t.a
        lat = sub_t.f + np.arange(sub.height + 1) * sub_t.e
        from rasterio.warp import transform as warp
        xs = np.array(warp("EPSG:4326", AREA_CRS, lon, np.zeros(len(lon)))[0])
        ys = np.array(warp("EPSG:4326", AREA_CRS, np.zeros(len(lat)), lat)[1])
        shapely.prepare(footprint_6933)
        cells = shapely.box(xs[cc], ys[rr + 1], xs[cc + 1], ys[rr])
        hit = shapely.intersects(footprint_6933, cells)
        cells, rr, cc = cells[hit], rr[hit], cc[hit]
        cell_area = shapely.area(cells)
        weights = np.ones(len(cells))
        partial = ~shapely.covers(footprint_6933, cells)
        if partial.any():
            weights[partial] = shapely.area(shapely.intersection(cells[partial], footprint_6933)) / cell_area[partial]
        weights = np.clip(weights, 0, 1)
        total = float(np.sum(data[rr, cc] * weights))
        valid_area = float(np.sum(cell_area * weights))
        count = int(np.count_nonzero(weights > 0))
    unknown = max(0.0, area - valid_area)
    if unknown < max(0.001, area * 1e-10):
        unknown = 0.0
    return {"known_population": total if count else None, "total_population": total if unknown == 0 else None,
            "unknown_area_km2": unknown / 1e6, "valid_area_km2": valid_area / 1e6}


def corridor(lines_4326, width, crs):
    local = project(lines_4326, "EPSG:4326", crs).buffer(width, quad_segs=8)
    return project(local, crs, "EPSG:4326")


def round_coordinates(geometry, digits=5):
    return json.loads(json.dumps(mapping(shapely.set_precision(geometry, 10 ** -digits))))


def build(population_path):
    sets, network = rivers()
    ids = sorted(network)
    tree = shapely.STRtree([network[i]["geometry"] for i in ids])
    names = read_dataset("nepal-river-names")["collection"]["features"]
    assets = asset_index([read_dataset(i) for i in ASSET_IDS])
    origins = glof_origins(network, tree, ids) + river_origins(network)
    entries, shapes = [], {}
    with rasterio.open(population_path) as raster:
        require(raster.nodata == -1 and raster.crs.to_epsg() == 4326, "Unexpected HRSL analysis raster")
        for index, origin in enumerate(origins):
            path, ended, next_id = trace(network, origin["start"])
            lengths = [network[r]["length"] for r in path]
            cumulative = np.cumsum(lengths)
            total = float(cumulative[-1])
            first = network[path[0]]["geometry"]
            lon, lat = (float(v) for v in shapely.get_coordinates(first)[0])
            crs = local_crs(*shapely.centroid(unary_union([network[r]["geometry"] for r in path])).coords[0])
            identifier = f"{'glof' if origin['kind'] == 'glof-release-point' else 'river'}-{path[0]}"
            checkpoints = [d for d in CHECKPOINTS_KM if d < total] + [total]
            rows = []
            for distance in checkpoints:
                count = max(1, int(np.searchsorted(cumulative, distance + 1e-9, side="right")))
                prefix = unary_union([network[r]["geometry"] for r in path[:count]])
                by_width = {}
                for width in WIDTHS_M:
                    geom = corridor(prefix, width, crs)
                    footprint = project(shapely.segmentize(geom, 0.001), "EPSG:4326", AREA_CRS)
                    pop = population_fractions(footprint, geom, raster)
                    matched = vector_overlay(footprint, assets)
                    by_width[str(width)] = {
                        "area_km2": round(footprint.area / 1e6, 4),
                        "population_known": None if pop["known_population"] is None else round(pop["known_population"], 1),
                        "population_total": None if pop["total_population"] is None else round(pop["total_population"], 1),
                        "unknown_area_km2": round(pop["unknown_area_km2"], 4),
                        "unique_assets": len(matched),
                        "categories": {c: sum(c in m["categories"] for m in matched) for c in CATEGORIES},
                    }
                end = shapely.get_coordinates(network[path[count - 1]]["geometry"])[-1]
                rows.append({"requested_km": None if distance == total else distance, "prefix_km": round(float(cumulative[count - 1]), 3),
                             "reach_count": count, "end_coordinates": [round(float(end[0]), 5), round(float(end[1]), 5)], "by_width": by_width})
            # HydroRIVERS reaches are digitised in flow direction; concatenate them in path order.
            ordered = np.concatenate([shapely.get_coordinates(network[r]["geometry"]) for r in path])
            line = shapely.simplify(shapely.LineString(ordered), 0.0004, preserve_topology=False)
            shapes[identifier] = {str(w): round_coordinates(shapely.simplify(corridor(unary_union([network[r]["geometry"] for r in path]), w, crs), 0.0003)) for w in WIDTHS_M}
            entry = {"id": identifier, **{k: v for k, v in origin.items() if k != "start"}, "start_reach": path[0],
                     "start_coordinates": [round(lon, 5), round(lat, 5)], "path_reaches": path, "path_lengths_km": lengths,
                     "path_length_km": round(total, 3), "termination": ended, "next_unavailable_reach": next_id,
                     "gazetteer_hint": gazetteer_hint(lon, lat, names), "line": round_coordinates(line), "checkpoints": rows}
            entries.append(entry)
            print(f"[{index + 1}/{len(origins)}] {identifier}: {len(path)} reaches, {total:.1f} km", flush=True)
    return sets, entries, shapes


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--population", default=str(POP_RAW / "nepal-hrsl-3ss.tif"))
    args = parser.parse_args()
    pop_manifest = json.loads((ROOT / f"data/releases/{POP_ID}/{POP_VERSION}/manifest.json").read_text())
    from .model_release import digest
    raw = open(args.population, "rb").read()
    require(digest(raw) == pop_manifest["summary"]["analysis_raster"]["sha256"], "HRSL analysis raster differs from its pinned hash")
    sets, entries, shapes = build(args.population)
    now = datetime.now(timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z")
    catalogue = {"format": "atlas-flood-corridors@1", "method": METHOD, "widths_m": WIDTHS_M, "checkpoints_km": CHECKPOINTS_KM,
                 "categories": CATEGORIES, "origins": entries,
                 "meaning": "Potentially intersecting population and mapped assets inside hypothetical corridors around a source river path. Not a flood extent, depth, probability, damage or loss."}
    geometry = {"format": "atlas-flood-corridor-geometry@1", "corridors": shapes}
    inputs = [input_reference("nepal-rivers-primary", "1.0.0"), input_reference("nepal-rivers-headwaters", "1.0.0"),
              input_reference("nepal-transboundary-glacial-lakes", "1.0.0"), input_reference("nepal-river-names", "1.0.0"),
              input_reference(POP_ID, POP_VERSION)] + [input_reference(i, "1.0.0") for i in ASSET_IDS]
    metadata = {
        "dataset_name": "Hypothetical flood and GLOF corridor catalogue with exposure ranges",
        "source": "Himalayan Disaster Atlas derived product (HydroRIVERS path, GLO lakes, HRSL population, OSM assets)",
        "source_url": "https://github.com/prasidupadhya/Himalayan-Disaster-Atlas", "license": "ODbL 1.0 for OSM-derived asset counts; CC BY 4.0 inputs credited",
        "license_url": "https://opendatacommons.org/licenses/odbl/1-0/",
        "attribution": "Derived from FAO Rivers 2026/HydroRIVERS (CC BY 4.0), Glacial Lake Observatory v1.02, GeoNames (CC BY 4.0), Meta/CIESIN HRSL (CC BY 4.0) and © OpenStreetMap contributors (ODbL).",
        "observation_date": None, "publication_date": None, "retrieval_date": now, "processing_date": now, "processing_version": METHOD,
        "method": ("Registered release points: the 10 largest Nepal glacier-fed GLO lakes linked to the nearest HydroRIVERS reach within 2 km "
                   "(declared assumption), and the main stem of the 8 largest river outlets traced upstream to the first retained reach. "
                   "Paths follow NEXT_DOWN. Corridors are local azimuthal-equidistant buffers of 250, 500 and 1,000 m each side around "
                   "reach-complete path prefixes at 10, 25, 50, 100 and 200 km and the full path. HRSL population uses exact EPSG:6933 "
                   "cell fractions; OSM assets count once per element on any intersection."),
        "spatial_resolution": {"value": None, "unit": None}, "temporal_resolution": None,
        "spatial_coverage": {"description": "Nepal river paths within the HydroRIVERS release; transboundary area is UNKNOWN population", "bbox": [79.9, 26.3, 88.3, 30.5]},
        "temporal_coverage": {"start": None, "end": None}, "crs": "OGC:CRS84", "status": "MODELLED", "evidence_type": "modelled", "is_fixture": False,
        "limitations": [
            "Corridor half-widths are declared sensitivity variants. They are not flood extents, inundation depths or confidence intervals.",
            "The lake-to-reach link is the nearest HydroRIVERS reach within 2 km of the GLO centroid; the real outlet and breach location are UNKNOWN.",
            "The path stops where HydroRIVERS coverage ends; downstream exposure beyond that point is UNKNOWN, not zero.",
            "Population outside Nepal is UNKNOWN; the known subtotal excludes that area and the total is then null.",
            "OSM inventories are incomplete. Zero mapped assets is not evidence of no infrastructure; categories overlap and must not be summed.",
            "Counts are potential spatial intersection only. Vulnerability, damage, casualties, losses and probability are UNKNOWN.",
        ],
        "uncertainty": "Ranges across corridor widths are sensitivity to a declared assumption, not statistical uncertainty. No physical validation exists.",
        "update_frequency": "static", "stale_after": None,
    }
    files = {"catalogue": ("catalogue.json.gz", gzip_bytes(encode(catalogue)), "application/json+gzip"),
             "geometry": ("corridors.geojson.gz", gzip_bytes(encode(geometry)), "application/json+gzip")}
    summary = {"origins": len(entries), "glof_origins": sum(e["kind"] == "glof-release-point" for e in entries),
               "river_origins": sum(e["kind"] == "river-entry-point" for e in entries), "widths_m": WIDTHS_M,
               "checkpoints_km": CHECKPOINTS_KM, "method": METHOD, "notice_files": []}
    publish(ID, VERSION, "corridor-catalogue", metadata, inputs, files, summary)
    print(json.dumps({k: len(v[1]) for k, v in files.items()}))


@semantic("corridor-catalogue")
def verify_corridor_catalogue(directory, manifest):
    catalogue = read_json_artifact(directory, manifest, "catalogue")
    geometry = read_json_artifact(directory, manifest, "geometry")
    require(catalogue["format"] == "atlas-flood-corridors@1" and geometry["format"] == "atlas-flood-corridor-geometry@1", "Unsupported corridor catalogue")
    ids = [o["id"] for o in catalogue["origins"]]
    require(len(ids) == len(set(ids)) == manifest["summary"]["origins"], "Corridor origin identities differ")
    for origin in catalogue["origins"]:
        require(origin["id"] in geometry["corridors"], f"Missing corridor geometry {origin['id']}")
        require(len(origin["path_reaches"]) == len(origin["path_lengths_km"]) > 0, "Path arrays differ")
        require(abs(sum(origin["path_lengths_km"]) - origin["path_length_km"]) < 0.01, "Path length differs from reach sum")
        previous = None
        for row in origin["checkpoints"]:
            require(1 <= row["reach_count"] <= len(origin["path_reaches"]), "Checkpoint outside path")
            require(len(row["end_coordinates"]) == 2, "Checkpoint end coordinate missing")
            widths = [row["by_width"][str(w)] for w in catalogue["widths_m"]]
            for item in widths:
                require(item["unknown_area_km2"] >= 0 and item["area_km2"] > 0, "Invalid corridor area")
                require(item["population_total"] is None or item["unknown_area_km2"] == 0, "Total population with unknown area")
                require(all(v >= 0 for v in item["categories"].values()), "Negative asset count")
            # Wider corridors contain narrower ones: area must not decrease.
            require(all(a["area_km2"] <= b["area_km2"] + 1e-6 for a, b in zip(widths, widths[1:])), "Corridor area not monotonic in width")
            if previous is not None:
                require(row["prefix_km"] >= previous["prefix_km"], "Checkpoints not ordered")
            previous = row


if __name__ == "__main__":
    main()
