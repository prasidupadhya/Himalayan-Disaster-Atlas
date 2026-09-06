# Development and feature handoff

One feature, one branch, one AI owner. Foundation belongs to Astra and has no predecessor dependencies; the repository was empty. Work stays on `feat/foundation`. Administrative boundaries and terrain are the next independent features after Foundation is reviewed and merged. Do not merge automatically. The user's supplied specification reserves important scientific/data choices and the final merge gate for user verification.

## Adding a feature

1. Read the feature's specification and check required dependencies are merged.
2. Create its assigned feature branch and keep one owner.
3. Record source access, version, license, intended evidence status, scientific assumptions and failure cases in `docs/datasets/` before publishing data.
4. Put acquisition in `pipelines/<source>/`, reusable transformations in `processing/`, and immutable public data in the central release path. Do not download source data from a React component.
5. Extend the shared schema, units and validators centrally when needed. New schema versions need compatibility/migration notes. Add shared malformed-data fixtures and Python/domain tests.
6. Validate CRS, coordinates, geometry, IDs, units, timestamps, nulls, source metadata, license and hashes before release. No silently repaired or inferred hazard relationships.
7. Add feature UI under `apps/web/features/<feature>/`; use shared state, evidence and map lifecycle helpers. Add keyboard-accessible equivalents of map-only interactions.
8. Update Data Catalog, Methodology and Sources alongside each real dataset/algorithm. Run `npm run check` and browser tests relevant to the change.
9. Prepare an evidence-based handoff, then PR/user review. Never push to or merge into main as an incidental implementation step.

## Tests and reproducibility

`npm ci` uses the Node lockfile; Python 3.12 installs from `requirements.lock` (transitive versions pinned). `requirements.txt` lists direct dependencies. To intentionally refresh Python dependencies, install the direct requirements in a fresh 3.12 venv, freeze the environment, and rerun all checks. No dependency cache is required from a previous checkout.

TypeScript tests cover null/zero semantics, shared schema rejection cases, manifest-first loading, cancellation, bounds/checksums, states and source cleanup. Python tests add topology and full acquisition-to-release reproducibility, conflict prevention and invalid-data rejection. Browser tests use the static export and real Chromium WebGL, with software rendering enabled for repeatability. They cover navigation, map load, keyboard inspection, mobile overflow, unavailable/retry, stale/empty, corrupt artifacts and WebGL fallback.

CI automation, deployment/rollback configuration and full performance hardening have separate assigned feature branches. These local commands form their initial contract. No private services or production datasets are needed for these checks.
