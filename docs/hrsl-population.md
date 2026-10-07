# HRSL population inputs — Feature 48

`nepal-hrsl-population@1.0.0` is the public population input for scenario exposure. It replaces nothing: WorldPop (`nepal-population`) stays out of the public build pending redistribution review, and this is a separately registered dataset.

## Source
- Meta / CIESIN **High Resolution Settlement Layer (HRSL) v1.5**, general population, 1 arc-second cloud-optimised GeoTIFFs on the AWS Open Data registry (`s3://dataforgood-fb-data/hrsl-cogs/hrsl_general/v1.5/`).
- Licence: **CC BY 4.0** (registry entry `dataforgood-fb-hrsl`). Attribution (as published in the manifest): "Meta and Center for International Earth Science Information Network (CIESIN), Columbia University. 2022. High Resolution Settlement Layer (HRSL), v1.5. Source imagery © 2016 Maxar. Licensed CC BY 4.0."
- Tiles pinned by SHA-256, size and ETag in `pipelines/atlas_pipeline/population_hrsl.py`: `cog_globallat_20_lon_80_general-v1.5.5.tif` (main) and `cog_globallat_30_lon_80_general-v1.5.2.tif` (northern strip). Overlapping rows were compared: max absolute difference 0.0.

## Processing (`npm run data:hrsl-population -- --retrieved <UTC time>`)
1. Verify both tiles against the pinned hashes (download them into `data/raw/population-hrsl/` first; the raw files are not committed).
2. Mask 1″ cells whose centres fall inside the COD-AB v02 Nepal boundary (`nepal-admin-country@2.0.1`). Inside Nepal a source NaN means "no detected building" and contributes 0 people by method; outside Nepal every cell is UNKNOWN.
3. Sum exactly into a 3″ analysis raster (`data/raw/population-hrsl/nepal-hrsl-3ss.tif`, hash-pinned in the manifest, kept out of git) and a 30″ sparse browser grid (`grid.json.gz`, ≈300 KB, `atlas-population-grid@1`). No resampling, smoothing or reallocation.

Totals: 29,157,467.16 people at 1″; 29,157,466.05 in the browser grid (per-cell rounding to 0.01). 197,710 browser cells.

## Verification
`verify_population_grid` (Python) and `parsePopulationGrid` (browser) both check strictly increasing rows, non-overlapping segments, non-negative finite values, the published cell count and total, and that rounding cannot drift more than 0.005 people per cell from the exact total. When the analysis raster is present locally its hash is checked too.

## Limitations (also in the manifest)
HRSL is modelled, not a census; the reference year is UNKNOWN beyond the v1.5 release; missed buildings shift people elsewhere; seasonal mobility and tourists are not represented; counts are not vulnerability or loss. Transboundary area is UNKNOWN, so corridors crossing the border report a known subtotal and a null total.
