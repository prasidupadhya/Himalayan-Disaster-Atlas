# Location Explorer

Feature 24 provides deterministic, read-only spatial context for a selected coordinate in Nepal. It is available in the Atlas by map click or by a keyboard-accessible longitude/latitude form.

## Spatial semantics

Administrative context uses point-in-polygon containment against the validated COD-AB v02 geometry. Nearby vector relationships use minimum distance to the published feature geometry, not distance to a rendered symbol or the current viewport. Ties are resolved by stable dataset/entity key, so hidden layers and map zoom never change the result.

Default proximity rules are inclusive and capped: rivers 3 within 10 km; glaciers 5 within 25 km; glacial lakes 5 within 25 km; hydropower 5 within 25 km; infrastructure 5 within 10 km; earthquake epicenters 10 within 50 km; reported floods, reported landslides and historical events 10 within 25 km. These are user-interface proximity thresholds only. They do not imply connection, causation, exposure, impact, susceptibility, hazard or risk.

Each result keeps its dataset ID, version, source/stable ID and source date. Missing categories are reported as unavailable instead of as geographic absence. The explorer blocks location interpretation outside the published Nepal country boundary. Source notes remain linked from every detailed proximity result; BIPAD historical events also link directly to their Feature 23 event page.

## Elevation and population

Elevation is sampled from the checksum-verified Copernicus GLO-90 terrain tiles and is independent of 3D display exaggeration.

The WorldPop web tiles are explicitly display-only, log-scaled intensity. Feature 24 therefore does **not** sample them as a people count. Until a separate numerical lookup artifact is published from the pinned native WorldPop raster, point population remains `UNAVAILABLE` rather than being fabricated from display pixels.

## Data loading

The explorer is opt-in because it needs several already published local datasets, including the partitioned historical-event archive. All visitor-time requests remain versioned local files; there are no third-party runtime APIs or credentials. Partial source failures are named while successfully validated categories remain usable.
