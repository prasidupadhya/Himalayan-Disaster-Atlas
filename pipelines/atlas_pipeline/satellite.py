"""Build three immutable Sentinel-2 L2A true-colour observation previews."""

import hashlib
import json
import shutil
import ssl
from datetime import datetime, timezone
from urllib.request import Request, urlopen

import certifi
import numpy as np
import rasterio
from PIL import Image
from rasterio.enums import Resampling
from rasterio.warp import transform

from .contracts import ROOT
from .satellite_contracts import verify_satellite

VERSION = "1.0.0"
DATASET_ID = "nepal-sentinel-observations"
STAC = "https://earth-search.aws.element84.com/v1/collections/sentinel-2-c1-l2a"
LEGAL = "https://cds.climate.copernicus.eu/licences/ec-sentinel"
DOI = "10.5270/S2_-znk9xsj"
SCENES = [
    {
        "id": "west",
        "label": "Western observation window",
        "scene_id": "S2B_T44RNT_20260422T051345_L2A",
        "grid_code": "MGRS-44RNT",
        "acquired_at": "2026-04-22T05:20:39.575000Z",
        "cloud": 0.0,
        "nodata": 0.0,
        "epsg": 32644,
        "etag": '"446987f30395005f72c793858a0bcaa4-41"',
        "bytes": 341427415,
        "scl_etag": '"7ff4e28abee5c568f4dd3228757145fd"',
        "scl_bytes": 3342978,
        "base": "https://e84-earth-search-sentinel-data.s3.us-west-2.amazonaws.com/sentinel-2-c1-l2a/44/R/NT/2026/4/S2B_T44RNT_20260422T051345_L2A",
    },
    {
        "id": "central",
        "label": "Central observation window",
        "scene_id": "S2A_T45RTL_20260406T050654_L2A",
        "grid_code": "MGRS-45RTL",
        "acquired_at": "2026-04-06T05:11:27.554000Z",
        "cloud": 3.128533,
        "nodata": 0.0,
        "epsg": 32645,
        "etag": '"6e881fb14476436cbaf41e8000696300-42"',
        "bytes": 348995586,
        "scl_etag": '"40fc104881b3ace17c83d4d26bcd90da"',
        "scl_bytes": 3315047,
        "base": "https://e84-earth-search-sentinel-data.s3.us-west-2.amazonaws.com/sentinel-2-c1-l2a/45/R/TL/2026/4/S2A_T45RTL_20260406T050654_L2A",
    },
    {
        "id": "east",
        "label": "Eastern observation window",
        "scene_id": "S2C_T45RVM_20260411T045901_L2A",
        "grid_code": "MGRS-45RVM",
        "acquired_at": "2026-04-11T05:00:47.774000Z",
        "cloud": 0.148583,
        "nodata": 0.0,
        "epsg": 32645,
        "etag": '"550e5e46edca8ae34abf59ccf59fea89-28"',
        "bytes": 231343822,
        "scl_etag": '"44884103556726c42b7b8f405819dc90"',
        "scl_bytes": 850357,
        "base": "https://e84-earth-search-sentinel-data.s3.us-west-2.amazonaws.com/sentinel-2-c1-l2a/45/R/VM/2026/4/S2C_T45RVM_20260411T045901_L2A",
    },
]


def now():
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z")


def digest(content):
    return hashlib.sha256(content).hexdigest()


def write_json(path, value):
    path.write_text(
        json.dumps(value, sort_keys=True, separators=(",", ":"), allow_nan=False) + "\n"
    )


def verify_remote(url, etag, byte_size):
    context = ssl.create_default_context(cafile=certifi.where())
    with urlopen(Request(url, method="HEAD"), timeout=60, context=context) as response:
        actual_etag = response.headers.get("ETag")
        actual_size = int(response.headers.get("Content-Length", "0"))
    if actual_etag != etag or actual_size != byte_size:
        raise ValueError(f"Pinned Sentinel object changed: {url}")


