# Final report — live data, hazard context and scenario simulator (Features 42–58)

The Atlas is a static, account-free, read-only public site. Every number comes from a checksum-verified immutable release, and every scenario says it is a scenario. Official forecasts and warnings come only from DHM and NDRRMA/BIPAD, which every live, hazard and scenario page links.

## Features

| # | Feature | Where | Status | Evidence type |
|---|---|---|---|---|
| 42 | Live contracts (schemas, freshness, workflow health) | Data Catalog | Done | Synthetic fixtures only |
| 43 | USGS earthquakes and NOAA GFS acquisition | `workflow_dispatch` Action, `npm run live:fetch` | Done; default feeds unconfigured | Reported events / model forecast |
| 44 | DHM / NDRRMA-BIPAD feeds | `/hazards/` | **Gated**, link-only | — |
| 45 | OpenAQ PM2.5 research adapter | off by default | Done, OFF; AQI UNKNOWN | — |
| 46 | `/live/` conditions page with a bilingual bulletin | `/live/` | Done | Observed / reported / model forecast |
| 47 | Offline shell; LAST KNOWN live copies | site-wide | Done; 1.1.0 adds `/hazards/`, `/simulate/` and cache-on-use releases | — |
| 48 | Public population input (HRSL v1.5) | simulator | Done | Modelled |
| 49 | Flood/GLOF corridor scenarios | `/simulate/` | Done | Hypothetical scenario |
| 50 | Verified physical flood cases | `/hazards/` | **Gated** | — |
| 51 | Earthquake shaking (BSSA14), Gorkha 2015 replay | `/simulate/` | Done | Modelled scenario |
| 52 | Earthquake damage | `/hazards/` | **Gated** | — |
| 53 | Landslide terrain context (district steepness) | `/hazards/` | Done | Derived |
| 54 | Rainfall and snow context | `/hazards/` | Done | Modelled (reanalysis) |
| 55 | Drought (SPI-3) and heat (Tmax anomaly) context | `/hazards/` | Done | Modelled (reanalysis) |
| 56 | `/hazards/` hub | `/hazards/` | Done | Mixed, labelled per panel |
| 57 | Scenario reports (print/PDF, JSON, share link) | `/simulate/report/` | Done | Hypothetical scenario |
| 58 | Evidence analyst (quotes only, no LLM) | `/hazards/#evidence` | Done | Atlas documentation |

`/live/`, `/hazards/`, `/simulate/` and the report are in English and Nepali. They work offline after one online visit, meet the accessibility rules (keyboard, tables behind every map, non-colour labels, forced-colours and print styles) and reflow down to 320 px.

## What is still UNKNOWN, and what would resolve it

| UNKNOWN | What would resolve it |
|---|---|
| Real glacial-lake volumes, breach location and breach mechanics | Reviewed bathymetry and breach studies per lake, with a licence that allows publication |
| Inundation depth and extent for any real lake or river | Feature 50: hydraulic-grade terrain, boundary conditions and validation against an observed event (see `processing/glof/README.md`) |
| Building damage, casualties, repair costs, hydropower downtime and economic loss | Feature 52: a reviewed building taxonomy for Nepal, fragility functions, replacement costs and validation against Gorkha 2015 |
| Recorded Gorkha 2015 ground motion (model-versus-observation residuals) | Ingest the public-domain USGS ShakeMap station list for us20002926 as a pinned release |
| Landslide susceptibility, probability and hazard levels | A redistributable, reviewed landslide inventory plus a published model with out-of-sample validation |
| Population outside Nepal along transboundary corridors | A separately reviewed population source for the neighbouring areas |
| HRSL reference year, per-cell population uncertainty | Not published by the source |
| Official warnings (DHM, NDRRMA/BIPAD) | Feature 44: written redistribution terms or an open licence, a stable documented endpoint, and an adapter that keeps the warning text verbatim |
| Air-quality index | OpenAQ provider licences reviewed and added to the allowlist (Feature 45) |
| Reanalysis error over complex terrain; GLO-90 slope error | No local validation is available |

## Licence assumptions

- **HRSL v1.5** (Meta/CIESIN) is CC BY 4.0, per the AWS Open Data registry.
- **NASA POWER v10 (MERRA-2)** is CC BY 4.0, per the `LICENSE.txt` in the `nasa-power` bucket, pinned by hash.
- **Copernicus GLO-90** uses the free and open Copernicus DEM licence; the WorldDEM-90 notice is carried.
- **OSM-derived counts** are ODbL 1.0 with attribution.
- **HydroRIVERS, GLO, GeoNames and COD-AB** are CC BY (as already reviewed).
- **BSSA14 coefficients** are published scientific values, cited by DOI. OpenQuake (AGPL) code was not used. pygmm (MIT) and SciPy were used only to generate test reference values.
- **`numcodecs`** (MIT, bundling BSD c-blosc) is offline build tooling only.
- **Public-build exclusions are unchanged.** WorldPop, BIPAD events/floods/landslides/rainfall/hydrology and the dependent research tools stay out of `npm run build`.

## Steps for the owner

1. Features 48–58 and the gated cards landed on `main` through PR #29 (merge `5614a00`) after CI was green on the verified head. Nothing is merged to `main` by a bot, and no scheduled cron is enabled.
2. To refresh the climate snapshot when it shows STALE:
   - run `npm run data:power-context -- --download`;
   - review any upstream byte changes it reports;
   - re-pin, publish a new version, then run `npm run data:provenance` and add a ledger review.
3. To enable live feeds, run the `workflow_dispatch` Action manually after setting the variables described in `docs/live-open-feeds.md`. Default feeds stay unconfigured.
4. Arrange native-speaker review of the project-authored Nepali copy before operational reliance.
5. To unlock a gated feature, meet every condition in `docs/hazards-hub.md`, then register the inputs as pinned releases with ledger reviews.
6. Deploy with the existing Cloudflare command after `npm run check`, `npm run test:e2e:public` and `npm run release:check` pass.
