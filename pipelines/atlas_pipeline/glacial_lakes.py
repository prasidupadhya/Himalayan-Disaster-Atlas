"""Acquire and publish Glacial Lake Observatory records for Nepal/transboundary catchments."""

import argparse
import hashlib
import json
import sqlite3
import urllib.request
from pathlib import Path

from .contracts import ROOT
from .vector_release import publish_vector, write_immutable

SOURCE_PAGE = "https://doi.org/10.5281/zenodo.19370146"
VERSION = "1.0.0"
SOURCE_VERSION = "GLO v1.02"
RETRIEVAL_DATE = "2026-09-07T00:00:00Z"
PROCESSING_DATE = "2026-09-07T00:00:00Z"
PUBLICATION_DATE = "2026-04-01T00:00:00Z"
OBSERVATION_START = "2017-01-01T00:00:00Z"
OBSERVATION_END = "2024-12-31T23:59:59Z"
DATASET_ID = "nepal-transboundary-glacial-lakes"
CENTROID_TABLE = "s2_20172024_ntb_gloid_uniquelakes_centroid_v1.02"
UNIQUE_TABLE = "s2_20172024_ntb_gloid_uniquelakes_v1.02"
SOURCES = {
    "centroids": {
        "url": "https://zenodo.org/api/records/19370146/files/S2_20172024_NTB_GLOID_UniqueLakes_centroid_v1.02.gpkg/content",
        "sha256": "e8a5116224d86358234c55ffc0319b7ba14d139c0b2f20f2763acf2b63621b6e",
        "max_bytes": 2_000_000,
    },
    "unique": {
        "url": "https://zenodo.org/api/records/19370146/files/S2_20172024_NTB_GLOID_UniqueLakes_v1.02.gpkg/content",
        "sha256": "e5f30a066a5b465525bade9ade002c6202a67a82517088a62fc9929e034a12e8",
        "max_bytes": 10_000_000,
    },
}


def sha256(content):
    return hashlib.sha256(content).hexdigest()


def acquire(root, kind, source=None):
    config = SOURCES[kind]
    raw = root / f"data/raw/glacial-lake-observatory/{config['sha256']}-{kind}.gpkg"
    if source:
        content = Path(source).read_bytes()
    elif raw.exists():
        content = raw.read_bytes()
    else:
        request = urllib.request.Request(config["url"], headers={"User-Agent": "Himalayan-Disaster-Atlas/0.1"})
        with urllib.request.urlopen(request, timeout=90) as response:
            content = response.read(config["max_bytes"] + 1)
    if len(content) > config["max_bytes"]:
        raise ValueError(f"GLO {kind} source exceeds acquisition budget")
    if sha256(content) != config["sha256"]:
        raise ValueError(f"GLO {kind} source checksum mismatch")
    raw.parent.mkdir(parents=True, exist_ok=True)
    if not raw.exists():
        raw.write_bytes(content)
    return raw


def rows(path, table, columns):
    connection = sqlite3.connect(path)
    try:
        info = connection.execute("SELECT data_type, srs_id FROM gpkg_contents WHERE table_name = ?", (table,)).fetchone()
        if not info or info[0] != "features":
            raise ValueError(f"GLO table {table} is missing or not a feature layer")
        query = f'SELECT {", ".join(columns)} FROM "{table}"'
        return list(connection.execute(query))
    finally:
        connection.close()


