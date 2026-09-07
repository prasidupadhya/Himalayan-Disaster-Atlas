# Earthquakes

Feature 12 uses a pinned USGS ANSS Comprehensive Earthquake Catalog (ComCat) FDSN GeoJSON query covering 80–89°E, 26–31°N, 2000-01-01 through 2026-09-08, and source-query minimum magnitude 2.5. The immutable `1.0.0` release contains 1,273 preferred event records. IDs, origin time, preferred magnitude and type, focal depth, place text, network, status, coordinates, query URL and source checksum are retained.

The bounding box intentionally includes earthquakes outside Nepal because regional earthquakes can be relevant context. A point is an **epicenter only**; it is not a shaking, loss or damage footprint. Catalog completeness changes through time and by magnitude, and ComCat preferred origins can be revised upstream after this static snapshot. Depth and magnitude inherit network/source uncertainty.

The map uses a monotonic exponential display transform from 3 px at M2.5 to 16 px at M8. This provides consistent visual ordering while avoiding any claim that symbol area equals physical rupture size, energy, shaking intensity or damage. Time and minimum-magnitude filters operate on the retained source values.
