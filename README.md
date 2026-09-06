# Himalayan Disaster Atlas

A public, read-only, Nepal-focused geospatial atlas. This repository currently implements **Foundation**, owned by Astra on `feat/foundation`.

The foundation includes a static Next.js application, a MapLibre sample map, shared machine-checked data contracts, and an offline Python acquisition-to-release pipeline. **All sample points are synthetic. No geographic inventory, hazard analysis, simulation, or operational warning is provided.**

## Run locally

Requires Node **22.13+ (22.x)**, npm 10+, and Python **3.12**. No API keys or accounts are needed. The initial dependency install needs internet access; the app and sample pipeline then use local files only.

```sh
npm ci
python3.12 -m venv .venv
.venv/bin/python -m pip install -r requirements.lock
npm run data:sample
npm run dev
```

Open http://127.0.0.1:3000. `/atlas/` contains the map; `/data-catalog/`, `/methodology/`, and `/sources/` expose the foundation's evidence conventions.

```sh
npm run check
npx playwright install chromium
npm run test:e2e
```

`check` runs the sample pipeline, release validation, Python and TypeScript tests, type checking, both linters, the production static export, and source/output credential checks. Browser tests serve the exported output on port 4173 and exercise desktop/mobile map interactions and failure states. On Linux, Playwright may require `npx playwright install --with-deps chromium`.

To inspect the production output:

```sh
python3 -m http.server 4173 --bind 127.0.0.1 --directory apps/web/out
```

Deploy only `apps/web/out/` when the production feature is ready. No deployment or merge is part of this foundation implementation.

## Repository map

| Directory | Responsibility |
| --- | --- |
| `apps/web/app` | Routes and static application shell |
| `apps/web/features` | Feature-owned interaction code; currently Atlas sample |
| `apps/web/lib`, `components` | Shared loading, layer lifecycle, state and evidence presentation |
| `packages/contracts`, `schemas` | TypeScript boundary and authoritative JSON schema |
| `pipelines/atlas_pipeline` | Offline acquisition, normalization, validation and publication |
| `data/raw`, `data/processed` | Ignored source snapshots and intermediate outputs |
| `data/releases` | Small validated versioned releases |
| `apps/web/public/data` | Exact public copies of validated presentation artifacts |
| `processing`, `simulations`, `ai` | Documented extension boundaries; no algorithms implemented yet |
| `tests` | Shared adversarial fixtures, Python, TypeScript and browser checks |
| `docs` | Architecture, data notes, assumptions, licensing and delivery checklist |

Start with [architecture](docs/architecture/README.md), [data contract](docs/architecture/data-contract.md), [development workflow](docs/architecture/development.md), and the [foundation handoff](docs/foundation.md).

The product specification is user-supplied. Its original attachment includes credentials and is deliberately not copied into Git. This repository records the relevant foundation requirements without those values. Project code has no redistribution license selected yet; see [licensing](docs/licensing/README.md).
