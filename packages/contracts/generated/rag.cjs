// Generated from rag.schema.json; run npm run contracts:generate. Do not edit.
"use strict";
module.exports = validate10;
module.exports.default = validate10;
const schema11 = {"$schema":"http://json-schema.org/draft-07/schema#","type":"object","additionalProperties":false,"required":["schema_version","kind","version","documents","chunks"],"properties":{"schema_version":{"const":"1.0.0"},"kind":{"const":"evidence-corpus"},"version":{"type":"string","pattern":"^\\d+\\.\\d+\\.\\d+$"},"documents":{"type":"array","items":{"type":"object","additionalProperties":false,"required":["id","title","source_id","version","publication_date","version_date","accessed_at","license","geographies","topics","inputs","superseded_by","stale_after","snapshot_path","text"],"properties":{"id":{"type":"string","pattern":"^[a-z0-9-]+$"},"title":{"type":"string","minLength":1,"maxLength":300},"source_id":{"type":"string","minLength":1,"maxLength":100},"version":{"type":"string","pattern":"^[a-f0-9]{64}$"},"publication_date":{"anyOf":[{"type":"string","format":"date-time"},{"type":"null"}]},"version_date":{"anyOf":[{"type":"string","format":"date-time"},{"type":"null"}]},"accessed_at":{"type":"string","format":"date-time"},"license":{"anyOf":[{"type":"string","minLength":1,"maxLength":2000},{"type":"null"}]},"geographies":{"type":"array","items":{"type":"string","minLength":1,"maxLength":100},"maxItems":20},"topics":{"type":"array","items":{"type":"string","minLength":1,"maxLength":100},"maxItems":20},"inputs":{"type":"array","items":{"type":"object","additionalProperties":false,"required":["dataset_id","dataset_version","manifest_path","sha256","stale_after"],"properties":{"dataset_id":{"type":"string","minLength":1,"maxLength":100},"dataset_version":{"type":"string","minLength":1,"maxLength":40},"manifest_path":{"type":"string","pattern":"^/data/[a-z0-9-]+/[0-9]+\\.[0-9]+\\.[0-9]+/manifest\\.json$"},"sha256":{"type":"string","pattern":"^[a-f0-9]{64}$"},"stale_after":{"anyOf":[{"type":"string","format":"date-time"},{"type":"null"}]}}},"maxItems":30},"superseded_by":{"anyOf":[{"type":"string","minLength":1,"maxLength":100},{"type":"null"}]},"stale_after":{"anyOf":[{"type":"string","format":"date-time"},{"type":"null"}]},"snapshot_path":{"type":"string","pattern":"^/data/atlas-evidence/[0-9]+\\.[0-9]+\\.[0-9]+/documents/[a-z0-9-]+\\.txt$"},"text":{"type":"string","minLength":1,"maxLength":100000}}},"maxItems":128},"chunks":{"type":"array","items":{"type":"object","additionalProperties":false,"required":["id","document_id","section","start_line","end_line","text","assertions"],"properties":{"id":{"type":"string","minLength":1,"maxLength":160},"document_id":{"type":"string","minLength":1,"maxLength":100},"section":{"type":"string","minLength":1,"maxLength":500},"start_line":{"type":"integer","minimum":1},"end_line":{"type":"integer","minimum":1},"text":{"type":"string","minLength":1,"maxLength":4000},"assertions":{"type":"array","items":{"type":"object","additionalProperties":false,"required":["subject","predicate","scope","value"],"properties":{"subject":{"type":"string","minLength":1,"maxLength":100},"predicate":{"type":"string","minLength":1,"maxLength":100},"scope":{"type":"string","minLength":1,"maxLength":200},"value":{"type":"string","minLength":1,"maxLength":500}}},"maxItems":20}}},"maxItems":2048}}};
const pattern0 = new RegExp("^\\d+\\.\\d+\\.\\d+$", "u");
const pattern1 = new RegExp("^[a-z0-9-]+$", "u");
const pattern2 = new RegExp("^[a-f0-9]{64}$", "u");
const pattern3 = new RegExp("^/data/[a-z0-9-]+/[0-9]+\\.[0-9]+\\.[0-9]+/manifest\\.json$", "u");
const pattern5 = new RegExp("^/data/atlas-evidence/[0-9]+\\.[0-9]+\\.[0-9]+/documents/[a-z0-9-]+\\.txt$", "u");
const func2 = Object.prototype.hasOwnProperty;
const func3 = require("ajv/dist/runtime/ucs2length").default;
const formats0 = require("ajv-formats/dist/formats").fullFormats["date-time"];

