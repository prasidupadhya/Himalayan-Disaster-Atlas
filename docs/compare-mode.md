# Compare Mode

Feature 26 performs read-only side-by-side comparison of two exact versioned atlas records. It reuses Feature 25's verified search index only for entity selection; after selection the browser loads and validates the two original versioned datasets before extracting any comparison value.

## Supported families

The first comparison contract supports districts, mountains, FAO/HydroRIVERS reaches, RGI 7.0 glaciers, Glacial Lake Observatory records, BIPAD disaster events and USGS earthquakes. Administrative comparison is district-to-district only. Arbitrary Location Explorer coordinates are not supported because Feature 24 does not yet publish a versioned numerical location-snapshot contract.

Cross-type comparisons are blocked. The contract also requires metric-specific semantic compatibility: identical units alone are insufficient. For example, district area and glacier area are both expressed in km² but describe different measurements and cannot be compared as one metric. Earthquake magnitudes are comparable only when the published magnitude type matches.

## Metrics and unknowns

- mountains: source summit elevation;
- rivers: average discharge, reach length, catchment area and upstream area;
- glaciers: source area and minimum/mean/maximum elevation;
- glacial lakes: mapped extent, perimeter, mean elevation, expansion rate and published expansion uncertainty;
- districts: source-published area;
- BIPAD events: reported deaths, injured, missing and affected counts;
- USGS earthquakes: magnitude (compatible magnitude type only) and depth.

`0` is preserved as a real reported value. Missing values remain `UNKNOWN`. BIPAD estimated financial loss is deliberately excluded because values across years are not normalized for inflation or reporting practice. No comparison result produces a severity, safety, quality or better/worse ranking.

## Provenance

Every comparison shows source, dataset ID/version, feature date, observation date, temporal coverage, spatial resolution and evidence type for both sides. Differing glacier outline dates or dataset observation dates remain visible rather than being normalized away. Derived or reported metric bases are labelled in the table.

The existing MapLibre view is synchronized by fitting the two indexed representative positions. The comparison table remains fully usable without WebGL.
