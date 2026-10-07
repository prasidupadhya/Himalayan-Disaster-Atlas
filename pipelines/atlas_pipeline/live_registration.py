"""Register original live feature policies as immutable metadata, never provider readings."""

import hashlib
import json

from jsonschema import Draft7Validator, FormatChecker
from referencing import Registry, Resource

from .contracts import ROOT
from .live_contracts import publish_immutable_files, require
from .live_fixtures import encode


def register(identifier, title, method, source_file, limitations):
    raw = (ROOT / source_file).read_bytes()
    manifest = {
        "schema_version": "1.0.0",
        "kind": "live-feature-release",
        "id": identifier,
        "version": "1.0.0",
        "title": title,
        "is_fixture": False,
        "source": "Himalayan Disaster Atlas original policy metadata",
        "source_url": "https://github.com/prasidupadhya/Himalayan-Disaster-Atlas",
        "license": "MIT",
        "license_url": "https://opensource.org/license/mit/",
        "attribution": "Himalayan Disaster Atlas contributors. Upstream readings retain separate terms.",
        "method": method,
        "limitations": limitations,
        "artifacts": {
            "policy": {
                "path": f"/data/{identifier}/1.0.0/policy.json",
                "sha256": hashlib.sha256(raw).hexdigest(),
                "byte_size": len(raw),
            }
        },
    }
    content = {
        "manifest.json": encode(manifest),
        "policy.json": raw,
        "LICENSE.txt": (ROOT / "LICENSE").read_bytes(),
    }
    for prefix in ("data/releases", "apps/web/public/data"):
        directory = ROOT / prefix / identifier / "1.0.0"
        publish_immutable_files(directory, content)
    verify_registration(
        ROOT / "data/releases" / identifier / "1.0.0",
        ROOT / "apps/web/public/data" / identifier / "1.0.0",
    )


def verify_registration(directory, public):
    manifest = json.loads((directory / "manifest.json").read_bytes())
    dependency = json.loads((ROOT / "schemas/live-snapshot.schema.json").read_bytes())
    registry = Registry().with_resource(dependency["$id"], Resource.from_contents(dependency))
    Draft7Validator(
        json.loads((ROOT / "schemas/live-feature.schema.json").read_bytes()),
        registry=registry,
        format_checker=FormatChecker(),
    ).validate(manifest)
    require(
        manifest["kind"] == "live-feature-release"
        and manifest["license"] == "MIT"
        and manifest["id"] == directory.parent.name
        and manifest["version"] == directory.name,
        "Live policy registration identity mismatch",
    )
    raw = (directory / "policy.json").read_bytes()
    reference = manifest["artifacts"]["policy"]
    require(
        reference["path"] == f"/data/{manifest['id']}/{manifest['version']}/policy.json"
        and len(raw) == reference["byte_size"]
        and hashlib.sha256(raw).hexdigest() == reference["sha256"],
        "Live policy checksum mismatch",
    )
    require(
        {p.name for p in directory.iterdir()} == {"manifest.json", "policy.json", "LICENSE.txt"},
        "Unregistered live policy file",
    )
    require(
        {p.name for p in public.iterdir()} == {"manifest.json", "policy.json", "LICENSE.txt"}
        and all((public / p.name).read_bytes() == p.read_bytes() for p in directory.iterdir()),
        "Public live policy differs",
    )
    return manifest


if __name__ == "__main__":
    register(
        "atlas-live-open-feeds",
        "Live open-feed publication policy (not readings)",
        "live-open-feeds/1.0.0: bounded USGS/GFS normalization, source review, immutable checksums and atomic index promotion",
        "licensing/live-sources.json",
        [
            "Policy metadata only; source readings are separately versioned on live-data and require a pinned static deployment.",
            "No official Nepal warnings or physical damage outputs. Empty source collections do not establish all-clear.",
        ],
    )
