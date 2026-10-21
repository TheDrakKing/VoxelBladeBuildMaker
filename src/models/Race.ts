import * as Item from "./Item.js";
import * as Build from "./Build.js";
import { Races } from "../data/Races.js";

export type raceDataTable = { [id: string]: Race };
const racesTable: raceDataTable = Races;

export class Race {
  id: string;
  name: string;
  category?: string;
  description?: string;
  racepassive?: string;
  source?: { cardId: string; cardUrl: string };
  flatAttackSpeed?: number;
  stats?: Build.stats;
  perks?: Build.perks;
  img?:string;

  constructor(data?: any) {
    this.id = data?.id || undefined;
    this.name = data?.name || "";
    this.category = data?.category || "Race";
    this.description = data?.description || "";
    this.racepassive = data?.racepassive || "";
    this.source = data?.source;
    this.flatAttackSpeed = data?.flatAttackSpeed;
    this.stats =  data?.stats || {};
    this.perks =  data?.perks || {};
    this.img = data?.img || "";
  }
}

export class RaceStore {
  static readonly raceCache = new Map<string, Race>();
  static allCache: readonly Race[] | null = null;
  static raceNames: readonly string[] = [];

  constructor() {}

  static get(name?: string | Race): Race {
    if (name && typeof name !== "string") return name;

    name = (name || "").trim();
    const match = Object.entries(racesTable).find(([id, race]) => id === name || race.name.toLowerCase() === name.toLowerCase());
    return this.getByID(match?.[0] || Item.toID(name));
  }

  static getByID(id: string): Race {
    let race = this.raceCache.get(id);
    if (race) return Object.assign(new Race(), race) as Race;

    let Data = racesTable[id];

    if (!Data) {
      return new Race({ id });
    }

    race = new Race({ ...Data });

    race = Object.freeze(race);
    this.raceCache.set(id, race);

    return Object.assign(new Race(), race) as Race;
  }

  static all(): readonly Race[] {
    if (this.allCache) return this.allCache;
    const races = [];
    const perkNames: string[] = [];
    for (const id in racesTable) {
      let item = this.getByID(id as string);
      races.push(item);
      perkNames.push(item.name);
    }
    this.allCache = Object.freeze(races);
    this.raceNames = Object.freeze(perkNames);
    return this.allCache;
  }
}