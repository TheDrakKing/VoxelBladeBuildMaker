import * as ItemModule from "./Item.js";
import { Buffs } from "../data/Buffs.js";
import { Debuffs } from "../data/Debuffs.js";
import { Build } from "./Build.js";

export type BuffDataTable = { [id: string]: Partial<Buff> };

/** Game units: percentage first, then one flat 0.1 regardless of perk count. */
export function applyEndlessDespairPotency(base: number, amount?: number): number {
  return typeof amount === "number" && Number.isFinite(amount) && amount > 0 ? base * (1 + .35 * amount) + .1 : base;
}

/** Provisional DoT rule: combine the documented source/stat curve first, then
 * modify its strength above the fixed base-1 damage. Not an in-game-verified formula. */
export function estimateEndlessDespairDotDamage(combinedDamage: number, amount?: number): number {
  if (!Number.isFinite(combinedDamage) || combinedDamage <= 0 || !Number.isFinite(amount) || !amount || amount < 0) return combinedDamage;
  return 1 + applyEndlessDespairPotency(combinedDamage - 1, amount);
}

const buffTable: BuffDataTable = Buffs;
const deBuffTable: BuffDataTable = Debuffs;

interface PotencyHolder {
  potencies: Build["potencies"];
  perks: Build["perks"];
  target?: PotencyHolder;
  statusOpponent?: PotencyHolder;
}

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
  cooldownRatePerPoint?: Partial<Record<"Rune" | "WeaponArt", number>>;
  exclusiveGroup?: "lighting" | "mount" | "draconic_color";
  scenarioDetails?: string;
  calculationNote?: string;
  /** Optional exclusion for opponent applications. Self-inflicted statuses never qualify. */
  endlessDespairEligible?: boolean;
  /** User's unmodified application duration, before Endless Despair. */
  baseDurationOverride?: number;
  ironSlayerEnhanced?: boolean;
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

  /** Internal potency points after applicant bonuses and reviewed recipient effects. */
  getReceivedPotency(holder: PotencyHolder): number {
    if (this.id === "slow" && (holder.perks.unmoving || 0) > 0) return 3;
    const potency = this.getEffectivePotency(this.getSourceBuild(holder));
    // The override is a final received value; source bonuses and reductions are already included.
    if (typeof this.effectivePotencyOverride === "number" && Number.isFinite(this.effectivePotencyOverride)) return potency;
    const roaring = holder.perks.roaring_heads || 0;
    return (this.id === "weakness" || this.id === "shatter") && Number.isFinite(roaring) && roaring > 0
      ? potency * Math.max(0, 1 - 0.33 * roaring) : potency;
  }

  isEndlessDespairEligible(): boolean {
    return this.category === "Debuff" && this.getAppliedBy() === "opponent" && this.endlessDespairEligible !== false;
  }

  getEndlessDespairAmount(sourceBuild?: Partial<Pick<Build, "perks">>): number {
    const amount = sourceBuild?.perks?.endless_despair || 0;
    return this.isEndlessDespairEligible() && Number.isFinite(amount) && amount > 0 ? amount : 0;
  }

  getDurationPreview(sourceBuild?: Partial<Pick<Build, "perks">>, recipient?: Pick<Build, "buff">) {
    const manual = this.baseDurationOverride;
    const base = typeof manual === "number" && Number.isFinite(manual) && manual >= 0 ? manual :
      typeof this.baseDuration === "number" && Number.isFinite(this.baseDuration) && this.baseDuration >= 0 ? this.baseDuration : undefined;
    const positive = (id: string) => { const value = sourceBuild?.perks?.[id]; return typeof value === "number" && Number.isFinite(value) && value > 0 ? value : 0; };
    const realStatus = this.category === "Debuff" || this.category === "Buff" && this.countsAsBuff !== false;
    const contained = realStatus ? 1 + .33 * positive("contained") : 1;
    const fury = this.id === "rage" ? 1 + .5 * positive("fury") : 1;
    const slowLeak = this.id === "bleed" && this.getAppliedBy() === "opponent" && recipient?.buff?.some(status => status.id === "enemy_mob") ? 1 + .5 * positive("slow_leak") : 1;
    const iron = this.id === "rage" && this.ironSlayerEnhanced ? 2 : 1;
    const multiplier = (1 + 0.75 * this.getEndlessDespairAmount(sourceBuild)) * contained * fury * slowLeak * iron;
    return { base, multiplier, duration: base === undefined ? undefined : Math.round((base * multiplier + Number.EPSILON) * 10000) / 10000, manual: manual !== undefined };
  }

  /** Raw DoT inputs; the ED estimate runs after the source/stat damage combination. */
  getDotPotencies(sourceBuild?: Pick<Build, "potencies"> & Partial<Pick<Build, "perks">>) {
    const override = this.effectivePotencyOverride;
    const additive = typeof override === "number" && Number.isFinite(override)
      ? Math.max(0, override) * 10
      : Math.max(0, (this.potencyId ? sourceBuild?.potencies[this.potencyId] || 0 : 0) + (this.potency || 0) * 10);
    // Keep stored points and source snapshots unchanged; ED is applied after this curve.
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

    const tailwind = this.id === "tailwind" && (sourceBuild?.perks?.tailwind || 0) > 0 ? 0.1 : 0;
    const bastion = sourceBuild?.perks?.bastion_bless || 0;
    const multiplier = this.category === "Buff" && this.countsAsBuff !== false && Number.isFinite(bastion) && bastion > 0 ? 1 + 0.1 * bastion : 1;
    let potency = (sourcePotency + (additivePotency / 10) + directPotency + tailwind) * multiplier;
    if (this.id === "rage" && this.ironSlayerEnhanced) potency += .2;
    const endless = this.potencyId && !this.getDamageInfo ? this.getEndlessDespairAmount(sourceBuild) : 0;
    potency = applyEndlessDespairPotency(potency, endless);
    return potency * 10;
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
