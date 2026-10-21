const test=require('node:test'),assert=require('node:assert/strict');
const {Build}=require('../src/models/Build.ts');
const {Item,ItemStore}=require('../src/models/Item.ts');
const {BuffStore}=require('../src/models/Buffs.ts');
const {RaceStore}=require('../src/models/Race.ts');
const {PerkStore,getPerkSupport,getSortedPerkEventEntries}=require('../src/models/Perk.ts');
const {resolveDamage,resolveStatusDamage,getActivePerkOutputPreview}=require('../src/models/Combat.ts');
const {lighting,mount,disposition}=require('../src/models/Conditions.ts');
const ids=['rocky_body','lucky','star_barrage','flash_strike','blood_lust','inspiration','grounded_despair','quickdraw','energize','civilian','frequent_flier','rider','mounted_defense','vampire','photosynthesis','concealed_edge','channeled_weapon','dark_magic','void_rage','toxin_transfer','emotional','spirit_winds','wind_walker','mycotic_bloom','kindling','seismic_momentum','caster','runic_winds','spring_step','sacred_grounds','shielding_gong','queen_s_guard','bastion_bless','beastial_rage','erosion','cryo_engine','fragrance_aura','toadzerker_spirit','croakernaut_spirit','woof_spirit'];
function actor(perks={},stats={},potencies={}){const b=new Build();b.level=0;b.mainArmor.helmet=new Item({id:'test',perks,stats,potencies});b.resetBuild();b.damageTypes={Physical:1};return b;}
function pair(perks={},stats={},potencies={}){const a=actor(perks,stats,potencies),t=actor();a.target=t;t.target=a;return[a,t];}
function status(id,potency){const b=BuffStore.getByID(id);if(potency!==undefined)b.effectivePotencyOverride=potency;return b;}
function sourced(applicant,id,perk){const b=status(id),s=applicant.getSourcesForBuff(b.potencyId)[perk];assert.ok(s,`${perk} source for ${id}`);b.setSourceData(perk,s.type,s.inatePotency);return b;}
function run(a,t,extra={}){return resolveDamage({damage:100,hitAmount:1,source:'test',sourceType:'Weapon',sourceDamageType:'M1',...extra},a,t);}
function normal(a,t,extra){return run(a,t,extra).total.normal;}
function source(a,potency,perk){return a.getSourcesForBuff(potency)[perk].inatePotency;}
function cd(a,base=60,type='Rune',id){return a.getCooldownPreview(base,type,id)?.value;}
const near=(actual,expected,tol=.00011)=>assert.ok(Math.abs(actual-expected)<tol,`${actual} != ${expected}`);

