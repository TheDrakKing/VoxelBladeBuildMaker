import { PerkStore } from "./Perk.js";
export function collectCriticalEffects(holder, packet) {
    const result = { chance: 0, damage: 0, armorPen: 0, hitMultiplier: 1, bypassArmor: false, replacesDexterityChance: false };
    if (packet.canCrit === false)
        return result;
    for (const [id, amount] of Object.entries(holder.perks)) {
        if (!amount || amount < 0 || !Number.isFinite(amount))
            continue;
        const perk = PerkStore.getByID(id);
        const effect = perk.critical;
        if (!effect || (effect.sources && !effect.sources.includes(packet.sourceType)))
            continue;
        if (effect.targetDebuff && !holder.target?.deBuffs.some(status => status.id === effect.targetDebuff))
            continue;
        if (effect.requiredBuff && !holder.buff.some(status => status.id === effect.requiredBuff))
            continue;
        result.hitMultiplier *= effect.fixedHitMultiplier ?? 1;
        if (effect.fixedHitMultiplier)
            holder.damageModifications.crit_mods[`${perk.name} critical multiplier`] = effect.fixedHitMultiplier;
        let chance = 0, damage = (effect.damagePerPerk || 0) * amount * (effect.procChance ?? 1);
        for (const [statId, coefficient] of Object.entries(effect.chancePerBoost || {})) {
            chance += (holder.stats[statId] || 0) * coefficient * amount;
        }
        for (const [statId, coefficient] of Object.entries(effect.damagePerBoost || {})) {
            damage += (holder.stats[statId] || 0) * coefficient * amount;
        }
        result.chance += chance;
        result.replacesDexterityChance || (result.replacesDexterityChance = !!effect.replacesDexterityChance);
        result.damage += damage;
        result.armorPen += (effect.armorPenPerPerk || 0) * amount;
        result.hitMultiplier *= Math.max(0, 1 + (effect.hitDamagePerPerk || 0) * amount);
        result.bypassArmor || (result.bypassArmor = !!effect.bypassArmor && amount > 0);
        if (chance)
            holder.damageModifications.crit_mods[`${perk.name} chance`] = chance;
        if (damage)
            holder.damageModifications.crit_mods[`${perk.name} damage`] = damage;
    }
    return result;
}
