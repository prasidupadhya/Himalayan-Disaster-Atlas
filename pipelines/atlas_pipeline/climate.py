"""Build Nepal-wide monthly climate context from NASA POWER MERRA-2 data."""

import hashlib
import json
import shutil
import ssl
from datetime import datetime, timezone
from urllib.request import Request, urlopen
from zipfile import ZipFile

import certifi
from rasterio.warp import transform_geom
from shapely.geometry import box, shape

from .climate_contracts import verify_climate
from .contracts import ROOT

VERSION = "1.0.0"
DATASET_ID = "nepal-power-climate"
BOUNDARY_SHA = "9f6713c41d65396f611ddce5879faecf8e2d494edbd1d6611612445ad46b6707"
BOUNDARY_ARCHIVE = ROOT / f"data/raw/hdx-cod-ab-npl/{BOUNDARY_SHA}.geojson.zip"
POWER_BASE = "https://power.larc.nasa.gov/api/temporal/monthly/regional"
QUERY_SUFFIX = "community=AG&longitude-min=80&latitude-min=26&longitude-max=89&latitude-max=31&start=1991&end=2020&format=JSON&time-standard=UTC"
SOURCES = {
    "T2M": {
        "url": f"{POWER_BASE}?parameters=T2M&{QUERY_SUFFIX}",
        "canonical_sha256": "fc875e866398cf9f365b36194ce43a4670503a6264d29bc94ca1ed1669ff63dd",
        "source_unit": "C",
        "published_unit": "degC",
        "label": "2 m air temperature",
    },
    "PRECTOTCORR": {
        "url": f"{POWER_BASE}?parameters=PRECTOTCORR&{QUERY_SUFFIX}",
        "canonical_sha256": "1bdcf6b464c86189ecba5a709e83fe0d3a2821ad458391a56323064682d84ac3",
        "source_unit": "mm/day",
        "published_unit": "mm/day",
        "label": "corrected precipitation rate",
    },
}
LICENSE_URL = "https://www.earthdata.nasa.gov/engage/open-data-services-software/data-use-policy"
REFERENCE_URL = "https://power.larc.nasa.gov/docs/referencing/"


def now():
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z")


def canonical_payload(payload):
    stable = {key: payload[key] for key in ("type", "header", "parameters", "features")}
    return json.dumps(stable, sort_keys=True, separators=(",", ":"), allow_nan=False).encode()


def fetch_source(parameter):
    source = SOURCES[parameter]
    context = ssl.create_default_context(cafile=certifi.where())
    request = Request(
        source["url"], headers={"User-Agent": "Himalayan-Disaster-Atlas/1.0 climate-preprocessor"}
    )
    with urlopen(request, timeout=120, context=context) as response:
        payload = json.load(response)
    digest = hashlib.sha256(canonical_payload(payload)).hexdigest()
    if digest != source["canonical_sha256"]:
        raise ValueError(f"Pinned NASA POWER {parameter} payload changed")
    header = payload["header"]
    parameter_meta = payload["parameters"][parameter]
    if (
        header["api"]["version"] != "v2.9.8"
        or header["sources"] != ["MERRA2"]
        or header["time_standard"] != "UTC"
    ):
        raise ValueError("Unexpected NASA POWER product metadata")
    if (
        header["start"] != "19910101"
        or header["end"] != "20201231"
        or header["fill_value"] != -999.0
    ):
        raise ValueError("Unexpected NASA POWER temporal metadata")
    if parameter_meta["units"] != source["source_unit"] or len(payload["features"]) != 165:
        raise ValueError("Unexpected NASA POWER variable metadata")
    return payload


def load_boundary():
    if not BOUNDARY_ARCHIVE.exists():
        raise FileNotFoundError(f"Missing pinned COD-AB archive: {BOUNDARY_ARCHIVE}")
    if hashlib.sha256(BOUNDARY_ARCHIVE.read_bytes()).hexdigest() != BOUNDARY_SHA:
        raise ValueError("COD-AB boundary archive checksum mismatch")
    with ZipFile(BOUNDARY_ARCHIVE) as archive:
        collection = json.loads(archive.read("npl_admin0.geojson"))
    if (
        len(collection["features"]) != 1
        or collection["features"][0]["properties"]["adm0_pcode"] != "NP"
    ):
        raise ValueError("Unexpected COD-AB admin0 source")
    return shape(collection["features"][0]["geometry"])


def grid_values(payload, parameter):
    result = {}
    for feature in payload["features"]:
        lon, lat = feature["geometry"]["coordinates"][:2]
        values = feature["properties"]["parameter"][parameter]
        result[(float(lon), float(lat))] = {
            key: value for key, value in values.items() if len(key) == 6 and key[-2:] != "13"
        }
    return result


