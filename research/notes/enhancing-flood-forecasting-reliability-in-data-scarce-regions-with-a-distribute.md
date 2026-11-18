---
title: Enhancing flood forecasting reliability in data-scarce regions with a distributed
id: enhancing-flood-forecasting-reliability-in-data-scarce-regions-with-a-distribute
tags:
- atlas-improvement-research-177509
created: '2026-11-18T12:54:52.125677Z'
source: https://egusphere.copernicus.org/preprints/2025/egusphere-2025-2294/egusphere-2025-2294.pdf
source_domain: egusphere.copernicus.org
fetched_at: '2026-11-18T12:54:52.120664Z'
fetch_provider: builtin
status: draft
type: note
tier: institutional
content_type: paper
deprecated: false
raw_file: raw/enhancing-flood-forecasting-reliability-in-data-scarce-regions-with-a-distribute.pdf
---

1 
 
Enhancing flood forecasting reliability in data-scarce regions with a distributed 
1 
hydrology-guided neural network framework 
2 
Confidence Duku1,2 
3 
1Wageningen Environmental Research, Team Climate Resilience, Wageningen University & Research, 
4 
Wageningen, The Netherlands 
5 
2Earth Systems and Global Change Group, Wageningen University & Research, Wageningen, The 
6 
Netherlands 
7 
Correspondence to: Confidence Duku(confidence.duku@wur.nl)  
8 
 
9 
Abstract 
10 
Flood early warning systems are critical for reducing disaster impacts, yet their effectiveness remains 
11 
limited in data-scarce regions such as Africa and South America. Existing global platforms—including 
12 
GloFAS and the Google Flood Hub—exhibit low reliability in these areas, particularly for rare flood events 
13 
and under strict timing constraints. Here, I demonstrate the potential of a  distributed, hydrology-guided 
14 
neural network framework, Bakaano-Hydro, to enhance flood forecasting reliability in data-scarce regions. 
15 
The proposed framework integrates process-based runoff generation, topographic routing, and a Temporal 
16 
Convolutional Network for streamflow simulation. Using a hindcast-based evaluation across 470 gauging 
17 
stations from 1982 to 2016, I benchmark Bakaano-Hydro’s flood detection skill against GloFAS and Google 
18 
AI model across multiple return periods (1-, 2-, 5-, and 10-year) and timing tolerances (0–2 days). Results 
19 
show that Bakaano-Hydro consistently achieves higher Critical Success Index (CSI), lower False Alarm Rate 
20 
(FAR), and higher Probability of Detection (POD), even under exact-day (0-day) timing constraints. Its 
21 
median CSI scores at 0-day tolerance exceed or match those of GloFAS and Google AI model under more 
22 
lenient timing thresholds. These performance gains are statistically significant across diverse hydroclimatic 
23 
regions, including arid and tropical basins, demonstrating the model’s spatial generalization capacity. By 
24 
coupling physical realism with machine learning generalizability, Bakaano-Hydro provides a reliable, 
25 
interpretable, and open-source tool for enhancing flood forecasting in regions most vulnerable to climate 
26 
extremes and least equipped with observational infrastructure. 
27 
1. Introduction 
28 
Floods are the most frequent and widespread natural disaster globally, accounting for more than 40% of 
29 
all weather-related hazards and affecting over 1.5 billion people between 2000 and 2020 alone (Yaghmaei, 
30 
2020). In 2021, floods caused an estimated $105 billion USD in economic losses worldwide, with Africa, 
31 
https://doi.org/10.5194/egusphere-2025-2294
Preprint. Discussion started: 27 June 2025
c⃝Author(s) 2025. CC BY 4.0 License.


---

2 
 
South-East Asia and Oceania bearing a disproportionate share of fatalities and damage due to weaker 
1 
infrastructure and limited adaptive capacity (AON, 2023). The burden is particularly severe in Africa, where 
2 
more than 75 million people live in high flood-risk zones and simultaneously face extreme poverty 
3 
(Rentschler et al., 2022). Recent catastrophic events in Nigeria, Sudan, South Africa, and Mozambique 
4 
underscore how recurrent flooding exacerbates food insecurity, damages livelihoods, and displaces 
5 
communities—often with cascading socio-economic consequences. 
6 
As climate change intensifies extreme precipitation events, and urbanization continues to encroach upon 
7 
floodplains (Mazzoleni et al., 2022; Tellman et al., 2021), the need for accurate and timely early warning 
8 
systems becomes increasingly urgent. For example, the last twenty years have seen the number of major 
9 
floods more than double (Yaghmaei, 2020). Flood early warning systems can reduce mortality by up to 43% 
10 
(WMO, 2013) and cut economic losses by as much as 50% (Pilon, 2002; Rogers & Tsirkunov, 2011), yet 
11 
these benefits are unevenly distributed. Enhancing the performance of early warning systems in 
12 
developing countries to levels comparable with high-income settings could prevent an estimated 23,000 
13 
deaths annually (Hallegatte, 2012). However, many of the most flood-prone and affected regions lack 
14 
robust national flood early warning systems. This limits governments’ ability to anticipate and respond to 
15 
disasters in a timely manner. As a result, disaster response agencies—including national emergency 
16 
authorities, humanitarian organizations, and international development partners—often depend on global 
17 
flood forecasting platforms such as the Global Flood Awareness System (GloFAS) (Alfieri et al., 2013; Alfieri 
18 
et al., 2020; Harrigan et al., 2023), part of the Copernicus Emergency Management Service and the Google 
19 
Flood Hub (Nearing et al., 2024; Nevo et al., 2022). These systems offer publicly accessible, transboundary 
20 
early warnings and have become essential tools for operational response in data-scarce regions. GloFAS, 
21 
couples weather forecasts with the LISFLOOD model (De Roo et al., 2000), a physically based, fully 
22 
distributed hydrological model in generating flood forecasts. By contrast, the Google AI model incorporates 
23 
weather forecasts into a global data-driven hydrological model (Kratzert et al., 2019), which simulates river 
24 
flows and potential flood events.  
25 
Despite recent advances, the skills of these models in data-scarce regions, are limited and consequently 
26 
forecasts remain unreliable. An evaluation of GloFAS and the Google AI model performance across flood 
27 
events with varying return periods (1-, 2-, 5-, and 10-year) from 1984 to 2022 revealed notably lower 
28 
median performance in Africa and South America compared with Europe and North America (Nearing et 
29 
al., 2024). The skill gap is especially pronounced for rarer flood events, where the models’ reliability 
30 
deteriorates further. The persistent low reliability is particularly concerning given the heightened 
31 
https://doi.org/10.5194/egusphere-2025-2294
Preprint. Discussion started: 27 June 2025
c⃝Author(s) 2025. CC BY 4.0 License.


---

3 
 
vulnerability of communities in these regions, where limited infrastructure, higher poverty rates, and lower 
1 
adaptive capacity amplify the social and economic consequences of flooding (Fox et al., 2024; Sauer et al., 
2 
2024). A key factor underlying poor model performance is the sparse, fragmented observational networks 
3 
in these regions, compounded by issues of data quality, restricted accessibility, and infrastructural 
4 
limitations (Grimes et al., 2022). The process-based modelling approach employed by GloFAS typically 
5 
requires extensive calibration to individual basins and struggles to generalize to ungauged areas. While 
6 
Google AI model’s data-driven approach can potentially learn representations across basins, its lumped 
7 
modeling framework—relying on area-weighted averages of climatic forcings, vegetation, and soil 
8 
attributes—cannot fully capture localized hydrological processes. 
9 
Several methodological advances have been proposed to address the limitations of physically based 
10 
hydrological models in data-scarce regions. Regionalization techniques, which transfer calibrated 
11 
parameters from data-rich to poorly monitored catchments, have been widely adopted, but their 
12 
performance remains limited in climatically heterogeneous or poorly instrumented areas (Beck et al., 2016; 
13 
Guo et al., 2021; Pagliero et al., 2019). Bias correction of meteorological forcings and streamflow, has also 
14 
been proposed to improve the accuracy of forecasts (Crochemore et al., 2016; Tanguy et al., 2025). 
15 
However, bias correction requires long, high-quality historical observations to calibrate correction 
16 
functions, limiting their applicability in regions with sparse or unreliable in-situ data. Similarly, a promising 
17 
direction is data assimilation, particularly the integration of satellite-derived hydrological variables—such 
18 
as soil moisture, snow cover, and river levels—into forecasting models to correct state variables and 
19 
improve flood prediction in regions with limited in-situ observations. (Alfieri et al., 2022; Emerton et al., 
20 
2016; Wongchuig et al., 2024). However, in data-limited regions, the effectiveness of data assimilation is 
21 
often constrained by the coarse resolution and uncertainty of satellite products, scale mismatches, and the 
22 
need for careful tuning and error characterization in the absence of reliable ground-based data. In parallel, 
23 
data-driven models, particularly deep learning architectures such as Long Short-Term Memory (LSTM) 
24 
networks, have demonstrated strong performance in capturing complex, nonlinear rainfall–runoff 
25 
relationships without requiring explicit process parameterization (Feng et al., 2020; Hunt et al., 2022; 
26 
Kratzert et al., 2018). These models have contributed to advances in streamflow prediction and, by 
27 
extension, flood forecasting skill. However, they are often developed using lumped or basin-aggregated 
28 
inputs, lack spatially explicit representation of hydrological processes, and performance tends to degrade 
29 
with increasing basin size (Hunt et al., 2022). Notably, incorporating physical constraints into data-driven 
30 
models has been shown to improve predictive accuracy and enhance robustness across diverse 
31 
hydrological settings (Kratzert et al., 2019). Additionally, accounting for spatial variability in inputs, 
32 
https://doi.org/10.5194/egusphere-2025-2294
Preprint. Discussion started: 27 June 2025
c⃝Author(s) 2025. CC BY 4.0 License.


