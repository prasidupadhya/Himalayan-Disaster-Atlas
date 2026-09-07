# Hydropower

Feature 15 is a controlled, one-time OpenStreetMap extraction of Nepal features tagged `power=plant` whose `plant:source` contains `hydro` or `water`. No visitor performs an Overpass query. The pinned snapshot has OSM base timestamp `2026-09-07T19:55:55Z` and contains 45 mapped plants. Ways and relations use the center returned by Overpass for presentation while the original OSM element type/ID is retained as the stable source identifier.

Numeric `plant:output:electricity` values in W/kW/MW are normalized to MW; nonnumeric values such as `yes` remain `UNKNOWN`. In this snapshot, 25 of 45 records have numeric capacity. `power=plant` is a mapping tag and is **not** independently verified operational status, so the UI says exactly that rather than inventing lifecycle state.

OpenStreetMap data is ODbL and the map/release attributes `© OpenStreetMap contributors · ODbL`. OSM completeness and tagging vary. Hazard proximity is never converted into vulnerability, expected damage or risk without a separately validated relationship.
