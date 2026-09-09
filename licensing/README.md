# Scope of the software licence

The root MIT licence applies to original Atlas software and original documentation. It does not relicense upstream data, imagery, third-party code, source-document excerpts or trademarks. Dataset terms and notices apply separately, including to derived databases. Synthetic fixture releases keep their declared CC0 terms.

`datasets.json` is a version-and-manifest-hash-pinned review ledger. `PERMITTED` means the documented use is permitted subject to its listed obligations; it is not an unconditional legal guarantee. `REVIEW_REQUIRED` prevents deployment. A derived release inherits any blocked parent. New versions, changed hashes, unregistered manifests or missing reviews fail closed. The provenance catalog itself describes these sources and does not confer rights over their data.

Do not change a status just to make a build green. Resolve it using source-specific redistribution evidence, record the decision and obligations in a reviewed commit, and republish changed data as a new immutable version. An alternative is a separately tested export that removes both unresolved data and all dependent records/artifacts; hiding a layer in the UI is insufficient.

No existing source release is rewritten by this audit. Local `npm run build` remains a research preview; `npm run release:check` is the publication gate.
