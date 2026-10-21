const test=require('node:test'),assert=require('node:assert/strict');
const {Build}=require('../src/models/Build.ts');
const {Item,ItemStore}=require('../src/models/Item.ts');
const {BuffStore}=require('../src/models/Buffs.ts');
const {RaceStore}=require('../src/models/Race.ts');
const {PerkStore,getPerkSupport}=require('../src/models/Perk.ts');
const {Perks}=require('../src/data/Perks.ts');
const {resolveDamage,resolveStatusDamage}=require('../src/models/Combat.ts');
const ids=['brawny','weight_distribution','righted_wrongs','immoveable','frozen_heart','quick_witted','whirl_foot','swift_guard','carapace','engine','spring_powered','juggernaut','steam_powered','true_balance','crushing_pressure','highlander','executioner','curse_rip','cursed_bark','dark_one','bellowing_ember','marsh_flow','smoldering','gelid_lance','dragon_breath','venom_spitter','sticky_swings','explosive_honey','undead_might','toxin_caster','raging_bounce','poison_acceleration','ice_barge','cleave','valor','warding_tides','weakening','poisonous','wrathful_crits','iron_bounce'];
function actor(perks={},stats={},potencies={}){
 const b=new Build();b.level=0;b.mainArmor.helmet=new Item({id:'test_equipment',perks,stats,potencies});b.resetBuild();b.damageTypes={Physical:1};return b;
}
function pair(perks={},stats={},potencies={}){const a=actor(perks,stats,potencies),t=actor();a.target=t;t.target=a;return[a,t];}
function status(id,potency){const b=BuffStore.getByID(id);if(potency!==undefined)b.effectivePotencyOverride=potency;return b;}
function fromSource(holder,applicant,id,perk){const b=status(id),s=applicant.getSourcesForBuff(b.potencyId)[perk];assert.ok(s,`${perk} must supply ${id}`);b.setSourceData(perk,s.type,s.inatePotency);return b;}
function run(a,t,packet={}){return resolveDamage({damage:100,hitAmount:1,source:'test',sourceType:'Weapon',sourceDamageType:'M1',...packet},a,t);}
function normal(a,t,packet){return run(a,t,packet).total.normal;}
const near=(actual,expected,eps=.00011)=>assert.ok(Math.abs(actual-expected)<eps,`${actual} != ${expected}`);

