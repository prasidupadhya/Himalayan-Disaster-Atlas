# Nepal terrain 1.0.0

## Source and permission

[Copernicus DEM GLO-90 public AWS distribution](https://registry.opendata.aws/copernicus-dem/) identifies its data as the 2021 release. [COG conversion documentation](https://copernicus-dem-90m.s3.amazonaws.com/readme.html) explains removal of shared east/south sample rows and native tile transforms. Local native files are Float32 EPSG:4326 at 3 arc-seconds (nominal 90 m; physical spacing varies with latitude), 1200 × 1200 samples. Heights are metres above EGM2008, EPSG:3855, not WGS84 ellipsoid heights.

The [Copernicus licence](https://dataspace.copernicus.eu/sites/default/files/media/files/2025-06/copernicus_contributing_mission_data_access_v2_cop_dem_licenses.pdf), GLO-90 section, permits reproduction, distribution and adaptation subject to source attribution and liability notices. The release supplies required notices in LICENSE.txt and displays attribution in the map and evidence pages. Subsequent redistribution must retain those notices and licence obligations. No provider endorsement is claimed.

Source inventory records actual retrieval timestamps, hashes, dimensions, transforms, nodata, data types and min/max values for every COG. Exact observation/publication timestamps are unavailable, so they remain null; the known release year is stated as source-version information. This explicit raster schema exception avoids inventing a January 1 publication date.

## Processing and grids

Source COGs remain unchanged. The analysis mosaic uses their existing aligned lattice with no sample resampling, preserving the half-pixel registration documented by the distribution. Its SHA-256 is recorded in qa.json. Future analyses must use the native COGs/mosaic and choose a suitable metric analysis CRS; the web grid is not an analysis raster.

Display tiles are bilinearly reprojected into one aligned EPSG:3857 grid per zoom and split into exact 256 × 256 windows. Mapbox Terrain RGB encodes `height_m = -10000 + (R*65536 + G*256 + B)*0.1`. Encoding round-off is at most 0.05 m, which is not a measurement accuracy. Zoom 9 pixels are roughly 270 m at 28° N; lower zooms are coarser. Larger camera zooms overscale the same display data. The pipeline rejects missing/nonfinite data before RGB encoding, never converting unknown elevations to sea level. The published rectangular domain has no nodata cells.

Hillshade is a MapLibre lighting derivative. Exaggeration affects visualization only. The coordinate inspector reports an approximate height from the nearest zoom-9 display pixel and the EGM2008 datum. Out-of-domain locations return UNKNOWN. Inspection failures also return UNKNOWN instead of zero. Surrounding countries appear only as terrain context; the rectangle is not a national-boundary claim.

## QA and scientific limits

Native-grid sanity probes: Everest vicinity 8723.73 m; Kathmandu valley 1303.87 m; Biratnagar plain 70.41 m. Coordinates, actual samples and broad plausibility intervals are in qa.json. These values are source samples, not independently surveyed elevations or exact summit heights. All source cells and output tiles are checked for missing values and implausible elevations; file dimensions, transforms, CRS, hashes, tile coverage and exact public copies are validated. Encoding tests include negative, zero and mountain elevations, nodata rejection and grid splits.

The DSM contains vegetation and infrastructure and may include infilled observations. Local vertical accuracy and per-pixel observation dates are UNKNOWN. Coarse display resampling smooths summits. No bare-earth correction, drainage conditioning, slope/aspect analysis, hydraulic model, hazard classification or forecast is supplied. Higher-resolution, task-specific validation remains necessary for future analysis.