---

4 
 
particularly rainfall, can further improve the performance of lumped data-driven models (Wang & Karimi, 
1 
2022), highlighting the value of physically informed machine learning approaches that combine data-driven 
2 
flexibility with process-based realism. 
3 
To address the limitations of current flood forecasting systems in data-scarce regions, here, I demonstrate 
4 
the potential of a distributed, hydrology-guided neural network modelling framework to significantly 
5 
enhance forecasting reliability across Africa and South America. The modelling framework uniquely 
6 
integrates physically based hydrological principles with the generalization capacity of machine learning in 
7 
a spatially explicit and physically meaningful way. The framework referred to as Bakaano-Hydro is 
8 
benchmarked against GloFAS and Google AI model. The name Bakaano comes from Fante, a language 
9 
spoken along the southern coast of Ghana. Loosely translated as "by the river side" or "stream-side", it 
10 
reflects the lived reality of many vulnerable riverine communities across the Global South - those most 
11 
exposed to flood risk and often least equipped to adapt. In this study, retrospective simulations (hindcasts) 
12 
are used to evaluate and compare Bakaano-Hydro performance against GloFAS and Google AI model. While 
13 
not true forecasts, these hindcasts serve as a standard proxy for assessing forecasting reliability, as 
14 
commonly done in forecast evaluation and earlier research (e.g. Alfieri et al., 2013; Nearing et al., 2024). 
15 
Accordingly, I use the term 'forecasting reliability' to refer to the skill of models in reproducing observed 
16 
flood events across return periods and timing tolerances using historical input data. The Bakaano-Hydro 
17 
workflow consists of three stages: (1) the estimation of spatially distributed runoff using a land surface 
18 
model designed to capture spatiotemporal variability; (2) routing of this runoff using a topographic flow 
19 
direction algorithm; and (3) prediction of daily streamflow using a temporal neural network trained on 
20 
routed runoff. Observed streamflow data from 643 gauging stations across Africa and South America are 
21 
used for training and evaluation. A single model is employed and trained jointly across Africa and South 
22 
America to enhance spatial generalization. Flood return periods (1-, 2-, 5-, and 10-year events) are 
23 
computed from observed streamflow at each station and consistently applied across Bakaano-Hydro, 
24 
GloFAS, and Google AI model outputs. Critical Success Index (CSI), False Alarm Ratio (FAR), and Probability 
25 
of Detection (POD) metrics are calculated under multiple flood timing tolerances (0, 1, and 2 days) to 
26 
evaluate both detection accuracy and temporal precision. 
27 
 
28 
 
29 
 
30 
https://doi.org/10.5194/egusphere-2025-2294
Preprint. Discussion started: 27 June 2025
c⃝Author(s) 2025. CC BY 4.0 License.


---

5 
 
2. Methods 
1 
2.1 The Bakaano-Hydro modelling framework and data 
2 
The selection of river basins in this study (Figure.1) was guided by the need to evaluate flood forecasting 
3 
skill across a hydroclimatically and geographically diverse set of regions, representative of key challenges 
4 
in data-scarce environments. The basins span a wide range of climatic zones—from humid tropics (e.g., 
5 
Amazon, Congo, Niger) to semi-arid and arid systems (e.g., Volta, Orange, Brazil Northeast, and Rio 
6 
Colorado)—and vary substantially in terms of flood regime, seasonality, land use, and topographic 
7 
complexity. Several basins (e.g., Amazon, Congo, and Niger) are among the largest in the world and are 
8 
subject to recurrent fluvial flooding, while others (e.g., West Africa coastal basins, Brazilian coastal and 
9 
interior basins) represent smaller, flashier catchments prone to localized flood events. Importantly, all 
10 
selected basins are located in regions with limited in-situ hydrometeorological infrastructure, where global 
11 
forecasting systems often perform poorly due to sparse calibration data and limited representation of local 
12 
hydrological processes. This selection enables a robust, spatially explicit evaluation of model generalization 
13 
across diverse flood-generating mechanisms, data conditions, and socio-environmental contexts in the 
14 
Global South. 
15 
In this implementation of the Bakaano-Hydro framework, the VegET method was first employed to 
16 
estimate total runoff.  VegET, primarily designed for actual evapotranspiration estimation, also incorporates 
17 
key hydrological processes such as rainfall interception, runoff generation, and soil moisture storage (Senay, 
18 
2008; Senay et al., 2023). The method operates on a daily time-step, where actual evapotranspiration is 
19 
estimated as a function of the Normalized Difference Vegetation Index (NDVI) and reference 
20 
evapotranspiration. Rainfall interception is estimated as a function of tree cover, herbaceous cover, and 
21 
bare soil fractions, while runoff is computed using a saturation-excess approach, whereby excess soil water 
22 
beyond the field capacity is considered unavailable for plant uptake in the root zone. Daily meteorological 
23 
inputs, including precipitation and temperature (minimum, maximum, and mean), were obtained from the 
24 
CHELSA-W5E5 database a bias-adjusted high resolution global climate dataset derived from CHELSA 
25 
(Climatologies at High Resolution for the Earth’s Land Surface Areas) and adjusted using W5E5 reference 
26 
data (Karger et al., 2023; Karger, 2021). Data availability was limited to the period 1981–2016. NDVI and 
27 
fractional tree and herbaceous cover data spanning 2001–2016 were obtained from Moderate Resolution 
28 
Imaging Spectroradiometer (MODIS) remote sensing products (Didan, 2021; DiMiceli et al., 2015). MODIS-
29 
NDVI products are unavailable for periods before 2001. Following the VegET procedure, a daily mean 
30 
https://doi.org/10.5194/egusphere-2025-2294
Preprint. Discussion started: 27 June 2025
c⃝Author(s) 2025. CC BY 4.0 License.


---

6 
 
climatology of NDVI  was established with linear interpolation. Tree cover and herbaceous cover fractions 
1 
were also obtained from MODIS (DiMiceli et al., 2015) for the period 2001 – 2016. MODIS tree cover and 
2 
herbaceous cover products are unavailable for periods before 2001. Annual mean tree cover and 
3 
herbaceous cover fractions were then computed over this time period and were used in runoff estimation. 
4 
Soil properties, including wilting point, field capacity, and saturation, were obtained from SoilGrids 
5 
database, which is a global soil information system that provides predictions of standard soil properties at 
6 
multiple depths and at high resolution (Poggio et al., 2021). Digital Elevation Model (DEM) was sourced 
7 
from HydroSHEDS database (Lehner et al., 2008), which provides hydrologically corrected topographic 
8 
data. All input datasets were resampled to 1km2 resolution, matching the spatial resolution of climate data. 
9 
Total runoff was computed for the 1981–2016 period, consistent with the availability of climate input data. 
10 
Potential evapotranspiration as part of VegET was estimated using the Hargreaves equation (Hargreaves & 
11 
Samani, 1985). Further details on the VegET model and its parameterizations are available in Senay et al. 
12 
(2023).  
13 
 
14 
Figure 1. Basins for which observed streamflow data were used in training, evaluating and computing 
15 
reliability metrics of Bakaano-Hydro. Basin delineation were obtained from HydroSHEDS (Lehner et al., 
16 
2008). Brazil northeast basins,  Brazil coastal basins and West Africa coastal basins are not recognized 
17 
names but refer to group of smaller basins in the named locations that have been aggregated for the 
18 
purpose of this study. 
19 
 
