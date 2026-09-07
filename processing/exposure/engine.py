"""Offline exposure-overlay/1.0.0. Counts mapped assets, never damage or risk."""
import math

import numpy as np
import rasterio
import shapely
from rasterio.warp import transform as transform_coordinates
from rasterio.windows import Window, from_bounds
from shapely.geometry import box, mapping, shape
from shapely.ops import transform, unary_union

METHOD = "exposure-overlay/1.0.0"
AREA_CRS = "EPSG:6933"


def project(geometry, source="EPSG:4326", target=AREA_CRS):
    def convert(x, y, z=None):
        return transform_coordinates(source, target, x, y)
    return transform(convert, geometry)


def footprint_geometry(request):
    if request["crs"] != "OGC:CRS84":
        raise ValueError("Footprint must explicitly use OGC:CRS84 longitude/latitude")
    geometry = request["geometry"]
    if geometry['type'] not in {'Polygon', 'MultiPolygon'}:
        raise ValueError('Footprint must be polygonal; points and unbuffered traces have no exposure area')
    polygons = [geometry["coordinates"]] if geometry["type"] == "Polygon" else geometry["coordinates"]
    for polygon in polygons:
        for ring in polygon:
            if len(ring) < 4 or list(ring[0]) != list(ring[-1]):
                raise ValueError("Footprint rings must be explicitly closed with at least four positions")
    geom = shape(geometry)
    if geom.geom_type not in {"Polygon", "MultiPolygon"} or geom.is_empty or not geom.is_valid:
        raise ValueError("Footprint must be a nonempty valid Polygon/MultiPolygon; no automatic repair")
    if geom.has_z or not np.isfinite(shapely.get_coordinates(geom)).all():
        raise ValueError("Footprint coordinates must be finite and two-dimensional")
    w, s, e, n = geom.bounds
    if not (79 <= w < e <= 89 and 25 <= s < n <= 32):
        raise ValueError("Footprint exceeds supported Nepal-region bounds or has wrong coordinate order/CRS")
    # Preserve geographic straight edges under the non-linear equal-area projection.
    return project(shapely.segmentize(geom, 0.001))


def population_overlay(footprint, raster, chunk_rows=64):
    """Exact equal-area cell fractions; no resampling and bounded row-window memory."""
    if raster.crs != rasterio.crs.CRS.from_epsg(4326) or raster.count != 1:
        raise ValueError("Population must be one native EPSG:4326 people-per-cell band")
    t = raster.transform
    if t.b != 0 or t.d != 0 or t.a <= 0 or t.e >= 0 or raster.nodata is None:
        raise ValueError("Population grid must be north-up with explicit NoData")
    if footprint.is_empty:
        return {"known_population": 0.0, "total_population": 0.0, "valid_area_km2": 0.0,
                "unknown_area_km2": 0.0, "outside_grid_area_km2": 0.0, "intersected_valid_cells": 0}
    grid = project(box(*raster.bounds))
    overlap = footprint.intersection(grid)
    area = footprint.area
    if overlap.is_empty:
        return {"known_population": None, "total_population": None, "valid_area_km2": 0.0,
                "unknown_area_km2": area / 1e6, "outside_grid_area_km2": area / 1e6, "intersected_valid_cells": 0}
    window = from_bounds(*project(overlap, AREA_CRS, "EPSG:4326").bounds, t)
    left, top = max(0, math.floor(window.col_off)), max(0, math.floor(window.row_off))
    right = min(raster.width, math.ceil(window.col_off + window.width))
    bottom = min(raster.height, math.ceil(window.row_off + window.height))
    lon = t.c + np.arange(left, right + 1) * t.a
    lat = t.f + np.arange(top, bottom + 1) * t.e
    xs = np.array(transform_coordinates("EPSG:4326", AREA_CRS, lon, np.zeros(len(lon)))[0])
    ys = np.array(transform_coordinates("EPSG:4326", AREA_CRS, np.zeros(len(lat)), lat)[1])
    shapely.prepare(footprint)
    total, valid_area, count = 0.0, 0.0, 0
    for row in range(top, bottom, chunk_rows):
        block = raster.read(1, window=Window(left, row, right - left, min(chunk_rows, bottom - row)), masked=True)
        good = ~np.ma.getmaskarray(block)
        if not np.isfinite(block.data[good]).all() or np.any(block.data[good] < 0):
            raise ValueError("Valid population cells must be finite nonnegative counts")
        rr, cc = np.nonzero(good)
        if not len(rr):
            continue
        yy = rr + row - top
        cells = shapely.box(xs[cc], ys[yy + 1], xs[cc + 1], ys[yy])
        hit = shapely.intersects(footprint, cells)
        cells, rr, cc = cells[hit], rr[hit], cc[hit]
        if not len(cells):
            continue
        cell_area = shapely.area(cells)
        weights = np.ones(len(cells), dtype="float64")
        partial = ~shapely.covers(footprint, cells)
        weights[partial] = shapely.area(shapely.intersection(cells[partial], footprint)) / cell_area[partial]
        weights = np.clip(weights, 0, 1)
        total += float(np.sum(block.data[rr, cc].astype("float64") * weights))
        valid_area += float(np.sum(cell_area * weights))
        count += int(np.count_nonzero(weights > 0))
    unknown = max(0.0, area - valid_area)
    # Numerical tolerance only, not a policy for concealing missing cells.
    if unknown < max(0.001, area * 1e-10):
        unknown = 0.0
    return {"known_population": total if count else None, "total_population": total if unknown == 0 else None,
            "valid_area_km2": valid_area / 1e6, "unknown_area_km2": unknown / 1e6,
            "outside_grid_area_km2": max(0.0, area - overlap.area) / 1e6, "intersected_valid_cells": count}


