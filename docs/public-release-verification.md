# Reduced public release verification

Base: main `fa1929c`. Fix branch: `fix/deployable-public-export`.

The supplied Cloudflare build completed successfully, then failed in the repository's publication-rights gate. The reduced public profile addresses that failure by excluding the 19 unresolved releases, including transitive derivatives, while preserving every source artifact and review in the repository. It does not mark unknown rights as permitted.

## Build and release behavior

- `npm run build` produces the public profile. It omits blocked feature entry points before bundling, rejects imports of their manifests, removes their complete output directories and inventories all retained output bytes.
- The public export contains 1,237 files, approximately 70.4 MiB. Every file remains below the 25 MiB limit. All 37 retained reviewed releases keep their original bytes; the original provenance metadata also records withheld sources for audit purposes.
- Catalog and Sources list only retained releases. Licence reviews explain omitted downloads. Dependent routes show unavailable states, and the map's availability notice identifies the omitted features. Missing results are never presented as zero.
- `npm run build:research` retains the complete 1,780-file local export and original feature implementation. It cannot pass the publication gate because it has no public release inventory.
- The deployment gate verifies the current exclusion set, rejects reintroduced data and changed export bytes, and retains the existing security, static-file and upstream licence checks.
- CI tests both profiles and uploads only the tested public export. Local development explicitly uses webpack so the same profile configuration applies.

## Validation

- Data/schema/spatial validation and all 67 Python tests passed.
- All 126 TypeScript tests passed, including public-export tampering, omitted-file and research-inventory regressions. TypeScript checking and both linters passed after replacing a browser environment lookup with a compile-time boolean.
- Public Cloudflare browser suite: **36 passed**, covering retained scientific features, terrain bounds, downstream trace, scenarios, corrupt-data handling, performance smoke budgets, headers, unavailable routes, excluded-file 404s, phone layout and keyboard access.
- `npx --no-install wrangler deploy --dry-run` completed successfully with the reduced export, including the publication gate and Wrangler asset discovery. This is a local packaging/deployment check, not an uploaded live release.

- Complete research browser suite: **65 passed**, including the original event, population, exposure, search, time-machine, graph and analyst features.
- The actual research export was also rejected by `npm run release:check` as intended. The public profile was rebuilt afterwards for local preview and deployment.

No data releases, schema bytes or licence decisions were changed. The fix is prepared on a review branch; main must receive that reviewed change before Cloudflare's existing main-branch integration can deploy it. No main merge or live Cloudflare upload was performed during local verification.
