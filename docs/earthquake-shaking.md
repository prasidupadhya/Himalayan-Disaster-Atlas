# Earthquake shaking scenarios — Feature 51

The simulator's earthquake tab computes a **modelled ground-motion field** for a declared or catalogued earthquake and counts HRSL population and mapped OSM assets by peak-ground-acceleration band. It does not estimate damage.

## Model `atlas-gmpe-bssa14@1.0.0` (`npm run data:gmpe`)
- Boore, Stewart, Seyhan & Atkinson (2014), NGA-West2, *Earthquake Spectra* 30(3), doi:10.1193/070113EQS184M. Global coefficients (ΔC3 = 0) for PGA and PGV, transcribed from the paper; no third-party code was copied.
- Python reference implementation in `pipelines/atlas_pipeline/gmpe.py`; browser implementation in `apps/web/lib/earthquake.ts`. Both are checked against 1,320 independent cases generated with pygmm 0.8.0 (MIT) in `tests/fixtures/gmpe-bssa14-reference.json` (agreement ≈1e-15 in ln units).
- Domain enforced in both: M 3–8.5 (normal faulting M ≤ 7), R_JB 0–400 km, V_S30 150–1500 m/s. Inputs outside are **refused**, not extrapolated. Population beyond 400 km is counted separately and not banded; district points beyond 400 km show UNKNOWN.

## Scenario
- Presets: the ten largest M ≥ 6 events in the verified catalogue (`nepal-region-earthquakes`); Gorkha 2015 (`us20002926`, Mww 7.8) is the default. The catalogue supplies epicentre and magnitude only — mechanism defaults to "unspecified" and no rupture geometry is assumed.
- Optional declared surface line centred on the epicentre (length, strike) for finite-fault sensitivity; R_JB is measured to that line.
- One uniform V_S30 (760/360/270/180 m/s). Basin effects (e.g. Kathmandu Valley) are not modelled.
- Bands (g): <0.02, 0.02–0.05, 0.05–0.1, 0.1–0.2, 0.2–0.4, ≥0.4. Counts are given for the median and for ln PGA ± 1 total σ applied to every site together — a bounding sensitivity, not a spatially correlated scenario or a confidence interval.
- The ordinal colour ramp was validated against the dark map surface; every band also has a text label.

## Gorkha comparison
Recorded ground motion for us20002926 is **UNKNOWN** in the Atlas: USGS ShakeMap station data were not reachable from the build environment and are not ingested. Unlock: register the reviewed ShakeMap station list (public domain) as a pinned release and add a residual view.

## UNKNOWN
Building damage, casualties, repair costs and economic loss (gated Feature 52: needs a reviewed building taxonomy, fragility functions and valuation).
