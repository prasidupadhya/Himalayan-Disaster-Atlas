// Generated from live-feature.schema.json; run npm run contracts:generate. Do not edit.
"use strict";
module.exports = validate10;
module.exports.default = validate10;
const schema11 = {"$schema":"http://json-schema.org/draft-07/schema#","$id":"https://himalayan-disaster-atlas.invalid/schemas/live-feature.schema.json","type":"object","additionalProperties":false,"required":["schema_version","kind","id","version","title","is_fixture","source","source_url","license","license_url","attribution","method","limitations","artifacts"],"properties":{"schema_version":{"const":"1.0.0"},"kind":{"const":"live-feature-release"},"id":{"$ref":"live-snapshot.schema.json#/definitions/id"},"version":{"$ref":"live-snapshot.schema.json#/definitions/version"},"title":{"$ref":"live-snapshot.schema.json#/definitions/text"},"is_fixture":{"const":false},"source":{"const":"Himalayan Disaster Atlas original policy metadata"},"source_url":{"const":"https://github.com/prasidupadhya/Himalayan-Disaster-Atlas"},"license":{"const":"MIT"},"license_url":{"const":"https://opensource.org/license/mit/"},"attribution":{"$ref":"live-snapshot.schema.json#/definitions/text"},"method":{"$ref":"live-snapshot.schema.json#/definitions/text"},"limitations":{"type":"array","minItems":1,"allOf":[{"$ref":"live-snapshot.schema.json#/definitions/texts"}]},"artifacts":{"type":"object","additionalProperties":false,"required":["policy"],"properties":{"policy":{"type":"object","additionalProperties":false,"required":["path","sha256","byte_size"],"properties":{"path":{"type":"string","pattern":"^/data/atlas-[a-z-]+/1\\.0\\.0/policy\\.json$"},"sha256":{"$ref":"live-snapshot.schema.json#/definitions/hash"},"byte_size":{"type":"integer","minimum":1,"maximum":65536}}}}}}};
const schema13 = {"type":"string","pattern":"^[a-z0-9]+(?:-[a-z0-9]+)*$","maxLength":100};
const schema14 = {"type":"string","pattern":"^\\d+\\.\\d+\\.\\d+$","maxLength":40};
const schema17 = {"type":"string","minLength":1,"maxLength":500};
const schema19 = {"type":"string","pattern":"^[a-f0-9]{64}$"};
const func2 = Object.prototype.hasOwnProperty;
const func4 = require("ajv/dist/runtime/ucs2length").default;
const pattern0 = new RegExp("^[a-z0-9]+(?:-[a-z0-9]+)*$", "u");
const pattern1 = new RegExp("^\\d+\\.\\d+\\.\\d+$", "u");
const pattern11 = new RegExp("^/data/atlas-[a-z-]+/1\\.0\\.0/policy\\.json$", "u");
const pattern4 = new RegExp("^[a-f0-9]{64}$", "u");
const schema31 = {"type":"array","maxItems":32,"items":{"$ref":"#/definitions/text"}};

