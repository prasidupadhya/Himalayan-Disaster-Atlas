# Global Search

Feature 25 publishes a static, checksum-verified search index derived from immutable atlas releases. Search does not call a third-party service and does not load every source GeoJSON into browser memory.

## Index and ranking

The release is split into eight bounded gzip shards: core geography, three infrastructure groups, three BIPAD time groups and USGS earthquakes. Every record carries a composite dataset/version/feature identity, stable source ID, entity type, representative coordinate, source date, context and the exact versioned manifest path.

Names and aliases come only from source-backed fields. Unicode NFKD normalization removes diacritics for matching (`Manāslu` → `manaslu`) but does not invent cross-script transliterations. Ranking is deterministic: canonical exact, alias/stable-ID exact, canonical prefix, alias prefix, canonical substring, alias substring, then explicit type/category terms. Ties use name, context and composite identity.

Duplicate names are preserved and labelled with context instead of auto-selecting one. A no-result state means only that no indexed entity matched the query; it is not evidence that a place or feature is geographically absent.

## Known source-name gaps

The current FAO/HydroRIVERS release does not provide verified common river names, so river search uses stable HYRIV IDs. The current Glacial Lake Observatory release has no verified common lake names for these records. The atlas therefore does not manufacture mappings for examples such as Bhote Koshi, Trishuli, Tsho Rolpa or Imja Tsho without a separately verified name-link source.

## Browser behavior

Search runs on explicit submit. Each shard is checksum-verified and decompressed under a 16 MiB decoded budget, processed sequentially, and reduced to capped candidate results before the next shard. The final result list is capped at 60 and remains usable if the interactive map is unavailable.
