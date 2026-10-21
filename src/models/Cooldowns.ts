import { PerkStore } from "./Perk.js";
import { selected, disposition, StatusSnapshot } from "./Conditions.js";

interface CooldownContext extends StatusSnapshot { perks: Record<string, number>; race?: { id: string }; }
export interface CooldownPreview { value: number; rates: Record<string, number>; factors: Record<string, number>; }

/** Reviewed static/selected-state effects. Triggered resets and elapsed cooldown are outside this preview. */
export function calculateCooldown(holder: CooldownContext, base: number | undefined, source: "Rune" | "WeaponArt", abilityId?: string): CooldownPreview | undefined {
  if (base === undefined || !Number.isFinite(base) || base < 0) return undefined;
  const rates: Record<string, number> = {}, factors: Record<string, number> = {};
  if (source === "Rune" && holder.race?.id === "elf") factors.Elf = 0.6;
  if (source === "WeaponArt" && holder.race?.id === "high_elf") factors["High Elf"] = 0.75;
  for (const id of Object.keys(holder.perks).sort()) {
    const amount = holder.perks[id];
    if (!Number.isFinite(amount) || amount <= 0) continue;
    const perk = PerkStore.getByID(id), effect = perk.cooldown;
    if (!effect || !effect.sources.includes(source) || (effect.abilityId && effect.abilityId !== abilityId)) continue;
    if (effect.requiredBuff && !selected(holder, effect.requiredBuff)) continue;
    if (effect.requiredDebuff && !holder.deBuffs?.some(status => status?.id === effect.requiredDebuff)) continue;
    if (effect.requiresBuffsOnly && !disposition(holder).buffsOnly) continue;
    if (effect.ratePerPerk) rates[perk.name] = effect.ratePerPerk * amount;
    if (effect.directBase !== undefined || effect.directPerPerk !== undefined) factors[perk.name] = Math.max(0, (effect.directBase ?? 1) + (effect.directPerPerk || 0) * amount);
  }
  const rate = Object.values(rates).reduce((sum, value) => sum + value, 0);
  const direct = Object.values(factors).reduce((product, value) => product * value, 1);
  const value = Math.round((base / (1 + rate) * direct + Number.EPSILON) * 10000) / 10000;
  return { value, rates, factors };
}
