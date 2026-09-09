// Generated from temporal.schema.json; run npm run contracts:generate. Do not edit.
"use strict";
module.exports = validate10;
module.exports.default = validate10;
const schema11 = {"type":"object","additionalProperties":false,"required":["schema_version","products","inputs","context"],"properties":{"schema_version":{"const":"1.0.0"},"products":{"type":"array","minItems":4,"maxItems":4,"items":{"type":"object","additionalProperties":false,"required":["id","label","dataset_id","version","source","retrieved_at","published_at","resolution","observations"],"properties":{"id":{"enum":["water","satellite","climate","events"]},"label":{"type":"string","minLength":1},"dataset_id":{"type":"string","minLength":1},"version":{"type":"string","minLength":1},"source":{"type":"string","minLength":1},"retrieved_at":{"type":"string","format":"date-time"},"published_at":{"type":["string","null"],"format":"date-time"},"resolution":{"enum":["instant","day","month"]},"observations":{"type":"array","minItems":1,"maxItems":5000,"items":{"type":"object","additionalProperties":false,"required":["id","start","end","acquired_at","published_at","sensor","compatibility","count"],"properties":{"id":{"type":"string","minLength":1},"start":{"type":"string","format":"date-time"},"end":{"type":"string","format":"date-time"},"acquired_at":{"type":["string","null"],"format":"date-time"},"published_at":{"type":["string","null"],"format":"date-time"},"sensor":{"type":["string","null"]},"compatibility":{"type":["string","null"]},"count":{"type":["integer","null"],"minimum":0}}}}}}},"inputs":{"type":"array","minItems":1,"maxItems":20,"items":{"type":"object","additionalProperties":false,"required":["path","sha256","byte_size"],"properties":{"path":{"type":"string","pattern":"^/data/[a-z0-9-]+/[0-9.]+/manifest.json$"},"sha256":{"type":"string","pattern":"^[a-f0-9]{64}$"},"byte_size":{"type":"integer","minimum":1,"maximum":262144}}}},"context":{"type":"array","maxItems":100,"items":{"type":"object","additionalProperties":false,"required":["dataset_id","version","observation_date","coverage","resolution"],"properties":{"dataset_id":{"type":"string","minLength":1},"version":{"type":"string","minLength":1},"observation_date":{"type":["string","null"],"format":"date-time"},"coverage":{"type":"object","additionalProperties":false,"required":["start","end"],"properties":{"start":{"type":["string","null"],"format":"date-time"},"end":{"type":["string","null"],"format":"date-time"}}},"resolution":{"type":["string","null"]}}}}},"$schema":"http://json-schema.org/draft-07/schema#"};
const func2 = Object.prototype.hasOwnProperty;
const func3 = require("ajv/dist/runtime/ucs2length").default;
const formats0 = require("ajv-formats/dist/formats").fullFormats["date-time"];
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
if(data.products === undefined){
const err1 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "products"},message:"must have required property '"+"products"+"'"};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
if(data.inputs === undefined){
const err2 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "inputs"},message:"must have required property '"+"inputs"+"'"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
if(data.context === undefined){
const err3 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "context"},message:"must have required property '"+"context"+"'"};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
for(const key0 in data){
if(!((((key0 === "schema_version") || (key0 === "products")) || (key0 === "inputs")) || (key0 === "context"))){
const err4 = {instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
}
if(data.schema_version !== undefined){
if("1.0.0" !== data.schema_version){
const err5 = {instancePath:instancePath+"/schema_version",schemaPath:"#/properties/schema_version/const",keyword:"const",params:{allowedValue: "1.0.0"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
}
if(data.products !== undefined){
let data1 = data.products;
if(Array.isArray(data1)){
if(data1.length > 4){
const err6 = {instancePath:instancePath+"/products",schemaPath:"#/properties/products/maxItems",keyword:"maxItems",params:{limit: 4},message:"must NOT have more than 4 items"};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
if(data1.length < 4){
const err7 = {instancePath:instancePath+"/products",schemaPath:"#/properties/products/minItems",keyword:"minItems",params:{limit: 4},message:"must NOT have fewer than 4 items"};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
}
const len0 = data1.length;
for(let i0=0; i0<len0; i0++){
let data2 = data1[i0];
if(data2 && typeof data2 == "object" && !Array.isArray(data2)){
if(data2.id === undefined){
const err8 = {instancePath:instancePath+"/products/" + i0,schemaPath:"#/properties/products/items/required",keyword:"required",params:{missingProperty: "id"},message:"must have required property '"+"id"+"'"};
if(vErrors === null){
vErrors = [err8];
}
else {
vErrors.push(err8);
}
errors++;
}
if(data2.label === undefined){
const err9 = {instancePath:instancePath+"/products/" + i0,schemaPath:"#/properties/products/items/required",keyword:"required",params:{missingProperty: "label"},message:"must have required property '"+"label"+"'"};
if(vErrors === null){
vErrors = [err9];
}
else {
vErrors.push(err9);
}
errors++;
}
if(data2.dataset_id === undefined){
const err10 = {instancePath:instancePath+"/products/" + i0,schemaPath:"#/properties/products/items/required",keyword:"required",params:{missingProperty: "dataset_id"},message:"must have required property '"+"dataset_id"+"'"};
if(vErrors === null){
vErrors = [err10];
}
else {
vErrors.push(err10);
}
errors++;
}
if(data2.version === undefined){
const err11 = {instancePath:instancePath+"/products/" + i0,schemaPath:"#/properties/products/items/required",keyword:"required",params:{missingProperty: "version"},message:"must have required property '"+"version"+"'"};
if(vErrors === null){
vErrors = [err11];
}
else {
vErrors.push(err11);
}
errors++;
}
if(data2.source === undefined){
const err12 = {instancePath:instancePath+"/products/" + i0,schemaPath:"#/properties/products/items/required",keyword:"required",params:{missingProperty: "source"},message:"must have required property '"+"source"+"'"};
if(vErrors === null){
vErrors = [err12];
}
else {
vErrors.push(err12);
}
errors++;
}
if(data2.retrieved_at === undefined){
const err13 = {instancePath:instancePath+"/products/" + i0,schemaPath:"#/properties/products/items/required",keyword:"required",params:{missingProperty: "retrieved_at"},message:"must have required property '"+"retrieved_at"+"'"};
if(vErrors === null){
vErrors = [err13];
}
else {
vErrors.push(err13);
}
errors++;
}
if(data2.published_at === undefined){
const err14 = {instancePath:instancePath+"/products/" + i0,schemaPath:"#/properties/products/items/required",keyword:"required",params:{missingProperty: "published_at"},message:"must have required property '"+"published_at"+"'"};
if(vErrors === null){
vErrors = [err14];
}
else {
vErrors.push(err14);
}
errors++;
}
if(data2.resolution === undefined){
const err15 = {instancePath:instancePath+"/products/" + i0,schemaPath:"#/properties/products/items/required",keyword:"required",params:{missingProperty: "resolution"},message:"must have required property '"+"resolution"+"'"};
if(vErrors === null){
vErrors = [err15];
}
else {
vErrors.push(err15);
}
errors++;
}
if(data2.observations === undefined){
const err16 = {instancePath:instancePath+"/products/" + i0,schemaPath:"#/properties/products/items/required",keyword:"required",params:{missingProperty: "observations"},message:"must have required property '"+"observations"+"'"};
if(vErrors === null){
vErrors = [err16];
}
else {
vErrors.push(err16);
}
errors++;
}
for(const key1 in data2){
if(!(func2.call(schema11.properties.products.items.properties, key1))){
const err17 = {instancePath:instancePath+"/products/" + i0,schemaPath:"#/properties/products/items/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key1},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err17];
}
else {
vErrors.push(err17);
}
errors++;
}
}
if(data2.id !== undefined){
let data3 = data2.id;
if(!((((data3 === "water") || (data3 === "satellite")) || (data3 === "climate")) || (data3 === "events"))){
const err18 = {instancePath:instancePath+"/products/" + i0+"/id",schemaPath:"#/properties/products/items/properties/id/enum",keyword:"enum",params:{allowedValues: schema11.properties.products.items.properties.id.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err18];
}
else {
vErrors.push(err18);
}
errors++;
}
}
if(data2.label !== undefined){
let data4 = data2.label;
if(typeof data4 === "string"){
if(func3(data4) < 1){
const err19 = {instancePath:instancePath+"/products/" + i0+"/label",schemaPath:"#/properties/products/items/properties/label/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err19];
}
else {
vErrors.push(err19);
}
errors++;
}
}
else {
const err20 = {instancePath:instancePath+"/products/" + i0+"/label",schemaPath:"#/properties/products/items/properties/label/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err20];
}
else {
vErrors.push(err20);
}
errors++;
}
}
if(data2.dataset_id !== undefined){
let data5 = data2.dataset_id;
if(typeof data5 === "string"){
if(func3(data5) < 1){
const err21 = {instancePath:instancePath+"/products/" + i0+"/dataset_id",schemaPath:"#/properties/products/items/properties/dataset_id/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
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
const err22 = {instancePath:instancePath+"/products/" + i0+"/dataset_id",schemaPath:"#/properties/products/items/properties/dataset_id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err22];
}
else {
vErrors.push(err22);
}
errors++;
}
}
if(data2.version !== undefined){
let data6 = data2.version;
if(typeof data6 === "string"){
if(func3(data6) < 1){
const err23 = {instancePath:instancePath+"/products/" + i0+"/version",schemaPath:"#/properties/products/items/properties/version/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
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
const err24 = {instancePath:instancePath+"/products/" + i0+"/version",schemaPath:"#/properties/products/items/properties/version/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err24];
}
else {
vErrors.push(err24);
}
errors++;
}
}
if(data2.source !== undefined){
let data7 = data2.source;
if(typeof data7 === "string"){
if(func3(data7) < 1){
const err25 = {instancePath:instancePath+"/products/" + i0+"/source",schemaPath:"#/properties/products/items/properties/source/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
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
const err26 = {instancePath:instancePath+"/products/" + i0+"/source",schemaPath:"#/properties/products/items/properties/source/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err26];
}
else {
vErrors.push(err26);
}
errors++;
}
}
if(data2.retrieved_at !== undefined){
let data8 = data2.retrieved_at;
if(typeof data8 === "string"){
if(!(formats0.validate(data8))){
const err27 = {instancePath:instancePath+"/products/" + i0+"/retrieved_at",schemaPath:"#/properties/products/items/properties/retrieved_at/format",keyword:"format",params:{format: "date-time"},message:"must match format \""+"date-time"+"\""};
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
const err28 = {instancePath:instancePath+"/products/" + i0+"/retrieved_at",schemaPath:"#/properties/products/items/properties/retrieved_at/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err28];
}
else {
vErrors.push(err28);
}
errors++;
}
}
if(data2.published_at !== undefined){
let data9 = data2.published_at;
if((typeof data9 !== "string") && (data9 !== null)){
const err29 = {instancePath:instancePath+"/products/" + i0+"/published_at",schemaPath:"#/properties/products/items/properties/published_at/type",keyword:"type",params:{type: schema11.properties.products.items.properties.published_at.type},message:"must be string,null"};
if(vErrors === null){
vErrors = [err29];
}
else {
vErrors.push(err29);
}
errors++;
}
if(typeof data9 === "string"){
if(!(formats0.validate(data9))){
const err30 = {instancePath:instancePath+"/products/" + i0+"/published_at",schemaPath:"#/properties/products/items/properties/published_at/format",keyword:"format",params:{format: "date-time"},message:"must match format \""+"date-time"+"\""};
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
if(data2.resolution !== undefined){
let data10 = data2.resolution;
if(!(((data10 === "instant") || (data10 === "day")) || (data10 === "month"))){
const err31 = {instancePath:instancePath+"/products/" + i0+"/resolution",schemaPath:"#/properties/products/items/properties/resolution/enum",keyword:"enum",params:{allowedValues: schema11.properties.products.items.properties.resolution.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err31];
}
else {
vErrors.push(err31);
}
errors++;
}
}
if(data2.observations !== undefined){
let data11 = data2.observations;
if(Array.isArray(data11)){
if(data11.length > 5000){
const err32 = {instancePath:instancePath+"/products/" + i0+"/observations",schemaPath:"#/properties/products/items/properties/observations/maxItems",keyword:"maxItems",params:{limit: 5000},message:"must NOT have more than 5000 items"};
if(vErrors === null){
vErrors = [err32];
}
else {
vErrors.push(err32);
}
errors++;
}
if(data11.length < 1){
const err33 = {instancePath:instancePath+"/products/" + i0+"/observations",schemaPath:"#/properties/products/items/properties/observations/minItems",keyword:"minItems",params:{limit: 1},message:"must NOT have fewer than 1 items"};
if(vErrors === null){
vErrors = [err33];
}
else {
vErrors.push(err33);
}
errors++;
}
const len1 = data11.length;
for(let i1=0; i1<len1; i1++){
let data12 = data11[i1];
if(data12 && typeof data12 == "object" && !Array.isArray(data12)){
if(data12.id === undefined){
const err34 = {instancePath:instancePath+"/products/" + i0+"/observations/" + i1,schemaPath:"#/properties/products/items/properties/observations/items/required",keyword:"required",params:{missingProperty: "id"},message:"must have required property '"+"id"+"'"};
if(vErrors === null){
vErrors = [err34];
}
else {
vErrors.push(err34);
}
errors++;
}
if(data12.start === undefined){
const err35 = {instancePath:instancePath+"/products/" + i0+"/observations/" + i1,schemaPath:"#/properties/products/items/properties/observations/items/required",keyword:"required",params:{missingProperty: "start"},message:"must have required property '"+"start"+"'"};
if(vErrors === null){
vErrors = [err35];
}
else {
vErrors.push(err35);
}
errors++;
}
if(data12.end === undefined){
const err36 = {instancePath:instancePath+"/products/" + i0+"/observations/" + i1,schemaPath:"#/properties/products/items/properties/observations/items/required",keyword:"required",params:{missingProperty: "end"},message:"must have required property '"+"end"+"'"};
if(vErrors === null){
vErrors = [err36];
}
else {
vErrors.push(err36);
}
errors++;
}
if(data12.acquired_at === undefined){
const err37 = {instancePath:instancePath+"/products/" + i0+"/observations/" + i1,schemaPath:"#/properties/products/items/properties/observations/items/required",keyword:"required",params:{missingProperty: "acquired_at"},message:"must have required property '"+"acquired_at"+"'"};
if(vErrors === null){
vErrors = [err37];
}
else {
vErrors.push(err37);
}
errors++;
}
if(data12.published_at === undefined){
const err38 = {instancePath:instancePath+"/products/" + i0+"/observations/" + i1,schemaPath:"#/properties/products/items/properties/observations/items/required",keyword:"required",params:{missingProperty: "published_at"},message:"must have required property '"+"published_at"+"'"};
if(vErrors === null){
vErrors = [err38];
}
else {
vErrors.push(err38);
}
errors++;
}
if(data12.sensor === undefined){
const err39 = {instancePath:instancePath+"/products/" + i0+"/observations/" + i1,schemaPath:"#/properties/products/items/properties/observations/items/required",keyword:"required",params:{missingProperty: "sensor"},message:"must have required property '"+"sensor"+"'"};
if(vErrors === null){
vErrors = [err39];
}
else {
vErrors.push(err39);
}
errors++;
}
if(data12.compatibility === undefined){
const err40 = {instancePath:instancePath+"/products/" + i0+"/observations/" + i1,schemaPath:"#/properties/products/items/properties/observations/items/required",keyword:"required",params:{missingProperty: "compatibility"},message:"must have required property '"+"compatibility"+"'"};
if(vErrors === null){
vErrors = [err40];
}
else {
vErrors.push(err40);
}
errors++;
}
if(data12.count === undefined){
const err41 = {instancePath:instancePath+"/products/" + i0+"/observations/" + i1,schemaPath:"#/properties/products/items/properties/observations/items/required",keyword:"required",params:{missingProperty: "count"},message:"must have required property '"+"count"+"'"};
if(vErrors === null){
vErrors = [err41];
}
else {
vErrors.push(err41);
}
errors++;
}
for(const key2 in data12){
if(!((((((((key2 === "id") || (key2 === "start")) || (key2 === "end")) || (key2 === "acquired_at")) || (key2 === "published_at")) || (key2 === "sensor")) || (key2 === "compatibility")) || (key2 === "count"))){
const err42 = {instancePath:instancePath+"/products/" + i0+"/observations/" + i1,schemaPath:"#/properties/products/items/properties/observations/items/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key2},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err42];
}
else {
vErrors.push(err42);
}
errors++;
}
}
if(data12.id !== undefined){
let data13 = data12.id;
if(typeof data13 === "string"){
if(func3(data13) < 1){
const err43 = {instancePath:instancePath+"/products/" + i0+"/observations/" + i1+"/id",schemaPath:"#/properties/products/items/properties/observations/items/properties/id/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
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
const err44 = {instancePath:instancePath+"/products/" + i0+"/observations/" + i1+"/id",schemaPath:"#/properties/products/items/properties/observations/items/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err44];
}
else {
vErrors.push(err44);
}
errors++;
}
}
if(data12.start !== undefined){
let data14 = data12.start;
if(typeof data14 === "string"){
if(!(formats0.validate(data14))){
const err45 = {instancePath:instancePath+"/products/" + i0+"/observations/" + i1+"/start",schemaPath:"#/properties/products/items/properties/observations/items/properties/start/format",keyword:"format",params:{format: "date-time"},message:"must match format \""+"date-time"+"\""};
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
const err46 = {instancePath:instancePath+"/products/" + i0+"/observations/" + i1+"/start",schemaPath:"#/properties/products/items/properties/observations/items/properties/start/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err46];
}
else {
vErrors.push(err46);
}
errors++;
}
}
if(data12.end !== undefined){
let data15 = data12.end;
if(typeof data15 === "string"){
if(!(formats0.validate(data15))){
const err47 = {instancePath:instancePath+"/products/" + i0+"/observations/" + i1+"/end",schemaPath:"#/properties/products/items/properties/observations/items/properties/end/format",keyword:"format",params:{format: "date-time"},message:"must match format \""+"date-time"+"\""};
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
const err48 = {instancePath:instancePath+"/products/" + i0+"/observations/" + i1+"/end",schemaPath:"#/properties/products/items/properties/observations/items/properties/end/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err48];
}
else {
vErrors.push(err48);
}
errors++;
}
}
if(data12.acquired_at !== undefined){
let data16 = data12.acquired_at;
if((typeof data16 !== "string") && (data16 !== null)){
const err49 = {instancePath:instancePath+"/products/" + i0+"/observations/" + i1+"/acquired_at",schemaPath:"#/properties/products/items/properties/observations/items/properties/acquired_at/type",keyword:"type",params:{type: schema11.properties.products.items.properties.observations.items.properties.acquired_at.type},message:"must be string,null"};
if(vErrors === null){
vErrors = [err49];
}
else {
vErrors.push(err49);
}
errors++;
}
if(typeof data16 === "string"){
if(!(formats0.validate(data16))){
const err50 = {instancePath:instancePath+"/products/" + i0+"/observations/" + i1+"/acquired_at",schemaPath:"#/properties/products/items/properties/observations/items/properties/acquired_at/format",keyword:"format",params:{format: "date-time"},message:"must match format \""+"date-time"+"\""};
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
if(data12.published_at !== undefined){
let data17 = data12.published_at;
if((typeof data17 !== "string") && (data17 !== null)){
const err51 = {instancePath:instancePath+"/products/" + i0+"/observations/" + i1+"/published_at",schemaPath:"#/properties/products/items/properties/observations/items/properties/published_at/type",keyword:"type",params:{type: schema11.properties.products.items.properties.observations.items.properties.published_at.type},message:"must be string,null"};
if(vErrors === null){
vErrors = [err51];
}
else {
vErrors.push(err51);
}
errors++;
}
if(typeof data17 === "string"){
if(!(formats0.validate(data17))){
const err52 = {instancePath:instancePath+"/products/" + i0+"/observations/" + i1+"/published_at",schemaPath:"#/properties/products/items/properties/observations/items/properties/published_at/format",keyword:"format",params:{format: "date-time"},message:"must match format \""+"date-time"+"\""};
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
if(data12.sensor !== undefined){
let data18 = data12.sensor;
if((typeof data18 !== "string") && (data18 !== null)){
const err53 = {instancePath:instancePath+"/products/" + i0+"/observations/" + i1+"/sensor",schemaPath:"#/properties/products/items/properties/observations/items/properties/sensor/type",keyword:"type",params:{type: schema11.properties.products.items.properties.observations.items.properties.sensor.type},message:"must be string,null"};
if(vErrors === null){
vErrors = [err53];
}
else {
vErrors.push(err53);
}
errors++;
}
}
if(data12.compatibility !== undefined){
let data19 = data12.compatibility;
if((typeof data19 !== "string") && (data19 !== null)){
const err54 = {instancePath:instancePath+"/products/" + i0+"/observations/" + i1+"/compatibility",schemaPath:"#/properties/products/items/properties/observations/items/properties/compatibility/type",keyword:"type",params:{type: schema11.properties.products.items.properties.observations.items.properties.compatibility.type},message:"must be string,null"};
if(vErrors === null){
vErrors = [err54];
}
else {
vErrors.push(err54);
}
errors++;
}
}
if(data12.count !== undefined){
let data20 = data12.count;
if((!(((typeof data20 == "number") && (!(data20 % 1) && !isNaN(data20))) && (isFinite(data20)))) && (data20 !== null)){
const err55 = {instancePath:instancePath+"/products/" + i0+"/observations/" + i1+"/count",schemaPath:"#/properties/products/items/properties/observations/items/properties/count/type",keyword:"type",params:{type: schema11.properties.products.items.properties.observations.items.properties.count.type},message:"must be integer,null"};
if(vErrors === null){
vErrors = [err55];
}
else {
vErrors.push(err55);
}
errors++;
}
if((typeof data20 == "number") && (isFinite(data20))){
if(data20 < 0 || isNaN(data20)){
const err56 = {instancePath:instancePath+"/products/" + i0+"/observations/" + i1+"/count",schemaPath:"#/properties/products/items/properties/observations/items/properties/count/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
if(vErrors === null){
vErrors = [err56];
}
else {
vErrors.push(err56);
}
errors++;
}
}
}
}
else {
const err57 = {instancePath:instancePath+"/products/" + i0+"/observations/" + i1,schemaPath:"#/properties/products/items/properties/observations/items/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err57];
}
else {
vErrors.push(err57);
}
errors++;
}
}
}
else {
const err58 = {instancePath:instancePath+"/products/" + i0+"/observations",schemaPath:"#/properties/products/items/properties/observations/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err58];
}
else {
vErrors.push(err58);
}
errors++;
}
}
}
else {
const err59 = {instancePath:instancePath+"/products/" + i0,schemaPath:"#/properties/products/items/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err59];
}
else {
vErrors.push(err59);
}
errors++;
}
}
}
else {
const err60 = {instancePath:instancePath+"/products",schemaPath:"#/properties/products/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err60];
}
else {
vErrors.push(err60);
}
errors++;
}
}
if(data.inputs !== undefined){
let data21 = data.inputs;
if(Array.isArray(data21)){
if(data21.length > 20){
const err61 = {instancePath:instancePath+"/inputs",schemaPath:"#/properties/inputs/maxItems",keyword:"maxItems",params:{limit: 20},message:"must NOT have more than 20 items"};
if(vErrors === null){
vErrors = [err61];
}
else {
vErrors.push(err61);
}
errors++;
}
if(data21.length < 1){
const err62 = {instancePath:instancePath+"/inputs",schemaPath:"#/properties/inputs/minItems",keyword:"minItems",params:{limit: 1},message:"must NOT have fewer than 1 items"};
if(vErrors === null){
vErrors = [err62];
}
else {
vErrors.push(err62);
}
errors++;
}
const len2 = data21.length;
for(let i2=0; i2<len2; i2++){
let data22 = data21[i2];
if(data22 && typeof data22 == "object" && !Array.isArray(data22)){
if(data22.path === undefined){
const err63 = {instancePath:instancePath+"/inputs/" + i2,schemaPath:"#/properties/inputs/items/required",keyword:"required",params:{missingProperty: "path"},message:"must have required property '"+"path"+"'"};
if(vErrors === null){
vErrors = [err63];
}
else {
vErrors.push(err63);
}
errors++;
}
if(data22.sha256 === undefined){
const err64 = {instancePath:instancePath+"/inputs/" + i2,schemaPath:"#/properties/inputs/items/required",keyword:"required",params:{missingProperty: "sha256"},message:"must have required property '"+"sha256"+"'"};
if(vErrors === null){
vErrors = [err64];
}
else {
vErrors.push(err64);
}
errors++;
}
if(data22.byte_size === undefined){
const err65 = {instancePath:instancePath+"/inputs/" + i2,schemaPath:"#/properties/inputs/items/required",keyword:"required",params:{missingProperty: "byte_size"},message:"must have required property '"+"byte_size"+"'"};
if(vErrors === null){
vErrors = [err65];
}
else {
vErrors.push(err65);
}
errors++;
}
for(const key3 in data22){
if(!(((key3 === "path") || (key3 === "sha256")) || (key3 === "byte_size"))){
const err66 = {instancePath:instancePath+"/inputs/" + i2,schemaPath:"#/properties/inputs/items/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key3},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err66];
}
else {
vErrors.push(err66);
}
errors++;
}
}
if(data22.path !== undefined){
let data23 = data22.path;
if(typeof data23 === "string"){
if(!pattern0.test(data23)){
const err67 = {instancePath:instancePath+"/inputs/" + i2+"/path",schemaPath:"#/properties/inputs/items/properties/path/pattern",keyword:"pattern",params:{pattern: "^/data/[a-z0-9-]+/[0-9.]+/manifest.json$"},message:"must match pattern \""+"^/data/[a-z0-9-]+/[0-9.]+/manifest.json$"+"\""};
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
const err68 = {instancePath:instancePath+"/inputs/" + i2+"/path",schemaPath:"#/properties/inputs/items/properties/path/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err68];
}
else {
vErrors.push(err68);
}
errors++;
}
}
if(data22.sha256 !== undefined){
let data24 = data22.sha256;
if(typeof data24 === "string"){
if(!pattern1.test(data24)){
const err69 = {instancePath:instancePath+"/inputs/" + i2+"/sha256",schemaPath:"#/properties/inputs/items/properties/sha256/pattern",keyword:"pattern",params:{pattern: "^[a-f0-9]{64}$"},message:"must match pattern \""+"^[a-f0-9]{64}$"+"\""};
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
const err70 = {instancePath:instancePath+"/inputs/" + i2+"/sha256",schemaPath:"#/properties/inputs/items/properties/sha256/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err70];
}
else {
vErrors.push(err70);
}
errors++;
}
}
if(data22.byte_size !== undefined){
let data25 = data22.byte_size;
if(!(((typeof data25 == "number") && (!(data25 % 1) && !isNaN(data25))) && (isFinite(data25)))){
const err71 = {instancePath:instancePath+"/inputs/" + i2+"/byte_size",schemaPath:"#/properties/inputs/items/properties/byte_size/type",keyword:"type",params:{type: "integer"},message:"must be integer"};
if(vErrors === null){
vErrors = [err71];
}
else {
vErrors.push(err71);
}
errors++;
}
if((typeof data25 == "number") && (isFinite(data25))){
if(data25 > 262144 || isNaN(data25)){
const err72 = {instancePath:instancePath+"/inputs/" + i2+"/byte_size",schemaPath:"#/properties/inputs/items/properties/byte_size/maximum",keyword:"maximum",params:{comparison: "<=", limit: 262144},message:"must be <= 262144"};
if(vErrors === null){
vErrors = [err72];
}
else {
vErrors.push(err72);
}
errors++;
}
if(data25 < 1 || isNaN(data25)){
const err73 = {instancePath:instancePath+"/inputs/" + i2+"/byte_size",schemaPath:"#/properties/inputs/items/properties/byte_size/minimum",keyword:"minimum",params:{comparison: ">=", limit: 1},message:"must be >= 1"};
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
}
else {
const err74 = {instancePath:instancePath+"/inputs/" + i2,schemaPath:"#/properties/inputs/items/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err74];
}
else {
vErrors.push(err74);
}
errors++;
}
}
}
else {
const err75 = {instancePath:instancePath+"/inputs",schemaPath:"#/properties/inputs/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err75];
}
else {
vErrors.push(err75);
}
errors++;
}
}
if(data.context !== undefined){
let data26 = data.context;
if(Array.isArray(data26)){
if(data26.length > 100){
const err76 = {instancePath:instancePath+"/context",schemaPath:"#/properties/context/maxItems",keyword:"maxItems",params:{limit: 100},message:"must NOT have more than 100 items"};
if(vErrors === null){
vErrors = [err76];
}
else {
vErrors.push(err76);
}
errors++;
}
const len3 = data26.length;
for(let i3=0; i3<len3; i3++){
let data27 = data26[i3];
if(data27 && typeof data27 == "object" && !Array.isArray(data27)){
if(data27.dataset_id === undefined){
const err77 = {instancePath:instancePath+"/context/" + i3,schemaPath:"#/properties/context/items/required",keyword:"required",params:{missingProperty: "dataset_id"},message:"must have required property '"+"dataset_id"+"'"};
if(vErrors === null){
vErrors = [err77];
}
else {
vErrors.push(err77);
}
errors++;
}
if(data27.version === undefined){
const err78 = {instancePath:instancePath+"/context/" + i3,schemaPath:"#/properties/context/items/required",keyword:"required",params:{missingProperty: "version"},message:"must have required property '"+"version"+"'"};
if(vErrors === null){
vErrors = [err78];
}
else {
vErrors.push(err78);
}
errors++;
}
if(data27.observation_date === undefined){
const err79 = {instancePath:instancePath+"/context/" + i3,schemaPath:"#/properties/context/items/required",keyword:"required",params:{missingProperty: "observation_date"},message:"must have required property '"+"observation_date"+"'"};
if(vErrors === null){
vErrors = [err79];
}
else {
vErrors.push(err79);
}
errors++;
}
if(data27.coverage === undefined){
const err80 = {instancePath:instancePath+"/context/" + i3,schemaPath:"#/properties/context/items/required",keyword:"required",params:{missingProperty: "coverage"},message:"must have required property '"+"coverage"+"'"};
if(vErrors === null){
vErrors = [err80];
}
else {
vErrors.push(err80);
}
errors++;
}
if(data27.resolution === undefined){
const err81 = {instancePath:instancePath+"/context/" + i3,schemaPath:"#/properties/context/items/required",keyword:"required",params:{missingProperty: "resolution"},message:"must have required property '"+"resolution"+"'"};
if(vErrors === null){
vErrors = [err81];
}
else {
vErrors.push(err81);
}
errors++;
}
for(const key4 in data27){
if(!(((((key4 === "dataset_id") || (key4 === "version")) || (key4 === "observation_date")) || (key4 === "coverage")) || (key4 === "resolution"))){
const err82 = {instancePath:instancePath+"/context/" + i3,schemaPath:"#/properties/context/items/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key4},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err82];
}
else {
vErrors.push(err82);
}
errors++;
}
}
if(data27.dataset_id !== undefined){
let data28 = data27.dataset_id;
if(typeof data28 === "string"){
if(func3(data28) < 1){
const err83 = {instancePath:instancePath+"/context/" + i3+"/dataset_id",schemaPath:"#/properties/context/items/properties/dataset_id/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
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
const err84 = {instancePath:instancePath+"/context/" + i3+"/dataset_id",schemaPath:"#/properties/context/items/properties/dataset_id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err84];
}
else {
vErrors.push(err84);
}
errors++;
}
}
if(data27.version !== undefined){
let data29 = data27.version;
if(typeof data29 === "string"){
if(func3(data29) < 1){
const err85 = {instancePath:instancePath+"/context/" + i3+"/version",schemaPath:"#/properties/context/items/properties/version/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err85];
}
else {
vErrors.push(err85);
}
errors++;
}
}
else {
const err86 = {instancePath:instancePath+"/context/" + i3+"/version",schemaPath:"#/properties/context/items/properties/version/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err86];
}
else {
vErrors.push(err86);
}
errors++;
}
}
if(data27.observation_date !== undefined){
let data30 = data27.observation_date;
if((typeof data30 !== "string") && (data30 !== null)){
const err87 = {instancePath:instancePath+"/context/" + i3+"/observation_date",schemaPath:"#/properties/context/items/properties/observation_date/type",keyword:"type",params:{type: schema11.properties.context.items.properties.observation_date.type},message:"must be string,null"};
if(vErrors === null){
vErrors = [err87];
}
else {
vErrors.push(err87);
}
errors++;
}
if(typeof data30 === "string"){
if(!(formats0.validate(data30))){
const err88 = {instancePath:instancePath+"/context/" + i3+"/observation_date",schemaPath:"#/properties/context/items/properties/observation_date/format",keyword:"format",params:{format: "date-time"},message:"must match format \""+"date-time"+"\""};
if(vErrors === null){
vErrors = [err88];
}
else {
vErrors.push(err88);
}
errors++;
}
}
}
if(data27.coverage !== undefined){
let data31 = data27.coverage;
if(data31 && typeof data31 == "object" && !Array.isArray(data31)){
if(data31.start === undefined){
const err89 = {instancePath:instancePath+"/context/" + i3+"/coverage",schemaPath:"#/properties/context/items/properties/coverage/required",keyword:"required",params:{missingProperty: "start"},message:"must have required property '"+"start"+"'"};
if(vErrors === null){
vErrors = [err89];
}
else {
vErrors.push(err89);
}
errors++;
}
if(data31.end === undefined){
const err90 = {instancePath:instancePath+"/context/" + i3+"/coverage",schemaPath:"#/properties/context/items/properties/coverage/required",keyword:"required",params:{missingProperty: "end"},message:"must have required property '"+"end"+"'"};
if(vErrors === null){
vErrors = [err90];
}
else {
vErrors.push(err90);
}
errors++;
}
for(const key5 in data31){
if(!((key5 === "start") || (key5 === "end"))){
const err91 = {instancePath:instancePath+"/context/" + i3+"/coverage",schemaPath:"#/properties/context/items/properties/coverage/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key5},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err91];
}
else {
vErrors.push(err91);
}
errors++;
}
}
if(data31.start !== undefined){
let data32 = data31.start;
if((typeof data32 !== "string") && (data32 !== null)){
const err92 = {instancePath:instancePath+"/context/" + i3+"/coverage/start",schemaPath:"#/properties/context/items/properties/coverage/properties/start/type",keyword:"type",params:{type: schema11.properties.context.items.properties.coverage.properties.start.type},message:"must be string,null"};
if(vErrors === null){
vErrors = [err92];
}
else {
vErrors.push(err92);
}
errors++;
}
if(typeof data32 === "string"){
if(!(formats0.validate(data32))){
const err93 = {instancePath:instancePath+"/context/" + i3+"/coverage/start",schemaPath:"#/properties/context/items/properties/coverage/properties/start/format",keyword:"format",params:{format: "date-time"},message:"must match format \""+"date-time"+"\""};
if(vErrors === null){
vErrors = [err93];
}
else {
vErrors.push(err93);
}
errors++;
}
}
}
if(data31.end !== undefined){
let data33 = data31.end;
if((typeof data33 !== "string") && (data33 !== null)){
const err94 = {instancePath:instancePath+"/context/" + i3+"/coverage/end",schemaPath:"#/properties/context/items/properties/coverage/properties/end/type",keyword:"type",params:{type: schema11.properties.context.items.properties.coverage.properties.end.type},message:"must be string,null"};
if(vErrors === null){
vErrors = [err94];
}
else {
vErrors.push(err94);
}
errors++;
}
if(typeof data33 === "string"){
if(!(formats0.validate(data33))){
const err95 = {instancePath:instancePath+"/context/" + i3+"/coverage/end",schemaPath:"#/properties/context/items/properties/coverage/properties/end/format",keyword:"format",params:{format: "date-time"},message:"must match format \""+"date-time"+"\""};
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
}
else {
const err96 = {instancePath:instancePath+"/context/" + i3+"/coverage",schemaPath:"#/properties/context/items/properties/coverage/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err96];
}
else {
vErrors.push(err96);
}
errors++;
}
}
if(data27.resolution !== undefined){
let data34 = data27.resolution;
if((typeof data34 !== "string") && (data34 !== null)){
const err97 = {instancePath:instancePath+"/context/" + i3+"/resolution",schemaPath:"#/properties/context/items/properties/resolution/type",keyword:"type",params:{type: schema11.properties.context.items.properties.resolution.type},message:"must be string,null"};
if(vErrors === null){
vErrors = [err97];
}
else {
vErrors.push(err97);
}
errors++;
}
}
}
else {
const err98 = {instancePath:instancePath+"/context/" + i3,schemaPath:"#/properties/context/items/type",keyword:"type",params:{type: "object"},message:"must be object"};
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
const err99 = {instancePath:instancePath+"/context",schemaPath:"#/properties/context/type",keyword:"type",params:{type: "array"},message:"must be array"};
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
const err100 = {instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err100];
}
else {
vErrors.push(err100);
}
errors++;
}
validate10.errors = vErrors;
return errors === 0;
}

