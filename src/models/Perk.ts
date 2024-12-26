import * as Item from "./Item.js";
import { Perks } from "../data/Perks.js";

export type perkDataTable = { [id: string]: Perk };
const perksTable: perkDataTable = Perks;

export interface perkData extends Item.events {
  id: string;
  name: string;
}

export class Perk implements perkData {
  id: string;
  name: string;
  category?: string;
  description?: string;
  Multiplier?: string;

  constructor(data: any) {
    this.id = data.id;
    this.name = data.name ? data.name : "";
    this.category = data.category;
    this.description = data.description ? data.description : "";
    this.Multiplier = data.Multiplier ? data.Multiplier : undefined;
  }
}

function toID(name: string) {
  return name.toLowerCase().replace(" ", "_");
}

export class PerkStore {
  static readonly perkCache = new Map<string, Perk>();
  static allCache: readonly Perk[] | null = null;
  static itemNames: readonly string[] = [];

  constructor() {}

  static get(name?: string | Perk): Perk {
    if (name && typeof name !== "string") return name;

    name = (name || "").trim();
    const id = toID(name);
    return this.getByID(id);
  }

  static getByID(id: string): Perk {
    let perk = this.perkCache.get(id);
    if (perk) return perk;

    let Data = perksTable[id] as any;

    if (!Data) {
      return new Perk({ id });
    }

    perk = new Perk({ ...Data });

    perk = Object.freeze(perk);
    this.perkCache.set(id, perk);
    return perk;
  }

  static all(): readonly Perk[] {
    if (this.allCache) return this.allCache;
    const perks = [];
    for (const id in perksTable) {
      perks.push(this.getByID(id as string));
    }
    this.allCache = Object.freeze(perks);
    return this.allCache;
  }
}
