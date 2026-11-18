---
title: Some recent developments in Hydro-Meteorological data
id: some-recent-developments-in-hydro-meteorological-data
tags:
- nepal-data-feeds
- atlas-improvement-research-177509
created: '2026-11-18T12:54:58.392112Z'
updated: '2026-11-18T12:56:51.944354Z'
source: https://old.wmo.int/extranet/pages/prog/www/IMOP/publications/IOM-116_TECO-2014/Session%201/P1_21_Karki-Hydromet_Dev_in_Nepal.pdf
source_domain: old.wmo.int
fetched_at: '2026-11-18T12:54:58.391091Z'
fetch_provider: builtin
status: draft
type: note
tier: institutional
content_type: paper
deprecated: false
summary: 'DHM (Karki, WMO TECO 2014): shift from postal/VHF to CDMA/GPRS real-time
  transmission, 5-minute telemetry in monsoon, SMS-to-web for manual climate data,
  14 synoptic stations; older context for DHM data feeds.'
raw_file: raw/some-recent-developments-in-hydro-meteorological-data.pdf
---

Some recent developments in Hydro-Meteorological data 
transmission from remote Manual as well as Automatic 
weather and Hydrological stations in Nepal 
 
Ramchandra Karki and Chiranjibi Bhetuwal 
Department of Hydrology and Meteorology 
Government of Nepal 
P.O. Box 406, Babarmahal, Kathmandu, Nepal 
Email: rammetro@hotmail.com, ramchandra@dhm.gov.np (Corresponding Author) 
 
 
Abstract: 
The timely Collection and integration of Hydro-meteorological data and information from remote hydro-meteorological 
stations is the backbone for providing weather, climate and water related warning, forecast and services. 
Because of the poor communication infrastructures and geographical complexities, this was the most challenging job in 
mountainous countries like Nepal in past and data were collected in the central office after months and year. 
Recently, with the rapid expansion of mobile phone networks in the country the CDMA and GPRS (GSM) mobile internet and 
SMS facilities are available in many places. This development in the mobile wireless technology has improved the timely and 
more frequent hydro-meteorological data collection, integration and dissemination of warnings and forecast in the country 
prone to more severe and frequent hydro-meteorological disasters. 
This paper describes the recent developments in the data collection process from remote manual as well as automatic weather 
and hydrological stations in central real time database server using mobile internet and SMS facilities in Nepal. 
 
In the system, the real time data transmission from remote automatic weather and hydrological stations to data server for 
warning and forecasting is based on CDMA and GPRS mobile internet. Tele-terminals based on CDMA internet are utilized for 
manual SYNOP data transmission to central server. Similarly, mobile application (SMS to web server)) is developed and being 
planned to operationalized within few months for manual climate data transmission once a day from remote climate stations to 
central server for climate services.   
Tele-terminals and mobile applications are the very specific tools for developing countries mostly relying in manual 
measurements. 
 
 
Introduction: 
Globally, by observing, forecasting and warning of weather, climate and water related threats, national 
hydro-meteorological services (NHMSs) make a significant contribution to safety, security and economic 
well-being. 
The observation and timely collection of data and information from remote Weather and Hydrological 
stations is the primary source of information for all the services provided by NHMSs.  
The timely collection of data from remote stations in the central system was most difficult task in past in 
Nepal. It used to take months to collect the data via the regular postal mail from most of the remote 
stations and the synoptic data collection was based on VHF wireless. 
Recently, with the rapid expansion of mobile networks in Nepal, the hydro-meteorological data 
collection process has also been improved from both Manual and Automatic Stations. 
 


---

The main objective of this paper work is to discuss on the recent developments and future plans for 
timely data collection in central database server from remote Manual as well as Automatic hydro-
meteorological stations maintained by Department of Hydrology and Meteorology (DHM) Nepal. 
 
 
Data collection Process for different applications: 
Flood Forecasting: 
The flood forecasting project of DHM was based only on traditional manual observation system in the 
past. In that system, manual rainfall and water level observation used to be transmitted via telephone or 
VHF wireless communication set in a regular interval in day time only by the observer. The flood in rivers 
upto Nepal border are of short lead time and the observation and transmission of limited data by 
observer during day time only had limited the effectiveness of flood early warning system. 
Recently with the expansion of wireless mobile communication technology over the nation, the real 
time automatic river and rainfall monitoring system are being implemented in some of the river basins 
of Nepal for frequent observation and data transmission in order to meet the demand of flood 
forecasting and warning. 
 
 
Fig 1: Process Diagram of Flood Forecasting Telemetric data transmission  
 
Automatic River gauging and 
Rainfall Station
in case the CDMA/GPRS internet 
connection fails and value crosses 
defined threshold then direct SMS of 
data to stakeholders and data server 
Hydrological Database Server at 
NITC
Real time Quality Control
CDMA/GPRS/Iridium 
Communication to 
Internet 
www.hydrology.gov.np 
Graphs 
Google 
Map 
Tabular Data 
Remote Configuration 
of station from web 
interface 
Data Visualization 


---

In the system, meteorological and hydrological sensors from reputed manufactures are utilized and data 
acquisition and communication model locally developed by private company of Nepal is used. 
The data communication is based on dual GSM (GPRS) and CDMA (PSDN) mobile internet embedded in 
single communication module for uninterrupted data transmission to the central server. The use of dual 
modem is due to the low network of mobile communication in the rural remote areas. In the recent 
module iridium satellite communication modem is also embedded in the single communication module 
for the data transmission in harsh condition. 
If the data sending via mobile internet with GPRS and CDMA is not possible and the value crosses the 
threshold level then the system works with SMS data transmission to the central server and the related 
main stakeholders for early warning and necessary planning. 
The data from the remote stations are transmitted to the server in every 5 minutes during monsoon 
season. The system also logs and transmits the system information like battery voltage, charging, mobile 
signal levels, sensors status and mobile balance for fault identification and maintenance.  The error 
message are transmitted via SMS and email as well. The other important feature is the remote setting of 
all configuration of the system using simple web interface. 
 
 


