// Generated from search.schema.json; run npm run contracts:generate. Do not edit.
"use strict";
module.exports = validate10;
module.exports.default = validate10;
const schema11 = {"$schema":"http://json-schema.org/draft-07/schema#","$id":"https://himalayan-disaster-atlas.invalid/schemas/search.schema.json","type":"object","additionalProperties":false,"required":["kind","schema_version","version","shards","inputs","limitations"],"properties":{"kind":{"const":"search-index"},"schema_version":{"const":"1.0.0"},"version":{"const":"1.0.0"},"shards":{"type":"array","minItems":8,"maxItems":8,"items":{"type":"object","additionalProperties":false,"required":["id","path","sha256","byte_size","decoded_byte_size","count"],"properties":{"id":{"enum":["core","infra-network","infra-schools","infra-services","events-2015-2020","events-2021-2024","events-2025-2026","earthquakes"]},"path":{"type":"string","pattern":"^/data/atlas-search-index/1\\.0\\.0/[a-z0-9-]+\\.json\\.gz$"},"sha256":{"type":"string","pattern":"^[a-f0-9]{64}$"},"byte_size":{"type":"integer","minimum":1,"maximum":2097152},"decoded_byte_size":{"type":"integer","minimum":1,"maximum":16777216},"count":{"type":"integer","minimum":1,"maximum":100000}}}},"inputs":{"type":"array","minItems":1,"maxItems":40,"items":{"type":"object","additionalProperties":false,"required":["path","sha256","byte_size"],"properties":{"path":{"type":"string","pattern":"^/data/[a-z0-9-]+/[0-9.]+/manifest.json$"},"sha256":{"type":"string","pattern":"^[a-f0-9]{64}$"},"byte_size":{"type":"integer","minimum":1,"maximum":262144}}}},"limitations":{"type":"array","minItems":2,"items":{"type":"string","minLength":1}}}};
const pattern0 = new RegExp("^/data/atlas-search-index/1\\.0\\.0/[a-z0-9-]+\\.json\\.gz$", "u");
const pattern1 = new RegExp("^[a-f0-9]{64}$", "u");
const pattern2 = new RegExp("^/data/[a-z0-9-]+/[0-9.]+/manifest.json$", "u");
const func2 = require("ajv/dist/runtime/ucs2length").default;

