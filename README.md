# Himalayan Disaster Atlas

Himalayan Disaster Atlas is a public, read-only website about three hazards in Nepal: **floods, glacial-lake outbursts and earthquakes**. It shows today's official readings, an interactive map, and hypothetical scenarios people can run themselves. It works on phones and desktops, needs no account, and is served as static files.

Every figure is either copied from an official source (and dated) or labelled as a hypothetical scenario. Missing values stay UNKNOWN. It is not a warning service: warnings come from DHM and NDRRMA/BIPAD.

## What is on the site

| Page | What it does |
|---|---|
| **Home** (`/`) | The three hazards, today's headline official figures, and a way into the map. |
| **Map** (`/atlas/`) | Glacial lakes (Nepal/transboundary GLO inventory), the HydroRIVERS network with downstream tracing from any lake or reach, the USGS earthquake record, terrain, administrative boundaries, and on request glacier outlines, hydropower and infrastructure. |
| **Today** (`/hazards/`) | The daily copy of official sources arranged by hazard: river levels and rainfall (readings from the last 24 hours only), DHM flood bulletins and weather warnings, alerts, the latest NEMRC earthquakes, and BIPAD incidents of the last 7 days. In English and Nepali. See [official sources](docs/official-sources.md). |
| **Scenarios** (`/simulate/`) | Hypothetical flood and glacial-lake outburst release pulses along verified corridors, and earthquake shaking scenarios (BSSA14) including a Gorkha 2015 replay, with printable reports. |
| **About** (`/methodology/`) | Methods, data preparation and limitations, with [sources](apps/web/app/sources/page.tsx) and licences. |

Two supporting pages stay linked from Today and the footer: `/official/` (every official source in full) and `/live/` (USGS earthquake and NOAA GFS forecast feeds).

The daily official copy is refreshed by `.github/workflows/gov-feeds.yml` at about 06:02 Nepal time and committed to `main`, which redeploys the site.

### What was removed in October 2026

To focus the site on the three hazards and on phones, the research atlas (`/research/` and `npm run build:research`), the AI analyst, the evidence browser, historical event pages, the data catalog, and the gated-feature cards were removed, together with the climate and terrain-steepness panels of the old hazards hub. Their data pipelines, releases and documentation remain in the repository; only the website features were removed.

## Evidence, provenance, and data integrity

Every published dataset carries machine-readable metadata describing its source, version, licence, attribution, retrieval date, processing date, spatial and temporal coverage, evidence type, limitations, uncertainty, and update policy.

The repository uses shared JSON/TypeScript/Python contracts to validate presentation data before it can be published. Validation includes dataset identity, schema correctness, geometry checks, stable feature IDs, measurement units, spatial bounds, date consistency, feature-specific invariants, artifact size limits, and SHA-256 checksums.

Source acquisition and normalization happen offline. Large raw datasets and intermediate processing files stay outside the browser bundle, while validated versioned releases are copied exactly into the static public application. Compressed GeoJSON artifacts are size-bounded before download and again after decompression.

The public Data Catalog, Sources, and Methodology pages expose the provenance and scientific limitations behind the visible map layers.

## Static deployment and privacy

- No end-user accounts.
- No login or authentication flow.
- No comments, favourites, or personal profiles.
- No runtime database required for the current atlas.
- No secrets required by the browser application.
- No live third-party feature API is required to explore the checked-in datasets.
- Static Next.js output can be served from standard static hosting.

## Run locally

Requirements:

- Node.js 22.x
- npm 10+
- Python 3.12

```bash
npm ci
python3.12 -m venv .venv
.venv/bin/python -m pip install -r requirements.lock
npm run dev
```

Open `http://127.0.0.1:3000`.

The checked-in presentation releases are sufficient to preview the atlas. Source reacquisition pipelines are only required when rebuilding or updating datasets.

## Validation and tests

Run the complete repository validation gate with:

```bash
npm run check
```

This validates checked-in releases, runs Python tests, TypeScript/Vitest tests, type checking, JavaScript and Python linting, security checks, and the production static build.

Install Chromium and run the end-to-end browser tests with:

```bash
npx playwright install chromium
npm run test:e2e
```

The browser suite covers administrative boundaries, terrain, mountains, rivers, glaciers, glacial lakes, responsive behavior, corrupted or unavailable data, and WebGL failure handling.

## Tech stack

