import * as ItemModule from "./Item.js";
import { Buffs } from "../data/Buffs.js";
import { Debuffs } from "../data/Debuffs.js";
import { Build } from "./Build.js";

export type BuffDataTable = { [id: string]: Partial<Buff> };

const buffTable: BuffDataTable = Buffs;
const deBuffTable: BuffDataTable = Debuffs;

export class Buff extends ItemModule.events {
  id: string;
  name?: string;
  category: string;
  baseDuration: number;
  /**
   * The potency that affect this buff
   */
  potencyId?: ItemModule.potency;
  /**
   * Only if this buff add it own additve potency, but most times this is undefined
   */
  potency?: number;
  /** User-selected effective potency in game units (0.1 = one potency point internally). */
  effectivePotencyOverride?: number;
  stacks?: number;
  /** Scenario selectors and counters do not create an additional active game buff. */
  countsAsBuff?: boolean;
  exclusiveGroup?: "lighting" | "mount";
  scenarioDetails?: string;
  /** Manual ordering for the Venom Eater preview; the source does not establish this priority. */
  consumptionTiming?: "before" | "after";
  /** Relative to the build carrying this status. Legacy buffs are self-applied, debuffs opponent-applied. */
  appliedBy?: "self" | "opponent";
  /**
   * buff scaling are only for this buff only if it does damage, not to be added to the total build scaling
   */
  damageScalings?: { [k in ItemModule.scale]?: number };
    /**
   * buff damageType are only for this buff only if it does damage, not to be added to the total build scaling
   */
  damageTypes?: { [k in ItemModule.damageType]?: number };
  /**
   * sourceData is only for when a buff is being added to a build, all buffs must have a source, 
   * where they get there starting potency from
   * if no source can is determined, then sourceType is Default and sourceInatePotency is 0.1
   */
  sourceData?: {source : string, sourceType: "Rune" | "Perk" | "WeaponArt" | "Default", sourceInatePotency: number}
  getDamageInfo?:(this: Build, additivePotency?: number, sourcePotency?: number) => baseDamageData | null;
  img?: string;

  constructor(data?: any) {
    super()
    Object.assign(this, data);
    this.id = data?.id || undefined;
    this.name = data?.name || "";
    this.category = data?.category || "";
    this.potencyId = data?.potencyId || "";
    this.baseDuration = data?.baseDuration || "";
    this.potency = data?.potency || "";
    this.img = data?.img || "";
  }

  setSourceData(source : string = "", sourceType: "Rune" | "Perk" | "WeaponArt" | "Default" = "Default", sourceInatePotency: number = 0.1) {
    this.sourceData = {
      source,
      sourceType,
      sourceInatePotency,
    }
  }

  getSourceData() {
    return this.sourceData
  }

  getAppliedBy(): "self" | "opponent" {
    return this.appliedBy ?? (this.category === "Debuff" ? "opponent" : "self");
  }

  getSourceBuild<T extends { target?: T; statusOpponent?: T }>(holder: T): T {
    return this.getAppliedBy() === "opponent" ? holder.statusOpponent || holder.target || holder : holder;
  }

  getDotPotencies(sourceBuild?: Pick<Build, "potencies">) {
    const override = this.effectivePotencyOverride;
    const additive = typeof override === "number" && Number.isFinite(override)
      ? Math.max(0, override) * 10
      : Math.max(0, (this.potencyId ? sourceBuild?.potencies[this.potencyId] || 0 : 0) + (this.potency || 0) * 10);
    return { additive, source: Math.max(0, this.sourceData?.sourceInatePotency || 0) };
  }

  getEffectivePotency(sourceBuild?: Pick<Build, "potencies"> & Partial<Pick<Build, "perks">>) {
    if (typeof this.effectivePotencyOverride === "number" && Number.isFinite(this.effectivePotencyOverride)) {
      return Math.max(0, this.effectivePotencyOverride) * 10;
    }
    const sourcePotency = this.sourceData?.sourceInatePotency || 0;
    const additivePotency = this.potencyId && sourceBuild
      ? sourceBuild.potencies[this.potencyId] || 0
      : 0;
    const directPotency = this.potency || 0;

    const bastion = sourceBuild?.perks?.bastion_bless || 0;
    const multiplier = this.category === "Buff" && this.countsAsBuff !== false && Number.isFinite(bastion) && bastion > 0 ? 1 + 0.1 * bastion : 1;
    return (sourcePotency + (additivePotency / 10) + directPotency) * 10 * multiplier;
  }
}

export class BuffStore {
  static readonly buffCache = new Map<string, Buff>();
  static readonly deBuffCache = new Map<string, Buff>();

  static allCache: readonly Buff[] | null = null;

  constructor() {}

  static get(name?: string | Buff): Buff {
    if (name && typeof name !== "string") return name;

    name = (name || "").trim();
    const id = ItemModule.toID(name);
    return this.getByID(id);
  }

  static lookMap(id: string): Buff | undefined {
    if (this.buffCache.has(id)) {
      return this.buffCache.get(id)!;
    } else if (this.deBuffCache.has(id)) {
      return this.deBuffCache.get(id)!;
    }
  }

  static getByID(id: string): Buff {
    let item = this.lookMap(id);
    if (item) return Object.assign(new Buff(), item) as Buff;

    let Data;
    let cache: Map<string, Buff> = new Map<string, Buff>();

    if (id in buffTable) {
      Data = buffTable[id] as any;
      cache = this.buffCache;
    } else if (id in deBuffTable) {
      Data = deBuffTable[id] as any;
      cache = this.deBuffCache;
    }

    if (!Data) {
      return new Buff({ id });
    }

    item = new Buff({ ...Data });

    item = Object.freeze(item);
    cache.set(id, item);
    return Object.assign(new Buff(), item) as Buff;
  }

  static getAllBuff(): Buff[] {
    const buffs = [];
    for (const id in buffTable) {
      buffs.push(this.getByID(id as string));
    }
    return buffs;
  }

  static getAllDeBuff(): Buff[] {
    const deBuffs = [];
    for (const id in deBuffTable) {
      deBuffs.push(this.getByID(id as string));
    }
    return deBuffs;
  }

  static getByCategory(category: string): Buff[] {
    switch (category) {
      case "Buff":
        return this.getAllBuff();
      case "Debuff":
        return this.getAllDeBuff();
      default:
        return [];
    }
  }

  static all(): readonly Buff[] {
    if (this.allCache) return this.allCache;
    const items = [];

    for (const id in buffTable) {
      items.push(this.getByID(id as string));
    }

     for (const id in deBuffTable) {
       items.push(this.getByID(id as string));
     }

    this.allCache = Object.freeze(items);
    return this.allCache;
  }
}
