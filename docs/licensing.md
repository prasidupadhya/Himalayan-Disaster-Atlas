# Licensing and redistribution audit — 9 September 2026

Original Atlas software/documentation are MIT at the owner's request. The root LICENSE explicitly operates alongside, not instead of, upstream data and software terms. `/licenses/` exposes the review for every retained release, including old versions and fixtures, provider links, obligations, source notices and parent relationships. Sources/Catalog retain exact attribution and processing history; a visible credit beneath the map identifies OSM and links all source licences independently of the collapsed info control.

## Dataset findings

`licensing/datasets.json` covers 55 source/derived manifests plus the provenance catalog. Its complete public-tree hash also covers auxiliary files, raster tiles, licence notices, search shards and the OSM infrastructure QA file. No release bytes are modified. Every version/manifest hash must match, parent lists must match provenance, and missing/cyclic parents fail. New/changed bytes require a reviewed ledger update. Schema/geometry/hash validation remains in the independent root data gate.

| Source family | Audit finding and obligations |
| --- | --- |
| Nepal COD-AB / HDX | Recorded CC BY 3.0 IGO. Retain Survey Department, UN/OCHA/HDX credits, licence link and simplification notice; preserve source boundary limitations. The current HDX webpage returned 403 during this audit; pinned acquisition metadata remains the provider-specific evidence. |
| GeoNames | CC BY as stated on the provider export page; releases record CC BY 4.0. Preserve GeoNames credit and modifications. Use the offline download, not visitor-time web-service quota. |
| FAO Rivers 2026 / HydroRIVERS | The exact FAO product page declares CC BY 4.0. Preserve FAO, HydroSHEDS/HydroRIVERS and underlying contributor credits. |
| RGI 7 / GLIMS and Glacial Lake Observatory 1.02 | Releases record CC BY 4.0. Preserve consortium/creator and dataset DOI citations, source dates and repair/processing notices. The GLO DOI fetch did not resolve in this audit; the pinned acquisition metadata supplies the recorded licence. |
| OSM facilities, roads, schools, settlements and hydropower | ODbL 1.0. These adapted databases remain ODbL and their complete published data are linked through Catalog. Preserve © OpenStreetMap contributors. Do not infer that an MIT code licence covers data. Combined databases need an explicit share-alike compatibility review. |
| USGS earthquakes | Public USGS earthquake data; retain requested USGS credit and source record references. The data-licensing page was bot-protected during this audit; release metadata records the provider public-domain/CC0 guidance. No imagery or unrelated third-party USGS material is included. |
| NASA POWER climate | NASA open-data policy; preserve NASA POWER/MERRA-2 acknowledgement and derived processing context. No authenticated/runtime POWER service dependency. |
| Copernicus Sentinel imagery and water change | Sentinel legal notice permits distribution and modification; retain dated modified-data attribution, service source and release LICENSE.txt. |
| Copernicus WorldDEM-90 terrain | Preserve the complete DLR/Airbus/EU/ESA attribution and liability notice, GLO-90 licence link and processing description. Not a blanket licence for other commercial DEMs. |
| Mapzen regional context | Preserve the full source-specific LICENSE.txt inventory and conversion notice, including USGS/NOAA and applicable regional credits. No live Mapzen service or service key. |
| BIPAD events, floods, landslides, rainfall and hydrology | **REVIEW REQUIRED.** A public endpoint is not an established redistribution grant. Obtain NDRRMA/BIPAD permission or applicable terms for the exact datasets and intended static distribution. |
| WorldPop constrained R2025A | **REVIEW REQUIRED.** Source GeoTIFF declares CC BY 4.0, but the product page also applies ODbL to some building-derived products. Resolve applicability for this release and its exposure derivatives. |
| Mixed-parent Atlas analyses, discovery and evidence products | **REVIEW REQUIRED.** Preserve every parent condition and document any ODbL obligations for combined databases. An index, excerpt or model result does not automatically escape upstream obligations. Parent blockers propagate transitively. |
| River-only scenario outputs | Permitted with FAO CC BY attribution: both exact input partitions have the same licence, and these two versions have no ODbL or unresolved parent. Preserve hypothetical model/processing labels. |
| Synthetic fixture and provenance catalog | Explicit fixture CC0 and original Atlas metadata respectively; neither grants rights to upstream data. |

There are currently **19 release-level publication blockers**. The audit is deliberately not a claim of complete legal clearance. `npm run licenses:check` passes when the ledger is complete, even with explicit unresolved entries; `npm run release:check` fails when any publication review is unresolved or prohibited. Wrangler's build hook invokes that release gate for both deploy and version upload. No bypass environment variable is implemented. Resolve rights with documented evidence, or create a separately validated reduced export that excludes unresolved artifacts and all derived content. Simply disabling a map toggle is insufficient.

## Software audit

`licensing/software-policy.json` allowlists the existing npm licence expressions; new expressions fail review. `prepare-software-notices.mjs` emits the full installed licence/notice files, bundled Next dependency notices, package identities/versions and original MIT notice into `/legal/`. Missing non-optional installations fail. A platform-specific optional package not installed is still represented in the lock inventory; it is not part of the website.

MIT/ISC/BSD/Apache and equivalent permissive licences retain their notices. CC BY caniuse-lite retains its attribution/licence. MPL axe-core is unmodified test tooling. Sharp/libvips LGPL components are build-only native image tooling; no native libraries, Python binaries or node_modules are permitted in the static export. These tools are not relicensed; shipping a server/container or modified LGPL/MPL component requires a new distribution review. Next's bundled third-party notice files are included because npm lock metadata alone does not enumerate bundled components.

`licensing/python-inventory.json` records the exact locked offline tools and installed distribution licence metadata. Its requirements hash must match. Python tooling (including NumPy, Shapely/GEOS and Rasterio/GDAL native components) runs offline and is not redistributed in the static website. Source wheels/containers would require their own complete native-library notices; this audit does not authorize such distribution.

The ledger is a documented engineering review of declared terms, not a legal opinion. Provider licence/terms changes or new data use require renewed review. No emails or permission requests have been sent on the owner's behalf.

## Official references

- [GeoNames export terms](https://www.geonames.org/export/), [FAO Rivers 2026](https://data.fao.org/catalog/dataset/e22667af-3977-4e9f-b58b-67fb91b0fa87), [RGI citation](https://www.glims.org/RGI/).
- [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/), [CC BY 3.0 IGO](https://creativecommons.org/licenses/by/3.0/igo/legalcode), [OSM copyright](https://www.openstreetmap.org/copyright), [ODbL](https://opendatacommons.org/licenses/odbl/1-0/).
- [WorldPop exact product and conditional terms](https://hub.worldpop.org/geodata/summary?id=74559), [BIPAD API documentation](https://bipadportal.gov.np/api/).
- [NASA data use guidance](https://www.earthdata.nasa.gov/engage/open-data-services-software-policies/data-use-guidance), [Sentinel legal notice](https://cds.climate.copernicus.eu/licences/ec-sentinel), [Copernicus DEM provider/licence links](https://registry.opendata.aws/copernicus-dem/), [Mapzen source notices](https://github.com/tilezen/joerd/blob/master/docs/attribution.md).
