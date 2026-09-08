# Simulation UI — feature 29

Feature 29 provides the public workbench for the versioned Scenario Engine introduced in Feature 28. The workbench is intentionally limited to the two registered educational network adapters. It is **not** a flood, GLOF, breach, blockage, landslide, damage or emergency forecast interface.

Every result carries the prominent label **MODELLED SCENARIO — NOT AN OFFICIAL FORECAST**. Source river geometry is identified separately as source-derived cartography; timing and rectangular signal quantities are modelled. Inundation footprint, depth, hydraulic velocity, damage, vulnerability and validated exposure remain unavailable unless a future registered model explicitly produces the required evidence.

## Supported simulation levels

| Level | Model | Public UI capability | What it does not represent |
|---|---|---|---|
| 1 | `network-path@1.0.0` | Follows the verified HydroRIVERS `NEXT_DOWN` pathway and reports source reach lengths/coverage. | No timing, depth, discharge, velocity, footprint or physical routing. |
| 2 | `constant-celerity-pulse@1.0.0` | Recomputes the validated constant-celerity rectangular-pulse equations over the same verified pathway. | No hydraulics, attenuation, storage, terrain routing, breach physics or predicted arrival time. |
| 3+ | none registered | Explicitly unavailable. | The UI never substitutes Level 1/2 for a missing physical model. |

The workbench loads both immutable Feature 28 examples and verifies their hashes, contracts, common source reach, source dataset versions and identical source pathway before enabling execution. Corrupt or incompatible source artifacts fail closed and expose a retry state.

## Level 2 controls

All three parameters are required before execution. The browser applies the same inclusive ranges already enforced by the Feature 28 request schema:

| Parameter | Unit | Inclusive range | Default/reference value | Meaning |
|---|---|---:|---:|---|
| Assumed signal celerity | m/s | 0.1–10 | 2 | User-assumed signal translation speed; **not measured water velocity**. |
| Hypothetical release volume | m³ | 0–10,000,000 | 100,000 | Rectangular pulse volume conserved at each cross-section by assumption; **not summed across reaches**. |
| Release duration | s | 60–86,400 | 3,600 | Hypothetical pulse duration; **not a forecast duration**. |

These are demonstration/resource limits, not Nepal-calibrated physical ranges. Inputs are checked for finite values, exact model/level compatibility and inclusive limits before the adapter can run. Invalid controls remain visible with their valid range and are blocked from execution.

The Level 2 adapter calculates:

- `entry delay = 1000 × previous cumulative source length / celerity`;
- `exit delay = 1000 × cumulative source length / celerity`;
- `pulse end = exit delay + release duration`;
- `rectangular signal discharge = release volume / release duration`.

Default controls are independently recomputed in the browser and checked against the published Feature 28 Level 2 reference result. Custom values use the same equations and verified source pathway but are not claimed to have an independent published reference or real-event validation.

## Provenance and scientific details

Before a run, the workbench shows the selected simulation level, model/version, source HYRIV reach, retained-path length, partial/complete source coverage and exact input dataset versions. All model-specific versioned assumptions are visible before execution.

After a run, the result keeps:

- simulation level and model/version;
- `MODELLED` evidence type and network-approximation model class;
- source reach and pathway coverage;
- exact input dataset IDs, versions, processing versions, dates, source attribution, licences and artifact hashes;
- source-basis fingerprint and deterministic interactive-run fingerprint;
- explicit assumptions and Feature 28 limitations;
- synthetic analytical validation status and lack of real-event validation;
- `UNKNOWN` confidence interval, footprint, depth and hydraulic velocity.

The browser calculation is deterministic and local. It requires no account, runtime third-party API, server endpoint or secret. It does **not** overwrite or publish a Feature 28 immutable scenario release.

## Exposure rule

Feature 29 does not infer an exposure footprint from a river line. The current Level 1/2 results publish `footprint = null`; therefore the Simulation UI reports estimated exposure as **UNAVAILABLE** and does not invoke or reuse unrelated Exposure Engine corridor results.

A future simulation may show exposure only when its registered output supplies a validated simulation footprint with compatible evidence semantics and the validated Exposure Engine produces the intersection estimate. An absence of such an output never becomes zero exposed people/assets.

## Compatible scenario comparison

The workbench can hold one completed run as comparison A and compare it with the current run B. Comparison is allowed only when both runs use the same simulation level, model/version, source reach, verified source-basis fingerprint and ordered pathway. It shows parameters and model outputs side by side and never produces a better/worse, severity or safety ranking.

Level 1 and Level 2 are not cross-compared because they have different model semantics. A future physical model/version would likewise require its own explicit compatibility definition.

## 2D/3D presentation

The Simulation UI uses one MapLibre source pathway for both flat and perspective presentation. Switching perspective changes only the camera pitch; it does not rerun the model, alter the pathway, change parameters or create new 3D physics. If the separate Terrain feature is enabled, the same modelled pathway remains the simulation output draped within that map context.

The dashed simulation pathway must not be interpreted as an inundation polygon, flood extent or affected corridor. Textual results remain usable if WebGL or the map is unavailable.

## Failure and constrained-screen behavior

- Corrupt source artifacts, hash mismatches, incompatible prepared examples and calculation failures are explicit errors.
- Invalid parameters are blocked before execution.
- No unsupported Level 3+ adapter can be selected.
- Partial HydroRIVERS coverage remains partial and names the unavailable next reach.
- Missing footprint/exposure/confidence remains `UNAVAILABLE`/`UNKNOWN`, never an implicit zero.
- Controls meet the existing keyboard/focus conventions, comparison tables have semantic captions/headers, and narrow screens stack parameter/map/comparison actions vertically.

## Verification

Feature-specific checks include:

```bash
npx vitest run tests/web/simulation-ui.test.ts tests/web/scenario.test.ts
npm run typecheck
npm run lint
npm run build
npx playwright test tests/e2e/simulation-ui.spec.ts tests/e2e/scenario-engine.spec.ts --project=chromium
```

The repository-wide gate remains `npm run check`.
