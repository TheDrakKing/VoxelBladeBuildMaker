import * as ItemModule from "../models/Item.js";
import * as WeaponTypes from "../models/WeaponTypes.js";
import * as Build from "../models/Build.js";
import * as BuffModule from "../models/Buffs.js";
import * as Perks from "../models/Perk.js";
import * as WeaponArtModule from "../models/WeaponArt.js";
import * as targets from "./targets.js";

export type SerializedBuild = {
	level: number;
	stats: { [k in ItemModule.stat]?: number };
	potencies: Build.potencies;
	damageScalings: Build.damageScalings;
	damageTypes: Build.damageTypes;
	perks: Build.perks;
	user: Build.Build;
	buff: Build.buffs;
	deBuffs: Build.buffs;
  target?: SerializedBuild;
};

type baseDamagePacketInput = {
  damage: number;
  hitAmount?: number;
  source: string;
  sourceType: sourceType;
  sourceDamageType: string;
};

type weaponBaseDamagePackets = {
  constructionType: string;
  m1: baseDamageData[];
  m2: baseDamageData[];
};

type numericMap = { [id: string]: number };
type damageBreakdown = Build.damageBreakdown;
type perkOutputPreview = {
  damageScalings: numericMap;
  damageTypes: numericMap;
};

// Damage breakdown helpers
function createDamageBreakdown(
  normal = 0,
  crit = 0,
  average = 0,
): damageBreakdown {
  return { normal, crit, average };
}

function multiplyDamageBreakdown(
  breakdown: damageBreakdown,
  multiplier: number,
): damageBreakdown {
  return {
    normal: breakdown.normal * multiplier,
    crit: breakdown.crit * multiplier,
    average: breakdown.average * multiplier,
  };
}

function addDamageBreakdowns(
  current: damageBreakdown,
  next: damageBreakdown,
): damageBreakdown {
  return {
    normal: current.normal + next.normal,
    crit: current.crit + next.crit,
    average: current.average + next.average,
  };
}

function roundDamageBreakdown(
  breakdown: damageBreakdown,
  decimals = 2,
): damageBreakdown {
  const multiplier = 10 ** decimals;
  return {
    normal: Math.round(breakdown.normal * multiplier) / multiplier,
    crit: Math.round(breakdown.crit * multiplier) / multiplier,
    average: Math.round(breakdown.average * multiplier) / multiplier,
  };
}

function truncateDamageBreakdown(
  breakdown: damageBreakdown,
  decimals = 1,
): damageBreakdown {
  const multiplier = 10 ** decimals;
  return {
    normal: Math.trunc(breakdown.normal * multiplier) / multiplier,
    crit: Math.trunc(breakdown.crit * multiplier) / multiplier,
    average: Math.trunc(breakdown.average * multiplier) / multiplier,
  };
}

// Shared math helpers
function totalMultiplier(modifications: numericMap, treatAsBonus?: boolean): number {
	let total = undefined;

	for (const value of Object.values(modifications) as (number | undefined)[]) {
    if (value === undefined) continue;

    if (treatAsBonus) {
      total = total === undefined ? 1 + value : total * (1 + value);
    } else {
      total = total === undefined ? value : total * value;
    }
  }

  if (treatAsBonus) {
    return total === undefined || total === 0 ? 1 : total;
  }

	return total === undefined ? 1 : total;
}

function levelBoost(build: SerializedBuild): number {
  const boost = build.level * 1.25;
  build.user.damageModifications.damage_bonus_mods["Level"] = boost / 100;
  return boost;
}

function baseArmorMultiplier(def: number): number {
  if (!def) return 1;

  let armorMultiplier = 1;

  if (def > 0) {
    armorMultiplier = 1 / (1 + def / 100);
  } else if (def < 0) {
    armorMultiplier = 1 + (-1 * def) / 100;
  }

  return Math.trunc(armorMultiplier * 100) / 100;
}

