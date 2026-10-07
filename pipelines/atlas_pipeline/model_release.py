"""Shared immutable publication and verification for model/context releases (Features 48-58).

A model release pins its exact parent inputs, publishes checksum-addressed artifacts, and is
verified both structurally (JSON Schema) and semantically (a verifier per release type).
"""

import gzip
import hashlib
import json
from pathlib import Path

from jsonschema import Draft7Validator, FormatChecker
from referencing import Registry, Resource

from .contracts import ROOT
from .live_contracts import publish_immutable_files, require

RELEASES = ROOT / "data/releases"
PUBLIC = ROOT / "apps/web/public/data"
MAX_ARTIFACT_BYTES = 8 * 1024 * 1024
SEMANTIC = {}


def encode(value):
    """Deterministic compact JSON; NaN/Infinity are rejected, never serialised."""
    return (json.dumps(value, sort_keys=True, separators=(",", ":"), ensure_ascii=False, allow_nan=False) + "\n").encode()


def gzip_bytes(raw):
    return gzip.compress(raw, compresslevel=9, mtime=0)


def digest(raw):
    return hashlib.sha256(raw).hexdigest()


def _validator():
    dataset = json.loads((ROOT / "schemas/dataset.schema.json").read_bytes())
    registry = Registry().with_resource(dataset["$id"], Resource.from_contents(dataset))
    return Draft7Validator(json.loads((ROOT / "schemas/model-release.schema.json").read_bytes()),
                           registry=registry, format_checker=FormatChecker())


SCHEMA = _validator()


def semantic(release_type):
    def register(function):
        SEMANTIC[release_type] = function
        return function
    return register


def input_reference(dataset_id, version, source_url=None):
    """Exact parent identity: the release manifest bytes are hashed, not reinterpreted."""
    path = RELEASES / dataset_id / version / "manifest.json"
    raw = path.read_bytes()
    manifest = json.loads(raw)
    meta = manifest.get("metadata") if isinstance(manifest.get("metadata"), dict) else manifest
    source = meta.get("source") or manifest.get("title") or dataset_id
    reference = {"dataset_id": dataset_id, "dataset_version": version, "source": source[:400],
                 "manifest_path": f"/data/{dataset_id}/{version}/manifest.json", "sha256": digest(raw)}
    if source_url:
        reference["source_url"] = source_url
    return reference


def external_input(dataset_id, version, source, sha256, source_url):
    """Upstream file outside the release tree, pinned by its own SHA-256."""
    return {"dataset_id": dataset_id, "dataset_version": version, "source": source[:400],
            "manifest_path": None, "sha256": sha256, "source_url": source_url}


def build_manifest(identifier, version, release_type, metadata, inputs, files, summary):
    artifacts = {}
    for name, (filename, raw, media_type) in sorted(files.items()):
        require(len(raw) <= MAX_ARTIFACT_BYTES, f"Artifact exceeds 8 MiB budget: {filename}")
        artifacts[name] = {"path": f"/data/{identifier}/{version}/{filename}", "sha256": digest(raw),
                           "byte_size": len(raw), "media_type": media_type}
    manifest = {"schema_version": "1.0.0", "kind": "model-release", "release_type": release_type,
                "metadata": {**metadata, "schema_version": "1.0.0", "dataset_id": identifier, "dataset_version": version},
                "inputs": inputs, "artifacts": artifacts, "summary": summary}
    errors = sorted(SCHEMA.iter_errors(manifest), key=lambda error: list(error.path))
    require(not errors, "Invalid model release: " + "; ".join(f"{list(e.path)} {e.message}" for e in errors[:5]))
    return manifest


def publish(identifier, version, release_type, metadata, inputs, files, summary, extra=None):
    """Stage, verify and copy an immutable release and its exact public mirror."""
    manifest = build_manifest(identifier, version, release_type, metadata, inputs, files, summary)
    content = {"manifest.json": encode(manifest), "LICENSE.txt": (ROOT / "LICENSE").read_bytes()}
    content.update({filename: raw for filename, raw, _ in files.values()})
    content.update(extra or {})
    for prefix in (RELEASES, PUBLIC):
        publish_immutable_files(prefix / identifier / version, content)
    return verify(RELEASES / identifier / version, PUBLIC / identifier / version)


def read_artifact(directory, manifest, name):
    entry = manifest["artifacts"][name]
    raw = (directory / Path(entry["path"]).name).read_bytes()
    require(len(raw) == entry["byte_size"] and digest(raw) == entry["sha256"], f"Artifact checksum mismatch: {name}")
    return gzip.decompress(raw) if entry["media_type"] == "application/json+gzip" else raw


def read_json_artifact(directory, manifest, name):
    return json.loads(read_artifact(directory, manifest, name))


def verify(directory, public=None):
    manifest = json.loads((directory / "manifest.json").read_bytes())
    errors = list(SCHEMA.iter_errors(manifest))
    require(not errors, f"Invalid model release {directory}: {errors[0].message if errors else ''}")
    meta = manifest["metadata"]
    require(meta["dataset_id"] == directory.parent.name and meta["dataset_version"] == directory.name,
            "Model release identity differs from its path")
    expected = {"manifest.json", "LICENSE.txt"} | {Path(a["path"]).name for a in manifest["artifacts"].values()}
    expected |= set(manifest["summary"].get("notice_files", []))
    actual = {p.name for p in directory.iterdir()}
    require(actual == expected, f"Unregistered or missing model release file in {directory}: {sorted(actual ^ expected)}")
    for name, entry in manifest["artifacts"].items():
        require(entry["path"] == f"/data/{meta['dataset_id']}/{meta['dataset_version']}/{Path(entry['path']).name}",
                f"Artifact path outside release: {name}")
        read_artifact(directory, manifest, name)
    for item in manifest["inputs"]:
        if item["manifest_path"]:
            parent = RELEASES / Path(item["manifest_path"]).relative_to("/data")
            require(parent.exists() and digest(parent.read_bytes()) == item["sha256"],
                    f"Parent release changed or missing: {item['dataset_id']}@{item['dataset_version']}")
    check = SEMANTIC.get(manifest["release_type"])
    require(check is not None, f"No semantic verifier for {manifest['release_type']}")
    check(directory, manifest)
    if public is not None:
        require(public.exists() and {p.name for p in public.iterdir()} == actual
                and all((public / name).read_bytes() == (directory / name).read_bytes() for name in actual),
                f"Public model release differs: {directory}")
    return manifest
