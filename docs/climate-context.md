# Rainfall, snow, drought and heat context — Features 54 and 55

`nepal-power-gridded-context@1.0.0` gives month-by-month context on `/hazards/` for the 66 NASA POWER cells that cover Nepal. It is a periodically refreshed snapshot of a reanalysis, not a monitoring service, forecast or warning. Official climate information comes from DHM.

## Source
- NASA POWER v10.0.0 monthly UTC time series (MERRA-2), AWS Open Data Zarr store `s3://nasa-power/merra2/temporal/power_merra2_monthly_temporal_utc.zarr`. Licence CC BY 4.0 (the bucket's `LICENSE.txt` is pinned by SHA-256).
- Variables: `PRECTOTCORR` (bias-corrected precipitation, mm/day), `PRECSNOLAND` (snowfall over land, mm/day water equivalent), `SNODP` (snow depth, cm), `FRSNO` (land snow-cover fraction), `T2M_MAX` (highest hourly 2 m temperature in the month, °C).
- Only the four 30×30-cell chunks covering Nepal are used for each variable; every chunk is pinned in `pipelines/power-context-sources.json`. Native 0.5° × 0.625° cells; nothing is interpolated.

## Processing (`npm run data:power-context -- --download`, then `npm run data:power-context`)
- Cells whose footprint intersects the COD-AB v02 Nepal boundary are kept whole; each carries its Nepal area (EPSG:6933) and is weighted by it in national summaries.
- Normals: 1991–2020 means per calendar month; T2M_MAX standard deviation for a standardised anomaly.
- Latest 12 months (the newest month complete for every variable and cell): values, differences from normal, percent of normal precipitation (UNKNOWN when the normal is below 0.1 mm/day).
- **SPI-3** (McKee, Doesken & Kleist 1993): 3-month precipitation totals (rate × days in month) fitted per calendar end-month over 1991–2020 with a two-parameter gamma distribution (Thom maximum-likelihood approximation) plus a zero-probability term, then converted to a standard normal deviate. Classes: ≤ −2 extremely dry, −2 to −1.5 severely dry, −1.5 to −1 moderately dry, −1 to 1 near normal, and the symmetric wet classes. A value exactly on a boundary belongs to the class farther from normal (−2 is extremely dry, −1 moderately dry, 1 moderately wet); the precipitation, temperature and snow scales follow the same rule. The gamma and inverse-normal routines match SciPy to about 1e-14 (`tests/fixtures/spi-reference.json`), and the verifier refits every distribution from the published baseline totals.
- `stale_after` is set two months after the latest month; after that the page shows the snapshot as STALE.

## What it is not
- Not a drought declaration, crop, water-supply or health impact assessment.
- A positive T2M_MAX anomaly is not a heatwave classification; heat-health impacts are UNKNOWN.
- Snow fields are model outputs, known to be uncertain over high mountains and glaciers.
- In the dry season small 3-month totals can give large SPI magnitudes; read SPI with the millimetre totals.
- About 55 × 60 km cells cannot resolve valleys, slopes, cloudbursts or individual settlements.