def cell_weights(boundary, coordinates):
    boundary_area = shape(transform_geom("EPSG:4326", "EPSG:6933", boundary.__geo_interface__)).area
    weights = {}
    for lon, lat in coordinates:
        intersection = boundary.intersection(
            box(lon - 0.3125, lat - 0.25, lon + 0.3125, lat + 0.25)
        )
        if intersection.is_empty:
            continue
        area = shape(transform_geom("EPSG:4326", "EPSG:6933", intersection.__geo_interface__)).area
        if area > 0:
            weights[(lon, lat)] = area
    covered = sum(weights.values())
    if abs(covered - boundary_area) / boundary_area > 1e-6:
        raise ValueError("NASA POWER grid does not fully cover Nepal boundary")
    return weights, boundary_area


def aggregate(values, weights, periods, fill=-999.0):
    output = {}
    coverage = {}
    total_area = sum(weights.values())
    for period in periods:
        weighted = 0.0
        valid_area = 0.0
        for coordinate, area in weights.items():
            value = values[coordinate].get(period, fill)
            if value == fill:
                continue
            weighted += value * area
            valid_area += area
        if valid_area == 0:
            output[period] = None
            coverage[period] = 0.0
        else:
            output[period] = weighted / valid_area
            coverage[period] = valid_area / total_area * 100
    return output, coverage


def write_json(path, value):
    path.write_text(
        json.dumps(value, sort_keys=True, separators=(",", ":"), allow_nan=False) + "\n"
    )


