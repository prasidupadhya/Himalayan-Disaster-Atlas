# Mountains / peaks handoff

`feat/mountains` publishes a static, searchable Nepal peak catalogue from the GeoNames Nepal country dump snapshot dated 2026-09-07. The acquisition archive is pinned by SHA-256 and remains outside Git; the checked-in browser release contains 747 `PK` and `MT` point records with stable GeoNames identifiers.

The layer uses source coordinates and only the explicit GeoNames elevation field. Missing summit elevations remain `null` / **UNKNOWN**; the separate GeoNames DEM field is not substituted. Major high-elevation records render at the national view, lower records appear on closer zoom, and labels are intentionally sparse. Selection exposes source ID, coordinates, elevation, aliases and source-modification date.

GeoNames is a gazetteer rather than a definitive geodetic or mountaineering inventory. Its country assignment does not resolve transboundary or disputed summit claims, and it supplies no per-record positional or vertical uncertainty. Future authoritative peak sources may coexist as separate evidence instead of silently overwriting conflicts.
