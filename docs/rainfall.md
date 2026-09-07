# Rainfall

The rainfall layer publishes a cached BIPAD/DHM station snapshot with stable station IDs, coordinates, observation time and source rolling accumulations for 1, 3, 6, 12 and 24 hours. The release contains 657 stations; 453 have a 24-hour value in the pinned snapshot. Missing intervals remain `UNKNOWN` and are never converted to zero.

All source accumulation values are preserved. Two stations contain values above 5,000 mm in at least one interval, so those records carry an explicit source-range warning instead of being silently corrected or used as an atlas hazard classification. Station status and rainfall amounts describe the source gauge observation only. This snapshot is not a live forecast or warning product and becomes stale after its declared freshness window.
