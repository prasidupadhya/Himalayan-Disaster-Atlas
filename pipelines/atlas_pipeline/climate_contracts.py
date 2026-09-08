"""Validate the static NASA POWER climate release."""

import hashlib
import json

from jsonschema import Draft7Validator, FormatChecker

from .contracts import ROOT, timestamp

SCHEMA = json.loads((ROOT / "schemas/climate.schema.json").read_text())
VALIDATOR = Draft7Validator(SCHEMA, format_checker=FormatChecker())


def verify_climate(path, public=None):
    manifest = json.loads((path / "manifest.json").read_text())
    VALIDATOR.validate(manifest)
    metadata = manifest["metadata"]
    if timestamp(metadata["processing_date"]) < timestamp(metadata["retrieval_date"]):
        raise ValueError("Climate processing precedes retrieval")

    content = (path / "series.json").read_bytes()
    artifact = metadata["artifact"]
    if (
        len(content) != artifact["byte_size"]
        or hashlib.sha256(content).hexdigest() != artifact["sha256"]
    ):
        raise ValueError("Climate series checksum mismatch")
    payload = json.loads(content)
    if payload != {
        "product": manifest["product"],
        "series": manifest["series"],
        "normals": manifest["normals"],
    }:
        raise ValueError("Climate series differs from manifest")

    series = manifest["series"]
    periods = {item["period"] for item in series}
    expected = {f"{year}-{month:02d}" for year in range(1991, 2021) for month in range(1, 13)}
    if periods != expected:
        raise ValueError("Climate monthly period coverage mismatch")
    if any(item["coverage_percent"] < 99.99 for item in series):
        raise ValueError("Climate series has incomplete Nepal coverage")
    if [item["month"] for item in manifest["normals"]] != list(range(1, 13)):
        raise ValueError("Climate normals are incomplete")

    files = {"manifest.json", "series.json", "source.json", "qa.json", "LICENSE.txt"}
    actual = {str(item.relative_to(path)) for item in path.rglob("*") if item.is_file()}
    if actual != files:
        raise ValueError("Unregistered climate artifact")
    if public:
        public_files = {
            str(item.relative_to(public)) for item in public.rglob("*") if item.is_file()
        }
        if public_files != files:
            raise ValueError("Public climate inventory differs")
        for name in files:
            if (path / name).read_bytes() != (public / name).read_bytes():
                raise ValueError(f"Public climate artifact differs: {name}")
    return manifest
