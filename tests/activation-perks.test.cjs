const test=require('node:test'),assert=require('node:assert/strict');
const {Build}=require('../src/models/Build.ts');
const {Item,ItemStore}=require('../src/models/Item.ts');
const {BuffStore}=require('../src/models/Buffs.ts');
const {PerkStore,getPerkSupport}=require('../src/models/Perk.ts');
const {resolveDamage,resolveStatusDamage,normalizeBaseDamagePacket,getActivePerkOutputPreview}=require('../src/models/Combat.ts');
const ids=['gorecast','mortal_will','serrated_edge','stored_corruption','reinforced_block','stoneskin','defensive_stance','sharpshooter','stealth','money_smart','packaged_power','pain_distribution','royal_parry','aggressive_personality','air_pressure','roaring_heads','unmoving','tailwind','luminescent_fervor','queen_s_power','channeled_depths','cleansed_blade','frenzy','ferocity','air_barrier','barbed_flurry','gravity_well','heavy_slate','royal_finisher','vile_presence','gnawing_poison','echo_blast','fiery_pursuit','stormcaller','quake','golem_guillotine','screeching_sound','hex_ray','holy_tides','carrying_winds'];
function actor(perks={},stats={},potencies={}){const a=new Build();a.level=0;a.mainArmor.helmet=new Item({id:'test',perks,stats,potencies});a.resetBuild();a.damageTypes={Physical:1};return a;}
function pair(perks={},stats={},potencies={}){const a=actor(perks,stats,potencies),t=actor();a.target=t;t.target=a;return[a,t];}
function status(id,potency){const b=BuffStore.getByID(id);if(potency!==undefined)b.effectivePotencyOverride=potency;return b;}
function sourced(a,id,perk){const b=status(id),s=a.getSourcesForBuff(b.potencyId)[perk];assert.ok(s,`${perk} source for ${id}`);b.setSourceData(perk,s.type,s.inatePotency);return b;}
function run(a,t,extra={}){return resolveDamage({damage:100,hitAmount:1,source:'test',sourceType:'Weapon',sourceDamageType:'M1',...extra},a,t);}
function normal(a,t,extra){return run(a,t,extra).total.normal;}
function activation(a,t,id){const p=PerkStore.getByID(id),packet=normalizeBaseDamagePacket(p.getPerkDamageInfo.call(a,a.perks[id]));return packet && resolveDamage(packet,a,t,{damageTypes:p.damageTypes,damageScalings:p.damageScalings});}
function raw(a,id){return PerkStore.getByID(id).getPerkDamageInfo.call(a,a.perks[id]);}
const near=(a,b,tol=.00011)=>assert.ok(Math.abs(a-b)<tol,`${a} != ${b}`);

