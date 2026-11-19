# Improving the Himalayan Disaster Atlas: Honest Defaults First, Preparedness Second, Expansion Last

**Executive summary.** The Himalayan Disaster Atlas improves most by becoming honest before it becomes bigger. Its architecture is sound and should stay: a static, free site with no logins, bilingual text, constitutional Nepali district names and printable reports. What needs to change is a set of defaults that all lean the same way, toward making hazard look smaller than the evidence supports. The flood and glacial-lake outburst flood (GLOF) engine moves its wave at 2, 4 or 6 m/s, but the only peer-reviewed measurement of a Nepal outburst front is 8.7 m/s [1]. The earthquake engine puts every resident on rock and relies on a single ground-motion model, BSSA14, from a model family that a 2024 preprint ranking found "not suitable" for most periods in the Himalaya [2]. Outburst origins stop at an official list that did not include the source of the 2024 Thame flood, "a cascade of two small lakes that had not previously been considered dangerous" [3]. Every output is a single number or a crisp band, although readers treat hazard maps as warning messages and read their lines as certainty [4, 5].

The second finding is about role. Nepal's official river warnings work: flood deaths fell from 166 in 2017 to 27 in 2022 even though the 2022 floods were larger [6]. Where warnings still fail (fast cascades, generic wording, the last mile), a daily static copy cannot help during the event. The Atlas earns its place before the event. It can offer pre-computed arrival windows for named places, printed bilingual cards, a near-source action cue, and a copy of official data that shows its age and fails loudly.

Near-term work (three to six months) should fix what misleads: a fail-loud data pipeline, a fixed bilingual "hypothetical, not a forecast or a warning" frame, faster flood defaults with per-place arrival windows, per-cell site conditions in the earthquake model, Nepali-aware search and labels within a page budget, and accessible print. Medium-term work (six to twenty-four months) adds coverage: tiered lake origins, a ground-motion ensemble, a landslide history layer, an archive, a reader for the Common Alerting Protocol, and formal partnerships. Each addition ships with its safeguard and waits on a validation the project can run itself.

## 1. Where the Atlas Stands Today

A hazard atlas does three jobs. It shows what official agencies are reporting, it lets people explore "what if" scenarios, and it turns both into something a resident or ward official can act on. The Atlas does all three for floods, GLOFs and earthquakes. Its flood engine takes a release hydrograph (the discharge at the source over time, here a triangle or rectangle) and moves it downstream at three constant speeds, from a fixed list of lake and river-reach origins, with no change in the peak. Its earthquake engine computes peak ground acceleration (PGA, the strongest ground acceleration at a site) with BSSA14 for one user-set site condition and counts people in five PGA bands.

### A. What already works

Several design choices are better than most hazard portals manage. A static site with no login costs almost nothing to run and survives traffic spikes. That matters: the World Bank's Open Data for Resilience Initiative (OpenDRI) found that none of its projects built a self-sustaining revenue stream, and that "without continuous funding" risk data goes stale [7]. Bilingual text with constitutional district names addresses a documented weakness: DHM's SMS alerts have had "no standardised language", switching between Nepali, English and romanised Nepali [8]. Printed reports reach people the website does not, in a country where only 14.7% of households report radio access [9]. And the earthquake model files already list what they leave out (basin depth, regional attenuation, spatial correlation), while the code computes an uncertainty the map never shows. That habit of disclosure is the seed of the best improvement path.

### B. The common pattern behind the gaps

One hazard at a time, the gaps look unrelated. Side by side, they share a direction.

| Default today | What the evidence shows | Direction of error |
|---|---|---|
| Vs30 = 760 m/s (rock) everywhere | Kathmandu valley and Terai sit on sediment; Gorkha shaking at Siddhitol exceeded building-code design levels [10] | Understates shaking where most people live |
| BSSA14 as the only model | Recorded short-period shaking sat about one standard deviation above its median on Himalayan records (preprint) [2] | Understates shaking; hides model disagreement |
| Wave speed 2/4/6 m/s | Measured front faster than the fastest default [1]; a back-calculated Andean outburst implies about 5.5–10.6 m/s [11] | Arrival too late near the source |
| Peak held constant downstream | Clear-water peaks roughly halve over tens of kilometres [1] | Overstates far-field peak for clear water; silent on cascades that grow |
| Origins limited to the official list | Thame came from unlisted lakes [3]; the list ignores seismic triggers [12] | Hides real sources |
| Five crisp PGA bands | Stone masonry is "highly vulnerable even in the case of low to moderate ground shaking" [13] | The lowest band reads as safe |

Not every error points one way: a constant outburst peak overstates clear-water floods far downstream. But the errors that matter most for life safety (arrival too late, shaking too low, a missing source) all err toward reassurance, and people already judge risk as falling with distance from a source [4]. A preparedness tool that reassures by default works against its purpose.

### C. The test, and how evidence is graded

One question should judge the next stage: would a resident who read the Atlas, printed it and acted on it be better calibrated about their own exposure? By that test, calibration (defaults and ranges), framing and preparedness content outrank more feeds, live alerts or heavier 3D. The model classes are acceptable for a public tool; their defaults are not. That holds fully for floods and partly for earthquakes, where the case against a single model justifies a modest change of engine.

Each recommendation carries a grade. **A**: measured against observed events or tested with users. **B**: peer-reviewed or official documentation, indirect for this use. **C**: preprint, abstract, self-report or journalism. **D**: reasoning with no direct test. C- and D-grade changes are paired with a validation task.

## 2. Official Data Feeds: DHM, BIPAD and NEMRC

Three agencies supply the live data. The Department of Hydrology and Meteorology (DHM) runs river and rain gauges, issues forecasts and sends flood warnings. BIPAD is the portal of the National Disaster Risk Reduction and Management Authority (NDRRMA), holding incident, loss and "real time" rainfall, streamflow and earthquake data [14]. The National Earthquake Monitoring and Research Center (NEMRC) locates earthquakes. The Atlas copies them once a day. Only BIPAD's river- and rain-station JSON endpoints are verified machine-readable; the rest are HTML scrapes, several needing JavaScript rendering. The question is what an unofficial daily copy can safely do.

