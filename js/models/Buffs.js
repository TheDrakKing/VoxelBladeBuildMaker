import * as ItemModule from "./Item.js";
import { Buffs } from "../data/Buffs.js";
import { Debuffs } from "../data/Debuffs.js";
const buffTable = Buffs;
const deBuffTable = Debuffs;
export class Buff extends ItemModule.events {
    constructor(data) {
        super();
        Object.assign(this, data);
        this.id = data?.id || undefined;
        this.name = data?.name || "";
        this.category = data?.category || "";
        this.baseDuration = data?.baseDuration || "";
        this.img = data?.img || "";
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
