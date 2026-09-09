// Generated from terrain.schema.json; run npm run contracts:generate. Do not edit.
"use strict";
module.exports = validate10;
module.exports.default = validate10;
const schema11 = {"$schema":"http://json-schema.org/draft-07/schema#","$id":"https://himalayan-disaster-atlas.invalid/schemas/terrain.schema.json","type":"object","additionalProperties":false,"required":["metadata","raster"],"properties":{"metadata":{"type":"object","additionalProperties":false,"required":["schema_version","dataset_id","dataset_name","dataset_version","source","source_url","license","license_url","attribution","observation_date","publication_date","retrieval_date","processing_date","processing_version","method","spatial_resolution","temporal_resolution","spatial_coverage","temporal_coverage","crs","status","evidence_type","is_fixture","limitations","uncertainty","update_frequency","stale_after","artifact"],"properties":{"schema_version":{"const":"2.0.0"},"dataset_id":{"$ref":"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/dataset_id"},"dataset_name":{"$ref":"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/dataset_name"},"dataset_version":{"$ref":"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/dataset_version"},"source":{"$ref":"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/source"},"source_url":{"$ref":"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/source_url"},"license":{"$ref":"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/license"},"license_url":{"$ref":"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/license_url"},"attribution":{"$ref":"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/attribution"},"observation_date":{"$ref":"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/observation_date"},"publication_date":{"$ref":"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/publication_date"},"retrieval_date":{"$ref":"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/retrieval_date"},"processing_date":{"$ref":"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/processing_date"},"processing_version":{"$ref":"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/processing_version"},"method":{"$ref":"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/method"},"spatial_resolution":{"$ref":"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/spatial_resolution"},"temporal_resolution":{"$ref":"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/temporal_resolution"},"spatial_coverage":{"$ref":"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/spatial_coverage"},"temporal_coverage":{"$ref":"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/temporal_coverage"},"crs":{"$ref":"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/crs"},"status":{"$ref":"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/status"},"evidence_type":{"$ref":"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/evidence_type"},"is_fixture":{"$ref":"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/is_fixture"},"limitations":{"$ref":"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/limitations"},"uncertainty":{"$ref":"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/uncertainty"},"update_frequency":{"$ref":"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/update_frequency"},"stale_after":{"$ref":"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/stale_after"},"artifact":{"type":"object","additionalProperties":false,"required":["path","format","sha256","byte_size"],"properties":{"path":{"type":"string","pattern":"^/data/(?:nepal-terrain|asia-terrain-context)/[0-9]+\\.[0-9]+\\.[0-9]+/tiles\\.json$"},"format":{"const":"TerrainRGB-index"},"sha256":{"type":"string","pattern":"^[a-f0-9]{64}$"},"byte_size":{"type":"integer","minimum":1,"maximum":131072}}}}},"raster":{"type":"object","additionalProperties":false,"required":["crs","vertical_datum","unit","tile_size","minzoom","maxzoom","encoding","nodata","native_crs","native_resolution_degree","resampling","tile_count"],"properties":{"crs":{"const":"EPSG:3857"},"vertical_datum":{"enum":["EGM2008 (EPSG:3855)",null]},"unit":{"const":"m"},"tile_size":{"const":256},"minzoom":{"enum":[1,5]},"maxzoom":{"enum":[5,9]},"encoding":{"const":"mapbox"},"nodata":{"type":"null"},"native_crs":{"enum":["EPSG:4326","EPSG:3857"]},"native_resolution_degree":{"anyOf":[{"type":"number","exclusiveMinimum":0},{"type":"null"}]},"resampling":{"enum":["bilinear","none"]},"tile_count":{"enum":[341,682]}}}}};
const schema21 = {"type":"string","pattern":"^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$"};
const schema22 = {"type":"string","minLength":1};
const schema23 = {"type":"string","pattern":"^[0-9]+\\.[0-9]+\\.[0-9]+$"};
const schema24 = {"type":"string","minLength":1};
const schema25 = {"anyOf":[{"type":"string","format":"uri","pattern":"^https://"},{"type":"null"}]};
const schema26 = {"type":"string","minLength":1};
const schema27 = {"anyOf":[{"type":"string","format":"uri","pattern":"^https://"},{"type":"null"}]};
const schema28 = {"type":"string","minLength":1};
const schema29 = {"anyOf":[{"type":"string","format":"date-time"},{"type":"null"}]};
const schema30 = {"anyOf":[{"type":"string","format":"date-time"},{"type":"null"}]};
const schema31 = {"type":"string","format":"date-time"};
const schema32 = {"type":"string","format":"date-time"};
const schema33 = {"type":"string","minLength":1};
const schema34 = {"type":"string","minLength":1};
const schema35 = {"type":"object","additionalProperties":false,"properties":{"value":{"anyOf":[{"type":"number","exclusiveMinimum":0},{"type":"null"}]},"unit":{"enum":["m","degree",null]}},"required":["value","unit"]};
const schema36 = {"anyOf":[{"type":"string","minLength":1},{"type":"null"}]};
const schema37 = {"type":"object","additionalProperties":false,"properties":{"description":{"type":"string","minLength":1},"bbox":{"type":"array","items":{"type":"number"},"minItems":4,"maxItems":4}},"required":["description","bbox"]};
const schema38 = {"type":"object","additionalProperties":false,"properties":{"start":{"anyOf":[{"type":"string","format":"date-time"},{"type":"null"}]},"end":{"anyOf":[{"type":"string","format":"date-time"},{"type":"null"}]}},"required":["start","end"]};
const schema39 = {"const":"OGC:CRS84"};
const schema40 = {"enum":["VERIFIED_SOURCE","SATELLITE_DERIVED","ATLAS_DERIVED","ESTIMATED","MODELLED","HISTORICAL","UNKNOWN"]};
const schema41 = {"enum":["observed","derived","estimated","modelled","historical","unknown"]};
const schema42 = {"type":"boolean"};
const schema43 = {"type":"array","items":{"type":"string","minLength":1},"minItems":1};
const schema44 = {"type":"string","minLength":1};
const schema45 = {"enum":["static","periodic","operational"]};
const schema46 = {"anyOf":[{"type":"string","format":"date-time"},{"type":"null"}]};
const func2 = Object.prototype.hasOwnProperty;
const func4 = require("ajv/dist/runtime/ucs2length").default;
const pattern2 = new RegExp("^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$", "u");
const pattern3 = new RegExp("^[0-9]+\\.[0-9]+\\.[0-9]+$", "u");
const pattern0 = new RegExp("^https://", "u");
const pattern17 = new RegExp("^/data/(?:nepal-terrain|asia-terrain-context)/[0-9]+\\.[0-9]+\\.[0-9]+/tiles\\.json$", "u");
const pattern7 = new RegExp("^[a-f0-9]{64}$", "u");
const formats4 = require("ajv-formats/dist/formats").fullFormats.uri;
const formats0 = require("ajv-formats/dist/formats").fullFormats["date-time"];

