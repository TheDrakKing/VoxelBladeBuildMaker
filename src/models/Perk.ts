import * as Item from "./Item.js";
import { Perks } from "../data/Perks.js";

export type perkDataTable = { [id: string]: Perk };
const perksTable: perkDataTable = Perks;

export class Perk extends Item.events {
  id: string;
  name: string;
  category?: string;
  description?: string;

  constructor(data?: any) {
    super()
    Object.assign(this, data);
    this.id = data?.id || "";
    this.name = data?.name || "";
    this.category = data?.category || "";
    this.description = data?.description || "";
  }
}

export class PerkStore {
  static readonly perkCache = new Map<string, Perk>();
  static allCache: readonly Perk[] | null = null;
  static perkNames: readonly string[] = [];

  constructor() {}

  static get(name?: string | Perk): Perk {
    if (name && typeof name !== "string") return name;

    name = (name || "").trim();
    const id = Item.toID(name);
    return this.getByID(id);
  }

  static getByID(id: string): Perk {
    let perk = this.perkCache.get(id);
    if (perk) return Object.assign(new Perk(), perk) as Perk;

    let Data = perksTable[id] as any;

    if (!Data) {
      return new Perk({ id });
    }

    perk = new Perk({ ...Data });

    perk = Object.freeze(perk);
    this.perkCache.set(id, perk);

    return Object.assign(new Perk(), perk) as Perk;
  }

  static all(): readonly Perk[] {
    if (this.allCache) return this.allCache;
    const perks = [];
    const perkNames:string[] = [];
    for (const id in perksTable) {
      let item = this.getByID(id as string);
      perks.push(item);
      perkNames.push(item.name);
    }
    this.allCache = Object.freeze(perks);
    this.perkNames = Object.freeze(perkNames);
    return this.allCache;
  }
}
