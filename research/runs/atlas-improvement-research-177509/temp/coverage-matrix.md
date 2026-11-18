## Coverage Matrix — query phrase → atomic item mapping

| Query phrase (verbatim) | Mapped atomic item(s) | Scope check | Gap? |
|---|---|---|---|
| "do a extensive research" | pipeline_tier full; response_format argumentative | OK — full depth | No |
| "how can this project improve even more" | Sub-Q1 (overall prioritised improvements); required section "## 10. Prioritised Roadmap"; all section headings | OK — covers every facet, not narrowed to one | No |
| "Himalayan Disaster Atlas" | Entity: project as a whole; "## 1. Where the Atlas Stands Today" | OK | No |
| "static" | Entity: static website architecture; scope condition (static/read-only) | OK — trade-offs evaluated, not assumed fixed | No |
| "bilingual English/Nepali" | Entity: bilingual content; Sub-Q6; "## 6. Serving Nepali Users" | OK — language, accessibility, reach | No |
| "public website" | Entity: static public website; Sub-Q7, Sub-Q8 | OK | No |
| "floods" | Entity: Floods; Sub-Q4; "## 4." | OK | No |
| "glacial-lake outbursts" | Entity: GLOF; Sub-Q4; "## 4." | OK — incl. transboundary | No |
| "earthquakes" | Entity: Earthquakes; Sub-Q5; "## 5." | OK | No |
| "Nepal" | scope condition Nepal (+ transboundary) | OK | No |
| "daily copy of official DHM/BIPAD/NEMRC data" | Entities DHM, BIPAD, NEMRC, daily copy; Sub-Q2; "## 2." | OK — reliability, completeness, new sources | No |
| "a MapLibre map" | Entity: MapLibre map; Sub-Q3; "## 3." | OK | No |
| "with place search" | Entity: place search; Sub-Q3 | OK | No |
| "hypothetical flood/GLOF and earthquake scenario models" | Entities: flood/GLOF scenarios, earthquake scenarios; Sub-Q4, Sub-Q5; scope condition (hypothetical, not forecasts) | OK — both models covered | No |
| "printable scenario reports" | Entity: printable reports; Sub-Q7; "## 7." | OK | No |
| "Nepali district names from the constitution" | Entity: Nepali district names; Sub-Q6 (names, extension to other levels) | OK | No |
| (implicit) "even more" → missing capabilities | Sub-Q9; "## 8. Missing Hazards and Capabilities" | OK | No |
| (implicit) impact of a public safety site | Sub-Q8; "## 9. Impact, Partnerships and Sustainability" | OK | No |
