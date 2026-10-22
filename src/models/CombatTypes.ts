import type * as Build from "./Build.js";
import type { Buff } from "./Buffs.js";

/** A selected combat situation, independent of the DOM and of a running fight. */
export interface CombatContext {
  race?: { id: string };
  isSelfDamage?: boolean;
  weaponFamily?: string;
  level: number;
  hp: number;
  maxHp: number;
  stats: Build.stats;
  potencies: Build.potencies;
  damageScalings: Build.damageScalings;
  damageTypes: Build.damageTypes;
  perks: Build.perks;
  /** Selected proc activations for this hit, resolved on cloned state. */
  activeProcs?: string[];
  buff: Buff[];
  deBuffs: Buff[];
  target?: CombatContext;
  /** The other combatant remains the applicant of received statuses during self-inflicted damage. */
  statusOpponent?: CombatContext;
  damageModifications: Build.damageModifications;
  effectiveBoosts: Build.effectiveBoosts;
  totEffBoost: number;
}

export type CombatEventName =
  | "onArmorPenCalculation" | "onArmorModified"
  | "onDmgBonusMultiplier" | "onDmgReducedMultiplier"
  | "onSpecificDmgBonusMultiplier" | "onSpecificDmgReducedMultiplier"
  | "onCritRateCalculation" | "onCritDamageCalculation"
  | "onIncreaseSpecificDmgTaken" | "onIncreaseDmgTaken"
  | "onDecreaseSpecificDmgBonusMultiplier" | "onDecreaseDmgBonusMultiplier"
  | "onFinalDamageTakenMultiplier" | "onFlatDamageTakenReduction";

export interface StatusConsumption { statusId: string; perkId: string; hit: number; holder?: "attacker" | "target"; }

export interface CombatResult {
  statusConsumptions?: StatusConsumption[];
  outputs: Build.outputDamage;
  total: Build.damageBreakdown;
  perHit: Build.damageBreakdown;
  hitCount: number;
  modifiers: Build.damageModifications;
  effectiveBoosts: Build.effectiveBoosts;
  totalEffectiveBoost: number;
}
