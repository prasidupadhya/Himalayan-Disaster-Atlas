# Foundation architecture

## Application and feature boundaries

Use React + TypeScript + Next.js App Router with `output: 'export'` and trailing slashes. Routes render at build time; there is no persistent backend, authentication, personal storage, analytics, or private runtime API. Public interaction state exists only in memory. Root navigation includes the working sample and the evidence pages; later feature owners add routes when functionality exists.

`app/` composes routes. `features/<feature>/` owns domain UI; shared `components/` implements evidence and resource-state patterns. `packages/contracts` owns browser validation. Components cannot import acquisition code, raw data, processed data or Node APIs. ESLint enforces that boundary. Heavy map code is dynamically imported only on the Atlas route.

MapLibre GL JS is the primary map engine. Foundation uses a local background style and synthetic GeoJSON, so no external basemap or tile service is needed. Map layers mount only after both validation and style load. Each source ID includes dataset ID and version. The renderer promotes a private copy of each canonical string ID so tile encoding cannot discard selection identity. Public feature properties are unchanged. The shared layer controller sets visibility and disposes layers before sources; unmount aborts pending requests and removes the map. New style-switching features must explicitly dispose and remount managed layers after style changes.

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
| GeoJSON | Small inspectable layers, at most 1 MiB per artifact; manifest at most 64 KiB |
| PMTiles / vector tiles | Large roads, rivers, buildings and inventories; viewport-driven requests |
| COG | Raster source/analysis access with range support; tiled visual products for the map |
| GeoParquet | Offline analytical tables and geometry; not a default browser payload |
| DEM raster tiles | Future visualization derived from documented DEM source and vertical datum |

Only GeoJSON is implemented. Extend the schema with a new version and a delivery adapter before using other formats. Large originals/intermediates stay outside Git. Future artifact hosting must provide CORS where needed, correct MIME types, byte-range requests, size limits, immutable version URLs, and checksums. A manifest references one artifact in v1; multi-artifact releases require an explicit contract extension. Never send a national inventory as an unbounded JSON response.

## User-visible states

`Resource<T>` separates loading, ready, empty, unavailable, error and stale. Missing files (404/503) are unavailable; invalid schema/checksum is an error and is not rendered. Loading is announced, retry is available after failure, and empty means no records rather than zero measured values. Updating datasets require an explicit stale deadline; a stale snapshot stays inspectable with a notice. Static inventories do not acquire a false live/stale claim from age alone. The current UI evaluates freshness on load; operational features must add deadline-driven refresh/stale transitions.

A failed WebGL context keeps validated records available to screen readers and keyboard users. Loading remote artifacts is cancellable and bounded. Simulation computation is not performed on the rendering thread.

## Scientific extension boundary

Future simulation engines must be model-agnostic and return separate scenario inputs and modelled outputs, with model/version, input dataset versions, assumptions, units, CRS/vertical datum, uncertainty, validation status, and output resolution. Store immutable run metadata and hashes. Never relabel a scenario as observed, a trace as hydraulic inundation, or an exposure estimate as confirmed damage. No fake scenario endpoint or simulation algorithm is introduced by Foundation.

## Framework references

- [Next.js static exports](https://nextjs.org/docs/app/guides/static-exports)
- [MapLibre GeoJSON sources](https://maplibre.org/maplibre-gl-js/docs/API/classes/GeoJSONSource/)
