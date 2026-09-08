"""Validate static Sentinel-2 observation previews and their provenance."""

import hashlib
import json

from jsonschema import Draft7Validator, FormatChecker
from PIL import Image

from .contracts import ROOT, timestamp

SCHEMA = json.loads((ROOT / "schemas/satellite.schema.json").read_text())
VALIDATOR = Draft7Validator(SCHEMA, format_checker=FormatChecker())


def verify_satellite(path, public=None):
    manifest = json.loads((path / "manifest.json").read_text())
    VALIDATOR.validate(manifest)
    metadata = manifest["metadata"]
    if timestamp(metadata["processing_date"]) < timestamp(metadata["retrieval_date"]):
        raise ValueError("Satellite processing precedes retrieval")
    index = (path / "observations.json").read_bytes()
    if (
        len(index) != metadata["artifact"]["byte_size"]
        or hashlib.sha256(index).hexdigest() != metadata["artifact"]["sha256"]
    ):
        raise ValueError("Satellite observation index checksum mismatch")
    observations = json.loads(index)
    if observations != manifest["observations"]:
        raise ValueError("Satellite observation index differs from manifest")
    if {item["id"] for item in observations} != {"west", "central", "east"}:
        raise ValueError("Satellite observation inventory mismatch")
    for item in observations:
        if item["cloud_percent"] > 5 or item["nodata_percent"] != 0:
            raise ValueError("Satellite source selection rule violated")
        image_path = path / item["image"]["path"].split("/")[-1]
        content = image_path.read_bytes()
        if (
            len(content) != item["image"]["byte_size"]
            or hashlib.sha256(content).hexdigest() != item["image"]["sha256"]
        ):
            raise ValueError("Satellite preview checksum mismatch")
        with Image.open(image_path) as image:
            if image.mode != "RGB" or image.size != (768, 768):
                raise ValueError("Satellite preview format mismatch")
    files = {
        "manifest.json",
        "observations.json",
        "sources.json",
        "qa.json",
        "LICENSE.txt",
        "west.png",
        "central.png",
        "east.png",
    }
    actual = {str(item.relative_to(path)) for item in path.rglob("*") if item.is_file()}
    if actual != files:
        raise ValueError("Unregistered satellite artifact")
    if public:
        public_files = {
            str(item.relative_to(public)) for item in public.rglob("*") if item.is_file()
        }
        if public_files != files:
            raise ValueError("Public satellite inventory differs")
        for name in files:
            if (path / name).read_bytes() != (public / name).read_bytes():
                raise ValueError(f"Public satellite artifact differs: {name}")
    return manifest
