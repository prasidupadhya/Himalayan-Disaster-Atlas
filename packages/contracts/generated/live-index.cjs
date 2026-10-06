// Generated from live-index.schema.json; run npm run contracts:generate. Do not edit.
"use strict";
module.exports = validate10;
module.exports.default = validate10;
const schema11 = {"$schema":"http://json-schema.org/draft-07/schema#","$id":"https://himalayan-disaster-atlas.invalid/schemas/live-index.schema.json","type":"object","additionalProperties":false,"required":["schema_version","kind","is_fixture","generated_at","workflow","feeds"],"properties":{"schema_version":{"const":"1.0.0"},"kind":{"const":"live-index"},"is_fixture":{"type":"boolean"},"generated_at":{"$ref":"live-snapshot.schema.json#/definitions/time"},"workflow":{"type":"object","additionalProperties":false,"required":["status","last_attempt_at","last_successful_fetch_at","run_url","schedule_seconds","stale_after_seconds"],"properties":{"status":{"enum":["success","partial","failed","not_configured"]},"last_attempt_at":{"$ref":"live-snapshot.schema.json#/definitions/nullableTime"},"last_successful_fetch_at":{"$ref":"live-snapshot.schema.json#/definitions/nullableTime"},"run_url":{"anyOf":[{"type":"null"},{"type":"string","pattern":"^https://github\\.com/prasidupadhya/Himalayan-Disaster-Atlas/actions/runs/[0-9]+$"}]},"schedule_seconds":{"const":10800},"stale_after_seconds":{"type":"integer","minimum":10800,"maximum":86400}}},"feeds":{"type":"array","maxItems":8,"items":{"type":"object","additionalProperties":false,"required":["feed_id","enabled","attempt_status","last_attempt_at","last_successful_fetch_at","error_code","snapshot"],"properties":{"feed_id":{"$ref":"live-snapshot.schema.json#/definitions/feed"},"enabled":{"type":"boolean"},"attempt_status":{"enum":["success","failed","not_configured"]},"last_attempt_at":{"$ref":"live-snapshot.schema.json#/definitions/nullableTime"},"last_successful_fetch_at":{"$ref":"live-snapshot.schema.json#/definitions/nullableTime"},"error_code":{"enum":[null,"http_error","network_error","timeout","invalid_data","license_unresolved","disabled"]},"snapshot":{"anyOf":[{"type":"null"},{"$ref":"#/definitions/reference"}]}}}}},"definitions":{"reference":{"type":"object","additionalProperties":false,"required":["dataset_id","version","id","path","sha256","byte_size"],"properties":{"dataset_id":{"$ref":"live-snapshot.schema.json#/definitions/id"},"version":{"$ref":"live-snapshot.schema.json#/definitions/version"},"id":{"$ref":"live-snapshot.schema.json#/definitions/id"},"path":{"type":"string","pattern":"^/data/[a-z0-9-]+/[0-9]+\\.[0-9]+\\.[0-9]+/[a-z0-9-]+\\.json$"},"sha256":{"$ref":"live-snapshot.schema.json#/definitions/hash"},"byte_size":{"type":"integer","minimum":1,"maximum":524288}}}}};
const schema23 = {"type":"string","format":"date-time","pattern":"^(?!0000)\\d{4}-\\d{2}-\\d{2}T(?:[01]\\d|2[0-3]):[0-5]\\d:[0-5]\\d(?:\\.\\d{1,3})?Z$"};
const schema16 = {"enum":["usgs","noaa-gfs","dhm","bipad","openaq","open-meteo","imerg","contract-fixture"]};
const formats4 = require("ajv-formats/dist/formats").fullFormats["date-time"];
const pattern6 = new RegExp("^(?!0000)\\d{4}-\\d{2}-\\d{2}T(?:[01]\\d|2[0-3]):[0-5]\\d:[0-5]\\d(?:\\.\\d{1,3})?Z$", "u");
const pattern11 = new RegExp("^https://github\\.com/prasidupadhya/Himalayan-Disaster-Atlas/actions/runs/[0-9]+$", "u");
const schema24 = {"anyOf":[{"$ref":"#/definitions/time"},{"type":"null"}]};

