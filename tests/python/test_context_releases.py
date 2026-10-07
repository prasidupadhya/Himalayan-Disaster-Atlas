import json
import math
import shutil
import tempfile
import unittest
from pathlib import Path

from pipelines.atlas_pipeline.contracts import ROOT
from pipelines.atlas_pipeline.model_release import digest, encode, gzip_bytes, verify
from pipelines.atlas_pipeline.model_releases import verify_model_release
from pipelines.atlas_pipeline.power_context import (
    SPI_CLASSES,
    gamma_fit,
    gammainc,
    norm_ppf,
    spi,
    spi_class,
)

RELEASES = {"nepal-power-gridded-context": "1.0.0", "nepal-terrain-steepness": "1.0.0", "atlas-public-evidence": "1.0.0"}


class SpiMathTest(unittest.TestCase):
    def test_matches_independent_scipy_reference(self):
        reference = json.loads((ROOT / "tests/fixtures/spi-reference.json").read_text())
        for case in reference["gammainc"]:
            self.assertAlmostEqual(gammainc(case["a"], case["x"]), case["P"], places=12)
        for case in reference["norm_ppf"]:
            self.assertAlmostEqual(norm_ppf(case["p"]), case["z"], places=9)

    def test_gamma_fit_recovers_shape_and_handles_zeros(self):
        alpha, beta, q = gamma_fit([0, 0, 0] + [10.0 * (1 + k % 7) for k in range(27)])
        self.assertAlmostEqual(q, 0.1)
        self.assertGreater(alpha, 0)
        self.assertAlmostEqual(alpha * beta, sum(10.0 * (1 + k % 7) for k in range(27)) / 27, places=6)
        with self.assertRaises(ValueError):
            gamma_fit([0] * 25 + [1, 2, 3, 4, 5])

    def test_spi_is_monotone_and_bounded(self):
        values = [spi(x, 2.0, 50.0, 0.05) for x in (0, 10, 50, 100, 200, 400, 10_000)]
        self.assertEqual(values, sorted(values))
        self.assertTrue(all(abs(v) < 4.8 for v in values))
        self.assertAlmostEqual(spi(0, 2.0, 50.0, 0.5), 0.0, places=9)

    def test_mckee_classes_partition_the_line(self):
        self.assertEqual([spi_class(v) for v in (-3, -2, -1.5, -1, 0, 0.999, 1, 1.5, 2, 3)],
                         ["extremely-dry", "severely-dry", "moderately-dry", "near-normal", "near-normal", "near-normal",
                          "moderately-wet", "severely-wet", "extremely-wet", "extremely-wet"])
        self.assertEqual(len(SPI_CLASSES), 7)


class ContextReleaseTest(unittest.TestCase):
    def setUp(self):
        self.tmp = Path(tempfile.mkdtemp())

    def tearDown(self):
        shutil.rmtree(self.tmp)

    def rewrite(self, directory, name, transform):
        """Re-encode one artifact and re-pin it, so only the semantic verifier can object."""
        import gzip
        manifest = json.loads((directory / "manifest.json").read_bytes())
        entry = manifest["artifacts"][name]
        path = directory / Path(entry["path"]).name
        value = json.loads(gzip.decompress(path.read_bytes()))
        transform(value)
        raw = gzip_bytes(encode(value))
        path.write_bytes(raw)
        entry.update(sha256=digest(raw), byte_size=len(raw))
        (directory / "manifest.json").write_bytes(encode(manifest))

    def copy(self, identifier):
        target = self.tmp / identifier / RELEASES[identifier]
        shutil.copytree(ROOT / "data/releases" / identifier / RELEASES[identifier], target)
        return target

    def test_checked_in_context_releases_verify_with_public_mirrors(self):
        for identifier, version in RELEASES.items():
            manifest = verify_model_release(ROOT / "data/releases" / identifier / version, ROOT / "apps/web/public/data" / identifier / version)
            self.assertEqual(manifest["metadata"]["dataset_id"], identifier)

    def test_climate_snapshot_is_periodic_with_a_staleness_deadline(self):
        manifest = json.loads((ROOT / "data/releases/nepal-power-gridded-context/1.0.0/manifest.json").read_text())
        self.assertEqual(manifest["metadata"]["update_frequency"], "periodic")
        self.assertTrue(manifest["metadata"]["stale_after"].startswith("2026-11-01"))
        self.assertEqual(manifest["summary"]["latest_month"], "2026-08")

    def test_tampered_spi_value_is_rejected(self):
        directory = self.copy("nepal-power-gridded-context")
        self.rewrite(directory, "context", lambda c: c["cells"][0]["recent"][-1].update(spi3=c["cells"][0]["recent"][-1]["spi3"] + 0.5))
        with self.assertRaisesRegex(ValueError, "SPI value is not reproducible"):
            verify(directory)

    def test_fit_must_be_reproducible_from_the_baseline(self):
        directory = self.copy("nepal-power-gridded-context")
        self.rewrite(directory, "context", lambda c: c["cells"][3]["baseline_precip_3mo_mm"][6].__setitem__(0, 9999.0))
        with self.assertRaisesRegex(ValueError, "gamma fit"):
            verify(directory)

    def test_physical_bounds_are_enforced(self):
        directory = self.copy("nepal-power-gridded-context")
        self.rewrite(directory, "context", lambda c: c["cells"][0]["recent"][0].update(snow_cover_fraction=1.5))
        with self.assertRaisesRegex(ValueError, "Physical bounds"):
            verify(directory)

    def test_slope_shares_must_partition_each_district(self):
        directory = self.copy("nepal-terrain-steepness")
        self.rewrite(directory, "steepness", lambda t: t["districts"][0]["slope_class_share"].update({"45+": 0.5}))
        with self.assertRaisesRegex(ValueError, "partition"):
            verify(directory)

    def test_terrain_covers_all_77_districts_and_about_30_percent_is_steep(self):
        import gzip
        raw = (ROOT / "data/releases/nepal-terrain-steepness/1.0.0/steepness.json.gz").read_bytes()
        t = json.loads(gzip.decompress(raw))
        self.assertEqual(len({d["district_id"] for d in t["districts"]}), 77)
        share = t["national_slope_class_share"]
        self.assertTrue(0.25 < share["30-45"] + share["45+"] < 0.35)
        self.assertTrue(all(math.isfinite(d["slope_mean_deg"]) for d in t["districts"]))

    def test_evidence_passages_are_verbatim(self):
        directory = self.copy("atlas-public-evidence")

        def edit(corpus):
            chunk = next(c for c in corpus["chunks"] if "start_line" in c and c["source"] == "flood-corridors")
            chunk["text"] = chunk["text"].replace("not", "")
        self.rewrite(directory, "corpus", edit)
        doc = json.loads((directory / "manifest.json").read_text())
        pinned = {i["dataset_id"]: i["sha256"] for i in doc["inputs"]}
        if pinned.get("atlas-doc-flood-corridors") is None:
            self.skipTest("flood-corridors not in corpus")
        if digest((ROOT / "docs/flood-corridors.md").read_bytes()) != pinned["atlas-doc-flood-corridors"]:
            self.skipTest("working document changed after the corpus snapshot")
        with self.assertRaisesRegex(ValueError, "verbatim"):
            verify(directory)


if __name__ == "__main__":
    unittest.main()
