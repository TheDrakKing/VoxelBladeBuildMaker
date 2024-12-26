import { Perks } from "../data/Perks.js";
const perksTable = Perks;
export class Perk {
    constructor(data) {
        this.id = data.id;
        this.name = data.name ? data.name : "";
        this.category = data.category;
        this.description = data.description ? data.description : "";
        this.Multiplier = data.Multiplier ? data.Multiplier : undefined;
    }
}
function toID(name) {
    return name.toLowerCase().replace(" ", "_");
}
export class PerkStore {
    constructor() { }
    static get(name) {
        if (name && typeof name !== "string")
            return name;
        name = (name || "").trim();
        const id = toID(name);
        return this.getByID(id);
    }
    static getByID(id) {
        let perk = this.perkCache.get(id);
        if (perk)
            return perk;
        let Data = perksTable[id];
        if (!Data) {
            return new Perk({ id });
        }
        perk = new Perk({ ...Data });
        perk = Object.freeze(perk);
        this.perkCache.set(id, perk);
        return perk;
    }
    static all() {
        if (this.allCache)
            return this.allCache;
        const perks = [];
        for (const id in perksTable) {
            perks.push(this.getByID(id));
        }
        this.allCache = Object.freeze(perks);
        return this.allCache;
    }
}
PerkStore.perkCache = new Map();
PerkStore.allCache = null;
PerkStore.itemNames = [];
