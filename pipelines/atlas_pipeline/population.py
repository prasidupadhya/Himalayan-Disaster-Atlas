"""Build static display tiles from the pinned WorldPop 2025 Nepal analysis raster."""

import argparse
import hashlib
import json
import math
import shutil
from datetime import datetime, timedelta, timezone
from pathlib import Path

import numpy as np
import rasterio
from PIL import Image
from rasterio.enums import Resampling
from rasterio.transform import from_bounds
from rasterio.warp import reproject

from .contracts import ROOT
from .population_contracts import verify_population

VERSION = "1.0.0"
DATASET_ID = "nepal-population"
EXPECTED_SHA256 = "b7b581e181df5e2f84b2e20d3455429393829395619a9600e45c6907674a0639"
SOURCE_FILENAME = "npl_pop_2025_CN_100m_R2025A_v1.tif"
SOURCE_URL = "https://hub.worldpop.org/geodata/summary?id=74559"
DOWNLOAD_URL = "https://data.worldpop.org/GIS/Population/Global_2015_2030/R2025A/2025/NPL/v1/100m/constrained/npl_pop_2025_CN_100m_R2025A_v1.tif"
LICENSE_URL = "https://creativecommons.org/licenses/by/4.0/"
HALF = math.pi * 6378137


def now():
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z")


def digest(content):
    return hashlib.sha256(content).hexdigest()


def write_json(path, value):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, sort_keys=True, separators=(",", ":"), allow_nan=False) + "\n")


def tile_range(bounds, zoom):
    west, south, east, north = bounds
    n = 2**zoom

    def x(lon):
        return math.floor((lon + 180) / 360 * n)

    def y(lat):
        return math.floor((1 - math.asinh(math.tan(math.radians(lat))) / math.pi) / 2 * n)

    return x(west), x(east), y(north), y(south)


def mercator_bounds(x, y, zoom):
    n = 2**zoom
    left = HALF * (2 * x / n - 1)
    right = HALF * (2 * (x + 1) / n - 1)
    top = HALF * (1 - 2 * y / n)
    bottom = HALF * (1 - 2 * (y + 1) / n)
    return left, bottom, right, top


def rgba(values, reference):
    valid = np.isfinite(values) & (values > 0)
    norm = np.zeros(values.shape, dtype="float32")
    norm[valid] = np.clip(np.log1p(values[valid]) / math.log1p(reference), 0, 1)
    red = np.clip(35 + 180 * norm, 0, 255).astype("uint8")
    green = np.clip(185 - 95 * norm, 0, 255).astype("uint8")
    blue = np.clip(215 - 55 * norm, 0, 255).astype("uint8")
    alpha = np.zeros(values.shape, dtype="uint8")
    alpha[valid] = np.clip(40 + 215 * np.sqrt(norm[valid]), 0, 255).astype("uint8")
    return np.stack([red, green, blue, alpha], axis=-1)


