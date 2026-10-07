// Generated from openaq-policy.schema.json; run npm run contracts:generate. Do not edit.
"use strict";
module.exports = validate10;
module.exports.default = validate10;
const schema11 = {"$schema":"http://json-schema.org/draft-07/schema#","$id":"https://himalayan-disaster-atlas.invalid/schemas/openaq-policy.schema.json","type":"object","additionalProperties":false,"required":["schema_version","enabled_by_default","public_enabled","providers","reason"],"properties":{"schema_version":{"const":"1.0.0"},"enabled_by_default":{"const":false},"public_enabled":{"const":false},"reason":{"type":"string","minLength":1,"maxLength":2000},"providers":{"type":"array","maxItems":4,"items":{"type":"object","additionalProperties":false,"required":["status","provider_id","provider_name","location_id","sensor_id","license_ids","license_urls","license","attribution","reviewed_on","evidence_urls","obligations"],"properties":{"status":{"const":"PERMITTED"},"provider_id":{"type":"integer","minimum":1},"location_id":{"type":"integer","minimum":1},"sensor_id":{"type":"integer","minimum":1},"provider_name":{"type":"string","minLength":1,"maxLength":240},"license_ids":{"type":"array","minItems":1,"maxItems":8,"uniqueItems":true,"items":{"type":"integer","minimum":1}},"license_urls":{"type":"array","minItems":1,"maxItems":8,"uniqueItems":true,"items":{"type":"string","format":"uri","pattern":"^https://","maxLength":2000}},"license":{"type":"string","minLength":1,"maxLength":2000},"attribution":{"type":"string","minLength":1,"maxLength":2000},"reviewed_on":{"type":"string","format":"date"},"evidence_urls":{"type":"array","minItems":1,"maxItems":8,"uniqueItems":true,"items":{"type":"string","format":"uri","pattern":"^https://","maxLength":2000}},"obligations":{"type":"string","minLength":1,"maxLength":2000}}}}}};
const func2 = require("ajv/dist/runtime/ucs2length").default;
const func4 = Object.prototype.hasOwnProperty;
const formats0 = require("ajv-formats/dist/formats").fullFormats.uri;
const formats2 = require("ajv-formats/dist/formats").fullFormats.date;
const pattern0 = new RegExp("^https://", "u");

