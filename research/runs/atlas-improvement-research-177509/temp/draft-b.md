# How the Himalayan Disaster Atlas Can Improve: The Case for a Near-Real-Time Complement

**Executive summary.** The Atlas should become more than a preparedness archive. It should not issue warnings. It should become a fast, place-specific and bilingual *complement* to official warnings. The usual advice says a static, unofficial site should stay out of the warning chain, mirror official data once a day and run hypothetical scenarios for education. That advice is safe, but it undersells what the project can do, because Nepal's official warnings still fail in three ways a static site can partly fix: speed below the river, specificity, and language. In the 26 August 2026 Bhote Koshi–Trishuli disaster, the mass public alert came 38.8 minutes after the trigger, while the flood front reached the uppermost gauge within 12.8 minutes [1]. The SMS that did go out was generic, Nepali-only and gave no location, scale or time [2]. Yet the same flood took about 365 minutes after the warning anchor to reach Devghat [3]. Most of the corridor had hours, not minutes. What failed there was the content of the message, not the speed of delivery.

That is the opening the Atlas can use. When an official alert names an origin, such as "a large flood has entered the Bhotekoshi River in Rasuwa from the Tibet side" [2], the Atlas can already hold a pre-computed, place-by-place window of arrival times for every downstream settlement, in Nepali and English. A sub-hourly static rebuild can bring it forward next to the official message. The open pieces to do this now exist: BIPAD's real-time river and rain data [4], free daily global river forecasts with up to seven days' lead time [5], the Common Alerting Protocol (CAP, an XML standard for alert messages with per-language blocks and polygon areas) [6], and BIPAD incident records for landslides [7]. Simple, transparent models are good enough for this job, provided they show their spread: the measured GLOF wave speeds on Nepal's rivers (8.7 m/s for a 2016 flood front [8], 6.4–7.2 m/s on the lower Trishuli in 2026 [3]) fit within a widened version of the Atlas's own band.

The view has hard limits, and this draft names them in every section. It fails (1) in the first 10–20 km below a source, where no static site can beat a 12.8-minute wave; (2) for earthquake ground motion, where a 2024 ranking of 16 models on 465 Himalayan records found that BSSA14's family is "not suitable too for most of the periods" [9], so one simple model with its own scatter does *not* show the real spread; (3) for landslides, where short local rain bursts make real-time prediction hard [7]; and (4) on authority, because even DHM cannot order an evacuation [2], so an unofficial site must never sound like one.

The ranked roadmap that follows, in short:
1. Make the data pipeline fail loudly and refresh sub-hourly.
2. Replace the constant flood wave speeds with a distance-decaying speed and an arrival *window*.
3. Publish pre-computed bilingual arrival cards for each place on the main corridors.
4. Build a CAP reader and a bilingual CAP-shaped mirror of official alerts.
5. Replace the single earthquake model and rock-site default with a small ensemble and a per-cell site layer.
6. Add global forecasts and landslide history as clearly labelled context layers.
7. Seek a written data-use agreement with NDRRMA/DHM and an institutional home.

## 1. Where the Atlas Stands Today

### A. What already exists

The Atlas is unusual among Nepali hazard sites because it combines four things that usually live apart. It keeps a daily copy of official DHM, BIPAD and NEMRC pages. It has a MapLibre map with 3D terrain, peak labels and place search that covers GeoNames points and the constitution's Schedule 4 Nepali district names. It runs hypothetical scenario engines for floods, GLOFs (glacial-lake outburst floods) and earthquakes. And it produces printable bilingual reports. Its flood engine moves a triangular or rectangular release hydrograph downstream at three constant wave speeds (2, 4, 6 m/s) with no attenuation, from a fixed list of lake and river-reach origins. Its earthquake engine runs the BSSA14 ground-motion model with one user-set Vs30 (the average shear-wave speed of the top 30 m of ground, a proxy for soil stiffness; default 760 m/s, i.e. rock). It shows five PGA (peak ground acceleration) colour bands and counts people per band from a high-resolution population grid. The static, no-server design is a strength. It is cheap, it survives traffic spikes and it needs no credentials in the browser.

Nepal's official system has improved, and the Atlas should not pretend otherwise. WMO credits DHM's Flood Forecasting and Early Warning Services (2016) and the South Asian Flash Flood Guidance System (2018) with cutting flood deaths from 166 in 2017 to 27 in 2022, "despite higher magnitude flooding in 2022" [10]. A World Bank project upgraded 88 surface-meteorological and 70 surface-hydrological stations, installed Nepal's first C-band weather radar and commissioned a high-resolution local weather model [11]. Ncell alone sent more than 4.4 million flood and landslide alert SMS in two months of the 2023 monsoon [12].

### B. The consensus and its blind spot

The cautious consensus reads that record as proof that the warning chain works and that the remaining problems lie "upstream" or at the last mile, where a website cannot help. It concludes that the Atlas should be a preparedness tool and a timestamped mirror, never part of the warning flow. Much of that is right: a stale "all clear" from a daily copy would be dangerous. But the conclusion does not follow from the evidence. The 166-to-27 improvement comes from slow riverine monsoon floods. DHM's own flood-forecasting official said the threshold system and its message templates "w[ere] designed for the gradual monsoon flooding that Nepal's rivers usually produce" [2]. The deadliest recent events were not of that kind. They were cascades: an avalanche into a lake, a dam breach, entrainment of debris, a blocked river. That held for the 2024 Thame GLOF, which "originated from a cascade of two small lakes that had not previously been considered dangerous" [13], and for the 2026 Bhote Koshi rock-ice avalanche, debris flow and flood [3]. For those events the official chain failed at the very points where a well-built static site is strong: pre-computed geography, place names and bilingual plain language.

### C. The thesis and how this draft tests it

This draft argues that the Atlas should become a *near-real-time complement*: a site that refreshes official data sub-hourly, places each official alert in its geography, and answers "what does this mean for my place, and how long do I have?" with a pre-computed range. It never says "evacuate". Every section ends by testing where this view breaks. A view that survives only with its limits stated is more useful to the synthesis than one stated without them.

## 2. Official Data Feeds: DHM, BIPAD and NEMRC

### A. The failures are documented, not hypothetical

Three independent kinds of evidence show the official chain failing on speed, specificity and language. None of them says it fails on forecasting skill.

