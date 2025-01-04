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
        total = total == undefined ? 1 : total;
        total = total;
    }
    else {
        total = total == undefined ? 1 : total;
    }
    //console.log(total);
    return total;
}
function levelBoost(build) {
    let Boost = build.level * 1.25;
    build.damageModifications.damage_bonus_mods["Level"] = Boost / 100;
    return Boost;
}
function getPerkModifications(event, holder, outputType, Modifications) {
    let perkModifications = {};
    for (const [perk, amount] of Object.entries(holder.perks)) {
        if (!Perks.PerkStore.getByID(perk))
            continue;
        let perkData = Perks.PerkStore.getByID(perk);
        let callBack = perkData[event];
        if (!callBack)
            continue;
        let args = [amount, outputType];
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
        build.effectiveBoosts[statId] = statEffectiveBoost;
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
    //console.log(penetrationMultiplier);
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
export function calculateDamage(weaponDamage, attacker, outputType, target) {
    if (!weaponDamage)
        return 1;
    let outputTypeMultiplier = attacker.damageTypes[outputType];
    let totEffBoost = attacker.totEffBoost;
    let totEffMultiplier = (totEffBoost || 100) / 100; // incase totEffBoost is nil
    if (!totEffBoost) {
        [totEffMultiplier, totEffBoost] = getTotEffBoost(attacker);
        attacker.totEffBoost = totEffBoost;
    }
    console.log(totEffMultiplier);
    let baseDamage = getBaseDamage(weaponDamage, totEffMultiplier);
    /////////////////////////////Damage Bonus Multiplier/////////////////////////////
    let dmgBonusMults = getPerkModifications("onDmgBonusMultiplier", attacker, undefined, attacker.damageModifications.damage_bonus_mods);
    let dmgDeductionMults = getPerkModifications("onDmgReducedMultiplier", target, undefined, attacker.damageModifications.damage_reduced_mods);
    let totalDmgBonus = totalMultiplier(dmgBonusMults, true);
    let totalDmgDeduction = totalMultiplier(dmgDeductionMults);
    //console.log(baseDamage * (totalDmgBonus));
    let damageModification = ((baseDamage * (totalDmgBonus)) * totalDmgDeduction) * (outputTypeMultiplier);
    ////////////////////////////Type Specific Multiplier/////////////////////////////
    let typeSpecificAtkMults = getPerkModifications("onSpecificDmgBonusMultiplier", attacker, outputType, attacker.damageModifications.specific_bonus_mods);
    let typeSpecificDefMults = getPerkModifications("onSpecificDmgReducedMultiplier", target, outputType, attacker.damageModifications.specific_reduced_mods);
    let dmgtypeSpecificMults = ((damageModification * totalMultiplier(typeSpecificAtkMults, true)) * totalMultiplier(typeSpecificDefMults));
    ////////////////////////////crit calculation/////////////////////////////
    let critMultiplier = 1;
    let critDamage = dmgtypeSpecificMults * critMultiplier;
    ////////////////////////////Armor Multiplier/////////////////////////////
    let defStatAliases = outputType + "Defense";
    //console.log(defStatAliases)
    let outputDefStat = target.stats[defStatAliases] || 0;
    //console.log(outputDefStat)
    let totPen = attacker.stats["ArmorPenetration"];
    let defMultiplier = penetrationArmorMultiplier(outputType, outputDefStat, totPen);
    //console.log(defMultiplier)
    let defDamage = defMultiplier * critDamage;
    //////////////////////////// Special Multiplier /////////////////////////////
    //////////////////////////// Level Multiplier /////////////////////////////
    let levelDamage = defDamage * (1 + (levelBoost(attacker) / 100));
    return levelDamage;
}
function runDamages(attacker, damageType, target) {
    let weaponConstructionData = getWeaponDamage(attacker);
    let m1Index = 0;
    weaponConstructionData.m1?.forEach(([damage, timesHit]) => {
        let atkDamage = calculateDamage(damage, attacker, damageType, target);
        if (!attacker.m1[m1Index]) {
            attacker.m1[m1Index] = {};
        }
        attacker.m1[m1Index][damageType] = Math.trunc(atkDamage * 10) / 10;
        m1Index++;
    });
    let m2Index = 0;
    weaponConstructionData.m2?.forEach(([damage, timesHit]) => {
        let atkDamage = calculateDamage(damage, attacker, damageType, target);
        if (!attacker.m2[m2Index]) {
            attacker.m2[m2Index] = {};
        }
        attacker.m2[m2Index][damageType] = Math.trunc(atkDamage * 10) / 10;
        m2Index++;
    });
}
export function runDamageCalculation(build, target) {
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
    for (const [key, value] of Object.entries(build.damageTypes)) {
        if (value === undefined)
            continue;
        runDamages(build, key, target || targets.Dummy);
    }
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
