# Improving the Himalayan Disaster Atlas: A Practitioner's Roadmap with Boundary Conditions

**Executive summary.** The Atlas can improve most by keeping its engines and fixing what they assume. That means better default parameters, ranges instead of single numbers, honest signals when its copy of official data is stale, and Nepali-first delivery that loads fast on weak connections. It does not need a bigger architecture. The evidence supports one clear ordering. Over the next three to six months, the project should do five things. (1) Make the daily copy of DHM, BIPAD and NEMRC data fail loudly, and show its age on every panel. (2) Change the flood and outburst wave-speed defaults, because the only peer-reviewed measurement of a Nepal outburst front is 8.7 m/s, which is faster than the Atlas's fastest case of 6 m/s [1]. (3) Replace the single 760 m/s rock-site default in the earthquake model with a mapped site-condition layer. (4) Put a fixed bilingual "hypothetical scenario, not a forecast or warning" frame on every map and printed page. (5) Fix Nepali place search and Devanagari label rendering. Over six to twenty-four months, the expansion work is justified, but each piece needs its own safeguard: outburst origins beyond the 21 officially listed Nepal lakes, a small ground-motion model ensemble, a landslide context layer, and formal data partnerships. The expansions should come only after three validation tasks the project can run itself: a Gorkha 2015 shaking hindcast, a 2016 Bhote Koshi outburst arrival-time hindcast, and a small reader test with Nepali users. The governing principle is that the Atlas is worth most *before* an event, as a preparedness and explanation tool. It cannot be a warning channel. Its static, free, read-only design suits that role, as long as the site says so plainly.

How this draft weighs evidence: each recommendation carries an evidence grade, a delivery cost on low bandwidth, and a maintenance burden for a small volunteer team. The grades are: **A**, measured against observed events or tested with users; **B**, peer-reviewed or official documentation that is indirect for this use; **C**, preprint, conference abstract, self-report or journalism; **D**, reasoning from evidence with no direct test. Where a change depends only on C or D evidence, the roadmap pairs it with a validation task.

## 1. Where the Atlas Stands Today

### A. What the current design gets right

The Atlas already makes several choices that the risk-communication and open-data literature would recommend. It is static and free with no login, so it costs almost nothing to run and survives traffic spikes. The World Bank's open-data programme found that no project it funded had built a self-sustaining revenue stream, and that "without continuous funding" risk data goes stale [2]. A design whose running cost is close to zero sidesteps the most common way civic risk platforms die. The site is bilingual and uses the constitutional Nepali district names, which addresses a documented weakness in Nepali hazard messaging: DHM's own SMS alerts have had "no standardised language", appearing in Nepali, English or romanised Nepali [3]. The printable scenario reports reach people the website does not. In Nepal only 14.7% of households have a radio and 42.8% a television [4], so a printed sheet on a ward-office wall is a real channel, not a nostalgic one. The models also already disclose some of their own limits: the ground-motion model's data file lists the basin-depth term, the regional anelastic adjustment and spatial correlation as omitted. That is better practice than most public hazard viewers follow.

### B. Where the gaps are

The gaps fall into four groups, and none of them calls for a rebuild.

1. **Defaults that understate hazard.** The fastest flood case (6 m/s) is slower than the measured Bhote Koshi 2016 outburst front (8.7 m/s) [1]. A rock-site Vs30 (the average shear-wave velocity in the top 30 m of ground, which controls how much soil amplifies shaking) of 760 m/s understates shaking in sediment valleys and the Terai, where most people live.
2. **Single values where ranges are needed.** Three fixed wave speeds and one site condition hide spread that the science says is large. The tsunami-map and hurricane-cone literature shows that the public reads crisp lines as certainty [5, 6].
3. **A data copy that can fail silently.** Only BIPAD's river and rain station endpoints are confirmed machine-readable. DHM bulletins, NEMRC and NDRRMA pages are HTML scrapes, and three of them need JavaScript rendering. A static page that silently shows yesterday's river levels during a flash flood is a hazard in itself.
4. **Reach gaps.** Place search is weak on Nepali spelling variants. Devanagari map labels need special handling in MapLibre. 3D terrain is heavy for the 44% of Nepalis who do not use the internet at all and for the many who use it on metered mobile data [7].

### C. Committed reading

The Atlas does not have a weak core. It has unexamined defaults. The highest-return work is a short list of parameter, display and pipeline fixes, each cheap, each testable, and each grounded in at least B-grade evidence. Projects at this stage usually fail by adding hazards and layers before the existing ones are validated. The roadmap in Section 10 is designed to prevent that.

## 2. Official Data Feeds: DHM, BIPAD and NEMRC

### A. What the official system already does well, and where it fails

Nepal's official flood warning chain has a measured success. WMO reports that after DHM introduced its Flood Forecasting and Early Warning Services in 2016 and the South Asian Flash Flood Guidance System in 2018, flood deaths fell "from 166 in 2017 to 27 in 2022 despite higher magnitude flooding in 2022" [8]. Riverine forecasting works. The failures are elsewhere: at the last mile, in short-fuse events, and across the border. The 2023 national Early Warnings for All consultation listed "shortcomings including in the operationalization of the Common Alerting Protocol, nowcasting of rainfall and flooding in urban areas" and noted that remote high-mountain observation is a "particular challenge" [9]. After the September 2024 floods, which killed about 250 people and led the government to declare 71 municipalities in 20 districts emergency zones [10], DHM and partners told WMO that an impact-based flood forecasting system is "a big gap" and that municipalities need at least 24 hours of lead time [11]. ISET-Nepal's analysis of the October 2021 disaster concluded that "without appropriate advisories to help users take preventive actions, [messages] become meaningless" [12].

This shapes what an unofficial mirror can add. The Atlas cannot close a sub-hour latency gap with a daily copy, and it should not try. It can make official information *legible*: timestamped, bilingual, placed on a map, and linked to the official channel.

### B. Boundary condition: when is a daily copy enough?

A daily copy is enough for slow-changing official products: DHM's daily bulletins and outlooks, NEMRC's earthquake catalogue (which is history the moment it is published), and BIPAD's incident and loss records. It is *not* enough for river levels or rainfall during an active event. In the August 2026 Bhote Koshi–Trishuli flood, which directly affected an estimated 32,960 people [10], official accounts put the river rise within about twenty minutes of the trigger upstream. Any value the Atlas showed would have been hours old.

The practical rule follows from this. Show live-type values (river level, rainfall) only with their source timestamp *and* their fetch timestamp. Grey them out past a fixed age. Always link to the official page. Suggested thresholds are six hours for river and rain data and 48 hours for bulletins. These are judgement calls, not sourced figures, and the project should publish them so they can be challenged. For the two BIPAD JSON endpoints already confirmed as machine-readable, an hourly scheduled copy costs almost nothing on GitHub Actions and makes the context more useful. Turn it on only once the health signals described below exist, because a more frequent copy that breaks silently is worse than a daily one that breaks loudly.

