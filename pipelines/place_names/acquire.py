"""Fetch Schedule 4 of the Constitution of Nepal ("Provinces and districts in each province") in Nepali and in English.

Both texts are official: the Nepali constitution and its English version as published by the Ministry of Law, Justice
and Parliamentary Affairs (MoLJPA), with the Supreme Court's copy of the Nepali text as a second source. The two lists
name the same districts in the same order, so pairing them gives each Nepali name its English name without anyone
transliterating anything; the English name then finds the district's P-code in the boundary release.

Government hosts do not always answer cloud servers abroad, so each file is tried by three routes, in order, and the
route that worked is recorded:
  1. direct from the official URL;
  2. through GOV_PROXY, a proxy the owner controls on a network the host accepts (if set);
  3. the Internet Archive's stored copy of the same official URL (raw bytes, "id_" mode).
A file is accepted only if its text holds the schedule; its SHA-256 is recorded. Needs pdftotext (poppler-utils)
and, for the Preeti-font Nepali text, npttf2utf (pipelines/place_names/requirements.txt).
"""
import hashlib, json, os, re, subprocess, sys, tempfile, time, urllib.parse, urllib.request
from datetime import datetime, timezone
from pathlib import Path

UA = "himalayan-disaster-atlas/1.0 (+https://github.com/prasidupadhya/Himalayan-Disaster-Atlas)"
# Each source: the official URL and an Internet Archive capture of exactly that URL (timestamp from its index).
SOURCES = {
    "ne": [("http://www.moljpa.gov.np/wp-content/uploads/2020/06/नेपालको-संविधान.pdf", "20250117083916"),
           ("http://www.moljpa.gov.np/wp-content/uploads/2020/06/नेपालको-संविधान-दोस्रो-संशोधन-२०७७.pdf", "20211117075003"),
           ("https://supremecourt.gov.np/court/public/assets/downloads/नेपालको_संविधान_२०७२.pdf", "20220302170403")],
    "en": [("https://www.moljpa.gov.np/wp-content/uploads/2021/01/Constitution-of-Nepal-2nd-amd.-English.pdf", "20240616183854"),
           ("https://www.moljpa.gov.np/en/wp-content/uploads/2021/04/Constitution-of-Nepal-Revised-and-re-edited-English-version-as-amended.pdf", "20240520152216"),
           ("https://www.lawcommission.gov.np/en/wp-content/uploads/2021/01/Constitution-of-Nepal.pdf", "20240422170544")],
}
# Where the schedule starts and ends in each language, and a word that must appear right after its heading.
MARKS = {"ne": (r"अनुसूची\s*[-–—]?\s*४", r"अनुसूची\s*[-–—]?\s*५", "प्रदेश"),
         "en": (r"Schedule\s*[-–—]?\s*4\b", r"Schedule\s*[-–—]?\s*5\b", "Province")}


def quoted(url):
    p = urllib.parse.urlsplit(url)
    return urllib.parse.urlunsplit(p._replace(path=urllib.parse.quote(p.path, safe="/%")))


def get(url, proxy=None, timeout=60):
    handlers = [urllib.request.ProxyHandler({"http": proxy, "https": proxy})] if proxy else []
    with urllib.request.build_opener(*handlers).open(urllib.request.Request(quoted(url), headers={"User-Agent": UA}), timeout=timeout) as r:
        return r.read(), r.geturl()


def fetch(route, url, proxy):
    """The archive refuses bursts of requests: its captures are paced and retried."""
    if route != "internet-archive":
        return get(url, proxy)
    for wait in (3, 10, 30):
        time.sleep(wait)
        try:
            return get(url, timeout=90)
        except OSError as e:
            if "refused" not in str(e) and "timed out" not in str(e):
                raise
    return get(url, timeout=90)


def text_of(pdf):
    with tempfile.NamedTemporaryFile(suffix=".pdf") as f:
        f.write(pdf); f.flush()
        return subprocess.run(["pdftotext", "-layout", f.name, "-"], capture_output=True, text=True, timeout=120).stdout


def schedule(text, lang):
    """The schedule's text, or None. The schedule itself is the last heading followed closely by the word for province;
    earlier matches are articles that mention it."""
    start, end, word = MARKS[lang]
    for m in reversed(list(re.finditer(start, text))):
        if word in text[m.end(): m.end() + 300]:
            stop = re.search(end, text[m.end():])
            return text[m.start(): m.end() + (stop.start() if stop else 8000)]
    return None


def unicode_text(text):
    """Text as Unicode Devanagari. Some official PDFs are set in the legacy Preeti font, whose text layer stores
    Devanagari as ASCII; npttf2utf maps that font back to Unicode letter for letter (no transliteration)."""
    if sum("\u0900" <= ch <= "\u097f" for ch in text) > len(text) / 20 or "g]kfn" not in text:
        return text, None
    from npttf2utf.base.fontmapper import FontMapper
    import npttf2utf
    rules = Path(npttf2utf.__file__).with_name("map.json")
    return FontMapper(str(rules)).map_to_unicode(text, from_font="Preeti"), "Preeti, converted with npttf2utf 0.3.7"


def diagnose(text, lang):
    deva = sum("ऀ" <= ch <= "ॿ" for ch in text)
    heads = [text[m.start(): m.start() + 120].replace("\n", " ") for m in re.finditer(r"अनुसूची|Schedule", text)][:6]
    sample = re.sub(r"\s+", " ", text[2000:2200])
    return f"{len(text)} chars, {deva} Devanagari; headings: {heads}; sample: {sample!r}"


def routes(url, stamp):
    yield "direct", url, None
    if os.environ.get("GOV_PROXY", "").strip():
        yield "gov-proxy", url, os.environ["GOV_PROXY"].strip()
    yield "internet-archive", f"https://web.archive.org/web/{stamp}id_/{url}", None


def acquire(lang, out):
    tried = []
    for official, stamp in SOURCES[lang]:
        for route, url, proxy in routes(official, stamp):
            try:
                body, final = fetch(route, url, proxy)
            except Exception as e:
                tried.append({"route": route, "url": official, "error": f"{type(e).__name__}: {e}"[:200]})
                continue
            if not body.startswith(b"%PDF"):
                tried.append({"route": route, "url": official, "error": f"not a PDF ({len(body)} bytes)"})
                continue
            text, font = unicode_text(text_of(body)) if lang == "ne" else (text_of(body), None)
            part = schedule(text, lang)
            if part is None:
                tried.append({"route": route, "url": official, "error": "no schedule found: " + diagnose(text, lang)})
                continue
            out.mkdir(parents=True, exist_ok=True)
            (out / f"constitution-{lang}.pdf").write_bytes(body)
            (out / f"schedule-4-{lang}.txt").write_text(part, encoding="utf-8")
            return {"lang": lang, "official_url": official, "route": route, "fetched_from": final if route != "gov-proxy" else official,
                    "sha256": hashlib.sha256(body).hexdigest(), "bytes": len(body), "legacy_font": font,
                    "retrieved_at": datetime.now(timezone.utc).isoformat(timespec="seconds"), "failed_routes": tried}
    print(json.dumps(tried, ensure_ascii=False, indent=1), file=sys.stderr)
    return None


if __name__ == "__main__":
    out = Path(sys.argv[1] if len(sys.argv) > 1 else "build/place-names")
    records = [acquire(lang, out) for lang in ("ne", "en")]
    print(json.dumps(records, ensure_ascii=False, indent=1))
    if None in records:
        raise SystemExit("a schedule could not be fetched")
    (out / "acquisition.json").write_text(json.dumps(records, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
