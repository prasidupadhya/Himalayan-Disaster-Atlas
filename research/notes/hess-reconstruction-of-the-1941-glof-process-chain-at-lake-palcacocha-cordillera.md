---
title: HESS - Reconstruction of the 1941 GLOF process chain  at Lake Palcacocha (Cordillera
  Blanca, Peru)
id: hess-reconstruction-of-the-1941-glof-process-chain-at-lake-palcacocha-cordillera
tags:
- glof-modelling
created: '2026-11-18T12:54:44.801509Z'
source: https://hess.copernicus.org/articles/24/93/2020/
source_domain: hess.copernicus.org
fetched_at: '2026-11-18T12:54:44.798196Z'
fetch_provider: builtin
status: draft
type: note
tier: unknown
content_type: unknown
deprecated: false
---

HESS - Reconstruction of the 1941 GLOF process chain  at Lake Palcacocha (Cordillera Blanca, Peru)
Articles
|
Volume 24, issue 1
Article
Peer review
Metrics
Related articles
Articles
|
Volume 24, issue 1
https://doi.org/10.5194/hess-24-93-2020
© Author(s) 2020. This work is distributed under
the Creative Commons Attribution 4.0 License.
https://doi.org/10.5194/hess-24-93-2020
© Author(s) 2020. This work is distributed under
the Creative Commons Attribution 4.0 License.
Articles
|
Volume 24, issue 1
Article
Peer review
Metrics
Related articles
Research article
|
09 Jan 2020
Research article |
|
09 Jan 2020
Reconstruction of the 1941 GLOF process chain  at Lake Palcacocha (Cordillera Blanca, Peru)
Reconstruction of the 1941 GLOF process chain  at Lake Palcacocha (Cordillera Blanca, Peru)
Reconstruction of the 1941 GLOF process chain  at Lake Palcacocha (Cordillera Blanca, Peru)
Martin Mergili et al.
Martin Mergili
,
Shiva P. Pudasaini
,
Adam Emmer
,
Jan-Thomas Fischer
,
Alejo Cochachin
,
and
Holger Frey
Martin Mergili
CORRESPONDING AUTHOR
martin.mergili@boku.ac.at
https://orcid.org/0000-0001-5085-4846
×
Institute of Applied Geology, University of Natural Resources and
Life Sciences (BOKU),  Peter-Jordan-Straße 82, 1190 Vienna, Austria
Geomorphological Systems and Risk Research, Department of Geography
and Regional Research,  University of Vienna, Universitätsstraße 7, 1010 Vienna, Austria
Shiva P. Pudasaini
https://orcid.org/0000-0002-6741-0827
×
Geophysics Section, Institute of Geosciences, University of Bonn,
Meckenheimer Allee 176, 53115 Bonn, Germany
Adam Emmer
https://orcid.org/0000-0002-8268-990X
×
Department of the Human Dimensions of Global Change, Global Change
Research Institute,  The Czech Academy of Sciences, Bělidla 986/4a, 603 00 Brno, Czech Republic
Jan-Thomas Fischer
https://orcid.org/0000-0001-5179-6457
×
Department of Natural Hazards, Austrian Research Centre for Forests (BFW), Rennweg 1, 6020 Innsbruck, Austria
Alejo Cochachin
×
Unidad de Glaciología y Recursos Hídricos, Autoridad Nacional del Agua, Confraternidad Internacional 167, Huaráz, Peru
Holger Frey
https://orcid.org/0000-0003-0705-3570
×
Department of Geography, University of Zurich, Winterthurerstrasse 190, 8057 Zurich, Switzerland
Abstract
The Cordillera Blanca in Peru has been the scene of rapid deglaciation
for many decades. One of numerous lakes formed in the front of the
retreating glaciers is the moraine-dammed Lake Palcacocha, which drained
suddenly due to an unknown cause in 1941. The resulting Glacial Lake
Outburst Flood (GLOF) led to dam failure and complete drainage of Lake
Jircacocha downstream, and to major destruction and thousands of fatalities
in the city of Huaráz at a distance of 23 km. We chose an integrated
approach to revisit the 1941 event in terms of topographic reconstruction
and numerical back-calculation with the GIS-based open-source mass
flow/process chain simulation framework r.avaflow, which builds on an
enhanced version of the Pudasaini (2012) two-phase flow model. Thereby we
consider four scenarios: (A) and (AX) breach of the moraine dam of Lake
Palcacocha due to retrogressive erosion, assuming two different fluid
characteristics; (B) failure of the moraine dam caused by the impact of a
landslide on the lake; and (C) geomechanical failure and collapse of the
moraine dam. The simulations largely yield empirically adequate results with
physically plausible parameters, taking the documentation of the 1941 event
and previous calculations of future scenarios as reference. Most simulation
scenarios indicate travel times between 36 and 70 min to reach
Huaráz, accompanied with peak discharges above 10 000 m
3
s
−1
. The results of the scenarios indicate that the most likely initiation mechanism would be retrogressive erosion, possibly
triggered by a minor impact wave and/or facilitated by a weak stability
condition of the moraine dam. However, the involvement of Lake Jircacocha
disguises part of the signal of process initiation farther downstream.
Predictive simulations of possible future events have to be based on a
larger set of back-calculated GLOF process chains, taking into account the
expected parameter uncertainties and appropriate strategies to deal with
critical threshold effects.
Download & links
Article (PDF, 27250 KB)
Download & links
Article
(27250 KB)
Full-text XML
BibTeX
EndNote
Share
How to cite.
Mergili, M., Pudasaini, S. P., Emmer, A., Fischer, J.-T., Cochachin, A., and Frey, H.: Reconstruction of the 1941 GLOF process chain  at Lake Palcacocha (Cordillera Blanca, Peru), Hydrol. Earth Syst. Sci., 24, 93–114, https://doi.org/10.5194/hess-24-93-2020, 2020.
Received: 10 Jul 2019
–
Discussion started: 19 Aug 2019
–
Revised: 18 Nov 2019
–
Accepted: 30 Nov 2019
–
Published: 09 Jan 2020
1
Introduction
Glacial retreat in high-mountain areas often leads, after some lag time
(Harrison et al., 2018), to the formation of proglacial lakes, which are
impounded by moraine dams or bedrock swells. Such lakes may drain suddenly,
releasing a large amount of water which may result in complex and
potentially catastrophic process chains downstream. Glacial lakes and
outburst floods (GLOFs) have been subject of numerous studies covering many
mountain regions all around the globe (Hewitt, 1982; Haeberli, 1983;
Richardson and Reynolds,
2000; Huggel et al., 2003; Breien et al., 2008;
Hewitt and Liu, 2010; Bolch et al., 2011; Mergili and Schneider, 2011;
Mergili et al., 2013; Clague and O'Connor, 2014; Emmer et al., 2015, 2016;
Sattar et al., 2019a, b; Turzewski et al., 2019).
The Cordillera Blanca (Peru) represents the most glacierized mountain
chain of the tropics. Glacial lakes and GLOFs are particularly common there
(Carey, 2005). A total of 882 high-mountain lakes were identified by Emmer et al. (2016). Some of these lakes are susceptible to GLOFs (Vilímek et al., 2005; Emmer and Vilímek, 2013, 2014; ANA, 2014; Iturrizaga, 2014). A
total of 28 geomorphologically effective GLOFs originating from
moraine-dammed lakes have been documented (Emmer, 2017). Most recently,
GLOFs were recorded at Lake Safuna Alta (2002 – the trigger was a rock
avalanche into the lake; Hubbard et al., 2005), at Lake Palcacocha (2003 –
landslide-induced overtopping of the dam; Vilímek et al., 2005), and at
Lake 513 (2010 – triggered by an ice avalanche; Carey et al., 2012). Lake
Artizón Alto was hit by a landslide from a moraine in 2012, which
resulted in cascading effects involving three more lakes and entrainment of
a considerable amount of debris in the Artizón Valley and, farther
downstream, the Santa Cruz Valley (Mergili et al., 2018a). A pronounced peak
in the frequency of high-magnitude GLOFs, however, was already observed in the 1940s and 1950s, when lakes of notable size had formed behind steep terminal moraine walls. The most prominent and well-documented GLOF in this period occurred on 13 December 1941, when Lake Palcacocha in the Quilcay Catchment drained suddenly, leading to a process chain that resulted in at least 1600 fatalities and major destruction in the town of Huaráz 23 km downstream (Broggi, 1942; Oppenheim, 1946; Concha, 1952; Wegner, 2014).
In the Cordillera Blanca, the local population is highly vulnerable to
high-mountain process chains, often induced by GLOFs (Carey, 2005;
Hofflinger et al., 2019). In order to mitigate this threat, tens of lakes in
the Cordillera Blanca have been remediated through technical measures such
as open cuts, artificial dams, or tunnels during the last decades (Oppenheim,
1946; Zapata, 1978; Portocarrero, 1984, 2014; Carey, 2005;  Emmer et al., 2018). Most notably, lowering the lake level of Laguna 513 through a system of tunnels in the 1990s has probably prevented a disaster downstream when a rock-ice avalanche impacted that lake in 2010 (Reynolds, 1998; Reynolds et al., 1998; Schneider et al., 2014). However, the management of GLOF risk is a difficult task (Carey et al., 2014). Anticipation of the impact area and magnitude of GLOF cascades – and, as a consequence, also hazard mapping and the design of technical remediation measures – relies to a large extent on the application of computational mass flow models (GAPHAZ, 2017). Important progress was made since the mid-20th century: various models were developed, and have more recently been implemented in simulation software tools (Voellmy, 1955; Savage and Hutter, 1989; Iverson, 1997; Takahashi et al., 1992; Pitman and Le, 2005; McDougall and Hungr, 2004; Pudasaini and Hutter, 2007; Chisolm and McKinney, 2018). Most of these approaches represent single-phase mixture models. Tools like RAMMS (Christen et al., 2010) or FLO-2D were used for the simulation of GLOFs (Mergili et al., 2011). Schneider et al. (2014), Worni et al. (2014), and Somos-Valenzuela et al. (2016) have sequentially coupled two or more tools for simulating landslide–GLOF cascades. However, single-phase models do not describe the interactions between the solid and the fluid phase, or dynamic landslide–lake interactions, in an appropriate way, so that workarounds are necessary (Gabl et al., 2015). Worni et al. (2014) called for integrated approaches. They would have to build on two- or even three-phase models considering  not only water, debris, and ice separately, but also the interactions between the phases and the flow transformations. Pudasaini (2012) introduced a general two-phase flow model considering mixtures of solid particles and viscous fluid which has been used for the simulation of computer-generated examples of sub-aqueous landslides and particle transport (Kafle et al., 2016, 2019) as well as GLOFs (Kattel et al., 2016).
The recently introduced open-source GIS simulation framework r.avaflow
(Mergili et al., 2017) applies an extended version of the approach of
Pudasaini (2012). It was used to back-calculate the 2012 Santa Cruz process
chain involving four lakes (Mergili et al., 2018a), and the 1962 and 1970 Huascarán landslides (Mergili et al., 2018b), both in the Cordillera
Blanca. These studies identified the capability of that tool to
appropriately simulate the transformations at the boundary of individual
processes, where one process transforms to the next, as one of the major
challenges. Open issues include the proper understanding of wave generation
as a response to landslides impacting high-mountain lakes and, as a
consequence, the quantification of essential parameters such as the volume
of overtopping water and the discharge (Westoby et al., 2014). Further,
uncertainties in the model parameters and the initial conditions accumulate
at process boundaries (Schaub et al., 2016), and threshold effects are
expected to result in strongly non-linear responses of the model error
(Mergili et al., 2018a, b). In high-energy mass flows, the physical
characteristics of the processes involved are not always understood at the
required level of detail (Mergili et al., 2018b).
On the one hand, flow models and simulation tools can help us to better
understand some of the key mechanisms of high-mountain process chains. On
the other hand, well documented case studies are important to gain a better
understanding on which questions can be tackled with simulation tools, and
which questions cannot be answered without further research. In the present
work, we explore this field of uncertainty by applying the r.avaflow
computational tool to the 1941 Lake Palcacocha GLOF process chain. Thereby,
based on the simulation of different scenarios, we investigate on the
following research questions:
What is the most likely release mechanism of initiating the process chain of the 1941 GLOF of Lake Palcacocha?
Are we able to back-calculate this process chain in an empirically adequate way with physically plausible model parameters? Mergili et al. (2018b) reported a trade-off between these two criteria for the simulation of the 1970 Huascarán landslide.
What are the major challenges in achieving successful (empirically adequate and physically plausible) simulations?
What can we learn with regard to forward calculations of possible future events?
In Sect. 2 we depict the local conditions and the documentation of the
event. After having introduced the computational framework r.avaflow
(Sect. 3), we describe in detail the simulation input (Sect. 4) and our
findings (Sect. 5). We discuss the results (Sect. 6) and finally summarize
the key points of the research (Sect. 7).
2
Lake Palcacocha
2.1
Quilcay catchment and Cojup Valley
Lake Palcacocha is part of a proglacial system in the headwaters of the
Cojup Valley in the Cordillera Blanca, Peru (Fig. 1). This system was –
and is still – shaped by the glaciers originating from the southwestern
slopes of Nevado Palcaraju (6264 m a.s.l.) and Nevado Pucaranra
(6156 m a.s.l.). A prominent horseshoe-shaped ridge of lateral and terminal
moraines marks the extent of the glacier during the first peak of the Little
Ice Age, dated using lichenometry to the 17th century (Emmer, 2017).
With glacier retreat, the depression behind the moraine ridge was filled
with a lake, named Lake Palcacocha. A photograph taken by Hans Kinzl in 1939
(Kinzl and Schneider, 1950) indicates a lake level of 4610 m a.s.l.,
allowing surficial outflow (Fig. 2a). Using this photograph, Vilímek et al. (2005) estimated a lake volume between 9 and
11 million m
3
at that time, whereas an unpublished estimate
of the Autoridad Nacional del Agua (ANA) arrived at approx. 13.1 million m
3
. It is assumed that the situation was essentially the same at the time of the 1941 GLOF (Sect. 2.2).
Figure 1
Location and main geographic features of the Quilcay catchment with
Lake Palcacocha and the former Lake Jircacocha.
Figure 2
The Quilcay catchment from Lake Palcacocha down to Huaráz.
(a)
Lake Palcacocha in 1939, two years prior to the 1941 event.
(b)
The site of former Lake Jircacocha with the breached landslide dam and the former lake level.
(c)
Breached moraine dam and 1941 GLOF deposits, seen from downstream.
(d)
Left lateral moraine of Lake Palcacocha with landslide area of 2003.
(e)
Panoramic view of Lake Palcacocha, with the breach in the moraine dam and the modern lake impounded by a smaller terminal moraine and two artificial dams.
(f)
Panoramic view of Huaráz with city centre and approximate impact area of the 1941 event. Note that a small part of the lowermost portion of the impact area is hidden behind a hillslope. Photos:
(a)
Hans Kinzl, 1939 (Kinzl and Schneider, 1950);
(b)
Martin Mergili, July 2017;
(c)
Gisela Eberhard, July 2018;
(d)
and
(f)
Martin Mergili, July 2017.
The Cojup Valley is part of the Quilcay catchment, draining towards
southwest to the city of Huaráz, capital of the department of Ancash
located at 3090 m a.s.l. at the outlet to the Río Santa Valley
(Callejon de Huaylas). Huaráz had a population of
<20 000
at
that time (Frey et al., 2018). The distance between Lake Palcacocha and
Huaráz is approx. 23 km, whereas the vertical drop is approx. 1500 m.
The Cojup Valley forms a glacially shaped high-mountain valley in its upper
part whilst cutting through the promontory of the Cordillera Blanca in its
lower part. Downstream from Lake Palcacocha by about 8 km (15 km upstream of
Huaráz), the landslide-dammed Lake Jircacocha (4.8 million m
3
; Vilímek et al., 2005) existed until 1941 (Andres et al., 2018). The remnants of this lake are still clearly visible in the landscape in 2017, mainly through the change in vegetation and the presence of fine lake sediments (Fig. 2b). Table 1 summarizes the major characteristics of Lake Palcacocha and Lake Jircacocha before the 1941 GLOF.
Table 1
Characteristics of Lake Palcacocha (1941 and 2016) and Lake
Jircacocha (1941), and changes due to the 1941 GLOF. Topographic reconstruction according to field observations and historic photographs. Additional information from Vilímek et al. (2005) and ANA (2016).
1
Reference values differ among sources: according to Vilímek et al. (2005), the volume of Lake Palcacocha in 1941 was 9–11 million m
3
, whereas a reconstruction of ANA resulted in 13.1 million m
3
. In contrast, Vilímek et al. (2005) estimate a pre-failure volume of 4.8 million m
3
for Lake Jircacocha, whereas, according to ANA, the volume was only 3.0 million m
3
.
2
Computed from the difference between the pre-1941 lake level and the modern lake level (before mitigation) of 4563 m. A reconstruction of ANA in 1948 resulted in a residual lake volume of approx. 100 000 m
3
and a residual depth of 17 m, both much smaller than values derived through the reconstruction in the present work. One of the reasons for this discrepancy might be the change of the glacier in the period 1941–1948.
3
This value is highly uncertain and might represent an overestimation: the maximum depth of the lake strongly depends on the exact position of the glacier terminus, which was most likely located in an area of increasing lake depth in 1941.
Download Print Version
|
Download XLSX
Figure 3
Situation in 1948, seven years after the 1941 event.
(a)
Residual Lake Palcacocha, and traces of the 1941 event.
(b)
Huaráz with the impact area of the 1941 event. Imagery source: Servicio Aerofotogramétrico Nacional, Peru.
2.2
1941 multi-lake outburst flood from Lake Palcacocha
On 13 December 1941 part of the city of Huaráz was destroyed by a
catastrophic GLOF-induced debris and mud flow, with thousands of fatalities.
Portocarrero (1984) gives an estimate of 4000 deaths, Wegner (2014) an estimate of 1800; but this type of information has to be interpreted with care (Evans et al., 2009). The disaster was the result of a multi-lake outburst
flood in the upper part of the Cojup Valley. A sudden breach of the dam and
the drainage of Lake Palcacocha (Fig. 2c and e) led to a mass flow
proceeding down the valley. Part of the eroded dam material, mostly coarse
material, blocks, and boulders, was deposited directly downstream from the
moraine dam, forming an outwash fan typical for moraine dam failures
(Fig. 2c), whereas additional solid material forming the catastrophic mass
flow was most likely eroded further along the flow path (both lateral and
basal erosion were observed; Wegner, 2014). The impact of the flow on Lake
Jircacocha led to overtopping and erosion of the landslide dam down to its
base, leading to the complete and permanent disappearance of this lake. The
associated uptake of the additional water and debris increased the energy of
the flow, and massive erosion occurred in the steeper downstream part of the
valley, near the city of Huaráz. Reports by the local communities
indicate that the valley was deepened substantially, so that the traffic
between villages was interrupted. According to Somos-Valenzuela et al. (2016), the valley bottom was lowered by as much as 50 m in some parts.
The impact area of the 1941 multi-GLOF and the condition of Lake Palcacocha
after the event are well documented through aerial imagery acquired in 1948
(Fig. 3). The image of Hans Kinzl acquired in 1939 (Fig. 2a) is the only
record of the status before the event. Additional information is available
through eyewitness reports (Wegner, 2014). However, as Lake Palcacocha is
located in a remote, uninhabited area, no direct estimates of travel times
or associated flow velocities are available. Also the trigger of the sudden
drainage of Lake Palcacocha remains unclear. Two mechanisms appear most
likely: (i) retrogressive erosion, possibly triggered by an impact wave
related to calving or an ice avalanche, resulting in overtopping of the dam
(however, Vilímek et al., 2005 state that there are no indicators for
such an impact), or (ii) internal erosion of the dam through piping, leading
to the failure.
2.3
Lake evolution since 1941
As shown on the aerial images from 1948, Lake Palcacocha was drastically
reduced to a small remnant proglacial pond, impounded by a basal moraine
ridge within the former lake area, at a water level of 4563 m a.s.l., 47 m
lower than before the 1941 event (Fig. 3a). However, glacial retreat during
the following decades led to an increase in the lake area and volume
(Vilímek et al., 2005). After reinforcement of the dam and the
construction of artificial drainage in the early 1970s, a lake volume of
514 800 m
3
was derived from bathymetric measurements
(Ojeda, 1974). In 1974, two artificial dams and a permanent drainage channel
were installed, stabilizing the lake level with a freeboard of 7 m to the
dam crest (Portocarrero, 2014). By 2003, the volume had increased to
3.69 million m
3
(Zapata et al., 2003). In the same year, a
landslide from the left lateral moraine caused a minor flood wave in the
Cojup Valley (Fig. 2d). In 2016, the lake volume had increased to
17.40 million m
3
due to continued deglaciation (ANA, 2016).
The potential of further growth is limited since, as of 2017, Lake
Palcacocha is only connected to a small regenerating glacier. Further, the
lake level is lowered artificially, using a set of siphons (it decreased by
3 m between December 2016 and July 2017). Table 1 summarizes the major
characteristics of Lake Palcacocha in 2016. The overall situation in July 2017 is illustrated in Fig. 2c.
2.4
Previous simulations of possible future GLOF process chains
Due to its history, recent growth, and catchment characteristics, Lake
Palcacocha is considered hazardous for the downstream communities, including
the city of Huaráz (Fig. 2e). Whilst Vilímek et al. (2005) point out
that the lake volume would not allow an event comparable to 1941, by 2016
the lake volume had become much larger than the volume before 1941 (ANA,
2016). Even though the lower potential of dam erosion (Somos-Valenzuela et al., 2016) and the non-existence of Lake Jircacocha make a 1941-magnitude event appear unlikely, the steep glacierized mountain walls in the back of the lake may produce ice or rock-ice avalanches leading to impact waves, dam overtopping, erosion, and subsequent mass flows. Investigations by Klimeš et al. (2016) of the steep lateral moraines surrounding the lake indicate that failures and slides from moraines are possible at several sites but do not have the potential to create a major overtopping wave, partly due to the elongated shape of the lake. Rivas et al. (2015) elaborated on the possible effects of moraine-failure-induced impact waves. Recently, Somos-Valenzuela et al. (2016) used a combination of simulation approaches to assess the possible impact of process chains triggered by ice avalanching into Lake Palcacocha on Huaráz. They considered three scenarios of ice avalanches detaching from the slope of Palcaraju (0.5, 1.0, and 3.0 million m
3
) in
order to create flood intensity maps and to indicate travel times of the
mass flow to various points of interest. For the large scenario, the mass
flow would reach the uppermost part of the city of Huaráz after approx.
1 h 20 min, for the other scenarios this time would increase to 2 h 50 min (medium scenario) and 8 h 40 min (small scenario). For the large scenario in particular, a high level of hazard is identified for a considerable zone near the Quilcay River, whereas zones of medium or low hazard become more abundant with the medium and small scenarios, or with the assumption of a lowered lake level (Somos-Valenzuela et al., 2016). In addition, Chisolm and McKinney (2018) analysed the dynamics impulse waves generated by avalanches using FLOW-3D. A similar modelling approach was applied by Frey et al. (2018) to derive a map of GLOF hazards for the Quilcay catchment. For Lake Palcacocha the same ice avalanche scenarios as applied by Somos-Valenzuela et al. (2016) were employed, with correspondingly comparable results in the Cojup Valley and for the city of Huaráz.
3
The r.avaflow computational tool
r.avaflow is an open-source tool for simulating the dynamics of complex mass
flows in mountain areas. It employs a two-phase model including solid
particles and viscous fluid, making it different to most other mass flow
simulation tools which build on one-phase mixture models. r.avaflow
considers the interactions between the phases as well as erosion and
entrainment of material from the basal surface. Consequently, it is
well-suited for the simulation of complex, cascading flow-type landslide
processes. The r.avaflow framework is introduced in detail by Mergili et al. (2017), and only those aspects relevant for the present work are explained here.
The Pudasaini (2012) two-phase flow model is used for propagating mass flows
from at least one defined release area through a digital terrain model (DTM). Flow dynamics is computed through depth-averaged equations describing
the conservation of mass and momentum for both solid and fluid. The solid
stress is computed on the basis of the Mohr–Coulomb plasticity, whereas the
fluid is treated with a solid-volume-fraction-gradient-enhanced
non-Newtonian viscous stress. Virtual mass due to the relative motion and
acceleration as well as generalized viscous drag accounts for the strong transfer
of momentum between the phases. Buoyancy is also considered. The momentum
transfer results in the simultaneous deformation, separation, and mixing of the
phases (Mergili et al., 2018a). Pudasaini (2012) gives a full description of
the set of equations.
Certain enhancements are included, compared to the original model: for
example, drag and virtual mass are computed according to extended analytical
functions constructed by Pudasaini (2019a, b). Additional (complementary)
functionalities include surface control, diffusion control, and basal
entrainment (Mergili et al., 2017, 2018a, 2019). A conceptual model is used
for entrainment: thereby, the empirically derived entrainment coefficient
C
E
is multiplied with the flow kinetic energy:
(1)
q
E
,
s
=
C
E
T
s
+
T
f
α
s
,
E
,
q
E
,
f
=
C
E
T
s
+
T
f
1
-
α
s
,
E
.
q
E,s
and
q
E,f
(m s
−1
) are the solid and fluid entrainment rates,
T
s
and
T
f
(J) are the solid and fluid kinetic energies, and
α
s,E
is the solid fraction of the entrainable material (Mergili et al., 2019). Flow heights and momenta as well as the change of elevation of the basal surface are updated at each time step (Mergili et al., 2017).
Any desired combination of solid and fluid release and entrainable heights
can be defined. The main results are raster maps of the evolution of solid
and fluid flow heights, velocities, and entrained heights in time. Pressures
and kinetic energies are derived from the flow heights and velocities.
Output hydrographs can be generated as an additional option (Mergili et al.,
2018a). Spatial discretization works on the basis of GIS raster cells: the
flow propagates between neighbouring cells during each time step. The Total
Variation Diminishing Non-Oscillatory Central Differencing (TVD-NOC) scheme
(Nessyahu and Tadmor, 1990; Tai et al., 2002; Wang et al., 2004) is employed
for solving the model equations. This approach builds on a staggered grid,
in which the
system is shifted half the cell size during each step in time
(Mergili et al., 2018b).
r.avaflow operates as a raster module of the open-source software GRASS GIS 7 (GRASS Development Team, 2019), employing the programming languages Python
and C as well as the R software (R Core Team, 2019). More details about
r.avaflow are provided by Mergili et al. (2017).
Figure 4
Reconstruction of lakes and topography.
(a)
Lake Palcacocha in 2017.
(b)
Lake Palcacocha before the 1941 event.
(c)
Lake Jircacocha before the 1941 event.
(d)
Part of the promontory section of the Cojup Valley, with lowering of the valley bottom by up to 50 m. The possible rock avalanche release area is shown in
(a)
for clarity but is applied to the 1941 situation.
4
Simulation input
The simulations build on the topography, represented by a DTM, and on
particular sets of initial conditions and model parameters. For the DTM, we
use a 5 m resolution digital elevation model (DEM) provided by the Peruvian
Ministry of Environment, MINAM (Horizons, 2013). It was deduced from recent
stereo aerial photographs and airborne lidar. The DEM is processed in order
to derive a DTM representing the situation before the 1941 event. Therefore,
we neglect the possible error introduced by the effects of vegetation or
buildings and focus on the effects of the lakes and of erosion (Fig. 4):
For the area of Lake Palcacocha the elevation of the lake surface is
replaced by a DTM of the lake bathymetry derived from ANA (2016). Possible
sedimentation since that time is neglected. The photograph taken by Hans Kinzl in 1939 (Fig. 2a) is used to reconstruct the moraine dam before the
breach, and the glacier at the same time. As an exact positioning of the
glacier terminus is not possible purely based on the photo, the position is
optimized towards a lake volume of approx. 13 million m
3
, following the estimate of ANA. It is further assumed that there was surficial drainage of Lake Palcacocha as suggested by Fig. 2a, i.e. the lowest part of the moraine crest is set equal to the former lake level of 4610 m a.s.l. (Fig. 4b).
For Lake Jircacocha, surficial overflow is also assumed (a situation that is observed for most of the recent landslide-dammed lakes in the Cordillera Blanca). On this basis the landslide dam before its breach is reconstructed, guided by topographic and geometric considerations. The lowest point of the dam crest is set to 4130 m a.s.l. (Fig. 4c).
Erosional features along the flow channel are assumed to largely relate to the 1941 event. These features are filled accordingly (see Table 2 for the filled volumes). In particular, the flow channel in the lower part of the valley, reportedly deepened by up to 50 m in the 1941 event (Vilímek et al., 2005), was filled in order to represent the situation before the event in a plausible way (Fig. 4d).
All lakes are considered as fluid release volumes in r.avaflow. The initial
level of Lake Palcacocha in 1941 is set to 4610 m a.s.l., whereas the level of Lake Jircacocha is set to 4129 m a.s.l. The frontal part of the moraine
dam impounding Lake Palcacocha and the landslide dam impounding Lake
Jircacocha are considered as entrainable volumes. Further, those areas
filled up along the flow path (Fig. 4d) are considered entrainable, mainly
following Vilímek et al. (2005). However, as it is assumed that part of
the material was removed through secondary processes or afterwards, only
75 % of the added material are allowed to be entrained. All entrained
material is considered 80 % solid and 20 % fluid per volume.
Table 2
Reference information used for back-calculation of the 1941 process
chain.
*
This includes the surface of Lake Palcacocha.
Download Print Version
|
Download XLSX
The reconstructed lake, breach, and entrainable volumes are shown in
Tables 1 and 2. The glacier terminus in 1941 was located in an area where
the lake depth increases by several tens of metres, so that small
inaccuracies in the position of the glacier tongue may result in large
inaccuracies in the volume, so that some uncertainty has to be accepted.
As the trigger of the sudden drainage of Lake Palcacocha is not clear, we
consider four scenarios, based on the situation before the event as shown in
the photo taken by Hans Kinzl; experiences from other documented GLOF events
in the Cordillera Blanca (Schneider et al., 2014; Mergili et al., 2018a);
considerations by Vilímek et al. (2005), Portocarrero (2014), and
Somos-Valenzuela et al. (2016); and geotechnical considerations:
A: retrogressive erosion, possibly induced by minor or moderate overtopping.
This scenario is related to a possible minor impact wave, caused for example by calving of ice from the glacier front, an increased lake level due to meteorological reasons, or a combination of these factors. In the simulation, the process chain is started by cutting an initial breach into the dam in order to initiate overtopping and erosion. The fluid phase is considered as pure water.
AX: similar to Scenario A, but with the second phase considered a mixture of fine mud and water.
For this purpose, density is increased to 1100 instead of 1000 kg m
−3
, and a yield strength of 5 Pa is introduced (Domnik et al., 2013; Pudasaini and Mergili, 2019; Table 3). For simplicity, we still refer to this mixture as a fluid. Such changed phase characteristics may be related to the input of fine sediment into the lake water (e.g. caused by a landslide from the lateral moraine as triggering event) but are mainly considered here in order to highlight the effects of uncertainties in the definition and parameterization of the two-phase mixture flow.
B: retrogressive erosion, induced by violent overtopping.
This scenario is related to a large impact wave caused by a major rock–ice avalanche or ice avalanche rushing into the lake. In the simulation, the process chain is initiated through a hypothetic landslide of 3 million m
3
of 75 % solid and 25 % fluid material, following the large scenario of Somos-Valenzuela et al. (2016) in terms of volume and release area. In
order to be consistent with Scenario A, fluid is considered as pure water.
C: internal erosion-induced failure of the moraine dam.
Here, the process chain is induced by the collapse of the entire reconstructed breach volume (Fig. 4b). In the simulation, this is done by considering this part of the moraine not as entrainable volume, but as release volume (80 % solid, 20 % fluid, whereby fluid is again considered as pure water).
Failure of the dam of Lake Jircacocha is assumed to have occurred through
overtopping and retrogressive erosion, induced by the increased lake level
and a minor impact wave from the flood upstream. No further assumptions of
the initial conditions are required in this case.
Table 3
Key model parameters applied to the simulations in the present work. Where three values are given, the first value applies to the glacier, the second value to the remaining area upstream of the dam of Lake Jircacocha, and the third value to the area downstream of the dam of Lake Jircacocha.
a
The fluid material density is set to 1100 kg m
−3
in Scenario AX.
b
The yield strength of the fluid phase is set to 5 Pa in Scenario AX.
c
This value applies to the dam of Lake Palcacocha.
d
This value applies to all other areas.
Download Print Version
|
Download XLSX
The model parameter values are selected in accordance with experiences
gained from previous simulations with r.avaflow for other study areas and
are summarized in Table 3. Three parameters mainly characterizing the flow
friction (basal friction of solid
δ
, ambient drag coefficient
C
AD
, and fluid friction coefficient
C
FF
) and the entrainment coefficient
C
E
are optimized in a spatially differentiated way to maximize the empirical adequacy of the simulations in terms of estimates of impact areas, erosion depths, and flow and breach volumes. As no travel times or velocities are documented for the 1941 event, we use the values given by
Somos-Valenzuela et al. (2016) as a rough reference. Varying those four parameters while keeping the others constant helps us to capture variability while minimizing the degrees of freedom, remaining aware of possible equifinality issues (Beven, 1996; Beven and Freer, 2001).
A particularly uncertain parameter is the empirical entrainment coefficient
C
E
(Eq. 1). In order to optimize
C
E
, we consider (i) successful prediction of the reconstructed breach volumes and (ii) correspondence of peak discharge with published empirical equations on the relation between peak discharge and both lake volume and dam height (Walder and O'Connor, 1997). Table 4 summarizes these equations for moraine dams (applied to Lake Palcacocha) and landslide dams (applied to Lake Jircacocha), and the values obtained for the regression and the envelope, using the volumes of both lakes. We note that Table 4 reveals very large differences – roughly 1 order of magnitude – between regression and envelope. In case of the breach of the moraine dam of Lake Palcacocha, we consider an extreme event due to the steep, poorly consolidated, and maybe soaked moraine, with a peak discharge close to the envelope (approx. 15 000 m
3
s
−1
). For Lake Jircacocha, in contrast, the envelope values of peak discharge do not appear realistic. However, due to the high rate of water inflow from above, a value well above the regression line still appears plausible, even though the usefulness of the empirical laws for this type of lake drainage can be questioned. The value of
C
E
optimized for the dam of Lake Jircacocha is also used for entrainment along the flow path.
Table 4
Empirical relationships for the peak discharge in case of breach of
moraine and landslide dams (Walder and O'Connor, 1997), and the peak discharges estimated for Lake Palcacocha and Lake Jircacocha.
q
p
=
peak discharge (m
3
s
−1
),
V
=
total volume of water passing through the breach (m
3
);
D
=
drop of lake level (m); REG
=
regression; ENV
=
envelope. The values of
V
and
D
for the two lakes are summarized in Table 1. See also Rivas et al. (2015).
Download Print Version
|
Download XLSX
All of the computational experiments are run with 10 m spatial resolution.
Only flow heights
≥25
cm are considered for visualization and
evaluation. We now describe one representative simulation result for each of
the considered scenarios, thereby spanning the most plausible and
empirically adequate field of simulations.
Figure 5
Hydrographs of moraine dam failure of Lake Palcacocha
(a, d)
, landslide dam failure of Lake Jircacocha
(b, e)
, and the flow entering the urban area of Huaráz
(c, f)
for scenarios A and AX. Note that, for clarity, fluid flow heights and discharges are plotted in the negative direction.
Download
5
r.avaflow simulation results
5.1
Scenario A – event induced by overtopping; fluid without yield strength
Outflow from Lake Palcacocha starts immediately, leading to (1) lowering of
the lake level and (2) retrogressive erosion of the moraine dam. The
bell-shaped fluid discharge curve at the hydrograph profile O1 (Fig. 4)
reaches its peak of 18 700 m
3
s
−1
after approx. 780 s and then decreases to a small residual (Fig. 5a). Channel incision happens quickly – 53 m of lowering of the terrain at the reference point R1 occurs within the first 1200 s, whereas the lowering at the end
of the simulation is 60 m (Fig. 6a). This number represents an underestimation, compared to the reference value of 76 m (Table 2). The lake level decreases by 42 m, whereby 36.5 m of the decrease occurs within the first 1200 s. The slight underestimation, compared to the reference value of 47 m of lake level decrease, is most likely a consequence of uncertainties in the
topographic reconstruction. A total amount of 1.5 million m
3
is eroded from the moraine dam of Lake Palcacocha, corresponding to an underestimation of 22 %, compared to the reconstructed breach volume. Underestimations mainly occur at both sides of the lateral parts of the eroded channel near the moraine crest – an area where additional post-event erosion can be expected, so that the patterns and degree of underestimation appear plausible (Fig. 7a). In contrast, some overestimation of erosion occurs in the inner part of the dam. For numerical reasons, some minor erosion is also simulated away from the eroded channel. The iterative optimization procedure results in an entrainment coefficient
C
E
=
10
-
6.75
.
Figure 6
Evolution of flow height and basal topography at the outlets of Lake
Palcacocha (reference point R1 in Fig. 4b), and Lake Jircacocha (reference
point R2 in Fig. 4c). The reference points are placed in a way to best
represent the evolution of the breach in the dam for Lake Palcacocha, and
the evolution of the impact wave for Lake Jircacocha. Additionally, the
evolution of the lake level is shown for Lake Palcacocha. Note that the
result for Scenario B is only displayed for Lake Palcacocha
(e)
, whereas the result for Scenario C is only illustrated for Lake Jircacocha
(f)
. The vertical distance displayed on the
y
axis refers to the terrain height or the lake level at the start of the simulation, respectively, whereby the flow height is imposed onto the topography. In Scenario B, the initial impact wave at the dam of Lake Palcacocha is only poorly represented due to the low temporal resolution of the simulation, and due to blurring by numerical effects
(e)
.
Download
Figure 7
Simulated versus reconstructed entrainment patterns for
scenarios A and AX. The total entrained height and the difference between
simulated and reconstructed entrainment (error) are shown.
(a)
Lake
Palcacocha, Scenario A.
(b)
Lake Jircacocha, Scenario A.
(c)
Lake Palcacocha, Scenario AX.
(d)
Lake Jircacocha, Scenario AX.
The deposit of much of the solid material eroded from the moraine dam
directly downstream from Lake Palcacocha, as observed in the field
(Fig. 2c), is reasonably well reproduced by this simulation, so that the
flow proceeding down-valley is dominated by the fluid phase (Fig. 8). It
reaches Lake Jircacocha after
t
=840
s (Fig. 5b). As the inflow occurs
smoothly, there is no impact wave in the strict sense, but it is rather the
steadily rising water level (see Fig. 6b for the evolution of the water
level at the reference point R2) inducing overtopping and erosion of the
dam. This only starts gradually after some lag time, at approx.
t
=1200
s. The discharge curve at the profile O2 (Fig. 4) reaches its pronounced peak of 750 m
3
s
−1
solid and 14 700 m
3
s
−1
fluid material at
t
=2340
s and then tails off slowly.
Figure 8
Evolution of the flow in space and time (Scenario A).
In the case of Lake Jircacocha, the simulated breach is clearly shifted
south, compared to the observed breach. With the optimized value of the
entrainment coefficient
C
E
=
10
-
7.15
, the breach volume is
underestimated by 24 %, compared to the reconstruction (Fig. 7b). Also,
here, this intentionally introduced discrepancy accounts for some post-event
erosion. However, we note that volumes are uncertain as the reconstruction
of the dam of Lake Jircacocha – in contrast
to Lake Palcacocha – is a
rough estimation due to lacking reference data.
Due to erosion of the dam of Lake Jircacocha, and also erosion of the valley
bottom and slopes, the solid fraction of the flow increases considerably
downstream. Much of the solid material, however, is deposited in the lateral
parts of the flow channel, so that the flow arriving at Huaráz is
fluid-dominated again (Fig. 8). The front enters the alluvial fan of
Huaráz at
t
=2760
s, whereas the broad peak of 10 500 m
3
s
−1
of fluid and 2000 m
3
s
−1
of solid material (solid fraction of 16 %) is reached in the period between 3600 and 3780 s (Figs. 4 and 5c). Discharge decreases steadily afterwards. A total of 2.5 million m
3
of solid and 14.0 million m
3
of fluid material passes the hydrograph profile O3 until
t
=5400
s. Referring only to the solid, this is less material than reported by Kaser and Georges (2003). However, (i) there is still some material coming after, and (ii) pore volume has to be added to the solid volume, so that the order of magnitude of material delivered to Huaráz corresponds to the documentation in a better way. Still, the solid ratio of the hydrograph might represent an underestimation.
As prescribed by the parameter optimization, the volumes entrained along the
channel are of the same order of magnitude, but lower than the reconstructed
volumes summarized in Table 2: 0.7 million m
3
of material is entrained
upstream, 1.5 million m
3
is entrained downstream of Lake Jircacocha, and 5.3 million m
3
is entrained in the promontory. Figure 9a summarizes the travel
times and the flow velocities of the entire process chain. Frontal
velocities mostly vary between 5 and 20 m s
−1
, with the
higher values in the steeper part below Lake Jircacocha. The low and
undefined velocities directly downstream of Lake Jircacocha reflect the time
lag of substantial overtopping. The key numbers in terms of times,
discharges, and volumes are summarized in Table 5.
Figure 9
Travel times and frontal velocities for scenarios
(a)
A and
(b)
AX. Void fields in the profile graph refer to areas without clearly defined flow front.
Table 5
Summary of the key results obtained with the computational experiments A–C. Refer to Tables 1 and 2 for the volumes involved, and to
Table 4 for empirically expected peak discharges. Note that all entrained
volumes are composed of 80 % of solid and 20 % of fluid material in
terms of volume.
*
Peak of initial overtopping as response to the impact wave: 7000 m
3
s
−1
.
Download Print Version
|
Download XLSX
5.2
Scenario AX – event induced by overtopping; fluid with yield strength
Adding a yield strength of
τ
y
=5
Pa to the characteristics of
the fluid substantially changes the temporal rather than the spatial
evolution of the process cascade. As the fluid now behaves as fine mud
instead of water and is more resistant to motion, velocities are lower,
travel times are much longer, and the entrained volumes are smaller than in
Scenario A (Fig. 9b; Table 5). The peak discharge at the outlet of Lake
Palcacocha is reached at
t
=1800
s. Fluid peak discharge of
8200 m
3
s
−1
is less than half the value yielded in
Scenario A (Fig. 5d). The volume of material eroded from the dam is only
slightly smaller than in Scenario A (1.4 versus 1.5 million m
3
). The numerically induced false positives with regard to erosion observed in Scenario A are not observed in Scenario AX, as the resistance to oscillations in the lake is higher with the added yield strength (Fig. 7c). Still, the major patterns of erosion and entrainment are the same. Interestingly, erosion is deeper in Scenario AX, reaching 76 m at the end of the simulation (Fig. 6c) and therefore the base of the entrainable material (Table 2). This is most likely a consequence of the spatially more concentrated flow and therefore higher erosion rates along the centre of the breach channel, with less lateral spreading than in Scenario A.
Consequently, Lake Jircacocha is also reached later than in Scenario A
(Fig. 6d), and the peak discharge at its outlet is delayed (
t
=4320
s)
and lower (7600 m
3
s
−1
of fluid and 320 m
3
s
−1
of solid material) (Fig. 5e). A total of 2.0 million m
3
of material is entrained from the dam of Lake Jircacocha, with similar spatial patterns to those in Scenario A (Fig. 7d). Huaráz is reached after
t
=4200
s, and the peak discharge of
5000 m
3
s
−1
of fluid and 640 m
3
s
−1
of solid material at O3 occurs after
t
=6480
s (Fig. 5f). This corresponds to a solid ratio of 11 %. Interpretation of the solid ratio requires care here as the fluid is defined as fine mud, so that the water content is much lower than the remaining 89 %. The volumes entrained along the flow channel are similar in magnitude to those obtained in the simulation of Scenario A (Table 5).
5.3
Scenario B – event induced by impact wave
Scenario B is based on the assumption of an impact wave from a 3 million m
3
landslide. However, due to the relatively
gently sloped glacier tongue heading into Lake Palcacocha at the time of the
1941 event (Figs. 2a and 4b), only a small fraction of the initial landslide
volume reaches the lake, and impact velocities and energies are reduced,
compared to a direct impact from the steep slope. Approx. 1 million m
3
of the landslide have entered the lake by
t
=120
s, an amount which only slightly increases thereafter. Most of the landslide deposits on the glacier surface. Caused by the impact wave, discharge at the outlet of Lake Palcacocha (O1) sets in at
t
=95
s and, due to overtopping of the impact wave, immediately reaches a relatively moderate first peak of 7000 m
3
s
−1
of fluid discharge. The main peak of 16 900 m
3
s
−1
of fluid and 2000 m
3
s
−1
of solid discharge occurs at
t
=1200
s due do the erosion of the breach channel. Afterwards, discharge decreases relatively quickly to a low base level (Fig. 10a). The optimized value of
C
E
=
10
-
6.75
is used also for this scenario. The depth of erosion along the main path of the breach channel is clearly less than in Scenario A (Fig. 6e). However, Table 5 shows a higher volume of eroded dam material than the other scenarios. These two contradicting patterns are explained by Fig. 11a: the overtopping due to the impact wave initiates erosion of not only the main breach, but also of a secondary breach farther north. Consequently, discharge is split among the two breaches and therefore less concentrated, explaining the lower erosion at the main channel despite a larger total amount of eroded material. The secondary drainage channel can also be deduced from observations (Fig. 3a) but has probably played a less important role than suggested by this simulation.
Figure 10
Hydrographs of moraine dam failure of Lake Palcacocha
(a, d)
, landslide dam failure of Lake Jircacocha
(b, e)
, and the flow entering the urban area of Huaráz
(c, f)
for scenarios B and C. Note that, for clarity, fluid flow heights and discharges are plotted in negative direction.
Download
Figure 11
Simulated versus reconstructed entrainment patterns for scenarios B and C. The total entrained height and the difference between
simulated and reconstructed entrainment (error) are shown.
(a)
Lake
Palcacocha, Scenario B.
(b)
Lake Jircacocha, Scenario B.
(c)
Lake Jircacocha, Scenario C.
The downstream results of Scenario B largely correspond to the results of Scenario A, with some delay partly related to the time from the initial
landslide to the overtopping of the impact wave. Discharge at the outlet of
Lake Jircacocha peaks at
t
=2700
s (Fig. 10b), and the alluvial fan of
Huaráz is reached after 3060 s (Fig. 10c). The peak discharges at O2
and O3 are similar to those obtained in Scenario A. The erosion patterns
at the dam of Lake Jircacocha (again,
C
E
=
10
-
7.15
) very much
resemble those yielded with scenarios A and AX (Fig. 11b), and so does
the volume of entrained dam material (2.2 million m
3
). The same is true for the 2.5 million m
3
of solid and 13.9 million m
3
of fluid material entering the area of Huaráz until
t
=5400
s, according to this simulation.
Also in this scenario, the volumes entrained along the flow channel are very
similar to those obtained in the simulation of Scenario A. The travel times
and frontal velocities – resembling the patterns obtained in Scenario A,
with the exception of the delay – are shown in Fig. 12a, whereas Table 5
summarizes the key numbers in terms of times, volumes, and discharges.
Figure 12
Travel times and frontal velocities for scenarios
(a)
B and
(b)
C. Note that the legend of
(a)
also applies to
(b)
. Void fields in the profile graph refer to areas without clearly defined flow front.
5.4
Scenario C – event induced by dam collapse
In Scenario C, we assume that the breached part of the moraine dam
collapses, and the collapsed mass mixes with the water from the suddenly
draining lake and flows downstream. The more sudden and powerful release,
compared to the two other scenarios, leads to higher frontal velocities and
shorter travel times (Fig. 12b; Table 5).
In contrast to the other scenarios, impact downstream starts earlier, as
more material is released at once, instead of steadily increasing
retrogressive erosion and lowering of the lake level. The fluid discharge at O1 peaks at almost 40 000 m
3
s
−1
(Fig. 10d) rapidly
after release. Consequently, Lake Jircacocha is reached already after 720 s,
and the impact wave in the lake evolves more quickly than in all the other
scenarios considered (Fig. 6f). The lake drains with a peak discharge of
15 400 m
3
s
−1
of fluid and 830 m
3
s
−1
of solid material after 1680–1740 s (Fig. 10e). In contrast to the more rapid evolution of the process chain, discharge magnitudes are largely comparable to those obtained with the other scenarios. The same is true for the hydrograph profile O3: the flow reaches the alluvial fan of Huaráz after
t
=2160
s, with a peak discharge slightly exceeding 10 000 m
3
s
−1
of fluid and 2000 m
3
s
−1
of solid material between
t
=2940
and 3240 s. A total of 2.7 million m
3
of solid and
14.6 million m
3
of fluid material enter the area of Huaráz until
t
=5400
s, which is slightly more than in the other scenarios, indicating the more powerful dynamics of the flow (Table 5). The fraction of solid material arriving at Huaráz remains low, with 16 % solid at peak discharge and 15 % in total. Again, the volumes entrained along the flow channel are very similar to those obtained with the simulations of the other scenarios (Table 5).
6
Discussion
6.1
Possible trigger of the GLOF process chain
In contrast to other GLOF process chains in the Cordillera Blanca, such as
the 2010 event at Laguna 513 (Schneider et al., 2014), which was clearly
triggered by an ice-rock avalanche into the lake, there is disagreement upon
the trigger of the 1941 multi-lake outburst flood in the Quilcay catchment.
Whereas, according to contemporary reports, there is no evidence of a
landslide (for example, ice avalanche) impact on the lake (Vilímek et al., 2005; Wegner, 2014), and dam rupture would have been triggered by internal erosion, some authors postulate at least a small impact starting the process chain (Portocarrero, 2014; Somos-Valenzuela et al., 2016).
Each of the three assumed initiation mechanisms of the 1941 event,
represented by scenarios A/AX, B, and C, yields results which are
plausible in principle. We consider a combination of all three mechanisms a
likely cause of this extreme process chain. Overtopping of the moraine dam,
possibly related to a minor impact wave, leads to the best correspondence of
the model results with the observation, documentation, and reconstruction.
In particular, the signs of minor erosion of the moraine dam north of the main
breach (Fig. 3a) support this conclusion: a major impact wave, resulting in
violent overtopping of the entire frontal part of the moraine dam, would
supposedly also have led to more pronounced erosion in that area, as to some
extent predicted by Scenario B. There is also no evidence for strong
landslide–glacier interactions (massive entrainment of ice or even
detachment of the glacier tongue), which would be likely scenarios in the
case of a very large landslide. Anyway, the observations do not allow for
substantial conclusions on the volume of a hypothetic triggering landslide:
as suggested by Scenario B, even a large landslide from the slopes of
Palcaraju or Pucaranra could have been partly alleviated on the rather
gently sloped glacier tongue between the likely release area and Lake
Palcacocha.
The minor erosional feature north of the main breach was already visible in
the photo of Kinzl (Fig. 2a), possibly indicating an earlier, small GLOF. It
remains unclear whether it was reactivated in 1941. Such a reactivation
could only be directly explained by an impact wave, but not by retrogressive
erosion only (A/AX) or internal failure of the dam (C) – so, more research
is needed here. The source area of a possible impacting landslide could have
been the slopes of Palcaraju or Pucaranra (Fig. 1), or the calving glacier
front (Fig. 2a). Attempts to quantify the most likely release volume and
material composition would be considered speculative due to the remaining
difficulties in adequately simulating landslide–lake and possibly landslide–glacier–lake interactions
(Westoby et al., 2014). Further research is necessary in this direction. In
any case, a poor stability condition of the dam (factor of safety
∼1
) could have facilitated the major retrogressive erosion of the main breach. A better understanding of the hydro-mechanical load applied by a possible overtopping wave and the mechanical strength of the moraine dam could help to resolve this issue.
The downstream patterns of the flow are largely similar for each of
scenarios A, AX, B, and C, with the exception of travel times and
velocities. Interaction with Lake Jircacocha disguises much of the signal of
process initiation. Lag times between the impact of the flow front on Lake
Jircacocha and the onset of substantial overtopping and erosion are approx.
10 in in scenarios A and B, and less than 3 min in Scenario C. This clearly reflects the slow and steady onset of those flows generated
through retrogressive erosion. The moderate initial overtopping in
Scenario B seems to be alleviated before reaching Lake Jircacocha. Sudden
mechanical failure of the dam (Scenario C), in contrast, leads to a more
sudden evolution of the flow, with more immediate downstream consequences.
6.2
Parameter uncertainties
We have tried to back-calculate the 1941 event in a way reasonably
corresponding to the observation, documentation, and reconstruction, and
building on physically plausible parameter sets. Earlier work on the
Huascarán landslides of 1962 and 1970 has demonstrated that empirically
adequate back-calculations are not necessarily plausible with regard to
parameterization (Mergili et al., 2018b). This issue may be connected to
equifinality issues (Beven, 1996; Beven and Freer, 2001), and in the case of
the very extreme and complex Huascarán 1970 event, by the inability of
the flow model and its numerical solution to adequately reproduce some of
the process components (Mergili et al., 2018b). In the present work,
however, reasonable levels of empirical adequacy and physical plausibility
are achieved. Open questions remain with regard to the spatial
differentiation of the basal friction angle required to obtain adequate
results (Table 3): lower values of
δ
downstream from the dam of Lake
Jircacocha are necessary to ensure that a certain fraction of solid passes
the hydrograph profile O3 and reaches Huaráz. Still, solid fractions at O3 appear rather low in all simulations. A better understanding of the
interplay between friction, drag, virtual mass, entrainment, deposition, and
phase separation could
help to resolve this issue (Pudasaini and Fischer,
2016a, b; Pudasaini, 2019a, b).
The empirically adequate reproduction of the documented spatial patterns is
only one part of the story (Mergili et al., 2018a). The dynamic flow
characteristics (velocities, travel times, hydrographs) are commonly much
less well documented, particularly for events in remote areas which happened
a long time ago. Therefore, direct references for evaluating the empirical
adequacy of the dimension of time in the simulation results are lacking.
However, travel times play a crucial role related to the planning and design
of (early) warning systems and risk reduction measures (Hofflinger et al.,
2019). Comparison of the results of scenarios A and AX (Fig. 9) reveals
almost doubling travel times when adding a yield stress to the fluid
fraction. In both scenarios, the travel times to Huaráz are of the
same order of magnitude as the travel times simulated by Somos-Valenzuela et
al. (2016) and therefore considered plausible, so that it is hard to decide which is the more adequate assumption. Even though the strategy of using the
results of earlier simulations as reference may increase the robustness of
model results, it might also reproduce errors and inaccuracies of earlier
simulation attempts, and thereby confirm wrong results.
The large amount of more or less pure lake water would point towards
Scenario A, whereas intense mixing and entrainment of fine material would
favour Scenario AX. More work is necessary in this direction, also
considering possible phase transformations (Pudasaini and Krautblatter,
2014). At the same time, the optimization and evaluation of the simulated
discharges remains a challenge. Here we rely on empirical relationships
gained from the analysis of comparable events (Walder and O'Connor, 1997).
6.3
Implications for predictive simulations
Considering what was said above, the findings from the back-calculation of
the 1941 event can help us to better understand and constrain possible
mechanisms of this extreme process chain. In principle, such an
understanding can be transferred to present hazardous situations in order to
inform the design of technical remediation measures. Earlier, measures were
implemented not only at Lake Palcacocha (Portocarrero, 2014), but also at
various other lakes such as
Laguna 513: a tunnelling scheme implemented in
the 1990s strongly reduced the impacts of the 2010 GLOF process chain
(Reynolds, 1998; Reynolds et al., 1998; Schneider et al., 2014).
However, the findings of this study should only be applied for forward
simulations in the same area or other areas with utmost care. The initial
conditions and model parameters are not necessarily valid for events of
different characteristics and magnitudes (Mergili et al., 2018b). In the
case of Lake Palcacocha, the situation has changed substantially since 1941:
the lake level is much lower and the volume larger, and the lake is directly
connected to the steep glacierized slopes, so that the impact of a
hypothetic landslide could be very different now. Also, the current lake is
dammed by a different moraine than the pre-1941 lake, with a very different dam
geometry (Somos-Valenzuela et al., 2016). In general, the mechanisms of the
landslide impact into the lake, which were not the focus of the present
study, would require more detailed investigations. Ideally, such work would
be based on a three-phase model (Pudasaini and Mergili, 2019; considering
ice as a separate phase) and consider knowledge and experience gained from
comparable, well-documented events. A possible candidate for such an event
would be the 2010 event at Laguna 513, which was back-calculated by
Schneider et al. (2014). In general, it remains a challenge to reliably
predict the outcomes of given future scenarios. The magnitude of the 1941 event was amplified by the interaction with Lake Jircacocha, whereas the
2012 GLOF process chain in the Santa Cruz Valley (Mergili et al., 2018a)
alleviated due to the interaction with Lake Jatuncocha, comparable in size.
While it seems clear that the result of such an interaction depends on event
magnitude, topography, and the dam characteristics of the impacted lake,
Mergili et al. (2018a, b) have demonstrated the high sensitivity of the
behaviour of the simulated flow to the friction parameters, but also to the
material involved (release mass, entrainment). A larger number of
back-calculated process chains will be necessary to derive guiding parameter
sets which could facilitate predictive simulations, and so will an
appropriate consideration of model uncertainties and possible threshold
effects (Mergili et al., 2018b). Earlier studies, considering the 2010 event
at Laguna 513 (Schneider et al., 2014) and three future scenarios for Lake
Palcacocha (Somos-Valenzuela et al., 2016) have followed a different
strategy, using model cascades instead of integrated simulations, so that a
comparison with studies based on r.avaflow is only possible to a limited
extent.
Another remaining issue is the lateral spreading of the flow on the fan of
Huaráz, which is overestimated in all four simulations (Figs. 8, 9, and 12): the most likely reason for this is the insufficient representation of fine-scale structures such as buildings or walls in the DEM, which would
serve as obstacles confining the flow in lateral direction.
7
Conclusions
We have performed back-calculations of the documented 1941 GLOF process
chain involving Lake Palcacocha and Lake Jircacocha in the Quilcay catchment
in the Cordillera Blanca, Peru. The key messages of this work are
summarized as follows:
Retrogressive erosion, possibly caused by a minor impact wave, appears to be the most likely release mechanism of the process chain, facilitated by a geotechnically poorly stable dam with a low width-to-height ratio. This type of failure – a combination of the idealized scenarios considered in this work – can be inferred from observations, and appears most plausible with regard to the simulation results. The identification of the triggering process remains difficult, also because the subsequent interaction with Lake Jircacocha disguises part of the respective signature downstream.
The correspondence between simulation results and observations is
reasonable, and the model parameter values used are physically plausible.
However, considerable uncertainties remain with regard to peaks and shapes
of the discharge hydrographs, and to the quantification of flow velocities
and travel times. Adding a yield strength to the fluid phase (Scenario AX)
completely changes the temporal, but not the spatial evolution of the flow.
Still, travel times remain of the same order of magnitude as those derived
by Somos-Valenzuela et al. (2016) for possible future events.
Transfer of the findings to forward simulations in the same area or
elsewhere remains a challenge due to differences in the initial conditions,
uncertainties of the reference data, equifinality issues, and the effects of process magnitude (Mergili et al., 2018b).
Code availability
The model codes of r.avaflow, a manual, training data, and the necessary start scripts can be obtained from Mergili and Pudasaini (2019) (
https://www.avaflow.org
).
Data availability
The original DEM was provided by MINAM and may not be freely distributed, but all data derived within the present work can be obtained by directly contacting the first author (martin.mergili@boku.ac.at).
Author contributions
MM developed the main ideas, defined the scenarios; did most of the data processing, simulations, and analyses; wrote a major portion of the text; and prepared all the figures and tables. SP provided important ideas with regard to the numerical simulations and contributed to the internal revision and optimization of the paper. AE contributed with important ideas, conducted field work, acquired data, contributed to the writing of the introductory
chapters, and took part in the internal revision and optimization of the paper. JTF provided important contributions to the internal revision and optimization of the work. AC provided important data and contributed to the internal revision and optimization of the paper. HF contributed with important ideas and field work, data acquisition, and text blocks for the introductory chapters and took part in the internal revision and optimization of the paper.
Competing interests
The authors declare that they have no conflict of interest.
Acknowledgements
We are grateful to Matthias Benedikt for comprehensive technical
support in relation to r.avaflow.
Financial support
This research has been supported by the Austrian Science Fund (grant no. I1600-N30), the German Research Foundation (grant nos. PU 386/3-1 and PU 386/5-1), the Swiss Agency for Development and Cooperation, the Ministry of Education, Youth and Sports of the Czech Republic (grant no. LO1415), and the Czech Academy of Sciences.
Review statement
This paper was edited by Matjaz Mikos and reviewed by John Reynolds, Ashim Sattar, and one anonymous referee.
References
ANA: Inventario Nacional de Glaciares y Lagunas – Lagunas, Ministerio de
Agricultura y Riesgo, Autoridad Nacional del Agua, Unidad de Glaciología y Recursos Hídricos, Huaráz, Peru, 2014.
ANA: Plano batimétrico de la Laguna Palcacocha. Perfil longitudinal y
transversal, Ministerio de Agricultura y Riesgo, Autoridad Nacional del Agua, Unidad de Glaciología y Recursos Hídricos, Huaráz, Peru, 2016.
Andres, C. N., Eyles, C. H., Jara, H., and Narro-Pérez, R.: Sedimentological analysis of Paleolake Jircacocha, Cojup Valley, Cordillera
Blanca, Peru, Revista de Glaciares y Ecosystemas de Montaña, 5, 9–26,
2018.
Beven, K.: Equifinality and Uncertainty in Geomorphological Modelling, in:
The Scientific Nature of Geomorphology: Proceedings of the 27th Binghamton
Symposium in Geomorphology, 27–29 September 1996, John Wiley & Sons,
Chichester, 289–313, 1996.
Beven, K. and Freer, J.: Equifinality, data assimilation, and uncertainty
estimation in mechanistic modelling of complex environmental systems using
the GLUE methodology, J. Hydrol., 249, 11–29,
https://doi.org/10.1016/S0022-1694(01)00421-8
, 2001.
Bolch, T., Peters, J., Yegorov, A., Prafhan, B., Buchroithner, M., and
Blagoveshchensky, V.: Identification of potentially dangerous glacial lakes
in the northern Tien Shan, Nat. Hazards, 59, 1691–1714,
https://doi.org/10.1007/s11069-011-9860-2
, 2011.
Breien, H., De Blasio, F. V., Elverhoi, A., and Hoeg, K.: Erosion and morphology of a debris flow caused by a glacial lake outburst flood, Western
Norway, Landslides, 5, 271–280,
https://doi.org/10.1007/s10346-008-0118-3
, 2008.
Broggi, J. A.: Informe preliminar sobre la exploracion y estudio de las
condiciones de estabilidad de las lagunas de la Cordillera Blanca,
ELECTROPERU S.A., Lima, Peru, 1942.
Carey, M.: Living and dying with glaciers: people's historical vulnerability
to avalanches and outburst floods in Peru, Global Planet. Change, 47, 122–134,
https://doi.org/10.1016/j.gloplacha.2004.10.007
, 2005.
Carey, M., Huggel, C., Bury, J., Portocarrero, C., and Haeberli, W.: An
integrated socio-environmental framework for glacier hazard management and
climate change adaptation: lessons from Lake 513, Cordillera Blanca, Peru,
Climatic Change, 112, 733–767,
https://doi.org/10.1007/s10584-011-0249-8
, 2012.
Carey, M., McDowell, G., Huggel, C., Jackson, M., Portocarrero, C., Reynolds, J. M., and Vicuña, L.: Integrated approaches to adaptation and disaster risk reduction in dynamic socio-cryospheric systems, in: Snow and Ice-related Hazards, Risks and Disasters, edited by: Haeberli, W. and Whiteman, C., Elsevier, Amsterdam, 219–261,
https://doi.org/10.1016/B978-0-12-394849-6.00008-1
, 2014.
Chisolm, R. E. and McKinney, D. C.: Dynamics of avalanche-generated impulse
waves: three-dimensional hydrodynamic simulations and sensitivity analysis,
Nat. Hazards Earth Syst. Sci., 18, 1373–1393,
https://doi.org/10.5194/nhess-18-1373-2018
, 2018.
Christen, M., Kowalski, J., and Bartelt, P.: RAMMS: Numerical simulation of
dense snow ava-lanches in three-dimensional terrain, Cold Reg. Sci. Technol., 63, 1–14,
https://doi.org/10.1016/j.coldregions.2010.04.005
, 2010.
Clague, J. J. and O'Connor, J. E.: Glacier-related outburst floods, in: Snow and Ice-related Hazards, Risks and Disasters, edited by: Haeberli, W. and Whiteman, C., Elsevier, Amsterdam, 487–519,
https://doi.org/10.1016/B978-0-12-394849-6.00014-7
, 2014.
Concha, J. F.: Sintesis de los trabajos efectuados por la comision de las
lagunas de la Cordillera Blanca, Ministerio de Fomento, Comision de Control de las Lagunas de la Cordillera Blanca (CCLCB), Lima, Peru, 1952.
Domnik, B., Pudasaini, S. P., Katzenbach, R., and Miller, S. A.: Coupling of
full two-dimensional and depth-averaged models for granular flows, J.
Non-Newton. Fluid Mech., 201, 56–68,
https://doi.org/10.1016/j.jnnfm.2013.07.005
, 2013.
Emmer, A.: Geomorphologically effective floods from moraine-dammed lakes in the Cordillera Blanca, Peru, Quaternary Sci. Rev., 177, 220–234,
https://doi.org/10.1016/j.quascirev.2017.10.028
, 2017.
Emmer, A., and Vilímek, V.: Review Article: Lake and breach hazard
assessment for moraine-dammed lakes: an example from the Cordillera Blanca
(Peru), Nat. Hazards Earth Syst. Sci., 13, 1551–1565,
https://doi.org/10.5194/nhess-13-1551-2013
, 2013.
Emmer, A., and Vilímek, V.: New method for assessing the susceptibility
of glacial lakes to outburst floods in the Cordillera Blanca, Peru, Hydrol.
Earth Syst. Sci., 18, 3461–3479,
https://doi.org/10.5194/hess-18-3461-2014
, 2014.
Emmer, A., Merkl, S., and Mergili, M.: Spatiotemporal patterns of high-mountain lakes and related hazards in western Austria, Geomorphology,
246, 602–616,
https://doi.org/10.1016/j.geomorph.2015.06.032
, 2015.
Emmer, A., Klimeš, J., Mergili, M., Vilímek, V., and Cochachin, A.:
882 lakes of the Cordillera Blanca: an inventory, classification and
assessment of susceptibility to outburst flood, Catena, 147, 269–279,
https://doi.org/10.1016/j.catena.2016.07.032
, 2016.
Emmer, A., Vilímek, V., and Zapata, M. L.: Hazard mitigation of glacial
lake outburst floods in the Cordillera Blanca (Peru): the effectiveness of
remedial works, J. Flood Risk Manage., 11, 489–501,
https://doi.org/10.1111/jfr3.12241
, 2018.
Evans, S. G., Bishop, N. F., Fidel Smoll, L., Valderrama Murillo, P., Delaney, K. B., and Oliver-Smith, A.: A re-examination of the mechanism and
human impact of catastrophic mass flows originating on Nevado Huascarán,
Cordillera Blanca, Peru in 1962 and 1970, Eng. Geol., 108, 96–118,
https://doi.org/10.1016/j.enggeo.2009.06.020
, 2009.
Frey, H., Huggel, C., Chisolm, R. E., Baer, P., McArdell, B., Cochachin, A.,
and Portocarrero, C.: Multi-Source Glacial Lake Outburst Flood Hazard Assessment and Mapping for Huaráz, Cordillera Blanca, Peru, Front. Earth
Sci., 6, 210,
https://doi.org/10.3389/feart.2018.00210
, 2018.
Gabl, R., Seibl, J., Gems, B., and Aufleger, M.: 3-D numerical approach to
simulate the overtopping volume caused by an impulse wave comparable to
avalanche impact in a reservoir, Nat. Hazards Earth Syst. Sci., 15,
2617–2630,
https://doi.org/10.5194/nhess-15-2617-2015
, 2015.
GAPHAZ: Assessment of glacier and permafrost hazards in Mountain Regions,
in: Joint Standing Group on Glacier and Permafrost Hazards in High Mountains (GAPHAZ) of the International Association of Cryospheric Sciences (IACS) and the International Permafrost Association (IPA), edited by: Allen, S. K., Frey, H., and Huggel, C., Zurich, Lima, available at:
http://gaphaz.org/files/Assessment_Glacier_Permafrost_Hazards_Mountain_Regions.pdf
(last access: 3 January 2020), 2017.
GRASS Development Team: Geographic Resources Analysis Support System (GRASS)
Software, Open Source Geospatial Foundation Project, available at:
https://grass.osgeo.org
, last access: 4 February 2019.
Haeberli, W.: Frequency and characteristics of glacier floods in the Swiss
Alps, Ann. Glaciol., 4, 85–90,
https://doi.org/10.3189/S0260305500005280
, 1983.
Harrison, S., Kargel, J. S., Huggel, C., Reynolds, J., Shugar, D. H., Betts,
R. A., Emmer, A., Glasser, N., Haritashya, U. K., Klimeš, J., Reinhardt,
L., Schaub, Y., Wilyshire, A., Regmi, D., and Vilímek, V.: Climate change and the global pattern of moraine-dammed glacial lake outburst floods, The Cryosphere, 12, 1195–1209,
https://doi.org/10.5194/tc-12-1195-2018
, 2018.
Hewitt, K.: Natural dams and outburst floods in the Karakorum Himalaya, in:
Hydrological aspects of alpine and high-mountain areas, edited by: Glen, J.
W., IAHS Publ., 138, 259–269, 1982.
Hewitt, K. and Liu, J.: Ice-dammed lakes and outburst floods, Karakoram
Himalaya: historical perspectives on emerging threats, Phys. Geogr., 31,
528–551,
https://doi.org/10.2747/0272-3646.31.6.528
, 2010.
Hofflinger, A., Somos-Valenzuela, M. A., and Vallejos-Romero, A.: Response
time to flood events using a social vulnerability index (ReTSVI), Nat.
Hazards Earth Syst. Sci., 19, 251–267,
https://doi.org/10.5194/nhess-19-251-2019
, 2019.
Horizons: Horizons South America S. A. C.: Informe Técnico del Proyecto,
Consultoría Para El Levantamiento Fotogramétrico Detallado De La
Sub Cuenca Del Río Quillcay Y La Ciudad De Huaráz Para El Proyecto,
Implementación de Medidas de Adaptación al Cambio Climático y
Gestión de Riesgos en la Subcuenca Quillcay (IMACC-QUILLCAY) –
BID-MINAM (PE-T1168), Ministerio Del Ambiente A Travel Del Fonam –
Administrador De Los Recursos Del BID, Lima, Peru, 2013.
Hubbard, B., Heald, A., Reynolds, J. M., Quincey, D., Richardson, S. D., Luyo, M. Z., Portilla, N. S., and Hambrey, M. J.: Impact of a rock avalanche on a moraine-dammed proglacial lake: Laguna Safuna Alta, Cordillera Blanca,
Peru, Earth Surf. Proc. Land., 30, 1251–1264,
https://doi.org/10.1002/esp.1198
, 2005.
Huggel, C., Kääb, A., Haeberli, W., and Krummenacher, B.: Regional-scale GIS-models for assessment of hazards from glacier lake
outbursts: evaluation and application in the Swiss Alps, Nat. Hazards Earth
Syst. Sci., 3, 647–662,
https://doi.org/10.5194/nhess-3-647-2003
, 2003.
Iturrizaga, L.: Glacial and glacially conditioned lake types in the Cordillera Blanca, Peru: A spatiotemporal conceptual approach, Prog. Phys. Geogr., 38, 602–636,
https://doi.org/10.1177/0309133314546344
, 2014.
Iverson, R. M.: The physics of debris flows, Rev. Geophys., 35, 245–296,
https://doi.org/10.1029/97RG00426
, 1997.
Kafle, J., Pokhrel, P. R., Khattri, K. B., Kattel, P., Tuladhar, B. M., and
Pudasaini, S. P.: Landslide-generated tsunami and particle transport in
mountain lakes and reservoirs, Ann. Glaciol., 57, 232–244,
https://doi.org/10.3189/2016AoG71A034
, 2016.
Kafle, J., Kattel, P., Mergili, M., Fischer, J.-T., and Pudasaini, S. P.:
Dynamic response of submarine obstacles to two-phase landslide and tsunami
impact on reservoirs, Acta Mech., 230, 3143–3169,
https://doi.org/10.1007/s00707-019-02457-0
, 2019.
Kaser, G. and Georges, C.: A potential disaster in the Icy Andes: a regrettable blunder, technical report, University of Innsbruck, Austria, 2003.
Kattel. P, Khattri, K. B., Pokhrel, P. R., Kafle, J., Tuladhar, B. M., and
Pudasaini, S. P.: Simu-lating glacial lake outburst floods with a two-phase
mass flow model, Ann. Glaciol., 57, 349–358,
https://doi.org/10.3189/2016AoG71A039
, 2016.
Kinzl, H. and Schneider, E.: Cordillera Blanca (Perú), Universitäts-Verlag Wagner, Innsbruck, Austria, 1950.
Klimeš, J., Novotný, J., Novotná, I., de Urries, B. J., Vilímek, V., Emmer, A., Strozzi, T., Kusák, M., Cochachin, A., Hartvich, F., and Frey, H.: Landslides in moraines as triggers of glacial lake outburst floods: example from Palcacocha Lake (Cordillera Blanca, Peru), Landslides, 13, 1461–1477,
https://doi.org/10.1007/s10346-016-0724-4
, 2016.
McDougall, S. and Hungr, O.: A Model for the Analysis of Rapid Landslide Motion across Three-Dimensional Terrain, Can. Geotech. J., 41, 1084–1097,
https://doi.org/10.1139/t04-052
, 2004.
Mergili, M. and Pudasaini, S. P.: r.avaflow – The open source mass flow
simulation model, available at:
https://www.avaflow.org/
, last access: 9 July 2019.
Mergili, M. and Schneider, J. F.: Regional-scale analysis of lake outburst
hazards in the southwestern Pamir, Tajikistan, based on remote sensing and
GIS, Nat. Hazards Earth Syst. Sci., 11, 1447–1462,
https://doi.org/10.5194/nhess-11-1447-2011
, 2011.
Mergili, M., Schneider, D., Worni, R., and Schneider, J. F.: Glacial Lake
Outburst Floods (GLOFs): challenges in prediction and modelling, in:
Italian Journal of Engineering Geology an
d Environment – Book, edited by: Genevois, R., Hamilton, D. L., and Prestininzi, A., Proceedings of the 5th International Conference on Debris-Flow Hazards Mitigation: Mechanics, Prediction and Assessment, 14–17 June 2011, Padova, 973–982, 2011.
Mergili, M., Müller, J. P., and Schneider, J. F.: Spatio-temporal development of high-mountain lakes in the headwaters of the Amu Darya river
(Central Asia), Global Planet. Change, 107, 13–24,
https://doi.org/10.1016/j.gloplacha.2013.04.001
, 2013.
Mergili, M., Fischer, J.-T., Krenn, J., and Pudasaini, S. P.: r.avaflow v1,
an advanced open source computational framework for the propagation and
interaction of two-phase mass flows, Geosci. Model Dev., 10, 553–569,
https://doi.org/10.5194/gmd-10-553-2017
, 2017.
Mergili, M., Emmer, A., Juřicová, A., Cochachin, A., Fischer, J.-T.,
Huggel, C., and Pudasaini, S. P.: How well can we simulate complex hydro-geomorphic process chains? The 2012 multi-lake outburst flood in the
Santa Cruz Valley (Cordillera Blanca, Perú), Earth Surf. Proc. Land., 43, 1373–1389,
https://doi.org/10.1002/esp.4318
, 2018a.
Mergili, M., Frank, B., Fischer, J.-T., Huggel, C., and Pudasaini, S. P.:
Computational experiments on the 1962 and 1970 landslide events at Huascarán (Peru) with r.avaflow: Lessons learned for predictive mass
flow simulations, Geomorphology, 322, 15–28,
https://doi.org/10.1016/j.geomorph.2018.08.032
, 2018b.
Mergili, M., Jaboyedoff, M., Pullarello, J., and Pudasaini, S. P.: Back-calculation of the 2017 Piz Cengalo-Bondo landslide cascade with r.avaflow, Nat. Hazards Earth Syst. Sci. Discuss.,
https://doi.org/10.5194/nhess-2019-204
, in review, 2019.
Nessyahu, H. and Tadmor, E.: Non-oscillatory central differencing for
hyperbolic conservation laws, J. Comput. Phys., 87, 408–463,
https://doi.org/10.1016/0021-9991(90)90260-8
, 1990.
Ojeda, N.: Consolidacion laguna Palcacocha, ELECTROPERU S. A., Unidad de
glaciologia y seguridad de lagunas, Huaráz, Peru, 1974.
Oppenheim, V.: Sobre las Lagunas de Huaráz, Boletin de la Sociedad
Geologica del Peru, 19, 68–80, 1946.
Pitman, E. B. and Le, L.: A two-fluid model for avalanche and debris flows,
Philos. T. Roy. Soc. A, 363, 1573–1601,
https://doi.org/10.1098/rsta.2005.1596
, 2005.
Portocarrero, C.: Seminaro desastres naturales – geologia, causes, efectos
y prevenciones, ELECTROPERU S. A., Unidad de glaciologia y seguridad de
lagunas, Huaráz, Peru, 1984.
Portocarrero, C.: The Glacial Lake Handbook: Reducing Risk from Dangerous
Glacial Lakes in the Cordillera Blanca, Peru, Technical Report, United
States Agency for International Development, Global Climate Change Office,
Climate Change Resilient Development Project, Washington, D.C., 2014.
Pudasaini, S. P.: A general two-phase debris flow model, J. Geophys. Res.-Earth, 117, F03010,
https://doi.org/10.1029/2011JF002186
, 2012.
Pudasaini, S. P.: A full description of generalized drag in mixture mass
flows, Eng. Geol.,  105429,
https://doi.org/10.1016/j.enggeo.2019.105429
, 2019a.
Pudasaini, S. P.: A fully analytical model for virtual mass force in mixture
flows, Int. J. Multiph. Flow, 113, 142–152,
https://doi.org/10.1016/j.ijmultiphaseflow.2019.01.005
, 2019b.
Pudasaini, S. P. and Hutter, K.: Avalanche Dynamics: Dynamics of rapid flows of dense granular avalanches, Springer, Berlin, Heidelberg, 2007.
Pudasaini, S. P. and Krautblatter, M.: A two-phase mechanical model for
rock-ice avalanches, J. Geophys. Res.-Earth, 119, 2272–2290,
https://doi.org/10.1002/2014JF003183
, 2014.
Pudasaini, S. P. and Fischer, J.-T.: A mechanical model for phase-separation in debris flow, available at:
https://arxiv.org/pdf/1610.03649.pdf
(last access: 3 January 2020), 2016a.
Pudasaini, S. P. and Fischer, J.-T.: A mechanical erosion model for two-phase mass flows, available at:
https://arxiv.org/pdf/1610.01806.pdf
(last access: 3 January 2020), 2016b.
Pudasaini, S. P. and Mergili, M.: A Multi-Phase Mass Flow Model, J. Geophys.
Res.-Earth,
https://doi.org/10.1029/2019JF005204
, 2019.
R Core Team: R: A Language and Environment for Statistical Computing, R Foundation for Statistical Computing, Vienna, Austria, available at:
https://www.r-project.org/
, last access: 4 February 2019.
Reynolds, J. M.: Managing the risks of glacial flooding at hydro plants,
Hydro Rev. Worldwide, 6, 18–22, 1998.
Reynolds, J. M., Dolecki, A., and Portocarrero, C.: The construction of a
drainage tunnel as part of glacial lake hazard mitigation at Hualcán,
Cordillera Blanca, Peru, in: Geohazards in engineering geology, edited by: Maund, J. and Eddleston, M., Geological Society Engineering Group Special
Publication, 15, 41–48, 1998.
Richardson, S. D. and Reynolds, J. M.: An overview of glacial hazards in the Himalayas, Quatern. Int., 65/66, 31–47,
https://doi.org/10.1016/S1040-6182(99)00035-X
, 2000.
Rivas, D. S., Somos-Valenzuela, M. A., Hodges, B. R., and McKinney, D. C.:
Predicting outflow induced by moraine failure in glacial lakes: the Lake
Palcacocha case from an uncertainty perspective, Nat. Hazards Earth Syst.
Sci., 15, 1163–1179,
https://doi.org/10.5194/nhess-15-1163-2015
, 2015.
Sattar, A., Goswami, A., and Kulkarni, A. V.: Application of 1D and 2D
hydrodynamic modeling to study glacial lake outburst flood (GLOF) and its
impact on a hydropower station in Central Himalaya, Nat. Hazards, 97, 535–553,
https://doi.org/10.1007/s11069-019-03657-6
, 2019a.
Sattar, A., Goswami, A., and Kulkarni, A. V.: Hydrodynamic moraine-breach
modeling and outburst flood routing – A hazard assessment of the South Lhonak lake, Sikkim, Sci. Total Environ., 668, 362–378,
https://doi.org/10.1016/j.scitotenv.2019.02.388
, 2019b.
Savage, S. B. and Hutter, K.: The motion of a finite mass of granular material down a rough incline, J. Fluid Mech., 199, 177–215,
https://doi.org/10.1017/S0022112089000340
, 1989.
Schaub, Y., Huggel, C., and Cochachin, A.: Ice-avalanche scenario elaboration and uncertainty propagation in numerical simulation of rock-/ice-avalanche-induced impact waves at Mount Hualcán and Lake 513,
Peru, Landslides, 13, 1445–1459,
https://doi.org/10.1007/s10346-015-0658-2
, 2016.
Schneider, D., Huggel, C., Cochachin, A., Guillén, S., and García, J.: Mapping hazards from glacier lake outburst floods based on modelling of
process cascades at Lake 513, Carhuaz, Peru, Adv. Geosci., 35, 145–155,
https://doi.org/10.5194/adgeo-35-145-2014
, 2014.
Somos-Valenzuela, M. A., Chisolm, R. E., Rivas, D. S., Portocarrero, C., and
McKinney, D. C.: Modeling a glacial lake outburst flood process chain: the
case of Lake Palcacocha and Huaráz, Peru, Hydrol. Earth Syst. Sci., 20,
2519–2543,
https://doi.org/10.5194/hess-20-2519-2016
, 2016.
Tai, Y. C., Noelle, S., Gray, J. M. N. T., and Hutter, K.: Shock-capturing
and front-tracking methods for granular avalanches, J. Comput. Phys., 175, 269–301,
https://doi.org/10.1006/jcph.2001.6946
, 2002.
Takahashi, T., Nakagawa, H., Harada, T., and Yamashiki, Y.: Routing debris
flows with particle segregation, J. Hydraul. Res., 118, 1490–1507,
https://doi.org/10.1061/(ASCE)0733-9429(1992)118:11(1490)
, 1992.
Turzewski, M. D., Huntington, K. W., and LeVeque, R. J.: The geomorphic impact of outburst floods: Integrating observations and numerical simulations of the 2000 Yigong flood, eastern Himalaya, J. Geophys. Res.-Earth,  124, 1056–1079,
https://doi.org/10.1029/2018JF004778
,   2019.
Vilímek, V., Zapata, M. L., Klimeš, J., Patzelt, Z., and Santillán, N.: Influence of glacial retreat on natural hazards of the
Palcacocha Lake area, Peru, Landslides, 2, 107–115,
https://doi.org/10.1007/s10346-005-0052-6
, 2005.
Voellmy, A.: Über die Zerstörungskraft von Lawinen, Schweizerische
Bauzeitung, 73,  212–217, 1955.
Walder, J. S. and O'Connor, J. E.: Methods for predicting peak discharge of
floods caused by failure of natural and constructed earthen dams, Water Resour. Res., 33, 2337–2348,
https://doi.org/10.1029/97WR01616
, 1997.
Wang, Y., Hutter, K., and Pudasaini, S. P.: The Savage-Hutter theory: A system of partial differential equations for avalanche flows of snow, debris, and mud, ZAMM – J. Appl. Math. Mech., 84, 507–527,
https://doi.org/10.1002/zamm.200310123
, 2004.
Wegner, S. A.: Lo Que el Agua se Llevó: Consecuencias y Lecciones del
Aluvión de Huaráz de 1941, Technical Note 7 of the series “Technical Notes on Climate Change”, Ministry of Environment, Lima, Peru, 2014.
Westoby, M. J., Glasser, N. F., Brasington, J., Hambrey, M. J., Quincey, D.
J., and Reynolds, J. M.: Modelling outburst floods from moraine-dammed glacial lakes, Earth-Sci. Rev., 134, 137–159,
https://doi.org/10.1016/j.earscirev.2014.03.009
, 2014.
Worni, R., Huggel, C., Clague, J. J., Schaub, Y., and Stoffel, M.: Coupling
glacial lake impact, dam breach, and flood processes: A modeling perspective, Geomorphology, 224, 161–176,
https://doi.org/10.1016/j.geomorph.2014.06.031
, 2014.
Zapata, M. L.: Lagunas con obras de seguridad en la Cordillera Blanca, INGEOMIN, glaciologia y seguridad de lagunas, Huaráz, Peru, 1978.
Zapata, M. L., Gómez, R. J. L., Santillán, N. P., Espinoza, H. V.,
and Huamaní, A. H.: Evaluacion del estado de los glaciares en la cabecera de la laguna Palcacocha, Informe tecnico, INRENA, INGEMMET, Huaráz, Peru, 2003.
Articles
Abstract
Introduction
Lake Palcacocha
The r.avaflow computational tool
Simulation input
r.avaflow simulation results
Discussion
Conclusions
Code availability
Data availability
Author contributions
Competing interests
Acknowledgements
Financial support
Review statement
References
Download
Article
(27250 KB)
Full-text XML
BibTeX
EndNote
Short summary
In 1941, the glacial lagoon Lake Palcacocha in the Cordillera Blanca (Peru) drained suddenly. The resulting outburst flood/debris flow consumed another lake and had a disastrous impact on the town of Huaraz 23 km downstream. We reconstuct this event through a numerical model to learn about the possibility of prediction of similar processes in the future. Remaining challenges consist of the complex process interactions and the lack of experience due to the rare occurrence of such process chains.
In 1941, the glacial lagoon Lake Palcacocha in the Cordillera Blanca (Peru) drained suddenly....
Read more
Share
Turn MathJax on
Sections
Abstract
Introduction
Lake Palcacocha
The r.avaflow computational tool
Simulation input
r.avaflow simulation results
Discussion
Conclusions
Code availability
Data availability
Author contributions
Competing interests
Acknowledgements
Financial support
Review statement
References