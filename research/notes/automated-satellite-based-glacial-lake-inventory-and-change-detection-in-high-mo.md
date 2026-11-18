---
title: Automated satellite-based glacial lake inventory and change detection in High
  Mountain Asia | Scientific Reports
id: automated-satellite-based-glacial-lake-inventory-and-change-detection-in-high-mo
tags:
- atlas-improvement-research-177509
- locus-glof-origin-selection-beyond-pdgl-list
created: '2026-11-18T13:04:15.097772Z'
source: https://www.nature.com/articles/s41598-026-35446-0
source_domain: www.nature.com
fetched_at: '2026-11-18T13:04:15.096387Z'
fetch_provider: builtin
status: draft
type: note
tier: unknown
content_type: unknown
deprecated: false
doi: 10.1038/s41598-026-35446-0
---

Automated satellite-based glacial lake inventory and change detection in High Mountain Asia | Scientific Reports
Skip to main content
Thank you for visiting nature.com. You are using a browser version with limited support for CSS. To obtain
            the best experience, we recommend you use a more up to date browser (or turn off compatibility mode in
            Internet Explorer). In the meantime, to ensure continued support, we are displaying the site without styles
            and JavaScript.
Automated satellite-based glacial lake inventory and change detection in High Mountain Asia
Download PDF
Download PDF
Abstract
The High Mountain Asia (HMA) region has the highest concentrations of high-altitude lakes in the world and experienced more frequent glacial lake outburst floods (GLOFs) in recent decades. Continuous monitoring and mapping of glacial lakes at high spatiotemporal resolution are crucial for understanding this rapidly evolving and vast landscape as well as associated disasters. While existing automated methods show significant promise for mapping glacial lakes, their completeness and accuracy need further improvement to regularly produce glacial lake databases in highly dynamic regions like HMA. In this study, we present a fully automated method integrating open-source remote sensing datasets, including Landsat-8, Sentinel-1, Sentinel-2, and Copernicus Digital Elevation Model (DEM), to map glacial lakes and generate a comprehensive inventory of glacial lakes across the HMA region. Our 2022 inventory comprising 31,698 glacial lakes across HMA covers an area of approximately 2,240 km
\(^{2}\)
. Most lakes are situated between 4000-5400 m asl elevations, with the Eastern Himalaya exhibiting the greatest lake area coverage. We achieved robust accuracy exceeding 96% in the glacial lake size bin (20,000–100,000 m
\(^{2}\)
), demonstrating the effectiveness of our method in mapping and detecting small lakes while successfully delineating all larger glacial lakes (> 100,000 m
\(^{2}\)
). The method was applied to two observation periods (2016-17 and 2022-24), enabling analysis of changes in lake area and spatial distribution patterns. Across HMA subregions, Qilian Shan region showed the highest expansion rate of 22.5% between the observation periods, while the Pamir region showed the least changes (2.9%) in this period, contributing to a 5.5% net change in overall glacial lake area at the HMA scale. Our automated approach provides substantial improvements over previous methodologies in data integration, accuracy and completeness, which can be utilized for routine updating of glacial lakes in HMA and elsewhere.
Similar content being viewed by others
Automated mapping of glacial lakes in Himachal Pradesh using multi source remote sensing data and machine learning
Article
Open access
21 October 2025
Characteristics and changes of glacial lakes and outburst floods
Article
21 May 2024
Heterogeneous changes in global glacial lakes under coupled climate warming and glacier thinning
Article
Open access
13 July 2024
Explore related subjects
Discover the latest articles and news in related subjects.
Cryospheric science
Planetary science
Glacier Dynamics and Climate Change Impacts
Introduction
High Mountain Asia (HMA) is known for numerous glacial lakes, serving as key water resources while also posing risks of related disasters that impact human population and downstream infrastructure
1
,
2
,
3
,
4
. For example, glacial lakes act as natural reservoirs, storing and releasing meltwater gradually to the downstream areas and contributing to the streams and rivers and having significant implications for water resources and hydropower
5
,
6
. On the other hand, the fragile ecosystem of the mountain valleys (e.g., ice or rock avalanche, landslide, moraine dam instability) may trigger Glacial Lake Outburst Floods (GLOFs) and pose significant risks to both population and infrastructure
1
,
7
. Nearly 700 GLOF events are documented across HMA from 1833 to 2022 including catastrophic floods that took ~6,900 human lives
8
. For instance, the South Lhonak GLOF in October 2023 affected about 88,400 people
9
, causing substantial loss of life and infrastructure.
Glacial lakes have been expanding both in size and number globally at a rapid rate
10
. It is predicted that the number of glacial lakes will continue to increase in the 21st century due to climate change and rising temperatures, making GLOF events more frequent and intense
7
,
11
,
12
,
13
,
14
. Numerous studies have previously reported the evolution of glacial lakes at the basin
15
,
16
,
17
, regional
6
,
18
,
19
, and global
10
scales including HMA
3
,
5
. For example, Wang et al.
3
identified approximately 3000 additional glacial lakes in HMA by 2018, showing 15% area growth compared to 27,205 glacial lakes recorded in 1990. However, the change is heterogeneous across the HMA regions and these variations range from 7% (Altai and Sayan regions) to 45% (eastern Kunlun and Qilian Shan regions) in this period
3
. Additionally, different types of glacial lakes change at different rates. For example, Wang et al.
20
reported that proglacial lakes grew most significantly, while supraglacial lakes exhibited the least growth. Overall, the trend is towards the continued expansion of glacial lakes. The overall increase in glacial lakes is primarily driven by the accelerated melting, and retreat of glaciers due to climate warming
3
,
5
,
7
,
21
,
22
,
23
. These trends highlight the importance of systematic and consistent monitoring of glacial lakes to understand the changing landscape in HMA as well as for GLOF studies.
Previous studies have primarily employed satellite remote sensing data and applied either manual mapping or semi-/fully automatic methods to map glacial lakes. Manual methods typically involve digitizing lakes using false-color-composites derived from multispectral data, relying on visual inspection
3
,
6
,
18
. Manual mapping is a labor-intensive and time-consuming process
18
, often influenced by the digitizer’s expertise, which can lead to subjective interpretations. To address this challenge, Wang et al.
3
implemented additional accuracy control measures to mitigate subjectivity during the mapping process conducted between 2014 and 2019, as the work involved multiple groups. One common approach utilized in the semi-automatic methods is the use of spectral water indices like the Normalized Difference Water Index (NDWI) and its modifications, derived from two or more spectral bands
2
,
4
,
5
,
10
,
14
. These indices help identify the primary locations of glacial lakes, which can be further improved by combining topographic data (e.g., slope, hillshade) from Digital Elevation Models (DEMs)
2
,
10
,
14
. Additionally, Synthetic Aperture Radar (SAR) imagery has been used independently or in combination with multispectral images
24
,
25
,
26
as SAR Images are particularly advantageous in high-mountain and polar environments as they operate independently of solar illumination and are not affected by cloud cover.
Although these semi-automated methods can process large datasets quickly, significantly reducing time and introducing objectivity into the mapping process, they often suffer from uncertainties, such as inaccurate boundary extraction and misidentification
10
. These challenges arise from the complex mountainous terrain (e.g., steep slopes, debris cover), partially or fully frozen lakes
26
and the spectral similarity of shadows or darker features to glacial lakes in multispectral satellite imagery
27
. Consequently, these semi-automated approaches require manual corrections during the post-processing phase
5
,
6
which limits their applicability to update inventories at regular intervals
28
.
Fully automated methods are well-suited for monitoring glacial lakes, as they can regularly update lake boundaries to capture changes in area without requiring extensive manual corrections. However, existing studies utilizing automated processes (e.g.,
2
,
10
) are limited in effectiveness due to their reliance on global thresholds on spectral indices (e.g. NDWI). Glacial lakes can exhibit considerable variability in spectral properties even within close proximity, due to differences in water composition and depth
28
,
29
. Lower NDWI values often result in commission errors by including false positives such as terrain shadows and debris-covered glaciers, while higher NDWI thresholds may fail to detect glacial lakes with low NDWI values due to high turbidity
28
,
30
. As a result, automated methods tend to adopt more conservative minimum area thresholds, such as 0.05 km
\(^{2}\)
31
, to balance the trade-off between minimizing false positives and ensuring reliable lake detection. In contrast, semi-automated methods use lower thresholds, like 0.0081 km
\(^{2}\)
5
,
32
, while manual methods can detect lakes as small as 0.0036 km
\(^{2}\)
33
. The exclusion of smaller glacial lakes compromises the completeness of the lake inventory
34
, thereby impacting subsequent analyses. For example, a GLOF event from a small glacial lake (area
\(\approx\)
0.017 km
\(^{2}\)
) transformed into a massive debris flow, causing significant destruction downstream
35
. Similarly, small and transient ice-dammed lakes at surge-type glaciers can generate hazardous outburst floods through repeated filling–drainage cycles, as documented for Shisper Glacier in the western Karakoram
36
,
37
. These examples highlight the critical need to include small glacial lakes in hazard assessments.
Existing automated methods typically rely on processing remote sensing data from a single source, which cannot effectively overcome their inherent limitations when applied to large-scale and heterogeneous regions such as HMA
38
. Therefore, there is a critical need to develop a robust automated framework that can integrate multi-source remote sensing datasets and reduce reliance on fixed spectral-index thresholds, thereby improving both the completeness and accuracy of lake inventories. In this study, we present a new methodology that effectively integrates multi-source remote sensing datasets to address common challenges associated with automated mapping and improve both the accuracy and completeness of glacial lake inventories. The specific objectives of this study are to –
1.
Develop a fully automated method that integrates multi-source remote sensing datasets such as optical, SAR, and thermal imagery, to map glacial lakes without requiring manual post-processing corrections.
2.
Create an updated inventory of glacial lakes in HMA using this automated method.
3.
Analyze glacial lake changes in HMA by applying the methodology to two observation periods (2016-17 and 2022-24).
Study area
The High Mountain Asia (26–46
\(^{\circ }\)
N, 67–105
\(^{\circ }\)
E), known as the Third Pole, spans several mountain ranges including Himalaya, Karakoram and Tien Shan, covering approximately 4.7 million km
\(^{2}\)
. It is characterized by highly complex terrain such as steep mountain ranges, deep valleys and complex drainage systems with the elevation ranging from below 1,000 m in valleys to over 8,000 m at the highest peaks. HMA is known to have the largest volume of glaciers in the world outside of polar regions
39
and widespread regions of permafrost
39
. The meltwater from HMA’s snow and ice feeds fresh water to the major river systems (e.g., Indus, Ganges, Brahmaputra), which contribute to the water resources in the downstream regions. The climate of the HMA is mainly characterized as cold and dry with intense solar radiations with average annual temperature ranging from -6
\(^{\circ }\)
C (northwest) to 20
\(^{\circ }\)
C (southeast)
39
. Glacial lakes in the region vary in size from small to moderate (
\(\sim\)
0.005 km
\(^{2}\)
to 5–6 km
\(^{2}\)
)
3
, exhibit seasonal fluctuations
39
, and are typically sediment-rich and highly turbid
40
. This study covers 15 RGI 7.0 (Randolph Glacier Inventory) subregions, surrounded by 94,058 glaciers covering approximately 100,000 km
\(^{2}\)
(Fig.
1
).
Fig. 1
Full size image
Location map showing 15 RGI 7.0 subregions in High Mountain Asia. The base layer shows mean temperature during warm months (June to November) of the year 2020 and buffered extent from glaciers in which glacial lake boundaries are mapped in this study. The blue boxes show the study sites for detection accuracy assessment.
Data and methods
Zones of interest
Glacial lakes are formed through various processes of deglaciation (e.g., glacier retreat, breaking of supra-/en-glacial channels), resulting in their close proximity to glaciers. However, there seems to be no consensus on their quantifiable proximity to the glaciers. Previous studies have used different buffer distance from glaciers ranging from 1 km to 20 km in order to distinct between glacial lakes and other types of water bodies
3
,
5
,
18
,
41
,
42
,
43
. In this study, we consider glacial lakes to be water bodies formed either by the glaciation processes of modern glaciers or by past glacial activity
14
,
44
. We initially adopted the commonly used 10 km distance criterion. However, we observed a significant number of lakes exhibiting geomorphological characteristics similar to those of glacial lakes, such as cirque/tarn lakes formed in U-shaped valleys
44
and paternoster lakes
45
, being excluded by this threshold (Figure
S1
). Upon reviewing other manually mapped glacial lake inventories
3
,
44
, we found that although they nominally applied the 10 km distance criterion, they also included lakes located well beyond this limit. For example, Wang et al.
3
mapped glacial lakes situated up to 40 km away (e.g., 30
\(^{\circ }\)
14’42.48” N, 91
\(^{\circ }\)
32’28.50” E) from the nearest glacier boundary, as per RGI 6.0. In our analysis, we found that most glacial lakes (~72%) in Wang et al.
3
’s glacial lake inventory located beyond the 10 km threshold were actually within 12.5 km but only a few lakes were found between 12.5 km and 15 km. Therefore, considering the strong geomorphological similarity of lakes within 12.5 km to typical glacial lakes, we determined that a 12.5 km buffer is more appropriate for ensuring the completeness of the glacial lake inventory, and we adopted this buffer distance in our study.
Data sources and processing strategy
This section provides a description of the various datasets used in this study, including the specific data products, relevant accession details, and their sources. We also discuss the strategy employed to process these datasets across the entire HMA region. In this study, we mapped glacial lakes by integrating open-source optical, thermal and SAR remote sensing datasets from Landsat-8, Sentinel-1 and Sentinel-2 along with auxiliary datasets from Moderate Resolution Imaging Spectroradiometer (MODIS), the Copernicus Digital Elevation Model and the Randolph Glacier Inventory (RGI) 7.0 (Table
1
). This analysis was conducted using the cloud computing platform Google Earth Engine (GEE).
We processed approximately 65,000 Landsat-8 Operational Land Imager (OLI)/Thermal Infrared Sensor (TIRS) Level-1 Terrain-Processed (L1TP) images available on the GEE platform covering the study regions of HMA. The Landsat-8 mission was launched in February 2013 by National Aeronautics and Space Administration and the data is globally available with a repeat interval of 16 days. We analyzed over 78,000 C-band Ground Range Detected (GRD) Sentinel-1 scenes acquired in Interferometric Wide Swath (IW) mode with VV polarization in either ascending or descending mode. The Sentinel-1 mission was launched in April 2014 by the European Space Agency (ESA), and the images on GEE have been available since October 2014. For Sentinel-2, we filtered through more than 550,000 Level-1C orthorectified top-of-atmosphere data products. The Sentinel-2 mission, launched in June 2015 by ESA, has been providing archived imagery on the GEE platform since July 2015. We utilized the Copernicus DEM (GLO-30) to derive topographic parameters such as elevation, slope etc. The Copernicus DEM is based on radar datasets collected by the TanDEM-X mission between 2010 and 2015
46
. The specific computational processing workflows and analytical methods applied to these datasets are detailed in the methodological section (Section
Extraction of Glacial lake boundaries
).
To prepare the buffer zones for glacial lake mapping, we used the glacier outlines from the RGI 7.0 dataset
47
. This buffered glacier extent was then divided into 0.5
\(^{\circ }\)
x 0.5
\(^{\circ }\)
grids (1591 in total) (Figure
S2
) to optimize computational efficiency within the constraints of a single academic user’s resources on GEE. Due to the vast geographic span of the HMA region, climatic conditions vary considerably across different areas. To account for this heterogeneity, we categorized the grids into two groups based on their mean land surface temperature, enabling the use of distinct processing parameters in subsequent processing steps according to local climatic conditions. For this purpose, we utilized Terra MODIS MOD11A2.061 data product for the period of June to October 2022 archived in GEE which provides an average 8-day Land Surface Temperature (LST) per pixel. Having described the datasets and spatial processing framework used in this study, the following section presents the detailed methodological approach.
Table 1 Datasets used in this study.
Full size table
Extraction of Glacial lake boundaries
This section describes the comprehensive methodology employed for processing the datasets introduced in Section
Data sources and processing strategy
. Our methodology for extracting glacial lake boundaries consists of two steps (Fig.
2
). The first step generates preliminary outlines, identifying their locations as well as approximate extents. The second step further refines the boundaries by utilizing the preliminary outlines and additional processing that we subsequently explain.
Obtaining preliminary boundaries
Selecting Landsat imagery:
We utilized the Top-of-atmosphere (L1TP) Landsat-8 data products and filtered out images with cloud cover more than 20%. We selected images from June to October, when lake surfaces are largely ice-free
2
,
3
,
39
. If fewer than two images were available for a given grid in a year, we included images of the preceding and subsequent years. If no such images were available, we considered images available with the lowest cloud cover.
Getting the percentile composite of Landsat:
To generate a cloud-free image layer for each tile, we created a composite by integrating all available pixels within the tile. Initially, we tested mean and median composites, but these approaches did not yield satisfactory results, as the resulting images still contained cloudy pixels and exhibited inconsistencies in reflectance values. To address this issue, we opted for the 25th percentile composite layer, which effectively removed cloud pixels. This approach was particularly effective because, in the optical spectrum, cloud cover typically exhibits higher reflectance than water bodies. The reflectance may be lower in the cases of thick and optically dense clouds. However, since we pre-filtered images to include only those with minimal cloud cover, the likelihood of such cloud contamination was low. The 25th percentile composite primarily selected low-reflectance pixels, mostly corresponding to water bodies. This enabled us to obtain maximum extents of glacial lakes for the year, particularly useful given the seasonality of glacial lakes. However, this approach made the mountain shadows more prominent in the composite layer, as shadowed regions also exhibit low reflectance.
Initial composite layer segmentation:
To identify potential glacial lake pixels, we performed segmentation on the composite layer, utilizing two spectral water indices: the Normalized Difference Water Index (NDWI)
48
, derived from the Green and Near-Infrared (NIR) bands, and the Modified Normalized Difference Water Index (MNDWI)
49
, which utilizes the Green and Shortwave Infrared (SWIR) bands. MNDWI was particularly effective in getting pixels of glacial lakes in icy or partially frozen states. These indices were subsequently integrated using power-weighted aggregation to enhance the representation of lake-only pixels. Finally, segmentation was conducted on the combined layer to isolate the potential glacial lake pixels.
Sentinel-1 selection and median layer:
Sentinel-1 imagery was utilized as a complementary data source due to its ability to provide consistent temporal coverage within a given year, independent of cloud cover limitations that typically affect optical multispectral data and thereby eliminating the need to incorporate imagery from adjacent years. Here, we created a median composite layer of all the available Sentinel-1 scenes during June-October for each tile. We chose median composite as the mean was sensitive to outliers like speckles and noise. In addition, the median layer also removed the unwanted pixels due to temporary stream outlets or inlets to the lake, and floating icebergs. We finally binarized the median layer to obtain pixels potentially representing glacial lakes.
Masking, object-based segmentation, and layer fusion:
The binary layers derived from Landsat-8 and Sentinel-1 processing contained false positives due to features with similar spectral characteristics, such as mountain shadows, and areas with low radar backscatter, like snowpacks. To eliminate these false positives, we applied slope and temperature masks
10
derived from Copernicus GLO-30 DEM and Landsat-8 thermal infrared bands, respectively. We conducted sensitivity analysis on slope mask thresholds ranging from lower values (5–20
\(^{\circ }\)
) to higher ones (25–45
\(^{\circ }\)
). We found that lower thresholds tended to exclude smaller lakes or remove parts of larger lakes, while higher thresholds often included terrain-induced shadow regions and non-lake features. Previous studies have used a range of threshold values. For example, Zhang
2
and Zheng
14
used a 20
\(^{\circ }\)
slope threshold; Shugar
10
initially applied a 40
\(^{\circ }\)
threshold and later filtered polygons using a median slope threshold of 10
\(^{\circ }\)
; Zhang
39
used a 10
\(^{\circ }\)
slope threshold. Based on this comparative analysis and our own sensitivity analysis results, we found 25
\(^{\circ }\)
to be the most appropriate for our study. For temperature masks, we applied variable temperature thresholds based on grid classification, using –2
\(^{\circ }\)
C for grids with mean LST below 15
\(^{\circ }\)
C and –1
\(^{\circ }\)
C for grids with mean LST above 15
\(^{\circ }\)
C, where mean LST was derived from Terra MODIS data as described in Section
Data sources and processing strategy
. We further applied object-based segmentation to remove small pixel clusters not representative of glacial lakes that remained after the masking process, using minimum area thresholds of 3,600 m
\(^{2}\)
(4 pixels) for Landsat-8 derived layer and 2,000 m
\(^{2}\)
for Sentinel-1 derived layer. Finally, the refined datasets were integrated through feature-based data fusion, resulting in a preliminary delineation of glacial lake boundary pixels.
Dilation, vectorization and filtration:
We applied a morphological dilation of two pixels to the preliminary glacial lake areas to create background zones and converted them into vector format. To eliminate any remaining false-positive polygon features, we analyzed the histogram modality within each polygon. Features exhibiting unimodal histograms were excluded, as true glacial lake objects are expected to exhibit bimodal histogram characteristics. The resulting polygon features were then utilized as glacial lake objects to delineate refined boundaries of glacial lakes in further steps.
Obtaining refined boundaries
Sentinel-2 image processing: cloud filtering, image selection, and glacial lake delineation:
In this step, we employed Level 1-C orthorectified top-of-atmosphere Sentinel-2 images to obtain refined glacial lake boundaries. We only needed images that were free of cloud cover over our raw glacial lake objects. For this, we opted for Quality Assessment (QA) layers cloud score+
50
, which provides a mask containing pixels with cloud cover or affected by shadows as well. To ensure the selection of good quality images that captured glacial lakes at their maximum extent within a given year (i.e., avoiding partially or fully frozen states), we implemented a systematic image selection approach. Initially, images were sorted by month, prioritizing specific months but it produced inconsistent results. To resolve this issue, we sorted images according to higher upper-quartile NDWI values and lower spectral snow index values for each glacial lake object. The top most image was utilized to derive the NDWI for each glacial lake object and segmentation was then performed using thresholds determined through an automatic variance-minimization method, resulting in delineation of refined glacial lake boundaries.
Post-processing:
The obtained inventory still included polygon features corresponding to rivers or streams. To remove these, we employed HydroRIVERS river network data at 15 arc-second resolution (approx. 500 m) from HydroSHEDS
51
. This process involved identifying intersecting features, followed by filtering these features based on the morphological characteristics.
Fig. 2
Full size image
Flow Diagram of the methodology used to extract glacial lake outlines.
Accuracy and uncertainty estimation
The accuracy assessment was restricted to glacial lakes
\(\ge\)
3,600 m
\(^{2}\)
because this threshold (four Landsat-8 pixels) was applied during preliminary boundary extraction. The final inventory, however, includes smaller lakes (< 3,600 m
\(^{2}\)
) captured during refined boundary delineation using Sentinel-2 imagery. We performed both a Detection Accuracy Assessment and a Delineation Accuracy Assessment to evaluate the overall accuracy of the glacial lake inventory. The Detection Accuracy Assessment evaluated the number of identified glacial lakes in a given region by comparing the detected number of lakes with reference data, while the Delineation Accuracy Assessment evaluated the accuracy of the size (or area) of the identified glacial lakes.
For the detection accuracy assessment, we selected four test sites located at the climatic corners of the HMA region capturing the full range of temperature and precipitation conditions (Fig.
1
). Site 1 represents the westerlies-dominated western region, Site 2 the intensely summer-monsoonal southern region, Site 3 the humid maritime southeast, and Site 4 the continental north
52
,
53
. These sites were chosen to ensure that the accuracy assessment is representative of the overall dataset rather than being confined to a specific climatic or topographic condition. For these sites, we manually identified glacial lakes and marked them with points overlapping the areas of glacial lakes on Sentinel-2 imagery. These marked positions were then compared with our automatically detected glacial lake outlines to determine True Positives (TP), True Negatives (TN), False Positives (FP), and False Negatives (FN). Subsequently, we used standard statistical metrics to estimate the detection accuracy of the glacial lakes (Table
2
).
Table 2 Detection accuracy metrics and their formulas.
Full size table
To evaluate the Delineation Accuracy Assessment, we manually delineated glacial lake boundaries using high-resolution Planet imagery with 3 m posting. We made sure these images were contemporaneous to the images used for automatic delineation of lakes. We employed two metrics. Relative Area Accuracy quantifies area estimation performance by comparing the automatically extracted area to the manually delineated area, while Intersection Over Union (IoU) evaluates positional accuracy by measuring the overlap between the automatic and manual delineations. To assess the uncertainty in our glacial lake inventory, we randomly selected a 1% sample from the entire dataset. This method allowed us to evaluate the potential sources of error and variability in the mapped lake boundaries without having to manually check the entire dataset.
Results
Lake inventory and distribution across HMA
We identified and mapped 31,698 glacial lakes across all HMA subregions in 2022, covering a total area of 2,239.58 km
\(^{2}\)
(Fig.
3
). The highest area coverage of glacial lakes (as a percentage of the glaciers buffered extent) was observed in the Eastern Himalaya region at approximately 0.53%, followed by the South and East Tibet and Hengduan Shan regions. However, the Inner Tibet region exhibited the highest number of glacial lakes, with a total number of 5,672 lakes covering an area of 526.92 km
\(^{2}\)
(Fig.
4
). In contrast, the Qilian Shan region recorded the lowest glacial lake area coverage ( 0.036%), while the Hissar Alay region had the fewest glacial lakes, with only 266 lakes covering 16.07 km
\(^{2}\)
.
The majority of glacial lakes in HMA are small to moderate in size. Our results indicate nearly half (53%) of the glacial lakes are small (
\(\le\)
20,000 m
\(^{2}\)
). However, these lakes collectively account for only 7.8% of the total glacial lake area. Medium-sized glacial lakes (20,000–100,000 m
\(^{2}\)
) comprise 36% of the total number of lakes and contribute approximately 22% to the total glacial lake area. Notably, although large glacial lakes (> 100,000 m
\(^{2}\)
) constitute only 11% of the total lake count, they account for over 70% of the total glacial lake area in HMA.
Fig. 3
Full size image
Map showing the distribution of glacial lakes across different regions of HMA, divided into 1
\(^{\circ }\)
\(\times\)
1
\(^{\circ }\)
grid cells. The size of each circle indicates the total area of glacial lakes within a grid cell, while the color represents the number of individual lakes in that cell.
Glacial lakes are distributed across various altitudes ranging between 1400-6100 m asl. However, nearly 70% of the glacial lakes are located in the elevation range between 4054 m and 5325 m. The Inner Tibet region exhibits the highest elevation of glacial lakes among all HMA subregions, with majority (approx. 85%) located above 4900 m. In contrast, the East Tien Shan region displays glacial lakes at the lowest elevations, where the majority are situated below 3,600 meters. Notably, the highest recorded elevation of a glacial lake (30
\(^{\circ }\)
42’31” N, 83
\(^{\circ }\)
23’26” E) is 6041 m in the Inner Tibet region, whereas the lowest is 1384 m in the West Tien Shan region (41
\(^{\circ }\)
18’33” N, 72
\(^{\circ }\)
57’49” E).
Fig. 4
Full size image
Lake area coverage and number of glacial lakes across HMA regions.
Glacial lake area change between 2016–17 and 2022–24
We applied our mapping algorithm to two observation periods (2016–17 and 2022–24) to analyze glacial lake area changes (Fig.
5
). Acquiring cloud-free satellite imagery at the same time in different years is challenging due to frequent cloud cover and limited data availability, which can introduce seasonal variability and lead to inconsistencies in lake area change analysis. Additionally, interannual variability in glacial lake extent causes inconsistent area change trends. To mitigate these effects and derive representative lake areas, we generated median composites of all available cloud-free imagery for each multi-year observation period. The use of these multi-year periods, even where sufficient single-year imagery was available, allowed us to capture the full extent of glacial lakes, thereby addressing the influence of short-term fluctuations and ensuring consistency in area change assessments. We included only lakes with at least three cloud-free images in each period. We also excluded lakes smaller than 10,000 m
\(^{2}\)
from the analysis, as these exhibit high fluctuations and greater uncertainty due to the relatively coarse spatial resolution of the input imagery. Following these considerations, 17,995 glacial lakes across HMA were included for assessment.
Our analysis reveals consistent expansion of glacial lakes across HMA subregions between 2016-17 and 2022-24. Glacial lakes in HMA as a whole experienced a total area increase of 5.5%, with spatial heterogeneity across subregions. We observed that glacial lakes expanded most significantly in East Himalaya (14.1 km
\(^{2}\)
) and Inner Tibet (13.8 km
\(^{2}\)
) in terms of absolute area change. In terms of relative growth, the Qilian Shan region exhibited the highest lake expansion rate of 22.4% , followed by East Kun Lun (15.8%) and East Tien Shan (10.1%). Conversely, the Hissar Alay and Karakoram regions experienced the smallest absolute area gains, while the Pamir region showed the most stability in relative percentage terms (Table
S5
).
To determine lake evolution trends, we used an area-change threshold of ±5,000 m
\(^{2}\)
and area uncertainty parameter. Lakes were classified as stable if their area change remained within both the threshold and uncertainty bounds. Lakes exceeding both criteria were classified as expanding or shrinking accordingly. Approximately 75% of HMA’s glacial lakes remained stable, though regional patterns varied considerably. Inner Tibet (674) and East Himalaya (477) had the most expanding lakes in absolute terms, while Qilian Shan showed the highest proportional expansion (41.4%). Shrinkage was rare overall (2.1%) but notably higher in West Kun Lun (9.1%) and East Kun Lun (5.7%). Hengduan Shan and Hindu Kush exhibited the greatest stability, with approximately 85% of lakes in a stable state.
Fig. 5
Full size image
Trends in Glacial Lake Area Changes across 1
\(^{\circ }\)
\(\times\)
1
\(^{\circ }\)
grids and regional variations in the HMA: Each circle represents a 1
\(^{\circ }\)
\(\times\)
1
\(^{\circ }\)
grid, with the size of the circle indicating the total absolute change in glacial lake area between 2016-17 and 2022-24. The color gradient shows the direction of change (expansion or shrinkage). Regional patterns across the HMA are highlighted in grayscale.
Accuracy assessment
In the four selected study sites (Fig.
1
), we identified a total of 1,034 glacial lakes with areas greater than 3,600 m
\(^{2}\)
and categorized them according to their respective size classes (Table
3
). Our analysis demonstrates successful detection of all large glacial lakes (> 100,000 m
\(^{2}\)
) and approximately 96% of medium-sized lakes (20,000–100,000 m
\(^{2}\)
). For small glacial lakes, we achieved an accuracy of about 77% for the (5,400–20,000 m
\(^{2}\)
) area group and 25% for the smallest area group (<5,400 m
\(^{2}\)
). Overall detection accuracy was 79.42% (95% CI: 77.22–81.62%).
Table 3 Performance metrics across different area groups.
Full size table
Figure
6
shows the results of the delineation accuracy assessment, evaluated using Relative Area Accuracy and Intersection over Union (IoU), respectively. An overall mean Relative Area Accuracy of 96.89% and a mean IoU of 0.94 were achieved across all area groups. Our results indicate that area extraction accuracy tends to increase with glacial lake size, with smaller lakes showing comparatively lower accuracy than larger lakes. Specifically, the mean Relative Area Accuracy ranged from 95.5% for smaller lakes to 98.7% for larger lakes, while the mean IoU values ranged from 0.92 for smaller lakes to 0.97 for larger lakes. Uncertainty analysis of the dataset revealed that less than 0.5% of the lakes were affected by icebergs or partially frozen lake surfaces, and less than 1.25% were influenced by terrain shadow issues (Fig.
7
).
Fig. 6
Full size image
Figure shows Delineation accuracy estimates using Relative Area Accuracy and Intersection over Union for various area groups.
Fig. 7
Full size image
Maps showing scenarios, including presence of icebergs, partially frozen lakes and terrain shadows, that cause the uncertainty in the lake area extraction. (Image source: Sentinel-2).
Discussions
Comparison with existing glacial lake inventories
Previous studies have documented glacial lakes in HMA using satellite data and manual or automated methods. Here, we selected three recently published studies
3
,
5
,
10
for comparison (Fig.
8
). While Wang’s inventory depends on manual methods, Chen’s and Shugar’s data is based on either automatic or manual techniques as well as a combination of them. Conducting a comprehensive comparison is challenging, as these inventories were mapped during different time frames, using different datasets and methodologies. However, we ensured a consistent comparison by applying the same glacial lake area thresholds and subregions for these inventories. Wang et al.
3
detected a total of 24,898 glacial lakes in High Mountain Asia, with a combined area of 1,706.08 km
\(^{2}\)
, while this study detected 27,189 glacial lakes (
\(\ge\)
0.0054 km
\(^{2}\)
) with a total area of 2,064.74 km
\(^{2}\)
. Chen et al.
5
identified 15,192 glacial lakes with a total area of 1,373.69 km
\(^{2}\)
, whereas this study identified 23,688 glacial lakes (
\(\ge\)
0.0081 km
\(^{2}\)
) with a total area of 2,041.03 km
\(^{2}\)
. Shugar et al.
10
detected 2,188 glacial lakes with a total area of 476.12 km
\(^{2}\)
, whereas in this study, 6,450 glacial lakes (
\(\ge\)
0.05 km
\(^{2}\)
) with a total area of 1,679.65 km
\(^{2}\)
were detected. In terms of the number of mapped glacial lakes, we were able to identify more glacial lakes than previous studies.
We further compared lake detection rates with these studies across four sites (Fig.
1
) by manually identifying lakes within corresponding temporal windows and applying the same minimum area thresholds for each comparison. Table
S1
-
S3
shows comparison of detection rates across various lake size categories. Our study achieved higher overall detection accuracy (98.12%) than Shugar et al.
10
at 62.85%. Similarly, our method achieved 91.75% accuracy while Chen et al.
5
showed (62.26%). Wang et al.
3
produced comparable results to our study, with their dataset yielding 85.66% overall accuracy compared to our 86.13%. Additionally, Figures
S6
and
S7
provide a visual comparison of detection and delineation accuracies between our study and existing inventories in an area with relatively stable glacial lakes that were consistently present across all timeframes.
While the number of lakes mapped in this study varies by only 10% with the ones mapped by Wang et al.
3
, these variations range from 1.5 Chen et al.
5
to almost three times Shugar et al.
10
. We expect that the main reasons for these variations are due to the dynamic nature and seasonality of small glacial lakes. Such lakes may remain frozen around the year or drain completely in one year, while they are prominently visible in other years. Our methodological approach effectively addressed this variability by selectively utilizing imagery in which these lakes were visible to their greatest possible extent (Section
Obtaining refined boundaries
). Newly emerging lakes (Fig.
9
, panel-1) also cause variations in the number as also indicated by lower detection accuracy for the (
\(\le\)
20,000 m
\(^{2}\)
) lake area group. Similarly, many small supraglacial lakes, while expanding, merge together and form a bigger lake, which also leads to changes in the number of mapped lakes (Fig.
9
, panel-2).
Fig. 8
Full size image
Comparison of glacial lakes inventories between this study and the published ones (Shugar, Chen, Wang).
A
: Distribution of glacial lakes by area group showing their number.
B
-
D
: Lake detection rate for different area groups.
Fig. 9
Full size image
(1) Three scenarios showing the formation of new glacial lakes during 2016-22, (2) Coalescence of several supra-glacial lakes during 2016-22. (Image source: Sentinel-2)
Drivers of change in Glacial lakes and current observations
Changes in glacial lake areas can be attributed largely to processes driven by glacier retreat and regional hydrology
2
,
3
,
22
. Our observations of glacial lake changes between 2016-17 and 2022-24 reveal various patterns of evolution.
Proglacial lakes, which are in direct contact with glacier fronts, exhibit the most significant change (Fig.
10
). They are expanding primarily because glacier retreat exposes overdeepings that subsequently fill with meltwater. Proglacial lakes show substantially higher expansion rates than unconnected lakes. Our findings show that the proportion of expanding lakes directly connected to glaciers is 2.4 times greater (41.4%) than that of unconnected lakes (17.4%). Furthermore, lakes located within 1 km of glaciers account for 47.84 km
\(^{2}\)
(56.9%) of the total lake area increase across HMA, underscoring their strong sensitivity to glacier dynamics. However, exceptions exist. For example, surge-type glaciers can trigger sequences of ice-dammed lake formation and drainage that are not captured by simple monotonic retreat, as observed at Shisper Glacier, Karakoram
36
,
37
. Conversely, we also recorded instances of proglacial lake shrinkage caused by GLOF events (e.g., at 30
\(^{\circ }\)
21’17.6” N, 93
\(^{\circ }\)
37’53.5” E) (Figure
S4
). Our automated framework is well suited to track such evolving lake systems at regional scales, provided appropriate (e.g. cloud-free) imagery is available.
Supraglacial lakes exhibit highly variable behavior, including expansion, merging with each other to form larger lakes, or partial to complete drainage. Meanwhile, new glacial lakes continue to form (Fig.
9
), adding further complexity to the glacial lake landscape and highlighting the importance of regular monitoring.
Overall, our findings of net lake expansion across HMA align with previous studies reporting positive glacial lake area changes and substantial spatial heterogeneity
2
,
3
,
5
. Regions exhibiting high relative (percent) growth (Qilian Shan, East Kun Lun, portions of Tien Shan) and high absolute increases (Eastern and Central Himalaya) are consistent with patterns identified in earlier studies. The predominant expansion of proglacial lakes is also consistent with findings from previous studies
5
,
14
. Our assessment aligns with broad regional trends while refining the spatial detail of where relative lake growth is most pronounced and evolving.
Fig. 10
Full size image
Evolution of glacial lakes (
a
-
c
: proglacial lakes,
d
-
f
: supraglacial lakes,
g
-
i
: bedrock lakes) from 2016 to 2022. (Image source: Sentinel-2).
Limitations and scope of the study
Although our methodology significantly improves the accuracy and efficiency of automated glacial lake mapping, a few limitations and scope choices persist. These are primarily a result of data availability and the strict methodological filtering procedures we implemented to maintain inventory accuracy.
Lake detection and boundary extraction primarily depends on the availability and quality of the data. Figure
11
shows the availability of clouds and shadow free imagery for individual lake boundaries. In cases where cloud-free imagery was unavailable within a specific timeframe, some glacial lakes were excluded from the inventory entirely. Additionally, insufficient cloud-free imagery sometimes necessitated selecting images where lakes were partially frozen, contained icebergs, or were influenced by terrain shadows. This led to inaccuracies in lake boundary extraction. However, the uncertainty analysis demonstrates that the impact of these issues on the final inventory was minimal. Temporal mismatches between DEM acquisition and lake mapping periods also complicated boundary delineation. Small glacial lakes that formed after DEM acquisition sometimes went undetected as a result.
Our methodological approach introduced a few limitations as well. During the selection process for cloud-free images, higher thresholds were set to eliminate cloud-covered pixels, thus improving boundary accuracy. However, this strict criterion also resulted in some smaller lakes being excluded. Similarly, during the filtration of river and stream polygons, a few glacial lakes were mistakenly excluded due to their morphological similarities to riverine features. The decision to exclude these lakes was made deliberately to maintain inventory accuracy and reduce false positives, and given their limited size and number, the overall effect on the inventory was minor. Additionally, using median imagery derived from Sentinel-1 SAR data stacks can unintentionally exclude small supraglacial lakes, as their positions frequently change, making them appear as anomalies.
Other challenges stem from inherent limitations associated with satellite sensors themselves. Synthetic Aperture Radar (SAR) imagery is susceptible to layover, shadowing, and foreshortening effects in areas of steep terrain. These issues can complicate the detection of smaller lakes, particularly supraglacial lakes which typically form in small, deep depressions. Another sensor specific limitation is the geolocation accuracy of satellite imagery. The Sentinel-2 dataset has a specified geolocation accuracy of <12.5 m (Circular Error @95%)
54
, which may lead to minor image-to-image misalignment related errors in our results. To quantify the impact of these positional shifts, we conducted an alignment analysis using a stable, moderate-sized glacial lake (Figure
S8
) and extracted its boundary outlines between 2017 and 2024. The analysis showed an average median displacement of 8.12 m, equivalent to  0.8 Sentinel-2 pixels. These results indicate that any meaningful spatial and directional changes in glacial lakes can be reliably detected without additional co-registration. While Sentinel-2 misalignment issues do not affect the estimation of numerical changes in glacial lake area, studies focusing on precise spatial or directional evolution at sub-pixel (<10 m) scales may require further co-registration.
We made specific decisions to define the scope of this study. For instance, we did not apply elevation-specific distance thresholds to the zones of interest (Section
Zones of interest
) or consider the hydrological connectivity of glacial lakes. Across the large-scale and topographically complex HMA region, elevation criteria vary significantly with regional climatic conditions, and applying hydrological connectivity as a criterion would have excluded many lakes from the inventory, even within a 10 km buffer distance
55
. We prioritized completeness of our inventory given our primary objectives, an approach which is consistent with existing large-scale glacial lake mapping studies
3
,
10
,
14
,
44
.
Fig. 11
Full size image
Figure showing the number of cloud-free good quality Sentinel-2 images available for each glacial lake.
Conclusions
The methodology presented in this study effectively addresses common challenges associated with automated glacial lake mapping, such as terrain shadows and false detections due to spectral similarity with non-water features. It improves the detection of smaller glacial lakes, which are often missed by earlier automated methods, thereby increasing the completeness and precision of glacial lake inventories. Using this improved automated method, we identified 31,698 glacial lakes covering a total area of approximately 2,240 km
\(^{2}\)
in High Mountain Asia as of 2022, with the highest lake concentrations located in the Eastern Himalaya. The majority of detected lakes were small to moderate in size (< 100,000 m
\(^{2}\)
) and predominantly situated at elevations between 4,000 and 5,400 m asl. Although the total glacial lake area exhibited a 5.5% change between 2016-17 and 2022-24, regional variations were significant, with Qilian Shan experiencing a 22.5% increase. Comparison with existing studies confirms that our automated inventory achieves higher accuracy than other automated methods and closely matches manual inventories. Thus, this dataset provides a good baseline for an updated glacial lake inventory of HMA, supporting future research and monitoring efforts. This study also highlights the potential of multi-year comparison of glacial lakes with consistent data as well as analyzing their stability and dynamics (shrinkage and expansion). The future work should extend this inventory to annual or intra-annual seasonal datasets which would enable better detection of rapid lake changes. Furthermore, integrating these glacial lake data products with GLOF hazard metrics, downstream vulnerability and exposure data would provide a more comprehensive framework for disaster risk reduction across the HMA region.
Data availability
The data described in this manuscript is distributed under the Creative Commons Attribution 4.0 International License and can be downloaded from the data repository Zenodo at
https://doi.org/10.5281/zenodo.17948783
References
Taylor, C., Robinson, T. R., Dunning, S., Rachel Carr, J. & Westoby, M. Glacial lake outburst floods threaten millions globally.
Nat. Commun.
14
, 487 (2023).
Article
ADS
CAS
PubMed
PubMed Central
Google Scholar
Zhang, M. et al. Glacial lake area changes in high mountain asia during 1990–2020 using satellite remote sensing.
Research
2022
, 9821275 (2022).
Wang, X. et al. Glacial lake inventory of high-mountain asia in 1990 and 2018 derived from landsat images.
Earth Syst. Sci. Data
12
, 2169–2182 (2020).
Article
ADS
Google Scholar
Chen, F., Zhang, M., Tian, B. & Li, Z. Extraction of glacial lake outlines in tibet plateau using landsat 8 imagery and google earth engine.
IEEE J. Sel. Top. Appl. Earth Obs. Remote Sens.
10
, 4002–4009 (2017).
Article
ADS
Google Scholar
Chen, F. et al. Annual 30 m dataset for glacial lakes in high mountain asia from 2008 to 2017.
Earth Syst. Sci. Data
13
, 741–766 (2021).
Article
ADS
Google Scholar
Nie, Y. et al. A regional-scale assessment of himalayan glacial lake changes using satellite observations from 1990 to 2015.
Remote Sens. Environ.
189
, 1–13 (2017).
Article
ADS
Google Scholar
Zhang, G. et al. Characteristics and changes of glacial lakes and outburst floods.
Nat. Rev. Earth Environ.
5
, 447–462 (2024).
Article
ADS
Google Scholar
Shrestha, F. et al. A comprehensive and version-controlled database of glacial lake outburst floods in high mountain asia.
Earth Syst. Sci. Data
15
, 3941–3961 (2023).
Article
ADS
Google Scholar
Sattar, A. et al. The sikkim flood of october 2023: drivers, causes, and impacts of a multihazard cascade.
Science
387
, eads2659 (2025).
Article
CAS
PubMed
Google Scholar
Shugar, D. H. et al. Rapid worldwide growth of glacial lakes since 1990.
Nat. Clim. Change
10
, 939–945 (2020).
Article
ADS
CAS
Google Scholar
Furian, W., Maussion, F. & Schneider, C. Projected 21st-century glacial lake evolution in high mountain asia.
Front. Earth Sci.
10
, 821798 (2022).
Article
Google Scholar
Kraaijenbrink, P. D., Bierkens, M. F., Lutz, A. F. & Immerzeel, W. Impact of a global temperature rise of 1.5 degrees celsius on asia’s glaciers.
Nature
549
, 257–260 (2017).
Article
ADS
CAS
PubMed
Google Scholar
Linsbauer, A. et al. Modelling glacier-bed overdeepenings and possible future lakes for the glaciers in the himalaya-karakoram region.
Ann. Glaciol.
57
, 119–130 (2016).
Article
ADS
Google Scholar
Zheng, G. et al. Increasing risk of glacial lake outburst floods from future third pole deglaciation.
Nat. Clim. Change
11
, 411–417 (2021).
Article
ADS
Google Scholar
Haritashya, U. K. et al. Evolution and controls of large glacial lakes in the nepal himalaya.
Remote Sens. Environ.
10
, 798 (2018).
Article
Google Scholar
Khadka, N., Zhang, G. & Thakuri, S. Glacial lakes in the nepal himalaya: Inventory and decadal dynamics (1977–2017).
Remote Sens.
10
, 1913 (2018).
Article
ADS
Google Scholar
Shukla, A., Garg, P. K. & Srivastava, S. Evolution of glacial and high-altitude lakes in the sikkim, eastern himalaya over the past four decades (1975–2017).
Front. Environ. Sci.
6
, 81 (2018).
Article
Google Scholar
Zhang, G., Yao, T., Xie, H., Wang, W. & Yang, W. An inventory of glacial lakes in the third pole region and their changes in response to global warming.
Glob. Planet. Chang.
131
, 148–157 (2015).
Article
ADS
Google Scholar
Sundal, A. et al. Evolution of supra-glacial lakes across the greenland ice sheet.
Remote Sens. Environ.
113
, 2164–2171 (2009).
Article
ADS
Google Scholar
Wang, X., Liu, Q., Liu, S., Wei, J. & Jiang, Z. Heterogeneity of glacial lake expansion and its contrasting signals with climate change in tarim basin, central asia.
Environ. Earth Sci.
75
, 1–11 (2016).
ADS
Google Scholar
Ahmed, R. et al. A review of glacial lake expansion and associated glacial lake outburst floods in the himalayan region.
Earth Syst. Environ.
5
, 695–708 (2021).
Article
ADS
Google Scholar
Hugonnet, R. et al. Accelerated global glacier mass loss in the early twenty-first century.
Nature
592
, 726–731 (2021).
Article
ADS
CAS
PubMed
Google Scholar
Zhang, G. et al. Glacial lake evolution and glacier-lake interactions in the poiqu river basin, central himalaya, 1964–2017.
J. Glaciol.
65
, 347–365 (2019).
Article
ADS
Google Scholar
Miles, K. E., Willis, I. C., Benedek, C. L., Williamson, A. G. & Tedesco, M. Toward monitoring surface and subsurface lakes on the greenland ice sheet using sentinel-1 sar and landsat-8 oli imagery.
Front. Earth Sci.
5
, 251152 (2017).
Article
Google Scholar
Zeng, L., Schmitt, M., Li, L. & Zhu, X. X. Analysing changes of the poyang lake water area using sentinel-1 synthetic aperture radar imagery.
Int. J. Remote. Sens.
38
, 7041–7069 (2017).
Article
Google Scholar
Zhang, M., Chen, F., Tian, B., Liang, D. & Yang, A. High-frequency glacial lake mapping using time series of sentinel-1a/1b sar imagery: An assessment for the southeastern tibetan plateau.
Int. J. Environ. Res. Public Health
17
, 1072 (2020).
Article
PubMed
PubMed Central
Google Scholar
Gardelle, J., Arnaud, Y. & Berthier, E. Contrasted evolution of glacial lakes along the hindu kush himalaya mountain range between 1990 and 2009.
Glob. Planet. Chang.
75
, 47–55 (2011).
Article
ADS
Google Scholar
Hu, J. et al. A glacial lake mapping framework in high mountain areas: A case study of the southeastern tibetan plateau.
IEEE Trans. Geosci. Remote Sens.
62
, 1–12 (2024).
ADS
Google Scholar
Qayyum, N., Ghuffar, S., Ahmad, H. M., Yousaf, A. & Shahid, I. Glacial lakes mapping using multi satellite planetscope imagery and deep learning.
ISPRS Int. J. Geo-Inf.
9
, 560 (2020).
Article
Google Scholar
Wangchuk, S. & Bolch, T. Mapping of glacial lakes using sentinel-1 and sentinel-2 data and a random forest classifier: Strengths and challenges.
Sci. Remote Sens.
2
, 100008 (2020).
Article
Google Scholar
Sharma, A. & Prakash, C. Glacial lakes mapping using satellite images and deep learning algorithms in northwestern indian himalayas.
Model. Earth Syst. Environ.
10
, 2063–2077 (2024).
Article
Google Scholar
Dou, X. et al. Spatio-temporal evolution of glacial lakes in the tibetan plateau over the past 30 years.
Remote Sens.
15
, 416 (2023).
Article
ADS
Google Scholar
Luo, W., Zhang, G., Chen, W. & Xu, F. Response of glacial lakes to glacier and climate changes in the western nyainqentanglha range.
Sci. Total Environ.
735
, 139607 (2020).
Article
CAS
PubMed
Google Scholar
Kaushik, S., Singh, T., Joshi, P. K. & Dietz, A. J. Automated mapping of glacial lakes using multisource remote sensing data and deep convolutional neural network.
Int. J. Appl. Earth Obs. Geoinf.
115
, 103085 (2022).
Google Scholar
Sattar, A., Haritashya, U. K., Kargel, J. S. & Karki, A. Transition of a small himalayan glacier lake outburst flood to a giant transborder flood and debris flow.
Sci. Rep.
12
, 12421 (2022).
Article
ADS
CAS
PubMed
PubMed Central
Google Scholar
Muhammad, S. et al. A holistic view of shisper glacier surge and outburst floods: from physical processes to downstream impacts.
Geomat. Nat. Hazards Risk
12
, 2755–2775 (2021).
Article
Google Scholar
Lovell, H. & Muhammad, S. Multiple phases of ice-dammed lake formation and drainage associated with a surge of shisper glacier, western karakoram.
J. Glaciol.
71
, e10 (2025).
Article
ADS
Google Scholar
Xu, X., Liu, L., Huang, L. & Hu, Y. Combined use of multi-source satellite imagery and deep learning for automated mapping of glacial lakes in the bhutan himalaya.
Sci. Remote Sens.
10
, 100157 (2024).
Article
Google Scholar
Zhang, M., Chen, F., Zhao, H., Wang, J. & Wang, N. Recent changes of glacial lakes in the high mountain asia and its potential controlling factors analysis.
Remote Sens.
13
, 3757 (2021).
Article
ADS
CAS
Google Scholar
Sherpa, S. F., Smith, L. C., Wang, B. & Stuurman, C. Brief communication: Multisource remote sensing detects growing himalayan glacial lake outburst flood hazards.
EGUsphere
2025
, 1–9 (2025).
Google Scholar
Allen, S. K., Zhang, G., Wang, W., Yao, T. & Bolch, T. Potentially dangerous glacial lakes across the tibetan plateau revealed using a large-scale automated assessment approach.
Sci. Bull.
64
, 435–445 (2019).
Article
Google Scholar
Song, C. et al. Heterogeneous glacial lake changes and links of lake expansions to the rapid thinning of adjacent glacier termini in the himalayas.
Geomorphology
280
, 30–38 (2017).
Article
ADS
Google Scholar
Veh, G., Korup, O., Roessner, S. & Walz, A. Detecting himalayan glacial lake outburst floods from landsat time series.
Remote Sens. Environ.
207
, 84–97 (2018).
Article
ADS
Google Scholar
Lesi, M. et al. Landsat and sentinel-derived glacial lake dataset in the china-pakistan economic corridor from 1990 to 2020.
Earth Syst. Sci. Data Discuss.
2022
, 1–33 (2022).
Google Scholar
Haritashya, U. K., Singh, V. P. & Singh, P. Paternoster lakes. In:
Encyclopedia of snow, ice and glaciers
, 826–826 (Springer, 2011).
Franks, S. & Rengarajan, R. Evaluation of copernicus dem and comparison to the dem used for landsat collection-2 processing.
Remote Sens.
15
, 2509 (2023).
Article
ADS
Google Scholar
RGI 7.0 Consortium. Randolph glacier inventory - a dataset of global glacier outlines, version 7.0,
https://doi.org/10.5067/f6jmovy5navz
(2023). Online access.
McFeeters, S. K. The use of the normalized difference water index (ndwi) in the delineation of open water features.
Int. J. Remote. Sens.
17
, 1425–1432 (1996).
Article
Google Scholar
Xu, H. Modification of normalised difference water index (ndwi) to enhance open water features in remotely sensed imagery.
Int. J. Remote. Sens.
27
, 3025–3033 (2006).
Article
Google Scholar
Pasquarella, V. J., Brown, C. F., Czerwinski, W. & Rucklidge, W. J. Comprehensive quality assessment of optical satellite imagery using weakly supervised video learning. In
Proceedings of the IEEE/CVF Conference on Computer Vision and Pattern Recognition
, 2125–2135 (2023).
Lehner, B. & Grill, G. Global river hydrography and network routing: baseline data and new approaches to study the world’s large river systems.
Hydrol. Process.
27
, 2171–2186 (2013).
Article
ADS
Google Scholar
Fugger, S. et al. Understanding monsoon controls on the energy and mass balance of glaciers in the central and eastern himalaya.
The Cryosphere
16
, 1631–1652 (2022).
Article
ADS
Google Scholar
Wang, R., Liu, S., Shangguan, D., Radić, V. & Zhang, Y. Spatial heterogeneity in glacier mass-balance sensitivity across high mountain asia.
Water
11
, 776 (2019).
Article
Google Scholar
Stumpf, A., Michéa, D. & Malet, J.-P. Improved co-registration of sentinel-2 and landsat-8 imagery for earth surface motion measurements.
Remote Sens.
10
, 160 (2018).
Article
ADS
Google Scholar
Zhang, T., Wang, W., An, B. & Wei, L. Enhanced glacial lake activity threatens numerous communities and infrastructure in the third pole.
Nat. Commun.
14
, 8250 (2023).
Article
ADS
CAS
PubMed
PubMed Central
Google Scholar
Download references
Acknowledgements
The authors acknowledge the open-access datasets made available through the Google Earth Engine platform, including Landsat-8 (USGS), Sentinel-1 and Sentinel-2 (Copernicus programme, ESA), the Copernicus Digital Elevation Model (DEM), and NASA’s Terra MODIS products. The authors would also like to thank the Editor, Dr. Irfan Rashid, and the four anonymous reviewers for their constructive comments and suggestions. The authors are grateful for partial support from the Geo Mountains Small Grant 2023 (HiRISK) by Swiss Agency for Development and Cooperation (SDC).
Funding
The first author acknowledges the financial support received from the Ministry of Education, Government of India, in the form of a Ph.D. fellowship.
Author information
Authors and Affiliations
Department of Civil Engineering, Indian Institute of Technology Roorkee, Roorkee, Uttarakhand, 247667, India
Ravindra Kumar & Saurabh Vijay
Authors
Ravindra Kumar
View author publications
Search author on:
PubMed
Google Scholar
Saurabh Vijay
View author publications
Search author on:
PubMed
Google Scholar
Contributions
SV conceived the original idea and supervised the study. RK designed the methodology, processed the data, performed the analysis, and prepared the figures. Both authors jointly interpreted the results. RK drafted the manuscript with inputs and revisions from SV. Both authors reviewed and approved the final version of the manuscript for publication.
Corresponding author
Correspondence to
Saurabh Vijay
.
Ethics declarations
Competing interests
The authors declare no competing interests.
Additional information
Publisher’s note
Springer Nature remains neutral with regard to jurisdictional claims in published maps and institutional affiliations.
Supplementary Information
Supplementary Information. (download PDF
)
Rights and permissions
Open Access
This article is licensed under a Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License, which permits any non-commercial use, sharing, distribution and reproduction in any medium or format, as long as you give appropriate credit to the original author(s) and the source, provide a link to the Creative Commons licence, and indicate if you modified the licensed material. You do not have permission under this licence to share adapted material derived from this article or parts of it. The images or other third party material in this article are included in the article’s Creative Commons licence, unless indicated otherwise in a credit line to the material. If material is not included in the article’s Creative Commons licence and your intended use is not permitted by statutory regulation or exceeds the permitted use, you will need to obtain permission directly from the copyright holder. To view a copy of this licence, visit
http://creativecommons.org/licenses/by-nc-nd/4.0/
.
Reprints and permissions
About this article
Cite this article
Kumar, R., Vijay, S. Automated satellite-based glacial lake inventory and change detection in High Mountain Asia.
Sci Rep
16
, 5760 (2026). https://doi.org/10.1038/s41598-026-35446-0
Download citation
Received
:
03 May 2025
Accepted
:
06 January 2026
Published
:
19 January 2026
Version of record
:
11 February 2026
DOI
:
https://doi.org/10.1038/s41598-026-35446-0
Share this article
Anyone you share the following link with will be able to read this content:
Get shareable link
Sorry, a shareable link is not currently available for this article.
Copy shareable link to clipboard
Provided by the Springer Nature SharedIt content-sharing initiative
Search
Search articles by subject, keyword or author
Show results from
All journals
This journal
Search
Advanced search
Quick links
Explore articles by subject
Find a job
Guide to authors
Editorial policies
Close banner
Close
Sign up for the
Nature Briefing
newsletter — what matters in science, free to your inbox daily.
Email address
Sign up
I agree my information will be processed in accordance with the
Nature
and Springer Nature Limited
Privacy Policy
.
Close banner
Close
Get the most important science stories of the day, free in your inbox.
Sign up for Nature Briefing