import type * as Build from "./Build.js";
import type { Buff } from "./Buffs.js";

/** A selected combat situation, independent of the DOM and of a running fight. */
export interface CombatContext {
  level: number;
  hp: number;
  maxHp: number;
  stats: Build.stats;
  potencies: Build.potencies;
  damageScalings: Build.damageScalings;
  damageTypes: Build.damageTypes;
  perks: Build.perks;
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
  | "onFinalDamageTakenMultiplier";

export interface CombatResult {
  outputs: Build.outputDamage;
  total: Build.damageBreakdown;
  perHit: Build.damageBreakdown;
  hitCount: number;
  modifiers: Build.damageModifications;
  effectiveBoosts: Build.effectiveBoosts;
  totalEffectiveBoost: number;
}
