# Population

The Population layer uses the **WorldPop Global 2015–2030 R2025A v1** constrained population product for Nepal, model year 2025. The source is a single-band Float32 GeoTIFF in EPSG:4326 at 3 arc-second resolution (nominally about 100 m at the equator), with values expressed as people per source grid cell.

The source file is pinned by SHA-256 `b7b581e181df5e2f84b2e20d3455429393829395619a9600e45c6907674a0639`. Its grid is 9,773 × 4,921 cells and uses `-99999` as NoData. NoData is kept distinct from valid zero-population cells. The native raster remains the analysis source; it is never replaced by the web derivative.

For the browser, the pipeline generates a separate zoom 5–10 EPSG:3857 PNG pyramid. Those tiles are bilinearly reprojected and log-scaled for **relative visual intensity only**. Their colors and alpha values are not population measurements and must never be aggregated for exposure calculations.

The 2025 layer is a modelled estimate, not a 2025 census. WorldPop's Nepal inputs include the 2011 and 2021 censuses, and the R2025A census-source documentation marks Nepal as modelled with the second timepoint only. The constrained method redistributes estimates to mapped residential/building or built-settlement cells, so omissions and false positives in settlement mapping affect local allocation. Seasonal mobility and rapid-onset displacement are not represented.

The source GeoTIFF declares CC BY 4.0. WorldPop's Hub also documents an ODbL derived-data clause for some products derived from OpenStreetMap/Microsoft building inputs; because the constrained workflow uses building-derived inputs, that licensing nuance is preserved in the release metadata and should be re-audited before production redistribution rather than silently resolved by the atlas.

Source: WorldPop, University of Southampton, R2025A v1 (2025), DOI `10.5258/SOTON/WP00839`.
