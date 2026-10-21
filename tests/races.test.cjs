const test=require('node:test'),assert=require('node:assert/strict');
const {Build}=require('../src/models/Build.ts');
const {RaceStore}=require('../src/models/Race.ts');
const {Item}=require('../src/models/Item.ts');
const {BuffStore}=require('../src/models/Buffs.ts');
const {WeaponArt}=require('../src/models/WeaponArt.ts');
const {PerkStore,getPerkSupport}=require('../src/models/Perk.ts');
const {resolveDamage,resolveStatusDamage}=require('../src/models/Combat.ts');
function actor(race){const b=new Build();if(race)b.race=RaceStore.getByID(race);b.level=0;b.resetBuild();b.damageTypes={Physical:1};return b;}
function pair(race,targetRace){const a=actor(race),t=actor(targetRace);a.target=t;t.target=a;return[a,t];}
const run=(a,t,extra)=>resolveDamage({damage:100,hitAmount:1,source:'test',sourceType:'Weapon',sourceDamageType:'M1',...extra},a,t);
function buff(id,potency){const s=BuffStore.getByID(id);if(potency!==undefined)s.effectivePotencyOverride=potency;return s;}
function weapon(a,speed,attackSpeed){a.blade=new Item({id:'test_blade',type:'Small Blade',attackSpeed:speed});a.handle=new Item({id:'test_handle',type:'Small Handle',attackSpeed:speed});a.mainArmor.helmet=new Item({id:'test_gear',stats:{AttackSpeed:attackSpeed}});a.resetBuild();}