function penetrationArmorMultiplier(
  damageType: ItemModule.damageType,
  def: number,
  totalPen?: number,
): number {
  if (damageType === "True" || !totalPen || totalPen === 0) {
    return baseArmorMultiplier(def);
  }

  const armor = def / 100;
  const pen = totalPen / 100;
  const highArmorPoint = pen + 0.2;

  let penetrationMultiplier = 0;

  if (armor <= highArmorPoint) {
    const armorMultiplier = armor - pen;

    if (armorMultiplier > 0) {
      penetrationMultiplier = 1 / (1 + armorMultiplier);
    } else if (armorMultiplier < 0) {
      penetrationMultiplier = 1 - armorMultiplier;
    }
  } else {
    const armorMultiplier = armor / (1 + 5 * pen);
    penetrationMultiplier = 1 / (1 + armorMultiplier);
  }

  return Math.trunc(penetrationMultiplier * 10) / 10;
}

// Modifier collection
function getPerkModifications(
  event: keyof ItemModule.events,
  holder: SerializedBuild,
  outputType?: string,
  baseDamageData?: baseDamageData,
  modifications?: numericMap,
) {
  const perkModifications = {} as Build.perks;

  for (const [perk, amount] of Object.entries(holder.perks)) {
    const perkData = Perks.PerkStore.getByID(perk);
    const callback = perkData[event];
    if (!callback) continue;

    const value = (callback as any).apply(holder as unknown as Build.Build, [
      amount,
      { outputType, baseDamageData },
    ]);

    if (value === undefined || value === null) continue;

    if (modifications) modifications[perkData.name] = value;
    perkModifications[perkData.name] = value;
  }

  return perkModifications;
}

function getStatusSourceBuild(
  holder: SerializedBuild,
  status: BuffModule.Buff,
) {
  if (status.category === "Debuff") {
    return holder.target?.user || holder.user.target || holder.user;
  }

  return holder.user;
}

function getStatusEffectivePotency(
  holder: SerializedBuild,
  status: BuffModule.Buff,
) {
  return status.getEffectivePotency?.(getStatusSourceBuild(holder, status));
}

function getDebuffModifications(
  event: keyof ItemModule.events,
  holder: SerializedBuild,
  outputType?: string,
  baseDamageData?: baseDamageData,
  modifications?: numericMap,
) {
  const statusModifications = {} as Build.perks;
  if (!holder.deBuffs) return statusModifications;

  for (const debuff of holder.deBuffs) {
    if (!debuff) continue;

    const callback = debuff[event];
    if (!callback) continue;

    const potency = getStatusEffectivePotency(holder, debuff);
    const value = (callback as any).apply(holder as unknown as Build.Build, [
      potency,
      { outputType, baseDamageData },
    ]);

    if (value === undefined || value === null) continue;

    if (modifications) modifications[debuff.name!] = value;
    statusModifications[debuff.name!] = value;
  }

  return statusModifications;
}

function getBuffModifications(
  event: keyof ItemModule.events,
  holder: SerializedBuild,
  outputType?: string,
  baseDamageData?: baseDamageData,
  modifications?: numericMap,
) {
  const statusModifications = {} as Build.perks;
  if (!holder.buff) return statusModifications;

  for (const buff of holder.buff) {
    if (!buff) continue;

    const callback = buff[event];
    if (!callback) continue;

    const potency = getStatusEffectivePotency(holder, buff);
    const value = (callback as any).apply(holder as unknown as Build.Build, [
      potency,
      { outputType, baseDamageData },
    ]);

    if (value === undefined || value === null) continue;

    if (modifications) modifications[buff.name!] = value;
    statusModifications[buff.name!] = value;
  }

  return statusModifications;
}

function collectEventModifications(
  event: keyof ItemModule.events,
  holder: SerializedBuild,
  outputType?: string,
  baseDamageData?: baseDamageData,
  modifications?: numericMap,
) {
  return [
    getPerkModifications(event, holder, outputType, baseDamageData, modifications),
    getBuffModifications(event, holder, outputType, baseDamageData, modifications),
    getDebuffModifications(event, holder, outputType, baseDamageData, modifications),
  ];
}

function sumCollectedValues(...collections: Array<numericMap | undefined>) {
  return collections.reduce((total, collection) => {
    if (!collection) return total;
    return total + Object.values(collection).reduce((sum, value) => sum + value, 0);
  }, 0);
}

function multiplyBonusCollections(...collections: Array<numericMap | undefined>) {
  return collections.reduce((product, collection) => {
    if (!collection) return product;
    return product * totalMultiplier(collection, true);
  }, 1);
}

