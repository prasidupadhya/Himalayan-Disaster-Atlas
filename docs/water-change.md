# Water Change — feature 21

Branch: `feat/water-change-time-machine`. Static, read-only release: `phewa-water-change/1.0.0`.

## Meaning and coverage

Mapped water means conservative open-water candidates around Phewa Lake, Pokhara, in three Sentinel-2 Collection 1 L2A acquisitions: 2024-04-19 (2B), 2025-04-01 (2A), 2026-04-26 (2A). This is a bounded demonstration using real observations, not Nepal-wide coverage. April dates are neither a seasonal cycle nor evidence of a long-term trend; dates, atmospheric conditions and instruments differ. No causal, flood, hazard or forecast inference is made.

## Reproducible method

`pipelines/water-change-sources.json` pins COG URLs, STAC-declared whole-object checksums, source ETags/sizes, exact downloaded window SHA-256, calibration and grid. Full COG checksums are **source-declared**, not locally verified full-object hashes. To reacquire ignored inputs run `.venv/bin/python -m pipelines.atlas_pipeline.water_change_acquire`, then `npm run data:water-change`. Existing published versions are verified, never overwritten. The pinned raster writer is needed to reproduce window GeoTIFF bytes.

All analytical arrays share EPSG:32644, 505 × 512 cells, transform `[20,0,784480,0,-20,3130780]`. B03 green and B08 NIR 10 m DN blocks are averaged exactly 2 × 2 and calibrated with `DN × 0.0001 − 0.1`. Any DN zero makes that output cell invalid. No cross-grid bilinear interpolation enters classification. Native cell area is 400 m².

NDWI `(green − NIR)/(green + NIR)` has nominal threshold 0 and an uncertainty guard band ±0.05. Mapped water requires NDWI > 0.05 and SCL 6; mapped land requires NDWI < −0.05 and SCL 4 or 5. Disagreement, invalid/nonpositive reflectance sums and guard-band values are UNKNOWN. SCL 0,1,2,3,7,8,9,10,11 plus a one-cell (20 m) buffer and window edges are excluded. Water components smaller than 9 eight-connected cells (0.0036 km²) become UNKNOWN, never land. Thresholds are transparent conservative analysis choices, not locally calibrated accuracy guarantees.

Native classification PNG codes: 0 UNKNOWN, 1 land, 2 water. Quality PNG: 0 valid, 1 source/SCL excluded, 2 exclusion buffer, 3 uncertain/disagreement, 4 below minimum mapping unit. Change codes: 0 UNKNOWN, 1 persistent land, 2 persistent water, 3 mapped gain, 4 mapped loss. Every comparison requires exact grid equality and uses only jointly valid cells. At least 80% of both the full window and the union of either date’s mapped water must be jointly valid; otherwise all area metrics are null. A water union with no mapped water is unavailable. This gate prevents abundant surrounding land from hiding missing lake coverage. The union itself is not an independent lake boundary.

Display masks use nearest-neighbour reprojection to one Web Mercator image grid with CRS84 corner coordinates; native masks and counts remain authoritative. TCI true-colour images are averaged solely for inspection. Display pixels are not analytical area samples. Each PNG and observation index is bounded and checksum-verified before browser display.

## QA and limits

Manual inspection of the source true-colour and masks found a contiguous mapped core aligned with the visible Phewa lake, with uncertain shorelines excluded. An initially inspected hazy 2026-04-24 scene was rejected in favour of clearer 2026-04-26. The 2024–2025 water union is 95.27% comparable; counted persistence is 3.2224 km² and counted gain/loss zero. This does **not** mean the whole shoreline was unchanged. The 2026 pairs fail the water-union coverage gate (77.95% and 79.75%); metrics remain UNKNOWN. Narrow river water is largely excluded, as expected for this minimum mapping unit and strict agreement rule. No independent ground truth, numerical accuracy, or uncertainty interval is available.

Tests cover calibration/NoData, cloud/shadow/snow buffers, small water, joint validity, missing coverage, invalid class values, shifted grids, metric integrity, chronological selection, failed imagery verification and browser layer cleanup. Validation re-derives paired classifications/counts from native masks and verifies exact public copies.

## Sources and licence

- [Sentinel-2 processing and scene classification](https://sentiwiki.copernicus.eu/web/s2-processing)
- [Sentinel products and BOA calibration offsets](https://sentiwiki.copernicus.eu/web/s2-products)
- [Earth Search Collection 1 documentation](https://github.com/Element84/earth-search/blob/main/README.md)
- [Copernicus Sentinel Data Legal Notice](https://cds.climate.copernicus.eu/licences/ec-sentinel)
- [Nepal Tourism Board: Phewa Lake](https://trade.ntb.gov.np/downloads/phewa-lake/) — identity/context only, not validation ground truth.

Contains modified Copernicus Sentinel data (2024, 2025, 2026). Source inventory, masks, QA and licence are distributed with the immutable release.
