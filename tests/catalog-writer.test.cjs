const test = require('node:test');
const assert = require('node:assert/strict');
const {patchTable} = require('../tools/apply-catalog.cjs');

test('direct catalog updates preserve custom functions, images, and unrelated data', () => {
  const source = `export const Gear = {
  cap: {id:'cap', stats:{AirBoost:7}, img:images+'cap.png', onStatCalculation() { return 2; }},
  other: {id:'other', stats:{AirBoost:3}},
};`;
  const output = patchTable(source, 'Gear', {cap:{stats:{AirBoost:14},source:{cardId:'card',cardUrl:'https://trello.com/c/card'}}});
  assert.ok(output.includes("img:images+'cap.png'"));
  assert.ok(output.includes('onStatCalculation() { return 2; }'));
  assert.ok(output.includes("other: {id:'other', stats:{AirBoost:3}}"));
  assert.ok(output.includes('"AirBoost": 14'));
});

test('direct catalog updates are repeatable and keep formula text inert', () => {
  const definition = {cap:{id:'cap',description:'${throw new Error("never execute")}'}};
  const first = patchTable('export const Gear = {};', 'Gear', definition);
  assert.equal(patchTable(first, 'Gear', definition), first);
  assert.ok(first.includes('${throw'));
});

test('direct catalog writer refuses dynamic tables and executable target fields', () => {
  assert.throws(() => patchTable('export const Gear = makeGear();','Gear',{}),/literal table/);
  assert.throws(() => patchTable('export const Gear = {cap: makeCap()};','Gear',{cap:{id:'cap'}}),/literal item/);
  assert.throws(() => patchTable('export const Gear = {cap: {stats() {}}};','Gear',{cap:{stats:{}}}),/non-data field/);
});

test('reviewed slot aliases remove only the obsolete definition', () => {
  const output = patchTable('export const Gear = {old: {id:"old"}, keep: {id:"keep"}};', 'Gear', {correct:{id:'correct'}}, ['old']);
  assert.ok(!output.includes('id:"old"'));
  assert.ok(output.includes('keep: {id:"keep"}'));
  assert.equal(patchTable(output, 'Gear', {correct:{id:'correct'}}, ['old']), output);
});