function validate10(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
/*# sourceURL="https://himalayan-disaster-atlas.invalid/schemas/terrain.schema.json" */;
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
if(data.raster === undefined){
const err1 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "raster"},message:"must have required property '"+"raster"+"'"};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
for(const key0 in data){
if(!((key0 === "metadata") || (key0 === "raster"))){
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
if("2.0.0" !== data0.schema_version){
const err32 = {instancePath:instancePath+"/metadata/schema_version",schemaPath:"#/properties/metadata/properties/schema_version/const",keyword:"const",params:{allowedValue: "2.0.0"},message:"must be equal to constant"};
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
let data2 = data0.dataset_id;
if(typeof data2 === "string"){
if(!pattern2.test(data2)){
const err33 = {instancePath:instancePath+"/metadata/dataset_id",schemaPath:"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/dataset_id/pattern",keyword:"pattern",params:{pattern: "^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$"},message:"must match pattern \""+"^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$"+"\""};
if(vErrors === null){
vErrors = [err33];
}
else {
vErrors.push(err33);
}
errors++;
}
}
else {
const err34 = {instancePath:instancePath+"/metadata/dataset_id",schemaPath:"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/dataset_id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err34];
}
else {
vErrors.push(err34);
}
errors++;
}
}
if(data0.dataset_name !== undefined){
let data3 = data0.dataset_name;
if(typeof data3 === "string"){
if(func4(data3) < 1){
const err35 = {instancePath:instancePath+"/metadata/dataset_name",schemaPath:"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/dataset_name/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err35];
}
else {
vErrors.push(err35);
}
errors++;
}
}
else {
const err36 = {instancePath:instancePath+"/metadata/dataset_name",schemaPath:"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/dataset_name/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err36];
}
else {
vErrors.push(err36);
}
errors++;
}
}
if(data0.dataset_version !== undefined){
let data4 = data0.dataset_version;
if(typeof data4 === "string"){
if(!pattern3.test(data4)){
const err37 = {instancePath:instancePath+"/metadata/dataset_version",schemaPath:"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/dataset_version/pattern",keyword:"pattern",params:{pattern: "^[0-9]+\\.[0-9]+\\.[0-9]+$"},message:"must match pattern \""+"^[0-9]+\\.[0-9]+\\.[0-9]+$"+"\""};
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
const err38 = {instancePath:instancePath+"/metadata/dataset_version",schemaPath:"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/dataset_version/type",keyword:"type",params:{type: "string"},message:"must be string"};
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
if(func4(data5) < 1){
const err39 = {instancePath:instancePath+"/metadata/source",schemaPath:"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/source/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
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
const err40 = {instancePath:instancePath+"/metadata/source",schemaPath:"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/source/type",keyword:"type",params:{type: "string"},message:"must be string"};
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
const _errs20 = errors;
let valid7 = false;
const _errs21 = errors;
if(typeof data6 === "string"){
if(!pattern0.test(data6)){
const err41 = {instancePath:instancePath+"/metadata/source_url",schemaPath:"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/source_url/anyOf/0/pattern",keyword:"pattern",params:{pattern: "^https://"},message:"must match pattern \""+"^https://"+"\""};
if(vErrors === null){
vErrors = [err41];
}
else {
vErrors.push(err41);
}
errors++;
}
if(!(formats4(data6))){
const err42 = {instancePath:instancePath+"/metadata/source_url",schemaPath:"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/source_url/anyOf/0/format",keyword:"format",params:{format: "uri"},message:"must match format \""+"uri"+"\""};
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
const err43 = {instancePath:instancePath+"/metadata/source_url",schemaPath:"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/source_url/anyOf/0/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err43];
}
else {
vErrors.push(err43);
}
errors++;
}
var _valid0 = _errs21 === errors;
valid7 = valid7 || _valid0;
if(!valid7){
const _errs23 = errors;
if(data6 !== null){
const err44 = {instancePath:instancePath+"/metadata/source_url",schemaPath:"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/source_url/anyOf/1/type",keyword:"type",params:{type: "null"},message:"must be null"};
if(vErrors === null){
vErrors = [err44];
}
else {
vErrors.push(err44);
}
errors++;
}
var _valid0 = _errs23 === errors;
valid7 = valid7 || _valid0;
}
if(!valid7){
const err45 = {instancePath:instancePath+"/metadata/source_url",schemaPath:"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/source_url/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err45];
}
else {
vErrors.push(err45);
}
errors++;
}
else {
errors = _errs20;
if(vErrors !== null){
if(_errs20){
vErrors.length = _errs20;
}
else {
vErrors = null;
}
}
}
}
if(data0.license !== undefined){
let data7 = data0.license;
if(typeof data7 === "string"){
if(func4(data7) < 1){
const err46 = {instancePath:instancePath+"/metadata/license",schemaPath:"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/license/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err46];
}
else {
vErrors.push(err46);
}
errors++;
}
}
else {
const err47 = {instancePath:instancePath+"/metadata/license",schemaPath:"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/license/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err47];
}
else {
vErrors.push(err47);
}
errors++;
}
}
if(data0.license_url !== undefined){
let data8 = data0.license_url;
const _errs30 = errors;
let valid10 = false;
const _errs31 = errors;
if(typeof data8 === "string"){
if(!pattern0.test(data8)){
const err48 = {instancePath:instancePath+"/metadata/license_url",schemaPath:"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/license_url/anyOf/0/pattern",keyword:"pattern",params:{pattern: "^https://"},message:"must match pattern \""+"^https://"+"\""};
if(vErrors === null){
vErrors = [err48];
}
else {
vErrors.push(err48);
}
errors++;
}
if(!(formats4(data8))){
const err49 = {instancePath:instancePath+"/metadata/license_url",schemaPath:"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/license_url/anyOf/0/format",keyword:"format",params:{format: "uri"},message:"must match format \""+"uri"+"\""};
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
const err50 = {instancePath:instancePath+"/metadata/license_url",schemaPath:"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/license_url/anyOf/0/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err50];
}
else {
vErrors.push(err50);
}
errors++;
}
var _valid1 = _errs31 === errors;
valid10 = valid10 || _valid1;
if(!valid10){
const _errs33 = errors;
if(data8 !== null){
const err51 = {instancePath:instancePath+"/metadata/license_url",schemaPath:"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/license_url/anyOf/1/type",keyword:"type",params:{type: "null"},message:"must be null"};
if(vErrors === null){
vErrors = [err51];
}
else {
vErrors.push(err51);
}
errors++;
}
var _valid1 = _errs33 === errors;
valid10 = valid10 || _valid1;
}
if(!valid10){
const err52 = {instancePath:instancePath+"/metadata/license_url",schemaPath:"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/license_url/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err52];
}
else {
vErrors.push(err52);
}
errors++;
}
else {
errors = _errs30;
if(vErrors !== null){
if(_errs30){
vErrors.length = _errs30;
}
else {
vErrors = null;
}
}
}
}
if(data0.attribution !== undefined){
let data9 = data0.attribution;
if(typeof data9 === "string"){
if(func4(data9) < 1){
const err53 = {instancePath:instancePath+"/metadata/attribution",schemaPath:"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/attribution/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
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
const err54 = {instancePath:instancePath+"/metadata/attribution",schemaPath:"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/attribution/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err54];
}
else {
vErrors.push(err54);
}
errors++;
}
}
if(data0.observation_date !== undefined){
let data10 = data0.observation_date;
const _errs40 = errors;
let valid13 = false;
const _errs41 = errors;
if(typeof data10 === "string"){
if(!(formats0.validate(data10))){
const err55 = {instancePath:instancePath+"/metadata/observation_date",schemaPath:"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/observation_date/anyOf/0/format",keyword:"format",params:{format: "date-time"},message:"must match format \""+"date-time"+"\""};
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
const err56 = {instancePath:instancePath+"/metadata/observation_date",schemaPath:"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/observation_date/anyOf/0/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err56];
}
else {
vErrors.push(err56);
}
errors++;
}
var _valid2 = _errs41 === errors;
valid13 = valid13 || _valid2;
if(!valid13){
const _errs43 = errors;
if(data10 !== null){
const err57 = {instancePath:instancePath+"/metadata/observation_date",schemaPath:"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/observation_date/anyOf/1/type",keyword:"type",params:{type: "null"},message:"must be null"};
if(vErrors === null){
vErrors = [err57];
}
else {
vErrors.push(err57);
}
errors++;
}
var _valid2 = _errs43 === errors;
valid13 = valid13 || _valid2;
}
if(!valid13){
const err58 = {instancePath:instancePath+"/metadata/observation_date",schemaPath:"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/observation_date/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err58];
}
else {
vErrors.push(err58);
}
errors++;
}
else {
errors = _errs40;
if(vErrors !== null){
if(_errs40){
vErrors.length = _errs40;
}
else {
vErrors = null;
}
}
}
}
if(data0.publication_date !== undefined){
let data11 = data0.publication_date;
const _errs47 = errors;
let valid15 = false;
const _errs48 = errors;
if(typeof data11 === "string"){
if(!(formats0.validate(data11))){
const err59 = {instancePath:instancePath+"/metadata/publication_date",schemaPath:"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/publication_date/anyOf/0/format",keyword:"format",params:{format: "date-time"},message:"must match format \""+"date-time"+"\""};
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
const err60 = {instancePath:instancePath+"/metadata/publication_date",schemaPath:"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/publication_date/anyOf/0/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err60];
}
else {
vErrors.push(err60);
}
errors++;
}
var _valid3 = _errs48 === errors;
valid15 = valid15 || _valid3;
if(!valid15){
const _errs50 = errors;
if(data11 !== null){
const err61 = {instancePath:instancePath+"/metadata/publication_date",schemaPath:"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/publication_date/anyOf/1/type",keyword:"type",params:{type: "null"},message:"must be null"};
if(vErrors === null){
vErrors = [err61];
}
else {
vErrors.push(err61);
}
errors++;
}
var _valid3 = _errs50 === errors;
valid15 = valid15 || _valid3;
}
if(!valid15){
const err62 = {instancePath:instancePath+"/metadata/publication_date",schemaPath:"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/publication_date/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err62];
}
else {
vErrors.push(err62);
}
errors++;
}
else {
errors = _errs47;
if(vErrors !== null){
if(_errs47){
vErrors.length = _errs47;
}
else {
vErrors = null;
}
}
}
}
if(data0.retrieval_date !== undefined){
let data12 = data0.retrieval_date;
if(typeof data12 === "string"){
if(!(formats0.validate(data12))){
const err63 = {instancePath:instancePath+"/metadata/retrieval_date",schemaPath:"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/retrieval_date/format",keyword:"format",params:{format: "date-time"},message:"must match format \""+"date-time"+"\""};
if(vErrors === null){
vErrors = [err63];
}
else {
vErrors.push(err63);
}
errors++;
}
}
else {
const err64 = {instancePath:instancePath+"/metadata/retrieval_date",schemaPath:"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/retrieval_date/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err64];
}
else {
vErrors.push(err64);
}
errors++;
}
}
if(data0.processing_date !== undefined){
let data13 = data0.processing_date;
if(typeof data13 === "string"){
if(!(formats0.validate(data13))){
const err65 = {instancePath:instancePath+"/metadata/processing_date",schemaPath:"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/processing_date/format",keyword:"format",params:{format: "date-time"},message:"must match format \""+"date-time"+"\""};
if(vErrors === null){
vErrors = [err65];
}
else {
vErrors.push(err65);
}
errors++;
}
}
else {
const err66 = {instancePath:instancePath+"/metadata/processing_date",schemaPath:"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/processing_date/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err66];
}
else {
vErrors.push(err66);
}
errors++;
}
}
if(data0.processing_version !== undefined){
let data14 = data0.processing_version;
if(typeof data14 === "string"){
if(func4(data14) < 1){
const err67 = {instancePath:instancePath+"/metadata/processing_version",schemaPath:"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/processing_version/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
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
const err68 = {instancePath:instancePath+"/metadata/processing_version",schemaPath:"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/processing_version/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err68];
}
else {
vErrors.push(err68);
}
errors++;
}
}
if(data0.method !== undefined){
let data15 = data0.method;
if(typeof data15 === "string"){
if(func4(data15) < 1){
const err69 = {instancePath:instancePath+"/metadata/method",schemaPath:"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/method/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
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
const err70 = {instancePath:instancePath+"/metadata/method",schemaPath:"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/method/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err70];
}
else {
vErrors.push(err70);
}
errors++;
}
}
if(data0.spatial_resolution !== undefined){
let data16 = data0.spatial_resolution;
if(data16 && typeof data16 == "object" && !Array.isArray(data16)){
if(data16.value === undefined){
const err71 = {instancePath:instancePath+"/metadata/spatial_resolution",schemaPath:"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/spatial_resolution/required",keyword:"required",params:{missingProperty: "value"},message:"must have required property '"+"value"+"'"};
if(vErrors === null){
vErrors = [err71];
}
else {
vErrors.push(err71);
}
errors++;
}
if(data16.unit === undefined){
const err72 = {instancePath:instancePath+"/metadata/spatial_resolution",schemaPath:"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/spatial_resolution/required",keyword:"required",params:{missingProperty: "unit"},message:"must have required property '"+"unit"+"'"};
if(vErrors === null){
vErrors = [err72];
}
else {
vErrors.push(err72);
}
errors++;
}
for(const key2 in data16){
if(!((key2 === "value") || (key2 === "unit"))){
const err73 = {instancePath:instancePath+"/metadata/spatial_resolution",schemaPath:"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/spatial_resolution/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key2},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err73];
}
else {
vErrors.push(err73);
}
errors++;
}
}
if(data16.value !== undefined){
let data17 = data16.value;
const _errs69 = errors;
let valid22 = false;
const _errs70 = errors;
if((typeof data17 == "number") && (isFinite(data17))){
if(data17 <= 0 || isNaN(data17)){
const err74 = {instancePath:instancePath+"/metadata/spatial_resolution/value",schemaPath:"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/spatial_resolution/properties/value/anyOf/0/exclusiveMinimum",keyword:"exclusiveMinimum",params:{comparison: ">", limit: 0},message:"must be > 0"};
if(vErrors === null){
vErrors = [err74];
}
else {
vErrors.push(err74);
}
errors++;
}
}
else {
const err75 = {instancePath:instancePath+"/metadata/spatial_resolution/value",schemaPath:"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/spatial_resolution/properties/value/anyOf/0/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err75];
}
else {
vErrors.push(err75);
}
errors++;
}
var _valid4 = _errs70 === errors;
valid22 = valid22 || _valid4;
if(!valid22){
const _errs72 = errors;
if(data17 !== null){
const err76 = {instancePath:instancePath+"/metadata/spatial_resolution/value",schemaPath:"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/spatial_resolution/properties/value/anyOf/1/type",keyword:"type",params:{type: "null"},message:"must be null"};
if(vErrors === null){
vErrors = [err76];
}
else {
vErrors.push(err76);
}
errors++;
}
var _valid4 = _errs72 === errors;
valid22 = valid22 || _valid4;
}
if(!valid22){
const err77 = {instancePath:instancePath+"/metadata/spatial_resolution/value",schemaPath:"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/spatial_resolution/properties/value/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err77];
}
else {
vErrors.push(err77);
}
errors++;
}
else {
errors = _errs69;
if(vErrors !== null){
if(_errs69){
vErrors.length = _errs69;
}
else {
vErrors = null;
}
}
}
}
if(data16.unit !== undefined){
let data18 = data16.unit;
if(!(((data18 === "m") || (data18 === "degree")) || (data18 === null))){
const err78 = {instancePath:instancePath+"/metadata/spatial_resolution/unit",schemaPath:"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/spatial_resolution/properties/unit/enum",keyword:"enum",params:{allowedValues: schema35.properties.unit.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err78];
}
else {
vErrors.push(err78);
}
errors++;
}
}
}
else {
const err79 = {instancePath:instancePath+"/metadata/spatial_resolution",schemaPath:"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/spatial_resolution/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err79];
}
else {
vErrors.push(err79);
}
errors++;
}
}
if(data0.temporal_resolution !== undefined){
let data19 = data0.temporal_resolution;
const _errs77 = errors;
let valid24 = false;
const _errs78 = errors;
if(typeof data19 === "string"){
if(func4(data19) < 1){
const err80 = {instancePath:instancePath+"/metadata/temporal_resolution",schemaPath:"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/temporal_resolution/anyOf/0/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
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
const err81 = {instancePath:instancePath+"/metadata/temporal_resolution",schemaPath:"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/temporal_resolution/anyOf/0/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err81];
}
else {
vErrors.push(err81);
}
errors++;
}
var _valid5 = _errs78 === errors;
valid24 = valid24 || _valid5;
if(!valid24){
const _errs80 = errors;
if(data19 !== null){
const err82 = {instancePath:instancePath+"/metadata/temporal_resolution",schemaPath:"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/temporal_resolution/anyOf/1/type",keyword:"type",params:{type: "null"},message:"must be null"};
if(vErrors === null){
vErrors = [err82];
}
else {
vErrors.push(err82);
}
errors++;
}
var _valid5 = _errs80 === errors;
valid24 = valid24 || _valid5;
}
if(!valid24){
const err83 = {instancePath:instancePath+"/metadata/temporal_resolution",schemaPath:"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/temporal_resolution/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err83];
}
else {
vErrors.push(err83);
}
errors++;
}
else {
errors = _errs77;
if(vErrors !== null){
if(_errs77){
vErrors.length = _errs77;
}
else {
vErrors = null;
}
}
}
}
if(data0.spatial_coverage !== undefined){
let data20 = data0.spatial_coverage;
if(data20 && typeof data20 == "object" && !Array.isArray(data20)){
if(data20.description === undefined){
const err84 = {instancePath:instancePath+"/metadata/spatial_coverage",schemaPath:"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/spatial_coverage/required",keyword:"required",params:{missingProperty: "description"},message:"must have required property '"+"description"+"'"};
if(vErrors === null){
vErrors = [err84];
}
else {
vErrors.push(err84);
}
errors++;
}
if(data20.bbox === undefined){
const err85 = {instancePath:instancePath+"/metadata/spatial_coverage",schemaPath:"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/spatial_coverage/required",keyword:"required",params:{missingProperty: "bbox"},message:"must have required property '"+"bbox"+"'"};
if(vErrors === null){
vErrors = [err85];
}
else {
vErrors.push(err85);
}
errors++;
}
for(const key3 in data20){
if(!((key3 === "description") || (key3 === "bbox"))){
const err86 = {instancePath:instancePath+"/metadata/spatial_coverage",schemaPath:"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/spatial_coverage/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key3},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err86];
}
else {
vErrors.push(err86);
}
errors++;
}
}
if(data20.description !== undefined){
let data21 = data20.description;
if(typeof data21 === "string"){
if(func4(data21) < 1){
const err87 = {instancePath:instancePath+"/metadata/spatial_coverage/description",schemaPath:"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/spatial_coverage/properties/description/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
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
const err88 = {instancePath:instancePath+"/metadata/spatial_coverage/description",schemaPath:"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/spatial_coverage/properties/description/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err88];
}
else {
vErrors.push(err88);
}
errors++;
}
}
if(data20.bbox !== undefined){
let data22 = data20.bbox;
if(Array.isArray(data22)){
if(data22.length > 4){
const err89 = {instancePath:instancePath+"/metadata/spatial_coverage/bbox",schemaPath:"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/spatial_coverage/properties/bbox/maxItems",keyword:"maxItems",params:{limit: 4},message:"must NOT have more than 4 items"};
if(vErrors === null){
vErrors = [err89];
}
else {
vErrors.push(err89);
}
errors++;
}
if(data22.length < 4){
const err90 = {instancePath:instancePath+"/metadata/spatial_coverage/bbox",schemaPath:"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/spatial_coverage/properties/bbox/minItems",keyword:"minItems",params:{limit: 4},message:"must NOT have fewer than 4 items"};
if(vErrors === null){
vErrors = [err90];
}
else {
vErrors.push(err90);
}
errors++;
}
const len0 = data22.length;
for(let i0=0; i0<len0; i0++){
let data23 = data22[i0];
if(!((typeof data23 == "number") && (isFinite(data23)))){
const err91 = {instancePath:instancePath+"/metadata/spatial_coverage/bbox/" + i0,schemaPath:"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/spatial_coverage/properties/bbox/items/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err91];
}
else {
vErrors.push(err91);
}
errors++;
}
}
}
else {
const err92 = {instancePath:instancePath+"/metadata/spatial_coverage/bbox",schemaPath:"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/spatial_coverage/properties/bbox/type",keyword:"type",params:{type: "array"},message:"must be array"};
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
const err93 = {instancePath:instancePath+"/metadata/spatial_coverage",schemaPath:"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/spatial_coverage/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err93];
}
else {
vErrors.push(err93);
}
errors++;
}
}
if(data0.temporal_coverage !== undefined){
let data24 = data0.temporal_coverage;
if(data24 && typeof data24 == "object" && !Array.isArray(data24)){
if(data24.start === undefined){
const err94 = {instancePath:instancePath+"/metadata/temporal_coverage",schemaPath:"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/temporal_coverage/required",keyword:"required",params:{missingProperty: "start"},message:"must have required property '"+"start"+"'"};
if(vErrors === null){
vErrors = [err94];
}
else {
vErrors.push(err94);
}
errors++;
}
if(data24.end === undefined){
const err95 = {instancePath:instancePath+"/metadata/temporal_coverage",schemaPath:"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/temporal_coverage/required",keyword:"required",params:{missingProperty: "end"},message:"must have required property '"+"end"+"'"};
if(vErrors === null){
vErrors = [err95];
}
else {
vErrors.push(err95);
}
errors++;
}
for(const key4 in data24){
if(!((key4 === "start") || (key4 === "end"))){
const err96 = {instancePath:instancePath+"/metadata/temporal_coverage",schemaPath:"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/temporal_coverage/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key4},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err96];
}
else {
vErrors.push(err96);
}
errors++;
}
}
if(data24.start !== undefined){
let data25 = data24.start;
const _errs97 = errors;
let valid31 = false;
const _errs98 = errors;
if(typeof data25 === "string"){
if(!(formats0.validate(data25))){
const err97 = {instancePath:instancePath+"/metadata/temporal_coverage/start",schemaPath:"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/temporal_coverage/properties/start/anyOf/0/format",keyword:"format",params:{format: "date-time"},message:"must match format \""+"date-time"+"\""};
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
const err98 = {instancePath:instancePath+"/metadata/temporal_coverage/start",schemaPath:"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/temporal_coverage/properties/start/anyOf/0/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err98];
}
else {
vErrors.push(err98);
}
errors++;
}
var _valid6 = _errs98 === errors;
valid31 = valid31 || _valid6;
if(!valid31){
const _errs100 = errors;
if(data25 !== null){
const err99 = {instancePath:instancePath+"/metadata/temporal_coverage/start",schemaPath:"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/temporal_coverage/properties/start/anyOf/1/type",keyword:"type",params:{type: "null"},message:"must be null"};
if(vErrors === null){
vErrors = [err99];
}
else {
vErrors.push(err99);
}
errors++;
}
var _valid6 = _errs100 === errors;
valid31 = valid31 || _valid6;
}
if(!valid31){
const err100 = {instancePath:instancePath+"/metadata/temporal_coverage/start",schemaPath:"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/temporal_coverage/properties/start/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err100];
}
else {
vErrors.push(err100);
}
errors++;
}
else {
errors = _errs97;
if(vErrors !== null){
if(_errs97){
vErrors.length = _errs97;
}
else {
vErrors = null;
}
}
}
}
if(data24.end !== undefined){
let data26 = data24.end;
const _errs103 = errors;
let valid32 = false;
const _errs104 = errors;
if(typeof data26 === "string"){
if(!(formats0.validate(data26))){
const err101 = {instancePath:instancePath+"/metadata/temporal_coverage/end",schemaPath:"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/temporal_coverage/properties/end/anyOf/0/format",keyword:"format",params:{format: "date-time"},message:"must match format \""+"date-time"+"\""};
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
const err102 = {instancePath:instancePath+"/metadata/temporal_coverage/end",schemaPath:"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/temporal_coverage/properties/end/anyOf/0/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err102];
}
else {
vErrors.push(err102);
}
errors++;
}
var _valid7 = _errs104 === errors;
valid32 = valid32 || _valid7;
if(!valid32){
const _errs106 = errors;
if(data26 !== null){
const err103 = {instancePath:instancePath+"/metadata/temporal_coverage/end",schemaPath:"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/temporal_coverage/properties/end/anyOf/1/type",keyword:"type",params:{type: "null"},message:"must be null"};
if(vErrors === null){
vErrors = [err103];
}
else {
vErrors.push(err103);
}
errors++;
}
var _valid7 = _errs106 === errors;
valid32 = valid32 || _valid7;
}
if(!valid32){
const err104 = {instancePath:instancePath+"/metadata/temporal_coverage/end",schemaPath:"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/temporal_coverage/properties/end/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err104];
}
else {
vErrors.push(err104);
}
errors++;
}
else {
errors = _errs103;
if(vErrors !== null){
if(_errs103){
vErrors.length = _errs103;
}
else {
vErrors = null;
}
}
}
}
}
else {
const err105 = {instancePath:instancePath+"/metadata/temporal_coverage",schemaPath:"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/temporal_coverage/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err105];
}
else {
vErrors.push(err105);
}
errors++;
}
}
if(data0.crs !== undefined){
if("OGC:CRS84" !== data0.crs){
const err106 = {instancePath:instancePath+"/metadata/crs",schemaPath:"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/crs/const",keyword:"const",params:{allowedValue: "OGC:CRS84"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err106];
}
else {
vErrors.push(err106);
}
errors++;
}
}
if(data0.status !== undefined){
let data28 = data0.status;
if(!(((((((data28 === "VERIFIED_SOURCE") || (data28 === "SATELLITE_DERIVED")) || (data28 === "ATLAS_DERIVED")) || (data28 === "ESTIMATED")) || (data28 === "MODELLED")) || (data28 === "HISTORICAL")) || (data28 === "UNKNOWN"))){
const err107 = {instancePath:instancePath+"/metadata/status",schemaPath:"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/status/enum",keyword:"enum",params:{allowedValues: schema40.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err107];
}
else {
vErrors.push(err107);
}
errors++;
}
}
if(data0.evidence_type !== undefined){
let data29 = data0.evidence_type;
if(!((((((data29 === "observed") || (data29 === "derived")) || (data29 === "estimated")) || (data29 === "modelled")) || (data29 === "historical")) || (data29 === "unknown"))){
const err108 = {instancePath:instancePath+"/metadata/evidence_type",schemaPath:"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/evidence_type/enum",keyword:"enum",params:{allowedValues: schema41.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err108];
}
else {
vErrors.push(err108);
}
errors++;
}
}
if(data0.is_fixture !== undefined){
if(typeof data0.is_fixture !== "boolean"){
const err109 = {instancePath:instancePath+"/metadata/is_fixture",schemaPath:"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/is_fixture/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"};
if(vErrors === null){
vErrors = [err109];
}
else {
vErrors.push(err109);
}
errors++;
}
}
if(data0.limitations !== undefined){
let data31 = data0.limitations;
if(Array.isArray(data31)){
if(data31.length < 1){
const err110 = {instancePath:instancePath+"/metadata/limitations",schemaPath:"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/limitations/minItems",keyword:"minItems",params:{limit: 1},message:"must NOT have fewer than 1 items"};
if(vErrors === null){
vErrors = [err110];
}
else {
vErrors.push(err110);
}
errors++;
}
const len1 = data31.length;
for(let i1=0; i1<len1; i1++){
let data32 = data31[i1];
if(typeof data32 === "string"){
if(func4(data32) < 1){
const err111 = {instancePath:instancePath+"/metadata/limitations/" + i1,schemaPath:"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/limitations/items/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err111];
}
else {
vErrors.push(err111);
}
errors++;
}
}
else {
const err112 = {instancePath:instancePath+"/metadata/limitations/" + i1,schemaPath:"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/limitations/items/type",keyword:"type",params:{type: "string"},message:"must be string"};
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
const err113 = {instancePath:instancePath+"/metadata/limitations",schemaPath:"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/limitations/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err113];
}
else {
vErrors.push(err113);
}
errors++;
}
}
if(data0.uncertainty !== undefined){
let data33 = data0.uncertainty;
if(typeof data33 === "string"){
if(func4(data33) < 1){
const err114 = {instancePath:instancePath+"/metadata/uncertainty",schemaPath:"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/uncertainty/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
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
const err115 = {instancePath:instancePath+"/metadata/uncertainty",schemaPath:"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/uncertainty/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err115];
}
else {
vErrors.push(err115);
}
errors++;
}
}
if(data0.update_frequency !== undefined){
let data34 = data0.update_frequency;
if(!(((data34 === "static") || (data34 === "periodic")) || (data34 === "operational"))){
const err116 = {instancePath:instancePath+"/metadata/update_frequency",schemaPath:"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/update_frequency/enum",keyword:"enum",params:{allowedValues: schema45.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err116];
}
else {
vErrors.push(err116);
}
errors++;
}
}
if(data0.stale_after !== undefined){
let data35 = data0.stale_after;
const _errs129 = errors;
let valid43 = false;
const _errs130 = errors;
if(typeof data35 === "string"){
if(!(formats0.validate(data35))){
const err117 = {instancePath:instancePath+"/metadata/stale_after",schemaPath:"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/stale_after/anyOf/0/format",keyword:"format",params:{format: "date-time"},message:"must match format \""+"date-time"+"\""};
if(vErrors === null){
vErrors = [err117];
}
else {
vErrors.push(err117);
}
errors++;
}
}
else {
const err118 = {instancePath:instancePath+"/metadata/stale_after",schemaPath:"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/stale_after/anyOf/0/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err118];
}
else {
vErrors.push(err118);
}
errors++;
}
var _valid8 = _errs130 === errors;
valid43 = valid43 || _valid8;
if(!valid43){
const _errs132 = errors;
if(data35 !== null){
const err119 = {instancePath:instancePath+"/metadata/stale_after",schemaPath:"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/stale_after/anyOf/1/type",keyword:"type",params:{type: "null"},message:"must be null"};
if(vErrors === null){
vErrors = [err119];
}
else {
vErrors.push(err119);
}
errors++;
}
var _valid8 = _errs132 === errors;
valid43 = valid43 || _valid8;
}
if(!valid43){
const err120 = {instancePath:instancePath+"/metadata/stale_after",schemaPath:"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/stale_after/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err120];
}
else {
vErrors.push(err120);
}
errors++;
}
else {
errors = _errs129;
if(vErrors !== null){
if(_errs129){
vErrors.length = _errs129;
}
else {
vErrors = null;
}
}
}
}
if(data0.artifact !== undefined){
let data36 = data0.artifact;
if(data36 && typeof data36 == "object" && !Array.isArray(data36)){
if(data36.path === undefined){
const err121 = {instancePath:instancePath+"/metadata/artifact",schemaPath:"#/properties/metadata/properties/artifact/required",keyword:"required",params:{missingProperty: "path"},message:"must have required property '"+"path"+"'"};
if(vErrors === null){
vErrors = [err121];
}
else {
vErrors.push(err121);
}
errors++;
}
if(data36.format === undefined){
const err122 = {instancePath:instancePath+"/metadata/artifact",schemaPath:"#/properties/metadata/properties/artifact/required",keyword:"required",params:{missingProperty: "format"},message:"must have required property '"+"format"+"'"};
if(vErrors === null){
vErrors = [err122];
}
else {
vErrors.push(err122);
}
errors++;
}
if(data36.sha256 === undefined){
const err123 = {instancePath:instancePath+"/metadata/artifact",schemaPath:"#/properties/metadata/properties/artifact/required",keyword:"required",params:{missingProperty: "sha256"},message:"must have required property '"+"sha256"+"'"};
if(vErrors === null){
vErrors = [err123];
}
else {
vErrors.push(err123);
}
errors++;
}
if(data36.byte_size === undefined){
const err124 = {instancePath:instancePath+"/metadata/artifact",schemaPath:"#/properties/metadata/properties/artifact/required",keyword:"required",params:{missingProperty: "byte_size"},message:"must have required property '"+"byte_size"+"'"};
if(vErrors === null){
vErrors = [err124];
}
else {
vErrors.push(err124);
}
errors++;
}
for(const key5 in data36){
if(!((((key5 === "path") || (key5 === "format")) || (key5 === "sha256")) || (key5 === "byte_size"))){
const err125 = {instancePath:instancePath+"/metadata/artifact",schemaPath:"#/properties/metadata/properties/artifact/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key5},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err125];
}
else {
vErrors.push(err125);
}
errors++;
}
}
if(data36.path !== undefined){
let data37 = data36.path;
if(typeof data37 === "string"){
if(!pattern17.test(data37)){
const err126 = {instancePath:instancePath+"/metadata/artifact/path",schemaPath:"#/properties/metadata/properties/artifact/properties/path/pattern",keyword:"pattern",params:{pattern: "^/data/(?:nepal-terrain|asia-terrain-context)/[0-9]+\\.[0-9]+\\.[0-9]+/tiles\\.json$"},message:"must match pattern \""+"^/data/(?:nepal-terrain|asia-terrain-context)/[0-9]+\\.[0-9]+\\.[0-9]+/tiles\\.json$"+"\""};
if(vErrors === null){
vErrors = [err126];
}
else {
vErrors.push(err126);
}
errors++;
}
}
else {
const err127 = {instancePath:instancePath+"/metadata/artifact/path",schemaPath:"#/properties/metadata/properties/artifact/properties/path/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err127];
}
else {
vErrors.push(err127);
}
errors++;
}
}
if(data36.format !== undefined){
if("TerrainRGB-index" !== data36.format){
const err128 = {instancePath:instancePath+"/metadata/artifact/format",schemaPath:"#/properties/metadata/properties/artifact/properties/format/const",keyword:"const",params:{allowedValue: "TerrainRGB-index"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err128];
}
else {
vErrors.push(err128);
}
errors++;
}
}
if(data36.sha256 !== undefined){
let data39 = data36.sha256;
if(typeof data39 === "string"){
if(!pattern7.test(data39)){
const err129 = {instancePath:instancePath+"/metadata/artifact/sha256",schemaPath:"#/properties/metadata/properties/artifact/properties/sha256/pattern",keyword:"pattern",params:{pattern: "^[a-f0-9]{64}$"},message:"must match pattern \""+"^[a-f0-9]{64}$"+"\""};
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
const err130 = {instancePath:instancePath+"/metadata/artifact/sha256",schemaPath:"#/properties/metadata/properties/artifact/properties/sha256/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err130];
}
else {
vErrors.push(err130);
}
errors++;
}
}
if(data36.byte_size !== undefined){
let data40 = data36.byte_size;
if(!(((typeof data40 == "number") && (!(data40 % 1) && !isNaN(data40))) && (isFinite(data40)))){
const err131 = {instancePath:instancePath+"/metadata/artifact/byte_size",schemaPath:"#/properties/metadata/properties/artifact/properties/byte_size/type",keyword:"type",params:{type: "integer"},message:"must be integer"};
if(vErrors === null){
vErrors = [err131];
}
else {
vErrors.push(err131);
}
errors++;
}
if((typeof data40 == "number") && (isFinite(data40))){
if(data40 > 131072 || isNaN(data40)){
const err132 = {instancePath:instancePath+"/metadata/artifact/byte_size",schemaPath:"#/properties/metadata/properties/artifact/properties/byte_size/maximum",keyword:"maximum",params:{comparison: "<=", limit: 131072},message:"must be <= 131072"};
if(vErrors === null){
vErrors = [err132];
}
else {
vErrors.push(err132);
}
errors++;
}
if(data40 < 1 || isNaN(data40)){
const err133 = {instancePath:instancePath+"/metadata/artifact/byte_size",schemaPath:"#/properties/metadata/properties/artifact/properties/byte_size/minimum",keyword:"minimum",params:{comparison: ">=", limit: 1},message:"must be >= 1"};
if(vErrors === null){
vErrors = [err133];
}
else {
vErrors.push(err133);
}
errors++;
}
}
}
}
else {
const err134 = {instancePath:instancePath+"/metadata/artifact",schemaPath:"#/properties/metadata/properties/artifact/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err134];
}
else {
vErrors.push(err134);
}
errors++;
}
}
}
else {
const err135 = {instancePath:instancePath+"/metadata",schemaPath:"#/properties/metadata/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err135];
}
else {
vErrors.push(err135);
}
errors++;
}
}
if(data.raster !== undefined){
let data41 = data.raster;
if(data41 && typeof data41 == "object" && !Array.isArray(data41)){
if(data41.crs === undefined){
const err136 = {instancePath:instancePath+"/raster",schemaPath:"#/properties/raster/required",keyword:"required",params:{missingProperty: "crs"},message:"must have required property '"+"crs"+"'"};
if(vErrors === null){
vErrors = [err136];
}
else {
vErrors.push(err136);
}
errors++;
}
if(data41.vertical_datum === undefined){
const err137 = {instancePath:instancePath+"/raster",schemaPath:"#/properties/raster/required",keyword:"required",params:{missingProperty: "vertical_datum"},message:"must have required property '"+"vertical_datum"+"'"};
if(vErrors === null){
vErrors = [err137];
}
else {
vErrors.push(err137);
}
errors++;
}
if(data41.unit === undefined){
const err138 = {instancePath:instancePath+"/raster",schemaPath:"#/properties/raster/required",keyword:"required",params:{missingProperty: "unit"},message:"must have required property '"+"unit"+"'"};
if(vErrors === null){
vErrors = [err138];
}
else {
vErrors.push(err138);
}
errors++;
}
if(data41.tile_size === undefined){
const err139 = {instancePath:instancePath+"/raster",schemaPath:"#/properties/raster/required",keyword:"required",params:{missingProperty: "tile_size"},message:"must have required property '"+"tile_size"+"'"};
if(vErrors === null){
vErrors = [err139];
}
else {
vErrors.push(err139);
}
errors++;
}
if(data41.minzoom === undefined){
const err140 = {instancePath:instancePath+"/raster",schemaPath:"#/properties/raster/required",keyword:"required",params:{missingProperty: "minzoom"},message:"must have required property '"+"minzoom"+"'"};
if(vErrors === null){
vErrors = [err140];
}
else {
vErrors.push(err140);
}
errors++;
}
if(data41.maxzoom === undefined){
const err141 = {instancePath:instancePath+"/raster",schemaPath:"#/properties/raster/required",keyword:"required",params:{missingProperty: "maxzoom"},message:"must have required property '"+"maxzoom"+"'"};
if(vErrors === null){
vErrors = [err141];
}
else {
vErrors.push(err141);
}
errors++;
}
if(data41.encoding === undefined){
const err142 = {instancePath:instancePath+"/raster",schemaPath:"#/properties/raster/required",keyword:"required",params:{missingProperty: "encoding"},message:"must have required property '"+"encoding"+"'"};
if(vErrors === null){
vErrors = [err142];
}
else {
vErrors.push(err142);
}
errors++;
}
if(data41.nodata === undefined){
const err143 = {instancePath:instancePath+"/raster",schemaPath:"#/properties/raster/required",keyword:"required",params:{missingProperty: "nodata"},message:"must have required property '"+"nodata"+"'"};
if(vErrors === null){
vErrors = [err143];
}
else {
vErrors.push(err143);
}
errors++;
}
if(data41.native_crs === undefined){
const err144 = {instancePath:instancePath+"/raster",schemaPath:"#/properties/raster/required",keyword:"required",params:{missingProperty: "native_crs"},message:"must have required property '"+"native_crs"+"'"};
if(vErrors === null){
vErrors = [err144];
}
else {
vErrors.push(err144);
}
errors++;
}
if(data41.native_resolution_degree === undefined){
const err145 = {instancePath:instancePath+"/raster",schemaPath:"#/properties/raster/required",keyword:"required",params:{missingProperty: "native_resolution_degree"},message:"must have required property '"+"native_resolution_degree"+"'"};
if(vErrors === null){
vErrors = [err145];
}
else {
vErrors.push(err145);
}
errors++;
}
if(data41.resampling === undefined){
const err146 = {instancePath:instancePath+"/raster",schemaPath:"#/properties/raster/required",keyword:"required",params:{missingProperty: "resampling"},message:"must have required property '"+"resampling"+"'"};
if(vErrors === null){
vErrors = [err146];
}
else {
vErrors.push(err146);
}
errors++;
}
if(data41.tile_count === undefined){
const err147 = {instancePath:instancePath+"/raster",schemaPath:"#/properties/raster/required",keyword:"required",params:{missingProperty: "tile_count"},message:"must have required property '"+"tile_count"+"'"};
if(vErrors === null){
vErrors = [err147];
}
else {
vErrors.push(err147);
}
errors++;
}
for(const key6 in data41){
if(!(func2.call(schema11.properties.raster.properties, key6))){
const err148 = {instancePath:instancePath+"/raster",schemaPath:"#/properties/raster/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key6},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err148];
}
else {
vErrors.push(err148);
}
errors++;
}
}
if(data41.crs !== undefined){
if("EPSG:3857" !== data41.crs){
const err149 = {instancePath:instancePath+"/raster/crs",schemaPath:"#/properties/raster/properties/crs/const",keyword:"const",params:{allowedValue: "EPSG:3857"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err149];
}
else {
vErrors.push(err149);
}
errors++;
}
}
if(data41.vertical_datum !== undefined){
let data43 = data41.vertical_datum;
if(!((data43 === "EGM2008 (EPSG:3855)") || (data43 === null))){
const err150 = {instancePath:instancePath+"/raster/vertical_datum",schemaPath:"#/properties/raster/properties/vertical_datum/enum",keyword:"enum",params:{allowedValues: schema11.properties.raster.properties.vertical_datum.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err150];
}
else {
vErrors.push(err150);
}
errors++;
}
}
if(data41.unit !== undefined){
if("m" !== data41.unit){
const err151 = {instancePath:instancePath+"/raster/unit",schemaPath:"#/properties/raster/properties/unit/const",keyword:"const",params:{allowedValue: "m"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err151];
}
else {
vErrors.push(err151);
}
errors++;
}
}
if(data41.tile_size !== undefined){
if(256 !== data41.tile_size){
const err152 = {instancePath:instancePath+"/raster/tile_size",schemaPath:"#/properties/raster/properties/tile_size/const",keyword:"const",params:{allowedValue: 256},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err152];
}
else {
vErrors.push(err152);
}
errors++;
}
}
if(data41.minzoom !== undefined){
let data46 = data41.minzoom;
if(!((data46 === 1) || (data46 === 5))){
const err153 = {instancePath:instancePath+"/raster/minzoom",schemaPath:"#/properties/raster/properties/minzoom/enum",keyword:"enum",params:{allowedValues: schema11.properties.raster.properties.minzoom.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err153];
}
else {
vErrors.push(err153);
}
errors++;
}
}
if(data41.maxzoom !== undefined){
let data47 = data41.maxzoom;
if(!((data47 === 5) || (data47 === 9))){
const err154 = {instancePath:instancePath+"/raster/maxzoom",schemaPath:"#/properties/raster/properties/maxzoom/enum",keyword:"enum",params:{allowedValues: schema11.properties.raster.properties.maxzoom.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err154];
}
else {
vErrors.push(err154);
}
errors++;
}
}
if(data41.encoding !== undefined){
if("mapbox" !== data41.encoding){
const err155 = {instancePath:instancePath+"/raster/encoding",schemaPath:"#/properties/raster/properties/encoding/const",keyword:"const",params:{allowedValue: "mapbox"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err155];
}
else {
vErrors.push(err155);
}
errors++;
}
}
if(data41.nodata !== undefined){
if(data41.nodata !== null){
const err156 = {instancePath:instancePath+"/raster/nodata",schemaPath:"#/properties/raster/properties/nodata/type",keyword:"type",params:{type: "null"},message:"must be null"};
if(vErrors === null){
vErrors = [err156];
}
else {
vErrors.push(err156);
}
errors++;
}
}
if(data41.native_crs !== undefined){
let data50 = data41.native_crs;
if(!((data50 === "EPSG:4326") || (data50 === "EPSG:3857"))){
const err157 = {instancePath:instancePath+"/raster/native_crs",schemaPath:"#/properties/raster/properties/native_crs/enum",keyword:"enum",params:{allowedValues: schema11.properties.raster.properties.native_crs.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err157];
}
else {
vErrors.push(err157);
}
errors++;
}
}
if(data41.native_resolution_degree !== undefined){
let data51 = data41.native_resolution_degree;
const _errs158 = errors;
let valid46 = false;
const _errs159 = errors;
if((typeof data51 == "number") && (isFinite(data51))){
if(data51 <= 0 || isNaN(data51)){
const err158 = {instancePath:instancePath+"/raster/native_resolution_degree",schemaPath:"#/properties/raster/properties/native_resolution_degree/anyOf/0/exclusiveMinimum",keyword:"exclusiveMinimum",params:{comparison: ">", limit: 0},message:"must be > 0"};
if(vErrors === null){
vErrors = [err158];
}
else {
vErrors.push(err158);
}
errors++;
}
}
else {
const err159 = {instancePath:instancePath+"/raster/native_resolution_degree",schemaPath:"#/properties/raster/properties/native_resolution_degree/anyOf/0/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err159];
}
else {
vErrors.push(err159);
}
errors++;
}
var _valid9 = _errs159 === errors;
valid46 = valid46 || _valid9;
if(!valid46){
const _errs161 = errors;
if(data51 !== null){
const err160 = {instancePath:instancePath+"/raster/native_resolution_degree",schemaPath:"#/properties/raster/properties/native_resolution_degree/anyOf/1/type",keyword:"type",params:{type: "null"},message:"must be null"};
if(vErrors === null){
vErrors = [err160];
}
else {
vErrors.push(err160);
}
errors++;
}
var _valid9 = _errs161 === errors;
valid46 = valid46 || _valid9;
}
if(!valid46){
const err161 = {instancePath:instancePath+"/raster/native_resolution_degree",schemaPath:"#/properties/raster/properties/native_resolution_degree/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err161];
}
else {
vErrors.push(err161);
}
errors++;
}
else {
errors = _errs158;
if(vErrors !== null){
if(_errs158){
vErrors.length = _errs158;
}
else {
vErrors = null;
}
}
}
}
if(data41.resampling !== undefined){
let data52 = data41.resampling;
if(!((data52 === "bilinear") || (data52 === "none"))){
const err162 = {instancePath:instancePath+"/raster/resampling",schemaPath:"#/properties/raster/properties/resampling/enum",keyword:"enum",params:{allowedValues: schema11.properties.raster.properties.resampling.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err162];
}
else {
vErrors.push(err162);
}
errors++;
}
}
if(data41.tile_count !== undefined){
let data53 = data41.tile_count;
if(!((data53 === 341) || (data53 === 682))){
const err163 = {instancePath:instancePath+"/raster/tile_count",schemaPath:"#/properties/raster/properties/tile_count/enum",keyword:"enum",params:{allowedValues: schema11.properties.raster.properties.tile_count.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err163];
}
else {
vErrors.push(err163);
}
errors++;
}
}
}
else {
const err164 = {instancePath:instancePath+"/raster",schemaPath:"#/properties/raster/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err164];
}
else {
vErrors.push(err164);
}
errors++;
}
}
}
else {
const err165 = {instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err165];
}
else {
vErrors.push(err165);
}
errors++;
}
validate10.errors = vErrors;
return errors === 0;
}

