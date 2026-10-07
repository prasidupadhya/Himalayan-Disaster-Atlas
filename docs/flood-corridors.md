# Flood and GLOF corridor scenarios — Feature 49

The simulator's flood tab (`/simulate/`) lets a reader declare a hypothetical release at one of 18 verified release points and see when a translated pulse could pass distance checkpoints, and which mapped people and assets lie within declared corridors. It is an **educational scenario, not a forecast, warning or inundation model**.

## Release `atlas-flood-corridors@1.0.0` (`npm run data:flood-corridors`)
- **Release points:** the 10 largest Nepal glacier-fed lakes in the GLO inventory (`nepal-transboundary-glacial-lakes`), each linked to the nearest HydroRIVERS reach within 2 km of its centroid (declared assumption; the real outlet and breach are UNKNOWN), plus the main stems of the 8 largest river outlets traced upstream to the first retained reach.
- **Paths** follow `NEXT_DOWN` and stop at the source outlet or where mapped coverage ends (`coverage_exit`); beyond that, exposure is UNKNOWN, not zero.
- **Corridors:** local azimuthal-equidistant buffers of 250, 500 and 1,000 m each side of reach-complete path prefixes at 10, 25, 50, 100, 200 km and the full path.
- **Population:** exact EPSG:6933 equal-area cell fractions of the 3″ HRSL raster. Any corridor area outside Nepal is reported as `unknown_area_km2` and the total becomes `null`.
- **Assets:** OSM schools, health and emergency facilities, settlements, hydropower, bridges and major roads (each element counted once on any intersection). Categories overlap and must not be added. Buildings and dams have no reviewed inventory: UNKNOWN.
- **Orientation hint:** the nearest GeoNames stream point within 5 km is shown for orientation only; it never names a HydroRIVERS reach.

## In-browser scenario (`apps/web/lib/flood-scenario.ts`)
- Hydrograph at the source: rectangular (Q = V/T) or triangular (peak 2V/T at the declared fraction of T). Both conserve the declared volume exactly; the result shows a volume check.
- Pure translation at a declared celerity ensemble `[min, central, max]` m/s — no attenuation, storage, tributary inflow or routing. Arrival ranges are sensitivity to that declaration, not probabilities.
- Exposure ranges span the three corridor widths (central = 500 m) — sensitivity, not confidence intervals.
- Declared bounds: volume 10³–5×10⁸ m³, duration 10 min–48 h, time to peak 5–95 %, celerity 0.1–10 m/s. Out-of-bounds input disables Run.
- Assumptions are listed before Run and an acknowledgement is required.

## UNKNOWN
Real lake volumes (no bathymetry), breach mechanics, inundation depth and extent, building damage, casualties, repair costs, hydropower downtime and economic loss. Verified physical cases are the gated Feature 50; see `processing/glof/README.md` for the offline solver and what it requires.

## Tests
`tests/python/test_model_releases.py` (tampering, unknown-area totals, width monotonicity), `tests/web/simulator.test.ts` (volume conservation, arrival ordering, validation, share links) and `tests/e2e/simulator.spec.ts`.
