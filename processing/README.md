# Reusable GIS processing boundary

Future pure transformations belong under raster, vector, tiles, hydrology and exposure modules as needed. Acquisition remains in `pipelines`; processing accepts explicit input paths/contracts and produces reproducible intermediate outputs. Every algorithm must declare units, CRS, vertical datum where relevant, null behavior, version, assumptions and domain validation. Foundation supplies validation in `pipelines/atlas_pipeline/contracts.py`; move or reuse centrally rather than duplicate it.
