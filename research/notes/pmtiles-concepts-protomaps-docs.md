---
title: PMTiles Concepts | Protomaps Docs
id: pmtiles-concepts-protomaps-docs
tags:
- atlas-improvement-research-177509
- map
created: '2026-11-18T12:58:06.734298Z'
source: https://docs.protomaps.com/pmtiles/
source_domain: docs.protomaps.com
fetched_at: '2026-11-18T12:58:06.733756Z'
fetch_provider: builtin
status: draft
type: note
tier: ground_truth
content_type: docs
deprecated: false
---

*Suggested by [[the-democratisation-of-digital-maps-how-protomaps-are-changing-the-game-cusy]] — primary doc*

PMTiles Concepts | Protomaps Docs
Skip to content
Menu
Return to top
PMTiles Concepts
​
PMTiles is a single-file archive format for pyramids of tiled data. A PMTiles archive can be hosted on a storage platform like S3, and enables low-cost, zero-maintenance map applications.
Concepts
​
PMTiles is a general format for tiled data addressed by Z/X/Y coordinates. This can be cartographic basemap vector tiles, remote sensing observations, JPEG images, or more.
PMTiles readers use
HTTP Range Requests
to fetch only the relevant tile or metadata inside a PMTiles archive on-demand.
The arrangement of tiles and directories is designed to minimize the amount of overhead requests when panning and zooming.
PMTiles is a
read-only
format. It is not possible to update an archive in-place without re-writing the entire file, similar to CSV, JSON and Parquet. If you need transactional updates, use a database like SQLite or
PostgreSQL
+
ST_asMVT
.
The current specification version of PMTiles is version 3, which you can
read on GitHub.
Comparisons
​
Individual files
​
An alternative to PMTiles is uploading each tile separately in a directory tree like
`/Z/X/Y.mvt`
. This works great for small tilesets, but uploading full global pyramid, such as 300 million tiles, could cost 1,500 USD in request fees and take days. PMTiles is a single file to upload and de-duplicates tiles internally, reducing size by 70%+ or more for global vector basemaps.
MBTiles
​
MBTiles
is a container format for tiled data, just like PMTiles, but based on SQLite. MBTiles are designed to be accessed on disk from a running server process, while PMTiles is designed to be read remotely over HTTP, with at most two cacheable intermediate requests.
Cloud Optimized GeoTIFF
​
A
Cloud Optimized GeoTIFF (COG)
is a raster TIFF file with an internal organization that enables remote reads from cloud storage. PMTiles is similar to COG, but stores arbitrary tiled data, such as vector MVT tiles. However, COG is backwards compatible with most GIS software that deals with GeoTIFF.
Reading PMTiles
​
PMTiles Viewer
​
The Viewer is a browser-based tool for visualizing PMTiles on a map, inspecting metadata, and debugging individual tiles.
You can access the Viewer at
pmtiles.io
.
Serving files locally
​
You can use any local HTTP server that supports Range Requests to serve files locally. the npm package
`http-server`
is a popular one:
sh
```
npm install -g http-server
# from the directory containing your .pmtiles file
http-server . --cors
# your file is now available at http://localhost:8080/
```
You can also use the HTTP server built into frontend frameworks, usually by placing the .pmtiles file into the
`/public`
folder.
pmtiles command line tool
​
See the
pmtiles cli
.
JavaScript
​
PMTiles is designed for being viewed directly in web browsers in conjunction with a JavaScript map rendering library, including:
MapLibre GL JS
- the recommended library for building smooth experiences and custom styling.
Leaflet
- a lightweight map display library with many plugins.
OpenLayers
- has the most GIS-related features.
Each of the client integrations uses the
JavaScript pmtiles library
.
JavaScript Library API documentation
Python
​
`pmtiles`
is a python package for reading and writing PMTiles. It is available via
GitHub
and the
Python Package Index
.
WARNING
The Python
`pmtiles`
package should be considered beta status.
Other Languages
​
These libraries are maintained by other individuals and organizations.
Dart:
pub.dev/packages/pmtiles
Kotlin/JVM:
MinotaurG/pmtiles-kotlin
Rust:
stadiamaps/pmtiles-rs