function validate24(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(Array.isArray(data)){
if(data.length > 32){
const err0 = {instancePath,schemaPath:"#/maxItems",keyword:"maxItems",params:{limit: 32},message:"must NOT have more than 32 items"};
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
if(typeof data0 === "string"){
if(func4(data0) > 500){
const err1 = {instancePath:instancePath+"/" + i0,schemaPath:"#/definitions/text/maxLength",keyword:"maxLength",params:{limit: 500},message:"must NOT have more than 500 characters"};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
if(func4(data0) < 1){
const err2 = {instancePath:instancePath+"/" + i0,schemaPath:"#/definitions/text/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
}
else {
const err3 = {instancePath:instancePath+"/" + i0,schemaPath:"#/definitions/text/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
}
}
else {
const err4 = {instancePath,schemaPath:"#/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
validate24.errors = vErrors;
return errors === 0;
}


function validate10(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
/*# sourceURL="https://himalayan-disaster-atlas.invalid/schemas/live-feature.schema.json" */;
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
if(data.is_fixture === undefined){
const err5 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "is_fixture"},message:"must have required property '"+"is_fixture"+"'"};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
if(data.source === undefined){
const err6 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "source"},message:"must have required property '"+"source"+"'"};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
if(data.source_url === undefined){
const err7 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "source_url"},message:"must have required property '"+"source_url"+"'"};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
}
if(data.license === undefined){
const err8 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "license"},message:"must have required property '"+"license"+"'"};
if(vErrors === null){
vErrors = [err8];
}
else {
vErrors.push(err8);
}
errors++;
}
if(data.license_url === undefined){
const err9 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "license_url"},message:"must have required property '"+"license_url"+"'"};
if(vErrors === null){
vErrors = [err9];
}
else {
vErrors.push(err9);
}
errors++;
}
if(data.attribution === undefined){
const err10 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "attribution"},message:"must have required property '"+"attribution"+"'"};
if(vErrors === null){
vErrors = [err10];
}
else {
vErrors.push(err10);
}
errors++;
}
if(data.method === undefined){
const err11 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "method"},message:"must have required property '"+"method"+"'"};
if(vErrors === null){
vErrors = [err11];
}
else {
vErrors.push(err11);
}
errors++;
}
if(data.limitations === undefined){
const err12 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "limitations"},message:"must have required property '"+"limitations"+"'"};
if(vErrors === null){
vErrors = [err12];
}
else {
vErrors.push(err12);
}
errors++;
}
if(data.artifacts === undefined){
const err13 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "artifacts"},message:"must have required property '"+"artifacts"+"'"};
if(vErrors === null){
vErrors = [err13];
}
else {
vErrors.push(err13);
}
errors++;
}
for(const key0 in data){
if(!(func2.call(schema11.properties, key0))){
const err14 = {instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err14];
}
else {
vErrors.push(err14);
}
errors++;
}
}
if(data.schema_version !== undefined){
if("1.0.0" !== data.schema_version){
const err15 = {instancePath:instancePath+"/schema_version",schemaPath:"#/properties/schema_version/const",keyword:"const",params:{allowedValue: "1.0.0"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err15];
}
else {
vErrors.push(err15);
}
errors++;
}
}
if(data.kind !== undefined){
if("live-feature-release" !== data.kind){
const err16 = {instancePath:instancePath+"/kind",schemaPath:"#/properties/kind/const",keyword:"const",params:{allowedValue: "live-feature-release"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err16];
}
else {
vErrors.push(err16);
}
errors++;
}
}
if(data.id !== undefined){
let data2 = data.id;
if(typeof data2 === "string"){
if(func4(data2) > 100){
const err17 = {instancePath:instancePath+"/id",schemaPath:"live-snapshot.schema.json#/definitions/id/maxLength",keyword:"maxLength",params:{limit: 100},message:"must NOT have more than 100 characters"};
if(vErrors === null){
vErrors = [err17];
}
else {
vErrors.push(err17);
}
errors++;
}
if(!pattern0.test(data2)){
const err18 = {instancePath:instancePath+"/id",schemaPath:"live-snapshot.schema.json#/definitions/id/pattern",keyword:"pattern",params:{pattern: "^[a-z0-9]+(?:-[a-z0-9]+)*$"},message:"must match pattern \""+"^[a-z0-9]+(?:-[a-z0-9]+)*$"+"\""};
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
const err19 = {instancePath:instancePath+"/id",schemaPath:"live-snapshot.schema.json#/definitions/id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err19];
}
else {
vErrors.push(err19);
}
errors++;
}
}
if(data.version !== undefined){
let data3 = data.version;
if(typeof data3 === "string"){
if(func4(data3) > 40){
const err20 = {instancePath:instancePath+"/version",schemaPath:"live-snapshot.schema.json#/definitions/version/maxLength",keyword:"maxLength",params:{limit: 40},message:"must NOT have more than 40 characters"};
if(vErrors === null){
vErrors = [err20];
}
else {
vErrors.push(err20);
}
errors++;
}
if(!pattern1.test(data3)){
const err21 = {instancePath:instancePath+"/version",schemaPath:"live-snapshot.schema.json#/definitions/version/pattern",keyword:"pattern",params:{pattern: "^\\d+\\.\\d+\\.\\d+$"},message:"must match pattern \""+"^\\d+\\.\\d+\\.\\d+$"+"\""};
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
const err22 = {instancePath:instancePath+"/version",schemaPath:"live-snapshot.schema.json#/definitions/version/type",keyword:"type",params:{type: "string"},message:"must be string"};
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
if(func4(data4) > 500){
const err23 = {instancePath:instancePath+"/title",schemaPath:"live-snapshot.schema.json#/definitions/text/maxLength",keyword:"maxLength",params:{limit: 500},message:"must NOT have more than 500 characters"};
if(vErrors === null){
vErrors = [err23];
}
else {
vErrors.push(err23);
}
errors++;
}
if(func4(data4) < 1){
const err24 = {instancePath:instancePath+"/title",schemaPath:"live-snapshot.schema.json#/definitions/text/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err24];
}
else {
vErrors.push(err24);
}
errors++;
}
}
else {
const err25 = {instancePath:instancePath+"/title",schemaPath:"live-snapshot.schema.json#/definitions/text/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err25];
}
else {
vErrors.push(err25);
}
errors++;
}
}
if(data.is_fixture !== undefined){
if(false !== data.is_fixture){
const err26 = {instancePath:instancePath+"/is_fixture",schemaPath:"#/properties/is_fixture/const",keyword:"const",params:{allowedValue: false},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err26];
}
else {
vErrors.push(err26);
}
errors++;
}
}
if(data.source !== undefined){
if("Himalayan Disaster Atlas original policy metadata" !== data.source){
const err27 = {instancePath:instancePath+"/source",schemaPath:"#/properties/source/const",keyword:"const",params:{allowedValue: "Himalayan Disaster Atlas original policy metadata"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err27];
}
else {
vErrors.push(err27);
}
errors++;
}
}
if(data.source_url !== undefined){
if("https://github.com/prasidupadhya/Himalayan-Disaster-Atlas" !== data.source_url){
const err28 = {instancePath:instancePath+"/source_url",schemaPath:"#/properties/source_url/const",keyword:"const",params:{allowedValue: "https://github.com/prasidupadhya/Himalayan-Disaster-Atlas"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err28];
}
else {
vErrors.push(err28);
}
errors++;
}
}
if(data.license !== undefined){
if("MIT" !== data.license){
const err29 = {instancePath:instancePath+"/license",schemaPath:"#/properties/license/const",keyword:"const",params:{allowedValue: "MIT"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err29];
}
else {
vErrors.push(err29);
}
errors++;
}
}
if(data.license_url !== undefined){
if("https://opensource.org/license/mit/" !== data.license_url){
const err30 = {instancePath:instancePath+"/license_url",schemaPath:"#/properties/license_url/const",keyword:"const",params:{allowedValue: "https://opensource.org/license/mit/"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err30];
}
else {
vErrors.push(err30);
}
errors++;
}
}
if(data.attribution !== undefined){
let data10 = data.attribution;
if(typeof data10 === "string"){
if(func4(data10) > 500){
const err31 = {instancePath:instancePath+"/attribution",schemaPath:"live-snapshot.schema.json#/definitions/text/maxLength",keyword:"maxLength",params:{limit: 500},message:"must NOT have more than 500 characters"};
if(vErrors === null){
vErrors = [err31];
}
else {
vErrors.push(err31);
}
errors++;
}
if(func4(data10) < 1){
const err32 = {instancePath:instancePath+"/attribution",schemaPath:"live-snapshot.schema.json#/definitions/text/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
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
const err33 = {instancePath:instancePath+"/attribution",schemaPath:"live-snapshot.schema.json#/definitions/text/type",keyword:"type",params:{type: "string"},message:"must be string"};
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
let data11 = data.method;
if(typeof data11 === "string"){
if(func4(data11) > 500){
const err34 = {instancePath:instancePath+"/method",schemaPath:"live-snapshot.schema.json#/definitions/text/maxLength",keyword:"maxLength",params:{limit: 500},message:"must NOT have more than 500 characters"};
if(vErrors === null){
vErrors = [err34];
}
else {
vErrors.push(err34);
}
errors++;
}
if(func4(data11) < 1){
const err35 = {instancePath:instancePath+"/method",schemaPath:"live-snapshot.schema.json#/definitions/text/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
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
const err36 = {instancePath:instancePath+"/method",schemaPath:"live-snapshot.schema.json#/definitions/text/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err36];
}
else {
vErrors.push(err36);
}
errors++;
}
}
if(data.limitations !== undefined){
let data12 = data.limitations;
if(!(validate24(data12, {instancePath:instancePath+"/limitations",parentData:data,parentDataProperty:"limitations",rootData}))){
vErrors = vErrors === null ? validate24.errors : vErrors.concat(validate24.errors);
errors = vErrors.length;
}
if(Array.isArray(data12)){
if(data12.length < 1){
const err37 = {instancePath:instancePath+"/limitations",schemaPath:"#/properties/limitations/minItems",keyword:"minItems",params:{limit: 1},message:"must NOT have fewer than 1 items"};
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
const err38 = {instancePath:instancePath+"/limitations",schemaPath:"#/properties/limitations/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err38];
}
else {
vErrors.push(err38);
}
errors++;
}
}
if(data.artifacts !== undefined){
let data13 = data.artifacts;
if(data13 && typeof data13 == "object" && !Array.isArray(data13)){
if(data13.policy === undefined){
const err39 = {instancePath:instancePath+"/artifacts",schemaPath:"#/properties/artifacts/required",keyword:"required",params:{missingProperty: "policy"},message:"must have required property '"+"policy"+"'"};
if(vErrors === null){
vErrors = [err39];
}
else {
vErrors.push(err39);
}
errors++;
}
for(const key1 in data13){
if(!(key1 === "policy")){
const err40 = {instancePath:instancePath+"/artifacts",schemaPath:"#/properties/artifacts/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key1},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err40];
}
else {
vErrors.push(err40);
}
errors++;
}
}
if(data13.policy !== undefined){
let data14 = data13.policy;
if(data14 && typeof data14 == "object" && !Array.isArray(data14)){
if(data14.path === undefined){
const err41 = {instancePath:instancePath+"/artifacts/policy",schemaPath:"#/properties/artifacts/properties/policy/required",keyword:"required",params:{missingProperty: "path"},message:"must have required property '"+"path"+"'"};
if(vErrors === null){
vErrors = [err41];
}
else {
vErrors.push(err41);
}
errors++;
}
if(data14.sha256 === undefined){
const err42 = {instancePath:instancePath+"/artifacts/policy",schemaPath:"#/properties/artifacts/properties/policy/required",keyword:"required",params:{missingProperty: "sha256"},message:"must have required property '"+"sha256"+"'"};
if(vErrors === null){
vErrors = [err42];
}
else {
vErrors.push(err42);
}
errors++;
}
if(data14.byte_size === undefined){
const err43 = {instancePath:instancePath+"/artifacts/policy",schemaPath:"#/properties/artifacts/properties/policy/required",keyword:"required",params:{missingProperty: "byte_size"},message:"must have required property '"+"byte_size"+"'"};
if(vErrors === null){
vErrors = [err43];
}
else {
vErrors.push(err43);
}
errors++;
}
for(const key2 in data14){
if(!(((key2 === "path") || (key2 === "sha256")) || (key2 === "byte_size"))){
const err44 = {instancePath:instancePath+"/artifacts/policy",schemaPath:"#/properties/artifacts/properties/policy/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key2},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err44];
}
else {
vErrors.push(err44);
}
errors++;
}
}
if(data14.path !== undefined){
let data15 = data14.path;
if(typeof data15 === "string"){
if(!pattern11.test(data15)){
const err45 = {instancePath:instancePath+"/artifacts/policy/path",schemaPath:"#/properties/artifacts/properties/policy/properties/path/pattern",keyword:"pattern",params:{pattern: "^/data/atlas-[a-z-]+/1\\.0\\.0/policy\\.json$"},message:"must match pattern \""+"^/data/atlas-[a-z-]+/1\\.0\\.0/policy\\.json$"+"\""};
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
const err46 = {instancePath:instancePath+"/artifacts/policy/path",schemaPath:"#/properties/artifacts/properties/policy/properties/path/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err46];
}
else {
vErrors.push(err46);
}
errors++;
}
}
if(data14.sha256 !== undefined){
let data16 = data14.sha256;
if(typeof data16 === "string"){
if(!pattern4.test(data16)){
const err47 = {instancePath:instancePath+"/artifacts/policy/sha256",schemaPath:"live-snapshot.schema.json#/definitions/hash/pattern",keyword:"pattern",params:{pattern: "^[a-f0-9]{64}$"},message:"must match pattern \""+"^[a-f0-9]{64}$"+"\""};
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
const err48 = {instancePath:instancePath+"/artifacts/policy/sha256",schemaPath:"live-snapshot.schema.json#/definitions/hash/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err48];
}
else {
vErrors.push(err48);
}
errors++;
}
}
if(data14.byte_size !== undefined){
let data17 = data14.byte_size;
if(!(((typeof data17 == "number") && (!(data17 % 1) && !isNaN(data17))) && (isFinite(data17)))){
const err49 = {instancePath:instancePath+"/artifacts/policy/byte_size",schemaPath:"#/properties/artifacts/properties/policy/properties/byte_size/type",keyword:"type",params:{type: "integer"},message:"must be integer"};
if(vErrors === null){
vErrors = [err49];
}
else {
vErrors.push(err49);
}
errors++;
}
if((typeof data17 == "number") && (isFinite(data17))){
if(data17 > 65536 || isNaN(data17)){
const err50 = {instancePath:instancePath+"/artifacts/policy/byte_size",schemaPath:"#/properties/artifacts/properties/policy/properties/byte_size/maximum",keyword:"maximum",params:{comparison: "<=", limit: 65536},message:"must be <= 65536"};
if(vErrors === null){
vErrors = [err50];
}
else {
vErrors.push(err50);
}
errors++;
}
if(data17 < 1 || isNaN(data17)){
const err51 = {instancePath:instancePath+"/artifacts/policy/byte_size",schemaPath:"#/properties/artifacts/properties/policy/properties/byte_size/minimum",keyword:"minimum",params:{comparison: ">=", limit: 1},message:"must be >= 1"};
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
}
else {
const err52 = {instancePath:instancePath+"/artifacts/policy",schemaPath:"#/properties/artifacts/properties/policy/type",keyword:"type",params:{type: "object"},message:"must be object"};
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
const err53 = {instancePath:instancePath+"/artifacts",schemaPath:"#/properties/artifacts/type",keyword:"type",params:{type: "object"},message:"must be object"};
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

