import type { Build } from "./Build.js";
import { PerkStore } from "./Perk.js";

/** Separate from HP damage: underlying attack poise values are not documented. */
export function getPoisePreview(attacker: Pick<Build, "perks">, target: Pick<Build, "deBuffs">) {
  let multiplier = 1;
  const effects: { name: string; active: boolean; bonus: number; requiredDebuff?: string; placeholder: boolean }[] = [];
  for (const [id, amount] of Object.entries(attacker.perks)) {
    if (!Number.isFinite(amount) || amount <= 0) continue;
    const perk = PerkStore.getByID(id), rule = perk.poise;
    if (!rule) continue;
    const active = !rule.requiredTargetDebuff || !!target.deBuffs?.some(status => status.id === rule.requiredTargetDebuff);
    const bonus = active ? rule.bonusPerPerk * amount : 0;
    if (active) multiplier *= 1 + bonus;
    effects.push({ name: perk.name, active, bonus, requiredDebuff: rule.requiredTargetDebuff, placeholder: !!rule.placeholder });
  }
  return { multiplier: Math.round((multiplier + Number.EPSILON) * 10000) / 10000, effects };
}
