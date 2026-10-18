# Today page (`/hazards/`)

The Today page replaced the hazards hub in October 2026. It shows the daily copy of official sources (see [official sources](official-sources.md)) arranged around the three hazards the site is about.

## Sections

- **Floods**: BIPAD river and rain stations (DHM readings), counting only readings from the 24 hours before the copy; DHM flood bulletins and weather warnings, in the order DHM lists them; BIPAD alerts that are active or were issued in the last 3 days. Links to tracing a river on the map and to flood scenarios.
- **Glacial lakes**: no agency publishes a daily glacial-lake status, so nothing is copied. The section says so and links to the lake inventory on the map and to outburst scenarios.
- **At a glance**: one line per hazard at the top of the page, using the digest's own counts and the newest NEMRC row; a raised count is marked with ▲ and its text, never colour alone.
- **Earthquakes**: the newest rows of the NEMRC earthquake table, shown as Date (AD), Magnitude and Epicentre columns. The AD date and local time are picked out of NEMRC's combined BS/AD and Local/UTC cells; a cell that does not match is shown verbatim or as UNKNOWN, and "days before this copy" is counted from the copy's Nepal date. Beside the table, a map of Nepal draws each row that has published coordinates, ring size growing with magnitude. Links go to shaking scenarios and the USGS feed on `/live/`.
- **Reported incidents**: BIPAD incidents of any type with an incident date in the last 7 days; the count carries a "+" when the API page may have cut the window short.

Each card states when it was copied, or that it shows the last successful copy, and links to the agency page and to the full copy on `/official/`. Missing values show UNKNOWN. English and Nepali are available; Nepali copy is project-authored and needs native-speaker review.

## Offline

The service worker fetches `/gov/latest.json` network-first and keeps the last good copy. Offline, the page shows that copy with its own copy time.

## Removed

The NASA POWER climate panels, the terrain-steepness panel, the gated-feature cards (Features 44, 50 and 52) and the evidence analyst were removed from the website. Their releases, pipelines and documentation remain: [climate context](climate-context.md), [terrain steepness](terrain-steepness.md), [RAG corpus](rag.md).
