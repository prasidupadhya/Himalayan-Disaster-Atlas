// Generated from event-page.schema.json; run npm run contracts:generate. Do not edit.
"use strict";
module.exports = validate10;
module.exports.default = validate10;
const schema11 = {"$schema":"http://json-schema.org/draft-07/schema#","$id":"https://himalayan-disaster-atlas.invalid/schemas/event-page.schema.json","title":"Himalayan Disaster Atlas event page","type":"object","additionalProperties":false,"required":["schema_version","event_id","dataset_id","dataset_version","title","date","location","hazard","description","impacts","timeline","sources","uncertainty","related_datasets","verification"],"properties":{"schema_version":{"const":"1.0.0"},"event_id":{"type":"string","minLength":1},"dataset_id":{"type":"string","pattern":"^nepal-disaster-events-"},"dataset_version":{"type":"string","pattern":"^\\d+\\.\\d+\\.\\d+$"},"title":{"type":"string","minLength":1},"date":{"type":"string","format":"date-time"},"location":{"type":"object","additionalProperties":false,"required":["label","longitude","latitude","relationship","source_path"],"properties":{"label":{"type":["string","null"]},"longitude":{"type":"number","minimum":-180,"maximum":180},"latitude":{"type":"number","minimum":-90,"maximum":90},"relationship":{"const":"reported incident point"},"source_path":{"type":"string","minLength":1}}},"hazard":{"type":"object","additionalProperties":false,"required":["value","source_path"],"properties":{"value":{"type":"string","minLength":1},"source_path":{"type":"string","minLength":1}}},"description":{"type":"object","additionalProperties":false,"required":["value","source_path"],"properties":{"value":{"type":["string","null"]},"source_path":{"type":"string","minLength":1}}},"impacts":{"type":"array","minItems":5,"maxItems":5,"items":{"type":"object","additionalProperties":false,"required":["kind","value","unit","source_path"],"properties":{"kind":{"enum":["deaths","injured","missing","affected","estimated_loss"]},"value":{"type":["number","null"],"minimum":0},"unit":{"enum":["person","NPR"]},"source_path":{"type":"string","minLength":1}}}},"timeline":{"type":"array","minItems":1,"maxItems":2,"items":{"type":"object","additionalProperties":false,"required":["label","time","source_path"],"properties":{"label":{"enum":["Incident time","Reported time"]},"time":{"type":"string","format":"date-time"},"source_path":{"type":"string","minLength":1}}}},"sources":{"type":"array","minItems":1,"items":{"type":"object","additionalProperties":false,"required":["label","dataset_id","dataset_version","manifest_path","source_url"],"properties":{"label":{"type":"string","minLength":1},"dataset_id":{"type":"string","minLength":1},"dataset_version":{"type":"string","minLength":1},"manifest_path":{"type":"string","pattern":"^/data/"},"source_url":{"type":["string","null"],"format":"uri"}}}},"uncertainty":{"type":"array","minItems":1,"items":{"type":"string","minLength":1}},"related_datasets":{"type":"array","items":{"type":"object","additionalProperties":false,"required":["label","href","relationship"],"properties":{"label":{"type":"string","minLength":1},"href":{"type":"string","pattern":"^/"},"relationship":{"const":"context only — not asserted as causally related"}}}},"verification":{"type":"object","additionalProperties":false,"required":["verified","approved"],"properties":{"verified":{"type":"boolean"},"approved":{"type":"boolean"}}}}};
const func2 = Object.prototype.hasOwnProperty;
const func3 = require("ajv/dist/runtime/ucs2length").default;
const pattern0 = new RegExp("^nepal-disaster-events-", "u");
const pattern1 = new RegExp("^\\d+\\.\\d+\\.\\d+$", "u");
const pattern2 = new RegExp("^/data/", "u");
const pattern3 = new RegExp("^/", "u");
const formats0 = require("ajv-formats/dist/formats").fullFormats["date-time"];
const formats4 = require("ajv-formats/dist/formats").fullFormats.uri;

