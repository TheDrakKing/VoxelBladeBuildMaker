import { PerkStore } from "./Perk.js";
import { selected, disposition } from "./Conditions.js";
/** Reviewed static/selected-state effects. Triggered resets and elapsed cooldown are outside this preview. */
export function calculateCooldown(holder, base, source, abilityId) {
    if (base === undefined || !Number.isFinite(base) || base < 0)
        return undefined;
    const originalBase = base;
    const rates = {}, factors = {}, additions = {};
    if (source === "Rune" && holder.race?.id === "elf")
        factors.Elf = 0.6;
    if (source === "WeaponArt" && holder.race?.id === "high_elf")
        factors["High Elf"] = 0.75;
    for (const id of Object.keys(holder.perks).sort()) {
        const amount = holder.perks[id];
        if (!Number.isFinite(amount) || amount <= 0)
            continue;
        const perk = PerkStore.getByID(id), effect = perk.cooldown;
        if (!effect || !effect.sources.includes(source) || (effect.abilityId && effect.abilityId !== abilityId))
            continue;
        if (effect.requiredBuff && !selected(holder, effect.requiredBuff))
            continue;
        if (effect.requiredDebuff && !holder.deBuffs?.some(status => status?.id === effect.requiredDebuff))
            continue;
        if (effect.requiresBuffsOnly && !disposition(holder).buffsOnly)
            continue;
        if (effect.overrideBase !== undefined)
            base = effect.overrideBase;
        if (effect.additionalBase)
            additions[perk.name] = effect.additionalBase;
        if (effect.ratePerPerk)
            rates[perk.name] = effect.ratePerPerk * amount;
        if (effect.directBase !== undefined || effect.directPerPerk !== undefined)
            factors[perk.name] = Math.max(0, (effect.directBase ?? 1) + (effect.directPerPerk || 0) * amount);
    }
    for (const status of holder.buff || []) {
        const perPoint = status.cooldownRatePerPoint?.[source];
        if (perPoint)
            rates[status.name || status.id] = perPoint * status.getReceivedPotency(holder);
    }
    const adjustedBase = base + Object.values(additions).reduce((sum, value) => sum + value, 0);
    const rate = Object.values(rates).reduce((sum, value) => sum + value, 0);
    const direct = Object.values(factors).reduce((product, value) => product * value, 1);
    const value = Math.round((adjustedBase / (1 + rate) * direct + Number.EPSILON) * 10000) / 10000;
    return { value, rates, factors, ...(Object.keys(additions).length ? { additions } : {}), ...(base !== originalBase ? { baseOverride: base } : {}) };
}
