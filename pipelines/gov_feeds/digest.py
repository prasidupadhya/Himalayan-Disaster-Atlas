"""Daily digest of public Nepal government weather, river, rainfall, earthquake and notice pages.

Pages are fetched with Scrapling, checked against robots.txt, archived raw, and organised into
`apps/web/public/gov/latest.json`. Text is copied verbatim; nothing is inferred or translated. A source
that cannot be fetched keeps its last successful copy, clearly marked as last known.
"""

import argparse
import gzip
import hashlib
import json
import os
import re
import time
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
# One morning run must finish well inside the workflow's limit even when hosts stop answering:
# after this many seconds no further source is started, and those left keep their last copy.
RUN_BUDGET_S = 600
# A station reading counts as current only if it was observed within this window before the copy.
FRESH_HOURS = 24
# The world-record 24-hour rainfall (Foc-Foc, La Réunion, 1966, WMO); larger totals are instrument faults.
RAIN_24H_MAX_MM = 1825
ALERTS = ("ABOVE DANGER LEVEL", "ABOVE WARNING LEVEL")
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

def proxy_for(url):
    """The proxy for a request, if any. Since 22 October 2026 Nepal's government data centre has not accepted
    connections from cloud servers abroad (GitHub's runners included); setting GOV_PROXY to a proxy the owner controls
    on a network it accepts routes only *.gov.np requests through it. Everything else goes direct."""
    proxy = os.environ.get("GOV_PROXY", "").strip()
    host = urlparse(url).hostname or ""
    return proxy if proxy and (host == "gov.np" or host.endswith(".gov.np")) else None


def scrub(text):
    """Removes the proxy address and its credentials from anything that is logged or published."""
    proxy = os.environ.get("GOV_PROXY", "").strip()
    if not proxy:
        return text
    parsed = urlparse(proxy if "://" in proxy else f"http://{proxy}")
    for secret in {proxy, parsed.netloc, parsed.password or "", parsed.username or "", parsed.hostname or ""} - {""}:
        text = text.replace(secret, "[proxy]")
    return text


def fetch(url):
    """Returns (status, body bytes, final url, content type). Raises on transport failure."""
    from scrapling.fetchers import Fetcher

    # BIPAD's REST API answers an HTML browse page unless JSON is asked for.
    headers = {"User-Agent": USER_AGENT, "Accept": "application/json, text/html;q=0.9, */*;q=0.8", "Accept-Language": "en,ne;q=0.8"}
    proxy = proxy_for(url)
    response = Fetcher.get(url, headers=headers, timeout=25, retries=2, follow_redirects=True, stealthy_headers=False,
                           **({"proxy": proxy} if proxy else {}))
    body = response.body if isinstance(response.body, bytes) else str(response.body).encode("utf-8")
    headers = getattr(response, "headers", {}) or {}
    content_type = next((v for k, v in headers.items() if k.lower() == "content-type"), "") if hasattr(headers, "items") else ""
    return int(getattr(response, "status", 0) or 0), body[: LIMITS["body"]], str(getattr(response, "url", url) or url), content_type


def render(url):
    """Like fetch, for pages built by JavaScript in the browser: loads them in headless Chromium."""
    from scrapling.fetchers import DynamicFetcher

    options = {"headless": True, "network_idle": True, "timeout": 45_000, "useragent": USER_AGENT,
               "extra_headers": {"Accept-Language": "en,ne;q=0.8"}, "disable_resources": True, "retries": 1, "google_search": False}
    if os.environ.get("GOV_BROWSER_PATH"):
        options["executable_path"] = os.environ["GOV_BROWSER_PATH"]
    if proxy_for(url):
        options["proxy"] = proxy_for(url)
    response = DynamicFetcher.fetch(url, **options)
    body = response.body if isinstance(response.body, bytes) else str(response.body).encode("utf-8")
    return int(getattr(response, "status", 0) or 0), body[: LIMITS["body"]], str(getattr(response, "url", url) or url), "text/html"


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


def is_current(observed_at, moment):
    """True when a reading's own timestamp falls within FRESH_HOURS before the copy; unknown times are not current."""
    try:
        observed = datetime.fromisoformat(str(observed_at).replace("Z", "+00:00"))
    except ValueError:
        return False
    if observed.tzinfo is None:
        return False
    return timedelta(0) <= moment - observed <= timedelta(hours=FRESH_HOURS) or timedelta(0) < observed - moment <= timedelta(minutes=15)


