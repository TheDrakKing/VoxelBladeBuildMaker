function hasDebuff(build: any, debuffId: string) {
  return !!build?.deBuffs?.find((debuff: any) => debuff?.id === debuffId);
}

function getDebuffCount(build: any) {
  return build?.deBuffs?.length || 0;
}

function addStat(build: any, statId: string, amount: number) {
  if (!amount) return;
  const previousValue = build.stats[statId] || 0;
  build.stats[statId] = Math.trunc((previousValue + amount) * 100) / 100;
}

function getNegativeStatValue(value?: number) {
  if (!value || value >= 0) return 0;
  return Math.abs(value);
}

function isRuneOrWeaponArtHit(args?: any) {
  const sourceType = args?.baseDamageData?.sourceType;
  return sourceType === "Rune" || sourceType === "WeaponArt";
}

export const Perks: import("../models/Perk").perkDataTable = {
  /** Race Perks Here */
  human: {
    id: "human",
    name: "Human",
    category: "Race",
    description: "Gain 20% damage reduction and damage boost when below 50% HP..",
    onDmgBonusMultiplier(perkAmount) {
      if (!perkAmount) return null;
      //check if hp is below 50% in the function where this is called and only then call this function
      if (this.hp > 50) return null;
      let baseMultiplier = 20;
      let multiplier = (baseMultiplier) / 100;
      return Math.trunc(multiplier * 100) / 100;
    },
  },
  half_ork: {
    id: "half_ork",
    name: "Half-Ork",
    category: "",
    description: "Gain 10 armor penetration on all attacks.",
  },
  elf: {
    id: "elf",
    name: "Elf",
    category: "",
    description: "Gain 25% lower Weapon Art cooldown.",
  },
  dark_elf: {
    id: "dark_elf",
    name: "Dark Elf",
    category: "",
    description: "An 8% chance to apply a random debuff to the opponent when hitting them.",
  },
  dragon: {
    id: "dragon",
    name: "Dragon",
    category: "",
    description: "Gain 50% Warding and 10 Protection alongside 100% Heat and Cold Resistance.",
  },
  ork: {
    id: "ork",
    name: "Ork",
    category: "",
    description: "Weapon arts gain 10 armor penetration. +0.2 Tenacity and for each active buff you gain an additional +0.1 tenacity.",
  },
  high_elf: {
    id: "high_elf",
    name: "High Elf",
    category: "",
    description: "Gain 25% lower Weapon Art cooldown.",
  },
  arborian: {
    id: "arborian",
    name: "Arborian",
    category: "",
    description: "The Arborians are druidic in nature. They are trees made of tough bark and use their power to protect all life.",
  },
  kitsune: {
    id: "kitsune",
    name: "Kitsune",
    category: "",
    description: "The Kitsune are a nomadic race travelling alone or in packs rarely staying in one place to long. They posess incredible speed and reflex and are not often caught by surprise",
  },
  bunikin: {
    id: "bunikin",
    name: "Bunikin",
    category: "",
    description: "The mysterious bunikin are being of mystical whimsy and are rarely seen anywhere in the world.",
  },
  /** Guild only Perks here */

  /** Other Perks */
  ferocious: {
    id: "ferocious",
    name: "Ferocious",
    category: "",
    description: "Tenacity increases damage dealt.",
    onDmgBonusMultiplier(perkAmount) {
      if (!perkAmount) return null;
      let t = this.stats.Tenacity;
      if (!t) return null;
      let floorT = Math.floor(t);
      let summation = function () {
        let sum = 0;
        for (let k = 1; k <= t; k++) {
          sum += 1 / k;
        }
        return sum;
      };
      let diminishedTenacity = summation() + (t - Math.floor(t)) / Math.ceil(t);
      let FerocityDmgBoost = diminishedTenacity * 1.55 * (perkAmount / 10);
      return Math.trunc(FerocityDmgBoost * 100) / 100;
    },
  },

  potion_chugger: {
    id: "potion_chugger",
    name: "Potion Chugger",
    category: "",
    description: "Tenacity increases damage dealt.",
  },

  rider: {
    id: "rider",
    name: "Rider",
    category: "",
    description: "Tenacity increases damage dealt.",
  },

  berserkingstrength: {
    id: "berserkingstrength",
    name: "BerserkingStrength",
    category: "",
    description: "Tenacity increases damage dealt.",
  },

  blood_thirsty: {
    id: "blood_thirsty",
    name: "Blood Thirsty",
    category: "Perk",
    description:
      "If you hit a bleeding opponent bleeding by you remove the bleed, deal bonus damage, and heal. Grants bleed potency.",
    onDmgBonusMultiplier(perkAmount) {
      if (!perkAmount || !hasDebuff(this.target, "bleed")) return null;
      return Math.trunc((0.2 * perkAmount) * 100) / 100;
    },
  },

  shielding_gong: {
    id: "shielding_gong",
    name: "Shielding Gong",
    category: "",
    description: "Tenacity increases damage dealt.",
  },

  barbskin: {
    id: "barbskin",
    name: "Barbskin",
    category: "",
    description: "Tenacity increases damage dealt.",
  },

  pulverizing_rush: {
    id: "pulverizing_rush",
    name: "Pulverizing Rush",
    category: "",
    description: "Using a finisher that hits a target while allies are nearby create a burst that grants reinforce to nearby allies. Additionally having reinforce grants knockback resistance.",
  },

  fury: {
    id: "fury",
    name: "Fury",
    category: "",
    description: "Tenacity increases damage dealt.",
  },

  void_rage: {
    id: "void_rage",
    name: "Void Rage",
    category: "",
    description: "Tenacity increases damage dealt.",
  },

  echo_incineration: {
    id: "echo_incineration",
    name: "Echo Incineration",
    category: "",
    description: "Tenacity increases damage dealt.",
  },

  strong_tides: {
    id: "strong_tides",
    name: "Strong Tides",
    category: "Perk",
    description: "Increases your water boost based on your physical boost.",
    onStatCalculation(perkAmount) {
      if (!perkAmount) return;
      const physicalBoost = this.stats.PhysicalBoost || 0;
      if (!physicalBoost) return;
      addStat(this, "WaterBoost", (physicalBoost / 10) * perkAmount);
    },
  },

  reaper: {
    id: "reaper",
    name: "Reaper",
    category: "Perk",
    description: "Deal more damage to enemies with debuffs.",
    onDmgBonusMultiplier(perkAmount) {
      if (!perkAmount) return null;
      const targetDebuff = getDebuffCount(this.target);
      if (!targetDebuff) return null;
      const multiplier = (5 * targetDebuff * perkAmount) / 100;
      return Math.trunc(multiplier * 100) / 100;
    },
  },

  scourge: {
    id: "scourge",
    name: "Scourge",
    category: "",
    description:
      "True damage can be affected by rage. Also all hits have a chance to count as a guard break and deal bonus damage.",
    onDmgBonusMultiplier(perkAmount) {
      if (!perkAmount) return null;
      let baseMultiplier = 20;
      let multiplier = (baseMultiplier * perkAmount) / 100;
      return Math.trunc(multiplier * 100) / 100;
    },
  },

  highlander: {
    id: "highlander",
    name: "Highlander",
    category: "Perk",
    description: "Your weapon arts and runes ignore some of the opponent's armor and deal bonus damage.",
    onDmgBonusMultiplier(perkAmount, args) {
      if (!perkAmount || !isRuneOrWeaponArtHit(args)) return null;
      return Math.trunc((0.2 * perkAmount) * 100) / 100;
    },
    onArmorPenCalculation(perkAmount, args) {
      if (!perkAmount || !isRuneOrWeaponArtHit(args)) return null;
      return 10 * perkAmount;
    },
  },

  hemorrhage: {
    id: "hemorrhage",
    name: "Hemorrhage",
    category: "Perk",
    description:
      "Hitting a bleeding opponent adds bonus damage, bonus true damage and increases stun. Grants bleed potency.",
    onDmgBonusMultiplier(perkAmount) {
      if (!perkAmount || !hasDebuff(this.target, "bleed")) return null;
      const multiplier = (10 + 10 * perkAmount) / 100;
      return Math.trunc(multiplier * 100) / 100;
    },
    onOutputCalculation(perkAmount) {
      if (!perkAmount || !hasDebuff(this.target, "bleed")) return null;
      const outputMultiplier = 0.1 * perkAmount;
      let previousValue = this.damageTypes["True"];
      this.damageTypes["True"] = previousValue
        ? previousValue + outputMultiplier
        : outputMultiplier;
      return null;
    },
  },

  melting_slime: {
    id: "melting_slime",
    name: "Melting Slime",
    category: "Perk",
    description: "Take 20% more fire damage.",
    onIncreaseSpecificDmgTaken(perkAmount, args) {
      if (!perkAmount || !args?.outputType) return null;
      if (args.outputType !== "Fire") return null;
      return 0.2 * perkAmount;
    },
  },

  vicious_edge: {
    id: "vicious_edge",
    name: "Vicious Edge",
    category: "",
    description: "Tenacity increases damage dealt.",
  },

  cut_down: {
    id: "cut_down",
    name: "Cut Down",
    category: "Perk",
    description: "Deal bonus damage based on how much HP the opponent has left.",
    onDmgBonusMultiplier(perkAmount) {
      if (!perkAmount || !this.target?.maxHp) return null;
      const hpRatio = Math.max(0, Math.min(1, this.target.hp / this.target.maxHp));
      return Math.trunc((0.3 * hpRatio * perkAmount) * 10000) / 10000;
    },
  },

  extra_layers: {
    id: "extra_layers",
    name: "Extra Layers",
    category: "Perk",
    description: "Gain more warding and protection.",
    onStatCalculation(perkAmount) {
      if (!perkAmount) return;
      const multiplier = 1 + 0.2 * perkAmount;
      this.stats.Warding = Math.trunc(((this.stats.Warding || 0) * multiplier) * 100) / 100;
      this.stats.Protection = Math.trunc(((this.stats.Protection || 0) * multiplier) * 100) / 100;
    },
  },

  spellshield: {
    id: "spellshield",
    name: "Spellshield",
    category: "Perk",
    description: "Increases protection based on your magic boost and magic defense.",
    onStatCalculation(perkAmount) {
      if (!perkAmount) return;
      const magicBoost = this.stats.MagicBoost || 0;
      const magicDefense = this.stats.MagicDefense || 0;
      const protection = (magicBoost + magicDefense) / 10 * perkAmount;
      addStat(this, "Protection", protection);
    },
  },

  spark: {
    id: "spark",
    name: "Spark",
    category: "Perk",
    description: "Crit damage gains a large bonus if the opponent is on fire.",
    onCritDamageCalculation(perkAmount) {
      if (!perkAmount || !hasDebuff(this.target, "burn")) return null;
      return Math.trunc((0.5 * perkAmount) * 100) / 100;
    },
  },

  vital_strikes: {
    id: "vital_strikes",
    name: "Vital Strikes",
    category: "Perk",
    description: "Increase crit damage.",
    onCritDamageCalculation(perkAmount) {
      if (!perkAmount) return null;
      return Math.trunc((0.25 * perkAmount) * 100) / 100;
    },
  },

  dark_one: {
    id: "dark_one",
    name: "Dark One",
    category: "Perk",
    description: "Gain increased damage while afflicted with debuffs.",
    onDmgBonusMultiplier(perkAmount) {
      if (!perkAmount) return null;
      const selfDebuffs = getDebuffCount(this);
      if (!selfDebuffs) return null;
      return Math.trunc((0.0666 * selfDebuffs * perkAmount) * 10000) / 10000;
    },
  },

  brawny: {
    id: "brawny",
    name: "Brawny",
    category: "Perk",
    description: "Converts a portion of all positive boosts to physical boost.",
    onStatCalculation(perkAmount) {
      if (!perkAmount) return;
      const conversionMultiplier = Math.min(1, 0.2 * perkAmount);
      const offensiveStats = [
        "MagicBoost",
        "EarthBoost",
        "FireBoost",
        "WaterBoost",
        "HolyBoost",
        "HexBoost",
        "AirBoost",
        "DexterityBoost",
        "SummonBoost",
      ] as const;
      let convertedBoost = 0;

      for (const statId of offensiveStats) {
        const statValue = this.stats[statId] || 0;
        if (statValue <= 0) continue;
        convertedBoost += statValue * conversionMultiplier;
      }

      addStat(this, "PhysicalBoost", convertedBoost);
    },
  },

  voltaic_body: {
    id: "voltaic_body",
    name: "Voltaic Body",
    category: "",
    description: "Using your weapon art gives you a static charge that causes your targets to be struck  by lightning when you hit them with your rune, but your rune has an increased cooldown..",
    damageTypes: {
      Air: 0.5,
      Magic: 0.5
    },
    damageScalings: {
      Air: 1,
      Magic: 1
    },
    getPerkDamageInfo(perkAmount) {
      if (!perkAmount) return null;
      // let voltaic_body = this.buff.find(
      //   (buff) => buff?.id === "voltaic_body"
      // );
      //if (!voltaic_body) return null;
      const baseDamage = (8 + 4*perkAmount) * (0.85^1)
      return {
        damage: baseDamage,
        hitAmount: 1,
        source: "voltaic_body",
        sourceDamageType: "Perk",
        sourceType: "Perk"
      }
    }
  },

  duelist_stance: {
    id: "duelist_stance",
    name: "Duelist Stance",
    category: "",
    description: "Tenacity increases damage dealt.",
  },

  bloodlust: {
    id: "bloodlust",
    name: "Bloodlust",
    category: "",
    description: "Tenacity increases damage dealt.",
  },

  beastial_rage: {
    id: "beastial_rage",
    name: "Beastial Rage",
    category: "",
    description: "Tenacity increases damage dealt.",
  },

  heat_drill: {
    id: "heat_drill",
    name: "Heat Drill",
    category: "",
    description: "Tenacity increases damage dealt.",
  },

  ignition: {
    id: "ignition",
    name: "Ignition",
    category: "",
    description: "Tenacity increases damage dealt.",
  },

  righted_wrongs: {
    id: "righted_wrongs",
    name: "Righted Wrongs",
    category: "Perk",
    description:
      "Gain bonus Dexterity and Speed Boost scaling off of all of your negative stats combined.",
    onStatCalculation(perkAmount) {
      if (!perkAmount) return;

      const stats = this.stats;
      const d =
        getNegativeStatValue(stats.EarthDefense) +
        getNegativeStatValue(stats.FireDefense) +
        getNegativeStatValue(stats.WaterDefense) +
        getNegativeStatValue(stats.HolyDefense) +
        getNegativeStatValue(stats.HexDefense) +
        getNegativeStatValue(stats.AirDefense) +
        getNegativeStatValue(stats.Warding);
      const p = getNegativeStatValue(stats.Protection);
      const t = getNegativeStatValue(stats.Tenacity);
      const o =
        getNegativeStatValue(stats.MagicBoost) +
        getNegativeStatValue(stats.PhysicalBoost) +
        getNegativeStatValue(stats.EarthBoost) +
        getNegativeStatValue(stats.FireBoost) +
        getNegativeStatValue(stats.WaterBoost) +
        getNegativeStatValue(stats.HolyBoost) +
        getNegativeStatValue(stats.HexBoost) +
        getNegativeStatValue(stats.AirBoost) +
        getNegativeStatValue(stats.JumpBoost) +
        getNegativeStatValue(stats.DexterityBoost) +
        getNegativeStatValue(stats.SpeedBoost) +
        getNegativeStatValue(stats.SummonBoost) +
        getNegativeStatValue(stats.AttackSpeed) +
        getNegativeStatValue(stats.CritRate) +
        getNegativeStatValue(stats.CritDamage) +
        getNegativeStatValue(stats.HeatResistance) +
        getNegativeStatValue(stats.ColdResistance) +
        getNegativeStatValue(stats.ArmorPenetration) +
        (stats.PhysicalDefense || 0) +
        (stats.MagicDefense || 0);

      const dexterityBoost = (2 * perkAmount / 21) * (d + ((2 * p / 10) + t) / 5 + (2 * o));
      const speedBoost = dexterityBoost / 10;

      addStat(this, "DexterityBoost", dexterityBoost);
      addStat(this, "SpeedBoost", speedBoost);
    },
  },

  immoveable: {
    id: "immoveable",
    name: "Immoveable",
    category: "Perk",
    description: "Your tenacity boost now affects your physical defense.",
    onStatCalculation(perkAmount) {
      if (!perkAmount) return;
      const tenacity = this.stats.Tenacity || 0;
      if (!tenacity) return;
      addStat(this, "PhysicalDefense", 30 * tenacity * perkAmount);
    },
  },
};
