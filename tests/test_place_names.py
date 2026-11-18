"""Nepali district names: the Schedule 4 parser, and the published release checked against its own sources.

Run with: python -m unittest tests.test_place_names
"""
import gzip, hashlib, json, sys, unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "pipelines/place_names"))
import build  # noqa: E402

RELEASE = ROOT / "site/data" / build.DATASET / build.VERSION
SOURCES = ROOT / "data/place-names"
DISTRICTS = json.loads(gzip.decompress(build.DISTRICTS.read_bytes()))["features"]

# The layout pdftotext gives the schedule: columns per province, numbers set apart, qualifiers wrapped onto the next line.
LAYOUT = """
    Province No. 5      Province No. 6   Province No. 7

1.Nawalparasi (West of 1.Rukum           1.Bajura
Bardaghat Susta)       (Western Part)    2.Bajhang
2. Rupandehi            2. Salyan        3. Doti
7. Rukun (Eastern Part) 7. Kalikot       8. Kanchanpur

                         (247)
"""


class ParserTests(unittest.TestCase):
    def test_columns_numbers_and_wrapped_qualifiers(self):
        got = build.parse(LAYOUT, "en")
        self.assertEqual(got[5], ["Nawalparasi (West of Bardaghat Susta)", "Rupandehi", "Rukun (Eastern Part)"])
        self.assertEqual(got[6], ["Rukum (Western Part)", "Salyan", "Kalikot"])
        self.assertEqual(got[7], ["Bajura", "Bajhang", "Doti", "Kanchanpur"])

    def test_a_chunk_that_belongs_nowhere_is_an_error_not_a_guess(self):
        with self.assertRaises(ValueError):
            build.parse("    Province No. 1\n1. Taplejung\nstray words\n", "en")


@unittest.skipUnless(RELEASE.exists(), "release not built yet")
class ReleaseTests(unittest.TestCase):
    def setUp(self):
        self.body = (RELEASE / "names.json").read_bytes()
        self.rows = json.loads(self.body)["districts"]
        self.manifest = json.loads((RELEASE / "manifest.json").read_text(encoding="utf-8"))

    def test_checksum_matches_manifest(self):
        art = self.manifest["artifact"]
        self.assertEqual(art["sha256"], hashlib.sha256(self.body).hexdigest())
        self.assertEqual(art["byte_size"], len(self.body))

    def test_every_pcode_once_with_a_devanagari_name(self):
        pcodes = sorted(f["properties"]["pcode"] for f in DISTRICTS)
        self.assertEqual(sorted(r["pcode"] for r in self.rows), pcodes)
        for r in self.rows:
            self.assertRegex(r["name_ne"], r"^[ऀ-ॿ‌‍ ()]+$", r["pcode"])
            self.assertEqual(r["province_no"], int(r["pcode"][2:4]), r["pcode"])

    def test_rebuilds_from_the_stored_official_text(self):
        texts = {lang: (SOURCES / f"schedule-4-{lang}.txt").read_text(encoding="utf-8") for lang in ("ne", "en")}
        rows = build.pair(build.parse(texts["ne"], "ne"), build.parse(texts["en"], "en"), DISTRICTS)
        self.assertEqual(rows, self.rows)

    def test_schedule_positions_run_one_to_n_in_each_province(self):
        counts = {1: 14, 2: 8, 3: 13, 4: 11, 5: 12, 6: 10, 7: 9}
        for n, count in counts.items():
            self.assertEqual(sorted(r["schedule_position"] for r in self.rows if r["province_no"] == n), list(range(1, count + 1)))


if __name__ == "__main__":
    unittest.main()
