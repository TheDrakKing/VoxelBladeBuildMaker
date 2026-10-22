/** Transform the copied armor item before adding this enchant's own stats/perks. */
export function applyEnchantmentTransforms(item, enchantment, baseStats, protectedPerks) {
    for (const transform of enchantment.enchantmentTransforms || []) {
        if (transform.scope === "perks") {
            for (const id of Object.keys(item.perks || {})) {
                if (transform.factor === 0)
                    delete item.perks[id];
                else
                    item.perks[id] *= transform.factor;
            }
            for (const id of Object.keys(protectedPerks)) {
                if (transform.factor === 0)
                    delete protectedPerks[id];
                else
                    protectedPerks[id] *= transform.factor;
            }
            continue;
        }
        for (const [key, value] of Object.entries(item.stats || {})) {
            const defense = key.endsWith("Defense");
            const scope = transform.scope;
            if (scope === "positive_base_defense_stats") {
                const base = baseStats?.[key] || 0;
                if (defense && base > 0)
                    item.stats[key] = round(value + base * (transform.factor - 1));
                continue;
            }
            const applies = scope === "overall_stats" || scope === "stat" && key === transform.stat ||
                scope === "positive_stats" && value > 0 || scope === "negative_stats" && value < 0 ||
                scope === "defense_boosts" && defense || scope === "positive_defenses" && defense && value > 0 ||
                scope === "negative_defenses" && defense && value < 0;
            if (applies)
                item.stats[key] = round(value * transform.factor);
        }
    }
}
function round(value) { return Math.round((value + Number.EPSILON) * 10000) / 10000; }