function validate10(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
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
if(data.version === undefined){
const err2 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "version"},message:"must have required property '"+"version"+"'"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
if(data.documents === undefined){
const err3 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "documents"},message:"must have required property '"+"documents"+"'"};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
if(data.chunks === undefined){
const err4 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "chunks"},message:"must have required property '"+"chunks"+"'"};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
for(const key0 in data){
if(!(((((key0 === "schema_version") || (key0 === "kind")) || (key0 === "version")) || (key0 === "documents")) || (key0 === "chunks"))){
const err5 = {instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
}
if(data.schema_version !== undefined){
if("1.0.0" !== data.schema_version){
const err6 = {instancePath:instancePath+"/schema_version",schemaPath:"#/properties/schema_version/const",keyword:"const",params:{allowedValue: "1.0.0"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
}
if(data.kind !== undefined){
if("evidence-corpus" !== data.kind){
const err7 = {instancePath:instancePath+"/kind",schemaPath:"#/properties/kind/const",keyword:"const",params:{allowedValue: "evidence-corpus"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
}
}
if(data.version !== undefined){
let data2 = data.version;
if(typeof data2 === "string"){
if(!pattern0.test(data2)){
const err8 = {instancePath:instancePath+"/version",schemaPath:"#/properties/version/pattern",keyword:"pattern",params:{pattern: "^\\d+\\.\\d+\\.\\d+$"},message:"must match pattern \""+"^\\d+\\.\\d+\\.\\d+$"+"\""};
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
const err9 = {instancePath:instancePath+"/version",schemaPath:"#/properties/version/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err9];
}
else {
vErrors.push(err9);
}
errors++;
}
}
if(data.documents !== undefined){
let data3 = data.documents;
if(Array.isArray(data3)){
if(data3.length > 128){
const err10 = {instancePath:instancePath+"/documents",schemaPath:"#/properties/documents/maxItems",keyword:"maxItems",params:{limit: 128},message:"must NOT have more than 128 items"};
if(vErrors === null){
vErrors = [err10];
}
else {
vErrors.push(err10);
}
errors++;
}
const len0 = data3.length;
for(let i0=0; i0<len0; i0++){
let data4 = data3[i0];
if(data4 && typeof data4 == "object" && !Array.isArray(data4)){
if(data4.id === undefined){
const err11 = {instancePath:instancePath+"/documents/" + i0,schemaPath:"#/properties/documents/items/required",keyword:"required",params:{missingProperty: "id"},message:"must have required property '"+"id"+"'"};
if(vErrors === null){
vErrors = [err11];
}
else {
vErrors.push(err11);
}
errors++;
}
if(data4.title === undefined){
const err12 = {instancePath:instancePath+"/documents/" + i0,schemaPath:"#/properties/documents/items/required",keyword:"required",params:{missingProperty: "title"},message:"must have required property '"+"title"+"'"};
if(vErrors === null){
vErrors = [err12];
}
else {
vErrors.push(err12);
}
errors++;
}
if(data4.source_id === undefined){
const err13 = {instancePath:instancePath+"/documents/" + i0,schemaPath:"#/properties/documents/items/required",keyword:"required",params:{missingProperty: "source_id"},message:"must have required property '"+"source_id"+"'"};
if(vErrors === null){
vErrors = [err13];
}
else {
vErrors.push(err13);
}
errors++;
}
if(data4.version === undefined){
const err14 = {instancePath:instancePath+"/documents/" + i0,schemaPath:"#/properties/documents/items/required",keyword:"required",params:{missingProperty: "version"},message:"must have required property '"+"version"+"'"};
if(vErrors === null){
vErrors = [err14];
}
else {
vErrors.push(err14);
}
errors++;
}
if(data4.publication_date === undefined){
const err15 = {instancePath:instancePath+"/documents/" + i0,schemaPath:"#/properties/documents/items/required",keyword:"required",params:{missingProperty: "publication_date"},message:"must have required property '"+"publication_date"+"'"};
if(vErrors === null){
vErrors = [err15];
}
else {
vErrors.push(err15);
}
errors++;
}
if(data4.version_date === undefined){
const err16 = {instancePath:instancePath+"/documents/" + i0,schemaPath:"#/properties/documents/items/required",keyword:"required",params:{missingProperty: "version_date"},message:"must have required property '"+"version_date"+"'"};
if(vErrors === null){
vErrors = [err16];
}
else {
vErrors.push(err16);
}
errors++;
}
if(data4.accessed_at === undefined){
const err17 = {instancePath:instancePath+"/documents/" + i0,schemaPath:"#/properties/documents/items/required",keyword:"required",params:{missingProperty: "accessed_at"},message:"must have required property '"+"accessed_at"+"'"};
if(vErrors === null){
vErrors = [err17];
}
else {
vErrors.push(err17);
}
errors++;
}
if(data4.license === undefined){
const err18 = {instancePath:instancePath+"/documents/" + i0,schemaPath:"#/properties/documents/items/required",keyword:"required",params:{missingProperty: "license"},message:"must have required property '"+"license"+"'"};
if(vErrors === null){
vErrors = [err18];
}
else {
vErrors.push(err18);
}
errors++;
}
if(data4.geographies === undefined){
const err19 = {instancePath:instancePath+"/documents/" + i0,schemaPath:"#/properties/documents/items/required",keyword:"required",params:{missingProperty: "geographies"},message:"must have required property '"+"geographies"+"'"};
if(vErrors === null){
vErrors = [err19];
}
else {
vErrors.push(err19);
}
errors++;
}
if(data4.topics === undefined){
const err20 = {instancePath:instancePath+"/documents/" + i0,schemaPath:"#/properties/documents/items/required",keyword:"required",params:{missingProperty: "topics"},message:"must have required property '"+"topics"+"'"};
if(vErrors === null){
vErrors = [err20];
}
else {
vErrors.push(err20);
}
errors++;
}
if(data4.inputs === undefined){
const err21 = {instancePath:instancePath+"/documents/" + i0,schemaPath:"#/properties/documents/items/required",keyword:"required",params:{missingProperty: "inputs"},message:"must have required property '"+"inputs"+"'"};
if(vErrors === null){
vErrors = [err21];
}
else {
vErrors.push(err21);
}
errors++;
}
if(data4.superseded_by === undefined){
const err22 = {instancePath:instancePath+"/documents/" + i0,schemaPath:"#/properties/documents/items/required",keyword:"required",params:{missingProperty: "superseded_by"},message:"must have required property '"+"superseded_by"+"'"};
if(vErrors === null){
vErrors = [err22];
}
else {
vErrors.push(err22);
}
errors++;
}
if(data4.stale_after === undefined){
const err23 = {instancePath:instancePath+"/documents/" + i0,schemaPath:"#/properties/documents/items/required",keyword:"required",params:{missingProperty: "stale_after"},message:"must have required property '"+"stale_after"+"'"};
if(vErrors === null){
vErrors = [err23];
}
else {
vErrors.push(err23);
}
errors++;
}
if(data4.snapshot_path === undefined){
const err24 = {instancePath:instancePath+"/documents/" + i0,schemaPath:"#/properties/documents/items/required",keyword:"required",params:{missingProperty: "snapshot_path"},message:"must have required property '"+"snapshot_path"+"'"};
if(vErrors === null){
vErrors = [err24];
}
else {
vErrors.push(err24);
}
errors++;
}
if(data4.text === undefined){
const err25 = {instancePath:instancePath+"/documents/" + i0,schemaPath:"#/properties/documents/items/required",keyword:"required",params:{missingProperty: "text"},message:"must have required property '"+"text"+"'"};
if(vErrors === null){
vErrors = [err25];
}
else {
vErrors.push(err25);
}
errors++;
}
for(const key1 in data4){
if(!(func2.call(schema11.properties.documents.items.properties, key1))){
const err26 = {instancePath:instancePath+"/documents/" + i0,schemaPath:"#/properties/documents/items/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key1},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err26];
}
else {
vErrors.push(err26);
}
errors++;
}
}
if(data4.id !== undefined){
let data5 = data4.id;
if(typeof data5 === "string"){
if(!pattern1.test(data5)){
const err27 = {instancePath:instancePath+"/documents/" + i0+"/id",schemaPath:"#/properties/documents/items/properties/id/pattern",keyword:"pattern",params:{pattern: "^[a-z0-9-]+$"},message:"must match pattern \""+"^[a-z0-9-]+$"+"\""};
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
const err28 = {instancePath:instancePath+"/documents/" + i0+"/id",schemaPath:"#/properties/documents/items/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err28];
}
else {
vErrors.push(err28);
}
errors++;
}
}
if(data4.title !== undefined){
let data6 = data4.title;
if(typeof data6 === "string"){
if(func3(data6) > 300){
const err29 = {instancePath:instancePath+"/documents/" + i0+"/title",schemaPath:"#/properties/documents/items/properties/title/maxLength",keyword:"maxLength",params:{limit: 300},message:"must NOT have more than 300 characters"};
if(vErrors === null){
vErrors = [err29];
}
else {
vErrors.push(err29);
}
errors++;
}
if(func3(data6) < 1){
const err30 = {instancePath:instancePath+"/documents/" + i0+"/title",schemaPath:"#/properties/documents/items/properties/title/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err30];
}
else {
vErrors.push(err30);
}
errors++;
}
}
else {
const err31 = {instancePath:instancePath+"/documents/" + i0+"/title",schemaPath:"#/properties/documents/items/properties/title/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err31];
}
else {
vErrors.push(err31);
}
errors++;
}
}
if(data4.source_id !== undefined){
let data7 = data4.source_id;
if(typeof data7 === "string"){
if(func3(data7) > 100){
const err32 = {instancePath:instancePath+"/documents/" + i0+"/source_id",schemaPath:"#/properties/documents/items/properties/source_id/maxLength",keyword:"maxLength",params:{limit: 100},message:"must NOT have more than 100 characters"};
if(vErrors === null){
vErrors = [err32];
}
else {
vErrors.push(err32);
}
errors++;
}
if(func3(data7) < 1){
const err33 = {instancePath:instancePath+"/documents/" + i0+"/source_id",schemaPath:"#/properties/documents/items/properties/source_id/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
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
const err34 = {instancePath:instancePath+"/documents/" + i0+"/source_id",schemaPath:"#/properties/documents/items/properties/source_id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err34];
}
else {
vErrors.push(err34);
}
errors++;
}
}
if(data4.version !== undefined){
let data8 = data4.version;
if(typeof data8 === "string"){
if(!pattern2.test(data8)){
const err35 = {instancePath:instancePath+"/documents/" + i0+"/version",schemaPath:"#/properties/documents/items/properties/version/pattern",keyword:"pattern",params:{pattern: "^[a-f0-9]{64}$"},message:"must match pattern \""+"^[a-f0-9]{64}$"+"\""};
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
const err36 = {instancePath:instancePath+"/documents/" + i0+"/version",schemaPath:"#/properties/documents/items/properties/version/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err36];
}
else {
vErrors.push(err36);
}
errors++;
}
}
if(data4.publication_date !== undefined){
let data9 = data4.publication_date;
const _errs20 = errors;
let valid4 = false;
const _errs21 = errors;
if(typeof data9 === "string"){
if(!(formats0.validate(data9))){
const err37 = {instancePath:instancePath+"/documents/" + i0+"/publication_date",schemaPath:"#/properties/documents/items/properties/publication_date/anyOf/0/format",keyword:"format",params:{format: "date-time"},message:"must match format \""+"date-time"+"\""};
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
const err38 = {instancePath:instancePath+"/documents/" + i0+"/publication_date",schemaPath:"#/properties/documents/items/properties/publication_date/anyOf/0/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err38];
}
else {
vErrors.push(err38);
}
errors++;
}
var _valid0 = _errs21 === errors;
valid4 = valid4 || _valid0;
if(!valid4){
const _errs23 = errors;
if(data9 !== null){
const err39 = {instancePath:instancePath+"/documents/" + i0+"/publication_date",schemaPath:"#/properties/documents/items/properties/publication_date/anyOf/1/type",keyword:"type",params:{type: "null"},message:"must be null"};
if(vErrors === null){
vErrors = [err39];
}
else {
vErrors.push(err39);
}
errors++;
}
var _valid0 = _errs23 === errors;
valid4 = valid4 || _valid0;
}
if(!valid4){
const err40 = {instancePath:instancePath+"/documents/" + i0+"/publication_date",schemaPath:"#/properties/documents/items/properties/publication_date/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err40];
}
else {
vErrors.push(err40);
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
if(data4.version_date !== undefined){
let data10 = data4.version_date;
const _errs26 = errors;
let valid5 = false;
const _errs27 = errors;
if(typeof data10 === "string"){
if(!(formats0.validate(data10))){
const err41 = {instancePath:instancePath+"/documents/" + i0+"/version_date",schemaPath:"#/properties/documents/items/properties/version_date/anyOf/0/format",keyword:"format",params:{format: "date-time"},message:"must match format \""+"date-time"+"\""};
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
const err42 = {instancePath:instancePath+"/documents/" + i0+"/version_date",schemaPath:"#/properties/documents/items/properties/version_date/anyOf/0/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err42];
}
else {
vErrors.push(err42);
}
errors++;
}
var _valid1 = _errs27 === errors;
valid5 = valid5 || _valid1;
if(!valid5){
const _errs29 = errors;
if(data10 !== null){
const err43 = {instancePath:instancePath+"/documents/" + i0+"/version_date",schemaPath:"#/properties/documents/items/properties/version_date/anyOf/1/type",keyword:"type",params:{type: "null"},message:"must be null"};
if(vErrors === null){
vErrors = [err43];
}
else {
vErrors.push(err43);
}
errors++;
}
var _valid1 = _errs29 === errors;
valid5 = valid5 || _valid1;
}
if(!valid5){
const err44 = {instancePath:instancePath+"/documents/" + i0+"/version_date",schemaPath:"#/properties/documents/items/properties/version_date/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err44];
}
else {
vErrors.push(err44);
}
errors++;
}
else {
errors = _errs26;
if(vErrors !== null){
if(_errs26){
vErrors.length = _errs26;
}
else {
vErrors = null;
}
}
}
}
if(data4.accessed_at !== undefined){
let data11 = data4.accessed_at;
if(typeof data11 === "string"){
if(!(formats0.validate(data11))){
const err45 = {instancePath:instancePath+"/documents/" + i0+"/accessed_at",schemaPath:"#/properties/documents/items/properties/accessed_at/format",keyword:"format",params:{format: "date-time"},message:"must match format \""+"date-time"+"\""};
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
const err46 = {instancePath:instancePath+"/documents/" + i0+"/accessed_at",schemaPath:"#/properties/documents/items/properties/accessed_at/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err46];
}
else {
vErrors.push(err46);
}
errors++;
}
}
if(data4.license !== undefined){
let data12 = data4.license;
const _errs34 = errors;
let valid6 = false;
const _errs35 = errors;
if(typeof data12 === "string"){
if(func3(data12) > 2000){
const err47 = {instancePath:instancePath+"/documents/" + i0+"/license",schemaPath:"#/properties/documents/items/properties/license/anyOf/0/maxLength",keyword:"maxLength",params:{limit: 2000},message:"must NOT have more than 2000 characters"};
if(vErrors === null){
vErrors = [err47];
}
else {
vErrors.push(err47);
}
errors++;
}
if(func3(data12) < 1){
const err48 = {instancePath:instancePath+"/documents/" + i0+"/license",schemaPath:"#/properties/documents/items/properties/license/anyOf/0/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
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
const err49 = {instancePath:instancePath+"/documents/" + i0+"/license",schemaPath:"#/properties/documents/items/properties/license/anyOf/0/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err49];
}
else {
vErrors.push(err49);
}
errors++;
}
var _valid2 = _errs35 === errors;
valid6 = valid6 || _valid2;
if(!valid6){
const _errs37 = errors;
if(data12 !== null){
const err50 = {instancePath:instancePath+"/documents/" + i0+"/license",schemaPath:"#/properties/documents/items/properties/license/anyOf/1/type",keyword:"type",params:{type: "null"},message:"must be null"};
if(vErrors === null){
vErrors = [err50];
}
else {
vErrors.push(err50);
}
errors++;
}
var _valid2 = _errs37 === errors;
valid6 = valid6 || _valid2;
}
if(!valid6){
const err51 = {instancePath:instancePath+"/documents/" + i0+"/license",schemaPath:"#/properties/documents/items/properties/license/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err51];
}
else {
vErrors.push(err51);
}
errors++;
}
else {
errors = _errs34;
if(vErrors !== null){
if(_errs34){
vErrors.length = _errs34;
}
else {
vErrors = null;
}
}
}
}
if(data4.geographies !== undefined){
let data13 = data4.geographies;
if(Array.isArray(data13)){
if(data13.length > 20){
const err52 = {instancePath:instancePath+"/documents/" + i0+"/geographies",schemaPath:"#/properties/documents/items/properties/geographies/maxItems",keyword:"maxItems",params:{limit: 20},message:"must NOT have more than 20 items"};
if(vErrors === null){
vErrors = [err52];
}
else {
vErrors.push(err52);
}
errors++;
}
const len1 = data13.length;
for(let i1=0; i1<len1; i1++){
let data14 = data13[i1];
if(typeof data14 === "string"){
if(func3(data14) > 100){
const err53 = {instancePath:instancePath+"/documents/" + i0+"/geographies/" + i1,schemaPath:"#/properties/documents/items/properties/geographies/items/maxLength",keyword:"maxLength",params:{limit: 100},message:"must NOT have more than 100 characters"};
if(vErrors === null){
vErrors = [err53];
}
else {
vErrors.push(err53);
}
errors++;
}
if(func3(data14) < 1){
const err54 = {instancePath:instancePath+"/documents/" + i0+"/geographies/" + i1,schemaPath:"#/properties/documents/items/properties/geographies/items/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
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
const err55 = {instancePath:instancePath+"/documents/" + i0+"/geographies/" + i1,schemaPath:"#/properties/documents/items/properties/geographies/items/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err55];
}
else {
vErrors.push(err55);
}
errors++;
}
}
}
else {
const err56 = {instancePath:instancePath+"/documents/" + i0+"/geographies",schemaPath:"#/properties/documents/items/properties/geographies/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err56];
}
else {
vErrors.push(err56);
}
errors++;
}
}
if(data4.topics !== undefined){
let data15 = data4.topics;
if(Array.isArray(data15)){
if(data15.length > 20){
const err57 = {instancePath:instancePath+"/documents/" + i0+"/topics",schemaPath:"#/properties/documents/items/properties/topics/maxItems",keyword:"maxItems",params:{limit: 20},message:"must NOT have more than 20 items"};
if(vErrors === null){
vErrors = [err57];
}
else {
vErrors.push(err57);
}
errors++;
}
const len2 = data15.length;
for(let i2=0; i2<len2; i2++){
let data16 = data15[i2];
if(typeof data16 === "string"){
if(func3(data16) > 100){
const err58 = {instancePath:instancePath+"/documents/" + i0+"/topics/" + i2,schemaPath:"#/properties/documents/items/properties/topics/items/maxLength",keyword:"maxLength",params:{limit: 100},message:"must NOT have more than 100 characters"};
if(vErrors === null){
vErrors = [err58];
}
else {
vErrors.push(err58);
}
errors++;
}
if(func3(data16) < 1){
const err59 = {instancePath:instancePath+"/documents/" + i0+"/topics/" + i2,schemaPath:"#/properties/documents/items/properties/topics/items/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
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
const err60 = {instancePath:instancePath+"/documents/" + i0+"/topics/" + i2,schemaPath:"#/properties/documents/items/properties/topics/items/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err60];
}
else {
vErrors.push(err60);
}
errors++;
}
}
}
else {
const err61 = {instancePath:instancePath+"/documents/" + i0+"/topics",schemaPath:"#/properties/documents/items/properties/topics/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err61];
}
else {
vErrors.push(err61);
}
errors++;
}
}
if(data4.inputs !== undefined){
let data17 = data4.inputs;
if(Array.isArray(data17)){
if(data17.length > 30){
const err62 = {instancePath:instancePath+"/documents/" + i0+"/inputs",schemaPath:"#/properties/documents/items/properties/inputs/maxItems",keyword:"maxItems",params:{limit: 30},message:"must NOT have more than 30 items"};
if(vErrors === null){
vErrors = [err62];
}
else {
vErrors.push(err62);
}
errors++;
}
const len3 = data17.length;
for(let i3=0; i3<len3; i3++){
let data18 = data17[i3];
if(data18 && typeof data18 == "object" && !Array.isArray(data18)){
if(data18.dataset_id === undefined){
const err63 = {instancePath:instancePath+"/documents/" + i0+"/inputs/" + i3,schemaPath:"#/properties/documents/items/properties/inputs/items/required",keyword:"required",params:{missingProperty: "dataset_id"},message:"must have required property '"+"dataset_id"+"'"};
if(vErrors === null){
vErrors = [err63];
}
else {
vErrors.push(err63);
}
errors++;
}
if(data18.dataset_version === undefined){
const err64 = {instancePath:instancePath+"/documents/" + i0+"/inputs/" + i3,schemaPath:"#/properties/documents/items/properties/inputs/items/required",keyword:"required",params:{missingProperty: "dataset_version"},message:"must have required property '"+"dataset_version"+"'"};
if(vErrors === null){
vErrors = [err64];
}
else {
vErrors.push(err64);
}
errors++;
}
if(data18.manifest_path === undefined){
const err65 = {instancePath:instancePath+"/documents/" + i0+"/inputs/" + i3,schemaPath:"#/properties/documents/items/properties/inputs/items/required",keyword:"required",params:{missingProperty: "manifest_path"},message:"must have required property '"+"manifest_path"+"'"};
if(vErrors === null){
vErrors = [err65];
}
else {
vErrors.push(err65);
}
errors++;
}
if(data18.sha256 === undefined){
const err66 = {instancePath:instancePath+"/documents/" + i0+"/inputs/" + i3,schemaPath:"#/properties/documents/items/properties/inputs/items/required",keyword:"required",params:{missingProperty: "sha256"},message:"must have required property '"+"sha256"+"'"};
if(vErrors === null){
vErrors = [err66];
}
else {
vErrors.push(err66);
}
errors++;
}
if(data18.stale_after === undefined){
const err67 = {instancePath:instancePath+"/documents/" + i0+"/inputs/" + i3,schemaPath:"#/properties/documents/items/properties/inputs/items/required",keyword:"required",params:{missingProperty: "stale_after"},message:"must have required property '"+"stale_after"+"'"};
if(vErrors === null){
vErrors = [err67];
}
else {
vErrors.push(err67);
}
errors++;
}
for(const key2 in data18){
if(!(((((key2 === "dataset_id") || (key2 === "dataset_version")) || (key2 === "manifest_path")) || (key2 === "sha256")) || (key2 === "stale_after"))){
const err68 = {instancePath:instancePath+"/documents/" + i0+"/inputs/" + i3,schemaPath:"#/properties/documents/items/properties/inputs/items/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key2},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err68];
}
else {
vErrors.push(err68);
}
errors++;
}
}
if(data18.dataset_id !== undefined){
let data19 = data18.dataset_id;
if(typeof data19 === "string"){
if(func3(data19) > 100){
const err69 = {instancePath:instancePath+"/documents/" + i0+"/inputs/" + i3+"/dataset_id",schemaPath:"#/properties/documents/items/properties/inputs/items/properties/dataset_id/maxLength",keyword:"maxLength",params:{limit: 100},message:"must NOT have more than 100 characters"};
if(vErrors === null){
vErrors = [err69];
}
else {
vErrors.push(err69);
}
errors++;
}
if(func3(data19) < 1){
const err70 = {instancePath:instancePath+"/documents/" + i0+"/inputs/" + i3+"/dataset_id",schemaPath:"#/properties/documents/items/properties/inputs/items/properties/dataset_id/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
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
const err71 = {instancePath:instancePath+"/documents/" + i0+"/inputs/" + i3+"/dataset_id",schemaPath:"#/properties/documents/items/properties/inputs/items/properties/dataset_id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err71];
}
else {
vErrors.push(err71);
}
errors++;
}
}
if(data18.dataset_version !== undefined){
let data20 = data18.dataset_version;
if(typeof data20 === "string"){
if(func3(data20) > 40){
const err72 = {instancePath:instancePath+"/documents/" + i0+"/inputs/" + i3+"/dataset_version",schemaPath:"#/properties/documents/items/properties/inputs/items/properties/dataset_version/maxLength",keyword:"maxLength",params:{limit: 40},message:"must NOT have more than 40 characters"};
if(vErrors === null){
vErrors = [err72];
}
else {
vErrors.push(err72);
}
errors++;
}
if(func3(data20) < 1){
const err73 = {instancePath:instancePath+"/documents/" + i0+"/inputs/" + i3+"/dataset_version",schemaPath:"#/properties/documents/items/properties/inputs/items/properties/dataset_version/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
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
const err74 = {instancePath:instancePath+"/documents/" + i0+"/inputs/" + i3+"/dataset_version",schemaPath:"#/properties/documents/items/properties/inputs/items/properties/dataset_version/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err74];
}
else {
vErrors.push(err74);
}
errors++;
}
}
if(data18.manifest_path !== undefined){
let data21 = data18.manifest_path;
if(typeof data21 === "string"){
if(!pattern3.test(data21)){
const err75 = {instancePath:instancePath+"/documents/" + i0+"/inputs/" + i3+"/manifest_path",schemaPath:"#/properties/documents/items/properties/inputs/items/properties/manifest_path/pattern",keyword:"pattern",params:{pattern: "^/data/[a-z0-9-]+/[0-9]+\\.[0-9]+\\.[0-9]+/manifest\\.json$"},message:"must match pattern \""+"^/data/[a-z0-9-]+/[0-9]+\\.[0-9]+\\.[0-9]+/manifest\\.json$"+"\""};
if(vErrors === null){
vErrors = [err75];
}
else {
vErrors.push(err75);
}
errors++;
}
}
else {
const err76 = {instancePath:instancePath+"/documents/" + i0+"/inputs/" + i3+"/manifest_path",schemaPath:"#/properties/documents/items/properties/inputs/items/properties/manifest_path/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err76];
}
else {
vErrors.push(err76);
}
errors++;
}
}
if(data18.sha256 !== undefined){
let data22 = data18.sha256;
if(typeof data22 === "string"){
if(!pattern2.test(data22)){
const err77 = {instancePath:instancePath+"/documents/" + i0+"/inputs/" + i3+"/sha256",schemaPath:"#/properties/documents/items/properties/inputs/items/properties/sha256/pattern",keyword:"pattern",params:{pattern: "^[a-f0-9]{64}$"},message:"must match pattern \""+"^[a-f0-9]{64}$"+"\""};
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
const err78 = {instancePath:instancePath+"/documents/" + i0+"/inputs/" + i3+"/sha256",schemaPath:"#/properties/documents/items/properties/inputs/items/properties/sha256/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err78];
}
else {
vErrors.push(err78);
}
errors++;
}
}
if(data18.stale_after !== undefined){
let data23 = data18.stale_after;
const _errs61 = errors;
let valid14 = false;
const _errs62 = errors;
if(typeof data23 === "string"){
if(!(formats0.validate(data23))){
const err79 = {instancePath:instancePath+"/documents/" + i0+"/inputs/" + i3+"/stale_after",schemaPath:"#/properties/documents/items/properties/inputs/items/properties/stale_after/anyOf/0/format",keyword:"format",params:{format: "date-time"},message:"must match format \""+"date-time"+"\""};
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
const err80 = {instancePath:instancePath+"/documents/" + i0+"/inputs/" + i3+"/stale_after",schemaPath:"#/properties/documents/items/properties/inputs/items/properties/stale_after/anyOf/0/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err80];
}
else {
vErrors.push(err80);
}
errors++;
}
var _valid3 = _errs62 === errors;
valid14 = valid14 || _valid3;
if(!valid14){
const _errs64 = errors;
if(data23 !== null){
const err81 = {instancePath:instancePath+"/documents/" + i0+"/inputs/" + i3+"/stale_after",schemaPath:"#/properties/documents/items/properties/inputs/items/properties/stale_after/anyOf/1/type",keyword:"type",params:{type: "null"},message:"must be null"};
if(vErrors === null){
vErrors = [err81];
}
else {
vErrors.push(err81);
}
errors++;
}
var _valid3 = _errs64 === errors;
valid14 = valid14 || _valid3;
}
if(!valid14){
const err82 = {instancePath:instancePath+"/documents/" + i0+"/inputs/" + i3+"/stale_after",schemaPath:"#/properties/documents/items/properties/inputs/items/properties/stale_after/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err82];
}
else {
vErrors.push(err82);
}
errors++;
}
else {
errors = _errs61;
if(vErrors !== null){
if(_errs61){
vErrors.length = _errs61;
}
else {
vErrors = null;
}
}
}
}
}
else {
const err83 = {instancePath:instancePath+"/documents/" + i0+"/inputs/" + i3,schemaPath:"#/properties/documents/items/properties/inputs/items/type",keyword:"type",params:{type: "object"},message:"must be object"};
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
else {
const err84 = {instancePath:instancePath+"/documents/" + i0+"/inputs",schemaPath:"#/properties/documents/items/properties/inputs/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err84];
}
else {
vErrors.push(err84);
}
errors++;
}
}
if(data4.superseded_by !== undefined){
let data24 = data4.superseded_by;
const _errs67 = errors;
let valid15 = false;
const _errs68 = errors;
if(typeof data24 === "string"){
if(func3(data24) > 100){
const err85 = {instancePath:instancePath+"/documents/" + i0+"/superseded_by",schemaPath:"#/properties/documents/items/properties/superseded_by/anyOf/0/maxLength",keyword:"maxLength",params:{limit: 100},message:"must NOT have more than 100 characters"};
if(vErrors === null){
vErrors = [err85];
}
else {
vErrors.push(err85);
}
errors++;
}
if(func3(data24) < 1){
const err86 = {instancePath:instancePath+"/documents/" + i0+"/superseded_by",schemaPath:"#/properties/documents/items/properties/superseded_by/anyOf/0/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err86];
}
else {
vErrors.push(err86);
}
errors++;
}
}
else {
const err87 = {instancePath:instancePath+"/documents/" + i0+"/superseded_by",schemaPath:"#/properties/documents/items/properties/superseded_by/anyOf/0/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err87];
}
else {
vErrors.push(err87);
}
errors++;
}
var _valid4 = _errs68 === errors;
valid15 = valid15 || _valid4;
if(!valid15){
const _errs70 = errors;
if(data24 !== null){
const err88 = {instancePath:instancePath+"/documents/" + i0+"/superseded_by",schemaPath:"#/properties/documents/items/properties/superseded_by/anyOf/1/type",keyword:"type",params:{type: "null"},message:"must be null"};
if(vErrors === null){
vErrors = [err88];
}
else {
vErrors.push(err88);
}
errors++;
}
var _valid4 = _errs70 === errors;
valid15 = valid15 || _valid4;
}
if(!valid15){
const err89 = {instancePath:instancePath+"/documents/" + i0+"/superseded_by",schemaPath:"#/properties/documents/items/properties/superseded_by/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err89];
}
else {
vErrors.push(err89);
}
errors++;
}
else {
errors = _errs67;
if(vErrors !== null){
if(_errs67){
vErrors.length = _errs67;
}
else {
vErrors = null;
}
}
}
}
if(data4.stale_after !== undefined){
let data25 = data4.stale_after;
const _errs73 = errors;
let valid16 = false;
const _errs74 = errors;
if(typeof data25 === "string"){
if(!(formats0.validate(data25))){
const err90 = {instancePath:instancePath+"/documents/" + i0+"/stale_after",schemaPath:"#/properties/documents/items/properties/stale_after/anyOf/0/format",keyword:"format",params:{format: "date-time"},message:"must match format \""+"date-time"+"\""};
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
const err91 = {instancePath:instancePath+"/documents/" + i0+"/stale_after",schemaPath:"#/properties/documents/items/properties/stale_after/anyOf/0/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err91];
}
else {
vErrors.push(err91);
}
errors++;
}
var _valid5 = _errs74 === errors;
valid16 = valid16 || _valid5;
if(!valid16){
const _errs76 = errors;
if(data25 !== null){
const err92 = {instancePath:instancePath+"/documents/" + i0+"/stale_after",schemaPath:"#/properties/documents/items/properties/stale_after/anyOf/1/type",keyword:"type",params:{type: "null"},message:"must be null"};
if(vErrors === null){
vErrors = [err92];
}
else {
vErrors.push(err92);
}
errors++;
}
var _valid5 = _errs76 === errors;
valid16 = valid16 || _valid5;
}
if(!valid16){
const err93 = {instancePath:instancePath+"/documents/" + i0+"/stale_after",schemaPath:"#/properties/documents/items/properties/stale_after/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err93];
}
else {
vErrors.push(err93);
}
errors++;
}
else {
errors = _errs73;
if(vErrors !== null){
if(_errs73){
vErrors.length = _errs73;
}
else {
vErrors = null;
}
}
}
}
if(data4.snapshot_path !== undefined){
let data26 = data4.snapshot_path;
if(typeof data26 === "string"){
if(!pattern5.test(data26)){
const err94 = {instancePath:instancePath+"/documents/" + i0+"/snapshot_path",schemaPath:"#/properties/documents/items/properties/snapshot_path/pattern",keyword:"pattern",params:{pattern: "^/data/atlas-evidence/[0-9]+\\.[0-9]+\\.[0-9]+/documents/[a-z0-9-]+\\.txt$"},message:"must match pattern \""+"^/data/atlas-evidence/[0-9]+\\.[0-9]+\\.[0-9]+/documents/[a-z0-9-]+\\.txt$"+"\""};
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
const err95 = {instancePath:instancePath+"/documents/" + i0+"/snapshot_path",schemaPath:"#/properties/documents/items/properties/snapshot_path/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err95];
}
else {
vErrors.push(err95);
}
errors++;
}
}
if(data4.text !== undefined){
let data27 = data4.text;
if(typeof data27 === "string"){
if(func3(data27) > 100000){
const err96 = {instancePath:instancePath+"/documents/" + i0+"/text",schemaPath:"#/properties/documents/items/properties/text/maxLength",keyword:"maxLength",params:{limit: 100000},message:"must NOT have more than 100000 characters"};
if(vErrors === null){
vErrors = [err96];
}
else {
vErrors.push(err96);
}
errors++;
}
if(func3(data27) < 1){
const err97 = {instancePath:instancePath+"/documents/" + i0+"/text",schemaPath:"#/properties/documents/items/properties/text/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
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
const err98 = {instancePath:instancePath+"/documents/" + i0+"/text",schemaPath:"#/properties/documents/items/properties/text/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err98];
}
else {
vErrors.push(err98);
}
errors++;
}
}
}
else {
const err99 = {instancePath:instancePath+"/documents/" + i0,schemaPath:"#/properties/documents/items/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err99];
}
else {
vErrors.push(err99);
}
errors++;
}
}
}
else {
const err100 = {instancePath:instancePath+"/documents",schemaPath:"#/properties/documents/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err100];
}
else {
vErrors.push(err100);
}
errors++;
}
}
if(data.chunks !== undefined){
let data28 = data.chunks;
if(Array.isArray(data28)){
if(data28.length > 2048){
const err101 = {instancePath:instancePath+"/chunks",schemaPath:"#/properties/chunks/maxItems",keyword:"maxItems",params:{limit: 2048},message:"must NOT have more than 2048 items"};
if(vErrors === null){
vErrors = [err101];
}
else {
vErrors.push(err101);
}
errors++;
}
const len4 = data28.length;
for(let i4=0; i4<len4; i4++){
let data29 = data28[i4];
if(data29 && typeof data29 == "object" && !Array.isArray(data29)){
if(data29.id === undefined){
const err102 = {instancePath:instancePath+"/chunks/" + i4,schemaPath:"#/properties/chunks/items/required",keyword:"required",params:{missingProperty: "id"},message:"must have required property '"+"id"+"'"};
if(vErrors === null){
vErrors = [err102];
}
else {
vErrors.push(err102);
}
errors++;
}
if(data29.document_id === undefined){
const err103 = {instancePath:instancePath+"/chunks/" + i4,schemaPath:"#/properties/chunks/items/required",keyword:"required",params:{missingProperty: "document_id"},message:"must have required property '"+"document_id"+"'"};
if(vErrors === null){
vErrors = [err103];
}
else {
vErrors.push(err103);
}
errors++;
}
if(data29.section === undefined){
const err104 = {instancePath:instancePath+"/chunks/" + i4,schemaPath:"#/properties/chunks/items/required",keyword:"required",params:{missingProperty: "section"},message:"must have required property '"+"section"+"'"};
if(vErrors === null){
vErrors = [err104];
}
else {
vErrors.push(err104);
}
errors++;
}
if(data29.start_line === undefined){
const err105 = {instancePath:instancePath+"/chunks/" + i4,schemaPath:"#/properties/chunks/items/required",keyword:"required",params:{missingProperty: "start_line"},message:"must have required property '"+"start_line"+"'"};
if(vErrors === null){
vErrors = [err105];
}
else {
vErrors.push(err105);
}
errors++;
}
if(data29.end_line === undefined){
const err106 = {instancePath:instancePath+"/chunks/" + i4,schemaPath:"#/properties/chunks/items/required",keyword:"required",params:{missingProperty: "end_line"},message:"must have required property '"+"end_line"+"'"};
if(vErrors === null){
vErrors = [err106];
}
else {
vErrors.push(err106);
}
errors++;
}
if(data29.text === undefined){
const err107 = {instancePath:instancePath+"/chunks/" + i4,schemaPath:"#/properties/chunks/items/required",keyword:"required",params:{missingProperty: "text"},message:"must have required property '"+"text"+"'"};
if(vErrors === null){
vErrors = [err107];
}
else {
vErrors.push(err107);
}
errors++;
}
if(data29.assertions === undefined){
const err108 = {instancePath:instancePath+"/chunks/" + i4,schemaPath:"#/properties/chunks/items/required",keyword:"required",params:{missingProperty: "assertions"},message:"must have required property '"+"assertions"+"'"};
if(vErrors === null){
vErrors = [err108];
}
else {
vErrors.push(err108);
}
errors++;
}
for(const key3 in data29){
if(!(((((((key3 === "id") || (key3 === "document_id")) || (key3 === "section")) || (key3 === "start_line")) || (key3 === "end_line")) || (key3 === "text")) || (key3 === "assertions"))){
const err109 = {instancePath:instancePath+"/chunks/" + i4,schemaPath:"#/properties/chunks/items/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key3},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err109];
}
else {
vErrors.push(err109);
}
errors++;
}
}
if(data29.id !== undefined){
let data30 = data29.id;
if(typeof data30 === "string"){
if(func3(data30) > 160){
const err110 = {instancePath:instancePath+"/chunks/" + i4+"/id",schemaPath:"#/properties/chunks/items/properties/id/maxLength",keyword:"maxLength",params:{limit: 160},message:"must NOT have more than 160 characters"};
if(vErrors === null){
vErrors = [err110];
}
else {
vErrors.push(err110);
}
errors++;
}
if(func3(data30) < 1){
const err111 = {instancePath:instancePath+"/chunks/" + i4+"/id",schemaPath:"#/properties/chunks/items/properties/id/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
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
const err112 = {instancePath:instancePath+"/chunks/" + i4+"/id",schemaPath:"#/properties/chunks/items/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err112];
}
else {
vErrors.push(err112);
}
errors++;
}
}
if(data29.document_id !== undefined){
let data31 = data29.document_id;
if(typeof data31 === "string"){
if(func3(data31) > 100){
const err113 = {instancePath:instancePath+"/chunks/" + i4+"/document_id",schemaPath:"#/properties/chunks/items/properties/document_id/maxLength",keyword:"maxLength",params:{limit: 100},message:"must NOT have more than 100 characters"};
if(vErrors === null){
vErrors = [err113];
}
else {
vErrors.push(err113);
}
errors++;
}
if(func3(data31) < 1){
const err114 = {instancePath:instancePath+"/chunks/" + i4+"/document_id",schemaPath:"#/properties/chunks/items/properties/document_id/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
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
const err115 = {instancePath:instancePath+"/chunks/" + i4+"/document_id",schemaPath:"#/properties/chunks/items/properties/document_id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err115];
}
else {
vErrors.push(err115);
}
errors++;
}
}
if(data29.section !== undefined){
let data32 = data29.section;
if(typeof data32 === "string"){
if(func3(data32) > 500){
const err116 = {instancePath:instancePath+"/chunks/" + i4+"/section",schemaPath:"#/properties/chunks/items/properties/section/maxLength",keyword:"maxLength",params:{limit: 500},message:"must NOT have more than 500 characters"};
if(vErrors === null){
vErrors = [err116];
}
else {
vErrors.push(err116);
}
errors++;
}
if(func3(data32) < 1){
const err117 = {instancePath:instancePath+"/chunks/" + i4+"/section",schemaPath:"#/properties/chunks/items/properties/section/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
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
const err118 = {instancePath:instancePath+"/chunks/" + i4+"/section",schemaPath:"#/properties/chunks/items/properties/section/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err118];
}
else {
vErrors.push(err118);
}
errors++;
}
}
if(data29.start_line !== undefined){
let data33 = data29.start_line;
if(!(((typeof data33 == "number") && (!(data33 % 1) && !isNaN(data33))) && (isFinite(data33)))){
const err119 = {instancePath:instancePath+"/chunks/" + i4+"/start_line",schemaPath:"#/properties/chunks/items/properties/start_line/type",keyword:"type",params:{type: "integer"},message:"must be integer"};
if(vErrors === null){
vErrors = [err119];
}
else {
vErrors.push(err119);
}
errors++;
}
if((typeof data33 == "number") && (isFinite(data33))){
if(data33 < 1 || isNaN(data33)){
const err120 = {instancePath:instancePath+"/chunks/" + i4+"/start_line",schemaPath:"#/properties/chunks/items/properties/start_line/minimum",keyword:"minimum",params:{comparison: ">=", limit: 1},message:"must be >= 1"};
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
if(data29.end_line !== undefined){
let data34 = data29.end_line;
if(!(((typeof data34 == "number") && (!(data34 % 1) && !isNaN(data34))) && (isFinite(data34)))){
const err121 = {instancePath:instancePath+"/chunks/" + i4+"/end_line",schemaPath:"#/properties/chunks/items/properties/end_line/type",keyword:"type",params:{type: "integer"},message:"must be integer"};
if(vErrors === null){
vErrors = [err121];
}
else {
vErrors.push(err121);
}
errors++;
}
if((typeof data34 == "number") && (isFinite(data34))){
if(data34 < 1 || isNaN(data34)){
const err122 = {instancePath:instancePath+"/chunks/" + i4+"/end_line",schemaPath:"#/properties/chunks/items/properties/end_line/minimum",keyword:"minimum",params:{comparison: ">=", limit: 1},message:"must be >= 1"};
if(vErrors === null){
vErrors = [err122];
}
else {
vErrors.push(err122);
}
errors++;
}
}
}
if(data29.text !== undefined){
let data35 = data29.text;
if(typeof data35 === "string"){
if(func3(data35) > 4000){
const err123 = {instancePath:instancePath+"/chunks/" + i4+"/text",schemaPath:"#/properties/chunks/items/properties/text/maxLength",keyword:"maxLength",params:{limit: 4000},message:"must NOT have more than 4000 characters"};
if(vErrors === null){
vErrors = [err123];
}
else {
vErrors.push(err123);
}
errors++;
}
if(func3(data35) < 1){
const err124 = {instancePath:instancePath+"/chunks/" + i4+"/text",schemaPath:"#/properties/chunks/items/properties/text/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err124];
}
else {
vErrors.push(err124);
}
errors++;
}
}
else {
const err125 = {instancePath:instancePath+"/chunks/" + i4+"/text",schemaPath:"#/properties/chunks/items/properties/text/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err125];
}
else {
vErrors.push(err125);
}
errors++;
}
}
if(data29.assertions !== undefined){
let data36 = data29.assertions;
if(Array.isArray(data36)){
if(data36.length > 20){
const err126 = {instancePath:instancePath+"/chunks/" + i4+"/assertions",schemaPath:"#/properties/chunks/items/properties/assertions/maxItems",keyword:"maxItems",params:{limit: 20},message:"must NOT have more than 20 items"};
if(vErrors === null){
vErrors = [err126];
}
else {
vErrors.push(err126);
}
errors++;
}
const len5 = data36.length;
for(let i5=0; i5<len5; i5++){
let data37 = data36[i5];
if(data37 && typeof data37 == "object" && !Array.isArray(data37)){
if(data37.subject === undefined){
const err127 = {instancePath:instancePath+"/chunks/" + i4+"/assertions/" + i5,schemaPath:"#/properties/chunks/items/properties/assertions/items/required",keyword:"required",params:{missingProperty: "subject"},message:"must have required property '"+"subject"+"'"};
if(vErrors === null){
vErrors = [err127];
}
else {
vErrors.push(err127);
}
errors++;
}
if(data37.predicate === undefined){
const err128 = {instancePath:instancePath+"/chunks/" + i4+"/assertions/" + i5,schemaPath:"#/properties/chunks/items/properties/assertions/items/required",keyword:"required",params:{missingProperty: "predicate"},message:"must have required property '"+"predicate"+"'"};
if(vErrors === null){
vErrors = [err128];
}
else {
vErrors.push(err128);
}
errors++;
}
if(data37.scope === undefined){
const err129 = {instancePath:instancePath+"/chunks/" + i4+"/assertions/" + i5,schemaPath:"#/properties/chunks/items/properties/assertions/items/required",keyword:"required",params:{missingProperty: "scope"},message:"must have required property '"+"scope"+"'"};
if(vErrors === null){
vErrors = [err129];
}
else {
vErrors.push(err129);
}
errors++;
}
if(data37.value === undefined){
const err130 = {instancePath:instancePath+"/chunks/" + i4+"/assertions/" + i5,schemaPath:"#/properties/chunks/items/properties/assertions/items/required",keyword:"required",params:{missingProperty: "value"},message:"must have required property '"+"value"+"'"};
if(vErrors === null){
vErrors = [err130];
}
else {
vErrors.push(err130);
}
errors++;
}
for(const key4 in data37){
if(!((((key4 === "subject") || (key4 === "predicate")) || (key4 === "scope")) || (key4 === "value"))){
const err131 = {instancePath:instancePath+"/chunks/" + i4+"/assertions/" + i5,schemaPath:"#/properties/chunks/items/properties/assertions/items/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key4},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err131];
}
else {
vErrors.push(err131);
}
errors++;
}
}
if(data37.subject !== undefined){
let data38 = data37.subject;
if(typeof data38 === "string"){
if(func3(data38) > 100){
const err132 = {instancePath:instancePath+"/chunks/" + i4+"/assertions/" + i5+"/subject",schemaPath:"#/properties/chunks/items/properties/assertions/items/properties/subject/maxLength",keyword:"maxLength",params:{limit: 100},message:"must NOT have more than 100 characters"};
if(vErrors === null){
vErrors = [err132];
}
else {
vErrors.push(err132);
}
errors++;
}
if(func3(data38) < 1){
const err133 = {instancePath:instancePath+"/chunks/" + i4+"/assertions/" + i5+"/subject",schemaPath:"#/properties/chunks/items/properties/assertions/items/properties/subject/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
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
const err134 = {instancePath:instancePath+"/chunks/" + i4+"/assertions/" + i5+"/subject",schemaPath:"#/properties/chunks/items/properties/assertions/items/properties/subject/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err134];
}
else {
vErrors.push(err134);
}
errors++;
}
}
if(data37.predicate !== undefined){
let data39 = data37.predicate;
if(typeof data39 === "string"){
if(func3(data39) > 100){
const err135 = {instancePath:instancePath+"/chunks/" + i4+"/assertions/" + i5+"/predicate",schemaPath:"#/properties/chunks/items/properties/assertions/items/properties/predicate/maxLength",keyword:"maxLength",params:{limit: 100},message:"must NOT have more than 100 characters"};
if(vErrors === null){
vErrors = [err135];
}
else {
vErrors.push(err135);
}
errors++;
}
if(func3(data39) < 1){
const err136 = {instancePath:instancePath+"/chunks/" + i4+"/assertions/" + i5+"/predicate",schemaPath:"#/properties/chunks/items/properties/assertions/items/properties/predicate/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err136];
}
else {
vErrors.push(err136);
}
errors++;
}
}
else {
const err137 = {instancePath:instancePath+"/chunks/" + i4+"/assertions/" + i5+"/predicate",schemaPath:"#/properties/chunks/items/properties/assertions/items/properties/predicate/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err137];
}
else {
vErrors.push(err137);
}
errors++;
}
}
if(data37.scope !== undefined){
let data40 = data37.scope;
if(typeof data40 === "string"){
if(func3(data40) > 200){
const err138 = {instancePath:instancePath+"/chunks/" + i4+"/assertions/" + i5+"/scope",schemaPath:"#/properties/chunks/items/properties/assertions/items/properties/scope/maxLength",keyword:"maxLength",params:{limit: 200},message:"must NOT have more than 200 characters"};
if(vErrors === null){
vErrors = [err138];
}
else {
vErrors.push(err138);
}
errors++;
}
if(func3(data40) < 1){
const err139 = {instancePath:instancePath+"/chunks/" + i4+"/assertions/" + i5+"/scope",schemaPath:"#/properties/chunks/items/properties/assertions/items/properties/scope/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err139];
}
else {
vErrors.push(err139);
}
errors++;
}
}
else {
const err140 = {instancePath:instancePath+"/chunks/" + i4+"/assertions/" + i5+"/scope",schemaPath:"#/properties/chunks/items/properties/assertions/items/properties/scope/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err140];
}
else {
vErrors.push(err140);
}
errors++;
}
}
if(data37.value !== undefined){
let data41 = data37.value;
if(typeof data41 === "string"){
if(func3(data41) > 500){
const err141 = {instancePath:instancePath+"/chunks/" + i4+"/assertions/" + i5+"/value",schemaPath:"#/properties/chunks/items/properties/assertions/items/properties/value/maxLength",keyword:"maxLength",params:{limit: 500},message:"must NOT have more than 500 characters"};
if(vErrors === null){
vErrors = [err141];
}
else {
vErrors.push(err141);
}
errors++;
}
if(func3(data41) < 1){
const err142 = {instancePath:instancePath+"/chunks/" + i4+"/assertions/" + i5+"/value",schemaPath:"#/properties/chunks/items/properties/assertions/items/properties/value/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
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
const err143 = {instancePath:instancePath+"/chunks/" + i4+"/assertions/" + i5+"/value",schemaPath:"#/properties/chunks/items/properties/assertions/items/properties/value/type",keyword:"type",params:{type: "string"},message:"must be string"};
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
const err144 = {instancePath:instancePath+"/chunks/" + i4+"/assertions/" + i5,schemaPath:"#/properties/chunks/items/properties/assertions/items/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err144];
}
else {
vErrors.push(err144);
}
errors++;
}
}
}
else {
const err145 = {instancePath:instancePath+"/chunks/" + i4+"/assertions",schemaPath:"#/properties/chunks/items/properties/assertions/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err145];
}
else {
vErrors.push(err145);
}
errors++;
}
}
}
else {
const err146 = {instancePath:instancePath+"/chunks/" + i4,schemaPath:"#/properties/chunks/items/type",keyword:"type",params:{type: "object"},message:"must be object"};
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
const err147 = {instancePath:instancePath+"/chunks",schemaPath:"#/properties/chunks/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err147];
}
else {
vErrors.push(err147);
}
errors++;
}
}
}
else {
const err148 = {instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err148];
}
else {
vErrors.push(err148);
}
errors++;
}
validate10.errors = vErrors;
return errors === 0;
}