20 
https://doi.org/10.5194/egusphere-2025-2294
Preprint. Discussion started: 27 June 2025
c⃝Author(s) 2025. CC BY 4.0 License.


---

7 
 
The second phase of Bakaano-Hydro is the flow routing phase which bridges empirical or physically based 
1 
surface runoff generation with data-driven streamflow prediction. In this analysis, daily runoff was routed 
2 
through the river channel network using the weighted flow accumulation method based on the multiple 
3 
flow direction approach (Quinn et al., 1991). This routing scheme distributes flow from each cell to up to 
4 
eight neighboring cells, with partitioning proportional to the elevation gradient between cells. For each of 
5 
the 470 gauging stations, routed runoff time-series were extracted from the river network to facilitate 
6 
further analysis. Routed runoff time-series are extracted based on the longitude and latitude of the gauging 
7 
station. To allow for distortions in geometry and provide tolerance, the coordinates are snapped to the 
8 
river network. 
9 
The final phase of Bakaano-Hydro involves the application of a deep learning model to simulate streamflow. 
10 
To capture the complex, nonlinear relationships between routed runoff and streamflow a Temporal 
11 
Convolutional Network (TCN) was employed. TCNs are a class of deep learning models designed for 
12 
sequence modeling tasks and are based on one-dimensional causal convolutions with dilated filters, 
13 
allowing the network to efficiently capture long-range temporal dependencies while maintaining a fixed 
14 
input length and avoiding information leakage from future timesteps  (Bai et al., 2018). Compared to LSTM 
15 
networks, which rely on recurrent structures and hidden states passed sequentially through time, TCNs 
16 
use convolutional layers that process entire sequences in parallel. This leads to faster training times, greater 
17 
stability during optimization, and better scalability to long input sequences, especially in large 
18 
spatiotemporal datasets. Additionally, TCNs avoid issues commonly associated with recurrent networks, 
19 
such as vanishing gradients and limited interpretability of memory cells. In the context of Bakaano-Hydro, 
20 
TCNs are particularly advantageous because they can efficiently model multi-scale temporal patterns in the 
21 
routed runoff time series across hundreds of locations, while enabling the use of a shared model 
22 
architecture for diverse river basins. Their ability to learn temporal features over fixed receptive fields, 
23 
combined with their parallelizability and robustness, makes TCNs a suitable and scalable choice for 
24 
simulating streamflow from spatially distributed runoff inputs in data-limited, flood-prone regions. In 
25 
Bakaano-Hydro, the TCN architecture is configured to utilize a hindcast sequence of 365 days to predict 
26 
daily streamflow. The architecture consists of two input branches, both employing TCN layers to process 
27 
dynamic and static variables. The first input branch processes nine variables—three dynamic and six 
28 
static—standardized across all 643 stations in Africa and South America using z-score normalization. 
29 
Dynamic variables include routed runoff extracted at gauging stations, augmented by dividing by the 
30 
upstream contributing area (in grid cells) and the depth-to-water index. Static variables include the 
31 
upstream contributing area, depth-to-water index, and sine-cosine transformations of station latitude and 
32 
https://doi.org/10.5194/egusphere-2025-2294
Preprint. Discussion started: 27 June 2025
c⃝Author(s) 2025. CC BY 4.0 License.


---

8 
 
longitude to encode spatial periodicity. The static variables were repeated across the entire duration of the 
1 
dynamic variables. The second branch processes station-specific routed runoff data, scaled by the 
2 
maximum daily routed runoff across all stations within the basin and log-transformed to reduce skewness. 
3 
TCN layers employ dilation rates of 2, 4, 8, 16, 32, 64, 128, and 256, capturing temporal dependencies 
4 
across multiple timescales. The outputs from the two TCN branches are concatenated and further 
5 
processed through dense layers to establish full connectivity, integrating global and station-specific runoff-
6 
streamflow relationships. Observed streamflow data were sourced from the Global Runoff Data Centre 
7 
(GRDC) (GRDC, 2025) and included gauging stations across Africa and South America with at least five years 
8 
of data. The training period covered 1989–2016, while model validation was conducted for the 1982–1988 
9 
period. Only hydrological stations with observed streamflow record of at least five years were used in the 
10 
training of the model.  
11 
2.2 Benchmark data from GloFAS and Google AI model 
12 
The Google AI model builds on previous LSTM-based nowcasting approaches by employing an encoder–
13 
decoder LSTM architecture and area-weighted averages over basin polygons over the total upstream area 
14 
of each gauge or prediction point. The model was trained using data from 5680 stations across the globe 
15 
(Nearing et al., 2024). The Google AI model data used here were derived from a full model run 
16 
encompassing all stations, rather than the cross-validation splits reported in Nearing et al. (2024). The 
17 
streamflow predictions are right-labeled, meaning the predicted value at day t corresponds to the 
18 
observation at day t – 1. To ensure consistency, we relabeled their predictions to match the observation 
19 
timestamps used in our dataset. 
20 
GloFAS data are from GloFAS version 4, which is the latest version as at the time of submission. As part of 
21 
GloFAS, the LISFLOOD OS model, implemented at a 0.05-degree quasi-global resolution  was calibrated 
22 
using in-situ discharge data from 1,996 stations with drainage areas of at least 500 km² and observation 
23 
records post-1980. These stations were calibrated using the Distributed Evolutionary Algorithm for Python 
24 
(Fortin et al., 2012). Parameter values for ungauged catchments estimated through regionalization 
25 
(Grimaldi, 2024). 
26 
2.3 Estimation of flow thresholds for multiple return periods 
27 
A common subset of 470 hydrological stations was identified across Bakaano-Hydro, GloFAS, and Google 
28 
AI model to enable consistent model evaluation. Return periods for these stations were estimated using 
29 
observed streamflow records from the GRDC database. The estimation followed a modular approach based 
30 
https://doi.org/10.5194/egusphere-2025-2294
Preprint. Discussion started: 27 June 2025
c⃝Author(s) 2025. CC BY 4.0 License.


---

9 
 
on the U.S. Geological Survey (USGS) Bulletin 17C guidelines (England Jr et al., 2018), incorporating 
1 
procedures for annual peak extraction, low outlier treatment, and frequency distribution fitting. Flow 
2 
thresholds corresponding to the 1-, 2-, 5-, and 10-year return periods were computed and applied 
3 
uniformly across model outputs to evaluate flood detection skill.. The methodology comprises three main 
4 
components: (1) extraction of peak flows, (2) identification and treatment of potentially influential low 
5 
floods (PILFs), and (3) return period estimation using either parametric or empirical approaches. Peak flows 
6 
were extracted from continuous daily discharge records using the annual maximum series (AMS) method. 
7 
This method identifies the single highest discharge in each water year and is the standard recommended 
8 
by England Jr et al. (2018). The water year is defined such that it ends in September, aligning with typical 
9 
hydrological year definitions in the Northern Hemisphere. A minimum data completeness threshold of 50% 
10 
of the expected daily observations per year was imposed to ensure robustness. To mitigate the influence 
11 
of potentially impactful low floods (PILFs), we employed the Grubbs-Beck Test (GBT) as described in 
12 
England Jr et al. (2018). This test detects low outliers by comparing observations against a lower threshold 
13 
derived from sample mean and standard deviation, using critical values from a tabulated KN statistic. Data 
14 
points below the threshold were flagged as PILFs and subsequently censored using a left-censoring 
15 
approach during distribution fitting. The PILF threshold was defined as the midpoint between the largest 
16 
outlier and the smallest non-outlier. For stations with insufficient sample size to run the GBT (i.e., fewer 
17 
than 10 observations), no censoring was applied. 
18 
The primary method employed was the Generalized Expected Moments Algorithm (GEMA) for fitting a log-
19 
Pearson Type III distribution, following the full procedure described in England Jr et al. (2018). This iterative 
20 
method jointly estimates distribution parameters (shape α, scale β, and location τ) from censored and 
21 
uncensored data by aligning sample and distribution moments. Convergence was achieved when the L1 
22 
norm of moment differences fell below a threshold of (1e−10). PILFs were incorporated as left-censored 
23 
values below the GBT-derived threshold. This method is particularly suited to datasets with both low 
24 
outliers and log-normality. In cases where the user explicitly disabled GEMA or when GEMA failed to 
25 
converge, we applied standard moment-based fitting of a log-Pearson III distribution without PILF 
26 
treatment. This approach estimates distribution parameters directly from the log-transformed sample 
27 
mean, standard deviation, and skewness (England Jr et al., 2018). As a fallback for short time series or when 
28 
moment-based fitting was numerically unstable, we estimated return periods using a log-log linear 
29 
regression between observed flow magnitudes and empirical exceedance probabilities. Exceedance 
30 
probabilities were computed using the Weibull plotting position formula. While this empirical method lacks 
31 
https://doi.org/10.5194/egusphere-2025-2294
Preprint. Discussion started: 27 June 2025
c⃝Author(s) 2025. CC BY 4.0 License.


