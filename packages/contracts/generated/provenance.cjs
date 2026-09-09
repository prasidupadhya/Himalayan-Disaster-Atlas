// Generated from provenance.schema.json; run npm run contracts:generate. Do not edit.
"use strict";
module.exports = validate10;
module.exports.default = validate10;
const schema11 = {"$schema":"http://json-schema.org/draft-07/schema#","$id":"https://himalayan-disaster-atlas.invalid/schemas/provenance.schema.json","type":"object","additionalProperties":false,"required":["schema_version","kind","version","generated_from_count","records"],"properties":{"schema_version":{"const":"1.0.0"},"kind":{"const":"provenance-catalog"},"version":{"const":"1.0.0"},"generated_from_count":{"type":"integer","minimum":1},"records":{"type":"array","minItems":1,"items":{"type":"object","additionalProperties":false,"required":["key","id","version","title","category","source","source_url","license","license_url","attribution","access_date","observation_date","publication_date","processing_date","processing_version","method","spatial_resolution","spatial_coverage","temporal_coverage","limitations","uncertainty","evidence_type","status","is_fixture","state","manifest_path","manifest_sha256","artifacts","parents","transformations","methodology_href","source_href","map_href"],"properties":{"key":{"type":"string","minLength":1},"id":{"type":"string","minLength":1},"version":{"type":"string","minLength":1},"title":{"type":"string","minLength":1},"category":{"enum":["Administrative","Terrain","Cryosphere","Hydrology & climate","Hazards & events","Infrastructure","Population","Satellite","Analysis & models","Discovery & evidence","Development"]},"source":{"type":"string","minLength":1},"source_url":{"type":["string","null"]},"license":{"type":"string","minLength":1},"license_url":{"type":["string","null"]},"attribution":{"type":"string","minLength":1},"access_date":{"type":["string","null"]},"observation_date":{"type":["string","null"]},"publication_date":{"type":["string","null"]},"processing_date":{"type":["string","null"]},"processing_version":{"type":"string","minLength":1},"method":{"type":"string","minLength":1},"spatial_resolution":{"type":"string","minLength":1},"spatial_coverage":{"type":"string","minLength":1},"temporal_coverage":{"type":"string","minLength":1},"limitations":{"type":"array","minItems":1,"items":{"type":"string","minLength":1}},"uncertainty":{"type":"string","minLength":1},"evidence_type":{"enum":["observed","derived","estimated","modelled","simulated","historical","unknown"]},"status":{"type":"string","minLength":1},"is_fixture":{"type":"boolean"},"state":{"enum":["current","superseded","fixture"]},"manifest_path":{"type":"string","pattern":"^/data/.+/manifest\\.json$"},"manifest_sha256":{"type":"string","pattern":"^[a-f0-9]{64}$"},"artifacts":{"type":"array","minItems":1,"items":{"type":"object","additionalProperties":false,"required":["path","sha256","byte_size"],"properties":{"path":{"type":"string","pattern":"^/data/"},"sha256":{"type":"string","pattern":"^[a-f0-9]{64}$"},"byte_size":{"type":"integer","minimum":1}}}},"parents":{"type":"array","items":{"type":"object","additionalProperties":false,"required":["id","version","source","manifest_path","sha256"],"properties":{"id":{"type":"string","minLength":1},"version":{"type":"string","minLength":1},"source":{"type":"string","minLength":1},"manifest_path":{"type":["string","null"]},"sha256":{"type":["string","null"],"pattern":"^[a-f0-9]{64}$"}}}},"transformations":{"type":"array","minItems":3,"items":{"type":"string","minLength":1}},"methodology_href":{"type":"string","pattern":"^/methodology/"},"source_href":{"type":"string","pattern":"^/sources/"},"map_href":{"type":["string","null"],"pattern":"^/atlas/"}}}}}};
const func2 = Object.prototype.hasOwnProperty;
const func3 = require("ajv/dist/runtime/ucs2length").default;
const pattern0 = new RegExp("^/data/.+/manifest\\.json$", "u");
const pattern1 = new RegExp("^[a-f0-9]{64}$", "u");
const pattern2 = new RegExp("^/data/", "u");
const pattern5 = new RegExp("^/methodology/", "u");
const pattern6 = new RegExp("^/sources/", "u");
const pattern7 = new RegExp("^/atlas/", "u");

