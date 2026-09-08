# Hazard Graph — feature 27

`nepal-hazard-graph/1.0.0` is a source-derived relationship index, not a causal model. It contains all 18,299 retained river reaches and 18,110 NEXT_DOWN connections, plus two existing hypothetical corridor definitions, two exposure summaries and their 508 result-scoped asset records. Total: 18,811 nodes, 18,620 edges.

Each node references a versioned source manifest and exact record ID. Each edge records its directed meaning, input reference, evidence record, method, evidence class, confidence, assumptions and limitations. Manifest and source artifact hashes are retained. Source licences and dates remain visible; unknown dates/confidence remain null/UNKNOWN. Asset identifiers are scoped to the exposure result: the same OSM object in two runs is not counted as two unique geographic assets or linked automatically.

## Relationship registry

- `river_downstream`: river → river, source HYRIV_ID/NEXT_DOWN pointer, DERIVED. It is neither a field-observed flow measurement nor hazard propagation. See [HydroRIVERS technical documentation](https://data.hydrosheds.org/file/technical-documentation/HydroRIVERS_TechDoc_v10.pdf).
- `scenario_exposure`: hypothetical scenario → exposure result, MODELLED conditional relationship with explicit footprint assumptions. The underlying overlay calculation is derived; its relationship to a hypothetical hazard remains modelled.
- `footprint_intersection`: conditional exposure → mapped infrastructure, MODELLED, source overlay result and OSM ID required. It never means confirmed impact, vulnerability or risk.
- `glacier_lake`: glacier → lake; requires a documented source relationship or explicit, justified inference with assumptions. No such edges are published here.
- `lake_river`: lake → river; requires documented outlet connectivity. Nearest river is insufficient. Unavailable here.
- `hazard_exposure`: hazard → exposed entity/result; requires footprint overlay evidence and its method. No observed hazard footprints are inferred from event points.
- `landslide_blockage`: event/hazard → river; requires blockage-specific evidence or a documented model/inference. Nearby landslides are insufficient. Unavailable here.

OBSERVED means a source-documented direct relationship, DERIVED means reproducible processing, INFERRED requires explicit assumptions and supporting source records, and MODELLED is conditional on recorded hypothetical inputs. All edges require provenance and limitations. Inferred/modelled edges are dashed and explicitly labelled; observed/derived edges are solid with their class stated in details. Confidence values may only come from documented evidence; this release supplies no numerical accuracy claim. Absence of an edge means UNKNOWN, not absence of a relationship.

## Processing and exploration

`npm run data:hazard-graph` derives the graph from verified river and exposure releases. Validation re-derives every published node/edge from source records and checks exact public bytes. Re-running an existing release verifies it without replacement. The browser checks the build-pinned SHA-256 before bounded gzip decompression: 2 MiB compressed, 16 MiB decoded, 25,000 nodes and 30,000 edges maximum.

The graph is loaded on demand. Search lists at most 100 nodes, diagram/traversal at most 30, and outgoing details at most 30; truncation is explicit. Iterative traversal uses visited-node sets, deterministic edge ordering and a hard cap. General relationship cycles are permitted and terminate safely; no transitive causal relationship is generated. Duplicate nodes/edges, self-edges, absent endpoints, invalid type pairs and missing evidence fail validation. River coverage exits preserve the unresolved source NEXT_DOWN rather than inventing an endpoint.

Diagram positions are schematic, not geographic. Selecting a node can focus a separately disposable map marker at its representative source position. Only source geometry/positions establish map context, never the drawn diagram connections. The accessible controls and edge details remain available without WebGL.

Source attribution and redistribution terms remain those in the pinned FAO/HydroRIVERS and exposure input manifests; no new geographic observations were acquired. Synthetic cycle/malformed graph tests are separate from the real release.