test('all ten race IDs remain stable and link to their reviewed source',()=>{
 const ids=['human','half_ork','elf','dark_elf','dragon','ork','high_elf','arborian','kitsune','bunikin'];
 assert.deepEqual(RaceStore.all().map(r=>r.id),ids);
 for(const id of ids){const race=RaceStore.getByID(id);assert.ok(race.source.cardId);assert.match(race.source.cardUrl,/^https:\/\/trello.com\/c\//);}
 assert.equal(RaceStore.get('Dragon Blooded').id,'dragon');assert.equal(RaceStore.get('Dragon').id,'dragon');assert.equal(RaceStore.get('Half-Ork').id,'half_ork');
});
test('Half-Ork grants ten penetration to attacks without penetrating its own incoming damage',()=>{
 const[a,t]=pair('half_ork');t.stats.PhysicalDefense=10;
 assert.equal(a.stats.ArmorPenetration,10);assert.equal(run(a,t).total.normal,100);
 for(const sourceType of ['Rune','WeaponArt','Status'])assert.equal(run(a,t,{sourceType,sourceDamageType:sourceType}).total.normal,100);
 a.damageTypes={True:1};assert.equal(run(a,t).total.normal,100);
 const[x,half]=pair(undefined,'half_ork');half.stats.PhysicalDefense=20;assert.equal(run(x,half).total.normal,83.33);
});
test('fixed race bonuses do not grow with Cursed or repeat across rebuilds',()=>{
 const a=actor('half_ork');a.mainArmor.helmet=new Item({id:'test',perks:{cursed:2}});a.resetBuild();
 assert.equal(a.stats.ArmorPenetration,10);a.resetBuild();assert.equal(a.stats.ArmorPenetration,10);
});
test('Dragon Blooded stats are added once and feed existing Protection/Warding modifiers',()=>{
 const a=actor('dragon');assert.deepEqual(a.stats,{Warding:50,Protection:10,HeatResistance:100,ColdResistance:100});
 a.mainArmor.helmet=new Item({id:'test',perks:{extra_layers:1}});a.resetBuild();
 assert.equal(a.stats.Warding,60);assert.equal(a.stats.Protection,12);
 a.resetBuild();assert.equal(a.stats.Warding,60);assert.equal(RaceStore.getByID('dragon').stats.Warding,50);
});
test('Arborian gets verified negative Fire Defense and positive Protection',()=>{
 const[a,t]=pair(undefined,'arborian');a.damageTypes={Fire:1};
 assert.equal(t.stats.FireDefense,-50);assert.equal(t.stats.Protection,15);assert.equal(run(a,t).total.normal,150);
 t.buff=[buff('reinforce',.5)];assert.equal(run(a,t).total.normal,100);
});
test('Ork gains base and distinct-active-buff Tenacity without counting debuffs or scenario markers',()=>{
 const a=actor('ork');assert.equal(a.stats.Tenacity,.2);
 a.buff=[buff('rage'),buff('reinforce'),buff('rage'),buff('static_charge'),buff('scourge_proc'),buff('blood_thirsty_proc'),buff('venom_eater_proc')];
 a.deBuffs=[buff('bleed')];a.resetBuild();assert.equal(a.stats.Tenacity,.4);
 a.resetBuild();assert.equal(a.stats.Tenacity,.4);
 a.buff=[];a.resetBuild();assert.equal(a.stats.Tenacity,.2);
});
test('Ork buff Tenacity is available before Immovable reads it',()=>{
 const a=actor('ork');a.buff=[buff('rage'),buff('reinforce')];a.mainArmor.helmet=new Item({id:'test',perks:{immoveable:1}});a.resetBuild();
 assert.equal(a.stats.Tenacity,.4);assert.equal(a.stats.PhysicalDefense,12);
});
test('Ork penetration is WeaponArt-only, fixed, and does not benefit True damage',()=>{
 const[a,t]=pair('ork');t.stats.PhysicalDefense=20;
 assert.equal(run(a,t).total.normal,83.33);assert.equal(run(a,t,{sourceType:'Rune',sourceDamageType:'Rune'}).total.normal,83.33);
 assert.equal(run(a,t,{sourceDamageType:'M2'}).total.normal,83.33);
 assert.equal(run(a,t,{sourceType:'WeaponArt',sourceDamageType:'WeaponArt'}).total.normal,90.91);
 a.damageTypes={True:1};assert.equal(run(a,t,{sourceType:'WeaponArt',sourceDamageType:'WeaponArt'}).total.normal,100);
 a.mainArmor.helmet=new Item({id:'test',perks:{cursed:2}});a.resetBuild();a.damageTypes={Physical:1};
 assert.equal(run(a,t,{sourceType:'WeaponArt',sourceDamageType:'WeaponArt'}).total.normal,90.91);
});
test('Ork works with selected Rage, Mage Rage, and source-specific penetration',()=>{
 const[a,t]=pair('ork');a.mainArmor.helmet=new Item({id:'test',perks:{mage_rage:1}});const rage=buff('rage');rage.setSourceData('rage_rune','Rune',.3);a.buff=[rage];a.resetBuild();a.damageTypes={Magic:1};t.stats.MagicDefense=20;
 assert.equal(a.stats.Tenacity,.3);assert.equal(run(a,t,{sourceType:'Rune',sourceDamageType:'Rune'}).total.normal,116.67);
 assert.equal(run(a,t,{sourceType:'WeaponArt',sourceDamageType:'WeaponArt'}).total.normal,127.27);
});
test('Kitsune receives Jump/Movement stats and only a real weapon receives its flat speed bonus',()=>{
 const a=actor('kitsune');assert.equal(a.stats.JumpBoost,2);assert.equal(a.stats.SpeedBoost,10);assert.equal(a.weapon.attackSpeed,0);
 weapon(a,1.5,20);assert.equal(a.weapon.attackSpeed,1.8);assert.equal(a.stats.AttackSpeed,20);
 a.resetBuild();assert.equal(a.weapon.attackSpeed,1.8);
});
test('percentage attack speed converts to a flat numeric bonus on non-unit base speeds',()=>{
 const a=actor();weapon(a,1.5,20);assert.equal(a.weapon.attackSpeed,1.7);
 weapon(a,.8,20);assert.equal(a.weapon.attackSpeed,1);
 a.race=RaceStore.getByID('kitsune');weapon(a,1.5,-20);assert.equal(a.weapon.attackSpeed,1.4);
});
test('changing race removes Kitsune bonuses without modifying cached race data',()=>{
 const a=actor('kitsune');weapon(a,1.5,20);a.race=RaceStore.getByID('human');a.resetBuild();
 assert.equal(a.weapon.attackSpeed,1.7);assert.equal(a.stats.JumpBoost,undefined);assert.equal(a.stats.SpeedBoost,undefined);
 assert.equal(RaceStore.getByID('kitsune').flatAttackSpeed,.1);
});
test('Elf and High Elf use direct race-only cooldown multipliers on their respective sources',()=>{
 const elf=actor('elf'),high=actor('high_elf'),human=actor('human');
 assert.equal(elf.getRaceAdjustedCooldown(30,'Rune'),18);assert.equal(elf.getRaceAdjustedCooldown(30,'WeaponArt'),30);
 assert.equal(high.getRaceAdjustedCooldown(30,'WeaponArt'),22.5);assert.equal(high.getRaceAdjustedCooldown(30,'Rune'),30);
 assert.equal(human.getRaceAdjustedCooldown(30,'Rune'),30);
 assert.match(PerkStore.getByID('elf').description,/40%.*Rune/);
});
test('race-only cooldown previews preserve zero, reject missing values, and do not claim other perk reductions',()=>{
 const a=actor('elf');a.mainArmor.helmet=new Item({id:'test',perks:{mage_rage:1}});a.buff=[buff('rage',.4)];a.resetBuild();
 assert.equal(a.getRaceAdjustedCooldown(30,'Rune'),18);assert.equal(a.getRaceAdjustedCooldown(0,'Rune'),0);
 for(const value of [undefined,NaN,Infinity,-1])assert.equal(a.getRaceAdjustedCooldown(value,'Rune'),undefined);
 assert.equal(new WeaponArt({id:'unknown'}).coolDown,undefined);assert.equal(new WeaponArt({id:'zero',coolDown:0}).coolDown,0);
});
test('Dark Elf offers source-specific known outcomes without adding global potency or rolling statuses',()=>{
 const[a,t]=pair('dark_elf');const sources=a.getSourcesForBuff('bleedpotency');
 assert.equal(sources.dark_elf.inatePotency,.2);assert.equal(a.getSourcesForBuff('shatterpotency').dark_elf.inatePotency,.2);
 assert.equal(a.getSourcesForBuff('weakeningpotency').dark_elf,undefined);assert.equal(a.potencies.bleedpotency,undefined);
 assert.equal(t.deBuffs,undefined);run(a,t);assert.equal(t.deBuffs,undefined);
 const bleed=buff('bleed');bleed.setSourceData('dark_elf','Perk',sources.dark_elf.inatePotency);t.deBuffs=[bleed];
 assert.equal(resolveStatusDamage(bleed,t).total.normal,1.2);
 bleed.setSourceData('other','Perk',.5);assert.equal(resolveStatusDamage(bleed,t).total.normal,1.5);
});
test('Dark Elf Armor Break uses its own documented source potency',()=>{
 const[a,t]=pair('dark_elf');t.stats.PhysicalDefense=20;const shatter=buff('shatter');shatter.setSourceData('dark_elf','Perk',.2);t.deBuffs=[shatter];
 assert.equal(run(a,t).total.normal,100);
});
test('Bunikin grants Jump without inventing dodge chance or permanent critical chance',()=>{
 const[a,t]=pair('bunikin');assert.equal(a.stats.JumpBoost,5);assert.equal(a.stats.CritRate,undefined);assert.equal(run(a,t).total.average,100);
 a.buff=[buff('guaranteed_crit')];assert.equal(run(a,t).total.average,150);
});
test('Human HP threshold stacks with Rage and remains a direct incoming DoT reduction',()=>{
 const[a,t]=pair('human','human');a.hp=a.maxHp/2;a.buff=[buff('rage',.3)];assert.equal(run(a,t).total.normal,130);
 a.hp-=1;assert.equal(run(a,t).total.normal,156);
 a.perks={};a.buff=[];t.hp=t.maxHp/2-1;
 assert.equal(run(a,t,{source:'burn',sourceType:'Status',sourceDamageType:'Status'}).total.normal,80);
});
test('Human damage still combines correctly with Blood Thirsty consumption priority',()=>{
 const[a,t]=pair('human');a.mainArmor.helmet=new Item({id:'test',perks:{blood_thirsty:1,hemorrhage:1}});a.buff=[buff('blood_thirsty_proc')];a.resetBuild();a.hp=a.maxHp/2-1;a.damageTypes={Physical:1};t.deBuffs=[buff('bleed')];
 const result=run(a,t);assert.equal(result.total.normal,144);assert.equal(result.outputs.True,undefined);
});
test('Half-Ork penetration combines with Venom Eater and Sharp Crits without leaking to normal crit-only effects',()=>{
 const[a,t]=pair('half_ork');a.mainArmor.helmet=new Item({id:'test',stats:{PhysicalBoost:100},perks:{venom_eater:1,sharp_crits:1}});a.buff=[buff('venom_eater_proc')];a.resetBuild();a.damageTypes={Physical:1};t.stats.PhysicalDefense=20;t.deBuffs=[buff('poison')];
 const result=run(a,t);assert.equal(result.total.normal,100);assert.equal(result.total.average,157.3);
});
test('all race selections survive save/reload without changing IDs or cached stat definitions',()=>{
 for(const race of RaceStore.all()){
  const before=JSON.stringify(race.stats);const a=actor(race.id);a.buff=[buff('rage'),buff('scourge_proc')];a.resetBuild();
  const restored=Build.dictToBuild(JSON.parse(a.buildToJson()));assert.equal(restored.race.id,race.id);assert.deepEqual(restored.stats,a.stats);
  assert.equal(JSON.stringify(RaceStore.getByID(race.id).stats),before);
 }
});
test('race support labels distinguish all seven computed passives from three partial passives',()=>{
 for(const id of ['human','half_ork','elf','dragon','ork','high_elf','kitsune'])assert.equal(getPerkSupport(PerkStore.getByID(id)).status,'Implemented');
 for(const id of ['dark_elf','arborian','bunikin'])assert.equal(getPerkSupport(PerkStore.getByID(id)).status,'Partial');
});
