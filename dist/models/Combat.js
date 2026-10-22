import { collectCriticalEffects } from "./CriticalEffects.js";
import * as BuffModule from "./Buffs.js";
import * as Perks from "./Perk.js";
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
    build.damageModifications.damage_bonus_mods["Level"] = boost / 100;
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
    return armorMultiplier;
}
function penetrationArmorMultiplier(damageType, def, totalPen) {
    if (damageType === "True" || !totalPen || totalPen === 0) {
        return baseArmorMultiplier(def);
    }
    const armor = def / 100;
    const pen = totalPen / 100;
    const highArmorPoint = pen + 0.2;
    let penetrationMultiplier = 1;
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
    return penetrationMultiplier;
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
        if (typeof value !== "number" || !Number.isFinite(value))
            continue;
        if (modifications)
            modifications[perkData.name] = value;
        perkModifications[perkData.name] = value;
    }
    return perkModifications;
}
function getStatusSourceBuild(holder, status) {
    return status.getSourceBuild(holder);
}
function getStatusEffectivePotency(holder, status) {
    return status.getReceivedPotency(holder);
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
        if (typeof value !== "number" || !Number.isFinite(value))
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
        if (typeof value !== "number" || !Number.isFinite(value))
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
    if (!packet || typeof packet.damage !== "number" || !Number.isFinite(packet.damage) || packet.damage < 0)
        return null;
    const tags = new Set(packet.tags || []);
    if (packet.sourceType && packet.sourceType !== "normal")
        tags.add(packet.sourceType);
    if (packet.sourceDamageType === "M1")
        tags.add("M1");
    if (packet.sourceDamageType === "M2") {
        tags.add("M2");
        tags.add("Finisher");
    }
    const isDot = packet.sourceType === "Status" || tags.has("DoT");
    if (isDot)
        tags.add("DoT");
    return {
        damage: packet.damage,
        hitAmount: typeof packet.hitAmount === "number" && Number.isFinite(packet.hitAmount) && packet.hitAmount > 0 ? Math.max(1, Math.floor(packet.hitAmount)) : 1,
        tags: [...tags],
        canCrit: !isDot && packet.canCrit !== false,
        procCoefficient: isDot ? 0 : packet.procCoefficient,
        ...(packet.comboStep !== undefined ? { comboStep: packet.comboStep } : {}),
        source: packet.source || "Unknown",
        sourceType: packet.sourceType || "normal",
        sourceDamageType: packet.sourceDamageType || packet.sourceType || "Unknown",
        ...(packet.damageTypes ? { damageTypes: { ...packet.damageTypes } } : {}),
        ...(packet.damageScalings ? { damageScalings: { ...packet.damageScalings } } : {}),
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
export function getWeaponArtBaseDamagePacket(weaponArt, holder) {
    if (!weaponArt || typeof weaponArt.baseDamage !== "number")
        return null;
    const packet = createBaseDamagePacket({
        damage: weaponArt.damageBasis === "cast" ? weaponArt.baseDamage / (weaponArt.totalHits || 1) : weaponArt.baseDamage,
        hitAmount: weaponArt.totalHits || 1,
        source: weaponArt.id || weaponArt.name || "WeaponArt",
        sourceType: "WeaponArt",
        sourceDamageType: "WeaponArt",
        tags: weaponArt.attackTags,
    });
    if (holder) {
        packet.damageTypes = weaponArt.damageTypes ? { ...weaponArt.damageTypes } : undefined;
        packet.damageScalings = weaponArt.damageScalings ? { ...weaponArt.damageScalings } : undefined;
        for (const [id, amount] of Object.entries(holder.perks)) {
            if (Number.isFinite(amount) && amount > 0)
                Perks.PerkStore.getByID(id).modifyWeaponArtPacket?.call(holder, amount, packet);
        }
    }
    return packet;
}
// Damage pipeline
function getTotEffBoost(build) {
    let totalEffectiveBoost = 0;
    for (const [scale, value] of Object.entries(build.damageScalings)) {
        if (value === undefined)
            continue;
        const statId = (scale === "Protection" ? "Protection" : scale + "Boost");
        const statBoost = build.stats[statId];
        if (!statBoost)
            continue;
        const statEffectiveBoost = value * statBoost;
        build.effectiveBoosts[statId] = statEffectiveBoost;
        totalEffectiveBoost += statEffectiveBoost;
    }
    const multiplier = 1 + totalEffectiveBoost / 100;
    return [multiplier, multiplier * 100];
}
function calculatePreOutputDamage(damageData, attacker, target) {
    if (!damageData.damage)
        return 0;
    const [effectiveBoostMultiplier, totalEffectiveBoost] = getTotEffBoost(attacker);
    attacker.totEffBoost = totalEffectiveBoost;
    const baseDamage = damageData.damage * effectiveBoostMultiplier;
    const levelMultiplier = 1 + levelBoost(attacker) / 100;
    const attackerDamageBonus = multiplyBonusCollections(...collectEventModifications("onDmgBonusMultiplier", attacker, undefined, damageData, attacker.damageModifications.damage_bonus_mods));
    const targetDamageReduction = multiplyBonusCollections(...collectEventModifications("onDmgReducedMultiplier", target, undefined, damageData, attacker.damageModifications.damage_reduced_mods));
    const attackerDamagePenalty = multiplyBonusCollections(...collectEventModifications("onDecreaseDmgBonusMultiplier", attacker, undefined, damageData, attacker.damageModifications.damage_reduced_mods));
    return (baseDamage * levelMultiplier * attackerDamageBonus) /
        (targetDamageReduction * attackerDamagePenalty);
}
function getCritParameters(attacker, outputType, packet) {
    if (packet.canCrit === false)
        return { rate: 0, damageBonus: 0, armorPen: 0, hitMultiplier: 1, bypassArmor: false };
    const effects = collectCriticalEffects(attacker, packet);
    const dexterityBonus = (attacker.stats.DexterityBoost || 0) / 1000;
    const bonusRate = sumCollectedValues(...collectEventModifications("onCritRateCalculation", attacker, outputType, packet, attacker.damageModifications.crit_mods));
    const bonusDamage = sumCollectedValues(...collectEventModifications("onCritDamageCalculation", attacker, outputType, packet, attacker.damageModifications.crit_mods));
    const dexterityChance = effects.replacesDexterityChance ? 0 : dexterityBonus;
    let rate = Math.max(0, Math.min(1, (attacker.stats.CritRate || 0) / 100 + dexterityChance + effects.chance + bonusRate));
    const fractureConvertsCrits = Number.isFinite(attacker.perks.fractured_energy) && attacker.perks.fractured_energy > 0;
    if (fractureConvertsCrits) {
        attacker.damageModifications.crit_mods["Fracture application chance"] = rate;
        rate = 0;
    }
    const damageBonus = fractureConvertsCrits ? 0 : Math.max(0, 0.5 + (attacker.stats.CritDamage || 0) / 100 + dexterityBonus + effects.damage + bonusDamage);
    attacker.damageModifications.crit_mods["Dexterity chance"] = dexterityChance;
    attacker.damageModifications.crit_mods["Dexterity damage"] = dexterityBonus;
    attacker.damageModifications.crit_mods["Crit Rate"] = rate;
    attacker.damageModifications.crit_mods["Crit Damage"] = damageBonus;
    return { rate, damageBonus, armorPen: fractureConvertsCrits ? 0 : effects.armorPen, hitMultiplier: fractureConvertsCrits ? 1 : effects.hitMultiplier, bypassArmor: !fractureConvertsCrits && effects.bypassArmor };
}
function getModifiedDefenseValue(outputType, damageData, target, attacker) {
    const defenseStat = (outputType + "Defense");
    const baseDefense = target.stats[defenseStat] || 0;
    const armorAdjustment = sumCollectedValues(...collectEventModifications("onArmorModified", target, outputType, damageData, attacker.damageModifications.armor_mods));
    return baseDefense + armorAdjustment;
}
function getTotalArmorPenetration(outputType, damageData, attacker, target) {
    const attackerPen = sumCollectedValues(...collectEventModifications("onArmorPenCalculation", attacker, outputType, damageData, attacker.damageModifications.armor_mods)) + (attacker.stats["ArmorPenetration"] || 0);
    // Only statuses on the target (e.g. Shatter) alter incoming penetration.
    // A target's offensive perk bonuses belong to its own attacks.
    const targetPen = -sumCollectedValues(getBuffModifications("onArmorPenCalculation", target, outputType, damageData, attacker.damageModifications.armor_mods), getDebuffModifications("onArmorPenCalculation", target, outputType, damageData, attacker.damageModifications.armor_mods));
    return attackerPen + targetPen;
}
function getSpecialDamageTakenMultiplier(outputType, damageData, target, attacker) {
    const specificTakenMultiplier = multiplyBonusCollections(...collectEventModifications("onIncreaseSpecificDmgTaken", target, outputType, damageData, attacker.damageModifications.special_mods));
    const generalTakenMultiplier = multiplyBonusCollections(...collectEventModifications("onIncreaseDmgTaken", target, outputType, damageData, attacker.damageModifications.special_mods));
    return specificTakenMultiplier * generalTakenMultiplier;
}
function applySpecialMultipliers(damage, outputType, damageData, target, attacker, critRate) {
    const adjusted = multiplyDamageBreakdown(damage, getSpecialDamageTakenMultiplier(outputType, damageData, target, attacker) *
        totalMultiplier(Object.assign({}, ...collectEventModifications("onFinalDamageTakenMultiplier", target, outputType, damageData))));
    const flatMods = {};
    const flat = Math.max(0, sumCollectedValues(...collectEventModifications("onFlatDamageTakenReduction", target, outputType, damageData, flatMods)));
    if (!flat)
        return adjusted;
    for (const [name, value] of Object.entries(flatMods))
        attacker.damageModifications.special_mods[`[flat] ${name} (${outputType})`] = value;
    const normal = Math.max(0, adjusted.normal - flat), critical = Math.max(0, adjusted.crit - flat);
    return createDamageBreakdown(normal, critical, normal * (1 - critRate) + critical * critRate);
}
function calculatePostOutputDamage(outputDamage, outputType, damageData, attacker, target) {
    const attackerSpecificBonus = multiplyBonusCollections(...collectEventModifications("onSpecificDmgBonusMultiplier", attacker, outputType, damageData, attacker.damageModifications.specific_bonus_mods));
    const targetSpecificReduction = multiplyBonusCollections(...collectEventModifications("onSpecificDmgReducedMultiplier", target, outputType, damageData, attacker.damageModifications.specific_reduced_mods));
    const attackerSpecificPenalty = multiplyBonusCollections(...collectEventModifications("onDecreaseSpecificDmgBonusMultiplier", attacker, outputType, damageData, attacker.damageModifications.specific_reduced_mods));
    const typeAdjustedDamage = (outputDamage * attackerSpecificBonus) /
        (targetSpecificReduction * attackerSpecificPenalty);
    // Resolve normal and critical branches independently. Crit-only armor penetration
    // must not leak into normal damage or into the expected-value weighting.
    const crit = getCritParameters(attacker, outputType, damageData);
    const defense = getModifiedDefenseValue(outputType, damageData, target, attacker);
    const penetration = getTotalArmorPenetration(outputType, damageData, attacker, target);
    const normalDamage = typeAdjustedDamage * penetrationArmorMultiplier(outputType, defense, penetration);
    const criticalArmor = crit.bypassArmor ? 1 : penetrationArmorMultiplier(outputType, defense, penetration + crit.armorPen);
    const criticalDamage = typeAdjustedDamage * (1 + crit.damageBonus) * crit.hitMultiplier * criticalArmor;
    const armorAdjustedDamage = createDamageBreakdown(normalDamage, criticalDamage, normalDamage * (1 - crit.rate) + criticalDamage * crit.rate);
    return applySpecialMultipliers(armorAdjustedDamage, outputType, damageData, target, attacker, crit.rate);
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
function cloneStatus(status) {
    return new BuffModule.Buff({ ...status, sourceData: status.sourceData ? { ...status.sourceData } : undefined });
}
function createSerializedBuild(user, buildData, targetBuild) {
    return {
        race: user.race ? { id: user.race.id } : undefined,
        weaponFamily: buildData?.weaponFamily ?? user.getWeaponConstructionData()?.weaponFamily,
        level: buildData?.level ?? user.level,
        hp: buildData?.hp ?? user.hp,
        maxHp: buildData?.maxHp ?? user.maxHp,
        damageModifications: { damage_bonus_mods: {}, damage_reduced_mods: {}, specific_bonus_mods: {}, specific_reduced_mods: {}, crit_mods: {}, armor_mods: {}, special_mods: {} },
        effectiveBoosts: {},
        totEffBoost: 0,
        stats: cloneNumericMap(buildData?.stats ?? user.stats),
        potencies: cloneNumericMap(buildData?.potencies ?? user.potencies),
        perks: cloneNumericMap(buildData?.perks ?? user.perks),
        damageScalings: cloneNumericMap(buildData?.damageScalings ?? user.damageScalings),
        damageTypes: cloneNumericMap(buildData?.damageTypes ?? user.damageTypes),
        buff: (buildData?.buff ?? user.buff ?? []).filter(Boolean).map(cloneStatus),
        deBuffs: (buildData?.deBuffs ?? user.deBuffs ?? []).filter(Boolean).map(cloneStatus),
        target: targetBuild,
    };
}
function applyOutputCalculationEffects(holder, baseDamageData) {
    const args = { baseDamageData };
    applyPerkOutputCalculationEffects(holder, args);
    applyStatusOutputCalculationEffects(holder, args);
    const recipient = holder.target;
    if (recipient)
        for (const status of [...(recipient.buff || []), ...(recipient.deBuffs || [])]) {
            status.onIncomingOutputCalculation?.apply(recipient, [status.getReceivedPotency(recipient), args]);
        }
}
function applyPerkOutputCalculationEffects(holder, args) {
    for (const { perk: perkData, amount } of Perks.getSortedPerkEventEntries(holder.perks, "onOutputCalculation")) {
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
function prepareStatusConsumptions(attacker, target, packet) {
    const pending = [];
    if (packet.damage <= 0 || packet.sourceType === "Status" || packet.tags?.includes("DoT"))
        return pending;
    if ((attacker.perks.forgotten_chivalry || 0) > 0 && (packet.sourceType === "Rune" || packet.sourceType === "WeaponArt")) {
        const reinforce = attacker.buff.filter(status => status.id === "reinforce");
        if (reinforce.length) {
            (attacker.activeProcs || (attacker.activeProcs = [])).push("forgotten_chivalry");
            for (const status of reinforce)
                pending.push({ status, perkId: "forgotten_chivalry", before: false, holder: "attacker" });
        }
    }
    if (packet.procCoefficient === 0)
        return pending;
    if ((attacker.perks.extinguish || 0) > 0 && attacker.buff.some(status => status.id === "extinguish_proc") && (attacker.damageTypes.Water || 0) > 0) {
        const burns = target.deBuffs.filter(status => status.id === "burn");
        if (burns.length) {
            (attacker.activeProcs || (attacker.activeProcs = [])).push("extinguish");
            for (const status of burns)
                pending.push({ status, perkId: "extinguish", before: true });
        }
    }
    for (const [perkId, statusId] of [["blood_thirsty", "bleed"], ["venom_eater", "poison"]]) {
        if ((attacker.perks[perkId] || 0) <= 0 || (perkId === "venom_eater" && (packet.canCrit === false || attacker.perks.fractured_energy > 0)))
            continue;
        const selection = attacker.buff.find(status => status.id === `${perkId}_proc`);
        if (!selection)
            continue;
        const owned = target.deBuffs.filter(status => status.id === statusId && status.getSourceBuild(target) === attacker);
        if (!owned.length)
            continue;
        (attacker.activeProcs || (attacker.activeProcs = [])).push(perkId);
        // User's in-game test: Hemorrhage reads Bleed before Blood Thirsty consumes it.
        // Preserve eligibility for this hit only; other Bleed readers use the remaining statuses.
        if (perkId === "blood_thirsty" && attacker.perks.hemorrhage > 0)
            attacker.activeProcs.push("hemorrhage_before_blood_thirsty");
        for (const status of owned)
            pending.push({ status, perkId, before: perkId === "blood_thirsty" || selection.consumptionTiming === "before" });
    }
    target.deBuffs = target.deBuffs.filter(status => !pending.some(entry => entry.before && entry.status === status));
    return pending;
}
function collectPerkOutputPreviewForPacket(attacker, target, packet, preview) {
    const targetBuild = createSerializedBuild(target);
    const attackerBuild = createSerializedBuild(attacker, {
        ...(packet.damageTypes ? { damageTypes: packet.damageTypes } : {}),
        ...(packet.damageScalings ? { damageScalings: packet.damageScalings } : {}),
    }, targetBuild);
    targetBuild.target = attackerBuild;
    prepareStatusConsumptions(attackerBuild, targetBuild, packet);
    const beforeDamageScalings = cloneNumericMap(attackerBuild.damageScalings);
    const beforeDamageTypes = cloneNumericMap(attackerBuild.damageTypes);
    applyOutputCalculationEffects(attackerBuild, packet);
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
    const weaponArtPacket = getWeaponArtBaseDamagePacket(attacker.weaponart, attacker);
    if (weaponArtPacket) {
        collectPerkOutputPreviewForPacket(attacker, target, weaponArtPacket, preview);
    }
    return preview;
}
/** Resolve the selected snapshot without mutating either saved build or its statuses. */
function resolveDamageSnapshot(packet, attacker, target, attackerOverrides, targetOverrides) {
    const baseDamage = normalizeBaseDamagePacket(packet);
    if (!baseDamage)
        throw new Error("Damage must be a finite, nonnegative number.");
    const targetBuild = createSerializedBuild(target, targetOverrides);
    const profile = { ...attackerOverrides };
    if (baseDamage.damageTypes && profile.damageTypes === undefined)
        profile.damageTypes = baseDamage.damageTypes;
    if (baseDamage.damageScalings && profile.damageScalings === undefined)
        profile.damageScalings = baseDamage.damageScalings;
    const attackerBuild = createSerializedBuild(attacker, profile, targetBuild);
    targetBuild.target = attackerBuild;
    targetBuild.isSelfDamage = attackerBuild.isSelfDamage = attacker === target;
    if (attacker === target && attacker.target && attacker.target !== attacker) {
        const opponent = createSerializedBuild(attacker.target);
        opponent.target = attackerBuild;
        attackerBuild.statusOpponent = opponent;
        targetBuild.statusOpponent = opponent;
    }
    const consumptions = prepareStatusConsumptions(attackerBuild, targetBuild, baseDamage);
    const resolvedHitCount = consumptions.length ? 1 : baseDamage.hitAmount;
    applyOutputCalculationEffects(attackerBuild, baseDamage);
    const outputDamages = {};
    let perHit = createDamageBreakdown();
    const preOutputDamage = calculatePreOutputDamage(baseDamage, attackerBuild, targetBuild);
    for (const [outputType, coefficient] of Object.entries(attackerBuild.damageTypes)) {
        if (!coefficient)
            continue;
        const damage = calculateDamage(outputType, coefficient, baseDamage, attackerBuild, targetBuild, preOutputDamage);
        perHit = addDamageBreakdowns(perHit, damage);
        outputDamages[outputType] = multiplyDamageBreakdown(damage, resolvedHitCount);
    }
    let total = multiplyDamageBreakdown(perHit, resolvedHitCount);
    const statusConsumptions = consumptions.map(entry => ({ statusId: entry.status.id, perkId: entry.perkId, hit: 1, ...(entry.holder ? { holder: entry.holder } : {}) }));
    if (consumptions.length && baseDamage.hitAmount > 1) {
        // No new applications are simulated. Remaining equal hits see the consumed status removed.
        const remainingStatuses = targetBuild.deBuffs.filter(status => !consumptions.some(entry => entry.status === status));
        const remainingBuffs = attackerBuild.buff.filter(status => !consumptions.some(entry => entry.holder === "attacker" && entry.status === status));
        const remaining = resolveDamageSnapshot({ ...baseDamage, hitAmount: baseDamage.hitAmount - 1 }, attacker, target, { ...attackerOverrides, buff: remainingBuffs }, { ...targetOverrides, deBuffs: remainingStatuses });
        total = addDamageBreakdowns(total, remaining.total);
        for (const [type, damage] of Object.entries(remaining.outputs)) {
            outputDamages[type] = addDamageBreakdowns(outputDamages[type] || createDamageBreakdown(), damage);
        }
        perHit = multiplyDamageBreakdown(total, 1 / baseDamage.hitAmount);
        for (const entry of remaining.statusConsumptions || [])
            statusConsumptions.push({ ...entry, hit: entry.hit + 1 });
    }
    return {
        outputs: outputDamages,
        total,
        perHit, hitCount: baseDamage.hitAmount,
        ...(statusConsumptions.length ? { statusConsumptions } : {}),
        modifiers: attackerBuild.damageModifications,
        effectiveBoosts: attackerBuild.effectiveBoosts,
        totalEffectiveBoost: attackerBuild.totEffBoost,
    };
}
/** Resolve a snapshot without changing saved builds; round once after the whole packet. */
export function resolveDamage(packet, attacker, target, attackerOverrides, targetOverrides) {
    const result = resolveDamageSnapshot(packet, attacker, target, attackerOverrides, targetOverrides);
    return { ...result, total: roundDamageBreakdown(result.total), perHit: roundDamageBreakdown(result.perHit),
        outputs: Object.fromEntries(Object.entries(result.outputs).map(([type, damage]) => [type, roundDamageBreakdown(damage)])) };
}
/** Preview a selected DoT using its actual applicant for both potency and offensive stats. */
export function resolveStatusDamage(status, recipient) {
    if (!status.getDamageInfo)
        return null;
    const source = status.getSourceBuild(recipient);
    const potency = status.getDotPotencies(source);
    const packet = normalizeBaseDamagePacket(status.getDamageInfo.call(recipient, potency.additive, potency.source));
    if (!packet)
        return null;
    if (["bleed", "burn", "poison"].includes(status.id)) {
        packet.damage = BuffModule.estimateEndlessDespairDotDamage(packet.damage, status.getEndlessDespairAmount(source));
    }
    return resolveDamage(packet, source, recipient, {
        damageScalings: status.id === "bleed" && source.perks.sandy_wounds > 0
            ? Object.fromEntries(Object.entries(status.damageScalings || {}).map(([id, value]) => [id === "Physical" ? "Earth" : id === "Dexterity" ? "Air" : id, value]))
            : status.damageScalings || {}, damageTypes: status.damageTypes || {},
    });
}
/** Legacy display adapter. New consumers can use the side-effect-free resolveDamage. */
export function runDamage(packet, attacker, target, attackerBuild, targetBuild) {
    const result = resolveDamage(packet, attacker, target, attackerBuild, targetBuild);
    for (const group of Object.keys(result.modifiers)) {
        Object.assign(attacker.damageModifications[group], result.modifiers[group]);
    }
    Object.assign(attacker.effectiveBoosts, result.effectiveBoosts);
    attacker.totEffBoost = result.totalEffectiveBoost;
    return [result.outputs, result.total];
}
// Weapon helpers
export function getWeaponBaseDamagePackets(build) {
    const weaponConstructionData = build.getWeaponConstructionData() || {
        constructionType: "None",
        m1: [],
        m2: [],
    };
    const packets = {
        constructionType: weaponConstructionData.constructionType,
        m1: createDamagePackets(weaponConstructionData.m1, weaponConstructionData.constructionType, "Weapon", "M1"),
        m2: createDamagePackets(weaponConstructionData.m2, weaponConstructionData.constructionType, "Weapon", "M2"),
    };
    const entries = Object.entries(build.perks).filter(([, amount]) => Number.isFinite(amount) && amount > 0)
        .map(([id, amount]) => ({ perk: Perks.PerkStore.getByID(id), amount }))
        .sort((a, b) => (a.perk.weaponPriority || 0) - (b.perk.weaponPriority || 0) || a.perk.id.localeCompare(b.perk.id));
    if (build.buff?.some(status => status.id === "m1_finisher_confirmed") && packets.m1.length) {
        const finisher = packets.m1[packets.m1.length - 1];
        finisher.tags = [...new Set([...(finisher.tags || []), "Finisher"])];
    }
    for (const { perk, amount } of entries)
        perk.modifyWeaponPackets?.call(build, amount, packets);
    return packets;
}
export function getWeaponDamages(attacker, target) {
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
