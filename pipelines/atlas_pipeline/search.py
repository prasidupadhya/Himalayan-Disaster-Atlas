"""Build a compact, immutable global search index from validated atlas releases."""

import gzip
import hashlib
import json
import re
import shutil
import unicodedata
from pathlib import Path

from jsonschema import Draft7Validator

from .contracts import ROOT

BASE = "/data/atlas-search-index/1.0.0/"
CORE = [
    "nepal-admin-country",
    "nepal-admin-provinces",
    "nepal-admin-districts",
    "nepal-admin-local-levels",
    "nepal-mountains",
    "nepal-rivers-primary",
    "nepal-rivers-headwaters",
    "nepal-glaciers-west",
    "nepal-glaciers-central",
    "nepal-glaciers-east",
    "nepal-transboundary-glacial-lakes",
    "nepal-osm-hydropower",
]
INFRASTRUCTURE = [
    "nepal-osm-major-roads-west",
    "nepal-osm-major-roads-central",
    "nepal-osm-major-roads-east",
    "nepal-osm-major-bridges",
    "nepal-osm-schools-west",
    "nepal-osm-schools-central-west",
    "nepal-osm-schools-central-east",
    "nepal-osm-schools-east",
    "nepal-osm-health-facilities",
    "nepal-osm-emergency-facilities",
    "nepal-osm-settlements",
]
EVENTS = [
    "nepal-disaster-events-2015-2016",
    "nepal-disaster-events-2017-2018",
    "nepal-disaster-events-2019-2020",
    "nepal-disaster-events-2021-2022",
    "nepal-disaster-events-2023",
    "nepal-disaster-events-2024",
    "nepal-disaster-events-2025",
    "nepal-disaster-events-2026",
    "nepal-region-earthquakes",
]

SHARDS = {
    "core": CORE,
    "infra-network": INFRASTRUCTURE[:4],
    "infra-schools": INFRASTRUCTURE[4:8],
    "infra-services": INFRASTRUCTURE[8:],
    "events-2015-2020": EVENTS[:3],
    "events-2021-2024": EVENTS[3:6],
    "events-2025-2026": EVENTS[6:8],
    "earthquakes": EVENTS[8:],
}


def digest(raw):
    return hashlib.sha256(raw).hexdigest()


def normalize(value):
    decomposed = unicodedata.normalize("NFKD", value)
    plain = "".join(char for char in decomposed if not unicodedata.category(char).startswith("M")).lower()
    return " ".join("".join(char if char.isalnum() else " " for char in plain).split())


def latest_version(dataset):
    versions = sorted((ROOT / "data/releases" / dataset).glob("*"))
    if not versions:
        raise ValueError(f"Search input missing: {dataset}")
    return versions[-1]


def read_dataset(dataset, inputs):
    release = latest_version(dataset)
    manifest_path = release / "manifest.json"
    manifest_raw = manifest_path.read_bytes()
    metadata = json.loads(manifest_raw)
    artifact = metadata["artifact"]
    artifact_path = release / Path(artifact["path"]).name
    artifact_raw = artifact_path.read_bytes()
    if len(artifact_raw) != artifact["byte_size"] or digest(artifact_raw) != artifact["sha256"]:
        raise ValueError(f"Search input artifact mismatch: {dataset}")
    decoded = gzip.decompress(artifact_raw) if artifact["format"] == "GeoJSON+gzip" else artifact_raw
    collection = json.loads(decoded)
    inputs.append({
        "path": f"/data/{metadata['dataset_id']}/{metadata['dataset_version']}/manifest.json",
        "sha256": digest(manifest_raw),
        "byte_size": len(manifest_raw),
    })
    return metadata, collection


def bbox_center(geometry):
    positions = []

    def visit(value):
        if value and isinstance(value[0], (int, float)):
            positions.append(value)
        else:
            for child in value:
                visit(child)

    visit(geometry["coordinates"])
    west = min(point[0] for point in positions)
    east = max(point[0] for point in positions)
    south = min(point[1] for point in positions)
    north = max(point[1] for point in positions)
    return (west + east) / 2, (south + north) / 2


def identity(metadata, feature):
    properties = feature["properties"]
    feature_id = str(feature["id"])
    source_id = str(properties.get("source_id") or properties.get("pcode") or feature_id)
    return feature_id, source_id, f"{metadata['dataset_id']}@{metadata['dataset_version']}:{feature_id}"


