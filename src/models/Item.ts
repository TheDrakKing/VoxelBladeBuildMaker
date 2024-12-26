import * as Build from "./Build";
import { Helmets } from "../data/Helmets.js";
import { Chestplate } from "../data/Chestplates.js";
import { Leggings } from "../data/Leggings.js";
import { Blades } from "../data/Blades.js";
import { Handles } from "../data/Handles.js";
import { Rings } from "../data/Rings.js";
import { Runes } from "../data/Runes.js";
import { Enchantments } from "../data/Enchantments.js";


export type ItemDataTable = { [id: string]: Item };

const chestplateTable: ItemDataTable = Chestplate;
const helmetTable: ItemDataTable = Helmets;
const leggingTable: ItemDataTable = Leggings;
const bladeTable: ItemDataTable = Blades;
const handleTable: ItemDataTable = Handles;
const ringTable: ItemDataTable = Rings;
const runeTable: ItemDataTable = Runes;
const enchantmentsTable: ItemDataTable = Enchantments;

export class events {
  onAdded?: (this: Build.Build, perkAmount: number, armor: Item) => void;
  onRemove?: (this: Build.Build, perkAmount: number, armor: Item) => void;
  onStatCalculation?: (this: Build.Build, perkAmount: number, armor: Item) => void;
  onStatModified?: (this: Build.Build, perkAmount: number) => number | false | null;
  onArmorModified?: (this: Build.Build, perkAmount: number) => number | false | null;
  onBuffAdded?: (this: Build.Build, perkAmount: number) => number | false | null;
  onDeBuffAdded?: (this: Build.Build, perkAmount: number) => number | false | null;
  onBuffRemoved?: (this: Build.Build, perkAmount: number) => number | false | null;
  onDeBuffRemoved?: (this: Build.Build, perkAmount: number) => number | false | null;
}


export type potency =
  | "bouncepotency"
  | "bleedpotency"
  | "burnboost";