def normalize(centroid_path, unique_path):
    centroid_columns = [
        "GLO_ID", "CENTROID_LON", "CENTROID_LAT", "COUNTRY", "BASIN", "CONNECTIVITY",
        "ELEVATION_MEAN", "ELEVATION_MIN", "DATA_SOURCE", "GTNG_REGION_O2",
        "EXPANSION_RATE", "EXPANSION_UNCERTAINTY", "EXPANSION_RATE_SIG",
    ]
    unique_columns = ["GLO_ID", "AREA_DISSOLVED", "PERIMETER_DISSOLVED"]
    centroids = {row[0]: row[1:] for row in rows(centroid_path, CENTROID_TABLE, centroid_columns)}
    unique = {row[0]: row[1:] for row in rows(unique_path, UNIQUE_TABLE, unique_columns)}
    if len(centroids) != 4150 or len(unique) != 4150 or centroids.keys() != unique.keys():
        raise ValueError("Unexpected GLO unique-lake record set")

    features = []
    for source_id in sorted(centroids):
        (
            longitude, latitude, country, basin, connectivity, elevation_mean, elevation_min,
            data_source, gtng_region, expansion_rate, expansion_uncertainty, expansion_significant,
        ) = centroids[source_id]
        area, perimeter = unique[source_id]
        if connectivity not in {"Glacier-fed", "Non Glacier-fed"}:
            raise ValueError(f"Unexpected GLO connectivity value: {connectivity}")
        if not (80 <= longitude <= 89 and 27 <= latitude <= 31):
            raise ValueError(f"Implausible GLO centroid: {source_id}")
        # A handful of source rows differ by sub-metre Float32 rounding between
        # ELEVATION_MIN and ELEVATION_MEAN (for example 3759 vs 3758.9998 m).
        if area <= 0 or perimeter <= 0 or elevation_min > elevation_mean + 1:
            raise ValueError(f"Implausible GLO attributes: {source_id}")
        if (expansion_rate is None) != (expansion_uncertainty is None):
            raise ValueError(f"Incomplete GLO expansion measurement: {source_id}")
        significant = None if expansion_significant in (None, "") else expansion_significant == "TRUE"
        search_terms = [source_id, country, basin, connectivity]
        feature_id = source_id.lower().replace("_", "-").replace(".", "-")
        features.append(
            {
                "type": "Feature",
                "id": feature_id,
                "properties": {
                    "dataset_id": DATASET_ID,
                    "dataset_version": VERSION,
                    "name": source_id,
                    "is_fixture": False,
                    "value": float(area),
                    "unit": "km2",
                    "entity_type": "glacial_lake",
                    "source_id": source_id,
                    "search_terms": search_terms,
                    "lake_name": None,
                    "country": country,
                    "basin": basin,
                    "connectivity": connectivity,
                    "data_source": data_source,
                    "inventory_period": "2017–2024",
                    "area_km2": float(area),
                    "perimeter_km": float(perimeter),
                    "centroid_longitude": float(longitude),
                    "centroid_latitude": float(latitude),
                    "elevation_min_m": float(elevation_min),
                    "elevation_mean_m": float(elevation_mean),
                    "expansion_rate_km2_per_year": None if expansion_rate is None else float(expansion_rate),
                    "expansion_uncertainty_km2_per_year": None if expansion_uncertainty is None else float(expansion_uncertainty),
                    "expansion_significant": significant,
                    "inventory_region": gtng_region,
                },
                "geometry": {"type": "Point", "coordinates": [float(longitude), float(latitude)]},
            }
        )
    return features


def bounds(features):
    longitudes = [feature["properties"]["centroid_longitude"] for feature in features]
    latitudes = [feature["properties"]["centroid_latitude"] for feature in features]
    return [min(longitudes), min(latitudes), max(longitudes), max(latitudes)]


