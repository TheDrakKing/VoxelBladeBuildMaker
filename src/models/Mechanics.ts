import type { Build } from "./Build.js";
import { PerkStore } from "./Perk.js";

export const previewInputs = {
  baseHeal: "Base healing (before Heal Boost / critical healing)",
  damageDealt: "Damage dealt by one eligible hit / tick",
  eligibleHitDamage: "Hit damage before bonus multipliers / output above 1",
  preReductionDamage: "Self-hit damage before defenses / reductions (not a DoT)",
  healingReceived: "Healing received by you (for summon transfer)",
  summonBaseHP: "Summon's natural base HP",
  remainingRune: "Current remaining Rune cooldown (seconds)",
  remainingWeaponArt: "Current remaining Weapon Art cooldown (seconds)",
  failedResets: "Consecutive failed Magic Surge activations",
  reflectedPotency: "Original reflected debuff potency",
  preOutputHitDamage: "Trigger hit damage after source scaling, before post-output modifiers",
  poisonTickDamage: "One Poison tick's damage (for Infection spread)",
  storedCount: "Current stored arrows / beenades / sporelings / charges",
  baseSpiritGain: "Base spirit charge gained by one hit (before attack speed)",
  channelSeconds: "Additional channel time (seconds)",
} as const;
export type PreviewInput = keyof typeof previewInputs;
export type MechanicsInputs = Partial<Record<PreviewInput, number>>;
export type MechanicsRow = { label: string; value: number | string; unit?: string };
export function finite(value: unknown): number | undefined { return typeof value === "number" && Number.isFinite(value) && value >= 0 ? value : undefined; }
export function cleanMechanicsInputs(value: unknown): MechanicsInputs {
  const result: MechanicsInputs = {};
  if (!value || typeof value !== "object") return result;
  for (const key of Object.keys(previewInputs) as PreviewInput[]) { const entry = finite((value as MechanicsInputs)[key]); if (entry !== undefined) result[key] = entry; }
  return result;
}
export function input(holder: Pick<Build, "mechanicsInputs">, key: PreviewInput): number | undefined { return finite(holder.mechanicsInputs?.[key]); }
export function row(label: string, value: number | string | undefined, unit?: string): MechanicsRow {
  return { label, value: value === undefined ? "Enter the corresponding value above" : typeof value === "number" ? Math.round((value + Number.EPSILON) * 10000) / 10000 : value, unit: value === undefined ? undefined : unit };
}
export function chance(value: number) { return Math.max(0, Math.min(100, value)); }
export function healingPreview(holder: Pick<Build, "perks" | "stats">, base: number) {
  const amount = Math.max(0, finite(holder.perks.heal_boost) ?? 0);
  const critical = Math.max(0, finite(holder.perks.critical_healing) ?? 0);
  const normal = base * (1 + 0.1 * amount);
  const rate = critical > 0 ? chance(20 + (holder.stats.HolyBoost || 0) / 5) / 100 : 0;
  const crit = normal * (1 + 0.165 * critical);
  return { normal, crit, average: normal * (1 - rate) + crit * rate, chance: rate };
}
/** Scoped healing, not a complete healing engine: no undocumented level/recipient modifiers. */
export function healRows(holder: Pick<Build, "perks" | "stats">, label: string, base: number | undefined, scalings: Partial<Record<string, number>> = {}): MechanicsRow[] {
  if (base === undefined) return [row(label, undefined)];
  const scale = Object.entries(scalings).reduce((total, [name, coefficient]) => total + (holder.stats[(name + "Boost") as keyof Build["stats"]] || 0) * (coefficient || 0) / 100, 1);
  const result = healingPreview(holder, Math.max(0, base * scale));
  return [row(label + " · base", base), row(label + " · scaled + Heal Boost", result.normal), row(label + " · critical", result.crit), row(label + " · expected", result.average)];
}
export function getMechanicsPreview(holder: Build) {
  const fields = new Set<PreviewInput>();
  const groups: { id: string; name: string; rows: MechanicsRow[] }[] = [];
  for (const [id, amount] of Object.entries(holder.perks)) {
    if (!Number.isFinite(amount) || amount <= 0) continue;
    const perk = PerkStore.getByID(id);
    if (!perk.getMechanicsPreview) continue;
    for (const field of perk.previewInputs || []) fields.add(field);
    groups.push({ id, name: perk.name, rows: perk.getMechanicsPreview.call(holder, amount) });
  }
  return { fields: [...fields], groups };
}
