// Generated from climate.schema.json; run npm run contracts:generate. Do not edit.
"use strict";
module.exports = validate10;
module.exports.default = validate10;
const schema11 = {"$schema":"http://json-schema.org/draft-07/schema#","$id":"https://himalayan-disaster-atlas.invalid/schemas/climate.schema.json","type":"object","additionalProperties":false,"required":["metadata","product","series","normals"],"properties":{"metadata":{"type":"object","additionalProperties":false,"required":["schema_version","dataset_id","dataset_name","dataset_version","source","source_url","license","license_url","attribution","observation_date","publication_date","retrieval_date","processing_date","processing_version","method","spatial_resolution","temporal_resolution","spatial_coverage","temporal_coverage","crs","status","evidence_type","is_fixture","limitations","uncertainty","update_frequency","stale_after","artifact"],"properties":{"schema_version":{"const":"4.0.0"},"dataset_id":{"const":"nepal-power-climate"},"dataset_name":{"type":"string","minLength":1},"dataset_version":{"const":"1.0.0"},"source":{"type":"string","minLength":1},"source_url":{"type":"string","format":"uri"},"license":{"type":"string","minLength":1},"license_url":{"type":"string","format":"uri"},"attribution":{"type":"string","minLength":1},"observation_date":{"type":"null"},"publication_date":{"type":"null"},"retrieval_date":{"type":"string","format":"date-time"},"processing_date":{"type":"string","format":"date-time"},"processing_version":{"type":"string","minLength":1},"method":{"type":"string","minLength":1},"spatial_resolution":{"type":"object","additionalProperties":false,"required":["value","unit"],"properties":{"value":{"const":0.5},"unit":{"const":"degree"}}},"temporal_resolution":{"const":"monthly"},"spatial_coverage":{"type":"object","additionalProperties":false,"required":["description","bbox"],"properties":{"description":{"type":"string","minLength":1},"bbox":{"type":"array","items":{"type":"number"},"minItems":4,"maxItems":4}}},"temporal_coverage":{"type":"object","additionalProperties":false,"required":["start","end"],"properties":{"start":{"const":"1991-01-01T00:00:00Z"},"end":{"const":"2020-12-31T23:59:59Z"}}},"crs":{"const":"OGC:CRS84"},"status":{"const":"ATLAS_DERIVED"},"evidence_type":{"const":"derived"},"is_fixture":{"const":false},"limitations":{"type":"array","items":{"type":"string","minLength":1},"minItems":1},"uncertainty":{"type":"string","minLength":1},"update_frequency":{"const":"static"},"stale_after":{"type":"null"},"artifact":{"type":"object","additionalProperties":false,"required":["path","format","sha256","byte_size"],"properties":{"path":{"const":"/data/nepal-power-climate/1.0.0/series.json"},"format":{"const":"ClimateSeries"},"sha256":{"type":"string","pattern":"^[a-f0-9]{64}$"},"byte_size":{"type":"integer","minimum":1,"maximum":262144}}}}},"product":{"type":"object","additionalProperties":false,"required":["provider","product_type","source_model","api_version","time_standard","baseline","native_grid","source_grid_points","contributing_grid_cells","boundary_source","boundary_sha256","variables"],"properties":{"provider":{"const":"NASA POWER"},"product_type":{"const":"reanalysis-derived"},"source_model":{"const":"MERRA-2"},"api_version":{"const":"v2.9.8"},"time_standard":{"const":"UTC"},"baseline":{"const":"1991-2020"},"native_grid":{"type":"object","additionalProperties":false,"required":["latitude_degrees","longitude_degrees"],"properties":{"latitude_degrees":{"const":0.5},"longitude_degrees":{"const":0.625}}},"source_grid_points":{"const":165},"contributing_grid_cells":{"type":"integer","minimum":1,"maximum":165},"boundary_source":{"const":"Nepal COD-AB v02 unsimplified admin0"},"boundary_sha256":{"const":"9f6713c41d65396f611ddce5879faecf8e2d494edbd1d6611612445ad46b6707"},"variables":{"type":"array","minItems":2,"maxItems":2,"items":{"type":"object","additionalProperties":false,"required":["id","label","source_unit","published_unit"],"properties":{"id":{"enum":["T2M","PRECTOTCORR"]},"label":{"type":"string","minLength":1},"source_unit":{"enum":["C","mm/day"]},"published_unit":{"enum":["degC","mm/day"]}}}}}},"series":{"type":"array","minItems":360,"maxItems":360,"items":{"type":"object","additionalProperties":false,"required":["period","year","month","temperature_c","precipitation_mm_day","coverage_percent"],"properties":{"period":{"type":"string","pattern":"^(19[9][1-9]|200[0-9]|201[0-9]|2020)-(0[1-9]|1[0-2])$"},"year":{"type":"integer","minimum":1991,"maximum":2020},"month":{"type":"integer","minimum":1,"maximum":12},"temperature_c":{"type":"number","minimum":-90,"maximum":60},"precipitation_mm_day":{"type":"number","minimum":0,"maximum":100},"coverage_percent":{"type":"number","minimum":0,"maximum":100}}}},"normals":{"type":"array","minItems":12,"maxItems":12,"items":{"type":"object","additionalProperties":false,"required":["month","temperature_c","precipitation_mm_day","temperature_min_c","temperature_max_c","precipitation_min_mm_day","precipitation_max_mm_day","years"],"properties":{"month":{"type":"integer","minimum":1,"maximum":12},"temperature_c":{"type":"number","minimum":-90,"maximum":60},"precipitation_mm_day":{"type":"number","minimum":0,"maximum":100},"temperature_min_c":{"type":"number","minimum":-90,"maximum":60},"temperature_max_c":{"type":"number","minimum":-90,"maximum":60},"precipitation_min_mm_day":{"type":"number","minimum":0,"maximum":100},"precipitation_max_mm_day":{"type":"number","minimum":0,"maximum":100},"years":{"const":30}}}}}};
const func2 = Object.prototype.hasOwnProperty;
const func3 = require("ajv/dist/runtime/ucs2length").default;
const formats0 = require("ajv-formats/dist/formats").fullFormats.uri;
const formats4 = require("ajv-formats/dist/formats").fullFormats["date-time"];
const pattern0 = new RegExp("^[a-f0-9]{64}$", "u");
const pattern1 = new RegExp("^(19[9][1-9]|200[0-9]|201[0-9]|2020)-(0[1-9]|1[0-2])$", "u");

