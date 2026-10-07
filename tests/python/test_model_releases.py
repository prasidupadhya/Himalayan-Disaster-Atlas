import gzip
import json
import math
import shutil
import tempfile
import unittest
from pathlib import Path

from pipelines.atlas_pipeline.contracts import ROOT
from pipelines.atlas_pipeline.gmpe import DOMAIN, ground_motion
from pipelines.atlas_pipeline.model_release import (
    build_manifest,
    digest,
    encode,
    gzip_bytes,
    verify,
)
from pipelines.atlas_pipeline.model_releases import verify_model_release

RELEASES = {
    "nepal-hrsl-population": "1.0.0",
    "atlas-flood-corridors": "1.0.0",
    "atlas-gmpe-bssa14": "1.0.0",
}


def release(identifier):
    return ROOT / "data/releases" / identifier / RELEASES[identifier]


def public(identifier):
    return ROOT / "apps/web/public/data" / identifier / RELEASES[identifier]


class ModelReleaseTest(unittest.TestCase):
    def setUp(self):
        self.tmp = Path(tempfile.mkdtemp())

    def tearDown(self):
        shutil.rmtree(self.tmp)

    def copy(self, identifier):
        target = self.tmp / identifier / RELEASES[identifier]
        shutil.copytree(release(identifier), target)
        return target

    def rewrite(self, directory, name, transform):
        """Re-encode one JSON artifact and re-pin it in the manifest, so only the semantic check can object."""
        manifest = json.loads((directory / "manifest.json").read_bytes())
        entry = manifest["artifacts"][name]
        path = directory / Path(entry["path"]).name
        gz = entry["media_type"] == "application/json+gzip"
        value = json.loads(gzip.decompress(path.read_bytes()) if gz else path.read_bytes())
        transform(value)
        raw = gzip_bytes(encode(value)) if gz else encode(value)
        path.write_bytes(raw)
        entry.update(sha256=digest(raw), byte_size=len(raw))
        (directory / "manifest.json").write_bytes(encode(manifest))

    def test_checked_in_releases_and_public_mirrors_verify(self):
        for identifier in RELEASES:
            manifest = verify(release(identifier), public(identifier))
            self.assertEqual(manifest["kind"], "model-release")
            self.assertEqual(verify_model_release(release(identifier), public(identifier))["metadata"]["dataset_id"], identifier)

    def test_corrupted_artifact_is_rejected(self):
        directory = self.copy("atlas-gmpe-bssa14")
        path = directory / "model.json"
        path.write_bytes(path.read_bytes().replace(b"-1.134", b"-1.135"))
        with self.assertRaisesRegex(ValueError, "checksum"):
            verify(directory)

    def test_unregistered_file_is_rejected(self):
        directory = self.copy("atlas-gmpe-bssa14")
        (directory / "extra.json").write_text("{}")
        with self.assertRaisesRegex(ValueError, "Unregistered"):
            verify(directory)

    def test_public_mirror_must_match_exactly(self):
        directory = self.copy("atlas-gmpe-bssa14")
        mirror = self.tmp / "mirror"
        shutil.copytree(directory, mirror)
        (mirror / "LICENSE.txt").write_text("changed")
        with self.assertRaisesRegex(ValueError, "Public model release differs"):
            verify(directory, mirror)

    def test_changed_parent_release_is_rejected(self):
        directory = self.copy("atlas-flood-corridors")
        manifest = json.loads((directory / "manifest.json").read_bytes())
        parent = next(i for i in manifest["inputs"] if i["manifest_path"])
        parent["sha256"] = "0" * 64
        (directory / "manifest.json").write_bytes(encode(manifest))
        with self.assertRaisesRegex(ValueError, "Parent release changed"):
            verify(directory)

    def test_gmpe_coefficient_drift_is_rejected(self):
        directory = self.copy("atlas-gmpe-bssa14")
        self.rewrite(directory, "model", lambda m: m["coefficients"]["pga"].update(e0=0.5))
        with self.assertRaisesRegex(ValueError, "coefficients differ"):
            verify(directory)

    def test_population_grid_total_drift_is_rejected(self):
        directory = self.copy("nepal-hrsl-population")
        self.rewrite(directory, "grid", lambda g: g["cells"][0][1][0][1].__setitem__(0, g["cells"][0][1][0][1][0] + 50))
        with self.assertRaisesRegex(ValueError, "total differs"):
            verify(directory)

    def test_population_grid_negative_cell_is_rejected(self):
        directory = self.copy("nepal-hrsl-population")
        self.rewrite(directory, "grid", lambda g: g["cells"][0][1][0][1].__setitem__(0, -1))
        with self.assertRaisesRegex(ValueError, "nonnegative"):
            verify(directory)

    def test_corridor_total_with_unknown_area_is_rejected(self):
        directory = self.copy("atlas-flood-corridors")

        def invent(catalogue):
            for origin in catalogue["origins"]:
                for row in origin["checkpoints"]:
                    for item in row["by_width"].values():
                        if item["unknown_area_km2"] > 0:
                            item["population_total"] = 1.0
                            return
            raise AssertionError("fixture needs a corridor with unknown area")
        self.rewrite(directory, "catalogue", invent)
        with self.assertRaisesRegex(ValueError, "unknown area"):
            verify(directory)

    def test_corridor_area_must_grow_with_width(self):
        directory = self.copy("atlas-flood-corridors")

        def shrink(catalogue):
            row = catalogue["origins"][0]["checkpoints"][0]["by_width"]
            row[str(catalogue["widths_m"][-1])]["area_km2"] = row[str(catalogue["widths_m"][0])]["area_km2"] / 2
        self.rewrite(directory, "catalogue", shrink)
        with self.assertRaisesRegex(ValueError, "monotonic"):
            verify(directory)

    def test_corridor_catalogue_keeps_unknown_population_null(self):
        manifest = json.loads((release("atlas-flood-corridors") / "manifest.json").read_bytes())
        raw = (release("atlas-flood-corridors") / "catalogue.json.gz").read_bytes()
        catalogue = json.loads(gzip.decompress(raw))
        self.assertEqual(manifest["summary"]["origins"], len(catalogue["origins"]))
        unknown = [item for o in catalogue["origins"] for row in o["checkpoints"] for item in row["by_width"].values() if item["unknown_area_km2"] > 0]
        self.assertTrue(unknown)
        self.assertTrue(all(item["population_total"] is None for item in unknown))

    def test_build_manifest_rejects_oversized_artifact(self):
        with self.assertRaisesRegex(ValueError, "8 MiB"):
            build_manifest("x", "1.0.0", "gmpe-model", {}, [], {"model": ("model.json", b"0" * (8 * 1024 * 1024 + 1), "application/json")}, {})