- **Frontend:** Next.js 16, React 19, TypeScript
- **Mapping:** MapLibre GL JS
- **Geospatial data:** GeoJSON, gzip-compressed GeoJSON, raster DEM tiles, OGC/CRS84, EPSG:3857
- **Terrain:** Copernicus DEM GLO-90, Mapzen regional terrain context
- **Administrative data:** Nepal COD-AB v02 / HDX
- **Mountain data:** GeoNames
- **River data:** FAO AQUASTAT Rivers 2026, HydroRIVERS, HydroSHEDS, HydroBASINS
- **Glacier data:** Randolph Glacier Inventory 7.0, GLIMS
- **Glacial-lake data:** Glacial Lake Observatory v1.02, Sentinel-2-derived inventory
- **Satellite observations:** Copernicus Sentinel-2 Collection-1 Level-2A via Element 84 Earth Search/AWS Open Data
- **Climate data:** NASA POWER Monthly and Annual API, MERRA-2-derived T2M and PRECTOTCORR
- **Data processing:** Python, Shapely, JSON Schema
- **Validation:** AJV, shared TypeScript/Python data contracts, SHA-256 artifact verification
- **Testing:** Vitest, Python `unittest`, Playwright
- **Code quality:** ESLint, Ruff, TypeScript type checking
- **Delivery:** Static Next.js export with versioned local data artifacts

Water Change provides three dated Phewa Lake observations, conservative masks and coverage-gated comparisons. See [feature 21](docs/water-change.md); run `npm run data:water-change` to verify/reproduce the immutable release.

Time Machine synchronizes explicit UTC observations across water, satellite, monthly climate and reported disaster events, preserving gaps and inventory context. See [feature 22](docs/time-machine.md); `npm run data:time-machine` verifies the temporal index.

Hazard Graph exposes source-backed drainage and hypothetical exposure relationships, with explicit evidence classes and UNKNOWN confidence. See [feature 27](docs/hazard-graph.md).

Scenario Engine publishes reproducible Level 1 network paths and Level 2 hypothetical constant-celerity pulse translations. These are educational approximations, not hydraulic forecasts. See [feature 28](docs/scenario-engine.md) and `npm run data:scenarios`.

Simulation UI adds the interactive Feature 29 workbench over those verified scenario inputs: explicit Level 1/2 selection, bounded Level 2 parameter controls, pre-run assumptions, deterministic browser recomputation, compatible-run comparison, map/perspective presentation and complete model/data provenance. It never creates a hydraulic footprint or exposure estimate when the validated model does not provide one. See [feature 29](docs/simulation-ui.md).

Evidence-grounded RAG provides a versioned project-document corpus, deterministic retrieval, metadata filters and exact citations with conservative grounding checks. Preview `/evidence/`; see [feature 30](docs/rag.md) and `npm run data:rag`. Conversational AI generation remains a separate feature.

AI Analyst adds an explicit local evidence mode for supported methodology questions, downstream traces by exact HYRIV ID and registered scenario summaries. Answers preserve citations, model/data versions and UNKNOWN values. Preview `/analyst/`; see [feature 31](docs/ai-analyst.md). No external language model is connected.

Provenance is now a first-class release contract. Active catalog `atlas-provenance@1.2.0` is generated from every checked-in release manifest, marks superseded/fixture records explicitly, carries source/licence/date/resolution/coverage/uncertainty fields, and records parent releases for derived products where the underlying contracts expose them. Earlier catalogs remain immutable. Map Evidence panels surface the same lineage in context. See [feature 32](docs/provenance.md) and `npm run data:provenance`.

The public `/data-catalog/` is backed by that provenance registry rather than duplicated hand-written metadata. It supports text/category/source filtering, current-versus-superseded visibility, detailed artifacts/checksums, parent inputs, processing steps, limitations and direct Atlas/Methodology/Sources navigation.

The `/methodology/` page documents the actual offline pipeline, CRS/analysis choices, raster/vector processing, simplification/tiling boundaries, evidence terminology and all implemented analysis/model families. Stable section anchors are tested against every current production catalog record. See [feature 34 maintenance rules](docs/methodology.md).

The `/sources/` directory is also provenance-backed. It groups official/acquisition providers by domain, shows access dates, licences, attribution, limitations and the exact datasets that use each source, while keeping Atlas-derived products distinct from upstream evidence. See [feature 35 source conventions](docs/sources.md).

Mobile delivery keeps the core map/search/analysis controls usable at phone sizes while deferring larger auto-loaded thematic datasets behind an explicit mobile opt-in. Touch controls, portrait/landscape map sizing and responsive scientific tables/pages are covered by touch-enabled browser tests. See [feature 36](docs/mobile.md).

