# Hazards hub — Feature 56

`/hazards/` gathers hazard context in one bilingual (English/Nepali) page. Each panel is labelled by evidence type (modelled, derived, scenario, gated) and links to its release manifest, methodology and sources. Nothing on the page is a forecast or warning; DHM and NDRRMA/BIPAD are linked as the authorities.

## Panels
- **Rainfall and snow** (Feature 54) and **Drought and heat** (Feature 55): NASA POWER cells with a month selector over the latest 12 months, map, national SPI-3 area shares and full tables. See [climate context](climate-context.md).
- **Landslide terrain context** (Feature 53): district steepness map and table. See [terrain steepness](terrain-steepness.md).
- **Floods/GLOF and earthquakes**: links into the scenario simulator and `/live/`.
- **Ask the evidence** (Feature 58): quoted passages from the public evidence corpus. See below.

## Gated features (built disabled)
| Feature | Shown as | Unlock conditions |
|---|---|---|
| 44 DHM / NDRRMA-BIPAD feeds | GATED — link-only | Written redistribution terms or an open licence for the feed; a documented, stable public endpoint; a reviewed adapter that preserves official warning text verbatim. DHM stays link-only until then. |
| 50 Verified physical flood cases | GATED — no modelled inundation | Reviewed bathymetry and breach parameters for a specific lake, a terrain model suitable for hydraulics, boundary conditions, and validation against an observed event, all with redistributable licences (see `processing/glof/README.md`). |
| 52 Earthquake damage | GATED — damage UNKNOWN | A reviewed building exposure taxonomy for Nepal, fragility/vulnerability functions appropriate to it, replacement-cost valuation, and validation against a documented event (for example Gorkha 2015) with licences that permit publication. |

## Evidence analyst (Feature 58)
`atlas-public-evidence@1.0.0` holds verbatim paragraphs from the public feature documents and the method, uncertainty and limitation fields of the public model releases. The analyst ranks passages with the documented lexical score and shows the top passages with citations; it never generates or paraphrases factual text and calls no external service. Empty results say "insufficient evidence", never "safe" or "no impact". Retrieval works on English source text; suggested questions are offered in both languages.
