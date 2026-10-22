const test=require('node:test'),assert=require('node:assert/strict');
const {Build}=require('../src/models/Build.ts');
const {Item}=require('../src/models/Item.ts');
const {BuffStore}=require('../src/models/Buffs.ts');
const {getPotencyPreview}=require('../src/models/PotencyPreview.ts');
const {resolveStatusDamage}=require('../src/models/Combat.ts');
function equipped(perks,potencies={}) {
 const a=new Build();a.level=0;
 a.mainArmor.helmet=new Item({id:'test_bleed_gear',perks,potencies});
 a.resetBuild();return a;
}
test('Blood Thirsty grants stored Bleed potency without a proc and resets without accumulating',()=>{
 const a=equipped({blood_thirsty:3},{bleedpotency:2});
 assert.deepEqual(getPotencyPreview(a),[{label:'Bleed Potency',value:.5}]);
 a.resetBuild();assert.equal(a.potencies.bleedpotency,5);
 a.buff=[BuffStore.getByID('blood_thirsty_proc')];a.resetBuild();assert.equal(a.potencies.bleedpotency,5);
 a.mainArmor.helmet.perks={};a.resetBuild();
 assert.deepEqual(getPotencyPreview(a),[{label:'Bleed Potency',value:.2}]);
});
test('Blood Thirsty potency stacks with Sharp Claws, respects perk modifiers, and reaches Bleed damage',()=>{
 const a=equipped({blood_thirsty:2,sharp_claws:1,cursed:1},{bleedpotency:4});
 assert.ok(Math.abs(a.potencies.bleedpotency-7.3)<1e-9);
 const t=new Build();t.level=0;a.target=t;t.target=a;
 const bleed=BuffStore.getByID('bleed');bleed.setSourceData('test_source','Perk',.3);t.deBuffs=[bleed];
 const boosted=resolveStatusDamage(bleed,t).total.normal;
 a.mainArmor.helmet.perks={sharp_claws:1,cursed:1};a.resetBuild();
 assert.ok(Math.abs(a.potencies.bleedpotency-5.1)<1e-9);
 assert.ok(boosted>resolveStatusDamage(bleed,t).total.normal);
});
