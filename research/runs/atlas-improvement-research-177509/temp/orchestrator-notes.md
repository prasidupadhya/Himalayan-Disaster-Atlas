# Orchestrator notes

## Wave 1 launched (10 fetchers, 69 URLs)
Emerging patterns from search snippets (to verify against fetched text):
- Last-mile is the binding constraint in Nepal: warnings exist (DHM SMS, colour-coded alerts) but action, trust and locality fail (2024 Kathmandu floods, 2026 Bhotekoshi "sixteen minutes", SMS Nepali-only and non-local). Implication for the Atlas: its value is not more data but translating official data into local, actionable, trusted context.
- Official data access is fragile: no documented BIPAD API; DHM station data by request; government hosts block cloud runners intermittently; NEMRC cert lapses. Implication: resilience engineering + provenance labelling are core features, not chores.
- GLOF science: hazard ranking by lake size misses cascades (Thame 2024, Melamchi 2021). The Atlas's 18 verified release points and kinematic pulse model are a known simplification — kinematic waves do not attenuate; hydraulic models (HEC-RAS, r.avaflow) are the reference.
- Earthquake: BSSA14 is a global GMPE; Nepal-specific GMPEs and Kathmandu basin amplification (long-period, 2015) matter; exposure without fragility = people-in-band, not damage. PAGER shows order-of-magnitude uncertainty even for experts.
- Users: ~56% individual internet use, 82% households, rural 2G gaps, digital-skill gap; Unicode/accessibility matter; Preeti legacy problem.
- Missing hazard: landslides dominate monsoon deaths (~1,400 of 3,082 in a decade); no comprehensive landslide map.

## Expected tensions
1. Sophistication vs. clarity: better science (hydraulic routing, Nepal GMPEs) vs. risk of misreading scenario maps as forecasts (hazard-map misinterpretation literature).
2. Independent public site vs. official authority: duplicating/presenting official warnings could confuse, yet official channels fail at the last mile.
3. Static architecture vs. real-time needs (alerts, push): static is robust/cheap; alerts need servers.
4. Global ML forecasts (Google Flood Hub/GloFAS) vs. local gauges: global models underperform on rare floods in Nepal.

## Working thesis
The Atlas's highest-leverage improvements are (a) reliability/provenance of official feeds, (b) adding landslide context and cascade-aware GLOF framing, (c) making outputs actionable and local for Nepali phone users, while (d) scenario science upgrades come second and must be paired with communication safeguards.

## Wave 1 (retry) returns — batches 3, 5, 9
- B3: WMO 2024 "impact-based flood forecasting urgently needed — big gap"; municipalities need >=24 h lead; EW4All gaps: CAP operationalisation, urban nowcasting, coordination, high-mountain observation. Nature 2024 (Nearing): AI model >= GloFAS nowcast up to 5 d; but EGUsphere preprint: global models weak on rare floods in data-scarce regions (no Nepal data). Copernicus Nepal case study needs browser lane.
- B5: Tsho Rolpa breach peaks 8.2–26.7k m3/s (NWS-BREACH -> HEC-RAS). Hoch 2019: kinematic -> local-inertia routing raises peak NSE 0.48 -> 0.71 — direct evidence the Atlas's kinematic pulse is the weak link. Mergili 2020: predictive GLOF runs need explicit parameter uncertainty -> supports showing ranges (Atlas already shows slow/mid/fast).
- B9: MICS 2024/25 82% households online but Karnali 68.5%, poorest 52.9%, weak digital skills (19% verify online info). ITU IDI 48% individual use — conflict to flag. Govt website directive 2021 requires Unicode, adjustable size, NE+EN. Preeti PDFs inaccessible.
Escalation queue: Ponce PDF, LakeScientist, Copernicus case study.

## Synthesis planning while drafts run (step 10)

- Likely thesis: the Atlas improves most by becoming an honest pre-event planning tool: realistic defaults (site-aware Vs30, small GMPE ensemble, measured 5-9 m/s GLOF band with separate mass-flow case and peak attenuation), ranges as the main display, tiered lake origins with labels, and live data shown with its age. New live features are secondary.
- Contentious items: (1) how far to go with near-real-time (Draft B will push; official CAP feed does not exist yet, BIPAD licence unknown); (2) unassessed-lake expansion vs misreading risk; (3) ensemble GMPE resting on a preprint ranking.
- Must-commit beats: daily copy cannot warn (official timeline 08:40 trigger, ~09:00 rise, Galchhi +9 m in 30 min); flood deaths fell where official warnings worked, so do not compete; evidence grade beside each recommendation; validation tasks (Gorkha ShakeMap, Melamchi/2016 Bhote Koshi hindcast, Nepali reader test) as first-class roadmap items.
- Landslides: largest missing hazard by deaths in monsoon (135 deaths in 38 fatal landslides by 17 July 2024); propose a read-only layer from official/curated data, not a model.
- Roadmap ordering: (1) honesty fixes and staleness/health signals; (2) model default fixes plus validations; (3) reach (Nepali-first, page weight, offline cache, a11y); (4) data layers loaded on demand (Vs30, lake inventory); (5) partnerships, licence, CAP-ready output.
