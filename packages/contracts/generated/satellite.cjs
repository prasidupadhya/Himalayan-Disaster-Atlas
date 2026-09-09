// Generated from satellite.schema.json; run npm run contracts:generate. Do not edit.
"use strict";
module.exports = validate10;
module.exports.default = validate10;
const schema11 = {"$schema":"http://json-schema.org/draft-07/schema#","$id":"https://himalayan-disaster-atlas.invalid/schemas/satellite.schema.json","type":"object","additionalProperties":false,"required":["metadata","observations"],"properties":{"metadata":{"type":"object","required":["schema_version","dataset_id","dataset_name","dataset_version","source","source_url","license","license_url","attribution","observation_date","publication_date","retrieval_date","processing_date","processing_version","method","spatial_resolution","temporal_resolution","spatial_coverage","temporal_coverage","crs","status","evidence_type","is_fixture","limitations","uncertainty","update_frequency","stale_after","artifact"],"properties":{"schema_version":{"const":"4.0.0"},"dataset_id":{"const":"nepal-sentinel-observations"},"dataset_name":{"type":"string","minLength":1},"dataset_version":{"const":"1.0.0"},"source":{"type":"string","minLength":1},"source_url":{"type":"string","format":"uri"},"license":{"type":"string","minLength":1},"license_url":{"type":"string","format":"uri"},"attribution":{"type":"string","minLength":1},"observation_date":{"type":"null"},"publication_date":{"type":"null"},"retrieval_date":{"type":"string","format":"date-time"},"processing_date":{"type":"string","format":"date-time"},"processing_version":{"type":"string","minLength":1},"method":{"type":"string","minLength":1},"spatial_resolution":{"type":"object","required":["value","unit"],"properties":{"value":{"const":10},"unit":{"const":"m"}},"additionalProperties":false},"temporal_resolution":{"const":"individual Sentinel-2 acquisitions"},"spatial_coverage":{"type":"object","required":["description","bbox"],"properties":{"description":{"type":"string","minLength":1},"bbox":{"type":"array","items":{"type":"number"},"minItems":4,"maxItems":4}},"additionalProperties":false},"temporal_coverage":{"type":"object","required":["start","end"],"properties":{"start":{"type":"string","format":"date-time"},"end":{"type":"string","format":"date-time"}},"additionalProperties":false},"crs":{"const":"OGC:CRS84"},"status":{"const":"SATELLITE_DERIVED"},"evidence_type":{"const":"derived"},"is_fixture":{"const":false},"limitations":{"type":"array","items":{"type":"string","minLength":1},"minItems":1},"uncertainty":{"type":"string","minLength":1},"update_frequency":{"const":"static"},"stale_after":{"type":"null"},"artifact":{"type":"object","required":["path","format","sha256","byte_size"],"properties":{"path":{"const":"/data/nepal-sentinel-observations/1.0.0/observations.json"},"format":{"const":"SatelliteObservation-index"},"sha256":{"type":"string","pattern":"^[a-f0-9]{64}$"},"byte_size":{"type":"integer","minimum":1,"maximum":65536}},"additionalProperties":false}},"additionalProperties":false},"observations":{"type":"array","minItems":3,"maxItems":3,"items":{"type":"object","additionalProperties":false,"required":["id","label","scene_id","acquired_at","cloud_percent","nodata_percent","snow_ice_percent","source_crs","source_resolution_m","source_asset","source_scl","source_etag","source_byte_size","image","coordinates"],"properties":{"id":{"enum":["west","central","east"]},"label":{"type":"string","minLength":1},"scene_id":{"type":"string","minLength":1},"acquired_at":{"type":"string","format":"date-time"},"cloud_percent":{"type":"number","minimum":0,"maximum":100},"nodata_percent":{"type":"number","minimum":0,"maximum":100},"snow_ice_percent":{"type":"number","minimum":0,"maximum":100},"source_crs":{"type":"string","pattern":"^EPSG:[0-9]+$"},"source_resolution_m":{"const":10},"source_asset":{"type":"string","format":"uri"},"source_scl":{"type":"string","format":"uri"},"source_etag":{"type":"string","minLength":1},"source_byte_size":{"type":"integer","minimum":1},"image":{"type":"object","additionalProperties":false,"required":["path","sha256","byte_size","width","height"],"properties":{"path":{"type":"string","pattern":"^/data/nepal-sentinel-observations/1.0.0/(west|central|east)\\.png$"},"sha256":{"type":"string","pattern":"^[a-f0-9]{64}$"},"byte_size":{"type":"integer","minimum":1,"maximum":4194304},"width":{"const":768},"height":{"const":768}}},"coordinates":{"type":"array","minItems":4,"maxItems":4,"items":{"type":"array","minItems":2,"maxItems":2,"items":{"type":"number"}}}}}}}};
const func2 = Object.prototype.hasOwnProperty;
const func3 = require("ajv/dist/runtime/ucs2length").default;
const formats0 = require("ajv-formats/dist/formats").fullFormats.uri;
const formats4 = require("ajv-formats/dist/formats").fullFormats["date-time"];
const pattern0 = new RegExp("^[a-f0-9]{64}$", "u");
const pattern1 = new RegExp("^EPSG:[0-9]+$", "u");
const pattern2 = new RegExp("^/data/nepal-sentinel-observations/1.0.0/(west|central|east)\\.png$", "u");

