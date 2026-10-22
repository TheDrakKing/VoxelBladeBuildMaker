const test=require('node:test'),assert=require('node:assert/strict');
const {Build}=require('../src/models/Build.ts');
const {Item,ItemStore}=require('../src/models/Item.ts');
const {BuffStore}=require('../src/models/Buffs.ts');
const {RaceStore}=require('../src/models/Race.ts');
const {WeaponArtStore}=require('../src/models/WeaponArt.ts');
const {PerkStore,getPerkSupport}=require('../src/models/Perk.ts');
const {resolveDamage,resolveStatusDamage,normalizeBaseDamagePacket,getActivePerkOutputPreview}=require('../src/models/Combat.ts');
const ids=['bulwark','guardian_spin','glyph_conduit','penance','void_contract','true_moon','cursed_flames','cinder_soul','deltabit','extinguish','forgotten_chivalry','hypnotist','storm_rend','hex_shield','star_friendship','sticky_guard','vital_mist','springblast','sharp_claws','spore_burst','sacrificial_summoning','rejuvenating_flame','propelling_fun','bombardier','dark_harvest','essence_ray','final_act','magic_circuit','power_inhale','pyre_bloom','quarry','heavy_gravitate','apollo_boost','bounce_momentum','icestorm','ghastly_rot','wall','stone_weapon','guiding_winds','grandmagic_guard'];
function actor(perks={},stats={},potencies={}){const a=new Build();a.level=0;a.mainArmor.helmet=new Item({id:'fixture',perks,stats,potencies});a.resetBuild();a.damageTypes={Physical:1};return a;}
function pair(perks={},stats={},potencies={}){const a=actor(perks,stats,potencies),t=actor();a.target=t;t.target=a;return[a,t];}
function status(id,potency){const b=BuffStore.getByID(id);if(potency!==undefined)b.effectivePotencyOverride=potency;return b;}
function sourced(a,id,perk){const b=status(id),s=a.getSourcesForBuff(b.potencyId)[perk];assert.ok(s,`${perk} source for ${id}`);b.setSourceData(perk,s.type,s.inatePotency);return b;}
function run(a,t,extra={}){return resolveDamage({damage:100,hitAmount:1,source:'test',sourceType:'Weapon',sourceDamageType:'M1',...extra},a,t);}
function normal(a,t,extra){return run(a,t,extra).total.normal;}
function raw(a,id){return PerkStore.getByID(id).getPerkDamageInfo.call(a,a.perks[id]);}
function activation(a,t,id){const p=PerkStore.getByID(id),packet=normalizeBaseDamagePacket(raw(a,id));return packet && resolveDamage(packet,a,t,{damageTypes:packet.damageTypes??p.damageTypes,damageScalings:packet.damageScalings??p.damageScalings});}
const near=(a,b,tolerance=.00011)=>assert.ok(Math.abs(a-b)<tolerance,`${a} != ${b}`);
const rune=(a,cd=20)=>a.mainArmor.rune=new Item({id:'fixture_rune',cooldown:cd});
const art=(a,cd=30)=>a.weaponart={id:'fixture_art',coolDown:cd};

