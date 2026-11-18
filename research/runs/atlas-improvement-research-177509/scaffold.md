# Scaffold (private planning document — never in the final report)

## User Prompt (VERBATIM — gospel)
do a extensive research on how can this project improve even more. (Project: Himalayan Disaster Atlas — a static, bilingual English/Nepali public website for floods, glacial-lake outbursts and earthquakes in Nepal: daily copy of official DHM/BIPAD/NEMRC data, a MapLibre map with place search, hypothetical flood/GLOF and earthquake scenario models, printable scenario reports, Nepali district names from the constitution.)

## Run config
- vault_tag: atlas-improvement-research-177509
- query_file_path: research/runs/atlas-improvement-research-177509/query.md
- modality: synthesize (with a committed, prioritised recommendation set)
- wrapper requirements: none (no prompt.txt / wrapper_contract.json). Save path: research/notes/final_report_atlas-improvement-research-177509.md. Citation format: pipeline default. Terminal sections: pipeline default.

## Modality classification rationale
The user asks "how can this project improve even more" — an open improvement question about one concrete project. The answer must defend a thesis about which improvements matter most (evidence chains from disaster-risk communication, hazard science, open data, accessibility research), not merely list options. Hence synthesize, ending in a prioritised recommendation set.

## Project facts (from the repository, for grounding — not sources)
- Static site in site/ (plain HTML/CSS/JS, no build step), MapLibre GL 6.7, Cloudflare Workers static hosting, PWA service worker.
- Bilingual EN/NE copy (site/copy.js), Devanagari digits on Nepali pages.
- Today page: daily verbatim copy of official pages (BIPAD river/rain stations, incidents, alerts; DHM forecast + flood bulletins; NEMRC earthquakes; NDRRMA 24-hour summary) via GitHub Actions + Scrapling; 30-day trends of summary counts; last-known copies labelled.
- Map: rivers (HydroRIVERS), glacial lakes (ICIMOD/GLO transboundary inventory), glaciers (RGI 7.0), districts (COD-AB), downstream river trace, place search (districts, OSM settlements, GeoNames peaks/streams, verified GLOF release points), 3D terrain explorer with peak labels.
- Scenarios: hypothetical GLOF/flood pulse (kinematic travel with slow/mid/fast celerity, triangular/rectangular hydrograph, corridor exposure counts from HRSL population + OSM assets at 250–1000 m widths) and earthquake shaking (BSSA14 GMPE, Vs30 classes, people by PGA band, past-event presets); printable A4 reports; 3D flood flythrough.
- Nepali district names from Constitution Schedule 4 (Preeti → Unicode), monthly re-check.
- Known gaps: NEMRC certificate expired (source failing); DHM flood bulletins only seasonal; no per-station history; no landslide hazard; no push alerts; no dam-break/hydraulic routing; no building damage; GLOF sources limited to 18 verified release points.

## Tier rationale
Full tier. The user explicitly asks for extensive research, and the question is open-ended across five facets (data feeds, hazard science for two very different models, usability/localisation, risk communication, impact), where evidence conflicts (e.g. how much model sophistication a public site should expose, static vs. dynamic architecture). A defended, prioritised answer needs the full adversarial pipeline, not a light survey.
