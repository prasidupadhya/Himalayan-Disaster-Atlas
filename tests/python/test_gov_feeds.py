"""Official-source digest. All pages and API payloads here are SYNTHETIC test fixtures, not real readings."""
import importlib.util
import json
import unittest
from datetime import datetime, timezone

from pipelines.gov_feeds.digest import (
    FORMAT,
    build,
    changes,
    focus_list,
    organise_list,
    organise_rain,
    organise_river,
)
from pipelines.gov_feeds.digest import SOURCES as REGISTRY

MOMENT = datetime(2026, 10, 17, 0, 30, tzinfo=timezone.utc)
RIVER = {"results": [
    {"id": 1, "title": "SYNTHETIC Station A", "basin": "Koshi", "status": "ABOVE WARNING LEVEL", "waterLevel": 5.1, "warningLevel": 5.0, "dangerLevel": 6.0, "waterLevelOn": "2026-10-17T05:45:00+05:45"},
    {"id": 2, "title": "SYNTHETIC Station B", "basin": "Gandaki", "status": "ABOVE DANGER LEVEL", "waterLevel": 7.2, "warningLevel": 5.5, "dangerLevel": 7.0, "waterLevelOn": "2026-10-17T05:45:00+05:45"},
    {"id": 3, "title": "SYNTHETIC Station C", "basin": "Karnali", "status": "BELOW WARNING LEVEL", "waterLevel": None, "warningLevel": None, "dangerLevel": None},
]}
RAIN = {"results": [
    {"id": 10, "title": "SYNTHETIC Gauge X", "status": "BELOW WARNING LEVEL", "averages": [{"interval": 1, "value": 0.5}, {"interval": 24, "value": 12.0}], "measuredOn": "2026-10-17T05:45:00+05:45"},
    {"id": 11, "title": "SYNTHETIC Gauge Y", "status": "ABOVE WARNING LEVEL", "averages": [{"interval": 24, "value": 88.0}], "measuredOn": "2026-10-16T18:00:00+05:45"},
    {"id": 12, "title": "SYNTHETIC Gauge Z", "status": "BELOW WARNING LEVEL", "averages": []},
]}
SOURCES = [
    {"id": "bipad-river", "agency": "A", "title": "River water levels", "category": "rivers", "kind": "bipad-river", "url": "https://example.test/river"},
    {"id": "bipad-rain", "agency": "A", "title": "Rainfall stations", "category": "rainfall", "kind": "bipad-rain", "url": "https://example.test/rain"},
]


def fetcher_for(payloads):
    def fetch(url):
        if url not in payloads:
            raise ConnectionError("unreachable in test")
        status, body = payloads[url]
        return status, body if isinstance(body, bytes) else json.dumps(body).encode(), url, "application/json"
    return fetch


def allow(url, fetcher):
    return True


