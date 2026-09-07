"""The JSON schema is authoritative; this module adds spatial/release invariants."""

import gzip
import hashlib
import json
from datetime import datetime
from pathlib import Path

from jsonschema import Draft7Validator, FormatChecker
from shapely.geometry import Point, shape
from shapely.validation import explain_validity

ROOT = Path(__file__).resolve().parents[2]
SCHEMA = json.loads((ROOT / "schemas/dataset.schema.json").read_text())
VALIDATOR = Draft7Validator(SCHEMA, format_checker=FormatChecker())


def timestamp(value):
    return datetime.fromisoformat(value.replace("Z", "+00:00"))


def positions(coordinates):
    if isinstance(coordinates[0], (int, float)):
        yield coordinates
    else:
        for child in coordinates:
            yield from positions(child)


def validate_dataset(metadata, collection):
    # JSON excludes NaN/Infinity even though Python floats and its decoder permit them.
    json.dumps({"metadata": metadata, "collection": collection}, allow_nan=False)
    VALIDATOR.validate({"metadata": metadata, "collection": collection})
    west, south, east, north = metadata["spatial_coverage"]["bbox"]
    if not (-180 <= west < east <= 180 and -90 <= south < north <= 90):
        raise ValueError(
            "Invalid CRS84 coverage bounds; antimeridian releases need a separate contract"
        )
    if timestamp(metadata["processing_date"]) < timestamp(metadata["retrieval_date"]):
        raise ValueError("Processing cannot precede retrieval")
    coverage = metadata["temporal_coverage"]
    if bool(coverage["start"]) != bool(coverage["end"]):
        raise ValueError("Temporal coverage needs both endpoints or two nulls")
    if coverage["start"] and timestamp(coverage["start"]) > timestamp(coverage["end"]):
        raise ValueError("Temporal coverage is reversed")
    resolution = metadata["spatial_resolution"]
    if (resolution["value"] is None) != (resolution["unit"] is None):
        raise ValueError("Resolution value and unit must both be known or null")
    if metadata["update_frequency"] != "static" and metadata["stale_after"] is None:
        raise ValueError("Updating datasets require a stale_after timestamp")
    if metadata["stale_after"] and timestamp(metadata["stale_after"]) < timestamp(
        metadata["retrieval_date"]
    ):
        raise ValueError("Stale deadline precedes retrieval")
    suffix = ".gz" if metadata["artifact"]["format"] == "GeoJSON+gzip" else ""
    expected_path = (
        f"/data/{metadata['dataset_id']}/{metadata['dataset_version']}/features.geojson{suffix}"
    )
    if metadata["artifact"]["path"] != expected_path:
        raise ValueError("Artifact path must match dataset identity and version")
    identifiers = set()
    for feature in collection["features"]:
        if feature["id"] in identifiers:
            raise ValueError("Duplicate feature identifier")
        identifiers.add(feature["id"])
        properties = feature["properties"]
        for key in ("dataset_id", "dataset_version", "is_fixture"):
            if properties[key] != metadata[key]:
                raise ValueError(f"Feature disagrees with manifest: {key}")
        if properties["value"] is not None and properties["unit"] is None:
            raise ValueError("Known measurements require a unit")
        if "admin_level" in properties:
            required = {
                "admin_category",
                "pcode",
                "parent_pcode",
                "parent_name",
                "aliases",
                "label_longitude",
                "label_latitude",
                "valid_from",
                "valid_to",
                "source_version",
            }
            if not required.issubset(properties):
                raise ValueError("Administrative features require complete hierarchy metadata")
            level = properties["admin_level"]
            if level == 0:
                if properties["parent_pcode"] is not None or properties["parent_name"] is not None:
                    raise ValueError("Country feature cannot have a parent")
            elif not properties["parent_pcode"] or not properties["parent_name"]:
                raise ValueError("Administrative child requires a parent")
            category = properties["admin_category"]
            if level < 3 and category != ("country", "province", "district")[level]:
                raise ValueError("Administrative category is inconsistent with its level")
            if level == 3 and category not in {"local_level", "special_area"}:
                raise ValueError("Level 3 category is inconsistent")
            if properties["valid_to"] and timestamp(properties["valid_from"]) > timestamp(
                properties["valid_to"]
            ):
                raise ValueError("Administrative validity interval is reversed")
        geometry = feature["geometry"]
        rings = []
        if geometry["type"] == "Polygon":
            rings = geometry["coordinates"]
        elif geometry["type"] == "MultiPolygon":
            rings = [ring for polygon in geometry["coordinates"] for ring in polygon]
        if any(ring[0] != ring[-1] for ring in rings):
            raise ValueError("Polygon rings must be closed explicitly")
        geom = shape(geometry)
        if geom.is_empty or not geom.is_valid:
            raise ValueError(f"Invalid geometry: {explain_validity(geom)}")
        if "admin_level" in properties:
            label = Point(properties["label_longitude"], properties["label_latitude"])
            if not geom.covers(label):
                raise ValueError("Administrative label is outside its geometry")
        if properties.get("entity_type") == "mountain":
            required = {
                "source_id",
                "search_terms",
                "feature_code",
                "source_modified",
                "elevation_reference",
                "aliases",
            }
            if not required.issubset(properties):
                raise ValueError("Mountain features require complete catalogue metadata")
            if geometry["type"] != "Point":
                raise ValueError("Mountain features must use Point geometry")
            if properties["feature_code"] not in {"PK", "MT"}:
                raise ValueError("Unsupported mountain feature code")
            if properties["name"] not in properties["search_terms"]:
                raise ValueError("Mountain search terms must include the canonical name")
            if properties["value"] is not None:
                if properties["unit"] != "m" or not 0 <= properties["value"] <= 9000:
                    raise ValueError("Mountain elevation is implausible")
        if properties.get("entity_type") == "river":
            required = {
                "source_id",
                "search_terms",
                "river_name",
                "downstream_id",
                "downstream_in_release",
                "main_river_id",
                "flow_order",
                "length_km",
                "distance_downstream_km",
                "distance_upstream_km",
                "catchment_area_km2",
                "upstream_area_km2",
                "average_discharge_m3s",
                "flow_regime",
                "hydrobasin_level12_id",
            }
            if not required.issubset(properties):
                raise ValueError("River features require complete network metadata")
            if geometry["type"] not in {"LineString", "MultiLineString"}:
                raise ValueError("River features require line geometry")
            if properties["downstream_id"] == properties["source_id"]:
                raise ValueError("River reach cannot flow to itself")
            if (
                properties["value"] != properties["average_discharge_m3s"]
                or properties["unit"] != "m3/s"
            ):
                raise ValueError("River measurement must be average discharge")
        if properties.get("entity_type") == "glacier":
            required = {
                "source_id",
                "search_terms",
                "glacier_name",
                "glims_id",
                "outline_date",
                "area_km2",
                "centroid_longitude",
                "centroid_latitude",
                "elevation_min_m",
                "elevation_max_m",
                "elevation_mean_m",
                "dem_source",
                "inventory_region",
                "display_geometry_repaired",
            }
            if not required.issubset(properties):
                raise ValueError("Glacier features require complete inventory metadata")
            if geometry["type"] not in {"Polygon", "MultiPolygon"}:
                raise ValueError("Glacier features require polygon geometry")
            if (
                properties["value"] != properties["area_km2"]
                or properties["unit"] != "km2"
                or properties["area_km2"] <= 0
            ):
                raise ValueError("Glacier measurement must be positive source area")
            if (
                not properties["elevation_min_m"]
                <= properties["elevation_mean_m"]
                <= properties["elevation_max_m"]
            ):
                raise ValueError("Glacier elevation statistics are inconsistent")
        if properties.get("entity_type") == "glacial_lake":
            required = {
                "source_id",
                "search_terms",
                "lake_name",
                "country",
                "basin",
                "connectivity",
                "data_source",
                "inventory_period",
                "area_km2",
                "perimeter_km",
                "centroid_longitude",
                "centroid_latitude",
                "elevation_min_m",
                "elevation_mean_m",
                "expansion_rate_km2_per_year",
                "expansion_uncertainty_km2_per_year",
                "expansion_significant",
            }
            if not required.issubset(properties):
                raise ValueError("Glacial lake features require complete inventory metadata")
            if geometry["type"] != "Point":
                raise ValueError("Glacial lake presentation features require Point geometry")
            if properties["connectivity"] not in {"Glacier-fed", "Non Glacier-fed"}:
                raise ValueError("Unsupported glacial lake connectivity classification")
            if properties["value"] != properties["area_km2"] or properties["unit"] != "km2":
                raise ValueError("Glacial lake measurement must be mapped area")
            if properties["area_km2"] <= 0 or properties["perimeter_km"] <= 0:
                raise ValueError("Glacial lake area/perimeter must be positive")
            if properties["elevation_min_m"] > properties["elevation_mean_m"] + 1:
                raise ValueError("Glacial lake elevation statistics are inconsistent")
            if properties["source_id"] not in properties["search_terms"]:
                raise ValueError("Glacial lake search terms must include GLO ID")
            rate = properties["expansion_rate_km2_per_year"]
            uncertainty = properties["expansion_uncertainty_km2_per_year"]
            if (rate is None) != (uncertainty is None):
                raise ValueError(
                    "Glacial lake expansion rate and uncertainty must be known together"
                )
        if properties.get("entity_type") == "hydrology_station":
            required = {
                "source_id",
                "search_terms",
                "station_name",
                "basin",
                "observation_time",
                "water_level_m",
                "warning_level_m",
                "danger_level_m",
                "threshold_order_valid",
                "station_status",
                "trend",
                "station_series_id",
                "provider",
                "elevation_m",
                "coordinate_order_repaired",
            }
            if not required.issubset(properties):
                raise ValueError("Hydrology stations require complete station metadata")
            if geometry["type"] != "Point":
                raise ValueError("Hydrology stations require Point geometry")
            if properties["value"] != properties["water_level_m"]:
                raise ValueError("Hydrology value must equal water level")
            if properties["water_level_m"] is None:
                if properties["unit"] is not None:
                    raise ValueError("Unknown hydrology measurement cannot carry a unit")
            elif properties["unit"] != "m":
                raise ValueError("Hydrology water level must use metres")
            warning = properties["warning_level_m"]
            danger = properties["danger_level_m"]
            order_valid = not (warning is not None and danger is not None and warning > danger)
            if properties["threshold_order_valid"] != order_valid:
                raise ValueError("Hydrology threshold consistency flag is incorrect")
        if properties.get("entity_type") == "rainfall_station":
            required = {
                "source_id",
                "search_terms",
                "station_name",
                "basin",
                "observation_time",
                "station_status",
                "station_series_id",
                "provider",
                "elevation_m",
                "coordinate_order_repaired",
                "rainfall_1h_mm",
                "rainfall_3h_mm",
                "rainfall_6h_mm",
                "rainfall_12h_mm",
                "rainfall_24h_mm",
                "rainfall_quality_warning",
            }
            if not required.issubset(properties) or geometry["type"] != "Point":
                raise ValueError("Rainfall stations require complete Point metadata")
            if properties["value"] != properties["rainfall_24h_mm"]:
                raise ValueError("Rainfall value must equal source 24-hour accumulation")
            if properties["rainfall_24h_mm"] is None:
                if properties["unit"] is not None:
                    raise ValueError("Unknown rainfall cannot carry a unit")
            elif properties["unit"] != "mm":
                raise ValueError("Rainfall must use millimetres")
            values = [properties[f"rainfall_{hours}h_mm"] for hours in (1, 3, 6, 12, 24)]
            if any(value is not None and value < 0 for value in values):
                raise ValueError("Rainfall cannot be negative")
        if properties.get("entity_type") == "disaster_event":
            required = {
                "source_id",
                "search_terms",
                "hazard_id",
                "hazard_name",
                "hazard_type",
                "event_time",
                "event_year",
                "event_local_date",
                "reported_time",
                "verified",
                "approved",
                "source_label",
                "data_source_name",
                "loss_reference_id",
                "reported_deaths",
                "reported_injured",
                "reported_missing",
                "reported_affected",
                "estimated_loss_npr",
                "street_address",
                "event_description",
            }
            if not required.issubset(properties) or geometry["type"] != "Point":
                raise ValueError("Disaster events require complete Point metadata")
            if properties["value"] is not None or properties["unit"] is not None:
                raise ValueError("Disaster event point is not a measurement")
            if properties["hazard_type"] not in {"natural", "non natural"}:
                raise ValueError("Unsupported disaster hazard type")
        if properties.get("entity_type") == "earthquake":
            required = {
                "source_id",
                "search_terms",
                "magnitude",
                "depth_km",
                "place_name",
                "magnitude_type",
                "network",
                "significance",
                "event_status",
                "epicenter_only",
                "event_time",
            }
            if not required.issubset(properties) or geometry["type"] != "Point":
                raise ValueError("Earthquakes require complete Point metadata")
            if (
                properties["epicenter_only"] is not True
                or properties["value"] is not None
                or properties["unit"] is not None
            ):
                raise ValueError("Earthquake presentation semantics are inconsistent")
        if properties.get("entity_type") == "flood_event":
            required = {
                "source_id",
                "search_terms",
                "hazard_name",
                "event_time",
                "evidence_status",
                "hazard_footprint",
                "flood_class",
            }
            if not required.issubset(properties) or geometry["type"] != "Point":
                raise ValueError("Flood events require complete Point metadata")
            if (
                properties["hazard_name"] != "Flood"
                or properties["evidence_status"] != "reported"
                or properties["hazard_footprint"] is not False
            ):
                raise ValueError("Flood evidence semantics are inconsistent")
            if properties["value"] is not None or properties["unit"] is not None:
                raise ValueError("Reported flood point is not a measurement")
        if properties.get("entity_type") == "landslide_event":
            required = {
                "source_id",
                "search_terms",
                "hazard_name",
                "event_time",
                "evidence_status",
                "hazard_footprint",
                "landslide_category",
                "confidence",
                "confidence_basis",
                "susceptibility_output",
            }
            if not required.issubset(properties) or geometry["type"] != "Point":
                raise ValueError("Landslide events require complete Point metadata")
            if (
                properties["hazard_name"] != "Landslide"
                or properties["evidence_status"] != "reported"
            ):
                raise ValueError("Landslide evidence semantics are inconsistent")
            if (
                properties["hazard_footprint"] is not False
                or properties["susceptibility_output"] is not False
            ):
                raise ValueError(
                    "Reported landslide cannot be a footprint or susceptibility output"
                )
            if properties["value"] is not None or properties["unit"] is not None:
                raise ValueError("Reported landslide point is not a measurement")
        for lon, lat in positions(geometry["coordinates"]):
            if not (west <= lon <= east and south <= lat <= north):
                raise ValueError("Geometry outside declared spatial coverage")
    return {"metadata": metadata, "collection": collection}


def verify_artifact(metadata, content):
    if len(content) != metadata["artifact"]["byte_size"]:
        raise ValueError("Artifact size mismatch")
    if hashlib.sha256(content).hexdigest() != metadata["artifact"]["sha256"]:
        raise ValueError("Artifact checksum mismatch")
    decoded = (
        gzip.decompress(content) if metadata["artifact"]["format"] == "GeoJSON+gzip" else content
    )
    return validate_dataset(metadata, json.loads(decoded))