function validate24(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
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
validate24.errors = vErrors;
return errors === 0;
}

const schema37 = {"type":"object","additionalProperties":false,"required":["dataset_id","version","id","path","sha256","byte_size"],"properties":{"dataset_id":{"$ref":"live-snapshot.schema.json#/definitions/id"},"version":{"$ref":"live-snapshot.schema.json#/definitions/version"},"id":{"$ref":"live-snapshot.schema.json#/definitions/id"},"path":{"type":"string","pattern":"^/data/[a-z0-9-]+/[0-9]+\\.[0-9]+\\.[0-9]+/[a-z0-9-]+\\.json$"},"sha256":{"$ref":"live-snapshot.schema.json#/definitions/hash"},"byte_size":{"type":"integer","minimum":1,"maximum":524288}}};
const schema13 = {"type":"string","pattern":"^[a-z0-9]+(?:-[a-z0-9]+)*$","maxLength":100};
const schema14 = {"type":"string","pattern":"^\\d+\\.\\d+\\.\\d+$","maxLength":40};
const schema19 = {"type":"string","pattern":"^[a-f0-9]{64}$"};
const func3 = require("ajv/dist/runtime/ucs2length").default;
const pattern0 = new RegExp("^[a-z0-9]+(?:-[a-z0-9]+)*$", "u");
const pattern1 = new RegExp("^\\d+\\.\\d+\\.\\d+$", "u");
const pattern15 = new RegExp("^/data/[a-z0-9-]+/[0-9]+\\.[0-9]+\\.[0-9]+/[a-z0-9-]+\\.json$", "u");
const pattern4 = new RegExp("^[a-f0-9]{64}$", "u");

