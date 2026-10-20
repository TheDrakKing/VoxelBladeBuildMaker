const test=require('node:test'),assert=require('node:assert/strict');
const {ItemStore}=require('../src/models/Item.ts');
const {Build}=require('../src/models/Build.ts');
const categories=['Helmet','Chestplate','Legging','Blade','Handle','Glove','Essence','Rune','Ring'];
const equipment=()=>categories.flatMap(category=>ItemStore.getByCategory(category)).filter(item=>item.source);
const {PerkStore}=require('../src/models/Perk.ts');

test('reviewed data restores stats that the old importer put in perks',()=>{
 const item=ItemStore.getByID('steampunk_ring_unobtainable');
 assert.equal(item.stats.SpeedBoost,-5);assert.equal(item.perks.speed,undefined);
 assert.equal(ItemStore.getByID('noble_handle').stats.SpeedBoost,5);
 assert.equal(ItemStore.getByID('stormwood_handle').stats.AirBoost,4);
});
test('new armor pieces have correct selectable slots and source provenance',()=>{
 const item=ItemStore.getByCategory('Legging').find(item=>item.id==='bowldur_leggings');
 assert.ok(item);assert.equal(item.type,'Legging');assert.equal(item.stats.PhysicalDefense,5);
 assert.ok(item.source.cardId);assert.match(item.source.cardUrl,/^https:\/\/trello.com\/c\//);
 assert.ok(ItemStore.getByCategory('Chestplate').some(item=>item.id==='sea_demon_body'));
 assert.ok(ItemStore.getByCategory('Legging').some(item=>item.id==='sea_demon_legs'));
});
test('known Bowldur saved leg-slot mistake migrates without changing the helmet ID',()=>{
 const saved=new Build().toSavedBuild();saved.mainArmor.legging={id:'bowldur_helmet',upgrade:2};
 const build=Build.dictToBuild(saved);
 assert.equal(build.mainArmor.legging.id,'bowldur_leggings');assert.equal(build.mainArmor.legging.upgrade,2);
 assert.equal(ItemStore.getByID('bowldur_helmet').id,'bowldur_helmet');
 assert.ok(!ItemStore.getByCategory('Legging').some(item=>item.id==='bowldur_helmet'));
});
test('source potency remains separate from additive item potency',()=>{
 const rune=ItemStore.getByID('rage_rune');assert.equal(rune.sourcepotencies.ragepotency,.3);
 assert.equal(rune.potencies.ragepotency,undefined);
 const essence=ItemStore.getByID('jagged_essence');assert.equal(essence.potencies.bleedpotency,4);
 assert.equal(essence.perks.bleed_potency,undefined);
});
test('every promoted equipment perk resolves to a named definition',()=>{
 for(const item of equipment()){
  for(const id of Object.keys(item.perks||{}))assert.ok(PerkStore.getByID(id).name,`${item.id}: ${id}`);
 }
});
test('all promoted data is finite and ambiguous source records stay quarantined',()=>{
 for(const item of equipment()){
  for(const field of ['stats','perks','potencies','sourcepotencies','damageScalings','damageTypes'])for(const value of Object.values(item[field]||{}))assert.ok(Number.isFinite(value));
 }
 assert.ok(PerkStore.getByID('flowing_crits').source.cardUrl);
 for(const item of equipment())assert.ok(!('rules' in item.source));
 assert.ok(ItemStore.getByID('cindersoul_essence').dataWarnings.length);
 assert.ok(ItemStore.getByID('croakernaut_rune').dataWarnings.length);
});

test('direct data tables retain all established item IDs and unique slot lookups',()=>{
 for(const category of ['Helmet','Chestplate','Legging','Blade','Handle','Glove','Essence','Rune','Ring']){
  const items=ItemStore.getByCategory(category);const ids=items.map(item=>item.id);
  assert.equal(new Set(ids).size,ids.length);
  for(const item of items)assert.equal(ItemStore.getByID(item.id,category).id,item.id);
 }
});