*Speed.* On 26 August 2026 an ice-rock mass broke away at 08:37:10. The wave reached the uppermost gauge within 12.8 minutes, and the mass public alert followed the trigger by 38.8 minutes. That gave lead times of −26 to −16 minutes at the first inhabited settlement and +4 to +14 minutes at the next [1]. A separate account says word reached the Rasuwa District Administration Office only at 8:56, sixteen minutes after the flood crossed the border at Rasuwagadhi. By then the flood had covered about 14 km to Syaphrubesi "in under ten minutes" [14]. DHM itself "learned about the flood after receiving a call from a local official" [2]. Three gauges were destroyed at 27, 69 and 87% of their own warning stages, "so threshold logic never fired" [1]. Delivery added more delay. One Nuwakot resident received the 9:35 message at 9:54 and said "the SMS and the flood came together" [2]. DHM's public post on its "Nepal Flood Information" Facebook page, reporting that the blocking lake had still not fully drained, came at 1:35 pm, nearly five hours after the flood entered Nepal [14].

*Specificity.* The alert received in Bidur read in full: "A large flood has entered the Bhotekoshi River in Rasuwa from the Tibet side. Until further notice, residents along the banks of the Trishuli River (up to Muglin) are requested to remain in a safe location with high alert" [2]. It gave no time to arrival, no scale and no place-level instruction. A 2026 scoping review of 38 peer-reviewed studies found DHM's SMS alerts "were repeatedly found to lack actionable guidance" [2]. That is not new. An analysis of the 2017 system found "no standardised language for the SMS message", with messages written manually by a Flood Forecasting Section of about four people [15]. The GSMA, after meeting DHM and NDRRMA, called SMS "manually intensive" and prone to "delays and network congestion" [16].

*Language.* The alerts "only went out in Nepali, on a corridor that includes a major tourist trekking route" [2]. Among the missing were 579 tourists and members of the public, plus pilgrims on their way to Gosaikunda and Kailash [14].

The pattern is clear. Every one of these failures concerns *what the message says and where it lands*, not whether the hazard was detected. Detection often worked; the Sept 2024 Kathmandu floods carried an accurate four-day DHM alert [17]. What is missing is a translation layer between detection and the decision of the person reading the message. That layer is geographic, linguistic and pre-computable, which is exactly the kind of work a static site does well.

### B. What the feeds can actually supply

BIPAD is richer than a daily HTML copy suggests. It is NDRRMA's integrated portal, with tabs for incidents, damage and loss, and "real time" data on rainfall, earthquakes and streamflow. Earthquake data flow to it from the national seismic network and incident data from the Nepal Police reporting system [4]. Its developer frames openness as the purpose: "we need to keep this dataset publicly accessible so everybody can understand whether their investment is safe or not" [4]. UNDRR describes a newer BIPAD impact-based forecasting module for floods, earthquakes, forest fires and air pollution. It overlays OpenStreetMap buildings and roads on flood hazard maps, scores Nepal Red Cross household data with the INFORM index and plans to integrate DHM's short-lead local forecasts [18]. UNDRR adds a finding that matters for the Atlas: "the shorter the lead time", the more impact estimates depend on vulnerability and historical-impact data rather than on the hazard forecast [18]. In other words, at hours of lead time the value lies in pre-computed exposure, which the Atlas already has.

The Atlas's own source manifest marks the BIPAD river-station and rain-station JSON endpoints as verified and the incident and alert endpoints as unverified. DHM bulletins, the forecast and NEMRC remain HTML scrapes, some of which need JavaScript rendering. The data exist; the plumbing is fragile.

### C. From a daily copy to a sub-hourly, fail-loud mirror

The first concrete change is cadence and honesty. A static site does not have to rebuild once a day. A scheduled workflow every 15–30 minutes that pulls only the BIPAD river and rain JSON (a few kilobytes) keeps the site static and free while cutting data age from up to 24 hours to under an hour. Scheduled CI runs can be delayed under load (an engineering caveat, not a sourced figure), so every live panel must show the source timestamp and the fetch timestamp. When the age passes a threshold, the panel should switch to a visible "may be outdated: check dhm.gov.np / BIPAD" state. The pipeline should keep the last good data, write a per-source health file and open an issue after N consecutive failures. This is the one point where the cautious consensus and the contrarian view fully agree, and it should ship first. A faster mirror that fails silently would be worse than a slow one that fails loudly.

Faster data matters for one specific reason. Nepal's threshold system gives "a short lead time of 30 min to 6 h based on the travel time of the flood wave" from upstream stations [15]. A daily copy misses the whole of that window. A 15–30-minute copy catches most of it for the lower half of each corridor. It cannot help the upper half; Section 4 explains why.

### D. CAP: build the reader now, and a bilingual mirror

CAP is the international format for alert messages, and Nepal has been "about to" adopt it for years. DHM piloted CAP in the 2018 monsoon with Practical Action [15]. WMO's 2023 Congress endorsed CAP as recommended practice in its Technical Regulations [19]. In April 2025 a WMO workshop with DHM agreed to draft "a national implementation plan, including Standard Operating Procedures on CAP messages", and WMO undertook to share DHM's CAP warnings on the Severe Weather Information Centre [20]. That hub already shows CAP warnings by severity, urgency and certainty, with a layer for "CAP Feeds Not Accessible" [21]. The Nepal training plan includes a step to "Establish CAP team to maintain CAP feed" [19]. Seven years after the pilot, no public DHM CAP feed was found during this research.

The contrarian move is to build the consumer side before the producer exists. CAP v1.2 lets one alert carry several `<info>` blocks, one per language, each tagged with a language code, and describe areas with `<polygon>`, `<circle>` or `<geocode>` elements [6]. The Atlas should (1) ship a CAP reader that polls SWIC and any future DHM/NDRRMA feed and highlights the alert polygon on the map; (2) until then, mirror the text of official BIPAD/DHM alerts verbatim in a CAP-shaped static file with `status` honestly set and a sender field that states the copy is unofficial; and (3) attach a separate, clearly labelled "Atlas context" block, never presented as part of the alert, that lists the pre-computed arrival windows for places inside the polygon. The global flood forecasting paper behind Google's Flood Hub explicitly designs its outputs to "support notifications—for example, through the Common Alerting Protocol" [22]. CAP is the shared language that lets an unofficial complement plug into the official system without pretending to be it.

