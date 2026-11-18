"""Fetch the official Constitution of Nepal (Nepali text, Nepal Law Commission) for its Schedule 4,
which lists the districts of each province in Nepali.

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

OFFICIAL = "https://lawcommission.gov.np/np/wp-content/uploads/2021/01/नेपालको-स‌ंविधान.pdf"
UA = "himalayan-disaster-atlas/1.0 (+https://github.com/prasidupadhya/Himalayan-Disaster-Atlas)"


def quoted(url):
    p = urllib.parse.urlsplit(url)
    return urllib.parse.urlunsplit(p._replace(path=urllib.parse.quote(p.path)))


def get(url, proxy=None, timeout=60):
    handlers = [urllib.request.ProxyHandler({"http": proxy, "https": proxy})] if proxy else []
    opener = urllib.request.build_opener(*handlers)
    with opener.open(urllib.request.Request(quoted(url), headers={"User-Agent": UA}), timeout=timeout) as r:
        return r.read(), r.geturl()


def routes():
    yield "direct", OFFICIAL, None
    if os.environ.get("GOV_PROXY", "").strip():
        yield "gov-proxy", OFFICIAL, os.environ["GOV_PROXY"].strip()
    yield "internet-archive", f"https://web.archive.org/web/2025id_/{OFFICIAL}", None


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
        record = {"official_url": OFFICIAL, "route": name, "fetched_from": final if name != "gov-proxy" else OFFICIAL,
                  "sha256": hashlib.sha256(body).hexdigest(), "bytes": len(body),
                  "retrieved_at": datetime.now(timezone.utc).isoformat(timespec="seconds"), "failed_routes": tried}
        (out / "acquisition.json").write_text(json.dumps(record, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
        return record
    raise SystemExit("no route returned the PDF: " + json.dumps(tried, ensure_ascii=False))


if __name__ == "__main__":
    print(json.dumps(acquire(Path(sys.argv[1] if len(sys.argv) > 1 else "build/place-names")), ensure_ascii=False, indent=1))
