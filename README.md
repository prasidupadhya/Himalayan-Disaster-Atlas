# Himalayan Disaster Atlas

Himalayan Disaster Atlas is a public, read-only geospatial atlas focused on Nepal and the Himalayan systems that influence it. The project brings together terrain, mountains, rivers, glaciers, glacial lakes, satellite observations, climate context, population, infrastructure, disaster records, and administrative geography in one evidence-traceable interactive map.

The purpose of the atlas is to build a reliable geographic foundation for understanding how Himalayan landscapes, water systems, cryosphere features, settlements, infrastructure, and future hazard-analysis layers relate to one another. The current application concentrates on verified source data and geographic context rather than presenting unverified predictions, operational warnings, or inferred hazard classifications.

The application is designed to remain lightweight and inexpensive to operate: published datasets are prepared offline, validated before release, stored as versioned static artifacts, and served without requiring end-user accounts or runtime third-party data APIs.

## Purpose

The atlas is intended to make Nepal's physical geography easier to explore while preserving the scientific meaning and provenance of every dataset. It provides a common spatial foundation for future disaster-risk work involving floods, glacial-lake outburst floods, landslides, earthquakes, rainfall, snow, infrastructure exposure, population exposure, and downstream consequences.

Its core principles are:

- keep observed, derived, modelled, historical, and unknown information clearly separated;
- preserve stable source identifiers so datasets can be linked reliably in later analysis;
- retain source dates, licences, processing history, uncertainty, and limitations;
- never replace missing measurements with invented values;
- avoid turning correlation, proximity, expansion, or connectivity into an unsupported hazard claim;
- publish immutable, checksum-verified browser datasets;
- keep the public application read-only, account-free, and deployable as static output.

## Current functionality

### Interactive Nepal atlas

- Interactive MapLibre-based map of Nepal and the surrounding Himalayan region.
- Layer visibility controls and zoom-aware rendering.
- Clickable map features with synchronized accessible record selectors.
- Keyboard-accessible controls and non-map record inspection.
- Responsive desktop and mobile layout.
- Bounded regional navigation and reset-to-Nepal view.
- Local versioned data delivery with no runtime dependency on third-party map or feature APIs.
- Explicit loading, empty, stale, unavailable, and validation-error states.
- Graceful fallback when WebGL is unavailable so validated records remain inspectable.

### Administrative boundaries

- Nepal national boundary.
- 7 provinces.
- 77 districts.
- 753 local-government units.
- 22 protected or special-area pieces included by the COD-AB source.
- Stable P-codes and parent-child administrative hierarchy.
- Province, district, and local-level zoom-dependent display.
- Searchable/selectable administrative records.
- Source area, validity date, aliases, category, hierarchy, and source-version inspection.
- Topology-preserving browser geometry derived from Nepal COD-AB v02.

### Terrain

- Copernicus DEM GLO-90 terrain coverage for Nepal.
- Regional terrain context for the wider Asian map view.
- Hillshade visualization.
- Optional 3D terrain.
- Adjustable vertical exaggeration for display only.
- Coordinate-based elevation inspection.
- Click-the-map elevation inspection.
- Elevation values sampled independently of 3D exaggeration.
- EGM2008 elevation reference retained for Nepal terrain measurements.
- Checksum-verified local terrain tiles.
- Clear separation between detailed Nepal measurement data and regional display-only terrain context.

### Mountains and peaks

- 747 GeoNames Nepal mountain and peak records.
- Stable GeoNames identifiers.
- Search by mountain name, alias, or source ID.
- Source coordinates and modification dates.
- Source summit elevation when explicitly available.
- Missing elevations remain `UNKNOWN` rather than being replaced by DEM estimates.
- Elevation-aware map visibility so major high peaks appear earlier and smaller peaks appear at closer zoom levels.
- Sparse labels to reduce map clutter.

### River network

- 18,299 FAO Rivers 2026 / HydroRIVERS reaches intersecting Nepal.
- Stable `HYRIV_ID` identifiers.
- Preserved `NEXT_DOWN` downstream topology.
- Preserved main-river identifiers.
- 18,110 downstream links that resolve to another retained reach.
- Explicit handling of reaches that continue beyond the Nepal release boundary.
- Flow order, reach length, upstream distance, downstream distance, catchment area, upstream area, and HydroBASINS level-12 identifiers.
- Long-term average discharge attributes.
- Source perennial/intermittent flow-regime classification.
- Search and selection using stable river-reach identifiers.
- Zoom-aware network rendering with primary/mid-order and headwater delivery partitions.
- The delivery partitions preserve one logical downstream network and exist only to keep browser payloads within safety budgets.

### Glaciers

