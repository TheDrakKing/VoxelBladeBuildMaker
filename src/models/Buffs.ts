import * as ItemModule from "./Item.js";
import { Buffs } from "../data/Buffs.js";
import { Debuffs } from "../data/Debuffs.js";

export type BuffDataTable = { [id: string]: Buff };


const buffTable: BuffDataTable = Buffs;
const deBuffTable: BuffDataTable = Debuffs;

export class Buff extends ItemModule.events {
  id: string;
  name?: string;
  category: string;
  baseDuration: number;
  img?: string;

  constructor(data?: any) {
    super()
    Object.assign(this, data);
    this.id = data?.id || undefined;
    this.name = data?.name || "";
    this.category = data?.category || "";
    this.baseDuration = data?.baseDuration || "";
    this.img = data?.img || "";
  }
}

export class BuffStore {
  static readonly buffCache = new Map<string, Buff>();
  static readonly deBuffCache = new Map<string, Buff>();

  static allCache: readonly Buff[] | null = null;

  constructor() {}

  static get(name?: string | Buff): Buff {
    if (name && typeof name !== "string") return name;

    name = (name || "").trim();
    const id = ItemModule.toID(name);
    return this.getByID(id);
  }

  static lookMap(id: string): Buff | undefined {
    if (this.buffCache.has(id)) {
      return this.buffCache.get(id)!;
    } else if (this.deBuffCache.has(id)) {
      return this.deBuffCache.get(id)!;
    }
  }

  static getByID(id: string): Buff {
    let item = this.lookMap(id);
    if (item) return Object.assign(new Buff(), item) as Buff;

    let Data;
    let cache: Map<string, Buff> = new Map<string, Buff>();

    if (id in buffTable) {
      Data = buffTable[id] as any;
      cache = this.buffCache;
    } else if (id in deBuffTable) {
      Data = deBuffTable[id] as any;
      cache = this.deBuffCache;
    }

    if (!Data) {
      return new Buff({ id });
    }

    item = new Buff({ ...Data });

    item = Object.freeze(item);
    cache.set(id, item);
    return Object.assign(new Buff(), item) as Buff;
  }

  static getAllBuff(): Buff[] {
    const buffs = [];
    for (const id in buffTable) {
      buffs.push(this.getByID(id as string));
    }
    return buffs;
  }

  static getAllDeBuff(): Buff[] {
    const deBuffs = [];
    for (const id in deBuffTable) {
      deBuffs.push(this.getByID(id as string));
    }
    return deBuffs;
  }

  static getByCategory(category: string): Buff[] {
    switch (category) {
      case "Buff":
        return this.getAllBuff();
      case "Debuff":
        return this.getAllDeBuff();
      default:
        return [];
    }
  }

  static all(): readonly Buff[] {
    if (this.allCache) return this.allCache;
    const items = [];

    for (const id in buffTable) {
      items.push(this.getByID(id as string));
    }

     for (const id in deBuffTable) {
       items.push(this.getByID(id as string));
     }

    this.allCache = Object.freeze(items);
    return this.allCache;
  }
}