def run(root=ROOT, centroids=None, unique=None):
    centroid_path = acquire(root, "centroids", centroids)
    unique_path = acquire(root, "unique", unique)
    features = normalize(centroid_path, unique_path)
    metadata = {
        "schema_version": "1.0.0",
        "dataset_id": DATASET_ID,
        "dataset_name": "Glacial Lake Observatory — Nepal and transboundary catchments (2017–2024)",
        "dataset_version": VERSION,
        "source": "Glacial Lake Observatory (GLO) Sentinel-2 unique lakes v1.02",
        "source_url": SOURCE_PAGE,
        "license": "Creative Commons Attribution 4.0 International (CC BY 4.0)",
        "license_url": "https://creativecommons.org/licenses/by/4.0/",
        "attribution": "Rawlins, Watson, Bhambri, Khadka & Chand; Glacial Lake Observatory / GLO-FHICC",
        "observation_date": None,
        "publication_date": PUBLICATION_DATE,
        "retrieval_date": RETRIEVAL_DATE,
        "processing_date": PROCESSING_DATE,
        "processing_version": "glacial-lakes-pipeline-1.0.0",
        "method": (
            "Pinned the GLO v1.02 Sentinel-2 unique-lake centroid and polygon-attribute GeoPackages by SHA-256. "
            "Joined the two published layers by stable GLO_ID, retained EPSG:4326 centroid coordinates for browser rendering, and retained source maximum/dissolved mapped area, perimeter, basin, country, glacier-connectivity class, elevation and 2017–2024 expansion statistics. "
            "The equal-area polygon geometry is not reprojected or republished by this feature; no glacier ID, river ID or hazard class is inferred."
        ),
        "spatial_resolution": {"value": 10, "unit": "m"},
        "temporal_resolution": "annual observations summarized across 2017–2024",
        "spatial_coverage": {"description": "Nepal and transboundary glacial-lake catchments in GLO v1.02", "bbox": bounds(features)},
        "temporal_coverage": {"start": OBSERVATION_START, "end": OBSERVATION_END},
        "crs": "OGC:CRS84",
        "status": "SATELLITE_DERIVED",
        "evidence_type": "derived",
        "is_fixture": False,
        "limitations": [
            "The browser layer uses published EPSG:4326 unique-lake centroids, not the equal-area lake polygons. The polygon dataset is used only for its source area/perimeter attributes in this release.",
            "AREA_DISSOLVED is the dissolved maximum mapped extent across the 2017–2024 unique-lake record and must not be interpreted as a lake area measured on 2026-09-07.",
            "Snow, icebergs, seasonal freezing, observation timing, water-level variability and mosaicking can affect classification and mapped area.",
            "Connectivity is the source GLO glacier-fed/non-glacier-fed classification. It does not identify a specific RGI glacier and must not be converted into glacier-lake causality.",
            "No GLO record is labelled dangerous or safe by this atlas. Expansion statistics describe mapped change and are not a GLOF hazard assessment or forecast.",
            "The source does not publish lake names in this layer; names remain UNKNOWN rather than being inferred from nearby features.",
        ],
        "uncertainty": "GLO reports Sentinel-2 classification F1 of 0.92 for 2020 and approximately 0.91 for 2017/2024 in its validation summary. Per-lake expansion uncertainty is retained when the source provides it; positional and area uncertainty remain tied to 10 m Sentinel-2 classification and the source workflow.",
        "update_frequency": "periodic",
        "stale_after": "2027-09-07T00:00:00Z",
    }
    output = publish_vector(root, metadata, {"type": "FeatureCollection", "features": features})
    report = {
        "source_version": SOURCE_VERSION,
        "source_sha256": {key: value["sha256"] for key, value in SOURCES.items()},
        "features": len(features),
        "countries": {country: sum(feature["properties"]["country"] == country for feature in features) for country in sorted({feature["properties"]["country"] for feature in features})},
        "glacier_fed": sum(feature["properties"]["connectivity"] == "Glacier-fed" for feature in features),
        "non_glacier_fed": sum(feature["properties"]["connectivity"] == "Non Glacier-fed" for feature in features),
        "expansion_rate_available": sum(feature["properties"]["expansion_rate_km2_per_year"] is not None for feature in features),
        "expansion_significant_true": sum(feature["properties"]["expansion_significant"] is True for feature in features),
        "area_min_km2": min(feature["properties"]["area_km2"] for feature in features),
        "area_max_km2": max(feature["properties"]["area_km2"] for feature in features),
    }
    write_immutable(root / f"data/releases/glacial-lake-observatory/{VERSION}/qa.json", (json.dumps(report, indent=2) + "\n").encode())
    print(f"Validated and published {len(features)} GLO unique glacial-lake records")
    return output, report


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--centroids", type=Path)
    parser.add_argument("--unique", type=Path)
    args = parser.parse_args()
    run(centroids=args.centroids, unique=args.unique)