def build(root=ROOT):
    release = root / f"data/releases/{DATASET_ID}/{VERSION}"
    public = root / f"apps/web/public/data/{DATASET_ID}/{VERSION}"
    if release.exists():
        verify_climate(release, public)
        print("Existing immutable climate release verified")
        return

    stage = root / "data/processed/climate/release"
    if stage.exists():
        shutil.rmtree(stage)
    stage.mkdir(parents=True)

    boundary = load_boundary()
    t2m_payload = fetch_source("T2M")
    precip_payload = fetch_source("PRECTOTCORR")
    t2m = grid_values(t2m_payload, "T2M")
    precip = grid_values(precip_payload, "PRECTOTCORR")
    if t2m.keys() != precip.keys():
        raise ValueError("NASA POWER variable grids differ")
    weights, boundary_area = cell_weights(boundary, t2m.keys())
    periods = [f"{year}{month:02d}" for year in range(1991, 2021) for month in range(1, 13)]
    temperature, temperature_coverage = aggregate(t2m, weights, periods)
    precipitation, precipitation_coverage = aggregate(precip, weights, periods)

    series = []
    for period in periods:
        year, month = int(period[:4]), int(period[4:])
        if temperature[period] is None or precipitation[period] is None:
            raise ValueError(f"Missing Nepal climate value for {period}")
        coverage = min(temperature_coverage[period], precipitation_coverage[period])
        series.append(
            {
                "period": f"{year}-{month:02d}",
                "year": year,
                "month": month,
                "temperature_c": round(temperature[period], 3),
                "precipitation_mm_day": round(precipitation[period], 3),
                "coverage_percent": round(coverage, 6),
            }
        )

    normals = []
    for month in range(1, 13):
        records = [item for item in series if item["month"] == month]
        temperatures = [item["temperature_c"] for item in records]
        precipitations = [item["precipitation_mm_day"] for item in records]
        normals.append(
            {
                "month": month,
                "temperature_c": round(sum(temperatures) / len(temperatures), 3),
                "precipitation_mm_day": round(sum(precipitations) / len(precipitations), 3),
                "temperature_min_c": min(temperatures),
                "temperature_max_c": max(temperatures),
                "precipitation_min_mm_day": min(precipitations),
                "precipitation_max_mm_day": max(precipitations),
                "years": 30,
            }
        )

    variables = [
        {
            "id": parameter,
            "label": SOURCES[parameter]["label"],
            "source_unit": SOURCES[parameter]["source_unit"],
            "published_unit": SOURCES[parameter]["published_unit"],
        }
        for parameter in ("T2M", "PRECTOTCORR")
    ]
    product = {
        "provider": "NASA POWER",
        "product_type": "reanalysis-derived",
        "source_model": "MERRA-2",
        "api_version": "v2.9.8",
        "time_standard": "UTC",
        "baseline": "1991-2020",
        "native_grid": {"latitude_degrees": 0.5, "longitude_degrees": 0.625},
        "source_grid_points": 165,
        "contributing_grid_cells": len(weights),
        "boundary_source": "Nepal COD-AB v02 unsimplified admin0",
        "boundary_sha256": BOUNDARY_SHA,
        "variables": variables,
    }
    series_payload = {"product": product, "series": series, "normals": normals}
    series_bytes = (
        json.dumps(series_payload, sort_keys=True, separators=(",", ":"), allow_nan=False) + "\n"
    ).encode()
    (stage / "series.json").write_bytes(series_bytes)

    retrieval = now()
    bounds = boundary.bounds
    metadata = {
        "schema_version": "4.0.0",
        "dataset_id": DATASET_ID,
        "dataset_name": "Nepal NASA POWER monthly climate context, 1991-2020",
        "dataset_version": VERSION,
        "source": "NASA POWER Monthly and Annual API — MERRA-2 meteorology",
        "source_url": POWER_BASE,
        "license": "NASA Earth Science data use policy — open NASA-led data, generally CC0 unless otherwise marked",
        "license_url": LICENSE_URL,
        "attribution": "NASA POWER Project, NASA Langley Research Center; MERRA-2 meteorology. POWER API v2.9.8 accessed for this release.",
        "observation_date": None,
        "publication_date": None,
        "retrieval_date": retrieval,
        "processing_date": retrieval,
        "processing_version": "climate-pipeline-1.0.0; shapely-2.1.2; rasterio-1.4.4",
        "method": "NASA POWER monthly T2M and PRECTOTCORR MERRA-2-derived grid-box values for 1991-2020 were acquired at native 0.5 degree latitude by 0.625 degree longitude spacing. Each grid box was intersected with the pinned unsimplified Nepal COD-AB v02 boundary and transformed to EPSG:6933 for area weighting. Monthly national means were calculated only from valid grid-box values; the 12 climatological normals are arithmetic means of the 30 area-weighted monthly values for each calendar month. Annual fields (month 13) from POWER are excluded.",
        "spatial_resolution": {"value": 0.5, "unit": "degree"},
        "temporal_resolution": "monthly",
        "spatial_coverage": {
            "description": "Nepal national area weighted from intersecting NASA POWER MERRA-2 grid boxes using the unsimplified COD-AB v02 boundary",
            "bbox": list(bounds),
        },
        "temporal_coverage": {"start": "1991-01-01T00:00:00Z", "end": "2020-12-31T23:59:59Z"},
        "crs": "OGC:CRS84",
        "status": "ATLAS_DERIVED",
        "evidence_type": "derived",
        "is_fixture": False,
        "limitations": [
            "This is a national area-weighted summary of a coarse reanalysis-derived grid, not a station-observation series.",
            "The native grid is 0.5 degree latitude by 0.625 degree longitude and cannot resolve individual valleys, settlements or mountain slopes.",
            "PRECTOTCORR is retained as POWER's monthly mean daily precipitation rate in mm/day; it is not relabelled as a monthly accumulation.",
            "The 1991-2020 normal describes the published baseline period only and is not a forecast or a statement about current conditions.",
            "MERRA-2 assimilation, model physics, topographic representation and POWER processing limitations propagate into these values.",
        ],
        "uncertainty": "No Atlas uncertainty interval is invented. The normal chart exposes the minimum and maximum of the 30 annual area-weighted monthly values as historical reanalysis variability, not measurement uncertainty.",
        "update_frequency": "static",
        "stale_after": None,
        "artifact": {
            "path": f"/data/{DATASET_ID}/{VERSION}/series.json",
            "format": "ClimateSeries",
            "sha256": hashlib.sha256(series_bytes).hexdigest(),
            "byte_size": len(series_bytes),
        },
    }
    manifest = {"metadata": metadata, **series_payload}
    write_json(stage / "manifest.json", manifest)
    write_json(
        stage / "source.json",
        {
            "power_api": {
                "version": "v2.9.8",
                "documentation": "https://power.larc.nasa.gov/docs/services/api/temporal/monthly/",
                "referencing": REFERENCE_URL,
            },
            "queries": [
                {
                    "parameter": parameter,
                    "url": SOURCES[parameter]["url"],
                    "canonical_sha256": SOURCES[parameter]["canonical_sha256"],
                }
                for parameter in ("T2M", "PRECTOTCORR")
            ],
            "canonicalization": "SHA-256 of sorted compact JSON containing only type, header, parameters and features; volatile response timing/messages are excluded",
            "boundary_archive_sha256": BOUNDARY_SHA,
            "boundary_member": "npl_admin0.geojson",
        },
    )
    write_json(
        stage / "qa.json",
        {
            "source_grid_points": 165,
            "contributing_grid_cells": len(weights),
            "nepal_equal_area_km2": round(boundary_area / 1_000_000, 3),
            "monthly_records": len(series),
            "normal_months": len(normals),
            "minimum_coverage_percent": min(item["coverage_percent"] for item in series),
            "missing_months": 0,
            "annual_keys_excluded_per_grid_variable": 30,
        },
    )
    (stage / "LICENSE.txt").write_text(
        f"NASA Earth Science data use guidance: {LICENSE_URL}\nNASA POWER referencing guidance: {REFERENCE_URL}\n"
    )
    verify_climate(stage)
    shutil.copytree(stage, release)
    shutil.copytree(stage, public)
    verify_climate(release, public)
    print(
        f"Published {len(series)} monthly climate records from {len(weights)} Nepal-intersecting grid cells"
    )


if __name__ == "__main__":
    build()