### E. Where this breaks

The data-feed argument breaks on three points. First, *licence and permission*: no BIPAD data licence was found, and an NDRRMA request to stop redistributing would force the site to link out only. Second, *data quality*: incident locations entered by police "sometimes occur off-site, leading to inaccurate hazard locations, and once data is entered … it is difficult to correct" [4]. Third, *the gauges die first*: in 2026 the upper gauges were destroyed before they reached their warning stages [1], so a faster mirror of gauge data shows nothing in the reach where it would matter most. The committed position: refresh sub-hourly and build the CAP reader now, because both are cheap and reversible. Treat the gauge feed as context with a visible age, and never present a quiet gauge as reassurance.

## 3. The Map and Place Search

### A. Make the map answer "what reaches my place, and when"

Today the map is organised around hazards and scenarios. The contrarian improvement is to organise it around *places*. When a user searches for a place, whether "Betrawati", "बेत्रावती", "Devghat" or a ward, the result panel should list (a) the scenario origins upstream of that place, (b) for each origin, an arrival window from the routing engine (earliest to latest, see Section 4), (c) the current state of the nearest official gauge with its age, and (d) a link to the latest official bulletin. That turns the static map into the "location-specific" product that user surveys keep asking for. The World Bank's own review of DHM services found "an appetite for seven-day forecasts with a longer lead time, location-specific forecasts, impact-based multi-hazard early warning systems" [11]. A Geneva researcher summarised the 2026 lesson: "People need to know exactly how severe the risk is to their specific location and where the evacuation shelters are" [2]. The Atlas cannot know where the shelters are without local partners, but it can do the "specific location" part today.

### B. Add open global forecasts as context layers

The case that "the Atlas cannot add forecast information" rests on an assumption that is now out of date. Google's Flood Hub publishes free riverine forecasts "up to 7 days in advance" and urban flash-flood probabilities "up to 24 hours in advance" on a 20 km × 20 km grid, "updated daily", covering 150+ countries [5]. The peer-reviewed model behind it reached reliability "in ungauged watersheds at up to a five-day lead time" similar to or better than the nowcasts of Copernicus' GloFAS [22]. The data are released "without cost or barriers to access" [22], and a research version of the model is open source [22]. The World Bank review recommends "exploring the possibility of using publicly available remote sensing and weather data to fill the data gaps in high altitude regions" [11]. Satellite discharge from NASA's SWOT mission has been field-tested on seven Nepali rivers, including the Karnali, Koshi, Bagmati and Narayani [23]. The Flood Hub cadence also matches the Atlas's: it updates daily, and the Atlas already rebuilds daily.

The committed recommendation is a "global outlook" layer for the big Terai rivers, with a fixed bilingual label: "Global experimental model, not DHM. DHM forecasts and warnings take precedence." It should show the outlook as a probability band, never as a danger level of the Atlas's own making. The point is lead time. DHM's forecasts reach about three days, and analysts of the October 2021 disaster urged extending that to a week [24]; a labelled seven-day outlook gives municipalities and the Atlas's print users that preparation time.

### C. Search and Nepali names

Search has to work in the script and the spelling people actually type. OpenStreetMap's Nepal conventions use `name` in Nepali, plus `name:ne`, `name:en` and `alt_name` for romanised variants, such as साँखु, which may appear as "sankhu" or "shankhu" [25]. The Schedule 4 district names are authoritative but cover only 77 entries. The improvement is to index OSM `name:ne` and `alt_name` for municipalities, wards and settlements along hazard corridors, with a normalisation layer that folds common romanisation and vowel-sign variants, so that a Devanagari query and a romanised query reach the same place. This matters more for the complement role than for the archive role. During an event, people search for the place named in the alert, not for a district.

### D. Where this breaks

The global-forecast layer breaks in the places that matter most for cascades. DHM staff told researchers that "numerical weather prediction based on global data is weak – it does not accurately predict the location or magnitude of the rainfall or river levels" [15]. An independent benchmark across 470 gauges found that GloFAS and the Google model "exhibit low reliability" in data-scarce regions, "particularly for rare flood events" [26]. That benchmark is a preprint, run in Africa and South America. Most fundamentally, no rainfall-runoff model, global or national, can forecast an ice-rock avalanche. Global forecasts therefore help on the Karnali, Koshi and Narayani plains, and do nothing for a Bhote Koshi–type cascade. The layer must be scoped to large rivers and labelled as experimental. If the Flood Hub data terms bar redistribution, the layer becomes a link-out.

## 4. Flood and Glacial-Lake Outburst Scenarios

### A. Simple routing is good enough at distance

This is where the contrarian case is strongest. The cautious argument says that real Himalayan floods are sediment-laden process chains and that a hydrograph moved at a constant speed is too crude to inform anyone. The measurements say otherwise, at least beyond the first few tens of kilometres. Seismic records of the July 2016 Bhotekoshi/Sunkoshi GLOF show a flood front that "propagates between stations at 8.7 m/s", followed by a coarse-sediment pulse travelling at 5 m/s, with maximum flow depth reached within two minutes [8]. The 2026 lower-river segments ran at 23–26 km/h, or 6.4–7.2 m/s [3]. Both lie within or just above the Atlas's 2–6 m/s band. A big-river modelling comparison found that moving from a kinematic wave to a local-inertia equation raised peak-discharge skill (Nash–Sutcliffe efficiency, a 0–1 fit score) from 0.48 to 0.71. The same study warned that "the accuracy of coupled models still largely depends on the model forcing" [27]. In a GLOF, the forcing (breach size, volume, entrainment) is the dominant unknown, so adding hydraulic sophistication buys little when the source term is uncertain by a factor of three or more.

Nepal's own operational history supports simple, transparent models. Smith and colleagues built DHM a forecast from "data-based physically interpretable time series models", presented "in a simple visual tool". It raised Karnali lead times from 2–3 hours to 7–8 hours [28]. The lesson is that the skill comes from honest uncertainty and appropriate technology, not from complexity.

### B. Fix the near field: distance-decaying speed and a mass-flow case

