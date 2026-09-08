# Scenario Engine — feature 28

The engine prepares transparent, reproducible educational scenarios offline. The public Atlas only inspects registered static results. Both supported adapters return the same versioned output contract. They are **network approximations**, not calibrated flood, GLOF, landslide, blockage or emergency forecast models. Full simulation controls remain the separately assigned feature 29.

## Lifecycle and simulation levels

1. **Level 0 — input/provenance contract:** `scenario-request.schema.json` records exact input versions and artifact hashes, source and processing versions, model/version, fixture status, source reach, parameter values/units and ordered assumption IDs. Unsupported versions, missing assumptions and impossible inputs fail before publication.
2. **Level 1 — `network-path@1.0.0`:** follows the already validated HydroRIVERS `NEXT_DOWN` network from the whole selected reach. It sums source `LENGTH_KM`, preserves source outlet versus release-boundary termination, and returns no timing or physical quantities. This adapter uses the network capability of Level 1; it does not derive DEM flow direction, slopes or terrain routing. No snapping, nearest-reach substitution, resampling or hidden terrain assumption occurs.
3. **Level 2 — `constant-celerity-pulse@1.0.0`:** adds an explicit constant celerity and rectangular release signal to that same pathway. It computes a purely translated, non-attenuated signal. This is an illustrative lag-routing approximation, not a hydraulic solver.
4. **Level 3+ / physical models:** no adapter is registered. Future models must declare their own IDs/versions, inputs, units, validation, assumptions and outputs; the engine never silently substitutes another model.

The shared registry in `packages/contracts/scenario-registry.json` assigns versioned statements to every assumption. Definitions must include the complete model-specific list. Results embed those statements, the original definition, run fingerprint, calculation timestamp, Python version, processing version, CRS, spatial basis, relative time basis, validation status and limitations. Published output geometry is the selected **source river pathway**, not a simulated footprint.

## Level 2 equations and parameter limits

Let `L_i` be the source length of reach i in kilometres, `c` the assumed constant celerity in m/s, `V` hypothetical release volume in m³ and `T` release duration in seconds.

- Entering reach i: `t_entry = 1000 × sum(L_j for j < i) / c`.
- Leaving reach i: `t_exit = 1000 × sum(L_j for j <= i) / c`.
- End of pulse at that outlet: `t_exit + T`.
- Rectangular signal discharge: `Q = V/T` within that outlet interval and zero additional release outside it.
- `Q × T = V` at **each** cross-section by construction. Volumes across reaches must not be added.

| Parameter | Unit | Inclusive range | Published example |
|---|---|---|---|
| Assumed celerity | m/s | 0.1–10 | 2 |
| Hypothetical volume | m³ | 0–10,000,000 | 100,000 |
| Release duration | s | 60–86,400 | 3,600 |

These are declared demonstration/resource limits, not scientifically calibrated Nepal parameter ranges. No missing parameter receives a default at execution: the example definition records every value explicitly. Celerity is a signal translation assumption, not measured water velocity. Zero volume is an explicit zero-release scenario, not a zero-hazard claim. Zero-length source reaches have zero additional lag and remain identified.

[USACE HEC-HMS Lag Model documentation](https://www.hec.usace.army.mil/confluence/hmsdocs/hmstrm/channel-flow/lag-model) describes translation without attenuation or diffusion. This Atlas adapter implements that limited conceptual operation using user-assumed constant celerity to define lag; it does not run HEC-HMS, copy its calibration or establish suitability for a real Nepal event. [HydroRIVERS documentation](https://data.hydrosheds.org/file/technical-documentation/HydroRIVERS_TechDoc_v10.pdf) defines the source reach lengths and downstream pointers.

## Reproduction and publication

```bash
# Verify or publish the two registered examples from checked-in source releases.
npm run data:scenarios

# Copy a published request, choose a new scenario ID and explicit parameters,
# then run a custom scenario offline.
.venv/bin/python -m pipelines.atlas_pipeline.scenarios --request /absolute/path/request.json
```

The request JSON artifact is also the run fingerprint: SHA-256 of sorted compact Python JSON with its final newline. Consumers verify the exact supplied bytes rather than reserializing numbers or Unicode in a different language. Existing scenario identities/versions are verified and cannot be replaced by a different definition. Results reproduce numerically from checked-in source artifacts; original runtime/time provenance is preserved rather than replaced during verification. A custom result must be explicitly registered in the viewer before browser exposure.

Calculation occurs before publication, and each staged release is verified before copying. Request, compressed result and source-path geometry carry independent hashes. The browser verifies build-pinned hashes, definition/result identity, assumption registry, units, cumulative lengths and timing/volume equations before rendering a separately disposable dashed line. The viewer does not compute new scenarios on the rendering thread or require credentials.

The two real-source examples (`scenario-network-40669746` and `scenario-pulse-40669746`, version 1.0.0) retain 180 reaches and stop before unavailable HYRIV 40768704. Their status is **partial coverage**, never a complete downstream hazard claim. They are hypothetical demonstrations, not known real events.

## Validation and explicit failure states

Synthetic fixtures are marked separately from real source data. Analytical tests verify two known lengths (1 km + 2 km), 2 m/s celerity, entry/exit delays of 0/500/1,500 seconds, pulse ending at 2,100 seconds for a 600-second release, and mass per section. Boundary tests cover zero release, zero length, minimum/maximum parameters, unknown starts, coverage exits, cycles, missing lengths/pointers, source-hash mismatch, fixture mismatch, unsupported adapters, changed units, nonfinite values and missing assumptions.

The network is capped at 25,000 reaches, individual runs at 5,000. Exceeding a limit raises an explicit failure; it does not return a truncated numeric result or imply zero hazard. Invalid inputs, inconsistent source membership and numerical failures produce a non-zero CLI exit with a failure code. No failed run is published as a valid result. Root validation regenerates numerical results and source-path geometries and checks exact public copies.

Footprint, water depth, water velocity, vertical datum and confidence interval remain null/UNKNOWN. No DEM, cross-sections, roughness, tributary inflow, storage, attenuation, breach mechanics, erosion, sediment, obstruction dynamics, rainfall transformation, exposure, vulnerability or damage calculation is part of these adapters. No real-event validation or quantitative uncertainty interval is claimed; assumptions and omitted processes define the limits.
