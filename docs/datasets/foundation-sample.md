# Foundation synthetic points, v1.0.0

Purpose: exercise acquisition, cleaning, normalization, schema and spatial validation, immutable versioning, checksum verification, map rendering and evidence display without relying on production inventories.

Source: repository-owned `tests/fixtures/sample-source.csv`; no external source, download, account or credential. The original CSV is copied to a content-addressed ignored raw file. The recipe's release timestamp is fixed at 2026-09-06T00:00:00Z; this is not an observation time. No real observations or publication date exist, so those fields are null.

License: the synthetic CSV and generated fixture artifacts are dedicated under CC0-1.0. No third-party geographic data, imagery or tiles are redistributed. The release includes an attribution string and license link. The enclosing project code is not covered by this fixture dedication.

Coverage: the bbox and three point coordinates are arbitrary test positions in a Nepal-focused viewport. They are not a Nepal boundary, monitoring stations, mountains, settlements or hazards. All names explicitly say synthetic. Heights are UNKNOWN, represented by null with a unit of metres indicating the intended measurement slot. No inferred relationship joins the points.

Reproduce with `npm run data:sample`; verify with `npm run data:validate`. The release and exact public copy carry the same SHA-256 and byte size. Re-running with identical input succeeds. Changing release content without changing its version fails. Test-only source perturbations are kept in temporary directories.
