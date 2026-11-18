# Cross-locus comparisons

## Tension 1: Expanding scenario coverage versus being misread as a warning

- **GLOF origins** ([[interim-report-glof-origin-selection-beyond-pdgl-list]]) commits: offer origins beyond the 21 ICIMOD PDGLs as a tiered layer (official list, upstream-of-Nepal list, unassessed open-inventory lakes), because Thame 2024 and Bhote Koshi 2026 came from outside every list.
- **Uncertainty framing** ([[interim-report-scenario-uncertainty-communication-and-framing]]) commits: soft bands with ranges, no "safe/unsafe" words, a fixed bilingual "hypothetical, not a forecast or warning" banner on every map and page.
- **Warning role** ([[interim-report-atlas-role-in-warning-ecosystem]]) commits: the Atlas is a preparedness layer and a timestamped mirror, never a warning channel.
- **The cross-locus dynamic:** coverage expansion raises the stakes of framing. Hundreds of unassessed lakes with scenario buttons multiply the chances a reader treats a hypothetical as a forecast, exactly the failure the framing and role loci guard against. Both the GLOF and framing investigators name the same flip condition: user testing showing people read scenarios as forecasts.
- **How the draft should engage this:** present expansion and framing as one coupled recommendation (tiering and labelling ship together, or expansion waits), and flag the shared untested assumption as the top open question.
- **Calibration:** GLOF ~65%, framing ~60% (band-vs-gradient low-medium), role ~65%. No Nepal user study exists for any of them.

## Tension 2: Fix the defaults, not the engine (convergence from two hazards)

- **Ground motion** ([[interim-report-bssa14-single-vs30-kathmandu-basin]]) commits: keep BSSA14; the single 760 m/s rock default is the real defect; use a per-cell slope-based Vs30, show the existing ±1 sigma band, caveat unmodelled basin effects, validate against Gorkha before adding a Himalaya GMPE.
- **Flood routing** ([[interim-report-constant-celerity-routing-vs-process-chain-glof]]) commits: keep the simple routing engine; constant 2/4/6 m/s is not defensible; use a distance-decaying celerity or add a fast near-field case, report an arrival window, no default attenuation, label clear-water limits.
- **The cross-locus dynamic:** independent investigations reach the same shape of answer: the model class is acceptable for a public preparedness tool, but the default parameters understate hazard (rock site, slow near-field wave) and single values hide spread. This convergence is itself a finding and suggests one cross-hazard pattern: realistic defaults, ranges as the main display, and explicit "not modelled" lists.
- **How the draft should engage this:** the earthquake and flood sections should argue for parameter and display fixes over new engines, and section 10 should group them as one workstream.
- **Calibration:** GMPE ~65% (GMPE-choice sub-question ~40%, key papers unread); routing ~65% (celerity numbers from non-peer-reviewed preprints of one event).

## Tension 3: Richer data versus a light, reachable site

- **Reach** ([[interim-report-reach-offline-lowbandwidth-bilingual]]) commits: about 1 MB gzip initial load, 3D terrain opt-in, Nepali-first, service-worker cache, print as the main non-digital channel; ITU 48.4% individual internet use is the better reach proxy.
- **Ground motion** and **GLOF origins** commit to new data layers: a Nepal Vs30 grid, a 31,698-lake open inventory, transboundary catchments.
- **The cross-locus dynamic:** the science loci add data; the reach locus caps weight. The tension resolves only if new layers load on demand per scenario (tile or per-basin files) rather than up front.
- **How the draft should engage this:** every data recommendation in sections 4-5 must carry its delivery cost, and section 6 sets the budget they must fit.
- **Calibration:** reach ~60%; connectivity figures from news write-ups, not primary reports.

## Tension 4: Speed of real floods versus a daily static copy

- **Warning role** commits: a daily static copy cannot close sub-hour latency gaps; show fetch age and fail loudly.
- **Flood routing** evidence: in the 26 Aug 2026 Bhote Koshi cascade the first gauge was hit within 12.8 min and the public alert came 38.8 min after the trigger (negative lead time at the first settlement).
- **Reach** commits: printable bilingual one-pagers are the main offline channel.
- **The cross-locus dynamic:** three loci converge: the Atlas's value is before the event (pre-computed arrival windows per place, printed and kept), not during it. Live data is context with a visible age, never an alert.
- **How the draft should engage this:** sections 2, 4 and 7 should frame the live data and the reports around preparedness, and the roadmap should rank "staleness and health signals" above "more feeds".
- **Calibration:** role ~65%; Bhote Koshi timings from preprints and news, unverified.

## Tension 5: Recommendations resting on thin evidence

- Across loci the strongest-sounding numbers come from weak sources: Bhote Koshi celerities (two non-peer-reviewed preprints of one event), Himalaya GMPE superiority (abstract-only), uncertainty wording (no Nepal user test), offline PMTiles (self-reported conference abstract), sustainability (GFDRR self-evaluation).
- **The cross-locus dynamic:** the honest roadmap pairs each change with a validation the project can run itself: Gorkha ShakeMap/station comparison, a Bhote Koshi or Melamchi hindcast of arrival times, a small Nepali reader test of banners and bands.
- **How the draft should engage this:** state evidence grade next to each recommendation and make validation tasks first-class roadmap items.
