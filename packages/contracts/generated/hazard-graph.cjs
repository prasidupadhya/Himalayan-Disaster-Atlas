// Generated from hazard-graph.schema.json; run npm run contracts:generate. Do not edit.
"use strict";
module.exports = validate10;
module.exports.default = validate10;
const schema11 = {"type":"object","additionalProperties":false,"required":["schema_version","kind","version","method","inputs","nodes","edges","limitations"],"properties":{"schema_version":{"const":"1.0.0"},"kind":{"const":"hazard-graph"},"version":{"const":"1.0.0"},"method":{"const":"evidence-relationships/1.0.0"},"inputs":{"type":"array","minItems":1,"items":{"type":"object","additionalProperties":false,"required":["dataset_id","version","path","sha256","artifact_sha256","source","license","date"],"properties":{"dataset_id":{"type":"string","minLength":1},"version":{"type":"string","minLength":1},"path":{"type":"string","pattern":"^/data/[a-z0-9-]+/[0-9.]+/manifest.json$"},"sha256":{"type":"string","pattern":"^[a-f0-9]{64}$"},"artifact_sha256":{"type":"string","pattern":"^[a-f0-9]{64}$"},"source":{"type":"string","minLength":1},"license":{"type":"string","minLength":1},"date":{"type":["string","null"]}}}},"nodes":{"type":"array","maxItems":25000,"items":{"type":"object","additionalProperties":false,"required":["id","type","label","input","record_id","coordinates","boundary_next_id"],"properties":{"id":{"type":"string","minLength":1},"type":{"enum":["glacier","lake","river","hazard","infrastructure","population_area","event","scenario","exposure"]},"label":{"type":"string","minLength":1},"input":{"type":"integer","minimum":0},"record_id":{"type":"string","minLength":1},"coordinates":{"anyOf":[{"type":"null"},{"type":"array","minItems":2,"maxItems":2,"items":{"type":"number"}}]},"boundary_next_id":{"type":["string","null"]}}}},"edges":{"type":"array","maxItems":30000,"items":{"type":"object","additionalProperties":false,"required":["id","from","to","type","evidence","confidence","input","record_id","method","assumptions","limitations"],"properties":{"id":{"type":"string","minLength":1},"from":{"type":"string","minLength":1},"to":{"type":"string","minLength":1},"type":{"enum":["glacier_lake","lake_river","river_downstream","hazard_exposure","landslide_blockage","scenario_exposure","footprint_intersection"]},"evidence":{"enum":["observed","derived","inferred","modelled"]},"confidence":{"enum":[null,"low","medium","high"]},"input":{"type":"integer","minimum":0},"record_id":{"type":"string","minLength":1},"method":{"type":"string","minLength":1},"assumptions":{"type":"array","items":{"type":"string","minLength":1}},"limitations":{"type":"array","minItems":1,"items":{"type":"string","minLength":1}}}}},"limitations":{"type":"array","minItems":1,"items":{"type":"string","minLength":1}}},"$schema":"http://json-schema.org/draft-07/schema#"};
const func2 = require("ajv/dist/runtime/ucs2length").default;
const func9 = Object.prototype.hasOwnProperty;
const pattern0 = new RegExp("^/data/[a-z0-9-]+/[0-9.]+/manifest.json$", "u");
const pattern1 = new RegExp("^[a-f0-9]{64}$", "u");

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
if(data.method === undefined){
const err3 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "method"},message:"must have required property '"+"method"+"'"};
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
if(data.nodes === undefined){
const err5 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "nodes"},message:"must have required property '"+"nodes"+"'"};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
if(data.edges === undefined){
const err6 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "edges"},message:"must have required property '"+"edges"+"'"};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
if(data.limitations === undefined){
const err7 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "limitations"},message:"must have required property '"+"limitations"+"'"};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
}
for(const key0 in data){
if(!((((((((key0 === "schema_version") || (key0 === "kind")) || (key0 === "version")) || (key0 === "method")) || (key0 === "inputs")) || (key0 === "nodes")) || (key0 === "edges")) || (key0 === "limitations"))){
const err8 = {instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err8];
}
else {
vErrors.push(err8);
}
errors++;
}
}
if(data.schema_version !== undefined){
if("1.0.0" !== data.schema_version){
const err9 = {instancePath:instancePath+"/schema_version",schemaPath:"#/properties/schema_version/const",keyword:"const",params:{allowedValue: "1.0.0"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err9];
}
else {
vErrors.push(err9);
}
errors++;
}
}
if(data.kind !== undefined){
if("hazard-graph" !== data.kind){
const err10 = {instancePath:instancePath+"/kind",schemaPath:"#/properties/kind/const",keyword:"const",params:{allowedValue: "hazard-graph"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err10];
}
else {
vErrors.push(err10);
}
errors++;
}
}
if(data.version !== undefined){
if("1.0.0" !== data.version){
const err11 = {instancePath:instancePath+"/version",schemaPath:"#/properties/version/const",keyword:"const",params:{allowedValue: "1.0.0"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err11];
}
else {
vErrors.push(err11);
}
errors++;
}
}
if(data.method !== undefined){
if("evidence-relationships/1.0.0" !== data.method){
const err12 = {instancePath:instancePath+"/method",schemaPath:"#/properties/method/const",keyword:"const",params:{allowedValue: "evidence-relationships/1.0.0"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err12];
}
else {
vErrors.push(err12);
}
errors++;
}
}
if(data.inputs !== undefined){
let data4 = data.inputs;
if(Array.isArray(data4)){
if(data4.length < 1){
const err13 = {instancePath:instancePath+"/inputs",schemaPath:"#/properties/inputs/minItems",keyword:"minItems",params:{limit: 1},message:"must NOT have fewer than 1 items"};
if(vErrors === null){
vErrors = [err13];
}
else {
vErrors.push(err13);
}
errors++;
}
const len0 = data4.length;
for(let i0=0; i0<len0; i0++){
let data5 = data4[i0];
if(data5 && typeof data5 == "object" && !Array.isArray(data5)){
if(data5.dataset_id === undefined){
const err14 = {instancePath:instancePath+"/inputs/" + i0,schemaPath:"#/properties/inputs/items/required",keyword:"required",params:{missingProperty: "dataset_id"},message:"must have required property '"+"dataset_id"+"'"};
if(vErrors === null){
vErrors = [err14];
}
else {
vErrors.push(err14);
}
errors++;
}
if(data5.version === undefined){
const err15 = {instancePath:instancePath+"/inputs/" + i0,schemaPath:"#/properties/inputs/items/required",keyword:"required",params:{missingProperty: "version"},message:"must have required property '"+"version"+"'"};
if(vErrors === null){
vErrors = [err15];
}
else {
vErrors.push(err15);
}
errors++;
}
if(data5.path === undefined){
const err16 = {instancePath:instancePath+"/inputs/" + i0,schemaPath:"#/properties/inputs/items/required",keyword:"required",params:{missingProperty: "path"},message:"must have required property '"+"path"+"'"};
if(vErrors === null){
vErrors = [err16];
}
else {
vErrors.push(err16);
}
errors++;
}
if(data5.sha256 === undefined){
const err17 = {instancePath:instancePath+"/inputs/" + i0,schemaPath:"#/properties/inputs/items/required",keyword:"required",params:{missingProperty: "sha256"},message:"must have required property '"+"sha256"+"'"};
if(vErrors === null){
vErrors = [err17];
}
else {
vErrors.push(err17);
}
errors++;
}
if(data5.artifact_sha256 === undefined){
const err18 = {instancePath:instancePath+"/inputs/" + i0,schemaPath:"#/properties/inputs/items/required",keyword:"required",params:{missingProperty: "artifact_sha256"},message:"must have required property '"+"artifact_sha256"+"'"};
if(vErrors === null){
vErrors = [err18];
}
else {
vErrors.push(err18);
}
errors++;
}
if(data5.source === undefined){
const err19 = {instancePath:instancePath+"/inputs/" + i0,schemaPath:"#/properties/inputs/items/required",keyword:"required",params:{missingProperty: "source"},message:"must have required property '"+"source"+"'"};
if(vErrors === null){
vErrors = [err19];
}
else {
vErrors.push(err19);
}
errors++;
}
if(data5.license === undefined){
const err20 = {instancePath:instancePath+"/inputs/" + i0,schemaPath:"#/properties/inputs/items/required",keyword:"required",params:{missingProperty: "license"},message:"must have required property '"+"license"+"'"};
if(vErrors === null){
vErrors = [err20];
}
else {
vErrors.push(err20);
}
errors++;
}
if(data5.date === undefined){
const err21 = {instancePath:instancePath+"/inputs/" + i0,schemaPath:"#/properties/inputs/items/required",keyword:"required",params:{missingProperty: "date"},message:"must have required property '"+"date"+"'"};
if(vErrors === null){
vErrors = [err21];
}
else {
vErrors.push(err21);
}
errors++;
}
for(const key1 in data5){
if(!((((((((key1 === "dataset_id") || (key1 === "version")) || (key1 === "path")) || (key1 === "sha256")) || (key1 === "artifact_sha256")) || (key1 === "source")) || (key1 === "license")) || (key1 === "date"))){
const err22 = {instancePath:instancePath+"/inputs/" + i0,schemaPath:"#/properties/inputs/items/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key1},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err22];
}
else {
vErrors.push(err22);
}
errors++;
}
}
if(data5.dataset_id !== undefined){
let data6 = data5.dataset_id;
if(typeof data6 === "string"){
if(func2(data6) < 1){
const err23 = {instancePath:instancePath+"/inputs/" + i0+"/dataset_id",schemaPath:"#/properties/inputs/items/properties/dataset_id/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
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
const err24 = {instancePath:instancePath+"/inputs/" + i0+"/dataset_id",schemaPath:"#/properties/inputs/items/properties/dataset_id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err24];
}
else {
vErrors.push(err24);
}
errors++;
}
}
if(data5.version !== undefined){
let data7 = data5.version;
if(typeof data7 === "string"){
if(func2(data7) < 1){
const err25 = {instancePath:instancePath+"/inputs/" + i0+"/version",schemaPath:"#/properties/inputs/items/properties/version/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
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
const err26 = {instancePath:instancePath+"/inputs/" + i0+"/version",schemaPath:"#/properties/inputs/items/properties/version/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err26];
}
else {
vErrors.push(err26);
}
errors++;
}
}
if(data5.path !== undefined){
let data8 = data5.path;
if(typeof data8 === "string"){
if(!pattern0.test(data8)){
const err27 = {instancePath:instancePath+"/inputs/" + i0+"/path",schemaPath:"#/properties/inputs/items/properties/path/pattern",keyword:"pattern",params:{pattern: "^/data/[a-z0-9-]+/[0-9.]+/manifest.json$"},message:"must match pattern \""+"^/data/[a-z0-9-]+/[0-9.]+/manifest.json$"+"\""};
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
const err28 = {instancePath:instancePath+"/inputs/" + i0+"/path",schemaPath:"#/properties/inputs/items/properties/path/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err28];
}
else {
vErrors.push(err28);
}
errors++;
}
}
if(data5.sha256 !== undefined){
let data9 = data5.sha256;
if(typeof data9 === "string"){
if(!pattern1.test(data9)){
const err29 = {instancePath:instancePath+"/inputs/" + i0+"/sha256",schemaPath:"#/properties/inputs/items/properties/sha256/pattern",keyword:"pattern",params:{pattern: "^[a-f0-9]{64}$"},message:"must match pattern \""+"^[a-f0-9]{64}$"+"\""};
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
const err30 = {instancePath:instancePath+"/inputs/" + i0+"/sha256",schemaPath:"#/properties/inputs/items/properties/sha256/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err30];
}
else {
vErrors.push(err30);
}
errors++;
}
}
if(data5.artifact_sha256 !== undefined){
let data10 = data5.artifact_sha256;
if(typeof data10 === "string"){
if(!pattern1.test(data10)){
const err31 = {instancePath:instancePath+"/inputs/" + i0+"/artifact_sha256",schemaPath:"#/properties/inputs/items/properties/artifact_sha256/pattern",keyword:"pattern",params:{pattern: "^[a-f0-9]{64}$"},message:"must match pattern \""+"^[a-f0-9]{64}$"+"\""};
if(vErrors === null){
vErrors = [err31];
}
else {
vErrors.push(err31);
}
errors++;
}
}
else {
const err32 = {instancePath:instancePath+"/inputs/" + i0+"/artifact_sha256",schemaPath:"#/properties/inputs/items/properties/artifact_sha256/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err32];
}
else {
vErrors.push(err32);
}
errors++;
}
}
if(data5.source !== undefined){
let data11 = data5.source;
if(typeof data11 === "string"){
if(func2(data11) < 1){
const err33 = {instancePath:instancePath+"/inputs/" + i0+"/source",schemaPath:"#/properties/inputs/items/properties/source/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
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
const err34 = {instancePath:instancePath+"/inputs/" + i0+"/source",schemaPath:"#/properties/inputs/items/properties/source/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err34];
}
else {
vErrors.push(err34);
}
errors++;
}
}
if(data5.license !== undefined){
let data12 = data5.license;
if(typeof data12 === "string"){
if(func2(data12) < 1){
const err35 = {instancePath:instancePath+"/inputs/" + i0+"/license",schemaPath:"#/properties/inputs/items/properties/license/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
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
const err36 = {instancePath:instancePath+"/inputs/" + i0+"/license",schemaPath:"#/properties/inputs/items/properties/license/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err36];
}
else {
vErrors.push(err36);
}
errors++;
}
}
if(data5.date !== undefined){
let data13 = data5.date;
if((typeof data13 !== "string") && (data13 !== null)){
const err37 = {instancePath:instancePath+"/inputs/" + i0+"/date",schemaPath:"#/properties/inputs/items/properties/date/type",keyword:"type",params:{type: schema11.properties.inputs.items.properties.date.type},message:"must be string,null"};
if(vErrors === null){
vErrors = [err37];
}
else {
vErrors.push(err37);
}
errors++;
}
}
}
else {
const err38 = {instancePath:instancePath+"/inputs/" + i0,schemaPath:"#/properties/inputs/items/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err38];
}
else {
vErrors.push(err38);
}
errors++;
}
}
}
else {
const err39 = {instancePath:instancePath+"/inputs",schemaPath:"#/properties/inputs/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err39];
}
else {
vErrors.push(err39);
}
errors++;
}
}
if(data.nodes !== undefined){
let data14 = data.nodes;
if(Array.isArray(data14)){
if(data14.length > 25000){
const err40 = {instancePath:instancePath+"/nodes",schemaPath:"#/properties/nodes/maxItems",keyword:"maxItems",params:{limit: 25000},message:"must NOT have more than 25000 items"};
if(vErrors === null){
vErrors = [err40];
}
else {
vErrors.push(err40);
}
errors++;
}
const len1 = data14.length;
for(let i1=0; i1<len1; i1++){
let data15 = data14[i1];
if(data15 && typeof data15 == "object" && !Array.isArray(data15)){
if(data15.id === undefined){
const err41 = {instancePath:instancePath+"/nodes/" + i1,schemaPath:"#/properties/nodes/items/required",keyword:"required",params:{missingProperty: "id"},message:"must have required property '"+"id"+"'"};
if(vErrors === null){
vErrors = [err41];
}
else {
vErrors.push(err41);
}
errors++;
}
if(data15.type === undefined){
const err42 = {instancePath:instancePath+"/nodes/" + i1,schemaPath:"#/properties/nodes/items/required",keyword:"required",params:{missingProperty: "type"},message:"must have required property '"+"type"+"'"};
if(vErrors === null){
vErrors = [err42];
}
else {
vErrors.push(err42);
}
errors++;
}
if(data15.label === undefined){
const err43 = {instancePath:instancePath+"/nodes/" + i1,schemaPath:"#/properties/nodes/items/required",keyword:"required",params:{missingProperty: "label"},message:"must have required property '"+"label"+"'"};
if(vErrors === null){
vErrors = [err43];
}
else {
vErrors.push(err43);
}
errors++;
}
if(data15.input === undefined){
const err44 = {instancePath:instancePath+"/nodes/" + i1,schemaPath:"#/properties/nodes/items/required",keyword:"required",params:{missingProperty: "input"},message:"must have required property '"+"input"+"'"};
if(vErrors === null){
vErrors = [err44];
}
else {
vErrors.push(err44);
}
errors++;
}
if(data15.record_id === undefined){
const err45 = {instancePath:instancePath+"/nodes/" + i1,schemaPath:"#/properties/nodes/items/required",keyword:"required",params:{missingProperty: "record_id"},message:"must have required property '"+"record_id"+"'"};
if(vErrors === null){
vErrors = [err45];
}
else {
vErrors.push(err45);
}
errors++;
}
if(data15.coordinates === undefined){
const err46 = {instancePath:instancePath+"/nodes/" + i1,schemaPath:"#/properties/nodes/items/required",keyword:"required",params:{missingProperty: "coordinates"},message:"must have required property '"+"coordinates"+"'"};
if(vErrors === null){
vErrors = [err46];
}
else {
vErrors.push(err46);
}
errors++;
}
if(data15.boundary_next_id === undefined){
const err47 = {instancePath:instancePath+"/nodes/" + i1,schemaPath:"#/properties/nodes/items/required",keyword:"required",params:{missingProperty: "boundary_next_id"},message:"must have required property '"+"boundary_next_id"+"'"};
if(vErrors === null){
vErrors = [err47];
}
else {
vErrors.push(err47);
}
errors++;
}
for(const key2 in data15){
if(!(((((((key2 === "id") || (key2 === "type")) || (key2 === "label")) || (key2 === "input")) || (key2 === "record_id")) || (key2 === "coordinates")) || (key2 === "boundary_next_id"))){
const err48 = {instancePath:instancePath+"/nodes/" + i1,schemaPath:"#/properties/nodes/items/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key2},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err48];
}
else {
vErrors.push(err48);
}
errors++;
}
}
if(data15.id !== undefined){
let data16 = data15.id;
if(typeof data16 === "string"){
if(func2(data16) < 1){
const err49 = {instancePath:instancePath+"/nodes/" + i1+"/id",schemaPath:"#/properties/nodes/items/properties/id/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
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
const err50 = {instancePath:instancePath+"/nodes/" + i1+"/id",schemaPath:"#/properties/nodes/items/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err50];
}
else {
vErrors.push(err50);
}
errors++;
}
}
if(data15.type !== undefined){
let data17 = data15.type;
if(!(((((((((data17 === "glacier") || (data17 === "lake")) || (data17 === "river")) || (data17 === "hazard")) || (data17 === "infrastructure")) || (data17 === "population_area")) || (data17 === "event")) || (data17 === "scenario")) || (data17 === "exposure"))){
const err51 = {instancePath:instancePath+"/nodes/" + i1+"/type",schemaPath:"#/properties/nodes/items/properties/type/enum",keyword:"enum",params:{allowedValues: schema11.properties.nodes.items.properties.type.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err51];
}
else {
vErrors.push(err51);
}
errors++;
}
}
if(data15.label !== undefined){
let data18 = data15.label;
if(typeof data18 === "string"){
if(func2(data18) < 1){
const err52 = {instancePath:instancePath+"/nodes/" + i1+"/label",schemaPath:"#/properties/nodes/items/properties/label/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
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
const err53 = {instancePath:instancePath+"/nodes/" + i1+"/label",schemaPath:"#/properties/nodes/items/properties/label/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err53];
}
else {
vErrors.push(err53);
}
errors++;
}
}
if(data15.input !== undefined){
let data19 = data15.input;
if(!(((typeof data19 == "number") && (!(data19 % 1) && !isNaN(data19))) && (isFinite(data19)))){
const err54 = {instancePath:instancePath+"/nodes/" + i1+"/input",schemaPath:"#/properties/nodes/items/properties/input/type",keyword:"type",params:{type: "integer"},message:"must be integer"};
if(vErrors === null){
vErrors = [err54];
}
else {
vErrors.push(err54);
}
errors++;
}
if((typeof data19 == "number") && (isFinite(data19))){
if(data19 < 0 || isNaN(data19)){
const err55 = {instancePath:instancePath+"/nodes/" + i1+"/input",schemaPath:"#/properties/nodes/items/properties/input/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
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
if(data15.record_id !== undefined){
let data20 = data15.record_id;
if(typeof data20 === "string"){
if(func2(data20) < 1){
const err56 = {instancePath:instancePath+"/nodes/" + i1+"/record_id",schemaPath:"#/properties/nodes/items/properties/record_id/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
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
const err57 = {instancePath:instancePath+"/nodes/" + i1+"/record_id",schemaPath:"#/properties/nodes/items/properties/record_id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err57];
}
else {
vErrors.push(err57);
}
errors++;
}
}
if(data15.coordinates !== undefined){
let data21 = data15.coordinates;
const _errs42 = errors;
let valid7 = false;
const _errs43 = errors;
if(data21 !== null){
const err58 = {instancePath:instancePath+"/nodes/" + i1+"/coordinates",schemaPath:"#/properties/nodes/items/properties/coordinates/anyOf/0/type",keyword:"type",params:{type: "null"},message:"must be null"};
if(vErrors === null){
vErrors = [err58];
}
else {
vErrors.push(err58);
}
errors++;
}
var _valid0 = _errs43 === errors;
valid7 = valid7 || _valid0;
if(!valid7){
const _errs45 = errors;
if(Array.isArray(data21)){
if(data21.length > 2){
const err59 = {instancePath:instancePath+"/nodes/" + i1+"/coordinates",schemaPath:"#/properties/nodes/items/properties/coordinates/anyOf/1/maxItems",keyword:"maxItems",params:{limit: 2},message:"must NOT have more than 2 items"};
if(vErrors === null){
vErrors = [err59];
}
else {
vErrors.push(err59);
}
errors++;
}
if(data21.length < 2){
const err60 = {instancePath:instancePath+"/nodes/" + i1+"/coordinates",schemaPath:"#/properties/nodes/items/properties/coordinates/anyOf/1/minItems",keyword:"minItems",params:{limit: 2},message:"must NOT have fewer than 2 items"};
if(vErrors === null){
vErrors = [err60];
}
else {
vErrors.push(err60);
}
errors++;
}
const len2 = data21.length;
for(let i2=0; i2<len2; i2++){
let data22 = data21[i2];
if(!((typeof data22 == "number") && (isFinite(data22)))){
const err61 = {instancePath:instancePath+"/nodes/" + i1+"/coordinates/" + i2,schemaPath:"#/properties/nodes/items/properties/coordinates/anyOf/1/items/type",keyword:"type",params:{type: "number"},message:"must be number"};
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
const err62 = {instancePath:instancePath+"/nodes/" + i1+"/coordinates",schemaPath:"#/properties/nodes/items/properties/coordinates/anyOf/1/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err62];
}
else {
vErrors.push(err62);
}
errors++;
}
var _valid0 = _errs45 === errors;
valid7 = valid7 || _valid0;
}
if(!valid7){
const err63 = {instancePath:instancePath+"/nodes/" + i1+"/coordinates",schemaPath:"#/properties/nodes/items/properties/coordinates/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err63];
}
else {
vErrors.push(err63);
}
errors++;
}
else {
errors = _errs42;
if(vErrors !== null){
if(_errs42){
vErrors.length = _errs42;
}
else {
vErrors = null;
}
}
}
}
if(data15.boundary_next_id !== undefined){
let data23 = data15.boundary_next_id;
if((typeof data23 !== "string") && (data23 !== null)){
const err64 = {instancePath:instancePath+"/nodes/" + i1+"/boundary_next_id",schemaPath:"#/properties/nodes/items/properties/boundary_next_id/type",keyword:"type",params:{type: schema11.properties.nodes.items.properties.boundary_next_id.type},message:"must be string,null"};
if(vErrors === null){
vErrors = [err64];
}
else {
vErrors.push(err64);
}
errors++;
}
}
}
else {
const err65 = {instancePath:instancePath+"/nodes/" + i1,schemaPath:"#/properties/nodes/items/type",keyword:"type",params:{type: "object"},message:"must be object"};
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
const err66 = {instancePath:instancePath+"/nodes",schemaPath:"#/properties/nodes/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err66];
}
else {
vErrors.push(err66);
}
errors++;
}
}
if(data.edges !== undefined){
let data24 = data.edges;
if(Array.isArray(data24)){
if(data24.length > 30000){
const err67 = {instancePath:instancePath+"/edges",schemaPath:"#/properties/edges/maxItems",keyword:"maxItems",params:{limit: 30000},message:"must NOT have more than 30000 items"};
if(vErrors === null){
vErrors = [err67];
}
else {
vErrors.push(err67);
}
errors++;
}
const len3 = data24.length;
for(let i3=0; i3<len3; i3++){
let data25 = data24[i3];
if(data25 && typeof data25 == "object" && !Array.isArray(data25)){
if(data25.id === undefined){
const err68 = {instancePath:instancePath+"/edges/" + i3,schemaPath:"#/properties/edges/items/required",keyword:"required",params:{missingProperty: "id"},message:"must have required property '"+"id"+"'"};
if(vErrors === null){
vErrors = [err68];
}
else {
vErrors.push(err68);
}
errors++;
}
if(data25.from === undefined){
const err69 = {instancePath:instancePath+"/edges/" + i3,schemaPath:"#/properties/edges/items/required",keyword:"required",params:{missingProperty: "from"},message:"must have required property '"+"from"+"'"};
if(vErrors === null){
vErrors = [err69];
}
else {
vErrors.push(err69);
}
errors++;
}
if(data25.to === undefined){
const err70 = {instancePath:instancePath+"/edges/" + i3,schemaPath:"#/properties/edges/items/required",keyword:"required",params:{missingProperty: "to"},message:"must have required property '"+"to"+"'"};
if(vErrors === null){
vErrors = [err70];
}
else {
vErrors.push(err70);
}
errors++;
}
if(data25.type === undefined){
const err71 = {instancePath:instancePath+"/edges/" + i3,schemaPath:"#/properties/edges/items/required",keyword:"required",params:{missingProperty: "type"},message:"must have required property '"+"type"+"'"};
if(vErrors === null){
vErrors = [err71];
}
else {
vErrors.push(err71);
}
errors++;
}
if(data25.evidence === undefined){
const err72 = {instancePath:instancePath+"/edges/" + i3,schemaPath:"#/properties/edges/items/required",keyword:"required",params:{missingProperty: "evidence"},message:"must have required property '"+"evidence"+"'"};
if(vErrors === null){
vErrors = [err72];
}
else {
vErrors.push(err72);
}
errors++;
}
if(data25.confidence === undefined){
const err73 = {instancePath:instancePath+"/edges/" + i3,schemaPath:"#/properties/edges/items/required",keyword:"required",params:{missingProperty: "confidence"},message:"must have required property '"+"confidence"+"'"};
if(vErrors === null){
vErrors = [err73];
}
else {
vErrors.push(err73);
}
errors++;
}
if(data25.input === undefined){
const err74 = {instancePath:instancePath+"/edges/" + i3,schemaPath:"#/properties/edges/items/required",keyword:"required",params:{missingProperty: "input"},message:"must have required property '"+"input"+"'"};
if(vErrors === null){
vErrors = [err74];
}
else {
vErrors.push(err74);
}
errors++;
}
if(data25.record_id === undefined){
const err75 = {instancePath:instancePath+"/edges/" + i3,schemaPath:"#/properties/edges/items/required",keyword:"required",params:{missingProperty: "record_id"},message:"must have required property '"+"record_id"+"'"};
if(vErrors === null){
vErrors = [err75];
}
else {
vErrors.push(err75);
}
errors++;
}
if(data25.method === undefined){
const err76 = {instancePath:instancePath+"/edges/" + i3,schemaPath:"#/properties/edges/items/required",keyword:"required",params:{missingProperty: "method"},message:"must have required property '"+"method"+"'"};
if(vErrors === null){
vErrors = [err76];
}
else {
vErrors.push(err76);
}
errors++;
}
if(data25.assumptions === undefined){
const err77 = {instancePath:instancePath+"/edges/" + i3,schemaPath:"#/properties/edges/items/required",keyword:"required",params:{missingProperty: "assumptions"},message:"must have required property '"+"assumptions"+"'"};
if(vErrors === null){
vErrors = [err77];
}
else {
vErrors.push(err77);
}
errors++;
}
if(data25.limitations === undefined){
const err78 = {instancePath:instancePath+"/edges/" + i3,schemaPath:"#/properties/edges/items/required",keyword:"required",params:{missingProperty: "limitations"},message:"must have required property '"+"limitations"+"'"};
if(vErrors === null){
vErrors = [err78];
}
else {
vErrors.push(err78);
}
errors++;
}
for(const key3 in data25){
if(!(func9.call(schema11.properties.edges.items.properties, key3))){
const err79 = {instancePath:instancePath+"/edges/" + i3,schemaPath:"#/properties/edges/items/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key3},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err79];
}
else {
vErrors.push(err79);
}
errors++;
}
}
if(data25.id !== undefined){
let data26 = data25.id;
if(typeof data26 === "string"){
if(func2(data26) < 1){
const err80 = {instancePath:instancePath+"/edges/" + i3+"/id",schemaPath:"#/properties/edges/items/properties/id/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
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
const err81 = {instancePath:instancePath+"/edges/" + i3+"/id",schemaPath:"#/properties/edges/items/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err81];
}
else {
vErrors.push(err81);
}
errors++;
}
}
if(data25.from !== undefined){
let data27 = data25.from;
if(typeof data27 === "string"){
if(func2(data27) < 1){
const err82 = {instancePath:instancePath+"/edges/" + i3+"/from",schemaPath:"#/properties/edges/items/properties/from/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err82];
}
else {
vErrors.push(err82);
}
errors++;
}
}
else {
const err83 = {instancePath:instancePath+"/edges/" + i3+"/from",schemaPath:"#/properties/edges/items/properties/from/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err83];
}
else {
vErrors.push(err83);
}
errors++;
}
}
if(data25.to !== undefined){
let data28 = data25.to;
if(typeof data28 === "string"){
if(func2(data28) < 1){
const err84 = {instancePath:instancePath+"/edges/" + i3+"/to",schemaPath:"#/properties/edges/items/properties/to/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
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
const err85 = {instancePath:instancePath+"/edges/" + i3+"/to",schemaPath:"#/properties/edges/items/properties/to/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err85];
}
else {
vErrors.push(err85);
}
errors++;
}
}
if(data25.type !== undefined){
let data29 = data25.type;
if(!(((((((data29 === "glacier_lake") || (data29 === "lake_river")) || (data29 === "river_downstream")) || (data29 === "hazard_exposure")) || (data29 === "landslide_blockage")) || (data29 === "scenario_exposure")) || (data29 === "footprint_intersection"))){
const err86 = {instancePath:instancePath+"/edges/" + i3+"/type",schemaPath:"#/properties/edges/items/properties/type/enum",keyword:"enum",params:{allowedValues: schema11.properties.edges.items.properties.type.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err86];
}
else {
vErrors.push(err86);
}
errors++;
}
}
if(data25.evidence !== undefined){
let data30 = data25.evidence;
if(!((((data30 === "observed") || (data30 === "derived")) || (data30 === "inferred")) || (data30 === "modelled"))){
const err87 = {instancePath:instancePath+"/edges/" + i3+"/evidence",schemaPath:"#/properties/edges/items/properties/evidence/enum",keyword:"enum",params:{allowedValues: schema11.properties.edges.items.properties.evidence.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err87];
}
else {
vErrors.push(err87);
}
errors++;
}
}
if(data25.confidence !== undefined){
let data31 = data25.confidence;
if(!((((data31 === null) || (data31 === "low")) || (data31 === "medium")) || (data31 === "high"))){
const err88 = {instancePath:instancePath+"/edges/" + i3+"/confidence",schemaPath:"#/properties/edges/items/properties/confidence/enum",keyword:"enum",params:{allowedValues: schema11.properties.edges.items.properties.confidence.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err88];
}
else {
vErrors.push(err88);
}
errors++;
}
}
if(data25.input !== undefined){
let data32 = data25.input;
if(!(((typeof data32 == "number") && (!(data32 % 1) && !isNaN(data32))) && (isFinite(data32)))){
const err89 = {instancePath:instancePath+"/edges/" + i3+"/input",schemaPath:"#/properties/edges/items/properties/input/type",keyword:"type",params:{type: "integer"},message:"must be integer"};
if(vErrors === null){
vErrors = [err89];
}
else {
vErrors.push(err89);
}
errors++;
}
if((typeof data32 == "number") && (isFinite(data32))){
if(data32 < 0 || isNaN(data32)){
const err90 = {instancePath:instancePath+"/edges/" + i3+"/input",schemaPath:"#/properties/edges/items/properties/input/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
if(vErrors === null){
vErrors = [err90];
}
else {
vErrors.push(err90);
}
errors++;
}
}
}
if(data25.record_id !== undefined){
let data33 = data25.record_id;
if(typeof data33 === "string"){
if(func2(data33) < 1){
const err91 = {instancePath:instancePath+"/edges/" + i3+"/record_id",schemaPath:"#/properties/edges/items/properties/record_id/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
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
const err92 = {instancePath:instancePath+"/edges/" + i3+"/record_id",schemaPath:"#/properties/edges/items/properties/record_id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err92];
}
else {
vErrors.push(err92);
}
errors++;
}
}
if(data25.method !== undefined){
let data34 = data25.method;
if(typeof data34 === "string"){
if(func2(data34) < 1){
const err93 = {instancePath:instancePath+"/edges/" + i3+"/method",schemaPath:"#/properties/edges/items/properties/method/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err93];
}
else {
vErrors.push(err93);
}
errors++;
}
}
else {
const err94 = {instancePath:instancePath+"/edges/" + i3+"/method",schemaPath:"#/properties/edges/items/properties/method/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err94];
}
else {
vErrors.push(err94);
}
errors++;
}
}
if(data25.assumptions !== undefined){
let data35 = data25.assumptions;
if(Array.isArray(data35)){
const len4 = data35.length;
for(let i4=0; i4<len4; i4++){
let data36 = data35[i4];
if(typeof data36 === "string"){
if(func2(data36) < 1){
const err95 = {instancePath:instancePath+"/edges/" + i3+"/assumptions/" + i4,schemaPath:"#/properties/edges/items/properties/assumptions/items/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err95];
}
else {
vErrors.push(err95);
}
errors++;
}
}
else {
const err96 = {instancePath:instancePath+"/edges/" + i3+"/assumptions/" + i4,schemaPath:"#/properties/edges/items/properties/assumptions/items/type",keyword:"type",params:{type: "string"},message:"must be string"};
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
const err97 = {instancePath:instancePath+"/edges/" + i3+"/assumptions",schemaPath:"#/properties/edges/items/properties/assumptions/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err97];
}
else {
vErrors.push(err97);
}
errors++;
}
}
if(data25.limitations !== undefined){
let data37 = data25.limitations;
if(Array.isArray(data37)){
if(data37.length < 1){
const err98 = {instancePath:instancePath+"/edges/" + i3+"/limitations",schemaPath:"#/properties/edges/items/properties/limitations/minItems",keyword:"minItems",params:{limit: 1},message:"must NOT have fewer than 1 items"};
if(vErrors === null){
vErrors = [err98];
}
else {
vErrors.push(err98);
}
errors++;
}
const len5 = data37.length;
for(let i5=0; i5<len5; i5++){
let data38 = data37[i5];
if(typeof data38 === "string"){
if(func2(data38) < 1){
const err99 = {instancePath:instancePath+"/edges/" + i3+"/limitations/" + i5,schemaPath:"#/properties/edges/items/properties/limitations/items/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
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
const err100 = {instancePath:instancePath+"/edges/" + i3+"/limitations/" + i5,schemaPath:"#/properties/edges/items/properties/limitations/items/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err100];
}
else {
vErrors.push(err100);
}
errors++;
}
}
}
else {
const err101 = {instancePath:instancePath+"/edges/" + i3+"/limitations",schemaPath:"#/properties/edges/items/properties/limitations/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err101];
}
else {
vErrors.push(err101);
}
errors++;
}
}
}
else {
const err102 = {instancePath:instancePath+"/edges/" + i3,schemaPath:"#/properties/edges/items/type",keyword:"type",params:{type: "object"},message:"must be object"};
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
else {
const err103 = {instancePath:instancePath+"/edges",schemaPath:"#/properties/edges/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err103];
}
else {
vErrors.push(err103);
}
errors++;
}
}
if(data.limitations !== undefined){
let data39 = data.limitations;
if(Array.isArray(data39)){
if(data39.length < 1){
const err104 = {instancePath:instancePath+"/limitations",schemaPath:"#/properties/limitations/minItems",keyword:"minItems",params:{limit: 1},message:"must NOT have fewer than 1 items"};
if(vErrors === null){
vErrors = [err104];
}
else {
vErrors.push(err104);
}
errors++;
}
const len6 = data39.length;
for(let i6=0; i6<len6; i6++){
let data40 = data39[i6];
if(typeof data40 === "string"){
if(func2(data40) < 1){
const err105 = {instancePath:instancePath+"/limitations/" + i6,schemaPath:"#/properties/limitations/items/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
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
const err106 = {instancePath:instancePath+"/limitations/" + i6,schemaPath:"#/properties/limitations/items/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err106];
}
else {
vErrors.push(err106);
}
errors++;
}
}
}
else {
const err107 = {instancePath:instancePath+"/limitations",schemaPath:"#/properties/limitations/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err107];
}
else {
vErrors.push(err107);
}
errors++;
}
}
}
else {
const err108 = {instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err108];
}
else {
vErrors.push(err108);
}
errors++;
}
validate10.errors = vErrors;
return errors === 0;
}

