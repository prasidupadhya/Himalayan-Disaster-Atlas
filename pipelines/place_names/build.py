"""Build the Nepali district-name release from the two official Schedule 4 texts fetched by acquire.py.

Schedule 4 of the Constitution of Nepal lists the districts of each province, numbered, in the same order in the Nepali
text and in its official English version. Each Nepali name is paired with the English name at the same province and
position; the English name then finds the district's P-code in the COD-AB boundary release (nepal-admin-districts),
by its name or alias, within the same province. A handful of English spellings differ between the schedule and the
boundary release; they are listed in SPELLINGS, each by hand and in the open. No Nepali name is typed or transliterated
here: every one comes from the official text.

The build refuses to write anything unless all 77 districts pair and match one to one.
"""
import gzip, hashlib, json, re, sys, unicodedata
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
DISTRICTS = ROOT / "site/data/nepal-admin-districts/2.0.1/features.geojson.gz"
DATASET, VERSION = "nepal-district-names-ne", "1.0.0"

# Schedule 4 (English) spelling -> boundary-release name, where the two differ and no alias covers it.
SPELLINGS = {
    "Makawanpur": "Makwanpur",
    "Nawalparasi (East of Bardaghat Susta)": "Nawalpur",
    "Rukun (Eastern Part)": "Rukum East",   # the official English text prints "Rukun"
    "Rukum (Western Part)": "Rukum West",
    "Daang": "Dang",
}
DEVANAGARI_DIGITS = "०१२३४५६७८९"
HEADER = {"en": re.compile(r"Province\s+No\.\s*(\d)"), "ne": re.compile(r"प्रदेश\s+नं\.\s*([१-७])")}
# An item number: Arabic digits in English; in the converted Nepali text the numerals come out as short garbled
# letter groups (the PDF sets them in another font), so any short token ending in "." or "।" counts.
MARKER = {"en": re.compile(r"(?:(?<=\s)|^)\d{1,2}\.\s*"), "ne": re.compile(r"(?:(?<=\s)|^)[^\s().।]{1,6}[.।]\s*")}
PAGE_NUMBER = {"en": re.compile(r"^\(\d+\)$"), "ne": re.compile(r"^[^\s().।]{1,6}$")}


def province_number(token):
    return int(token) if token.isdigit() else DEVANAGARI_DIGITS.index(token)


def parse(text, lang):
    """{province number: [district names in order]} from a pdftotext -layout rendering of the schedule.

    The schedule is printed in two or three columns per page. Each line is cut into chunks at runs of two or more
    spaces and at item numbers; a chunk belongs to the column whose header starts nearest to it. Within a column,
    a chunk that starts with an item number opens a new district; a chunk without one continues the previous district
    only while that name has an open parenthesis or the chunk starts with one (a qualifier wrapped onto the next line)."""
    provinces, columns = {}, []
    for raw in text.replace("\f", "\n").split("\n"):
        # An item number set apart from its name by several spaces stays with it (offsets shift by a few characters).
        line = MARKER[lang].sub(lambda m: m.group().rstrip() + " ", raw.rstrip())
        heads = [(m.start(), province_number(m.group(1))) for m in HEADER[lang].finditer(line)]
        if heads:
            columns = heads
            for _, n in heads:
                provinces.setdefault(n, [])
            continue
        if not columns:
            continue
        chunks = []
        for m in re.finditer(r"\S+(?: \S+)*", line):
            # A single space may separate the end of one column from the next item number: cut there too.
            starts = [s.start() for s in MARKER[lang].finditer(m.group())] or [0]
            bounds = sorted({0, *starts}) + [len(m.group())]
            chunks += [(m.start() + a, m.group()[a:b].strip()) for a, b in zip(bounds, bounds[1:]) if m.group()[a:b].strip()]
        for offset, chunk in chunks:
            if PAGE_NUMBER[lang].match(chunk) and not MARKER[lang].match(chunk):
                continue
            n = min(columns, key=lambda c: abs(c[0] - offset))[1]
            names = provinces[n]
            marker = MARKER[lang].match(chunk)
            if marker:
                names.append(chunk[marker.end():].strip())
            elif names and (names[-1].count("(") > names[-1].count(")") or chunk.startswith("(")):
                names[-1] += " " + chunk
            else:
                raise ValueError(f"{lang}: cannot place {chunk!r} in province {n}")
    return {n: [re.sub(r"\s+", " ", re.sub(r"\(\s+", "(", re.sub(r"\s+\)", ")", name))) for name in names] for n, names in provinces.items()}


