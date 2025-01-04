import * as Item from "./Item.js";
import { Perks } from "../data/Perks.js";
const perksTable = Perks;
export class Perk extends Item.events {
    constructor(data) {
        super();
        Object.assign(this, data);
        this.id = data?.id || "";
        this.name = data?.name || "";
        this.category = data?.category || "";
        this.description = data?.description || "";
    }
}
export class PerkStore {
    constructor() { }
    static get(name) {
        if (name && typeof name !== "string")
            return name;
        name = (name || "").trim();
        const id = Item.toID(name);
        return this.getByID(id);
    }
    static getByID(id) {
        let perk = this.perkCache.get(id);
        if (perk)
            return Object.assign(new Perk(), perk);
        let Data = perksTable[id];
        if (!Data) {
            return new Perk({ id });
        }
        perk = new Perk({ ...Data });
        perk = Object.freeze(perk);
        this.perkCache.set(id, perk);
        return Object.assign(new Perk(), perk);
    }
    static all() {
        if (this.allCache)
            return this.allCache;
        const perks = [];
        const perkNames = [];
        for (const id in perksTable) {
            let item = this.getByID(id);
            perks.push(item);
            perkNames.push(item.name);
        }
        this.allCache = Object.freeze(perks);
        this.perkNames = Object.freeze(perkNames);
        return this.allCache;
    }
}
PerkStore.perkCache = new Map();
PerkStore.allCache = null;
PerkStore.perkNames = [];
