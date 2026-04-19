import * as Perks from "../models/Perk.js";
import * as targets from "./targets.js";
// Damage breakdown helpers
function createDamageBreakdown(normal = 0, crit = 0, average = 0) {
    return { normal, crit, average };
}
function multiplyDamageBreakdown(breakdown, multiplier) {
    return {
        normal: breakdown.normal * multiplier,
        crit: breakdown.crit * multiplier,
        average: breakdown.average * multiplier,
    };
}
function addDamageBreakdowns(current, next) {
    return {
        normal: current.normal + next.normal,
        crit: current.crit + next.crit,
        average: current.average + next.average,
    };
}
function roundDamageBreakdown(breakdown, decimals = 2) {
    const multiplier = 10 ** decimals;
    return {
        normal: Math.round(breakdown.normal * multiplier) / multiplier,
        crit: Math.round(breakdown.crit * multiplier) / multiplier,
        average: Math.round(breakdown.average * multiplier) / multiplier,
    };
}
function truncateDamageBreakdown(breakdown, decimals = 1) {
    const multiplier = 10 ** decimals;
    return {
        normal: Math.trunc(breakdown.normal * multiplier) / multiplier,
        crit: Math.trunc(breakdown.crit * multiplier) / multiplier,
        average: Math.trunc(breakdown.average * multiplier) / multiplier,
    };
}
// Shared math helpers
function totalMultiplier(modifications, treatAsBonus) {
    let total = undefined;
    for (const value of Object.values(modifications)) {
        if (value === undefined)
            continue;
        if (treatAsBonus) {
            total = total === undefined ? 1 + value : total * (1 + value);
        }
        else {
            total = total === undefined ? value : total * value;
        }
    }
    if (treatAsBonus) {
        return total === undefined || total === 0 ? 1 : total;
    }
    return total === undefined ? 1 : total;
}
function levelBoost(build) {
    const boost = build.level * 1.25;
    build.user.damageModifications.damage_bonus_mods["Level"] = boost / 100;
    return boost;
}
function baseArmorMultiplier(def) {
    if (!def)
        return 1;
    let armorMultiplier = 1;
    if (def > 0) {
        armorMultiplier = 1 / (1 + def / 100);
    }
    else if (def < 0) {
        armorMultiplier = 1 + (-1 * def) / 100;
    }
    return Math.trunc(armorMultiplier * 100) / 100;
}
function penetrationArmorMultiplier(damageType, def, totalPen) {
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
        }
        else if (armorMultiplier < 0) {
            penetrationMultiplier = 1 - armorMultiplier;
        }
    }
    else {
        const armorMultiplier = armor / (1 + 5 * pen);
        penetrationMultiplier = 1 / (1 + armorMultiplier);
    }
    return Math.trunc(penetrationMultiplier * 10) / 10;
}
// Modifier collection
function getPerkModifications(event, holder, outputType, baseDamageData, modifications) {
    const perkModifications = {};
    for (const [perk, amount] of Object.entries(holder.perks)) {
        const perkData = Perks.PerkStore.getByID(perk);
        const callback = perkData[event];
        if (!callback)
            continue;
        const value = callback.apply(holder, [
            amount,
            { outputType, baseDamageData },
        ]);
        if (value === undefined || value === null)
            continue;
        if (modifications)
            modifications[perkData.name] = value;
        perkModifications[perkData.name] = value;
    }
    return perkModifications;
}
function getStatusSourceBuild(holder, status) {
    if (status.category === "Debuff") {
        return holder.target?.user || holder.user.target || holder.user;
    }
    return holder.user;
}
function getStatusEffectivePotency(holder, status) {
    return status.getEffectivePotency?.(getStatusSourceBuild(holder, status));
}
function getDebuffModifications(event, holder, outputType, baseDamageData, modifications) {
    const statusModifications = {};
    if (!holder.deBuffs)
        return statusModifications;
    for (const debuff of holder.deBuffs) {
        if (!debuff)
            continue;
        const callback = debuff[event];
        if (!callback)
            continue;
        const potency = getStatusEffectivePotency(holder, debuff);
        const value = callback.apply(holder, [
            potency,
            { outputType, baseDamageData },
        ]);
        if (value === undefined || value === null)
            continue;
        if (modifications)
            modifications[debuff.name] = value;
        statusModifications[debuff.name] = value;
    }
    return statusModifications;
}
function getBuffModifications(event, holder, outputType, baseDamageData, modifications) {
    const statusModifications = {};
    if (!holder.buff)
        return statusModifications;
    for (const buff of holder.buff) {
        if (!buff)
            continue;
        const callback = buff[event];
        if (!callback)
            continue;
        const potency = getStatusEffectivePotency(holder, buff);
        const value = callback.apply(holder, [
            potency,
            { outputType, baseDamageData },
        ]);
        if (value === undefined || value === null)
            continue;
        if (modifications)
            modifications[buff.name] = value;
        statusModifications[buff.name] = value;
    }
    return statusModifications;
}
function collectEventModifications(event, holder, outputType, baseDamageData, modifications) {
    return [
        getPerkModifications(event, holder, outputType, baseDamageData, modifications),
        getBuffModifications(event, holder, outputType, baseDamageData, modifications),
        getDebuffModifications(event, holder, outputType, baseDamageData, modifications),
    ];
}
function sumCollectedValues(...collections) {
    return collections.reduce((total, collection) => {
        if (!collection)
            return total;
        return total + Object.values(collection).reduce((sum, value) => sum + value, 0);
    }, 0);
}
function multiplyBonusCollections(...collections) {
    return collections.reduce((product, collection) => {
        if (!collection)
            return product;
        return product * totalMultiplier(collection, true);
    }, 1);
}
// Packet builders
export function normalizeBaseDamagePacket(packet) {
    if (!packet || typeof packet.damage !== "number")
        return null;
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
export function createBaseDamagePacket(packet) {
    return normalizeBaseDamagePacket(packet);
}
function createDamagePackets(damageEntries, source, sourceType, sourceDamageType) {
    if (!damageEntries?.length)
        return [];
    return damageEntries.map(([damage, hitAmount]) => createBaseDamagePacket({
        damage,
        hitAmount,
        source,
        sourceType,
        sourceDamageType,
    }));
}
export function getRuneBaseDamagePacket(rune) {
    if (!rune || typeof rune.baseDamage !== "number")
        return null;
    return createBaseDamagePacket({
        damage: rune.baseDamage,
        hitAmount: 1,
        source: rune.id || rune.name || "Rune",
        sourceType: "Rune",
        sourceDamageType: "Rune",
    });
}
export function getWeaponArtBaseDamagePacket(weaponArt) {
    if (!weaponArt || typeof weaponArt.baseDamage !== "number")
        return null;
    return createBaseDamagePacket({
        damage: weaponArt.baseDamage,
        hitAmount: weaponArt.totalHits || 1,
        source: weaponArt.id || weaponArt.name || "WeaponArt",
        sourceType: "WeaponArt",
        sourceDamageType: "WeaponArt",
    });
}
// Damage pipeline
function getTotEffBoost(build) {
    let totalEffectiveBoost = 0;
    for (const [scale, value] of Object.entries(build.damageScalings)) {
        if (value === undefined)
            continue;
        const statId = (scale + "Boost");
        const statBoost = build.stats[statId];
        if (!statBoost)
            continue;
        const statEffectiveBoost = value * statBoost;
        build.user.effectiveBoosts[statId] = statEffectiveBoost;
        totalEffectiveBoost += statEffectiveBoost;
    }
    const multiplier = 1 + totalEffectiveBoost / 100;
    return [multiplier, multiplier * 100];
}
function calculatePreOutputDamage(damageData, attacker, target) {
    if (!damageData.damage)
        return 0;
    const [effectiveBoostMultiplier, totalEffectiveBoost] = getTotEffBoost(attacker);
    attacker.user.totEffBoost = totalEffectiveBoost;
    const baseDamage = damageData.damage * effectiveBoostMultiplier;
    const levelMultiplier = 1 + levelBoost(attacker) / 100;
    const attackerDamageBonus = multiplyBonusCollections(...collectEventModifications("onDmgBonusMultiplier", attacker, undefined, damageData, attacker.user.damageModifications.damage_bonus_mods));
    const targetDamageReduction = multiplyBonusCollections(...collectEventModifications("onDmgReducedMultiplier", target, undefined, damageData, attacker.user.damageModifications.damage_reduced_mods));
    const attackerDamagePenalty = multiplyBonusCollections(...collectEventModifications("onDecreaseDmgBonusMultiplier", attacker, undefined, damageData, attacker.user.damageModifications.damage_reduced_mods));
    return (baseDamage * levelMultiplier * attackerDamageBonus) /
        (targetDamageReduction * attackerDamagePenalty);
}
function getCritDamageBreakdown(damage, attacker, outputType, damageData) {
    const baseCritRate = 0;
    const baseCritDamage = 0.5;
    const statCritRate = (attacker.stats["CritRate"] || 0) / 100;
    const statCritDamage = (attacker.stats["CritDamage"] || 0) / 100;
    const bonusCritRate = sumCollectedValues(...collectEventModifications("onCritRateCalculation", attacker, outputType, damageData, attacker.user.damageModifications.crit_mods));
    const bonusCritDamage = sumCollectedValues(...collectEventModifications("onCritDamageCalculation", attacker, outputType, damageData, attacker.user.damageModifications.crit_mods));
    let critRate = baseCritRate + statCritRate + bonusCritRate;
    let critDamageBonus = baseCritDamage + statCritDamage + bonusCritDamage;
    critRate = Math.max(0, Math.min(1, critRate));
    critDamageBonus = Math.max(0, critDamageBonus);
    attacker.user.damageModifications.crit_mods["Crit Rate"] = critRate;
    attacker.user.damageModifications.crit_mods["Crit Damage"] = critDamageBonus;
    return createDamageBreakdown(damage, damage * (1 + critDamageBonus), damage * ((1 - critRate) + critRate * (1 + critDamageBonus)));
}
function getModifiedDefenseValue(outputType, damageData, target, attacker) {
    const defenseStat = (outputType + "Defense");
    const baseDefense = target.stats[defenseStat] || 0;
    const armorAdjustment = sumCollectedValues(...collectEventModifications("onArmorModified", target, outputType, damageData, attacker.user.damageModifications.armor_mods));
    return baseDefense + armorAdjustment;
}
function getTotalArmorPenetration(outputType, damageData, attacker, target) {
    const attackerPen = sumCollectedValues(...collectEventModifications("onArmorPenCalculation", attacker, outputType, damageData, attacker.user.damageModifications.armor_mods)) + (attacker.stats["ArmorPenetration"] || 0);
    const targetPen = sumCollectedValues(...collectEventModifications("onArmorPenCalculation", target, outputType, damageData, attacker.user.damageModifications.armor_mods)) * -1;
    return attackerPen + targetPen + (target.stats["ArmorPenetration"] || 0);
}
function applyArmorMultiplier(damage, outputType, damageData, attacker, target) {
    const modifiedDefense = getModifiedDefenseValue(outputType, damageData, target, attacker);
    const totalPenetration = getTotalArmorPenetration(outputType, damageData, attacker, target);
    const armorMultiplier = penetrationArmorMultiplier(outputType, modifiedDefense, totalPenetration);
    return multiplyDamageBreakdown(damage, armorMultiplier);
}
function getSpecialDamageTakenMultiplier(outputType, damageData, target, attacker) {
    const specificTakenMultiplier = multiplyBonusCollections(...collectEventModifications("onIncreaseSpecificDmgTaken", target, outputType, damageData, attacker.user.damageModifications.special_mods));
    const generalTakenMultiplier = multiplyBonusCollections(...collectEventModifications("onIncreaseDmgTaken", target, outputType, damageData, attacker.user.damageModifications.special_mods));
    return specificTakenMultiplier * generalTakenMultiplier;
}
function applySpecialMultipliers(damage, outputType, damageData, target, attacker) {
    return multiplyDamageBreakdown(damage, getSpecialDamageTakenMultiplier(outputType, damageData, target, attacker));
}
function calculatePostOutputDamage(outputDamage, outputType, damageData, attacker, target) {
    const attackerSpecificBonus = multiplyBonusCollections(...collectEventModifications("onSpecificDmgBonusMultiplier", attacker, outputType, damageData, attacker.user.damageModifications.specific_bonus_mods));
    const targetSpecificReduction = multiplyBonusCollections(...collectEventModifications("onSpecificDmgReducedMultiplier", target, outputType, damageData, attacker.user.damageModifications.specific_reduced_mods));
    const attackerSpecificPenalty = multiplyBonusCollections(...collectEventModifications("onDecreaseSpecificDmgBonusMultiplier", attacker, outputType, damageData, attacker.user.damageModifications.specific_reduced_mods));
    const typeAdjustedDamage = (outputDamage * attackerSpecificBonus) /
        (targetSpecificReduction * attackerSpecificPenalty);
    const critAdjustedDamage = getCritDamageBreakdown(typeAdjustedDamage, attacker, outputType, damageData);
    const armorAdjustedDamage = applyArmorMultiplier(critAdjustedDamage, outputType, damageData, attacker, target);
    return applySpecialMultipliers(armorAdjustedDamage, outputType, damageData, target, attacker);
}
export function calculateDamage(outputType, outputTypeMultiplier, damageData, attacker, target, preOutputDamage) {
    if (!damageData.damage)
        return createDamageBreakdown();
    const resolvedOutputTypeMultiplier = outputTypeMultiplier || attacker.damageTypes[outputType] || 0;
    const resolvedPreOutputDamage = preOutputDamage ?? calculatePreOutputDamage(damageData, attacker, target);
    const splitDamage = resolvedPreOutputDamage * resolvedOutputTypeMultiplier;
    return calculatePostOutputDamage(splitDamage, outputType, damageData, attacker, target);
}
// Execution helpers
function cloneNumericMap(values) {
    return { ...(values || {}) };
}
function createSerializedBuild(user, buildData, targetBuild) {
    return {
        level: buildData?.level ?? user.level,
        stats: cloneNumericMap(buildData?.stats ?? user.stats),
        potencies: cloneNumericMap(buildData?.potencies ?? user.potencies),
        perks: cloneNumericMap(buildData?.perks ?? user.perks),
        damageScalings: cloneNumericMap(buildData?.damageScalings ?? user.damageScalings),
        damageTypes: cloneNumericMap(buildData?.damageTypes ?? user.damageTypes),
        buff: [...(buildData?.buff ?? user.buff ?? [])],
        deBuffs: [...(buildData?.deBuffs ?? user.deBuffs ?? [])],
        user,
        target: targetBuild,
    };
}
function applyOutputCalculationEffects(holder, baseDamageData) {
    const args = { baseDamageData };
    applyPerkOutputCalculationEffects(holder, args);
    applyStatusOutputCalculationEffects(holder, args);
}
function applyPerkOutputCalculationEffects(holder, args) {
    for (const [perk, amount] of Object.entries(holder.perks)) {
        const perkData = Perks.PerkStore.getByID(perk);
        const callback = perkData.onOutputCalculation;
        if (!callback)
            continue;
        callback.apply(holder, [amount, args]);
    }
}
function applyStatusOutputCalculationEffects(holder, args) {
    for (const buff of holder.buff) {
        if (!buff?.onOutputCalculation)
            continue;
        buff.onOutputCalculation.apply(holder, [
            getStatusEffectivePotency(holder, buff),
            args,
        ]);
    }
    for (const debuff of holder.deBuffs) {
        if (!debuff?.onOutputCalculation)
            continue;
        debuff.onOutputCalculation.apply(holder, [
            getStatusEffectivePotency(holder, debuff),
            args,
        ]);
    }
}
function collectNumericDiffs(beforeValues, afterValues, sourceLabel, previewMap) {
    const keys = new Set([
        ...Object.keys(beforeValues || {}),
        ...Object.keys(afterValues || {}),
    ]);
    for (const key of keys) {
        const beforeValue = beforeValues[key] || 0;
        const afterValue = afterValues[key] || 0;
        const diff = Math.round((afterValue - beforeValue) * 10000) / 10000;
        if (!diff)
            continue;
        previewMap[`${sourceLabel}: ${key}`] = diff;
    }
}
function collectPerkOutputPreviewForPacket(attacker, target, packet, preview) {
    const targetBuild = createSerializedBuild(target);
    const attackerBuild = createSerializedBuild(attacker, undefined, targetBuild);
    targetBuild.target = attackerBuild;
    const beforeDamageScalings = cloneNumericMap(attackerBuild.damageScalings);
    const beforeDamageTypes = cloneNumericMap(attackerBuild.damageTypes);
    applyPerkOutputCalculationEffects(attackerBuild, { baseDamageData: packet });
    collectNumericDiffs(beforeDamageScalings, attackerBuild.damageScalings, packet.sourceDamageType, preview.damageScalings);
    collectNumericDiffs(beforeDamageTypes, attackerBuild.damageTypes, packet.sourceDamageType, preview.damageTypes);
}
export function getActivePerkOutputPreview(attacker, target) {
    const preview = {
        damageScalings: {},
        damageTypes: {},
    };
    const weaponBaseDamagePackets = getWeaponBaseDamagePackets(attacker);
    const seenSourceLabels = new Set();
    for (const packet of [...weaponBaseDamagePackets.m1, ...weaponBaseDamagePackets.m2]) {
        if (seenSourceLabels.has(packet.sourceDamageType))
            continue;
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
export function runDamage(baseDamage, attacker, target, attackerBuild, targetBuild) {
    const outputDamages = {};
    let totalDamage = createDamageBreakdown();
    targetBuild = createSerializedBuild(target, targetBuild);
    attackerBuild = createSerializedBuild(attacker, attackerBuild, targetBuild);
    targetBuild.target = attackerBuild;
    attackerBuild.target = targetBuild;
    applyOutputCalculationEffects(attackerBuild, baseDamage);
    const damageTypes = attackerBuild.damageTypes || {};
    const preOutputDamage = calculatePreOutputDamage(baseDamage, attackerBuild, targetBuild);
    for (const outputType of Object.keys(damageTypes)) {
        const outputTypeMultiplier = damageTypes[outputType];
        if (!outputTypeMultiplier)
            continue;
        const damage = calculateDamage(outputType, outputTypeMultiplier, baseDamage, attackerBuild, targetBuild, preOutputDamage);
        outputDamages[outputType] = roundDamageBreakdown(damage);
        totalDamage = addDamageBreakdowns(totalDamage, outputDamages[outputType]);
    }
    return [outputDamages, roundDamageBreakdown(totalDamage)];
}
// Weapon helpers
export function getWeaponBaseDamagePackets(build) {
    const weaponConstructionData = build.getWeaponConstructionData() || {
        constructionType: "None",
        m1: [],
        m2: [],
    };
    return {
        constructionType: weaponConstructionData.constructionType,
        m1: createDamagePackets(weaponConstructionData.m1, weaponConstructionData.constructionType, "Weapon", "M1"),
        m2: createDamagePackets(weaponConstructionData.m2, weaponConstructionData.constructionType, "Weapon", "M2"),
    };
}
function getWeaponDamages(attacker, target) {
    const weaponBaseDamagePackets = getWeaponBaseDamagePackets(attacker);
    let m1Index = 0;
    weaponBaseDamagePackets.m1.forEach((baseDamagePacket) => {
        const [outputDamages] = runDamage(baseDamagePacket, attacker, target);
        if (!attacker.weapon.m1[m1Index])
            attacker.weapon.m1[m1Index] = {};
        for (const [outputType, damage] of Object.entries(outputDamages)) {
            if (damage === undefined)
                continue;
            attacker.weapon.m1[m1Index][outputType] = truncateDamageBreakdown(damage);
        }
        m1Index++;
    });
    let m2Index = 0;
    weaponBaseDamagePackets.m2.forEach((baseDamagePacket) => {
        const [outputDamages] = runDamage(baseDamagePacket, attacker, target);
        if (!attacker.weapon.m2[m2Index])
            attacker.weapon.m2[m2Index] = {};
        for (const [outputType, damage] of Object.entries(outputDamages)) {
            if (damage === undefined)
                continue;
            attacker.weapon.m2[m2Index][outputType] = truncateDamageBreakdown(damage);
        }
        m2Index++;
    });
}
// Public runners
export function runWeaponDamageCalculation(build, target) {
    if (!build.blade || !build.handle)
        return;
    getWeaponDamages(build, target || targets.Dummy);
}
export function runNonWeaponDamageCalculation(baseDamageData, build, target, attackerBuild, targetBuild) {
    const [outputs, total] = runDamage(baseDamageData, build, target || targets.Dummy, attackerBuild, targetBuild);
    return { outputs, total };
}
export function calculateUpgrade(stats, upgrade) {
    if (!stats)
        return stats;
    const multiplier = upgrade / 10;
    for (const [key, value] of Object.entries(stats)) {
        if (value === undefined || !stats[key])
            continue;
        const statAmount = value >= 0 ? value : value * -1;
        stats[key] += Math.trunc(statAmount * multiplier * 10) / 10;
    }
    return stats;
}
