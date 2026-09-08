"""Build a complete immutable provenance/catalog registry from every published release manifest."""

import gzip
import hashlib
import json
import re
import shutil
from pathlib import Path

from jsonschema import Draft7Validator

from .contracts import ROOT

VERSION = "1.0.0"
BASE = f"/data/atlas-provenance/{VERSION}/"
RELEASE = ROOT / "data/releases/atlas-provenance" / VERSION
PUBLIC = ROOT / "apps/web/public/data/atlas-provenance" / VERSION


def digest(raw):
    return hashlib.sha256(raw).hexdigest()


def metadata_of(manifest):
    if "dataset_id" in manifest:
        return manifest
    metadata = manifest.get("metadata")
    return metadata if isinstance(metadata, dict) and "dataset_id" in metadata else None


def category(identifier):
    if identifier == "foundation-sample":
        return "Development"
    if "admin-" in identifier:
        return "Administrative"
    if "terrain" in identifier:
        return "Terrain"
    if "glacier" in identifier or "glacial-lake" in identifier:
        return "Cryosphere"
    if any(
        token in identifier
        for token in ("river", "hydrology", "rainfall", "climate", "water-change")
    ):
        return "Hydrology & climate"
    if any(token in identifier for token in ("disaster", "earthquake", "flood", "landslide")):
        return "Hazards & events"
    if any(token in identifier for token in ("osm-", "hydropower")):
        return "Infrastructure"
    if "population" in identifier:
        return "Population"
    if "sentinel" in identifier or "satellite" in identifier:
        return "Satellite"
    if any(token in identifier for token in ("exposure", "hazard-graph", "scenario")):
        return "Analysis & models"
    return "Discovery & evidence"


def anchors(identifier):
    if "admin-" in identifier:
        return "administrative-method", "administrative"
    if "terrain" in identifier:
        return "terrain-method", "terrain"
    if "mountain" in identifier:
        return "mountains-method", "mountains"
    if "river" in identifier:
        return "rivers-method", "rivers"
    if "glacier" in identifier and "lake" not in identifier:
        return "glaciers-method", "glaciers"
    if "glacial-lake" in identifier:
        return "glacial-lakes-method", "glacial-lakes"
    if "population" in identifier:
        return "population-method", "population"
    if "sentinel" in identifier or "satellite" in identifier:
        return "satellite-method", "satellite"
    if "climate" in identifier:
        return "climate-method", "climate"
    if "water-change" in identifier:
        return "water-method", "satellite"
    if any(token in identifier for token in ("osm-", "hydropower")):
        return "infrastructure-method", "infrastructure"
    if any(token in identifier for token in ("disaster", "earthquake", "flood", "landslide")):
        return "events-method", "hazards"
    if "exposure" in identifier:
        return "exposure-method", "analysis"
    if "hazard-graph" in identifier:
        return "hazard-graph-method", "analysis"
    if "scenario" in identifier:
        return "scenario-method", "analysis"
    if "search" in identifier:
        return "search-method", "derived"
    if "time-index" in identifier:
        return "time-method", "derived"
    if "evidence" in identifier:
        return "evidence-method", "derived"
    return "pipeline-method", "derived"


def artifacts(manifest):
    found = []

    def visit(value):
        if isinstance(value, dict):
            if (
                isinstance(value.get("path"), str)
                and value["path"].startswith("/data/")
                and isinstance(value.get("sha256"), str)
                and isinstance(value.get("byte_size"), int)
            ):
                found.append(
                    {
                        "path": value["path"],
                        "sha256": value["sha256"],
                        "byte_size": value["byte_size"],
                    }
                )
            for child in value.values():
                visit(child)
        elif isinstance(value, list):
            for child in value:
                visit(child)

    visit(manifest)
    unique = {item["path"]: item for item in found}
    return [unique[key] for key in sorted(unique)]


