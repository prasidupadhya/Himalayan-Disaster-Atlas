// Generated from dataset.schema.json; run npm run contracts:generate. Do not edit.
"use strict";
module.exports = validate10;
module.exports.default = validate10;
const schema11 = {"$schema":"http://json-schema.org/draft-07/schema#","$id":"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json","title":"Atlas versioned presentation dataset","definitions":{"position":{"type":"array","items":[{"type":"number","minimum":-180,"maximum":180},{"type":"number","minimum":-90,"maximum":90}],"minItems":2,"maxItems":2,"additionalItems":false},"metadata":{"type":"object","additionalProperties":false,"properties":{"schema_version":{"const":"1.0.0"},"dataset_id":{"type":"string","pattern":"^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$"},"dataset_name":{"type":"string","minLength":1},"dataset_version":{"type":"string","pattern":"^[0-9]+\\.[0-9]+\\.[0-9]+$"},"source":{"type":"string","minLength":1},"source_url":{"anyOf":[{"type":"string","format":"uri","pattern":"^https://"},{"type":"null"}]},"license":{"type":"string","minLength":1},"license_url":{"anyOf":[{"type":"string","format":"uri","pattern":"^https://"},{"type":"null"}]},"attribution":{"type":"string","minLength":1},"observation_date":{"anyOf":[{"type":"string","format":"date-time"},{"type":"null"}]},"publication_date":{"anyOf":[{"type":"string","format":"date-time"},{"type":"null"}]},"retrieval_date":{"type":"string","format":"date-time"},"processing_date":{"type":"string","format":"date-time"},"processing_version":{"type":"string","minLength":1},"method":{"type":"string","minLength":1},"spatial_resolution":{"type":"object","additionalProperties":false,"properties":{"value":{"anyOf":[{"type":"number","exclusiveMinimum":0},{"type":"null"}]},"unit":{"enum":["m","degree",null]}},"required":["value","unit"]},"temporal_resolution":{"anyOf":[{"type":"string","minLength":1},{"type":"null"}]},"spatial_coverage":{"type":"object","additionalProperties":false,"properties":{"description":{"type":"string","minLength":1},"bbox":{"type":"array","items":{"type":"number"},"minItems":4,"maxItems":4}},"required":["description","bbox"]},"temporal_coverage":{"type":"object","additionalProperties":false,"properties":{"start":{"anyOf":[{"type":"string","format":"date-time"},{"type":"null"}]},"end":{"anyOf":[{"type":"string","format":"date-time"},{"type":"null"}]}},"required":["start","end"]},"crs":{"const":"OGC:CRS84"},"status":{"enum":["VERIFIED_SOURCE","SATELLITE_DERIVED","ATLAS_DERIVED","ESTIMATED","MODELLED","HISTORICAL","UNKNOWN"]},"evidence_type":{"enum":["observed","derived","estimated","modelled","historical","unknown"]},"is_fixture":{"type":"boolean"},"limitations":{"type":"array","items":{"type":"string","minLength":1},"minItems":1},"uncertainty":{"type":"string","minLength":1},"update_frequency":{"enum":["static","periodic","operational"]},"stale_after":{"anyOf":[{"type":"string","format":"date-time"},{"type":"null"}]},"artifact":{"type":"object","additionalProperties":false,"properties":{"path":{"type":"string","pattern":"^/data/[a-z0-9-]+/[0-9]+\\.[0-9]+\\.[0-9]+/features\\.geojson(?:\\.gz)?$"},"format":{"enum":["GeoJSON","GeoJSON+gzip"]},"sha256":{"type":"string","pattern":"^[a-f0-9]{64}$"},"byte_size":{"type":"integer","minimum":1}},"required":["path","format","sha256","byte_size"]}},"required":["schema_version","dataset_id","dataset_name","dataset_version","source","source_url","license","license_url","attribution","observation_date","publication_date","retrieval_date","processing_date","processing_version","method","spatial_resolution","temporal_resolution","spatial_coverage","temporal_coverage","crs","status","evidence_type","is_fixture","limitations","uncertainty","update_frequency","stale_after","artifact"],"allOf":[{"if":{"properties":{"status":{"const":"VERIFIED_SOURCE"}}},"then":{"properties":{"evidence_type":{"const":"observed"}}}},{"if":{"properties":{"status":{"const":"SATELLITE_DERIVED"}}},"then":{"properties":{"evidence_type":{"const":"derived"}}}},{"if":{"properties":{"status":{"const":"ATLAS_DERIVED"}}},"then":{"properties":{"evidence_type":{"const":"derived"}}}},{"if":{"properties":{"status":{"const":"ESTIMATED"}}},"then":{"properties":{"evidence_type":{"const":"estimated"}}}},{"if":{"properties":{"status":{"const":"MODELLED"}}},"then":{"properties":{"evidence_type":{"const":"modelled"}}}},{"if":{"properties":{"status":{"const":"HISTORICAL"}}},"then":{"properties":{"evidence_type":{"const":"historical"}}}},{"if":{"properties":{"status":{"const":"UNKNOWN"}}},"then":{"properties":{"evidence_type":{"const":"unknown"}}}},{"if":{"properties":{"is_fixture":{"const":false}}},"then":{"properties":{"source_url":{"type":"string","format":"uri","pattern":"^https://"},"license_url":{"type":"string","format":"uri","pattern":"^https://"}},"anyOf":[{"properties":{"observation_date":{"type":"string","format":"date-time"}}},{"properties":{"publication_date":{"type":"string","format":"date-time"}}}]}}]},"collection":{"type":"object","additionalProperties":false,"properties":{"type":{"const":"FeatureCollection"},"features":{"type":"array","items":{"type":"object","additionalProperties":false,"properties":{"type":{"const":"Feature"},"id":{"type":"string","pattern":"^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$"},"properties":{"type":"object","additionalProperties":false,"properties":{"dataset_id":{"type":"string","pattern":"^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$"},"dataset_version":{"type":"string","pattern":"^[0-9]+\\.[0-9]+\\.[0-9]+$"},"name":{"type":"string","minLength":1},"is_fixture":{"type":"boolean"},"value":{"type":["number","null"]},"unit":{"enum":["m","m2","km2","m3","m3/s","mm","degC","person","MW",null]},"admin_level":{"type":"integer","minimum":0,"maximum":3},"admin_category":{"enum":["country","province","district","local_level","special_area"]},"pcode":{"type":"string","pattern":"^NP[0-9]{0,7}$"},"parent_pcode":{"anyOf":[{"type":"string","pattern":"^NP[0-9]{0,4}$"},{"type":"null"}]},"parent_name":{"anyOf":[{"type":"string","minLength":1},{"type":"null"}]},"aliases":{"type":"array","items":{"type":"string","minLength":1},"uniqueItems":true},"label_longitude":{"type":"number","minimum":-180,"maximum":180},"label_latitude":{"type":"number","minimum":-90,"maximum":90},"valid_from":{"type":"string","format":"date-time"},"valid_to":{"anyOf":[{"type":"string","format":"date-time"},{"type":"null"}]},"source_version":{"type":"string","minLength":1},"entity_type":{"enum":["mountain","river","glacier","glacial_lake","hydrology_station","rainfall_station","disaster_event","earthquake","flood_event","landslide_event","hydropower_facility","infrastructure_asset"]},"source_id":{"type":"string","minLength":1},"search_terms":{"type":"array","items":{"type":"string","minLength":1},"minItems":1,"uniqueItems":true},"feature_code":{"type":"string","minLength":1},"source_modified":{"type":"string","format":"date"},"elevation_reference":{"type":"string","minLength":1},"river_name":{"type":["string","null"]},"downstream_id":{"type":["string","null"]},"downstream_in_release":{"type":"boolean"},"main_river_id":{"type":"string","minLength":1},"flow_order":{"type":"integer","minimum":1},"length_km":{"type":"number","minimum":0},"distance_downstream_km":{"type":"number","minimum":0},"distance_upstream_km":{"type":"number","minimum":0},"catchment_area_km2":{"type":"number","minimum":0},"upstream_area_km2":{"type":"number","minimum":0},"average_discharge_m3s":{"type":"number","minimum":0},"flow_regime":{"enum":["perennial","intermittent","unknown"]},"hydrobasin_level12_id":{"type":"string","minLength":1},"glacier_name":{"type":["string","null"]},"glims_id":{"type":"string","minLength":1},"outline_date":{"type":"string","format":"date"},"area_km2":{"type":"number","exclusiveMinimum":0},"centroid_longitude":{"type":"number","minimum":-180,"maximum":180},"centroid_latitude":{"type":"number","minimum":-90,"maximum":90},"elevation_min_m":{"type":"number"},"elevation_max_m":{"type":"number"},"elevation_mean_m":{"type":"number"},"dem_source":{"type":"string","minLength":1},"inventory_region":{"type":"string","minLength":1},"display_geometry_repaired":{"type":"boolean"},"lake_name":{"type":["string","null"]},"country":{"type":"string","minLength":1},"basin":{"type":["string","null"],"minLength":1},"connectivity":{"enum":["Glacier-fed","Non Glacier-fed"]},"data_source":{"type":"string","minLength":1},"inventory_period":{"type":"string","minLength":1},"perimeter_km":{"type":"number","exclusiveMinimum":0},"expansion_rate_km2_per_year":{"type":["number","null"]},"expansion_uncertainty_km2_per_year":{"type":["number","null"],"minimum":0},"expansion_significant":{"type":["boolean","null"]},"station_name":{"type":"string","minLength":1},"observation_time":{"type":["string","null"],"format":"date-time"},"water_level_m":{"type":["number","null"]},"warning_level_m":{"type":["number","null"]},"danger_level_m":{"type":["number","null"]},"threshold_order_valid":{"type":"boolean"},"station_status":{"type":"string","minLength":1},"trend":{"type":["string","null"]},"station_series_id":{"type":"string","minLength":1},"provider":{"type":"string","minLength":1},"elevation_m":{"type":["number","null"]},"coordinate_order_repaired":{"type":"boolean"},"rainfall_1h_mm":{"type":["number","null"],"minimum":0},"rainfall_3h_mm":{"type":["number","null"],"minimum":0},"rainfall_6h_mm":{"type":["number","null"],"minimum":0},"rainfall_12h_mm":{"type":["number","null"],"minimum":0},"rainfall_24h_mm":{"type":["number","null"],"minimum":0},"rainfall_quality_warning":{"type":"boolean"},"hazard_id":{"type":"string","minLength":1},"hazard_name":{"type":"string","minLength":1},"hazard_type":{"enum":["natural","non natural"]},"event_time":{"type":"string","format":"date-time"},"event_year":{"type":"integer","minimum":1900,"maximum":2200},"event_local_date":{"type":"string","format":"date"},"reported_time":{"type":["string","null"],"format":"date-time"},"verified":{"type":"boolean"},"approved":{"type":"boolean"},"source_label":{"type":["string","null"]},"data_source_name":{"type":["string","null"]},"loss_reference_id":{"type":["string","null"]},"reported_deaths":{"type":["integer","null"],"minimum":0},"reported_injured":{"type":["integer","null"],"minimum":0},"reported_missing":{"type":["integer","null"],"minimum":0},"reported_affected":{"type":["integer","null"],"minimum":0},"estimated_loss_npr":{"type":["number","null"],"minimum":0},"street_address":{"type":["string","null"]},"event_description":{"type":["string","null"]},"magnitude":{"type":"number"},"depth_km":{"type":"number","minimum":-100,"maximum":1000},"place_name":{"type":["string","null"]},"magnitude_type":{"type":["string","null"]},"network":{"type":"string","minLength":1},"significance":{"type":"integer","minimum":0},"event_status":{"type":"string","minLength":1},"epicenter_only":{"type":"boolean"},"evidence_status":{"enum":["observed","reported","derived","modelled"]},"hazard_footprint":{"type":"boolean"},"flood_class":{"type":"string","minLength":1},"landslide_category":{"type":"string","minLength":1},"confidence":{"type":["string","null"]},"confidence_basis":{"type":"string","minLength":1},"susceptibility_output":{"type":"boolean"},"facility_name":{"type":["string","null"]},"facility_status":{"type":"string","minLength":1},"facility_type":{"type":"string","minLength":1},"capacity_mw":{"type":["number","null"],"minimum":0},"plant_method":{"type":["string","null"]},"operator_name":{"type":["string","null"]},"osm_element_type":{"enum":["node","way","relation"]},"osm_element_id":{"type":"string","minLength":1},"osm_source_timestamp":{"type":"string","format":"date-time"},"infrastructure_class":{"enum":["road","bridge","school","health","emergency","settlement"]},"asset_name":{"type":["string","null"]},"asset_subtype":{"type":"string","minLength":1},"position_basis":{"type":"string","minLength":1},"display_geometry_simplified":{"type":"boolean"},"asset_ref":{"type":["string","null"]},"surface":{"type":["string","null"]}},"required":["dataset_id","dataset_version","name","is_fixture","value","unit"]},"geometry":{"oneOf":[{"type":"object","additionalProperties":false,"properties":{"type":{"const":"Point"},"coordinates":{"$ref":"#/definitions/position"}},"required":["type","coordinates"]},{"type":"object","additionalProperties":false,"properties":{"type":{"const":"MultiPoint"},"coordinates":{"type":"array","items":{"$ref":"#/definitions/position"},"minItems":1}},"required":["type","coordinates"]},{"type":"object","additionalProperties":false,"properties":{"type":{"const":"LineString"},"coordinates":{"type":"array","items":{"$ref":"#/definitions/position"},"minItems":2}},"required":["type","coordinates"]},{"type":"object","additionalProperties":false,"properties":{"type":{"const":"MultiLineString"},"coordinates":{"type":"array","items":{"type":"array","items":{"$ref":"#/definitions/position"},"minItems":2},"minItems":1}},"required":["type","coordinates"]},{"type":"object","additionalProperties":false,"properties":{"type":{"const":"Polygon"},"coordinates":{"type":"array","items":{"type":"array","items":{"$ref":"#/definitions/position"},"minItems":4},"minItems":1}},"required":["type","coordinates"]},{"type":"object","additionalProperties":false,"properties":{"type":{"const":"MultiPolygon"},"coordinates":{"type":"array","items":{"type":"array","items":{"type":"array","items":{"$ref":"#/definitions/position"},"minItems":4},"minItems":1},"minItems":1}},"required":["type","coordinates"]}]}},"required":["type","id","properties","geometry"]}}},"required":["type","features"]}},"type":"object","additionalProperties":false,"properties":{"metadata":{"$ref":"#/definitions/metadata"},"collection":{"$ref":"#/definitions/collection"}},"required":["metadata","collection"]};
const schema12 = {"type":"object","additionalProperties":false,"properties":{"schema_version":{"const":"1.0.0"},"dataset_id":{"type":"string","pattern":"^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$"},"dataset_name":{"type":"string","minLength":1},"dataset_version":{"type":"string","pattern":"^[0-9]+\\.[0-9]+\\.[0-9]+$"},"source":{"type":"string","minLength":1},"source_url":{"anyOf":[{"type":"string","format":"uri","pattern":"^https://"},{"type":"null"}]},"license":{"type":"string","minLength":1},"license_url":{"anyOf":[{"type":"string","format":"uri","pattern":"^https://"},{"type":"null"}]},"attribution":{"type":"string","minLength":1},"observation_date":{"anyOf":[{"type":"string","format":"date-time"},{"type":"null"}]},"publication_date":{"anyOf":[{"type":"string","format":"date-time"},{"type":"null"}]},"retrieval_date":{"type":"string","format":"date-time"},"processing_date":{"type":"string","format":"date-time"},"processing_version":{"type":"string","minLength":1},"method":{"type":"string","minLength":1},"spatial_resolution":{"type":"object","additionalProperties":false,"properties":{"value":{"anyOf":[{"type":"number","exclusiveMinimum":0},{"type":"null"}]},"unit":{"enum":["m","degree",null]}},"required":["value","unit"]},"temporal_resolution":{"anyOf":[{"type":"string","minLength":1},{"type":"null"}]},"spatial_coverage":{"type":"object","additionalProperties":false,"properties":{"description":{"type":"string","minLength":1},"bbox":{"type":"array","items":{"type":"number"},"minItems":4,"maxItems":4}},"required":["description","bbox"]},"temporal_coverage":{"type":"object","additionalProperties":false,"properties":{"start":{"anyOf":[{"type":"string","format":"date-time"},{"type":"null"}]},"end":{"anyOf":[{"type":"string","format":"date-time"},{"type":"null"}]}},"required":["start","end"]},"crs":{"const":"OGC:CRS84"},"status":{"enum":["VERIFIED_SOURCE","SATELLITE_DERIVED","ATLAS_DERIVED","ESTIMATED","MODELLED","HISTORICAL","UNKNOWN"]},"evidence_type":{"enum":["observed","derived","estimated","modelled","historical","unknown"]},"is_fixture":{"type":"boolean"},"limitations":{"type":"array","items":{"type":"string","minLength":1},"minItems":1},"uncertainty":{"type":"string","minLength":1},"update_frequency":{"enum":["static","periodic","operational"]},"stale_after":{"anyOf":[{"type":"string","format":"date-time"},{"type":"null"}]},"artifact":{"type":"object","additionalProperties":false,"properties":{"path":{"type":"string","pattern":"^/data/[a-z0-9-]+/[0-9]+\\.[0-9]+\\.[0-9]+/features\\.geojson(?:\\.gz)?$"},"format":{"enum":["GeoJSON","GeoJSON+gzip"]},"sha256":{"type":"string","pattern":"^[a-f0-9]{64}$"},"byte_size":{"type":"integer","minimum":1}},"required":["path","format","sha256","byte_size"]}},"required":["schema_version","dataset_id","dataset_name","dataset_version","source","source_url","license","license_url","attribution","observation_date","publication_date","retrieval_date","processing_date","processing_version","method","spatial_resolution","temporal_resolution","spatial_coverage","temporal_coverage","crs","status","evidence_type","is_fixture","limitations","uncertainty","update_frequency","stale_after","artifact"],"allOf":[{"if":{"properties":{"status":{"const":"VERIFIED_SOURCE"}}},"then":{"properties":{"evidence_type":{"const":"observed"}}}},{"if":{"properties":{"status":{"const":"SATELLITE_DERIVED"}}},"then":{"properties":{"evidence_type":{"const":"derived"}}}},{"if":{"properties":{"status":{"const":"ATLAS_DERIVED"}}},"then":{"properties":{"evidence_type":{"const":"derived"}}}},{"if":{"properties":{"status":{"const":"ESTIMATED"}}},"then":{"properties":{"evidence_type":{"const":"estimated"}}}},{"if":{"properties":{"status":{"const":"MODELLED"}}},"then":{"properties":{"evidence_type":{"const":"modelled"}}}},{"if":{"properties":{"status":{"const":"HISTORICAL"}}},"then":{"properties":{"evidence_type":{"const":"historical"}}}},{"if":{"properties":{"status":{"const":"UNKNOWN"}}},"then":{"properties":{"evidence_type":{"const":"unknown"}}}},{"if":{"properties":{"is_fixture":{"const":false}}},"then":{"properties":{"source_url":{"type":"string","format":"uri","pattern":"^https://"},"license_url":{"type":"string","format":"uri","pattern":"^https://"}},"anyOf":[{"properties":{"observation_date":{"type":"string","format":"date-time"}}},{"properties":{"publication_date":{"type":"string","format":"date-time"}}}]}}]};
const formats0 = require("ajv-formats/dist/formats").fullFormats["date-time"];
const formats4 = require("ajv-formats/dist/formats").fullFormats.uri;
const pattern0 = new RegExp("^https://", "u");
const pattern2 = new RegExp("^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$", "u");
const pattern3 = new RegExp("^[0-9]+\\.[0-9]+\\.[0-9]+$", "u");
const pattern6 = new RegExp("^/data/[a-z0-9-]+/[0-9]+\\.[0-9]+\\.[0-9]+/features\\.geojson(?:\\.gz)?$", "u");
const pattern7 = new RegExp("^[a-f0-9]{64}$", "u");
const func2 = Object.prototype.hasOwnProperty;
const func3 = require("ajv/dist/runtime/ucs2length").default;
const schema13 = {"type":"object","additionalProperties":false,"properties":{"type":{"const":"FeatureCollection"},"features":{"type":"array","items":{"type":"object","additionalProperties":false,"properties":{"type":{"const":"Feature"},"id":{"type":"string","pattern":"^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$"},"properties":{"type":"object","additionalProperties":false,"properties":{"dataset_id":{"type":"string","pattern":"^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$"},"dataset_version":{"type":"string","pattern":"^[0-9]+\\.[0-9]+\\.[0-9]+$"},"name":{"type":"string","minLength":1},"is_fixture":{"type":"boolean"},"value":{"type":["number","null"]},"unit":{"enum":["m","m2","km2","m3","m3/s","mm","degC","person","MW",null]},"admin_level":{"type":"integer","minimum":0,"maximum":3},"admin_category":{"enum":["country","province","district","local_level","special_area"]},"pcode":{"type":"string","pattern":"^NP[0-9]{0,7}$"},"parent_pcode":{"anyOf":[{"type":"string","pattern":"^NP[0-9]{0,4}$"},{"type":"null"}]},"parent_name":{"anyOf":[{"type":"string","minLength":1},{"type":"null"}]},"aliases":{"type":"array","items":{"type":"string","minLength":1},"uniqueItems":true},"label_longitude":{"type":"number","minimum":-180,"maximum":180},"label_latitude":{"type":"number","minimum":-90,"maximum":90},"valid_from":{"type":"string","format":"date-time"},"valid_to":{"anyOf":[{"type":"string","format":"date-time"},{"type":"null"}]},"source_version":{"type":"string","minLength":1},"entity_type":{"enum":["mountain","river","glacier","glacial_lake","hydrology_station","rainfall_station","disaster_event","earthquake","flood_event","landslide_event","hydropower_facility","infrastructure_asset"]},"source_id":{"type":"string","minLength":1},"search_terms":{"type":"array","items":{"type":"string","minLength":1},"minItems":1,"uniqueItems":true},"feature_code":{"type":"string","minLength":1},"source_modified":{"type":"string","format":"date"},"elevation_reference":{"type":"string","minLength":1},"river_name":{"type":["string","null"]},"downstream_id":{"type":["string","null"]},"downstream_in_release":{"type":"boolean"},"main_river_id":{"type":"string","minLength":1},"flow_order":{"type":"integer","minimum":1},"length_km":{"type":"number","minimum":0},"distance_downstream_km":{"type":"number","minimum":0},"distance_upstream_km":{"type":"number","minimum":0},"catchment_area_km2":{"type":"number","minimum":0},"upstream_area_km2":{"type":"number","minimum":0},"average_discharge_m3s":{"type":"number","minimum":0},"flow_regime":{"enum":["perennial","intermittent","unknown"]},"hydrobasin_level12_id":{"type":"string","minLength":1},"glacier_name":{"type":["string","null"]},"glims_id":{"type":"string","minLength":1},"outline_date":{"type":"string","format":"date"},"area_km2":{"type":"number","exclusiveMinimum":0},"centroid_longitude":{"type":"number","minimum":-180,"maximum":180},"centroid_latitude":{"type":"number","minimum":-90,"maximum":90},"elevation_min_m":{"type":"number"},"elevation_max_m":{"type":"number"},"elevation_mean_m":{"type":"number"},"dem_source":{"type":"string","minLength":1},"inventory_region":{"type":"string","minLength":1},"display_geometry_repaired":{"type":"boolean"},"lake_name":{"type":["string","null"]},"country":{"type":"string","minLength":1},"basin":{"type":["string","null"],"minLength":1},"connectivity":{"enum":["Glacier-fed","Non Glacier-fed"]},"data_source":{"type":"string","minLength":1},"inventory_period":{"type":"string","minLength":1},"perimeter_km":{"type":"number","exclusiveMinimum":0},"expansion_rate_km2_per_year":{"type":["number","null"]},"expansion_uncertainty_km2_per_year":{"type":["number","null"],"minimum":0},"expansion_significant":{"type":["boolean","null"]},"station_name":{"type":"string","minLength":1},"observation_time":{"type":["string","null"],"format":"date-time"},"water_level_m":{"type":["number","null"]},"warning_level_m":{"type":["number","null"]},"danger_level_m":{"type":["number","null"]},"threshold_order_valid":{"type":"boolean"},"station_status":{"type":"string","minLength":1},"trend":{"type":["string","null"]},"station_series_id":{"type":"string","minLength":1},"provider":{"type":"string","minLength":1},"elevation_m":{"type":["number","null"]},"coordinate_order_repaired":{"type":"boolean"},"rainfall_1h_mm":{"type":["number","null"],"minimum":0},"rainfall_3h_mm":{"type":["number","null"],"minimum":0},"rainfall_6h_mm":{"type":["number","null"],"minimum":0},"rainfall_12h_mm":{"type":["number","null"],"minimum":0},"rainfall_24h_mm":{"type":["number","null"],"minimum":0},"rainfall_quality_warning":{"type":"boolean"},"hazard_id":{"type":"string","minLength":1},"hazard_name":{"type":"string","minLength":1},"hazard_type":{"enum":["natural","non natural"]},"event_time":{"type":"string","format":"date-time"},"event_year":{"type":"integer","minimum":1900,"maximum":2200},"event_local_date":{"type":"string","format":"date"},"reported_time":{"type":["string","null"],"format":"date-time"},"verified":{"type":"boolean"},"approved":{"type":"boolean"},"source_label":{"type":["string","null"]},"data_source_name":{"type":["string","null"]},"loss_reference_id":{"type":["string","null"]},"reported_deaths":{"type":["integer","null"],"minimum":0},"reported_injured":{"type":["integer","null"],"minimum":0},"reported_missing":{"type":["integer","null"],"minimum":0},"reported_affected":{"type":["integer","null"],"minimum":0},"estimated_loss_npr":{"type":["number","null"],"minimum":0},"street_address":{"type":["string","null"]},"event_description":{"type":["string","null"]},"magnitude":{"type":"number"},"depth_km":{"type":"number","minimum":-100,"maximum":1000},"place_name":{"type":["string","null"]},"magnitude_type":{"type":["string","null"]},"network":{"type":"string","minLength":1},"significance":{"type":"integer","minimum":0},"event_status":{"type":"string","minLength":1},"epicenter_only":{"type":"boolean"},"evidence_status":{"enum":["observed","reported","derived","modelled"]},"hazard_footprint":{"type":"boolean"},"flood_class":{"type":"string","minLength":1},"landslide_category":{"type":"string","minLength":1},"confidence":{"type":["string","null"]},"confidence_basis":{"type":"string","minLength":1},"susceptibility_output":{"type":"boolean"},"facility_name":{"type":["string","null"]},"facility_status":{"type":"string","minLength":1},"facility_type":{"type":"string","minLength":1},"capacity_mw":{"type":["number","null"],"minimum":0},"plant_method":{"type":["string","null"]},"operator_name":{"type":["string","null"]},"osm_element_type":{"enum":["node","way","relation"]},"osm_element_id":{"type":"string","minLength":1},"osm_source_timestamp":{"type":"string","format":"date-time"},"infrastructure_class":{"enum":["road","bridge","school","health","emergency","settlement"]},"asset_name":{"type":["string","null"]},"asset_subtype":{"type":"string","minLength":1},"position_basis":{"type":"string","minLength":1},"display_geometry_simplified":{"type":"boolean"},"asset_ref":{"type":["string","null"]},"surface":{"type":["string","null"]}},"required":["dataset_id","dataset_version","name","is_fixture","value","unit"]},"geometry":{"oneOf":[{"type":"object","additionalProperties":false,"properties":{"type":{"const":"Point"},"coordinates":{"$ref":"#/definitions/position"}},"required":["type","coordinates"]},{"type":"object","additionalProperties":false,"properties":{"type":{"const":"MultiPoint"},"coordinates":{"type":"array","items":{"$ref":"#/definitions/position"},"minItems":1}},"required":["type","coordinates"]},{"type":"object","additionalProperties":false,"properties":{"type":{"const":"LineString"},"coordinates":{"type":"array","items":{"$ref":"#/definitions/position"},"minItems":2}},"required":["type","coordinates"]},{"type":"object","additionalProperties":false,"properties":{"type":{"const":"MultiLineString"},"coordinates":{"type":"array","items":{"type":"array","items":{"$ref":"#/definitions/position"},"minItems":2},"minItems":1}},"required":["type","coordinates"]},{"type":"object","additionalProperties":false,"properties":{"type":{"const":"Polygon"},"coordinates":{"type":"array","items":{"type":"array","items":{"$ref":"#/definitions/position"},"minItems":4},"minItems":1}},"required":["type","coordinates"]},{"type":"object","additionalProperties":false,"properties":{"type":{"const":"MultiPolygon"},"coordinates":{"type":"array","items":{"type":"array","items":{"type":"array","items":{"$ref":"#/definitions/position"},"minItems":4},"minItems":1},"minItems":1}},"required":["type","coordinates"]}]}},"required":["type","id","properties","geometry"]}}},"required":["type","features"]};
const schema14 = {"type":"array","items":[{"type":"number","minimum":-180,"maximum":180},{"type":"number","minimum":-90,"maximum":90}],"minItems":2,"maxItems":2,"additionalItems":false};
const pattern11 = new RegExp("^NP[0-9]{0,7}$", "u");
const pattern12 = new RegExp("^NP[0-9]{0,4}$", "u");
const formats30 = require("ajv-formats/dist/formats").fullFormats.date;