The simple engine is defensible, but its defaults are not. The 2026 reconstruction reports the source-to-border segment at about 52.2 m/s, falling along the river and fitted by "a descriptive log-linear decay model" at 80.1% of the variation across six segment speeds [3]. Over the first 10 km, a 52 m/s front arrives in about 3 minutes, while the Atlas's 2–6 m/s defaults predict 28–83 minutes. The model is therefore wrong by an order of magnitude, and wrong in the dangerous direction, for the nearest and most exposed settlements. The 52 m/s figure belongs to an ice-rock avalanche mass flow, not to a moraine-dam breach, and it comes from preprints. Even so, the 8.7 m/s measured front in 2016 [8] already sits above the top Atlas default.

The fix is small:
- replace the three constant speeds with a distance-decaying speed, with a default band of about 5–9 m/s for mid-reach moraine-dam GLOFs, anchored on the measured 2016 front;
- add a separately labelled "mass-flow cascade" case with a fast near-field speed that decays towards 6–7 m/s;
- always report an earliest-to-latest arrival *window* rather than one or three lines.

This is the change that makes the place cards in Section 3 trustworthy. A card for Syaphrubesi that says "earliest about 5 minutes" is honest. One that says "28–83 minutes" is a hazard in itself.

### C. Peak: attenuation for clear water, a warning for entrainment

The Atlas applies no attenuation, so it reports the peak at the source all the way downstream. For clear-water moraine-dam GLOFs this overstates the downstream peak. Cook et al. describe how "as a GLOF travels downstream, the flood peak attenuates", until it crosses the 30-year monsoon flood about 45–55 km below the source for the 2016 and 1981 events [8]. For entrainment cascades the opposite happens. At Devghat in 2026, discharge rose from about 2,600 to 5,850 m³/s, and the excess volume of 19.96 million m³ made up 34.8% of the total flow volume; channel width at 22 sections grew from a mean of 66.1 m to 266.5 m [3]. The committed design is to attenuate GLOF peaks by default, with a labelled crossover to "background monsoon-flood levels", and to attach an *amplification warning* to the cascade case rather than pretend to model it. Here a simple model is good enough *because* it shows its spread: a peak band from attenuated to amplified is more honest than any single number.

### D. Origins beyond the official list

The official list is a ranking for mitigation, not a census of possible origins. ICIMOD/UNDP's 2020 inventory identified 47 potentially dangerous glacial lakes (25 in Tibet that drain into Nepal, 21 in Nepal and 1 in India), using lake, dam, glacier and surroundings criteria. Under those criteria, "seismic activity, and human interference … are not considered" [29]. The list also churns: only 13 of the 21 Nepal lakes match the 2011 list [29]. ICIMOD itself warns that "outbursts can occur that have no precedent" [29]. Thame (2024) came from two small unlisted lakes [13], and the 2016 and 2026 Bhote Koshi floods began in Tibet [8][14]. Cook et al. cite modelling that suggests more than 40% of 2,359 mapped proglacial lakes could match the 100-year discharge about 20 km downstream [8].

The Atlas should therefore add three things. The first is a tier for the 25 Tibet-side lakes, labelled "upstream of Nepal". The second is a tier of unassessed open-inventory lakes, labelled "mapped lake, not on any danger list, hypothetical", with a volume *range* rather than a point value. The third is a generic "border-crossing" origin at Rasuwagadhi and the other trans-Himalayan river entry points. That last origin is the most useful of all for the complement role. When an alert says a flood "has entered from the Tibet side", the Atlas's border origin is the scenario already set up to match.

### E. Pre-compute heavy models offline, ship static results

The static-site constraint limits what runs in the browser, not what the project can compute. r.avaflow is an open-source framework for two-phase mass flows and process chains that "explicitly considers both entrainment and stopping with deposition". Its authors caution that "thorough parameter studies will be necessary" before reliable forward simulations [30]. The contrarian path is to run a small, labelled set of process-chain scenarios offline for the few highest-exposure origins and publish the results as static tiles next to the simple engine. ICIMOD counts about 96,767 people exposed below Imja, 141,911 below Tsho Rolpa and 165,068 below Thulagi [29]. Where the two approaches disagree, the gap is itself the uncertainty the user should see.

### F. Where this breaks

The flood argument breaks in the first 10–20 km. There, no refresh rate, map or card can beat a front that reached the first gauge within 12.8 minutes [1]. Only on-site sirens, cell broadcast or a neighbour's phone call can work at that range. In 2026 it was the call to a head teacher that emptied a school of 900 students ten minutes before the debris buried it [2]. For those reaches the Atlas's contribution is purely preparatory: a printed card that says "if you hear or see it, you have minutes; go uphill now", never a live panel. The speed figures also rest on two non-independent preprints of a single event [3][1], plus one peer-reviewed 2016 measurement [8]. A hindcast of 2016 and 2026 arrival times should be the first validation task, published with the change.

## 5. Earthquake Scenarios

### A. Where "simple is good enough" breaks first

Honesty requires saying that the contrarian view is weakest here. The claim that simple models suffice if their spread is shown assumes the model's own scatter (sigma) covers the real uncertainty. For ground motion in the Himalaya, it does not. A 2024 study ranked 16 ground-motion models (GMPEs, equations that predict shaking from magnitude, distance and site) against 465 three-component records from 122 earthquakes. Of those records, 356 came from 96 stations in the northwest and central Himalaya [9]. It found NGA-West1 models "unacceptable" for all nine periods, and wrote that "the NGA-West2 GMPEs are not suitable too for most of the periods. However, ASK14 and IDR14 show better LLH scores". It also found that "ZHAO06 may be treated as the most suitable GMPE for periods ≤ 0.1 s" [9]. BSSA14 belongs to NGA-West2. The study is a preprint, but its direction matches the Gorkha evidence that Kathmandu soft sites amplified shaking well beyond code levels [31]. The gap between two models is *epistemic* uncertainty (uncertainty from not knowing which model is right), and one model's sigma cannot display it.

### B. Fix: a small ensemble, a per-cell site layer and a basin caveat

The fix is still cheap and still static:
1. Run three models in the browser (BSSA14, ASK14 and ZHAO06, the best short-period performer in the ranking) and show the spread between them as the main uncertainty display, with each model's sigma as a secondary band.
2. Replace the 760 m/s rock default with a per-cell Vs30 drawn from the open USGS global slope-based grid (Heath et al. 2020) [32], clipped to Nepal, keeping the manual override. Kathmandu, Pokhara and the Terai sit on sediment, so a rock default understates shaking exactly where people live.
3. State plainly that long-period basin resonance is not modelled. The current model file already lists the basin-depth term and regional attenuation among its omissions, and that disclosure should move from the data file onto the map and the printed page.