test('Brawny transfers positive offensive boosts, preserving negatives and non-offensive stats',()=>{
 const b=actor({brawny:1},{MagicBoost:100,DexterityBoost:50,HexBoost:-40,AttackSpeed:10,SpeedBoost:20});
 assert.equal(b.stats.MagicBoost,80);assert.equal(b.stats.DexterityBoost,40);assert.equal(b.stats.PhysicalBoost,30);
 assert.equal(b.stats.HexBoost,-40);assert.equal(b.stats.AttackSpeed,10);assert.equal(b.stats.SpeedBoost,20);
 assert.equal(b.mainArmor.helmet.stats.MagicBoost,100);b.resetBuild();assert.equal(b.stats.PhysicalBoost,30);
});
test('Brawny caps conversion at 100% without destroying negative boosts or fractional precision',()=>{
 const b=actor({brawny:5.5},{MagicBoost:100,WaterBoost:50,AirBoost:-10});
 assert.equal(b.stats.MagicBoost,0);assert.equal(b.stats.WaterBoost,0);assert.equal(b.stats.PhysicalBoost,150);assert.equal(b.stats.AirBoost,-10);
 const c=actor({brawny:1.3},{MagicBoost:1.2345});assert.equal(c.stats.PhysicalBoost,.321);assert.equal(c.stats.MagicBoost,.9135);
});
test('Weight Distribution averages and scales fractional, negative, and zero totals',()=>{
 const b=actor({weight_distribution:1.3},{PhysicalBoost:80,DexterityBoost:20});assert.equal(b.stats.PhysicalBoost,56.5);assert.equal(b.stats.DexterityBoost,56.5);
 const n=actor({weight_distribution:1},{PhysicalBoost:-20,DexterityBoost:10});assert.equal(n.stats.PhysicalBoost,-5.5);assert.equal(n.stats.DexterityBoost,-5.5);
 const z=actor({weight_distribution:1},{PhysicalBoost:-20,DexterityBoost:20});assert.equal(z.stats.PhysicalBoost,0);assert.equal(z.stats.DexterityBoost,0);
});
test('Righted Wrongs uses separate defense/protection/tenacity weights and the card signed Physical/Magic terms',()=>{
 const b=actor({righted_wrongs:1},{EarthDefense:-10,FireDefense:-20,Warding:-5,Protection:-6,Tenacity:-.2,MagicBoost:-10,SpeedBoost:-5,PhysicalDefense:3,MagicDefense:4});
 assert.equal(b.stats.DexterityBoost,7.5505);assert.equal(b.stats.SpeedBoost,-4.245);
 const n=actor({righted_wrongs:1},{PhysicalDefense:-3,MagicDefense:-4});assert.equal(n.stats.DexterityBoost,-1.3333);
 assert.match(getPerkSupport(PerkStore.getByID('righted_wrongs')).details,/in-game confirmation/);
});
test('Immovable retains fractional Tenacity and perk amount',()=>{
 const b=actor({immoveable:1.3},{Tenacity:.4});assert.equal(b.stats.PhysicalDefense,15.6);
});
test('Frozen Heart grants all three defenses and Extra Layers subsequently scales Warding',()=>{
 const b=actor({frozen_heart:2},{ColdResistance:100});for(const key of ['PhysicalDefense','MagicDefense','Warding'])assert.equal(b.stats[key],6.6666);
 const c=actor({frozen_heart:2,extra_layers:1},{ColdResistance:100});near(c.stats.Warding,7.9999);
 const d=actor({frozen_heart:1},{ColdResistance:-100});assert.equal(d.stats.PhysicalDefense,-4.4444);
});
test('Quick Witted scales Dexterity with Speed Boost including fractional amounts',()=>{
 const b=actor({quick_witted:1.3},{SpeedBoost:80});assert.equal(b.stats.DexterityBoost,26);
});
test('Whirl Foot adds Speed Boost and offers its amount-scaled Tailwind source',()=>{
 const b=actor({whirl_foot:2},{AirBoost:100});assert.equal(b.stats.SpeedBoost,10);assert.equal(b.getSourcesForBuff('tailwindpotency').whirl_foot.inatePotency,.2);
});
test('Swift Guard scales defense and its selected Reinforce source independently',()=>{
 const b=actor({swift_guard:1.3},{DexterityBoost:100});assert.equal(b.stats.PhysicalDefense,13);assert.equal(b.getSourcesForBuff('reinforcepotency').swift_guard.inatePotency,.26);
});
test('Carapace adds Protection and gates diminishing-return reduction on selected remaining shield',()=>{
 const[a,t]=pair();t.mainArmor.helmet=new Item({id:'test',stats:{EarthBoost:100},perks:{carapace:2}});t.resetBuild();assert.equal(t.stats.Protection,10);
 assert.equal(normal(a,t),100);t.buff=[status('protection_shield_active')];assert.equal(normal(a,t),76.92);
 t.buff=[];a.buff=[status('protection_shield_active')];assert.equal(normal(a,t),100);
});
test('Engine adds Speed and Tailwind contributions once without altering saved Tailwind potency',()=>{
 const b=actor({engine:2},{SpeedBoost:100});b.buff=[status('tailwind',.2)];b.resetBuild();assert.equal(b.stats.AttackSpeed,62);b.resetBuild();assert.equal(b.stats.AttackSpeed,62);
 b.buff[0].effectivePotencyOverride=0;b.resetBuild();assert.equal(b.stats.AttackSpeed,50);
});
test('Spring Powered uses flat Jump Boost for damage and scales its Bounce source',()=>{
 const[a,t]=pair({spring_powered:2},{JumpBoost:5});assert.equal(normal(a,t),105);assert.equal(a.getSourcesForBuff('bouncepotency').spring_powered.inatePotency,.2);
});
test('Juggernaut reads only negative speed stats and never penalizes positive speed',()=>{
 const[a,t]=pair({juggernaut:1.5},{SpeedBoost:-20,AttackSpeed:-30});assert.equal(normal(a,t),137.5);
 const b=actor({juggernaut:2},{SpeedBoost:20,AttackSpeed:30});assert.equal(normal(b,t),100);
});
test('Steam Powered applies separate Air-based damage and a fixed self-Burn source',()=>{
 const[a,t]=pair({steam_powered:2},{AirBoost:150});assert.equal(normal(a,t),140);assert.equal(a.getSourcesForBuff('burnpotency').steam_powered.inatePotency,1);
 assert.equal(a.potencies.burnpotency,undefined);
});
test('True Balance averages Hex/Holy once and uses the resulting Holy Boost for its separate multiplier',()=>{
 const[a,t]=pair({true_balance:2},{HexBoost:20,HolyBoost:80});assert.equal(a.stats.HexBoost,83);assert.equal(a.stats.HolyBoost,83);assert.equal(normal(a,t),119.92);
 for(const potency of ['ragepotency','regenpotency','reinforcepotency','tailwindpotency'])assert.equal(a.getSourcesForBuff(potency).true_balance.inatePotency,.2);
 a.resetBuild();assert.equal(a.stats.HolyBoost,83);
});
test('Crushing Pressure grants matching penetration only for positive non-True defense',()=>{
 const[a,t]=pair({crushing_pressure:2});t.stats.PhysicalDefense=100;assert.equal(normal(a,t),77.78);assert.equal(a.stats.ArmorPenetration,undefined);
 t.stats.PhysicalDefense=0;assert.equal(normal(a,t),100);t.stats.PhysicalDefense=-20;assert.equal(normal(a,t),120);
 a.damageTypes={Fire:1};t.stats.FireDefense=0;t.stats.PhysicalDefense=100;assert.equal(normal(a,t),100);
 a.damageTypes={True:1};assert.equal(normal(a,t),100);
});
test('Highlander keeps fractional damage and penetration confined to Rune and Weapon Art packets',()=>{
 const[a,t]=pair({highlander:1.234});a.damageTypes={True:1};for(const sourceType of ['Rune','WeaponArt'])assert.equal(normal(a,t,{sourceType,sourceDamageType:sourceType}),124.68);
 for(const sourceType of ['Weapon','Status'])assert.equal(normal(a,t,{sourceType,sourceDamageType:sourceType}),100);
 a.damageTypes={Physical:1};t.stats.PhysicalDefense=10;assert.ok(normal(a,t,{sourceType:'Rune'})>124.68);
});
test('Executioner clamps the selected target HP ratio and safely rejects invalid maximum HP',()=>{
 const[a,t]=pair({executioner:2});t.maxHp=100;t.hp=25;assert.equal(normal(a,t),175);t.hp=0;assert.equal(normal(a,t),200);
 t.hp=-10;assert.equal(normal(a,t),200);t.hp=200;assert.equal(normal(a,t),100);t.maxHp=0;assert.equal(normal(a,t),100);
});
test('Curse Rip counts distinct existing debuffs for proc-capable hits only',()=>{
 const[a,t]=pair({curse_rip:2});t.deBuffs=[status('bleed'),status('sticky'),status('bleed')];assert.equal(normal(a,t),120);
 assert.equal(normal(a,t,{procCoefficient:0}),100);assert.equal(normal(a,t,{sourceType:'Status',tags:['DoT']}),100);
});
test('Cursed Bark counts debuffs on the incoming attacker rather than the defender',()=>{
 const[a,t]=pair();t.mainArmor.helmet=new Item({id:'test',perks:{cursed_bark:1}});t.resetBuild();a.deBuffs=[status('slow'),status('sticky'),status('slow')];assert.equal(normal(a,t),90.91);
 a.deBuffs=[];t.deBuffs=[status('slow')];assert.equal(normal(a,t),100);
 assert.equal(t.getSourcesForBuff('weakeningpotency').cursed_bark.inatePotency,.5);assert.equal(t.getSourcesForBuff('shatterpotency').cursed_bark.inatePotency,.2);
});
test('Dark One preserves fractional per-debuff damage without counting duplicates',()=>{
 const[a,t]=pair({dark_one:1.3});a.deBuffs=[status('slow'),status('sticky'),status('slow')];assert.equal(normal(a,t),117.32);a.deBuffs=[];assert.equal(normal(a,t),100);
});
test('Bellowing Ember uses its inclusive HP threshold and Fire upgrades the entire hybrid packet',()=>{
 const[a,t]=pair({bellowing_ember:1});a.maxHp=100;a.hp=45;assert.equal(normal(a,t),110);a.damageTypes={Fire:.5,Physical:.5};assert.equal(normal(a,t),123);
 a.hp=45.01;assert.equal(normal(a,t),100);a.perks.bellowing_ember=2.5;a.hp=52.5;assert.equal(normal(a,t),157.5);
 a.maxHp=0;assert.equal(normal(a,t),100);
});
test('Marsh Flow requires Regen and retains a fixed innate Regen potency',()=>{
 const[a,t]=pair({marsh_flow:2.5});assert.equal(normal(a,t),100);a.buff=[status('regen')];assert.equal(normal(a,t),150);assert.equal(a.getSourcesForBuff('regenpotency').marsh_flow.inatePotency,1);
});
test('Smoldering needs self Burn and does not activate from target Burn',()=>{
 const[a,t]=pair({smoldering:1.3});t.deBuffs=[status('burn')];assert.equal(normal(a,t),100);a.deBuffs=[status('burn')];assert.equal(normal(a,t),126);
});
test('Gelid Lance increases damage against existing Bleed without adding undocumented potency',()=>{
 const[a,t]=pair({gelid_lance:1.5});t.deBuffs=[status('bleed')];assert.equal(normal(a,t),115);assert.equal(a.potencies.bleedpotency,undefined);t.deBuffs=[];assert.equal(normal(a,t),100);
});
test('Dragon Breath conditional damage activates from selected target Burn',()=>{
 const[a,t]=pair({dragon_breath:2});t.deBuffs=[status('burn')];assert.equal(normal(a,t),120);t.deBuffs=[];assert.equal(normal(a,t),100);
});
test('Venom Spitter scales damage against Poison and innate Poison potency separately',()=>{
 const[a,t]=pair({venom_spitter:2.5});t.deBuffs=[status('poison')];assert.equal(normal(a,t),125);assert.equal(a.getSourcesForBuff('poisonpotency').venom_spitter.inatePotency,.25);
});
test('Sticky Swings bonus is separate from the target Sticky Magic vulnerability',()=>{
 const[a,t]=pair({sticky_swings:2});t.deBuffs=[status('sticky')];assert.equal(normal(a,t),130);a.damageTypes={Magic:1};assert.equal(normal(a,t),156);
});
test('Explosive Honey uses the fixed documented Sticky damage bonus',()=>{
 const[a,t]=pair({explosive_honey:1});t.deBuffs=[status('sticky')];assert.equal(normal(a,t),110);a.perks.explosive_honey=3;assert.equal(normal(a,t),110);
});
test('Undead Might increases Rune and Weapon Art damage but not Weapon or status damage',()=>{
 const[a,t]=pair({undead_might:1});for(const sourceType of ['Rune','WeaponArt'])assert.equal(normal(a,t,{sourceType}),125);
 for(const sourceType of ['Weapon','Status'])assert.equal(normal(a,t,{sourceType}),100);
});
test('Toxin Caster requires a Magic component and skill source, using additive Poison Potency points',()=>{
 const[a,t]=pair({toxin_caster:1.5},{},{poisonpotency:2});a.damageTypes={Magic:.5,Physical:.5};assert.equal(normal(a,t,{sourceType:'Rune'}),115);
 assert.equal(normal(a,t,{sourceType:'WeaponArt'}),115);assert.equal(normal(a,t),100);
 a.damageTypes={Fire:1};assert.equal(normal(a,t,{sourceType:'Rune'}),100);assert.equal(a.getSourcesForBuff('poisonpotency').toxin_caster,undefined);
});
test('Raging Bounce uses selected effective potency including a zero override',()=>{
 const[a,t]=pair({raging_bounce:2});assert.equal(normal(a,t),100);a.buff=[status('bounce',.5)];assert.equal(normal(a,t),170);
 a.buff[0].effectivePotencyOverride=0;assert.equal(normal(a,t),100);
});
test('Poison Acceleration adds static Attack Speed only while self Poison is selected',()=>{
 const a=actor({poison_acceleration:1.3});assert.equal(a.stats.AttackSpeed,undefined);a.deBuffs=[status('poison')];a.resetBuild();assert.equal(a.stats.AttackSpeed,26);a.resetBuild();assert.equal(a.stats.AttackSpeed,26);
 a.deBuffs=[];a.resetBuild();assert.equal(a.stats.AttackSpeed,undefined);
});
test('Ice Barge grants diminishing-return damage reduction for Slow, not Sticky',()=>{
 const[a,t]=pair();t.mainArmor.helmet=new Item({id:'test',perks:{ice_barge:2}});t.resetBuild();t.deBuffs=[status('slow')];assert.equal(normal(a,t),76.92);
 t.deBuffs=[status('sticky')];assert.equal(normal(a,t),100);
});
test('Cleave grants fixed damage against Shatter and a fixed 0.1 innate source',()=>{
 const[a,t]=pair({cleave:3});t.deBuffs=[status('shatter',0)];assert.equal(normal(a,t),120);assert.equal(a.getSourcesForBuff('shatterpotency').cleave.inatePotency,.1);t.deBuffs=[];assert.equal(normal(a,t),100);
});
test('Valor adds its documented per-perk damage only against Taunt',()=>{
 const[a,t]=pair({valor:3});assert.equal(normal(a,t),100);t.deBuffs=[status('taunt')];assert.equal(normal(a,t),119.98);
});
test('Warding Tides selected source drives actual Reinforce damage reduction',()=>{
 const[a,t]=pair({warding_tides:1.3});const b=fromSource(t,a,'reinforce','warding_tides');b.appliedBy='opponent';t.buff=[b];assert.equal(normal(a,t),79.37);
});
test('Weakening scales its innate source and shared Weakness uses the real applicant additive potency',()=>{
 const[a,t]=pair({weakening:2},{},{weakeningpotency:1});t.deBuffs=[fromSource(t,a,'weakness','weakening')];assert.equal(t.deBuffs[0].sourceData.sourceInatePotency,.4);assert.equal(normal(t,a),66.67);
});
test('Poisonous source affects the shared Poison DoT without adding global Poison potency',()=>{
 const[a,t]=pair({poisonous:2.5});const b=fromSource(t,a,'poison','poisonous');t.deBuffs=[b];assert.equal(b.sourceData.sourceInatePotency,.75);assert.equal(resolveStatusDamage(b,t).total.normal,1.75);assert.equal(a.potencies.poisonpotency,undefined);
});
test('Wrathful Crits selected Rage source increases eligible damage with fractional amounts',()=>{
 const[a,t]=pair({wrathful_crits:2.5});a.buff=[fromSource(a,a,'rage','wrathful_crits')];assert.equal(normal(a,t),125);
});
test('Iron Bounce sources drive Bounce and Reinforce through existing status formulas',()=>{
 const[a,t]=pair({iron_bounce:1.5,raging_bounce:2});a.buff=[fromSource(a,a,'bounce','iron_bounce')];assert.equal(normal(a,t),163);
 const b=fromSource(t,a,'reinforce','iron_bounce');b.appliedBy='opponent';t.buff=[b];assert.equal(normal(a,t),125.38);
});

