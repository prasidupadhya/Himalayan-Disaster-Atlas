---
title: Interim report — glof-origin-selection-beyond-pdgl-list
id: interim-report-glof-origin-selection-beyond-pdgl-list
tags:
- atlas-improvement-research-177509
- locus-glof-origin-selection-beyond-pdgl-list
created: '2026-11-18T13:05:17.637963Z'
status: draft
type: interim
deprecated: false
summary: 'Recommend tiered origin layer: 21 PDGLs, 25 TAR PDGLs, open-inventory lakes
  >=0.02 km2 labelled hypothetical with volume bands'
---

# Interim report: glof-origin-selection-beyond-pdgl-list

**Locus question:** Should the Atlas offer GLOF scenario origins beyond the 21 ICIMOD PDGLs (small lakes, cascades, Tibet-side lakes, 2024 Thame and 2026 Bhotekoshi events), and what open inventories and volume data would support it responsibly?
**Flavor:** dialectical

## What the corpus already said
The ICIMOD/UNDP 2020 inventory [[inventory-of-glacial-lakes-and-identification-of-potentially-dangerous-lakes-1]] mapped lakes >=0.003 km2 (3,624 lakes; 2,070 Nepal, 1,509 TAR China, 45 India), treated >=0.02 km2 (1,410 lakes) as large enough to cause a GLOF, and picked 47 PDGLs (25 TAR, 21 Nepal, 1 India) on lake/dam, source-glacier and surroundings criteria, explicitly excluding seismic, climate and human triggers. Only 13 of the 21 Nepal PDGLs match the 2011 list (8 deleted, 8 added), so the list itself is unstable. It is licensed CC BY-NC-ND 4.0 and recommends updates at least every 5 years. [[abstract-egu25-12752]] (Cook et al.) shows the 2024 Thame GLOF came from a cascade of two small lakes not classed dangerous (~4-5e5 m3, avalanche-triggered, breach of a moraine dam 650 m downstream). The Thame preprint [[quantifying-the-long-term-evolution-of-glacial-lakes-and-the-impact-of-the-2024]] (not peer reviewed) reports GL5 growing from ~0.008 to 0.1 km2 in 2015-2024, 130 ha inundated, 36 households destroyed, and argues size-based prioritisation is inadequate. The Borderlens piece [[sixteen-minutes-what-the-bhotekoshi-flood-reveals-about-the-regions-unfinished-e]] (journalism, 2026 event; figures unverified) says the flood originated in Tibet, crossed at Rasuwagadhi with 16 minutes' delay in notice, and follows a prior Tibet-side flood.

## What the new sources say
- [[automated-satellite-based-glacial-lake-inventory-and-change-detection-in-high-mo]] (Sci. Reports 2026): open, fully automated Landsat-8/Sentinel-1/2/Copernicus-DEM inventory, 31,698 HMA lakes (2022, ~2,240 km2), two epochs (2016-17, 2022-24); ">96%" accuracy in the 20,000-100,000 m2 bin and all lakes >100,000 m2 delineated. Data are on Zenodo (doi 10.5281/zenodo.17948783) under CC BY 4.0, although the article text is NC-ND. It covers Tibet-side headwaters because it is HMA-wide, and it is the practical candidate for a Nepal+upstream layer. Caveat: small lakes (<0.02 km2) are the weakest bin, and Thame GL5 at 0.008-0.1 km2 sits right there.
- [[abstract-egu23-15703]] (McCoy et al., EGU23): mapped >200 new GLOFs from ~200 moraine-dammed lakes, on top of 108 documented events; GLOF frequency in the last 20 years is lower than in 1970-2000 despite lake growth. Implication: past events are under-recorded (mapping bias), so "unlisted lake never failed" is weak evidence of safety, but also lake growth alone does not predict frequency.
- [[abstract-egu25-14977]] (Das & Ramsankaran): in-situ bathymetry for Western Himalaya lakes motivated by the point that accurate volume is crucial for outburst calculation. Used here only as evidence that volume is the dominant uncertainty and that area-only inventories lack it; I did not extract its fit.
- [[abstract-egu26-702]] was withdrawn (no-show); do not cite.

## Evidence synthesis
Sources agree on three things: (1) the PDGL list is a prioritisation tool for large lakes with loose moraine dams, not a census of possible origins (explicit exclusions; list churn of 8 of 21); (2) the two most consequential recent Nepal-affecting events (Thame 2024 small cascade; Tibet-origin Bhotekoshi floods) fall outside "Nepal's 21 PDGLs"; (3) open lake polygons now exist for the whole HMA at CC BY, but they carry area, not volume, and not dam/trigger information.

Disagreement is about responsibility, not facts. Size/rank-based lists are defensible for allocating mitigation money; they are poor as a boundary on what a scenario tool may show. I did not retrieve a peer-reviewed volume-area scaling source in this run (OpenAlex was rate-limited; budget used on inventories). From background knowledge, not vault evidence, the widely used power laws (Huggel et al. 2002; Cook & Quincey 2015; later regional fits) have V ~ A^1.3-1.5 and typically scatter by about a factor of 2-3 or more per lake, and bathymetric surveys show lake-specific deviations. This must be verified before it is quoted.

