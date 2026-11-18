"""Fetch the official Constitution of Nepal (Nepali text, Nepal Law Commission) for its Schedule 4,
which lists the districts of each province in Nepali. The file is found through the Commission's own
WordPress media search, so a moved upload is still found.

The government host does not always answer cloud servers abroad, so the same file is tried by three routes,
in order, and the route that worked is recorded:
  1. direct from the official URL;
  2. through GOV_PROXY, a proxy the owner controls on a network the host accepts (if set);
  3. the Internet Archive's stored copy of the same official URL (raw bytes, "id_" mode).
Whatever the route, the file must be a PDF whose text holds Schedule 4's district list; its SHA-256 is
recorded so a later run can be checked against it. Needs pdftotext (poppler-utils).
"""
import hashlib, json, os, re, subprocess, sys, tempfile, urllib.parse, urllib.request
from datetime import datetime, timezone
from pathlib import Path

SITE = "https://lawcommission.gov.np/np/"
TITLE = "नेपालको संविधान"
UA = "himalayan-disaster-atlas/1.0 (+https://github.com/prasidupadhya/Himalayan-Disaster-Atlas)"


def quoted(url):
    p = urllib.parse.urlsplit(url)
    return urllib.parse.urlunsplit(p._replace(path=urllib.parse.quote(p.path, safe="/%")))


def get(url, proxy=None, timeout=60):
    handlers = [urllib.request.ProxyHandler({"http": proxy, "https": proxy})] if proxy else []
    opener = urllib.request.build_opener(*handlers)
    with opener.open(urllib.request.Request(quoted(url), headers={"User-Agent": UA}), timeout=timeout) as r:
        return r.read(), r.geturl()


def candidates(proxy=None):
    """PDF uploads on the official site whose title names the constitution, newest first.
    WordPress answers its REST API at one of these addresses, depending on how the site is set up."""
    q = urllib.parse.urlencode({"search": TITLE, "media_type": "application", "per_page": 100, "orderby": "date", "order": "desc"})
    for base in (f"{SITE}wp-json/wp/v2/media?{q}", f"https://lawcommission.gov.np/wp-json/wp/v2/media?{q}", f"{SITE}?rest_route=/wp/v2/media&{q}"):
        try:
            items = json.loads(get(base, proxy)[0])
        except Exception as e:
            print(f"  media search {base.split('?')[0]}: {type(e).__name__}: {e}", file=sys.stderr)
            continue
        return [(i["source_url"], (i.get("title") or {}).get("rendered", "")) for i in items if str(i.get("source_url", "")).lower().endswith(".pdf")]
    return []


def archived():
    """The Internet Archive's stored copies of PDFs on any gov.np site whose address names the constitution, newest first."""
    q = urllib.parse.urlencode({"url": "gov.np", "matchType": "domain", "output": "json", "collapse": "digest", "fl": "timestamp,original,mimetype",
                                "filter": ["statuscode:200", "original:.*(%E0%A4%B8%E0%A4%82%E0%A4%B5%E0%A4%BF%E0%A4%A7%E0%A4%BE%E0%A4%A8|संविधान|[Cc]onstitution).*"],
                                "limit": 400}, doseq=True)
    rows = json.loads(get(f"https://web.archive.org/cdx/search/cdx?{q}", timeout=120)[0] or b"[]")[1:]
    hits = [r for r in rows if "pdf" in r[2].lower() or r[1].lower().endswith(".pdf")]
    return [(f"https://web.archive.org/web/{t}id_/{o}", urllib.parse.unquote(o)) for t, o, _ in sorted(hits, reverse=True)]


def schedule4(pdf):
    """The text of Schedule 4 if this PDF is the constitution, else None. Checked by content, not by file name."""
    with tempfile.NamedTemporaryFile(suffix=".pdf") as f:
        f.write(pdf); f.flush()
        text = subprocess.run(["pdftotext", "-layout", f.name, "-"], capture_output=True, text=True, timeout=120).stdout
    start = re.search(r"अनुसूची\s*[-–—]\s*४\s*\n?.{0,80}?जिल्ला", text, re.S)
    if not start or "प्रदेश" not in text[start.start():start.start() + 400]:
        return None
    end = re.search(r"अनुसूची\s*[-–—]\s*५", text[start.end():])
    return text[start.start(): start.end() + (end.start() if end else 6000)]


def routes():
    """(route, url, proxy) in the order they are tried."""
    proxy = os.environ.get("GOV_PROXY", "").strip() or None
    for name, via in [("direct", None)] + ([("gov-proxy", proxy)] if proxy else []):
        found = candidates(via)
        print(f"{name}: {len(found)} candidates", file=sys.stderr)
        for url, title in found:
            print(f"  {title} {url}", file=sys.stderr)
            yield name, url, via
    try:
        found = archived()
    except Exception as e:
        print(f"internet-archive: index failed: {type(e).__name__}: {e}", file=sys.stderr)
        return
    print(f"internet-archive: {len(found)} candidates", file=sys.stderr)
    for url, original in found:
        print(f"  {original}", file=sys.stderr)
    for url, _ in found:
        yield "internet-archive", url, None


def acquire(out):
    tried = []
    for name, url, proxy in routes():
        try:
            body, final = get(url, proxy)
        except Exception as e:  # report every route, then try the next
            tried.append({"route": name, "url": url, "error": f"{type(e).__name__}: {e}"[:300]})
            continue
        if not body.startswith(b"%PDF"):
            tried.append({"route": name, "url": url, "error": f"not a PDF ({len(body)} bytes)"})
            continue
        text = schedule4(body)
        if text is None:
            tried.append({"route": name, "url": url, "error": "PDF has no Schedule 4 district list"})
            continue
        out.mkdir(parents=True, exist_ok=True)
        (out / "constitution.pdf").write_bytes(body)
        (out / "schedule-4.txt").write_text(text, encoding="utf-8")
        official = url.split("id_/", 1)[1] if name == "internet-archive" else url
        record = {"official_url": official, "route": name, "fetched_from": final if name != "gov-proxy" else official,
                  "sha256": hashlib.sha256(body).hexdigest(), "bytes": len(body),
                  "retrieved_at": datetime.now(timezone.utc).isoformat(timespec="seconds"), "failed_routes": tried}
        (out / "acquisition.json").write_text(json.dumps(record, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
        return record
    raise SystemExit("no route returned the PDF: " + json.dumps(tried, ensure_ascii=False))


if __name__ == "__main__":
    print(json.dumps(acquire(Path(sys.argv[1] if len(sys.argv) > 1 else "build/place-names")), ensure_ascii=False, indent=1))