Validation should be first-class work. Compare model medians with recorded Gorkha 2015 peak ground accelerations, publish the residuals, and only then settle the ensemble weights.

### C. Event-triggered scenarios: the near-real-time earthquake complement

The near-real-time idea fits earthquakes too, in a different form. NEMRC publishes located events. Within one sub-hourly rebuild after a felt event of magnitude 5 or more, the Atlas could automatically run its ensemble for NEMRC's epicentre and magnitude. It would publish a labelled "rapid scenario, not a measurement" map with population per shaking band and a link to NEMRC. That fills a gap between the official epicentre notice and later damage reporting, and it uses only the engine the site already has. The open GEM/BGS national hazard grid, which gives PGA at 10% and 2% probability of exceedance in 50 years at 0.025° resolution as CSV [33], offers a long-term reference layer beside each scenario. The OpenQuake-based national risk model, which includes damage and loss estimates for a repeat of the 1934 earthquake [34], shows the open tools already exist to add a building-damage layer later.

### D. Where this breaks

The near-real-time earthquake idea breaks in two ways. First, early magnitudes and locations are revised, so a rapid scenario built on a first estimate can mislead and must be re-run and versioned. Second, warning before shaking belongs to earthquake early warning, which works in seconds. A NepalEEW pilot deployed 20 low-cost OpenEEW stations in central Nepal and characterised two small earthquakes "in less than 10 seconds after their origin time" [35]. A static site has no role in that loop and should say so. Its earthquake complement is post-event context and pre-event planning.

## 6. Serving Nepali Users: Language, Access and Reach

### A. Language is a warning failure, not a courtesy

The usual roadmap files bilingual content under "accessibility". The 2026 evidence moves it into safety. A Nepali-only alert could not be read by trekkers on the corridor [2]. DHM SMS has had "no standardised language", switching between Nepali, English and romanised Nepali [15]. ICIMOD's inventory itself recommends that GLOF information "be made available to the public in varied languages" [29]. The Atlas already writes in Nepali and English. The improvement is to treat language as a product feature of the complement. That means:
- parallel-authored plain-language wording (not machine translation) for every arrival card and context block;
- tested Nepali terms for "earliest arrival", "range" and "not a warning";
- in the medium term, the main tourist-corridor languages for the trekking routes the scenarios cover.

CAP's per-language `<info>` blocks [6] are the natural container for this.

### B. Who can be reached, and how

Reach estimates differ. Household surveys report 82% of households with internet access, falling to 73% in rural areas and 68.5% in Karnali [36]. ITU puts individual internet use at 48.4%, with 81.6% 4G coverage [37]. Only 19.2% of surveyed people verified information they found online [36]. For the complement role, the binding constraint is not bandwidth but whether a person under stress can find their place and read a range in one screen. The design rules follow:
- an initial load of about 1 MB, with 3D terrain opt-in;
- a Nepali-first default;
- a one-screen place card that works as text without the map;
- a service worker that caches the user's saved places and their cards for when the network fails.

### C. Feed the channels people already receive

The Atlas should not build SMS or voice systems itself. It should publish text that the official channels can use. DHM's 2025 voice-alert pilot calls local governments, disaster committees and the Red Cross because "it is difficult to send a bulk call to everyone at once" [38]. NDRRMA held a stakeholder discussion on cell broadcasting in July 2026 [39]. A GSMA/ITU study found cell broadcast could reach a zone in about 10 seconds in multiple languages for $1.75–3 million, but it had not been procured [2]. All of these channels need *pre-written, place-specific, bilingual message text*. The Atlas can publish open templates for each corridor and place ("Flood from [origin]: earliest arrival at [place] about [X] minutes; move to [high ground]"), which municipalities, DHM or a future cell-broadcast operator could adopt. This is the cheapest, highest-leverage contribution to the specificity failure. It also leaves the decision to send with those who hold the authority.

### D. Where this breaks

Trust does not come from technology. In 2026, "Nepalis in general trust their family, friends and neighbors more than government officials" [2], and an unofficial website is further from that trust than either. Repeated low-stakes alerts have already "worn down the sense that any given message is urgent" [2], and a new noisy channel would add to the fatigue. The Atlas's reach strategy must therefore run through trusted intermediaries (municipal disaster focal persons, community gauge readers, schools), with print as the channel that survives network loss.

## 7. Printable Reports, Trust and Risk Communication

### A. From scenario report to "arrival card"

The printable report should become a one-page, place-specific arrival card that a ward office, school or hotel can laminate and post. It should contain:
- the upstream origins;
- the earliest-to-latest arrival window for each;
- the nearest high ground (left blank for local completion where unknown);
- the official channels (1155, the DHM and BIPAD URLs);
- a fixed bilingual line: "Hypothetical scenario, not a forecast or warning. Follow official alerts."

DHM's toll-free 1155 line exists but "is not advertised widely due to limited capacity", and it rings two mobile phones held by a small team [15]. Printing it is still right, but a card should not promise that it will answer during a surge. The card format is grounded in the 2015 experience: relief actors asked Kathmandu Living Labs for "printable maps, for navigation on the ground in places where mobile maps were unreliable" [40].

### B. Show spread, never a line

Every number on the card should be a range. Arrival should be "about X to Y minutes", the peak should run "lower (clear water) to higher (debris)", and shaking should be shown as a band spread across models. No area should be labelled "safe". The precedent is the Karnali forecasting tool, which made probabilistic output usable in "a simple visual tool" [28]. National stakeholders wanted probabilistic forecasts for preparedness and deterministic ones for evacuation, with flash floods as the exception, where probability "give[s] more lead time" [15]. The Atlas sits on the preparedness side of that line, which is why ranges are the right format for it.

### C. Authority: the line the Atlas must not cross