---

10 
 
the theoretical rigor of the log-Pearson III distribution, it provides a practical option for very limited 
1 
samples. 
2 
2.4 Estimation of flood forecasting reliability metrics  
3 
CSI, FAR and POD were used as a measure of reliability and were computed over the period 1982 – 2016. 
4 
The streamflow thresholds were applied to the simulated streamflow data from GloFAS, Google AI model 
5 
and Bakaano-Hydro. Based on this, a model's prediction of an event with a given return period was 
6 
considered correct if both the modeled and observed hydrographs exceeded their respective return period 
7 
threshold flow values within defined timing tolerance. We used three flood timing tolerance which define 
8 
the permissible temporal deviation between observed and predicted flood events when evaluating model 
9 
performance. In the 0-day timing tolerance, a predicted flood event must occur on the exact day of the 
10 
observed event to be considered a match; the 1-day timing tolerance allows for a match if a predicted flood 
11 
occurs within one day (before or after) of the observed event and the 2-day timing tolerance extends the 
12 
matching period to two days. CSI is computed as 𝑇𝑃/(𝑇𝑃+ 𝐹𝑃+ 𝐹𝑁); POD is 𝑇𝑃/(𝑇𝑃+ 𝐹𝑁) and  FAR is 
13 
computed as  𝐹𝑃/(𝑇𝑃+ 𝐹𝑃) where TP is True Positive describing correctly predicted flood events for a 
14 
specified return period and flood timing tolerance; FP is False Positives describing predicted flood events 
15 
that are not in observed data; and FN is False Negatives describing flood events in the observed data but 
16 
were not predicted. 
17 
3. Results 
18 
3.1 Performance of Bakaano-Hydro 
19 
Out-of-sample validation (Figure 2) demonstrates that the Bakaano-Hydro framework achieves strong and 
20 
spatially consistent performance across major basins in Africa and South America. Median values of Nash-
21 
Sutcliffe Efficiency (NSE), Kling-Gupta Efficiency (KGE) exceed 0.5 in most basins, indicating robust 
22 
agreement between simulated and observed streamflow. Performance remains high even in log-
23 
transformed variants of NSE and KGE, reflecting the model’s ability to capture both high- and low-flow 
24 
regimes. Evaluation metrics assessing bias (Alpha-NSE) and variability (Beta-KGE) are close to 1.0 across 
25 
most regions, suggesting accurate representation of both amplitude and temporal dynamics of flow. 
26 
Crucially, this out-of-sample validation ensures that the model's skill reflects true generalization rather than 
27 
overfitting to known conditions—an essential distinction in the context of flood forecasting, where 
28 
performance metrics often involve comparisons across both training or calibration and test periods due to 
29 
https://doi.org/10.5194/egusphere-2025-2294
Preprint. Discussion started: 27 June 2025
c⃝Author(s) 2025. CC BY 4.0 License.


---

11 
 
limited data availability. By validating against held-out time periods, we demonstrate that Bakaano-Hydro 
1 
is not merely replicating known hydrological patterns, but can generalize in previously unseen contexts. 
2 
This enhances the robustness of our benchmarking framework, enabling a fair and unbiased comparison 
3 
with global systems such as GloFAS and the Google AI model. Figure A1 and A2 also compares the 
4 
hydrograph of Bakaano-Hydro predicted streamflow against GloFAS and Google AI model for the period 
5 
1982 – 2016, which covers both the training and testing period. 
6 
 
7 
 
8 
Figure 2. Out-of-sample evaluation (1982–1988) of Bakaano-Hydro performance across all 470 hydrological 
9 
stations used in the forecasting reliability assessment. Stations are grouped by basin, with dashed white 
10 
lines indicating basin boundaries. The heatmap displays multiple evaluation metrics, including Nash–
11 
Sutcliffe Efficiency (NSE), Kling–Gupta Efficiency (KGE), log-NSE, and extended variants such as Beta-KGE, 
12 
Alpha-NSE, and Beta-NSE (Gupta et al., 2009). The color scale ranges from red (lower performance) to blue 
13 
(higher performance), enabling visual comparison of skill across metrics and basins.  
14 
 
15 
 
16 
https://doi.org/10.5194/egusphere-2025-2294
Preprint. Discussion started: 27 June 2025
c⃝Author(s) 2025. CC BY 4.0 License.


---

12 
 
3.2 Model intercomparison of flood forecasting reliability 
1 
Three metrics—probability of detection (POD), false alarm rate (FAR), and critical success index (CSI)—were 
2 
employed to assess reliability of the proposed framework. POD quantifies the proportion of observed flood 
3 
events accurately predicted by the models, FAR measures the rate of false positives (incorrect flood 
4 
predictions), and CSI evaluates overall prediction accuracy by accounting for true positives and false alarms. 
5 
Hindcast skill, assessed through CSI, POD, and FAR, is used as a measure of forecasting reliability. This 
6 
hindcasting serves as a proxy for operational forecasting reliability, helping to identify strengths and 
7 
limitations in each model’s performance and informing future flood predictions. The use of hindcast skill 
8 
as a measure of forecast reliability is a standard practice in climate and hydrological forecasting. 
9 
Similar retrospective evaluations have been conducted to compare GloFAS and Google's AI model (Nearing 
10 
et al., 2024), with GloFAS itself relying on historical streamflow simulations to validate its forecast skill 
11 
(Alfieri et al., 2013). CSI, POD and FAR values for flood events with 1-, 2-, 5-, and 10-year return periods 
12 
and 0-, 1- and 2-day timing tolerance were calculated using simulated data from Bakaano-Hydro for the 
13 
period 1982 to 2016. Timing tolerances are permissible temporal deviations between observed and 
14 
simulated flood events. Performance was benchmarked against GloFAS and the Google AI model; notably, 
15 
the Google AI model data used here were derived from a full model run encompassing all stations, rather 
16 
than the cross-validation splits reported in Nearing et al. (2024). To ensure sufficient data for calculating 
17 
return-period thresholds, we included both training and out-of-sample streamflow predictions from each 
18 
model similar to Nearing et al. (2024) and Alfieri et al. (2013). A common subset of stations across the 
19 
three models (470 stations in total) was selected for the calculation of these metrics. Return period 
20 
thresholds were computed from observed data at each station and applied uniformly to the predictions of 
21 
all models.  
22 
The results show that the median CSI scores of Bakaano-Hydro at a 0-day timing tolerance are comparable 
23 
to or exceed those of GloFAS at 1-day and 2-day timing tolerance, and are comparable to Google AI model’s 
24 
1-day timing tolerance CSI scores for every return period examined (Figure 3). The median scores of 
25 
Bakaano-Hydro at 1-day timing tolerance are also higher than that of Google AI model at 2-day timing 
26 
tolerance. These indicate substantial improvement in temporal precision of flood detection by Bakaano-
27 
Hydro. Figure 3 also reveals important differences in the reliability and variability of flood predictions from 
28 
GloFAS, Google AI model, and Bakaano-Hydro, as illustrated by the shapes and ranges of their CSI 
29 
distributions across Africa and South America. For GloFAS, the distribution skews markedly toward lower 
30 
CSI values—particularly under stricter timing conditions (e.g., the 0-day timing tolerance) and at higher  
31 
https://doi.org/10.5194/egusphere-2025-2294
Preprint. Discussion started: 27 June 2025
c⃝Author(s) 2025. CC BY 4.0 License.


---

13 
 
 
1 
Figure 3. Comparison of the CSI distribution for multiple return period flood events across three models—
2 
GloFAS, Google, and Bakaano-Hydro—under different timing tolerances (0-day, 1-day, and 2-day) in Africa 
3 
and South America. Each panel presents half violin plot, boxplots and density plots to visualize the 
4 
distribution of CSI values. The boxplot shows distribution quartiles and whiskers show the full range; the 
5 
points show the distribution for the gauging stations and the half-violin plots.  
6 
https://doi.org/10.5194/egusphere-2025-2294
Preprint. Discussion started: 27 June 2025
c⃝Author(s) 2025. CC BY 4.0 License.


