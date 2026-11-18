"""Fetch the official Constitution of Nepal (Nepali text, Nepal Law Commission) for its Schedule 4,
which lists the districts of each province in Nepali. The file is found through the Commission's own
WordPress media search, so a moved upload is still found.

The government host does not always answer cloud servers abroad, so the same file is tried by three routes,
in order, and the route that worked is recorded:
  1. direct from the official URL;
  2. through GOV_PROXY, a proxy the owner controls on a network the host accepts (if set);
  3. the Internet Archive's stored copy of the same official URL (raw bytes, "id_" mode).
Whatever the route, the file must be a PDF; its SHA-256 is recorded so a later run can be checked against it.
"""
import hashlib, json, os, sys, urllib.parse, urllib.request
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
    """PDF uploads on the official site whose title names the constitution, newest first."""
    q = urllib.parse.urlencode({"search": TITLE, "media_type": "application", "per_page": 50, "orderby": "date", "order": "desc"})
    body, _ = get(f"{SITE}wp-json/wp/v2/media?{q}", proxy)
    items = json.loads(body)
    return [(i.get("source_url"), (i.get("title") or {}).get("rendered", ""), i.get("date")) for i in items
            if str(i.get("source_url", "")).lower().endswith(".pdf")]


def archived():
    """The Internet Archive's stored copies of PDFs on the official site whose address names the constitution."""
    q = urllib.parse.urlencode({"url": "lawcommission.gov.np/np/wp-content/uploads/*", "output": "json", "filter": "statuscode:200",
                                "collapse": "digest", "fl": "timestamp,original,mimetype"})
    rows = json.loads(get(f"https://web.archive.org/cdx/search/cdx?{q}", timeout=90)[0] or b"[]")[1:]
    hits = [r for r in rows if "pdf" in r[2] and "संविधान" in urllib.parse.unquote(r[1])]
    return [(f"https://web.archive.org/web/{t}id_/{o}", urllib.parse.unquote(o), t) for t, o, _ in sorted(hits, reverse=True)]


def routes():
    """(route, url, proxy, title) in the order they are tried."""
    proxy = os.environ.get("GOV_PROXY", "").strip() or None
    for name, via in [("direct", None)] + ([("gov-proxy", proxy)] if proxy else []):
        try:
            found = candidates(via)
        except Exception as e:
            print(f"{name}: media search failed: {type(e).__name__}: {e}", file=sys.stderr)
            continue
        print(f"{name}: {len(found)} candidates", file=sys.stderr)
        for url, title, date in found:
            print(f"  {date} {title} {url}", file=sys.stderr)
            yield name, url, via
    try:
        for url, original, t in archived():
            print(f"internet-archive: {t} {original}", file=sys.stderr)
            yield "internet-archive", url, None
    except Exception as e:
        print(f"internet-archive: index failed: {type(e).__name__}: {e}", file=sys.stderr)


def acquire(out):
    tried = []
    for name, url, proxy in routes():
        try:
            body, final = get(url, proxy)
        except Exception as e:  # report every route, then try the next
            tried.append({"route": name, "error": f"{type(e).__name__}: {e}"[:300]})
            continue
        if not body.startswith(b"%PDF"):
            tried.append({"route": name, "error": f"not a PDF ({len(body)} bytes)"})
            continue
        out.mkdir(parents=True, exist_ok=True)
        (out / "constitution.pdf").write_bytes(body)
        official = url.split("id_/", 1)[1] if name == "internet-archive" else url
        record = {"official_url": official, "route": name, "fetched_from": final if name != "gov-proxy" else official,
                  "sha256": hashlib.sha256(body).hexdigest(), "bytes": len(body),
                  "retrieved_at": datetime.now(timezone.utc).isoformat(timespec="seconds"), "failed_routes": tried}
        (out / "acquisition.json").write_text(json.dumps(record, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
        return record
    raise SystemExit("no route returned the PDF: " + json.dumps(tried, ensure_ascii=False))


if __name__ == "__main__":
    print(json.dumps(acquire(Path(sys.argv[1] if len(sys.argv) > 1 else "build/place-names")), ensure_ascii=False, indent=1))