def fold(name):
    return re.sub(r"[^a-z]", "", unicodedata.normalize("NFKD", name).lower())


def pair(ne, en, districts):
    """One row per district: the schedule's Nepali and English names, its position, and the boundary release's P-code."""
    if sorted(ne) != sorted(en) or sorted(ne) != list(range(1, 8)):
        raise ValueError(f"provinces differ: ne {sorted(ne)}, en {sorted(en)}")
    by_province = {}
    for f in districts:
        p = f["properties"]
        by_province.setdefault(int(p["parent_pcode"][2:]), []).append(p)
    rows, used = [], set()
    for n in range(1, 8):
        if len(ne[n]) != len(en[n]):
            raise ValueError(f"province {n}: {len(ne[n])} Nepali names, {len(en[n])} English names")
        for i, (name_ne, name_en) in enumerate(zip(ne[n], en[n]), 1):
            want = fold(SPELLINGS.get(name_en, name_en))
            hits = [p for p in by_province[n] if want in {fold(p["name"]), *map(fold, p.get("aliases") or [])}]
            if len(hits) != 1:
                raise ValueError(f"province {n}: {name_en!r} matches {len(hits)} districts")
            pcode = hits[0]["pcode"]
            if pcode in used:
                raise ValueError(f"{pcode} matched twice")
            used.add(pcode)
            if not re.fullmatch(r"[ऀ-ॿ‌‍ ()]+", name_ne):
                raise ValueError(f"province {n} item {i}: not a clean Devanagari name: {name_ne!r}")
            rows.append({"pcode": pcode, "name_ne": name_ne, "schedule_name_en": name_en, "district_name_en": hits[0]["name"],
                         "province_no": n, "schedule_position": i})
    if len(rows) != 77 or len(used) != len({p["properties"]["pcode"] for p in districts}):
        raise ValueError(f"{len(rows)} rows for {len(districts)} districts")
    return sorted(rows, key=lambda r: r["pcode"])