// Packet builders
export function normalizeBaseDamagePacket(
  packet?: Partial<baseDamageData> | null,
): baseDamageData | null {
  if (!packet || typeof packet.damage !== "number") return null;

  return {
    damage: packet.damage,
    hitAmount: typeof packet.hitAmount === "number" && packet.hitAmount > 0 ? packet.hitAmount : 1,
    source: packet.source || "Unknown",
    sourceType: packet.sourceType || "normal",
    sourceDamageType: packet.sourceDamageType || packet.sourceType || "Unknown",
    outputDamages: packet.outputDamages,
    totalDamage: packet.totalDamage,
  };
}

export function createBaseDamagePacket(
  packet: baseDamagePacketInput,
): baseDamageData {
  return normalizeBaseDamagePacket(packet)!;
}

function createDamagePackets(
  damageEntries: WeaponTypes.damageAmount | undefined,
  source: string,
  sourceType: sourceType,
  sourceDamageType: string,
): baseDamageData[] {
  if (!damageEntries?.length) return [];

  return damageEntries.map(([damage, hitAmount]) =>
    createBaseDamagePacket({
      damage,
      hitAmount,
      source,
      sourceType,
      sourceDamageType,
    }),
  );
}

export function getRuneBaseDamagePacket(rune?: ItemModule.Item): baseDamageData | null {
  if (!rune || typeof rune.baseDamage !== "number") return null;

  return createBaseDamagePacket({
    damage: rune.baseDamage,
    hitAmount: 1,
    source: rune.id || rune.name || "Rune",
    sourceType: "Rune",
    sourceDamageType: "Rune",
  });
}

export function getWeaponArtBaseDamagePacket(
  weaponArt?: WeaponArtModule.WeaponArt,
): baseDamageData | null {
  if (!weaponArt || typeof weaponArt.baseDamage !== "number") return null;

  return createBaseDamagePacket({
    damage: weaponArt.baseDamage,
    hitAmount: weaponArt.totalHits || 1,
    source: weaponArt.id || weaponArt.name || "WeaponArt",
    sourceType: "WeaponArt",
    sourceDamageType: "WeaponArt",
  });
}

// Damage pipeline
function getTotEffBoost(build: SerializedBuild): [number, number] {
  let totalEffectiveBoost = 0;

  for (const [scale, value] of Object.entries(build.damageScalings) as [ItemModule.scale, number?][]) {
    if (value === undefined) continue;

    const statId = (scale + "Boost") as ItemModule.stat;
    const statBoost = build.stats[statId];
    if (!statBoost) continue;

    const statEffectiveBoost = value * statBoost;
    build.user.effectiveBoosts[statId] = statEffectiveBoost;
    totalEffectiveBoost += statEffectiveBoost;
  }

  const multiplier = 1 + totalEffectiveBoost / 100;
  return [multiplier, multiplier * 100];
}

function calculatePreOutputDamage(
  damageData: baseDamageData,
  attacker: SerializedBuild,
  target: SerializedBuild,
): number {
  if (!damageData.damage) return 0;

  const [effectiveBoostMultiplier, totalEffectiveBoost] = getTotEffBoost(attacker);
  attacker.user.totEffBoost = totalEffectiveBoost;

  const baseDamage = damageData.damage * effectiveBoostMultiplier;
  const levelMultiplier = 1 + levelBoost(attacker) / 100;

  const attackerDamageBonus = multiplyBonusCollections(
    ...collectEventModifications(
      "onDmgBonusMultiplier",
      attacker,
      undefined,
      damageData,
      attacker.user.damageModifications.damage_bonus_mods,
    ),
  );

  const targetDamageReduction = multiplyBonusCollections(
    ...collectEventModifications(
      "onDmgReducedMultiplier",
      target,
      undefined,
      damageData,
      attacker.user.damageModifications.damage_reduced_mods,
    ),
  );

  const attackerDamagePenalty = multiplyBonusCollections(
    ...collectEventModifications(
      "onDecreaseDmgBonusMultiplier",
      attacker,
      undefined,
      damageData,
      attacker.user.damageModifications.damage_reduced_mods,
    ),
  );

  return (baseDamage * levelMultiplier * attackerDamageBonus) /
    (targetDamageReduction * attackerDamagePenalty);
}

