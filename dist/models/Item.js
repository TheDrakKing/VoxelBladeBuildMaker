import { Helmets } from "../data/Helmets.js";
import { Chestplate } from "../data/Chestplates.js";
import { Leggings } from "../data/Leggings.js";
import { Blades } from "../data/Blades.js";
import { Handles } from "../data/Handles.js";
import { Gloves } from "../data/Gloves.js";
import { Essences } from "../data/Essences.js";
import { Rings } from "../data/Rings.js";
import { Runes } from "../data/Runes.js";
import { Enchantments } from "../data/Enchantments.js";
const enchantmentsTable = Enchantments;
export class events {
}
export const potencyAliases = {
    bouncepotency: "Bounce Potency",
    bleedpotency: "Bleed Potency",
    burnpotency: " Burn Potency",
    ragepotency: "Rage Potency",
    poisonpotency: "Poison Potency",
    reinforcepotency: "Reinforce Potency",
    guaranteedcritpotency: "Guaranteed Crit Potency",
    regenpotency: "Regen Potency",
    shatterpotency: "Shatter Potency",
    lightningcloakpotency: "Lightning Cloak Potency",
    tauntpotency: "Taunt Potency",
    weakeningpotency: "Weakening Potency",
};
function normalizePotencyKey(value) {
    const normalizedValue = value.toLowerCase().replace(/[\s_]+/g, "");
    if (!normalizedValue.endsWith("potency"))
        return null;
    return Object.prototype.hasOwnProperty.call(potencyAliases, normalizedValue)
        ? normalizedValue
        : null;
}
function collectNormalizedPotencies(potencies, perks) {
    const normalizedPotencies = {};
    const normalizedPerks = { ...(perks || {}) };
    for (const [key, value] of Object.entries(potencies || {})) {
        if (typeof value !== "number")
            continue;
        const potencyKey = normalizePotencyKey(key);
        if (!potencyKey)
            continue;
        normalizedPotencies[potencyKey] =
            (normalizedPotencies[potencyKey] || 0) + value;
    }
    for (const [key, value] of Object.entries(normalizedPerks)) {
        if (typeof value !== "number")
            continue;
        const potencyKey = normalizePotencyKey(key);
        if (!potencyKey)
            continue;
        normalizedPotencies[potencyKey] =
            (normalizedPotencies[potencyKey] || 0) + value;
        delete normalizedPerks[key];
    }
    return { normalizedPotencies, normalizedPerks };
}
export class Item extends events {
    constructor(data) {
        super();
        Object.assign(this, data);
        const { normalizedPotencies, normalizedPerks } = collectNormalizedPotencies(data?.potencies, data?.perks);
        const hasPotenciesInput = data?.potencies !== undefined;
        const hasPerksInput = data?.perks !== undefined;
        this.id = data?.id || undefined;
        this.name = data?.name || "";
        this.category = data?.category || "";
        this.upgrade = data?.upgrade || 0;
        this.duration = data?.duration;
        this.cooldown = data?.cooldown;
        this.tier = data?.tier;
        this.img = data ? data.img : undefined;
        this.type = (data && data?.type) || undefined;
        this.description = data?.description || "";
        this.potencies = hasPotenciesInput || Object.keys(normalizedPotencies).length
            ? normalizedPotencies
            : {};
        this.sourcepotencies = data?.sourcepotencies;
        this.stats = data?.stats;
        this.perks = hasPerksInput ? normalizedPerks : undefined;
        this.damageScalings = data?.damageScalings;
        this.damageTypes = data?.damageTypes;
        this.baseDamage = data?.baseDamage ?? undefined;
        this.attackSpeed = data?.attackSpeed;
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
    ['glove', Gloves],
    ['essence', Essences],
    ['ring', Rings],
    ['rune', Runes],
    ['enchantment', Enchantments]
]);
ItemStore.allCache = null;
ItemStore.itemNames = [];
ItemStore.enchantmentNames = [];
