# Terrain — feature handoff

Branch: `feat/terrain`. Owner: Astra. Implements master brief §173.3.

The atlas adds local, versioned Copernicus GLO-90 terrain beneath administrative overlays, hillshade, a 2D/3D switch, 1–2× visual exaggeration, and coordinate/click elevation inspection. Elevations always sample zoom 9, independent of camera state. Native analysis samples remain outside the browser.

## Delivery

- 143 complete source COGs, pinned by URL, byte size and SHA-256 in `pipelines/terrain-sources.json`.
- An aligned, unresampled Float32 analysis mosaic in ignored `data/processed/terrain/analysis-native.tif`; native source tiles in ignored `data/raw/terrain`.
- 341 Terrain RGB PNG tiles, zoom 5–9, 256 px, about 30.5 MiB total, all below 256 KiB individually. Full XYZ root 5/23/13 covers Nepal with contextual surroundings and avoids artificial national-edge height seams.
- Schema 2 raster manifest, hashed tile index, source inventory, QA report and licence notices. Raster metadata reuses canonical metadata field definitions from schema 1 without changing existing vector releases.
- Manifest and index validation precede registration. Every requested tile is size/hash checked by a MapLibre custom protocol before decoding. Tile failures disable the terrain layer, retain boundaries, and expose retry.
- Hillshade is computed by MapLibre; no slope, aspect, contours, hydrological conditioning or simulation is claimed.

## Reproduce and validate

`npm run data:terrain` reacquires pinned native files when absent, reconstructs the aligned analysis mosaic if needed, and verifies an existing immutable release. First acquisition needs approximately 666 MiB of downloads and additional local working space. The pipeline refuses changed source hashes and published-file changes; use a new version for different products or processing. Run `npm run check` and `npm run test:e2e` for release and browser verification.

See [dataset notes](datasets/nepal-terrain.md). This national overview is deliberately coarser than the retained source data. Higher-detail terrain requires a new derivative release and measured delivery budgets.

Validation completed: `npm run check` (16 Python tests, 43 TypeScript tests, data validation, linters, static build and security checks); all 10 browser tests pass, including terrain toggles, invariant inspected height under exaggeration, bounded local tile requests, unavailable/retry and corrupt-tile rejection. Desktop 2D/3D and mobile views were inspected in the shared preview. The map now uses responsive fit padding without a tight maxBounds constraint, which previously overrode the requested zoom on narrow screens.
