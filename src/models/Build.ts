import * as ItemModule from "../models/Item.js";

export type potencies = { [k in ItemModule.potency]?: number };
export type stats = { [k in ItemModule.stat]?: number };
export type effectiveBoosts = { [k in ItemModule.stat]?: number };
export type perks = { [id: string]: number };
export type buffs = string[];
export type damageScalings = { [k in ItemModule.scale]?: number };
export type damageTypes = { [k in ItemModule.damageType]?: number };

export type outputDamage = { [k in ItemModule.damageType]?: number };

export type damageArray = outputDamage[];

let damageModifications = {
  damage_bonus_mods: {},
  damage_reduced_mods: {},
  output_mods: {},
  type_specific_mods: {},
  crit_mods: {},
  armor_mods: {},
  special_mods: {},
};

let damageMultiplier = {
  // damageMultiplier is the total of damage modification of a type
  damage_bonus_multiplier: {},
  damage_reduced_multiplier: {},
  output_multiplier: {},
  type_specific_multiplier: {},
  crit_multiplier: {},
  armor_multiplier: {},
  special_multiplier: {},
};

export type gear =
  | "blade"
  | "handle"
  | "weaponArt"
  | "helmet"
  | "chestplate"
  | "legging"
  | "rune"
  | "ring";

export type Armor = {
    helmet?: ItemModule.Item;
    chestplate?: ItemModule.Item;
    legging?: ItemModule.Item;
    rune?: ItemModule.Item;
    ring?: ItemModule.Item;
  };

export type Build = {
  blade?: ItemModule.Item;
  handle?: ItemModule.Item;
  weaponArt?: ItemModule.Item;

  mainArmor: {
    helmet?: ItemModule.Item;
    chestplate?: ItemModule.Item;
    legging?: ItemModule.Item;
    rune?: ItemModule.Item;
    ring?: ItemModule.Item;
  };
  infuseArmor: {
    helmet?: ItemModule.Item;
    chestplate?: ItemModule.Item;
    legging?: ItemModule.Item;
    rune?: ItemModule.Item;
    ring?: ItemModule.Item;
  };
  enchantments: {
    helmet?: [ItemModule.Item?, ItemModule.Item?, ItemModule.Item?];
    chestplate?: [ItemModule.Item?, ItemModule.Item?, ItemModule.Item?];
    legging?: [ItemModule.Item?, ItemModule.Item?, ItemModule.Item?];
    rune?: [ItemModule.Item?, ItemModule.Item?, ItemModule.Item?];
    ring?: [ItemModule.Item?, ItemModule.Item?, ItemModule.Item?];
  };

  buff?: buffs;
  deBuffs?:buffs;
  constructionType?: string;
  level: number;
  potencies: potencies;
  stats: stats;
  effectiveBoosts: effectiveBoosts;
  perks: perks;
  damageScalings: damageScalings;
  damageTypes: damageTypes;

  totEffBoost: number;

  m1: damageArray;
  m2: damageArray;
};