### C. Making the copy fail loudly

The cheapest reliability work in this whole report is pipeline hygiene, and it should come first.

- **A per-source health file.** For each source, publish last success, last attempt, consecutive failures, record count and a schema hash. The site reads this file and shows a small status chip ("DHM bulletin: updated 3 h ago" / "BIPAD river data: not updated for 2 days – check bipadportal.gov.np").
- **Schema checks on BIPAD JSON.** Fail the job, keep the last good copy, and open a repository issue after N consecutive failures. Nepali government web infrastructure is not always stable: the same outlet that reported the ITU index also ran headlines about government websites being taken offline over a PHP security flaw [13]. A scraper should assume this will happen.
- **Verify before showing.** BIPAD's incident and alert endpoints have not been confirmed. Until they are, the Atlas should link to them rather than display them.
- **Keep history.** A daily copy committed to the repository is already a time series. Publishing it as dated, append-only files (one per source per day) turns the scraper into a public archive of official data. That serves journalists and researchers and costs nothing to host.

### D. Standards: consume CAP, do not emit it

The Common Alerting Protocol (CAP, an XML standard for machine-readable alerts) is where Nepal's official system is heading. In April 2025 WMO ran a CAP workshop with DHM and more than 35 participants. A "draft national implementation plan, including Standard Operating Procedures on CAP messages" was agreed, and WMO will support DHM in "sharing CAP compliant warnings on the Severe Weather Information Centre" [14]. No public DHM CAP feed has been found yet. The Atlas should prepare to *consume* such a feed: parse it, timestamp it and show it verbatim when it appears. It should not publish its own CAP feed of mirrored alerts. CAP feeds are meant to come from registered alerting authorities, and an unofficial CAP feed could be picked up by aggregators and passed on as official. That is exactly the competing-authority problem the Atlas must avoid. This is a deliberate departure from the more ambitious "republish as CAP" idea: the risk is asymmetric, and the benefit falls to the official system once it publishes its own feed.

### E. New official sources worth adding

BIPAD now has an impact-based forecasting module that combines OpenStreetMap exposure, Nepal Red Cross household data scored with the INFORM index, and historical loss data. It was piloted at two river stations in West Nepal [15]. UNDRR notes that as lead time shortens, "pre-existing vulnerability and historical impact data becomes more important" than the hazard forecast [15]. That supports an Atlas archive of BIPAD loss records by district and year: cheap static tables that let a reader see what floods and landslides have actually done in their district. A licence or written data-use confirmation from NDRRMA should come first. None has been found, and the role of an unofficial mirror depends on that permission.

**Committed position.** Rank "staleness and health signals" above "more feeds." Evidence grade: B for the latency problem (official accounts and WMO documentation), D for the specific thresholds. Bandwidth cost: negligible, since the health file is under 2 KB. Maintenance: low once built, and it *reduces* future maintenance because breakages announce themselves.

## 3. The Map and Place Search

### A. Search is a language problem before it is a data problem

Place search currently combines GeoNames points with the 77 constitutional district names. That is good for districts and weak for everything below them. The OSM Nepal community's own conventions show the right model. The `name` tag carries the native Nepali Unicode name [16], with `name:ne`, `name:en` and `alt_name` for variants. The romanisation problem is explicit: "साँखु could be written as sankhu or shankhu, चितवन as chitwan or chitawan, गोर्खा as gorkha or gorakha", and the community resolved to follow the Survey Department of Nepal's transliteration standard [17]. The same meeting recommended tagging alternative names "so that the search function of softwares can find the features", for example New Road as `name = नयाँ सडक`, `alt_name = Naya Sadak`, `name:en = New Road` [17]. The `name:ne` key itself is meant to "reflect local pronunciation accurately" [18].

The buildable change is a search index built at deploy time from an OSM Nepal extract (Geofabrik publishes one [16]). Index `name`, `name:ne`, `name:en` and `alt_name` for the 753 local levels, wards where available, and settlements. Then add a small normalisation layer before matching. It should fold chandrabindu and anusvara, unify the short/long vowel pairs (i/ī, u/ū), map common romanisation pairs (sh/s, w/v, aa/a), and strip the inherent "a" when comparing romanised forms. This lets साँखु, सांखु, sankhu and shankhu all resolve to the same place. Ship the index as one compressed JSON file of a few hundred kilobytes, loaded on first focus of the search box rather than with the page.

**Boundary condition.** OSM name coverage in rural Nepal is uneven, and the 2022 meeting noted "the prevalence of remote mappings" [17]. The index should fall back to GeoNames when OSM has no Nepali name, and should never present an OSM name as an official administrative name. Constitutional names stay authoritative for districts. For local levels, the Survey Department's list should take precedence where it can be obtained.

### B. Nepali labels on the map: a specific technical trap

MapLibre does not shape Devanagari natively. Protomaps' localisation documentation lists Nepali among the scripts that "require paired positioned glyph font" stacks, and explains that it exports names as "positioned glyphs" so that MapLibre can render them correctly [19]. If the Atlas's Nepali labels come from a standard MapLibre font stack, conjuncts and pre-base vowel signs may be misdrawn. The W3C's Devanagari gap analysis confirms the browser side of the problem: "all engines have problems with vowel-signs, especially but not only pre-base vowel-signs", and letter-spacing splits conjuncts [20]. Two buildable fixes follow. (1) Use the Protomaps Nepali localised style with its positioned-glyph font stack for basemap labels, or render custom Nepali labels (district names, peak labels) as HTML overlays, which the browser shapes correctly. (2) Never apply CSS `letter-spacing` to Devanagari text in the interface or in print. Protomaps also documents a `coalesce`-based pattern for dual-language labels [19], which suits a bilingual atlas: Nepali first, English second, one shown when they are identical.

### C. Basemap delivery: PMTiles, with a page-weight budget

PMTiles is "a single-file archive format for pyramids of tiled data" read through HTTP range requests, which "enables low-cost, zero-maintenance map applications" and suits MapLibre directly [21]. Because it is read-only, an update means rewriting the file [21]. That suits a monthly or quarterly rebuild of a Nepal-extent basemap in CI. Self-hosting a Nepal extract removes dependence on a third-party tile server, and it also enables offline caching (Section 6). The 3D terrain and DEM should be opt-in, not the default. Terrain tiles are the heaviest part of a MapLibre page, and the hazard story mostly does not need them.

### D. Hazard layers worth adding, and their cost

