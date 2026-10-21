import * as Item from "./Item.js";
import { Races } from "../data/Races.js";
const racesTable = Races;
export class Race {
    constructor(data) {
        this.id = data?.id || undefined;
        this.name = data?.name || "";
        this.category = data?.category || "Race";
        this.description = data?.description || "";
        this.racepassive = data?.racepassive || "";
        this.source = data?.source;
        this.flatAttackSpeed = data?.flatAttackSpeed;
        this.stats = data?.stats || {};
        this.perks = data?.perks || {};
        this.img = data?.img || "";
    }
}
export class RaceStore {
    constructor() { }
    static get(name) {
        if (name && typeof name !== "string")
            return name;
        name = (name || "").trim();
        const match = Object.entries(racesTable).find(([id, race]) => id === name || race.name.toLowerCase() === name.toLowerCase());
        return this.getByID(match?.[0] || Item.toID(name));
    }
    static getByID(id) {
        let race = this.raceCache.get(id);
        if (race)
            return Object.assign(new Race(), race);
        let Data = racesTable[id];
        if (!Data) {
            return new Race({ id });
        }
        race = new Race({ ...Data });
        race = Object.freeze(race);
        this.raceCache.set(id, race);
        return Object.assign(new Race(), race);
    }
    static all() {
        if (this.allCache)
            return this.allCache;
        const races = [];
        const perkNames = [];
        for (const id in racesTable) {
            let item = this.getByID(id);
            races.push(item);
            perkNames.push(item.name);
        }
        this.allCache = Object.freeze(races);
        this.raceNames = Object.freeze(perkNames);
        return this.allCache;
    }
}
RaceStore.raceCache = new Map();
RaceStore.allCache = null;
RaceStore.raceNames = [];
