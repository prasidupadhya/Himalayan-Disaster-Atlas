# Static previews on Vercel and delivery on Cloudflare

Use Node 22.x and the root npm workspace lockfile. The project exports static files; it does not require a hosted Next.js server, acquisition credentials, Python or remote data jobs at build time.

## Vercel

Recommended project Root Directory: repository root (`.`). The checked-in root `vercel.json` selects the Other preset, installs all workspaces plus build dependencies with `npm ci`, runs `npm run build`, and publishes `apps/web/out`.

Existing projects whose Root Directory is `apps/web` can use `apps/web/vercel.json`: it installs from the repository root, invokes the same checked build, and publishes `out`. Enable Vercel's setting to include source files outside the Root Directory, since shared contracts, schemas and scripts are in the repository root. Both package files pin Node 22.x.

The web `build` script always invokes `scripts/build.mjs`, which normalizes its working directory, prepares the local MapLibre worker, runs credential/security checks, invokes `build:static`, and checks the output. The `@atlas/contracts` workspace owns `ajv` and `ajv-formats`, and the web workspace declares that dependency explicitly. The previous log showed a web-only installation with the validators omitted and a direct Next build bypassing these steps.

Push the reviewed branch when ready to trigger a Vercel preview; creating a branch/commit locally does not update a Vercel deployment. No PR or deployment is created by these configuration files.

## Cloudflare

The same static export is portable. Use repository root, install with `npm ci --include=dev --workspaces --include-workspace-root`, build with `npm run build`, and deploy `apps/web/out`. Select Node 22.x in the build environment. No Vercel adapter or runtime dependency is required.

## Verification

A clean temporary checkout was installed using the Vercel install command from `apps/web` and built through its public `build` script using Node 22. This verifies missing validators, shared workspace resolution, static export, worker preparation and security checks without relying on the developer's node_modules. Platform deployment itself still requires pushing the branch and a successful Vercel build.

