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

## 3D playback

After a run the simulator map raises the checksum-verified Copernicus terrain (relief ×1.5, hypsometric tint showing height only) and plays the declared pulse down the mapped river line (`apps/web/features/simulator/player.tsx`, geometry in `scene-3d.ts`). The bright band is the pulse at the central celerity, from its tail (`c·(t − duration)`) to its head (`c·t`); the faint band spans the fastest and slowest declared fronts; checkpoints light up at their central arrival time. Model kilometres are mapped onto the drawn line in proportion, so the picture agrees with the arrival table. The camera follows the head along the direction of travel and can be released by dragging or with *Follow*. Playback starts once the map is on screen, never under reduced motion (which opens at the end state), and is absent without WebGL; the tables remain the full record. It shows no inundation extent, depth or damage.

**Starting playback.** Run brings the 3D stage into view first and then plays, on every screen size (`lib/reveal.ts`, `revealMapThenPlay`): the stage is scrolled under the header until at least 60% of it is visible, playback starts, the start is announced ("Playing: the declared pulse moving down the N km river path."), and focus moves to the status line on the stage. A **See results** link beside the status moves on to the result heading. With reduced motion the stage is shown at once and playback stays at its end state. Without WebGL, Run moves to the results as before. The playback dock sits under the map, never over it, and keeps a fixed layout while it plays.

### Names along the path

The playback and the result's *Where the path runs* section name what the path crosses (`features/simulator/route.ts`, `route-data.ts`), from checksum-verified releases only: COD-AB v02 country, province, district and local-level boundaries; GeoNames named stream points (CC BY 4.0); OpenStreetMap settlements (ODbL). The path is walked in 0.5 km steps:
- **Units:** each step is placed in its province, district and local level (the local level within its own district). Where a river forms a district boundary and the path crosses back and forth in stretches under 5 km, both districts are listed together ("Gorkha / Tanahun") and marked as a boundary. The first step outside the country outline is reported as reaching the Nepal border.
- **Stream names:** GeoNames points within 1.5 km of the line are listed at their own position, with the km where the path passes them, once they hold for 2 km. The release warns that a point may be a mouth or other reference location and that nearby streams must not inherit its name, so no stretch of the path is named after one; these are for orientation only. A stray combining dot after "i" (U+0307, from lowercasing "İ") is dropped for display.
- **Places:** cities and towns within 4 km of the line, and villages within 1 km, each listed once at its closest point. Near the line is not affected; this scenario has no flood extent.

On the map, all seven provinces are named; the path shows its start, the Nepal border or the end of the mapped path, districts (lit as the pulse enters), stream points and places (villages only while the pulse is near). Text labels are DOM markers, because the static site ships no map fonts.