test('Rocky Body scales Physical Defense using the documented probable coefficient',()=>{
 const a=actor({rocky_body:1.3},{EarthBoost:80});assert.equal(a.stats.PhysicalDefense,52);assert.equal(getPerkSupport(PerkStore.getByID('rocky_body')).status,'Partial');
});
test('Lucky adds fractional negative stats before Righted Wrongs can read them',()=>{
 const a=actor({lucky:2,righted_wrongs:1});assert.equal(a.stats.Warding,-50);assert.equal(a.stats.Protection,-12);assert.equal(a.stats.Tenacity,-.2);assert.equal(a.stats.DexterityBoost,4.8114);assert.equal(a.stats.SpeedBoost,.4811);
 a.resetBuild();assert.equal(a.stats.DexterityBoost,4.8114);
});
test('Star Barrage requires its selected self-buff and adds the fixed base plus per-perk speed',()=>{
 const a=actor({star_barrage:1.3});assert.equal(a.stats.AttackSpeed,undefined);a.buff=[status('star_barrage')];a.resetBuild();assert.equal(a.stats.AttackSpeed,52.5);a.buff=[];a.resetBuild();assert.equal(a.stats.AttackSpeed,undefined);
});
test('Flash Strike selected after a parry adds Attack Speed without automatic timing',()=>{
 const a=actor({flash_strike:1.3});a.buff=[status('flash_strike')];a.resetBuild();assert.equal(a.stats.AttackSpeed,97.5);
});
test('Blood Lust starts at zero and reads manually selected charge potency without multiplying it again',()=>{
 const a=actor({blood_lust:2});a.buff=[sourced(a,'blood_lust','blood_lust')];a.resetBuild();assert.equal(a.stats.AttackSpeed,undefined);
 a.buff[0].effectivePotencyOverride=2.5;a.resetBuild();assert.equal(a.stats.AttackSpeed,50);a.buff[0].effectivePotencyOverride=.3;a.resetBuild();assert.equal(a.stats.AttackSpeed,6);
});
test('Inspiration adds damage while Inspired is selected and requires the equipped perk',()=>{
 const[a,t]=pair({inspiration:2});a.buff=[status('inspired')];assert.equal(normal(a,t),115);a.perks={};assert.equal(normal(a,t),100);
});
test('Grounded Despair source drives the shared Despair damage effect with self ownership',()=>{
 const[a,t]=pair({grounded_despair:2});const d=sourced(a,'despair','grounded_despair');d.appliedBy='self';a.deBuffs=[d];assert.equal(normal(a,t),117);d.effectivePotencyOverride=.5;assert.equal(normal(a,t),142.5);
});
test('Quickdraw is neutral and confines its damage bonus to Rune and Weapon Art packets',()=>{
 const[a,t]=pair({quickdraw:2});a.buff=[status('quickdraw')];assert.equal(a.buff[0].countsAsBuff,false);assert.equal(normal(a,t,{sourceType:'Rune'}),160);assert.equal(normal(a,t,{sourceType:'WeaponArt'}),160);assert.equal(normal(a,t),100);
});
test('Energize Charged boosts a Weapon Art packet without changing unrelated attacks',()=>{
 const[a,t]=pair({energize:1.3});a.buff=[status('energize_charged')];assert.equal(normal(a,t,{sourceType:'WeaponArt'}),165);assert.equal(normal(a,t,{sourceType:'Rune'}),100);assert.equal(normal(a,t),100);
});
test('Civilian Ready boosts only Rune damage and remains inactive when unselected',()=>{
 const[a,t]=pair({civilian:1.5});assert.equal(normal(a,t,{sourceType:'Rune'}),100);a.buff=[status('civilian_ready')];assert.equal(normal(a,t,{sourceType:'Rune'}),160);assert.equal(normal(a,t,{sourceType:'WeaponArt'}),100);
});
test('Frequent Flier allows the airborne and mounted conditions together',()=>{
 const[a,t]=pair({frequent_flier:2});a.buff=[status('scenario_airborne'),status('scenario_mounted')];assert.equal(normal(a,t),140);a.buff=[status('scenario_mounted')];assert.equal(normal(a,t),100);
});
test('Rider works for either documented mount condition and not an unselected mount',()=>{
 const[a,t]=pair({rider:1.3});for(const id of ['scenario_mounted','scenario_glacial_snapper']){a.buff=[status(id)];assert.equal(normal(a,t),126);}a.buff=[];assert.equal(normal(a,t),100);
});
test('Mounted Defense applies only on Glacial Snapper with diminishing returns',()=>{
 const[a,t]=pair();t.perks={mounted_defense:2};t.buff=[status('scenario_mounted')];assert.equal(normal(a,t),100);t.buff=[status('scenario_glacial_snapper')];assert.equal(normal(a,t),71.43);
});
test('Vampire uses explicit sunlight/shadow conditions and unknown lighting grants neither bonus',()=>{
 const[a,t]=pair({vampire:1});assert.equal(normal(a,t),100);a.buff=[status('scenario_shadow')];assert.equal(normal(a,t),106.66);assert.equal(normal(t,a),96.78);
 a.buff=[status('scenario_sunlight')];assert.equal(normal(a,t),103.33);assert.equal(normal(t,a),100);
 a.buff=[status('scenario_shadow'),status('scenario_sunlight')];assert.equal(normal(a,t),100);
});
test('Photosynthesis only boosts Holy/Earth portions in sunlight',()=>{
 const[a,t]=pair({photosynthesis:2});a.buff=[status('scenario_sunlight')];a.damageTypes={Holy:.25,Earth:.25,Fire:.5};const r=run(a,t);assert.equal(r.outputs.Holy.normal,35);assert.equal(r.outputs.Earth.normal,35);assert.equal(r.outputs.Fire.normal,50);assert.equal(r.total.normal,120);
 a.buff=[status('scenario_shadow')];assert.equal(normal(a,t),100);
});
test('Concealed Edge adds shadow Hex output to hits and actual DoTs without mutating saved profiles',()=>{
 const[a,t]=pair({concealed_edge:2});a.buff=[status('scenario_shadow')];assert.equal(normal(a,t),150);assert.deepEqual(a.damageTypes,{Physical:1});
 const burn=status('burn');burn.setSourceData('manual','Default',0);t.deBuffs=[burn];const r=resolveStatusDamage(burn,t);assert.equal(r.total.normal,1.5);assert.equal(r.outputs.Hex.normal,.5);
});
test('Channeled Weapon adds Magic to direct attacks and uses a direct Weapon Art cooldown multiplier',()=>{
 const[a,t]=pair({channeled_weapon:2});const r=run(a,t);assert.equal(r.outputs.Magic.normal,10);assert.equal(r.total.normal,110);assert.equal(cd(a,60,'WeaponArt'),42);assert.equal(cd(a),60);assert.equal(normal(a,t,{sourceType:'Status'}),100);
});
test('Dark Magic requires Magic before Spirit Winds conversion and excludes DoT packets',()=>{
 const[a,t]=pair({dark_magic:2});assert.equal(normal(a,t),100);a.damageTypes={Magic:1};const r=run(a,t);assert.equal(r.outputs.Hex.normal,40);assert.equal(r.total.normal,140);assert.equal(normal(a,t,{sourceType:'Status'}),100);
});
test('Void Rage adds a potency-independent Hex component while keeping Rage as one buff',()=>{
 const[a,t]=pair({void_rage:2});a.buff=[status('rage',0)];assert.equal(normal(a,t),120);a.damageTypes={Fire:1};assert.equal(normal(a,t,{sourceType:'Status'}),120);a.buff=[];assert.equal(normal(a,t),100);
});
test('Toxin Transfer requires self Poison and a proc-capable direct hit without consuming it',()=>{
 const[a,t]=pair({toxin_transfer:2});a.deBuffs=[status('poison')];assert.equal(normal(a,t),110);assert.equal(normal(a,t,{procCoefficient:0}),100);assert.equal(normal(a,t,{sourceType:'Status'}),100);assert.equal(a.deBuffs.length,1);assert.equal(t.deBuffs,undefined);
});
test('Emotional distinguishes real buffs, debuffs, mixed states, and neutral controls',()=>{
 const[a,t]=pair({emotional:1});a.buff=[status('rage',0),status('scenario_airborne')];a.resetBuild();a.damageTypes={Physical:1};assert.equal(normal(a,t,{sourceType:'WeaponArt'}),120);assert.equal(cd(a,60,'WeaponArt'),40);
 a.buff=[status('quickdraw'),status('scenario_sunlight')];a.deBuffs=[status('slow')];a.resetBuild();a.damageTypes={Physical:1};assert.equal(a.stats.AttackSpeed,20);assert.equal(normal(a,t),120);assert.equal(cd(a,60,'WeaponArt'),60);
 a.buff.push(status('regen'));a.resetBuild();a.damageTypes={Physical:1};assert.equal(a.stats.AttackSpeed,undefined);assert.equal(normal(a,t,{sourceType:'WeaponArt'}),100);assert.equal(cd(a,60,'WeaponArt'),60);
});
test('Spirit Winds converts Air without creating output and gives the documented potency damage bonus',()=>{
 const[a,t]=pair({spirit_winds:2});a.damageTypes={Air:1};a.buff=[status('tailwind',.2)];const r=run(a,t);assert.equal(r.outputs.Air.normal,106.67);assert.equal(r.outputs.Magic.normal,26.67);assert.equal(r.total.normal,133.33);assert.deepEqual(a.damageTypes,{Air:1});
 a.perks.spirit_winds=20;const high=run(a,t);assert.equal(high.outputs.Air,undefined);assert.ok(high.outputs.Magic.normal>0);
});
test('Wind Walker adds Weapon Art Air and penetration without scaling from Tailwind potency',()=>{
 const[a,t]=pair({wind_walker:2});a.damageTypes={True:1};a.buff=[status('tailwind',0)];assert.equal(normal(a,t,{sourceType:'WeaponArt'}),136);assert.equal(normal(a,t,{sourceType:'Rune'}),100);assert.equal(normal(a,t),100);
 a.damageTypes={Physical:1};t.stats.PhysicalDefense=20;const r=run(a,t,{sourceType:'WeaponArt'});assert.equal(r.outputs.Physical.normal,100);assert.equal(r.outputs.Air.normal,36);
});
test('Mycotic Bloom only boosts applicant Poison ticks strictly below half target HP',()=>{
 const[a,t]=pair({mycotic_bloom:2});const poison=status('poison');poison.setSourceData('manual','Default',0);t.deBuffs=[poison];t.maxHp=100;t.hp=49;assert.equal(resolveStatusDamage(poison,t).total.normal,1.5);
 t.hp=50;assert.equal(resolveStatusDamage(poison,t).total.normal,1);t.hp=75;assert.equal(resolveStatusDamage(poison,t).total.normal,1);t.hp=49;assert.equal(normal(a,t),100);assert.equal(t.deBuffs.length,1);
});
test('Kindling changes actual Burn damage rather than additive potency or ordinary Fire hits',()=>{
 const[a,t]=pair({kindling:2});const burn=status('burn');burn.setSourceData('manual','Default',0);t.deBuffs=[burn];assert.equal(resolveStatusDamage(burn,t).total.normal,2);assert.equal(a.potencies.burnpotency,undefined);
 a.damageTypes={Fire:1};assert.equal(normal(a,t),100);assert.equal(normal(a,t,{sourceType:'Status',source:'poison'}),100);
});
test('Seismic Momentum replaces only default Dexterity chance and adds Earth-based chance and damage',()=>{
 const[a,t]=pair({seismic_momentum:2},{EarthBoost:100,DexterityBoost:100});const r=run(a,t);assert.equal(r.modifiers.crit_mods['Crit Rate'],.15);assert.equal(r.modifiers.crit_mods['Dexterity chance'],0);assert.equal(r.modifiers.crit_mods['Dexterity damage'],.1);assert.equal(r.total.crit,175);assert.equal(r.total.average,111.25);
 assert.equal(run(a,t,{canCrit:false}).total.crit,100);
});
test('Caster divides both Rune and Weapon Art cooldown by its diminishing-return rate',()=>{
 const a=actor({caster:2});assert.equal(cd(a,60,'Rune'),46.1538);assert.equal(cd(a,60,'WeaponArt'),46.1538);
});
test('Runic Winds source and Rune cooldown require selected Tailwind independently of potency',()=>{
 const a=actor({runic_winds:2});assert.equal(source(a,'tailwindpotency','runic_winds'),.2);assert.equal(cd(a),60);a.buff=[status('tailwind',0)];assert.equal(cd(a),50);assert.equal(cd(a,60,'WeaponArt'),60);
});
test('Spring Step offers the documented fractional Bounce source',()=>{const a=actor({spring_step:1.3});assert.equal(source(a,'bouncepotency','spring_step'),.26);});
test('Sacred Grounds Reinforce source feeds real incoming damage reduction',()=>{const[a,t]=pair({sacred_grounds:2});const r=sourced(a,'reinforce','sacred_grounds');r.appliedBy='opponent';t.buff=[r];assert.equal(normal(a,t),71.43);});
test('Shielding Gong offers perk-scaled Reinforce after manually selected activation',()=>{const a=actor({shielding_gong:1.3});assert.equal(source(a,'reinforcepotency','shielding_gong'),.13);});
test('Queens Guard includes its fixed Reinforce base plus fractional perk scaling',()=>{const a=actor({queen_s_guard:1.3});assert.equal(source(a,'reinforcepotency','queen_s_guard'),.63);});
test('Bastion Bless scales real applied buff potency, uses applicant, and preserves final manual overrides',()=>{
 const[a,t]=pair({bastion_bless:2},{},{reinforcepotency:1});const r=sourced(a,'reinforce','bastion_bless');r.appliedBy='opponent';t.buff=[r];near(r.getEffectivePotency(a),7.2);assert.equal(normal(a,t),58.14);
 t.perks.bastion_bless=20;assert.equal(normal(a,t),58.14);r.effectivePotencyOverride=.4;assert.equal(normal(a,t),71.43);
 const weakness=status('weakness');weakness.setSourceData('test','Default',.5);assert.equal(weakness.getEffectivePotency(a),5);
});
test('Beastial Rage offers 0.3 innate Rage per perk without automatically healing or cleansing',()=>{const a=actor({beastial_rage:1.3});assert.equal(source(a,'ragepotency','beastial_rage'),.39);assert.equal(a.buff,undefined);});
test('Erosion retains its fixed Shatter base at fractional perk amount',()=>{const a=actor({erosion:1.3});assert.equal(source(a,'shatterpotency','erosion'),.23);});
test('Cryo Engine Tailwind source and existing Frostbite vulnerability stay separate',()=>{
 const[a,t]=pair({cryo_engine:1.3});assert.equal(source(a,'tailwindpotency','cryo_engine'),.33);t.deBuffs=[status('frostbite')];a.damageTypes={Water:1};assert.equal(normal(a,t),110);a.damageTypes={Fire:1};assert.equal(normal(a,t),100);
});
test('Fragrance Aura offers the documented Regen source without automatically applying Poison',()=>{const[a,t]=pair({fragrance_aura:1.3});assert.equal(source(a,'regenpotency','fragrance_aura'),.26);assert.equal(t.deBuffs,undefined);});
test('Toadzerker Spirit has fixed Bounce and Rage sources even with fractional perk amounts',()=>{const a=actor({toadzerker_spirit:3.5});assert.equal(source(a,'bouncepotency','toadzerker_spirit'),.2);assert.equal(source(a,'ragepotency','toadzerker_spirit'),.2);});
test('Croakernaut Spirit has fixed 0.5 Reinforce source',()=>{const a=actor({croakernaut_spirit:3.5});assert.equal(source(a,'reinforcepotency','croakernaut_spirit'),.5);});
test('Woof Spirit fixed Weakness source uses shared diminishing-return damage math',()=>{const[a,t]=pair({woof_spirit:3.5});t.deBuffs=[sourced(a,'weakness','woof_spirit')];assert.equal(normal(t,a),66.67);});

