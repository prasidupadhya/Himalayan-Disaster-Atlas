export const metadata = { title: 'Sources' };

export default function SourcesPage() {
  return <article className="page prose">
    <p className="eyebrow">Sources</p><h1>Trace every layer.</h1>

    <h2>Population</h2>
    <p>The population layer uses <a href="https://hub.worldpop.org/geodata/summary?id=74559">WorldPop Global 2015–2030 R2025A v1</a>, Nepal model year 2025, constrained population counts at 3 arc-second resolution in EPSG:4326. The exact source GeoTIFF is pinned by SHA-256 and identified by DOI <a href="https://doi.org/10.5258/SOTON/WP00839">10.5258/SOTON/WP00839</a>.</p>
    <p>The source raster declares CC BY 4.0. WorldPop also publishes an ODbL derived-data clause for some building-derived products, so that licensing nuance is retained in the release metadata for review. The 2025 values are modelled estimates rather than a census observed at each grid cell.</p>

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

    <h2>Mapping software</h2>
    <p>The interactive view uses <a href="https://maplibre.org/">MapLibre GL JS</a>. Versioned data and terrain derivatives are served locally; no third-party runtime tile or feature API is required.</p>
  </article>;
}
