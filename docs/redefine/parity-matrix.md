# Redefine — feature parity matrix

The acceptance checklist for `feat/redefine`. Every route, module and user-visible capability that exists on `main` (at `edb768e`) is listed with what it does, where it lives today, which end-to-end test covers it, and where it lives after the redesign. A row is ticked only when the named test passes on the final commit of the branch.

Test names are abbreviated as `file › test`. All files are under `tests/e2e/`.

Legend: ✅ verified on the final commit (`npm run check` and all 127 Playwright tests passing) · ⚠ verified with a pre-existing caveat, stated in the row.

## Routes

| # | Route | What it does | Lives now | Covered by | After redesign | ✓ |
|---|---|---|---|---|---|---|
| R1 | `/` | Hero, today strip, three hazard cards, warning-service disclaimer | `app/page.tsx`, `components/today-strip.tsx`, `components/nepal-overview.tsx` | `ui-polish › home leads with the three hazards…`; `design-polish › homepage content renders before JavaScript…`; `mobile-app › hazard cards … snapping carousel` | Same files, rebuilt on the design system | ✅ |
| R2 | `/atlas/` | Interactive map of lakes, rivers, terrain, boundaries, optional layers; accessible boundary records | `features/atlas/*` and layer features | `admin-boundaries › *`; `focused-exploration › *`; `rivers › *`; `glacial-lakes › *`; `terrain › *`; `downstream-trace › *` | `features/atlas/*`: map stage and tabbed panel (desktop) or bottom sheet (phone) | ✅ |
| R3 | `/hazards/` (Today) | Daily official copy grouped by hazard, at-a-glance line, status bars, quake map and table, incidents | `features/hazards/*`, `components/today-visuals.tsx` | `hazards › *` (4 + 3 width checks) | Same modules, Stat / Badge / Card primitives | ✅ |
| R4 | `/simulate/` | Flood/GLOF and earthquake scenarios, 3D playback, results, share / JSON / report | `features/simulator/*` | `simulator › *` (14) | Guided three-step flow, shared panel shell, playback dock under the map | ✅ |
| R5 | `/simulate/report/` | Recomputed printable report with input hashes; JSON download | `features/simulator/report.tsx` | `simulator › a share link restores the scenario and the report recomputes…` | Same module, print-first layout | ✅ |
| R6 | `/live/` | USGS and NOAA GFS feeds: health, bulletin (EN/NE), map, tables, freshness / LAST KNOWN | `features/live-conditions/*` | `live-conditions › *` (12); `offline-shell › *` | Same module, consistent stat cards and badges | ✅ |
| R7 | `/official/` | Every official source in full, summary, tables as cards, last-known labels | `features/official/official.tsx` | `official › *` (4); `mobile-app › data tables become labelled cards…` | Same module, Stat / Badge / DataTable | ✅ |
| R8 | `/methodology/` | Long-form methods, TOC, anchors used across the site | `app/methodology/page.tsx` | `accessibility › core public pages…`; `language › one header switch…`; `mobile-app › every page…` | Long-form layout: sticky TOC (desktop), collapsible TOC (phone), back-to-top | ✅ |
| R9 | `/sources/` | Source directory by category with TOC | `app/sources/*` | `accessibility › core public pages…`; `mobile-app › every page…` | Long-form layout | ✅ |
| R10 | `/licenses/` | Licence ledger, notices, parent-rights blocking | `app/licenses/page.tsx` | `mobile-app › every page…` | Prose styles on the design system; the page is short, so it has no contents column | ✅ |
| R11 | `/offline/` | Fallback page with links to saved pages | `app/offline/page.tsx` | `offline-shell › pages outside the shell show the offline page…` | Same | ✅ |

## App shell and cross-cutting behaviour

