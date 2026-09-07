# Exposure engine handoff

Feature 18 is on `feat/exposure-engine`, based on main `0b4bb31`. It provides an offline calculation engine and a static viewer for immutable results. It introduces no live API or backend.

## Scientific meaning and supported inputs

Exposure here means an asset's geometry intersects a declared area, or a modelled population grid contributes an area-weighted count to that area. It is separate from vulnerability, hazard probability, risk, damage and confirmed losses. Outputs say **potentially exposed** or **potentially intersecting**.

The request contract is `schemas/exposure-request.schema.json`. Inputs must be nonempty, valid, explicitly closed Polygon/MultiPolygon geometries in OGC:CRS84 (longitude, latitude), within 79–89°E and 25–32°N. Holes are respected. Invalid topology, projected coordinates, swapped axes, Z coordinates, nonfinite coordinates, bare river lines and event points are rejected. No implicit repair, reprojection guess, point buffer or hazard extent is invented. The request identifies/version-controls the footprint and its declared input sources, and carries assumptions. Supported meanings are `hypothetical_corridor`, `modelled_scenario` and `observed_footprint`; source classification and lineage must be reviewed before publication.

Two prepared examples use the 180 retained reaches downstream of HYRIV 40669746, terminating before unavailable HYRIV 40768704. A local azimuthal equidistant projection centred at 82°E, 28.5°N defines buffers of 250 m and 1,000 m on each side (round caps/joins, 16 segments per quadrant, 1 m topology-preserving footprint simplification). The widths are explicit hypothetical choices, unrelated to hydraulic flood extent, terrain, discharge, severity or probability. These scenarios are never silently applied to an arbitrary selected trace.

## Native population overlay

Only the pinned WorldPop Nepal 2025 R2025A v1 GeoTIFF is accepted by the publication pipeline (SHA-256 `b7b581e181df5e2f84b2e20d3455429393829395619a9600e45c6907674a0639`). It has 9,773 × 4,921 native 3 arc-second EPSG:4326 cells, Float32 people per cell and explicit NoData. The source is about 31 MiB and remains outside Git. Unpinned external mask/PAM sidecars are rejected. Display PNGs, bilinear resampling and log-intensity decoding cannot supply population measurements.

For footprint H and each valid native cell C with population P:

`weight(C) = area(H ∩ C) / area(C)`

`known population subtotal = Σ P(C) × weight(C)`

Areas use equal-area EPSG:6933 in square metres. Geographic footprint/asset edges are densified to at most 0.001° before projection; native cell edges are preserved exactly by the cylindrical equal-area transform. Fully covered cells receive weight 1, boundary cells use polygon intersection, holes contribute nothing, and disjoint geometry is not counted twice. This assumes uniform allocation within a cell; WorldPop provides no within-cell distribution or local confidence interval here. The method does not increase source resolution.

Valid zero is zero. NoData is not zero. The result reports the area covered by valid population cells, area whose population is unknown, and area outside the grid separately. When unknown area remains, `total_population` is null; `known_population` is the partial subtotal (null if no valid cell contributes). An empty footprint intersection alone does not establish zero population in an uncovered region. Numerical area tolerance is max(0.001 m², footprint area × 1e-10), used only for floating-point roundoff. Display rounds counts to people and areas to 0.01 km²; JSON retains arithmetic precision for reproducibility, not an accuracy claim.

## Vector intersections and deduplication

The engine loads all 11 infrastructure partitions and the hydropower partition through the existing source schema/checksum verifier. It builds an STRtree for candidate search. Points, lines and polygons count once when they intersect the footprint, including a boundary-only touch. Polygon assets count as whole assets, not fractional asset counts. Spatial output contains the intersecting geometry, which may be a point for a line/polygon touch.

Canonical identity is `osm/<element type>/<element id>`, independent of dataset partition or category. Duplicates within a category must agree geometrically or calculation fails. A road way and its bridge-centre representation can legitimately differ: each category's geometry is tested separately, then the matching canonical identity is counted once globally. Thus a road intersection cannot manufacture a bridge intersection. Category counts can overlap; they cannot be summed as a unique total. Administrative asset assignment also uses the unique identity.

Major-road counts are OSM way records, not named roads. Source road simplification and country clipping make edge intersections approximate. Facility/bridge way and relation centres are representative points, not complete structural footprints; an intersecting footprint can miss a facility whose centre lies outside. Buildings and dams have no included inventory and return null/UNKNOWN. Zero for available classes means zero mapped intersections, never proof of no infrastructure. No capacity or casualty estimate is inferred.

## Administrative aggregation

