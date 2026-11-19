# Improving the Himalayan Disaster Atlas: Honest Defaults First, Preparedness Second, Expansion Last

**Executive summary.** The Himalayan Disaster Atlas improves most by becoming honest before it becomes bigger. Its architecture (a static, free, credential-free site with bilingual text, constitutional Nepali district names and printable reports) is sound and should stay. What needs to change is a set of defaults that all lean the same way: they make hazard look smaller than the evidence supports. The flood and glacial-lake outburst flood (GLOF) engine moves its wave at 2, 4 or 6 m/s, but the only peer-reviewed measurement of a Nepal outburst front is 8.7 m/s [1]. The earthquake engine puts every resident on rock and relies on one ground-motion model, BSSA14, whose model family a 2024 preprint ranking found "not suitable" for most periods in the Himalaya [2]. Outburst origins stop at an official list that did not include the source of the 2024 Thame flood, "a cascade of two small lakes that had not previously been considered dangerous" [3]. And every output is a single number or a crisp band, although hazard-map research shows that readers treat a map as a warning message and read its lines as certainty [4, 5].

The second finding concerns role. Nepal's official riverine warnings work: flood deaths fell from 166 in 2017 to 27 in 2022 despite larger floods [6]. Where warnings still fail (sub-hour cascades, generic wording, last-mile reach), a daily static copy cannot help during the event. The Atlas earns its place before the event: pre-computed arrival windows for named places, printed bilingual cards, a near-source action cue, and a copy of official data that shows its age and fails loudly when stale.

The near-term priorities (three to six months) are, in order: a fail-loud data pipeline with visible data age; a fixed bilingual "hypothetical scenario, not a forecast or a warning" frame on every view and page; a faster flood wave-speed bracket with per-place arrival windows and a two-branch peak display; a per-cell site-condition layer and visible uncertainty bands with consequence wording in the earthquake tool; Nepali-aware search and correct Devanagari labels inside a page-weight budget; and accessible HTML as the source of every printed report. The medium-term work (six to twenty-four months) expands coverage: tiered lake origins, a small ground-motion ensemble, a landslide history layer, an archive of official data, a CAP reader and formal data partnerships. Each expansion ships with its safeguard and is gated by a validation the project can run itself: a Gorkha 2015 shaking hindcast, a 2016 Bhote Koshi arrival hindcast and a small reader test with Nepali users.

## 1. Where the Atlas Stands Today

A hazard atlas does three jobs. It shows what official agencies are reporting now, it lets people explore "what if" scenarios, and it turns both into something a resident or a ward official can act on. The Himalayan Disaster Atlas does all three for floods, GLOFs and earthquakes in Nepal. Its flood engine moves a release hydrograph (the curve of discharge over time at the source, here triangular or rectangular) downstream at three constant speeds with no attenuation, starting from a fixed list of lake and river-reach origins. Its earthquake engine computes peak ground acceleration (PGA, the strongest ground acceleration at a site) with the BSSA14 model for one user-set site condition, then counts people in five PGA bands from a high-resolution population grid.

### A. What already works

The Atlas makes several choices that most hazard portals get wrong. It is static and free with no login, so it costs almost nothing to run and survives traffic spikes. That matters more than it seems: the World Bank's open-data programme found that none of its funded projects had built a self-sustaining revenue stream, and that "without continuous funding" communities fall back on older methods and risk data goes stale [7]. A design with near-zero running cost avoids the most common way civic risk platforms die. The site is bilingual and uses the Nepali district names in Schedule 4 of the constitution, which addresses a documented weakness in Nepali hazard messaging: DHM's SMS alerts have had "no standardised language", appearing in Nepali, English or romanised Nepali [8]. Its printable reports reach people the website does not, in a country where only 14.7% of households report radio access and 42.8% a television [9]. Finally, the earthquake model files already list what they leave out (a basin-depth term, a regional anelastic adjustment, spatial correlation of residuals), and the code computes a standard deviation that the map never shows. That habit of disclosure is the seed of the project's best improvement path.

### B. The common pattern behind the gaps

Taken one hazard at a time, the gaps look unrelated: a site slider, a wave-speed triplet, a lake list. Side by side, they share a direction.

| Default today | What the evidence shows | Direction of error |
|---|---|---|
| Vs30 = 760 m/s (rock) everywhere | Kathmandu valley and Terai sit on sediment; Gorkha motions at Siddhitol exceeded building-code design levels [10] | Understates shaking where most people live |
| BSSA14 as the only model | On Himalayan records, recorded short-period shaking sat about one standard deviation above BSSA14's median (preprint) [2] | Understates median shaking and hides model disagreement |
| Wave speed 2/4/6 m/s | Measured outburst front 8.7 m/s [1]; back-calculated Andean outburst implies about 5.5–10.6 m/s [11] | Arrival too late near the source |
| Peak held constant downstream | Clear-water outburst peaks roughly halved over tens of kilometres [1] | Overstates far-field peak for clear water; silent on cascades that grow |
| Origins limited to listed lakes | Thame 2024 came from unlisted lakes [3]; the list excludes seismic triggers [12] | Hides real sources |
| Five crisp PGA bands | Stone masonry is "highly vulnerable even in the case of low to moderate ground shaking" [13] | The lowest band reads as safe |

Not every error points the same way. Holding an outburst peak constant overstates it far downstream for clear-water floods, and Section 4 treats that seriously. But the errors that matter most for life safety (arrival too late, shaking too low, a missing source) all err toward reassurance. People already judge their risk as falling away with distance from a source [4]. A preparedness tool that reassures by default works against its own purpose.

### C. The test applied, and how evidence is weighed

The Atlas's next stage should be judged by one question: would a resident who read it, printed it and acted on it be better calibrated about their own exposure than one who did not? By that test, calibration (defaults and ranges), framing (hypothetical, not a warning) and preparedness content (arrival windows, cues, plans) outrank the usual feature list of more feeds, a landslide model, live alerts and heavier 3D. The model classes are acceptable for a public preparedness tool; their defaults are not. That conclusion holds fully for floods and partly for earthquakes, where the evidence against a single ground-motion model is strong enough to justify a modest change of engine.

Every recommendation below carries an evidence grade. **A** means measured against observed events or tested with users. **B** means peer-reviewed or official documentation that is indirect for this use. **C** means a preprint, conference abstract, self-report or journalism. **D** means reasoning with no direct test. Where a change rests on C or D evidence, the roadmap pairs it with a validation task.

## 2. Official Data Feeds: DHM, BIPAD and NEMRC

Three agencies supply the Atlas's live data. The Department of Hydrology and Meteorology (DHM) runs Nepal's river and rain gauges, issues forecasts and sends flood warnings by SMS and bulletin. BIPAD is the disaster information portal of the National Disaster Risk Reduction and Management Authority (NDRRMA), with incident, damage and loss records and "real time" rainfall, streamflow and earthquake data [14]. The National Earthquake Monitoring and Research Center (NEMRC) locates earthquakes. The Atlas copies these sources once a day. Only BIPAD's river-station and rain-station JSON endpoints are verified as machine-readable; DHM bulletins and forecasts, NEMRC and NDRRMA pages are HTML scrapes, several needing JavaScript rendering. The question for this layer is what a daily, unofficial copy can safely do.

### A. Official warnings work for rivers and fail at the last mile

Nepal's riverine forecasting has a measured success. WMO credits DHM's Flood Forecasting and Early Warning Services (2016) and the South Asian Flash Flood Guidance System (2018) for the fall in flood deaths from 166 to 27 between 2017 and 2022 [6]. A World Bank project upgraded 88 meteorological and 70 hydrological stations and installed Nepal's first C-band weather radar [15], and one operator alone sent more than 4.4 million flood and landslide SMS alerts in two months of the 2023 monsoon [16].

The failures sit elsewhere. Around 250 people died in the September 2024 floods "in-spite of a clear and categorical alert, four days in advance" from DHM [17]. The national Early Warnings for All consultation listed "shortcomings including in the operationalization of the Common Alerting Protocol, nowcasting of rainfall and flooding in urban areas" [18]. An analysis of the October 2021 disaster concluded that "without appropriate advisories to help users take preventive actions, [messages] become meaningless" [19].

The 26 August 2026 Bhote Koshi–Trishuli disaster shows both halves of the problem. NDRRMA's situation report places the trigger, a landslide and avalanche in the Lhende Khola about 20 km north-east of the Rasuwagadhi border point, at 08:40 [20]. ICIMOD reported water rising around 09:00 and the Trishuli at Galchhi rising "by as much as nine metres within 30 minutes" [21]. A cross-border account says word reached the Rasuwa District Administration Office at 8:56, sixteen minutes after the flood crossed the border, and that DHM's public post came at 1:35 pm, "nearly five hours after the flood entered Nepal" [22]. A preprint reconstruction puts the front at the uppermost gauge within 12.8 minutes of the trigger and the mass public alert at 38.8 minutes, and reports that three gauges were destroyed at 27, 69 and 87% of their warning stages, "so threshold logic never fired" [23]. The sources disagree on whether 08:40 marks the trigger or the border crossing, and the preprint timings are not official, but every version gives the near field minutes, not hours.

Further downstream the picture changes. A second preprint estimates the flood took about 365 minutes after the warning anchor to reach Devghat [24]. Most of the corridor had hours. There, the alert itself failed: the message received in Bidur told residents "along the banks of the Trishuli River (up to Muglin)" to remain in a safe location, with no arrival time, no scale and no place-level instruction, and it went out only in Nepali on a trekking corridor [25]. A DHM official said the threshold system and its templates were "designed for the gradual monsoon flooding" that Nepal's rivers usually produce [25].

