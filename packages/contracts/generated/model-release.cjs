// Generated from model-release.schema.json; run npm run contracts:generate. Do not edit.
"use strict";
module.exports = validate10;
module.exports.default = validate10;
const schema11 = {"$schema":"http://json-schema.org/draft-07/schema#","$id":"https://himalayan-disaster-atlas.invalid/schemas/model-release.schema.json","title":"Atlas versioned model/context release (population grids, scenario catalogues, hazard context, gated policies)","type":"object","additionalProperties":false,"required":["schema_version","kind","release_type","metadata","inputs","artifacts","summary"],"properties":{"schema_version":{"const":"1.0.0"},"kind":{"const":"model-release"},"release_type":{"enum":["population-grid","corridor-catalogue","gmpe-model","climate-context","terrain-context","evidence-corpus","gated-policy"]},"metadata":{"type":"object","additionalProperties":false,"required":["schema_version","dataset_id","dataset_name","dataset_version","source","source_url","license","license_url","attribution","observation_date","publication_date","retrieval_date","processing_date","processing_version","method","spatial_resolution","temporal_resolution","spatial_coverage","temporal_coverage","crs","status","evidence_type","is_fixture","limitations","uncertainty","update_frequency","stale_after"],"properties":{"schema_version":{"const":"1.0.0"},"dataset_id":{"$ref":"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/dataset_id"},"dataset_name":{"$ref":"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/dataset_name"},"dataset_version":{"$ref":"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/dataset_version"},"source":{"$ref":"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/source"},"source_url":{"$ref":"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/source_url"},"license":{"$ref":"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/license"},"license_url":{"$ref":"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/license_url"},"attribution":{"$ref":"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/attribution"},"observation_date":{"$ref":"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/observation_date"},"publication_date":{"$ref":"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/publication_date"},"retrieval_date":{"$ref":"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/retrieval_date"},"processing_date":{"$ref":"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/processing_date"},"processing_version":{"$ref":"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/processing_version"},"method":{"$ref":"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/method"},"spatial_resolution":{"$ref":"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/spatial_resolution"},"temporal_resolution":{"$ref":"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/temporal_resolution"},"spatial_coverage":{"$ref":"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/spatial_coverage"},"temporal_coverage":{"$ref":"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/temporal_coverage"},"crs":{"$ref":"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/crs"},"status":{"$ref":"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/status"},"evidence_type":{"$ref":"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/evidence_type"},"is_fixture":{"$ref":"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/is_fixture"},"limitations":{"$ref":"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/limitations"},"uncertainty":{"$ref":"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/uncertainty"},"update_frequency":{"$ref":"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/update_frequency"},"stale_after":{"$ref":"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/stale_after"}}},"inputs":{"type":"array","maxItems":64,"items":{"type":"object","additionalProperties":false,"required":["dataset_id","dataset_version","source","manifest_path","sha256"],"properties":{"dataset_id":{"type":"string","pattern":"^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$"},"dataset_version":{"type":"string","pattern":"^[0-9]+\\.[0-9]+\\.[0-9]+$"},"source":{"type":"string","minLength":1,"maxLength":400},"manifest_path":{"anyOf":[{"type":"string","pattern":"^/data/[a-z0-9-]+/[0-9]+\\.[0-9]+\\.[0-9]+/manifest\\.json$"},{"type":"null"}]},"sha256":{"anyOf":[{"type":"string","pattern":"^[a-f0-9]{64}$"},{"type":"null"}]},"source_url":{"type":"string","pattern":"^https://","maxLength":600}}}},"artifacts":{"type":"object","minProperties":1,"maxProperties":16,"propertyNames":{"pattern":"^[a-z][a-z0-9_]*$"},"additionalProperties":{"type":"object","additionalProperties":false,"required":["path","sha256","byte_size","media_type"],"properties":{"path":{"type":"string","pattern":"^/data/[a-z0-9-]+/[0-9]+\\.[0-9]+\\.[0-9]+/[a-z0-9][a-z0-9._-]*$"},"sha256":{"type":"string","pattern":"^[a-f0-9]{64}$"},"byte_size":{"type":"integer","minimum":1,"maximum":8388608},"media_type":{"enum":["application/json","application/json+gzip","text/plain"]}}}},"summary":{"type":"object"}}};
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
const pattern19 = new RegExp("^/data/[a-z0-9-]+/[0-9]+\\.[0-9]+\\.[0-9]+/manifest\\.json$", "u");
const pattern7 = new RegExp("^[a-f0-9]{64}$", "u");
const pattern22 = new RegExp("^[a-z][a-z0-9_]*$", "u");
const pattern23 = new RegExp("^/data/[a-z0-9-]+/[0-9]+\\.[0-9]+\\.[0-9]+/[a-z0-9][a-z0-9._-]*$", "u");
const formats4 = require("ajv-formats/dist/formats").fullFormats.uri;
const formats0 = require("ajv-formats/dist/formats").fullFormats["date-time"];

