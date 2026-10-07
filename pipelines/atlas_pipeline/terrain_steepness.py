"""District terrain-steepness context for landslide awareness (Feature 53).

Slope is computed from the same Copernicus GLO-90 tiles pinned for ``nepal-terrain`` (``pipelines/terrain-sources.json``)
and summarised per COD-AB district. This is terrain context only: landslide susceptibility, probability and
hazard levels are UNKNOWN in the Atlas, because no reviewed inventory-calibrated model is available.

``--download`` fetches the 45 tiles covering Nepal into ``data/raw/terrain-cop90/`` and verifies their pinned
SHA-256; without arguments the release is built and published.
"""

import argparse
import gzip
import json
import math
from pathlib import Path
from urllib.request import Request, urlopen

import numpy as np
import rasterio
from rasterio.features import rasterize
from rasterio.transform import from_origin
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

ID, VERSION = "nepal-terrain-steepness", "1.0.0"
RAW = ROOT / "data/raw/terrain-cop90"
LOCK = ROOT / "pipelines/terrain-sources.json"
STEP = 1 / 1200  # 3 arc-seconds
WEST, NORTH, COLS, ROWS = 80.0, 31.0, 9 * 1200, 5 * 1200  # tiles N26-N30, E080-E088
SLOPE_CLASSES = [  # degrees; boundaries are declared reporting classes, not hazard thresholds
    {"id": "0-5", "min": 0, "max": 5}, {"id": "5-15", "min": 5, "max": 15}, {"id": "15-30", "min": 15, "max": 30},
    {"id": "30-45", "min": 30, "max": 45}, {"id": "45+", "min": 45, "max": 90},
]
EARTH_M = 6371008.8


def tiles():
    lock = json.loads(LOCK.read_text())
    chosen = [t for t in lock if 80 <= round(t["transform"][2] + STEP / 2) <= 88 and 27 <= round(t["transform"][5] - STEP / 2) <= 31]
    require(len(chosen) == 45, f"Expected 45 pinned GLO-90 tiles over Nepal, found {len(chosen)}")
    return chosen


def download():
    RAW.mkdir(parents=True, exist_ok=True)
    for tile in tiles():
        path = RAW / f"{tile['name']}.tif"
        if not path.exists():
            with urlopen(Request(tile["url"], headers={"User-Agent": "himalayan-disaster-atlas"}), timeout=300) as response:
                path.write_bytes(response.read())
        raw = path.read_bytes()
        require(digest(raw) == tile["sha256"] and len(raw) == tile["byte_size"], f"GLO-90 tile hash mismatch: {tile['name']}")


def mosaic():
    dem = np.full((ROWS, COLS), np.nan, dtype=np.float32)
    for tile in tiles():
        path = RAW / f"{tile['name']}.tif"
        raw = path.read_bytes()
        require(digest(raw) == tile["sha256"], f"GLO-90 tile hash mismatch: {tile['name']}")
        with rasterio.open(path) as ds:
            require(ds.width == 1200 and ds.height == 1200 and ds.crs.to_epsg() == 4326, f"Unexpected tile grid {tile['name']}")
            col = round((ds.transform.c + STEP / 2 - WEST) / STEP)
            row = round((NORTH - (ds.transform.f - STEP / 2)) / STEP)
            dem[row:row + 1200, col:col + 1200] = ds.read(1)
    require(np.isfinite(dem).all(), "Mosaic has gaps")
    return dem


def slope_degrees(dem):
    """Horn (1981) slope on the geographic grid with latitude-dependent east-west spacing; edges are NaN."""
    lat = NORTH - (np.arange(ROWS) + 0.5) * STEP
    dy = EARTH_M * math.radians(STEP)
    dx = (EARTH_M * np.cos(np.radians(lat)) * math.radians(STEP))[1:-1, None]
    z = dem.astype(np.float64)
    a, b, c = z[:-2, :-2], z[:-2, 1:-1], z[:-2, 2:]
    d, f = z[1:-1, :-2], z[1:-1, 2:]
    g, h, i = z[2:, :-2], z[2:, 1:-1], z[2:, 2:]
    dzdx = ((c + 2 * f + i) - (a + 2 * d + g)) / (8 * dx)
    dzdy = ((g + 2 * h + i) - (a + 2 * b + c)) / (8 * dy)
    out = np.full(dem.shape, np.nan, dtype=np.float32)
    out[1:-1, 1:-1] = np.degrees(np.arctan(np.hypot(dzdx, dzdy)))
    return out


