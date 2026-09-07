export const metadata = { title: 'Methodology' };

export default function MethodologyPage() {
  return <article className="page prose">
    <p className="eyebrow">Methodology</p><h1>Evidence before interpretation.</h1>
    <p>Every published dataset carries its source, version, dates, license, processing method, coverage, limitations, and uncertainty. Missing measurements remain UNKNOWN.</p>

    <h2>Population preparation</h2>
    <p>The Atlas pins the WorldPop Nepal 2025 R2025A v1 constrained Float32 GeoTIFF by SHA-256 and validates its EPSG:4326 CRS, 9,773 × 4,921 dimensions, 3 arc-second cell spacing, <code>-99999</code> NoData value, finite non-negative valid cells, and source raster bounds. Valid zero population cells remain distinct from NoData.</p>
    <p>The native source raster remains the numerical analysis input. A separate EPSG:3857 zoom 5–10 PNG pyramid is generated only for visualization using bilinear reprojection and a log-scaled intensity transform. Display pixels therefore cannot be sampled or summed as population counts. The national source-cell sum is retained as an integrity check, not presented as a census total or an administrative validation target.</p>
    <p>Future exposure calculations must use the pinned native people-per-grid-cell raster and explicitly define raster/vector alignment, NoData handling and partial-cell weighting. The current layer performs no hazard exposure estimate.</p>

    <h2 id="downstream-method">Downstream trace</h2>
    <p>The Atlas combines both verified Nepal river partitions and follows HYRIV_ID / NEXT_DOWN pointers from a selected whole reach. Duplicate IDs, inconsistent internal links, invalid lengths and cycles prevent tracing. Each retained reach is counted once, and LENGTH_KM values are summed in kilometres. The first downstream ID outside this release ends the trace with a coverage-boundary notice; an absent source connection is labelled a source outlet.</p>
    <p>Results are ATLAS DERIVED network analyses. Gold lines and playback show reach order, not a flood footprint, flow velocity or travel time. The selected reach is included in full, irrespective of where it was clicked. Source geometry is unchanged, with no inferred connections across gaps. The downloaded JSON records method version, ordered reach IDs, termination, source versions, hashes and limitations.</p>
    <p>Lake/glacier outlet links and settlement, infrastructure and population intersections remain UNKNOWN. A shared basin or nearby river is insufficient to establish an outlet connection. No terrain-flow or hydraulic model is used. See the <a href="https://data.hydrosheds.org/file/technical-documentation/HydroRIVERS_TechDoc_v10.pdf">HydroRIVERS attribute definitions</a>.</p>

    <h2>Glacial-lake preparation</h2>
    <p>The Atlas pins the GLO v1.02 Sentinel-2 unique-lake centroid and polygon-attribute GeoPackages by SHA-256 and joins them by stable GLO_ID. The EPSG:4326 source centroids are used directly for browser geometry, while source equal-area polygon area/perimeter attributes are retained without reprojecting those polygons.</p>
    <p>AREA_DISSOLVED is the source dissolved maximum mapped extent across 2017–2024, not a current lake-area measurement. Expansion rate, uncertainty and significance are source time-series/statistical fields and are never converted into a hazard class. Specific glacier and river links remain UNKNOWN because this source layer does not identify them.</p>

    <h2>Glacier inventory preparation</h2>
    <p>The Atlas pins RGI 7.0 South Asia West and South Asia East WFS subsets by SHA-256, selects complete glacier features intersecting the validated Nepal country polygon, and retains stable RGI/GLIMS IDs, source area, source outline date and RGI elevation attributes.</p>
    <p>Some GLIMS WFS display geometries are invalid after its coordinate transformation. Only the browser geometry is repaired with make_valid and topology-preserving simplification; source RGI area remains the measurement. QA records every repair, and the UI labels every outline as a dated inventory record rather than a current margin.</p>

    <h2>River network preparation</h2>
    <p>The Atlas selects every FAO Rivers 2026 reach whose complete source geometry intersects Nepal. It does not clip or simplify the network. HYRIV_ID and NEXT_DOWN are retained so later downstream analysis can follow source topology, including links crossing the two browser-delivery partitions.</p>
    <p>The partitions exist only to keep decoded GeoJSON under 8 MiB. Average discharge and flow-regime attributes are long-term/source descriptors, not live hydrological observations.</p>

    <h2>Mountain catalogue preparation</h2>
    <p>The atlas pins the GeoNames Nepal country dump by SHA-256, selects only terrain feature codes PK and MT, retains stable GeoNames IDs, source coordinates, explicit source elevations, names and bounded aliases, and rejects duplicate IDs or implausible coordinates/elevations. The GeoNames DEM fallback is deliberately not substituted for a missing summit elevation.</p>

    <h2>Infrastructure preparation</h2>
    <p>The Atlas pins one build-time OpenStreetMap snapshot for bridge/facility/settlement positions and five smaller major-road geometry slices by SHA-256. The road slices are merged by stable OSM way ID; repeated slice occurrences are removed without geographic/name heuristics. Every retained point is inside the unsimplified Nepal COD-AB v02 country polygon, and road ways are intersected with that polygon before browser simplification.</p>
    <p>Major roads retain source way geometry but use a topology-preserving 0.0002° display simplification. School, health, emergency and bridge ways/relations are represented by source-provided Overpass centres for browser exploration; those points do not replace source OSM geometry for future precise analysis. Buildings are deliberately omitted because uneven national OSM completeness would make exposure counts misleading. Inventory presence is not an exposure, vulnerability, damage or risk result.</p>

    <h2>Administrative boundary preparation</h2>
    <p>The atlas pins the Nepal COD-AB v02 source archive by SHA-256. The offline pipeline checks the expected 1 country, 7 provinces, 77 districts, and 775 level-3 pieces; unique P-codes; closed and valid Polygon or MultiPolygon geometry; parent containment; neighboring units; and complete Nepal coverage without unexplained gaps or overlaps.</p>
    <p>Level 3 includes 753 local-government units and 22 protected or special-area pieces. The atlas retains both categories because together they cover Nepal. Ward boundaries are unavailable in this release.</p>

    <h2>Display and analysis geometry</h2>
    <p>The source uses OGC:CRS84 longitude and latitude. Administrative web geometry is simplified as a shared coverage so neighboring edges remain aligned, then compressed for delivery. It supports identification and display only. Pinned unsimplified/raw sources remain outside the browser for future analysis where licensing permits.</p>

    <h2>Keep the distinctions visible</h2>
    <dl><dt>Observed</dt><dd>Measurements or records supplied by a documented source.</dd><dt>Derived</dt><dd>Products calculated from source data, with the method recorded.</dd><dt>Modelled</dt><dd>Outputs of a computational model. Hypothetical simulations are not forecasts.</dd><dt>Unknown</dt><dd>Reliable information is unavailable.</dd></dl>

    <h2>Terrain preparation</h2>
    <p>Copernicus GLO-90 native Float32 rasters are retained at their original 3 arc-second sample spacing and aligned in an offline analysis mosaic without resampling. The source is a surface model, including buildings and vegetation, with EGM2008 heights in metres.</p>
    <p>Web display uses bilinear reprojection to aligned Web Mercator grids and Terrain RGB tiles at zooms 5–9. Each tile is checked against its recorded SHA-256 before rendering. Finest display spacing is roughly 270 m near Nepal; encoding in 0.1 m increments is not an accuracy claim. Elevation inspection always samples that finest display grid, independently of map zoom and visual exaggeration. Hillshade is a derived lighting effect, not an observation or slope analysis.</p>
    <p>A full rectangular tile domain surrounding Nepal prevents artificial zero-height seams at national borders. Regional plausibility probes are checked near Everest, Kathmandu and Biratnagar; they do not substitute for survey validation. No hydrological conditioning or bare-earth correction is performed.</p>

    <h2>Regional overview</h2>
    <p>A pinned Mapzen terrain pyramid fills the Asia overview. Its source heights are not normalized to the Copernicus vertical datum and are not used for measurement. Negative heights are displayed as sea surface. In the context buffer outside Nepal, display heights transition over one degree between the detailed tile domain and the coarse backdrop; interpolation operates on decoded heights, never on RGB colour channels. Copernicus elevation inspection reads the original verified tiles.</p>

    <h2>Research boundary</h2>
    <p>No hazard classification, exposure estimate, scenario engine, or forecast is included in this release. Source-reported areas and change statistics remain descriptive attributes and are not transformed into predictions or impact claims.</p>
  </article>;
}
