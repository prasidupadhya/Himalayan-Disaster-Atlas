"""Feature 48: HRSL Nepal population grid for public exposure (CC BY 4.0).

Source: Meta & CIESIN High Resolution Settlement Layer (HRSL) v1.5 general-population
cloud-optimized GeoTIFFs on AWS Open Data. The two tiles intersecting Nepal are pinned by
SHA-256. The 1 arc-second people-per-cell values are summed exactly into a 3 arc-second
analysis raster (offline exposure) and a 30 arc-second browser grid (scenario exposure).

HRSL allocates census counts only to cells where buildings were detected; inside the Nepal
COD-AB boundary a missing (NaN) HRSL cell therefore contributes zero people. Outside Nepal the
grid is NoData (UNKNOWN), never zero.
"""

import argparse
import json
from datetime import datetime, timezone
from pathlib import Path

import numpy as np
import rasterio
from rasterio.features import rasterize
from rasterio.transform import Affine
from rasterio.windows import Window
from shapely.geometry import shape

from .contracts import ROOT
from .live_contracts import require
from .model_release import (
    digest,
    encode,
    external_input,
    gzip_bytes,
    input_reference,
    publish,
    read_json_artifact,
    semantic,
)

ID, VERSION = "nepal-hrsl-population", "1.0.0"
RAW = ROOT / "data/raw/population-hrsl"
BASE_URL = "https://dataforgood-fb-data.s3.amazonaws.com/hrsl-cogs/hrsl_general/v1.5/"
TILES = [
    {"name": "cog_globallat_20_lon_80_general-v1.5.5.tif", "byte_size": 141934592,
     "sha256": "7c8d438e2e55db1043ffcdbf0f99091596543a5245e49ecdf71090469c7443d5",
     "etag": "9fd4529a3746fac6215f01af0c5b42a9-17", "last_modified": "2023-03-21T03:40:04Z"},
    {"name": "cog_globallat_30_lon_80_general-v1.5.2.tif", "byte_size": 577361,
     "sha256": "0397fdaf8118e4c4446f5a05619c540344462fcd5191b284102cca9c00a16e78",
     "etag": "dd89e1d30aa79f54098b58ef07c51d69", "last_modified": "2023-03-20T20:27:07Z"},
]
ARC = 1 / 3600
ANALYSIS_FACTOR, BROWSER_FACTOR = 3, 30
ANALYSIS_NAME = "nepal-hrsl-3ss.tif"
REGISTRY_URL = "https://registry.opendata.aws/dataforgood-fb-hrsl/"
LICENSE_URL = "https://creativecommons.org/licenses/by/4.0/"
ATTRIBUTION = ("Meta and Center for International Earth Science Information Network (CIESIN), Columbia University. "
               "2022. High Resolution Settlement Layer (HRSL), v1.5. Source imagery © 2016 Maxar. Licensed CC BY 4.0.")


def nepal_country():
    base = ROOT / "data/releases/nepal-admin-country/2.0.1"
    manifest = json.loads((base / "manifest.json").read_text())
    raw = (base / Path(manifest["artifact"]["path"]).name).read_bytes()
    require(digest(raw) == manifest["artifact"]["sha256"], "Country boundary checksum mismatch")
    import gzip
    collection = json.loads(gzip.decompress(raw) if manifest["artifact"]["format"].endswith("+gzip") else raw)
    return shape(collection["features"][0]["geometry"])


def verify_tiles():
    for tile in TILES:
        path = RAW / tile["name"]
        require(path.exists(), f"Missing pinned HRSL tile {tile['name']}; download from {BASE_URL}{tile['name']}")
        raw = path.read_bytes()
        require(len(raw) == tile["byte_size"] and digest(raw) == tile["sha256"], f"HRSL tile hash mismatch: {tile['name']}")


def lattice():
    """Global 1 arc-second lattice shared by both HRSL tiles (edges on half arc-seconds)."""
    with rasterio.open(RAW / TILES[0]["name"]) as main, rasterio.open(RAW / TILES[1]["name"]) as north:
        for ds in (main, north):
            require(ds.crs.to_epsg() == 4326 and ds.count == 1 and ds.dtypes[0] == "float64", "Unexpected HRSL tile format")
            require(abs(ds.transform.a - ARC) < 1e-12 and abs(ds.transform.e + ARC) < 1e-12, "HRSL tile is not 1 arc-second")
        dx = (north.transform.c - main.transform.c) * 3600
        dy = (north.transform.f - main.transform.f) * 3600
        require(abs(dx - round(dx)) < 1e-6 and abs(dy - round(dy)) < 1e-6, "HRSL tiles are not on one lattice")
        return main.transform.c, main.transform.f, round(dx), round(dy)