### A. Official warnings work for rivers and fail at the last mile

WMO credits DHM's forecasting service (2016) and the South Asian Flash Flood Guidance System (2018) for the fall in flood deaths [6]. A World Bank project upgraded 88 meteorological and 70 hydrological stations and installed Nepal's first C-band radar [15], and one mobile operator sent more than 4.4 million flood and landslide SMS alerts in two months of the 2023 monsoon [16]. The failures sit elsewhere. Around 250 people died in the September 2024 floods "in-spite of a clear and categorical alert, four days in advance" [17]. A national consultation listed shortcomings in "the operationalization of the Common Alerting Protocol, nowcasting of rainfall and flooding in urban areas" [18], and an analysis of the October 2021 disaster concluded that without advisories, messages "become meaningless" [19].

The 26 August 2026 Bhote Koshi–Trishuli disaster shows both halves of the problem. NDRRMA places the trigger, a landslide and avalanche about 20 km north-east of the Rasuwagadhi border point, at 08:40 [20]. ICIMOD (the International Centre for Integrated Mountain Development) reported the Trishuli at Galchhi rising "by as much as nine metres within 30 minutes" [21]. Word reached the Rasuwa district office at 8:56, and DHM's public post came at 1:35 pm, "nearly five hours after the flood entered Nepal" [22]. A preprint puts the front at the first gauge within 12.8 minutes of the trigger and the mass alert at 38.8 minutes, with three gauges destroyed at 27, 69 and 87% of their warning stages, "so threshold logic never fired" [23]. These timings are not official, and sources disagree on whether 08:40 marks the trigger or the border crossing, but every version gives the near field minutes, not hours.

Downstream the picture changes. A second preprint estimates that the flood took about 365 minutes after the warning anchor to reach Devghat [24]. Most of the corridor had hours, and there the message failed: residents "along the banks of the Trishuli River (up to Muglin)" were told to stay in a safe location, with no arrival time, no scale and no place-level instruction, in Nepali only [25]. A DHM official said the templates were "designed for the gradual monsoon flooding" Nepal usually sees [25]. The problem therefore splits. Near the source, only sirens, neighbours and natural cues work. Below that, people lacked place-specific content (how long until the water reaches *my* place?), which is geographic, bilingual and pre-computable. The Atlas should supply that content in advance, not compete with the warning chain.

### B. Make freshness the interface and fail loudly

A daily copy suits slow products: bulletins, NEMRC's catalogue, BIPAD's incident and loss records. It does not suit river or rain values during an event. Every live panel should show when the agency published a value and when the Atlas copied it. Past a fixed age (six hours for river and rain, 48 hours for bulletins, both judgement calls to be published as such) the panel greys out and reads, in both languages, "This copy may be out of date. For current warnings see DHM / BIPAD." The pipeline needs a per-source health file (last success, consecutive failures, record count, schema hash), schema checks on BIPAD's JSON, an automatic repository issue after repeated failures, and last-good data shown with its age rather than a blank or a quiet "no alerts". Nepali government sites do go offline without warning [26]. Unverified BIPAD incident and alert endpoints should be linked, not displayed.

Cadence is contested. A job every 15–30 minutes pulling the two verified endpoints would cost almost nothing and would catch much of the 30-minute to 6-hour lead time that Nepal's upstream-gauge thresholds give [8]. The objection is sequence, not cost: a faster mirror that breaks silently is worse than a slow one that breaks loudly, and scheduled continuous-integration (CI) jobs can be delayed under load. The right order is health signals first, then an hourly copy of the two verified endpoints once those signals have been stable for about 60 days. Visible data age, not promised cadence, carries the safety message. Whatever the cadence, gauges near a source die first [23], so a quiet gauge must never read as reassurance.

### C. Agency warning levels, and CAP consumed but not emitted

On river stations the Atlas should show DHM's own thresholds and stage terms ("prepare to evacuate", "evacuate now") as the main signal and add trend context ("rising for 3 hours") as secondary. Stakeholders asked DHM for "consistency in terminology or colour codes" [8]; an unofficial alarm scale would undercut that, and inconsistent hazard maps give people grounds to dispute official ones [27].

The Common Alerting Protocol (CAP) is an XML standard for alert messages; one alert can carry a block per language and describe its area with polygons [28]. WMO made CAP a recommended practice in 2023 [29], and in April 2025 DHM agreed with WMO to develop "a draft national implementation plan, including Standard Operating Procedures on CAP messages" [30]. No public DHM CAP feed was found, seven years after a 2018 pilot [8]. The Atlas should build a CAP reader now, so it can show official alerts verbatim, with their polygons, on the day a feed appears. It should not publish its own CAP feed of mirrored alerts. CAP's urgency, severity and certainty fields are meant for alerting authorities, aggregators could pass an unofficial feed on as official, and even DHM "has no legal authority to order evacuations" [25]. The better offer is a set of pre-written, place-specific bilingual message templates that DHM, NDRRMA or a municipality can adopt.

### D. From a daily copy to an archive, with permission

Because each day's copy is committed, the Atlas is building something no agency publishes in one place: a dated history of what official portals showed. Published as append-only daily files, it supports "what the gauges showed before the flood" pages and checks of scenario presets against records. For real earthquakes, the Atlas should link to the US Geological Survey's ShakeMap (shaking maps) and PAGER (impact alerts) rather than recompute them; USGS advises users to "always seek the most current PAGER release" [31]. Loss records deserve archiving too: UNDRR notes that as lead time shortens, "pre-existing vulnerability and historical impact data becomes more important" [32]. All of this rests on permission. No BIPAD licence was found, and police-entered incident locations "sometimes occur off-site" [14]. A written data-use confirmation from NDRRMA and DHM comes first.

## 3. The Map and Place Search

The map runs on MapLibre GL, an open-source library that draws vector maps in the browser, with 3D terrain, peak labels and a search over GeoNames (an open gazetteer) points and the 77 constitutional district names. For most users search is the front door: they find their own place first and read hazard second. Three things decide whether that works: whether search understands how Nepalis spell, whether Nepali labels render correctly, and whether the page loads on a cheap phone.

### A. Search is a language problem