def tally(stations):
    counts = {}
    for station in stations:
        counts[station["status"]] = counts.get(station["status"], 0) + 1
    return dict(sorted(counts.items()))


def alert_order(station):
    return station["status"] != "ABOVE DANGER LEVEL", station["name"] or ""


def organise_river(payload, moment=None):
    moment = moment or now_utc()
    rows = payload.get("results") if isinstance(payload, dict) else None
    if not isinstance(rows, list):
        raise ValueError("BIPAD river response has no results list")
    stations = []
    for row in rows:
        status = str(row.get("status") or "UNKNOWN")
        stations.append({"id": str(row.get("id")), "name": clean(str(row.get("title") or ""), 160) or None, "basin": row.get("basin") or None,
                         "status": status, "water_level_m": number(row.get("waterLevel")), "warning_level_m": number(row.get("warningLevel")),
                         "danger_level_m": number(row.get("dangerLevel")), "observed_at": row.get("waterLevelOn") or None, "trend": row.get("steady") or None})
    for station in stations:
        station["current"] = is_current(station["observed_at"], moment)
    current = [s for s in stations if s["current"]]
    return {"station_count": len(stations), "status_counts": tally(stations), "fresh_hours": FRESH_HOURS,
            "current_station_count": len(current), "current_status_counts": tally(current),
            "alert_stations": sorted((s for s in current if s["status"] in ALERTS), key=alert_order),
            "stale_alert_stations": sorted((s for s in stations if not s["current"] and s["status"] in ALERTS), key=alert_order),
            "statuses": {s["id"]: [s["name"], s["status"]] for s in stations}}


def organise_rain(payload, moment=None):
    moment = moment or now_utc()
    rows = payload.get("results") if isinstance(payload, dict) else None
    if not isinstance(rows, list):
        raise ValueError("BIPAD rainfall response has no results list")
    stations = []
    for row in rows:
        status = str(row.get("status") or "UNKNOWN")
        sums = {}
        for item in row.get("averages") or []:
            try:
                sums[int(item.get("interval"))] = number(item.get("value"))
            except (TypeError, ValueError):
                continue
        stations.append({"id": str(row.get("id")), "name": clean(str(row.get("title") or ""), 160) or None, "basin": row.get("basin") or None,
                         "status": status, "rain_1h_mm": sums.get(1), "rain_24h_mm": sums.get(24), "observed_at": row.get("measuredOn") or None})
    for station in stations:
        station["current"] = is_current(station["observed_at"], moment)
    current = [s for s in stations if s["current"]]
    ranked = [s for s in current if s["rain_24h_mm"] is not None and 0 <= s["rain_24h_mm"] <= RAIN_24H_MAX_MM]
    return {"station_count": len(stations), "status_counts": tally(stations), "fresh_hours": FRESH_HOURS,
            "current_station_count": len(current), "current_status_counts": tally(current),
            "implausible_24h": sum(1 for s in current if s["rain_24h_mm"] is not None and not 0 <= s["rain_24h_mm"] <= RAIN_24H_MAX_MM),
            "wettest_24h": sorted(ranked, key=lambda s: -s["rain_24h_mm"])[:15]}


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


# ---- focus ------------------------------------------------------------------------------------

def parse_time(value):
    try:
        moment = datetime.fromisoformat(str(value).replace("Z", "+00:00"))
    except ValueError:
        return None
    return moment if moment.tzinfo else None


def focus_page(page, spec):
    """Keeps only the parts of a page a source is registered for; everything kept is still verbatim."""
    pattern = re.compile(spec["paragraphs_matching"], re.I) if spec.get("paragraphs_matching") else None
    table_pattern = re.compile(spec["tables_matching"], re.I) if spec.get("tables_matching") else None
    tables = [t for t in page["tables"] if table_pattern and any(table_pattern.search(h) for h in t["header"])][:1]
    for table in tables:
        table["rows"] = table["rows"][: spec.get("rows", 15)]
    paragraphs = [p for p in page["paragraphs"] if pattern and pattern.search(p)][: spec.get("paragraphs", 3)]
    links = [link for link in page["links"] if link["document"]][: spec.get("documents", 0)]
    return {"title": page["title"], "headings": page["headings"][: spec.get("headings", 0)], "tables": tables, "links": links,
            "paragraphs": paragraphs, "dates_mentioned": []}


