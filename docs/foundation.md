# Foundation handoff

Branch: `feat/foundation`. Owner: Astra. Scope: master brief §173.1 plus foundation-relevant universal checks. Starting state: empty repository, no commits and no upstream main available locally. No predecessor feature or production dataset is required.

## Acceptance and implementation

| Foundation requirement | Implementation / verification |
| --- | --- |
| Understandable architecture and feature boundaries | Root README, architecture/development docs, per-boundary READMEs and AGENTS.md |
| Framework, routes and shared UI | Next.js static export, React/TypeScript, home/Atlas/catalog/methodology/sources, evidence and state components |
| Sample map through intended architecture | Lazy MapLibre, validated local manifest and GeoJSON, managed source/layer lifecycle, point selection and keyboard alternative |
| Acquisition → cleaning → normalization → validation → versioning → presentation | Deterministic local CSV pipeline, raw hash, processed output, immutable release and exact public copy |
| Canonical metadata and evidence semantics | Shared Draft 7 schema, TypeScript interfaces, Python/Ajv validators, status/evidence constraints, explicit nulls |
| CRS, geometry, timestamps, identifiers, units and metadata completeness | CRS84/axis/extent checks, Shapely topology, timezone formats, identifier/version/unit vocabularies, required metadata and shared rejection fixtures |
| Secret/configuration boundary | No frontend config keys, ignored local env files, restricted imports/env reads, build environment allowlist and pre/post credential checks |
| Loading/error/empty/unavailable/stale | Discriminated resource states, retry, explicit stale deadlines, WebGL fallback with accessible records |
| Asset and large-data conventions | Small GeoJSON cap, checksums, documented PMTiles/COG/GeoParquet adapters and range-delivery boundary |
| Testing and clean setup | npm lockfile, Python direct requirements and transitive lock, README commands, unit/pipeline/browser suites |
| Scientific/source/license notes | Synthetic-only dataset note, public evidence pages, methodology, uncertainty and fixture-only CC0 dedication |

## Review boundaries

Foundation introduces no real hazard classifications, causal relationships, geographic inventories, DEM, operational feeds, simulation models or scientific calculations. No private service was accessed. Only a synthetic development fixture is published. The original credential-bearing brief is outside Git and is not included in build inputs.

The sample map has no geographic basemap: its points exercise the architecture and do not indicate real features. Six common GeoJSON geometry types are supported. The schema intentionally rejects GeometryCollection, Z coordinates and antimeridian-spanning coverage until reviewed extensions exist. Browser geometry checks are a subset of the offline Shapely gate. Production datasets need domain-specific scientific QA beyond schema validity.

CI/CD, licensing audit, real terrain/geography, operational refresh, simulation implementation, deployment and final UI polish remain their own feature branches. Review and merge of Foundation is the next human handoff; no remote branch, PR, merge or deployment has been created by this implementation.

## Validation results

Verified on 2026-09-06 with Node 22.13.1, Python 3.12.8 and Chromium 153 (Playwright 1.63.0):

- 37 TypeScript/component/security tests passed.
- 10 Python pipeline/contract/topology tests passed (including 20 shared malformed-data cases).
- 6 browser integration tests passed: real WebGL rendering and clicks, layer toggles, keyboard selection, static navigation, mobile fit/control clearance, retry, tamper rejection, empty/stale states and WebGL fallback.
- Schema/release/hash/public-copy validation, TypeScript checks, ESLint, Ruff and production static export passed.
- Fresh source-only copy: independent `npm ci`, a new Python 3.12 venv installed from `requirements.lock`, and `npm run check` passed without original node_modules, venv or generated assets.
- Source and static output credential checks passed; `npm audit` reported zero known vulnerabilities at verification time.
- Desktop and 390px mobile screenshots reviewed. The map workflow made no external network requests.

The initial shared Playwright cache stalled, so browser debugging used an isolated install. The shared cache was subsequently restored and the standard `npm run test:e2e` command was verified. No custom browser path is required.

Map integration fixes verified by browser tests: explicit locally hosted ES module worker; canonical string feature IDs promoted through the rendering adapter; readiness after data rendering; reset/attribution separation on mobile.

The root layout also tolerates extension-injected `<body>` attributes during hydration. A development-mode regression test simulates Grammarly's attributes and separately confirms that application-content mismatches still produce diagnostics.