---

 
Fig 2:  Different visualization features in Flood Forecasting System. 
 
Tele-terminals for SYNOP data transmission: 
The traditional SYNOP data transmission from the synoptic stations for weather forecasting and global 
data transmission was based on the wireless VHF communication system to the meteorological head 
quarter in Kathmandu. This communication was based on voice communication and copying the 
information in sheet. The voice communication from the system had a lot interference and had 
dependency on person. In order to overcome these problems, Tele-Terminal systems based on CDMA 
internet data transmission manufactured locally was implemented and is in operation since more than 5 
years in 14 Synoptic stations of Nepal.  
In the system, the observer from synoptic offices enters the data in coded SYNOP format in Tele-
terminal unit in every synoptic hours and data is posted to the server and available via web interface. 
The SYNOP from different stations are then quality checked in meteorological forecasting division 
headquarter at Kathmandu and manually transmitted in regional hub in GTS. This system is 
comparatively more reliable then VHF communication as the data are transmitted and integrated in one 
web page. The data are also decoded and stored in database for different uses (Fig 4). 
 


---

 
Fig 3: Tele-terminal and VHF Set 
 
Tele-terminals with 
data entry from 
Keyboard 
VHF Communication 
set


---

Fig 4: Process diagram of Tele-terminal system data flow 
 
Recently, the new modern online database system based on PostgreSQL language system is installed 
with the technical support from Finnish Meteorological Institute. This database system will soon replace 
the traditional database system of the department 
It is the real time database system with the capability to handle both automatic and manual stations 
data. This new system is sophisticated with all the quality controlling features like limit test, persistency 
check, consistency check and human quality control. The data are then quality flagged according to the 
WMO guidelines and stored in final database table. The database also includes the METADATA page for 
station information. 
Most of the historical climate data from the old database system is already transferred to the new 
database and a simple online page is created from where the remaining historical data files of old 
database can be directly uploaded to the new database. The real time automatic weather stations are 
also directly linked to the database. 
 Online data entry forms are also developed for data entry (from manual stations) from regional offices 
and stations. This will reduce the time for transferring the data to central office as the entered data will 
be available in the integrated way in central database as soon as soon as they are entered. The data 
entry personal can also see the error message in the data in the same online form. The online forms are 
in the final stage of testing and will be implemented very soon. 
Embedded CDMA modem for data 
transmission to Internet 
Decoded and used for 
weather forecasting and 
different uses 
www.mfd.gov.np/synop 
Tele-Terminals at Synoptic 
Office 
Meteorological Database 
Server at NITC
Manually edit and transmit  SYNOP 
to regional hub New Delhi


---

Fig 5: Online climate and SYNOP data entry form. 
 
The next features in final stage of deployment for timely data collection from manual stations is the 
mobile SMS to WEB system. In this system, the observers of manual climate stations observe the rainfall 
and air temperature data and send the data as SMS from mobile using simple mobile apps daily. The 
data will be then transferred as SMS to the central SMS receiving device (SMS to WEB gateway locally 
manufactured) installed at head office. This device will then further transfer the data to the 
meteorological database server using internet. The details process of this data transmission is presented 
in Fig 6. 
With the full implementation of this whole system, the meteorological data collection will be timely and 
integrated in one system and very beneficial for weather forecasting and warning and climate services. 
 


---

 
Fig 6: Process diagram of Meteorological data collection. 
 
Conclusions: 
The timely data collection process from remote hydro-meteorological stations has been improved with 
the mobile network coverage in most parts.  
Different mobile internet and SMS data transmission systems and online data entry systems have been 
implemented and some are in the planning phase for timely data collection and integration. The 
communication systems are locally manufactured by private company of Nepal and it has been relatively 
easier for maintenance and operational support due to the availability of all the technical manpower in 
Nepal. The Mobile SMS to WEB data transmission system and online data entry forms are the effective 
tools for the timely data collection for developing countries mostly relying on manual observations.  
 
Acknowledgements  
The authors are thankful to Saraju Kumar Baidya, Deputy Director General of DHM for his valuable 
comments and suggestions during the preparation of this Paper. 
The authors would also like to express their sincere thanks to Mr. Bishal Dahal for designing and editing 
all the Figures and diagrams.    
 
References: 
Flood Forecasting through Communication M2M  (available in www.rts.com.np) 
Gautam, D.K., Web Based Real Time Data Acquisition System for Flood Early Warning, National Stakeholders 
Workshop on Weather Forecasting and Flood Early Warning System in Nepal, April 8, 2011, Kathmandu 
Real time data acquisition system for Flood Forecasting, Final Report, 2008 (available in www.rts.com.np) 
Reference Websites for Figures and Information: www.hydrology.gov.np, www.dhm.gov.np, www.mfd.gov.np 
Mobile with manual climate 
data entry  Apps for observer
Meteorological 
Database Server at 
NITC
Online Data Entry Form for 
Climate data, SYNOP data 
from regional offices and 
others
Central SMS 
receiving and SMS 
to Web Gateway 
SMS 
Internet 
Real time QC 
and flagging 
Online access of Data 
for different users 
Historical climate data 
in GWbasic files  
Manual Observation from 
Climate Stations 
Internet 
Automatic Weather Station 
CDMA/GPRS/Iridiu
m Communication 
to Internet