def unique(values, canonical):
    seen = {canonical}
    result = []
    for value in values:
        if value is None:
            continue
        text = str(value).strip()
        if not text or not normalize(text) or text in seen:
            continue
        seen.add(text)
        result.append(text)
        if len(result) == 40:
            break
    return result


def record(metadata, feature):
    properties = feature["properties"]
    entity = properties.get("entity_type")
    feature_id, source_id, key = identity(metadata, feature)
    aliases = list(properties.get("search_terms") or []) + list(properties.get("aliases") or [])
    detail_href = None
    if "admin_level" in properties:
        entity_type = "administrative_unit"
        name = properties["name"]
        aliases += [properties.get("pcode"), properties.get("parent_name")]
        context = f"{properties['admin_category'].replace('_', ' ')} · {properties.get('parent_name') or 'Nepal'} · {properties['pcode']}"
        lon, lat = properties["label_longitude"], properties["label_latitude"]
        date = properties.get("valid_from")
    elif entity == "mountain":
        entity_type = "mountain"
        name = properties["name"]
        context = f"mountain / peak · GeoNames {source_id} · elevation {properties['value'] if properties['value'] is not None else 'UNKNOWN'} m"
        lon, lat = feature["geometry"]["coordinates"]
        date = properties.get("source_modified")
    elif entity == "river":
        entity_type = "river"
        name = properties.get("river_name") or f"HYRIV {source_id}"
        aliases += [f"HYRIV {source_id}"]
        context = f"river reach · source name UNKNOWN · flow order {properties['flow_order']}"
        lon, lat = bbox_center(feature["geometry"])
        date = metadata.get("observation_date")
    elif entity == "glacier":
        entity_type = "glacier"
        name = properties.get("glacier_name") or properties["source_id"]
        aliases += [properties.get("glims_id")]
        context = f"glacier · RGI 7.0 · {properties['area_km2']:.3f} km²"
        lon, lat = properties["centroid_longitude"], properties["centroid_latitude"]
        date = properties.get("outline_date")
    elif entity == "glacial_lake":
        entity_type = "glacial_lake"
        name = properties.get("lake_name") or properties["source_id"]
        context = f"glacial lake · source name UNKNOWN · {properties['country']} · {properties['basin']}"
        lon, lat = properties["centroid_longitude"], properties["centroid_latitude"]
        date = metadata.get("observation_date") or properties.get("inventory_period")
    elif entity == "hydropower_facility":
        entity_type = "hydropower"
        name = properties.get("facility_name") or source_id
        aliases += [properties.get("operator_name")]
        context = f"hydropower · {properties.get('capacity_mw') if properties.get('capacity_mw') is not None else 'capacity UNKNOWN'} MW"
        lon, lat = feature["geometry"]["coordinates"]
        date = properties.get("osm_source_timestamp")
    elif entity == "infrastructure_asset":
        entity_type = "infrastructure"
        name = properties.get("asset_name") or source_id
        aliases += [properties.get("asset_ref"), properties.get("operator_name"), properties.get("infrastructure_class"), properties.get("asset_subtype")]
        context = f"{properties['infrastructure_class']} · {properties['asset_subtype']}"
        lon, lat = feature["geometry"]["coordinates"] if feature["geometry"]["type"] == "Point" else bbox_center(feature["geometry"])
        date = properties.get("osm_source_timestamp")
    elif entity == "disaster_event":
        entity_type = "event"
        name = properties["name"]
        aliases += [properties.get("hazard_name"), properties.get("street_address"), source_id]
        context = f"reported {properties['hazard_name']} · {properties['event_time'][:10]} · {properties.get('street_address') or 'location text UNKNOWN'}"
        lon, lat = feature["geometry"]["coordinates"]
        date = properties.get("event_time")
        detail_href = f"/events/?year={properties['event_year']}&id={feature_id}"
    elif entity == "earthquake":
        entity_type = "event"
        name = properties.get("place_name") or f"USGS {source_id}"
        aliases += ["earthquake", f"M{properties['magnitude']}", source_id]
        context = f"earthquake · M{properties['magnitude']} {properties.get('magnitude_type') or 'UNKNOWN type'} · {properties['event_time'][:10]}"
        lon, lat = feature["geometry"]["coordinates"]
        date = properties.get("event_time")
    else:
        return None
    aliases = unique(aliases + [source_id], name)
    return {
        "key": key,
        "type": entity_type,
        "dataset_id": metadata["dataset_id"],
        "dataset_version": metadata["dataset_version"],
        "feature_id": feature_id,
        "source_id": source_id,
        "name": name,
        "aliases": aliases,
        "normalized_name": normalize(name),
        "normalized_aliases": [normalize(value) for value in aliases],
        "context": context,
        "longitude": lon,
        "latitude": lat,
        "date": date,
        "manifest_path": f"/data/{metadata['dataset_id']}/{metadata['dataset_version']}/manifest.json",
        "detail_href": detail_href,
    }


