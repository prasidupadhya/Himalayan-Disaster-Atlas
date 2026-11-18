# Interim report: bssa14-single-vs30-kathmandu-basin

**Locus question:** Is BSSA14 with one Vs30 adequate for Nepal scenarios, or must the Atlas add Himalaya-specific GMPE choice and a Vs30/basin layer, validated against Gorkha 2015?
**Flavor:** dialectical

## What the corpus already said
[[meteor-nepal-seismic-hazard-map-with-mean-peak-ground-acceleration-pga-in-g-for]] is a GEM/BGS open PGA grid (10% and 2% in 50 yr, 0.025 deg), a generic first-order hazard layer, not a scenario validator. [[site-amplification-in-the-kathmandu-valley-during-the-2015-m76-gorkha-nepal-eart]] (EEFIT, Bull. Earthq. Eng. 2016, full text) finds "clear site amplification within the Siddhitol Region" with "resulting ground motions exceed[ing] the design levels from the Nepalese Building Codes". [[attenuation-relation-predicted-observed-ground-motion-of-gorkha-nepal-earthquake]] (abstract only) says Himalayan-region relations show "good correlation" and that relations from other regions "fail to provide good estimate". [[the-2015-mw-78-gorkha-earthquake-in-nepal-and-its-aftershocks-analysis-of-strong]] describes Kathmandu records with a ~5 s pulse at soft sites. [[pager-scientific-background]] frames PAGER as exposure + uncertainty, "always seek the most current release".

## What the new sources say
[[vs30-models-and-data]] (USGS): Global Vs30 Mosaic, Heath et al. 2020, topographic-slope default with regional insets; 30 arc-sec (~0.9 km) grid, range 98-2197 m/s, 631 MB GMT zip, water = 600 m/s. Open, global, and directly drives BSSA14's Vs30 input. Slope proxy is coarse for a flat sedimentary basin (my inference; Allen & Wald 2009 is cited there as the method basis).
Fetch attempts for Soil Dyn. Earthq. Eng. 2020 "GMPE for the Kathmandu Valley" (doi 10.1016/j.soildyn.2020.106208), BSSA 2019 Gorkha-II broadband simulation of Kathmandu, and ScienceDirect all failed (empty/403/DNS); only titles from scholar search, so those are unread.

Repo check: site/data/atlas-gmpe-bssa14/1.0.0/model.json lists as omitted: "basin depth term (Z1 UNKNOWN)", "regional anelastic adjustment (global Dc3 = 0 used)", "spatial correlation of within-event residuals". Domain Vs30 150-1500, Rjb<=400 km, M 3-8.5. The omissions are already disclosed in the data, which is good practice. Code returns median and total sigma, so a +-1 sigma band exists.

## Evidence synthesis
Two sides are less opposed than the framing suggests. The generic-BSSA14 side: it is a global model, the Atlas models hypothetical scenarios and not forecasts, and the Himalaya GMPE claim rests on an abstract-only paper (unverified, event-specific, one earthquake). The Himalaya/basin side: the Kathmandu evidence is qualitative but strong where it matters: amplification at ~5 s (basin resonance, long period) and exceedance of code spectra at Siddhitol. Key point: the Atlas outputs PGA only. Kathmandu's amplification is at long periods (0.2-0.3 Hz, ~5 s) that PGA, and therefore a Vs30 term, barely capture; the BSSA14 Vs30 term is a shallow-site term and the omitted Z1 term is exactly the long-period basin correction. So a Vs30 layer improves PGA/MMI only modestly in the basin; the real basin effect is not representable in a PGA band.

### Position A: single Vs30 BSSA14 is adequate for a public scenario tool
Global NGA-West2 form, transparent, sigma already provided, domain covers Nepal distances; MMI-type communication tolerates a factor ~1.5-2, comparable to sigma (total sigma at PGA ~0.7-0.8 ln units from the coefficients phi1 0.695, tau1 0.398).
### Position B: needs Himalayan GMPE and Vs30/basin layer
Corpus: Himalaya-specific relation "good correlation", others "fail" (abstract-level); Kathmandu exceedance of code; default 760 m/s rock is the wrong default for exactly the place where most people live (Kathmandu valley soft sediment, Vs30 plausibly 200-400 m/s, my inference).

## Committed position
Neither side as stated. The one-Vs30 rock default is the real defect, not BSSA14 itself: a user choosing a scenario near Kathmandu, Pokhara or Terai gets rock-site shaking, which understates PGA where population is. Build, in order: (1) replace the manual/760 default with a per-cell Vs30 from the USGS Heath et al. 2020 global grid, clipped to Nepal and downsampled to a static tile (full grid is 631 MB, Nepal subset is a few MB), keeping the manual override; (2) show the existing +-1 sigma band as the primary uncertainty display and relabel bands accordingly; (3) add a Kathmandu basin caveat panel stating that long-period (~5 s) amplification and code exceedance are documented but NOT modelled, rather than pretending a Vs30 fixes it; (4) add a Gorkha M7.8 validation test (USGS ShakeMap/station PGA vs model, report residual and bias by site class) before any claim of accuracy, and only then decide whether a Himalayan GMPE logic-tree branch (e.g. a Nepal-specific relation weighted with BSSA14) is warranted. Do not ship a Himalaya-GMPE swap on the strength of an abstract.
- **Position:** Keep BSSA14 but make Vs30 spatial (USGS slope grid), add sigma display and an explicit unmodelled-basin caveat; defer a Himalaya GMPE branch until a Gorkha residual test supports it.
- **Confidence:** medium (65%) on the ordering; low (40%) on whether Himalayan GMPE beats BSSA14 (unread evidence).
- **Boundary conditions:** Holds for PGA/short-period scenario display for a public tool; for engineering or Kathmandu long-period/tall-building claims, a site-specific or 3D basin model is required and out of scope.
- **What would change this position:** A Gorkha test showing BSSA14 + slope Vs30 median bias >0.3 ln units or a Himalayan GMPE cutting residual sigma materially (>20%) would promote the GMPE branch to priority; a slope-Vs30 grid showing ~760 in the Kathmandu basin (wrong) would force a basin polygon override from published microzonation.
- **Evidence weight:** 1 official data source read (USGS Vs30), 2 full/partial papers on Kathmandu amplification (qualitative), 1 abstract-only GMPE claim, 1 repo inspection; 3 key papers unfetched (paywall).

## Open questions
- Quantitative Kathmandu Vs30 values and microzonation polygons (JICA 2002, NSET, Soil Dyn 2020 Kathmandu GMPE).
- Does the Nepal-clip Heath grid actually yield soft values for the basin and Terai?
- Published BSSA14 residuals against Gorkha strong motion (PEER/CESMD stations, KATNP).
- PGA-to-MMI conversion choice (Worden 2012 vs Himalaya-calibrated).

## Sources
1. [[meteor-nepal-seismic-hazard-map-with-mean-peak-ground-acceleration-pga-in-g-for]]
2. [[site-amplification-in-the-kathmandu-valley-during-the-2015-m76-gorkha-nepal-eart]]
3. [[attenuation-relation-predicted-observed-ground-motion-of-gorkha-nepal-earthquake]]
4. [[the-2015-mw-78-gorkha-earthquake-in-nepal-and-its-aftershocks-analysis-of-strong]]
5. [[pager-scientific-background]]
6. [[vs30-models-and-data]]