DHM "has no legal authority to order evacuations", and "no law requires a forecast to automatically trigger one" [2]. A 2022 analysis of the October 2021 disaster called for "legally binding directives and standard operating procedures" linking forecasts to action, and that call remains unimplemented [2]. An unofficial site therefore has *less* standing than DHM, and every piece of complement wording must reflect it. The Atlas informs the reader's own decision with geography and time. It does not instruct. In practice the cards should give the evacuation decision to "your ward / municipality / DHM", and the live context block should never use the CAP fields `urgency`, `severity` or `certainty` for its own content.

## 8. Missing Hazards and Capabilities

### A. Landslides: history and context yes, forecasting no

Landslides are the largest missing hazard. In 2024, Nepal recorded 38 fatal landslides killing 135 people by 17 July, with deaths rising sharply from mid-June [41]. The 26–28 September 2024 floods and landslides caused an estimated NPR 46.68 billion in losses and 249 deaths [42]. BIPAD logged 513 landslides between June 2023 and June 2024 [7]. The Atlas should add a landslide incident-history layer from BIPAD with each record's date and source, and a monsoon "season so far" counter. It should not forecast. The AI-based SAFE-RICCS forecasting tool rolled out in Nepal "is currently not available for open access distribution", and its lead admits that "the quality of the input data … will be critical for accuracy" [7]. Dave Petley adds that localised, short-duration rainfall "could make it challenging to predict them in real-time" [7]. Rain gauges are too sparse to fill the gap. DHM had no station in the Balaju area during a 2023 flash flood, and for Melamchi in 2021 "we still do not have rainfall data" [43]. Here the contrarian view gives way: near-real-time landslide information is out of reach. Near-real-time landslide *records* are not, and they turn the map into an honest season ledger.

### B. Cascades as a hazard class of their own

The 2026 reconstruction ends with the conclusion that Nepal's risk screening "must expand from lake-centric hazard concepts to process-chain surveillance that connects unstable rock-ice source areas, entrainment-prone transport corridors, temporary blockages, and exposed downstream assets" [3]. ICIMOD specialists say that "many systems are built around a particular hazard … But the Himalayas do not always respect those categories" [44]. The Atlas's hazard menu (flood, GLOF, earthquake) has the same flaw. The next capability should be a "cascade" scenario type, combining the mass-flow speed profile, an amplification flag and a blockage-and-release option, plus a corridor view that strings together source areas, temporary dams and exposed hydropower and settlements. A static site can show this kind of chain, because a chain is a geographic object.

### C. Transboundary information

Rivers cross borders and information does not. After a 2025 Tibet-side flood, Nepal and China reached an understanding on real-time flood and landslide information sharing. The 2026 flood still arrived with no message from across the border [14], and experts argue that "information about a mountain hazard should not stop at the same line where a political boundary begins" [44]. The Atlas cannot fix diplomacy. It can draw the upstream catchments in Tibet, list the 25 Tibet-side dangerous lakes [29], and pre-build the border-entry scenarios so that the first words of any cross-border notice have a ready-made downstream picture.

### D. What not to add

The Atlas should not add earthquake early warning (a seconds-scale system for dedicated networks [35]), its own flood danger thresholds, or any push-alert channel. Each would turn a complement into a competing authority.

## 9. Impact, Partnerships and Sustainability

### A. The model: civic tech that the state can lean on

Nepal already has the precedent for an unofficial actor that strengthens the official response. Before 2015, Open Cities volunteers mapped "over 100,000 buildings in the Kathmandu Valley", plus structural data for about 350 medical facilities and 2,300 schools. After the earthquake, Kathmandu Living Labs coordinated with the Nepal Army, whose GIS chief said the maps showed that "areas like Ramkot and Balaju were heavily damaged" when the army had been "simply focusing on Bhaktapur" [40]. KLL's founding model, "work once, and put to multiple creative uses" [45], fits the Atlas closely. BIPAD itself was built by a non-profit civic tech company for NDRRMA [4]. The lesson is that an unofficial platform reaches impact by being useful to officials in their workflow, not by speaking to the public over their heads.

### B. Partnerships in order

1. *NDRRMA/BIPAD*: ask for a written data-use statement for the river, rain and incident endpoints, and offer the CAP-shaped mirror and the place templates back to them.
2. *DHM Flood Forecasting*: offer the arrival-window tables for their message templates, which "were designed for the gradual monsoon flooding" [2] and lack a cascade template.
3. *An institutional host* such as KLL or a Tribhuvan University department, for continuity and local review.
4. *ICIMOD*, for the lake inventory's licence terms and a review of the Tibet-side tier.

The CREWS/EW4All machinery that funds Nepal's CAP rollout [20] is the natural venue to put the Atlas forward as a reference consumer.

### C. Sustainability

OpenDRI's GeoNode shows an open-source path: GFDRR's investment produced roughly a 200% return in code terms, and the project became "self-sustaining", so GFDRR could shift spending to country capacity [46]. The Atlas should keep running costs near zero (static hosting, scheduled CI), publish its scenario engines and tables under open licences, and recruit a small contributor community rather than seek revenue.

### D. Where this breaks

Partnership can fail in both directions. Officials may see a faster, place-specific unofficial layer as competition. Even DHM's own staff "didn't know the extent of the floods in the early stages when sending the SMSs" [2], and an outside site that appears to know more invites friction. The committed answer is to keep the complement visibly *derived from* official data, offer every artefact to the agencies first, and accept link-out-only status if they refuse.

## 10. Prioritised Roadmap

The roadmap ranks by safety leverage per unit of effort. Each item carries an evidence grade (A = measured or peer-reviewed; B = preprint, official report or a single event; C = journalism or reasoning) and a validation task the project can run itself.

### A. Near term (next 3–6 months)

