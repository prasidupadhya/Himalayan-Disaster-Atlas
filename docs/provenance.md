# Provenance conventions — feature 32

Provenance is part of the public data contract rather than optional documentation. The active immutable registry is `atlas-provenance@1.2.0`, derived from every checked-in release manifest. Earlier catalogs remain immutable. Validation rejects missing, duplicated, silently superseded or incomplete lineage; generation requires a version bump instead of overwriting conflicting bytes.

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

Feature 42 adds `atlas-live-contracts@1.0.0` as a fixture with unknown evidence, no geographic data, fixed synthetic timestamps, an original MIT licence and no upstream parents. The new catalog preserves every 1.1.0 record unchanged. Live contracts separately support reported/hypothetical evidence; historical release records are not relabelled. See [Live contracts](live-contracts.md).

Feature 43 registers original open-feed policy metadata in `atlas-provenance@1.3.0`. Actual periodically updated releases live in a separate immutable data branch; each snapshot has a manifest with raw source revision/hash, request, processing version, exact source review and artifact checksum. The mutable latest index is never treated as immutable. See [live publication](live-open-feeds.md).

Feature 45 registers original air-quality policy metadata and provenance catalog `atlas-provenance@1.4.0`. Earlier catalogs remain immutable. No OpenAQ/provider reading is registered for public delivery or granted rights. See [conditional provider review](live-air-quality.md).

Feature 46 registers the original bilingual presentation policy `atlas-live-conditions@1.0.0` and provenance catalog `atlas-provenance@1.5.0`. Earlier catalogs remain immutable. See [live conditions](live-conditions.md).


Feature 47 registers the original offline cache policy `atlas-live-offline-shell@1.0.0` and provenance catalog `atlas-provenance@1.6.0`. Earlier catalogs remain immutable. See [offline shell](offline-shell.md).

## Provenance 1.7.0

Adds records for `nepal-hrsl-population@1.0.0`, `atlas-flood-corridors@1.0.0` and `atlas-gmpe-bssa14@1.0.0`. For model releases, parents are taken from the manifest `inputs` (registered releases by manifest hash; external sources by their pinned file hash).
