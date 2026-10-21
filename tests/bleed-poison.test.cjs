const test=require('node:test'),assert=require('node:assert/strict');
const {Build}=require('../src/models/Build.ts');
const {ItemStore}=require('../src/models/Item.ts');
const {BuffStore}=require('../src/models/Buffs.ts');
const {resolveDamage,resolveStatusDamage,getActivePerkOutputPreview}=require('../src/models/Combat.ts');
function pair(){const a=new Build(),t=new Build();a.level=0;t.level=0;a.damageTypes={Physical:1};a.target=t;t.target=a;return[a,t];}
function status(id,owner){const s=BuffStore.getByID(id);if(owner)s.appliedBy=owner;return s;}
const packet=extra=>({damage:100,hitAmount:1,source:'test',sourceType:'Weapon',sourceDamageType:'M1',...extra});
const run=(a,t,extra)=>resolveDamage(packet(extra),a,t);
function poisonProc(a,t){a.perks={venom_eater:1};a.buff=[status('venom_eater_proc')];t.deBuffs=[status('poison','opponent')];}

test('Blood Thirsty requires its selected proc and attacker-owned Bleed',()=>{
 const[a,t]=pair();a.perks={blood_thirsty:1};t.deBuffs=[status('bleed','opponent')];
 assert.equal(run(a,t).total.normal,100);
 a.buff=[status('blood_thirsty_proc')];assert.equal(run(a,t).total.normal,120);
 t.deBuffs[0].appliedBy='self';assert.equal(run(a,t).total.normal,100);
 t.deBuffs=[];assert.equal(run(a,t).total.normal,100);
 a.perks={};t.deBuffs=[status('bleed')];assert.equal(run(a,t).total.normal,100);
});
test('Blood Thirsty consumes Bleed before Hemorrhage, Vicious Edge, and Reaper bonuses',()=>{
 const[a,t]=pair();a.perks={blood_thirsty:1,hemorrhage:1,vicious_edge:1,reaper:1};a.buff=[status('blood_thirsty_proc')];t.deBuffs=[status('bleed')];
 const result=run(a,t);assert.equal(result.total.normal,120);assert.equal(result.outputs.True,undefined);
 assert.deepEqual(result.statusConsumptions,[{statusId:'bleed',perkId:'blood_thirsty',hit:1}]);
 t.deBuffs.push(status('slow'));assert.equal(run(a,t).total.normal,126);
 assert.equal(t.deBuffs[0].id,'bleed');
});
test('added-output previews honor Blood Thirsty consumption without mutating damage types',()=>{
 const[a,t]=pair();a.perks={hemorrhage:1,blood_thirsty:1};t.deBuffs=[status('bleed')];
 a.mainArmor.rune={id:'preview',baseDamage:10};
 assert.equal(getActivePerkOutputPreview(a,t).damageTypes['Rune: True'],.1);
 a.buff=[status('blood_thirsty_proc')];assert.deepEqual(getActivePerkOutputPreview(a,t).damageTypes,{});
 assert.equal(a.damageTypes.True,undefined);
});
test('Hemorrhage and Vicious Edge stack against existing Bleed without a consuming proc',()=>{
 const[a,t]=pair();a.perks={hemorrhage:1,vicious_edge:1,reaper:1};t.deBuffs=[status('bleed','self')];
 const result=run(a,t);assert.equal(result.outputs.Physical.normal,151.2);assert.equal(result.outputs.True.normal,15.12);
 assert.equal(result.total.normal,166.32);
});
test('Hemorrhage preserves fractional coefficients and existing True output',()=>{
 const[a,t]=pair();a.perks={hemorrhage:.05};t.deBuffs=[status('bleed')];assert.equal(run(a,t).total.normal,111.05);
 a.perks.hemorrhage=1;a.damageTypes.True=.5;assert.equal(run(a,t).outputs.True.normal,72);
});
test('Bleed hit bonuses and consuming procs are excluded from DoTs and zero-proc packets',()=>{
 const[a,t]=pair();a.perks={blood_thirsty:1,hemorrhage:1,vicious_edge:1,venom_eater:1};
 a.buff=[status('blood_thirsty_proc'),status('venom_eater_proc')];t.deBuffs=[status('bleed'),status('poison')];
 for(const extra of [{sourceType:'Status',sourceDamageType:'Status'},{procCoefficient:0}]){
  const result=run(a,t,extra);assert.equal(result.total.normal,100);assert.equal(result.outputs.True,undefined);assert.equal(result.statusConsumptions,undefined);
 }
});
test('Venom Eater changes base crit damage even when a consuming proc is not selected',()=>{
 const[a,t]=pair();a.perks={venom_eater:1};assert.deepEqual(run(a,t).total,{normal:100,crit:130,average:100});
 a.perks.venom_eater=3;a.stats.CritRate=100;assert.equal(run(a,t).total.average,150);
});
test('Venom Eater proc requires your Poison and guarantees the qualifying hit crits',()=>{
 const[a,t]=pair();poisonProc(a,t);const result=run(a,t);
 assert.deepEqual(result.total,{normal:110,crit:143,average:143});assert.equal(result.modifiers.crit_mods['Crit Rate'],1);
 t.deBuffs[0].appliedBy='self';assert.equal(run(a,t).total.average,100);
 t.deBuffs=[];assert.equal(run(a,t).total.average,100);
});
test('Venom Eater retains additive Dexterity, crit stats, and other perk crit bonuses',()=>{
 const[a,t]=pair();poisonProc(a,t);a.stats={DexterityBoost:100,CritDamage:20};a.perks.vital_strikes=1;
 assert.equal(run(a,t).total.average,203.5);
 a.perks.golden_crits=1;assert.equal(run(a,t).total.average,225.5);
});
test('Venom Eater works with crit-only penetration and Spell Piercer source restrictions',()=>{
 const[a,t]=pair();poisonProc(a,t);a.stats.PhysicalBoost=100;a.perks.sharp_crits=1;t.stats.PhysicalDefense=20;
 const sharp=run(a,t);assert.equal(sharp.total.normal,91.67);assert.equal(sharp.total.average,143);
 a.perks={venom_eater:1,spell_piercer:1};t.stats.PhysicalDefense=100;
 assert.equal(run(a,t,{sourceType:'Rune',sourceDamageType:'Rune'}).total.average,171.6);
 assert.equal(run(a,t).total.average,71.5);
});
test('Venom Eater does not consume Poison on a packet explicitly unable to crit',()=>{
 const[a,t]=pair();poisonProc(a,t);const result=run(a,t,{canCrit:false});
 assert.deepEqual(result.total,{normal:100,crit:100,average:100});assert.equal(result.statusConsumptions,undefined);
});
test('Venom Eater Poison ordering is an explicit snapshot choice for other bonuses',()=>{
 const[a,t]=pair();poisonProc(a,t);a.perks.reaper=1;
 assert.equal(run(a,t).total.average,150.15);
 a.buff[0].consumptionTiming='before';assert.equal(run(a,t).total.average,143);
});
test('multi-hit packets consume Poison once and recalculate remaining hits',()=>{
 const[a,t]=pair();poisonProc(a,t);const result=run(a,t,{hitAmount:2});
 assert.deepEqual(result.total,{normal:210,crit:273,average:243});assert.equal(result.perHit.average,121.5);
 assert.equal(result.statusConsumptions.length,1);assert.equal(t.deBuffs.length,1);
});
test('multi-hit Blood Thirsty does not repeat its consumed-status bonus and rounds once',()=>{
 const[a,t]=pair();a.perks={blood_thirsty:1,hemorrhage:1};a.buff=[status('blood_thirsty_proc')];t.deBuffs=[status('bleed')];
 assert.equal(run(a,t,{hitAmount:2}).total.normal,220);
 assert.equal(run(a,t,{damage:.333333,hitAmount:3}).total.normal,1.07);
});
test('both consuming procs can activate once without leaving Bleed or Poison for later hits',()=>{
 const[a,t]=pair();poisonProc(a,t);a.perks.blood_thirsty=1;a.perks.hemorrhage=1;a.perks.reaper=1;
 a.buff.push(status('blood_thirsty_proc'));t.deBuffs.push(status('bleed'));
 const result=run(a,t,{hitAmount:2});assert.equal(result.total.average,280.18);assert.equal(result.outputs.True,undefined);
 assert.equal(result.statusConsumptions.length,2);
});
test('proc selection, ownership, and timing survive saved-build round trips',()=>{
 const[a]=pair();a.buff=[status('blood_thirsty_proc'),status('venom_eater_proc')];a.buff[1].consumptionTiming='before';a.deBuffs=[status('poison','self')];
 const restored=Build.dictToBuild(JSON.parse(a.buildToJson()));assert.equal(restored.buff[0].id,'blood_thirsty_proc');
 assert.equal(restored.buff[1].consumptionTiming,'before');assert.equal(restored.deBuffs[0].getAppliedBy(),'self');
});
test('real saved equipment enables a Venom Eater proc without a synthetic perk map',()=>{
 const[a,t]=pair();let equipped=false;
 for(const slot of ['helmet','chestplate','legging','rune','ring']){
  const item=ItemStore.getByCategory(slot).find(item=>item.perks?.venom_eater);
  if(item){a.mainArmor[slot]=item;equipped=true;break;}
 }
 assert.ok(equipped);a.buff=[status('venom_eater_proc')];a.resetBuild();
 const restored=Build.dictToBuild(a.toSavedBuild());restored.target=t;t.target=restored;restored.level=0;restored.damageTypes={Physical:1};t.deBuffs=[status('poison')];
 const result=run(restored,t);assert.equal(result.modifiers.crit_mods['Crit Rate'],1);assert.equal(result.statusConsumptions[0].perkId,'venom_eater');
});
test('Bleed/Poison resolution stays deterministic and does not consume saved inputs',()=>{
 const[a,t]=pair();poisonProc(a,t);a.perks.blood_thirsty=.5;a.perks.hemorrhage=.5;a.buff.push(status('blood_thirsty_proc'));t.deBuffs.push(status('bleed'));
 const before=JSON.stringify([a.toSavedBuild(),t.toSavedBuild(),a.perks,a.stats,a.damageTypes]);const result=run(a,t,{hitAmount:4});
 assert.deepEqual(run(a,t,{hitAmount:4}),result);assert.equal(JSON.stringify([a.toSavedBuild(),t.toSavedBuild(),a.perks,a.stats,a.damageTypes]),before);
});
test('DoT base damage is nonzero at zero additive potency and keeps the source multiplier separate',()=>{
 const[a,t]=pair();const bleed=status('bleed');t.deBuffs=[bleed];
 assert.equal(resolveStatusDamage(bleed,t).total.normal,1);
 bleed.setSourceData('source','Perk',.3);assert.equal(resolveStatusDamage(bleed,t).total.normal,1.3);
 a.potencies.bleedpotency=4;assert.equal(resolveStatusDamage(bleed,t).total.normal,2.08);
});
test('DoT potency uses the documented low/high branches with a separate innate source value',()=>{
 const[a,t]=pair();const poison=status('poison');poison.setSourceData('source','Perk',.3);t.deBuffs=[poison];
 a.potencies.poisonpotency=10;assert.equal(resolveStatusDamage(poison,t).total.normal,5.2);
 a.potencies.poisonpotency=20;assert.equal(resolveStatusDamage(poison,t).total.normal,11.7);
 a.potencies.poisonpotency=4;poison.sourceData.sourceInatePotency=.5;assert.equal(resolveStatusDamage(poison,t).total.normal,2.4);
});
test('manual DoT potency overrides additive bonuses without erasing source potency',()=>{
 const[a,t]=pair();a.potencies.poisonpotency=100;const poison=status('poison');poison.setSourceData('source','Perk',.3);t.deBuffs=[poison];
 poison.effectivePotencyOverride=0;assert.equal(resolveStatusDamage(poison,t).total.normal,1.3);
 poison.effectivePotencyOverride=1;assert.equal(resolveStatusDamage(poison,t).total.normal,5.2);
 const loaded=Build.dictToBuild(Object.assign(t.toSavedBuild(),{debuffs:[{id:'poison',sourceData:poison.sourceData,effectivePotencyOverride:1}]}));
 loaded.level=0;loaded.target=a;assert.equal(resolveStatusDamage(loaded.deBuffs[0],loaded).total.normal,5.2);
});