def release(rows, acquisition, out):
    """Write the immutable release folder: names.json and its manifest with the artifact checksum."""
    folder = out / DATASET / VERSION
    if folder.exists():
        raise SystemExit(f"{folder} exists: releases are immutable; bump the version instead")
    folder.mkdir(parents=True)
    body = (json.dumps({"format": "atlas-district-names@1", "districts": rows}, ensure_ascii=False, indent=1) + "\n").encode("utf-8")
    (folder / "names.json").write_bytes(body)
    ne, en = (next(a for a in acquisition if a["lang"] == lang) for lang in ("ne", "en"))
    now = datetime.now(timezone.utc).isoformat(timespec="seconds")
    manifest = {
        "schema_version": "1.0.0", "dataset_id": DATASET, "dataset_name": "Nepal district names in Nepali (Constitution of Nepal, Schedule 4)",
        "dataset_version": VERSION,
        "source": "Constitution of Nepal, Schedule 4 (Provinces and districts in each province): Nepali text as published by the "
                  "Supreme Court of Nepal; official English version as published by the Ministry of Law, Justice and Parliamentary Affairs",
        "source_url": ne["official_url"], "source_url_en": en["official_url"],
        "license": "Government of Nepal legal text; the constitution is a public law document",
        "license_url": None,
        "attribution": "Constitution of Nepal 2015 (2072 BS), Schedule 4. Supreme Court of Nepal; Ministry of Law, Justice and Parliamentary Affairs.",
        "observation_date": None, "publication_date": "2015-09-20T00:00:00Z",
        "retrieval_date": max(ne["retrieved_at"], en["retrieved_at"]), "processing_date": now,
        "processing_version": "place-names-pipeline-1.0.0",
        "method": f"Nepali source PDF SHA-256 {ne['sha256']} (route: {ne['route']}); its text layer is in the legacy Preeti font and was "
                  f"mapped to Unicode with npttf2utf 0.3.7. English source PDF SHA-256 {en['sha256']} (route: {en['route']}, "
                  f"fetched from {en['fetched_from']}). Both schedules were parsed from pdftotext -layout output. Each Nepali name is "
                  "paired with the English name at the same province and position, and the English name is matched to a COD-AB P-code "
                  "(nepal-admin-districts 2.0.1) by name or alias within the same province; five English spellings are mapped by an "
                  f"explicit table: {json.dumps(SPELLINGS)}. Nothing is transliterated.",
        "spatial_resolution": {"value": None, "unit": None}, "temporal_resolution": None,
        "spatial_coverage": {"description": "The 77 districts of Nepal", "bbox": [80.05, 26.34, 88.21, 30.45]},
        "temporal_coverage": {"start": "2015-09-20T00:00:00Z", "end": None}, "crs": None,
        "status": "VERIFIED_SOURCE", "evidence_type": "observed", "is_fixture": False,
        "limitations": [
            "Names are as printed in Schedule 4, including its qualifiers (for example for the two Nawalparasi and the two Rukum districts).",
            "The Nepali text layer was converted from the Preeti font; the conversion is letter for letter, and every name is checked to be clean Devanagari.",
            "Schedule 4 numbers provinces 1 to 7; province names adopted later are not part of it.",
        ],
        "uncertainty": "None in the names themselves; a district renamed by a later amendment would need a new release.",
        "update_frequency": "on amendment", "stale_after": None,
        "artifact": {"path": f"/data/{DATASET}/{VERSION}/names.json", "format": "JSON", "sha256": hashlib.sha256(body).hexdigest(), "byte_size": len(body)},
    }
    (folder / "manifest.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    return folder


def main(src, site_data, sources_out):
    texts = {lang: (src / f"schedule-4-{lang}.txt").read_text(encoding="utf-8") for lang in ("ne", "en")}
    acquisition = json.loads((src / "acquisition.json").read_text(encoding="utf-8"))
    districts = json.loads(gzip.decompress(DISTRICTS.read_bytes()))["features"]
    rows = pair(parse(texts["ne"], "ne"), parse(texts["en"], "en"), districts)
    folder = release(rows, acquisition, site_data)
    # The extracted schedules and the acquisition record stay beside the pipeline, so the build can be rerun and tested offline.
    sources_out.mkdir(parents=True, exist_ok=True)
    for lang, text in texts.items():
        (sources_out / f"schedule-4-{lang}.txt").write_text(text, encoding="utf-8")
    (sources_out / "acquisition.json").write_text(json.dumps(acquisition, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    for r in rows:
        print(r["pcode"], r["province_no"], r["schedule_position"], r["name_ne"], "|", r["schedule_name_en"], "->", r["district_name_en"])
    print(f"wrote {folder}")


def check(src):
    """Rebuild from freshly fetched sources and compare the names with the published release; raises on any difference."""
    texts = {lang: (src / f"schedule-4-{lang}.txt").read_text(encoding="utf-8") for lang in ("ne", "en")}
    districts = json.loads(gzip.decompress(DISTRICTS.read_bytes()))["features"]
    rows = pair(parse(texts["ne"], "ne"), parse(texts["en"], "en"), districts)
    published = json.loads((ROOT / "site/data" / DATASET / VERSION / "names.json").read_text(encoding="utf-8"))["districts"]
    if rows != published:
        changed = [(a["pcode"], a["name_ne"], b["name_ne"]) for a, b in zip(published, rows) if a != b]
        raise SystemExit(f"the official schedule no longer matches release {VERSION}: {changed or 'row count differs'}")
    print(f"{len(rows)} districts match release {VERSION}")


if __name__ == "__main__":
    if sys.argv[1:2] == ["--check"]:
        check(Path(sys.argv[2]))
    else:
        main(Path(sys.argv[1]), ROOT / "site/data", ROOT / "data/place-names")
