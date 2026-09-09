// Generated from water-change.schema.json; run npm run contracts:generate. Do not edit.
"use strict";
module.exports = validate10;
module.exports.default = validate10;
const schema11 = {"$schema":"http://json-schema.org/draft-07/schema#","$id":"https://himalayan-disaster-atlas.invalid/schemas/water-change.schema.json","type":"object","additionalProperties":false,"required":["metadata","method","grid","coordinates","observations","comparisons"],"properties":{"metadata":{"type":"object","additionalProperties":false,"required":["schema_version","dataset_id","dataset_name","dataset_version","source","source_url","license","license_url","attribution","observation_date","publication_date","retrieval_date","processing_date","processing_version","method","spatial_resolution","temporal_resolution","spatial_coverage","temporal_coverage","crs","status","evidence_type","is_fixture","limitations","uncertainty","update_frequency","stale_after","artifact"],"properties":{"schema_version":{"const":"4.0.0"},"dataset_id":{"const":"phewa-water-change"},"dataset_name":{"type":"string","minLength":1},"dataset_version":{"const":"1.0.0"},"source":{"type":"string","minLength":1},"source_url":{"type":"string","format":"uri"},"license":{"type":"string","minLength":1},"license_url":{"type":"string","format":"uri"},"attribution":{"type":"string","minLength":1},"observation_date":{"type":"null"},"publication_date":{"type":"null"},"retrieval_date":{"type":"string","format":"date-time"},"processing_date":{"type":"string","format":"date-time"},"processing_version":{"type":"string","minLength":1},"method":{"type":"string","minLength":1},"spatial_resolution":{"type":"object","additionalProperties":false,"required":["value","unit"],"properties":{"value":{"const":20},"unit":{"const":"m"}}},"temporal_resolution":{"const":"irregular April snapshots"},"spatial_coverage":{"type":"object","additionalProperties":false,"required":["description","bbox"],"properties":{"description":{"type":"string","minLength":1},"bbox":{"type":"array","items":{"type":"number"},"minItems":4,"maxItems":4}}},"temporal_coverage":{"type":"object","additionalProperties":false,"required":["start","end"],"properties":{"start":{"type":"string","format":"date-time"},"end":{"type":"string","format":"date-time"}}},"crs":{"const":"OGC:CRS84"},"status":{"const":"ATLAS_DERIVED"},"evidence_type":{"const":"derived"},"is_fixture":{"const":false},"limitations":{"type":"array","items":{"type":"string","minLength":1},"minItems":1},"uncertainty":{"type":"string","minLength":1},"update_frequency":{"const":"static"},"stale_after":{"type":"null"},"artifact":{"allOf":[{"$ref":"#/definitions/artifact"}]}}},"method":{"const":"ndwi-scl-water/1.0.0"},"grid":{"type":"object","additionalProperties":false,"required":["crs","transform","width","height"],"properties":{"crs":{"const":"EPSG:32644"},"transform":{"const":[20,0,784480,0,-20,3130780]},"width":{"const":505},"height":{"const":512}}},"coordinates":{"type":"array","minItems":4,"maxItems":4,"items":{"type":"array","minItems":2,"maxItems":2,"items":{"type":"number"}}},"observations":{"type":"array","minItems":3,"maxItems":3,"items":{"type":"object","additionalProperties":false,"required":["id","acquired_at","published_at","scene_id","platform","valid_fraction","water_km2","classification","quality","water","quality_preview","true_colour"],"properties":{"id":{"type":"string","pattern":"^[0-9]{4}-[0-9]{2}-[0-9]{2}$"},"acquired_at":{"type":"string","format":"date-time"},"published_at":{"type":["string","null"],"format":"date-time"},"scene_id":{"type":"string","minLength":1},"platform":{"enum":["sentinel-2a","sentinel-2b","sentinel-2c"]},"valid_fraction":{"type":"number","minimum":0,"maximum":1},"water_km2":{"type":"number","minimum":0},"classification":{"$ref":"#/definitions/artifact"},"quality":{"$ref":"#/definitions/artifact"},"water":{"$ref":"#/definitions/artifact"},"quality_preview":{"$ref":"#/definitions/artifact"},"true_colour":{"$ref":"#/definitions/artifact"}}}},"comparisons":{"type":"array","minItems":3,"maxItems":3,"items":{"type":"object","additionalProperties":false,"required":["before","after","available","comparable_fraction","pixel_counts","gain_km2","loss_km2","persistence_km2","classification","preview","water_comparable_fraction"],"properties":{"before":{"type":"string"},"after":{"type":"string"},"available":{"type":"boolean"},"comparable_fraction":{"type":"number","minimum":0,"maximum":1},"pixel_counts":{"type":"object","additionalProperties":false,"required":["0","1","2","3","4"],"properties":{"0":{"type":"integer","minimum":0},"1":{"type":"integer","minimum":0},"2":{"type":"integer","minimum":0},"3":{"type":"integer","minimum":0},"4":{"type":"integer","minimum":0}}},"gain_km2":{"type":["number","null"],"minimum":0},"loss_km2":{"type":["number","null"],"minimum":0},"persistence_km2":{"type":["number","null"],"minimum":0},"classification":{"$ref":"#/definitions/artifact"},"preview":{"$ref":"#/definitions/artifact"},"water_comparable_fraction":{"type":["number","null"],"minimum":0,"maximum":1}}}}},"definitions":{"artifact":{"type":"object","additionalProperties":false,"required":["path","sha256","byte_size"],"properties":{"path":{"type":"string","pattern":"^/data/phewa-water-change/1\\.0\\.0/[a-z0-9.-]+\\.(png|json)$"},"sha256":{"type":"string","pattern":"^[a-f0-9]{64}$"},"byte_size":{"type":"integer","minimum":1,"maximum":4194304}}}}};
const schema12 = {"type":"object","additionalProperties":false,"required":["path","sha256","byte_size"],"properties":{"path":{"type":"string","pattern":"^/data/phewa-water-change/1\\.0\\.0/[a-z0-9.-]+\\.(png|json)$"},"sha256":{"type":"string","pattern":"^[a-f0-9]{64}$"},"byte_size":{"type":"integer","minimum":1,"maximum":4194304}}};
const func2 = Object.prototype.hasOwnProperty;
const func3 = require("ajv/dist/runtime/ucs2length").default;
const func0 = require("ajv/dist/runtime/equal").default;
const formats0 = require("ajv-formats/dist/formats").fullFormats.uri;
const formats4 = require("ajv-formats/dist/formats").fullFormats["date-time"];
const pattern0 = new RegExp("^/data/phewa-water-change/1\\.0\\.0/[a-z0-9.-]+\\.(png|json)$", "u");
const pattern1 = new RegExp("^[a-f0-9]{64}$", "u");
const pattern2 = new RegExp("^[0-9]{4}-[0-9]{2}-[0-9]{2}$", "u");

