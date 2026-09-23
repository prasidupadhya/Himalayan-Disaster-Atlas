# Focused Nepal exploration and physical GLOF project

`/atlas/` prioritizes glacial lakes, terrain, river connectivity, reviewed administrative names and opt-in infrastructure. It does not mount earthquake/disaster history, stations, climate, glaciers, population, search, comparison, hazard graph, time-machine or duplicate scenario panels. Province fills and local boundaries begin off; district outlines remain zoom-aware. Roads/facilities and hydropower require an explicit load action. The educational river simulator is inside a disclosure and is mounted only when opened. `/research/` preserves the existing wider feature workspace and its independent regression coverage. It retains the public release's licensing exclusions.

A selected GLO lake is the subject of the physical-model readiness panel, not automatically snapped onto a nearby river. The source provides no verified outlet/reach identity. No physical footprint or damage estimate is fabricated. The dedicated offline project is documented in [processing/glof](../processing/glof/README.md); its input-readiness inventory includes all 4,150 Nepal/transboundary lake records, with outlet-to-Nepal connectivity unknown until reviewed.

## Naming review

- The 77 district names were checked against the user's chosen district reference. `Rukum East`/`Rukum West` display as `Eastern Rukum`/`Western Rukum`; original spellings remain visible.
- All 753 local-government names were compared to the NSO local-level directory after removing administrative suffixes, case and whitespace. 751 matched. Manang Ngisyang is the municipality's verified full name. Dodhara Chandani is corroborated by Kanchanpur district administration; the directory's `Chadani` variant does not replace it.
- These are district and local-government names, not an exhaustive verification of every settlement or proof that a municipality label point is a city centre. Duplicate names retain their P-code identity. Source artifact bytes are unchanged.
- Reproducible review records and source hashes are in `docs/audits/`. The three presentation overrides live in `administrative-names.ts`; source names stay intact and each override has a reference link.
- A new immutable `nepal-river-names@1.0.0` gazetteer contains 12,831 GeoNames STM/STMI points, original spellings, bounded source aliases, stable IDs and edit dates. It supports accent-insensitive searches, a bounded result list and one selected name marker. No HydroRIVERS reach is automatically named, nor are names propagated through confluences. An unverified reach identity remains UNKNOWN.

Source: https://www.geonames.org/export/ (CC BY 4.0). NP.zip SHA-256 `3d96bfd38e278e58877eeae6e69fdc534ebfacb6b954ce2c86939f7a768de3eb`; HTTP Last-Modified 2026-09-22 01:51:37 UTC. Reproduce using `.venv/bin/python -m pipelines.atlas_pipeline.river_names --source /path/to/pinned-NP.zip`. This is a gazetteer snapshot, not an official exhaustive naming authority.

The provenance catalog advances immutably to 1.1.0. The original 1.0.0 catalog remains available and verifies its historical entries, while the active catalog must cover every release. Source terms, attribution and the complete public-tree hash are reviewed for the added release. No unresolved dataset rights are bypassed.

## Physical model scope

ANUGA 4.0.1 solves water-only shallow-water equations offline over a reviewed premeshed domain and an assumed instantaneous breach. The project includes synthetic dry dam-break analytical comparison at two mesh resolutions, lake-at-rest verification, mass-balance checks, provenance/CRS/input gates, an all-lake readiness inventory, and immutable research outputs. Neither the source lake inventory nor successful numerical benchmarks validates a real GLOF. No real-lake physical result is enabled on the public map yet. Sediment, breach growth, structural vulnerability and destruction require additional models and evidence. See the model README for concrete input and publication requirements.

The immutable time index continues verifying its recorded context releases, rather than demanding newly added timeless gazetteers be retroactively inserted. Its temporal products, dates, input hashes and context entries remain unchanged; the new naming layer is not synchronized by Time Machine.

## Verification (2026-09-23)

- `npm run check`: passed, including immutable data verification, 69 Python tests, 128 web tests, TypeScript, lint, public build and security checks.
- Full research build and 76 browser scenarios exercised. An old population-test route was corrected; it and a climate-loading timeout passed targeted reruns.
- Public Cloudflare suite: all 43 scenarios passed across the suite and targeted reruns. The final full run passed 41, with two loading timeouts accompanied by local Wrangler dropped-connection warnings; both passed against a fresh preview process. No timeout assertions were weakened.
- `npm run release:check`: passed; the 19 releases with unresolved rights remain absent from the public export. The export contains 1,248 files (71.8 MiB), each below the hosting size limit.
- Optional pinned ANUGA environment: synthetic analytical/refinement and lake-at-rest benchmarks passed; the end-to-end adapter test passed mass conservation, output checksum, unknown damage/exposure and immutable-output checks. These are numerical verification results, not validation of any real Nepal GLOF.
- Desktop and mobile layouts were inspected. The public export can be previewed with a static server; physical jobs are not run in the browser or hosting build.