function validate10(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
/*# sourceURL="https://himalayan-disaster-atlas.invalid/schemas/model-release.schema.json" */;
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
if(data.release_type === undefined){
const err2 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "release_type"},message:"must have required property '"+"release_type"+"'"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
if(data.metadata === undefined){
const err3 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "metadata"},message:"must have required property '"+"metadata"+"'"};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
if(data.inputs === undefined){
const err4 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "inputs"},message:"must have required property '"+"inputs"+"'"};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
if(data.artifacts === undefined){
const err5 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "artifacts"},message:"must have required property '"+"artifacts"+"'"};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
if(data.summary === undefined){
const err6 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "summary"},message:"must have required property '"+"summary"+"'"};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
for(const key0 in data){
if(!(((((((key0 === "schema_version") || (key0 === "kind")) || (key0 === "release_type")) || (key0 === "metadata")) || (key0 === "inputs")) || (key0 === "artifacts")) || (key0 === "summary"))){
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
if("model-release" !== data.kind){
const err9 = {instancePath:instancePath+"/kind",schemaPath:"#/properties/kind/const",keyword:"const",params:{allowedValue: "model-release"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err9];
}
else {
vErrors.push(err9);
}
errors++;
}
}
if(data.release_type !== undefined){
let data2 = data.release_type;
if(!(((((((data2 === "population-grid") || (data2 === "corridor-catalogue")) || (data2 === "gmpe-model")) || (data2 === "climate-context")) || (data2 === "terrain-context")) || (data2 === "evidence-corpus")) || (data2 === "gated-policy"))){
const err10 = {instancePath:instancePath+"/release_type",schemaPath:"#/properties/release_type/enum",keyword:"enum",params:{allowedValues: schema11.properties.release_type.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err10];
}
else {
vErrors.push(err10);
}
errors++;
}
}
if(data.metadata !== undefined){
let data3 = data.metadata;
if(data3 && typeof data3 == "object" && !Array.isArray(data3)){
if(data3.schema_version === undefined){
const err11 = {instancePath:instancePath+"/metadata",schemaPath:"#/properties/metadata/required",keyword:"required",params:{missingProperty: "schema_version"},message:"must have required property '"+"schema_version"+"'"};
if(vErrors === null){
vErrors = [err11];
}
else {
vErrors.push(err11);
}
errors++;
}
if(data3.dataset_id === undefined){
const err12 = {instancePath:instancePath+"/metadata",schemaPath:"#/properties/metadata/required",keyword:"required",params:{missingProperty: "dataset_id"},message:"must have required property '"+"dataset_id"+"'"};
if(vErrors === null){
vErrors = [err12];
}
else {
vErrors.push(err12);
}
errors++;
}
if(data3.dataset_name === undefined){
const err13 = {instancePath:instancePath+"/metadata",schemaPath:"#/properties/metadata/required",keyword:"required",params:{missingProperty: "dataset_name"},message:"must have required property '"+"dataset_name"+"'"};
if(vErrors === null){
vErrors = [err13];
}
else {
vErrors.push(err13);
}
errors++;
}
if(data3.dataset_version === undefined){
const err14 = {instancePath:instancePath+"/metadata",schemaPath:"#/properties/metadata/required",keyword:"required",params:{missingProperty: "dataset_version"},message:"must have required property '"+"dataset_version"+"'"};
if(vErrors === null){
vErrors = [err14];
}
else {
vErrors.push(err14);
}
errors++;
}
if(data3.source === undefined){
const err15 = {instancePath:instancePath+"/metadata",schemaPath:"#/properties/metadata/required",keyword:"required",params:{missingProperty: "source"},message:"must have required property '"+"source"+"'"};
if(vErrors === null){
vErrors = [err15];
}
else {
vErrors.push(err15);
}
errors++;
}
if(data3.source_url === undefined){
const err16 = {instancePath:instancePath+"/metadata",schemaPath:"#/properties/metadata/required",keyword:"required",params:{missingProperty: "source_url"},message:"must have required property '"+"source_url"+"'"};
if(vErrors === null){
vErrors = [err16];
}
else {
vErrors.push(err16);
}
errors++;
}
if(data3.license === undefined){
const err17 = {instancePath:instancePath+"/metadata",schemaPath:"#/properties/metadata/required",keyword:"required",params:{missingProperty: "license"},message:"must have required property '"+"license"+"'"};
if(vErrors === null){
vErrors = [err17];
}
else {
vErrors.push(err17);
}
errors++;
}
if(data3.license_url === undefined){
const err18 = {instancePath:instancePath+"/metadata",schemaPath:"#/properties/metadata/required",keyword:"required",params:{missingProperty: "license_url"},message:"must have required property '"+"license_url"+"'"};
if(vErrors === null){
vErrors = [err18];
}
else {
vErrors.push(err18);
}
errors++;
}
if(data3.attribution === undefined){
const err19 = {instancePath:instancePath+"/metadata",schemaPath:"#/properties/metadata/required",keyword:"required",params:{missingProperty: "attribution"},message:"must have required property '"+"attribution"+"'"};
if(vErrors === null){
vErrors = [err19];
}
else {
vErrors.push(err19);
}
errors++;
}
if(data3.observation_date === undefined){
const err20 = {instancePath:instancePath+"/metadata",schemaPath:"#/properties/metadata/required",keyword:"required",params:{missingProperty: "observation_date"},message:"must have required property '"+"observation_date"+"'"};
if(vErrors === null){
vErrors = [err20];
}
else {
vErrors.push(err20);
}
errors++;
}
if(data3.publication_date === undefined){
const err21 = {instancePath:instancePath+"/metadata",schemaPath:"#/properties/metadata/required",keyword:"required",params:{missingProperty: "publication_date"},message:"must have required property '"+"publication_date"+"'"};
if(vErrors === null){
vErrors = [err21];
}
else {
vErrors.push(err21);
}
errors++;
}
if(data3.retrieval_date === undefined){
const err22 = {instancePath:instancePath+"/metadata",schemaPath:"#/properties/metadata/required",keyword:"required",params:{missingProperty: "retrieval_date"},message:"must have required property '"+"retrieval_date"+"'"};
if(vErrors === null){
vErrors = [err22];
}
else {
vErrors.push(err22);
}
errors++;
}
if(data3.processing_date === undefined){
const err23 = {instancePath:instancePath+"/metadata",schemaPath:"#/properties/metadata/required",keyword:"required",params:{missingProperty: "processing_date"},message:"must have required property '"+"processing_date"+"'"};
if(vErrors === null){
vErrors = [err23];
}
else {
vErrors.push(err23);
}
errors++;
}
if(data3.processing_version === undefined){
const err24 = {instancePath:instancePath+"/metadata",schemaPath:"#/properties/metadata/required",keyword:"required",params:{missingProperty: "processing_version"},message:"must have required property '"+"processing_version"+"'"};
if(vErrors === null){
vErrors = [err24];
}
else {
vErrors.push(err24);
}
errors++;
}
if(data3.method === undefined){
const err25 = {instancePath:instancePath+"/metadata",schemaPath:"#/properties/metadata/required",keyword:"required",params:{missingProperty: "method"},message:"must have required property '"+"method"+"'"};
if(vErrors === null){
vErrors = [err25];
}
else {
vErrors.push(err25);
}
errors++;
}
if(data3.spatial_resolution === undefined){
const err26 = {instancePath:instancePath+"/metadata",schemaPath:"#/properties/metadata/required",keyword:"required",params:{missingProperty: "spatial_resolution"},message:"must have required property '"+"spatial_resolution"+"'"};
if(vErrors === null){
vErrors = [err26];
}
else {
vErrors.push(err26);
}
errors++;
}
if(data3.temporal_resolution === undefined){
const err27 = {instancePath:instancePath+"/metadata",schemaPath:"#/properties/metadata/required",keyword:"required",params:{missingProperty: "temporal_resolution"},message:"must have required property '"+"temporal_resolution"+"'"};
if(vErrors === null){
vErrors = [err27];
}
else {
vErrors.push(err27);
}
errors++;
}
if(data3.spatial_coverage === undefined){
const err28 = {instancePath:instancePath+"/metadata",schemaPath:"#/properties/metadata/required",keyword:"required",params:{missingProperty: "spatial_coverage"},message:"must have required property '"+"spatial_coverage"+"'"};
if(vErrors === null){
vErrors = [err28];
}
else {
vErrors.push(err28);
}
errors++;
}
if(data3.temporal_coverage === undefined){
const err29 = {instancePath:instancePath+"/metadata",schemaPath:"#/properties/metadata/required",keyword:"required",params:{missingProperty: "temporal_coverage"},message:"must have required property '"+"temporal_coverage"+"'"};
if(vErrors === null){
vErrors = [err29];
}
else {
vErrors.push(err29);
}
errors++;
}
if(data3.crs === undefined){
const err30 = {instancePath:instancePath+"/metadata",schemaPath:"#/properties/metadata/required",keyword:"required",params:{missingProperty: "crs"},message:"must have required property '"+"crs"+"'"};
if(vErrors === null){
vErrors = [err30];
}
else {
vErrors.push(err30);
}
errors++;
}
if(data3.status === undefined){
const err31 = {instancePath:instancePath+"/metadata",schemaPath:"#/properties/metadata/required",keyword:"required",params:{missingProperty: "status"},message:"must have required property '"+"status"+"'"};
if(vErrors === null){
vErrors = [err31];
}
else {
vErrors.push(err31);
}
errors++;
}
if(data3.evidence_type === undefined){
const err32 = {instancePath:instancePath+"/metadata",schemaPath:"#/properties/metadata/required",keyword:"required",params:{missingProperty: "evidence_type"},message:"must have required property '"+"evidence_type"+"'"};
if(vErrors === null){
vErrors = [err32];
}
else {
vErrors.push(err32);
}
errors++;
}
if(data3.is_fixture === undefined){
const err33 = {instancePath:instancePath+"/metadata",schemaPath:"#/properties/metadata/required",keyword:"required",params:{missingProperty: "is_fixture"},message:"must have required property '"+"is_fixture"+"'"};
if(vErrors === null){
vErrors = [err33];
}
else {
vErrors.push(err33);
}
errors++;
}
if(data3.limitations === undefined){
const err34 = {instancePath:instancePath+"/metadata",schemaPath:"#/properties/metadata/required",keyword:"required",params:{missingProperty: "limitations"},message:"must have required property '"+"limitations"+"'"};
if(vErrors === null){
vErrors = [err34];
}
else {
vErrors.push(err34);
}
errors++;
}
if(data3.uncertainty === undefined){
const err35 = {instancePath:instancePath+"/metadata",schemaPath:"#/properties/metadata/required",keyword:"required",params:{missingProperty: "uncertainty"},message:"must have required property '"+"uncertainty"+"'"};
if(vErrors === null){
vErrors = [err35];
}
else {
vErrors.push(err35);
}
errors++;
}
if(data3.update_frequency === undefined){
const err36 = {instancePath:instancePath+"/metadata",schemaPath:"#/properties/metadata/required",keyword:"required",params:{missingProperty: "update_frequency"},message:"must have required property '"+"update_frequency"+"'"};
if(vErrors === null){
vErrors = [err36];
}
else {
vErrors.push(err36);
}
errors++;
}
if(data3.stale_after === undefined){
const err37 = {instancePath:instancePath+"/metadata",schemaPath:"#/properties/metadata/required",keyword:"required",params:{missingProperty: "stale_after"},message:"must have required property '"+"stale_after"+"'"};
if(vErrors === null){
vErrors = [err37];
}
else {
vErrors.push(err37);
}
errors++;
}
for(const key1 in data3){
if(!(func2.call(schema11.properties.metadata.properties, key1))){
const err38 = {instancePath:instancePath+"/metadata",schemaPath:"#/properties/metadata/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key1},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err38];
}
else {
vErrors.push(err38);
}
errors++;
}
}
if(data3.schema_version !== undefined){
if("1.0.0" !== data3.schema_version){
const err39 = {instancePath:instancePath+"/metadata/schema_version",schemaPath:"#/properties/metadata/properties/schema_version/const",keyword:"const",params:{allowedValue: "1.0.0"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err39];
}
else {
vErrors.push(err39);
}
errors++;
}
}
if(data3.dataset_id !== undefined){
let data5 = data3.dataset_id;
if(typeof data5 === "string"){
if(!pattern2.test(data5)){
const err40 = {instancePath:instancePath+"/metadata/dataset_id",schemaPath:"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/dataset_id/pattern",keyword:"pattern",params:{pattern: "^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$"},message:"must match pattern \""+"^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$"+"\""};
if(vErrors === null){
vErrors = [err40];
}
else {
vErrors.push(err40);
}
errors++;
}
}
else {
const err41 = {instancePath:instancePath+"/metadata/dataset_id",schemaPath:"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/dataset_id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err41];
}
else {
vErrors.push(err41);
}
errors++;
}
}
if(data3.dataset_name !== undefined){
let data6 = data3.dataset_name;
if(typeof data6 === "string"){
if(func4(data6) < 1){
const err42 = {instancePath:instancePath+"/metadata/dataset_name",schemaPath:"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/dataset_name/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
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
const err43 = {instancePath:instancePath+"/metadata/dataset_name",schemaPath:"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/dataset_name/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err43];
}
else {
vErrors.push(err43);
}
errors++;
}
}
if(data3.dataset_version !== undefined){
let data7 = data3.dataset_version;
if(typeof data7 === "string"){
if(!pattern3.test(data7)){
const err44 = {instancePath:instancePath+"/metadata/dataset_version",schemaPath:"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/dataset_version/pattern",keyword:"pattern",params:{pattern: "^[0-9]+\\.[0-9]+\\.[0-9]+$"},message:"must match pattern \""+"^[0-9]+\\.[0-9]+\\.[0-9]+$"+"\""};
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
const err45 = {instancePath:instancePath+"/metadata/dataset_version",schemaPath:"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/dataset_version/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err45];
}
else {
vErrors.push(err45);
}
errors++;
}
}
if(data3.source !== undefined){
let data8 = data3.source;
if(typeof data8 === "string"){
if(func4(data8) < 1){
const err46 = {instancePath:instancePath+"/metadata/source",schemaPath:"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/source/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
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
const err47 = {instancePath:instancePath+"/metadata/source",schemaPath:"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/source/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err47];
}
else {
vErrors.push(err47);
}
errors++;
}
}
if(data3.source_url !== undefined){
let data9 = data3.source_url;
const _errs23 = errors;
let valid7 = false;
const _errs24 = errors;
if(typeof data9 === "string"){
if(!pattern0.test(data9)){
const err48 = {instancePath:instancePath+"/metadata/source_url",schemaPath:"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/source_url/anyOf/0/pattern",keyword:"pattern",params:{pattern: "^https://"},message:"must match pattern \""+"^https://"+"\""};
if(vErrors === null){
vErrors = [err48];
}
else {
vErrors.push(err48);
}
errors++;
}
if(!(formats4(data9))){
const err49 = {instancePath:instancePath+"/metadata/source_url",schemaPath:"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/source_url/anyOf/0/format",keyword:"format",params:{format: "uri"},message:"must match format \""+"uri"+"\""};
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
const err50 = {instancePath:instancePath+"/metadata/source_url",schemaPath:"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/source_url/anyOf/0/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err50];
}
else {
vErrors.push(err50);
}
errors++;
}
var _valid0 = _errs24 === errors;
valid7 = valid7 || _valid0;
if(!valid7){
const _errs26 = errors;
if(data9 !== null){
const err51 = {instancePath:instancePath+"/metadata/source_url",schemaPath:"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/source_url/anyOf/1/type",keyword:"type",params:{type: "null"},message:"must be null"};
if(vErrors === null){
vErrors = [err51];
}
else {
vErrors.push(err51);
}
errors++;
}
var _valid0 = _errs26 === errors;
valid7 = valid7 || _valid0;
}
if(!valid7){
const err52 = {instancePath:instancePath+"/metadata/source_url",schemaPath:"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/source_url/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err52];
}
else {
vErrors.push(err52);
}
errors++;
}
else {
errors = _errs23;
if(vErrors !== null){
if(_errs23){
vErrors.length = _errs23;
}
else {
vErrors = null;
}
}
}
}
if(data3.license !== undefined){
let data10 = data3.license;
if(typeof data10 === "string"){
if(func4(data10) < 1){
const err53 = {instancePath:instancePath+"/metadata/license",schemaPath:"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/license/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
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
const err54 = {instancePath:instancePath+"/metadata/license",schemaPath:"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/license/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err54];
}
else {
vErrors.push(err54);
}
errors++;
}
}
if(data3.license_url !== undefined){
let data11 = data3.license_url;
const _errs33 = errors;
let valid10 = false;
const _errs34 = errors;
if(typeof data11 === "string"){
if(!pattern0.test(data11)){
const err55 = {instancePath:instancePath+"/metadata/license_url",schemaPath:"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/license_url/anyOf/0/pattern",keyword:"pattern",params:{pattern: "^https://"},message:"must match pattern \""+"^https://"+"\""};
if(vErrors === null){
vErrors = [err55];
}
else {
vErrors.push(err55);
}
errors++;
}
if(!(formats4(data11))){
const err56 = {instancePath:instancePath+"/metadata/license_url",schemaPath:"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/license_url/anyOf/0/format",keyword:"format",params:{format: "uri"},message:"must match format \""+"uri"+"\""};
if(vErrors === null){
vErrors = [err56];
}
else {
vErrors.push(err56);
}
errors++;
}
}
else {
const err57 = {instancePath:instancePath+"/metadata/license_url",schemaPath:"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/license_url/anyOf/0/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err57];
}
else {
vErrors.push(err57);
}
errors++;
}
var _valid1 = _errs34 === errors;
valid10 = valid10 || _valid1;
if(!valid10){
const _errs36 = errors;
if(data11 !== null){
const err58 = {instancePath:instancePath+"/metadata/license_url",schemaPath:"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/license_url/anyOf/1/type",keyword:"type",params:{type: "null"},message:"must be null"};
if(vErrors === null){
vErrors = [err58];
}
else {
vErrors.push(err58);
}
errors++;
}
var _valid1 = _errs36 === errors;
valid10 = valid10 || _valid1;
}
if(!valid10){
const err59 = {instancePath:instancePath+"/metadata/license_url",schemaPath:"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/license_url/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err59];
}
else {
vErrors.push(err59);
}
errors++;
}
else {
errors = _errs33;
if(vErrors !== null){
if(_errs33){
vErrors.length = _errs33;
}
else {
vErrors = null;
}
}
}
}
if(data3.attribution !== undefined){
let data12 = data3.attribution;
if(typeof data12 === "string"){
if(func4(data12) < 1){
const err60 = {instancePath:instancePath+"/metadata/attribution",schemaPath:"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/attribution/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err60];
}
else {
vErrors.push(err60);
}
errors++;
}
}
else {
const err61 = {instancePath:instancePath+"/metadata/attribution",schemaPath:"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/attribution/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err61];
}
else {
vErrors.push(err61);
}
errors++;
}
}
if(data3.observation_date !== undefined){
let data13 = data3.observation_date;
const _errs43 = errors;
let valid13 = false;
const _errs44 = errors;
if(typeof data13 === "string"){
if(!(formats0.validate(data13))){
const err62 = {instancePath:instancePath+"/metadata/observation_date",schemaPath:"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/observation_date/anyOf/0/format",keyword:"format",params:{format: "date-time"},message:"must match format \""+"date-time"+"\""};
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
const err63 = {instancePath:instancePath+"/metadata/observation_date",schemaPath:"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/observation_date/anyOf/0/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err63];
}
else {
vErrors.push(err63);
}
errors++;
}
var _valid2 = _errs44 === errors;
valid13 = valid13 || _valid2;
if(!valid13){
const _errs46 = errors;
if(data13 !== null){
const err64 = {instancePath:instancePath+"/metadata/observation_date",schemaPath:"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/observation_date/anyOf/1/type",keyword:"type",params:{type: "null"},message:"must be null"};
if(vErrors === null){
vErrors = [err64];
}
else {
vErrors.push(err64);
}
errors++;
}
var _valid2 = _errs46 === errors;
valid13 = valid13 || _valid2;
}
if(!valid13){
const err65 = {instancePath:instancePath+"/metadata/observation_date",schemaPath:"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/observation_date/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err65];
}
else {
vErrors.push(err65);
}
errors++;
}
else {
errors = _errs43;
if(vErrors !== null){
if(_errs43){
vErrors.length = _errs43;
}
else {
vErrors = null;
}
}
}
}
if(data3.publication_date !== undefined){
let data14 = data3.publication_date;
const _errs50 = errors;
let valid15 = false;
const _errs51 = errors;
if(typeof data14 === "string"){
if(!(formats0.validate(data14))){
const err66 = {instancePath:instancePath+"/metadata/publication_date",schemaPath:"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/publication_date/anyOf/0/format",keyword:"format",params:{format: "date-time"},message:"must match format \""+"date-time"+"\""};
if(vErrors === null){
vErrors = [err66];
}
else {
vErrors.push(err66);
}
errors++;
}
}
else {
const err67 = {instancePath:instancePath+"/metadata/publication_date",schemaPath:"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/publication_date/anyOf/0/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err67];
}
else {
vErrors.push(err67);
}
errors++;
}
var _valid3 = _errs51 === errors;
valid15 = valid15 || _valid3;
if(!valid15){
const _errs53 = errors;
if(data14 !== null){
const err68 = {instancePath:instancePath+"/metadata/publication_date",schemaPath:"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/publication_date/anyOf/1/type",keyword:"type",params:{type: "null"},message:"must be null"};
if(vErrors === null){
vErrors = [err68];
}
else {
vErrors.push(err68);
}
errors++;
}
var _valid3 = _errs53 === errors;
valid15 = valid15 || _valid3;
}
if(!valid15){
const err69 = {instancePath:instancePath+"/metadata/publication_date",schemaPath:"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/publication_date/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err69];
}
else {
vErrors.push(err69);
}
errors++;
}
else {
errors = _errs50;
if(vErrors !== null){
if(_errs50){
vErrors.length = _errs50;
}
else {
vErrors = null;
}
}
}
}
if(data3.retrieval_date !== undefined){
let data15 = data3.retrieval_date;
if(typeof data15 === "string"){
if(!(formats0.validate(data15))){
const err70 = {instancePath:instancePath+"/metadata/retrieval_date",schemaPath:"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/retrieval_date/format",keyword:"format",params:{format: "date-time"},message:"must match format \""+"date-time"+"\""};
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
const err71 = {instancePath:instancePath+"/metadata/retrieval_date",schemaPath:"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/retrieval_date/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err71];
}
else {
vErrors.push(err71);
}
errors++;
}
}
if(data3.processing_date !== undefined){
let data16 = data3.processing_date;
if(typeof data16 === "string"){
if(!(formats0.validate(data16))){
const err72 = {instancePath:instancePath+"/metadata/processing_date",schemaPath:"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/processing_date/format",keyword:"format",params:{format: "date-time"},message:"must match format \""+"date-time"+"\""};
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
const err73 = {instancePath:instancePath+"/metadata/processing_date",schemaPath:"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/processing_date/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err73];
}
else {
vErrors.push(err73);
}
errors++;
}
}
if(data3.processing_version !== undefined){
let data17 = data3.processing_version;
if(typeof data17 === "string"){
if(func4(data17) < 1){
const err74 = {instancePath:instancePath+"/metadata/processing_version",schemaPath:"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/processing_version/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
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
const err75 = {instancePath:instancePath+"/metadata/processing_version",schemaPath:"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/processing_version/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err75];
}
else {
vErrors.push(err75);
}
errors++;
}
}
if(data3.method !== undefined){
let data18 = data3.method;
if(typeof data18 === "string"){
if(func4(data18) < 1){
const err76 = {instancePath:instancePath+"/metadata/method",schemaPath:"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/method/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
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
const err77 = {instancePath:instancePath+"/metadata/method",schemaPath:"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/method/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err77];
}
else {
vErrors.push(err77);
}
errors++;
}
}
if(data3.spatial_resolution !== undefined){
let data19 = data3.spatial_resolution;
if(data19 && typeof data19 == "object" && !Array.isArray(data19)){
if(data19.value === undefined){
const err78 = {instancePath:instancePath+"/metadata/spatial_resolution",schemaPath:"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/spatial_resolution/required",keyword:"required",params:{missingProperty: "value"},message:"must have required property '"+"value"+"'"};
if(vErrors === null){
vErrors = [err78];
}
else {
vErrors.push(err78);
}
errors++;
}
if(data19.unit === undefined){
const err79 = {instancePath:instancePath+"/metadata/spatial_resolution",schemaPath:"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/spatial_resolution/required",keyword:"required",params:{missingProperty: "unit"},message:"must have required property '"+"unit"+"'"};
if(vErrors === null){
vErrors = [err79];
}
else {
vErrors.push(err79);
}
errors++;
}
for(const key2 in data19){
if(!((key2 === "value") || (key2 === "unit"))){
const err80 = {instancePath:instancePath+"/metadata/spatial_resolution",schemaPath:"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/spatial_resolution/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key2},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err80];
}
else {
vErrors.push(err80);
}
errors++;
}
}
if(data19.value !== undefined){
let data20 = data19.value;
const _errs72 = errors;
let valid22 = false;
const _errs73 = errors;
if((typeof data20 == "number") && (isFinite(data20))){
if(data20 <= 0 || isNaN(data20)){
const err81 = {instancePath:instancePath+"/metadata/spatial_resolution/value",schemaPath:"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/spatial_resolution/properties/value/anyOf/0/exclusiveMinimum",keyword:"exclusiveMinimum",params:{comparison: ">", limit: 0},message:"must be > 0"};
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
const err82 = {instancePath:instancePath+"/metadata/spatial_resolution/value",schemaPath:"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/spatial_resolution/properties/value/anyOf/0/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err82];
}
else {
vErrors.push(err82);
}
errors++;
}
var _valid4 = _errs73 === errors;
valid22 = valid22 || _valid4;
if(!valid22){
const _errs75 = errors;
if(data20 !== null){
const err83 = {instancePath:instancePath+"/metadata/spatial_resolution/value",schemaPath:"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/spatial_resolution/properties/value/anyOf/1/type",keyword:"type",params:{type: "null"},message:"must be null"};
if(vErrors === null){
vErrors = [err83];
}
else {
vErrors.push(err83);
}
errors++;
}
var _valid4 = _errs75 === errors;
valid22 = valid22 || _valid4;
}
if(!valid22){
const err84 = {instancePath:instancePath+"/metadata/spatial_resolution/value",schemaPath:"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/spatial_resolution/properties/value/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err84];
}
else {
vErrors.push(err84);
}
errors++;
}
else {
errors = _errs72;
if(vErrors !== null){
if(_errs72){
vErrors.length = _errs72;
}
else {
vErrors = null;
}
}
}
}
if(data19.unit !== undefined){
let data21 = data19.unit;
if(!(((data21 === "m") || (data21 === "degree")) || (data21 === null))){
const err85 = {instancePath:instancePath+"/metadata/spatial_resolution/unit",schemaPath:"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/spatial_resolution/properties/unit/enum",keyword:"enum",params:{allowedValues: schema35.properties.unit.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err85];
}
else {
vErrors.push(err85);
}
errors++;
}
}
}
else {
const err86 = {instancePath:instancePath+"/metadata/spatial_resolution",schemaPath:"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/spatial_resolution/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err86];
}
else {
vErrors.push(err86);
}
errors++;
}
}
if(data3.temporal_resolution !== undefined){
let data22 = data3.temporal_resolution;
const _errs80 = errors;
let valid24 = false;
const _errs81 = errors;
if(typeof data22 === "string"){
if(func4(data22) < 1){
const err87 = {instancePath:instancePath+"/metadata/temporal_resolution",schemaPath:"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/temporal_resolution/anyOf/0/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
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
const err88 = {instancePath:instancePath+"/metadata/temporal_resolution",schemaPath:"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/temporal_resolution/anyOf/0/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err88];
}
else {
vErrors.push(err88);
}
errors++;
}
var _valid5 = _errs81 === errors;
valid24 = valid24 || _valid5;
if(!valid24){
const _errs83 = errors;
if(data22 !== null){
const err89 = {instancePath:instancePath+"/metadata/temporal_resolution",schemaPath:"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/temporal_resolution/anyOf/1/type",keyword:"type",params:{type: "null"},message:"must be null"};
if(vErrors === null){
vErrors = [err89];
}
else {
vErrors.push(err89);
}
errors++;
}
var _valid5 = _errs83 === errors;
valid24 = valid24 || _valid5;
}
if(!valid24){
const err90 = {instancePath:instancePath+"/metadata/temporal_resolution",schemaPath:"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/temporal_resolution/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err90];
}
else {
vErrors.push(err90);
}
errors++;
}
else {
errors = _errs80;
if(vErrors !== null){
if(_errs80){
vErrors.length = _errs80;
}
else {
vErrors = null;
}
}
}
}
if(data3.spatial_coverage !== undefined){
let data23 = data3.spatial_coverage;
if(data23 && typeof data23 == "object" && !Array.isArray(data23)){
if(data23.description === undefined){
const err91 = {instancePath:instancePath+"/metadata/spatial_coverage",schemaPath:"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/spatial_coverage/required",keyword:"required",params:{missingProperty: "description"},message:"must have required property '"+"description"+"'"};
if(vErrors === null){
vErrors = [err91];
}
else {
vErrors.push(err91);
}
errors++;
}
if(data23.bbox === undefined){
const err92 = {instancePath:instancePath+"/metadata/spatial_coverage",schemaPath:"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/spatial_coverage/required",keyword:"required",params:{missingProperty: "bbox"},message:"must have required property '"+"bbox"+"'"};
if(vErrors === null){
vErrors = [err92];
}
else {
vErrors.push(err92);
}
errors++;
}
for(const key3 in data23){
if(!((key3 === "description") || (key3 === "bbox"))){
const err93 = {instancePath:instancePath+"/metadata/spatial_coverage",schemaPath:"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/spatial_coverage/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key3},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err93];
}
else {
vErrors.push(err93);
}
errors++;
}
}
if(data23.description !== undefined){
let data24 = data23.description;
if(typeof data24 === "string"){
if(func4(data24) < 1){
const err94 = {instancePath:instancePath+"/metadata/spatial_coverage/description",schemaPath:"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/spatial_coverage/properties/description/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
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
const err95 = {instancePath:instancePath+"/metadata/spatial_coverage/description",schemaPath:"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/spatial_coverage/properties/description/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err95];
}
else {
vErrors.push(err95);
}
errors++;
}
}
if(data23.bbox !== undefined){
let data25 = data23.bbox;
if(Array.isArray(data25)){
if(data25.length > 4){
const err96 = {instancePath:instancePath+"/metadata/spatial_coverage/bbox",schemaPath:"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/spatial_coverage/properties/bbox/maxItems",keyword:"maxItems",params:{limit: 4},message:"must NOT have more than 4 items"};
if(vErrors === null){
vErrors = [err96];
}
else {
vErrors.push(err96);
}
errors++;
}
if(data25.length < 4){
const err97 = {instancePath:instancePath+"/metadata/spatial_coverage/bbox",schemaPath:"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/spatial_coverage/properties/bbox/minItems",keyword:"minItems",params:{limit: 4},message:"must NOT have fewer than 4 items"};
if(vErrors === null){
vErrors = [err97];
}
else {
vErrors.push(err97);
}
errors++;
}
const len0 = data25.length;
for(let i0=0; i0<len0; i0++){
let data26 = data25[i0];
if(!((typeof data26 == "number") && (isFinite(data26)))){
const err98 = {instancePath:instancePath+"/metadata/spatial_coverage/bbox/" + i0,schemaPath:"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/spatial_coverage/properties/bbox/items/type",keyword:"type",params:{type: "number"},message:"must be number"};
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
const err99 = {instancePath:instancePath+"/metadata/spatial_coverage/bbox",schemaPath:"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/spatial_coverage/properties/bbox/type",keyword:"type",params:{type: "array"},message:"must be array"};
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
const err100 = {instancePath:instancePath+"/metadata/spatial_coverage",schemaPath:"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/spatial_coverage/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err100];
}
else {
vErrors.push(err100);
}
errors++;
}
}
if(data3.temporal_coverage !== undefined){
let data27 = data3.temporal_coverage;
if(data27 && typeof data27 == "object" && !Array.isArray(data27)){
if(data27.start === undefined){
const err101 = {instancePath:instancePath+"/metadata/temporal_coverage",schemaPath:"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/temporal_coverage/required",keyword:"required",params:{missingProperty: "start"},message:"must have required property '"+"start"+"'"};
if(vErrors === null){
vErrors = [err101];
}
else {
vErrors.push(err101);
}
errors++;
}
if(data27.end === undefined){
const err102 = {instancePath:instancePath+"/metadata/temporal_coverage",schemaPath:"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/temporal_coverage/required",keyword:"required",params:{missingProperty: "end"},message:"must have required property '"+"end"+"'"};
if(vErrors === null){
vErrors = [err102];
}
else {
vErrors.push(err102);
}
errors++;
}
for(const key4 in data27){
if(!((key4 === "start") || (key4 === "end"))){
const err103 = {instancePath:instancePath+"/metadata/temporal_coverage",schemaPath:"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/temporal_coverage/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key4},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err103];
}
else {
vErrors.push(err103);
}
errors++;
}
}
if(data27.start !== undefined){
let data28 = data27.start;
const _errs100 = errors;
let valid31 = false;
const _errs101 = errors;
if(typeof data28 === "string"){
if(!(formats0.validate(data28))){
const err104 = {instancePath:instancePath+"/metadata/temporal_coverage/start",schemaPath:"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/temporal_coverage/properties/start/anyOf/0/format",keyword:"format",params:{format: "date-time"},message:"must match format \""+"date-time"+"\""};
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
const err105 = {instancePath:instancePath+"/metadata/temporal_coverage/start",schemaPath:"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/temporal_coverage/properties/start/anyOf/0/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err105];
}
else {
vErrors.push(err105);
}
errors++;
}
var _valid6 = _errs101 === errors;
valid31 = valid31 || _valid6;
if(!valid31){
const _errs103 = errors;
if(data28 !== null){
const err106 = {instancePath:instancePath+"/metadata/temporal_coverage/start",schemaPath:"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/temporal_coverage/properties/start/anyOf/1/type",keyword:"type",params:{type: "null"},message:"must be null"};
if(vErrors === null){
vErrors = [err106];
}
else {
vErrors.push(err106);
}
errors++;
}
var _valid6 = _errs103 === errors;
valid31 = valid31 || _valid6;
}
if(!valid31){
const err107 = {instancePath:instancePath+"/metadata/temporal_coverage/start",schemaPath:"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/temporal_coverage/properties/start/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err107];
}
else {
vErrors.push(err107);
}
errors++;
}
else {
errors = _errs100;
if(vErrors !== null){
if(_errs100){
vErrors.length = _errs100;
}
else {
vErrors = null;
}
}
}
}
if(data27.end !== undefined){
let data29 = data27.end;
const _errs106 = errors;
let valid32 = false;
const _errs107 = errors;
if(typeof data29 === "string"){
if(!(formats0.validate(data29))){
const err108 = {instancePath:instancePath+"/metadata/temporal_coverage/end",schemaPath:"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/temporal_coverage/properties/end/anyOf/0/format",keyword:"format",params:{format: "date-time"},message:"must match format \""+"date-time"+"\""};
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
const err109 = {instancePath:instancePath+"/metadata/temporal_coverage/end",schemaPath:"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/temporal_coverage/properties/end/anyOf/0/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err109];
}
else {
vErrors.push(err109);
}
errors++;
}
var _valid7 = _errs107 === errors;
valid32 = valid32 || _valid7;
if(!valid32){
const _errs109 = errors;
if(data29 !== null){
const err110 = {instancePath:instancePath+"/metadata/temporal_coverage/end",schemaPath:"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/temporal_coverage/properties/end/anyOf/1/type",keyword:"type",params:{type: "null"},message:"must be null"};
if(vErrors === null){
vErrors = [err110];
}
else {
vErrors.push(err110);
}
errors++;
}
var _valid7 = _errs109 === errors;
valid32 = valid32 || _valid7;
}
if(!valid32){
const err111 = {instancePath:instancePath+"/metadata/temporal_coverage/end",schemaPath:"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/temporal_coverage/properties/end/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err111];
}
else {
vErrors.push(err111);
}
errors++;
}
else {
errors = _errs106;
if(vErrors !== null){
if(_errs106){
vErrors.length = _errs106;
}
else {
vErrors = null;
}
}
}
}
}
else {
const err112 = {instancePath:instancePath+"/metadata/temporal_coverage",schemaPath:"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/temporal_coverage/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err112];
}
else {
vErrors.push(err112);
}
errors++;
}
}
if(data3.crs !== undefined){
if("OGC:CRS84" !== data3.crs){
const err113 = {instancePath:instancePath+"/metadata/crs",schemaPath:"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/crs/const",keyword:"const",params:{allowedValue: "OGC:CRS84"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err113];
}
else {
vErrors.push(err113);
}
errors++;
}
}
if(data3.status !== undefined){
let data31 = data3.status;
if(!(((((((data31 === "VERIFIED_SOURCE") || (data31 === "SATELLITE_DERIVED")) || (data31 === "ATLAS_DERIVED")) || (data31 === "ESTIMATED")) || (data31 === "MODELLED")) || (data31 === "HISTORICAL")) || (data31 === "UNKNOWN"))){
const err114 = {instancePath:instancePath+"/metadata/status",schemaPath:"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/status/enum",keyword:"enum",params:{allowedValues: schema40.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err114];
}
else {
vErrors.push(err114);
}
errors++;
}
}
if(data3.evidence_type !== undefined){
let data32 = data3.evidence_type;
if(!((((((data32 === "observed") || (data32 === "derived")) || (data32 === "estimated")) || (data32 === "modelled")) || (data32 === "historical")) || (data32 === "unknown"))){
const err115 = {instancePath:instancePath+"/metadata/evidence_type",schemaPath:"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/evidence_type/enum",keyword:"enum",params:{allowedValues: schema41.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err115];
}
else {
vErrors.push(err115);
}
errors++;
}
}
if(data3.is_fixture !== undefined){
if(typeof data3.is_fixture !== "boolean"){
const err116 = {instancePath:instancePath+"/metadata/is_fixture",schemaPath:"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/is_fixture/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"};
if(vErrors === null){
vErrors = [err116];
}
else {
vErrors.push(err116);
}
errors++;
}
}
if(data3.limitations !== undefined){
let data34 = data3.limitations;
if(Array.isArray(data34)){
if(data34.length < 1){
const err117 = {instancePath:instancePath+"/metadata/limitations",schemaPath:"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/limitations/minItems",keyword:"minItems",params:{limit: 1},message:"must NOT have fewer than 1 items"};
if(vErrors === null){
vErrors = [err117];
}
else {
vErrors.push(err117);
}
errors++;
}
const len1 = data34.length;
for(let i1=0; i1<len1; i1++){
let data35 = data34[i1];
if(typeof data35 === "string"){
if(func4(data35) < 1){
const err118 = {instancePath:instancePath+"/metadata/limitations/" + i1,schemaPath:"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/limitations/items/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
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
const err119 = {instancePath:instancePath+"/metadata/limitations/" + i1,schemaPath:"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/limitations/items/type",keyword:"type",params:{type: "string"},message:"must be string"};
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
else {
const err120 = {instancePath:instancePath+"/metadata/limitations",schemaPath:"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/limitations/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err120];
}
else {
vErrors.push(err120);
}
errors++;
}
}
if(data3.uncertainty !== undefined){
let data36 = data3.uncertainty;
if(typeof data36 === "string"){
if(func4(data36) < 1){
const err121 = {instancePath:instancePath+"/metadata/uncertainty",schemaPath:"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/uncertainty/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
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
const err122 = {instancePath:instancePath+"/metadata/uncertainty",schemaPath:"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/uncertainty/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err122];
}
else {
vErrors.push(err122);
}
errors++;
}
}
if(data3.update_frequency !== undefined){
let data37 = data3.update_frequency;
if(!(((data37 === "static") || (data37 === "periodic")) || (data37 === "operational"))){
const err123 = {instancePath:instancePath+"/metadata/update_frequency",schemaPath:"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/update_frequency/enum",keyword:"enum",params:{allowedValues: schema45.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err123];
}
else {
vErrors.push(err123);
}
errors++;
}
}
if(data3.stale_after !== undefined){
let data38 = data3.stale_after;
const _errs132 = errors;
let valid43 = false;
const _errs133 = errors;
if(typeof data38 === "string"){
if(!(formats0.validate(data38))){
const err124 = {instancePath:instancePath+"/metadata/stale_after",schemaPath:"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/stale_after/anyOf/0/format",keyword:"format",params:{format: "date-time"},message:"must match format \""+"date-time"+"\""};
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
const err125 = {instancePath:instancePath+"/metadata/stale_after",schemaPath:"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/stale_after/anyOf/0/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err125];
}
else {
vErrors.push(err125);
}
errors++;
}
var _valid8 = _errs133 === errors;
valid43 = valid43 || _valid8;
if(!valid43){
const _errs135 = errors;
if(data38 !== null){
const err126 = {instancePath:instancePath+"/metadata/stale_after",schemaPath:"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/stale_after/anyOf/1/type",keyword:"type",params:{type: "null"},message:"must be null"};
if(vErrors === null){
vErrors = [err126];
}
else {
vErrors.push(err126);
}
errors++;
}
var _valid8 = _errs135 === errors;
valid43 = valid43 || _valid8;
}
if(!valid43){
const err127 = {instancePath:instancePath+"/metadata/stale_after",schemaPath:"https://himalayan-disaster-atlas.invalid/schemas/dataset.schema.json#/definitions/metadata/properties/stale_after/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err127];
}
else {
vErrors.push(err127);
}
errors++;
}
else {
errors = _errs132;
if(vErrors !== null){
if(_errs132){
vErrors.length = _errs132;
}
else {
vErrors = null;
}
}
}
}
}
else {
const err128 = {instancePath:instancePath+"/metadata",schemaPath:"#/properties/metadata/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err128];
}
else {
vErrors.push(err128);
}
errors++;
}
}
if(data.inputs !== undefined){
let data39 = data.inputs;
if(Array.isArray(data39)){
if(data39.length > 64){
const err129 = {instancePath:instancePath+"/inputs",schemaPath:"#/properties/inputs/maxItems",keyword:"maxItems",params:{limit: 64},message:"must NOT have more than 64 items"};
if(vErrors === null){
vErrors = [err129];
}
else {
vErrors.push(err129);
}
errors++;
}
const len2 = data39.length;
for(let i2=0; i2<len2; i2++){
let data40 = data39[i2];
if(data40 && typeof data40 == "object" && !Array.isArray(data40)){
if(data40.dataset_id === undefined){
const err130 = {instancePath:instancePath+"/inputs/" + i2,schemaPath:"#/properties/inputs/items/required",keyword:"required",params:{missingProperty: "dataset_id"},message:"must have required property '"+"dataset_id"+"'"};
if(vErrors === null){
vErrors = [err130];
}
else {
vErrors.push(err130);
}
errors++;
}
if(data40.dataset_version === undefined){
const err131 = {instancePath:instancePath+"/inputs/" + i2,schemaPath:"#/properties/inputs/items/required",keyword:"required",params:{missingProperty: "dataset_version"},message:"must have required property '"+"dataset_version"+"'"};
if(vErrors === null){
vErrors = [err131];
}
else {
vErrors.push(err131);
}
errors++;
}
if(data40.source === undefined){
const err132 = {instancePath:instancePath+"/inputs/" + i2,schemaPath:"#/properties/inputs/items/required",keyword:"required",params:{missingProperty: "source"},message:"must have required property '"+"source"+"'"};
if(vErrors === null){
vErrors = [err132];
}
else {
vErrors.push(err132);
}
errors++;
}
if(data40.manifest_path === undefined){
const err133 = {instancePath:instancePath+"/inputs/" + i2,schemaPath:"#/properties/inputs/items/required",keyword:"required",params:{missingProperty: "manifest_path"},message:"must have required property '"+"manifest_path"+"'"};
if(vErrors === null){
vErrors = [err133];
}
else {
vErrors.push(err133);
}
errors++;
}
if(data40.sha256 === undefined){
const err134 = {instancePath:instancePath+"/inputs/" + i2,schemaPath:"#/properties/inputs/items/required",keyword:"required",params:{missingProperty: "sha256"},message:"must have required property '"+"sha256"+"'"};
if(vErrors === null){
vErrors = [err134];
}
else {
vErrors.push(err134);
}
errors++;
}
for(const key5 in data40){
if(!((((((key5 === "dataset_id") || (key5 === "dataset_version")) || (key5 === "source")) || (key5 === "manifest_path")) || (key5 === "sha256")) || (key5 === "source_url"))){
const err135 = {instancePath:instancePath+"/inputs/" + i2,schemaPath:"#/properties/inputs/items/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key5},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err135];
}
else {
vErrors.push(err135);
}
errors++;
}
}
if(data40.dataset_id !== undefined){
let data41 = data40.dataset_id;
if(typeof data41 === "string"){
if(!pattern2.test(data41)){
const err136 = {instancePath:instancePath+"/inputs/" + i2+"/dataset_id",schemaPath:"#/properties/inputs/items/properties/dataset_id/pattern",keyword:"pattern",params:{pattern: "^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$"},message:"must match pattern \""+"^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$"+"\""};
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
const err137 = {instancePath:instancePath+"/inputs/" + i2+"/dataset_id",schemaPath:"#/properties/inputs/items/properties/dataset_id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err137];
}
else {
vErrors.push(err137);
}
errors++;
}
}
if(data40.dataset_version !== undefined){
let data42 = data40.dataset_version;
if(typeof data42 === "string"){
if(!pattern3.test(data42)){
const err138 = {instancePath:instancePath+"/inputs/" + i2+"/dataset_version",schemaPath:"#/properties/inputs/items/properties/dataset_version/pattern",keyword:"pattern",params:{pattern: "^[0-9]+\\.[0-9]+\\.[0-9]+$"},message:"must match pattern \""+"^[0-9]+\\.[0-9]+\\.[0-9]+$"+"\""};
if(vErrors === null){
vErrors = [err138];
}
else {
vErrors.push(err138);
}
errors++;
}
}
else {
const err139 = {instancePath:instancePath+"/inputs/" + i2+"/dataset_version",schemaPath:"#/properties/inputs/items/properties/dataset_version/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err139];
}
else {
vErrors.push(err139);
}
errors++;
}
}
if(data40.source !== undefined){
let data43 = data40.source;
if(typeof data43 === "string"){
if(func4(data43) > 400){
const err140 = {instancePath:instancePath+"/inputs/" + i2+"/source",schemaPath:"#/properties/inputs/items/properties/source/maxLength",keyword:"maxLength",params:{limit: 400},message:"must NOT have more than 400 characters"};
if(vErrors === null){
vErrors = [err140];
}
else {
vErrors.push(err140);
}
errors++;
}
if(func4(data43) < 1){
const err141 = {instancePath:instancePath+"/inputs/" + i2+"/source",schemaPath:"#/properties/inputs/items/properties/source/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
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
const err142 = {instancePath:instancePath+"/inputs/" + i2+"/source",schemaPath:"#/properties/inputs/items/properties/source/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err142];
}
else {
vErrors.push(err142);
}
errors++;
}
}
if(data40.manifest_path !== undefined){
let data44 = data40.manifest_path;
const _errs149 = errors;
let valid47 = false;
const _errs150 = errors;
if(typeof data44 === "string"){
if(!pattern19.test(data44)){
const err143 = {instancePath:instancePath+"/inputs/" + i2+"/manifest_path",schemaPath:"#/properties/inputs/items/properties/manifest_path/anyOf/0/pattern",keyword:"pattern",params:{pattern: "^/data/[a-z0-9-]+/[0-9]+\\.[0-9]+\\.[0-9]+/manifest\\.json$"},message:"must match pattern \""+"^/data/[a-z0-9-]+/[0-9]+\\.[0-9]+\\.[0-9]+/manifest\\.json$"+"\""};
if(vErrors === null){
vErrors = [err143];
}
else {
vErrors.push(err143);
}
errors++;
}
}
else {
const err144 = {instancePath:instancePath+"/inputs/" + i2+"/manifest_path",schemaPath:"#/properties/inputs/items/properties/manifest_path/anyOf/0/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err144];
}
else {
vErrors.push(err144);
}
errors++;
}
var _valid9 = _errs150 === errors;
valid47 = valid47 || _valid9;
if(!valid47){
const _errs152 = errors;
if(data44 !== null){
const err145 = {instancePath:instancePath+"/inputs/" + i2+"/manifest_path",schemaPath:"#/properties/inputs/items/properties/manifest_path/anyOf/1/type",keyword:"type",params:{type: "null"},message:"must be null"};
if(vErrors === null){
vErrors = [err145];
}
else {
vErrors.push(err145);
}
errors++;
}
var _valid9 = _errs152 === errors;
valid47 = valid47 || _valid9;
}
if(!valid47){
const err146 = {instancePath:instancePath+"/inputs/" + i2+"/manifest_path",schemaPath:"#/properties/inputs/items/properties/manifest_path/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err146];
}
else {
vErrors.push(err146);
}
errors++;
}
else {
errors = _errs149;
if(vErrors !== null){
if(_errs149){
vErrors.length = _errs149;
}
else {
vErrors = null;
}
}
}
}
if(data40.sha256 !== undefined){
let data45 = data40.sha256;
const _errs155 = errors;
let valid48 = false;
const _errs156 = errors;
if(typeof data45 === "string"){
if(!pattern7.test(data45)){
const err147 = {instancePath:instancePath+"/inputs/" + i2+"/sha256",schemaPath:"#/properties/inputs/items/properties/sha256/anyOf/0/pattern",keyword:"pattern",params:{pattern: "^[a-f0-9]{64}$"},message:"must match pattern \""+"^[a-f0-9]{64}$"+"\""};
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
const err148 = {instancePath:instancePath+"/inputs/" + i2+"/sha256",schemaPath:"#/properties/inputs/items/properties/sha256/anyOf/0/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err148];
}
else {
vErrors.push(err148);
}
errors++;
}
var _valid10 = _errs156 === errors;
valid48 = valid48 || _valid10;
if(!valid48){
const _errs158 = errors;
if(data45 !== null){
const err149 = {instancePath:instancePath+"/inputs/" + i2+"/sha256",schemaPath:"#/properties/inputs/items/properties/sha256/anyOf/1/type",keyword:"type",params:{type: "null"},message:"must be null"};
if(vErrors === null){
vErrors = [err149];
}
else {
vErrors.push(err149);
}
errors++;
}
var _valid10 = _errs158 === errors;
valid48 = valid48 || _valid10;
}
if(!valid48){
const err150 = {instancePath:instancePath+"/inputs/" + i2+"/sha256",schemaPath:"#/properties/inputs/items/properties/sha256/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err150];
}
else {
vErrors.push(err150);
}
errors++;
}
else {
errors = _errs155;
if(vErrors !== null){
if(_errs155){
vErrors.length = _errs155;
}
else {
vErrors = null;
}
}
}
}
if(data40.source_url !== undefined){
let data46 = data40.source_url;
if(typeof data46 === "string"){
if(func4(data46) > 600){
const err151 = {instancePath:instancePath+"/inputs/" + i2+"/source_url",schemaPath:"#/properties/inputs/items/properties/source_url/maxLength",keyword:"maxLength",params:{limit: 600},message:"must NOT have more than 600 characters"};
if(vErrors === null){
vErrors = [err151];
}
else {
vErrors.push(err151);
}
errors++;
}
if(!pattern0.test(data46)){
const err152 = {instancePath:instancePath+"/inputs/" + i2+"/source_url",schemaPath:"#/properties/inputs/items/properties/source_url/pattern",keyword:"pattern",params:{pattern: "^https://"},message:"must match pattern \""+"^https://"+"\""};
if(vErrors === null){
vErrors = [err152];
}
else {
vErrors.push(err152);
}
errors++;
}
}
else {
const err153 = {instancePath:instancePath+"/inputs/" + i2+"/source_url",schemaPath:"#/properties/inputs/items/properties/source_url/type",keyword:"type",params:{type: "string"},message:"must be string"};
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
else {
const err154 = {instancePath:instancePath+"/inputs/" + i2,schemaPath:"#/properties/inputs/items/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err154];
}
else {
vErrors.push(err154);
}
errors++;
}
}
}
else {
const err155 = {instancePath:instancePath+"/inputs",schemaPath:"#/properties/inputs/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err155];
}
else {
vErrors.push(err155);
}
errors++;
}
}
if(data.artifacts !== undefined){
let data47 = data.artifacts;
if(data47 && typeof data47 == "object" && !Array.isArray(data47)){
if(Object.keys(data47).length > 16){
const err156 = {instancePath:instancePath+"/artifacts",schemaPath:"#/properties/artifacts/maxProperties",keyword:"maxProperties",params:{limit: 16},message:"must NOT have more than 16 properties"};
if(vErrors === null){
vErrors = [err156];
}
else {
vErrors.push(err156);
}
errors++;
}
if(Object.keys(data47).length < 1){
const err157 = {instancePath:instancePath+"/artifacts",schemaPath:"#/properties/artifacts/minProperties",keyword:"minProperties",params:{limit: 1},message:"must NOT have fewer than 1 properties"};
if(vErrors === null){
vErrors = [err157];
}
else {
vErrors.push(err157);
}
errors++;
}
for(const key6 in data47){
const _errs164 = errors;
if(typeof key6 === "string"){
if(!pattern22.test(key6)){
const err158 = {instancePath:instancePath+"/artifacts",schemaPath:"#/properties/artifacts/propertyNames/pattern",keyword:"pattern",params:{pattern: "^[a-z][a-z0-9_]*$"},message:"must match pattern \""+"^[a-z][a-z0-9_]*$"+"\"",propertyName:key6};
if(vErrors === null){
vErrors = [err158];
}
else {
vErrors.push(err158);
}
errors++;
}
}
var valid49 = _errs164 === errors;
if(!valid49){
const err159 = {instancePath:instancePath+"/artifacts",schemaPath:"#/properties/artifacts/propertyNames",keyword:"propertyNames",params:{propertyName: key6},message:"property name must be valid"};
if(vErrors === null){
vErrors = [err159];
}
else {
vErrors.push(err159);
}
errors++;
}
}
for(const key7 in data47){
let data48 = data47[key7];
if(data48 && typeof data48 == "object" && !Array.isArray(data48)){
if(data48.path === undefined){
const err160 = {instancePath:instancePath+"/artifacts/" + key7.replace(/~/g, "~0").replace(/\//g, "~1"),schemaPath:"#/properties/artifacts/additionalProperties/required",keyword:"required",params:{missingProperty: "path"},message:"must have required property '"+"path"+"'"};
if(vErrors === null){
vErrors = [err160];
}
else {
vErrors.push(err160);
}
errors++;
}
if(data48.sha256 === undefined){
const err161 = {instancePath:instancePath+"/artifacts/" + key7.replace(/~/g, "~0").replace(/\//g, "~1"),schemaPath:"#/properties/artifacts/additionalProperties/required",keyword:"required",params:{missingProperty: "sha256"},message:"must have required property '"+"sha256"+"'"};
if(vErrors === null){
vErrors = [err161];
}
else {
vErrors.push(err161);
}
errors++;
}
if(data48.byte_size === undefined){
const err162 = {instancePath:instancePath+"/artifacts/" + key7.replace(/~/g, "~0").replace(/\//g, "~1"),schemaPath:"#/properties/artifacts/additionalProperties/required",keyword:"required",params:{missingProperty: "byte_size"},message:"must have required property '"+"byte_size"+"'"};
if(vErrors === null){
vErrors = [err162];
}
else {
vErrors.push(err162);
}
errors++;
}
if(data48.media_type === undefined){
const err163 = {instancePath:instancePath+"/artifacts/" + key7.replace(/~/g, "~0").replace(/\//g, "~1"),schemaPath:"#/properties/artifacts/additionalProperties/required",keyword:"required",params:{missingProperty: "media_type"},message:"must have required property '"+"media_type"+"'"};
if(vErrors === null){
vErrors = [err163];
}
else {
vErrors.push(err163);
}
errors++;
}
for(const key8 in data48){
if(!((((key8 === "path") || (key8 === "sha256")) || (key8 === "byte_size")) || (key8 === "media_type"))){
const err164 = {instancePath:instancePath+"/artifacts/" + key7.replace(/~/g, "~0").replace(/\//g, "~1"),schemaPath:"#/properties/artifacts/additionalProperties/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key8},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err164];
}
else {
vErrors.push(err164);
}
errors++;
}
}
if(data48.path !== undefined){
let data49 = data48.path;
if(typeof data49 === "string"){
if(!pattern23.test(data49)){
const err165 = {instancePath:instancePath+"/artifacts/" + key7.replace(/~/g, "~0").replace(/\//g, "~1")+"/path",schemaPath:"#/properties/artifacts/additionalProperties/properties/path/pattern",keyword:"pattern",params:{pattern: "^/data/[a-z0-9-]+/[0-9]+\\.[0-9]+\\.[0-9]+/[a-z0-9][a-z0-9._-]*$"},message:"must match pattern \""+"^/data/[a-z0-9-]+/[0-9]+\\.[0-9]+\\.[0-9]+/[a-z0-9][a-z0-9._-]*$"+"\""};
if(vErrors === null){
vErrors = [err165];
}
else {
vErrors.push(err165);
}
errors++;
}
}
else {
const err166 = {instancePath:instancePath+"/artifacts/" + key7.replace(/~/g, "~0").replace(/\//g, "~1")+"/path",schemaPath:"#/properties/artifacts/additionalProperties/properties/path/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err166];
}
else {
vErrors.push(err166);
}
errors++;
}
}
if(data48.sha256 !== undefined){
let data50 = data48.sha256;
if(typeof data50 === "string"){
if(!pattern7.test(data50)){
const err167 = {instancePath:instancePath+"/artifacts/" + key7.replace(/~/g, "~0").replace(/\//g, "~1")+"/sha256",schemaPath:"#/properties/artifacts/additionalProperties/properties/sha256/pattern",keyword:"pattern",params:{pattern: "^[a-f0-9]{64}$"},message:"must match pattern \""+"^[a-f0-9]{64}$"+"\""};
if(vErrors === null){
vErrors = [err167];
}
else {
vErrors.push(err167);
}
errors++;
}
}
else {
const err168 = {instancePath:instancePath+"/artifacts/" + key7.replace(/~/g, "~0").replace(/\//g, "~1")+"/sha256",schemaPath:"#/properties/artifacts/additionalProperties/properties/sha256/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err168];
}
else {
vErrors.push(err168);
}
errors++;
}
}
if(data48.byte_size !== undefined){
let data51 = data48.byte_size;
if(!(((typeof data51 == "number") && (!(data51 % 1) && !isNaN(data51))) && (isFinite(data51)))){
const err169 = {instancePath:instancePath+"/artifacts/" + key7.replace(/~/g, "~0").replace(/\//g, "~1")+"/byte_size",schemaPath:"#/properties/artifacts/additionalProperties/properties/byte_size/type",keyword:"type",params:{type: "integer"},message:"must be integer"};
if(vErrors === null){
vErrors = [err169];
}
else {
vErrors.push(err169);
}
errors++;
}
if((typeof data51 == "number") && (isFinite(data51))){
if(data51 > 8388608 || isNaN(data51)){
const err170 = {instancePath:instancePath+"/artifacts/" + key7.replace(/~/g, "~0").replace(/\//g, "~1")+"/byte_size",schemaPath:"#/properties/artifacts/additionalProperties/properties/byte_size/maximum",keyword:"maximum",params:{comparison: "<=", limit: 8388608},message:"must be <= 8388608"};
if(vErrors === null){
vErrors = [err170];
}
else {
vErrors.push(err170);
}
errors++;
}
if(data51 < 1 || isNaN(data51)){
const err171 = {instancePath:instancePath+"/artifacts/" + key7.replace(/~/g, "~0").replace(/\//g, "~1")+"/byte_size",schemaPath:"#/properties/artifacts/additionalProperties/properties/byte_size/minimum",keyword:"minimum",params:{comparison: ">=", limit: 1},message:"must be >= 1"};
if(vErrors === null){
vErrors = [err171];
}
else {
vErrors.push(err171);
}
errors++;
}
}
}
if(data48.media_type !== undefined){
let data52 = data48.media_type;
if(!(((data52 === "application/json") || (data52 === "application/json+gzip")) || (data52 === "text/plain"))){
const err172 = {instancePath:instancePath+"/artifacts/" + key7.replace(/~/g, "~0").replace(/\//g, "~1")+"/media_type",schemaPath:"#/properties/artifacts/additionalProperties/properties/media_type/enum",keyword:"enum",params:{allowedValues: schema11.properties.artifacts.additionalProperties.properties.media_type.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err172];
}
else {
vErrors.push(err172);
}
errors++;
}
}
}
else {
const err173 = {instancePath:instancePath+"/artifacts/" + key7.replace(/~/g, "~0").replace(/\//g, "~1"),schemaPath:"#/properties/artifacts/additionalProperties/type",keyword:"type",params:{type: "object"},message:"must be object"};
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
const err174 = {instancePath:instancePath+"/artifacts",schemaPath:"#/properties/artifacts/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err174];
}
else {
vErrors.push(err174);
}
errors++;
}
}
if(data.summary !== undefined){
let data53 = data.summary;
if(!(data53 && typeof data53 == "object" && !Array.isArray(data53))){
const err175 = {instancePath:instancePath+"/summary",schemaPath:"#/properties/summary/type",keyword:"type",params:{type: "object"},message:"must be object"};
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
const err176 = {instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err176];
}
else {
vErrors.push(err176);
}
errors++;
}
validate10.errors = vErrors;
return errors === 0;
}

