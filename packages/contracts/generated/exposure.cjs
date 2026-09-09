// Generated from exposure.schema.json; run npm run contracts:generate. Do not edit.
"use strict";
module.exports = validate10;
module.exports.default = validate10;
const schema11 = {"$schema":"http://json-schema.org/draft-07/schema#","$id":"https://himalayan-disaster-atlas.local/schemas/exposure.json","type":"object","additionalProperties":false,"required":["schema_version","kind","result_id","version","name","calculated_at","method","run_sha256","status","evidence_type","input_crs","area_crs","footprint_kind","footprint_area_km2","inputs","population","population_resolution_degree","unique_assets","categories","assets","administration","limitations","artifacts"],"properties":{"schema_version":{"const":"4.0.0"},"kind":{"const":"exposure-result"},"result_id":{"type":"string","minLength":1},"version":{"type":"string","pattern":"^\\d+\\.\\d+\\.\\d+$"},"name":{"type":"string","minLength":1},"calculated_at":{"type":"string","format":"date-time"},"method":{"const":"exposure-overlay/1.0.0"},"run_sha256":{"type":"string","pattern":"^[a-f0-9]{64}$"},"status":{"const":"ESTIMATED"},"evidence_type":{"const":"derived"},"input_crs":{"const":"OGC:CRS84"},"area_crs":{"const":"EPSG:6933"},"footprint_kind":{"enum":["hypothetical_corridor","modelled_scenario","observed_footprint"]},"footprint_area_km2":{"type":"number","minimum":0},"inputs":{"type":"array","items":{"type":"object","additionalProperties":false,"required":["dataset_id","dataset_version","sha256","source","license"],"properties":{"dataset_id":{"type":"string","minLength":1},"dataset_version":{"type":"string","minLength":1},"sha256":{"type":"string","pattern":"^[a-f0-9]{64}$"},"source":{"type":"string","minLength":1},"license":{"type":"string","minLength":1}}},"minItems":1},"population":{"type":"object","additionalProperties":false,"required":["known_population","total_population","valid_area_km2","unknown_area_km2","outside_grid_area_km2","intersected_valid_cells"],"properties":{"known_population":{"type":["number","null"],"minimum":0},"total_population":{"type":["number","null"],"minimum":0},"valid_area_km2":{"type":"number","minimum":0},"unknown_area_km2":{"type":"number","minimum":0},"outside_grid_area_km2":{"type":"number","minimum":0},"intersected_valid_cells":{"type":"integer","minimum":0}}},"population_resolution_degree":{"type":"number","exclusiveMinimum":0},"unique_assets":{"type":"integer","minimum":0},"categories":{"type":"array","items":{"type":"object","additionalProperties":false,"required":["category","count","coverage"],"properties":{"category":{"type":"string","minLength":1},"count":{"type":["integer","null"],"minimum":0},"coverage":{"enum":["mapped_inventory_only","not_available"]}}}},"assets":{"type":"array","items":{"type":"object","additionalProperties":false,"required":["id","name","categories","dataset_ids","admin_pcode","position_basis"],"properties":{"id":{"type":"string","minLength":1},"name":{"type":["string","null"]},"categories":{"type":"array","items":{"type":"string","minLength":1}},"dataset_ids":{"type":"array","items":{"type":"string","minLength":1}},"admin_pcode":{"type":["string","null"]},"position_basis":{"type":"string","minLength":1}}}},"administration":{"type":"array","items":{"type":"object","additionalProperties":false,"required":["pcode","name","area_km2","population","unique_assets"],"properties":{"pcode":{"type":["string","null"]},"name":{"type":"string","minLength":1},"area_km2":{"type":"number","minimum":0},"population":{"type":"object","additionalProperties":false,"required":["known_population","total_population","valid_area_km2","unknown_area_km2","outside_grid_area_km2","intersected_valid_cells"],"properties":{"known_population":{"type":["number","null"],"minimum":0},"total_population":{"type":["number","null"],"minimum":0},"valid_area_km2":{"type":"number","minimum":0},"unknown_area_km2":{"type":"number","minimum":0},"outside_grid_area_km2":{"type":"number","minimum":0},"intersected_valid_cells":{"type":"integer","minimum":0}}},"unique_assets":{"type":"integer","minimum":0}}}},"limitations":{"type":"array","minItems":1,"items":{"type":"string","minLength":1}},"artifacts":{"type":"object","additionalProperties":false,"required":["request","spatial"],"properties":{"request":{"type":"object","additionalProperties":false,"required":["path","sha256","byte_size"],"properties":{"path":{"type":"string","pattern":"^/data/exposure-[a-z0-9-]+/\\d+\\.\\d+\\.\\d+/(request\\.json|spatial\\.geojson\\.gz)$"},"sha256":{"type":"string","pattern":"^[a-f0-9]{64}$"},"byte_size":{"type":"integer","minimum":1,"maximum":2097152}}},"spatial":{"type":"object","additionalProperties":false,"required":["path","sha256","byte_size"],"properties":{"path":{"type":"string","pattern":"^/data/exposure-[a-z0-9-]+/\\d+\\.\\d+\\.\\d+/(request\\.json|spatial\\.geojson\\.gz)$"},"sha256":{"type":"string","pattern":"^[a-f0-9]{64}$"},"byte_size":{"type":"integer","minimum":1,"maximum":2097152}}}}}}};
const func2 = Object.prototype.hasOwnProperty;
const func3 = require("ajv/dist/runtime/ucs2length").default;
const pattern0 = new RegExp("^\\d+\\.\\d+\\.\\d+$", "u");
const pattern1 = new RegExp("^[a-f0-9]{64}$", "u");
const pattern3 = new RegExp("^/data/exposure-[a-z0-9-]+/\\d+\\.\\d+\\.\\d+/(request\\.json|spatial\\.geojson\\.gz)$", "u");
const formats0 = require("ajv-formats/dist/formats").fullFormats["date-time"];