test('conversion and dependent-stat phases are deterministic regardless of equipment insertion order',()=>{
 function build(reverse){const b=new Build();b.level=0;const items=[['helmet',new Item({id:'one',stats:{PhysicalBoost:100,MagicBoost:100,AirBoost:100},perks:{brawny:1,strong_tides:1,weight_distribution:1}})],['chestplate',new Item({id:'two',perks:{whirl_foot:1,quick_witted:1,swift_guard:1,engine:1}})]];for(const[k,v]of reverse?items.reverse():items)b.mainArmor[k]=v;b.resetBuild();return b;}
 const a=build(false),b=build(true);assert.deepEqual(a.stats,b.stats);
 // Strong Tides adds 10 Water, Brawny transfers 42, distribution gives 78.1, Air becomes 80.
 assert.equal(a.stats.WaterBoost,8);assert.equal(a.stats.PhysicalBoost,78.1);assert.equal(a.stats.SpeedBoost,4);assert.equal(a.stats.DexterityBoost,79.1);assert.equal(a.stats.PhysicalDefense,7.91);assert.equal(a.stats.AttackSpeed,1);
 a.resetBuild();assert.deepEqual(a.stats,b.stats);
});
test('Ork, Immovable, Carapace, Frozen Heart, and Extra Layers combine without feeding back',()=>{
 const b=actor({immoveable:1,frozen_heart:1,carapace:1,extra_layers:1},{ColdResistance:100,EarthBoost:100});b.race=RaceStore.getByID('ork');b.buff=[status('rage'),status('protection_shield_active')];b.resetBuild();
 assert.equal(b.stats.Tenacity,.3);near(b.stats.PhysicalDefense,13.4444);assert.equal(b.stats.Protection,6);near(b.stats.Warding,5.3333);
 const snapshot=JSON.stringify(b.stats);for(let i=0;i<5;i++)b.resetBuild();assert.equal(JSON.stringify(b.stats),snapshot);
});
test('Tailwind potency contributes to Engine using its applicant and manual override',()=>{
 const[a,t]=pair({engine:2},{},{tailwindpotency:1});t.mainArmor.helmet=new Item({id:'test',potencies:{tailwindpotency:4}});t.resetBuild();
 const tail=status('tailwind');tail.setSourceData('manual','Default',.2);tail.appliedBy='opponent';a.buff=[tail];a.resetBuild();assert.equal(a.stats.AttackSpeed,36);
 tail.effectivePotencyOverride=.1;a.resetBuild();assert.equal(a.stats.AttackSpeed,6);
});
test('new Attack Speed contributions add before Kitsune flat speed without creating an unequipped weapon',()=>{
 const a=actor({engine:1,poison_acceleration:1},{SpeedBoost:100});a.race=RaceStore.getByID('kitsune');a.deBuffs=[status('poison')];a.resetBuild();assert.equal(a.weapon.attackSpeed,0);
 a.blade=new Item({id:'blade',type:'Small Blade',attackSpeed:1.5});a.handle=new Item({id:'handle',type:'Small Handle',attackSpeed:1.5});a.resetBuild();assert.equal(a.stats.AttackSpeed,47.5);assert.equal(a.weapon.attackSpeed,2.075);
});
test('new target-status bonuses respect Blood Thirsty consumption across a multi-hit packet',()=>{
 const[a,t]=pair({blood_thirsty:1,curse_rip:1,gelid_lance:1});t.deBuffs=[status('bleed'),status('sticky')];a.buff=[status('blood_thirsty_proc')];
 const r=run(a,t,{hitAmount:2});assert.equal(r.total.normal,231);assert.equal(r.statusConsumptions.length,1);assert.equal(t.deBuffs.length,2);
});
test('new Poison bonus respects explicit Venom Eater after/before ordering',()=>{
 const[a,t]=pair({venom_eater:1,venom_spitter:1});t.deBuffs=[status('poison')];a.buff=[status('venom_eater_proc')];assert.equal(run(a,t).total.crit,157.3);
 a.buff[0].consumptionTiming='before';assert.equal(run(a,t).total.crit,143);
});
test('conditional bonuses combine multiplicatively and received statuses keep their own applicant',()=>{
 const[a,t]=pair({marsh_flow:1,smoldering:1,gelid_lance:1,dragon_breath:1,venom_spitter:1,sticky_swings:1,cleave:1,valor:1});
 a.buff=[status('regen')];a.deBuffs=[status('burn')];t.deBuffs=[status('bleed'),status('burn'),status('poison'),status('sticky'),status('shatter',0),status('taunt')];
 near(normal(a,t),Math.round(100*1.2*1.2*1.1*1.1*1.1*1.15*1.2*1.0666*100)/100,.001);
});
test('Cursed modifies scalable new effects once while fixed source potencies stay fixed',()=>{
 const a=actor({cursed:1,weakening:2,wrathful_crits:1,cleave:1,engine:1},{SpeedBoost:100});assert.equal(a.perks.weakening,2.2);
 assert.equal(a.getSourcesForBuff('weakeningpotency').weakening.inatePotency,.44);assert.equal(a.getSourcesForBuff('ragepotency').wrathful_crits.inatePotency,.11);
 assert.equal(a.getSourcesForBuff('shatterpotency').cleave.inatePotency,.1);assert.equal(a.stats.AttackSpeed,27.5);a.resetBuild();assert.equal(a.stats.AttackSpeed,27.5);
});
test('source choices do not expose unequipped, zero, negative, or non-finite perk amounts',()=>{
 const a=actor();for(const amount of [0,-1,NaN,Infinity]){a.perks={weakening:amount};assert.deepEqual(a.getSourcesForBuff('weakeningpotency'),{});}
});
test('manually selected new status sources and shield state survive save/reload as snapshots',()=>{
 const a=actor({iron_bounce:1.5,wrathful_crits:2});a.buff=[fromSource(a,a,'bounce','iron_bounce'),fromSource(a,a,'rage','wrathful_crits'),status('protection_shield_active')];
 const saved=a.toSavedBuild(),b=Build.dictToBuild(saved);assert.equal(b.buff[0].sourceData.sourceInatePotency,.45);assert.equal(b.buff[1].sourceData.sourceInatePotency,.2);assert.equal(b.buff[2].countsAsBuff,false);
 // Saved source potency describes the selected application; recalculation does not rewrite history.
 assert.deepEqual(b.toSavedBuild().buffs,saved.buffs);
});
test('all forty reviewed definitions have explicit supported scope, sources, and executable behavior',()=>{
 assert.equal(ids.length,40);assert.equal(new Set(ids).size,40);
 for(const id of ids){const p=PerkStore.getByID(id);assert.ok(p.source.cardId,id);assert.notEqual(getPerkSupport(p).status,'Unsupported',id);assert.ok(p.support.details.length>35,id);assert.ok(Object.values(p).some(v=>typeof v==='function')||p.sourcepotencies,id);}
});
test('all forty effects together remain finite, deterministic, and leave equipment/status inputs untouched',()=>{
 const all=Object.fromEntries(ids.map(id=>[id,1.3]));const[a,t]=pair(all,{PhysicalBoost:50,DexterityBoost:40,AirBoost:100,EarthBoost:60,MagicBoost:70,HexBoost:10,HolyBoost:30,ColdResistance:100,SpeedBoost:-20,Tenacity:.3,JumpBoost:5},{poisonpotency:2});
 a.buff=[status('rage',.3),status('bounce',.2),status('tailwind',.2),status('regen'),status('protection_shield_active')];a.deBuffs=[status('burn'),status('poison'),status('slow')];t.deBuffs=[status('burn'),status('poison'),status('bleed'),status('sticky'),status('taunt'),status('shatter',.2)];a.resetBuild();a.damageTypes={Physical:.5,Magic:.5};
 const before=JSON.stringify([a.toSavedBuild(),t.toSavedBuild(),a.stats]);const r=run(a,t,{sourceType:'Rune',hitAmount:3});assert.ok(Number.isFinite(r.total.normal));assert.deepEqual(run(a,t,{sourceType:'Rune',hitAmount:3}),r);assert.equal(JSON.stringify([a.toSavedBuild(),t.toSavedBuild(),a.stats]),before);
 for(const value of Object.values(a.stats))assert.ok(Number.isFinite(value));
});

