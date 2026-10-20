const test=require('node:test'),assert=require('node:assert/strict');
const {Build}=require('../src/models/Build.ts');
const {Item}=require('../src/models/Item.ts');
const {BuffStore}=require('../src/models/Buffs.ts');
const {PerkStore,getPerkSupport}=require('../src/models/Perk.ts');
const {resolveDamage,resolveStatusDamage}=require('../src/models/Combat.ts');
function pair(){const a=new Build(),t=new Build();a.level=0;a.damageTypes={Physical:1};a.target=t;t.target=a;return[a,t];}
function status(id,potency,appliedBy){const s=BuffStore.getByID(id);if(potency!==undefined)s.effectivePotencyOverride=potency;if(appliedBy)s.appliedBy=appliedBy;return s;}
function run(a,t,extra){return resolveDamage({damage:100,hitAmount:1,source:'test',sourceType:'Weapon',sourceDamageType:'M1',...extra},a,t);}
function gearBuild(perks){const a=new Build();a.mainArmor.helmet=new Item({id:'test',perks});a.resetBuild();a.level=0;a.damageTypes={Physical:1};return a;}

test('Weakness uses 1/(1+potency), including fractional and zero potency',()=>{
 const[a,t]=pair();const weakness=status('weakness',1);a.deBuffs=[weakness];
 assert.equal(run(a,t).total.normal,50);
 weakness.effectivePotencyOverride=.25;assert.equal(run(a,t).total.normal,80);
 weakness.effectivePotencyOverride=0;assert.equal(run(a,t).total.normal,100);
});
test('Weakness uses the applying build and does not weaken the wrong side',()=>{
 const[a,t]=pair();t.potencies.weakeningpotency=4;const weakness=status('weakness');weakness.setSourceData('test','Perk',.1);a.deBuffs=[weakness];
 assert.equal(run(a,t).total.normal,66.67);
 weakness.appliedBy='self';assert.equal(run(a,t).total.normal,90.91);
 a.deBuffs=[];t.deBuffs=[weakness];assert.equal(run(a,t).total.normal,100);
});
test('Mage/Oceans/Gladiatorial Rage add caster potency once, including fractional amounts',()=>{
 const a=gearBuild({mage_rage:1,oceans_rage:2,gladiatorial_rage:.5});
 assert.equal(a.potencies.ragepotency,3.5);
 a.resetBuild();assert.equal(a.potencies.ragepotency,3.5);
 const rage=status('rage');rage.setSourceData('rage_rune','Rune',.3);
 assert.ok(Math.abs(rage.getEffectivePotency(a)-6.5)<1e-12);
});
test('Rage extends only to the recipient perk’s Magic/Water outputs',()=>{
 const[a,t]=pair();a.perks={mage_rage:1,oceans_rage:1};a.buff=[status('rage',.4)];
 a.damageTypes={Physical:1,Magic:1,Water:1,Fire:1,True:1};const result=run(a,t);
 assert.equal(result.outputs.Physical.normal,140);assert.equal(result.outputs.Magic.normal,140);
 assert.equal(result.outputs.Water.normal,140);assert.equal(result.outputs.Fire.normal,100);assert.equal(result.outputs.True.normal,100);
 a.perks={};assert.equal(run(a,t).outputs.Magic.normal,100);assert.equal(run(a,t).outputs.Water.normal,100);
});
test('received Rage uses caster potency while recipient perks determine eligible damage types',()=>{
 const a=gearBuild({mage_rage:1}),t=gearBuild({oceans_rage:2});a.level=0;a.damageTypes={Magic:1,Water:1};a.target=t;t.target=a;
 const rage=status('rage');rage.setSourceData('test','Rune',.3);a.buff=[rage];
 assert.equal(run(a,t).outputs.Magic.normal,140);
 rage.appliedBy='opponent';assert.equal(run(a,t).outputs.Magic.normal,150);
 assert.equal(run(a,t).outputs.Water.normal,100);
 rage.effectivePotencyOverride=.1;assert.equal(run(a,t).outputs.Magic.normal,110);
});
test('Rage potency follows adjusted perk amounts without double application by Cursed',()=>{
 const a=gearBuild({cursed:1,mage_rage:1,oceans_rage:1});
 assert.equal(a.perks.mage_rage,1.1);assert.equal(a.potencies.ragepotency,2.2);
 a.resetBuild();assert.equal(a.potencies.ragepotency,2.2);
});
test('Vapor Aegis requires Reinforce and directly reduces Fire/Water by 90%',()=>{
 const[a,t]=pair();a.damageTypes={Fire:1,Water:1,Physical:1,True:1};t.perks={vapor_aegis:.5};
 assert.equal(run(a,t).outputs.Fire.normal,100);
 t.buff=[status('reinforce',0)];const result=run(a,t);
 assert.equal(result.outputs.Fire.normal,10);assert.equal(result.outputs.Water.normal,10);
 assert.equal(result.outputs.Physical.normal,100);assert.equal(result.outputs.True.normal,100);
 t.perks.vapor_aegis=3;assert.equal(run(a,t).outputs.Fire.normal,10);
});
test('Vapor Aegis combines with Reinforce diminishing returns and affects burn DoT',()=>{
 const[a,t]=pair();a.damageTypes={Fire:1};t.perks={vapor_aegis:1};t.buff=[status('reinforce',.4)];
 assert.equal(run(a,t,{source:'burn',sourceType:'Status',sourceDamageType:'Status'}).total.normal,7.14);
});
test('Barbskin general reduction requires self Bleed and uses diminishing returns',()=>{
 const[a,t]=pair();t.perks={barbskin:2};assert.equal(run(a,t).total.normal,100);
 a.deBuffs=[status('bleed')];assert.equal(run(a,t).total.normal,100);
 t.deBuffs=[status('bleed')];assert.equal(run(a,t).total.normal,71.43);
});
test('Frostbite perk requires Slow and is independent of the Frostbite debuff',()=>{
 const[a,t]=pair();a.perks={frostbite:1.5};t.deBuffs=[status('frostbite')];assert.equal(run(a,t).total.normal,100);
 t.deBuffs=[status('slow')];assert.equal(run(a,t).total.normal,115);
});
test('Sunburn upgrades all outputs when a Holy component exists, including DoTs',()=>{
 const[a,t]=pair();a.perks={sunburn:1};assert.equal(run(a,t).total.normal,100);
 t.deBuffs=[status('burn')];assert.equal(run(a,t).total.normal,110);
 a.damageTypes={Physical:1,Holy:.5};const result=run(a,t);
 assert.equal(result.outputs.Physical.normal,115);assert.equal(result.outputs.Holy.normal,57.5);
 a.damageTypes={Fire:1};assert.equal(run(a,t,{source:'burn',sourceType:'Status',sourceDamageType:'Status'}).total.normal,110);
});
test('Scourge bonus requires its manual proc state and does not affect DoTs',()=>{
 const[a,t]=pair();a.perks={scourge:2};assert.equal(run(a,t).total.normal,100);
 a.buff=[status('scourge_proc')];assert.equal(run(a,t).total.normal,140);
 assert.equal(run(a,t,{sourceType:'Status',sourceDamageType:'Status'}).total.normal,100);
 a.perks={};assert.equal(run(a,t).total.normal,100);
});
test('Scourge True Rage eligibility is independent of its proc toggle',()=>{
 const[a,t]=pair();a.perks={scourge:1};a.damageTypes={True:1};a.buff=[status('rage',.3)];
 assert.equal(run(a,t).total.normal,130);
 a.buff.push(status('scourge_proc'));assert.equal(run(a,t).total.normal,156);
});
test('Reaper counts distinct present debuffs and retains fractional perk precision',()=>{
 const[a,t]=pair();a.perks={reaper:.5};t.deBuffs=[status('slow'),status('slow')];
 assert.equal(run(a,t).total.normal,102.5);
 t.deBuffs.push(status('burn'));assert.equal(run(a,t).total.normal,105);
 assert.equal(run(a,t,{sourceType:'Status',sourceDamageType:'Status'}).total.normal,100);
});
test('status applicant and manual proc survive saves, with legacy applicant defaults',()=>{
 const[a]=pair();a.buff=[status('rage',.4,'opponent'),status('scourge_proc')];a.deBuffs=[status('weakness',.5,'self')];
 const loaded=Build.dictToBuild(JSON.parse(a.buildToJson()));
 assert.equal(loaded.buff[0].getAppliedBy(),'opponent');assert.equal(loaded.deBuffs[0].getAppliedBy(),'self');
 assert.equal(loaded.buff[1].id,'scourge_proc');
 assert.equal(status('rage').getAppliedBy(),'self');assert.equal(status('weakness').getAppliedBy(),'opponent');
});
test('DoT previews use the applicant for both potency and offensive scaling',()=>{
 const[a,t]=pair();t.level=0;a.stats.FireBoost=100;t.stats.FireBoost=20;
 const burn=status('burn',.4);t.deBuffs=[burn];
 const base=burn.getDamageInfo.call(t,4).damage;
 assert.equal(resolveStatusDamage(burn,t).total.normal,Math.round(base*2.5*100)/100);
 burn.appliedBy='self';assert.equal(resolveStatusDamage(burn,t).total.normal,Math.round(base*1.3*100)/100);
 assert.equal(resolveStatusDamage(status('slow'),t),null);
});
test('received-status potency still uses the other combatant during self-inflicted DoT',()=>{
 const[a,t]=pair();t.level=0;t.stats.PhysicalBoost=100;a.potencies.weakeningpotency=4;
 const bleed=status('bleed',1,'self');const weakness=status('weakness');weakness.setSourceData('test','Perk',.1);
 t.deBuffs=[bleed,weakness];const base=bleed.getDamageInfo.call(t,10).damage;
 // Self Bleed scales with target Physical Boost (x2), while Weakness is applied by the other build (divide by 1.5).
 assert.equal(resolveStatusDamage(bleed,t).total.normal,Math.round(base*2/1.5*100)/100);
 assert.equal(weakness.getAppliedBy(),'opponent');
});
test('mixed status resolution is deterministic and leaves both snapshots untouched',()=>{
 const[a,t]=pair();a.perks={mage_rage:1,scourge:1,sunburn:1};a.damageTypes={Magic:1,Holy:.1};
 a.buff=[status('rage',.4,'opponent'),status('scourge_proc')];t.buff=[status('reinforce',.3)];t.deBuffs=[status('burn')];
 const before=JSON.stringify([a.toSavedBuild(),t.toSavedBuild(),a.stats,a.perks]);const first=run(a,t);
 assert.deepEqual(run(a,t),first);assert.equal(JSON.stringify([a.toSavedBuild(),t.toSavedBuild(),a.stats,a.perks]),before);
 for(const id of ['mage_rage','oceans_rage','barbskin','vapor_aegis','scourge'])assert.equal(getPerkSupport(PerkStore.getByID(id)).status,'Partial');
});
