import { Helmets } from "../data/Helmets.js";
import { Chestplate } from "../data/Chestplates.js";
import { Leggings } from "../data/Leggings.js";
import { Blades } from "../data/Blades.js";
import { Handles } from "../data/Handles.js";
import { Rings } from "../data/Rings.js";
import { Runes } from "../data/Runes.js";
import { Enchantments } from "../data/Enchantments.js";
const enchantmentsTable = Enchantments;
export class events {
}
export const potencyAliases = {
    bouncepotency: "Bounce Potency",
    bleedpotency: "Bleed Potency",
    burnboost: " Burn Potency",
    ragepotency: "Rage Potency",
    poisonpotency: "Poison Potency",
    reinforcepotency: "Reinforce Potency",
    weakeningpotency: "Weakening Potency",
};
export class Item extends events {
    constructor(data) {
        super();
        Object.assign(this, data);
        this.id = data?.id || undefined;
        this.name = data?.name || "";
        this.category = data?.category || "";
        this.upgrade = data?.upgrade || 0;
        this.img = data ? data.img : undefined;
        this.type = data && data?.type || undefined;
        this.description = data?.description || "";
        this.potencies = data?.potencies || {};
        this.sourcepotencies = data?.sourcepotencies || {};
        this.stats = data?.stats || {};
        this.perks = data?.perks || {};
        this.damageScalings = data?.damageScalings || {};
        this.damageTypes = data?.damageTypes || {};
    }
}
export function toID(name) {
    return name.toLowerCase().replace(" ", "_");
}
export class ItemStore {
    constructor() { }
    static get(name) {
        if (name && typeof name !== "string")
            return name;
        name = (name || "").trim();
        const id = toID(name);
        return this.getByID(id);
    }
    static getByID(id) {
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
    static getByCategory(category) {
        // Check if category is already cached
        if (this.categoryCache.has(category)) {
            return this.categoryCache.get(category);
        }
        const table = this.categoryMap.get(category.toLowerCase());
        if (!table)
            return [];
        const items = Object.keys(table).map(id => this.getByID(id));
        this.categoryCache.set(category, items);
        return items;
    }
    static getEnchantmentNames() {
        if (this.enchantmentNames.length)
            return this.enchantmentNames;
        const names = [];
        for (const id in enchantmentsTable) {
            names.push(this.getByID(id).name);
        }
        this.enchantmentNames = Object.freeze(names);
        return this.enchantmentNames;
    }
}
ItemStore.itemCache = new Map();
ItemStore.categoryCache = new Map();
ItemStore.categoryMap = new Map([
    ['helmet', Helmets],
    ['chestplate', Chestplate],
    ['legging', Leggings],
    ['blade', Blades],
    ['handle', Handles],
    ['ring', Rings],
    ['rune', Runes],
    ['enchantment', Enchantments]
]);
ItemStore.allCache = null;
ItemStore.itemNames = [];
ItemStore.enchantmentNames = [];
