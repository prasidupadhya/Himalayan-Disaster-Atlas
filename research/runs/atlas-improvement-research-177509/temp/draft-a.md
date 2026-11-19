# How the Himalayan Disaster Atlas Can Improve: Honest Numbers First, New Features Second

**Executive summary.** The Himalayan Disaster Atlas will gain more from becoming *honest about its hazard* and *useful before an event* than from any new feature. Today three of its default settings lean the same way: they make hazard look smaller than the evidence supports. The earthquake scenario puts every person on rock (Vs30, the average shear-wave speed in the top 30 m of ground, set to 760 m/s) and uses one ground-motion model (BSSA14) that, on Himalayan records, predicts lower short-period shaking than was recorded, by about one standard deviation on average [1]. The flood and glacial-lake outburst (GLOF) scenario moves its wave at 2, 4 or 6 m/s. The only measured Himalayan GLOF front in the evidence travelled at 8.7 m/s [2], and a back-calculated Andean outburst implies 5.5 to 10.6 m/s [3]. Its lake origins come from an official list, yet the 2024 Thame flood came from two small lakes that no list had flagged [4]. For a public tool, understating hazard is the worse mistake. People already judge their risk as falling away with distance from a source [5], and official reassurance has led people to stay indoors before a deadly earthquake [6].

The fix is not a new engine. It is four connected changes. First, set defaults that do not understate: per-cell Vs30, a small set of ground-motion models, faster wave speeds tested against real events, and a tiered lake layer. Second, make ranges and the line "hypothetical, not a forecast or a warning" the main display, not small print. Third, make every copied official reading show its age and fail loudly when stale. Fourth, present the site as a pre-event planning tool that sits beside official warnings: arrival windows per place, printable household and ward one-pagers, and plain "act on these signs, do not wait for an SMS" messages. Nepal's deadly gaps are in sub-hour timing and last-mile reach [7] [8], and a daily static copy cannot close them. What it can do is make sure that, before the next flood, people near the river already know their window is minutes, not hours. Landslides, climate projections and more feeds can come later. Each would add more surface that has to be kept honest.

## 1. Where the Atlas Stands Today

### A. What already works

The Atlas makes structural choices that most hazard portals get wrong. It is static, so it costs almost nothing to run and copes with sudden traffic. It is bilingual and uses the Nepali district names from Schedule 4 of the constitution, so its place names carry legal weight rather than being ad-hoc romanisations. Its scenario reports can be printed, which matters in a country where only 14.7% of households report radio access and 68.5% of Karnali households have home internet [9]. Its earthquake model files already list what they leave out (no basin-depth term, no regional anelastic adjustment, no spatial correlation of residuals), and the code computes a total standard deviation even though the map does not show it. That habit of disclosure is the seed of the project's best improvement path.

### B. The common pattern behind the gaps

Looked at one hazard at a time, the gaps seem unrelated: a Vs30 slider, a wave-speed triplet, a list of lakes. Put side by side, they share a direction. Each default sits on the low side of the evidence:

| Default today | What the evidence shows | Direction of error |
|---|---|---|
| Vs30 = 760 m/s (rock) everywhere | Kathmandu basin and Terai sit on soft sediment. Gorkha motions at Siddhitol exceeded building-code levels [10] | Understates shaking where most people live |
| BSSA14 alone | Mean normalised residual of about +1.1 at 0.01 s on 465 Himalayan records: observed above predicted [1] | Understates median short-period shaking |
| Wave speed 2/4/6 m/s, no attenuation | Measured GLOF front 8.7 m/s [2]; implied 5.5 to 10.6 m/s at Palcacocha [3] | Arrival too late near the source; peak too high far downstream for clear-water floods |
| Origins limited to listed lakes and reaches | Thame 2024 came from two small unlisted lakes [4]; the official list leaves out seismic and climatic triggers [11] | Hides real sources |
| Five crisp PGA bands with population counts | Stone masonry is "highly vulnerable even in the case of low to moderate ground shaking" [12] | The lowest band reads as safe |

Not every error points the same way. Holding a GLOF peak constant downstream overstates it for clear-water outbursts, which attenuate [2]. Section 4 treats that seriously. But the errors that matter most for life safety all err toward reassurance: arrival that is too late, shaking that is too low, and a source that is missing. A preparedness tool that reassures by default reverses its own purpose.

### C. The thesis this draft defends

The Atlas's next stage should be judged by one test: *would a resident who read it, printed it and acted on it be better calibrated about their own exposure than one who did not?* By that test, the top priorities are calibration (defaults and ranges), framing (hypothetical, not a warning) and preparedness content (windows, cues, plans). The usual feature wish-list (more feeds, a landslide model, live alerts, 3D everything) comes after. **Committed reading:** the Atlas is a well-built shell around numbers that are too comfortable. Fixing the numbers and how they are shown is the highest-return work available.

## 2. Official Data Feeds: DHM, BIPAD and NEMRC

### A. What the daily copy can and cannot be

The scraper copies Department of Hydrology and Meteorology (DHM) pages, BIPAD (the NDRRMA disaster information portal) and National Earthquake Monitoring and Research Center (NEMRC) pages once a day. That is the right frequency for context and the wrong one for safety. The 26 August 2026 Bhotekoshi-Trishuli disaster shows the gap. NDRRMA's situation report puts the trigger, a roughly 1 km² landslide and avalanche in the Lhende Khola about 20 km north-east of the Rasuwagadhi border point, at 08:40 [13]. A cross-border account says the flood "crossed into Nepal at Rasuwagadhi" with no alarm, and that "Sixteen minutes later, at 8:56 am, word finally reached the District Administration Office in Rasuwa" [7]. ICIMOD reported water rising in the basin around 09:00 and the Trishuli at Galchhi rising "by as much as nine metres within 30 minutes" [14]. DHM's public post came at 1:35 pm, "nearly five hours after the flood entered Nepal" [7]. The deadly part of the event lasted minutes to hours. A daily copy is up to 24 hours old.