| # | Capability | Lives now | Covered by | After redesign | ✓ |
|---|---|---|---|---|---|
| S1 | Four destinations (Map, Today, Scenarios, About) with `aria-current` | `components/site-navigation.tsx` | `design-polish › phone navigation…`; `mobile-app › phones get an app shell…` | Same component; top bar on desktop, bottom tab bar on phones | ✅ |
| S2 | English / नेपाली switch, remembered, sets `<html lang>` | `lib/i18n.tsx` | `language › one header switch…` | Same, in the redesigned top bar | ✅ |
| S3 | Skip link to `#main`; one `<main>` landmark | `app/layout.tsx` | `accessibility › keyboard users can skip…`; `accessibility › core public pages…` | Same | ✅ |
| S4 | Offline banner and "Reload to update" | `components/offline-shell.tsx` | `offline-shell › offline reload serves the shell…` | Same logic, OfflineBadge in the top bar plus the banner | ✅ |
| S5 | Service worker, checksum-pinned shell, LAST KNOWN, expiry | `service-worker/sw.template.js`, `scripts/prepare-service-worker.mjs` | `offline-shell › *` (8) | Unchanged; the shell must shrink, not grow | ✅ |
| S6 | Tables become labelled cards on phones (`data-label`) | `components/table-labels.tsx` | `mobile-app › data tables become labelled cards…` | Same, through the DataTable primitive | ✅ |
| S7 | 48 px touch targets with 8 px gaps; no sideways scroll; `touch-action: manipulation` | `app/mobile.css` | `mobile-app › every page keeps touch targets…`; `mobile › every page fits portrait and short landscape…` | Design-system sizing tokens and cascade layers, no `!important` | ✅ |
| S8 | Manifest, theme colour, safe areas, `viewport-fit=cover` | `app/manifest.ts`, `app/layout.tsx` | `mobile-app › phones get an app shell…` | Same, with a theme colour per scheme | ✅ |
| S9 | Forced colours and high contrast keep text cues | `globals.css` | `ui-polish › evidence and scenario states retain explicit non-color cues` | Tokens provide forced-colours and contrast variants | ✅ |
| S10 | Footer with Explore / About links and the evidence statement | `app/layout.tsx` | `mobile-app › every page…` (targets) | Same | ✅ |
| S11 | Hydration robustness against extension attributes | `app/layout.tsx` | `playwright.hydration.config.ts` suite | Same. The h1 case passes; the body case fails identically on `main`, because the dev server has no `/sw.js` (a 404 the test counts as an error). Not run in CI | ⚠ |

## Map (`/atlas/`)

