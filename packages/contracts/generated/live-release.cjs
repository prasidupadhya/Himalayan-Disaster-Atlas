// Generated from live-release.schema.json; run npm run contracts:generate. Do not edit.
"use strict";
module.exports = validate10;
module.exports.default = validate10;
const schema11 = {"$schema":"http://json-schema.org/draft-07/schema#","$id":"https://himalayan-disaster-atlas.invalid/schemas/live-release.schema.json","type":"object","additionalProperties":false,"required":["schema_version","kind","snapshot","processing_version","source_request_url","source_terms_policy_sha256","licence_review"],"properties":{"schema_version":{"const":"1.0.0"},"kind":{"const":"live-source-release"},"snapshot":{"$ref":"live-index.schema.json#/definitions/reference"},"processing_version":{"const":"live-open-feeds/1.0.0"},"source_request_url":{"$ref":"live-snapshot.schema.json#/definitions/https"},"source_terms_policy_sha256":{"$ref":"live-snapshot.schema.json#/definitions/hash"},"licence_review":{"type":"object","additionalProperties":false,"required":["status","reviewed_on","evidence_urls","obligations"],"properties":{"status":{"const":"PERMITTED"},"reviewed_on":{"type":"string","format":"date"},"evidence_urls":{"type":"array","minItems":1,"maxItems":8,"items":{"$ref":"live-snapshot.schema.json#/definitions/https"}},"obligations":{"$ref":"live-snapshot.schema.json#/definitions/text"}}}}};
const schema19 = {"type":"string","format":"uri","pattern":"^https://","maxLength":1000};
const schema20 = {"type":"string","pattern":"^[a-f0-9]{64}$"};
const schema18 = {"type":"string","minLength":1,"maxLength":500};
const schema38 = {"type":"object","additionalProperties":false,"required":["dataset_id","version","id","path","sha256","byte_size"],"properties":{"dataset_id":{"$ref":"live-snapshot.schema.json#/definitions/id"},"version":{"$ref":"live-snapshot.schema.json#/definitions/version"},"id":{"$ref":"live-snapshot.schema.json#/definitions/id"},"path":{"type":"string","pattern":"^/data/[a-z0-9-]+/[0-9]+\\.[0-9]+\\.[0-9]+/[a-z0-9-]+\\.json$"},"sha256":{"$ref":"live-snapshot.schema.json#/definitions/hash"},"byte_size":{"type":"integer","minimum":1,"maximum":524288}}};
const schema14 = {"type":"string","pattern":"^[a-z0-9]+(?:-[a-z0-9]+)*$","maxLength":100};
const schema15 = {"type":"string","pattern":"^\\d+\\.\\d+\\.\\d+$","maxLength":40};
const func3 = require("ajv/dist/runtime/ucs2length").default;
const pattern0 = new RegExp("^[a-z0-9]+(?:-[a-z0-9]+)*$", "u");
const pattern1 = new RegExp("^\\d+\\.\\d+\\.\\d+$", "u");
const pattern15 = new RegExp("^/data/[a-z0-9-]+/[0-9]+\\.[0-9]+\\.[0-9]+/[a-z0-9-]+\\.json$", "u");
const pattern4 = new RegExp("^[a-f0-9]{64}$", "u");

function validate32(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
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
validate32.errors = vErrors;
return errors === 0;
}

const formats0 = require("ajv-formats/dist/formats").fullFormats.uri;
const formats16 = require("ajv-formats/dist/formats").fullFormats.date;
const pattern3 = new RegExp("^https://", "u");