function getCritDamageBreakdown(
  damage: number,
  attacker: SerializedBuild,
  outputType: ItemModule.damageType,
  damageData: baseDamageData,
): damageBreakdown {
  const baseCritRate = 0;
  const baseCritDamage = 0.5;
  const statCritRate = (attacker.stats["CritRate"] || 0) / 100;
  const statCritDamage = (attacker.stats["CritDamage"] || 0) / 100;

  const bonusCritRate = sumCollectedValues(
    ...collectEventModifications(
      "onCritRateCalculation",
      attacker,
      outputType,
      damageData,
      attacker.user.damageModifications.crit_mods,
    ),
  );

  const bonusCritDamage = sumCollectedValues(
    ...collectEventModifications(
      "onCritDamageCalculation",
      attacker,
      outputType,
      damageData,
      attacker.user.damageModifications.crit_mods,
    ),
  );

  let critRate = baseCritRate + statCritRate + bonusCritRate;
  let critDamageBonus = baseCritDamage + statCritDamage + bonusCritDamage;

  critRate = Math.max(0, Math.min(1, critRate));
  critDamageBonus = Math.max(0, critDamageBonus);

  attacker.user.damageModifications.crit_mods["Crit Rate"] = critRate;
  attacker.user.damageModifications.crit_mods["Crit Damage"] = critDamageBonus;

  return createDamageBreakdown(
    damage,
    damage * (1 + critDamageBonus),
    damage * ((1 - critRate) + critRate * (1 + critDamageBonus)),
  );
}

function getModifiedDefenseValue(
  outputType: ItemModule.damageType,
  damageData: baseDamageData,
  target: SerializedBuild,
  attacker: SerializedBuild,
) {
  const defenseStat = (outputType + "Defense") as ItemModule.stat;
  const baseDefense = target.stats[defenseStat] || 0;

  const armorAdjustment = sumCollectedValues(
    ...collectEventModifications(
      "onArmorModified",
      target,
      outputType,
      damageData,
      attacker.user.damageModifications.armor_mods,
    ),
  );

  return baseDefense + armorAdjustment;
}

function getTotalArmorPenetration(
  outputType: ItemModule.damageType,
  damageData: baseDamageData,
  attacker: SerializedBuild,
  target: SerializedBuild,
) {
  const attackerPen = sumCollectedValues(
    ...collectEventModifications(
      "onArmorPenCalculation",
      attacker,
      outputType,
      damageData,
      attacker.user.damageModifications.armor_mods,
    ),
  ) + (attacker.stats["ArmorPenetration"] || 0);

  const targetPen = sumCollectedValues(
    ...collectEventModifications(
      "onArmorPenCalculation",
      target,
      outputType,
      damageData,
      attacker.user.damageModifications.armor_mods,
    ),
  ) * -1;

  return attackerPen + targetPen + (target.stats["ArmorPenetration"] || 0);
}

function applyArmorMultiplier(
  damage: damageBreakdown,
  outputType: ItemModule.damageType,
  damageData: baseDamageData,
  attacker: SerializedBuild,
  target: SerializedBuild,
) {
  const modifiedDefense = getModifiedDefenseValue(outputType, damageData, target, attacker);
  const totalPenetration = getTotalArmorPenetration(outputType, damageData, attacker, target);
  const armorMultiplier = penetrationArmorMultiplier(outputType, modifiedDefense, totalPenetration);

  return multiplyDamageBreakdown(damage, armorMultiplier);
}

function getSpecialDamageTakenMultiplier(
  outputType: ItemModule.damageType,
  damageData: baseDamageData,
  target: SerializedBuild,
  attacker: SerializedBuild,
) {
  const specificTakenMultiplier = multiplyBonusCollections(
    ...collectEventModifications(
      "onIncreaseSpecificDmgTaken",
      target,
      outputType,
      damageData,
      attacker.user.damageModifications.special_mods,
    ),
  );

  const generalTakenMultiplier = multiplyBonusCollections(
    ...collectEventModifications(
      "onIncreaseDmgTaken",
      target,
      outputType,
      damageData,
      attacker.user.damageModifications.special_mods,
    ),
  );

  return specificTakenMultiplier * generalTakenMultiplier;
}

