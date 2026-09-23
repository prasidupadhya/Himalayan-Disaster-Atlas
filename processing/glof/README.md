# Physical GLOF research project

Scope: every record in the reviewed GLO Nepal/transboundary inventory, including upstream lakes outside Nepal. Inventory inclusion is not proof of drainage into Nepal. `inventory.py` enumerates all 4,150 candidates and leaves outlet connectivity, inundation and damage unknown. No real-lake physical runs are currently validated or published.

## Separate environment

Use Python 3.13 in an isolated environment, then `pip install -r processing/glof/requirements.lock`. These dependencies are not installed by the website or Cloudflare build. ANUGA 4.0.1 is Apache-2.0 (the installed distribution's license expression); its dependencies retain their own terms. The Atlas adapter is MIT. No upstream solver code is copied here.

```
python -m processing.glof.inventory --output /tmp/glof-readiness.json
OMP_NUM_THREADS=1 python -m unittest processing.glof.test_runner -v
OMP_NUM_THREADS=1 python -m processing.glof.benchmark --output /tmp/glof-verification.json
OMP_NUM_THREADS=1 python -m processing.glof.runner /path/to/request.json --output /path/to/new-run
```

## Required physical request

The request identifies `schema_version: "1.0.0"`, `model: "anuga-swe-4.0.1"`, `scenario_type: "instantaneous-breach"`, `evidence_type: "MODELLED"`, `real_event_validated: false`, `is_fixture: false`, and a real source `lake_id`. Synthetic verification uses `is_fixture: true` and `lake_id: null`; it cannot impersonate a named lake.

Supply `horizontal_crs` (projected, metres), `vertical_unit: "m"`, one `vertical_datum`, `boundary` (`reflective` or `transmissive`, applying to all exterior edges), `duration_s`, `output_interval_s`, `wet_threshold_m`, and `mesh: {path, sha256}`. The NPZ must contain projected `points[N,2]`, integer `triangles[M,3]`, and finite centroid fields `bed_m[M]`, `initial_stage_m[M]`, `manning_n[M]`. The bed represents an explicitly assumed post-breach geometry; stage represents initial stored water. A DEM showing the lake surface cannot substitute for underwater bathymetry. All arrays must use the same vertical datum. No interpolation or missing-data filling is performed by the solver adapter.

Every item under `evidence` (`terrain`, `bathymetry`, `lake_stage`, `breach`, `roughness`, `boundary_conditions`) needs a source, date, license and limitations. Required input provenance is a gate, not proof of independent expert review. Terrain, outlet and lake geometry must be prepared and reviewed upstream; automatic snapping to the nearest river is prohibited.

The pilot adapter supports only a spatially uniform exterior boundary type, initially stationary water, and an instantaneous breach represented by the supplied bed. It does not model breach growth, sediment/debris transport, inflow hydrographs, reservoir-operation rules, structural failure or destruction. Runs stay `RESEARCH_ONLY`; there is no website publication shortcut. Unsupported boundary conditions require an independently reviewed adapter extension.

## Numerical verification and release gates

`benchmark.py` compares dry dam-break depths with the Ritter analytical solution at two mesh resolutions, checks improvement under refinement and mass conservation, and checks stationary water over varying bed elevations. These are synthetic verification tests, not regional calibration or proof that all GLOFs are represented by shallow-water equations. Reference: https://anuga.readthedocs.io/en/stable/reference/validation.html

The runner checks finite inputs/results and a mass balance including boundary exchange, then writes immutable, hashed NPZ fields and provenance. Reported maxima/first-wet times are sampled at the requested output interval; arrival-time precision cannot exceed it. Unwetted cells have NaN arrival time in NPZ, never a fabricated zero. Damage and exposure remain null. Output is intentionally outside `apps/web/public`.

Before any Nepal result can be published: establish lake/outlet/catchment identity; review terrain and bathymetry resolution/datum; justify breach/volume scenarios; test open-boundary placement and domain extent; establish mesh and output-time convergence; vary roughness and breach assumptions; validate against appropriate observations or experiments; document missing assets and uncertainty; perform license review; and register a physical-output contract. Only then intersect a validated footprint with infrastructure. Destruction requires a separate validated vulnerability model and must not be inferred from intersection alone.

## Inventory-wide execution

`python -m processing.glof.batch --requests /path/to/reviewed-requests --output /path/to/new-batch` accounts for every inventory lake. Unique requests identify real GLO IDs; missing requests remain `INPUTS_REQUIRED`, rejected inputs/runs remain explicit failures, and completed runs remain `MODELLED_RESEARCH_ONLY`. An empty request directory produces a complete readiness report, not 4,150 invented simulations. Results cannot be interpreted as drainage to Nepal or destruction merely because a run completed.
