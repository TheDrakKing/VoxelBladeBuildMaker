function getStatusDamageFromPotency(potency?: number) {
  if (!potency || potency <= 0) return null;

  const scaledPotency = potency / 10;

  if (potency < 10) {
    return Math.pow(scaledPotency, 1 + scaledPotency) * (1 + potency / 15);
  }

  return Math.pow(scaledPotency, 2) * (1 + potency / 15);
}

export const Debuffs: import("../models/Buffs").BuffDataTable = {
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
    getDamageInfo(perkAmount) {
      const baseDamage = getStatusDamageFromPotency(perkAmount);
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
    getDamageInfo(perkAmount) {
      const baseDamage = getStatusDamageFromPotency(perkAmount);
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
    getDamageInfo(perkAmount) {
      const baseDamage = getStatusDamageFromPotency(perkAmount);
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
      const potency = perkAmount / 10;
      let multiplier = 1 - (1/(1+potency));
      return Math.trunc(multiplier * 100) / 100;
    },
    img: "",
  },
};