| # | Improvement | Why (evidence) | Grade | Validation |
|---|---|---|---|---|
| 1 | Fail-loud, sub-hourly pipeline: BIPAD river/rain JSON every 15–30 min, source and fetch timestamps on every panel, stale-state banner, per-source health file, CI alert on repeated failure | 30 min–6 h threshold lead times [15]; daily copies miss them | B | Log data age across one monsoon; target median under 45 min |
| 2 | Distance-decaying flood speed (5–9 m/s mid-reach), "mass-flow cascade" case, arrival *windows*, default GLOF attenuation with an amplification flag | 8.7 m/s measured [8]; 52→6.4–7.2 m/s [3] | A/B | Hindcast 2016 and 2026 arrival times; publish the errors |
| 3 | Place search and place panel: upstream origins, arrival windows, nearest gauge with age; OSM `name:ne`/`alt_name` index with romanisation folding | Location-specific need [11][2] | B | Test 50 Nepali and romanised queries for corridor places |
| 4 | Bilingual one-page arrival cards for the Bhote Koshi–Trishuli–Narayani, Sunkoshi, Dudh Koshi and Tamor corridors | 365 min to Devghat, but generic SMS [3][2] | B | Small Nepali reader test: do people read the range and the "not a warning" line correctly? |
| 5 | Border-entry origins (Rasuwagadhi and others) and a Tibet-side lake tier | Transboundary origins [14][29] | A/C | Check catchment geometry against DEM flow paths |
| 6 | Vs30 per cell from the USGS grid; a visible basin caveat | Rock default understates shaking on sediment [32][31] | A | Gorkha station PGA residuals before and after |

### B. Medium term (6–24 months)

| # | Improvement | Why | Grade | Validation |
|---|---|---|---|---|
| 7 | CAP reader (SWIC plus a future DHM feed) and a bilingual CAP-shaped mirror of official alerts with a separate "Atlas context" block | CAP endorsed and planned in Nepal [19][20]; per-language blocks [6] | A/B | Validate files with a CAP checker; agree wording with NDRRMA |
| 8 | Three-model earthquake ensemble (BSSA14, ASK14, ZHAO06) with the spread shown | NGA-West2 "not suitable" for most periods [9] | B | Gorkha residuals by model; set weights afterwards |
| 9 | Event-triggered rapid scenarios after NEMRC M5+ events | Engine already exists; NEMRC feed | C | Re-run and version on magnitude revision; compare with recorded intensity |
| 10 | Global outlook layer for the large Terai rivers (Flood Hub / GloFAS), labelled experimental | 5-day ungauged reliability [22]; low reliability for rare events [26] | A/B | Score against DHM gauge danger exceedances for one season |
| 11 | Landslide incident history and season ledger from BIPAD; no forecasting | Fatality burden [41][42] | B | Cross-check against an independent fatality record |
| 12 | Cascade scenario type and offline r.avaflow tiles for 3–5 high-exposure origins | Process chains [3][30] | B | Compare with the simple engine; publish the disagreement |
| 13 | Open message templates for municipalities, DHM and future cell broadcast; a written data-use agreement; an institutional host | Specificity gap; cell broadcast pending [39][2] | C | Adoption by at least one municipality or DHM template |

### C. Where the contrarian view fails, in one place

1. **Near-field speed.** In the first 10–20 km nothing online helps. Only sirens, cell broadcast and neighbours work, so the Atlas offers printed preparation only.
2. **Earthquake models.** A single simple model with its sigma understates uncertainty, so the ensemble is mandatory, not optional.
3. **Landslides.** Records yes, forecasts no.
4. **Authority.** The Atlas must never set urgency or severity, never say "evacuate" and never use its own thresholds.
5. **Evidence.** The key wave-speed and timing figures come from preprints of one event, so every change ships with a published hindcast.

### D. Future implications

The trend favours this view. Nepal is formalising CAP [20], weighing cell broadcast [39] and extending BIPAD into impact-based forecasting [18]. Global models now give free multi-day river outlooks [5]. Each of these channels will need what none of them currently supplies: pre-computed, place-level, bilingual answers to "how long do I have here?" When cell broadcast arrives, the message that reaches a phone in Betrawati in ten seconds will be no better than the generic text of 2026 unless someone has already worked out what Betrawati needs to hear. A Himalayan Disaster Atlas that spends the next two years building and validating those answers, and giving them freely to the agencies that hold authority, will matter more in the next cascade than in the last one. If it stays a daily archive of hypotheticals, it will have the right maps and still be absent when the next event comes.

## Sources

