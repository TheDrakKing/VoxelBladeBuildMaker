
import * as ItemModule from "../models/Item.js";
import * as WeaponTypes from "../models/WeaponTypes.js";
import * as Build from "../models/Build.js";
import * as Perks from "../models/Perk.js";
import * as targets from "./targets.js";

function totalMultiplier(dmgBonusMults:Build.stats)  {
	let total = 1
	for (const [key, value] of Object.entries(dmgBonusMults) as [ItemModule.stat,number?][]) {
    if(value === undefined) continue;
		total *= value;
  }
	return total
}

function levelBoost(build: Build.Build): number {
    console.log(build.level);
  return build.level * 1.25;
}

function getAtkPerkModifications(event:string, holder:Build.Build, baseDamage?:number, outputType?:string): Build.stats {
  let perkModifications = {} as Build.stats;

  for (const [perk, amount] of Object.entries(holder.perks)) {
    //if (!Perks[perk]) continue;
    //let perkData = Perks[perk]
    //if (perkData[event]) continue;
    //let callBack = perk[event]
    //let args = [amount, baseDamage, outputType];
    //let [mod, value] = callBack.appy(holder, args) // if it's def or atk Modification
    //if (! mod || !value) continue // the conditions of the call back were not met
    //perkModifications[perk.name] = perk.value;
  }

  return perkModifications;
}

function getStatEffBoost(scale: number, statBoost:number): number {
  if (!scale  || !statBoost) return 0;
  let statEffectiveBoost = scale * statBoost;
  return statEffectiveBoost;
}

function getTotEffBoost(build: Build.Build): [number, number] {
  let total = 0; // Decimal vale
  let totEffBoost = 0 // percentage value of totEffBoost

  for (const [scale, value] of Object.entries(build.damageScalings) as [ItemModule.scale, number?][]) {
    if (value === undefined) continue;
    let statId = (scale + "Boost") as ItemModule.stat; // get the aliases of the stat from the scale
		let statBoost = build.stats[statId];
		if (!statBoost) continue // maybe that Boost doesn't have a scale
    let statEffectiveBoost = getStatEffBoost(value, statBoost);
    build.effectiveBoosts[statId] = statEffectiveBoost;
    total += statEffectiveBoost;
  }

  total = 1 + (1 * total) / 100;
  totEffBoost = total * 100;
  return [totEffBoost, total];
}

function critMultiplier(critRate:number) : number {
	let baseCritDmg = 0.5
	let critMultiplier = 1;
	
	critMultiplier = (1 - critRate) + critRate * (1 + baseCritDmg)
  return critMultiplier;
}

function baseArmorMultiplier(def: number): number {
  let armorMultiplier = 1;

  if (!def) return 1; // incase defense is null

  if (def > 0) {
    //positive defense
    let decimal = (1 + def / 100)
    armorMultiplier = 1 / (1 + decimal); //damage reduction
  } else if (def < 0) {
    //negative defense
    let invertDef = -1 * def;
    let decimal = (1 + invertDef / 100)
    armorMultiplier = 1 / (1 + decimal); //damage Multiplied
  }

  // return 1 if no defense

  return armorMultiplier;
}

function penetrationArmorMultiplier(damageType: ItemModule.damageType, def: number, totPen?: number): number {
  if (damageType == "True" || !totPen || totPen === 0) return baseArmorMultiplier(def);

  let armor = def/100
	let pen = totPen/100

  let h = pen + 0.2;

  let penetrationMultiplier = 0;

  if (armor <= h) {
    let armorMultiplier = armor - pen;
    if (armor - pen > 0) {
      penetrationMultiplier = 1 / (1 + armorMultiplier);
    } else if (armor - pen < 0) {
      penetrationMultiplier = 1 - armorMultiplier;
    }
  } else if (armor >= h) {
    let armorMultiplier = armor / (1 + 5 * pen);
    penetrationMultiplier = 1 / (1 + armorMultiplier);
  }

  return penetrationMultiplier;
}

