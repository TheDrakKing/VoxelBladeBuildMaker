import { toPerkID } from "./Identifiers.js";
import * as Item from "./Item.js";
import { Perks } from "../data/Perks.js";
const perksTable = Perks;
export function getPerkSupport(perk) {
    if (perk.support)
        return perk.support;
    const implemented = new Set(["human", "cut_down", "vital_strikes", "strong_tides", "extra_layers", "spellshield", "spark", "flowing_crits", "sharp_crits", "golden_crits", "spell_piercer", "spell_slinger"]);
    if (perk.id === "golden_crits")
        return { status: "Implemented", details: "Crit damage is the expected value using the documented 40% proc chance." };
    if (perk.id === "critical_master")
        return { status: "Partial", details: "The critical damage bonus is calculated; automatic Guardbreak-triggered perk chains require selected state." };
    if (implemented.has(perk.id))
        return { status: "Implemented", details: "Calculated for the selected HP and status conditions." };
    if (["duelist_stance", "saw_stance", "dual_wielding", "locked_and_loaded"].includes(perk.id)) {
        return { status: "Partial", details: "Weapon construction is calculated. Other effects and automatic triggers are not simulated." };
    }
    if (perk.id === "voltaic_body")
        return { status: "Partial", details: "Charged-hit damage preview. Select Static Charge to choose hit count; activation and cooldown are not simulated." };
    const hasBehavior = Object.values(perk).some((value) => typeof value === "function") ||
        !!(perk.stats || perk.sourcepotencies || perk.baseDamage || perk.critical);
    return hasBehavior
        ? { status: "Partial", details: "Some effects are calculated. Trigger timing and the complete interaction rules are not implemented." }
        : { status: "Unsupported", details: "Listed for reference; this perk's effects are not currently calculated." };
}
export class Perk extends Item.events {
    constructor(data) {
        super();
        Object.assign(this, data);
        this.id = data?.id || "";
        this.name = data?.name || "";
        this.category = data?.category || "";
        this.description = data?.description || "";
        this.statPriority = data?.statPriority ?? 0;
        this.baseDamage = data?.baseDamage || "";
        this.stats = data?.stats;
        this.damageScalings = data?.damageScalings;
        this.damageTypes = data?.damageTypes;
        this.sourcepotencies = data?.sourcepotencies;
        this.potencies = data?.potencies || {};
    }
}
export function getSortedPerkEventEntries(perks, eventName) {
    const entries = [];
    for (const [perkId, amount] of Object.entries(perks)) {
        if (amount === undefined)
            continue;
        const perk = PerkStore.getByID(perkId);
        if (!perk[eventName])
            continue;
        entries.push({ perkId, amount, perk });
    }
    entries.sort((left, right) => {
        const priorityDiff = (right.perk.statPriority ?? 0) - (left.perk.statPriority ?? 0);
        if (priorityDiff !== 0)
            return priorityDiff;
        return left.perk.name.localeCompare(right.perk.name);
    });
    return entries;
}
export class PerkStore {
    constructor() { }
    static get(name) {
        if (name && typeof name !== "string")
            return name;
        name = (name || "").trim();
        const id = toPerkID(name);
        return this.getByID(id);
    }
    static getByID(id) {
        id = toPerkID(id);
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
