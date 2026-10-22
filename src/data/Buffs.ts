export const Buffs: import("../models/Buffs").BuffDataTable = {
  m1_finisher_confirmed: { id: "m1_finisher_confirmed", name: "Last M1 Is a Finisher", category: "Buff", countsAsBuff: false, scenarioDetails: "Select only when the final original M1 attack of this weapon is a finisher. Enables explicitly tagged M1 finisher interactions, including Delta Drill. Does not add a real buff." },
  protector_guard_ready: { id: "protector_guard_ready", name: "Protector Guard Ready", category: "Buff", countsAsBuff: false, scenarioDetails: "Manually selects the defensive Protector Spirit activation, including its roughly three-second cooldown being ready. Requires below-half HP or at least two Protector Spirit." },
  wild_bolt_fire: { id: "wild_bolt_fire", name: "Wild Bolt: Fire", category: "Buff", countsAsBuff: false },
  wild_bolt_water: { id: "wild_bolt_water", name: "Wild Bolt: Water", category: "Buff", countsAsBuff: false },
  wild_bolt_holy: { id: "wild_bolt_holy", name: "Wild Bolt: Holy", category: "Buff", countsAsBuff: false },
  wild_bolt_hex: { id: "wild_bolt_hex", name: "Wild Bolt: Hex", category: "Buff", countsAsBuff: false },
  wild_bolt_earth: { id: "wild_bolt_earth", name: "Wild Bolt: Earth", category: "Buff", countsAsBuff: false },
  wild_bolt_air: { id: "wild_bolt_air", name: "Wild Bolt: Air", category: "Buff", countsAsBuff: false },
  enemy_mob: { id: "enemy_mob", name: "Enemy Mob", category: "Buff", countsAsBuff: false, scenarioDetails: "Select on the target only when it represents an enemy NPC/mob, not a player. Enables Slow Leak's enemy-mob Bleed duration." },
  savage_combo_step: { id: "savage_combo_step", name: "Savage Combo Step", category: "Buff", countsAsBuff: false, stacks: 1, scenarioDetails: "Current consecutive M1 attack number, not hit number. First = 1, second = 2. Reset after the original combo, or after the second M1 on weapons without finishers." },
  slayer_rage_ticks: { id: "slayer_rage_ticks", name: "Slayer Rage Channel Ticks", category: "Buff", countsAsBuff: false, stacks: 1, scenarioDetails: "Current channel ticks, 0-20 (source preview caps at 20). Select Slayer Rage as Rage/Weakness source after setting this value. HP drain/damage remain unknown." },
  wave_rider_ready: { id: "wave_rider_ready", name: "Wave Rider Ready", category: "Buff", countsAsBuff: false, scenarioDetails: "Select at 100 Gathering Tide for the next empowered Weapon Art. Grants its 50% diminishing CDR per perk. Remove after use; no automatic charge or consumption." },
  kings_luck: { id: "kings_luck", name: "King's Luck", category: "Buff", countsAsBuff: true, scenarioDetails: "While selected, Ruler Of The Sands is guaranteed to activate. Proc/crit/dodge coefficients from other interactions are unknown and remain held." },

  steam_buildup_ready: { id: "steam_buildup_ready", name: "Steam Buildup Ready", category: "Buff", countsAsBuff: false, scenarioDetails: "Select at 8 / Steam Charge amount stacks. Replaces RMB with the ten-hit steam finisher; buildup and consumption are manual." },
  finisher_proc_number: { id: "finisher_proc_number", name: "Finisher Proc Number", category: "Buff", countsAsBuff: false, stacks: 1, scenarioDetails: "Finisher hit number for Gale Bursts and tornado emission number for Tempest (first = 1). Preview one emission; reset and skipped hits are manual." },
  quicksand_weapon_art_tick: { id: "quicksand_weapon_art_tick", name: "Quicksand Weapon Art Tick", category: "Buff", countsAsBuff: false, scenarioDetails: "Select for one of the half of Quicksand ticks classified Weapon Art. Other ticks preview as Perk; total tick count is unverified." },
  lithic_veil: { id: "lithic_veil", name: "Lithic Veil", category: "Buff", countsAsBuff: true, scenarioDetails: "Self-buff preview with the equipped perk: 0.2 flat Physical reduction per perk after defense. Transfer potency, stun resistance, and duration are unverified/manual." },
  minion_absorbed: { id: "minion_absorbed", name: "Minion Absorbed", category: "Buff", potencyId: "minionabsorbedpotency", scenarioDetails: "Damage bonus equals effective game potency. Source snapshots 0.002 * applicant Summon Boost * Minion Absorption amount. Summon strength, healing, duration, and consumption are manual.", onDmgBonusMultiplier(potency) { return potency ? potency / 10 : null; } },
  anti_venom: { id: "anti_venom", name: "Anti-Venom", category: "Buff", countsAsBuff: false, baseDuration: 20, scenarioDetails: "Neutral status: fixed 90% direct Hex resistance and +20 Movement Speed. Does not grant Hex immunity. Self-Poison application, duration extension, and expiration are manual.", onStatCalculation() { this.stats.SpeedBoost = Math.round(((this.stats.SpeedBoost || 0) + 20) * 10000) / 10000; }, onFinalDamageTakenMultiplier(_potency, args) { return args?.outputType === "Hex" ? 0.1 : 1; } },
  pure_rot_poison: { id: "pure_rot_poison", name: "Poison via Pure Rot", category: "Buff", countsAsBuff: false, scenarioDetails: "Select on the original applicant only while previewing Poison actually created via Pure Rot. Enables its 10%-per-perk Poison bonus. Turn off for ordinary Poison; transfer/kill-credit attribution is manual." },
  parry_hit: { id: "parry_hit", name: "Parried Hit", category: "Buff", countsAsBuff: false, scenarioDetails: "Manually qualify the selected incoming direct hit as parried: fixed 90% damage reduction. Does not affect status/DoT packets. Remove after that hit; no automatic parry triggers or cooldown changes.", onFinalDamageTakenMultiplier(_potency, args) { const packet = args?.baseDamageData; return packet && packet.sourceType !== "Status" && !packet.tags?.includes("DoT") ? 0.1 : 1; } },
  future_sight_ready: { id: "future_sight_ready", name: "Future Sight Ready", category: "Buff", countsAsBuff: false, scenarioDetails: "Manual ready-state for a qualifying incoming direct hit, reducing its damage to zero. Remove after the dodge. Split multi-hit packets to represent one-use consumption; recharge and dodging of status application are manual.", onFinalDamageTakenMultiplier(_potency, args) { const packet = args?.baseDamageData; return packet && packet.sourceType !== "Status" && !packet.tags?.includes("DoT") ? 0 : 1; } },
  sticky_sickness_variant: { id: "sticky_sickness_variant", name: "Sticky: Sickness Variant", category: "Buff", countsAsBuff: false, scenarioDetails: "Select alongside one Sticky debuff on this recipient to represent its green Sickness variant. Adds fixed 20% Hex vulnerability; existing Sticky retains Magic vulnerability. This qualifier is not another game buff/debuff.", onIncreaseSpecificDmgTaken(_potency, args) { return args?.outputType === "Hex" && this.deBuffs.some(status => status.id === "sticky") ? 0.2 : null; } },
  draconic_color_fire: { id: "draconic_color_fire", name: "Draconic Color: Fire", category: "Buff", countsAsBuff: false, exclusiveGroup: "draconic_color", scenarioDetails: "Manual skin-color selection for Draconic Runes only. Exactly one color enables 0.05 output per perk on Rune packets." },
  draconic_color_water: { id: "draconic_color_water", name: "Draconic Color: Water", category: "Buff", countsAsBuff: false, exclusiveGroup: "draconic_color", scenarioDetails: "Manual skin-color selection for Draconic Runes only. Exactly one color enables 0.05 output per perk on Rune packets." },
  draconic_color_holy: { id: "draconic_color_holy", name: "Draconic Color: Holy", category: "Buff", countsAsBuff: false, exclusiveGroup: "draconic_color", scenarioDetails: "Manual skin-color selection for Draconic Runes only. Exactly one color enables 0.05 output per perk on Rune packets." },
  draconic_color_hex: { id: "draconic_color_hex", name: "Draconic Color: Hex", category: "Buff", countsAsBuff: false, exclusiveGroup: "draconic_color", scenarioDetails: "Manual skin-color selection for Draconic Runes only. Exactly one color enables 0.05 output per perk on Rune packets." },
  draconic_color_earth: { id: "draconic_color_earth", name: "Draconic Color: Earth", category: "Buff", countsAsBuff: false, exclusiveGroup: "draconic_color", scenarioDetails: "Manual skin-color selection for Draconic Runes only. Exactly one color enables 0.05 output per perk on Rune packets." },
  draconic_color_air: { id: "draconic_color_air", name: "Draconic Color: Air", category: "Buff", countsAsBuff: false, exclusiveGroup: "draconic_color", scenarioDetails: "Manual skin-color selection for Draconic Runes only. Exactly one color enables 0.05 output per perk on Rune packets." },
  draconic_color_physical: { id: "draconic_color_physical", name: "Draconic Color: Physical", category: "Buff", countsAsBuff: false, exclusiveGroup: "draconic_color", scenarioDetails: "Manual skin-color selection for Draconic Runes only. Exactly one color enables 0.05 output per perk on Rune packets." },

  bulwark_qualifies: {"id": "bulwark_qualifies", "name": "Bulwark Qualifies", "category": "Buff", "countsAsBuff": false, "scenarioDetails": "Select only when incoming stun minus your stun resistance is at most 0.2 * Bulwark amount. Enables fixed 25% diminishing reduction; threshold detection is manual."},
  glyph_conduit: {"id": "glyph_conduit", "name": "Glyph Conduit", "category": "Buff", "countsAsBuff": true, "scenarioDetails": "Select the active sigil after an RMB or Rune. With the equipped perk, boosts pure Magic by 20% per perk. Duration is manual."},
  tongue_shot_ready: {"id": "tongue_shot_ready", "name": "Tongue Shot Ready", "category": "Buff", "countsAsBuff": false, "scenarioDetails": "Select after jumping with Bounce. Neutral state for Bounce Momentum; the lash preview assumes a qualifying finisher activation."},
  icestorm_active: {"id": "icestorm_active", "name": "Icestorm Active", "category": "Buff", "countsAsBuff": false, "scenarioDetails": "Select after building the required hits. Enables a single Icestorm orbit-hit preview. Classified as a scenario control until game status classification is established."},
  guiding_winds_charged: {"id": "guiding_winds_charged", "name": "Guiding Winds Charged", "category": "Buff", "countsAsBuff": false, "scenarioDetails": "Select at maximum Guiding Winds charge. Independent from Tailwind; lower charge and charge consumption are manual."},
  extinguish_proc: {"id": "extinguish_proc", "name": "Extinguish Proc", "category": "Buff", "countsAsBuff": false, "scenarioDetails": "Select for a qualifying direct Water hit. Consumes target Burn before Curse Rip on the cloned calculation and boosts Water on that first hit. Water added only by later conversions needs manual qualification."},
  magic_reinforce: {"id": "magic_reinforce", "name": "Magic Reinforce", "category": "Buff", "countsAsBuff": true, "scenarioDetails": "Self-buff preview with Grandmagic Guard: 50% diminishing reduction and 0.5 flat Magic-family reduction per perk. Flat reduction follows defense/reduction multipliers. Transfer potency and activation are manual."},
  converted_energy: {
    id: "converted_energy", name: "Converted Energy", category: "Buff", potencyId: "convertedenergypotency", baseDuration: 10,
    scenarioDetails: "Shared buff after Hex Shield activation. Grants 10% damage per 0.1 effective potency. Application and expiration are manual.",
    onDmgBonusMultiplier(potency) { return potency ? potency / 10 : null; },
  },
  friendship: {
    id: "friendship", name: "Friendship", category: "Buff", potencyId: "friendshippotency", baseDuration: 9,
    cooldownRatePerPoint: { WeaponArt: 0.5 },
    scenarioDetails: "Adds 50% diminishing-return Weapon Art CDR per 0.1 effective potency. Applicant bonuses and final overrides are honored. Manually remove after the next cast.",
  },
  cinder_surge: {
    id: "cinder_surge", name: "Cinder Surge", category: "Buff", potencyId: "cindersurgepotency", baseDuration: 3,
    scenarioDetails: "Adds its effective game potency as Fire output. Re-select Rejuvenating Flame's source after applicant Burn changes to represent aura reapplication.",
    onOutputCalculation(potency) { if (potency) this.damageTypes.Fire = (this.damageTypes.Fire || 0) + potency / 10; },
  },
  cloudpush: {
    id: "cloudpush", name: "Cloudpush", category: "Buff", potencyId: "cloudpushpotency",
    scenarioDetails: "Adds 7.5% Air output per 0.1 effective potency. Can stack with Cinderpull. Original-applicant kill credit and duration are not simulated.",
    onOutputCalculation(potency) { if (potency) this.damageTypes.Air = (this.damageTypes.Air || 0) + 0.075 * potency; },
  },
  cinderpull: {
    id: "cinderpull", name: "Cinderpull", category: "Buff", potencyId: "cinderpullpotency",
    scenarioDetails: "Adds 7.5% Fire output per 0.1 effective potency. Can stack with Cloudpush. Original-applicant kill credit and duration are not simulated.",
    onOutputCalculation(potency) { if (potency) this.damageTypes.Fire = (this.damageTypes.Fire || 0) + 0.075 * potency; },
  },
  redirect: {
    id: "redirect", name: "Redirect", category: "Buff", potencyId: "redirectpotency", baseDuration: 4,
    scenarioDetails: "Reduces recipient incoming damage by its effective game potency, capped at 100%. Explosive Charge self-damage is excluded. Redirected damage to the applicant is not calculated.",
    onFinalDamageTakenMultiplier(potency, args) { return this.isSelfDamage && args?.baseDamageData?.source === "explosive_charge" ? 1 : Math.max(0, 1 - (potency || 0) / 10); },
  },

  scenario_blocking: {"id": "scenario_blocking", "name": "Blocking", "category": "Buff", "countsAsBuff": false, "scenarioDetails": "Select while blocking a qualifying incoming attack. Enables Reinforced Block; guard breaks and chip eligibility remain manual."},
  stoneskin_active: {"id": "stoneskin_active", "name": "Stoneskin Active", "category": "Buff", "countsAsBuff": false, "scenarioDetails": "Select during a Weapon Art cast or its Stoneskin aftermath. Not a game buff; expiration is manual."},
  sharpshooter_range: {"id": "sharpshooter_range", "name": "Sharpshooter Range", "category": "Buff", "countsAsBuff": false, "scenarioDetails": "Select when the opponent is far enough away for Sharpshooter. The board provides an image, not a numeric range."},
  stealth_advantage: {"id": "stealth_advantage", "name": "Stealth Advantage", "category": "Buff", "countsAsBuff": false, "scenarioDetails": "Select for NPCs/target dummies or an opponent not targeting you. Enables Stealth damage; aggro is manual."},
  maximum_voxos: {"id": "maximum_voxos", "name": "Maximum Voxos", "category": "Buff", "countsAsBuff": false, "scenarioDetails": "Select only at the currency cap. Intermediate Money Smart scaling is not calculated."},
  inventory_bonus_capped: {"id": "inventory_bonus_capped", "name": "Inventory Bonus Capped", "category": "Buff", "countsAsBuff": false, "scenarioDetails": "Select at 250/300 inventory or above. Intermediate Packaged Power scaling is not calculated."},
  active_summons: {"id": "active_summons", "name": "Active Summons", "category": "Buff", "countsAsBuff": false, "scenarioDetails": "Select while summons are available for Pain Distribution. Summon HP and shared damage are not simulated."},
  hammer_slam: {"id": "hammer_slam", "name": "Hammer Slam", "category": "Buff", "countsAsBuff": false, "scenarioDetails": "Select for a qualifying ground-slam finisher. Aggressive Personality only boosts packets tagged Finisher; unclassified M1 finishers remain unsupported."},
  high_knockback: {"id": "high_knockback", "name": "High Knockback", "category": "Buff", "countsAsBuff": false, "scenarioDetails": "Select for an attack that qualifies as high knockback. Enables Carrying Winds damage; its tentative crit formula is not applied."},
  luminescent_fervor: {
    id: "luminescent_fervor", name: "Luminescent Fervor", category: "Buff", potencyId: "fervorpotency", baseDuration: 25,
    scenarioDetails: "Adds half its effective game potency as Holy output to direct packets only. Set Applied By to select the applicant; original-caster credit is not calculated.",
    onOutputCalculation(potency, args) {
      if (!potency || !args?.baseDamageData || args.baseDamageData.sourceType === "Status" || args.baseDamageData.tags?.includes("DoT")) return;
      this.damageTypes.Holy = (this.damageTypes.Holy || 0) + 0.05 * potency;
    },
  },
  queen_s_power: {
    id: "queen_s_power", name: "Queen's Power", category: "Buff", potencyId: "queenspowerpotency", baseDuration: 15,
    scenarioDetails: "Adds 20 + 100 * effective game potency Attack Speed points and 2 * potency Summon scaling to weapon M1/M2. Also works as a received buff without owning the perk. Summoning and expiration are manual.",
    onStatCalculation(potency) { this.stats.AttackSpeed = Math.round(((this.stats.AttackSpeed || 0) + 20 + 10 * (potency || 0)) * 10000) / 10000; },
    onOutputCalculation(potency, args) {
      const packet = args?.baseDamageData;
      if (!potency || packet?.sourceType !== "Weapon" || !(packet.tags?.includes("M1") || packet.tags?.includes("M2"))) return;
      this.damageScalings.Summon = (this.damageScalings.Summon || 0) + 0.2 * potency;
    },
  },
  channeled_depths: {
    id: "channeled_depths", name: "Channeled Depths", category: "Buff", countsAsBuff: false, potencyId: "channeleddepthspotency",
    scenarioDetails: "Set current accumulated potency. Adds 5 * effective game potency Water output on a positive direct hit; manually remove after use. Buildup, cap progression, and actual game-buff classification remain unverified.",
    onOutputCalculation(potency, args) {
      const packet = args?.baseDamageData;
      if (!potency || !packet || packet.damage <= 0 || packet.sourceType === "Status" || packet.tags?.includes("DoT")) return;
      this.damageTypes.Water = (this.damageTypes.Water || 0) + 0.5 * potency;
    },
  },
  cleansed_blade: {
    id: "cleansed_blade", name: "Cleansed Blade", category: "Buff", potencyId: "cleansedbladepotency", baseDuration: 15,
    scenarioDetails: "Separate damage multiplier from the holder's Water Boost: 1 + 1.5 * effective game potency * Water Boost / 100. Transfer scaling ownership is unverified. Healing and Cleanse activation are manual.",
    onDmgBonusMultiplier(potency) { return potency ? 0.15 * potency * (this.stats.WaterBoost || 0) / 100 : null; },
  },
  air_pressure: {
    id: "air_pressure", name: "Air Pressure", category: "Buff", potencyId: "airpressurepotency", baseDuration: 15,
    scenarioDetails: "Enter accumulated potency, starting at zero. Air Pressure caps its defense/release preview at 10 * equipped perk amount. Release counts as Rune damage. Buildup and consumption are manual.",
  },

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
    potencyId: "draconicinfusionpotency",
    baseDuration: 20,
    scenarioDetails: "Adds selected applicant color output from effective potency: 0.075 Physical / 0.1 elemental per 0.1 potency. Source is Draconic Blood. Color uses the applicant's current selected Draconic Color; reselect when representing a new application.",
    onOutputCalculation(potency) {
      if (!potency) return;
      const status = this.buff.find(status => status.id === "draconic_infusion"), applicant = status?.getSourceBuild(this);
      if (!applicant) return;
      const colors = ["Fire", "Water", "Holy", "Hex", "Earth", "Air", "Physical"] as const;
      const chosen = colors.filter(color => applicant.buff?.some(status => status.id === "draconic_color_" + color.toLowerCase()));
      if (applicant.race?.id === "dragon_blooded" && chosen.length !== 1) return;
      const color = applicant.race?.id === "dragon_blooded" ? chosen[0] : "Physical";
      this.damageTypes[color] = (this.damageTypes[color] || 0) + potency * (color === "Physical" ? .075 : .1);
    },
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