---

14 
 
return periods—indicating consistently weak performance and a narrow range of outcomes. In contrast, 
1 
the Google AI model displays broader distributions, generally clustering within a lower-to-mid CSI range. 
2 
While it slightly outperforms GloFAS, its performance still declines considerably for rarer, more extreme 
3 
flood events (e.g., from 1-year to 5-year return periods). Notably, Bakaano-Hydro exhibits a wider and more 
4 
balanced distribution, with peaks shifting toward higher CSI values, reflecting a greater overall capacity for 
5 
reliable flood prediction. Although Bakaano-Hydro’s broader spread indicates some variability—meaning 
6 
its performance can occasionally align with lower CSI values—the model consistently demonstrates higher 
7 
median CSI scores than GloFAS and Google AI model. As timing tolerances expand from 0  to 2 days, all 
8 
three models show higher CSI values, signaling that relaxing the timing tolerance can enhance apparent 
9 
predictive skill. Statistical testing show that Bakaano-Hydro’s superior CSI  scores over GloFAS and Google 
10 
AI model are significant in all return periods and timing tolerances. Comparing Bakaano-Hydro and GloFAS, 
11 
p-values ranged from 5.8 x 10-46(Cohen’s d =  0.64) to 7.0 x 10-11 (Cohen’s d = 0.19) and from 1.28 x 10-32 
12 
(Cohen’s d = 0.29) to 3.5 x 10-4 (Cohen’s d = 0.065) for Bakaano-Hydro and Google AI model. 
13 
Across all return periods and timing tolerances, the patterns in FAR (Figure 4) and POD (Figure 5) highlight 
14 
important trade-offs that ultimately shape the CSI for each model. For all models, FAR decreases and POD 
15 
increases as the timing tolerance widens (1–2 days). GloFAS consistently exhibits the highest FAR, 
16 
particularly for shorter return periods and under strict (0-day) timing tolerances, indicating frequent over-
17 
prediction (i.e., many false alarms). Simultaneously, GloFAS shows the lowest POD, suggesting relatively 
18 
few correct detections (hits) and a larger number of misses. This high FAR coupled with low detection 
19 
directly hinders its CSI, which accounts for both misses and false alarms. By contrast, the Google AI model 
20 
demonstrates moderate FAR levels and a broader range of POD outcomes. Nonetheless, the model’s POD 
21 
remains more variable and still includes lower-probability detections, especially for shorter return periods. 
22 
Finally, Bakaano-Hydro attains the strongest performance across these metrics: it consistently maintains 
23 
the lowest FAR and the highest POD. Even under strict 0-day timing tolerances, Bakaano-Hydro’s false 
24 
alarms remain minimal, and it achieves more hits relative to misses than the other models do.  
25 
Statistical testing show that Bakaano-Hydro’s decrease in FAR and increase in POD scores over GloFAS and 
26 
Google AI model are significant in all return periods and timing tolerances with p-values substantially lower 
27 
than 0.05. Cohen’s d analyses underscore substantial effect sizes favoring Bakaano-Hydro (ranging from 0.2 
28 
to 0.8), most pronounced in comparisons with GloFAS. For FAR, statistical testing of Bakaano-Hydro and 
29 
GloFAS showed p-values ranging from 8.74 x 10-35 (Cohen’s d = -0.65) to 1.6 x 10-9 (Cohen’s d = -0.35) and 
30 
p values ranging from 2.14 x 10-23 (Cohen’s d = -0.41) to 1.38 x 10-5 (Cohen’s d = -0.25) for Bakaano-Hydro  
31 
https://doi.org/10.5194/egusphere-2025-2294
Preprint. Discussion started: 27 June 2025
c⃝Author(s) 2025. CC BY 4.0 License.


---

15 
 
 
1 
Figure 4. Comparison of the FAR distribution for multiple return period flood events across three models—
2 
GloFAS, Google, and Bakaano-Hydro—under different timing tolerance  (0-day, 1-day, and 2-day) in Africa 
3 
and South America. Each panel presents half violin plot, boxplots and density plots to visualize the 
4 
distribution of FAR values. The boxplot shows distribution quartiles and whiskers show the full range; the 
5 
points show the distribution for the gauging stations and the half-violin plots.  
6 
https://doi.org/10.5194/egusphere-2025-2294
Preprint. Discussion started: 27 June 2025
c⃝Author(s) 2025. CC BY 4.0 License.


---

16 
 
and Google AI model. For POD, statistical testing of Bakaano-Hydro and GloFAS showed p-values ranging 
1 
from 1.30 x 10-55 (Cohen’s d = 1.03) to 6.2 x 10-17 (Cohen’s d = 0.48)  and p-values ranging from 2.2 x 10-46 
2 
(Cohen’s d = 0.82) to 1.2 x 10-10 (Cohen’s d = 0.35)  for Bakaano-Hydro and Google AI model.  
3 
3.3 Spatial variability in forecasting reliability across hydroclimatic regions 
4 
Across diverse hydro-climatic contexts, the performance of GloFAS, the Google AI model, and Bakaano-
5 
Hydro in predicting fluvial flooding varies notably, reflecting local hydrological complexities. Overall, 
6 
Bakaano-Hydro outperforms GloFAS and Google AI model across diverse hydroclimatic areas with the 
7 
improved performance in most basins statistically significant (Figures 6 and 7). Google AI model also shows 
8 
strong predictive skill across diverse basins, albeit under 2-day timing tolerance. GloFAS, being a physically-
9 
based model, tends to perform well in larger, more predictable river basins but struggles in basins with 
10 
highly dynamic hydrological patterns. 
11 
Generally, across all models performance is lower in semi-arid to arid areas and higher in humid and 
12 
tropical areas. In semi-arid to arid regions—such as the Niger, Orange, Namibia coastal basins— 
13 
performance across all models is generally lower, with CSI values indicating difficulty in capturing the 
14 
intermittent and highly variable river flows, driven by extreme upstream rainfall that causes rapid river-
15 
level rises, high transmission losses, and complex flood propagation. In these settings, GloFAS exhibits the 
16 
lowest CSI values mainly because of the highest false alarm rates, indicating an overestimation of flood 
17 
risk, while the Google AI model offers improved detection. Bakaano-Hydro outperforms GloFAS and Google 
18 
AI model in these settings with relatively higher CSI values. Figures 6 and 7 show the basins for which 
19 
differences in CSI and FAR were statistically significant. 
20 
https://doi.org/10.5194/egusphere-2025-2294
Preprint. Discussion started: 27 June 2025
c⃝Author(s) 2025. CC BY 4.0 License.


---

17 
 
 
1 
Figure 5. Comparison of the POD distribution for multiple return period flood events across three models—
2 
GloFAS, Google, and Bakaano-Hydro—under different timing tolerance  (0-day, 1-day, and 2-day) in Africa 
3 
and South America. Each panel presents half violin plot, boxplots and density plots to visualize the 
4 
distribution of POD values. The boxplot shows distribution quartiles and whiskers show the full range; the 
5 
points show the distribution for the gauging stations and the half-violin plots.  
6 
https://doi.org/10.5194/egusphere-2025-2294
Preprint. Discussion started: 27 June 2025
c⃝Author(s) 2025. CC BY 4.0 License.


---

18 
 
 
1 
Figure 6 Heatmaps of median CSI values for river basins across Africa and South America. a) shows 
2 
heatmaps for floods with 1-year return period; b) floods with 2-year return periods; c) floods with 5-year 
3 
return periods. For each plot only basins for which differences among the three models were statistically 
4 
significant are  shown. Brazil NorthEast basins, Brazil_Coastal and WA coastal basins are not officially 
5 
recognized basin names but are used in this paper to refer to a group of small basins in Brazil and West 
6 
Africa.  
7 
 
8 
In tropical and equatorial climates, such West Africa coastal basins, the Congo, and the Amazon basins, 
9 
prolonged and intense rainfall from monsoonal and convective systems introduces another layer of 
10 
complexity. Spatially variable rainfall, seasonal soil saturation, and delayed flood wave propagation in large 
11 
river systems often lead to overprediction by GloFAS and the Google AI model, as evidenced by higher FAR 
12 
and moderate CSI. In temperate and subtropical basins such as the Paraná and Tocantins, models show 
13 
consistent performance improvements with longer timing tolerances, indicating better predictability of 
14 
hydrological events in these regions. GloFAS performs better in these regions compared to arid areas, 
15 
reflecting its suitability for regions with relatively predictable seasonal cycles.  
16 
https://doi.org/10.5194/egusphere-2025-2294
Preprint. Discussion started: 27 June 2025
c⃝Author(s) 2025. CC BY 4.0 License.