function validate10(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
/*# sourceURL="https://himalayan-disaster-atlas.invalid/schemas/climate.schema.json" */;
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
if(data.product === undefined){
const err1 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "product"},message:"must have required property '"+"product"+"'"};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
if(data.series === undefined){
const err2 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "series"},message:"must have required property '"+"series"+"'"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
if(data.normals === undefined){
const err3 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "normals"},message:"must have required property '"+"normals"+"'"};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
for(const key0 in data){
if(!((((key0 === "metadata") || (key0 === "product")) || (key0 === "series")) || (key0 === "normals"))){
const err4 = {instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
}
if(data.metadata !== undefined){
let data0 = data.metadata;
if(data0 && typeof data0 == "object" && !Array.isArray(data0)){
if(data0.schema_version === undefined){
const err5 = {instancePath:instancePath+"/metadata",schemaPath:"#/properties/metadata/required",keyword:"required",params:{missingProperty: "schema_version"},message:"must have required property '"+"schema_version"+"'"};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
if(data0.dataset_id === undefined){
const err6 = {instancePath:instancePath+"/metadata",schemaPath:"#/properties/metadata/required",keyword:"required",params:{missingProperty: "dataset_id"},message:"must have required property '"+"dataset_id"+"'"};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
if(data0.dataset_name === undefined){
const err7 = {instancePath:instancePath+"/metadata",schemaPath:"#/properties/metadata/required",keyword:"required",params:{missingProperty: "dataset_name"},message:"must have required property '"+"dataset_name"+"'"};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
}
if(data0.dataset_version === undefined){
const err8 = {instancePath:instancePath+"/metadata",schemaPath:"#/properties/metadata/required",keyword:"required",params:{missingProperty: "dataset_version"},message:"must have required property '"+"dataset_version"+"'"};
if(vErrors === null){
vErrors = [err8];
}
else {
vErrors.push(err8);
}
errors++;
}
if(data0.source === undefined){
const err9 = {instancePath:instancePath+"/metadata",schemaPath:"#/properties/metadata/required",keyword:"required",params:{missingProperty: "source"},message:"must have required property '"+"source"+"'"};
if(vErrors === null){
vErrors = [err9];
}
else {
vErrors.push(err9);
}
errors++;
}
if(data0.source_url === undefined){
const err10 = {instancePath:instancePath+"/metadata",schemaPath:"#/properties/metadata/required",keyword:"required",params:{missingProperty: "source_url"},message:"must have required property '"+"source_url"+"'"};
if(vErrors === null){
vErrors = [err10];
}
else {
vErrors.push(err10);
}
errors++;
}
if(data0.license === undefined){
const err11 = {instancePath:instancePath+"/metadata",schemaPath:"#/properties/metadata/required",keyword:"required",params:{missingProperty: "license"},message:"must have required property '"+"license"+"'"};
if(vErrors === null){
vErrors = [err11];
}
else {
vErrors.push(err11);
}
errors++;
}
if(data0.license_url === undefined){
const err12 = {instancePath:instancePath+"/metadata",schemaPath:"#/properties/metadata/required",keyword:"required",params:{missingProperty: "license_url"},message:"must have required property '"+"license_url"+"'"};
if(vErrors === null){
vErrors = [err12];
}
else {
vErrors.push(err12);
}
errors++;
}
if(data0.attribution === undefined){
const err13 = {instancePath:instancePath+"/metadata",schemaPath:"#/properties/metadata/required",keyword:"required",params:{missingProperty: "attribution"},message:"must have required property '"+"attribution"+"'"};
if(vErrors === null){
vErrors = [err13];
}
else {
vErrors.push(err13);
}
errors++;
}
if(data0.observation_date === undefined){
const err14 = {instancePath:instancePath+"/metadata",schemaPath:"#/properties/metadata/required",keyword:"required",params:{missingProperty: "observation_date"},message:"must have required property '"+"observation_date"+"'"};
if(vErrors === null){
vErrors = [err14];
}
else {
vErrors.push(err14);
}
errors++;
}
if(data0.publication_date === undefined){
const err15 = {instancePath:instancePath+"/metadata",schemaPath:"#/properties/metadata/required",keyword:"required",params:{missingProperty: "publication_date"},message:"must have required property '"+"publication_date"+"'"};
if(vErrors === null){
vErrors = [err15];
}
else {
vErrors.push(err15);
}
errors++;
}
if(data0.retrieval_date === undefined){
const err16 = {instancePath:instancePath+"/metadata",schemaPath:"#/properties/metadata/required",keyword:"required",params:{missingProperty: "retrieval_date"},message:"must have required property '"+"retrieval_date"+"'"};
if(vErrors === null){
vErrors = [err16];
}
else {
vErrors.push(err16);
}
errors++;
}
if(data0.processing_date === undefined){
const err17 = {instancePath:instancePath+"/metadata",schemaPath:"#/properties/metadata/required",keyword:"required",params:{missingProperty: "processing_date"},message:"must have required property '"+"processing_date"+"'"};
if(vErrors === null){
vErrors = [err17];
}
else {
vErrors.push(err17);
}
errors++;
}
if(data0.processing_version === undefined){
const err18 = {instancePath:instancePath+"/metadata",schemaPath:"#/properties/metadata/required",keyword:"required",params:{missingProperty: "processing_version"},message:"must have required property '"+"processing_version"+"'"};
if(vErrors === null){
vErrors = [err18];
}
else {
vErrors.push(err18);
}
errors++;
}
if(data0.method === undefined){
const err19 = {instancePath:instancePath+"/metadata",schemaPath:"#/properties/metadata/required",keyword:"required",params:{missingProperty: "method"},message:"must have required property '"+"method"+"'"};
if(vErrors === null){
vErrors = [err19];
}
else {
vErrors.push(err19);
}
errors++;
}
if(data0.spatial_resolution === undefined){
const err20 = {instancePath:instancePath+"/metadata",schemaPath:"#/properties/metadata/required",keyword:"required",params:{missingProperty: "spatial_resolution"},message:"must have required property '"+"spatial_resolution"+"'"};
if(vErrors === null){
vErrors = [err20];
}
else {
vErrors.push(err20);
}
errors++;
}
if(data0.temporal_resolution === undefined){
const err21 = {instancePath:instancePath+"/metadata",schemaPath:"#/properties/metadata/required",keyword:"required",params:{missingProperty: "temporal_resolution"},message:"must have required property '"+"temporal_resolution"+"'"};
if(vErrors === null){
vErrors = [err21];
}
else {
vErrors.push(err21);
}
errors++;
}
if(data0.spatial_coverage === undefined){
const err22 = {instancePath:instancePath+"/metadata",schemaPath:"#/properties/metadata/required",keyword:"required",params:{missingProperty: "spatial_coverage"},message:"must have required property '"+"spatial_coverage"+"'"};
if(vErrors === null){
vErrors = [err22];
}
else {
vErrors.push(err22);
}
errors++;
}
if(data0.temporal_coverage === undefined){
const err23 = {instancePath:instancePath+"/metadata",schemaPath:"#/properties/metadata/required",keyword:"required",params:{missingProperty: "temporal_coverage"},message:"must have required property '"+"temporal_coverage"+"'"};
if(vErrors === null){
vErrors = [err23];
}
else {
vErrors.push(err23);
}
errors++;
}
if(data0.crs === undefined){
const err24 = {instancePath:instancePath+"/metadata",schemaPath:"#/properties/metadata/required",keyword:"required",params:{missingProperty: "crs"},message:"must have required property '"+"crs"+"'"};
if(vErrors === null){
vErrors = [err24];
}
else {
vErrors.push(err24);
}
errors++;
}
if(data0.status === undefined){
const err25 = {instancePath:instancePath+"/metadata",schemaPath:"#/properties/metadata/required",keyword:"required",params:{missingProperty: "status"},message:"must have required property '"+"status"+"'"};
if(vErrors === null){
vErrors = [err25];
}
else {
vErrors.push(err25);
}
errors++;
}
if(data0.evidence_type === undefined){
const err26 = {instancePath:instancePath+"/metadata",schemaPath:"#/properties/metadata/required",keyword:"required",params:{missingProperty: "evidence_type"},message:"must have required property '"+"evidence_type"+"'"};
if(vErrors === null){
vErrors = [err26];
}
else {
vErrors.push(err26);
}
errors++;
}
if(data0.is_fixture === undefined){
const err27 = {instancePath:instancePath+"/metadata",schemaPath:"#/properties/metadata/required",keyword:"required",params:{missingProperty: "is_fixture"},message:"must have required property '"+"is_fixture"+"'"};
if(vErrors === null){
vErrors = [err27];
}
else {
vErrors.push(err27);
}
errors++;
}
if(data0.limitations === undefined){
const err28 = {instancePath:instancePath+"/metadata",schemaPath:"#/properties/metadata/required",keyword:"required",params:{missingProperty: "limitations"},message:"must have required property '"+"limitations"+"'"};
if(vErrors === null){
vErrors = [err28];
}
else {
vErrors.push(err28);
}
errors++;
}
if(data0.uncertainty === undefined){
const err29 = {instancePath:instancePath+"/metadata",schemaPath:"#/properties/metadata/required",keyword:"required",params:{missingProperty: "uncertainty"},message:"must have required property '"+"uncertainty"+"'"};
if(vErrors === null){
vErrors = [err29];
}
else {
vErrors.push(err29);
}
errors++;
}
if(data0.update_frequency === undefined){
const err30 = {instancePath:instancePath+"/metadata",schemaPath:"#/properties/metadata/required",keyword:"required",params:{missingProperty: "update_frequency"},message:"must have required property '"+"update_frequency"+"'"};
if(vErrors === null){
vErrors = [err30];
}
else {
vErrors.push(err30);
}
errors++;
}
if(data0.stale_after === undefined){
const err31 = {instancePath:instancePath+"/metadata",schemaPath:"#/properties/metadata/required",keyword:"required",params:{missingProperty: "stale_after"},message:"must have required property '"+"stale_after"+"'"};
if(vErrors === null){
vErrors = [err31];
}
else {
vErrors.push(err31);
}
errors++;
}
if(data0.artifact === undefined){
const err32 = {instancePath:instancePath+"/metadata",schemaPath:"#/properties/metadata/required",keyword:"required",params:{missingProperty: "artifact"},message:"must have required property '"+"artifact"+"'"};
if(vErrors === null){
vErrors = [err32];
}
else {
vErrors.push(err32);
}
errors++;
}
for(const key1 in data0){
if(!(func2.call(schema11.properties.metadata.properties, key1))){
const err33 = {instancePath:instancePath+"/metadata",schemaPath:"#/properties/metadata/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key1},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err33];
}
else {
vErrors.push(err33);
}
errors++;
}
}
if(data0.schema_version !== undefined){
if("4.0.0" !== data0.schema_version){
const err34 = {instancePath:instancePath+"/metadata/schema_version",schemaPath:"#/properties/metadata/properties/schema_version/const",keyword:"const",params:{allowedValue: "4.0.0"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err34];
}
else {
vErrors.push(err34);
}
errors++;
}
}
if(data0.dataset_id !== undefined){
if("nepal-power-climate" !== data0.dataset_id){
const err35 = {instancePath:instancePath+"/metadata/dataset_id",schemaPath:"#/properties/metadata/properties/dataset_id/const",keyword:"const",params:{allowedValue: "nepal-power-climate"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err35];
}
else {
vErrors.push(err35);
}
errors++;
}
}
if(data0.dataset_name !== undefined){
let data3 = data0.dataset_name;
if(typeof data3 === "string"){
if(func3(data3) < 1){
const err36 = {instancePath:instancePath+"/metadata/dataset_name",schemaPath:"#/properties/metadata/properties/dataset_name/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err36];
}
else {
vErrors.push(err36);
}
errors++;
}
}
else {
const err37 = {instancePath:instancePath+"/metadata/dataset_name",schemaPath:"#/properties/metadata/properties/dataset_name/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err37];
}
else {
vErrors.push(err37);
}
errors++;
}
}
if(data0.dataset_version !== undefined){
if("1.0.0" !== data0.dataset_version){
const err38 = {instancePath:instancePath+"/metadata/dataset_version",schemaPath:"#/properties/metadata/properties/dataset_version/const",keyword:"const",params:{allowedValue: "1.0.0"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err38];
}
else {
vErrors.push(err38);
}
errors++;
}
}
if(data0.source !== undefined){
let data5 = data0.source;
if(typeof data5 === "string"){
if(func3(data5) < 1){
const err39 = {instancePath:instancePath+"/metadata/source",schemaPath:"#/properties/metadata/properties/source/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
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
const err40 = {instancePath:instancePath+"/metadata/source",schemaPath:"#/properties/metadata/properties/source/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err40];
}
else {
vErrors.push(err40);
}
errors++;
}
}
if(data0.source_url !== undefined){
let data6 = data0.source_url;
if(typeof data6 === "string"){
if(!(formats0(data6))){
const err41 = {instancePath:instancePath+"/metadata/source_url",schemaPath:"#/properties/metadata/properties/source_url/format",keyword:"format",params:{format: "uri"},message:"must match format \""+"uri"+"\""};
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
const err42 = {instancePath:instancePath+"/metadata/source_url",schemaPath:"#/properties/metadata/properties/source_url/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err42];
}
else {
vErrors.push(err42);
}
errors++;
}
}
if(data0.license !== undefined){
let data7 = data0.license;
if(typeof data7 === "string"){
if(func3(data7) < 1){
const err43 = {instancePath:instancePath+"/metadata/license",schemaPath:"#/properties/metadata/properties/license/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
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
const err44 = {instancePath:instancePath+"/metadata/license",schemaPath:"#/properties/metadata/properties/license/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err44];
}
else {
vErrors.push(err44);
}
errors++;
}
}
if(data0.license_url !== undefined){
let data8 = data0.license_url;
if(typeof data8 === "string"){
if(!(formats0(data8))){
const err45 = {instancePath:instancePath+"/metadata/license_url",schemaPath:"#/properties/metadata/properties/license_url/format",keyword:"format",params:{format: "uri"},message:"must match format \""+"uri"+"\""};
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
const err46 = {instancePath:instancePath+"/metadata/license_url",schemaPath:"#/properties/metadata/properties/license_url/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err46];
}
else {
vErrors.push(err46);
}
errors++;
}
}
if(data0.attribution !== undefined){
let data9 = data0.attribution;
if(typeof data9 === "string"){
if(func3(data9) < 1){
const err47 = {instancePath:instancePath+"/metadata/attribution",schemaPath:"#/properties/metadata/properties/attribution/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
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
const err48 = {instancePath:instancePath+"/metadata/attribution",schemaPath:"#/properties/metadata/properties/attribution/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err48];
}
else {
vErrors.push(err48);
}
errors++;
}
}
if(data0.observation_date !== undefined){
if(data0.observation_date !== null){
const err49 = {instancePath:instancePath+"/metadata/observation_date",schemaPath:"#/properties/metadata/properties/observation_date/type",keyword:"type",params:{type: "null"},message:"must be null"};
if(vErrors === null){
vErrors = [err49];
}
else {
vErrors.push(err49);
}
errors++;
}
}
if(data0.publication_date !== undefined){
if(data0.publication_date !== null){
const err50 = {instancePath:instancePath+"/metadata/publication_date",schemaPath:"#/properties/metadata/properties/publication_date/type",keyword:"type",params:{type: "null"},message:"must be null"};
if(vErrors === null){
vErrors = [err50];
}
else {
vErrors.push(err50);
}
errors++;
}
}
if(data0.retrieval_date !== undefined){
let data12 = data0.retrieval_date;
if(typeof data12 === "string"){
if(!(formats4.validate(data12))){
const err51 = {instancePath:instancePath+"/metadata/retrieval_date",schemaPath:"#/properties/metadata/properties/retrieval_date/format",keyword:"format",params:{format: "date-time"},message:"must match format \""+"date-time"+"\""};
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
const err52 = {instancePath:instancePath+"/metadata/retrieval_date",schemaPath:"#/properties/metadata/properties/retrieval_date/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err52];
}
else {
vErrors.push(err52);
}
errors++;
}
}
if(data0.processing_date !== undefined){
let data13 = data0.processing_date;
if(typeof data13 === "string"){
if(!(formats4.validate(data13))){
const err53 = {instancePath:instancePath+"/metadata/processing_date",schemaPath:"#/properties/metadata/properties/processing_date/format",keyword:"format",params:{format: "date-time"},message:"must match format \""+"date-time"+"\""};
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
const err54 = {instancePath:instancePath+"/metadata/processing_date",schemaPath:"#/properties/metadata/properties/processing_date/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err54];
}
else {
vErrors.push(err54);
}
errors++;
}
}
if(data0.processing_version !== undefined){
let data14 = data0.processing_version;
if(typeof data14 === "string"){
if(func3(data14) < 1){
const err55 = {instancePath:instancePath+"/metadata/processing_version",schemaPath:"#/properties/metadata/properties/processing_version/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
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
const err56 = {instancePath:instancePath+"/metadata/processing_version",schemaPath:"#/properties/metadata/properties/processing_version/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err56];
}
else {
vErrors.push(err56);
}
errors++;
}
}
if(data0.method !== undefined){
let data15 = data0.method;
if(typeof data15 === "string"){
if(func3(data15) < 1){
const err57 = {instancePath:instancePath+"/metadata/method",schemaPath:"#/properties/metadata/properties/method/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err57];
}
else {
vErrors.push(err57);
}
errors++;
}
}
else {
const err58 = {instancePath:instancePath+"/metadata/method",schemaPath:"#/properties/metadata/properties/method/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err58];
}
else {
vErrors.push(err58);
}
errors++;
}
}
if(data0.spatial_resolution !== undefined){
let data16 = data0.spatial_resolution;
if(data16 && typeof data16 == "object" && !Array.isArray(data16)){
if(data16.value === undefined){
const err59 = {instancePath:instancePath+"/metadata/spatial_resolution",schemaPath:"#/properties/metadata/properties/spatial_resolution/required",keyword:"required",params:{missingProperty: "value"},message:"must have required property '"+"value"+"'"};
if(vErrors === null){
vErrors = [err59];
}
else {
vErrors.push(err59);
}
errors++;
}
if(data16.unit === undefined){
const err60 = {instancePath:instancePath+"/metadata/spatial_resolution",schemaPath:"#/properties/metadata/properties/spatial_resolution/required",keyword:"required",params:{missingProperty: "unit"},message:"must have required property '"+"unit"+"'"};
if(vErrors === null){
vErrors = [err60];
}
else {
vErrors.push(err60);
}
errors++;
}
for(const key2 in data16){
if(!((key2 === "value") || (key2 === "unit"))){
const err61 = {instancePath:instancePath+"/metadata/spatial_resolution",schemaPath:"#/properties/metadata/properties/spatial_resolution/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key2},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err61];
}
else {
vErrors.push(err61);
}
errors++;
}
}
if(data16.value !== undefined){
if(0.5 !== data16.value){
const err62 = {instancePath:instancePath+"/metadata/spatial_resolution/value",schemaPath:"#/properties/metadata/properties/spatial_resolution/properties/value/const",keyword:"const",params:{allowedValue: 0.5},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err62];
}
else {
vErrors.push(err62);
}
errors++;
}
}
if(data16.unit !== undefined){
if("degree" !== data16.unit){
const err63 = {instancePath:instancePath+"/metadata/spatial_resolution/unit",schemaPath:"#/properties/metadata/properties/spatial_resolution/properties/unit/const",keyword:"const",params:{allowedValue: "degree"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err63];
}
else {
vErrors.push(err63);
}
errors++;
}
}
}
else {
const err64 = {instancePath:instancePath+"/metadata/spatial_resolution",schemaPath:"#/properties/metadata/properties/spatial_resolution/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err64];
}
else {
vErrors.push(err64);
}
errors++;
}
}
if(data0.temporal_resolution !== undefined){
if("monthly" !== data0.temporal_resolution){
const err65 = {instancePath:instancePath+"/metadata/temporal_resolution",schemaPath:"#/properties/metadata/properties/temporal_resolution/const",keyword:"const",params:{allowedValue: "monthly"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err65];
}
else {
vErrors.push(err65);
}
errors++;
}
}
if(data0.spatial_coverage !== undefined){
let data20 = data0.spatial_coverage;
if(data20 && typeof data20 == "object" && !Array.isArray(data20)){
if(data20.description === undefined){
const err66 = {instancePath:instancePath+"/metadata/spatial_coverage",schemaPath:"#/properties/metadata/properties/spatial_coverage/required",keyword:"required",params:{missingProperty: "description"},message:"must have required property '"+"description"+"'"};
if(vErrors === null){
vErrors = [err66];
}
else {
vErrors.push(err66);
}
errors++;
}
if(data20.bbox === undefined){
const err67 = {instancePath:instancePath+"/metadata/spatial_coverage",schemaPath:"#/properties/metadata/properties/spatial_coverage/required",keyword:"required",params:{missingProperty: "bbox"},message:"must have required property '"+"bbox"+"'"};
if(vErrors === null){
vErrors = [err67];
}
else {
vErrors.push(err67);
}
errors++;
}
for(const key3 in data20){
if(!((key3 === "description") || (key3 === "bbox"))){
const err68 = {instancePath:instancePath+"/metadata/spatial_coverage",schemaPath:"#/properties/metadata/properties/spatial_coverage/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key3},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err68];
}
else {
vErrors.push(err68);
}
errors++;
}
}
if(data20.description !== undefined){
let data21 = data20.description;
if(typeof data21 === "string"){
if(func3(data21) < 1){
const err69 = {instancePath:instancePath+"/metadata/spatial_coverage/description",schemaPath:"#/properties/metadata/properties/spatial_coverage/properties/description/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
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
const err70 = {instancePath:instancePath+"/metadata/spatial_coverage/description",schemaPath:"#/properties/metadata/properties/spatial_coverage/properties/description/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err70];
}
else {
vErrors.push(err70);
}
errors++;
}
}
if(data20.bbox !== undefined){
let data22 = data20.bbox;
if(Array.isArray(data22)){
if(data22.length > 4){
const err71 = {instancePath:instancePath+"/metadata/spatial_coverage/bbox",schemaPath:"#/properties/metadata/properties/spatial_coverage/properties/bbox/maxItems",keyword:"maxItems",params:{limit: 4},message:"must NOT have more than 4 items"};
if(vErrors === null){
vErrors = [err71];
}
else {
vErrors.push(err71);
}
errors++;
}
if(data22.length < 4){
const err72 = {instancePath:instancePath+"/metadata/spatial_coverage/bbox",schemaPath:"#/properties/metadata/properties/spatial_coverage/properties/bbox/minItems",keyword:"minItems",params:{limit: 4},message:"must NOT have fewer than 4 items"};
if(vErrors === null){
vErrors = [err72];
}
else {
vErrors.push(err72);
}
errors++;
}
const len0 = data22.length;
for(let i0=0; i0<len0; i0++){
let data23 = data22[i0];
if(!((typeof data23 == "number") && (isFinite(data23)))){
const err73 = {instancePath:instancePath+"/metadata/spatial_coverage/bbox/" + i0,schemaPath:"#/properties/metadata/properties/spatial_coverage/properties/bbox/items/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err73];
}
else {
vErrors.push(err73);
}
errors++;
}
}
}
else {
const err74 = {instancePath:instancePath+"/metadata/spatial_coverage/bbox",schemaPath:"#/properties/metadata/properties/spatial_coverage/properties/bbox/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err74];
}
else {
vErrors.push(err74);
}
errors++;
}
}
}
else {
const err75 = {instancePath:instancePath+"/metadata/spatial_coverage",schemaPath:"#/properties/metadata/properties/spatial_coverage/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err75];
}
else {
vErrors.push(err75);
}
errors++;
}
}
if(data0.temporal_coverage !== undefined){
let data24 = data0.temporal_coverage;
if(data24 && typeof data24 == "object" && !Array.isArray(data24)){
if(data24.start === undefined){
const err76 = {instancePath:instancePath+"/metadata/temporal_coverage",schemaPath:"#/properties/metadata/properties/temporal_coverage/required",keyword:"required",params:{missingProperty: "start"},message:"must have required property '"+"start"+"'"};
if(vErrors === null){
vErrors = [err76];
}
else {
vErrors.push(err76);
}
errors++;
}
if(data24.end === undefined){
const err77 = {instancePath:instancePath+"/metadata/temporal_coverage",schemaPath:"#/properties/metadata/properties/temporal_coverage/required",keyword:"required",params:{missingProperty: "end"},message:"must have required property '"+"end"+"'"};
if(vErrors === null){
vErrors = [err77];
}
else {
vErrors.push(err77);
}
errors++;
}
for(const key4 in data24){
if(!((key4 === "start") || (key4 === "end"))){
const err78 = {instancePath:instancePath+"/metadata/temporal_coverage",schemaPath:"#/properties/metadata/properties/temporal_coverage/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key4},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err78];
}
else {
vErrors.push(err78);
}
errors++;
}
}
if(data24.start !== undefined){
if("1991-01-01T00:00:00Z" !== data24.start){
const err79 = {instancePath:instancePath+"/metadata/temporal_coverage/start",schemaPath:"#/properties/metadata/properties/temporal_coverage/properties/start/const",keyword:"const",params:{allowedValue: "1991-01-01T00:00:00Z"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err79];
}
else {
vErrors.push(err79);
}
errors++;
}
}
if(data24.end !== undefined){
if("2020-12-31T23:59:59Z" !== data24.end){
const err80 = {instancePath:instancePath+"/metadata/temporal_coverage/end",schemaPath:"#/properties/metadata/properties/temporal_coverage/properties/end/const",keyword:"const",params:{allowedValue: "2020-12-31T23:59:59Z"},message:"must be equal to constant"};
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
if("ATLAS_DERIVED" !== data0.status){
const err83 = {instancePath:instancePath+"/metadata/status",schemaPath:"#/properties/metadata/properties/status/const",keyword:"const",params:{allowedValue: "ATLAS_DERIVED"},message:"must be equal to constant"};
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
if("/data/nepal-power-climate/1.0.0/series.json" !== data36.path){
const err99 = {instancePath:instancePath+"/metadata/artifact/path",schemaPath:"#/properties/metadata/properties/artifact/properties/path/const",keyword:"const",params:{allowedValue: "/data/nepal-power-climate/1.0.0/series.json"},message:"must be equal to constant"};
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
if("ClimateSeries" !== data36.format){
const err100 = {instancePath:instancePath+"/metadata/artifact/format",schemaPath:"#/properties/metadata/properties/artifact/properties/format/const",keyword:"const",params:{allowedValue: "ClimateSeries"},message:"must be equal to constant"};
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
if(data40 > 262144 || isNaN(data40)){
const err104 = {instancePath:instancePath+"/metadata/artifact/byte_size",schemaPath:"#/properties/metadata/properties/artifact/properties/byte_size/maximum",keyword:"maximum",params:{comparison: "<=", limit: 262144},message:"must be <= 262144"};
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
if(data.product !== undefined){
let data41 = data.product;
if(data41 && typeof data41 == "object" && !Array.isArray(data41)){
if(data41.provider === undefined){
const err108 = {instancePath:instancePath+"/product",schemaPath:"#/properties/product/required",keyword:"required",params:{missingProperty: "provider"},message:"must have required property '"+"provider"+"'"};
if(vErrors === null){
vErrors = [err108];
}
else {
vErrors.push(err108);
}
errors++;
}
if(data41.product_type === undefined){
const err109 = {instancePath:instancePath+"/product",schemaPath:"#/properties/product/required",keyword:"required",params:{missingProperty: "product_type"},message:"must have required property '"+"product_type"+"'"};
if(vErrors === null){
vErrors = [err109];
}
else {
vErrors.push(err109);
}
errors++;
}
if(data41.source_model === undefined){
const err110 = {instancePath:instancePath+"/product",schemaPath:"#/properties/product/required",keyword:"required",params:{missingProperty: "source_model"},message:"must have required property '"+"source_model"+"'"};
if(vErrors === null){
vErrors = [err110];
}
else {
vErrors.push(err110);
}
errors++;
}
if(data41.api_version === undefined){
const err111 = {instancePath:instancePath+"/product",schemaPath:"#/properties/product/required",keyword:"required",params:{missingProperty: "api_version"},message:"must have required property '"+"api_version"+"'"};
if(vErrors === null){
vErrors = [err111];
}
else {
vErrors.push(err111);
}
errors++;
}
if(data41.time_standard === undefined){
const err112 = {instancePath:instancePath+"/product",schemaPath:"#/properties/product/required",keyword:"required",params:{missingProperty: "time_standard"},message:"must have required property '"+"time_standard"+"'"};
if(vErrors === null){
vErrors = [err112];
}
else {
vErrors.push(err112);
}
errors++;
}
if(data41.baseline === undefined){
const err113 = {instancePath:instancePath+"/product",schemaPath:"#/properties/product/required",keyword:"required",params:{missingProperty: "baseline"},message:"must have required property '"+"baseline"+"'"};
if(vErrors === null){
vErrors = [err113];
}
else {
vErrors.push(err113);
}
errors++;
}
if(data41.native_grid === undefined){
const err114 = {instancePath:instancePath+"/product",schemaPath:"#/properties/product/required",keyword:"required",params:{missingProperty: "native_grid"},message:"must have required property '"+"native_grid"+"'"};
if(vErrors === null){
vErrors = [err114];
}
else {
vErrors.push(err114);
}
errors++;
}
if(data41.source_grid_points === undefined){
const err115 = {instancePath:instancePath+"/product",schemaPath:"#/properties/product/required",keyword:"required",params:{missingProperty: "source_grid_points"},message:"must have required property '"+"source_grid_points"+"'"};
if(vErrors === null){
vErrors = [err115];
}
else {
vErrors.push(err115);
}
errors++;
}
if(data41.contributing_grid_cells === undefined){
const err116 = {instancePath:instancePath+"/product",schemaPath:"#/properties/product/required",keyword:"required",params:{missingProperty: "contributing_grid_cells"},message:"must have required property '"+"contributing_grid_cells"+"'"};
if(vErrors === null){
vErrors = [err116];
}
else {
vErrors.push(err116);
}
errors++;
}
if(data41.boundary_source === undefined){
const err117 = {instancePath:instancePath+"/product",schemaPath:"#/properties/product/required",keyword:"required",params:{missingProperty: "boundary_source"},message:"must have required property '"+"boundary_source"+"'"};
if(vErrors === null){
vErrors = [err117];
}
else {
vErrors.push(err117);
}
errors++;
}
if(data41.boundary_sha256 === undefined){
const err118 = {instancePath:instancePath+"/product",schemaPath:"#/properties/product/required",keyword:"required",params:{missingProperty: "boundary_sha256"},message:"must have required property '"+"boundary_sha256"+"'"};
if(vErrors === null){
vErrors = [err118];
}
else {
vErrors.push(err118);
}
errors++;
}
if(data41.variables === undefined){
const err119 = {instancePath:instancePath+"/product",schemaPath:"#/properties/product/required",keyword:"required",params:{missingProperty: "variables"},message:"must have required property '"+"variables"+"'"};
if(vErrors === null){
vErrors = [err119];
}
else {
vErrors.push(err119);
}
errors++;
}
for(const key6 in data41){
if(!(func2.call(schema11.properties.product.properties, key6))){
const err120 = {instancePath:instancePath+"/product",schemaPath:"#/properties/product/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key6},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err120];
}
else {
vErrors.push(err120);
}
errors++;
}
}
if(data41.provider !== undefined){
if("NASA POWER" !== data41.provider){
const err121 = {instancePath:instancePath+"/product/provider",schemaPath:"#/properties/product/properties/provider/const",keyword:"const",params:{allowedValue: "NASA POWER"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err121];
}
else {
vErrors.push(err121);
}
errors++;
}
}
if(data41.product_type !== undefined){
if("reanalysis-derived" !== data41.product_type){
const err122 = {instancePath:instancePath+"/product/product_type",schemaPath:"#/properties/product/properties/product_type/const",keyword:"const",params:{allowedValue: "reanalysis-derived"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err122];
}
else {
vErrors.push(err122);
}
errors++;
}
}
if(data41.source_model !== undefined){
if("MERRA-2" !== data41.source_model){
const err123 = {instancePath:instancePath+"/product/source_model",schemaPath:"#/properties/product/properties/source_model/const",keyword:"const",params:{allowedValue: "MERRA-2"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err123];
}
else {
vErrors.push(err123);
}
errors++;
}
}
if(data41.api_version !== undefined){
if("v2.9.8" !== data41.api_version){
const err124 = {instancePath:instancePath+"/product/api_version",schemaPath:"#/properties/product/properties/api_version/const",keyword:"const",params:{allowedValue: "v2.9.8"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err124];
}
else {
vErrors.push(err124);
}
errors++;
}
}
if(data41.time_standard !== undefined){
if("UTC" !== data41.time_standard){
const err125 = {instancePath:instancePath+"/product/time_standard",schemaPath:"#/properties/product/properties/time_standard/const",keyword:"const",params:{allowedValue: "UTC"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err125];
}
else {
vErrors.push(err125);
}
errors++;
}
}
if(data41.baseline !== undefined){
if("1991-2020" !== data41.baseline){
const err126 = {instancePath:instancePath+"/product/baseline",schemaPath:"#/properties/product/properties/baseline/const",keyword:"const",params:{allowedValue: "1991-2020"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err126];
}
else {
vErrors.push(err126);
}
errors++;
}
}
if(data41.native_grid !== undefined){
let data48 = data41.native_grid;
if(data48 && typeof data48 == "object" && !Array.isArray(data48)){
if(data48.latitude_degrees === undefined){
const err127 = {instancePath:instancePath+"/product/native_grid",schemaPath:"#/properties/product/properties/native_grid/required",keyword:"required",params:{missingProperty: "latitude_degrees"},message:"must have required property '"+"latitude_degrees"+"'"};
if(vErrors === null){
vErrors = [err127];
}
else {
vErrors.push(err127);
}
errors++;
}
if(data48.longitude_degrees === undefined){
const err128 = {instancePath:instancePath+"/product/native_grid",schemaPath:"#/properties/product/properties/native_grid/required",keyword:"required",params:{missingProperty: "longitude_degrees"},message:"must have required property '"+"longitude_degrees"+"'"};
if(vErrors === null){
vErrors = [err128];
}
else {
vErrors.push(err128);
}
errors++;
}
for(const key7 in data48){
if(!((key7 === "latitude_degrees") || (key7 === "longitude_degrees"))){
const err129 = {instancePath:instancePath+"/product/native_grid",schemaPath:"#/properties/product/properties/native_grid/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key7},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err129];
}
else {
vErrors.push(err129);
}
errors++;
}
}
if(data48.latitude_degrees !== undefined){
if(0.5 !== data48.latitude_degrees){
const err130 = {instancePath:instancePath+"/product/native_grid/latitude_degrees",schemaPath:"#/properties/product/properties/native_grid/properties/latitude_degrees/const",keyword:"const",params:{allowedValue: 0.5},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err130];
}
else {
vErrors.push(err130);
}
errors++;
}
}
if(data48.longitude_degrees !== undefined){
if(0.625 !== data48.longitude_degrees){
const err131 = {instancePath:instancePath+"/product/native_grid/longitude_degrees",schemaPath:"#/properties/product/properties/native_grid/properties/longitude_degrees/const",keyword:"const",params:{allowedValue: 0.625},message:"must be equal to constant"};
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
else {
const err132 = {instancePath:instancePath+"/product/native_grid",schemaPath:"#/properties/product/properties/native_grid/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err132];
}
else {
vErrors.push(err132);
}
errors++;
}
}
if(data41.source_grid_points !== undefined){
if(165 !== data41.source_grid_points){
const err133 = {instancePath:instancePath+"/product/source_grid_points",schemaPath:"#/properties/product/properties/source_grid_points/const",keyword:"const",params:{allowedValue: 165},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err133];
}
else {
vErrors.push(err133);
}
errors++;
}
}
if(data41.contributing_grid_cells !== undefined){
let data52 = data41.contributing_grid_cells;
if(!(((typeof data52 == "number") && (!(data52 % 1) && !isNaN(data52))) && (isFinite(data52)))){
const err134 = {instancePath:instancePath+"/product/contributing_grid_cells",schemaPath:"#/properties/product/properties/contributing_grid_cells/type",keyword:"type",params:{type: "integer"},message:"must be integer"};
if(vErrors === null){
vErrors = [err134];
}
else {
vErrors.push(err134);
}
errors++;
}
if((typeof data52 == "number") && (isFinite(data52))){
if(data52 > 165 || isNaN(data52)){
const err135 = {instancePath:instancePath+"/product/contributing_grid_cells",schemaPath:"#/properties/product/properties/contributing_grid_cells/maximum",keyword:"maximum",params:{comparison: "<=", limit: 165},message:"must be <= 165"};
if(vErrors === null){
vErrors = [err135];
}
else {
vErrors.push(err135);
}
errors++;
}
if(data52 < 1 || isNaN(data52)){
const err136 = {instancePath:instancePath+"/product/contributing_grid_cells",schemaPath:"#/properties/product/properties/contributing_grid_cells/minimum",keyword:"minimum",params:{comparison: ">=", limit: 1},message:"must be >= 1"};
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
if(data41.boundary_source !== undefined){
if("Nepal COD-AB v02 unsimplified admin0" !== data41.boundary_source){
const err137 = {instancePath:instancePath+"/product/boundary_source",schemaPath:"#/properties/product/properties/boundary_source/const",keyword:"const",params:{allowedValue: "Nepal COD-AB v02 unsimplified admin0"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err137];
}
else {
vErrors.push(err137);
}
errors++;
}
}
if(data41.boundary_sha256 !== undefined){
if("9f6713c41d65396f611ddce5879faecf8e2d494edbd1d6611612445ad46b6707" !== data41.boundary_sha256){
const err138 = {instancePath:instancePath+"/product/boundary_sha256",schemaPath:"#/properties/product/properties/boundary_sha256/const",keyword:"const",params:{allowedValue: "9f6713c41d65396f611ddce5879faecf8e2d494edbd1d6611612445ad46b6707"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err138];
}
else {
vErrors.push(err138);
}
errors++;
}
}
if(data41.variables !== undefined){
let data55 = data41.variables;
if(Array.isArray(data55)){
if(data55.length > 2){
const err139 = {instancePath:instancePath+"/product/variables",schemaPath:"#/properties/product/properties/variables/maxItems",keyword:"maxItems",params:{limit: 2},message:"must NOT have more than 2 items"};
if(vErrors === null){
vErrors = [err139];
}
else {
vErrors.push(err139);
}
errors++;
}
if(data55.length < 2){
const err140 = {instancePath:instancePath+"/product/variables",schemaPath:"#/properties/product/properties/variables/minItems",keyword:"minItems",params:{limit: 2},message:"must NOT have fewer than 2 items"};
if(vErrors === null){
vErrors = [err140];
}
else {
vErrors.push(err140);
}
errors++;
}
const len2 = data55.length;
for(let i2=0; i2<len2; i2++){
let data56 = data55[i2];
if(data56 && typeof data56 == "object" && !Array.isArray(data56)){
if(data56.id === undefined){
const err141 = {instancePath:instancePath+"/product/variables/" + i2,schemaPath:"#/properties/product/properties/variables/items/required",keyword:"required",params:{missingProperty: "id"},message:"must have required property '"+"id"+"'"};
if(vErrors === null){
vErrors = [err141];
}
else {
vErrors.push(err141);
}
errors++;
}
if(data56.label === undefined){
const err142 = {instancePath:instancePath+"/product/variables/" + i2,schemaPath:"#/properties/product/properties/variables/items/required",keyword:"required",params:{missingProperty: "label"},message:"must have required property '"+"label"+"'"};
if(vErrors === null){
vErrors = [err142];
}
else {
vErrors.push(err142);
}
errors++;
}
if(data56.source_unit === undefined){
const err143 = {instancePath:instancePath+"/product/variables/" + i2,schemaPath:"#/properties/product/properties/variables/items/required",keyword:"required",params:{missingProperty: "source_unit"},message:"must have required property '"+"source_unit"+"'"};
if(vErrors === null){
vErrors = [err143];
}
else {
vErrors.push(err143);
}
errors++;
}
if(data56.published_unit === undefined){
const err144 = {instancePath:instancePath+"/product/variables/" + i2,schemaPath:"#/properties/product/properties/variables/items/required",keyword:"required",params:{missingProperty: "published_unit"},message:"must have required property '"+"published_unit"+"'"};
if(vErrors === null){
vErrors = [err144];
}
else {
vErrors.push(err144);
}
errors++;
}
for(const key8 in data56){
if(!((((key8 === "id") || (key8 === "label")) || (key8 === "source_unit")) || (key8 === "published_unit"))){
const err145 = {instancePath:instancePath+"/product/variables/" + i2,schemaPath:"#/properties/product/properties/variables/items/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key8},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err145];
}
else {
vErrors.push(err145);
}
errors++;
}
}
if(data56.id !== undefined){
let data57 = data56.id;
if(!((data57 === "T2M") || (data57 === "PRECTOTCORR"))){
const err146 = {instancePath:instancePath+"/product/variables/" + i2+"/id",schemaPath:"#/properties/product/properties/variables/items/properties/id/enum",keyword:"enum",params:{allowedValues: schema11.properties.product.properties.variables.items.properties.id.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err146];
}
else {
vErrors.push(err146);
}
errors++;
}
}
if(data56.label !== undefined){
let data58 = data56.label;
if(typeof data58 === "string"){
if(func3(data58) < 1){
const err147 = {instancePath:instancePath+"/product/variables/" + i2+"/label",schemaPath:"#/properties/product/properties/variables/items/properties/label/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
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
const err148 = {instancePath:instancePath+"/product/variables/" + i2+"/label",schemaPath:"#/properties/product/properties/variables/items/properties/label/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err148];
}
else {
vErrors.push(err148);
}
errors++;
}
}
if(data56.source_unit !== undefined){
let data59 = data56.source_unit;
if(!((data59 === "C") || (data59 === "mm/day"))){
const err149 = {instancePath:instancePath+"/product/variables/" + i2+"/source_unit",schemaPath:"#/properties/product/properties/variables/items/properties/source_unit/enum",keyword:"enum",params:{allowedValues: schema11.properties.product.properties.variables.items.properties.source_unit.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err149];
}
else {
vErrors.push(err149);
}
errors++;
}
}
if(data56.published_unit !== undefined){
let data60 = data56.published_unit;
if(!((data60 === "degC") || (data60 === "mm/day"))){
const err150 = {instancePath:instancePath+"/product/variables/" + i2+"/published_unit",schemaPath:"#/properties/product/properties/variables/items/properties/published_unit/enum",keyword:"enum",params:{allowedValues: schema11.properties.product.properties.variables.items.properties.published_unit.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err150];
}
else {
vErrors.push(err150);
}
errors++;
}
}
}
else {
const err151 = {instancePath:instancePath+"/product/variables/" + i2,schemaPath:"#/properties/product/properties/variables/items/type",keyword:"type",params:{type: "object"},message:"must be object"};
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
else {
const err152 = {instancePath:instancePath+"/product/variables",schemaPath:"#/properties/product/properties/variables/type",keyword:"type",params:{type: "array"},message:"must be array"};
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
else {
const err153 = {instancePath:instancePath+"/product",schemaPath:"#/properties/product/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err153];
}
else {
vErrors.push(err153);
}
errors++;
}
}
if(data.series !== undefined){
let data61 = data.series;
if(Array.isArray(data61)){
if(data61.length > 360){
const err154 = {instancePath:instancePath+"/series",schemaPath:"#/properties/series/maxItems",keyword:"maxItems",params:{limit: 360},message:"must NOT have more than 360 items"};
if(vErrors === null){
vErrors = [err154];
}
else {
vErrors.push(err154);
}
errors++;
}
if(data61.length < 360){
const err155 = {instancePath:instancePath+"/series",schemaPath:"#/properties/series/minItems",keyword:"minItems",params:{limit: 360},message:"must NOT have fewer than 360 items"};
if(vErrors === null){
vErrors = [err155];
}
else {
vErrors.push(err155);
}
errors++;
}
const len3 = data61.length;
for(let i3=0; i3<len3; i3++){
let data62 = data61[i3];
if(data62 && typeof data62 == "object" && !Array.isArray(data62)){
if(data62.period === undefined){
const err156 = {instancePath:instancePath+"/series/" + i3,schemaPath:"#/properties/series/items/required",keyword:"required",params:{missingProperty: "period"},message:"must have required property '"+"period"+"'"};
if(vErrors === null){
vErrors = [err156];
}
else {
vErrors.push(err156);
}
errors++;
}
if(data62.year === undefined){
const err157 = {instancePath:instancePath+"/series/" + i3,schemaPath:"#/properties/series/items/required",keyword:"required",params:{missingProperty: "year"},message:"must have required property '"+"year"+"'"};
if(vErrors === null){
vErrors = [err157];
}
else {
vErrors.push(err157);
}
errors++;
}
if(data62.month === undefined){
const err158 = {instancePath:instancePath+"/series/" + i3,schemaPath:"#/properties/series/items/required",keyword:"required",params:{missingProperty: "month"},message:"must have required property '"+"month"+"'"};
if(vErrors === null){
vErrors = [err158];
}
else {
vErrors.push(err158);
}
errors++;
}
if(data62.temperature_c === undefined){
const err159 = {instancePath:instancePath+"/series/" + i3,schemaPath:"#/properties/series/items/required",keyword:"required",params:{missingProperty: "temperature_c"},message:"must have required property '"+"temperature_c"+"'"};
if(vErrors === null){
vErrors = [err159];
}
else {
vErrors.push(err159);
}
errors++;
}
if(data62.precipitation_mm_day === undefined){
const err160 = {instancePath:instancePath+"/series/" + i3,schemaPath:"#/properties/series/items/required",keyword:"required",params:{missingProperty: "precipitation_mm_day"},message:"must have required property '"+"precipitation_mm_day"+"'"};
if(vErrors === null){
vErrors = [err160];
}
else {
vErrors.push(err160);
}
errors++;
}
if(data62.coverage_percent === undefined){
const err161 = {instancePath:instancePath+"/series/" + i3,schemaPath:"#/properties/series/items/required",keyword:"required",params:{missingProperty: "coverage_percent"},message:"must have required property '"+"coverage_percent"+"'"};
if(vErrors === null){
vErrors = [err161];
}
else {
vErrors.push(err161);
}
errors++;
}
for(const key9 in data62){
if(!((((((key9 === "period") || (key9 === "year")) || (key9 === "month")) || (key9 === "temperature_c")) || (key9 === "precipitation_mm_day")) || (key9 === "coverage_percent"))){
const err162 = {instancePath:instancePath+"/series/" + i3,schemaPath:"#/properties/series/items/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key9},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err162];
}
else {
vErrors.push(err162);
}
errors++;
}
}
if(data62.period !== undefined){
let data63 = data62.period;
if(typeof data63 === "string"){
if(!pattern1.test(data63)){
const err163 = {instancePath:instancePath+"/series/" + i3+"/period",schemaPath:"#/properties/series/items/properties/period/pattern",keyword:"pattern",params:{pattern: "^(19[9][1-9]|200[0-9]|201[0-9]|2020)-(0[1-9]|1[0-2])$"},message:"must match pattern \""+"^(19[9][1-9]|200[0-9]|201[0-9]|2020)-(0[1-9]|1[0-2])$"+"\""};
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
const err164 = {instancePath:instancePath+"/series/" + i3+"/period",schemaPath:"#/properties/series/items/properties/period/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err164];
}
else {
vErrors.push(err164);
}
errors++;
}
}
if(data62.year !== undefined){
let data64 = data62.year;
if(!(((typeof data64 == "number") && (!(data64 % 1) && !isNaN(data64))) && (isFinite(data64)))){
const err165 = {instancePath:instancePath+"/series/" + i3+"/year",schemaPath:"#/properties/series/items/properties/year/type",keyword:"type",params:{type: "integer"},message:"must be integer"};
if(vErrors === null){
vErrors = [err165];
}
else {
vErrors.push(err165);
}
errors++;
}
if((typeof data64 == "number") && (isFinite(data64))){
if(data64 > 2020 || isNaN(data64)){
const err166 = {instancePath:instancePath+"/series/" + i3+"/year",schemaPath:"#/properties/series/items/properties/year/maximum",keyword:"maximum",params:{comparison: "<=", limit: 2020},message:"must be <= 2020"};
if(vErrors === null){
vErrors = [err166];
}
else {
vErrors.push(err166);
}
errors++;
}
if(data64 < 1991 || isNaN(data64)){
const err167 = {instancePath:instancePath+"/series/" + i3+"/year",schemaPath:"#/properties/series/items/properties/year/minimum",keyword:"minimum",params:{comparison: ">=", limit: 1991},message:"must be >= 1991"};
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
if(data62.month !== undefined){
let data65 = data62.month;
if(!(((typeof data65 == "number") && (!(data65 % 1) && !isNaN(data65))) && (isFinite(data65)))){
const err168 = {instancePath:instancePath+"/series/" + i3+"/month",schemaPath:"#/properties/series/items/properties/month/type",keyword:"type",params:{type: "integer"},message:"must be integer"};
if(vErrors === null){
vErrors = [err168];
}
else {
vErrors.push(err168);
}
errors++;
}
if((typeof data65 == "number") && (isFinite(data65))){
if(data65 > 12 || isNaN(data65)){
const err169 = {instancePath:instancePath+"/series/" + i3+"/month",schemaPath:"#/properties/series/items/properties/month/maximum",keyword:"maximum",params:{comparison: "<=", limit: 12},message:"must be <= 12"};
if(vErrors === null){
vErrors = [err169];
}
else {
vErrors.push(err169);
}
errors++;
}
if(data65 < 1 || isNaN(data65)){
const err170 = {instancePath:instancePath+"/series/" + i3+"/month",schemaPath:"#/properties/series/items/properties/month/minimum",keyword:"minimum",params:{comparison: ">=", limit: 1},message:"must be >= 1"};
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
if(data62.temperature_c !== undefined){
let data66 = data62.temperature_c;
if((typeof data66 == "number") && (isFinite(data66))){
if(data66 > 60 || isNaN(data66)){
const err171 = {instancePath:instancePath+"/series/" + i3+"/temperature_c",schemaPath:"#/properties/series/items/properties/temperature_c/maximum",keyword:"maximum",params:{comparison: "<=", limit: 60},message:"must be <= 60"};
if(vErrors === null){
vErrors = [err171];
}
else {
vErrors.push(err171);
}
errors++;
}
if(data66 < -90 || isNaN(data66)){
const err172 = {instancePath:instancePath+"/series/" + i3+"/temperature_c",schemaPath:"#/properties/series/items/properties/temperature_c/minimum",keyword:"minimum",params:{comparison: ">=", limit: -90},message:"must be >= -90"};
if(vErrors === null){
vErrors = [err172];
}
else {
vErrors.push(err172);
}
errors++;
}
}
else {
const err173 = {instancePath:instancePath+"/series/" + i3+"/temperature_c",schemaPath:"#/properties/series/items/properties/temperature_c/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err173];
}
else {
vErrors.push(err173);
}
errors++;
}
}
if(data62.precipitation_mm_day !== undefined){
let data67 = data62.precipitation_mm_day;
if((typeof data67 == "number") && (isFinite(data67))){
if(data67 > 100 || isNaN(data67)){
const err174 = {instancePath:instancePath+"/series/" + i3+"/precipitation_mm_day",schemaPath:"#/properties/series/items/properties/precipitation_mm_day/maximum",keyword:"maximum",params:{comparison: "<=", limit: 100},message:"must be <= 100"};
if(vErrors === null){
vErrors = [err174];
}
else {
vErrors.push(err174);
}
errors++;
}
if(data67 < 0 || isNaN(data67)){
const err175 = {instancePath:instancePath+"/series/" + i3+"/precipitation_mm_day",schemaPath:"#/properties/series/items/properties/precipitation_mm_day/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
if(vErrors === null){
vErrors = [err175];
}
else {
vErrors.push(err175);
}
errors++;
}
}
else {
const err176 = {instancePath:instancePath+"/series/" + i3+"/precipitation_mm_day",schemaPath:"#/properties/series/items/properties/precipitation_mm_day/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err176];
}
else {
vErrors.push(err176);
}
errors++;
}
}
if(data62.coverage_percent !== undefined){
let data68 = data62.coverage_percent;
if((typeof data68 == "number") && (isFinite(data68))){
if(data68 > 100 || isNaN(data68)){
const err177 = {instancePath:instancePath+"/series/" + i3+"/coverage_percent",schemaPath:"#/properties/series/items/properties/coverage_percent/maximum",keyword:"maximum",params:{comparison: "<=", limit: 100},message:"must be <= 100"};
if(vErrors === null){
vErrors = [err177];
}
else {
vErrors.push(err177);
}
errors++;
}
if(data68 < 0 || isNaN(data68)){
const err178 = {instancePath:instancePath+"/series/" + i3+"/coverage_percent",schemaPath:"#/properties/series/items/properties/coverage_percent/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
if(vErrors === null){
vErrors = [err178];
}
else {
vErrors.push(err178);
}
errors++;
}
}
else {
const err179 = {instancePath:instancePath+"/series/" + i3+"/coverage_percent",schemaPath:"#/properties/series/items/properties/coverage_percent/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err179];
}
else {
vErrors.push(err179);
}
errors++;
}
}
}
else {
const err180 = {instancePath:instancePath+"/series/" + i3,schemaPath:"#/properties/series/items/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err180];
}
else {
vErrors.push(err180);
}
errors++;
}
}
}
else {
const err181 = {instancePath:instancePath+"/series",schemaPath:"#/properties/series/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err181];
}
else {
vErrors.push(err181);
}
errors++;
}
}
if(data.normals !== undefined){
let data69 = data.normals;
if(Array.isArray(data69)){
if(data69.length > 12){
const err182 = {instancePath:instancePath+"/normals",schemaPath:"#/properties/normals/maxItems",keyword:"maxItems",params:{limit: 12},message:"must NOT have more than 12 items"};
if(vErrors === null){
vErrors = [err182];
}
else {
vErrors.push(err182);
}
errors++;
}
if(data69.length < 12){
const err183 = {instancePath:instancePath+"/normals",schemaPath:"#/properties/normals/minItems",keyword:"minItems",params:{limit: 12},message:"must NOT have fewer than 12 items"};
if(vErrors === null){
vErrors = [err183];
}
else {
vErrors.push(err183);
}
errors++;
}
const len4 = data69.length;
for(let i4=0; i4<len4; i4++){
let data70 = data69[i4];
if(data70 && typeof data70 == "object" && !Array.isArray(data70)){
if(data70.month === undefined){
const err184 = {instancePath:instancePath+"/normals/" + i4,schemaPath:"#/properties/normals/items/required",keyword:"required",params:{missingProperty: "month"},message:"must have required property '"+"month"+"'"};
if(vErrors === null){
vErrors = [err184];
}
else {
vErrors.push(err184);
}
errors++;
}
if(data70.temperature_c === undefined){
const err185 = {instancePath:instancePath+"/normals/" + i4,schemaPath:"#/properties/normals/items/required",keyword:"required",params:{missingProperty: "temperature_c"},message:"must have required property '"+"temperature_c"+"'"};
if(vErrors === null){
vErrors = [err185];
}
else {
vErrors.push(err185);
}
errors++;
}
if(data70.precipitation_mm_day === undefined){
const err186 = {instancePath:instancePath+"/normals/" + i4,schemaPath:"#/properties/normals/items/required",keyword:"required",params:{missingProperty: "precipitation_mm_day"},message:"must have required property '"+"precipitation_mm_day"+"'"};
if(vErrors === null){
vErrors = [err186];
}
else {
vErrors.push(err186);
}
errors++;
}
if(data70.temperature_min_c === undefined){
const err187 = {instancePath:instancePath+"/normals/" + i4,schemaPath:"#/properties/normals/items/required",keyword:"required",params:{missingProperty: "temperature_min_c"},message:"must have required property '"+"temperature_min_c"+"'"};
if(vErrors === null){
vErrors = [err187];
}
else {
vErrors.push(err187);
}
errors++;
}
if(data70.temperature_max_c === undefined){
const err188 = {instancePath:instancePath+"/normals/" + i4,schemaPath:"#/properties/normals/items/required",keyword:"required",params:{missingProperty: "temperature_max_c"},message:"must have required property '"+"temperature_max_c"+"'"};
if(vErrors === null){
vErrors = [err188];
}
else {
vErrors.push(err188);
}
errors++;
}
if(data70.precipitation_min_mm_day === undefined){
const err189 = {instancePath:instancePath+"/normals/" + i4,schemaPath:"#/properties/normals/items/required",keyword:"required",params:{missingProperty: "precipitation_min_mm_day"},message:"must have required property '"+"precipitation_min_mm_day"+"'"};
if(vErrors === null){
vErrors = [err189];
}
else {
vErrors.push(err189);
}
errors++;
}
if(data70.precipitation_max_mm_day === undefined){
const err190 = {instancePath:instancePath+"/normals/" + i4,schemaPath:"#/properties/normals/items/required",keyword:"required",params:{missingProperty: "precipitation_max_mm_day"},message:"must have required property '"+"precipitation_max_mm_day"+"'"};
if(vErrors === null){
vErrors = [err190];
}
else {
vErrors.push(err190);
}
errors++;
}
if(data70.years === undefined){
const err191 = {instancePath:instancePath+"/normals/" + i4,schemaPath:"#/properties/normals/items/required",keyword:"required",params:{missingProperty: "years"},message:"must have required property '"+"years"+"'"};
if(vErrors === null){
vErrors = [err191];
}
else {
vErrors.push(err191);
}
errors++;
}
for(const key10 in data70){
if(!((((((((key10 === "month") || (key10 === "temperature_c")) || (key10 === "precipitation_mm_day")) || (key10 === "temperature_min_c")) || (key10 === "temperature_max_c")) || (key10 === "precipitation_min_mm_day")) || (key10 === "precipitation_max_mm_day")) || (key10 === "years"))){
const err192 = {instancePath:instancePath+"/normals/" + i4,schemaPath:"#/properties/normals/items/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key10},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err192];
}
else {
vErrors.push(err192);
}
errors++;
}
}
if(data70.month !== undefined){
let data71 = data70.month;
if(!(((typeof data71 == "number") && (!(data71 % 1) && !isNaN(data71))) && (isFinite(data71)))){
const err193 = {instancePath:instancePath+"/normals/" + i4+"/month",schemaPath:"#/properties/normals/items/properties/month/type",keyword:"type",params:{type: "integer"},message:"must be integer"};
if(vErrors === null){
vErrors = [err193];
}
else {
vErrors.push(err193);
}
errors++;
}
if((typeof data71 == "number") && (isFinite(data71))){
if(data71 > 12 || isNaN(data71)){
const err194 = {instancePath:instancePath+"/normals/" + i4+"/month",schemaPath:"#/properties/normals/items/properties/month/maximum",keyword:"maximum",params:{comparison: "<=", limit: 12},message:"must be <= 12"};
if(vErrors === null){
vErrors = [err194];
}
else {
vErrors.push(err194);
}
errors++;
}
if(data71 < 1 || isNaN(data71)){
const err195 = {instancePath:instancePath+"/normals/" + i4+"/month",schemaPath:"#/properties/normals/items/properties/month/minimum",keyword:"minimum",params:{comparison: ">=", limit: 1},message:"must be >= 1"};
if(vErrors === null){
vErrors = [err195];
}
else {
vErrors.push(err195);
}
errors++;
}
}
}
if(data70.temperature_c !== undefined){
let data72 = data70.temperature_c;
if((typeof data72 == "number") && (isFinite(data72))){
if(data72 > 60 || isNaN(data72)){
const err196 = {instancePath:instancePath+"/normals/" + i4+"/temperature_c",schemaPath:"#/properties/normals/items/properties/temperature_c/maximum",keyword:"maximum",params:{comparison: "<=", limit: 60},message:"must be <= 60"};
if(vErrors === null){
vErrors = [err196];
}
else {
vErrors.push(err196);
}
errors++;
}
if(data72 < -90 || isNaN(data72)){
const err197 = {instancePath:instancePath+"/normals/" + i4+"/temperature_c",schemaPath:"#/properties/normals/items/properties/temperature_c/minimum",keyword:"minimum",params:{comparison: ">=", limit: -90},message:"must be >= -90"};
if(vErrors === null){
vErrors = [err197];
}
else {
vErrors.push(err197);
}
errors++;
}
}
else {
const err198 = {instancePath:instancePath+"/normals/" + i4+"/temperature_c",schemaPath:"#/properties/normals/items/properties/temperature_c/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err198];
}
else {
vErrors.push(err198);
}
errors++;
}
}
if(data70.precipitation_mm_day !== undefined){
let data73 = data70.precipitation_mm_day;
if((typeof data73 == "number") && (isFinite(data73))){
if(data73 > 100 || isNaN(data73)){
const err199 = {instancePath:instancePath+"/normals/" + i4+"/precipitation_mm_day",schemaPath:"#/properties/normals/items/properties/precipitation_mm_day/maximum",keyword:"maximum",params:{comparison: "<=", limit: 100},message:"must be <= 100"};
if(vErrors === null){
vErrors = [err199];
}
else {
vErrors.push(err199);
}
errors++;
}
if(data73 < 0 || isNaN(data73)){
const err200 = {instancePath:instancePath+"/normals/" + i4+"/precipitation_mm_day",schemaPath:"#/properties/normals/items/properties/precipitation_mm_day/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
if(vErrors === null){
vErrors = [err200];
}
else {
vErrors.push(err200);
}
errors++;
}
}
else {
const err201 = {instancePath:instancePath+"/normals/" + i4+"/precipitation_mm_day",schemaPath:"#/properties/normals/items/properties/precipitation_mm_day/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err201];
}
else {
vErrors.push(err201);
}
errors++;
}
}
if(data70.temperature_min_c !== undefined){
let data74 = data70.temperature_min_c;
if((typeof data74 == "number") && (isFinite(data74))){
if(data74 > 60 || isNaN(data74)){
const err202 = {instancePath:instancePath+"/normals/" + i4+"/temperature_min_c",schemaPath:"#/properties/normals/items/properties/temperature_min_c/maximum",keyword:"maximum",params:{comparison: "<=", limit: 60},message:"must be <= 60"};
if(vErrors === null){
vErrors = [err202];
}
else {
vErrors.push(err202);
}
errors++;
}
if(data74 < -90 || isNaN(data74)){
const err203 = {instancePath:instancePath+"/normals/" + i4+"/temperature_min_c",schemaPath:"#/properties/normals/items/properties/temperature_min_c/minimum",keyword:"minimum",params:{comparison: ">=", limit: -90},message:"must be >= -90"};
if(vErrors === null){
vErrors = [err203];
}
else {
vErrors.push(err203);
}
errors++;
}
}
else {
const err204 = {instancePath:instancePath+"/normals/" + i4+"/temperature_min_c",schemaPath:"#/properties/normals/items/properties/temperature_min_c/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err204];
}
else {
vErrors.push(err204);
}
errors++;
}
}
if(data70.temperature_max_c !== undefined){
let data75 = data70.temperature_max_c;
if((typeof data75 == "number") && (isFinite(data75))){
if(data75 > 60 || isNaN(data75)){
const err205 = {instancePath:instancePath+"/normals/" + i4+"/temperature_max_c",schemaPath:"#/properties/normals/items/properties/temperature_max_c/maximum",keyword:"maximum",params:{comparison: "<=", limit: 60},message:"must be <= 60"};
if(vErrors === null){
vErrors = [err205];
}
else {
vErrors.push(err205);
}
errors++;
}
if(data75 < -90 || isNaN(data75)){
const err206 = {instancePath:instancePath+"/normals/" + i4+"/temperature_max_c",schemaPath:"#/properties/normals/items/properties/temperature_max_c/minimum",keyword:"minimum",params:{comparison: ">=", limit: -90},message:"must be >= -90"};
if(vErrors === null){
vErrors = [err206];
}
else {
vErrors.push(err206);
}
errors++;
}
}
else {
const err207 = {instancePath:instancePath+"/normals/" + i4+"/temperature_max_c",schemaPath:"#/properties/normals/items/properties/temperature_max_c/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err207];
}
else {
vErrors.push(err207);
}
errors++;
}
}
if(data70.precipitation_min_mm_day !== undefined){
let data76 = data70.precipitation_min_mm_day;
if((typeof data76 == "number") && (isFinite(data76))){
if(data76 > 100 || isNaN(data76)){
const err208 = {instancePath:instancePath+"/normals/" + i4+"/precipitation_min_mm_day",schemaPath:"#/properties/normals/items/properties/precipitation_min_mm_day/maximum",keyword:"maximum",params:{comparison: "<=", limit: 100},message:"must be <= 100"};
if(vErrors === null){
vErrors = [err208];
}
else {
vErrors.push(err208);
}
errors++;
}
if(data76 < 0 || isNaN(data76)){
const err209 = {instancePath:instancePath+"/normals/" + i4+"/precipitation_min_mm_day",schemaPath:"#/properties/normals/items/properties/precipitation_min_mm_day/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
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
const err210 = {instancePath:instancePath+"/normals/" + i4+"/precipitation_min_mm_day",schemaPath:"#/properties/normals/items/properties/precipitation_min_mm_day/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err210];
}
else {
vErrors.push(err210);
}
errors++;
}
}
if(data70.precipitation_max_mm_day !== undefined){
let data77 = data70.precipitation_max_mm_day;
if((typeof data77 == "number") && (isFinite(data77))){
if(data77 > 100 || isNaN(data77)){
const err211 = {instancePath:instancePath+"/normals/" + i4+"/precipitation_max_mm_day",schemaPath:"#/properties/normals/items/properties/precipitation_max_mm_day/maximum",keyword:"maximum",params:{comparison: "<=", limit: 100},message:"must be <= 100"};
if(vErrors === null){
vErrors = [err211];
}
else {
vErrors.push(err211);
}
errors++;
}
if(data77 < 0 || isNaN(data77)){
const err212 = {instancePath:instancePath+"/normals/" + i4+"/precipitation_max_mm_day",schemaPath:"#/properties/normals/items/properties/precipitation_max_mm_day/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
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
const err213 = {instancePath:instancePath+"/normals/" + i4+"/precipitation_max_mm_day",schemaPath:"#/properties/normals/items/properties/precipitation_max_mm_day/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err213];
}
else {
vErrors.push(err213);
}
errors++;
}
}
if(data70.years !== undefined){
if(30 !== data70.years){
const err214 = {instancePath:instancePath+"/normals/" + i4+"/years",schemaPath:"#/properties/normals/items/properties/years/const",keyword:"const",params:{allowedValue: 30},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err214];
}
else {
vErrors.push(err214);
}
errors++;
}
}
}
else {
const err215 = {instancePath:instancePath+"/normals/" + i4,schemaPath:"#/properties/normals/items/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err215];
}
else {
vErrors.push(err215);
}
errors++;
}
}
}
else {
const err216 = {instancePath:instancePath+"/normals",schemaPath:"#/properties/normals/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err216];
}
else {
vErrors.push(err216);
}
errors++;
}
}
}
else {
const err217 = {instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err217];
}
else {
vErrors.push(err217);
}
errors++;
}
validate10.errors = vErrors;
return errors === 0;
}

