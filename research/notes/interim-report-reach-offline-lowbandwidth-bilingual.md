---
title: Interim report — reach-offline-lowbandwidth-bilingual
id: interim-report-reach-offline-lowbandwidth-bilingual
tags:
- atlas-improvement-research-177509
- locus-reach-offline-lowbandwidth-bilingual
created: '2026-11-18T13:03:37.891222Z'
status: draft
type: interim
deprecated: false
summary: Connectivity estimates (MICS 82% hh vs ITU 48.4% individual) reconcile as
  different units; prioritise Nepali-first search, page budget, a11y, modest PWA+print
  over offline servers/SMS
---

# Interim report: reach-offline-lowbandwidth-bilingual

**Locus question:** Who can actually use the Atlas: how do conflicting connectivity estimates, language/literacy and accessibility evidence change priorities?
**Flavor:** dialectical

## What the corpus already said
No "batch9" note exists; the underlying sources are separate notes. [[nepals-82-households-have-internet-but-digital-skills-fall-short]] (NMICS 2024/25, 12,802 households) and [[nepal-returns-to-global-ict-index-but-digital-use-still-lags-infrastructure-grow]] (ITU IDI 2026). Offline/PMTiles: [[performance-comparison-of-an-offline-pmtiles-powered-map-server-running-on-a-ras]]. Names: [[keynamene-openstreetmap-wiki]], [[nepalmeetings2022-12-15-openstreetmap-wiki]], [[basemap-localization-protomaps-docs]]. A11y: [[digital-accessibility-checklist]], [[prioritizing-digital-accessibility-for-inclusive]]. No new fetches were made (vault evidence was sufficient to adjudicate; budget unused).

## What the new sources say (re-read in full text)
- MICS: 82% of households have home internet, 85.1% have a smartphone, >95% a mobile phone; urban 86.5% vs rural 73%; Karnali 68.5%; poorest 52.9% vs richest 99.2%; men 90.4% vs women 81.6% own a phone (ages 15-49); radio only 14.7%, TV 42.8%. Skills: 24.2% copy/paste, 19.2% verify online info, 10.2% spreadsheet formula. Secondary (news) report of the survey, not the primary report.
- ITU: 48.4% of individuals use the internet, 73.1% own a mobile, 52.5% household internet, 3G ~90%, 4G 81.6% population coverage.
- Offline PMTiles: a FOSS4G talk abstract (self-reported, a Raspberry Pi server; no Nepal users, no user study). Valid only as proof that single-file PMTiles range-reads work from local/low-power storage. Weak evidence for end-user reach.
- OSM Nepal: name=Nepali, name:ne, name:en, alt_name for romanisations; example "साँखु could be written as sankhu or shankhu, चितवन as chitwan or chitawan"; use Survey Department transliteration. Protomaps supports name:{lang} for 41 languages.
- A11y: Prayatna Nepal position paper; 2.2% of Nepal's 2021 census population has a disability (a floor, likely undercounted); WCAG 2.2 contrast/reading-order/alt-text.

## Evidence synthesis
### Position A: Connectivity is largely solved; invest in Nepali-first UX, search and a11y, not offline plumbing
MICS shows >95% household mobile access, 85% smartphones, 4G covering 81.6%. A page-weight-budgeted static site already works for most. The binding constraints are skills (19% verify information online) and language/search quality: Devanagari queries failing on romanisation variants silently excludes users who do have connectivity.
### Position B: Headline connectivity overstates reach; offline and non-web delivery matter for those most at risk
ITU says 48.4% of individuals use the internet, vs 82% household. These measure different units (household with any member access vs. individual use; MICS is household-reported). The disaggregation shows who is left out: Karnali 68.5%, poorest quintile 52.9%, women's phone ownership 81.6%, and radio 14.7%/TV 42.8% show broadcast is not a reliable fallback either. In a disaster, towers and power fail exactly when the Atlas is needed.
### Reconciling
These are not contradictory: ITU 48.4% individual use is the better proxy for "who will open a web map" and MICS 82% is an upper bound. The truth for the Atlas's likely audience (analysts, officials, journalists, educated at-risk residents) is well above 48%, but the most hazard-exposed hill/Himalayan districts sit at the low end. No source measures the Atlas's actual audience; no evidence compares delivery modes (PWA vs SMS vs print) for low-literacy at-risk Nepalis.

## Committed position
The evidence adds up to a sequencing, with Position A winning on priority and B on a bounded, cheap subset. Because the Atlas is a static site whose realistic users are mid-literacy smartphone owners, the highest return per effort is (1) Nepali-first defaults with name/name:ne/alt_name/name:en indexing and a normalisation layer so शाखु/साँखु/sankhu/shankhu all resolve, (2) a hard page-weight budget (aim initial load under ~1 MB gzip, so it works on 3G for ~90% coverage, and defer 3D terrain/DEM until opt-in), and (3) WCAG 2.2 AA basics including non-map text equivalents (tables/lists of districts and scenario results; the map is not screen-reader usable). A service worker caching the app shell, UI strings, district/scenario JSON and a Nepal-extent PMTiles basemap is justified as low-marginal-cost for static hosting, because the 48.4% vs 82% gap and Karnali 68.5% show intermittent connectivity is real, but a Raspberry Pi/PMTiles server is not an Atlas priority (the evidence is a vendor-style conference abstract about UN field kits). Printable scenario reports should be treated as the primary non-digital channel (A4 one-page Nepali/English, high contrast, QR-less, with district names), since radio (14.7%) and TV (42.8%) don't cover and SMS/voice need an operator partnership the Atlas cannot supply alone; do not build SMS/voice in-house, instead publish text templates for DHM/BIPAD/municipal partners.

- **Position:** Prioritise Nepali-first search/UI, a ~1 MB page budget and a11y over offline infrastructure; ship a modest PWA cache (shell + data + Nepal PMTiles) and print outputs, defer SMS/voice to partners.
- **Confidence:** medium (~60%); the sequencing is reasoned from survey aggregates, not audience data.
- **Boundary conditions:** holds for a volunteer-scale static public atlas in preparedness/education use; if the goal becomes real-time alerting to Karnali/Himalayan communities, B dominates (SMS/CBS/radio via partners).
- **What would change this position:** analytics showing high share of sessions from Karnali/mountain districts on slow or intermittent links; a user study showing low-literacy at-risk residents prefer SMS/voice/print; or the primary MICS tables showing mobile data use (not household internet) far lower than 82% in hazard districts.
- **Evidence weight:** 2 national surveys (one via news secondary report, ITU via news), 2 OSM/Protomaps convention docs (strong for naming), 1 conference abstract (weak), 2 a11y documents (guidance, not Nepal user evidence). No evaluated user studies of delivery modes.

## Open questions
- Primary NMICS tables for mobile data use by district and language; Nepali literacy by district.
- Real DHM/BIPAD delivery-mode evaluations (CBS, sirens, radio) for GLOF-exposed communities.
- Actual size of Nepal PMTiles extract at z0-12 and 3D terrain page weight.

## Sources
1. [[nepals-82-households-have-internet-but-digital-skills-fall-short]]
2. [[nepal-returns-to-global-ict-index-but-digital-use-still-lags-infrastructure-grow]]
3. [[performance-comparison-of-an-offline-pmtiles-powered-map-server-running-on-a-ras]]
4. [[keynamene-openstreetmap-wiki]]
5. [[nepalmeetings2022-12-15-openstreetmap-wiki]]
6. [[basemap-localization-protomaps-docs]]
7. [[digital-accessibility-checklist]]
8. [[prioritizing-digital-accessibility-for-inclusive]]