class OrganiseTests(unittest.TestCase):
    def test_river_counts_and_alert_order_keep_unknown_levels_null(self):
        river = organise_river(RIVER, MOMENT)
        self.assertEqual(river["status_counts"], {"ABOVE DANGER LEVEL": 1, "ABOVE WARNING LEVEL": 1, "BELOW WARNING LEVEL": 1})
        self.assertEqual([s["id"] for s in river["alert_stations"]], ["2", "1"])
        self.assertEqual(river["statuses"]["3"], ["SYNTHETIC Station C", "BELOW WARNING LEVEL"])

    def test_rain_ranks_only_stations_with_a_24h_value(self):
        rain = organise_rain(RAIN, MOMENT)
        self.assertEqual([s["id"] for s in rain["wettest_24h"]], ["11", "10"])
        self.assertNotIn("12", [s["id"] for s in rain["wettest_24h"]])
        self.assertNotIn("stations", rain)

    def test_old_readings_keep_their_flag_but_are_not_counted_as_current(self):
        stale = {**RIVER["results"][1], "id": 4, "title": "SYNTHETIC Station D", "waterLevelOn": "2024-11-12T23:10:00+05:45"}
        river = organise_river({"results": [*RIVER["results"], stale]}, MOMENT)
        self.assertEqual(river["status_counts"]["ABOVE DANGER LEVEL"], 2)
        self.assertEqual(river["current_status_counts"], {"ABOVE DANGER LEVEL": 1, "ABOVE WARNING LEVEL": 1})
        self.assertEqual((river["current_station_count"], [s["id"] for s in river["stale_alert_stations"]]), (2, ["4"]))

    def test_stale_and_impossible_rain_totals_are_not_ranked(self):
        rows = [*RAIN["results"], {"id": 13, "title": "SYNTHETIC broken gauge", "status": "ABOVE WARNING LEVEL", "averages": [{"interval": 24, "value": 858993472.4}], "measuredOn": "2026-10-17T05:00:00+05:45"},
                {"id": 14, "title": "SYNTHETIC old gauge", "status": "ABOVE WARNING LEVEL", "averages": [{"interval": 24, "value": 300.0}], "measuredOn": "2021-09-13T17:00:45.480364+05:45"}]
        rain = organise_rain({"results": rows}, MOMENT)
        self.assertEqual([s["id"] for s in rain["wettest_24h"]], ["11", "10"])
        self.assertEqual((rain["implausible_24h"], rain["current_status_counts"]["ABOVE WARNING LEVEL"]), (1, 2))

    def test_focused_lists_keep_recent_or_active_records_newest_first(self):
        listed = organise_list({"results": [
            {"id": 1, "title": "SYNTHETIC old", "createdOn": "2026-09-01T00:00:00+05:45", "expireOn": None, "hazard": 17},
            {"id": 2, "title": "SYNTHETIC still active", "createdOn": "2026-09-01T00:00:00+05:45", "expireOn": "2026-10-20T00:00:00+05:45"},
            {"id": 3, "title": "SYNTHETIC recent", "createdOn": "2026-10-16T09:00:00+05:45", "expireOn": None},
            {"id": 4, "title": "SYNTHETIC newest", "createdOn": "2026-10-17T05:00:00+05:45", "expireOn": None}]})
        focused = focus_list(listed, {"fields": ["id", "title"], "date_field": "createdOn", "active_field": "expireOn", "within_days": 3}, MOMENT)
        self.assertEqual([r["id"] for r in focused["records"]], [4, 3, 2])
        self.assertEqual(focused["records"][0], {"id": 4, "title": "SYNTHETIC newest"})
        self.assertTrue(focused["complete"])
        everything = focus_list(listed, {"fields": ["id"], "date_field": "createdOn", "within_days": 60}, MOMENT)
        self.assertFalse(everything["complete"])

    def test_unknown_api_copies_plain_fields_only_and_reports_new_records(self):
        payload = {"count": 9999999, "results": [{"id": 7, "title": "SYNTHETIC incident", "nested": {"x": 1}, "loss": None}, {"id": 8, "title": "SYNTHETIC second"}]}
        listed = organise_list(payload)
        self.assertEqual(listed["record_count"], 2)
        self.assertEqual(listed["records"][0], {"id": 7, "title": "SYNTHETIC incident", "loss": None})
        self.assertEqual(listed["columns"][:2], ["id", "title"])
        newer = organise_list({"results": [{"id": 9, "title": "SYNTHETIC third"}, *payload["results"]]})
        self.assertEqual(changes("json-list", listed, newer)["new_records"], [{"id": 9, "title": "SYNTHETIC third"}])

    def test_source_registry_is_complete_and_government_only(self):
        sources = json.loads(REGISTRY.read_text())["sources"]
        self.assertEqual(len({s["id"] for s in sources}), len(sources))
        for source in sources:
            self.assertIn(source["kind"], ("html", "bipad-river", "bipad-rain", "json-list"))
            self.assertTrue(source["url"].split("/")[2].endswith("gov.np"), source["url"])

    def test_malformed_payload_is_refused(self):
        with self.assertRaises(ValueError):
            organise_river({"detail": "not found"})

    def test_status_changes_compare_with_the_previous_copy(self):
        before = organise_river(RIVER, MOMENT)
        after = organise_river({"results": [{**RIVER["results"][0], "status": "BELOW WARNING LEVEL"}, *RIVER["results"][1:]]}, MOMENT)
        self.assertEqual(changes("bipad-river", before, after)["status_changes"], [{"id": "1", "name": "SYNTHETIC Station A", "from": "ABOVE WARNING LEVEL", "to": "BELOW WARNING LEVEL"}])
        self.assertEqual(changes("bipad-river", None, after), {"compared_with": None})


