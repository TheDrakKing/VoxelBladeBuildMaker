const test=require('node:test'),assert=require('node:assert/strict');
const {Build}=require('../src/models/Build.ts');
const {Item}=require('../src/models/Item.ts');
const {BuffStore}=require('../src/models/Buffs.ts');
const {getPotencyPreview}=require('../src/models/PotencyPreview.ts');
const {resolveStatusDamage}=require('../src/models/Combat.ts');
function equipped(perks,potencies={}) {
 const a=new Build();a.level=0;
 a.mainArmor.helmet=new Item({id:'test_slow_leak_gear',perks,potencies});
 a.resetBuild();return a;
}
test('Slow Leak potency stacks with Bleed gear and other perks, and resets without accumulating',()=>{
 const a=equipped({slow_leak:2,blood_thirsty:2,sharp_claws:1,cursed:1},{bleedpotency:2});
 assert.deepEqual(getPotencyPreview(a),[{label:'Bleed Potency',value:.75}]);
 a.resetBuild();assert.equal(a.potencies.bleedpotency,7.5);
 a.mainArmor.helmet.perks={blood_thirsty:2,sharp_claws:1,cursed:1};a.resetBuild();
 assert.deepEqual(getPotencyPreview(a),[{label:'Bleed Potency',value:.53}]);
});
test('Slow Leak potency reaches Bleed damage while only duration depends on Enemy Mob',()=>{
 const a=equipped({slow_leak:2});const t=new Build();t.level=0;a.target=t;t.target=a;
 const bleed=BuffStore.getByID('bleed');bleed.setSourceData('test_source','Perk',.3);t.deBuffs=[bleed];
 assert.deepEqual(getPotencyPreview(a),[{label:'Bleed Potency',value:.2}]);
 const boosted=resolveStatusDamage(bleed,t).total.normal;
 assert.equal(bleed.getDurationPreview(a,t).duration,5);
 t.buff=[BuffStore.getByID('enemy_mob')];
 assert.equal(resolveStatusDamage(bleed,t).total.normal,boosted);
 assert.equal(bleed.getDurationPreview(a,t).duration,10);
 bleed.appliedBy='self';assert.equal(bleed.getDurationPreview(a,t).duration,5);
 bleed.appliedBy='opponent';a.mainArmor.helmet.perks={};a.resetBuild();
 assert.ok(boosted>resolveStatusDamage(bleed,t).total.normal);
});