[1] The Bhote Koshi–Trishuli flash flood of 26 August 2026, Rasuwa, Nepal: warning latency exceeded flood travel time. https://doi.org/10.31223/x5hn5h
[2] During Nepal floods, decentralized, community-based warning saved lives. https://news.mongabay.com/2026/09/during-nepal-floods-decentralized-community-based-warning-saved-lives/
[3] A multi-source quantitative reconstruction of the 26 August 2026 Bhote Koshi rock-ice avalanche-debris-flow-flood cascade, Nepal. https://doi.org/10.31223/x5mb9v
[4] Why Bangladesh needs an integrated disaster information system like Nepal’s ‘Bipad Portal’ | The Business Standard. https://www.tbsnews.net/features/panorama/why-bangladesh-needs-integrated-disaster-information-system-nepals-bipad-portal
[5] Flood Forecasting. https://sites.research.google/floodforecasting/
[6] Common Alerting Protocol. https://docs.oasis-open.org/emergency/cap/v1.2/CAP-v1.2-os.html
[7] AI forecasting deployed to predict Nepal landslides. https://www.scidev.net/global/news/ai-forecasting-deployed-to-predict-nepal-landslides/
[8] Cook, K. L. et al. (2018). Glacial lake outburst floods as drivers of fluvial erosion in the Himalaya. Science. https://wpg.forestry.oregonstate.edu/sites/default/files/seminars/cook_etal_2018_glacial_outburst_erosion.pdf
[9] Quantitative evaluation and ranking of 16 GMPEs against recorded ground motion in the northwest and central Himalaya and Indo-Gangetic plains (arXiv:2410.05918, preprint, 2024). https://arxiv.org/abs/2410.05918
[10] Reducing flood casualties in Nepal. https://wmo.int/site/science-action/water-resource-monitoring-and-management/reducing-flood-casualties-nepal
[11] Transforming Nepal’s hydro and agrometeorological services to build resilience. https://blogs.worldbank.org/en/endpovertyinsouthasia/transforming-nepals-hydro-and-agrometeorological-services-build-resilience
[12] Ncell Sent 44 Lakh early warning SMS against Landslide/Flood. https://www.nepalitelecom.com/2023/08/ncell-sent-44-lakh-early-warning-sms-against-landslide-flood.html
[13] Cook, K. L. et al. (2025). The 2024 Thame GLOF, Khumbu Nepal - causes, consequences, and dynamics. EGU25-12752. https://meetingorganizer.copernicus.org/EGU25/EGU25-12752.html
[14] Sixteen Minutes: What the Bhotekoshi flood reveals about the region’s unfinished early-warning problem. https://www.borderlens.com/2026/08/28/sixteen-minutes-what-the-bhotekoshi-flood-reveals-about-the-regions-unfinished-early-warning-problem/
[15] GC - Communicating complex forecasts: an analysis of the approach in Nepal's flood early warning system. https://gc.copernicus.org/articles/3/49/2020/
[16] Mobile-enabled anticipatory action and early warning systems: The GSMA and FCDO visit Kathmandu as part of digital humanitarian partnership  | Mobile for Development. https://www.gsma.com/solutions-and-impact/connectivity-for-good/mobile-for-development/blog/mobile-enabled-anticipatory-action-and-early-warning-systems-the-gsma-and-fcdo-visit-kathmandu-as-part-of-digital-humanitarian-partnership/
[17] Missing On Early Warning – Pushed To Rising Death-Tolls And Losses Of Properties And Infrastructures | New Spotlight Magazine. https://www.spotlightnepal.com/2024/10/07/missing-on-early-warning-pushed-to-rising-death-tolls-and-losses-of-properties-and-infrastructures
[18] An impact-based early warning module in Nepal’s BIPAD portal | UNDRR. https://www.undrr.org/resource/case-study/impact-based-early-warning-module-nepals-bipad-portal
[19] Central for Applied Research and Development (CARD). https://card.ioe.tu.edu.np/events/534
[20] WMO strengthens Early Warning Services in Nepal. https://wmo.int/media/project-update/wmo-strengthens-early-warning-services-nepal
[21] Severe Weather Information Centre 3.0. https://severeweather.wmo.int/
[22] Global prediction of extreme floods in ungauged watersheds | Nature. https://doi.org/10.1038/s41586-024-07145-1
[23] Nepal wants to power South Asia: It does not know what its rivers are doing. https://thehimalayantimes.com/ampArticle/1037941
[24] Missed opportunities in utilization of weather forecasts: an analysis of October 2021 disaster in Nepal | PreventionWeb. https://preventionweb.net/quick/71365
[25] Key:name:ne - OpenStreetMap Wiki. https://wiki.openstreetmap.org/wiki/Key:name:ne
[26] Enhancing flood forecasting reliability in data-scarce regions with a distributed. https://egusphere.copernicus.org/preprints/2025/egusphere-2025-2294/egusphere-2025-2294.pdf
[27] NHESS - Evaluating the impact of model complexity on flood wave propagation and inundation extent with a hydrologic–hydrodynamic model coupling framework. https://nhess.copernicus.org/articles/19/1723/2019/
[28] NHESS - Community-based early warning systems for flood risk mitigation in Nepal. https://doi.org/10.5194/nhess-17-423-2017
[29] ICIMOD/UNDP (2020). Inventory of glacial lakes and identification of potentially dangerous glacial lakes in the Koshi, Gandaki and Karnali river basins. https://nepal.un.org/sites/default/files/2020-10/Inventory_Glacial_Lakes_2020_Full2.pdf
[30] GMD - r.avaflow v1, an advanced open-source computational framework for the propagation and interaction of two-phase mass flows. https://gmd.copernicus.org/articles/10/553/2017/
[31] Site amplification in the Kathmandu Valley during the 2015 M7.6 Gorkha, Nepal earthquake | Bulletin of Earthquake Engineering | Springer Nature Link. https://link.springer.com/article/10.1007/s10518-016-0003-8
[32] Vs30 Models and Data. https://earthquake.usgs.gov/data/vs30/
[33] METEOR: Nepal seismic hazard map with mean Peak Ground Acceleration (PGA) in g for a 10% and 2% probability of exceedence in 50 years. | Zenodo. https://zenodo.org/records/19002227
[34] Seismic risk assessment and hazard mapping in Nepal. https://ideas.repec.org/a/spr/nathaz/v78y2015i1p583-602.html
[35] NepalEEW: Testing the feasibility of an Earthquake Early Warning System in Nepal - SEG. https://seg.org/news/nepaleew-testing-the-feasibility-of-an-earthquake-early-warning-system-in-nepal/
[36] Nepal’s 82% households have internet, but digital skills fall short. https://www.nepalitelecom.com/2026/02/nepals-82-households-have-internet-but-digital-skills-fall-short.html
[37] Nepal returns to global ICT Index but digital use still lags infrastructure growth. https://kathmandupost.com/science-technology/2026/07/02/nepal-returns-to-global-ict-index-but-digital-use-still-lags-infrastructure-growth
[38] Government to provide voice alerts on flood, weather updates. https://nepalitelecom.com/2025/06/government-to-provide-voice-alerts-on-flood-weather-updates.html
[39] Discussion held on Cell Broadcasting for Early Warning. The Himalayan Times. https://thehimalayantimes.com/kathmandu/discussion-held-on-cell-broadcasting-for-early-warning
[40] Mapping for resilience: crowd-sourced mapping in crises | Humanitarian Practice Network. https://odihpn.org/magazine/mapping-for-resilience-crowd-sourced-mapping-in-crises/
[41] Fatal landslides in Nepal in 2024 to date. https://eos.org/thelandslideblog/nepal-landslides-2024
[42] NDRRMA. Preliminary Loss and Damage Assessment of Flood and Landslide, September 2024 (28 October 2024). https://www.dpnet.org.np/public/uploads/files/Loss_and_Damage_Assessment_of_Flood_and_Landslide_2024_Updated_compressed%202026-01-20%2008-32-00.pdf
[43] Rainfall data remains scarce due to fewer gauging stations. https://kathmandupost.com/climate-environment/2023/07/25/rainfall-data-remains-scarce-due-to-fewer-gauging-stations
[44] The Nepal floods question: When the Himalayas collapse, who gets warned? | Climate Crisis News | Al Jazeera. https://www.aljazeera.com/amp/news/2026/9/19/the-nepal-floods-question-when-the-himalayas-collapse-who-gets-warned
[45] About Kathmandu Living Labs. https://kathmandulivinglabs.org/about-us
[46] OPEN DATA FOR RESILIENCE INITIATIVE. https://documents1.worldbank.org/curated/en/713861563520709009/pdf/Open-Data-for-Resilience-Initiative-and-GeoNode-A-Case-Study-on-Institutional-Investments-in-Open-Source.pdf
