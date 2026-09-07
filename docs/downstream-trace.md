# Downstream trace handoff

Feature 8 lives on `feat/downstream-trace`, based on merged main `c90d1ac` (features 1–7). The master brief's river-network navigation and animated path are implemented using the existing release. No new geographic artifacts or inferred source relationships are introduced.

## Operation

Select a river on the map, or search its HYRIV ID in Rivers, then choose **Trace downstream**. The map frames the retained route and reveals whole reaches in downstream order. Pause/resume, replay, show-all, fit, clear, a paginated ordered reach list and per-reach locate controls support mouse and keyboard use. Reduced-motion preferences show the full route immediately. Changing the selected river clears the previous route. Source river visibility does not hide the derived route.

The displayed length sums source `LENGTH_KM` for complete reaches, including the selected reach, rounded to 0.001 km for stable numerical output. This precision reflects stored source values, not accuracy. Clicking partway along a reach does not prorate its length. Geometry remains OGC:CRS84; MapLibre handles the display projection. No distance is measured in screen pixels or degrees.

## Topology and failure handling

`packages/contracts/downstream.ts` requires both checksum/schema-validated river partitions at 1.0.0. It checks cross-partition ID uniqueness, valid nonnegative lengths, complete `NEXT_DOWN` attributes, consistency of `downstream_in_release`, and cycles across the entire graph. Iterative validation is O(V+E); traversal is O(path length). No recursive walk or spatial proximity inference is used.

Each source pointer is followed exactly once. At the first unavailable target the output is `coverage_boundary`, with the missing HYRIV ID retained. This is not an outlet or a complete route to the sea, even if a subsequent reach might re-enter Nepal. A null source pointer produces `source_outlet`, which may represent an inland sink or ocean outlet. Missing/corrupt partitions disable tracing and use the river resource's retry flow. Topology errors prevent trace generation while leaving source river inspection available.

The checked-in graph has 18,299 reaches. A regression case beginning at HYRIV 40669746 traverses 180 retained reaches and stops before unavailable HYRIV 40768704. Tests also cover cross-partition confluences, cycles, duplicate IDs, invalid lengths, missing internal targets, unknown starts, single-reach/outlet paths and deterministic results independent of partition order.

## Result and provenance

`DownstreamResult` is an in-memory, derived analysis contract, not a replacement for the immutable vector dataset schema. JSON download includes `hydrorivers-next-down/1.0.0`, evidence/status, CRS, ordered IDs, summed source lengths in km, termination and next ID, both dataset versions and artifact SHA-256 values, and limitations. There is no runtime backend, saved session or new acquisition. Source licence and uncertainty remain those of [the river release](rivers.md).

The independent gold overlay copies only retained source geometry and an ordering index. It neither connects geometric gaps nor assumes digitization direction. Animation reveals reaches in pointer order over an illustrative four seconds; it encodes no travel time, velocity or within-reach direction. Cleanup cancels playback and removes layers before the source on clear, selection change and unmount. Source river selection and visibility remain independent.

## Scientific scope and dependencies

This is network analysis, not hydraulic inundation, hazard classification, a forecast, travel time or confirmed exposure. No DEM-derived flow or lake-to-nearest-river snap is used. The GLO lake and RGI glacier releases do not identify verified outlet-to-HYRIV connections. Their selection panels explicitly keep downstream relationships UNKNOWN; a river can be selected separately without asserting a link. Hazard-source origins likewise require an evidence-backed connection before they can be supported.

Settlement, road, bridge, hydropower, critical-facility and population intersections depend on the later source layers and exposure feature. They remain UNKNOWN here. Supporting the entire master-brief chain requires those inputs and explicit outlet-link provenance, not invented geometry or exposure values.

## Verification

Run `npm run check` and `npm run test:e2e`. Browser coverage exercises playback, clear/retrace, selection changes, source visibility, JSON export, missing-partition retry, no duplicate river downloads, reduced motion and mobile overflow. Tests save map and mobile screenshots in ignored `test-results/`.

Reference: [HydroRIVERS v1 technical documentation, attribute definitions](https://data.hydrosheds.org/file/technical-documentation/HydroRIVERS_TechDoc_v10.pdf).
