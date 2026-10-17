"""Daily digest of public Nepal government weather, river, rainfall, earthquake and notice pages.

Pages are fetched with Scrapling, checked against robots.txt, archived raw, and organised into
`apps/web/public/gov/latest.json`. Text is copied verbatim; nothing is inferred or translated. A source
that cannot be fetched keeps its last successful copy, clearly marked as last known.
"""

import argparse
import gzip
import hashlib
import json
import re
from datetime import datetime, timedelta, timezone
from pathlib import Path
from urllib.parse import urlparse
from urllib.robotparser import RobotFileParser

ROOT = Path(__file__).resolve().parents[2]
SOURCES = Path(__file__).with_name("sources.json")
PUBLIC = ROOT / "apps/web/public/gov/latest.json"
ARCHIVE = ROOT / "data/gov-feeds"
FORMAT = "atlas-gov-digest@1"
NEPAL = timezone(timedelta(hours=5, minutes=45))
USER_AGENT = "HimalayanDisasterAtlas/1.0 (+https://github.com/prasidupadhya/Himalayan-Disaster-Atlas; daily public-page digest)"
LIMITS = {"tables": 8, "rows": 200, "links": 120, "paragraphs": 40, "headings": 40, "text": 600, "body": 5_000_000}
DOCUMENT = re.compile(r"\.(pdf|docx?|xlsx?|pptx?|jpe?g|png)(\?|$)", re.I)
DATE_PATTERNS = [
    r"\b\d{4}-\d{2}-\d{2}\b",
    r"\b\d{1,2}(?:st|nd|rd|th)?\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?,?\s+\d{4}\b",
    r"\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{1,2},?\s+\d{4}\b",
    r"[०-९]{4}[/-][०-९]{1,2}[/-][०-९]{1,2}",
]


def now_utc():
    return datetime.now(timezone.utc).replace(microsecond=0)