function applySpecialMultipliers(
  damage: damageBreakdown,
  outputType: ItemModule.damageType,
  damageData: baseDamageData,
  target: SerializedBuild,
  attacker: SerializedBuild,
) {
  return multiplyDamageBreakdown(
    damage,
    getSpecialDamageTakenMultiplier(outputType, damageData, target, attacker),
  );
}

function calculatePostOutputDamage(
  outputDamage: number,
  outputType: ItemModule.damageType,
  damageData: baseDamageData,
  attacker: SerializedBuild,
  target: SerializedBuild,
): damageBreakdown {
  const attackerSpecificBonus = multiplyBonusCollections(
    ...collectEventModifications(
      "onSpecificDmgBonusMultiplier",
      attacker,
      outputType,
      damageData,
      attacker.user.damageModifications.specific_bonus_mods,
    ),
  );

  const targetSpecificReduction = multiplyBonusCollections(
    ...collectEventModifications(
      "onSpecificDmgReducedMultiplier",
      target,
      outputType,
      damageData,
      attacker.user.damageModifications.specific_reduced_mods,
    ),
  );

  const attackerSpecificPenalty = multiplyBonusCollections(
    ...collectEventModifications(
      "onDecreaseSpecificDmgBonusMultiplier",
      attacker,
      outputType,
      damageData,
      attacker.user.damageModifications.specific_reduced_mods,
    ),
  );

  const typeAdjustedDamage = (outputDamage * attackerSpecificBonus) /
    (targetSpecificReduction * attackerSpecificPenalty);

  const critAdjustedDamage = getCritDamageBreakdown(
    typeAdjustedDamage,
    attacker,
    outputType,
    damageData,
  );

  const armorAdjustedDamage = applyArmorMultiplier(
    critAdjustedDamage,
    outputType,
    damageData,
    attacker,
    target,
  );

  return applySpecialMultipliers(
    armorAdjustedDamage,
    outputType,
    damageData,
    target,
    attacker,
  );
}

export function calculateDamage(
  outputType: ItemModule.damageType,
  outputTypeMultiplier: number,
  damageData: baseDamageData,
  attacker: SerializedBuild,
  target: SerializedBuild,
  preOutputDamage?: number,
): damageBreakdown {
  if (!damageData.damage) return createDamageBreakdown();

  const resolvedOutputTypeMultiplier = outputTypeMultiplier || attacker.damageTypes[outputType] || 0;
  const resolvedPreOutputDamage = preOutputDamage ?? calculatePreOutputDamage(damageData, attacker, target);
  const splitDamage = resolvedPreOutputDamage * resolvedOutputTypeMultiplier;

  return calculatePostOutputDamage(splitDamage, outputType, damageData, attacker, target);
}

// Execution helpers
function cloneNumericMap<T extends string>(
  values?: Partial<Record<T, number>>,
): Partial<Record<T, number>> {
  return { ...(values || {}) };
}

function createSerializedBuild(
  user: Build.Build,
  buildData?: Partial<SerializedBuild>,
  targetBuild?: SerializedBuild,
): SerializedBuild {
  return {
    level: buildData?.level ?? user.level,
    stats: cloneNumericMap(buildData?.stats ?? user.stats) as SerializedBuild["stats"],
    potencies: cloneNumericMap(buildData?.potencies ?? user.potencies) as Build.potencies,
    perks: cloneNumericMap(buildData?.perks ?? user.perks) as Build.perks,
    damageScalings: cloneNumericMap(buildData?.damageScalings ?? user.damageScalings) as Build.damageScalings,
    damageTypes: cloneNumericMap(buildData?.damageTypes ?? user.damageTypes) as Build.damageTypes,
    buff: [...(buildData?.buff ?? user.buff ?? [])],
    deBuffs: [...(buildData?.deBuffs ?? user.deBuffs ?? [])],
    user,
    target: targetBuild,
  };
}

function applyOutputCalculationEffects(
  holder: SerializedBuild,
  baseDamageData: baseDamageData,
) {
  const args: ItemModule.eventsArgs = { baseDamageData };

  applyPerkOutputCalculationEffects(holder, args);
  applyStatusOutputCalculationEffects(holder, args);
}

