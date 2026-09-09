# Performance architecture — feature 38

The release retains all immutable geographic artifacts, source values, topology, units, CRS, provenance and scientific limitations. Performance work changes when code/data load and where validation executes; it does not simplify analysis geometry, lower measurement resolution or invent missing observations.

## Delivery and compute boundaries

Desktop now shares mobile's explicit **Load additional map datasets** gate. Terrain, boundaries, Rivers/downstream, Exposure and opt-in analytical controls remain immediately available. Secondary thematic components live in one dynamically imported subtree, so their code and automatic inventory requests are deferred until requested. **Unload additional map datasets** aborts their requests and disposes their layers and component data. Reopening resets those secondary selections. The complete artifacts and evidence panels remain available after opt-in; no category is silently sampled. Once loaded, existing per-feature switches still gate very large infrastructure and historical-event archives.

Schema validators compile lazily on first use, with the same AJV schemas, errors and semantic checks. This avoids compiling every later analytical schema merely because a shared contract module was imported. GeoJSON bounds validation traverses nested coordinate arrays directly instead of allocating a flattened copy of every coordinate. These changes apply to the existing central contract and do not bypass validation.

Vector manifest validation, bounded gzip decoding, JSON parsing and full schema/semantic validation run in one local Web Worker. Main-thread fetches still bound compressed bytes and verify the artifact SHA-256 before transferring the buffer. The worker returns only validated data. The queue accepts at most 64 waiting jobs and 16 MiB of waiting compressed buffers, decodes one artifact at a time with the existing 8 MiB decoded ceiling, times out a job after 60 seconds, and terminates after five idle seconds. Cancellation removes queued jobs or terminates an active decode; other queued consumers proceed with a fresh worker. No parsed national-dataset cache is retained. Environments without Worker retain the exact synchronous validator as a compatibility path, with reduced responsiveness. A failed browser worker fails closed with retry rather than bypassing checks.

Terrain raw-byte reuse has a separate 8 MiB LRU. Keys include path, expected hash and byte size. Only verified bytes enter it; failures and abandoned requests do not. Concurrent requests for identical bytes share one fetch/hash operation while cancellation is tracked per consumer. Returned copies cannot mutate or detach cached bytes. This helps hillshade, 3D and elevation inspection reuse exact source tiles. The existing decoded context cache remains bounded to 24 tiles (6 MiB), and temporal imagery retains its independent 16 MiB cache. These limits exclude live renderer buffers and parsed layer objects.

MapLibre's retained unused-tile cache is capped at 64 tiles per source (visible tiles are additional), and display pixel ratio at 1.5. This may soften high-DPI rasterization; it does not change source sample values, sampling zoom, exaggeration semantics or geographic coordinates. Existing viewport-driven terrain delivery, finest display zoom 9, vector zoom thresholds and gzip partitions remain intact. Closer camera zooms cannot invent terrain detail. No new simplification or vector-tile conversion is justified for core bounded layers; a future larger delivery format must keep source analysis artifacts separate and preserve stable IDs across tiles.

The downstream network remains validated once per input identity in the component's existing memoized graph; traversal remains iterative O(path length). Native WorldPop exposure and full-country asset overlays stay offline in the existing preprocessing engine with bounded raster windows and a spatial index. Performance work does not replace native population values with display-tile samples.

## Reproduction and budgets

Build with `npm run build`, serve `apps/web/out` locally, and run:

```sh
npm run profile:performance -- http://127.0.0.1:3000 /tmp/atlas-performance.json
npx vitest run tests/web/performance.test.ts
.venv/bin/python -m pipelines.atlas_pipeline.profile_exposure
npm run test:e2e -- tests/e2e/performance.spec.ts tests/e2e/terrain.spec.ts tests/e2e/downstream-trace.spec.ts tests/e2e/mobile.spec.ts
```

The browser harness creates separate desktop and phone-width contexts, measures a cold navigation and a same-context warm navigation, waits for map readiness/network idle, exercises a first zoom/reset, and samples 45 animation frames in 2D and 3D. The final harness also measures a second, settled 2D control round trip after returning from 3D; that new field has no pre-change baseline. It records navigation timings, window resource timings (including compressed vectors/raster tiles), long tasks and CDP main-runtime heap. It never sends telemetry. Browser automation overhead is included in the control round trip. Worker/GPU memory and resources invisible to window Resource Timing are not claimed as measured totals. Warm Python-server responses may revalidate with HTTP 304; production CDN caching differs.