- 4,593 Randolph Glacier Inventory 7.0 glacier outlines intersecting Nepal.
- Coverage from both South Asia West and South Asia East RGI regions.
- Stable RGI identifiers and GLIMS identifiers.
- Source glacier name where available; unnamed records remain `UNKNOWN`.
- Source glacier area.
- Individual source outline date.
- Centroid coordinates.
- Minimum, mean, and maximum elevation attributes.
- DEM-source metadata and RGI inventory-region metadata.
- Search by glacier name, RGI ID, or GLIMS ID.
- Selectable glacier polygons on the map.
- Three browser delivery partitions for western, central, and eastern Nepal.
- Explicit indication when source-export geometry required a presentation-only repair.
- Clear temporal labeling: these are dated RGI inventory outlines, not claimed current glacier margins.

### Glacial lakes

- 4,150 Glacial Lake Observatory v1.02 unique-lake records covering Nepal and its transboundary catchments.
- 2,347 records in Nepal, 1,745 in China, and 58 in India within the source scope.
- Stable `GLO_ID` identifiers.
- Published EPSG:4326 centroid locations for browser rendering.
- Source basin and country.
- Source `Glacier-fed` / `Non Glacier-fed` connectivity classification.
- Source dissolved maximum mapped extent across 2017–2024.
- Source perimeter.
- Elevation attributes.
- Expansion rate and expansion uncertainty where available.
- Source statistical-significance flag for expansion-rate analysis.
- Search by `GLO_ID`, country, basin, or connectivity.
- Map symbols visually sized by mapped extent and differentiated by source connectivity.
- Specific glacier and river relationships remain `UNKNOWN` when the source does not provide them.
- Lake names remain `UNKNOWN` when absent from the source dataset.
- Every record explicitly keeps hazard status unassessed: glacier-fed, expanding, or statistically significant does not automatically mean dangerous.

### Downstream trace

- Select a river reach and follow its validated NEXT_DOWN chain across both river partitions.
- Animate the retained path, pause/replay, fit the route, inspect ordered reaches and download the result with input versions and hashes.
- Show summed source reach length and distinguish coverage exits from source outlets.
- Keep lake/glacier outlet connections and future exposure intersections UNKNOWN until evidence-backed inputs exist.
- See [downstream trace methodology and handoff](docs/downstream-trace.md). This is network connectivity analysis, not a flood footprint or forecast.

### Exposure engine

- Offline, versioned polygon exposure analysis using the native WorldPop grid and OSM inventories.
- Equal-area partial-cell weighting, explicit NoData coverage, deduplicated assets and exclusive district summaries.
- Map viewer for two hypothetical trace corridors, with matched assets, provenance and downloadable inputs/results.
- [Exposure methodology, commands and benchmark](docs/exposure-engine.md). Estimates are potentially intersecting population/infrastructure, not confirmed damage or risk.

### Satellite observations

- Three fixed Sentinel-2 Collection-1 Level-2A true-colour observation windows for western, central, and eastern Nepal context.
- Exact scene/product IDs and acquisition timestamps shown in the atlas.
- Source 10 m TCI and 20 m Scene Classification Layer metadata retained in the release provenance.
- Scene-selection rule limited to at most 5% source cloud cover and zero SCL NoData for the selected windows.
- Independent SCL cloud, NoData, and snow/ice QA recorded per scene.
- Source COG URL, ETag, byte size, CRS, grid code, and official product DOI retained for reproducibility.
- Checksum-verified local 768 × 768 previews keep visitor-time use static and account-free.
- Separate footprints remain explicit; the feature does not claim seamless Nepal-wide or single-date satellite coverage.
- Clouds, shadows, snow, and date-to-date visual differences are not interpreted as water, land, hazard, or change detection.

### Climate context

- NASA POWER monthly MERRA-2-derived climate context for the complete 1991–2020 baseline.
- 360 monthly Nepal-wide records plus 12 derived monthly climatological normals.
- Two explicit variables with source units preserved: 2 m air temperature in °C and corrected precipitation rate in mm/day.
- Native 0.5° latitude × 0.625° longitude source-grid semantics retained in metadata.
- Equal-area weighting of 66 source grid cells intersecting the pinned unsimplified Nepal COD-AB v02 boundary.
- 100% valid Nepal-area coverage required for every published month; missing source cells would not be silently filled.
- Interactive variable, year/normal, and month controls with an accessible monthly chart.
- Product type shown as reanalysis-derived; values are never labelled station observations.
- Historical monthly minimum/maximum shown only as reanalysis variability, not uncertainty intervals.
- The 1991–2020 normal is historical context, not a forecast, current-condition estimate, or local valley-scale climate value.

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
