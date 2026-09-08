# River network handoff

`feat/rivers` publishes all 18,299 FAO Rivers 2026 / HydroRIVERS reaches whose source geometry intersects Nepal's validated COD-AB country polygon. The source WFS response is content-addressed outside Git. No reach is clipped or geometrically simplified for publication.

The network preserves `HYRIV_ID`, `NEXT_DOWN`, `MAIN_RIV`, flow order, reach length, distance to source/outlet, local and upstream drainage area, HydroBASINS level-12 ID, long-term average discharge, and FAO's smoothed perennial/intermittent classification. Across the logical Nepal release, 18,110 downstream links resolve to another retained reach and 189 continue across the national-selection boundary. There are no self-links.

To respect the architecture's 8 MiB decoded-GeoJSON budget, the presentation network is split into two immutable datasets: `nepal-rivers-primary` (flow orders 3–6) and `nepal-rivers-headwaters` (orders 7–8). IDs and downstream pointers span both partitions, so the split is only a delivery detail. The raw pinned WFS subset remains the analytical source.

The source has no river-name field for these reaches. The UI therefore shows **UNKNOWN** for river name and uses stable HYRIV IDs for search/selection. Average discharge and flow-regime classes are dataset attributes, not current gauge readings. River lines are source-derived hydrography and must not be described as guaranteed present-day wetted channels.