def manifest_parent(path, sha=None, source=None):
    match = re.match(r"^/data/([^/]+)/([^/]+)/manifest\.json$", path or "")
    if not match:
        return None
    identifier, version = match.groups()
    return {
        "id": identifier,
        "version": version,
        "source": source or identifier,
        "manifest_path": path,
        "sha256": sha,
    }


def custom_inputs(identifier, manifest, directory):
    candidates = []
    for item in manifest.get("inputs", []):
        if not isinstance(item, dict):
            continue
        path = item.get("path") or item.get("manifest_path")
        parent = manifest_parent(path, item.get("sha256"), item.get("source"))
        if parent:
            candidates.append(parent)
        elif item.get("dataset_id"):
            version = item.get("dataset_version") or item.get("version") or "UNKNOWN"
            candidates.append(
                {
                    "id": item["dataset_id"],
                    "version": version,
                    "source": item.get("source") or item["dataset_id"],
                    "manifest_path": None,
                    "sha256": item.get("sha256"),
                }
            )
    if identifier == "atlas-time-index":
        payload = json.loads((directory / "index.json").read_text())
        for item in payload.get("inputs", []):
            parent = manifest_parent(item.get("path"), item.get("sha256"))
            if parent:
                candidates.append(parent)
    elif identifier == "nepal-hazard-graph":
        payload = json.loads(gzip.decompress((directory / "graph.json.gz").read_bytes()))
        for item in payload.get("inputs", []):
            parent = manifest_parent(item.get("path"), item.get("sha256"), item.get("source"))
            if parent:
                candidates.append(parent)
    elif identifier.startswith("scenario-"):
        request = json.loads((directory / "request.json").read_text())
        for item in request.get("inputs", []):
            candidates.append(
                {
                    "id": item["dataset_id"],
                    "version": item["dataset_version"],
                    "source": item["source"],
                    "manifest_path": f"/data/{item['dataset_id']}/{item['dataset_version']}/manifest.json",
                    "sha256": item["sha256"],
                }
            )
    elif identifier == "atlas-evidence":
        corpus = json.loads(gzip.decompress((directory / "corpus.json.gz").read_bytes()))
        for document in corpus.get("documents", []):
            for item in document.get("inputs", []):
                candidates.append(
                    {
                        "id": item["dataset_id"],
                        "version": item["dataset_version"],
                        "source": item["dataset_id"],
                        "manifest_path": item["manifest_path"],
                        "sha256": item["sha256"],
                    }
                )
    unique = {(item["id"], item["version"]): item for item in candidates}
    return [unique[key] for key in sorted(unique)]


CUSTOM = {
    "atlas-search-index": (
        "Atlas global search index",
        "Offline normalized and sharded discovery index over versioned Atlas releases.",
        "derived",
        "ATLAS_DERIVED",
    ),
    "atlas-time-index": (
        "Atlas observation time index",
        "Offline UTC observation-date index over supported temporal products.",
        "derived",
        "ATLAS_DERIVED",
    ),
    "nepal-hazard-graph": (
        "Nepal hazard relationship graph",
        "Offline evidence-labelled relationship graph built from exact Atlas release records.",
        "derived",
        "ATLAS_DERIVED",
    ),
    "atlas-evidence": (
        "Atlas evidence corpus",
        "Versioned exact-text methodology corpus with line-addressable chunks and source hashes.",
        "derived",
        "ATLAS_DERIVED",
    ),
}


