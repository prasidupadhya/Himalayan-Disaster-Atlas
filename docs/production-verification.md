# Features 39–41 verification

Base: main `4151e00`. Implementation branch: `feat/ci-cd`; all three requested features remain on that one branch. Validation performed on macOS ARM64, Node 22.13.1, npm 10.9.2, and the existing Python 3.12 virtual environment. CI pins Python 3.12.14 on Ubuntu 24.04; this local run is not a claim that a remote Actions runner executed.

- Clean root `npm ci --include=dev --workspaces --include-workspace-root` succeeded; npm reported zero vulnerabilities after the Vitest/Sharp patches.
- `npm run check` passed: 67 Python and 125 TypeScript tests, all release/schema/spatial checks, type checking, JavaScript/Python linting, security checks and root static build.
- The export contains 1,780 files, approximately 95.1 MiB total; all files are below Cloudflare's 25 MiB per-file limit. Published source/data bytes remain unchanged.
- The licence ledger covers all 56 manifests and hashes the entire public data tree. Missing/stale reviews, incomplete coverage, unknown/cyclic parents and transitive blockers have regression coverage. Deployment environment failures report variable names without supplied credential values.
- The final implementation uses 17 schema-derived standalone validators, with type guards and semantic checks retained; CSP still prohibits runtime evaluation. A separate regression confirms that tracked acquisition environment files are rejected even outside the web app.
- Full browser suites passed: 65 tests against the plain static server and 67 against the local Cloudflare runtime, including routing, cache/security headers, compressed artifact integrity and mobile licence-page coverage.

## Local performance

Measured on 2026-09-09 using `npm run profile:performance -- http://127.0.0.1:4174 /tmp/atlas-production-performance.json`, Chromium SwiftShader on an Apple M3 Pro. All four samples met the existing feature 38 reference budgets.

| Viewport / cache | Map ready | First / settled controls | 2D / 3D frame gap p95 | Main JS heap | Window resource bodies |
| --- | ---: | ---: | ---: | ---: | ---: |
| Desktop 1280×800, cold | 2.43 s | 943 / 71 ms | 16.8 / 166.6 ms | 53.3 MiB | 5.83 MiB |
| Desktop 1280×800, warm | 1.82 s | 95 / 69 ms | 16.8 / 216.7 ms | 57.6 MiB | 5.82 MiB |
| Phone viewport 390×844, cold | 1.15 s | 76 / 69 ms | 16.7 / 83.3 ms | 70.5 MiB | 4.48 MiB |
| Phone viewport 390×844, warm | 1.26 s | 76 / 66 ms | 16.8 / 66.6 ms | 53.9 MiB | 4.48 MiB |

These are local software-rendering smoke measurements, not physical-phone or live HTTPS results. Control timings include Playwright overhead; heap excludes workers/GPU and depends on garbage collection. Resource timings cover window requests, not all worker traffic. Largest observed long tasks were 0.91–1.16 seconds, so passing these budgets does not imply that startup is free of main-thread stalls.

## Release status

The missing Wrangler assets configuration from the supplied log is fixed. Local Cloudflare tests use the production asset/routing settings. A final `npx --no-install wrangler deploy --dry-run` passed the security/static checks and stopped at the publication gate as expected. Public upload/deploy has not occurred: the publication gate intentionally rejects 19 unresolved dataset reviews, including BIPAD, WorldPop and affected mixed-source derivatives. Both river-only scenario outputs have documented compatible FAO CC BY inputs and are permitted subject to attribution.

A complete full-data production launch still requires source-specific rights clearance, configured repository/environment protections and Cloudflare deployment credentials, followed by smoke/performance checks on the actual HTTPS hostname. No DNS, custom domain, GitHub settings or Cloudflare account configuration was changed. See [deployment and rollback](deployment.md) and [licensing findings](licensing.md).
