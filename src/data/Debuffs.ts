export const Debuffs: import("../models/Buffs").BuffDataTable = {
  shatter: {
    id: "shatter",
    name: "Shatter",
    category: "Debuff",
    baseDuration: 5,
    onArmorPenCalculation(perkAmount) {
      let baseMultiplier = -10;
      let multiplier = -10 * 1;
      //console.log(multiplier);
      return multiplier ;
    },
    img: "",
  },

  bleed: {
    id: "bleed",
    name: "Bleed",
    category: "Debuff",
    baseDuration: 5,
    damageScalings: {
      Physical: 1,
      Dexterity: 1,
    },
    damageTypes: {
      Physical: 1,
    },
    getDamageInfo(perkAmount) {
      if (!perkAmount) return null;
      let baseDamage = 1;
      // if (perkAmount < 10) {
      //   baseDamage = ((perkAmount/10) ^ (1 + perkAmount/10)) * (1 + perkAmount/15)
      // } else {
      //   baseDamage = ((perkAmount/10) ^ 2) * (1 + perkAmount/15)
      // }
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
    damageScalings: {
      Fire: 1.5,
    },
    damageTypes: {
      Fire: 1,
    },
    getDamageInfo(perkAmount) {
      if (!perkAmount) return null;
      let baseDamage = 1;
      // if (perkAmount < 10) {
      //   baseDamage = ((perkAmount/10) ^ (1 + perkAmount/10)) * (1 + perkAmount/15)
      // } else {
      //   baseDamage = ((perkAmount/10) ^ 2) * (1 + perkAmount/15)
      // }
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
    damageScalings: {
      Hex: 1,
      Earth: 1,
    },
    damageTypes: {
      Hex: 1,
    },
    getDamageInfo(perkAmount) {
      if (!perkAmount) return null;
      let baseDamage = 1;
      // if (perkAmount < 10) {
      //   baseDamage = ((perkAmount/10) ^ (1 + perkAmount/10)) * (1 + perkAmount/15)
      // } else {
      //   baseDamage = ((perkAmount/10) ^ 2) * (1 + perkAmount/15)
      // }
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
    onDecreaseDmgBonusMultiplier(perkAmount) {
      let potency = 0.1;
      let multiplier = 1 - (1/(1+potency));
      //console.log(multiplier);
      return Math.trunc(multiplier * 100) / 100;
    },
    img: "",
  },
};