Accessibility is enforced as a scientific-delivery requirement: one main landmark, skip links, labelled native controls, keyboard focus after dynamic results, non-map map alternatives, full climate-chart text, semantic table captions, explicit non-color evidence labels, contrast modes and automated structural/keyboard browser audits. See [feature 37](docs/accessibility.md).

Performance architecture defers secondary datasets on every screen, validates vector artifacts in a bounded worker and reuses checksum-verified terrain bytes. See [feature 38 budgets and profiling](docs/performance.md); use `npm run profile:performance` with a local production preview.

CI runs the full quality gate and static browser suite on pull requests and main. See [CI/CD setup and required repository rules](docs/ci-cd.md).

Original software is MIT; upstream data and dependencies keep their own licences. See [licensing findings and publication blockers](docs/licensing.md). Cloudflare deployment configuration, local runtime preview, and rollback instructions are in [deployment](docs/deployment.md).

### Deployable public export

`npm run build` builds the only release profile, which excludes datasets pending redistribution review. Run `npm run test:e2e`, `npm run test:e2e:public` and `npm run release:check`, then deploy with the existing Cloudflare command. See [release profiles and Cloudflare setup](docs/deployment.md).

### Physical GLOF work

A separate [offline physical GLOF project](processing/glof/README.md) covers input assessment across the Nepal/transboundary lake inventory. Its shallow-water solver has synthetic verification cases; no real-lake inundation or destruction prediction is validated or published. It requires reviewed terrain, bathymetry, breach and boundary-condition inputs before a physical research run.

### Live contracts — Feature 42

Shared live-data schemas separate evidence, source freshness and workflow health and verify bounded static JSON checksums. Only explicit measurement-free synthetic cases are available in the Data Catalog; no live feeds or `/live/` page are enabled yet. See [Live contracts](docs/live-contracts.md) and `npm run data:live-contracts`.

Feature 43 adds manual USGS/NOAA GFS acquisition with bounded downloads, exact source review and atomic immutable publication on a dedicated live-data branch. `npm run live:fetch` is the local runner; the Action is workflow_dispatch only. Static builds optionally pin `ATLAS_LIVE_DATA_COMMIT`; default feeds are unconfigured. [Publication trade-offs and limits](docs/live-open-feeds.md).

Feature 45 adds an OpenAQ PM2.5 research adapter with an empty provider licence allowlist and Actions-only credentials. It is OFF by default and OFF in public builds; AQI remains UNKNOWN. `npm run live:air-quality` makes no requests in the default configuration. See [air-quality review and maintenance](docs/live-air-quality.md).

Feature 46 adds the `/live/` page: periodically updated USGS and NOAA GFS conditions from verified snapshots, a bilingual Nepali/English bulletin, workflow health, per-record source/time/freshness and a map that degrades to tables without WebGL. Air quality shows OFF; official warnings are not ingested and DHM/NDRRMA/BIPAD remain the authorities. See [live conditions](docs/live-conditions.md).

`/official/` shows a daily, organised copy of public DHM, NDRRMA/BIPAD and earthquake-centre pages, refreshed each morning by `.github/workflows/gov-feeds.yml` with Scrapling. Text is copied as published and the agencies stay authoritative. See [official sources](docs/official-sources.md).


Feature 47 adds the Atlas's own service worker: a checksum-pinned offline shell, network-first live data, and stored copies that are re-verified, labelled LAST KNOWN (never freshly checked) and deleted after seven days. See [offline shell](docs/offline-shell.md).

### Scenario simulator — Features 48, 49, 51, 57

`/simulate/` runs bilingual (English/Nepali) educational scenarios entirely in the browser from checksum-verified releases: flood/GLOF corridor pulses at 18 verified release points with corridor-width exposure ranges, and BSSA14 earthquake shaking (Gorkha 2015 replay by default) with population and assets by PGA band. Assumptions are shown and acknowledged before each run; results are shareable by URL and printable as a report with input hashes. Inundation, damage, casualties and losses stay UNKNOWN. See [HRSL population](docs/hrsl-population.md), [flood corridors](docs/flood-corridors.md), [earthquake shaking](docs/earthquake-shaking.md) and [scenario reports](docs/scenario-reports.md).

### Today page

`/hazards/` (English/Nepali) is the Today page described above; see [Today page](docs/hazards-hub.md) and [official sources](docs/official-sources.md). Roadmap status: [docs/ROADMAP.md](docs/ROADMAP.md).
