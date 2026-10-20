const test = require('node:test');
const assert = require('node:assert/strict');
const { Build } = require('../src/models/Build.ts');
const { Item, ItemStore } = require('../src/models/Item.ts');
const { BuffStore } = require('../src/models/Buffs.ts');
const { WeaponArtStore } = require('../src/models/WeaponArt.ts');
const { Perks } = require('../src/data/Perks.ts');
const helper = require('../src/public/helper.ts');

function pair() {
  const attacker = new Build(), target = new Build();
  attacker.level = 0;
  attacker.damageTypes = { Physical: 1 };
  attacker.target = target;
  target.target = attacker;
  return [attacker, target];
}
const packet = overrides => ({ damage: 100, hitAmount: 1, source: 'test', sourceType: 'Weapon', sourceDamageType: 'M1', ...overrides });
const damage = (a, t, overrides) => helper.runDamage(packet(overrides), a, t)[1];

test('penetration equals defense removes mitigation without removing damage', () => {
  const [a, t] = pair();
  a.stats.ArmorPenetration = 20; t.stats.PhysicalDefense = 20;
  assert.equal(damage(a, t).normal, 100);
});
test('target offensive penetration does not penetrate its own defense', () => {
  const [a, t] = pair(); t.stats = { PhysicalDefense: 20, ArmorPenetration: 20 };
  assert.equal(damage(a, t).normal, damage(a, Object.assign(new Build(), {stats:{PhysicalDefense:20}})).normal);
});
test('Human uses percent HP, excludes the boundary, and reduces incoming damage directly', () => {
  const [a, t] = pair(); a.perks = { human: 1 }; a.maxHp = 300;
  for (const hp of [300, 150]) { a.hp = hp; assert.equal(damage(a, t).normal, 100); }
  a.hp = 149; assert.equal(damage(a, t).normal, 120);
  a.perks = {}; t.perks = { human: 1 }; t.hp = 25; t.maxHp = 100;
  assert.equal(damage(a, t).normal, 80);
});
test('Cut Down reads target HP from combat context', () => {
  const [a, t] = pair(); a.perks = { cut_down: 1 };
  t.hp = t.maxHp; assert.equal(damage(a, t).normal, 130);
  t.hp = t.maxHp / 2; assert.equal(damage(a, t).normal, 115);
});
test('DoT packets do not crit or gain Reaper, while direct hits still do', () => {
  const [a, t] = pair(); a.perks = { reaper: 1 }; a.stats.CritRate = 100;
  t.deBuffs = [BuffStore.getByID('bleed')];
  assert.deepEqual(damage(a, t, { source: 'burn', sourceType: 'Status', sourceDamageType: 'Status' }), {normal:100,crit:100,average:100});
  assert.equal(damage(a, t).average, 157.5);
});
test('hitAmount represents repeated per-hit damage', () => {
  const [a, t] = pair(); assert.equal(damage(a, t, { hitAmount: 3 }).normal, 300);
});
test('Voltaic Body preview uses exponentiation', () => {
  const [a] = pair(); assert.ok(Math.abs(Perks.voltaic_body.getPerkDamageInfo.call(a,1).damage - 10.2) < 1e-9);
});
test('saving retains chosen status potency and weapon-art definitions', () => {
  const [a] = pair(); const status = BuffStore.getByID('rage');
  status.setSourceData('rage_rune', 'Rune', 0.3); status.potency = 0.2;
  a.buff = [status]; a.weaponart = WeaponArtStore.getByID('spin');
  const loaded = Build.dictToBuild(JSON.parse(a.buildToJson()));
  assert.deepEqual(loaded.buff[0].sourceData, status.sourceData);
  assert.equal(loaded.buff[0].potency, 0.2);
  assert.equal(loaded.weaponart.name, 'Spin');
  assert.equal(loaded.weaponart.baseDamage, 27);
});
test('legacy saves still restore selected statuses and retain zero HP', () => {
  const [a] = pair(); const saved = a.toSavedBuild();
  delete saved.buffs; delete saved.debuffs;
  saved.buffIds = ['rage']; saved.hp = 0;
  const loaded = Build.dictToBuild(saved);
  assert.equal(loaded.buff[0].id, 'rage'); assert.equal(loaded.hp, 0);
});
test('armor perk aliases resolve before aggregation', () => {
  const [a] = pair();
  a.mainArmor.chestplate = new Item({ stats: { Tenacity: 1 }, perks: { immovable: 1 } });
  a.resetBuild(); assert.equal(a.stats.PhysicalDefense, 30);
});

