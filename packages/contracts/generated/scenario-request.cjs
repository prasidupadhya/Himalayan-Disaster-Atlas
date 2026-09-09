// Generated from scenario-request.schema.json; run npm run contracts:generate. Do not edit.
"use strict";
module.exports = validate10;
module.exports.default = validate10;
const schema11 = {"type":"object","additionalProperties":false,"required":["schema_version","kind","id","version","is_fixture","model","simulation_level","source_reach_id","inputs","assumptions","parameters"],"properties":{"schema_version":{"const":"1.0.0"},"kind":{"const":"scenario-definition"},"id":{"type":"string","pattern":"^scenario-[a-z0-9-]+$"},"version":{"const":"1.0.0"},"is_fixture":{"type":"boolean"},"model":{"type":"object","additionalProperties":false,"required":["id","version"],"properties":{"id":{"enum":["network-path","constant-celerity-pulse"]},"version":{"const":"1.0.0"}}},"simulation_level":{"enum":[1,2]},"source_reach_id":{"type":"string","pattern":"^[1-9][0-9]*$"},"inputs":{"type":"array","minItems":1,"maxItems":8,"items":{"type":"object","additionalProperties":false,"required":["dataset_id","dataset_version","sha256","processing_version","source","license","observation_date"],"properties":{"dataset_id":{"type":"string","minLength":1},"dataset_version":{"type":"string","minLength":1},"sha256":{"type":"string","pattern":"^[a-f0-9]{64}$"},"processing_version":{"type":"string","minLength":1},"source":{"type":"string","minLength":1},"license":{"type":"string","minLength":1},"observation_date":{"type":["string","null"],"format":"date-time"}}}},"assumptions":{"type":"array","uniqueItems":true,"items":{"type":"string","minLength":1}},"parameters":{"oneOf":[{"type":"object","additionalProperties":false,"required":[],"properties":{}},{"type":"object","additionalProperties":false,"required":["celerity","release_volume","release_duration"],"properties":{"celerity":{"type":"object","additionalProperties":false,"required":["value","unit"],"properties":{"value":{"type":"number","minimum":0.1,"maximum":10},"unit":{"const":"m/s"}}},"release_volume":{"type":"object","additionalProperties":false,"required":["value","unit"],"properties":{"value":{"type":"number","minimum":0,"maximum":10000000},"unit":{"const":"m3"}}},"release_duration":{"type":"object","additionalProperties":false,"required":["value","unit"],"properties":{"value":{"type":"number","minimum":60,"maximum":86400},"unit":{"const":"s"}}}}}]}},"$schema":"http://json-schema.org/draft-07/schema#"};
const func2 = Object.prototype.hasOwnProperty;
const func3 = require("ajv/dist/runtime/ucs2length").default;
const pattern0 = new RegExp("^scenario-[a-z0-9-]+$", "u");
const pattern1 = new RegExp("^[1-9][0-9]*$", "u");
const pattern2 = new RegExp("^[a-f0-9]{64}$", "u");
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
if(data.is_fixture === undefined){
const err4 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "is_fixture"},message:"must have required property '"+"is_fixture"+"'"};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
if(data.model === undefined){
const err5 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "model"},message:"must have required property '"+"model"+"'"};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
if(data.simulation_level === undefined){
const err6 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "simulation_level"},message:"must have required property '"+"simulation_level"+"'"};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
if(data.source_reach_id === undefined){
const err7 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "source_reach_id"},message:"must have required property '"+"source_reach_id"+"'"};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
}
if(data.inputs === undefined){
const err8 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "inputs"},message:"must have required property '"+"inputs"+"'"};
if(vErrors === null){
vErrors = [err8];
}
else {
vErrors.push(err8);
}
errors++;
}
if(data.assumptions === undefined){
const err9 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "assumptions"},message:"must have required property '"+"assumptions"+"'"};
if(vErrors === null){
vErrors = [err9];
}
else {
vErrors.push(err9);
}
errors++;
}
if(data.parameters === undefined){
const err10 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "parameters"},message:"must have required property '"+"parameters"+"'"};
if(vErrors === null){
vErrors = [err10];
}
else {
vErrors.push(err10);
}
errors++;
}
for(const key0 in data){
if(!(func2.call(schema11.properties, key0))){
const err11 = {instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err11];
}
else {
vErrors.push(err11);
}
errors++;
}
}
if(data.schema_version !== undefined){
if("1.0.0" !== data.schema_version){
const err12 = {instancePath:instancePath+"/schema_version",schemaPath:"#/properties/schema_version/const",keyword:"const",params:{allowedValue: "1.0.0"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err12];
}
else {
vErrors.push(err12);
}
errors++;
}
}
if(data.kind !== undefined){
if("scenario-definition" !== data.kind){
const err13 = {instancePath:instancePath+"/kind",schemaPath:"#/properties/kind/const",keyword:"const",params:{allowedValue: "scenario-definition"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err13];
}
else {
vErrors.push(err13);
}
errors++;
}
}
if(data.id !== undefined){
let data2 = data.id;
if(typeof data2 === "string"){
if(!pattern0.test(data2)){
const err14 = {instancePath:instancePath+"/id",schemaPath:"#/properties/id/pattern",keyword:"pattern",params:{pattern: "^scenario-[a-z0-9-]+$"},message:"must match pattern \""+"^scenario-[a-z0-9-]+$"+"\""};
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
const err15 = {instancePath:instancePath+"/id",schemaPath:"#/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err15];
}
else {
vErrors.push(err15);
}
errors++;
}
}
if(data.version !== undefined){
if("1.0.0" !== data.version){
const err16 = {instancePath:instancePath+"/version",schemaPath:"#/properties/version/const",keyword:"const",params:{allowedValue: "1.0.0"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err16];
}
else {
vErrors.push(err16);
}
errors++;
}
}
if(data.is_fixture !== undefined){
if(typeof data.is_fixture !== "boolean"){
const err17 = {instancePath:instancePath+"/is_fixture",schemaPath:"#/properties/is_fixture/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"};
if(vErrors === null){
vErrors = [err17];
}
else {
vErrors.push(err17);
}
errors++;
}
}
if(data.model !== undefined){
let data5 = data.model;
if(data5 && typeof data5 == "object" && !Array.isArray(data5)){
if(data5.id === undefined){
const err18 = {instancePath:instancePath+"/model",schemaPath:"#/properties/model/required",keyword:"required",params:{missingProperty: "id"},message:"must have required property '"+"id"+"'"};
if(vErrors === null){
vErrors = [err18];
}
else {
vErrors.push(err18);
}
errors++;
}
if(data5.version === undefined){
const err19 = {instancePath:instancePath+"/model",schemaPath:"#/properties/model/required",keyword:"required",params:{missingProperty: "version"},message:"must have required property '"+"version"+"'"};
if(vErrors === null){
vErrors = [err19];
}
else {
vErrors.push(err19);
}
errors++;
}
for(const key1 in data5){
if(!((key1 === "id") || (key1 === "version"))){
const err20 = {instancePath:instancePath+"/model",schemaPath:"#/properties/model/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key1},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err20];
}
else {
vErrors.push(err20);
}
errors++;
}
}
if(data5.id !== undefined){
let data6 = data5.id;
if(!((data6 === "network-path") || (data6 === "constant-celerity-pulse"))){
const err21 = {instancePath:instancePath+"/model/id",schemaPath:"#/properties/model/properties/id/enum",keyword:"enum",params:{allowedValues: schema11.properties.model.properties.id.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err21];
}
else {
vErrors.push(err21);
}
errors++;
}
}
if(data5.version !== undefined){
if("1.0.0" !== data5.version){
const err22 = {instancePath:instancePath+"/model/version",schemaPath:"#/properties/model/properties/version/const",keyword:"const",params:{allowedValue: "1.0.0"},message:"must be equal to constant"};
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
else {
const err23 = {instancePath:instancePath+"/model",schemaPath:"#/properties/model/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err23];
}
else {
vErrors.push(err23);
}
errors++;
}
}
if(data.simulation_level !== undefined){
let data8 = data.simulation_level;
if(!((data8 === 1) || (data8 === 2))){
const err24 = {instancePath:instancePath+"/simulation_level",schemaPath:"#/properties/simulation_level/enum",keyword:"enum",params:{allowedValues: schema11.properties.simulation_level.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err24];
}
else {
vErrors.push(err24);
}
errors++;
}
}
if(data.source_reach_id !== undefined){
let data9 = data.source_reach_id;
if(typeof data9 === "string"){
if(!pattern1.test(data9)){
const err25 = {instancePath:instancePath+"/source_reach_id",schemaPath:"#/properties/source_reach_id/pattern",keyword:"pattern",params:{pattern: "^[1-9][0-9]*$"},message:"must match pattern \""+"^[1-9][0-9]*$"+"\""};
if(vErrors === null){
vErrors = [err25];
}
else {
vErrors.push(err25);
}
errors++;
}
}
else {
const err26 = {instancePath:instancePath+"/source_reach_id",schemaPath:"#/properties/source_reach_id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err26];
}
else {
vErrors.push(err26);
}
errors++;
}
}
if(data.inputs !== undefined){
let data10 = data.inputs;
if(Array.isArray(data10)){
if(data10.length > 8){
const err27 = {instancePath:instancePath+"/inputs",schemaPath:"#/properties/inputs/maxItems",keyword:"maxItems",params:{limit: 8},message:"must NOT have more than 8 items"};
if(vErrors === null){
vErrors = [err27];
}
else {
vErrors.push(err27);
}
errors++;
}
if(data10.length < 1){
const err28 = {instancePath:instancePath+"/inputs",schemaPath:"#/properties/inputs/minItems",keyword:"minItems",params:{limit: 1},message:"must NOT have fewer than 1 items"};
if(vErrors === null){
vErrors = [err28];
}
else {
vErrors.push(err28);
}
errors++;
}
const len0 = data10.length;
for(let i0=0; i0<len0; i0++){
let data11 = data10[i0];
if(data11 && typeof data11 == "object" && !Array.isArray(data11)){
if(data11.dataset_id === undefined){
const err29 = {instancePath:instancePath+"/inputs/" + i0,schemaPath:"#/properties/inputs/items/required",keyword:"required",params:{missingProperty: "dataset_id"},message:"must have required property '"+"dataset_id"+"'"};
if(vErrors === null){
vErrors = [err29];
}
else {
vErrors.push(err29);
}
errors++;
}
if(data11.dataset_version === undefined){
const err30 = {instancePath:instancePath+"/inputs/" + i0,schemaPath:"#/properties/inputs/items/required",keyword:"required",params:{missingProperty: "dataset_version"},message:"must have required property '"+"dataset_version"+"'"};
if(vErrors === null){
vErrors = [err30];
}
else {
vErrors.push(err30);
}
errors++;
}
if(data11.sha256 === undefined){
const err31 = {instancePath:instancePath+"/inputs/" + i0,schemaPath:"#/properties/inputs/items/required",keyword:"required",params:{missingProperty: "sha256"},message:"must have required property '"+"sha256"+"'"};
if(vErrors === null){
vErrors = [err31];
}
else {
vErrors.push(err31);
}
errors++;
}
if(data11.processing_version === undefined){
const err32 = {instancePath:instancePath+"/inputs/" + i0,schemaPath:"#/properties/inputs/items/required",keyword:"required",params:{missingProperty: "processing_version"},message:"must have required property '"+"processing_version"+"'"};
if(vErrors === null){
vErrors = [err32];
}
else {
vErrors.push(err32);
}
errors++;
}
if(data11.source === undefined){
const err33 = {instancePath:instancePath+"/inputs/" + i0,schemaPath:"#/properties/inputs/items/required",keyword:"required",params:{missingProperty: "source"},message:"must have required property '"+"source"+"'"};
if(vErrors === null){
vErrors = [err33];
}
else {
vErrors.push(err33);
}
errors++;
}
if(data11.license === undefined){
const err34 = {instancePath:instancePath+"/inputs/" + i0,schemaPath:"#/properties/inputs/items/required",keyword:"required",params:{missingProperty: "license"},message:"must have required property '"+"license"+"'"};
if(vErrors === null){
vErrors = [err34];
}
else {
vErrors.push(err34);
}
errors++;
}
if(data11.observation_date === undefined){
const err35 = {instancePath:instancePath+"/inputs/" + i0,schemaPath:"#/properties/inputs/items/required",keyword:"required",params:{missingProperty: "observation_date"},message:"must have required property '"+"observation_date"+"'"};
if(vErrors === null){
vErrors = [err35];
}
else {
vErrors.push(err35);
}
errors++;
}
for(const key2 in data11){
if(!(((((((key2 === "dataset_id") || (key2 === "dataset_version")) || (key2 === "sha256")) || (key2 === "processing_version")) || (key2 === "source")) || (key2 === "license")) || (key2 === "observation_date"))){
const err36 = {instancePath:instancePath+"/inputs/" + i0,schemaPath:"#/properties/inputs/items/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key2},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err36];
}
else {
vErrors.push(err36);
}
errors++;
}
}
if(data11.dataset_id !== undefined){
let data12 = data11.dataset_id;
if(typeof data12 === "string"){
if(func3(data12) < 1){
const err37 = {instancePath:instancePath+"/inputs/" + i0+"/dataset_id",schemaPath:"#/properties/inputs/items/properties/dataset_id/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
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
const err38 = {instancePath:instancePath+"/inputs/" + i0+"/dataset_id",schemaPath:"#/properties/inputs/items/properties/dataset_id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err38];
}
else {
vErrors.push(err38);
}
errors++;
}
}
if(data11.dataset_version !== undefined){
let data13 = data11.dataset_version;
if(typeof data13 === "string"){
if(func3(data13) < 1){
const err39 = {instancePath:instancePath+"/inputs/" + i0+"/dataset_version",schemaPath:"#/properties/inputs/items/properties/dataset_version/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
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
const err40 = {instancePath:instancePath+"/inputs/" + i0+"/dataset_version",schemaPath:"#/properties/inputs/items/properties/dataset_version/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err40];
}
else {
vErrors.push(err40);
}
errors++;
}
}
if(data11.sha256 !== undefined){
let data14 = data11.sha256;
if(typeof data14 === "string"){
if(!pattern2.test(data14)){
const err41 = {instancePath:instancePath+"/inputs/" + i0+"/sha256",schemaPath:"#/properties/inputs/items/properties/sha256/pattern",keyword:"pattern",params:{pattern: "^[a-f0-9]{64}$"},message:"must match pattern \""+"^[a-f0-9]{64}$"+"\""};
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
const err42 = {instancePath:instancePath+"/inputs/" + i0+"/sha256",schemaPath:"#/properties/inputs/items/properties/sha256/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err42];
}
else {
vErrors.push(err42);
}
errors++;
}
}
if(data11.processing_version !== undefined){
let data15 = data11.processing_version;
if(typeof data15 === "string"){
if(func3(data15) < 1){
const err43 = {instancePath:instancePath+"/inputs/" + i0+"/processing_version",schemaPath:"#/properties/inputs/items/properties/processing_version/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
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
const err44 = {instancePath:instancePath+"/inputs/" + i0+"/processing_version",schemaPath:"#/properties/inputs/items/properties/processing_version/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err44];
}
else {
vErrors.push(err44);
}
errors++;
}
}
if(data11.source !== undefined){
let data16 = data11.source;
if(typeof data16 === "string"){
if(func3(data16) < 1){
const err45 = {instancePath:instancePath+"/inputs/" + i0+"/source",schemaPath:"#/properties/inputs/items/properties/source/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
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
const err46 = {instancePath:instancePath+"/inputs/" + i0+"/source",schemaPath:"#/properties/inputs/items/properties/source/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err46];
}
else {
vErrors.push(err46);
}
errors++;
}
}
if(data11.license !== undefined){
let data17 = data11.license;
if(typeof data17 === "string"){
if(func3(data17) < 1){
const err47 = {instancePath:instancePath+"/inputs/" + i0+"/license",schemaPath:"#/properties/inputs/items/properties/license/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
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
const err48 = {instancePath:instancePath+"/inputs/" + i0+"/license",schemaPath:"#/properties/inputs/items/properties/license/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err48];
}
else {
vErrors.push(err48);
}
errors++;
}
}
if(data11.observation_date !== undefined){
let data18 = data11.observation_date;
if((typeof data18 !== "string") && (data18 !== null)){
const err49 = {instancePath:instancePath+"/inputs/" + i0+"/observation_date",schemaPath:"#/properties/inputs/items/properties/observation_date/type",keyword:"type",params:{type: schema11.properties.inputs.items.properties.observation_date.type},message:"must be string,null"};
if(vErrors === null){
vErrors = [err49];
}
else {
vErrors.push(err49);
}
errors++;
}
if(typeof data18 === "string"){
if(!(formats0.validate(data18))){
const err50 = {instancePath:instancePath+"/inputs/" + i0+"/observation_date",schemaPath:"#/properties/inputs/items/properties/observation_date/format",keyword:"format",params:{format: "date-time"},message:"must match format \""+"date-time"+"\""};
if(vErrors === null){
vErrors = [err50];
}
else {
vErrors.push(err50);
}
errors++;
}
}
}
}
else {
const err51 = {instancePath:instancePath+"/inputs/" + i0,schemaPath:"#/properties/inputs/items/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err51];
}
else {
vErrors.push(err51);
}
errors++;
}
}
}
else {
const err52 = {instancePath:instancePath+"/inputs",schemaPath:"#/properties/inputs/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err52];
}
else {
vErrors.push(err52);
}
errors++;
}
}
if(data.assumptions !== undefined){
let data19 = data.assumptions;
if(Array.isArray(data19)){
const len1 = data19.length;
for(let i1=0; i1<len1; i1++){
let data20 = data19[i1];
if(typeof data20 === "string"){
if(func3(data20) < 1){
const err53 = {instancePath:instancePath+"/assumptions/" + i1,schemaPath:"#/properties/assumptions/items/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
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
const err54 = {instancePath:instancePath+"/assumptions/" + i1,schemaPath:"#/properties/assumptions/items/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err54];
}
else {
vErrors.push(err54);
}
errors++;
}
}
let i2 = data19.length;
let j0;
if(i2 > 1){
const indices0 = {};
for(;i2--;){
let item0 = data19[i2];
if(typeof item0 !== "string"){
continue;
}
if(typeof indices0[item0] == "number"){
j0 = indices0[item0];
const err55 = {instancePath:instancePath+"/assumptions",schemaPath:"#/properties/assumptions/uniqueItems",keyword:"uniqueItems",params:{i: i2, j: j0},message:"must NOT have duplicate items (items ## "+j0+" and "+i2+" are identical)"};
if(vErrors === null){
vErrors = [err55];
}
else {
vErrors.push(err55);
}
errors++;
break;
}
indices0[item0] = i2;
}
}
}
else {
const err56 = {instancePath:instancePath+"/assumptions",schemaPath:"#/properties/assumptions/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err56];
}
else {
vErrors.push(err56);
}
errors++;
}
}
if(data.parameters !== undefined){
let data21 = data.parameters;
const _errs41 = errors;
let valid8 = false;
let passing0 = null;
const _errs42 = errors;
if(data21 && typeof data21 == "object" && !Array.isArray(data21)){
for(const key3 in data21){
const err57 = {instancePath:instancePath+"/parameters",schemaPath:"#/properties/parameters/oneOf/0/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key3},message:"must NOT have additional properties"};
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
const err58 = {instancePath:instancePath+"/parameters",schemaPath:"#/properties/parameters/oneOf/0/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err58];
}
else {
vErrors.push(err58);
}
errors++;
}
var _valid0 = _errs42 === errors;
if(_valid0){
valid8 = true;
passing0 = 0;
}
const _errs45 = errors;
if(data21 && typeof data21 == "object" && !Array.isArray(data21)){
if(data21.celerity === undefined){
const err59 = {instancePath:instancePath+"/parameters",schemaPath:"#/properties/parameters/oneOf/1/required",keyword:"required",params:{missingProperty: "celerity"},message:"must have required property '"+"celerity"+"'"};
if(vErrors === null){
vErrors = [err59];
}
else {
vErrors.push(err59);
}
errors++;
}
if(data21.release_volume === undefined){
const err60 = {instancePath:instancePath+"/parameters",schemaPath:"#/properties/parameters/oneOf/1/required",keyword:"required",params:{missingProperty: "release_volume"},message:"must have required property '"+"release_volume"+"'"};
if(vErrors === null){
vErrors = [err60];
}
else {
vErrors.push(err60);
}
errors++;
}
if(data21.release_duration === undefined){
const err61 = {instancePath:instancePath+"/parameters",schemaPath:"#/properties/parameters/oneOf/1/required",keyword:"required",params:{missingProperty: "release_duration"},message:"must have required property '"+"release_duration"+"'"};
if(vErrors === null){
vErrors = [err61];
}
else {
vErrors.push(err61);
}
errors++;
}
for(const key4 in data21){
if(!(((key4 === "celerity") || (key4 === "release_volume")) || (key4 === "release_duration"))){
const err62 = {instancePath:instancePath+"/parameters",schemaPath:"#/properties/parameters/oneOf/1/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key4},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err62];
}
else {
vErrors.push(err62);
}
errors++;
}
}
if(data21.celerity !== undefined){
let data22 = data21.celerity;
if(data22 && typeof data22 == "object" && !Array.isArray(data22)){
if(data22.value === undefined){
const err63 = {instancePath:instancePath+"/parameters/celerity",schemaPath:"#/properties/parameters/oneOf/1/properties/celerity/required",keyword:"required",params:{missingProperty: "value"},message:"must have required property '"+"value"+"'"};
if(vErrors === null){
vErrors = [err63];
}
else {
vErrors.push(err63);
}
errors++;
}
if(data22.unit === undefined){
const err64 = {instancePath:instancePath+"/parameters/celerity",schemaPath:"#/properties/parameters/oneOf/1/properties/celerity/required",keyword:"required",params:{missingProperty: "unit"},message:"must have required property '"+"unit"+"'"};
if(vErrors === null){
vErrors = [err64];
}
else {
vErrors.push(err64);
}
errors++;
}
for(const key5 in data22){
if(!((key5 === "value") || (key5 === "unit"))){
const err65 = {instancePath:instancePath+"/parameters/celerity",schemaPath:"#/properties/parameters/oneOf/1/properties/celerity/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key5},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err65];
}
else {
vErrors.push(err65);
}
errors++;
}
}
if(data22.value !== undefined){
let data23 = data22.value;
if((typeof data23 == "number") && (isFinite(data23))){
if(data23 > 10 || isNaN(data23)){
const err66 = {instancePath:instancePath+"/parameters/celerity/value",schemaPath:"#/properties/parameters/oneOf/1/properties/celerity/properties/value/maximum",keyword:"maximum",params:{comparison: "<=", limit: 10},message:"must be <= 10"};
if(vErrors === null){
vErrors = [err66];
}
else {
vErrors.push(err66);
}
errors++;
}
if(data23 < 0.1 || isNaN(data23)){
const err67 = {instancePath:instancePath+"/parameters/celerity/value",schemaPath:"#/properties/parameters/oneOf/1/properties/celerity/properties/value/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0.1},message:"must be >= 0.1"};
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
const err68 = {instancePath:instancePath+"/parameters/celerity/value",schemaPath:"#/properties/parameters/oneOf/1/properties/celerity/properties/value/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err68];
}
else {
vErrors.push(err68);
}
errors++;
}
}
if(data22.unit !== undefined){
if("m/s" !== data22.unit){
const err69 = {instancePath:instancePath+"/parameters/celerity/unit",schemaPath:"#/properties/parameters/oneOf/1/properties/celerity/properties/unit/const",keyword:"const",params:{allowedValue: "m/s"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err69];
}
else {
vErrors.push(err69);
}
errors++;
}
}
}
else {
const err70 = {instancePath:instancePath+"/parameters/celerity",schemaPath:"#/properties/parameters/oneOf/1/properties/celerity/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err70];
}
else {
vErrors.push(err70);
}
errors++;
}
}
if(data21.release_volume !== undefined){
let data25 = data21.release_volume;
if(data25 && typeof data25 == "object" && !Array.isArray(data25)){
if(data25.value === undefined){
const err71 = {instancePath:instancePath+"/parameters/release_volume",schemaPath:"#/properties/parameters/oneOf/1/properties/release_volume/required",keyword:"required",params:{missingProperty: "value"},message:"must have required property '"+"value"+"'"};
if(vErrors === null){
vErrors = [err71];
}
else {
vErrors.push(err71);
}
errors++;
}
if(data25.unit === undefined){
const err72 = {instancePath:instancePath+"/parameters/release_volume",schemaPath:"#/properties/parameters/oneOf/1/properties/release_volume/required",keyword:"required",params:{missingProperty: "unit"},message:"must have required property '"+"unit"+"'"};
if(vErrors === null){
vErrors = [err72];
}
else {
vErrors.push(err72);
}
errors++;
}
for(const key6 in data25){
if(!((key6 === "value") || (key6 === "unit"))){
const err73 = {instancePath:instancePath+"/parameters/release_volume",schemaPath:"#/properties/parameters/oneOf/1/properties/release_volume/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key6},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err73];
}
else {
vErrors.push(err73);
}
errors++;
}
}
if(data25.value !== undefined){
let data26 = data25.value;
if((typeof data26 == "number") && (isFinite(data26))){
if(data26 > 10000000 || isNaN(data26)){
const err74 = {instancePath:instancePath+"/parameters/release_volume/value",schemaPath:"#/properties/parameters/oneOf/1/properties/release_volume/properties/value/maximum",keyword:"maximum",params:{comparison: "<=", limit: 10000000},message:"must be <= 10000000"};
if(vErrors === null){
vErrors = [err74];
}
else {
vErrors.push(err74);
}
errors++;
}
if(data26 < 0 || isNaN(data26)){
const err75 = {instancePath:instancePath+"/parameters/release_volume/value",schemaPath:"#/properties/parameters/oneOf/1/properties/release_volume/properties/value/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
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
const err76 = {instancePath:instancePath+"/parameters/release_volume/value",schemaPath:"#/properties/parameters/oneOf/1/properties/release_volume/properties/value/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err76];
}
else {
vErrors.push(err76);
}
errors++;
}
}
if(data25.unit !== undefined){
if("m3" !== data25.unit){
const err77 = {instancePath:instancePath+"/parameters/release_volume/unit",schemaPath:"#/properties/parameters/oneOf/1/properties/release_volume/properties/unit/const",keyword:"const",params:{allowedValue: "m3"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err77];
}
else {
vErrors.push(err77);
}
errors++;
}
}
}
else {
const err78 = {instancePath:instancePath+"/parameters/release_volume",schemaPath:"#/properties/parameters/oneOf/1/properties/release_volume/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err78];
}
else {
vErrors.push(err78);
}
errors++;
}
}
if(data21.release_duration !== undefined){
let data28 = data21.release_duration;
if(data28 && typeof data28 == "object" && !Array.isArray(data28)){
if(data28.value === undefined){
const err79 = {instancePath:instancePath+"/parameters/release_duration",schemaPath:"#/properties/parameters/oneOf/1/properties/release_duration/required",keyword:"required",params:{missingProperty: "value"},message:"must have required property '"+"value"+"'"};
if(vErrors === null){
vErrors = [err79];
}
else {
vErrors.push(err79);
}
errors++;
}
if(data28.unit === undefined){
const err80 = {instancePath:instancePath+"/parameters/release_duration",schemaPath:"#/properties/parameters/oneOf/1/properties/release_duration/required",keyword:"required",params:{missingProperty: "unit"},message:"must have required property '"+"unit"+"'"};
if(vErrors === null){
vErrors = [err80];
}
else {
vErrors.push(err80);
}
errors++;
}
for(const key7 in data28){
if(!((key7 === "value") || (key7 === "unit"))){
const err81 = {instancePath:instancePath+"/parameters/release_duration",schemaPath:"#/properties/parameters/oneOf/1/properties/release_duration/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key7},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err81];
}
else {
vErrors.push(err81);
}
errors++;
}
}
if(data28.value !== undefined){
let data29 = data28.value;
if((typeof data29 == "number") && (isFinite(data29))){
if(data29 > 86400 || isNaN(data29)){
const err82 = {instancePath:instancePath+"/parameters/release_duration/value",schemaPath:"#/properties/parameters/oneOf/1/properties/release_duration/properties/value/maximum",keyword:"maximum",params:{comparison: "<=", limit: 86400},message:"must be <= 86400"};
if(vErrors === null){
vErrors = [err82];
}
else {
vErrors.push(err82);
}
errors++;
}
if(data29 < 60 || isNaN(data29)){
const err83 = {instancePath:instancePath+"/parameters/release_duration/value",schemaPath:"#/properties/parameters/oneOf/1/properties/release_duration/properties/value/minimum",keyword:"minimum",params:{comparison: ">=", limit: 60},message:"must be >= 60"};
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
const err84 = {instancePath:instancePath+"/parameters/release_duration/value",schemaPath:"#/properties/parameters/oneOf/1/properties/release_duration/properties/value/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err84];
}
else {
vErrors.push(err84);
}
errors++;
}
}
if(data28.unit !== undefined){
if("s" !== data28.unit){
const err85 = {instancePath:instancePath+"/parameters/release_duration/unit",schemaPath:"#/properties/parameters/oneOf/1/properties/release_duration/properties/unit/const",keyword:"const",params:{allowedValue: "s"},message:"must be equal to constant"};
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
const err86 = {instancePath:instancePath+"/parameters/release_duration",schemaPath:"#/properties/parameters/oneOf/1/properties/release_duration/type",keyword:"type",params:{type: "object"},message:"must be object"};
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
else {
const err87 = {instancePath:instancePath+"/parameters",schemaPath:"#/properties/parameters/oneOf/1/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err87];
}
else {
vErrors.push(err87);
}
errors++;
}
var _valid0 = _errs45 === errors;
if(_valid0 && valid8){
valid8 = false;
passing0 = [passing0, 1];
}
else {
if(_valid0){
valid8 = true;
passing0 = 1;
}
}
if(!valid8){
const err88 = {instancePath:instancePath+"/parameters",schemaPath:"#/properties/parameters/oneOf",keyword:"oneOf",params:{passingSchemas: passing0},message:"must match exactly one schema in oneOf"};
if(vErrors === null){
vErrors = [err88];
}
else {
vErrors.push(err88);
}
errors++;
}
else {
errors = _errs41;
if(vErrors !== null){
if(_errs41){
vErrors.length = _errs41;
}
else {
vErrors = null;
}
}
}
}
}
else {
const err89 = {instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err89];
}
else {
vErrors.push(err89);
}
errors++;
}
validate10.errors = vErrors;
return errors === 0;
}