def record(path, latest_versions):
    raw = path.read_bytes()
    manifest = json.loads(raw)
    directory = path.parent
    metadata = metadata_of(manifest)
    identifier = (
        metadata["dataset_id"]
        if metadata
        else manifest.get("id") or manifest.get("result_id") or path.parent.parent.name
    )
    version = metadata["dataset_version"] if metadata else manifest.get("version", path.parent.name)
    methodology, source_anchor = anchors(identifier)
    is_fixture = bool(metadata and metadata.get("is_fixture"))
    state = (
        "fixture"
        if is_fixture
        else "superseded"
        if latest_versions.get(identifier) != version
        else "current"
    )
    if metadata:
        resolution = metadata.get("spatial_resolution", {})
        spatial_resolution = (
            "UNKNOWN / source-specific"
            if resolution.get("value") is None
            else f"{resolution['value']} {resolution['unit']}"
        )
        temporal = metadata.get("temporal_coverage", {})
        temporal_coverage = (
            "UNKNOWN / not applicable"
            if not temporal.get("start")
            else f"{temporal['start']} → {temporal['end']}"
        )
        parents = []
        if metadata.get("evidence_type") in ("derived", "estimated", "modelled"):
            parents = [
                {
                    "id": "external-source",
                    "version": "as cited",
                    "source": metadata["source"],
                    "manifest_path": None,
                    "sha256": None,
                }
            ]
        transformations = [
            f"Acquire/pin source: {metadata['source']}",
            metadata["method"],
            f"Publish checksum-verified web artifact with {metadata['processing_version']}",
        ]
        return {
            "key": f"{identifier}@{version}",
            "id": identifier,
            "version": version,
            "title": metadata["dataset_name"],
            "category": category(identifier),
            "source": metadata["source"],
            "source_url": metadata.get("source_url"),
            "license": metadata["license"],
            "license_url": metadata.get("license_url"),
            "attribution": metadata["attribution"],
            "access_date": metadata.get("retrieval_date"),
            "observation_date": metadata.get("observation_date"),
            "publication_date": metadata.get("publication_date"),
            "processing_date": metadata.get("processing_date"),
            "processing_version": metadata["processing_version"],
            "method": metadata["method"],
            "spatial_resolution": spatial_resolution,
            "spatial_coverage": metadata["spatial_coverage"]["description"],
            "temporal_coverage": temporal_coverage,
            "limitations": metadata["limitations"],
            "uncertainty": metadata["uncertainty"],
            "evidence_type": metadata["evidence_type"],
            "status": metadata["status"],
            "is_fixture": is_fixture,
            "state": state,
            "manifest_path": f"/data/{identifier}/{version}/manifest.json",
            "manifest_sha256": digest(raw),
            "artifacts": artifacts(manifest),
            "parents": parents,
            "transformations": transformations,
            "methodology_href": f"/methodology/#{methodology}",
            "source_href": f"/sources/#{source_anchor}",
            "map_href": None
            if category(identifier) in ("Analysis & models", "Discovery & evidence", "Development")
            else "/atlas/",
        }
    if identifier.startswith("exposure-"):
        title, method, evidence, status = (
            manifest["name"],
            manifest["method"],
            manifest.get("evidence_type", "derived"),
            manifest.get("status", "ESTIMATED"),
        )
        limits = manifest["limitations"]
        processing_date = manifest.get("calculated_at")
    elif identifier.startswith("scenario-"):
        request = json.loads((directory / "request.json").read_text())
        title = (
            "Prepared hypothetical network scenario"
            if request["simulation_level"] == 1
            else "Prepared hypothetical pulse scenario"
        )
        method = f"{request['model']['id']}@{request['model']['version']} via scenario-runner/1.0.0"
        evidence, status = "simulated", "MODELLED"
        limits = [
            "Educational modelled scenario; not an official forecast.",
            "No hydraulic depth, inundation footprint or water velocity is calculated.",
        ]
        processing_date = None
    else:
        title, method, evidence, status = CUSTOM[identifier]
        limits = manifest.get("limitations") or [
            "Derived Atlas product; interpretation inherits the limitations of every parent input."
        ]
        processing_date = None
    parents = custom_inputs(identifier, manifest, directory)
    parent_dates = []
    for parent in parents:
        if parent["manifest_path"]:
            parent_path = (
                ROOT / "data/releases" / Path(parent["manifest_path"]).relative_to("/data")
            )
            if parent_path.exists():
                parent_meta = metadata_of(json.loads(parent_path.read_text()))
                if parent_meta and parent_meta.get("retrieval_date"):
                    parent_dates.append(parent_meta["retrieval_date"])
    return {
        "key": f"{identifier}@{version}",
        "id": identifier,
        "version": version,
        "title": title,
        "category": category(identifier),
        "source": "Himalayan Disaster Atlas derived product",
        "source_url": f"/methodology/#{methodology}",
        "license": "Inherited from parent datasets; inspect parent records",
        "license_url": None,
        "attribution": "Parent-source attribution and licences remain applicable.",
        "access_date": max(parent_dates) if parent_dates else None,
        "observation_date": None,
        "publication_date": None,
        "processing_date": processing_date,
        "processing_version": method.split(" via ")[-1] if " via " in method else method,
        "method": method,
        "spatial_resolution": "Source-dependent / see parent datasets",
        "spatial_coverage": "Derived from the listed parent datasets; see parent coverage",
        "temporal_coverage": "Derived from parent dates; no independent observation period",
        "limitations": limits,
        "uncertainty": "No new observational uncertainty is invented; parent and method limitations govern interpretation.",
        "evidence_type": evidence,
        "status": status,
        "is_fixture": False,
        "state": state,
        "manifest_path": f"/data/{identifier}/{version}/manifest.json",
        "manifest_sha256": digest(raw),
        "artifacts": artifacts(manifest),
        "parents": parents,
        "transformations": [
            "Load exact parent release manifests/artifacts",
            method,
            "Publish immutable checksum-verified derived artifact",
        ],
        "methodology_href": f"/methodology/#{methodology}",
        "source_href": f"/sources/#{source_anchor}",
        "map_href": "/atlas/" if category(identifier) == "Analysis & models" else None,
    }


