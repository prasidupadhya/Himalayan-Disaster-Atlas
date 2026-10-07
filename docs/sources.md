# Source directory conventions — feature 35

The public `/sources/` directory is generated from current production records in `atlas-provenance@1.2.0`. It therefore uses the same source name, official/acquisition URL, access date, licence, attribution, limitations and dataset/version identity that validation sees.

External providers and Atlas-derived products are deliberately separated. A Search index, Hazard Graph, exposure result or simulation is a versioned Atlas product, not a new upstream observation provider; its Data Catalog entry points to the exact parent releases that supplied evidence.

Every current production record has a stable `source_href` category. Automated tests require the public page to expose that category target so links from Data Catalog and map Evidence panels cannot silently break.

Do not publish API keys, OAuth credentials, private URLs, local filesystem paths or account configuration. Public source URLs are informational/acquisition links only. Where an official source URL is already available in release metadata, do not replace it with an unofficial mirror for convenience.

Licensing is source-specific. Derived products inherit parent obligations; the project does not erase those obligations behind one blanket project licence.

Feature 42 adds `/sources/#live-contracts` for original MIT contract fixtures, separate from current production data. No real feeds are fetched. It links official DHM/NDRRMA/BIPAD authorities and explains conditional providers remain disabled. Future acquisition must register exact sources and terms; no upstream rights are granted. See [Feature 42](live-contracts.md).

Feature 43 documents USGS preferred-network summaries and NOAA GFS APCP separately from their original MIT publication-policy metadata. No DHM/BIPAD acquisition or blanket contributor licence is inferred. Every imported live snapshot carries source and review links; the Catalog delivery inspector reads only static verified bytes. See [source evaluation](live-open-feeds.md).

Feature 45 adds the conditional OpenAQ source-policy section. The API and each upstream provider retain independent terms. No provider is allowlisted, no public station reading is acquired, and credentials stay in Actions secrets. See [Feature 45](live-air-quality.md).

Feature 46 adds no source. The `/live/` page links DHM, NDRRMA and BIPAD as the authorities and shows each verified snapshot's own source, licence and attribution. See [Feature 46](live-conditions.md).


Feature 47 adds no source. Offline copies are byte-identical, checksum-verified copies of the published snapshots, with their original source and licence. See [Feature 47](offline-shell.md).