The sources themselves disagree here. The sitrep places 08:40 at the trigger, about 20 km inside Tibet. The news account places 08:40 at the border. This is the kind of gap the Atlas will meet whenever it mirrors official numbers: casualty figures also diverge. The sitrep reports 359 bodies and 977 missing as of 27 August [13], while police and NDRRMA figures quoted a day later reach 469 bodies and 2,381 out of contact [7]. A mirror that drops the source and the time of a figure is passing on contested numbers as settled.

### B. Make freshness and provenance the interface

Every live panel should show two timestamps: when the agency published the value and when the Atlas copied it. When either passes a threshold, the panel should switch to a visibly degraded state. Suggested thresholds are about 6 hours for river and rain values and about 48 hours for bulletins. These are judgement calls and should be published as such. The degraded state should read "This copy may be out of date. For current warnings see DHM / BIPAD", in both languages. The pipeline should fail loudly: a health file per source, schema checks on BIPAD's JSON, an automatic issue after repeated failures, and last-good data kept with its age shown rather than a blank or, worse, a quiet "no alerts". The current pipeline mixes verified BIPAD JSON endpoints (river and rain stations) with HTML scrapes of DHM, NEMRC and NDRRMA pages, some of which need JavaScript rendering and none of which are verified. Moving each source to its most structured form, and saying which ones are fragile, is the reliability work that matters most.

### C. Use agencies' own warning levels, not invented ones

DHM's flood warnings use stages such as "prepare to evacuate" and "evacuate now", but "there is currently no standardised language for the SMS message; messages can be in Nepali, English, or romanised Nepali" [15]. Nepali stakeholders asked for "colour codes and ranges of probabilities" and for a common alerting protocol (CAP) to give "consistency in terminology or colour codes" [15]. The Atlas should show DHM's own thresholds and terms as the main signal on river stations and add trend context ("rising for 3 hours") as a secondary layer. It should never create its own danger colours for live data. An unofficial site with its own alarm scale would be a competing warning authority, and studies of hazard maps show that inconsistent maps become grounds to dispute official ones [16].

### D. From a daily copy to a durable archive

Because each day's copy is committed, the Atlas is quietly building something no agency publishes in one place: a dated, versioned history of what official portals showed. That history is worth more than another feed. It allows "what did the river stations show in the 48 hours before the Melamchi or Bhotekoshi floods" pages. It allows checking scenario presets against real station records. And for NEMRC, it allows a growing catalogue of felt earthquakes that can seed scenario presets and link to the USGS ShakeMap and PAGER products for real events, rather than the Atlas recomputing them. USGS itself advises that users "always seek the most current PAGER release for any earthquake" [17]. Linking out for real events, and modelling only hypothetical ones, keeps the Atlas's role clear.

### E. Counterargument: should the Atlas chase live alerting?

The best case for live alerting is that Nepal's warnings still fail. Around 250 people died in the September 2024 floods "in-spite of a clear and categorical alert, four days in advance" from DHM [8], and the Bhotekoshi timeline above is damning. But those failures sit in last-mile reach and in cross-border data that "was never converted into a signed, binding mechanism" [7]. A daily static copy would not have changed any of them. Official riverine warning has also improved a great deal: flood deaths fell "from 166 in 2017 to to 27 in 2022 despite higher magnitude flooding in 2022" after DHM's forecasting service and flash-flood guidance [18]. The Atlas should not get between that system and the public. **Committed reading:** rank staleness signals, provenance and a historical archive above more feeds. Treat any CAP output as an unofficial mirror offered to the agencies, not as an alert channel.

## 3. The Map and Place Search

### A. Search is a reach problem disguised as a feature

A resident who types साँखु and gets nothing has been shut out as surely as one with no signal. OpenStreetMap Nepal's own conventions name the problem: "साँखु could be written as sankhu or shankhu, चितवन as chitwan or chitawan, गोर्खा as gorkha or gorakha", and the community resolved to use the Survey Department's standard transliteration and to tag `name`, `name:ne`, `alt_name` and `name:en` "so that the search function of softwares can find the features" [19]. The `name:ne` key is the de facto tag for Nepali in Devanagari and "should reflect local pronunciation accurately" [20]. The Atlas's search currently combines GeoNames points with constitutional district names. Its next step is a normalisation layer that folds the main spelling variants (chandrabindu and anusvara, short and long vowels, sh/s, w/b, final schwa) in both scripts, and indexes all four OSM name keys. The constitutional naming should then extend down to the 753 local levels and to wards, where hazard decisions are actually made.

### B. Lines on a map are read as rulings

Hazard-map research is clear that maps work as warning messages. The Protective Action Decision Model "posits that a hazard map is a form of warning message" [5]. Lines on such maps carry consequences: in Christchurch, the red zone mattered "because it defined areas where householders could not move back into properties and were offered government compensation" [16]. Two design choices follow for the Atlas. Scenario edges should be soft: feathered or hatched fills, no hairline outlines, and an "edges are uncertain by about one band" note. Where the map must speak about places, it should do so through features people recognise. Maps "are easier to interpret if risk area borders are defined by well-recognized features such as rivers, roads, and jurisdictional boundaries than by topographical contours" [5]. That argues for summarising scenarios by ward and municipality, using the constitutional names, rather than by abstract contour.

### C. Weight discipline

Every science layer proposed below (a Vs30 grid, a lake inventory, catchment polygons) adds bytes. Nepal's individual internet use is 48.4% while 4G covers 81.6% of the population [21]. Karnali households lag at 68.5% home internet [9]. The map should load a light basemap and data first, keep 3D terrain behind a deliberate toggle, and fetch new layers per scenario or per basin rather than up front. **Committed reading:** the map's biggest gain is better Nepali search and soft, place-anchored scenario display. More layers come only when each one has a byte budget.

## 4. Flood and Glacial-Lake Outburst Scenarios

This is where the honesty problem is sharpest, because the model's outputs (arrival times and peaks at named places) look most like a forecast.

### A. Wave speed: the default is too slow where it matters most