def districts():
    base = ROOT / "data/releases/nepal-admin-districts/2.0.1"
    manifest = json.loads((base / "manifest.json").read_text())
    raw = (base / Path(manifest["artifact"]["path"]).name).read_bytes()
    require(digest(raw) == manifest["artifact"]["sha256"], "District boundary checksum mismatch")
    collection = json.loads(gzip.decompress(raw) if manifest["artifact"]["format"].endswith("+gzip") else raw)
    return collection["features"]


def build():
    dem = mosaic()
    slope = slope_degrees(dem)
    features = districts()
    transform = from_origin(WEST, NORTH, STEP, STEP)
    ids = rasterize(((shape(f["geometry"]), n + 1) for n, f in enumerate(features)), out_shape=dem.shape, transform=transform, fill=0, dtype="uint16")
    lat = NORTH - (np.arange(ROWS) + 0.5) * STEP
    cell_km2 = (EARTH_M * math.radians(STEP)) ** 2 * np.cos(np.radians(lat)) / 1e6
    area = np.broadcast_to(cell_km2[:, None], dem.shape)
    rows = []
    for n, feature in enumerate(features):
        mask = (ids == n + 1) & np.isfinite(slope)
        require(mask.any(), f"District without terrain cells: {feature['properties'].get('name')}")
        weights = area[mask]
        s, z = slope[mask], dem[mask]
        total = float(weights.sum())
        classes = {c["id"]: round(float(weights[(s >= c["min"]) & (s < c["max"] if c["max"] < 90 else s <= 90)].sum()) / total, 5) for c in SLOPE_CLASSES}
        order = np.argsort(s)
        cumulative = np.cumsum(weights[order])
        median = float(s[order][np.searchsorted(cumulative, cumulative[-1] / 2)])
        props = feature["properties"]
        rows.append({
            "district_id": props["pcode"], "name": props["name"],
            "province": props["parent_name"], "province_pcode": props["parent_pcode"], "area_km2": round(total, 1), "boundary_area_km2": props.get("value"),
            "slope_class_share": classes, "slope_mean_deg": round(float(np.average(s, weights=weights)), 2), "slope_median_deg": round(median, 2),
            "share_steeper_than_30_deg": round(classes["30-45"] + classes["45+"], 5),
            "elevation_mean_m": round(float(np.average(z, weights=weights)), 1), "elevation_min_m": round(float(z.min()), 1), "elevation_max_m": round(float(z.max()), 1),
            "label_longitude": props.get("label_longitude"), "label_latitude": props.get("label_latitude"),
        })
    nepal = ids > 0
    weights = area[nepal & np.isfinite(slope)]
    s = slope[nepal & np.isfinite(slope)]
    national = {c["id"]: round(float(weights[(s >= c["min"]) & (s < c["max"] if c["max"] < 90 else s <= 90)].sum() / weights.sum()), 5) for c in SLOPE_CLASSES}
    return {"format": "atlas-terrain-steepness@1", "slope_classes": SLOPE_CLASSES, "method": "Horn (1981) 3x3 slope on the 3 arc-second GLO-90 grid; area-weighted by cell area; district by cell-centre rasterisation.",
            "districts": rows, "national_slope_class_share": national}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--download", action="store_true")
    parser.add_argument("--retrieved", default="2026-09-07T08:50:55Z")
    args = parser.parse_args()
    if args.download:
        download()
        print("Verified 45 GLO-90 tiles")
        return
    context = build()
    metadata = {
        "dataset_name": "Nepal district terrain steepness (landslide awareness context) — Copernicus GLO-90",
        "source": "Copernicus DEM GLO-90 (2021 release), AWS COG distribution; tiles pinned in pipelines/terrain-sources.json",
        "source_url": "https://registry.opendata.aws/copernicus-dem/", "license": "Copernicus WorldDEM-90 free and open licence",
        "license_url": "https://dataspace.copernicus.eu/sites/default/files/media/files/2025-06/copernicus_contributing_mission_data_access_v2_cop_dem_licenses.pdf",
        "attribution": "produced using Copernicus WorldDEM™-90 © DLR e.V. 2010-2014 and © Airbus Defence and Space GmbH 2014-2018 provided under COPERNICUS by the European Union and ESA; all rights reserved",
        "observation_date": None, "publication_date": None, "retrieval_date": args.retrieved, "processing_date": "2026-10-07T18:00:00Z",
        "processing_version": "terrain-steepness/1.0.0",
        "method": "Mosaicked the 45 pinned GLO-90 tiles over Nepal without resampling; computed Horn (1981) slope with latitude-dependent spacing; summarised slope classes, mean/median slope and elevation per COD-AB v02 district with cell-area weights.",
        "evidence_type": "derived", "status": "ATLAS_DERIVED", "is_fixture": False,
        "spatial_resolution": {"unit": "degree", "value": STEP}, "temporal_resolution": None, "crs": "OGC:CRS84",
        "update_frequency": "static", "stale_after": None,
        "limitations": [
            "This is terrain context, not landslide susceptibility, probability or hazard. Many slope failures occur on moderate slopes and steep rock can be stable; no inventory-calibrated model is applied.",
            "GLO-90 is a digital surface model including vegetation and buildings; about 90 m cells smooth ridges and gullies, so local slopes are underestimated.",
            "Slope classes are declared reporting intervals, not hazard thresholds.",
            "Districts are assigned by cell centre; boundary cells are not split.",
            "Geology, soils, land cover, rainfall triggers, earthquakes and drainage are not included. Reported landslide records are a separate dataset excluded from the public build pending licence review.",
        ],
        "uncertainty": "GLO-90 vertical accuracy is not validated locally; slope error is UNKNOWN for steep Himalayan terrain.",
        "spatial_coverage": {"description": "Nepal (COD-AB v02 districts)", "bbox": [80.0, 26.0, 89.0, 31.0]},
        "temporal_coverage": {"start": None, "end": None},
    }
    lock_raw = LOCK.read_bytes()
    inputs = [input_reference("nepal-admin-districts", "2.0.1"), input_reference("nepal-terrain", "1.0.0"),
              external_input("copernicus-glo90-tile-lock", "2021.1.0", "Pinned GLO-90 tile list (pipelines/terrain-sources.json)", digest(lock_raw), "https://registry.opendata.aws/copernicus-dem/")]
    summary = {"districts": len(context["districts"]), "national_slope_class_share": context["national_slope_class_share"], "notice_files": []}
    publish(ID, VERSION, "terrain-context", metadata, inputs, {"steepness": ("steepness.json.gz", gzip_bytes(encode(context)), "application/json+gzip")}, summary)
    print(f"Published {ID}@{VERSION}: {summary['districts']} districts")


@semantic("terrain-context")
def verify_terrain_steepness(directory, manifest):
    context = read_json_artifact(directory, manifest, "steepness")
    require(context["format"] == "atlas-terrain-steepness@1" and len(context["districts"]) == manifest["summary"]["districts"] == 77, "Unexpected terrain context")
    ids = set()
    for row in context["districts"]:
        require(row["district_id"] not in ids, "Duplicate district")
        ids.add(row["district_id"])
        share = row["slope_class_share"]
        require(set(share) == {c["id"] for c in SLOPE_CLASSES} and abs(sum(share.values()) - 1) < 1e-3, "Slope shares must partition the district")
        require(abs(row["share_steeper_than_30_deg"] - share["30-45"] - share["45+"]) < 1e-4, "Steep share inconsistent")
        require(0 <= row["slope_mean_deg"] <= 90 and row["elevation_min_m"] <= row["elevation_mean_m"] <= row["elevation_max_m"], "Implausible terrain summary")
    require(abs(sum(context["national_slope_class_share"].values()) - 1) < 1e-3, "National slope shares must sum to 1")


if __name__ == "__main__":
    main()