function validate10(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
/*# sourceURL="https://himalayan-disaster-atlas.invalid/schemas/search.schema.json" */;
let vErrors = null;
let errors = 0;
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.kind === undefined){
const err0 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "kind"},message:"must have required property '"+"kind"+"'"};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
if(data.schema_version === undefined){
const err1 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "schema_version"},message:"must have required property '"+"schema_version"+"'"};
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
if(data.shards === undefined){
const err3 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "shards"},message:"must have required property '"+"shards"+"'"};
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
if(data.limitations === undefined){
const err5 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "limitations"},message:"must have required property '"+"limitations"+"'"};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
for(const key0 in data){
if(!((((((key0 === "kind") || (key0 === "schema_version")) || (key0 === "version")) || (key0 === "shards")) || (key0 === "inputs")) || (key0 === "limitations"))){
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
if(data.kind !== undefined){
if("search-index" !== data.kind){
const err7 = {instancePath:instancePath+"/kind",schemaPath:"#/properties/kind/const",keyword:"const",params:{allowedValue: "search-index"},message:"must be equal to constant"};
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
if(data.version !== undefined){
if("1.0.0" !== data.version){
const err9 = {instancePath:instancePath+"/version",schemaPath:"#/properties/version/const",keyword:"const",params:{allowedValue: "1.0.0"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err9];
}
else {
vErrors.push(err9);
}
errors++;
}
}
if(data.shards !== undefined){
let data3 = data.shards;
if(Array.isArray(data3)){
if(data3.length > 8){
const err10 = {instancePath:instancePath+"/shards",schemaPath:"#/properties/shards/maxItems",keyword:"maxItems",params:{limit: 8},message:"must NOT have more than 8 items"};
if(vErrors === null){
vErrors = [err10];
}
else {
vErrors.push(err10);
}
errors++;
}
if(data3.length < 8){
const err11 = {instancePath:instancePath+"/shards",schemaPath:"#/properties/shards/minItems",keyword:"minItems",params:{limit: 8},message:"must NOT have fewer than 8 items"};
if(vErrors === null){
vErrors = [err11];
}
else {
vErrors.push(err11);
}
errors++;
}
const len0 = data3.length;
for(let i0=0; i0<len0; i0++){
let data4 = data3[i0];
if(data4 && typeof data4 == "object" && !Array.isArray(data4)){
if(data4.id === undefined){
const err12 = {instancePath:instancePath+"/shards/" + i0,schemaPath:"#/properties/shards/items/required",keyword:"required",params:{missingProperty: "id"},message:"must have required property '"+"id"+"'"};
if(vErrors === null){
vErrors = [err12];
}
else {
vErrors.push(err12);
}
errors++;
}
if(data4.path === undefined){
const err13 = {instancePath:instancePath+"/shards/" + i0,schemaPath:"#/properties/shards/items/required",keyword:"required",params:{missingProperty: "path"},message:"must have required property '"+"path"+"'"};
if(vErrors === null){
vErrors = [err13];
}
else {
vErrors.push(err13);
}
errors++;
}
if(data4.sha256 === undefined){
const err14 = {instancePath:instancePath+"/shards/" + i0,schemaPath:"#/properties/shards/items/required",keyword:"required",params:{missingProperty: "sha256"},message:"must have required property '"+"sha256"+"'"};
if(vErrors === null){
vErrors = [err14];
}
else {
vErrors.push(err14);
}
errors++;
}
if(data4.byte_size === undefined){
const err15 = {instancePath:instancePath+"/shards/" + i0,schemaPath:"#/properties/shards/items/required",keyword:"required",params:{missingProperty: "byte_size"},message:"must have required property '"+"byte_size"+"'"};
if(vErrors === null){
vErrors = [err15];
}
else {
vErrors.push(err15);
}
errors++;
}
if(data4.decoded_byte_size === undefined){
const err16 = {instancePath:instancePath+"/shards/" + i0,schemaPath:"#/properties/shards/items/required",keyword:"required",params:{missingProperty: "decoded_byte_size"},message:"must have required property '"+"decoded_byte_size"+"'"};
if(vErrors === null){
vErrors = [err16];
}
else {
vErrors.push(err16);
}
errors++;
}
if(data4.count === undefined){
const err17 = {instancePath:instancePath+"/shards/" + i0,schemaPath:"#/properties/shards/items/required",keyword:"required",params:{missingProperty: "count"},message:"must have required property '"+"count"+"'"};
if(vErrors === null){
vErrors = [err17];
}
else {
vErrors.push(err17);
}
errors++;
}
for(const key1 in data4){
if(!((((((key1 === "id") || (key1 === "path")) || (key1 === "sha256")) || (key1 === "byte_size")) || (key1 === "decoded_byte_size")) || (key1 === "count"))){
const err18 = {instancePath:instancePath+"/shards/" + i0,schemaPath:"#/properties/shards/items/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key1},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err18];
}
else {
vErrors.push(err18);
}
errors++;
}
}
if(data4.id !== undefined){
let data5 = data4.id;
if(!((((((((data5 === "core") || (data5 === "infra-network")) || (data5 === "infra-schools")) || (data5 === "infra-services")) || (data5 === "events-2015-2020")) || (data5 === "events-2021-2024")) || (data5 === "events-2025-2026")) || (data5 === "earthquakes"))){
const err19 = {instancePath:instancePath+"/shards/" + i0+"/id",schemaPath:"#/properties/shards/items/properties/id/enum",keyword:"enum",params:{allowedValues: schema11.properties.shards.items.properties.id.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err19];
}
else {
vErrors.push(err19);
}
errors++;
}
}
if(data4.path !== undefined){
let data6 = data4.path;
if(typeof data6 === "string"){
if(!pattern0.test(data6)){
const err20 = {instancePath:instancePath+"/shards/" + i0+"/path",schemaPath:"#/properties/shards/items/properties/path/pattern",keyword:"pattern",params:{pattern: "^/data/atlas-search-index/1\\.0\\.0/[a-z0-9-]+\\.json\\.gz$"},message:"must match pattern \""+"^/data/atlas-search-index/1\\.0\\.0/[a-z0-9-]+\\.json\\.gz$"+"\""};
if(vErrors === null){
vErrors = [err20];
}
else {
vErrors.push(err20);
}
errors++;
}
}
else {
const err21 = {instancePath:instancePath+"/shards/" + i0+"/path",schemaPath:"#/properties/shards/items/properties/path/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err21];
}
else {
vErrors.push(err21);
}
errors++;
}
}
if(data4.sha256 !== undefined){
let data7 = data4.sha256;
if(typeof data7 === "string"){
if(!pattern1.test(data7)){
const err22 = {instancePath:instancePath+"/shards/" + i0+"/sha256",schemaPath:"#/properties/shards/items/properties/sha256/pattern",keyword:"pattern",params:{pattern: "^[a-f0-9]{64}$"},message:"must match pattern \""+"^[a-f0-9]{64}$"+"\""};
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
const err23 = {instancePath:instancePath+"/shards/" + i0+"/sha256",schemaPath:"#/properties/shards/items/properties/sha256/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err23];
}
else {
vErrors.push(err23);
}
errors++;
}
}
if(data4.byte_size !== undefined){
let data8 = data4.byte_size;
if(!(((typeof data8 == "number") && (!(data8 % 1) && !isNaN(data8))) && (isFinite(data8)))){
const err24 = {instancePath:instancePath+"/shards/" + i0+"/byte_size",schemaPath:"#/properties/shards/items/properties/byte_size/type",keyword:"type",params:{type: "integer"},message:"must be integer"};
if(vErrors === null){
vErrors = [err24];
}
else {
vErrors.push(err24);
}
errors++;
}
if((typeof data8 == "number") && (isFinite(data8))){
if(data8 > 2097152 || isNaN(data8)){
const err25 = {instancePath:instancePath+"/shards/" + i0+"/byte_size",schemaPath:"#/properties/shards/items/properties/byte_size/maximum",keyword:"maximum",params:{comparison: "<=", limit: 2097152},message:"must be <= 2097152"};
if(vErrors === null){
vErrors = [err25];
}
else {
vErrors.push(err25);
}
errors++;
}
if(data8 < 1 || isNaN(data8)){
const err26 = {instancePath:instancePath+"/shards/" + i0+"/byte_size",schemaPath:"#/properties/shards/items/properties/byte_size/minimum",keyword:"minimum",params:{comparison: ">=", limit: 1},message:"must be >= 1"};
if(vErrors === null){
vErrors = [err26];
}
else {
vErrors.push(err26);
}
errors++;
}
}
}
if(data4.decoded_byte_size !== undefined){
let data9 = data4.decoded_byte_size;
if(!(((typeof data9 == "number") && (!(data9 % 1) && !isNaN(data9))) && (isFinite(data9)))){
const err27 = {instancePath:instancePath+"/shards/" + i0+"/decoded_byte_size",schemaPath:"#/properties/shards/items/properties/decoded_byte_size/type",keyword:"type",params:{type: "integer"},message:"must be integer"};
if(vErrors === null){
vErrors = [err27];
}
else {
vErrors.push(err27);
}
errors++;
}
if((typeof data9 == "number") && (isFinite(data9))){
if(data9 > 16777216 || isNaN(data9)){
const err28 = {instancePath:instancePath+"/shards/" + i0+"/decoded_byte_size",schemaPath:"#/properties/shards/items/properties/decoded_byte_size/maximum",keyword:"maximum",params:{comparison: "<=", limit: 16777216},message:"must be <= 16777216"};
if(vErrors === null){
vErrors = [err28];
}
else {
vErrors.push(err28);
}
errors++;
}
if(data9 < 1 || isNaN(data9)){
const err29 = {instancePath:instancePath+"/shards/" + i0+"/decoded_byte_size",schemaPath:"#/properties/shards/items/properties/decoded_byte_size/minimum",keyword:"minimum",params:{comparison: ">=", limit: 1},message:"must be >= 1"};
if(vErrors === null){
vErrors = [err29];
}
else {
vErrors.push(err29);
}
errors++;
}
}
}
if(data4.count !== undefined){
let data10 = data4.count;
if(!(((typeof data10 == "number") && (!(data10 % 1) && !isNaN(data10))) && (isFinite(data10)))){
const err30 = {instancePath:instancePath+"/shards/" + i0+"/count",schemaPath:"#/properties/shards/items/properties/count/type",keyword:"type",params:{type: "integer"},message:"must be integer"};
if(vErrors === null){
vErrors = [err30];
}
else {
vErrors.push(err30);
}
errors++;
}
if((typeof data10 == "number") && (isFinite(data10))){
if(data10 > 100000 || isNaN(data10)){
const err31 = {instancePath:instancePath+"/shards/" + i0+"/count",schemaPath:"#/properties/shards/items/properties/count/maximum",keyword:"maximum",params:{comparison: "<=", limit: 100000},message:"must be <= 100000"};
if(vErrors === null){
vErrors = [err31];
}
else {
vErrors.push(err31);
}
errors++;
}
if(data10 < 1 || isNaN(data10)){
const err32 = {instancePath:instancePath+"/shards/" + i0+"/count",schemaPath:"#/properties/shards/items/properties/count/minimum",keyword:"minimum",params:{comparison: ">=", limit: 1},message:"must be >= 1"};
if(vErrors === null){
vErrors = [err32];
}
else {
vErrors.push(err32);
}
errors++;
}
}
}
}
else {
const err33 = {instancePath:instancePath+"/shards/" + i0,schemaPath:"#/properties/shards/items/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err33];
}
else {
vErrors.push(err33);
}
errors++;
}
}
}
else {
const err34 = {instancePath:instancePath+"/shards",schemaPath:"#/properties/shards/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err34];
}
else {
vErrors.push(err34);
}
errors++;
}
}
if(data.inputs !== undefined){
let data11 = data.inputs;
if(Array.isArray(data11)){
if(data11.length > 40){
const err35 = {instancePath:instancePath+"/inputs",schemaPath:"#/properties/inputs/maxItems",keyword:"maxItems",params:{limit: 40},message:"must NOT have more than 40 items"};
if(vErrors === null){
vErrors = [err35];
}
else {
vErrors.push(err35);
}
errors++;
}
if(data11.length < 1){
const err36 = {instancePath:instancePath+"/inputs",schemaPath:"#/properties/inputs/minItems",keyword:"minItems",params:{limit: 1},message:"must NOT have fewer than 1 items"};
if(vErrors === null){
vErrors = [err36];
}
else {
vErrors.push(err36);
}
errors++;
}
const len1 = data11.length;
for(let i1=0; i1<len1; i1++){
let data12 = data11[i1];
if(data12 && typeof data12 == "object" && !Array.isArray(data12)){
if(data12.path === undefined){
const err37 = {instancePath:instancePath+"/inputs/" + i1,schemaPath:"#/properties/inputs/items/required",keyword:"required",params:{missingProperty: "path"},message:"must have required property '"+"path"+"'"};
if(vErrors === null){
vErrors = [err37];
}
else {
vErrors.push(err37);
}
errors++;
}
if(data12.sha256 === undefined){
const err38 = {instancePath:instancePath+"/inputs/" + i1,schemaPath:"#/properties/inputs/items/required",keyword:"required",params:{missingProperty: "sha256"},message:"must have required property '"+"sha256"+"'"};
if(vErrors === null){
vErrors = [err38];
}
else {
vErrors.push(err38);
}
errors++;
}
if(data12.byte_size === undefined){
const err39 = {instancePath:instancePath+"/inputs/" + i1,schemaPath:"#/properties/inputs/items/required",keyword:"required",params:{missingProperty: "byte_size"},message:"must have required property '"+"byte_size"+"'"};
if(vErrors === null){
vErrors = [err39];
}
else {
vErrors.push(err39);
}
errors++;
}
for(const key2 in data12){
if(!(((key2 === "path") || (key2 === "sha256")) || (key2 === "byte_size"))){
const err40 = {instancePath:instancePath+"/inputs/" + i1,schemaPath:"#/properties/inputs/items/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key2},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err40];
}
else {
vErrors.push(err40);
}
errors++;
}
}
if(data12.path !== undefined){
let data13 = data12.path;
if(typeof data13 === "string"){
if(!pattern2.test(data13)){
const err41 = {instancePath:instancePath+"/inputs/" + i1+"/path",schemaPath:"#/properties/inputs/items/properties/path/pattern",keyword:"pattern",params:{pattern: "^/data/[a-z0-9-]+/[0-9.]+/manifest.json$"},message:"must match pattern \""+"^/data/[a-z0-9-]+/[0-9.]+/manifest.json$"+"\""};
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
const err42 = {instancePath:instancePath+"/inputs/" + i1+"/path",schemaPath:"#/properties/inputs/items/properties/path/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err42];
}
else {
vErrors.push(err42);
}
errors++;
}
}
if(data12.sha256 !== undefined){
let data14 = data12.sha256;
if(typeof data14 === "string"){
if(!pattern1.test(data14)){
const err43 = {instancePath:instancePath+"/inputs/" + i1+"/sha256",schemaPath:"#/properties/inputs/items/properties/sha256/pattern",keyword:"pattern",params:{pattern: "^[a-f0-9]{64}$"},message:"must match pattern \""+"^[a-f0-9]{64}$"+"\""};
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
const err44 = {instancePath:instancePath+"/inputs/" + i1+"/sha256",schemaPath:"#/properties/inputs/items/properties/sha256/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err44];
}
else {
vErrors.push(err44);
}
errors++;
}
}
if(data12.byte_size !== undefined){
let data15 = data12.byte_size;
if(!(((typeof data15 == "number") && (!(data15 % 1) && !isNaN(data15))) && (isFinite(data15)))){
const err45 = {instancePath:instancePath+"/inputs/" + i1+"/byte_size",schemaPath:"#/properties/inputs/items/properties/byte_size/type",keyword:"type",params:{type: "integer"},message:"must be integer"};
if(vErrors === null){
vErrors = [err45];
}
else {
vErrors.push(err45);
}
errors++;
}
if((typeof data15 == "number") && (isFinite(data15))){
if(data15 > 262144 || isNaN(data15)){
const err46 = {instancePath:instancePath+"/inputs/" + i1+"/byte_size",schemaPath:"#/properties/inputs/items/properties/byte_size/maximum",keyword:"maximum",params:{comparison: "<=", limit: 262144},message:"must be <= 262144"};
if(vErrors === null){
vErrors = [err46];
}
else {
vErrors.push(err46);
}
errors++;
}
if(data15 < 1 || isNaN(data15)){
const err47 = {instancePath:instancePath+"/inputs/" + i1+"/byte_size",schemaPath:"#/properties/inputs/items/properties/byte_size/minimum",keyword:"minimum",params:{comparison: ">=", limit: 1},message:"must be >= 1"};
if(vErrors === null){
vErrors = [err47];
}
else {
vErrors.push(err47);
}
errors++;
}
}
}
}
else {
const err48 = {instancePath:instancePath+"/inputs/" + i1,schemaPath:"#/properties/inputs/items/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err48];
}
else {
vErrors.push(err48);
}
errors++;
}
}
}
else {
const err49 = {instancePath:instancePath+"/inputs",schemaPath:"#/properties/inputs/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err49];
}
else {
vErrors.push(err49);
}
errors++;
}
}
if(data.limitations !== undefined){
let data16 = data.limitations;
if(Array.isArray(data16)){
if(data16.length < 2){
const err50 = {instancePath:instancePath+"/limitations",schemaPath:"#/properties/limitations/minItems",keyword:"minItems",params:{limit: 2},message:"must NOT have fewer than 2 items"};
if(vErrors === null){
vErrors = [err50];
}
else {
vErrors.push(err50);
}
errors++;
}
const len2 = data16.length;
for(let i2=0; i2<len2; i2++){
let data17 = data16[i2];
if(typeof data17 === "string"){
if(func2(data17) < 1){
const err51 = {instancePath:instancePath+"/limitations/" + i2,schemaPath:"#/properties/limitations/items/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
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
const err52 = {instancePath:instancePath+"/limitations/" + i2,schemaPath:"#/properties/limitations/items/type",keyword:"type",params:{type: "string"},message:"must be string"};
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
else {
const err53 = {instancePath:instancePath+"/limitations",schemaPath:"#/properties/limitations/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err53];
}
else {
vErrors.push(err53);
}
errors++;
}
}
}
else {
const err54 = {instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err54];
}
else {
vErrors.push(err54);
}
errors++;
}
validate10.errors = vErrors;
return errors === 0;
}

