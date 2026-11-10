# Administrative Boundaries handoff

Branch: `feat/admin-boundaries`. Owner: Sol. Scope: master brief §173.2. Foundation and the hydration extension-attribute fix precede this branch.

## Acceptance and implementation

| Requirement | Implementation / verification |
| --- | --- |
| Appropriate public source and traceable terms | Nepal COD-AB v02, pinned source URL/hash, dates, attribution, and CC BY 3.0 IGO in every manifest |
| Supported hierarchy | Country, 7 provinces, 77 districts, 753 local-government units, and 22 source-defined protected/special-area pieces; wards explicitly unavailable |
| Stable identity and names | Canonical P-codes, readable source names, parents, aliases, validity and source version in the shared schema |
| Geometry and coverage QA | Valid Polygon/MultiPolygon checks, coverage topology, parent containment, unique IDs, neighbors, expected multipart counts, and country union comparison |
| CRS and display processing | Source and web OGC:CRS84; topology-preserving display simplification; pinned unsimplified archive reserved for analysis |
| Map use | Four toggles, district/local zoom thresholds, province labels, special-area styling, map click selection, keyboard-accessible grouped record list |
| Evidence and limits | Dataset catalog, methodology, sources, downloadable manifests/artifacts, uncertainty and boundary-version notes |
| Delivery | Manifest-first hash verification, bounded gzip decompression, immutable 2.0.1 patch release, static read-only application |

The feature adds no hazard facts, causal relationships, forecasts, exposure calculations, or inferred boundary measurements. The source-reported area is displayed as an attribute. The browser geometry is not an analysis or cadastral product.

## Validation results

Verified on 2026-09-07 with the root commands:

- 39 TypeScript contract, loader, layer-lifecycle, state, and security tests passed.
- 13 Python pipeline, schema, hierarchy, artifact, topology, and QA-report tests passed.
- 7 production browser tests passed, covering real WebGL, click identity, labels, toggles, keyboard selection, mobile layout, retry, checksum rejection, empty/stale states, and WebGL fallback.
- 2 development hydration tests passed: extension attributes on `<body>` are tolerated while application-content mismatches still report a diagnostic.
- Release/public-copy validation, type checking, ESLint, Ruff, source/output security scans, and the static production build passed.
- The pinned source pipeline was rerun without changing the immutable release bytes. Desktop and 390 px mobile screenshots were inspected.

## Source re-check, 10 November 2026

The release's `stale_after` (30 October 2026) is the review date HDX itself lists for this dataset. On 10 November 2026 the source was checked again:

- HDX still lists the dataset as last modified on 14 August 2026, before the Atlas retrieval of 7 September 2026, with the review date of 30 October 2026 passed and no newer version published.
- The GeoJSON archive downloaded that day has the pinned SHA-256 (`9f6713c4…46b6707`), so the published 2.0.1 release still matches the newest source.

The release therefore stays as published and is correctly shown as past its review date. The notice now appears with the boundary controls (the Boundaries tab) instead of above the whole map, because it concerns boundaries only. A new release is due when HDX publishes a new version.

The browser test for the empty and stale states sets its own date, so it no longer depends on the day it runs.
