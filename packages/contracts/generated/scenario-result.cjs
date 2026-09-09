// Generated from scenario-result.schema.json; run npm run contracts:generate. Do not edit.
"use strict";
module.exports = validate10;
module.exports.default = validate10;
const schema11 = {"type":"object","additionalProperties":false,"required":["schema_version","kind","id","version","status","evidence_type","label","simulation_level","model_class","model","is_fixture","run_sha256","calculated_at","processing_version","runtime","definition","assumptions","crs","vertical_datum","spatial_resolution","time_basis","path","termination","next_reach_id","total_length_km","pulse_discharge_m3_s","volume_per_section_m3","footprint","depth_m","velocity_m_s","confidence_interval","validation","limitations"],"properties":{"schema_version":{"const":"1.0.0"},"kind":{"const":"scenario-result"},"id":{"type":"string","minLength":1},"version":{"const":"1.0.0"},"status":{"enum":["complete","partial_coverage"]},"evidence_type":{"const":"modelled"},"label":{"const":"HYPOTHETICAL MODELLED SCENARIO — NOT A FORECAST"},"simulation_level":{"enum":[1,2]},"model_class":{"const":"network_approximation"},"model":{"type":"object","additionalProperties":false,"required":["id","version"],"properties":{"id":{"enum":["network-path","constant-celerity-pulse"]},"version":{"const":"1.0.0"}}},"is_fixture":{"type":"boolean"},"run_sha256":{"type":"string","pattern":"^[a-f0-9]{64}$"},"calculated_at":{"type":"string","format":"date-time"},"processing_version":{"const":"scenario-runner/1.0.0"},"runtime":{"type":"object","additionalProperties":false,"required":["python"],"properties":{"python":{"type":"string","minLength":1}}},"definition":{"type":"object","additionalProperties":false,"required":["schema_version","kind","id","version","is_fixture","model","simulation_level","source_reach_id","inputs","assumptions","parameters"],"properties":{"schema_version":{"const":"1.0.0"},"kind":{"const":"scenario-definition"},"id":{"type":"string","pattern":"^scenario-[a-z0-9-]+$"},"version":{"const":"1.0.0"},"is_fixture":{"type":"boolean"},"model":{"type":"object","additionalProperties":false,"required":["id","version"],"properties":{"id":{"enum":["network-path","constant-celerity-pulse"]},"version":{"const":"1.0.0"}}},"simulation_level":{"enum":[1,2]},"source_reach_id":{"type":"string","pattern":"^[1-9][0-9]*$"},"inputs":{"type":"array","minItems":1,"maxItems":8,"items":{"type":"object","additionalProperties":false,"required":["dataset_id","dataset_version","sha256","processing_version","source","license","observation_date"],"properties":{"dataset_id":{"type":"string","minLength":1},"dataset_version":{"type":"string","minLength":1},"sha256":{"type":"string","pattern":"^[a-f0-9]{64}$"},"processing_version":{"type":"string","minLength":1},"source":{"type":"string","minLength":1},"license":{"type":"string","minLength":1},"observation_date":{"type":["string","null"],"format":"date-time"}}}},"assumptions":{"type":"array","uniqueItems":true,"items":{"type":"string","minLength":1}},"parameters":{"oneOf":[{"type":"object","additionalProperties":false,"required":[],"properties":{}},{"type":"object","additionalProperties":false,"required":["celerity","release_volume","release_duration"],"properties":{"celerity":{"type":"object","additionalProperties":false,"required":["value","unit"],"properties":{"value":{"type":"number","minimum":0.1,"maximum":10},"unit":{"const":"m/s"}}},"release_volume":{"type":"object","additionalProperties":false,"required":["value","unit"],"properties":{"value":{"type":"number","minimum":0,"maximum":10000000},"unit":{"const":"m3"}}},"release_duration":{"type":"object","additionalProperties":false,"required":["value","unit"],"properties":{"value":{"type":"number","minimum":60,"maximum":86400},"unit":{"const":"s"}}}}}]}},"$schema":"http://json-schema.org/draft-07/schema#"},"assumptions":{"type":"array","items":{"type":"object","additionalProperties":false,"required":["id","version","statement"],"properties":{"id":{"type":"string","minLength":1},"version":{"const":"1.0.0"},"statement":{"type":"string","minLength":1}}}},"crs":{"const":"OGC:CRS84"},"vertical_datum":{"type":"null"},"spatial_resolution":{"const":"source river reaches; no terrain resampling"},"time_basis":{"const":"seconds relative to hypothetical release; not calendar arrival times"},"path":{"type":"array","minItems":1,"maxItems":5000,"items":{"type":"object","additionalProperties":false,"required":["reach_id","length_km","cumulative_length_km","entry_delay_s","exit_delay_s","pulse_end_at_exit_s"],"properties":{"reach_id":{"type":"string","minLength":1},"length_km":{"type":"number","minimum":0},"cumulative_length_km":{"type":"number","minimum":0},"entry_delay_s":{"type":["number","null"],"minimum":0},"exit_delay_s":{"type":["number","null"],"minimum":0},"pulse_end_at_exit_s":{"type":["number","null"],"minimum":0}}}},"termination":{"enum":["source_outlet","coverage_boundary"]},"next_reach_id":{"type":["string","null"]},"total_length_km":{"type":"number","minimum":0},"pulse_discharge_m3_s":{"type":["number","null"],"minimum":0},"volume_per_section_m3":{"type":["number","null"],"minimum":0},"footprint":{"type":"null"},"depth_m":{"type":"null"},"velocity_m_s":{"type":"null"},"confidence_interval":{"type":"null"},"validation":{"type":"object","additionalProperties":false,"required":["status","real_event_validation"],"properties":{"status":{"const":"synthetic_analytic_cases_only"},"real_event_validation":{"const":false}}},"limitations":{"type":"array","minItems":1,"items":{"type":"string","minLength":1}}},"$schema":"http://json-schema.org/draft-07/schema#"};
const func2 = Object.prototype.hasOwnProperty;
const func3 = require("ajv/dist/runtime/ucs2length").default;
const pattern0 = new RegExp("^[a-f0-9]{64}$", "u");
const pattern1 = new RegExp("^scenario-[a-z0-9-]+$", "u");
const pattern2 = new RegExp("^[1-9][0-9]*$", "u");
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
if(data.status === undefined){
const err4 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "status"},message:"must have required property '"+"status"+"'"};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
if(data.evidence_type === undefined){
const err5 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "evidence_type"},message:"must have required property '"+"evidence_type"+"'"};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
if(data.label === undefined){
const err6 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "label"},message:"must have required property '"+"label"+"'"};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
if(data.simulation_level === undefined){
const err7 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "simulation_level"},message:"must have required property '"+"simulation_level"+"'"};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
}
if(data.model_class === undefined){
const err8 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "model_class"},message:"must have required property '"+"model_class"+"'"};
if(vErrors === null){
vErrors = [err8];
}
else {
vErrors.push(err8);
}
errors++;
}
if(data.model === undefined){
const err9 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "model"},message:"must have required property '"+"model"+"'"};
if(vErrors === null){
vErrors = [err9];
}
else {
vErrors.push(err9);
}
errors++;
}
if(data.is_fixture === undefined){
const err10 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "is_fixture"},message:"must have required property '"+"is_fixture"+"'"};
if(vErrors === null){
vErrors = [err10];
}
else {
vErrors.push(err10);
}
errors++;
}
if(data.run_sha256 === undefined){
const err11 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "run_sha256"},message:"must have required property '"+"run_sha256"+"'"};
if(vErrors === null){
vErrors = [err11];
}
else {
vErrors.push(err11);
}
errors++;
}
if(data.calculated_at === undefined){
const err12 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "calculated_at"},message:"must have required property '"+"calculated_at"+"'"};
if(vErrors === null){
vErrors = [err12];
}
else {
vErrors.push(err12);
}
errors++;
}
if(data.processing_version === undefined){
const err13 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "processing_version"},message:"must have required property '"+"processing_version"+"'"};
if(vErrors === null){
vErrors = [err13];
}
else {
vErrors.push(err13);
}
errors++;
}
if(data.runtime === undefined){
const err14 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "runtime"},message:"must have required property '"+"runtime"+"'"};
if(vErrors === null){
vErrors = [err14];
}
else {
vErrors.push(err14);
}
errors++;
}
if(data.definition === undefined){
const err15 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "definition"},message:"must have required property '"+"definition"+"'"};
if(vErrors === null){
vErrors = [err15];
}
else {
vErrors.push(err15);
}
errors++;
}
if(data.assumptions === undefined){
const err16 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "assumptions"},message:"must have required property '"+"assumptions"+"'"};
if(vErrors === null){
vErrors = [err16];
}
else {
vErrors.push(err16);
}
errors++;
}
if(data.crs === undefined){
const err17 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "crs"},message:"must have required property '"+"crs"+"'"};
if(vErrors === null){
vErrors = [err17];
}
else {
vErrors.push(err17);
}
errors++;
}
if(data.vertical_datum === undefined){
const err18 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "vertical_datum"},message:"must have required property '"+"vertical_datum"+"'"};
if(vErrors === null){
vErrors = [err18];
}
else {
vErrors.push(err18);
}
errors++;
}
if(data.spatial_resolution === undefined){
const err19 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "spatial_resolution"},message:"must have required property '"+"spatial_resolution"+"'"};
if(vErrors === null){
vErrors = [err19];
}
else {
vErrors.push(err19);
}
errors++;
}
if(data.time_basis === undefined){
const err20 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "time_basis"},message:"must have required property '"+"time_basis"+"'"};
if(vErrors === null){
vErrors = [err20];
}
else {
vErrors.push(err20);
}
errors++;
}
if(data.path === undefined){
const err21 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "path"},message:"must have required property '"+"path"+"'"};
if(vErrors === null){
vErrors = [err21];
}
else {
vErrors.push(err21);
}
errors++;
}
if(data.termination === undefined){
const err22 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "termination"},message:"must have required property '"+"termination"+"'"};
if(vErrors === null){
vErrors = [err22];
}
else {
vErrors.push(err22);
}
errors++;
}
if(data.next_reach_id === undefined){
const err23 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "next_reach_id"},message:"must have required property '"+"next_reach_id"+"'"};
if(vErrors === null){
vErrors = [err23];
}
else {
vErrors.push(err23);
}
errors++;
}
if(data.total_length_km === undefined){
const err24 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "total_length_km"},message:"must have required property '"+"total_length_km"+"'"};
if(vErrors === null){
vErrors = [err24];
}
else {
vErrors.push(err24);
}
errors++;
}
if(data.pulse_discharge_m3_s === undefined){
const err25 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "pulse_discharge_m3_s"},message:"must have required property '"+"pulse_discharge_m3_s"+"'"};
if(vErrors === null){
vErrors = [err25];
}
else {
vErrors.push(err25);
}
errors++;
}
if(data.volume_per_section_m3 === undefined){
const err26 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "volume_per_section_m3"},message:"must have required property '"+"volume_per_section_m3"+"'"};
if(vErrors === null){
vErrors = [err26];
}
else {
vErrors.push(err26);
}
errors++;
}
if(data.footprint === undefined){
const err27 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "footprint"},message:"must have required property '"+"footprint"+"'"};
if(vErrors === null){
vErrors = [err27];
}
else {
vErrors.push(err27);
}
errors++;
}
if(data.depth_m === undefined){
const err28 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "depth_m"},message:"must have required property '"+"depth_m"+"'"};
if(vErrors === null){
vErrors = [err28];
}
else {
vErrors.push(err28);
}
errors++;
}
if(data.velocity_m_s === undefined){
const err29 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "velocity_m_s"},message:"must have required property '"+"velocity_m_s"+"'"};
if(vErrors === null){
vErrors = [err29];
}
else {
vErrors.push(err29);
}
errors++;
}
if(data.confidence_interval === undefined){
const err30 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "confidence_interval"},message:"must have required property '"+"confidence_interval"+"'"};
if(vErrors === null){
vErrors = [err30];
}
else {
vErrors.push(err30);
}
errors++;
}
if(data.validation === undefined){
const err31 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "validation"},message:"must have required property '"+"validation"+"'"};
if(vErrors === null){
vErrors = [err31];
}
else {
vErrors.push(err31);
}
errors++;
}
if(data.limitations === undefined){
const err32 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "limitations"},message:"must have required property '"+"limitations"+"'"};
if(vErrors === null){
vErrors = [err32];
}
else {
vErrors.push(err32);
}
errors++;
}
for(const key0 in data){
if(!(func2.call(schema11.properties, key0))){
const err33 = {instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err33];
}
else {
vErrors.push(err33);
}
errors++;
}
}
if(data.schema_version !== undefined){
if("1.0.0" !== data.schema_version){
const err34 = {instancePath:instancePath+"/schema_version",schemaPath:"#/properties/schema_version/const",keyword:"const",params:{allowedValue: "1.0.0"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err34];
}
else {
vErrors.push(err34);
}
errors++;
}
}
if(data.kind !== undefined){
if("scenario-result" !== data.kind){
const err35 = {instancePath:instancePath+"/kind",schemaPath:"#/properties/kind/const",keyword:"const",params:{allowedValue: "scenario-result"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err35];
}
else {
vErrors.push(err35);
}
errors++;
}
}
if(data.id !== undefined){
let data2 = data.id;
if(typeof data2 === "string"){
if(func3(data2) < 1){
const err36 = {instancePath:instancePath+"/id",schemaPath:"#/properties/id/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err36];
}
else {
vErrors.push(err36);
}
errors++;
}
}
else {
const err37 = {instancePath:instancePath+"/id",schemaPath:"#/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err37];
}
else {
vErrors.push(err37);
}
errors++;
}
}
if(data.version !== undefined){
if("1.0.0" !== data.version){
const err38 = {instancePath:instancePath+"/version",schemaPath:"#/properties/version/const",keyword:"const",params:{allowedValue: "1.0.0"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err38];
}
else {
vErrors.push(err38);
}
errors++;
}
}
if(data.status !== undefined){
let data4 = data.status;
if(!((data4 === "complete") || (data4 === "partial_coverage"))){
const err39 = {instancePath:instancePath+"/status",schemaPath:"#/properties/status/enum",keyword:"enum",params:{allowedValues: schema11.properties.status.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err39];
}
else {
vErrors.push(err39);
}
errors++;
}
}
if(data.evidence_type !== undefined){
if("modelled" !== data.evidence_type){
const err40 = {instancePath:instancePath+"/evidence_type",schemaPath:"#/properties/evidence_type/const",keyword:"const",params:{allowedValue: "modelled"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err40];
}
else {
vErrors.push(err40);
}
errors++;
}
}
if(data.label !== undefined){
if("HYPOTHETICAL MODELLED SCENARIO — NOT A FORECAST" !== data.label){
const err41 = {instancePath:instancePath+"/label",schemaPath:"#/properties/label/const",keyword:"const",params:{allowedValue: "HYPOTHETICAL MODELLED SCENARIO — NOT A FORECAST"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err41];
}
else {
vErrors.push(err41);
}
errors++;
}
}
if(data.simulation_level !== undefined){
let data7 = data.simulation_level;
if(!((data7 === 1) || (data7 === 2))){
const err42 = {instancePath:instancePath+"/simulation_level",schemaPath:"#/properties/simulation_level/enum",keyword:"enum",params:{allowedValues: schema11.properties.simulation_level.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err42];
}
else {
vErrors.push(err42);
}
errors++;
}
}
if(data.model_class !== undefined){
if("network_approximation" !== data.model_class){
const err43 = {instancePath:instancePath+"/model_class",schemaPath:"#/properties/model_class/const",keyword:"const",params:{allowedValue: "network_approximation"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err43];
}
else {
vErrors.push(err43);
}
errors++;
}
}
if(data.model !== undefined){
let data9 = data.model;
if(data9 && typeof data9 == "object" && !Array.isArray(data9)){
if(data9.id === undefined){
const err44 = {instancePath:instancePath+"/model",schemaPath:"#/properties/model/required",keyword:"required",params:{missingProperty: "id"},message:"must have required property '"+"id"+"'"};
if(vErrors === null){
vErrors = [err44];
}
else {
vErrors.push(err44);
}
errors++;
}
if(data9.version === undefined){
const err45 = {instancePath:instancePath+"/model",schemaPath:"#/properties/model/required",keyword:"required",params:{missingProperty: "version"},message:"must have required property '"+"version"+"'"};
if(vErrors === null){
vErrors = [err45];
}
else {
vErrors.push(err45);
}
errors++;
}
for(const key1 in data9){
if(!((key1 === "id") || (key1 === "version"))){
const err46 = {instancePath:instancePath+"/model",schemaPath:"#/properties/model/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key1},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err46];
}
else {
vErrors.push(err46);
}
errors++;
}
}
if(data9.id !== undefined){
let data10 = data9.id;
if(!((data10 === "network-path") || (data10 === "constant-celerity-pulse"))){
const err47 = {instancePath:instancePath+"/model/id",schemaPath:"#/properties/model/properties/id/enum",keyword:"enum",params:{allowedValues: schema11.properties.model.properties.id.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err47];
}
else {
vErrors.push(err47);
}
errors++;
}
}
if(data9.version !== undefined){
if("1.0.0" !== data9.version){
const err48 = {instancePath:instancePath+"/model/version",schemaPath:"#/properties/model/properties/version/const",keyword:"const",params:{allowedValue: "1.0.0"},message:"must be equal to constant"};
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
const err49 = {instancePath:instancePath+"/model",schemaPath:"#/properties/model/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err49];
}
else {
vErrors.push(err49);
}
errors++;
}
}
if(data.is_fixture !== undefined){
if(typeof data.is_fixture !== "boolean"){
const err50 = {instancePath:instancePath+"/is_fixture",schemaPath:"#/properties/is_fixture/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"};
if(vErrors === null){
vErrors = [err50];
}
else {
vErrors.push(err50);
}
errors++;
}
}
if(data.run_sha256 !== undefined){
let data13 = data.run_sha256;
if(typeof data13 === "string"){
if(!pattern0.test(data13)){
const err51 = {instancePath:instancePath+"/run_sha256",schemaPath:"#/properties/run_sha256/pattern",keyword:"pattern",params:{pattern: "^[a-f0-9]{64}$"},message:"must match pattern \""+"^[a-f0-9]{64}$"+"\""};
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
const err52 = {instancePath:instancePath+"/run_sha256",schemaPath:"#/properties/run_sha256/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err52];
}
else {
vErrors.push(err52);
}
errors++;
}
}
if(data.calculated_at !== undefined){
let data14 = data.calculated_at;
if(typeof data14 === "string"){
if(!(formats0.validate(data14))){
const err53 = {instancePath:instancePath+"/calculated_at",schemaPath:"#/properties/calculated_at/format",keyword:"format",params:{format: "date-time"},message:"must match format \""+"date-time"+"\""};
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
const err54 = {instancePath:instancePath+"/calculated_at",schemaPath:"#/properties/calculated_at/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err54];
}
else {
vErrors.push(err54);
}
errors++;
}
}
if(data.processing_version !== undefined){
if("scenario-runner/1.0.0" !== data.processing_version){
const err55 = {instancePath:instancePath+"/processing_version",schemaPath:"#/properties/processing_version/const",keyword:"const",params:{allowedValue: "scenario-runner/1.0.0"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err55];
}
else {
vErrors.push(err55);
}
errors++;
}
}
if(data.runtime !== undefined){
let data16 = data.runtime;
if(data16 && typeof data16 == "object" && !Array.isArray(data16)){
if(data16.python === undefined){
const err56 = {instancePath:instancePath+"/runtime",schemaPath:"#/properties/runtime/required",keyword:"required",params:{missingProperty: "python"},message:"must have required property '"+"python"+"'"};
if(vErrors === null){
vErrors = [err56];
}
else {
vErrors.push(err56);
}
errors++;
}
for(const key2 in data16){
if(!(key2 === "python")){
const err57 = {instancePath:instancePath+"/runtime",schemaPath:"#/properties/runtime/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key2},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err57];
}
else {
vErrors.push(err57);
}
errors++;
}
}
if(data16.python !== undefined){
let data17 = data16.python;
if(typeof data17 === "string"){
if(func3(data17) < 1){
const err58 = {instancePath:instancePath+"/runtime/python",schemaPath:"#/properties/runtime/properties/python/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err58];
}
else {
vErrors.push(err58);
}
errors++;
}
}
else {
const err59 = {instancePath:instancePath+"/runtime/python",schemaPath:"#/properties/runtime/properties/python/type",keyword:"type",params:{type: "string"},message:"must be string"};
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
const err60 = {instancePath:instancePath+"/runtime",schemaPath:"#/properties/runtime/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err60];
}
else {
vErrors.push(err60);
}
errors++;
}
}
if(data.definition !== undefined){
let data18 = data.definition;
if(data18 && typeof data18 == "object" && !Array.isArray(data18)){
if(data18.schema_version === undefined){
const err61 = {instancePath:instancePath+"/definition",schemaPath:"#/properties/definition/required",keyword:"required",params:{missingProperty: "schema_version"},message:"must have required property '"+"schema_version"+"'"};
if(vErrors === null){
vErrors = [err61];
}
else {
vErrors.push(err61);
}
errors++;
}
if(data18.kind === undefined){
const err62 = {instancePath:instancePath+"/definition",schemaPath:"#/properties/definition/required",keyword:"required",params:{missingProperty: "kind"},message:"must have required property '"+"kind"+"'"};
if(vErrors === null){
vErrors = [err62];
}
else {
vErrors.push(err62);
}
errors++;
}
if(data18.id === undefined){
const err63 = {instancePath:instancePath+"/definition",schemaPath:"#/properties/definition/required",keyword:"required",params:{missingProperty: "id"},message:"must have required property '"+"id"+"'"};
if(vErrors === null){
vErrors = [err63];
}
else {
vErrors.push(err63);
}
errors++;
}
if(data18.version === undefined){
const err64 = {instancePath:instancePath+"/definition",schemaPath:"#/properties/definition/required",keyword:"required",params:{missingProperty: "version"},message:"must have required property '"+"version"+"'"};
if(vErrors === null){
vErrors = [err64];
}
else {
vErrors.push(err64);
}
errors++;
}
if(data18.is_fixture === undefined){
const err65 = {instancePath:instancePath+"/definition",schemaPath:"#/properties/definition/required",keyword:"required",params:{missingProperty: "is_fixture"},message:"must have required property '"+"is_fixture"+"'"};
if(vErrors === null){
vErrors = [err65];
}
else {
vErrors.push(err65);
}
errors++;
}
if(data18.model === undefined){
const err66 = {instancePath:instancePath+"/definition",schemaPath:"#/properties/definition/required",keyword:"required",params:{missingProperty: "model"},message:"must have required property '"+"model"+"'"};
if(vErrors === null){
vErrors = [err66];
}
else {
vErrors.push(err66);
}
errors++;
}
if(data18.simulation_level === undefined){
const err67 = {instancePath:instancePath+"/definition",schemaPath:"#/properties/definition/required",keyword:"required",params:{missingProperty: "simulation_level"},message:"must have required property '"+"simulation_level"+"'"};
if(vErrors === null){
vErrors = [err67];
}
else {
vErrors.push(err67);
}
errors++;
}
if(data18.source_reach_id === undefined){
const err68 = {instancePath:instancePath+"/definition",schemaPath:"#/properties/definition/required",keyword:"required",params:{missingProperty: "source_reach_id"},message:"must have required property '"+"source_reach_id"+"'"};
if(vErrors === null){
vErrors = [err68];
}
else {
vErrors.push(err68);
}
errors++;
}
if(data18.inputs === undefined){
const err69 = {instancePath:instancePath+"/definition",schemaPath:"#/properties/definition/required",keyword:"required",params:{missingProperty: "inputs"},message:"must have required property '"+"inputs"+"'"};
if(vErrors === null){
vErrors = [err69];
}
else {
vErrors.push(err69);
}
errors++;
}
if(data18.assumptions === undefined){
const err70 = {instancePath:instancePath+"/definition",schemaPath:"#/properties/definition/required",keyword:"required",params:{missingProperty: "assumptions"},message:"must have required property '"+"assumptions"+"'"};
if(vErrors === null){
vErrors = [err70];
}
else {
vErrors.push(err70);
}
errors++;
}
if(data18.parameters === undefined){
const err71 = {instancePath:instancePath+"/definition",schemaPath:"#/properties/definition/required",keyword:"required",params:{missingProperty: "parameters"},message:"must have required property '"+"parameters"+"'"};
if(vErrors === null){
vErrors = [err71];
}
else {
vErrors.push(err71);
}
errors++;
}
for(const key3 in data18){
if(!(func2.call(schema11.properties.definition.properties, key3))){
const err72 = {instancePath:instancePath+"/definition",schemaPath:"#/properties/definition/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key3},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err72];
}
else {
vErrors.push(err72);
}
errors++;
}
}
if(data18.schema_version !== undefined){
if("1.0.0" !== data18.schema_version){
const err73 = {instancePath:instancePath+"/definition/schema_version",schemaPath:"#/properties/definition/properties/schema_version/const",keyword:"const",params:{allowedValue: "1.0.0"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err73];
}
else {
vErrors.push(err73);
}
errors++;
}
}
if(data18.kind !== undefined){
if("scenario-definition" !== data18.kind){
const err74 = {instancePath:instancePath+"/definition/kind",schemaPath:"#/properties/definition/properties/kind/const",keyword:"const",params:{allowedValue: "scenario-definition"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err74];
}
else {
vErrors.push(err74);
}
errors++;
}
}
if(data18.id !== undefined){
let data21 = data18.id;
if(typeof data21 === "string"){
if(!pattern1.test(data21)){
const err75 = {instancePath:instancePath+"/definition/id",schemaPath:"#/properties/definition/properties/id/pattern",keyword:"pattern",params:{pattern: "^scenario-[a-z0-9-]+$"},message:"must match pattern \""+"^scenario-[a-z0-9-]+$"+"\""};
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
const err76 = {instancePath:instancePath+"/definition/id",schemaPath:"#/properties/definition/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err76];
}
else {
vErrors.push(err76);
}
errors++;
}
}
if(data18.version !== undefined){
if("1.0.0" !== data18.version){
const err77 = {instancePath:instancePath+"/definition/version",schemaPath:"#/properties/definition/properties/version/const",keyword:"const",params:{allowedValue: "1.0.0"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err77];
}
else {
vErrors.push(err77);
}
errors++;
}
}
if(data18.is_fixture !== undefined){
if(typeof data18.is_fixture !== "boolean"){
const err78 = {instancePath:instancePath+"/definition/is_fixture",schemaPath:"#/properties/definition/properties/is_fixture/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"};
if(vErrors === null){
vErrors = [err78];
}
else {
vErrors.push(err78);
}
errors++;
}
}
if(data18.model !== undefined){
let data24 = data18.model;
if(data24 && typeof data24 == "object" && !Array.isArray(data24)){
if(data24.id === undefined){
const err79 = {instancePath:instancePath+"/definition/model",schemaPath:"#/properties/definition/properties/model/required",keyword:"required",params:{missingProperty: "id"},message:"must have required property '"+"id"+"'"};
if(vErrors === null){
vErrors = [err79];
}
else {
vErrors.push(err79);
}
errors++;
}
if(data24.version === undefined){
const err80 = {instancePath:instancePath+"/definition/model",schemaPath:"#/properties/definition/properties/model/required",keyword:"required",params:{missingProperty: "version"},message:"must have required property '"+"version"+"'"};
if(vErrors === null){
vErrors = [err80];
}
else {
vErrors.push(err80);
}
errors++;
}
for(const key4 in data24){
if(!((key4 === "id") || (key4 === "version"))){
const err81 = {instancePath:instancePath+"/definition/model",schemaPath:"#/properties/definition/properties/model/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key4},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err81];
}
else {
vErrors.push(err81);
}
errors++;
}
}
if(data24.id !== undefined){
let data25 = data24.id;
if(!((data25 === "network-path") || (data25 === "constant-celerity-pulse"))){
const err82 = {instancePath:instancePath+"/definition/model/id",schemaPath:"#/properties/definition/properties/model/properties/id/enum",keyword:"enum",params:{allowedValues: schema11.properties.definition.properties.model.properties.id.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err82];
}
else {
vErrors.push(err82);
}
errors++;
}
}
if(data24.version !== undefined){
if("1.0.0" !== data24.version){
const err83 = {instancePath:instancePath+"/definition/model/version",schemaPath:"#/properties/definition/properties/model/properties/version/const",keyword:"const",params:{allowedValue: "1.0.0"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err83];
}
else {
vErrors.push(err83);
}
errors++;
}
}
}
else {
const err84 = {instancePath:instancePath+"/definition/model",schemaPath:"#/properties/definition/properties/model/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err84];
}
else {
vErrors.push(err84);
}
errors++;
}
}
if(data18.simulation_level !== undefined){
let data27 = data18.simulation_level;
if(!((data27 === 1) || (data27 === 2))){
const err85 = {instancePath:instancePath+"/definition/simulation_level",schemaPath:"#/properties/definition/properties/simulation_level/enum",keyword:"enum",params:{allowedValues: schema11.properties.definition.properties.simulation_level.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err85];
}
else {
vErrors.push(err85);
}
errors++;
}
}
if(data18.source_reach_id !== undefined){
let data28 = data18.source_reach_id;
if(typeof data28 === "string"){
if(!pattern2.test(data28)){
const err86 = {instancePath:instancePath+"/definition/source_reach_id",schemaPath:"#/properties/definition/properties/source_reach_id/pattern",keyword:"pattern",params:{pattern: "^[1-9][0-9]*$"},message:"must match pattern \""+"^[1-9][0-9]*$"+"\""};
if(vErrors === null){
vErrors = [err86];
}
else {
vErrors.push(err86);
}
errors++;
}
}
else {
const err87 = {instancePath:instancePath+"/definition/source_reach_id",schemaPath:"#/properties/definition/properties/source_reach_id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err87];
}
else {
vErrors.push(err87);
}
errors++;
}
}
if(data18.inputs !== undefined){
let data29 = data18.inputs;
if(Array.isArray(data29)){
if(data29.length > 8){
const err88 = {instancePath:instancePath+"/definition/inputs",schemaPath:"#/properties/definition/properties/inputs/maxItems",keyword:"maxItems",params:{limit: 8},message:"must NOT have more than 8 items"};
if(vErrors === null){
vErrors = [err88];
}
else {
vErrors.push(err88);
}
errors++;
}
if(data29.length < 1){
const err89 = {instancePath:instancePath+"/definition/inputs",schemaPath:"#/properties/definition/properties/inputs/minItems",keyword:"minItems",params:{limit: 1},message:"must NOT have fewer than 1 items"};
if(vErrors === null){
vErrors = [err89];
}
else {
vErrors.push(err89);
}
errors++;
}
const len0 = data29.length;
for(let i0=0; i0<len0; i0++){
let data30 = data29[i0];
if(data30 && typeof data30 == "object" && !Array.isArray(data30)){
if(data30.dataset_id === undefined){
const err90 = {instancePath:instancePath+"/definition/inputs/" + i0,schemaPath:"#/properties/definition/properties/inputs/items/required",keyword:"required",params:{missingProperty: "dataset_id"},message:"must have required property '"+"dataset_id"+"'"};
if(vErrors === null){
vErrors = [err90];
}
else {
vErrors.push(err90);
}
errors++;
}
if(data30.dataset_version === undefined){
const err91 = {instancePath:instancePath+"/definition/inputs/" + i0,schemaPath:"#/properties/definition/properties/inputs/items/required",keyword:"required",params:{missingProperty: "dataset_version"},message:"must have required property '"+"dataset_version"+"'"};
if(vErrors === null){
vErrors = [err91];
}
else {
vErrors.push(err91);
}
errors++;
}
if(data30.sha256 === undefined){
const err92 = {instancePath:instancePath+"/definition/inputs/" + i0,schemaPath:"#/properties/definition/properties/inputs/items/required",keyword:"required",params:{missingProperty: "sha256"},message:"must have required property '"+"sha256"+"'"};
if(vErrors === null){
vErrors = [err92];
}
else {
vErrors.push(err92);
}
errors++;
}
if(data30.processing_version === undefined){
const err93 = {instancePath:instancePath+"/definition/inputs/" + i0,schemaPath:"#/properties/definition/properties/inputs/items/required",keyword:"required",params:{missingProperty: "processing_version"},message:"must have required property '"+"processing_version"+"'"};
if(vErrors === null){
vErrors = [err93];
}
else {
vErrors.push(err93);
}
errors++;
}
if(data30.source === undefined){
const err94 = {instancePath:instancePath+"/definition/inputs/" + i0,schemaPath:"#/properties/definition/properties/inputs/items/required",keyword:"required",params:{missingProperty: "source"},message:"must have required property '"+"source"+"'"};
if(vErrors === null){
vErrors = [err94];
}
else {
vErrors.push(err94);
}
errors++;
}
if(data30.license === undefined){
const err95 = {instancePath:instancePath+"/definition/inputs/" + i0,schemaPath:"#/properties/definition/properties/inputs/items/required",keyword:"required",params:{missingProperty: "license"},message:"must have required property '"+"license"+"'"};
if(vErrors === null){
vErrors = [err95];
}
else {
vErrors.push(err95);
}
errors++;
}
if(data30.observation_date === undefined){
const err96 = {instancePath:instancePath+"/definition/inputs/" + i0,schemaPath:"#/properties/definition/properties/inputs/items/required",keyword:"required",params:{missingProperty: "observation_date"},message:"must have required property '"+"observation_date"+"'"};
if(vErrors === null){
vErrors = [err96];
}
else {
vErrors.push(err96);
}
errors++;
}
for(const key5 in data30){
if(!(((((((key5 === "dataset_id") || (key5 === "dataset_version")) || (key5 === "sha256")) || (key5 === "processing_version")) || (key5 === "source")) || (key5 === "license")) || (key5 === "observation_date"))){
const err97 = {instancePath:instancePath+"/definition/inputs/" + i0,schemaPath:"#/properties/definition/properties/inputs/items/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key5},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err97];
}
else {
vErrors.push(err97);
}
errors++;
}
}
if(data30.dataset_id !== undefined){
let data31 = data30.dataset_id;
if(typeof data31 === "string"){
if(func3(data31) < 1){
const err98 = {instancePath:instancePath+"/definition/inputs/" + i0+"/dataset_id",schemaPath:"#/properties/definition/properties/inputs/items/properties/dataset_id/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
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
const err99 = {instancePath:instancePath+"/definition/inputs/" + i0+"/dataset_id",schemaPath:"#/properties/definition/properties/inputs/items/properties/dataset_id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err99];
}
else {
vErrors.push(err99);
}
errors++;
}
}
if(data30.dataset_version !== undefined){
let data32 = data30.dataset_version;
if(typeof data32 === "string"){
if(func3(data32) < 1){
const err100 = {instancePath:instancePath+"/definition/inputs/" + i0+"/dataset_version",schemaPath:"#/properties/definition/properties/inputs/items/properties/dataset_version/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
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
const err101 = {instancePath:instancePath+"/definition/inputs/" + i0+"/dataset_version",schemaPath:"#/properties/definition/properties/inputs/items/properties/dataset_version/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err101];
}
else {
vErrors.push(err101);
}
errors++;
}
}
if(data30.sha256 !== undefined){
let data33 = data30.sha256;
if(typeof data33 === "string"){
if(!pattern0.test(data33)){
const err102 = {instancePath:instancePath+"/definition/inputs/" + i0+"/sha256",schemaPath:"#/properties/definition/properties/inputs/items/properties/sha256/pattern",keyword:"pattern",params:{pattern: "^[a-f0-9]{64}$"},message:"must match pattern \""+"^[a-f0-9]{64}$"+"\""};
if(vErrors === null){
vErrors = [err102];
}
else {
vErrors.push(err102);
}
errors++;
}
}
else {
const err103 = {instancePath:instancePath+"/definition/inputs/" + i0+"/sha256",schemaPath:"#/properties/definition/properties/inputs/items/properties/sha256/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err103];
}
else {
vErrors.push(err103);
}
errors++;
}
}
if(data30.processing_version !== undefined){
let data34 = data30.processing_version;
if(typeof data34 === "string"){
if(func3(data34) < 1){
const err104 = {instancePath:instancePath+"/definition/inputs/" + i0+"/processing_version",schemaPath:"#/properties/definition/properties/inputs/items/properties/processing_version/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
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
const err105 = {instancePath:instancePath+"/definition/inputs/" + i0+"/processing_version",schemaPath:"#/properties/definition/properties/inputs/items/properties/processing_version/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err105];
}
else {
vErrors.push(err105);
}
errors++;
}
}
if(data30.source !== undefined){
let data35 = data30.source;
if(typeof data35 === "string"){
if(func3(data35) < 1){
const err106 = {instancePath:instancePath+"/definition/inputs/" + i0+"/source",schemaPath:"#/properties/definition/properties/inputs/items/properties/source/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err106];
}
else {
vErrors.push(err106);
}
errors++;
}
}
else {
const err107 = {instancePath:instancePath+"/definition/inputs/" + i0+"/source",schemaPath:"#/properties/definition/properties/inputs/items/properties/source/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err107];
}
else {
vErrors.push(err107);
}
errors++;
}
}
if(data30.license !== undefined){
let data36 = data30.license;
if(typeof data36 === "string"){
if(func3(data36) < 1){
const err108 = {instancePath:instancePath+"/definition/inputs/" + i0+"/license",schemaPath:"#/properties/definition/properties/inputs/items/properties/license/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
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
const err109 = {instancePath:instancePath+"/definition/inputs/" + i0+"/license",schemaPath:"#/properties/definition/properties/inputs/items/properties/license/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err109];
}
else {
vErrors.push(err109);
}
errors++;
}
}
if(data30.observation_date !== undefined){
let data37 = data30.observation_date;
if((typeof data37 !== "string") && (data37 !== null)){
const err110 = {instancePath:instancePath+"/definition/inputs/" + i0+"/observation_date",schemaPath:"#/properties/definition/properties/inputs/items/properties/observation_date/type",keyword:"type",params:{type: schema11.properties.definition.properties.inputs.items.properties.observation_date.type},message:"must be string,null"};
if(vErrors === null){
vErrors = [err110];
}
else {
vErrors.push(err110);
}
errors++;
}
if(typeof data37 === "string"){
if(!(formats0.validate(data37))){
const err111 = {instancePath:instancePath+"/definition/inputs/" + i0+"/observation_date",schemaPath:"#/properties/definition/properties/inputs/items/properties/observation_date/format",keyword:"format",params:{format: "date-time"},message:"must match format \""+"date-time"+"\""};
if(vErrors === null){
vErrors = [err111];
}
else {
vErrors.push(err111);
}
errors++;
}
}
}
}
else {
const err112 = {instancePath:instancePath+"/definition/inputs/" + i0,schemaPath:"#/properties/definition/properties/inputs/items/type",keyword:"type",params:{type: "object"},message:"must be object"};
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
const err113 = {instancePath:instancePath+"/definition/inputs",schemaPath:"#/properties/definition/properties/inputs/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err113];
}
else {
vErrors.push(err113);
}
errors++;
}
}
if(data18.assumptions !== undefined){
let data38 = data18.assumptions;
if(Array.isArray(data38)){
const len1 = data38.length;
for(let i1=0; i1<len1; i1++){
let data39 = data38[i1];
if(typeof data39 === "string"){
if(func3(data39) < 1){
const err114 = {instancePath:instancePath+"/definition/assumptions/" + i1,schemaPath:"#/properties/definition/properties/assumptions/items/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
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
const err115 = {instancePath:instancePath+"/definition/assumptions/" + i1,schemaPath:"#/properties/definition/properties/assumptions/items/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err115];
}
else {
vErrors.push(err115);
}
errors++;
}
}
let i2 = data38.length;
let j0;
if(i2 > 1){
const indices0 = {};
for(;i2--;){
let item0 = data38[i2];
if(typeof item0 !== "string"){
continue;
}
if(typeof indices0[item0] == "number"){
j0 = indices0[item0];
const err116 = {instancePath:instancePath+"/definition/assumptions",schemaPath:"#/properties/definition/properties/assumptions/uniqueItems",keyword:"uniqueItems",params:{i: i2, j: j0},message:"must NOT have duplicate items (items ## "+j0+" and "+i2+" are identical)"};
if(vErrors === null){
vErrors = [err116];
}
else {
vErrors.push(err116);
}
errors++;
break;
}
indices0[item0] = i2;
}
}
}
else {
const err117 = {instancePath:instancePath+"/definition/assumptions",schemaPath:"#/properties/definition/properties/assumptions/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err117];
}
else {
vErrors.push(err117);
}
errors++;
}
}
if(data18.parameters !== undefined){
let data40 = data18.parameters;
const _errs71 = errors;
let valid11 = false;
let passing0 = null;
const _errs72 = errors;
if(data40 && typeof data40 == "object" && !Array.isArray(data40)){
for(const key6 in data40){
const err118 = {instancePath:instancePath+"/definition/parameters",schemaPath:"#/properties/definition/properties/parameters/oneOf/0/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key6},message:"must NOT have additional properties"};
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
const err119 = {instancePath:instancePath+"/definition/parameters",schemaPath:"#/properties/definition/properties/parameters/oneOf/0/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err119];
}
else {
vErrors.push(err119);
}
errors++;
}
var _valid0 = _errs72 === errors;
if(_valid0){
valid11 = true;
passing0 = 0;
}
const _errs75 = errors;
if(data40 && typeof data40 == "object" && !Array.isArray(data40)){
if(data40.celerity === undefined){
const err120 = {instancePath:instancePath+"/definition/parameters",schemaPath:"#/properties/definition/properties/parameters/oneOf/1/required",keyword:"required",params:{missingProperty: "celerity"},message:"must have required property '"+"celerity"+"'"};
if(vErrors === null){
vErrors = [err120];
}
else {
vErrors.push(err120);
}
errors++;
}
if(data40.release_volume === undefined){
const err121 = {instancePath:instancePath+"/definition/parameters",schemaPath:"#/properties/definition/properties/parameters/oneOf/1/required",keyword:"required",params:{missingProperty: "release_volume"},message:"must have required property '"+"release_volume"+"'"};
if(vErrors === null){
vErrors = [err121];
}
else {
vErrors.push(err121);
}
errors++;
}
if(data40.release_duration === undefined){
const err122 = {instancePath:instancePath+"/definition/parameters",schemaPath:"#/properties/definition/properties/parameters/oneOf/1/required",keyword:"required",params:{missingProperty: "release_duration"},message:"must have required property '"+"release_duration"+"'"};
if(vErrors === null){
vErrors = [err122];
}
else {
vErrors.push(err122);
}
errors++;
}
for(const key7 in data40){
if(!(((key7 === "celerity") || (key7 === "release_volume")) || (key7 === "release_duration"))){
const err123 = {instancePath:instancePath+"/definition/parameters",schemaPath:"#/properties/definition/properties/parameters/oneOf/1/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key7},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err123];
}
else {
vErrors.push(err123);
}
errors++;
}
}
if(data40.celerity !== undefined){
let data41 = data40.celerity;
if(data41 && typeof data41 == "object" && !Array.isArray(data41)){
if(data41.value === undefined){
const err124 = {instancePath:instancePath+"/definition/parameters/celerity",schemaPath:"#/properties/definition/properties/parameters/oneOf/1/properties/celerity/required",keyword:"required",params:{missingProperty: "value"},message:"must have required property '"+"value"+"'"};
if(vErrors === null){
vErrors = [err124];
}
else {
vErrors.push(err124);
}
errors++;
}
if(data41.unit === undefined){
const err125 = {instancePath:instancePath+"/definition/parameters/celerity",schemaPath:"#/properties/definition/properties/parameters/oneOf/1/properties/celerity/required",keyword:"required",params:{missingProperty: "unit"},message:"must have required property '"+"unit"+"'"};
if(vErrors === null){
vErrors = [err125];
}
else {
vErrors.push(err125);
}
errors++;
}
for(const key8 in data41){
if(!((key8 === "value") || (key8 === "unit"))){
const err126 = {instancePath:instancePath+"/definition/parameters/celerity",schemaPath:"#/properties/definition/properties/parameters/oneOf/1/properties/celerity/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key8},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err126];
}
else {
vErrors.push(err126);
}
errors++;
}
}
if(data41.value !== undefined){
let data42 = data41.value;
if((typeof data42 == "number") && (isFinite(data42))){
if(data42 > 10 || isNaN(data42)){
const err127 = {instancePath:instancePath+"/definition/parameters/celerity/value",schemaPath:"#/properties/definition/properties/parameters/oneOf/1/properties/celerity/properties/value/maximum",keyword:"maximum",params:{comparison: "<=", limit: 10},message:"must be <= 10"};
if(vErrors === null){
vErrors = [err127];
}
else {
vErrors.push(err127);
}
errors++;
}
if(data42 < 0.1 || isNaN(data42)){
const err128 = {instancePath:instancePath+"/definition/parameters/celerity/value",schemaPath:"#/properties/definition/properties/parameters/oneOf/1/properties/celerity/properties/value/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0.1},message:"must be >= 0.1"};
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
const err129 = {instancePath:instancePath+"/definition/parameters/celerity/value",schemaPath:"#/properties/definition/properties/parameters/oneOf/1/properties/celerity/properties/value/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err129];
}
else {
vErrors.push(err129);
}
errors++;
}
}
if(data41.unit !== undefined){
if("m/s" !== data41.unit){
const err130 = {instancePath:instancePath+"/definition/parameters/celerity/unit",schemaPath:"#/properties/definition/properties/parameters/oneOf/1/properties/celerity/properties/unit/const",keyword:"const",params:{allowedValue: "m/s"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err130];
}
else {
vErrors.push(err130);
}
errors++;
}
}
}
else {
const err131 = {instancePath:instancePath+"/definition/parameters/celerity",schemaPath:"#/properties/definition/properties/parameters/oneOf/1/properties/celerity/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err131];
}
else {
vErrors.push(err131);
}
errors++;
}
}
if(data40.release_volume !== undefined){
let data44 = data40.release_volume;
if(data44 && typeof data44 == "object" && !Array.isArray(data44)){
if(data44.value === undefined){
const err132 = {instancePath:instancePath+"/definition/parameters/release_volume",schemaPath:"#/properties/definition/properties/parameters/oneOf/1/properties/release_volume/required",keyword:"required",params:{missingProperty: "value"},message:"must have required property '"+"value"+"'"};
if(vErrors === null){
vErrors = [err132];
}
else {
vErrors.push(err132);
}
errors++;
}
if(data44.unit === undefined){
const err133 = {instancePath:instancePath+"/definition/parameters/release_volume",schemaPath:"#/properties/definition/properties/parameters/oneOf/1/properties/release_volume/required",keyword:"required",params:{missingProperty: "unit"},message:"must have required property '"+"unit"+"'"};
if(vErrors === null){
vErrors = [err133];
}
else {
vErrors.push(err133);
}
errors++;
}
for(const key9 in data44){
if(!((key9 === "value") || (key9 === "unit"))){
const err134 = {instancePath:instancePath+"/definition/parameters/release_volume",schemaPath:"#/properties/definition/properties/parameters/oneOf/1/properties/release_volume/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key9},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err134];
}
else {
vErrors.push(err134);
}
errors++;
}
}
if(data44.value !== undefined){
let data45 = data44.value;
if((typeof data45 == "number") && (isFinite(data45))){
if(data45 > 10000000 || isNaN(data45)){
const err135 = {instancePath:instancePath+"/definition/parameters/release_volume/value",schemaPath:"#/properties/definition/properties/parameters/oneOf/1/properties/release_volume/properties/value/maximum",keyword:"maximum",params:{comparison: "<=", limit: 10000000},message:"must be <= 10000000"};
if(vErrors === null){
vErrors = [err135];
}
else {
vErrors.push(err135);
}
errors++;
}
if(data45 < 0 || isNaN(data45)){
const err136 = {instancePath:instancePath+"/definition/parameters/release_volume/value",schemaPath:"#/properties/definition/properties/parameters/oneOf/1/properties/release_volume/properties/value/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
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
const err137 = {instancePath:instancePath+"/definition/parameters/release_volume/value",schemaPath:"#/properties/definition/properties/parameters/oneOf/1/properties/release_volume/properties/value/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err137];
}
else {
vErrors.push(err137);
}
errors++;
}
}
if(data44.unit !== undefined){
if("m3" !== data44.unit){
const err138 = {instancePath:instancePath+"/definition/parameters/release_volume/unit",schemaPath:"#/properties/definition/properties/parameters/oneOf/1/properties/release_volume/properties/unit/const",keyword:"const",params:{allowedValue: "m3"},message:"must be equal to constant"};
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
else {
const err139 = {instancePath:instancePath+"/definition/parameters/release_volume",schemaPath:"#/properties/definition/properties/parameters/oneOf/1/properties/release_volume/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err139];
}
else {
vErrors.push(err139);
}
errors++;
}
}
if(data40.release_duration !== undefined){
let data47 = data40.release_duration;
if(data47 && typeof data47 == "object" && !Array.isArray(data47)){
if(data47.value === undefined){
const err140 = {instancePath:instancePath+"/definition/parameters/release_duration",schemaPath:"#/properties/definition/properties/parameters/oneOf/1/properties/release_duration/required",keyword:"required",params:{missingProperty: "value"},message:"must have required property '"+"value"+"'"};
if(vErrors === null){
vErrors = [err140];
}
else {
vErrors.push(err140);
}
errors++;
}
if(data47.unit === undefined){
const err141 = {instancePath:instancePath+"/definition/parameters/release_duration",schemaPath:"#/properties/definition/properties/parameters/oneOf/1/properties/release_duration/required",keyword:"required",params:{missingProperty: "unit"},message:"must have required property '"+"unit"+"'"};
if(vErrors === null){
vErrors = [err141];
}
else {
vErrors.push(err141);
}
errors++;
}
for(const key10 in data47){
if(!((key10 === "value") || (key10 === "unit"))){
const err142 = {instancePath:instancePath+"/definition/parameters/release_duration",schemaPath:"#/properties/definition/properties/parameters/oneOf/1/properties/release_duration/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key10},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err142];
}
else {
vErrors.push(err142);
}
errors++;
}
}
if(data47.value !== undefined){
let data48 = data47.value;
if((typeof data48 == "number") && (isFinite(data48))){
if(data48 > 86400 || isNaN(data48)){
const err143 = {instancePath:instancePath+"/definition/parameters/release_duration/value",schemaPath:"#/properties/definition/properties/parameters/oneOf/1/properties/release_duration/properties/value/maximum",keyword:"maximum",params:{comparison: "<=", limit: 86400},message:"must be <= 86400"};
if(vErrors === null){
vErrors = [err143];
}
else {
vErrors.push(err143);
}
errors++;
}
if(data48 < 60 || isNaN(data48)){
const err144 = {instancePath:instancePath+"/definition/parameters/release_duration/value",schemaPath:"#/properties/definition/properties/parameters/oneOf/1/properties/release_duration/properties/value/minimum",keyword:"minimum",params:{comparison: ">=", limit: 60},message:"must be >= 60"};
if(vErrors === null){
vErrors = [err144];
}
else {
vErrors.push(err144);
}
errors++;
}
}
else {
const err145 = {instancePath:instancePath+"/definition/parameters/release_duration/value",schemaPath:"#/properties/definition/properties/parameters/oneOf/1/properties/release_duration/properties/value/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err145];
}
else {
vErrors.push(err145);
}
errors++;
}
}
if(data47.unit !== undefined){
if("s" !== data47.unit){
const err146 = {instancePath:instancePath+"/definition/parameters/release_duration/unit",schemaPath:"#/properties/definition/properties/parameters/oneOf/1/properties/release_duration/properties/unit/const",keyword:"const",params:{allowedValue: "s"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err146];
}
else {
vErrors.push(err146);
}
errors++;
}
}
}
else {
const err147 = {instancePath:instancePath+"/definition/parameters/release_duration",schemaPath:"#/properties/definition/properties/parameters/oneOf/1/properties/release_duration/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err147];
}
else {
vErrors.push(err147);
}
errors++;
}
}
}
else {
const err148 = {instancePath:instancePath+"/definition/parameters",schemaPath:"#/properties/definition/properties/parameters/oneOf/1/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err148];
}
else {
vErrors.push(err148);
}
errors++;
}
var _valid0 = _errs75 === errors;
if(_valid0 && valid11){
valid11 = false;
passing0 = [passing0, 1];
}
else {
if(_valid0){
valid11 = true;
passing0 = 1;
}
}
if(!valid11){
const err149 = {instancePath:instancePath+"/definition/parameters",schemaPath:"#/properties/definition/properties/parameters/oneOf",keyword:"oneOf",params:{passingSchemas: passing0},message:"must match exactly one schema in oneOf"};
if(vErrors === null){
vErrors = [err149];
}
else {
vErrors.push(err149);
}
errors++;
}
else {
errors = _errs71;
if(vErrors !== null){
if(_errs71){
vErrors.length = _errs71;
}
else {
vErrors = null;
}
}
}
}
}
else {
const err150 = {instancePath:instancePath+"/definition",schemaPath:"#/properties/definition/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err150];
}
else {
vErrors.push(err150);
}
errors++;
}
}
if(data.assumptions !== undefined){
let data50 = data.assumptions;
if(Array.isArray(data50)){
const len2 = data50.length;
for(let i3=0; i3<len2; i3++){
let data51 = data50[i3];
if(data51 && typeof data51 == "object" && !Array.isArray(data51)){
if(data51.id === undefined){
const err151 = {instancePath:instancePath+"/assumptions/" + i3,schemaPath:"#/properties/assumptions/items/required",keyword:"required",params:{missingProperty: "id"},message:"must have required property '"+"id"+"'"};
if(vErrors === null){
vErrors = [err151];
}
else {
vErrors.push(err151);
}
errors++;
}
if(data51.version === undefined){
const err152 = {instancePath:instancePath+"/assumptions/" + i3,schemaPath:"#/properties/assumptions/items/required",keyword:"required",params:{missingProperty: "version"},message:"must have required property '"+"version"+"'"};
if(vErrors === null){
vErrors = [err152];
}
else {
vErrors.push(err152);
}
errors++;
}
if(data51.statement === undefined){
const err153 = {instancePath:instancePath+"/assumptions/" + i3,schemaPath:"#/properties/assumptions/items/required",keyword:"required",params:{missingProperty: "statement"},message:"must have required property '"+"statement"+"'"};
if(vErrors === null){
vErrors = [err153];
}
else {
vErrors.push(err153);
}
errors++;
}
for(const key11 in data51){
if(!(((key11 === "id") || (key11 === "version")) || (key11 === "statement"))){
const err154 = {instancePath:instancePath+"/assumptions/" + i3,schemaPath:"#/properties/assumptions/items/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key11},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err154];
}
else {
vErrors.push(err154);
}
errors++;
}
}
if(data51.id !== undefined){
let data52 = data51.id;
if(typeof data52 === "string"){
if(func3(data52) < 1){
const err155 = {instancePath:instancePath+"/assumptions/" + i3+"/id",schemaPath:"#/properties/assumptions/items/properties/id/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
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
const err156 = {instancePath:instancePath+"/assumptions/" + i3+"/id",schemaPath:"#/properties/assumptions/items/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err156];
}
else {
vErrors.push(err156);
}
errors++;
}
}
if(data51.version !== undefined){
if("1.0.0" !== data51.version){
const err157 = {instancePath:instancePath+"/assumptions/" + i3+"/version",schemaPath:"#/properties/assumptions/items/properties/version/const",keyword:"const",params:{allowedValue: "1.0.0"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err157];
}
else {
vErrors.push(err157);
}
errors++;
}
}
if(data51.statement !== undefined){
let data54 = data51.statement;
if(typeof data54 === "string"){
if(func3(data54) < 1){
const err158 = {instancePath:instancePath+"/assumptions/" + i3+"/statement",schemaPath:"#/properties/assumptions/items/properties/statement/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err158];
}
else {
vErrors.push(err158);
}
errors++;
}
}
else {
const err159 = {instancePath:instancePath+"/assumptions/" + i3+"/statement",schemaPath:"#/properties/assumptions/items/properties/statement/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err159];
}
else {
vErrors.push(err159);
}
errors++;
}
}
}
else {
const err160 = {instancePath:instancePath+"/assumptions/" + i3,schemaPath:"#/properties/assumptions/items/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err160];
}
else {
vErrors.push(err160);
}
errors++;
}
}
}
else {
const err161 = {instancePath:instancePath+"/assumptions",schemaPath:"#/properties/assumptions/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err161];
}
else {
vErrors.push(err161);
}
errors++;
}
}
if(data.crs !== undefined){
if("OGC:CRS84" !== data.crs){
const err162 = {instancePath:instancePath+"/crs",schemaPath:"#/properties/crs/const",keyword:"const",params:{allowedValue: "OGC:CRS84"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err162];
}
else {
vErrors.push(err162);
}
errors++;
}
}
if(data.vertical_datum !== undefined){
if(data.vertical_datum !== null){
const err163 = {instancePath:instancePath+"/vertical_datum",schemaPath:"#/properties/vertical_datum/type",keyword:"type",params:{type: "null"},message:"must be null"};
if(vErrors === null){
vErrors = [err163];
}
else {
vErrors.push(err163);
}
errors++;
}
}
if(data.spatial_resolution !== undefined){
if("source river reaches; no terrain resampling" !== data.spatial_resolution){
const err164 = {instancePath:instancePath+"/spatial_resolution",schemaPath:"#/properties/spatial_resolution/const",keyword:"const",params:{allowedValue: "source river reaches; no terrain resampling"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err164];
}
else {
vErrors.push(err164);
}
errors++;
}
}
if(data.time_basis !== undefined){
if("seconds relative to hypothetical release; not calendar arrival times" !== data.time_basis){
const err165 = {instancePath:instancePath+"/time_basis",schemaPath:"#/properties/time_basis/const",keyword:"const",params:{allowedValue: "seconds relative to hypothetical release; not calendar arrival times"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err165];
}
else {
vErrors.push(err165);
}
errors++;
}
}
if(data.path !== undefined){
let data59 = data.path;
if(Array.isArray(data59)){
if(data59.length > 5000){
const err166 = {instancePath:instancePath+"/path",schemaPath:"#/properties/path/maxItems",keyword:"maxItems",params:{limit: 5000},message:"must NOT have more than 5000 items"};
if(vErrors === null){
vErrors = [err166];
}
else {
vErrors.push(err166);
}
errors++;
}
if(data59.length < 1){
const err167 = {instancePath:instancePath+"/path",schemaPath:"#/properties/path/minItems",keyword:"minItems",params:{limit: 1},message:"must NOT have fewer than 1 items"};
if(vErrors === null){
vErrors = [err167];
}
else {
vErrors.push(err167);
}
errors++;
}
const len3 = data59.length;
for(let i4=0; i4<len3; i4++){
let data60 = data59[i4];
if(data60 && typeof data60 == "object" && !Array.isArray(data60)){
if(data60.reach_id === undefined){
const err168 = {instancePath:instancePath+"/path/" + i4,schemaPath:"#/properties/path/items/required",keyword:"required",params:{missingProperty: "reach_id"},message:"must have required property '"+"reach_id"+"'"};
if(vErrors === null){
vErrors = [err168];
}
else {
vErrors.push(err168);
}
errors++;
}
if(data60.length_km === undefined){
const err169 = {instancePath:instancePath+"/path/" + i4,schemaPath:"#/properties/path/items/required",keyword:"required",params:{missingProperty: "length_km"},message:"must have required property '"+"length_km"+"'"};
if(vErrors === null){
vErrors = [err169];
}
else {
vErrors.push(err169);
}
errors++;
}
if(data60.cumulative_length_km === undefined){
const err170 = {instancePath:instancePath+"/path/" + i4,schemaPath:"#/properties/path/items/required",keyword:"required",params:{missingProperty: "cumulative_length_km"},message:"must have required property '"+"cumulative_length_km"+"'"};
if(vErrors === null){
vErrors = [err170];
}
else {
vErrors.push(err170);
}
errors++;
}
if(data60.entry_delay_s === undefined){
const err171 = {instancePath:instancePath+"/path/" + i4,schemaPath:"#/properties/path/items/required",keyword:"required",params:{missingProperty: "entry_delay_s"},message:"must have required property '"+"entry_delay_s"+"'"};
if(vErrors === null){
vErrors = [err171];
}
else {
vErrors.push(err171);
}
errors++;
}
if(data60.exit_delay_s === undefined){
const err172 = {instancePath:instancePath+"/path/" + i4,schemaPath:"#/properties/path/items/required",keyword:"required",params:{missingProperty: "exit_delay_s"},message:"must have required property '"+"exit_delay_s"+"'"};
if(vErrors === null){
vErrors = [err172];
}
else {
vErrors.push(err172);
}
errors++;
}
if(data60.pulse_end_at_exit_s === undefined){
const err173 = {instancePath:instancePath+"/path/" + i4,schemaPath:"#/properties/path/items/required",keyword:"required",params:{missingProperty: "pulse_end_at_exit_s"},message:"must have required property '"+"pulse_end_at_exit_s"+"'"};
if(vErrors === null){
vErrors = [err173];
}
else {
vErrors.push(err173);
}
errors++;
}
for(const key12 in data60){
if(!((((((key12 === "reach_id") || (key12 === "length_km")) || (key12 === "cumulative_length_km")) || (key12 === "entry_delay_s")) || (key12 === "exit_delay_s")) || (key12 === "pulse_end_at_exit_s"))){
const err174 = {instancePath:instancePath+"/path/" + i4,schemaPath:"#/properties/path/items/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key12},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err174];
}
else {
vErrors.push(err174);
}
errors++;
}
}
if(data60.reach_id !== undefined){
let data61 = data60.reach_id;
if(typeof data61 === "string"){
if(func3(data61) < 1){
const err175 = {instancePath:instancePath+"/path/" + i4+"/reach_id",schemaPath:"#/properties/path/items/properties/reach_id/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err175];
}
else {
vErrors.push(err175);
}
errors++;
}
}
else {
const err176 = {instancePath:instancePath+"/path/" + i4+"/reach_id",schemaPath:"#/properties/path/items/properties/reach_id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err176];
}
else {
vErrors.push(err176);
}
errors++;
}
}
if(data60.length_km !== undefined){
let data62 = data60.length_km;
if((typeof data62 == "number") && (isFinite(data62))){
if(data62 < 0 || isNaN(data62)){
const err177 = {instancePath:instancePath+"/path/" + i4+"/length_km",schemaPath:"#/properties/path/items/properties/length_km/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
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
const err178 = {instancePath:instancePath+"/path/" + i4+"/length_km",schemaPath:"#/properties/path/items/properties/length_km/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err178];
}
else {
vErrors.push(err178);
}
errors++;
}
}
if(data60.cumulative_length_km !== undefined){
let data63 = data60.cumulative_length_km;
if((typeof data63 == "number") && (isFinite(data63))){
if(data63 < 0 || isNaN(data63)){
const err179 = {instancePath:instancePath+"/path/" + i4+"/cumulative_length_km",schemaPath:"#/properties/path/items/properties/cumulative_length_km/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
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
const err180 = {instancePath:instancePath+"/path/" + i4+"/cumulative_length_km",schemaPath:"#/properties/path/items/properties/cumulative_length_km/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err180];
}
else {
vErrors.push(err180);
}
errors++;
}
}
if(data60.entry_delay_s !== undefined){
let data64 = data60.entry_delay_s;
if((!((typeof data64 == "number") && (isFinite(data64)))) && (data64 !== null)){
const err181 = {instancePath:instancePath+"/path/" + i4+"/entry_delay_s",schemaPath:"#/properties/path/items/properties/entry_delay_s/type",keyword:"type",params:{type: schema11.properties.path.items.properties.entry_delay_s.type},message:"must be number,null"};
if(vErrors === null){
vErrors = [err181];
}
else {
vErrors.push(err181);
}
errors++;
}
if((typeof data64 == "number") && (isFinite(data64))){
if(data64 < 0 || isNaN(data64)){
const err182 = {instancePath:instancePath+"/path/" + i4+"/entry_delay_s",schemaPath:"#/properties/path/items/properties/entry_delay_s/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
if(vErrors === null){
vErrors = [err182];
}
else {
vErrors.push(err182);
}
errors++;
}
}
}
if(data60.exit_delay_s !== undefined){
let data65 = data60.exit_delay_s;
if((!((typeof data65 == "number") && (isFinite(data65)))) && (data65 !== null)){
const err183 = {instancePath:instancePath+"/path/" + i4+"/exit_delay_s",schemaPath:"#/properties/path/items/properties/exit_delay_s/type",keyword:"type",params:{type: schema11.properties.path.items.properties.exit_delay_s.type},message:"must be number,null"};
if(vErrors === null){
vErrors = [err183];
}
else {
vErrors.push(err183);
}
errors++;
}
if((typeof data65 == "number") && (isFinite(data65))){
if(data65 < 0 || isNaN(data65)){
const err184 = {instancePath:instancePath+"/path/" + i4+"/exit_delay_s",schemaPath:"#/properties/path/items/properties/exit_delay_s/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
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
if(data60.pulse_end_at_exit_s !== undefined){
let data66 = data60.pulse_end_at_exit_s;
if((!((typeof data66 == "number") && (isFinite(data66)))) && (data66 !== null)){
const err185 = {instancePath:instancePath+"/path/" + i4+"/pulse_end_at_exit_s",schemaPath:"#/properties/path/items/properties/pulse_end_at_exit_s/type",keyword:"type",params:{type: schema11.properties.path.items.properties.pulse_end_at_exit_s.type},message:"must be number,null"};
if(vErrors === null){
vErrors = [err185];
}
else {
vErrors.push(err185);
}
errors++;
}
if((typeof data66 == "number") && (isFinite(data66))){
if(data66 < 0 || isNaN(data66)){
const err186 = {instancePath:instancePath+"/path/" + i4+"/pulse_end_at_exit_s",schemaPath:"#/properties/path/items/properties/pulse_end_at_exit_s/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
if(vErrors === null){
vErrors = [err186];
}
else {
vErrors.push(err186);
}
errors++;
}
}
}
}
else {
const err187 = {instancePath:instancePath+"/path/" + i4,schemaPath:"#/properties/path/items/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err187];
}
else {
vErrors.push(err187);
}
errors++;
}
}
}
else {
const err188 = {instancePath:instancePath+"/path",schemaPath:"#/properties/path/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err188];
}
else {
vErrors.push(err188);
}
errors++;
}
}
if(data.termination !== undefined){
let data67 = data.termination;
if(!((data67 === "source_outlet") || (data67 === "coverage_boundary"))){
const err189 = {instancePath:instancePath+"/termination",schemaPath:"#/properties/termination/enum",keyword:"enum",params:{allowedValues: schema11.properties.termination.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err189];
}
else {
vErrors.push(err189);
}
errors++;
}
}
if(data.next_reach_id !== undefined){
let data68 = data.next_reach_id;
if((typeof data68 !== "string") && (data68 !== null)){
const err190 = {instancePath:instancePath+"/next_reach_id",schemaPath:"#/properties/next_reach_id/type",keyword:"type",params:{type: schema11.properties.next_reach_id.type},message:"must be string,null"};
if(vErrors === null){
vErrors = [err190];
}
else {
vErrors.push(err190);
}
errors++;
}
}
if(data.total_length_km !== undefined){
let data69 = data.total_length_km;
if((typeof data69 == "number") && (isFinite(data69))){
if(data69 < 0 || isNaN(data69)){
const err191 = {instancePath:instancePath+"/total_length_km",schemaPath:"#/properties/total_length_km/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
if(vErrors === null){
vErrors = [err191];
}
else {
vErrors.push(err191);
}
errors++;
}
}
else {
const err192 = {instancePath:instancePath+"/total_length_km",schemaPath:"#/properties/total_length_km/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err192];
}
else {
vErrors.push(err192);
}
errors++;
}
}
if(data.pulse_discharge_m3_s !== undefined){
let data70 = data.pulse_discharge_m3_s;
if((!((typeof data70 == "number") && (isFinite(data70)))) && (data70 !== null)){
const err193 = {instancePath:instancePath+"/pulse_discharge_m3_s",schemaPath:"#/properties/pulse_discharge_m3_s/type",keyword:"type",params:{type: schema11.properties.pulse_discharge_m3_s.type},message:"must be number,null"};
if(vErrors === null){
vErrors = [err193];
}
else {
vErrors.push(err193);
}
errors++;
}
if((typeof data70 == "number") && (isFinite(data70))){
if(data70 < 0 || isNaN(data70)){
const err194 = {instancePath:instancePath+"/pulse_discharge_m3_s",schemaPath:"#/properties/pulse_discharge_m3_s/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
if(vErrors === null){
vErrors = [err194];
}
else {
vErrors.push(err194);
}
errors++;
}
}
}
if(data.volume_per_section_m3 !== undefined){
let data71 = data.volume_per_section_m3;
if((!((typeof data71 == "number") && (isFinite(data71)))) && (data71 !== null)){
const err195 = {instancePath:instancePath+"/volume_per_section_m3",schemaPath:"#/properties/volume_per_section_m3/type",keyword:"type",params:{type: schema11.properties.volume_per_section_m3.type},message:"must be number,null"};
if(vErrors === null){
vErrors = [err195];
}
else {
vErrors.push(err195);
}
errors++;
}
if((typeof data71 == "number") && (isFinite(data71))){
if(data71 < 0 || isNaN(data71)){
const err196 = {instancePath:instancePath+"/volume_per_section_m3",schemaPath:"#/properties/volume_per_section_m3/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
if(vErrors === null){
vErrors = [err196];
}
else {
vErrors.push(err196);
}
errors++;
}
}
}
if(data.footprint !== undefined){
if(data.footprint !== null){
const err197 = {instancePath:instancePath+"/footprint",schemaPath:"#/properties/footprint/type",keyword:"type",params:{type: "null"},message:"must be null"};
if(vErrors === null){
vErrors = [err197];
}
else {
vErrors.push(err197);
}
errors++;
}
}
if(data.depth_m !== undefined){
if(data.depth_m !== null){
const err198 = {instancePath:instancePath+"/depth_m",schemaPath:"#/properties/depth_m/type",keyword:"type",params:{type: "null"},message:"must be null"};
if(vErrors === null){
vErrors = [err198];
}
else {
vErrors.push(err198);
}
errors++;
}
}
if(data.velocity_m_s !== undefined){
if(data.velocity_m_s !== null){
const err199 = {instancePath:instancePath+"/velocity_m_s",schemaPath:"#/properties/velocity_m_s/type",keyword:"type",params:{type: "null"},message:"must be null"};
if(vErrors === null){
vErrors = [err199];
}
else {
vErrors.push(err199);
}
errors++;
}
}
if(data.confidence_interval !== undefined){
if(data.confidence_interval !== null){
const err200 = {instancePath:instancePath+"/confidence_interval",schemaPath:"#/properties/confidence_interval/type",keyword:"type",params:{type: "null"},message:"must be null"};
if(vErrors === null){
vErrors = [err200];
}
else {
vErrors.push(err200);
}
errors++;
}
}
if(data.validation !== undefined){
let data76 = data.validation;
if(data76 && typeof data76 == "object" && !Array.isArray(data76)){
if(data76.status === undefined){
const err201 = {instancePath:instancePath+"/validation",schemaPath:"#/properties/validation/required",keyword:"required",params:{missingProperty: "status"},message:"must have required property '"+"status"+"'"};
if(vErrors === null){
vErrors = [err201];
}
else {
vErrors.push(err201);
}
errors++;
}
if(data76.real_event_validation === undefined){
const err202 = {instancePath:instancePath+"/validation",schemaPath:"#/properties/validation/required",keyword:"required",params:{missingProperty: "real_event_validation"},message:"must have required property '"+"real_event_validation"+"'"};
if(vErrors === null){
vErrors = [err202];
}
else {
vErrors.push(err202);
}
errors++;
}
for(const key13 in data76){
if(!((key13 === "status") || (key13 === "real_event_validation"))){
const err203 = {instancePath:instancePath+"/validation",schemaPath:"#/properties/validation/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key13},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err203];
}
else {
vErrors.push(err203);
}
errors++;
}
}
if(data76.status !== undefined){
if("synthetic_analytic_cases_only" !== data76.status){
const err204 = {instancePath:instancePath+"/validation/status",schemaPath:"#/properties/validation/properties/status/const",keyword:"const",params:{allowedValue: "synthetic_analytic_cases_only"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err204];
}
else {
vErrors.push(err204);
}
errors++;
}
}
if(data76.real_event_validation !== undefined){
if(false !== data76.real_event_validation){
const err205 = {instancePath:instancePath+"/validation/real_event_validation",schemaPath:"#/properties/validation/properties/real_event_validation/const",keyword:"const",params:{allowedValue: false},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err205];
}
else {
vErrors.push(err205);
}
errors++;
}
}
}
else {
const err206 = {instancePath:instancePath+"/validation",schemaPath:"#/properties/validation/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err206];
}
else {
vErrors.push(err206);
}
errors++;
}
}
if(data.limitations !== undefined){
let data79 = data.limitations;
if(Array.isArray(data79)){
if(data79.length < 1){
const err207 = {instancePath:instancePath+"/limitations",schemaPath:"#/properties/limitations/minItems",keyword:"minItems",params:{limit: 1},message:"must NOT have fewer than 1 items"};
if(vErrors === null){
vErrors = [err207];
}
else {
vErrors.push(err207);
}
errors++;
}
const len4 = data79.length;
for(let i5=0; i5<len4; i5++){
let data80 = data79[i5];
if(typeof data80 === "string"){
if(func3(data80) < 1){
const err208 = {instancePath:instancePath+"/limitations/" + i5,schemaPath:"#/properties/limitations/items/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err208];
}
else {
vErrors.push(err208);
}
errors++;
}
}
else {
const err209 = {instancePath:instancePath+"/limitations/" + i5,schemaPath:"#/properties/limitations/items/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err209];
}
else {
vErrors.push(err209);
}
errors++;
}
}
}
else {
const err210 = {instancePath:instancePath+"/limitations",schemaPath:"#/properties/limitations/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err210];
}
else {
vErrors.push(err210);
}
errors++;
}
}
}
else {
const err211 = {instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err211];
}
else {
vErrors.push(err211);
}
errors++;
}
validate10.errors = vErrors;
return errors === 0;
}

