# Mobile interaction and data-loading contract — feature 36

The mobile Atlas preserves the same scientific meanings, evidence labels and provenance as desktop. Responsive presentation must not hide limitations, convert UNKNOWN to zero, or remove “modelled / not forecast” labels merely to save space.

## Touch and layout

- Primary navigation is horizontally scrollable rather than clipped.
- Interactive controls retain at least a 44 px touch target where practical, including MapLibre zoom controls.
- Form controls use a 16 px mobile font size to avoid browser text-field zoom and remain labelled for touch keyboards.
- On phone-width layouts, the map is shown before the long layer panel and is capped to part of the viewport so it cannot trap the entire page.
- Portrait and short landscape layouts have separate map-height caps.
- Tables remain semantic tables but receive horizontal overflow rather than shrinking text below readable sizes.
- Event pages, catalog details, Sources, Methodology, Analyst, evidence filters, comparison and simulation controls collapse to one-column layouts without dropping scientific content.

## Mobile bandwidth

The administrative map, Search, Compare, Time Machine, Simulation/Scenario controls, Hazard Graph controls, Location Explorer, Water Change and Terrain foundation remain immediately available. On viewports at or below 800 px, larger automatically loaded thematic datasets are deferred behind **Load additional map datasets**. This prevents a phone from fetching mountains, rivers, glaciers, glacial lakes, stations, hazard archives, hydropower, population, satellite and climate payloads before the user requests them.

Desktop behavior remains unchanged. Once a mobile visitor opts in, the same components, artifacts, checksums, dates, evidence labels and limitations are loaded as on desktop; this is a delivery optimization, not a reduced scientific mode.

## Map interaction

The map retains native MapLibre touch pan/pinch behavior and its controls are enlarged on mobile. A complete administrative identification path remains available below the map through the labelled boundary selector and textual record details, so touch precision is never the only way to inspect a boundary.
