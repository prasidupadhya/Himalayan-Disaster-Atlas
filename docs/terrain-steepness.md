# Terrain steepness for landslide awareness — Feature 53

`nepal-terrain-steepness@1.0.0` summarises how much of each district is steep, from the Copernicus GLO-90 surface model already pinned for `nepal-terrain`. **Landslide susceptibility, probability and hazard levels are UNKNOWN in the Atlas**: no reviewed, inventory-calibrated model exists, and steepness alone is not susceptibility.

## Processing (`npm run data:terrain-steepness -- --download`, then `npm run data:terrain-steepness`)
- The 45 GLO-90 tiles covering Nepal (hashes in `pipelines/terrain-sources.json`) are mosaicked on their native 3″ grid without resampling.
- Slope: Horn (1981) 3×3 gradient with latitude-dependent east–west spacing.
- Per COD-AB v02 district (cell-centre assignment, cell-area weights): share of area in slope classes 0–5°, 5–15°, 15–30°, 30–45° and ≥ 45° (declared reporting intervals, not hazard thresholds), mean and median slope, and mean/min/max elevation.
- Nationally about 30 % of Nepal's area is steeper than 30° at this resolution.

## Limitations
- GLO-90 is a surface model (includes trees and buildings); 90 m cells smooth ridges and gullies, so local slopes are underestimated.
- Geology, soils, land cover, drainage, rainfall triggers and earthquakes are not included; many failures occur on moderate slopes and steep rock can be stable.
- Reported landslide events (BIPAD) stay out of the public build pending licence review.

## Unlock for susceptibility
A susceptibility layer needs a reviewed landslide inventory with a redistributable licence, documented conditioning factors, and an out-of-sample validation (for example ROC/AUC on held-out events) published with the model.
