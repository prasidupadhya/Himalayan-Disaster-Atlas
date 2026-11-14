# Working in Himalayan Disaster Atlas

Read `README.md` first. The site is plain HTML, CSS and JavaScript in `site/`; keep it that way: no framework, no build step, no new runtime dependency without a clear need.

- Static, public and read-only. No credentials in the browser; acquisition jobs run in GitHub Actions.
- Unknown is `null` in data and UNKNOWN on screen. Never invent geographic facts, hazard levels, causes or measurements. Scenarios are hypothetical model runs, not forecasts.
- Data releases are immutable: a change is a new version folder with its manifest and checksums. Document source, licence, method and limitations before publishing.
- All interface text lives in `site/copy.js`, in English and Nepali. Agency text is shown as published.
- Scenario science lives in `site/models.js` and must keep passing `tests/models.test.mjs` (BSSA14 against pygmm reference cases).
- Before pushing: `npm test`, `python -m unittest tests.test_gov_feeds`, `npm run e2e`.