| # | Capability | Lives now | Covered by | After redesign | ✓ |
|---|---|---|---|---|---|
| A1 | Map renders with WebGL; Asia bounds; minimum zoom fit | `features/atlas/atlas.tsx` | `admin-boundaries › static navigation, WebGL…`; `terrain › Asia zoom-out stays bounded…` | Same map setup, new chrome | ✅ |
| A2 | Boundary levels (country, provinces, districts, local) toggles | `atlas.tsx` (`#boundary-controls`) | `admin-boundaries › static navigation…` | Boundaries tab / sheet section | ✅ |
| A3 | Click a boundary → record details; accessible record picker and search | `atlas.tsx` (`#accessible-boundary-records`) | `admin-boundaries › *`; `accessibility › the map has a non-visual alternative…` | Records and search in the Boundaries tab (the map skip link opens it) | ✅ |
| A4 | Empty / stale / unavailable / corrupt boundary states with retry | `components/data-state.tsx` | `admin-boundaries › unavailable…`, `› corrupt…`, `› empty and stale…` | DataState rebuilt as status primitives | ✅ |
| A5 | No-WebGL fallback keeps records | `atlas.tsx` | `admin-boundaries › WebGL unavailable preserves…` | Same | ✅ |
| A6 | Reset view | `atlas.tsx` (`.reset-map`) | `admin-boundaries › static navigation…`; `ui-polish › desktop map stays dominant…` | In the map control cluster, same accessible name | ✅ |
| A7 | Shortcut navigation (Lakes, Rivers, Terrain, Boundaries, Infrastructure) | `atlas.tsx` (`nav[aria-label=Atlas controls]`) | `design-polish › map control tabs and anchors show the requested controls…` | Became the panel tabs; same names and anchors (`/atlas/#lake-controls` opens the Lakes tab) | ✅ |
| A8 | Glacial lakes: toggle, search, record, details, Trace water downstream | `features/glacial-lakes` | `glacial-lakes › *`; `focused-exploration › *` | Lakes tab | ✅ |
| A9 | Glacier outlines on request: search, record, details | `features/glaciers` | `glaciers › *` | Lakes tab (glaciers fold) | ✅ |
| A10 | Rivers: toggle, search (reach and GeoNames), click on map, details | `features/rivers` | `rivers › *` | Rivers tab | ✅ |
| A11 | Downstream trace: run, animate, pause/resume/replay, show all, fit, clear, list, locate, JSON, method | `features/downstream-trace` | `downstream-trace › *`; `rivers › a river line clicked…`; `focused-exploration › a selected lake traces…` | Rivers tab; reveal-map-then-play on phones | ✅ |
| A12 | Terrain: hillshade, 3D, exaggeration, inspect elevation by click or form | `features/terrain` | `terrain › *`; `performance › repeated elevation samples…` | Terrain tab | ✅ |
| A13 | Infrastructure and hydropower load on demand, classes, search, details | `features/infrastructure`, `features/hydropower` | `infrastructure › *`; `hydropower › *`; `focused-exploration › focused mobile view…`; `performance › desktop initial map…` | Infrastructure tab | ✅ |
| A14 | GLOF modelling availability statement and link to scenarios | `atlas.tsx` | `focused-exploration › physical model remains unavailable…` | Lakes tab | ✅ |
| A15 | Educational river simulation workbench (Level 1/2, compare A/B) | `features/simulation-ui` | (Vitest `tests/web/simulation-ui*.test.ts`) | Rivers tab, inside a disclosure | ✅ |
| A16 | Map key with shape plus text cues | `features/atlas/map-key.tsx` | `accessibility › the map has a non-visual alternative and its key…` | A chip on the map that opens upward, with the same shapes and text | ✅ |
| A17 | Skip link past the map | `atlas.tsx` | `accessibility › keyboard users can skip…`; `ui-polish › the map skip link stays hidden…` | Same | ✅ |
| A18 | Phone: map first, heavy layers deferred | `mobile.css`, `globals.css` | `mobile › phone map loads lakes, defers heavy layers…`; `admin-boundaries › mobile boundary map…` | Map stage with the bottom sheet | ✅ |

## Today (`/hazards/`)

| # | Capability | Covered by | ✓ |
|---|---|---|---|
| H1 | Sections for floods, glacial lakes, earthquakes and incidents, with status and UNKNOWN | `hazards › today is arranged around…` | ✅ |
| H2 | At-a-glance line; raised marker with text | `hazards › today is arranged around…` | ✅ |
| H3 | Status bars, wettest-station bars, quake map with table | `hazards › today is arranged around…` | ✅ |
| H4 | Last-known / stale note; copied time; links to agencies and `/official/` | `hazards › today is arranged around…` | ✅ |
| H5 | Nepali, including BIPAD's own Nepali titles | `hazards › today switches to Nepali…` | ✅ |
| H6 | No copy yet → message, still links to map and scenarios | `hazards › today says when no copy exists yet…` | ✅ |
| H7 | No sideways scroll at phone widths | `hazards › today at …px has no sideways scroll` | ✅ |

## Scenarios (`/simulate/`)

