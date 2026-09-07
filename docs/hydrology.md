# Hydrology

The hydrology layer publishes a static snapshot of BIPAD river monitoring stations backed by Nepal's Department of Hydrology and Meteorology. It retains stable BIPAD station IDs, station-series IDs, coordinates, basin, source-reported water level, observation timestamp, warning/danger thresholds, station status, trend, provider and elevation where supplied.

The release contains 281 stations. Missing water levels or thresholds remain `UNKNOWN`; the atlas does not interpolate or replace them. Four source records expose warning thresholds numerically above their danger thresholds, so the source values are preserved and explicitly flagged rather than corrected. One record exposes an obviously reversed `[latitude, longitude]` pair; the browser coordinate is reversed only because the original order is impossible for Nepal while the reversed order is plausible, and that presentation repair is flagged.

This is a cached operational snapshot, not a live warning system. Every selected station shows the source observation time, and the dataset becomes stale after its declared freshness window. A station status describes that gauge only and must not be generalized to surrounding river reaches.

The BIPAD API documentation does not publish a standalone redistribution licence. The manifest records that limitation so deployment owners can re-audit source terms before redistributing a refreshed snapshot outside this project.