def focus_list(listed, spec, moment):
    """Recent (or still active) records only, newest first, with the registered fields."""
    window = timedelta(days=spec.get("within_days", 7))
    kept = []
    for record in listed["records"]:
        when = parse_time(record.get(spec["date_field"]))
        until = parse_time(record.get(spec["active_field"])) if spec.get("active_field") else None
        if (when and moment - window <= when <= moment + timedelta(minutes=15)) or (until and until >= moment):
            kept.append((when or moment, {field: record.get(field) for field in spec["fields"]}))
    kept.sort(key=lambda pair: pair[0], reverse=True)
    # When every fetched record falls inside the window, the API page may have cut the window short.
    complete = len(kept) < len(listed["records"])
    return {"record_count": len(kept), "complete": complete, "within_days": window.days, "columns": spec["fields"],
            "records": [record for _, record in kept][: spec.get("limit", 40)]}


def organise(kind, body, url, moment=None, focus=None):
    content = organise_unfocused(kind, body, url, moment)
    if not focus:
        return content
    if kind == "html":
        return focus_page(content, focus)
    if kind == "json-list":
        return focus_list(content, focus, moment or now_utc())
    return content


def organise_unfocused(kind, body, url, moment=None):
    if kind == "html":
        return extract_html(body, url)
    payload = json.loads(body.decode("utf-8"))
    if kind == "bipad-river":
        return organise_river(payload, moment)
    if kind == "bipad-rain":
        return organise_rain(payload, moment)
    if kind == "json-list":
        return organise_list(payload, limit=200)
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
    if "statuses" not in current:
        return {}
    # Copies before October 2026 kept full station lists; later ones keep {id: [name, status]}.
    old = {k: v[1] for k, v in previous.get("statuses", {}).items()} or {s["id"]: s["status"] for s in previous.get("stations", [])}
    return {"status_changes": [{"id": k, "name": name, "from": old[k], "to": status}
                               for k, (name, status) in current["statuses"].items() if k in old and old[k] != status][:60]}


def summarise(entries):
    river = next((e["content"] for e in entries if e["kind"] == "bipad-river" and e.get("content")), None)
    rain = next((e["content"] for e in entries if e["kind"] == "bipad-rain" and e.get("content")), None)
    # Headline counts use only current readings; a stale station keeps whatever status it last reported.
    counts = (river or {}).get("current_status_counts", {})
    return {
        "sources_fetched": sum(e["status"] == "fetched" for e in entries),
        "sources_last_known": sum(bool(e.get("last_known")) for e in entries),
        "sources_unavailable": sum(e["status"] != "fetched" and not e.get("content") for e in entries),
        "rivers_above_danger": counts.get("ABOVE DANGER LEVEL", 0) if river else None,
        "rivers_above_warning": counts.get("ABOVE WARNING LEVEL", 0) if river else None,
        "rivers_current": river.get("current_station_count") if river else None,
        "rain_current": rain.get("current_station_count") if rain else None,
        "rain_stations_above_warning": (rain or {}).get("current_status_counts", {}).get("ABOVE WARNING LEVEL", 0) if rain else None,
        "new_links": sum(len(e.get("changes", {}).get("new_links", [])) for e in entries),
        "new_records": sum(len(e.get("changes", {}).get("new_records", [])) for e in entries),
    }


# ---- run --------------------------------------------------------------------------------------

class HostDown(Exception):
    """A host failed at the network level earlier in this run, so it is not asked again until tomorrow."""


def guard(dead, transport):
    """Wraps a fetcher so that one network failure (timeout, refused connection) skips the host for the rest of the run.
    HTTP error statuses are answers, not failures, and do not count."""
    def guarded(url):
        host = urlparse(url).netloc
        if host in dead:
            raise HostDown(f"{host} did not answer earlier in this run; not asked again")
        try:
            return transport(url)
        except Exception:
            dead.add(host)
            raise
    return guarded


