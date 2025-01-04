import * as Item from "./Item.js";
import { Guilds } from "../data/Guilds.js";
const guildsTable = Guilds;
export class Guild {
    constructor(data) {
        this.id = data?.id || undefined;
        this.name = data?.name || "";
        this.category = data?.category || "Guild";
        this.description = data?.description || "";
        this.img = data?.img || "";
        this.promotions = data?.promotions || [];
    }
}
export class GuildStore {
    constructor() { }
    static get(name) {
        if (name && typeof name !== "string")
            return name;
        name = (name || "").trim();
        const id = Item.toID(name);
        return this.getByID(id);
    }
    static getByID(id) {
        let guild = this.perkCache.get(id);
        if (guild)
            return Object.assign(new Guild(), guild);
        let Data = guildsTable[id];
        if (!Data) {
            return new Guild({ id });
        }
        guild = new Guild({ ...Data });
        guild = Object.freeze(guild);
        this.perkCache.set(id, guild);
        return Object.assign(new Guild(), guild);
    }
    static all() {
        if (this.allCache)
            return this.allCache;
        const guilds = [];
        const perkNames = [];
        for (const id in guildsTable) {
            let item = this.getByID(id);
            guilds.push(item);
            perkNames.push(item.name);
        }
        this.allCache = Object.freeze(guilds);
        this.guildNames = Object.freeze(perkNames);
        return this.allCache;
    }
}
GuildStore.perkCache = new Map();
GuildStore.allCache = null;
GuildStore.guildNames = [];