test('real Dragon Blooded loadout combines Frozen Heart, Whirl Foot, Engine, and Weakening across saves',()=>{
 const a=new Build();a.level=0;a.race=RaceStore.getByID('dragon');
 for(const[slot,id]of [['helmet','scow_marauder_helmet'],['chestplate','revved_chestplate'],['legging','whirlray_dancer_pants'],['ring','hex_ring']])a.mainArmor[slot]=ItemStore.getByID(id,slot);
 a.resetBuild();assert.equal(a.stats.ColdResistance,250);assert.equal(a.stats.Warding,81.111);assert.equal(a.stats.PhysicalDefense,16.111);assert.equal(a.stats.SpeedBoost,15.85);assert.equal(a.stats.AttackSpeed,3.9625);
 a.buff=[fromSource(a,a,'tailwind','whirl_foot')];a.resetBuild();assert.equal(a.stats.AttackSpeed,6.9625);assert.equal(a.getSourcesForBuff('weakeningpotency').weakening.inatePotency,.2);
 const b=Build.dictToBuild(a.toSavedBuild());assert.deepEqual(b.stats,a.stats);assert.deepEqual(b.buff[0].sourceData,a.buff[0].sourceData);b.resetBuild();assert.deepEqual(b.stats,a.stats);
});
test('real Enchained Handle uses Weight Distribution and preserves cached equipment stats',()=>{
 const b=actor();b.mainArmor.helmet=ItemStore.getByID('revved_helmet','helmet');b.handle=ItemStore.getByID('enchained_handle','handle');
 const before=JSON.stringify([b.handle.stats,b.mainArmor.helmet.stats]);b.resetBuild();const sum=(b.handle.stats.PhysicalBoost||0)+(b.mainArmor.helmet.stats.PhysicalBoost||0)+(b.handle.stats.DexterityBoost||0)+(b.mainArmor.helmet.stats.DexterityBoost||0);
 near(b.stats.PhysicalBoost,sum/2*1.1);near(b.stats.DexterityBoost,sum/2*1.1);b.resetBuild();assert.equal(JSON.stringify([b.handle.stats,b.mainArmor.helmet.stats]),before);
 const restored=Build.dictToBuild(b.toSavedBuild());assert.deepEqual(restored.stats,b.stats);
});
test('Carapace and Ice Barge reductions combine with Reinforce for incoming status damage',()=>{
 const[a,t]=pair();t.mainArmor.helmet=new Item({id:'test',perks:{carapace:1,ice_barge:1}});t.resetBuild();t.buff=[status('protection_shield_active'),status('reinforce',.5)];t.deBuffs=[status('slow')];
 const poison=status('poison');poison.setSourceData('manual','Default',0);t.deBuffs.push(poison);
 assert.equal(resolveStatusDamage(poison,t).total.normal,.5);assert.equal(normal(a,t),50.41);
});
test('zero and negative quantities do not enable any of the forty new calculation paths',()=>{
 for(const amount of [0,-1]){const a=actor(Object.fromEntries(ids.map(id=>[id,amount])),{SpeedBoost:100,JumpBoost:5,ColdResistance:100});
 const t=actor();a.buff=[status('regen'),status('rage'),status('bounce',.5),status('tailwind',.5)];a.deBuffs=[status('slow'),status('poison'),status('burn')];t.deBuffs=[status('sticky'),status('bleed'),status('burn'),status('poison'),status('shatter',0),status('taunt')];a.resetBuild();a.damageTypes={Physical:1};
 assert.equal(a.stats.AttackSpeed,undefined);assert.equal(a.stats.PhysicalDefense,undefined);assert.equal(normal(a,t,{sourceType:'Rune'}),100);assert.deepEqual(a.getSourcesForBuff('reinforcepotency'),{});}
});
