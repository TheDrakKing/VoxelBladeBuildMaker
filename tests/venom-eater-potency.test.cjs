const test=require('node:test'),assert=require('node:assert/strict');
const {Build}=require('../src/models/Build.ts');
const {Item}=require('../src/models/Item.ts');
const {BuffStore}=require('../src/models/Buffs.ts');
const {getPotencyPreview}=require('../src/models/PotencyPreview.ts');
const {resolveStatusDamage}=require('../src/models/Combat.ts');
function equipped(perks,potencies={}) {
 const a=new Build();a.level=0;
 a.mainArmor.helmet=new Item({id:'test_poison_gear',perks,potencies});
 a.resetBuild();return a;
}
test('two Venom Eater and one Spore Burst display 0.3 without a selected proc',()=>{
 const a=equipped({venom_eater:2,spore_burst:1});
 assert.equal(a.potencies.poisonpotency,3);
 assert.deepEqual(getPotencyPreview(a),[{label:'Poison Potency',value:.3}]);
 a.resetBuild();assert.equal(a.potencies.poisonpotency,3);
 a.mainArmor.helmet.perks={spore_burst:1};a.resetBuild();
 assert.deepEqual(getPotencyPreview(a),[{label:'Poison Potency',value:.1}]);
});
test('Venom Eater potency reaches Poison damage and respects modified perk amounts',()=>{
 const a=equipped({venom_eater:2,spore_burst:1,cursed:1},{poisonpotency:4});
 assert.ok(Math.abs(a.potencies.poisonpotency-7.3)<1e-9);
 const t=new Build();t.level=0;a.target=t;t.target=a;
 const poison=BuffStore.getByID('poison');poison.setSourceData('test_source','Perk',.3);t.deBuffs=[poison];
 const boosted=resolveStatusDamage(poison,t).total.normal;
 a.mainArmor.helmet.perks={spore_burst:1,cursed:1};a.resetBuild();
 assert.ok(Math.abs(a.potencies.poisonpotency-5.1)<1e-9);
 assert.ok(boosted>resolveStatusDamage(poison,t).total.normal);
});
