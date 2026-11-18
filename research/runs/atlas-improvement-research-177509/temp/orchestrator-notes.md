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