### Position A: Keep origins to the 21 PDGLs (plus river-reach origins)
Strongest case: the official list is the only authoritative, citable, ranked set; it comes from a vetted ICIMOD/UNDP process with exposure counts; adding thousands of lakes with volume guessed from area implies precision the data lack; a public scenario at an unlisted village (Thame, say) could alarm residents or be read as an official forecast, and the licence NC-ND discourages derivative lists anyway. The river-reach origin already lets users drop a flood anywhere along a channel.

### Position B: Add a labelled, broader origin layer (small lakes, cascades, Tibet-side)
Strongest case: Thame failed from lakes at 0.008-0.1 km2 that no list flagged; the preprint calls size-based prioritisation "critically inadequate"; McCoy et al. show unrecorded events and mapping bias; Bhotekoshi-type floods enter from Tibet where Nepal has no listing authority and the 21-lake framing excludes 25 TAR PDGLs that threaten Nepal; a model-first atlas that silently hides this misleads. Reach-origin can't represent a lake-volume pulse with a breach.

## Committed position
Position B wins, but only as a visibly tiered layer, not a flat expansion. The Atlas should keep the 21 Nepal PDGLs as "Tier 1: official ICIMOD/UNDP 2020 list", add the 25 TAR and 1 India PDGLs as "Tier 1T: transboundary, upstream of Nepal" with the catchment drawn to the border, and add all open-inventory lakes >=0.02 km2 (the ICIMOD GLOF-capable threshold) within Nepal-draining catchments as "Tier 3: unassessed, mapped lake; not on any danger list; scenario is hypothetical", each with a mandatory volume range rather than a point value. The load-bearing reason: the best-documented recent Nepal GLOF killed and destroyed outside the list, so restricting origins to the list encodes a known blind spot, whereas the risk of a labelled hypothetical is manageable by wording and uncertainty bands. Do not publish per-lake rankings or "danger" words for Tier 3, and keep a cascade option (upper lake overtopping into downstream lake) for any lake with another mapped lake within a few hundred metres downstream, since Thame's second lake sat 650 m below. Load the Zenodo CC BY HMA inventory (2022 epoch) as the base, keep ICIMOD PDGL attributes as a separate attributed layer (NC-ND: link and cite, do not redistribute a modified copy; check with ICIMOD for a reuse statement), and default volume to a scaling-law median with a shown low/high band (use a factor of 3 pending verification) and an explicit "user-supplied volume overrides" flag.

- **Position:** Offer unlisted and Tibet-side lake origins in a tiered, uncertainty-banded, explicitly "hypothetical / not on a danger list" layer.
- **Confidence:** medium (about 65%). Direction is well supported; the specific scaling error band and the small-lake mapping accuracy are not verified in this run.
- **Boundary conditions:** Applies to a scenario/education tool with no operational warning claim; for lakes >=0.02 km2 in Nepal-draining catchments. Below 0.02 km2 the open inventory is least accurate and Thame-type lakes may be missed; the tier cannot claim completeness.
- **What would change this position:** evidence that users read unlisted-lake scenarios as forecasts (user testing), a formal request from DHM/NDRRMA/ICIMOD to avoid unlisted-lake scenarios, or a validation showing the open inventory has major false-positive rates (e.g. >30% of lakes >=0.02 km2 misclassified or non-glacial) in Nepal catchments.
- **Evidence weight:** 1 institutional inventory (licence and thresholds verified), 1 open peer-reviewed inventory with a CC BY dataset, 1 conference abstract plus 1 non-peer-reviewed preprint on Thame, 1 abstract on GLOF under-recording, 1 journalism piece on Bhotekoshi (unverified numbers); volume-scaling error is from background knowledge only.

## Open questions
- Exact volume-area coefficients and residual error for HMA/Nepal lakes (Cook & Quincey 2015, newer fits); confirm before coding.
- Whether the Zenodo dataset has per-lake IDs, basin attribution and a Tibet-side attribute table and its small-lake omission rate for Nepal.
- ICIMOD's position on derivatives of the NC-ND 2020 list; whether a newer ICIMOD HKH inventory or Hi-MAG-type products have more permissive licences.
- Whether 2026 Bhotekoshi origin lake is documented in peer-reviewed form.
- GLAKES (global, ESSD) coverage and licence: not retrieved.

## Sources
1. [[inventory-of-glacial-lakes-and-identification-of-potentially-dangerous-lakes-1]] ICIMOD/UNDP 2020 inventory
2. [[abstract-egu25-12752]] Cook et al., 2024 Thame GLOF
3. [[quantifying-the-long-term-evolution-of-glacial-lakes-and-the-impact-of-the-2024]] Thame preprint
4. [[sixteen-minutes-what-the-bhotekoshi-flood-reveals-about-the-regions-unfinished-e]] Borderlens
5. [[automated-satellite-based-glacial-lake-inventory-and-change-detection-in-high-mo]] Sci. Reports HMA inventory
6. [[abstract-egu23-15703]] McCoy et al. GLOF mapping
7. [[abstract-egu25-14977]] Das & Ramsankaran bathymetry
