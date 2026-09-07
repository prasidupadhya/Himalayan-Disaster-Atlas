# Infrastructure

Feature 16 publishes a static, evidence-traceable OpenStreetMap infrastructure inventory for Nepal. It supports six logical classes: **major roads, major bridges, schools, health facilities, emergency facilities, and settlements**.

The source is acquired only during offline preprocessing. A pinned build-time Overpass snapshot supplies node coordinates and way/relation centres for bridge, school, health, emergency and settlement records. Five smaller `out geom` road extracts supply complete OSM way-node geometry for motorway, trunk, primary and corresponding link roads. Each source file is SHA-256 pinned and records its OSM base timestamp. Browser visitors make no OpenStreetMap or Overpass requests.

The acquisition bounding boxes extend beyond Nepal, so the pipeline never treats their edges as a national boundary. Point records are retained only when covered by the pinned unsimplified Nepal COD-AB v02 country polygon. Road ways are intersected with that polygon; QA records 32 retained ways that required boundary clipping and 14,565 bbox candidate road ways that were outside Nepal. Sixty-one repeated road occurrences caused by slice overlap are removed by stable OSM way ID.

The published inventory contains:

- 5,311 major-road ways across three browser partitions;
- 3,004 major bridges;
- 25,674 schools across four browser partitions;
- 4,654 health facilities;
- 923 emergency facilities;
- 4,045 settlements.

Road geometry is topology-preserving simplified at `0.0002°` for display. Facility/bridge ways and relations use the centre supplied by Overpass; nodes use their source coordinate. Each record preserves OSM element type and ID, source timestamp, subtype, name where available, operator/reference/surface tags where available, and a `position_basis` that states whether its browser geometry is source or derived presentation geometry.

OpenStreetMap is community maintained. Completeness, positional accuracy, naming and tagging vary geographically, so missing infrastructure must remain **UNKNOWN**, not "absent". Buildings are intentionally excluded because OSM building completeness is too uneven for defensible national exposure counting. This feature is an inventory foundation only: it does not calculate exposure, vulnerability, damage or risk.

Source licensing: © OpenStreetMap contributors, Open Data Commons Open Database License (ODbL) 1.0.