function validate29(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.dataset_id === undefined){
const err0 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "dataset_id"},message:"must have required property '"+"dataset_id"+"'"};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
if(data.version === undefined){
const err1 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "version"},message:"must have required property '"+"version"+"'"};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
if(data.id === undefined){
const err2 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "id"},message:"must have required property '"+"id"+"'"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
if(data.path === undefined){
const err3 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "path"},message:"must have required property '"+"path"+"'"};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
if(data.sha256 === undefined){
const err4 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "sha256"},message:"must have required property '"+"sha256"+"'"};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
if(data.byte_size === undefined){
const err5 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "byte_size"},message:"must have required property '"+"byte_size"+"'"};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
for(const key0 in data){
if(!((((((key0 === "dataset_id") || (key0 === "version")) || (key0 === "id")) || (key0 === "path")) || (key0 === "sha256")) || (key0 === "byte_size"))){
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
if(data.dataset_id !== undefined){
let data0 = data.dataset_id;
if(typeof data0 === "string"){
if(func3(data0) > 100){
const err7 = {instancePath:instancePath+"/dataset_id",schemaPath:"live-snapshot.schema.json#/definitions/id/maxLength",keyword:"maxLength",params:{limit: 100},message:"must NOT have more than 100 characters"};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
}
if(!pattern0.test(data0)){
const err8 = {instancePath:instancePath+"/dataset_id",schemaPath:"live-snapshot.schema.json#/definitions/id/pattern",keyword:"pattern",params:{pattern: "^[a-z0-9]+(?:-[a-z0-9]+)*$"},message:"must match pattern \""+"^[a-z0-9]+(?:-[a-z0-9]+)*$"+"\""};
if(vErrors === null){
vErrors = [err8];
}
else {
vErrors.push(err8);
}
errors++;
}
}
else {
const err9 = {instancePath:instancePath+"/dataset_id",schemaPath:"live-snapshot.schema.json#/definitions/id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err9];
}
else {
vErrors.push(err9);
}
errors++;
}
}
if(data.version !== undefined){
let data1 = data.version;
if(typeof data1 === "string"){
if(func3(data1) > 40){
const err10 = {instancePath:instancePath+"/version",schemaPath:"live-snapshot.schema.json#/definitions/version/maxLength",keyword:"maxLength",params:{limit: 40},message:"must NOT have more than 40 characters"};
if(vErrors === null){
vErrors = [err10];
}
else {
vErrors.push(err10);
}
errors++;
}
if(!pattern1.test(data1)){
const err11 = {instancePath:instancePath+"/version",schemaPath:"live-snapshot.schema.json#/definitions/version/pattern",keyword:"pattern",params:{pattern: "^\\d+\\.\\d+\\.\\d+$"},message:"must match pattern \""+"^\\d+\\.\\d+\\.\\d+$"+"\""};
if(vErrors === null){
vErrors = [err11];
}
else {
vErrors.push(err11);
}
errors++;
}
}
else {
const err12 = {instancePath:instancePath+"/version",schemaPath:"live-snapshot.schema.json#/definitions/version/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err12];
}
else {
vErrors.push(err12);
}
errors++;
}
}
if(data.id !== undefined){
let data2 = data.id;
if(typeof data2 === "string"){
if(func3(data2) > 100){
const err13 = {instancePath:instancePath+"/id",schemaPath:"live-snapshot.schema.json#/definitions/id/maxLength",keyword:"maxLength",params:{limit: 100},message:"must NOT have more than 100 characters"};
if(vErrors === null){
vErrors = [err13];
}
else {
vErrors.push(err13);
}
errors++;
}
if(!pattern0.test(data2)){
const err14 = {instancePath:instancePath+"/id",schemaPath:"live-snapshot.schema.json#/definitions/id/pattern",keyword:"pattern",params:{pattern: "^[a-z0-9]+(?:-[a-z0-9]+)*$"},message:"must match pattern \""+"^[a-z0-9]+(?:-[a-z0-9]+)*$"+"\""};
if(vErrors === null){
vErrors = [err14];
}
else {
vErrors.push(err14);
}
errors++;
}
}
else {
const err15 = {instancePath:instancePath+"/id",schemaPath:"live-snapshot.schema.json#/definitions/id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err15];
}
else {
vErrors.push(err15);
}
errors++;
}
}
if(data.path !== undefined){
let data3 = data.path;
if(typeof data3 === "string"){
if(!pattern15.test(data3)){
const err16 = {instancePath:instancePath+"/path",schemaPath:"#/properties/path/pattern",keyword:"pattern",params:{pattern: "^/data/[a-z0-9-]+/[0-9]+\\.[0-9]+\\.[0-9]+/[a-z0-9-]+\\.json$"},message:"must match pattern \""+"^/data/[a-z0-9-]+/[0-9]+\\.[0-9]+\\.[0-9]+/[a-z0-9-]+\\.json$"+"\""};
if(vErrors === null){
vErrors = [err16];
}
else {
vErrors.push(err16);
}
errors++;
}
}
else {
const err17 = {instancePath:instancePath+"/path",schemaPath:"#/properties/path/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err17];
}
else {
vErrors.push(err17);
}
errors++;
}
}
if(data.sha256 !== undefined){
let data4 = data.sha256;
if(typeof data4 === "string"){
if(!pattern4.test(data4)){
const err18 = {instancePath:instancePath+"/sha256",schemaPath:"live-snapshot.schema.json#/definitions/hash/pattern",keyword:"pattern",params:{pattern: "^[a-f0-9]{64}$"},message:"must match pattern \""+"^[a-f0-9]{64}$"+"\""};
if(vErrors === null){
vErrors = [err18];
}
else {
vErrors.push(err18);
}
errors++;
}
}
else {
const err19 = {instancePath:instancePath+"/sha256",schemaPath:"live-snapshot.schema.json#/definitions/hash/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err19];
}
else {
vErrors.push(err19);
}
errors++;
}
}
if(data.byte_size !== undefined){
let data5 = data.byte_size;
if(!(((typeof data5 == "number") && (!(data5 % 1) && !isNaN(data5))) && (isFinite(data5)))){
const err20 = {instancePath:instancePath+"/byte_size",schemaPath:"#/properties/byte_size/type",keyword:"type",params:{type: "integer"},message:"must be integer"};
if(vErrors === null){
vErrors = [err20];
}
else {
vErrors.push(err20);
}
errors++;
}
if((typeof data5 == "number") && (isFinite(data5))){
if(data5 > 524288 || isNaN(data5)){
const err21 = {instancePath:instancePath+"/byte_size",schemaPath:"#/properties/byte_size/maximum",keyword:"maximum",params:{comparison: "<=", limit: 524288},message:"must be <= 524288"};
if(vErrors === null){
vErrors = [err21];
}
else {
vErrors.push(err21);
}
errors++;
}
if(data5 < 1 || isNaN(data5)){
const err22 = {instancePath:instancePath+"/byte_size",schemaPath:"#/properties/byte_size/minimum",keyword:"minimum",params:{comparison: ">=", limit: 1},message:"must be >= 1"};
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
}
else {
const err23 = {instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err23];
}
else {
vErrors.push(err23);
}
errors++;
}
validate29.errors = vErrors;
return errors === 0;
}


function validate10(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
/*# sourceURL="https://himalayan-disaster-atlas.invalid/schemas/live-index.schema.json" */;
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
if(data.is_fixture === undefined){
const err2 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "is_fixture"},message:"must have required property '"+"is_fixture"+"'"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
if(data.generated_at === undefined){
const err3 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "generated_at"},message:"must have required property '"+"generated_at"+"'"};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
if(data.workflow === undefined){
const err4 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "workflow"},message:"must have required property '"+"workflow"+"'"};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
if(data.feeds === undefined){
const err5 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "feeds"},message:"must have required property '"+"feeds"+"'"};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
for(const key0 in data){
if(!((((((key0 === "schema_version") || (key0 === "kind")) || (key0 === "is_fixture")) || (key0 === "generated_at")) || (key0 === "workflow")) || (key0 === "feeds"))){
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
if(data.schema_version !== undefined){
if("1.0.0" !== data.schema_version){
const err7 = {instancePath:instancePath+"/schema_version",schemaPath:"#/properties/schema_version/const",keyword:"const",params:{allowedValue: "1.0.0"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
}
}
if(data.kind !== undefined){
if("live-index" !== data.kind){
const err8 = {instancePath:instancePath+"/kind",schemaPath:"#/properties/kind/const",keyword:"const",params:{allowedValue: "live-index"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err8];
}
else {
vErrors.push(err8);
}
errors++;
}
}
if(data.is_fixture !== undefined){
if(typeof data.is_fixture !== "boolean"){
const err9 = {instancePath:instancePath+"/is_fixture",schemaPath:"#/properties/is_fixture/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"};
if(vErrors === null){
vErrors = [err9];
}
else {
vErrors.push(err9);
}
errors++;
}
}
if(data.generated_at !== undefined){
let data3 = data.generated_at;
if(typeof data3 === "string"){
if(!pattern6.test(data3)){
const err10 = {instancePath:instancePath+"/generated_at",schemaPath:"live-snapshot.schema.json#/definitions/time/pattern",keyword:"pattern",params:{pattern: "^(?!0000)\\d{4}-\\d{2}-\\d{2}T(?:[01]\\d|2[0-3]):[0-5]\\d:[0-5]\\d(?:\\.\\d{1,3})?Z$"},message:"must match pattern \""+"^(?!0000)\\d{4}-\\d{2}-\\d{2}T(?:[01]\\d|2[0-3]):[0-5]\\d:[0-5]\\d(?:\\.\\d{1,3})?Z$"+"\""};
if(vErrors === null){
vErrors = [err10];
}
else {
vErrors.push(err10);
}
errors++;
}
if(!(formats4.validate(data3))){
const err11 = {instancePath:instancePath+"/generated_at",schemaPath:"live-snapshot.schema.json#/definitions/time/format",keyword:"format",params:{format: "date-time"},message:"must match format \""+"date-time"+"\""};
if(vErrors === null){
vErrors = [err11];
}
else {
vErrors.push(err11);
}
errors++;
}
}
else {
const err12 = {instancePath:instancePath+"/generated_at",schemaPath:"live-snapshot.schema.json#/definitions/time/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err12];
}
else {
vErrors.push(err12);
}
errors++;
}
}
if(data.workflow !== undefined){
let data4 = data.workflow;
if(data4 && typeof data4 == "object" && !Array.isArray(data4)){
if(data4.status === undefined){
const err13 = {instancePath:instancePath+"/workflow",schemaPath:"#/properties/workflow/required",keyword:"required",params:{missingProperty: "status"},message:"must have required property '"+"status"+"'"};
if(vErrors === null){
vErrors = [err13];
}
else {
vErrors.push(err13);
}
errors++;
}
if(data4.last_attempt_at === undefined){
const err14 = {instancePath:instancePath+"/workflow",schemaPath:"#/properties/workflow/required",keyword:"required",params:{missingProperty: "last_attempt_at"},message:"must have required property '"+"last_attempt_at"+"'"};
if(vErrors === null){
vErrors = [err14];
}
else {
vErrors.push(err14);
}
errors++;
}
if(data4.last_successful_fetch_at === undefined){
const err15 = {instancePath:instancePath+"/workflow",schemaPath:"#/properties/workflow/required",keyword:"required",params:{missingProperty: "last_successful_fetch_at"},message:"must have required property '"+"last_successful_fetch_at"+"'"};
if(vErrors === null){
vErrors = [err15];
}
else {
vErrors.push(err15);
}
errors++;
}
if(data4.run_url === undefined){
const err16 = {instancePath:instancePath+"/workflow",schemaPath:"#/properties/workflow/required",keyword:"required",params:{missingProperty: "run_url"},message:"must have required property '"+"run_url"+"'"};
if(vErrors === null){
vErrors = [err16];
}
else {
vErrors.push(err16);
}
errors++;
}
if(data4.schedule_seconds === undefined){
const err17 = {instancePath:instancePath+"/workflow",schemaPath:"#/properties/workflow/required",keyword:"required",params:{missingProperty: "schedule_seconds"},message:"must have required property '"+"schedule_seconds"+"'"};
if(vErrors === null){
vErrors = [err17];
}
else {
vErrors.push(err17);
}
errors++;
}
if(data4.stale_after_seconds === undefined){
const err18 = {instancePath:instancePath+"/workflow",schemaPath:"#/properties/workflow/required",keyword:"required",params:{missingProperty: "stale_after_seconds"},message:"must have required property '"+"stale_after_seconds"+"'"};
if(vErrors === null){
vErrors = [err18];
}
else {
vErrors.push(err18);
}
errors++;
}
for(const key1 in data4){
if(!((((((key1 === "status") || (key1 === "last_attempt_at")) || (key1 === "last_successful_fetch_at")) || (key1 === "run_url")) || (key1 === "schedule_seconds")) || (key1 === "stale_after_seconds"))){
const err19 = {instancePath:instancePath+"/workflow",schemaPath:"#/properties/workflow/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key1},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err19];
}
else {
vErrors.push(err19);
}
errors++;
}
}
if(data4.status !== undefined){
let data5 = data4.status;
if(!((((data5 === "success") || (data5 === "partial")) || (data5 === "failed")) || (data5 === "not_configured"))){
const err20 = {instancePath:instancePath+"/workflow/status",schemaPath:"#/properties/workflow/properties/status/enum",keyword:"enum",params:{allowedValues: schema11.properties.workflow.properties.status.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err20];
}
else {
vErrors.push(err20);
}
errors++;
}
}
if(data4.last_attempt_at !== undefined){
if(!(validate24(data4.last_attempt_at, {instancePath:instancePath+"/workflow/last_attempt_at",parentData:data4,parentDataProperty:"last_attempt_at",rootData}))){
vErrors = vErrors === null ? validate24.errors : vErrors.concat(validate24.errors);
errors = vErrors.length;
}
}
if(data4.last_successful_fetch_at !== undefined){
if(!(validate24(data4.last_successful_fetch_at, {instancePath:instancePath+"/workflow/last_successful_fetch_at",parentData:data4,parentDataProperty:"last_successful_fetch_at",rootData}))){
vErrors = vErrors === null ? validate24.errors : vErrors.concat(validate24.errors);
errors = vErrors.length;
}
}
if(data4.run_url !== undefined){
let data8 = data4.run_url;
const _errs16 = errors;
let valid3 = false;
const _errs17 = errors;
if(data8 !== null){
const err21 = {instancePath:instancePath+"/workflow/run_url",schemaPath:"#/properties/workflow/properties/run_url/anyOf/0/type",keyword:"type",params:{type: "null"},message:"must be null"};
if(vErrors === null){
vErrors = [err21];
}
else {
vErrors.push(err21);
}
errors++;
}
var _valid0 = _errs17 === errors;
valid3 = valid3 || _valid0;
if(!valid3){
const _errs19 = errors;
if(typeof data8 === "string"){
if(!pattern11.test(data8)){
const err22 = {instancePath:instancePath+"/workflow/run_url",schemaPath:"#/properties/workflow/properties/run_url/anyOf/1/pattern",keyword:"pattern",params:{pattern: "^https://github\\.com/prasidupadhya/Himalayan-Disaster-Atlas/actions/runs/[0-9]+$"},message:"must match pattern \""+"^https://github\\.com/prasidupadhya/Himalayan-Disaster-Atlas/actions/runs/[0-9]+$"+"\""};
if(vErrors === null){
vErrors = [err22];
}
else {
vErrors.push(err22);
}
errors++;
}
}
else {
const err23 = {instancePath:instancePath+"/workflow/run_url",schemaPath:"#/properties/workflow/properties/run_url/anyOf/1/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err23];
}
else {
vErrors.push(err23);
}
errors++;
}
var _valid0 = _errs19 === errors;
valid3 = valid3 || _valid0;
}
if(!valid3){
const err24 = {instancePath:instancePath+"/workflow/run_url",schemaPath:"#/properties/workflow/properties/run_url/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err24];
}
else {
vErrors.push(err24);
}
errors++;
}
else {
errors = _errs16;
if(vErrors !== null){
if(_errs16){
vErrors.length = _errs16;
}
else {
vErrors = null;
}
}
}
}
if(data4.schedule_seconds !== undefined){
if(10800 !== data4.schedule_seconds){
const err25 = {instancePath:instancePath+"/workflow/schedule_seconds",schemaPath:"#/properties/workflow/properties/schedule_seconds/const",keyword:"const",params:{allowedValue: 10800},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err25];
}
else {
vErrors.push(err25);
}
errors++;
}
}
if(data4.stale_after_seconds !== undefined){
let data10 = data4.stale_after_seconds;
if(!(((typeof data10 == "number") && (!(data10 % 1) && !isNaN(data10))) && (isFinite(data10)))){
const err26 = {instancePath:instancePath+"/workflow/stale_after_seconds",schemaPath:"#/properties/workflow/properties/stale_after_seconds/type",keyword:"type",params:{type: "integer"},message:"must be integer"};
if(vErrors === null){
vErrors = [err26];
}
else {
vErrors.push(err26);
}
errors++;
}
if((typeof data10 == "number") && (isFinite(data10))){
if(data10 > 86400 || isNaN(data10)){
const err27 = {instancePath:instancePath+"/workflow/stale_after_seconds",schemaPath:"#/properties/workflow/properties/stale_after_seconds/maximum",keyword:"maximum",params:{comparison: "<=", limit: 86400},message:"must be <= 86400"};
if(vErrors === null){
vErrors = [err27];
}
else {
vErrors.push(err27);
}
errors++;
}
if(data10 < 10800 || isNaN(data10)){
const err28 = {instancePath:instancePath+"/workflow/stale_after_seconds",schemaPath:"#/properties/workflow/properties/stale_after_seconds/minimum",keyword:"minimum",params:{comparison: ">=", limit: 10800},message:"must be >= 10800"};
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
}
else {
const err29 = {instancePath:instancePath+"/workflow",schemaPath:"#/properties/workflow/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err29];
}
else {
vErrors.push(err29);
}
errors++;
}
}
if(data.feeds !== undefined){
let data11 = data.feeds;
if(Array.isArray(data11)){
if(data11.length > 8){
const err30 = {instancePath:instancePath+"/feeds",schemaPath:"#/properties/feeds/maxItems",keyword:"maxItems",params:{limit: 8},message:"must NOT have more than 8 items"};
if(vErrors === null){
vErrors = [err30];
}
else {
vErrors.push(err30);
}
errors++;
}
const len0 = data11.length;
for(let i0=0; i0<len0; i0++){
let data12 = data11[i0];
if(data12 && typeof data12 == "object" && !Array.isArray(data12)){
if(data12.feed_id === undefined){
const err31 = {instancePath:instancePath+"/feeds/" + i0,schemaPath:"#/properties/feeds/items/required",keyword:"required",params:{missingProperty: "feed_id"},message:"must have required property '"+"feed_id"+"'"};
if(vErrors === null){
vErrors = [err31];
}
else {
vErrors.push(err31);
}
errors++;
}
if(data12.enabled === undefined){
const err32 = {instancePath:instancePath+"/feeds/" + i0,schemaPath:"#/properties/feeds/items/required",keyword:"required",params:{missingProperty: "enabled"},message:"must have required property '"+"enabled"+"'"};
if(vErrors === null){
vErrors = [err32];
}
else {
vErrors.push(err32);
}
errors++;
}
if(data12.attempt_status === undefined){
const err33 = {instancePath:instancePath+"/feeds/" + i0,schemaPath:"#/properties/feeds/items/required",keyword:"required",params:{missingProperty: "attempt_status"},message:"must have required property '"+"attempt_status"+"'"};
if(vErrors === null){
vErrors = [err33];
}
else {
vErrors.push(err33);
}
errors++;
}
if(data12.last_attempt_at === undefined){
const err34 = {instancePath:instancePath+"/feeds/" + i0,schemaPath:"#/properties/feeds/items/required",keyword:"required",params:{missingProperty: "last_attempt_at"},message:"must have required property '"+"last_attempt_at"+"'"};
if(vErrors === null){
vErrors = [err34];
}
else {
vErrors.push(err34);
}
errors++;
}
if(data12.last_successful_fetch_at === undefined){
const err35 = {instancePath:instancePath+"/feeds/" + i0,schemaPath:"#/properties/feeds/items/required",keyword:"required",params:{missingProperty: "last_successful_fetch_at"},message:"must have required property '"+"last_successful_fetch_at"+"'"};
if(vErrors === null){
vErrors = [err35];
}
else {
vErrors.push(err35);
}
errors++;
}
if(data12.error_code === undefined){
const err36 = {instancePath:instancePath+"/feeds/" + i0,schemaPath:"#/properties/feeds/items/required",keyword:"required",params:{missingProperty: "error_code"},message:"must have required property '"+"error_code"+"'"};
if(vErrors === null){
vErrors = [err36];
}
else {
vErrors.push(err36);
}
errors++;
}
if(data12.snapshot === undefined){
const err37 = {instancePath:instancePath+"/feeds/" + i0,schemaPath:"#/properties/feeds/items/required",keyword:"required",params:{missingProperty: "snapshot"},message:"must have required property '"+"snapshot"+"'"};
if(vErrors === null){
vErrors = [err37];
}
else {
vErrors.push(err37);
}
errors++;
}
for(const key2 in data12){
if(!(((((((key2 === "feed_id") || (key2 === "enabled")) || (key2 === "attempt_status")) || (key2 === "last_attempt_at")) || (key2 === "last_successful_fetch_at")) || (key2 === "error_code")) || (key2 === "snapshot"))){
const err38 = {instancePath:instancePath+"/feeds/" + i0,schemaPath:"#/properties/feeds/items/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key2},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err38];
}
else {
vErrors.push(err38);
}
errors++;
}
}
if(data12.feed_id !== undefined){
let data13 = data12.feed_id;
if(!((((((((data13 === "usgs") || (data13 === "noaa-gfs")) || (data13 === "dhm")) || (data13 === "bipad")) || (data13 === "openaq")) || (data13 === "open-meteo")) || (data13 === "imerg")) || (data13 === "contract-fixture"))){
const err39 = {instancePath:instancePath+"/feeds/" + i0+"/feed_id",schemaPath:"live-snapshot.schema.json#/definitions/feed/enum",keyword:"enum",params:{allowedValues: schema16.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err39];
}
else {
vErrors.push(err39);
}
errors++;
}
}
if(data12.enabled !== undefined){
if(typeof data12.enabled !== "boolean"){
const err40 = {instancePath:instancePath+"/feeds/" + i0+"/enabled",schemaPath:"#/properties/feeds/items/properties/enabled/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"};
if(vErrors === null){
vErrors = [err40];
}
else {
vErrors.push(err40);
}
errors++;
}
}
if(data12.attempt_status !== undefined){
let data15 = data12.attempt_status;
if(!(((data15 === "success") || (data15 === "failed")) || (data15 === "not_configured"))){
const err41 = {instancePath:instancePath+"/feeds/" + i0+"/attempt_status",schemaPath:"#/properties/feeds/items/properties/attempt_status/enum",keyword:"enum",params:{allowedValues: schema11.properties.feeds.items.properties.attempt_status.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err41];
}
else {
vErrors.push(err41);
}
errors++;
}
}
if(data12.last_attempt_at !== undefined){
if(!(validate24(data12.last_attempt_at, {instancePath:instancePath+"/feeds/" + i0+"/last_attempt_at",parentData:data12,parentDataProperty:"last_attempt_at",rootData}))){
vErrors = vErrors === null ? validate24.errors : vErrors.concat(validate24.errors);
errors = vErrors.length;
}
}
if(data12.last_successful_fetch_at !== undefined){
if(!(validate24(data12.last_successful_fetch_at, {instancePath:instancePath+"/feeds/" + i0+"/last_successful_fetch_at",parentData:data12,parentDataProperty:"last_successful_fetch_at",rootData}))){
vErrors = vErrors === null ? validate24.errors : vErrors.concat(validate24.errors);
errors = vErrors.length;
}
}
if(data12.error_code !== undefined){
let data18 = data12.error_code;
if(!(((((((data18 === null) || (data18 === "http_error")) || (data18 === "network_error")) || (data18 === "timeout")) || (data18 === "invalid_data")) || (data18 === "license_unresolved")) || (data18 === "disabled"))){
const err42 = {instancePath:instancePath+"/feeds/" + i0+"/error_code",schemaPath:"#/properties/feeds/items/properties/error_code/enum",keyword:"enum",params:{allowedValues: schema11.properties.feeds.items.properties.error_code.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err42];
}
else {
vErrors.push(err42);
}
errors++;
}
}
if(data12.snapshot !== undefined){
let data19 = data12.snapshot;
const _errs38 = errors;
let valid8 = false;
const _errs39 = errors;
if(data19 !== null){
const err43 = {instancePath:instancePath+"/feeds/" + i0+"/snapshot",schemaPath:"#/properties/feeds/items/properties/snapshot/anyOf/0/type",keyword:"type",params:{type: "null"},message:"must be null"};
if(vErrors === null){
vErrors = [err43];
}
else {
vErrors.push(err43);
}
errors++;
}
var _valid1 = _errs39 === errors;
valid8 = valid8 || _valid1;
if(!valid8){
const _errs41 = errors;
if(!(validate29(data19, {instancePath:instancePath+"/feeds/" + i0+"/snapshot",parentData:data12,parentDataProperty:"snapshot",rootData}))){
vErrors = vErrors === null ? validate29.errors : vErrors.concat(validate29.errors);
errors = vErrors.length;
}
var _valid1 = _errs41 === errors;
valid8 = valid8 || _valid1;
}
if(!valid8){
const err44 = {instancePath:instancePath+"/feeds/" + i0+"/snapshot",schemaPath:"#/properties/feeds/items/properties/snapshot/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err44];
}
else {
vErrors.push(err44);
}
errors++;
}
else {
errors = _errs38;
if(vErrors !== null){
if(_errs38){
vErrors.length = _errs38;
}
else {
vErrors = null;
}
}
}
}
}
else {
const err45 = {instancePath:instancePath+"/feeds/" + i0,schemaPath:"#/properties/feeds/items/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err45];
}
else {
vErrors.push(err45);
}
errors++;
}
}
}
else {
const err46 = {instancePath:instancePath+"/feeds",schemaPath:"#/properties/feeds/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err46];
}
else {
vErrors.push(err46);
}
errors++;
}
}
}
else {
const err47 = {instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err47];
}
else {
vErrors.push(err47);
}
errors++;
}
validate10.errors = vErrors;
return errors === 0;
}