function validate10(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
/*# sourceURL="https://himalayan-disaster-atlas.local/schemas/exposure.json" */;
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
if(data.result_id === undefined){
const err2 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "result_id"},message:"must have required property '"+"result_id"+"'"};
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
if(data.name === undefined){
const err4 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "name"},message:"must have required property '"+"name"+"'"};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
if(data.calculated_at === undefined){
const err5 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "calculated_at"},message:"must have required property '"+"calculated_at"+"'"};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
if(data.method === undefined){
const err6 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "method"},message:"must have required property '"+"method"+"'"};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
if(data.run_sha256 === undefined){
const err7 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "run_sha256"},message:"must have required property '"+"run_sha256"+"'"};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
}
if(data.status === undefined){
const err8 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "status"},message:"must have required property '"+"status"+"'"};
if(vErrors === null){
vErrors = [err8];
}
else {
vErrors.push(err8);
}
errors++;
}
if(data.evidence_type === undefined){
const err9 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "evidence_type"},message:"must have required property '"+"evidence_type"+"'"};
if(vErrors === null){
vErrors = [err9];
}
else {
vErrors.push(err9);
}
errors++;
}
if(data.input_crs === undefined){
const err10 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "input_crs"},message:"must have required property '"+"input_crs"+"'"};
if(vErrors === null){
vErrors = [err10];
}
else {
vErrors.push(err10);
}
errors++;
}
if(data.area_crs === undefined){
const err11 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "area_crs"},message:"must have required property '"+"area_crs"+"'"};
if(vErrors === null){
vErrors = [err11];
}
else {
vErrors.push(err11);
}
errors++;
}
if(data.footprint_kind === undefined){
const err12 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "footprint_kind"},message:"must have required property '"+"footprint_kind"+"'"};
if(vErrors === null){
vErrors = [err12];
}
else {
vErrors.push(err12);
}
errors++;
}
if(data.footprint_area_km2 === undefined){
const err13 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "footprint_area_km2"},message:"must have required property '"+"footprint_area_km2"+"'"};
if(vErrors === null){
vErrors = [err13];
}
else {
vErrors.push(err13);
}
errors++;
}
if(data.inputs === undefined){
const err14 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "inputs"},message:"must have required property '"+"inputs"+"'"};
if(vErrors === null){
vErrors = [err14];
}
else {
vErrors.push(err14);
}
errors++;
}
if(data.population === undefined){
const err15 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "population"},message:"must have required property '"+"population"+"'"};
if(vErrors === null){
vErrors = [err15];
}
else {
vErrors.push(err15);
}
errors++;
}
if(data.population_resolution_degree === undefined){
const err16 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "population_resolution_degree"},message:"must have required property '"+"population_resolution_degree"+"'"};
if(vErrors === null){
vErrors = [err16];
}
else {
vErrors.push(err16);
}
errors++;
}
if(data.unique_assets === undefined){
const err17 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "unique_assets"},message:"must have required property '"+"unique_assets"+"'"};
if(vErrors === null){
vErrors = [err17];
}
else {
vErrors.push(err17);
}
errors++;
}
if(data.categories === undefined){
const err18 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "categories"},message:"must have required property '"+"categories"+"'"};
if(vErrors === null){
vErrors = [err18];
}
else {
vErrors.push(err18);
}
errors++;
}
if(data.assets === undefined){
const err19 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "assets"},message:"must have required property '"+"assets"+"'"};
if(vErrors === null){
vErrors = [err19];
}
else {
vErrors.push(err19);
}
errors++;
}
if(data.administration === undefined){
const err20 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "administration"},message:"must have required property '"+"administration"+"'"};
if(vErrors === null){
vErrors = [err20];
}
else {
vErrors.push(err20);
}
errors++;
}
if(data.limitations === undefined){
const err21 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "limitations"},message:"must have required property '"+"limitations"+"'"};
if(vErrors === null){
vErrors = [err21];
}
else {
vErrors.push(err21);
}
errors++;
}
if(data.artifacts === undefined){
const err22 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "artifacts"},message:"must have required property '"+"artifacts"+"'"};
if(vErrors === null){
vErrors = [err22];
}
else {
vErrors.push(err22);
}
errors++;
}
for(const key0 in data){
if(!(func2.call(schema11.properties, key0))){
const err23 = {instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err23];
}
else {
vErrors.push(err23);
}
errors++;
}
}
if(data.schema_version !== undefined){
if("4.0.0" !== data.schema_version){
const err24 = {instancePath:instancePath+"/schema_version",schemaPath:"#/properties/schema_version/const",keyword:"const",params:{allowedValue: "4.0.0"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err24];
}
else {
vErrors.push(err24);
}
errors++;
}
}
if(data.kind !== undefined){
if("exposure-result" !== data.kind){
const err25 = {instancePath:instancePath+"/kind",schemaPath:"#/properties/kind/const",keyword:"const",params:{allowedValue: "exposure-result"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err25];
}
else {
vErrors.push(err25);
}
errors++;
}
}
if(data.result_id !== undefined){
let data2 = data.result_id;
if(typeof data2 === "string"){
if(func3(data2) < 1){
const err26 = {instancePath:instancePath+"/result_id",schemaPath:"#/properties/result_id/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
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
const err27 = {instancePath:instancePath+"/result_id",schemaPath:"#/properties/result_id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err27];
}
else {
vErrors.push(err27);
}
errors++;
}
}
if(data.version !== undefined){
let data3 = data.version;
if(typeof data3 === "string"){
if(!pattern0.test(data3)){
const err28 = {instancePath:instancePath+"/version",schemaPath:"#/properties/version/pattern",keyword:"pattern",params:{pattern: "^\\d+\\.\\d+\\.\\d+$"},message:"must match pattern \""+"^\\d+\\.\\d+\\.\\d+$"+"\""};
if(vErrors === null){
vErrors = [err28];
}
else {
vErrors.push(err28);
}
errors++;
}
}
else {
const err29 = {instancePath:instancePath+"/version",schemaPath:"#/properties/version/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err29];
}
else {
vErrors.push(err29);
}
errors++;
}
}
if(data.name !== undefined){
let data4 = data.name;
if(typeof data4 === "string"){
if(func3(data4) < 1){
const err30 = {instancePath:instancePath+"/name",schemaPath:"#/properties/name/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
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
const err31 = {instancePath:instancePath+"/name",schemaPath:"#/properties/name/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err31];
}
else {
vErrors.push(err31);
}
errors++;
}
}
if(data.calculated_at !== undefined){
let data5 = data.calculated_at;
if(typeof data5 === "string"){
if(!(formats0.validate(data5))){
const err32 = {instancePath:instancePath+"/calculated_at",schemaPath:"#/properties/calculated_at/format",keyword:"format",params:{format: "date-time"},message:"must match format \""+"date-time"+"\""};
if(vErrors === null){
vErrors = [err32];
}
else {
vErrors.push(err32);
}
errors++;
}
}
else {
const err33 = {instancePath:instancePath+"/calculated_at",schemaPath:"#/properties/calculated_at/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err33];
}
else {
vErrors.push(err33);
}
errors++;
}
}
if(data.method !== undefined){
if("exposure-overlay/1.0.0" !== data.method){
const err34 = {instancePath:instancePath+"/method",schemaPath:"#/properties/method/const",keyword:"const",params:{allowedValue: "exposure-overlay/1.0.0"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err34];
}
else {
vErrors.push(err34);
}
errors++;
}
}
if(data.run_sha256 !== undefined){
let data7 = data.run_sha256;
if(typeof data7 === "string"){
if(!pattern1.test(data7)){
const err35 = {instancePath:instancePath+"/run_sha256",schemaPath:"#/properties/run_sha256/pattern",keyword:"pattern",params:{pattern: "^[a-f0-9]{64}$"},message:"must match pattern \""+"^[a-f0-9]{64}$"+"\""};
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
const err36 = {instancePath:instancePath+"/run_sha256",schemaPath:"#/properties/run_sha256/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err36];
}
else {
vErrors.push(err36);
}
errors++;
}
}
if(data.status !== undefined){
if("ESTIMATED" !== data.status){
const err37 = {instancePath:instancePath+"/status",schemaPath:"#/properties/status/const",keyword:"const",params:{allowedValue: "ESTIMATED"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err37];
}
else {
vErrors.push(err37);
}
errors++;
}
}
if(data.evidence_type !== undefined){
if("derived" !== data.evidence_type){
const err38 = {instancePath:instancePath+"/evidence_type",schemaPath:"#/properties/evidence_type/const",keyword:"const",params:{allowedValue: "derived"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err38];
}
else {
vErrors.push(err38);
}
errors++;
}
}
if(data.input_crs !== undefined){
if("OGC:CRS84" !== data.input_crs){
const err39 = {instancePath:instancePath+"/input_crs",schemaPath:"#/properties/input_crs/const",keyword:"const",params:{allowedValue: "OGC:CRS84"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err39];
}
else {
vErrors.push(err39);
}
errors++;
}
}
if(data.area_crs !== undefined){
if("EPSG:6933" !== data.area_crs){
const err40 = {instancePath:instancePath+"/area_crs",schemaPath:"#/properties/area_crs/const",keyword:"const",params:{allowedValue: "EPSG:6933"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err40];
}
else {
vErrors.push(err40);
}
errors++;
}
}
if(data.footprint_kind !== undefined){
let data12 = data.footprint_kind;
if(!(((data12 === "hypothetical_corridor") || (data12 === "modelled_scenario")) || (data12 === "observed_footprint"))){
const err41 = {instancePath:instancePath+"/footprint_kind",schemaPath:"#/properties/footprint_kind/enum",keyword:"enum",params:{allowedValues: schema11.properties.footprint_kind.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err41];
}
else {
vErrors.push(err41);
}
errors++;
}
}
if(data.footprint_area_km2 !== undefined){
let data13 = data.footprint_area_km2;
if((typeof data13 == "number") && (isFinite(data13))){
if(data13 < 0 || isNaN(data13)){
const err42 = {instancePath:instancePath+"/footprint_area_km2",schemaPath:"#/properties/footprint_area_km2/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
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
const err43 = {instancePath:instancePath+"/footprint_area_km2",schemaPath:"#/properties/footprint_area_km2/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err43];
}
else {
vErrors.push(err43);
}
errors++;
}
}
if(data.inputs !== undefined){
let data14 = data.inputs;
if(Array.isArray(data14)){
if(data14.length < 1){
const err44 = {instancePath:instancePath+"/inputs",schemaPath:"#/properties/inputs/minItems",keyword:"minItems",params:{limit: 1},message:"must NOT have fewer than 1 items"};
if(vErrors === null){
vErrors = [err44];
}
else {
vErrors.push(err44);
}
errors++;
}
const len0 = data14.length;
for(let i0=0; i0<len0; i0++){
let data15 = data14[i0];
if(data15 && typeof data15 == "object" && !Array.isArray(data15)){
if(data15.dataset_id === undefined){
const err45 = {instancePath:instancePath+"/inputs/" + i0,schemaPath:"#/properties/inputs/items/required",keyword:"required",params:{missingProperty: "dataset_id"},message:"must have required property '"+"dataset_id"+"'"};
if(vErrors === null){
vErrors = [err45];
}
else {
vErrors.push(err45);
}
errors++;
}
if(data15.dataset_version === undefined){
const err46 = {instancePath:instancePath+"/inputs/" + i0,schemaPath:"#/properties/inputs/items/required",keyword:"required",params:{missingProperty: "dataset_version"},message:"must have required property '"+"dataset_version"+"'"};
if(vErrors === null){
vErrors = [err46];
}
else {
vErrors.push(err46);
}
errors++;
}
if(data15.sha256 === undefined){
const err47 = {instancePath:instancePath+"/inputs/" + i0,schemaPath:"#/properties/inputs/items/required",keyword:"required",params:{missingProperty: "sha256"},message:"must have required property '"+"sha256"+"'"};
if(vErrors === null){
vErrors = [err47];
}
else {
vErrors.push(err47);
}
errors++;
}
if(data15.source === undefined){
const err48 = {instancePath:instancePath+"/inputs/" + i0,schemaPath:"#/properties/inputs/items/required",keyword:"required",params:{missingProperty: "source"},message:"must have required property '"+"source"+"'"};
if(vErrors === null){
vErrors = [err48];
}
else {
vErrors.push(err48);
}
errors++;
}
if(data15.license === undefined){
const err49 = {instancePath:instancePath+"/inputs/" + i0,schemaPath:"#/properties/inputs/items/required",keyword:"required",params:{missingProperty: "license"},message:"must have required property '"+"license"+"'"};
if(vErrors === null){
vErrors = [err49];
}
else {
vErrors.push(err49);
}
errors++;
}
for(const key1 in data15){
if(!(((((key1 === "dataset_id") || (key1 === "dataset_version")) || (key1 === "sha256")) || (key1 === "source")) || (key1 === "license"))){
const err50 = {instancePath:instancePath+"/inputs/" + i0,schemaPath:"#/properties/inputs/items/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key1},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err50];
}
else {
vErrors.push(err50);
}
errors++;
}
}
if(data15.dataset_id !== undefined){
let data16 = data15.dataset_id;
if(typeof data16 === "string"){
if(func3(data16) < 1){
const err51 = {instancePath:instancePath+"/inputs/" + i0+"/dataset_id",schemaPath:"#/properties/inputs/items/properties/dataset_id/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
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
const err52 = {instancePath:instancePath+"/inputs/" + i0+"/dataset_id",schemaPath:"#/properties/inputs/items/properties/dataset_id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err52];
}
else {
vErrors.push(err52);
}
errors++;
}
}
if(data15.dataset_version !== undefined){
let data17 = data15.dataset_version;
if(typeof data17 === "string"){
if(func3(data17) < 1){
const err53 = {instancePath:instancePath+"/inputs/" + i0+"/dataset_version",schemaPath:"#/properties/inputs/items/properties/dataset_version/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
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
const err54 = {instancePath:instancePath+"/inputs/" + i0+"/dataset_version",schemaPath:"#/properties/inputs/items/properties/dataset_version/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err54];
}
else {
vErrors.push(err54);
}
errors++;
}
}
if(data15.sha256 !== undefined){
let data18 = data15.sha256;
if(typeof data18 === "string"){
if(!pattern1.test(data18)){
const err55 = {instancePath:instancePath+"/inputs/" + i0+"/sha256",schemaPath:"#/properties/inputs/items/properties/sha256/pattern",keyword:"pattern",params:{pattern: "^[a-f0-9]{64}$"},message:"must match pattern \""+"^[a-f0-9]{64}$"+"\""};
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
const err56 = {instancePath:instancePath+"/inputs/" + i0+"/sha256",schemaPath:"#/properties/inputs/items/properties/sha256/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err56];
}
else {
vErrors.push(err56);
}
errors++;
}
}
if(data15.source !== undefined){
let data19 = data15.source;
if(typeof data19 === "string"){
if(func3(data19) < 1){
const err57 = {instancePath:instancePath+"/inputs/" + i0+"/source",schemaPath:"#/properties/inputs/items/properties/source/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
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
const err58 = {instancePath:instancePath+"/inputs/" + i0+"/source",schemaPath:"#/properties/inputs/items/properties/source/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err58];
}
else {
vErrors.push(err58);
}
errors++;
}
}
if(data15.license !== undefined){
let data20 = data15.license;
if(typeof data20 === "string"){
if(func3(data20) < 1){
const err59 = {instancePath:instancePath+"/inputs/" + i0+"/license",schemaPath:"#/properties/inputs/items/properties/license/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
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
const err60 = {instancePath:instancePath+"/inputs/" + i0+"/license",schemaPath:"#/properties/inputs/items/properties/license/type",keyword:"type",params:{type: "string"},message:"must be string"};
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
const err61 = {instancePath:instancePath+"/inputs/" + i0,schemaPath:"#/properties/inputs/items/type",keyword:"type",params:{type: "object"},message:"must be object"};
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
const err62 = {instancePath:instancePath+"/inputs",schemaPath:"#/properties/inputs/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err62];
}
else {
vErrors.push(err62);
}
errors++;
}
}
if(data.population !== undefined){
let data21 = data.population;
if(data21 && typeof data21 == "object" && !Array.isArray(data21)){
if(data21.known_population === undefined){
const err63 = {instancePath:instancePath+"/population",schemaPath:"#/properties/population/required",keyword:"required",params:{missingProperty: "known_population"},message:"must have required property '"+"known_population"+"'"};
if(vErrors === null){
vErrors = [err63];
}
else {
vErrors.push(err63);
}
errors++;
}
if(data21.total_population === undefined){
const err64 = {instancePath:instancePath+"/population",schemaPath:"#/properties/population/required",keyword:"required",params:{missingProperty: "total_population"},message:"must have required property '"+"total_population"+"'"};
if(vErrors === null){
vErrors = [err64];
}
else {
vErrors.push(err64);
}
errors++;
}
if(data21.valid_area_km2 === undefined){
const err65 = {instancePath:instancePath+"/population",schemaPath:"#/properties/population/required",keyword:"required",params:{missingProperty: "valid_area_km2"},message:"must have required property '"+"valid_area_km2"+"'"};
if(vErrors === null){
vErrors = [err65];
}
else {
vErrors.push(err65);
}
errors++;
}
if(data21.unknown_area_km2 === undefined){
const err66 = {instancePath:instancePath+"/population",schemaPath:"#/properties/population/required",keyword:"required",params:{missingProperty: "unknown_area_km2"},message:"must have required property '"+"unknown_area_km2"+"'"};
if(vErrors === null){
vErrors = [err66];
}
else {
vErrors.push(err66);
}
errors++;
}
if(data21.outside_grid_area_km2 === undefined){
const err67 = {instancePath:instancePath+"/population",schemaPath:"#/properties/population/required",keyword:"required",params:{missingProperty: "outside_grid_area_km2"},message:"must have required property '"+"outside_grid_area_km2"+"'"};
if(vErrors === null){
vErrors = [err67];
}
else {
vErrors.push(err67);
}
errors++;
}
if(data21.intersected_valid_cells === undefined){
const err68 = {instancePath:instancePath+"/population",schemaPath:"#/properties/population/required",keyword:"required",params:{missingProperty: "intersected_valid_cells"},message:"must have required property '"+"intersected_valid_cells"+"'"};
if(vErrors === null){
vErrors = [err68];
}
else {
vErrors.push(err68);
}
errors++;
}
for(const key2 in data21){
if(!((((((key2 === "known_population") || (key2 === "total_population")) || (key2 === "valid_area_km2")) || (key2 === "unknown_area_km2")) || (key2 === "outside_grid_area_km2")) || (key2 === "intersected_valid_cells"))){
const err69 = {instancePath:instancePath+"/population",schemaPath:"#/properties/population/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key2},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err69];
}
else {
vErrors.push(err69);
}
errors++;
}
}
if(data21.known_population !== undefined){
let data22 = data21.known_population;
if((!((typeof data22 == "number") && (isFinite(data22)))) && (data22 !== null)){
const err70 = {instancePath:instancePath+"/population/known_population",schemaPath:"#/properties/population/properties/known_population/type",keyword:"type",params:{type: schema11.properties.population.properties.known_population.type},message:"must be number,null"};
if(vErrors === null){
vErrors = [err70];
}
else {
vErrors.push(err70);
}
errors++;
}
if((typeof data22 == "number") && (isFinite(data22))){
if(data22 < 0 || isNaN(data22)){
const err71 = {instancePath:instancePath+"/population/known_population",schemaPath:"#/properties/population/properties/known_population/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
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
if(data21.total_population !== undefined){
let data23 = data21.total_population;
if((!((typeof data23 == "number") && (isFinite(data23)))) && (data23 !== null)){
const err72 = {instancePath:instancePath+"/population/total_population",schemaPath:"#/properties/population/properties/total_population/type",keyword:"type",params:{type: schema11.properties.population.properties.total_population.type},message:"must be number,null"};
if(vErrors === null){
vErrors = [err72];
}
else {
vErrors.push(err72);
}
errors++;
}
if((typeof data23 == "number") && (isFinite(data23))){
if(data23 < 0 || isNaN(data23)){
const err73 = {instancePath:instancePath+"/population/total_population",schemaPath:"#/properties/population/properties/total_population/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
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
if(data21.valid_area_km2 !== undefined){
let data24 = data21.valid_area_km2;
if((typeof data24 == "number") && (isFinite(data24))){
if(data24 < 0 || isNaN(data24)){
const err74 = {instancePath:instancePath+"/population/valid_area_km2",schemaPath:"#/properties/population/properties/valid_area_km2/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
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
const err75 = {instancePath:instancePath+"/population/valid_area_km2",schemaPath:"#/properties/population/properties/valid_area_km2/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err75];
}
else {
vErrors.push(err75);
}
errors++;
}
}
if(data21.unknown_area_km2 !== undefined){
let data25 = data21.unknown_area_km2;
if((typeof data25 == "number") && (isFinite(data25))){
if(data25 < 0 || isNaN(data25)){
const err76 = {instancePath:instancePath+"/population/unknown_area_km2",schemaPath:"#/properties/population/properties/unknown_area_km2/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
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
const err77 = {instancePath:instancePath+"/population/unknown_area_km2",schemaPath:"#/properties/population/properties/unknown_area_km2/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err77];
}
else {
vErrors.push(err77);
}
errors++;
}
}
if(data21.outside_grid_area_km2 !== undefined){
let data26 = data21.outside_grid_area_km2;
if((typeof data26 == "number") && (isFinite(data26))){
if(data26 < 0 || isNaN(data26)){
const err78 = {instancePath:instancePath+"/population/outside_grid_area_km2",schemaPath:"#/properties/population/properties/outside_grid_area_km2/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
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
const err79 = {instancePath:instancePath+"/population/outside_grid_area_km2",schemaPath:"#/properties/population/properties/outside_grid_area_km2/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err79];
}
else {
vErrors.push(err79);
}
errors++;
}
}
if(data21.intersected_valid_cells !== undefined){
let data27 = data21.intersected_valid_cells;
if(!(((typeof data27 == "number") && (!(data27 % 1) && !isNaN(data27))) && (isFinite(data27)))){
const err80 = {instancePath:instancePath+"/population/intersected_valid_cells",schemaPath:"#/properties/population/properties/intersected_valid_cells/type",keyword:"type",params:{type: "integer"},message:"must be integer"};
if(vErrors === null){
vErrors = [err80];
}
else {
vErrors.push(err80);
}
errors++;
}
if((typeof data27 == "number") && (isFinite(data27))){
if(data27 < 0 || isNaN(data27)){
const err81 = {instancePath:instancePath+"/population/intersected_valid_cells",schemaPath:"#/properties/population/properties/intersected_valid_cells/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
if(vErrors === null){
vErrors = [err81];
}
else {
vErrors.push(err81);
}
errors++;
}
}
}
}
else {
const err82 = {instancePath:instancePath+"/population",schemaPath:"#/properties/population/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err82];
}
else {
vErrors.push(err82);
}
errors++;
}
}
if(data.population_resolution_degree !== undefined){
let data28 = data.population_resolution_degree;
if((typeof data28 == "number") && (isFinite(data28))){
if(data28 <= 0 || isNaN(data28)){
const err83 = {instancePath:instancePath+"/population_resolution_degree",schemaPath:"#/properties/population_resolution_degree/exclusiveMinimum",keyword:"exclusiveMinimum",params:{comparison: ">", limit: 0},message:"must be > 0"};
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
const err84 = {instancePath:instancePath+"/population_resolution_degree",schemaPath:"#/properties/population_resolution_degree/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err84];
}
else {
vErrors.push(err84);
}
errors++;
}
}
if(data.unique_assets !== undefined){
let data29 = data.unique_assets;
if(!(((typeof data29 == "number") && (!(data29 % 1) && !isNaN(data29))) && (isFinite(data29)))){
const err85 = {instancePath:instancePath+"/unique_assets",schemaPath:"#/properties/unique_assets/type",keyword:"type",params:{type: "integer"},message:"must be integer"};
if(vErrors === null){
vErrors = [err85];
}
else {
vErrors.push(err85);
}
errors++;
}
if((typeof data29 == "number") && (isFinite(data29))){
if(data29 < 0 || isNaN(data29)){
const err86 = {instancePath:instancePath+"/unique_assets",schemaPath:"#/properties/unique_assets/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
if(vErrors === null){
vErrors = [err86];
}
else {
vErrors.push(err86);
}
errors++;
}
}
}
if(data.categories !== undefined){
let data30 = data.categories;
if(Array.isArray(data30)){
const len1 = data30.length;
for(let i1=0; i1<len1; i1++){
let data31 = data30[i1];
if(data31 && typeof data31 == "object" && !Array.isArray(data31)){
if(data31.category === undefined){
const err87 = {instancePath:instancePath+"/categories/" + i1,schemaPath:"#/properties/categories/items/required",keyword:"required",params:{missingProperty: "category"},message:"must have required property '"+"category"+"'"};
if(vErrors === null){
vErrors = [err87];
}
else {
vErrors.push(err87);
}
errors++;
}
if(data31.count === undefined){
const err88 = {instancePath:instancePath+"/categories/" + i1,schemaPath:"#/properties/categories/items/required",keyword:"required",params:{missingProperty: "count"},message:"must have required property '"+"count"+"'"};
if(vErrors === null){
vErrors = [err88];
}
else {
vErrors.push(err88);
}
errors++;
}
if(data31.coverage === undefined){
const err89 = {instancePath:instancePath+"/categories/" + i1,schemaPath:"#/properties/categories/items/required",keyword:"required",params:{missingProperty: "coverage"},message:"must have required property '"+"coverage"+"'"};
if(vErrors === null){
vErrors = [err89];
}
else {
vErrors.push(err89);
}
errors++;
}
for(const key3 in data31){
if(!(((key3 === "category") || (key3 === "count")) || (key3 === "coverage"))){
const err90 = {instancePath:instancePath+"/categories/" + i1,schemaPath:"#/properties/categories/items/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key3},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err90];
}
else {
vErrors.push(err90);
}
errors++;
}
}
if(data31.category !== undefined){
let data32 = data31.category;
if(typeof data32 === "string"){
if(func3(data32) < 1){
const err91 = {instancePath:instancePath+"/categories/" + i1+"/category",schemaPath:"#/properties/categories/items/properties/category/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
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
const err92 = {instancePath:instancePath+"/categories/" + i1+"/category",schemaPath:"#/properties/categories/items/properties/category/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err92];
}
else {
vErrors.push(err92);
}
errors++;
}
}
if(data31.count !== undefined){
let data33 = data31.count;
if((!(((typeof data33 == "number") && (!(data33 % 1) && !isNaN(data33))) && (isFinite(data33)))) && (data33 !== null)){
const err93 = {instancePath:instancePath+"/categories/" + i1+"/count",schemaPath:"#/properties/categories/items/properties/count/type",keyword:"type",params:{type: schema11.properties.categories.items.properties.count.type},message:"must be integer,null"};
if(vErrors === null){
vErrors = [err93];
}
else {
vErrors.push(err93);
}
errors++;
}
if((typeof data33 == "number") && (isFinite(data33))){
if(data33 < 0 || isNaN(data33)){
const err94 = {instancePath:instancePath+"/categories/" + i1+"/count",schemaPath:"#/properties/categories/items/properties/count/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
if(vErrors === null){
vErrors = [err94];
}
else {
vErrors.push(err94);
}
errors++;
}
}
}
if(data31.coverage !== undefined){
let data34 = data31.coverage;
if(!((data34 === "mapped_inventory_only") || (data34 === "not_available"))){
const err95 = {instancePath:instancePath+"/categories/" + i1+"/coverage",schemaPath:"#/properties/categories/items/properties/coverage/enum",keyword:"enum",params:{allowedValues: schema11.properties.categories.items.properties.coverage.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err95];
}
else {
vErrors.push(err95);
}
errors++;
}
}
}
else {
const err96 = {instancePath:instancePath+"/categories/" + i1,schemaPath:"#/properties/categories/items/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err96];
}
else {
vErrors.push(err96);
}
errors++;
}
}
}
else {
const err97 = {instancePath:instancePath+"/categories",schemaPath:"#/properties/categories/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err97];
}
else {
vErrors.push(err97);
}
errors++;
}
}
if(data.assets !== undefined){
let data35 = data.assets;
if(Array.isArray(data35)){
const len2 = data35.length;
for(let i2=0; i2<len2; i2++){
let data36 = data35[i2];
if(data36 && typeof data36 == "object" && !Array.isArray(data36)){
if(data36.id === undefined){
const err98 = {instancePath:instancePath+"/assets/" + i2,schemaPath:"#/properties/assets/items/required",keyword:"required",params:{missingProperty: "id"},message:"must have required property '"+"id"+"'"};
if(vErrors === null){
vErrors = [err98];
}
else {
vErrors.push(err98);
}
errors++;
}
if(data36.name === undefined){
const err99 = {instancePath:instancePath+"/assets/" + i2,schemaPath:"#/properties/assets/items/required",keyword:"required",params:{missingProperty: "name"},message:"must have required property '"+"name"+"'"};
if(vErrors === null){
vErrors = [err99];
}
else {
vErrors.push(err99);
}
errors++;
}
if(data36.categories === undefined){
const err100 = {instancePath:instancePath+"/assets/" + i2,schemaPath:"#/properties/assets/items/required",keyword:"required",params:{missingProperty: "categories"},message:"must have required property '"+"categories"+"'"};
if(vErrors === null){
vErrors = [err100];
}
else {
vErrors.push(err100);
}
errors++;
}
if(data36.dataset_ids === undefined){
const err101 = {instancePath:instancePath+"/assets/" + i2,schemaPath:"#/properties/assets/items/required",keyword:"required",params:{missingProperty: "dataset_ids"},message:"must have required property '"+"dataset_ids"+"'"};
if(vErrors === null){
vErrors = [err101];
}
else {
vErrors.push(err101);
}
errors++;
}
if(data36.admin_pcode === undefined){
const err102 = {instancePath:instancePath+"/assets/" + i2,schemaPath:"#/properties/assets/items/required",keyword:"required",params:{missingProperty: "admin_pcode"},message:"must have required property '"+"admin_pcode"+"'"};
if(vErrors === null){
vErrors = [err102];
}
else {
vErrors.push(err102);
}
errors++;
}
if(data36.position_basis === undefined){
const err103 = {instancePath:instancePath+"/assets/" + i2,schemaPath:"#/properties/assets/items/required",keyword:"required",params:{missingProperty: "position_basis"},message:"must have required property '"+"position_basis"+"'"};
if(vErrors === null){
vErrors = [err103];
}
else {
vErrors.push(err103);
}
errors++;
}
for(const key4 in data36){
if(!((((((key4 === "id") || (key4 === "name")) || (key4 === "categories")) || (key4 === "dataset_ids")) || (key4 === "admin_pcode")) || (key4 === "position_basis"))){
const err104 = {instancePath:instancePath+"/assets/" + i2,schemaPath:"#/properties/assets/items/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key4},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err104];
}
else {
vErrors.push(err104);
}
errors++;
}
}
if(data36.id !== undefined){
let data37 = data36.id;
if(typeof data37 === "string"){
if(func3(data37) < 1){
const err105 = {instancePath:instancePath+"/assets/" + i2+"/id",schemaPath:"#/properties/assets/items/properties/id/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err105];
}
else {
vErrors.push(err105);
}
errors++;
}
}
else {
const err106 = {instancePath:instancePath+"/assets/" + i2+"/id",schemaPath:"#/properties/assets/items/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err106];
}
else {
vErrors.push(err106);
}
errors++;
}
}
if(data36.name !== undefined){
let data38 = data36.name;
if((typeof data38 !== "string") && (data38 !== null)){
const err107 = {instancePath:instancePath+"/assets/" + i2+"/name",schemaPath:"#/properties/assets/items/properties/name/type",keyword:"type",params:{type: schema11.properties.assets.items.properties.name.type},message:"must be string,null"};
if(vErrors === null){
vErrors = [err107];
}
else {
vErrors.push(err107);
}
errors++;
}
}
if(data36.categories !== undefined){
let data39 = data36.categories;
if(Array.isArray(data39)){
const len3 = data39.length;
for(let i3=0; i3<len3; i3++){
let data40 = data39[i3];
if(typeof data40 === "string"){
if(func3(data40) < 1){
const err108 = {instancePath:instancePath+"/assets/" + i2+"/categories/" + i3,schemaPath:"#/properties/assets/items/properties/categories/items/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
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
const err109 = {instancePath:instancePath+"/assets/" + i2+"/categories/" + i3,schemaPath:"#/properties/assets/items/properties/categories/items/type",keyword:"type",params:{type: "string"},message:"must be string"};
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
const err110 = {instancePath:instancePath+"/assets/" + i2+"/categories",schemaPath:"#/properties/assets/items/properties/categories/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err110];
}
else {
vErrors.push(err110);
}
errors++;
}
}
if(data36.dataset_ids !== undefined){
let data41 = data36.dataset_ids;
if(Array.isArray(data41)){
const len4 = data41.length;
for(let i4=0; i4<len4; i4++){
let data42 = data41[i4];
if(typeof data42 === "string"){
if(func3(data42) < 1){
const err111 = {instancePath:instancePath+"/assets/" + i2+"/dataset_ids/" + i4,schemaPath:"#/properties/assets/items/properties/dataset_ids/items/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
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
const err112 = {instancePath:instancePath+"/assets/" + i2+"/dataset_ids/" + i4,schemaPath:"#/properties/assets/items/properties/dataset_ids/items/type",keyword:"type",params:{type: "string"},message:"must be string"};
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
const err113 = {instancePath:instancePath+"/assets/" + i2+"/dataset_ids",schemaPath:"#/properties/assets/items/properties/dataset_ids/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err113];
}
else {
vErrors.push(err113);
}
errors++;
}
}
if(data36.admin_pcode !== undefined){
let data43 = data36.admin_pcode;
if((typeof data43 !== "string") && (data43 !== null)){
const err114 = {instancePath:instancePath+"/assets/" + i2+"/admin_pcode",schemaPath:"#/properties/assets/items/properties/admin_pcode/type",keyword:"type",params:{type: schema11.properties.assets.items.properties.admin_pcode.type},message:"must be string,null"};
if(vErrors === null){
vErrors = [err114];
}
else {
vErrors.push(err114);
}
errors++;
}
}
if(data36.position_basis !== undefined){
let data44 = data36.position_basis;
if(typeof data44 === "string"){
if(func3(data44) < 1){
const err115 = {instancePath:instancePath+"/assets/" + i2+"/position_basis",schemaPath:"#/properties/assets/items/properties/position_basis/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
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
const err116 = {instancePath:instancePath+"/assets/" + i2+"/position_basis",schemaPath:"#/properties/assets/items/properties/position_basis/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err116];
}
else {
vErrors.push(err116);
}
errors++;
}
}
}
else {
const err117 = {instancePath:instancePath+"/assets/" + i2,schemaPath:"#/properties/assets/items/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err117];
}
else {
vErrors.push(err117);
}
errors++;
}
}
}
else {
const err118 = {instancePath:instancePath+"/assets",schemaPath:"#/properties/assets/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err118];
}
else {
vErrors.push(err118);
}
errors++;
}
}
if(data.administration !== undefined){
let data45 = data.administration;
if(Array.isArray(data45)){
const len5 = data45.length;
for(let i5=0; i5<len5; i5++){
let data46 = data45[i5];
if(data46 && typeof data46 == "object" && !Array.isArray(data46)){
if(data46.pcode === undefined){
const err119 = {instancePath:instancePath+"/administration/" + i5,schemaPath:"#/properties/administration/items/required",keyword:"required",params:{missingProperty: "pcode"},message:"must have required property '"+"pcode"+"'"};
if(vErrors === null){
vErrors = [err119];
}
else {
vErrors.push(err119);
}
errors++;
}
if(data46.name === undefined){
const err120 = {instancePath:instancePath+"/administration/" + i5,schemaPath:"#/properties/administration/items/required",keyword:"required",params:{missingProperty: "name"},message:"must have required property '"+"name"+"'"};
if(vErrors === null){
vErrors = [err120];
}
else {
vErrors.push(err120);
}
errors++;
}
if(data46.area_km2 === undefined){
const err121 = {instancePath:instancePath+"/administration/" + i5,schemaPath:"#/properties/administration/items/required",keyword:"required",params:{missingProperty: "area_km2"},message:"must have required property '"+"area_km2"+"'"};
if(vErrors === null){
vErrors = [err121];
}
else {
vErrors.push(err121);
}
errors++;
}
if(data46.population === undefined){
const err122 = {instancePath:instancePath+"/administration/" + i5,schemaPath:"#/properties/administration/items/required",keyword:"required",params:{missingProperty: "population"},message:"must have required property '"+"population"+"'"};
if(vErrors === null){
vErrors = [err122];
}
else {
vErrors.push(err122);
}
errors++;
}
if(data46.unique_assets === undefined){
const err123 = {instancePath:instancePath+"/administration/" + i5,schemaPath:"#/properties/administration/items/required",keyword:"required",params:{missingProperty: "unique_assets"},message:"must have required property '"+"unique_assets"+"'"};
if(vErrors === null){
vErrors = [err123];
}
else {
vErrors.push(err123);
}
errors++;
}
for(const key5 in data46){
if(!(((((key5 === "pcode") || (key5 === "name")) || (key5 === "area_km2")) || (key5 === "population")) || (key5 === "unique_assets"))){
const err124 = {instancePath:instancePath+"/administration/" + i5,schemaPath:"#/properties/administration/items/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key5},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err124];
}
else {
vErrors.push(err124);
}
errors++;
}
}
if(data46.pcode !== undefined){
let data47 = data46.pcode;
if((typeof data47 !== "string") && (data47 !== null)){
const err125 = {instancePath:instancePath+"/administration/" + i5+"/pcode",schemaPath:"#/properties/administration/items/properties/pcode/type",keyword:"type",params:{type: schema11.properties.administration.items.properties.pcode.type},message:"must be string,null"};
if(vErrors === null){
vErrors = [err125];
}
else {
vErrors.push(err125);
}
errors++;
}
}
if(data46.name !== undefined){
let data48 = data46.name;
if(typeof data48 === "string"){
if(func3(data48) < 1){
const err126 = {instancePath:instancePath+"/administration/" + i5+"/name",schemaPath:"#/properties/administration/items/properties/name/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
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
const err127 = {instancePath:instancePath+"/administration/" + i5+"/name",schemaPath:"#/properties/administration/items/properties/name/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err127];
}
else {
vErrors.push(err127);
}
errors++;
}
}
if(data46.area_km2 !== undefined){
let data49 = data46.area_km2;
if((typeof data49 == "number") && (isFinite(data49))){
if(data49 < 0 || isNaN(data49)){
const err128 = {instancePath:instancePath+"/administration/" + i5+"/area_km2",schemaPath:"#/properties/administration/items/properties/area_km2/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
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
const err129 = {instancePath:instancePath+"/administration/" + i5+"/area_km2",schemaPath:"#/properties/administration/items/properties/area_km2/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err129];
}
else {
vErrors.push(err129);
}
errors++;
}
}
if(data46.population !== undefined){
let data50 = data46.population;
if(data50 && typeof data50 == "object" && !Array.isArray(data50)){
if(data50.known_population === undefined){
const err130 = {instancePath:instancePath+"/administration/" + i5+"/population",schemaPath:"#/properties/administration/items/properties/population/required",keyword:"required",params:{missingProperty: "known_population"},message:"must have required property '"+"known_population"+"'"};
if(vErrors === null){
vErrors = [err130];
}
else {
vErrors.push(err130);
}
errors++;
}
if(data50.total_population === undefined){
const err131 = {instancePath:instancePath+"/administration/" + i5+"/population",schemaPath:"#/properties/administration/items/properties/population/required",keyword:"required",params:{missingProperty: "total_population"},message:"must have required property '"+"total_population"+"'"};
if(vErrors === null){
vErrors = [err131];
}
else {
vErrors.push(err131);
}
errors++;
}
if(data50.valid_area_km2 === undefined){
const err132 = {instancePath:instancePath+"/administration/" + i5+"/population",schemaPath:"#/properties/administration/items/properties/population/required",keyword:"required",params:{missingProperty: "valid_area_km2"},message:"must have required property '"+"valid_area_km2"+"'"};
if(vErrors === null){
vErrors = [err132];
}
else {
vErrors.push(err132);
}
errors++;
}
if(data50.unknown_area_km2 === undefined){
const err133 = {instancePath:instancePath+"/administration/" + i5+"/population",schemaPath:"#/properties/administration/items/properties/population/required",keyword:"required",params:{missingProperty: "unknown_area_km2"},message:"must have required property '"+"unknown_area_km2"+"'"};
if(vErrors === null){
vErrors = [err133];
}
else {
vErrors.push(err133);
}
errors++;
}
if(data50.outside_grid_area_km2 === undefined){
const err134 = {instancePath:instancePath+"/administration/" + i5+"/population",schemaPath:"#/properties/administration/items/properties/population/required",keyword:"required",params:{missingProperty: "outside_grid_area_km2"},message:"must have required property '"+"outside_grid_area_km2"+"'"};
if(vErrors === null){
vErrors = [err134];
}
else {
vErrors.push(err134);
}
errors++;
}
if(data50.intersected_valid_cells === undefined){
const err135 = {instancePath:instancePath+"/administration/" + i5+"/population",schemaPath:"#/properties/administration/items/properties/population/required",keyword:"required",params:{missingProperty: "intersected_valid_cells"},message:"must have required property '"+"intersected_valid_cells"+"'"};
if(vErrors === null){
vErrors = [err135];
}
else {
vErrors.push(err135);
}
errors++;
}
for(const key6 in data50){
if(!((((((key6 === "known_population") || (key6 === "total_population")) || (key6 === "valid_area_km2")) || (key6 === "unknown_area_km2")) || (key6 === "outside_grid_area_km2")) || (key6 === "intersected_valid_cells"))){
const err136 = {instancePath:instancePath+"/administration/" + i5+"/population",schemaPath:"#/properties/administration/items/properties/population/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key6},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err136];
}
else {
vErrors.push(err136);
}
errors++;
}
}
if(data50.known_population !== undefined){
let data51 = data50.known_population;
if((!((typeof data51 == "number") && (isFinite(data51)))) && (data51 !== null)){
const err137 = {instancePath:instancePath+"/administration/" + i5+"/population/known_population",schemaPath:"#/properties/administration/items/properties/population/properties/known_population/type",keyword:"type",params:{type: schema11.properties.administration.items.properties.population.properties.known_population.type},message:"must be number,null"};
if(vErrors === null){
vErrors = [err137];
}
else {
vErrors.push(err137);
}
errors++;
}
if((typeof data51 == "number") && (isFinite(data51))){
if(data51 < 0 || isNaN(data51)){
const err138 = {instancePath:instancePath+"/administration/" + i5+"/population/known_population",schemaPath:"#/properties/administration/items/properties/population/properties/known_population/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
if(vErrors === null){
vErrors = [err138];
}
else {
vErrors.push(err138);
}
errors++;
}
}
}
if(data50.total_population !== undefined){
let data52 = data50.total_population;
if((!((typeof data52 == "number") && (isFinite(data52)))) && (data52 !== null)){
const err139 = {instancePath:instancePath+"/administration/" + i5+"/population/total_population",schemaPath:"#/properties/administration/items/properties/population/properties/total_population/type",keyword:"type",params:{type: schema11.properties.administration.items.properties.population.properties.total_population.type},message:"must be number,null"};
if(vErrors === null){
vErrors = [err139];
}
else {
vErrors.push(err139);
}
errors++;
}
if((typeof data52 == "number") && (isFinite(data52))){
if(data52 < 0 || isNaN(data52)){
const err140 = {instancePath:instancePath+"/administration/" + i5+"/population/total_population",schemaPath:"#/properties/administration/items/properties/population/properties/total_population/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
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
if(data50.valid_area_km2 !== undefined){
let data53 = data50.valid_area_km2;
if((typeof data53 == "number") && (isFinite(data53))){
if(data53 < 0 || isNaN(data53)){
const err141 = {instancePath:instancePath+"/administration/" + i5+"/population/valid_area_km2",schemaPath:"#/properties/administration/items/properties/population/properties/valid_area_km2/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
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
const err142 = {instancePath:instancePath+"/administration/" + i5+"/population/valid_area_km2",schemaPath:"#/properties/administration/items/properties/population/properties/valid_area_km2/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err142];
}
else {
vErrors.push(err142);
}
errors++;
}
}
if(data50.unknown_area_km2 !== undefined){
let data54 = data50.unknown_area_km2;
if((typeof data54 == "number") && (isFinite(data54))){
if(data54 < 0 || isNaN(data54)){
const err143 = {instancePath:instancePath+"/administration/" + i5+"/population/unknown_area_km2",schemaPath:"#/properties/administration/items/properties/population/properties/unknown_area_km2/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
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
const err144 = {instancePath:instancePath+"/administration/" + i5+"/population/unknown_area_km2",schemaPath:"#/properties/administration/items/properties/population/properties/unknown_area_km2/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err144];
}
else {
vErrors.push(err144);
}
errors++;
}
}
if(data50.outside_grid_area_km2 !== undefined){
let data55 = data50.outside_grid_area_km2;
if((typeof data55 == "number") && (isFinite(data55))){
if(data55 < 0 || isNaN(data55)){
const err145 = {instancePath:instancePath+"/administration/" + i5+"/population/outside_grid_area_km2",schemaPath:"#/properties/administration/items/properties/population/properties/outside_grid_area_km2/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
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
const err146 = {instancePath:instancePath+"/administration/" + i5+"/population/outside_grid_area_km2",schemaPath:"#/properties/administration/items/properties/population/properties/outside_grid_area_km2/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err146];
}
else {
vErrors.push(err146);
}
errors++;
}
}
if(data50.intersected_valid_cells !== undefined){
let data56 = data50.intersected_valid_cells;
if(!(((typeof data56 == "number") && (!(data56 % 1) && !isNaN(data56))) && (isFinite(data56)))){
const err147 = {instancePath:instancePath+"/administration/" + i5+"/population/intersected_valid_cells",schemaPath:"#/properties/administration/items/properties/population/properties/intersected_valid_cells/type",keyword:"type",params:{type: "integer"},message:"must be integer"};
if(vErrors === null){
vErrors = [err147];
}
else {
vErrors.push(err147);
}
errors++;
}
if((typeof data56 == "number") && (isFinite(data56))){
if(data56 < 0 || isNaN(data56)){
const err148 = {instancePath:instancePath+"/administration/" + i5+"/population/intersected_valid_cells",schemaPath:"#/properties/administration/items/properties/population/properties/intersected_valid_cells/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
if(vErrors === null){
vErrors = [err148];
}
else {
vErrors.push(err148);
}
errors++;
}
}
}
}
else {
const err149 = {instancePath:instancePath+"/administration/" + i5+"/population",schemaPath:"#/properties/administration/items/properties/population/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err149];
}
else {
vErrors.push(err149);
}
errors++;
}
}
if(data46.unique_assets !== undefined){
let data57 = data46.unique_assets;
if(!(((typeof data57 == "number") && (!(data57 % 1) && !isNaN(data57))) && (isFinite(data57)))){
const err150 = {instancePath:instancePath+"/administration/" + i5+"/unique_assets",schemaPath:"#/properties/administration/items/properties/unique_assets/type",keyword:"type",params:{type: "integer"},message:"must be integer"};
if(vErrors === null){
vErrors = [err150];
}
else {
vErrors.push(err150);
}
errors++;
}
if((typeof data57 == "number") && (isFinite(data57))){
if(data57 < 0 || isNaN(data57)){
const err151 = {instancePath:instancePath+"/administration/" + i5+"/unique_assets",schemaPath:"#/properties/administration/items/properties/unique_assets/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
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
}
else {
const err152 = {instancePath:instancePath+"/administration/" + i5,schemaPath:"#/properties/administration/items/type",keyword:"type",params:{type: "object"},message:"must be object"};
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
const err153 = {instancePath:instancePath+"/administration",schemaPath:"#/properties/administration/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err153];
}
else {
vErrors.push(err153);
}
errors++;
}
}
if(data.limitations !== undefined){
let data58 = data.limitations;
if(Array.isArray(data58)){
if(data58.length < 1){
const err154 = {instancePath:instancePath+"/limitations",schemaPath:"#/properties/limitations/minItems",keyword:"minItems",params:{limit: 1},message:"must NOT have fewer than 1 items"};
if(vErrors === null){
vErrors = [err154];
}
else {
vErrors.push(err154);
}
errors++;
}
const len6 = data58.length;
for(let i6=0; i6<len6; i6++){
let data59 = data58[i6];
if(typeof data59 === "string"){
if(func3(data59) < 1){
const err155 = {instancePath:instancePath+"/limitations/" + i6,schemaPath:"#/properties/limitations/items/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err155];
}
else {
vErrors.push(err155);
}
errors++;
}
}
else {
const err156 = {instancePath:instancePath+"/limitations/" + i6,schemaPath:"#/properties/limitations/items/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err156];
}
else {
vErrors.push(err156);
}
errors++;
}
}
}
else {
const err157 = {instancePath:instancePath+"/limitations",schemaPath:"#/properties/limitations/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err157];
}
else {
vErrors.push(err157);
}
errors++;
}
}
if(data.artifacts !== undefined){
let data60 = data.artifacts;
if(data60 && typeof data60 == "object" && !Array.isArray(data60)){
if(data60.request === undefined){
const err158 = {instancePath:instancePath+"/artifacts",schemaPath:"#/properties/artifacts/required",keyword:"required",params:{missingProperty: "request"},message:"must have required property '"+"request"+"'"};
if(vErrors === null){
vErrors = [err158];
}
else {
vErrors.push(err158);
}
errors++;
}
if(data60.spatial === undefined){
const err159 = {instancePath:instancePath+"/artifacts",schemaPath:"#/properties/artifacts/required",keyword:"required",params:{missingProperty: "spatial"},message:"must have required property '"+"spatial"+"'"};
if(vErrors === null){
vErrors = [err159];
}
else {
vErrors.push(err159);
}
errors++;
}
for(const key7 in data60){
if(!((key7 === "request") || (key7 === "spatial"))){
const err160 = {instancePath:instancePath+"/artifacts",schemaPath:"#/properties/artifacts/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key7},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err160];
}
else {
vErrors.push(err160);
}
errors++;
}
}
if(data60.request !== undefined){
let data61 = data60.request;
if(data61 && typeof data61 == "object" && !Array.isArray(data61)){
if(data61.path === undefined){
const err161 = {instancePath:instancePath+"/artifacts/request",schemaPath:"#/properties/artifacts/properties/request/required",keyword:"required",params:{missingProperty: "path"},message:"must have required property '"+"path"+"'"};
if(vErrors === null){
vErrors = [err161];
}
else {
vErrors.push(err161);
}
errors++;
}
if(data61.sha256 === undefined){
const err162 = {instancePath:instancePath+"/artifacts/request",schemaPath:"#/properties/artifacts/properties/request/required",keyword:"required",params:{missingProperty: "sha256"},message:"must have required property '"+"sha256"+"'"};
if(vErrors === null){
vErrors = [err162];
}
else {
vErrors.push(err162);
}
errors++;
}
if(data61.byte_size === undefined){
const err163 = {instancePath:instancePath+"/artifacts/request",schemaPath:"#/properties/artifacts/properties/request/required",keyword:"required",params:{missingProperty: "byte_size"},message:"must have required property '"+"byte_size"+"'"};
if(vErrors === null){
vErrors = [err163];
}
else {
vErrors.push(err163);
}
errors++;
}
for(const key8 in data61){
if(!(((key8 === "path") || (key8 === "sha256")) || (key8 === "byte_size"))){
const err164 = {instancePath:instancePath+"/artifacts/request",schemaPath:"#/properties/artifacts/properties/request/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key8},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err164];
}
else {
vErrors.push(err164);
}
errors++;
}
}
if(data61.path !== undefined){
let data62 = data61.path;
if(typeof data62 === "string"){
if(!pattern3.test(data62)){
const err165 = {instancePath:instancePath+"/artifacts/request/path",schemaPath:"#/properties/artifacts/properties/request/properties/path/pattern",keyword:"pattern",params:{pattern: "^/data/exposure-[a-z0-9-]+/\\d+\\.\\d+\\.\\d+/(request\\.json|spatial\\.geojson\\.gz)$"},message:"must match pattern \""+"^/data/exposure-[a-z0-9-]+/\\d+\\.\\d+\\.\\d+/(request\\.json|spatial\\.geojson\\.gz)$"+"\""};
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
const err166 = {instancePath:instancePath+"/artifacts/request/path",schemaPath:"#/properties/artifacts/properties/request/properties/path/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err166];
}
else {
vErrors.push(err166);
}
errors++;
}
}
if(data61.sha256 !== undefined){
let data63 = data61.sha256;
if(typeof data63 === "string"){
if(!pattern1.test(data63)){
const err167 = {instancePath:instancePath+"/artifacts/request/sha256",schemaPath:"#/properties/artifacts/properties/request/properties/sha256/pattern",keyword:"pattern",params:{pattern: "^[a-f0-9]{64}$"},message:"must match pattern \""+"^[a-f0-9]{64}$"+"\""};
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
const err168 = {instancePath:instancePath+"/artifacts/request/sha256",schemaPath:"#/properties/artifacts/properties/request/properties/sha256/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err168];
}
else {
vErrors.push(err168);
}
errors++;
}
}
if(data61.byte_size !== undefined){
let data64 = data61.byte_size;
if(!(((typeof data64 == "number") && (!(data64 % 1) && !isNaN(data64))) && (isFinite(data64)))){
const err169 = {instancePath:instancePath+"/artifacts/request/byte_size",schemaPath:"#/properties/artifacts/properties/request/properties/byte_size/type",keyword:"type",params:{type: "integer"},message:"must be integer"};
if(vErrors === null){
vErrors = [err169];
}
else {
vErrors.push(err169);
}
errors++;
}
if((typeof data64 == "number") && (isFinite(data64))){
if(data64 > 2097152 || isNaN(data64)){
const err170 = {instancePath:instancePath+"/artifacts/request/byte_size",schemaPath:"#/properties/artifacts/properties/request/properties/byte_size/maximum",keyword:"maximum",params:{comparison: "<=", limit: 2097152},message:"must be <= 2097152"};
if(vErrors === null){
vErrors = [err170];
}
else {
vErrors.push(err170);
}
errors++;
}
if(data64 < 1 || isNaN(data64)){
const err171 = {instancePath:instancePath+"/artifacts/request/byte_size",schemaPath:"#/properties/artifacts/properties/request/properties/byte_size/minimum",keyword:"minimum",params:{comparison: ">=", limit: 1},message:"must be >= 1"};
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
}
else {
const err172 = {instancePath:instancePath+"/artifacts/request",schemaPath:"#/properties/artifacts/properties/request/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err172];
}
else {
vErrors.push(err172);
}
errors++;
}
}
if(data60.spatial !== undefined){
let data65 = data60.spatial;
if(data65 && typeof data65 == "object" && !Array.isArray(data65)){
if(data65.path === undefined){
const err173 = {instancePath:instancePath+"/artifacts/spatial",schemaPath:"#/properties/artifacts/properties/spatial/required",keyword:"required",params:{missingProperty: "path"},message:"must have required property '"+"path"+"'"};
if(vErrors === null){
vErrors = [err173];
}
else {
vErrors.push(err173);
}
errors++;
}
if(data65.sha256 === undefined){
const err174 = {instancePath:instancePath+"/artifacts/spatial",schemaPath:"#/properties/artifacts/properties/spatial/required",keyword:"required",params:{missingProperty: "sha256"},message:"must have required property '"+"sha256"+"'"};
if(vErrors === null){
vErrors = [err174];
}
else {
vErrors.push(err174);
}
errors++;
}
if(data65.byte_size === undefined){
const err175 = {instancePath:instancePath+"/artifacts/spatial",schemaPath:"#/properties/artifacts/properties/spatial/required",keyword:"required",params:{missingProperty: "byte_size"},message:"must have required property '"+"byte_size"+"'"};
if(vErrors === null){
vErrors = [err175];
}
else {
vErrors.push(err175);
}
errors++;
}
for(const key9 in data65){
if(!(((key9 === "path") || (key9 === "sha256")) || (key9 === "byte_size"))){
const err176 = {instancePath:instancePath+"/artifacts/spatial",schemaPath:"#/properties/artifacts/properties/spatial/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key9},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err176];
}
else {
vErrors.push(err176);
}
errors++;
}
}
if(data65.path !== undefined){
let data66 = data65.path;
if(typeof data66 === "string"){
if(!pattern3.test(data66)){
const err177 = {instancePath:instancePath+"/artifacts/spatial/path",schemaPath:"#/properties/artifacts/properties/spatial/properties/path/pattern",keyword:"pattern",params:{pattern: "^/data/exposure-[a-z0-9-]+/\\d+\\.\\d+\\.\\d+/(request\\.json|spatial\\.geojson\\.gz)$"},message:"must match pattern \""+"^/data/exposure-[a-z0-9-]+/\\d+\\.\\d+\\.\\d+/(request\\.json|spatial\\.geojson\\.gz)$"+"\""};
if(vErrors === null){
vErrors = [err177];
}
else {
vErrors.push(err177);
}
errors++;
}
}
else {
const err178 = {instancePath:instancePath+"/artifacts/spatial/path",schemaPath:"#/properties/artifacts/properties/spatial/properties/path/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err178];
}
else {
vErrors.push(err178);
}
errors++;
}
}
if(data65.sha256 !== undefined){
let data67 = data65.sha256;
if(typeof data67 === "string"){
if(!pattern1.test(data67)){
const err179 = {instancePath:instancePath+"/artifacts/spatial/sha256",schemaPath:"#/properties/artifacts/properties/spatial/properties/sha256/pattern",keyword:"pattern",params:{pattern: "^[a-f0-9]{64}$"},message:"must match pattern \""+"^[a-f0-9]{64}$"+"\""};
if(vErrors === null){
vErrors = [err179];
}
else {
vErrors.push(err179);
}
errors++;
}
}
else {
const err180 = {instancePath:instancePath+"/artifacts/spatial/sha256",schemaPath:"#/properties/artifacts/properties/spatial/properties/sha256/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err180];
}
else {
vErrors.push(err180);
}
errors++;
}
}
if(data65.byte_size !== undefined){
let data68 = data65.byte_size;
if(!(((typeof data68 == "number") && (!(data68 % 1) && !isNaN(data68))) && (isFinite(data68)))){
const err181 = {instancePath:instancePath+"/artifacts/spatial/byte_size",schemaPath:"#/properties/artifacts/properties/spatial/properties/byte_size/type",keyword:"type",params:{type: "integer"},message:"must be integer"};
if(vErrors === null){
vErrors = [err181];
}
else {
vErrors.push(err181);
}
errors++;
}
if((typeof data68 == "number") && (isFinite(data68))){
if(data68 > 2097152 || isNaN(data68)){
const err182 = {instancePath:instancePath+"/artifacts/spatial/byte_size",schemaPath:"#/properties/artifacts/properties/spatial/properties/byte_size/maximum",keyword:"maximum",params:{comparison: "<=", limit: 2097152},message:"must be <= 2097152"};
if(vErrors === null){
vErrors = [err182];
}
else {
vErrors.push(err182);
}
errors++;
}
if(data68 < 1 || isNaN(data68)){
const err183 = {instancePath:instancePath+"/artifacts/spatial/byte_size",schemaPath:"#/properties/artifacts/properties/spatial/properties/byte_size/minimum",keyword:"minimum",params:{comparison: ">=", limit: 1},message:"must be >= 1"};
if(vErrors === null){
vErrors = [err183];
}
else {
vErrors.push(err183);
}
errors++;
}
}
}
}
else {
const err184 = {instancePath:instancePath+"/artifacts/spatial",schemaPath:"#/properties/artifacts/properties/spatial/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err184];
}
else {
vErrors.push(err184);
}
errors++;
}
}
}
else {
const err185 = {instancePath:instancePath+"/artifacts",schemaPath:"#/properties/artifacts/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err185];
}
else {
vErrors.push(err185);
}
errors++;
}
}
}
else {
const err186 = {instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err186];
}
else {
vErrors.push(err186);
}
errors++;
}
validate10.errors = vErrors;
return errors === 0;
}