def build(source, root=ROOT):
    source = Path(source)
    content = source.read_bytes()
    source_sha = digest(content)
    if source_sha != EXPECTED_SHA256:
        raise ValueError("WorldPop source checksum changed; pin a new source/version before publishing")
    release = root / f"data/releases/{DATASET_ID}/{VERSION}"
    public = root / f"apps/web/public/data/{DATASET_ID}/{VERSION}"
    if release.exists():
        verify_population(release, public)
        print("Existing immutable population release verified")
        return
    stage = root / "data/processed/population/release"
    if stage.exists():
        shutil.rmtree(stage)
    stage.mkdir(parents=True)
    with rasterio.open(source) as src:
        if src.crs.to_epsg() != 4326 or src.width != 9773 or src.height != 4921 or src.count != 1:
            raise ValueError("Unexpected WorldPop raster grid")
        if src.dtypes != ("float32",) or src.nodata != -99999.0:
            raise ValueError("Unexpected WorldPop datatype or NoData value")
        bounds = [src.bounds.left, src.bounds.bottom, src.bounds.right, src.bounds.top]
        if not np.allclose(src.res, (0.00083333333, 0.00083333333), atol=1e-12, rtol=0):
            raise ValueError("Unexpected WorldPop grid resolution")
        native = src.read(1)
        valid_mask = native != src.nodata
        valid = native[valid_mask].astype("float64")
        if np.any(valid < 0) or not np.all(np.isfinite(valid)):
            raise ValueError("WorldPop valid population cells must be finite and non-negative")
        population_sum = float(valid.sum())
        positive = valid[valid > 0]
        reference = float(np.percentile(positive, 99.5))
        index = {}
        for zoom in range(5, 11):
            x0, x1, y0, y1 = tile_range(bounds, zoom)
            for x in range(x0, x1 + 1):
                for y in range(y0, y1 + 1):
                    destination = np.full((256, 256), np.nan, dtype="float32")
                    reproject(
                        source=rasterio.band(src, 1),
                        destination=destination,
                        src_transform=src.transform,
                        src_crs=src.crs,
                        src_nodata=src.nodata,
                        dst_transform=from_bounds(*mercator_bounds(x, y, zoom), 256, 256),
                        dst_crs="EPSG:3857",
                        dst_nodata=np.nan,
                        resampling=Resampling.bilinear,
                    )
                    tile = stage / f"{zoom}/{x}/{y}.png"
                    tile.parent.mkdir(parents=True, exist_ok=True)
                    Image.fromarray(rgba(destination, reference), mode="RGBA").save(tile, optimize=True)
                    tile_content = tile.read_bytes()
                    if len(tile_content) > 262144:
                        raise ValueError(f"Population tile exceeds browser budget: {tile}")
                    index[str(tile.relative_to(stage))] = {
                        "sha256": digest(tile_content),
                        "byte_size": len(tile_content),
                    }
        analysis = {
            "source_filename": SOURCE_FILENAME,
            "source_sha256": source_sha,
            "crs": "EPSG:4326",
            "width": src.width,
            "height": src.height,
            "resolution_degree": float(src.res[0]),
            "nodata": -99999,
            "unit": "people/source-grid-cell",
            "valid_cells": int(valid_mask.sum()),
            "zero_cells": int(np.sum(valid == 0)),
            "population_sum": population_sum,
            "max_cell_value": float(valid.max()),
            "display_reference_value": reference,
        }
    index_bytes = (json.dumps(index, sort_keys=True, separators=(",", ":")) + "\n").encode()
    (stage / "tiles.json").write_bytes(index_bytes)
    retrieval = now()
    manifest = {
        "metadata": {
            "schema_version": "3.0.0",
            "dataset_id": DATASET_ID,
            "dataset_name": "Nepal 2025 constrained population — WorldPop R2025A v1",
            "dataset_version": VERSION,
            "source": "WorldPop, University of Southampton — Global 2015–2030 R2025A v1",
            "source_url": SOURCE_URL,
            "license": "CC BY 4.0 as declared in the source GeoTIFF; WorldPop Hub also documents an ODbL derived-data clause requiring legal review for some building-derived products",
            "license_url": LICENSE_URL,
            "attribution": "WorldPop, University of Southampton — R2025A v1 (2025), DOI 10.5258/SOTON/WP00839",
            "observation_date": "2025-01-01T00:00:00Z",
            "publication_date": "2025-09-01T00:00:00Z",
            "retrieval_date": retrieval,
            "processing_date": retrieval,
            "processing_version": "population-pipeline-1.0.0",
            "method": (
                f"Pinned source GeoTIFF {DOWNLOAD_URL} by SHA-256 {source_sha}. The native 3 arc-second EPSG:4326 "
                "people-per-grid-cell raster is retained as the analysis source. Web tiles are a separate bilinearly reprojected "
                "EPSG:3857 RGBA visualization with log1p intensity capped at the source-positive 99.5th percentile; display tiles "
                "must never be aggregated or sampled as population counts."
            ),
            "spatial_resolution": {"value": 0.00083333333, "unit": "degree"},
            "temporal_resolution": "annual modelled estimate",
            "spatial_coverage": {"description": "WorldPop Nepal R2025A source raster extent", "bbox": bounds},
            "temporal_coverage": {"start": "2025-01-01T00:00:00Z", "end": "2025-01-01T00:00:00Z"},
            "crs": "OGC:CRS84",
            "status": "MODELLED",
            "evidence_type": "modelled",
            "is_fixture": False,
            "limitations": [
                "This is a modelled 2025 population estimate, not a 2025 census or a count observed at every pixel.",
                "The constrained method allocates population to cells identified as residential buildings or built settlements; omissions and false-positive settlement mapping affect local allocation.",
                "Nepal modelling uses the second census timepoint (2021) and model uncertainty grows away from source census years and at small spatial scales.",
                "Rapid-onset displacement, seasonal movement and intra-annual mobility are not represented.",
                "The R2025A product is an alpha release and may be revised; the Global2 grid is not aligned with older Global1 products.",
                "The source mask follows the WorldPop/LSIB master grid and should not be assumed to match the atlas COD-AB international boundary exactly.",
                "Web tiles are log-scaled visualization derivatives. Only the pinned native GeoTIFF is suitable for future numerical exposure aggregation.",
                "The GeoTIFF declares CC BY 4.0, while the WorldPop Hub separately notes an ODbL clause for some OSM/Microsoft-building-derived datasets; redistribution terms should be re-audited before production release.",
            ],
            "uncertainty": "Population values inherit WorldPop census-input, demographic-model, settlement-mapping and temporal-projection uncertainty; no per-cell confidence interval is encoded in this raster.",
            "update_frequency": "periodic",
            "stale_after": (
                datetime.fromisoformat(retrieval.replace("Z", "+00:00")) + timedelta(days=365)
            ).isoformat().replace("+00:00", "Z"),
            "artifact": {
                "path": f"/data/{DATASET_ID}/{VERSION}/tiles.json",
                "format": "PopulationRGBA-index",
                "sha256": digest(index_bytes),
                "byte_size": len(index_bytes),
            },
        },
        "raster": {
            "crs": "EPSG:3857",
            "tile_size": 256,
            "minzoom": 5,
            "maxzoom": 10,
            "encoding": "RGBA-log-intensity",
            "resampling": "bilinear-display-only",
            "tile_count": len(index),
            "display_semantics": "Relative log-scaled population intensity only; not numerical population counts.",
        },
        "analysis": analysis,
    }
    write_json(stage / "manifest.json", manifest)
    write_json(
        stage / "source.json",
        {
            "download_url": DOWNLOAD_URL,
            "hub_url": SOURCE_URL,
            "doi": "10.5258/SOTON/WP00839",
            "sha256": source_sha,
            "byte_size": len(content),
            "native_path": "data/raw/population/" + SOURCE_FILENAME,
        },
    )
    write_json(stage / "qa.json", analysis | {"tile_count": len(index), "display_only": True})
    (stage / "LICENSE.txt").write_text(
        "Source GeoTIFF tag: CC-BY-4.0\nhttps://creativecommons.org/licenses/by/4.0/\n"
        "WorldPop Hub derived-data licensing note must also be reviewed before redistribution.\n"
    )
    verify_population(stage)
    shutil.copytree(stage, release)
    shutil.copytree(stage, public)
    verify_population(release, public)
    print(f"Published {len(index)} WorldPop display tiles; source population sum {analysis['population_sum']:.3f}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--source", type=Path, required=True)
    args = parser.parse_args()
    build(args.source)