def derive():
    paths = sorted(
        path
        for path in (ROOT / "data/releases").glob("*/*/manifest.json")
        if path.parent.parent.name != "atlas-provenance"
    )
    latest = {}
    for path in paths:
        latest[path.parent.parent.name] = max(
            latest.get(path.parent.parent.name, ""), path.parent.name
        )
    records = [record(path, latest) for path in paths]
    return {
        "schema_version": "1.0.0",
        "kind": "provenance-catalog",
        "version": VERSION,
        "generated_from_count": len(records),
        "records": sorted(
            records, key=lambda item: (item["category"], item["title"], item["id"], item["version"])
        ),
    }


def verify_provenance(path=RELEASE, public=PUBLIC):
    schema = json.loads((ROOT / "schemas/provenance.schema.json").read_text())
    manifest = json.loads((path / "manifest.json").read_text())
    Draft7Validator(schema).validate(manifest)
    expected = derive()
    if manifest != expected:
        raise ValueError("Provenance registry differs from current release manifests")
    keys = {record["key"] for record in manifest["records"]}
    expected_keys = {
        f"{p.parent.parent.name}@{p.parent.name}"
        for p in (ROOT / "data/releases").glob("*/*/manifest.json")
        if p.parent.parent.name != "atlas-provenance"
    }
    if keys != expected_keys:
        raise ValueError("Provenance registry does not cover every release")
    if public and (public / "manifest.json").read_bytes() != (path / "manifest.json").read_bytes():
        raise ValueError("Public provenance registry differs")
    return manifest


def build():
    catalog = derive()
    if RELEASE.exists():
        shutil.rmtree(RELEASE)
    if PUBLIC.exists():
        shutil.rmtree(PUBLIC)
    RELEASE.mkdir(parents=True)
    PUBLIC.mkdir(parents=True)
    raw = (
        json.dumps(catalog, sort_keys=True, separators=(",", ":"), ensure_ascii=False) + "\n"
    ).encode()
    (RELEASE / "manifest.json").write_bytes(raw)
    (PUBLIC / "manifest.json").write_bytes(raw)
    verify_provenance()


if __name__ == "__main__":
    build()
