# Official sources today

`/official/` shows a daily, organised copy of public Nepal government pages. It is a reading aid: text is copied as published, nothing is translated, inferred or scored, and the agency websites stay authoritative.

## What is copied

`pipelines/gov_feeds/sources.json` lists every source.

| Category | Source id — page | Agency | Organised as |
|---|---|---|---|
| Weather | `dhm-forecast` — dhm.gov.np/mfd | DHM | Forecast headings, paragraphs, tables, bulletin links |
| Weather | `dhm-home` — www.dhm.gov.np | DHM | Today's weather, forecast products, notices |
| Weather | `dhm-agromet` — dhm.gov.np/agromet-services | DHM | Weekly weather bulletin and links |
| Floods | `ffd-bulletins` — hydrology.gov.np | DHM Flood Forecasting Division | Flood bulletins and special bulletins |
| Floods | `dhm-flood-archive` — dms2.dhm.gov.np | DHM | Flood bulletin archive, SMS alert notices |
| Floods | `dhm-hms` — dhm.gov.np/hydrology/hms | DHM | Hydrological monitoring page |
| River levels | `bipad-river` — BIPAD river-stations API | BIPAD (NDRRMA), DHM readings | Counts by status; stations above warning or danger with levels and reading time; status changes |
| Rainfall | `bipad-rain` — BIPAD rain-stations API | BIPAD (NDRRMA), DHM readings | Counts by status; 15 wettest stations over 24 h |
| Disasters | `bipad-incidents` — BIPAD incident API | BIPAD (NDRRMA) | Latest 100 incidents, plain fields as published; new records |
| Disasters | `bipad-alerts` — BIPAD alert API | BIPAD (NDRRMA) | Alerts, plain fields as published; new records |
| Disasters | `ndrrma-home` — ndrrma.gov.np | NDRRMA | Notices and links |
| Disasters | `moha-home` — moha.gov.np | Ministry of Home Affairs | Notices and links |
| Disasters | `neoc-home` — neoc.gov.np | National Emergency Operation Center | Updates and links |
| Disasters | `drrportal-home` — drrportal.gov.np | Ministry of Home Affairs DRR portal | Reports and links |
| Earthquakes | `seismo-earthquakes` — seismonepal.gov.np/en/earthquakes | National Earthquake Monitoring and Research Center | Earthquake table as published |
| Earthquakes | `bipad-earthquakes` — BIPAD earthquake API | BIPAD (NDRRMA) | Records, plain fields as published |
| Air quality | `doenv-air` — pollution.gov.np | Department of Environment | Page text, tables and links |
| Roads | `dor-home` — dor.gov.np | Department of Roads | Road notices and links |

Only the two BIPAD station endpoints are already read by this repository's pipelines (`"verified": true` in `sources.json`). The other URLs come from the agencies' own sites and third-party references; the first daily run's HTTP status confirms or rejects each one, and a failing source is shown as such on the page. The first run (17 October 2026) fetched all twelve web pages. The five BIPAD API endpoints answered with their HTML browse page, so the digest now asks for JSON (`Accept: application/json` and `format=json`). neoc.gov.np failed its TLS handshake and is shown as unreachable.

Web pages use one generic extraction (title, headings, tables, links, paragraphs and date strings) rather than site-specific selectors, so a layout change degrades to less structure instead of wrong values. The BIPAD river and rain endpoints use the field names already verified by the hydrology and rainfall pipelines; the other BIPAD endpoints are copied field by field (plain values only) without interpretation. Missing values stay `null` in the data and `UNKNOWN` on the page.

## How it runs

`.github/workflows/gov-feeds.yml` runs every day at 06:02 Nepal time (00:17 UTC) and on demand:

1. Installs [Scrapling](https://github.com/D4Vinci/Scrapling) 0.4.15 (BSD-3-Clause) from `pipelines/gov_feeds/requirements.txt`, kept separate from `requirements.lock` so the atlas build is unchanged.
2. Runs `tests/python/test_gov_feeds.py`.
3. Runs `python -m pipelines.gov_feeds.digest`, which checks each site's `robots.txt`, fetches with an identifying User-Agent and no browser impersonation, and writes:
   - `apps/web/public/gov/latest.json` — the digest the page reads;
   - `data/gov-feeds/history/<YYYY-MM-DD>.json` — one digest per day;
   - `data/gov-feeds/raw/<source>.gz` — the latest raw bytes of each source, for audit.
4. Commits those files as the repository owner and pushes to `main`, then starts the quality workflow. Cloudflare's Git integration deploys the new commit.

A source that fails keeps its last successful copy, marked "last copy from …", and the page says why (HTTP status, robots.txt or a read error). A source that has never succeeded shows no content.

## Limits

- The sandbox used to build this cannot reach Nepali government hosts, so the web-page sources were not tested against live pages before the first scheduled run. Check the first run's log and `latest.json`; adjust `sources.json` if a URL has moved.
- GitHub disables scheduled workflows after 60 days without repository activity; the daily commit keeps it active.
- Redistribution terms for these pages have not been reviewed. Each entry links to its agency page, and the page states that the agencies are authoritative.
- This is not a warning service. Official forecasts and warnings come only from DHM and NDRRMA/BIPAD.