A resident who types साँखु and gets nothing has been shut out as surely as one with no signal. The OpenStreetMap (OSM) Nepal community has named the problem: "साँखु could be written as sankhu or shankhu, चितवन as chitwan or chitawan". It resolved to follow the Survey Department's transliteration standard and to tag `name`, `name:ne`, `alt_name` and `name:en` "so that the search function of softwares can find the features" [33]. The `name:ne` key should "reflect local pronunciation accurately" [34].

The buildable change is a search index generated at deploy time from an OSM Nepal extract [35], covering the 753 local levels, wards where mapped, and corridor settlements. A normalisation step folds chandrabindu and anusvara, unifies short and long vowels, maps romanisation pairs (sh/s, w/v/b, aa/a) and drops the inherent final "a", so that साँखु, सांखु, sankhu and shankhu reach the same place. Shipped as a compressed file of a few hundred kilobytes, loaded when the search box is first focused, it adds nothing to page load. OSM coverage in rural Nepal is uneven, so the index falls back to GeoNames, never presents an OSM name as an official one, and keeps constitutional names authoritative for districts. Logged zero-result queries show the naming gaps; fixes should flow back to OSM.

### B. Nepali labels: a specific technical trap

MapLibre does not shape Devanagari natively. Protomaps lists Nepali among scripts that "require paired positioned glyph font" stacks [36]; with a standard stack, conjuncts and pre-base vowel signs may be misdrawn. Browsers add their own faults: "all engines have problems with vowel-signs, especially but not only pre-base vowel-signs", and letter-spacing splits conjuncts [37]. The fixes are cheap: a positioned-glyph stack for basemap labels, HTML overlays for Atlas-specific labels (which the browser shapes correctly), no letter-spacing on Devanagari anywhere, and Protomaps' dual-language pattern with Nepali first [36].

### C. Organise around places, within a weight budget

Searching "Betrawati" or "बेत्रावती" should open a place panel: upstream scenario origins, an arrival window from each, the nearest gauge with its data age, and a link to the latest bulletin. A World Bank review found "an appetite for ... location-specific forecasts" [15], and after 2026 a researcher put it plainly: "People need to know exactly how severe the risk is to their specific location" [25].

Weight must be budgeted. PMTiles, "a single-file archive format for pyramids of tiled data" read through HTTP range requests, lets a static host serve its own Nepal basemap and enables offline caching [38]; range requests should be tested on the actual host first. 3D terrain, the heaviest part of the page, should become opt-in. Each new layer states its cost and loads on demand.

| Layer | Grade | Delivery | Approx. cost | Maintenance |
|---|---|---|---|---|
| Glacial lakes (official list plus open inventory) | B | points, loaded with the flood tool | ~100–300 KB | low |
| Site condition (Vs30) | B | baked into population cells | bytes per cell | very low |
| Landslide incident history | B–C | yearly static file | ~100 KB/year | medium (licence) |
| Schools, health posts, bridges (OSM) | B | PMTiles overlay | small | low |
| Global river outlook | B–C | link-out or labelled layer | small | medium (terms) |

The facilities layer has a Nepali precedent: Kathmandu Living Labs (KLL) began by mapping the valley's schools and health facilities into OSM, on the principle "work once, and put to multiple creative uses" [39].

### D. Lines read as rulings; global forecasts as context

In Christchurch the red zone mattered "because it defined areas where householders could not move back into properties and were offered government compensation" [27]. Scenario edges should be soft (feathered or hatched, no hairlines), and summaries should name wards and municipalities, because maps "are easier to interpret if risk area borders are defined by well-recognized features" [4].

Global forecasts are tempting. Google's Flood Hub publishes free river forecasts "up to 7 days in advance", updated daily [40], and its model reached reliability in ungauged basins at up to five days comparable to or better than GloFAS [41]. Against that, DHM staff say "numerical weather prediction based on global data is weak" for Nepal [8], and an independent benchmark (preprint) found both systems "exhibit low reliability" in data-scarce regions, "particularly for rare flood events" [42]. No rainfall-runoff model forecasts an ice-rock avalanche. A global outlook belongs only as an optional, medium-term layer on the large Terai rivers, labelled "global experimental model, not DHM", or as a link-out.

## 4. Flood and Glacial-Lake Outburst Scenarios

A GLOF happens when the natural dam of a glacial lake, usually a moraine of loose debris, fails, often after an avalanche or landslide drives a wave into the lake. The released water travels down the valley as a flood wave, often picking up sediment. People downstream need two numbers: when the water arrives and how big the peak is. The Atlas's engine can stay. Its defaults for both numbers need to change.

### A. Wave speed: too slow where it matters most

During the July 2016 Gongbatongshacuo outburst, a seismic network on the Bhote Koshi recorded a front that "propagates between stations at 8.7 m/s", reaching maximum depth within two minutes, followed by a larger sediment-laden pulse "slower, at 5 m/s" [1]. The back-calculation of the 1941 Palcacocha outburst in Peru gives "travel times between 36 and 70 min" over about 23 km, about 5.5–10.6 m/s, though as a model bound rather than a measurement [11].

The arithmetic is uncomfortable. Ten kilometres below a source, an 8.7 m/s front arrives in about 19 minutes; the Atlas says 28, 42 or 83. At 30 km the measured speed gives about 57 minutes against the Atlas's 83 to 250. The slowest case is wrong by a factor of about four, always toward more time than people would have. Cascades can be faster still: a preprint reconstruction of 2026 estimates about 52 m/s from source to border, decaying to 6.4–7.2 m/s on the lower Trishuli [24]. That event was an ice-rock avalanche mass flow, not a moraine breach, and the figures rest on two non-independent preprints. They justify a separate case, not a new default.

The fix: replace 2/4/6 with a 3/6/9 m/s bracket for moraine-dam scenarios, so the top case covers the measured front and the slow case keeps wide lower reaches honest. Add a labelled "mass-flow cascade" case with a fast near-field speed that decays downstream, flagged as resting on unreviewed reconstructions. Report one earliest-to-latest window per place ("first water could arrive between about 19 and 56 minutes after release"), never three lines or one number. A card that says "earliest about 5 minutes" is honest; one that says "28 to 83 minutes" is a hazard in itself.