function validate11(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.type === undefined){
const err0 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "type"},message:"must have required property '"+"type"+"'"};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
if(data.features === undefined){
const err1 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "features"},message:"must have required property '"+"features"+"'"};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
for(const key0 in data){
if(!((key0 === "type") || (key0 === "features"))){
const err2 = {instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
}
if(data.type !== undefined){
if("FeatureCollection" !== data.type){
const err3 = {instancePath:instancePath+"/type",schemaPath:"#/properties/type/const",keyword:"const",params:{allowedValue: "FeatureCollection"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
}
if(data.features !== undefined){
let data1 = data.features;
if(Array.isArray(data1)){
const len0 = data1.length;
for(let i0=0; i0<len0; i0++){
let data2 = data1[i0];
if(data2 && typeof data2 == "object" && !Array.isArray(data2)){
if(data2.type === undefined){
const err4 = {instancePath:instancePath+"/features/" + i0,schemaPath:"#/properties/features/items/required",keyword:"required",params:{missingProperty: "type"},message:"must have required property '"+"type"+"'"};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
if(data2.id === undefined){
const err5 = {instancePath:instancePath+"/features/" + i0,schemaPath:"#/properties/features/items/required",keyword:"required",params:{missingProperty: "id"},message:"must have required property '"+"id"+"'"};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
if(data2.properties === undefined){
const err6 = {instancePath:instancePath+"/features/" + i0,schemaPath:"#/properties/features/items/required",keyword:"required",params:{missingProperty: "properties"},message:"must have required property '"+"properties"+"'"};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
if(data2.geometry === undefined){
const err7 = {instancePath:instancePath+"/features/" + i0,schemaPath:"#/properties/features/items/required",keyword:"required",params:{missingProperty: "geometry"},message:"must have required property '"+"geometry"+"'"};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
}
for(const key1 in data2){
if(!((((key1 === "type") || (key1 === "id")) || (key1 === "properties")) || (key1 === "geometry"))){
const err8 = {instancePath:instancePath+"/features/" + i0,schemaPath:"#/properties/features/items/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key1},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err8];
}
else {
vErrors.push(err8);
}
errors++;
}
}
if(data2.type !== undefined){
if("Feature" !== data2.type){
const err9 = {instancePath:instancePath+"/features/" + i0+"/type",schemaPath:"#/properties/features/items/properties/type/const",keyword:"const",params:{allowedValue: "Feature"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err9];
}
else {
vErrors.push(err9);
}
errors++;
}
}
if(data2.id !== undefined){
let data4 = data2.id;
if(typeof data4 === "string"){
if(!pattern2.test(data4)){
const err10 = {instancePath:instancePath+"/features/" + i0+"/id",schemaPath:"#/properties/features/items/properties/id/pattern",keyword:"pattern",params:{pattern: "^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$"},message:"must match pattern \""+"^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$"+"\""};
if(vErrors === null){
vErrors = [err10];
}
else {
vErrors.push(err10);
}
errors++;
}
}
else {
const err11 = {instancePath:instancePath+"/features/" + i0+"/id",schemaPath:"#/properties/features/items/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err11];
}
else {
vErrors.push(err11);
}
errors++;
}
}
if(data2.properties !== undefined){
let data5 = data2.properties;
if(data5 && typeof data5 == "object" && !Array.isArray(data5)){
if(data5.dataset_id === undefined){
const err12 = {instancePath:instancePath+"/features/" + i0+"/properties",schemaPath:"#/properties/features/items/properties/properties/required",keyword:"required",params:{missingProperty: "dataset_id"},message:"must have required property '"+"dataset_id"+"'"};
if(vErrors === null){
vErrors = [err12];
}
else {
vErrors.push(err12);
}
errors++;
}
if(data5.dataset_version === undefined){
const err13 = {instancePath:instancePath+"/features/" + i0+"/properties",schemaPath:"#/properties/features/items/properties/properties/required",keyword:"required",params:{missingProperty: "dataset_version"},message:"must have required property '"+"dataset_version"+"'"};
if(vErrors === null){
vErrors = [err13];
}
else {
vErrors.push(err13);
}
errors++;
}
if(data5.name === undefined){
const err14 = {instancePath:instancePath+"/features/" + i0+"/properties",schemaPath:"#/properties/features/items/properties/properties/required",keyword:"required",params:{missingProperty: "name"},message:"must have required property '"+"name"+"'"};
if(vErrors === null){
vErrors = [err14];
}
else {
vErrors.push(err14);
}
errors++;
}
if(data5.is_fixture === undefined){
const err15 = {instancePath:instancePath+"/features/" + i0+"/properties",schemaPath:"#/properties/features/items/properties/properties/required",keyword:"required",params:{missingProperty: "is_fixture"},message:"must have required property '"+"is_fixture"+"'"};
if(vErrors === null){
vErrors = [err15];
}
else {
vErrors.push(err15);
}
errors++;
}
if(data5.value === undefined){
const err16 = {instancePath:instancePath+"/features/" + i0+"/properties",schemaPath:"#/properties/features/items/properties/properties/required",keyword:"required",params:{missingProperty: "value"},message:"must have required property '"+"value"+"'"};
if(vErrors === null){
vErrors = [err16];
}
else {
vErrors.push(err16);
}
errors++;
}
if(data5.unit === undefined){
const err17 = {instancePath:instancePath+"/features/" + i0+"/properties",schemaPath:"#/properties/features/items/properties/properties/required",keyword:"required",params:{missingProperty: "unit"},message:"must have required property '"+"unit"+"'"};
if(vErrors === null){
vErrors = [err17];
}
else {
vErrors.push(err17);
}
errors++;
}
for(const key2 in data5){
if(!(func2.call(schema13.properties.features.items.properties.properties.properties, key2))){
const err18 = {instancePath:instancePath+"/features/" + i0+"/properties",schemaPath:"#/properties/features/items/properties/properties/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key2},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err18];
}
else {
vErrors.push(err18);
}
errors++;
}
}
if(data5.dataset_id !== undefined){
let data6 = data5.dataset_id;
if(typeof data6 === "string"){
if(!pattern2.test(data6)){
const err19 = {instancePath:instancePath+"/features/" + i0+"/properties/dataset_id",schemaPath:"#/properties/features/items/properties/properties/properties/dataset_id/pattern",keyword:"pattern",params:{pattern: "^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$"},message:"must match pattern \""+"^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$"+"\""};
if(vErrors === null){
vErrors = [err19];
}
else {
vErrors.push(err19);
}
errors++;
}
}
else {
const err20 = {instancePath:instancePath+"/features/" + i0+"/properties/dataset_id",schemaPath:"#/properties/features/items/properties/properties/properties/dataset_id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err20];
}
else {
vErrors.push(err20);
}
errors++;
}
}
if(data5.dataset_version !== undefined){
let data7 = data5.dataset_version;
if(typeof data7 === "string"){
if(!pattern3.test(data7)){
const err21 = {instancePath:instancePath+"/features/" + i0+"/properties/dataset_version",schemaPath:"#/properties/features/items/properties/properties/properties/dataset_version/pattern",keyword:"pattern",params:{pattern: "^[0-9]+\\.[0-9]+\\.[0-9]+$"},message:"must match pattern \""+"^[0-9]+\\.[0-9]+\\.[0-9]+$"+"\""};
if(vErrors === null){
vErrors = [err21];
}
else {
vErrors.push(err21);
}
errors++;
}
}
else {
const err22 = {instancePath:instancePath+"/features/" + i0+"/properties/dataset_version",schemaPath:"#/properties/features/items/properties/properties/properties/dataset_version/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err22];
}
else {
vErrors.push(err22);
}
errors++;
}
}
if(data5.name !== undefined){
let data8 = data5.name;
if(typeof data8 === "string"){
if(func3(data8) < 1){
const err23 = {instancePath:instancePath+"/features/" + i0+"/properties/name",schemaPath:"#/properties/features/items/properties/properties/properties/name/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err23];
}
else {
vErrors.push(err23);
}
errors++;
}
}
else {
const err24 = {instancePath:instancePath+"/features/" + i0+"/properties/name",schemaPath:"#/properties/features/items/properties/properties/properties/name/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err24];
}
else {
vErrors.push(err24);
}
errors++;
}
}
if(data5.is_fixture !== undefined){
if(typeof data5.is_fixture !== "boolean"){
const err25 = {instancePath:instancePath+"/features/" + i0+"/properties/is_fixture",schemaPath:"#/properties/features/items/properties/properties/properties/is_fixture/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"};
if(vErrors === null){
vErrors = [err25];
}
else {
vErrors.push(err25);
}
errors++;
}
}
if(data5.value !== undefined){
let data10 = data5.value;
if((!((typeof data10 == "number") && (isFinite(data10)))) && (data10 !== null)){
const err26 = {instancePath:instancePath+"/features/" + i0+"/properties/value",schemaPath:"#/properties/features/items/properties/properties/properties/value/type",keyword:"type",params:{type: schema13.properties.features.items.properties.properties.properties.value.type},message:"must be number,null"};
if(vErrors === null){
vErrors = [err26];
}
else {
vErrors.push(err26);
}
errors++;
}
}
if(data5.unit !== undefined){
let data11 = data5.unit;
if(!((((((((((data11 === "m") || (data11 === "m2")) || (data11 === "km2")) || (data11 === "m3")) || (data11 === "m3/s")) || (data11 === "mm")) || (data11 === "degC")) || (data11 === "person")) || (data11 === "MW")) || (data11 === null))){
const err27 = {instancePath:instancePath+"/features/" + i0+"/properties/unit",schemaPath:"#/properties/features/items/properties/properties/properties/unit/enum",keyword:"enum",params:{allowedValues: schema13.properties.features.items.properties.properties.properties.unit.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err27];
}
else {
vErrors.push(err27);
}
errors++;
}
}
if(data5.admin_level !== undefined){
let data12 = data5.admin_level;
if(!(((typeof data12 == "number") && (!(data12 % 1) && !isNaN(data12))) && (isFinite(data12)))){
const err28 = {instancePath:instancePath+"/features/" + i0+"/properties/admin_level",schemaPath:"#/properties/features/items/properties/properties/properties/admin_level/type",keyword:"type",params:{type: "integer"},message:"must be integer"};
if(vErrors === null){
vErrors = [err28];
}
else {
vErrors.push(err28);
}
errors++;
}
if((typeof data12 == "number") && (isFinite(data12))){
if(data12 > 3 || isNaN(data12)){
const err29 = {instancePath:instancePath+"/features/" + i0+"/properties/admin_level",schemaPath:"#/properties/features/items/properties/properties/properties/admin_level/maximum",keyword:"maximum",params:{comparison: "<=", limit: 3},message:"must be <= 3"};
if(vErrors === null){
vErrors = [err29];
}
else {
vErrors.push(err29);
}
errors++;
}
if(data12 < 0 || isNaN(data12)){
const err30 = {instancePath:instancePath+"/features/" + i0+"/properties/admin_level",schemaPath:"#/properties/features/items/properties/properties/properties/admin_level/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
if(vErrors === null){
vErrors = [err30];
}
else {
vErrors.push(err30);
}
errors++;
}
}
}
if(data5.admin_category !== undefined){
let data13 = data5.admin_category;
if(!(((((data13 === "country") || (data13 === "province")) || (data13 === "district")) || (data13 === "local_level")) || (data13 === "special_area"))){
const err31 = {instancePath:instancePath+"/features/" + i0+"/properties/admin_category",schemaPath:"#/properties/features/items/properties/properties/properties/admin_category/enum",keyword:"enum",params:{allowedValues: schema13.properties.features.items.properties.properties.properties.admin_category.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err31];
}
else {
vErrors.push(err31);
}
errors++;
}
}
if(data5.pcode !== undefined){
let data14 = data5.pcode;
if(typeof data14 === "string"){
if(!pattern11.test(data14)){
const err32 = {instancePath:instancePath+"/features/" + i0+"/properties/pcode",schemaPath:"#/properties/features/items/properties/properties/properties/pcode/pattern",keyword:"pattern",params:{pattern: "^NP[0-9]{0,7}$"},message:"must match pattern \""+"^NP[0-9]{0,7}$"+"\""};
if(vErrors === null){
vErrors = [err32];
}
else {
vErrors.push(err32);
}
errors++;
}
}
else {
const err33 = {instancePath:instancePath+"/features/" + i0+"/properties/pcode",schemaPath:"#/properties/features/items/properties/properties/properties/pcode/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err33];
}
else {
vErrors.push(err33);
}
errors++;
}
}
if(data5.parent_pcode !== undefined){
let data15 = data5.parent_pcode;
const _errs31 = errors;
let valid5 = false;
const _errs32 = errors;
if(typeof data15 === "string"){
if(!pattern12.test(data15)){
const err34 = {instancePath:instancePath+"/features/" + i0+"/properties/parent_pcode",schemaPath:"#/properties/features/items/properties/properties/properties/parent_pcode/anyOf/0/pattern",keyword:"pattern",params:{pattern: "^NP[0-9]{0,4}$"},message:"must match pattern \""+"^NP[0-9]{0,4}$"+"\""};
if(vErrors === null){
vErrors = [err34];
}
else {
vErrors.push(err34);
}
errors++;
}
}
else {
const err35 = {instancePath:instancePath+"/features/" + i0+"/properties/parent_pcode",schemaPath:"#/properties/features/items/properties/properties/properties/parent_pcode/anyOf/0/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err35];
}
else {
vErrors.push(err35);
}
errors++;
}
var _valid0 = _errs32 === errors;
valid5 = valid5 || _valid0;
if(!valid5){
const _errs34 = errors;
if(data15 !== null){
const err36 = {instancePath:instancePath+"/features/" + i0+"/properties/parent_pcode",schemaPath:"#/properties/features/items/properties/properties/properties/parent_pcode/anyOf/1/type",keyword:"type",params:{type: "null"},message:"must be null"};
if(vErrors === null){
vErrors = [err36];
}
else {
vErrors.push(err36);
}
errors++;
}
var _valid0 = _errs34 === errors;
valid5 = valid5 || _valid0;
}
if(!valid5){
const err37 = {instancePath:instancePath+"/features/" + i0+"/properties/parent_pcode",schemaPath:"#/properties/features/items/properties/properties/properties/parent_pcode/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err37];
}
else {
vErrors.push(err37);
}
errors++;
}
else {
errors = _errs31;
if(vErrors !== null){
if(_errs31){
vErrors.length = _errs31;
}
else {
vErrors = null;
}
}
}
}
if(data5.parent_name !== undefined){
let data16 = data5.parent_name;
const _errs37 = errors;
let valid6 = false;
const _errs38 = errors;
if(typeof data16 === "string"){
if(func3(data16) < 1){
const err38 = {instancePath:instancePath+"/features/" + i0+"/properties/parent_name",schemaPath:"#/properties/features/items/properties/properties/properties/parent_name/anyOf/0/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err38];
}
else {
vErrors.push(err38);
}
errors++;
}
}
else {
const err39 = {instancePath:instancePath+"/features/" + i0+"/properties/parent_name",schemaPath:"#/properties/features/items/properties/properties/properties/parent_name/anyOf/0/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err39];
}
else {
vErrors.push(err39);
}
errors++;
}
var _valid1 = _errs38 === errors;
valid6 = valid6 || _valid1;
if(!valid6){
const _errs40 = errors;
if(data16 !== null){
const err40 = {instancePath:instancePath+"/features/" + i0+"/properties/parent_name",schemaPath:"#/properties/features/items/properties/properties/properties/parent_name/anyOf/1/type",keyword:"type",params:{type: "null"},message:"must be null"};
if(vErrors === null){
vErrors = [err40];
}
else {
vErrors.push(err40);
}
errors++;
}
var _valid1 = _errs40 === errors;
valid6 = valid6 || _valid1;
}
if(!valid6){
const err41 = {instancePath:instancePath+"/features/" + i0+"/properties/parent_name",schemaPath:"#/properties/features/items/properties/properties/properties/parent_name/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err41];
}
else {
vErrors.push(err41);
}
errors++;
}
else {
errors = _errs37;
if(vErrors !== null){
if(_errs37){
vErrors.length = _errs37;
}
else {
vErrors = null;
}
}
}
}
if(data5.aliases !== undefined){
let data17 = data5.aliases;
if(Array.isArray(data17)){
const len1 = data17.length;
for(let i1=0; i1<len1; i1++){
let data18 = data17[i1];
if(typeof data18 === "string"){
if(func3(data18) < 1){
const err42 = {instancePath:instancePath+"/features/" + i0+"/properties/aliases/" + i1,schemaPath:"#/properties/features/items/properties/properties/properties/aliases/items/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err42];
}
else {
vErrors.push(err42);
}
errors++;
}
}
else {
const err43 = {instancePath:instancePath+"/features/" + i0+"/properties/aliases/" + i1,schemaPath:"#/properties/features/items/properties/properties/properties/aliases/items/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err43];
}
else {
vErrors.push(err43);
}
errors++;
}
}
let i2 = data17.length;
let j0;
if(i2 > 1){
const indices0 = {};
for(;i2--;){
let item0 = data17[i2];
if(typeof item0 !== "string"){
continue;
}
if(typeof indices0[item0] == "number"){
j0 = indices0[item0];
const err44 = {instancePath:instancePath+"/features/" + i0+"/properties/aliases",schemaPath:"#/properties/features/items/properties/properties/properties/aliases/uniqueItems",keyword:"uniqueItems",params:{i: i2, j: j0},message:"must NOT have duplicate items (items ## "+j0+" and "+i2+" are identical)"};
if(vErrors === null){
vErrors = [err44];
}
else {
vErrors.push(err44);
}
errors++;
break;
}
indices0[item0] = i2;
}
}
}
else {
const err45 = {instancePath:instancePath+"/features/" + i0+"/properties/aliases",schemaPath:"#/properties/features/items/properties/properties/properties/aliases/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err45];
}
else {
vErrors.push(err45);
}
errors++;
}
}
if(data5.label_longitude !== undefined){
let data19 = data5.label_longitude;
if((typeof data19 == "number") && (isFinite(data19))){
if(data19 > 180 || isNaN(data19)){
const err46 = {instancePath:instancePath+"/features/" + i0+"/properties/label_longitude",schemaPath:"#/properties/features/items/properties/properties/properties/label_longitude/maximum",keyword:"maximum",params:{comparison: "<=", limit: 180},message:"must be <= 180"};
if(vErrors === null){
vErrors = [err46];
}
else {
vErrors.push(err46);
}
errors++;
}
if(data19 < -180 || isNaN(data19)){
const err47 = {instancePath:instancePath+"/features/" + i0+"/properties/label_longitude",schemaPath:"#/properties/features/items/properties/properties/properties/label_longitude/minimum",keyword:"minimum",params:{comparison: ">=", limit: -180},message:"must be >= -180"};
if(vErrors === null){
vErrors = [err47];
}
else {
vErrors.push(err47);
}
errors++;
}
}
else {
const err48 = {instancePath:instancePath+"/features/" + i0+"/properties/label_longitude",schemaPath:"#/properties/features/items/properties/properties/properties/label_longitude/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err48];
}
else {
vErrors.push(err48);
}
errors++;
}
}
if(data5.label_latitude !== undefined){
let data20 = data5.label_latitude;
if((typeof data20 == "number") && (isFinite(data20))){
if(data20 > 90 || isNaN(data20)){
const err49 = {instancePath:instancePath+"/features/" + i0+"/properties/label_latitude",schemaPath:"#/properties/features/items/properties/properties/properties/label_latitude/maximum",keyword:"maximum",params:{comparison: "<=", limit: 90},message:"must be <= 90"};
if(vErrors === null){
vErrors = [err49];
}
else {
vErrors.push(err49);
}
errors++;
}
if(data20 < -90 || isNaN(data20)){
const err50 = {instancePath:instancePath+"/features/" + i0+"/properties/label_latitude",schemaPath:"#/properties/features/items/properties/properties/properties/label_latitude/minimum",keyword:"minimum",params:{comparison: ">=", limit: -90},message:"must be >= -90"};
if(vErrors === null){
vErrors = [err50];
}
else {
vErrors.push(err50);
}
errors++;
}
}
else {
const err51 = {instancePath:instancePath+"/features/" + i0+"/properties/label_latitude",schemaPath:"#/properties/features/items/properties/properties/properties/label_latitude/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err51];
}
else {
vErrors.push(err51);
}
errors++;
}
}
if(data5.valid_from !== undefined){
let data21 = data5.valid_from;
if(typeof data21 === "string"){
if(!(formats0.validate(data21))){
const err52 = {instancePath:instancePath+"/features/" + i0+"/properties/valid_from",schemaPath:"#/properties/features/items/properties/properties/properties/valid_from/format",keyword:"format",params:{format: "date-time"},message:"must match format \""+"date-time"+"\""};
if(vErrors === null){
vErrors = [err52];
}
else {
vErrors.push(err52);
}
errors++;
}
}
else {
const err53 = {instancePath:instancePath+"/features/" + i0+"/properties/valid_from",schemaPath:"#/properties/features/items/properties/properties/properties/valid_from/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err53];
}
else {
vErrors.push(err53);
}
errors++;
}
}
if(data5.valid_to !== undefined){
let data22 = data5.valid_to;
const _errs53 = errors;
let valid10 = false;
const _errs54 = errors;
if(typeof data22 === "string"){
if(!(formats0.validate(data22))){
const err54 = {instancePath:instancePath+"/features/" + i0+"/properties/valid_to",schemaPath:"#/properties/features/items/properties/properties/properties/valid_to/anyOf/0/format",keyword:"format",params:{format: "date-time"},message:"must match format \""+"date-time"+"\""};
if(vErrors === null){
vErrors = [err54];
}
else {
vErrors.push(err54);
}
errors++;
}
}
else {
const err55 = {instancePath:instancePath+"/features/" + i0+"/properties/valid_to",schemaPath:"#/properties/features/items/properties/properties/properties/valid_to/anyOf/0/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err55];
}
else {
vErrors.push(err55);
}
errors++;
}
var _valid2 = _errs54 === errors;
valid10 = valid10 || _valid2;
if(!valid10){
const _errs56 = errors;
if(data22 !== null){
const err56 = {instancePath:instancePath+"/features/" + i0+"/properties/valid_to",schemaPath:"#/properties/features/items/properties/properties/properties/valid_to/anyOf/1/type",keyword:"type",params:{type: "null"},message:"must be null"};
if(vErrors === null){
vErrors = [err56];
}
else {
vErrors.push(err56);
}
errors++;
}
var _valid2 = _errs56 === errors;
valid10 = valid10 || _valid2;
}
if(!valid10){
const err57 = {instancePath:instancePath+"/features/" + i0+"/properties/valid_to",schemaPath:"#/properties/features/items/properties/properties/properties/valid_to/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err57];
}
else {
vErrors.push(err57);
}
errors++;
}
else {
errors = _errs53;
if(vErrors !== null){
if(_errs53){
vErrors.length = _errs53;
}
else {
vErrors = null;
}
}
}
}
if(data5.source_version !== undefined){
let data23 = data5.source_version;
if(typeof data23 === "string"){
if(func3(data23) < 1){
const err58 = {instancePath:instancePath+"/features/" + i0+"/properties/source_version",schemaPath:"#/properties/features/items/properties/properties/properties/source_version/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err58];
}
else {
vErrors.push(err58);
}
errors++;
}
}
else {
const err59 = {instancePath:instancePath+"/features/" + i0+"/properties/source_version",schemaPath:"#/properties/features/items/properties/properties/properties/source_version/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err59];
}
else {
vErrors.push(err59);
}
errors++;
}
}
if(data5.entity_type !== undefined){
let data24 = data5.entity_type;
if(!((((((((((((data24 === "mountain") || (data24 === "river")) || (data24 === "glacier")) || (data24 === "glacial_lake")) || (data24 === "hydrology_station")) || (data24 === "rainfall_station")) || (data24 === "disaster_event")) || (data24 === "earthquake")) || (data24 === "flood_event")) || (data24 === "landslide_event")) || (data24 === "hydropower_facility")) || (data24 === "infrastructure_asset"))){
const err60 = {instancePath:instancePath+"/features/" + i0+"/properties/entity_type",schemaPath:"#/properties/features/items/properties/properties/properties/entity_type/enum",keyword:"enum",params:{allowedValues: schema13.properties.features.items.properties.properties.properties.entity_type.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err60];
}
else {
vErrors.push(err60);
}
errors++;
}
}
if(data5.source_id !== undefined){
let data25 = data5.source_id;
if(typeof data25 === "string"){
if(func3(data25) < 1){
const err61 = {instancePath:instancePath+"/features/" + i0+"/properties/source_id",schemaPath:"#/properties/features/items/properties/properties/properties/source_id/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err61];
}
else {
vErrors.push(err61);
}
errors++;
}
}
else {
const err62 = {instancePath:instancePath+"/features/" + i0+"/properties/source_id",schemaPath:"#/properties/features/items/properties/properties/properties/source_id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err62];
}
else {
vErrors.push(err62);
}
errors++;
}
}
if(data5.search_terms !== undefined){
let data26 = data5.search_terms;
if(Array.isArray(data26)){
if(data26.length < 1){
const err63 = {instancePath:instancePath+"/features/" + i0+"/properties/search_terms",schemaPath:"#/properties/features/items/properties/properties/properties/search_terms/minItems",keyword:"minItems",params:{limit: 1},message:"must NOT have fewer than 1 items"};
if(vErrors === null){
vErrors = [err63];
}
else {
vErrors.push(err63);
}
errors++;
}
const len2 = data26.length;
for(let i3=0; i3<len2; i3++){
let data27 = data26[i3];
if(typeof data27 === "string"){
if(func3(data27) < 1){
const err64 = {instancePath:instancePath+"/features/" + i0+"/properties/search_terms/" + i3,schemaPath:"#/properties/features/items/properties/properties/properties/search_terms/items/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err64];
}
else {
vErrors.push(err64);
}
errors++;
}
}
else {
const err65 = {instancePath:instancePath+"/features/" + i0+"/properties/search_terms/" + i3,schemaPath:"#/properties/features/items/properties/properties/properties/search_terms/items/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err65];
}
else {
vErrors.push(err65);
}
errors++;
}
}
let i4 = data26.length;
let j1;
if(i4 > 1){
const indices1 = {};
for(;i4--;){
let item1 = data26[i4];
if(typeof item1 !== "string"){
continue;
}
if(typeof indices1[item1] == "number"){
j1 = indices1[item1];
const err66 = {instancePath:instancePath+"/features/" + i0+"/properties/search_terms",schemaPath:"#/properties/features/items/properties/properties/properties/search_terms/uniqueItems",keyword:"uniqueItems",params:{i: i4, j: j1},message:"must NOT have duplicate items (items ## "+j1+" and "+i4+" are identical)"};
if(vErrors === null){
vErrors = [err66];
}
else {
vErrors.push(err66);
}
errors++;
break;
}
indices1[item1] = i4;
}
}
}
else {
const err67 = {instancePath:instancePath+"/features/" + i0+"/properties/search_terms",schemaPath:"#/properties/features/items/properties/properties/properties/search_terms/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err67];
}
else {
vErrors.push(err67);
}
errors++;
}
}
if(data5.feature_code !== undefined){
let data28 = data5.feature_code;
if(typeof data28 === "string"){
if(func3(data28) < 1){
const err68 = {instancePath:instancePath+"/features/" + i0+"/properties/feature_code",schemaPath:"#/properties/features/items/properties/properties/properties/feature_code/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err68];
}
else {
vErrors.push(err68);
}
errors++;
}
}
else {
const err69 = {instancePath:instancePath+"/features/" + i0+"/properties/feature_code",schemaPath:"#/properties/features/items/properties/properties/properties/feature_code/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err69];
}
else {
vErrors.push(err69);
}
errors++;
}
}
if(data5.source_modified !== undefined){
let data29 = data5.source_modified;
if(typeof data29 === "string"){
if(!(formats30.validate(data29))){
const err70 = {instancePath:instancePath+"/features/" + i0+"/properties/source_modified",schemaPath:"#/properties/features/items/properties/properties/properties/source_modified/format",keyword:"format",params:{format: "date"},message:"must match format \""+"date"+"\""};
if(vErrors === null){
vErrors = [err70];
}
else {
vErrors.push(err70);
}
errors++;
}
}
else {
const err71 = {instancePath:instancePath+"/features/" + i0+"/properties/source_modified",schemaPath:"#/properties/features/items/properties/properties/properties/source_modified/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err71];
}
else {
vErrors.push(err71);
}
errors++;
}
}
if(data5.elevation_reference !== undefined){
let data30 = data5.elevation_reference;
if(typeof data30 === "string"){
if(func3(data30) < 1){
const err72 = {instancePath:instancePath+"/features/" + i0+"/properties/elevation_reference",schemaPath:"#/properties/features/items/properties/properties/properties/elevation_reference/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err72];
}
else {
vErrors.push(err72);
}
errors++;
}
}
else {
const err73 = {instancePath:instancePath+"/features/" + i0+"/properties/elevation_reference",schemaPath:"#/properties/features/items/properties/properties/properties/elevation_reference/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err73];
}
else {
vErrors.push(err73);
}
errors++;
}
}
if(data5.river_name !== undefined){
let data31 = data5.river_name;
if((typeof data31 !== "string") && (data31 !== null)){
const err74 = {instancePath:instancePath+"/features/" + i0+"/properties/river_name",schemaPath:"#/properties/features/items/properties/properties/properties/river_name/type",keyword:"type",params:{type: schema13.properties.features.items.properties.properties.properties.river_name.type},message:"must be string,null"};
if(vErrors === null){
vErrors = [err74];
}
else {
vErrors.push(err74);
}
errors++;
}
}
if(data5.downstream_id !== undefined){
let data32 = data5.downstream_id;
if((typeof data32 !== "string") && (data32 !== null)){
const err75 = {instancePath:instancePath+"/features/" + i0+"/properties/downstream_id",schemaPath:"#/properties/features/items/properties/properties/properties/downstream_id/type",keyword:"type",params:{type: schema13.properties.features.items.properties.properties.properties.downstream_id.type},message:"must be string,null"};
if(vErrors === null){
vErrors = [err75];
}
else {
vErrors.push(err75);
}
errors++;
}
}
if(data5.downstream_in_release !== undefined){
if(typeof data5.downstream_in_release !== "boolean"){
const err76 = {instancePath:instancePath+"/features/" + i0+"/properties/downstream_in_release",schemaPath:"#/properties/features/items/properties/properties/properties/downstream_in_release/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"};
if(vErrors === null){
vErrors = [err76];
}
else {
vErrors.push(err76);
}
errors++;
}
}
if(data5.main_river_id !== undefined){
let data34 = data5.main_river_id;
if(typeof data34 === "string"){
if(func3(data34) < 1){
const err77 = {instancePath:instancePath+"/features/" + i0+"/properties/main_river_id",schemaPath:"#/properties/features/items/properties/properties/properties/main_river_id/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err77];
}
else {
vErrors.push(err77);
}
errors++;
}
}
else {
const err78 = {instancePath:instancePath+"/features/" + i0+"/properties/main_river_id",schemaPath:"#/properties/features/items/properties/properties/properties/main_river_id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err78];
}
else {
vErrors.push(err78);
}
errors++;
}
}
if(data5.flow_order !== undefined){
let data35 = data5.flow_order;
if(!(((typeof data35 == "number") && (!(data35 % 1) && !isNaN(data35))) && (isFinite(data35)))){
const err79 = {instancePath:instancePath+"/features/" + i0+"/properties/flow_order",schemaPath:"#/properties/features/items/properties/properties/properties/flow_order/type",keyword:"type",params:{type: "integer"},message:"must be integer"};
if(vErrors === null){
vErrors = [err79];
}
else {
vErrors.push(err79);
}
errors++;
}
if((typeof data35 == "number") && (isFinite(data35))){
if(data35 < 1 || isNaN(data35)){
const err80 = {instancePath:instancePath+"/features/" + i0+"/properties/flow_order",schemaPath:"#/properties/features/items/properties/properties/properties/flow_order/minimum",keyword:"minimum",params:{comparison: ">=", limit: 1},message:"must be >= 1"};
if(vErrors === null){
vErrors = [err80];
}
else {
vErrors.push(err80);
}
errors++;
}
}
}
if(data5.length_km !== undefined){
let data36 = data5.length_km;
if((typeof data36 == "number") && (isFinite(data36))){
if(data36 < 0 || isNaN(data36)){
const err81 = {instancePath:instancePath+"/features/" + i0+"/properties/length_km",schemaPath:"#/properties/features/items/properties/properties/properties/length_km/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
if(vErrors === null){
vErrors = [err81];
}
else {
vErrors.push(err81);
}
errors++;
}
}
else {
const err82 = {instancePath:instancePath+"/features/" + i0+"/properties/length_km",schemaPath:"#/properties/features/items/properties/properties/properties/length_km/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err82];
}
else {
vErrors.push(err82);
}
errors++;
}
}
if(data5.distance_downstream_km !== undefined){
let data37 = data5.distance_downstream_km;
if((typeof data37 == "number") && (isFinite(data37))){
if(data37 < 0 || isNaN(data37)){
const err83 = {instancePath:instancePath+"/features/" + i0+"/properties/distance_downstream_km",schemaPath:"#/properties/features/items/properties/properties/properties/distance_downstream_km/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
if(vErrors === null){
vErrors = [err83];
}
else {
vErrors.push(err83);
}
errors++;
}
}
else {
const err84 = {instancePath:instancePath+"/features/" + i0+"/properties/distance_downstream_km",schemaPath:"#/properties/features/items/properties/properties/properties/distance_downstream_km/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err84];
}
else {
vErrors.push(err84);
}
errors++;
}
}
if(data5.distance_upstream_km !== undefined){
let data38 = data5.distance_upstream_km;
if((typeof data38 == "number") && (isFinite(data38))){
if(data38 < 0 || isNaN(data38)){
const err85 = {instancePath:instancePath+"/features/" + i0+"/properties/distance_upstream_km",schemaPath:"#/properties/features/items/properties/properties/properties/distance_upstream_km/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
if(vErrors === null){
vErrors = [err85];
}
else {
vErrors.push(err85);
}
errors++;
}
}
else {
const err86 = {instancePath:instancePath+"/features/" + i0+"/properties/distance_upstream_km",schemaPath:"#/properties/features/items/properties/properties/properties/distance_upstream_km/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err86];
}
else {
vErrors.push(err86);
}
errors++;
}
}
if(data5.catchment_area_km2 !== undefined){
let data39 = data5.catchment_area_km2;
if((typeof data39 == "number") && (isFinite(data39))){
if(data39 < 0 || isNaN(data39)){
const err87 = {instancePath:instancePath+"/features/" + i0+"/properties/catchment_area_km2",schemaPath:"#/properties/features/items/properties/properties/properties/catchment_area_km2/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
if(vErrors === null){
vErrors = [err87];
}
else {
vErrors.push(err87);
}
errors++;
}
}
else {
const err88 = {instancePath:instancePath+"/features/" + i0+"/properties/catchment_area_km2",schemaPath:"#/properties/features/items/properties/properties/properties/catchment_area_km2/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err88];
}
else {
vErrors.push(err88);
}
errors++;
}
}
if(data5.upstream_area_km2 !== undefined){
let data40 = data5.upstream_area_km2;
if((typeof data40 == "number") && (isFinite(data40))){
if(data40 < 0 || isNaN(data40)){
const err89 = {instancePath:instancePath+"/features/" + i0+"/properties/upstream_area_km2",schemaPath:"#/properties/features/items/properties/properties/properties/upstream_area_km2/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
if(vErrors === null){
vErrors = [err89];
}
else {
vErrors.push(err89);
}
errors++;
}
}
else {
const err90 = {instancePath:instancePath+"/features/" + i0+"/properties/upstream_area_km2",schemaPath:"#/properties/features/items/properties/properties/properties/upstream_area_km2/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err90];
}
else {
vErrors.push(err90);
}
errors++;
}
}
if(data5.average_discharge_m3s !== undefined){
let data41 = data5.average_discharge_m3s;
if((typeof data41 == "number") && (isFinite(data41))){
if(data41 < 0 || isNaN(data41)){
const err91 = {instancePath:instancePath+"/features/" + i0+"/properties/average_discharge_m3s",schemaPath:"#/properties/features/items/properties/properties/properties/average_discharge_m3s/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
if(vErrors === null){
vErrors = [err91];
}
else {
vErrors.push(err91);
}
errors++;
}
}
else {
const err92 = {instancePath:instancePath+"/features/" + i0+"/properties/average_discharge_m3s",schemaPath:"#/properties/features/items/properties/properties/properties/average_discharge_m3s/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err92];
}
else {
vErrors.push(err92);
}
errors++;
}
}
if(data5.flow_regime !== undefined){
let data42 = data5.flow_regime;
if(!(((data42 === "perennial") || (data42 === "intermittent")) || (data42 === "unknown"))){
const err93 = {instancePath:instancePath+"/features/" + i0+"/properties/flow_regime",schemaPath:"#/properties/features/items/properties/properties/properties/flow_regime/enum",keyword:"enum",params:{allowedValues: schema13.properties.features.items.properties.properties.properties.flow_regime.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err93];
}
else {
vErrors.push(err93);
}
errors++;
}
}
if(data5.hydrobasin_level12_id !== undefined){
let data43 = data5.hydrobasin_level12_id;
if(typeof data43 === "string"){
if(func3(data43) < 1){
const err94 = {instancePath:instancePath+"/features/" + i0+"/properties/hydrobasin_level12_id",schemaPath:"#/properties/features/items/properties/properties/properties/hydrobasin_level12_id/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err94];
}
else {
vErrors.push(err94);
}
errors++;
}
}
else {
const err95 = {instancePath:instancePath+"/features/" + i0+"/properties/hydrobasin_level12_id",schemaPath:"#/properties/features/items/properties/properties/properties/hydrobasin_level12_id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err95];
}
else {
vErrors.push(err95);
}
errors++;
}
}
if(data5.glacier_name !== undefined){
let data44 = data5.glacier_name;
if((typeof data44 !== "string") && (data44 !== null)){
const err96 = {instancePath:instancePath+"/features/" + i0+"/properties/glacier_name",schemaPath:"#/properties/features/items/properties/properties/properties/glacier_name/type",keyword:"type",params:{type: schema13.properties.features.items.properties.properties.properties.glacier_name.type},message:"must be string,null"};
if(vErrors === null){
vErrors = [err96];
}
else {
vErrors.push(err96);
}
errors++;
}
}
if(data5.glims_id !== undefined){
let data45 = data5.glims_id;
if(typeof data45 === "string"){
if(func3(data45) < 1){
const err97 = {instancePath:instancePath+"/features/" + i0+"/properties/glims_id",schemaPath:"#/properties/features/items/properties/properties/properties/glims_id/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err97];
}
else {
vErrors.push(err97);
}
errors++;
}
}
else {
const err98 = {instancePath:instancePath+"/features/" + i0+"/properties/glims_id",schemaPath:"#/properties/features/items/properties/properties/properties/glims_id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err98];
}
else {
vErrors.push(err98);
}
errors++;
}
}
if(data5.outline_date !== undefined){
let data46 = data5.outline_date;
if(typeof data46 === "string"){
if(!(formats30.validate(data46))){
const err99 = {instancePath:instancePath+"/features/" + i0+"/properties/outline_date",schemaPath:"#/properties/features/items/properties/properties/properties/outline_date/format",keyword:"format",params:{format: "date"},message:"must match format \""+"date"+"\""};
if(vErrors === null){
vErrors = [err99];
}
else {
vErrors.push(err99);
}
errors++;
}
}
else {
const err100 = {instancePath:instancePath+"/features/" + i0+"/properties/outline_date",schemaPath:"#/properties/features/items/properties/properties/properties/outline_date/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err100];
}
else {
vErrors.push(err100);
}
errors++;
}
}
if(data5.area_km2 !== undefined){
let data47 = data5.area_km2;
if((typeof data47 == "number") && (isFinite(data47))){
if(data47 <= 0 || isNaN(data47)){
const err101 = {instancePath:instancePath+"/features/" + i0+"/properties/area_km2",schemaPath:"#/properties/features/items/properties/properties/properties/area_km2/exclusiveMinimum",keyword:"exclusiveMinimum",params:{comparison: ">", limit: 0},message:"must be > 0"};
if(vErrors === null){
vErrors = [err101];
}
else {
vErrors.push(err101);
}
errors++;
}
}
else {
const err102 = {instancePath:instancePath+"/features/" + i0+"/properties/area_km2",schemaPath:"#/properties/features/items/properties/properties/properties/area_km2/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err102];
}
else {
vErrors.push(err102);
}
errors++;
}
}
if(data5.centroid_longitude !== undefined){
let data48 = data5.centroid_longitude;
if((typeof data48 == "number") && (isFinite(data48))){
if(data48 > 180 || isNaN(data48)){
const err103 = {instancePath:instancePath+"/features/" + i0+"/properties/centroid_longitude",schemaPath:"#/properties/features/items/properties/properties/properties/centroid_longitude/maximum",keyword:"maximum",params:{comparison: "<=", limit: 180},message:"must be <= 180"};
if(vErrors === null){
vErrors = [err103];
}
else {
vErrors.push(err103);
}
errors++;
}
if(data48 < -180 || isNaN(data48)){
const err104 = {instancePath:instancePath+"/features/" + i0+"/properties/centroid_longitude",schemaPath:"#/properties/features/items/properties/properties/properties/centroid_longitude/minimum",keyword:"minimum",params:{comparison: ">=", limit: -180},message:"must be >= -180"};
if(vErrors === null){
vErrors = [err104];
}
else {
vErrors.push(err104);
}
errors++;
}
}
else {
const err105 = {instancePath:instancePath+"/features/" + i0+"/properties/centroid_longitude",schemaPath:"#/properties/features/items/properties/properties/properties/centroid_longitude/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err105];
}
else {
vErrors.push(err105);
}
errors++;
}
}
if(data5.centroid_latitude !== undefined){
let data49 = data5.centroid_latitude;
if((typeof data49 == "number") && (isFinite(data49))){
if(data49 > 90 || isNaN(data49)){
const err106 = {instancePath:instancePath+"/features/" + i0+"/properties/centroid_latitude",schemaPath:"#/properties/features/items/properties/properties/properties/centroid_latitude/maximum",keyword:"maximum",params:{comparison: "<=", limit: 90},message:"must be <= 90"};
if(vErrors === null){
vErrors = [err106];
}
else {
vErrors.push(err106);
}
errors++;
}
if(data49 < -90 || isNaN(data49)){
const err107 = {instancePath:instancePath+"/features/" + i0+"/properties/centroid_latitude",schemaPath:"#/properties/features/items/properties/properties/properties/centroid_latitude/minimum",keyword:"minimum",params:{comparison: ">=", limit: -90},message:"must be >= -90"};
if(vErrors === null){
vErrors = [err107];
}
else {
vErrors.push(err107);
}
errors++;
}
}
else {
const err108 = {instancePath:instancePath+"/features/" + i0+"/properties/centroid_latitude",schemaPath:"#/properties/features/items/properties/properties/properties/centroid_latitude/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err108];
}
else {
vErrors.push(err108);
}
errors++;
}
}
if(data5.elevation_min_m !== undefined){
let data50 = data5.elevation_min_m;
if(!((typeof data50 == "number") && (isFinite(data50)))){
const err109 = {instancePath:instancePath+"/features/" + i0+"/properties/elevation_min_m",schemaPath:"#/properties/features/items/properties/properties/properties/elevation_min_m/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err109];
}
else {
vErrors.push(err109);
}
errors++;
}
}
if(data5.elevation_max_m !== undefined){
let data51 = data5.elevation_max_m;
if(!((typeof data51 == "number") && (isFinite(data51)))){
const err110 = {instancePath:instancePath+"/features/" + i0+"/properties/elevation_max_m",schemaPath:"#/properties/features/items/properties/properties/properties/elevation_max_m/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err110];
}
else {
vErrors.push(err110);
}
errors++;
}
}
if(data5.elevation_mean_m !== undefined){
let data52 = data5.elevation_mean_m;
if(!((typeof data52 == "number") && (isFinite(data52)))){
const err111 = {instancePath:instancePath+"/features/" + i0+"/properties/elevation_mean_m",schemaPath:"#/properties/features/items/properties/properties/properties/elevation_mean_m/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err111];
}
else {
vErrors.push(err111);
}
errors++;
}
}
if(data5.dem_source !== undefined){
let data53 = data5.dem_source;
if(typeof data53 === "string"){
if(func3(data53) < 1){
const err112 = {instancePath:instancePath+"/features/" + i0+"/properties/dem_source",schemaPath:"#/properties/features/items/properties/properties/properties/dem_source/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err112];
}
else {
vErrors.push(err112);
}
errors++;
}
}
else {
const err113 = {instancePath:instancePath+"/features/" + i0+"/properties/dem_source",schemaPath:"#/properties/features/items/properties/properties/properties/dem_source/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err113];
}
else {
vErrors.push(err113);
}
errors++;
}
}
if(data5.inventory_region !== undefined){
let data54 = data5.inventory_region;
if(typeof data54 === "string"){
if(func3(data54) < 1){
const err114 = {instancePath:instancePath+"/features/" + i0+"/properties/inventory_region",schemaPath:"#/properties/features/items/properties/properties/properties/inventory_region/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err114];
}
else {
vErrors.push(err114);
}
errors++;
}
}
else {
const err115 = {instancePath:instancePath+"/features/" + i0+"/properties/inventory_region",schemaPath:"#/properties/features/items/properties/properties/properties/inventory_region/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err115];
}
else {
vErrors.push(err115);
}
errors++;
}
}
if(data5.display_geometry_repaired !== undefined){
if(typeof data5.display_geometry_repaired !== "boolean"){
const err116 = {instancePath:instancePath+"/features/" + i0+"/properties/display_geometry_repaired",schemaPath:"#/properties/features/items/properties/properties/properties/display_geometry_repaired/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"};
if(vErrors === null){
vErrors = [err116];
}
else {
vErrors.push(err116);
}
errors++;
}
}
if(data5.lake_name !== undefined){
let data56 = data5.lake_name;
if((typeof data56 !== "string") && (data56 !== null)){
const err117 = {instancePath:instancePath+"/features/" + i0+"/properties/lake_name",schemaPath:"#/properties/features/items/properties/properties/properties/lake_name/type",keyword:"type",params:{type: schema13.properties.features.items.properties.properties.properties.lake_name.type},message:"must be string,null"};
if(vErrors === null){
vErrors = [err117];
}
else {
vErrors.push(err117);
}
errors++;
}
}
if(data5.country !== undefined){
let data57 = data5.country;
if(typeof data57 === "string"){
if(func3(data57) < 1){
const err118 = {instancePath:instancePath+"/features/" + i0+"/properties/country",schemaPath:"#/properties/features/items/properties/properties/properties/country/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err118];
}
else {
vErrors.push(err118);
}
errors++;
}
}
else {
const err119 = {instancePath:instancePath+"/features/" + i0+"/properties/country",schemaPath:"#/properties/features/items/properties/properties/properties/country/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err119];
}
else {
vErrors.push(err119);
}
errors++;
}
}
if(data5.basin !== undefined){
let data58 = data5.basin;
if((typeof data58 !== "string") && (data58 !== null)){
const err120 = {instancePath:instancePath+"/features/" + i0+"/properties/basin",schemaPath:"#/properties/features/items/properties/properties/properties/basin/type",keyword:"type",params:{type: schema13.properties.features.items.properties.properties.properties.basin.type},message:"must be string,null"};
if(vErrors === null){
vErrors = [err120];
}
else {
vErrors.push(err120);
}
errors++;
}
if(typeof data58 === "string"){
if(func3(data58) < 1){
const err121 = {instancePath:instancePath+"/features/" + i0+"/properties/basin",schemaPath:"#/properties/features/items/properties/properties/properties/basin/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err121];
}
else {
vErrors.push(err121);
}
errors++;
}
}
}
if(data5.connectivity !== undefined){
let data59 = data5.connectivity;
if(!((data59 === "Glacier-fed") || (data59 === "Non Glacier-fed"))){
const err122 = {instancePath:instancePath+"/features/" + i0+"/properties/connectivity",schemaPath:"#/properties/features/items/properties/properties/properties/connectivity/enum",keyword:"enum",params:{allowedValues: schema13.properties.features.items.properties.properties.properties.connectivity.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err122];
}
else {
vErrors.push(err122);
}
errors++;
}
}
if(data5.data_source !== undefined){
let data60 = data5.data_source;
if(typeof data60 === "string"){
if(func3(data60) < 1){
const err123 = {instancePath:instancePath+"/features/" + i0+"/properties/data_source",schemaPath:"#/properties/features/items/properties/properties/properties/data_source/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err123];
}
else {
vErrors.push(err123);
}
errors++;
}
}
else {
const err124 = {instancePath:instancePath+"/features/" + i0+"/properties/data_source",schemaPath:"#/properties/features/items/properties/properties/properties/data_source/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err124];
}
else {
vErrors.push(err124);
}
errors++;
}
}
if(data5.inventory_period !== undefined){
let data61 = data5.inventory_period;
if(typeof data61 === "string"){
if(func3(data61) < 1){
const err125 = {instancePath:instancePath+"/features/" + i0+"/properties/inventory_period",schemaPath:"#/properties/features/items/properties/properties/properties/inventory_period/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err125];
}
else {
vErrors.push(err125);
}
errors++;
}
}
else {
const err126 = {instancePath:instancePath+"/features/" + i0+"/properties/inventory_period",schemaPath:"#/properties/features/items/properties/properties/properties/inventory_period/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err126];
}
else {
vErrors.push(err126);
}
errors++;
}
}
if(data5.perimeter_km !== undefined){
let data62 = data5.perimeter_km;
if((typeof data62 == "number") && (isFinite(data62))){
if(data62 <= 0 || isNaN(data62)){
const err127 = {instancePath:instancePath+"/features/" + i0+"/properties/perimeter_km",schemaPath:"#/properties/features/items/properties/properties/properties/perimeter_km/exclusiveMinimum",keyword:"exclusiveMinimum",params:{comparison: ">", limit: 0},message:"must be > 0"};
if(vErrors === null){
vErrors = [err127];
}
else {
vErrors.push(err127);
}
errors++;
}
}
else {
const err128 = {instancePath:instancePath+"/features/" + i0+"/properties/perimeter_km",schemaPath:"#/properties/features/items/properties/properties/properties/perimeter_km/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err128];
}
else {
vErrors.push(err128);
}
errors++;
}
}
if(data5.expansion_rate_km2_per_year !== undefined){
let data63 = data5.expansion_rate_km2_per_year;
if((!((typeof data63 == "number") && (isFinite(data63)))) && (data63 !== null)){
const err129 = {instancePath:instancePath+"/features/" + i0+"/properties/expansion_rate_km2_per_year",schemaPath:"#/properties/features/items/properties/properties/properties/expansion_rate_km2_per_year/type",keyword:"type",params:{type: schema13.properties.features.items.properties.properties.properties.expansion_rate_km2_per_year.type},message:"must be number,null"};
if(vErrors === null){
vErrors = [err129];
}
else {
vErrors.push(err129);
}
errors++;
}
}
if(data5.expansion_uncertainty_km2_per_year !== undefined){
let data64 = data5.expansion_uncertainty_km2_per_year;
if((!((typeof data64 == "number") && (isFinite(data64)))) && (data64 !== null)){
const err130 = {instancePath:instancePath+"/features/" + i0+"/properties/expansion_uncertainty_km2_per_year",schemaPath:"#/properties/features/items/properties/properties/properties/expansion_uncertainty_km2_per_year/type",keyword:"type",params:{type: schema13.properties.features.items.properties.properties.properties.expansion_uncertainty_km2_per_year.type},message:"must be number,null"};
if(vErrors === null){
vErrors = [err130];
}
else {
vErrors.push(err130);
}
errors++;
}
if((typeof data64 == "number") && (isFinite(data64))){
if(data64 < 0 || isNaN(data64)){
const err131 = {instancePath:instancePath+"/features/" + i0+"/properties/expansion_uncertainty_km2_per_year",schemaPath:"#/properties/features/items/properties/properties/properties/expansion_uncertainty_km2_per_year/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
if(vErrors === null){
vErrors = [err131];
}
else {
vErrors.push(err131);
}
errors++;
}
}
}
if(data5.expansion_significant !== undefined){
let data65 = data5.expansion_significant;
if((typeof data65 !== "boolean") && (data65 !== null)){
const err132 = {instancePath:instancePath+"/features/" + i0+"/properties/expansion_significant",schemaPath:"#/properties/features/items/properties/properties/properties/expansion_significant/type",keyword:"type",params:{type: schema13.properties.features.items.properties.properties.properties.expansion_significant.type},message:"must be boolean,null"};
if(vErrors === null){
vErrors = [err132];
}
else {
vErrors.push(err132);
}
errors++;
}
}
if(data5.station_name !== undefined){
let data66 = data5.station_name;
if(typeof data66 === "string"){
if(func3(data66) < 1){
const err133 = {instancePath:instancePath+"/features/" + i0+"/properties/station_name",schemaPath:"#/properties/features/items/properties/properties/properties/station_name/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err133];
}
else {
vErrors.push(err133);
}
errors++;
}
}
else {
const err134 = {instancePath:instancePath+"/features/" + i0+"/properties/station_name",schemaPath:"#/properties/features/items/properties/properties/properties/station_name/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err134];
}
else {
vErrors.push(err134);
}
errors++;
}
}
if(data5.observation_time !== undefined){
let data67 = data5.observation_time;
if((typeof data67 !== "string") && (data67 !== null)){
const err135 = {instancePath:instancePath+"/features/" + i0+"/properties/observation_time",schemaPath:"#/properties/features/items/properties/properties/properties/observation_time/type",keyword:"type",params:{type: schema13.properties.features.items.properties.properties.properties.observation_time.type},message:"must be string,null"};
if(vErrors === null){
vErrors = [err135];
}
else {
vErrors.push(err135);
}
errors++;
}
if(typeof data67 === "string"){
if(!(formats0.validate(data67))){
const err136 = {instancePath:instancePath+"/features/" + i0+"/properties/observation_time",schemaPath:"#/properties/features/items/properties/properties/properties/observation_time/format",keyword:"format",params:{format: "date-time"},message:"must match format \""+"date-time"+"\""};
if(vErrors === null){
vErrors = [err136];
}
else {
vErrors.push(err136);
}
errors++;
}
}
}
if(data5.water_level_m !== undefined){
let data68 = data5.water_level_m;
if((!((typeof data68 == "number") && (isFinite(data68)))) && (data68 !== null)){
const err137 = {instancePath:instancePath+"/features/" + i0+"/properties/water_level_m",schemaPath:"#/properties/features/items/properties/properties/properties/water_level_m/type",keyword:"type",params:{type: schema13.properties.features.items.properties.properties.properties.water_level_m.type},message:"must be number,null"};
if(vErrors === null){
vErrors = [err137];
}
else {
vErrors.push(err137);
}
errors++;
}
}
if(data5.warning_level_m !== undefined){
let data69 = data5.warning_level_m;
if((!((typeof data69 == "number") && (isFinite(data69)))) && (data69 !== null)){
const err138 = {instancePath:instancePath+"/features/" + i0+"/properties/warning_level_m",schemaPath:"#/properties/features/items/properties/properties/properties/warning_level_m/type",keyword:"type",params:{type: schema13.properties.features.items.properties.properties.properties.warning_level_m.type},message:"must be number,null"};
if(vErrors === null){
vErrors = [err138];
}
else {
vErrors.push(err138);
}
errors++;
}
}
if(data5.danger_level_m !== undefined){
let data70 = data5.danger_level_m;
if((!((typeof data70 == "number") && (isFinite(data70)))) && (data70 !== null)){
const err139 = {instancePath:instancePath+"/features/" + i0+"/properties/danger_level_m",schemaPath:"#/properties/features/items/properties/properties/properties/danger_level_m/type",keyword:"type",params:{type: schema13.properties.features.items.properties.properties.properties.danger_level_m.type},message:"must be number,null"};
if(vErrors === null){
vErrors = [err139];
}
else {
vErrors.push(err139);
}
errors++;
}
}
if(data5.threshold_order_valid !== undefined){
if(typeof data5.threshold_order_valid !== "boolean"){
const err140 = {instancePath:instancePath+"/features/" + i0+"/properties/threshold_order_valid",schemaPath:"#/properties/features/items/properties/properties/properties/threshold_order_valid/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"};
if(vErrors === null){
vErrors = [err140];
}
else {
vErrors.push(err140);
}
errors++;
}
}
if(data5.station_status !== undefined){
let data72 = data5.station_status;
if(typeof data72 === "string"){
if(func3(data72) < 1){
const err141 = {instancePath:instancePath+"/features/" + i0+"/properties/station_status",schemaPath:"#/properties/features/items/properties/properties/properties/station_status/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err141];
}
else {
vErrors.push(err141);
}
errors++;
}
}
else {
const err142 = {instancePath:instancePath+"/features/" + i0+"/properties/station_status",schemaPath:"#/properties/features/items/properties/properties/properties/station_status/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err142];
}
else {
vErrors.push(err142);
}
errors++;
}
}
if(data5.trend !== undefined){
let data73 = data5.trend;
if((typeof data73 !== "string") && (data73 !== null)){
const err143 = {instancePath:instancePath+"/features/" + i0+"/properties/trend",schemaPath:"#/properties/features/items/properties/properties/properties/trend/type",keyword:"type",params:{type: schema13.properties.features.items.properties.properties.properties.trend.type},message:"must be string,null"};
if(vErrors === null){
vErrors = [err143];
}
else {
vErrors.push(err143);
}
errors++;
}
}
if(data5.station_series_id !== undefined){
let data74 = data5.station_series_id;
if(typeof data74 === "string"){
if(func3(data74) < 1){
const err144 = {instancePath:instancePath+"/features/" + i0+"/properties/station_series_id",schemaPath:"#/properties/features/items/properties/properties/properties/station_series_id/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err144];
}
else {
vErrors.push(err144);
}
errors++;
}
}
else {
const err145 = {instancePath:instancePath+"/features/" + i0+"/properties/station_series_id",schemaPath:"#/properties/features/items/properties/properties/properties/station_series_id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err145];
}
else {
vErrors.push(err145);
}
errors++;
}
}
if(data5.provider !== undefined){
let data75 = data5.provider;
if(typeof data75 === "string"){
if(func3(data75) < 1){
const err146 = {instancePath:instancePath+"/features/" + i0+"/properties/provider",schemaPath:"#/properties/features/items/properties/properties/properties/provider/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err146];
}
else {
vErrors.push(err146);
}
errors++;
}
}
else {
const err147 = {instancePath:instancePath+"/features/" + i0+"/properties/provider",schemaPath:"#/properties/features/items/properties/properties/properties/provider/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err147];
}
else {
vErrors.push(err147);
}
errors++;
}
}
if(data5.elevation_m !== undefined){
let data76 = data5.elevation_m;
if((!((typeof data76 == "number") && (isFinite(data76)))) && (data76 !== null)){
const err148 = {instancePath:instancePath+"/features/" + i0+"/properties/elevation_m",schemaPath:"#/properties/features/items/properties/properties/properties/elevation_m/type",keyword:"type",params:{type: schema13.properties.features.items.properties.properties.properties.elevation_m.type},message:"must be number,null"};
if(vErrors === null){
vErrors = [err148];
}
else {
vErrors.push(err148);
}
errors++;
}
}
if(data5.coordinate_order_repaired !== undefined){
if(typeof data5.coordinate_order_repaired !== "boolean"){
const err149 = {instancePath:instancePath+"/features/" + i0+"/properties/coordinate_order_repaired",schemaPath:"#/properties/features/items/properties/properties/properties/coordinate_order_repaired/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"};
if(vErrors === null){
vErrors = [err149];
}
else {
vErrors.push(err149);
}
errors++;
}
}
if(data5.rainfall_1h_mm !== undefined){
let data78 = data5.rainfall_1h_mm;
if((!((typeof data78 == "number") && (isFinite(data78)))) && (data78 !== null)){
const err150 = {instancePath:instancePath+"/features/" + i0+"/properties/rainfall_1h_mm",schemaPath:"#/properties/features/items/properties/properties/properties/rainfall_1h_mm/type",keyword:"type",params:{type: schema13.properties.features.items.properties.properties.properties.rainfall_1h_mm.type},message:"must be number,null"};
if(vErrors === null){
vErrors = [err150];
}
else {
vErrors.push(err150);
}
errors++;
}
if((typeof data78 == "number") && (isFinite(data78))){
if(data78 < 0 || isNaN(data78)){
const err151 = {instancePath:instancePath+"/features/" + i0+"/properties/rainfall_1h_mm",schemaPath:"#/properties/features/items/properties/properties/properties/rainfall_1h_mm/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
if(vErrors === null){
vErrors = [err151];
}
else {
vErrors.push(err151);
}
errors++;
}
}
}
if(data5.rainfall_3h_mm !== undefined){
let data79 = data5.rainfall_3h_mm;
if((!((typeof data79 == "number") && (isFinite(data79)))) && (data79 !== null)){
const err152 = {instancePath:instancePath+"/features/" + i0+"/properties/rainfall_3h_mm",schemaPath:"#/properties/features/items/properties/properties/properties/rainfall_3h_mm/type",keyword:"type",params:{type: schema13.properties.features.items.properties.properties.properties.rainfall_3h_mm.type},message:"must be number,null"};
if(vErrors === null){
vErrors = [err152];
}
else {
vErrors.push(err152);
}
errors++;
}
if((typeof data79 == "number") && (isFinite(data79))){
if(data79 < 0 || isNaN(data79)){
const err153 = {instancePath:instancePath+"/features/" + i0+"/properties/rainfall_3h_mm",schemaPath:"#/properties/features/items/properties/properties/properties/rainfall_3h_mm/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
if(vErrors === null){
vErrors = [err153];
}
else {
vErrors.push(err153);
}
errors++;
}
}
}
if(data5.rainfall_6h_mm !== undefined){
let data80 = data5.rainfall_6h_mm;
if((!((typeof data80 == "number") && (isFinite(data80)))) && (data80 !== null)){
const err154 = {instancePath:instancePath+"/features/" + i0+"/properties/rainfall_6h_mm",schemaPath:"#/properties/features/items/properties/properties/properties/rainfall_6h_mm/type",keyword:"type",params:{type: schema13.properties.features.items.properties.properties.properties.rainfall_6h_mm.type},message:"must be number,null"};
if(vErrors === null){
vErrors = [err154];
}
else {
vErrors.push(err154);
}
errors++;
}
if((typeof data80 == "number") && (isFinite(data80))){
if(data80 < 0 || isNaN(data80)){
const err155 = {instancePath:instancePath+"/features/" + i0+"/properties/rainfall_6h_mm",schemaPath:"#/properties/features/items/properties/properties/properties/rainfall_6h_mm/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
if(vErrors === null){
vErrors = [err155];
}
else {
vErrors.push(err155);
}
errors++;
}
}
}
if(data5.rainfall_12h_mm !== undefined){
let data81 = data5.rainfall_12h_mm;
if((!((typeof data81 == "number") && (isFinite(data81)))) && (data81 !== null)){
const err156 = {instancePath:instancePath+"/features/" + i0+"/properties/rainfall_12h_mm",schemaPath:"#/properties/features/items/properties/properties/properties/rainfall_12h_mm/type",keyword:"type",params:{type: schema13.properties.features.items.properties.properties.properties.rainfall_12h_mm.type},message:"must be number,null"};
if(vErrors === null){
vErrors = [err156];
}
else {
vErrors.push(err156);
}
errors++;
}
if((typeof data81 == "number") && (isFinite(data81))){
if(data81 < 0 || isNaN(data81)){
const err157 = {instancePath:instancePath+"/features/" + i0+"/properties/rainfall_12h_mm",schemaPath:"#/properties/features/items/properties/properties/properties/rainfall_12h_mm/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
if(vErrors === null){
vErrors = [err157];
}
else {
vErrors.push(err157);
}
errors++;
}
}
}
if(data5.rainfall_24h_mm !== undefined){
let data82 = data5.rainfall_24h_mm;
if((!((typeof data82 == "number") && (isFinite(data82)))) && (data82 !== null)){
const err158 = {instancePath:instancePath+"/features/" + i0+"/properties/rainfall_24h_mm",schemaPath:"#/properties/features/items/properties/properties/properties/rainfall_24h_mm/type",keyword:"type",params:{type: schema13.properties.features.items.properties.properties.properties.rainfall_24h_mm.type},message:"must be number,null"};
if(vErrors === null){
vErrors = [err158];
}
else {
vErrors.push(err158);
}
errors++;
}
if((typeof data82 == "number") && (isFinite(data82))){
if(data82 < 0 || isNaN(data82)){
const err159 = {instancePath:instancePath+"/features/" + i0+"/properties/rainfall_24h_mm",schemaPath:"#/properties/features/items/properties/properties/properties/rainfall_24h_mm/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
if(vErrors === null){
vErrors = [err159];
}
else {
vErrors.push(err159);
}
errors++;
}
}
}
if(data5.rainfall_quality_warning !== undefined){
if(typeof data5.rainfall_quality_warning !== "boolean"){
const err160 = {instancePath:instancePath+"/features/" + i0+"/properties/rainfall_quality_warning",schemaPath:"#/properties/features/items/properties/properties/properties/rainfall_quality_warning/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"};
if(vErrors === null){
vErrors = [err160];
}
else {
vErrors.push(err160);
}
errors++;
}
}
if(data5.hazard_id !== undefined){
let data84 = data5.hazard_id;
if(typeof data84 === "string"){
if(func3(data84) < 1){
const err161 = {instancePath:instancePath+"/features/" + i0+"/properties/hazard_id",schemaPath:"#/properties/features/items/properties/properties/properties/hazard_id/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err161];
}
else {
vErrors.push(err161);
}
errors++;
}
}
else {
const err162 = {instancePath:instancePath+"/features/" + i0+"/properties/hazard_id",schemaPath:"#/properties/features/items/properties/properties/properties/hazard_id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err162];
}
else {
vErrors.push(err162);
}
errors++;
}
}
if(data5.hazard_name !== undefined){
let data85 = data5.hazard_name;
if(typeof data85 === "string"){
if(func3(data85) < 1){
const err163 = {instancePath:instancePath+"/features/" + i0+"/properties/hazard_name",schemaPath:"#/properties/features/items/properties/properties/properties/hazard_name/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err163];
}
else {
vErrors.push(err163);
}
errors++;
}
}
else {
const err164 = {instancePath:instancePath+"/features/" + i0+"/properties/hazard_name",schemaPath:"#/properties/features/items/properties/properties/properties/hazard_name/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err164];
}
else {
vErrors.push(err164);
}
errors++;
}
}
if(data5.hazard_type !== undefined){
let data86 = data5.hazard_type;
if(!((data86 === "natural") || (data86 === "non natural"))){
const err165 = {instancePath:instancePath+"/features/" + i0+"/properties/hazard_type",schemaPath:"#/properties/features/items/properties/properties/properties/hazard_type/enum",keyword:"enum",params:{allowedValues: schema13.properties.features.items.properties.properties.properties.hazard_type.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err165];
}
else {
vErrors.push(err165);
}
errors++;
}
}
if(data5.event_time !== undefined){
let data87 = data5.event_time;
if(typeof data87 === "string"){
if(!(formats0.validate(data87))){
const err166 = {instancePath:instancePath+"/features/" + i0+"/properties/event_time",schemaPath:"#/properties/features/items/properties/properties/properties/event_time/format",keyword:"format",params:{format: "date-time"},message:"must match format \""+"date-time"+"\""};
if(vErrors === null){
vErrors = [err166];
}
else {
vErrors.push(err166);
}
errors++;
}
}
else {
const err167 = {instancePath:instancePath+"/features/" + i0+"/properties/event_time",schemaPath:"#/properties/features/items/properties/properties/properties/event_time/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err167];
}
else {
vErrors.push(err167);
}
errors++;
}
}
if(data5.event_year !== undefined){
let data88 = data5.event_year;
if(!(((typeof data88 == "number") && (!(data88 % 1) && !isNaN(data88))) && (isFinite(data88)))){
const err168 = {instancePath:instancePath+"/features/" + i0+"/properties/event_year",schemaPath:"#/properties/features/items/properties/properties/properties/event_year/type",keyword:"type",params:{type: "integer"},message:"must be integer"};
if(vErrors === null){
vErrors = [err168];
}
else {
vErrors.push(err168);
}
errors++;
}
if((typeof data88 == "number") && (isFinite(data88))){
if(data88 > 2200 || isNaN(data88)){
const err169 = {instancePath:instancePath+"/features/" + i0+"/properties/event_year",schemaPath:"#/properties/features/items/properties/properties/properties/event_year/maximum",keyword:"maximum",params:{comparison: "<=", limit: 2200},message:"must be <= 2200"};
if(vErrors === null){
vErrors = [err169];
}
else {
vErrors.push(err169);
}
errors++;
}
if(data88 < 1900 || isNaN(data88)){
const err170 = {instancePath:instancePath+"/features/" + i0+"/properties/event_year",schemaPath:"#/properties/features/items/properties/properties/properties/event_year/minimum",keyword:"minimum",params:{comparison: ">=", limit: 1900},message:"must be >= 1900"};
if(vErrors === null){
vErrors = [err170];
}
else {
vErrors.push(err170);
}
errors++;
}
}
}
if(data5.event_local_date !== undefined){
let data89 = data5.event_local_date;
if(typeof data89 === "string"){
if(!(formats30.validate(data89))){
const err171 = {instancePath:instancePath+"/features/" + i0+"/properties/event_local_date",schemaPath:"#/properties/features/items/properties/properties/properties/event_local_date/format",keyword:"format",params:{format: "date"},message:"must match format \""+"date"+"\""};
if(vErrors === null){
vErrors = [err171];
}
else {
vErrors.push(err171);
}
errors++;
}
}
else {
const err172 = {instancePath:instancePath+"/features/" + i0+"/properties/event_local_date",schemaPath:"#/properties/features/items/properties/properties/properties/event_local_date/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err172];
}
else {
vErrors.push(err172);
}
errors++;
}
}
if(data5.reported_time !== undefined){
let data90 = data5.reported_time;
if((typeof data90 !== "string") && (data90 !== null)){
const err173 = {instancePath:instancePath+"/features/" + i0+"/properties/reported_time",schemaPath:"#/properties/features/items/properties/properties/properties/reported_time/type",keyword:"type",params:{type: schema13.properties.features.items.properties.properties.properties.reported_time.type},message:"must be string,null"};
if(vErrors === null){
vErrors = [err173];
}
else {
vErrors.push(err173);
}
errors++;
}
if(typeof data90 === "string"){
if(!(formats0.validate(data90))){
const err174 = {instancePath:instancePath+"/features/" + i0+"/properties/reported_time",schemaPath:"#/properties/features/items/properties/properties/properties/reported_time/format",keyword:"format",params:{format: "date-time"},message:"must match format \""+"date-time"+"\""};
if(vErrors === null){
vErrors = [err174];
}
else {
vErrors.push(err174);
}
errors++;
}
}
}
if(data5.verified !== undefined){
if(typeof data5.verified !== "boolean"){
const err175 = {instancePath:instancePath+"/features/" + i0+"/properties/verified",schemaPath:"#/properties/features/items/properties/properties/properties/verified/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"};
if(vErrors === null){
vErrors = [err175];
}
else {
vErrors.push(err175);
}
errors++;
}
}
if(data5.approved !== undefined){
if(typeof data5.approved !== "boolean"){
const err176 = {instancePath:instancePath+"/features/" + i0+"/properties/approved",schemaPath:"#/properties/features/items/properties/properties/properties/approved/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"};
if(vErrors === null){
vErrors = [err176];
}
else {
vErrors.push(err176);
}
errors++;
}
}
if(data5.source_label !== undefined){
let data93 = data5.source_label;
if((typeof data93 !== "string") && (data93 !== null)){
const err177 = {instancePath:instancePath+"/features/" + i0+"/properties/source_label",schemaPath:"#/properties/features/items/properties/properties/properties/source_label/type",keyword:"type",params:{type: schema13.properties.features.items.properties.properties.properties.source_label.type},message:"must be string,null"};
if(vErrors === null){
vErrors = [err177];
}
else {
vErrors.push(err177);
}
errors++;
}
}
if(data5.data_source_name !== undefined){
let data94 = data5.data_source_name;
if((typeof data94 !== "string") && (data94 !== null)){
const err178 = {instancePath:instancePath+"/features/" + i0+"/properties/data_source_name",schemaPath:"#/properties/features/items/properties/properties/properties/data_source_name/type",keyword:"type",params:{type: schema13.properties.features.items.properties.properties.properties.data_source_name.type},message:"must be string,null"};
if(vErrors === null){
vErrors = [err178];
}
else {
vErrors.push(err178);
}
errors++;
}
}
if(data5.loss_reference_id !== undefined){
let data95 = data5.loss_reference_id;
if((typeof data95 !== "string") && (data95 !== null)){
const err179 = {instancePath:instancePath+"/features/" + i0+"/properties/loss_reference_id",schemaPath:"#/properties/features/items/properties/properties/properties/loss_reference_id/type",keyword:"type",params:{type: schema13.properties.features.items.properties.properties.properties.loss_reference_id.type},message:"must be string,null"};
if(vErrors === null){
vErrors = [err179];
}
else {
vErrors.push(err179);
}
errors++;
}
}
if(data5.reported_deaths !== undefined){
let data96 = data5.reported_deaths;
if((!(((typeof data96 == "number") && (!(data96 % 1) && !isNaN(data96))) && (isFinite(data96)))) && (data96 !== null)){
const err180 = {instancePath:instancePath+"/features/" + i0+"/properties/reported_deaths",schemaPath:"#/properties/features/items/properties/properties/properties/reported_deaths/type",keyword:"type",params:{type: schema13.properties.features.items.properties.properties.properties.reported_deaths.type},message:"must be integer,null"};
if(vErrors === null){
vErrors = [err180];
}
else {
vErrors.push(err180);
}
errors++;
}
if((typeof data96 == "number") && (isFinite(data96))){
if(data96 < 0 || isNaN(data96)){
const err181 = {instancePath:instancePath+"/features/" + i0+"/properties/reported_deaths",schemaPath:"#/properties/features/items/properties/properties/properties/reported_deaths/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
if(vErrors === null){
vErrors = [err181];
}
else {
vErrors.push(err181);
}
errors++;
}
}
}
if(data5.reported_injured !== undefined){
let data97 = data5.reported_injured;
if((!(((typeof data97 == "number") && (!(data97 % 1) && !isNaN(data97))) && (isFinite(data97)))) && (data97 !== null)){
const err182 = {instancePath:instancePath+"/features/" + i0+"/properties/reported_injured",schemaPath:"#/properties/features/items/properties/properties/properties/reported_injured/type",keyword:"type",params:{type: schema13.properties.features.items.properties.properties.properties.reported_injured.type},message:"must be integer,null"};
if(vErrors === null){
vErrors = [err182];
}
else {
vErrors.push(err182);
}
errors++;
}
if((typeof data97 == "number") && (isFinite(data97))){
if(data97 < 0 || isNaN(data97)){
const err183 = {instancePath:instancePath+"/features/" + i0+"/properties/reported_injured",schemaPath:"#/properties/features/items/properties/properties/properties/reported_injured/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
if(vErrors === null){
vErrors = [err183];
}
else {
vErrors.push(err183);
}
errors++;
}
}
}
if(data5.reported_missing !== undefined){
let data98 = data5.reported_missing;
if((!(((typeof data98 == "number") && (!(data98 % 1) && !isNaN(data98))) && (isFinite(data98)))) && (data98 !== null)){
const err184 = {instancePath:instancePath+"/features/" + i0+"/properties/reported_missing",schemaPath:"#/properties/features/items/properties/properties/properties/reported_missing/type",keyword:"type",params:{type: schema13.properties.features.items.properties.properties.properties.reported_missing.type},message:"must be integer,null"};
if(vErrors === null){
vErrors = [err184];
}
else {
vErrors.push(err184);
}
errors++;
}
if((typeof data98 == "number") && (isFinite(data98))){
if(data98 < 0 || isNaN(data98)){
const err185 = {instancePath:instancePath+"/features/" + i0+"/properties/reported_missing",schemaPath:"#/properties/features/items/properties/properties/properties/reported_missing/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
if(vErrors === null){
vErrors = [err185];
}
else {
vErrors.push(err185);
}
errors++;
}
}
}
if(data5.reported_affected !== undefined){
let data99 = data5.reported_affected;
if((!(((typeof data99 == "number") && (!(data99 % 1) && !isNaN(data99))) && (isFinite(data99)))) && (data99 !== null)){
const err186 = {instancePath:instancePath+"/features/" + i0+"/properties/reported_affected",schemaPath:"#/properties/features/items/properties/properties/properties/reported_affected/type",keyword:"type",params:{type: schema13.properties.features.items.properties.properties.properties.reported_affected.type},message:"must be integer,null"};
if(vErrors === null){
vErrors = [err186];
}
else {
vErrors.push(err186);
}
errors++;
}
if((typeof data99 == "number") && (isFinite(data99))){
if(data99 < 0 || isNaN(data99)){
const err187 = {instancePath:instancePath+"/features/" + i0+"/properties/reported_affected",schemaPath:"#/properties/features/items/properties/properties/properties/reported_affected/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
if(vErrors === null){
vErrors = [err187];
}
else {
vErrors.push(err187);
}
errors++;
}
}
}
if(data5.estimated_loss_npr !== undefined){
let data100 = data5.estimated_loss_npr;
if((!((typeof data100 == "number") && (isFinite(data100)))) && (data100 !== null)){
const err188 = {instancePath:instancePath+"/features/" + i0+"/properties/estimated_loss_npr",schemaPath:"#/properties/features/items/properties/properties/properties/estimated_loss_npr/type",keyword:"type",params:{type: schema13.properties.features.items.properties.properties.properties.estimated_loss_npr.type},message:"must be number,null"};
if(vErrors === null){
vErrors = [err188];
}
else {
vErrors.push(err188);
}
errors++;
}
if((typeof data100 == "number") && (isFinite(data100))){
if(data100 < 0 || isNaN(data100)){
const err189 = {instancePath:instancePath+"/features/" + i0+"/properties/estimated_loss_npr",schemaPath:"#/properties/features/items/properties/properties/properties/estimated_loss_npr/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
if(vErrors === null){
vErrors = [err189];
}
else {
vErrors.push(err189);
}
errors++;
}
}
}
if(data5.street_address !== undefined){
let data101 = data5.street_address;
if((typeof data101 !== "string") && (data101 !== null)){
const err190 = {instancePath:instancePath+"/features/" + i0+"/properties/street_address",schemaPath:"#/properties/features/items/properties/properties/properties/street_address/type",keyword:"type",params:{type: schema13.properties.features.items.properties.properties.properties.street_address.type},message:"must be string,null"};
if(vErrors === null){
vErrors = [err190];
}
else {
vErrors.push(err190);
}
errors++;
}
}
if(data5.event_description !== undefined){
let data102 = data5.event_description;
if((typeof data102 !== "string") && (data102 !== null)){
const err191 = {instancePath:instancePath+"/features/" + i0+"/properties/event_description",schemaPath:"#/properties/features/items/properties/properties/properties/event_description/type",keyword:"type",params:{type: schema13.properties.features.items.properties.properties.properties.event_description.type},message:"must be string,null"};
if(vErrors === null){
vErrors = [err191];
}
else {
vErrors.push(err191);
}
errors++;
}
}
if(data5.magnitude !== undefined){
let data103 = data5.magnitude;
if(!((typeof data103 == "number") && (isFinite(data103)))){
const err192 = {instancePath:instancePath+"/features/" + i0+"/properties/magnitude",schemaPath:"#/properties/features/items/properties/properties/properties/magnitude/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err192];
}
else {
vErrors.push(err192);
}
errors++;
}
}
if(data5.depth_km !== undefined){
let data104 = data5.depth_km;
if((typeof data104 == "number") && (isFinite(data104))){
if(data104 > 1000 || isNaN(data104)){
const err193 = {instancePath:instancePath+"/features/" + i0+"/properties/depth_km",schemaPath:"#/properties/features/items/properties/properties/properties/depth_km/maximum",keyword:"maximum",params:{comparison: "<=", limit: 1000},message:"must be <= 1000"};
if(vErrors === null){
vErrors = [err193];
}
else {
vErrors.push(err193);
}
errors++;
}
if(data104 < -100 || isNaN(data104)){
const err194 = {instancePath:instancePath+"/features/" + i0+"/properties/depth_km",schemaPath:"#/properties/features/items/properties/properties/properties/depth_km/minimum",keyword:"minimum",params:{comparison: ">=", limit: -100},message:"must be >= -100"};
if(vErrors === null){
vErrors = [err194];
}
else {
vErrors.push(err194);
}
errors++;
}
}
else {
const err195 = {instancePath:instancePath+"/features/" + i0+"/properties/depth_km",schemaPath:"#/properties/features/items/properties/properties/properties/depth_km/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err195];
}
else {
vErrors.push(err195);
}
errors++;
}
}
if(data5.place_name !== undefined){
let data105 = data5.place_name;
if((typeof data105 !== "string") && (data105 !== null)){
const err196 = {instancePath:instancePath+"/features/" + i0+"/properties/place_name",schemaPath:"#/properties/features/items/properties/properties/properties/place_name/type",keyword:"type",params:{type: schema13.properties.features.items.properties.properties.properties.place_name.type},message:"must be string,null"};
if(vErrors === null){
vErrors = [err196];
}
else {
vErrors.push(err196);
}
errors++;
}
}
if(data5.magnitude_type !== undefined){
let data106 = data5.magnitude_type;
if((typeof data106 !== "string") && (data106 !== null)){
const err197 = {instancePath:instancePath+"/features/" + i0+"/properties/magnitude_type",schemaPath:"#/properties/features/items/properties/properties/properties/magnitude_type/type",keyword:"type",params:{type: schema13.properties.features.items.properties.properties.properties.magnitude_type.type},message:"must be string,null"};
if(vErrors === null){
vErrors = [err197];
}
else {
vErrors.push(err197);
}
errors++;
}
}
if(data5.network !== undefined){
let data107 = data5.network;
if(typeof data107 === "string"){
if(func3(data107) < 1){
const err198 = {instancePath:instancePath+"/features/" + i0+"/properties/network",schemaPath:"#/properties/features/items/properties/properties/properties/network/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err198];
}
else {
vErrors.push(err198);
}
errors++;
}
}
else {
const err199 = {instancePath:instancePath+"/features/" + i0+"/properties/network",schemaPath:"#/properties/features/items/properties/properties/properties/network/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err199];
}
else {
vErrors.push(err199);
}
errors++;
}
}
if(data5.significance !== undefined){
let data108 = data5.significance;
if(!(((typeof data108 == "number") && (!(data108 % 1) && !isNaN(data108))) && (isFinite(data108)))){
const err200 = {instancePath:instancePath+"/features/" + i0+"/properties/significance",schemaPath:"#/properties/features/items/properties/properties/properties/significance/type",keyword:"type",params:{type: "integer"},message:"must be integer"};
if(vErrors === null){
vErrors = [err200];
}
else {
vErrors.push(err200);
}
errors++;
}
if((typeof data108 == "number") && (isFinite(data108))){
if(data108 < 0 || isNaN(data108)){
const err201 = {instancePath:instancePath+"/features/" + i0+"/properties/significance",schemaPath:"#/properties/features/items/properties/properties/properties/significance/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
if(vErrors === null){
vErrors = [err201];
}
else {
vErrors.push(err201);
}
errors++;
}
}
}
if(data5.event_status !== undefined){
let data109 = data5.event_status;
if(typeof data109 === "string"){
if(func3(data109) < 1){
const err202 = {instancePath:instancePath+"/features/" + i0+"/properties/event_status",schemaPath:"#/properties/features/items/properties/properties/properties/event_status/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err202];
}
else {
vErrors.push(err202);
}
errors++;
}
}
else {
const err203 = {instancePath:instancePath+"/features/" + i0+"/properties/event_status",schemaPath:"#/properties/features/items/properties/properties/properties/event_status/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err203];
}
else {
vErrors.push(err203);
}
errors++;
}
}
if(data5.epicenter_only !== undefined){
if(typeof data5.epicenter_only !== "boolean"){
const err204 = {instancePath:instancePath+"/features/" + i0+"/properties/epicenter_only",schemaPath:"#/properties/features/items/properties/properties/properties/epicenter_only/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"};
if(vErrors === null){
vErrors = [err204];
}
else {
vErrors.push(err204);
}
errors++;
}
}
if(data5.evidence_status !== undefined){
let data111 = data5.evidence_status;
if(!((((data111 === "observed") || (data111 === "reported")) || (data111 === "derived")) || (data111 === "modelled"))){
const err205 = {instancePath:instancePath+"/features/" + i0+"/properties/evidence_status",schemaPath:"#/properties/features/items/properties/properties/properties/evidence_status/enum",keyword:"enum",params:{allowedValues: schema13.properties.features.items.properties.properties.properties.evidence_status.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err205];
}
else {
vErrors.push(err205);
}
errors++;
}
}
if(data5.hazard_footprint !== undefined){
if(typeof data5.hazard_footprint !== "boolean"){
const err206 = {instancePath:instancePath+"/features/" + i0+"/properties/hazard_footprint",schemaPath:"#/properties/features/items/properties/properties/properties/hazard_footprint/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"};
if(vErrors === null){
vErrors = [err206];
}
else {
vErrors.push(err206);
}
errors++;
}
}
if(data5.flood_class !== undefined){
let data113 = data5.flood_class;
if(typeof data113 === "string"){
if(func3(data113) < 1){
const err207 = {instancePath:instancePath+"/features/" + i0+"/properties/flood_class",schemaPath:"#/properties/features/items/properties/properties/properties/flood_class/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err207];
}
else {
vErrors.push(err207);
}
errors++;
}
}
else {
const err208 = {instancePath:instancePath+"/features/" + i0+"/properties/flood_class",schemaPath:"#/properties/features/items/properties/properties/properties/flood_class/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err208];
}
else {
vErrors.push(err208);
}
errors++;
}
}
if(data5.landslide_category !== undefined){
let data114 = data5.landslide_category;
if(typeof data114 === "string"){
if(func3(data114) < 1){
const err209 = {instancePath:instancePath+"/features/" + i0+"/properties/landslide_category",schemaPath:"#/properties/features/items/properties/properties/properties/landslide_category/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err209];
}
else {
vErrors.push(err209);
}
errors++;
}
}
else {
const err210 = {instancePath:instancePath+"/features/" + i0+"/properties/landslide_category",schemaPath:"#/properties/features/items/properties/properties/properties/landslide_category/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err210];
}
else {
vErrors.push(err210);
}
errors++;
}
}
if(data5.confidence !== undefined){
let data115 = data5.confidence;
if((typeof data115 !== "string") && (data115 !== null)){
const err211 = {instancePath:instancePath+"/features/" + i0+"/properties/confidence",schemaPath:"#/properties/features/items/properties/properties/properties/confidence/type",keyword:"type",params:{type: schema13.properties.features.items.properties.properties.properties.confidence.type},message:"must be string,null"};
if(vErrors === null){
vErrors = [err211];
}
else {
vErrors.push(err211);
}
errors++;
}
}
if(data5.confidence_basis !== undefined){
let data116 = data5.confidence_basis;
if(typeof data116 === "string"){
if(func3(data116) < 1){
const err212 = {instancePath:instancePath+"/features/" + i0+"/properties/confidence_basis",schemaPath:"#/properties/features/items/properties/properties/properties/confidence_basis/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err212];
}
else {
vErrors.push(err212);
}
errors++;
}
}
else {
const err213 = {instancePath:instancePath+"/features/" + i0+"/properties/confidence_basis",schemaPath:"#/properties/features/items/properties/properties/properties/confidence_basis/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err213];
}
else {
vErrors.push(err213);
}
errors++;
}
}
if(data5.susceptibility_output !== undefined){
if(typeof data5.susceptibility_output !== "boolean"){
const err214 = {instancePath:instancePath+"/features/" + i0+"/properties/susceptibility_output",schemaPath:"#/properties/features/items/properties/properties/properties/susceptibility_output/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"};
if(vErrors === null){
vErrors = [err214];
}
else {
vErrors.push(err214);
}
errors++;
}
}
if(data5.facility_name !== undefined){
let data118 = data5.facility_name;
if((typeof data118 !== "string") && (data118 !== null)){
const err215 = {instancePath:instancePath+"/features/" + i0+"/properties/facility_name",schemaPath:"#/properties/features/items/properties/properties/properties/facility_name/type",keyword:"type",params:{type: schema13.properties.features.items.properties.properties.properties.facility_name.type},message:"must be string,null"};
if(vErrors === null){
vErrors = [err215];
}
else {
vErrors.push(err215);
}
errors++;
}
}
if(data5.facility_status !== undefined){
let data119 = data5.facility_status;
if(typeof data119 === "string"){
if(func3(data119) < 1){
const err216 = {instancePath:instancePath+"/features/" + i0+"/properties/facility_status",schemaPath:"#/properties/features/items/properties/properties/properties/facility_status/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err216];
}
else {
vErrors.push(err216);
}
errors++;
}
}
else {
const err217 = {instancePath:instancePath+"/features/" + i0+"/properties/facility_status",schemaPath:"#/properties/features/items/properties/properties/properties/facility_status/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err217];
}
else {
vErrors.push(err217);
}
errors++;
}
}
if(data5.facility_type !== undefined){
let data120 = data5.facility_type;
if(typeof data120 === "string"){
if(func3(data120) < 1){
const err218 = {instancePath:instancePath+"/features/" + i0+"/properties/facility_type",schemaPath:"#/properties/features/items/properties/properties/properties/facility_type/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err218];
}
else {
vErrors.push(err218);
}
errors++;
}
}
else {
const err219 = {instancePath:instancePath+"/features/" + i0+"/properties/facility_type",schemaPath:"#/properties/features/items/properties/properties/properties/facility_type/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err219];
}
else {
vErrors.push(err219);
}
errors++;
}
}
if(data5.capacity_mw !== undefined){
let data121 = data5.capacity_mw;
if((!((typeof data121 == "number") && (isFinite(data121)))) && (data121 !== null)){
const err220 = {instancePath:instancePath+"/features/" + i0+"/properties/capacity_mw",schemaPath:"#/properties/features/items/properties/properties/properties/capacity_mw/type",keyword:"type",params:{type: schema13.properties.features.items.properties.properties.properties.capacity_mw.type},message:"must be number,null"};
if(vErrors === null){
vErrors = [err220];
}
else {
vErrors.push(err220);
}
errors++;
}
if((typeof data121 == "number") && (isFinite(data121))){
if(data121 < 0 || isNaN(data121)){
const err221 = {instancePath:instancePath+"/features/" + i0+"/properties/capacity_mw",schemaPath:"#/properties/features/items/properties/properties/properties/capacity_mw/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
if(vErrors === null){
vErrors = [err221];
}
else {
vErrors.push(err221);
}
errors++;
}
}
}
if(data5.plant_method !== undefined){
let data122 = data5.plant_method;
if((typeof data122 !== "string") && (data122 !== null)){
const err222 = {instancePath:instancePath+"/features/" + i0+"/properties/plant_method",schemaPath:"#/properties/features/items/properties/properties/properties/plant_method/type",keyword:"type",params:{type: schema13.properties.features.items.properties.properties.properties.plant_method.type},message:"must be string,null"};
if(vErrors === null){
vErrors = [err222];
}
else {
vErrors.push(err222);
}
errors++;
}
}
if(data5.operator_name !== undefined){
let data123 = data5.operator_name;
if((typeof data123 !== "string") && (data123 !== null)){
const err223 = {instancePath:instancePath+"/features/" + i0+"/properties/operator_name",schemaPath:"#/properties/features/items/properties/properties/properties/operator_name/type",keyword:"type",params:{type: schema13.properties.features.items.properties.properties.properties.operator_name.type},message:"must be string,null"};
if(vErrors === null){
vErrors = [err223];
}
else {
vErrors.push(err223);
}
errors++;
}
}
if(data5.osm_element_type !== undefined){
let data124 = data5.osm_element_type;
if(!(((data124 === "node") || (data124 === "way")) || (data124 === "relation"))){
const err224 = {instancePath:instancePath+"/features/" + i0+"/properties/osm_element_type",schemaPath:"#/properties/features/items/properties/properties/properties/osm_element_type/enum",keyword:"enum",params:{allowedValues: schema13.properties.features.items.properties.properties.properties.osm_element_type.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err224];
}
else {
vErrors.push(err224);
}
errors++;
}
}
if(data5.osm_element_id !== undefined){
let data125 = data5.osm_element_id;
if(typeof data125 === "string"){
if(func3(data125) < 1){
const err225 = {instancePath:instancePath+"/features/" + i0+"/properties/osm_element_id",schemaPath:"#/properties/features/items/properties/properties/properties/osm_element_id/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err225];
}
else {
vErrors.push(err225);
}
errors++;
}
}
else {
const err226 = {instancePath:instancePath+"/features/" + i0+"/properties/osm_element_id",schemaPath:"#/properties/features/items/properties/properties/properties/osm_element_id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err226];
}
else {
vErrors.push(err226);
}
errors++;
}
}
if(data5.osm_source_timestamp !== undefined){
let data126 = data5.osm_source_timestamp;
if(typeof data126 === "string"){
if(!(formats0.validate(data126))){
const err227 = {instancePath:instancePath+"/features/" + i0+"/properties/osm_source_timestamp",schemaPath:"#/properties/features/items/properties/properties/properties/osm_source_timestamp/format",keyword:"format",params:{format: "date-time"},message:"must match format \""+"date-time"+"\""};
if(vErrors === null){
vErrors = [err227];
}
else {
vErrors.push(err227);
}
errors++;
}
}
else {
const err228 = {instancePath:instancePath+"/features/" + i0+"/properties/osm_source_timestamp",schemaPath:"#/properties/features/items/properties/properties/properties/osm_source_timestamp/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err228];
}
else {
vErrors.push(err228);
}
errors++;
}
}
if(data5.infrastructure_class !== undefined){
let data127 = data5.infrastructure_class;
if(!((((((data127 === "road") || (data127 === "bridge")) || (data127 === "school")) || (data127 === "health")) || (data127 === "emergency")) || (data127 === "settlement"))){
const err229 = {instancePath:instancePath+"/features/" + i0+"/properties/infrastructure_class",schemaPath:"#/properties/features/items/properties/properties/properties/infrastructure_class/enum",keyword:"enum",params:{allowedValues: schema13.properties.features.items.properties.properties.properties.infrastructure_class.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err229];
}
else {
vErrors.push(err229);
}
errors++;
}
}
if(data5.asset_name !== undefined){
let data128 = data5.asset_name;
if((typeof data128 !== "string") && (data128 !== null)){
const err230 = {instancePath:instancePath+"/features/" + i0+"/properties/asset_name",schemaPath:"#/properties/features/items/properties/properties/properties/asset_name/type",keyword:"type",params:{type: schema13.properties.features.items.properties.properties.properties.asset_name.type},message:"must be string,null"};
if(vErrors === null){
vErrors = [err230];
}
else {
vErrors.push(err230);
}
errors++;
}
}
if(data5.asset_subtype !== undefined){
let data129 = data5.asset_subtype;
if(typeof data129 === "string"){
if(func3(data129) < 1){
const err231 = {instancePath:instancePath+"/features/" + i0+"/properties/asset_subtype",schemaPath:"#/properties/features/items/properties/properties/properties/asset_subtype/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err231];
}
else {
vErrors.push(err231);
}
errors++;
}
}
else {
const err232 = {instancePath:instancePath+"/features/" + i0+"/properties/asset_subtype",schemaPath:"#/properties/features/items/properties/properties/properties/asset_subtype/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err232];
}
else {
vErrors.push(err232);
}
errors++;
}
}
if(data5.position_basis !== undefined){
let data130 = data5.position_basis;
if(typeof data130 === "string"){
if(func3(data130) < 1){
const err233 = {instancePath:instancePath+"/features/" + i0+"/properties/position_basis",schemaPath:"#/properties/features/items/properties/properties/properties/position_basis/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err233];
}
else {
vErrors.push(err233);
}
errors++;
}
}
else {
const err234 = {instancePath:instancePath+"/features/" + i0+"/properties/position_basis",schemaPath:"#/properties/features/items/properties/properties/properties/position_basis/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err234];
}
else {
vErrors.push(err234);
}
errors++;
}
}
if(data5.display_geometry_simplified !== undefined){
if(typeof data5.display_geometry_simplified !== "boolean"){
const err235 = {instancePath:instancePath+"/features/" + i0+"/properties/display_geometry_simplified",schemaPath:"#/properties/features/items/properties/properties/properties/display_geometry_simplified/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"};
if(vErrors === null){
vErrors = [err235];
}
else {
vErrors.push(err235);
}
errors++;
}
}
if(data5.asset_ref !== undefined){
let data132 = data5.asset_ref;
if((typeof data132 !== "string") && (data132 !== null)){
const err236 = {instancePath:instancePath+"/features/" + i0+"/properties/asset_ref",schemaPath:"#/properties/features/items/properties/properties/properties/asset_ref/type",keyword:"type",params:{type: schema13.properties.features.items.properties.properties.properties.asset_ref.type},message:"must be string,null"};
if(vErrors === null){
vErrors = [err236];
}
else {
vErrors.push(err236);
}
errors++;
}
}
if(data5.surface !== undefined){
let data133 = data5.surface;
if((typeof data133 !== "string") && (data133 !== null)){
const err237 = {instancePath:instancePath+"/features/" + i0+"/properties/surface",schemaPath:"#/properties/features/items/properties/properties/properties/surface/type",keyword:"type",params:{type: schema13.properties.features.items.properties.properties.properties.surface.type},message:"must be string,null"};
if(vErrors === null){
vErrors = [err237];
}
else {
vErrors.push(err237);
}
errors++;
}
}
}
else {
const err238 = {instancePath:instancePath+"/features/" + i0+"/properties",schemaPath:"#/properties/features/items/properties/properties/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err238];
}
else {
vErrors.push(err238);
}
errors++;
}
}
if(data2.geometry !== undefined){
let data134 = data2.geometry;
const _errs274 = errors;
let valid14 = false;
let passing0 = null;
const _errs275 = errors;
if(data134 && typeof data134 == "object" && !Array.isArray(data134)){
if(data134.type === undefined){
const err239 = {instancePath:instancePath+"/features/" + i0+"/geometry",schemaPath:"#/properties/features/items/properties/geometry/oneOf/0/required",keyword:"required",params:{missingProperty: "type"},message:"must have required property '"+"type"+"'"};
if(vErrors === null){
vErrors = [err239];
}
else {
vErrors.push(err239);
}
errors++;
}
if(data134.coordinates === undefined){
const err240 = {instancePath:instancePath+"/features/" + i0+"/geometry",schemaPath:"#/properties/features/items/properties/geometry/oneOf/0/required",keyword:"required",params:{missingProperty: "coordinates"},message:"must have required property '"+"coordinates"+"'"};
if(vErrors === null){
vErrors = [err240];
}
else {
vErrors.push(err240);
}
errors++;
}
for(const key3 in data134){
if(!((key3 === "type") || (key3 === "coordinates"))){
const err241 = {instancePath:instancePath+"/features/" + i0+"/geometry",schemaPath:"#/properties/features/items/properties/geometry/oneOf/0/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key3},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err241];
}
else {
vErrors.push(err241);
}
errors++;
}
}
if(data134.type !== undefined){
if("Point" !== data134.type){
const err242 = {instancePath:instancePath+"/features/" + i0+"/geometry/type",schemaPath:"#/properties/features/items/properties/geometry/oneOf/0/properties/type/const",keyword:"const",params:{allowedValue: "Point"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err242];
}
else {
vErrors.push(err242);
}
errors++;
}
}
if(data134.coordinates !== undefined){
let data136 = data134.coordinates;
if(Array.isArray(data136)){
if(data136.length > 2){
const err243 = {instancePath:instancePath+"/features/" + i0+"/geometry/coordinates",schemaPath:"#/definitions/position/maxItems",keyword:"maxItems",params:{limit: 2},message:"must NOT have more than 2 items"};
if(vErrors === null){
vErrors = [err243];
}
else {
vErrors.push(err243);
}
errors++;
}
if(data136.length < 2){
const err244 = {instancePath:instancePath+"/features/" + i0+"/geometry/coordinates",schemaPath:"#/definitions/position/minItems",keyword:"minItems",params:{limit: 2},message:"must NOT have fewer than 2 items"};
if(vErrors === null){
vErrors = [err244];
}
else {
vErrors.push(err244);
}
errors++;
}
const len3 = data136.length;
if(!(len3 <= 2)){
const err245 = {instancePath:instancePath+"/features/" + i0+"/geometry/coordinates",schemaPath:"#/definitions/position/additionalItems",keyword:"additionalItems",params:{limit: 2},message:"must NOT have more than 2 items"};
if(vErrors === null){
vErrors = [err245];
}
else {
vErrors.push(err245);
}
errors++;
}
const len4 = data136.length;
if(len4 > 0){
let data137 = data136[0];
if((typeof data137 == "number") && (isFinite(data137))){
if(data137 > 180 || isNaN(data137)){
const err246 = {instancePath:instancePath+"/features/" + i0+"/geometry/coordinates/0",schemaPath:"#/definitions/position/items/0/maximum",keyword:"maximum",params:{comparison: "<=", limit: 180},message:"must be <= 180"};
if(vErrors === null){
vErrors = [err246];
}
else {
vErrors.push(err246);
}
errors++;
}
if(data137 < -180 || isNaN(data137)){
const err247 = {instancePath:instancePath+"/features/" + i0+"/geometry/coordinates/0",schemaPath:"#/definitions/position/items/0/minimum",keyword:"minimum",params:{comparison: ">=", limit: -180},message:"must be >= -180"};
if(vErrors === null){
vErrors = [err247];
}
else {
vErrors.push(err247);
}
errors++;
}
}
else {
const err248 = {instancePath:instancePath+"/features/" + i0+"/geometry/coordinates/0",schemaPath:"#/definitions/position/items/0/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err248];
}
else {
vErrors.push(err248);
}
errors++;
}
}
if(len4 > 1){
let data138 = data136[1];
if((typeof data138 == "number") && (isFinite(data138))){
if(data138 > 90 || isNaN(data138)){
const err249 = {instancePath:instancePath+"/features/" + i0+"/geometry/coordinates/1",schemaPath:"#/definitions/position/items/1/maximum",keyword:"maximum",params:{comparison: "<=", limit: 90},message:"must be <= 90"};
if(vErrors === null){
vErrors = [err249];
}
else {
vErrors.push(err249);
}
errors++;
}
if(data138 < -90 || isNaN(data138)){
const err250 = {instancePath:instancePath+"/features/" + i0+"/geometry/coordinates/1",schemaPath:"#/definitions/position/items/1/minimum",keyword:"minimum",params:{comparison: ">=", limit: -90},message:"must be >= -90"};
if(vErrors === null){
vErrors = [err250];
}
else {
vErrors.push(err250);
}
errors++;
}
}
else {
const err251 = {instancePath:instancePath+"/features/" + i0+"/geometry/coordinates/1",schemaPath:"#/definitions/position/items/1/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err251];
}
else {
vErrors.push(err251);
}
errors++;
}
}
}
else {
const err252 = {instancePath:instancePath+"/features/" + i0+"/geometry/coordinates",schemaPath:"#/definitions/position/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err252];
}
else {
vErrors.push(err252);
}
errors++;
}
}
}
else {
const err253 = {instancePath:instancePath+"/features/" + i0+"/geometry",schemaPath:"#/properties/features/items/properties/geometry/oneOf/0/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err253];
}
else {
vErrors.push(err253);
}
errors++;
}
var _valid3 = _errs275 === errors;
if(_valid3){
valid14 = true;
passing0 = 0;
}
const _errs286 = errors;
if(data134 && typeof data134 == "object" && !Array.isArray(data134)){
if(data134.type === undefined){
const err254 = {instancePath:instancePath+"/features/" + i0+"/geometry",schemaPath:"#/properties/features/items/properties/geometry/oneOf/1/required",keyword:"required",params:{missingProperty: "type"},message:"must have required property '"+"type"+"'"};
if(vErrors === null){
vErrors = [err254];
}
else {
vErrors.push(err254);
}
errors++;
}
if(data134.coordinates === undefined){
const err255 = {instancePath:instancePath+"/features/" + i0+"/geometry",schemaPath:"#/properties/features/items/properties/geometry/oneOf/1/required",keyword:"required",params:{missingProperty: "coordinates"},message:"must have required property '"+"coordinates"+"'"};
if(vErrors === null){
vErrors = [err255];
}
else {
vErrors.push(err255);
}
errors++;
}
for(const key4 in data134){
if(!((key4 === "type") || (key4 === "coordinates"))){
const err256 = {instancePath:instancePath+"/features/" + i0+"/geometry",schemaPath:"#/properties/features/items/properties/geometry/oneOf/1/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key4},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err256];
}
else {
vErrors.push(err256);
}
errors++;
}
}
if(data134.type !== undefined){
if("MultiPoint" !== data134.type){
const err257 = {instancePath:instancePath+"/features/" + i0+"/geometry/type",schemaPath:"#/properties/features/items/properties/geometry/oneOf/1/properties/type/const",keyword:"const",params:{allowedValue: "MultiPoint"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err257];
}
else {
vErrors.push(err257);
}
errors++;
}
}
if(data134.coordinates !== undefined){
let data140 = data134.coordinates;
if(Array.isArray(data140)){
if(data140.length < 1){
const err258 = {instancePath:instancePath+"/features/" + i0+"/geometry/coordinates",schemaPath:"#/properties/features/items/properties/geometry/oneOf/1/properties/coordinates/minItems",keyword:"minItems",params:{limit: 1},message:"must NOT have fewer than 1 items"};
if(vErrors === null){
vErrors = [err258];
}
else {
vErrors.push(err258);
}
errors++;
}
const len5 = data140.length;
for(let i5=0; i5<len5; i5++){
let data141 = data140[i5];
if(Array.isArray(data141)){
if(data141.length > 2){
const err259 = {instancePath:instancePath+"/features/" + i0+"/geometry/coordinates/" + i5,schemaPath:"#/definitions/position/maxItems",keyword:"maxItems",params:{limit: 2},message:"must NOT have more than 2 items"};
if(vErrors === null){
vErrors = [err259];
}
else {
vErrors.push(err259);
}
errors++;
}
if(data141.length < 2){
const err260 = {instancePath:instancePath+"/features/" + i0+"/geometry/coordinates/" + i5,schemaPath:"#/definitions/position/minItems",keyword:"minItems",params:{limit: 2},message:"must NOT have fewer than 2 items"};
if(vErrors === null){
vErrors = [err260];
}
else {
vErrors.push(err260);
}
errors++;
}
const len6 = data141.length;
if(!(len6 <= 2)){
const err261 = {instancePath:instancePath+"/features/" + i0+"/geometry/coordinates/" + i5,schemaPath:"#/definitions/position/additionalItems",keyword:"additionalItems",params:{limit: 2},message:"must NOT have more than 2 items"};
if(vErrors === null){
vErrors = [err261];
}
else {
vErrors.push(err261);
}
errors++;
}
const len7 = data141.length;
if(len7 > 0){
let data142 = data141[0];
if((typeof data142 == "number") && (isFinite(data142))){
if(data142 > 180 || isNaN(data142)){
const err262 = {instancePath:instancePath+"/features/" + i0+"/geometry/coordinates/" + i5+"/0",schemaPath:"#/definitions/position/items/0/maximum",keyword:"maximum",params:{comparison: "<=", limit: 180},message:"must be <= 180"};
if(vErrors === null){
vErrors = [err262];
}
else {
vErrors.push(err262);
}
errors++;
}
if(data142 < -180 || isNaN(data142)){
const err263 = {instancePath:instancePath+"/features/" + i0+"/geometry/coordinates/" + i5+"/0",schemaPath:"#/definitions/position/items/0/minimum",keyword:"minimum",params:{comparison: ">=", limit: -180},message:"must be >= -180"};
if(vErrors === null){
vErrors = [err263];
}
else {
vErrors.push(err263);
}
errors++;
}
}
else {
const err264 = {instancePath:instancePath+"/features/" + i0+"/geometry/coordinates/" + i5+"/0",schemaPath:"#/definitions/position/items/0/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err264];
}
else {
vErrors.push(err264);
}
errors++;
}
}
if(len7 > 1){
let data143 = data141[1];
if((typeof data143 == "number") && (isFinite(data143))){
if(data143 > 90 || isNaN(data143)){
const err265 = {instancePath:instancePath+"/features/" + i0+"/geometry/coordinates/" + i5+"/1",schemaPath:"#/definitions/position/items/1/maximum",keyword:"maximum",params:{comparison: "<=", limit: 90},message:"must be <= 90"};
if(vErrors === null){
vErrors = [err265];
}
else {
vErrors.push(err265);
}
errors++;
}
if(data143 < -90 || isNaN(data143)){
const err266 = {instancePath:instancePath+"/features/" + i0+"/geometry/coordinates/" + i5+"/1",schemaPath:"#/definitions/position/items/1/minimum",keyword:"minimum",params:{comparison: ">=", limit: -90},message:"must be >= -90"};
if(vErrors === null){
vErrors = [err266];
}
else {
vErrors.push(err266);
}
errors++;
}
}
else {
const err267 = {instancePath:instancePath+"/features/" + i0+"/geometry/coordinates/" + i5+"/1",schemaPath:"#/definitions/position/items/1/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err267];
}
else {
vErrors.push(err267);
}
errors++;
}
}
}
else {
const err268 = {instancePath:instancePath+"/features/" + i0+"/geometry/coordinates/" + i5,schemaPath:"#/definitions/position/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err268];
}
else {
vErrors.push(err268);
}
errors++;
}
}
}
else {
const err269 = {instancePath:instancePath+"/features/" + i0+"/geometry/coordinates",schemaPath:"#/properties/features/items/properties/geometry/oneOf/1/properties/coordinates/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err269];
}
else {
vErrors.push(err269);
}
errors++;
}
}
}
else {
const err270 = {instancePath:instancePath+"/features/" + i0+"/geometry",schemaPath:"#/properties/features/items/properties/geometry/oneOf/1/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err270];
}
else {
vErrors.push(err270);
}
errors++;
}
var _valid3 = _errs286 === errors;
if(_valid3 && valid14){
valid14 = false;
passing0 = [passing0, 1];
}
else {
if(_valid3){
valid14 = true;
passing0 = 1;
}
const _errs299 = errors;
if(data134 && typeof data134 == "object" && !Array.isArray(data134)){
if(data134.type === undefined){
const err271 = {instancePath:instancePath+"/features/" + i0+"/geometry",schemaPath:"#/properties/features/items/properties/geometry/oneOf/2/required",keyword:"required",params:{missingProperty: "type"},message:"must have required property '"+"type"+"'"};
if(vErrors === null){
vErrors = [err271];
}
else {
vErrors.push(err271);
}
errors++;
}
if(data134.coordinates === undefined){
const err272 = {instancePath:instancePath+"/features/" + i0+"/geometry",schemaPath:"#/properties/features/items/properties/geometry/oneOf/2/required",keyword:"required",params:{missingProperty: "coordinates"},message:"must have required property '"+"coordinates"+"'"};
if(vErrors === null){
vErrors = [err272];
}
else {
vErrors.push(err272);
}
errors++;
}
for(const key5 in data134){
if(!((key5 === "type") || (key5 === "coordinates"))){
const err273 = {instancePath:instancePath+"/features/" + i0+"/geometry",schemaPath:"#/properties/features/items/properties/geometry/oneOf/2/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key5},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err273];
}
else {
vErrors.push(err273);
}
errors++;
}
}
if(data134.type !== undefined){
if("LineString" !== data134.type){
const err274 = {instancePath:instancePath+"/features/" + i0+"/geometry/type",schemaPath:"#/properties/features/items/properties/geometry/oneOf/2/properties/type/const",keyword:"const",params:{allowedValue: "LineString"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err274];
}
else {
vErrors.push(err274);
}
errors++;
}
}
if(data134.coordinates !== undefined){
let data145 = data134.coordinates;
if(Array.isArray(data145)){
if(data145.length < 2){
const err275 = {instancePath:instancePath+"/features/" + i0+"/geometry/coordinates",schemaPath:"#/properties/features/items/properties/geometry/oneOf/2/properties/coordinates/minItems",keyword:"minItems",params:{limit: 2},message:"must NOT have fewer than 2 items"};
if(vErrors === null){
vErrors = [err275];
}
else {
vErrors.push(err275);
}
errors++;
}
const len8 = data145.length;
for(let i6=0; i6<len8; i6++){
let data146 = data145[i6];
if(Array.isArray(data146)){
if(data146.length > 2){
const err276 = {instancePath:instancePath+"/features/" + i0+"/geometry/coordinates/" + i6,schemaPath:"#/definitions/position/maxItems",keyword:"maxItems",params:{limit: 2},message:"must NOT have more than 2 items"};
if(vErrors === null){
vErrors = [err276];
}
else {
vErrors.push(err276);
}
errors++;
}
if(data146.length < 2){
const err277 = {instancePath:instancePath+"/features/" + i0+"/geometry/coordinates/" + i6,schemaPath:"#/definitions/position/minItems",keyword:"minItems",params:{limit: 2},message:"must NOT have fewer than 2 items"};
if(vErrors === null){
vErrors = [err277];
}
else {
vErrors.push(err277);
}
errors++;
}
const len9 = data146.length;
if(!(len9 <= 2)){
const err278 = {instancePath:instancePath+"/features/" + i0+"/geometry/coordinates/" + i6,schemaPath:"#/definitions/position/additionalItems",keyword:"additionalItems",params:{limit: 2},message:"must NOT have more than 2 items"};
if(vErrors === null){
vErrors = [err278];
}
else {
vErrors.push(err278);
}
errors++;
}
const len10 = data146.length;
if(len10 > 0){
let data147 = data146[0];
if((typeof data147 == "number") && (isFinite(data147))){
if(data147 > 180 || isNaN(data147)){
const err279 = {instancePath:instancePath+"/features/" + i0+"/geometry/coordinates/" + i6+"/0",schemaPath:"#/definitions/position/items/0/maximum",keyword:"maximum",params:{comparison: "<=", limit: 180},message:"must be <= 180"};
if(vErrors === null){
vErrors = [err279];
}
else {
vErrors.push(err279);
}
errors++;
}
if(data147 < -180 || isNaN(data147)){
const err280 = {instancePath:instancePath+"/features/" + i0+"/geometry/coordinates/" + i6+"/0",schemaPath:"#/definitions/position/items/0/minimum",keyword:"minimum",params:{comparison: ">=", limit: -180},message:"must be >= -180"};
if(vErrors === null){
vErrors = [err280];
}
else {
vErrors.push(err280);
}
errors++;
}
}
else {
const err281 = {instancePath:instancePath+"/features/" + i0+"/geometry/coordinates/" + i6+"/0",schemaPath:"#/definitions/position/items/0/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err281];
}
else {
vErrors.push(err281);
}
errors++;
}
}
if(len10 > 1){
let data148 = data146[1];
if((typeof data148 == "number") && (isFinite(data148))){
if(data148 > 90 || isNaN(data148)){
const err282 = {instancePath:instancePath+"/features/" + i0+"/geometry/coordinates/" + i6+"/1",schemaPath:"#/definitions/position/items/1/maximum",keyword:"maximum",params:{comparison: "<=", limit: 90},message:"must be <= 90"};
if(vErrors === null){
vErrors = [err282];
}
else {
vErrors.push(err282);
}
errors++;
}
if(data148 < -90 || isNaN(data148)){
const err283 = {instancePath:instancePath+"/features/" + i0+"/geometry/coordinates/" + i6+"/1",schemaPath:"#/definitions/position/items/1/minimum",keyword:"minimum",params:{comparison: ">=", limit: -90},message:"must be >= -90"};
if(vErrors === null){
vErrors = [err283];
}
else {
vErrors.push(err283);
}
errors++;
}
}
else {
const err284 = {instancePath:instancePath+"/features/" + i0+"/geometry/coordinates/" + i6+"/1",schemaPath:"#/definitions/position/items/1/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err284];
}
else {
vErrors.push(err284);
}
errors++;
}
}
}
else {
const err285 = {instancePath:instancePath+"/features/" + i0+"/geometry/coordinates/" + i6,schemaPath:"#/definitions/position/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err285];
}
else {
vErrors.push(err285);
}
errors++;
}
}
}
else {
const err286 = {instancePath:instancePath+"/features/" + i0+"/geometry/coordinates",schemaPath:"#/properties/features/items/properties/geometry/oneOf/2/properties/coordinates/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err286];
}
else {
vErrors.push(err286);
}
errors++;
}
}
}
else {
const err287 = {instancePath:instancePath+"/features/" + i0+"/geometry",schemaPath:"#/properties/features/items/properties/geometry/oneOf/2/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err287];
}
else {
vErrors.push(err287);
}
errors++;
}
var _valid3 = _errs299 === errors;
if(_valid3 && valid14){
valid14 = false;
passing0 = [passing0, 2];
}
else {
if(_valid3){
valid14 = true;
passing0 = 2;
}
const _errs312 = errors;
if(data134 && typeof data134 == "object" && !Array.isArray(data134)){
if(data134.type === undefined){
const err288 = {instancePath:instancePath+"/features/" + i0+"/geometry",schemaPath:"#/properties/features/items/properties/geometry/oneOf/3/required",keyword:"required",params:{missingProperty: "type"},message:"must have required property '"+"type"+"'"};
if(vErrors === null){
vErrors = [err288];
}
else {
vErrors.push(err288);
}
errors++;
}
if(data134.coordinates === undefined){
const err289 = {instancePath:instancePath+"/features/" + i0+"/geometry",schemaPath:"#/properties/features/items/properties/geometry/oneOf/3/required",keyword:"required",params:{missingProperty: "coordinates"},message:"must have required property '"+"coordinates"+"'"};
if(vErrors === null){
vErrors = [err289];
}
else {
vErrors.push(err289);
}
errors++;
}
for(const key6 in data134){
if(!((key6 === "type") || (key6 === "coordinates"))){
const err290 = {instancePath:instancePath+"/features/" + i0+"/geometry",schemaPath:"#/properties/features/items/properties/geometry/oneOf/3/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key6},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err290];
}
else {
vErrors.push(err290);
}
errors++;
}
}
if(data134.type !== undefined){
if("MultiLineString" !== data134.type){
const err291 = {instancePath:instancePath+"/features/" + i0+"/geometry/type",schemaPath:"#/properties/features/items/properties/geometry/oneOf/3/properties/type/const",keyword:"const",params:{allowedValue: "MultiLineString"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err291];
}
else {
vErrors.push(err291);
}
errors++;
}
}
if(data134.coordinates !== undefined){
let data150 = data134.coordinates;
if(Array.isArray(data150)){
if(data150.length < 1){
const err292 = {instancePath:instancePath+"/features/" + i0+"/geometry/coordinates",schemaPath:"#/properties/features/items/properties/geometry/oneOf/3/properties/coordinates/minItems",keyword:"minItems",params:{limit: 1},message:"must NOT have fewer than 1 items"};
if(vErrors === null){
vErrors = [err292];
}
else {
vErrors.push(err292);
}
errors++;
}
const len11 = data150.length;
for(let i7=0; i7<len11; i7++){
let data151 = data150[i7];
if(Array.isArray(data151)){
if(data151.length < 2){
const err293 = {instancePath:instancePath+"/features/" + i0+"/geometry/coordinates/" + i7,schemaPath:"#/properties/features/items/properties/geometry/oneOf/3/properties/coordinates/items/minItems",keyword:"minItems",params:{limit: 2},message:"must NOT have fewer than 2 items"};
if(vErrors === null){
vErrors = [err293];
}
else {
vErrors.push(err293);
}
errors++;
}
const len12 = data151.length;
for(let i8=0; i8<len12; i8++){
let data152 = data151[i8];
if(Array.isArray(data152)){
if(data152.length > 2){
const err294 = {instancePath:instancePath+"/features/" + i0+"/geometry/coordinates/" + i7+"/" + i8,schemaPath:"#/definitions/position/maxItems",keyword:"maxItems",params:{limit: 2},message:"must NOT have more than 2 items"};
if(vErrors === null){
vErrors = [err294];
}
else {
vErrors.push(err294);
}
errors++;
}
if(data152.length < 2){
const err295 = {instancePath:instancePath+"/features/" + i0+"/geometry/coordinates/" + i7+"/" + i8,schemaPath:"#/definitions/position/minItems",keyword:"minItems",params:{limit: 2},message:"must NOT have fewer than 2 items"};
if(vErrors === null){
vErrors = [err295];
}
else {
vErrors.push(err295);
}
errors++;
}
const len13 = data152.length;
if(!(len13 <= 2)){
const err296 = {instancePath:instancePath+"/features/" + i0+"/geometry/coordinates/" + i7+"/" + i8,schemaPath:"#/definitions/position/additionalItems",keyword:"additionalItems",params:{limit: 2},message:"must NOT have more than 2 items"};
if(vErrors === null){
vErrors = [err296];
}
else {
vErrors.push(err296);
}
errors++;
}
const len14 = data152.length;
if(len14 > 0){
let data153 = data152[0];
if((typeof data153 == "number") && (isFinite(data153))){
if(data153 > 180 || isNaN(data153)){
const err297 = {instancePath:instancePath+"/features/" + i0+"/geometry/coordinates/" + i7+"/" + i8+"/0",schemaPath:"#/definitions/position/items/0/maximum",keyword:"maximum",params:{comparison: "<=", limit: 180},message:"must be <= 180"};
if(vErrors === null){
vErrors = [err297];
}
else {
vErrors.push(err297);
}
errors++;
}
if(data153 < -180 || isNaN(data153)){
const err298 = {instancePath:instancePath+"/features/" + i0+"/geometry/coordinates/" + i7+"/" + i8+"/0",schemaPath:"#/definitions/position/items/0/minimum",keyword:"minimum",params:{comparison: ">=", limit: -180},message:"must be >= -180"};
if(vErrors === null){
vErrors = [err298];
}
else {
vErrors.push(err298);
}
errors++;
}
}
else {
const err299 = {instancePath:instancePath+"/features/" + i0+"/geometry/coordinates/" + i7+"/" + i8+"/0",schemaPath:"#/definitions/position/items/0/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err299];
}
else {
vErrors.push(err299);
}
errors++;
}
}
if(len14 > 1){
let data154 = data152[1];
if((typeof data154 == "number") && (isFinite(data154))){
if(data154 > 90 || isNaN(data154)){
const err300 = {instancePath:instancePath+"/features/" + i0+"/geometry/coordinates/" + i7+"/" + i8+"/1",schemaPath:"#/definitions/position/items/1/maximum",keyword:"maximum",params:{comparison: "<=", limit: 90},message:"must be <= 90"};
if(vErrors === null){
vErrors = [err300];
}
else {
vErrors.push(err300);
}
errors++;
}
if(data154 < -90 || isNaN(data154)){
const err301 = {instancePath:instancePath+"/features/" + i0+"/geometry/coordinates/" + i7+"/" + i8+"/1",schemaPath:"#/definitions/position/items/1/minimum",keyword:"minimum",params:{comparison: ">=", limit: -90},message:"must be >= -90"};
if(vErrors === null){
vErrors = [err301];
}
else {
vErrors.push(err301);
}
errors++;
}
}
else {
const err302 = {instancePath:instancePath+"/features/" + i0+"/geometry/coordinates/" + i7+"/" + i8+"/1",schemaPath:"#/definitions/position/items/1/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err302];
}
else {
vErrors.push(err302);
}
errors++;
}
}
}
else {
const err303 = {instancePath:instancePath+"/features/" + i0+"/geometry/coordinates/" + i7+"/" + i8,schemaPath:"#/definitions/position/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err303];
}
else {
vErrors.push(err303);
}
errors++;
}
}
}
else {
const err304 = {instancePath:instancePath+"/features/" + i0+"/geometry/coordinates/" + i7,schemaPath:"#/properties/features/items/properties/geometry/oneOf/3/properties/coordinates/items/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err304];
}
else {
vErrors.push(err304);
}
errors++;
}
}
}
else {
const err305 = {instancePath:instancePath+"/features/" + i0+"/geometry/coordinates",schemaPath:"#/properties/features/items/properties/geometry/oneOf/3/properties/coordinates/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err305];
}
else {
vErrors.push(err305);
}
errors++;
}
}
}
else {
const err306 = {instancePath:instancePath+"/features/" + i0+"/geometry",schemaPath:"#/properties/features/items/properties/geometry/oneOf/3/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err306];
}
else {
vErrors.push(err306);
}
errors++;
}
var _valid3 = _errs312 === errors;
if(_valid3 && valid14){
valid14 = false;
passing0 = [passing0, 3];
}
else {
if(_valid3){
valid14 = true;
passing0 = 3;
}
const _errs327 = errors;
if(data134 && typeof data134 == "object" && !Array.isArray(data134)){
if(data134.type === undefined){
const err307 = {instancePath:instancePath+"/features/" + i0+"/geometry",schemaPath:"#/properties/features/items/properties/geometry/oneOf/4/required",keyword:"required",params:{missingProperty: "type"},message:"must have required property '"+"type"+"'"};
if(vErrors === null){
vErrors = [err307];
}
else {
vErrors.push(err307);
}
errors++;
}
if(data134.coordinates === undefined){
const err308 = {instancePath:instancePath+"/features/" + i0+"/geometry",schemaPath:"#/properties/features/items/properties/geometry/oneOf/4/required",keyword:"required",params:{missingProperty: "coordinates"},message:"must have required property '"+"coordinates"+"'"};
if(vErrors === null){
vErrors = [err308];
}
else {
vErrors.push(err308);
}
errors++;
}
for(const key7 in data134){
if(!((key7 === "type") || (key7 === "coordinates"))){
const err309 = {instancePath:instancePath+"/features/" + i0+"/geometry",schemaPath:"#/properties/features/items/properties/geometry/oneOf/4/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key7},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err309];
}
else {
vErrors.push(err309);
}
errors++;
}
}
if(data134.type !== undefined){
if("Polygon" !== data134.type){
const err310 = {instancePath:instancePath+"/features/" + i0+"/geometry/type",schemaPath:"#/properties/features/items/properties/geometry/oneOf/4/properties/type/const",keyword:"const",params:{allowedValue: "Polygon"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err310];
}
else {
vErrors.push(err310);
}
errors++;
}
}
if(data134.coordinates !== undefined){
let data156 = data134.coordinates;
if(Array.isArray(data156)){
if(data156.length < 1){
const err311 = {instancePath:instancePath+"/features/" + i0+"/geometry/coordinates",schemaPath:"#/properties/features/items/properties/geometry/oneOf/4/properties/coordinates/minItems",keyword:"minItems",params:{limit: 1},message:"must NOT have fewer than 1 items"};
if(vErrors === null){
vErrors = [err311];
}
else {
vErrors.push(err311);
}
errors++;
}
const len15 = data156.length;
for(let i9=0; i9<len15; i9++){
let data157 = data156[i9];
if(Array.isArray(data157)){
if(data157.length < 4){
const err312 = {instancePath:instancePath+"/features/" + i0+"/geometry/coordinates/" + i9,schemaPath:"#/properties/features/items/properties/geometry/oneOf/4/properties/coordinates/items/minItems",keyword:"minItems",params:{limit: 4},message:"must NOT have fewer than 4 items"};
if(vErrors === null){
vErrors = [err312];
}
else {
vErrors.push(err312);
}
errors++;
}
const len16 = data157.length;
for(let i10=0; i10<len16; i10++){
let data158 = data157[i10];
if(Array.isArray(data158)){
if(data158.length > 2){
const err313 = {instancePath:instancePath+"/features/" + i0+"/geometry/coordinates/" + i9+"/" + i10,schemaPath:"#/definitions/position/maxItems",keyword:"maxItems",params:{limit: 2},message:"must NOT have more than 2 items"};
if(vErrors === null){
vErrors = [err313];
}
else {
vErrors.push(err313);
}
errors++;
}
if(data158.length < 2){
const err314 = {instancePath:instancePath+"/features/" + i0+"/geometry/coordinates/" + i9+"/" + i10,schemaPath:"#/definitions/position/minItems",keyword:"minItems",params:{limit: 2},message:"must NOT have fewer than 2 items"};
if(vErrors === null){
vErrors = [err314];
}
else {
vErrors.push(err314);
}
errors++;
}
const len17 = data158.length;
if(!(len17 <= 2)){
const err315 = {instancePath:instancePath+"/features/" + i0+"/geometry/coordinates/" + i9+"/" + i10,schemaPath:"#/definitions/position/additionalItems",keyword:"additionalItems",params:{limit: 2},message:"must NOT have more than 2 items"};
if(vErrors === null){
vErrors = [err315];
}
else {
vErrors.push(err315);
}
errors++;
}
const len18 = data158.length;
if(len18 > 0){
let data159 = data158[0];
if((typeof data159 == "number") && (isFinite(data159))){
if(data159 > 180 || isNaN(data159)){
const err316 = {instancePath:instancePath+"/features/" + i0+"/geometry/coordinates/" + i9+"/" + i10+"/0",schemaPath:"#/definitions/position/items/0/maximum",keyword:"maximum",params:{comparison: "<=", limit: 180},message:"must be <= 180"};
if(vErrors === null){
vErrors = [err316];
}
else {
vErrors.push(err316);
}
errors++;
}
if(data159 < -180 || isNaN(data159)){
const err317 = {instancePath:instancePath+"/features/" + i0+"/geometry/coordinates/" + i9+"/" + i10+"/0",schemaPath:"#/definitions/position/items/0/minimum",keyword:"minimum",params:{comparison: ">=", limit: -180},message:"must be >= -180"};
if(vErrors === null){
vErrors = [err317];
}
else {
vErrors.push(err317);
}
errors++;
}
}
else {
const err318 = {instancePath:instancePath+"/features/" + i0+"/geometry/coordinates/" + i9+"/" + i10+"/0",schemaPath:"#/definitions/position/items/0/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err318];
}
else {
vErrors.push(err318);
}
errors++;
}
}
if(len18 > 1){
let data160 = data158[1];
if((typeof data160 == "number") && (isFinite(data160))){
if(data160 > 90 || isNaN(data160)){
const err319 = {instancePath:instancePath+"/features/" + i0+"/geometry/coordinates/" + i9+"/" + i10+"/1",schemaPath:"#/definitions/position/items/1/maximum",keyword:"maximum",params:{comparison: "<=", limit: 90},message:"must be <= 90"};
if(vErrors === null){
vErrors = [err319];
}
else {
vErrors.push(err319);
}
errors++;
}
if(data160 < -90 || isNaN(data160)){
const err320 = {instancePath:instancePath+"/features/" + i0+"/geometry/coordinates/" + i9+"/" + i10+"/1",schemaPath:"#/definitions/position/items/1/minimum",keyword:"minimum",params:{comparison: ">=", limit: -90},message:"must be >= -90"};
if(vErrors === null){
vErrors = [err320];
}
else {
vErrors.push(err320);
}
errors++;
}
}
else {
const err321 = {instancePath:instancePath+"/features/" + i0+"/geometry/coordinates/" + i9+"/" + i10+"/1",schemaPath:"#/definitions/position/items/1/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err321];
}
else {
vErrors.push(err321);
}
errors++;
}
}
}
else {
const err322 = {instancePath:instancePath+"/features/" + i0+"/geometry/coordinates/" + i9+"/" + i10,schemaPath:"#/definitions/position/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err322];
}
else {
vErrors.push(err322);
}
errors++;
}
}
}
else {
const err323 = {instancePath:instancePath+"/features/" + i0+"/geometry/coordinates/" + i9,schemaPath:"#/properties/features/items/properties/geometry/oneOf/4/properties/coordinates/items/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err323];
}
else {
vErrors.push(err323);
}
errors++;
}
}
}
else {
const err324 = {instancePath:instancePath+"/features/" + i0+"/geometry/coordinates",schemaPath:"#/properties/features/items/properties/geometry/oneOf/4/properties/coordinates/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err324];
}
else {
vErrors.push(err324);
}
errors++;
}
}
}
else {
const err325 = {instancePath:instancePath+"/features/" + i0+"/geometry",schemaPath:"#/properties/features/items/properties/geometry/oneOf/4/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err325];
}
else {
vErrors.push(err325);
}
errors++;
}
var _valid3 = _errs327 === errors;
if(_valid3 && valid14){
valid14 = false;
passing0 = [passing0, 4];
}
else {
if(_valid3){
valid14 = true;
passing0 = 4;
}
const _errs342 = errors;
if(data134 && typeof data134 == "object" && !Array.isArray(data134)){
if(data134.type === undefined){
const err326 = {instancePath:instancePath+"/features/" + i0+"/geometry",schemaPath:"#/properties/features/items/properties/geometry/oneOf/5/required",keyword:"required",params:{missingProperty: "type"},message:"must have required property '"+"type"+"'"};
if(vErrors === null){
vErrors = [err326];
}
else {
vErrors.push(err326);
}
errors++;
}
if(data134.coordinates === undefined){
const err327 = {instancePath:instancePath+"/features/" + i0+"/geometry",schemaPath:"#/properties/features/items/properties/geometry/oneOf/5/required",keyword:"required",params:{missingProperty: "coordinates"},message:"must have required property '"+"coordinates"+"'"};
if(vErrors === null){
vErrors = [err327];
}
else {
vErrors.push(err327);
}
errors++;
}
for(const key8 in data134){
if(!((key8 === "type") || (key8 === "coordinates"))){
const err328 = {instancePath:instancePath+"/features/" + i0+"/geometry",schemaPath:"#/properties/features/items/properties/geometry/oneOf/5/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key8},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err328];
}
else {
vErrors.push(err328);
}
errors++;
}
}
if(data134.type !== undefined){
if("MultiPolygon" !== data134.type){
const err329 = {instancePath:instancePath+"/features/" + i0+"/geometry/type",schemaPath:"#/properties/features/items/properties/geometry/oneOf/5/properties/type/const",keyword:"const",params:{allowedValue: "MultiPolygon"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err329];
}
else {
vErrors.push(err329);
}
errors++;
}
}
if(data134.coordinates !== undefined){
let data162 = data134.coordinates;
if(Array.isArray(data162)){
if(data162.length < 1){
const err330 = {instancePath:instancePath+"/features/" + i0+"/geometry/coordinates",schemaPath:"#/properties/features/items/properties/geometry/oneOf/5/properties/coordinates/minItems",keyword:"minItems",params:{limit: 1},message:"must NOT have fewer than 1 items"};
if(vErrors === null){
vErrors = [err330];
}
else {
vErrors.push(err330);
}
errors++;
}
const len19 = data162.length;
for(let i11=0; i11<len19; i11++){
let data163 = data162[i11];
if(Array.isArray(data163)){
if(data163.length < 1){
const err331 = {instancePath:instancePath+"/features/" + i0+"/geometry/coordinates/" + i11,schemaPath:"#/properties/features/items/properties/geometry/oneOf/5/properties/coordinates/items/minItems",keyword:"minItems",params:{limit: 1},message:"must NOT have fewer than 1 items"};
if(vErrors === null){
vErrors = [err331];
}
else {
vErrors.push(err331);
}
errors++;
}
const len20 = data163.length;
for(let i12=0; i12<len20; i12++){
let data164 = data163[i12];
if(Array.isArray(data164)){
if(data164.length < 4){
const err332 = {instancePath:instancePath+"/features/" + i0+"/geometry/coordinates/" + i11+"/" + i12,schemaPath:"#/properties/features/items/properties/geometry/oneOf/5/properties/coordinates/items/items/minItems",keyword:"minItems",params:{limit: 4},message:"must NOT have fewer than 4 items"};
if(vErrors === null){
vErrors = [err332];
}
else {
vErrors.push(err332);
}
errors++;
}
const len21 = data164.length;
for(let i13=0; i13<len21; i13++){
let data165 = data164[i13];
if(Array.isArray(data165)){
if(data165.length > 2){
const err333 = {instancePath:instancePath+"/features/" + i0+"/geometry/coordinates/" + i11+"/" + i12+"/" + i13,schemaPath:"#/definitions/position/maxItems",keyword:"maxItems",params:{limit: 2},message:"must NOT have more than 2 items"};
if(vErrors === null){
vErrors = [err333];
}
else {
vErrors.push(err333);
}
errors++;
}
if(data165.length < 2){
const err334 = {instancePath:instancePath+"/features/" + i0+"/geometry/coordinates/" + i11+"/" + i12+"/" + i13,schemaPath:"#/definitions/position/minItems",keyword:"minItems",params:{limit: 2},message:"must NOT have fewer than 2 items"};
if(vErrors === null){
vErrors = [err334];
}
else {
vErrors.push(err334);
}
errors++;
}
const len22 = data165.length;
if(!(len22 <= 2)){
const err335 = {instancePath:instancePath+"/features/" + i0+"/geometry/coordinates/" + i11+"/" + i12+"/" + i13,schemaPath:"#/definitions/position/additionalItems",keyword:"additionalItems",params:{limit: 2},message:"must NOT have more than 2 items"};
if(vErrors === null){
vErrors = [err335];
}
else {
vErrors.push(err335);
}
errors++;
}
const len23 = data165.length;
if(len23 > 0){
let data166 = data165[0];
if((typeof data166 == "number") && (isFinite(data166))){
if(data166 > 180 || isNaN(data166)){
const err336 = {instancePath:instancePath+"/features/" + i0+"/geometry/coordinates/" + i11+"/" + i12+"/" + i13+"/0",schemaPath:"#/definitions/position/items/0/maximum",keyword:"maximum",params:{comparison: "<=", limit: 180},message:"must be <= 180"};
if(vErrors === null){
vErrors = [err336];
}
else {
vErrors.push(err336);
}
errors++;
}
if(data166 < -180 || isNaN(data166)){
const err337 = {instancePath:instancePath+"/features/" + i0+"/geometry/coordinates/" + i11+"/" + i12+"/" + i13+"/0",schemaPath:"#/definitions/position/items/0/minimum",keyword:"minimum",params:{comparison: ">=", limit: -180},message:"must be >= -180"};
if(vErrors === null){
vErrors = [err337];
}
else {
vErrors.push(err337);
}
errors++;
}
}
else {
const err338 = {instancePath:instancePath+"/features/" + i0+"/geometry/coordinates/" + i11+"/" + i12+"/" + i13+"/0",schemaPath:"#/definitions/position/items/0/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err338];
}
else {
vErrors.push(err338);
}
errors++;
}
}
if(len23 > 1){
let data167 = data165[1];
if((typeof data167 == "number") && (isFinite(data167))){
if(data167 > 90 || isNaN(data167)){
const err339 = {instancePath:instancePath+"/features/" + i0+"/geometry/coordinates/" + i11+"/" + i12+"/" + i13+"/1",schemaPath:"#/definitions/position/items/1/maximum",keyword:"maximum",params:{comparison: "<=", limit: 90},message:"must be <= 90"};
if(vErrors === null){
vErrors = [err339];
}
else {
vErrors.push(err339);
}
errors++;
}
if(data167 < -90 || isNaN(data167)){
const err340 = {instancePath:instancePath+"/features/" + i0+"/geometry/coordinates/" + i11+"/" + i12+"/" + i13+"/1",schemaPath:"#/definitions/position/items/1/minimum",keyword:"minimum",params:{comparison: ">=", limit: -90},message:"must be >= -90"};
if(vErrors === null){
vErrors = [err340];
}
else {
vErrors.push(err340);
}
errors++;
}
}
else {
const err341 = {instancePath:instancePath+"/features/" + i0+"/geometry/coordinates/" + i11+"/" + i12+"/" + i13+"/1",schemaPath:"#/definitions/position/items/1/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err341];
}
else {
vErrors.push(err341);
}
errors++;
}
}
}
else {
const err342 = {instancePath:instancePath+"/features/" + i0+"/geometry/coordinates/" + i11+"/" + i12+"/" + i13,schemaPath:"#/definitions/position/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err342];
}
else {
vErrors.push(err342);
}
errors++;
}
}
}
else {
const err343 = {instancePath:instancePath+"/features/" + i0+"/geometry/coordinates/" + i11+"/" + i12,schemaPath:"#/properties/features/items/properties/geometry/oneOf/5/properties/coordinates/items/items/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err343];
}
else {
vErrors.push(err343);
}
errors++;
}
}
}
else {
const err344 = {instancePath:instancePath+"/features/" + i0+"/geometry/coordinates/" + i11,schemaPath:"#/properties/features/items/properties/geometry/oneOf/5/properties/coordinates/items/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err344];
}
else {
vErrors.push(err344);
}
errors++;
}
}
}
else {
const err345 = {instancePath:instancePath+"/features/" + i0+"/geometry/coordinates",schemaPath:"#/properties/features/items/properties/geometry/oneOf/5/properties/coordinates/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err345];
}
else {
vErrors.push(err345);
}
errors++;
}
}
}
else {
const err346 = {instancePath:instancePath+"/features/" + i0+"/geometry",schemaPath:"#/properties/features/items/properties/geometry/oneOf/5/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err346];
}
else {
vErrors.push(err346);
}
errors++;
}
var _valid3 = _errs342 === errors;
if(_valid3 && valid14){
valid14 = false;
passing0 = [passing0, 5];
}
else {
if(_valid3){
valid14 = true;
passing0 = 5;
}
}
}
}
}
}
if(!valid14){
const err347 = {instancePath:instancePath+"/features/" + i0+"/geometry",schemaPath:"#/properties/features/items/properties/geometry/oneOf",keyword:"oneOf",params:{passingSchemas: passing0},message:"must match exactly one schema in oneOf"};
if(vErrors === null){
vErrors = [err347];
}
else {
vErrors.push(err347);
}
errors++;
}
else {
errors = _errs274;
if(vErrors !== null){
if(_errs274){
vErrors.length = _errs274;
}
else {
vErrors = null;
}
}
}
}
}
else {
const err348 = {instancePath:instancePath+"/features/" + i0,schemaPath:"#/properties/features/items/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err348];
}
else {
vErrors.push(err348);
}
errors++;
}
}
}
else {
const err349 = {instancePath:instancePath+"/features",schemaPath:"#/properties/features/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err349];
}
else {
vErrors.push(err349);
}
errors++;
}
}
}
else {
const err350 = {instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err350];
}
else {
vErrors.push(err350);
}
errors++;
}
validate11.errors = vErrors;
return errors === 0;
}


function validate10(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
/*# sourceURL="https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json" */;
let vErrors = null;
let errors = 0;
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.metadata === undefined){
const err0 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "metadata"},message:"must have required property '"+"metadata"+"'"};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
if(data.collection === undefined){
const err1 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "collection"},message:"must have required property '"+"collection"+"'"};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
for(const key0 in data){
if(!((key0 === "metadata") || (key0 === "collection"))){
const err2 = {instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
}
if(data.metadata !== undefined){
let data0 = data.metadata;
const _errs6 = errors;
let valid3 = true;
const _errs7 = errors;
if(data0 && typeof data0 == "object" && !Array.isArray(data0)){
if(data0.status !== undefined){
if("VERIFIED_SOURCE" !== data0.status){
const err3 = {};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
}
}
var _valid0 = _errs7 === errors;
errors = _errs6;
if(vErrors !== null){
if(_errs6){
vErrors.length = _errs6;
}
else {
vErrors = null;
}
}
if(_valid0){
const _errs9 = errors;
if(data0 && typeof data0 == "object" && !Array.isArray(data0)){
if(data0.evidence_type !== undefined){
if("observed" !== data0.evidence_type){
const err4 = {instancePath:instancePath+"/metadata/evidence_type",schemaPath:"#/definitions/metadata/allOf/0/then/properties/evidence_type/const",keyword:"const",params:{allowedValue: "observed"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
}
}
var _valid0 = _errs9 === errors;
valid3 = _valid0;
}
if(!valid3){
const err5 = {instancePath:instancePath+"/metadata",schemaPath:"#/definitions/metadata/allOf/0/if",keyword:"if",params:{failingKeyword: "then"},message:"must match \"then\" schema"};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
const _errs12 = errors;
let valid6 = true;
const _errs13 = errors;
if(data0 && typeof data0 == "object" && !Array.isArray(data0)){
if(data0.status !== undefined){
if("SATELLITE_DERIVED" !== data0.status){
const err6 = {};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
}
}
var _valid1 = _errs13 === errors;
errors = _errs12;
if(vErrors !== null){
if(_errs12){
vErrors.length = _errs12;
}
else {
vErrors = null;
}
}
if(_valid1){
const _errs15 = errors;
if(data0 && typeof data0 == "object" && !Array.isArray(data0)){
if(data0.evidence_type !== undefined){
if("derived" !== data0.evidence_type){
const err7 = {instancePath:instancePath+"/metadata/evidence_type",schemaPath:"#/definitions/metadata/allOf/1/then/properties/evidence_type/const",keyword:"const",params:{allowedValue: "derived"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
}
}
}
var _valid1 = _errs15 === errors;
valid6 = _valid1;
}
if(!valid6){
const err8 = {instancePath:instancePath+"/metadata",schemaPath:"#/definitions/metadata/allOf/1/if",keyword:"if",params:{failingKeyword: "then"},message:"must match \"then\" schema"};
if(vErrors === null){
vErrors = [err8];
}
else {
vErrors.push(err8);
}
errors++;
}
const _errs18 = errors;
let valid9 = true;
const _errs19 = errors;
if(data0 && typeof data0 == "object" && !Array.isArray(data0)){
if(data0.status !== undefined){
if("ATLAS_DERIVED" !== data0.status){
const err9 = {};
if(vErrors === null){
vErrors = [err9];
}
else {
vErrors.push(err9);
}
errors++;
}
}
}
var _valid2 = _errs19 === errors;
errors = _errs18;
if(vErrors !== null){
if(_errs18){
vErrors.length = _errs18;
}
else {
vErrors = null;
}
}
if(_valid2){
const _errs21 = errors;
if(data0 && typeof data0 == "object" && !Array.isArray(data0)){
if(data0.evidence_type !== undefined){
if("derived" !== data0.evidence_type){
const err10 = {instancePath:instancePath+"/metadata/evidence_type",schemaPath:"#/definitions/metadata/allOf/2/then/properties/evidence_type/const",keyword:"const",params:{allowedValue: "derived"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err10];
}
else {
vErrors.push(err10);
}
errors++;
}
}
}
var _valid2 = _errs21 === errors;
valid9 = _valid2;
}
if(!valid9){
const err11 = {instancePath:instancePath+"/metadata",schemaPath:"#/definitions/metadata/allOf/2/if",keyword:"if",params:{failingKeyword: "then"},message:"must match \"then\" schema"};
if(vErrors === null){
vErrors = [err11];
}
else {
vErrors.push(err11);
}
errors++;
}
const _errs24 = errors;
let valid12 = true;
const _errs25 = errors;
if(data0 && typeof data0 == "object" && !Array.isArray(data0)){
if(data0.status !== undefined){
if("ESTIMATED" !== data0.status){
const err12 = {};
if(vErrors === null){
vErrors = [err12];
}
else {
vErrors.push(err12);
}
errors++;
}
}
}
var _valid3 = _errs25 === errors;
errors = _errs24;
if(vErrors !== null){
if(_errs24){
vErrors.length = _errs24;
}
else {
vErrors = null;
}
}
if(_valid3){
const _errs27 = errors;
if(data0 && typeof data0 == "object" && !Array.isArray(data0)){
if(data0.evidence_type !== undefined){
if("estimated" !== data0.evidence_type){
const err13 = {instancePath:instancePath+"/metadata/evidence_type",schemaPath:"#/definitions/metadata/allOf/3/then/properties/evidence_type/const",keyword:"const",params:{allowedValue: "estimated"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err13];
}
else {
vErrors.push(err13);
}
errors++;
}
}
}
var _valid3 = _errs27 === errors;
valid12 = _valid3;
}
if(!valid12){
const err14 = {instancePath:instancePath+"/metadata",schemaPath:"#/definitions/metadata/allOf/3/if",keyword:"if",params:{failingKeyword: "then"},message:"must match \"then\" schema"};
if(vErrors === null){
vErrors = [err14];
}
else {
vErrors.push(err14);
}
errors++;
}
const _errs30 = errors;
let valid15 = true;
const _errs31 = errors;
if(data0 && typeof data0 == "object" && !Array.isArray(data0)){
if(data0.status !== undefined){
if("MODELLED" !== data0.status){
const err15 = {};
if(vErrors === null){
vErrors = [err15];
}
else {
vErrors.push(err15);
}
errors++;
}
}
}
var _valid4 = _errs31 === errors;
errors = _errs30;
if(vErrors !== null){
if(_errs30){
vErrors.length = _errs30;
}
else {
vErrors = null;
}
}
if(_valid4){
const _errs33 = errors;
if(data0 && typeof data0 == "object" && !Array.isArray(data0)){
if(data0.evidence_type !== undefined){
if("modelled" !== data0.evidence_type){
const err16 = {instancePath:instancePath+"/metadata/evidence_type",schemaPath:"#/definitions/metadata/allOf/4/then/properties/evidence_type/const",keyword:"const",params:{allowedValue: "modelled"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err16];
}
else {
vErrors.push(err16);
}
errors++;
}
}
}
var _valid4 = _errs33 === errors;
valid15 = _valid4;
}
if(!valid15){
const err17 = {instancePath:instancePath+"/metadata",schemaPath:"#/definitions/metadata/allOf/4/if",keyword:"if",params:{failingKeyword: "then"},message:"must match \"then\" schema"};
if(vErrors === null){
vErrors = [err17];
}
else {
vErrors.push(err17);
}
errors++;
}
const _errs36 = errors;
let valid18 = true;
const _errs37 = errors;
if(data0 && typeof data0 == "object" && !Array.isArray(data0)){
if(data0.status !== undefined){
if("HISTORICAL" !== data0.status){
const err18 = {};
if(vErrors === null){
vErrors = [err18];
}
else {
vErrors.push(err18);
}
errors++;
}
}
}
var _valid5 = _errs37 === errors;
errors = _errs36;
if(vErrors !== null){
if(_errs36){
vErrors.length = _errs36;
}
else {
vErrors = null;
}
}
if(_valid5){
const _errs39 = errors;
if(data0 && typeof data0 == "object" && !Array.isArray(data0)){
if(data0.evidence_type !== undefined){
if("historical" !== data0.evidence_type){
const err19 = {instancePath:instancePath+"/metadata/evidence_type",schemaPath:"#/definitions/metadata/allOf/5/then/properties/evidence_type/const",keyword:"const",params:{allowedValue: "historical"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err19];
}
else {
vErrors.push(err19);
}
errors++;
}
}
}
var _valid5 = _errs39 === errors;
valid18 = _valid5;
}
if(!valid18){
const err20 = {instancePath:instancePath+"/metadata",schemaPath:"#/definitions/metadata/allOf/5/if",keyword:"if",params:{failingKeyword: "then"},message:"must match \"then\" schema"};
if(vErrors === null){
vErrors = [err20];
}
else {
vErrors.push(err20);
}
errors++;
}
const _errs42 = errors;
let valid21 = true;
const _errs43 = errors;
if(data0 && typeof data0 == "object" && !Array.isArray(data0)){
if(data0.status !== undefined){
if("UNKNOWN" !== data0.status){
const err21 = {};
if(vErrors === null){
vErrors = [err21];
}
else {
vErrors.push(err21);
}
errors++;
}
}
}
var _valid6 = _errs43 === errors;
errors = _errs42;
if(vErrors !== null){
if(_errs42){
vErrors.length = _errs42;
}
else {
vErrors = null;
}
}
if(_valid6){
const _errs45 = errors;
if(data0 && typeof data0 == "object" && !Array.isArray(data0)){
if(data0.evidence_type !== undefined){
if("unknown" !== data0.evidence_type){
const err22 = {instancePath:instancePath+"/metadata/evidence_type",schemaPath:"#/definitions/metadata/allOf/6/then/properties/evidence_type/const",keyword:"const",params:{allowedValue: "unknown"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err22];
}
else {
vErrors.push(err22);
}
errors++;
}
}
}
var _valid6 = _errs45 === errors;
valid21 = _valid6;
}
if(!valid21){
const err23 = {instancePath:instancePath+"/metadata",schemaPath:"#/definitions/metadata/allOf/6/if",keyword:"if",params:{failingKeyword: "then"},message:"must match \"then\" schema"};
if(vErrors === null){
vErrors = [err23];
}
else {
vErrors.push(err23);
}
errors++;
}
const _errs48 = errors;
let valid24 = true;
const _errs49 = errors;
if(data0 && typeof data0 == "object" && !Array.isArray(data0)){
if(data0.is_fixture !== undefined){
if(false !== data0.is_fixture){
const err24 = {};
if(vErrors === null){
vErrors = [err24];
}
else {
vErrors.push(err24);
}
errors++;
}
}
}
var _valid7 = _errs49 === errors;
errors = _errs48;
if(vErrors !== null){
if(_errs48){
vErrors.length = _errs48;
}
else {
vErrors = null;
}
}
if(_valid7){
const _errs51 = errors;
const _errs52 = errors;
let valid26 = false;
const _errs53 = errors;
if(data0 && typeof data0 == "object" && !Array.isArray(data0)){
if(data0.observation_date !== undefined){
let data16 = data0.observation_date;
if(typeof data16 === "string"){
if(!(formats0.validate(data16))){
const err25 = {instancePath:instancePath+"/metadata/observation_date",schemaPath:"#/definitions/metadata/allOf/7/then/anyOf/0/properties/observation_date/format",keyword:"format",params:{format: "date-time"},message:"must match format \""+"date-time"+"\""};
if(vErrors === null){
vErrors = [err25];
}
else {
vErrors.push(err25);
}
errors++;
}
}
else {
const err26 = {instancePath:instancePath+"/metadata/observation_date",schemaPath:"#/definitions/metadata/allOf/7/then/anyOf/0/properties/observation_date/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err26];
}
else {
vErrors.push(err26);
}
errors++;
}
}
}
var _valid8 = _errs53 === errors;
valid26 = valid26 || _valid8;
if(!valid26){
const _errs56 = errors;
if(data0 && typeof data0 == "object" && !Array.isArray(data0)){
if(data0.publication_date !== undefined){
let data17 = data0.publication_date;
if(typeof data17 === "string"){
if(!(formats0.validate(data17))){
const err27 = {instancePath:instancePath+"/metadata/publication_date",schemaPath:"#/definitions/metadata/allOf/7/then/anyOf/1/properties/publication_date/format",keyword:"format",params:{format: "date-time"},message:"must match format \""+"date-time"+"\""};
if(vErrors === null){
vErrors = [err27];
}
else {
vErrors.push(err27);
}
errors++;
}
}
else {
const err28 = {instancePath:instancePath+"/metadata/publication_date",schemaPath:"#/definitions/metadata/allOf/7/then/anyOf/1/properties/publication_date/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err28];
}
else {
vErrors.push(err28);
}
errors++;
}
}
}
var _valid8 = _errs56 === errors;
valid26 = valid26 || _valid8;
}
if(!valid26){
const err29 = {instancePath:instancePath+"/metadata",schemaPath:"#/definitions/metadata/allOf/7/then/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err29];
}
else {
vErrors.push(err29);
}
errors++;
}
else {
errors = _errs52;
if(vErrors !== null){
if(_errs52){
vErrors.length = _errs52;
}
else {
vErrors = null;
}
}
}
if(data0 && typeof data0 == "object" && !Array.isArray(data0)){
if(data0.source_url !== undefined){
let data18 = data0.source_url;
if(typeof data18 === "string"){
if(!pattern0.test(data18)){
const err30 = {instancePath:instancePath+"/metadata/source_url",schemaPath:"#/definitions/metadata/allOf/7/then/properties/source_url/pattern",keyword:"pattern",params:{pattern: "^https://"},message:"must match pattern \""+"^https://"+"\""};
if(vErrors === null){
vErrors = [err30];
}
else {
vErrors.push(err30);
}
errors++;
}
if(!(formats4(data18))){
const err31 = {instancePath:instancePath+"/metadata/source_url",schemaPath:"#/definitions/metadata/allOf/7/then/properties/source_url/format",keyword:"format",params:{format: "uri"},message:"must match format \""+"uri"+"\""};
if(vErrors === null){
vErrors = [err31];
}
else {
vErrors.push(err31);
}
errors++;
}
}
else {
const err32 = {instancePath:instancePath+"/metadata/source_url",schemaPath:"#/definitions/metadata/allOf/7/then/properties/source_url/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err32];
}
else {
vErrors.push(err32);
}
errors++;
}
}
if(data0.license_url !== undefined){
let data19 = data0.license_url;
if(typeof data19 === "string"){
if(!pattern0.test(data19)){
const err33 = {instancePath:instancePath+"/metadata/license_url",schemaPath:"#/definitions/metadata/allOf/7/then/properties/license_url/pattern",keyword:"pattern",params:{pattern: "^https://"},message:"must match pattern \""+"^https://"+"\""};
if(vErrors === null){
vErrors = [err33];
}
else {
vErrors.push(err33);
}
errors++;
}
if(!(formats4(data19))){
const err34 = {instancePath:instancePath+"/metadata/license_url",schemaPath:"#/definitions/metadata/allOf/7/then/properties/license_url/format",keyword:"format",params:{format: "uri"},message:"must match format \""+"uri"+"\""};
if(vErrors === null){
vErrors = [err34];
}
else {
vErrors.push(err34);
}
errors++;
}
}
else {
const err35 = {instancePath:instancePath+"/metadata/license_url",schemaPath:"#/definitions/metadata/allOf/7/then/properties/license_url/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err35];
}
else {
vErrors.push(err35);
}
errors++;
}
}
}
var _valid7 = _errs51 === errors;
valid24 = _valid7;
}
if(!valid24){
const err36 = {instancePath:instancePath+"/metadata",schemaPath:"#/definitions/metadata/allOf/7/if",keyword:"if",params:{failingKeyword: "then"},message:"must match \"then\" schema"};
if(vErrors === null){
vErrors = [err36];
}
else {
vErrors.push(err36);
}
errors++;
}
if(data0 && typeof data0 == "object" && !Array.isArray(data0)){
if(data0.schema_version === undefined){
const err37 = {instancePath:instancePath+"/metadata",schemaPath:"#/definitions/metadata/required",keyword:"required",params:{missingProperty: "schema_version"},message:"must have required property '"+"schema_version"+"'"};
if(vErrors === null){
vErrors = [err37];
}
else {
vErrors.push(err37);
}
errors++;
}
if(data0.dataset_id === undefined){
const err38 = {instancePath:instancePath+"/metadata",schemaPath:"#/definitions/metadata/required",keyword:"required",params:{missingProperty: "dataset_id"},message:"must have required property '"+"dataset_id"+"'"};
if(vErrors === null){
vErrors = [err38];
}
else {
vErrors.push(err38);
}
errors++;
}
if(data0.dataset_name === undefined){
const err39 = {instancePath:instancePath+"/metadata",schemaPath:"#/definitions/metadata/required",keyword:"required",params:{missingProperty: "dataset_name"},message:"must have required property '"+"dataset_name"+"'"};
if(vErrors === null){
vErrors = [err39];
}
else {
vErrors.push(err39);
}
errors++;
}
if(data0.dataset_version === undefined){
const err40 = {instancePath:instancePath+"/metadata",schemaPath:"#/definitions/metadata/required",keyword:"required",params:{missingProperty: "dataset_version"},message:"must have required property '"+"dataset_version"+"'"};
if(vErrors === null){
vErrors = [err40];
}
else {
vErrors.push(err40);
}
errors++;
}
if(data0.source === undefined){
const err41 = {instancePath:instancePath+"/metadata",schemaPath:"#/definitions/metadata/required",keyword:"required",params:{missingProperty: "source"},message:"must have required property '"+"source"+"'"};
if(vErrors === null){
vErrors = [err41];
}
else {
vErrors.push(err41);
}
errors++;
}
if(data0.source_url === undefined){
const err42 = {instancePath:instancePath+"/metadata",schemaPath:"#/definitions/metadata/required",keyword:"required",params:{missingProperty: "source_url"},message:"must have required property '"+"source_url"+"'"};
if(vErrors === null){
vErrors = [err42];
}
else {
vErrors.push(err42);
}
errors++;
}
if(data0.license === undefined){
const err43 = {instancePath:instancePath+"/metadata",schemaPath:"#/definitions/metadata/required",keyword:"required",params:{missingProperty: "license"},message:"must have required property '"+"license"+"'"};
if(vErrors === null){
vErrors = [err43];
}
else {
vErrors.push(err43);
}
errors++;
}
if(data0.license_url === undefined){
const err44 = {instancePath:instancePath+"/metadata",schemaPath:"#/definitions/metadata/required",keyword:"required",params:{missingProperty: "license_url"},message:"must have required property '"+"license_url"+"'"};
if(vErrors === null){
vErrors = [err44];
}
else {
vErrors.push(err44);
}
errors++;
}
if(data0.attribution === undefined){
const err45 = {instancePath:instancePath+"/metadata",schemaPath:"#/definitions/metadata/required",keyword:"required",params:{missingProperty: "attribution"},message:"must have required property '"+"attribution"+"'"};
if(vErrors === null){
vErrors = [err45];
}
else {
vErrors.push(err45);
}
errors++;
}
if(data0.observation_date === undefined){
const err46 = {instancePath:instancePath+"/metadata",schemaPath:"#/definitions/metadata/required",keyword:"required",params:{missingProperty: "observation_date"},message:"must have required property '"+"observation_date"+"'"};
if(vErrors === null){
vErrors = [err46];
}
else {
vErrors.push(err46);
}
errors++;
}
if(data0.publication_date === undefined){
const err47 = {instancePath:instancePath+"/metadata",schemaPath:"#/definitions/metadata/required",keyword:"required",params:{missingProperty: "publication_date"},message:"must have required property '"+"publication_date"+"'"};
if(vErrors === null){
vErrors = [err47];
}
else {
vErrors.push(err47);
}
errors++;
}
if(data0.retrieval_date === undefined){
const err48 = {instancePath:instancePath+"/metadata",schemaPath:"#/definitions/metadata/required",keyword:"required",params:{missingProperty: "retrieval_date"},message:"must have required property '"+"retrieval_date"+"'"};
if(vErrors === null){
vErrors = [err48];
}
else {
vErrors.push(err48);
}
errors++;
}
if(data0.processing_date === undefined){
const err49 = {instancePath:instancePath+"/metadata",schemaPath:"#/definitions/metadata/required",keyword:"required",params:{missingProperty: "processing_date"},message:"must have required property '"+"processing_date"+"'"};
if(vErrors === null){
vErrors = [err49];
}
else {
vErrors.push(err49);
}
errors++;
}
if(data0.processing_version === undefined){
const err50 = {instancePath:instancePath+"/metadata",schemaPath:"#/definitions/metadata/required",keyword:"required",params:{missingProperty: "processing_version"},message:"must have required property '"+"processing_version"+"'"};
if(vErrors === null){
vErrors = [err50];
}
else {
vErrors.push(err50);
}
errors++;
}
if(data0.method === undefined){
const err51 = {instancePath:instancePath+"/metadata",schemaPath:"#/definitions/metadata/required",keyword:"required",params:{missingProperty: "method"},message:"must have required property '"+"method"+"'"};
if(vErrors === null){
vErrors = [err51];
}
else {
vErrors.push(err51);
}
errors++;
}
if(data0.spatial_resolution === undefined){
const err52 = {instancePath:instancePath+"/metadata",schemaPath:"#/definitions/metadata/required",keyword:"required",params:{missingProperty: "spatial_resolution"},message:"must have required property '"+"spatial_resolution"+"'"};
if(vErrors === null){
vErrors = [err52];
}
else {
vErrors.push(err52);
}
errors++;
}
if(data0.temporal_resolution === undefined){
const err53 = {instancePath:instancePath+"/metadata",schemaPath:"#/definitions/metadata/required",keyword:"required",params:{missingProperty: "temporal_resolution"},message:"must have required property '"+"temporal_resolution"+"'"};
if(vErrors === null){
vErrors = [err53];
}
else {
vErrors.push(err53);
}
errors++;
}
if(data0.spatial_coverage === undefined){
const err54 = {instancePath:instancePath+"/metadata",schemaPath:"#/definitions/metadata/required",keyword:"required",params:{missingProperty: "spatial_coverage"},message:"must have required property '"+"spatial_coverage"+"'"};
if(vErrors === null){
vErrors = [err54];
}
else {
vErrors.push(err54);
}
errors++;
}
if(data0.temporal_coverage === undefined){
const err55 = {instancePath:instancePath+"/metadata",schemaPath:"#/definitions/metadata/required",keyword:"required",params:{missingProperty: "temporal_coverage"},message:"must have required property '"+"temporal_coverage"+"'"};
if(vErrors === null){
vErrors = [err55];
}
else {
vErrors.push(err55);
}
errors++;
}
if(data0.crs === undefined){
const err56 = {instancePath:instancePath+"/metadata",schemaPath:"#/definitions/metadata/required",keyword:"required",params:{missingProperty: "crs"},message:"must have required property '"+"crs"+"'"};
if(vErrors === null){
vErrors = [err56];
}
else {
vErrors.push(err56);
}
errors++;
}
if(data0.status === undefined){
const err57 = {instancePath:instancePath+"/metadata",schemaPath:"#/definitions/metadata/required",keyword:"required",params:{missingProperty: "status"},message:"must have required property '"+"status"+"'"};
if(vErrors === null){
vErrors = [err57];
}
else {
vErrors.push(err57);
}
errors++;
}
if(data0.evidence_type === undefined){
const err58 = {instancePath:instancePath+"/metadata",schemaPath:"#/definitions/metadata/required",keyword:"required",params:{missingProperty: "evidence_type"},message:"must have required property '"+"evidence_type"+"'"};
if(vErrors === null){
vErrors = [err58];
}
else {
vErrors.push(err58);
}
errors++;
}
if(data0.is_fixture === undefined){
const err59 = {instancePath:instancePath+"/metadata",schemaPath:"#/definitions/metadata/required",keyword:"required",params:{missingProperty: "is_fixture"},message:"must have required property '"+"is_fixture"+"'"};
if(vErrors === null){
vErrors = [err59];
}
else {
vErrors.push(err59);
}
errors++;
}
if(data0.limitations === undefined){
const err60 = {instancePath:instancePath+"/metadata",schemaPath:"#/definitions/metadata/required",keyword:"required",params:{missingProperty: "limitations"},message:"must have required property '"+"limitations"+"'"};
if(vErrors === null){
vErrors = [err60];
}
else {
vErrors.push(err60);
}
errors++;
}
if(data0.uncertainty === undefined){
const err61 = {instancePath:instancePath+"/metadata",schemaPath:"#/definitions/metadata/required",keyword:"required",params:{missingProperty: "uncertainty"},message:"must have required property '"+"uncertainty"+"'"};
if(vErrors === null){
vErrors = [err61];
}
else {
vErrors.push(err61);
}
errors++;
}
if(data0.update_frequency === undefined){
const err62 = {instancePath:instancePath+"/metadata",schemaPath:"#/definitions/metadata/required",keyword:"required",params:{missingProperty: "update_frequency"},message:"must have required property '"+"update_frequency"+"'"};
if(vErrors === null){
vErrors = [err62];
}
else {
vErrors.push(err62);
}
errors++;
}
if(data0.stale_after === undefined){
const err63 = {instancePath:instancePath+"/metadata",schemaPath:"#/definitions/metadata/required",keyword:"required",params:{missingProperty: "stale_after"},message:"must have required property '"+"stale_after"+"'"};
if(vErrors === null){
vErrors = [err63];
}
else {
vErrors.push(err63);
}
errors++;
}
if(data0.artifact === undefined){
const err64 = {instancePath:instancePath+"/metadata",schemaPath:"#/definitions/metadata/required",keyword:"required",params:{missingProperty: "artifact"},message:"must have required property '"+"artifact"+"'"};
if(vErrors === null){
vErrors = [err64];
}
else {
vErrors.push(err64);
}
errors++;
}
for(const key1 in data0){
if(!(func2.call(schema12.properties, key1))){
const err65 = {instancePath:instancePath+"/metadata",schemaPath:"#/definitions/metadata/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key1},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err65];
}
else {
vErrors.push(err65);
}
errors++;
}
}
if(data0.schema_version !== undefined){
if("1.0.0" !== data0.schema_version){
const err66 = {instancePath:instancePath+"/metadata/schema_version",schemaPath:"#/definitions/metadata/properties/schema_version/const",keyword:"const",params:{allowedValue: "1.0.0"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err66];
}
else {
vErrors.push(err66);
}
errors++;
}
}
if(data0.dataset_id !== undefined){
let data21 = data0.dataset_id;
if(typeof data21 === "string"){
if(!pattern2.test(data21)){
const err67 = {instancePath:instancePath+"/metadata/dataset_id",schemaPath:"#/definitions/metadata/properties/dataset_id/pattern",keyword:"pattern",params:{pattern: "^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$"},message:"must match pattern \""+"^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$"+"\""};
if(vErrors === null){
vErrors = [err67];
}
else {
vErrors.push(err67);
}
errors++;
}
}
else {
const err68 = {instancePath:instancePath+"/metadata/dataset_id",schemaPath:"#/definitions/metadata/properties/dataset_id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err68];
}
else {
vErrors.push(err68);
}
errors++;
}
}
if(data0.dataset_name !== undefined){
let data22 = data0.dataset_name;
if(typeof data22 === "string"){
if(func3(data22) < 1){
const err69 = {instancePath:instancePath+"/metadata/dataset_name",schemaPath:"#/definitions/metadata/properties/dataset_name/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err69];
}
else {
vErrors.push(err69);
}
errors++;
}
}
else {
const err70 = {instancePath:instancePath+"/metadata/dataset_name",schemaPath:"#/definitions/metadata/properties/dataset_name/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err70];
}
else {
vErrors.push(err70);
}
errors++;
}
}
if(data0.dataset_version !== undefined){
let data23 = data0.dataset_version;
if(typeof data23 === "string"){
if(!pattern3.test(data23)){
const err71 = {instancePath:instancePath+"/metadata/dataset_version",schemaPath:"#/definitions/metadata/properties/dataset_version/pattern",keyword:"pattern",params:{pattern: "^[0-9]+\\.[0-9]+\\.[0-9]+$"},message:"must match pattern \""+"^[0-9]+\\.[0-9]+\\.[0-9]+$"+"\""};
if(vErrors === null){
vErrors = [err71];
}
else {
vErrors.push(err71);
}
errors++;
}
}
else {
const err72 = {instancePath:instancePath+"/metadata/dataset_version",schemaPath:"#/definitions/metadata/properties/dataset_version/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err72];
}
else {
vErrors.push(err72);
}
errors++;
}
}
if(data0.source !== undefined){
let data24 = data0.source;
if(typeof data24 === "string"){
if(func3(data24) < 1){
const err73 = {instancePath:instancePath+"/metadata/source",schemaPath:"#/definitions/metadata/properties/source/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err73];
}
else {
vErrors.push(err73);
}
errors++;
}
}
else {
const err74 = {instancePath:instancePath+"/metadata/source",schemaPath:"#/definitions/metadata/properties/source/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err74];
}
else {
vErrors.push(err74);
}
errors++;
}
}
if(data0.source_url !== undefined){
let data25 = data0.source_url;
const _errs74 = errors;
let valid31 = false;
const _errs75 = errors;
if(typeof data25 === "string"){
if(!pattern0.test(data25)){
const err75 = {instancePath:instancePath+"/metadata/source_url",schemaPath:"#/definitions/metadata/properties/source_url/anyOf/0/pattern",keyword:"pattern",params:{pattern: "^https://"},message:"must match pattern \""+"^https://"+"\""};
if(vErrors === null){
vErrors = [err75];
}
else {
vErrors.push(err75);
}
errors++;
}
if(!(formats4(data25))){
const err76 = {instancePath:instancePath+"/metadata/source_url",schemaPath:"#/definitions/metadata/properties/source_url/anyOf/0/format",keyword:"format",params:{format: "uri"},message:"must match format \""+"uri"+"\""};
if(vErrors === null){
vErrors = [err76];
}
else {
vErrors.push(err76);
}
errors++;
}
}
else {
const err77 = {instancePath:instancePath+"/metadata/source_url",schemaPath:"#/definitions/metadata/properties/source_url/anyOf/0/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err77];
}
else {
vErrors.push(err77);
}
errors++;
}
var _valid9 = _errs75 === errors;
valid31 = valid31 || _valid9;
if(!valid31){
const _errs77 = errors;
if(data25 !== null){
const err78 = {instancePath:instancePath+"/metadata/source_url",schemaPath:"#/definitions/metadata/properties/source_url/anyOf/1/type",keyword:"type",params:{type: "null"},message:"must be null"};
if(vErrors === null){
vErrors = [err78];
}
else {
vErrors.push(err78);
}
errors++;
}
var _valid9 = _errs77 === errors;
valid31 = valid31 || _valid9;
}
if(!valid31){
const err79 = {instancePath:instancePath+"/metadata/source_url",schemaPath:"#/definitions/metadata/properties/source_url/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err79];
}
else {
vErrors.push(err79);
}
errors++;
}
else {
errors = _errs74;
if(vErrors !== null){
if(_errs74){
vErrors.length = _errs74;
}
else {
vErrors = null;
}
}
}
}
if(data0.license !== undefined){
let data26 = data0.license;
if(typeof data26 === "string"){
if(func3(data26) < 1){
const err80 = {instancePath:instancePath+"/metadata/license",schemaPath:"#/definitions/metadata/properties/license/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err80];
}
else {
vErrors.push(err80);
}
errors++;
}
}
else {
const err81 = {instancePath:instancePath+"/metadata/license",schemaPath:"#/definitions/metadata/properties/license/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err81];
}
else {
vErrors.push(err81);
}
errors++;
}
}
if(data0.license_url !== undefined){
let data27 = data0.license_url;
const _errs82 = errors;
let valid32 = false;
const _errs83 = errors;
if(typeof data27 === "string"){
if(!pattern0.test(data27)){
const err82 = {instancePath:instancePath+"/metadata/license_url",schemaPath:"#/definitions/metadata/properties/license_url/anyOf/0/pattern",keyword:"pattern",params:{pattern: "^https://"},message:"must match pattern \""+"^https://"+"\""};
if(vErrors === null){
vErrors = [err82];
}
else {
vErrors.push(err82);
}
errors++;
}
if(!(formats4(data27))){
const err83 = {instancePath:instancePath+"/metadata/license_url",schemaPath:"#/definitions/metadata/properties/license_url/anyOf/0/format",keyword:"format",params:{format: "uri"},message:"must match format \""+"uri"+"\""};
if(vErrors === null){
vErrors = [err83];
}
else {
vErrors.push(err83);
}
errors++;
}
}
else {
const err84 = {instancePath:instancePath+"/metadata/license_url",schemaPath:"#/definitions/metadata/properties/license_url/anyOf/0/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err84];
}
else {
vErrors.push(err84);
}
errors++;
}
var _valid10 = _errs83 === errors;
valid32 = valid32 || _valid10;
if(!valid32){
const _errs85 = errors;
if(data27 !== null){
const err85 = {instancePath:instancePath+"/metadata/license_url",schemaPath:"#/definitions/metadata/properties/license_url/anyOf/1/type",keyword:"type",params:{type: "null"},message:"must be null"};
if(vErrors === null){
vErrors = [err85];
}
else {
vErrors.push(err85);
}
errors++;
}
var _valid10 = _errs85 === errors;
valid32 = valid32 || _valid10;
}
if(!valid32){
const err86 = {instancePath:instancePath+"/metadata/license_url",schemaPath:"#/definitions/metadata/properties/license_url/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err86];
}
else {
vErrors.push(err86);
}
errors++;
}
else {
errors = _errs82;
if(vErrors !== null){
if(_errs82){
vErrors.length = _errs82;
}
else {
vErrors = null;
}
}
}
}
if(data0.attribution !== undefined){
let data28 = data0.attribution;
if(typeof data28 === "string"){
if(func3(data28) < 1){
const err87 = {instancePath:instancePath+"/metadata/attribution",schemaPath:"#/definitions/metadata/properties/attribution/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err87];
}
else {
vErrors.push(err87);
}
errors++;
}
}
else {
const err88 = {instancePath:instancePath+"/metadata/attribution",schemaPath:"#/definitions/metadata/properties/attribution/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err88];
}
else {
vErrors.push(err88);
}
errors++;
}
}
if(data0.observation_date !== undefined){
let data29 = data0.observation_date;
const _errs90 = errors;
let valid33 = false;
const _errs91 = errors;
if(typeof data29 === "string"){
if(!(formats0.validate(data29))){
const err89 = {instancePath:instancePath+"/metadata/observation_date",schemaPath:"#/definitions/metadata/properties/observation_date/anyOf/0/format",keyword:"format",params:{format: "date-time"},message:"must match format \""+"date-time"+"\""};
if(vErrors === null){
vErrors = [err89];
}
else {
vErrors.push(err89);
}
errors++;
}
}
else {
const err90 = {instancePath:instancePath+"/metadata/observation_date",schemaPath:"#/definitions/metadata/properties/observation_date/anyOf/0/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err90];
}
else {
vErrors.push(err90);
}
errors++;
}
var _valid11 = _errs91 === errors;
valid33 = valid33 || _valid11;
if(!valid33){
const _errs93 = errors;
if(data29 !== null){
const err91 = {instancePath:instancePath+"/metadata/observation_date",schemaPath:"#/definitions/metadata/properties/observation_date/anyOf/1/type",keyword:"type",params:{type: "null"},message:"must be null"};
if(vErrors === null){
vErrors = [err91];
}
else {
vErrors.push(err91);
}
errors++;
}
var _valid11 = _errs93 === errors;
valid33 = valid33 || _valid11;
}
if(!valid33){
const err92 = {instancePath:instancePath+"/metadata/observation_date",schemaPath:"#/definitions/metadata/properties/observation_date/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err92];
}
else {
vErrors.push(err92);
}
errors++;
}
else {
errors = _errs90;
if(vErrors !== null){
if(_errs90){
vErrors.length = _errs90;
}
else {
vErrors = null;
}
}
}
}
if(data0.publication_date !== undefined){
let data30 = data0.publication_date;
const _errs96 = errors;
let valid34 = false;
const _errs97 = errors;
if(typeof data30 === "string"){
if(!(formats0.validate(data30))){
const err93 = {instancePath:instancePath+"/metadata/publication_date",schemaPath:"#/definitions/metadata/properties/publication_date/anyOf/0/format",keyword:"format",params:{format: "date-time"},message:"must match format \""+"date-time"+"\""};
if(vErrors === null){
vErrors = [err93];
}
else {
vErrors.push(err93);
}
errors++;
}
}
else {
const err94 = {instancePath:instancePath+"/metadata/publication_date",schemaPath:"#/definitions/metadata/properties/publication_date/anyOf/0/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err94];
}
else {
vErrors.push(err94);
}
errors++;
}
var _valid12 = _errs97 === errors;
valid34 = valid34 || _valid12;
if(!valid34){
const _errs99 = errors;
if(data30 !== null){
const err95 = {instancePath:instancePath+"/metadata/publication_date",schemaPath:"#/definitions/metadata/properties/publication_date/anyOf/1/type",keyword:"type",params:{type: "null"},message:"must be null"};
if(vErrors === null){
vErrors = [err95];
}
else {
vErrors.push(err95);
}
errors++;
}
var _valid12 = _errs99 === errors;
valid34 = valid34 || _valid12;
}
if(!valid34){
const err96 = {instancePath:instancePath+"/metadata/publication_date",schemaPath:"#/definitions/metadata/properties/publication_date/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err96];
}
else {
vErrors.push(err96);
}
errors++;
}
else {
errors = _errs96;
if(vErrors !== null){
if(_errs96){
vErrors.length = _errs96;
}
else {
vErrors = null;
}
}
}
}
if(data0.retrieval_date !== undefined){
let data31 = data0.retrieval_date;
if(typeof data31 === "string"){
if(!(formats0.validate(data31))){
const err97 = {instancePath:instancePath+"/metadata/retrieval_date",schemaPath:"#/definitions/metadata/properties/retrieval_date/format",keyword:"format",params:{format: "date-time"},message:"must match format \""+"date-time"+"\""};
if(vErrors === null){
vErrors = [err97];
}
else {
vErrors.push(err97);
}
errors++;
}
}
else {
const err98 = {instancePath:instancePath+"/metadata/retrieval_date",schemaPath:"#/definitions/metadata/properties/retrieval_date/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err98];
}
else {
vErrors.push(err98);
}
errors++;
}
}
if(data0.processing_date !== undefined){
let data32 = data0.processing_date;
if(typeof data32 === "string"){
if(!(formats0.validate(data32))){
const err99 = {instancePath:instancePath+"/metadata/processing_date",schemaPath:"#/definitions/metadata/properties/processing_date/format",keyword:"format",params:{format: "date-time"},message:"must match format \""+"date-time"+"\""};
if(vErrors === null){
vErrors = [err99];
}
else {
vErrors.push(err99);
}
errors++;
}
}
else {
const err100 = {instancePath:instancePath+"/metadata/processing_date",schemaPath:"#/definitions/metadata/properties/processing_date/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err100];
}
else {
vErrors.push(err100);
}
errors++;
}
}
if(data0.processing_version !== undefined){
let data33 = data0.processing_version;
if(typeof data33 === "string"){
if(func3(data33) < 1){
const err101 = {instancePath:instancePath+"/metadata/processing_version",schemaPath:"#/definitions/metadata/properties/processing_version/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err101];
}
else {
vErrors.push(err101);
}
errors++;
}
}
else {
const err102 = {instancePath:instancePath+"/metadata/processing_version",schemaPath:"#/definitions/metadata/properties/processing_version/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err102];
}
else {
vErrors.push(err102);
}
errors++;
}
}
if(data0.method !== undefined){
let data34 = data0.method;
if(typeof data34 === "string"){
if(func3(data34) < 1){
const err103 = {instancePath:instancePath+"/metadata/method",schemaPath:"#/definitions/metadata/properties/method/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err103];
}
else {
vErrors.push(err103);
}
errors++;
}
}
else {
const err104 = {instancePath:instancePath+"/metadata/method",schemaPath:"#/definitions/metadata/properties/method/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err104];
}
else {
vErrors.push(err104);
}
errors++;
}
}
if(data0.spatial_resolution !== undefined){
let data35 = data0.spatial_resolution;
if(data35 && typeof data35 == "object" && !Array.isArray(data35)){
if(data35.value === undefined){
const err105 = {instancePath:instancePath+"/metadata/spatial_resolution",schemaPath:"#/definitions/metadata/properties/spatial_resolution/required",keyword:"required",params:{missingProperty: "value"},message:"must have required property '"+"value"+"'"};
if(vErrors === null){
vErrors = [err105];
}
else {
vErrors.push(err105);
}
errors++;
}
if(data35.unit === undefined){
const err106 = {instancePath:instancePath+"/metadata/spatial_resolution",schemaPath:"#/definitions/metadata/properties/spatial_resolution/required",keyword:"required",params:{missingProperty: "unit"},message:"must have required property '"+"unit"+"'"};
if(vErrors === null){
vErrors = [err106];
}
else {
vErrors.push(err106);
}
errors++;
}
for(const key2 in data35){
if(!((key2 === "value") || (key2 === "unit"))){
const err107 = {instancePath:instancePath+"/metadata/spatial_resolution",schemaPath:"#/definitions/metadata/properties/spatial_resolution/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key2},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err107];
}
else {
vErrors.push(err107);
}
errors++;
}
}
if(data35.value !== undefined){
let data36 = data35.value;
const _errs113 = errors;
let valid36 = false;
const _errs114 = errors;
if((typeof data36 == "number") && (isFinite(data36))){
if(data36 <= 0 || isNaN(data36)){
const err108 = {instancePath:instancePath+"/metadata/spatial_resolution/value",schemaPath:"#/definitions/metadata/properties/spatial_resolution/properties/value/anyOf/0/exclusiveMinimum",keyword:"exclusiveMinimum",params:{comparison: ">", limit: 0},message:"must be > 0"};
if(vErrors === null){
vErrors = [err108];
}
else {
vErrors.push(err108);
}
errors++;
}
}
else {
const err109 = {instancePath:instancePath+"/metadata/spatial_resolution/value",schemaPath:"#/definitions/metadata/properties/spatial_resolution/properties/value/anyOf/0/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err109];
}
else {
vErrors.push(err109);
}
errors++;
}
var _valid13 = _errs114 === errors;
valid36 = valid36 || _valid13;
if(!valid36){
const _errs116 = errors;
if(data36 !== null){
const err110 = {instancePath:instancePath+"/metadata/spatial_resolution/value",schemaPath:"#/definitions/metadata/properties/spatial_resolution/properties/value/anyOf/1/type",keyword:"type",params:{type: "null"},message:"must be null"};
if(vErrors === null){
vErrors = [err110];
}
else {
vErrors.push(err110);
}
errors++;
}
var _valid13 = _errs116 === errors;
valid36 = valid36 || _valid13;
}
if(!valid36){
const err111 = {instancePath:instancePath+"/metadata/spatial_resolution/value",schemaPath:"#/definitions/metadata/properties/spatial_resolution/properties/value/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err111];
}
else {
vErrors.push(err111);
}
errors++;
}
else {
errors = _errs113;
if(vErrors !== null){
if(_errs113){
vErrors.length = _errs113;
}
else {
vErrors = null;
}
}
}
}
if(data35.unit !== undefined){
let data37 = data35.unit;
if(!(((data37 === "m") || (data37 === "degree")) || (data37 === null))){
const err112 = {instancePath:instancePath+"/metadata/spatial_resolution/unit",schemaPath:"#/definitions/metadata/properties/spatial_resolution/properties/unit/enum",keyword:"enum",params:{allowedValues: schema12.properties.spatial_resolution.properties.unit.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err112];
}
else {
vErrors.push(err112);
}
errors++;
}
}
}
else {
const err113 = {instancePath:instancePath+"/metadata/spatial_resolution",schemaPath:"#/definitions/metadata/properties/spatial_resolution/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err113];
}
else {
vErrors.push(err113);
}
errors++;
}
}
if(data0.temporal_resolution !== undefined){
let data38 = data0.temporal_resolution;
const _errs120 = errors;
let valid37 = false;
const _errs121 = errors;
if(typeof data38 === "string"){
if(func3(data38) < 1){
const err114 = {instancePath:instancePath+"/metadata/temporal_resolution",schemaPath:"#/definitions/metadata/properties/temporal_resolution/anyOf/0/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err114];
}
else {
vErrors.push(err114);
}
errors++;
}
}
else {
const err115 = {instancePath:instancePath+"/metadata/temporal_resolution",schemaPath:"#/definitions/metadata/properties/temporal_resolution/anyOf/0/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err115];
}
else {
vErrors.push(err115);
}
errors++;
}
var _valid14 = _errs121 === errors;
valid37 = valid37 || _valid14;
if(!valid37){
const _errs123 = errors;
if(data38 !== null){
const err116 = {instancePath:instancePath+"/metadata/temporal_resolution",schemaPath:"#/definitions/metadata/properties/temporal_resolution/anyOf/1/type",keyword:"type",params:{type: "null"},message:"must be null"};
if(vErrors === null){
vErrors = [err116];
}
else {
vErrors.push(err116);
}
errors++;
}
var _valid14 = _errs123 === errors;
valid37 = valid37 || _valid14;
}
if(!valid37){
const err117 = {instancePath:instancePath+"/metadata/temporal_resolution",schemaPath:"#/definitions/metadata/properties/temporal_resolution/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err117];
}
else {
vErrors.push(err117);
}
errors++;
}
else {
errors = _errs120;
if(vErrors !== null){
if(_errs120){
vErrors.length = _errs120;
}
else {
vErrors = null;
}
}
}
}
if(data0.spatial_coverage !== undefined){
let data39 = data0.spatial_coverage;
if(data39 && typeof data39 == "object" && !Array.isArray(data39)){
if(data39.description === undefined){
const err118 = {instancePath:instancePath+"/metadata/spatial_coverage",schemaPath:"#/definitions/metadata/properties/spatial_coverage/required",keyword:"required",params:{missingProperty: "description"},message:"must have required property '"+"description"+"'"};
if(vErrors === null){
vErrors = [err118];
}
else {
vErrors.push(err118);
}
errors++;
}
if(data39.bbox === undefined){
const err119 = {instancePath:instancePath+"/metadata/spatial_coverage",schemaPath:"#/definitions/metadata/properties/spatial_coverage/required",keyword:"required",params:{missingProperty: "bbox"},message:"must have required property '"+"bbox"+"'"};
if(vErrors === null){
vErrors = [err119];
}
else {
vErrors.push(err119);
}
errors++;
}
for(const key3 in data39){
if(!((key3 === "description") || (key3 === "bbox"))){
const err120 = {instancePath:instancePath+"/metadata/spatial_coverage",schemaPath:"#/definitions/metadata/properties/spatial_coverage/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key3},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err120];
}
else {
vErrors.push(err120);
}
errors++;
}
}
if(data39.description !== undefined){
let data40 = data39.description;
if(typeof data40 === "string"){
if(func3(data40) < 1){
const err121 = {instancePath:instancePath+"/metadata/spatial_coverage/description",schemaPath:"#/definitions/metadata/properties/spatial_coverage/properties/description/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err121];
}
else {
vErrors.push(err121);
}
errors++;
}
}
else {
const err122 = {instancePath:instancePath+"/metadata/spatial_coverage/description",schemaPath:"#/definitions/metadata/properties/spatial_coverage/properties/description/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err122];
}
else {
vErrors.push(err122);
}
errors++;
}
}
if(data39.bbox !== undefined){
let data41 = data39.bbox;
if(Array.isArray(data41)){
if(data41.length > 4){
const err123 = {instancePath:instancePath+"/metadata/spatial_coverage/bbox",schemaPath:"#/definitions/metadata/properties/spatial_coverage/properties/bbox/maxItems",keyword:"maxItems",params:{limit: 4},message:"must NOT have more than 4 items"};
if(vErrors === null){
vErrors = [err123];
}
else {
vErrors.push(err123);
}
errors++;
}
if(data41.length < 4){
const err124 = {instancePath:instancePath+"/metadata/spatial_coverage/bbox",schemaPath:"#/definitions/metadata/properties/spatial_coverage/properties/bbox/minItems",keyword:"minItems",params:{limit: 4},message:"must NOT have fewer than 4 items"};
if(vErrors === null){
vErrors = [err124];
}
else {
vErrors.push(err124);
}
errors++;
}
const len0 = data41.length;
for(let i0=0; i0<len0; i0++){
let data42 = data41[i0];
if(!((typeof data42 == "number") && (isFinite(data42)))){
const err125 = {instancePath:instancePath+"/metadata/spatial_coverage/bbox/" + i0,schemaPath:"#/definitions/metadata/properties/spatial_coverage/properties/bbox/items/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err125];
}
else {
vErrors.push(err125);
}
errors++;
}
}
}
else {
const err126 = {instancePath:instancePath+"/metadata/spatial_coverage/bbox",schemaPath:"#/definitions/metadata/properties/spatial_coverage/properties/bbox/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err126];
}
else {
vErrors.push(err126);
}
errors++;
}
}
}
else {
const err127 = {instancePath:instancePath+"/metadata/spatial_coverage",schemaPath:"#/definitions/metadata/properties/spatial_coverage/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err127];
}
else {
vErrors.push(err127);
}
errors++;
}
}
if(data0.temporal_coverage !== undefined){
let data43 = data0.temporal_coverage;
if(data43 && typeof data43 == "object" && !Array.isArray(data43)){
if(data43.start === undefined){
const err128 = {instancePath:instancePath+"/metadata/temporal_coverage",schemaPath:"#/definitions/metadata/properties/temporal_coverage/required",keyword:"required",params:{missingProperty: "start"},message:"must have required property '"+"start"+"'"};
if(vErrors === null){
vErrors = [err128];
}
else {
vErrors.push(err128);
}
errors++;
}
if(data43.end === undefined){
const err129 = {instancePath:instancePath+"/metadata/temporal_coverage",schemaPath:"#/definitions/metadata/properties/temporal_coverage/required",keyword:"required",params:{missingProperty: "end"},message:"must have required property '"+"end"+"'"};
if(vErrors === null){
vErrors = [err129];
}
else {
vErrors.push(err129);
}
errors++;
}
for(const key4 in data43){
if(!((key4 === "start") || (key4 === "end"))){
const err130 = {instancePath:instancePath+"/metadata/temporal_coverage",schemaPath:"#/definitions/metadata/properties/temporal_coverage/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key4},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err130];
}
else {
vErrors.push(err130);
}
errors++;
}
}
if(data43.start !== undefined){
let data44 = data43.start;
const _errs138 = errors;
let valid42 = false;
const _errs139 = errors;
if(typeof data44 === "string"){
if(!(formats0.validate(data44))){
const err131 = {instancePath:instancePath+"/metadata/temporal_coverage/start",schemaPath:"#/definitions/metadata/properties/temporal_coverage/properties/start/anyOf/0/format",keyword:"format",params:{format: "date-time"},message:"must match format \""+"date-time"+"\""};
if(vErrors === null){
vErrors = [err131];
}
else {
vErrors.push(err131);
}
errors++;
}
}
else {
const err132 = {instancePath:instancePath+"/metadata/temporal_coverage/start",schemaPath:"#/definitions/metadata/properties/temporal_coverage/properties/start/anyOf/0/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err132];
}
else {
vErrors.push(err132);
}
errors++;
}
var _valid15 = _errs139 === errors;
valid42 = valid42 || _valid15;
if(!valid42){
const _errs141 = errors;
if(data44 !== null){
const err133 = {instancePath:instancePath+"/metadata/temporal_coverage/start",schemaPath:"#/definitions/metadata/properties/temporal_coverage/properties/start/anyOf/1/type",keyword:"type",params:{type: "null"},message:"must be null"};
if(vErrors === null){
vErrors = [err133];
}
else {
vErrors.push(err133);
}
errors++;
}
var _valid15 = _errs141 === errors;
valid42 = valid42 || _valid15;
}
if(!valid42){
const err134 = {instancePath:instancePath+"/metadata/temporal_coverage/start",schemaPath:"#/definitions/metadata/properties/temporal_coverage/properties/start/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err134];
}
else {
vErrors.push(err134);
}
errors++;
}
else {
errors = _errs138;
if(vErrors !== null){
if(_errs138){
vErrors.length = _errs138;
}
else {
vErrors = null;
}
}
}
}
if(data43.end !== undefined){
let data45 = data43.end;
const _errs144 = errors;
let valid43 = false;
const _errs145 = errors;
if(typeof data45 === "string"){
if(!(formats0.validate(data45))){
const err135 = {instancePath:instancePath+"/metadata/temporal_coverage/end",schemaPath:"#/definitions/metadata/properties/temporal_coverage/properties/end/anyOf/0/format",keyword:"format",params:{format: "date-time"},message:"must match format \""+"date-time"+"\""};
if(vErrors === null){
vErrors = [err135];
}
else {
vErrors.push(err135);
}
errors++;
}
}
else {
const err136 = {instancePath:instancePath+"/metadata/temporal_coverage/end",schemaPath:"#/definitions/metadata/properties/temporal_coverage/properties/end/anyOf/0/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err136];
}
else {
vErrors.push(err136);
}
errors++;
}
var _valid16 = _errs145 === errors;
valid43 = valid43 || _valid16;
if(!valid43){
const _errs147 = errors;
if(data45 !== null){
const err137 = {instancePath:instancePath+"/metadata/temporal_coverage/end",schemaPath:"#/definitions/metadata/properties/temporal_coverage/properties/end/anyOf/1/type",keyword:"type",params:{type: "null"},message:"must be null"};
if(vErrors === null){
vErrors = [err137];
}
else {
vErrors.push(err137);
}
errors++;
}
var _valid16 = _errs147 === errors;
valid43 = valid43 || _valid16;
}
if(!valid43){
const err138 = {instancePath:instancePath+"/metadata/temporal_coverage/end",schemaPath:"#/definitions/metadata/properties/temporal_coverage/properties/end/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err138];
}
else {
vErrors.push(err138);
}
errors++;
}
else {
errors = _errs144;
if(vErrors !== null){
if(_errs144){
vErrors.length = _errs144;
}
else {
vErrors = null;
}
}
}
}
}
else {
const err139 = {instancePath:instancePath+"/metadata/temporal_coverage",schemaPath:"#/definitions/metadata/properties/temporal_coverage/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err139];
}
else {
vErrors.push(err139);
}
errors++;
}
}
if(data0.crs !== undefined){
if("OGC:CRS84" !== data0.crs){
const err140 = {instancePath:instancePath+"/metadata/crs",schemaPath:"#/definitions/metadata/properties/crs/const",keyword:"const",params:{allowedValue: "OGC:CRS84"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err140];
}
else {
vErrors.push(err140);
}
errors++;
}
}
if(data0.status !== undefined){
let data47 = data0.status;
if(!(((((((data47 === "VERIFIED_SOURCE") || (data47 === "SATELLITE_DERIVED")) || (data47 === "ATLAS_DERIVED")) || (data47 === "ESTIMATED")) || (data47 === "MODELLED")) || (data47 === "HISTORICAL")) || (data47 === "UNKNOWN"))){
const err141 = {instancePath:instancePath+"/metadata/status",schemaPath:"#/definitions/metadata/properties/status/enum",keyword:"enum",params:{allowedValues: schema12.properties.status.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err141];
}
else {
vErrors.push(err141);
}
errors++;
}
}
if(data0.evidence_type !== undefined){
let data48 = data0.evidence_type;
if(!((((((data48 === "observed") || (data48 === "derived")) || (data48 === "estimated")) || (data48 === "modelled")) || (data48 === "historical")) || (data48 === "unknown"))){
const err142 = {instancePath:instancePath+"/metadata/evidence_type",schemaPath:"#/definitions/metadata/properties/evidence_type/enum",keyword:"enum",params:{allowedValues: schema12.properties.evidence_type.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err142];
}
else {
vErrors.push(err142);
}
errors++;
}
}
if(data0.is_fixture !== undefined){
if(typeof data0.is_fixture !== "boolean"){
const err143 = {instancePath:instancePath+"/metadata/is_fixture",schemaPath:"#/definitions/metadata/properties/is_fixture/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"};
if(vErrors === null){
vErrors = [err143];
}
else {
vErrors.push(err143);
}
errors++;
}
}
if(data0.limitations !== undefined){
let data50 = data0.limitations;
if(Array.isArray(data50)){
if(data50.length < 1){
const err144 = {instancePath:instancePath+"/metadata/limitations",schemaPath:"#/definitions/metadata/properties/limitations/minItems",keyword:"minItems",params:{limit: 1},message:"must NOT have fewer than 1 items"};
if(vErrors === null){
vErrors = [err144];
}
else {
vErrors.push(err144);
}
errors++;
}
const len1 = data50.length;
for(let i1=0; i1<len1; i1++){
let data51 = data50[i1];
if(typeof data51 === "string"){
if(func3(data51) < 1){
const err145 = {instancePath:instancePath+"/metadata/limitations/" + i1,schemaPath:"#/definitions/metadata/properties/limitations/items/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err145];
}
else {
vErrors.push(err145);
}
errors++;
}
}
else {
const err146 = {instancePath:instancePath+"/metadata/limitations/" + i1,schemaPath:"#/definitions/metadata/properties/limitations/items/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err146];
}
else {
vErrors.push(err146);
}
errors++;
}
}
}
else {
const err147 = {instancePath:instancePath+"/metadata/limitations",schemaPath:"#/definitions/metadata/properties/limitations/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err147];
}
else {
vErrors.push(err147);
}
errors++;
}
}
if(data0.uncertainty !== undefined){
let data52 = data0.uncertainty;
if(typeof data52 === "string"){
if(func3(data52) < 1){
const err148 = {instancePath:instancePath+"/metadata/uncertainty",schemaPath:"#/definitions/metadata/properties/uncertainty/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err148];
}
else {
vErrors.push(err148);
}
errors++;
}
}
else {
const err149 = {instancePath:instancePath+"/metadata/uncertainty",schemaPath:"#/definitions/metadata/properties/uncertainty/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err149];
}
else {
vErrors.push(err149);
}
errors++;
}
}
if(data0.update_frequency !== undefined){
let data53 = data0.update_frequency;
if(!(((data53 === "static") || (data53 === "periodic")) || (data53 === "operational"))){
const err150 = {instancePath:instancePath+"/metadata/update_frequency",schemaPath:"#/definitions/metadata/properties/update_frequency/enum",keyword:"enum",params:{allowedValues: schema12.properties.update_frequency.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err150];
}
else {
vErrors.push(err150);
}
errors++;
}
}
if(data0.stale_after !== undefined){
let data54 = data0.stale_after;
const _errs162 = errors;
let valid46 = false;
const _errs163 = errors;
if(typeof data54 === "string"){
if(!(formats0.validate(data54))){
const err151 = {instancePath:instancePath+"/metadata/stale_after",schemaPath:"#/definitions/metadata/properties/stale_after/anyOf/0/format",keyword:"format",params:{format: "date-time"},message:"must match format \""+"date-time"+"\""};
if(vErrors === null){
vErrors = [err151];
}
else {
vErrors.push(err151);
}
errors++;
}
}
else {
const err152 = {instancePath:instancePath+"/metadata/stale_after",schemaPath:"#/definitions/metadata/properties/stale_after/anyOf/0/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err152];
}
else {
vErrors.push(err152);
}
errors++;
}
var _valid17 = _errs163 === errors;
valid46 = valid46 || _valid17;
if(!valid46){
const _errs165 = errors;
if(data54 !== null){
const err153 = {instancePath:instancePath+"/metadata/stale_after",schemaPath:"#/definitions/metadata/properties/stale_after/anyOf/1/type",keyword:"type",params:{type: "null"},message:"must be null"};
if(vErrors === null){
vErrors = [err153];
}
else {
vErrors.push(err153);
}
errors++;
}
var _valid17 = _errs165 === errors;
valid46 = valid46 || _valid17;
}
if(!valid46){
const err154 = {instancePath:instancePath+"/metadata/stale_after",schemaPath:"#/definitions/metadata/properties/stale_after/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err154];
}
else {
vErrors.push(err154);
}
errors++;
}
else {
errors = _errs162;
if(vErrors !== null){
if(_errs162){
vErrors.length = _errs162;
}
else {
vErrors = null;
}
}
}
}
if(data0.artifact !== undefined){
let data55 = data0.artifact;
if(data55 && typeof data55 == "object" && !Array.isArray(data55)){
if(data55.path === undefined){
const err155 = {instancePath:instancePath+"/metadata/artifact",schemaPath:"#/definitions/metadata/properties/artifact/required",keyword:"required",params:{missingProperty: "path"},message:"must have required property '"+"path"+"'"};
if(vErrors === null){
vErrors = [err155];
}
else {
vErrors.push(err155);
}
errors++;
}
if(data55.format === undefined){
const err156 = {instancePath:instancePath+"/metadata/artifact",schemaPath:"#/definitions/metadata/properties/artifact/required",keyword:"required",params:{missingProperty: "format"},message:"must have required property '"+"format"+"'"};
if(vErrors === null){
vErrors = [err156];
}
else {
vErrors.push(err156);
}
errors++;
}
if(data55.sha256 === undefined){
const err157 = {instancePath:instancePath+"/metadata/artifact",schemaPath:"#/definitions/metadata/properties/artifact/required",keyword:"required",params:{missingProperty: "sha256"},message:"must have required property '"+"sha256"+"'"};
if(vErrors === null){
vErrors = [err157];
}
else {
vErrors.push(err157);
}
errors++;
}
if(data55.byte_size === undefined){
const err158 = {instancePath:instancePath+"/metadata/artifact",schemaPath:"#/definitions/metadata/properties/artifact/required",keyword:"required",params:{missingProperty: "byte_size"},message:"must have required property '"+"byte_size"+"'"};
if(vErrors === null){
vErrors = [err158];
}
else {
vErrors.push(err158);
}
errors++;
}
for(const key5 in data55){
if(!((((key5 === "path") || (key5 === "format")) || (key5 === "sha256")) || (key5 === "byte_size"))){
const err159 = {instancePath:instancePath+"/metadata/artifact",schemaPath:"#/definitions/metadata/properties/artifact/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key5},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err159];
}
else {
vErrors.push(err159);
}
errors++;
}
}
if(data55.path !== undefined){
let data56 = data55.path;
if(typeof data56 === "string"){
if(!pattern6.test(data56)){
const err160 = {instancePath:instancePath+"/metadata/artifact/path",schemaPath:"#/definitions/metadata/properties/artifact/properties/path/pattern",keyword:"pattern",params:{pattern: "^/data/[a-z0-9-]+/[0-9]+\\.[0-9]+\\.[0-9]+/features\\.geojson(?:\\.gz)?$"},message:"must match pattern \""+"^/data/[a-z0-9-]+/[0-9]+\\.[0-9]+\\.[0-9]+/features\\.geojson(?:\\.gz)?$"+"\""};
if(vErrors === null){
vErrors = [err160];
}
else {
vErrors.push(err160);
}
errors++;
}
}
else {
const err161 = {instancePath:instancePath+"/metadata/artifact/path",schemaPath:"#/definitions/metadata/properties/artifact/properties/path/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err161];
}
else {
vErrors.push(err161);
}
errors++;
}
}
if(data55.format !== undefined){
let data57 = data55.format;
if(!((data57 === "GeoJSON") || (data57 === "GeoJSON+gzip"))){
const err162 = {instancePath:instancePath+"/metadata/artifact/format",schemaPath:"#/definitions/metadata/properties/artifact/properties/format/enum",keyword:"enum",params:{allowedValues: schema12.properties.artifact.properties.format.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err162];
}
else {
vErrors.push(err162);
}
errors++;
}
}
if(data55.sha256 !== undefined){
let data58 = data55.sha256;
if(typeof data58 === "string"){
if(!pattern7.test(data58)){
const err163 = {instancePath:instancePath+"/metadata/artifact/sha256",schemaPath:"#/definitions/metadata/properties/artifact/properties/sha256/pattern",keyword:"pattern",params:{pattern: "^[a-f0-9]{64}$"},message:"must match pattern \""+"^[a-f0-9]{64}$"+"\""};
if(vErrors === null){
vErrors = [err163];
}
else {
vErrors.push(err163);
}
errors++;
}
}
else {
const err164 = {instancePath:instancePath+"/metadata/artifact/sha256",schemaPath:"#/definitions/metadata/properties/artifact/properties/sha256/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err164];
}
else {
vErrors.push(err164);
}
errors++;
}
}
if(data55.byte_size !== undefined){
let data59 = data55.byte_size;
if(!(((typeof data59 == "number") && (!(data59 % 1) && !isNaN(data59))) && (isFinite(data59)))){
const err165 = {instancePath:instancePath+"/metadata/artifact/byte_size",schemaPath:"#/definitions/metadata/properties/artifact/properties/byte_size/type",keyword:"type",params:{type: "integer"},message:"must be integer"};
if(vErrors === null){
vErrors = [err165];
}
else {
vErrors.push(err165);
}
errors++;
}
if((typeof data59 == "number") && (isFinite(data59))){
if(data59 < 1 || isNaN(data59)){
const err166 = {instancePath:instancePath+"/metadata/artifact/byte_size",schemaPath:"#/definitions/metadata/properties/artifact/properties/byte_size/minimum",keyword:"minimum",params:{comparison: ">=", limit: 1},message:"must be >= 1"};
if(vErrors === null){
vErrors = [err166];
}
else {
vErrors.push(err166);
}
errors++;
}
}
}
}
else {
const err167 = {instancePath:instancePath+"/metadata/artifact",schemaPath:"#/definitions/metadata/properties/artifact/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err167];
}
else {
vErrors.push(err167);
}
errors++;
}
}
}
else {
const err168 = {instancePath:instancePath+"/metadata",schemaPath:"#/definitions/metadata/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err168];
}
else {
vErrors.push(err168);
}
errors++;
}
}
if(data.collection !== undefined){
if(!(validate11(data.collection, {instancePath:instancePath+"/collection",parentData:data,parentDataProperty:"collection",rootData}))){
vErrors = vErrors === null ? validate11.errors : vErrors.concat(validate11.errors);
errors = vErrors.length;
}
}
}
else {
const err169 = {instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err169];
}
else {
vErrors.push(err169);
}
errors++;
}
validate10.errors = vErrors;
return errors === 0;
}

