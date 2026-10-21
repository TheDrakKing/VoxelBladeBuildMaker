/** Board DoT formula: source multiplier and additive item potency remain separate. */
function getStatusDamageFromPotency(additivePotency = 0, sourcePotency = 0) {
  if (!Number.isFinite(additivePotency) || !Number.isFinite(sourcePotency)) return null;
  const potency = Math.max(0, additivePotency) / 10;
  return (1 + Math.max(0, sourcePotency)) * (1 + potency) ** (potency < 1 ? 1 + potency : 2);
}

export const Debuffs: import("../models/Buffs").BuffDataTable = {
  despair: {
    id: "despair", name: "Despair", category: "Debuff", potencyId: "despairpotency",
    scenarioDetails: "Despair grants +8.5% damage per 0.1 effective potency to its holder. For Grounded Despair, select its source and Applied by Self. Jump/landing application and shockwave are manual.",
    onDmgBonusMultiplier(potency) { return potency ? 0.085 * potency : null; },
  },
  shatter: {
    id: "shatter",
    name: "Shatter",
    category: "Debuff",
    baseDuration: 5,
    potencyId: "shatterpotency",
    onArmorPenCalculation(perkAmount) {
      if (!perkAmount) return null;
      const multiplier = -10 * perkAmount;
      return Math.trunc(multiplier * 10) / 10;
    },
    img: "",
  },

  bleed: {
    id: "bleed",
    name: "Bleed",
    category: "Debuff",
    baseDuration: 5,
    potencyId: "bleedpotency",
    damageScalings: {
      Physical: 1,
      Dexterity: 1,
    },
    damageTypes: {
      Physical: 1,
    },
    getDamageInfo(additivePotency, sourcePotency) {
      const baseDamage = getStatusDamageFromPotency(additivePotency, sourcePotency);
      if (baseDamage === null) return null;
      return {
        damage: baseDamage,
        hitAmount: 1,
        source: "bleed",
        sourceDamageType: "Status",
        sourceType: "Status"
      }
    },
    img: "",
  },

  burn: {
    id: "burn",
    name: "Burn",
    category: "Debuff",
    baseDuration: 5,
    potencyId: "burnpotency",
    damageScalings: {
      Fire: 1.5,
    },
    damageTypes: {
      Fire: 1,
    },
    getDamageInfo(additivePotency, sourcePotency) {
      const baseDamage = getStatusDamageFromPotency(additivePotency, sourcePotency);
      if (baseDamage === null) return null;
      return {
        damage: baseDamage,
        hitAmount: 1,
        source: "burn",
        sourceDamageType: "Status",
        sourceType: "Status"
      }
    },
    img: "",
  },

  frostbite: {
    id: "frostbite",
    name: "Frostbite",
    category: "Debuff",
    baseDuration: 5,
    onIncreaseSpecificDmgTaken(perkAmount, args) {
      if (!args || !args.outputType) return null;
      if (args.outputType !== "Water" && args.outputType !== "Air") return null;
      let baseMultiplier = 10;
      let multiplier = baseMultiplier / 100;
      //console.log(multiplier);
      return Math.trunc(multiplier * 100) / 100;
    },
    img: "",
  },

  poison: {
    id: "poison",
    name: "Poison",
    category: "Debuff",
    baseDuration: 5,
    potencyId: "poisonpotency",
    damageScalings: {
      Hex: 1,
      Earth: 1,
    },
    damageTypes: {
      Hex: 1,
    },
    getDamageInfo(additivePotency, sourcePotency) {
      const baseDamage = getStatusDamageFromPotency(additivePotency, sourcePotency);
      if (baseDamage === null) return null;
      return {
        damage: baseDamage,
        hitAmount: 1,
        source: "poison",
        sourceDamageType: "Status",
        sourceType: "Status"
      }
    },
    img: "",
  },

  slow: {
    id: "slow",
    name: "Slow",
    category: "Debuff",
    baseDuration: 5,
    img: "",
  },

  sticky: {
    id: "sticky",
    name: "Sticky",
    category: "Debuff",
    baseDuration: 5,
    onIncreaseSpecificDmgTaken(perkAmount, args) {
      if (!args || !args.outputType) return null;
      if ((args.outputType) !== "Magic") return null;
      let baseMultiplier = 20;
      let multiplier = baseMultiplier / 100;
      //console.log(multiplier);
      return Math.trunc(multiplier * 100) / 100;
    },
    img: "",
  },

  taunt: {
    id: "taunt",
    name: "Taunt",
    category: "Debuff",
    baseDuration: 5,
    img: "",
  },

  weakness: {
    id: "weakness",
    name: "Weakness",
    category: "Debuff",
    baseDuration: 5,
    potencyId: "weakeningpotency",
    onDecreaseDmgBonusMultiplier(perkAmount) {
      if (!perkAmount) return null;
      // Combat divides outgoing damage by (1 + this bonus).
      return perkAmount / 10;
    },
    img: "",
  },
};
