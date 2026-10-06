// Generated from live-snapshot.schema.json; run npm run contracts:generate. Do not edit.
"use strict";
module.exports = validate10;
module.exports.default = validate10;
const schema11 = {"$schema":"http://json-schema.org/draft-07/schema#","$id":"https://himalayan-disaster-atlas.invalid/schemas/live-snapshot.schema.json","type":"object","additionalProperties":false,"required":["schema_version","kind","dataset_id","version","id","feed_id","is_fixture","source","fetched_at","source_issued_at","freshness","crs","evidence_type","product_type","records","assumptions","limitations","unsupported_outputs","notice"],"properties":{"schema_version":{"const":"1.0.0"},"kind":{"const":"live-snapshot"},"dataset_id":{"$ref":"#/definitions/id"},"version":{"$ref":"#/definitions/version"},"id":{"$ref":"#/definitions/id"},"feed_id":{"$ref":"#/definitions/feed"},"is_fixture":{"type":"boolean"},"source":{"type":"object","additionalProperties":false,"required":["name","url","version","raw_sha256","license","license_url","attribution","license_review","is_official"],"properties":{"name":{"$ref":"#/definitions/text"},"url":{"$ref":"#/definitions/https"},"version":{"type":["string","null"],"minLength":1,"maxLength":120},"raw_sha256":{"anyOf":[{"$ref":"#/definitions/hash"},{"type":"null"}]},"license":{"$ref":"#/definitions/text"},"license_url":{"anyOf":[{"$ref":"#/definitions/https"},{"type":"null"}]},"attribution":{"$ref":"#/definitions/text"},"license_review":{"enum":["PERMITTED","REVIEW_REQUIRED","PROHIBITED"]},"is_official":{"type":"boolean"}}},"fetched_at":{"$ref":"#/definitions/time"},"source_issued_at":{"$ref":"#/definitions/nullableTime"},"freshness":{"type":"object","additionalProperties":false,"required":["basis","as_of","stale_after_seconds","expires_at"],"properties":{"basis":{"enum":["source_issue","observation"]},"as_of":{"$ref":"#/definitions/nullableTime"},"stale_after_seconds":{"type":"integer","minimum":1,"maximum":604800},"expires_at":{"$ref":"#/definitions/nullableTime"}}},"crs":{"const":"OGC:CRS84"},"evidence_type":{"$ref":"#/definitions/evidence"},"product_type":{"$ref":"#/definitions/product"},"records":{"type":"array","maxItems":4096,"items":{"type":"object","additionalProperties":false,"required":["id","label","coordinates","evidence_type","observed_at","issued_at","valid_from","valid_until","measurements"],"properties":{"id":{"type":"string","minLength":1,"maxLength":120},"label":{"type":["string","null"],"minLength":1,"maxLength":240},"source_revision_at":{"$ref":"#/definitions/nullableTime"},"source_url":{"anyOf":[{"$ref":"#/definitions/https"},{"type":"null"}]},"source_network":{"type":["string","null"],"minLength":1,"maxLength":40},"coordinates":{"anyOf":[{"type":"null"},{"type":"array","items":[{"type":"number","minimum":-180,"maximum":180},{"type":"number","minimum":-90,"maximum":90}],"additionalItems":false,"minItems":2,"maxItems":2}]},"evidence_type":{"$ref":"#/definitions/evidence"},"observed_at":{"$ref":"#/definitions/nullableTime"},"issued_at":{"$ref":"#/definitions/nullableTime"},"valid_from":{"$ref":"#/definitions/nullableTime"},"valid_until":{"$ref":"#/definitions/nullableTime"},"measurements":{"type":"array","maxItems":16,"items":{"type":"object","additionalProperties":false,"required":["variable","value","unit","qualifier","evidence_type"],"properties":{"variable":{"enum":["magnitude","depth","precipitation_accumulation","precipitation_rate","temperature","water_level","discharge","pm25","aqi"]},"value":{"type":["number","null"]},"unit":{"enum":["magnitude","km","mm","mm/h","degC","m","m3/s","ug/m3","dimensionless"]},"qualifier":{"type":["string","null"],"minLength":1,"maxLength":120},"evidence_type":{"$ref":"#/definitions/evidence"}}}}}}},"assumptions":{"$ref":"#/definitions/texts"},"limitations":{"type":"array","allOf":[{"$ref":"#/definitions/texts"}],"minItems":1},"unsupported_outputs":{"type":"object","additionalProperties":false,"required":["physical_inundation","destroyed_buildings","casualties","repair_costs","hydropower_downtime","economic_loss"],"properties":{"physical_inundation":{"type":"null"},"destroyed_buildings":{"type":"null"},"casualties":{"type":"null"},"repair_costs":{"type":"null"},"hydropower_downtime":{"type":"null"},"economic_loss":{"type":"null"}}},"notice":{"const":"Periodically updated conditions; not a real-time warning service."}},"definitions":{"id":{"type":"string","pattern":"^[a-z0-9]+(?:-[a-z0-9]+)*$","maxLength":100},"version":{"type":"string","pattern":"^\\d+\\.\\d+\\.\\d+$","maxLength":40},"hash":{"type":"string","pattern":"^[a-f0-9]{64}$"},"time":{"type":"string","format":"date-time","pattern":"^(?!0000)\\d{4}-\\d{2}-\\d{2}T(?:[01]\\d|2[0-3]):[0-5]\\d:[0-5]\\d(?:\\.\\d{1,3})?Z$"},"nullableTime":{"anyOf":[{"$ref":"#/definitions/time"},{"type":"null"}]},"text":{"type":"string","minLength":1,"maxLength":500},"texts":{"type":"array","maxItems":32,"items":{"$ref":"#/definitions/text"}},"https":{"type":"string","format":"uri","pattern":"^https://","maxLength":1000},"feed":{"enum":["usgs","noaa-gfs","dhm","bipad","openaq","open-meteo","imerg","contract-fixture"]},"evidence":{"enum":["observed","reported","derived","modelled","hypothetical","unknown"]},"product":{"enum":["observation","reported_event","forecast","official_warning","scenario","unknown"]}}};
const schema12 = {"type":"string","pattern":"^[a-z0-9]+(?:-[a-z0-9]+)*$","maxLength":100};
const schema13 = {"type":"string","pattern":"^\\d+\\.\\d+\\.\\d+$","maxLength":40};
const schema15 = {"enum":["usgs","noaa-gfs","dhm","bipad","openaq","open-meteo","imerg","contract-fixture"]};
const schema16 = {"type":"string","minLength":1,"maxLength":500};
const schema17 = {"type":"string","format":"uri","pattern":"^https://","maxLength":1000};
const schema18 = {"type":"string","pattern":"^[a-f0-9]{64}$"};
const schema22 = {"type":"string","format":"date-time","pattern":"^(?!0000)\\d{4}-\\d{2}-\\d{2}T(?:[01]\\d|2[0-3]):[0-5]\\d:[0-5]\\d(?:\\.\\d{1,3})?Z$"};
const schema25 = {"enum":["observed","reported","derived","modelled","hypothetical","unknown"]};
const schema26 = {"enum":["observation","reported_event","forecast","official_warning","scenario","unknown"]};
const func2 = Object.prototype.hasOwnProperty;
const func3 = require("ajv/dist/runtime/ucs2length").default;
const pattern0 = new RegExp("^[a-z0-9]+(?:-[a-z0-9]+)*$", "u");
const pattern1 = new RegExp("^\\d+\\.\\d+\\.\\d+$", "u");
const pattern3 = new RegExp("^https://", "u");
const pattern4 = new RegExp("^[a-f0-9]{64}$", "u");
const pattern6 = new RegExp("^(?!0000)\\d{4}-\\d{2}-\\d{2}T(?:[01]\\d|2[0-3]):[0-5]\\d:[0-5]\\d(?:\\.\\d{1,3})?Z$", "u");
const formats0 = require("ajv-formats/dist/formats").fullFormats.uri;
const formats4 = require("ajv-formats/dist/formats").fullFormats["date-time"];
const schema23 = {"anyOf":[{"$ref":"#/definitions/time"},{"type":"null"}]};