def build(root=ROOT):
    release = root / f"data/releases/{DATASET_ID}/{VERSION}"
    public = root / f"apps/web/public/data/{DATASET_ID}/{VERSION}"
    if release.exists():
        verify_satellite(release, public)
        print("Existing immutable satellite release verified")
        return
    stage = root / "data/processed/satellite/release"
    if stage.exists():
        shutil.rmtree(stage)
    stage.mkdir(parents=True)
    observations, sources, qa = [], [], []
    for scene in SCENES:
        visual = scene["base"] + "/TCI.tif"
        scl_url = scene["base"] + "/SCL.tif"
        verify_remote(visual, scene["etag"], scene["bytes"])
        verify_remote(scl_url, scene["scl_etag"], scene["scl_bytes"])
        with rasterio.open(visual) as src:
            if (
                src.crs.to_epsg() != scene["epsg"]
                or src.shape != (10980, 10980)
                or src.count != 3
                or src.res != (10.0, 10.0)
                or src.nodata != 0
            ):
                raise ValueError(f"Unexpected Sentinel TCI grid: {scene['scene_id']}")
            rgb = src.read(out_shape=(3, 768, 768), resampling=Resampling.bilinear)
            xs = [src.bounds.left, src.bounds.right, src.bounds.right, src.bounds.left]
            ys = [src.bounds.top, src.bounds.top, src.bounds.bottom, src.bounds.bottom]
            lon, lat = transform(src.crs, "EPSG:4326", xs, ys)
        with rasterio.open(scl_url) as scl:
            classes = scl.read(1)
            if scl.crs.to_epsg() != scene["epsg"] or scl.res != (20.0, 20.0):
                raise ValueError("Unexpected Sentinel SCL grid")
            total = classes.size
            cloud = sum(int(np.sum(classes == value)) for value in (8, 9, 10)) / total * 100
            nodata = int(np.sum(classes == 0)) / total * 100
            snow = int(np.sum(classes == 11)) / total * 100
            if abs(cloud - scene["cloud"]) > 0.001 or abs(nodata - scene["nodata"]) > 0.001:
                raise ValueError(f"Sentinel SCL QA changed: {scene['scene_id']}")
        image_path = stage / f"{scene['id']}.png"
        Image.fromarray(np.moveaxis(rgb, 0, -1), mode="RGB").save(image_path, optimize=True)
        image = image_path.read_bytes()
        item = {
            "id": scene["id"],
            "label": scene["label"],
            "scene_id": scene["scene_id"],
            "acquired_at": scene["acquired_at"],
            "cloud_percent": round(cloud, 6),
            "nodata_percent": round(nodata, 6),
            "snow_ice_percent": round(snow, 6),
            "source_crs": f"EPSG:{scene['epsg']}",
            "source_resolution_m": 10,
            "source_asset": visual,
            "source_scl": scl_url,
            "source_etag": scene["etag"],
            "source_byte_size": scene["bytes"],
            "image": {
                "path": f"/data/{DATASET_ID}/{VERSION}/{scene['id']}.png",
                "sha256": digest(image),
                "byte_size": len(image),
                "width": 768,
                "height": 768,
            },
            "coordinates": [[lon[i], lat[i]] for i in range(4)],
        }
        observations.append(item)
        sources.append(
            {
                **{
                    key: item[key]
                    for key in (
                        "scene_id",
                        "acquired_at",
                        "source_asset",
                        "source_scl",
                        "source_etag",
                        "source_byte_size",
                        "source_crs",
                    )
                },
                "source_scl_etag": scene["scl_etag"],
                "source_scl_byte_size": scene["scl_bytes"],
                "grid_code": scene["grid_code"],
                "collection": "sentinel-2-c1-l2a",
                "product_doi": DOI,
            }
        )
        qa.append(
            {
                "scene_id": scene["scene_id"],
                "scl_cloud_percent": item["cloud_percent"],
                "scl_nodata_percent": item["nodata_percent"],
                "scl_snow_ice_percent": item["snow_ice_percent"],
            }
        )
    index_bytes = (json.dumps(observations, sort_keys=True, separators=(",", ":")) + "\n").encode()
    (stage / "observations.json").write_bytes(index_bytes)
    retrieval = now()
    acquired = sorted(item["acquired_at"] for item in observations)
    all_lon = [p[0] for item in observations for p in item["coordinates"]]
    all_lat = [p[1] for item in observations for p in item["coordinates"]]
    metadata = {
        "schema_version": "4.0.0",
        "dataset_id": DATASET_ID,
        "dataset_name": "Nepal Sentinel-2 spring 2026 observation windows",
        "dataset_version": VERSION,
        "source": "Copernicus Sentinel-2 Collection-1 L2A via Element 84 Earth Search public COGs",
        "source_url": STAC,
        "license": "Copernicus Sentinel Data Legal Notice — free, full and open use; modified-data attribution required",
        "license_url": LEGAL,
        "attribution": "Contains modified Copernicus Sentinel data 2026; public COG distribution by Element 84/AWS",
        "observation_date": None,
        "publication_date": None,
        "retrieval_date": retrieval,
        "processing_date": retrieval,
        "processing_version": "satellite-pipeline-1.0.0; rasterio-1.4.4",
        "method": "Three fixed Sentinel-2 Collection-1 Level-2A scenes were selected from 2026-04-01 through 2026-06-15 with source-reported cloud cover <=5% and zero SCL NoData. Full 10 m true-colour COGs are downsampled with bilinear resampling to 768 px RGB previews. The 20 m Scene Classification Layer is independently counted to verify cloud and NoData percentages. No cloud, snow, water or land classification is inferred by the Atlas.",
        "spatial_resolution": {"value": 10, "unit": "m"},
        "temporal_resolution": "individual Sentinel-2 acquisitions",
        "spatial_coverage": {
            "description": "Three separate Sentinel-2 observation windows spanning western, central and eastern Nepal context; not continuous national coverage",
            "bbox": [min(all_lon), min(all_lat), max(all_lon), max(all_lat)],
        },
        "temporal_coverage": {"start": acquired[0], "end": acquired[-1]},
        "crs": "OGC:CRS84",
        "status": "SATELLITE_DERIVED",
        "evidence_type": "derived",
        "is_fixture": False,
        "limitations": [
            "The three previews are separate observation windows and must not be interpreted as seamless Nepal-wide imagery.",
            "Scene-level and SCL cloud percentages do not guarantee every visible pixel is cloud-free; clouds and shadows remain visible.",
            "Snow/ice is not water or land change. No change detection is performed.",
            "The 768 px web previews are visualization derivatives and do not retain 10 m analytical resolution.",
            "Acquisition dates differ between windows, so cross-window visual differences are not temporal change evidence.",
        ],
        "uncertainty": "Atmospheric correction, scene classification and visual interpretation inherit Sentinel-2 L2A processing limitations. No Atlas uncertainty model is added.",
        "update_frequency": "static",
        "stale_after": None,
        "artifact": {
            "path": f"/data/{DATASET_ID}/{VERSION}/observations.json",
            "format": "SatelliteObservation-index",
            "sha256": digest(index_bytes),
            "byte_size": len(index_bytes),
        },
    }
    write_json(stage / "manifest.json", {"metadata": metadata, "observations": observations})
    write_json(stage / "sources.json", sources)
    write_json(
        stage / "qa.json",
        {
            "selection": {
                "date_window": ["2026-04-01", "2026-06-15"],
                "max_cloud_percent": 5,
                "required_nodata_percent": 0,
                "product": "Sentinel-2 Collection-1 L2A TCI",
                "scl_cloud_classes": [8, 9, 10],
            },
            "observations": qa,
        },
    )
    (stage / "LICENSE.txt").write_text(
        "Contains modified Copernicus Sentinel data 2026\n" + LEGAL + "\n"
    )
    verify_satellite(stage)
    shutil.copytree(stage, release)
    shutil.copytree(stage, public)
    verify_satellite(release, public)
    print("Published 3 Sentinel-2 observation previews")


if __name__ == "__main__":
    build()