This divides the problem cleanly. In the first tens of kilometres, only sirens, cell broadcast, neighbours and natural cues can work. Below that, people had time, and what they lacked was place-specific content: how long until the water reaches *my* place? That content is geographic, bilingual and pre-computable. The Atlas should not compete with the official chain; it should supply what the chain's messages lacked, in advance.

### B. A daily copy is enough for some products and dangerous for others

A daily copy suits slow-changing products: DHM's bulletins and outlooks, NEMRC's catalogue (history the moment it is published) and BIPAD's incident and loss records. It does not suit river levels or rainfall during an event, when a copy can be up to 24 hours old.

The practical rule follows. Every live panel shows two timestamps: when the agency published the value and when the Atlas copied it. Past a fixed age, the panel greys out and reads, in both languages, "This copy may be out of date. For current warnings see DHM / BIPAD." Six hours for river and rain values and 48 hours for bulletins are reasonable thresholds; they are judgement calls and should be published as such. The pipeline must fail loudly: a per-source health file (last success, last attempt, consecutive failures, record count, schema hash), schema checks on BIPAD's JSON, an automatic repository issue after repeated failures, and last-good data kept with its age shown rather than a blank or a quiet "no alerts". Government web infrastructure is not always stable; the same outlet that reported Nepal's ITU index ran headlines about government websites taken offline over a security flaw [26]. Unverified BIPAD incident and alert endpoints should be linked, not displayed, until confirmed.

Cadence is the contested point. A scheduled job every 15–30 minutes pulling only the two verified BIPAD endpoints would cost almost nothing and would catch most of the 30-minute to 6-hour lead time that Nepal's upstream-gauge thresholds provide [8]. The case for doing it immediately fails on sequence, not on cost. A faster mirror that breaks silently is worse than a slow one that breaks loudly, and scheduled CI runs can be delayed under load. The committed order is health signals first, then an hourly copy of the two verified endpoints once those signals have been stable for about 60 days. Data age, not promised cadence, carries the safety message. One limit remains whatever the cadence: gauges near the source die first, as in 2026 [23], so a quiet gauge must never be presented as reassurance.

### C. Use the agencies' warning levels, never invented ones

DHM's flood warnings use stages such as "prepare to evacuate" and "evacuate now", and Nepali stakeholders asked for "colour codes and ranges of probabilities" and for a common alerting protocol to bring "consistency in terminology or colour codes" [8]. On river stations, the Atlas should show DHM's own thresholds and terms as the primary signal and add trend context ("rising for 3 hours") as secondary. It should never create its own danger colours for live data. An unofficial site with its own alarm scale becomes a competing authority, and hazard-map research shows that inconsistent maps become grounds to dispute official ones [27].

### D. CAP: consume it, do not emit it

The Common Alerting Protocol (CAP) is an XML standard for alert messages. One alert can carry several `<info>` blocks, one per language, and describe its area with polygons, circles or geocodes [28]. WMO's 2023 Congress made CAP a recommended practice in its Technical Regulations [29]. In April 2025 a WMO workshop with DHM agreed to develop "a draft national implementation plan, including Standard Operating Procedures on CAP messages", and WMO undertook to help DHM share CAP warnings on its Severe Weather Information Centre [30]. Seven years after a 2018 pilot, no public DHM CAP feed was found during this research.

The Atlas should build a CAP reader now, so that it can parse, timestamp and display official alerts verbatim on the day a feed appears, highlighting the alert polygon on the map. It should not publish its own CAP feed of mirrored alerts, even one marked unofficial. CAP's `urgency`, `severity` and `certainty` fields are designed for alerting authorities, and an unofficial feed could be picked up by aggregators and passed on as official. The risk is asymmetric, because DHM itself "has no legal authority to order evacuations" [25] and an outside site has less standing still. What the Atlas can offer instead is pre-written, place-specific, bilingual message templates that DHM, NDRRMA or a municipality may adopt, leaving the decision to send with those who hold authority.

### E. From a daily copy to a durable archive

Because each day's copy is committed to the repository, the Atlas is quietly building something no agency publishes in one place: a dated, versioned history of what official portals showed. Published as append-only files per source per day, it supports pages such as "what the river stations showed in the 48 hours before the Melamchi or Bhote Koshi floods", checks of scenario presets against station records, and a growing NEMRC catalogue for scenario presets. For real earthquakes, the Atlas should link to USGS ShakeMap and PAGER products rather than recompute them; USGS itself advises users to "always seek the most current PAGER release" [31]. BIPAD's newer impact-based module adds a reason to archive loss data: UNDRR notes that as lead time shortens, "pre-existing vulnerability and historical impact data becomes more important" than the hazard forecast [32]. District-by-year loss tables are cheap static files.

All of this rests on permission. No BIPAD data licence was found, and BIPAD's incident locations, entered by police, "sometimes occur off-site" and are hard to correct once entered [14]. A written data-use confirmation from NDRRMA and DHM should come before any expansion of the mirror.

## 3. The Map and Place Search

The map is built on MapLibre GL, an open-source library that draws vector maps in the browser using WebGL. It currently offers 3D terrain, peak labels and a place search that combines GeoNames points with the 77 constitutional district names. For most users, search is the front door: a resident finds their own place first and reads hazard second. Three things decide whether that works: whether search understands how Nepalis spell, whether Nepali labels render correctly, and whether the page is light enough to load on a cheap phone.

### A. Search is a language problem before it is a data problem

A resident who types साँखु and gets nothing has been shut out as surely as one with no signal. The OpenStreetMap (OSM) Nepal community has already named the problem: "साँखु could be written as sankhu or shankhu, चितवन as chitwan or chitawan, गोर्खा as gorkha or gorakha". It resolved to follow the Survey Department's transliteration standard and to tag `name`, `name:ne`, `alt_name` and `name:en` "so that the search function of softwares can find the features" [33]. The `name:ne` key should "reflect local pronunciation accurately" [34].

The buildable change is a search index generated at deploy time from an OSM Nepal extract [35], covering the 753 local levels, wards where mapped, and settlements along hazard corridors. A small normalisation layer before matching folds chandrabindu and anusvara, unifies short and long vowel pairs, maps common romanisation pairs (sh/s, w/v/b, aa/a) and strips the inherent final "a" in romanised forms, so that साँखु, सांखु, sankhu and shankhu reach the same place. Shipped as one compressed JSON file of a few hundred kilobytes and loaded on first focus of the search box, it costs nothing at page load. OSM coverage in rural Nepal is uneven, so the index should fall back to GeoNames, never present an OSM name as an official administrative name, and keep constitutional names authoritative for districts. Logging queries that return nothing is the cheapest guide to naming gaps, and fixes should flow back to OSM.

### B. Nepali labels: a specific technical trap

MapLibre does not shape Devanagari natively. Protomaps' localisation documentation lists Nepali among scripts that "require paired positioned glyph font" stacks and exports names as positioned glyphs so MapLibre can draw them [36]. With a standard font stack, conjuncts and pre-base vowel signs may be misdrawn. Browsers have their own problems: the W3C's Devanagari gap analysis reports that "all engines have problems with vowel-signs, especially but not only pre-base vowel-signs", and that letter-spacing splits conjuncts [37]. The fixes are cheap: use a positioned-glyph stack for basemap labels or render Atlas-specific labels (districts, peaks, scenario places) as HTML overlays, which the browser shapes correctly, and never apply CSS letter-spacing to Devanagari on screen or in print. Protomaps also documents a dual-language label pattern that shows Nepali first and English second [36].

### C. Organise the map around places

Today the map is organised around hazards and scenarios. A place-centred panel would serve people better. Searching "Betrawati" or "बेत्रावती" should list the scenario origins upstream of that place, an arrival window from each, the nearest official gauge with its data age, and a link to the latest official bulletin. A World Bank review of DHM services found "an appetite for ... location-specific forecasts, impact-based multi-hazard early warning systems" [15], and a researcher reviewing the 2026 flood put it plainly: "People need to know exactly how severe the risk is to their specific location and where the evacuation shelters are" [25]. Shelters need local partners; the location-specific timing the Atlas can supply now.

### D. Weight discipline and the layers worth adding

PMTiles is "a single-file archive format for pyramids of tiled data" read through HTTP range requests, which suits MapLibre and a static host [38]. A Nepal-extent basemap rebuilt monthly or quarterly in CI removes dependence on a third-party tile server and makes offline caching possible; range requests should be tested on the actual host before switching. Terrain tiles are the heaviest part of a MapLibre page and the hazard story rarely needs them, so 3D terrain should become opt-in. Every new layer then has to state its weight and load on demand.

| Layer | Grade | Delivery | Approximate cost | Maintenance |
|---|---|---|---|---|
| Glacial lakes (official list plus open inventory) | B | points, loaded with the flood tool | ~100–300 KB compressed | low; refresh on new release |
| Site condition (Vs30) | B | baked into existing population cells | a few bytes per cell | very low |
| Landslide incident history (BIPAD) | B–C | yearly static GeoJSON | ~100 KB per year | medium (licence) |
| Schools, health posts, bridges (OSM) | B | PMTiles overlay | small | low |
| Global river outlook (Flood Hub) | B–C | link-out or labelled layer | small | medium (terms) |