COD-AB district polygons are transformed to the area CRS. District intersections are processed in P-code order; previously assigned area is subtracted so any overlapping polygon coverage is assigned to the lowest P-code. Remaining area is an explicit UNASSIGNED row. Population is recomputed on these disjoint footprint pieces using the same cell fractions, so shared boundary cells are split rather than counted wholesale twice.

A unique matched asset is assigned to the district with the greatest intersected polygon area, or projected line length for lines, or coverage for points. Lowest P-code breaks ties; unassigned coverage comes last. This is an accounting convention, not a claim that cross-district infrastructure exists in only one district. Areas and unique-asset counts reconcile to the overall result. Source display-boundary uncertainty remains applicable.

## Running and publishing

Requirements are pinned in `requirements.lock`. `requirements.txt` explicitly includes NumPy and Rasterio used by the engine. No raw source acquisition occurs during the root build.

```bash
# Prepared examples; use the already pinned native raster.
npm run data:exposure -- --examples --population /path/to/npl_pop_2025_CN_100m_R2025A_v1.tif

# Any supported versioned polygon request, using the same source snapshots.
npm run data:exposure -- --request /path/to/request.json --population /path/to/npl_pop_2025_CN_100m_R2025A_v1.tif

# Full-country benchmark, without publishing a hazard scenario.
npm run data:exposure -- --benchmark-nepal --population /path/to/npl_pop_2025_CN_100m_R2025A_v1.tif
```

Download an example `request.json` from the viewer as a format reference. Use a new identity/version for changed inputs, document the actual footprint source and assumptions, and register a new result path in `apps/web/lib/exposure.ts` after review. Do not relabel an event location or existing corridor as an observed flood extent.

The engine stages under ignored `data/processed/exposure`, verifies all outputs, and copies them to `data/releases/<result>/<version>` and the exact public mirror. Existing versions reject changed run hashes or recomputed numerical/spatial differences. A matching rerun preserves the original recorded calculation time. Result identity includes the canonical request, input versions/hashes and method version. Population provenance uses the native GeoTIFF hash, not the web-tile inventory hash.

Result schema 4.0.0 in `schemas/exposure.schema.json` is additive; prior vector/raster releases are unchanged. The result includes method/version, actual calculation timestamp, source versions/hashes/licences, CRS, footprint meaning, population coverage/subtotals, canonical assets, category counts, administrative rows, assumptions and uncertainty. `request.json` and `spatial.geojson.gz` are hashed artifacts. Requests/results are limited to 2 MiB each, spatial output to 2 MiB compressed and 8 MiB decoded. Larger footprints/results require partitioned delivery rather than relaxed browser limits. The viewer validates before mounting and retains numeric inspection without WebGL; failed files support retry and old overlays are removed when switching scenarios.

## Verification and performance

Synthetic raster fixtures contain full, half, zero and NoData cells with exactly known expected answers. Tests cover holes/overlap, empty versus outside-grid coverage, CRS errors, negative values, point/line/polygon boundary contacts, duplicate/conflicting assets, separate road/bridge representations, administrative ties and 10,000 indexed assets. Browser tests cover result switching, provenance/download links, unknown inventories, corrupt/missing spatial data, retry, layer visibility, mobile overflow and no-WebGL inspection. Run `npm run check` and `npm run test:e2e`.

A macOS ARM64 reference run (Python 3.12.8, Shapely 2.1.2, Rasterio 1.4.4) processed the full Nepal footprint, 43,656 asset records and the native 48,092,933-cell grid in 25.7 seconds, with 678 MB peak resident memory. This includes source validation/loading and an indexed vector overlay; it excludes per-district reruns and publication. The two complete corridor runs including district summaries took approximately 5.5 seconds each after source loading; peak process memory was approximately 459 MB. Native reads use bounded 64-row windows and no resampling. These are measured development-machine results, not browser/device or hosting guarantees. Metrics are reproducible with the benchmark command and written outside Git.

## Sources and limitations

The feature reuses existing [population](population.md), [infrastructure](infrastructure.md), [hydropower](hydropower.md), [river](rivers.md) and [boundary](admin-boundaries.md) evidence. WorldPop CC BY/derived-data licensing nuance and OSM ODbL notices remain applicable; no new redistribution permission is inferred. See [Rasterio masks](https://rasterio.readthedocs.io/en/stable/topics/masks.html), [windowed raster access](https://rasterio.readthedocs.io/en/stable/topics/windowed-rw.html) and [Shapely spatial indexes](https://shapely.readthedocs.io/en/2.1.2/strtree.html) for the underlying processing operations.
