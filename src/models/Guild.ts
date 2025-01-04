import * as Item from "./Item.js";
import * as Build from "./Build.js";
import { Guilds } from "../data/Guilds.js";

export type guildDataTable = { [id: string]: Guild };
const guildsTable: guildDataTable = Guilds;

type promotion = {
  stats?: Build.stats;
  perks?: Build.perks;
};

export class Guild {
  id: string;
  name: string;
  category?: string;
  description?: string;
  img?:string;
  promotions?: promotion[];

  constructor(data?: any) {
    this.id = data?.id || undefined;
    this.name = data?.name || "";
    this.category = data?.category || "Guild";
    this.description = data?.description || "";
    this.img = data?.img || "";
    this.promotions = data?.promotions || [];
  }
}

export class GuildStore {
  static readonly perkCache = new Map<string, Guild>();
  static allCache: readonly Guild[] | null = null;
  static guildNames: readonly string[] = [];

  constructor() {}

  static get(name?: string | Guild): Guild {
    if (name && typeof name !== "string") return name;

    name = (name || "").trim();
    const id = Item.toID(name);
    return this.getByID(id);
  }

  static getByID(id: string): Guild {
    let guild = this.perkCache.get(id);
    if (guild) return Object.assign(new Guild(), guild) as Guild;

    let Data = guildsTable[id] as any;

    if (!Data) {
      return new Guild({ id });
    }

    guild = new Guild({ ...Data });

    guild = Object.freeze(guild);
    this.perkCache.set(id, guild);

    return Object.assign(new Guild(), guild) as Guild;
  }

  static all(): readonly Guild[] {
    if (this.allCache) return this.allCache;
    const guilds = [];
    const perkNames: string[] = [];
    for (const id in guildsTable) {
      let item = this.getByID(id as string);
      guilds.push(item);
      perkNames.push(item.name);
    }
    this.allCache = Object.freeze(guilds);
    this.guildNames = Object.freeze(perkNames);
    return this.allCache;
  }
}