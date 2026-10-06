# Live air quality — Feature 45

Branch `feat/live-air-quality` extends Feature 43's acquisition conventions and Feature 42's evidence, timestamp, freshness and null contracts. It does not enable a provider or change either build profile's exclusions.

## Method and review

OpenAQ v3 supplies original PM2.5 measurements, not a project AQI. [OpenAQ terms](https://docs.openaq.org/about/terms) require each underlying provider's rights to be reviewed independently. `licensing/openaq-providers.json` is an empty, schema-validated allowlist. Default and public enable flags are false. A future review must pin provider, Nepal location, stationary sensor, licence IDs/URLs, attribution, date, evidence links and obligations; at most four station/sensor reviews may be acquired per run. Adding a research provider does not grant public publication rights.

The adapter checks provider/location/sensor identities, stationary status, Nepal country and bounded coordinates, PM2.5 units, licence identity, timestamps, averaging interval and quality flags. Declared microgram spellings normalize exactly to `ug/m3`; other units fail. Source zero stays zero. Flagged readings, absent quality flags or absent averaging periods produce a null usable concentration; original reported values and flags remain separate research metadata. Invalid or future intervals fail. Valid empty collections remain empty successes with unknown source freshness. Empty HTTP bodies, incomplete pagination and malformed responses fail.

AQI and its standard remain null / UNKNOWN: no completeness rule or calculation standard has been reviewed. Accuracy, detailed flag reasons and health implications remain UNKNOWN. Damage, loss, inundation and casualties stay null.

## Execution and privacy

`npm run live:air-quality` returns DISABLED without a request or key. `npm run live:air-quality -- --enable-research` returns LICENSE_UNRESOLVED with the empty allowlist. Public-profile acquisition is rejected.

The manual-only `.github/workflows/live-air-quality.yml` also requires repository variable `ENABLE_RESEARCH_OPENAQ=true`. A reviewed, explicitly enabled run obtains `OPENAQ_API_KEY` only from GitHub Actions secrets. No key is passed to Next.js or persisted. Local credential acquisition is rejected. Requests use fixed OpenAQ HTTPS URLs, no redirects/retries, a 20-second socket timeout, 512 KiB response bound and one location plus one one-day measurement request per review. Pagination beyond 168 records fails closed. HTTP errors use safe codes without header payloads.

Only normalized stationary research metadata is retained; owner/contact fields and raw payloads are not copied. Two response hashes and exact request URLs are recorded. Immutable research directories in ignored `data/staging/openaq/` use the Feature 43 atomic writer. The Action does not upload these directories, push data/main, or deploy; outputs disappear with the runner. There is no browser API call, public reading, export path or cron.

## Contracts and publication

`schemas/live-air-quality.schema.json` and shared TypeScript/Python parsers validate the research envelope around the live snapshot. `schemas/openaq-policy.schema.json` validates the allowlist. The public live loader still rejects enabled OpenAQ indexes independently. `atlas-live-air-quality@1.0.0` and provenance `atlas-provenance@1.4.0` are original MIT methodology metadata only, granting no provider rights. All existing licensing blockers remain.

## Maintenance and validation

Enabling a provider needs separate review of redistribution terms, stationary metadata privacy, API stability and completeness limits. Identity, unit, flag, interval or licence drift must fail rather than silently adopting a new source. AQI requires a separate declared standard, sufficient observations and parity tests.

Shared synthetic cases test TypeScript/Python rejection and zero/null parity. Python covers disabled/unreviewed paths without requests, Actions-only credentials, identity/unit/time/flag failures, valid empty versus failed responses and staleness. Playwright checks disabled air quality alongside normal, stale, unavailable, failed, empty-valid and corrupt feed states, plus mobile, keyboard and WebGL failure. Gates: `npm run check`, `npm run test:e2e:public`, `npm run release:check`. Tests need no API key.

Official [DHM](https://www.dhm.gov.np/), [NDRRMA](https://ndrrma.gov.np/) and [BIPAD](https://bipadportal.gov.np/) remain warning authorities. No official ingestion is added. Conditions are periodically updated context, not a real-time warning service.
