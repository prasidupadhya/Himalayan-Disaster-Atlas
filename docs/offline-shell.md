# Offline shell — Feature 47

Branch `feat/offline-shell`, stacked on Feature 46 (`feat/live-conditions`). It adds the Atlas's own service worker (`apps/web/service-worker/sw.template.js`, written for this project; no Rasuwa code is copied), an offline page, last-known labelling on `/live/`, and build/release gates. It adds no source, acquisition or schedule.

## Behaviour

| Request | Strategy | Offline fallback |
| --- | --- | --- |
| `/live/latest.json`, `/data/live-*/<version>/{snapshot,manifest}.json` | Network first, 8 s timeout | Stored copy, only if intact and within retention, served with `x-atlas-delivery: last-known` and `x-atlas-cached-at` |
| Page navigations | Network (no timeout, so slow connections are not mistaken for offline) | Saved shell page, otherwise `/offline/` |
| Page data (`index.txt`, `__next.*.txt`, `?_rsc=`) | Network | Saved shell copy |
| `/_next/static/*`, `/vendor/*` (content-hashed) | Shell cache, then runtime cache (160 entries), then network | — |
| Everything else, including immutable `/data` releases | Not intercepted | — |

Any HTTP response, including 404 or 500, is treated as the server's current answer; only a network failure or timeout falls back. Stored copies are never substituted for a reachable server.

## Integrity, freshness and expiry

- **Shell checksums.** `scripts/prepare-service-worker.mjs` pins every shell file by byte size and SHA-256 into `sw.js`. Install fetches each file with `cache: 'reload'`, verifies it, and stores nothing unless every file matches; a failed install leaves the previous version active. `verifyServiceWorker` in the static-export gate fails the release if `sw.js` does not describe the exported bytes exactly.
- **Live checksums.** A snapshot is stored only if its bytes match the `sha256`/`byte_size` reference in the index fetched just before it. Before every offline use the stored bytes are re-hashed against both their stored hash and the stored index reference; a mismatch deletes the entry and the page shows UNAVAILABLE. The page's loader verifies the same checksums again.
- **Freshness.** Delivery never alters timestamps. The page recomputes FRESH/STALE/UNAVAILABLE from source, fetch and workflow times; an offline copy is labelled **LAST KNOWN**, never FRESH, and **LAST KNOWN · STALE** after its deadline. When the device reports offline, data loaded earlier is relabelled LAST KNOWN as well, because it can no longer be rechecked. Returning online rechecks automatically.
- **Expiry.** Stored live copies older than 7 days (`live_retention_seconds`) are deleted and never served; an expired index removes the whole live cache, so the page shows the publication as unavailable rather than old data.

## Versioning and upgrade

The cache version is a hash of the shell manifest, policy and template. Caches are `atlas-shell-<version>`, `atlas-static-v1` and `atlas-live-v1`; activation deletes any other `atlas-*` cache. A first install activates immediately; later versions wait until the reader presses **Reload to update** (posts `ATLAS_SKIP_WAITING`), so an open page never switches shells mid-session. `sw.js` is served `no-cache, no-transform` and registered with `updateViaCache: 'none'`.

## Shell contents and budget

Pinned pages: `/`, `/live/`, `/offline/`, `/methodology/`, `/sources/`, with their page data and referenced CSS/JS, plus `/icon.svg`. The budget is 3 MiB (currently about 2.7 MiB). The map library (about 2 MB) is **not** precached; it is cached at runtime once used online. Offline without it, `/live/` shows a map-unavailable notice and every record stays in the tables.

## Policy and provenance

`packages/contracts/offline-shell-policy.json` holds pages, budget, retention, timeout, labels and English/Nepali copy. It is checked in Python (`pipelines/atlas_pipeline/offline_shell.py`) and registered as `atlas-live-offline-shell@1.0.0` with `atlas-provenance@1.6.0`, both original MIT metadata.

## Tests

- Vitest (`tests/web/offline-shell.test.ts`, 21 cases) runs the real worker source in an isolated VM with in-memory caches and a controllable clock: checksum-verified install and tampered-shell rejection, first-install activation versus explicit upgrade, old-cache cleanup, pass-through of network answers (including 404), last-known headers, timeout fallback, refusal to store mismatched snapshots, purge of corrupted copies, expiry, pruning of unreferenced snapshots, shell navigation and offline page, slow pages not treated as offline, bounded static cache, build-time pinning and tamper detection, and page labels (never FRESH when last known; LAST KNOWN · STALE; bilingual policy parity).
- Python (`tests/python/test_offline_shell.py`): registration byte equality; LAST KNOWN and not-rechecked wording required; no immediacy wording; translation and placeholder parity; retention, timeout and budget bounds; pinned live/offline pages.
- Playwright (`tests/e2e/offline-shell.spec.ts`, service workers allowed only here): online → offline (live relabel) → offline reload from the shell → back online rechecks to FRESH; LAST KNOWN · STALE after the deadline; corrupted stored snapshot purged; expired publication deleted; uncached route shows the offline page; 320px and no-WebGL offline; keyboard-only Nepali bulletin with last-known wording; `sw.js` headers and manifest. All other Playwright suites run with `serviceWorkers: 'block'`, because `page.route` cannot see requests a worker answers.

## Limitations and maintenance

- The device clock is trusted for retention and freshness; a wrong clock can shorten or lengthen both. Freshness labels still show the original timestamps.
- Cloudflare or any proxy that rewrites shell HTML/JS would change checksums. Installation then fails closed (no offline shell) rather than storing unverified bytes. `sw.js` and data paths are `no-transform`.
- Adding a shell page, raising the budget, precaching the map or changing retention requires editing the policy and registering a **new version**.
- Never serve a stored copy without the `last-known` header, never change timestamps in the worker, and never treat a timeout on navigation as offline.

## Policy 1.1.0

`atlas-live-offline-shell@1.1.0` adds `/hazards/`, `/simulate/` and `/simulate/report/` (with their code) to the checksum-pinned shell, raises the shell budget to 4 MiB, and caches immutable versioned `/data/<id>/<x.y.z>/` releases on first online use (cache first, at most 120 entries, cache `atlas-data-v1`). Live data keeps its network-first, LAST KNOWN handling. Pages still check every artifact's size and SHA-256 against its release manifest before use, so a stored copy cannot change what is shown. The hub and the simulator therefore work offline after one online visit. Version 1.0.0 stays published unchanged.
