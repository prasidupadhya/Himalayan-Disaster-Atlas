# Data contract and geospatial conventions

`schemas/dataset.schema.json` (Draft 7, version 1.0.0) is the authoritative runtime contract. Ajv with format validation checks browser input; Python jsonschema with format dependencies checks offline input. Shared rejection fixtures prevent the two entry points from accepting contradictory basic metadata. TypeScript interfaces provide editor assistance; the JSON schema remains the authority. Unexpected fields fail rather than silently bypassing the contract.

## Canonical metadata

Every manifest requires source, source URL, dataset ID/name/version, source attribution, license and URL, observation/publication/retrieval/processing dates, processing version and method, spatial/temporal resolution and coverage, CRS, evidence type and status, fixture flag, limitations, uncertainty, update cadence/stale deadline, and artifact path/hash/size/format.

Unknown dates, resolutions and measurements use JSON `null`; never an empty string, guessed number or zero. An unknown date is not fabricated as January 1. Partial date precision requires a future schema change or must remain null with the known period documented in limitations. Nonfixture releases require an HTTPS source URL, license URL and at least one observation or publication timestamp. Nonempty license text is a completeness check, not automatic permission to redistribute; dataset review must verify the actual terms.

Timestamps use RFC3339 with timezone. Feature IDs are stable lowercase kebab-case, unique within a release; global identity is `(dataset_id, dataset_version, feature_id)`. Versions are immutable `major.minor.patch` values. Names may be human-readable Unicode. Feature measurements use the central unit vocabulary and `null` for missing values. Extend the vocabulary through contract review; never silently convert units.

Administrative features add level, category, P-code, parent P-code/name, aliases, validated label coordinates, validity dates, and source version. Level 0 has null parent fields; levels 1–3 require a parent. Level 3 explicitly distinguishes local-government units from protected or special-area pieces. Source-reported area uses `km2`; it remains null when absent and is never inferred from display geometry.

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

## Raster schema 2

`terrain.schema.json` references the canonical metadata property definitions and explicitly changes schema version/artifact delivery for terrain. A raster manifest has `metadata` and `raster`; its artifact is a bounded SHA-256-verified `TerrainRGB-index` JSON mapping every XYZ tile to its size/hash. Each PNG is at most 256 KiB and 256 × 256 RGB. The current adapter supports the complete 341-tile pyramid rooted at 5/23/13 through zoom 9. Unsupported layouts, datums and encodings fail validation; extend the contract for future layouts.

Native/display CRS, vertical datum, unit, nodata, sample spacing, resampling and tile count are required. Null observation/publication dates are allowed for this static raster product with known source release year but unknown exact timestamps, instead of inventing dates. Elevation inspection outside coverage is null/UNKNOWN; missing raster values cannot be encoded as zero. This contract does not make GeoJSON accept raster artifacts.

The raster adapter also accepts the explicitly identified `asia-terrain-context` layout: 682 eastern-hemisphere tiles at zooms 1–5. Context uses an unknown vertical datum and source resolution, since its inputs vary; its normalized display tiles are not measurement artifacts. Dataset-specific invariants prevent exchanging context metadata with the Nepal dataset. The hashed index budget is 128 KiB; manifests remain limited to 64 KiB. Context public copies and their source inventory are verified by the offline validator.
## Downstream analysis result

The additive TypeScript `DownstreamResult` contract in `packages/contracts/downstream.ts` represents ephemeral network analysis. Its method ID is `hydrorivers-next-down/1.0.0`, status is `ATLAS_DERIVED`, evidence type is `derived`, CRS is `OGC:CRS84`, and `total_length_km` explicitly uses kilometres. It includes ordered source reach IDs, the selected whole reach, source-outlet/coverage-boundary termination, nullable next ID, both input versions/hashes and scientific limitations. Central graph validation rejects incomplete partitions, inconsistent links, duplicate IDs, invalid lengths and cycles before constructing a result. Existing immutable schema 1 vector releases are unchanged. This result is generated internally and exported; importing untrusted trace files is not supported.
## Exposure request and result contracts

`schemas/exposure-request.schema.json` defines explicit versioned polygon inputs in OGC:CRS84, with footprint meaning, lineage and assumptions. `schemas/exposure.schema.json` adds result schema 4.0.0: ESTIMATED/derived exposure, method and calculation timestamp, input hashes/versions, native population coverage, deduplicated assets, administrative rows and hashed spatial/request artifacts. Area uses EPSG:6933, counts use people, and NoData/outside coverage cannot yield a complete population total. Python validates geometric/overlay invariants; TypeScript validates result identity/count/coverage consistency and bounded spatial output before rendering. Existing immutable vector/raster schemas remain unchanged. See [exposure engine](../exposure-engine.md).
