# Live conditions page — Feature 46

Branch `feat/live-conditions`, stacked on Feature 45 (`feat/live-air-quality`) and Feature 43 (`feat/live-open-feeds`). It adds the public `/live/` route: a map, a bilingual Nepali/English bulletin, workflow health and record tables over the verified Feature 43 publication. It adds no acquisition, no source, no schedule and no service worker (Feature 47).

## What the page shows

| Area | Content | Evidence rule |
| --- | --- | --- |
| Header | “Periodically updated conditions”; DHM, NDRRMA and BIPAD links as the authorities | Never “real-time”; the atlas issues no warnings |
| Publication and workflow health | HEALTHY / PARTIAL / FAILED / STALE / UNAVAILABLE, last successful fetch, last attempt, publication time, run link, schedule statement | Health is separate from source freshness; the schedule statement says no automatic schedule is active |
| Bulletin | Earthquakes, precipitation forecast, air quality, official warnings, impacts; English or नेपाली | Sentences are generated only from verified snapshots |
| Map | Reported USGS epicentres and GFS 0.25° cell squares; Nepal outline from the verified boundary release | Optional; WebGL failure leaves every record in the tables |
| Feed cards | Source, licence, revision, issue/source time, fetched_at, fresh-until, attempt status, limitations, snapshot and manifest links | One card per feed plus air quality (OFF) and official warnings (NOT INGESTED) |
| Record tables | Every record with source, observation or issue time, fetched_at and freshness | GFS cells paginated 50 per page; tables scroll inside their own region |

## Labels and states

Product purpose uses a distinct glyph *and* text, never colour alone: ◉ OBSERVATION, ● REPORTED EVENT, ◇ MODEL FORECAST, ▲ OFFICIAL WARNING. Freshness uses ✓ FRESH, ! STALE (dashed border), × UNAVAILABLE (dotted border). Glyphs are chosen from characters present in common system fonts. Evidence class (REPORTED, MODELLED) is shown separately.

Freshness is derived from the Feature 42 `liveFreshness` decision and recomputed on the viewer's clock every second, at the earliest source/workflow deadline, and on `pageshow`/`visibilitychange`:

| Contract state | Page label | Bulletin |
| --- | --- | --- |
| ready | FRESH | Generated sentences |
| empty (valid) | FRESH | “not an all-clear” / “not a forecast of no precipitation” |
| stale (expired, failed attempt with retained snapshot, unknown source time, overdue workflow) | STALE | “STALE — last verified snapshot.” then the retained content |
| unavailable (disabled, unconfigured, no snapshot, clock ahead of publication) | UNAVAILABLE | “UNAVAILABLE — no verified snapshot.” |
| error (checksum, size, schema, semantics or source-review failure) | UNAVAILABLE | “verification failed; content withheld.” No value from the bytes is displayed |

A malformed or missing index shows an alert with retry and no readings. The shipped default `live/latest.json` is unconfigured, so a deployment without a pinned live-data commit states that no publication is pinned and implies no readings.

## Bulletin method

Templates live in `packages/contracts/live-conditions-policy.json` and are registered as `atlas-live-conditions@1.0.0`. English and Nepali have identical keys and placeholders (checked in TypeScript and Python). Nepali mode uses Devanagari digits; `dateTime` attributes keep ISO UTC. Times show UTC and Nepal Time (UTC+05:45).

- Earthquakes: count of retained USGS-network summaries in the 80–89°E / 26–31°N query, and the most recent event with its source magnitude, magnitude type, label and origin time. No “largest event”, intensity or impact statement, because magnitude types differ.
- Forecast: GFS valid window and cycle; the minimum and maximum of known cell values (display rounded to 0.01 mm), counts of known and UNKNOWN cells. Source zero stays 0. This is a model value summary, not observed rainfall, a daily total or a warning.
- Air quality: OFF while `AIR_QUALITY_PUBLIC_ENABLED` is false; AQI UNKNOWN. No request is made.
- Official warnings: not ingested; their absence never means no warnings.
- Impacts: damage, loss, inundation and casualties are UNKNOWN; nothing estimates them.

The Nepali copy is project-authored. It needs review by a native Nepali-speaking disaster-communication reviewer before anyone relies on it for public communication.

## Map

MapLibre with a local background style; no basemap, tiles or third-party requests. GFS squares outline native 0.25° grid centres for display only; values are not interpolated and legend bins (0.1, 1, 5, 10, 25 mm) are presentation bins, not hazard thresholds. Null cells are drawn as dashed outlines and labelled UNKNOWN. Epicentre circle size follows source magnitude and is not a shaking or impact footprint. STALE layers are faded and labelled in the layer controls; unavailable or failed layers are not drawn. A “Skip map to record tables” link precedes the map.

## Accessibility and layout

Keyboard: every control is a native button, checkbox or link; the language switch uses `aria-pressed` and the bulletin body carries `lang`. A polite status region announces publication verification, workflow health and each feed's freshness. Layout reflows from two columns to one below 1000px; at 320px nothing overflows horizontally and the bulletin precedes the map. High-contrast and forced-colours modes keep label borders.

## Validation

- Vitest (`tests/web/live-conditions.test.ts`): TS/Node/Python acceptance of the two-feed fixture, label distinctness, FRESH/STALE/UNAVAILABLE mapping for normal/empty/failed/unavailable, deadline expiry without a fetch, corrupted forecast withheld while the other feed stays usable, copy parity, no immediacy claims in either language, empty-valid versus failed wording, unconfigured default, zero/null handling, UTC/NPT formatting.
- Python (`tests/python/test_live_conditions.py`): registration byte equality, rejection of immediacy wording, missing translations, placeholder drift, duplicate glyphs or labels and impact estimates.
- Playwright (`tests/e2e/live-conditions.spec.ts`): normal, stale after clock advance, empty-valid versus failed, unavailable, corrupted snapshot with retry, corrupted index, shipped unconfigured index, air quality disabled with no requests, WebGL failure at 320px, 390px layout order, keyboard-only language switch and skip link, layer toggles.

Gates: `npm run check`, `npm run test:e2e:public`, `npm run release:check`.

## Maintenance rules

- Change bulletin wording only in the policy JSON, in both languages, then run `npm run data:live-conditions` under a **new version**; never overwrite `1.0.0`.
- Any new feed needs a purpose mapping, bulletin template in both languages and tests before it can appear.
- Do not render `snapshot.notice` or any other downloaded text as page copy; the page copy is reviewed policy.
- Do not add warning, hazard-level, impact or AQI wording without a reviewed source and standard.