def asset_index(datasets):
    """Deduplicate OSM identities across partitions/classes; conflicting geometry fails."""
    records = {}
    for dataset in datasets:
        for f in dataset["collection"]["features"]:
            p = f["properties"]
            identity = f"osm/{p['osm_element_type']}/{p['osm_element_id']}"
            category = p.get("infrastructure_class", "hydropower")
            geo = shape(f["geometry"])
            if geo.is_empty or not geo.is_valid:
                raise ValueError("Invalid asset geometry")
            projected = project(shapely.segmentize(geo, 0.001))
            representation = {"category": category, "dataset_id": p["dataset_id"], "geometry": projected,
                              "position_basis": p.get("position_basis", "OSM node coordinate or way/relation centre")}
            if identity in records:
                record = records[identity]
                if category in record["source_geometry"] and not record["source_geometry"][category].equals(geo):
                    raise ValueError(f"Conflicting geometry for duplicated asset {identity}")
                record["source_geometry"][category] = geo
                record["categories"].add(category)
                record["dataset_ids"].add(p["dataset_id"])
                record["representations"].append(representation)
                record["geometry"] = unary_union([record["geometry"], projected])
                continue
            records[identity] = {"id": identity, "categories": {category}, "dataset_ids": {p["dataset_id"]},
                                 "name": p.get("asset_name", p.get("facility_name")),
                                 "position_basis": p.get("position_basis", "OSM node coordinate or way/relation centre"),
                                 "source_geometry": {category: geo}, "geometry": projected, "representations": [representation]}
    ordered = sorted(records.values(), key=lambda item: item["id"])
    return ordered, shapely.STRtree([record["geometry"] for record in ordered])


def vector_overlay(footprint, indexed):
    records, tree = indexed
    matched = []
    for index in sorted(tree.query(footprint, predicate="intersects")):
        record = records[index]
        hits = [r for r in record["representations"] if r["geometry"].intersects(footprint)]
        clipped = unary_union([r["geometry"].intersection(footprint) for r in hits])
        matched.append({**record, "intersection": clipped, "categories": {r["category"] for r in hits},
                        "dataset_ids": {r["dataset_id"] for r in hits},
                        "position_basis": '; '.join(sorted({r["position_basis"] for r in hits}))})
    return matched


def administrative_overlay(footprint, districts):
    """Disjoint area pieces; lowest P-code wins any overlapping coverage."""
    assigned = shapely.GeometryCollection()
    pieces = []
    for f in sorted(districts, key=lambda f: f["properties"]["pcode"]):
        geom = project(shapely.segmentize(shape(f["geometry"]), 0.001))
        clipped = footprint.intersection(geom).difference(assigned)
        if clipped.area > 0:
            pieces.append({"pcode": f["properties"]["pcode"], "name": f["properties"]["name"], "geometry": clipped})
            assigned = unary_union([assigned, clipped])
    rest = footprint.difference(assigned)
    if not rest.is_empty and rest.area > 0:
        pieces.append({"pcode": None, "name": "UNASSIGNED / outside district coverage", "geometry": rest})
    return pieces


def assign_assets(matched, pieces):
    # Each canonical asset belongs to one summary row: largest clipped area (polygons),
    # then length (lines), or point coverage. Ties follow sorted P-code, unassigned last.
    for item in matched:
        best, best_score = None, -1
        geom = item["intersection"]
        for piece in pieces:
            overlap = geom.intersection(piece["geometry"])
            if overlap.is_empty:
                continue
            score = overlap.area if geom.area > 0 else overlap.length if geom.length > 0 else 1
            if score > best_score:
                best, best_score = piece["pcode"], score
        item["admin_pcode"] = best


def spatial_features(matched):
    features = []
    for item in matched:
        geometry = project(item["intersection"], AREA_CRS, "EPSG:4326")
        parts = list(geometry.geoms) if geometry.geom_type == "GeometryCollection" else [geometry]
        for index, part in enumerate(parts):
            features.append({"type": "Feature", "id": f"{item['id']}/{index}", "geometry": mapping(part),
                             "properties": {"asset_id": item["id"], "categories": sorted(item["categories"]), "name": item["name"]}})
    return {"type": "FeatureCollection", "features": features}
