---
title: 'The democratisation of digital maps: How protomaps are changing the game -
  cusy'
id: the-democratisation-of-digital-maps-how-protomaps-are-changing-the-game-cusy
tags:
- atlas-improvement-research-177509
- map
created: '2026-11-18T12:57:54.607924Z'
source: https://cusy.io/en/blog/democratisation-of-digital-maps.html
source_domain: cusy.io
fetched_at: '2026-11-18T12:57:54.607120Z'
fetch_provider: builtin
status: draft
type: note
tier: unknown
content_type: unknown
deprecated: false
---

The democratisation of digital maps: How protomaps are changing the game - cusy
Contents
Menu
Expand
Light mode
Dark mode
Auto light/dark, in light mode
Auto light/dark, in dark mode
Hide navigation sidebar
Hide table of contents sidebar
Skip to content
Back to top
Deutsch
Toggle Light / Dark / Auto color theme
Toggle table of contents sidebar
The democratisation of digital maps: How protomaps are changing the game
¶
Veit Schiele
2 April 2025
8–10 minutes
In today’s digital landscape, maps have become essential components of
countless applications and services, from navigation and logistics to social
platforms and data visualisation. But for too long, the field has been dominated
by a handful of companies whose services, while powerful, come with significant
drawbacks: Usage quotas, tracking requirements, styling limitations, and
recurring costs that can quickly skyrocket as applications grow.
Protomaps
is an innovative open source map technology
that is fundamentally changing the way digital maps are created, distributed and
used. At its core, Protomaps utilises the ground-breaking PMTiles format – a
single-file approach to vector tiles that eliminates the need for a complex tile
server infrastructure while increasing performance and reducing bandwidth
consumption.
Technical innovation
¶
Unlike traditional solutions that rely on thousands of individual tile files
served from a complex infrastructure, PMTiles bundles vector map data into a
single, efficiently indexed file that can be hosted anywhere from traditional
web servers to object stores with no special configuration required.
This approach enables progressive loading so that maps can be rendered quickly
at variable zoom levels while maintaining the rich detail and interactive
features that users expect from modern map solutions.
Democratisation
¶
How is Protomaps democratising digital cartography in practice?
Economic accessibility
¶
By eliminating recurring API costs and usage-based pricing models, Protomaps
opens up map functionality to projects of all sizes, from hobby developers to
non-profit organisations and educational institutions with limited budgets.
Technical accessibility
¶
Leaflet
,
MapLibre
and
OpenLayers
can be integrated with just a few lines
of code and minimal configuration.
Freedom of customisation
¶
Without the styling restrictions imposed by commercial vendors, Protomaps allows
complete creative control over the appearance of maps. Maps can be customised in
ways that would be difficult or impossible to achieve with traditional services.
Privacy by design
¶
As Protomaps enables fully self-hosted map solutions, there is no need to share
user location data or map activity with third parties – a crucial aspect for
privacy-conscious applications and those operating under strict regulatory
frameworks.
Real-World Applications
¶
Let’s take a look at various applications where protomaps can prove to be
transformative:
Small municipalities
Cities can replace their commercial mapping system with a Protomaps-based
solution to display area information, infrastructure projects and municipal
resources. The self-hosted implementation not only eliminated recurring
licence costs, but also the ability to add local landmarks and municipal
boundaries to the map that were previously difficult to highlight with
commercial services.
Offline map
Protomaps can enable the creation of offline-enabled mapping tools in areas
with spotty or no internet connectivity. By distributing PMTiles files
containing detailed local and regional maps, interactive mapping tools can
be accessed without the need for constant internet access.
Privacy-focused applications
For example, healthcare provider networks can use protomaps to create
facility location tools, with user location data stored only on the device.
Specialised tools for businesses
PMTiles enables companies to create highly specialised maps with
industry-specific symbology and data visualisation that could not be offered
by commercial map providers, while ensuring that the maps are accessible on
mobile devices even in remote areas without mobile coverage. For example, in
forestry, maps with special vegetation and topography layers can be
developed for field workers.
Limitations
¶
PMTiles is intended for the web-based display of large, mostly static data sets,
based on a web platform and not on a local desktop application.
where the information to be explored totals more than a few megabytes – more
than can be loaded at once for a pleasant website experience.
whose data set changes at most daily or never.
If your application does not have these three features, there are simpler
alternatives to PMTiles:
GeoJSON
¶
If you are creating a web-based map with static information, but your data is
small, you should provide it as a single GeoJSON file.
With MapLibre, it’s as simple as
adding a GeoJSON source
.
This saves you the hassle of converting your data into tiles, and you can use
the same map design and interaction techniques as you would with tiled data.
PostGIS
¶
If you are creating a web-based map for a large dataset that is dynamic and
frequently updated by users, you should store your features in a transactional
database.
While it is possible to update a PMTiles file regularly, this requires the file
to be reloaded each time it is saved. While this may be fine for daily updates,
any higher frequency requires an inefficient amount of data transfer.
PostGIS
is the industry standard for transactional
geographic feature databases. Popular methods for retrieving tile data from
PostGIS are
pg_tileserv
,
martin
and the raw function
ST_asMVT
.
Note
A major challenge for web maps, including PostGIS-based maps, is the
generalisation of data for tiles with lower zoom. One method is to
selectively omit attribute data in zoom levels
to make overviews brighter at
lower zoom levels.
GeoParquet
¶
If you are exploring large, static datasets but do not require publication on
the internet, you can avoid tiling and visualise the files directly with desktop
software.
Tiling with tools like
tippecanoe
requires the prior calculation of general overview tiles and is designed for
retrieving small, optimised pieces of data over the internet. If the network is
not the bottleneck and you have your dataset locally,
QGIS
is an excellent open source solution for visualisation and map creation.
Together with GeoJSON and
FlatGeobuf
,
GeoParquet
is a new format that can efficiently store large
datasets and is interoperable with open source data tools. The GeoParquet 1.0.0
specification has been supported since GDAL 3.8.0, the GeoParquet 1.1.0
specification since GDAL 3.9.0.
See also
(Geo)Parquet
Lonboard
¶
Tools such as
Lonboard
enable
the visualisation of GeoParquet in
Jupyter notebooks
. It is possible to publish these on the web
using hosted notebooks, although transferring tens or hundreds of megabytes
results in more latency than tile maps. For local data, however, GeoParquet and
Lonboard is a great solution for exploratory data analysis, saving you the
trouble of converting to a network-optimised, tiled format.
Future directions
¶
The standard libraries continue to evolve:
PMTiles
The main library for processing the PMTiles format
Client-side implementations for
JavaScript
,
Python
,
Dart
,
Rust
and
Go
.
Server-side implementations
and
pmtiles CLI
.
Integrations with common mapping libraries:
MapLibre GL JS
Leaflet
OpenLayers
Protomaps Basemaps
creates a cartographic ‘base map’ from OpenStreetMap and other data sources
as well as MapLibre styles for display in a browser.
basemaps-flavors
Map themes and styles.
See also
Basemaps Flavors
.
However, the ecosystem around Protomaps is also growing:
tippecanoe
Tool for creating vector tiles from GeoJSON and other geodata formats.
PMTiles tile inspector
Tool for analysing and troubleshooting PMTiles files.
osmextract
Tool for extracting regional OpenStreetMap data for use with protomaps.
Maputnik
An open source visual editor for the
MapLibre Style Specification
and PMTiles sources.
The focus of Protomaps is exclusively tile-based cartography and interactive
visualization. However, there are also extensions for geocoding and routing:
Geocoding
Nominatim
Photon
Pelias
Routing
Valhalla
OpenTripPlanner