# Foundation architecture

## Application and feature boundaries

Use React + TypeScript + Next.js App Router with `output: 'export'` and trailing slashes. Routes render at build time; there is no persistent backend, authentication, personal storage, analytics, or private runtime API. Public interaction state exists only in memory. Root navigation includes the working sample and the evidence pages; later feature owners add routes when functionality exists.

`app/` composes routes. `features/<feature>/` owns domain UI; shared `components/` implements evidence and resource-state patterns. `packages/contracts` owns browser validation. Components cannot import acquisition code, raw data, processed data or Node APIs. ESLint enforces that boundary. Heavy map code is dynamically imported only on the Atlas route.

The root `<body>` suppresses hydration attribute warnings one level deep because browser extensions such as Grammarly add attributes before React hydrates. This is covered by a development-mode regression test. Mismatches inside application content remain visible and must be fixed rather than suppressed.

MapLibre GL JS is the primary map engine. The administrative atlas uses a local background style and compressed GeoJSON, so no external basemap or tile service is needed. Map layers mount only after both validation and style load. Each source ID includes dataset ID and version. The renderer promotes a private copy of each canonical string ID so tile encoding cannot discard selection identity. Public feature properties are unchanged. Administrative layers use zoom-dependent visibility, stable P-code selection, seven validated province label points, and separate styling for special-area pieces. Shared controllers set visibility and dispose layers before sources; unmount aborts pending requests and removes the map.

MapLibre 6 uses an external ES module worker. Root dev/build scripts copy the pinned worker, shared module and BSD notice into an ignored, versioned public vendor directory and configure its local URL explicitly; Next bundling must not infer the worker URL. Readiness waits for the map to become idle after source processing.

No deck.gl, Three.js, Tailwind, animation framework, or global state library is installed yet: none is required for the foundation acceptance criteria. MapLibre supports the sample; later performance/terrain/3D work may add focused adapters without changing the dataset contract. The initial CSS is functional scaffolding; the final visual pass remains `feat/ui-ux-polish`.

## Data flow

```text
external/public source OR local fixture
    → acquisition with retained source bytes and hash
    → cleaning and normalization
    → shared schema + spatial/topology validation
    → versioned immutable release
    → small public artifacts / future range-addressable assets
    → manifest-first browser loading + checksum verification
    → map + accessible feature inspection + provenance
```

`data/raw` and `data/processed` are ignored. Production downloads are not public just because they are accessible. Acquisition adapters must first document source accessibility, license, version and redistribution rights. The fixture pipeline intentionally uses local CSV acquisition, preserving the exact original bytes. It does not impersonate an authoritative data source or silently use live APIs.

Checked-in fixture release metadata includes a fixed acquisition/processing timestamp, representing the deterministic fixture release recipe, not the clock time of each rerun. Real acquisition pipelines must record actual retrieval/processing instants and publish new versions. Re-running the fixture yields identical output; changing a published version fails. Publication preflights file conflicts but is not a transactional multi-file storage system; production delivery should publish an entire release atomically and only then update a catalog pointer.

## Static delivery budgets

| Artifact | Use and delivery |
| --- | --- |
| GeoJSON / gzip GeoJSON | Small inspectable layers, at most 2 MiB compressed and 8 MiB decoded per artifact; manifest at most 64 KiB |
| PMTiles / vector tiles | Large roads, rivers, buildings and inventories; viewport-driven requests |
| COG | Raster source/analysis access with range support; tiled visual products for the map |
| GeoParquet | Offline analytical tables and geometry; not a default browser payload |
| DEM raster tiles | Future visualization derived from documented DEM source and vertical datum |

GeoJSON and deterministic gzip-wrapped GeoJSON are implemented. The browser verifies compressed bytes before bounded decompression and schema validation. Extend the schema with a new version and a delivery adapter before using other formats. Large originals/intermediates stay outside Git. Future artifact hosting must provide CORS where needed, correct MIME types, byte-range requests, size limits, immutable version URLs, and checksums. A manifest references one artifact in v1; multi-artifact releases require an explicit contract extension.

The river feature keeps the v1 one-artifact contract by publishing two independently versioned dataset partitions. Each stays below both GeoJSON budgets, while stable `HYRIV_ID` / `NEXT_DOWN` values preserve the logical network across the delivery boundary. This is a presentation partition, not a topological cut or analytical simplification.

The glacier feature uses the same immutable one-artifact contract with three west/central/east presentation partitions. Stable RGI/GLIMS IDs, source area and source outline dates are invariant across the partitions. Invalid GLIMS WFS display geometries are repaired only for rendering and QA records every repair; the source RGI area remains the measurement contract.

## User-visible states

`Resource<T>` separates loading, ready, empty, unavailable, error and stale. Missing files (404/503) are unavailable; invalid schema/checksum is an error and is not rendered. Loading is announced, retry is available after failure, and empty means no records rather than zero measured values. Updating datasets require an explicit stale deadline; a stale snapshot stays inspectable with a notice. Static inventories do not acquire a false live/stale claim from age alone. The current UI evaluates freshness on load; operational features must add deadline-driven refresh/stale transitions.

