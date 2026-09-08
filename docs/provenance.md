# Provenance conventions — feature 32

Provenance is part of the public data contract rather than optional documentation. The immutable `atlas-provenance@1.0.0` registry is rebuilt from every checked-in release manifest and fails validation when a release is missing, duplicated, silently superseded, or loses required lineage fields.

## Required lineage

Every registry record preserves a stable dataset/product ID and version, source identity and official link when supplied, licence and attribution, observation/publication/access/processing dates where applicable, processing version and method, spatial resolution and coverage, temporal coverage, limitations, uncertainty, evidence class, manifest checksum and all published artifact checksums.

`UNKNOWN / not applicable` is used when a concept has no honest value; absence is never silently replaced with a guessed date, resolution or uncertainty.

## Transformations and parents

Source datasets retain a three-stage lineage: pin/acquire the cited source, run the documented normalization/processing method, then publish a checksum-verified web artifact. Atlas-derived products additionally record exact parent releases where their contracts expose them. Search, Time Machine, Hazard Graph, Exposure, scenarios and the evidence corpus therefore point back to the input release IDs/versions and manifest hashes used to create them.

When a derived dataset is built directly from an external source rather than another Atlas release, the external source remains the documented parent instead of inventing an internal dataset relationship.

## Evidence labels

The registry supports `observed`, `historical`, `derived`, `estimated`, `modelled`, `simulated` and `unknown`. These labels describe the evidence/product class; they are not confidence scores. Simulation results remain explicitly `simulated` even when their underlying river geometry is source-derived.

## Superseded releases

Older checked-in versions remain visible and are marked `superseded`; they are not silently deleted from lineage. Synthetic development fixtures are marked `fixture` and excluded from current-production catalog defaults.

## UI

Map-layer Evidence panels expose source, dates, version, resolution, coverage, evidence class, processing method, uncertainty, limitations and licence/attribution in context. They link into the Data Catalog, Source Directory and Methodology so the same metadata can be inspected at progressively deeper levels.
