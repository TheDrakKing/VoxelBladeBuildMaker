import * as Build from "./Build.js";
import { Helmets } from "../data/Helmets.js";
import { Chestplate } from "../data/Chestplates.js";
import { Leggings } from "../data/Leggings.js";
import { Blades } from "../data/Blades.js";
import { Handles } from "../data/Handles.js";
import { Rings } from "../data/Rings.js";
import { Runes } from "../data/Runes.js";
import { Enchantments } from "../data/Enchantments.js";

export type ItemDataTable = { [id: string]: Item };

const enchantmentsTable: ItemDataTable = Enchantments;

export interface eventsArgs {
  outputType?: string
  stat?: any
  baseDamageData?: baseDamageData
  item?: Item
}

export class events {
  onAdded?: (this: Build.Build, perkAmount?: number, restArgs?: eventsArgs) => number | null | void;
  onRemove?: (this: Build.Build, perkAmount?: number, restArgs?: eventsArgs) => number | null | void; 
  onStatCalculation?: (this: Build.Build, perkAmount?: number, restArgs?: eventsArgs) => void;
  onArmorPenCalculation?:(this: Build.Build, perkAmount?: number) => number | null;
  onArmorStatModified?: (this: Build.Build, perkAmount?: number, restArgs?: eventsArgs) => void;
  onStatModified?: (this: Build.Build, perkAmount?: number) => number | null;
  onArmorModified?: (this: Build.Build, perkAmount?: number) => number | null;
  onDmgBonusMultiplier?: (this: Build.Build, perkAmount?: number, restArgs?: eventsArgs) => number | null;
  onDmgReducedMultiplier?: (this: Build.Build, perkAmount?: number, restArgs?: eventsArgs) => number | null;
  onSpecificDmgBonusMultiplier?: (this: Build.Build, perkAmount?: number, restArgs?: eventsArgs) => number | null;
  onSpecificDmgReducedMultiplier?: (this: Build.Build, perkAmount?: number, restArgs?: eventsArgs) => number | null;
  /**
   * Function acts has the invser of onSpecificDmgReducedMultiplier, it added to the attacker damage
   */
  onIncreaseSpecificDmgTaken?: (this: Build.Build, perkAmount?: number, restArgs?: eventsArgs) => number | null;
  /**
   * Function acts has the invser of onDmgReducedMultiplier, it added to the attacker damage
   */
  onIncreaseDmgTaken?: (this: Build.Build, perkAmount?: number, restArgs?: eventsArgs) => number | null;
  /**
   * Function acts has the invser of onSpecificDmgBonusMultiplier, it reduces to the attacker damage
   */
  onDecreaseSpecificDmgBonusMultiplier?:(this: Build.Build, perkAmount?: number, restArgs?: eventsArgs) => number | null;
  /**
   * Function acts has the invser of onDmgBonusMultiplier, it reduces to the attacker damage
   */
  onDecreaseDmgBonusMultiplier?: (this: Build.Build, perkAmount?: number, restArgs?: eventsArgs) => number | null;
  onBuffAdded?: (this: Build.Build, perkAmount?: number) => number | null;
  onDeBuffAdded?: (this: Build.Build, perkAmount?: number) => number | null;
  onBuffRemoved?: (this: Build.Build, perkAmount?: number) => number | null;
  onDeBuffRemoved?: (this: Build.Build, perkAmount?: number) => number | null;
  onOutputCalculation?: (this: Build.Build, perkAmount?: number) => number | null;
}

// export class perkEvents {
//   onStatCalculation?: (this: Build.Build, perkAmount: number) => number | false | null;
//   onDmgBonusMultiplier?: (this: Build.Build, perkAmount: number) => number | null;
//   onDmgReducedMultiplier?: (this: Build.Build, perkAmount: number) => number | null;
//   onSpecificDmgBonusMultiplier?: (this: Build.Build, perkAmount: number, outputType?:string) => number | null;
//   onSpecificDmgReducedMultiplier?: (this: Build.Build, perkAmount: number, outputType?:string) => number | null;
// }


export type potency =
  | "bouncepotency"
  | "bleedpotency"
  | "burnboost"
  | "poisonpotency"
  | "ragepotency"
  | "reinforcepotency"
  | "guaranteedcritpotency"
  | "regenpotency"
  | "shatterpotency"
  | "lightningcloakpotency"
  | "weakeningpotency";

export const potencyAliases: { [k in potency]: string } = {
  bouncepotency: "Bounce Potency",
  bleedpotency: "Bleed Potency",
  burnboost: " Burn Potency",
  ragepotency: "Rage Potency",
  poisonpotency: "Poison Potency",
  reinforcepotency: "Reinforce Potency",
  guaranteedcritpotency: "Guaranteed Crit Potency",
  regenpotency: "Regen Potency",
  shatterpotency: "Shatter Potency",
  lightningcloakpotency: "Lightning Cloak Potency",
  weakeningpotency: "Weakening Potency",
};

