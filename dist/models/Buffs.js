import * as ItemModule from "./Item.js";
import { Buffs } from "../data/Buffs.js";
import { Debuffs } from "../data/Debuffs.js";
/** Game units: percentage first, then one flat 0.1 regardless of perk count. */
export function applyEndlessDespairPotency(base, amount) {
    return typeof amount === "number" && Number.isFinite(amount) && amount > 0 ? base * (1 + .35 * amount) + .1 : base;
}
/** Provisional DoT rule: combine the documented source/stat curve first, then
 * modify its strength above the fixed base-1 damage. Not an in-game-verified formula. */
export function estimateEndlessDespairDotDamage(combinedDamage, amount) {
    if (!Number.isFinite(combinedDamage) || combinedDamage <= 0 || !Number.isFinite(amount) || !amount || amount < 0)
        return combinedDamage;
    return 1 + applyEndlessDespairPotency(combinedDamage - 1, amount);
}
const buffTable = Buffs;
const deBuffTable = Debuffs;
export class Buff extends ItemModule.events {
    constructor(data) {
        super();
        Object.assign(this, data);
        this.id = data?.id || undefined;
        this.name = data?.name || "";
        this.category = data?.category || "";
        this.potencyId = data?.potencyId || "";
        this.baseDuration = data?.baseDuration || "";
        this.potency = data?.potency || "";
        this.img = data?.img || "";
    }
    setSourceData(source = "", sourceType = "Default", sourceInatePotency = 0.1) {
        this.sourceData = {
            source,
            sourceType,
            sourceInatePotency,
        };
    }
    getSourceData() {
        return this.sourceData;
    }
    getAppliedBy() {
        return this.appliedBy ?? (this.category === "Debuff" ? "opponent" : "self");
    }
    getSourceBuild(holder) {
        return this.getAppliedBy() === "opponent" ? holder.statusOpponent || holder.target || holder : holder;
    }
    /** Internal potency points after applicant bonuses and reviewed recipient effects. */
    getReceivedPotency(holder) {
        if (this.id === "slow" && (holder.perks.unmoving || 0) > 0)
            return 3;
        const potency = this.getEffectivePotency(this.getSourceBuild(holder));
        // The override is a final received value; source bonuses and reductions are already included.
        if (typeof this.effectivePotencyOverride === "number" && Number.isFinite(this.effectivePotencyOverride))
            return potency;
        const roaring = holder.perks.roaring_heads || 0;
        return (this.id === "weakness" || this.id === "shatter") && Number.isFinite(roaring) && roaring > 0
            ? potency * Math.max(0, 1 - 0.33 * roaring) : potency;
    }
    isEndlessDespairEligible() {
        return this.category === "Debuff" && this.getAppliedBy() === "opponent" && this.endlessDespairEligible !== false;
    }
    getEndlessDespairAmount(sourceBuild) {
        const amount = sourceBuild?.perks?.endless_despair || 0;
        return this.isEndlessDespairEligible() && Number.isFinite(amount) && amount > 0 ? amount : 0;
    }
    getDurationPreview(sourceBuild, recipient) {
        const manual = this.baseDurationOverride;
        const base = typeof manual === "number" && Number.isFinite(manual) && manual >= 0 ? manual :
            typeof this.baseDuration === "number" && Number.isFinite(this.baseDuration) && this.baseDuration >= 0 ? this.baseDuration : undefined;
        const positive = (id) => { const value = sourceBuild?.perks?.[id]; return typeof value === "number" && Number.isFinite(value) && value > 0 ? value : 0; };
        const realStatus = this.category === "Debuff" || this.category === "Buff" && this.countsAsBuff !== false;
        const contained = realStatus ? 1 + .33 * positive("contained") : 1;
        const fury = this.id === "rage" ? 1 + .5 * positive("fury") : 1;
        const slowLeak = this.id === "bleed" && this.getAppliedBy() === "opponent" && recipient?.buff?.some(status => status.id === "enemy_mob") ? 1 + .5 * positive("slow_leak") : 1;
        const iron = this.id === "rage" && this.ironSlayerEnhanced ? 2 : 1;
        const multiplier = (1 + 0.75 * this.getEndlessDespairAmount(sourceBuild)) * contained * fury * slowLeak * iron;
        return { base, multiplier, duration: base === undefined ? undefined : Math.round((base * multiplier + Number.EPSILON) * 10000) / 10000, manual: manual !== undefined };
    }
    /** Raw DoT inputs; the ED estimate runs after the source/stat damage combination. */
    getDotPotencies(sourceBuild) {
        const override = this.effectivePotencyOverride;
        const additive = typeof override === "number" && Number.isFinite(override)
            ? Math.max(0, override) * 10
            : Math.max(0, (this.potencyId ? sourceBuild?.potencies[this.potencyId] || 0 : 0) + (this.potency || 0) * 10);
        // Keep stored points and source snapshots unchanged; ED is applied after this curve.
        return { additive, source: Math.max(0, this.sourceData?.sourceInatePotency || 0) };
    }
    getEffectivePotency(sourceBuild) {
        if (typeof this.effectivePotencyOverride === "number" && Number.isFinite(this.effectivePotencyOverride)) {
            return Math.max(0, this.effectivePotencyOverride) * 10;
        }
        const sourcePotency = this.sourceData?.sourceInatePotency || 0;
        const additivePotency = this.potencyId && sourceBuild
            ? sourceBuild.potencies[this.potencyId] || 0
            : 0;
        const directPotency = this.potency || 0;
        const tailwind = this.id === "tailwind" && (sourceBuild?.perks?.tailwind || 0) > 0 ? 0.1 : 0;
        const bastion = sourceBuild?.perks?.bastion_bless || 0;
        const multiplier = this.category === "Buff" && this.countsAsBuff !== false && Number.isFinite(bastion) && bastion > 0 ? 1 + 0.1 * bastion : 1;
        let potency = (sourcePotency + (additivePotency / 10) + directPotency + tailwind) * multiplier;
        if (this.id === "rage" && this.ironSlayerEnhanced)
            potency += .2;
        const endless = this.potencyId && !this.getDamageInfo ? this.getEndlessDespairAmount(sourceBuild) : 0;
        potency = applyEndlessDespairPotency(potency, endless);
        return potency * 10;
    }
}
export class BuffStore {
    constructor() { }
    static get(name) {
        if (name && typeof name !== "string")
            return name;
        name = (name || "").trim();
        const id = ItemModule.toID(name);
        return this.getByID(id);
    }
    static lookMap(id) {
        if (this.buffCache.has(id)) {
            return this.buffCache.get(id);
        }
        else if (this.deBuffCache.has(id)) {
            return this.deBuffCache.get(id);
        }
    }
    static getByID(id) {
        let item = this.lookMap(id);
        if (item)
            return Object.assign(new Buff(), item);
        let Data;
        let cache = new Map();
        if (id in buffTable) {
            Data = buffTable[id];
            cache = this.buffCache;
        }
        else if (id in deBuffTable) {
            Data = deBuffTable[id];
            cache = this.deBuffCache;
        }
        if (!Data) {
            return new Buff({ id });
        }
        item = new Buff({ ...Data });
        item = Object.freeze(item);
        cache.set(id, item);
        return Object.assign(new Buff(), item);
    }
    static getAllBuff() {
        const buffs = [];
        for (const id in buffTable) {
            buffs.push(this.getByID(id));
        }
        return buffs;
    }
    static getAllDeBuff() {
        const deBuffs = [];
        for (const id in deBuffTable) {
            deBuffs.push(this.getByID(id));
        }
        return deBuffs;
    }
    static getByCategory(category) {
        switch (category) {
            case "Buff":
                return this.getAllBuff();
            case "Debuff":
                return this.getAllDeBuff();
            default:
                return [];
        }
    }
    static all() {
        if (this.allCache)
            return this.allCache;
        const items = [];
        for (const id in buffTable) {
            items.push(this.getByID(id));
        }
        for (const id in deBuffTable) {
            items.push(this.getByID(id));
        }
        this.allCache = Object.freeze(items);
        return this.allCache;
    }
}
BuffStore.buffCache = new Map();
BuffStore.deBuffCache = new Map();
BuffStore.allCache = null;