| Layer | Evidence grade | Delivery approach | Bandwidth cost | Maintenance |
|---|---|---|---|---|
| Glacial lakes (ICIMOD PDGL + open HMA inventory) | B | points with attributes, loaded with the outburst tool | ~100–300 KB gz | low (re-pull on new release) |
| Site condition (Vs30) | B | baked into the population/exposure grid cells | small per scenario | very low |
| Landslide history (BIPAD incidents, open inventories) | B–C | yearly static GeoJSON | ~100 KB per year | medium (licences) |
| Official flood hazard maps (where published) | B | link-out or PMTiles if licensed | variable | high (licences, updates) |
| Exposure: schools and health posts (OSM) | B | PMTiles overlay | small | low |

The schools and health facilities layer has a Nepali precedent. Kathmandu Living Labs grew out of a 2012/13 project that mapped all schools and health facilities in Kathmandu Valley into OSM for World Bank earthquake-vulnerability work, on the principle "work once, and put to multiple creative uses" [22].

**Committed position.** Search normalisation and Devanagari rendering come first, because they cost little and fix silent exclusion. Layers come second, each loaded on demand. Grade B for the conventions and rendering facts. Grade D for the claim that search failures are a major barrier, which a search-log or reader test should confirm (validation task V5).

## 4. Flood and Glacial-Lake Outburst Scenarios

### A. What the measured evidence says about the routing engine

The Atlas moves a triangular or rectangular release hydrograph downstream at three constant speeds (2, 4, 6 m/s) with no attenuation. The best measured Nepal case is the 5 July 2016 Gongbatongshacuo outburst into the Bhote Koshi, recorded by a seismic network. Cook et al. write that "the first [pulse] is the flood front, which propagates between stations at 8.7 m/s", followed by a higher-magnitude coarse-sediment pulse travelling "slower, at 5 m/s" [1]. The peak attenuated downstream: an estimated 1,500–2,100 m³/s at Chaku fell to 700–900 m³/s at Barabise. That was still above the expected 30-year monsoon flood there, 490–560 m³/s [1]. The authors place the "crossover point" where the outburst peak equals the 30-year monsoon flood about 45 km downstream of the Zhangzangbo confluence for 2016 and 55 km for the larger 1981 event [1]. They also document that the outburst triggered landslides through lateral erosion, with landslide area during that monsoon about 100 times that of a typical year [1].

Three practical conclusions follow.

1. **The speed bracket is too slow at the top.** A 6 m/s ceiling is below the one measured Nepal outburst front. For the most exposed settlements nearest the lake, the Atlas's earliest-arrival estimate is too late, which is the dangerous direction. Reconstructions of the 2026 Bhote Koshi cascade report even faster near-source fronts. Those figures come from unreviewed preprints of a rock-ice avalanche and debris flow, not a moraine-dam breach, so they belong in a separate, labelled case rather than in the default.
2. **No attenuation is wrong for clear-water breaches, but not universally wrong.** The 2016 peak roughly halved between Chaku and Barabise [1]. Entrainment-driven cascades, however, can gain volume downstream. The honest default is to attenuate clear-water scenarios and warn that debris-laden or cascade events can exceed the curve.
3. **Arrival time matters more than hydrograph shape for the people the Atlas serves.** the Nepal forecast-communication study notes, citing the 2013 and 2014 floods, that the lead time from water-level-based warning "is just enough to save lives but not livelihoods" [3]. For a preparedness tool, a credible *arrival window* per place is the most valuable output.

### B. The minimal justified upgrade

Keep the simple engine. Change four things.

- **New speed defaults.** Replace 2/4/6 m/s with a 3/6/9 m/s bracket for moraine-dam scenarios. That brackets Cook's 8.7 m/s front and 5 m/s sediment pulse [1] and keeps a slow case for wide lower reaches. Add an optional, clearly labelled "fast mass-flow cascade" case for steep near-source reaches, flagged as resting on unreviewed reconstructions.
- **Arrival windows, not lines.** Report "first water could arrive between about X and Y minutes after release" for each place, never one number. This turns three parallel lines on a map into one table a ward office can print.
- **Default attenuation with an amplification warning.** Apply a simple peak decay with distance for clear-water scenarios. Show the source peak alongside, and note where the modelled peak falls to monsoon-flood levels, using Cook's crossover concept [1]. Add a fixed warning that avalanche- or landslide-triggered cascades and sediment-laden floods can be larger downstream.
- **A visible "not modelled" list.** Entrainment, valley-wall landslides triggered by the flood, debris flow, backwater at confluences, and inundation depth. Cook's landslide finding [1] is the reason to state the hillslope effect explicitly.

**Boundary conditions.** The simple engine suffices for order-of-magnitude arrival windows along a single main channel tens of kilometres below a source, and for teaching that outbursts outrun warnings. It does *not* suffice for inundation depth, structure design, land-use zoning, or any scenario in which the user expects to learn "will my house flood". Process-chain models that couple avalanche, displacement wave, breach and debris flow need DEMs, rheology calibration and lake-specific data that a static site cannot supply. Building them would turn a volunteer atlas into a research project.

### C. Origins beyond the official list: expansion with safeguards

The 2020 ICIMOD/UNDP inventory mapped 3,624 glacial lakes in the Koshi, Gandaki and Karnali basins, 2,070 of them in Nepal, and identified 47 potentially dangerous lakes: 21 in Nepal, 25 in Tibet that drain into Nepal, and one in India [23]. The list is a prioritisation tool with stated exclusions: "extreme climatic conditions, seismic activity, and human interference ... are not considered" [23]. It is also unstable over time: the present list "contains 13 lakes from the old list, and eight newly identified ones" [23]. ICIMOD itself recommends that "adequate information should be made available to the public in varied languages" about GLOFs [23], which is a direct mandate for exactly what the Atlas does. The exposure figures are large: roughly 141,911 people downstream of Tsho Rolpa, 165,068 of Thulagi and 96,767 of Imja [23].

An open alternative now exists. A 2026 *Scientific Reports* study mapped 31,698 glacial lakes across High Mountain Asia for 2022, with over 96% accuracy for 20,000–100,000 m² lakes and all lakes above 100,000 m² delineated, in two epochs (2016–17, 2022–24), with data on Zenodo under CC BY 4.0 [24]. Its own text warns that small lakes are the weakest bin. It cites a GLOF from a lake of about 0.017 km² that "transformed into a massive debris flow", and its authors deliberately excluded some small lakes to limit false positives [24]. The 2024 Thame outburst, from small lakes not on any danger list, is the Nepali case in point.

The buildable design is a **tiered origin layer**:

- **Tier 1, official:** the 21 ICIMOD Nepal lakes, labelled with ICIMOD's rank and citation. The ICIMOD list is under a no-derivatives licence, so link to it and cite it; do not redistribute a modified copy without permission.
- **Tier 1T, transboundary:** the 25 Tibet-side lakes upstream of Nepal, with the catchment drawn to the border. This is where Nepal has no listing authority and where cross-border notice has failed.
- **Tier 3, mapped but unassessed:** lakes of at least 0.02 km² from the CC BY open inventory in Nepal-draining catchments, labelled "mapped lake, not assessed, not on any danger list, scenario is hypothetical". Each gets a volume *range*, not a point value, and a user-override field.
- **No rankings and no "danger" words** for Tier 3, plus a cascade option wherever a second mapped lake sits a short distance downstream.