def iso(moment):
    return moment.astimezone(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


def clean(text, limit=LIMITS["text"]):
    value = re.sub(r"\s+", " ", text or "").strip()
    return value if len(value) <= limit else value[: limit - 1].rstrip() + "…"


# ---- fetching ---------------------------------------------------------------------------------

def fetch(url):
    """Returns (status, body bytes, final url, content type). Raises on transport failure."""
    from scrapling.fetchers import Fetcher

    response = Fetcher.get(url, headers={"User-Agent": USER_AGENT, "Accept-Language": "en,ne;q=0.8"},
                           timeout=45, retries=2, follow_redirects=True, stealthy_headers=False)
    body = response.body if isinstance(response.body, bytes) else str(response.body).encode("utf-8")
    headers = getattr(response, "headers", {}) or {}
    content_type = next((v for k, v in headers.items() if k.lower() == "content-type"), "") if hasattr(headers, "items") else ""
    return int(getattr(response, "status", 0) or 0), body[: LIMITS["body"]], str(getattr(response, "url", url) or url), content_type


def robots_allows(url, fetcher=fetch):
    parsed = urlparse(url)
    robots = f"{parsed.scheme}://{parsed.netloc}/robots.txt"
    try:
        status, body, _, _ = fetcher(robots)
    except Exception:
        return True  # An unreachable robots.txt does not forbid crawling (RFC 9309, 2.3.1.4).
    if status >= 400:
        return True
    parser = RobotFileParser()
    parser.parse(body.decode("utf-8", "replace").splitlines())
    return parser.can_fetch(USER_AGENT, url)


# ---- extraction -------------------------------------------------------------------------------

def extract_html(body, url):
    """Generic, verbatim extraction: title, headings, tables, links, paragraphs and date strings."""
    from scrapling.parser import Selector

    page = Selector(content=body, url=url)
    title = clean(page.css("title::text").get() or "")
    headings = []
    for node in page.css("h1, h2, h3"):
        text = clean(node.get_all_text(separator=" ", strip=True), 200)
        if text and text not in headings:
            headings.append(text)
    tables = []
    for table in page.css("table")[: LIMITS["tables"]]:
        rows = []
        for row in table.css("tr"):
            cells = [clean(cell.get_all_text(separator=" ", strip=True), 300) for cell in row.css("th, td")]
            if any(cells):
                rows.append(cells)
        if rows:
            captions = table.css("caption")
            caption = clean(captions[0].get_all_text(separator=" ", strip=True) if captions else "", 200)
            first = next((row for row in table.css("tr") if row.css("th, td")), None)
            header = rows[0] if first is not None and first.css("th") else []
            tables.append({"caption": caption or None, "header": header, "rows": rows[1:] if header else rows})
    for table in tables:
        table["rows"] = table["rows"][: LIMITS["rows"]]
    links, seen = [], set()
    for anchor in page.css("a[href]"):
        href = (anchor.attrib.get("href") or "").strip()
        if not href or href.startswith(("#", "javascript:", "mailto:", "tel:")):
            continue
        absolute = page.urljoin(href)
        text = clean(anchor.get_all_text(separator=" ", strip=True), 240)
        if absolute in seen or not text:
            continue
        seen.add(absolute)
        links.append({"text": text, "href": absolute, "document": bool(DOCUMENT.search(absolute))})
    paragraphs = []
    for node in page.css("p, li"):
        text = clean(node.get_all_text(separator=" ", strip=True))
        if len(text) >= 40 and text not in paragraphs:
            paragraphs.append(text)
    full = " ".join(paragraphs + headings)
    dates = sorted({match for pattern in DATE_PATTERNS for match in re.findall(pattern, full)})
    return {"title": title or None, "headings": headings[: LIMITS["headings"]], "tables": tables, "links": links[: LIMITS["links"]],
            "paragraphs": paragraphs[: LIMITS["paragraphs"]], "dates_mentioned": dates[:30]}


def number(value):
    try:
        return None if value is None else float(value)
    except (TypeError, ValueError):
        return None


def organise_river(payload):
    rows = payload.get("results") if isinstance(payload, dict) else None
    if not isinstance(rows, list):
        raise ValueError("BIPAD river response has no results list")
    stations, counts = [], {}
    for row in rows:
        status = str(row.get("status") or "UNKNOWN")
        counts[status] = counts.get(status, 0) + 1
        stations.append({"id": str(row.get("id")), "name": clean(str(row.get("title") or ""), 160) or None, "basin": row.get("basin") or None,
                         "status": status, "water_level_m": number(row.get("waterLevel")), "warning_level_m": number(row.get("warningLevel")),
                         "danger_level_m": number(row.get("dangerLevel")), "observed_at": row.get("waterLevelOn") or None, "trend": row.get("steady") or None})
    alert = [s for s in stations if s["status"] in ("ABOVE DANGER LEVEL", "ABOVE WARNING LEVEL")]
    alert.sort(key=lambda s: (s["status"] != "ABOVE DANGER LEVEL", s["name"] or ""))
    return {"station_count": len(stations), "status_counts": dict(sorted(counts.items())), "alert_stations": alert, "stations": stations}


def organise_rain(payload):
    rows = payload.get("results") if isinstance(payload, dict) else None
    if not isinstance(rows, list):
        raise ValueError("BIPAD rainfall response has no results list")
    stations, counts = [], {}
    for row in rows:
        status = str(row.get("status") or "UNKNOWN")
        counts[status] = counts.get(status, 0) + 1
        sums = {}
        for item in row.get("averages") or []:
            try:
                sums[int(item.get("interval"))] = number(item.get("value"))
            except (TypeError, ValueError):
                continue
        stations.append({"id": str(row.get("id")), "name": clean(str(row.get("title") or ""), 160) or None, "basin": row.get("basin") or None,
                         "status": status, "rain_1h_mm": sums.get(1), "rain_24h_mm": sums.get(24), "observed_at": row.get("measuredOn") or None})
    wettest = sorted((s for s in stations if s["rain_24h_mm"] is not None), key=lambda s: -s["rain_24h_mm"])[:15]
    return {"station_count": len(stations), "status_counts": dict(sorted(counts.items())), "wettest_24h": wettest, "stations": stations}


def organise_list(payload, limit=60):
    """Unknown JSON APIs: copy only the plain (string, number, boolean, null) fields of each record, verbatim."""
    rows = payload.get("results") if isinstance(payload, dict) else payload
    if not isinstance(rows, list):
        raise ValueError("Response has no results list")
    records = []
    for row in rows[:limit]:
        if isinstance(row, dict):
            records.append({k: (clean(v, 300) if isinstance(v, str) else v) for k, v in row.items() if v is None or isinstance(v, (str, int, float, bool))})
    frequency = {}
    for record in records:
        for key, value in record.items():
            if value not in (None, ""):
                frequency[key] = frequency.get(key, 0) + 1
    columns = [k for k, _ in sorted(frequency.items(), key=lambda kv: -kv[1])][:8]
    return {"record_count": len(rows), "columns": columns, "records": records}


def organise(kind, body, url):
    if kind == "html":
        return extract_html(body, url)
    payload = json.loads(body.decode("utf-8"))
    if kind == "bipad-river":
        return organise_river(payload)
    if kind == "bipad-rain":
        return organise_rain(payload)
    if kind == "json-list":
        return organise_list(payload)
    raise ValueError(f"Unknown source kind {kind}")


# ---- analysis ---------------------------------------------------------------------------------

def changes(kind, previous, current):
    """What is new since the previous successful copy. Empty when there is no previous copy."""
    if not previous:
        return {"compared_with": None}
    if kind == "html":
        old_links = {link["href"] for link in previous.get("links", [])}
        old_rows = {json.dumps(row, ensure_ascii=False) for table in previous.get("tables", []) for row in table.get("rows", [])}
        return {"new_links": [link for link in current["links"] if link["href"] not in old_links][:40],
                "new_table_rows": [row for table in current["tables"] for row in table["rows"] if json.dumps(row, ensure_ascii=False) not in old_rows][:60]}
    if kind == "json-list":
        old_ids = {json.dumps(r.get("id", r), sort_keys=True, ensure_ascii=False) for r in previous.get("records", [])}
        return {"new_records": [r for r in current["records"] if json.dumps(r.get("id", r), sort_keys=True, ensure_ascii=False) not in old_ids][:40]}
    old = {s["id"]: s["status"] for s in previous.get("stations", [])}
    return {"status_changes": [{"id": s["id"], "name": s["name"], "from": old.get(s["id"]), "to": s["status"]}
                               for s in current["stations"] if s["id"] in old and old[s["id"]] != s["status"]][:60]}


def summarise(entries):
    river = next((e["content"] for e in entries if e["kind"] == "bipad-river" and e.get("content")), None)
    rain = next((e["content"] for e in entries if e["kind"] == "bipad-rain" and e.get("content")), None)
    counts = (river or {}).get("status_counts", {})
    return {
        "sources_fetched": sum(e["status"] == "fetched" for e in entries),
        "sources_last_known": sum(bool(e.get("last_known")) for e in entries),
        "sources_unavailable": sum(e["status"] != "fetched" and not e.get("content") for e in entries),
        "rivers_above_danger": counts.get("ABOVE DANGER LEVEL") if river else None,
        "rivers_above_warning": counts.get("ABOVE WARNING LEVEL") if river else None,
        "rain_stations_above_warning": (rain or {}).get("status_counts", {}).get("ABOVE WARNING LEVEL") if rain else None,
        "new_links": sum(len(e.get("changes", {}).get("new_links", [])) for e in entries),
        "new_records": sum(len(e.get("changes", {}).get("new_records", [])) for e in entries),
    }


# ---- run --------------------------------------------------------------------------------------

def build(sources, previous, fetcher=fetch, robots=robots_allows, moment=None):
    moment = moment or now_utc()
    before = {e["id"]: e for e in (previous or {}).get("sources", [])}
    entries, raw = [], {}
    for source in sources:
        prior = before.get(source["id"])
        entry = {key: source[key] for key in ("id", "agency", "title", "category", "kind", "url")}
        entry.update({"checked_at": iso(moment), "http_status": None, "sha256": None})
        try:
            if not robots(source["url"], fetcher):
                entry["status"] = "blocked-by-robots"
            else:
                status, body, final_url, _ = fetcher(source["url"])
                entry["http_status"] = status
                if status >= 400:
                    entry["status"] = "unreachable"
                else:
                    content = organise(source["kind"], body, final_url)
                    entry.update({"status": "fetched", "fetched_at": iso(moment), "sha256": hashlib.sha256(body).hexdigest(), "content": content,
                                  "changes": changes(source["kind"], (prior or {}).get("content"), content)})
                    raw[source["id"]] = body
        except Exception as error:  # Transport or parse failure is recorded, never hidden.
            entry["status"] = "error"
            entry["error"] = clean(f"{type(error).__name__}: {error}", 300)
        if entry["status"] != "fetched" and prior and prior.get("content"):
            entry.update({"content": prior["content"], "fetched_at": prior.get("fetched_at"), "sha256": prior.get("sha256"),
                          "last_known": True, "changes": {}})
        entries.append(entry)
    digest = {"format": FORMAT, "generated_at": iso(moment), "generated_at_nepal": moment.astimezone(NEPAL).strftime("%Y-%m-%d %H:%M NPT"),
              "notice": "Verbatim copies of public government pages, organised for reading. The agency websites are authoritative.",
              "summary": summarise(entries), "sources": entries}
    return digest, raw


def write(digest, raw):
    PUBLIC.parent.mkdir(parents=True, exist_ok=True)
    text = json.dumps(digest, ensure_ascii=False, indent=1) + "\n"
    PUBLIC.write_text(text, encoding="utf-8")
    day = digest["generated_at_nepal"][:10]
    (ARCHIVE / "history").mkdir(parents=True, exist_ok=True)
    (ARCHIVE / "history" / f"{day}.json").write_text(text, encoding="utf-8")
    (ARCHIVE / "raw").mkdir(parents=True, exist_ok=True)
    for source_id, body in raw.items():
        (ARCHIVE / "raw" / f"{source_id}.gz").write_bytes(gzip.compress(body, mtime=0))


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--dry-run", action="store_true", help="print the summary without writing files")
    args = parser.parse_args(argv)
    sources = json.loads(SOURCES.read_text())["sources"]
    previous = json.loads(PUBLIC.read_text()) if PUBLIC.exists() else None
    digest, raw = build(sources, previous)
    if not args.dry_run:
        write(digest, raw)
    print(json.dumps(digest["summary"], indent=1))
    for entry in digest["sources"]:
        print(f"{entry['id']}: {entry['status']} (HTTP {entry['http_status']})")


if __name__ == "__main__":
    main()
