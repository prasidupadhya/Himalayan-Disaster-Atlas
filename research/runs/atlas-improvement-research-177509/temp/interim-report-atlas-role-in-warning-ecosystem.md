# Interim report: atlas-role-in-warning-ecosystem

**Locus question:** What can a static, unofficial site add to Nepal warning dissemination without competing with official channels, and how is it kept current and funded?
**Flavor:** dialectical

## What the corpus already said
WMO credits DHM's FFEWS (2016) and the South Asian Flash Flood Guidance System (2018) with cutting flood deaths from 166 (2017) to 27 (2022) [[reducing-flood-casualties-in-nepal]]. Counter-evidence: the Bhotekoshi flood shows a 16-minute lag between the flood entering Nepal and word reaching the Rasuwa DAO, no binding Nepal-China data-sharing, and DHM updates via Facebook about 5h later [[sixteen-minutes-what-the-bhotekoshi-flood-reveals-about-the-regions-unfinished-e]]; other notes report ~250 deaths despite accurate alerts and generic Nepali-only SMS [[missing-on-early-warning-pushed-to-rising-death-tolls-and-losses-of-properties-a]]. Ncell sent 4.4M SMS alerts [[ncell-sent-44-lakh-early-warning-sms-against-landslideflood]]. Community-based warning saved lives [[during-nepal-floods-decentralized-community-based-warning-saved-lives]]. CAP is the interoperability standard [[common-alerting-protocol]]; OpenDRI found no platform built self-sustaining revenue [[opendri-7-sustaining]].
Repo evidence (pipelines/gov_feeds/sources.json): BIPAD JSON endpoints (/api/v1/river-stations, rain-stations are marked verified; incident and alert endpoints are NOT verified); DHM bulletins, forecast, NEMRC and NDRRMA are HTML scrapes, three need JS rendering, none verified. No public DHM CAP feed was found. No new sources were fetched (budget unused; reasoning rests on corpus plus repo inspection).

## What the new sources say
None fetched; see above. Licence terms of BIPAD data remain unverified.

## Evidence synthesis
### Position A: The Atlas should stay a read-only archive/explainer and stay out of the warning chain
Strongest case: official warnings work (166 to 27 deaths), failures are upstream/last-mile (16-minute cross-border lag, language, generic SMS), not the absence of another map. A daily-refreshed static copy is stale by design (hours to a day) while floods give minutes; a stale "all clear" is a safety hazard, and scraper breakage (expired certificates, JS-only pages, unverified endpoints) fails silently. Conflicting messages from an unofficial source is a known harm; OpenDRI shows unfunded platforms decay.
### Position B: The Atlas can add real value as a complementary, interoperable layer
Strongest case: failures cited are about reach, language and fragmentation. A bilingual, printable, no-login page with Nepali district names serves the gap that Nepali-only generic SMS and 5h-late Facebook posts leave; it can republish official content verbatim with timestamps, link to official channels, and emit/consume CAP so other tools can reuse it. Static hosting is cheap and survives traffic spikes, which suits sustainability.

## Committed position
Take a bounded version of B. The Atlas should not claim or imitate warning dissemination; its role is preparedness and context (scenarios, printable reports, bilingual place-aware explanation) plus a transparently labelled, never-silently-stale mirror of official data. The load-bearing reason: the evidence shows the deadly gaps are in sub-hour latency and last-mile reach, which a daily static copy cannot close, but language, plain-region context and a standards-based republishing layer are gaps it can fill at near-zero cost. Concretely: (1) every live-data panel shows source timestamp and fetch timestamp and switches to a "data may be outdated, see dhm.gov.np/BIPAD" state when age exceeds a threshold (suggest >6h for river/rain, >48h for bulletins; these thresholds are my judgement, not sourced); (2) the pipeline fails loudly: per-source health file, CI issue/alert on N consecutive failures, schema checks on BIPAD JSON, last-good data kept with age shown; prefer BIPAD JSON over HTML scrapes and verify the unverified endpoints; (3) publish a CAP-compatible static feed only as a mirror of BIPAD alerts, labelled unofficial, and offer it to NDRRMA/DHM rather than replace them; (4) seek a written data-use confirmation or MoU with NDRRMA/DHM and an institutional partner (e.g. Kathmandu Living Labs, ICIMOD) for continuity; (5) sustain by keeping running cost near zero (GitHub Pages + Actions), open-sourcing, and treating a software community, not revenue, as the sustaining model (OpenDRI/GeoNode lesson).

- **Position:** Adopt a complementary, clearly-labelled, fail-loud preparedness-and-mirror role; do not position as a warning channel.
- **Confidence:** medium (~65%); sources were not newly fetched and BIPAD licence/DHM CAP status are unverified.
- **Boundary conditions:** Holds for a daily-refresh static site with no server; if the site moved to sub-hourly refresh with official sanction, a more active alerting role could be justified.
- **What would change this position:** A written NDRRMA/DHM prohibition or licence restriction on redistribution (would force link-out only); a published DHM CAP feed with a stable licence (would strengthen CAP integration); evidence that unofficial mirrors caused confusion in past Nepali events.
- **Evidence weight:** 2 agency/WMO-type sources (outcomes, positive), 2-3 news/analysis pieces (gaps), 1 OpenDRI lessons note, plus repo inspection; no peer-reviewed evaluation of unofficial dashboards found.

## Open questions
- Does bipadportal.gov.np publish a data licence/terms and rate limits?
- Does DHM or NDRRMA now serve CAP (agreed Apr 2025)?
- How do Kathmandu Living Labs / Open Cities dashboards word disclaimers and partnerships?

## Sources
1. [[reducing-flood-casualties-in-nepal]]
2. [[sixteen-minutes-what-the-bhotekoshi-flood-reveals-about-the-regions-unfinished-e]]
3. [[missing-on-early-warning-pushed-to-rising-death-tolls-and-losses-of-properties-a]]
4. [[ncell-sent-44-lakh-early-warning-sms-against-landslideflood]]
5. [[common-alerting-protocol]]
6. [[opendri-7-sustaining]]
7. [[during-nepal-floods-decentralized-community-based-warning-saved-lives]]
