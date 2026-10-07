

Feature 47 adds `service-worker/sw.template.js`, built into `out/sw.js` by `scripts/prepare-service-worker.mjs` with a SHA-256-pinned shell manifest before the public inventory is hashed; the static-export gate re-verifies it. `components/offline-shell.tsx` registers the worker, shows the offline banner and an explicit update prompt. Playwright blocks workers except in the offline suite. See [offline shell](../offline-shell.md).