def build(output_dir=RAW):
    verify_tiles()
    country = nepal_country()
    west0, north0, north_dx, north_dy = lattice()
    w, s, e, n = country.bounds
    block = BROWSER_FACTOR
    col0 = int(np.floor((w - west0) * 3600 / block)) * block
    col1 = int(np.ceil((e - west0) * 3600 / block)) * block
    row0 = int(np.floor((north0 - n) * 3600 / block)) * block  # negative: north of the main tile
    row1 = int(np.ceil((north0 - s) * 3600 / block)) * block
    width, height = col1 - col0, row1 - row0
    transform = Affine(ARC, 0, west0 + col0 * ARC, 0, -ARC, north0 - row0 * ARC)
    analysis = np.full((height // ANALYSIS_FACTOR, width // ANALYSIS_FACTOR), -1.0, dtype="float64")
    browser = np.zeros((height // block, width // block), dtype="float64")
    browser_nepal = np.zeros(browser.shape, dtype=bool)
    stats = {"nepal_subcells": 0, "populated_subcells": 0, "overlap_rows_compared": 0, "overlap_max_abs_difference": 0.0,
             "negative_values": 0, "nonfinite_values": 0}
    strip = 600
    with rasterio.open(RAW / TILES[0]["name"]) as main, rasterio.open(RAW / TILES[1]["name"]) as north:
        for top in range(0, height, strip):
            rows = min(strip, height - top)
            values = np.full((rows, width), np.nan)
            g0 = row0 + top  # global row index relative to main tile top
            # Main tile rows (global >= 0).
            m_start, m_end = max(g0, 0), min(g0 + rows, main.height)
            if m_end > m_start:
                values[m_start - g0:m_end - g0] = main.read(1, window=Window(col0, m_start, width, m_end - m_start))
            # North tile only where the main tile has no rows (global < 0).
            n_start, n_end = g0, min(g0 + rows, 0)
            if n_end > n_start:
                ncol0 = col0 - north_dx
                nrow0 = n_start + north_dy
                require(ncol0 >= 0, "North tile does not cover the western boundary")
                cols = min(width, north.width - ncol0)
                part = north.read(1, window=Window(ncol0, nrow0, cols, n_end - n_start))
                values[0:n_end - n_start, :cols] = part
            # Compare the band both tiles cover; differences are recorded, main tile is authoritative.
            o_start, o_end = max(g0, 0), min(g0 + rows, north.height - north_dy)
            if o_end > o_start and g0 + rows > 0:
                ncol0 = col0 - north_dx
                cols = min(width, north.width - ncol0)
                theirs = north.read(1, window=Window(ncol0, o_start + north_dy, cols, o_end - o_start))
                ours = values[o_start - g0:o_end - g0, :cols]
                both = np.isfinite(ours) & np.isfinite(theirs)
                if both.any():
                    stats["overlap_max_abs_difference"] = max(stats["overlap_max_abs_difference"], float(np.max(np.abs(ours[both] - theirs[both]))))
                stats["overlap_rows_compared"] += o_end - o_start
            strip_transform = transform * Affine.translation(0, top)
            inside = rasterize([(country, 1)], out_shape=(rows, width), transform=strip_transform, fill=0, dtype="uint8").astype(bool)
            finite = np.isfinite(values)
            stats["nonfinite_values"] += int(np.count_nonzero(~finite & ~np.isnan(values)))
            stats["negative_values"] += int(np.count_nonzero(finite & (values < 0)))
            people = np.where(inside & finite, values, 0.0)
            stats["nepal_subcells"] += int(inside.sum())
            stats["populated_subcells"] += int(np.count_nonzero(inside & finite & (values > 0)))
            a = ANALYSIS_FACTOR
            sums = people.reshape(rows // a, a, width // a, a).sum(axis=(1, 3))
            present = inside.reshape(rows // a, a, width // a, a).any(axis=(1, 3))
            analysis[top // a: top // a + rows // a] = np.where(present, sums, -1.0)
            b = block
            browser[top // b: top // b + rows // b] = people.reshape(rows // b, b, width // b, b).sum(axis=(1, 3))
            browser_nepal[top // b: top // b + rows // b] = inside.reshape(rows // b, b, width // b, b).any(axis=(1, 3))
    require(stats["negative_values"] == 0 and stats["nonfinite_values"] == 0, "HRSL contains negative or infinite values")
    output_dir.mkdir(parents=True, exist_ok=True)
    analysis_path = output_dir / ANALYSIS_NAME
    profile = {"driver": "GTiff", "width": analysis.shape[1], "height": analysis.shape[0], "count": 1, "dtype": "float64",
               "crs": "EPSG:4326", "transform": transform * Affine.scale(ANALYSIS_FACTOR), "nodata": -1.0,
               "compress": "deflate", "predictor": 3, "tiled": True, "blockxsize": 512, "blockysize": 512}
    with rasterio.open(analysis_path, "w", **profile) as out:
        out.update_tags(SOURCE="HRSL v1.5 general population; Nepal-only exact 3x3 sums")
        out.write(analysis, 1)
    return {"transform": transform, "analysis": analysis, "analysis_path": analysis_path, "browser": browser,
            "browser_nepal": browser_nepal, "stats": stats, "width": width, "height": height}


def browser_grid(result):
    """Row segments of Nepal cells (zero included); outside cells are absent and mean UNKNOWN."""
    t = result["transform"]
    cell = BROWSER_FACTOR * ARC
    rows = []
    values = np.round(result["browser"], 2)
    for r in range(values.shape[0]):
        mask = result["browser_nepal"][r]
        if not mask.any():
            continue
        segments, c = [], 0
        while c < mask.size:
            if not mask[c]:
                c += 1
                continue
            start = c
            while c < mask.size and mask[c]:
                c += 1
            segments.append([start, [float(v) for v in values[r, start:c]]])
        rows.append([r, segments])
    return {"format": "atlas-population-grid@1", "unit": "people per cell", "west": t.c, "north": t.f,
            "cell_degree": cell, "columns": int(values.shape[1]), "rows": int(values.shape[0]),
            "outside_meaning": "UNKNOWN (outside the Nepal COD-AB boundary)", "cells": rows}


def grid_total(grid):
    return sum(sum(values) for _, segments in grid["cells"] for _, values in segments)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--retrieved", default=None, help="UTC retrieval timestamp of the pinned tiles")
    args = parser.parse_args()
    result = build()
    analysis_raw = result["analysis_path"].read_bytes()
    grid = browser_grid(result)
    grid_raw = gzip_bytes(encode(grid))
    analysis = result["analysis"]
    valid = analysis[analysis >= 0]
    now = datetime.now(timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z")
    retrieved = args.retrieved or now
    summary = {
        "population_total": float(valid.sum()), "browser_grid_total": round(grid_total(grid), 2),
        "analysis_raster": {"name": ANALYSIS_NAME, "sha256": digest(analysis_raw), "byte_size": len(analysis_raw),
                            "width": int(analysis.shape[1]), "height": int(analysis.shape[0]), "resolution_degree": ANALYSIS_FACTOR * ARC,
                            "nodata": -1, "unit": "people per 3 arc-second cell", "valid_cells": int(valid.size),
                            "zero_cells": int(np.count_nonzero(valid == 0)), "max_cell_value": float(valid.max())},
        "browser_grid": {"resolution_degree": BROWSER_FACTOR * ARC, "nepal_cells": int(result["browser_nepal"].sum()),
                         "rounding": "Cell sums rounded to 0.01 people for delivery"},
        "source_tiles": TILES, "qa": result["stats"],
        "zero_rule": "Inside Nepal, HRSL NaN (no detected building) contributes 0 people; outside Nepal the grid is NoData/UNKNOWN.",
        "notice_files": [],
    }
    metadata = {
        "dataset_name": "Nepal population — Meta/CIESIN HRSL v1.5 (public exposure input)",
        "source": "Meta and CIESIN High Resolution Settlement Layer (HRSL) v1.5 general population via AWS Open Data",
        "source_url": REGISTRY_URL, "license": "CC BY 4.0", "license_url": LICENSE_URL, "attribution": ATTRIBUTION,
        "observation_date": None, "publication_date": "2023-03-21T03:40:04Z", "retrieval_date": retrieved,
        "processing_date": now, "processing_version": "population-hrsl-1.0.0",
        "method": ("Pinned the two HRSL v1.5 1 arc-second tiles intersecting Nepal by SHA-256; masked 1 arc-second cells whose centres lie in "
                   "the COD-AB v02 Nepal boundary; summed people exactly into 3 arc-second analysis cells and 30 arc-second browser cells. "
                   "No resampling, smoothing or reallocation."),
        "spatial_resolution": {"value": BROWSER_FACTOR * ARC, "unit": "degree"},
        "temporal_resolution": None,
        "spatial_coverage": {"description": "Nepal (COD-AB v02 boundary); outside cells are UNKNOWN",
                             "bbox": [round(result["transform"].c, 6), round(result["transform"].f - result["height"] * ARC, 6),
                                      round(result["transform"].c + result["width"] * ARC, 6), round(result["transform"].f, 6)]},
        "temporal_coverage": {"start": None, "end": None}, "crs": "OGC:CRS84", "status": "MODELLED", "evidence_type": "modelled",
        "is_fixture": False,
        "limitations": [
            "HRSL is a modelled allocation of CIESIN census-based counts to building-detected cells, not a census or a count observed in each cell.",
            "The census reference year and HRSL model vintage are not stated per cell; the population year is UNKNOWN beyond the v1.5 release date.",
            "Inside Nepal, cells without detected buildings contribute zero people by method; missed buildings shift people to other cells.",
            "Cells outside the Nepal boundary are UNKNOWN, so transboundary corridors report unknown area rather than zero people.",
            "Border cells include only the Nepal portion of each source 1 arc-second cell centre test.",
            "Seasonal mobility, displacement and tourists are not represented. Counts are not vulnerability or loss.",
            "The 30 arc-second browser grid is a sum-preserving aggregation for scenario screening; offline exposure uses the 3 arc-second raster.",
        ],
        "uncertainty": "No per-cell confidence interval is published by HRSL; none is invented. Treat counts as modelled estimates.",
        "update_frequency": "static", "stale_after": None,
    }
    inputs = [input_reference("nepal-admin-country", "2.0.1")] + [
        external_input("hrsl-general-tile", "1.5.0", f"HRSL v1.5 tile {t['name']}", t["sha256"], BASE_URL + t["name"]) for t in TILES]
    manifest = publish(ID, VERSION, "population-grid", metadata, inputs,
                       {"grid": ("grid.json.gz", grid_raw, "application/json+gzip")}, summary)
    print(json.dumps({"total": summary["population_total"], "grid_total": summary["browser_grid_total"],
                      "cells": summary["browser_grid"]["nepal_cells"], "qa": summary["qa"], "bytes": len(grid_raw)}, indent=1))
    return manifest


@semantic("population-grid")
def verify_population_grid(directory, manifest):
    grid = read_json_artifact(directory, manifest, "grid")
    require(grid["format"] == "atlas-population-grid@1" and grid["unit"] == "people per cell", "Unsupported population grid")
    count, total = 0, 0.0
    last_row = -1
    for row, segments in grid["cells"]:
        require(row > last_row and 0 <= row < grid["rows"], "Population grid rows must be strictly increasing")
        last_row, last_end = row, -1
        for start, values in segments:
            require(start > last_end and start + len(values) <= grid["columns"] and values, "Overlapping or empty grid segment")
            require(all(isinstance(v, (int, float)) and v >= 0 for v in values), "Population cells must be nonnegative")
            last_end = start + len(values)
            count += len(values)
            total += sum(values)
    summary = manifest["summary"]
    require(count == summary["browser_grid"]["nepal_cells"], "Grid cell count differs from summary")
    require(abs(round(total, 2) - summary["browser_grid_total"]) < 0.01, "Grid total differs from summary")
    # Rounding to 0.01 per cell bounds the difference from the exact analysis total.
    require(abs(total - summary["population_total"]) <= 0.005 * count + 1e-6, "Browser grid does not preserve the source sum")
    analysis = RAW / summary["analysis_raster"]["name"]
    if analysis.exists():
        require(digest(analysis.read_bytes()) == summary["analysis_raster"]["sha256"], "Local analysis raster differs from the pinned hash")


if __name__ == "__main__":
    main()
