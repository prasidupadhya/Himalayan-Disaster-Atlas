# Live contracts — Feature 42

Branch: `feat/live-contracts`. This feature establishes the shared protocol for **periodically updated conditions**, not a real-time warning service. It adds no acquisition job, live readings, `/live/` page, service worker or scientific model. Feature 43 supplies reviewed open feeds; Feature 46 supplies the bilingual page; Feature 47 supplies the offline shell. Each requires its own reviewed PR.

## Contracts and evidence

`schemas/live-snapshot.schema.json` and `schemas/live-index.schema.json` are strict Draft 7 contracts. Their TypeScript adapters are in `packages/contracts/live.ts`; Python schema/semantic validation is in `pipelines/atlas_pipeline/live_contracts.py`. AJV standalone code is generated offline and checked against the locked compiler. No browser acquisition or runtime compilation is introduced.

| Object | Meaning |
| --- | --- |
| Snapshot | Immutable dataset/version/ID with source URL/version, raw source checksum, fetched/issue times, licence/review status, attribution, units, CRS, assumptions and limitations |
| Index | Publication time, workflow outcome/timestamps/run link, three-hour schedule, independent heartbeat threshold, per-feed attempt outcome and nullable snapshot references |
| Reference | Exact local versioned path, identity, SHA-256 and byte size; no arbitrary URL/path traversal |
| Record | Stable ID, nullable label/coordinates, evidence class, observation/issue/validity times and unit-labelled measurements |

Evidence is **OBSERVED / REPORTED / DERIVED / MODELLED / HYPOTHETICAL / UNKNOWN**, with non-color labels. Product purpose is separate: observation, reported event, forecast, official warning, hypothetical scenario or unknown. Forecasts must remain modelled and retain issue/validity windows; events remain reported. Official-warning identity requires official DHM evidence, but the independent policy still blocks its acquisition/publication. Hypothetical scenarios require assumptions. These contracts authorize no physical loss calculation.

Unknown is JSON `null` and presented as UNKNOWN; source zero stays zero. Six outputs are required and null-only: physical inundation, destroyed buildings, casualties, repair costs, hydropower downtime and economic loss. Numeric placeholders, manufactured percentage bands and unexpected personal-data fields are rejected. Variable/unit pairs are enforced; valued magnitude, water level, precipitation accumulation and AQI need qualifiers identifying type, datum, interval and standard respectively. Negative temperature and source negative depth are preserved.

Coordinates use OGC:CRS84 longitude/latitude and cannot establish jurisdiction, damage, causation or hazard classification. Text fields are bounded but future acquisition adapters must curate them: schema validation alone cannot detect personal information embedded in source text.

## Freshness and workflow health

Timestamps use UTC RFC3339 `Z`, optionally with 1–3 fractional digits. Year zero, leap seconds and 24:00 rollover are unsupported and rejected rather than normalized differently between runtimes. Fetch, issue, observation and forecast validity are distinct. Source/record observations cannot follow a completed fetch; forecast validity can lie in the future. Duplicate IDs/variables, impossible timestamps, incorrect units and inconsistent identities fail validation.

Source freshness begins at issue time, or conservatively at the oldest observation when every record has a known observation time. Unknown time remains unknown; a retry cannot replace it with fetch time. Declared expiry and official-warning validity can shorten the age deadline. Unknown warning validity remains STALE. Thresholds are bounded inputs, not confidence measures.

| Resource state | Meaning |
| --- | --- |
| READY | Verified nonempty snapshot within source and workflow freshness policies |
| EMPTY | Verified successful response with no records; never failed fetch or all-clear |
| STALE | Expired/unknown source freshness, failed attempt with retained snapshot, unknown warning validity, or overdue/unknown workflow health |
| UNAVAILABLE | Disabled/unconfigured feed, no verified snapshot, missing file, or unverifiable clock/publication time |
| ERROR | Invalid bytes/JSON/schema/semantics; unverified content is not displayed |

Workflow health is separately labelled HEALTHY, PARTIAL, FAILED, STALE or UNAVAILABLE. Outcome is derived from enabled feeds; workflow timestamps equal the latest corresponding per-feed timestamps. A failed attempt may retain the previous immutable snapshot and its unchanged last successful fetch time. Failure without a previous snapshot stays unavailable; valid empty remains successful. Stopping the workflow cannot leave data indefinitely fresh.

