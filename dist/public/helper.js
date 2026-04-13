import * as ItemModule from "../models/Item.js";
import * as WeaponTypes from "../models/WeaponTypes.js";
import * as Perks from "../models/Perk.js";
import * as targets from "./targets.js";
function totalMultiplier(dmgBonusMults, Bonus) {
    let total = undefined;
    for (const [key, value] of Object.entries(dmgBonusMults)) {
        if (value === undefined)
            continue;
        if (Bonus) {
            if (total == undefined) {
                total = 1 + value;
            }
            else {
                total *= (1 + value);
            }
        }
        else {
            if (total == undefined) {
                total = value;
            }
            else {
                total *= value;
            }
        }
    }
    if (Bonus) {
        total = total === undefined || total === 0 ? 1 : total;
        total = total;
    }
    else {
        total = total === undefined ? 1 : total;
    }
    //console.log(total);
    return total;
}
function levelBoost(build) {
    let Boost = build.level * 1.25;
    build.user.damageModifications.damage_bonus_mods["Level"] = Boost / 100;
    return Boost;
}
function getPerkModifications(event, holder, outputType, baseDamageData, Modifications) {
    let perkModifications = {};
    for (const [perk, amount] of Object.entries(holder.perks)) {
        if (!Perks.PerkStore.getByID(perk))
            continue;
        let perkData = Perks.PerkStore.getByID(perk);
        let callBack = perkData[event];
        if (!callBack)
            continue;
        let args = [amount, {
                outputType: outputType,
                baseDamageData: baseDamageData
            }];
        let value = callBack.apply(holder, args); // if it's def or atk Modification
        if (!value)
            continue; // the conditions of the call back were not met
        //console.log(perkData.name + " " + value);
        if (Modifications)
            Modifications[perkData.name] = value;
        perkModifications[perkData.name] = value;
    }
    return perkModifications;
}
function getDebuffModifications(event, holder, outputType, baseDamageData, Modifications) {
    let statusModifications = {};
    if (!holder.deBuffs)
        return statusModifications;
    for (const [status, debuff] of Object.entries(holder.deBuffs)) {
        if (!debuff)
            continue;
        let statusData = debuff;
        let callBack = statusData?.[event];
        if (!callBack)
            continue;
        let args = [undefined, {
                outputType: outputType,
                baseDamageData: baseDamageData
            }];
        let value = callBack.apply(holder, args);
        if (!value)
            continue; // the conditions of the call back were not met
        if (Modifications)
            Modifications[statusData.name] = value;
        statusModifications[statusData.name] = value;
    }
    return statusModifications;
}
function getBuffModifications(event, holder, outputType, baseDamageData, Modifications) {
    let statusModifications = {};
    if (!holder.buff)
        return statusModifications;
    for (const [status, buff] of Object.entries(holder.buff)) {
        if (!buff)
            continue;
        let statusData = buff;
        let callBack = statusData?.[event];
        if (!callBack)
            continue;
        let args = [undefined, {
                outputType: outputType,
                baseDamageData: baseDamageData
            }];
        let value = callBack.apply(holder, args);
        if (!value)
            continue; // the conditions of the call back were not met
        if (Modifications)
            Modifications[statusData.name] = value;
        statusModifications[statusData.name] = value;
    }
    return statusModifications;
}
function getStatEffBoost(scale, statBoost) {
    if (!scale || !statBoost)
        return 0;
    let statEffectiveBoost = scale * statBoost;
    return statEffectiveBoost;
}
function getTotEffBoost(build) {
    let total = 0; // Decimal vale
    let totEffBoost = 0; // percentage value of totEffBoost
    for (const [scale, value] of Object.entries(build.damageScalings)) {
        if (value === undefined)
            continue;
        let statId = (scale + "Boost"); // get the aliases of the stat from the scale
        let statBoost = build.stats[statId];
        if (!statBoost)
            continue; // maybe that Boost doesn't have a scale
        let statEffectiveBoost = getStatEffBoost(value, statBoost);
        build.user.effectiveBoosts[statId] = statEffectiveBoost;
        total += statEffectiveBoost;
    }
    total = 1 + (1 * total) / 100;
    totEffBoost = total * 100;
    return [total, totEffBoost];
}
function critMultiplier(critRate) {
    let baseCritDmg = 0.5;
    let critMultiplier = 1;
    critMultiplier = (1 - critRate) + critRate * (1 + baseCritDmg);
    return critMultiplier;
}
function baseArmorMultiplier(def) {
    let armorMultiplier = 1;
    if (!def)
        return 1; // incase defense is null
    if (def > 0) {
        //positive defense
        let decimal = (1 + (def / 100));
        armorMultiplier = 1 / (decimal); //damage reduction
    }
    else if (def < 0) {
        //negative defense
        let invertDef = -1 * def;
        let decimal = (1 + (invertDef / 100));
        armorMultiplier = 1 * (decimal); //damage Multiplied
    }
    // return 1 if no defense
    return Math.trunc(armorMultiplier * 100) / 100;
}
function penetrationArmorMultiplier(damageType, def, totPen) {
    if (damageType == "True" || !totPen || totPen === 0)
        return baseArmorMultiplier(def);
    let armor = def / 100;
    let pen = totPen / 100;
    let h = pen + 0.2;
    let penetrationMultiplier = 0;
    if (armor <= h) {
        let armorMultiplier = armor - pen;
        if (armor - pen > 0) {
            penetrationMultiplier = 1 / (1 + armorMultiplier);
        }
        else if (armor - pen < 0) {
            penetrationMultiplier = 1 - armorMultiplier;
        }
    }
    else if (armor >= h) {
        let armorMultiplier = armor / (1 + 5 * pen);
        penetrationMultiplier = 1 / (1 + armorMultiplier);
    }
    return Math.trunc(penetrationMultiplier * 10) / 10;
}
function getWeaponDamage(build) {
    let handleTypeId = ItemModule.toID(build.handle?.type);
    let bladeTypeId = ItemModule.toID(build.blade?.type);
    let weaponType = WeaponTypes.WeaponTypeTable[handleTypeId][bladeTypeId];
    let weaponConstructionData = WeaponTypes.ConstructionTypeTable[weaponType];
    build.constructionType = weaponConstructionData.constructionType;
    return weaponConstructionData;
}
function getBaseDamage(weaponDamage, totEffMultiplier) {
    let baseDamage = weaponDamage * totEffMultiplier;
    return baseDamage;
}
export function calculateDamage(outputType, outputTypeMultiplier, damagedata, attacker, target) {
    if (!damagedata.damage)
        return 1;
    outputTypeMultiplier = outputTypeMultiplier || attacker.damageTypes[outputType];
    let totEffBoost = undefined;
    let totEffMultiplier = (totEffBoost || 100) / 100; // incase totEffBoost is nil
    if (!totEffBoost) {
        [totEffMultiplier, totEffBoost] = getTotEffBoost(attacker);
        attacker.user.totEffBoost = totEffBoost;
    }
    let baseDamage = getBaseDamage(damagedata.damage, totEffMultiplier);
    /////////////////////////////Damage Bonus Multiplier/////////////////////////////
    let dmgBonusMults = getPerkModifications("onDmgBonusMultiplier", attacker, undefined, damagedata, attacker.user.damageModifications.damage_bonus_mods);
    let dmgDeductionMults = getPerkModifications("onDmgReducedMultiplier", target, undefined, damagedata, attacker.user.damageModifications.damage_reduced_mods);
    let totalDmgBonus = totalMultiplier(dmgBonusMults, true);
    let totalDmgDeduction = totalMultiplier(dmgDeductionMults, true);
    //console.log(baseDamage * (totalDmgBonus));
    let damageModification = ((baseDamage * (totalDmgBonus)) / totalDmgDeduction) * (outputTypeMultiplier);
    //Status Multiplier
    let dmgBufftBonusMults = getBuffModifications("onDmgBonusMultiplier", attacker, outputType, damagedata, attacker.user.damageModifications.damage_bonus_mods);
    let dmgBuffDeductionMults = getDebuffModifications("onDecreaseDmgBonusMultiplier", attacker, outputType, damagedata, attacker.user.damageModifications.damage_reduced_mods);
    let dmgBuffMults = ((damageModification * totalMultiplier(dmgBufftBonusMults, true)) / (totalMultiplier(dmgBuffDeductionMults, true)));
    ////////////////////////////Type Specific Multiplier/////////////////////////////
    let typeSpecificAtkMults = getPerkModifications("onSpecificDmgBonusMultiplier", attacker, outputType, damagedata, attacker.user.damageModifications.specific_bonus_mods);
    let typeSpecificDefMults = getPerkModifications("onSpecificDmgReducedMultiplier", target, outputType, damagedata, attacker.user.damageModifications.specific_reduced_mods);
    let dmgtypeSpecificMults = ((dmgBuffMults * totalMultiplier(typeSpecificAtkMults, true)) / totalMultiplier(typeSpecificDefMults, true));
    //Status Type Specific Multiplier
    let typeBuffsSpecificAtkMults = getBuffModifications("onSpecificDmgBonusMultiplier", attacker, outputType, damagedata, attacker.user.damageModifications.specific_bonus_mods);
    let dmgBufftypeSpecificMults = (dmgtypeSpecificMults * totalMultiplier(typeBuffsSpecificAtkMults, true));
    ////////////////////////////crit calculation/////////////////////////////
    let critMultiplier = 1;
    let critDamage = dmgBufftypeSpecificMults * critMultiplier;
    ////////////////////////////Armor Multiplier/////////////////////////////
    let defStatAliases = outputType + "Defense";
    //console.log(defStatAliases)
    let outputDefStat = target.stats[defStatAliases] || 0;
    //console.log(outputDefStat)
    //Attacker total pen
    const allAttackerPen = getPerkModifications("onArmorPenCalculation", attacker, outputType, damagedata, attacker.user.damageModifications.armor_mods);
    let attackerPen = Object.values(allAttackerPen).reduce((totPen, pen) => {
        return totPen + pen;
    }, 0);
    let totPen = attackerPen + (attacker.stats["ArmorPenetration"] || 0);
    //target total Pen
    const allTargetPen = getDebuffModifications("onArmorPenCalculation", target, outputType, damagedata, attacker.user.damageModifications.armor_mods);
    let targetPen = Object.values(allTargetPen).reduce((totPen, pen) => {
        return totPen + pen;
    }, 0);
    // if the targetPen is -10 that it a increase in pen for the attack so turn it postive
    //if the targetPen is 10 that it a decrease in pen for the attack so turn it neigtive
    targetPen = targetPen * -1;
    totPen = totPen + targetPen + (target.stats["ArmorPenetration"] || 0);
    let defMultiplier = penetrationArmorMultiplier(outputType, outputDefStat, totPen);
    let defDamage = defMultiplier * critDamage;
    //////////////////////////// Special Multiplier(Debuffs) /////////////////////////////
    let specialSpecificMultiplier = getDebuffModifications("onIncreaseSpecificDmgTaken", target, outputType, damagedata, attacker.user.damageModifications.special_mods);
    for (const [key, value] of Object.entries(getDebuffModifications("onIncreaseDmgTaken", target, outputType, damagedata, attacker.user.damageModifications.special_mods))) {
        if (value === undefined)
            continue;
        specialSpecificMultiplier[key] = value;
    }
    let dmgspecialBonusMults = (defDamage * totalMultiplier(specialSpecificMultiplier, true));
    //////////////////////////// Level Multiplier /////////////////////////////
    let levelDamage = dmgspecialBonusMults * (1 + (levelBoost(attacker) / 100));
    return levelDamage;
}
export function runDamage(baseDamage, attacker, target, attackerBuild, targetBuild) {
    const outputDamages = {};
    let totalDamage = 0;
    targetBuild = {
        level: targetBuild?.level || target.level,
        stats: targetBuild?.stats || target.stats,
        perks: targetBuild?.perks || target.perks,
        damageScalings: targetBuild?.damageScalings || (target.damageScalings),
        damageTypes: targetBuild?.damageTypes || (target.damageTypes),
        buff: targetBuild?.buff || target.buff || [],
        deBuffs: targetBuild?.deBuffs || target.deBuffs || [],
        user: target,
    };
    attackerBuild = {
        level: attackerBuild?.level || attacker.level,
        stats: attackerBuild?.stats || attacker.stats,
        perks: attackerBuild?.perks || attacker.perks,
        damageScalings: attackerBuild?.damageScalings || (attacker.damageScalings),
        damageTypes: attackerBuild?.damageTypes || (attacker.damageTypes),
        buff: attackerBuild?.buff || attacker.buff || [],
        deBuffs: attackerBuild?.deBuffs || attacker.deBuffs || [],
        user: attacker,
        target: targetBuild,
    };
    const damageTypes = attackerBuild.damageTypes || {};
    for (const outputType of Object.keys(damageTypes)) {
        const outputTypeMultiplier = damageTypes[outputType];
        if (!outputTypeMultiplier)
            continue;
        const Damage = calculateDamage(outputType, outputTypeMultiplier, baseDamage, attackerBuild, targetBuild);
        outputDamages[outputType] = Math.round(Damage * 100) / 100;
        totalDamage += outputDamages[outputType];
    }
    return [outputDamages, totalDamage];
}
function getWeaponDamages(attacker, target) {
    let weaponConstructionData = getWeaponDamage(attacker);
    let m1Index = 0;
    weaponConstructionData.m1?.forEach(([damage, timesHit]) => {
        const baseDamageData = {
            damage,
            hitAmount: timesHit,
            source: weaponConstructionData.constructionType,
            sourceType: "Weapon",
            sourceDamageType: "M1",
        };
        let outputDamages = runDamage(baseDamageData, attacker, target);
        if (!attacker.m1[m1Index]) {
            attacker.m1[m1Index] = {};
        }
        for (const [outputType, damage] of Object.entries(outputDamages[0])) {
            if (damage === undefined)
                continue;
            attacker.m1[m1Index][outputType] = Math.trunc(damage * 10) / 10;
        }
        m1Index++;
    });
    let m2Index = 0;
    weaponConstructionData.m2?.forEach(([damage, timesHit]) => {
        const baseDamageData = {
            damage,
            hitAmount: timesHit,
            source: weaponConstructionData.constructionType,
            sourceType: "Weapon",
            sourceDamageType: "M2",
        };
        let outputDamages = runDamage(baseDamageData, attacker, target);
        if (!attacker.m2[m2Index]) {
            attacker.m2[m2Index] = {};
        }
        for (const [outputType, damage] of Object.entries(outputDamages[0])) {
            if (damage === undefined)
                continue;
            attacker.m2[m2Index][outputType] = Math.trunc(damage * 10) / 10;
        }
        m2Index++;
    });
}
export function runWeaponDamageCalculation(build, target) {
    if (!build.blade || !build.handle)
        return;
    for (const [perk, amount] of Object.entries(build.perks)) {
        if (!Perks.PerkStore.getByID(perk))
            continue;
        let perkData = Perks.PerkStore.getByID(perk);
        let callBack = perkData.onOutputCalculation;
        if (!callBack)
            continue;
        callBack.apply(build, [amount]);
    }
    getWeaponDamages(build, target || targets.Dummy);
}
export function runNonWeaponDamageCalculation(baseDamageData, build, target, attackerBuild, targetBuild) {
    for (const [perk, amount] of Object.entries(build.perks)) {
        if (!Perks.PerkStore.getByID(perk))
            continue;
        let perkData = Perks.PerkStore.getByID(perk);
        let callBack = perkData.onOutputCalculation;
        if (!callBack)
            continue;
        callBack.apply(build, [amount]);
    }
    let [outputs, total] = runDamage(baseDamageData, build, target || targets.Dummy, attackerBuild, targetBuild);
    return { outputs, total };
}
export function calculateUpgrade(stats, upgrade) {
    if (!stats)
        return stats;
    let multiplier = (upgrade / 10);
    for (const [key, value] of Object.entries(stats)) {
        if (value === undefined || !stats[key])
            continue;
        let statAmount = value >= 0 ? value : value * -1;
        stats[key] += Math.trunc((statAmount * multiplier) * 10) / 10;
    }
    return stats;
}