export const potencyAliases: { [id: string]: string } = {
  bouncepotency: "Bounce Potency",
  bleedpotency: "Bounce Potency",
  burnboost: "Bounce Potency",
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

export class Item {
  id: string;
  name: string;
  category?: string;
  description?: string;
  type?: string;
  upgrade?:number;
  img?: string;
  potencies?: { [k in potency]?: number };
  stats?: { [k in stat]?: number };
  perks?: { [id: string]: number };
  damageScalings?: { [k in scale]?: number };
  damageTypes?: { [k in damageType]?: number };

  onAdded?: (this: Build.Build, perkAmount: number, armor: Item) => void;
  onRemove?: (this: Build.Build, perkAmount: number, armor: Item) => void;
  onStatCalculation?: (this: Build.Build, perkAmount?: number, stat?: Build.stats) => void;
  onArmorStatModified?: (this: Build.Build, perkAmount?: number, stat?: Build.stats) => void;
  onStatModified?: (this: Build.Build, perkAmount: number) => number | false | null;
  onArmorModified?: (this: Build.Build, perkAmount: number) => number | false | null;
  onBuffAdded?: (this: Build.Build, perkAmount: number) => number | false | null;
  onDeBuffAdded?: (this: Build.Build, perkAmount: number) => number | false | null;
  onBuffRemoved?: (this: Build.Build, perkAmount: number) => number | false | null;
  onDeBuffRemoved?: (this: Build.Build, perkAmount: number) => number | false | null;

  constructor(data?: any) {
    Object.assign(this, data)
    this.id = data?.id || undefined;
    this.name = data?.name || "";
    this.category = data?.category || "";
    this.upgrade = data?.upgrade || 0;
    this.img = data ? data.img : undefined;
    this.type = data && data?.type || undefined;
    this.description = data?.description || "";
    this.potencies = data?.potencies || {};
    this.stats =  data?.stats || {};
    this.perks =  data?.perks || {};
    this.damageScalings = data?.damageScalings || {};
    this.damageTypes = data?.damageTypes || {};
    
  }
}

export function toID(name: string) {
  return name.toLowerCase().replace(" ", "_");
}

export class ItemStore {
  static readonly helmetCache = new Map<string, Item>();
  static readonly chestplateCache = new Map<string, Item>();
  static readonly leggingCache = new Map<string, Item>();
  static readonly bladeCache = new Map<string, Item>();
  static readonly handleCache = new Map<string, Item>();
  static readonly ringCache = new Map<string, Item>();
  static readonly runeCache = new Map<string, Item>();
  static readonly enchantmentCache = new Map<string, Item>();

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

  static lookMap(id: string): Item | undefined {
    if (this.helmetCache.has(id)) {
      return this.helmetCache.get(id)!;
    } else if (this.chestplateCache.has(id)) {
      return this.chestplateCache.get(id)!;
    } else if (this.leggingCache.has(id)) {
      return this.leggingCache.get(id)!;
    } else if (this.bladeCache.has(id)) {
      return this.bladeCache.get(id)!;
    } else if (this.handleCache.has(id)) {
      return this.handleCache.get(id)!;
    } else if (this.runeCache.has(id)) {
      return this.runeCache.get(id)!;
    } else if (this.ringCache.has(id)) {
      return this.ringCache.get(id)!;
    } else if (this.enchantmentCache.has(id)) {
      return this.enchantmentCache.get(id)!;
    }
  }

  static getByID(id: string): Item {
    let item = this.lookMap(id);
    if (item) return Object.assign(new Item(), item) as Item;
    
    let Data;
    let cache: Map<string, Item> = new Map<string, Item>();
    if (id in helmetTable) {
      Data = helmetTable[id] as any;
      cache = this.helmetCache;
    } else if (id in chestplateTable) {
      Data = chestplateTable[id] as any;
      cache = this.chestplateCache;
    } else if (id in leggingTable) {
      Data = leggingTable[id] as any;
      cache = this.leggingCache;
    } else if (id in bladeTable) {
      Data = bladeTable[id] as any;
      cache = this.bladeCache;
    } else if (id in handleTable) {
      Data = handleTable[id] as any;
      cache = this.handleCache;
    } else if (id in runeTable) {
      Data = runeTable[id] as any;
      cache = this.runeCache;
    } else if (id in ringTable) {
      Data = ringTable[id] as any;
      cache = this.ringCache;
    } else if (id in enchantmentsTable) {
      Data = enchantmentsTable[id] as any;
      cache = this.enchantmentCache;
    }

    if (!Data) {
      return new Item({ id });
    }

    item = new Item({ ...Data });

    item = Object.freeze(item);
    cache.set(id, item);
    return Object.assign(new Item(), item) as Item;
  }

  static getAllHelmets(): Item[] {
    const items = [];
    for (const id in helmetTable) {
      items.push(this.getByID(id as string));
    }
    return items;
  }

  static getAllChestplates(): Item[] {
    const items = [];
    for (const id in chestplateTable) {
      items.push(this.getByID(id as string));
    }
    return items;
  }

  static getAllLeggings(): Item[] {
    const items = [];
    for (const id in leggingTable) {
      items.push(this.getByID(id as string));
    }
    return items;
  }

  static getAllBlades(): Item[] {
    const items = [];
    for (const id in bladeTable) {
      items.push(this.getByID(id as string));
    }
    return items;
  }

  static getAllHandle(): Item[] {
    const items = [];
    for (const id in handleTable) {
      items.push(this.getByID(id as string));
    }
    return items;
  }

  static getAllRune(): Item[] {
    const items = [];
    for (const id in runeTable) {
      items.push(this.getByID(id as string));
    }
    return items;
  }

  static getAllRing(): Item[] {
    const items = [];
    for (const id in ringTable) {
      items.push(this.getByID(id as string));
    }
    return items;
  }

  static getAllEnchant(): Item[] {
    const items = [];
    for (const id in enchantmentsTable) {
      items.push(this.getByID(id as string));
    }
    return items;
  }

  static getByCategory(category: string): Item[] {
    switch (category) {
      case "Blade":
        return this.getAllBlades();
      case "Handle":
        return this.getAllHandle();
      case "WeaponArt":
        return [];
      case "Helmet":
        return this.getAllHelmets();
      case "Chestplate":
        return this.getAllChestplates();
      case "Legging":
        return this.getAllLeggings();
      case "Rune":
        return this.getAllRune();
      case "Ring":
        return this.getAllRing();
      case "Enchantment":
        return this.getAllEnchant();
      default:
        return [];
    }
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