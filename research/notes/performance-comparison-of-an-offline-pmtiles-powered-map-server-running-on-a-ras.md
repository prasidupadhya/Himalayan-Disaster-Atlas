---
title: 'Performance Comparison of an Offline PMTiles-Powered Map Server Running on
  a Raspberry Pi for Decentralized Geospatial Access ::  FOSS4G 2025 :: pretalx'
id: performance-comparison-of-an-offline-pmtiles-powered-map-server-running-on-a-ras
tags:
- atlas-improvement-research-177509
- map
created: '2026-11-18T12:57:52.512904Z'
source: https://talks.osgeo.org/foss4g-2025/talk/TCZTK7/
source_domain: talks.osgeo.org
fetched_at: '2026-11-18T12:57:52.512182Z'
fetch_provider: builtin
status: draft
type: note
tier: unknown
content_type: unknown
deprecated: false
---

Performance Comparison of an Offline PMTiles-Powered Map Server Running on a Raspberry Pi for Decentralized Geospatial Access ::  FOSS4G 2025 :: pretalx
Performance Comparison of an Offline PMTiles-Powered Map Server Running on a Raspberry Pi for Decentralized Geospatial Access
.ical
2025-11-19
14:30
–
14:55
, WG802
UNVT Portable, a Raspberry Pi server, streams PMTiles from a microSD card (up to 512 GB) without internet or database. Preloaded with OSM Planet, global DEM, and thematic layers, it’s benchmarked against cloud solutions for latency, throughput, energy, and storage efficiency, proving effective for UN field operations.
1. Introduction
Modern web-mapping stacks like Google Maps and Mapbox deliver rich cartography by pushing pre-rendered tiles from cloud storage into a browser. Formats like COG and PMTiles have improved access but still rely on data centers with steady fiber, power, and credit cards. In regions with unstable connectivity, this model fails.
Discussions by Cedeno Jimenez et al. (2022) and Rawal et al. (2024) highlight the need for decentralized geospatial information using blockchain and NFTs. However, even open datasets like OpenStreetMap often rely on centralized servers. The necessity of offline web maps, as noted by Esmail (2019), Paul et al. (2019), and Olyazadeh et al. (2017), has not been practically implemented. This study aims to measure the performance of a mobile web map server for UN operations.
2. Research Objectives
UNVT Portable aims to quantify the capabilities of a mobile web map server. The study has four objectives:
a. Design a reproducible hardware-software recipe to turn a Raspberry Pi into a zero-configuration tile server.
b. Construct a reference dataset—global OSM Planet vector tiles, Global DEM, Satellites/Aerial photos, and thematic layers—packed into a PMTiles archive on a 512 GB MicroSD card.
c. Benchmark PMTiles against a canonical S3/CloudFront deployment across latency, throughput, energy, and storage footprint.
d. Evaluate operational suitability for UN field missions requiring 24/7 availability under erratic connectivity and power budgets.
3. System Architecture
Hardware:
- Raspberry Pi 5 (8 GB RAM) with a 512 GB MicroSD Card
- 2.4 GHz Wi-Fi in access-point mode, emitting SSID: UNVTportable
- 20,000 mAh USB power bank capable of Power Delivery at 5V / 3A
Software:
- Raspberry Pi OS LITE (64-bit)
- Nginx
- Network Manager for local Wi-Fi
- MapLibre GL JS
4. Method
We measured the access performance of raster and vector tile data stored as PMTiles files on an SD card within a Raspberry Pi, evaluating latency, throughput, and other factors. This was compared to internet-based access to raster and vector tiles in a typical cloud environment. We also compared the access performance of PMTiles against raw raster and vector tiles extracted into folders as XYZ tiles. Field tests determined if 24-hour continuous operation is feasible using a standard mobile battery, even without internet connectivity and during power outages. We also tested usability in environments affected by natural disasters or lacking infrastructure.
5. Results
Both raster and vector tile data stored in PMTiles format on a Raspberry Pi's SD card demonstrated access performance (latency and throughput) equal to or surpassing that of tile datasets hosted in online cloud environments. When comparing access performance in a local environment between PMTiles-format tile data and raw raster and vector tiles extracted into folders as XYZ tiles, PMTiles was found to be sufficiently effective. Field tests confirmed that continuous operation for over 14 hours is possible with consumer-grade mobile batteries of 20,000 mAh or higher.
6. Discussion
The PMTiles format excels in offline environments due to its single-file architecture, consolidating millions of HTTP requests into efficient linear range requests. This design is advantageous on microSD cards, where random seek times can impact performance. By minimizing these seeks, PMTiles delivers faster response times, enhancing user-perceived speed in resource-constrained settings. The format’s streamlined structure simplifies critical field operations, such as checksum verification and data copying, reducing the risk of errors during data transfers. PMTiles’ compatibility with lightweight hardware like Raspberry Pi optimizes storage efficiency and reduces power consumption, making it ideal for decentralized, offline mapping applications, including UN field operations.
7. Conclusion
The UNVT Portable system showcases the potential of a €200, pocket-sized Raspberry Pi-based computer to provide global-scale, interactive mapping capabilities with performance rivaling cloud-based solutions, all while operating entirely offline. Comprehensive benchmarks validate its exceptional performance, demonstrating low latency and significant throughput advantages over traditional XYZ raw tile formats. The system achieves an impressive full day’s battery life using standard commodity power banks, enhancing its practicality for extended field use. These results represent a pivotal advancement toward decentralizing geospatial data access, transforming interactive maps from a cloud-dependent privilege into a universally accessible resource. UNVT Portable fosters egalitarian access to critical geospatial information, empowering communities, humanitarian workers, and volunteers in remote or underserved regions to leverage mapping technology effectively.
Taichi Furuhashi
This speaker also appears in:
How to Complete Japan’s OSM Building Data in One Year using the citygml-osm Converter