The browser clock refreshes every second, schedules the earliest source/workflow expiry, and rechecks on `pageshow`/`visibilitychange`. Cleanup removes timers/listeners. Client clock accuracy remains a limitation; publication ahead of that clock is unavailable. Future offline caching must recompute freshness from preserved timestamps on every read.

## Integrity and publication

The cancellable browser loader reads only local JSON: index at most 64 KiB, snapshot at most 512 KiB, eight feeds, 4,096 records per snapshot, 16 measurements per record. Stream limits, UTF-8, exact byte size/hash and identity are verified. Redirects fail closed. Pinned indexes are checksum-verified too. The future `/live/latest.json` path is supported but **not published here**; such a mutable index is schema/semantic-validated and its referenced immutable bytes are checksum-verified. Hashes detect changes relative to references; they do not authenticate a provider, establish science or grant redistribution rights.

The immutable fixture writer preflights every existing byte and rejects conflicts/extra files before writing. Feature 43 must implement atomic mutable-pointer promotion after immutable artifacts, source-specific validation, provenance and exact-release licensing checks pass. Feature 42 claims no atomic latest-pointer publisher or scheduled workflow.

## Approved source policy

`packages/contracts/live-policy.json` is trusted checked-in policy, independent of claims in incoming data. USGS and NOAA GFS are eligible for future reviewed acquisition; exact source content/terms, transformations and freshness thresholds still require Feature 43 review. **No source is acquired now.** An embedded `PERMITTED` field never replaces the external manifest-pinned licensing ledger.

| Source | Current decision |
| --- | --- |
| DHM | Official links only; no ingestion before documented permission/stable interface |
| BIPAD/NDRRMA | No live ingestion; unresolved releases remain excluded from the public export |
| OpenAQ | Disabled; later flagged ingestion needs per-provider review |
| Open-Meteo | Disabled; NOAA GFS is first; any future model must be pinned |
| IMERG | Optional and disabled |
| WorldPop / GEM | No public rights grant or population substitution |
| GHS-POP | Evaluate/register separately in Feature 48 |

The guard blocks conditional sources even if an index attempts to enable them. The Rasuwa bulletin is a pattern reference only; none of its code is copied. No secrets, accounts, personal data or third-party browser calls are added.

Official warnings remain the responsibility of [DHM](https://www.dhm.gov.np/index.php), [NDRRMA](https://ndrrma.gov.np/) and [BIPAD](https://bipadportal.gov.np/). The contract notice is “Periodically updated conditions; not a real-time warning service.” Educational cases additionally carry “Scenario / educational estimate, not a forecast or warning.”

## Fixtures, provenance and licensing

`atlas-live-contracts@1.0.0` is original MIT test data with no measurements or locations: a measurement-free record, empty snapshot, unknown freshness and fixed workflow states. Its dates are test inputs, not actual fetches. The collapsed Data Catalog inspector explains this before loading anything. Default production catalog filters exclude fixtures; the existing opt-in exposes their provenance.

`npm run data:live-contracts` builds/verifies identical immutable release/public copies. Root data validation checks artifact sizes/hashes, semantics, inventory and public byte equality. `atlas-provenance@1.2.0` registers this fixture; previous catalogs and their records remain unchanged. Sources/Methodology have explicit contract sections. The ledger adds only the own-work fixture and metadata catalog, retaining every unresolved upstream review and exclusion.

## Validation and maintenance

Vitest/Python share acceptance/rejection fixtures and compare freshness/health at exact boundaries. Tests cover zero/null, evidence, units, chronology, duplicates/nonfinite values, source flags, rights, immutable conflicts and corrupted bytes/public copies. Numeric unit-test inputs remain test-only and are not published readings.

Playwright covers verification, clock expiry/tab resume, failed versus empty versus unconfigured responses, unknown freshness, missing/corrupted artifacts/retry, WebGL failure, 320/390px layouts, keyboard-only operation, announcements and provenance links. It tests the preparatory contract inspector; Feature 46 must repeat these cases on its actual page/map fallback.

Required gates: `npm run check`, `npm run test:e2e:public`, `npm run release:check`. Preserve static export, strict CSP and public/research profiles. Change schema/TS/Python/common fixtures/generated validators together. Never overwrite a published release/catalog; bump versions and review new hashes. Acquisition, PWA, physical footprints, damage calculations and manufactured uncertainty cannot be added under this fixture identity.
