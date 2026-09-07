# Nepal administrative boundaries

## Source and release

- Atlas release: `2.0.0`; source release: Nepal COD-AB `v02`.
- Source: Survey Department of Nepal and UN Resident Coordinator's Office in Nepal; quality assurance by OCHA Field Information Services and HDX.
- Source page: <https://data.humdata.org/dataset/cod-ab-npl>
- Source archive SHA-256: `9f6713c41d65396f611ddce5879faecf8e2d494edbd1d6611612445ad46b6707`.
- Source creation date: 2024-01-01; valid for humanitarian use: 2024-03-14; HDX accuracy/completeness review: 2025-10-30; atlas retrieval and processing: 2026-09-07.
- License: [CC BY 3.0 IGO](https://creativecommons.org/licenses/by/3.0/igo/legalcode).
- Geographic coverage and CRS: Nepal national extent, OGC:CRS84 longitude/latitude.

## Hierarchy and identity

The source provides 1 country, 7 provinces, 77 districts, and 775 level-3 pieces. Level 3 comprises 753 local-government units and 22 protected or special-area pieces. All pieces are retained because together they cover Nepal. Ward boundaries are not supplied. Source P-codes are canonical stable identifiers; feature IDs are their lowercase form. Each record retains its readable source name, parent P-code/name, available aliases, source-reported area, validity fields, and source version.

## Processing and validation

`pipelines/atlas_pipeline/admin_boundaries.py` acquires the source into an ignored content-addressed raw path, checks its pinned hash, rejects unsafe archives, and validates expected files and counts. Shapely checks nonempty valid Polygon/MultiPolygon geometry, shared-edge coverage topology, parent containment, complete Nepal coverage, unique P-codes, and neighboring units. Two level-3 geometries are expected multipart features. The generated `qa.json` records counts, multipart totals, neighbor ranges, category totals, and country-coverage differences.

Browser artifacts use topology-preserving coverage simplification at 0.002 degrees and deterministic gzip. Simplified geometry is for display and identification. Future spatial aggregation, measurement, or legal/cadastral use must start from the pinned unsimplified source and document an appropriate analysis CRS or geodesic method.

## Limitations

The source does not publish positional accuracy. Boundaries created in 2024 may omit later legal or cartographic changes. English alternate-name fields are empty in this source release. The international-boundary representation follows the source and does not resolve disputed claims. Source-reported areas are presented as supplied and are not recomputed from simplified geometry.
