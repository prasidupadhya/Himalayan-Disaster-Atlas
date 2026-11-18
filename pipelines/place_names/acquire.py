"""Fetch the official Constitution of Nepal (Nepali text, Nepal Law Commission) for its Schedule 4,
which lists the districts of each province in Nepali. The file is found by following the Commission's own
links, so a moved upload is still found.

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

UA = "himalayan-disaster-atlas/1.0 (+https://github.com/prasidupadhya/Himalayan-Disaster-Atlas)"


def quoted(url):
    p = urllib.parse.urlsplit(url)
    return urllib.parse.urlunsplit(p._replace(path=urllib.parse.quote(p.path, safe="/%")))


def get(url, proxy=None, timeout=60):
    handlers = [urllib.request.ProxyHandler({"http": proxy, "https": proxy})] if proxy else []
    opener = urllib.request.build_opener(*handlers)
    with opener.open(urllib.request.Request(quoted(url), headers={"User-Agent": UA}), timeout=timeout) as r:
        return r.read(), r.geturl()


# Official hosts that publish the constitution: the Law Commission first, then the ministry and offices that also carry it.
HOSTS = ["lawcommission.gov.np", "moljpa.gov.np", "ag.gov.np", "parliament.gov.np", "supremecourt.gov.np", "mofaga.gov.np"]
NAMED = re.compile(r"संविधान|%E0%A4%B8%E0%A4%82%E0%A4%B5%E0%A4%BF%E0%A4%A7%E0%A4%BE%E0%A4%A8|constitution", re.I)


def links(html, base):
    return [urllib.parse.urljoin(base, h) for h in re.findall(r'href=["\']([^"\'#]+)', html)]


def candidates(proxy=None):
    """PDF links on the Law Commission's own pages that name the constitution, found by following named links two levels deep."""
    seen, pdfs, queue = set(), [], [(f"https://{HOSTS[0]}{p}", 0) for p in ("/", "/np/", "/en/")]
    while queue and len(seen) < 40:
        url, depth = queue.pop(0)
        if url in seen:
            continue
        seen.add(url)
        try:
            html = get(url, proxy, timeout=30)[0].decode("utf-8", "replace")
        except Exception as e:
            print(f"  page {url}: {type(e).__name__}: {e}", file=sys.stderr)
            continue
        for link in links(html, url):
            named, local = NAMED.search(link) or NAMED.search(urllib.parse.unquote(link)), urllib.parse.urlsplit(link).hostname == HOSTS[0]
            if link.lower().split("?")[0].endswith(".pdf") and named and link not in pdfs:
                pdfs.append(link)
            elif named and local and depth < 2:
                queue.append((link, depth + 1))
    return pdfs


def archived(host):
    """The Internet Archive's stored copies of PDFs on one official host whose address names the constitution, newest first."""
    q = urllib.parse.urlencode({"url": host, "matchType": "host", "output": "json", "collapse": "digest", "fl": "timestamp,original,mimetype",
                                "filter": ["statuscode:200", "mimetype:application/pdf"], "limit": 5000}, doseq=True)
    rows = json.loads(get(f"https://web.archive.org/cdx/search/cdx?{q}", timeout=90)[0] or b"[]")[1:]
    hits = [r for r in rows if NAMED.search(r[1]) or NAMED.search(urllib.parse.unquote(r[1]))]
    return [f"https://web.archive.org/web/{t}id_/{o}" for t, o, _ in sorted(hits, reverse=True)]


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
        for url in found:
            print(f"  {urllib.parse.unquote(url)}", file=sys.stderr)
            yield name, url, via
    for host in HOSTS:
        try:
            found = archived(host)
        except Exception as e:
            print(f"internet-archive {host}: index failed: {type(e).__name__}: {e}", file=sys.stderr)
            continue
        print(f"internet-archive {host}: {len(found)} candidates", file=sys.stderr)
        for url in found[:25]:
            print(f"  {urllib.parse.unquote(url)}", file=sys.stderr)
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