The facilities layer has a Nepali precedent: Kathmandu Living Labs grew out of a project that mapped every school and health facility in the Kathmandu valley into OSM, on the principle "work once, and put to multiple creative uses" [39].

### E. Lines are read as rulings; global forecasts are context

Lines on hazard maps carry consequences. In Christchurch the red zone mattered "because it defined areas where householders could not move back into properties and were offered government compensation" [27]. Scenario edges should therefore be soft (feathered or hatched fills, no hairline outlines), and summaries should name wards and municipalities, since maps "are easier to interpret if risk area borders are defined by well-recognized features such as rivers, roads, and jurisdictional boundaries than by topographical contours" [4].

Global forecasts are a tempting addition. Google's Flood Hub publishes free riverine forecasts "up to 7 days in advance", updated daily [40], and its peer-reviewed model reached reliability in ungauged basins at up to five days' lead time comparable to or better than GloFAS nowcasts [41]. The case against is stronger where it matters. DHM staff told researchers that "numerical weather prediction based on global data is weak" for Nepal's rainfall and river levels [8], and an independent benchmark found both global systems "exhibit low reliability" in data-scarce regions, "particularly for rare flood events" [42]. No rainfall-runoff model forecasts an ice-rock avalanche. A global outlook belongs, if at all, as a medium-term, optional layer on the large Terai rivers, labelled "global experimental model, not DHM", or as a link-out if the data terms bar redistribution.

## 4. Flood and Glacial-Lake Outburst Scenarios

A GLOF happens when the natural dam holding a glacial lake (usually a moraine of loose glacial debris) fails, or when an avalanche or landslide drives a wave over it. The released water travels down the valley as a flood wave, often picking up sediment. Two numbers matter to people downstream: when the water arrives and how large the peak is. The Atlas computes both by moving a fixed hydrograph at 2, 4 or 6 m/s, holding its peak constant. The science shows that both defaults need to change, and that the simple engine itself can stay.

### A. Wave speed: the default is too slow where it matters most

The best direct measurement comes from a seismic network on the Bhote Koshi during the July 2016 Gongbatongshacuo outburst. The front "propagates between stations at 8.7 m/s", maximum flow depth was reached within two minutes, and a larger, sediment-laden second pulse followed "slower, at 5 m/s" [1]. The back-calculation of the 1941 Lake Palcacocha outburst in Peru gives "travel times between 36 and 70 min" over about 23 km, implying mean speeds of roughly 5.5 to 10.6 m/s; its authors note that no velocities were documented for the event, so this is a model bound rather than a measurement [11].

The arithmetic is simple and uncomfortable. Ten kilometres below a source, an 8.7 m/s front arrives in about 19 minutes; the Atlas's three cases say 28, 42 and 83 minutes. Thirty kilometres down, the measured speed gives about 57 minutes against the Atlas's 83 to 250. The slowest case is wrong by a factor of about four and the fastest by about 1.5, always in the direction of more time to escape than people would have.

Cascades can be faster still. A preprint reconstruction of the 2026 Bhote Koshi event estimates about 52 m/s from source to border, decaying downstream along a log-linear fit, and 6.4–7.2 m/s on the lower Trishuli [24]. Those figures describe an ice-rock avalanche mass flow, not a moraine-dam breach, and rest on two non-independent preprints of one event. They justify a separate case, not a new default.

The fix is small. Replace 2/4/6 m/s with a 3/6/9 m/s bracket for moraine-dam scenarios: the top case brackets the measured front, the middle sits near the sediment pulse, and the slow case keeps the wide lower reaches honest. Add a separately labelled "mass-flow cascade (ice/rock avalanche, debris flow)" case with a fast near-field speed that decays downstream, marked as resting on unreviewed reconstructions. Report arrival as one earliest-to-latest window per place ("first water could arrive between about 19 and 56 minutes after release"), never as three lines or one number. A card for Syaphrubesi that says "earliest about 5 minutes" is honest; one that says "28 to 83 minutes" is a hazard in itself.

Should the engine itself be upgraded? A big-river comparison found that moving from kinematic-wave to local-inertia routing raised peak-discharge skill (Nash–Sutcliffe efficiency, a 0–1 fit score) from 0.48 to 0.71, but warned that "the accuracy of coupled models still largely depends on the model forcing" [43]. In an outburst, the forcing (breach size, volume, entrainment) is the dominant unknown, so hydraulic sophistication buys little. Nepal's own record supports simple, transparent models: data-based forecasting on the Karnali, presented in a simple visual tool, raised lead times from 2–3 hours to 7–8 hours [44].

### B. Peaks: attenuation cuts both ways, so show two branches

Here honesty works against alarm. Cook and colleagues write that "as a GLOF travels downstream, the flood peak attenuates and the peak discharge decreases, whereas the drainage area and background discharge increase". In 2016 the estimated peak of 1,500–2,100 m³/s at Chaku fell to 700–900 m³/s at Barabise, still above the 30-year monsoon flood of 490–560 m³/s there, and the crossover where the outburst stopped being anomalous lay about 45 km downstream for 2016 and 55 km for the larger 1981 event [1]. A model that holds the source peak for 100 km overstates a clear-water outburst far downstream.

Cascades behave the opposite way. The 2021 Melamchi flood eroded 83.24 million m³ and deposited only 23.24 million m³ in its own valley, sending "more than 70% of sediment" onward into the Indrawati (preprint) [45]. At Devghat in 2026, discharge rose from about 2,600 to 5,850 m³/s and mean channel width across 22 sections grew from 66.1 m to 266.5 m [24]. Thame's release of about 4–5 × 10⁵ m³ still caused landslide damage to a road bridge about 45 km downstream [3]. Of the first 469 bodies recovered after the 2026 flood, 171 were reported in Chitwan and 110 in Nawalparasi East as of 28 August, more than 100 river-km below the border [22]. Outbursts also destabilise slopes: river-connected landslide area in the 2016 monsoon was about 100 times a typical year's [1].

The display should therefore carry two labelled branches. "Clear-water outburst: peak falls with distance and becomes comparable to a large monsoon flood beyond roughly 45–55 km." "Debris or cascade event: can stay destructive or grow far downstream; this model does not simulate it." A crossover marker on the map tells people far downstream that their main risk is the cascade, not the clean outburst.

### C. Source size: show the breach range

Breach size dominates the peak. A Tsho Rolpa study gives peak flows of 8,198 to 26,662 m³/s for 20 m and 40 m breaches [46], a factor of 3.3, and the Palcacocha authors warn that predictive simulations "have to be based on a larger set of back-calculated GLOF process chains, taking into account the expected parameter uncertainties" [11]. For listed lakes, the Atlas should offer low and high breach cases from published studies. For unlisted lakes, it should give a volume range estimated from area, labelled "uncertain by a factor of several", until a verified area–volume relation is coded.

### D. Origins: tier the lakes, and ship tiering with framing

The 2020 ICIMOD/UNDP inventory mapped 3,624 glacial lakes in the Koshi, Gandaki and Karnali basins, 2,070 in Nepal, and identified 47 potentially dangerous lakes: 21 in Nepal, 25 in Tibet draining into Nepal and one in India [12]. It is a ranking for mitigation spending, not a census of sources. Its criteria state that "extreme climatic conditions, seismic activity, and human interference ... are not considered", and the list churns: only 13 of the current Nepal lakes carried over from the earlier edition [12]. Thame shows the cost. An avalanche into the upper of two small lakes sent a wave 650 m down to a lower moraine-dammed lake, which breached [3]. A preprint finds the upper lake grew more than twelvefold in area between 2015 and 2024, from about 0.008 to 0.1 km², and reports 36 households destroyed [47].

An open alternative now exists. A 2026 inventory maps 31,698 glacial lakes across High Mountain Asia, including the Tibetan headwaters of Nepal's rivers, in two epochs and under a CC BY 4.0 licence [48]. It is honest about small lakes: it captures all lakes above 100,000 m², about 96% between 20,000 and 100,000 m², about 77% between 5,400 and 20,000 m² and only 25% below that [48]. Thame's upper lake in 2015 sat in the bin it mostly misses.

The design is a tiered origin layer:

- **Tier 1, official:** the 21 Nepal lakes, labelled with ICIMOD's rank and citation. The inventory is licensed CC BY-NC-ND, so link and cite rather than redistribute a modified copy without permission [12].
- **Tier 1T, transboundary:** the 25 Tibet-side lakes, with catchments drawn to the border, plus generic border-entry origins at Rasuwagadhi and the other trans-Himalayan crossings. When an alert says a flood "has entered from the Tibet side", the matching scenario already exists.
- **Tier 3, mapped but unassessed:** open-inventory lakes of at least 0.02 km² in Nepal-draining catchments, labelled "mapped lake, not assessed, not on any danger list, scenario is hypothetical", each with a volume range and a cascade option where a second lake sits close downstream. No rankings and no "danger" words.

Exposure explains the priority: ICIMOD counts about 141,911 people downstream of Tsho Rolpa, 165,068 of Thulagi and 96,767 of Imja [12]. But expansion raises the stakes of misreading. Hundreds of new scenario buttons without the "hypothetical, not a warning" frame multiply the chance that someone reads a model run as a forecast for their valley. Tiering and framing ship together or the expansion waits, and a reader test decides whether Tier 3 stays visible by default or moves behind an "advanced" switch.

### E. Say what is not modelled, beside the result