**Why the safeguard is non-negotiable.** A tsunami-map survey of 181 people found that at least 33% of experts and 47% of general users did not clearly distinguish a hazard map from an evacuation map [6]. Hundreds of unassessed lakes with scenario buttons multiply the chances that a reader treats a hypothetical as an official assessment. The expansion and its labelling must ship together, or the expansion waits. The decision point is validation task V3: if Nepali readers misread Tier 3 scenarios as official danger ratings even with the labels, collapse Tier 3 behind an "advanced" switch.

**Change detection is a cheap win.** The open inventory has two epochs [24] and ICIMOD compares 2000 and 2015 [23]. Showing lake-area growth per lake ("this lake grew N% between 2016–17 and 2022–24") is evidence-based, small (one number per lake) and honest about climate-driven change without any projection modelling. ICIMOD's recommendation that inventories be updated "at least every 5 years" [23] gives the Atlas a natural refresh rhythm.

### D. Hindcasts the project can run itself

The 2016 Bhote Koshi event is the ideal test case. It has a known origin, measured front speed, and measured peaks at two places [1]. Run the Atlas with its new defaults from Gongbatongshacuo and check two things: does the arrival window at the Cook stations contain the observed timing, and is the modelled Barabise peak within a factor of two of 700–900 m³/s? Publish the result on the methods page whether it passes or fails. A single public hindcast will do more for credibility than any number of added features.

**Committed position.** Fix speeds, windows and attenuation now (grade A–B for speeds and attenuation on one event; D for exact coefficients). Expand origins in the medium term with tiering (grade B for the inventories, C for the misreading risk). Do not build process-chain physics.

## 5. Earthquake Scenarios

### A. The real defect: one site condition everywhere

The Atlas computes peak ground acceleration (PGA) with BSSA14, a global NGA-West2 ground-motion model (GMPE, the equation predicting shaking from magnitude, distance and site condition), using a single user-set Vs30 with a default of 760 m/s, which corresponds to rock. That default is wrong for the places where most people live. Kathmandu Valley, Pokhara and the Terai sit on sediments that amplify shaking. The fix is cheap and well documented. The USGS publishes a Global Vs30 Mosaic based on topographic slope with regional insets (Heath et al. 2020), on a 30-arc-second grid with values from 98 to 2,197 m/s, as a 631 MB global file [25]. A Nepal clip is a few megabytes. The best delivery is not a separate raster at all. Sample Vs30 once at build time onto the same cells as the HRSL population grid the Atlas already uses, so each cell carries one extra number. Keep the manual override for users who know their site.

**Boundary condition.** A slope-based proxy is coarse in flat basins, and the Kathmandu basin's documented long-period amplification is not something a Vs30 term or a PGA map captures. The earthquake panel should say so in a fixed "not modelled" note: basin resonance, building response, landslides and liquefaction. That note matches what the model's own data file already lists as omitted.

### B. Is BSSA14 the right engine? A partial yes, now weakened

A 2024 preprint ranking 16 GMPEs against 465 spectra from 122 earthquakes in the western and central Himalaya and the Indo-Gangetic Plains is the strongest evidence on hand, though it is not peer reviewed. For the Himalaya region it finds that "the NGA-West2 GMPEs are not suitable too for most of the periods", with ASK14 and IDR14 scoring better than other NGA-West2 models, and recommends ZHAO06, KAN06, BJAN19 and ZHAO16 at PGA [26]. For the Indo-Gangetic Plains the picture is kinder to BSSA14: it appears in the recommended suites at 0.2 s and 1.0 s, though not at PGA [26]. The authors stress that "no single GMPE can be considered suitable for the entire range of spectral periods" and leave weighting to future work [26].

The practitioner reading is therefore a staged one:

1. **Now:** keep BSSA14, fix Vs30, and show the model's own ±1 standard deviation band as the main uncertainty display (the code already returns median and sigma).
2. **Next:** run a Gorkha 2015 hindcast (validation task V1). Compare Atlas PGA against the USGS ShakeMap for the event. The ShakeMap Atlas is the consistent archive USGS uses "for calibrating global earthquake loss estimation" [27]. Report bias by site class.
3. **Then:** if the hindcast shows material bias, add a small ensemble, for example BSSA14 plus ASK14 plus one Zhao-family model as suggested by the preprint [26]. Display the ensemble spread as the range. An ensemble costs more client-side computation but no extra download beyond coefficients, a few kilobytes.

The boundary condition is that a public scenario tool shown in five shaking bands tolerates a factor of about 1.5–2 error, comparable to the model's own scatter. An engineering or building-code use does not, and the Atlas should say plainly that it is unsuitable for that.

### C. Exposure, damage and loss: how far to go

The Atlas counts population per PGA band from HRSL. That is the right level. Adding fatality or economic-loss estimates in the style of USGS PAGER is tempting, but PAGER is calibrated against the ShakeMap Atlas of about 14,100 events [27] and country-specific vulnerability data that a volunteer project cannot reproduce or validate. The defensible additions are exposure-type facts: schools and health posts per band from OSM [22], and counts rounded with an "order of magnitude" note. USGS's own language is a useful model: its scenarios "describe the expected ground motions and effects of specific hypothetical large earthquakes" [27]. That is hypothetical, specific and descriptive, not predictive.

### D. Presets and history

The ten past-event presets (M6–8.5) are the Atlas's best teaching device, because people remember 2015. Each preset should link to the archived NEMRC record and, for Gorkha, show the hindcast comparison once it exists. A visible "how well does this model reproduce 2015?" panel is the most persuasive trust signal the earthquake tool can carry.

**Committed position.** The single-Vs30 default is the defect to fix first (grade B for the data and method; D for the size of the improvement until V1 runs). The GMPE question is open, and the evidence (grade C, one preprint) supports a hindcast-gated ensemble rather than an immediate engine swap.

## 6. Serving Nepali Users: Language, Access and Reach

### A. Who can actually open the site

The connectivity numbers conflict, and the conflict is informative. The household survey (NMICS 2024/25, 12,802 households) found 82% of households with internet access and 85.1% with a smartphone. Access drops to 73% in rural areas, 68.5% in Karnali and 52.9% in the poorest group, and women's phone ownership (81.6%) trails men's (90.4%) [4]. The ITU's 2026 index puts *individual* internet use at only 48.4%, household access at 52.5%, 3G coverage near 90% and 4G at 81.6% [13]. DataReportal counts 16.6 million users, 56.0% penetration, and 13.0 million people (44%) offline at the end of 2025 [7]. These figures measure different things: a household with any connected member versus an individual who uses the internet. For a hazard atlas, individual use is the better proxy. Skills are the sharper constraint: only 19.2% of survey respondents verified information they found online and 24.2% could copy and paste files [4].

