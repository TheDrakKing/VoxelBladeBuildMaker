import type { CriticalEffect } from "./CriticalEffects.js";
import { toPerkID } from "./Identifiers.js";
import * as Item from "./Item.js";
import { Perks } from "../data/Perks.js";
import { Build } from "./Build.js";

export type perkDataTable = { [id: string]: Perk };
const perksTable: perkDataTable = Perks;

export type PerkEventName = "onPerkMod" | "onStatCalculation";
type PerkCalculationEventName = PerkEventName | "onOutputCalculation";
export interface CooldownEffect {
  sources: ("Rune" | "WeaponArt")[];
  ratePerPerk?: number;
  directBase?: number;
  directPerPerk?: number;
  requiredBuff?: string;
  requiredDebuff?: string;
  requiresBuffsOnly?: boolean;
  abilityId?: string;
}
export type SortedPerkEventEntry = {
  perkId: string;
  amount: number;
  perk: Perk;
};


export type PerkSupport = { status: "Implemented" | "Partial" | "Unsupported"; details: string };

export function getPerkSupport(perk: Perk): PerkSupport {
  if (perk.support) return perk.support;
  const implemented = new Set(["human", "cut_down", "vital_strikes", "strong_tides", "extra_layers", "spellshield", "spark", "flowing_crits", "sharp_crits", "golden_crits", "spell_piercer", "spell_slinger"]);
  if (perk.id === "golden_crits") return { status: "Implemented", details: "Crit damage is the expected value using the documented 40% proc chance." };
  if (perk.id === "critical_master") return { status: "Partial", details: "The critical damage bonus is calculated; automatic Guardbreak-triggered perk chains require selected state." };
  if (implemented.has(perk.id)) return { status: "Implemented", details: "Calculated for the selected HP and status conditions." };
  if (["duelist_stance", "saw_stance", "dual_wielding", "locked_and_loaded"].includes(perk.id)) {
    return { status: "Partial", details: "Weapon construction is calculated. Other effects and automatic triggers are not simulated." };
  }
  if (perk.id === "voltaic_body") return { status: "Partial", details: "Charged-hit damage preview. Select Static Charge to choose hit count; activation and cooldown are not simulated." };
  const hasBehavior = Object.values(perk).some((value) => typeof value === "function") ||
    !!(perk.stats || perk.sourcepotencies || perk.baseDamage || perk.critical || perk.cooldown);
  return hasBehavior
    ? { status: "Partial", details: "Some effects are calculated. Trigger timing and the complete interaction rules are not implemented." }
    : { status: "Unsupported", details: "Listed for reference; this perk's effects are not currently calculated." };
}

export class Perk extends Item.events {
  source?: { cardId: string; cardUrl: string };
  critical?: CriticalEffect;
  support?: PerkSupport;
  id: string;
  name: string;
  category?: string;
  description?: string;
  statPriority?: number;
  outputPriority?: number;
  cooldown?: CooldownEffect;
  baseDamage?: number;
  stats?: { [k in Item.stat]?: number };
  /**
   * Perk scaling are only for this perk only if it does damage, not to be added to the total build scaling
   */
  damageScalings?: { [k in Item.scale]?: number };
    /**
   * Perk damageType are only for this perk only if it does damage, not to be added to the total build scaling
   */
  damageTypes?: { [k in Item.damageType]?: number };
  /**
   * For addtive potecny that get applied to the over build, and can be added to soruce potency
   */
  potencies?: { [k in Item.potency]?: number };
  /**
   * source potencies don't get added to the build, they are for exmaple rage run which has base 0.3 potency when actvited
   */
  sourcepotencies?: { [k in Item.potency]?: number };
  /** Innate source potency at the equipped (possibly fractional) perk amount. */
  getSourcePotencies?: (perkAmount: number) => Partial<Record<Item.potency, number>>;
  getPerkDamageInfo?:(this: Build, perkAmount?: number) => baseDamageData | null;


  constructor(data?: any) {
    super()
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


export function getSortedPerkEventEntries(
  perks: { [id: string]: number },
  eventName: PerkCalculationEventName,
): SortedPerkEventEntry[] {
  const entries: SortedPerkEventEntry[] = [];

  for (const [perkId, amount] of Object.entries(perks) as [string, number?][]) {
    if (amount === undefined) continue;

    const perk = PerkStore.getByID(perkId) as Perk &
      Partial<Record<PerkCalculationEventName, Function>>;
    if (!perk[eventName]) continue;

    entries.push({ perkId, amount, perk });
  }

  entries.sort((left, right) => {
    const priority = eventName === "onOutputCalculation" ? "outputPriority" : "statPriority";
    const priorityDiff = (right.perk[priority] ?? 0) - (left.perk[priority] ?? 0);
    if (priorityDiff !== 0) return priorityDiff;

    return left.perk.name.localeCompare(right.perk.name);
  });

  return entries;
}

export class PerkStore {
  static readonly perkCache = new Map<string, Perk>();
  static allCache: readonly Perk[] | null = null;
  static perkNames: readonly string[] = [];

  constructor() {}

  static get(name?: string | Perk): Perk {
    if (name && typeof name !== "string") return name;

    name = (name || "").trim();
    const id = toPerkID(name);
    return this.getByID(id);
  }

  static getByID(id: string): Perk {
    id = toPerkID(id);
    let perk = this.perkCache.get(id);
    if (perk) return Object.assign(new Perk(), perk) as Perk;

    let Data = perksTable[id] as any;

    if (!Data) {
      return new Perk({ id });
    }

    perk = new Perk({ ...Data });

    perk = Object.freeze(perk);
    this.perkCache.set(id, perk);

    return Object.assign(new Perk(), perk) as Perk;
  }

  static all(): readonly Perk[] {
    if (this.allCache) return this.allCache;
    const perks = [];
    const perkNames:string[] = [];
    for (const id in perksTable) {
      let item = this.getByID(id as string);
      perks.push(item);
      perkNames.push(item.name);
    }
    this.allCache = Object.freeze(perks);
    this.perkNames = Object.freeze(perkNames);
    return this.allCache;
  }
}