class BuildTests(unittest.TestCase):
    def test_digest_summarises_fetched_sources(self):
        digest, raw = build(SOURCES, None, fetcher_for({"https://example.test/river": (200, RIVER), "https://example.test/rain": (200, RAIN)}), allow, MOMENT)
        self.assertEqual(digest["format"], FORMAT)
        self.assertEqual(digest["generated_at_nepal"], "2026-10-17 06:15 NPT")
        self.assertEqual(digest["summary"]["rivers_above_danger"], 1)
        self.assertEqual(digest["summary"]["rain_stations_above_warning"], 1)
        self.assertEqual(set(raw), {"bipad-river", "bipad-rain"})
        self.assertTrue(all(len(e["sha256"]) == 64 for e in digest["sources"]))

    def test_failed_source_keeps_last_known_copy_and_says_so(self):
        first, _ = build(SOURCES, None, fetcher_for({"https://example.test/river": (200, RIVER), "https://example.test/rain": (200, RAIN)}), allow, MOMENT)
        second, raw = build(SOURCES, first, fetcher_for({"https://example.test/river": (503, b"down")}), allow, MOMENT)
        river, rain = second["sources"]
        self.assertEqual((river["status"], river["http_status"], river["last_known"]), ("unreachable", 503, True))
        self.assertEqual(rain["status"], "error")
        self.assertEqual(river["content"], first["sources"][0]["content"])
        self.assertEqual((second["summary"]["sources_last_known"], second["summary"]["sources_unavailable"]), (2, 0))
        self.assertEqual(raw, {})

    def test_robots_refusal_is_respected(self):
        digest, raw = build(SOURCES[:1], None, fetcher_for({}), lambda url, fetcher: False, MOMENT)
        self.assertEqual(digest["sources"][0]["status"], "blocked-by-robots")
        self.assertNotIn("content", digest["sources"][0])
        self.assertEqual(digest["summary"]["rivers_above_danger"], None)
        self.assertEqual(digest["summary"]["sources_unavailable"], 1)

    def test_pages_built_by_javascript_use_the_browser(self):
        source = {**SOURCES[0], "render": True}
        digest, _ = build([source], None, fetcher_for({}), allow, MOMENT, renderer=fetcher_for({"https://example.test/river": (200, RIVER)}))
        self.assertEqual(digest["sources"][0]["status"], "fetched")
        self.assertEqual(digest["summary"]["rivers_above_danger"], 1)

    def test_rendered_sources_are_marked_in_the_registry(self):
        rendered = {s["id"] for s in json.loads(REGISTRY.read_text())["sources"] if s.get("render")}
        self.assertEqual(rendered, {"dhm-forecast", "ndrrma-home"})

    def test_registry_keeps_one_focused_source_per_hazard_question(self):
        sources = json.loads(REGISTRY.read_text())["sources"]
        self.assertEqual({s["category"] for s in sources}, {"rivers", "rainfall", "floods", "weather", "earthquakes", "disasters"})
        for source in sources:
            if source["kind"] in ("html", "json-list"):
                self.assertIn("focus", source, source["id"])
            if source["kind"] == "json-list":
                self.assertIn("id", source["focus"]["fields"], source["id"])


@unittest.skipUnless(importlib.util.find_spec("scrapling"), "scrapling is installed only for the digest workflow")
class HtmlTests(unittest.TestCase):
    PAGE = b"""<html><head><title>SYNTHETIC Forecast Office</title></head><body>
      <h2>Weather forecast for 2026-10-17</h2>
      <p>SYNTHETIC: Partly cloudy in the hilly region with light rain in a few places of Koshi Province.</p>
      <table><caption>SYNTHETIC outlook</caption><tr><th>Region</th><th>Today</th></tr><tr><td>Koshi</td><td>Light rain</td></tr></table>
      <a href="/files/bulletin.pdf">Daily bulletin</a><a href="#top">Top</a><a href="javascript:void(0)">x</a></body></html>"""

    def test_generic_extraction_is_verbatim_and_absolute(self):
        from pipelines.gov_feeds.digest import extract_html
        page = extract_html(self.PAGE, "https://example.test/mfd/")
        self.assertEqual(page["title"], "SYNTHETIC Forecast Office")
        self.assertIn("Weather forecast for 2026-10-17", page["headings"])
        self.assertEqual(page["tables"][0], {"caption": "SYNTHETIC outlook", "header": ["Region", "Today"], "rows": [["Koshi", "Light rain"]]})
        self.assertEqual(page["links"], [{"text": "Daily bulletin", "href": "https://example.test/files/bulletin.pdf", "document": True}])
        self.assertIn("2026-10-17", page["dates_mentioned"])

    def test_new_links_are_reported(self):
        from pipelines.gov_feeds.digest import extract_html
        before = extract_html(self.PAGE, "https://example.test/mfd/")
        after = extract_html(self.PAGE.replace(b"</body>", b'<a href="/files/new.pdf">Special bulletin</a></body>'), "https://example.test/mfd/")
        self.assertEqual([link["text"] for link in changes("html", before, after)["new_links"]], ["Special bulletin"])


if __name__ == "__main__":
    unittest.main()

    def test_page_focus_keeps_only_registered_parts_verbatim(self):
        from pipelines.gov_feeds.digest import extract_html, focus_page
        page = extract_html(self.PAGE, "https://example.test/mfd/")
        documents = focus_page(page, {"documents": 3})
        self.assertEqual(documents["links"], [{"text": "Daily bulletin", "href": "https://example.test/files/bulletin.pdf", "document": True}])
        self.assertEqual((documents["tables"], documents["paragraphs"], documents["headings"]), ([], [], []))
        outlook = focus_page(page, {"tables_matching": "today", "rows": 1, "paragraphs_matching": "koshi"})
        self.assertEqual(outlook["tables"][0]["rows"], [["Koshi", "Light rain"]])
        self.assertTrue(outlook["paragraphs"][0].startswith("SYNTHETIC: Partly cloudy"))