export type stat =
  | "MagicDefense"
  | "MagicBoost"
  | "PhysicalDefense"
  | "PhysicalBoost"
  | "EarthDefense"
  | "EarthBoost"
  | "FireDefense"
  | "FireBoost"
  | "WaterDefense"
  | "WaterBoost"
  | "HolyDefense"
  | "HolyBoost"
  | "HexDefense"
  | "HexBoost"
  | "AirDefense"
  | "AirBoost"
  | "JumpBoost"
  | "DexterityBoost"
  | "SpeedBoost"
  | "SummonBoost"
  | "AttackSpeed"
  | "HeatResistance"
  | "ColdResistance"
  | "Protection"
  | "Warding"
  | "Tenacity"
  | "ArmorPenetration";

export type scale =
  | "Magic"
  | "Physical"
  | "Earth"
  | "Fire"
  | "Water"
  | "Holy"
  | "Hex"
  | "Air"
  | "Dexterity"
  | "True";

export type damageType = scale;

export class Item extends events {
  id: string;
  name: string;
  category?: string;
  description?: string;
  type?: string;
  upgrade?:number;
  img?: string;
  /**
   * For addtive potecny that get applied to the over build, and can be added to soruce potency
   */
  potencies?: { [k in potency]?: number };
  /**
   * source potencies don't get added to the build, they are for exmaple rage run which has base 0.3 potency when actvited
   */
  sourcepotencies?: { [k in potency]?: number };
  stats?: { [k in stat]?: number };
  perks?: { [id: string]: number };
  /**
   * if an item has a damageScalings it more than likely not to be added to the over all build,
   * item with damageScalings or damageScalings or most likely runes, who a damageScalings and damageTypes
   * so more than offent this is undefinded unless is a rune that has this
   */
  damageScalings?: { [k in scale]?: number };
  /**
   * if an item has a damageTypes it more than likely not to be added to the over all build,
   * item with damageScalings or damageScalings or most likely runes, who a damageScalings and damageTypes
   * so more than offent this is undefinded unless is a rune that has this
   */
  damageTypes?: { [k in damageType]?: number };
  /**
   * Base damage is for items like runes who can do attacking damage
   * exmaple Fire ball rune
   */
  baseDamage?: number;

  constructor(data?: any) {
    super()
    Object.assign(this, data)
    this.id = data?.id || undefined;
    this.name = data?.name || "";
    this.category = data?.category || "";
    this.upgrade = data?.upgrade || 0;
    this.img = data ? data.img : undefined;
    this.type = data && data?.type || undefined;
    this.description = data?.description || "";
    this.potencies = data?.potencies || {};
    this.sourcepotencies = data?.sourcepotencies;
    this.stats =  data?.stats || {};
    this.perks =  data?.perks || {};
    this.damageScalings = data?.damageScalings || {};
    this.damageTypes = data?.damageTypes || {};
    this.baseDamage = data?.baseDamage || {}
    
  }
}

export function toID(name: string) {
  return name.toLowerCase().replace(" ", "_");
}

export class ItemStore {
  private static readonly itemCache = new Map<string, Item>();
  private static readonly categoryCache = new Map<string, Item[]>();
  private static readonly categoryMap = new Map<string, ItemDataTable>([
    ['helmet', Helmets],
    ['chestplate', Chestplate],
    ['legging', Leggings],
    ['blade', Blades],
    ['handle', Handles],
    ['ring', Rings],
    ['rune', Runes],
    ['enchantment', Enchantments]
  ]);

  static allCache: readonly Item[] | null = null;
  static itemNames: readonly string[] = [];

  static enchantmentNames: readonly string[] = [];

  constructor() {}

  static get(name?: string | Item): Item {
    if (name && typeof name !== "string") return name;

    name = (name || "").trim();
    const id = toID(name);
    return this.getByID(id);
  }

  static getByID(id: string): Item {
     // Check cache first
    if (this.itemCache.has(id)) {
      return Object.assign(new Item(), this.itemCache.get(id));
    }

    // Find item in category tables
    for (const [category, table] of this.categoryMap) {
      if (id in table) {
        const item = Object.freeze(new Item({ ...table[id], category }));
        this.itemCache.set(id, item);
        return Object.assign(new Item(), item);
      }
    }

    return new Item({ id });
  }

  static getByCategory(category: string): Item[] {
    // Check if category is already cached
    if (this.categoryCache.has(category)) {
      return this.categoryCache.get(category)!;
    }

    const table = this.categoryMap.get(category.toLowerCase());
    if (!table) return [];

    const items = Object.keys(table).map(id => this.getByID(id));
    this.categoryCache.set(category, items);
    return items;
  }

  static getEnchantmentNames(): readonly string[] {
    if (this.enchantmentNames.length) return this.enchantmentNames;
    const names = [];
    for (const id in enchantmentsTable) {
      names.push(this.getByID(id as string).name);
    }
    this.enchantmentNames = Object.freeze(names);
    return this.enchantmentNames;
  }

  // static all(): readonly Item[] {
  //   if (this.allCache) return this.allCache;
  //   const items = [];
  //   const names = [];
  //   for (const id in armorTable) {
  //     items.push(this.getByID(id as string));
  //     names.push(this.getByID(id as string).name);
  //   }
  //   this.allCache = Object.freeze(items);
  //   this.itemNames = Object.freeze(names);
  //   return this.allCache;
  // }
}