function validate10(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
/*# sourceURL="https://himalayan-disaster-atlas.invalid/schemas/openaq-policy.schema.json" */;
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
if(data.enabled_by_default === undefined){
const err1 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "enabled_by_default"},message:"must have required property '"+"enabled_by_default"+"'"};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
if(data.public_enabled === undefined){
const err2 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "public_enabled"},message:"must have required property '"+"public_enabled"+"'"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
if(data.providers === undefined){
const err3 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "providers"},message:"must have required property '"+"providers"+"'"};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
if(data.reason === undefined){
const err4 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "reason"},message:"must have required property '"+"reason"+"'"};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
for(const key0 in data){
if(!(((((key0 === "schema_version") || (key0 === "enabled_by_default")) || (key0 === "public_enabled")) || (key0 === "reason")) || (key0 === "providers"))){
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
if(data.enabled_by_default !== undefined){
if(false !== data.enabled_by_default){
const err7 = {instancePath:instancePath+"/enabled_by_default",schemaPath:"#/properties/enabled_by_default/const",keyword:"const",params:{allowedValue: false},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
}
}
if(data.public_enabled !== undefined){
if(false !== data.public_enabled){
const err8 = {instancePath:instancePath+"/public_enabled",schemaPath:"#/properties/public_enabled/const",keyword:"const",params:{allowedValue: false},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err8];
}
else {
vErrors.push(err8);
}
errors++;
}
}
if(data.reason !== undefined){
let data3 = data.reason;
if(typeof data3 === "string"){
if(func2(data3) > 2000){
const err9 = {instancePath:instancePath+"/reason",schemaPath:"#/properties/reason/maxLength",keyword:"maxLength",params:{limit: 2000},message:"must NOT have more than 2000 characters"};
if(vErrors === null){
vErrors = [err9];
}
else {
vErrors.push(err9);
}
errors++;
}
if(func2(data3) < 1){
const err10 = {instancePath:instancePath+"/reason",schemaPath:"#/properties/reason/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err10];
}
else {
vErrors.push(err10);
}
errors++;
}
}
else {
const err11 = {instancePath:instancePath+"/reason",schemaPath:"#/properties/reason/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err11];
}
else {
vErrors.push(err11);
}
errors++;
}
}
if(data.providers !== undefined){
let data4 = data.providers;
if(Array.isArray(data4)){
if(data4.length > 4){
const err12 = {instancePath:instancePath+"/providers",schemaPath:"#/properties/providers/maxItems",keyword:"maxItems",params:{limit: 4},message:"must NOT have more than 4 items"};
if(vErrors === null){
vErrors = [err12];
}
else {
vErrors.push(err12);
}
errors++;
}
const len0 = data4.length;
for(let i0=0; i0<len0; i0++){
let data5 = data4[i0];
if(data5 && typeof data5 == "object" && !Array.isArray(data5)){
if(data5.status === undefined){
const err13 = {instancePath:instancePath+"/providers/" + i0,schemaPath:"#/properties/providers/items/required",keyword:"required",params:{missingProperty: "status"},message:"must have required property '"+"status"+"'"};
if(vErrors === null){
vErrors = [err13];
}
else {
vErrors.push(err13);
}
errors++;
}
if(data5.provider_id === undefined){
const err14 = {instancePath:instancePath+"/providers/" + i0,schemaPath:"#/properties/providers/items/required",keyword:"required",params:{missingProperty: "provider_id"},message:"must have required property '"+"provider_id"+"'"};
if(vErrors === null){
vErrors = [err14];
}
else {
vErrors.push(err14);
}
errors++;
}
if(data5.provider_name === undefined){
const err15 = {instancePath:instancePath+"/providers/" + i0,schemaPath:"#/properties/providers/items/required",keyword:"required",params:{missingProperty: "provider_name"},message:"must have required property '"+"provider_name"+"'"};
if(vErrors === null){
vErrors = [err15];
}
else {
vErrors.push(err15);
}
errors++;
}
if(data5.location_id === undefined){
const err16 = {instancePath:instancePath+"/providers/" + i0,schemaPath:"#/properties/providers/items/required",keyword:"required",params:{missingProperty: "location_id"},message:"must have required property '"+"location_id"+"'"};
if(vErrors === null){
vErrors = [err16];
}
else {
vErrors.push(err16);
}
errors++;
}
if(data5.sensor_id === undefined){
const err17 = {instancePath:instancePath+"/providers/" + i0,schemaPath:"#/properties/providers/items/required",keyword:"required",params:{missingProperty: "sensor_id"},message:"must have required property '"+"sensor_id"+"'"};
if(vErrors === null){
vErrors = [err17];
}
else {
vErrors.push(err17);
}
errors++;
}
if(data5.license_ids === undefined){
const err18 = {instancePath:instancePath+"/providers/" + i0,schemaPath:"#/properties/providers/items/required",keyword:"required",params:{missingProperty: "license_ids"},message:"must have required property '"+"license_ids"+"'"};
if(vErrors === null){
vErrors = [err18];
}
else {
vErrors.push(err18);
}
errors++;
}
if(data5.license_urls === undefined){
const err19 = {instancePath:instancePath+"/providers/" + i0,schemaPath:"#/properties/providers/items/required",keyword:"required",params:{missingProperty: "license_urls"},message:"must have required property '"+"license_urls"+"'"};
if(vErrors === null){
vErrors = [err19];
}
else {
vErrors.push(err19);
}
errors++;
}
if(data5.license === undefined){
const err20 = {instancePath:instancePath+"/providers/" + i0,schemaPath:"#/properties/providers/items/required",keyword:"required",params:{missingProperty: "license"},message:"must have required property '"+"license"+"'"};
if(vErrors === null){
vErrors = [err20];
}
else {
vErrors.push(err20);
}
errors++;
}
if(data5.attribution === undefined){
const err21 = {instancePath:instancePath+"/providers/" + i0,schemaPath:"#/properties/providers/items/required",keyword:"required",params:{missingProperty: "attribution"},message:"must have required property '"+"attribution"+"'"};
if(vErrors === null){
vErrors = [err21];
}
else {
vErrors.push(err21);
}
errors++;
}
if(data5.reviewed_on === undefined){
const err22 = {instancePath:instancePath+"/providers/" + i0,schemaPath:"#/properties/providers/items/required",keyword:"required",params:{missingProperty: "reviewed_on"},message:"must have required property '"+"reviewed_on"+"'"};
if(vErrors === null){
vErrors = [err22];
}
else {
vErrors.push(err22);
}
errors++;
}
if(data5.evidence_urls === undefined){
const err23 = {instancePath:instancePath+"/providers/" + i0,schemaPath:"#/properties/providers/items/required",keyword:"required",params:{missingProperty: "evidence_urls"},message:"must have required property '"+"evidence_urls"+"'"};
if(vErrors === null){
vErrors = [err23];
}
else {
vErrors.push(err23);
}
errors++;
}
if(data5.obligations === undefined){
const err24 = {instancePath:instancePath+"/providers/" + i0,schemaPath:"#/properties/providers/items/required",keyword:"required",params:{missingProperty: "obligations"},message:"must have required property '"+"obligations"+"'"};
if(vErrors === null){
vErrors = [err24];
}
else {
vErrors.push(err24);
}
errors++;
}
for(const key1 in data5){
if(!(func4.call(schema11.properties.providers.items.properties, key1))){
const err25 = {instancePath:instancePath+"/providers/" + i0,schemaPath:"#/properties/providers/items/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key1},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err25];
}
else {
vErrors.push(err25);
}
errors++;
}
}
if(data5.status !== undefined){
if("PERMITTED" !== data5.status){
const err26 = {instancePath:instancePath+"/providers/" + i0+"/status",schemaPath:"#/properties/providers/items/properties/status/const",keyword:"const",params:{allowedValue: "PERMITTED"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err26];
}
else {
vErrors.push(err26);
}
errors++;
}
}
if(data5.provider_id !== undefined){
let data7 = data5.provider_id;
if(!(((typeof data7 == "number") && (!(data7 % 1) && !isNaN(data7))) && (isFinite(data7)))){
const err27 = {instancePath:instancePath+"/providers/" + i0+"/provider_id",schemaPath:"#/properties/providers/items/properties/provider_id/type",keyword:"type",params:{type: "integer"},message:"must be integer"};
if(vErrors === null){
vErrors = [err27];
}
else {
vErrors.push(err27);
}
errors++;
}
if((typeof data7 == "number") && (isFinite(data7))){
if(data7 < 1 || isNaN(data7)){
const err28 = {instancePath:instancePath+"/providers/" + i0+"/provider_id",schemaPath:"#/properties/providers/items/properties/provider_id/minimum",keyword:"minimum",params:{comparison: ">=", limit: 1},message:"must be >= 1"};
if(vErrors === null){
vErrors = [err28];
}
else {
vErrors.push(err28);
}
errors++;
}
}
}
if(data5.location_id !== undefined){
let data8 = data5.location_id;
if(!(((typeof data8 == "number") && (!(data8 % 1) && !isNaN(data8))) && (isFinite(data8)))){
const err29 = {instancePath:instancePath+"/providers/" + i0+"/location_id",schemaPath:"#/properties/providers/items/properties/location_id/type",keyword:"type",params:{type: "integer"},message:"must be integer"};
if(vErrors === null){
vErrors = [err29];
}
else {
vErrors.push(err29);
}
errors++;
}
if((typeof data8 == "number") && (isFinite(data8))){
if(data8 < 1 || isNaN(data8)){
const err30 = {instancePath:instancePath+"/providers/" + i0+"/location_id",schemaPath:"#/properties/providers/items/properties/location_id/minimum",keyword:"minimum",params:{comparison: ">=", limit: 1},message:"must be >= 1"};
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
if(data5.sensor_id !== undefined){
let data9 = data5.sensor_id;
if(!(((typeof data9 == "number") && (!(data9 % 1) && !isNaN(data9))) && (isFinite(data9)))){
const err31 = {instancePath:instancePath+"/providers/" + i0+"/sensor_id",schemaPath:"#/properties/providers/items/properties/sensor_id/type",keyword:"type",params:{type: "integer"},message:"must be integer"};
if(vErrors === null){
vErrors = [err31];
}
else {
vErrors.push(err31);
}
errors++;
}
if((typeof data9 == "number") && (isFinite(data9))){
if(data9 < 1 || isNaN(data9)){
const err32 = {instancePath:instancePath+"/providers/" + i0+"/sensor_id",schemaPath:"#/properties/providers/items/properties/sensor_id/minimum",keyword:"minimum",params:{comparison: ">=", limit: 1},message:"must be >= 1"};
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
if(data5.provider_name !== undefined){
let data10 = data5.provider_name;
if(typeof data10 === "string"){
if(func2(data10) > 240){
const err33 = {instancePath:instancePath+"/providers/" + i0+"/provider_name",schemaPath:"#/properties/providers/items/properties/provider_name/maxLength",keyword:"maxLength",params:{limit: 240},message:"must NOT have more than 240 characters"};
if(vErrors === null){
vErrors = [err33];
}
else {
vErrors.push(err33);
}
errors++;
}
if(func2(data10) < 1){
const err34 = {instancePath:instancePath+"/providers/" + i0+"/provider_name",schemaPath:"#/properties/providers/items/properties/provider_name/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err34];
}
else {
vErrors.push(err34);
}
errors++;
}
}
else {
const err35 = {instancePath:instancePath+"/providers/" + i0+"/provider_name",schemaPath:"#/properties/providers/items/properties/provider_name/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err35];
}
else {
vErrors.push(err35);
}
errors++;
}
}
if(data5.license_ids !== undefined){
let data11 = data5.license_ids;
if(Array.isArray(data11)){
if(data11.length > 8){
const err36 = {instancePath:instancePath+"/providers/" + i0+"/license_ids",schemaPath:"#/properties/providers/items/properties/license_ids/maxItems",keyword:"maxItems",params:{limit: 8},message:"must NOT have more than 8 items"};
if(vErrors === null){
vErrors = [err36];
}
else {
vErrors.push(err36);
}
errors++;
}
if(data11.length < 1){
const err37 = {instancePath:instancePath+"/providers/" + i0+"/license_ids",schemaPath:"#/properties/providers/items/properties/license_ids/minItems",keyword:"minItems",params:{limit: 1},message:"must NOT have fewer than 1 items"};
if(vErrors === null){
vErrors = [err37];
}
else {
vErrors.push(err37);
}
errors++;
}
const len1 = data11.length;
for(let i1=0; i1<len1; i1++){
let data12 = data11[i1];
if(!(((typeof data12 == "number") && (!(data12 % 1) && !isNaN(data12))) && (isFinite(data12)))){
const err38 = {instancePath:instancePath+"/providers/" + i0+"/license_ids/" + i1,schemaPath:"#/properties/providers/items/properties/license_ids/items/type",keyword:"type",params:{type: "integer"},message:"must be integer"};
if(vErrors === null){
vErrors = [err38];
}
else {
vErrors.push(err38);
}
errors++;
}
if((typeof data12 == "number") && (isFinite(data12))){
if(data12 < 1 || isNaN(data12)){
const err39 = {instancePath:instancePath+"/providers/" + i0+"/license_ids/" + i1,schemaPath:"#/properties/providers/items/properties/license_ids/items/minimum",keyword:"minimum",params:{comparison: ">=", limit: 1},message:"must be >= 1"};
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
let i2 = data11.length;
let j0;
if(i2 > 1){
const indices0 = {};
for(;i2--;){
let item0 = data11[i2];
if(!(((typeof item0 == "number") && (!(item0 % 1) && !isNaN(item0))) && (isFinite(item0)))){
continue;
}
if(typeof indices0[item0] == "number"){
j0 = indices0[item0];
const err40 = {instancePath:instancePath+"/providers/" + i0+"/license_ids",schemaPath:"#/properties/providers/items/properties/license_ids/uniqueItems",keyword:"uniqueItems",params:{i: i2, j: j0},message:"must NOT have duplicate items (items ## "+j0+" and "+i2+" are identical)"};
if(vErrors === null){
vErrors = [err40];
}
else {
vErrors.push(err40);
}
errors++;
break;
}
indices0[item0] = i2;
}
}
}
else {
const err41 = {instancePath:instancePath+"/providers/" + i0+"/license_ids",schemaPath:"#/properties/providers/items/properties/license_ids/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err41];
}
else {
vErrors.push(err41);
}
errors++;
}
}
if(data5.license_urls !== undefined){
let data13 = data5.license_urls;
if(Array.isArray(data13)){
if(data13.length > 8){
const err42 = {instancePath:instancePath+"/providers/" + i0+"/license_urls",schemaPath:"#/properties/providers/items/properties/license_urls/maxItems",keyword:"maxItems",params:{limit: 8},message:"must NOT have more than 8 items"};
if(vErrors === null){
vErrors = [err42];
}
else {
vErrors.push(err42);
}
errors++;
}
if(data13.length < 1){
const err43 = {instancePath:instancePath+"/providers/" + i0+"/license_urls",schemaPath:"#/properties/providers/items/properties/license_urls/minItems",keyword:"minItems",params:{limit: 1},message:"must NOT have fewer than 1 items"};
if(vErrors === null){
vErrors = [err43];
}
else {
vErrors.push(err43);
}
errors++;
}
const len2 = data13.length;
for(let i3=0; i3<len2; i3++){
let data14 = data13[i3];
if(typeof data14 === "string"){
if(func2(data14) > 2000){
const err44 = {instancePath:instancePath+"/providers/" + i0+"/license_urls/" + i3,schemaPath:"#/properties/providers/items/properties/license_urls/items/maxLength",keyword:"maxLength",params:{limit: 2000},message:"must NOT have more than 2000 characters"};
if(vErrors === null){
vErrors = [err44];
}
else {
vErrors.push(err44);
}
errors++;
}
if(!pattern0.test(data14)){
const err45 = {instancePath:instancePath+"/providers/" + i0+"/license_urls/" + i3,schemaPath:"#/properties/providers/items/properties/license_urls/items/pattern",keyword:"pattern",params:{pattern: "^https://"},message:"must match pattern \""+"^https://"+"\""};
if(vErrors === null){
vErrors = [err45];
}
else {
vErrors.push(err45);
}
errors++;
}
if(!(formats0(data14))){
const err46 = {instancePath:instancePath+"/providers/" + i0+"/license_urls/" + i3,schemaPath:"#/properties/providers/items/properties/license_urls/items/format",keyword:"format",params:{format: "uri"},message:"must match format \""+"uri"+"\""};
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
const err47 = {instancePath:instancePath+"/providers/" + i0+"/license_urls/" + i3,schemaPath:"#/properties/providers/items/properties/license_urls/items/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err47];
}
else {
vErrors.push(err47);
}
errors++;
}
}
let i4 = data13.length;
let j1;
if(i4 > 1){
const indices1 = {};
for(;i4--;){
let item1 = data13[i4];
if(typeof item1 !== "string"){
continue;
}
if(typeof indices1[item1] == "number"){
j1 = indices1[item1];
const err48 = {instancePath:instancePath+"/providers/" + i0+"/license_urls",schemaPath:"#/properties/providers/items/properties/license_urls/uniqueItems",keyword:"uniqueItems",params:{i: i4, j: j1},message:"must NOT have duplicate items (items ## "+j1+" and "+i4+" are identical)"};
if(vErrors === null){
vErrors = [err48];
}
else {
vErrors.push(err48);
}
errors++;
break;
}
indices1[item1] = i4;
}
}
}
else {
const err49 = {instancePath:instancePath+"/providers/" + i0+"/license_urls",schemaPath:"#/properties/providers/items/properties/license_urls/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err49];
}
else {
vErrors.push(err49);
}
errors++;
}
}
if(data5.license !== undefined){
let data15 = data5.license;
if(typeof data15 === "string"){
if(func2(data15) > 2000){
const err50 = {instancePath:instancePath+"/providers/" + i0+"/license",schemaPath:"#/properties/providers/items/properties/license/maxLength",keyword:"maxLength",params:{limit: 2000},message:"must NOT have more than 2000 characters"};
if(vErrors === null){
vErrors = [err50];
}
else {
vErrors.push(err50);
}
errors++;
}
if(func2(data15) < 1){
const err51 = {instancePath:instancePath+"/providers/" + i0+"/license",schemaPath:"#/properties/providers/items/properties/license/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
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
const err52 = {instancePath:instancePath+"/providers/" + i0+"/license",schemaPath:"#/properties/providers/items/properties/license/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err52];
}
else {
vErrors.push(err52);
}
errors++;
}
}
if(data5.attribution !== undefined){
let data16 = data5.attribution;
if(typeof data16 === "string"){
if(func2(data16) > 2000){
const err53 = {instancePath:instancePath+"/providers/" + i0+"/attribution",schemaPath:"#/properties/providers/items/properties/attribution/maxLength",keyword:"maxLength",params:{limit: 2000},message:"must NOT have more than 2000 characters"};
if(vErrors === null){
vErrors = [err53];
}
else {
vErrors.push(err53);
}
errors++;
}
if(func2(data16) < 1){
const err54 = {instancePath:instancePath+"/providers/" + i0+"/attribution",schemaPath:"#/properties/providers/items/properties/attribution/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
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
const err55 = {instancePath:instancePath+"/providers/" + i0+"/attribution",schemaPath:"#/properties/providers/items/properties/attribution/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err55];
}
else {
vErrors.push(err55);
}
errors++;
}
}
if(data5.reviewed_on !== undefined){
let data17 = data5.reviewed_on;
if(typeof data17 === "string"){
if(!(formats2.validate(data17))){
const err56 = {instancePath:instancePath+"/providers/" + i0+"/reviewed_on",schemaPath:"#/properties/providers/items/properties/reviewed_on/format",keyword:"format",params:{format: "date"},message:"must match format \""+"date"+"\""};
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
const err57 = {instancePath:instancePath+"/providers/" + i0+"/reviewed_on",schemaPath:"#/properties/providers/items/properties/reviewed_on/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err57];
}
else {
vErrors.push(err57);
}
errors++;
}
}
if(data5.evidence_urls !== undefined){
let data18 = data5.evidence_urls;
if(Array.isArray(data18)){
if(data18.length > 8){
const err58 = {instancePath:instancePath+"/providers/" + i0+"/evidence_urls",schemaPath:"#/properties/providers/items/properties/evidence_urls/maxItems",keyword:"maxItems",params:{limit: 8},message:"must NOT have more than 8 items"};
if(vErrors === null){
vErrors = [err58];
}
else {
vErrors.push(err58);
}
errors++;
}
if(data18.length < 1){
const err59 = {instancePath:instancePath+"/providers/" + i0+"/evidence_urls",schemaPath:"#/properties/providers/items/properties/evidence_urls/minItems",keyword:"minItems",params:{limit: 1},message:"must NOT have fewer than 1 items"};
if(vErrors === null){
vErrors = [err59];
}
else {
vErrors.push(err59);
}
errors++;
}
const len3 = data18.length;
for(let i5=0; i5<len3; i5++){
let data19 = data18[i5];
if(typeof data19 === "string"){
if(func2(data19) > 2000){
const err60 = {instancePath:instancePath+"/providers/" + i0+"/evidence_urls/" + i5,schemaPath:"#/properties/providers/items/properties/evidence_urls/items/maxLength",keyword:"maxLength",params:{limit: 2000},message:"must NOT have more than 2000 characters"};
if(vErrors === null){
vErrors = [err60];
}
else {
vErrors.push(err60);
}
errors++;
}
if(!pattern0.test(data19)){
const err61 = {instancePath:instancePath+"/providers/" + i0+"/evidence_urls/" + i5,schemaPath:"#/properties/providers/items/properties/evidence_urls/items/pattern",keyword:"pattern",params:{pattern: "^https://"},message:"must match pattern \""+"^https://"+"\""};
if(vErrors === null){
vErrors = [err61];
}
else {
vErrors.push(err61);
}
errors++;
}
if(!(formats0(data19))){
const err62 = {instancePath:instancePath+"/providers/" + i0+"/evidence_urls/" + i5,schemaPath:"#/properties/providers/items/properties/evidence_urls/items/format",keyword:"format",params:{format: "uri"},message:"must match format \""+"uri"+"\""};
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
const err63 = {instancePath:instancePath+"/providers/" + i0+"/evidence_urls/" + i5,schemaPath:"#/properties/providers/items/properties/evidence_urls/items/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err63];
}
else {
vErrors.push(err63);
}
errors++;
}
}
let i6 = data18.length;
let j2;
if(i6 > 1){
const indices2 = {};
for(;i6--;){
let item2 = data18[i6];
if(typeof item2 !== "string"){
continue;
}
if(typeof indices2[item2] == "number"){
j2 = indices2[item2];
const err64 = {instancePath:instancePath+"/providers/" + i0+"/evidence_urls",schemaPath:"#/properties/providers/items/properties/evidence_urls/uniqueItems",keyword:"uniqueItems",params:{i: i6, j: j2},message:"must NOT have duplicate items (items ## "+j2+" and "+i6+" are identical)"};
if(vErrors === null){
vErrors = [err64];
}
else {
vErrors.push(err64);
}
errors++;
break;
}
indices2[item2] = i6;
}
}
}
else {
const err65 = {instancePath:instancePath+"/providers/" + i0+"/evidence_urls",schemaPath:"#/properties/providers/items/properties/evidence_urls/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err65];
}
else {
vErrors.push(err65);
}
errors++;
}
}
if(data5.obligations !== undefined){
let data20 = data5.obligations;
if(typeof data20 === "string"){
if(func2(data20) > 2000){
const err66 = {instancePath:instancePath+"/providers/" + i0+"/obligations",schemaPath:"#/properties/providers/items/properties/obligations/maxLength",keyword:"maxLength",params:{limit: 2000},message:"must NOT have more than 2000 characters"};
if(vErrors === null){
vErrors = [err66];
}
else {
vErrors.push(err66);
}
errors++;
}
if(func2(data20) < 1){
const err67 = {instancePath:instancePath+"/providers/" + i0+"/obligations",schemaPath:"#/properties/providers/items/properties/obligations/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
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
const err68 = {instancePath:instancePath+"/providers/" + i0+"/obligations",schemaPath:"#/properties/providers/items/properties/obligations/type",keyword:"type",params:{type: "string"},message:"must be string"};
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
else {
const err69 = {instancePath:instancePath+"/providers/" + i0,schemaPath:"#/properties/providers/items/type",keyword:"type",params:{type: "object"},message:"must be object"};
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
const err70 = {instancePath:instancePath+"/providers",schemaPath:"#/properties/providers/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err70];
}
else {
vErrors.push(err70);
}
errors++;
}
}
}
else {
const err71 = {instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err71];
}
else {
vErrors.push(err71);
}
errors++;
}
validate10.errors = vErrors;
return errors === 0;
}

