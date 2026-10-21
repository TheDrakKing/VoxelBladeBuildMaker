export const Buffs: import("../models/Buffs").BuffDataTable = {
  scenario_sunlight: {
    id: "scenario_sunlight", name: "In Sunlight", category: "Buff", countsAsBuff: false, exclusiveGroup: "lighting",
    scenarioDetails: "Manual lighting condition for Photosynthesis, Vampire, and Concealed Edge. Replaces In Shadows and does not count as a game buff.",
  },
  scenario_shadow: {
    id: "scenario_shadow", name: "In Shadows", category: "Buff", countsAsBuff: false, exclusiveGroup: "lighting",
    scenarioDetails: "Manual lighting condition for Concealed Edge and Vampire. Replaces In Sunlight and does not count as a game buff.",
  },
  scenario_airborne: {
    id: "scenario_airborne", name: "Airborne", category: "Buff", countsAsBuff: false,
    scenarioDetails: "Manual airborne condition for Frequent Flier. Can be combined with a mount; does not count as a game buff.",
  },
  scenario_mounted: {
    id: "scenario_mounted", name: "Mounted", category: "Buff", countsAsBuff: false, exclusiveGroup: "mount",
    scenarioDetails: "Manual non-Glacial mount condition for Rider. Replaces Mounted: Glacial Snapper; does not count as a game buff.",
  },
  scenario_glacial_snapper: {
    id: "scenario_glacial_snapper", name: "Mounted: Glacial Snapper", category: "Buff", countsAsBuff: false, exclusiveGroup: "mount",
    scenarioDetails: "Manual Glacial Snapper condition for Rider and Mounted Defense. Replaces Mounted; does not count as a game buff.",
  },
  civilian_ready: {
    id: "civilian_ready", name: "Civilian Ready", category: "Buff", countsAsBuff: false,
    scenarioDetails: "Select after keeping your weapon stowed for more than three seconds. Enables Civilian's Rune bonus; timing and armor-swap clearing are manual.",
  },
  energize_charged: {
    id: "energize_charged", name: "Energize Charged", category: "Buff", countsAsBuff: false,
    scenarioDetails: "Preview a fully charged Energize Weapon Art packet. Buildup and consumption are manual; this control is not another game buff.",
  },
  quickdraw: {
    id: "quickdraw", name: "Quickdraw", category: "Buff", countsAsBuff: false, baseDuration: 5,
    scenarioDetails: "Neutral status for the short period after drawing your weapon. Enables Quickdraw's Rune/Weapon Art bonus without counting as a game buff.",
  },
  star_barrage: {
    id: "star_barrage", name: "Star Barrage", category: "Buff", baseDuration: 5,
    scenarioDetails: "Select after a Weapon Art. With the equipped Star Barrage perk, adds 20 + 25 * perk amount Attack Speed points. Self-buff preview; no automatic expiration.",
  },
  flash_strike: {
    id: "flash_strike", name: "Flash Strike", category: "Buff", baseDuration: 3,
    scenarioDetails: "Select after a parry. With the equipped Flash Strike perk, adds 75 Attack Speed points per perk. Self-buff preview; no automatic expiration.",
  },
  blood_lust: {
    id: "blood_lust", name: "Blood Lust", category: "Buff", baseDuration: 5, potencyId: "bloodlustpotency",
    scenarioDetails: "Set current Blood Lust potency manually. Adds 20 * effective potency Attack Speed points with the perk. The documented cap at one perk is 2.5; additional cap scaling and hit-based buildup are unverified.",
  },
  inspired: {
    id: "inspired", name: "Inspired", category: "Buff", baseDuration: 15,
    scenarioDetails: "Self-buff preview for Inspiration: adds 7.5% damage per equipped Inspiration. Ally pulses and True Balance's unspecified Inspired potency formula are not simulated.",
  },
  protection_shield_active: {
    id: "protection_shield_active", name: "Protection Shield Active", category: "Buff", countsAsBuff: false, baseDuration: 0,
  },
  blood_thirsty_proc: {
    id: "blood_thirsty_proc", name: "Blood Thirsty Proc", category: "Buff", countsAsBuff: false, baseDuration: 0,
  },
  venom_eater_proc: {
    id: "venom_eater_proc", name: "Venom Eater Proc", category: "Buff", countsAsBuff: false, baseDuration: 0,
    consumptionTiming: "after",
  },
  scourge_proc: {
    id: "scourge_proc", name: "Scourge Proc", category: "Buff", countsAsBuff: false, baseDuration: 0,
  },
  static_charge: {
    id: "static_charge", name: "Static Charge", category: "Buff", countsAsBuff: false, baseDuration: 0, stacks: 1,
  },
  bounce: {
    id: "bounce",
    name: "Bounce",
    category: "Buff",
    baseDuration: 5,
    potencyId: "bouncepotency",
    img: "",
  },

  guaranteed_crit: {
    id: "guaranteed_crit",
    name: "Guaranteed Crit",
    category: "Buff",
    baseDuration: 5,
    potencyId: "guaranteedcritpotency",
    onCritRateCalculation() {
      return 1;
    },
    img: "",
  },

  rage: {
    id: "rage",
    name: "Rage",
    category: "Buff",
    baseDuration: 5,
    potencyId: "ragepotency",
    onSpecificDmgBonusMultiplier(potency, args) {
      if (!potency || !args?.outputType) return null;
      const type = args.outputType;
      const eligible = type === "Physical" || (type === "True" && (this.perks.scourge || 0) > 0) ||
        (type === "Magic" && (this.perks.mage_rage || 0) > 0) ||
        (type === "Water" && (this.perks.oceans_rage || 0) > 0);
      return eligible ? potency / 10 : null;
    },
    img: "",
  },

  regen: {
    id: "regen",
    name: "Regen",
    category: "Buff",
    baseDuration: 5,
    potencyId: "regenpotency",
    img: "",
  },

  reinforce: {
    id: "reinforce",
    name: "Reinforce",
    category: "Buff",
    baseDuration: 5,
    potencyId: "reinforcepotency",
    onDmgReducedMultiplier(potency) {
      return potency ? potency / 10 : null;
    },
    img: "",
  },

  tailwind: {
    id: "tailwind",
    name: "Tailwind",
    category: "Buff",
    potencyId: "tailwindpotency",
    baseDuration: 5,
    img: "",
  },

  draconic_infusion: {
    id: "draconic_infusion",
    name: "Draconic Infusion",
    category: "Buff",
    baseDuration: 5,
    img: "",
  },

  lightning_cloak: {
    id: "lightning_cloak",
    name: "Lightning Cloak",
    category: "Buff",
    baseDuration: 5,
    potencyId: "lightningcloakpotency",
    img: "",
  },
};
