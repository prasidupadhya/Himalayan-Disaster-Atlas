# Public methodology maintenance — feature 34

The public `/methodology/` page is the canonical plain-language description of what the checked-in software currently does. It is not a roadmap and must not describe algorithms, datasets, uncertainty estimates, or model validity that the repository does not implement.

## Stable section contract

Every current production record in `atlas-provenance@1.0.0` carries a `methodology_href`. The automated methodology-link test requires the referenced section ID to exist in the public page. Adding a new production release therefore requires either reusing a scientifically correct existing methodology family or adding a new public section before validation can remain green.

The page covers the overall offline acquisition → validation → transformation → immutable-publication pipeline; CRS/projection choices; raster/vector handling; display simplification/tiling; downstream tracing; exposure calculations; hazard-graph semantics; scenario/simulation semantics; search/comparison; and evidence retrieval.

## Terminology contract

Use the following terms consistently across UI, documentation, catalog, and provenance:

- **Observed** — supplied measurement/record from a documented source.
- **Historical** — past/archival source record; not automatically current.
- **Derived** — deterministic calculation from source data using a documented method.
- **Estimated** — quantified estimate with explicit assumptions or incomplete coverage.
- **Modelled** — output of a computational model or hypothetical spatial assumption.
- **Simulated** — a parameterized model run; never automatically a forecast.
- **Unknown** — reliable information is unavailable or the concept does not apply.

Zero, UNKNOWN, unavailable, incomplete/partial coverage, and incompatible are different states and must never be collapsed into one value.

## Precision and geometry

Screen resolution is not analytical resolution. Web Mercator display tiles, RGB terrain, simplified vectors, preview imagery, and schematic graph layouts remain presentation products unless a feature explicitly documents them as numerical inputs. Equal-area calculations use the documented analysis CRS; source/native grids are retained where numerical semantics depend on them.

## Change discipline

When implementation changes, update the methodology in the same feature branch and keep the corresponding catalog/provenance links valid. Important assumptions and limitations belong on the public feature/page itself as well as in deeper documentation; they must not be hidden only in this file.