**Practitioner reading.** The realistic audience is mid-literacy smartphone users, officials, teachers, journalists and NGO staff, plus everyone those people print for. Design for a cheap Android phone on a 3G signal, in Nepali, with no assumption of map-reading skill.

### B. A page-weight budget is a policy, not a preference

Set a budget, aiming for an initial load of about 1 MB compressed with 3D terrain off. Enforce it in CI so that each new layer has to justify its weight. Concretely: load the search index on first focus, load outburst origins when the flood tool opens, load the population and Vs30 grid when the earthquake tool opens, and make terrain opt-in. Per-subscription mobile data use averages 17.6 GB a month, and high-usage mobile data costs 2.9% of gross national income per head [13]. A heavy page is a real cost for the users the Atlas most needs.

### C. Offline: a modest PWA, not a field server

A service worker (a browser script that caches files for offline use) that caches the app shell, UI strings, district and scenario files, and a Nepal-extent PMTiles basemap is cheap on a static site. It lets a teacher or ward official open a saved scenario without signal. The evidence for anything more ambitious is weak. A FOSS4G study of a Raspberry Pi PMTiles server reports latency equal to or better than cloud hosting and more than 14 hours on a 20,000 mAh battery for UN field kits [28]. It is a self-reported conference abstract with no Nepal users, so it proves the format works offline but says nothing about reach. Treat field servers as a partner's option, not an Atlas build.

### D. Language: Nepali-first, written in parallel, in Unicode

- **Nepali-first defaults** for Nepali browsers, with an always-visible language switch and `lang` attributes on every block. Nepal's accessibility position paper lists specifying page language among its website recommendations [29].
- **Parallel authorship, not machine translation**, for every hazard term, banner and band label, with a short shared glossary. The ISET study's call to "tailor messages in a language that different users understand" [12] and the unstandardised DHM SMS wording [3] both point to the need for a fixed, tested vocabulary.
- **Unicode only, never legacy fonts.** The accessibility checklist is blunt: Nepali written in "Preeti" or "Kantipur" fonts is "just graphic representation of Nepali text" and inaccessible [30].
- **Plain language.** The checklist lists technical jargon and text-heavy content as literacy barriers [30]. Every scenario page should start with one plain sentence before any numbers.

### E. Accessibility: the map is not the content

WCAG's four principles (perceivable, operable, understandable, robust) [31] cannot be met by a WebGL map alone, because a screen reader cannot read it. The buildable answer is a text equivalent for every map output: a table of districts or places with arrival windows or shaking bands, readable without the map. Prayatna Nepal's audit of Nepali sites, run with testers who have disabilities, found "inappropriate landmarks, heading styles and inaccessible colour contrast". Its checklist includes 4.5:1 contrast, semantic landmarks, skip links, keyboard operation and screen-reader-announced status messages [29]. The 2011 census counted 1.94% of the population with a disability, and the 2011 living-standards survey 3.6% [29]. Both are likely undercounts, and older users with low vision are a large share of any hazard audience. The five PGA bands and any flood colours must also be distinguishable for colour-blind users, since Lindell notes colour-blindness affects hazard-map reading [5].

**Committed position.** Nepali-first search, labels and text, a 1 MB budget and text equivalents come before offline infrastructure. Grade B for the survey and guideline evidence; no evaluated user study exists, so V3 and V7 are needed. Bandwidth cost of these changes: negative (they reduce weight). Maintenance: a glossary and a CI budget check, both low.

## 7. Printable Reports, Trust and Risk Communication

### A. What a hazard map is to its reader

Lindell's review of hazard-map research makes the central point: a hazard map "is a form of warning message" in the reader's mind, whatever its author intended [5]. Readers apply a proximity heuristic, judging risk as falling with distance from the source, and they misread uncertainty displays. Many people read the US hurricane uncertainty cone as meaning zero probability outside it [5]. Isarithmic (contour-style) displays convey exposure uncertainty better than binned shading, and risk-area borders are easier to read when tied to recognisable features such as rivers, roads and jurisdictions [5]. A US survey of 953 residents found that 57% of those in official floodplains perceived *lower* risk than the official map, and 27% of all respondents were unsure. The authors recommend interactive mapping and community education [32]. The Slavik, Fish and Peters review distils six design strategies: show only key data, tailor and test with the audience, use salient cues, leverage emotion, aid pattern recognition, and limit distractions [33].

### B. A scenario-report specification

Turning that evidence into a buildable one-page A4 report (Nepali on the front, English on the back, or side by side):

1. **Fixed bilingual frame on every page and map:** "Hypothetical scenario – not a forecast, not a warning. Follow official DHM / NDRRMA alerts." Include a scenario ID, model version, run date and a short URL to recreate the scenario.
2. **One plain sentence first:** for example, "If this lake released this volume, the first water could reach [place] between about 18 and 40 minutes later."
3. **A place table, not only a map:** the arrival windows or shaking bands for named wards and places the reader will recognise, consistent with Lindell's finding on recognisable features [5].
4. **No "safe" or "unsafe" labels.** The lowest band reads "lower modelled shaking in this scenario – not a no-risk zone". Band edges are soft on screen and noted as approximate in print.
5. **Ranges, not points:** time windows, rounded population counts, ±1 sigma bands.
6. **A "not modelled" box** listing what the model leaves out (Sections 4–5).
7. **What to do and whom to ask:** links to official channels, municipal emergency contacts, and pointers to DHM bulletins. ISET's point that messages without advisories "become meaningless" applies to scenarios too [12]. The advice must be generic preparedness (know the route uphill, keep the official number) and never a scenario-specific evacuation instruction, which only authorities may issue.
8. **Accessible format:** print from accessible HTML and offer the same report as an HTML or text page. Nepal's 2026 accessibility checklist states that Nepali PDFs are "not accessible to screen readers even if they are written in Unicode" and that accessible versions should circulate as text formats [30]. Prayatna's position paper makes the same point [29].
9. **Typography:** a Devanagari font with good conjunct support, no letter-spacing on Nepali text [20], at least 4.5:1 contrast [29], and readable in greyscale photocopies, since many copies will be photocopies.

### C. Bands or gradients? Settle it with a test

The evidence points two ways. Isarithmic displays convey uncertainty better [5], but Nepali stakeholders asked for colour codes, and one interviewee in the same study said "people don't have an idea of uncertainty; we have to train people (what actions to take) under certain range of certainties" [3]. The geovisualisation review's strategy of tailoring and testing with the audience [33] is the tiebreaker. Keep the five soft-edged bands as the default, offer a contour view as an option, and let a reader test decide (V3). The tsunami-map finding that general users preferred about five elements while experts wanted about seven [6] is a reminder that two audiences, residents and planners, may need two views of the same scenario.