The Atlas moves a triangular or rectangular release hydrograph downstream at 2, 4 or 6 m/s. The best direct measurement of a Himalayan GLOF front comes from a seismometer array on the Bhotekoshi during the July 2016 outburst. The front "propagates between stations at 8.7 m/s", maximum flow depth "was reached within 2 min", and a second, sediment-laden pulse followed at 5 m/s [2]. The Lake Palcacocha back-calculation in Peru gives "travel times between 36 and 70 min" over the 23 km to Huaráz [3], which implies mean front speeds of about 5.5 to 10.6 m/s. Its authors caution that "no travel times or velocities are documented for the 1941 event", so this is a model bound, not a measurement [3].

The consequence is easy to work out. Ten kilometres below a source, an 8.7 m/s front arrives in about 19 minutes. The Atlas's three cases put it at 28, 42 and 83 minutes. Thirty kilometres down, the measured speed gives about 57 minutes against the Atlas's 83 to 250. The slowest default case is wrong by a factor of four and the fastest by about 1.5, all in the direction of more time to escape than people would actually have. The Bhotekoshi 2026 cascade suggests near-source speeds can be higher still. If the 08:40 trigger sat about 20 km above the border [13] and the basin rise was seen around 09:00 [14], the front averaged something like 15 to 20 m/s. That arithmetic is fragile, because the sources disagree on where 08:40 belongs, but it points the same way.

**Recommendation.** Replace the 2/4/6 triplet with a mid-reach default band of about 5 to 9 m/s anchored on the measured 8.7 m/s front. Add a separately labelled "mass-flow cascade (ice/rock avalanche, debris flow)" case with much higher near-source speed that decays downstream. Report arrival as one earliest-to-latest window per place ("about 15 to 35 minutes after release"), never as three lines or one number. The lower river, where the Atlas's old speeds were closer to reality, keeps a narrower window. The near field, where they were most wrong, gets the widest and earliest one.

### B. Peaks: attenuation cuts both ways, so show both branches

Here honesty works against alarm. Cook and colleagues write that "as a GLOF travels downstream, the flood peak attenuates and the peak discharge decreases, whereas the drainage area and background discharge increase, giving rise to a crossover point where GLOF discharges are no longer anomalous". For the 2016 and 1981 Bhotekoshi floods that crossover with the 30-year monsoon flood lay "about 45 and 55 km downstream" of the source confluence [2]. A model that holds the source peak constant for 100 km overstates a clear-water outburst far downstream. Tsho Rolpa studies quote breach peaks of 8,198 to 26,662 m³/s for 20 m and 40 m breaches [22], and a reader will take those as the flood at their own village.

Cascades behave differently. The 2021 Melamchi flood eroded 83.24 million m³ and deposited only 23.24 million m³ in its own valley, so "more than 70% of sediment has been transported" onward into the Indrawati. Its authors judge the event "not primarily driven by a single source" [23]. Thame's small release of about 4 to 5 × 10⁵ m³ still caused "landslide damage to a key road bridge ~45 km downstream" [4]. In the 2026 Bhotekoshi event, 171 of the first 469 bodies recovered were in Chitwan and 110 in Nawalparasi East [7], more than 100 river-km below the border. No attenuation curve fitted to clear-water floods would have flagged that.

**Recommendation.** Show peak as two labelled branches. "Clear-water outburst: peak falls with distance, comparable to a large monsoon flood beyond roughly 45 to 55 km" [2]. "Debris or cascade event: can stay destructive or grow far downstream; this model does not simulate it." Put the crossover distance on the map as a marker. It is one of the most useful pieces of preparedness knowledge the science offers, and it tells people far downstream that their main risk is the cascade, not the clean outburst.

### C. Source size: show the breach range, not one hydrograph

The Tsho Rolpa breach study gives a factor of 3.3 between 20 m and 40 m breach depths [22]. The Palcacocha authors warn that "predictive simulations of possible future events have to be based on a larger set of back-calculated GLOF process chains, taking into account the expected parameter uncertainties" [3]. The Atlas should treat breach depth and lake volume as ranges by default. For listed lakes it should offer a low and a high breach case from published studies. For unlisted lakes it should give a volume range from area with an explicit "volume estimated from area, uncertain by a factor of several" label until a verified area-volume relation is coded.

### D. Origins: tier the lakes, and ship tiering together with framing

The ICIMOD/UNDP 2020 inventory mapped 3,624 glacial lakes in the Koshi, Gandaki and Karnali basins (2,070 in Nepal). It treats 1,410 lakes of at least 0.02 km² as "large enough to cause a glacial lake outburst flood" and ranks 47 potentially dangerous lakes, 21 of them in Nepal and 25 in the Tibet Autonomous Region [11]. The ranking itself states its limits: "extreme climatic conditions, seismic activity, and human interference ... are not considered" [11]. It is also unstable: "only 13 of them are the same PDGLs identified previously; eight PDGLs have been deleted from the earlier list and eight new PDGLs added" [11]. A list that changes by more than a third between editions, and leaves out earthquakes in one of the most seismic places on earth, is a tool for deciding where to spend mitigation money. It is not a census of possible sources.

Thame makes the point. It "originated from a cascade of two small lakes that had not previously been considered dangerous": an avalanche into the upper lake sent a wave 650 m down to a lower moraine-dammed lake, which breached [4]. A preprint finds the upper lake grew "more than 12 times its area from approximately 0.008 km² to 0.1 km²" between 2015 and 2024. The flood destroyed 36 households, and the authors call size-based prioritisation critically inadequate [24]. That preprint is not peer reviewed, but the conference abstract by Cook and colleagues is consistent with it.

An open alternative now exists. A 2026 automated inventory maps 31,698 glacial lakes across High Mountain Asia, including the Tibetan headwaters of Nepal's rivers, under a CC BY 4.0 licence on Zenodo [25]. Its accuracy is also honest about small lakes: it detects all lakes above 100,000 m², about 96% at 20,000 to 100,000 m², about 77% at 5,400 to 20,000 m², and only 25% below 5,400 m² [25]. Thame's upper lake in 2015 would have been in the bin the inventory mostly misses.

