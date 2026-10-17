# Official sources today

`/official/` shows a daily, organised copy of public Nepal government pages. It is a reading aid: text is copied as published, nothing is translated, inferred or scored, and the agency websites stay authoritative.

## What is copied

`pipelines/gov_feeds/sources.json` lists every source.

| Source | Agency | How it is organised |
|---|---|---|
| `dhm-forecast` — dhm.gov.np/mfd | DHM Meteorological Forecasting Division | Title, headings, forecast paragraphs, tables, linked bulletins |
| `dhm-home` — dhm.gov.np | DHM | Notices and bulletin links; new links since the previous copy |
| `bipad-river` — BIPAD river-stations API | BIPAD (NDRRMA), readings from DHM | Station counts by status; stations above warning or danger level with water, warning and danger levels and reading time; status changes since the previous copy |
| `bipad-rain` — BIPAD rain-stations API | BIPAD (NDRRMA), readings from DHM | Station counts by status; the 15 wettest stations over 24 hours |
| `ndrrma-home` — ndrrma.gov.np | NDRRMA | Notices and links; new links since the previous copy |
| `seismo-earthquakes` — seismonepal.gov.np | National Earthquake Monitoring and Research Center | Earthquake tables as published |

Web pages use one generic extraction (title, headings, tables, links, paragraphs and date strings) rather than site-specific selectors, so a layout change degrades to less structure instead of wrong values. The BIPAD API uses the field names already verified by the hydrology and rainfall pipelines. Missing values stay `null` in the data and `UNKNOWN` on the page.

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