function validate10(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
/*# sourceURL="https://himalayan-disaster-atlas.invalid/schemas/water-change.schema.json" */;
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
if(data.method === undefined){
const err1 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "method"},message:"must have required property '"+"method"+"'"};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
if(data.grid === undefined){
const err2 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "grid"},message:"must have required property '"+"grid"+"'"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
if(data.coordinates === undefined){
const err3 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "coordinates"},message:"must have required property '"+"coordinates"+"'"};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
if(data.observations === undefined){
const err4 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "observations"},message:"must have required property '"+"observations"+"'"};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
if(data.comparisons === undefined){
const err5 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "comparisons"},message:"must have required property '"+"comparisons"+"'"};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
for(const key0 in data){
if(!((((((key0 === "metadata") || (key0 === "method")) || (key0 === "grid")) || (key0 === "coordinates")) || (key0 === "observations")) || (key0 === "comparisons"))){
const err6 = {instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
}
if(data.metadata !== undefined){
let data0 = data.metadata;
if(data0 && typeof data0 == "object" && !Array.isArray(data0)){
if(data0.schema_version === undefined){
const err7 = {instancePath:instancePath+"/metadata",schemaPath:"#/properties/metadata/required",keyword:"required",params:{missingProperty: "schema_version"},message:"must have required property '"+"schema_version"+"'"};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
}
if(data0.dataset_id === undefined){
const err8 = {instancePath:instancePath+"/metadata",schemaPath:"#/properties/metadata/required",keyword:"required",params:{missingProperty: "dataset_id"},message:"must have required property '"+"dataset_id"+"'"};
if(vErrors === null){
vErrors = [err8];
}
else {
vErrors.push(err8);
}
errors++;
}
if(data0.dataset_name === undefined){
const err9 = {instancePath:instancePath+"/metadata",schemaPath:"#/properties/metadata/required",keyword:"required",params:{missingProperty: "dataset_name"},message:"must have required property '"+"dataset_name"+"'"};
if(vErrors === null){
vErrors = [err9];
}
else {
vErrors.push(err9);
}
errors++;
}
if(data0.dataset_version === undefined){
const err10 = {instancePath:instancePath+"/metadata",schemaPath:"#/properties/metadata/required",keyword:"required",params:{missingProperty: "dataset_version"},message:"must have required property '"+"dataset_version"+"'"};
if(vErrors === null){
vErrors = [err10];
}
else {
vErrors.push(err10);
}
errors++;
}
if(data0.source === undefined){
const err11 = {instancePath:instancePath+"/metadata",schemaPath:"#/properties/metadata/required",keyword:"required",params:{missingProperty: "source"},message:"must have required property '"+"source"+"'"};
if(vErrors === null){
vErrors = [err11];
}
else {
vErrors.push(err11);
}
errors++;
}
if(data0.source_url === undefined){
const err12 = {instancePath:instancePath+"/metadata",schemaPath:"#/properties/metadata/required",keyword:"required",params:{missingProperty: "source_url"},message:"must have required property '"+"source_url"+"'"};
if(vErrors === null){
vErrors = [err12];
}
else {
vErrors.push(err12);
}
errors++;
}
if(data0.license === undefined){
const err13 = {instancePath:instancePath+"/metadata",schemaPath:"#/properties/metadata/required",keyword:"required",params:{missingProperty: "license"},message:"must have required property '"+"license"+"'"};
if(vErrors === null){
vErrors = [err13];
}
else {
vErrors.push(err13);
}
errors++;
}
if(data0.license_url === undefined){
const err14 = {instancePath:instancePath+"/metadata",schemaPath:"#/properties/metadata/required",keyword:"required",params:{missingProperty: "license_url"},message:"must have required property '"+"license_url"+"'"};
if(vErrors === null){
vErrors = [err14];
}
else {
vErrors.push(err14);
}
errors++;
}
if(data0.attribution === undefined){
const err15 = {instancePath:instancePath+"/metadata",schemaPath:"#/properties/metadata/required",keyword:"required",params:{missingProperty: "attribution"},message:"must have required property '"+"attribution"+"'"};
if(vErrors === null){
vErrors = [err15];
}
else {
vErrors.push(err15);
}
errors++;
}
if(data0.observation_date === undefined){
const err16 = {instancePath:instancePath+"/metadata",schemaPath:"#/properties/metadata/required",keyword:"required",params:{missingProperty: "observation_date"},message:"must have required property '"+"observation_date"+"'"};
if(vErrors === null){
vErrors = [err16];
}
else {
vErrors.push(err16);
}
errors++;
}
if(data0.publication_date === undefined){
const err17 = {instancePath:instancePath+"/metadata",schemaPath:"#/properties/metadata/required",keyword:"required",params:{missingProperty: "publication_date"},message:"must have required property '"+"publication_date"+"'"};
if(vErrors === null){
vErrors = [err17];
}
else {
vErrors.push(err17);
}
errors++;
}
if(data0.retrieval_date === undefined){
const err18 = {instancePath:instancePath+"/metadata",schemaPath:"#/properties/metadata/required",keyword:"required",params:{missingProperty: "retrieval_date"},message:"must have required property '"+"retrieval_date"+"'"};
if(vErrors === null){
vErrors = [err18];
}
else {
vErrors.push(err18);
}
errors++;
}
if(data0.processing_date === undefined){
const err19 = {instancePath:instancePath+"/metadata",schemaPath:"#/properties/metadata/required",keyword:"required",params:{missingProperty: "processing_date"},message:"must have required property '"+"processing_date"+"'"};
if(vErrors === null){
vErrors = [err19];
}
else {
vErrors.push(err19);
}
errors++;
}
if(data0.processing_version === undefined){
const err20 = {instancePath:instancePath+"/metadata",schemaPath:"#/properties/metadata/required",keyword:"required",params:{missingProperty: "processing_version"},message:"must have required property '"+"processing_version"+"'"};
if(vErrors === null){
vErrors = [err20];
}
else {
vErrors.push(err20);
}
errors++;
}
if(data0.method === undefined){
const err21 = {instancePath:instancePath+"/metadata",schemaPath:"#/properties/metadata/required",keyword:"required",params:{missingProperty: "method"},message:"must have required property '"+"method"+"'"};
if(vErrors === null){
vErrors = [err21];
}
else {
vErrors.push(err21);
}
errors++;
}
if(data0.spatial_resolution === undefined){
const err22 = {instancePath:instancePath+"/metadata",schemaPath:"#/properties/metadata/required",keyword:"required",params:{missingProperty: "spatial_resolution"},message:"must have required property '"+"spatial_resolution"+"'"};
if(vErrors === null){
vErrors = [err22];
}
else {
vErrors.push(err22);
}
errors++;
}
if(data0.temporal_resolution === undefined){
const err23 = {instancePath:instancePath+"/metadata",schemaPath:"#/properties/metadata/required",keyword:"required",params:{missingProperty: "temporal_resolution"},message:"must have required property '"+"temporal_resolution"+"'"};
if(vErrors === null){
vErrors = [err23];
}
else {
vErrors.push(err23);
}
errors++;
}
if(data0.spatial_coverage === undefined){
const err24 = {instancePath:instancePath+"/metadata",schemaPath:"#/properties/metadata/required",keyword:"required",params:{missingProperty: "spatial_coverage"},message:"must have required property '"+"spatial_coverage"+"'"};
if(vErrors === null){
vErrors = [err24];
}
else {
vErrors.push(err24);
}
errors++;
}
if(data0.temporal_coverage === undefined){
const err25 = {instancePath:instancePath+"/metadata",schemaPath:"#/properties/metadata/required",keyword:"required",params:{missingProperty: "temporal_coverage"},message:"must have required property '"+"temporal_coverage"+"'"};
if(vErrors === null){
vErrors = [err25];
}
else {
vErrors.push(err25);
}
errors++;
}
if(data0.crs === undefined){
const err26 = {instancePath:instancePath+"/metadata",schemaPath:"#/properties/metadata/required",keyword:"required",params:{missingProperty: "crs"},message:"must have required property '"+"crs"+"'"};
if(vErrors === null){
vErrors = [err26];
}
else {
vErrors.push(err26);
}
errors++;
}
if(data0.status === undefined){
const err27 = {instancePath:instancePath+"/metadata",schemaPath:"#/properties/metadata/required",keyword:"required",params:{missingProperty: "status"},message:"must have required property '"+"status"+"'"};
if(vErrors === null){
vErrors = [err27];
}
else {
vErrors.push(err27);
}
errors++;
}
if(data0.evidence_type === undefined){
const err28 = {instancePath:instancePath+"/metadata",schemaPath:"#/properties/metadata/required",keyword:"required",params:{missingProperty: "evidence_type"},message:"must have required property '"+"evidence_type"+"'"};
if(vErrors === null){
vErrors = [err28];
}
else {
vErrors.push(err28);
}
errors++;
}
if(data0.is_fixture === undefined){
const err29 = {instancePath:instancePath+"/metadata",schemaPath:"#/properties/metadata/required",keyword:"required",params:{missingProperty: "is_fixture"},message:"must have required property '"+"is_fixture"+"'"};
if(vErrors === null){
vErrors = [err29];
}
else {
vErrors.push(err29);
}
errors++;
}
if(data0.limitations === undefined){
const err30 = {instancePath:instancePath+"/metadata",schemaPath:"#/properties/metadata/required",keyword:"required",params:{missingProperty: "limitations"},message:"must have required property '"+"limitations"+"'"};
if(vErrors === null){
vErrors = [err30];
}
else {
vErrors.push(err30);
}
errors++;
}
if(data0.uncertainty === undefined){
const err31 = {instancePath:instancePath+"/metadata",schemaPath:"#/properties/metadata/required",keyword:"required",params:{missingProperty: "uncertainty"},message:"must have required property '"+"uncertainty"+"'"};
if(vErrors === null){
vErrors = [err31];
}
else {
vErrors.push(err31);
}
errors++;
}
if(data0.update_frequency === undefined){
const err32 = {instancePath:instancePath+"/metadata",schemaPath:"#/properties/metadata/required",keyword:"required",params:{missingProperty: "update_frequency"},message:"must have required property '"+"update_frequency"+"'"};
if(vErrors === null){
vErrors = [err32];
}
else {
vErrors.push(err32);
}
errors++;
}
if(data0.stale_after === undefined){
const err33 = {instancePath:instancePath+"/metadata",schemaPath:"#/properties/metadata/required",keyword:"required",params:{missingProperty: "stale_after"},message:"must have required property '"+"stale_after"+"'"};
if(vErrors === null){
vErrors = [err33];
}
else {
vErrors.push(err33);
}
errors++;
}
if(data0.artifact === undefined){
const err34 = {instancePath:instancePath+"/metadata",schemaPath:"#/properties/metadata/required",keyword:"required",params:{missingProperty: "artifact"},message:"must have required property '"+"artifact"+"'"};
if(vErrors === null){
vErrors = [err34];
}
else {
vErrors.push(err34);
}
errors++;
}
for(const key1 in data0){
if(!(func2.call(schema11.properties.metadata.properties, key1))){
const err35 = {instancePath:instancePath+"/metadata",schemaPath:"#/properties/metadata/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key1},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err35];
}
else {
vErrors.push(err35);
}
errors++;
}
}
if(data0.schema_version !== undefined){
if("4.0.0" !== data0.schema_version){
const err36 = {instancePath:instancePath+"/metadata/schema_version",schemaPath:"#/properties/metadata/properties/schema_version/const",keyword:"const",params:{allowedValue: "4.0.0"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err36];
}
else {
vErrors.push(err36);
}
errors++;
}
}
if(data0.dataset_id !== undefined){
if("phewa-water-change" !== data0.dataset_id){
const err37 = {instancePath:instancePath+"/metadata/dataset_id",schemaPath:"#/properties/metadata/properties/dataset_id/const",keyword:"const",params:{allowedValue: "phewa-water-change"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err37];
}
else {
vErrors.push(err37);
}
errors++;
}
}
if(data0.dataset_name !== undefined){
let data3 = data0.dataset_name;
if(typeof data3 === "string"){
if(func3(data3) < 1){
const err38 = {instancePath:instancePath+"/metadata/dataset_name",schemaPath:"#/properties/metadata/properties/dataset_name/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
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
const err39 = {instancePath:instancePath+"/metadata/dataset_name",schemaPath:"#/properties/metadata/properties/dataset_name/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err39];
}
else {
vErrors.push(err39);
}
errors++;
}
}
if(data0.dataset_version !== undefined){
if("1.0.0" !== data0.dataset_version){
const err40 = {instancePath:instancePath+"/metadata/dataset_version",schemaPath:"#/properties/metadata/properties/dataset_version/const",keyword:"const",params:{allowedValue: "1.0.0"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err40];
}
else {
vErrors.push(err40);
}
errors++;
}
}
if(data0.source !== undefined){
let data5 = data0.source;
if(typeof data5 === "string"){
if(func3(data5) < 1){
const err41 = {instancePath:instancePath+"/metadata/source",schemaPath:"#/properties/metadata/properties/source/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
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
const err42 = {instancePath:instancePath+"/metadata/source",schemaPath:"#/properties/metadata/properties/source/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err42];
}
else {
vErrors.push(err42);
}
errors++;
}
}
if(data0.source_url !== undefined){
let data6 = data0.source_url;
if(typeof data6 === "string"){
if(!(formats0(data6))){
const err43 = {instancePath:instancePath+"/metadata/source_url",schemaPath:"#/properties/metadata/properties/source_url/format",keyword:"format",params:{format: "uri"},message:"must match format \""+"uri"+"\""};
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
const err44 = {instancePath:instancePath+"/metadata/source_url",schemaPath:"#/properties/metadata/properties/source_url/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err44];
}
else {
vErrors.push(err44);
}
errors++;
}
}
if(data0.license !== undefined){
let data7 = data0.license;
if(typeof data7 === "string"){
if(func3(data7) < 1){
const err45 = {instancePath:instancePath+"/metadata/license",schemaPath:"#/properties/metadata/properties/license/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
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
const err46 = {instancePath:instancePath+"/metadata/license",schemaPath:"#/properties/metadata/properties/license/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err46];
}
else {
vErrors.push(err46);
}
errors++;
}
}
if(data0.license_url !== undefined){
let data8 = data0.license_url;
if(typeof data8 === "string"){
if(!(formats0(data8))){
const err47 = {instancePath:instancePath+"/metadata/license_url",schemaPath:"#/properties/metadata/properties/license_url/format",keyword:"format",params:{format: "uri"},message:"must match format \""+"uri"+"\""};
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
const err48 = {instancePath:instancePath+"/metadata/license_url",schemaPath:"#/properties/metadata/properties/license_url/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err48];
}
else {
vErrors.push(err48);
}
errors++;
}
}
if(data0.attribution !== undefined){
let data9 = data0.attribution;
if(typeof data9 === "string"){
if(func3(data9) < 1){
const err49 = {instancePath:instancePath+"/metadata/attribution",schemaPath:"#/properties/metadata/properties/attribution/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
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
const err50 = {instancePath:instancePath+"/metadata/attribution",schemaPath:"#/properties/metadata/properties/attribution/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err50];
}
else {
vErrors.push(err50);
}
errors++;
}
}
if(data0.observation_date !== undefined){
if(data0.observation_date !== null){
const err51 = {instancePath:instancePath+"/metadata/observation_date",schemaPath:"#/properties/metadata/properties/observation_date/type",keyword:"type",params:{type: "null"},message:"must be null"};
if(vErrors === null){
vErrors = [err51];
}
else {
vErrors.push(err51);
}
errors++;
}
}
if(data0.publication_date !== undefined){
if(data0.publication_date !== null){
const err52 = {instancePath:instancePath+"/metadata/publication_date",schemaPath:"#/properties/metadata/properties/publication_date/type",keyword:"type",params:{type: "null"},message:"must be null"};
if(vErrors === null){
vErrors = [err52];
}
else {
vErrors.push(err52);
}
errors++;
}
}
if(data0.retrieval_date !== undefined){
let data12 = data0.retrieval_date;
if(typeof data12 === "string"){
if(!(formats4.validate(data12))){
const err53 = {instancePath:instancePath+"/metadata/retrieval_date",schemaPath:"#/properties/metadata/properties/retrieval_date/format",keyword:"format",params:{format: "date-time"},message:"must match format \""+"date-time"+"\""};
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
const err54 = {instancePath:instancePath+"/metadata/retrieval_date",schemaPath:"#/properties/metadata/properties/retrieval_date/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err54];
}
else {
vErrors.push(err54);
}
errors++;
}
}
if(data0.processing_date !== undefined){
let data13 = data0.processing_date;
if(typeof data13 === "string"){
if(!(formats4.validate(data13))){
const err55 = {instancePath:instancePath+"/metadata/processing_date",schemaPath:"#/properties/metadata/properties/processing_date/format",keyword:"format",params:{format: "date-time"},message:"must match format \""+"date-time"+"\""};
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
const err56 = {instancePath:instancePath+"/metadata/processing_date",schemaPath:"#/properties/metadata/properties/processing_date/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err56];
}
else {
vErrors.push(err56);
}
errors++;
}
}
if(data0.processing_version !== undefined){
let data14 = data0.processing_version;
if(typeof data14 === "string"){
if(func3(data14) < 1){
const err57 = {instancePath:instancePath+"/metadata/processing_version",schemaPath:"#/properties/metadata/properties/processing_version/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
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
const err58 = {instancePath:instancePath+"/metadata/processing_version",schemaPath:"#/properties/metadata/properties/processing_version/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err58];
}
else {
vErrors.push(err58);
}
errors++;
}
}
if(data0.method !== undefined){
let data15 = data0.method;
if(typeof data15 === "string"){
if(func3(data15) < 1){
const err59 = {instancePath:instancePath+"/metadata/method",schemaPath:"#/properties/metadata/properties/method/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err59];
}
else {
vErrors.push(err59);
}
errors++;
}
}
else {
const err60 = {instancePath:instancePath+"/metadata/method",schemaPath:"#/properties/metadata/properties/method/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err60];
}
else {
vErrors.push(err60);
}
errors++;
}
}
if(data0.spatial_resolution !== undefined){
let data16 = data0.spatial_resolution;
if(data16 && typeof data16 == "object" && !Array.isArray(data16)){
if(data16.value === undefined){
const err61 = {instancePath:instancePath+"/metadata/spatial_resolution",schemaPath:"#/properties/metadata/properties/spatial_resolution/required",keyword:"required",params:{missingProperty: "value"},message:"must have required property '"+"value"+"'"};
if(vErrors === null){
vErrors = [err61];
}
else {
vErrors.push(err61);
}
errors++;
}
if(data16.unit === undefined){
const err62 = {instancePath:instancePath+"/metadata/spatial_resolution",schemaPath:"#/properties/metadata/properties/spatial_resolution/required",keyword:"required",params:{missingProperty: "unit"},message:"must have required property '"+"unit"+"'"};
if(vErrors === null){
vErrors = [err62];
}
else {
vErrors.push(err62);
}
errors++;
}
for(const key2 in data16){
if(!((key2 === "value") || (key2 === "unit"))){
const err63 = {instancePath:instancePath+"/metadata/spatial_resolution",schemaPath:"#/properties/metadata/properties/spatial_resolution/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key2},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err63];
}
else {
vErrors.push(err63);
}
errors++;
}
}
if(data16.value !== undefined){
if(20 !== data16.value){
const err64 = {instancePath:instancePath+"/metadata/spatial_resolution/value",schemaPath:"#/properties/metadata/properties/spatial_resolution/properties/value/const",keyword:"const",params:{allowedValue: 20},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err64];
}
else {
vErrors.push(err64);
}
errors++;
}
}
if(data16.unit !== undefined){
if("m" !== data16.unit){
const err65 = {instancePath:instancePath+"/metadata/spatial_resolution/unit",schemaPath:"#/properties/metadata/properties/spatial_resolution/properties/unit/const",keyword:"const",params:{allowedValue: "m"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err65];
}
else {
vErrors.push(err65);
}
errors++;
}
}
}
else {
const err66 = {instancePath:instancePath+"/metadata/spatial_resolution",schemaPath:"#/properties/metadata/properties/spatial_resolution/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err66];
}
else {
vErrors.push(err66);
}
errors++;
}
}
if(data0.temporal_resolution !== undefined){
if("irregular April snapshots" !== data0.temporal_resolution){
const err67 = {instancePath:instancePath+"/metadata/temporal_resolution",schemaPath:"#/properties/metadata/properties/temporal_resolution/const",keyword:"const",params:{allowedValue: "irregular April snapshots"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err67];
}
else {
vErrors.push(err67);
}
errors++;
}
}
if(data0.spatial_coverage !== undefined){
let data20 = data0.spatial_coverage;
if(data20 && typeof data20 == "object" && !Array.isArray(data20)){
if(data20.description === undefined){
const err68 = {instancePath:instancePath+"/metadata/spatial_coverage",schemaPath:"#/properties/metadata/properties/spatial_coverage/required",keyword:"required",params:{missingProperty: "description"},message:"must have required property '"+"description"+"'"};
if(vErrors === null){
vErrors = [err68];
}
else {
vErrors.push(err68);
}
errors++;
}
if(data20.bbox === undefined){
const err69 = {instancePath:instancePath+"/metadata/spatial_coverage",schemaPath:"#/properties/metadata/properties/spatial_coverage/required",keyword:"required",params:{missingProperty: "bbox"},message:"must have required property '"+"bbox"+"'"};
if(vErrors === null){
vErrors = [err69];
}
else {
vErrors.push(err69);
}
errors++;
}
for(const key3 in data20){
if(!((key3 === "description") || (key3 === "bbox"))){
const err70 = {instancePath:instancePath+"/metadata/spatial_coverage",schemaPath:"#/properties/metadata/properties/spatial_coverage/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key3},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err70];
}
else {
vErrors.push(err70);
}
errors++;
}
}
if(data20.description !== undefined){
let data21 = data20.description;
if(typeof data21 === "string"){
if(func3(data21) < 1){
const err71 = {instancePath:instancePath+"/metadata/spatial_coverage/description",schemaPath:"#/properties/metadata/properties/spatial_coverage/properties/description/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
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
const err72 = {instancePath:instancePath+"/metadata/spatial_coverage/description",schemaPath:"#/properties/metadata/properties/spatial_coverage/properties/description/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err72];
}
else {
vErrors.push(err72);
}
errors++;
}
}
if(data20.bbox !== undefined){
let data22 = data20.bbox;
if(Array.isArray(data22)){
if(data22.length > 4){
const err73 = {instancePath:instancePath+"/metadata/spatial_coverage/bbox",schemaPath:"#/properties/metadata/properties/spatial_coverage/properties/bbox/maxItems",keyword:"maxItems",params:{limit: 4},message:"must NOT have more than 4 items"};
if(vErrors === null){
vErrors = [err73];
}
else {
vErrors.push(err73);
}
errors++;
}
if(data22.length < 4){
const err74 = {instancePath:instancePath+"/metadata/spatial_coverage/bbox",schemaPath:"#/properties/metadata/properties/spatial_coverage/properties/bbox/minItems",keyword:"minItems",params:{limit: 4},message:"must NOT have fewer than 4 items"};
if(vErrors === null){
vErrors = [err74];
}
else {
vErrors.push(err74);
}
errors++;
}
const len0 = data22.length;
for(let i0=0; i0<len0; i0++){
let data23 = data22[i0];
if(!((typeof data23 == "number") && (isFinite(data23)))){
const err75 = {instancePath:instancePath+"/metadata/spatial_coverage/bbox/" + i0,schemaPath:"#/properties/metadata/properties/spatial_coverage/properties/bbox/items/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err75];
}
else {
vErrors.push(err75);
}
errors++;
}
}
}
else {
const err76 = {instancePath:instancePath+"/metadata/spatial_coverage/bbox",schemaPath:"#/properties/metadata/properties/spatial_coverage/properties/bbox/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err76];
}
else {
vErrors.push(err76);
}
errors++;
}
}
}
else {
const err77 = {instancePath:instancePath+"/metadata/spatial_coverage",schemaPath:"#/properties/metadata/properties/spatial_coverage/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err77];
}
else {
vErrors.push(err77);
}
errors++;
}
}
if(data0.temporal_coverage !== undefined){
let data24 = data0.temporal_coverage;
if(data24 && typeof data24 == "object" && !Array.isArray(data24)){
if(data24.start === undefined){
const err78 = {instancePath:instancePath+"/metadata/temporal_coverage",schemaPath:"#/properties/metadata/properties/temporal_coverage/required",keyword:"required",params:{missingProperty: "start"},message:"must have required property '"+"start"+"'"};
if(vErrors === null){
vErrors = [err78];
}
else {
vErrors.push(err78);
}
errors++;
}
if(data24.end === undefined){
const err79 = {instancePath:instancePath+"/metadata/temporal_coverage",schemaPath:"#/properties/metadata/properties/temporal_coverage/required",keyword:"required",params:{missingProperty: "end"},message:"must have required property '"+"end"+"'"};
if(vErrors === null){
vErrors = [err79];
}
else {
vErrors.push(err79);
}
errors++;
}
for(const key4 in data24){
if(!((key4 === "start") || (key4 === "end"))){
const err80 = {instancePath:instancePath+"/metadata/temporal_coverage",schemaPath:"#/properties/metadata/properties/temporal_coverage/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key4},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err80];
}
else {
vErrors.push(err80);
}
errors++;
}
}
if(data24.start !== undefined){
let data25 = data24.start;
if(typeof data25 === "string"){
if(!(formats4.validate(data25))){
const err81 = {instancePath:instancePath+"/metadata/temporal_coverage/start",schemaPath:"#/properties/metadata/properties/temporal_coverage/properties/start/format",keyword:"format",params:{format: "date-time"},message:"must match format \""+"date-time"+"\""};
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
const err82 = {instancePath:instancePath+"/metadata/temporal_coverage/start",schemaPath:"#/properties/metadata/properties/temporal_coverage/properties/start/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err82];
}
else {
vErrors.push(err82);
}
errors++;
}
}
if(data24.end !== undefined){
let data26 = data24.end;
if(typeof data26 === "string"){
if(!(formats4.validate(data26))){
const err83 = {instancePath:instancePath+"/metadata/temporal_coverage/end",schemaPath:"#/properties/metadata/properties/temporal_coverage/properties/end/format",keyword:"format",params:{format: "date-time"},message:"must match format \""+"date-time"+"\""};
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
const err84 = {instancePath:instancePath+"/metadata/temporal_coverage/end",schemaPath:"#/properties/metadata/properties/temporal_coverage/properties/end/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err84];
}
else {
vErrors.push(err84);
}
errors++;
}
}
}
else {
const err85 = {instancePath:instancePath+"/metadata/temporal_coverage",schemaPath:"#/properties/metadata/properties/temporal_coverage/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err85];
}
else {
vErrors.push(err85);
}
errors++;
}
}
if(data0.crs !== undefined){
if("OGC:CRS84" !== data0.crs){
const err86 = {instancePath:instancePath+"/metadata/crs",schemaPath:"#/properties/metadata/properties/crs/const",keyword:"const",params:{allowedValue: "OGC:CRS84"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err86];
}
else {
vErrors.push(err86);
}
errors++;
}
}
if(data0.status !== undefined){
if("ATLAS_DERIVED" !== data0.status){
const err87 = {instancePath:instancePath+"/metadata/status",schemaPath:"#/properties/metadata/properties/status/const",keyword:"const",params:{allowedValue: "ATLAS_DERIVED"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err87];
}
else {
vErrors.push(err87);
}
errors++;
}
}
if(data0.evidence_type !== undefined){
if("derived" !== data0.evidence_type){
const err88 = {instancePath:instancePath+"/metadata/evidence_type",schemaPath:"#/properties/metadata/properties/evidence_type/const",keyword:"const",params:{allowedValue: "derived"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err88];
}
else {
vErrors.push(err88);
}
errors++;
}
}
if(data0.is_fixture !== undefined){
if(false !== data0.is_fixture){
const err89 = {instancePath:instancePath+"/metadata/is_fixture",schemaPath:"#/properties/metadata/properties/is_fixture/const",keyword:"const",params:{allowedValue: false},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err89];
}
else {
vErrors.push(err89);
}
errors++;
}
}
if(data0.limitations !== undefined){
let data31 = data0.limitations;
if(Array.isArray(data31)){
if(data31.length < 1){
const err90 = {instancePath:instancePath+"/metadata/limitations",schemaPath:"#/properties/metadata/properties/limitations/minItems",keyword:"minItems",params:{limit: 1},message:"must NOT have fewer than 1 items"};
if(vErrors === null){
vErrors = [err90];
}
else {
vErrors.push(err90);
}
errors++;
}
const len1 = data31.length;
for(let i1=0; i1<len1; i1++){
let data32 = data31[i1];
if(typeof data32 === "string"){
if(func3(data32) < 1){
const err91 = {instancePath:instancePath+"/metadata/limitations/" + i1,schemaPath:"#/properties/metadata/properties/limitations/items/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
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
const err92 = {instancePath:instancePath+"/metadata/limitations/" + i1,schemaPath:"#/properties/metadata/properties/limitations/items/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err92];
}
else {
vErrors.push(err92);
}
errors++;
}
}
}
else {
const err93 = {instancePath:instancePath+"/metadata/limitations",schemaPath:"#/properties/metadata/properties/limitations/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err93];
}
else {
vErrors.push(err93);
}
errors++;
}
}
if(data0.uncertainty !== undefined){
let data33 = data0.uncertainty;
if(typeof data33 === "string"){
if(func3(data33) < 1){
const err94 = {instancePath:instancePath+"/metadata/uncertainty",schemaPath:"#/properties/metadata/properties/uncertainty/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
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
const err95 = {instancePath:instancePath+"/metadata/uncertainty",schemaPath:"#/properties/metadata/properties/uncertainty/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err95];
}
else {
vErrors.push(err95);
}
errors++;
}
}
if(data0.update_frequency !== undefined){
if("static" !== data0.update_frequency){
const err96 = {instancePath:instancePath+"/metadata/update_frequency",schemaPath:"#/properties/metadata/properties/update_frequency/const",keyword:"const",params:{allowedValue: "static"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err96];
}
else {
vErrors.push(err96);
}
errors++;
}
}
if(data0.stale_after !== undefined){
if(data0.stale_after !== null){
const err97 = {instancePath:instancePath+"/metadata/stale_after",schemaPath:"#/properties/metadata/properties/stale_after/type",keyword:"type",params:{type: "null"},message:"must be null"};
if(vErrors === null){
vErrors = [err97];
}
else {
vErrors.push(err97);
}
errors++;
}
}
if(data0.artifact !== undefined){
let data36 = data0.artifact;
if(data36 && typeof data36 == "object" && !Array.isArray(data36)){
if(data36.path === undefined){
const err98 = {instancePath:instancePath+"/metadata/artifact",schemaPath:"#/definitions/artifact/required",keyword:"required",params:{missingProperty: "path"},message:"must have required property '"+"path"+"'"};
if(vErrors === null){
vErrors = [err98];
}
else {
vErrors.push(err98);
}
errors++;
}
if(data36.sha256 === undefined){
const err99 = {instancePath:instancePath+"/metadata/artifact",schemaPath:"#/definitions/artifact/required",keyword:"required",params:{missingProperty: "sha256"},message:"must have required property '"+"sha256"+"'"};
if(vErrors === null){
vErrors = [err99];
}
else {
vErrors.push(err99);
}
errors++;
}
if(data36.byte_size === undefined){
const err100 = {instancePath:instancePath+"/metadata/artifact",schemaPath:"#/definitions/artifact/required",keyword:"required",params:{missingProperty: "byte_size"},message:"must have required property '"+"byte_size"+"'"};
if(vErrors === null){
vErrors = [err100];
}
else {
vErrors.push(err100);
}
errors++;
}
for(const key5 in data36){
if(!(((key5 === "path") || (key5 === "sha256")) || (key5 === "byte_size"))){
const err101 = {instancePath:instancePath+"/metadata/artifact",schemaPath:"#/definitions/artifact/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key5},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err101];
}
else {
vErrors.push(err101);
}
errors++;
}
}
if(data36.path !== undefined){
let data37 = data36.path;
if(typeof data37 === "string"){
if(!pattern0.test(data37)){
const err102 = {instancePath:instancePath+"/metadata/artifact/path",schemaPath:"#/definitions/artifact/properties/path/pattern",keyword:"pattern",params:{pattern: "^/data/phewa-water-change/1\\.0\\.0/[a-z0-9.-]+\\.(png|json)$"},message:"must match pattern \""+"^/data/phewa-water-change/1\\.0\\.0/[a-z0-9.-]+\\.(png|json)$"+"\""};
if(vErrors === null){
vErrors = [err102];
}
else {
vErrors.push(err102);
}
errors++;
}
}
else {
const err103 = {instancePath:instancePath+"/metadata/artifact/path",schemaPath:"#/definitions/artifact/properties/path/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err103];
}
else {
vErrors.push(err103);
}
errors++;
}
}
if(data36.sha256 !== undefined){
let data38 = data36.sha256;
if(typeof data38 === "string"){
if(!pattern1.test(data38)){
const err104 = {instancePath:instancePath+"/metadata/artifact/sha256",schemaPath:"#/definitions/artifact/properties/sha256/pattern",keyword:"pattern",params:{pattern: "^[a-f0-9]{64}$"},message:"must match pattern \""+"^[a-f0-9]{64}$"+"\""};
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
const err105 = {instancePath:instancePath+"/metadata/artifact/sha256",schemaPath:"#/definitions/artifact/properties/sha256/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err105];
}
else {
vErrors.push(err105);
}
errors++;
}
}
if(data36.byte_size !== undefined){
let data39 = data36.byte_size;
if(!(((typeof data39 == "number") && (!(data39 % 1) && !isNaN(data39))) && (isFinite(data39)))){
const err106 = {instancePath:instancePath+"/metadata/artifact/byte_size",schemaPath:"#/definitions/artifact/properties/byte_size/type",keyword:"type",params:{type: "integer"},message:"must be integer"};
if(vErrors === null){
vErrors = [err106];
}
else {
vErrors.push(err106);
}
errors++;
}
if((typeof data39 == "number") && (isFinite(data39))){
if(data39 > 4194304 || isNaN(data39)){
const err107 = {instancePath:instancePath+"/metadata/artifact/byte_size",schemaPath:"#/definitions/artifact/properties/byte_size/maximum",keyword:"maximum",params:{comparison: "<=", limit: 4194304},message:"must be <= 4194304"};
if(vErrors === null){
vErrors = [err107];
}
else {
vErrors.push(err107);
}
errors++;
}
if(data39 < 1 || isNaN(data39)){
const err108 = {instancePath:instancePath+"/metadata/artifact/byte_size",schemaPath:"#/definitions/artifact/properties/byte_size/minimum",keyword:"minimum",params:{comparison: ">=", limit: 1},message:"must be >= 1"};
if(vErrors === null){
vErrors = [err108];
}
else {
vErrors.push(err108);
}
errors++;
}
}
}
}
else {
const err109 = {instancePath:instancePath+"/metadata/artifact",schemaPath:"#/definitions/artifact/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err109];
}
else {
vErrors.push(err109);
}
errors++;
}
}
}
else {
const err110 = {instancePath:instancePath+"/metadata",schemaPath:"#/properties/metadata/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err110];
}
else {
vErrors.push(err110);
}
errors++;
}
}
if(data.method !== undefined){
if("ndwi-scl-water/1.0.0" !== data.method){
const err111 = {instancePath:instancePath+"/method",schemaPath:"#/properties/method/const",keyword:"const",params:{allowedValue: "ndwi-scl-water/1.0.0"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err111];
}
else {
vErrors.push(err111);
}
errors++;
}
}
if(data.grid !== undefined){
let data41 = data.grid;
if(data41 && typeof data41 == "object" && !Array.isArray(data41)){
if(data41.crs === undefined){
const err112 = {instancePath:instancePath+"/grid",schemaPath:"#/properties/grid/required",keyword:"required",params:{missingProperty: "crs"},message:"must have required property '"+"crs"+"'"};
if(vErrors === null){
vErrors = [err112];
}
else {
vErrors.push(err112);
}
errors++;
}
if(data41.transform === undefined){
const err113 = {instancePath:instancePath+"/grid",schemaPath:"#/properties/grid/required",keyword:"required",params:{missingProperty: "transform"},message:"must have required property '"+"transform"+"'"};
if(vErrors === null){
vErrors = [err113];
}
else {
vErrors.push(err113);
}
errors++;
}
if(data41.width === undefined){
const err114 = {instancePath:instancePath+"/grid",schemaPath:"#/properties/grid/required",keyword:"required",params:{missingProperty: "width"},message:"must have required property '"+"width"+"'"};
if(vErrors === null){
vErrors = [err114];
}
else {
vErrors.push(err114);
}
errors++;
}
if(data41.height === undefined){
const err115 = {instancePath:instancePath+"/grid",schemaPath:"#/properties/grid/required",keyword:"required",params:{missingProperty: "height"},message:"must have required property '"+"height"+"'"};
if(vErrors === null){
vErrors = [err115];
}
else {
vErrors.push(err115);
}
errors++;
}
for(const key6 in data41){
if(!((((key6 === "crs") || (key6 === "transform")) || (key6 === "width")) || (key6 === "height"))){
const err116 = {instancePath:instancePath+"/grid",schemaPath:"#/properties/grid/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key6},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err116];
}
else {
vErrors.push(err116);
}
errors++;
}
}
if(data41.crs !== undefined){
if("EPSG:32644" !== data41.crs){
const err117 = {instancePath:instancePath+"/grid/crs",schemaPath:"#/properties/grid/properties/crs/const",keyword:"const",params:{allowedValue: "EPSG:32644"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err117];
}
else {
vErrors.push(err117);
}
errors++;
}
}
if(data41.transform !== undefined){
if(!func0(data41.transform, schema11.properties.grid.properties.transform.const)){
const err118 = {instancePath:instancePath+"/grid/transform",schemaPath:"#/properties/grid/properties/transform/const",keyword:"const",params:{allowedValue: schema11.properties.grid.properties.transform.const},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err118];
}
else {
vErrors.push(err118);
}
errors++;
}
}
if(data41.width !== undefined){
if(505 !== data41.width){
const err119 = {instancePath:instancePath+"/grid/width",schemaPath:"#/properties/grid/properties/width/const",keyword:"const",params:{allowedValue: 505},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err119];
}
else {
vErrors.push(err119);
}
errors++;
}
}
if(data41.height !== undefined){
if(512 !== data41.height){
const err120 = {instancePath:instancePath+"/grid/height",schemaPath:"#/properties/grid/properties/height/const",keyword:"const",params:{allowedValue: 512},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err120];
}
else {
vErrors.push(err120);
}
errors++;
}
}
}
else {
const err121 = {instancePath:instancePath+"/grid",schemaPath:"#/properties/grid/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err121];
}
else {
vErrors.push(err121);
}
errors++;
}
}
if(data.coordinates !== undefined){
let data46 = data.coordinates;
if(Array.isArray(data46)){
if(data46.length > 4){
const err122 = {instancePath:instancePath+"/coordinates",schemaPath:"#/properties/coordinates/maxItems",keyword:"maxItems",params:{limit: 4},message:"must NOT have more than 4 items"};
if(vErrors === null){
vErrors = [err122];
}
else {
vErrors.push(err122);
}
errors++;
}
if(data46.length < 4){
const err123 = {instancePath:instancePath+"/coordinates",schemaPath:"#/properties/coordinates/minItems",keyword:"minItems",params:{limit: 4},message:"must NOT have fewer than 4 items"};
if(vErrors === null){
vErrors = [err123];
}
else {
vErrors.push(err123);
}
errors++;
}
const len2 = data46.length;
for(let i2=0; i2<len2; i2++){
let data47 = data46[i2];
if(Array.isArray(data47)){
if(data47.length > 2){
const err124 = {instancePath:instancePath+"/coordinates/" + i2,schemaPath:"#/properties/coordinates/items/maxItems",keyword:"maxItems",params:{limit: 2},message:"must NOT have more than 2 items"};
if(vErrors === null){
vErrors = [err124];
}
else {
vErrors.push(err124);
}
errors++;
}
if(data47.length < 2){
const err125 = {instancePath:instancePath+"/coordinates/" + i2,schemaPath:"#/properties/coordinates/items/minItems",keyword:"minItems",params:{limit: 2},message:"must NOT have fewer than 2 items"};
if(vErrors === null){
vErrors = [err125];
}
else {
vErrors.push(err125);
}
errors++;
}
const len3 = data47.length;
for(let i3=0; i3<len3; i3++){
let data48 = data47[i3];
if(!((typeof data48 == "number") && (isFinite(data48)))){
const err126 = {instancePath:instancePath+"/coordinates/" + i2+"/" + i3,schemaPath:"#/properties/coordinates/items/items/type",keyword:"type",params:{type: "number"},message:"must be number"};
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
const err127 = {instancePath:instancePath+"/coordinates/" + i2,schemaPath:"#/properties/coordinates/items/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err127];
}
else {
vErrors.push(err127);
}
errors++;
}
}
}
else {
const err128 = {instancePath:instancePath+"/coordinates",schemaPath:"#/properties/coordinates/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err128];
}
else {
vErrors.push(err128);
}
errors++;
}
}
if(data.observations !== undefined){
let data49 = data.observations;
if(Array.isArray(data49)){
if(data49.length > 3){
const err129 = {instancePath:instancePath+"/observations",schemaPath:"#/properties/observations/maxItems",keyword:"maxItems",params:{limit: 3},message:"must NOT have more than 3 items"};
if(vErrors === null){
vErrors = [err129];
}
else {
vErrors.push(err129);
}
errors++;
}
if(data49.length < 3){
const err130 = {instancePath:instancePath+"/observations",schemaPath:"#/properties/observations/minItems",keyword:"minItems",params:{limit: 3},message:"must NOT have fewer than 3 items"};
if(vErrors === null){
vErrors = [err130];
}
else {
vErrors.push(err130);
}
errors++;
}
const len4 = data49.length;
for(let i4=0; i4<len4; i4++){
let data50 = data49[i4];
if(data50 && typeof data50 == "object" && !Array.isArray(data50)){
if(data50.id === undefined){
const err131 = {instancePath:instancePath+"/observations/" + i4,schemaPath:"#/properties/observations/items/required",keyword:"required",params:{missingProperty: "id"},message:"must have required property '"+"id"+"'"};
if(vErrors === null){
vErrors = [err131];
}
else {
vErrors.push(err131);
}
errors++;
}
if(data50.acquired_at === undefined){
const err132 = {instancePath:instancePath+"/observations/" + i4,schemaPath:"#/properties/observations/items/required",keyword:"required",params:{missingProperty: "acquired_at"},message:"must have required property '"+"acquired_at"+"'"};
if(vErrors === null){
vErrors = [err132];
}
else {
vErrors.push(err132);
}
errors++;
}
if(data50.published_at === undefined){
const err133 = {instancePath:instancePath+"/observations/" + i4,schemaPath:"#/properties/observations/items/required",keyword:"required",params:{missingProperty: "published_at"},message:"must have required property '"+"published_at"+"'"};
if(vErrors === null){
vErrors = [err133];
}
else {
vErrors.push(err133);
}
errors++;
}
if(data50.scene_id === undefined){
const err134 = {instancePath:instancePath+"/observations/" + i4,schemaPath:"#/properties/observations/items/required",keyword:"required",params:{missingProperty: "scene_id"},message:"must have required property '"+"scene_id"+"'"};
if(vErrors === null){
vErrors = [err134];
}
else {
vErrors.push(err134);
}
errors++;
}
if(data50.platform === undefined){
const err135 = {instancePath:instancePath+"/observations/" + i4,schemaPath:"#/properties/observations/items/required",keyword:"required",params:{missingProperty: "platform"},message:"must have required property '"+"platform"+"'"};
if(vErrors === null){
vErrors = [err135];
}
else {
vErrors.push(err135);
}
errors++;
}
if(data50.valid_fraction === undefined){
const err136 = {instancePath:instancePath+"/observations/" + i4,schemaPath:"#/properties/observations/items/required",keyword:"required",params:{missingProperty: "valid_fraction"},message:"must have required property '"+"valid_fraction"+"'"};
if(vErrors === null){
vErrors = [err136];
}
else {
vErrors.push(err136);
}
errors++;
}
if(data50.water_km2 === undefined){
const err137 = {instancePath:instancePath+"/observations/" + i4,schemaPath:"#/properties/observations/items/required",keyword:"required",params:{missingProperty: "water_km2"},message:"must have required property '"+"water_km2"+"'"};
if(vErrors === null){
vErrors = [err137];
}
else {
vErrors.push(err137);
}
errors++;
}
if(data50.classification === undefined){
const err138 = {instancePath:instancePath+"/observations/" + i4,schemaPath:"#/properties/observations/items/required",keyword:"required",params:{missingProperty: "classification"},message:"must have required property '"+"classification"+"'"};
if(vErrors === null){
vErrors = [err138];
}
else {
vErrors.push(err138);
}
errors++;
}
if(data50.quality === undefined){
const err139 = {instancePath:instancePath+"/observations/" + i4,schemaPath:"#/properties/observations/items/required",keyword:"required",params:{missingProperty: "quality"},message:"must have required property '"+"quality"+"'"};
if(vErrors === null){
vErrors = [err139];
}
else {
vErrors.push(err139);
}
errors++;
}
if(data50.water === undefined){
const err140 = {instancePath:instancePath+"/observations/" + i4,schemaPath:"#/properties/observations/items/required",keyword:"required",params:{missingProperty: "water"},message:"must have required property '"+"water"+"'"};
if(vErrors === null){
vErrors = [err140];
}
else {
vErrors.push(err140);
}
errors++;
}
if(data50.quality_preview === undefined){
const err141 = {instancePath:instancePath+"/observations/" + i4,schemaPath:"#/properties/observations/items/required",keyword:"required",params:{missingProperty: "quality_preview"},message:"must have required property '"+"quality_preview"+"'"};
if(vErrors === null){
vErrors = [err141];
}
else {
vErrors.push(err141);
}
errors++;
}
if(data50.true_colour === undefined){
const err142 = {instancePath:instancePath+"/observations/" + i4,schemaPath:"#/properties/observations/items/required",keyword:"required",params:{missingProperty: "true_colour"},message:"must have required property '"+"true_colour"+"'"};
if(vErrors === null){
vErrors = [err142];
}
else {
vErrors.push(err142);
}
errors++;
}
for(const key7 in data50){
if(!(func2.call(schema11.properties.observations.items.properties, key7))){
const err143 = {instancePath:instancePath+"/observations/" + i4,schemaPath:"#/properties/observations/items/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key7},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err143];
}
else {
vErrors.push(err143);
}
errors++;
}
}
if(data50.id !== undefined){
let data51 = data50.id;
if(typeof data51 === "string"){
if(!pattern2.test(data51)){
const err144 = {instancePath:instancePath+"/observations/" + i4+"/id",schemaPath:"#/properties/observations/items/properties/id/pattern",keyword:"pattern",params:{pattern: "^[0-9]{4}-[0-9]{2}-[0-9]{2}$"},message:"must match pattern \""+"^[0-9]{4}-[0-9]{2}-[0-9]{2}$"+"\""};
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
const err145 = {instancePath:instancePath+"/observations/" + i4+"/id",schemaPath:"#/properties/observations/items/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err145];
}
else {
vErrors.push(err145);
}
errors++;
}
}
if(data50.acquired_at !== undefined){
let data52 = data50.acquired_at;
if(typeof data52 === "string"){
if(!(formats4.validate(data52))){
const err146 = {instancePath:instancePath+"/observations/" + i4+"/acquired_at",schemaPath:"#/properties/observations/items/properties/acquired_at/format",keyword:"format",params:{format: "date-time"},message:"must match format \""+"date-time"+"\""};
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
const err147 = {instancePath:instancePath+"/observations/" + i4+"/acquired_at",schemaPath:"#/properties/observations/items/properties/acquired_at/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err147];
}
else {
vErrors.push(err147);
}
errors++;
}
}
if(data50.published_at !== undefined){
let data53 = data50.published_at;
if((typeof data53 !== "string") && (data53 !== null)){
const err148 = {instancePath:instancePath+"/observations/" + i4+"/published_at",schemaPath:"#/properties/observations/items/properties/published_at/type",keyword:"type",params:{type: schema11.properties.observations.items.properties.published_at.type},message:"must be string,null"};
if(vErrors === null){
vErrors = [err148];
}
else {
vErrors.push(err148);
}
errors++;
}
if(typeof data53 === "string"){
if(!(formats4.validate(data53))){
const err149 = {instancePath:instancePath+"/observations/" + i4+"/published_at",schemaPath:"#/properties/observations/items/properties/published_at/format",keyword:"format",params:{format: "date-time"},message:"must match format \""+"date-time"+"\""};
if(vErrors === null){
vErrors = [err149];
}
else {
vErrors.push(err149);
}
errors++;
}
}
}
if(data50.scene_id !== undefined){
let data54 = data50.scene_id;
if(typeof data54 === "string"){
if(func3(data54) < 1){
const err150 = {instancePath:instancePath+"/observations/" + i4+"/scene_id",schemaPath:"#/properties/observations/items/properties/scene_id/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err150];
}
else {
vErrors.push(err150);
}
errors++;
}
}
else {
const err151 = {instancePath:instancePath+"/observations/" + i4+"/scene_id",schemaPath:"#/properties/observations/items/properties/scene_id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err151];
}
else {
vErrors.push(err151);
}
errors++;
}
}
if(data50.platform !== undefined){
let data55 = data50.platform;
if(!(((data55 === "sentinel-2a") || (data55 === "sentinel-2b")) || (data55 === "sentinel-2c"))){
const err152 = {instancePath:instancePath+"/observations/" + i4+"/platform",schemaPath:"#/properties/observations/items/properties/platform/enum",keyword:"enum",params:{allowedValues: schema11.properties.observations.items.properties.platform.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err152];
}
else {
vErrors.push(err152);
}
errors++;
}
}
if(data50.valid_fraction !== undefined){
let data56 = data50.valid_fraction;
if((typeof data56 == "number") && (isFinite(data56))){
if(data56 > 1 || isNaN(data56)){
const err153 = {instancePath:instancePath+"/observations/" + i4+"/valid_fraction",schemaPath:"#/properties/observations/items/properties/valid_fraction/maximum",keyword:"maximum",params:{comparison: "<=", limit: 1},message:"must be <= 1"};
if(vErrors === null){
vErrors = [err153];
}
else {
vErrors.push(err153);
}
errors++;
}
if(data56 < 0 || isNaN(data56)){
const err154 = {instancePath:instancePath+"/observations/" + i4+"/valid_fraction",schemaPath:"#/properties/observations/items/properties/valid_fraction/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
if(vErrors === null){
vErrors = [err154];
}
else {
vErrors.push(err154);
}
errors++;
}
}
else {
const err155 = {instancePath:instancePath+"/observations/" + i4+"/valid_fraction",schemaPath:"#/properties/observations/items/properties/valid_fraction/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err155];
}
else {
vErrors.push(err155);
}
errors++;
}
}
if(data50.water_km2 !== undefined){
let data57 = data50.water_km2;
if((typeof data57 == "number") && (isFinite(data57))){
if(data57 < 0 || isNaN(data57)){
const err156 = {instancePath:instancePath+"/observations/" + i4+"/water_km2",schemaPath:"#/properties/observations/items/properties/water_km2/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
if(vErrors === null){
vErrors = [err156];
}
else {
vErrors.push(err156);
}
errors++;
}
}
else {
const err157 = {instancePath:instancePath+"/observations/" + i4+"/water_km2",schemaPath:"#/properties/observations/items/properties/water_km2/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err157];
}
else {
vErrors.push(err157);
}
errors++;
}
}
if(data50.classification !== undefined){
let data58 = data50.classification;
if(data58 && typeof data58 == "object" && !Array.isArray(data58)){
if(data58.path === undefined){
const err158 = {instancePath:instancePath+"/observations/" + i4+"/classification",schemaPath:"#/definitions/artifact/required",keyword:"required",params:{missingProperty: "path"},message:"must have required property '"+"path"+"'"};
if(vErrors === null){
vErrors = [err158];
}
else {
vErrors.push(err158);
}
errors++;
}
if(data58.sha256 === undefined){
const err159 = {instancePath:instancePath+"/observations/" + i4+"/classification",schemaPath:"#/definitions/artifact/required",keyword:"required",params:{missingProperty: "sha256"},message:"must have required property '"+"sha256"+"'"};
if(vErrors === null){
vErrors = [err159];
}
else {
vErrors.push(err159);
}
errors++;
}
if(data58.byte_size === undefined){
const err160 = {instancePath:instancePath+"/observations/" + i4+"/classification",schemaPath:"#/definitions/artifact/required",keyword:"required",params:{missingProperty: "byte_size"},message:"must have required property '"+"byte_size"+"'"};
if(vErrors === null){
vErrors = [err160];
}
else {
vErrors.push(err160);
}
errors++;
}
for(const key8 in data58){
if(!(((key8 === "path") || (key8 === "sha256")) || (key8 === "byte_size"))){
const err161 = {instancePath:instancePath+"/observations/" + i4+"/classification",schemaPath:"#/definitions/artifact/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key8},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err161];
}
else {
vErrors.push(err161);
}
errors++;
}
}
if(data58.path !== undefined){
let data59 = data58.path;
if(typeof data59 === "string"){
if(!pattern0.test(data59)){
const err162 = {instancePath:instancePath+"/observations/" + i4+"/classification/path",schemaPath:"#/definitions/artifact/properties/path/pattern",keyword:"pattern",params:{pattern: "^/data/phewa-water-change/1\\.0\\.0/[a-z0-9.-]+\\.(png|json)$"},message:"must match pattern \""+"^/data/phewa-water-change/1\\.0\\.0/[a-z0-9.-]+\\.(png|json)$"+"\""};
if(vErrors === null){
vErrors = [err162];
}
else {
vErrors.push(err162);
}
errors++;
}
}
else {
const err163 = {instancePath:instancePath+"/observations/" + i4+"/classification/path",schemaPath:"#/definitions/artifact/properties/path/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err163];
}
else {
vErrors.push(err163);
}
errors++;
}
}
if(data58.sha256 !== undefined){
let data60 = data58.sha256;
if(typeof data60 === "string"){
if(!pattern1.test(data60)){
const err164 = {instancePath:instancePath+"/observations/" + i4+"/classification/sha256",schemaPath:"#/definitions/artifact/properties/sha256/pattern",keyword:"pattern",params:{pattern: "^[a-f0-9]{64}$"},message:"must match pattern \""+"^[a-f0-9]{64}$"+"\""};
if(vErrors === null){
vErrors = [err164];
}
else {
vErrors.push(err164);
}
errors++;
}
}
else {
const err165 = {instancePath:instancePath+"/observations/" + i4+"/classification/sha256",schemaPath:"#/definitions/artifact/properties/sha256/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err165];
}
else {
vErrors.push(err165);
}
errors++;
}
}
if(data58.byte_size !== undefined){
let data61 = data58.byte_size;
if(!(((typeof data61 == "number") && (!(data61 % 1) && !isNaN(data61))) && (isFinite(data61)))){
const err166 = {instancePath:instancePath+"/observations/" + i4+"/classification/byte_size",schemaPath:"#/definitions/artifact/properties/byte_size/type",keyword:"type",params:{type: "integer"},message:"must be integer"};
if(vErrors === null){
vErrors = [err166];
}
else {
vErrors.push(err166);
}
errors++;
}
if((typeof data61 == "number") && (isFinite(data61))){
if(data61 > 4194304 || isNaN(data61)){
const err167 = {instancePath:instancePath+"/observations/" + i4+"/classification/byte_size",schemaPath:"#/definitions/artifact/properties/byte_size/maximum",keyword:"maximum",params:{comparison: "<=", limit: 4194304},message:"must be <= 4194304"};
if(vErrors === null){
vErrors = [err167];
}
else {
vErrors.push(err167);
}
errors++;
}
if(data61 < 1 || isNaN(data61)){
const err168 = {instancePath:instancePath+"/observations/" + i4+"/classification/byte_size",schemaPath:"#/definitions/artifact/properties/byte_size/minimum",keyword:"minimum",params:{comparison: ">=", limit: 1},message:"must be >= 1"};
if(vErrors === null){
vErrors = [err168];
}
else {
vErrors.push(err168);
}
errors++;
}
}
}
}
else {
const err169 = {instancePath:instancePath+"/observations/" + i4+"/classification",schemaPath:"#/definitions/artifact/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err169];
}
else {
vErrors.push(err169);
}
errors++;
}
}
if(data50.quality !== undefined){
let data62 = data50.quality;
if(data62 && typeof data62 == "object" && !Array.isArray(data62)){
if(data62.path === undefined){
const err170 = {instancePath:instancePath+"/observations/" + i4+"/quality",schemaPath:"#/definitions/artifact/required",keyword:"required",params:{missingProperty: "path"},message:"must have required property '"+"path"+"'"};
if(vErrors === null){
vErrors = [err170];
}
else {
vErrors.push(err170);
}
errors++;
}
if(data62.sha256 === undefined){
const err171 = {instancePath:instancePath+"/observations/" + i4+"/quality",schemaPath:"#/definitions/artifact/required",keyword:"required",params:{missingProperty: "sha256"},message:"must have required property '"+"sha256"+"'"};
if(vErrors === null){
vErrors = [err171];
}
else {
vErrors.push(err171);
}
errors++;
}
if(data62.byte_size === undefined){
const err172 = {instancePath:instancePath+"/observations/" + i4+"/quality",schemaPath:"#/definitions/artifact/required",keyword:"required",params:{missingProperty: "byte_size"},message:"must have required property '"+"byte_size"+"'"};
if(vErrors === null){
vErrors = [err172];
}
else {
vErrors.push(err172);
}
errors++;
}
for(const key9 in data62){
if(!(((key9 === "path") || (key9 === "sha256")) || (key9 === "byte_size"))){
const err173 = {instancePath:instancePath+"/observations/" + i4+"/quality",schemaPath:"#/definitions/artifact/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key9},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err173];
}
else {
vErrors.push(err173);
}
errors++;
}
}
if(data62.path !== undefined){
let data63 = data62.path;
if(typeof data63 === "string"){
if(!pattern0.test(data63)){
const err174 = {instancePath:instancePath+"/observations/" + i4+"/quality/path",schemaPath:"#/definitions/artifact/properties/path/pattern",keyword:"pattern",params:{pattern: "^/data/phewa-water-change/1\\.0\\.0/[a-z0-9.-]+\\.(png|json)$"},message:"must match pattern \""+"^/data/phewa-water-change/1\\.0\\.0/[a-z0-9.-]+\\.(png|json)$"+"\""};
if(vErrors === null){
vErrors = [err174];
}
else {
vErrors.push(err174);
}
errors++;
}
}
else {
const err175 = {instancePath:instancePath+"/observations/" + i4+"/quality/path",schemaPath:"#/definitions/artifact/properties/path/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err175];
}
else {
vErrors.push(err175);
}
errors++;
}
}
if(data62.sha256 !== undefined){
let data64 = data62.sha256;
if(typeof data64 === "string"){
if(!pattern1.test(data64)){
const err176 = {instancePath:instancePath+"/observations/" + i4+"/quality/sha256",schemaPath:"#/definitions/artifact/properties/sha256/pattern",keyword:"pattern",params:{pattern: "^[a-f0-9]{64}$"},message:"must match pattern \""+"^[a-f0-9]{64}$"+"\""};
if(vErrors === null){
vErrors = [err176];
}
else {
vErrors.push(err176);
}
errors++;
}
}
else {
const err177 = {instancePath:instancePath+"/observations/" + i4+"/quality/sha256",schemaPath:"#/definitions/artifact/properties/sha256/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err177];
}
else {
vErrors.push(err177);
}
errors++;
}
}
if(data62.byte_size !== undefined){
let data65 = data62.byte_size;
if(!(((typeof data65 == "number") && (!(data65 % 1) && !isNaN(data65))) && (isFinite(data65)))){
const err178 = {instancePath:instancePath+"/observations/" + i4+"/quality/byte_size",schemaPath:"#/definitions/artifact/properties/byte_size/type",keyword:"type",params:{type: "integer"},message:"must be integer"};
if(vErrors === null){
vErrors = [err178];
}
else {
vErrors.push(err178);
}
errors++;
}
if((typeof data65 == "number") && (isFinite(data65))){
if(data65 > 4194304 || isNaN(data65)){
const err179 = {instancePath:instancePath+"/observations/" + i4+"/quality/byte_size",schemaPath:"#/definitions/artifact/properties/byte_size/maximum",keyword:"maximum",params:{comparison: "<=", limit: 4194304},message:"must be <= 4194304"};
if(vErrors === null){
vErrors = [err179];
}
else {
vErrors.push(err179);
}
errors++;
}
if(data65 < 1 || isNaN(data65)){
const err180 = {instancePath:instancePath+"/observations/" + i4+"/quality/byte_size",schemaPath:"#/definitions/artifact/properties/byte_size/minimum",keyword:"minimum",params:{comparison: ">=", limit: 1},message:"must be >= 1"};
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
}
else {
const err181 = {instancePath:instancePath+"/observations/" + i4+"/quality",schemaPath:"#/definitions/artifact/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err181];
}
else {
vErrors.push(err181);
}
errors++;
}
}
if(data50.water !== undefined){
let data66 = data50.water;
if(data66 && typeof data66 == "object" && !Array.isArray(data66)){
if(data66.path === undefined){
const err182 = {instancePath:instancePath+"/observations/" + i4+"/water",schemaPath:"#/definitions/artifact/required",keyword:"required",params:{missingProperty: "path"},message:"must have required property '"+"path"+"'"};
if(vErrors === null){
vErrors = [err182];
}
else {
vErrors.push(err182);
}
errors++;
}
if(data66.sha256 === undefined){
const err183 = {instancePath:instancePath+"/observations/" + i4+"/water",schemaPath:"#/definitions/artifact/required",keyword:"required",params:{missingProperty: "sha256"},message:"must have required property '"+"sha256"+"'"};
if(vErrors === null){
vErrors = [err183];
}
else {
vErrors.push(err183);
}
errors++;
}
if(data66.byte_size === undefined){
const err184 = {instancePath:instancePath+"/observations/" + i4+"/water",schemaPath:"#/definitions/artifact/required",keyword:"required",params:{missingProperty: "byte_size"},message:"must have required property '"+"byte_size"+"'"};
if(vErrors === null){
vErrors = [err184];
}
else {
vErrors.push(err184);
}
errors++;
}
for(const key10 in data66){
if(!(((key10 === "path") || (key10 === "sha256")) || (key10 === "byte_size"))){
const err185 = {instancePath:instancePath+"/observations/" + i4+"/water",schemaPath:"#/definitions/artifact/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key10},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err185];
}
else {
vErrors.push(err185);
}
errors++;
}
}
if(data66.path !== undefined){
let data67 = data66.path;
if(typeof data67 === "string"){
if(!pattern0.test(data67)){
const err186 = {instancePath:instancePath+"/observations/" + i4+"/water/path",schemaPath:"#/definitions/artifact/properties/path/pattern",keyword:"pattern",params:{pattern: "^/data/phewa-water-change/1\\.0\\.0/[a-z0-9.-]+\\.(png|json)$"},message:"must match pattern \""+"^/data/phewa-water-change/1\\.0\\.0/[a-z0-9.-]+\\.(png|json)$"+"\""};
if(vErrors === null){
vErrors = [err186];
}
else {
vErrors.push(err186);
}
errors++;
}
}
else {
const err187 = {instancePath:instancePath+"/observations/" + i4+"/water/path",schemaPath:"#/definitions/artifact/properties/path/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err187];
}
else {
vErrors.push(err187);
}
errors++;
}
}
if(data66.sha256 !== undefined){
let data68 = data66.sha256;
if(typeof data68 === "string"){
if(!pattern1.test(data68)){
const err188 = {instancePath:instancePath+"/observations/" + i4+"/water/sha256",schemaPath:"#/definitions/artifact/properties/sha256/pattern",keyword:"pattern",params:{pattern: "^[a-f0-9]{64}$"},message:"must match pattern \""+"^[a-f0-9]{64}$"+"\""};
if(vErrors === null){
vErrors = [err188];
}
else {
vErrors.push(err188);
}
errors++;
}
}
else {
const err189 = {instancePath:instancePath+"/observations/" + i4+"/water/sha256",schemaPath:"#/definitions/artifact/properties/sha256/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err189];
}
else {
vErrors.push(err189);
}
errors++;
}
}
if(data66.byte_size !== undefined){
let data69 = data66.byte_size;
if(!(((typeof data69 == "number") && (!(data69 % 1) && !isNaN(data69))) && (isFinite(data69)))){
const err190 = {instancePath:instancePath+"/observations/" + i4+"/water/byte_size",schemaPath:"#/definitions/artifact/properties/byte_size/type",keyword:"type",params:{type: "integer"},message:"must be integer"};
if(vErrors === null){
vErrors = [err190];
}
else {
vErrors.push(err190);
}
errors++;
}
if((typeof data69 == "number") && (isFinite(data69))){
if(data69 > 4194304 || isNaN(data69)){
const err191 = {instancePath:instancePath+"/observations/" + i4+"/water/byte_size",schemaPath:"#/definitions/artifact/properties/byte_size/maximum",keyword:"maximum",params:{comparison: "<=", limit: 4194304},message:"must be <= 4194304"};
if(vErrors === null){
vErrors = [err191];
}
else {
vErrors.push(err191);
}
errors++;
}
if(data69 < 1 || isNaN(data69)){
const err192 = {instancePath:instancePath+"/observations/" + i4+"/water/byte_size",schemaPath:"#/definitions/artifact/properties/byte_size/minimum",keyword:"minimum",params:{comparison: ">=", limit: 1},message:"must be >= 1"};
if(vErrors === null){
vErrors = [err192];
}
else {
vErrors.push(err192);
}
errors++;
}
}
}
}
else {
const err193 = {instancePath:instancePath+"/observations/" + i4+"/water",schemaPath:"#/definitions/artifact/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err193];
}
else {
vErrors.push(err193);
}
errors++;
}
}
if(data50.quality_preview !== undefined){
let data70 = data50.quality_preview;
if(data70 && typeof data70 == "object" && !Array.isArray(data70)){
if(data70.path === undefined){
const err194 = {instancePath:instancePath+"/observations/" + i4+"/quality_preview",schemaPath:"#/definitions/artifact/required",keyword:"required",params:{missingProperty: "path"},message:"must have required property '"+"path"+"'"};
if(vErrors === null){
vErrors = [err194];
}
else {
vErrors.push(err194);
}
errors++;
}
if(data70.sha256 === undefined){
const err195 = {instancePath:instancePath+"/observations/" + i4+"/quality_preview",schemaPath:"#/definitions/artifact/required",keyword:"required",params:{missingProperty: "sha256"},message:"must have required property '"+"sha256"+"'"};
if(vErrors === null){
vErrors = [err195];
}
else {
vErrors.push(err195);
}
errors++;
}
if(data70.byte_size === undefined){
const err196 = {instancePath:instancePath+"/observations/" + i4+"/quality_preview",schemaPath:"#/definitions/artifact/required",keyword:"required",params:{missingProperty: "byte_size"},message:"must have required property '"+"byte_size"+"'"};
if(vErrors === null){
vErrors = [err196];
}
else {
vErrors.push(err196);
}
errors++;
}
for(const key11 in data70){
if(!(((key11 === "path") || (key11 === "sha256")) || (key11 === "byte_size"))){
const err197 = {instancePath:instancePath+"/observations/" + i4+"/quality_preview",schemaPath:"#/definitions/artifact/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key11},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err197];
}
else {
vErrors.push(err197);
}
errors++;
}
}
if(data70.path !== undefined){
let data71 = data70.path;
if(typeof data71 === "string"){
if(!pattern0.test(data71)){
const err198 = {instancePath:instancePath+"/observations/" + i4+"/quality_preview/path",schemaPath:"#/definitions/artifact/properties/path/pattern",keyword:"pattern",params:{pattern: "^/data/phewa-water-change/1\\.0\\.0/[a-z0-9.-]+\\.(png|json)$"},message:"must match pattern \""+"^/data/phewa-water-change/1\\.0\\.0/[a-z0-9.-]+\\.(png|json)$"+"\""};
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
const err199 = {instancePath:instancePath+"/observations/" + i4+"/quality_preview/path",schemaPath:"#/definitions/artifact/properties/path/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err199];
}
else {
vErrors.push(err199);
}
errors++;
}
}
if(data70.sha256 !== undefined){
let data72 = data70.sha256;
if(typeof data72 === "string"){
if(!pattern1.test(data72)){
const err200 = {instancePath:instancePath+"/observations/" + i4+"/quality_preview/sha256",schemaPath:"#/definitions/artifact/properties/sha256/pattern",keyword:"pattern",params:{pattern: "^[a-f0-9]{64}$"},message:"must match pattern \""+"^[a-f0-9]{64}$"+"\""};
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
const err201 = {instancePath:instancePath+"/observations/" + i4+"/quality_preview/sha256",schemaPath:"#/definitions/artifact/properties/sha256/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err201];
}
else {
vErrors.push(err201);
}
errors++;
}
}
if(data70.byte_size !== undefined){
let data73 = data70.byte_size;
if(!(((typeof data73 == "number") && (!(data73 % 1) && !isNaN(data73))) && (isFinite(data73)))){
const err202 = {instancePath:instancePath+"/observations/" + i4+"/quality_preview/byte_size",schemaPath:"#/definitions/artifact/properties/byte_size/type",keyword:"type",params:{type: "integer"},message:"must be integer"};
if(vErrors === null){
vErrors = [err202];
}
else {
vErrors.push(err202);
}
errors++;
}
if((typeof data73 == "number") && (isFinite(data73))){
if(data73 > 4194304 || isNaN(data73)){
const err203 = {instancePath:instancePath+"/observations/" + i4+"/quality_preview/byte_size",schemaPath:"#/definitions/artifact/properties/byte_size/maximum",keyword:"maximum",params:{comparison: "<=", limit: 4194304},message:"must be <= 4194304"};
if(vErrors === null){
vErrors = [err203];
}
else {
vErrors.push(err203);
}
errors++;
}
if(data73 < 1 || isNaN(data73)){
const err204 = {instancePath:instancePath+"/observations/" + i4+"/quality_preview/byte_size",schemaPath:"#/definitions/artifact/properties/byte_size/minimum",keyword:"minimum",params:{comparison: ">=", limit: 1},message:"must be >= 1"};
if(vErrors === null){
vErrors = [err204];
}
else {
vErrors.push(err204);
}
errors++;
}
}
}
}
else {
const err205 = {instancePath:instancePath+"/observations/" + i4+"/quality_preview",schemaPath:"#/definitions/artifact/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err205];
}
else {
vErrors.push(err205);
}
errors++;
}
}
if(data50.true_colour !== undefined){
let data74 = data50.true_colour;
if(data74 && typeof data74 == "object" && !Array.isArray(data74)){
if(data74.path === undefined){
const err206 = {instancePath:instancePath+"/observations/" + i4+"/true_colour",schemaPath:"#/definitions/artifact/required",keyword:"required",params:{missingProperty: "path"},message:"must have required property '"+"path"+"'"};
if(vErrors === null){
vErrors = [err206];
}
else {
vErrors.push(err206);
}
errors++;
}
if(data74.sha256 === undefined){
const err207 = {instancePath:instancePath+"/observations/" + i4+"/true_colour",schemaPath:"#/definitions/artifact/required",keyword:"required",params:{missingProperty: "sha256"},message:"must have required property '"+"sha256"+"'"};
if(vErrors === null){
vErrors = [err207];
}
else {
vErrors.push(err207);
}
errors++;
}
if(data74.byte_size === undefined){
const err208 = {instancePath:instancePath+"/observations/" + i4+"/true_colour",schemaPath:"#/definitions/artifact/required",keyword:"required",params:{missingProperty: "byte_size"},message:"must have required property '"+"byte_size"+"'"};
if(vErrors === null){
vErrors = [err208];
}
else {
vErrors.push(err208);
}
errors++;
}
for(const key12 in data74){
if(!(((key12 === "path") || (key12 === "sha256")) || (key12 === "byte_size"))){
const err209 = {instancePath:instancePath+"/observations/" + i4+"/true_colour",schemaPath:"#/definitions/artifact/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key12},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err209];
}
else {
vErrors.push(err209);
}
errors++;
}
}
if(data74.path !== undefined){
let data75 = data74.path;
if(typeof data75 === "string"){
if(!pattern0.test(data75)){
const err210 = {instancePath:instancePath+"/observations/" + i4+"/true_colour/path",schemaPath:"#/definitions/artifact/properties/path/pattern",keyword:"pattern",params:{pattern: "^/data/phewa-water-change/1\\.0\\.0/[a-z0-9.-]+\\.(png|json)$"},message:"must match pattern \""+"^/data/phewa-water-change/1\\.0\\.0/[a-z0-9.-]+\\.(png|json)$"+"\""};
if(vErrors === null){
vErrors = [err210];
}
else {
vErrors.push(err210);
}
errors++;
}
}
else {
const err211 = {instancePath:instancePath+"/observations/" + i4+"/true_colour/path",schemaPath:"#/definitions/artifact/properties/path/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err211];
}
else {
vErrors.push(err211);
}
errors++;
}
}
if(data74.sha256 !== undefined){
let data76 = data74.sha256;
if(typeof data76 === "string"){
if(!pattern1.test(data76)){
const err212 = {instancePath:instancePath+"/observations/" + i4+"/true_colour/sha256",schemaPath:"#/definitions/artifact/properties/sha256/pattern",keyword:"pattern",params:{pattern: "^[a-f0-9]{64}$"},message:"must match pattern \""+"^[a-f0-9]{64}$"+"\""};
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
const err213 = {instancePath:instancePath+"/observations/" + i4+"/true_colour/sha256",schemaPath:"#/definitions/artifact/properties/sha256/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err213];
}
else {
vErrors.push(err213);
}
errors++;
}
}
if(data74.byte_size !== undefined){
let data77 = data74.byte_size;
if(!(((typeof data77 == "number") && (!(data77 % 1) && !isNaN(data77))) && (isFinite(data77)))){
const err214 = {instancePath:instancePath+"/observations/" + i4+"/true_colour/byte_size",schemaPath:"#/definitions/artifact/properties/byte_size/type",keyword:"type",params:{type: "integer"},message:"must be integer"};
if(vErrors === null){
vErrors = [err214];
}
else {
vErrors.push(err214);
}
errors++;
}
if((typeof data77 == "number") && (isFinite(data77))){
if(data77 > 4194304 || isNaN(data77)){
const err215 = {instancePath:instancePath+"/observations/" + i4+"/true_colour/byte_size",schemaPath:"#/definitions/artifact/properties/byte_size/maximum",keyword:"maximum",params:{comparison: "<=", limit: 4194304},message:"must be <= 4194304"};
if(vErrors === null){
vErrors = [err215];
}
else {
vErrors.push(err215);
}
errors++;
}
if(data77 < 1 || isNaN(data77)){
const err216 = {instancePath:instancePath+"/observations/" + i4+"/true_colour/byte_size",schemaPath:"#/definitions/artifact/properties/byte_size/minimum",keyword:"minimum",params:{comparison: ">=", limit: 1},message:"must be >= 1"};
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
}
else {
const err217 = {instancePath:instancePath+"/observations/" + i4+"/true_colour",schemaPath:"#/definitions/artifact/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err217];
}
else {
vErrors.push(err217);
}
errors++;
}
}
}
else {
const err218 = {instancePath:instancePath+"/observations/" + i4,schemaPath:"#/properties/observations/items/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err218];
}
else {
vErrors.push(err218);
}
errors++;
}
}
}
else {
const err219 = {instancePath:instancePath+"/observations",schemaPath:"#/properties/observations/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err219];
}
else {
vErrors.push(err219);
}
errors++;
}
}
if(data.comparisons !== undefined){
let data78 = data.comparisons;
if(Array.isArray(data78)){
if(data78.length > 3){
const err220 = {instancePath:instancePath+"/comparisons",schemaPath:"#/properties/comparisons/maxItems",keyword:"maxItems",params:{limit: 3},message:"must NOT have more than 3 items"};
if(vErrors === null){
vErrors = [err220];
}
else {
vErrors.push(err220);
}
errors++;
}
if(data78.length < 3){
const err221 = {instancePath:instancePath+"/comparisons",schemaPath:"#/properties/comparisons/minItems",keyword:"minItems",params:{limit: 3},message:"must NOT have fewer than 3 items"};
if(vErrors === null){
vErrors = [err221];
}
else {
vErrors.push(err221);
}
errors++;
}
const len5 = data78.length;
for(let i5=0; i5<len5; i5++){
let data79 = data78[i5];
if(data79 && typeof data79 == "object" && !Array.isArray(data79)){
if(data79.before === undefined){
const err222 = {instancePath:instancePath+"/comparisons/" + i5,schemaPath:"#/properties/comparisons/items/required",keyword:"required",params:{missingProperty: "before"},message:"must have required property '"+"before"+"'"};
if(vErrors === null){
vErrors = [err222];
}
else {
vErrors.push(err222);
}
errors++;
}
if(data79.after === undefined){
const err223 = {instancePath:instancePath+"/comparisons/" + i5,schemaPath:"#/properties/comparisons/items/required",keyword:"required",params:{missingProperty: "after"},message:"must have required property '"+"after"+"'"};
if(vErrors === null){
vErrors = [err223];
}
else {
vErrors.push(err223);
}
errors++;
}
if(data79.available === undefined){
const err224 = {instancePath:instancePath+"/comparisons/" + i5,schemaPath:"#/properties/comparisons/items/required",keyword:"required",params:{missingProperty: "available"},message:"must have required property '"+"available"+"'"};
if(vErrors === null){
vErrors = [err224];
}
else {
vErrors.push(err224);
}
errors++;
}
if(data79.comparable_fraction === undefined){
const err225 = {instancePath:instancePath+"/comparisons/" + i5,schemaPath:"#/properties/comparisons/items/required",keyword:"required",params:{missingProperty: "comparable_fraction"},message:"must have required property '"+"comparable_fraction"+"'"};
if(vErrors === null){
vErrors = [err225];
}
else {
vErrors.push(err225);
}
errors++;
}
if(data79.pixel_counts === undefined){
const err226 = {instancePath:instancePath+"/comparisons/" + i5,schemaPath:"#/properties/comparisons/items/required",keyword:"required",params:{missingProperty: "pixel_counts"},message:"must have required property '"+"pixel_counts"+"'"};
if(vErrors === null){
vErrors = [err226];
}
else {
vErrors.push(err226);
}
errors++;
}
if(data79.gain_km2 === undefined){
const err227 = {instancePath:instancePath+"/comparisons/" + i5,schemaPath:"#/properties/comparisons/items/required",keyword:"required",params:{missingProperty: "gain_km2"},message:"must have required property '"+"gain_km2"+"'"};
if(vErrors === null){
vErrors = [err227];
}
else {
vErrors.push(err227);
}
errors++;
}
if(data79.loss_km2 === undefined){
const err228 = {instancePath:instancePath+"/comparisons/" + i5,schemaPath:"#/properties/comparisons/items/required",keyword:"required",params:{missingProperty: "loss_km2"},message:"must have required property '"+"loss_km2"+"'"};
if(vErrors === null){
vErrors = [err228];
}
else {
vErrors.push(err228);
}
errors++;
}
if(data79.persistence_km2 === undefined){
const err229 = {instancePath:instancePath+"/comparisons/" + i5,schemaPath:"#/properties/comparisons/items/required",keyword:"required",params:{missingProperty: "persistence_km2"},message:"must have required property '"+"persistence_km2"+"'"};
if(vErrors === null){
vErrors = [err229];
}
else {
vErrors.push(err229);
}
errors++;
}
if(data79.classification === undefined){
const err230 = {instancePath:instancePath+"/comparisons/" + i5,schemaPath:"#/properties/comparisons/items/required",keyword:"required",params:{missingProperty: "classification"},message:"must have required property '"+"classification"+"'"};
if(vErrors === null){
vErrors = [err230];
}
else {
vErrors.push(err230);
}
errors++;
}
if(data79.preview === undefined){
const err231 = {instancePath:instancePath+"/comparisons/" + i5,schemaPath:"#/properties/comparisons/items/required",keyword:"required",params:{missingProperty: "preview"},message:"must have required property '"+"preview"+"'"};
if(vErrors === null){
vErrors = [err231];
}
else {
vErrors.push(err231);
}
errors++;
}
if(data79.water_comparable_fraction === undefined){
const err232 = {instancePath:instancePath+"/comparisons/" + i5,schemaPath:"#/properties/comparisons/items/required",keyword:"required",params:{missingProperty: "water_comparable_fraction"},message:"must have required property '"+"water_comparable_fraction"+"'"};
if(vErrors === null){
vErrors = [err232];
}
else {
vErrors.push(err232);
}
errors++;
}
for(const key13 in data79){
if(!(func2.call(schema11.properties.comparisons.items.properties, key13))){
const err233 = {instancePath:instancePath+"/comparisons/" + i5,schemaPath:"#/properties/comparisons/items/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key13},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err233];
}
else {
vErrors.push(err233);
}
errors++;
}
}
if(data79.before !== undefined){
if(typeof data79.before !== "string"){
const err234 = {instancePath:instancePath+"/comparisons/" + i5+"/before",schemaPath:"#/properties/comparisons/items/properties/before/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err234];
}
else {
vErrors.push(err234);
}
errors++;
}
}
if(data79.after !== undefined){
if(typeof data79.after !== "string"){
const err235 = {instancePath:instancePath+"/comparisons/" + i5+"/after",schemaPath:"#/properties/comparisons/items/properties/after/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err235];
}
else {
vErrors.push(err235);
}
errors++;
}
}
if(data79.available !== undefined){
if(typeof data79.available !== "boolean"){
const err236 = {instancePath:instancePath+"/comparisons/" + i5+"/available",schemaPath:"#/properties/comparisons/items/properties/available/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"};
if(vErrors === null){
vErrors = [err236];
}
else {
vErrors.push(err236);
}
errors++;
}
}
if(data79.comparable_fraction !== undefined){
let data83 = data79.comparable_fraction;
if((typeof data83 == "number") && (isFinite(data83))){
if(data83 > 1 || isNaN(data83)){
const err237 = {instancePath:instancePath+"/comparisons/" + i5+"/comparable_fraction",schemaPath:"#/properties/comparisons/items/properties/comparable_fraction/maximum",keyword:"maximum",params:{comparison: "<=", limit: 1},message:"must be <= 1"};
if(vErrors === null){
vErrors = [err237];
}
else {
vErrors.push(err237);
}
errors++;
}
if(data83 < 0 || isNaN(data83)){
const err238 = {instancePath:instancePath+"/comparisons/" + i5+"/comparable_fraction",schemaPath:"#/properties/comparisons/items/properties/comparable_fraction/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
if(vErrors === null){
vErrors = [err238];
}
else {
vErrors.push(err238);
}
errors++;
}
}
else {
const err239 = {instancePath:instancePath+"/comparisons/" + i5+"/comparable_fraction",schemaPath:"#/properties/comparisons/items/properties/comparable_fraction/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err239];
}
else {
vErrors.push(err239);
}
errors++;
}
}
if(data79.pixel_counts !== undefined){
let data84 = data79.pixel_counts;
if(data84 && typeof data84 == "object" && !Array.isArray(data84)){
if(data84["0"] === undefined){
const err240 = {instancePath:instancePath+"/comparisons/" + i5+"/pixel_counts",schemaPath:"#/properties/comparisons/items/properties/pixel_counts/required",keyword:"required",params:{missingProperty: "0"},message:"must have required property '"+"0"+"'"};
if(vErrors === null){
vErrors = [err240];
}
else {
vErrors.push(err240);
}
errors++;
}
if(data84["1"] === undefined){
const err241 = {instancePath:instancePath+"/comparisons/" + i5+"/pixel_counts",schemaPath:"#/properties/comparisons/items/properties/pixel_counts/required",keyword:"required",params:{missingProperty: "1"},message:"must have required property '"+"1"+"'"};
if(vErrors === null){
vErrors = [err241];
}
else {
vErrors.push(err241);
}
errors++;
}
if(data84["2"] === undefined){
const err242 = {instancePath:instancePath+"/comparisons/" + i5+"/pixel_counts",schemaPath:"#/properties/comparisons/items/properties/pixel_counts/required",keyword:"required",params:{missingProperty: "2"},message:"must have required property '"+"2"+"'"};
if(vErrors === null){
vErrors = [err242];
}
else {
vErrors.push(err242);
}
errors++;
}
if(data84["3"] === undefined){
const err243 = {instancePath:instancePath+"/comparisons/" + i5+"/pixel_counts",schemaPath:"#/properties/comparisons/items/properties/pixel_counts/required",keyword:"required",params:{missingProperty: "3"},message:"must have required property '"+"3"+"'"};
if(vErrors === null){
vErrors = [err243];
}
else {
vErrors.push(err243);
}
errors++;
}
if(data84["4"] === undefined){
const err244 = {instancePath:instancePath+"/comparisons/" + i5+"/pixel_counts",schemaPath:"#/properties/comparisons/items/properties/pixel_counts/required",keyword:"required",params:{missingProperty: "4"},message:"must have required property '"+"4"+"'"};
if(vErrors === null){
vErrors = [err244];
}
else {
vErrors.push(err244);
}
errors++;
}
for(const key14 in data84){
if(!(((((key14 === "0") || (key14 === "1")) || (key14 === "2")) || (key14 === "3")) || (key14 === "4"))){
const err245 = {instancePath:instancePath+"/comparisons/" + i5+"/pixel_counts",schemaPath:"#/properties/comparisons/items/properties/pixel_counts/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key14},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err245];
}
else {
vErrors.push(err245);
}
errors++;
}
}
if(data84["0"] !== undefined){
let data85 = data84["0"];
if(!(((typeof data85 == "number") && (!(data85 % 1) && !isNaN(data85))) && (isFinite(data85)))){
const err246 = {instancePath:instancePath+"/comparisons/" + i5+"/pixel_counts/0",schemaPath:"#/properties/comparisons/items/properties/pixel_counts/properties/0/type",keyword:"type",params:{type: "integer"},message:"must be integer"};
if(vErrors === null){
vErrors = [err246];
}
else {
vErrors.push(err246);
}
errors++;
}
if((typeof data85 == "number") && (isFinite(data85))){
if(data85 < 0 || isNaN(data85)){
const err247 = {instancePath:instancePath+"/comparisons/" + i5+"/pixel_counts/0",schemaPath:"#/properties/comparisons/items/properties/pixel_counts/properties/0/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
if(vErrors === null){
vErrors = [err247];
}
else {
vErrors.push(err247);
}
errors++;
}
}
}
if(data84["1"] !== undefined){
let data86 = data84["1"];
if(!(((typeof data86 == "number") && (!(data86 % 1) && !isNaN(data86))) && (isFinite(data86)))){
const err248 = {instancePath:instancePath+"/comparisons/" + i5+"/pixel_counts/1",schemaPath:"#/properties/comparisons/items/properties/pixel_counts/properties/1/type",keyword:"type",params:{type: "integer"},message:"must be integer"};
if(vErrors === null){
vErrors = [err248];
}
else {
vErrors.push(err248);
}
errors++;
}
if((typeof data86 == "number") && (isFinite(data86))){
if(data86 < 0 || isNaN(data86)){
const err249 = {instancePath:instancePath+"/comparisons/" + i5+"/pixel_counts/1",schemaPath:"#/properties/comparisons/items/properties/pixel_counts/properties/1/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
if(vErrors === null){
vErrors = [err249];
}
else {
vErrors.push(err249);
}
errors++;
}
}
}
if(data84["2"] !== undefined){
let data87 = data84["2"];
if(!(((typeof data87 == "number") && (!(data87 % 1) && !isNaN(data87))) && (isFinite(data87)))){
const err250 = {instancePath:instancePath+"/comparisons/" + i5+"/pixel_counts/2",schemaPath:"#/properties/comparisons/items/properties/pixel_counts/properties/2/type",keyword:"type",params:{type: "integer"},message:"must be integer"};
if(vErrors === null){
vErrors = [err250];
}
else {
vErrors.push(err250);
}
errors++;
}
if((typeof data87 == "number") && (isFinite(data87))){
if(data87 < 0 || isNaN(data87)){
const err251 = {instancePath:instancePath+"/comparisons/" + i5+"/pixel_counts/2",schemaPath:"#/properties/comparisons/items/properties/pixel_counts/properties/2/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
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
if(data84["3"] !== undefined){
let data88 = data84["3"];
if(!(((typeof data88 == "number") && (!(data88 % 1) && !isNaN(data88))) && (isFinite(data88)))){
const err252 = {instancePath:instancePath+"/comparisons/" + i5+"/pixel_counts/3",schemaPath:"#/properties/comparisons/items/properties/pixel_counts/properties/3/type",keyword:"type",params:{type: "integer"},message:"must be integer"};
if(vErrors === null){
vErrors = [err252];
}
else {
vErrors.push(err252);
}
errors++;
}
if((typeof data88 == "number") && (isFinite(data88))){
if(data88 < 0 || isNaN(data88)){
const err253 = {instancePath:instancePath+"/comparisons/" + i5+"/pixel_counts/3",schemaPath:"#/properties/comparisons/items/properties/pixel_counts/properties/3/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
if(vErrors === null){
vErrors = [err253];
}
else {
vErrors.push(err253);
}
errors++;
}
}
}
if(data84["4"] !== undefined){
let data89 = data84["4"];
if(!(((typeof data89 == "number") && (!(data89 % 1) && !isNaN(data89))) && (isFinite(data89)))){
const err254 = {instancePath:instancePath+"/comparisons/" + i5+"/pixel_counts/4",schemaPath:"#/properties/comparisons/items/properties/pixel_counts/properties/4/type",keyword:"type",params:{type: "integer"},message:"must be integer"};
if(vErrors === null){
vErrors = [err254];
}
else {
vErrors.push(err254);
}
errors++;
}
if((typeof data89 == "number") && (isFinite(data89))){
if(data89 < 0 || isNaN(data89)){
const err255 = {instancePath:instancePath+"/comparisons/" + i5+"/pixel_counts/4",schemaPath:"#/properties/comparisons/items/properties/pixel_counts/properties/4/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
if(vErrors === null){
vErrors = [err255];
}
else {
vErrors.push(err255);
}
errors++;
}
}
}
}
else {
const err256 = {instancePath:instancePath+"/comparisons/" + i5+"/pixel_counts",schemaPath:"#/properties/comparisons/items/properties/pixel_counts/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err256];
}
else {
vErrors.push(err256);
}
errors++;
}
}
if(data79.gain_km2 !== undefined){
let data90 = data79.gain_km2;
if((!((typeof data90 == "number") && (isFinite(data90)))) && (data90 !== null)){
const err257 = {instancePath:instancePath+"/comparisons/" + i5+"/gain_km2",schemaPath:"#/properties/comparisons/items/properties/gain_km2/type",keyword:"type",params:{type: schema11.properties.comparisons.items.properties.gain_km2.type},message:"must be number,null"};
if(vErrors === null){
vErrors = [err257];
}
else {
vErrors.push(err257);
}
errors++;
}
if((typeof data90 == "number") && (isFinite(data90))){
if(data90 < 0 || isNaN(data90)){
const err258 = {instancePath:instancePath+"/comparisons/" + i5+"/gain_km2",schemaPath:"#/properties/comparisons/items/properties/gain_km2/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
if(vErrors === null){
vErrors = [err258];
}
else {
vErrors.push(err258);
}
errors++;
}
}
}
if(data79.loss_km2 !== undefined){
let data91 = data79.loss_km2;
if((!((typeof data91 == "number") && (isFinite(data91)))) && (data91 !== null)){
const err259 = {instancePath:instancePath+"/comparisons/" + i5+"/loss_km2",schemaPath:"#/properties/comparisons/items/properties/loss_km2/type",keyword:"type",params:{type: schema11.properties.comparisons.items.properties.loss_km2.type},message:"must be number,null"};
if(vErrors === null){
vErrors = [err259];
}
else {
vErrors.push(err259);
}
errors++;
}
if((typeof data91 == "number") && (isFinite(data91))){
if(data91 < 0 || isNaN(data91)){
const err260 = {instancePath:instancePath+"/comparisons/" + i5+"/loss_km2",schemaPath:"#/properties/comparisons/items/properties/loss_km2/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
if(vErrors === null){
vErrors = [err260];
}
else {
vErrors.push(err260);
}
errors++;
}
}
}
if(data79.persistence_km2 !== undefined){
let data92 = data79.persistence_km2;
if((!((typeof data92 == "number") && (isFinite(data92)))) && (data92 !== null)){
const err261 = {instancePath:instancePath+"/comparisons/" + i5+"/persistence_km2",schemaPath:"#/properties/comparisons/items/properties/persistence_km2/type",keyword:"type",params:{type: schema11.properties.comparisons.items.properties.persistence_km2.type},message:"must be number,null"};
if(vErrors === null){
vErrors = [err261];
}
else {
vErrors.push(err261);
}
errors++;
}
if((typeof data92 == "number") && (isFinite(data92))){
if(data92 < 0 || isNaN(data92)){
const err262 = {instancePath:instancePath+"/comparisons/" + i5+"/persistence_km2",schemaPath:"#/properties/comparisons/items/properties/persistence_km2/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
if(vErrors === null){
vErrors = [err262];
}
else {
vErrors.push(err262);
}
errors++;
}
}
}
if(data79.classification !== undefined){
let data93 = data79.classification;
if(data93 && typeof data93 == "object" && !Array.isArray(data93)){
if(data93.path === undefined){
const err263 = {instancePath:instancePath+"/comparisons/" + i5+"/classification",schemaPath:"#/definitions/artifact/required",keyword:"required",params:{missingProperty: "path"},message:"must have required property '"+"path"+"'"};
if(vErrors === null){
vErrors = [err263];
}
else {
vErrors.push(err263);
}
errors++;
}
if(data93.sha256 === undefined){
const err264 = {instancePath:instancePath+"/comparisons/" + i5+"/classification",schemaPath:"#/definitions/artifact/required",keyword:"required",params:{missingProperty: "sha256"},message:"must have required property '"+"sha256"+"'"};
if(vErrors === null){
vErrors = [err264];
}
else {
vErrors.push(err264);
}
errors++;
}
if(data93.byte_size === undefined){
const err265 = {instancePath:instancePath+"/comparisons/" + i5+"/classification",schemaPath:"#/definitions/artifact/required",keyword:"required",params:{missingProperty: "byte_size"},message:"must have required property '"+"byte_size"+"'"};
if(vErrors === null){
vErrors = [err265];
}
else {
vErrors.push(err265);
}
errors++;
}
for(const key15 in data93){
if(!(((key15 === "path") || (key15 === "sha256")) || (key15 === "byte_size"))){
const err266 = {instancePath:instancePath+"/comparisons/" + i5+"/classification",schemaPath:"#/definitions/artifact/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key15},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err266];
}
else {
vErrors.push(err266);
}
errors++;
}
}
if(data93.path !== undefined){
let data94 = data93.path;
if(typeof data94 === "string"){
if(!pattern0.test(data94)){
const err267 = {instancePath:instancePath+"/comparisons/" + i5+"/classification/path",schemaPath:"#/definitions/artifact/properties/path/pattern",keyword:"pattern",params:{pattern: "^/data/phewa-water-change/1\\.0\\.0/[a-z0-9.-]+\\.(png|json)$"},message:"must match pattern \""+"^/data/phewa-water-change/1\\.0\\.0/[a-z0-9.-]+\\.(png|json)$"+"\""};
if(vErrors === null){
vErrors = [err267];
}
else {
vErrors.push(err267);
}
errors++;
}
}
else {
const err268 = {instancePath:instancePath+"/comparisons/" + i5+"/classification/path",schemaPath:"#/definitions/artifact/properties/path/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err268];
}
else {
vErrors.push(err268);
}
errors++;
}
}
if(data93.sha256 !== undefined){
let data95 = data93.sha256;
if(typeof data95 === "string"){
if(!pattern1.test(data95)){
const err269 = {instancePath:instancePath+"/comparisons/" + i5+"/classification/sha256",schemaPath:"#/definitions/artifact/properties/sha256/pattern",keyword:"pattern",params:{pattern: "^[a-f0-9]{64}$"},message:"must match pattern \""+"^[a-f0-9]{64}$"+"\""};
if(vErrors === null){
vErrors = [err269];
}
else {
vErrors.push(err269);
}
errors++;
}
}
else {
const err270 = {instancePath:instancePath+"/comparisons/" + i5+"/classification/sha256",schemaPath:"#/definitions/artifact/properties/sha256/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err270];
}
else {
vErrors.push(err270);
}
errors++;
}
}
if(data93.byte_size !== undefined){
let data96 = data93.byte_size;
if(!(((typeof data96 == "number") && (!(data96 % 1) && !isNaN(data96))) && (isFinite(data96)))){
const err271 = {instancePath:instancePath+"/comparisons/" + i5+"/classification/byte_size",schemaPath:"#/definitions/artifact/properties/byte_size/type",keyword:"type",params:{type: "integer"},message:"must be integer"};
if(vErrors === null){
vErrors = [err271];
}
else {
vErrors.push(err271);
}
errors++;
}
if((typeof data96 == "number") && (isFinite(data96))){
if(data96 > 4194304 || isNaN(data96)){
const err272 = {instancePath:instancePath+"/comparisons/" + i5+"/classification/byte_size",schemaPath:"#/definitions/artifact/properties/byte_size/maximum",keyword:"maximum",params:{comparison: "<=", limit: 4194304},message:"must be <= 4194304"};
if(vErrors === null){
vErrors = [err272];
}
else {
vErrors.push(err272);
}
errors++;
}
if(data96 < 1 || isNaN(data96)){
const err273 = {instancePath:instancePath+"/comparisons/" + i5+"/classification/byte_size",schemaPath:"#/definitions/artifact/properties/byte_size/minimum",keyword:"minimum",params:{comparison: ">=", limit: 1},message:"must be >= 1"};
if(vErrors === null){
vErrors = [err273];
}
else {
vErrors.push(err273);
}
errors++;
}
}
}
}
else {
const err274 = {instancePath:instancePath+"/comparisons/" + i5+"/classification",schemaPath:"#/definitions/artifact/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err274];
}
else {
vErrors.push(err274);
}
errors++;
}
}
if(data79.preview !== undefined){
let data97 = data79.preview;
if(data97 && typeof data97 == "object" && !Array.isArray(data97)){
if(data97.path === undefined){
const err275 = {instancePath:instancePath+"/comparisons/" + i5+"/preview",schemaPath:"#/definitions/artifact/required",keyword:"required",params:{missingProperty: "path"},message:"must have required property '"+"path"+"'"};
if(vErrors === null){
vErrors = [err275];
}
else {
vErrors.push(err275);
}
errors++;
}
if(data97.sha256 === undefined){
const err276 = {instancePath:instancePath+"/comparisons/" + i5+"/preview",schemaPath:"#/definitions/artifact/required",keyword:"required",params:{missingProperty: "sha256"},message:"must have required property '"+"sha256"+"'"};
if(vErrors === null){
vErrors = [err276];
}
else {
vErrors.push(err276);
}
errors++;
}
if(data97.byte_size === undefined){
const err277 = {instancePath:instancePath+"/comparisons/" + i5+"/preview",schemaPath:"#/definitions/artifact/required",keyword:"required",params:{missingProperty: "byte_size"},message:"must have required property '"+"byte_size"+"'"};
if(vErrors === null){
vErrors = [err277];
}
else {
vErrors.push(err277);
}
errors++;
}
for(const key16 in data97){
if(!(((key16 === "path") || (key16 === "sha256")) || (key16 === "byte_size"))){
const err278 = {instancePath:instancePath+"/comparisons/" + i5+"/preview",schemaPath:"#/definitions/artifact/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key16},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err278];
}
else {
vErrors.push(err278);
}
errors++;
}
}
if(data97.path !== undefined){
let data98 = data97.path;
if(typeof data98 === "string"){
if(!pattern0.test(data98)){
const err279 = {instancePath:instancePath+"/comparisons/" + i5+"/preview/path",schemaPath:"#/definitions/artifact/properties/path/pattern",keyword:"pattern",params:{pattern: "^/data/phewa-water-change/1\\.0\\.0/[a-z0-9.-]+\\.(png|json)$"},message:"must match pattern \""+"^/data/phewa-water-change/1\\.0\\.0/[a-z0-9.-]+\\.(png|json)$"+"\""};
if(vErrors === null){
vErrors = [err279];
}
else {
vErrors.push(err279);
}
errors++;
}
}
else {
const err280 = {instancePath:instancePath+"/comparisons/" + i5+"/preview/path",schemaPath:"#/definitions/artifact/properties/path/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err280];
}
else {
vErrors.push(err280);
}
errors++;
}
}
if(data97.sha256 !== undefined){
let data99 = data97.sha256;
if(typeof data99 === "string"){
if(!pattern1.test(data99)){
const err281 = {instancePath:instancePath+"/comparisons/" + i5+"/preview/sha256",schemaPath:"#/definitions/artifact/properties/sha256/pattern",keyword:"pattern",params:{pattern: "^[a-f0-9]{64}$"},message:"must match pattern \""+"^[a-f0-9]{64}$"+"\""};
if(vErrors === null){
vErrors = [err281];
}
else {
vErrors.push(err281);
}
errors++;
}
}
else {
const err282 = {instancePath:instancePath+"/comparisons/" + i5+"/preview/sha256",schemaPath:"#/definitions/artifact/properties/sha256/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err282];
}
else {
vErrors.push(err282);
}
errors++;
}
}
if(data97.byte_size !== undefined){
let data100 = data97.byte_size;
if(!(((typeof data100 == "number") && (!(data100 % 1) && !isNaN(data100))) && (isFinite(data100)))){
const err283 = {instancePath:instancePath+"/comparisons/" + i5+"/preview/byte_size",schemaPath:"#/definitions/artifact/properties/byte_size/type",keyword:"type",params:{type: "integer"},message:"must be integer"};
if(vErrors === null){
vErrors = [err283];
}
else {
vErrors.push(err283);
}
errors++;
}
if((typeof data100 == "number") && (isFinite(data100))){
if(data100 > 4194304 || isNaN(data100)){
const err284 = {instancePath:instancePath+"/comparisons/" + i5+"/preview/byte_size",schemaPath:"#/definitions/artifact/properties/byte_size/maximum",keyword:"maximum",params:{comparison: "<=", limit: 4194304},message:"must be <= 4194304"};
if(vErrors === null){
vErrors = [err284];
}
else {
vErrors.push(err284);
}
errors++;
}
if(data100 < 1 || isNaN(data100)){
const err285 = {instancePath:instancePath+"/comparisons/" + i5+"/preview/byte_size",schemaPath:"#/definitions/artifact/properties/byte_size/minimum",keyword:"minimum",params:{comparison: ">=", limit: 1},message:"must be >= 1"};
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
}
else {
const err286 = {instancePath:instancePath+"/comparisons/" + i5+"/preview",schemaPath:"#/definitions/artifact/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err286];
}
else {
vErrors.push(err286);
}
errors++;
}
}
if(data79.water_comparable_fraction !== undefined){
let data101 = data79.water_comparable_fraction;
if((!((typeof data101 == "number") && (isFinite(data101)))) && (data101 !== null)){
const err287 = {instancePath:instancePath+"/comparisons/" + i5+"/water_comparable_fraction",schemaPath:"#/properties/comparisons/items/properties/water_comparable_fraction/type",keyword:"type",params:{type: schema11.properties.comparisons.items.properties.water_comparable_fraction.type},message:"must be number,null"};
if(vErrors === null){
vErrors = [err287];
}
else {
vErrors.push(err287);
}
errors++;
}
if((typeof data101 == "number") && (isFinite(data101))){
if(data101 > 1 || isNaN(data101)){
const err288 = {instancePath:instancePath+"/comparisons/" + i5+"/water_comparable_fraction",schemaPath:"#/properties/comparisons/items/properties/water_comparable_fraction/maximum",keyword:"maximum",params:{comparison: "<=", limit: 1},message:"must be <= 1"};
if(vErrors === null){
vErrors = [err288];
}
else {
vErrors.push(err288);
}
errors++;
}
if(data101 < 0 || isNaN(data101)){
const err289 = {instancePath:instancePath+"/comparisons/" + i5+"/water_comparable_fraction",schemaPath:"#/properties/comparisons/items/properties/water_comparable_fraction/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
if(vErrors === null){
vErrors = [err289];
}
else {
vErrors.push(err289);
}
errors++;
}
}
}
}
else {
const err290 = {instancePath:instancePath+"/comparisons/" + i5,schemaPath:"#/properties/comparisons/items/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err290];
}
else {
vErrors.push(err290);
}
errors++;
}
}
}
else {
const err291 = {instancePath:instancePath+"/comparisons",schemaPath:"#/properties/comparisons/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err291];
}
else {
vErrors.push(err291);
}
errors++;
}
}
}
else {
const err292 = {instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err292];
}
else {
vErrors.push(err292);
}
errors++;
}
validate10.errors = vErrors;
return errors === 0;
}

