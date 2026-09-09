// Generated from search-shard.schema.json; run npm run contracts:generate. Do not edit.
"use strict";
module.exports = validate10;
module.exports.default = validate10;
const schema11 = {"$schema":"http://json-schema.org/draft-07/schema#","$id":"https://himalayan-disaster-atlas.invalid/schemas/search-shard.schema.json","type":"array","maxItems":100000,"items":{"type":"object","additionalProperties":false,"required":["key","type","dataset_id","dataset_version","feature_id","source_id","name","aliases","normalized_name","normalized_aliases","context","longitude","latitude","date","manifest_path","detail_href"],"properties":{"key":{"type":"string","minLength":1},"type":{"enum":["administrative_unit","mountain","river","glacier","glacial_lake","hydropower","infrastructure","event"]},"dataset_id":{"type":"string","minLength":1},"dataset_version":{"type":"string","minLength":1},"feature_id":{"type":"string","minLength":1},"source_id":{"type":"string","minLength":1},"name":{"type":"string","minLength":1},"aliases":{"type":"array","maxItems":40,"items":{"type":"string","minLength":1}},"normalized_name":{"type":"string","minLength":1},"normalized_aliases":{"type":"array","maxItems":40,"items":{"type":"string","minLength":1}},"context":{"type":"string","minLength":1},"longitude":{"type":"number","minimum":-180,"maximum":180},"latitude":{"type":"number","minimum":-90,"maximum":90},"date":{"type":["string","null"]},"manifest_path":{"type":"string","pattern":"^/data/"},"detail_href":{"type":["string","null"],"pattern":"^/"}}}};
const func2 = Object.prototype.hasOwnProperty;
const func3 = require("ajv/dist/runtime/ucs2length").default;
const pattern0 = new RegExp("^/data/", "u");
const pattern1 = new RegExp("^/", "u");