function applyPerkOutputCalculationEffects(
  holder: SerializedBuild,
  args: ItemModule.eventsArgs,
) {
  for (const [perk, amount] of Object.entries(holder.perks)) {
    const perkData = Perks.PerkStore.getByID(perk);
    const callback = perkData.onOutputCalculation;
    if (!callback) continue;
    callback.apply(holder as unknown as Build.Build, [amount, args]);
  }
}

function applyStatusOutputCalculationEffects(
  holder: SerializedBuild,
  args: ItemModule.eventsArgs,
) {
  for (const buff of holder.buff) {
    if (!buff?.onOutputCalculation) continue;
    buff.onOutputCalculation.apply(holder as unknown as Build.Build, [
      getStatusEffectivePotency(holder, buff),
      args,
    ]);
  }

  for (const debuff of holder.deBuffs) {
    if (!debuff?.onOutputCalculation) continue;
    debuff.onOutputCalculation.apply(holder as unknown as Build.Build, [
      getStatusEffectivePotency(holder, debuff),
      args,
    ]);
  }
}

function collectNumericDiffs(
  beforeValues: Partial<Record<string, number>>,
  afterValues: Partial<Record<string, number>>,
  sourceLabel: string,
  previewMap: numericMap,
) {
  const keys = new Set([
    ...Object.keys(beforeValues || {}),
    ...Object.keys(afterValues || {}),
  ]);

  for (const key of keys) {
    const beforeValue = beforeValues[key] || 0;
    const afterValue = afterValues[key] || 0;
    const diff = Math.round((afterValue - beforeValue) * 10000) / 10000;
    if (!diff) continue;

    previewMap[`${sourceLabel}: ${key}`] = diff;
  }
}

function collectPerkOutputPreviewForPacket(
  attacker: Build.Build,
  target: Build.Build,
  packet: baseDamageData,
  preview: perkOutputPreview,
) {
  const targetBuild = createSerializedBuild(target);
  const attackerBuild = createSerializedBuild(attacker, undefined, targetBuild);
  targetBuild.target = attackerBuild;

  const beforeDamageScalings = cloneNumericMap(attackerBuild.damageScalings);
  const beforeDamageTypes = cloneNumericMap(attackerBuild.damageTypes);

  applyPerkOutputCalculationEffects(attackerBuild, { baseDamageData: packet });

  collectNumericDiffs(
    beforeDamageScalings,
    attackerBuild.damageScalings,
    packet.sourceDamageType,
    preview.damageScalings,
  );
  collectNumericDiffs(
    beforeDamageTypes,
    attackerBuild.damageTypes,
    packet.sourceDamageType,
    preview.damageTypes,
  );
}

export function getActivePerkOutputPreview(
  attacker: Build.Build,
  target: Build.Build,
): perkOutputPreview {
  const preview: perkOutputPreview = {
    damageScalings: {},
    damageTypes: {},
  };

  const weaponBaseDamagePackets = getWeaponBaseDamagePackets(attacker);
  const seenSourceLabels = new Set<string>();

  for (const packet of [...weaponBaseDamagePackets.m1, ...weaponBaseDamagePackets.m2]) {
    if (seenSourceLabels.has(packet.sourceDamageType)) continue;
    seenSourceLabels.add(packet.sourceDamageType);
    collectPerkOutputPreviewForPacket(attacker, target, packet, preview);
  }

  const runePacket = getRuneBaseDamagePacket(attacker.mainArmor.rune);
  if (runePacket) {
    collectPerkOutputPreviewForPacket(attacker, target, runePacket, preview);
  }

  const weaponArtPacket = getWeaponArtBaseDamagePacket(attacker.weaponart);
  if (weaponArtPacket) {
    collectPerkOutputPreviewForPacket(attacker, target, weaponArtPacket, preview);
  }

  return preview;
}