### D. Provenance as a trust feature

Every report and map should show where each input came from: the official data source and its timestamp, the lake inventory and licence, the population grid, the model and its version. A public changelog for model defaults (for example "2027-01: wave-speed bracket changed from 2/4/6 to 3/6/9 m/s after the 2016 Bhote Koshi hindcast") turns parameter changes from silent edits into accountable decisions. This costs a few lines per page and is the main thing that distinguishes a credible unofficial atlas from a competing authority.

**Committed position.** The bilingual frame, ranges, no safe/unsafe wording and accessible HTML print should ship in the first quarter (grade B for direction; C–D for exact wording until V3). The band-versus-gradient choice stays open until tested.

## 8. Missing Hazards and Capabilities

### A. Landslides: the largest gap, best filled as context rather than prediction

Landslides are the hazard the Atlas does not cover, and it is a lethal omission. Dave Petley recorded 38 fatal landslides killing 135 people in Nepal by 17 July 2024, with deaths rising sharply from the mid-June monsoon onset [34]. The September 2024 event that killed about 250 people was a flood *and* landslide disaster [10]. Outbursts trigger landslides too: Cook et al. found river-connected landslide area in the 2016 monsoon about 100 times a typical year's after the Bhote Koshi outburst [1]. Nepal's EW4All roadmap is explicitly multi-hazard, covering floods "including glacial lake outburst floods", landslides, heat and cold waves, forest fires and other hazards [35].

**Boundary condition.** Landslide *prediction* needs rainfall forcing, susceptibility models and validation that a static volunteer site cannot sustain. A landslide *context* layer is cheap and useful: past incidents by district and year from BIPAD's incident records (once confirmed and licensed), plus open inventories where licences allow (Petley's data are reuse-with-acknowledgement under a non-commercial licence [34]). Add a "this scenario can trigger landslides along the channel" note in every flood and earthquake result. Do not build a landslide scenario model.

### B. Impact-based information

The direction of Nepal's official system is impact-based warning: "communicating not only what hazard is expected, but what it could mean for people, livelihoods, infrastructure, and essential services" [35]. BIPAD's module does this for floods with OSM exposure and Red Cross household data [15]. The Atlas's population-per-band and arrival-window outputs are already a simple impact view of hypothetical scenarios. The cheap extension is to count named facilities (schools, health posts, bridges, hydropower intakes from OSM) inside each scenario's footprint. That is impact information without loss modelling.

### C. Climate and change over time

Climate projections are not worth building into the Atlas. Downscaled projections for Himalayan catchments are uncertain, and presenting them on a public map invites the over-reading Section 7 warns about. Measured change is worth showing: glacial-lake growth between inventory epochs [24, 23], the archive of official records the scraper accumulates (Section 2), and loss trends by district from BIPAD.

### D. Transboundary and cascade awareness

The 25 Tibet-side lakes on the ICIMOD list [23] and the EW4All roadmap's "particular emphasis on cross-border and transboundary information sharing" [35] justify a transboundary view. Draw Nepal-draining catchments across the border, mark the entry points (for example Rasuwagadhi), and pre-compute arrival windows from the border to downstream towns. This is the scenario that most clearly shows why the Atlas exists before an event: in the 2026 flood, notice from across the border was reported as a key failure, and no map consulted after the trigger could have made up for it.

### E. Earthquake early warning and other live systems: out of scope

Earthquake early warning, cell broadcast and sirens are operational systems. CREWS reports that Nepal has completed cell-broadcast *readiness* [36], which is a government and operator procurement. The Atlas's role is to explain these systems and link to them, not to imitate them.

**Committed position.** Add a landslide context layer and landslide caveats in the medium term (grade B for the burden, C for open-data availability). Add facility counts and lake-change displays (grade B, low cost). Decline climate-projection and landslide-prediction modelling. That restraint is itself an improvement, because each would add maintenance burden and misreading risk out of proportion to its evidence.

## 9. Impact, Partnerships and Sustainability

### A. Fit the policy moment

Nepal is mid-way through building a national multi-hazard early warning system, and the Atlas should align with it. The EW4All roadmap was finalised at the end of 2025, is estimated to need US$360 million for 2026–2030, and calls for warnings in "a language and form [people] understand", with the participation of persons with disabilities, women and remote communities in designing messages [35]. Its endorsement was delayed into mid-2026 by "post-election turmoil, change of government administrations, and civil unrest", and a national CREWS Nepal proposal remains pending [36]. Two things follow. Official capacity is stretched and slow, so a free, well-built preparedness layer that does not compete with official alerts fills a real gap. And the roadmap's pillar on "disaster risk knowledge" [35] is the natural place for the Atlas to offer itself: as an open, bilingual scenario and explanation resource that official programmes can link to or adopt.

### B. Partnerships in order of value

1. **NDRRMA and DHM:** a written data-use confirmation for BIPAD and DHM content and a named contact for corrections. Without it, the mirror role rests on assumption.
2. **ICIMOD:** permission or a reuse statement for the lake inventory, which is published under a no-derivatives licence [23], and ideally a review of the outburst scenario wording.
3. **Kathmandu Living Labs and OSM Nepal:** KLL has 30+ projects, 40+ partner organisations and more than 5,000 people involved [22], and runs the community that maintains Nepali names in OSM [16, 17]. Search quality depends on that community, and an Atlas that contributes name fixes back to OSM improves both.
4. **Universities and student mapping groups:** WikiProject Nepal lists geomatics student societies and YouthMappers chapters [16]. OpenDRI recommends getting materials into "curricula" and funding "Living Labs" as sustainability mechanisms [2]. A semester project validating one hindcast or translating a glossary is the right-sized contribution.
5. **Practitioner NGOs and the Red Cross**, as users of printed reports in community preparedness work, the setting where WMO says vulnerable groups need education on "how and where to receive warnings" [11].

### C. Sustaining a volunteer project

The OpenDRI–GeoNode case is the best available model. GeoNode became self-sustaining because the project was structured to "encourage participation by others who have similar needs", until the original sponsor was "just another partner" [37]. The report stresses that documentation "is crucial for making the software easy for new users to try out and onboarding new contributors" [37]. For the Atlas this means a contributor guide, a methods page per model, issue templates for "wrong place name" and "wrong data", and keeping everything reproducible from the repository. The warning is equally clear: "the risk ... is that risk data becomes stale" once champions move on [2]. The fail-loud pipeline (Section 2) is therefore also a sustainability measure, because it tells a successor maintainer what broke.

### D. Measuring impact without tracking people

A static, credential-free site can still learn whether it matters. Use privacy-preserving, cookie-free page counts by language and page, count print-button clicks per scenario, run a search "no results" log (stored as aggregates in the repository), and collect a short feedback form that links to a public issue. Report these quarterly. Small, honest usage numbers will persuade a partner more than ambitious claims.

