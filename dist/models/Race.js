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
        const id = Item.toID(name);
        return this.getByID(id);
    }
    static getByID(id) {
        let race = this.perkCache.get(id);
        if (race)
            return Object.assign(new Race(), race);
        let Data = racesTable[id];
        if (!Data) {
            return new Race({ id });
        }
        race = new Race({ ...Data });
        race = Object.freeze(race);
        this.perkCache.set(id, race);
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
RaceStore.perkCache = new Map();
RaceStore.allCache = null;
RaceStore.raceNames = [];