A more sophisticated engine buys little. Moving from simplified to fuller hydraulic routing raised peak-discharge skill (Nash–Sutcliffe efficiency, a 0–1 fit score) from 0.48 to 0.71 on large rivers, yet "accuracy ... still largely depends on the model forcing" [43]. In an outburst the forcing (breach size, volume, entrainment) is the dominant unknown. Nepal's own record favours simple, transparent models: data-based forecasting in "a simple visual tool" raised Karnali lead times from 2–3 hours to 7–8 hours [44].

### B. Peaks: attenuation cuts both ways

Here honesty works against alarm. "As a GLOF travels downstream, the flood peak attenuates" while background discharge grows. In 2016 the peak of 1,500–2,100 m³/s at Chaku fell to 700–900 m³/s at Barabise, still above the 30-year monsoon flood of 490–560 m³/s, and the crossover where the outburst stopped being anomalous lay about 45 km downstream (55 km for the larger 1981 flood) [1]. Holding the source peak for 100 km overstates a clear-water outburst.

Cascades behave the opposite way. The 2021 Melamchi flood eroded 83.24 million m³ and deposited only 23.24 million m³ in its own valley, sending "more than 70% of sediment" onward (preprint) [45]. At Devghat in 2026, discharge rose from about 2,600 to 5,850 m³/s and mean channel width grew from 66.1 m to 266.5 m [24]. Thame's release of about 4–5 × 10⁵ m³ damaged a road bridge about 45 km downstream [3], and in figures reported on 28 August, 171 of the first 469 bodies recovered after the 2026 flood were in Chitwan, more than 100 river-km below the border [22]. Outbursts also destabilise slopes: river-connected landslide area in the 2016 monsoon was about 100 times a typical year's [1].

The display should show two labelled branches. "Clear-water outburst: peak falls with distance, comparable to a large monsoon flood beyond roughly 45–55 km." "Debris or cascade event: can stay destructive or grow far downstream; not simulated here." A crossover marker tells people far downstream that their main risk is the cascade.

### C. Source size: show the breach range

Breach size dominates the peak. A Tsho Rolpa study gives 8,198 to 26,662 m³/s for 20 m and 40 m breaches [46], and the Palcacocha authors insist that forward simulations need "a larger set of back-calculated GLOF process chains, taking into account the expected parameter uncertainties" [11]. Listed lakes should get low and high breach cases from published studies; unlisted lakes a volume range estimated from area, labelled "uncertain by a factor of several".

### D. Origins: tier the lakes, and ship tiering with framing

The 2020 ICIMOD/UNDP inventory mapped 3,624 glacial lakes in the Koshi, Gandaki and Karnali basins and named 47 potentially dangerous lakes: 21 in Nepal, 25 in Tibet draining into Nepal and one in India [12]. It ranks lakes for mitigation spending; it is not a census of sources. "Extreme climatic conditions, seismic activity, and human interference ... are not considered", and only 13 of the current Nepal lakes carried over from the earlier list [12]. At Thame, an avalanche into the upper of two small lakes sent a wave 650 m down into a moraine-dammed lake, which breached [3]. A preprint finds the upper lake grew more than twelvefold in area between 2015 and 2024 and reports 36 households destroyed [47].

An open alternative exists. A 2026 inventory maps 31,698 glacial lakes across High Mountain Asia, including Nepal's Tibetan headwaters, in two epochs and under a CC BY 4.0 licence [48]. It captures all lakes above 100,000 m², about 96% between 20,000 and 100,000 m², and only 25% below 5,400 m² [48], the size class Thame's upper lake occupied in 2015.

The design is a tiered origin layer:

- **Tier 1, official:** the 21 Nepal lakes with ICIMOD's rank and citation, linked rather than redistributed, because the inventory is licensed CC BY-NC-ND [12].
- **Tier 1T, transboundary:** the 25 Tibet-side lakes with catchments drawn to the border, plus border-entry origins at Rasuwagadhi and the other crossings, so that when an alert says a flood "has entered from the Tibet side", the matching scenario already exists.
- **Tier 3, mapped but unassessed:** open-inventory lakes of at least 0.02 km² in Nepal-draining catchments, labelled "mapped lake, not assessed, not on any danger list, scenario is hypothetical", with volume ranges and a cascade option. No rankings, no "danger" words.

Exposure justifies the effort: ICIMOD figures put about 141,911 people below Tsho Rolpa and 165,068 below Thulagi [12]. But expansion raises the stakes of misreading. Hundreds of new scenario buttons without the "hypothetical" frame multiply the chance that someone reads a model run as a forecast for their valley. Tiering and framing ship together or the expansion waits, and a reader test decides whether Tier 3 stays visible by default.

### E. State what is not modelled, and validate