Each flood report should carry a short "not modelled" box next to the numbers: sediment entrainment and debris flow; landslide-dam or avalanche triggers; cascades unless selected; valley-wall landslides triggered by the flood; backwater at confluences; inundation depth; and channel change (Melamchi's lower channel "widened by 3-5-fold and aggraded by ~5-20 m" [45]). ICIMOD's own inventory calls for "adequate information ... to the public in varied languages" about GLOFs [12]; a model that states what it cannot see is that kind of information. The boundary condition is explicit: the simple engine suits order-of-magnitude arrival windows along a main channel and teaching that outbursts outrun warnings. It does not answer "will my house flood".

Heavier physics can still inform the site without running in the browser. r.avaflow, an open-source framework for two-phase mass flows that "explicitly considers both entrainment and stopping with deposition", could be run offline for three to five high-exposure origins and published as static comparison tiles, though its authors caution that "thorough parameter studies will be necessary" first [49]. That is a university-partner project, not core work.

### F. Validate against real floods before claiming anything

The 2016 Bhote Koshi outburst is the ideal hindcast, with a known origin, a measured front speed and measured peaks at two places [1]. Run the new defaults from Gongbatongshacuo, check whether the arrival window contains the observed timing and whether the modelled Barabise peak falls within a factor of two of 700–900 m³/s, and publish the result whether it passes or fails. Thame's 45 km damage reach [3] and the 2026 official timeline [20, 21] are secondary checks. A public "how this model compares with real floods" page will do more for trust than any added algorithm.

## 5. Earthquake Scenarios

An earthquake scenario chains three steps. A ground-motion prediction equation (GMPE, a statistical model fitted to recorded earthquakes) predicts shaking from magnitude, distance and site. A site term adjusts for local ground, usually through Vs30, the average shear-wave speed in the top 30 m: soft sediment (low Vs30) amplifies shaking, hard rock (760 m/s and above) does not. The result is then mapped against people and buildings. Errors at any step propagate, and in Nepal the largest error sits in the cheapest input to fix.

### A. The rock default is the largest single understatement

The Atlas sets Vs30 to 760 m/s, rock, unless the user changes it. Most Nepalis do not live on rock. In the Kathmandu valley, "clear site amplification" during Gorkha produced ground motions at Siddhitol that "exceed the design levels from the Nepalese Building Codes" [10]. A free fix exists: the USGS Global Vs30 Mosaic, a slope-based grid with regional insets at 30 arc-seconds, ranging from 98 to 2,197 m/s, distributed as a 631 MB global file [50]. A Nepal clip is a few megabytes, and the best delivery is not a separate raster at all: sample Vs30 once at build time onto the population cells the Atlas already ships, so each cell carries one extra number. Keep the manual value as an override and state the slope-proxy origin. Slope proxies are weakest in flat basins, so if the grid returns implausibly stiff values for the Kathmandu valley, a basin polygon from published microzonation should override it.

### B. One model understates uncertainty in the Himalaya

The most systematic test available ranks 16 GMPEs against 465 three-component records from 122 earthquakes in the western and central Himalaya and the Indo-Gangetic Plains. For the Himalaya it concludes that "the NGA-West2 GMPEs are not suitable too for most of the periods. However, ASK14 and IDR14 show better LLH scores", and finds Japanese models such as ZHAO06 best at the shortest periods [2]. BSSA14 belongs to NGA-West2. Its mean normalised residual at the shortest periods is about +1: recorded shaking sat roughly one total standard deviation above its median, while ZHAO06 sits near zero [2]. An earlier Gorkha study reached a similar view, that relations "developed for the Himalayan region should only be used" (available as an abstract) [51].

The evidence has limits. The ranking is a preprint, mostly from Indian network records; for the Indo-Gangetic Plains it is kinder to BSSA14; and its authors stress that "no single GMPE can be considered suitable for the entire range of spectral periods" [2]. That is not enough to swap BSSA14 for another single model. It is enough to stop presenting one model's median as *the* shaking, because the gap between models is epistemic uncertainty (uncertainty about which model is right) that one model's own scatter cannot display.

The order of work matters. First, show the ±1 sigma band the code already computes. Second, run a Gorkha 2015 hindcast: compare Atlas PGA, with per-cell Vs30, against recorded station values and the USGS ShakeMap for the event, and publish residuals by site class. ShakeMap's archive is what USGS uses for "calibrating global earthquake loss estimation" [52]. Third, if the hindcast confirms material bias (more than about 0.3 natural-log units, which the preprint makes likely), adopt a small ensemble of BSSA14, ASK14 and ZHAO06, and show the spread between models as the main uncertainty display. The ensemble costs a few kilobytes of coefficients and some client-side computation, nothing more.

### C. The Kathmandu basin: what PGA bands cannot show

Kathmandu holds the project's most important earthquake caution, and it runs against a naive "soft soil means higher PGA" fix. At the Kantipath station, "the short-period ground motions of the mainshock were relatively weak despite the proximity of the site to the source fault" because of strong nonlinear site response, while long-period motion at 4–5 s was large [53]. Another analysis of the same record found "a narrower and larger peak at ~0.4 s and a smaller, but very wide, peak at ~5 s", with 475-year design spectra underestimating demand on flexible structures [54]. A Kathmandu valley model built from the Gorkha sequence found the long-period site term "has a strong correlation with the bedrock depth" [55].

In the basin, the danger shifts to long periods, which tall and flexible buildings feel and which a PGA map cannot show. The honest response is not to inflate basin PGA, since BSSA14's nonlinear site term already tempers it. It is to state on the map and in print that long-period basin amplification was observed in 2015 and is not modelled. A medium-term option is a separate long-period indicator for the valley built on the bedrock-depth relation [55].

### D. From shaking to consequences: the lowest band is not "light"

Population per PGA band is an exposure count, and readers will treat the lowest band as the safe one. Fragility curves from 665,515 building damage cases in 603 villages after Gorkha show that "stone masonry buildings in Nepal are highly vulnerable even in the case of low to moderate ground shaking" [13]. Each band needs one sentence on what that shaking does to the buildings most rural Nepalis live in, and the lowest band should read "lower modelled shaking in this scenario, still damaging to stone masonry". USGS PAGER offers the template without false precision: it reports "the range of possible fatalities and economic losses" with uncertainty measures attached [31]. The Atlas should not estimate deaths, because PAGER's calibration rests on thousands of events and country vulnerability data a volunteer project cannot reproduce. It should copy PAGER's habit of attaching consequences and ranges to every colour, and add simple exposure facts such as schools and health posts per band from OSM.

### E. What earthquake scenarios are for

ShakeMap scenarios "describe the expected ground motions and effects of specific hypothetical large earthquakes" for "preparedness exercises and disaster planning" [52]. That is the right model. The ten historical presets are the tool's best teaching device, and the Gorkha preset should display its hindcast comparison once it exists. The open GEM/BGS national hazard grid (PGA at 10% and 2% probability of exceedance in 50 years, 0.025° resolution, CSV) [56] can sit beside each scenario as a long-term reference layer.

Two tempting extensions fail the role test. Automatically running rapid scenarios after each NEMRC event of magnitude 5 or more would place an unofficial estimate beside official reporting, built on early magnitudes that are routinely revised; for real events, the Atlas should link to NEMRC and USGS products instead. And earthquake early warning works in seconds on dedicated networks: a Nepal pilot with 20 low-cost stations characterised two small earthquakes "in less than 10 seconds after their origin time" [57]. A static site has no role in that loop.

## 6. Serving Nepali Users: Language, Access and Reach

Reach decides whether any of the improvements above matter. A Nepali hazard site faces four constraints at once: uneven connectivity, modest digital skills, two scripts with many spellings, and readers with disabilities. Each translates into concrete design rules, and several of them are safety issues rather than courtesies.

### A. Who can actually open the site

The connectivity figures disagree because they measure different things. The national household survey (NMICS 2024/25, 12,802 households) found 82% of households with internet access, 73% in rural areas, 68.5% in Karnali and 52.9% in the poorest group; women's phone ownership (81.6%) trails men's (90.4%) [9]. ITU's 2026 index puts *individual* internet use at 48.4% and household access at 52.5%, with 81.6% 4G coverage [26]. DataReportal counts 13.0 million people, 44%, offline at the end of 2025 [58]. A household with one connected member is not a connected person, so individual use is the better guide to who opens a web map. Skills are thinner still: only 19.2% of survey respondents verified information they found online, and 24.2% could copy and paste files [9]. The realistic audience is mid-literacy smartphone users, officials, teachers, journalists and NGO staff, plus everyone they print for.

### B. A page budget and a modest offline mode

A heavy page is a real cost: high-usage mobile data costs 2.9% of gross national income per head [26]. The Atlas should set an initial-load budget of about 1 MB compressed with 3D terrain off, enforce it in CI, and load tools on demand (search index on focus, lake origins with the flood tool, the population and Vs30 grid with the earthquake tool). A service worker (a browser script that caches files) should cache the app shell, interface strings, a user's saved places and their reports, and the Nepal basemap as an opt-in offline pack. Anything more ambitious lacks evidence: a conference study of a Raspberry Pi PMTiles server reports good latency and over 14 hours on a battery pack [59], but it is self-reported and has no Nepal users. Field servers are a partner's option, not an Atlas build.

### C. Nepali first, written in parallel, always Unicode

Nepali should be the default for Nepali-language browsers, with an always-visible switch and `lang` attributes on every block, as Nepal's accessibility position paper recommends [60]. Every banner, band label and action line should be written in parallel by a Nepali author against a short shared glossary, not machine-translated, reusing DHM's warning-stage terms where they exist. DHM's own unstandardised SMS wording [8] and the call to "tailor messages in a language that different users understand" [19] point the same way. Text must be Unicode, never legacy fonts: Nepali typed in "Preeti" or "Kantipur" is "just graphic representation of Nepali text" to a screen reader [61]. Every scenario page should open with one plain sentence before any numbers.

### D. The map is not the content

A WebGL map cannot meet WCAG's principles (perceivable, operable, understandable, robust) on its own, because a screen reader cannot read it [62]. Every map output needs a text equivalent: a table of places with their arrival windows or shaking bands. Prayatna Nepal's audit of Nepali sites, run with testers who have disabilities, found "inappropriate landmarks, heading styles and inaccessible colour contrast", and its checklist sets 4.5:1 contrast, semantic landmarks, keyboard operation and announced status messages [60]. The census counted 1.94% of the population with a disability and a living-standards survey 3.6%, both likely undercounts [60]. The five PGA bands and flood colours must also survive colour blindness, which affects hazard-map reading [4].

### E. English is a safety language too

Bilingual content is not a courtesy to donors. Of the 977 people listed missing in NDRRMA's Bhote Koshi report of 27 August 2026, 517 were foreign tourists [20], and the official alerts "only went out in Nepali, on a corridor that includes a major tourist trekking route" [25]. Trekking corridors exposed to GLOFs, such as Khumbu, Langtang and Rasuwa, need English one-pagers as much as Nepali ones.

### F. Teach the cue, through people people trust

The most transferable lesson comes from tsunami research. A New Zealand survey of more than 1,100 people found many "expected an emergency mobile alert to warn them about a local-source tsunami", although such a wave "can arrive before an official warning can be issued", and about one in four did not understand the need to evacuate immediately; agencies responded with the short rule "Long or Strong, Get Gone" [63]. Near-source GLOFs and debris floods are Nepal's local-source tsunamis. Per-place reports for the first tens of kilometres below a lake or steep catchment should carry a short, tested bilingual cue whose substance is: a roar, a sudden muddy rise or debris in the water means go uphill now; do not wait for an SMS. The wording must come from Nepali partners and testing.

Trust shapes how the cue travels. In 2026 a phone call to a head teacher emptied a school of 900 students ten minutes before debris buried it, and "Nepalis in general trust their family, friends and neighbors more than government officials" [25]. An unofficial website is further from that trust than either. The Atlas's reach therefore runs through intermediaries (municipal disaster focal persons, community gauge readers, schools, the Red Cross) and through paper, the channel that survives network loss. DHM's own 2025 voice-alert pilot targets exactly these intermediaries, because "it is difficult to send a bulk call to everyone at once" [64].

## 7. Printable Reports, Trust and Risk Communication

A printed scenario report is the Atlas product most likely to be kept, copied and acted on. It travels without the site's context, onto ward-office walls and into school files, and its reader may never see the disclaimer page. That makes its design a safety question. The evidence shows what goes wrong with hazard maps in the hands of the public, and it translates into a short specification.

### A. The risk is misreading

People read hazard maps as instructions. The Protective Action Decision Model "posits that a hazard map is a form of warning message" [4]. In a tsunami-map study, "at least 33% of EXs and 47% of GUs did not clearly distinguish between tsunami hazard and evacuation maps" [5], meaning a third of experts and nearly half of the general public. Many people read the US hurricane uncertainty cone as meaning zero risk outside it [4], and among US residents inside official floodplains, 57% perceived lower risk than the official map and 29% were unsure [65]. Reassurance can kill: before the 2009 L'Aquila earthquake, official assurances "led many to remain in their homes when the earthquake struck" [66]. Probability formats do not rescue rare events either, because the benefits of natural frequencies "decrease when dealing with low-probability, high-consequence (LPHC) events like major earthquakes" [66]. A scenario report is therefore a warning-shaped object whatever its authors intend.

### B. A one-page report specification

The buildable answer is a one-page A4 report, Nepali and English side by side or front and back, generated from accessible HTML:

1. **A fixed bilingual frame** on every page and map view that cannot be dismissed: "Hypothetical scenario: not a forecast, not a warning. For warnings follow DHM, NDRRMA and your local authority." Add a scenario ID, model version, run date and a short URL that recreates the scenario.
2. **What it is not:** "This is not an evacuation map. Evacuation routes and shelters come from your municipality or district disaster committee." That one sentence answers the hazard-versus-evacuation confusion directly.
3. **One plain sentence first:** "If this lake released this volume, the first water could reach [place] between about 18 and 40 minutes later."
4. **A place table** of named wards and settlements with their windows or bands, consistent with the finding that recognisable features aid reading [4].
5. **Ranges, never points:** arrival windows, rounded population counts, peaks from "lower (clear water)" to "higher (debris)", shaking as a band. No area is labelled "safe".
6. **The "not modelled" box** from Sections 4 and 5.
7. **Whom to ask:** official channels and municipal contacts, with generic preparedness advice (know the route uphill, keep the official number) and never a scenario-specific evacuation instruction. DHM's toll-free 1155 line belongs on the card, though it is "not advertised widely due to limited capacity" and should not be promised to answer during a surge [8].
8. **Accessible and photocopy-proof:** printed from HTML that also exists as a text page, since Nepal's 2026 accessibility checklist states that Nepali PDFs are "not accessible to screen readers even if they are written in Unicode" [61]; a Devanagari font with good conjunct support, no letter-spacing [37], at least 4.5:1 contrast, and legible in greyscale.

The format has Nepali precedent. In 2015 relief actors asked Kathmandu Living Labs for "printable maps, for navigation on the ground in places where mobile maps were unreliable" [67]. A place-specific arrival card that a ward office, school or hotel can laminate is the natural evolution of the current report.

### C. Bands or gradients: settle it with a test

The evidence points two ways. Isarithmic (contour-style) maps "produce the better understanding of uncertainty about hazard exposure than gradational shaded or binned maps" [4], yet Nepali stakeholders asked for colour codes, and one said "people don't have an idea of uncertainty; we have to train people (what actions to take) under certain range of certainties" [8]. Tsunami maps with a single evacuation zone produced higher risk perception than multi-zone maps [63], and general users preferred about five map elements where experts wanted seven [5]. The geovisualisation literature's tiebreaker is to tailor and test with the audience [68]. Keep five soft-edged bands as the default, offer a contour view, and let a reader test decide. Residents and planners may need two views of the same scenario.

### D. Provenance and the line the Atlas must not cross

PAGER's one-page report, with uncertainty ranges, vulnerable building types, secondary hazards and an instruction to seek the latest release, is the model for provenance [31]. Each Atlas report should list its inputs and their dates: population grid, lake inventory edition and tier, Vs30 source, model and version, official data timestamps. A public changelog of model defaults ("wave-speed bracket changed from 2/4/6 to 3/6/9 m/s after the 2016 Bhote Koshi hindcast") turns parameter changes into accountable decisions. Ward officials will forgive an uncertain number they can trace; they will not forgive a confident number a newspaper later shows was too low.

Provenance also guards authority. Haughton and White found that "an inconsistency in modelling and mapping hazards ... created opportunity for challenge and the selective mobilisation of scientific uncertainty to dispute the legitimacy of official maps" [27]. The Atlas should cite official products where they exist (ICIMOD lake lists, DHM thresholds, building-code zones), state where and why its scenarios differ, avoid zone names with a legal ring, and hand every evacuation decision to "your ward, municipality or DHM".

## 8. Missing Hazards and Capabilities

The Atlas covers three hazards. Nepal faces more, and the hazards it covers interact. The useful question is not "what else could be modelled" but which additions improve calibration without adding uncertainty the site cannot yet show honestly. Landslides, cascades, impact information, transboundary catchments and climate change each get a different answer.

### A. Landslides: history and context, not prediction

Landslides are the largest missing hazard. By 17 July 2024, 38 fatal landslides had killed 135 people in Nepal, with deaths rising sharply from mid-June [69]. The 26–28 September 2024 floods and landslides caused 249 deaths and an estimated NPR 46.68 billion in losses [70]. BIPAD logged 513 landslides between June 2023 and June 2024 [71]. Prediction, however, is out of reach for a static volunteer site. The AI-based forecasting tool deployed in Nepal "is currently not available for open access distribution", and localised short-duration rainfall "could make it challenging to predict them in real-time" [71]. Rain gauges are too sparse to fill the gap; for Melamchi in 2021, "we still do not have rainfall data" [72].

The right sequence is a dated landslide incident-history layer from BIPAD records (once confirmed and licensed), a monsoon "season so far" ledger, and a fixed note in every flood and earthquake result that the scenario can trigger landslides along the channel. A susceptibility model comes last, and only with published validation.

### B. Cascades as a hazard class

The 2026 reconstruction concludes that Nepal's risk screening "must expand from lake-centric hazard concepts to process-chain surveillance that connects unstable rock-ice source areas, entrainment-prone transport corridors, temporary blockages, and exposed downstream assets" [24]. ICIMOD specialists say that "the Himalayas do not always respect those categories" on which warning systems are built [73]. The Atlas's flood/GLOF/earthquake menu has the same flaw. Two cheap moves follow. The mass-flow cascade case (Section 4) becomes a named scenario type with an amplification flag and a blockage-and-release option. And because the official lake ranking excludes seismic triggers [12], each earthquake scenario report can list the lakes inside its stronger shaking bands as "lakes exposed to this scenario's shaking", turning two separate tools into a multi-hazard planning aid.

### C. Impact-based information without loss modelling

Nepal's official direction is impact-based warning, "communicating not only what hazard is expected, but what it could mean for people, livelihoods, infrastructure, and essential services" [74]. The Atlas's population-per-band and arrival-window outputs are already a simple impact view. The cheap extension is to count named facilities (schools, health posts, bridges, hydropower intakes from OSM) inside each scenario footprint.

### D. Transboundary catchments

Rivers cross borders and information does not. After a 2025 Tibet-side flood, Nepal and China reached an understanding on flood information sharing that "was never converted into a signed, binding mechanism", and the 2026 flood arrived without notice [22]. The Atlas cannot fix diplomacy, but drawing Nepal-draining catchments across the border, listing the 25 Tibet-side lakes and pre-building border-entry scenarios (Section 4) gives any cross-border notice a ready-made downstream picture.

### E. Climate: show measured change, not projections

Downscaled climate projections for Himalayan catchments are uncertain and invite the over-reading Section 7 warns against. Measured change is worth showing: lake growth between the open inventory's two epochs [48], with its detection limits, refreshed at ICIMOD's recommended interval of "at least every five years" [12] or faster as annual inventories arrive.

### F. Out of scope

Earthquake early warning, cell broadcast, sirens and push alerts are operational systems. Nepal has completed cell-broadcast readiness, which is a government and operator procurement [75]. The Atlas's role is to explain these systems and link to them. Building any of them, or setting its own flood danger thresholds, would turn a complement into a competing authority.

## 9. Impact, Partnerships and Sustainability

An unofficial civic platform reaches impact in one of two ways: by speaking to the public over the heads of officials, or by being useful to officials in their own work. Nepal's history favours the second. Sustainability, in turn, depends less on money than on whether the project can outlive its founders.

### A. Fit the policy moment

Nepal is midway through building a national multi-hazard early warning system. The Early Warnings for All (EW4All) roadmap, finalised at the end of 2025, is estimated to need US$360 million for 2026–2030 and calls for warnings in "a language and form [people] understand", designed with persons with disabilities, women and remote communities [74]. Its endorsement slipped into mid-2026 amid political turmoil, and a national CREWS proposal remains pending [75]. Official capacity is stretched, so a free, validated preparedness layer that does not compete with alerts fills a real gap, and the roadmap's "disaster risk knowledge" pillar is where the Atlas should offer itself.

### B. The Nepali precedent

Before 2015, Open Cities volunteers mapped "over 100,000 buildings in the Kathmandu Valley", plus structural data for about 350 medical facilities and 2,300 schools. After the earthquake, the Nepal Army's GIS chief said the maps showed that "areas like Ramkot and Balaju were heavily damaged" when the army had been "simply focusing on Bhaktapur" [67]. BIPAD itself was built by a non-profit civic tech company for NDRRMA [14]. The lesson is that an unofficial platform gains standing by being useful in official workflows.

Honesty is the price of that partnership. An Atlas whose defaults understate hazard and whose maps look like rulings is a liability to DHM, NDRRMA or ICIMOD. One that uses their thresholds, cites their lists, publishes validation and frames scenarios as planning aids is something they can point to. Friction remains possible: DHM staff "didn't know the extent of the floods in the early stages when sending the SMSs" [25], and an outside site that appears to know more invites resentment. The answer is to keep every artefact visibly derived from official data, offer it to the agencies first, and accept link-out-only status if they refuse.

### C. Partnerships in order of value

1. **NDRRMA and DHM:** a written data-use confirmation for BIPAD and DHM content, a named contact for corrections, and an offer of the arrival-window tables and message templates for DHM's cascade-less template set.
2. **ICIMOD:** a reuse statement for the no-derivatives lake inventory [12] and a review of the outburst wording and the Tibet-side tier.
3. **Kathmandu Living Labs and OSM Nepal:** KLL reports 30+ projects and 40+ partner organisations [39] and anchors the community that maintains Nepali names in OSM [35]; search quality depends on it.
4. **Universities and student mapping groups:** OpenDRI recommends building GIS into university "curricula" as a sustainability mechanism [7]; a semester project validating one hindcast or writing a glossary is the right size.
5. **NGOs and the Red Cross,** as users of printed reports in community preparedness, where WMO says vulnerable groups need education on "how and where to receive warnings" [76].

### D. Sustaining a volunteer project

OpenDRI's experience is sobering on revenue and on staleness: "the risk ... is that risk data becomes stale" once champions move on [7]. It also names "the immediate usefulness of data and data platforms to problems in the country" as the most important attribute for success [7]. The GeoNode case shows the alternative to revenue: structured to "encourage participation by others who have similar needs", the project became self-sustaining until its sponsor was "just another partner", with documentation crucial to onboarding new contributors [77]. That account is a sponsor's self-evaluation, but its prescription is cheap: a contributor guide in both languages, a methods page and model card per engine, issue templates for "wrong place name" and "wrong data", and everything reproducible from the repository. The fail-loud pipeline is itself a sustainability measure, because it tells a successor what broke.

### E. Measuring use without tracking people

A static, credential-free site can still learn whether it matters: cookie-free page counts by language and page, print-button clicks per scenario, aggregate counts of zero-result searches, and a short feedback form linked to a public issue, reported quarterly. Today the Atlas's assumptions about reach are untested; small, honest usage numbers will replace them and persuade a partner more than ambitious claims.

## 10. Prioritised Roadmap

The roadmap follows five principles. Fix what currently misleads before adding what does not exist. Pair every change with a test, and gate the next step on it where evidence is C or D. Treat page weight as a budget, so every addition states its cost and loads on demand. Ship expansion with its safeguard or not at all. Prefer changes that reduce future maintenance.

### A. Near term (next 3–6 months)

| # | Change | Why | Grade | Cost / weight | Validation |
|---|---|---|---|---|---|
| N1 | Per-source health file, schema checks, two timestamps and stale state on every panel, last-good fallback, CI issue on repeated failure | Events unfold in minutes; sources diverge; a silent stale copy is a hazard [22, 23] | B | <2 KB; reduces maintenance | V4 feed audit |
| N2 | Fixed bilingual "hypothetical, not a forecast or warning; not an evacuation map" frame with scenario ID, version, date | Maps read as warnings; 47% of public confuse hazard and evacuation maps [4, 5] | B | negligible | V3 reader test |
| N3 | Wave-speed bracket 3/6/9 m/s, labelled mass-flow case, one arrival window per place | Measured 8.7 m/s front; Palcacocha bound [1, 11] | A–B | negligible | V2 hindcast |
| N4 | Two-branch peak display with 45–55 km crossover marker; breach-size range; "not modelled" box | Attenuation in 2016; growth in cascades [1, 24, 45] | A–B | negligible | V2 peak within ×2 |
| N5 | Per-cell Vs30 baked into population cells; ±1 sigma shown; basin long-period caveat; renamed lowest band with masonry wording | Siddhitol exceedance; open grid; fragility data [10, 50, 13] | A–B | a few KB per scenario | V1 Gorkha hindcast |
| N6 | OSM-based search index with Nepali/romanised normalisation; zero-result logging | Community conventions [33, 34] | B | ~200–400 KB on focus | V5 query set |
| N7 | Devanagari labels via positioned glyphs or HTML overlays; no letter-spacing | Rendering gaps [36, 37] | B | small fonts | 3-browser check |
| N8 | ~1 MB budget enforced in CI; terrain opt-in; lazy-loaded tools | 48.4% individual use; data cost [26, 9] | B | negative | V6 device test |
| N9 | Accessible HTML as print source; text tables for every map output; WCAG basics | Nepali PDFs inaccessible [61, 60] | B | negligible | V7 audit |

### B. Medium term (6–24 months)

| # | Change | Why | Grade | Precondition |
|---|---|---|---|---|
| M1 | Tiered lake origins (official, transboundary with border entries, unassessed open inventory) with volume ranges and cascade option | Thame unlisted; open CC BY inventory [3, 48, 12] | B; C for misreading risk | N2 live; V3 passes; ICIMOD reuse statement |
| M2 | Lake-change display between inventory epochs | Measured growth [48, 47] | B | M1 |
| M3 | GMPE ensemble (BSSA14, ASK14, ZHAO06) with model spread shown | Preprint ranking; Gorkha abstract [2, 51] | C | V1 shows bias >~0.3 ln units |
| M4 | Gorkha preset with public hindcast panel; validation page for all hindcasts | Trust through disclosure [52, 1] | A once run | V1, V2 |
| M5 | Place-centred panels and laminated bilingual arrival cards for the Bhote Koshi–Trishuli–Narayani, Sunkoshi, Dudh Koshi and Tamor corridors, with near-source cue | Content gap in 2026 alerts; local-source lesson [25, 63] | B–C | N3, V3 |
| M6 | Self-hosted Nepal PMTiles basemap; service-worker cache and opt-in offline pack | Static fit; offline evidence thin [38, 59] | B–C | N8 |
| M7 | Dated archive of official data; BIPAD loss tables by district; NEMRC events linked to USGS products | Historical impact data gains value [32, 31] | B | NDRRMA data-use confirmation |
| M8 | Hourly copy of the two verified BIPAD endpoints | Upstream-gauge lead times of 30 min–6 h [8] | D for cadence | N1 stable 60 days |
| M9 | CAP reader that displays official alerts verbatim; never emit CAP; offer message templates to agencies | CAP planned in Nepal [30, 28] | B | official feed exists |
| M10 | Landslide incident history and season ledger; earthquake-to-lake cross-link; facility counts per footprint | Fatality burden; excluded seismic triggers [69, 70, 12] | B | licences confirmed |
| M11 | Kathmandu bedrock-depth long-period indicator | Basin resonance [55, 54] | B | V1 |
| M12 | Data-use letters, ICIMOD review, KLL/OSM name loop, university hindcast projects, privacy-respecting usage metrics | Sustainability lessons [7, 77, 39] | B–C | none |

### C. Validation tasks as first-class work

- **V1, Gorkha 2015 shaking hindcast.** Run M7.8 with per-cell Vs30; compare with station PGA and ShakeMap [52]; report bias by site class. *Decision rule:* bias above about 0.3 natural-log units promotes M3; below it, the ensemble can wait.
- **V2, Bhote Koshi 2016 outburst hindcast.** Compare windows with the 8.7 m/s front and peaks with Chaku and Barabise estimates [1]. *Decision rule:* a window that misses the observed timing reopens the speed bracket; a Barabise peak off by more than ×2 reopens attenuation.
- **V3, Nepali reader test.** Twenty to forty readers in two districts across literacy levels; banner versus no banner, bands versus soft bands. Ask: is this telling you a flood is coming? Is the lowest band safe? When could water arrive? *Decision rule:* if more than a small minority read a scenario as an official warning or a safe zone, revise the frame before M1 ships. No Nepal study of this question exists; it is the largest open assumption behind the roadmap.
- **V4, feed health audit.** Thirty days of health files, failures counted per source.
- **V5, search test set.** Two hundred real place-name queries in Devanagari and common romanisations, with a published success rate.
- **V6, low-end device test.** Throttled 3G on a budget Android phone against the 1 MB target.
- **V7, accessibility audit** with screen-reader users through a disability organisation, following Prayatna's approach [60].

### D. What not to do

Do not run a warning channel, send SMS, set CAP urgency or severity, or publish CAP under the Atlas's name; official chains work for riverine floods [6] and are being extended through CAP and cell broadcast [30, 75]. Do not invent flood danger thresholds. Do not build process-chain outburst physics in the browser, landslide prediction, fatality or loss modelling, or climate projections; each adds maintenance and misreading risk the evidence does not justify. Do not add a server or credentials: every recommendation here fits the static, free, read-only design.

### E. What would change the ordering

Three findings would reorder the list. If V1 shows BSSA14 with per-cell Vs30 fitting Gorkha station PGA within about 0.3 natural-log units, the ensemble can wait. If V3 shows Nepali readers do not take scenarios for forecasts even without a banner, the tiered lake layer can move earlier. If peer-reviewed reconstructions of 2023–2026 Himalayan events show roughly constant 4–6 m/s fronts from the source, the speed change softens. None of these is known today, and each is cheap to find out.

### F. Looking ahead

Over the next two years the Atlas's environment will change in ways that reward this ordering. Nepal is formalising CAP [30], has completed cell-broadcast readiness [75] and is extending BIPAD into impact-based forecasting [32]. When official machine-readable warnings arrive, a site that already separates "official, timestamped" from "hypothetical, ranged" can plug them in as thin, verbatim displays and retire its scrapers, a maintenance gain rather than a loss. Every new channel will also need something none currently supplies: pre-computed, place-level, bilingual answers to "how long do I have here?" When cell broadcast reaches a phone in Betrawati in ten seconds, its message will be no better than the generic text of 2026 unless someone has already worked out what Betrawati needs to hear. Open lake inventories are moving toward annual updates [48], which will give the tiered layer change-detection value: which unlisted lakes grew fastest this year. And if the EW4All roadmap is funded, its risk-knowledge pillar [74] will look for exactly the open, bilingual, validated, accessible scenario tool this roadmap builds. The near-term work buys credibility through honest defaults and public validation; the medium-term work buys coverage, because only a credible tool can expand without being misread as a competing authority.

## Sources

[1] Cook, K. L. et al. (2018). Glacial lake outburst floods as drivers of fluvial erosion in the Himalaya. Science (author PDF). https://wpg.forestry.oregonstate.edu/sites/default/files/seminars/cook_etal_2018_glacial_outburst_erosion.pdf
[2] Selvan, S. and Sinha, S. (2024). Suitability analysis / ranking of 16 ground motion prediction equations for the Western and Central Himalayas and Indo-Gangetic Plains (arXiv preprint 2410.05918). https://arxiv.org/abs/2410.05918
[3] Cook, K. L. et al. (2025). The 2024 Thame GLOF, Khumbu Nepal: causes, consequences, and dynamics. EGU25-12752 (abstract). https://meetingorganizer.copernicus.org/EGU25/EGU25-12752.html
[4] Lindell, M. K. (2020). Improving Hazard Map Comprehension for Protective Action Decision Making. Frontiers in Computer Science. https://www.frontiersin.org/journals/computer-science/articles/10.3389/fcomp.2020.00027/full
[5] Assessing Perceptions and Interpretations of Tsunami Maps: Insights from the Public and Risk Experts. https://agris.fao.org/search/en/records/687a93b89d6e0577321f5d82
[6] WMO (2025). Reducing flood casualties in Nepal. https://wmo.int/site/science-action/water-resource-monitoring-and-management/reducing-flood-casualties-nepal
[7] OpenDRI Guide, Chapter 7: Sustaining (World Bank / GFDRR). https://opendri.github.io/guide/oldchapters/chapter7.html
[8] Communicating complex forecasts: an analysis of the approach in Nepal's flood early warning system. Geoscience Communication. https://gc.copernicus.org/articles/3/49/2020/
[9] Nepal's 82% households have internet, but digital skills fall short. Nepali Telecom. https://www.nepalitelecom.com/2026/02/nepals-82-households-have-internet-but-digital-skills-fall-short.html
[10] Site amplification in the Kathmandu Valley during the 2015 M7.6 Gorkha, Nepal earthquake. Bulletin of Earthquake Engineering. https://link.springer.com/article/10.1007/s10518-016-0003-8
[11] Reconstruction of the 1941 GLOF process chain at Lake Palcacocha (Cordillera Blanca, Peru). HESS. https://hess.copernicus.org/articles/24/93/2020/
[12] ICIMOD and UNDP (2020). Inventory of glacial lakes and identification of potentially dangerous glacial lakes in the Koshi, Gandaki and Karnali river basins of Nepal, the Tibet Autonomous Region of China, and India. https://nepal.un.org/sites/default/files/2020-10/Inventory_Glacial_Lakes_2020_Full2.pdf
[13] Observational fragility functions for residential stone masonry buildings in Nepal. Bulletin of Earthquake Engineering. https://link.springer.com/article/10.1007/s10518-018-0372-2
[14] Why Bangladesh needs an integrated disaster information system like Nepal's 'Bipad Portal'. The Business Standard. https://www.tbsnews.net/features/panorama/why-bangladesh-needs-integrated-disaster-information-system-nepals-bipad-portal
[15] Transforming Nepal's hydro and agrometeorological services to build resilience. World Bank Blogs. https://blogs.worldbank.org/en/endpovertyinsouthasia/transforming-nepals-hydro-and-agrometeorological-services-build-resilience
[16] Ncell sent 44 lakh early warning SMS against landslide/flood. Nepali Telecom. https://www.nepalitelecom.com/2023/08/ncell-sent-44-lakh-early-warning-sms-against-landslide-flood.html
[17] Missing on early warning: pushed to rising death tolls and losses of properties and infrastructures. New Spotlight Magazine. https://www.spotlightnepal.com/2024/10/07/missing-on-early-warning-pushed-to-rising-death-tolls-and-losses-of-properties-and-infrastructures
[18] WMO. Nepal holds national consultation: Early Warnings for All and WITH All. https://wmo.int/media/news/nepal-holds-national-consultation-early-warnings-all-and-all
[19] Missed opportunities in utilization of weather forecasts: an analysis of October 2021 disaster in Nepal. PreventionWeb. https://preventionweb.net/quick/71365
[20] NDRRMA Emergency Response Operations Center (2026). Bhotekoshi Flood Situation Report No. 6 (informal English translation). https://www.adrrn.net/wp-content/uploads/2026/08/Bhotekoshi-Flood-Situation-Report-No.-6-English-Translation.pdf
[21] ICIMOD. Major flash flood sweeps through Nepal's Rasuwa district, raising fears of further downstream flooding. https://www.icimod.org/press-release/major-flash-flood-sweeps-through-nepals-rasuwa-district-raising-fears-of-further-downstream-flooding/
[22] Sixteen Minutes: What the Bhotekoshi flood reveals about the region's unfinished early-warning problem. The Borderlens. https://www.borderlens.com/2026/08/28/sixteen-minutes-what-the-bhotekoshi-flood-reveals-about-the-regions-unfinished-early-warning-problem/
[23] The Bhote Koshi–Trishuli flash flood of 26 August 2026, Rasuwa, Nepal: warning latency exceeded flood travel time (preprint). https://doi.org/10.31223/x5hn5h
[24] A multi-source quantitative reconstruction of the 26 August 2026 Bhote Koshi rock-ice avalanche-debris-flow-flood cascade, Nepal (preprint). https://doi.org/10.31223/x5mb9v
[25] During Nepal floods, decentralized, community-based warning saved lives. Mongabay. https://news.mongabay.com/2026/09/during-nepal-floods-decentralized-community-based-warning-saved-lives/
[26] Nepal returns to global ICT Index but digital use still lags infrastructure growth. The Kathmandu Post. https://kathmandupost.com/science-technology/2026/07/02/nepal-returns-to-global-ict-index-but-digital-use-still-lags-infrastructure-growth
[27] Haughton, G. and White, I. (2018). Hazard-map controversies, uncertainty and planning. University of Waikato Research Commons. https://researchcommons.waikato.ac.nz/bitstreams/a94bb2fb-421e-41fa-9009-28fd75226bd8/download
[28] OASIS. Common Alerting Protocol Version 1.2. https://docs.oasis-open.org/emergency/cap/v1.2/CAP-v1.2-os.html
[29] Central for Applied Research and Development (CARD), IOE Tribhuvan University: CAP training event. https://card.ioe.tu.edu.np/events/534
[30] WMO strengthens Early Warning Services in Nepal. https://wmo.int/media/project-update/wmo-strengthens-early-warning-services-nepal
[31] USGS. PAGER Scientific Background. https://earthquake.usgs.gov/data/pager/background.php
[32] UNDRR. An impact-based early warning module in Nepal's BIPAD portal. https://www.undrr.org/resource/case-study/impact-based-early-warning-module-nepals-bipad-portal
[33] OpenStreetMap Wiki. Nepal/Meetings/2022-12-15. https://wiki.openstreetmap.org/wiki/Nepal/Meetings/2022-12-15
[34] OpenStreetMap Wiki. Key:name:ne. https://wiki.openstreetmap.org/wiki/Key:name:ne
[35] OpenStreetMap Wiki. WikiProject Nepal. https://wiki.openstreetmap.org/wiki/Nepal
[36] Protomaps. Basemap Localization. https://docs.protomaps.com/basemaps/localization
[37] W3C. Devanagari Gap Analysis. https://www.w3.org/TR/deva-gap
[38] Protomaps. PMTiles Concepts. https://docs.protomaps.com/pmtiles/
[39] About Kathmandu Living Labs. https://kathmandulivinglabs.org/about-us
[40] Google Research. Flood Forecasting. https://sites.research.google/floodforecasting/
[41] Global prediction of extreme floods in ungauged watersheds. Nature. https://doi.org/10.1038/s41586-024-07145-1
[42] Enhancing flood forecasting reliability in data-scarce regions with a distributed model (EGUsphere preprint). https://egusphere.copernicus.org/preprints/2025/egusphere-2025-2294/egusphere-2025-2294.pdf
[43] Evaluating the impact of model complexity on flood wave propagation and inundation extent with a hydrologic–hydrodynamic model coupling framework. NHESS. https://nhess.copernicus.org/articles/19/1723/2019/
[44] Community-based early warning systems for flood risk mitigation in Nepal. NHESS. https://doi.org/10.5194/nhess-17-423-2017
[45] The 2021 Melamchi Flood: A massive erosional cascade in the Himalayan Mountains of central Nepal (Research Square preprint). https://doi.org/10.21203/rs.3.rs-2766739/v1
[46] Glacial lake outburst flood (GLOF) modeling of Tsho Rolpa glacial lake, Nepal. PIAHS. https://doi.org/10.5194/piahs-387-59-2024
[47] Quantifying the long-term evolution of glacial lakes and the impact of the 2024 Thame, Nepal outburst flood event using remote sensing (Research Square preprint). https://doi.org/10.21203/rs.3.rs-10032683/v1
[48] Automated satellite-based glacial lake inventory and change detection in High Mountain Asia. Scientific Reports. https://www.nature.com/articles/s41598-026-35446-0
[49] r.avaflow v1, an advanced open-source computational framework for the propagation and interaction of two-phase mass flows. GMD. https://gmd.copernicus.org/articles/10/553/2017/
[50] USGS. Vs30 Models and Data. https://earthquake.usgs.gov/data/vs30/
[51] Attenuation relation predicted observed ground motion of Gorkha Nepal earthquake of April 25, 2015. Natural Hazards. https://link.springer.com/article/10.1007/s11069-015-1969-2
[52] USGS. ShakeMap. https://earthquake.usgs.gov/data/shakemap/
[53] Analysis of strong ground motions and site effects at Kantipath, Kathmandu, from 2015 Mw 7.8 Gorkha, Nepal, earthquake and its aftershocks. Earth, Planets and Space. https://earth-planets-space.springeropen.com/articles/10.1186/s40623-016-0432-2
[54] The 2015 Mw 7.8 Gorkha Earthquake in Nepal and its aftershocks: analysis of strong ground motion. Bulletin of Earthquake Engineering. https://link.springer.com/article/10.1007/s10518-017-0084-z
[55] Ground motion prediction equation for the Kathmandu Valley, Nepal based on strong motion records during the 2015 Gorkha Nepal earthquake sequence. HUSCAP, Hokkaido University. https://eprints.lib.hokudai.ac.jp/dspace/handle/2115/78975
[56] METEOR: Nepal seismic hazard map with mean Peak Ground Acceleration (PGA) in g for a 10% and 2% probability of exceedance in 50 years. Zenodo. https://zenodo.org/records/19002227
[57] NepalEEW: Testing the feasibility of an Earthquake Early Warning System in Nepal. SEG. https://seg.org/news/nepaleew-testing-the-feasibility-of-an-earthquake-early-warning-system-in-nepal/
[58] DataReportal. Digital 2026: Nepal. https://datareportal.com/reports/digital-2026-nepal
[59] Performance Comparison of an Offline PMTiles-Powered Map Server Running on a Raspberry Pi for Decentralized Geospatial Access (FOSS4G 2025 talk). https://talks.osgeo.org/foss4g-2025/talk/TCZTK7/
[60] Prayatna Nepal. Prioritizing Digital Accessibility for Inclusive (position paper). https://prayatnanepal.org/wp-content/uploads/2022/12/Position-Paper_FINAL.pdf
[61] Prayatna Nepal. Digital Accessibility Checklist (2026). https://www.prayatnanepal.org/wp-content/uploads/2026/06/Digital-Accessibility-Checklist_Comprehensive-final.pdf
[62] W3C. Introduction to Understanding WCAG 2.1. https://www.w3.org/WAI/WCAG21/Understanding/intro
[63] Science strengthening tsunami safety. PreventionWeb. https://www.preventionweb.net/news/science-strengthening-tsunami-safety
[64] Government to provide voice alerts on flood, weather updates. Nepali Telecom. https://nepalitelecom.com/2025/06/government-to-provide-voice-alerts-on-flood-weather-updates.html
[65] UVM study reveals millions at risk. University of Vermont. https://www.uvm.edu/cals/news/uvm-study-reveals-millions-risk
[66] Public understanding and scientific uncertainty: The communication of risk in the L'Aquila earthquake. AIMS Geosciences. https://www.aimspress.com/article/doi/10.3934/geosci.2024028
[67] Mapping for resilience: crowd-sourced mapping in crises. Humanitarian Practice Network. https://odihpn.org/magazine/mapping-for-resilience-crowd-sourced-mapping-in-crises/
[68] Slavik, Fish and Peters. Using geovisualizations to educate the public about environmental health. https://par.nsf.gov/servlets/purl/10560604
[69] Petley, D. Fatal landslides in Nepal in 2024 to date. The Landslide Blog (Eos). https://eos.org/thelandslideblog/nepal-landslides-2024
[70] NDRRMA. Preliminary Loss and Damage Assessment of Flood and Landslide, September 2024. https://www.dpnet.org.np/public/uploads/files/Loss_and_Damage_Assessment_of_Flood_and_Landslide_2024_Updated_compressed%202026-01-20%2008-32-00.pdf
[71] AI forecasting deployed to predict Nepal landslides. SciDev.Net. https://www.scidev.net/global/news/ai-forecasting-deployed-to-predict-nepal-landslides/
[72] Rainfall data remains scarce due to fewer gauging stations. The Kathmandu Post. https://kathmandupost.com/climate-environment/2023/07/25/rainfall-data-remains-scarce-due-to-fewer-gauging-stations
[73] The Nepal floods question: When the Himalayas collapse, who gets warned? Al Jazeera. https://www.aljazeera.com/amp/news/2026/9/19/the-nepal-floods-question-when-the-himalayas-collapse-who-gets-warned
[74] Early warnings for all: Nepal must turn commitment into action. The Himalayan Times. https://thehimalayantimes.com/opinion/early-warnings-for-all-nepal-must-turn-commitment-into-action
[75] CREWS EW4All Accelerator Project Final Report. https://crews-initiative.org/wp-content/uploads/2026/04/CREWS-EW4All-Accelerator-Final-Report.pdf
[76] WMO. Improved flood preparedness and community-based early warnings needed in Nepal. https://wmo.int/media/magazine-article/improved-flood-preparedness-and-community-based-early-warnings-needed-nepal
[77] OpenDRI and GeoNode: A Case Study on Institutional Investments in Open Source (World Bank / GFDRR). https://documents1.worldbank.org/curated/en/713861563520709009/pdf/Open-Data-for-Resilience-Initiative-and-GeoNode-A-Case-Study-on-Institutional-Investments-in-Open-Source.pdf