---

19 
 
 
1 
Figure 7. Heatmaps of median FAR values for river basins across Africa and South America. . a) shows 
2 
heatmaps for floods with 1-year return period; b) floods with 2-year return periods; c) floods with 5-year 
3 
return periods. For each plot, only basins for which differences among the three models were statistically 
4 
significant are  shown. Brazil NorthEast basins, Brazil_Coastal and WA coastal basins are not officially 
5 
recognized basin names but are used in this paper to refer to a group of small basins in Brazil and West 
6 
Africa.  
7 
 
8 
4. Discussion  
9 
The results of this study demonstrate that the distributed hydrology-guided neural network framework 
10 
significantly improves the reliability of flood forecasts in hydrologically diverse, data-scarce regions. Across 
11 
a range of flood return periods, the model achieves higher CSI values and maintains lower FAR and higher 
12 
probability of detection (POD) than both GloFAS and the Google AI model. Notably, Bakaano-Hydro 
13 
outperforms GloFAS and Google AI model under precise timing constraints. Its performance at 0-day timing 
14 
tolerance exceeds or matches GloFAS’ performance at 2-day and Google AI model performance at 1-day 
15 
timing tolerance. This enhanced temporal precision is critical for real-time flood early warning, especially 
16 
in regions with high vulnerability and limited emergency response capacity. Importantly, in this paper, I 
17 
https://doi.org/10.5194/egusphere-2025-2294
Preprint. Discussion started: 27 June 2025
c⃝Author(s) 2025. CC BY 4.0 License.


---

20 
 
adopt a consistent benchmarking methodology by using observed streamflow data to define flood 
1 
thresholds across all models—unlike model-specific thresholds that can artificially inflate or deflate 
2 
performance metrics (e.g. Nearing et al., 2024). This evaluation approach enables a more objective and 
3 
physically meaningful comparison, ensuring that improvements in forecast skill are attributable to model 
4 
behavior rather than calibration biases. 
5 
Bakaano-Hydro contributes a new paradigm to the field of hydrological modeling by demonstrating that 
6 
fully distributed, process-informed neural networks can reliably simulate streamflow and flood dynamics. 
7 
It advances the state of the art in data-driven hydrological modelling by integrating process-based runoff 
8 
generation and topographic flow routing with a deep learning architecture capable of generalizing across 
9 
basins, climatic zones, and hydrological regimes. This overcomes existing trade-off between physical 
10 
realism and data-driven scalability, offering a unified approach that performs well even in environments 
11 
with limited or fragmented observational records. A key scientific insight is that Bakaano-Hydro achieves 
12 
increased reliability despite being trained only on data from Africa and South America, regions typically 
13 
underrepresented in global hydrological training datasets. In contrast, the Google AI model (Nearing et al., 
14 
2024) model draws on global data, including from data-rich regions such as Europe, North America, and 
15 
Australia. That Bakaano-Hydro performs better or comparably—particularly in Africa and South America—
16 
highlights not only the framework’s efficiency in learning from sparse, heterogeneous data but also the 
17 
advantages of physically guided spatial representation over lumped learning schemes.  
18 
The development and evaluation of Bakaano-Hydro has far-reaching implications for climate resilience, 
19 
disaster risk reduction, and sustainable development, particularly in the Global South. By offering a 
20 
distributed, interpretable, and generalizable modeling framework, Bakaano-Hydro bridges a critical gap 
21 
between global early warning systems and locally relevant flood risk information—a gap that has 
22 
historically undermined emergency preparedness in data-scarce regions. For national governments and 
23 
hydrometeorological agencies, Bakaano-Hydro offers a pathway toward strengthening domestic early 
24 
warning capacity without requiring dense monitoring networks or extensive model calibration. Its modular 
25 
and open-source architecture enables customization for local use cases—whether for national disaster 
26 
response systems, basin authorities, or regional climate services. This opens up the possibility of 
27 
transitioning from dependency on external, often coarse-resolution forecasts (like GloFAS or Google AI 
28 
model) to context-specific, high-resolution models that are co-developed and owned by local institutions. 
29 
For the humanitarian and development sector, Bakaano-Hydro provides a decision-support tool for 
30 
anticipatory action, allowing earlier and more precise deployment of flood relief, social protection 
31 
https://doi.org/10.5194/egusphere-2025-2294
Preprint. Discussion started: 27 June 2025
c⃝Author(s) 2025. CC BY 4.0 License.


---

21 
 
schemes, and infrastructure safeguards. Its ability to generalize to ungauged basins also supports climate 
1 
adaptation planning and nature-based solutions, such as ecosystem restoration in floodplains and 
2 
watershed management. At the global scale, Bakaano-Hydro advances the science-policy interface by 
3 
demonstrating that physically informed machine learning models can be both scalable and regionally 
4 
accurate—paving the way for hybrid forecasting systems that serve diverse geographies, socio-economic 
5 
contexts, and governance capacities. From a scientific standpoint, the framework opens new pathways for 
6 
interpretable machine learning in hydrology. By using runoff as an intermediate, physically meaningful 
7 
variable, Bakaano-Hydro avoids the black-box pitfalls of purely statistical models and supports diagnostic 
8 
evaluation of model behavior. The architecture also enables flexible experimentation with modular 
9 
components—allowing researchers to test how different land surface models or routing schemes influence 
10 
predictive performance across space and time. Operationally, Bakaano-Hydro offers a practical and scalable 
11 
solution for flood forecasting in regions with limited data infrastructure, where conventional physically 
12 
based models struggle to calibrate, and global lumped models fail to resolve local dynamics. 
13 
 
14 
A primary limitation of the current study is its use of historical observed discharge records rather than true 
15 
forecast or reforecast datasets. While this retrospective analysis enables rigorous comparison across 
16 
models and return periods, it does not fully capture the operational uncertainties present in real-time 
17 
forecasting—such as delays in data assimilation, atmospheric forecast errors, or recent changes in land use 
18 
and hydraulic infrastructure. Moreover, under ongoing climate change, stationarity assumptions may 
19 
become less valid, potentially limiting the relevance of hindcasting performance as a predictor of future 
20 
skill. Nonetheless, the long-term, multi-basin dataset used in this study spans a wide range of hydrological 
21 
conditions and extreme events, offering a robust foundation for model validation. A model that performs 
22 
reliably across these historical extremes is well-positioned to adapt to future conditions when coupled with 
23 
evolving inputs such as satellite rainfall data and climate forecast ensembles. 
24 
5. Conclusion 
25 
This study demonstrates the potential of a distributed, hydrology-guided neural network framework that 
26 
integrates process-based runoff generation, topographic flow routing, and temporal convolutional 
27 
networks to improve flood forecasting reliability in data-scarce regions. The framework—Bakaano-Hydro—
28 
was benchmarked against GloFAS and the Google AI model using retrospective simulations across 470 
29 
gauging stations in Africa and South America. Results show that Bakaano-Hydro consistently achieves 
30 
higher forecasting reliability across multiple flood return periods and timing tolerances. Statistically 
31 
https://doi.org/10.5194/egusphere-2025-2294
Preprint. Discussion started: 27 June 2025
c⃝Author(s) 2025. CC BY 4.0 License.


---

22 
 
significant improvements in critical reliability metrics, including the critical success index (CSI), probability 
1 
of detection (POD), and false alarm rate (FAR), indicate the model’s robustness in capturing both the 
2 
occurrence and timing of flood events. 
3 
Importantly, Bakaano-Hydro advances the state of data-driven hydrological modeling by embedding 
4 
physically meaningful processes within a neural network architecture. This hybrid approach addresses key 
5 
limitations of lumped data-driven models and calibration-intensive physically based systems, offering a 
6 
generalizable and interpretable alternative suited to diverse hydroclimatic contexts. The ability of the 
7 
framework to generalize from sparse training data, while maintaining physically plausible representations 
8 
of runoff and flow routing, highlights its potential to support robust hydrological analysis in observationally 
9 
limited settings. Overall, Bakaano-Hydro contributes a methodologically rigorous and scientifically 
10 
grounded step forward in the development of hybrid flood forecasting models. 
11 
Code availability 
12 
Source codes for Bakaano-Hydro are available at https://github.com/confidence-duku/bakaano-hydro. 
13 
The neural network architecture in this version was adapted for this study and can be found at 
14 
https://doi.org/10.5281/zenodo.15322955. All codes for Bakaano-Hydro evaluation and return period 
15 
estimation can be found at  
16 
https://github.com/google-research-datasets/global_streamflow_model_paper.  
17 
Data availability 
18 
Daily streamflow data for 1982 – 2016 simulated for hydrological stations across Africa and South America 
19 
as well as validation and CSI, POD, FAR results are available at https://doi.org/10.5281/zenodo.15322955. 
20 
GloFAS and Google AI model benchmark data are available at https://doi.org/10.5281/zenodo.10397664  
21 
Competing interests 
22 
The authors declare that they have no conflict of interest. 
23 
 