test('batch contains forty unique newly reviewed perk definitions with source attribution',()=>{
 assert.equal(new Set(ids).size,40);for(const id of ids){const p=PerkStore.getByID(id);assert.notEqual(getPerkSupport(p).status,'Unsupported',id);assert.ok(p.source?.cardUrl,id);assert.ok(getPerkSupport(p).details.length>40,id);}
});
test('Gorecast requires selected target Bleed, Weapon Art, and Magic or Physical output',()=>{
 const[a,t]=pair({gorecast:2});assert.equal(normal(a,t,{sourceType:'WeaponArt'}),100);t.deBuffs=[status('bleed')];assert.equal(normal(a,t,{sourceType:'WeaponArt'}),130);assert.equal(normal(a,t),100);a.damageTypes={Fire:1};assert.equal(normal(a,t,{sourceType:'WeaponArt'}),100);a.damageTypes={Magic:.5,Fire:.5};assert.equal(normal(a,t,{sourceType:'WeaponArt'}),130);
});
test('Mortal Will modifies only the cloned finisher output and scaling, including overlapping tags',()=>{
 const[a,t]=pair({mortal_will:2},{HolyBoost:100});a.damageScalings={};assert.equal(normal(a,t),100);const r=run(a,t,{sourceDamageType:'M2'});assert.equal(r.outputs.Physical.normal,130);assert.equal(r.outputs.Holy.normal,26);assert.equal(r.total.normal,156);assert.deepEqual(a.damageTypes,{Physical:1});assert.deepEqual(a.damageScalings,{});
 assert.equal(normal(a,t,{sourceType:'WeaponArt',sourceDamageType:'WeaponArt',tags:['Finisher']}),156);
});
test('Serrated Edge gives the documented one-perk finisher boost and additive Bleed potency',()=>{
 const[a,t]=pair({serrated_edge:1});assert.equal(a.potencies.bleedpotency,2);assert.equal(normal(a,t),100);assert.equal(normal(a,t,{sourceDamageType:'M2'}),120);a.resetBuild();assert.equal(a.potencies.bleedpotency,2);
 const f=actor({serrated_edge:1.3});assert.equal(f.potencies.bleedpotency,2.6);assert.match(getPerkSupport(PerkStore.getByID('serrated_edge')).details,/provisional/);
});
test('Stored Corruption increases incoming damage directly and remains uncapped',()=>{
 const[a,t]=pair();t.perks={stored_corruption:2};assert.equal(normal(a,t),110);t.perks.stored_corruption=30;assert.equal(normal(a,t),250);
});
test('Reinforced Block needs Blocking and uses the fixed base plus scaled diminishing reduction',()=>{
 const[a,t]=pair();t.perks={reinforced_block:2};assert.equal(normal(a,t),100);t.buff=[status('scenario_blocking')];assert.equal(normal(a,t),33.33);t.perks.reinforced_block=1;assert.equal(normal(a,t),40);t.perks.reinforced_block=0;assert.equal(normal(a,t),100);
});
test('Stoneskin uses a direct multiplier and caps at eighty percent reduction',()=>{
 const[a,t]=pair();t.perks={stoneskin:1.3};assert.equal(normal(a,t),100);t.buff=[status('stoneskin_active')];assert.equal(normal(a,t),61);t.perks.stoneskin=3;assert.equal(normal(a,t),20);
});
test('Stoneskin and Reinforced Block compose without putting Stoneskin into diminishing reduction',()=>{
 const[a,t]=pair();t.perks={stoneskin:1,reinforced_block:1};t.buff=[status('stoneskin_active'),status('scenario_blocking')];assert.equal(normal(a,t),28);
});
test('Defensive Stance checks Taunt on the incoming attacker, not its own holder',()=>{
 const[a,t]=pair();t.perks={defensive_stance:2};t.deBuffs=[status('taunt')];assert.equal(normal(a,t),100);a.deBuffs=[status('taunt')];assert.equal(normal(a,t),75.19);
});
test('Sharpshooter gates on manual range and proc-capable direct packets',()=>{
 const[a,t]=pair({sharpshooter:1.3});assert.equal(normal(a,t),100);a.buff=[status('sharpshooter_range')];assert.equal(normal(a,t),126);assert.equal(normal(a,t,{procCoefficient:0}),100);assert.equal(normal(a,t,{sourceType:'Status'}),100);
});
for(const [id,state,p,expected] of [['stealth','stealth_advantage',2,120],['money_smart','maximum_voxos',1.3,126],['packaged_power','inventory_bonus_capped',2,130],['carrying_winds','high_knockback',2,120]]){
 test(`${id} requires its selected qualifying condition`,()=>{const[a,t]=pair({[id]:p});assert.equal(normal(a,t),100);a.buff=[status(state)];assert.equal(normal(a,t),expected);assert.equal(a.buff[0].countsAsBuff,false);});
}
test('Pain Distribution needs selected Active Summons and scales resistance once',()=>{
 const[a,t]=pair();t.perks={pain_distribution:2};assert.equal(normal(a,t),100);t.buff=[status('active_summons')];assert.equal(normal(a,t),83.33);
});
test('Royal Parry multiplies only a buff-guaranteed critical branch and does not scale with perk count',()=>{
 const[a,t]=pair({royal_parry:3});let r=run(a,t);assert.equal(r.total.crit,150);assert.equal(r.total.average,100);a.buff=[status('guaranteed_crit',0)];r=run(a,t);assert.equal(r.total.normal,100);assert.equal(r.total.crit,225);assert.equal(r.total.average,225);assert.equal(r.modifiers.crit_mods['Royal Parry critical multiplier'],1.5);
 a.buff=[];a.stats.CritRate=100;assert.equal(run(a,t).total.average,150);a.buff=[status('guaranteed_crit')];assert.equal(run(a,t,{canCrit:false}).total.average,100);
});
test('Aggressive Personality requires both selected Hammer Slam and a finisher packet',()=>{
 const[a,t]=pair({aggressive_personality:2});a.buff=[status('hammer_slam')];assert.equal(normal(a,t),100);assert.equal(normal(a,t,{sourceDamageType:'M2'}),150);a.buff=[];assert.equal(normal(a,t,{sourceDamageType:'M2'}),100);
});
test('Air Pressure caps manual charge consistently for defense and Rune release preview',()=>{
 const[a,t]=pair({air_pressure:2});assert.equal(raw(a,'air_pressure'),null);a.buff=[status('air_pressure',30)];assert.equal(raw(a,'air_pressure').damage,15);assert.equal(raw(a,'air_pressure').sourceType,'Rune');assert.equal(normal(t,a),83.33);a.buff[0].effectivePotencyOverride=8;assert.equal(raw(a,'air_pressure').damage,6);assert.equal(normal(t,a),92.59);assert.equal(a.buff[0].effectivePotencyOverride,8);
});
test('Air Pressure release receives Rune bonuses but does not change ordinary attacks',()=>{
 const[a,t]=pair({air_pressure:1,civilian:1});a.buff=[status('air_pressure',10),status('civilian_ready')];const r=activation(a,t,'air_pressure');assert.equal(r.total.normal,10.5);assert.equal(normal(a,t),100);
});
test('Roaring Heads adds fixed speed per unique debuff and fractional negative Warding per perk',()=>{
 const a=actor({roaring_heads:1.3});a.deBuffs=[status('slow'),status('slow'),status('poison')];a.resetBuild();assert.equal(a.stats.Warding,-65);assert.equal(a.stats.AttackSpeed,10);a.resetBuild();assert.equal(a.stats.AttackSpeed,10);assert.equal(raw(a,'roaring_heads').damage,8.25);
});
test('Roaring Heads reduces received Weakness and Shatter without changing outgoing potency',()=>{
 const[a,t]=pair({roaring_heads:2});const w=status('weakness');w.setSourceData('manual','Default',1);a.deBuffs=[w];near(w.getReceivedPotency(a),3.4);assert.equal(normal(a,t),74.63);const sh=status('shatter');sh.setSourceData('manual','Default',.3);near(sh.getReceivedPotency(a),1.02);near(sh.getReceivedPotency(t),3);assert.equal(w.getEffectivePotency(t),10);a.perks.roaring_heads=4;assert.equal(w.getReceivedPotency(a),0);
});
test('final manual Weakness override bypasses recipient reduction as labeled',()=>{
 const[a]=pair({roaring_heads:2});const w=status('weakness',.2);assert.equal(w.getReceivedPotency(a),2);
});
test('Roaring Heads keeps fractional received Shatter penetration through combat math',()=>{
 const[a,t]=pair();t.perks={roaring_heads:1};const sh=status('shatter');sh.setSourceData('manual','Default',.3);t.deBuffs=[sh];const r=run(a,t);assert.equal(r.modifiers.armor_mods.Shatter,-20.1);
});
test('Unmoving forces all received Slow to point three including manual overrides, without changing other statuses',()=>{
 const[a,t]=pair({unmoving:1});const s=status('slow',2);assert.equal(s.getReceivedPotency(a),3);assert.equal(s.getReceivedPotency(t),20);assert.equal(sourced(a,'slow','unmoving').sourceData.sourceInatePotency,.3);assert.equal(status('weakness',.5).getReceivedPotency(a),5);
});
test('Tailwind perk offers its scaled source and adds a fixed point one to other sources',()=>{
 const[a]=pair({tailwind:2,runic_winds:1});let b=sourced(a,'tailwind','tailwind');near(b.getReceivedPotency(a),3);b=sourced(a,'tailwind','runic_winds');near(b.getReceivedPotency(a),2);a.perks.tailwind=8;near(b.getReceivedPotency(a),2);b.effectivePotencyOverride=.4;assert.equal(b.getReceivedPotency(a),4);
});
test('Luminescent Fervor shared buff adds Holy on direct packets but not DoTs',()=>{
 const[a,t]=pair({luminescent_fervor:3});const b=sourced(a,'luminescent_fervor','luminescent_fervor');a.buff=[b];assert.equal(run(a,t).outputs.Holy.normal,15);assert.equal(normal(a,t,{sourceType:'Status'}),100);assert.deepEqual(a.damageTypes,{Physical:1});assert.equal(b.sourceData.sourceInatePotency,.3);
});
test('received Fervor works without owning the perk and uses applicant potency bonuses',()=>{
 const[a,t]=pair({luminescent_fervor:2,bastion_bless:1});const b=sourced(a,'luminescent_fervor','luminescent_fervor');b.appliedBy='opponent';t.buff=[b];assert.equal(run(t,a).outputs.Holy.normal,11);assert.equal(t.perks.luminescent_fervor,undefined);
});
test('Queen Power supplies shared attack speed and M1/M2 Summon scaling only',()=>{
 const[a,t]=pair({queen_s_power:2},{SummonBoost:100});a.buff=[sourced(a,'queen_s_power','queen_s_power')];a.resetBuild();assert.equal(a.stats.AttackSpeed,40);a.damageTypes={Physical:1};assert.equal(normal(a,t),140);assert.equal(normal(a,t,{sourceDamageType:'M2'}),140);assert.equal(normal(a,t,{sourceType:'WeaponArt'}),100);assert.deepEqual(a.damageScalings,{});a.resetBuild();assert.equal(a.stats.AttackSpeed,40);
});
test('received Queen Power stats work without owning the perk and retain existing speed stats',()=>{
 const[a,t]=pair({queen_s_power:1});t.mainArmor.helmet=new Item({id:'test',stats:{AttackSpeed:15,SummonBoost:50}});const b=sourced(a,'queen_s_power','queen_s_power');b.appliedBy='opponent';t.buff=[b];t.resetBuild();assert.equal(t.stats.AttackSpeed,45);t.damageTypes={Physical:1};assert.equal(normal(t,a),110);
});
test('Channeled Depths previews selected accumulated potency without mutating or auto-consuming it',()=>{
 const[a,t]=pair({channeled_depths:1});a.buff=[status('channeled_depths',.2)];assert.equal(run(a,t).outputs.Water.normal,100);assert.equal(normal(a,t,{sourceType:'Status'}),100);assert.equal(normal(a,t,{damage:0}),0);assert.equal(a.buff.length,1);assert.equal(a.buff[0].effectivePotencyOverride,.2);assert.equal(a.buff[0].countsAsBuff,false);
});
test('Cleansed Blade uses its shared separate Water-based multiplier rather than altering scaling',()=>{
 const[a,t]=pair({cleansed_blade:2},{WaterBoost:100});a.buff=[sourced(a,'cleansed_blade','cleansed_blade')];assert.equal(normal(a,t),130);assert.deepEqual(a.damageScalings,{});assert.equal(a.buff[0].countsAsBuff,undefined);a.perks={};assert.equal(normal(a,t),130);
});
test('Frenzy is a separate universal Rage multiplier and fixed incoming vulnerability',()=>{
 const[a,t]=pair({frenzy:2});assert.equal(normal(a,t),100);a.buff=[status('rage',.3)];a.damageTypes={Fire:1};assert.equal(normal(a,t),120);assert.equal(normal(t,a),130);a.damageTypes={Physical:1};assert.equal(normal(a,t),156);a.damageTypes={Hex:1};assert.equal(normal(a,t,{sourceType:'Status'}),120);assert.equal(a.buff.length,1);
});
for(const [tenacity,expected] of [[0,100],[1,115.5],[1.24,117.36],[2,123.25],[-.25,100]]){
 test(`Ferocity handles ${tenacity} Tenacity with the documented harmonic formula`,()=>{const[a,t]=pair({ferocity:1},{Tenacity:tenacity});assert.equal(normal(a,t),expected);const legacy=pair({ferocious:1},{Tenacity:tenacity});assert.equal(normal(...legacy),expected);});
}
test('Ferocity handles fractional perk counts and extreme manual Tenacity without an unbounded loop',()=>{
 const[a,t]=pair({ferocity:1.3},{Tenacity:1.24});assert.equal(normal(a,t),122.57);a.stats.Tenacity=1e12;assert.ok(Number.isFinite(normal(a,t)));a.stats.Tenacity=Infinity;assert.equal(normal(a,t),100);
});
const previews=[
 ['air_barrier',2,6,{Air:.5},{Air:1}],['gravity_well',2,24,{Earth:.5,Magic:.5},{Earth:.5,Magic:.5}],
 ['heavy_slate',1.3,3.9,{Earth:1},{Earth:1}],['royal_finisher',2,5,{Magic:1},{Magic:1}],
 ['echo_blast',2,5,{Air:1,Summon:1},{Air:1}],['stormcaller',3,24,{Air:1,Magic:1},{Air:.5,Magic:.5}],
 ['quake',2,7.5,{Earth:1},{Earth:1}],['golem_guillotine',2,12,{Earth:1},{Earth:1}],['screeching_sound',3,1,{Air:1},{Air:1}],
];
for(const [id,p,damage,scaling,output] of previews){
 test(`${id} previews one activation with source damage, scaling, and output`,()=>{const[a,t]=pair({[id]:p});near(raw(a,id).damage,damage);const d=PerkStore.getByID(id);assert.deepEqual(d.damageScalings,scaling);assert.deepEqual(d.damageTypes,output);assert.equal(normal(a,t),100);assert.ok(activation(a,t,id).total.normal>0);});
}
test('Barbed Flurry needs target Bleed and cannot receive Sharpshooter proc-hit bonuses',()=>{
 const[a,t]=pair({barbed_flurry:2,sharpshooter:1});a.buff=[status('sharpshooter_range')];assert.equal(raw(a,'barbed_flurry'),null);t.deBuffs=[status('bleed')];assert.equal(raw(a,'barbed_flurry').procCoefficient,0);assert.equal(activation(a,t,'barbed_flurry').total.normal,3.2);
});
test('Vile Presence remains a non-DoT, non-proccing perk packet',()=>{
 const[a,t]=pair({vile_presence:2,sharpshooter:2});a.buff=[status('sharpshooter_range')];const packet=normalizeBaseDamagePacket(raw(a,'vile_presence'));assert.equal(packet.procCoefficient,0);assert.ok(!packet.tags.includes('DoT'));assert.equal(activation(a,t,'vile_presence').total.normal,2.4);
});
test('Gnawing Poison requires this attacker as target Poison applicant',()=>{
 const[a,t]=pair({gnawing_poison:2});assert.equal(raw(a,'gnawing_poison'),null);t.deBuffs=[status('poison')];assert.equal(raw(a,'gnawing_poison').damage,16);t.deBuffs[0].appliedBy='self';assert.equal(raw(a,'gnawing_poison'),null);a.deBuffs=[status('poison')];assert.equal(raw(a,'gnawing_poison'),null);
});
test('Fiery Pursuit floors dash counts, retains fractional base damage, and counts as Weapon Art',()=>{
 const[a,t]=pair({fiery_pursuit:2.5,energize:1});a.buff=[status('energize_charged')];assert.equal(raw(a,'fiery_pursuit').damage,12.5);assert.equal(raw(a,'fiery_pursuit').hitAmount,2);assert.equal(raw(a,'fiery_pursuit').sourceType,'WeaponArt');assert.equal(activation(a,t,'fiery_pursuit').total.normal,37.5);a.perks.fiery_pursuit=.9;assert.equal(raw(a,'fiery_pursuit'),null);
});
test('Hex Ray uses attacker-applied received Weakness potency and cannot proc other perks',()=>{
 const[a,t]=pair({hex_ray:2});assert.equal(raw(a,'hex_ray'),null);const w=status('weakness');w.setSourceData('manual','Default',.3);t.deBuffs=[w];near(raw(a,'hex_ray').damage,11.2);assert.equal(raw(a,'hex_ray').procCoefficient,0);t.perks={roaring_heads:1};near(raw(a,'hex_ray').damage,9.814);w.appliedBy='self';assert.equal(raw(a,'hex_ray'),null);
});
test('Holy Tides exposes the documented scaled Regen source without inventing healing damage',()=>{
 const a=actor({holy_tides:1.3});assert.equal(sourced(a,'regen','holy_tides').sourceData.sourceInatePotency,.65);assert.equal(PerkStore.getByID('holy_tides').getPerkDamageInfo,undefined);
});
test('manual controls do not add Ork buff stacks or satisfy Emotional buffs-only conditions',()=>{
 const[a,t]=pair({emotional:1,carrying_winds:1});a.buff=['scenario_blocking','stoneskin_active','sharpshooter_range','stealth_advantage','maximum_voxos','inventory_bonus_capped','active_summons','hammer_slam','high_knockback'].map(id=>status(id));a.resetBuild();a.damageTypes={Physical:1};assert.equal(run(a,t,{sourceType:'WeaponArt'}).outputs.Hex,undefined);assert.equal(a.getCooldownPreview(60,'WeaponArt').value,60);
});
test('new output and proc previews are deterministic and preserve both builds and status selections',()=>{
 const[a,t]=pair({mortal_will:1,queen_s_power:1,luminescent_fervor:1,channeled_depths:1,fiery_pursuit:2});a.buff=[status('queen_s_power',.1),status('luminescent_fervor',.2),status('channeled_depths',.1)];const before=JSON.stringify(a.toSavedBuild());const r=run(a,t,{sourceDamageType:'M2'});assert.deepEqual(run(a,t,{sourceDamageType:'M2'}),r);assert.equal(JSON.stringify(a.toSavedBuild()),before);assert.deepEqual(a.damageTypes,{Physical:1});assert.ok(activation(a,t,'fiery_pursuit'));assert.equal(JSON.stringify(a.toSavedBuild()),before);
});
test('Stormcaller scales both boosts once, splits output, and takes independent target defenses',()=>{
 const[a,t]=pair({stormcaller:2},{AirBoost:100,MagicBoost:100});t.stats={AirDefense:100,MagicDefense:0};const r=activation(a,t,'stormcaller');assert.equal(r.outputs.Air.normal,18);assert.equal(r.outputs.Magic.normal,36);assert.equal(r.total.normal,54);
});
test('effect output preview includes shared status scaling and output without changing the weapon',()=>{
 const a=actor();a.blade=ItemStore.getByID('basic_blade','blade');a.handle=ItemStore.getByID('basic_handle','handle');a.buff=[status('queen_s_power',.2),status('luminescent_fervor',.1)];a.resetBuild();const before=JSON.stringify([a.damageTypes,a.damageScalings]);const preview=getActivePerkOutputPreview(a,actor());assert.equal(preview.damageScalings['M1: Summon'],.4);assert.equal(preview.damageTypes['M1: Holy'],.05);assert.equal(JSON.stringify([a.damageTypes,a.damageScalings]),before);
});
test('new shared statuses restore canonical behavior and final potency after save and reload',()=>{
 const a=actor({queen_s_power:2,luminescent_fervor:1,channeled_depths:1,cleansed_blade:1},{SummonBoost:100,WaterBoost:100});a.mainArmor.helmet=ItemStore.getByID('coral_templar_helmet','helmet');a.buff=[status('queen_s_power',.2),status('luminescent_fervor',.1),status('channeled_depths',.1),status('cleansed_blade',.1),status('high_knockback')];a.resetBuild();a.damageTypes={Physical:1};const restored=Build.dictToBuild(a.toSavedBuild());restored.damageTypes={Physical:1};assert.equal(restored.stats.AttackSpeed,40);assert.equal(restored.buff.find(b=>b.id==='high_knockback').countsAsBuff,false);assert.deepEqual(run(restored,actor()).outputs,run(a,actor()).outputs);
});
test('all forty reviewed paths remain finite together across direct, finisher, and activation previews',()=>{
 const[a,t]=pair(Object.fromEntries(ids.map(id=>[id,1.3])),{Tenacity:1.24,WaterBoost:80,AirBoost:60,SummonBoost:75});a.buff=['scenario_blocking','stoneskin_active','sharpshooter_range','stealth_advantage','maximum_voxos','inventory_bonus_capped','active_summons','hammer_slam','high_knockback','guaranteed_crit','rage','air_pressure','queen_s_power','luminescent_fervor','channeled_depths','cleansed_blade'].map(id=>status(id,.2));a.deBuffs=[status('slow'),status('shatter'),status('weakness')];t.deBuffs=[status('poison'),status('bleed'),status('weakness')];a.resetBuild();a.damageTypes={Physical:1};const before=JSON.stringify([a.toSavedBuild(),t.toSavedBuild(),a.stats]);
 for(const extra of [{},{sourceDamageType:'M2'},{sourceType:'WeaponArt',tags:['Finisher']},{sourceType:'Status'}]){const r=run(a,t,extra);assert.ok(Number.isFinite(r.total.normal));assert.ok(Number.isFinite(r.total.average));assert.deepEqual(run(a,t,extra),r);}
 for(const id of ids)if(PerkStore.getByID(id).getPerkDamageInfo){const r=activation(a,t,id);if(r)assert.ok(Number.isFinite(r.total.normal),id);}
 assert.equal(JSON.stringify([a.toSavedBuild(),t.toSavedBuild(),a.stats]),before);
});
test('zero and negative perk amounts do not activate their conditional or proc paths',()=>{
 for(const amount of [0,-1]){const[a,t]=pair(Object.fromEntries(ids.map(id=>[id,amount])));a.buff=['scenario_blocking','stoneskin_active','sharpshooter_range','stealth_advantage','maximum_voxos','inventory_bonus_capped','active_summons','hammer_slam','high_knockback'].map(id=>status(id));t.deBuffs=[status('bleed'),status('poison'),status('taunt'),status('weakness')];assert.equal(normal(a,t,{sourceType:'WeaponArt',tags:['Finisher']}),100);for(const id of ids)if(PerkStore.getByID(id).getPerkDamageInfo)assert.equal(raw(a,id),null,id);}
});