def build(sources, previous, fetcher=fetch, robots=robots_allows, moment=None, renderer=render, budget_s=RUN_BUDGET_S, clock=time.monotonic):
    moment = moment or now_utc()
    before = {e["id"]: e for e in (previous or {}).get("sources", [])}
    entries, raw = [], {}
    dead, robots_copies = set(), {}
    get, show = guard(dead, fetcher), guard(dead, renderer)

    def robots_once(url):
        # Each host's robots.txt is fetched once per run; every page is still checked against its own path.
        # A failed robots.txt alone does not mark the host down: some hosts refuse plain clients but serve the browser.
        if urlparse(url).netloc in dead:
            raise HostDown(f"{urlparse(url).netloc} did not answer earlier in this run; not asked again")
        if url not in robots_copies:
            try:
                robots_copies[url] = fetcher(url)
            except Exception as error:
                robots_copies[url] = error
        if isinstance(robots_copies[url], Exception):
            raise robots_copies[url]
        return robots_copies[url]

    started = clock()
    for source in sources:
        prior = before.get(source["id"])
        entry = {key: source[key] for key in ("id", "agency", "title", "category", "kind", "url")}
        entry.update({"checked_at": iso(moment), "http_status": None, "sha256": None})
        try:
            if clock() - started > budget_s:
                raise TimeoutError(f"Not attempted: the run's {budget_s}-second budget was spent on hosts that did not answer")
            if not robots(source["url"], robots_once):
                entry["status"] = "blocked-by-robots"
            else:
                status, body, final_url, _ = (show if source.get("render") else get)(source["url"])
                entry["http_status"] = status
                if status >= 400:
                    entry["status"] = "unreachable"
                else:
                    content = organise(source["kind"], body, final_url, moment, source.get("focus"))
                    entry.update({"status": "fetched", "fetched_at": iso(moment), "sha256": hashlib.sha256(body).hexdigest(), "content": content,
                                  "changes": changes(source["kind"], (prior or {}).get("content"), content)})
                    raw[source["id"]] = body
        except Exception as error:  # Transport or parse failure is recorded, never hidden.
            entry["status"] = "error"
            entry["error"] = clean(scrub(f"{type(error).__name__}: {error}"), 300)
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
    # The full copy is versioned by git through latest.json; the daily history keeps only what is needed for trends.
    day = digest["generated_at_nepal"][:10]
    record = {"format": FORMAT, "generated_at": digest["generated_at"], "summary": digest["summary"],
              "sources": [{k: e.get(k) for k in ("id", "status", "http_status", "last_known", "sha256")} for e in digest["sources"]]}
    (ARCHIVE / "history").mkdir(parents=True, exist_ok=True)
    (ARCHIVE / "history" / f"{day}.json").write_text(json.dumps(record, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    (ARCHIVE / "raw").mkdir(parents=True, exist_ok=True)
    registered = {e["id"] for e in digest["sources"]}
    for stale in (ARCHIVE / "raw").glob("*.gz"):
        if stale.stem not in registered:
            stale.unlink()
    for source_id, body in raw.items():
        (ARCHIVE / "raw" / f"{source_id}.gz").write_bytes(gzip.compress(body, mtime=0))


def fetched_count(digest):
    return sum(1 for e in (digest or {}).get("sources", []) if e.get("status") == "fetched")


def improves(digest, previous):
    """A retry replaces today's copy only when it read more sources; another day's copy is always replaced."""
    if not previous or previous.get("generated_at_nepal", "")[:10] != digest["generated_at_nepal"][:10]:
        return True
    return fetched_count(digest) > fetched_count(previous)


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--dry-run", action="store_true", help="print the summary without writing files")
    parser.add_argument("--retry", action="store_true",
                        help="a later attempt the same day: write only if it read more sources than today's copy")
    args = parser.parse_args(argv)
    sources = json.loads(SOURCES.read_text())["sources"]
    previous = json.loads(PUBLIC.read_text()) if PUBLIC.exists() else None
    digest, raw = build(sources, previous)
    keep = args.retry and not improves(digest, previous)
    if keep:
        print("Retry read no more sources than today's copy; keeping it.")
    if not args.dry_run and not keep:
        write(digest, raw)
    print("Government hosts via proxy:", "yes" if os.environ.get("GOV_PROXY", "").strip() else "no")
    print(json.dumps(digest["summary"], indent=1))
    for entry in digest["sources"]:
        print(f"{entry['id']}: {entry['status']} (HTTP {entry['http_status']})")


if __name__ == "__main__":
    main()