24 
 
25 
 
26 
https://doi.org/10.5194/egusphere-2025-2294
Preprint. Discussion started: 27 June 2025
c⃝Author(s) 2025. CC BY 4.0 License.


---

23 
 
Appendix A 
1 
 
2 
Figure A1. Comparison of cumulative distribution functions (CDFs) of hydrological performance metrics 
3 
across values for the three models -  GloFAS, Google AI model, and Bakaano-Hydro -  for the period 1982 
4 
- 2016. Metrics include Nash-Sutcliffe Efficiency (NSE), Kling-Gupta Efficiency (KGE), log-NSE and 
5 
additional variants such as Beta-KGE, Alpha-NSE and Beta-NSE 
6 
https://doi.org/10.5194/egusphere-2025-2294
Preprint. Discussion started: 27 June 2025
c⃝Author(s) 2025. CC BY 4.0 License.


---

24 
 
 
1 
Figure A2. Comparison of probability density functions (PDFs) of hydrological performance metrics across 
2 
values for the three models -  GloFAS, Google AI model, and Bakaano-Hydro -  for the period 1982 - 2016. 
3 
Metrics include Nash-Sutcliffe Efficiency (NSE), Kling-Gupta Efficiency (KGE), log-NSE and additional 
4 
variants such as Beta-KGE, Alpha-NSE and Beta-NSE 
5 
 
6 
 
7 
References 
8 
Alfieri, L., Avanzi, F., Delogu, F., Gabellani, S., Bruno, G., Campo, L., Libertino, A., Massari, C., Tarpanelli, A., 
9 
Rains, D., Miralles, D. G., Quast, R., Vreugdenhil, M., Wu, H., & Brocca, L. (2022). High-resolution 
10 
satellite products improve hydrological modeling in northern Italy. Hydrol. Earth Syst. Sci., 26(14), 
11 
3921-3939. https://doi.org/10.5194/hess-26-3921-2022  
12 
Alfieri, L., Burek, P., Dutra, E., Krzeminski, B., Muraro, D., Thielen, J., & Pappenberger, F. (2013). GloFAS–
13 
global ensemble streamflow forecasting and flood early warning. Hydrology and Earth System 
14 
Sciences, 17(3), 1161-1175.  
15 
Alfieri, L., Lorini, V., Hirpa, F. A., Harrigan, S., Zsoter, E., Prudhomme, C., & Salamon, P. (2020). A global 
16 
streamflow reanalysis for 1980–2018. Journal of Hydrology X, 6, 100049. 
17 
https://doi.org/https://doi.org/10.1016/j.hydroa.2019.100049  
18 
AON. (2023). Weather, Climate and Catastrophe Insight.  
19 
Bai, S., Kolter, J. Z., & Koltun, V. (2018). An empirical evaluation of generic convolutional and recurrent 
20 
networks for sequence modeling. arXiv. arXiv preprint arXiv:1803.01271, 10.  
21 
https://doi.org/10.5194/egusphere-2025-2294
Preprint. Discussion started: 27 June 2025
c⃝Author(s) 2025. CC BY 4.0 License.


---

25 
 