function validate10(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
/*# sourceURL="https://himalayan-disaster-atlas.invalid/schemas/live-release.schema.json" */;
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
if(data.snapshot === undefined){
const err2 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "snapshot"},message:"must have required property '"+"snapshot"+"'"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
if(data.processing_version === undefined){
const err3 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "processing_version"},message:"must have required property '"+"processing_version"+"'"};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
if(data.source_request_url === undefined){
const err4 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "source_request_url"},message:"must have required property '"+"source_request_url"+"'"};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
if(data.source_terms_policy_sha256 === undefined){
const err5 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "source_terms_policy_sha256"},message:"must have required property '"+"source_terms_policy_sha256"+"'"};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
if(data.licence_review === undefined){
const err6 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "licence_review"},message:"must have required property '"+"licence_review"+"'"};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
for(const key0 in data){
if(!(((((((key0 === "schema_version") || (key0 === "kind")) || (key0 === "snapshot")) || (key0 === "processing_version")) || (key0 === "source_request_url")) || (key0 === "source_terms_policy_sha256")) || (key0 === "licence_review"))){
const err7 = {instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
}
}
if(data.schema_version !== undefined){
if("1.0.0" !== data.schema_version){
const err8 = {instancePath:instancePath+"/schema_version",schemaPath:"#/properties/schema_version/const",keyword:"const",params:{allowedValue: "1.0.0"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err8];
}
else {
vErrors.push(err8);
}
errors++;
}
}
if(data.kind !== undefined){
if("live-source-release" !== data.kind){
const err9 = {instancePath:instancePath+"/kind",schemaPath:"#/properties/kind/const",keyword:"const",params:{allowedValue: "live-source-release"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err9];
}
else {
vErrors.push(err9);
}
errors++;
}
}
if(data.snapshot !== undefined){
if(!(validate32(data.snapshot, {instancePath:instancePath+"/snapshot",parentData:data,parentDataProperty:"snapshot",rootData}))){
vErrors = vErrors === null ? validate32.errors : vErrors.concat(validate32.errors);
errors = vErrors.length;
}
}
if(data.processing_version !== undefined){
if("live-open-feeds/1.0.0" !== data.processing_version){
const err10 = {instancePath:instancePath+"/processing_version",schemaPath:"#/properties/processing_version/const",keyword:"const",params:{allowedValue: "live-open-feeds/1.0.0"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err10];
}
else {
vErrors.push(err10);
}
errors++;
}
}
if(data.source_request_url !== undefined){
let data4 = data.source_request_url;
if(typeof data4 === "string"){
if(func3(data4) > 1000){
const err11 = {instancePath:instancePath+"/source_request_url",schemaPath:"live-snapshot.schema.json#/definitions/https/maxLength",keyword:"maxLength",params:{limit: 1000},message:"must NOT have more than 1000 characters"};
if(vErrors === null){
vErrors = [err11];
}
else {
vErrors.push(err11);
}
errors++;
}
if(!pattern3.test(data4)){
const err12 = {instancePath:instancePath+"/source_request_url",schemaPath:"live-snapshot.schema.json#/definitions/https/pattern",keyword:"pattern",params:{pattern: "^https://"},message:"must match pattern \""+"^https://"+"\""};
if(vErrors === null){
vErrors = [err12];
}
else {
vErrors.push(err12);
}
errors++;
}
if(!(formats0(data4))){
const err13 = {instancePath:instancePath+"/source_request_url",schemaPath:"live-snapshot.schema.json#/definitions/https/format",keyword:"format",params:{format: "uri"},message:"must match format \""+"uri"+"\""};
if(vErrors === null){
vErrors = [err13];
}
else {
vErrors.push(err13);
}
errors++;
}
}
else {
const err14 = {instancePath:instancePath+"/source_request_url",schemaPath:"live-snapshot.schema.json#/definitions/https/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err14];
}
else {
vErrors.push(err14);
}
errors++;
}
}
if(data.source_terms_policy_sha256 !== undefined){
let data5 = data.source_terms_policy_sha256;
if(typeof data5 === "string"){
if(!pattern4.test(data5)){
const err15 = {instancePath:instancePath+"/source_terms_policy_sha256",schemaPath:"live-snapshot.schema.json#/definitions/hash/pattern",keyword:"pattern",params:{pattern: "^[a-f0-9]{64}$"},message:"must match pattern \""+"^[a-f0-9]{64}$"+"\""};
if(vErrors === null){
vErrors = [err15];
}
else {
vErrors.push(err15);
}
errors++;
}
}
else {
const err16 = {instancePath:instancePath+"/source_terms_policy_sha256",schemaPath:"live-snapshot.schema.json#/definitions/hash/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err16];
}
else {
vErrors.push(err16);
}
errors++;
}
}
if(data.licence_review !== undefined){
let data6 = data.licence_review;
if(data6 && typeof data6 == "object" && !Array.isArray(data6)){
if(data6.status === undefined){
const err17 = {instancePath:instancePath+"/licence_review",schemaPath:"#/properties/licence_review/required",keyword:"required",params:{missingProperty: "status"},message:"must have required property '"+"status"+"'"};
if(vErrors === null){
vErrors = [err17];
}
else {
vErrors.push(err17);
}
errors++;
}
if(data6.reviewed_on === undefined){
const err18 = {instancePath:instancePath+"/licence_review",schemaPath:"#/properties/licence_review/required",keyword:"required",params:{missingProperty: "reviewed_on"},message:"must have required property '"+"reviewed_on"+"'"};
if(vErrors === null){
vErrors = [err18];
}
else {
vErrors.push(err18);
}
errors++;
}
if(data6.evidence_urls === undefined){
const err19 = {instancePath:instancePath+"/licence_review",schemaPath:"#/properties/licence_review/required",keyword:"required",params:{missingProperty: "evidence_urls"},message:"must have required property '"+"evidence_urls"+"'"};
if(vErrors === null){
vErrors = [err19];
}
else {
vErrors.push(err19);
}
errors++;
}
if(data6.obligations === undefined){
const err20 = {instancePath:instancePath+"/licence_review",schemaPath:"#/properties/licence_review/required",keyword:"required",params:{missingProperty: "obligations"},message:"must have required property '"+"obligations"+"'"};
if(vErrors === null){
vErrors = [err20];
}
else {
vErrors.push(err20);
}
errors++;
}
for(const key1 in data6){
if(!((((key1 === "status") || (key1 === "reviewed_on")) || (key1 === "evidence_urls")) || (key1 === "obligations"))){
const err21 = {instancePath:instancePath+"/licence_review",schemaPath:"#/properties/licence_review/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key1},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err21];
}
else {
vErrors.push(err21);
}
errors++;
}
}
if(data6.status !== undefined){
if("PERMITTED" !== data6.status){
const err22 = {instancePath:instancePath+"/licence_review/status",schemaPath:"#/properties/licence_review/properties/status/const",keyword:"const",params:{allowedValue: "PERMITTED"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err22];
}
else {
vErrors.push(err22);
}
errors++;
}
}
if(data6.reviewed_on !== undefined){
let data8 = data6.reviewed_on;
if(typeof data8 === "string"){
if(!(formats16.validate(data8))){
const err23 = {instancePath:instancePath+"/licence_review/reviewed_on",schemaPath:"#/properties/licence_review/properties/reviewed_on/format",keyword:"format",params:{format: "date"},message:"must match format \""+"date"+"\""};
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
const err24 = {instancePath:instancePath+"/licence_review/reviewed_on",schemaPath:"#/properties/licence_review/properties/reviewed_on/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err24];
}
else {
vErrors.push(err24);
}
errors++;
}
}
if(data6.evidence_urls !== undefined){
let data9 = data6.evidence_urls;
if(Array.isArray(data9)){
if(data9.length > 8){
const err25 = {instancePath:instancePath+"/licence_review/evidence_urls",schemaPath:"#/properties/licence_review/properties/evidence_urls/maxItems",keyword:"maxItems",params:{limit: 8},message:"must NOT have more than 8 items"};
if(vErrors === null){
vErrors = [err25];
}
else {
vErrors.push(err25);
}
errors++;
}
if(data9.length < 1){
const err26 = {instancePath:instancePath+"/licence_review/evidence_urls",schemaPath:"#/properties/licence_review/properties/evidence_urls/minItems",keyword:"minItems",params:{limit: 1},message:"must NOT have fewer than 1 items"};
if(vErrors === null){
vErrors = [err26];
}
else {
vErrors.push(err26);
}
errors++;
}
const len0 = data9.length;
for(let i0=0; i0<len0; i0++){
let data10 = data9[i0];
if(typeof data10 === "string"){
if(func3(data10) > 1000){
const err27 = {instancePath:instancePath+"/licence_review/evidence_urls/" + i0,schemaPath:"live-snapshot.schema.json#/definitions/https/maxLength",keyword:"maxLength",params:{limit: 1000},message:"must NOT have more than 1000 characters"};
if(vErrors === null){
vErrors = [err27];
}
else {
vErrors.push(err27);
}
errors++;
}
if(!pattern3.test(data10)){
const err28 = {instancePath:instancePath+"/licence_review/evidence_urls/" + i0,schemaPath:"live-snapshot.schema.json#/definitions/https/pattern",keyword:"pattern",params:{pattern: "^https://"},message:"must match pattern \""+"^https://"+"\""};
if(vErrors === null){
vErrors = [err28];
}
else {
vErrors.push(err28);
}
errors++;
}
if(!(formats0(data10))){
const err29 = {instancePath:instancePath+"/licence_review/evidence_urls/" + i0,schemaPath:"live-snapshot.schema.json#/definitions/https/format",keyword:"format",params:{format: "uri"},message:"must match format \""+"uri"+"\""};
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
const err30 = {instancePath:instancePath+"/licence_review/evidence_urls/" + i0,schemaPath:"live-snapshot.schema.json#/definitions/https/type",keyword:"type",params:{type: "string"},message:"must be string"};
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
else {
const err31 = {instancePath:instancePath+"/licence_review/evidence_urls",schemaPath:"#/properties/licence_review/properties/evidence_urls/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err31];
}
else {
vErrors.push(err31);
}
errors++;
}
}
if(data6.obligations !== undefined){
let data11 = data6.obligations;
if(typeof data11 === "string"){
if(func3(data11) > 500){
const err32 = {instancePath:instancePath+"/licence_review/obligations",schemaPath:"live-snapshot.schema.json#/definitions/text/maxLength",keyword:"maxLength",params:{limit: 500},message:"must NOT have more than 500 characters"};
if(vErrors === null){
vErrors = [err32];
}
else {
vErrors.push(err32);
}
errors++;
}
if(func3(data11) < 1){
const err33 = {instancePath:instancePath+"/licence_review/obligations",schemaPath:"live-snapshot.schema.json#/definitions/text/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
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
const err34 = {instancePath:instancePath+"/licence_review/obligations",schemaPath:"live-snapshot.schema.json#/definitions/text/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err34];
}
else {
vErrors.push(err34);
}
errors++;
}
}
}
else {
const err35 = {instancePath:instancePath+"/licence_review",schemaPath:"#/properties/licence_review/type",keyword:"type",params:{type: "object"},message:"must be object"};
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
else {
const err36 = {instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err36];
}
else {
vErrors.push(err36);
}
errors++;
}
validate10.errors = vErrors;
return errors === 0;
}

