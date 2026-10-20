const test=require('node:test'),assert=require('node:assert/strict');
const {Build}=require('../src/models/Build.ts');
const {BuffStore}=require('../src/models/Buffs.ts');
const {ItemStore}=require('../src/models/Item.ts');
const {PerkStore,getPerkSupport}=require('../src/models/Perk.ts');
const {resolveDamage}=require('../src/models/Combat.ts');
function pair(){const a=new Build(),t=new Build();a.level=0;a.damageTypes={Physical:1};return[a,t];}
const packet=more=>({damage:100,hitAmount:1,source:'test',sourceType:'Weapon',sourceDamageType:'M1',...more});
const run=(a,t,more)=>resolveDamage(packet(more),a,t);

test('Dexterity contributes both critical chance and critical damage once',()=>{
 const[a,t]=pair();a.stats={DexterityBoost:100};const result=run(a,t);
 assert.deepEqual(result.total,{normal:100,crit:160,average:106});
 assert.equal(result.modifiers.crit_mods['Crit Rate'],.1);
});
test('Flowing Crits scales with Air boost and fractional perk amounts',()=>{
 const[a,t]=pair();a.stats={AirBoost:100};a.perks={flowing_crits:2};
 assert.deepEqual(run(a,t).total,{normal:100,crit:167.5,average:111.81});
 a.perks.flowing_crits=.5;assert.ok(Math.abs(run(a,t).modifiers.crit_mods['Crit Rate']-.04375)<1e-12);
});
test('Spell Slinger and Flowing Crits add their independent boost contributions',()=>{
 const[a,t]=pair();a.stats={AirBoost:100,MagicBoost:100};a.perks={flowing_crits:1,spell_slinger:1};
 const result=run(a,t);assert.ok(Math.abs(result.modifiers.crit_mods['Crit Rate']-.1625)<1e-12);
 assert.equal(result.total.crit,166.25);assert.equal(result.total.average,110.77);
});
test('Sharp Crits penetrates armor only on the critical branch',()=>{
 const[a,t]=pair();a.stats={PhysicalBoost:100};a.perks={sharp_crits:1};t.stats={PhysicalDefense:20};
 const result=run(a,t);
 assert.equal(result.total.normal,83.33);assert.equal(result.total.crit,150);assert.equal(result.total.average,88.33);
});
test('Spark requires target Burn; Vital Strikes and Critical Master add crit bonuses',()=>{
 const[a,t]=pair();a.stats.CritRate=100;a.perks={spark:1,vital_strikes:1,critical_master:1};
 assert.equal(run(a,t).total.crit,180);
 t.deBuffs=[BuffStore.getByID('burn')];assert.equal(run(a,t).total.crit,230);
 t.deBuffs=[];assert.equal(run(a,t).total.crit,180);
});
test('Golden Crits uses documented 40% chance and stays conditional on a critical hit',()=>{
 const[a,t]=pair();a.perks={golden_crits:1};a.stats.CritRate=20;
 assert.deepEqual(run(a,t).total,{normal:100,crit:170,average:114});
 a.stats.CritRate=0;assert.equal(run(a,t).total.average,100);
});
test('crit chance caps after combining stats, Dex, perks, and guaranteed crit',()=>{
 const[a,t]=pair();a.stats={DexterityBoost:500,AirBoost:500,CritRate:50};a.perks={flowing_crits:2};
 const result=run(a,t);assert.equal(result.modifiers.crit_mods['Crit Rate'],1);assert.equal(result.total.average,result.total.crit);
 a.stats={};a.perks={};a.buff=[BuffStore.getByID('guaranteed_crit')];assert.equal(run(a,t).total.average,150);
});
test('Spell Piercer boosts only Rune/WeaponArt critical hits and bypasses armor',()=>{
 const[a,t]=pair();a.stats.CritRate=50;a.perks={spell_piercer:1};t.stats.PhysicalDefense=100;
 assert.deepEqual(run(a,t,{sourceType:'Rune',sourceDamageType:'Rune'}).total,{normal:50,crit:180,average:115});
 assert.equal(run(a,t).total.crit,75);
 a.stats.ArmorPenetration=100;t.deBuffs=[BuffStore.getByID('shatter')];
 assert.equal(run(a,t,{sourceType:'WeaponArt',sourceDamageType:'WeaponArt'}).total.crit,180);
});
test('all critical effects remain excluded from DoT damage',()=>{
 const[a,t]=pair();a.stats={DexterityBoost:500,PhysicalBoost:500,AirBoost:500,CritRate:100};
 a.perks={flowing_crits:2,sharp_crits:2,golden_crits:2,spell_piercer:2,vital_strikes:2,spark:2,critical_master:2};
 a.buff=[BuffStore.getByID('guaranteed_crit')];t.deBuffs=[BuffStore.getByID('burn')];t.stats.PhysicalDefense=20;
 assert.deepEqual(run(a,t,{sourceType:'Status',sourceDamageType:'Status'}).total,{normal:83.33,crit:83.33,average:83.33});
});
test('reviewed equipment enters a saved build and enables a critical perk end to end',()=>{
 const item=ItemStore.getByCategory('Helmet').find(item=>item.perks?.flowing_crits);
 assert.ok(item);assert.ok(item.source?.cardUrl);
 const a=new Build(),t=new Build();a.mainArmor.helmet=item;a.resetBuild();
 const restored=Build.dictToBuild(a.toSavedBuild());restored.level=0;restored.damageTypes={Physical:1};
 const result=run(restored,t);
 const expectedChance=(restored.stats.DexterityBoost||0)/1000+(restored.stats.AirBoost||0)*.000875*restored.perks.flowing_crits;
 assert.ok(expectedChance>0);assert.ok(Math.abs(result.modifiers.crit_mods['Crit Rate']-expectedChance)<1e-9);
 assert.ok(PerkStore.getByID('flowing_crits').source?.cardUrl);
 assert.equal(getPerkSupport(PerkStore.getByID('critical_master')).status,'Partial');
});