test('new lighting and mount choices replace their conflicting conditions when added through the builder',()=>{
 const a=actor();a.addBuffToBuild(status('scenario_shadow'));a.addBuffToBuild(status('scenario_sunlight'));assert.equal(lighting(a),'sunlight');assert.equal(a.buff.length,1);
 a.addBuffToBuild(status('scenario_mounted'));a.addBuffToBuild(status('scenario_glacial_snapper'));assert.equal(mount(a),'glacial_snapper');assert.equal(a.buff.length,2);
});
test('scenario and neutral controls do not count toward Ork Tenacity or Emotional buffs-only state',()=>{
 const a=actor({emotional:1});a.race=RaceStore.getByID('ork');a.buff=['scenario_sunlight','scenario_airborne','scenario_mounted','civilian_ready','quickdraw','energize_charged','protection_shield_active'].map(id=>status(id));a.resetBuild();assert.equal(a.stats.Tenacity,.2);assert.equal(disposition(a).buffsOnly,false);
 a.buff.push(status('star_barrage'),status('flash_strike'),status('blood_lust'),status('inspired'));a.resetBuild();assert.equal(a.stats.Tenacity,.6);assert.equal(disposition(a).buffsOnly,true);
});
test('output order is independent of perk insertion and Dark Magic cannot activate from Spirit Winds alone',()=>{
 const[a,t]=pair({dark_magic:1,spirit_winds:1});a.damageTypes={Air:1};a.buff=[status('tailwind',0)];const first=run(a,t);assert.equal(first.outputs.Hex,undefined);near(first.outputs.Magic.normal,11.33,.001);
 a.perks={spirit_winds:1,dark_magic:1};assert.deepEqual(run(a,t),first);
 a.perks={spirit_winds:1,dark_magic:1,channeled_weapon:1};const second=run(a,t);assert.equal(second.outputs.Hex.normal,22.67);
 a.perks={channeled_weapon:1,dark_magic:1,spirit_winds:1};assert.deepEqual(run(a,t),second);
});
test('additive Weapon Art Air from Wind Walker is included in the later Spirit Winds conversion',()=>{
 const[a,t]=pair({wind_walker:2,spirit_winds:1});a.buff=[status('tailwind',0)];const r=run(a,t,{sourceType:'WeaponArt'});near(r.outputs.Air.normal,36.72,.001);near(r.outputs.Magic.normal,4.08,.001);
});
test('new output additions allow existing Toxin Caster to recognize a direct Magic component',()=>{
 const[a,t]=pair({channeled_weapon:1,dark_magic:1,toxin_caster:1},{},{poisonpotency:2});const r=run(a,t,{sourceType:'Rune'});assert.equal(r.outputs.Physical.normal,110);assert.equal(r.outputs.Magic.normal,5.5);assert.equal(r.outputs.Hex.normal,22);assert.equal(r.total.normal,137.5);
});
test('Concealed Edge and Void Rage combine on actual Burn while Kindling scales the whole Burn packet',()=>{
 const[a,t]=pair({concealed_edge:1,void_rage:1,kindling:2});a.buff=[status('scenario_shadow'),status('rage',0)];const burn=status('burn');burn.setSourceData('test','Default',0);t.deBuffs=[burn];const r=resolveStatusDamage(burn,t);assert.equal(r.total.normal,2.7);assert.equal(r.outputs.Fire.normal,2);assert.equal(r.outputs.Hex.normal,.7);
});
test('the holder Mycotic Bloom cannot boost another applicants Poison',()=>{
 const[a,t]=pair();t.perks.mycotic_bloom=3;t.maxHp=100;t.hp=20;const poison=status('poison');poison.setSourceData('test','Default',0);t.deBuffs=[poison];assert.equal(resolveStatusDamage(poison,t).total.normal,1);
});
test('Seismic Momentum still stacks other crit sources and Guaranteed Crit',()=>{
 const[a,t]=pair({seismic_momentum:1,flowing_crits:1},{EarthBoost:100,AirBoost:100,DexterityBoost:100});const r=run(a,t);near(r.modifiers.crit_mods['Crit Rate'],.1625);
 a.buff=[status('guaranteed_crit')];assert.equal(run(a,t).modifiers.crit_mods['Crit Rate'],1);
 a.perks.seismic_momentum=0;near(run(a,t).modifiers.crit_mods['Crit Rate'],1);a.buff=[];near(run(a,t).modifiers.crit_mods['Crit Rate'],.1875);
});
test('Bastion Bless boosts Tailwind contribution to Engine, not a final manual override',()=>{
 const a=actor({bastion_bless:2,runic_winds:1,engine:1});a.buff=[sourced(a,'tailwind','runic_winds')];a.resetBuild();assert.equal(a.stats.AttackSpeed,3.6);a.buff[0].effectivePotencyOverride=.1;a.resetBuild();assert.equal(a.stats.AttackSpeed,3);
});
test('Bastion Bless amplifies Blood Lust potency but never changes innate source data',()=>{
 const a=actor({blood_lust:1,bastion_bless:1});const b=sourced(a,'blood_lust','blood_lust');b.sourceData.sourceInatePotency=.5;a.buff=[b];a.resetBuild();assert.equal(a.stats.AttackSpeed,11);assert.equal(b.sourceData.sourceInatePotency,.5);
});
test('Lucky and Ork Tenacity feed Immovable without treating scenario markers as extra buffs',()=>{
 const a=actor({lucky:1,immoveable:1});a.race=RaceStore.getByID('ork');a.buff=[status('scenario_shadow')];a.resetBuild();assert.equal(a.stats.Tenacity,.1);assert.equal(a.stats.PhysicalDefense,3);
});
test('reviewed cooldowns combine summed rates with direct factors and ability-specific restrictions',()=>{
 const a=actor({caster:1,runic_winds:1,mage_rage:1,poison_acceleration:1,gladiatorial_rage:1,voltaic_body:1});a.race=RaceStore.getByID('elf');a.buff=[status('tailwind'),status('rage')];a.deBuffs=[status('poison')];a.resetBuild();
 assert.equal(cd(a,60,'Rune','rage_rune'),13.9355);assert.equal(cd(a,60,'Rune','other'),27.871);assert.equal(cd(a,60,'Rune'),27.871);
 const preview=a.getCooldownPreview(60,'Rune','rage_rune');assert.equal(preview.rates.Caster,.15);assert.equal(preview.factors['Gladiatorial Rage'],.5);assert.equal(preview.factors['Voltaic Body'],1.2);
});
test('High Elf and Channeled Weapon direct factors multiply outside the diminishing-return denominator',()=>{
 const a=actor({caster:1,channeled_weapon:1});a.race=RaceStore.getByID('high_elf');assert.equal(cd(a,60,'WeaponArt'),29.3478);assert.equal(a.getRaceAdjustedCooldown(60,'WeaponArt'),45);
});
test('cooldown preview preserves zero, rejects unknown values, and clamps extreme direct factors',()=>{
 const a=actor({channeled_weapon:20});assert.equal(cd(a,60,'WeaponArt'),0);assert.equal(cd(a,0,'Rune'),0);for(const base of [undefined,NaN,Infinity,-1])assert.equal(a.getCooldownPreview(base,'Rune'),undefined);
});
test('cooldown traces and values remain deterministic when perk insertion order changes',()=>{
 const a=actor({caster:1.3,runic_winds:2,mage_rage:1,channeled_weapon:1});a.buff=[status('tailwind'),status('rage')];const result=a.getCooldownPreview(60,'Rune');a.perks=Object.fromEntries(Object.entries(a.perks).reverse());assert.deepEqual(a.getCooldownPreview(60,'Rune'),result);
});
test('all new source choices scale after Cursed while fixed sources remain unchanged',()=>{
 const a=actor({cursed:1,spring_step:1,sacred_grounds:1,queen_s_guard:1,erosion:1,cryo_engine:1,toadzerker_spirit:1,woof_spirit:1});assert.equal(source(a,'bouncepotency','spring_step'),.22);assert.equal(source(a,'reinforcepotency','sacred_grounds'),.22);assert.equal(source(a,'reinforcepotency','queen_s_guard'),.61);assert.equal(source(a,'shatterpotency','erosion'),.21);assert.equal(source(a,'tailwindpotency','cryo_engine'),.31);assert.equal(source(a,'ragepotency','toadzerker_spirit'),.2);assert.equal(source(a,'weakeningpotency','woof_spirit'),.5);
});
test('new controls, neutral statuses, and Despair source ownership survive saved-build round trips',()=>{
 const a=actor({grounded_despair:2});a.buff=['scenario_shadow','scenario_airborne','scenario_glacial_snapper','quickdraw','civilian_ready','energize_charged','star_barrage','flash_strike','inspired'].map(id=>status(id));const d=sourced(a,'despair','grounded_despair');d.appliedBy='self';a.deBuffs=[d];const b=Build.dictToBuild(a.toSavedBuild());assert.deepEqual(b.toSavedBuild().buffs,a.toSavedBuild().buffs);assert.deepEqual(b.toSavedBuild().debuffs,a.toSavedBuild().debuffs);assert.equal(lighting(b),'shadow');assert.equal(mount(b),'glacial_snapper');assert.equal(b.buff.find(s=>s.id==='quickdraw').countsAsBuff,false);
});
test('forty unique newly reviewed definitions have explicit support and executable behavior',()=>{
 assert.equal(ids.length,40);assert.equal(new Set(ids).size,40);for(const id of ids){const p=PerkStore.getByID(id);assert.ok(p.source.cardId,id);assert.notEqual(getPerkSupport(p).status,'Unsupported',id);assert.ok(p.support.details.length>50,id);assert.ok(Object.values(p).some(v=>typeof v==='function')||p.sourcepotencies||p.cooldown||p.critical,id);}
});
test('all forty effects combined stay finite, deterministic, and preserve equipped definitions and selected statuses',()=>{
 const[a,t]=pair(Object.fromEntries(ids.map(id=>[id,1.3])),{AirBoost:80,EarthBoost:100,DexterityBoost:50,SpeedBoost:20,PhysicalBoost:20});a.buff=['scenario_shadow','scenario_airborne','scenario_glacial_snapper','quickdraw','civilian_ready','energize_charged','star_barrage','flash_strike','blood_lust','inspired','tailwind','rage'].map(id=>status(id,.2));a.deBuffs=[status('poison'),status('despair',.2)];a.resetBuild();a.damageTypes={Air:.5,Physical:.5};t.maxHp=100;t.hp=30;
 const before=JSON.stringify([a.toSavedBuild(),t.toSavedBuild(),a.stats]);const first=run(a,t,{sourceType:'WeaponArt',hitAmount:4});assert.ok(Number.isFinite(first.total.normal));assert.deepEqual(run(a,t,{sourceType:'WeaponArt',hitAmount:4}),first);assert.equal(JSON.stringify([a.toSavedBuild(),t.toSavedBuild(),a.stats]),before);assert.ok(Number.isFinite(cd(a,60,'WeaponArt')));
});
test('real Emotional/Caster/Runic Winds loadout keeps cooldowns and conditional outputs across save/reload',()=>{
 const a=new Build();a.level=0;a.race=RaceStore.getByID('elf');
 for(const[slot,id]of [['helmet','the_emotions'],['chestplate','nomad_shirt'],['legging','mageling_pants'],['ring','caster_ring'],['rune','rage_rune']])a.mainArmor[slot]=ItemStore.getByID(id,slot);
 a.resetBuild();a.buff=[sourced(a,'tailwind','runic_winds')];a.resetBuild();assert.equal(a.perks.caster,2);assert.equal(cd(a,60,'Rune','rage_rune'),25.7143);
 const t=actor();a.damageTypes={Physical:1};assert.ok(run(a,t,{sourceType:'WeaponArt'}).outputs.Hex.normal>0);
 const b=Build.dictToBuild(a.toSavedBuild());b.damageTypes={Physical:1};assert.equal(cd(b,60,'Rune','rage_rune'),25.7143);assert.deepEqual(run(b,t,{sourceType:'WeaponArt'}).outputs,run(a,t,{sourceType:'WeaponArt'}).outputs);
});
test('auras and proc controls remain distinct from real buffs in saved mixed-state previews',()=>{
 const a=actor({emotional:2});a.buff=[status('scenario_sunlight'),status('energize_charged')];a.deBuffs=[status('despair',.1)];a.resetBuild();assert.equal(a.stats.AttackSpeed,40);
 a.addBuffToBuild(status('inspired'));assert.equal(a.stats.AttackSpeed,undefined);assert.equal(disposition(a).mixed,true);
});
test('zero/negative amounts do not enable the new output, stat, critical, or cooldown paths',()=>{
 for(const quantity of [0,-1]){const[a,t]=pair(Object.fromEntries(ids.map(id=>[id,quantity])),{SpeedBoost:10,EarthBoost:100});a.buff=['scenario_shadow','scenario_airborne','scenario_glacial_snapper','quickdraw','civilian_ready','energize_charged','star_barrage','flash_strike','blood_lust','inspired','tailwind','rage'].map(id=>status(id,0));a.deBuffs=[status('poison')];a.resetBuild();a.damageTypes={Physical:1};assert.equal(a.stats.AttackSpeed,undefined);assert.equal(normal(a,t,{sourceType:'WeaponArt'}),100);assert.equal(cd(a,60,'WeaponArt'),60);assert.equal(run(a,t).modifiers.crit_mods['Dexterity chance'],0);}
});
test('malformed contradictory imported lighting/mount controls do not grant either environmental bonus',()=>{
 const[a,t]=pair({vampire:2,rider:2,mounted_defense:2});a.buff=['scenario_shadow','scenario_sunlight','scenario_mounted','scenario_glacial_snapper'].map(id=>status(id));assert.equal(lighting(a),undefined);assert.equal(mount(a),undefined);assert.equal(normal(a,t),100);assert.equal(normal(t,a),100);
});
test('output preview shows added and converted components without changing the real weapon profile',()=>{
 const a=actor({channeled_weapon:1,dark_magic:1,spirit_winds:1});a.blade=new Item({id:'test_blade',type:'Small Blade',damageTypes:{Air:1},attackSpeed:1});a.handle=new Item({id:'test_handle',type:'Small Handle',attackSpeed:1});a.buff=[status('tailwind',0)];a.resetBuild();
 const before=JSON.stringify(a.damageTypes),preview=getActivePerkOutputPreview(a,actor());assert.equal(JSON.stringify(a.damageTypes),before);assert.ok(Object.values(preview.damageTypes).some(v=>v<0));assert.ok(Object.keys(preview.damageTypes).some(k=>k.endsWith(': Magic')));
});
