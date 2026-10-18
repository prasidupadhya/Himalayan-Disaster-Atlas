# Himalayan Disaster Atlas

A public, read-only website about three hazards in Nepal: **floods, glacial-lake outbursts (GLOF) and earthquakes**. It shows today's official readings, an interactive map, and hypothetical scenarios you can run in the browser. Every page is in English and Nepali, chosen with one switch in the site header. It works on phones, needs no account, and is served as static files.

Every figure is either copied from an official source, with its date, or labelled as a hypothetical scenario. Missing values are shown as **UNKNOWN**, never as zero. This is not a warning service: warnings come from [DHM](https://www.dhm.gov.np/) and [NDRRMA/BIPAD](https://bipadportal.gov.np/).

## Pages

| Page | What you see |
|---|---|
| **Home** `/` | The three hazards, today's headline figures and a way into the map. |
| **Today** `/hazards/` | The daily copy of official sources, by hazard. It opens with an at-a-glance line per hazard. Floods show river and rain stations by status, the wettest stations, DHM bulletins and alerts. Earthquakes show a map of the latest NEMRC epicentres next to a date, magnitude and epicentre table. BIPAD incidents cover the last 7 days. |
| **Map** `/atlas/` | Glacial lakes (GLO inventory), the HydroRIVERS network with downstream tracing from any lake or reach, and terrain. Earthquakes are not drawn on the map; they are on Today, `/live/` and Scenarios. Glacier outlines, boundaries, hydropower and infrastructure load on request. |
| **Scenarios** `/simulate/` | Flood and GLOF release pulses along 18 verified river corridors, and BSSA14 earthquake shaking, including a Gorkha 2015 replay. Every run gives a plain-language summary, ranges (not single numbers), a chart of when the pulse passes each point downstream, a shareable link and a printable report. Inundation, damage and casualties are UNKNOWN. |
| **About** `/methodology/` | Methods, assumptions and limitations, with [sources](apps/web/app/sources/page.tsx) and licences. |

Supporting pages: `/official/` (every official source in full) and `/live/` (USGS earthquakes and NOAA GFS forecast feeds).

## How data gets in

- **Daily official copy.** `.github/workflows/gov-feeds.yml` runs at 00:17 UTC (about 06:02 Nepal time). It reads eight DHM, BIPAD and NEMRC sources ([`pipelines/gov_feeds`](pipelines/gov_feeds)) and commits `apps/web/public/gov/latest.json`, which redeploys the site. A source that fails keeps its last copy, labelled as such. See [official sources](docs/official-sources.md).
- **Map and scenario data.** These are versioned, immutable releases built offline by the Python pipelines in [`pipelines/`](pipelines). Each one carries its source, licence, coverage and limitations, plus a SHA-256 checksum that the browser verifies before use. See [provenance](docs/provenance.md).
- **Offline.** A service worker keeps a checksum-pinned shell. Stored live data is shown as LAST KNOWN and deleted after seven days. See [offline shell](docs/offline-shell.md).

No credentials reach the browser. Acquisition jobs run in GitHub Actions or locally.

## Run locally

Requires Node 22, npm 10+ and Python 3.12.

```bash
npm ci
python3.12 -m venv .venv && .venv/bin/python -m pip install -r requirements.lock
npm run dev            # http://127.0.0.1:3000
```

## Check and test

```bash
npm run check          # data contracts, Python + Vitest tests, typecheck, lint, security checks, static build
npm run test:e2e       # Playwright: pages, phone layouts, offline, accessibility, corrupted/missing data, no-WebGL
```

CI runs both on every push and pull request ([CI/CD](docs/ci-cd.md)). `npm run build` writes the static export to `apps/web/out`. Deployment to Cloudflare is described in [deployment](docs/deployment.md).

## Layout

```
apps/web/        Next.js 16 static site (React 19, MapLibre GL)
packages/        shared data contracts (TypeScript + JSON Schema)
pipelines/       Python acquisition and release builders
processing/      offline research work, e.g. the physical GLOF solver (not published)
data/            checked-in versioned releases
docs/            methods, sources, architecture and per-feature notes
tests/           Python, Vitest and Playwright suites
```

Start with [architecture](docs/architecture/README.md), [Today page](docs/hazards-hub.md), [flood corridors](docs/flood-corridors.md), [earthquake shaking](docs/earthquake-shaking.md) and the [roadmap](docs/ROADMAP.md).

## Rules the project keeps

- Unknown is `null` in data and UNKNOWN on screen.
- Scenarios are hypothetical models, not forecasts.
- Published releases are never overwritten; a change gets a new version.
- No geographic facts, hazard levels or measurements are invented. Synthetic test fixtures are marked SYNTHETIC.
- Status is never shown by colour alone: there is always a text label or icon.
- Nepali interface text is project-authored and needs native-speaker review before anyone relies on it operationally. Text copied from a source stays in its source language.

## Licence

The original code is [MIT](LICENSE). Upstream data and dependencies keep their own licences; see [licensing](docs/licensing.md) and `/licenses/` on the site.