class GmpeTest(unittest.TestCase):
    def test_reference_cases_match(self):
        reference = json.loads((ROOT / "tests/fixtures/gmpe-bssa14-reference.json").read_text())
        self.assertGreater(len(reference["cases"]), 1000)
        for case in reference["cases"]:
            result = ground_motion(case["imt"], case["magnitude"], case["rjb_km"], case["vs30"], case["mechanism"])
            self.assertAlmostEqual(result["ln_median"], math.log(case["median"]), places=9)
            self.assertAlmostEqual(result["sigma"], case["sigma"], places=9)

    def test_refuses_to_extrapolate(self):
        for args in (("pga", 8.6, 10, 760), ("pga", 2.9, 10, 760), ("pga", 6, 401, 760), ("pga", 6, 10, 149),
                     ("pga", 6, 10, 1501), ("pga", 7.1, 10, 760, "normal"), ("pga", math.nan, 10, 760), ("sa", 6, 10, 760)):
            with self.assertRaises(ValueError):
                ground_motion(*args)
        self.assertEqual(DOMAIN["rjb_km"], [0.0, 400.0])

    def test_shaking_decreases_with_distance_and_grows_with_magnitude(self):
        near, far = ground_motion("pga", 7.0, 5, 760), ground_motion("pga", 7.0, 100, 760)
        self.assertGreater(near["median"], far["median"])
        self.assertGreater(ground_motion("pga", 7.5, 30, 760)["median"], ground_motion("pga", 6.5, 30, 760)["median"])


if __name__ == "__main__":
    unittest.main()