Reference budgets for this development hardware / local static server are:

| Workload | Budget / limit |
| --- | --- |
| Cold or warm core map ready | 5 s reference; 15 s broad CI smoke ceiling |
| First zoom/reset after network idle | 1.5 s cold renderer/transfer budget |
| Settled 2D zoom/reset control round trip | 250 ms reference, including automation overhead |
| 2D frame interval p95 | 50 ms in the software-renderer harness |
| Optional 3D frame interval p95 | 300 ms software-renderer smoke budget; not a claim of smooth GPU rendering |
| Main-runtime JS heap after core + 3D inspection | 160 MiB reference; excludes worker/GPU allocations |
| Core window resource bodies through profile | 12 MiB cold (compressed/encoded sizes, not decoded heap) |
| National river validation/graph + regression snapshot | 2 s reference |
| 100 repeated 180-reach traversals | 250 ms reference |
| Individual GeoJSON | Existing 2 MiB compressed / 8 MiB decoded ceiling |
| Raster cache / queued vector bytes | 8 MiB / 16 MiB explicit bounds |

Startup long tasks are reported separately from settled interaction; shader initialization and source transfer can still exceed 50 ms. Headless SwiftShader is a reproducible diagnostic proxy, not a physical phone or hardware-GPU benchmark. Large optional inventories still cost download, parsing and rendering time after opt-in. The code does not claim to maintain 60 FPS for all datasets/3D devices. CPU/network contention and garbage collection affect single-run comparisons; run profiles without simultaneous builds, tests or acquisition jobs.

## Measurements

See the checked-in [performance-results.json](performance-results.json) for before/after measurements, hardware, renderer and scope. These are development measurements, not geographic observations or hosting guarantees. The pre-change baseline is main `e7f3c0c`; repeated benchmarking must identify the tested commit and environment.

| Desktop cold metric | Before | After |
| --- | ---: | ---: |
| Boundary map ready | 2.18 s | 2.66 s |
| First zoom/reset round trip | 2.28 s | 0.53 s |
| Window resource bodies through profile | 16.48 MB | 9.06 MB |
| Main-runtime heap snapshot | 102.79 MB | 54.34 MB |
| Largest startup long task | 2.05 s | 1.12 s |
| 3D frame interval p95 (software rendering) | 483 ms | 183 ms |

The final settled 2D control samples span 69–71 ms across desktop/phone-width and cold/warm runs. Cold boundary readiness regressed slightly; warm desktop readiness improved from 2.44 s to 1.56 s. Main-runtime heap is a single GC-sensitive snapshot and excludes workers/GPU, so no total-memory reduction is claimed. The phone-width cold heap snapshot increased while its warm snapshot decreased. Startup stalls remain visible; optional 3D in a software renderer is not smooth hardware-GPU performance.

The full-network unit workload prepared all 18,299 reaches in 468 ms (including I/O, decoding, validation, graph construction and an immutability snapshot); 100 repeated 180-reach traces took 12.3 ms. The offline vector exposure run loaded 43,656 asset records in 13.69 s, built the spatial index in 4.04 s and computed the Nepal polygon overlay in 6.13 s, returning 42,348 matched assets with 427 MB peak process RSS. These results reuse the existing algorithms; there is no claim that their geographic meaning changed or that a native-raster benchmark was repeated.

Full Nepal vector exposure is benchmarked separately against the published asset partitions and country polygon. The original native population raster is not available in this checkout, so no new native-population runtime is claimed. The earlier native-grid benchmark and reproduction command remain in `docs/exposure-engine.md`. Population correctness remains covered by the existing analytic raster fixtures and release validation.

## Correctness and regression checks

`npm run check` retains all security and immutable-release checks. Unit tests cover lazy-validator errors, byte-cache eviction/copy isolation, shared cancellation, failed/cancelled fetches, full Nepal input immutability and repeated exact trace results. Browser tests cover the core request budget, optional loading/disposal, raster-byte reuse, elevation invariance, corruption handling, no-WebGL fallback, mobile/accessibility and the existing thematic/analytical workflows. Thematic tests explicitly opt into the new gate before inspecting their original scientific assertions.