def derive():
    inputs = []
    shards = {}
    for shard_id, datasets in SHARDS.items():
        records = []
        for dataset in datasets:
            metadata, collection = read_dataset(dataset, inputs)
            records.extend(item for feature in collection["features"] if (item := record(metadata, feature)))
        shards[shard_id] = sorted(records, key=lambda item: item["key"])
    return shards, sorted(inputs, key=lambda item: item["path"])


def verify_search_index(path, public=None):
    manifest_schema = json.loads((ROOT / "schemas/search.schema.json").read_text())
    shard_schema = json.loads((ROOT / "schemas/search-shard.schema.json").read_text())
    manifest = json.loads((path / "manifest.json").read_text())
    Draft7Validator(manifest_schema).validate(manifest)
    derived, inputs = derive()
    if manifest["inputs"] != inputs:
        raise ValueError("Search index inputs differ from immutable releases")
    for shard in manifest["shards"]:
        raw = (path / Path(shard["path"]).name).read_bytes()
        if len(raw) != shard["byte_size"] or digest(raw) != shard["sha256"]:
            raise ValueError("Search shard checksum mismatch")
        decoded = gzip.decompress(raw)
        if len(decoded) != shard["decoded_byte_size"]:
            raise ValueError("Search shard decoded size mismatch")
        records = json.loads(decoded)
        Draft7Validator(shard_schema).validate(records)
        if records != derived[shard["id"]] or len(records) != shard["count"]:
            raise ValueError("Search shard differs from immutable source releases")
        if public and (public / Path(shard["path"]).name).read_bytes() != raw:
            raise ValueError("Public search shard differs")
    if public and (public / "manifest.json").read_bytes() != (path / "manifest.json").read_bytes():
        raise ValueError("Public search manifest differs")
    return manifest


def build():
    release = ROOT / ("data/releases" + BASE[5:])
    public = ROOT / ("apps/web/public" + BASE)
    if release.exists():
        verify_search_index(release, public)
        return
    shards, inputs = derive()
    release.mkdir(parents=True)
    manifest_shards = []
    for shard_id in SHARDS:
        decoded = (json.dumps(shards[shard_id], sort_keys=True, separators=(",", ":"), ensure_ascii=False) + "\n").encode()
        raw = gzip.compress(decoded, compresslevel=9, mtime=0)
        if len(raw) > 2_097_152 or len(decoded) > 16_777_216:
            raise ValueError(f"Search shard {shard_id} exceeds browser budget")
        name = f"{shard_id}.json.gz"
        (release / name).write_bytes(raw)
        manifest_shards.append({
            "id": shard_id,
            "path": BASE + name,
            "sha256": digest(raw),
            "byte_size": len(raw),
            "decoded_byte_size": len(decoded),
            "count": len(shards[shard_id]),
        })
    manifest = {
        "kind": "search-index",
        "schema_version": "1.0.0",
        "version": "1.0.0",
        "shards": manifest_shards,
        "inputs": inputs,
        "limitations": [
            "Aliases come only from published source-backed fields; the index does not invent Nepali/English transliterations.",
            "FAO/HydroRIVERS reaches and current GLO records have no verified common-name linkage in these releases, so unsupported river or lake names are not manufactured.",
        ],
    }
    (release / "manifest.json").write_text(json.dumps(manifest, sort_keys=True) + "\n")
    shutil.copytree(release, public)
    verify_search_index(release, public)


if __name__ == "__main__":
    build()