function validate10(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
/*# sourceURL="https://himalayan-disaster-atlas.invalid/schemas/provenance.schema.json" */;
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
if(data.generated_from_count === undefined){
const err3 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "generated_from_count"},message:"must have required property '"+"generated_from_count"+"'"};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
if(data.records === undefined){
const err4 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "records"},message:"must have required property '"+"records"+"'"};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
for(const key0 in data){
if(!(((((key0 === "schema_version") || (key0 === "kind")) || (key0 === "version")) || (key0 === "generated_from_count")) || (key0 === "records"))){
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
if("provenance-catalog" !== data.kind){
const err7 = {instancePath:instancePath+"/kind",schemaPath:"#/properties/kind/const",keyword:"const",params:{allowedValue: "provenance-catalog"},message:"must be equal to constant"};
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
if("1.0.0" !== data.version){
const err8 = {instancePath:instancePath+"/version",schemaPath:"#/properties/version/const",keyword:"const",params:{allowedValue: "1.0.0"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err8];
}
else {
vErrors.push(err8);
}
errors++;
}
}
if(data.generated_from_count !== undefined){
let data3 = data.generated_from_count;
if(!(((typeof data3 == "number") && (!(data3 % 1) && !isNaN(data3))) && (isFinite(data3)))){
const err9 = {instancePath:instancePath+"/generated_from_count",schemaPath:"#/properties/generated_from_count/type",keyword:"type",params:{type: "integer"},message:"must be integer"};
if(vErrors === null){
vErrors = [err9];
}
else {
vErrors.push(err9);
}
errors++;
}
if((typeof data3 == "number") && (isFinite(data3))){
if(data3 < 1 || isNaN(data3)){
const err10 = {instancePath:instancePath+"/generated_from_count",schemaPath:"#/properties/generated_from_count/minimum",keyword:"minimum",params:{comparison: ">=", limit: 1},message:"must be >= 1"};
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
if(data.records !== undefined){
let data4 = data.records;
if(Array.isArray(data4)){
if(data4.length < 1){
const err11 = {instancePath:instancePath+"/records",schemaPath:"#/properties/records/minItems",keyword:"minItems",params:{limit: 1},message:"must NOT have fewer than 1 items"};
if(vErrors === null){
vErrors = [err11];
}
else {
vErrors.push(err11);
}
errors++;
}
const len0 = data4.length;
for(let i0=0; i0<len0; i0++){
let data5 = data4[i0];
if(data5 && typeof data5 == "object" && !Array.isArray(data5)){
if(data5.key === undefined){
const err12 = {instancePath:instancePath+"/records/" + i0,schemaPath:"#/properties/records/items/required",keyword:"required",params:{missingProperty: "key"},message:"must have required property '"+"key"+"'"};
if(vErrors === null){
vErrors = [err12];
}
else {
vErrors.push(err12);
}
errors++;
}
if(data5.id === undefined){
const err13 = {instancePath:instancePath+"/records/" + i0,schemaPath:"#/properties/records/items/required",keyword:"required",params:{missingProperty: "id"},message:"must have required property '"+"id"+"'"};
if(vErrors === null){
vErrors = [err13];
}
else {
vErrors.push(err13);
}
errors++;
}
if(data5.version === undefined){
const err14 = {instancePath:instancePath+"/records/" + i0,schemaPath:"#/properties/records/items/required",keyword:"required",params:{missingProperty: "version"},message:"must have required property '"+"version"+"'"};
if(vErrors === null){
vErrors = [err14];
}
else {
vErrors.push(err14);
}
errors++;
}
if(data5.title === undefined){
const err15 = {instancePath:instancePath+"/records/" + i0,schemaPath:"#/properties/records/items/required",keyword:"required",params:{missingProperty: "title"},message:"must have required property '"+"title"+"'"};
if(vErrors === null){
vErrors = [err15];
}
else {
vErrors.push(err15);
}
errors++;
}
if(data5.category === undefined){
const err16 = {instancePath:instancePath+"/records/" + i0,schemaPath:"#/properties/records/items/required",keyword:"required",params:{missingProperty: "category"},message:"must have required property '"+"category"+"'"};
if(vErrors === null){
vErrors = [err16];
}
else {
vErrors.push(err16);
}
errors++;
}
if(data5.source === undefined){
const err17 = {instancePath:instancePath+"/records/" + i0,schemaPath:"#/properties/records/items/required",keyword:"required",params:{missingProperty: "source"},message:"must have required property '"+"source"+"'"};
if(vErrors === null){
vErrors = [err17];
}
else {
vErrors.push(err17);
}
errors++;
}
if(data5.source_url === undefined){
const err18 = {instancePath:instancePath+"/records/" + i0,schemaPath:"#/properties/records/items/required",keyword:"required",params:{missingProperty: "source_url"},message:"must have required property '"+"source_url"+"'"};
if(vErrors === null){
vErrors = [err18];
}
else {
vErrors.push(err18);
}
errors++;
}
if(data5.license === undefined){
const err19 = {instancePath:instancePath+"/records/" + i0,schemaPath:"#/properties/records/items/required",keyword:"required",params:{missingProperty: "license"},message:"must have required property '"+"license"+"'"};
if(vErrors === null){
vErrors = [err19];
}
else {
vErrors.push(err19);
}
errors++;
}
if(data5.license_url === undefined){
const err20 = {instancePath:instancePath+"/records/" + i0,schemaPath:"#/properties/records/items/required",keyword:"required",params:{missingProperty: "license_url"},message:"must have required property '"+"license_url"+"'"};
if(vErrors === null){
vErrors = [err20];
}
else {
vErrors.push(err20);
}
errors++;
}
if(data5.attribution === undefined){
const err21 = {instancePath:instancePath+"/records/" + i0,schemaPath:"#/properties/records/items/required",keyword:"required",params:{missingProperty: "attribution"},message:"must have required property '"+"attribution"+"'"};
if(vErrors === null){
vErrors = [err21];
}
else {
vErrors.push(err21);
}
errors++;
}
if(data5.access_date === undefined){
const err22 = {instancePath:instancePath+"/records/" + i0,schemaPath:"#/properties/records/items/required",keyword:"required",params:{missingProperty: "access_date"},message:"must have required property '"+"access_date"+"'"};
if(vErrors === null){
vErrors = [err22];
}
else {
vErrors.push(err22);
}
errors++;
}
if(data5.observation_date === undefined){
const err23 = {instancePath:instancePath+"/records/" + i0,schemaPath:"#/properties/records/items/required",keyword:"required",params:{missingProperty: "observation_date"},message:"must have required property '"+"observation_date"+"'"};
if(vErrors === null){
vErrors = [err23];
}
else {
vErrors.push(err23);
}
errors++;
}
if(data5.publication_date === undefined){
const err24 = {instancePath:instancePath+"/records/" + i0,schemaPath:"#/properties/records/items/required",keyword:"required",params:{missingProperty: "publication_date"},message:"must have required property '"+"publication_date"+"'"};
if(vErrors === null){
vErrors = [err24];
}
else {
vErrors.push(err24);
}
errors++;
}
if(data5.processing_date === undefined){
const err25 = {instancePath:instancePath+"/records/" + i0,schemaPath:"#/properties/records/items/required",keyword:"required",params:{missingProperty: "processing_date"},message:"must have required property '"+"processing_date"+"'"};
if(vErrors === null){
vErrors = [err25];
}
else {
vErrors.push(err25);
}
errors++;
}
if(data5.processing_version === undefined){
const err26 = {instancePath:instancePath+"/records/" + i0,schemaPath:"#/properties/records/items/required",keyword:"required",params:{missingProperty: "processing_version"},message:"must have required property '"+"processing_version"+"'"};
if(vErrors === null){
vErrors = [err26];
}
else {
vErrors.push(err26);
}
errors++;
}
if(data5.method === undefined){
const err27 = {instancePath:instancePath+"/records/" + i0,schemaPath:"#/properties/records/items/required",keyword:"required",params:{missingProperty: "method"},message:"must have required property '"+"method"+"'"};
if(vErrors === null){
vErrors = [err27];
}
else {
vErrors.push(err27);
}
errors++;
}
if(data5.spatial_resolution === undefined){
const err28 = {instancePath:instancePath+"/records/" + i0,schemaPath:"#/properties/records/items/required",keyword:"required",params:{missingProperty: "spatial_resolution"},message:"must have required property '"+"spatial_resolution"+"'"};
if(vErrors === null){
vErrors = [err28];
}
else {
vErrors.push(err28);
}
errors++;
}
if(data5.spatial_coverage === undefined){
const err29 = {instancePath:instancePath+"/records/" + i0,schemaPath:"#/properties/records/items/required",keyword:"required",params:{missingProperty: "spatial_coverage"},message:"must have required property '"+"spatial_coverage"+"'"};
if(vErrors === null){
vErrors = [err29];
}
else {
vErrors.push(err29);
}
errors++;
}
if(data5.temporal_coverage === undefined){
const err30 = {instancePath:instancePath+"/records/" + i0,schemaPath:"#/properties/records/items/required",keyword:"required",params:{missingProperty: "temporal_coverage"},message:"must have required property '"+"temporal_coverage"+"'"};
if(vErrors === null){
vErrors = [err30];
}
else {
vErrors.push(err30);
}
errors++;
}
if(data5.limitations === undefined){
const err31 = {instancePath:instancePath+"/records/" + i0,schemaPath:"#/properties/records/items/required",keyword:"required",params:{missingProperty: "limitations"},message:"must have required property '"+"limitations"+"'"};
if(vErrors === null){
vErrors = [err31];
}
else {
vErrors.push(err31);
}
errors++;
}
if(data5.uncertainty === undefined){
const err32 = {instancePath:instancePath+"/records/" + i0,schemaPath:"#/properties/records/items/required",keyword:"required",params:{missingProperty: "uncertainty"},message:"must have required property '"+"uncertainty"+"'"};
if(vErrors === null){
vErrors = [err32];
}
else {
vErrors.push(err32);
}
errors++;
}
if(data5.evidence_type === undefined){
const err33 = {instancePath:instancePath+"/records/" + i0,schemaPath:"#/properties/records/items/required",keyword:"required",params:{missingProperty: "evidence_type"},message:"must have required property '"+"evidence_type"+"'"};
if(vErrors === null){
vErrors = [err33];
}
else {
vErrors.push(err33);
}
errors++;
}
if(data5.status === undefined){
const err34 = {instancePath:instancePath+"/records/" + i0,schemaPath:"#/properties/records/items/required",keyword:"required",params:{missingProperty: "status"},message:"must have required property '"+"status"+"'"};
if(vErrors === null){
vErrors = [err34];
}
else {
vErrors.push(err34);
}
errors++;
}
if(data5.is_fixture === undefined){
const err35 = {instancePath:instancePath+"/records/" + i0,schemaPath:"#/properties/records/items/required",keyword:"required",params:{missingProperty: "is_fixture"},message:"must have required property '"+"is_fixture"+"'"};
if(vErrors === null){
vErrors = [err35];
}
else {
vErrors.push(err35);
}
errors++;
}
if(data5.state === undefined){
const err36 = {instancePath:instancePath+"/records/" + i0,schemaPath:"#/properties/records/items/required",keyword:"required",params:{missingProperty: "state"},message:"must have required property '"+"state"+"'"};
if(vErrors === null){
vErrors = [err36];
}
else {
vErrors.push(err36);
}
errors++;
}
if(data5.manifest_path === undefined){
const err37 = {instancePath:instancePath+"/records/" + i0,schemaPath:"#/properties/records/items/required",keyword:"required",params:{missingProperty: "manifest_path"},message:"must have required property '"+"manifest_path"+"'"};
if(vErrors === null){
vErrors = [err37];
}
else {
vErrors.push(err37);
}
errors++;
}
if(data5.manifest_sha256 === undefined){
const err38 = {instancePath:instancePath+"/records/" + i0,schemaPath:"#/properties/records/items/required",keyword:"required",params:{missingProperty: "manifest_sha256"},message:"must have required property '"+"manifest_sha256"+"'"};
if(vErrors === null){
vErrors = [err38];
}
else {
vErrors.push(err38);
}
errors++;
}
if(data5.artifacts === undefined){
const err39 = {instancePath:instancePath+"/records/" + i0,schemaPath:"#/properties/records/items/required",keyword:"required",params:{missingProperty: "artifacts"},message:"must have required property '"+"artifacts"+"'"};
if(vErrors === null){
vErrors = [err39];
}
else {
vErrors.push(err39);
}
errors++;
}
if(data5.parents === undefined){
const err40 = {instancePath:instancePath+"/records/" + i0,schemaPath:"#/properties/records/items/required",keyword:"required",params:{missingProperty: "parents"},message:"must have required property '"+"parents"+"'"};
if(vErrors === null){
vErrors = [err40];
}
else {
vErrors.push(err40);
}
errors++;
}
if(data5.transformations === undefined){
const err41 = {instancePath:instancePath+"/records/" + i0,schemaPath:"#/properties/records/items/required",keyword:"required",params:{missingProperty: "transformations"},message:"must have required property '"+"transformations"+"'"};
if(vErrors === null){
vErrors = [err41];
}
else {
vErrors.push(err41);
}
errors++;
}
if(data5.methodology_href === undefined){
const err42 = {instancePath:instancePath+"/records/" + i0,schemaPath:"#/properties/records/items/required",keyword:"required",params:{missingProperty: "methodology_href"},message:"must have required property '"+"methodology_href"+"'"};
if(vErrors === null){
vErrors = [err42];
}
else {
vErrors.push(err42);
}
errors++;
}
if(data5.source_href === undefined){
const err43 = {instancePath:instancePath+"/records/" + i0,schemaPath:"#/properties/records/items/required",keyword:"required",params:{missingProperty: "source_href"},message:"must have required property '"+"source_href"+"'"};
if(vErrors === null){
vErrors = [err43];
}
else {
vErrors.push(err43);
}
errors++;
}
if(data5.map_href === undefined){
const err44 = {instancePath:instancePath+"/records/" + i0,schemaPath:"#/properties/records/items/required",keyword:"required",params:{missingProperty: "map_href"},message:"must have required property '"+"map_href"+"'"};
if(vErrors === null){
vErrors = [err44];
}
else {
vErrors.push(err44);
}
errors++;
}
for(const key1 in data5){
if(!(func2.call(schema11.properties.records.items.properties, key1))){
const err45 = {instancePath:instancePath+"/records/" + i0,schemaPath:"#/properties/records/items/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key1},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err45];
}
else {
vErrors.push(err45);
}
errors++;
}
}
if(data5.key !== undefined){
let data6 = data5.key;
if(typeof data6 === "string"){
if(func3(data6) < 1){
const err46 = {instancePath:instancePath+"/records/" + i0+"/key",schemaPath:"#/properties/records/items/properties/key/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
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
const err47 = {instancePath:instancePath+"/records/" + i0+"/key",schemaPath:"#/properties/records/items/properties/key/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err47];
}
else {
vErrors.push(err47);
}
errors++;
}
}
if(data5.id !== undefined){
let data7 = data5.id;
if(typeof data7 === "string"){
if(func3(data7) < 1){
const err48 = {instancePath:instancePath+"/records/" + i0+"/id",schemaPath:"#/properties/records/items/properties/id/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
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
const err49 = {instancePath:instancePath+"/records/" + i0+"/id",schemaPath:"#/properties/records/items/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err49];
}
else {
vErrors.push(err49);
}
errors++;
}
}
if(data5.version !== undefined){
let data8 = data5.version;
if(typeof data8 === "string"){
if(func3(data8) < 1){
const err50 = {instancePath:instancePath+"/records/" + i0+"/version",schemaPath:"#/properties/records/items/properties/version/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
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
const err51 = {instancePath:instancePath+"/records/" + i0+"/version",schemaPath:"#/properties/records/items/properties/version/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err51];
}
else {
vErrors.push(err51);
}
errors++;
}
}
if(data5.title !== undefined){
let data9 = data5.title;
if(typeof data9 === "string"){
if(func3(data9) < 1){
const err52 = {instancePath:instancePath+"/records/" + i0+"/title",schemaPath:"#/properties/records/items/properties/title/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
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
const err53 = {instancePath:instancePath+"/records/" + i0+"/title",schemaPath:"#/properties/records/items/properties/title/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err53];
}
else {
vErrors.push(err53);
}
errors++;
}
}
if(data5.category !== undefined){
let data10 = data5.category;
if(!(((((((((((data10 === "Administrative") || (data10 === "Terrain")) || (data10 === "Cryosphere")) || (data10 === "Hydrology & climate")) || (data10 === "Hazards & events")) || (data10 === "Infrastructure")) || (data10 === "Population")) || (data10 === "Satellite")) || (data10 === "Analysis & models")) || (data10 === "Discovery & evidence")) || (data10 === "Development"))){
const err54 = {instancePath:instancePath+"/records/" + i0+"/category",schemaPath:"#/properties/records/items/properties/category/enum",keyword:"enum",params:{allowedValues: schema11.properties.records.items.properties.category.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err54];
}
else {
vErrors.push(err54);
}
errors++;
}
}
if(data5.source !== undefined){
let data11 = data5.source;
if(typeof data11 === "string"){
if(func3(data11) < 1){
const err55 = {instancePath:instancePath+"/records/" + i0+"/source",schemaPath:"#/properties/records/items/properties/source/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
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
const err56 = {instancePath:instancePath+"/records/" + i0+"/source",schemaPath:"#/properties/records/items/properties/source/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err56];
}
else {
vErrors.push(err56);
}
errors++;
}
}
if(data5.source_url !== undefined){
let data12 = data5.source_url;
if((typeof data12 !== "string") && (data12 !== null)){
const err57 = {instancePath:instancePath+"/records/" + i0+"/source_url",schemaPath:"#/properties/records/items/properties/source_url/type",keyword:"type",params:{type: schema11.properties.records.items.properties.source_url.type},message:"must be string,null"};
if(vErrors === null){
vErrors = [err57];
}
else {
vErrors.push(err57);
}
errors++;
}
}
if(data5.license !== undefined){
let data13 = data5.license;
if(typeof data13 === "string"){
if(func3(data13) < 1){
const err58 = {instancePath:instancePath+"/records/" + i0+"/license",schemaPath:"#/properties/records/items/properties/license/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
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
const err59 = {instancePath:instancePath+"/records/" + i0+"/license",schemaPath:"#/properties/records/items/properties/license/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err59];
}
else {
vErrors.push(err59);
}
errors++;
}
}
if(data5.license_url !== undefined){
let data14 = data5.license_url;
if((typeof data14 !== "string") && (data14 !== null)){
const err60 = {instancePath:instancePath+"/records/" + i0+"/license_url",schemaPath:"#/properties/records/items/properties/license_url/type",keyword:"type",params:{type: schema11.properties.records.items.properties.license_url.type},message:"must be string,null"};
if(vErrors === null){
vErrors = [err60];
}
else {
vErrors.push(err60);
}
errors++;
}
}
if(data5.attribution !== undefined){
let data15 = data5.attribution;
if(typeof data15 === "string"){
if(func3(data15) < 1){
const err61 = {instancePath:instancePath+"/records/" + i0+"/attribution",schemaPath:"#/properties/records/items/properties/attribution/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
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
const err62 = {instancePath:instancePath+"/records/" + i0+"/attribution",schemaPath:"#/properties/records/items/properties/attribution/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err62];
}
else {
vErrors.push(err62);
}
errors++;
}
}
if(data5.access_date !== undefined){
let data16 = data5.access_date;
if((typeof data16 !== "string") && (data16 !== null)){
const err63 = {instancePath:instancePath+"/records/" + i0+"/access_date",schemaPath:"#/properties/records/items/properties/access_date/type",keyword:"type",params:{type: schema11.properties.records.items.properties.access_date.type},message:"must be string,null"};
if(vErrors === null){
vErrors = [err63];
}
else {
vErrors.push(err63);
}
errors++;
}
}
if(data5.observation_date !== undefined){
let data17 = data5.observation_date;
if((typeof data17 !== "string") && (data17 !== null)){
const err64 = {instancePath:instancePath+"/records/" + i0+"/observation_date",schemaPath:"#/properties/records/items/properties/observation_date/type",keyword:"type",params:{type: schema11.properties.records.items.properties.observation_date.type},message:"must be string,null"};
if(vErrors === null){
vErrors = [err64];
}
else {
vErrors.push(err64);
}
errors++;
}
}
if(data5.publication_date !== undefined){
let data18 = data5.publication_date;
if((typeof data18 !== "string") && (data18 !== null)){
const err65 = {instancePath:instancePath+"/records/" + i0+"/publication_date",schemaPath:"#/properties/records/items/properties/publication_date/type",keyword:"type",params:{type: schema11.properties.records.items.properties.publication_date.type},message:"must be string,null"};
if(vErrors === null){
vErrors = [err65];
}
else {
vErrors.push(err65);
}
errors++;
}
}
if(data5.processing_date !== undefined){
let data19 = data5.processing_date;
if((typeof data19 !== "string") && (data19 !== null)){
const err66 = {instancePath:instancePath+"/records/" + i0+"/processing_date",schemaPath:"#/properties/records/items/properties/processing_date/type",keyword:"type",params:{type: schema11.properties.records.items.properties.processing_date.type},message:"must be string,null"};
if(vErrors === null){
vErrors = [err66];
}
else {
vErrors.push(err66);
}
errors++;
}
}
if(data5.processing_version !== undefined){
let data20 = data5.processing_version;
if(typeof data20 === "string"){
if(func3(data20) < 1){
const err67 = {instancePath:instancePath+"/records/" + i0+"/processing_version",schemaPath:"#/properties/records/items/properties/processing_version/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
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
const err68 = {instancePath:instancePath+"/records/" + i0+"/processing_version",schemaPath:"#/properties/records/items/properties/processing_version/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err68];
}
else {
vErrors.push(err68);
}
errors++;
}
}
if(data5.method !== undefined){
let data21 = data5.method;
if(typeof data21 === "string"){
if(func3(data21) < 1){
const err69 = {instancePath:instancePath+"/records/" + i0+"/method",schemaPath:"#/properties/records/items/properties/method/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
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
const err70 = {instancePath:instancePath+"/records/" + i0+"/method",schemaPath:"#/properties/records/items/properties/method/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err70];
}
else {
vErrors.push(err70);
}
errors++;
}
}
if(data5.spatial_resolution !== undefined){
let data22 = data5.spatial_resolution;
if(typeof data22 === "string"){
if(func3(data22) < 1){
const err71 = {instancePath:instancePath+"/records/" + i0+"/spatial_resolution",schemaPath:"#/properties/records/items/properties/spatial_resolution/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
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
const err72 = {instancePath:instancePath+"/records/" + i0+"/spatial_resolution",schemaPath:"#/properties/records/items/properties/spatial_resolution/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err72];
}
else {
vErrors.push(err72);
}
errors++;
}
}
if(data5.spatial_coverage !== undefined){
let data23 = data5.spatial_coverage;
if(typeof data23 === "string"){
if(func3(data23) < 1){
const err73 = {instancePath:instancePath+"/records/" + i0+"/spatial_coverage",schemaPath:"#/properties/records/items/properties/spatial_coverage/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
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
const err74 = {instancePath:instancePath+"/records/" + i0+"/spatial_coverage",schemaPath:"#/properties/records/items/properties/spatial_coverage/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err74];
}
else {
vErrors.push(err74);
}
errors++;
}
}
if(data5.temporal_coverage !== undefined){
let data24 = data5.temporal_coverage;
if(typeof data24 === "string"){
if(func3(data24) < 1){
const err75 = {instancePath:instancePath+"/records/" + i0+"/temporal_coverage",schemaPath:"#/properties/records/items/properties/temporal_coverage/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
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
const err76 = {instancePath:instancePath+"/records/" + i0+"/temporal_coverage",schemaPath:"#/properties/records/items/properties/temporal_coverage/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err76];
}
else {
vErrors.push(err76);
}
errors++;
}
}
if(data5.limitations !== undefined){
let data25 = data5.limitations;
if(Array.isArray(data25)){
if(data25.length < 1){
const err77 = {instancePath:instancePath+"/records/" + i0+"/limitations",schemaPath:"#/properties/records/items/properties/limitations/minItems",keyword:"minItems",params:{limit: 1},message:"must NOT have fewer than 1 items"};
if(vErrors === null){
vErrors = [err77];
}
else {
vErrors.push(err77);
}
errors++;
}
const len1 = data25.length;
for(let i1=0; i1<len1; i1++){
let data26 = data25[i1];
if(typeof data26 === "string"){
if(func3(data26) < 1){
const err78 = {instancePath:instancePath+"/records/" + i0+"/limitations/" + i1,schemaPath:"#/properties/records/items/properties/limitations/items/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err78];
}
else {
vErrors.push(err78);
}
errors++;
}
}
else {
const err79 = {instancePath:instancePath+"/records/" + i0+"/limitations/" + i1,schemaPath:"#/properties/records/items/properties/limitations/items/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err79];
}
else {
vErrors.push(err79);
}
errors++;
}
}
}
else {
const err80 = {instancePath:instancePath+"/records/" + i0+"/limitations",schemaPath:"#/properties/records/items/properties/limitations/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err80];
}
else {
vErrors.push(err80);
}
errors++;
}
}
if(data5.uncertainty !== undefined){
let data27 = data5.uncertainty;
if(typeof data27 === "string"){
if(func3(data27) < 1){
const err81 = {instancePath:instancePath+"/records/" + i0+"/uncertainty",schemaPath:"#/properties/records/items/properties/uncertainty/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
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
const err82 = {instancePath:instancePath+"/records/" + i0+"/uncertainty",schemaPath:"#/properties/records/items/properties/uncertainty/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err82];
}
else {
vErrors.push(err82);
}
errors++;
}
}
if(data5.evidence_type !== undefined){
let data28 = data5.evidence_type;
if(!(((((((data28 === "observed") || (data28 === "derived")) || (data28 === "estimated")) || (data28 === "modelled")) || (data28 === "simulated")) || (data28 === "historical")) || (data28 === "unknown"))){
const err83 = {instancePath:instancePath+"/records/" + i0+"/evidence_type",schemaPath:"#/properties/records/items/properties/evidence_type/enum",keyword:"enum",params:{allowedValues: schema11.properties.records.items.properties.evidence_type.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err83];
}
else {
vErrors.push(err83);
}
errors++;
}
}
if(data5.status !== undefined){
let data29 = data5.status;
if(typeof data29 === "string"){
if(func3(data29) < 1){
const err84 = {instancePath:instancePath+"/records/" + i0+"/status",schemaPath:"#/properties/records/items/properties/status/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err84];
}
else {
vErrors.push(err84);
}
errors++;
}
}
else {
const err85 = {instancePath:instancePath+"/records/" + i0+"/status",schemaPath:"#/properties/records/items/properties/status/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err85];
}
else {
vErrors.push(err85);
}
errors++;
}
}
if(data5.is_fixture !== undefined){
if(typeof data5.is_fixture !== "boolean"){
const err86 = {instancePath:instancePath+"/records/" + i0+"/is_fixture",schemaPath:"#/properties/records/items/properties/is_fixture/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"};
if(vErrors === null){
vErrors = [err86];
}
else {
vErrors.push(err86);
}
errors++;
}
}
if(data5.state !== undefined){
let data31 = data5.state;
if(!(((data31 === "current") || (data31 === "superseded")) || (data31 === "fixture"))){
const err87 = {instancePath:instancePath+"/records/" + i0+"/state",schemaPath:"#/properties/records/items/properties/state/enum",keyword:"enum",params:{allowedValues: schema11.properties.records.items.properties.state.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err87];
}
else {
vErrors.push(err87);
}
errors++;
}
}
if(data5.manifest_path !== undefined){
let data32 = data5.manifest_path;
if(typeof data32 === "string"){
if(!pattern0.test(data32)){
const err88 = {instancePath:instancePath+"/records/" + i0+"/manifest_path",schemaPath:"#/properties/records/items/properties/manifest_path/pattern",keyword:"pattern",params:{pattern: "^/data/.+/manifest\\.json$"},message:"must match pattern \""+"^/data/.+/manifest\\.json$"+"\""};
if(vErrors === null){
vErrors = [err88];
}
else {
vErrors.push(err88);
}
errors++;
}
}
else {
const err89 = {instancePath:instancePath+"/records/" + i0+"/manifest_path",schemaPath:"#/properties/records/items/properties/manifest_path/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err89];
}
else {
vErrors.push(err89);
}
errors++;
}
}
if(data5.manifest_sha256 !== undefined){
let data33 = data5.manifest_sha256;
if(typeof data33 === "string"){
if(!pattern1.test(data33)){
const err90 = {instancePath:instancePath+"/records/" + i0+"/manifest_sha256",schemaPath:"#/properties/records/items/properties/manifest_sha256/pattern",keyword:"pattern",params:{pattern: "^[a-f0-9]{64}$"},message:"must match pattern \""+"^[a-f0-9]{64}$"+"\""};
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
const err91 = {instancePath:instancePath+"/records/" + i0+"/manifest_sha256",schemaPath:"#/properties/records/items/properties/manifest_sha256/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err91];
}
else {
vErrors.push(err91);
}
errors++;
}
}
if(data5.artifacts !== undefined){
let data34 = data5.artifacts;
if(Array.isArray(data34)){
if(data34.length < 1){
const err92 = {instancePath:instancePath+"/records/" + i0+"/artifacts",schemaPath:"#/properties/records/items/properties/artifacts/minItems",keyword:"minItems",params:{limit: 1},message:"must NOT have fewer than 1 items"};
if(vErrors === null){
vErrors = [err92];
}
else {
vErrors.push(err92);
}
errors++;
}
const len2 = data34.length;
for(let i2=0; i2<len2; i2++){
let data35 = data34[i2];
if(data35 && typeof data35 == "object" && !Array.isArray(data35)){
if(data35.path === undefined){
const err93 = {instancePath:instancePath+"/records/" + i0+"/artifacts/" + i2,schemaPath:"#/properties/records/items/properties/artifacts/items/required",keyword:"required",params:{missingProperty: "path"},message:"must have required property '"+"path"+"'"};
if(vErrors === null){
vErrors = [err93];
}
else {
vErrors.push(err93);
}
errors++;
}
if(data35.sha256 === undefined){
const err94 = {instancePath:instancePath+"/records/" + i0+"/artifacts/" + i2,schemaPath:"#/properties/records/items/properties/artifacts/items/required",keyword:"required",params:{missingProperty: "sha256"},message:"must have required property '"+"sha256"+"'"};
if(vErrors === null){
vErrors = [err94];
}
else {
vErrors.push(err94);
}
errors++;
}
if(data35.byte_size === undefined){
const err95 = {instancePath:instancePath+"/records/" + i0+"/artifacts/" + i2,schemaPath:"#/properties/records/items/properties/artifacts/items/required",keyword:"required",params:{missingProperty: "byte_size"},message:"must have required property '"+"byte_size"+"'"};
if(vErrors === null){
vErrors = [err95];
}
else {
vErrors.push(err95);
}
errors++;
}
for(const key2 in data35){
if(!(((key2 === "path") || (key2 === "sha256")) || (key2 === "byte_size"))){
const err96 = {instancePath:instancePath+"/records/" + i0+"/artifacts/" + i2,schemaPath:"#/properties/records/items/properties/artifacts/items/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key2},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err96];
}
else {
vErrors.push(err96);
}
errors++;
}
}
if(data35.path !== undefined){
let data36 = data35.path;
if(typeof data36 === "string"){
if(!pattern2.test(data36)){
const err97 = {instancePath:instancePath+"/records/" + i0+"/artifacts/" + i2+"/path",schemaPath:"#/properties/records/items/properties/artifacts/items/properties/path/pattern",keyword:"pattern",params:{pattern: "^/data/"},message:"must match pattern \""+"^/data/"+"\""};
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
const err98 = {instancePath:instancePath+"/records/" + i0+"/artifacts/" + i2+"/path",schemaPath:"#/properties/records/items/properties/artifacts/items/properties/path/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err98];
}
else {
vErrors.push(err98);
}
errors++;
}
}
if(data35.sha256 !== undefined){
let data37 = data35.sha256;
if(typeof data37 === "string"){
if(!pattern1.test(data37)){
const err99 = {instancePath:instancePath+"/records/" + i0+"/artifacts/" + i2+"/sha256",schemaPath:"#/properties/records/items/properties/artifacts/items/properties/sha256/pattern",keyword:"pattern",params:{pattern: "^[a-f0-9]{64}$"},message:"must match pattern \""+"^[a-f0-9]{64}$"+"\""};
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
const err100 = {instancePath:instancePath+"/records/" + i0+"/artifacts/" + i2+"/sha256",schemaPath:"#/properties/records/items/properties/artifacts/items/properties/sha256/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err100];
}
else {
vErrors.push(err100);
}
errors++;
}
}
if(data35.byte_size !== undefined){
let data38 = data35.byte_size;
if(!(((typeof data38 == "number") && (!(data38 % 1) && !isNaN(data38))) && (isFinite(data38)))){
const err101 = {instancePath:instancePath+"/records/" + i0+"/artifacts/" + i2+"/byte_size",schemaPath:"#/properties/records/items/properties/artifacts/items/properties/byte_size/type",keyword:"type",params:{type: "integer"},message:"must be integer"};
if(vErrors === null){
vErrors = [err101];
}
else {
vErrors.push(err101);
}
errors++;
}
if((typeof data38 == "number") && (isFinite(data38))){
if(data38 < 1 || isNaN(data38)){
const err102 = {instancePath:instancePath+"/records/" + i0+"/artifacts/" + i2+"/byte_size",schemaPath:"#/properties/records/items/properties/artifacts/items/properties/byte_size/minimum",keyword:"minimum",params:{comparison: ">=", limit: 1},message:"must be >= 1"};
if(vErrors === null){
vErrors = [err102];
}
else {
vErrors.push(err102);
}
errors++;
}
}
}
}
else {
const err103 = {instancePath:instancePath+"/records/" + i0+"/artifacts/" + i2,schemaPath:"#/properties/records/items/properties/artifacts/items/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err103];
}
else {
vErrors.push(err103);
}
errors++;
}
}
}
else {
const err104 = {instancePath:instancePath+"/records/" + i0+"/artifacts",schemaPath:"#/properties/records/items/properties/artifacts/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err104];
}
else {
vErrors.push(err104);
}
errors++;
}
}
if(data5.parents !== undefined){
let data39 = data5.parents;
if(Array.isArray(data39)){
const len3 = data39.length;
for(let i3=0; i3<len3; i3++){
let data40 = data39[i3];
if(data40 && typeof data40 == "object" && !Array.isArray(data40)){
if(data40.id === undefined){
const err105 = {instancePath:instancePath+"/records/" + i0+"/parents/" + i3,schemaPath:"#/properties/records/items/properties/parents/items/required",keyword:"required",params:{missingProperty: "id"},message:"must have required property '"+"id"+"'"};
if(vErrors === null){
vErrors = [err105];
}
else {
vErrors.push(err105);
}
errors++;
}
if(data40.version === undefined){
const err106 = {instancePath:instancePath+"/records/" + i0+"/parents/" + i3,schemaPath:"#/properties/records/items/properties/parents/items/required",keyword:"required",params:{missingProperty: "version"},message:"must have required property '"+"version"+"'"};
if(vErrors === null){
vErrors = [err106];
}
else {
vErrors.push(err106);
}
errors++;
}
if(data40.source === undefined){
const err107 = {instancePath:instancePath+"/records/" + i0+"/parents/" + i3,schemaPath:"#/properties/records/items/properties/parents/items/required",keyword:"required",params:{missingProperty: "source"},message:"must have required property '"+"source"+"'"};
if(vErrors === null){
vErrors = [err107];
}
else {
vErrors.push(err107);
}
errors++;
}
if(data40.manifest_path === undefined){
const err108 = {instancePath:instancePath+"/records/" + i0+"/parents/" + i3,schemaPath:"#/properties/records/items/properties/parents/items/required",keyword:"required",params:{missingProperty: "manifest_path"},message:"must have required property '"+"manifest_path"+"'"};
if(vErrors === null){
vErrors = [err108];
}
else {
vErrors.push(err108);
}
errors++;
}
if(data40.sha256 === undefined){
const err109 = {instancePath:instancePath+"/records/" + i0+"/parents/" + i3,schemaPath:"#/properties/records/items/properties/parents/items/required",keyword:"required",params:{missingProperty: "sha256"},message:"must have required property '"+"sha256"+"'"};
if(vErrors === null){
vErrors = [err109];
}
else {
vErrors.push(err109);
}
errors++;
}
for(const key3 in data40){
if(!(((((key3 === "id") || (key3 === "version")) || (key3 === "source")) || (key3 === "manifest_path")) || (key3 === "sha256"))){
const err110 = {instancePath:instancePath+"/records/" + i0+"/parents/" + i3,schemaPath:"#/properties/records/items/properties/parents/items/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key3},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err110];
}
else {
vErrors.push(err110);
}
errors++;
}
}
if(data40.id !== undefined){
let data41 = data40.id;
if(typeof data41 === "string"){
if(func3(data41) < 1){
const err111 = {instancePath:instancePath+"/records/" + i0+"/parents/" + i3+"/id",schemaPath:"#/properties/records/items/properties/parents/items/properties/id/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
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
const err112 = {instancePath:instancePath+"/records/" + i0+"/parents/" + i3+"/id",schemaPath:"#/properties/records/items/properties/parents/items/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err112];
}
else {
vErrors.push(err112);
}
errors++;
}
}
if(data40.version !== undefined){
let data42 = data40.version;
if(typeof data42 === "string"){
if(func3(data42) < 1){
const err113 = {instancePath:instancePath+"/records/" + i0+"/parents/" + i3+"/version",schemaPath:"#/properties/records/items/properties/parents/items/properties/version/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err113];
}
else {
vErrors.push(err113);
}
errors++;
}
}
else {
const err114 = {instancePath:instancePath+"/records/" + i0+"/parents/" + i3+"/version",schemaPath:"#/properties/records/items/properties/parents/items/properties/version/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err114];
}
else {
vErrors.push(err114);
}
errors++;
}
}
if(data40.source !== undefined){
let data43 = data40.source;
if(typeof data43 === "string"){
if(func3(data43) < 1){
const err115 = {instancePath:instancePath+"/records/" + i0+"/parents/" + i3+"/source",schemaPath:"#/properties/records/items/properties/parents/items/properties/source/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err115];
}
else {
vErrors.push(err115);
}
errors++;
}
}
else {
const err116 = {instancePath:instancePath+"/records/" + i0+"/parents/" + i3+"/source",schemaPath:"#/properties/records/items/properties/parents/items/properties/source/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err116];
}
else {
vErrors.push(err116);
}
errors++;
}
}
if(data40.manifest_path !== undefined){
let data44 = data40.manifest_path;
if((typeof data44 !== "string") && (data44 !== null)){
const err117 = {instancePath:instancePath+"/records/" + i0+"/parents/" + i3+"/manifest_path",schemaPath:"#/properties/records/items/properties/parents/items/properties/manifest_path/type",keyword:"type",params:{type: schema11.properties.records.items.properties.parents.items.properties.manifest_path.type},message:"must be string,null"};
if(vErrors === null){
vErrors = [err117];
}
else {
vErrors.push(err117);
}
errors++;
}
}
if(data40.sha256 !== undefined){
let data45 = data40.sha256;
if((typeof data45 !== "string") && (data45 !== null)){
const err118 = {instancePath:instancePath+"/records/" + i0+"/parents/" + i3+"/sha256",schemaPath:"#/properties/records/items/properties/parents/items/properties/sha256/type",keyword:"type",params:{type: schema11.properties.records.items.properties.parents.items.properties.sha256.type},message:"must be string,null"};
if(vErrors === null){
vErrors = [err118];
}
else {
vErrors.push(err118);
}
errors++;
}
if(typeof data45 === "string"){
if(!pattern1.test(data45)){
const err119 = {instancePath:instancePath+"/records/" + i0+"/parents/" + i3+"/sha256",schemaPath:"#/properties/records/items/properties/parents/items/properties/sha256/pattern",keyword:"pattern",params:{pattern: "^[a-f0-9]{64}$"},message:"must match pattern \""+"^[a-f0-9]{64}$"+"\""};
if(vErrors === null){
vErrors = [err119];
}
else {
vErrors.push(err119);
}
errors++;
}
}
}
}
else {
const err120 = {instancePath:instancePath+"/records/" + i0+"/parents/" + i3,schemaPath:"#/properties/records/items/properties/parents/items/type",keyword:"type",params:{type: "object"},message:"must be object"};
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
const err121 = {instancePath:instancePath+"/records/" + i0+"/parents",schemaPath:"#/properties/records/items/properties/parents/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err121];
}
else {
vErrors.push(err121);
}
errors++;
}
}
if(data5.transformations !== undefined){
let data46 = data5.transformations;
if(Array.isArray(data46)){
if(data46.length < 3){
const err122 = {instancePath:instancePath+"/records/" + i0+"/transformations",schemaPath:"#/properties/records/items/properties/transformations/minItems",keyword:"minItems",params:{limit: 3},message:"must NOT have fewer than 3 items"};
if(vErrors === null){
vErrors = [err122];
}
else {
vErrors.push(err122);
}
errors++;
}
const len4 = data46.length;
for(let i4=0; i4<len4; i4++){
let data47 = data46[i4];
if(typeof data47 === "string"){
if(func3(data47) < 1){
const err123 = {instancePath:instancePath+"/records/" + i0+"/transformations/" + i4,schemaPath:"#/properties/records/items/properties/transformations/items/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
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
const err124 = {instancePath:instancePath+"/records/" + i0+"/transformations/" + i4,schemaPath:"#/properties/records/items/properties/transformations/items/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err124];
}
else {
vErrors.push(err124);
}
errors++;
}
}
}
else {
const err125 = {instancePath:instancePath+"/records/" + i0+"/transformations",schemaPath:"#/properties/records/items/properties/transformations/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err125];
}
else {
vErrors.push(err125);
}
errors++;
}
}
if(data5.methodology_href !== undefined){
let data48 = data5.methodology_href;
if(typeof data48 === "string"){
if(!pattern5.test(data48)){
const err126 = {instancePath:instancePath+"/records/" + i0+"/methodology_href",schemaPath:"#/properties/records/items/properties/methodology_href/pattern",keyword:"pattern",params:{pattern: "^/methodology/"},message:"must match pattern \""+"^/methodology/"+"\""};
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
const err127 = {instancePath:instancePath+"/records/" + i0+"/methodology_href",schemaPath:"#/properties/records/items/properties/methodology_href/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err127];
}
else {
vErrors.push(err127);
}
errors++;
}
}
if(data5.source_href !== undefined){
let data49 = data5.source_href;
if(typeof data49 === "string"){
if(!pattern6.test(data49)){
const err128 = {instancePath:instancePath+"/records/" + i0+"/source_href",schemaPath:"#/properties/records/items/properties/source_href/pattern",keyword:"pattern",params:{pattern: "^/sources/"},message:"must match pattern \""+"^/sources/"+"\""};
if(vErrors === null){
vErrors = [err128];
}
else {
vErrors.push(err128);
}
errors++;
}
}
else {
const err129 = {instancePath:instancePath+"/records/" + i0+"/source_href",schemaPath:"#/properties/records/items/properties/source_href/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err129];
}
else {
vErrors.push(err129);
}
errors++;
}
}
if(data5.map_href !== undefined){
let data50 = data5.map_href;
if((typeof data50 !== "string") && (data50 !== null)){
const err130 = {instancePath:instancePath+"/records/" + i0+"/map_href",schemaPath:"#/properties/records/items/properties/map_href/type",keyword:"type",params:{type: schema11.properties.records.items.properties.map_href.type},message:"must be string,null"};
if(vErrors === null){
vErrors = [err130];
}
else {
vErrors.push(err130);
}
errors++;
}
if(typeof data50 === "string"){
if(!pattern7.test(data50)){
const err131 = {instancePath:instancePath+"/records/" + i0+"/map_href",schemaPath:"#/properties/records/items/properties/map_href/pattern",keyword:"pattern",params:{pattern: "^/atlas/"},message:"must match pattern \""+"^/atlas/"+"\""};
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
}
else {
const err132 = {instancePath:instancePath+"/records/" + i0,schemaPath:"#/properties/records/items/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err132];
}
else {
vErrors.push(err132);
}
errors++;
}
}
}
else {
const err133 = {instancePath:instancePath+"/records",schemaPath:"#/properties/records/type",keyword:"type",params:{type: "array"},message:"must be array"};
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
else {
const err134 = {instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err134];
}
else {
vErrors.push(err134);
}
errors++;
}
validate10.errors = vErrors;
return errors === 0;
}

