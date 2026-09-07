# Floods

Feature 13 publishes 2,407 BIPAD incidents whose authoritative BIPAD hazard classification is `Flood`. The release is a deterministic, checksum-traceable derivative of the pinned Disaster Events archive; it retains the original incident ID, source point, local/UTC date, verification/approval state, location text, source labels and linked BIPAD loss fields.

Every feature is explicitly marked `evidence_status=reported` and `hazard_footprint=false`. A map point is therefore **only a reported historical incident location**. It must not be interpreted as an observed inundation polygon, satellite-derived water extent, modelled return-period surface, current warning or forecast. Flood depth, duration and spatial extent are unknown in this layer.

The BIPAD API is publicly accessible from NDRRMA, Government of Nepal, but its API documentation does not publish a standalone redistribution licence. The atlas records that limitation and the source terms should be re-audited before external redistribution of the cached release.