test('resolving a snapshot twice is deterministic and leaves builds and statuses unchanged', () => {
  const [a, t] = pair(); a.perks = { hemorrhage: 1 };
  const bleed = BuffStore.getByID('bleed'); bleed.setSourceData('test', 'Perk', 0.1); t.deBuffs = [bleed];
  const before = JSON.stringify({stats:a.stats,perks:a.perks,types:a.damageTypes,status:t.deBuffs,diagnostics:a.damageModifications});
  const first = helper.resolveDamage(packet(), a, t);
  assert.deepEqual(helper.resolveDamage(packet(), a, t), first);
  assert.equal(JSON.stringify({stats:a.stats,perks:a.perks,types:a.damageTypes,status:t.deBuffs,diagnostics:a.damageModifications}), before);
  assert.ok(first.outputs.True);
});
test('whole-cast totals are not multiplied twice', () => {
  const [a,t] = pair();
  const spin = helper.getWeaponArtBaseDamagePacket(WeaponArtStore.getByID('spin'));
  assert.equal(helper.resolveDamage(spin,a,t).total.normal, 27);
  const stabs = helper.getWeaponArtBaseDamagePacket(WeaponArtStore.getByID('rapid_stabs'));
  assert.equal(helper.resolveDamage(stabs,a,t).total.normal, 26.25);
  assert.ok(stabs.tags.includes('Finisher'));
});
test('manual status potency and charge hit count survive a save', () => {
  const [a] = pair(); const rage=BuffStore.getByID('rage'); rage.effectivePotencyOverride=0.4;
  const charge=BuffStore.getByID('static_charge'); charge.stacks=3; a.buff=[rage,charge];
  const loaded=Build.dictToBuild(a.toSavedBuild());
  assert.equal(loaded.buff[0].getEffectivePotency(loaded),4);
  assert.equal(loaded.buff[1].stacks,3);
  assert.ok(Math.abs(Perks.voltaic_body.getPerkDamageInfo.call(loaded,1).damage - 12 * 0.85**3) < 1e-9);
});
test('true damage ignores penetration and output coefficients can sum above one', () => {
  const [a,t] = pair();a.damageTypes={Physical:1,True:0.5};a.stats.ArmorPenetration=200;t.stats.PhysicalDefense=20;
  assert.equal(helper.resolveDamage(packet(),a,t).outputs.True.normal,50);
});
test('invalid damage is rejected instead of producing NaN output', () => {
  const [a,t]=pair();
  assert.throws(()=>helper.resolveDamage(packet({damage:NaN}),a,t));
  assert.throws(()=>helper.resolveDamage(packet({damage:Infinity}),a,t));
});

test('manual Rage boosts physical output and Reinforce uses diminishing returns', () => {
  const [a,t]=pair();
  const rage=BuffStore.getByID('rage');rage.effectivePotencyOverride=0.4;a.buff=[rage];
  assert.equal(damage(a,t).normal,140);
  a.damageTypes={Magic:1};assert.equal(damage(a,t).normal,100);
  const reinforce=BuffStore.getByID('reinforce');reinforce.effectivePotencyOverride=0.4;t.buff=[reinforce];
  assert.equal(damage(a,t).normal,71.43);
});
test('a target Highlander perk never subtracts from incoming penetration', () => {
  const [a,t]=pair();t.perks={highlander:5};t.stats.PhysicalDefense=100;
  assert.equal(damage(a,t,{sourceType:'Rune',sourceDamageType:'Rune'}).normal,50);
});
