# Himalayan Disaster Atlas

A free, public, read-only website about **floods, glacial-lake outbursts and earthquakes in Nepal**, in English and Nepali. It works on phones and laptops, needs no account, and is plain static files.

Every number is either copied from an official source with its date, or labelled as a hypothetical scenario. Missing values are shown as **UNKNOWN**, never as zero. It is **not a warning service**: warnings come from [DHM](https://www.dhm.gov.np/) and [NDRRMA/BIPAD](https://bipadportal.gov.np/).

## Pages

| Page | What it shows |
|---|---|
| **Today** `/` | The daily copy of DHM, BIPAD and NEMRC: rivers above warning or danger level, the wettest rain stations, recent earthquakes, incidents, alerts and bulletins. Each section says when it was read. |
| **Map** `/map/` | Rivers, glacial lakes, today's river and rain stations, earthquakes (live from USGS, and since 2000), reported floods and landslides, glaciers and districts, on Copernicus terrain with an optional 3D view. Tap a river reach to trace it downstream. |
| **Scenarios** `/scenarios/` | A flood or lake-outburst pulse down 18 verified river paths (arrival times and people in 250–1,000 m corridors), and BSSA14 earthquake shaking with people per shaking band, starting from Gorkha 2015, one of the ten largest events in the region since 2000, or any point you tap. Inputs live in the link, so a run can be shared. |
| **About** `/about/` | Methods, limits, and every dataset with its source, licence, version and date, read from its manifest. |

## How it is built

```
site/                 the website, served as-is (no build step)
  *.html              four pages and a 404
  app.js, copy.js     shared shell, all English and Nepali text
  models.js           scenario science (flood pulse, BSSA14), no DOM
  basemap.js          MapLibre map of Nepal on verified terrain
  today.js, map.js, scenarios.js, about.js
  sw.js               offline copy of pages and code
  data/               versioned, checksummed releases + gov/latest.json
  vendor/maplibre-gl  MapLibre GL JS 6.7.0 (BSD-3-Clause)
pipelines/gov_feeds/  the daily official-source copy (Python)
data/gov-feeds/       its daily history and raw archives
tests/                models + data checksums, scraper tests, browser tests
```

No framework and no runtime dependencies besides MapLibre. About 1,000 lines of site code.

## How data gets in

- **Daily official copy.** `.github/workflows/gov-feeds.yml` runs at 00:17 UTC (about 06:02 Nepal time) on `main`, reads eight DHM, BIPAD and NEMRC pages, and commits `site/data/gov/latest.json`. A source that fails keeps its last copy, labelled with its date. Nepal's government hosts have refused GitHub's runners since October 2026; set the repository variable `GOV_RUNNER` to a self-hosted runner in Nepal, or the secret `GOV_PROXY`, to fix that.
- **Recent earthquakes** come from the public USGS feed in the browser when the map opens. If it cannot be reached, the map says so.
- **Map and model data** are fixed, versioned releases in `site/data/<dataset>/<version>/`, each with a manifest giving source, licence, method, coverage and limitations, and a SHA-256 for every file. Published versions are never overwritten; a new version gets a new folder.

## Run and test

Requires Node 22 (and Python 3.12 for the scraper tests).

```bash
npm ci
npm run serve          # http://127.0.0.1:4173
npm test               # BSSA14 against 1,000+ pygmm reference cases, flood pulse, population grid, every file's checksum
python -m unittest tests.test_gov_feeds
npx playwright install chromium && npm run e2e   # every page on phone and laptop, English and Nepali, light and dark, axe, main flows
```

CI runs all of these on every push and pull request. Cloudflare serves `site/` (see `wrangler.jsonc`); its build step runs `npm test`, so a checksum or model failure stops the deploy.

## Licences

Site code: MIT (`LICENSE`). Each dataset keeps its own licence and attribution in its manifest; the About page lists them all.
