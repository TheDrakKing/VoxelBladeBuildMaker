/** Board DoT formula: source multiplier and additive item potency remain separate. */
function getStatusDamageFromPotency(additivePotency = 0, sourcePotency = 0) {
  if (!Number.isFinite(additivePotency) || !Number.isFinite(sourcePotency)) return null;
  const potency = Math.max(0, additivePotency) / 10;
  return (1 + Math.max(0, sourcePotency)) * (1 + potency) ** (potency < 1 ? 1 + potency : 2);
}

import { isMagicDamageType } from "../models/Conditions.js";

export const Debuffs: import("../models/Buffs").BuffDataTable = {
  wound: {
    id: "wound", name: "Wound", category: "Debuff", baseDuration: 6,
    calculationNote: "Placeholder: +0.1 True output on Bleed",
    scenarioDetails: "User-selected placeholder: adds 0.1 True output to incoming Bleed ticks, preserving their existing output and applicant scaling. The game value and stun amount are undocumented. Wound is a separate debuff, so it counts for debuff-count effects and remains when Bleed is consumed. Application and approximately six-second expiration are manual; owning Sharp Claws is not required to receive Wound.",
    onIncomingOutputCalculation(_potency, args) {
      if (this.target && args?.baseDamageData?.sourceType === "Status" && args.baseDamageData.source === "bleed") this.target.damageTypes.True = (this.target.damageTypes.True || 0) + 0.1;
    },
  },
  anti_heal: {
    id: "anti_heal", name: "Anti-Heal", category: "Debuff",
    calculationNote: "Melting Shred marker; healing reduction uncalculated",
    scenarioDetails: "Separate anti-healing debuff from Melting Shred. Counts for debuff-count effects. The board gives no healing-reduction amount or exact duration, so neither is invented. Application is manual and does not require the applicant to be under a DoT.",
  },
  void_contract: {
    id: "void_contract", name: "Void Contract", category: "Debuff", potencyId: "voidcontractpotency",
    scenarioDetails: "Direct damage from this mark's applicant gains 30% per source perk. Other attackers and DoTs do not qualify. Remaining hits and removal are manual.",
    onIncreaseDmgTaken(potency, args) {
      const mark = this.deBuffs.find(status => status.id === "void_contract"), packet = args?.baseDamageData;
      return mark && mark.getSourceBuild(this) === this.target && packet && packet.sourceType !== "Status" && !packet.tags?.includes("DoT") ? 0.3 * (potency || 0) : null;
    },
  },
  hypnotist: {
    id: "hypnotist", name: "Hypnotist", category: "Debuff", potencyId: "hypnotistpotency", baseDuration: 15,
    scenarioDetails: "Adds 5 Magic-family penetration per source perk. Select after the applying hit. Aggro and expiration are manual.",
    onArmorPenCalculation(potency, args) { return potency && isMagicDamageType(args?.outputType) ? -5 * potency : null; },
  },
  electrical_rend: {
    id: "electrical_rend", name: "Electrical Rend", category: "Debuff", potencyId: "electricalrendpotency",
    scenarioDetails: "Adds 10 penetration per 0.1 effective potency. Separate from Shatter; chain damage, stun, and application are manual.",
    onArmorPenCalculation(potency) { return potency ? -10 * potency : null; },
  },
  ghastly_rot: {
    id: "ghastly_rot", name: "Ghastly Rot", category: "Debuff",
    scenarioDetails: "Poison on this target uses True output regardless of its applicant. Unknown bonus damage, spreading, and chance rolls are not calculated.",
    onIncomingOutputCalculation(_potency, args) {
      if (this.target && args?.baseDamageData?.sourceType === "Status" && args.baseDamageData.source === "poison") {
        const total = Object.values(this.target.damageTypes).reduce((sum, value) => sum + Math.max(0, value || 0), 0);
        this.target.damageTypes = { True: total };
      }
    },
  },
  heavy_gravitate: {
    id: "heavy_gravitate", name: "Heavy Gravitate", category: "Debuff", baseDuration: 15,
    scenarioDetails: "Select the marked target and correct applicant for a Heavy Gravitate RMB activation preview. Slow, poise, automatic application, and consumption are manual.",
  },

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
      return Math.round(multiplier * 10000) / 10000;
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
    onDecreaseDmgBonusMultiplier() {
      const burn = this.deBuffs.find(status => status.id === "burn"), source = burn?.getSourceBuild(this);
      if (!source || (source.perks.cursed_flames || 0) <= 0) return null;
      const potency = source.potencies.burnpotency || 0;
      const endless = burn?.getEndlessDespairAmount(source) || 0;
      return endless > 0 ? 0.2 + 0.1 * potency * endless : 0.1 + 0.1 * potency;
    },
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
        damage: (() => { const applicant = this.deBuffs?.find(status => status.id === "burn")?.getSourceBuild(this); return applicant && applicant !== this && (applicant.perks.cauterize || 0) > 0 ? 0 : baseDamage; })(),
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
    potencyId: "slowpotency",
    scenarioDetails: "Unmoving forces received Slow to 0.3 potency regardless of source or override. Movement effects are not calculated.",
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
