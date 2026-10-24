# Official sources today

`/official/` and the "Today from official sources" section of `/hazards/` show one daily copy of the official sources that answer a hazard question. It is a reading aid: text is copied as published, nothing is translated, inferred or scored, and the agency websites stay authoritative.

## Design: one focused source per hazard question

The atlas is a source-traceable hazard reference, not a news portal, so each source must answer a specific question a reader of the hazard pages has, from the agency that is authoritative for it. Each entry in `pipelines/gov_feeds/sources.json` has a `focus` that says exactly what is kept; everything else on the page is discarded before publishing.

| Question | Source id — endpoint | Agency | Kept |
|---|---|---|---|
| Is any river above warning or danger level now? | `bipad-river` — BIPAD river-stations API | BIPAD (NDRRMA), DHM readings | Counts by status from readings in the last 24 h; stations above warning/danger; stale flags listed apart; a compact `{id: [name, status]}` map for day-to-day changes |
| Where is it raining heavily? | `bipad-rain` — BIPAD rain-stations API | BIPAD (NDRRMA), DHM readings | Counts by status from current readings; 15 wettest current stations (24 h); totals above the world record excluded as instrument faults |
| What has DHM issued about floods? | `dhm-flood-archive` — dms2.dhm.gov.np | DHM | The 8 bulletin and situation-report documents, in the order DHM lists them |
| What weather warnings exist? | `dhm-forecast` — dhm.gov.np/mfd (rendered) | DHM | Up to 6 warning and advisory documents |
| What earthquakes were recorded? | `seismo-earthquakes` — seismonepal.gov.np/en/earthquakes | NEMRC | The earthquake table only, 15 newest rows |
| What incidents happened this week? | `bipad-incidents` — BIPAD incident API | BIPAD (NDRRMA) | Incidents with an incident date in the last 7 days: id, title (English and Nepali), date, verified; the total is reported, and flagged when the API page may have cut it short |
| Which alerts are active? | `bipad-alerts` — BIPAD alert API | BIPAD (NDRRMA) | Alerts not yet expired or issued in the last 3 days: id, title, source agency, issued, expires |
| What does NDRRMA say happened in the last 24 hours? | `ndrrma-home` — ndrrma.gov.np (rendered) | NDRRMA | Only its "last 24 hours" incident summary paragraphs, verbatim |

### Dropped after the first two runs (17–18 October 2026)

The first version copied 18 pages and produced a 694 KB file a day, most of it menus and site navigation. Each dropped source either duplicated a kept one or had no hazard content a page could use:

- Ministry of Home Affairs, Department of Roads, DRR portal and DHM home, agromet and hydrological-monitoring pages: homepage chrome (menus, contact lists, staff names); road closures are not published there in a structured form.
- `hydrology.gov.np`: timed out after 60 s; its bulletins are the same documents as the DHM flood archive.
- `neoc.gov.np`: fails its TLS handshake.
- BIPAD earthquake API: returns 1994–2015 events in its default order; NEMRC is the authority for recent events.
- `pollution.gov.np`: renders only a map with no readable values; pollution alerts arrive through the BIPAD alert feed (source "doe").

The focused copy is about 64 KB. `data/gov-feeds/history/<date>.json` now keeps only the summary and per-source status (about 2 KB a day) for trends; the full copy of each day stays in git history through `latest.json`. Raw bytes are kept only for registered sources.

### Rules that keep the numbers honest

BIPAD keeps the last status flag of a station that has stopped reporting, so a station counts as current only when its own reading time is within 24 hours before the copy. Headline counts use current readings only, and older flags are listed apart, as published. Rain totals are ranked only from current readings, and a 24-hour total above the world record (1,825 mm, Foc-Foc 1966) is treated as an instrument fault and left out of the ranking. List sources keep only plain fields named in their focus. Missing values stay `null` in the data and `UNKNOWN` on the page.

Only the two BIPAD station endpoints were already read by this repository's pipelines (`"verified": true`). The second run (18 October 2026) read every kept source; BIPAD's API needs `Accept: application/json` or `format=json`, otherwise it answers its HTML browse page. The `ordering` parameters on the incident and alert URLs are best effort: if BIPAD ignores them, the date window and the completeness flag still keep the copy correct.

## How it runs

`.github/workflows/gov-feeds.yml` runs every day at 06:02 Nepal time (00:17 UTC) and on demand:

1. Installs [Scrapling](https://github.com/D4Vinci/Scrapling) 0.4.15 (BSD-3-Clause) from `pipelines/gov_feeds/requirements.txt`, kept separate from `requirements.lock` so the atlas build is unchanged.
2. Runs `tests/python/test_gov_feeds.py`.
3. Installs Chromium for Scrapling's `DynamicFetcher`. Sources marked `"render": true` (the DHM forecast and NDRRMA) are single-page apps whose HTML is empty until JavaScript runs, so they are loaded in headless Chromium; everything else uses a plain HTTP fetch.
4. Runs `python -m pipelines.gov_feeds.digest`, which checks each site's `robots.txt`, fetches with an identifying User-Agent, no browser impersonation and no search-engine referer, and writes:
   - `apps/web/public/gov/latest.json` — the digest the page reads;
   - `data/gov-feeds/history/<YYYY-MM-DD>.json` — the day's summary and source status;
   - `data/gov-feeds/raw/<source>.gz` — the latest raw bytes of each source, for audit.
5. Commits those files as the repository owner and pushes to `main`, then starts the quality workflow. Cloudflare's Git integration deploys the new commit.

A source that fails keeps its last successful copy, marked "last copy from …", and the page says why (HTTP status, robots.txt or a read error). A source that has never succeeded shows no content. The same copy feeds the "Today from official sources" section of `/hazards/`.

## Limits

- The DHM forecast app is backed by a JSON API under `dhm.gov.np/mfd/api/` that would give structured forecasts; its endpoints are undocumented and were not reachable from the build sandbox, so only the documents it lists are kept.
- If an agency moves a page, the source shows as unreachable or keeps its last copy; adjust `sources.json`.
- Agency hosts sometimes stop answering requests from GitHub's runners (from 22 to 24 October 2026, BIPAD and DHM timed out and every run was cancelled at the 20-minute job limit, so nothing was published). The digest now bounds this: each request waits at most 25 s (45 s for a browser-rendered page), `robots.txt` is read once per host, a host that fails at the network level is not asked again in the same run, and no new source starts after 10 minutes. Sources it could not read keep their last copy, labelled "Not read today; last copy" on Today, and the run still commits. The job limit is 30 minutes.
- GitHub disables scheduled workflows after 60 days without repository activity; the daily commit keeps it active.
- Redistribution terms for these pages have not been reviewed. Each entry links to its agency page, and the page states that the agencies are authoritative.
- This is not a warning service. Official forecasts and warnings come only from DHM and NDRRMA/BIPAD.
