# Data contract and geospatial conventions

`schemas/dataset.schema.json` (Draft 7, version 1.0.0) is the authoritative runtime contract. Ajv with format validation checks browser input; Python jsonschema with format dependencies checks offline input. Shared rejection fixtures prevent the two entry points from accepting contradictory basic metadata. TypeScript interfaces provide editor assistance; the JSON schema remains the authority. Unexpected fields fail rather than silently bypassing the contract.

## Canonical metadata

Every manifest requires source, source URL, dataset ID/name/version, source attribution, license and URL, observation/publication/retrieval/processing dates, processing version and method, spatial/temporal resolution and coverage, CRS, evidence type and status, fixture flag, limitations, uncertainty, update cadence/stale deadline, and artifact path/hash/size/format.

Unknown dates, resolutions and measurements use JSON `null`; never an empty string, guessed number or zero. An unknown date is not fabricated as January 1. Partial date precision requires a future schema change or must remain null with the known period documented in limitations. Nonfixture releases require an HTTPS source URL, license URL and at least one observation or publication timestamp. Nonempty license text is a completeness check, not automatic permission to redistribute; dataset review must verify the actual terms.

Timestamps use RFC3339 with timezone. Feature IDs are stable lowercase kebab-case, unique within a release; global identity is `(dataset_id, dataset_version, feature_id)`. Versions are immutable `major.minor.patch` values. Names may be human-readable Unicode. Feature measurements use the central unit vocabulary and `null` for missing values. Extend the vocabulary through contract review; never silently convert units.

| Status | Evidence type |
| --- | --- |
| VERIFIED_SOURCE | observed |
| SATELLITE_DERIVED | derived |
| ATLAS_DERIVED | derived |
| ESTIMATED | estimated |
| MODELLED | modelled |
| HISTORICAL | historical |
| UNKNOWN | unknown |

Fixture status is independently and prominently marked. This sample uses UNKNOWN/unknown with `is_fixture: true`, not MODELLED: an invented test point is not a scientific model output. Historical provenance can describe how an archived observation was obtained; unsupported mixed evidence requires splitting products or a reviewed schema extension.

## CRS and geometry

- Web GeoJSON uses **OGC:CRS84**: longitude first, latitude second, decimal degrees, two finite numbers per position. This is the GeoJSON geographic coordinate order; never infer axis order from an EPSG label.
- MapLibre projects for display; screen/Web Mercator distances and areas are not scientific measurements.
- Metadata bbox is `[west, south, east, north]`, valid and ordered. Each feature lies within it. Bboxes are coverage envelopes, not Nepal administrative boundaries.
- Foundation supports Point, MultiPoint, LineString, MultiLineString, Polygon and MultiPolygon. GeometryCollection, null geometries, empty geometries, Z coordinates and antimeridian-crossing coverage are deliberately unsupported.
- Python uses Shapely to reject degenerate lines and invalid/self-intersecting polygons. Rings must already be explicitly closed; no silent repair. Browser validation adds coordinate bounds and ring checks, but does not duplicate Shapely's full topology engine. Only offline-validated artifacts may be published.
- Future scientific processing must explicitly record source CRS, processing CRS, transformation method and relevant vertical datum. Nepal-spanning datasets must not assume one UTM zone fits every calculation. Choose a suitable local metric CRS or geodesic method per algorithm and record it. Raster no-data values must remain distinct from zero, and elevation needs a vertical reference.

See [GeoJSON RFC 7946](https://www.rfc-editor.org/rfc/rfc7946) for coordinate order and geometry representation. Production validation should extend the present gate with source-specific units, duplicate resolution, topology relationships and domain plausibility; a valid geometry alone is not verified science.
