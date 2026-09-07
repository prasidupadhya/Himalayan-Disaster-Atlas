# Landslides

Feature 14 publishes 5,742 historical BIPAD incidents whose source hazard is `Landslide`. Stable atlas IDs retain the original BIPAD incident ID and all records preserve source coordinates, dates, verification/approval state, location text, source labels and linked loss fields.

The layer is explicitly `REPORTED`. It is **not** a mapped landslide scar, susceptibility model, probability surface or forecast. BIPAD does not publish a per-incident confidence class in this endpoint, so `confidence` is intentionally `null/UNKNOWN`; the atlas does not translate `verified` or `approved` into a fabricated scientific confidence score. Date and source-verification filtering are provided because those fields are actually supported.

The BIPAD API documentation does not publish a standalone redistribution licence. This limitation is carried into release metadata and should be re-audited before external redistribution of cached data.