Beck, H. E., van Dijk, A. I. J. M., de Roo, A., Miralles, D. G., McVicar, T. R., Schellekens, J., & Bruijnzeel, L. A. 
1 
(2016). Global-scale regionalization of hydrologic model parameters. Water Resources Research, 
2 
52(5), 3599-3622. https://doi.org/https://doi.org/10.1002/2015WR018247  
3 
Crochemore, L., Ramos, M. H., & Pappenberger, F. (2016). Bias correcting precipitation forecasts to 
4 
improve the skill of seasonal streamflow forecasts. Hydrol. Earth Syst. Sci., 20(9), 3601-3618. 
5 
https://doi.org/10.5194/hess-20-3601-2016  
6 
De Roo, A. P. J., Wesseling, C. G., & Van Deursen, W. P. A. (2000). Physically based river basin modelling 
7 
within a GIS: the LISFLOOD model. Hydrological Processes, 14(11-12), 1981-1992. 
8 
https://doi.org/https://doi.org/10.1002/1099-1085(20000815/30)14:11/12<1981::AID-
9 
HYP49>3.0.CO;2-F  
10 
Didan, K. (2021). MODIS/Terra Vegetation Indices 16-Day L3 Global 250m SIN Grid V061 [Data set]. NASA 
11 
EOSDIS Land Processes Distributed Active Archive Center.  
12 
DiMiceli, C., Carroll, M., Sohlberg, R., Kim, D.-H., Kelly, M., & Townshend, J. (2015). MOD44B MODIS/Terra 
13 
vegetation continuous fields yearly L3 global 250m SIN grid V006. NASA EOSDIS Land Processes 
14 
DAAC, 10.  
15 
Emerton, R. E., Stephens, E. M., Pappenberger, F., Pagano, T. C., Weerts, A. H., Wood, A. W., Salamon, P., 
16 
Brown, J. D., Hjerdt, N., Donnelly, C., Baugh, C. A., & Cloke, H. L. (2016). Continental and global 
17 
scale flood forecasting systems. WIREs Water, 3(3), 391-418. 
18 
https://doi.org/https://doi.org/10.1002/wat2.1137  
19 
England Jr, J. F., Cohn, T. A., Faber, B. A., Stedinger, J. R., Thomas Jr, W. O., Veilleux, A. G., Kiang, J. E., & 
20 
Mason Jr, R. R. (2018). Guidelines for determining flood flow frequency—Bulletin 17C 
21 
(1411342232).  
22 
Feng, D., Fang, K., & Shen, C. (2020). Enhancing Streamflow Forecast and Extracting Insights Using Long-
23 
Short Term Memory Networks With Data Integration at Continental Scales. Water Resources 
24 
Research, 56(9), e2019WR026793. https://doi.org/https://doi.org/10.1029/2019WR026793  
25 
Fortin, F.-A., De Rainville, F.-M., Gardner, M.-A. G., Parizeau, M., & Gagné, C. (2012). DEAP: Evolutionary 
26 
algorithms made easy. The Journal of Machine Learning Research, 13(1), 2171-2175.  
27 
Fox, S., Agyemang, F., Hawker, L., & Neal, J. (2024). Integrating social vulnerability into high-resolution 
28 
global flood risk mapping. Nature Communications, 15(1), 3155. https://doi.org/10.1038/s41467-
29 
024-47394-2  
30 
GRDC. (2025). The Global Runoff Data Centre, 56068 Koblenz, Germany (https://grdc.bafg.de/). In. 
31 
Grimaldi, S. (2024). GloFAS v4 calibration methodology and parameters.  
32 
Grimes, D. R., Rogers, D. P., Schumann, A., & Day, B. F. (2022). Charting a Course for Sustainable 
33 
Hydrological and Meteorological Observation Networks in Developing Countries. World Bank.  
34 
Guo, Y., Zhang, Y., Zhang, L., & Wang, Z. (2021). Regionalization of hydrological modeling for predicting 
35 
streamflow in ungauged catchments: A comprehensive review. WIREs Water, 8(1), e1487. 
36 
https://doi.org/https://doi.org/10.1002/wat2.1487  
37 
Gupta, H. V., Kling, H., Yilmaz, K. K., & Martinez, G. F. (2009). Decomposition of the mean squared error 
38 
and NSE performance criteria: Implications for improving hydrological modelling. Journal of 
39 
Hydrology, 377(1), 80-91. https://doi.org/https://doi.org/10.1016/j.jhydrol.2009.08.003  
40 
Hallegatte, S. (2012). A cost effective solution to reduce disaster losses in developing countries: hydro-
41 
meteorological services, early warning, and evacuation. World Bank policy research working 
42 
paper(6058).  
43 
Hargreaves, G. H., & Samani, Z. A. (1985). Reference crop evapotranspiration from temperature. Applied 
44 
engineering in agriculture, 1(2), 96-99.  
45 
Harrigan, S., Zsoter, E., Cloke, H., Salamon, P., & Prudhomme, C. (2023). Daily ensemble river discharge 
46 
reforecasts and real-time forecasts from the operational Global Flood Awareness System. Hydrol. 
47 
Earth Syst. Sci., 27(1), 1-19. https://doi.org/10.5194/hess-27-1-2023  
48 
https://doi.org/10.5194/egusphere-2025-2294
Preprint. Discussion started: 27 June 2025
c⃝Author(s) 2025. CC BY 4.0 License.


---

26 
 
Hunt, K. M. R., Matthews, G. R., Pappenberger, F., & Prudhomme, C. (2022). Using a long short-term 
1 
memory (LSTM) neural network to boost river streamflow forecasts over the western United 
2 
States. Hydrol. Earth Syst. Sci., 26(21), 5449-5472. https://doi.org/10.5194/hess-26-5449-2022  
3 
Karger, D. N., Lange, S., Hari, C., Reyer, C. P. O., Conrad, O., Zimmermann, N. E., & Frieler, K. (2023). 
4 
CHELSA-W5E5: daily 1 km meteorological forcing data for climate impact studies. Earth Syst. Sci. 
5 
Data, 15(6), 2445-2464. https://doi.org/10.5194/essd-15-2445-2023  
6 
Karger, D. N. L., S; Hari, C.; Reyer , P. O. C.;  Zimmermann, E. N. (2021). CHELSA-W5E5 v1.1: W5E5 v1.0 
7 
downscaled with CHELSA v2.0 ISIMIP Repository.  
8 
Kratzert, F., Klotz, D., Brenner, C., Schulz, K., & Herrnegger, M. (2018). Rainfall–runoff modelling using 
9 
Long Short-Term Memory (LSTM) networks. Hydrol. Earth Syst. Sci., 22(11), 6005-6022. 
10 
https://doi.org/10.5194/hess-22-6005-2018  
11 
Kratzert, F., Klotz, D., Herrnegger, M., Sampson, A. K., Hochreiter, S., & Nearing, G. S. (2019). Toward 
12 
improved predictions in ungauged basins: Exploiting the power of machine learning. Water 
13 
Resources Research, 55(12), 11344-11354.  
14 
Lehner, B., Verdin, K., & Jarvis, A. (2008). New Global Hydrography Derived From Spaceborne Elevation 
15 
Data. Eos, Transactions American Geophysical Union, 89(10), 93-94. 
16 
https://doi.org/https://doi.org/10.1029/2008EO100001  
17 
Mazzoleni, M., Dottori, F., Cloke, H. L., & Di Baldassarre, G. (2022). Deciphering human influence on 
18 
annual maximum flood extent at the global level. Communications Earth & Environment, 3(1), 
19 
262. https://doi.org/10.1038/s43247-022-00598-0  
20 
Nearing, G., Cohen, D., Dube, V., Gauch, M., Gilon, O., Harrigan, S., Hassidim, A., Klotz, D., Kratzert, F., 
21 
Metzger, A., Nevo, S., Pappenberger, F., Prudhomme, C., Shalev, G., Shenzis, S., Tekalign, T. Y., 
22 
Weitzner, D., & Matias, Y. (2024). Global prediction of extreme floods in ungauged watersheds. 
23 
Nature, 627(8004), 559-563. https://doi.org/10.1038/s41586-024-07145-1  
24 
Nevo, S., Morin, E., Gerzi Rosenthal, A., Metzger, A., Barshai, C., Weitzner, D., Voloshin, D., Kratzert, F., 
25 
Elidan, G., Dror, G., Begelman, G., Nearing, G., Shalev, G., Noga, H., Shavitt, I., Yuklea, L., Royz, M., 
26 
Giladi, N., Peled Levi, N., . . . Matias, Y. (2022). Flood forecasting with machine learning models in 
27 
an operational framework. Hydrol. Earth Syst. Sci., 26(15), 4013-4032. 
28 
https://doi.org/10.5194/hess-26-4013-2022  
29 
Pagliero, L., Bouraoui, F., Diels, J., Willems, P., & McIntyre, N. (2019). Investigating regionalization 
30 
techniques for large-scale hydrological modelling. Journal of Hydrology, 570, 220-235. 
31 
https://doi.org/https://doi.org/10.1016/j.jhydrol.2018.12.071  
32 
Pilon, P. J. (2002). Guidelines for reducing flood losses.  
33 
Poggio, L., de Sousa, L. M., Batjes, N. H., Heuvelink, G. B. M., Kempen, B., Ribeiro, E., & Rossiter, D. (2021). 
34 
SoilGrids 2.0: producing soil information for the globe with quantified spatial uncertainty. SOIL, 
35 
7(1), 217-240. https://doi.org/10.5194/soil-7-217-2021  
36 
Quinn, P., Beven, K., Chevallier, P., & Planchon, O. (1991). The prediction of hillslope flow paths for 
37 
distributed hydrological modelling using digital terrain models. Hydrological Processes, 5(1), 59-
38 
79.  
39 
Rentschler, J., Salhab, M., & Jafino, B. A. (2022). Flood exposure and poverty in 188 countries. Nature 
40 
Communications, 13(1), 3527. https://doi.org/10.1038/s41467-022-30727-4  
41 
Rogers, D., & Tsirkunov, V. (2011). Costs and benefits of early warning systems. Global assessment rep.  
42 
Sauer, I. J., Mester, B., Frieler, K., Zimmermann, S., Schewe, J., & Otto, C. (2024). Limited progress in global 
43 
reduction of vulnerability to flood impacts over the past two decades. Communications Earth & 
44 
Environment, 5(1), 239. https://doi.org/10.1038/s43247-024-01401-y  
45 
Senay, G. B. (2008). Modeling Landscape Evapotranspiration by Integrating Land Surface Phenology and a 
46 
Water Balance Algorithm. Algorithms, 1(2), 52-68. https://www.mdpi.com/1999-4893/1/2/52  
47 
https://doi.org/10.5194/egusphere-2025-2294
Preprint. Discussion started: 27 June 2025
c⃝Author(s) 2025. CC BY 4.0 License.


---

27 
 
Senay, G. B., Kagone, S., Parrish, G. E. L., Khand, K., Boiko, O., & Velpuri, N. M. (2023). Improvements and 
1 
Evaluation of the Agro-Hydrologic VegET Model for Large-Area Water Budget Analysis and 
2 
Drought Monitoring. Hydrology, 10(8), 168. https://www.mdpi.com/2306-5338/10/8/168  
3 
Tanguy, M., Eastman, M., Chevuturi, A., Magee, E., Cooper, E., Johnson, R. H. B., Facer-Childs, K., & 
4 
Hannaford, J. (2025). Optimising ensemble streamflow predictions with bias correction and data 
5 
assimilation techniques. Hydrol. Earth Syst. Sci., 29(6), 1587-1614. https://doi.org/10.5194/hess-
6 
29-1587-2025  
7 
Tellman, B., Sullivan, J. A., Kuhn, C., Kettner, A. J., Doyle, C. S., Brakenridge, G. R., Erickson, T. A., & 
8 
Slayback, D. A. (2021). Satellite imaging reveals increased proportion of population exposed to 
9 
floods. Nature, 596(7870), 80-86.  
10 
Wang, Y., & Karimi, H. A. (2022). Impact of spatial distribution information of rainfall in runoff simulation 
11 
using deep learning method. Hydrol. Earth Syst. Sci., 26(9), 2387-2403. 
12 
https://doi.org/10.5194/hess-26-2387-2022  
13 
WMO. (2013). The global climate 2001–2010: A decade of climate extremes. WMO-No. 1103, 119.  
14 
Wongchuig, S., Paiva, R., Siqueira, V., Papa, F., Fleischmann, A., Biancamaria, S., Paris, A., Parrens, M., & Al 
15 
Bitar, A. (2024). Multi-Satellite Data Assimilation for Large-Scale Hydrological-Hydrodynamic 
16 
Prediction: Proof of Concept in the Amazon Basin. Water Resources Research, 60(8), 
17 
e2024WR037155. https://doi.org/https://doi.org/10.1029/2024WR037155  
18 
Yaghmaei, N. (2020). Human cost of disasters: An overview of the last 20 years, 2000-2019. UN Office for 
19 
Disaster Risk Reduction.  
20 
 
21 
 
22 
https://doi.org/10.5194/egusphere-2025-2294
Preprint. Discussion started: 27 June 2025
c⃝Author(s) 2025. CC BY 4.0 License.