function validate11(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
const _errs0 = errors;
let valid0 = false;
const _errs1 = errors;
if(typeof data === "string"){
if(!pattern6.test(data)){
const err0 = {instancePath,schemaPath:"#/definitions/time/pattern",keyword:"pattern",params:{pattern: "^(?!0000)\\d{4}-\\d{2}-\\d{2}T(?:[01]\\d|2[0-3]):[0-5]\\d:[0-5]\\d(?:\\.\\d{1,3})?Z$"},message:"must match pattern \""+"^(?!0000)\\d{4}-\\d{2}-\\d{2}T(?:[01]\\d|2[0-3]):[0-5]\\d:[0-5]\\d(?:\\.\\d{1,3})?Z$"+"\""};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
if(!(formats4.validate(data))){
const err1 = {instancePath,schemaPath:"#/definitions/time/format",keyword:"format",params:{format: "date-time"},message:"must match format \""+"date-time"+"\""};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
}
else {
const err2 = {instancePath,schemaPath:"#/definitions/time/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
var _valid0 = _errs1 === errors;
valid0 = valid0 || _valid0;
if(!valid0){
const _errs4 = errors;
if(data !== null){
const err3 = {instancePath,schemaPath:"#/anyOf/1/type",keyword:"type",params:{type: "null"},message:"must be null"};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
var _valid0 = _errs4 === errors;
valid0 = valid0 || _valid0;
}
if(!valid0){
const err4 = {instancePath,schemaPath:"#/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
else {
errors = _errs0;
if(vErrors !== null){
if(_errs0){
vErrors.length = _errs0;
}
else {
vErrors = null;
}
}
}
validate11.errors = vErrors;
return errors === 0;
}

const schema30 = {"type":"array","maxItems":32,"items":{"$ref":"#/definitions/text"}};

function validate20(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(Array.isArray(data)){
if(data.length > 32){
const err0 = {instancePath,schemaPath:"#/maxItems",keyword:"maxItems",params:{limit: 32},message:"must NOT have more than 32 items"};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
const len0 = data.length;
for(let i0=0; i0<len0; i0++){
let data0 = data[i0];
if(typeof data0 === "string"){
if(func3(data0) > 500){
const err1 = {instancePath:instancePath+"/" + i0,schemaPath:"#/definitions/text/maxLength",keyword:"maxLength",params:{limit: 500},message:"must NOT have more than 500 characters"};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
if(func3(data0) < 1){
const err2 = {instancePath:instancePath+"/" + i0,schemaPath:"#/definitions/text/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
}
else {
const err3 = {instancePath:instancePath+"/" + i0,schemaPath:"#/definitions/text/type",keyword:"type",params:{type: "string"},message:"must be string"};
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
else {
const err4 = {instancePath,schemaPath:"#/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
validate20.errors = vErrors;
return errors === 0;
}


function validate10(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
/*# sourceURL="https://himalayan-disaster-atlas.invalid/schemas/live-snapshot.schema.json" */;
let vErrors = null;
let errors = 0;
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.schema_version === undefined){
const err0 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "schema_version"},message:"must have required property '"+"schema_version"+"'"};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
if(data.kind === undefined){
const err1 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "kind"},message:"must have required property '"+"kind"+"'"};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
if(data.dataset_id === undefined){
const err2 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "dataset_id"},message:"must have required property '"+"dataset_id"+"'"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
if(data.version === undefined){
const err3 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "version"},message:"must have required property '"+"version"+"'"};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
if(data.id === undefined){
const err4 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "id"},message:"must have required property '"+"id"+"'"};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
if(data.feed_id === undefined){
const err5 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "feed_id"},message:"must have required property '"+"feed_id"+"'"};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
if(data.is_fixture === undefined){
const err6 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "is_fixture"},message:"must have required property '"+"is_fixture"+"'"};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
if(data.source === undefined){
const err7 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "source"},message:"must have required property '"+"source"+"'"};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
}
if(data.fetched_at === undefined){
const err8 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "fetched_at"},message:"must have required property '"+"fetched_at"+"'"};
if(vErrors === null){
vErrors = [err8];
}
else {
vErrors.push(err8);
}
errors++;
}
if(data.source_issued_at === undefined){
const err9 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "source_issued_at"},message:"must have required property '"+"source_issued_at"+"'"};
if(vErrors === null){
vErrors = [err9];
}
else {
vErrors.push(err9);
}
errors++;
}
if(data.freshness === undefined){
const err10 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "freshness"},message:"must have required property '"+"freshness"+"'"};
if(vErrors === null){
vErrors = [err10];
}
else {
vErrors.push(err10);
}
errors++;
}
if(data.crs === undefined){
const err11 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "crs"},message:"must have required property '"+"crs"+"'"};
if(vErrors === null){
vErrors = [err11];
}
else {
vErrors.push(err11);
}
errors++;
}
if(data.evidence_type === undefined){
const err12 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "evidence_type"},message:"must have required property '"+"evidence_type"+"'"};
if(vErrors === null){
vErrors = [err12];
}
else {
vErrors.push(err12);
}
errors++;
}
if(data.product_type === undefined){
const err13 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "product_type"},message:"must have required property '"+"product_type"+"'"};
if(vErrors === null){
vErrors = [err13];
}
else {
vErrors.push(err13);
}
errors++;
}
if(data.records === undefined){
const err14 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "records"},message:"must have required property '"+"records"+"'"};
if(vErrors === null){
vErrors = [err14];
}
else {
vErrors.push(err14);
}
errors++;
}
if(data.assumptions === undefined){
const err15 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "assumptions"},message:"must have required property '"+"assumptions"+"'"};
if(vErrors === null){
vErrors = [err15];
}
else {
vErrors.push(err15);
}
errors++;
}
if(data.limitations === undefined){
const err16 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "limitations"},message:"must have required property '"+"limitations"+"'"};
if(vErrors === null){
vErrors = [err16];
}
else {
vErrors.push(err16);
}
errors++;
}
if(data.unsupported_outputs === undefined){
const err17 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "unsupported_outputs"},message:"must have required property '"+"unsupported_outputs"+"'"};
if(vErrors === null){
vErrors = [err17];
}
else {
vErrors.push(err17);
}
errors++;
}
if(data.notice === undefined){
const err18 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "notice"},message:"must have required property '"+"notice"+"'"};
if(vErrors === null){
vErrors = [err18];
}
else {
vErrors.push(err18);
}
errors++;
}
for(const key0 in data){
if(!(func2.call(schema11.properties, key0))){
const err19 = {instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err19];
}
else {
vErrors.push(err19);
}
errors++;
}
}
if(data.schema_version !== undefined){
if("1.0.0" !== data.schema_version){
const err20 = {instancePath:instancePath+"/schema_version",schemaPath:"#/properties/schema_version/const",keyword:"const",params:{allowedValue: "1.0.0"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err20];
}
else {
vErrors.push(err20);
}
errors++;
}
}
if(data.kind !== undefined){
if("live-snapshot" !== data.kind){
const err21 = {instancePath:instancePath+"/kind",schemaPath:"#/properties/kind/const",keyword:"const",params:{allowedValue: "live-snapshot"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err21];
}
else {
vErrors.push(err21);
}
errors++;
}
}
if(data.dataset_id !== undefined){
let data2 = data.dataset_id;
if(typeof data2 === "string"){
if(func3(data2) > 100){
const err22 = {instancePath:instancePath+"/dataset_id",schemaPath:"#/definitions/id/maxLength",keyword:"maxLength",params:{limit: 100},message:"must NOT have more than 100 characters"};
if(vErrors === null){
vErrors = [err22];
}
else {
vErrors.push(err22);
}
errors++;
}
if(!pattern0.test(data2)){
const err23 = {instancePath:instancePath+"/dataset_id",schemaPath:"#/definitions/id/pattern",keyword:"pattern",params:{pattern: "^[a-z0-9]+(?:-[a-z0-9]+)*$"},message:"must match pattern \""+"^[a-z0-9]+(?:-[a-z0-9]+)*$"+"\""};
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
const err24 = {instancePath:instancePath+"/dataset_id",schemaPath:"#/definitions/id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err24];
}
else {
vErrors.push(err24);
}
errors++;
}
}
if(data.version !== undefined){
let data3 = data.version;
if(typeof data3 === "string"){
if(func3(data3) > 40){
const err25 = {instancePath:instancePath+"/version",schemaPath:"#/definitions/version/maxLength",keyword:"maxLength",params:{limit: 40},message:"must NOT have more than 40 characters"};
if(vErrors === null){
vErrors = [err25];
}
else {
vErrors.push(err25);
}
errors++;
}
if(!pattern1.test(data3)){
const err26 = {instancePath:instancePath+"/version",schemaPath:"#/definitions/version/pattern",keyword:"pattern",params:{pattern: "^\\d+\\.\\d+\\.\\d+$"},message:"must match pattern \""+"^\\d+\\.\\d+\\.\\d+$"+"\""};
if(vErrors === null){
vErrors = [err26];
}
else {
vErrors.push(err26);
}
errors++;
}
}
else {
const err27 = {instancePath:instancePath+"/version",schemaPath:"#/definitions/version/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err27];
}
else {
vErrors.push(err27);
}
errors++;
}
}
if(data.id !== undefined){
let data4 = data.id;
if(typeof data4 === "string"){
if(func3(data4) > 100){
const err28 = {instancePath:instancePath+"/id",schemaPath:"#/definitions/id/maxLength",keyword:"maxLength",params:{limit: 100},message:"must NOT have more than 100 characters"};
if(vErrors === null){
vErrors = [err28];
}
else {
vErrors.push(err28);
}
errors++;
}
if(!pattern0.test(data4)){
const err29 = {instancePath:instancePath+"/id",schemaPath:"#/definitions/id/pattern",keyword:"pattern",params:{pattern: "^[a-z0-9]+(?:-[a-z0-9]+)*$"},message:"must match pattern \""+"^[a-z0-9]+(?:-[a-z0-9]+)*$"+"\""};
if(vErrors === null){
vErrors = [err29];
}
else {
vErrors.push(err29);
}
errors++;
}
}
else {
const err30 = {instancePath:instancePath+"/id",schemaPath:"#/definitions/id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err30];
}
else {
vErrors.push(err30);
}
errors++;
}
}
if(data.feed_id !== undefined){
let data5 = data.feed_id;
if(!((((((((data5 === "usgs") || (data5 === "noaa-gfs")) || (data5 === "dhm")) || (data5 === "bipad")) || (data5 === "openaq")) || (data5 === "open-meteo")) || (data5 === "imerg")) || (data5 === "contract-fixture"))){
const err31 = {instancePath:instancePath+"/feed_id",schemaPath:"#/definitions/feed/enum",keyword:"enum",params:{allowedValues: schema15.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err31];
}
else {
vErrors.push(err31);
}
errors++;
}
}
if(data.is_fixture !== undefined){
if(typeof data.is_fixture !== "boolean"){
const err32 = {instancePath:instancePath+"/is_fixture",schemaPath:"#/properties/is_fixture/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"};
if(vErrors === null){
vErrors = [err32];
}
else {
vErrors.push(err32);
}
errors++;
}
}
if(data.source !== undefined){
let data7 = data.source;
if(data7 && typeof data7 == "object" && !Array.isArray(data7)){
if(data7.name === undefined){
const err33 = {instancePath:instancePath+"/source",schemaPath:"#/properties/source/required",keyword:"required",params:{missingProperty: "name"},message:"must have required property '"+"name"+"'"};
if(vErrors === null){
vErrors = [err33];
}
else {
vErrors.push(err33);
}
errors++;
}
if(data7.url === undefined){
const err34 = {instancePath:instancePath+"/source",schemaPath:"#/properties/source/required",keyword:"required",params:{missingProperty: "url"},message:"must have required property '"+"url"+"'"};
if(vErrors === null){
vErrors = [err34];
}
else {
vErrors.push(err34);
}
errors++;
}
if(data7.version === undefined){
const err35 = {instancePath:instancePath+"/source",schemaPath:"#/properties/source/required",keyword:"required",params:{missingProperty: "version"},message:"must have required property '"+"version"+"'"};
if(vErrors === null){
vErrors = [err35];
}
else {
vErrors.push(err35);
}
errors++;
}
if(data7.raw_sha256 === undefined){
const err36 = {instancePath:instancePath+"/source",schemaPath:"#/properties/source/required",keyword:"required",params:{missingProperty: "raw_sha256"},message:"must have required property '"+"raw_sha256"+"'"};
if(vErrors === null){
vErrors = [err36];
}
else {
vErrors.push(err36);
}
errors++;
}
if(data7.license === undefined){
const err37 = {instancePath:instancePath+"/source",schemaPath:"#/properties/source/required",keyword:"required",params:{missingProperty: "license"},message:"must have required property '"+"license"+"'"};
if(vErrors === null){
vErrors = [err37];
}
else {
vErrors.push(err37);
}
errors++;
}
if(data7.license_url === undefined){
const err38 = {instancePath:instancePath+"/source",schemaPath:"#/properties/source/required",keyword:"required",params:{missingProperty: "license_url"},message:"must have required property '"+"license_url"+"'"};
if(vErrors === null){
vErrors = [err38];
}
else {
vErrors.push(err38);
}
errors++;
}
if(data7.attribution === undefined){
const err39 = {instancePath:instancePath+"/source",schemaPath:"#/properties/source/required",keyword:"required",params:{missingProperty: "attribution"},message:"must have required property '"+"attribution"+"'"};
if(vErrors === null){
vErrors = [err39];
}
else {
vErrors.push(err39);
}
errors++;
}
if(data7.license_review === undefined){
const err40 = {instancePath:instancePath+"/source",schemaPath:"#/properties/source/required",keyword:"required",params:{missingProperty: "license_review"},message:"must have required property '"+"license_review"+"'"};
if(vErrors === null){
vErrors = [err40];
}
else {
vErrors.push(err40);
}
errors++;
}
if(data7.is_official === undefined){
const err41 = {instancePath:instancePath+"/source",schemaPath:"#/properties/source/required",keyword:"required",params:{missingProperty: "is_official"},message:"must have required property '"+"is_official"+"'"};
if(vErrors === null){
vErrors = [err41];
}
else {
vErrors.push(err41);
}
errors++;
}
for(const key1 in data7){
if(!(func2.call(schema11.properties.source.properties, key1))){
const err42 = {instancePath:instancePath+"/source",schemaPath:"#/properties/source/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key1},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err42];
}
else {
vErrors.push(err42);
}
errors++;
}
}
if(data7.name !== undefined){
let data8 = data7.name;
if(typeof data8 === "string"){
if(func3(data8) > 500){
const err43 = {instancePath:instancePath+"/source/name",schemaPath:"#/definitions/text/maxLength",keyword:"maxLength",params:{limit: 500},message:"must NOT have more than 500 characters"};
if(vErrors === null){
vErrors = [err43];
}
else {
vErrors.push(err43);
}
errors++;
}
if(func3(data8) < 1){
const err44 = {instancePath:instancePath+"/source/name",schemaPath:"#/definitions/text/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err44];
}
else {
vErrors.push(err44);
}
errors++;
}
}
else {
const err45 = {instancePath:instancePath+"/source/name",schemaPath:"#/definitions/text/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err45];
}
else {
vErrors.push(err45);
}
errors++;
}
}
if(data7.url !== undefined){
let data9 = data7.url;
if(typeof data9 === "string"){
if(func3(data9) > 1000){
const err46 = {instancePath:instancePath+"/source/url",schemaPath:"#/definitions/https/maxLength",keyword:"maxLength",params:{limit: 1000},message:"must NOT have more than 1000 characters"};
if(vErrors === null){
vErrors = [err46];
}
else {
vErrors.push(err46);
}
errors++;
}
if(!pattern3.test(data9)){
const err47 = {instancePath:instancePath+"/source/url",schemaPath:"#/definitions/https/pattern",keyword:"pattern",params:{pattern: "^https://"},message:"must match pattern \""+"^https://"+"\""};
if(vErrors === null){
vErrors = [err47];
}
else {
vErrors.push(err47);
}
errors++;
}
if(!(formats0(data9))){
const err48 = {instancePath:instancePath+"/source/url",schemaPath:"#/definitions/https/format",keyword:"format",params:{format: "uri"},message:"must match format \""+"uri"+"\""};
if(vErrors === null){
vErrors = [err48];
}
else {
vErrors.push(err48);
}
errors++;
}
}
else {
const err49 = {instancePath:instancePath+"/source/url",schemaPath:"#/definitions/https/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err49];
}
else {
vErrors.push(err49);
}
errors++;
}
}
if(data7.version !== undefined){
let data10 = data7.version;
if((typeof data10 !== "string") && (data10 !== null)){
const err50 = {instancePath:instancePath+"/source/version",schemaPath:"#/properties/source/properties/version/type",keyword:"type",params:{type: schema11.properties.source.properties.version.type},message:"must be string,null"};
if(vErrors === null){
vErrors = [err50];
}
else {
vErrors.push(err50);
}
errors++;
}
if(typeof data10 === "string"){
if(func3(data10) > 120){
const err51 = {instancePath:instancePath+"/source/version",schemaPath:"#/properties/source/properties/version/maxLength",keyword:"maxLength",params:{limit: 120},message:"must NOT have more than 120 characters"};
if(vErrors === null){
vErrors = [err51];
}
else {
vErrors.push(err51);
}
errors++;
}
if(func3(data10) < 1){
const err52 = {instancePath:instancePath+"/source/version",schemaPath:"#/properties/source/properties/version/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err52];
}
else {
vErrors.push(err52);
}
errors++;
}
}
}
if(data7.raw_sha256 !== undefined){
let data11 = data7.raw_sha256;
const _errs29 = errors;
let valid8 = false;
const _errs30 = errors;
if(typeof data11 === "string"){
if(!pattern4.test(data11)){
const err53 = {instancePath:instancePath+"/source/raw_sha256",schemaPath:"#/definitions/hash/pattern",keyword:"pattern",params:{pattern: "^[a-f0-9]{64}$"},message:"must match pattern \""+"^[a-f0-9]{64}$"+"\""};
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
const err54 = {instancePath:instancePath+"/source/raw_sha256",schemaPath:"#/definitions/hash/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err54];
}
else {
vErrors.push(err54);
}
errors++;
}
var _valid0 = _errs30 === errors;
valid8 = valid8 || _valid0;
if(!valid8){
const _errs33 = errors;
if(data11 !== null){
const err55 = {instancePath:instancePath+"/source/raw_sha256",schemaPath:"#/properties/source/properties/raw_sha256/anyOf/1/type",keyword:"type",params:{type: "null"},message:"must be null"};
if(vErrors === null){
vErrors = [err55];
}
else {
vErrors.push(err55);
}
errors++;
}
var _valid0 = _errs33 === errors;
valid8 = valid8 || _valid0;
}
if(!valid8){
const err56 = {instancePath:instancePath+"/source/raw_sha256",schemaPath:"#/properties/source/properties/raw_sha256/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err56];
}
else {
vErrors.push(err56);
}
errors++;
}
else {
errors = _errs29;
if(vErrors !== null){
if(_errs29){
vErrors.length = _errs29;
}
else {
vErrors = null;
}
}
}
}
if(data7.license !== undefined){
let data12 = data7.license;
if(typeof data12 === "string"){
if(func3(data12) > 500){
const err57 = {instancePath:instancePath+"/source/license",schemaPath:"#/definitions/text/maxLength",keyword:"maxLength",params:{limit: 500},message:"must NOT have more than 500 characters"};
if(vErrors === null){
vErrors = [err57];
}
else {
vErrors.push(err57);
}
errors++;
}
if(func3(data12) < 1){
const err58 = {instancePath:instancePath+"/source/license",schemaPath:"#/definitions/text/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
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
const err59 = {instancePath:instancePath+"/source/license",schemaPath:"#/definitions/text/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err59];
}
else {
vErrors.push(err59);
}
errors++;
}
}
if(data7.license_url !== undefined){
let data13 = data7.license_url;
const _errs39 = errors;
let valid11 = false;
const _errs40 = errors;
if(typeof data13 === "string"){
if(func3(data13) > 1000){
const err60 = {instancePath:instancePath+"/source/license_url",schemaPath:"#/definitions/https/maxLength",keyword:"maxLength",params:{limit: 1000},message:"must NOT have more than 1000 characters"};
if(vErrors === null){
vErrors = [err60];
}
else {
vErrors.push(err60);
}
errors++;
}
if(!pattern3.test(data13)){
const err61 = {instancePath:instancePath+"/source/license_url",schemaPath:"#/definitions/https/pattern",keyword:"pattern",params:{pattern: "^https://"},message:"must match pattern \""+"^https://"+"\""};
if(vErrors === null){
vErrors = [err61];
}
else {
vErrors.push(err61);
}
errors++;
}
if(!(formats0(data13))){
const err62 = {instancePath:instancePath+"/source/license_url",schemaPath:"#/definitions/https/format",keyword:"format",params:{format: "uri"},message:"must match format \""+"uri"+"\""};
if(vErrors === null){
vErrors = [err62];
}
else {
vErrors.push(err62);
}
errors++;
}
}
else {
const err63 = {instancePath:instancePath+"/source/license_url",schemaPath:"#/definitions/https/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err63];
}
else {
vErrors.push(err63);
}
errors++;
}
var _valid1 = _errs40 === errors;
valid11 = valid11 || _valid1;
if(!valid11){
const _errs43 = errors;
if(data13 !== null){
const err64 = {instancePath:instancePath+"/source/license_url",schemaPath:"#/properties/source/properties/license_url/anyOf/1/type",keyword:"type",params:{type: "null"},message:"must be null"};
if(vErrors === null){
vErrors = [err64];
}
else {
vErrors.push(err64);
}
errors++;
}
var _valid1 = _errs43 === errors;
valid11 = valid11 || _valid1;
}
if(!valid11){
const err65 = {instancePath:instancePath+"/source/license_url",schemaPath:"#/properties/source/properties/license_url/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err65];
}
else {
vErrors.push(err65);
}
errors++;
}
else {
errors = _errs39;
if(vErrors !== null){
if(_errs39){
vErrors.length = _errs39;
}
else {
vErrors = null;
}
}
}
}
if(data7.attribution !== undefined){
let data14 = data7.attribution;
if(typeof data14 === "string"){
if(func3(data14) > 500){
const err66 = {instancePath:instancePath+"/source/attribution",schemaPath:"#/definitions/text/maxLength",keyword:"maxLength",params:{limit: 500},message:"must NOT have more than 500 characters"};
if(vErrors === null){
vErrors = [err66];
}
else {
vErrors.push(err66);
}
errors++;
}
if(func3(data14) < 1){
const err67 = {instancePath:instancePath+"/source/attribution",schemaPath:"#/definitions/text/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
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
const err68 = {instancePath:instancePath+"/source/attribution",schemaPath:"#/definitions/text/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err68];
}
else {
vErrors.push(err68);
}
errors++;
}
}
if(data7.license_review !== undefined){
let data15 = data7.license_review;
if(!(((data15 === "PERMITTED") || (data15 === "REVIEW_REQUIRED")) || (data15 === "PROHIBITED"))){
const err69 = {instancePath:instancePath+"/source/license_review",schemaPath:"#/properties/source/properties/license_review/enum",keyword:"enum",params:{allowedValues: schema11.properties.source.properties.license_review.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err69];
}
else {
vErrors.push(err69);
}
errors++;
}
}
if(data7.is_official !== undefined){
if(typeof data7.is_official !== "boolean"){
const err70 = {instancePath:instancePath+"/source/is_official",schemaPath:"#/properties/source/properties/is_official/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"};
if(vErrors === null){
vErrors = [err70];
}
else {
vErrors.push(err70);
}
errors++;
}
}
}
else {
const err71 = {instancePath:instancePath+"/source",schemaPath:"#/properties/source/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err71];
}
else {
vErrors.push(err71);
}
errors++;
}
}
if(data.fetched_at !== undefined){
let data17 = data.fetched_at;
if(typeof data17 === "string"){
if(!pattern6.test(data17)){
const err72 = {instancePath:instancePath+"/fetched_at",schemaPath:"#/definitions/time/pattern",keyword:"pattern",params:{pattern: "^(?!0000)\\d{4}-\\d{2}-\\d{2}T(?:[01]\\d|2[0-3]):[0-5]\\d:[0-5]\\d(?:\\.\\d{1,3})?Z$"},message:"must match pattern \""+"^(?!0000)\\d{4}-\\d{2}-\\d{2}T(?:[01]\\d|2[0-3]):[0-5]\\d:[0-5]\\d(?:\\.\\d{1,3})?Z$"+"\""};
if(vErrors === null){
vErrors = [err72];
}
else {
vErrors.push(err72);
}
errors++;
}
if(!(formats4.validate(data17))){
const err73 = {instancePath:instancePath+"/fetched_at",schemaPath:"#/definitions/time/format",keyword:"format",params:{format: "date-time"},message:"must match format \""+"date-time"+"\""};
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
const err74 = {instancePath:instancePath+"/fetched_at",schemaPath:"#/definitions/time/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err74];
}
else {
vErrors.push(err74);
}
errors++;
}
}
if(data.source_issued_at !== undefined){
if(!(validate11(data.source_issued_at, {instancePath:instancePath+"/source_issued_at",parentData:data,parentDataProperty:"source_issued_at",rootData}))){
vErrors = vErrors === null ? validate11.errors : vErrors.concat(validate11.errors);
errors = vErrors.length;
}
}
if(data.freshness !== undefined){
let data19 = data.freshness;
if(data19 && typeof data19 == "object" && !Array.isArray(data19)){
if(data19.basis === undefined){
const err75 = {instancePath:instancePath+"/freshness",schemaPath:"#/properties/freshness/required",keyword:"required",params:{missingProperty: "basis"},message:"must have required property '"+"basis"+"'"};
if(vErrors === null){
vErrors = [err75];
}
else {
vErrors.push(err75);
}
errors++;
}
if(data19.as_of === undefined){
const err76 = {instancePath:instancePath+"/freshness",schemaPath:"#/properties/freshness/required",keyword:"required",params:{missingProperty: "as_of"},message:"must have required property '"+"as_of"+"'"};
if(vErrors === null){
vErrors = [err76];
}
else {
vErrors.push(err76);
}
errors++;
}
if(data19.stale_after_seconds === undefined){
const err77 = {instancePath:instancePath+"/freshness",schemaPath:"#/properties/freshness/required",keyword:"required",params:{missingProperty: "stale_after_seconds"},message:"must have required property '"+"stale_after_seconds"+"'"};
if(vErrors === null){
vErrors = [err77];
}
else {
vErrors.push(err77);
}
errors++;
}
if(data19.expires_at === undefined){
const err78 = {instancePath:instancePath+"/freshness",schemaPath:"#/properties/freshness/required",keyword:"required",params:{missingProperty: "expires_at"},message:"must have required property '"+"expires_at"+"'"};
if(vErrors === null){
vErrors = [err78];
}
else {
vErrors.push(err78);
}
errors++;
}
for(const key2 in data19){
if(!((((key2 === "basis") || (key2 === "as_of")) || (key2 === "stale_after_seconds")) || (key2 === "expires_at"))){
const err79 = {instancePath:instancePath+"/freshness",schemaPath:"#/properties/freshness/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key2},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err79];
}
else {
vErrors.push(err79);
}
errors++;
}
}
if(data19.basis !== undefined){
let data20 = data19.basis;
if(!((data20 === "source_issue") || (data20 === "observation"))){
const err80 = {instancePath:instancePath+"/freshness/basis",schemaPath:"#/properties/freshness/properties/basis/enum",keyword:"enum",params:{allowedValues: schema11.properties.freshness.properties.basis.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err80];
}
else {
vErrors.push(err80);
}
errors++;
}
}
if(data19.as_of !== undefined){
if(!(validate11(data19.as_of, {instancePath:instancePath+"/freshness/as_of",parentData:data19,parentDataProperty:"as_of",rootData}))){
vErrors = vErrors === null ? validate11.errors : vErrors.concat(validate11.errors);
errors = vErrors.length;
}
}
if(data19.stale_after_seconds !== undefined){
let data22 = data19.stale_after_seconds;
if(!(((typeof data22 == "number") && (!(data22 % 1) && !isNaN(data22))) && (isFinite(data22)))){
const err81 = {instancePath:instancePath+"/freshness/stale_after_seconds",schemaPath:"#/properties/freshness/properties/stale_after_seconds/type",keyword:"type",params:{type: "integer"},message:"must be integer"};
if(vErrors === null){
vErrors = [err81];
}
else {
vErrors.push(err81);
}
errors++;
}
if((typeof data22 == "number") && (isFinite(data22))){
if(data22 > 604800 || isNaN(data22)){
const err82 = {instancePath:instancePath+"/freshness/stale_after_seconds",schemaPath:"#/properties/freshness/properties/stale_after_seconds/maximum",keyword:"maximum",params:{comparison: "<=", limit: 604800},message:"must be <= 604800"};
if(vErrors === null){
vErrors = [err82];
}
else {
vErrors.push(err82);
}
errors++;
}
if(data22 < 1 || isNaN(data22)){
const err83 = {instancePath:instancePath+"/freshness/stale_after_seconds",schemaPath:"#/properties/freshness/properties/stale_after_seconds/minimum",keyword:"minimum",params:{comparison: ">=", limit: 1},message:"must be >= 1"};
if(vErrors === null){
vErrors = [err83];
}
else {
vErrors.push(err83);
}
errors++;
}
}
}
if(data19.expires_at !== undefined){
if(!(validate11(data19.expires_at, {instancePath:instancePath+"/freshness/expires_at",parentData:data19,parentDataProperty:"expires_at",rootData}))){
vErrors = vErrors === null ? validate11.errors : vErrors.concat(validate11.errors);
errors = vErrors.length;
}
}
}
else {
const err84 = {instancePath:instancePath+"/freshness",schemaPath:"#/properties/freshness/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err84];
}
else {
vErrors.push(err84);
}
errors++;
}
}
if(data.crs !== undefined){
if("OGC:CRS84" !== data.crs){
const err85 = {instancePath:instancePath+"/crs",schemaPath:"#/properties/crs/const",keyword:"const",params:{allowedValue: "OGC:CRS84"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err85];
}
else {
vErrors.push(err85);
}
errors++;
}
}
if(data.evidence_type !== undefined){
let data25 = data.evidence_type;
if(!((((((data25 === "observed") || (data25 === "reported")) || (data25 === "derived")) || (data25 === "modelled")) || (data25 === "hypothetical")) || (data25 === "unknown"))){
const err86 = {instancePath:instancePath+"/evidence_type",schemaPath:"#/definitions/evidence/enum",keyword:"enum",params:{allowedValues: schema25.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err86];
}
else {
vErrors.push(err86);
}
errors++;
}
}
if(data.product_type !== undefined){
let data26 = data.product_type;
if(!((((((data26 === "observation") || (data26 === "reported_event")) || (data26 === "forecast")) || (data26 === "official_warning")) || (data26 === "scenario")) || (data26 === "unknown"))){
const err87 = {instancePath:instancePath+"/product_type",schemaPath:"#/definitions/product/enum",keyword:"enum",params:{allowedValues: schema26.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err87];
}
else {
vErrors.push(err87);
}
errors++;
}
}
if(data.records !== undefined){
let data27 = data.records;
if(Array.isArray(data27)){
if(data27.length > 4096){
const err88 = {instancePath:instancePath+"/records",schemaPath:"#/properties/records/maxItems",keyword:"maxItems",params:{limit: 4096},message:"must NOT have more than 4096 items"};
if(vErrors === null){
vErrors = [err88];
}
else {
vErrors.push(err88);
}
errors++;
}
const len0 = data27.length;
for(let i0=0; i0<len0; i0++){
let data28 = data27[i0];
if(data28 && typeof data28 == "object" && !Array.isArray(data28)){
if(data28.id === undefined){
const err89 = {instancePath:instancePath+"/records/" + i0,schemaPath:"#/properties/records/items/required",keyword:"required",params:{missingProperty: "id"},message:"must have required property '"+"id"+"'"};
if(vErrors === null){
vErrors = [err89];
}
else {
vErrors.push(err89);
}
errors++;
}
if(data28.label === undefined){
const err90 = {instancePath:instancePath+"/records/" + i0,schemaPath:"#/properties/records/items/required",keyword:"required",params:{missingProperty: "label"},message:"must have required property '"+"label"+"'"};
if(vErrors === null){
vErrors = [err90];
}
else {
vErrors.push(err90);
}
errors++;
}
if(data28.coordinates === undefined){
const err91 = {instancePath:instancePath+"/records/" + i0,schemaPath:"#/properties/records/items/required",keyword:"required",params:{missingProperty: "coordinates"},message:"must have required property '"+"coordinates"+"'"};
if(vErrors === null){
vErrors = [err91];
}
else {
vErrors.push(err91);
}
errors++;
}
if(data28.evidence_type === undefined){
const err92 = {instancePath:instancePath+"/records/" + i0,schemaPath:"#/properties/records/items/required",keyword:"required",params:{missingProperty: "evidence_type"},message:"must have required property '"+"evidence_type"+"'"};
if(vErrors === null){
vErrors = [err92];
}
else {
vErrors.push(err92);
}
errors++;
}
if(data28.observed_at === undefined){
const err93 = {instancePath:instancePath+"/records/" + i0,schemaPath:"#/properties/records/items/required",keyword:"required",params:{missingProperty: "observed_at"},message:"must have required property '"+"observed_at"+"'"};
if(vErrors === null){
vErrors = [err93];
}
else {
vErrors.push(err93);
}
errors++;
}
if(data28.issued_at === undefined){
const err94 = {instancePath:instancePath+"/records/" + i0,schemaPath:"#/properties/records/items/required",keyword:"required",params:{missingProperty: "issued_at"},message:"must have required property '"+"issued_at"+"'"};
if(vErrors === null){
vErrors = [err94];
}
else {
vErrors.push(err94);
}
errors++;
}
if(data28.valid_from === undefined){
const err95 = {instancePath:instancePath+"/records/" + i0,schemaPath:"#/properties/records/items/required",keyword:"required",params:{missingProperty: "valid_from"},message:"must have required property '"+"valid_from"+"'"};
if(vErrors === null){
vErrors = [err95];
}
else {
vErrors.push(err95);
}
errors++;
}
if(data28.valid_until === undefined){
const err96 = {instancePath:instancePath+"/records/" + i0,schemaPath:"#/properties/records/items/required",keyword:"required",params:{missingProperty: "valid_until"},message:"must have required property '"+"valid_until"+"'"};
if(vErrors === null){
vErrors = [err96];
}
else {
vErrors.push(err96);
}
errors++;
}
if(data28.measurements === undefined){
const err97 = {instancePath:instancePath+"/records/" + i0,schemaPath:"#/properties/records/items/required",keyword:"required",params:{missingProperty: "measurements"},message:"must have required property '"+"measurements"+"'"};
if(vErrors === null){
vErrors = [err97];
}
else {
vErrors.push(err97);
}
errors++;
}
for(const key3 in data28){
if(!(func2.call(schema11.properties.records.items.properties, key3))){
const err98 = {instancePath:instancePath+"/records/" + i0,schemaPath:"#/properties/records/items/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key3},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err98];
}
else {
vErrors.push(err98);
}
errors++;
}
}
if(data28.id !== undefined){
let data29 = data28.id;
if(typeof data29 === "string"){
if(func3(data29) > 120){
const err99 = {instancePath:instancePath+"/records/" + i0+"/id",schemaPath:"#/properties/records/items/properties/id/maxLength",keyword:"maxLength",params:{limit: 120},message:"must NOT have more than 120 characters"};
if(vErrors === null){
vErrors = [err99];
}
else {
vErrors.push(err99);
}
errors++;
}
if(func3(data29) < 1){
const err100 = {instancePath:instancePath+"/records/" + i0+"/id",schemaPath:"#/properties/records/items/properties/id/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err100];
}
else {
vErrors.push(err100);
}
errors++;
}
}
else {
const err101 = {instancePath:instancePath+"/records/" + i0+"/id",schemaPath:"#/properties/records/items/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err101];
}
else {
vErrors.push(err101);
}
errors++;
}
}
if(data28.label !== undefined){
let data30 = data28.label;
if((typeof data30 !== "string") && (data30 !== null)){
const err102 = {instancePath:instancePath+"/records/" + i0+"/label",schemaPath:"#/properties/records/items/properties/label/type",keyword:"type",params:{type: schema11.properties.records.items.properties.label.type},message:"must be string,null"};
if(vErrors === null){
vErrors = [err102];
}
else {
vErrors.push(err102);
}
errors++;
}
if(typeof data30 === "string"){
if(func3(data30) > 240){
const err103 = {instancePath:instancePath+"/records/" + i0+"/label",schemaPath:"#/properties/records/items/properties/label/maxLength",keyword:"maxLength",params:{limit: 240},message:"must NOT have more than 240 characters"};
if(vErrors === null){
vErrors = [err103];
}
else {
vErrors.push(err103);
}
errors++;
}
if(func3(data30) < 1){
const err104 = {instancePath:instancePath+"/records/" + i0+"/label",schemaPath:"#/properties/records/items/properties/label/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err104];
}
else {
vErrors.push(err104);
}
errors++;
}
}
}
if(data28.source_revision_at !== undefined){
if(!(validate11(data28.source_revision_at, {instancePath:instancePath+"/records/" + i0+"/source_revision_at",parentData:data28,parentDataProperty:"source_revision_at",rootData}))){
vErrors = vErrors === null ? validate11.errors : vErrors.concat(validate11.errors);
errors = vErrors.length;
}
}
if(data28.source_url !== undefined){
let data32 = data28.source_url;
const _errs79 = errors;
let valid21 = false;
const _errs80 = errors;
if(typeof data32 === "string"){
if(func3(data32) > 1000){
const err105 = {instancePath:instancePath+"/records/" + i0+"/source_url",schemaPath:"#/definitions/https/maxLength",keyword:"maxLength",params:{limit: 1000},message:"must NOT have more than 1000 characters"};
if(vErrors === null){
vErrors = [err105];
}
else {
vErrors.push(err105);
}
errors++;
}
if(!pattern3.test(data32)){
const err106 = {instancePath:instancePath+"/records/" + i0+"/source_url",schemaPath:"#/definitions/https/pattern",keyword:"pattern",params:{pattern: "^https://"},message:"must match pattern \""+"^https://"+"\""};
if(vErrors === null){
vErrors = [err106];
}
else {
vErrors.push(err106);
}
errors++;
}
if(!(formats0(data32))){
const err107 = {instancePath:instancePath+"/records/" + i0+"/source_url",schemaPath:"#/definitions/https/format",keyword:"format",params:{format: "uri"},message:"must match format \""+"uri"+"\""};
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
const err108 = {instancePath:instancePath+"/records/" + i0+"/source_url",schemaPath:"#/definitions/https/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err108];
}
else {
vErrors.push(err108);
}
errors++;
}
var _valid2 = _errs80 === errors;
valid21 = valid21 || _valid2;
if(!valid21){
const _errs83 = errors;
if(data32 !== null){
const err109 = {instancePath:instancePath+"/records/" + i0+"/source_url",schemaPath:"#/properties/records/items/properties/source_url/anyOf/1/type",keyword:"type",params:{type: "null"},message:"must be null"};
if(vErrors === null){
vErrors = [err109];
}
else {
vErrors.push(err109);
}
errors++;
}
var _valid2 = _errs83 === errors;
valid21 = valid21 || _valid2;
}
if(!valid21){
const err110 = {instancePath:instancePath+"/records/" + i0+"/source_url",schemaPath:"#/properties/records/items/properties/source_url/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err110];
}
else {
vErrors.push(err110);
}
errors++;
}
else {
errors = _errs79;
if(vErrors !== null){
if(_errs79){
vErrors.length = _errs79;
}
else {
vErrors = null;
}
}
}
}
if(data28.source_network !== undefined){
let data33 = data28.source_network;
if((typeof data33 !== "string") && (data33 !== null)){
const err111 = {instancePath:instancePath+"/records/" + i0+"/source_network",schemaPath:"#/properties/records/items/properties/source_network/type",keyword:"type",params:{type: schema11.properties.records.items.properties.source_network.type},message:"must be string,null"};
if(vErrors === null){
vErrors = [err111];
}
else {
vErrors.push(err111);
}
errors++;
}
if(typeof data33 === "string"){
if(func3(data33) > 40){
const err112 = {instancePath:instancePath+"/records/" + i0+"/source_network",schemaPath:"#/properties/records/items/properties/source_network/maxLength",keyword:"maxLength",params:{limit: 40},message:"must NOT have more than 40 characters"};
if(vErrors === null){
vErrors = [err112];
}
else {
vErrors.push(err112);
}
errors++;
}
if(func3(data33) < 1){
const err113 = {instancePath:instancePath+"/records/" + i0+"/source_network",schemaPath:"#/properties/records/items/properties/source_network/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err113];
}
else {
vErrors.push(err113);
}
errors++;
}
}
}
if(data28.coordinates !== undefined){
let data34 = data28.coordinates;
const _errs88 = errors;
let valid23 = false;
const _errs89 = errors;
if(data34 !== null){
const err114 = {instancePath:instancePath+"/records/" + i0+"/coordinates",schemaPath:"#/properties/records/items/properties/coordinates/anyOf/0/type",keyword:"type",params:{type: "null"},message:"must be null"};
if(vErrors === null){
vErrors = [err114];
}
else {
vErrors.push(err114);
}
errors++;
}
var _valid3 = _errs89 === errors;
valid23 = valid23 || _valid3;
if(!valid23){
const _errs91 = errors;
if(Array.isArray(data34)){
if(data34.length > 2){
const err115 = {instancePath:instancePath+"/records/" + i0+"/coordinates",schemaPath:"#/properties/records/items/properties/coordinates/anyOf/1/maxItems",keyword:"maxItems",params:{limit: 2},message:"must NOT have more than 2 items"};
if(vErrors === null){
vErrors = [err115];
}
else {
vErrors.push(err115);
}
errors++;
}
if(data34.length < 2){
const err116 = {instancePath:instancePath+"/records/" + i0+"/coordinates",schemaPath:"#/properties/records/items/properties/coordinates/anyOf/1/minItems",keyword:"minItems",params:{limit: 2},message:"must NOT have fewer than 2 items"};
if(vErrors === null){
vErrors = [err116];
}
else {
vErrors.push(err116);
}
errors++;
}
const len1 = data34.length;
if(!(len1 <= 2)){
const err117 = {instancePath:instancePath+"/records/" + i0+"/coordinates",schemaPath:"#/properties/records/items/properties/coordinates/anyOf/1/additionalItems",keyword:"additionalItems",params:{limit: 2},message:"must NOT have more than 2 items"};
if(vErrors === null){
vErrors = [err117];
}
else {
vErrors.push(err117);
}
errors++;
}
const len2 = data34.length;
if(len2 > 0){
let data35 = data34[0];
if((typeof data35 == "number") && (isFinite(data35))){
if(data35 > 180 || isNaN(data35)){
const err118 = {instancePath:instancePath+"/records/" + i0+"/coordinates/0",schemaPath:"#/properties/records/items/properties/coordinates/anyOf/1/items/0/maximum",keyword:"maximum",params:{comparison: "<=", limit: 180},message:"must be <= 180"};
if(vErrors === null){
vErrors = [err118];
}
else {
vErrors.push(err118);
}
errors++;
}
if(data35 < -180 || isNaN(data35)){
const err119 = {instancePath:instancePath+"/records/" + i0+"/coordinates/0",schemaPath:"#/properties/records/items/properties/coordinates/anyOf/1/items/0/minimum",keyword:"minimum",params:{comparison: ">=", limit: -180},message:"must be >= -180"};
if(vErrors === null){
vErrors = [err119];
}
else {
vErrors.push(err119);
}
errors++;
}
}
else {
const err120 = {instancePath:instancePath+"/records/" + i0+"/coordinates/0",schemaPath:"#/properties/records/items/properties/coordinates/anyOf/1/items/0/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err120];
}
else {
vErrors.push(err120);
}
errors++;
}
}
if(len2 > 1){
let data36 = data34[1];
if((typeof data36 == "number") && (isFinite(data36))){
if(data36 > 90 || isNaN(data36)){
const err121 = {instancePath:instancePath+"/records/" + i0+"/coordinates/1",schemaPath:"#/properties/records/items/properties/coordinates/anyOf/1/items/1/maximum",keyword:"maximum",params:{comparison: "<=", limit: 90},message:"must be <= 90"};
if(vErrors === null){
vErrors = [err121];
}
else {
vErrors.push(err121);
}
errors++;
}
if(data36 < -90 || isNaN(data36)){
const err122 = {instancePath:instancePath+"/records/" + i0+"/coordinates/1",schemaPath:"#/properties/records/items/properties/coordinates/anyOf/1/items/1/minimum",keyword:"minimum",params:{comparison: ">=", limit: -90},message:"must be >= -90"};
if(vErrors === null){
vErrors = [err122];
}
else {
vErrors.push(err122);
}
errors++;
}
}
else {
const err123 = {instancePath:instancePath+"/records/" + i0+"/coordinates/1",schemaPath:"#/properties/records/items/properties/coordinates/anyOf/1/items/1/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err123];
}
else {
vErrors.push(err123);
}
errors++;
}
}
}
else {
const err124 = {instancePath:instancePath+"/records/" + i0+"/coordinates",schemaPath:"#/properties/records/items/properties/coordinates/anyOf/1/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err124];
}
else {
vErrors.push(err124);
}
errors++;
}
var _valid3 = _errs91 === errors;
valid23 = valid23 || _valid3;
}
if(!valid23){
const err125 = {instancePath:instancePath+"/records/" + i0+"/coordinates",schemaPath:"#/properties/records/items/properties/coordinates/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err125];
}
else {
vErrors.push(err125);
}
errors++;
}
else {
errors = _errs88;
if(vErrors !== null){
if(_errs88){
vErrors.length = _errs88;
}
else {
vErrors = null;
}
}
}
}
if(data28.evidence_type !== undefined){
let data37 = data28.evidence_type;
if(!((((((data37 === "observed") || (data37 === "reported")) || (data37 === "derived")) || (data37 === "modelled")) || (data37 === "hypothetical")) || (data37 === "unknown"))){
const err126 = {instancePath:instancePath+"/records/" + i0+"/evidence_type",schemaPath:"#/definitions/evidence/enum",keyword:"enum",params:{allowedValues: schema25.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err126];
}
else {
vErrors.push(err126);
}
errors++;
}
}
if(data28.observed_at !== undefined){
if(!(validate11(data28.observed_at, {instancePath:instancePath+"/records/" + i0+"/observed_at",parentData:data28,parentDataProperty:"observed_at",rootData}))){
vErrors = vErrors === null ? validate11.errors : vErrors.concat(validate11.errors);
errors = vErrors.length;
}
}
if(data28.issued_at !== undefined){
if(!(validate11(data28.issued_at, {instancePath:instancePath+"/records/" + i0+"/issued_at",parentData:data28,parentDataProperty:"issued_at",rootData}))){
vErrors = vErrors === null ? validate11.errors : vErrors.concat(validate11.errors);
errors = vErrors.length;
}
}
if(data28.valid_from !== undefined){
if(!(validate11(data28.valid_from, {instancePath:instancePath+"/records/" + i0+"/valid_from",parentData:data28,parentDataProperty:"valid_from",rootData}))){
vErrors = vErrors === null ? validate11.errors : vErrors.concat(validate11.errors);
errors = vErrors.length;
}
}
if(data28.valid_until !== undefined){
if(!(validate11(data28.valid_until, {instancePath:instancePath+"/records/" + i0+"/valid_until",parentData:data28,parentDataProperty:"valid_until",rootData}))){
vErrors = vErrors === null ? validate11.errors : vErrors.concat(validate11.errors);
errors = vErrors.length;
}
}
if(data28.measurements !== undefined){
let data42 = data28.measurements;
if(Array.isArray(data42)){
if(data42.length > 16){
const err127 = {instancePath:instancePath+"/records/" + i0+"/measurements",schemaPath:"#/properties/records/items/properties/measurements/maxItems",keyword:"maxItems",params:{limit: 16},message:"must NOT have more than 16 items"};
if(vErrors === null){
vErrors = [err127];
}
else {
vErrors.push(err127);
}
errors++;
}
const len3 = data42.length;
for(let i1=0; i1<len3; i1++){
let data43 = data42[i1];
if(data43 && typeof data43 == "object" && !Array.isArray(data43)){
if(data43.variable === undefined){
const err128 = {instancePath:instancePath+"/records/" + i0+"/measurements/" + i1,schemaPath:"#/properties/records/items/properties/measurements/items/required",keyword:"required",params:{missingProperty: "variable"},message:"must have required property '"+"variable"+"'"};
if(vErrors === null){
vErrors = [err128];
}
else {
vErrors.push(err128);
}
errors++;
}
if(data43.value === undefined){
const err129 = {instancePath:instancePath+"/records/" + i0+"/measurements/" + i1,schemaPath:"#/properties/records/items/properties/measurements/items/required",keyword:"required",params:{missingProperty: "value"},message:"must have required property '"+"value"+"'"};
if(vErrors === null){
vErrors = [err129];
}
else {
vErrors.push(err129);
}
errors++;
}
if(data43.unit === undefined){
const err130 = {instancePath:instancePath+"/records/" + i0+"/measurements/" + i1,schemaPath:"#/properties/records/items/properties/measurements/items/required",keyword:"required",params:{missingProperty: "unit"},message:"must have required property '"+"unit"+"'"};
if(vErrors === null){
vErrors = [err130];
}
else {
vErrors.push(err130);
}
errors++;
}
if(data43.qualifier === undefined){
const err131 = {instancePath:instancePath+"/records/" + i0+"/measurements/" + i1,schemaPath:"#/properties/records/items/properties/measurements/items/required",keyword:"required",params:{missingProperty: "qualifier"},message:"must have required property '"+"qualifier"+"'"};
if(vErrors === null){
vErrors = [err131];
}
else {
vErrors.push(err131);
}
errors++;
}
if(data43.evidence_type === undefined){
const err132 = {instancePath:instancePath+"/records/" + i0+"/measurements/" + i1,schemaPath:"#/properties/records/items/properties/measurements/items/required",keyword:"required",params:{missingProperty: "evidence_type"},message:"must have required property '"+"evidence_type"+"'"};
if(vErrors === null){
vErrors = [err132];
}
else {
vErrors.push(err132);
}
errors++;
}
for(const key4 in data43){
if(!(((((key4 === "variable") || (key4 === "value")) || (key4 === "unit")) || (key4 === "qualifier")) || (key4 === "evidence_type"))){
const err133 = {instancePath:instancePath+"/records/" + i0+"/measurements/" + i1,schemaPath:"#/properties/records/items/properties/measurements/items/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key4},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err133];
}
else {
vErrors.push(err133);
}
errors++;
}
}
if(data43.variable !== undefined){
let data44 = data43.variable;
if(!(((((((((data44 === "magnitude") || (data44 === "depth")) || (data44 === "precipitation_accumulation")) || (data44 === "precipitation_rate")) || (data44 === "temperature")) || (data44 === "water_level")) || (data44 === "discharge")) || (data44 === "pm25")) || (data44 === "aqi"))){
const err134 = {instancePath:instancePath+"/records/" + i0+"/measurements/" + i1+"/variable",schemaPath:"#/properties/records/items/properties/measurements/items/properties/variable/enum",keyword:"enum",params:{allowedValues: schema11.properties.records.items.properties.measurements.items.properties.variable.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err134];
}
else {
vErrors.push(err134);
}
errors++;
}
}
if(data43.value !== undefined){
let data45 = data43.value;
if((!((typeof data45 == "number") && (isFinite(data45)))) && (data45 !== null)){
const err135 = {instancePath:instancePath+"/records/" + i0+"/measurements/" + i1+"/value",schemaPath:"#/properties/records/items/properties/measurements/items/properties/value/type",keyword:"type",params:{type: schema11.properties.records.items.properties.measurements.items.properties.value.type},message:"must be number,null"};
if(vErrors === null){
vErrors = [err135];
}
else {
vErrors.push(err135);
}
errors++;
}
}
if(data43.unit !== undefined){
let data46 = data43.unit;
if(!(((((((((data46 === "magnitude") || (data46 === "km")) || (data46 === "mm")) || (data46 === "mm/h")) || (data46 === "degC")) || (data46 === "m")) || (data46 === "m3/s")) || (data46 === "ug/m3")) || (data46 === "dimensionless"))){
const err136 = {instancePath:instancePath+"/records/" + i0+"/measurements/" + i1+"/unit",schemaPath:"#/properties/records/items/properties/measurements/items/properties/unit/enum",keyword:"enum",params:{allowedValues: schema11.properties.records.items.properties.measurements.items.properties.unit.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err136];
}
else {
vErrors.push(err136);
}
errors++;
}
}
if(data43.qualifier !== undefined){
let data47 = data43.qualifier;
if((typeof data47 !== "string") && (data47 !== null)){
const err137 = {instancePath:instancePath+"/records/" + i0+"/measurements/" + i1+"/qualifier",schemaPath:"#/properties/records/items/properties/measurements/items/properties/qualifier/type",keyword:"type",params:{type: schema11.properties.records.items.properties.measurements.items.properties.qualifier.type},message:"must be string,null"};
if(vErrors === null){
vErrors = [err137];
}
else {
vErrors.push(err137);
}
errors++;
}
if(typeof data47 === "string"){
if(func3(data47) > 120){
const err138 = {instancePath:instancePath+"/records/" + i0+"/measurements/" + i1+"/qualifier",schemaPath:"#/properties/records/items/properties/measurements/items/properties/qualifier/maxLength",keyword:"maxLength",params:{limit: 120},message:"must NOT have more than 120 characters"};
if(vErrors === null){
vErrors = [err138];
}
else {
vErrors.push(err138);
}
errors++;
}
if(func3(data47) < 1){
const err139 = {instancePath:instancePath+"/records/" + i0+"/measurements/" + i1+"/qualifier",schemaPath:"#/properties/records/items/properties/measurements/items/properties/qualifier/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err139];
}
else {
vErrors.push(err139);
}
errors++;
}
}
}
if(data43.evidence_type !== undefined){
let data48 = data43.evidence_type;
if(!((((((data48 === "observed") || (data48 === "reported")) || (data48 === "derived")) || (data48 === "modelled")) || (data48 === "hypothetical")) || (data48 === "unknown"))){
const err140 = {instancePath:instancePath+"/records/" + i0+"/measurements/" + i1+"/evidence_type",schemaPath:"#/definitions/evidence/enum",keyword:"enum",params:{allowedValues: schema25.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err140];
}
else {
vErrors.push(err140);
}
errors++;
}
}
}
else {
const err141 = {instancePath:instancePath+"/records/" + i0+"/measurements/" + i1,schemaPath:"#/properties/records/items/properties/measurements/items/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err141];
}
else {
vErrors.push(err141);
}
errors++;
}
}
}
else {
const err142 = {instancePath:instancePath+"/records/" + i0+"/measurements",schemaPath:"#/properties/records/items/properties/measurements/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err142];
}
else {
vErrors.push(err142);
}
errors++;
}
}
}
else {
const err143 = {instancePath:instancePath+"/records/" + i0,schemaPath:"#/properties/records/items/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err143];
}
else {
vErrors.push(err143);
}
errors++;
}
}
}
else {
const err144 = {instancePath:instancePath+"/records",schemaPath:"#/properties/records/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err144];
}
else {
vErrors.push(err144);
}
errors++;
}
}
if(data.assumptions !== undefined){
if(!(validate20(data.assumptions, {instancePath:instancePath+"/assumptions",parentData:data,parentDataProperty:"assumptions",rootData}))){
vErrors = vErrors === null ? validate20.errors : vErrors.concat(validate20.errors);
errors = vErrors.length;
}
}
if(data.limitations !== undefined){
let data50 = data.limitations;
if(!(validate20(data50, {instancePath:instancePath+"/limitations",parentData:data,parentDataProperty:"limitations",rootData}))){
vErrors = vErrors === null ? validate20.errors : vErrors.concat(validate20.errors);
errors = vErrors.length;
}
if(Array.isArray(data50)){
if(data50.length < 1){
const err145 = {instancePath:instancePath+"/limitations",schemaPath:"#/properties/limitations/minItems",keyword:"minItems",params:{limit: 1},message:"must NOT have fewer than 1 items"};
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
const err146 = {instancePath:instancePath+"/limitations",schemaPath:"#/properties/limitations/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err146];
}
else {
vErrors.push(err146);
}
errors++;
}
}
if(data.unsupported_outputs !== undefined){
let data51 = data.unsupported_outputs;
if(data51 && typeof data51 == "object" && !Array.isArray(data51)){
if(data51.physical_inundation === undefined){
const err147 = {instancePath:instancePath+"/unsupported_outputs",schemaPath:"#/properties/unsupported_outputs/required",keyword:"required",params:{missingProperty: "physical_inundation"},message:"must have required property '"+"physical_inundation"+"'"};
if(vErrors === null){
vErrors = [err147];
}
else {
vErrors.push(err147);
}
errors++;
}
if(data51.destroyed_buildings === undefined){
const err148 = {instancePath:instancePath+"/unsupported_outputs",schemaPath:"#/properties/unsupported_outputs/required",keyword:"required",params:{missingProperty: "destroyed_buildings"},message:"must have required property '"+"destroyed_buildings"+"'"};
if(vErrors === null){
vErrors = [err148];
}
else {
vErrors.push(err148);
}
errors++;
}
if(data51.casualties === undefined){
const err149 = {instancePath:instancePath+"/unsupported_outputs",schemaPath:"#/properties/unsupported_outputs/required",keyword:"required",params:{missingProperty: "casualties"},message:"must have required property '"+"casualties"+"'"};
if(vErrors === null){
vErrors = [err149];
}
else {
vErrors.push(err149);
}
errors++;
}
if(data51.repair_costs === undefined){
const err150 = {instancePath:instancePath+"/unsupported_outputs",schemaPath:"#/properties/unsupported_outputs/required",keyword:"required",params:{missingProperty: "repair_costs"},message:"must have required property '"+"repair_costs"+"'"};
if(vErrors === null){
vErrors = [err150];
}
else {
vErrors.push(err150);
}
errors++;
}
if(data51.hydropower_downtime === undefined){
const err151 = {instancePath:instancePath+"/unsupported_outputs",schemaPath:"#/properties/unsupported_outputs/required",keyword:"required",params:{missingProperty: "hydropower_downtime"},message:"must have required property '"+"hydropower_downtime"+"'"};
if(vErrors === null){
vErrors = [err151];
}
else {
vErrors.push(err151);
}
errors++;
}
if(data51.economic_loss === undefined){
const err152 = {instancePath:instancePath+"/unsupported_outputs",schemaPath:"#/properties/unsupported_outputs/required",keyword:"required",params:{missingProperty: "economic_loss"},message:"must have required property '"+"economic_loss"+"'"};
if(vErrors === null){
vErrors = [err152];
}
else {
vErrors.push(err152);
}
errors++;
}
for(const key5 in data51){
if(!((((((key5 === "physical_inundation") || (key5 === "destroyed_buildings")) || (key5 === "casualties")) || (key5 === "repair_costs")) || (key5 === "hydropower_downtime")) || (key5 === "economic_loss"))){
const err153 = {instancePath:instancePath+"/unsupported_outputs",schemaPath:"#/properties/unsupported_outputs/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key5},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err153];
}
else {
vErrors.push(err153);
}
errors++;
}
}
if(data51.physical_inundation !== undefined){
if(data51.physical_inundation !== null){
const err154 = {instancePath:instancePath+"/unsupported_outputs/physical_inundation",schemaPath:"#/properties/unsupported_outputs/properties/physical_inundation/type",keyword:"type",params:{type: "null"},message:"must be null"};
if(vErrors === null){
vErrors = [err154];
}
else {
vErrors.push(err154);
}
errors++;
}
}
if(data51.destroyed_buildings !== undefined){
if(data51.destroyed_buildings !== null){
const err155 = {instancePath:instancePath+"/unsupported_outputs/destroyed_buildings",schemaPath:"#/properties/unsupported_outputs/properties/destroyed_buildings/type",keyword:"type",params:{type: "null"},message:"must be null"};
if(vErrors === null){
vErrors = [err155];
}
else {
vErrors.push(err155);
}
errors++;
}
}
if(data51.casualties !== undefined){
if(data51.casualties !== null){
const err156 = {instancePath:instancePath+"/unsupported_outputs/casualties",schemaPath:"#/properties/unsupported_outputs/properties/casualties/type",keyword:"type",params:{type: "null"},message:"must be null"};
if(vErrors === null){
vErrors = [err156];
}
else {
vErrors.push(err156);
}
errors++;
}
}
if(data51.repair_costs !== undefined){
if(data51.repair_costs !== null){
const err157 = {instancePath:instancePath+"/unsupported_outputs/repair_costs",schemaPath:"#/properties/unsupported_outputs/properties/repair_costs/type",keyword:"type",params:{type: "null"},message:"must be null"};
if(vErrors === null){
vErrors = [err157];
}
else {
vErrors.push(err157);
}
errors++;
}
}
if(data51.hydropower_downtime !== undefined){
if(data51.hydropower_downtime !== null){
const err158 = {instancePath:instancePath+"/unsupported_outputs/hydropower_downtime",schemaPath:"#/properties/unsupported_outputs/properties/hydropower_downtime/type",keyword:"type",params:{type: "null"},message:"must be null"};
if(vErrors === null){
vErrors = [err158];
}
else {
vErrors.push(err158);
}
errors++;
}
}
if(data51.economic_loss !== undefined){
if(data51.economic_loss !== null){
const err159 = {instancePath:instancePath+"/unsupported_outputs/economic_loss",schemaPath:"#/properties/unsupported_outputs/properties/economic_loss/type",keyword:"type",params:{type: "null"},message:"must be null"};
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
else {
const err160 = {instancePath:instancePath+"/unsupported_outputs",schemaPath:"#/properties/unsupported_outputs/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err160];
}
else {
vErrors.push(err160);
}
errors++;
}
}
if(data.notice !== undefined){
if("Periodically updated conditions; not a real-time warning service." !== data.notice){
const err161 = {instancePath:instancePath+"/notice",schemaPath:"#/properties/notice/const",keyword:"const",params:{allowedValue: "Periodically updated conditions; not a real-time warning service."},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err161];
}
else {
vErrors.push(err161);
}
errors++;
}
}
}
else {
const err162 = {instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err162];
}
else {
vErrors.push(err162);
}
errors++;
}
validate10.errors = vErrors;
return errors === 0;
}

