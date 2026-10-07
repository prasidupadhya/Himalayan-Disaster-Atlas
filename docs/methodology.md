# Public methodology maintenance — feature 34

The public `/methodology/` page is the canonical plain-language description of what the checked-in software currently does. It is not a roadmap and must not describe algorithms, datasets, uncertainty estimates, or model validity that the repository does not implement.

## Stable section contract

Every current production record in `atlas-provenance@1.2.0` carries a `methodology_href`. The automated methodology-link test requires the referenced section ID to exist in the public page. Adding a new production release therefore requires either reusing a scientifically correct existing methodology family or adding a new public section before validation can remain green.

The page covers the overall offline acquisition → validation → transformation → immutable-publication pipeline; CRS/projection choices; raster/vector handling; display simplification/tiling; downstream tracing; exposure calculations; hazard-graph semantics; scenario/simulation semantics; search/comparison; and evidence retrieval.

## Terminology contract

Use the following terms consistently across UI, documentation, catalog, and provenance:

- **Observed** — supplied measurement/record from a documented source.
- **Reported** — source assertion or event report, not automatically independent observation.
- **Historical** — past/archival source record; not automatically current.
- **Derived** — deterministic calculation from source data using a documented method.
- **Estimated** — quantified estimate with explicit assumptions or incomplete coverage.
- **Modelled** — output of a computational model or hypothetical spatial assumption.
- **Simulated** — a parameterized model run; never automatically a forecast.
- **Hypothetical** — explicitly assumed input/scenario, not an observed event.
- **Unknown** — reliable information is unavailable or the concept does not apply.

Zero, UNKNOWN, unavailable, incomplete/partial coverage, and incompatible are different states and must never be collapsed into one value.

## Precision and geometry

Screen resolution is not analytical resolution. Web Mercator display tiles, RGB terrain, simplified vectors, preview imagery, and schematic graph layouts remain presentation products unless a feature explicitly documents them as numerical inputs. Equal-area calculations use the documented analysis CRS; source/native grids are retained where numerical semantics depend on them.

## Change discipline

When implementation changes, update the methodology in the same feature branch and keep the corresponding catalog/provenance links valid. Important assumptions and limitations belong on the public feature/page itself as well as in deeper documentation; they must not be hidden only in this file.

Feature 42’s `/methodology/#live-contracts-method` explains evidence/purpose, source-time freshness, workflow health, bounded checksums, valid empty versus failed fetch and null-only physical/damage outputs. Acquisition and the live page are not implemented. See [Live contracts](live-contracts.md).

Feature 43 normalizes USGS reported epicentres and one precisely decoded six-hour GFS model forecast interval; it does not derive warnings or impacts. Source time governs freshness, failure retains stale data and valid empty is not all-clear. Publication uses an atomically promoted index after immutable source checks. See [full methodology](live-open-feeds.md).

Feature 45 preserves original PM2.5 periods, units and flags; usable values remain UNKNOWN for flagged or unknown-quality/period readings. AQI has no reviewed standard and remains UNKNOWN. Public delivery is disabled independently of the research flag. See [air-quality method](live-air-quality.md).

Feature 46 generates bulletin sentences only from verified snapshots with fixed bilingual templates, recomputes FRESH/STALE/UNAVAILABLE on the viewer's clock and labels observation, reported event, model forecast and official warning without colour. GFS cells are displayed without interpolation; legend bins are not hazard thresholds. See [live conditions method](live-conditions.md).


Feature 47 never alters timestamps: offline copies are labelled LAST KNOWN with their device save time, freshness is recomputed from source times, and copies past the seven-day retention are deleted rather than served. See [offline shell](offline-shell.md).

## Scenario simulator (Features 48–51)

Population inputs: [HRSL population](hrsl-population.md). Flood/GLOF corridors and hydrograph translation: [flood corridors](flood-corridors.md). Ground motion: [earthquake shaking](earthquake-shaking.md). Uncertainty is expressed only as declared sensitivity (celerity ensemble, corridor widths) or the published model sigma — never as invented percentage bands.
