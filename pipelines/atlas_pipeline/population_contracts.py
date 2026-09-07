"""Validate the WorldPop analysis provenance and static population tile pyramid."""

import hashlib
import json
import math

from jsonschema import Draft7Validator, FormatChecker
from PIL import Image
from referencing import Registry, Resource

from .contracts import ROOT, SCHEMA, timestamp

POPULATION_SCHEMA = json.loads((ROOT / "schemas/population.schema.json").read_text())
VALIDATOR = Draft7Validator(
    POPULATION_SCHEMA,
    format_checker=FormatChecker(),
    registry=Registry().with_resource(SCHEMA["$id"], Resource.from_contents(SCHEMA)),
)


def tile_range(bbox, zoom):
    west, south, east, north = bbox
    n = 2**zoom

    def x(lon):
        return math.floor((lon + 180) / 360 * n)

    def y(lat):
        return math.floor((1 - math.asinh(math.tan(math.radians(lat))) / math.pi) / 2 * n)

    return x(west), x(east), y(north), y(south)


def verify_population(path, public=None):
    manifest = json.loads((path / "manifest.json").read_text())
    VALIDATOR.validate(manifest)
    metadata = manifest["metadata"]
    if timestamp(metadata["processing_date"]) < timestamp(metadata["retrieval_date"]):
        raise ValueError("Population processing precedes retrieval")
    index_content = (path / "tiles.json").read_bytes()
    artifact = metadata["artifact"]
    if len(index_content) != artifact["byte_size"] or hashlib.sha256(index_content).hexdigest() != artifact["sha256"]:
        raise ValueError("Population tile index checksum mismatch")
    index = json.loads(index_content)
    expected = set()
    for zoom in range(manifest["raster"]["minzoom"], manifest["raster"]["maxzoom"] + 1):
        x0, x1, y0, y1 = tile_range(metadata["spatial_coverage"]["bbox"], zoom)
        expected.update(f"{zoom}/{x}/{y}.png" for x in range(x0, x1 + 1) for y in range(y0, y1 + 1))
    if set(index) != expected or manifest["raster"]["tile_count"] != len(expected):
        raise ValueError("Population tile inventory is incomplete")
    for key, item in index.items():
        content = (path / key).read_bytes()
        if len(content) != item["byte_size"] or len(content) > 262144 or hashlib.sha256(content).hexdigest() != item["sha256"]:
            raise ValueError(f"Population tile checksum mismatch: {key}")
        with Image.open(path / key) as image:
            if image.mode != "RGBA" or image.size != (256, 256):
                raise ValueError("Invalid population display tile")
    files = expected | {"manifest.json", "tiles.json", "qa.json", "source.json", "LICENSE.txt"}
    actual = {str(item.relative_to(path)) for item in path.rglob("*") if item.is_file()}
    if actual != files:
        raise ValueError("Unregistered population artifact")
    if public:
        public_files = {str(item.relative_to(public)) for item in public.rglob("*") if item.is_file()}
        if public_files != files:
            raise ValueError("Public population inventory differs")
        for name in files:
            if (path / name).read_bytes() != (public / name).read_bytes():
                raise ValueError(f"Public population artifact differs: {name}")
    return manifest
