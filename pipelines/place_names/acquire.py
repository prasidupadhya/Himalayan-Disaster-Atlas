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
A file is accepted only if its text holds the schedule; its SHA-256 is recorded. Needs pdftotext (poppler-utils).
"""
import hashlib, json, os, re, subprocess, sys, tempfile, urllib.parse, urllib.request
from datetime import datetime, timezone
from pathlib import Path

UA = "himalayan-disaster-atlas/1.0 (+https://github.com/prasidupadhya/Himalayan-Disaster-Atlas)"
SOURCES = {
    "ne": ["https://www.moljpa.gov.np/wp-content/uploads/2020/06/नेपालको-संविधान.pdf",
           "https://supremecourt.gov.np/court/public/assets/downloads/नेपालको_संविधान_२०७२.pdf",
           "https://www.moljpa.gov.np/wp-content/uploads/2018/02/नेपालको-संविधान-जारी-हुँदाको-पाठ.pdf"],
    "en": ["https://www.moljpa.gov.np/wp-content/uploads/2021/01/Constitution-of-Nepal-2nd-amd.-English.pdf",
           "https://www.moljpa.gov.np/en/wp-content/uploads/2021/04/Constitution-of-Nepal-Revised-and-re-edited-English-version-as-amended.pdf",
           "https://www.lawcommission.gov.np/en/wp-content/uploads/2021/01/Constitution-of-Nepal.pdf"],
}
# Where the schedule starts and ends in each language, and a word that must appear right after its heading.
MARKS = {"ne": (r"अनुसूची\s*[-–—]?\s*४", r"अनुसूची\s*[-–—]?\s*५", "जिल्ला"),
         "en": (r"Schedule\s*[-–—]?\s*4\b", r"Schedule\s*[-–—]?\s*5\b", "istrict")}


def quoted(url):
    p = urllib.parse.urlsplit(url)
    return urllib.parse.urlunsplit(p._replace(path=urllib.parse.quote(p.path, safe="/%")))


def get(url, proxy=None, timeout=60):
    handlers = [urllib.request.ProxyHandler({"http": proxy, "https": proxy})] if proxy else []
    with urllib.request.build_opener(*handlers).open(urllib.request.Request(quoted(url), headers={"User-Agent": UA}), timeout=timeout) as r:
        return r.read(), r.geturl()


def text_of(pdf):
    with tempfile.NamedTemporaryFile(suffix=".pdf") as f:
        f.write(pdf); f.flush()
        return subprocess.run(["pdftotext", "-layout", f.name, "-"], capture_output=True, text=True, timeout=120).stdout


def schedule(text, lang):
    """The schedule's text, or None. Of every heading match, the one followed by the word for district is taken."""
    start, end, word = MARKS[lang]
    for m in re.finditer(start, text):
        if word in text[m.end(): m.end() + 800]:
            stop = re.search(end, text[m.end():])
            return text[m.start(): m.end() + (stop.start() if stop else 8000)]
    return None


def diagnose(text, lang):
    deva = sum("ऀ" <= ch <= "ॿ" for ch in text)
    heads = [text[m.start(): m.start() + 120].replace("\n", " ") for m in re.finditer(r"अनुसूची|Schedule", text)][:6]
    return f"{len(text)} chars, {deva} Devanagari; headings: {heads}"


def routes(url):
    yield "direct", url, None
    if os.environ.get("GOV_PROXY", "").strip():
        yield "gov-proxy", url, os.environ["GOV_PROXY"].strip()
    yield "internet-archive", f"https://web.archive.org/web/2026id_/{url}", None


def acquire(lang, out):
    tried = []
    for official in SOURCES[lang]:
        for route, url, proxy in routes(official):
            try:
                body, final = get(url, proxy)
            except Exception as e:
                tried.append({"route": route, "url": official, "error": f"{type(e).__name__}: {e}"[:200]})
                continue
            if not body.startswith(b"%PDF"):
                tried.append({"route": route, "url": official, "error": f"not a PDF ({len(body)} bytes)"})
                continue
            text = text_of(body)
            part = schedule(text, lang)
            if part is None:
                tried.append({"route": route, "url": official, "error": "no schedule found: " + diagnose(text, lang)})
                continue
            out.mkdir(parents=True, exist_ok=True)
            (out / f"constitution-{lang}.pdf").write_bytes(body)
            (out / f"schedule-4-{lang}.txt").write_text(part, encoding="utf-8")
            return {"lang": lang, "official_url": official, "route": route, "fetched_from": final if route != "gov-proxy" else official,
                    "sha256": hashlib.sha256(body).hexdigest(), "bytes": len(body),
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
