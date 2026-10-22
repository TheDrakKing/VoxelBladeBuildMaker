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
};
export function finite(value) { return typeof value === "number" && Number.isFinite(value) && value >= 0 ? value : undefined; }
export function cleanMechanicsInputs(value) {
    const result = {};
    if (!value || typeof value !== "object")
        return result;
    for (const key of Object.keys(previewInputs)) {
        const entry = finite(value[key]);
        if (entry !== undefined)
            result[key] = entry;
    }
    return result;
}
export function input(holder, key) { return finite(holder.mechanicsInputs?.[key]); }
export function row(label, value, unit) {
    return { label, value: value === undefined ? "Enter the corresponding value above" : typeof value === "number" ? Math.round((value + Number.EPSILON) * 10000) / 10000 : value, unit: value === undefined ? undefined : unit };
}
export function chance(value) { return Math.max(0, Math.min(100, value)); }
export function healingPreview(holder, base) {
    const amount = Math.max(0, finite(holder.perks.heal_boost) ?? 0);
    const critical = Math.max(0, finite(holder.perks.critical_healing) ?? 0);
    const normal = base * (1 + 0.1 * amount);
    const rate = critical > 0 ? chance(20 + (holder.stats.HolyBoost || 0) / 5) / 100 : 0;
    const crit = normal * (1 + 0.165 * critical);
    return { normal, crit, average: normal * (1 - rate) + crit * rate, chance: rate };
}
/** Scoped healing, not a complete healing engine: no undocumented level/recipient modifiers. */
export function healRows(holder, label, base, scalings = {}) {
    if (base === undefined)
        return [row(label, undefined)];
    const scale = Object.entries(scalings).reduce((total, [name, coefficient]) => total + (holder.stats[(name + "Boost")] || 0) * (coefficient || 0) / 100, 1);
    const result = healingPreview(holder, Math.max(0, base * scale));
    return [row(label + " · base", base), row(label + " · scaled + Heal Boost", result.normal), row(label + " · critical", result.crit), row(label + " · expected", result.average)];
}
export function getMechanicsPreview(holder) {
    const fields = new Set();
    const groups = [];
    for (const [id, amount] of Object.entries(holder.perks)) {
        if (!Number.isFinite(amount) || amount <= 0)
            continue;
        const perk = PerkStore.getByID(id);
        if (!perk.getMechanicsPreview)
            continue;
        for (const field of perk.previewInputs || [])
            fields.add(field);
        groups.push({ id, name: perk.name, rows: perk.getMechanicsPreview.call(holder, amount) });
    }
    return { fields: [...fields], groups };
}