**Recommendation.** Three visible tiers. Tier 1: the official ICIMOD/UNDP list, linked and attributed, not redistributed in modified form, because it is licensed CC BY-NC-ND [11]. Tier 1T: the transboundary listed lakes upstream of Nepal, with catchments drawn to the border. Tier 3: "mapped lake, not assessed, not on any danger list", from the open inventory, at 0.02 km² and above in Nepal-draining catchments, with a cascade option wherever another lake sits a short distance downstream. Tier 3 must carry no ranking and no "danger" words. Expansion is only acceptable if it ships together with the framing in Section 7. Hundreds of new scenario buttons without the "hypothetical, not a warning" frame would multiply the chance that someone reads a model run as a forecast for their valley.

### E. Say what is not modelled, in the same place as the result

The current design lists model limits in documentation. They belong next to the number. Each flood report should carry a short "not modelled" box: sediment entrainment and debris flow; landslide-dam or avalanche triggers; cascades unless selected; channel change (Melamchi's lower channel "widened by 3-5-fold and aggraded by ~5-20 m" [23]); and gauge destruction. The ICIMOD inventory itself calls for "adequate information ... to the public in varied languages to help them understand GLOFs" [11]. A model that says what it cannot see is that kind of information.

### F. Validate against real events before claiming anything

Three hindcasts are possible with published numbers. First, the 2016 Bhotekoshi GLOF: 8.7 m/s front, 1,500 to 2,100 m³/s at Chaku [2]. Second, Thame 2024: release volume and the 45 km reach of damage [4]. Third, Bhotekoshi-Trishuli 2026: the 08:40 trigger, the 9 m rise at Galchhi in 30 minutes, and the 1:35 pm public post [13] [14] [7]. Publishing a "how this model compares with real floods" page, including where it fails, will do more for trust than any extra algorithm. **Committed reading:** keep the simple routing engine, because a static site cannot run a process-chain model responsibly. But its defaults must change now. The speeds are too slow near the source, the peaks are too high far downstream for clear water and silent about cascades, and the origins stop at a list that missed the most-studied recent Nepali GLOF.

## 5. Earthquake Scenarios

### A. The rock default is the largest single understatement

BSSA14 takes Vs30 as its site input, and the Atlas sets it to 760 m/s, a rock site, unless the user changes it. Most Nepalis do not live on rock. The Kathmandu valley floor and the Terai are sediment, and in the valley "clear site amplification within the Siddhitol Region" during Gorkha produced ground motions that "exceed the design levels from the Nepalese Building Codes" [10]. A free, global, slope-based Vs30 grid already exists: the USGS Global Vs30 Mosaic at 30 arc-seconds, ranging 98 to 2,197 m/s [26]. Clipped to Nepal and tiled, it is a few megabytes against 631 MB for the global file [26]. The default should become per-cell Vs30 from that grid, with the manual value kept as an override and the slope-proxy origin stated. Slope proxies are weakest in flat sedimentary basins. If the grid returns implausibly stiff values for the Kathmandu valley, a basin polygon from published microzonation should override it.

### B. One model is not enough; show the model spread

The Atlas uses BSSA14, a respected global model from the NGA-West2 family. The most systematic test in the evidence ranks 16 ground-motion prediction equations (GMPEs, models that predict shaking from magnitude, distance and site) against 465 three-component records from 122 earthquakes. For the western and central Himalayas it concludes that "the NGA-West2 GMPEs are not suitable too for most of the periods", with ASK14 and IDR14 doing better than the rest of that family [1]. The normalised residual table is the telling part. At 0.01 s, the period closest to peak ground acceleration (PGA), BSSA14's mean normalised residual is +1.14 [1]. Recorded shaking sat on average more than one total standard deviation above BSSA14's median, which for typical PGA sigmas means roughly a factor of two. By contrast the Japanese ZHAO06 sits at −0.08 and KAN06 at +0.25 at the same period [1]. A Gorkha-specific study reached a similar view: relations "developed for the Himalayan region should only be used, and other attenuation relations based on other regions fail to provide good estimate" [27].

The evidence has limits. The ranking is a preprint drawn mostly from Indian network records, and its authors say it is "not intended to make any judgement about any particular GMPE being superior or inferior" [1]. The Gorkha attenuation claim is available only as an abstract [27]. That is not enough to swap BSSA14 for another single model, and it is more than enough to stop presenting one model's median as *the* shaking. The defensible move is a small ensemble: BSSA14, ASK14 and a Japanese model such as ZHAO06 or KAN06. Show the median of the ensemble and the spread across models together with the ±1 sigma band the code already computes. That is how a professional hazard analyst would handle disagreeing models, and it moves the default toward the recorded data.

### C. The Kathmandu basin: what PGA bands cannot show

Kathmandu holds the most important caution in the whole project. It runs against a naive "soft soil means higher PGA" fix. At the Kantipath station (KATNP), "the short-period ground motions of the mainshock were relatively weak despite the proximity of the site to the source fault", because the site "experienced a considerable nonlinear site response". Meanwhile pseudo-velocity responses exceeded 300 cm/s at 4 to 5 s periods [28]. Another analysis of the same record found two spectral peaks, "a narrower and larger peak at ~0.4 s and a smaller, but very wide, peak at ~5 s". The 475-year uniform hazard spectra "significantly over-estimate seismic demands on stiff structures ... and underestimate the demands on more flexible" ones [29]. A Kathmandu-valley model built from Gorkha aftershocks found the long-period site term "has a strong correlation with the bedrock depth" and reproduced spectral peaks better than existing models across 1 to 10 s [30].

So in Kathmandu the danger moves to long periods, and a PGA map cannot show it. Taller and more flexible buildings respond to that long-period motion. The honest response is not to inflate PGA in the basin, since BSSA14's nonlinear site term will already temper soft-site PGA. It is to say plainly, on the map and in the report, that basin long-period amplification was observed in 2015 and is not modelled here. A medium-term option is a separate long-period indicator for the valley based on the bedrock-depth relation [30].

### D. From shaking to consequences: the lowest band is not "light"

The Atlas reports population per PGA band from a high-resolution population grid. That is an exposure count, and readers will treat the lowest band as the safe one. The largest observational dataset in the evidence says otherwise. Fragility curves from 665,515 building damage cases in 603 villages after Gorkha show that "stone masonry buildings in Nepal are highly vulnerable even in the case of low to moderate ground shaking", and that in strong shaking "most of the stone masonry buildings in Nepal would sustain severe damage or collapse" [12]. Each band needs a sentence on what that shaking does to the buildings most rural Nepalis live in. The lowest band should be renamed "lower modelled shaking in this scenario, still damaging to stone masonry". USGS PAGER offers a template for doing this without false precision: it reports "the range of possible fatalities and economic losses" and keeps "the necessary uncertainty measures by which one can gauge the likelihood for the alert to be over- or underestimated" [17]. The Atlas need not estimate deaths. It should copy PAGER's habit of attaching consequences and uncertainty to every colour.

### E. Validate on Gorkha and say why scenarios exist

ShakeMap scenarios "describe the expected ground motions and effects of specific hypothetical large earthquakes" and are used "for preparedness exercises and disaster planning" [31]. That is the right model for the Atlas's earthquake tool, and it calls for the same discipline: run the Gorkha M7.8 preset, compare it with recorded station PGA, and publish the residuals by site class before and after the Vs30 and ensemble changes. **Committed reading:** the earthquake tool's model class is acceptable, but its defaults are not. Per-cell Vs30, an ensemble with visible spread, a basin caveat and consequence wording per band together change what a Kathmandu or Terai reader takes away. On the evidence, they move it toward what actually happened in 2015.

## 6. Serving Nepali Users: Language, Access and Reach

### A. Who can actually open the site

Two national figures disagree and both matter. The 2024/25 household survey reports that 82% of households have home internet, urban 86.5% against rural 73%, with Karnali at 68.5% [9]. The ITU index puts *individual* internet use at 48.4% and household access at 52.5% [21]. Household access is the upper bound. Individual use is the better guide to who will open a web map. Skills are thinner still: "only 19.2% of those in the survey verified the information they found online", and 24.2% could copy and paste [9]. Broadcast is no fallback, with radio access at 14.7% [9]. These numbers push the Atlas toward a light page, plain wording, and print as a channel of its own rather than a convenience.

### B. Nepali first, Unicode always, text not images

Nepal's accessibility advocates found that "most websites had documents and other resources uploaded in traditional Nepali fonts such as 'Preeti', which is inaccessible to screen reader users", and that "Unicode is found to be inaccessible when it is applied in PDF format" [32]. They call on public providers to "adapt the WCAG standards" [32]. For the Atlas this means three things. Scenario results must also exist as HTML tables and lists, not only as map colours or PDF. Printable reports should be generated from real Unicode text with tested Devanagari shaping, not images. And defaults should be Nepali-first for Nepali-language visitors, with headings, landmarks and contrast that meet WCAG 2.2 AA.

### C. Plain wording, written in parallel, not translated

DHM's own alerts show the cost of unplanned language: no standard wording across Nepali, English and romanised Nepali [15]. The Atlas should write each banner, band label and action line in parallel by a Nepali author, not by machine translation. It should reuse DHM's warning-stage terms where they exist and test the wording with a small group of readers (Section 7).

### D. English is a safety language too

Bilingual content is not just a courtesy to donors. Of the 977 people missing in NDRRMA's 27 August Bhotekoshi report, 517 were foreign tourists [13], and the missing included pilgrims bound for Gosaikunda and Kailash [7]. Trekking corridors in the GLOF-exposed Khumbu, Langtang and Rasuwa need English one-pagers as much as Nepali ones.

### E. Teach the cue, not just the map

The most transferable finding comes from tsunami research. New Zealand survey work found that many people "expected an emergency mobile alert to warn them about a local-source tsunami", although a near-shore tsunami "can arrive before an official warning can be issued". That is why the agencies built a short action rule, "Long or Strong, Get Gone" [33]. Near-source GLOFs and debris floods are Nepal's local-source tsunamis: Thame was triggered by an avalanche [4], and in Rasuwa no alarm preceded the flood [7]. The Atlas's per-place reports should carry a short, tested cue in both languages for people in the first tens of kilometres below a lake or steep catchment. In substance it would say: a roar, a sudden muddy rise or debris in the water means go uphill now; do not wait for an SMS. The exact wording should come from Nepali partners and testing, not from this draft. **Committed reading:** the Atlas's reach comes from Nepali-first search and wording, a strict page budget, text alternatives and print. Above all, it comes from giving near-source residents a cue they can act on without any network.

## 7. Printable Reports, Trust and Risk Communication

### A. The problem is misreading

The evidence is consistent: people read hazard maps as instructions. In a tsunami-map study, "at least 33% of EXs and 47% of GUs did not clearly distinguish between tsunami hazard and evacuation maps" [34], meaning a third of experts and almost half of the general public. Hazard-map research admits it has "neglected the development and testing of spatial displays that can help people to make more timely and effective protective action decisions" [5]. Reassurance can kill. At L'Aquila, official assurances "led many to remain in their homes when the earthquake struck" [6]. Natural-frequency formats help people understand probabilities, but "the benefits of using natural frequencies decrease when dealing with low-probability, high-consequence (LPHC) events like major earthquakes" [6]. A scenario report is therefore a warning-shaped object whether its authors intend it or not, and it must be designed as one.

### B. The fixed frame

Every map view and every printed page should carry the same bilingual banner, which cannot be dismissed: "Hypothetical scenario: not a forecast, not a warning. For warnings follow DHM, NDRRMA and your local authority." It should also carry a scenario ID, the model version and the run date. The report should state, in its first lines, what it is not: "This is not an evacuation map. Evacuation routes and shelters come from your municipality or district disaster committee." That one sentence answers the 47% confusion directly [34].

### C. Ranges as the headline, bands with soft edges

Lindell's review reports that "isarithmic maps produce the better understanding of uncertainty about hazard exposure than gradational shaded or binned maps" [5]. Nepali stakeholders, on the other hand, asked for colour codes and ranges [15]. The workable synthesis keeps a few bands, because print and population tables need them, but presents them as ranges. Arrival windows read "about X to Y minutes". Population per band is rounded, with a statement that it depends on the scenario. Band edges are soft. No area is ever labelled "safe". There is one more design lesson: tsunami maps "with a single evacuation zone were associated with higher risk perceptions" than maps with several zones [33]. Fewer, clearer categories in the near field may help people act. Fine gradations far away invite the proximity heuristic, in which "perceived risk decreases with distance from the hazard source" [5].

### D. Provenance that a decision maker can audit

PAGER's one-page report is the model to copy. It gives uncertainty ranges, dominant vulnerable building types and secondary hazards, and it tells readers to seek the most current release [17]. Each Atlas report should list its inputs and their dates: the population grid, the lake inventory edition and tier, the Vs30 source, the model and version, and the official data timestamps. It should also carry the "not modelled" box from Sections 4 and 5. Decision makers in ward offices will forgive an uncertain number they can trace. They will not forgive a confident number that a newspaper later shows was too low.

### E. Avoid becoming a rival authority

Haughton and White found that "an inconsistency in modelling and mapping hazards ... created opportunity for challenge and the selective mobilisation of scientific uncertainty to dispute the legitimacy of official maps" [16]. An unofficial site that draws its own lines next to official ones risks exactly that. The Atlas should cite official products where they exist (ICIMOD lake lists, DHM thresholds, building-code zones), state where and why its scenarios differ, and avoid any zone names with a legal ring to them.

### F. Test it with readers

No study in the evidence tests how Nepali readers interpret scenario maps or banners. That is the largest open question behind this whole draft. A cheap test would resolve it: twenty to forty readers in two districts, banner versus no banner, bands versus soft bands, with the question "is this telling you a flood is coming?" It should run before the tiered lake layer ships. **Committed reading:** the report is the Atlas's most consequential product. Its frame, its ranges and its provenance matter more than its cartography.

## 8. Missing Hazards and Capabilities

### A. Landslides: important, but a model would add uncertainty the Atlas cannot yet show honestly

Landslides kill Nepalis every monsoon. By 17 July 2024 alone, 38 fatal landslides had killed 135 people, with "a dramatic increase in the number of fatalities from the middle of June" [35]. They also feed the floods the Atlas models: Melamchi's erosion came partly from "remobilization of Gorkha landslides, gullying, debris-flows" [23]. It is tempting to add a landslide susceptibility layer. Under this draft's test, though, a new hazard model would add a large new source of uncertainty before the existing ones are honestly shown. The better sequence starts with a historical landslide-incident layer drawn from BIPAD incident records the scraper already touches, clearly dated. Next comes cascade warnings inside the flood and GLOF reports ("this valley has recent landslide deposits that a flood can pick up"). A susceptibility model comes last, and only with a published validation.

### B. Earthquake-to-water linkage

The ICIMOD danger ranking excludes seismic triggers [11]. The Atlas is unusual in modelling both earthquakes and GLOFs, so it can make the link visible. An earthquake scenario report could list listed and unlisted lakes inside its stronger shaking bands as "lakes exposed to this scenario's shaking". That turns two separate tools into a multi-hazard planning aid at little cost.

### C. Early warning integration

No public DHM CAP feed was found, and BIPAD's reuse terms are not published. Nepali stakeholders want CAP for consistency [15], so the Atlas should be ready to consume it. Until an official feed exists, "integration" should mean clear links to official channels and a printed "how official warnings reach you" panel, not a home-made alert.

### D. Climate projections and live forecasts

Lake growth is real: Thame's upper lake grew about twelvefold in a decade [24], and the inventory authors recommend updates "at least every five years" [11]. The practical climate feature is therefore an inventory-change layer: lakes that have grown fast between the two epochs of the open inventory [25], shown with their detection limits. Downscaled climate projections are not a priority for a static public site. **Committed reading:** the Atlas's missing capabilities are mostly cross-links between hazards it already covers and honest change layers, not new hazard engines.

## 9. Impact, Partnerships and Sustainability

### A. Honesty is the price of partnership

Agencies do not endorse tools that may contradict them. An Atlas whose defaults understate hazard and whose maps look like rulings is a liability to DHM, NDRRMA or ICIMOD. An Atlas that uses their thresholds, cites their lists, publishes validation and frames scenarios as planning aids is something they can point to. The concrete asks are three. First, a written data-use statement from NDRRMA/BIPAD and DHM. Second, a reuse statement from ICIMOD for derivatives of its NC-ND inventory [11]. Third, a working link with the OSM Nepal community, whose conventions already describe the search normalisation the Atlas needs [19].

### B. Sustainability without revenue

The OpenDRI experience is sobering: "All current projects remain funded through their pilot or scaling funding plans. None have built self-sustaining revenue streams", and "without continuous funding, communities of practice often fall back to using familiar, older methods" [36]. The same guide names "the immediate usefulness of data and data platforms to problems in the country" as "the most important attributes for success" [36]. The Atlas's advantages are near-zero running cost and openness. Its sustaining model is therefore usefulness to municipal planners, teachers and journalists, plus contributors drawn from university courses and the OSM community. Practically, that means published model cards, a validation page, good-first-issue labels and a bilingual contributor guide.

### C. Measuring impact without tracking people

The Atlas should measure what matters to its thesis: report downloads by district, the share of sessions in Nepali, search queries that return nothing (the best guide to naming gaps), and the results of the reader test. It should not run invasive analytics. **Committed reading:** the Atlas's route to impact runs through being the most trustworthy unofficial planning companion to official agencies, not through scale or features.

## 10. Prioritised Roadmap

The ordering follows one principle: fix what currently misleads before adding what currently does not exist. Evidence grades: **A** is measured validation or a large observational dataset. **B** is peer-reviewed analysis or an official document. **C** is a preprint, abstract or journalism.

### A. Near term (next 3 to 6 months)

| # | Change | Why (evidence) | Grade | Validation the project can run |
|---|---|---|---|---|
| 1 | Bilingual "hypothetical, not a forecast or warning; not an evacuation map" banner on every view and page, with scenario ID, model version and run date | Maps read as warnings; 47% of public confuse hazard and evacuation maps [5] [34] | B | Reader test (item 12) |
| 2 | Replace 2/4/6 m/s with a 5 to 9 m/s default band plus a labelled mass-flow case; report per-place arrival windows | Measured front 8.7 m/s; Palcacocha implies 5.5 to 10.6 m/s [2] [3] | A/B | Hindcast 2016 Bhotekoshi |
| 3 | Two-branch peak display (clear-water attenuating, with 45 to 55 km crossover marker; cascade warning) | [2] [23] [4] | A/B | Hindcast Thame damage reach |
| 4 | Per-cell Vs30 from the USGS grid as default, manual override kept | Siddhitol exceeds code; open grid [10] [26] | B | Gorkha residuals by site class |
| 5 | Show ±1 sigma and rename the lowest band; add stone-masonry consequence text | [12] [17] | A | n/a |
| 6 | Kathmandu long-period "observed in 2015, not modelled" caveat | [28] [29] [30] | A/B | n/a |
| 7 | Freshness timestamps, degraded state, fail-loud pipeline health, last-good data | Event timescale is minutes; figures diverge [7] [13] | B/C | Monitor failure log |
| 8 | Nepali search normalisation using name, name:ne, alt_name, name:en | [19] [20] | B | Log zero-result queries |
| 9 | "Not modelled" box and input provenance on every report | [17] [16] | B | n/a |

### B. Medium term (6 to 24 months)

| # | Change | Why | Grade | Validation |
|---|---|---|---|---|
| 10 | Small GMPE ensemble (BSSA14, ASK14, ZHAO06 or KAN06) with model spread shown | BSSA14 mean residual +1.14 at 0.01 s in the Himalaya [1] [27] | C | Gorkha station comparison before and after |
| 11 | Tiered lake layer (official, transboundary, unassessed open inventory) with volume ranges and cascade option, shipped only with item 1 | Thame unlisted; open CC BY inventory [4] [25] [11] | B/C | Detection limits stated |
| 12 | Nepali reader test of banners, bands and cues in two districts | No Nepal study exists [5] [15] | n/a | It is the validation |
| 13 | Per-place preparedness one-pagers with near-source action cue in Nepali and English | [33] [13] [9] | B/C | Reader test |
| 14 | Public validation page (Gorkha, 2016 Bhotekoshi, Thame, 2026 Bhotekoshi) | [3] [2] | A | Self |
| 15 | Archive views of past official data; NEMRC events linked to USGS products | [17] [31] | B | n/a |
| 16 | WCAG 2.2 AA, HTML tables for all results, Unicode-tested print | [32] | B | Accessibility audit |
| 17 | Earthquake-to-lake cross-link; historical landslide-incident layer | [11] [35] | B | n/a |
| 18 | Kathmandu bedrock-depth long-period indicator | [30] | B | KATNP comparison |
| 19 | Data-use statements with NDRRMA/DHM, ICIMOD reuse statement, OSM Nepal partnership | [36] [11] | B | n/a |

### C. What would change this ordering

Three findings would reorder the list. If a Gorkha comparison shows BSSA14 with per-cell Vs30 fitting station PGA within about 0.3 natural-log units, the ensemble (item 10) can wait. If the reader test shows Nepali readers do not take scenarios for forecasts even without a banner, the tiered lake layer can move earlier. If peer-reviewed celerities for 2023 to 2026 Himalayan events show roughly constant 4 to 6 m/s from the source, item 2 softens. None of these is known today. Each is cheap to find out, and the roadmap treats finding out as work in its own right.

### D. Looking ahead

Over the next two years, the Atlas's environment will change in ways that favour this approach. Nepal has agreed to develop CAP procedures, cell broadcast has been costed, and inventories of glacial lakes are moving to automated, open and frequently updated forms [25]. When official machine-readable warnings arrive, a site that already separates "official, timestamped" from "hypothetical, ranged" can plug them in without confusing anyone. A site that blurred the two would have to unlearn habits its readers have formed. As lake inventories refresh every year or two rather than every decade, the tiered layer will gain change-detection value: which unlisted lakes grew fastest this year. That only works if the Atlas has already earned trust by saying clearly what its numbers can and cannot tell people. The roadmap above is designed for that future. Its first half makes the Atlas honest about what it models. Its second half makes it useful in the hours before a flood, when no network is needed and the only warning may be the sound of the river.

## Sources

1. Selvan, S. and Sinha, S. (2024). Data-driven ranking of ground motion prediction equations for the Western and Central Himalayas and Indo-Gangetic Plains (preprint, arXiv:2410.05918v1). https://arxiv.org/abs/2410.05918
2. Cook, K. L. et al. (2018). Glacial lake outburst floods as drivers of fluvial erosion in the Himalaya (Science; seminar PDF copy). https://wpg.forestry.oregonstate.edu/sites/default/files/seminars/cook_etal_2018_glacial_outburst_erosion.pdf
3. HESS - Reconstruction of the 1941 GLOF process chain at Lake Palcacocha (Cordillera Blanca, Peru). https://hess.copernicus.org/articles/24/93/2020/
4. Cook, K. L. et al. (2025). The 2024 Thame GLOF, Khumbu Nepal: causes, consequences, and dynamics (Abstract EGU25-12752). https://meetingorganizer.copernicus.org/EGU25/EGU25-12752.html
5. Frontiers | Improving Hazard Map Comprehension for Protective Action Decision Making. https://www.frontiersin.org/journals/computer-science/articles/10.3389/fcomp.2020.00027/full
6. Public understanding and scientific uncertainty: The communication of risk in the L'Aquila earthquake. https://www.aimspress.com/article/doi/10.3934/geosci.2024028
7. Sixteen Minutes: What the Bhotekoshi flood reveals about the region’s unfinished early-warning problem. https://www.borderlens.com/2026/08/28/sixteen-minutes-what-the-bhotekoshi-flood-reveals-about-the-regions-unfinished-early-warning-problem/
8. Missing On Early Warning – Pushed To Rising Death-Tolls And Losses Of Properties And Infrastructures | New Spotlight Magazine. https://www.spotlightnepal.com/2024/10/07/missing-on-early-warning-pushed-to-rising-death-tolls-and-losses-of-properties-and-infrastructures
9. Nepal’s 82% households have internet, but digital skills fall short. https://www.nepalitelecom.com/2026/02/nepals-82-households-have-internet-but-digital-skills-fall-short.html
10. Site amplification in the Kathmandu Valley during the 2015 M7.6 Gorkha, Nepal earthquake | Bulletin of Earthquake Engineering | Springer Nature Link. https://link.springer.com/article/10.1007/s10518-016-0003-8
11. ICIMOD and UNDP (2020). Inventory of glacial lakes and identification of potentially dangerous glacial lakes in the Koshi, Gandaki and Karnali river basins of Nepal, the Tibet Autonomous Region of China, and India. https://nepal.un.org/sites/default/files/2020-10/Inventory_Glacial_Lakes_2020_Full2.pdf
12. Observational fragility functions for residential stone masonry buildings in Nepal | Bulletin of Earthquake Engineering | Springer Nature Link. https://link.springer.com/article/10.1007/s10518-018-0372-2
13. NDRRMA Emergency Response Operations Center (2026). Bhotekoshi Flood Situation Report No. 6 (informal English translation). https://www.adrrn.net/wp-content/uploads/2026/08/Bhotekoshi-Flood-Situation-Report-No.-6-English-Translation.pdf
14. Major flash flood sweeps through Nepal’s Rasuwa district, raising fears of further downstream flooding - ICIMOD. https://www.icimod.org/press-release/major-flash-flood-sweeps-through-nepals-rasuwa-district-raising-fears-of-further-downstream-flooding/
15. GC - Communicating complex forecasts: an analysis of the approach in Nepal's flood early warning system. https://gc.copernicus.org/articles/3/49/2020/
16. Haughton, G. and White, I. (2018). Regular paper on hazard-map controversies, uncertainty and planning (University of Waikato Research Commons). https://researchcommons.waikato.ac.nz/bitstreams/a94bb2fb-421e-41fa-9009-28fd75226bd8/download
17. USGS. PAGER Scientific Background. https://earthquake.usgs.gov/data/pager/background.php
18. WMO (2025). Reducing flood casualties in Nepal. https://wmo.int/site/science-action/water-resource-monitoring-and-management/reducing-flood-casualties-nepal
19. Nepal/Meetings/2022-12-15 - OpenStreetMap Wiki. https://wiki.openstreetmap.org/wiki/Nepal/Meetings/2022-12-15
20. Key:name:ne - OpenStreetMap Wiki. https://wiki.openstreetmap.org/wiki/Key:name:ne
21. Nepal returns to global ICT Index but digital use still lags infrastructure growth. https://kathmandupost.com/science-technology/2026/07/02/nepal-returns-to-global-ict-index-but-digital-use-still-lags-infrastructure-growth
22. PIAHS - Glacial lake outburst flood (GLOF) modeling of Tsho Rolpa glacial lake, Nepal. https://doi.org/10.5194/piahs-387-59-2024
23. The 2021 Melamchi Flood: A massive erosional cascade in the Himalayan Mountains of central Nepal | Research Square. https://doi.org/10.21203/rs.3.rs-2766739/v1
24. Quantifying the long-term evolution of glacial lakes and the impact of the 2024 Thame, Nepal outburst flood event using remote sensing | Research Square. https://doi.org/10.21203/rs.3.rs-10032683/v1
25. Automated satellite-based glacial lake inventory and change detection in High Mountain Asia | Scientific Reports. https://www.nature.com/articles/s41598-026-35446-0
26. USGS. Vs30 Models and Data. https://earthquake.usgs.gov/data/vs30/
27. Attenuation relation predicted observed ground motion of Gorkha Nepal earthquake of April 25, 2015 | Natural Hazards | Springer Nature Link. https://link.springer.com/article/10.1007/s11069-015-1969-2
28. Analysis of strong ground motions and site effects at Kantipath, Kathmandu, from 2015 Mw 7.8 Gorkha, Nepal, earthquake and its aftershocks | Earth, Planets and Space | Springer Nature Link. https://earth-planets-space.springeropen.com/articles/10.1186/s40623-016-0432-2
29. The 2015 Mw 7.8 Gorkha Earthquake in Nepal and its aftershocks: analysis of strong ground motion | Bulletin of Earthquake Engineering | Springer Nature Link. https://link.springer.com/article/10.1007/s10518-017-0084-z
30. Ground motion prediction equation for the Kathmandu Valley, Nepal based on strong motion records during the 2015 Gorkha Nepal earthquake sequence | 北海道大学学術成果コレクション : HUSCAP. https://eprints.lib.hokudai.ac.jp/dspace/handle/2115/78975
31. USGS. ShakeMap. https://earthquake.usgs.gov/data/shakemap/
32. Prioritizing Digital accessibility for Inclusive. https://prayatnanepal.org/wp-content/uploads/2022/12/Position-Paper_FINAL.pdf
33. Science strengthening tsunami safety | PreventionWeb. https://www.preventionweb.net/news/science-strengthening-tsunami-safety
34. Assessing Perceptions and Interpretations of Tsunami Maps: Insights from the Public and Risk Experts. https://agris.fao.org/search/en/records/687a93b89d6e0577321f5d82
35. Fatal landslides in Nepal in 2024 to date. https://eos.org/thelandslideblog/nepal-landslides-2024
36. OpendRI | 7. Sustaining. https://opendri.github.io/guide/oldchapters/chapter7.html
