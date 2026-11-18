# Himalayan Disaster Atlas

A free, public, read-only website about **floods, glacial-lake outbursts and earthquakes in Nepal**, in English and Nepali. It works on phones and laptops, needs no account, and is plain static files.

Every number is either copied from an official source with its date, or labelled as a hypothetical scenario. Missing values are shown as **UNKNOWN**, never as zero. It is **not a warning service**: warnings come from [DHM](https://www.dhm.gov.np/) and [NDRRMA/BIPAD](https://bipadportal.gov.np/).

## Pages

| Page | What it shows |
|---|---|
| **Today** `/` | The daily copy of DHM, BIPAD and NEMRC: rivers above warning or danger level, the wettest rain stations, recent earthquakes, incidents, alerts and bulletins. Each section says when it was read. |
| **Map** `/map/` | Rivers, glacial lakes, glaciers and district borders on Copernicus terrain, with an optional 3D view. Tap a river reach to trace it downstream: the path draws itself with a moving head, the districts it runs through light up and are named as it passes, towns within 5 km appear, and the route is listed in words. |
| **Scenarios** `/scenarios/` | Two tabs in three steps: choose, set and run, read the results. **Flood or lake outburst:** pick one of 18 verified release points (10 glacial lakes, 8 river points) from the list or the map. Results give arrival times, people in 250–1,000 m corridors, the districts along the path in order with when the front reaches each, towns within 5 km, and the release hydrograph. The playback paints the path as time runs, names the place the front is in, can follow the front with the camera, and has a time slider and speed control. **Earthquake:** start from Gorkha 2015, one of the ten largest events in the region since 2000, or any point you tap. Results name the epicentre's district, the cities, towns and districts with the strongest modelled shaking, and people per shaking band; the pattern spreads outward once on the map (a way of showing it, not a timed wave). Inputs live in the link, so a run can be shared. |
| **About** `/about/` | Methods, limits, and every dataset with its source, licence, version and date, read from its manifest. |

## How it is built

```
site/                 the website, served as-is (no build step)
  *.html              four pages and a 404
  app.js, copy.js     shared shell, all English and Nepali text
  models.js           scenario science (flood pulse, BSSA14), no DOM
  places.js           district, town and stream lookups along a path, no DOM
  route.js            a path on the map with its places (shared by Map and Scenarios)
  basemap.js          MapLibre map of Nepal on verified terrain
  today.js, map.js, scenarios.js, about.js
  sw.js               offline copy of pages and code
  data/               versioned, checksummed releases + gov/latest.json
  vendor/maplibre-gl  MapLibre GL JS 6.7.0 (BSD-3-Clause)
pipelines/gov_feeds/  the daily official-source copy (Python)
data/gov-feeds/       its daily history and raw archives
tests/                models + data checksums, scraper tests, browser tests
```

Design: a plain-black public notice. White paper and hueless ink in light mode, re-derived for dark; Epilogue with Anek Devanagari for Nepali; hairline-ruled lists; teal only for state; DHM's red and amber only for published hazard status. Tokens are in `site/tokens.css`.

No framework and no runtime dependencies besides MapLibre. About 1,000 lines of site code.

## How data gets in

- **Daily official copy.** `.github/workflows/gov-feeds.yml` runs at 00:17 UTC (about 06:02 Nepal time) on `main`, reads eight DHM, BIPAD and NEMRC pages, and commits `site/data/gov/latest.json`. A source that fails keeps its last copy, labelled with its date. Most government hosts answer GitHub's runners (checked November 2026); for one that stops, set the repository variable `GOV_RUNNER` to a self-hosted runner in Nepal, or the secret `GOV_PROXY`. DHM's flood bulletins are read from `dhm.gov.np/bulletins`, whose list loads only when its tab is opened, so the copy opens it in a browser and waits for the bulletin links.
- **Map and model data** are fixed, versioned releases in `site/data/<dataset>/<version>/`, each with a manifest giving source, licence, method, coverage and limitations, and a SHA-256 for every file. Published versions are never overwritten; a new version gets a new folder.

## Run and test

Requires Node 22 (and Python 3.12 for the scraper tests).

```bash
npm ci
npm run serve          # http://127.0.0.1:4173
npm test               # BSSA14 against 1,000+ pygmm reference cases, flood pulse, population grid, place lookups, every file's checksum
python -m unittest tests.test_gov_feeds
npx playwright install chromium && npm run e2e   # every page on phone and laptop, English and Nepali, light and dark, axe, main flows
```

CI runs all of these on every push and pull request. Cloudflare serves `site/` (see `wrangler.jsonc`); its build step runs `npm run build` (the model and checksum tests), so a failure stops the deploy.

## Licences

Site code: MIT (`LICENSE`). Each dataset keeps its own licence and attribution in its manifest; the About page lists them all.