**Committed position.** Seek written permissions before expanding data use, build a contributor community before building features, and position the Atlas inside the EW4All risk-knowledge pillar as a complement. Grade B–C (institutional documents and one well-documented open-source case). Maintenance: governance takes time, but it is the only route to the project outliving its founders.

## 10. Prioritised Roadmap

### A. Principles for sequencing

1. **Fix before you add.** Defaults that understate hazard rank above new hazards.
2. **Every change carries its own test.** Where the evidence is C or D, a validation task gates the next step.
3. **Weight is a budget.** Every data addition states its download cost and loads on demand.
4. **Expansion ships with its safeguard, or not at all.** Tiering and labelling are part of the feature, not a follow-up.
5. **Prefer changes that reduce future maintenance**, such as health files, schema checks and a contributor guide.

### B. Near term (next 3–6 months)

| # | Change | Evidence | Bandwidth cost | Maintenance | Gate / exit test |
|---|---|---|---|---|---|
| N1 | Per-source health file, schema checks, staleness chips, last-good fallback, CI issue on repeated failure | B | <2 KB | low, reduces future work | 30-day feed audit (V4) |
| N2 | Fixed bilingual "hypothetical, not a forecast or warning" frame on all maps and prints; scenario ID, version, date | B (direction) | negligible | very low | reader test (V3) |
| N3 | Flood/outburst speed bracket to 3/6/9 m/s; arrival windows per place; "not modelled" list | A–B (one measured event [1]) | negligible | low | 2016 Bhote Koshi hindcast (V2) |
| N4 | Default peak attenuation for clear-water scenarios with an amplification warning and monsoon-flood crossover note | B [1] | negligible | low | V2 peak within ×2 at Barabise |
| N5 | Per-cell Vs30 from the USGS slope-based grid baked into exposure cells; show ±1 sigma band; basin caveat | B [25] | small, on demand | very low | Gorkha hindcast (V1) |
| N6 | Search index from OSM `name`/`name:ne`/`name:en`/`alt_name` plus Nepali/romanisation normalisation | B [17, 18] | ~200–400 KB, on focus | low (quarterly rebuild) | variant test set (V5) |
| N7 | Devanagari labels via positioned-glyph stack or HTML overlays; no letter-spacing on Nepali | B [19, 20] | small font files | low | visual check on 3 browsers |
| N8 | Page budget ~1 MB, terrain opt-in, lazy-loaded tools, CI budget check | B [13, 4] | negative | low | throttled 3G test (V6) |
| N9 | Accessible HTML report as the print source; text tables for every map; WCAG basics | B [29, 30, 31] | negligible | low | screen-reader audit (V7) |

### C. Medium term (6–24 months)

| # | Change | Evidence | Bandwidth cost | Maintenance | Precondition |
|---|---|---|---|---|---|
| M1 | Tiered outburst origins: ICIMOD Nepal, transboundary, and open-inventory lakes ≥0.02 km² with volume ranges and cascade option | B [23, 24]; C for misreading risk | ~100–300 KB, on demand | medium (inventory refresh about every 5 years) | V3 passes; ICIMOD reuse statement |
| M2 | Lake-change display between inventory epochs | B [24] | tiny | low | M1 data loaded |
| M3 | GMPE ensemble (e.g. BSSA14 + ASK14 + a Zhao-family model) with spread shown | C [26] | a few KB coefficients | medium | V1 shows material bias |
| M4 | Gorkha preset with hindcast comparison panel | A once V1 runs | small | low | V1 |
| M5 | Nepal-extent PMTiles basemap self-hosted; service-worker cache of shell, strings, data and basemap | B [21]; C [28] | one-time ~tens of MB opt-in offline pack | medium (rebuilds) | N8 done |
| M6 | Archive of official data as dated files; BIPAD loss tables by district | B [15] | small | low | NDRRMA data-use confirmation |
| M7 | Landslide context layer and landslide caveats in flood and quake results | B–C [34, 10] | ~100 KB per year | medium | licences confirmed |
| M8 | Facility counts (schools, health posts, bridges) per scenario footprint | B [22] | small | low | OSM extract pipeline from N6 |
| M9 | Transboundary catchments and border entry points with precomputed arrival windows | B [23, 35] | small | low | M1 |
| M10 | CAP consumer: parse and display DHM CAP verbatim when published; never emit CAP | B [14, 9] | small | low | official feed exists |
| M11 | Partnerships: NDRRMA/DHM data letter, ICIMOD review, KLL/OSM name loop, university hindcast projects | B–C [37, 2, 22] | none | medium, ongoing | none |
| M12 | Hourly copy of verified BIPAD river/rain JSON with staleness chips | D | small | low | N1 stable for 60 days |

### D. Validation tasks as first-class work

- **V1, Gorkha 2015 shaking hindcast.** Run the Atlas at M7.8 with the slope-based Vs30, compare against ShakeMap PGA [27], and report median bias and spread by site class. *Decision rule:* material bias (for example more than about 0.3 natural-log units) promotes M3.
- **V2, Bhote Koshi 2016 outburst hindcast.** Compare arrival windows against the 8.7 m/s front and peaks against Chaku and Barabise estimates [1]. *Decision rule:* if the window misses the observed timing, revisit the speed bracket; if the Barabise peak is off by more than ×2, revisit attenuation.
- **V3, Nepali reader test.** Ten to twenty readers across literacy levels see a scenario page and a print. Ask: is this a warning? Is the lowest band safe? When could water arrive? *Decision rule:* if more than a small minority read it as an official warning or a safe zone, revise the frame before M1 ships. This test closes the open question that both the outburst expansion and the uncertainty design depend on [6, 5, 33].
- **V4, feed health audit.** Thirty days of the health file, counting failures per source.
- **V5, search test set.** Two hundred real place-name queries in Devanagari and common romanisations [17], with a target success rate published.
- **V6, low-end device test.** Throttled 3G on a budget Android phone, against the 1 MB target.
- **V7, accessibility audit** with screen-reader users, ideally through a disability organisation, following Prayatna's user-testing approach [29, 30].

### E. What not to do

- Do not run a warning channel, send SMS, or publish CAP under the Atlas's name. Official chains work for riverine floods [8] and are being extended through CAP and cell broadcast [14, 36].
- Do not build process-chain outburst physics, landslide prediction, loss modelling or climate projections. Each adds maintenance and misreading risk the evidence does not justify for this project.
- Do not add a server or credentials. Every recommendation here fits the static, free, read-only design.

### F. Looking ahead

