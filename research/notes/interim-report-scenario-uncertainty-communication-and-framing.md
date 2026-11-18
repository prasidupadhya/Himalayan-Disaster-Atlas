---
title: Interim report — scenario-uncertainty-communication-and-framing
id: interim-report-scenario-uncertainty-communication-and-framing
tags:
- atlas-improvement-research-177509
- locus-scenario-uncertainty-communication-and-framing
created: '2026-11-18T13:04:10.954220Z'
status: draft
type: interim
deprecated: false
summary: Ranged, soft-edged bands plus mandatory bilingual 'hypothetical, not a warning'
  banner; no safe/unsafe labels; no Nepal user tests exist
---

# Interim report: scenario-uncertainty-communication-and-framing

**Locus question:** How should scenario maps and printable reports show uncertainty, avoid crisp safe/unsafe lines and frame scenarios as hypothetical, in plain Nepali and English?
**Flavor:** dialectical

## What the corpus already said
Six vault notes bear on this locus. Lindell 2020 [[frontiers-improving-hazard-map-comprehension-for-protective-action-decision-maki]] reviews hazard-map comprehension and treats a hazard map as a form of warning message; it reports that "isarithmic maps produce the better understanding of uncertainty about hazard exposure than gradational shaded or binned maps (Thompson et al.)", that colour scheme and verbal vs numeric probability change judgments, and that borders are easier to read when tied to recognisable features such as rivers, roads and jurisdictional boundaries. Haughton & White 2018 [[r-e-g-u-l-a-r-p-a-p-e-r]] shows that hazard-map lines get contested, and that "uncertainty is translated into false certainty" when maps enter statutory plans. Demichelis & Ongaro 2024 [[public-understanding-and-scientific-uncertainty-the-communication-of-risk-in-the]] (L'Aquila) shows reassurance read from probabilistic statements caused harm, and that natural-frequency formats help but benefit shrinks for low-probability, high-consequence events. Bhandari et al. 2020 [[gc-communicating-complex-forecasts-an-analysis-of-the-approach-in-nepals-flood-e]] finds DHM SMS has "no standardised language" (Nepali, English or romanised Nepali) and that stakeholders wanted colour codes and ranges. Mongabay 2026 [[during-nepal-floods-decentralized-community-based-warning-saved-lives]] reports the 26 Aug 2026 SMS was generic, Nepali-only, and lacked location, severity and time; repeated low-stakes alerts desensitise people. [[using-geovisualizations-to-educate-the-public-about-environmental-health]] was in the starting set; I did not re-read it in depth.

## What the new sources say
New fetches failed: USGS scenario pages (404), the ShakeMap manual (404), WMO impact-based forecasting library page (empty), a Nature Sci Rep paper (404), Wiley hyp.70362 on flood inundation map features (403), PLOS DEM-uncertainty inundation paper (over 10 MB cap). Scholar search surfaced Wiley "Comparing Flood Inundation Map Features and Diagnosing Decision Support Design Challenges" (2026) and Bates-style inundation-uncertainty work as targets but I could not read them. So no new tested Nepali-language guidance and no first-hand USGS/WMO text were obtained; claims about those conventions below come from my background knowledge and are flagged as unverified.

## Evidence synthesis
Both sides have real evidence. The corpus agrees that (a) maps are read as warnings and as legal-looking lines, (b) generic or reassuring wording causes harm in both directions (L'Aquila false reassurance; Nepal alert fatigue), and (c) Nepali risk wording is unstandardised. It conflicts on form: Lindell/Thompson favour isarithmic (contour) presentation over binned shading for conveying uncertainty, while Bhandari's stakeholders asked for colour codes and ranges, and Haughton & White warn that any line becomes a contested boundary regardless.

### Position A: Show continuous/graded fields with explicit ranges and no categorical edges
Strongest case: binning manufactures a cliff between adjacent cells that the model cannot resolve; Haughton & White document that such lines become property-value and legal boundaries with "effects felt both sides". Lindell's cited Thompson result says isarithmic displays convey exposure uncertainty better than binned maps. For floods, a three-wave-speed ensemble naturally gives a range of arrival times; show min-max, not a point.

### Position B: Keep few discrete bands/cases with plain labels
Strongest case: comprehension research stresses low map skill (MacPherson-Krutsky: advanced skills such as contour interpretation score lower than basic ones), clutter harms reading, and Nepal stakeholders asked for colour codes and ranges. Alert-fatigue and generic-message evidence says users need an actionable, simple categorisation. Five PGA bands match familiar intensity scales and map to a population-count table, which a gradient cannot supply.

## Committed position
The evidence favours a synthesis weighted toward A on the map and B on the page: keep the five PGA bands and three wave-speed cases because the audience and printing need them, but treat them as ranges, not lines. Concretely: (1) never label any band or area "safe"/"unsafe"; label the lowest band "lower modelled shaking in this scenario" and state that it is not a no-risk zone; (2) soften band edges (semi-transparent fills, hatched or feathered boundaries, no hairline outlines) and add a note that edges are ±one band; (3) report flood arrival times as a range across the three speed cases (for example "about X to Y minutes") never one number, and report population per band as rounded counts with an "order-of-magnitude" caveat, in natural frequencies ("about 1 in 20") only where a rate is needed; (4) put a fixed bilingual banner on every map and every printed page ("Hypothetical scenario - not a forecast, not a warning. Follow official DHM/NEOC alerts"), with a visible scenario ID and run date, because Mongabay and Bhandari show Nepali audiences treat messages as warnings or ignore them; (5) write Nepali and English by parallel authorship in plain terms rather than machine translation, and user-test the wording. The load-bearing reason: the only evidence on Nepal (Bhandari, Mongabay) shows failures from generic, unlocatable, single-language messaging, while the map literature (Lindell, Haughton & White) shows crisp lines are read as certainty; neither supports fully continuous gradients for a low-map-skill audience, so ranged discrete bands is the defensible middle.

- **Position:** Use a small number of soft-edged bands and ranged values with a mandatory bilingual "hypothetical scenario, not a warning" banner, rather than either pure gradients or crisp safe/unsafe zones.
- **Confidence:** medium (about 60%); the direction (no safe/unsafe, ranges, banner) is high confidence, the band-vs-gradient choice is low-medium because no Nepal user test exists.
- **Boundary conditions:** Applies to a public static site with a general audience and printable reports; for planners or technical users, gradients plus uncertainty layers are probably better. Specific numbers (e.g. "±one band") are my proposals, not sourced thresholds.
- **What would change this position:** A user test of Nepali-speaking users showing gradients or isarithmic maps are read as accurately as bands; evidence that disclaimers/banners are ignored (banner blindness) or increase false reassurance; verified USGS/WMO guidance prescribing different scenario labelling.
- **Evidence weight:** 5 corpus sources (2 peer-reviewed reviews/studies, 1 qualitative geography study, 1 Nepal-specific peer-reviewed analysis, 1 journalism) support direction; 0 direct tests of Nepali-language scenario maps; Lindell's isarithmic finding is second-hand via Thompson et al.

## Open questions
- What USGS ShakeMap/PAGER scenario labelling and WMO impact-based forecasting wording actually prescribe (fetches failed).
- Any Nepali-language tested risk vocabulary (e.g. NDRRMA/BIPAD terms, Nepali verbal probability scales).
- Does a persistent disclaimer reduce misreading as a live warning?
- Wiley 2026 flood-inundation-map features paper (403) should be retrieved via the browser fetcher.

## Sources
1. [[frontiers-improving-hazard-map-comprehension-for-protective-action-decision-maki]]
2. [[r-e-g-u-l-a-r-p-a-p-e-r]]
3. [[public-understanding-and-scientific-uncertainty-the-communication-of-risk-in-the]]
4. [[gc-communicating-complex-forecasts-an-analysis-of-the-approach-in-nepals-flood-e]]
5. [[during-nepal-floods-decentralized-community-based-warning-saved-lives]]
6. [[using-geovisualizations-to-educate-the-public-about-environmental-health]]