Each flood report needs a "not modelled" box beside the numbers: entrainment and debris flow, avalanche or landslide triggers, cascades unless selected, flood-triggered valley-wall landslides, inundation depth, and channel change (Melamchi's lower basin "widened by 3-5-fold and aggraded by ~5-20 m" [45]). The engine suits order-of-magnitude arrival windows along a main channel; it does not answer "will my house flood". Heavier physics can inform the site without running in the browser: r.avaflow, an open framework for mass flows that "explicitly considers both entrainment and stopping with deposition", could be run offline by a university partner for a few high-exposure origins, though "thorough parameter studies will be necessary" first [49].

Validation comes before claims. The 2016 outburst is the ideal hindcast, with a known origin, measured front speed and measured peaks [1]. Run the new defaults, check whether the arrival window contains the observed timing and whether the Barabise peak is within a factor of two, and publish the result either way. Thame's damage reach [3] and the official 2026 timeline [20, 21] are secondary checks.

## 5. Earthquake Scenarios

An earthquake scenario chains three steps. A ground-motion prediction equation (GMPE, a statistical model fitted to recorded earthquakes) predicts shaking from magnitude and distance. A site term adjusts for local ground through Vs30, the average shear-wave speed in the top 30 m: soft sediment (low Vs30) amplifies shaking, rock (760 m/s and up) does not. The shaking is then mapped against people and buildings. In Nepal the largest error sits in the cheapest input to fix.

### A. The rock default is the largest understatement

The Atlas sets Vs30 to 760 m/s unless the user changes it, but most Nepalis do not live on rock. In the Kathmandu valley, Gorkha ground motions at Siddhitol "exceed the design levels from the Nepalese Building Codes" [10]. The USGS Global Vs30 Mosaic, a slope-based grid at 30 arc-seconds ranging from 98 to 2,197 m/s, is free; the global file is 631 MB, a Nepal clip a few megabytes [50]. The best delivery is not a raster at all: sample Vs30 at build time onto the population cells the Atlas already ships, keep the manual override and state the proxy's origin. Slope proxies are weakest in flat basins, so implausibly stiff valley values should be overridden by a polygon from published microzonation.

### B. One model understates uncertainty in the Himalaya

The most systematic test ranks 16 GMPEs against 465 records from 122 earthquakes. For the Himalaya it concludes that "the NGA-West2 GMPEs are not suitable too for most of the periods. However, ASK14 and IDR14 show better LLH scores", with Japanese models such as ZHAO06 best at the shortest periods [2]. BSSA14 belongs to NGA-West2, a family fitted mainly to global shallow-crustal data. At the shortest periods its mean normalised residual is about +1: recorded shaking sat roughly one standard deviation above its median, while ZHAO06 sits near zero [2]. A Gorkha study, available only as an abstract, likewise found that relations "developed for the Himalayan region should only be used" [51].

The limits are real. The ranking is a preprint drawn mostly from Indian networks, kinder to BSSA14 in the Indo-Gangetic Plains, and its authors stress that "no single GMPE can be considered suitable for the entire range of spectral periods" [2]. That does not justify swapping one model for another. It does justify ending the practice of presenting one median as *the* shaking, because disagreement between models is uncertainty about which model is right, and one model's own scatter cannot show it.

The order of work follows. Show the ±1 standard deviation band the code already computes. Run a Gorkha 2015 hindcast with per-cell Vs30 against station records and the USGS ShakeMap, whose archive USGS uses for "calibrating global earthquake loss estimation" [52], and publish residuals by site class. If bias exceeds about 0.3 natural-log units, as the preprint makes likely, adopt a BSSA14–ASK14–ZHAO06 ensemble and show the spread between models as the main uncertainty display. It costs a few kilobytes of coefficients.

### C. The Kathmandu basin: what PGA cannot show

Kathmandu's caution runs against a naive "soft soil means higher PGA" fix. At Kantipath, "the short-period ground motions of the mainshock were relatively weak despite the proximity of the site to the source fault", because of strong nonlinear soil response, while motion at 4–5 s periods was large [53]. Another analysis found "a narrower and larger peak at ~0.4 s and a smaller, but very wide, peak at ~5 s", with design spectra underestimating demand on flexible structures [54]. A valley model from the Gorkha sequence found the long-period site term "has a strong correlation with the bedrock depth" [55]. In the basin the danger shifts to long periods that tall buildings feel and a PGA map cannot show. The honest response is a fixed note that long-period basin amplification was observed in 2015 and is not modelled, and, later, a separate long-period indicator built on the bedrock-depth relation [55].

### D. The lowest band is not "light"

Fragility curves from 665,515 damaged buildings in 603 villages show that "stone masonry buildings in Nepal are highly vulnerable even in the case of low to moderate ground shaking" [13]. Each band needs one sentence on what that shaking does to the buildings most rural Nepalis live in, and the lowest should read "lower modelled shaking in this scenario, still damaging to stone masonry". PAGER reports "the range of possible fatalities and economic losses" with uncertainty attached [31]. The Atlas should not estimate deaths, since PAGER's calibration rests on data a volunteer project cannot reproduce, but it should copy the habit of attaching consequences and ranges to every colour, plus simple exposure facts such as schools and health posts per band.

### E. What earthquake scenarios are for

USGS scenarios "describe the expected ground motions and effects of specific hypothetical large earthquakes" for preparedness and planning [52]. The ten historical presets are the tool's best teaching device, and the Gorkha preset should display its hindcast comparison. The open GEM/BGS national hazard grid (PGA at 10% and 2% probability of exceedance in 50 years, CSV) [56] can sit beside scenarios as a long-term reference. Two extensions fail the role test. Automatic "rapid scenarios" after NEMRC events would place an unofficial estimate beside official reporting, built on early magnitudes that get revised; linking out is better. Earthquake early warning works in seconds on dedicated networks, as a Nepal pilot that characterised two small earthquakes "in less than 10 seconds" showed [57]. A static site has no role there.

## 6. Serving Nepali Users: Language, Access and Reach

Reach decides whether any of this matters. A Nepali hazard site faces four constraints at once: uneven connectivity, modest digital skills, two scripts with many spellings, and readers with disabilities. Several of the resulting design rules are safety issues, not courtesies.

### A. Who can open the site

The figures disagree because they measure different things. The national household survey (NMICS 2024/25) found 82% of households with internet, 73% in rural areas, 68.5% in Karnali and 52.9% in the poorest group, with women's phone ownership at 81.6% against men's 90.4% [9]. ITU puts *individual* use at 48.4% and household access at 52.5% [26]; DataReportal counts 44% of people offline [58]. A household with one connected member is not a connected person, so individual use is the better guide. Skills are thinner still: 19.2% of respondents verified information they found online [9]. The realistic audience is mid-literacy smartphone users, officials, teachers, journalists and NGO staff, and everyone they print for.

### B. A page budget and a modest offline mode

High-usage mobile data costs 2.9% of gross national income per head [26]. The Atlas should hold the initial load to about 1 MB compressed with terrain off, enforce it in CI, and load each tool's data only when the tool opens. A service worker (a browser script that caches files) should store the app shell, interface text, saved places and their reports, and an opt-in basemap pack. Evidence for anything more is thin: a Raspberry Pi PMTiles field server reports good latency and 14 hours on a battery [59], but the result is self-reported with no Nepal users. Field servers are a partner's option.

### C. Nepali first, written in parallel, always Unicode

Nepali should be the default for Nepali-language browsers, with a visible switch and page-language attributes, as Nepal's accessibility position paper recommends [60]. Every banner, band label and action line should be written in parallel by a Nepali author against a shared glossary, reusing DHM's stage terms, following the call to "tailor messages in a language that different users understand" [19]. Text must be Unicode: Nepali in legacy fonts such as Preeti is "just graphic representation of Nepali text" to a screen reader [61]. Each scenario page should open with one plain sentence before any number.

### D. The map is not the content

A WebGL map alone cannot meet the Web Content Accessibility Guidelines (WCAG), because a screen reader cannot read it [62]. Every map output needs a text table of places with their windows or bands. Prayatna Nepal's audit, run with testers who have disabilities, found "inappropriate landmarks, heading styles and inaccessible colour contrast" on Nepali sites and sets 4.5:1 contrast, landmarks and keyboard operation as basics [60]. Bands and flood colours must also survive colour blindness, which affects hazard-map reading [4].

### E. English is a safety language too

Of the 977 people listed missing in NDRRMA's report of 27 August 2026, 517 were foreign tourists [20], and the alerts went out "only ... in Nepali, on a corridor that includes a major tourist trekking route" [25]. GLOF-exposed trekking corridors such as Khumbu, Langtang and Rasuwa need English one-pagers as much as Nepali ones.

### F. Teach the cue, through people people trust

Tsunami research offers the most transferable lesson. In a New Zealand survey of more than 1,100 people, many "expected an emergency mobile alert" for a local-source tsunami that "can arrive before an official warning can be issued", and about one in four did not grasp the need to leave at once; agencies answered with the rule "Long or Strong, Get Gone" [63]. Near-source GLOFs and debris floods are Nepal's local-source tsunamis. Reports for the first tens of kilometres below a lake should carry a short, tested bilingual cue whose substance is: a roar, a sudden muddy rise or debris in the water means go uphill now, without waiting for an SMS. The wording must come from Nepali partners and testing.

Trust decides how the cue travels. In 2026 a phone call to a head teacher emptied a school of 900 students ten minutes before debris buried it, and Nepalis "trust their family, friends and neighbors more than government officials" [25]. The Atlas's reach therefore runs through intermediaries (municipal focal persons, gauge readers, schools, the Red Cross) and through paper. DHM's own voice-alert pilot targets the same intermediaries because "it is difficult to send a bulk call to everyone at once" [64].

## 7. Printable Reports, Trust and Risk Communication

A printed scenario report is the product most likely to be kept, copied and acted on. It travels without the site around it, onto ward-office walls and into school files, and its reader may never see a disclaimer page. That makes its design a safety question rather than a layout one.

### A. The risk is misreading

The Protective Action Decision Model "posits that a hazard map is a form of warning message" [4]. In a tsunami-map study, "at least 33% of EXs and 47% of GUs did not clearly distinguish between tsunami hazard and evacuation maps" [5]: a third of experts and nearly half of the public. Many people read the hurricane uncertainty cone as zero risk outside it [4], and 57% of US residents inside official floodplains perceived lower risk than the official map, with 29% unsure [65]. Reassurance can kill: before the 2009 L'Aquila earthquake, official assurances "led many to remain in their homes when the earthquake struck", and probability formats lose their benefit for "low-probability, high-consequence (LPHC) events like major earthquakes" [66]. A scenario report is a warning-shaped object whatever its authors intend.

### B. A one-page specification

The report should be one A4 page, Nepali and English side by side or front and back, generated from accessible HTML:

1. **A fixed bilingual frame** on every page and map view: "Hypothetical scenario: not a forecast, not a warning. For warnings follow DHM, NDRRMA and your local authority", with scenario ID, model version, run date and a URL that recreates the scenario.
2. **What it is not:** "This is not an evacuation map. Routes and shelters come from your municipality or district disaster committee." That sentence answers the hazard-versus-evacuation confusion directly.
3. **One plain sentence first:** "If this lake released this volume, the first water could reach [place] between about 18 and 40 minutes later."
4. **A place table** of named wards and settlements, since recognisable features aid reading [4].
5. **Ranges, never points:** windows, rounded counts, peaks from "lower (clear water)" to "higher (debris)". No area labelled "safe".
6. **The "not modelled" box** from the flood and earthquake tools.
7. **Whom to ask:** official channels and municipal contacts, with generic preparedness advice and never a scenario-specific evacuation instruction. DHM's 1155 line belongs on the card, though it is "not advertised widely due to limited capacity" [8].
8. **Accessible and photocopy-proof:** a text version alongside, since Nepali PDFs are "not accessible to screen readers even if they are written in Unicode" [61]; conjunct-safe type without letter-spacing [37]; legible in greyscale.

The format has a Nepali precedent: in 2015 relief actors asked KLL for "printable maps, for navigation on the ground in places where mobile maps were unreliable" [67]. A laminated, place-specific arrival card for a ward office, school or hotel is the natural evolution of the current report.

### C. Bands or gradients: settle it with a test

Contour-style maps "produce the better understanding of uncertainty about hazard exposure than gradational shaded or binned maps" [4], yet Nepali stakeholders asked for colour codes, one noting that "people don't have an idea of uncertainty; we have to train people" [8]. Single-zone tsunami maps produced higher risk perception than multi-zone ones [63], and the public preferred simpler maps than experts did [5]. The tiebreaker is to tailor and test with the audience [68]: keep five soft-edged bands by default, offer a contour view, and let a reader test decide.

### D. Provenance, and the line not to cross

PAGER's one-pager, with ranges, vulnerable building types and an instruction to seek the latest release, is the model [31]. Each report should list its inputs and dates (population grid, inventory edition and tier, Vs30 source, model version, official data timestamps), and a public changelog should record every default change, such as the move from 2/4/6 to 3/6/9 m/s. Ward officials will forgive an uncertain number they can trace, not a confident one a newspaper later shows was too low. Provenance also guards authority: "an inconsistency in modelling and mapping hazards ... created opportunity for challenge and the selective mobilisation of scientific uncertainty to dispute the legitimacy of official maps" [27]. The Atlas should cite official products, state where and why it differs, avoid zone names with a legal ring, and hand every evacuation decision to "your ward, municipality or DHM".

## 8. Missing Hazards and Capabilities

The Atlas covers three hazards; Nepal faces more, and they interact. The useful question is which additions improve calibration without adding uncertainty the site cannot yet show honestly. Landslides, cascades, impact information, transboundary catchments and climate each get a different answer.

### A. Landslides: history, not prediction

By 17 July 2024, 38 fatal landslides had killed 135 people in Nepal [69], and the September 2024 floods and landslides caused 249 deaths and an estimated NPR 46.68 billion in losses [70]. Prediction is out of reach for a static volunteer site: Nepal's AI forecasting tool "is currently not available for open access distribution", and localised short bursts of rain "could make it challenging to predict them in real-time" [71]. For Melamchi in 2021, "we still do not have rainfall data" [72]. The right sequence is a dated incident-history layer from BIPAD (once licensed), a monsoon "season so far" ledger, and a note in every flood and earthquake result that the scenario can trigger landslides. A susceptibility model comes last, with published validation.

### B. Cascades and cross-hazard links

The 2026 reconstruction calls for "process-chain surveillance that connects unstable rock-ice source areas, entrainment-prone transport corridors, temporary blockages, and exposed downstream assets" [24], and ICIMOD specialists warn that "the Himalayas do not always respect those categories" [73]. The mass-flow case should become a named cascade scenario type with an amplification flag and a blockage-and-release option. And because the official lake ranking excludes seismic triggers [12], each earthquake report can list lakes inside its stronger shaking bands as "lakes exposed to this scenario's shaking", a multi-hazard planning aid at little cost.

### C. Impact information, transboundary catchments and measured change

Nepal's official direction is impact-based warning, "communicating not only what hazard is expected, but what it could mean for people, livelihoods, infrastructure, and essential services" [74]. Counting OSM schools, health posts, bridges and hydropower intakes inside each scenario footprint delivers that without loss modelling. Rivers cross borders and information does not: a Nepal–China understanding on flood data "was never converted into a signed, binding mechanism" [22]. The Atlas cannot fix diplomacy, but cross-border catchments, the Tibet-side lakes and pre-built border-entry scenarios give any notice a ready downstream picture. Downscaled climate projections are too uncertain for a public map; measured lake growth between the open inventory's epochs [48], refreshed at least every five years as ICIMOD recommends [12], is honest change without projection.

### D. Out of scope

Earthquake early warning, cell broadcast, sirens and push alerts are operational systems; Nepal's cell-broadcast readiness work is a government and operator procurement [75]. The Atlas should explain and link to them. Building any of them, or setting its own danger thresholds, would turn a complement into a competing authority.

## 9. Impact, Partnerships and Sustainability

An unofficial platform reaches impact either by speaking to the public over officials' heads or by being useful inside official work. Nepal's record favours the second. Sustainability depends less on money than on whether the project can outlive its founders.

### A. The policy moment and the precedent

Nepal's Early Warnings for All (EW4All) roadmap, finalised at the end of 2025, is estimated to need US$360 million for 2026–2030 and calls for warnings in "a language and form [people] understand" [74]. Its endorsement slipped into mid-2026 amid political turmoil, and a national proposal to the Climate Risk and Early Warning Systems (CREWS) initiative remains pending [75]. Stretched official capacity leaves room for a free, validated preparedness layer, and the roadmap's risk-knowledge pillar is where the Atlas should offer itself.

The precedent is local. Before 2015, Open Cities volunteers mapped "over 100,000 buildings in the Kathmandu Valley"; afterwards the Nepal Army's GIS chief said the maps showed "areas like Ramkot and Balaju were heavily damaged" when the army had been "simply focusing on Bhaktapur" [67]. BIPAD itself was built by a civic tech non-profit for NDRRMA [14]. Honesty is the price of that kind of standing: an Atlas whose defaults understate hazard is a liability to agencies, while one that uses their thresholds and publishes validation is something they can point to. Friction remains possible, since DHM staff "didn't know the extent of the floods in the early stages when sending the SMSs" [25], and an outside site that seems to know more invites resentment. Every artefact should be visibly derived from official data and offered to the agencies first, with link-out-only status accepted if they refuse.

### B. Partnerships in order of value

1. **NDRRMA and DHM:** a written data-use confirmation, a named contact for corrections, and an offer of arrival-window tables and message templates.
2. **ICIMOD:** a reuse statement for the no-derivatives inventory [12] and a review of the outburst wording.
3. **KLL and OSM Nepal:** KLL reports 30+ projects and 40+ partner organisations [39] and anchors the community that maintains Nepali names in OSM [35].
4. **Universities:** OpenDRI recommends building GIS into "curricula" [7]; a semester project validating one hindcast is the right size.
5. **NGOs and the Red Cross,** as users of printed reports, where WMO says vulnerable groups need education on "how and where to receive warnings" [76].

### C. Sustaining a volunteer project

OpenDRI warns that "the risk ... is that risk data becomes stale" once champions move on, and names "immediate usefulness" as the key to success [7]. GeoNode shows the alternative to revenue: built to "encourage participation by others who have similar needs", it became self-sustaining until its sponsor was "just another partner", with documentation crucial to onboarding [77]. That is a sponsor's self-evaluation, but the prescription is cheap: a bilingual contributor guide, a methods page per engine, issue templates for "wrong place name" and "wrong data", and full reproducibility from the repository. The fail-loud pipeline doubles as a sustainability measure because it tells a successor what broke. Use should be measured without tracking people: cookie-free page counts by language, print clicks per scenario, aggregate zero-result searches and a feedback form, reported quarterly. Today the Atlas's assumptions about reach are untested; small, honest numbers will replace them.

## 10. Prioritised Roadmap

Five principles order the work. Fix what misleads before adding what is missing. Pair every change with a test, and gate the next step on it where evidence is C or D. Treat page weight as a budget. Ship expansion with its safeguard or not at all. Prefer changes that reduce future maintenance.

### A. Near term (next 3–6 months)

| # | Change | Evidence | Grade | Cost | Validation |
|---|---|---|---|---|---|
| N1 | Health file, schema checks, two timestamps and stale state on every panel, last-good fallback, CI issue on failure | Events unfold in minutes [22, 23] | B | <2 KB | V4 |
| N2 | Fixed bilingual "hypothetical, not a forecast or warning; not an evacuation map" frame with ID, version, date | Maps read as warnings [4, 5] | B | negligible | V3 |
| N3 | 3/6/9 m/s bracket, labelled mass-flow case, one window per place | Measured front; Palcacocha bound [1, 11] | A–B | negligible | V2 |
| N4 | Two-branch peak with crossover marker; breach range; "not modelled" box | Attenuation and cascade growth [1, 24, 45] | A–B | negligible | V2 |
| N5 | Per-cell Vs30 in population cells; ±1 SD shown; basin caveat; masonry wording on bands | [10, 50, 13] | A–B | KB per scenario | V1 |
| N6 | OSM search index with Nepali/romanised normalisation; zero-result log | [33, 34] | B | ~200–400 KB on focus | V5 |
| N7 | Positioned-glyph or HTML Devanagari labels; no letter-spacing | [36, 37] | B | small | 3-browser check |
| N8 | ~1 MB budget in CI; terrain opt-in; lazy tools | Individual use 48.4% [26] | B | negative | V6 |
| N9 | Accessible HTML as print source; text tables for every map | [61, 60] | B | negligible | V7 |

### B. Medium term (6–24 months)

| # | Change | Evidence | Grade | Precondition |
|---|---|---|---|---|
| M1 | Tiered lake origins with border entries, volume ranges, cascade option | [3, 48, 12] | B; C for misreading risk | N2 live; V3 passes; ICIMOD statement |
| M2 | Lake-change display between inventory epochs | [48, 47] | B | M1 |
| M3 | BSSA14–ASK14–ZHAO06 ensemble with spread shown | [2, 51] | C | V1 bias >~0.3 ln |
| M4 | Public validation page; Gorkha preset with hindcast panel | [52, 1] | A once run | V1, V2 |
| M5 | Place panels and laminated bilingual arrival cards for the Bhote Koshi–Trishuli, Sunkoshi, Dudh Koshi and Tamor corridors, with near-source cue | [25, 63] | B–C | N3, V3 |
| M6 | Self-hosted Nepal PMTiles basemap; offline pack | [38, 59] | B–C | N8 |
| M7 | Dated archive; loss tables by district; NEMRC events linked to USGS | [32, 31] | B | data-use confirmation |
| M8 | Hourly copy of the two verified BIPAD endpoints | [8] | D | N1 stable 60 days |
| M9 | CAP reader showing official alerts verbatim; templates offered to agencies; never emit CAP | [30, 28] | B | official feed exists |
| M10 | Landslide history and ledger; quake-to-lake link; facility counts | [69, 70, 12] | B | licences |
| M11 | Kathmandu long-period indicator | [55, 54] | B | V1 |
| M12 | Data-use letters, ICIMOD review, OSM name loop, university projects, privacy-respecting metrics | [7, 77, 39] | B–C | none |

### C. Validation tasks as first-class work

- **V1, Gorkha 2015 shaking hindcast:** per-cell Vs30 against station PGA and ShakeMap [52], bias by site class. Bias above about 0.3 natural-log units promotes M3; below it, the ensemble waits.
- **V2, 2016 Bhote Koshi outburst hindcast:** windows against the 8.7 m/s front, peaks against Chaku and Barabise [1]. A missed window reopens the speed bracket; a Barabise peak off by more than ×2 reopens attenuation.
- **V3, Nepali reader test:** twenty to forty readers in two districts across literacy levels, banner versus none, bands versus soft bands, asking "is this telling you a flood is coming?", "is the lowest band safe?" and "when could water arrive?". If more than a small minority read a scenario as an official warning or a safe zone, the frame is revised before M1 ships. No Nepal study of this exists; it is the largest open assumption in the roadmap.
- **V4–V7:** a 30-day feed-health audit; 200 real place-name queries in Devanagari and romanisation with a published success rate; a throttled-3G test on a budget Android phone; and a screen-reader audit through a disability organisation, following Prayatna's approach [60].

### D. What not to do, and what would change the order

Do not run a warning channel, send SMS, set CAP urgency or severity, or publish CAP under the Atlas's name; official chains work for river floods and are being extended through CAP and cell broadcast [30, 75]. Do not invent danger thresholds. Do not build browser process-chain physics, landslide prediction, loss modelling or climate projections. Do not add a server or credentials; everything here fits the static design.

Three findings would reorder the list. If V1 shows BSSA14 with per-cell Vs30 within about 0.3 natural-log units of Gorkha records, the ensemble waits. If V3 shows readers do not take scenarios for forecasts even without a banner, the lake tiers can move earlier. If peer-reviewed reconstructions show roughly constant 4–6 m/s fronts from the source, the speed change softens. Each is cheap to find out.

### E. Looking ahead

Over the next two years the Atlas's environment will reward this ordering. Nepal is formalising CAP [30], preparing cell broadcast [75] and extending BIPAD into impact-based forecasting [32]. When official machine-readable warnings arrive, a site that already separates "official, timestamped" from "hypothetical, ranged" can show them as thin verbatim displays and retire its scrapers, a maintenance gain. Every new channel will also need what none currently supplies: pre-computed, place-level, bilingual answers to "how long do I have here?" When cell broadcast reaches a phone in Betrawati in ten seconds, the message will be no better than the generic text of 2026 unless someone has already worked out what Betrawati needs to hear. Open lake inventories are moving toward annual updates [48], which will give the tiered layer real change-detection value. And a funded EW4All risk-knowledge pillar [74] will look for exactly the open, bilingual, validated tool this roadmap builds. The near-term work buys credibility through honest defaults and public validation; the medium-term work buys coverage, because only a credible tool can expand without being misread as a competing authority.

## Sources

[1] Cook, K. L. et al. (2018). Glacial lake outburst floods as drivers of fluvial erosion in the Himalaya. Science (author PDF). https://wpg.forestry.oregonstate.edu/sites/default/files/seminars/cook_etal_2018_glacial_outburst_erosion.pdf
[2] Selvan, S. and Sinha, S. (2024). Ranking of 16 ground motion prediction equations for the Western and Central Himalayas and Indo-Gangetic Plains (arXiv preprint 2410.05918). https://arxiv.org/abs/2410.05918
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
