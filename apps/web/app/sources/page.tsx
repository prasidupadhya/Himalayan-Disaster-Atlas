export const metadata = { title: 'Sources' };

export default function SourcesPage() {
  return <article className="page prose">
    <p className="eyebrow">Sources</p><h1>Trace every layer.</h1>

    <h2>Population</h2>
    <p>The population layer uses <a href="https://hub.worldpop.org/geodata/summary?id=74559">WorldPop Global 2015–2030 R2025A v1</a>, Nepal model year 2025, constrained population counts at 3 arc-second resolution in EPSG:4326. The exact source GeoTIFF is pinned by SHA-256 and identified by DOI <a href="https://doi.org/10.5258/SOTON/WP00839">10.5258/SOTON/WP00839</a>.</p>
    <p>The source raster declares CC BY 4.0. WorldPop also publishes an ODbL derived-data clause for some building-derived products, so that licensing nuance is retained in the release metadata for review. The 2025 values are modelled estimates rather than a census observed at each grid cell.</p>

    <h2>Satellite observations</h2>
    <p>The satellite feature uses <a href="https://earth-search.aws.element84.com/v1/collections/sentinel-2-c1-l2a">Copernicus Sentinel-2 Collection-1 Level-2A</a> scenes distributed as public Cloud Optimized GeoTIFFs through Element 84 Earth Search/AWS. The official Level-2A product citation is DOI <a href="https://doi.org/10.5270/S2_-znk9xsj">10.5270/S2_-znk9xsj</a>. The release pins each selected true-colour and Scene Classification Layer object by exact URL and HTTP object identity metadata before preprocessing.</p>
    <p>Use and redistribution follow the <a href="https://cds.climate.copernicus.eu/licences/ec-sentinel">Copernicus Sentinel Data Legal Notice</a>. The Atlas previews are modified data and carry the required notice “Contains modified Copernicus Sentinel data 2026.” Element 84 is the distribution/catalog provider, not the satellite data producer.</p>

    <h2>Climate context</h2>
    <p>The climate feature uses the public, unauthenticated <a href="https://power.larc.nasa.gov/docs/services/api/temporal/monthly/">NASA POWER Monthly and Annual API</a>, API version 2.9.8 in this release. The source reports MERRA-2 meteorology on its native 0.5° latitude × 0.625° longitude grid. The Atlas requests monthly 2 m air temperature (<code>T2M</code>, °C) and corrected precipitation rate (<code>PRECTOTCORR</code>, mm/day) for 1991–2020 and retains those units.</p>
    <p>POWER values are reanalysis-derived grid-box products, not station observations. The release records the exact public query URLs and SHA-256 hashes of canonicalized source payloads, excluding only response-timing fields that change between identical requests. NASA <a href="https://www.earthdata.nasa.gov/engage/open-data-services-software/data-use-policy">Earth Science data-use guidance</a> and <a href="https://power.larc.nasa.gov/docs/referencing/">POWER referencing guidance</a> apply. The 1991–2020 period is used as the complete baseline for the displayed monthly normals.</p>

    <h2>Exposure calculations</h2>
    <p>Exposure results combine the existing WorldPop 2025 R2025A v1 native population grid, OpenStreetMap infrastructure and hydropower inventories, and COD-AB v02 district boundaries. Prepared footprint requests document their hypothetical buffer assumptions and the exact HydroRIVERS release hashes. They are derived estimates, not an additional observed hazard dataset. Input source/licence notices remain applicable, including WorldPop’s documented licensing nuance and OSM ODbL requirements.</p>

    <h2>Downstream connectivity</h2>
    <p>Downstream trace reuses both pinned FAO Rivers 2026 / HydroRIVERS Nepal partitions, version 1.0.0. It introduces no new geographic source. <a href="https://data.hydrosheds.org/file/technical-documentation/HydroRIVERS_TechDoc_v10.pdf">HydroRIVERS technical documentation</a> defines NEXT_DOWN and LENGTH_KM. Per-result input hashes identify the exact releases; the source river evidence and licensing remain applicable.</p>

    <h2>Glacial lakes</h2>
    <p>The glacial-lake layer uses <a href="https://doi.org/10.5281/zenodo.19370146">Glacial Lake Observatory v1.02</a>, a Sentinel-2-derived inventory of glacial lakes in Nepal and transboundary catchments for 2017–2024, released under <a href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a>.</p>
    <p>The Atlas joins the source unique-lake centroid and polygon-attribute tables by stable GLO_ID. Published centroid points are rendered directly; source dissolved area/perimeter and expansion statistics are retained without reprojecting or fabricating polygons. GLO glacier-fed/non-glacier-fed connectivity does not identify a specific RGI glacier, and no hazard class is inferred.</p>

    <h2>Glaciers</h2>
    <p>The glacier layer uses <a href="https://www.glims.org/rgi_user_guide/">Randolph Glacier Inventory 7.0</a> South Asia West and South Asia East records distributed through GLIMS under <a href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a>. Stable RGI/GLIMS IDs, source area, individual source dates and RGI topographic attributes are retained.</p>
    <p>RGI 7.0 targets approximately the year 2000. Nepal-intersecting source dates in this release span 1992–2010, so these outlines are inventory observations rather than current 2026 glacier margins.</p>

    <h2>Rivers</h2>
    <p>The river layer uses <a href="https://data.fao.org/catalog/dataset/e22667af-3977-4e9f-b58b-67fb91b0fa87">FAO AQUASTAT Rivers, Global edition 2026</a>, derived from HydroRIVERS/HydroSHEDS and distributed under <a href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a>. Stable HYRIV_ID, NEXT_DOWN, MAIN_RIV, flow order, drainage-area, discharge and HydroBASINS identifiers are retained.</p>
    <p>The source does not provide river names for these reaches. Average discharge and perennial/intermittent classes are dataset descriptors, not live gauge observations, and mapped lines are not guaranteed present-day wetted channels.</p>

    <h2>Mountains and peaks</h2>
    <p>The mountain catalogue uses the <a href="https://www.geonames.org/export/">GeoNames Nepal country dump</a> snapshot downloaded on 2026-09-07 under <a href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a>. Only PK and MT terrain records are published; ranges are excluded. GeoNames IDs remain canonical and missing source elevations are not replaced with DEM estimates.</p>

    <h2>Infrastructure</h2>
    <p>The infrastructure layer uses build-time <a href="https://www.openstreetmap.org/">OpenStreetMap</a> extracts retrieved through Overpass and distributed under the <a href="https://opendatacommons.org/licenses/odbl/1-0/">ODbL 1.0</a>. Visitors never query Overpass. Stable node/way/relation IDs and source timestamps are retained, and all published records are filtered or clipped against the pinned Nepal COD-AB v02 country polygon because the acquisition bounding box includes neighboring territory.</p>
    <p>Roads are restricted to motorway, trunk, primary and corresponding link classes; bridges are restricted to bridge-tagged motorway through tertiary roads. Schools, health facilities, emergency facilities and settlements use source node positions or Overpass-provided way/relation centres. OpenStreetMap completeness varies, so absence from the inventory is not evidence that an asset is absent on the ground.</p>

    <h2>Nepal administrative boundaries</h2>
    <p>The atlas uses <a href="https://data.humdata.org/dataset/cod-ab-npl">Nepal COD-AB v02</a>, sourced from the Survey Department of Nepal and the UN Resident Coordinator’s Office in Nepal, with quality assurance by OCHA Field Information Services and publication through the Humanitarian Data Exchange.</p>
    <dl><dt>Source release</dt><dd>COD-AB v02</dd><dt>Created by source</dt><dd>2024-01-01</dd><dt>Valid for humanitarian use</dt><dd>2024-03-14</dd><dt>Atlas retrieval</dt><dd>2026-09-07</dd><dt>License</dt><dd><a href="https://creativecommons.org/licenses/by/3.0/igo/legalcode">CC BY 3.0 IGO</a></dd></dl>
    <p>The source does not publish a positional-accuracy value. Boundaries may not reflect later legal or cartographic changes, ward boundaries are absent, and the international-boundary representation does not settle disputed claims.</p>

    <h2>Foundation development fixture</h2>
    <p>The earlier synthetic sample remains in the repository for contract and pipeline tests. It represents no real place or hazard and is dedicated under <a href="https://creativecommons.org/publicdomain/zero/1.0/">CC0 1.0</a>.</p>

    <h2>Terrain</h2>
    <p><a href="https://registry.opendata.aws/copernicus-dem/">Copernicus DEM GLO-90, 2021 release</a> supplies the terrain surface through its public AWS COG distribution. Native rasters use EPSG:4326 with EGM2008 vertical heights. Individual source files, acquisition timestamps, hashes, transforms and ranges appear in the <a href="/data/nepal-terrain/1.0.0/sources.json">source inventory</a>.</p>
    <p>Redistribution and adaptation follow the <a href="https://dataspace.copernicus.eu/sites/default/files/media/files/2025-06/copernicus_contributing_mission_data_access_v2_cop_dem_licenses.pdf">Copernicus WorldDEM-90 licence</a>. See the <a href="/data/nepal-terrain/1.0.0/LICENSE.txt">required attribution and liability notices</a>. This atlas is not endorsed by Copernicus or its providers.</p>

    <h2>Asia terrain context</h2>
    <p><a href="https://registry.opendata.aws/terrain-tiles/">Mapzen Terrain Tiles</a> provide a pinned regional backdrop with source-specific vertical references and resolutions. It is used only for visual context. <a href="/data/asia-terrain-context/1.0.0/LICENSE.txt">Attribution and licence notices</a> accompany the snapshot; <a href="/data/asia-terrain-context/1.0.0/sources.json">per-tile provenance</a> records source headers and hashes.</p>

    <h2>Water Change</h2>
    <p>Contains modified Copernicus Sentinel data (2024, 2025, 2026), from Element 84 Earth Search Collection 1 L2A under the <a href="https://cds.climate.copernicus.eu/licences/ec-sentinel">Sentinel Data Legal Notice</a>. <a href="/data/phewa-water-change/1.0.0/sources.json">Pinned source windows</a> record acquisition dates, instruments, calibration, hashes and native grid. Whole-object checksums are source-declared; exact downloaded window hashes are locally verified.</p>

    <h2>Time Machine index</h2>
    <p>The <a href="/data/atlas-time-index/1.0.0/index.json">observation index</a> derives dates and reported-event counts from the versioned Sentinel, POWER and BIPAD releases already cited here. It records input hashes and preserves their source attribution and temporal precision. Publication and retrieval dates are not substituted for observation dates.</p>

    <h2>Search and comparison</h2>
    <p>The <a href="/data/atlas-search-index/1.0.0/manifest.json">global Search index</a> is an Atlas-derived discovery artifact built only from the versioned sources cited on this page. Its input manifest hashes are recorded; it adds no external gazetteer, inferred river/lake name link or unverified transliteration. Compare Mode introduces no new upstream source: after selection it reloads the exact two versioned source records and preserves their original attribution, dates, units and evidence type.</p>

    <h2>Mapping software</h2>
    <p>The interactive view uses <a href="https://maplibre.org/">MapLibre GL JS</a>. Versioned data, terrain derivatives, satellite previews and climate series are served locally; no third-party runtime tile or feature API is required.</p>
    <h2>Hazard Graph</h2><p>The relationship index derives from the versioned FAO/HydroRIVERS and hypothetical exposure releases. Each node and edge points to source record IDs and hashed input manifests, with their original attribution and licences. <a href="/data/nepal-hazard-graph/1.0.0/manifest.json">Graph release</a>.</p>
    <h2>Scenario Engine inputs</h2><p>The two hypothetical network scenarios use the checked-in FAO/HydroRIVERS partitions, preserving their versions, processing versions, hashes, attribution and CC BY 4.0 source licence. Their parameters are explicit hypothetical choices, not acquired observations. <a href="/data/scenario-pulse-40669746/1.0.0/request.json">Pulse definition and source provenance</a>.</p>
  </article>;
}
