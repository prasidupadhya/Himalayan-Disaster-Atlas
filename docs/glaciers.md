# Glaciers feature handoff

Branch: `feat/glaciers`

## Source

The feature uses Randolph Glacier Inventory (RGI) 7.0 glacier-product records exposed by GLIMS for South Asia West (region 14) and South Asia East (region 15). The acquisition pipeline pins both WFS subsets by SHA-256 and selects complete glacier features that intersect the validated Nepal COD-AB country polygon.

RGI 7.0 is distributed under CC BY 4.0. Stable RGI IDs and GLIMS IDs remain unchanged. Source area and RGI topographic attributes are retained rather than recomputed from browser geometry.

## Temporal meaning

RGI 7.0 is a dated inventory targeting approximately the year 2000. The Nepal-intersecting records in this release have source outline dates from 1992-09-22 through 2010-06-10. The interface displays the individual date and explicitly states that the outline is not a current 2026 glacier margin.

## Processing and QA

- Both RGI regions are needed to cover Nepal.
- 4,593 stable RGI records intersect Nepal.
- 95 records have a source-published glacier name; unnamed records remain `UNKNOWN` in presentation.
- The GLIMS WFS display export contains some geometries that are invalid after its coordinate transformation. The web-display copy force-drops Z, uses `make_valid` only when required, keeps polygonal components, and then applies a small topology-preserving simplification. QA records 287 such presentation repairs.
- Source RGI area is authoritative for the displayed area value; repaired/simplified browser geometry must not be used to recalculate it.
- Three geographic browser partitions keep every decoded GeoJSON artifact under the repository's 8 MiB safety budget. Partitioning has no scientific meaning.

## UI behavior

Glacier polygons become visible from zoom 5.5. Search covers glacier name, RGI ID and GLIMS ID. Selection shows the source area, outline date, elevation statistics, DEM source, inventory region and whether a presentation repair was required. Selection and visibility operate on stable feature IDs without reacquiring the immutable release.

No glacier-to-lake causal association, hazard class, retreat rate or current-margin inference is created by this feature.