export function runDamage(
  baseDamage: baseDamageData,
  attacker: Build.Build,
  target: Build.Build,
  attackerBuild?: SerializedBuild,
  targetBuild?: SerializedBuild,
): [Build.outputDamage, damageBreakdown] {
  const outputDamages: Build.outputDamage = {};
  let totalDamage = createDamageBreakdown();

  targetBuild = createSerializedBuild(target, targetBuild);
  attackerBuild = createSerializedBuild(attacker, attackerBuild, targetBuild);
  targetBuild.target = attackerBuild;
  attackerBuild.target = targetBuild;

  applyOutputCalculationEffects(attackerBuild, baseDamage);

  const damageTypes = attackerBuild.damageTypes || {} as Build.damageTypes;
  const preOutputDamage = calculatePreOutputDamage(baseDamage, attackerBuild, targetBuild);

  for (const outputType of Object.keys(damageTypes) as ItemModule.damageType[]) {
    const outputTypeMultiplier = damageTypes[outputType];
    if (!outputTypeMultiplier) continue;

    const damage = calculateDamage(
      outputType,
      outputTypeMultiplier,
      baseDamage,
      attackerBuild,
      targetBuild,
      preOutputDamage,
    );

    outputDamages[outputType] = roundDamageBreakdown(damage);
    totalDamage = addDamageBreakdowns(totalDamage, outputDamages[outputType]!);
  }

  return [outputDamages, roundDamageBreakdown(totalDamage)];
}

// Weapon helpers
export function getWeaponBaseDamagePackets(build: Build.Build): weaponBaseDamagePackets {
  const weaponConstructionData = build.getWeaponConstructionData() || {
    constructionType: "None",
    m1: [],
    m2: [],
  };

  return {
    constructionType: weaponConstructionData.constructionType,
    m1: createDamagePackets(
      weaponConstructionData.m1,
      weaponConstructionData.constructionType,
      "Weapon",
      "M1",
    ),
    m2: createDamagePackets(
      weaponConstructionData.m2,
      weaponConstructionData.constructionType,
      "Weapon",
      "M2",
    ),
  };
}

function getWeaponDamages(attacker: Build.Build, target: Build.Build) {
  const weaponBaseDamagePackets = getWeaponBaseDamagePackets(attacker);

  let m1Index = 0;
  weaponBaseDamagePackets.m1.forEach((baseDamagePacket) => {
    const [outputDamages] = runDamage(baseDamagePacket, attacker, target);
    if (!attacker.weapon.m1[m1Index]) attacker.weapon.m1[m1Index] = {};

    for (const [outputType, damage] of Object.entries(outputDamages) as [ItemModule.damageType, damageBreakdown?][]) {
      if (damage === undefined) continue;
      attacker.weapon.m1[m1Index][outputType] = truncateDamageBreakdown(damage);
    }

    m1Index++;
  });

  let m2Index = 0;
  weaponBaseDamagePackets.m2.forEach((baseDamagePacket) => {
    const [outputDamages] = runDamage(baseDamagePacket, attacker, target);
    if (!attacker.weapon.m2[m2Index]) attacker.weapon.m2[m2Index] = {};

    for (const [outputType, damage] of Object.entries(outputDamages) as [ItemModule.damageType, damageBreakdown?][]) {
      if (damage === undefined) continue;
      attacker.weapon.m2[m2Index][outputType] = truncateDamageBreakdown(damage);
    }

    m2Index++;
  });
}

// Public runners
export function runWeaponDamageCalculation(build: Build.Build, target?: Build.Build) {
  if (!build.blade || !build.handle) return;
  getWeaponDamages(build, target || targets.Dummy);
}

export function runNonWeaponDamageCalculation(
  baseDamageData: baseDamageData,
  build: Build.Build,
  target?: Build.Build,
  attackerBuild?: Partial<SerializedBuild>,
  targetBuild?: Partial<SerializedBuild>,
) {
  const [outputs, total] = runDamage(
    baseDamageData,
    build,
    target || targets.Dummy,
    attackerBuild as SerializedBuild,
    targetBuild as SerializedBuild,
  );

  return { outputs, total };
}

export function calculateUpgrade(stats: Build.stats, upgrade: number): Build.stats {
  if (!stats) return stats;

  const multiplier = upgrade / 10;

  for (const [key, value] of Object.entries(stats) as [ItemModule.stat, number?][]) {
    if (value === undefined || !stats[key]) continue;
    const statAmount = value >= 0 ? value : value * -1;
    stats[key] += Math.trunc(statAmount * multiplier * 10) / 10;
  }

  return stats;
}