function validate10(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
/*# sourceURL="https://himalayan-disaster-atlas.invalid/schemas/search-shard.schema.json" */;
let vErrors = null;
let errors = 0;
if(Array.isArray(data)){
if(data.length > 100000){
const err0 = {instancePath,schemaPath:"#/maxItems",keyword:"maxItems",params:{limit: 100000},message:"must NOT have more than 100000 items"};
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
if(data0 && typeof data0 == "object" && !Array.isArray(data0)){
if(data0.key === undefined){
const err1 = {instancePath:instancePath+"/" + i0,schemaPath:"#/items/required",keyword:"required",params:{missingProperty: "key"},message:"must have required property '"+"key"+"'"};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
if(data0.type === undefined){
const err2 = {instancePath:instancePath+"/" + i0,schemaPath:"#/items/required",keyword:"required",params:{missingProperty: "type"},message:"must have required property '"+"type"+"'"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
if(data0.dataset_id === undefined){
const err3 = {instancePath:instancePath+"/" + i0,schemaPath:"#/items/required",keyword:"required",params:{missingProperty: "dataset_id"},message:"must have required property '"+"dataset_id"+"'"};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
if(data0.dataset_version === undefined){
const err4 = {instancePath:instancePath+"/" + i0,schemaPath:"#/items/required",keyword:"required",params:{missingProperty: "dataset_version"},message:"must have required property '"+"dataset_version"+"'"};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
if(data0.feature_id === undefined){
const err5 = {instancePath:instancePath+"/" + i0,schemaPath:"#/items/required",keyword:"required",params:{missingProperty: "feature_id"},message:"must have required property '"+"feature_id"+"'"};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
if(data0.source_id === undefined){
const err6 = {instancePath:instancePath+"/" + i0,schemaPath:"#/items/required",keyword:"required",params:{missingProperty: "source_id"},message:"must have required property '"+"source_id"+"'"};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
if(data0.name === undefined){
const err7 = {instancePath:instancePath+"/" + i0,schemaPath:"#/items/required",keyword:"required",params:{missingProperty: "name"},message:"must have required property '"+"name"+"'"};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
}
if(data0.aliases === undefined){
const err8 = {instancePath:instancePath+"/" + i0,schemaPath:"#/items/required",keyword:"required",params:{missingProperty: "aliases"},message:"must have required property '"+"aliases"+"'"};
if(vErrors === null){
vErrors = [err8];
}
else {
vErrors.push(err8);
}
errors++;
}
if(data0.normalized_name === undefined){
const err9 = {instancePath:instancePath+"/" + i0,schemaPath:"#/items/required",keyword:"required",params:{missingProperty: "normalized_name"},message:"must have required property '"+"normalized_name"+"'"};
if(vErrors === null){
vErrors = [err9];
}
else {
vErrors.push(err9);
}
errors++;
}
if(data0.normalized_aliases === undefined){
const err10 = {instancePath:instancePath+"/" + i0,schemaPath:"#/items/required",keyword:"required",params:{missingProperty: "normalized_aliases"},message:"must have required property '"+"normalized_aliases"+"'"};
if(vErrors === null){
vErrors = [err10];
}
else {
vErrors.push(err10);
}
errors++;
}
if(data0.context === undefined){
const err11 = {instancePath:instancePath+"/" + i0,schemaPath:"#/items/required",keyword:"required",params:{missingProperty: "context"},message:"must have required property '"+"context"+"'"};
if(vErrors === null){
vErrors = [err11];
}
else {
vErrors.push(err11);
}
errors++;
}
if(data0.longitude === undefined){
const err12 = {instancePath:instancePath+"/" + i0,schemaPath:"#/items/required",keyword:"required",params:{missingProperty: "longitude"},message:"must have required property '"+"longitude"+"'"};
if(vErrors === null){
vErrors = [err12];
}
else {
vErrors.push(err12);
}
errors++;
}
if(data0.latitude === undefined){
const err13 = {instancePath:instancePath+"/" + i0,schemaPath:"#/items/required",keyword:"required",params:{missingProperty: "latitude"},message:"must have required property '"+"latitude"+"'"};
if(vErrors === null){
vErrors = [err13];
}
else {
vErrors.push(err13);
}
errors++;
}
if(data0.date === undefined){
const err14 = {instancePath:instancePath+"/" + i0,schemaPath:"#/items/required",keyword:"required",params:{missingProperty: "date"},message:"must have required property '"+"date"+"'"};
if(vErrors === null){
vErrors = [err14];
}
else {
vErrors.push(err14);
}
errors++;
}
if(data0.manifest_path === undefined){
const err15 = {instancePath:instancePath+"/" + i0,schemaPath:"#/items/required",keyword:"required",params:{missingProperty: "manifest_path"},message:"must have required property '"+"manifest_path"+"'"};
if(vErrors === null){
vErrors = [err15];
}
else {
vErrors.push(err15);
}
errors++;
}
if(data0.detail_href === undefined){
const err16 = {instancePath:instancePath+"/" + i0,schemaPath:"#/items/required",keyword:"required",params:{missingProperty: "detail_href"},message:"must have required property '"+"detail_href"+"'"};
if(vErrors === null){
vErrors = [err16];
}
else {
vErrors.push(err16);
}
errors++;
}
for(const key0 in data0){
if(!(func2.call(schema11.items.properties, key0))){
const err17 = {instancePath:instancePath+"/" + i0,schemaPath:"#/items/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err17];
}
else {
vErrors.push(err17);
}
errors++;
}
}
if(data0.key !== undefined){
let data1 = data0.key;
if(typeof data1 === "string"){
if(func3(data1) < 1){
const err18 = {instancePath:instancePath+"/" + i0+"/key",schemaPath:"#/items/properties/key/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
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
const err19 = {instancePath:instancePath+"/" + i0+"/key",schemaPath:"#/items/properties/key/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err19];
}
else {
vErrors.push(err19);
}
errors++;
}
}
if(data0.type !== undefined){
let data2 = data0.type;
if(!((((((((data2 === "administrative_unit") || (data2 === "mountain")) || (data2 === "river")) || (data2 === "glacier")) || (data2 === "glacial_lake")) || (data2 === "hydropower")) || (data2 === "infrastructure")) || (data2 === "event"))){
const err20 = {instancePath:instancePath+"/" + i0+"/type",schemaPath:"#/items/properties/type/enum",keyword:"enum",params:{allowedValues: schema11.items.properties.type.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err20];
}
else {
vErrors.push(err20);
}
errors++;
}
}
if(data0.dataset_id !== undefined){
let data3 = data0.dataset_id;
if(typeof data3 === "string"){
if(func3(data3) < 1){
const err21 = {instancePath:instancePath+"/" + i0+"/dataset_id",schemaPath:"#/items/properties/dataset_id/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err21];
}
else {
vErrors.push(err21);
}
errors++;
}
}
else {
const err22 = {instancePath:instancePath+"/" + i0+"/dataset_id",schemaPath:"#/items/properties/dataset_id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err22];
}
else {
vErrors.push(err22);
}
errors++;
}
}
if(data0.dataset_version !== undefined){
let data4 = data0.dataset_version;
if(typeof data4 === "string"){
if(func3(data4) < 1){
const err23 = {instancePath:instancePath+"/" + i0+"/dataset_version",schemaPath:"#/items/properties/dataset_version/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
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
const err24 = {instancePath:instancePath+"/" + i0+"/dataset_version",schemaPath:"#/items/properties/dataset_version/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err24];
}
else {
vErrors.push(err24);
}
errors++;
}
}
if(data0.feature_id !== undefined){
let data5 = data0.feature_id;
if(typeof data5 === "string"){
if(func3(data5) < 1){
const err25 = {instancePath:instancePath+"/" + i0+"/feature_id",schemaPath:"#/items/properties/feature_id/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
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
const err26 = {instancePath:instancePath+"/" + i0+"/feature_id",schemaPath:"#/items/properties/feature_id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err26];
}
else {
vErrors.push(err26);
}
errors++;
}
}
if(data0.source_id !== undefined){
let data6 = data0.source_id;
if(typeof data6 === "string"){
if(func3(data6) < 1){
const err27 = {instancePath:instancePath+"/" + i0+"/source_id",schemaPath:"#/items/properties/source_id/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
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
const err28 = {instancePath:instancePath+"/" + i0+"/source_id",schemaPath:"#/items/properties/source_id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err28];
}
else {
vErrors.push(err28);
}
errors++;
}
}
if(data0.name !== undefined){
let data7 = data0.name;
if(typeof data7 === "string"){
if(func3(data7) < 1){
const err29 = {instancePath:instancePath+"/" + i0+"/name",schemaPath:"#/items/properties/name/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
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
const err30 = {instancePath:instancePath+"/" + i0+"/name",schemaPath:"#/items/properties/name/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err30];
}
else {
vErrors.push(err30);
}
errors++;
}
}
if(data0.aliases !== undefined){
let data8 = data0.aliases;
if(Array.isArray(data8)){
if(data8.length > 40){
const err31 = {instancePath:instancePath+"/" + i0+"/aliases",schemaPath:"#/items/properties/aliases/maxItems",keyword:"maxItems",params:{limit: 40},message:"must NOT have more than 40 items"};
if(vErrors === null){
vErrors = [err31];
}
else {
vErrors.push(err31);
}
errors++;
}
const len1 = data8.length;
for(let i1=0; i1<len1; i1++){
let data9 = data8[i1];
if(typeof data9 === "string"){
if(func3(data9) < 1){
const err32 = {instancePath:instancePath+"/" + i0+"/aliases/" + i1,schemaPath:"#/items/properties/aliases/items/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
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
const err33 = {instancePath:instancePath+"/" + i0+"/aliases/" + i1,schemaPath:"#/items/properties/aliases/items/type",keyword:"type",params:{type: "string"},message:"must be string"};
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
const err34 = {instancePath:instancePath+"/" + i0+"/aliases",schemaPath:"#/items/properties/aliases/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err34];
}
else {
vErrors.push(err34);
}
errors++;
}
}
if(data0.normalized_name !== undefined){
let data10 = data0.normalized_name;
if(typeof data10 === "string"){
if(func3(data10) < 1){
const err35 = {instancePath:instancePath+"/" + i0+"/normalized_name",schemaPath:"#/items/properties/normalized_name/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
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
const err36 = {instancePath:instancePath+"/" + i0+"/normalized_name",schemaPath:"#/items/properties/normalized_name/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err36];
}
else {
vErrors.push(err36);
}
errors++;
}
}
if(data0.normalized_aliases !== undefined){
let data11 = data0.normalized_aliases;
if(Array.isArray(data11)){
if(data11.length > 40){
const err37 = {instancePath:instancePath+"/" + i0+"/normalized_aliases",schemaPath:"#/items/properties/normalized_aliases/maxItems",keyword:"maxItems",params:{limit: 40},message:"must NOT have more than 40 items"};
if(vErrors === null){
vErrors = [err37];
}
else {
vErrors.push(err37);
}
errors++;
}
const len2 = data11.length;
for(let i2=0; i2<len2; i2++){
let data12 = data11[i2];
if(typeof data12 === "string"){
if(func3(data12) < 1){
const err38 = {instancePath:instancePath+"/" + i0+"/normalized_aliases/" + i2,schemaPath:"#/items/properties/normalized_aliases/items/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err38];
}
else {
vErrors.push(err38);
}
errors++;
}
}
else {
const err39 = {instancePath:instancePath+"/" + i0+"/normalized_aliases/" + i2,schemaPath:"#/items/properties/normalized_aliases/items/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err39];
}
else {
vErrors.push(err39);
}
errors++;
}
}
}
else {
const err40 = {instancePath:instancePath+"/" + i0+"/normalized_aliases",schemaPath:"#/items/properties/normalized_aliases/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err40];
}
else {
vErrors.push(err40);
}
errors++;
}
}
if(data0.context !== undefined){
let data13 = data0.context;
if(typeof data13 === "string"){
if(func3(data13) < 1){
const err41 = {instancePath:instancePath+"/" + i0+"/context",schemaPath:"#/items/properties/context/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
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
const err42 = {instancePath:instancePath+"/" + i0+"/context",schemaPath:"#/items/properties/context/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err42];
}
else {
vErrors.push(err42);
}
errors++;
}
}
if(data0.longitude !== undefined){
let data14 = data0.longitude;
if((typeof data14 == "number") && (isFinite(data14))){
if(data14 > 180 || isNaN(data14)){
const err43 = {instancePath:instancePath+"/" + i0+"/longitude",schemaPath:"#/items/properties/longitude/maximum",keyword:"maximum",params:{comparison: "<=", limit: 180},message:"must be <= 180"};
if(vErrors === null){
vErrors = [err43];
}
else {
vErrors.push(err43);
}
errors++;
}
if(data14 < -180 || isNaN(data14)){
const err44 = {instancePath:instancePath+"/" + i0+"/longitude",schemaPath:"#/items/properties/longitude/minimum",keyword:"minimum",params:{comparison: ">=", limit: -180},message:"must be >= -180"};
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
const err45 = {instancePath:instancePath+"/" + i0+"/longitude",schemaPath:"#/items/properties/longitude/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err45];
}
else {
vErrors.push(err45);
}
errors++;
}
}
if(data0.latitude !== undefined){
let data15 = data0.latitude;
if((typeof data15 == "number") && (isFinite(data15))){
if(data15 > 90 || isNaN(data15)){
const err46 = {instancePath:instancePath+"/" + i0+"/latitude",schemaPath:"#/items/properties/latitude/maximum",keyword:"maximum",params:{comparison: "<=", limit: 90},message:"must be <= 90"};
if(vErrors === null){
vErrors = [err46];
}
else {
vErrors.push(err46);
}
errors++;
}
if(data15 < -90 || isNaN(data15)){
const err47 = {instancePath:instancePath+"/" + i0+"/latitude",schemaPath:"#/items/properties/latitude/minimum",keyword:"minimum",params:{comparison: ">=", limit: -90},message:"must be >= -90"};
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
const err48 = {instancePath:instancePath+"/" + i0+"/latitude",schemaPath:"#/items/properties/latitude/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err48];
}
else {
vErrors.push(err48);
}
errors++;
}
}
if(data0.date !== undefined){
let data16 = data0.date;
if((typeof data16 !== "string") && (data16 !== null)){
const err49 = {instancePath:instancePath+"/" + i0+"/date",schemaPath:"#/items/properties/date/type",keyword:"type",params:{type: schema11.items.properties.date.type},message:"must be string,null"};
if(vErrors === null){
vErrors = [err49];
}
else {
vErrors.push(err49);
}
errors++;
}
}
if(data0.manifest_path !== undefined){
let data17 = data0.manifest_path;
if(typeof data17 === "string"){
if(!pattern0.test(data17)){
const err50 = {instancePath:instancePath+"/" + i0+"/manifest_path",schemaPath:"#/items/properties/manifest_path/pattern",keyword:"pattern",params:{pattern: "^/data/"},message:"must match pattern \""+"^/data/"+"\""};
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
const err51 = {instancePath:instancePath+"/" + i0+"/manifest_path",schemaPath:"#/items/properties/manifest_path/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err51];
}
else {
vErrors.push(err51);
}
errors++;
}
}
if(data0.detail_href !== undefined){
let data18 = data0.detail_href;
if((typeof data18 !== "string") && (data18 !== null)){
const err52 = {instancePath:instancePath+"/" + i0+"/detail_href",schemaPath:"#/items/properties/detail_href/type",keyword:"type",params:{type: schema11.items.properties.detail_href.type},message:"must be string,null"};
if(vErrors === null){
vErrors = [err52];
}
else {
vErrors.push(err52);
}
errors++;
}
if(typeof data18 === "string"){
if(!pattern1.test(data18)){
const err53 = {instancePath:instancePath+"/" + i0+"/detail_href",schemaPath:"#/items/properties/detail_href/pattern",keyword:"pattern",params:{pattern: "^/"},message:"must match pattern \""+"^/"+"\""};
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
}
else {
const err54 = {instancePath:instancePath+"/" + i0,schemaPath:"#/items/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err54];
}
else {
vErrors.push(err54);
}
errors++;
}
}
}
else {
const err55 = {instancePath,schemaPath:"#/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err55];
}
else {
vErrors.push(err55);
}
errors++;
}
validate10.errors = vErrors;
return errors === 0;
}