| # | Capability | Covered by | ✓ |
|---|---|---|---|
| X1 | Flood: release point (18 corridors), hydrograph inputs, assumptions before the run, acknowledgement, run, ranges, UNKNOWN impacts, share link | `simulator › flood corridor run shows assumptions first…` | ✅ |
| X2 | Invalid inputs are refused | `simulator › invalid declarations are refused…` | ✅ |
| X3 | Earthquake: Gorkha replay, presets, custom epicentre (map click), mechanism, VS30, rupture | `simulator › earthquake replay of Gorkha 2015…` | ✅ |
| X4 | Share link restores; report recomputes with hashes | `simulator › a share link restores…` | ✅ |
| X5 | Corrupt artifact refused; unavailable release retry | `simulator › a corrupted artifact…`; `› an unavailable release…` | ✅ |
| X6 | No WebGL: results stay in tables | `simulator › without WebGL…` | ✅ |
| X7 | 3D playback: pulse, scrubber, checkpoints, labels, route strip, Follow, Whole scenario, 2D/3D, full screen, Escape | `simulator › a flood run plays back in 3D…` | ✅ |
| X8 | Earthquake playback: shaking revealed behind the wave front, district labels | `simulator › an earthquake run reveals the modelled shaking…` | ✅ |
| X9 | Autoplay once visible (motion allowed) | `simulator › with motion allowed the playback starts by itself…` | ✅ |
| X10 | Keyboard run moves focus to the playback status, then to the result | `simulator › keyboard-only run moves focus to the playback status, then See results…` | ✅ |
| X11 | Nepali interface, Devanagari numerals, notice visible | `simulator › Nepali interface covers the run…` | ✅ |
| X12 | Phone: dock under the map; full screen covers the tab bar | `simulator › on a phone the playback controls sit under the map…` | ✅ |
| X13 | No sideways scroll at 320 and 390 px | `simulator › mobile …px has no sideways scroll…` | ✅ |
| X14 | Route list: districts in order, stream points, towns, border | `simulator › a flood run plays back in 3D…` (labels, route) | ✅ |
| X15 | Copy link, JSON download, printable report | `simulator › a share link restores…` | ✅ |
| X16 | **New:** after Run on a phone, the map comes into view and plays without a manual scroll | `redefine › phones › Run scrolls the 3D stage into view…`; `› with reduced motion, Run jumps…` | ✅ |

## Live (`/live/`) and Official (`/official/`)

| # | Capability | Covered by | ✓ |
|---|---|---|---|
| L1 | Health grid, recheck button, announcement | `live-conditions › normal publication…` | ✅ |
| L2 | STALE after deadlines without a new fetch | `live-conditions › stale feeds and workflow…` | ✅ |
| L3 | Empty, failed, unavailable and corrupted feeds stay distinct; retry | `live-conditions › valid empty…`, `› unavailable feed…`, `› corrupted snapshot…`, `› corrupted index…` | ✅ |
| L4 | Unconfigured index; air quality disabled | `live-conditions › the shipped unconfigured index…`; `› air quality stays disabled…` | ✅ |
| L5 | No WebGL at 320 px; 390 px bulletin before the map; keyboard Nepali | `live-conditions › records remain usable…`; `› mobile 390px…`; `› keyboard-only users…` | ✅ |
| L6 | Layer toggles announce status | `live-conditions › layer toggles are keyboard operable…` | ✅ |
| O1 | Official: organised copies, last-known, UNKNOWN | `official › official sources show organised copies…` | ✅ |
| O2 | No copy yet; stale river flags apart; incident windows | `official › official sources say when no copy…`; `› river flags from old readings…`; `› incident lists say their window…` | ✅ |

## Inputs and keyboards

| # | Capability | Covered by | ✓ |
|---|---|---|---|
| K1 | Search fields: `autocapitalize=none`, `autocorrect=off`, `spellcheck=false`, `enterkeyhint=search` | `mobile-app › fields bring up the right keyboard…` | ✅ |
| K2 | Number fields: `inputmode=decimal`, 16 px text | `mobile-app › fields bring up the right keyboard…` | ✅ |

## New capabilities added by the redesign

| # | Capability | Covered by | ✓ |
|---|---|---|---|
| N1 | Light / dark / system theme switch, remembered, applied before paint | `redefine › the colour theme can be chosen, persists…` | ✅ |
| N2 | Atlas bottom sheet on phones (peek / half / full), keyboard operable | `redefine › phones › the controls sheet steps through peek, half and full…` | ✅ |
| N3 | Reveal map then play: Run (Scenarios) and Trace (Map) on phones | `redefine › phones › Run scrolls…`; `› Trace lowers the sheet…` | ✅ |
| N4 | Automated accessibility audit (axe) on every route, both languages and themes | `axe › *` (22: every route, English light at 390 px and Nepali dark at 1440 px) | ✅ |
| N5 | Performance budgets: CLS ≤ 0.1 and page HTML ≤ 240 kB on every route (LCP, INP and map readiness are measured by `scripts/ui-audit.mjs` and recorded in `docs/performance.md`) | `budgets › *` (11) | ✅ |
