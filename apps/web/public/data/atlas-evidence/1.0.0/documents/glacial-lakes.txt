# Glacial lakes feature handoff

Branch: `feat/glacial-lakes`

## Source

The feature uses **Glacial Lake Observatory (GLO) v1.02**, “Glacial Lake Observatory: A dataset of glacial lakes in Nepal and transboundary catchments (2017–2024)”, Zenodo record `10.5281/zenodo.19370146`, published 2026-04-01 under CC BY 4.0.

The offline pipeline pins two Sentinel-2 GeoPackages by SHA-256:

- unique-lake centroids in EPSG:4326, used as the browser geometry;
- unique-lake polygons in ESRI:102025, read only for their published dissolved area/perimeter attributes in this feature.

The two tables are joined strictly by stable `GLO_ID`. No polygon reprojection is performed and no geometry is invented.

## Release contents

- 4,150 source unique-lake records;
- 2,347 in Nepal, 1,745 in China, and 58 in India within the source's Nepal/transboundary-catchment scope;
- 2,535 source-classified `Glacier-fed` and 1,615 `Non Glacier-fed` records;
- 4,144 records with an expansion-rate + uncertainty pair;
- 367 records where the source's expansion-significance flag is `TRUE`.

The browser artifact is approximately 340 KiB compressed and 3.7 MiB decoded, so one immutable GeoJSON release remains within the repository safety budgets.

## Scientific meaning

`AREA_DISSOLVED` is the source dissolved **maximum mapped extent across 2017–2024**. It is not a current area measurement. The UI labels it accordingly.

Expansion rate and uncertainty are source time-series statistics. `EXPANSION_RATE_SIG` is a source statistical significance flag only. It is **not** a hazard category and is never presented as one.

The source connectivity field (`Glacier-fed` / `Non Glacier-fed`) is retained exactly. The source layer does not supply an RGI glacier ID or a river reach ID, so the Atlas does not manufacture glacier/lake or lake/river links. It shows the source basin and leaves specific glacier and river relationships `UNKNOWN`.

The source layer does not publish lake names. `lake_name` is therefore `null` and the UI displays `UNKNOWN`, using stable `GLO_ID` for identification and search.

## Validation and limitations

The GLO README reports Sentinel-2 classification F1 = 0.92 for 2020 and approximately 0.91 for 2017/2024. It documents snow/ice, seasonal freezing, mosaicking, water-level timing and other classification limitations. The Atlas carries these limitations into the immutable manifest.

Eight source records have sub-metre Float32 rounding where `ELEVATION_MIN` exceeds `ELEVATION_MEAN` by a tiny fraction. The Atlas preserves the source values and permits only a one-metre validation tolerance for this specific glacial-lake invariant; it does not alter the measurements.

## UI behavior

Points appear from zoom 5.5 and are visually distinct from river lines and glacier polygons. Circle size is a display encoding of source dissolved mapped extent; connectivity changes the non-hazard display color. Search covers `GLO_ID`, country, basin and source connectivity. Selection exposes source area/perimeter, elevation, expansion rate + uncertainty, and source statistical significance.

Every selected record explicitly states **Hazard status: NOT ASSESSED**. Being glacial, glacier-fed, expanding, or statistically significant does not cause the Atlas to label a lake dangerous.
