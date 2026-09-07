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
