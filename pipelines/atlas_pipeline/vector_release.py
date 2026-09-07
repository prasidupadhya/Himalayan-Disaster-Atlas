"""Small helpers shared by evidence-traceable vector feature pipelines."""

import gzip
import hashlib
import json

from .contracts import validate_dataset


def encode(value):
    return (json.dumps(value, ensure_ascii=False, separators=(",", ":")) + "\n").encode()


def sha256(content):
    return hashlib.sha256(content).hexdigest()


def write_immutable(path, content):
    path.parent.mkdir(parents=True, exist_ok=True)
    if path.exists() and path.read_bytes() != content:
        raise ValueError(f"Immutable release conflict: {path}; bump the version")
    path.write_bytes(content)


def publish_vector(root, metadata, collection):
    """Validate and publish deterministic gzip GeoJSON to release and public roots."""
    decoded = encode(collection)
    artifact = gzip.compress(decoded, compresslevel=9, mtime=0)
    metadata = {
        **metadata,
        "artifact": {
            "path": f"/data/{metadata['dataset_id']}/{metadata['dataset_version']}/features.geojson.gz",
            "format": "GeoJSON+gzip",
            "sha256": sha256(artifact),
            "byte_size": len(artifact),
        },
    }
    validate_dataset(metadata, collection)
    relative = f"{metadata['dataset_id']}/{metadata['dataset_version']}"
    outputs = []
    for base in (root / "data/releases" / relative, root / "apps/web/public/data" / relative):
        outputs.extend(
            (
                (base / "manifest.json", encode(metadata)),
                (base / "features.geojson.gz", artifact),
            )
        )
    for path, content in outputs:
        if path.exists() and path.read_bytes() != content:
            raise ValueError(f"Immutable release conflict: {path}; bump the version")
    for path, content in outputs:
        write_immutable(path, content)
    return metadata, collection