function getWeaponDamage(build:Build.Build) : WeaponTypes.ConstructionData {
  let handleTypeId = ItemModule.toID(build.handle?.type as string);
  let bladeTypeId = ItemModule.toID(build.blade?.type as string);

  let weaponType = WeaponTypes.WeaponTypeTable[handleTypeId][bladeTypeId];
  let weaponConstructionData = WeaponTypes.ConstructionTypeTable[weaponType];
  build.constructionType = weaponConstructionData.constructionType;
  return weaponConstructionData;
}

function getBaseDamage(baseDamage:number, totEffMultiplier:number) :number {
	let bsDamage = baseDamage * totEffMultiplier;
	return baseDamage
}

export function calculateDamage(weaponDamage:number, attacker: Build.Build, outputType:ItemModule.damageType, target:Build.Build):number {
  if (!weaponDamage) return 1;

  let outputTypeMultiplier = attacker.damageTypes[outputType]!;

  let totEffBoost = attacker.totEffBoost;
  let totEffMultiplier = (totEffBoost || 100) / 100; // incase totEffBoost is nil

  if (!totEffBoost) {
    [totEffMultiplier, totEffBoost] = getTotEffBoost(attacker);
    attacker.totEffBoost = totEffBoost;
  }

  let baseDamage = getBaseDamage(weaponDamage, totEffMultiplier);

  /////////////////////////////Damage Bonus Multiplier/////////////////////////////
  let dmgBonusMults = getAtkPerkModifications("damageMultiplier", attacker, baseDamage)
  let dmgDeductionMults = getAtkPerkModifications("damageReducation ", target, baseDamage)
      
  let totalDmgBonus = totalMultiplier(dmgBonusMults)
  let totalDmgDeduction = totalMultiplier(dmgDeductionMults)
  
  let damageModification = ((baseDamage * totalDmgBonus) * totalDmgDeduction) * outputTypeMultiplier

  ////////////////////////////Type Specific Multiplier/////////////////////////////
  let typeSpecificAtkMults = getAtkPerkModifications("specificAtkMultiplier ", attacker, baseDamage, outputType)	
	let typeSpecificDefMults = getAtkPerkModifications("specificDefMultiplier ", target, baseDamage, outputType)	
		
	let dmgtypeSpecificMults = ((damageModification * totalMultiplier(typeSpecificAtkMults)) * totalMultiplier(typeSpecificDefMults))

  ////////////////////////////crit calculation/////////////////////////////
  let critMultiplier = 1
		
	let critDamage = dmgtypeSpecificMults * critMultiplier;

  ////////////////////////////Armor Multiplier/////////////////////////////
  let defStatAliases = outputType + "Defense" as ItemModule.stat;
		
	//console.log(defStatAliases)
		
  let outputDefStat = target.stats[defStatAliases] || 0
  
  //console.log(outputDefStat)
  
  let totPen = attacker.stats["ArmorPenetration"];
  let defMultiplier = penetrationArmorMultiplier(outputType, outputDefStat, totPen)

  //console.log(defMultiplier)

  let defDamage = defMultiplier * critDamage

  //////////////////////////// Special Multiplier /////////////////////////////

  //////////////////////////// Level Multiplier /////////////////////////////

  let levelDamage = defDamage * (1 + (levelBoost(attacker)/100))

  return levelDamage;
}

function runDamages(attacker: Build.Build, damageType: ItemModule.damageType, target:Build.Build) {
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

export function runDamageCalculation(build:Build.Build, target?:Build.Build) {
  if (!build.blade || !build.handle) return;

  for (const [key, value] of Object.entries(build.damageTypes) as [ItemModule.damageType,number?][]) {
    if (value === undefined) continue;
    runDamages(build, key, target || targets.Dummy);
  }
}

export function calculateUpgrade(stats:Build.stats, upgrade:number) :Build.stats {
  if (!stats) return stats;

  let multiplier = (upgrade/10)

  for (const [key, value] of Object.entries(stats) as [ItemModule.stat,number?][]) {
    if (value === undefined || !stats[key]) continue;
    let statAmount = value >= 0 ? value : value * -1;
    stats[key] += Math.trunc((statAmount * multiplier) * 10)/10;
  }

  return stats;
}