References: [Vercel monorepos](https://vercel.com/docs/monorepos), [static configuration](https://vercel.com/docs/project-configuration/vercel-json), [Node versions](https://vercel.com/docs/functions/runtimes/node-js/node-js-versions).

## Features 39–41: Cloudflare Workers Static Assets

The supplied 9 September log completed the root build and both security scans. It failed at `wrangler versions upload` with “Missing entry-point to Worker script or to assets directory”. The repository now pins Wrangler and supplies `wrangler.jsonc`, pointing `assets.directory` to `apps/web/out`. There is no Worker script, Next adapter, runtime database, R2 bucket or private API.

Use repository root, Node from `.nvmrc`, `npm ci --include=dev --workspaces --include-workspace-root`, and root `npm run build`. Set the Cloudflare project/Worker name to match `himalayanatlas` in the configuration (or change that non-secret name in a reviewed commit). Use `npm run deploy:cloudflare` to publish a version, or `npm run upload:cloudflare` to upload an unpromoted version. Both invoke the configuration's `npm run release:check` build hook. **The current full-data export is blocked by 19 unresolved licensing reviews.** The missing-directory configuration error is fixed; that does not override the documented rights blockers.

A plain `npm run build` is a local research export, not legal clearance or proof of CI success. `versions upload` creates a version, not a production rollout. Never replace the root build with a direct Next command. Do not pass `--assets` or alternate configs to bypass release checks when publishing.

### Gated production automation

Recommended production path: GitHub's `Atlas quality` workflow. It runs complete checks, builds once, tests that export on a plain static server and the local Cloudflare assets runtime, then retains it under the commit SHA. Its deployment job consumes that same artifact only after quality succeeds on a main push. It does not rebuild in the credential-bearing step.

Before enabling automation:

1. Resolve the licensing ledger blockers and require `Atlas quality / Quality and static browser tests` in the main ruleset. Enable pull-request review and prevent bypasses.
2. Configure the GitHub `production` environment with main-only deployment and required reviewers. Add only `CLOUDFLARE_API_TOKEN` (limited to the target account's Workers Scripts deployment) and `CLOUDFLARE_ACCOUNT_ID`. Values are checked without logging and are present only in the deploy step. No `NEXT_PUBLIC_*` secret or browser environment variables are needed.
3. Disable Cloudflare/Vercel automatic production builds that would publish independently of this workflow. Set repository variable `ENABLE_CLOUDFLARE_DEPLOYMENT=true` only after prerequisites are satisfied. Until then the deploy job is skipped; quality runs normally.
4. Merge through review, let CI complete, and retain the resulting Git SHA and Cloudflare version ID in the release record.

If continuing Cloudflare Git integration temporarily, keep the checked-in Wrangler release hook and require the successful GitHub quality check before any production merge. The platform's build command alone does not run the Python/browser suite. Do not enable two independent production publishers. Existing Vercel previews also require rights clearance before public distribution; root Vercel configuration is updated to run the publication gate after its build.

### Routing, delivery and cost

The export uses trailing-slash HTML routing and a real static `404.html`; unknown routes must return 404, not an Atlas HTML fallback. `_headers` sets same-origin security policy, frame denial, no-sniff and restricted browser permissions. Next static hydration requires inline scripts and styles, so the current CSP permits those explicitly; it does not permit eval or remote script/API origins. Hash/nonce CSP is a future hardening option, not claimed here.

Only immutable versioned `/data`, local `/vendor` and hashed `/_next/static` assets receive year-long caching. HTML and current software notices are not marked immutable. Gzip data are opaque `application/gzip` artifacts: do not set HTTP `Content-Encoding: gzip` on those files or the browser will decode before the checksum check. The explicit header rule removes that encoding. Asset tests verify the actual served bytes against the manifest checksum. Avoid proxy transformations of published data.

`check-static-export.mjs` rejects symlinks, native/server binaries, source maps, oversized files, missing public assets, changed public bytes, missing routes and exports over the free-plan 20,000-file/25-MiB-per-file limits. The current export is approximately 95.1 MiB across 1,780 files. Static asset requests are free under current Cloudflare pricing; paid features/custom-domain registration and future policy changes are outside the €0 hosting target.

Cloudflare supplies HTTPS on the assigned `workers.dev` hostname. The brief's preferred `https://himalayanatlas.pages.dev` requires a **Pages** project, not a Workers deployment; the same validated `apps/web/out` can be uploaded to Pages after rights clearance. This work has not created a Pages project, reserved a hostname or modified DNS. A custom domain can be attached to the intended Cloudflare project once ownership is available; verify its certificate and redirects before announcing it.

### Local and deployed verification

After `npm run build`, run `npm run preview:cloudflare` and open `http://127.0.0.1:4174/atlas/`. This command generates a local-only config from the production routing settings and removes the publication hook so unresolved research datasets can be inspected locally. It cannot upload, tunnel, or use remote bindings. `npm run test:e2e:cloudflare` runs the complete feature/mobile/accessibility suite plus hosting-specific tests against that runtime.

After an authorized deployment, verify a clean browser session on the actual HTTPS hostname: Atlas initial fit/reset and boundary selection, optional layers, search, downstream trace, exposure, events, analyst/evidence, Sources/Methodology/licences, phone layout and keyboard controls. Confirm 404 status, gzip hashes, no runtime remote API calls and header/cache rules. Use `npm run profile:performance -- https://YOUR-ACTUAL-HOST /tmp/atlas-live-performance.json` and compare the declared budgets; never equate local software-rendered timing with live delivery measurements. No live-domain acceptance or DNS/HTTPS validation has been claimed in this branch.

### Failure handling and rollback

An installation/test/security/schema/licensing failure stops publication. Inspect the failed stage and fix the reviewed inputs; do not weaken validation. A missing credential fails by variable name only. A failed upload leaves the current deployment in place. A failed post-deployment smoke test requires rollback, not edits to immutable data URLs.

Record the previous known-good version ID before rollout. Use Cloudflare's Deployments dashboard to restore that complete version (HTML, bundles and data together), or the pinned CLI `wrangler rollback VERSION_ID` for the correct configured Worker. Test the restored hostname, including byte hashes and cache headers, then open a new fix branch. Do not overwrite data at an existing version URL or mix artifacts from different builds. Pages has a separate deployment rollback control; do not use Workers commands against a Pages project.

References: [Workers static asset configuration](https://developers.cloudflare.com/workers/static-assets/binding/), [SSG and 404 routing](https://developers.cloudflare.com/workers/static-assets/routing/static-site-generation/), [headers](https://developers.cloudflare.com/workers/static-assets/headers/), [limits](https://developers.cloudflare.com/workers/platform/limits/), [pricing](https://developers.cloudflare.com/workers/platform/pricing/), [rollback](https://developers.cloudflare.com/workers/configuration/versions-and-deployments/rollbacks/).

Dependency hardening: Vitest is pinned to 4.1.11, and Sharp is overridden to 0.35.4 for both Next and Wrangler/Miniflare. This addresses [the mocker path traversal advisory](https://github.com/advisories/GHSA-82fw-gwwq-j7x9) and [the libheif advisory](https://github.com/advisories/GHSA-rgj7-g3m4-5g8c). The static website contains neither tool server nor native image library. Keep the override until the deployment tool's own dependency range is patched, then revalidate before removing it.

CSP compatibility: the full Cloudflare suite exposed AJV's browser-time `Function` compilation, which an ordinary static server does not restrict. Seventeen validators are now generated ahead of time from the unchanged central schemas using the same strict/all-errors/format options. `npm run contracts:generate` updates the checked-in code; `npm run contracts:check` and the root build reject stale generation. Contract modules retain their TypeScript guards, semantic/geographic checks and AJV error text. Browser/worker code uses the standalone functions, so `unsafe-eval` remains prohibited. See [AJV standalone validation](https://ajv.js.org/standalone.html).
