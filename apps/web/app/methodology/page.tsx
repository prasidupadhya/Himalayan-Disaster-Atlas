export const metadata = { title: 'Methodology' };

export default function MethodologyPage() {
  return <article className="page prose">
    <p className="eyebrow">Methodology</p><h1>Evidence before interpretation.</h1>
    <p>Every published dataset carries its source, version, dates, license, processing method, coverage, limitations, and uncertainty. Missing measurements remain UNKNOWN.</p>

    <h2>Population preparation</h2>
    <p>The Atlas pins the WorldPop Nepal 2025 R2025A v1 constrained Float32 GeoTIFF by SHA-256 and validates its EPSG:4326 CRS, 9,773 × 4,921 dimensions, 3 arc-second cell spacing, <code>-99999</code> NoData value, finite non-negative valid cells, and source raster bounds. Valid zero population cells remain distinct from NoData.</p>
    <p>The native source raster remains the numerical analysis input. A separate EPSG:3857 zoom 5–10 PNG pyramid is generated only for visualization using bilinear reprojection and a log-scaled intensity transform. Display pixels therefore cannot be sampled or summed as population counts. The national source-cell sum is retained as an integrity check, not presented as a census total or an administrative validation target.</p>
    <p>Future exposure calculations must use the pinned native people-per-grid-cell raster and explicitly define raster/vector alignment, NoData handling and partial-cell weighting. The current layer performs no hazard exposure estimate.</p>

    <h2>Satellite observation preparation</h2>
    <p>The Atlas uses three fixed Sentinel-2 Collection-1 Level-2A observations selected from 1 April through 15 June 2026 as separate western, central and eastern context windows. Candidate scenes must have source cloud cover at or below 5% and zero Scene Classification Layer NoData. The selected 10 m true-colour COG and 20 m SCL objects are pinned by exact URL, ETag and byte size before they are read; a changed upstream object fails the build instead of silently replacing a release input.</p>
    <p>The SCL is independently counted for cloud classes 8, 9 and 10, NoData class 0 and snow/ice class 11. A 768 × 768 RGB preview is then produced from each full-resolution TCI by bilinear resampling and checksum-verified in the browser before display. The preview does not retain 10 m analytical resolution. Clouds, shadows, snow and visual differences between observation dates remain image content only: this feature performs no water classification, land classification or change detection.</p>
    <p>The three scenes have different acquisition timestamps and disjoint/overlapping footprints, so they are deliberately presented as observation windows rather than a seamless or single-date Nepal mosaic. Areas outside those footprints are unavailable, not filled from another source.</p>

    <h2>Climate preparation</h2>
    <p>The Atlas acquires NASA POWER monthly <code>T2M</code> and <code>PRECTOTCORR</code> for 1991–2020 from the source-native MERRA-2 grid. The API reports 0.5° latitude × 0.625° longitude spacing, UTC monthly periods, temperature in degrees Celsius and corrected precipitation as a mean daily rate in mm/day. POWER annual fields are deliberately excluded; no daily or station-level precision is reconstructed from monthly data.</p>
    <p>For each of the 360 months, every POWER grid box intersecting Nepal is overlaid with the pinned, unsimplified COD-AB v02 national boundary. Intersection pieces are transformed to equal-area EPSG:6933, and valid grid values are weighted by the Nepal area inside each cell. The release uses 66 contributing grid cells and requires complete valid-area coverage; every published month has 100% coverage. This produces a Nepal-wide national summary, not a local interpolation or a new climate raster.</p>
    <p>The 12 displayed 1991–2020 monthly normals are arithmetic means of the 30 area-weighted values for each calendar month. The accompanying minimum and maximum are the range of those 30 monthly reanalysis values and show historical reanalysis variability only; they are not confidence intervals or measurement uncertainty. MERRA-2 assimilation, model physics, topographic representation and POWER processing limitations remain applicable. The baseline is historical context, not a forecast or current-condition estimate.</p>

    <h2 id="exposure-method">Exposure engine</h2>
    <p>Exposure means a spatial intersection with an explicit footprint. It does not establish vulnerability, risk, confirmed damage or losses. The prepared corridors are hypothetical areas of interest around one retained downstream trace, with assumed widths of 250 m and 1,000 m each side. They are not flood simulations.</p>
    <p>The offline engine accepts versioned, valid Polygon or MultiPolygon footprints in OGC:CRS84 within the Nepal region. Event points and bare river lines are not exposure areas. It overlays the pinned native WorldPop 2025 GeoTIFF, never the population display tiles. For each valid source cell, its population is multiplied by the intersected fraction of cell area in equal-area EPSG:6933, then summed. This assumes uniform population within a cell. Native resolution is preserved and results are rounded to people for display.</p>
    <p>NoData and out-of-grid areas remain UNKNOWN. A known-cell subtotal is shown separately, and any unknown area makes the whole-footprint population estimate UNKNOWN. No uncertainty interval is invented. OSM geometry intersection counts mapped points, lines and polygons, including boundary contact; polygons count as whole assets. Shared OSM IDs are deduplicated, while road and bridge representations are tested separately. Buildings and dams have no inventory in this calculation.</p>
    <p>District area pieces are made disjoint in P-code order, with unassigned coverage retained. Each matched asset is assigned to the greatest intersected district area or length, with lowest P-code breaking ties. Category counts can overlap and must not be added as a unique total. Source geometry simplification, representative facility centres, mapping completeness and differing source dates limit interpretation.</p>
    <p>Calculations run offline to avoid national raster processing in a visitor’s browser. Downloaded result JSON, footprint requests and spatial layers record source versions/hashes, calculation timestamp, method version, CRS, assumptions and limitations. A new footprint is computed through the offline pipeline and published as a new immutable result before it is registered in the viewer.</p>

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
    <p>No operational forecast, hazard classification, confirmed-damage estimate or risk score is included in this release. The exposure engine reports explicitly hypothetical spatial intersections, while source-reported areas, satellite imagery and change statistics remain descriptive evidence rather than predictions or impact claims.</p>
  </article>;
}
