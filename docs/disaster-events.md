# Disaster events

The disaster-event archive joins BIPAD incident, hazard and referenced loss records for incidents dated from 2015-01-01 through the 2026-09-07 snapshot. Two byte-identical pagination overlaps are deduplicated by stable incident ID, producing 57,216 unique records. Browser delivery uses eight immutable time partitions so every artifact remains below the 2 MiB compressed and 8 MiB decoded limits.

Each record retains the BIPAD incident ID, controlled BIPAD hazard category, incident/reported timestamps, point location, source labels, verification/approval state, loss reference and source-reported death/injury/missing/affected counts plus estimated economic loss where present. Source zeros are presented as source-reported values and are not treated as independently confirmed no-loss findings.

Incident points are reported locations, not hazard footprints. Archive density depends on both event occurrence and reporting coverage. The UI therefore labels facts as reported records and keeps interpretation separate. The large archive is loaded only when the user explicitly enables it, then map/list filtering supports hazard and date ranges plus text search.