A failed WebGL context keeps validated records available to screen readers and keyboard users. Loading remote artifacts is cancellable and bounded. Simulation computation is not performed on the rendering thread.

## Scientific extension boundary

Future simulation engines must be model-agnostic and return separate scenario inputs and modelled outputs, with model/version, input dataset versions, assumptions, units, CRS/vertical datum, uncertainty, validation status, and output resolution. Store immutable run metadata and hashes. Never relabel a scenario as observed, a trace as hydraulic inundation, or an exposure estimate as confirmed damage. No fake scenario endpoint or simulation algorithm is introduced by Foundation.

## Framework references

- [Next.js static exports](https://nextjs.org/docs/app/guides/static-exports)
- [MapLibre GeoJSON sources](https://maplibre.org/maplibre-gl-js/docs/API/classes/GeoJSONSource/)

## Terrain extension

`schemas/terrain.schema.json` adds schema 2 raster delivery while existing schema 1 vectors remain immutable. `packages/contracts/terrain.ts` validates the raster manifest and complete XYZ inventory; `terrain_contracts.py` verifies every release tile and public copy. Canonical source/evidence fields are referenced from the existing central schema. Raster metadata explicitly distinguishes geographic coverage, native EPSG:4326 samples, display EPSG:3857 pixels and EGM2008 vertical metres.

`features/terrain` owns independent layer state and failures. A scoped MapLibre protocol verifies tile bytes against the hashed local index before rendering. Cleanup removes terrain, layers, source and protocol. Coordinate inspection reads one finest-display tile and is independent of exaggeration. All acquisition and native rasters stay offline. See [terrain handoff](../terrain.md) and [dataset notes](../datasets/nepal-terrain.md).

## Downstream trace extension

`features/downstream-trace` consumes the Rivers component's already validated datasets and selected source ID, with no duplicate acquisition. `packages/contracts/downstream.ts` validates the combined directed graph and returns a deterministic, versioned derived result. Both partitions must be available before tracing; a coverage exit is distinct from a source outlet. The independent overlay uses source geometry and a per-reach reveal index, and is disposed with its selection session. No source artifact/schema is modified. See [downstream handoff](../downstream-trace.md) for algorithm, scientific scope and failure cases.

## Exposure engine extension

`processing/exposure/engine.py` performs native-raster fractional-cell and indexed vector overlays offline. `pipelines/atlas_pipeline/exposure.py` verifies source inputs and publishes immutable request/result/spatial artifacts with schema 4.0.0; `exposure_contracts.py` integrates with the root data validation gate. `features/exposure-engine` only loads registered, validated results and mounts an independent disposable map overlay. National population processing never runs in the browser. See [exposure handoff](../exposure-engine.md) for supported footprints, numerical and deduplication rules, administrative accounting, uncertainty and benchmarks.

## Water Change

Feature 21 uses the offline `processing/water_change` engine and `water_change` publisher. Its dedicated schema and Python/TypeScript validators preserve native 20 m classifications, UNKNOWN quality masks and valid-only comparisons; hashed display images mount and dispose independently. See [water method and provenance](../water-change.md).

## Time Machine

Feature 22 adds a static temporal index, strict UTC interval contracts and one Atlas date selection shared by Water Change, Satellite, Climate and Disaster Events. Other datasets remain explicitly dated context. A 16 MiB verified-byte LRU and abort/dispose lifecycle bound temporal imagery resources. See [temporal semantics and coverage](../time-machine.md).

## Search

Feature 25 derives a separate immutable search release from the validated source releases instead of scanning all source GeoJSON in the browser. Eight bounded gzip shards preserve composite source identity, type, context, representative coordinates and source dates. The browser verifies each shard and processes them sequentially on explicit search submission. Ranking and normalization live in the shared TypeScript contract; no source-missing common names or transliterations are invented. See [global search semantics](../search.md).

## Compare Mode

Feature 26 reuses Search only to resolve stable versioned identities, then loads the two exact source datasets before comparison. `packages/contracts/compare.ts` owns entity-family and metric compatibility, so matching units never bypass semantic meaning. Cross-type pairs and incompatible metric definitions are blocked; missing values remain UNKNOWN. The UI provides an accessible table with source/version/date/resolution/evidence provenance and synchronizes the existing map to the two representative positions without creating a second map. See [comparison semantics](../compare-mode.md).

## Location Explorer

Feature 24 adds an opt-in deterministic spatial-context reader. It computes administrative containment and minimum geometry distance from validated local datasets rather than querying rendered map features, so layer visibility and zoom do not alter results. Category-specific radii/caps, source dates, partial-unavailable states and the WorldPop numerical-lookup limitation are documented in [the Location Explorer methodology](../location-explorer.md).

## Hazard Graph

An offline, immutable relationship index links exact source records. Shared typed semantics and validators separate observation, derivation, inference and modelling. Bounded cycle-safe exploration owns a disposable map selection. See [graph contracts and evidence rules](../hazard-graph.md).
