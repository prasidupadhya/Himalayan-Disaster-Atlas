# Source directory conventions — feature 35

The public `/sources/` directory is generated from current production records in `atlas-provenance@1.0.0`. It therefore uses the same source name, official/acquisition URL, access date, licence, attribution, limitations and dataset/version identity that validation sees.

External providers and Atlas-derived products are deliberately separated. A Search index, Hazard Graph, exposure result or simulation is a versioned Atlas product, not a new upstream observation provider; its Data Catalog entry points to the exact parent releases that supplied evidence.

Every current production record has a stable `source_href` category. Automated tests require the public page to expose that category target so links from Data Catalog and map Evidence panels cannot silently break.

Do not publish API keys, OAuth credentials, private URLs, local filesystem paths or account configuration. Public source URLs are informational/acquisition links only. Where an official source URL is already available in release metadata, do not replace it with an unofficial mirror for convenience.

Licensing is source-specific. Derived products inherit parent obligations; the project does not erase those obligations behind one blanket project licence.