Over the next two years the Atlas's environment will change in three ways, and the roadmap is built to absorb each. First, the official system will probably start publishing CAP and impact-based products [14, 15]. When it does, the Atlas's live panels should become thin, verbatim displays of official content, and the scrapers can retire. That is a maintenance gain, not a loss. Second, open lake inventories are moving toward annual or seasonal updates; the HMA authors name "annual or intra-annual seasonal datasets" as the next step [24]. An Atlas with a tiered, refreshable origin layer can absorb those updates mechanically. Third, Nepal's EW4All roadmap will, if funded, put money into risk knowledge and inclusive communication [35]. An open, bilingual, validated, accessible scenario tool with a published hindcast record is exactly the kind of asset such programmes adopt rather than rebuild. The sequencing here is meant to make the Atlas adoptable. The near-term work buys credibility through validation and honesty about limits. The medium-term work buys coverage, because only a credible tool can expand without being misread as a competing authority.

**Final committed position.** The Atlas improves most by becoming the most *honest* simple hazard tool in Nepal: realistic defaults, ranges everywhere, loud staleness, Nepali-first reach, and a public validation record. It does not need to become the most sophisticated one. Every item in Section 10 serves that aim, and every expansion waits for the test that justifies it.

## Sources

[1] Cook et al. (2018), Glacial lake outburst floods as drivers of fluvial erosion in the Himalaya (Science; author PDF). https://wpg.forestry.oregonstate.edu/sites/default/files/seminars/cook_etal_2018_glacial_outburst_erosion.pdf
[2] OpenDRI Guide, Chapter 7: Sustaining (World Bank / GFDRR). https://opendri.github.io/guide/oldchapters/chapter7.html
[3] GC - Communicating complex forecasts: an analysis of the approach in Nepal's flood early warning system. https://gc.copernicus.org/articles/3/49/2020/
[4] Nepal’s 82% households have internet, but digital skills fall short. https://www.nepalitelecom.com/2026/02/nepals-82-households-have-internet-but-digital-skills-fall-short.html
[5] Lindell (2020), Improving Hazard Map Comprehension for Protective Action Decision Making (Frontiers in Computer Science). https://www.frontiersin.org/journals/computer-science/articles/10.3389/fcomp.2020.00027/full
[6] Assessing Perceptions and Interpretations of Tsunami Maps: Insights from the Public and Risk Experts. https://agris.fao.org/search/en/records/687a93b89d6e0577321f5d82
[7] Digital 2026: Nepal — DataReportal – Global Digital Insights. https://datareportal.com/reports/digital-2026-nepal
[8] Reducing flood casualties in Nepal. https://wmo.int/site/science-action/water-resource-monitoring-and-management/reducing-flood-casualties-nepal
[9] Nepal holds national consultation – Early Warnings for All and WITH All. https://wmo.int/media/news/nepal-holds-national-consultation-early-warnings-all-and-all
[10] Nepal: Flood impact assessment. https://doi.org/10.4060/cd5014en
[11] Improved Flood Preparedness and Community-based Early Warnings Needed in Nepal. https://wmo.int/media/magazine-article/improved-flood-preparedness-and-community-based-early-warnings-needed-nepal
[12] Missed opportunities in utilization of weather forecasts: an analysis of October 2021 disaster in Nepal. https://preventionweb.net/quick/71365
[13] Nepal returns to global ICT Index but digital use still lags infrastructure growth. https://kathmandupost.com/science-technology/2026/07/02/nepal-returns-to-global-ict-index-but-digital-use-still-lags-infrastructure-growth
[14] WMO strengthens Early Warning Services in Nepal. https://wmo.int/media/project-update/wmo-strengthens-early-warning-services-nepal
[15] An impact-based early warning module in Nepal’s BIPAD portal. https://www.undrr.org/resource/case-study/impact-based-early-warning-module-nepals-bipad-portal
[16] WikiProject Nepal - OpenStreetMap Wiki. https://wiki.openstreetmap.org/wiki/Nepal
[17] Nepal/Meetings/2022-12-15 - OpenStreetMap Wiki. https://wiki.openstreetmap.org/wiki/Nepal/Meetings/2022-12-15
[18] Key:name:ne - OpenStreetMap Wiki. https://wiki.openstreetmap.org/wiki/Key:name:ne
[19] Basemap Localization. https://docs.protomaps.com/basemaps/localization
[20] Devanagari Gap Analysis. https://www.w3.org/TR/deva-gap
[21] PMTiles Concepts. https://docs.protomaps.com/pmtiles/
[22] About Kathmandu Living Labs. https://kathmandulivinglabs.org/about-us
[23] ICIMOD/UNDP (2020), Inventory of Glacial Lakes and Identification of Potentially Dangerous Glacial Lakes in the Koshi, Gandaki, and Karnali River Basins. https://nepal.un.org/sites/default/files/2020-10/Inventory_Glacial_Lakes_2020_Full2.pdf
[24] Automated satellite-based glacial lake inventory and change detection in High Mountain Asia. https://www.nature.com/articles/s41598-026-35446-0
[25] Vs30 Models and Data. https://earthquake.usgs.gov/data/vs30/
[26] Selvan & Sinha (2024), Suitability Analysis of Ground Motion Prediction Equations for Western and Central Himalayas and Indo-Gangetic Plains (arXiv preprint 2410.05918). https://arxiv.org/abs/2410.05918
[27] ShakeMap. https://earthquake.usgs.gov/data/shakemap/
[28] Performance Comparison of an Offline PMTiles-Powered Map Server Running on a Raspberry Pi for Decentralized Geospatial Access (FOSS4G 2025 talk). https://talks.osgeo.org/foss4g-2025/talk/TCZTK7/
[29] Prioritizing Digital accessibility for Inclusive. https://prayatnanepal.org/wp-content/uploads/2022/12/Position-Paper_FINAL.pdf
[30] Digital Accessibility Checklist. https://www.prayatnanepal.org/wp-content/uploads/2026/06/Digital-Accessibility-Checklist_Comprehensive-final.pdf
[31] Introduction to Understanding WCAG 2.1. https://www.w3.org/WAI/WCAG21/Understanding/intro
[32] UVM Study Reveals Millions at Risk. https://www.uvm.edu/cals/news/uvm-study-reveals-millions-risk
[33] Slavik, Fish & Peters, Using geovisualizations to educate the public about environmental health. https://par.nsf.gov/servlets/purl/10560604
[34] Fatal landslides in Nepal in 2024 to date. https://eos.org/thelandslideblog/nepal-landslides-2024
[35] Early warnings for all: Nepal must turn commitment into action (The Himalayan Times). https://thehimalayantimes.com/opinion/early-warnings-for-all-nepal-must-turn-commitment-into-action
[36] CREWS EW4All Accelerator Project Final Report. https://crews-initiative.org/wp-content/uploads/2026/04/CREWS-EW4All-Accelerator-Final-Report.pdf
[37] OpenDRI and GeoNode: A Case Study on Institutional Investments in Open Source (World Bank / GFDRR). https://documents1.worldbank.org/curated/en/713861563520709009/pdf/Open-Data-for-Resilience-Initiative-and-GeoNode-A-Case-Study-on-Institutional-Investments-in-Open-Source.pdf