function validate10(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
/*# sourceURL="https://himalayan-disaster-atlas.invalid/schemas/event-page.schema.json" */;
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
if(data.event_id === undefined){
const err1 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "event_id"},message:"must have required property '"+"event_id"+"'"};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
if(data.dataset_id === undefined){
const err2 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "dataset_id"},message:"must have required property '"+"dataset_id"+"'"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
if(data.dataset_version === undefined){
const err3 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "dataset_version"},message:"must have required property '"+"dataset_version"+"'"};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
if(data.title === undefined){
const err4 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "title"},message:"must have required property '"+"title"+"'"};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
if(data.date === undefined){
const err5 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "date"},message:"must have required property '"+"date"+"'"};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
if(data.location === undefined){
const err6 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "location"},message:"must have required property '"+"location"+"'"};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
if(data.hazard === undefined){
const err7 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "hazard"},message:"must have required property '"+"hazard"+"'"};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
}
if(data.description === undefined){
const err8 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "description"},message:"must have required property '"+"description"+"'"};
if(vErrors === null){
vErrors = [err8];
}
else {
vErrors.push(err8);
}
errors++;
}
if(data.impacts === undefined){
const err9 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "impacts"},message:"must have required property '"+"impacts"+"'"};
if(vErrors === null){
vErrors = [err9];
}
else {
vErrors.push(err9);
}
errors++;
}
if(data.timeline === undefined){
const err10 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "timeline"},message:"must have required property '"+"timeline"+"'"};
if(vErrors === null){
vErrors = [err10];
}
else {
vErrors.push(err10);
}
errors++;
}
if(data.sources === undefined){
const err11 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "sources"},message:"must have required property '"+"sources"+"'"};
if(vErrors === null){
vErrors = [err11];
}
else {
vErrors.push(err11);
}
errors++;
}
if(data.uncertainty === undefined){
const err12 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "uncertainty"},message:"must have required property '"+"uncertainty"+"'"};
if(vErrors === null){
vErrors = [err12];
}
else {
vErrors.push(err12);
}
errors++;
}
if(data.related_datasets === undefined){
const err13 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "related_datasets"},message:"must have required property '"+"related_datasets"+"'"};
if(vErrors === null){
vErrors = [err13];
}
else {
vErrors.push(err13);
}
errors++;
}
if(data.verification === undefined){
const err14 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "verification"},message:"must have required property '"+"verification"+"'"};
if(vErrors === null){
vErrors = [err14];
}
else {
vErrors.push(err14);
}
errors++;
}
for(const key0 in data){
if(!(func2.call(schema11.properties, key0))){
const err15 = {instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err15];
}
else {
vErrors.push(err15);
}
errors++;
}
}
if(data.schema_version !== undefined){
if("1.0.0" !== data.schema_version){
const err16 = {instancePath:instancePath+"/schema_version",schemaPath:"#/properties/schema_version/const",keyword:"const",params:{allowedValue: "1.0.0"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err16];
}
else {
vErrors.push(err16);
}
errors++;
}
}
if(data.event_id !== undefined){
let data1 = data.event_id;
if(typeof data1 === "string"){
if(func3(data1) < 1){
const err17 = {instancePath:instancePath+"/event_id",schemaPath:"#/properties/event_id/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err17];
}
else {
vErrors.push(err17);
}
errors++;
}
}
else {
const err18 = {instancePath:instancePath+"/event_id",schemaPath:"#/properties/event_id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err18];
}
else {
vErrors.push(err18);
}
errors++;
}
}
if(data.dataset_id !== undefined){
let data2 = data.dataset_id;
if(typeof data2 === "string"){
if(!pattern0.test(data2)){
const err19 = {instancePath:instancePath+"/dataset_id",schemaPath:"#/properties/dataset_id/pattern",keyword:"pattern",params:{pattern: "^nepal-disaster-events-"},message:"must match pattern \""+"^nepal-disaster-events-"+"\""};
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
const err20 = {instancePath:instancePath+"/dataset_id",schemaPath:"#/properties/dataset_id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err20];
}
else {
vErrors.push(err20);
}
errors++;
}
}
if(data.dataset_version !== undefined){
let data3 = data.dataset_version;
if(typeof data3 === "string"){
if(!pattern1.test(data3)){
const err21 = {instancePath:instancePath+"/dataset_version",schemaPath:"#/properties/dataset_version/pattern",keyword:"pattern",params:{pattern: "^\\d+\\.\\d+\\.\\d+$"},message:"must match pattern \""+"^\\d+\\.\\d+\\.\\d+$"+"\""};
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
const err22 = {instancePath:instancePath+"/dataset_version",schemaPath:"#/properties/dataset_version/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err22];
}
else {
vErrors.push(err22);
}
errors++;
}
}
if(data.title !== undefined){
let data4 = data.title;
if(typeof data4 === "string"){
if(func3(data4) < 1){
const err23 = {instancePath:instancePath+"/title",schemaPath:"#/properties/title/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
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
const err24 = {instancePath:instancePath+"/title",schemaPath:"#/properties/title/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err24];
}
else {
vErrors.push(err24);
}
errors++;
}
}
if(data.date !== undefined){
let data5 = data.date;
if(typeof data5 === "string"){
if(!(formats0.validate(data5))){
const err25 = {instancePath:instancePath+"/date",schemaPath:"#/properties/date/format",keyword:"format",params:{format: "date-time"},message:"must match format \""+"date-time"+"\""};
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
const err26 = {instancePath:instancePath+"/date",schemaPath:"#/properties/date/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err26];
}
else {
vErrors.push(err26);
}
errors++;
}
}
if(data.location !== undefined){
let data6 = data.location;
if(data6 && typeof data6 == "object" && !Array.isArray(data6)){
if(data6.label === undefined){
const err27 = {instancePath:instancePath+"/location",schemaPath:"#/properties/location/required",keyword:"required",params:{missingProperty: "label"},message:"must have required property '"+"label"+"'"};
if(vErrors === null){
vErrors = [err27];
}
else {
vErrors.push(err27);
}
errors++;
}
if(data6.longitude === undefined){
const err28 = {instancePath:instancePath+"/location",schemaPath:"#/properties/location/required",keyword:"required",params:{missingProperty: "longitude"},message:"must have required property '"+"longitude"+"'"};
if(vErrors === null){
vErrors = [err28];
}
else {
vErrors.push(err28);
}
errors++;
}
if(data6.latitude === undefined){
const err29 = {instancePath:instancePath+"/location",schemaPath:"#/properties/location/required",keyword:"required",params:{missingProperty: "latitude"},message:"must have required property '"+"latitude"+"'"};
if(vErrors === null){
vErrors = [err29];
}
else {
vErrors.push(err29);
}
errors++;
}
if(data6.relationship === undefined){
const err30 = {instancePath:instancePath+"/location",schemaPath:"#/properties/location/required",keyword:"required",params:{missingProperty: "relationship"},message:"must have required property '"+"relationship"+"'"};
if(vErrors === null){
vErrors = [err30];
}
else {
vErrors.push(err30);
}
errors++;
}
if(data6.source_path === undefined){
const err31 = {instancePath:instancePath+"/location",schemaPath:"#/properties/location/required",keyword:"required",params:{missingProperty: "source_path"},message:"must have required property '"+"source_path"+"'"};
if(vErrors === null){
vErrors = [err31];
}
else {
vErrors.push(err31);
}
errors++;
}
for(const key1 in data6){
if(!(((((key1 === "label") || (key1 === "longitude")) || (key1 === "latitude")) || (key1 === "relationship")) || (key1 === "source_path"))){
const err32 = {instancePath:instancePath+"/location",schemaPath:"#/properties/location/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key1},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err32];
}
else {
vErrors.push(err32);
}
errors++;
}
}
if(data6.label !== undefined){
let data7 = data6.label;
if((typeof data7 !== "string") && (data7 !== null)){
const err33 = {instancePath:instancePath+"/location/label",schemaPath:"#/properties/location/properties/label/type",keyword:"type",params:{type: schema11.properties.location.properties.label.type},message:"must be string,null"};
if(vErrors === null){
vErrors = [err33];
}
else {
vErrors.push(err33);
}
errors++;
}
}
if(data6.longitude !== undefined){
let data8 = data6.longitude;
if((typeof data8 == "number") && (isFinite(data8))){
if(data8 > 180 || isNaN(data8)){
const err34 = {instancePath:instancePath+"/location/longitude",schemaPath:"#/properties/location/properties/longitude/maximum",keyword:"maximum",params:{comparison: "<=", limit: 180},message:"must be <= 180"};
if(vErrors === null){
vErrors = [err34];
}
else {
vErrors.push(err34);
}
errors++;
}
if(data8 < -180 || isNaN(data8)){
const err35 = {instancePath:instancePath+"/location/longitude",schemaPath:"#/properties/location/properties/longitude/minimum",keyword:"minimum",params:{comparison: ">=", limit: -180},message:"must be >= -180"};
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
const err36 = {instancePath:instancePath+"/location/longitude",schemaPath:"#/properties/location/properties/longitude/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err36];
}
else {
vErrors.push(err36);
}
errors++;
}
}
if(data6.latitude !== undefined){
let data9 = data6.latitude;
if((typeof data9 == "number") && (isFinite(data9))){
if(data9 > 90 || isNaN(data9)){
const err37 = {instancePath:instancePath+"/location/latitude",schemaPath:"#/properties/location/properties/latitude/maximum",keyword:"maximum",params:{comparison: "<=", limit: 90},message:"must be <= 90"};
if(vErrors === null){
vErrors = [err37];
}
else {
vErrors.push(err37);
}
errors++;
}
if(data9 < -90 || isNaN(data9)){
const err38 = {instancePath:instancePath+"/location/latitude",schemaPath:"#/properties/location/properties/latitude/minimum",keyword:"minimum",params:{comparison: ">=", limit: -90},message:"must be >= -90"};
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
const err39 = {instancePath:instancePath+"/location/latitude",schemaPath:"#/properties/location/properties/latitude/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err39];
}
else {
vErrors.push(err39);
}
errors++;
}
}
if(data6.relationship !== undefined){
if("reported incident point" !== data6.relationship){
const err40 = {instancePath:instancePath+"/location/relationship",schemaPath:"#/properties/location/properties/relationship/const",keyword:"const",params:{allowedValue: "reported incident point"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err40];
}
else {
vErrors.push(err40);
}
errors++;
}
}
if(data6.source_path !== undefined){
let data11 = data6.source_path;
if(typeof data11 === "string"){
if(func3(data11) < 1){
const err41 = {instancePath:instancePath+"/location/source_path",schemaPath:"#/properties/location/properties/source_path/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
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
const err42 = {instancePath:instancePath+"/location/source_path",schemaPath:"#/properties/location/properties/source_path/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err42];
}
else {
vErrors.push(err42);
}
errors++;
}
}
}
else {
const err43 = {instancePath:instancePath+"/location",schemaPath:"#/properties/location/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err43];
}
else {
vErrors.push(err43);
}
errors++;
}
}
if(data.hazard !== undefined){
let data12 = data.hazard;
if(data12 && typeof data12 == "object" && !Array.isArray(data12)){
if(data12.value === undefined){
const err44 = {instancePath:instancePath+"/hazard",schemaPath:"#/properties/hazard/required",keyword:"required",params:{missingProperty: "value"},message:"must have required property '"+"value"+"'"};
if(vErrors === null){
vErrors = [err44];
}
else {
vErrors.push(err44);
}
errors++;
}
if(data12.source_path === undefined){
const err45 = {instancePath:instancePath+"/hazard",schemaPath:"#/properties/hazard/required",keyword:"required",params:{missingProperty: "source_path"},message:"must have required property '"+"source_path"+"'"};
if(vErrors === null){
vErrors = [err45];
}
else {
vErrors.push(err45);
}
errors++;
}
for(const key2 in data12){
if(!((key2 === "value") || (key2 === "source_path"))){
const err46 = {instancePath:instancePath+"/hazard",schemaPath:"#/properties/hazard/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key2},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err46];
}
else {
vErrors.push(err46);
}
errors++;
}
}
if(data12.value !== undefined){
let data13 = data12.value;
if(typeof data13 === "string"){
if(func3(data13) < 1){
const err47 = {instancePath:instancePath+"/hazard/value",schemaPath:"#/properties/hazard/properties/value/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
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
const err48 = {instancePath:instancePath+"/hazard/value",schemaPath:"#/properties/hazard/properties/value/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err48];
}
else {
vErrors.push(err48);
}
errors++;
}
}
if(data12.source_path !== undefined){
let data14 = data12.source_path;
if(typeof data14 === "string"){
if(func3(data14) < 1){
const err49 = {instancePath:instancePath+"/hazard/source_path",schemaPath:"#/properties/hazard/properties/source_path/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
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
const err50 = {instancePath:instancePath+"/hazard/source_path",schemaPath:"#/properties/hazard/properties/source_path/type",keyword:"type",params:{type: "string"},message:"must be string"};
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
else {
const err51 = {instancePath:instancePath+"/hazard",schemaPath:"#/properties/hazard/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err51];
}
else {
vErrors.push(err51);
}
errors++;
}
}
if(data.description !== undefined){
let data15 = data.description;
if(data15 && typeof data15 == "object" && !Array.isArray(data15)){
if(data15.value === undefined){
const err52 = {instancePath:instancePath+"/description",schemaPath:"#/properties/description/required",keyword:"required",params:{missingProperty: "value"},message:"must have required property '"+"value"+"'"};
if(vErrors === null){
vErrors = [err52];
}
else {
vErrors.push(err52);
}
errors++;
}
if(data15.source_path === undefined){
const err53 = {instancePath:instancePath+"/description",schemaPath:"#/properties/description/required",keyword:"required",params:{missingProperty: "source_path"},message:"must have required property '"+"source_path"+"'"};
if(vErrors === null){
vErrors = [err53];
}
else {
vErrors.push(err53);
}
errors++;
}
for(const key3 in data15){
if(!((key3 === "value") || (key3 === "source_path"))){
const err54 = {instancePath:instancePath+"/description",schemaPath:"#/properties/description/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key3},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err54];
}
else {
vErrors.push(err54);
}
errors++;
}
}
if(data15.value !== undefined){
let data16 = data15.value;
if((typeof data16 !== "string") && (data16 !== null)){
const err55 = {instancePath:instancePath+"/description/value",schemaPath:"#/properties/description/properties/value/type",keyword:"type",params:{type: schema11.properties.description.properties.value.type},message:"must be string,null"};
if(vErrors === null){
vErrors = [err55];
}
else {
vErrors.push(err55);
}
errors++;
}
}
if(data15.source_path !== undefined){
let data17 = data15.source_path;
if(typeof data17 === "string"){
if(func3(data17) < 1){
const err56 = {instancePath:instancePath+"/description/source_path",schemaPath:"#/properties/description/properties/source_path/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
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
const err57 = {instancePath:instancePath+"/description/source_path",schemaPath:"#/properties/description/properties/source_path/type",keyword:"type",params:{type: "string"},message:"must be string"};
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
const err58 = {instancePath:instancePath+"/description",schemaPath:"#/properties/description/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err58];
}
else {
vErrors.push(err58);
}
errors++;
}
}
if(data.impacts !== undefined){
let data18 = data.impacts;
if(Array.isArray(data18)){
if(data18.length > 5){
const err59 = {instancePath:instancePath+"/impacts",schemaPath:"#/properties/impacts/maxItems",keyword:"maxItems",params:{limit: 5},message:"must NOT have more than 5 items"};
if(vErrors === null){
vErrors = [err59];
}
else {
vErrors.push(err59);
}
errors++;
}
if(data18.length < 5){
const err60 = {instancePath:instancePath+"/impacts",schemaPath:"#/properties/impacts/minItems",keyword:"minItems",params:{limit: 5},message:"must NOT have fewer than 5 items"};
if(vErrors === null){
vErrors = [err60];
}
else {
vErrors.push(err60);
}
errors++;
}
const len0 = data18.length;
for(let i0=0; i0<len0; i0++){
let data19 = data18[i0];
if(data19 && typeof data19 == "object" && !Array.isArray(data19)){
if(data19.kind === undefined){
const err61 = {instancePath:instancePath+"/impacts/" + i0,schemaPath:"#/properties/impacts/items/required",keyword:"required",params:{missingProperty: "kind"},message:"must have required property '"+"kind"+"'"};
if(vErrors === null){
vErrors = [err61];
}
else {
vErrors.push(err61);
}
errors++;
}
if(data19.value === undefined){
const err62 = {instancePath:instancePath+"/impacts/" + i0,schemaPath:"#/properties/impacts/items/required",keyword:"required",params:{missingProperty: "value"},message:"must have required property '"+"value"+"'"};
if(vErrors === null){
vErrors = [err62];
}
else {
vErrors.push(err62);
}
errors++;
}
if(data19.unit === undefined){
const err63 = {instancePath:instancePath+"/impacts/" + i0,schemaPath:"#/properties/impacts/items/required",keyword:"required",params:{missingProperty: "unit"},message:"must have required property '"+"unit"+"'"};
if(vErrors === null){
vErrors = [err63];
}
else {
vErrors.push(err63);
}
errors++;
}
if(data19.source_path === undefined){
const err64 = {instancePath:instancePath+"/impacts/" + i0,schemaPath:"#/properties/impacts/items/required",keyword:"required",params:{missingProperty: "source_path"},message:"must have required property '"+"source_path"+"'"};
if(vErrors === null){
vErrors = [err64];
}
else {
vErrors.push(err64);
}
errors++;
}
for(const key4 in data19){
if(!((((key4 === "kind") || (key4 === "value")) || (key4 === "unit")) || (key4 === "source_path"))){
const err65 = {instancePath:instancePath+"/impacts/" + i0,schemaPath:"#/properties/impacts/items/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key4},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err65];
}
else {
vErrors.push(err65);
}
errors++;
}
}
if(data19.kind !== undefined){
let data20 = data19.kind;
if(!(((((data20 === "deaths") || (data20 === "injured")) || (data20 === "missing")) || (data20 === "affected")) || (data20 === "estimated_loss"))){
const err66 = {instancePath:instancePath+"/impacts/" + i0+"/kind",schemaPath:"#/properties/impacts/items/properties/kind/enum",keyword:"enum",params:{allowedValues: schema11.properties.impacts.items.properties.kind.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err66];
}
else {
vErrors.push(err66);
}
errors++;
}
}
if(data19.value !== undefined){
let data21 = data19.value;
if((!((typeof data21 == "number") && (isFinite(data21)))) && (data21 !== null)){
const err67 = {instancePath:instancePath+"/impacts/" + i0+"/value",schemaPath:"#/properties/impacts/items/properties/value/type",keyword:"type",params:{type: schema11.properties.impacts.items.properties.value.type},message:"must be number,null"};
if(vErrors === null){
vErrors = [err67];
}
else {
vErrors.push(err67);
}
errors++;
}
if((typeof data21 == "number") && (isFinite(data21))){
if(data21 < 0 || isNaN(data21)){
const err68 = {instancePath:instancePath+"/impacts/" + i0+"/value",schemaPath:"#/properties/impacts/items/properties/value/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
if(vErrors === null){
vErrors = [err68];
}
else {
vErrors.push(err68);
}
errors++;
}
}
}
if(data19.unit !== undefined){
let data22 = data19.unit;
if(!((data22 === "person") || (data22 === "NPR"))){
const err69 = {instancePath:instancePath+"/impacts/" + i0+"/unit",schemaPath:"#/properties/impacts/items/properties/unit/enum",keyword:"enum",params:{allowedValues: schema11.properties.impacts.items.properties.unit.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err69];
}
else {
vErrors.push(err69);
}
errors++;
}
}
if(data19.source_path !== undefined){
let data23 = data19.source_path;
if(typeof data23 === "string"){
if(func3(data23) < 1){
const err70 = {instancePath:instancePath+"/impacts/" + i0+"/source_path",schemaPath:"#/properties/impacts/items/properties/source_path/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
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
const err71 = {instancePath:instancePath+"/impacts/" + i0+"/source_path",schemaPath:"#/properties/impacts/items/properties/source_path/type",keyword:"type",params:{type: "string"},message:"must be string"};
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
else {
const err72 = {instancePath:instancePath+"/impacts/" + i0,schemaPath:"#/properties/impacts/items/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err72];
}
else {
vErrors.push(err72);
}
errors++;
}
}
}
else {
const err73 = {instancePath:instancePath+"/impacts",schemaPath:"#/properties/impacts/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err73];
}
else {
vErrors.push(err73);
}
errors++;
}
}
if(data.timeline !== undefined){
let data24 = data.timeline;
if(Array.isArray(data24)){
if(data24.length > 2){
const err74 = {instancePath:instancePath+"/timeline",schemaPath:"#/properties/timeline/maxItems",keyword:"maxItems",params:{limit: 2},message:"must NOT have more than 2 items"};
if(vErrors === null){
vErrors = [err74];
}
else {
vErrors.push(err74);
}
errors++;
}
if(data24.length < 1){
const err75 = {instancePath:instancePath+"/timeline",schemaPath:"#/properties/timeline/minItems",keyword:"minItems",params:{limit: 1},message:"must NOT have fewer than 1 items"};
if(vErrors === null){
vErrors = [err75];
}
else {
vErrors.push(err75);
}
errors++;
}
const len1 = data24.length;
for(let i1=0; i1<len1; i1++){
let data25 = data24[i1];
if(data25 && typeof data25 == "object" && !Array.isArray(data25)){
if(data25.label === undefined){
const err76 = {instancePath:instancePath+"/timeline/" + i1,schemaPath:"#/properties/timeline/items/required",keyword:"required",params:{missingProperty: "label"},message:"must have required property '"+"label"+"'"};
if(vErrors === null){
vErrors = [err76];
}
else {
vErrors.push(err76);
}
errors++;
}
if(data25.time === undefined){
const err77 = {instancePath:instancePath+"/timeline/" + i1,schemaPath:"#/properties/timeline/items/required",keyword:"required",params:{missingProperty: "time"},message:"must have required property '"+"time"+"'"};
if(vErrors === null){
vErrors = [err77];
}
else {
vErrors.push(err77);
}
errors++;
}
if(data25.source_path === undefined){
const err78 = {instancePath:instancePath+"/timeline/" + i1,schemaPath:"#/properties/timeline/items/required",keyword:"required",params:{missingProperty: "source_path"},message:"must have required property '"+"source_path"+"'"};
if(vErrors === null){
vErrors = [err78];
}
else {
vErrors.push(err78);
}
errors++;
}
for(const key5 in data25){
if(!(((key5 === "label") || (key5 === "time")) || (key5 === "source_path"))){
const err79 = {instancePath:instancePath+"/timeline/" + i1,schemaPath:"#/properties/timeline/items/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key5},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err79];
}
else {
vErrors.push(err79);
}
errors++;
}
}
if(data25.label !== undefined){
let data26 = data25.label;
if(!((data26 === "Incident time") || (data26 === "Reported time"))){
const err80 = {instancePath:instancePath+"/timeline/" + i1+"/label",schemaPath:"#/properties/timeline/items/properties/label/enum",keyword:"enum",params:{allowedValues: schema11.properties.timeline.items.properties.label.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err80];
}
else {
vErrors.push(err80);
}
errors++;
}
}
if(data25.time !== undefined){
let data27 = data25.time;
if(typeof data27 === "string"){
if(!(formats0.validate(data27))){
const err81 = {instancePath:instancePath+"/timeline/" + i1+"/time",schemaPath:"#/properties/timeline/items/properties/time/format",keyword:"format",params:{format: "date-time"},message:"must match format \""+"date-time"+"\""};
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
const err82 = {instancePath:instancePath+"/timeline/" + i1+"/time",schemaPath:"#/properties/timeline/items/properties/time/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err82];
}
else {
vErrors.push(err82);
}
errors++;
}
}
if(data25.source_path !== undefined){
let data28 = data25.source_path;
if(typeof data28 === "string"){
if(func3(data28) < 1){
const err83 = {instancePath:instancePath+"/timeline/" + i1+"/source_path",schemaPath:"#/properties/timeline/items/properties/source_path/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
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
const err84 = {instancePath:instancePath+"/timeline/" + i1+"/source_path",schemaPath:"#/properties/timeline/items/properties/source_path/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err84];
}
else {
vErrors.push(err84);
}
errors++;
}
}
}
else {
const err85 = {instancePath:instancePath+"/timeline/" + i1,schemaPath:"#/properties/timeline/items/type",keyword:"type",params:{type: "object"},message:"must be object"};
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
const err86 = {instancePath:instancePath+"/timeline",schemaPath:"#/properties/timeline/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err86];
}
else {
vErrors.push(err86);
}
errors++;
}
}
if(data.sources !== undefined){
let data29 = data.sources;
if(Array.isArray(data29)){
if(data29.length < 1){
const err87 = {instancePath:instancePath+"/sources",schemaPath:"#/properties/sources/minItems",keyword:"minItems",params:{limit: 1},message:"must NOT have fewer than 1 items"};
if(vErrors === null){
vErrors = [err87];
}
else {
vErrors.push(err87);
}
errors++;
}
const len2 = data29.length;
for(let i2=0; i2<len2; i2++){
let data30 = data29[i2];
if(data30 && typeof data30 == "object" && !Array.isArray(data30)){
if(data30.label === undefined){
const err88 = {instancePath:instancePath+"/sources/" + i2,schemaPath:"#/properties/sources/items/required",keyword:"required",params:{missingProperty: "label"},message:"must have required property '"+"label"+"'"};
if(vErrors === null){
vErrors = [err88];
}
else {
vErrors.push(err88);
}
errors++;
}
if(data30.dataset_id === undefined){
const err89 = {instancePath:instancePath+"/sources/" + i2,schemaPath:"#/properties/sources/items/required",keyword:"required",params:{missingProperty: "dataset_id"},message:"must have required property '"+"dataset_id"+"'"};
if(vErrors === null){
vErrors = [err89];
}
else {
vErrors.push(err89);
}
errors++;
}
if(data30.dataset_version === undefined){
const err90 = {instancePath:instancePath+"/sources/" + i2,schemaPath:"#/properties/sources/items/required",keyword:"required",params:{missingProperty: "dataset_version"},message:"must have required property '"+"dataset_version"+"'"};
if(vErrors === null){
vErrors = [err90];
}
else {
vErrors.push(err90);
}
errors++;
}
if(data30.manifest_path === undefined){
const err91 = {instancePath:instancePath+"/sources/" + i2,schemaPath:"#/properties/sources/items/required",keyword:"required",params:{missingProperty: "manifest_path"},message:"must have required property '"+"manifest_path"+"'"};
if(vErrors === null){
vErrors = [err91];
}
else {
vErrors.push(err91);
}
errors++;
}
if(data30.source_url === undefined){
const err92 = {instancePath:instancePath+"/sources/" + i2,schemaPath:"#/properties/sources/items/required",keyword:"required",params:{missingProperty: "source_url"},message:"must have required property '"+"source_url"+"'"};
if(vErrors === null){
vErrors = [err92];
}
else {
vErrors.push(err92);
}
errors++;
}
for(const key6 in data30){
if(!(((((key6 === "label") || (key6 === "dataset_id")) || (key6 === "dataset_version")) || (key6 === "manifest_path")) || (key6 === "source_url"))){
const err93 = {instancePath:instancePath+"/sources/" + i2,schemaPath:"#/properties/sources/items/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key6},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err93];
}
else {
vErrors.push(err93);
}
errors++;
}
}
if(data30.label !== undefined){
let data31 = data30.label;
if(typeof data31 === "string"){
if(func3(data31) < 1){
const err94 = {instancePath:instancePath+"/sources/" + i2+"/label",schemaPath:"#/properties/sources/items/properties/label/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
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
const err95 = {instancePath:instancePath+"/sources/" + i2+"/label",schemaPath:"#/properties/sources/items/properties/label/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err95];
}
else {
vErrors.push(err95);
}
errors++;
}
}
if(data30.dataset_id !== undefined){
let data32 = data30.dataset_id;
if(typeof data32 === "string"){
if(func3(data32) < 1){
const err96 = {instancePath:instancePath+"/sources/" + i2+"/dataset_id",schemaPath:"#/properties/sources/items/properties/dataset_id/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err96];
}
else {
vErrors.push(err96);
}
errors++;
}
}
else {
const err97 = {instancePath:instancePath+"/sources/" + i2+"/dataset_id",schemaPath:"#/properties/sources/items/properties/dataset_id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err97];
}
else {
vErrors.push(err97);
}
errors++;
}
}
if(data30.dataset_version !== undefined){
let data33 = data30.dataset_version;
if(typeof data33 === "string"){
if(func3(data33) < 1){
const err98 = {instancePath:instancePath+"/sources/" + i2+"/dataset_version",schemaPath:"#/properties/sources/items/properties/dataset_version/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err98];
}
else {
vErrors.push(err98);
}
errors++;
}
}
else {
const err99 = {instancePath:instancePath+"/sources/" + i2+"/dataset_version",schemaPath:"#/properties/sources/items/properties/dataset_version/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err99];
}
else {
vErrors.push(err99);
}
errors++;
}
}
if(data30.manifest_path !== undefined){
let data34 = data30.manifest_path;
if(typeof data34 === "string"){
if(!pattern2.test(data34)){
const err100 = {instancePath:instancePath+"/sources/" + i2+"/manifest_path",schemaPath:"#/properties/sources/items/properties/manifest_path/pattern",keyword:"pattern",params:{pattern: "^/data/"},message:"must match pattern \""+"^/data/"+"\""};
if(vErrors === null){
vErrors = [err100];
}
else {
vErrors.push(err100);
}
errors++;
}
}
else {
const err101 = {instancePath:instancePath+"/sources/" + i2+"/manifest_path",schemaPath:"#/properties/sources/items/properties/manifest_path/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err101];
}
else {
vErrors.push(err101);
}
errors++;
}
}
if(data30.source_url !== undefined){
let data35 = data30.source_url;
if((typeof data35 !== "string") && (data35 !== null)){
const err102 = {instancePath:instancePath+"/sources/" + i2+"/source_url",schemaPath:"#/properties/sources/items/properties/source_url/type",keyword:"type",params:{type: schema11.properties.sources.items.properties.source_url.type},message:"must be string,null"};
if(vErrors === null){
vErrors = [err102];
}
else {
vErrors.push(err102);
}
errors++;
}
if(typeof data35 === "string"){
if(!(formats4(data35))){
const err103 = {instancePath:instancePath+"/sources/" + i2+"/source_url",schemaPath:"#/properties/sources/items/properties/source_url/format",keyword:"format",params:{format: "uri"},message:"must match format \""+"uri"+"\""};
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
}
else {
const err104 = {instancePath:instancePath+"/sources/" + i2,schemaPath:"#/properties/sources/items/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err104];
}
else {
vErrors.push(err104);
}
errors++;
}
}
}
else {
const err105 = {instancePath:instancePath+"/sources",schemaPath:"#/properties/sources/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err105];
}
else {
vErrors.push(err105);
}
errors++;
}
}
if(data.uncertainty !== undefined){
let data36 = data.uncertainty;
if(Array.isArray(data36)){
if(data36.length < 1){
const err106 = {instancePath:instancePath+"/uncertainty",schemaPath:"#/properties/uncertainty/minItems",keyword:"minItems",params:{limit: 1},message:"must NOT have fewer than 1 items"};
if(vErrors === null){
vErrors = [err106];
}
else {
vErrors.push(err106);
}
errors++;
}
const len3 = data36.length;
for(let i3=0; i3<len3; i3++){
let data37 = data36[i3];
if(typeof data37 === "string"){
if(func3(data37) < 1){
const err107 = {instancePath:instancePath+"/uncertainty/" + i3,schemaPath:"#/properties/uncertainty/items/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err107];
}
else {
vErrors.push(err107);
}
errors++;
}
}
else {
const err108 = {instancePath:instancePath+"/uncertainty/" + i3,schemaPath:"#/properties/uncertainty/items/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err108];
}
else {
vErrors.push(err108);
}
errors++;
}
}
}
else {
const err109 = {instancePath:instancePath+"/uncertainty",schemaPath:"#/properties/uncertainty/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err109];
}
else {
vErrors.push(err109);
}
errors++;
}
}
if(data.related_datasets !== undefined){
let data38 = data.related_datasets;
if(Array.isArray(data38)){
const len4 = data38.length;
for(let i4=0; i4<len4; i4++){
let data39 = data38[i4];
if(data39 && typeof data39 == "object" && !Array.isArray(data39)){
if(data39.label === undefined){
const err110 = {instancePath:instancePath+"/related_datasets/" + i4,schemaPath:"#/properties/related_datasets/items/required",keyword:"required",params:{missingProperty: "label"},message:"must have required property '"+"label"+"'"};
if(vErrors === null){
vErrors = [err110];
}
else {
vErrors.push(err110);
}
errors++;
}
if(data39.href === undefined){
const err111 = {instancePath:instancePath+"/related_datasets/" + i4,schemaPath:"#/properties/related_datasets/items/required",keyword:"required",params:{missingProperty: "href"},message:"must have required property '"+"href"+"'"};
if(vErrors === null){
vErrors = [err111];
}
else {
vErrors.push(err111);
}
errors++;
}
if(data39.relationship === undefined){
const err112 = {instancePath:instancePath+"/related_datasets/" + i4,schemaPath:"#/properties/related_datasets/items/required",keyword:"required",params:{missingProperty: "relationship"},message:"must have required property '"+"relationship"+"'"};
if(vErrors === null){
vErrors = [err112];
}
else {
vErrors.push(err112);
}
errors++;
}
for(const key7 in data39){
if(!(((key7 === "label") || (key7 === "href")) || (key7 === "relationship"))){
const err113 = {instancePath:instancePath+"/related_datasets/" + i4,schemaPath:"#/properties/related_datasets/items/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key7},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err113];
}
else {
vErrors.push(err113);
}
errors++;
}
}
if(data39.label !== undefined){
let data40 = data39.label;
if(typeof data40 === "string"){
if(func3(data40) < 1){
const err114 = {instancePath:instancePath+"/related_datasets/" + i4+"/label",schemaPath:"#/properties/related_datasets/items/properties/label/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
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
const err115 = {instancePath:instancePath+"/related_datasets/" + i4+"/label",schemaPath:"#/properties/related_datasets/items/properties/label/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err115];
}
else {
vErrors.push(err115);
}
errors++;
}
}
if(data39.href !== undefined){
let data41 = data39.href;
if(typeof data41 === "string"){
if(!pattern3.test(data41)){
const err116 = {instancePath:instancePath+"/related_datasets/" + i4+"/href",schemaPath:"#/properties/related_datasets/items/properties/href/pattern",keyword:"pattern",params:{pattern: "^/"},message:"must match pattern \""+"^/"+"\""};
if(vErrors === null){
vErrors = [err116];
}
else {
vErrors.push(err116);
}
errors++;
}
}
else {
const err117 = {instancePath:instancePath+"/related_datasets/" + i4+"/href",schemaPath:"#/properties/related_datasets/items/properties/href/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err117];
}
else {
vErrors.push(err117);
}
errors++;
}
}
if(data39.relationship !== undefined){
if("context only — not asserted as causally related" !== data39.relationship){
const err118 = {instancePath:instancePath+"/related_datasets/" + i4+"/relationship",schemaPath:"#/properties/related_datasets/items/properties/relationship/const",keyword:"const",params:{allowedValue: "context only — not asserted as causally related"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err118];
}
else {
vErrors.push(err118);
}
errors++;
}
}
}
else {
const err119 = {instancePath:instancePath+"/related_datasets/" + i4,schemaPath:"#/properties/related_datasets/items/type",keyword:"type",params:{type: "object"},message:"must be object"};
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
const err120 = {instancePath:instancePath+"/related_datasets",schemaPath:"#/properties/related_datasets/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err120];
}
else {
vErrors.push(err120);
}
errors++;
}
}
if(data.verification !== undefined){
let data43 = data.verification;
if(data43 && typeof data43 == "object" && !Array.isArray(data43)){
if(data43.verified === undefined){
const err121 = {instancePath:instancePath+"/verification",schemaPath:"#/properties/verification/required",keyword:"required",params:{missingProperty: "verified"},message:"must have required property '"+"verified"+"'"};
if(vErrors === null){
vErrors = [err121];
}
else {
vErrors.push(err121);
}
errors++;
}
if(data43.approved === undefined){
const err122 = {instancePath:instancePath+"/verification",schemaPath:"#/properties/verification/required",keyword:"required",params:{missingProperty: "approved"},message:"must have required property '"+"approved"+"'"};
if(vErrors === null){
vErrors = [err122];
}
else {
vErrors.push(err122);
}
errors++;
}
for(const key8 in data43){
if(!((key8 === "verified") || (key8 === "approved"))){
const err123 = {instancePath:instancePath+"/verification",schemaPath:"#/properties/verification/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key8},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err123];
}
else {
vErrors.push(err123);
}
errors++;
}
}
if(data43.verified !== undefined){
if(typeof data43.verified !== "boolean"){
const err124 = {instancePath:instancePath+"/verification/verified",schemaPath:"#/properties/verification/properties/verified/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"};
if(vErrors === null){
vErrors = [err124];
}
else {
vErrors.push(err124);
}
errors++;
}
}
if(data43.approved !== undefined){
if(typeof data43.approved !== "boolean"){
const err125 = {instancePath:instancePath+"/verification/approved",schemaPath:"#/properties/verification/properties/approved/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"};
if(vErrors === null){
vErrors = [err125];
}
else {
vErrors.push(err125);
}
errors++;
}
}
}
else {
const err126 = {instancePath:instancePath+"/verification",schemaPath:"#/properties/verification/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err126];
}
else {
vErrors.push(err126);
}
errors++;
}
}
}
else {
const err127 = {instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err127];
}
else {
vErrors.push(err127);
}
errors++;
}
validate10.errors = vErrors;
return errors === 0;
}