test('fourth batch contains forty unique source perks with explicit scoped support',()=>{
 assert.equal(new Set(ids).size,40);for(const id of ids){const p=PerkStore.getByID(id);assert.equal(getPerkSupport(p).status,'Partial',id);assert.ok(p.source.cardUrl,id);assert.ok(getPerkSupport(p).details.length>60,id);}
});
test('Bulwark requires the manual qualifying threshold and is fixed rather than scaled',()=>{
 const[a,t]=pair();t.perks={bulwark:3};assert.equal(normal(a,t),100);t.buff=[status('bulwark_qualifies')];assert.equal(normal(a,t),80);t.perks.bulwark=.2;assert.equal(normal(a,t),80);
});
test('Guardian Spin modifies only the Spin Weapon Art and includes its fixed base bonus',()=>{
 const[a,t]=pair({guardian_spin:1.3});assert.equal(normal(a,t,{sourceType:'WeaponArt',source:'spin'}),146);assert.equal(normal(a,t,{sourceType:'WeaponArt',source:'other'}),100);assert.equal(normal(a,t,{source:'spin'}),100);
});
test('Glyph Conduit boosts only the Magic portion while the sigil is selected',()=>{
 const[a,t]=pair({glyph_conduit:2});a.damageTypes={Magic:.5,Fire:.5};assert.equal(normal(a,t),100);a.buff=[status('glyph_conduit')];const r=run(a,t);assert.equal(r.outputs.Magic.normal,70);assert.equal(r.outputs.Fire.normal,50);
});
test('Penance implements the verified cap at and below thirty-five percent HP',()=>{
 const[a,t]=pair({penance:2});a.maxHp=100;a.hp=36;assert.equal(normal(a,t),100);a.hp=35;assert.equal(normal(a,t),150);a.hp=1;assert.equal(normal(a,t),150);a.maxHp=0;assert.equal(normal(a,t),100);
});
test('Void Contract damage follows the selected mark applicant and excludes actual DoTs',()=>{
 const[a,t]=pair({void_contract:2});const mark=sourced(a,'void_contract','void_contract');t.deBuffs=[mark];assert.equal(normal(a,t),160);assert.equal(normal(a,t,{sourceType:'Status'}),100);mark.appliedBy='self';assert.equal(normal(a,t),100);
});
test('received Void Contract potency is a snapshot even after the applying perk changes',()=>{
 const[a,t]=pair({void_contract:1.3});t.deBuffs=[sourced(a,'void_contract','void_contract')];a.perks.void_contract=8;assert.equal(normal(a,t),139);t.deBuffs[0].effectivePotencyOverride=.2;assert.equal(normal(a,t),160);
});
test('True Moon conserves existing output, clamps conversion, and affects weapon packets only',()=>{
 const[a,t]=pair({true_moon:2});a.damageTypes={Magic:1,Fire:.5,True:.2};let r=run(a,t);assert.equal(r.outputs.Magic.normal,40);assert.equal(r.outputs.True.normal,80);assert.equal(r.outputs.Fire.normal,50);assert.equal(r.total.normal,170);a.perks.true_moon=5;r=run(a,t);assert.equal(r.outputs.Magic,undefined);assert.equal(r.outputs.True.normal,120);assert.deepEqual(a.damageTypes,{Magic:1,Fire:.5,True:.2});
 for(const type of ['Rune','WeaponArt','Status'])assert.equal(run(a,t,{sourceType:type}).outputs.Magic.normal,100);
});
test('True Moon runs after the documented Spirit Winds conversion without enabling Dark Magic',()=>{
 const[a,t]=pair({true_moon:1,spirit_winds:1,dark_magic:1});a.damageTypes={Air:1};a.buff=[status('tailwind',0)];const r=run(a,t);assert.ok(r.outputs.True.normal>0);assert.equal(r.outputs.Hex,undefined);assert.equal(r.outputs.Magic.normal,7.93);assert.equal(r.outputs.True.normal,3.4);
});
test('True Moon previews an independent moon without converting its own Magic output',()=>{
 const[a,t]=pair({true_moon:2});assert.equal(raw(a,'true_moon').damage,5);assert.equal(activation(a,t,'true_moon').outputs.Magic.normal,5);assert.equal(normal(a,t),100);
});
test('Cursed Flames changes only its applicant Burn profile and retains additive potency math',()=>{
 const[a,t]=pair({cursed_flames:2},{FireBoost:100,HexBoost:50});const burn=status('burn');burn.setSourceData('fixture','Default',0);t.deBuffs=[burn];assert.equal(a.potencies.burnpotency,2);const r=resolveStatusDamage(burn,t);assert.ok(r.outputs.Fire.normal>0);assert.equal(r.outputs.Hex.normal,r.outputs.Fire.normal);assert.equal(r.totalEffectiveBoost,250);assert.deepEqual(burn.damageScalings,{Fire:1.5});assert.deepEqual(burn.damageTypes,{Fire:1});burn.appliedBy='self';const other=resolveStatusDamage(burn,t);assert.equal(other.outputs.Hex,undefined);assert.equal(other.total.normal,1);
});
test('Cursed Flames weakening reads applicant additive Burn points, not innate/manual Burn potency',()=>{
 const[a,t]=pair({cursed_flames:1},{},{burnpotency:3});const burn=status('burn',5);t.deBuffs=[burn,status('weakness',.2)];assert.equal(a.potencies.burnpotency,4);assert.equal(normal(t,a),55.56);burn.effectivePotencyOverride=.1;assert.equal(normal(t,a),55.56);assert.equal(normal(a,t),100);
});
test('Cinder Soul nullifies received Burn damage while retaining Burn as a debuff and ordinary Fire damage',()=>{
 const[a,t]=pair({cinder_soul:1});const burn=status('burn');a.deBuffs=[burn];assert.equal(resolveStatusDamage(burn,a).total.normal,0);t.damageTypes={Fire:1};assert.equal(normal(t,a),100);assert.equal(a.potencies.burnpotency,1);assert.equal(a.deBuffs[0].id,'burn');
});
test('Deltabit boosts only actual weapon M2 packets',()=>{
 const[a,t]=pair({deltabit:1.3});assert.equal(normal(a,t,{sourceDamageType:'M2'}),113);assert.equal(normal(a,t),100);assert.equal(normal(a,t,{sourceType:'Perk',sourceDamageType:'M2'}),100);
});
test('Extinguish consumes Burn before Curse Rip and boosts only Water on the first of multiple hits',()=>{
 const[a,t]=pair({extinguish:2,curse_rip:1});a.damageTypes={Water:1};a.buff=[status('extinguish_proc')];t.deBuffs=[status('burn'),status('sticky')];const r=run(a,t,{hitAmount:2});assert.equal(r.total.normal,315);assert.equal(r.modifiers.damage_bonus_mods['Curse Rip'],.05);assert.deepEqual(r.statusConsumptions,[{statusId:'burn',perkId:'extinguish',hit:1}]);assert.equal(t.deBuffs.length,2);assert.equal(a.buff.length,1);
});
test('Extinguish accepts target-owned Burn but requires its selected Water hit and a proc coefficient',()=>{
 const[a,t]=pair({extinguish:1});const burn=status('burn');burn.appliedBy='self';t.deBuffs=[burn];a.damageTypes={Water:.5,Physical:.5};assert.equal(normal(a,t),100);a.buff=[status('extinguish_proc')];let r=run(a,t);assert.equal(r.outputs.Water.normal,75);assert.equal(r.outputs.Physical.normal,50);assert.equal(r.statusConsumptions.length,1);assert.equal(run(a,t,{procCoefficient:0}).statusConsumptions,undefined);a.damageTypes={Physical:1};assert.equal(run(a,t).statusConsumptions,undefined);
});
test('Forgotten Chivalry consumes Reinforce after its proccing Rune hit only',()=>{
 const[a,t]=pair({forgotten_chivalry:2});a.buff=[status('reinforce',.5)];const r=run(a,t,{sourceType:'Rune',hitAmount:3});assert.equal(r.outputs.Physical.normal,300);assert.equal(r.outputs.Holy.normal,80);assert.equal(r.total.normal,380);assert.deepEqual(r.statusConsumptions,[{statusId:'reinforce',perkId:'forgotten_chivalry',hit:1,holder:'attacker'}]);assert.equal(a.buff.length,1);assert.equal(normal(a,t),100);
});
test('Forgotten Chivalry respects non-damaging and DoT exclusions but does not invent proc-coefficient gating',()=>{
 const[a,t]=pair({forgotten_chivalry:1});a.buff=[status('reinforce')];assert.equal(run(a,t,{damage:0,sourceType:'WeaponArt'}).statusConsumptions,undefined);assert.equal(run(a,t,{sourceType:'Status'}).statusConsumptions,undefined);assert.equal(normal(a,t,{sourceType:'WeaponArt',procCoefficient:0}),140);
});
test('incoming and outgoing status consumption can resolve together without changing either source build',()=>{
 const[a,t]=pair({forgotten_chivalry:1,extinguish:1});a.buff=[status('reinforce'),status('extinguish_proc')];a.damageTypes={Water:1};t.deBuffs=[status('burn')];const before=JSON.stringify([a.toSavedBuild(),t.toSavedBuild()]);const r=run(a,t,{sourceType:'WeaponArt',hitAmount:3});assert.equal(r.total.normal,390);assert.equal(r.statusConsumptions.length,2);assert.equal(JSON.stringify([a.toSavedBuild(),t.toSavedBuild()]),before);
});
test('Hypnotist adds penetration for Magic and all six constituents but not Physical or True',()=>{
 const[a,t]=pair({hypnotist:1.3});t.deBuffs=[sourced(a,'hypnotist','hypnotist')];for(const type of ['Magic','Fire','Water','Holy','Hex','Earth','Air']){a.damageTypes={[type]:1};assert.equal(normal(a,t),106.5,type);}a.damageTypes={Physical:1};assert.equal(normal(a,t),100);a.damageTypes={True:1};assert.equal(normal(a,t),100);
});
test('Electrical Rend stacks additively with Shatter and Hypnotist',()=>{
 const[a,t]=pair({storm_rend:2,hypnotist:1});t.deBuffs=[sourced(a,'electrical_rend','storm_rend'),sourced(a,'hypnotist','hypnotist'),status('shatter',.1)];a.damageTypes={Magic:1};assert.equal(normal(a,t),135);a.damageTypes={Physical:1};assert.equal(normal(a,t),130);a.damageTypes={True:1};assert.equal(normal(a,t),100);
});
test('Hex Shield supplies shared Converted Energy after an activation without requiring the recipient perk',()=>{
 const[a,t]=pair({hex_shield:2,bastion_bless:1});const b=sourced(a,'converted_energy','hex_shield');b.appliedBy='opponent';t.buff=[b];assert.equal(normal(t,a),122);assert.equal(t.perks.hex_shield,undefined);b.effectivePotencyOverride=.3;assert.equal(normal(t,a),130);
});
test('Friendship applies its explicit CDR formula, preserves source ownership, and excludes Rune cooldowns',()=>{
 const[a,t]=pair({star_friendship:3,bastion_bless:1});const b=sourced(a,'friendship','star_friendship');b.appliedBy='opponent';t.buff=[b];assert.equal(t.getCooldownPreview(60,'WeaponArt').value,22.6415);assert.equal(t.getCooldownPreview(60,'Rune').value,60);b.effectivePotencyOverride=.3;assert.equal(t.getCooldownPreview(60,'WeaponArt').value,24);
});
test('Friendship and Caster share the documented grouped CDR denominator',()=>{
 const a=actor({caster:2});a.buff=[status('friendship',.2)];assert.equal(a.getCooldownPreview(60,'WeaponArt').value,26.087);assert.equal(a.getCooldownPreview(60,'Rune').value,46.1538);
});
for(const [perk,id,amount,potency] of [['sticky_guard','reinforce',1.3,.26],['vital_mist','tailwind',1.3,.28],['springblast','bounce',1.3,.13],['sharp_claws','bleed',1.3,1.3],['spore_burst','poison',2,1],['sacrificial_summoning','poison',1.3,2]]){
 test(`${perk} supplies its documented innate status source at fractional perk amounts`,()=>{const a=actor({[perk]:amount});near(sourced(a,id,perk).sourceData.sourceInatePotency,potency);});
}
test('Sharp Claws and Spore Burst add separate additive potency once per reset',()=>{
 const a=actor({sharp_claws:1.3,spore_burst:2},{},{bleedpotency:3,poisonpotency:4});assert.equal(a.potencies.bleedpotency,4.3);assert.equal(a.potencies.poisonpotency,6);a.resetBuild();assert.equal(a.potencies.bleedpotency,4.3);assert.equal(a.potencies.poisonpotency,6);
});
test('Cursed and Perk Effectiveness increase DoT source perks without multiplying direct gear potency twice',()=>{
 const a=actor({cursed:1,perk_effectiveness:2,sharp_claws:1,cinder_soul:1,spore_burst:1},{},{bleedpotency:3,burnpotency:3,poisonpotency:3,ragepotency:3});assert.equal(a.perks.sharp_claws,1.32);for(const id of ['bleedpotency','burnpotency','poisonpotency'])assert.equal(a.potencies[id],4.32,id);assert.equal(a.potencies.ragepotency,3.96);a.resetBuild();assert.equal(a.potencies.bleedpotency,4.32);
});
test('Rejuvenating Flame doubles the source while the applicant is Burning and preserves application snapshots',()=>{
 const[a,t]=pair({rejuvenating_flame:2});let b=sourced(a,'cinder_surge','rejuvenating_flame');a.buff=[b];assert.equal(run(a,t).outputs.Fire.normal,10);a.deBuffs=[status('burn')];assert.equal(run(a,t).outputs.Fire.normal,10);b=sourced(a,'cinder_surge','rejuvenating_flame');assert.equal(b.sourceData.sourceInatePotency,.2);a.buff=[b];assert.equal(run(a,t).outputs.Fire.normal,20);
});
test('Cloudpush and Cinderpull share their potency behavior, stack, and work without the original perk',()=>{
 const[a,t]=pair({propelling_fun:2});const cloud=sourced(a,'cloudpush','propelling_fun'),cinder=sourced(a,'cinderpull','propelling_fun');cloud.appliedBy=cinder.appliedBy='opponent';t.buff=[cloud,cinder];const r=run(t,a);assert.equal(r.outputs.Air.normal,15);assert.equal(r.outputs.Fire.normal,15);assert.equal(r.total.normal,130);
});
test('Propelling Fun activation chooses a fresh Fire/Air profile without modifying saved weapon data',()=>{
 const[a,t]=pair({propelling_fun:2},{AirBoost:100,FireBoost:300});assert.equal(activation(a,t,'propelling_fun').outputs.Air.normal,26);a.deBuffs=[status('burn')];const packet=normalizeBaseDamagePacket(raw(a,'propelling_fun'));assert.deepEqual(packet.damageScalings,{Air:1});assert.deepEqual(packet.damageTypes,{Fire:1});assert.equal(resolveDamage(packet,a,t).outputs.Fire.normal,26);assert.deepEqual(a.damageTypes,{Physical:1});assert.deepEqual(a.damageScalings,{});
});
for(const [id,p,base,scaling,output] of [
 ['bombardier',2,12,{Holy:1,Magic:1},{Holy:.5,Magic:.5}],['final_act',1.3,23,{Hex:1,Magic:1,Summon:1},{Hex:.5,Magic:.5}],['quarry',2,40,{Holy:1,Physical:1},{Holy:.5,Physical:.5}],['power_inhale',1.3,26,{Air:1},{Air:1}],
]){
 test(`${id} has an independent activation with its documented base, scaling, and outputs`,()=>{const[a,t]=pair({[id]:p});near(raw(a,id).damage,base);const d=PerkStore.getByID(id);assert.deepEqual(d.damageScalings,scaling);assert.deepEqual(d.damageTypes,output);assert.ok(activation(a,t,id).total.normal>0);assert.equal(normal(a,t),100);});
}
test('Dark Harvest requires selected target HP strictly below half',()=>{
 const[a,t]=pair({dark_harvest:2});t.maxHp=100;t.hp=50;assert.equal(raw(a,'dark_harvest'),null);t.hp=49;assert.equal(raw(a,'dark_harvest').damage,60);t.maxHp=0;assert.equal(raw(a,'dark_harvest'),null);
});
test('Essence Ray uses twenty-three True hits and the current weapon scaling snapshot',()=>{
 const[a,t]=pair({essence_ray:2},{PhysicalBoost:100});a.damageScalings={Physical:1};const r=activation(a,t,'essence_ray');assert.equal(r.hitCount,23);assert.equal(r.total.normal,75.9);assert.equal(r.outputs.True.normal,75.9);assert.equal(raw(a,'essence_ray').sourceType,'WeaponArt');const packet=raw(a,'essence_ray');packet.damageScalings.Physical=3;assert.equal(a.damageScalings.Physical,1);
});
test('Magic Circuit reads a known Rune base cooldown and safely rejects absent cooldown data',()=>{
 const[a,t]=pair({magic_circuit:2,caster:10});assert.equal(raw(a,'magic_circuit'),null);rune(a,20);assert.equal(raw(a,'magic_circuit').damage,5);assert.equal(activation(a,t,'magic_circuit').total.normal,5);rune(a,0);assert.equal(raw(a,'magic_circuit').damage,2.5);rune(a,NaN);assert.equal(raw(a,'magic_circuit'),null);
});
test('Pyre Bloom uses Weapon Art base cooldown and receives ordinary Weapon Art bonuses',()=>{
 const[a,t]=pair({pyre_bloom:2,energize:1});assert.equal(a.potencies.burnpotency,2);assert.equal(raw(a,'pyre_bloom'),null);art(a,120);a.buff=[status('energize_charged')];assert.equal(raw(a,'pyre_bloom').damage,4.3);assert.equal(raw(a,'pyre_bloom').sourceType,'WeaponArt');assert.equal(activation(a,t,'pyre_bloom').total.normal,6.45);
});
test('Heavy Gravitate checks mark ownership and previews one documented activation hit',()=>{
 const[a,t]=pair({heavy_gravitate:2});assert.equal(raw(a,'heavy_gravitate'),null);t.deBuffs=[status('heavy_gravitate')];near(raw(a,'heavy_gravitate').damage,25/3);t.deBuffs[0].appliedBy='self';assert.equal(raw(a,'heavy_gravitate'),null);
});
test('Apollo Boost adds fixed base cooldown before Caster and the Elf race factor',()=>{
 const a=actor({apollo_boost:3,caster:2});a.race=RaceStore.getByID('elf');const cd=a.getCooldownPreview(60,'Rune');assert.equal(cd.value,28.6154);assert.deepEqual(cd.additions,{'Apollo Boost':2});assert.equal(a.getCooldownPreview(60,'WeaponArt').value,46.1538);
});
test('Apollo Boost floors wave counts, uses Rune classification, and bounds the literal base formula at zero',()=>{
 const[a,t]=pair({apollo_boost:1.3,civilian:1});const packet=raw(a,'apollo_boost');assert.equal(packet.hitAmount,2);near(packet.damage,4.525);assert.equal(packet.sourceType,'Rune');a.buff=[status('civilian_ready')];assert.equal(activation(a,t,'apollo_boost').total.normal,12.67);a.perks.apollo_boost=100;assert.equal(raw(a,'apollo_boost').damage,0);assert.equal(activation(a,t,'apollo_boost').total.normal,0);
});
test('Bounce Momentum requires the neutral Tongue Shot state for its activation preview',()=>{
 const[a,t]=pair({bounce_momentum:2});assert.equal(raw(a,'bounce_momentum'),null);a.buff=[status('tongue_shot_ready')];assert.equal(raw(a,'bounce_momentum').damage,15);assert.equal(a.buff[0].countsAsBuff,false);assert.equal(activation(a,t,'bounce_momentum').total.normal,15);
});
test('Icestorm is a selected non-DoT orbit hit that cannot proc Sharpshooter',()=>{
 const[a,t]=pair({icestorm:2,sharpshooter:1});assert.equal(raw(a,'icestorm'),null);a.buff=[status('icestorm_active'),status('sharpshooter_range')];const packet=normalizeBaseDamagePacket(raw(a,'icestorm'));assert.equal(packet.procCoefficient,0);assert.ok(!packet.tags.includes('DoT'));assert.equal(activation(a,t,'icestorm').total.normal,5);
});
test('Ghastly Rot converts Poison from any applicant to True while preserving its scaling and added output amount',()=>{
 const[a,t]=pair({concealed_edge:1},{EarthBoost:100});a.buff=[status('scenario_shadow')];const poison=status('poison');poison.setSourceData('fixture','Default',0);t.deBuffs=[poison,status('ghastly_rot')];t.stats.HexDefense=200;const r=resolveStatusDamage(poison,t);assert.equal(r.outputs.Hex,undefined);assert.equal(r.outputs.True.normal,2.5);assert.deepEqual(poison.damageScalings,{Hex:1,Earth:1});poison.appliedBy='self';assert.equal(resolveStatusDamage(poison,t).total.normal,1);
});
test('Ghastly Rot does not convert Burn or direct Hex attacks',()=>{
 const[a,t]=pair();t.deBuffs=[status('ghastly_rot')];a.damageTypes={Hex:1};assert.equal(run(a,t).outputs.Hex.normal,100);const burn=status('burn');t.deBuffs.push(burn);assert.ok(resolveStatusDamage(burn,t).outputs.Fire);
});
test('Wall Redirect reduces only recipient damage and excludes the documented Explosive Charge source',()=>{
 const[a,t]=pair({wall:2});const b=sourced(a,'redirect','wall');b.appliedBy='opponent';t.buff=[b];assert.equal(normal(a,t),80);assert.equal(normal(a,t,{source:'explosive_charge',sourceType:'Perk'}),80);assert.equal(run(t,t,{source:'explosive_charge',sourceType:'Perk'}).total.normal,100);b.effectivePotencyOverride=2;assert.equal(normal(a,t),0);assert.equal(t.buff.length,1);
});
test('Stone Weapon adds Earth output to weapon packets without changing saved profiles or skills',()=>{
 const[a,t]=pair({stone_weapon:2});assert.equal(run(a,t).outputs.Earth.normal,60);assert.equal(normal(a,t,{sourceType:'Rune'}),100);assert.equal(normal(a,t,{sourceType:'WeaponArt'}),100);assert.deepEqual(a.damageTypes,{Physical:1});assert.equal(a.stats.AttackSpeed,undefined);
});
test('Guiding Winds damage tracks the selected independent maximum charge rather than Tailwind',()=>{
 const[a,t]=pair({guiding_winds:2});a.buff=[status('tailwind',10)];assert.equal(normal(a,t),100);a.buff.push(status('guiding_winds_charged'));assert.equal(normal(a,t),180);assert.equal(normal(a,t,{sourceType:'Rune'}),130);assert.equal(normal(a,t,{sourceType:'WeaponArt'}),130);a.buff[0].effectivePotencyOverride=0;assert.equal(normal(a,t),180);near(sourced(a,'tailwind','guiding_winds').sourceData.sourceInatePotency,.2);
});
test('Grandmagic Guard applies diminishing defense then per-output flat Magic-family reduction',()=>{
 const[a,t]=pair();t.perks={grandmagic_guard:2};a.damageTypes={Magic:.5,Physical:.5};assert.equal(normal(a,t),100);t.buff=[status('magic_reinforce')];let r=run(a,t);assert.equal(r.outputs.Magic.normal,24);assert.equal(r.outputs.Physical.normal,25);assert.equal(r.total.normal,49);assert.equal(r.modifiers.special_mods['[flat] Grandmagic Guard (Magic)'],1);
 a.damageTypes={Fire:1};t.stats.FireDefense=100;r=run(a,t);assert.equal(r.total.normal,24);assert.equal(r.total.crit,36.5);a.damageTypes={True:1};assert.equal(normal(a,t),50);
});
test('flat reduction occurs per hit and recomputes expected damage after flooring each crit branch',()=>{
 const[a,t]=pair({}, {CritRate:50});t.perks={grandmagic_guard:1};t.buff=[status('magic_reinforce')];a.damageTypes={Magic:1};let r=run(a,t,{damage:.6,hitAmount:2});assert.equal(r.total.normal,0);assert.equal(r.total.crit,.2);assert.equal(r.total.average,.1);r=run(a,t,{damage:.1});assert.equal(r.total.normal,0);assert.equal(r.total.crit,0);
});
test('Grandmagic Guard flat reduction follows Stoneskin and retains zero Burn damage from Cinder Soul',()=>{
 const[a,t]=pair();t.perks={grandmagic_guard:1,stoneskin:1,cinder_soul:1};t.buff=[status('magic_reinforce'),status('stoneskin_active')];a.damageTypes={Magic:1};assert.equal(normal(a,t),46.17);const burn=status('burn');t.deBuffs=[burn];assert.equal(resolveStatusDamage(burn,t).total.normal,0);
});
test('new status sources and canonical callbacks survive a real-item save/reload',()=>{
 const a=new Build();a.level=0;a.mainArmor.helmet=ItemStore.getByID('coral_templar_helmet','helmet');a.buff=[status('converted_energy',.2),status('friendship',.2),status('cloudpush',.1),status('cinderpull',.1),status('guiding_winds_charged')];a.resetBuild();a.damageTypes={Physical:1};const restored=Build.dictToBuild(a.toSavedBuild());restored.damageTypes={Physical:1};assert.equal(restored.getCooldownPreview(60,'WeaponArt').value,30);assert.deepEqual(run(restored,actor()).outputs,run(a,actor()).outputs);assert.equal(restored.buff.find(b=>b.id==='guiding_winds_charged').countsAsBuff,false);
});
test('per-activation profile metadata survives normalization but explicit calculation overrides take precedence',()=>{
 const[a,t]=pair({}, {AirBoost:100});const packet=normalizeBaseDamagePacket({damage:10,hitAmount:1,source:'profile',sourceType:'Perk',damageTypes:{Fire:1},damageScalings:{Air:1}});assert.equal(resolveDamage(packet,a,t).outputs.Fire.normal,20);assert.equal(resolveDamage(packet,a,t,{damageTypes:{True:1},damageScalings:{}}).outputs.True.normal,10);packet.damageTypes.Fire=2;assert.deepEqual(a.damageTypes,{Physical:1});
});
test('new neutral scenario controls do not turn Emotional into its buffs-only state',()=>{
 const[a,t]=pair({emotional:1});a.buff=['bulwark_qualifies','tongue_shot_ready','icestorm_active','guiding_winds_charged','extinguish_proc'].map(id=>status(id));assert.equal(run(a,t,{sourceType:'WeaponArt'}).outputs.Hex,undefined);assert.equal(a.getCooldownPreview(60,'WeaponArt').value,60);
});
test('all forty reviewed paths remain finite, deterministic, and pure together',()=>{
 const[a,t]=pair(Object.fromEntries(ids.map(id=>[id,1.3])),{FireBoost:40,AirBoost:60,MagicBoost:70,EarthBoost:30});rune(a,60);art(a,30);a.buff=['bulwark_qualifies','glyph_conduit','guiding_winds_charged','tongue_shot_ready','icestorm_active','extinguish_proc','magic_reinforce','reinforce','converted_energy','friendship','cinder_surge','cloudpush','cinderpull','redirect'].map(id=>status(id,.1));a.deBuffs=[status('burn')];a.hp=30;a.maxHp=100;t.hp=40;t.maxHp=100;t.deBuffs=[status('burn'),status('poison'),status('ghastly_rot'),status('heavy_gravitate'),status('void_contract',.1),status('hypnotist',.1),status('electrical_rend',.1)];a.damageTypes={Water:.5,Magic:.5};const before=JSON.stringify([a.toSavedBuild(),t.toSavedBuild(),a.stats,a.potencies]);
 for(const extra of [{hitAmount:4},{sourceType:'Rune',hitAmount:4},{sourceType:'WeaponArt',hitAmount:3},{sourceType:'Status'}]){const r=run(a,t,extra);assert.ok(Number.isFinite(r.total.average));assert.deepEqual(run(a,t,extra),r);}
 for(const id of ids)if(PerkStore.getByID(id).getPerkDamageInfo){const r=activation(a,t,id);if(r)assert.ok(Number.isFinite(r.total.normal),id);}
 assert.equal(JSON.stringify([a.toSavedBuild(),t.toSavedBuild(),a.stats,a.potencies]),before);
});
test('non-positive new perk amounts do not enable conditional bonuses, conversions, cooldown costs, or activation previews',()=>{
 for(const quantity of [0,-1]){const[a,t]=pair(Object.fromEntries(ids.map(id=>[id,quantity])));a.buff=['bulwark_qualifies','glyph_conduit','guiding_winds_charged','tongue_shot_ready','icestorm_active','extinguish_proc','magic_reinforce'].map(id=>status(id));t.deBuffs=[status('burn'),status('heavy_gravitate')];a.damageTypes={Magic:.5,Water:.5};assert.equal(normal(a,t,{sourceDamageType:'M2'}),100);assert.equal(a.getCooldownPreview(60,'Rune').value,60);for(const id of ids)if(PerkStore.getByID(id).getPerkDamageInfo)assert.equal(raw(a,id),null,id);}
});
