import { Helmets } from "../data/Helmets.js";
import { Chestplate } from "../data/Chestplates.js";
import { Leggings } from "../data/Leggings.js";
import { Blades } from "../data/Blades.js";
import { Handles } from "../data/Handles.js";
import { Rings } from "../data/Rings.js";
import { Runes } from "../data/Runes.js";
import { Enchantments } from "../data/Enchantments.js";
const chestplateTable = Chestplate;
const helmetTable = Helmets;
const leggingTable = Leggings;
const bladeTable = Blades;
const handleTable = Handles;
const ringTable = Rings;
const runeTable = Runes;
const enchantmentsTable = Enchantments;
export class events {
}
export const potencyAliases = {
    bouncepotency: "Bounce Potency",
    bleedpotency: "Bounce Potency",
    burnboost: "Bounce Potency",
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
    static lookMap(id) {
        if (this.helmetCache.has(id)) {
            return this.helmetCache.get(id);
        }
        else if (this.chestplateCache.has(id)) {
            return this.chestplateCache.get(id);
        }
        else if (this.leggingCache.has(id)) {
            return this.leggingCache.get(id);
        }
        else if (this.bladeCache.has(id)) {
            return this.bladeCache.get(id);
        }
        else if (this.handleCache.has(id)) {
            return this.handleCache.get(id);
        }
        else if (this.runeCache.has(id)) {
            return this.runeCache.get(id);
        }
        else if (this.ringCache.has(id)) {
            return this.ringCache.get(id);
        }
        else if (this.enchantmentCache.has(id)) {
            return this.enchantmentCache.get(id);
        }
    }
    static getByID(id) {
        let item = this.lookMap(id);
        if (item)
            return Object.assign(new Item(), item);
        let Data;
        let cache = new Map();
        if (id in helmetTable) {
            Data = helmetTable[id];
            cache = this.helmetCache;
        }
        else if (id in chestplateTable) {
            Data = chestplateTable[id];
            cache = this.chestplateCache;
        }
        else if (id in leggingTable) {
            Data = leggingTable[id];
            cache = this.leggingCache;
        }
        else if (id in bladeTable) {
            Data = bladeTable[id];
            cache = this.bladeCache;
        }
        else if (id in handleTable) {
            Data = handleTable[id];
            cache = this.handleCache;
        }
        else if (id in runeTable) {
            Data = runeTable[id];
            cache = this.runeCache;
        }
        else if (id in ringTable) {
            Data = ringTable[id];
            cache = this.ringCache;
        }
        else if (id in enchantmentsTable) {
            Data = enchantmentsTable[id];
            cache = this.enchantmentCache;
        }
        if (!Data) {
            return new Item({ id });
        }
        item = new Item({ ...Data });
        item = Object.freeze(item);
        cache.set(id, item);
        return Object.assign(new Item(), item);
    }
    static getAllHelmets() {
        const items = [];
        for (const id in helmetTable) {
            items.push(this.getByID(id));
        }
        return items;
    }
    static getAllChestplates() {
        const items = [];
        for (const id in chestplateTable) {
            items.push(this.getByID(id));
        }
        return items;
    }
    static getAllLeggings() {
        const items = [];
        for (const id in leggingTable) {
            items.push(this.getByID(id));
        }
        return items;
    }
    static getAllBlades() {
        const items = [];
        for (const id in bladeTable) {
            items.push(this.getByID(id));
        }
        return items;
    }
    static getAllHandle() {
        const items = [];
        for (const id in handleTable) {
            items.push(this.getByID(id));
        }
        return items;
    }
    static getAllRune() {
        const items = [];
        for (const id in runeTable) {
            items.push(this.getByID(id));
        }
        return items;
    }
    static getAllRing() {
        const items = [];
        for (const id in ringTable) {
            items.push(this.getByID(id));
        }
        return items;
    }
    static getAllEnchant() {
        const items = [];
        for (const id in enchantmentsTable) {
            items.push(this.getByID(id));
        }
        return items;
    }
    static getByCategory(category) {
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
ItemStore.helmetCache = new Map();
ItemStore.chestplateCache = new Map();
ItemStore.leggingCache = new Map();
ItemStore.bladeCache = new Map();
ItemStore.handleCache = new Map();
ItemStore.ringCache = new Map();
ItemStore.runeCache = new Map();
ItemStore.enchantmentCache = new Map();
ItemStore.allCache = null;
ItemStore.itemNames = [];
ItemStore.enchantmentNames = [];
