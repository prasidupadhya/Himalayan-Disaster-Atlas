# Time Machine — feature 22

Implemented on `feat/water-change-time-machine` as a separate commit after Water Change.

## Temporal contract

`schemas/temporal.schema.json` and `packages/contracts/temporal.ts` define one registry of versioned products and ordered, non-overlapping UTC observation intervals. Acquisition, publication/item creation and retrieval are separate fields. Null publication dates display UNKNOWN and never determine selection. Intervals are half-open: start inclusive, end exclusive. Instant acquisitions use a one-millisecond index interval without claiming millisecond sensing accuracy. Daily event bins are UTC occurrence days; monthly climate bins cover exactly one whole month. Invalid calendar dates, non-UTC timestamps, duplicate identities, overlaps and malformed month/day intervals fail validation.

`atlas-time-index/1.0.0` indexes three Phewa observations, three satellite context windows, 360 POWER months and every represented BIPAD event day. It pins the input manifest hashes; those manifests pin the source artifacts. Python validation regenerates the index and event counts from immutable releases and compares exact public bytes. `npm run data:time-machine` verifies an existing release instead of replacing it. A new source release requires a new index version and viewer registration. Inventory/context metadata retain their own dates and temporal precision, including UNKNOWN.

## Selection and comparison

Enable **Synchronize observation date** and choose a UTC day. Water masks/map, satellite map, climate chart/focus month and BIPAD event map/list all follow it. The product menu only chooses which product’s available dates to browse; it does not change which components synchronize. Previous/next and the available-date menu require explicit user action. They never auto-select a nearest date.

Daily selection of a monthly climate product selects its whole month and its annual chart, highlights that month, and labels the value monthly. Dates outside the 1991–2020 series are unavailable. No daily climate interpolation is performed. Event dates use occurrence timestamps, not report timestamps; a missing day is no indexed record, not evidence that no disaster occurred. The list remains capped at 200 and local hazard/text filters still apply. All matching event points use the same UTC date filter.

A water before/after pair must be chronological and on the same versioned grid/method. Its own 80% window and water-union coverage gate still controls metrics; true-colour imagery may be inspected even when change statistics are unavailable. Same-grid Sentinel-2 A/B observations share the Collection 1 processing method, but instrument differences remain explicit uncertainty. Satellite context windows have no comparison compatibility key because dates also change footprint; they cannot be interpreted as a change product. Climate and water cannot be compared as though they were the same measurement.

Missing observations remove the corresponding image layer immediately and clear obsolete values/images. Disabling synchronization restores the local product selections. Boundaries, terrain, glacier/lake inventories, event-specific flood/landslide/earthquake products, infrastructure and exposure scenarios remain dated context, explicitly listed outside synchronization. The feature does not reconstruct those inventories historically.

## Resource lifecycle and bounds

The index is limited to 2 MiB and verified against its build-pinned SHA-256. Images remain limited to 4 MiB apiece. Verified image and series bytes share a 16 MiB LRU cache keyed by artifact path and hash. The cache stores only resolved, verified bytes and returns copies; it does not retain failures, in-flight requests or aborted results. Layer cleanup aborts outstanding requests, removes sources/layers and revokes object URLs. Race checks prevent delayed old-date imagery from replacing the current date. Satellite visibility is applied when its asynchronous image mounts, fixing the previous toggle/selection timing race. Satellite images sit above raster/hillshade terrain and below vector overlays, so the terrain backdrop cannot hide the selected scene.

## Validation

Unit tests cover missing/duplicate dates, UTC and leap/year boundaries, monthly precision, incompatible comparisons and cache eviction/copy isolation. Python tests reproduce the index and all 57,216 event counts from their source releases. Browser tests exercise synchronization, unavailable dates, monthly chart selection, before/after imagery, event filtering, corrupt index retries and rapid date changes. No remote service is needed at runtime.