function validate10(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
/*# sourceURL="https://himalayan-disaster-atlas.invalid/schemas/satellite.schema.json" */;
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
if(data.observations === undefined){
const err1 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "observations"},message:"must have required property '"+"observations"+"'"};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
for(const key0 in data){
if(!((key0 === "metadata") || (key0 === "observations"))){
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
if(data0 && typeof data0 == "object" && !Array.isArray(data0)){
if(data0.schema_version === undefined){
const err3 = {instancePath:instancePath+"/metadata",schemaPath:"#/properties/metadata/required",keyword:"required",params:{missingProperty: "schema_version"},message:"must have required property '"+"schema_version"+"'"};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
if(data0.dataset_id === undefined){
const err4 = {instancePath:instancePath+"/metadata",schemaPath:"#/properties/metadata/required",keyword:"required",params:{missingProperty: "dataset_id"},message:"must have required property '"+"dataset_id"+"'"};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
if(data0.dataset_name === undefined){
const err5 = {instancePath:instancePath+"/metadata",schemaPath:"#/properties/metadata/required",keyword:"required",params:{missingProperty: "dataset_name"},message:"must have required property '"+"dataset_name"+"'"};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
if(data0.dataset_version === undefined){
const err6 = {instancePath:instancePath+"/metadata",schemaPath:"#/properties/metadata/required",keyword:"required",params:{missingProperty: "dataset_version"},message:"must have required property '"+"dataset_version"+"'"};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
if(data0.source === undefined){
const err7 = {instancePath:instancePath+"/metadata",schemaPath:"#/properties/metadata/required",keyword:"required",params:{missingProperty: "source"},message:"must have required property '"+"source"+"'"};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
}
if(data0.source_url === undefined){
const err8 = {instancePath:instancePath+"/metadata",schemaPath:"#/properties/metadata/required",keyword:"required",params:{missingProperty: "source_url"},message:"must have required property '"+"source_url"+"'"};
if(vErrors === null){
vErrors = [err8];
}
else {
vErrors.push(err8);
}
errors++;
}
if(data0.license === undefined){
const err9 = {instancePath:instancePath+"/metadata",schemaPath:"#/properties/metadata/required",keyword:"required",params:{missingProperty: "license"},message:"must have required property '"+"license"+"'"};
if(vErrors === null){
vErrors = [err9];
}
else {
vErrors.push(err9);
}
errors++;
}
if(data0.license_url === undefined){
const err10 = {instancePath:instancePath+"/metadata",schemaPath:"#/properties/metadata/required",keyword:"required",params:{missingProperty: "license_url"},message:"must have required property '"+"license_url"+"'"};
if(vErrors === null){
vErrors = [err10];
}
else {
vErrors.push(err10);
}
errors++;
}
if(data0.attribution === undefined){
const err11 = {instancePath:instancePath+"/metadata",schemaPath:"#/properties/metadata/required",keyword:"required",params:{missingProperty: "attribution"},message:"must have required property '"+"attribution"+"'"};
if(vErrors === null){
vErrors = [err11];
}
else {
vErrors.push(err11);
}
errors++;
}
if(data0.observation_date === undefined){
const err12 = {instancePath:instancePath+"/metadata",schemaPath:"#/properties/metadata/required",keyword:"required",params:{missingProperty: "observation_date"},message:"must have required property '"+"observation_date"+"'"};
if(vErrors === null){
vErrors = [err12];
}
else {
vErrors.push(err12);
}
errors++;
}
if(data0.publication_date === undefined){
const err13 = {instancePath:instancePath+"/metadata",schemaPath:"#/properties/metadata/required",keyword:"required",params:{missingProperty: "publication_date"},message:"must have required property '"+"publication_date"+"'"};
if(vErrors === null){
vErrors = [err13];
}
else {
vErrors.push(err13);
}
errors++;
}
if(data0.retrieval_date === undefined){
const err14 = {instancePath:instancePath+"/metadata",schemaPath:"#/properties/metadata/required",keyword:"required",params:{missingProperty: "retrieval_date"},message:"must have required property '"+"retrieval_date"+"'"};
if(vErrors === null){
vErrors = [err14];
}
else {
vErrors.push(err14);
}
errors++;
}
if(data0.processing_date === undefined){
const err15 = {instancePath:instancePath+"/metadata",schemaPath:"#/properties/metadata/required",keyword:"required",params:{missingProperty: "processing_date"},message:"must have required property '"+"processing_date"+"'"};
if(vErrors === null){
vErrors = [err15];
}
else {
vErrors.push(err15);
}
errors++;
}
if(data0.processing_version === undefined){
const err16 = {instancePath:instancePath+"/metadata",schemaPath:"#/properties/metadata/required",keyword:"required",params:{missingProperty: "processing_version"},message:"must have required property '"+"processing_version"+"'"};
if(vErrors === null){
vErrors = [err16];
}
else {
vErrors.push(err16);
}
errors++;
}
if(data0.method === undefined){
const err17 = {instancePath:instancePath+"/metadata",schemaPath:"#/properties/metadata/required",keyword:"required",params:{missingProperty: "method"},message:"must have required property '"+"method"+"'"};
if(vErrors === null){
vErrors = [err17];
}
else {
vErrors.push(err17);
}
errors++;
}
if(data0.spatial_resolution === undefined){
const err18 = {instancePath:instancePath+"/metadata",schemaPath:"#/properties/metadata/required",keyword:"required",params:{missingProperty: "spatial_resolution"},message:"must have required property '"+"spatial_resolution"+"'"};
if(vErrors === null){
vErrors = [err18];
}
else {
vErrors.push(err18);
}
errors++;
}
if(data0.temporal_resolution === undefined){
const err19 = {instancePath:instancePath+"/metadata",schemaPath:"#/properties/metadata/required",keyword:"required",params:{missingProperty: "temporal_resolution"},message:"must have required property '"+"temporal_resolution"+"'"};
if(vErrors === null){
vErrors = [err19];
}
else {
vErrors.push(err19);
}
errors++;
}
if(data0.spatial_coverage === undefined){
const err20 = {instancePath:instancePath+"/metadata",schemaPath:"#/properties/metadata/required",keyword:"required",params:{missingProperty: "spatial_coverage"},message:"must have required property '"+"spatial_coverage"+"'"};
if(vErrors === null){
vErrors = [err20];
}
else {
vErrors.push(err20);
}
errors++;
}
if(data0.temporal_coverage === undefined){
const err21 = {instancePath:instancePath+"/metadata",schemaPath:"#/properties/metadata/required",keyword:"required",params:{missingProperty: "temporal_coverage"},message:"must have required property '"+"temporal_coverage"+"'"};
if(vErrors === null){
vErrors = [err21];
}
else {
vErrors.push(err21);
}
errors++;
}
if(data0.crs === undefined){
const err22 = {instancePath:instancePath+"/metadata",schemaPath:"#/properties/metadata/required",keyword:"required",params:{missingProperty: "crs"},message:"must have required property '"+"crs"+"'"};
if(vErrors === null){
vErrors = [err22];
}
else {
vErrors.push(err22);
}
errors++;
}
if(data0.status === undefined){
const err23 = {instancePath:instancePath+"/metadata",schemaPath:"#/properties/metadata/required",keyword:"required",params:{missingProperty: "status"},message:"must have required property '"+"status"+"'"};
if(vErrors === null){
vErrors = [err23];
}
else {
vErrors.push(err23);
}
errors++;
}
if(data0.evidence_type === undefined){
const err24 = {instancePath:instancePath+"/metadata",schemaPath:"#/properties/metadata/required",keyword:"required",params:{missingProperty: "evidence_type"},message:"must have required property '"+"evidence_type"+"'"};
if(vErrors === null){
vErrors = [err24];
}
else {
vErrors.push(err24);
}
errors++;
}
if(data0.is_fixture === undefined){
const err25 = {instancePath:instancePath+"/metadata",schemaPath:"#/properties/metadata/required",keyword:"required",params:{missingProperty: "is_fixture"},message:"must have required property '"+"is_fixture"+"'"};
if(vErrors === null){
vErrors = [err25];
}
else {
vErrors.push(err25);
}
errors++;
}
if(data0.limitations === undefined){
const err26 = {instancePath:instancePath+"/metadata",schemaPath:"#/properties/metadata/required",keyword:"required",params:{missingProperty: "limitations"},message:"must have required property '"+"limitations"+"'"};
if(vErrors === null){
vErrors = [err26];
}
else {
vErrors.push(err26);
}
errors++;
}
if(data0.uncertainty === undefined){
const err27 = {instancePath:instancePath+"/metadata",schemaPath:"#/properties/metadata/required",keyword:"required",params:{missingProperty: "uncertainty"},message:"must have required property '"+"uncertainty"+"'"};
if(vErrors === null){
vErrors = [err27];
}
else {
vErrors.push(err27);
}
errors++;
}
if(data0.update_frequency === undefined){
const err28 = {instancePath:instancePath+"/metadata",schemaPath:"#/properties/metadata/required",keyword:"required",params:{missingProperty: "update_frequency"},message:"must have required property '"+"update_frequency"+"'"};
if(vErrors === null){
vErrors = [err28];
}
else {
vErrors.push(err28);
}
errors++;
}
if(data0.stale_after === undefined){
const err29 = {instancePath:instancePath+"/metadata",schemaPath:"#/properties/metadata/required",keyword:"required",params:{missingProperty: "stale_after"},message:"must have required property '"+"stale_after"+"'"};
if(vErrors === null){
vErrors = [err29];
}
else {
vErrors.push(err29);
}
errors++;
}
if(data0.artifact === undefined){
const err30 = {instancePath:instancePath+"/metadata",schemaPath:"#/properties/metadata/required",keyword:"required",params:{missingProperty: "artifact"},message:"must have required property '"+"artifact"+"'"};
if(vErrors === null){
vErrors = [err30];
}
else {
vErrors.push(err30);
}
errors++;
}
for(const key1 in data0){
if(!(func2.call(schema11.properties.metadata.properties, key1))){
const err31 = {instancePath:instancePath+"/metadata",schemaPath:"#/properties/metadata/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key1},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err31];
}
else {
vErrors.push(err31);
}
errors++;
}
}
if(data0.schema_version !== undefined){
if("4.0.0" !== data0.schema_version){
const err32 = {instancePath:instancePath+"/metadata/schema_version",schemaPath:"#/properties/metadata/properties/schema_version/const",keyword:"const",params:{allowedValue: "4.0.0"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err32];
}
else {
vErrors.push(err32);
}
errors++;
}
}
if(data0.dataset_id !== undefined){
if("nepal-sentinel-observations" !== data0.dataset_id){
const err33 = {instancePath:instancePath+"/metadata/dataset_id",schemaPath:"#/properties/metadata/properties/dataset_id/const",keyword:"const",params:{allowedValue: "nepal-sentinel-observations"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err33];
}
else {
vErrors.push(err33);
}
errors++;
}
}
if(data0.dataset_name !== undefined){
let data3 = data0.dataset_name;
if(typeof data3 === "string"){
if(func3(data3) < 1){
const err34 = {instancePath:instancePath+"/metadata/dataset_name",schemaPath:"#/properties/metadata/properties/dataset_name/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
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
const err35 = {instancePath:instancePath+"/metadata/dataset_name",schemaPath:"#/properties/metadata/properties/dataset_name/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err35];
}
else {
vErrors.push(err35);
}
errors++;
}
}
if(data0.dataset_version !== undefined){
if("1.0.0" !== data0.dataset_version){
const err36 = {instancePath:instancePath+"/metadata/dataset_version",schemaPath:"#/properties/metadata/properties/dataset_version/const",keyword:"const",params:{allowedValue: "1.0.0"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err36];
}
else {
vErrors.push(err36);
}
errors++;
}
}
if(data0.source !== undefined){
let data5 = data0.source;
if(typeof data5 === "string"){
if(func3(data5) < 1){
const err37 = {instancePath:instancePath+"/metadata/source",schemaPath:"#/properties/metadata/properties/source/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err37];
}
else {
vErrors.push(err37);
}
errors++;
}
}
else {
const err38 = {instancePath:instancePath+"/metadata/source",schemaPath:"#/properties/metadata/properties/source/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err38];
}
else {
vErrors.push(err38);
}
errors++;
}
}
if(data0.source_url !== undefined){
let data6 = data0.source_url;
if(typeof data6 === "string"){
if(!(formats0(data6))){
const err39 = {instancePath:instancePath+"/metadata/source_url",schemaPath:"#/properties/metadata/properties/source_url/format",keyword:"format",params:{format: "uri"},message:"must match format \""+"uri"+"\""};
if(vErrors === null){
vErrors = [err39];
}
else {
vErrors.push(err39);
}
errors++;
}
}
else {
const err40 = {instancePath:instancePath+"/metadata/source_url",schemaPath:"#/properties/metadata/properties/source_url/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err40];
}
else {
vErrors.push(err40);
}
errors++;
}
}
if(data0.license !== undefined){
let data7 = data0.license;
if(typeof data7 === "string"){
if(func3(data7) < 1){
const err41 = {instancePath:instancePath+"/metadata/license",schemaPath:"#/properties/metadata/properties/license/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err41];
}
else {
vErrors.push(err41);
}
errors++;
}
}
else {
const err42 = {instancePath:instancePath+"/metadata/license",schemaPath:"#/properties/metadata/properties/license/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err42];
}
else {
vErrors.push(err42);
}
errors++;
}
}
if(data0.license_url !== undefined){
let data8 = data0.license_url;
if(typeof data8 === "string"){
if(!(formats0(data8))){
const err43 = {instancePath:instancePath+"/metadata/license_url",schemaPath:"#/properties/metadata/properties/license_url/format",keyword:"format",params:{format: "uri"},message:"must match format \""+"uri"+"\""};
if(vErrors === null){
vErrors = [err43];
}
else {
vErrors.push(err43);
}
errors++;
}
}
else {
const err44 = {instancePath:instancePath+"/metadata/license_url",schemaPath:"#/properties/metadata/properties/license_url/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err44];
}
else {
vErrors.push(err44);
}
errors++;
}
}
if(data0.attribution !== undefined){
let data9 = data0.attribution;
if(typeof data9 === "string"){
if(func3(data9) < 1){
const err45 = {instancePath:instancePath+"/metadata/attribution",schemaPath:"#/properties/metadata/properties/attribution/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err45];
}
else {
vErrors.push(err45);
}
errors++;
}
}
else {
const err46 = {instancePath:instancePath+"/metadata/attribution",schemaPath:"#/properties/metadata/properties/attribution/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err46];
}
else {
vErrors.push(err46);
}
errors++;
}
}
if(data0.observation_date !== undefined){
if(data0.observation_date !== null){
const err47 = {instancePath:instancePath+"/metadata/observation_date",schemaPath:"#/properties/metadata/properties/observation_date/type",keyword:"type",params:{type: "null"},message:"must be null"};
if(vErrors === null){
vErrors = [err47];
}
else {
vErrors.push(err47);
}
errors++;
}
}
if(data0.publication_date !== undefined){
if(data0.publication_date !== null){
const err48 = {instancePath:instancePath+"/metadata/publication_date",schemaPath:"#/properties/metadata/properties/publication_date/type",keyword:"type",params:{type: "null"},message:"must be null"};
if(vErrors === null){
vErrors = [err48];
}
else {
vErrors.push(err48);
}
errors++;
}
}
if(data0.retrieval_date !== undefined){
let data12 = data0.retrieval_date;
if(typeof data12 === "string"){
if(!(formats4.validate(data12))){
const err49 = {instancePath:instancePath+"/metadata/retrieval_date",schemaPath:"#/properties/metadata/properties/retrieval_date/format",keyword:"format",params:{format: "date-time"},message:"must match format \""+"date-time"+"\""};
if(vErrors === null){
vErrors = [err49];
}
else {
vErrors.push(err49);
}
errors++;
}
}
else {
const err50 = {instancePath:instancePath+"/metadata/retrieval_date",schemaPath:"#/properties/metadata/properties/retrieval_date/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err50];
}
else {
vErrors.push(err50);
}
errors++;
}
}
if(data0.processing_date !== undefined){
let data13 = data0.processing_date;
if(typeof data13 === "string"){
if(!(formats4.validate(data13))){
const err51 = {instancePath:instancePath+"/metadata/processing_date",schemaPath:"#/properties/metadata/properties/processing_date/format",keyword:"format",params:{format: "date-time"},message:"must match format \""+"date-time"+"\""};
if(vErrors === null){
vErrors = [err51];
}
else {
vErrors.push(err51);
}
errors++;
}
}
else {
const err52 = {instancePath:instancePath+"/metadata/processing_date",schemaPath:"#/properties/metadata/properties/processing_date/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err52];
}
else {
vErrors.push(err52);
}
errors++;
}
}
if(data0.processing_version !== undefined){
let data14 = data0.processing_version;
if(typeof data14 === "string"){
if(func3(data14) < 1){
const err53 = {instancePath:instancePath+"/metadata/processing_version",schemaPath:"#/properties/metadata/properties/processing_version/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err53];
}
else {
vErrors.push(err53);
}
errors++;
}
}
else {
const err54 = {instancePath:instancePath+"/metadata/processing_version",schemaPath:"#/properties/metadata/properties/processing_version/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err54];
}
else {
vErrors.push(err54);
}
errors++;
}
}
if(data0.method !== undefined){
let data15 = data0.method;
if(typeof data15 === "string"){
if(func3(data15) < 1){
const err55 = {instancePath:instancePath+"/metadata/method",schemaPath:"#/properties/metadata/properties/method/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err55];
}
else {
vErrors.push(err55);
}
errors++;
}
}
else {
const err56 = {instancePath:instancePath+"/metadata/method",schemaPath:"#/properties/metadata/properties/method/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err56];
}
else {
vErrors.push(err56);
}
errors++;
}
}
if(data0.spatial_resolution !== undefined){
let data16 = data0.spatial_resolution;
if(data16 && typeof data16 == "object" && !Array.isArray(data16)){
if(data16.value === undefined){
const err57 = {instancePath:instancePath+"/metadata/spatial_resolution",schemaPath:"#/properties/metadata/properties/spatial_resolution/required",keyword:"required",params:{missingProperty: "value"},message:"must have required property '"+"value"+"'"};
if(vErrors === null){
vErrors = [err57];
}
else {
vErrors.push(err57);
}
errors++;
}
if(data16.unit === undefined){
const err58 = {instancePath:instancePath+"/metadata/spatial_resolution",schemaPath:"#/properties/metadata/properties/spatial_resolution/required",keyword:"required",params:{missingProperty: "unit"},message:"must have required property '"+"unit"+"'"};
if(vErrors === null){
vErrors = [err58];
}
else {
vErrors.push(err58);
}
errors++;
}
for(const key2 in data16){
if(!((key2 === "value") || (key2 === "unit"))){
const err59 = {instancePath:instancePath+"/metadata/spatial_resolution",schemaPath:"#/properties/metadata/properties/spatial_resolution/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key2},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err59];
}
else {
vErrors.push(err59);
}
errors++;
}
}
if(data16.value !== undefined){
if(10 !== data16.value){
const err60 = {instancePath:instancePath+"/metadata/spatial_resolution/value",schemaPath:"#/properties/metadata/properties/spatial_resolution/properties/value/const",keyword:"const",params:{allowedValue: 10},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err60];
}
else {
vErrors.push(err60);
}
errors++;
}
}
if(data16.unit !== undefined){
if("m" !== data16.unit){
const err61 = {instancePath:instancePath+"/metadata/spatial_resolution/unit",schemaPath:"#/properties/metadata/properties/spatial_resolution/properties/unit/const",keyword:"const",params:{allowedValue: "m"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err61];
}
else {
vErrors.push(err61);
}
errors++;
}
}
}
else {
const err62 = {instancePath:instancePath+"/metadata/spatial_resolution",schemaPath:"#/properties/metadata/properties/spatial_resolution/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err62];
}
else {
vErrors.push(err62);
}
errors++;
}
}
if(data0.temporal_resolution !== undefined){
if("individual Sentinel-2 acquisitions" !== data0.temporal_resolution){
const err63 = {instancePath:instancePath+"/metadata/temporal_resolution",schemaPath:"#/properties/metadata/properties/temporal_resolution/const",keyword:"const",params:{allowedValue: "individual Sentinel-2 acquisitions"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err63];
}
else {
vErrors.push(err63);
}
errors++;
}
}
if(data0.spatial_coverage !== undefined){
let data20 = data0.spatial_coverage;
if(data20 && typeof data20 == "object" && !Array.isArray(data20)){
if(data20.description === undefined){
const err64 = {instancePath:instancePath+"/metadata/spatial_coverage",schemaPath:"#/properties/metadata/properties/spatial_coverage/required",keyword:"required",params:{missingProperty: "description"},message:"must have required property '"+"description"+"'"};
if(vErrors === null){
vErrors = [err64];
}
else {
vErrors.push(err64);
}
errors++;
}
if(data20.bbox === undefined){
const err65 = {instancePath:instancePath+"/metadata/spatial_coverage",schemaPath:"#/properties/metadata/properties/spatial_coverage/required",keyword:"required",params:{missingProperty: "bbox"},message:"must have required property '"+"bbox"+"'"};
if(vErrors === null){
vErrors = [err65];
}
else {
vErrors.push(err65);
}
errors++;
}
for(const key3 in data20){
if(!((key3 === "description") || (key3 === "bbox"))){
const err66 = {instancePath:instancePath+"/metadata/spatial_coverage",schemaPath:"#/properties/metadata/properties/spatial_coverage/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key3},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err66];
}
else {
vErrors.push(err66);
}
errors++;
}
}
if(data20.description !== undefined){
let data21 = data20.description;
if(typeof data21 === "string"){
if(func3(data21) < 1){
const err67 = {instancePath:instancePath+"/metadata/spatial_coverage/description",schemaPath:"#/properties/metadata/properties/spatial_coverage/properties/description/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
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
const err68 = {instancePath:instancePath+"/metadata/spatial_coverage/description",schemaPath:"#/properties/metadata/properties/spatial_coverage/properties/description/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err68];
}
else {
vErrors.push(err68);
}
errors++;
}
}
if(data20.bbox !== undefined){
let data22 = data20.bbox;
if(Array.isArray(data22)){
if(data22.length > 4){
const err69 = {instancePath:instancePath+"/metadata/spatial_coverage/bbox",schemaPath:"#/properties/metadata/properties/spatial_coverage/properties/bbox/maxItems",keyword:"maxItems",params:{limit: 4},message:"must NOT have more than 4 items"};
if(vErrors === null){
vErrors = [err69];
}
else {
vErrors.push(err69);
}
errors++;
}
if(data22.length < 4){
const err70 = {instancePath:instancePath+"/metadata/spatial_coverage/bbox",schemaPath:"#/properties/metadata/properties/spatial_coverage/properties/bbox/minItems",keyword:"minItems",params:{limit: 4},message:"must NOT have fewer than 4 items"};
if(vErrors === null){
vErrors = [err70];
}
else {
vErrors.push(err70);
}
errors++;
}
const len0 = data22.length;
for(let i0=0; i0<len0; i0++){
let data23 = data22[i0];
if(!((typeof data23 == "number") && (isFinite(data23)))){
const err71 = {instancePath:instancePath+"/metadata/spatial_coverage/bbox/" + i0,schemaPath:"#/properties/metadata/properties/spatial_coverage/properties/bbox/items/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err71];
}
else {
vErrors.push(err71);
}
errors++;
}
}
}
else {
const err72 = {instancePath:instancePath+"/metadata/spatial_coverage/bbox",schemaPath:"#/properties/metadata/properties/spatial_coverage/properties/bbox/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err72];
}
else {
vErrors.push(err72);
}
errors++;
}
}
}
else {
const err73 = {instancePath:instancePath+"/metadata/spatial_coverage",schemaPath:"#/properties/metadata/properties/spatial_coverage/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err73];
}
else {
vErrors.push(err73);
}
errors++;
}
}
if(data0.temporal_coverage !== undefined){
let data24 = data0.temporal_coverage;
if(data24 && typeof data24 == "object" && !Array.isArray(data24)){
if(data24.start === undefined){
const err74 = {instancePath:instancePath+"/metadata/temporal_coverage",schemaPath:"#/properties/metadata/properties/temporal_coverage/required",keyword:"required",params:{missingProperty: "start"},message:"must have required property '"+"start"+"'"};
if(vErrors === null){
vErrors = [err74];
}
else {
vErrors.push(err74);
}
errors++;
}
if(data24.end === undefined){
const err75 = {instancePath:instancePath+"/metadata/temporal_coverage",schemaPath:"#/properties/metadata/properties/temporal_coverage/required",keyword:"required",params:{missingProperty: "end"},message:"must have required property '"+"end"+"'"};
if(vErrors === null){
vErrors = [err75];
}
else {
vErrors.push(err75);
}
errors++;
}
for(const key4 in data24){
if(!((key4 === "start") || (key4 === "end"))){
const err76 = {instancePath:instancePath+"/metadata/temporal_coverage",schemaPath:"#/properties/metadata/properties/temporal_coverage/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key4},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err76];
}
else {
vErrors.push(err76);
}
errors++;
}
}
if(data24.start !== undefined){
let data25 = data24.start;
if(typeof data25 === "string"){
if(!(formats4.validate(data25))){
const err77 = {instancePath:instancePath+"/metadata/temporal_coverage/start",schemaPath:"#/properties/metadata/properties/temporal_coverage/properties/start/format",keyword:"format",params:{format: "date-time"},message:"must match format \""+"date-time"+"\""};
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
const err78 = {instancePath:instancePath+"/metadata/temporal_coverage/start",schemaPath:"#/properties/metadata/properties/temporal_coverage/properties/start/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err78];
}
else {
vErrors.push(err78);
}
errors++;
}
}
if(data24.end !== undefined){
let data26 = data24.end;
if(typeof data26 === "string"){
if(!(formats4.validate(data26))){
const err79 = {instancePath:instancePath+"/metadata/temporal_coverage/end",schemaPath:"#/properties/metadata/properties/temporal_coverage/properties/end/format",keyword:"format",params:{format: "date-time"},message:"must match format \""+"date-time"+"\""};
if(vErrors === null){
vErrors = [err79];
}
else {
vErrors.push(err79);
}
errors++;
}
}
else {
const err80 = {instancePath:instancePath+"/metadata/temporal_coverage/end",schemaPath:"#/properties/metadata/properties/temporal_coverage/properties/end/type",keyword:"type",params:{type: "string"},message:"must be string"};
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
else {
const err81 = {instancePath:instancePath+"/metadata/temporal_coverage",schemaPath:"#/properties/metadata/properties/temporal_coverage/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err81];
}
else {
vErrors.push(err81);
}
errors++;
}
}
if(data0.crs !== undefined){
if("OGC:CRS84" !== data0.crs){
const err82 = {instancePath:instancePath+"/metadata/crs",schemaPath:"#/properties/metadata/properties/crs/const",keyword:"const",params:{allowedValue: "OGC:CRS84"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err82];
}
else {
vErrors.push(err82);
}
errors++;
}
}
if(data0.status !== undefined){
if("SATELLITE_DERIVED" !== data0.status){
const err83 = {instancePath:instancePath+"/metadata/status",schemaPath:"#/properties/metadata/properties/status/const",keyword:"const",params:{allowedValue: "SATELLITE_DERIVED"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err83];
}
else {
vErrors.push(err83);
}
errors++;
}
}
if(data0.evidence_type !== undefined){
if("derived" !== data0.evidence_type){
const err84 = {instancePath:instancePath+"/metadata/evidence_type",schemaPath:"#/properties/metadata/properties/evidence_type/const",keyword:"const",params:{allowedValue: "derived"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err84];
}
else {
vErrors.push(err84);
}
errors++;
}
}
if(data0.is_fixture !== undefined){
if(false !== data0.is_fixture){
const err85 = {instancePath:instancePath+"/metadata/is_fixture",schemaPath:"#/properties/metadata/properties/is_fixture/const",keyword:"const",params:{allowedValue: false},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err85];
}
else {
vErrors.push(err85);
}
errors++;
}
}
if(data0.limitations !== undefined){
let data31 = data0.limitations;
if(Array.isArray(data31)){
if(data31.length < 1){
const err86 = {instancePath:instancePath+"/metadata/limitations",schemaPath:"#/properties/metadata/properties/limitations/minItems",keyword:"minItems",params:{limit: 1},message:"must NOT have fewer than 1 items"};
if(vErrors === null){
vErrors = [err86];
}
else {
vErrors.push(err86);
}
errors++;
}
const len1 = data31.length;
for(let i1=0; i1<len1; i1++){
let data32 = data31[i1];
if(typeof data32 === "string"){
if(func3(data32) < 1){
const err87 = {instancePath:instancePath+"/metadata/limitations/" + i1,schemaPath:"#/properties/metadata/properties/limitations/items/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
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
const err88 = {instancePath:instancePath+"/metadata/limitations/" + i1,schemaPath:"#/properties/metadata/properties/limitations/items/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err88];
}
else {
vErrors.push(err88);
}
errors++;
}
}
}
else {
const err89 = {instancePath:instancePath+"/metadata/limitations",schemaPath:"#/properties/metadata/properties/limitations/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err89];
}
else {
vErrors.push(err89);
}
errors++;
}
}
if(data0.uncertainty !== undefined){
let data33 = data0.uncertainty;
if(typeof data33 === "string"){
if(func3(data33) < 1){
const err90 = {instancePath:instancePath+"/metadata/uncertainty",schemaPath:"#/properties/metadata/properties/uncertainty/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err90];
}
else {
vErrors.push(err90);
}
errors++;
}
}
else {
const err91 = {instancePath:instancePath+"/metadata/uncertainty",schemaPath:"#/properties/metadata/properties/uncertainty/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err91];
}
else {
vErrors.push(err91);
}
errors++;
}
}
if(data0.update_frequency !== undefined){
if("static" !== data0.update_frequency){
const err92 = {instancePath:instancePath+"/metadata/update_frequency",schemaPath:"#/properties/metadata/properties/update_frequency/const",keyword:"const",params:{allowedValue: "static"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err92];
}
else {
vErrors.push(err92);
}
errors++;
}
}
if(data0.stale_after !== undefined){
if(data0.stale_after !== null){
const err93 = {instancePath:instancePath+"/metadata/stale_after",schemaPath:"#/properties/metadata/properties/stale_after/type",keyword:"type",params:{type: "null"},message:"must be null"};
if(vErrors === null){
vErrors = [err93];
}
else {
vErrors.push(err93);
}
errors++;
}
}
if(data0.artifact !== undefined){
let data36 = data0.artifact;
if(data36 && typeof data36 == "object" && !Array.isArray(data36)){
if(data36.path === undefined){
const err94 = {instancePath:instancePath+"/metadata/artifact",schemaPath:"#/properties/metadata/properties/artifact/required",keyword:"required",params:{missingProperty: "path"},message:"must have required property '"+"path"+"'"};
if(vErrors === null){
vErrors = [err94];
}
else {
vErrors.push(err94);
}
errors++;
}
if(data36.format === undefined){
const err95 = {instancePath:instancePath+"/metadata/artifact",schemaPath:"#/properties/metadata/properties/artifact/required",keyword:"required",params:{missingProperty: "format"},message:"must have required property '"+"format"+"'"};
if(vErrors === null){
vErrors = [err95];
}
else {
vErrors.push(err95);
}
errors++;
}
if(data36.sha256 === undefined){
const err96 = {instancePath:instancePath+"/metadata/artifact",schemaPath:"#/properties/metadata/properties/artifact/required",keyword:"required",params:{missingProperty: "sha256"},message:"must have required property '"+"sha256"+"'"};
if(vErrors === null){
vErrors = [err96];
}
else {
vErrors.push(err96);
}
errors++;
}
if(data36.byte_size === undefined){
const err97 = {instancePath:instancePath+"/metadata/artifact",schemaPath:"#/properties/metadata/properties/artifact/required",keyword:"required",params:{missingProperty: "byte_size"},message:"must have required property '"+"byte_size"+"'"};
if(vErrors === null){
vErrors = [err97];
}
else {
vErrors.push(err97);
}
errors++;
}
for(const key5 in data36){
if(!((((key5 === "path") || (key5 === "format")) || (key5 === "sha256")) || (key5 === "byte_size"))){
const err98 = {instancePath:instancePath+"/metadata/artifact",schemaPath:"#/properties/metadata/properties/artifact/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key5},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err98];
}
else {
vErrors.push(err98);
}
errors++;
}
}
if(data36.path !== undefined){
if("/data/nepal-sentinel-observations/1.0.0/observations.json" !== data36.path){
const err99 = {instancePath:instancePath+"/metadata/artifact/path",schemaPath:"#/properties/metadata/properties/artifact/properties/path/const",keyword:"const",params:{allowedValue: "/data/nepal-sentinel-observations/1.0.0/observations.json"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err99];
}
else {
vErrors.push(err99);
}
errors++;
}
}
if(data36.format !== undefined){
if("SatelliteObservation-index" !== data36.format){
const err100 = {instancePath:instancePath+"/metadata/artifact/format",schemaPath:"#/properties/metadata/properties/artifact/properties/format/const",keyword:"const",params:{allowedValue: "SatelliteObservation-index"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err100];
}
else {
vErrors.push(err100);
}
errors++;
}
}
if(data36.sha256 !== undefined){
let data39 = data36.sha256;
if(typeof data39 === "string"){
if(!pattern0.test(data39)){
const err101 = {instancePath:instancePath+"/metadata/artifact/sha256",schemaPath:"#/properties/metadata/properties/artifact/properties/sha256/pattern",keyword:"pattern",params:{pattern: "^[a-f0-9]{64}$"},message:"must match pattern \""+"^[a-f0-9]{64}$"+"\""};
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
const err102 = {instancePath:instancePath+"/metadata/artifact/sha256",schemaPath:"#/properties/metadata/properties/artifact/properties/sha256/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err102];
}
else {
vErrors.push(err102);
}
errors++;
}
}
if(data36.byte_size !== undefined){
let data40 = data36.byte_size;
if(!(((typeof data40 == "number") && (!(data40 % 1) && !isNaN(data40))) && (isFinite(data40)))){
const err103 = {instancePath:instancePath+"/metadata/artifact/byte_size",schemaPath:"#/properties/metadata/properties/artifact/properties/byte_size/type",keyword:"type",params:{type: "integer"},message:"must be integer"};
if(vErrors === null){
vErrors = [err103];
}
else {
vErrors.push(err103);
}
errors++;
}
if((typeof data40 == "number") && (isFinite(data40))){
if(data40 > 65536 || isNaN(data40)){
const err104 = {instancePath:instancePath+"/metadata/artifact/byte_size",schemaPath:"#/properties/metadata/properties/artifact/properties/byte_size/maximum",keyword:"maximum",params:{comparison: "<=", limit: 65536},message:"must be <= 65536"};
if(vErrors === null){
vErrors = [err104];
}
else {
vErrors.push(err104);
}
errors++;
}
if(data40 < 1 || isNaN(data40)){
const err105 = {instancePath:instancePath+"/metadata/artifact/byte_size",schemaPath:"#/properties/metadata/properties/artifact/properties/byte_size/minimum",keyword:"minimum",params:{comparison: ">=", limit: 1},message:"must be >= 1"};
if(vErrors === null){
vErrors = [err105];
}
else {
vErrors.push(err105);
}
errors++;
}
}
}
}
else {
const err106 = {instancePath:instancePath+"/metadata/artifact",schemaPath:"#/properties/metadata/properties/artifact/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err106];
}
else {
vErrors.push(err106);
}
errors++;
}
}
}
else {
const err107 = {instancePath:instancePath+"/metadata",schemaPath:"#/properties/metadata/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err107];
}
else {
vErrors.push(err107);
}
errors++;
}
}
if(data.observations !== undefined){
let data41 = data.observations;
if(Array.isArray(data41)){
if(data41.length > 3){
const err108 = {instancePath:instancePath+"/observations",schemaPath:"#/properties/observations/maxItems",keyword:"maxItems",params:{limit: 3},message:"must NOT have more than 3 items"};
if(vErrors === null){
vErrors = [err108];
}
else {
vErrors.push(err108);
}
errors++;
}
if(data41.length < 3){
const err109 = {instancePath:instancePath+"/observations",schemaPath:"#/properties/observations/minItems",keyword:"minItems",params:{limit: 3},message:"must NOT have fewer than 3 items"};
if(vErrors === null){
vErrors = [err109];
}
else {
vErrors.push(err109);
}
errors++;
}
const len2 = data41.length;
for(let i2=0; i2<len2; i2++){
let data42 = data41[i2];
if(data42 && typeof data42 == "object" && !Array.isArray(data42)){
if(data42.id === undefined){
const err110 = {instancePath:instancePath+"/observations/" + i2,schemaPath:"#/properties/observations/items/required",keyword:"required",params:{missingProperty: "id"},message:"must have required property '"+"id"+"'"};
if(vErrors === null){
vErrors = [err110];
}
else {
vErrors.push(err110);
}
errors++;
}
if(data42.label === undefined){
const err111 = {instancePath:instancePath+"/observations/" + i2,schemaPath:"#/properties/observations/items/required",keyword:"required",params:{missingProperty: "label"},message:"must have required property '"+"label"+"'"};
if(vErrors === null){
vErrors = [err111];
}
else {
vErrors.push(err111);
}
errors++;
}
if(data42.scene_id === undefined){
const err112 = {instancePath:instancePath+"/observations/" + i2,schemaPath:"#/properties/observations/items/required",keyword:"required",params:{missingProperty: "scene_id"},message:"must have required property '"+"scene_id"+"'"};
if(vErrors === null){
vErrors = [err112];
}
else {
vErrors.push(err112);
}
errors++;
}
if(data42.acquired_at === undefined){
const err113 = {instancePath:instancePath+"/observations/" + i2,schemaPath:"#/properties/observations/items/required",keyword:"required",params:{missingProperty: "acquired_at"},message:"must have required property '"+"acquired_at"+"'"};
if(vErrors === null){
vErrors = [err113];
}
else {
vErrors.push(err113);
}
errors++;
}
if(data42.cloud_percent === undefined){
const err114 = {instancePath:instancePath+"/observations/" + i2,schemaPath:"#/properties/observations/items/required",keyword:"required",params:{missingProperty: "cloud_percent"},message:"must have required property '"+"cloud_percent"+"'"};
if(vErrors === null){
vErrors = [err114];
}
else {
vErrors.push(err114);
}
errors++;
}
if(data42.nodata_percent === undefined){
const err115 = {instancePath:instancePath+"/observations/" + i2,schemaPath:"#/properties/observations/items/required",keyword:"required",params:{missingProperty: "nodata_percent"},message:"must have required property '"+"nodata_percent"+"'"};
if(vErrors === null){
vErrors = [err115];
}
else {
vErrors.push(err115);
}
errors++;
}
if(data42.snow_ice_percent === undefined){
const err116 = {instancePath:instancePath+"/observations/" + i2,schemaPath:"#/properties/observations/items/required",keyword:"required",params:{missingProperty: "snow_ice_percent"},message:"must have required property '"+"snow_ice_percent"+"'"};
if(vErrors === null){
vErrors = [err116];
}
else {
vErrors.push(err116);
}
errors++;
}
if(data42.source_crs === undefined){
const err117 = {instancePath:instancePath+"/observations/" + i2,schemaPath:"#/properties/observations/items/required",keyword:"required",params:{missingProperty: "source_crs"},message:"must have required property '"+"source_crs"+"'"};
if(vErrors === null){
vErrors = [err117];
}
else {
vErrors.push(err117);
}
errors++;
}
if(data42.source_resolution_m === undefined){
const err118 = {instancePath:instancePath+"/observations/" + i2,schemaPath:"#/properties/observations/items/required",keyword:"required",params:{missingProperty: "source_resolution_m"},message:"must have required property '"+"source_resolution_m"+"'"};
if(vErrors === null){
vErrors = [err118];
}
else {
vErrors.push(err118);
}
errors++;
}
if(data42.source_asset === undefined){
const err119 = {instancePath:instancePath+"/observations/" + i2,schemaPath:"#/properties/observations/items/required",keyword:"required",params:{missingProperty: "source_asset"},message:"must have required property '"+"source_asset"+"'"};
if(vErrors === null){
vErrors = [err119];
}
else {
vErrors.push(err119);
}
errors++;
}
if(data42.source_scl === undefined){
const err120 = {instancePath:instancePath+"/observations/" + i2,schemaPath:"#/properties/observations/items/required",keyword:"required",params:{missingProperty: "source_scl"},message:"must have required property '"+"source_scl"+"'"};
if(vErrors === null){
vErrors = [err120];
}
else {
vErrors.push(err120);
}
errors++;
}
if(data42.source_etag === undefined){
const err121 = {instancePath:instancePath+"/observations/" + i2,schemaPath:"#/properties/observations/items/required",keyword:"required",params:{missingProperty: "source_etag"},message:"must have required property '"+"source_etag"+"'"};
if(vErrors === null){
vErrors = [err121];
}
else {
vErrors.push(err121);
}
errors++;
}
if(data42.source_byte_size === undefined){
const err122 = {instancePath:instancePath+"/observations/" + i2,schemaPath:"#/properties/observations/items/required",keyword:"required",params:{missingProperty: "source_byte_size"},message:"must have required property '"+"source_byte_size"+"'"};
if(vErrors === null){
vErrors = [err122];
}
else {
vErrors.push(err122);
}
errors++;
}
if(data42.image === undefined){
const err123 = {instancePath:instancePath+"/observations/" + i2,schemaPath:"#/properties/observations/items/required",keyword:"required",params:{missingProperty: "image"},message:"must have required property '"+"image"+"'"};
if(vErrors === null){
vErrors = [err123];
}
else {
vErrors.push(err123);
}
errors++;
}
if(data42.coordinates === undefined){
const err124 = {instancePath:instancePath+"/observations/" + i2,schemaPath:"#/properties/observations/items/required",keyword:"required",params:{missingProperty: "coordinates"},message:"must have required property '"+"coordinates"+"'"};
if(vErrors === null){
vErrors = [err124];
}
else {
vErrors.push(err124);
}
errors++;
}
for(const key6 in data42){
if(!(func2.call(schema11.properties.observations.items.properties, key6))){
const err125 = {instancePath:instancePath+"/observations/" + i2,schemaPath:"#/properties/observations/items/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key6},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err125];
}
else {
vErrors.push(err125);
}
errors++;
}
}
if(data42.id !== undefined){
let data43 = data42.id;
if(!(((data43 === "west") || (data43 === "central")) || (data43 === "east"))){
const err126 = {instancePath:instancePath+"/observations/" + i2+"/id",schemaPath:"#/properties/observations/items/properties/id/enum",keyword:"enum",params:{allowedValues: schema11.properties.observations.items.properties.id.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err126];
}
else {
vErrors.push(err126);
}
errors++;
}
}
if(data42.label !== undefined){
let data44 = data42.label;
if(typeof data44 === "string"){
if(func3(data44) < 1){
const err127 = {instancePath:instancePath+"/observations/" + i2+"/label",schemaPath:"#/properties/observations/items/properties/label/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
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
const err128 = {instancePath:instancePath+"/observations/" + i2+"/label",schemaPath:"#/properties/observations/items/properties/label/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err128];
}
else {
vErrors.push(err128);
}
errors++;
}
}
if(data42.scene_id !== undefined){
let data45 = data42.scene_id;
if(typeof data45 === "string"){
if(func3(data45) < 1){
const err129 = {instancePath:instancePath+"/observations/" + i2+"/scene_id",schemaPath:"#/properties/observations/items/properties/scene_id/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err129];
}
else {
vErrors.push(err129);
}
errors++;
}
}
else {
const err130 = {instancePath:instancePath+"/observations/" + i2+"/scene_id",schemaPath:"#/properties/observations/items/properties/scene_id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err130];
}
else {
vErrors.push(err130);
}
errors++;
}
}
if(data42.acquired_at !== undefined){
let data46 = data42.acquired_at;
if(typeof data46 === "string"){
if(!(formats4.validate(data46))){
const err131 = {instancePath:instancePath+"/observations/" + i2+"/acquired_at",schemaPath:"#/properties/observations/items/properties/acquired_at/format",keyword:"format",params:{format: "date-time"},message:"must match format \""+"date-time"+"\""};
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
const err132 = {instancePath:instancePath+"/observations/" + i2+"/acquired_at",schemaPath:"#/properties/observations/items/properties/acquired_at/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err132];
}
else {
vErrors.push(err132);
}
errors++;
}
}
if(data42.cloud_percent !== undefined){
let data47 = data42.cloud_percent;
if((typeof data47 == "number") && (isFinite(data47))){
if(data47 > 100 || isNaN(data47)){
const err133 = {instancePath:instancePath+"/observations/" + i2+"/cloud_percent",schemaPath:"#/properties/observations/items/properties/cloud_percent/maximum",keyword:"maximum",params:{comparison: "<=", limit: 100},message:"must be <= 100"};
if(vErrors === null){
vErrors = [err133];
}
else {
vErrors.push(err133);
}
errors++;
}
if(data47 < 0 || isNaN(data47)){
const err134 = {instancePath:instancePath+"/observations/" + i2+"/cloud_percent",schemaPath:"#/properties/observations/items/properties/cloud_percent/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
if(vErrors === null){
vErrors = [err134];
}
else {
vErrors.push(err134);
}
errors++;
}
}
else {
const err135 = {instancePath:instancePath+"/observations/" + i2+"/cloud_percent",schemaPath:"#/properties/observations/items/properties/cloud_percent/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err135];
}
else {
vErrors.push(err135);
}
errors++;
}
}
if(data42.nodata_percent !== undefined){
let data48 = data42.nodata_percent;
if((typeof data48 == "number") && (isFinite(data48))){
if(data48 > 100 || isNaN(data48)){
const err136 = {instancePath:instancePath+"/observations/" + i2+"/nodata_percent",schemaPath:"#/properties/observations/items/properties/nodata_percent/maximum",keyword:"maximum",params:{comparison: "<=", limit: 100},message:"must be <= 100"};
if(vErrors === null){
vErrors = [err136];
}
else {
vErrors.push(err136);
}
errors++;
}
if(data48 < 0 || isNaN(data48)){
const err137 = {instancePath:instancePath+"/observations/" + i2+"/nodata_percent",schemaPath:"#/properties/observations/items/properties/nodata_percent/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
if(vErrors === null){
vErrors = [err137];
}
else {
vErrors.push(err137);
}
errors++;
}
}
else {
const err138 = {instancePath:instancePath+"/observations/" + i2+"/nodata_percent",schemaPath:"#/properties/observations/items/properties/nodata_percent/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err138];
}
else {
vErrors.push(err138);
}
errors++;
}
}
if(data42.snow_ice_percent !== undefined){
let data49 = data42.snow_ice_percent;
if((typeof data49 == "number") && (isFinite(data49))){
if(data49 > 100 || isNaN(data49)){
const err139 = {instancePath:instancePath+"/observations/" + i2+"/snow_ice_percent",schemaPath:"#/properties/observations/items/properties/snow_ice_percent/maximum",keyword:"maximum",params:{comparison: "<=", limit: 100},message:"must be <= 100"};
if(vErrors === null){
vErrors = [err139];
}
else {
vErrors.push(err139);
}
errors++;
}
if(data49 < 0 || isNaN(data49)){
const err140 = {instancePath:instancePath+"/observations/" + i2+"/snow_ice_percent",schemaPath:"#/properties/observations/items/properties/snow_ice_percent/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
if(vErrors === null){
vErrors = [err140];
}
else {
vErrors.push(err140);
}
errors++;
}
}
else {
const err141 = {instancePath:instancePath+"/observations/" + i2+"/snow_ice_percent",schemaPath:"#/properties/observations/items/properties/snow_ice_percent/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err141];
}
else {
vErrors.push(err141);
}
errors++;
}
}
if(data42.source_crs !== undefined){
let data50 = data42.source_crs;
if(typeof data50 === "string"){
if(!pattern1.test(data50)){
const err142 = {instancePath:instancePath+"/observations/" + i2+"/source_crs",schemaPath:"#/properties/observations/items/properties/source_crs/pattern",keyword:"pattern",params:{pattern: "^EPSG:[0-9]+$"},message:"must match pattern \""+"^EPSG:[0-9]+$"+"\""};
if(vErrors === null){
vErrors = [err142];
}
else {
vErrors.push(err142);
}
errors++;
}
}
else {
const err143 = {instancePath:instancePath+"/observations/" + i2+"/source_crs",schemaPath:"#/properties/observations/items/properties/source_crs/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err143];
}
else {
vErrors.push(err143);
}
errors++;
}
}
if(data42.source_resolution_m !== undefined){
if(10 !== data42.source_resolution_m){
const err144 = {instancePath:instancePath+"/observations/" + i2+"/source_resolution_m",schemaPath:"#/properties/observations/items/properties/source_resolution_m/const",keyword:"const",params:{allowedValue: 10},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err144];
}
else {
vErrors.push(err144);
}
errors++;
}
}
if(data42.source_asset !== undefined){
let data52 = data42.source_asset;
if(typeof data52 === "string"){
if(!(formats0(data52))){
const err145 = {instancePath:instancePath+"/observations/" + i2+"/source_asset",schemaPath:"#/properties/observations/items/properties/source_asset/format",keyword:"format",params:{format: "uri"},message:"must match format \""+"uri"+"\""};
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
const err146 = {instancePath:instancePath+"/observations/" + i2+"/source_asset",schemaPath:"#/properties/observations/items/properties/source_asset/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err146];
}
else {
vErrors.push(err146);
}
errors++;
}
}
if(data42.source_scl !== undefined){
let data53 = data42.source_scl;
if(typeof data53 === "string"){
if(!(formats0(data53))){
const err147 = {instancePath:instancePath+"/observations/" + i2+"/source_scl",schemaPath:"#/properties/observations/items/properties/source_scl/format",keyword:"format",params:{format: "uri"},message:"must match format \""+"uri"+"\""};
if(vErrors === null){
vErrors = [err147];
}
else {
vErrors.push(err147);
}
errors++;
}
}
else {
const err148 = {instancePath:instancePath+"/observations/" + i2+"/source_scl",schemaPath:"#/properties/observations/items/properties/source_scl/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err148];
}
else {
vErrors.push(err148);
}
errors++;
}
}
if(data42.source_etag !== undefined){
let data54 = data42.source_etag;
if(typeof data54 === "string"){
if(func3(data54) < 1){
const err149 = {instancePath:instancePath+"/observations/" + i2+"/source_etag",schemaPath:"#/properties/observations/items/properties/source_etag/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err149];
}
else {
vErrors.push(err149);
}
errors++;
}
}
else {
const err150 = {instancePath:instancePath+"/observations/" + i2+"/source_etag",schemaPath:"#/properties/observations/items/properties/source_etag/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err150];
}
else {
vErrors.push(err150);
}
errors++;
}
}
if(data42.source_byte_size !== undefined){
let data55 = data42.source_byte_size;
if(!(((typeof data55 == "number") && (!(data55 % 1) && !isNaN(data55))) && (isFinite(data55)))){
const err151 = {instancePath:instancePath+"/observations/" + i2+"/source_byte_size",schemaPath:"#/properties/observations/items/properties/source_byte_size/type",keyword:"type",params:{type: "integer"},message:"must be integer"};
if(vErrors === null){
vErrors = [err151];
}
else {
vErrors.push(err151);
}
errors++;
}
if((typeof data55 == "number") && (isFinite(data55))){
if(data55 < 1 || isNaN(data55)){
const err152 = {instancePath:instancePath+"/observations/" + i2+"/source_byte_size",schemaPath:"#/properties/observations/items/properties/source_byte_size/minimum",keyword:"minimum",params:{comparison: ">=", limit: 1},message:"must be >= 1"};
if(vErrors === null){
vErrors = [err152];
}
else {
vErrors.push(err152);
}
errors++;
}
}
}
if(data42.image !== undefined){
let data56 = data42.image;
if(data56 && typeof data56 == "object" && !Array.isArray(data56)){
if(data56.path === undefined){
const err153 = {instancePath:instancePath+"/observations/" + i2+"/image",schemaPath:"#/properties/observations/items/properties/image/required",keyword:"required",params:{missingProperty: "path"},message:"must have required property '"+"path"+"'"};
if(vErrors === null){
vErrors = [err153];
}
else {
vErrors.push(err153);
}
errors++;
}
if(data56.sha256 === undefined){
const err154 = {instancePath:instancePath+"/observations/" + i2+"/image",schemaPath:"#/properties/observations/items/properties/image/required",keyword:"required",params:{missingProperty: "sha256"},message:"must have required property '"+"sha256"+"'"};
if(vErrors === null){
vErrors = [err154];
}
else {
vErrors.push(err154);
}
errors++;
}
if(data56.byte_size === undefined){
const err155 = {instancePath:instancePath+"/observations/" + i2+"/image",schemaPath:"#/properties/observations/items/properties/image/required",keyword:"required",params:{missingProperty: "byte_size"},message:"must have required property '"+"byte_size"+"'"};
if(vErrors === null){
vErrors = [err155];
}
else {
vErrors.push(err155);
}
errors++;
}
if(data56.width === undefined){
const err156 = {instancePath:instancePath+"/observations/" + i2+"/image",schemaPath:"#/properties/observations/items/properties/image/required",keyword:"required",params:{missingProperty: "width"},message:"must have required property '"+"width"+"'"};
if(vErrors === null){
vErrors = [err156];
}
else {
vErrors.push(err156);
}
errors++;
}
if(data56.height === undefined){
const err157 = {instancePath:instancePath+"/observations/" + i2+"/image",schemaPath:"#/properties/observations/items/properties/image/required",keyword:"required",params:{missingProperty: "height"},message:"must have required property '"+"height"+"'"};
if(vErrors === null){
vErrors = [err157];
}
else {
vErrors.push(err157);
}
errors++;
}
for(const key7 in data56){
if(!(((((key7 === "path") || (key7 === "sha256")) || (key7 === "byte_size")) || (key7 === "width")) || (key7 === "height"))){
const err158 = {instancePath:instancePath+"/observations/" + i2+"/image",schemaPath:"#/properties/observations/items/properties/image/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key7},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err158];
}
else {
vErrors.push(err158);
}
errors++;
}
}
if(data56.path !== undefined){
let data57 = data56.path;
if(typeof data57 === "string"){
if(!pattern2.test(data57)){
const err159 = {instancePath:instancePath+"/observations/" + i2+"/image/path",schemaPath:"#/properties/observations/items/properties/image/properties/path/pattern",keyword:"pattern",params:{pattern: "^/data/nepal-sentinel-observations/1.0.0/(west|central|east)\\.png$"},message:"must match pattern \""+"^/data/nepal-sentinel-observations/1.0.0/(west|central|east)\\.png$"+"\""};
if(vErrors === null){
vErrors = [err159];
}
else {
vErrors.push(err159);
}
errors++;
}
}
else {
const err160 = {instancePath:instancePath+"/observations/" + i2+"/image/path",schemaPath:"#/properties/observations/items/properties/image/properties/path/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err160];
}
else {
vErrors.push(err160);
}
errors++;
}
}
if(data56.sha256 !== undefined){
let data58 = data56.sha256;
if(typeof data58 === "string"){
if(!pattern0.test(data58)){
const err161 = {instancePath:instancePath+"/observations/" + i2+"/image/sha256",schemaPath:"#/properties/observations/items/properties/image/properties/sha256/pattern",keyword:"pattern",params:{pattern: "^[a-f0-9]{64}$"},message:"must match pattern \""+"^[a-f0-9]{64}$"+"\""};
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
const err162 = {instancePath:instancePath+"/observations/" + i2+"/image/sha256",schemaPath:"#/properties/observations/items/properties/image/properties/sha256/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err162];
}
else {
vErrors.push(err162);
}
errors++;
}
}
if(data56.byte_size !== undefined){
let data59 = data56.byte_size;
if(!(((typeof data59 == "number") && (!(data59 % 1) && !isNaN(data59))) && (isFinite(data59)))){
const err163 = {instancePath:instancePath+"/observations/" + i2+"/image/byte_size",schemaPath:"#/properties/observations/items/properties/image/properties/byte_size/type",keyword:"type",params:{type: "integer"},message:"must be integer"};
if(vErrors === null){
vErrors = [err163];
}
else {
vErrors.push(err163);
}
errors++;
}
if((typeof data59 == "number") && (isFinite(data59))){
if(data59 > 4194304 || isNaN(data59)){
const err164 = {instancePath:instancePath+"/observations/" + i2+"/image/byte_size",schemaPath:"#/properties/observations/items/properties/image/properties/byte_size/maximum",keyword:"maximum",params:{comparison: "<=", limit: 4194304},message:"must be <= 4194304"};
if(vErrors === null){
vErrors = [err164];
}
else {
vErrors.push(err164);
}
errors++;
}
if(data59 < 1 || isNaN(data59)){
const err165 = {instancePath:instancePath+"/observations/" + i2+"/image/byte_size",schemaPath:"#/properties/observations/items/properties/image/properties/byte_size/minimum",keyword:"minimum",params:{comparison: ">=", limit: 1},message:"must be >= 1"};
if(vErrors === null){
vErrors = [err165];
}
else {
vErrors.push(err165);
}
errors++;
}
}
}
if(data56.width !== undefined){
if(768 !== data56.width){
const err166 = {instancePath:instancePath+"/observations/" + i2+"/image/width",schemaPath:"#/properties/observations/items/properties/image/properties/width/const",keyword:"const",params:{allowedValue: 768},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err166];
}
else {
vErrors.push(err166);
}
errors++;
}
}
if(data56.height !== undefined){
if(768 !== data56.height){
const err167 = {instancePath:instancePath+"/observations/" + i2+"/image/height",schemaPath:"#/properties/observations/items/properties/image/properties/height/const",keyword:"const",params:{allowedValue: 768},message:"must be equal to constant"};
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
const err168 = {instancePath:instancePath+"/observations/" + i2+"/image",schemaPath:"#/properties/observations/items/properties/image/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err168];
}
else {
vErrors.push(err168);
}
errors++;
}
}
if(data42.coordinates !== undefined){
let data62 = data42.coordinates;
if(Array.isArray(data62)){
if(data62.length > 4){
const err169 = {instancePath:instancePath+"/observations/" + i2+"/coordinates",schemaPath:"#/properties/observations/items/properties/coordinates/maxItems",keyword:"maxItems",params:{limit: 4},message:"must NOT have more than 4 items"};
if(vErrors === null){
vErrors = [err169];
}
else {
vErrors.push(err169);
}
errors++;
}
if(data62.length < 4){
const err170 = {instancePath:instancePath+"/observations/" + i2+"/coordinates",schemaPath:"#/properties/observations/items/properties/coordinates/minItems",keyword:"minItems",params:{limit: 4},message:"must NOT have fewer than 4 items"};
if(vErrors === null){
vErrors = [err170];
}
else {
vErrors.push(err170);
}
errors++;
}
const len3 = data62.length;
for(let i3=0; i3<len3; i3++){
let data63 = data62[i3];
if(Array.isArray(data63)){
if(data63.length > 2){
const err171 = {instancePath:instancePath+"/observations/" + i2+"/coordinates/" + i3,schemaPath:"#/properties/observations/items/properties/coordinates/items/maxItems",keyword:"maxItems",params:{limit: 2},message:"must NOT have more than 2 items"};
if(vErrors === null){
vErrors = [err171];
}
else {
vErrors.push(err171);
}
errors++;
}
if(data63.length < 2){
const err172 = {instancePath:instancePath+"/observations/" + i2+"/coordinates/" + i3,schemaPath:"#/properties/observations/items/properties/coordinates/items/minItems",keyword:"minItems",params:{limit: 2},message:"must NOT have fewer than 2 items"};
if(vErrors === null){
vErrors = [err172];
}
else {
vErrors.push(err172);
}
errors++;
}
const len4 = data63.length;
for(let i4=0; i4<len4; i4++){
let data64 = data63[i4];
if(!((typeof data64 == "number") && (isFinite(data64)))){
const err173 = {instancePath:instancePath+"/observations/" + i2+"/coordinates/" + i3+"/" + i4,schemaPath:"#/properties/observations/items/properties/coordinates/items/items/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err173];
}
else {
vErrors.push(err173);
}
errors++;
}
}
}
else {
const err174 = {instancePath:instancePath+"/observations/" + i2+"/coordinates/" + i3,schemaPath:"#/properties/observations/items/properties/coordinates/items/type",keyword:"type",params:{type: "array"},message:"must be array"};
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
else {
const err175 = {instancePath:instancePath+"/observations/" + i2+"/coordinates",schemaPath:"#/properties/observations/items/properties/coordinates/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err175];
}
else {
vErrors.push(err175);
}
errors++;
}
}
}
else {
const err176 = {instancePath:instancePath+"/observations/" + i2,schemaPath:"#/properties/observations/items/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err176];
}
else {
vErrors.push(err176);
}
errors++;
}
}
}
else {
const err177 = {instancePath:instancePath+"/observations",schemaPath:"#/properties/observations/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err177];
}
else {
vErrors.push(err177);
}
errors++;
}
}
}
else {
const err178 = {instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err178];
}
else {
vErrors.push(err178);
}
errors++;
}
validate10.errors = vErrors;
return errors === 0;
}

