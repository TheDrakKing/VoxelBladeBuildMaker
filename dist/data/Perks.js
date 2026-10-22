import { selected, lighting, mount, disposition, isMagicDamageType } from "../models/Conditions.js";
import { row, input, chance, healRows } from "../models/Mechanics.js";
import { Races } from "./Races.js";
function hasDebuff(build, debuffId) {
    return !!build?.deBuffs?.find((debuff) => debuff?.id === debuffId);
}
function getDebuffCount(build) {
    return new Set((build?.deBuffs || []).filter(Boolean).map((status) => status.id).filter(Boolean)).size;
}
function isProcHit(args) {
    const packet = args?.baseDamageData;
    return !!packet && packet.sourceType !== "Status" && !packet.tags?.includes("DoT") && packet.procCoefficient !== 0;
}
function activeBuffCount(build) {
    return new Set((build.buff || []).filter(status => status && status.category === "Buff" && status.countsAsBuff !== false).map(status => status.id)).size;
}
function hasBuff(build, id) {
    return !!build?.buff?.some((status) => status?.id === id);
}
function addRagePotency(build, amount) {
    if (!amount || amount < 0)
        return;
    // One additive potency point corresponds to 0.1 effective potency.
    build.potencies.ragepotency = Math.round(((build.potencies.ragepotency || 0) + amount) * 10000) / 10000;
}
function addStat(build, statId, amount) {
    if (!amount)
        return;
    const previousValue = build.stats[statId] || 0;
    build.stats[statId] = Math.round((previousValue + amount + Number.EPSILON) * 10000) / 10000;
}
function getNegativeStatValue(value) {
    if (!value || value >= 0)
        return 0;
    return Math.abs(value);
}
function isRuneOrWeaponArtHit(args) {
    const sourceType = args?.baseDamageData?.sourceType;
    return sourceType === "Rune" || sourceType === "WeaponArt";
}
function normalizePerkId(value) {
    return value.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
}
function normalizePotencyId(value) {
    return value.toLowerCase().replace(/[^a-z0-9]+/g, "");
}
function getGuildProtectedPerkAmount(build, perkId) {
    const promotion = build.guild?.promotions?.[build.guildPromotion];
    if (!promotion?.perks)
        return 0;
    let amount = 0;
    for (const [key, value] of Object.entries(promotion.perks)) {
        if (value === undefined)
            continue;
        if (normalizePerkId(key) !== perkId)
            continue;
        amount += value;
    }
    return amount;
}
function getEnchantmentProtectedPerkAmount(build, perkId) {
    if (build.enchantmentProtectedPerks)
        return build.enchantmentProtectedPerks[perkId] || 0;
    let amount = 0;
    for (const enchantments of Object.values(build.enchantments || {})) {
        if (!enchantments)
            continue;
        for (const enchantment of enchantments) {
            if (!enchantment?.perks)
                continue;
            for (const [key, value] of Object.entries(enchantment.perks)) {
                if (value === undefined)
                    continue;
                if (normalizePerkId(key) !== perkId)
                    continue;
                amount += value;
            }
        }
    }
    return amount;
}
function getProtectedPerkAmount(build, perkId) {
    return getGuildProtectedPerkAmount(build, perkId) +
        getEnchantmentProtectedPerkAmount(build, perkId);
}
function getEnchantmentProtectedPotencyAmount(build, potencyId) {
    let amount = 0;
    for (const enchantments of Object.values(build.enchantments || {})) {
        if (!enchantments)
            continue;
        for (const enchantment of enchantments) {
            if (!enchantment?.potencies)
                continue;
            for (const [key, value] of Object.entries(enchantment.potencies)) {
                if (value === undefined)
                    continue;
                if (normalizePotencyId(key) !== potencyId)
                    continue;
                amount += value;
            }
        }
    }
    return amount;
}
function mutatePerkAmounts(build, perkAmount, ignore) {
    const ignoredIds = new Set(ignore.map(normalizePerkId));
    const perkEntries = Object.entries(build.perks || {});
    const multiplier = 0.1 * perkAmount;
    for (const [rawPerkId, totalAmount] of perkEntries) {
        if (totalAmount === undefined)
            continue;
        const perkId = normalizePerkId(rawPerkId);
        if (ignoredIds.has(perkId))
            continue;
        const protectedAmount = getProtectedPerkAmount(build, perkId);
        const eligibleAmount = totalAmount - protectedAmount;
        if (eligibleAmount <= 0)
            continue;
        build.perks[rawPerkId] = Math.round((totalAmount + eligibleAmount * multiplier) * 10000) / 10000;
    }
}
function mutatePotencyAmounts(build, perkAmount, ignore) {
    // DoT potency source cards exclude direct gear points from Cursed/Perk Effectiveness.
    // Source perk amounts are increased separately before their stat contributions run.
    const ignoredIds = new Set([...ignore.map(normalizePotencyId), "bleedpotency", "burnpotency", "poisonpotency"]);
    const potencyEntries = Object.entries(build.potencies || {});
    const multiplier = 0.1 * perkAmount;
    for (const [rawPotencyId, totalAmount] of potencyEntries) {
        if (totalAmount === undefined)
            continue;
        const potencyId = normalizePotencyId(rawPotencyId);
        if (ignoredIds.has(potencyId))
            continue;
        const protectedAmount = getEnchantmentProtectedPotencyAmount(build, potencyId);
        const eligibleAmount = totalAmount - protectedAmount;
        if (eligibleAmount <= 0)
            continue;
        build.potencies[rawPotencyId] =
            Math.round((totalAmount + eligibleAmount * multiplier) * 10000) / 10000;
    }
}
const offensiveBoostStats = ["MagicBoost", "EarthBoost", "FireBoost", "WaterBoost", "HolyBoost", "HexBoost", "AirBoost", "DexterityBoost", "SummonBoost"];
function positivePerk(amount) {
    return typeof amount === "number" && Number.isFinite(amount) && amount > 0;
}
function roundPerkValue(value) { return Math.round((value + Number.EPSILON) * 10000) / 10000; }
function healthRatio(build) {
    return build && Number.isFinite(build.hp) && Number.isFinite(build.maxHp) && build.maxHp > 0
        ? Math.max(0, Math.min(1, build.hp / build.maxHp)) : undefined;
}
function selectedBuffPotency(build, id) {
    const status = build.buff?.find(buff => buff?.id === id);
    return status ? Math.max(0, status.getEffectivePotency(status.getSourceBuild(build)) / 10) : 0;
}
function isDirectPacket(args) {
    return !!args?.baseDamageData && args.baseDamageData.sourceType !== "Status" && !args.baseDamageData.tags?.includes("DoT");
}
function addOutput(holder, type, amount) {
    holder.damageTypes[type] = roundPerkValue((holder.damageTypes[type] || 0) + amount);
}
function addPotency(build, id, amount) {
    build.potencies[id] = roundPerkValue((build.potencies[id] || 0) + amount);
}
function berserkingFamily(family) { return !!family && ["unbalanced_sword", "dual_unbalanced_swords", "great_spear"].includes(family); }
function isWeaponSwing(args) { return args?.baseDamageData?.sourceType === "Weapon" && ["M1", "M2"].includes(args.baseDamageData.sourceDamageType); }
function finisherProcNumber(build) { const value = build.buff?.find(status => status.id === "finisher_proc_number")?.stacks; return value !== undefined && Number.isFinite(value) ? Math.max(1, Math.floor(value)) : 1; }
function isFinisher(args) { return !!args?.baseDamageData?.tags?.includes("Finisher"); }
function activation(id, damage, type = "Perk", procCoefficient) {
    return { source: id, damage, hitAmount: 1, sourceType: type, sourceDamageType: type, procCoefficient };
}
function diminishedTenacity(value) {
    if (!Number.isFinite(value) || value <= 0)
        return 0;
    const whole = Math.floor(value);
    // Euler-Maclaurin keeps extreme manually entered values bounded in work, without a stat cap.
    let sum = whole > 1000 ? Math.log(whole) + 0.5772156649015329 + 1 / (2 * whole) - 1 / (12 * whole * whole) : 0;
    if (whole <= 1000)
        for (let k = 1; k <= whole; k++)
            sum += 1 / k;
    return sum + (value - whole) / (whole + 1);
}
function draconicColor(build) {
    if (build.race?.id !== "dragon_blooded")
        return "Physical";
    const colors = ["Fire", "Water", "Holy", "Hex", "Earth", "Air", "Physical"];
    const chosen = colors.filter(color => selected(build, "draconic_color_" + color.toLowerCase()));
    return chosen.length === 1 ? chosen[0] : undefined;
}
function piercerFamily(family) { return !!family && ["onehand_sword", "spear", "dagger", "fist", "rapier"].includes(family); }
export const Perks = {
    /** Race Perks Here */
    human: {
        id: "human",
        name: "Human",
        category: "Race",
        description: Races.human.racepassive,
        onDmgBonusMultiplier(perkAmount) {
            if (!perkAmount || this.maxHp <= 0 || this.hp / this.maxHp >= 0.5)
                return null;
            return 0.2;
        },
        onFinalDamageTakenMultiplier(perkAmount) {
            if (!perkAmount || this.maxHp <= 0 || this.hp / this.maxHp >= 0.5)
                return null;
            return 0.8;
        },
        support: { "status": "Implemented", "details": "Below 50% HP, outgoing damage gains 20% and incoming damage gets a direct x0.8 multiplier. The boundary itself does not qualify." },
        source: { "cardId": "69214b9731723704c1eda160", "cardUrl": "https://trello.com/c/K6A7nUIn" },
    },
    half_ork: {
        id: "half_ork",
        name: "Half-Ork",
        category: "",
        description: Races.half_ork.racepassive,
        support: { "status": "Implemented", "details": "Race stats grant a fixed 10 Armor Penetration; True damage does not benefit from penetration." },
        source: { "cardId": "69214b9731723704c1eda162", "cardUrl": "https://trello.com/c/H21hd8fF" },
    },
    elf: {
        id: "elf",
        name: "Elf",
        category: "",
        description: Races.elf.racepassive,
        source: { "cardId": "69214b9731723704c1eda164", "cardUrl": "https://trello.com/c/k9Bk1WcF" },
        support: { "status": "Implemented", "details": "Rune cooldown has a direct x0.6 race factor. The reviewed cooldown preview also includes explicitly reviewed perk modifiers; cast timing and triggered resets are not simulated." }
    },
    dark_elf: {
        id: "dark_elf",
        name: "Dark Elf",
        category: "",
        description: Races.dark_elf.racepassive,
        sourcepotencies: { shatterpotency: 0.2, bleedpotency: 0.2, burnpotency: 0.2, poisonpotency: 0.2 },
        support: { "status": "Partial", "details": "Select the result manually after an 8% random-debuff proc. Armor Break and Bleed/Burn/Poison have documented 0.2 source potency; Weakness potency is unspecified. No random rolls or automatic applications." },
        source: { "cardId": "69214b9731723704c1eda166", "cardUrl": "https://trello.com/c/W16ggAzA" },
    },
    dragon: {
        id: "dragon",
        name: "Dragon Blooded",
        category: "",
        description: Races.dragon.racepassive,
        support: { "status": "Implemented", "details": "Race stats grant 50 Warding, 10 Protection, and 100 Heat/Cold Resistance. These are fixed race bonuses." },
        source: { "cardId": "69214b9731723704c1eda168", "cardUrl": "https://trello.com/c/sv8XLjVw" },
    },
    ork: {
        id: "ork",
        name: "Ork",
        category: "",
        description: Races.ork.racepassive,
        statPriority: 110,
        onStatCalculation(perkAmount) {
            if (!perkAmount || perkAmount <= 0)
                return;
            this.stats.Tenacity = Math.round(((this.stats.Tenacity || 0) + 0.1 * activeBuffCount(this)) * 10000) / 10000;
        },
        onArmorPenCalculation(perkAmount, args) {
            return perkAmount && perkAmount > 0 && args?.baseDamageData?.sourceType === "WeaponArt" ? 10 : null;
        },
        support: { "status": "Implemented", "details": "Fixed 10 WeaponArt-only penetration, 0.2 base Tenacity, and 0.1 Tenacity per distinct selected game buff. Manual proc selectors and the Static Charge counter do not count as buffs." },
        source: { "cardId": "69214b9731723704c1eda16a", "cardUrl": "https://trello.com/c/ufhlTnQg" },
    },
    high_elf: {
        id: "high_elf",
        name: "High Elf",
        category: "",
        description: Races.high_elf.racepassive,
        source: { "cardId": "69214b9731723704c1eda16c", "cardUrl": "https://trello.com/c/VJuStVeo" },
        support: { "status": "Implemented", "details": "Weapon Art cooldown has a direct x0.75 race factor. The reviewed cooldown preview also includes explicitly reviewed perk modifiers; cast timing and triggered resets are not simulated." }
    },
    arborian: {
        id: "arborian",
        name: "Arborian",
        category: "",
        description: Races.arborian.racepassive,
        support: { "status": "Partial", "details": "Race stats grant -50 Fire Defense and +15 Protection. Sunlight regeneration, Entangle chance/damage/poise, and guild interactions are not simulated." },
        source: { "cardId": "69214b9731723704c1eda16e", "cardUrl": "https://trello.com/c/xd5qLFxt" },
    },
    kitsune: {
        id: "kitsune",
        name: "Kitsune",
        category: "",
        description: Races.kitsune.racepassive,
        support: { "status": "Implemented", "details": "Race stats grant +2 Jump Boost, +10 Movement Speed, and a flat +0.1 attack speed after converting percentage attack-speed points to their numeric bonus." },
        source: { "cardId": "69214b9731723704c1eda170", "cardUrl": "https://trello.com/c/Nuv9nzVj" },
    },
    bunikin: {
        id: "bunikin",
        name: "Bunikin",
        category: "",
        description: Races.bunikin.racepassive,
        support: { "status": "Partial", "details": "Race stats grant +5 Jump Boost. Select Guaranteed Crit to preview a post-dodge hit. The dodge-chance formula is unverified, and automatic dodging/status consumption are not simulated." },
        source: { "cardId": "69214b9731723704c1edaa58", "cardUrl": "https://trello.com/c/WmcRb815" },
    },
    /** Guild only Perks here */
    /** Other Perks */
    ferocious: {
        id: "ferocious",
        name: "Ferocious",
        category: "",
        description: "Tenacity increases damage dealt.",
        onDmgBonusMultiplier(amount) { return positivePerk(amount) ? 0.155 * amount * diminishedTenacity(this.stats.Tenacity || 0) : null; },
    },
    cursed: {
        id: "cursed",
        name: "Cursed",
        category: "Perk",
        description: "All perk potency is increased. You also gain the ability to absorb binded corruptions by destroying them in your inventory.",
        onPerkMod(perkAmount) {
            if (!perkAmount)
                return;
            const ignore = ["cursed", "perk_effectiveness", "minion_absorption", "heal_boost", "lifesteal"];
            mutatePerkAmounts(this, perkAmount, ignore);
            mutatePotencyAmounts(this, perkAmount, ignore);
        },
        "source": {
            "cardId": "69214b9731723704c1eda48a",
            "cardUrl": "https://trello.com/c/8dEVh9Lg"
        },
    },
    perk_effectiveness: {
        id: "perk_effectiveness",
        name: "Perk Effectiveness",
        category: "Perk",
        description: "Increases the potency of most perks.",
        onPerkMod(perkAmount) {
            if (!perkAmount)
                return;
            const ignore = ["cursed", "perk_effectiveness", "minion_absorption", "heal_boost", "lifesteal"];
            mutatePerkAmounts(this, perkAmount, ignore);
            mutatePotencyAmounts(this, perkAmount, ignore);
        },
        "source": {
            "cardId": "69214b9731723704c1edaaa4",
            "cardUrl": "https://trello.com/c/SezUllD8"
        },
    },
    potion_chugger: {
        previewInputs: ["baseHeal"],
        getMechanicsPreview(amount) { const base = input(this, "baseHeal"); return [row("Potion effectiveness", 1 + .1 * amount, "x"), row("Entered potion healing before other modifiers", base === undefined ? undefined : base * (1 + .1 * amount)), row("Exclusion", "Does not affect Holy Substance; potion duration / drinking speed not quantified")]; },
        support: { "status": "Partial", "details": "Displays +10% potion effectiveness per perk and transforms entered potion base healing by that factor. The same factor can be used for a potion's base buff/debuff potency; it is not incorrectly added to all gear potency. Holy Substance is excluded. Drinking-speed and duration formulas, consumable inventory, and automatic potion status application are held." },
        id: "potion_chugger",
        name: "Potion Chugger",
        category: "",
        description: "Increases the speed at which you drink potions, and increases their effectiveness.",
        "source": {
            "cardId": "69214b9731723704c1eda354",
            "cardUrl": "https://trello.com/c/IRk76Iyz"
        },
    },
    rider: {
        id: "rider",
        name: "Rider",
        category: "",
        description: "Deal bonus damage when mounted and take reduced stun.",
        onDmgBonusMultiplier(amount) {
            return positivePerk(amount) && mount(this) !== undefined ? 0.2 * amount : null;
        },
        support: { "status": "Partial", "details": "Select Mounted or Mounted: Glacial Snapper for 20% damage per perk. Stun resistance has no verified coefficient and is not inferred." },
        "source": {
            "cardId": "69214b9731723704c1edac12",
            "cardUrl": "https://trello.com/c/iEoLKdcK"
        }
    },
    berserkingstrength: {
        id: "berserkingstrength",
        name: "Berserking Strength",
        category: "",
        description: "Allows you to wield the most unyieldy of weapons with greater ease.",
        "source": {
            "cardId": "69214b9731723704c1eda3dc",
            "cardUrl": "https://trello.com/c/rRhFyA3j"
        },
        attackSpeedFactor(amount) { return positivePerk(amount) && berserkingFamily(this.getWeaponConstructionData()?.weaponFamily) ? 1 + Math.sqrt(amount / 10) / 1.58 : 1; },
        onDmgBonusMultiplier(amount, args) { return positivePerk(amount) && berserkingFamily(this.weaponFamily) && isWeaponSwing(args) ? 0.1 * amount : null; },
        support: { "status": "Partial", "details": "For resolved Unbalanced Sword, Dual Unbalanced Swords, or Great Spear only: attack speed x (1 + sqrt(perk amount / 10) / 1.58), and weapon M1/M2 damage +10% per perk. Speed factor follows percentage-to-flat conversion and Kitsune's +0.1 as a builder ordering convention; other packet families are excluded." }
    },
    blood_thirsty: {
        id: "blood_thirsty",
        name: "Blood Thirsty",
        category: "Perk",
        description: "If you hit a bleeding opponent bleeding by you remove the bleed, deal bonus damage, and heal. Grants bleed potency.",
        // One stored potency point (+0.1 displayed) per perk, per the user's game value.
        onStatCalculation(amount) { if (positivePerk(amount))
            addPotency(this, "bleedpotency", amount); },
        onDmgBonusMultiplier(perkAmount) {
            if (!perkAmount || perkAmount <= 0 || !this.activeProcs?.includes("blood_thirsty"))
                return null;
            return 0.2 * perkAmount;
        },
        support: { "status": "Partial", "details": "Adds one stored Bleed potency point (+0.1 displayed) per perk using the user's game value; Trello names the bonus without an amount. Select Blood Thirsty Proc: Hemorrhage applies first per the user's in-game test, then attacker-owned Bleed is consumed and Blood Thirsty grants 20% damage per perk. Other modeled Bleed readers and Curse Rip see remaining debuffs; their ordering is unchanged pending further game tests. Healing and automatic triggers are not calculated." },
        "source": {
            "cardId": "69214b9731723704c1eda402",
            "cardUrl": "https://trello.com/c/feVgtQT7"
        },
    },
    shielding_gong: {
        id: "shielding_gong",
        name: "Shielding Gong",
        category: "",
        description: "Using a finisher that hits a target while allies are nearby create a burst that grants reinforce to nearby allies. Additionally having reinforce grants knockback resistance.",
        getSourcePotencies(amount) { return { reinforcepotency: 0.1 * amount }; },
        support: { "status": "Partial", "details": "Offers 0.1 * perk amount Reinforce potency after a finisher with nearby allies. Ally range, automatic application, knockback resistance, and duration are not simulated." },
        "source": {
            "cardId": "69214b9831723704c1edadc2",
            "cardUrl": "https://trello.com/c/HwIUTqNd"
        }
    },
    barbskin: {
        id: "barbskin",
        name: "Barbskin",
        category: "",
        description: "Take heavily reduced damage from Bleed and gain Damage Reduction during so. Inflicting Bleed will cause yourself to Bleed for 5 seconds. Grants Bleed potency",
        onDmgReducedMultiplier(perkAmount) {
            return perkAmount && perkAmount > 0 && hasDebuff(this, "bleed") ? 0.2 * perkAmount : null;
        },
        support: { "status": "Partial", "details": "General damage reduction while this build is Bleeding. Extra Bleed-specific resistance has no verified coefficient; self-application is not simulated." },
        "source": {
            "cardId": "69214b9831723704c1edadba",
            "cardUrl": "https://trello.com/c/SI3Za8qa"
        },
    },
    pulverizing_rush: {
        damageTypes: { Earth: 1 }, damageScalings: { Earth: 1, Air: 1 },
        getPerkDamageInfo(amount) { return positivePerk(amount) && selected(this, "m1_finisher_confirmed") ? { ...activation("pulverizing_rush", 4 + amount, "Weapon"), sourceDamageType: "Pulverizing Rush" } : null; },
        getMechanicsPreview(amount) { return [row("Stationary slam base damage", 4 + amount), row("Condition", "Hold LMB after a confirmed original M1 finisher; stationary preview only"), row("Moving damage", "Speed reduction and reduced proc coefficient unknown")]; },
        support: { "status": "Partial", "details": "Separate stationary sustained slam preview has 4 + perk amount base, 1 Earth output and 1 Earth/Air scaling. Requires Last M1 Is a Finisher, is not tagged as a finisher, and does not replace the original combo. Moving damage reduction, repeated timing, disabled abilities, and reduced proc coefficient are held." },
        id: "pulverizing_rush",
        name: "Pulverizing Rush",
        category: "",
        description: "Continuing to hold LMB after the last hit of its original combo will cause you to repeatedly slam the ground as you move. This deals Earth damage but disables Blocking, Weapon Art and Rune usage, as well as having a lower Proc Coefficient.",
        "source": {
            "cardId": "69214b9731723704c1edab50",
            "cardUrl": "https://trello.com/c/oys9mYRq"
        },
    },
    fury: {
        getMechanicsPreview(amount) { return [row("Rage duration factor", 1 + .5 * amount, "x")]; },
        support: { "status": "Partial", "details": "Increases selected Rage duration previews by 50% per perk, including Mage Rage and other modifications that retain the Rage status. Duration modifiers multiply as an explicit builder convention; application and expiration remain manual." },
        id: "fury",
        name: "Fury",
        category: "",
        description: "Rage lasts longer",
        "source": {
            "cardId": "69214b9731723704c1eda3ca",
            "cardUrl": "https://trello.com/c/PYbZH8vH"
        },
    },
    void_rage: {
        id: "void_rage",
        name: "Void Rage",
        category: "",
        description: "Convert rage into Void Rage, which gives stun resistance and bonus hex damage type.",
        outputPriority: 100,
        onOutputCalculation(amount) {
            if (positivePerk(amount) && hasBuff(this, "rage"))
                addOutput(this, "Hex", 0.1 * amount);
        },
        support: { "status": "Partial", "details": "Selected Rage adds 0.1 Hex output per perk, including DoT packets. It remains the existing Rage buff and is independent of Rage potency. Summon transfer and stun resistance are not simulated." },
        "source": {
            "cardId": "69214b9731723704c1eda35a",
            "cardUrl": "https://trello.com/c/pKAeIvmZ"
        }
    },
    echo_incineration: {
        outputPriority: -50,
        onOutputCalculation(amount) { if (!positivePerk(amount))
            return; const fire = this.damageTypes.Fire || 0, air = this.damageTypes.Air || 0; this.damageTypes.Fire = roundPerkValue((fire + air) / 2); this.damageTypes.Air = roundPerkValue((fire + air) / 2); },
        getMechanicsPreview(amount) { return [row("Tornado base damage", 7 + 1.25 * amount), row("Base tornado proc chance", chance(10 + 2.5 * amount), "%"), row("Tornado damage preview", "Scaling / output split missing; full damage held")]; },
        support: { "status": "Partial", "details": "Simultaneously transfers half of Fire output to Air and half of Air to Fire, retaining combined output and other damage types. Runs after additive outputs, before later conversions as a builder convention. Also displays tornado base damage 7+1.25p and base chance 10+2.5p percent. Missing tornado scaling/output split and Burn innate potency are not invented; no automatic proc chain." },
        id: "echo_incineration",
        name: "Echo Incineration",
        category: "",
        description: "Half of your Fire Damage is converted into Air Damage and vise versa. Additionally, you have a chance to release a fiery tornado on hit that deals Fire and Air Damage whilst inflicting Burn. Grants Burn potency.",
        "source": {
            "cardId": "69214b9831723704c1edace8",
            "cardUrl": "https://trello.com/c/7s5VmIol"
        },
    },
    strong_tides: {
        id: "strong_tides",
        name: "Strong Tides",
        category: "Perk",
        description: "Increases your water boost based on your physical boost",
        statPriority: 90,
        onStatCalculation(perkAmount) {
            if (!perkAmount)
                return;
            const physicalBoost = this.stats.PhysicalBoost || 0;
            if (!physicalBoost)
                return;
            addStat(this, "WaterBoost", (physicalBoost / 10) * perkAmount);
        },
        "source": {
            "cardId": "69214b9731723704c1eda37a",
            "cardUrl": "https://trello.com/c/kVHlE4aD"
        },
    },
    reaper: {
        id: "reaper",
        name: "Reaper",
        category: "Perk",
        description: "Deal more dmg to enemies with debuffs.",
        onDmgBonusMultiplier(perkAmount, args) {
            if (!perkAmount || args?.baseDamageData?.tags?.includes("DoT"))
                return null;
            const targetDebuff = getDebuffCount(this.target);
            if (!targetDebuff)
                return null;
            const multiplier = (5 * targetDebuff * perkAmount) / 100;
            return multiplier;
        },
        support: { "status": "Partial", "details": "Counts distinct target debuffs already present for direct hits. Debuff application timing is manual and DoTs are excluded." },
        "source": {
            "cardId": "69214b9731723704c1eda3b0",
            "cardUrl": "https://trello.com/c/wt4E74Nw"
        },
    },
    scourge: {
        id: "scourge",
        name: "Scourge",
        category: "",
        description: "True damage can be affected by rage. Also all hits have a chance to count as a guard break and deal bonus damage.",
        onDmgBonusMultiplier(perkAmount, args) {
            if (!perkAmount || perkAmount <= 0 || !hasBuff(this, "scourge_proc"))
                return null;
            if (args?.baseDamageData?.tags?.includes("DoT"))
                return null;
            return 0.2 * perkAmount;
        },
        support: { "status": "Partial", "details": "Rage can boost True damage. Select Scourge Proc for its bonus-damage hit; random rolls and Guardbreak chains are not simulated." },
        "source": {
            "cardId": "69214b9731723704c1eda456",
            "cardUrl": "https://trello.com/c/U9ETYYxu"
        },
    },
    highlander: {
        id: "highlander",
        name: "Highlander",
        category: "Perk",
        description: "Your weapon arts and runes ignore some of the opponents armor and deals bonus damage.",
        onDmgBonusMultiplier(amount, args) {
            return positivePerk(amount) && isRuneOrWeaponArtHit(args) ? 0.2 * amount : null;
        },
        onArmorPenCalculation(amount, args) {
            return positivePerk(amount) && isRuneOrWeaponArtHit(args) ? 10 * amount : null;
        },
        support: { "status": "Implemented", "details": "Rune and Weapon Art packets gain 20% damage and 10 penetration per perk, retaining fractional amounts. Weapon hits and status ticks do not qualify." },
        "source": {
            "cardId": "69214b9731723704c1eda454",
            "cardUrl": "https://trello.com/c/pSwngnkL"
        }
    },
    hemorrhage: {
        id: "hemorrhage",
        name: "Hemorrhage",
        category: "Perk",
        description: "Hitting a Bleeding opponent adds bonus Damage, Stun, and a small amount of True Damage Type. Grants Bleed potency.",
        onDmgBonusMultiplier(perkAmount, args) {
            if (!perkAmount || perkAmount <= 0 || !isProcHit(args) || !(hasDebuff(this.target, "bleed") || this.activeProcs?.includes("hemorrhage_before_blood_thirsty")))
                return null;
            const multiplier = (10 + 10 * perkAmount) / 100;
            return multiplier;
        },
        onOutputCalculation(perkAmount, args) {
            if (!perkAmount || perkAmount <= 0 || !isProcHit(args) || !(hasDebuff(this.target, "bleed") || this.activeProcs?.includes("hemorrhage_before_blood_thirsty")))
                return null;
            const outputMultiplier = 0.1 * perkAmount;
            let previousValue = this.damageTypes["True"];
            this.damageTypes["True"] = previousValue
                ? previousValue + outputMultiplier
                : outputMultiplier;
            return null;
        },
        support: { "status": "Partial", "details": "Direct proc-capable hits against Bleed gain (10 + 10 * perkAmount)% damage and 0.1 True output per perk. Per the user's in-game test, both bonuses apply before Blood Thirsty consumes Bleed on that hit. Later hits require Bleed to remain or be reapplied; no automatic reapplication. Other perk ordering is unchanged. Stun is not calculated; the reviewed source grants no Bleed potency." },
        "source": {
            "cardId": "69214b9731723704c1eda420",
            "cardUrl": "https://trello.com/c/WSK9ClTj"
        },
    },
    melting_slime: {
        id: "melting_slime",
        name: "Melting Slime",
        category: "Perk",
        description: "The Sticky Debuff you apply now causes the enemy to take 20% more Fire Damage, alongside a Fire-Damage DoT that scales with Burn potency. Grants Burn potency.",
        onIncreaseSpecificDmgTaken(perkAmount, args) {
            if (!perkAmount || !args?.outputType)
                return null;
            if (args.outputType !== "Fire")
                return null;
            return 0.2 * perkAmount;
        },
        "source": {
            "cardId": "69214b9831723704c1edacf0",
            "cardUrl": "https://trello.com/c/hpXdNvCc"
        },
    },
    vicious_edge: {
        id: "vicious_edge",
        name: "Vicious Edge",
        category: "",
        description: "Gain a chance to inflict Bleed on hit. Gain a Damage Bonus against Bleeding enemies.",
        onDmgBonusMultiplier(perkAmount, args) {
            return perkAmount && perkAmount > 0 && isProcHit(args) && hasDebuff(this.target, "bleed") ? 0.2 * perkAmount : null;
        },
        support: { "status": "Partial", "details": "Direct proc-capable hits gain 20% damage per perk against existing Bleed. Automatic Bleed application is not simulated; DoT applicability remains unverified." },
        "source": {
            "cardId": "69214b9731723704c1eda412",
            "cardUrl": "https://trello.com/c/rmogzK5p"
        },
    },
    cut_down: {
        id: "cut_down",
        name: "Cut Down",
        category: "Perk",
        description: "Deal bonus damage based on how much % HP the opponent has left.",
        onDmgBonusMultiplier(perkAmount) {
            if (!perkAmount || !this.target?.maxHp)
                return null;
            const hpRatio = Math.max(0, Math.min(1, this.target.hp / this.target.maxHp));
            return Math.trunc((0.3 * hpRatio * perkAmount) * 10000) / 10000;
        },
        "source": {
            "cardId": "69214b9731723704c1eda466",
            "cardUrl": "https://trello.com/c/8do67qok"
        },
    },
    extra_layers: {
        id: "extra_layers",
        name: "Extra Layers",
        category: "Perk",
        description: "Gain more warding and protection.",
        onStatCalculation(perkAmount) {
            if (!perkAmount)
                return;
            const multiplier = 1 + 0.2 * perkAmount;
            this.stats.Warding = roundPerkValue((this.stats.Warding || 0) * multiplier);
            this.stats.Protection = roundPerkValue((this.stats.Protection || 0) * multiplier);
        },
        "source": {
            "cardId": "69214b9731723704c1eda3f2",
            "cardUrl": "https://trello.com/c/nHNAxaEf"
        },
    },
    spellshield: {
        id: "spellshield",
        name: "Spellshield",
        category: "Perk",
        description: "Increases grant protection based on your magic boost and magic defense",
        onStatCalculation(perkAmount) {
            if (!perkAmount)
                return;
            const magicBoost = this.stats.MagicBoost || 0;
            const magicDefense = this.stats.MagicDefense || 0;
            const protection = (magicBoost + magicDefense) / 10 * perkAmount;
            addStat(this, "Protection", protection);
        },
        "source": {
            "cardId": "69214b9731723704c1eda36c",
            "cardUrl": "https://trello.com/c/AIl5dW6s"
        },
    },
    spark: {
        id: "spark",
        name: "Spark",
        category: "Perk",
        description: "Crit damage gains a large bonus if the opponent is on fire.",
        critical: { "damagePerPerk": 0.5, "targetDebuff": "burn" },
        "source": {
            "cardId": "69214b9731723704c1eda41e",
            "cardUrl": "https://trello.com/c/A1Ij3xmy"
        },
    },
    vital_strikes: {
        id: "vital_strikes",
        name: "Vital Strikes",
        category: "Perk",
        description: "Increase crit damage.",
        critical: { "damagePerPerk": 0.25 },
        "source": {
            "cardId": "69214b9731723704c1eda3aa",
            "cardUrl": "https://trello.com/c/RDORU0kV"
        },
    },
    dark_one: {
        id: "dark_one",
        name: "Dark One",
        category: "Perk",
        description: "Debuffs last longer on you, but in turn you gain increased damage while afflicted with them.",
        onDmgBonusMultiplier(amount) {
            return positivePerk(amount) ? 0.0666 * getDebuffCount(this) * amount : null;
        },
        support: { "status": "Partial", "details": "Adds 6.66% damage per distinct self debuff per perk, preserving fractional amounts. Debuff duration changes are not simulated." },
        "source": {
            "cardId": "69214b9731723704c1edaa86",
            "cardUrl": "https://trello.com/c/QDz1amvn"
        }
    },
    brawny: {
        id: "brawny",
        name: "Brawny",
        category: "Perk",
        description: "Converts a portion of all positive boosts to physical boost.",
        statPriority: 80,
        onStatCalculation(amount) {
            if (!positivePerk(amount))
                return;
            const fraction = Math.min(1, 0.2 * amount);
            for (const stat of offensiveBoostStats) {
                const value = this.stats[stat] || 0;
                if (value <= 0)
                    continue;
                addStat(this, stat, -value * fraction);
                addStat(this, "PhysicalBoost", value * fraction);
            }
        },
        support: { "status": "Partial", "details": "Converts up to 100% of other positive offensive boosts into Physical Boost, removing the converted portion. Attack Speed and negative boosts are untouched. Conversion runs once before redistribution; cross-perk conversion order is a documented builder convention." },
        "source": {
            "cardId": "69214b9731723704c1edaa82",
            "cardUrl": "https://trello.com/c/kMRPcJza"
        }
    },
    weight_distribution: {
        id: "weight_distribution",
        name: "Weight Distribution",
        category: "Perk",
        description: "Your dexterity and physical boost is added together and distributed evenly. Additionally makes M1/M2s slow less while attacking.",
        statPriority: 60,
        onStatCalculation(amount) {
            if (!positivePerk(amount))
                return;
            const distributed = roundPerkValue(((this.stats.PhysicalBoost || 0) + (this.stats.DexterityBoost || 0)) / 2 * (1 + 0.1 * amount));
            this.stats.PhysicalBoost = distributed;
            this.stats.DexterityBoost = distributed;
        },
        support: { "status": "Partial", "details": "Averages Physical and Dexterity Boost, then multiplies both by 1 + 0.1 * perk amount, after Brawny. Movement penalties during attacks are not simulated; cross-perk conversion order remains a builder convention." },
        "source": {
            "cardId": "69214b9731723704c1eda3fc",
            "cardUrl": "https://trello.com/c/w0LwsFfF"
        }
    },
    voltaic_body: {
        id: "voltaic_body",
        name: "Voltaic Body",
        category: "",
        description: "Using your weapon art gives you a static charge that causes your targets to be struck  by lightning when you hit them with your rune, but your rune has an increased cooldown.",
        damageTypes: {
            Air: 0.5,
            Magic: 0.5
        },
        damageScalings: {
            Air: 1,
            Magic: 1
        },
        getPerkDamageInfo(perkAmount) {
            if (!perkAmount)
                return null;
            // let voltaic_body = this.buff.find(
            //   (buff) => buff?.id === "voltaic_body"
            // );
            //if (!voltaic_body) return null;
            const charge = this.buff?.find((buff) => buff?.id === "static_charge");
            const hitCount = Math.max(1, charge?.stacks ?? 1);
            const baseDamage = (8 + 4 * perkAmount) * (0.85 ** hitCount);
            return {
                damage: baseDamage,
                hitAmount: 1,
                source: "voltaic_body",
                sourceDamageType: "Perk",
                sourceType: "Perk"
            };
        },
        "source": {
            "cardId": "69214b9731723704c1eda3d8",
            "cardUrl": "https://trello.com/c/aMxLHAtO"
        },
        cooldown: { "sources": ["Rune"], "directBase": 1.2 },
        support: { "status": "Partial", "details": "Charged-hit damage preview uses the selected Static Charge hit count. Rune cooldown is multiplied by 1.2 independently of perk amount. Activation and charge timing are manual." }
    },
    duelist_stance: {
        id: "duelist_stance",
        name: "Duelist Stance",
        category: "",
        description: "If your using a one handed sword, then your weapon type changes into a rapier.",
        "source": {
            "cardId": "69214b9731723704c1eda414",
            "cardUrl": "https://trello.com/c/4vIJ4XNj"
        },
    },
    bloodlust: {
        id: "bloodlust",
        name: "Bloodlust",
        category: "",
        description: "Tenacity increases damage dealt.",
    },
    beastial_rage: {
        id: "beastial_rage",
        name: "Beastial Rage",
        category: "",
        description: "On Kill, gain Rage, cleanse all Debuffs, and slightly heal. Rage now increases your movement speed.",
        getSourcePotencies(amount) { return { ragepotency: 0.3 * amount }; },
        support: { "status": "Partial", "details": "Offers 0.3 * perk amount Rage potency after a kill. Kill healing, cleansing, automatic application, and the unspecified movement-speed bonus are not calculated." },
        "source": {
            "cardId": "69214b9731723704c1eda458",
            "cardUrl": "https://trello.com/c/8LBFjFic"
        }
    },
    heat_drill: {
        cooldown: { sources: ["WeaponArt"], abilityId: "lunge", overrideBase: 15 },
        getMechanicsPreview() { return [row("Lunge base cooldown", 15, "s"), row("Damage", "Recent +50% buff is unspecified; replacement damage held. Lunge table remains legacy.")]; },
        support: { "status": "Partial", "details": "Overrides Lunge base cooldown to 15 seconds before reviewed CDR. Barrage behavior is explicitly untested in the source and remains unchanged. Recent damage buff does not identify which coefficient changed, so replacement damage/output is held and the damage table remains labelled as legacy behavior; no guessed 50% multiplier." },
        id: "heat_drill",
        name: "Heat Drill",
        category: "",
        description: "Changes the lunge and barrage weapon art into a lunge that explodes with burning air.",
        "source": {
            "cardId": "69214b9831723704c1edad1c",
            "cardUrl": "https://trello.com/c/FQqNb1IV"
        },
    },
    ignition: {
        id: "ignition",
        name: "Ignition",
        category: "",
        description: "Small chance to deal fire damage and apply burn on hit. Grants burn potency.",
        sourcepotencies: {
            burnpotency: 0.3
        },
        "source": {
            "cardId": "69214b9731723704c1eda35c",
            "cardUrl": "https://trello.com/c/wIQIIdr1"
        },
    },
    righted_wrongs: {
        id: "righted_wrongs",
        name: "Righted Wrongs",
        category: "Perk",
        description: "Gain bonus Dexterity and Speed Boost scaling off of all of your negative stats combined.",
        statPriority: 100,
        onStatCalculation(amount) {
            if (!positivePerk(amount))
                return;
            const stats = this.stats;
            const defenses = ["EarthDefense", "FireDefense", "WaterDefense", "HolyDefense", "HexDefense", "AirDefense", "Warding"];
            const excluded = new Set([...defenses, "Protection", "Tenacity", "PhysicalDefense", "MagicDefense"]);
            const d = defenses.reduce((sum, stat) => sum + getNegativeStatValue(stats[stat]), 0);
            const p = getNegativeStatValue(stats.Protection), t = getNegativeStatValue(stats.Tenacity);
            const other = Object.entries(stats).reduce((sum, [stat, value]) => sum + (excluded.has(stat) ? 0 : getNegativeStatValue(value)), 0);
            // The card lists signed Physical/Magic Defense separately from negative other stats.
            const o = other + (stats.PhysicalDefense || 0) + (stats.MagicDefense || 0);
            const dex = 2 * amount / 21 * (d + (2 * p / 10 + t) / 5 + 2 * o);
            addStat(this, "DexterityBoost", dex);
            addStat(this, "SpeedBoost", dex / 10);
        },
        support: { "status": "Partial", "details": "Uses the card formula before derived-stat perks: 2c/21 * (d + (2p/10 + t)/5 + 2o), with Speed equal to 10% of gained Dexterity. Physical/Magic Defense are signed terms exactly as written on the card; that unusual rule and cross-perk order still need in-game confirmation." },
        "source": {
            "cardId": "69214b9731723704c1eda4c2",
            "cardUrl": "https://trello.com/c/AIF47yPZ"
        }
    },
    immoveable: {
        id: "immoveable",
        name: "Immovable",
        category: "Perk",
        description: "Reduce knockback and increase physical defense based on your tenacity stat.",
        statPriority: 40,
        onStatCalculation(amount) {
            if (positivePerk(amount))
                addStat(this, "PhysicalDefense", 30 * (this.stats.Tenacity || 0) * amount);
        },
        support: { "status": "Partial", "details": "Adds 30 * Tenacity * perk amount Physical Defense after Ork adds conditional Tenacity. Knockback is not simulated." },
        "source": {
            "cardId": "69214b9731723704c1eda4b2",
            "cardUrl": "https://trello.com/c/ji6sl9DN"
        }
    },
    adaptive_plate: {
        id: "adaptive_plate",
        name: "Adaptive Plate",
        category: "Perk",
        description: "Taking the same damage type twice will activate a holy bubble that reduces damage taken. The damage reduction is more effective against the damage type that triggered it.",
        "source": {
            "cardId": "69214b9831723704c1edace2",
            "cardUrl": "https://trello.com/c/OasQAMbT"
        },
    },
    aggressive_personality: {
        id: "aggressive_personality",
        name: "Aggressive Personality",
        category: "Perk",
        description: "Finishers that slam the ground are granted a larger Hitbox and Taunts on hit.",
        "source": {
            "cardId": "69214b9731723704c1eda426",
            "cardUrl": "https://trello.com/c/pYAHsw6B"
        },
        onDmgBonusMultiplier(amount, args) { return positivePerk(amount) && selected(this, "hammer_slam") && isFinisher(args) ? 0.25 * amount : null; },
        support: { "status": "Partial", "details": "Select Hammer Slam for a qualifying tagged finisher to gain 25% damage per perk. Slam eligibility, M1 finisher classification, hitbox, and Taunt application/duration are manual." }
    },
    air_barrier: {
        id: "air_barrier",
        name: "Air Barrier",
        category: "Perk",
        description: "Release a small shockwave of Air around yourself when Blocking an attack. Has a Proc Coefficient and no Cooldown.",
        "source": {
            "cardId": "69214b9731723704c1eda91c",
            "cardUrl": "https://trello.com/c/pokbRdbn"
        },
        damageScalings: { "Air": 0.5 }, damageTypes: { "Air": 1 },
        getPerkDamageInfo(amount) { if (!positivePerk(amount))
            return null; return activation("air_barrier", 3 * amount); },
        support: { "status": "Partial", "details": "One blocking shockwave, 3 * perk amount base damage and 0.5 Air scaling. Air output is inferred from the description. Separate activation preview; trigger rolls, cooldowns, area/target counts, and recursive procs are not simulated. Unspecified proc coefficients and crit eligibility use the existing direct-packet defaults." }
    },
    air_pressure: {
        id: "air_pressure",
        name: "Air Pressure",
        category: "Perk",
        description: "Dealing Air Damage builds up a Buff that grants Damage Reduction. It can be released as an AoE of Damage when using a Rune.",
        "source": {
            "cardId": "69214b9731723704c1eda996",
            "cardUrl": "https://trello.com/c/TbdQ5OOI"
        },
        getSourcePotencies() { return { airpressurepotency: 0 }; },
        onDmgReducedMultiplier(amount) { return positivePerk(amount) && hasBuff(this, "air_pressure") ? Math.min(10 * amount, selectedBuffPotency(this, "air_pressure")) / 100 : null; },
        damageScalings: { Air: 1 }, damageTypes: { Air: 1 },
        getPerkDamageInfo(amount) {
            if (!positivePerk(amount) || !hasBuff(this, "air_pressure"))
                return null;
            return activation("air_pressure", 0.75 * Math.min(10 * amount, selectedBuffPotency(this, "air_pressure")), "Rune");
        },
        support: { "status": "Partial", "details": "Select Air Pressure and enter its current potency, capped at 10 * perk amount. Defense divides by 1 + potency/100; the separate release preview deals 0.75 * potency base damage with 1 Air scaling/output and counts as Rune damage. Buildup, release consumption, and duration are manual." }
    },
    apollo_boost: {
        id: "apollo_boost",
        name: "Apollo Boost",
        category: "Perk",
        description: "Using a Rune launches you vertically with a shockwave. Enemies hit by the shockwave are Taunted.",
        "source": {
            "cardId": "69214b9731723704c1eda3f0",
            "cardUrl": "https://trello.com/c/URitSpQK"
        },
        cooldown: { sources: ["Rune"], additionalBase: 2 },
        damageScalings: { Magic: 1 }, damageTypes: { Magic: 0.5, Physical: 0.5 },
        getPerkDamageInfo(amount) {
            if (!positivePerk(amount))
                return null;
            return { ...activation("apollo_boost", Math.max(0, 5 - (0.15 + 0.25 * amount)), "Rune"), hitAmount: Math.floor(1 + amount) };
        },
        support: { "status": "Partial", "details": "Adds a fixed 2 seconds to Rune base cooldown before reviewed CDR and race factors. A separate activation has floor(1 + perk amount) waves, each max(0, 5 - (0.15 + 0.25 * perk amount)) base, 1 Magic scaling, half Magic/Physical output, and Rune classification. Follows the card's literal decreasing-base formula; launch, Taunt, and cast delay are manual." }
    },
    artillery_mage: {
        id: "artillery_mage",
        name: "Artillery Mage",
        category: "Perk",
        description: "Your LMB's and RMB's are replaced with ranged beams.",
        "source": {
            "cardId": "69214b9731723704c1eda460",
            "cardUrl": "https://trello.com/c/fYve18wA"
        },
        weaponPriority: 10,
        modifyWeaponConstruction(amount, data) { if (positivePerk(amount)) {
            data.constructionType = "Artillery Mage (LMB preview)";
            data.weaponFamily = "artillery_mage";
            data.m1 = [[5.5, 1], [5.5, 1]];
        } },
        support: { "status": "Partial", "details": "Replaces the two LMB beams with the specific card's 5.5 base each. Leaves RMB unchanged because the general construction card disagrees with the specific LMB card and may be outdated. LMBs are not tagged Finisher. Construction is resolved after existing stances. Conflicts with other replacement perks use documented builder priority, pending in-game verification; animation, knockback, and automatic applications are not simulated." }
    },
    barbed_flurry: {
        id: "barbed_flurry",
        name: "Barbed Flurry",
        category: "Perk",
        description: "Reapplying bleed on targets that are already bleeding deals a bit of damage.",
        "source": {
            "cardId": "69214b9731723704c1eda96e",
            "cardUrl": "https://trello.com/c/3Bg08Epj"
        },
        damageScalings: { Physical: 1, Dexterity: 1 }, damageTypes: { Physical: 1 },
        getPerkDamageInfo(amount) { return positivePerk(amount) && hasDebuff(this.target, "bleed") ? activation("barbed_flurry", 1.6 * amount, "Perk", 0) : null; },
        support: { "status": "Partial", "details": "With target Bleed selected, previews one reapplication burst: 1.6 * perk amount base, Physical/Dexterity scaling, Physical output inferred from the description. Cannot proc other effects. Reapplication and duration are manual; crit eligibility is unverified." }
    },
    basic_spirit: {
        id: "basic_spirit",
        name: "Basic Spirit",
        category: "Perk",
        description: "Release your Spiritual Energy with and RMB as a multi-hit Finisher.",
        "source": {
            "cardId": "69214b9831723704c1edac82",
            "cardUrl": "https://trello.com/c/hLPfb773"
        },
    },
    bastion_ballista: {
        previewInputs: ["storedCount"],
        getMechanicsPreview(amount) {
            const arrows = input(this, "storedCount"), cap = Math.floor(50 * amount), count = arrows === undefined ? undefined : Math.min(cap, Math.floor(arrows));
            return [row("Base damage per arrow", 1.25 + .75 * amount), row("Maximum arrows", cap), row("Selected arrows", count), row("Selected volley base damage", count === undefined ? undefined : count * (1.25 + .75 * amount)), row("Per-enemy firing cooldown", .1, "s"), row("Restoration delay", 9, "s")];
        },
        support: { "status": "Partial", "details": "Calculates per-arrow and selected-volley base damage, 50 arrows per perk, 0.1s per-enemy cooldown and 9s restoration delay. Dexterity/Earth coefficients, output, range-to-arrow count, and automatic firing are undocumented; scaled damage is held." },
        id: "bastion_ballista",
        name: "Bastion Ballista",
        category: "Perk",
        description: "Gain a Neutral Status called Arrows, Hitting an opponent from longer ranges will shoot an arrow at them, the amount increasing the further you are. Scales on Dexterity and Earth, with a 0.1 second Cooldown. Arrows restore after not firing for a bit.",
        "source": {
            "cardId": "69214b9731723704c1edab9e",
            "cardUrl": "https://trello.com/c/d1v1bK6T"
        },
    },
    bastion_bless: {
        id: "bastion_bless",
        name: "Bastion Bless",
        category: "Perk",
        description: "Healing grants regeneration or reinforce on a low chance. Additionally gives slight potency to all buffs.",
        sourcepotencies: { regenpotency: 0.5, reinforcepotency: 0.5 },
        support: { "status": "Partial", "details": "Offers fixed 0.5 Regen/Reinforce sources and increases effective potency of actual potency-bearing buffs applied by this build by 10% per perk. Final manual potency overrides bypass this multiplier. Unknown potency formulas for other buffs, healing rolls, and automatic application remain manual." },
        "source": {
            "cardId": "69214b9731723704c1edabc4",
            "cardUrl": "https://trello.com/c/QHl1kv28"
        }
    },
    bellowing_ember: {
        id: "bellowing_ember",
        name: "Bellowing Ember",
        category: "Perk",
        description: "Grant a chance to light the opponent on fire with fire damage and deal extra damage to opponents and additional if you hit them with fire damage at low hp",
        onDmgBonusMultiplier(amount) {
            const ratio = healthRatio(this);
            if (!positivePerk(amount) || ratio === undefined || ratio > Math.min(1, 0.4 + 0.05 * amount))
                return null;
            return ((this.damageTypes.Fire || 0) > 0 ? 0.23 : 0.1) * amount;
        },
        support: { "status": "Partial", "details": "At or below (40 + 5 * perk amount)% self HP, grants 10% damage per perk, or 23% to the whole packet when it contains Fire. Struck-through burn chance/potency values are unverified and not implemented." },
        "source": {
            "cardId": "69214b9731723704c1eda372",
            "cardUrl": "https://trello.com/c/7FkUd60a"
        }
    },
    blastshield: {
        getMechanicsPreview(amount) { return [row("Shockwave base damage", 15 + 15 * amount), row("Shockwave poise damage", 25 + 25 * amount), row("Approximate cooldown", 12, "s")]; },
        support: { "status": "Partial", "details": "Calculates Earth shockwave base damage and absolute poise damage separately, plus the approximate 12s cooldown. Missing damage-scaling and stun coefficients prevent a final damage or stun result; triggering is manual." },
        id: "blastshield",
        name: "Blastshield",
        category: "Perk",
        description: "Release a shockwave of Earth upon taking Damage. Has a Cooldown.",
        "source": {
            "cardId": "69214b9731723704c1eda386",
            "cardUrl": "https://trello.com/c/VtQLoFxu"
        },
    },
    blazing_finisher: {
        previewInputs: ["preOutputHitDamage"],
        getMechanicsPreview(amount) { const hit = input(this, "preOutputHitDamage"); return [row("Explosion base damage", hit === undefined ? undefined : 2 * amount + .2 * hit), row("Fire scaling", 1), row("Per-enemy cooldown", .2, "s"), row("Condition", "Finisher must consume your Burn; enter the triggering finisher damage")]; },
        support: { "status": "Partial", "details": "Calculates 2 * perk amount + 20% of the entered triggering finisher damage, with 1 Fire scaling and 0.2s per-enemy cooldown. This is a separate pre-modifier explosion preview; no second application of the entered hit scaling, automatic Burn consumption, multi-target hit counts, or recursive procs." },
        id: "blazing_finisher",
        name: "Blazing Finisher",
        category: "Perk",
        description: "Landing a Finisher on an enemy with your Burn removes it in exchange for creating a small AoE of Fire Damage around them.",
        "source": {
            "cardId": "69214b9731723704c1eda3da",
            "cardUrl": "https://trello.com/c/IRzuD1Kj"
        },
    },
    blessing: {
        id: "blessing",
        name: "Blessing",
        category: "Perk",
        description: "Small chance to apply a random buff when you heal yourself or an ally.",
        sourcepotencies: {
            bouncepotency: 0.2,
            regenpotency: 1,
            reinforcepotency: 0.5,
            ragepotency: 0.5,
        },
        "source": {
            "cardId": "69214b9731723704c1eda34a",
            "cardUrl": "https://trello.com/c/LyegnYns"
        },
    },
    blood_lust: {
        id: "blood_lust",
        name: "Blood Lust",
        category: "Perk",
        description: "Hitting a bleeding opponent gives a buff that grants ramping attack speed on hit.",
        statPriority: -10,
        onStatCalculation(amount) {
            if (positivePerk(amount))
                addStat(this, "AttackSpeed", 20 * selectedBuffPotency(this, "blood_lust"));
        },
        sourcepotencies: { bloodlustpotency: 0 },
        support: { "status": "Partial", "details": "Select Blood Lust and enter its current effective potency: Attack Speed gains 20 * potency percentage points. Source starts at zero charge. Automatic weapon-hit buildup, cap scaling beyond the documented 2.5 at one perk, expiration, and proc-coefficient reduction are not simulated." },
        "source": {
            "cardId": "69214b9731723704c1eda416",
            "cardUrl": "https://trello.com/c/zBPM5Pnx"
        }
    },
    blood_rush: {
        id: "blood_rush",
        name: "Blood Rush",
        category: "Perk",
        description: "When summons reach low hp they gain rage and increased tenacity.",
        "source": {
            "cardId": "69214b9731723704c1eda3f6",
            "cardUrl": "https://trello.com/c/qFgisICX"
        },
        getSourcePotencies(amount) { return { ragepotency: 0.15 * amount }; },
        support: { "status": "Partial", "details": "Offers 0.15 * perk amount innate Rage for the low-HP summon state. Use this source on a summon represented by a build actor; no buff is automatically granted to the player. Approximate activation HP thresholds, tenacity, summoning, and expiration are manual." }
    },
    blub_blub: {
        previewInputs: ["preOutputHitDamage"],
        getMechanicsPreview(amount) { const hit = input(this, "preOutputHitDamage"), each = hit === undefined ? undefined : .15 * amount * hit; return [row("Repeat chance", 50, "%"), row("Each Water repeat before its own modifiers", each), row("Two Water repeats", each === undefined ? undefined : 2 * each), row("Expected repeated damage before its own modifiers", each)]; },
        support: { "status": "Partial", "details": "Calculates two Water repeats, each 15% per perk of the entered hit damage before post-output modifiers, at a fixed 50% chance. Expected repeat damage is shown separately. Repeats cannot proc effects. Delay, poise, and their own subsequent damage modifiers are not automatically resolved." },
        id: "blub_blub",
        name: "Blub Blub",
        category: "Perk",
        description: "Your hits have a chance to repeat with a portion of their strength in Water Damage after a short delay.",
        "source": {
            "cardId": "69214b9831723704c1edac3a",
            "cardUrl": "https://trello.com/c/sKT0Zeoy"
        },
    },
    bombardier: {
        id: "bombardier",
        name: "Bombardier",
        category: "Perk",
        description: "All hits have a chance to create an explosion that deals Holy and Magic Damage. You too are hit by this explosion, but at heavily reduced Damage and Stun.",
        "source": {
            "cardId": "69214b9731723704c1eda4a8",
            "cardUrl": "https://trello.com/c/eRKaaUsG"
        },
        damageScalings: { "Holy": 1, "Magic": 1 }, damageTypes: { "Holy": 0.5, "Magic": 0.5 },
        getPerkDamageInfo(amount) { if (!positivePerk(amount))
            return null; return activation("bombardier", 10 + amount, "Perk"); },
        support: { "status": "Partial", "details": "One explosion deals 10 + perk amount base with Holy/Magic scaling and split output. Self-damage is not added; the card labels its approximate percentage and proc-chance scaling as uncertain. This is an independent activation preview, not automatic DPS. Trigger rolls, cooldowns, area/target counts, and unspecified proc/crit rules are not simulated." }
    },
    bomber_charge: {
        modifyWeaponArtPacket(amount, packet) {
            if (packet.source !== "retaliate")
                return;
            const missing = Math.min(.5, 1 - (healthRatio(this) ?? 1));
            packet.damage = 12.5 * (1 + .15 * amount) * (1 + 12.8 * missing);
            packet.damageTypes = { Holy: .5, True: .5 };
            packet.damageScalings = { ...(packet.damageScalings ?? this.damageScalings) };
            for (const id of ["Holy", "Magic"])
                packet.damageScalings[id] = (packet.damageScalings[id] || 0) + .4;
        },
        getMechanicsPreview(amount) { return [row("Retaliate base damage", 12.5 * (1 + .15 * amount) * (1 + 12.8 * Math.min(.5, 1 - (healthRatio(this) ?? 1)))), row("Holy / Magic added scaling", .4), row("Windup reduction", "Ambiguous source: defensive reduction not automatically applied")]; },
        support: { "status": "Partial", "details": "Replaces selected Retaliate base damage using missing HP capped at 50%, adds fixed 0.4 Holy and Magic scaling, and converts its existing equal Physical/True split to equal Holy/True as an explicit builder convention. Works in the Weapon Art damage panel without mutating the ability. Stun immunity removal, windup reduction, area, and cast timeline are held." },
        id: "bomber_charge",
        name: "Bomber Charge",
        category: "Perk",
        description: "The Retaliate Weapon Art no longer grants any Defensive utility, but instead scales off of your missing HP, Holy, and Magic Boosts. You can now act freely during the 'charge'.",
        "source": {
            "cardId": "69214b9831723704c1edadc6",
            "cardUrl": "https://trello.com/c/7Lll3C6C"
        },
    },
    bomber_satchel: {
        previewInputs: ["storedCount"],
        getMechanicsPreview() { const n = input(this, "storedCount"); return [row("Stored Beenade cap", 5), row("Stored Beenades selected", n === undefined ? undefined : Math.min(5, Math.floor(n))), row("Additional Beenades on next Beenade Rune", n === undefined ? undefined : Math.min(5, Math.floor(n)))]; },
        support: { "status": "Partial", "details": "Clamps the selected Stored Beenades counter to five and shows the extra Beenades for the next Beenade Rune. One stack per Weapon Art hit; no automatic stack accrual, reset, or guessed Beenade damage." },
        id: "bomber_satchel",
        name: "Bomber Satchel",
        category: "Perk",
        description: "Gain stacks of Stored Beenades when hitting an with a Weapon Art. These will be consumed when using Beenade Rune to throw additional Beenades. Capped at 5.",
        "source": {
            "cardId": "69214b9831723704c1edaeb0",
            "cardUrl": "https://trello.com/c/uEglpUBj"
        },
    },
    bomber_spirit: {
        id: "bomber_spirit",
        name: "Bomber Spirit",
        category: "Perk",
        description: "Release your Spiritual Energy with an RMB, which will launch four Bomber projectiles that causes large explosions on hit.",
        "source": {
            "cardId": "69214b9831723704c1edac9e",
            "cardUrl": "https://trello.com/c/0aEoqDe8"
        },
        damageScalings: { Holy: 1, Magic: 1 }, damageTypes: { Holy: 0.5, Magic: 0.5 },
        getPerkDamageInfo(amount) { return positivePerk(amount) ? { ...activation("bomber_spirit", 9, "Weapon"), sourceDamageType: "M2", tags: ["Weapon", "M2", "Finisher"], hitAmount: 4 } : null; },
        support: { "status": "Partial", "details": "Four 9-base projectiles with half Holy/Magic output and 1 Holy/Magic scaling, previewed as an RMB finisher activation. Treating the spiritual release as Weapon M2 is an explicit classification convention. Spiritual Energy, enhanced Bombardier proc chance, and multi-target hits are manual." }
    },
    bounce_momentum: {
        id: "bounce_momentum",
        name: "Bounce Momentum",
        category: "Perk",
        description: "Jumping whilst possessing Bounce will grant you the Buff ''Tongue Shot'' for a brief duration. ''Tongue Shot'' causes you to automatically lash at an enemy with a tongue upon jumping, Stunning and rendering them temporarily immobile. Additionally, increases the duration of Bounce.",
        "source": {
            "cardId": "69214b9831723704c1edaefa",
            "cardUrl": "https://trello.com/c/mp3UwOsc"
        },
        damageScalings: { "Water": 1 }, damageTypes: { "Water": 0.5, "Physical": 0.5 },
        getPerkDamageInfo(amount) { if (!positivePerk(amount))
            return null; if (!selected(this, "tongue_shot_ready"))
            return null; return activation("bounce_momentum", 5 + 5 * amount, "Perk"); },
        support: { "status": "Partial", "details": "Select Tongue Shot Ready after jumping with Bounce to preview one finisher-triggered lash: 5 + 5 * perk amount base, 1 Water scaling, half Water/Physical output. The selector is not a game buff; root, guard break, and consumption are manual. This is an independent activation preview, not automatic DPS. Trigger rolls, cooldowns, area/target counts, and unspecified proc/crit rules are not simulated." }
    },
    bowldur_spirit: {
        id: "bowldur_spirit",
        name: "Bowldur Spirit",
        category: "Perk",
        description: "Release your Spiritual Energy with an RMB, which encases yourself in a Spiritual Bowldur that enhances your LMB's and RMB's.",
        "source": {
            "cardId": "69214b9831723704c1edac98",
            "cardUrl": "https://trello.com/c/oXnQwZCf"
        },
        damageScalings: { "Earth": 1, "Physical": 1 }, damageTypes: { "Earth": 0.5, "Physical": 0.5 },
        getPerkDamageInfo(amount) { if (!positivePerk(amount))
            return null; return activation("bowldur_spirit", 5, "Perk"); },
        support: { "status": "Partial", "details": "One active-spirit hit with 5 base, half Earth/Physical output, and 1 Earth/Physical scaling. Preview is separate from ordinary weapon rows; which swings are enhanced, duration, Spiritual Energy, and guardbreak are manual. No defense bonus is added because the card says it does not function. Independent activation preview; trigger rolls, timing, area/target counts, and automatic proc chains are not simulated." }
    },
    bowlers_roll: {
        id: "bowlers_roll",
        name: "Bowlers Roll",
        category: "Perk",
        description: "Bowlers Roll",
        "source": {
            "cardId": "69214b9731723704c1eda380",
            "cardUrl": "https://trello.com/c/dvRyra6W"
        },
    },
    buckler: {
        id: "buckler",
        name: "Buckler",
        category: "Perk",
        description: "Grant parry, gives you a buckler to parry with if you are using a one handed weapon.",
        "source": {
            "cardId": "69214b9831723704c1edaeee",
            "cardUrl": "https://trello.com/c/3L9g2O2d"
        },
        statusEffects: ["parry_hit"],
        support: { "status": "Partial", "details": "Grants Parry equal to the perk amount per its linked card; the calculated portion is the shared Parried Hit control with fixed 90% direct-hit reduction. Visual buckler, one-handed visual qualification, missed-parry cooldown, and automatic detection are manual." }
    },
    bulfrogg_spirit: {
        damageTypes: { Water: 1 }, damageScalings: { Water: 1 },
        getPerkDamageInfo(amount) { return positivePerk(amount) ? activation("bulfrogg_spirit", 23) : null; },
        getMechanicsPreview() { return [row("Stun", 4.5, "s"), row("Activation", "One tongue hit at full Spiritual Energy; multiple tongue counts are manual")]; },
        support: { "status": "Partial", "details": "One manually selected tongue hit has fixed 23 base damage, 1 Water scaling/output, and documented 4.5s stun. Spiritual Energy, guardbreak, target/tongue counts, and automatic procs are not simulated." },
        id: "bulfrogg_spirit",
        name: "Bulfrogg Spirit",
        category: "Perk",
        description: "Upon reaching max stacks of spiritual energy right clicking unleashes lashes out spiritual tongues to stun opponents.",
        "source": {
            "cardId": "69214b9831723704c1edac8e",
            "cardUrl": "https://trello.com/c/rMK8aYbO"
        },
    },
    bulwark: {
        id: "bulwark",
        name: "Bulwark",
        category: "Perk",
        description: "Ignore Stuns from Attacks below a certain threshold after accounting for modifiers. You gain a Damage Reduction against said Attacks.",
        "source": {
            "cardId": "69214b9731723704c1eda38c",
            "cardUrl": "https://trello.com/c/TR3r3ZHO"
        },
        onDmgReducedMultiplier(amount) { return positivePerk(amount) && selected(this, "bulwark_qualifies") ? 0.25 : null; },
        support: { "status": "Partial", "details": "Select Bulwark Qualifies after checking the incoming stun threshold: fixed 25% diminishing-return damage reduction. Stun duration, Tenacity interaction, and threshold detection are manual." }
    },
    bumblz_spirit: {
        getMechanicsPreview() { return [row("Extra summons per full-charge activation", 4), row("Total summons including triggering summon", 5)]; },
        support: { "status": "Partial", "details": "Shows the fixed four extra summons plus the triggering summon. Perk stacks do not invent additional summons. Spiritual Energy, actual summon cap enforcement, individual summon stats, and attack simulation are held." },
        id: "bumblz_spirit",
        name: "Bumblz Spirit",
        category: "Perk",
        description: "Upon reaching max stacks of spiritual energy summoning a minion causes you to summon a mass amount of summons.",
        "source": {
            "cardId": "69214b9831723704c1edac90",
            "cardUrl": "https://trello.com/c/rdFDqeyl"
        },
    },
    buni_spirit: {
        id: "buni_spirit",
        name: "Buni Spirit",
        category: "Perk",
        description: "Release your Spiritual Energy with an RMB, which showers all nearby enemies in a flurry of hits. Half of them count as Finishers.",
        "source": {
            "cardId": "69214b9831723704c1edac88",
            "cardUrl": "https://trello.com/c/oPZnLHoU"
        },
        getPerkDamageInfo(amount) { return positivePerk(amount) ? { ...activation("buni_spirit", 2, "Weapon"), sourceDamageType: "M2", tags: ["Weapon", "M2", "Finisher"], hitAmount: 20, damageScalings: { ...this.damageScalings }, damageTypes: { ...this.damageTypes } } : null; },
        support: { "status": "Partial", "details": "Twenty 2-base hits sharing the selected weapon profile, every hit classified M2/Finisher per the card's corrected note. Assumes one target receives all hits; spreading across nearby enemies and Spiritual Energy consumption are manual. This is a separate activation, not a replacement of the normal RMB panel." }
    },
    caci_king_spirit: {
        previewInputs: ["channelSeconds"],
        getMechanicsPreview() { const seconds = input(this, "channelSeconds"); return [row("Initial aura duration", 20, "s"), row("Maximum additional dance", 30, "s"), row("Selected aura duration", seconds === undefined ? undefined : 20 + Math.min(30, seconds), "s"), row("Initial dodge window", 3, "s")]; },
        support: { "status": "Partial", "details": "Shows 20s initial aura plus a manually entered additional channel capped at 30s, and the fixed 3s initial dodge window. Kings Luck application, potency, proc/crit/dodge rates, and Earth/Air healing lack coefficients and are not invented." },
        id: "caci_king_spirit",
        name: "Caci King Spirit",
        category: "Perk",
        description: "Upon reaching max stacks of spiritual energy using a rune boosts the luck of nearby allies and yourself.",
        "source": {
            "cardId": "69214b9831723704c1edacb0",
            "cardUrl": "https://trello.com/c/Q2MKbZhm"
        },
    },
    caci_spirit: {
        id: "caci_spirit",
        name: "Caci Spirit",
        category: "Perk",
        description: "Release your Spiritual Energy with an RMB, which causes you to fires off a flurry of thorns before slamming the ground thrice. Every hit inflicts Bleed.",
        "source": {
            "cardId": "69214b9831723704c1edac92",
            "cardUrl": "https://trello.com/c/BaNYOPmt"
        },
        damageScalings: { Dexterity: 1 }, damageTypes: { Physical: 1 },
        getPerkDamageInfo(amount) { return positivePerk(amount) ? { ...activation("caci_spirit", 5, "Weapon"), sourceDamageType: "M2", tags: ["Weapon", "M2", "Finisher"], hitAmount: 7 } : null; },
        getPerkDamageStages(amount) {
            if (!positivePerk(amount))
                return [];
            return [
                { name: "Caci Spirit: Thorns", packet: { ...activation("caci_spirit", 5, "Weapon"), sourceDamageType: "M2", hitAmount: 7 } },
                { name: "Caci Spirit: Slams", packet: { ...activation("caci_spirit", 6, "Weapon"), sourceDamageType: "M2", hitAmount: 3 } },
            ];
        },
        support: { "status": "Partial", "details": "Previews seven 5-base thorn hits and three 6-base slams as separate segments, each Physical output with 1 Dexterity scaling. RMB/Finisher classification is an explicit convention. Separate segments preserve per-hit flat reductions; Bleed, Spiritual Energy, and slam guardbreak are manual." }
    },
    cannonball: {
        id: "cannonball",
        name: "Cannonball",
        category: "Perk",
        description: "Using a summon stores it, using a RMB right after a summon has been stored fires it outward. Your summons additionally have a larger zone before they return to your character.",
        "source": {
            "cardId": "69214b9731723704c1edaa02",
            "cardUrl": "https://trello.com/c/uehJXat7"
        },
    },
    carapace: {
        id: "carapace",
        name: "Carapace",
        category: "Perk",
        description: "Gain low Protection scaling off of your Earth Boost. Additionally, gain sizable Damage and Stun Reduction if you have remaining Shield.",
        statPriority: 40,
        onStatCalculation(amount) {
            if (positivePerk(amount))
                addStat(this, "Protection", 0.05 * (this.stats.EarthBoost || 0) * amount);
        },
        onDmgReducedMultiplier(amount) {
            return positivePerk(amount) && hasBuff(this, "protection_shield_active") ? 0.15 * amount : null;
        },
        support: { "status": "Partial", "details": "Adds 0.05 * Earth Boost * perk amount Protection. Select Protection Shield Active while shield remains for 15% diminishing-return damage reduction per perk. Shield depletion and stun immunity are not simulated." },
        "source": {
            "cardId": "69214b9731723704c1eda358",
            "cardUrl": "https://trello.com/c/YF2qDXA9"
        }
    },
    carrying_winds: {
        id: "carrying_winds",
        name: "Carrying Winds",
        category: "Perk",
        description: "Take and deal more Knockback with Attacks. Additionally, moves that qualify as 'High Knockback' gains a Damage Boost and an Air Boost-scaling Crit chance bonus.",
        "source": {
            "cardId": "69214b9731723704c1eda4ac",
            "cardUrl": "https://trello.com/c/fLKoazAe"
        },
        onDmgBonusMultiplier(amount, args) { return positivePerk(amount) && selected(this, "high_knockback") && isDirectPacket(args) ? 0.1 * amount : null; },
        support: { "status": "Partial", "details": "Select High Knockback for 10% damage per perk on qualifying direct packets. Qualification and knockback physics are manual. The card's tentative Air-based crit formula is not treated as verified and is not applied." }
    },
    caster: {
        id: "caster",
        name: "Caster",
        category: "Perk",
        description: "Gain rune and weapon art cooldown reduction",
        cooldown: { sources: ["Rune", "WeaponArt"], ratePerPerk: 0.15 },
        support: { "status": "Implemented", "details": "Adds 15% diminishing-return Rune/Weapon Art CDR per perk. Preview divides by 1 plus the summed reviewed CDR rates, then applies direct race/perk factors. Grouped stacking order is a documented builder convention." },
        "source": {
            "cardId": "69214b9731723704c1eda344",
            "cardUrl": "https://trello.com/c/bNACVMcB"
        }
    },
    caustic_slow: {
        id: "caustic_slow",
        name: "Caustic Slow",
        category: "Perk",
        description: "Slow effect deals a true damage DOT that scales with poison potency. Grants poison potency.",
        "source": {
            "cardId": "69214b9731723704c1eda3e6",
            "cardUrl": "https://trello.com/c/ui2vFOBz"
        },
        onStatCalculation(amount) { if (positivePerk(amount))
            addPotency(this, "poisonpotency", amount); },
        support: { "status": "Partial", "details": "Adds the verified additive Poison potency point per perk. The True-damage Slow tick formula is missing; no True DoT is invented and Sticky does not trigger one." }
    },
    cauterize: {
        id: "cauterize",
        name: "Cauterize",
        category: "Perk",
        description: "All instances of Burn you inflict on enemies now instead applies Singed. Singed counts as 'Burn' for all related effects, but instead does a burst of Fire Damage on first application rather than over time.",
        "source": {
            "cardId": "69214b9731723704c1eda40e",
            "cardUrl": "https://trello.com/c/LPSC2zXY"
        },
        damageScalings: { Fire: 1.5 }, damageTypes: { Fire: 1 },
        getPerkDamageInfo(amount) { return positivePerk(amount) ? activation("cauterize", 2 * (1 + 0.133333 * (this.potencies.burnpotency || 0))) : null; },
        support: { "status": "Partial", "details": "Its applicant's Burn ticks on enemies become zero-damage Singed while retaining the Burn identity and other related effects. A separate first-application burst uses 2 base, 1.5 Fire scaling/output Fire, and +13.3333% per additive Burn potency point, following the linked potency-stat card. Burst trigger/reapplication and non-damage proc chains are manual." }
    },
    channeled_depths: {
        id: "channeled_depths",
        name: "Channeled Depths",
        category: "Perk",
        description: "Slowly gain potency on a status that makes your next attack deal a high amount of water damage type",
        "source": {
            "cardId": "69214b9731723704c1eda378",
            "cardUrl": "https://trello.com/c/bp27uuZ2"
        },
        sourcepotencies: { channeleddepthspotency: 0 },
        support: { "status": "Partial", "details": "Select Channeled Depths and enter accumulated potency: the shared state adds 5 * game potency Water output to a positive direct hit. Zero damage cannot activate it. Buildup, perk-dependent cap progression, hit consumption, and game-buff classification remain unverified/manual." }
    },
    channeled_weapon: {
        id: "channeled_weapon",
        name: "Channeled Weapon",
        category: "Perk",
        description: "Adds slight magic damage type to all attacks and reduces weapon art cooldown.",
        outputPriority: 100,
        onOutputCalculation(amount, args) {
            if (positivePerk(amount) && isDirectPacket(args))
                addOutput(this, "Magic", 0.05 * amount);
        },
        cooldown: { sources: ["WeaponArt"], directBase: 0.8, directPerPerk: -0.05 },
        support: { "status": "Partial", "details": "Direct packets gain 0.05 Magic output per perk. Weapon Art cooldown gets the direct multiplier max(0, 0.8 - 0.05 * perk amount), after grouped diminishing-return CDR. DoT applicability and cross-conversion order are not verified." },
        "source": {
            "cardId": "69214b9731723704c1eda3b6",
            "cardUrl": "https://trello.com/c/Cu6Kzi1Z"
        }
    },
    cinder_soul: {
        id: "cinder_soul",
        name: "Cinder Soul",
        category: "Perk",
        description: "Burn instead heals you and increases your movement speed. Grants burn potency.",
        "source": {
            "cardId": "69214b9731723704c1eda3de",
            "cardUrl": "https://trello.com/c/TMue1p2w"
        },
        onStatCalculation(amount) { if (positivePerk(amount))
            addPotency(this, "burnpotency", amount); },
        onFinalDamageTakenMultiplier(amount, args) { return positivePerk(amount) && args?.baseDamageData?.sourceType === "Status" && args.baseDamageData.source === "burn" ? 0 : null; },
        support: { "status": "Partial", "details": "Adds one additive Burn potency point per perk per the Burn Potency source card. Burn ticks on this holder cause zero damage, while Burn remains selected as a debuff. Its replacement healing and movement bonus have no verified formula and are not calculated. Direct Fire hits remain damaging." }
    },
    civilian: {
        id: "civilian",
        name: "Civilian",
        category: "Perk",
        description: "Not having your weapon out for more than 3 seconds heavily boosts rune damage and allows you to block without a weapon out.",
        onDmgBonusMultiplier(amount, args) {
            return positivePerk(amount) && selected(this, "civilian_ready") && args?.baseDamageData?.sourceType === "Rune" ? 0.4 * amount : null;
        },
        support: { "status": "Partial", "details": "Select Civilian Ready once the weapon has been stowed for more than three seconds: Rune damage gains 40% per perk. Weapon/blocking state and automatic activation are not simulated." },
        "source": {
            "cardId": "69214b9731723704c1eda9f2",
            "cardUrl": "https://trello.com/c/llhxquuy"
        }
    },
    cleansed_blade: {
        id: "cleansed_blade",
        name: "Cleansed Blade",
        category: "Perk",
        description: "Using the Cleanse Weapon Art specifically grants you a Neutral status, which grants a Damage Buff scaling on your Water Boost* and enables you to heal allies for a fraction of it on hit.",
        "source": {
            "cardId": "69214b9831723704c1edae2e",
            "cardUrl": "https://trello.com/c/KAChfnOD"
        },
        getSourcePotencies(amount) { return { cleansedbladepotency: 0.1 * amount }; },
        support: { "status": "Partial", "details": "Offers Cleansed Blade at 0.1 potency per perk. Its shared real buff supplies a separate damage fraction of 1.5 * effective game potency * holder Water Boost / 100, rather than modifying Water scaling. Transferred-buff scaling ownership needs verification; healing, Cleanse activation, and duration are manual." }
    },
    cleave: {
        id: "cleave",
        name: "Cleave",
        category: "Perk",
        description: "Widen the Hitbox of all your Finishers. Additionally, Finishers inflict Armor Break.",
        sourcepotencies: { shatterpotency: 0.1 },
        onDmgBonusMultiplier(amount) {
            return positivePerk(amount) && hasDebuff(this.target, "shatter") ? 0.2 : null;
        },
        support: { "status": "Partial", "details": "Selected target Shatter grants a fixed 20% damage bonus regardless of perk amount. Offers its fixed 0.1 Shatter source; finisher application and hitboxes are manual." },
        "source": {
            "cardId": "69214b9731723704c1eda406",
            "cardUrl": "https://trello.com/c/bKFIKrFD"
        }
    },
    colossus: {
        getMechanicsPreview(amount) { return [row("Additional stun resistance", .2 * amount, "s"), row("Mounts", "Disabled while Colossus is equipped")]; },
        support: { "status": "Partial", "details": "Calculates 0.2s stun resistance per perk and disables shared mounted-scenario bonuses while equipped, including fractional amounts. Character/hitbox size, additional poise damage, and undocumented stun combination rules are held." },
        id: "colossus",
        name: "Colossus",
        category: "Perk",
        description: "Slightly increase your character size, poise damage dealt, stun resistance, and M1/M2 hitbox size. Additionally mounts are disabled when using this ring.",
        "source": {
            "cardId": "69214b9831723704c1edacfe",
            "cardUrl": "https://trello.com/c/Nlx5Zfld"
        },
    },
    concealed_edge: {
        id: "concealed_edge",
        name: "Concealed Edge",
        category: "Perk",
        description: "Standing in shadows grants bonus Hex Damage Type to all Damage tied to you, as well as increasing the range of your LMB's and RMB's.",
        outputPriority: 100,
        onOutputCalculation(amount) {
            if (positivePerk(amount) && lighting(this) === "shadow")
                addOutput(this, "Hex", 0.25 * amount);
        },
        support: { "status": "Partial", "details": "In Shadows adds 0.25 Hex output per perk to the current packet, explicitly including DoTs. Does not change the saved damage profile; weapon range is not simulated." },
        "source": {
            "cardId": "69214b9731723704c1eda45e",
            "cardUrl": "https://trello.com/c/nGoxB9AM"
        }
    },
    concussion: {
        id: "concussion",
        name: "Concussion",
        category: "Perk",
        description: "Gain bonus poise damage and bonus stun based on your tenacity.",
        "source": {
            "cardId": "69214b9831723704c1edae72",
            "cardUrl": "https://trello.com/c/e5WgT8RN"
        },
    },
    conquerer: {
        id: "conquerer",
        name: "Conquerer",
        category: "Perk",
        description: "Conquerer",
        "source": {
            "cardId": "69214b9731723704c1eda46a",
            "cardUrl": "https://trello.com/c/NmYis80y"
        },
    },
    cosmic_ray: {
        id: "cosmic_ray",
        name: "Cosmic Ray",
        category: "Perk",
        description: "Changes your RMB, you wave your weapon around then shoots a beam forward.",
        "source": {
            "cardId": "69214b9731723704c1eda444",
            "cardUrl": "https://trello.com/c/ZS6gvenU"
        },
        weaponPriority: 60,
        modifyWeaponConstruction(amount, data) { if (positivePerk(amount)) {
            data.constructionType += " + Cosmic Ray";
            data.m2 = [[18.5, 1]];
        } },
        support: { "status": "Partial", "details": "Replaces RMB with one 18.5-base Cosmic Ray, favoring its specific card over the general construction card's older 14. Retains weapon output/scaling as an explicit inference. The linked exclusions and beam timing are not simulated. Construction is resolved after existing stances. Conflicts with other replacement perks use documented builder priority, pending in-game verification; animation, knockback, and automatic applications are not simulated." }
    },
    counting_sheep: {
        poise: { bonusPerPerk: .1, requiredTargetDebuff: "slow" },
        support: { "status": "Partial", "details": "Adds 10% poise damage per perk against target Slow in the separate Poise Damage panel, including M2. Does not change HP damage. Slow application chance/potency is unspecified and remains manually selected; base poise and stagger thresholds are unknown." },
        id: "counting_sheep",
        name: "Counting Sheep",
        category: "Perk",
        description: "Applies slowness to enemies hit by the end of your combo. Additionally increases poise damage dealt to slowed enemies.",
        "source": {
            "cardId": "69214b9731723704c1eda376",
            "cardUrl": "https://trello.com/c/wxSbJKwK"
        },
    },
    crimson_tithe: {
        getMechanicsPreview(amount) { const base = 4 + 4 * amount; return [...healRows(this, "Burst healing", base, { Physical: .7, Air: .7 }), ...healRows(this, "Self healing", base * .2, { Physical: .7, Air: .7 }), ...healRows(this, "Tether tick", base / 15, { Physical: .7, Air: .7 }), row("Tether ticks / cooldown", "15 ticks / 15s")]; },
        support: { "status": "Partial", "details": "Previews burst base healing 4+4p with 0.7 Physical/Air scaling, 20% self heal, and burst/15 for each of 15 tether ticks. Scoped Heal Boost/critical healing is shown separately. Fifteen-second cooldown is informational. HP consumption damage coefficient is missing, so no self damage, tether timeline, or automatic trigger is invented." },
        id: "crimson_tithe",
        name: "Crimson Tithe",
        category: "Perk",
        description: "After using your Weapon Art, consume a proportional amount of HP depending on your current HP to release an AoE heal that tethers all affected. Tethered Allies are additionally healed over time.",
        "source": {
            "cardId": "69214b9831723704c1edacc2",
            "cardUrl": "https://trello.com/c/YymDDmmN"
        },
    },
    critical_healing: {
        previewInputs: ["baseHeal"],
        getMechanicsPreview(amount) { return [row("Critical heal chance", chance(20 + (this.stats.HolyBoost || 0) / 5), "%"), row("Critical heal bonus", 16.5 * amount, "%"), ...healRows(this, "Entered healing", input(this, "baseHeal"))]; },
        support: { "status": "Partial", "details": "Healing previews gain 20 + HolyBoost/5 percent critical chance and 16.5% extra healing per perk on a critical heal. Chance is bounded to 0-100%; without this perk healing cannot crit. Displays normal, critical, and expected healing separately. No random heal rolls or undocumented per-source/recipient interactions are simulated." },
        id: "critical_healing",
        name: "Critical Healing",
        category: "Perk",
        description: "Healing has a chance to crit healing more than usual.",
        "source": {
            "cardId": "69214b9731723704c1eda3b8",
            "cardUrl": "https://trello.com/c/uCZ5UuSy"
        },
    },
    critical_master: {
        id: "critical_master",
        name: "Critical Master",
        category: "Perk",
        description: "Your crits always Guardbreak and gain a small Damage Boost.",
        critical: { "damagePerPerk": 0.05 },
        "source": {
            "cardId": "69214b9731723704c1eda34e",
            "cardUrl": "https://trello.com/c/rmIA1Ef1"
        },
    },
    croakernaut_spirit: {
        id: "croakernaut_spirit",
        name: "Croakernaut Spirit",
        category: "Perk",
        description: "Upon reaching max stacks of spiritual energy right clicking causes you to summon croakernauts that give reinforce.",
        sourcepotencies: { reinforcepotency: 0.5 },
        support: { "status": "Partial", "details": "Offers fixed 0.5 Reinforce potency from the spirit Croakernauts. Spirit summoning, spiritual energy, and duration are not simulated." },
        "source": {
            "cardId": "69214b9831723704c1edac9a",
            "cardUrl": "https://trello.com/c/wczMlNo3"
        }
    },
    crushing_pressure: {
        id: "crushing_pressure",
        name: "Crushing Pressure",
        category: "Perk",
        description: "Gain corresponding Armor Penetration scaling off of said specific Defenses of the enemy.",
        onArmorPenCalculation(amount, args) {
            if (!positivePerk(amount) || !args?.outputType || args.outputType === "True")
                return null;
            const defense = this.target?.stats[(args.outputType + "Defense")] || 0;
            return defense > 0 ? (0.15 * defense + 10) * amount : null;
        },
        support: { "status": "Implemented", "details": "For each non-True output with positive matching target Defense, adds (15% of that Defense + 10) penetration per perk. Zero or negative matching Defense does not activate it; never changes the global penetration stat." },
        "source": {
            "cardId": "69214b9731723704c1edaa14",
            "cardUrl": "https://trello.com/c/G7uxNYkI"
        }
    },
    cryo_engine: {
        id: "cryo_engine",
        name: "Cryo Engine",
        category: "Perk",
        description: "Gain a chance to inflict frostbite on hits as well as converting all your slows to it. Frostbite slows the opponent but additionally increases Air and Water Damage taken by a flat amount. Applying Frostbite grants you Tailwind.",
        getSourcePotencies(amount) { return { tailwindpotency: 0.2 + 0.1 * amount }; },
        support: { "status": "Partial", "details": "Offers 0.2 + 0.1 * perk amount Tailwind after Frostbite application. Select Frostbite on the target for its existing fixed 10% Air/Water vulnerability. Slow conversion, rolls, and durations are manual." },
        "source": {
            "cardId": "69214b9731723704c1eda494",
            "cardUrl": "https://trello.com/c/gcnekmwY"
        }
    },
    curse_rip: {
        id: "curse_rip",
        name: "Curse Rip",
        category: "Perk",
        description: "Hits against a Debuffed opponent gains Lifesteal as well as a Damage Boost that scales on the amount of unique ones on them.",
        onDmgBonusMultiplier(amount, args) {
            return positivePerk(amount) && isProcHit(args) ? 0.05 * getDebuffCount(this.target) * amount : null;
        },
        support: { "status": "Partial", "details": "Direct proc-capable hits gain 5% damage per distinct target debuff per perk. Consumed statuses no longer count. Healing coefficients are unknown and are not inferred." },
        "source": {
            "cardId": "69214b9731723704c1eda448",
            "cardUrl": "https://trello.com/c/J5kPDe3y"
        }
    },
    cursed_bark: {
        id: "cursed_bark",
        name: "Cursed Bark",
        category: "Perk",
        description: "Gain a small chance to inflict a random, unmodified Debuff against said enemy when hit. Gain Damage Reduction against Enemies with Debuffs that scales on the amount of unique ones on them.",
        onDmgReducedMultiplier(amount) {
            return positivePerk(amount) ? 0.05 * getDebuffCount(this.target) * amount : null;
        },
        sourcepotencies: { shatterpotency: 0.2, weakeningpotency: 0.5 },
        support: { "status": "Partial", "details": "Incoming damage is reduced with diminishing returns by 5% per distinct debuff on the attacker per perk. Offers documented fixed Shatter/Weakness sources; random application and unspecified DoT source potencies are not inferred." },
        "source": {
            "cardId": "69214b9731723704c1eda48e",
            "cardUrl": "https://trello.com/c/R9Ua8FaJ"
        }
    },
    cursed_experiment: {
        id: "cursed_experiment",
        name: "Cursed Experiment",
        category: "Perk",
        description: "Using your Rune below 50% HP grants strong Regeneration, Rage, guaranteed Crit, and the Hexigen status, but inflicts you with high potency Slow afterwards.",
        sourcepotencies: {
            ragepotency: 0.3,
            regenpotency: 1,
        },
        "source": {
            "cardId": "69214b9731723704c1eda490",
            "cardUrl": "https://trello.com/c/z7h9nzc4"
        },
    },
    cursed_flames: {
        id: "cursed_flames",
        name: "Cursed Flames",
        category: "Perk",
        description: "Burn weakens and deals dmg as hex. Grants burn potency.",
        "source": {
            "cardId": "69214b9731723704c1eda3b2",
            "cardUrl": "https://trello.com/c/9SLLJiPB"
        },
        onStatCalculation(amount) { if (positivePerk(amount))
            addPotency(this, "burnpotency", amount); },
        outputPriority: 200,
        onOutputCalculation(amount, args) {
            if (!positivePerk(amount) || args?.baseDamageData?.sourceType !== "Status" || args.baseDamageData.source !== "burn")
                return;
            this.damageTypes = { Fire: 0.5, Hex: 0.5 };
            this.damageScalings = { Fire: 1, Hex: 1 };
        },
        support: { "status": "Partial", "details": "Adds one additive Burn potency point per perk per the Burn Potency source card. This applicant's Burn uses half Fire/Hex output with 1 Fire and Hex scaling. Shared Burn weakens its holder by 0.1 + 0.1 * applicant additive Burn potency points, separate from Weakness. Eligible Endless Despair uses the documented alternate weakening formula 0.2 + 0.1 * applicant additive Burn potency points * Endless Despair amount. Its additional Burn-duration increase is unspecified and remains held; the general Endless Despair duration preview is available." }
    },
    dark_harvest: {
        id: "dark_harvest",
        name: "Dark Harvest",
        category: "Perk",
        description: "Hits against an enemy below 50% Guardbreaks them and deals a high amount of additional Hex Damage and heals you, but with a Cooldown per enemy.",
        "source": {
            "cardId": "69214b9731723704c1edaa18",
            "cardUrl": "https://trello.com/c/0m1Y9ru4"
        },
        damageScalings: { "Hex": 1 }, damageTypes: { "Hex": 1 },
        getPerkDamageInfo(amount) { if (!positivePerk(amount))
            return null; const hp = healthRatio(this.target); if (hp === undefined || hp >= 0.5)
            return null; return activation("dark_harvest", 20 + 20 * amount, "Perk"); },
        support: { "status": "Partial", "details": "One qualifying below-half-health burst has 20 + 20 * perk amount base and 1 Hex scaling/output. Selected target HP must be strictly below half; an initiating hit crossing that threshold is represented by updating HP manually. Healing/guard break are excluded. This is an independent activation preview, not automatic DPS. Trigger rolls, cooldowns, area/target counts, and unspecified proc/crit rules are not simulated." }
    },
    dark_magic: {
        id: "dark_magic",
        name: "Dark Magic",
        category: "Perk",
        description: "you take some self damage when you hit people with magic damage. Additionally all attacks that deal magic damage deal bonus hex damage.",
        outputPriority: 50,
        onOutputCalculation(amount, args) {
            if (positivePerk(amount) && isDirectPacket(args) && (this.damageTypes.Magic || 0) > 0)
                addOutput(this, "Hex", 0.2 * amount);
        },
        support: { "status": "Partial", "details": "Direct packets containing Magic gain 0.2 Hex output per perk. Runs before Spirit Winds converts Air, so Magic introduced only by Spirit Winds cannot trigger it. Self damage and DoT applicability are not calculated." },
        "source": {
            "cardId": "69214b9731723704c1eda4aa",
            "cardUrl": "https://trello.com/c/mgNRFUsc"
        }
    },
    darkening_hex: {
        id: "darkening_hex",
        name: "Darkening Hex",
        category: "Perk",
        description: "Hex damage has a chance to increase the potency and the duration of a debuff on hit.",
        "source": {
            "cardId": "69214b9731723704c1eda3bc",
            "cardUrl": "https://trello.com/c/RCi9GMQG"
        },
    },
    deathmist_slash: {
        id: "deathmist_slash",
        name: "Deathmist Slash",
        category: "Perk",
        description: "Finishers send out a slash of death mist that cleanses and heals allies and damage enemies. If you do not hit an enemy the heal is halved. You get healed by the slash but it is heavily reduced and doesnt cleanse.",
        baseDamage: 1.6,
        damageScalings: {
            Water: 1,
            Hex: 1,
        },
        damageTypes: {
            Water: 0.5,
            Hex: 0.5,
        },
        "source": {
            "cardId": "69214b9831723704c1edac40",
            "cardUrl": "https://trello.com/c/gbbaaKXJ"
        },
    },
    deep_spider_spirit: {
        id: "deep_spider_spirit",
        name: "Deep Spider Spirit",
        category: "Perk",
        description: "Upon reaching max stacks of spiritual energy using a rune summons a small spider to inject you with poison and a antivenom that temporarily makes you take 90% less hex damage and increases your movement speed.",
        "source": {
            "cardId": "69214b9831723704c1edaca6",
            "cardUrl": "https://trello.com/c/epRyrAAG"
        },
        statusEffects: ["anti_venom"],
        support: { "status": "Partial", "details": "Select the shared neutral Anti-Venom status: fixed 90% direct Hex resistance and +20 Movement Speed points, independent of owning the perk. The neutral-status card corrects the quoted immunity description. Poison application/duration extension, Spiritual Energy, and expiration are manual." }
    },
    deepcrystal_calling: {
        getMechanicsPreview(amount) { return [...healRows(this, "Crystal tick (known base only)", .5 + amount / 10), row("Nominal tick count", 4 * amount), row("Cooldown", 10, "s"), row("Limit", "Unspecified diminishing returns / fractional tick rounding held; requires cleansing another ally")]; },
        support: { "status": "Partial", "details": "Previews base healing 0.5+p/10 per crystal tick, nominal 4p ticks, and 10s cooldown after cleansing another ally or summon. The source reports unspecified small diminishing returns; fractional tick rounding, unknown scaling/level factors, and exact total healing are not invented. No Radiance compatibility is assumed." },
        id: "deepcrystal_calling",
        name: "Deepcrystal Calling",
        category: "Perk",
        description: "Using a heal that cleanses creates a deepcrystal which heals nearby allies for a bit. 10 second cooldown.",
        "source": {
            "cardId": "69214b9831723704c1edac44",
            "cardUrl": "https://trello.com/c/CeebgPXn"
        },
    },
    defensive_stance: {
        id: "defensive_stance",
        name: "Defensive Stance",
        category: "Perk",
        description: "You can no longer be guard broken but take full damage from guard breaks even when blocking additionally being attacked by taunted enemies deals less damage.",
        "source": {
            "cardId": "69214b9731723704c1eda49e",
            "cardUrl": "https://trello.com/c/0PXUJlbQ"
        },
        onDmgReducedMultiplier(amount) { return positivePerk(amount) && hasDebuff(this.target, "taunt") ? 0.33 : null; },
        support: { "status": "Partial", "details": "Incoming attacks from a selected Taunted opponent gain a fixed 33% reduction bonus, independent of perk amount. Uses the builder's diminishing-return reduction convention; the card does not specify direct versus diminishing stacking. Guard-break behavior is not simulated." }
    },
    delta_drill: {
        weaponPriority: 100,
        modifyWeaponPackets(amount, packets) {
            const repeats = Math.round(amount), result = [];
            for (const packet of packets.m1) {
                if (!packet.tags?.includes("Finisher")) {
                    result.push(packet);
                    continue;
                }
                const copies = repeats + 1, explicit = Math.min(copies, 3);
                for (let i = 0; i < explicit; i++)
                    result.push({ ...packet, damage: packet.damage * (1 - Math.min(.7, .4 + .1 * i)) });
                if (copies > 3)
                    result.push({ ...packet, damage: packet.damage * .3, hitAmount: packet.hitAmount * (copies - 3) });
            }
            packets.m1 = result;
        },
        getMechanicsPreview(amount) { return [row("Additional M1 finishers", Math.round(amount)), row("First / second / third / later damage", "60% / 50% / 40% / 30%"), row("Speed per next finisher", 1.25, "x"), row("Condition", "Select Last M1 Is a Finisher only for a qualifying weapon")]; },
        support: { "status": "Partial", "details": "Repeats explicitly tagged M1 finishers using rounded perk amount, preserving all hits and original combo step. Damage falls 40/50/60/70% across the chain, capped at 70%; later equal repeats aggregate without a huge loop. Requires the Last M1 Is a Finisher scenario. M2 and unclassified M1 are unchanged. Attack timing, unknown reduced proc coefficient, and finisher-perk damage ordering remain held." },
        id: "delta_drill",
        name: "Delta Drill",
        category: "Perk",
        description: "Repeat your M1 finisher an additional time at an accelerated rate but deal slightly less damage with m1 finishers.",
        "source": {
            "cardId": "69214b9831723704c1edacfa",
            "cardUrl": "https://trello.com/c/Szy3MKSH"
        },
    },
    deltabit: {
        id: "deltabit",
        name: "Deltabit",
        category: "Perk",
        description: "Replaces the Finisher of your LMB combo with your RMB instead. Additionally, Finishers gain a Damage Boost.",
        "source": {
            "cardId": "69214b9831723704c1edaf16",
            "cardUrl": "https://trello.com/c/HOIhXp9a"
        },
        onDmgBonusMultiplier(amount, args) { return positivePerk(amount) && args?.baseDamageData?.sourceType === "Weapon" && args.baseDamageData.sourceDamageType === "M2" ? 0.1 * amount : null; },
        support: { "status": "Partial", "details": "Weapon M2 packets gain the documented 10% damage per perk. M1-finisher replacement and whether its replacement inherits this bonus remain unverified and are not calculated." }
    },
    dire_buni_spirit: {
        getPerkDamageInfo(amount) { return positivePerk(amount) ? { ...activation("dire_buni_spirit", 25, "Weapon"), sourceDamageType: "M2", damageScalings: { ...this.damageScalings }, damageTypes: { Physical: 1 } } : null; },
        getMechanicsPreview() { return [row("Activation base damage", 25), row("Output", "Specific Stats entry says 1 Physical; contradictory prose about True is held")]; },
        support: { "status": "Partial", "details": "Separate fixed-base-25 RMB finisher activation using weapon scaling and the specific 1 Physical output entry. The prose mentions partial True damage without an amount, so the explicit Stats entry takes priority. Full Spiritual Energy, teleport, proc-chance enhancement, and guardbreak are manual." },
        id: "dire_buni_spirit",
        name: "Dire Buni Spirit",
        category: "Perk",
        description: "Release your Spiritual Energy with an RMB, which causes you to teleport to a nearby opponent with an instantaneous headbutt that deals partial True Damage. Counts as a Finisher.",
        "source": {
            "cardId": "69214b9831723704c1edac94",
            "cardUrl": "https://trello.com/c/qBlTxuLs"
        },
    },
    directive: {
        id: "directive",
        name: "Directive",
        category: "Perk",
        description: "Your summons only swap aggro on landing an RMB causes all your summons to focus one mob and gain a damage Buff or when using a rune cause your summons to attack random enemies around you and gain the Reinforce Buff.",
        sourcepotencies: {
            reinforcepotency: 0.1,
        },
        "source": {
            "cardId": "69214b9831723704c1edaee8",
            "cardUrl": "https://trello.com/c/WerWoOmd"
        },
    },
    divine_crash: {
        id: "divine_crash",
        name: "Divine Crash",
        category: "Perk",
        description: "RMB'ing whilst in the air teleports you down to the floor in a Holy and Air explosion. Scales on both as well as your distance from the floor.",
        "source": {
            "cardId": "69214b9731723704c1eda98a",
            "cardUrl": "https://trello.com/c/yTMXYt04"
        },
    },
    divine_intervention: {
        previewInputs: ["healingReceived"],
        getMechanicsPreview(amount) { const healing = input(this, "healingReceived"); return [row("Healing copied to each summon", healing === undefined ? undefined : healing * amount), row("Transfer", "100% per perk; direct summon healing stacks separately"), row("Buff copies", "Manual; compatible list in perk source; no automatic copied buff state")]; },
        support: { "status": "Partial", "details": "Shows healing received by the player * perk amount as the extra healing each summon receives, stacking separately with directly healing that summon. Input is already received healing, so Heal Boost/critical healing is not applied twice. Compatible buff transfer remains manual; no invented summon actor state or unsupported buff copies." },
        id: "divine_intervention",
        name: "Divine Intervention",
        category: "Perk",
        description: "Buffs and a portion of your heals get added to your summons as well.",
        "source": {
            "cardId": "69214b9731723704c1eda432",
            "cardUrl": "https://trello.com/c/AW93Cuu3"
        },
    },
    divinity: {
        previewInputs: ["remainingWeaponArt"],
        getMechanicsPreview(amount) { const remaining = input(this, "remainingWeaponArt"); return [row("WA cooldown after one finisher", remaining === undefined ? undefined : remaining * Math.max(0, 1 - .1 * amount), "s"), row("Activation", "Once per finisher, not once per hit")]; },
        support: { "status": "Partial", "details": "Separate current-cooldown snapshot reduces remaining Weapon Art cooldown by 10% per perk, floored at zero, once per finisher. Does not reduce the skill's base/static cooldown or multiply by hit count. Input represents current remaining seconds; event order, delays, and live countdown remain manual." },
        id: "divinity",
        name: "Divinity",
        category: "Perk",
        description: "Finishers reduce WA cooldown by a percentage.",
        "source": {
            "cardId": "69214b9731723704c1eda436",
            "cardUrl": "https://trello.com/c/5H07OAEZ"
        },
    },
    dominating: {
        id: "dominating",
        name: "Dominating",
        poise: { bonusPerPerk: 0.2, requiredTargetDebuff: "taunt", placeholder: true },
        support: { status: "Partial", details: "User-authorized placeholder: +20% poise damage per perk while the target has Taunt. Shown in the separate Poise Damage preview; does not increase HP damage. Underlying attack poise values, stagger thresholds, and the actual game coefficient are unknown. Taunt application is manual." },
        category: "Perk",
        description: "Enemies are more vulnerable to your poise damage afflicted with the Taunt Debuff.",
        "source": {
            "cardId": "69214b9831723704c1edaeba",
            "cardUrl": "https://trello.com/c/yzimqjId"
        },
    },
    draconic_blood: {
        getSourcePotencies(amount) { return { draconicinfusionpotency: amount / 10 }; },
        getPerkDamageStages(amount) {
            if (!positivePerk(amount))
                return [];
            const color = draconicColor(this);
            if (!color || this.race?.id !== "dragon_blooded")
                return [];
            const multiplier = color === "Earth" ? 1.5 : color === "Water" ? 1.1 : 1;
            return [{ name: "Dragon Claw", packet: { ...activation("dragon_claw", (25 + 2.5 * amount) * multiplier, "Rune"), damageTypes: { [color]: 1 }, damageScalings: { [color]: 1 } } },
                { name: "Dragon Bubble", packet: { ...activation("dragon_bubble", (20 + 2 * amount) * multiplier, "Rune"), damageTypes: { [color]: 1 }, damageScalings: { [color]: 1 } } }];
        },
        getMechanicsPreview() { const color = draconicColor(this); return [row("Claw cooldown", color === "Air" ? 3.75 : 5, "s"), row("Bubble cooldown", color === "Air" ? 5.25 : 7, "s"), row("Infusion duration / cooldown", "20s / 35s"), row("Damage preview", this.race?.id !== "dragon_blooded" ? "Non-Dragon damage penalty unknown; damage preview held" : !color ? "Select exactly one Draconic Color" : "Claw and Bubble are separate Rune activations")]; },
        support: { "status": "Partial", "details": "Offers Draconic Infusion at 0.1 potency per perk, adding the selected applicant color to all output (0.075 Physical or 0.1 elemental per 0.1 potency). Dragon Blooded Claw/Bubble previews use base 25+2.5p / 20+2p, 1 color scaling/output, Earth x1.5 and Water x1.1 damage. Color is selected manually; non-Dragon damage is held because the penalty is unspecified. Claw/Bubble cooldowns show fixed Air x0.75. Other cooldown interactions, healing, random debuffs, stun, and automatic Rune replacement remain manual." },
        id: "draconic_blood",
        name: "Draconic Blood",
        category: "Perk",
        description: "Your rune infusion is forced as a draconic ability from the draconic shrine. The more of this perk you have the more damage your draconic abilities do. If you are not dragon blooded your abilities deal less damage.",
        "source": {
            "cardId": "69214b9731723704c1edac16",
            "cardUrl": "https://trello.com/c/GtEdo60J"
        },
    },
    draconic_runes: {
        id: "draconic_runes",
        name: "Draconic Runes",
        category: "Perk",
        description: "All runes deal additional elemental damage based on your draconic color.",
        "source": {
            "cardId": "69214b9831723704c1edad58",
            "cardUrl": "https://trello.com/c/ryqD3r8n"
        },
        outputPriority: 100,
        onOutputCalculation(amount, args) { if (!positivePerk(amount) || args?.baseDamageData?.sourceType !== "Rune")
            return; const colors = ["Fire", "Water", "Holy", "Hex", "Earth", "Air", "Physical"]; const chosen = colors.filter(color => selected(this, "draconic_color_" + color.toLowerCase())); if (chosen.length === 1)
            addOutput(this, chosen[0], 0.05 * amount); },
        support: { "status": "Partial", "details": "Choose exactly one Draconic Color scenario to add 0.05 output of that color per perk to Rune packets only. Color is manually selected rather than guessed from race/equipment. Conflicting colors produce no bonus; skin changes, infusion, and Draconic Blood are not implemented by this perk." }
    },
    dragigator_spirit: {
        id: "dragigator_spirit",
        name: "Dragigator Spirit",
        category: "Perk",
        description: "Upon reaching max stacks of spiritual energy right clicking unleashes your dragigator spirit in a brutal blast of flames.",
        "source": {
            "cardId": "69214b9831723704c1edac9c",
            "cardUrl": "https://trello.com/c/BHeSYSAo"
        },
    },
    dragon_breath: {
        id: "dragon_breath",
        name: "Dragon Breath",
        category: "Perk",
        description: "Finishers releases a blast of fire that deals minor Damage and applies Burn.",
        onDmgBonusMultiplier(amount) {
            return positivePerk(amount) && hasDebuff(this.target, "burn") ? 0.1 * amount : null;
        },
        support: { "status": "Partial", "details": "Adds 10% damage per perk against selected Burn. Finisher projectiles, their hit decay, proc timing, and Burn application are outside this calculation." },
        "source": {
            "cardId": "69214b9731723704c1eda41c",
            "cardUrl": "https://trello.com/c/KkTA2Oq0"
        }
    },
    dragon_state: {
        id: "dragon_state",
        name: "Dragon State",
        category: "Perk",
        description: "Being above 80% HP makes your LMB's and RMB's send out one additional wave that deals Magic Damage. Scales minorly with Dexterity, Magic and Holy, with a default Proc Coefficient.",
        "source": {
            "cardId": "69214b9731723704c1eda9ee",
            "cardUrl": "https://trello.com/c/sAG0j9u3"
        },
        damageScalings: { "Dexterity": 0.75, "Magic": 0.75, "Holy": 0.75 }, damageTypes: { "Magic": 1 },
        getPerkDamageInfo(amount) { if (!positivePerk(amount))
            return null; const hp = healthRatio(this); if (hp === undefined || hp <= 0.8)
            return null; return activation("dragon_state", 2.5 + 2.5 * amount, "Perk", 1); },
        support: { "status": "Partial", "details": "One wave above 80% HP, 2.5 + 2.5 * perk amount base, 0.75 Dexterity/Magic/Holy scaling, Magic output. The unspecified lower threshold at higher perk amounts is held; the verified >80% range remains usable. Independent activation preview; trigger rolls, timing, area/target counts, and automatic proc chains are not simulated." }
    },
    drone: {
        id: "drone",
        name: "Drone",
        category: "Perk",
        description: "Gain a shield on your summons which grants knockback and stun immunity.",
        "source": {
            "cardId": "69214b9731723704c1eda3d2",
            "cardUrl": "https://trello.com/c/dmygvfPS"
        },
    },
    dual_wielding: {
        id: "dual_wielding",
        name: "Dual Wielding",
        category: "Perk",
        description: "If you’re using a one handed weapon, then your weapon type changes into dual wielding.",
        "source": {
            "cardId": "69214b9731723704c1eda422",
            "cardUrl": "https://trello.com/c/4HpJrVH7"
        },
    },
    echo_blast: {
        id: "echo_blast",
        name: "Echo Blast",
        category: "Perk",
        description: "Summoning a minion shoots a tornado at a nearby enemy, automatically Aggro'ing the minion. Scales on Air and Summon Boost.",
        "source": {
            "cardId": "69214b9731723704c1eda9fe",
            "cardUrl": "https://trello.com/c/pImd8rfP"
        },
        damageScalings: { "Air": 1, "Summon": 1 }, damageTypes: { "Air": 1 },
        getPerkDamageInfo(amount) { if (!positivePerk(amount))
            return null; return activation("echo_blast", 2 + 1.5 * amount); },
        support: { "status": "Partial", "details": "One summon's tornado, 2 + 1.5 * perk amount base with Air and Summon scaling. Multiple summons are not automatically multiplied into this preview. Separate activation preview; trigger rolls, cooldowns, area/target counts, and recursive procs are not simulated. Unspecified proc coefficients and crit eligibility use the existing direct-packet defaults." }
    },
    emergency_exit: {
        id: "emergency_exit",
        name: "Emergency Exit",
        category: "Perk",
        description: "Getting hit while not blocking grants tailwind and reinforce.",
        sourcepotencies: {
            reinforcepotency: 0.3,
        },
        "source": {
            "cardId": "69214b9831723704c1edaed0",
            "cardUrl": "https://trello.com/c/lEAAS9gu"
        },
    },
    emotional: {
        id: "emotional",
        name: "Emotional",
        category: "Perk",
        description: "Having only buffs lowers your weapon art cooldown and makes your weapon art deal bonus hex damage, having only debuffs gives bonus fire damage and attack speed. But having both debuffs and buffs gives bonus healing.",
        statPriority: -10,
        outputPriority: 100,
        onStatCalculation(amount) {
            if (positivePerk(amount) && disposition(this).debuffsOnly)
                addStat(this, "AttackSpeed", 20 * amount);
        },
        onOutputCalculation(amount, args) {
            if (!positivePerk(amount) || !isDirectPacket(args))
                return;
            const state = disposition(this);
            if (state.debuffsOnly)
                addOutput(this, "Fire", 0.2 * amount);
            if (state.buffsOnly && args?.baseDamageData?.sourceType === "WeaponArt")
                addOutput(this, "Hex", 0.2 * amount);
        },
        cooldown: { sources: ["WeaponArt"], ratePerPerk: 0.5, requiresBuffsOnly: true },
        support: { "status": "Partial", "details": "Only real buffs: Weapon Arts gain 0.2 Hex output and 50% diminishing-return CDR per perk. Only debuffs: direct packets gain 0.2 Fire output and +20 Attack Speed points per perk. Neutral/scenario controls do not count. Mixed-state healing and DoT output applicability are not calculated." },
        "source": {
            "cardId": "69214b9731723704c1eda4b8",
            "cardUrl": "https://trello.com/c/qzmBIYkD"
        }
    },
    endless_despair: {
        id: "endless_despair",
        name: "Endless Despair",
        support: { "status": "Partial", "details": "Ordinary potency-bearing debuffs combine source and stored additive potency before applying (1 + 0.35 * perk amount), then one flat +0.1. Duration preview uses base seconds * (1 + 0.75 * perk amount). User testing on 2026-10-21 found increased enemy Poison damage/duration and no effect on self-inflicted debuffs; self exclusion is enforced even for old saved manual opt-ins. Stored Potencies remain unchanged. Bleed/Burn/Poison now respond to enemy eligibility using an explicitly provisional ED estimate: evaluate the documented source/stat damage multiplier M first, treat M-1 as combined strength above base damage 1, then use 1 + (M-1)*(1+0.35*p) + 0.1 before offensive scaling and defenses. This numerical mapping is a builder assumption, not validated in-game. Zero-damage Cauterize ticks remain zero. Manual DoT potency inputs still override the additive component before combination. Cursed Flames keeps its separate documented weakening formula. Linear stacking and other duration interactions remain builder conventions." },
        category: "Perk",
        description: "Heavily increase debuff duration and slightly increase debuff potency.",
        "source": {
            "cardId": "69214b9731723704c1eda44a",
            "cardUrl": "https://trello.com/c/DmG6mFg8"
        },
    },
    energize: {
        id: "energize",
        name: "Energize",
        category: "Perk",
        description: "Hitting enemies visibly builds up energy on your Weapon, with an indicator at max. At max, heavily boost Weapon Art Damage once, consuming all charges.",
        onDmgBonusMultiplier(amount, args) {
            return positivePerk(amount) && selected(this, "energize_charged") && args?.baseDamageData?.sourceType === "WeaponArt" ? 0.5 * amount : null;
        },
        support: { "status": "Partial", "details": "Select Energize Charged to preview 50% bonus Weapon Art damage per perk. This previews a charged packet; buildup, charge consumption, and the cast timeline are manual." },
        "source": {
            "cardId": "69214b9731723704c1eda44e",
            "cardUrl": "https://trello.com/c/tknW6gsB"
        }
    },
    engine: {
        id: "engine",
        name: "Engine",
        category: "Perk",
        description: "Your Speed Boost stat as well as the Tailwind Buff increases your Attack Speed.",
        statPriority: -10,
        onStatCalculation(amount) {
            if (!positivePerk(amount))
                return;
            addStat(this, "AttackSpeed", (0.25 * (this.stats.SpeedBoost || 0) + 30 * selectedBuffPotency(this, "tailwind")) * amount);
        },
        support: { "status": "Implemented", "details": "Adds (0.25 * Speed Boost + 30 * effective Tailwind potency) * perk amount to the Attack Speed stat. Uses the Tailwind applicant and explicit potency override; stacks additively with static attack-speed bonuses." },
        "source": {
            "cardId": "69214b9731723704c1eda4b6",
            "cardUrl": "https://trello.com/c/kNRHFv5d"
        }
    },
    equipment_farmer: {
        id: "equipment_farmer",
        name: "Equipment Farmer",
        category: "Perk",
        description: "Removes crafting materials from enemy drops and makes it easier to obtain armors from mobs.",
        "source": {
            "cardId": "69214b9831723704c1edae68",
            "cardUrl": "https://trello.com/c/jfBO8V77"
        },
    },
    erosion: {
        id: "erosion",
        name: "Erosion",
        category: "Perk",
        description: "Dealing earth damage has a chance to apply armor break.",
        getSourcePotencies(amount) { return { shatterpotency: 0.1 + 0.1 * amount }; },
        support: { "status": "Partial", "details": "Offers 0.1 + 0.1 * perk amount Shatter potency after an Earth-damage proc. Chance rolls and hit application are manual." },
        "source": {
            "cardId": "69214b9731723704c1edab4c",
            "cardUrl": "https://trello.com/c/iCWTWoVH"
        }
    },
    essence_ray: {
        id: "essence_ray",
        name: "Essence Ray",
        category: "Perk",
        description: "Ray becomes a beam that shoots out of your forehead allowing you to preform actions while attacking. This beam will target the furthest enemy from you.",
        "source": {
            "cardId": "69214b9831723704c1edaeb6",
            "cardUrl": "https://trello.com/c/DHbtUgdt"
        },
        getPerkDamageInfo(amount) { return positivePerk(amount) ? { ...activation("essence_ray", 1.1 + 0.275 * amount, "WeaponArt"), hitAmount: 23, damageScalings: { ...this.damageScalings }, damageTypes: { True: 1 } } : null; },
        support: { "status": "Partial", "details": "Previews one Essence Ray activation with 23 hits, each 1.1 + 0.275 * perk amount base, True output, and the weapon's scaling snapshot. Uses Weapon Art classification from its Ray parent. It is a separate preview; replacing the parent Ray panel, targeting, casting, and trigger timing are not simulated." }
    },
    essence_totem: {
        previewInputs: ["baseHeal"],
        getMechanicsPreview() { return [...healRows(this, "Entered totem tick", input(this, "baseHeal"), { Holy: .5, Earth: .5 }), row("Tick count", "Depends on post-CDR Weapon Art cooldown; exact relation is undocumented")]; },
        support: { "status": "Partial", "details": "Applies documented 0.5 Holy/Earth scaling plus shared Heal Boost/critical healing to a manually entered base tick. No base heal, tick count, duration/cooldown relation, or area is fabricated; the ring is not a status effect." },
        id: "essence_totem",
        name: "Essence Totem",
        category: "Perk",
        description: "Upon using a weapon art create a lingering healing ring around yourself. Duration scales on the cooldown of your weapon art.",
        "source": {
            "cardId": "69214b9731723704c1edabd0",
            "cardUrl": "https://trello.com/c/MHtATsn2"
        },
    },
    executioner: {
        id: "executioner",
        name: "Executioner",
        category: "Perk",
        description: "Gain a Damage Boost scaling on how much % of HP the enemy has lost.",
        onDmgBonusMultiplier(amount) {
            const ratio = healthRatio(this.target);
            return positivePerk(amount) && ratio !== undefined ? 0.5 * (1 - ratio) * amount : null;
        },
        support: { "status": "Implemented", "details": "Scales from 0% bonus at full target HP to 50% per perk at zero target HP, clamping the selected health ratio to 0–1." },
        "source": {
            "cardId": "69214b9731723704c1eda394",
            "cardUrl": "https://trello.com/c/vrmvJPnI"
        }
    },
    exhaust: {
        getMechanicsPreview() { const cd = this.getCooldownPreview(this.weaponart?.coolDown, "WeaponArt", this.weaponart?.id); return [row("Guaranteed Burn window", cd ? cd.value / 2 : undefined, "s"), row("Burn innate potency", "Unspecified; enter / select a Burn source manually")]; },
        support: { "status": "Partial", "details": "Displays its Burn application window as half the equipped Weapon Art cooldown after reviewed cooldown modifiers. Duration of that application window is separate from Burn's own duration. Burn potency, automatic status application, and an attack timeline remain unverified/manual." },
        id: "exhaust",
        name: "Exhaust",
        category: "Perk",
        description: "During and after a short duration of using your Weapon Art, every hit is guaranteed to apply Burn.",
        "source": {
            "cardId": "69214b9731723704c1eda410",
            "cardUrl": "https://trello.com/c/2pUwMZxy"
        },
    },
    explosive_charge: {
        previewInputs: ["preOutputHitDamage"],
        getMechanicsPreview() { return [row("Explosion damage before its own post-output modifiers", input(this, "preOutputHitDamage")), row("Damage inherited from Weapon Art", 100, "%"), row("Automatic proc coefficient", 0), row("Outputs", "Physical and Fire; split is undocumented, so final output damage is held"), row("Self damage", "Also hits the user; not automatically applied")]; },
        support: { "status": "Partial", "details": "Shows one explosion per Weapon Art hit using 100% of the entered pre-post-output damage, independent of perk stacks. No repeat offensive scaling is applied to that input. Physical/Fire split, self-damage, and area/stun are manual; cannot proc effects." },
        id: "explosive_charge",
        name: "Explosive Charge",
        category: "Perk",
        description: "Weapon arts cause an explosion.",
        "source": {
            "cardId": "69214b9731723704c1eda4bc",
            "cardUrl": "https://trello.com/c/wdF608Pd"
        },
    },
    explosive_honey: {
        id: "explosive_honey",
        name: "Explosive Honey",
        category: "Perk",
        description: "Finishers that hit cause a ring of honey to burst out, which applies Sticky and deals a small amount of Damage.",
        onDmgBonusMultiplier(amount) {
            return positivePerk(amount) && hasDebuff(this.target, "sticky") ? 0.1 : null;
        },
        support: { "status": "Partial", "details": "Adds the documented 10% damage against selected Sticky; no perk-amount scaling is specified for this bonus. Finisher honey burst and application are not simulated." },
        "source": {
            "cardId": "69214b9731723704c1eda484",
            "cardUrl": "https://trello.com/c/DzUd6F24"
        }
    },
    extinguish: {
        id: "extinguish",
        name: "Extinguish",
        category: "Perk",
        description: "If you hit a flaming opponent, deal bonus damage and put out the flame. If you heal a flaming ally it will put out the flame and gain bonus healing.",
        "source": {
            "cardId": "69214b9731723704c1eda360",
            "cardUrl": "https://trello.com/c/5lI1gM4c"
        },
        onSpecificDmgBonusMultiplier(amount, args) { return positivePerk(amount) && this.activeProcs?.includes("extinguish") && args?.outputType === "Water" ? 0.5 * amount : null; },
        support: { "status": "Partial", "details": "Select Extinguish Proc for a qualifying proc-capable Water hit. It consumes target Burn from any applicant before Curse Rip and grants 50% damage per perk to Water only on the first hit; later hits see Burn removed. Input builds stay unchanged. Qualification for Water introduced only by output conversions, healing, and reapplication are manual." }
    },
    fell_rush: {
        id: "fell_rush",
        name: "Fell Rush",
        category: "Perk",
        description: "Inflicting a debuff inflicts a debuff that links you to the opponent rmbing launches you towards them with dark feathers dealing hex and air damage.",
        "source": {
            "cardId": "69214b9831723704c1edacba",
            "cardUrl": "https://trello.com/c/v7Akzybg"
        },
    },
    fiery_pursuit: {
        id: "fiery_pursuit",
        name: "Fiery Pursuit",
        category: "Perk",
        description: "Dash forward once per perk prior to activating your Weapon Art, which Guardbreaks, applies Burn, and grants Iframes.",
        "source": {
            "cardId": "69214b9731723704c1eda41a",
            "cardUrl": "https://trello.com/c/39iFQqea"
        },
        damageScalings: { Fire: 1 }, damageTypes: { Fire: 1 },
        getPerkDamageInfo(amount) {
            if (!positivePerk(amount) || Math.floor(amount) < 1)
                return null;
            return { ...activation("fiery_pursuit", 10 + amount, "WeaponArt"), hitAmount: Math.floor(amount) };
        },
        support: { "status": "Partial", "details": "Previews one activation with floor(perk amount) dashes, each dealing 10 + perk amount base Fire damage with 1 Fire scaling. Counts as Weapon Art damage. Fractional perks increase damage but add no dash. Burn application, guard breaks, cast sequencing, and invincibility are manual." }
    },
    final_act: {
        id: "final_act",
        name: "Final Act",
        category: "Perk",
        description: "Using a Rune teleports all your minions back to you with an explosion of Magic and Hex Damage. Deaggros the enemy.",
        "source": {
            "cardId": "69214b9731723704c1eda3f4",
            "cardUrl": "https://trello.com/c/l83Hkyfa"
        },
        damageScalings: { "Hex": 1, "Magic": 1, "Summon": 1 }, damageTypes: { "Hex": 0.5, "Magic": 0.5 },
        getPerkDamageInfo(amount) { if (!positivePerk(amount))
            return null; return activation("final_act", 10 + 10 * amount, "Perk"); },
        support: { "status": "Partial", "details": "One Final Act activation deals 10 + 10 * perk amount base with Hex/Magic/Summon scaling and split Hex/Magic output. It is not multiplied by the summon count because the same enemy can only be hit once. This is an independent activation preview, not automatic DPS. Trigger rolls, cooldowns, area/target counts, and unspecified proc/crit rules are not simulated." }
    },
    flash_strike: {
        id: "flash_strike",
        name: "Flash Strike",
        category: "Perk",
        description: "Parrying an attack grants a buff called Flash Strike granting extreme attack speed momentarily.",
        statPriority: -10,
        onStatCalculation(amount) {
            if (positivePerk(amount) && hasBuff(this, "flash_strike"))
                addStat(this, "AttackSpeed", 75 * amount);
        },
        support: { "status": "Partial", "details": "Select Flash Strike after a parry to add 75 Attack Speed percentage points per equipped perk. Activation, duration, and transferred buffs are manual." },
        "source": {
            "cardId": "69214b9831723704c1edae6a",
            "cardUrl": "https://trello.com/c/ge4rmWRD"
        }
    },
    flowing_crits: {
        id: "flowing_crits",
        name: "Flowing Crits",
        category: "Perk",
        description: "Air boost contributes to your crit chance.",
        critical: { "chancePerBoost": { "AirBoost": 0.000875 }, "damagePerBoost": { "AirBoost": 0.000875 } },
        "source": {
            "cardId": "69214b9731723704c1eda388",
            "cardUrl": "https://trello.com/c/nfMHFCbQ"
        },
    },
    forgotten_chivalry: {
        id: "forgotten_chivalry",
        name: "Forgotten Chivalry",
        category: "Perk",
        description: "Using a weapon art or rune consumes any reinforce you have to deal bonus holy damage, increase stun and poise damage.",
        "source": {
            "cardId": "69214b9831723704c1edad0a",
            "cardUrl": "https://trello.com/c/em0Wta94"
        },
        outputPriority: 100,
        onOutputCalculation(amount) { if (positivePerk(amount) && this.activeProcs?.includes("forgotten_chivalry"))
            addOutput(this, "Holy", 0.4 * amount); },
        support: { "status": "Partial", "details": "A positive Rune/Weapon Art hit while carrying Reinforce gains 0.4 Holy output per perk on the proccing hit and consumes that Reinforce on the calculation snapshot. Later hits in the packet no longer receive the bonus. Buff-count bonuses retain Reinforce for the first hit as an explicit ordering convention; poise and stun are not simulated." }
    },
    fractured_energy: {
        previewInputs: ["damageDealt"],
        getMechanicsPreview(amount) { const damage = input(this, "damageDealt"); return [row("Damage stored", 20 + 20 * amount, "%"), row("Selected stored damage", damage === undefined ? undefined : damage * (.2 + .2 * amount)), row("Storage duration", 5, "s"), row("Crit conversion", "Final per-hit crit chance becomes Fracture application chance in Crit Modifiers")]; },
        support: { "status": "Partial", "details": "Converts the resolved per-hit critical chance to a displayed Fracture application chance and makes expected direct damage noncritical. Venom Eater cannot force a crit or consume Poison while converted. Stores 20% + 20% per perk of manually entered applicant damage for 5s. Earth/Magic split, return amplification/defenses, recording timeline, and application rolls are held." },
        id: "fractured_energy",
        name: "Fractured Energy",
        category: "Perk",
        description: "Convert all your Crit chance 1:1 to a chance to inflict Fracture on the enemy. Fracture stores a portion of all Damage you deal against the enemy for 5 seconds before repeating it.",
        "source": {
            "cardId": "69214b9731723704c1edabba",
            "cardUrl": "https://trello.com/c/WO4IValE"
        },
    },
    fragrance_aura: {
        id: "fragrance_aura",
        name: "Fragrance Aura",
        category: "Perk",
        description: "Whenever you heal yourself with a heal that can proc effects or use a healing consumable, you gain the Fragrant Aura Buff. Enemies inside the aura are inflicted with the Poison Debuff and take water damage over time. Allies inside gain a Regen Buff.",
        getSourcePotencies(amount) { return { regenpotency: 0.2 * amount }; },
        support: { "status": "Partial", "details": "Offers 0.2 * perk amount Regen potency for the aura's allies. Fragrance buildup, Poison application, Water pulses, healing, and duration are not simulated." },
        "source": {
            "cardId": "69214b9831723704c1edaeaa",
            "cardUrl": "https://trello.com/c/pcFpdK1s"
        }
    },
    fragrant_flesh: {
        id: "fragrant_flesh",
        name: "Fragrant Flesh",
        category: "Perk",
        description: "Dealing Water Damage has a chance to make you Bleed. If you're already Bleeding, instead gain Regeneration.",
        sourcepotencies: {
            bleedpotency: 0.5,
            regenpotency: 0.5,
        },
        "source": {
            "cardId": "69214b9731723704c1edabd6",
            "cardUrl": "https://trello.com/c/BGDSjTof"
        },
    },
    frequent_flier: {
        id: "frequent_flier",
        name: "Frequent Flier",
        category: "Perk",
        description: "Deal bonus damage when in the air. Additionally you can now hold space while in the air to activate a slow fall.",
        onDmgBonusMultiplier(amount) {
            return positivePerk(amount) && selected(this, "scenario_airborne") ? 0.2 * amount : null;
        },
        support: { "status": "Partial", "details": "Select Airborne for 20% damage per perk, including while mounted. Slow-fall movement is not simulated." },
        "source": {
            "cardId": "69214b9731723704c1eda4c4",
            "cardUrl": "https://trello.com/c/AYAygnuB"
        }
    },
    frostbite: {
        id: "frostbite",
        name: "Frostbite",
        category: "Perk",
        description: "Deal more damage to slowed enemies also have a chance to proc slow.",
        onDmgBonusMultiplier(perkAmount) {
            return perkAmount && perkAmount > 0 && hasDebuff(this.target, "slow") ? 0.1 * perkAmount : null;
        },
        support: { "status": "Partial", "details": "Damage bonus against a target already selected as Slow. Applying Slow on hit is not simulated; the Frostbite debuff is separate." },
        "source": {
            "cardId": "69214b9731723704c1eda3c6",
            "cardUrl": "https://trello.com/c/8tt6hyuQ"
        },
    },
    frozen_heart: {
        id: "frozen_heart",
        name: "Frozen Heart",
        category: "Perk",
        description: "Increases Physical and Magic Defense as well as Warding scaling on your Cold Resistance.",
        statPriority: 40,
        onStatCalculation(amount) {
            if (!positivePerk(amount))
                return;
            const value = (0.022222 + 0.022222 * amount) * (this.stats.ColdResistance || 0);
            for (const stat of ["PhysicalDefense", "MagicDefense", "Warding"])
                addStat(this, stat, value);
        },
        support: { "status": "Implemented", "details": "Adds (0.022222 + 0.022222 * perk amount) * Cold Resistance to Physical Defense, Magic Defense, and Warding. Extra Layers applies afterwards." },
        "source": {
            "cardId": "69214b9731723704c1eda452",
            "cardUrl": "https://trello.com/c/QGlNl7Tp"
        }
    },
    frozen_waste: {
        getMechanicsPreview(amount) { return [row("Blocking burst base damage", 15 + 15 * amount), row("Approximate cooldown at one perk", "5–8 seconds; higher-stack formula unknown"), row("Output / scalings", "Water output; Physical and Water scaling coefficients are undocumented")]; },
        support: { "status": "Partial", "details": "Calculates the documented blocking burst base damage. Missing Physical/Water scaling coefficients, Slow potency, poise/stun, and cooldown curve are held; no final scaled damage is implied." },
        id: "frozen_waste",
        name: "Frozen Waste",
        category: "Perk",
        description: "Blocking an Attack causes an AoE that does Water Damage, inflicts Slow, and has very high Stun and Poise Damage.",
        "source": {
            "cardId": "69214b9731723704c1eda424",
            "cardUrl": "https://trello.com/c/XUFjA3Oy"
        },
    },
    fungal_prototype: {
        onStatCalculation(amount) { if (positivePerk(amount))
            addPotency(this, "poisonpotency", amount); },
        getMechanicsPreview(amount) { return [row("Stored Poison potency contributed", .1 * amount), row("Cloud", "Rune / Weapon Art hit; source damage relation and cloud potency are undocumented")]; },
        support: { "status": "Partial", "details": "Adds +0.1 stored Poison potency per perk using the same user-specified grant convention as Venom Eater. Trello names the bonus without its amount. Cloud damage, source potency, size, and Rune/Weapon Art trigger are manual." },
        id: "fungal_prototype",
        name: "Fungal Prototype",
        category: "Perk",
        description: "Hitting an opponent with a rune or weapon art creates a poison cloud. Grants poison potency.",
        "source": {
            "cardId": "69214b9831723704c1edad2e",
            "cardUrl": "https://trello.com/c/oygo9Pw2"
        },
    },
    future_sight: {
        id: "future_sight",
        name: "Future Sight",
        category: "Perk",
        description: "After not being hit for awhile you will dodge the next thing that hits you. Additionally dodging an attack without using the dodge provided by Future Sight restores Future Sight's dodge temporarily.",
        "source": {
            "cardId": "69214b9831723704c1edaee4",
            "cardUrl": "https://trello.com/c/zqgTEn7j"
        },
        statusEffects: ["future_sight_ready"],
        support: { "status": "Partial", "details": "Select Future Sight Ready for a manually qualified incoming direct hit: damage becomes zero. Recharge is max(5, 22.5 - 7.5 * perk amount) seconds, tracked manually. Remove the state after the dodge; multi-hit previews assume it stays active and should be split to model consumption. Status ticks are excluded; dodge-roll refresh and Critical Boost interactions are not simulated." }
    },
    gale_bursts: {
        id: "gale_bursts",
        name: "Gale Bursts",
        category: "Perk",
        description: "Most Finishers send out an equal amount of air missiles with reduced Proc Coefficient.",
        "source": {
            "cardId": "69214b9731723704c1eda440",
            "cardUrl": "https://trello.com/c/82Gmhs7I"
        },
        damageScalings: { "Air": 1, "Dexterity": 1 }, damageTypes: { "Air": 1 },
        getPerkDamageInfo(amount) { if (!positivePerk(amount))
            return null; const number = finisherProcNumber(this); return activation("gale_bursts", (2.25 + 3.75 * amount) / (1 + number / 2), "Perk", 0.3); },
        support: { "status": "Partial", "details": "One missile at the selected Finisher Proc Number (default 1), following the explicit formula (2.25 + 3.75 * perk amount) / (1 + number / 2). The card's one-perk example inconsistently uses 7.5; the formula takes precedence. Proc coefficient 0.3 is the base; inherited weapon-coefficient and alternating-hit suppression are manual. Independent activation preview; trigger rolls, timing, area/target counts, and automatic proc chains are not simulated." }
    },
    gaseous_smash: {
        getMechanicsPreview(amount) { return [row("Poison cloud base damage per tick", amount), row("Output", "Hex; damage scaling and tick interval undocumented"), row("Activation", "Once per qualifying weapon slam")]; },
        support: { "status": "Partial", "details": "Calculates one base damage per perk per cloud tick. Hex scaling, tick interval, duration, Poison source potency, and qualifying slam detection are held; cloud damage is separate from Poison status ticks." },
        id: "gaseous_smash",
        name: "Gaseous Smash",
        category: "Perk",
        description: "Weapon attacks that slams into itself or the floor creates a cloud of lingering Poison, which inflicts Poison and deals Hex Damage over time.",
        "source": {
            "cardId": "69214b9831723704c1edad20",
            "cardUrl": "https://trello.com/c/nHQ9Tm6K"
        },
    },
    gelid_lance: {
        id: "gelid_lance",
        name: "Gelid Lance",
        category: "Perk",
        description: "When you apply Slow, also apply Bleed, Grants Water Scaling to bleed,   and deal increased damage to opponents with the Bleed Debuff. Grants Bleed potency.",
        onDmgBonusMultiplier(amount) {
            return positivePerk(amount) && hasDebuff(this.target, "bleed") ? 0.1 * amount : null;
        },
        support: { "status": "Partial", "details": "Adds 10% damage per perk against selected Bleed. Slow-to-Bleed application and the undocumented Water-scaling coefficient are not inferred; the card says it grants no additive Bleed potency." },
        "source": {
            "cardId": "69214b9731723704c1eda918",
            "cardUrl": "https://trello.com/c/g2VKZtET"
        }
    },
    ghastly_rot: {
        id: "ghastly_rot",
        name: "Ghastly Rot",
        category: "Perk",
        description: "Hitting enemies has a high chance to apply Ghastly Rot which makes it so if the opponent with Ghastly Rot is hit from any source they have a chance to be poisoned, additionally take more poison damage when afflicted by Ghastly Rot",
        "source": {
            "cardId": "69214b9731723704c1eda478",
            "cardUrl": "https://trello.com/c/hugPFrtw"
        },
        statusEffects: ["ghastly_rot"],
        support: { "status": "Partial", "details": "Select the shared Ghastly Rot debuff on the target to make Poison from any applicant use True output. Poison scaling and ownership remain with the actual applicant. Its unspecified extra Poison damage, chance rolls, spreading, and application are not guessed." }
    },
    glacial_buildup: {
        id: "glacial_buildup",
        name: "Glacial Buildup",
        category: "Perk",
        description: "Hitting enemies applies ice crystals which adds flat Water and Poise Damage to your Attacks. At high enough stacks or Poisebreaking the enemy, the crystals shatter, dealing Water Damage and high Poise Damage.",
        "source": {
            "cardId": "69214b9831723704c1edad38",
            "cardUrl": "https://trello.com/c/M0EtSSrb"
        },
    },
    gladiatorial_rage: {
        id: "gladiatorial_rage",
        name: "Gladiatorial Rage",
        category: "Perk",
        description: "Halves Rage rune Cooldown and adds a flat potency increase to all sources and forms of Rage. Rage duration is increased on kill, and gain Armor Penetration scaling off your highest offensive boost.",
        onStatCalculation(perkAmount) {
            addRagePotency(this, perkAmount);
        },
        "source": {
            "cardId": "69214b9731723704c1eda428",
            "cardUrl": "https://trello.com/c/7vMRpUp1"
        },
        cooldown: { "sources": ["Rune"], "directBase": 0.5, "abilityId": "rage_rune" },
        support: { "status": "Partial", "details": "Adds 0.1 Rage potency per perk and halves Rage Rune cooldown with a direct factor. Duration on kill and highest-boost penetration remain outside the calculation." }
    },
    glyph_conduit: {
        id: "glyph_conduit",
        name: "Glyph Conduit",
        category: "Perk",
        description: "Upon landing an RMB or using a rune gain a sigil on your weapon which heavily increases magic damage.",
        "source": {
            "cardId": "69214b9831723704c1edac6a",
            "cardUrl": "https://trello.com/c/9p6RpgS3"
        },
        onSpecificDmgBonusMultiplier(amount, args) { return positivePerk(amount) && selected(this, "glyph_conduit") && args?.outputType === "Magic" ? 0.2 * amount : null; },
        support: { "status": "Partial", "details": "Select Glyph Conduit after an RMB/Rune for 20% damage per perk to the pure Magic output portion only. Elemental portions do not qualify. Activation and expiration are manual; transferred-buff potency is unverified." }
    },
    gnawing_poison: {
        id: "gnawing_poison",
        name: "Gnawing Poison",
        category: "Perk",
        description: "Hitting an opponent with a finisher bites all enemies you have poisoned dealing a burst of hex damage. Has a cooldown. Grants poison potency.",
        "source": {
            "cardId": "69214b9831723704c1edad32",
            "cardUrl": "https://trello.com/c/OZUTZhKH"
        },
        damageScalings: { "Hex": 1, "Physical": 1 }, damageTypes: { "Hex": 0.5, "Physical": 0.5 },
        getPerkDamageInfo(amount) { if (!positivePerk(amount))
            return null; if (!this.target?.deBuffs?.some(status => status.id === "poison" && status.getSourceBuild(this.target) === this))
            return null; return activation("gnawing_poison", 8 * amount); },
        support: { "status": "Partial", "details": "One bite: 8 * perk amount base, Hex/Physical scaling, half Hex/Physical output. Requires target Poison applied by this attacker; another applicant's Poison does not qualify. No unspecified innate Poison potency is invented. Separate activation preview; trigger rolls, cooldowns, area/target counts, and recursive procs are not simulated. Unspecified proc coefficients and crit eligibility use the existing direct-packet defaults." }
    },
    golden_crits: {
        id: "golden_crits",
        name: "Golden Crits",
        category: "Perk",
        description: "30% of Crits has a chance to have their Damage increased even further.",
        critical: { "damagePerPerk": 0.5, "procChance": 0.4 },
        "source": {
            "cardId": "69214b9731723704c1eda45a",
            "cardUrl": "https://trello.com/c/8MTSUxds"
        },
    },
    golem_guillotine: {
        id: "golem_guillotine",
        name: "Golem Guillotine",
        category: "Perk",
        description: "Finishers that slams the ground creates a fissure-like shockwave that reaches ahead and behind yourself, dealing Earth Damage.",
        "source": {
            "cardId": "69214b9731723704c1edabca",
            "cardUrl": "https://trello.com/c/S2yxgcVa"
        },
        damageScalings: { "Earth": 1 }, damageTypes: { "Earth": 1 },
        getPerkDamageInfo(amount) { if (!positivePerk(amount))
            return null; return activation("golem_guillotine", 6 * amount); },
        support: { "status": "Partial", "details": "One eligible ground-slam fissure deals 6 * perk amount base with 1 Earth scaling; Earth output is inferred from the description. Preview assumes a qualifying slam: Gloves, replaced finishers, and non-final Dual Greatsword M2 do not qualify in game. Separate activation preview; trigger rolls, cooldowns, area/target counts, and recursive procs are not simulated. Unspecified proc coefficients and crit eligibility use the existing direct-packet defaults." }
    },
    gorecast: {
        id: "gorecast",
        name: "Gorecast",
        category: "Perk",
        description: "Magic or physical dmg weapon arts cause people to bleed, additionally bleeding targets take more weapon art dmg. Grants bleed potency.",
        "source": {
            "cardId": "69214b9731723704c1edab9c",
            "cardUrl": "https://trello.com/c/7HK2pKpv"
        },
        onDmgBonusMultiplier(amount, args) {
            return positivePerk(amount) && args?.baseDamageData?.sourceType === "WeaponArt" && hasDebuff(this.target, "bleed") && ((this.damageTypes.Physical || 0) > 0 || (this.damageTypes.Magic || 0) > 0) ? 0.15 * amount : null;
        },
        support: { "status": "Partial", "details": "Selected target Bleed enables 15% Weapon Art damage per perk when the packet contains Physical or Magic output. Elemental-only arts do not qualify. Bleed application, including on the triggering hit, is selected manually; the unspecified innate potency is not guessed. Hybrid packet bonus scope needs game verification." }
    },
    grandmagic_guard: {
        id: "grandmagic_guard",
        name: "Grandmagic Guard",
        category: "Perk",
        description: "Blocking makes a bubble that knocks away enemies and protects allies and yourself.",
        "source": {
            "cardId": "69214b9731723704c1eda462",
            "cardUrl": "https://trello.com/c/n1JqetL7"
        },
        onDmgReducedMultiplier(amount) { return positivePerk(amount) && selected(this, "magic_reinforce") ? 0.5 * amount : null; },
        onFlatDamageTakenReduction(amount, args) { return positivePerk(amount) && selected(this, "magic_reinforce") && isMagicDamageType(args?.outputType) ? 0.5 * amount : null; },
        support: { "status": "Partial", "details": "Select Magic Reinforce for 50% diminishing-return reduction per equipped perk and 0.5 flat reduction per perk to Magic and its six constituent elements. Flat reduction applies per hit/output after defense and reviewed reduction multipliers, floored at zero. Self-buff preview; transferred potency, knockback, and blocking activation are manual." }
    },
    gravitational_enforcer: {
        id: "gravitational_enforcer",
        name: "Gravitational Enforcer",
        category: "Perk",
        description: "Pull opponents towards you with high Stun and Armor Break infliction prior to activating your RMB, but increases RMB Cooldown.",
        "source": {
            "cardId": "69214b9731723704c1eda442",
            "cardUrl": "https://trello.com/c/r9LM8Qcs"
        },
        damageScalings: { "Earth": 1, "Magic": 1 }, damageTypes: { "Earth": 0.5, "Magic": 0.5 },
        getPerkDamageInfo(amount) { if (!positivePerk(amount))
            return null; return activation("gravitational_enforcer", 10 + amount, "Perk"); },
        getSourcePotencies(amount) { return { shatterpotency: 0.1 * amount }; },
        support: { "status": "Partial", "details": "One pull hit with 10 + perk amount base and 1 Earth/Magic scaling. Equal Earth/Magic output is inferred because output is unstated. Offers 0.1 * perk amount Shatter. RMB cooldown penalty, stun, guardbreak, and replacement precedence are unverified/manual. Independent activation preview; trigger rolls, timing, area/target counts, and automatic proc chains are not simulated." }
    },
    gravity_well: {
        id: "gravity_well",
        name: "Gravity Well",
        category: "Perk",
        description: "Pull enemies in when you use your weapon art or rune",
        "source": {
            "cardId": "69214b9731723704c1eda3c4",
            "cardUrl": "https://trello.com/c/4ZoUZs3u"
        },
        damageScalings: { "Earth": 0.5, "Magic": 0.5 }, damageTypes: { "Earth": 0.5, "Magic": 0.5 },
        getPerkDamageInfo(amount) { if (!positivePerk(amount))
            return null; return activation("gravity_well", 20 + 2 * amount); },
        support: { "status": "Partial", "details": "One cast shockwave, 20 + 2 * perk amount base, half Earth/Magic scaling and output. It is a perk packet; the source does not classify the wave as Rune or Weapon Art damage. Separate activation preview; trigger rolls, cooldowns, area/target counts, and recursive procs are not simulated. Unspecified proc coefficients and crit eligibility use the existing direct-packet defaults." }
    },
    gremlin_spirit: {
        getMechanicsPreview() { return [row("Hits per activation", 10), row("Activation", "Full spirit plus applying Bleed; damage coefficients undocumented")]; },
        support: { "status": "Partial", "details": "Shows the documented ten-hit activation when full Spiritual Energy and Bleed application qualify. Base damage, scaling, output, per-hit coefficients, and automatic triggering are unavailable; no guessed damage packet." },
        id: "gremlin_spirit",
        name: "Gremlin Spirit",
        category: "Perk",
        description: "Upon reaching max stacks of spiritual energy applying bleed conjures two spirit gremlins that throw spears in the air and they crash down as one giant spear.",
        "source": {
            "cardId": "69214b9831723704c1edaca8",
            "cardUrl": "https://trello.com/c/fHkTpUJx"
        },
    },
    grounded_despair: {
        id: "grounded_despair",
        name: "Grounded Despair",
        category: "Perk",
        description: "Jumping and landing causes you to create a small shockwave and get a debuff called despair. Despair increases damage dealt.",
        getSourcePotencies(amount) { return { despairpotency: 0.1 * amount }; },
        support: { "status": "Partial", "details": "Offers 0.1 * perk amount Despair potency. Select Despair with Applied by Self for its shared +8.5% damage per 0.1 effective potency. Jump/landing shockwave and timing are not simulated." },
        "source": {
            "cardId": "69214b9831723704c1edad06",
            "cardUrl": "https://trello.com/c/KfRmwoqr"
        }
    },
    guardian_spin: {
        id: "guardian_spin",
        name: "Guardian Spin",
        category: "Perk",
        description: "Empower your spin weapon art with bastion energy.",
        "source": {
            "cardId": "69214b9731723704c1edaba6",
            "cardUrl": "https://trello.com/c/FMywHsbl"
        },
        onDmgBonusMultiplier(amount, args) { return positivePerk(amount) && args?.baseDamageData?.sourceType === "WeaponArt" && args.baseDamageData.source === "spin" ? 0.2 + 0.2 * amount : null; },
        support: { "status": "Partial", "details": "The Spin Weapon Art gains a 20% base damage bonus plus 20% per perk. Other Weapon Arts and independent perk activations are unaffected; range is not simulated." }
    },
    guiding_winds: {
        id: "guiding_winds",
        name: "Guiding Winds",
        category: "Perk",
        description: "Constantly moving activates a state that steadily builds up high potencies of Tailwind, and increases Damage scaling off of the potency of the aforementioned Tailwind in specific.",
        "source": {
            "cardId": "69214b9831723704c1edacec",
            "cardUrl": "https://trello.com/c/PXHDPKRY"
        },
        getSourcePotencies(amount) { return { tailwindpotency: 0.1 * amount }; },
        onDmgBonusMultiplier(amount, args) { return positivePerk(amount) && selected(this, "guiding_winds_charged") ? (isRuneOrWeaponArtHit(args) ? 0.15 : 0.4) * amount : null; },
        support: { "status": "Partial", "details": "Select Guiding Winds Charged for the full-charge damage cap: 40% per perk normally, approximately 15% per perk for Rune/Weapon Art packets per the source. This is an independent charge state, not calculated from Tailwind potency. Offers the max 0.1 Tailwind potency per perk source. Intermediate charge, buildup, and consumption are manual." }
    },
    hardened_will: {
        id: "hardened_will",
        name: "Hardened Will",
        category: "Perk",
        description: "Hardened Will",
        "source": {
            "cardId": "69214b9731723704c1eda46e",
            "cardUrl": "https://trello.com/c/Bhvtoq8g"
        },
    },
    heal_boost: {
        previewInputs: ["baseHeal"],
        getMechanicsPreview(amount) { return [row("Healing multiplier", 1 + .1 * amount, "x"), ...healRows(this, "Entered healing", input(this, "baseHeal"))]; },
        support: { "status": "Partial", "details": "Adds 10% healing per perk to the scoped healing previews, multiplicatively after known source scaling. Excluded from Cursed and Perk Effectiveness per source. Entered base healing and supported healing sources show normal, critical, and expected results. Unknown level, True Balance healing, recipient modifiers, and skill-specific restrictions are explicitly outside this preview." },
        id: "heal_boost",
        name: "Heal Boost",
        category: "Perk",
        description: "You gain bonus healing.",
        "source": {
            "cardId": "69214b9731723704c1eda4a0",
            "cardUrl": "https://trello.com/c/CrkBe44p"
        },
    },
    healing_arts: {
        getMechanicsPreview(amount) { const factor = .075 + .2667 * amount; return [row("Regen duration from Rune", this.mainArmor.rune?.cooldown === undefined ? undefined : this.mainArmor.rune.cooldown * factor, "s"), row("Regen duration from Weapon Art", this.weaponart?.coolDown === undefined ? undefined : this.weaponart.coolDown * factor, "s"), row("Potency", "Regen innate potency unspecified; select / enter manually")]; },
        support: { "status": "Partial", "details": "Displays Regen application duration as the triggering skill's base cooldown * (0.075+0.2667p), separately for Rune and Weapon Art. This is an unmodified application-duration preview; Contained and other duration choices belong to the selected Regen status. Missing Regen innate potency and healing-per-tick are not invented." },
        id: "healing_arts",
        name: "Healing Arts",
        category: "Perk",
        description: "Upon casting a weapon art or rune grant regen, the duration scales on the cooldown of the skill",
        "source": {
            "cardId": "69214b9731723704c1eda346",
            "cardUrl": "https://trello.com/c/rgXca0Xl"
        },
    },
    heavy_gravitate: {
        id: "heavy_gravitate",
        name: "Heavy Gravitate",
        category: "Perk",
        description: "Hitting an enemy with either Earth or Magic Damage from a Weapon Art or Rune applies Heavy Gravitate to them. Heavy Gravitate slows the enemy, and will take heavy Damage and Poise Damage when you use your RMB Finisher, after which it is removed.",
        "source": {
            "cardId": "69214b9831723704c1edae36",
            "cardUrl": "https://trello.com/c/JJWBwgYQ"
        },
        damageScalings: { "Magic": 1, "Earth": 1 }, damageTypes: { "Magic": 0.5, "Earth": 0.5 },
        getPerkDamageInfo(amount) { if (!positivePerk(amount))
            return null; if (!this.target?.deBuffs?.some(status => status.id === "heavy_gravitate" && status.getSourceBuild(this.target) === this))
            return null; return activation("heavy_gravitate", (12.5 + 6.25 * amount) / 3, "Perk"); },
        support: { "status": "Partial", "details": "One marked-target activation hit uses (12.5 + 6.25 * perk amount)/3 base with Magic/Earth scaling and split output. Requires selected Heavy Gravitate applied by this attacker. Hit count/proc coefficient above normal are unspecified and are not guessed. This is an independent activation preview, not automatic DPS. Trigger rolls, cooldowns, area/target counts, and unspecified proc/crit rules are not simulated." }
    },
    heavy_slate: {
        id: "heavy_slate",
        name: "Heavy Slate",
        category: "Perk",
        description: "Ignore Knockback from Attacks below a certain threshold of Stun after accounting for modifiers, after which you release a shockwave of Earth. Has a 0.5 second Cooldown.",
        "source": {
            "cardId": "69214b9731723704c1edaba2",
            "cardUrl": "https://trello.com/c/BCycQTfD"
        },
        damageScalings: { "Earth": 1 }, damageTypes: { "Earth": 1 },
        getPerkDamageInfo(amount) { if (!positivePerk(amount))
            return null; return activation("heavy_slate", 3 * amount); },
        support: { "status": "Partial", "details": "One threshold-triggered shockwave, 3 * perk amount base and 1 Earth scaling. Earth output is inferred from the description; stun/knockback thresholds remain manual. Separate activation preview; trigger rolls, cooldowns, area/target counts, and recursive procs are not simulated. Unspecified proc coefficients and crit eligibility use the existing direct-packet defaults." }
    },
    heightened_reflexes: {
        getMechanicsPreview(amount) { return [row("Autoparries after a kill (whole-count preview)", Math.floor(amount) + 1), row("Fractional count", "Floor convention; fractional in-game rounding unverified"), row("Condition", "Blocking with post-kill autoparry active; ends on exhausted parries or timeout")]; },
        support: { "status": "Partial", "details": "Shows one plus perk amount autoparries at integer amounts; fractional counts floor as a labelled builder convention. Kill activation, blocking, damage blocked, duration, and Parry/Royal Parry stun are not invented." },
        id: "heightened_reflexes",
        name: "Heightened Reflexes",
        category: "Perk",
        description: "You gain autoparry when you get a kill. Autoparry activates when you are blocking.",
        "source": {
            "cardId": "69214b9731723704c1edaaf6",
            "cardUrl": "https://trello.com/c/1KBNIjet"
        },
    },
    hex_ray: {
        id: "hex_ray",
        name: "Hex Ray",
        category: "Perk",
        description: "Inflicting Debuffs that has a Weakening effect fires a ray of Hex at them. Has no Cooldown.",
        "source": {
            "cardId": "69214b9831723704c1edaf1c",
            "cardUrl": "https://trello.com/c/aFvDz28k"
        },
        damageScalings: { Hex: 1 }, damageTypes: { Hex: 1 },
        getPerkDamageInfo(amount) {
            if (!positivePerk(amount))
                return null;
            const target = this.target, weakness = target?.deBuffs?.find(status => status.id === "weakness" && status.getSourceBuild(target) === this);
            return target && weakness ? activation("hex_ray", (5 + amount) * (1 + 2 * weakness.getReceivedPotency(target) / 10), "Perk", 0) : null;
        },
        support: { "status": "Partial", "details": "With attacker-applied target Weakness selected, previews one ray: (5 + perk amount) * (1 + 2 * received Weakness game potency) base Hex damage with 1 Hex scaling/output and no proc coefficient. Final manual potency and received reductions are honored. Cursed Flames trigger, reapplication, and crit eligibility are not implemented." }
    },
    holy_tides: {
        id: "holy_tides",
        name: "Holy Tides",
        category: "Perk",
        description: "Cleansing a debuff on you or an ally applies regen. All heals you recieve or do also gain bonus water and holy scaling.",
        "source": {
            "cardId": "69214b9731723704c1eda40c",
            "cardUrl": "https://trello.com/c/BlP2SvSq"
        },
        getSourcePotencies(amount) { return { regenpotency: amount / 2 }; },
        support: { "status": "Partial", "details": "Offers Regen at half the perk amount after a cleanse. The existing shared Regen status can be selected with this source. Healing calculations, additional Holy/Water heal scaling, cleansing triggers, and duration are not simulated." }
    },
    honey_arts: {
        getMechanicsPreview() { return [row("Approximate applied Sticky duration", 5, "s"), row("Automatic proc coefficient", 0), row("Glob count", "Depends on Weapon Art cooldown; exact relation and glob damage unknown")]; },
        support: { "status": "Partial", "details": "Shows the documented approximately 5s Sticky application and that honey blasts cannot proc other effects. Missing glob count/cooldown relation, base damage, scaling/output, and target area are held." },
        id: "honey_arts",
        name: "Honey Arts",
        category: "Perk",
        description: "Whenever you use a weapon art it shoots out a blasts of honey to all opponents nearby in a large area. AOE of targetting scales with cooldown.",
        "source": {
            "cardId": "69214b9731723704c1eda482",
            "cardUrl": "https://trello.com/c/FQiQ6BgC"
        },
    },
    honey_gather: {
        previewInputs: ["eligibleHitDamage"],
        getMechanicsPreview(amount) { const damage = input(this, "eligibleHitDamage"), active = this.target?.deBuffs?.some(status => status.id === "sticky"); return [row("Sticky target", active ? "Active" : "Inactive: select target Sticky"), row("Healing before healing modifiers", active ? damage === undefined ? undefined : .01 * damage * amount + 1 : 0)]; },
        support: { "status": "Partial", "details": "Against selected target Sticky, previews 0.01 * eligible damage * perk amount + 1 healing. Enter damage before damage-boosting perks and output above 1, which the card excludes; final combat HP damage is not silently substituted. No Sticky consumption or automatic healing is invented." },
        id: "honey_gather",
        name: "Honey Gather",
        category: "Perk",
        description: "Gain Lifesteal against opponents with Sticky.",
        "source": {
            "cardId": "69214b9831723704c1edaf12",
            "cardUrl": "https://trello.com/c/rEJrT3Pq"
        },
    },
    hypnotist: {
        id: "hypnotist",
        name: "Hypnotist",
        category: "Perk",
        description: "If you hit an opponent with a weapon art or rune you will apply a debuff that applies magic penetration and doesnt allow you to draw aggro by hitting the mob.",
        "source": {
            "cardId": "69214b9731723704c1edab54",
            "cardUrl": "https://trello.com/c/Mte3unIP"
        },
        getSourcePotencies(amount) { return { hypnotistpotency: amount / 10 }; },
        support: { "status": "Partial", "details": "Offers the shared Hypnotist debuff at perk amount / 10 potency, granting 5 Magic-family penetration per source perk, including fractional amounts. Apply it after the triggering hit, since it does not benefit that hit. Aggro, application, and duration are manual. Magic family includes Magic and its six constituent elements." }
    },
    ice_barge: {
        id: "ice_barge",
        name: "Ice Barge",
        category: "Perk",
        description: "Speed reductions from Slowing effects and Stuns are reduced, and gain Damage Reduction whilst inflicted with them. Additionally, your run is not cancelled by Stuns.",
        onDmgReducedMultiplier(amount) {
            return positivePerk(amount) && hasDebuff(this, "slow") ? 0.15 * amount : null;
        },
        support: { "status": "Partial", "details": "Selected Slow grants 15% diminishing-return damage reduction per perk. Stun/movement behavior and automatic block-triggered Slow are not simulated." },
        "source": {
            "cardId": "69214b9731723704c1eda496",
            "cardUrl": "https://trello.com/c/3mFguLrj"
        }
    },
    ice_burst: {
        id: "ice_burst",
        name: "Ice Burst",
        category: "Perk",
        description: "Applying Armor Break creates an icicle burst that inflicts Bleed and does Water Damage in a radius.",
        "source": {
            "cardId": "69214b9831723704c1edad3c",
            "cardUrl": "https://trello.com/c/cKbJP0nj"
        },
        damageScalings: { "Water": 1, "Physical": 1 }, damageTypes: { "Water": 0.5, "Physical": 0.5 },
        getPerkDamageInfo(amount) { if (!positivePerk(amount))
            return null; return activation("ice_burst", 10, "Perk", 0); },
        support: { "status": "Partial", "details": "One 10-base burst, 1 Water/Physical scaling, and no proc coefficient. Equal Water/Physical output is an inference because the ratio is unstated. Armor-break trigger, Bleed potency, and duration are manual. Independent activation preview; trigger rolls, timing, area/target counts, and automatic proc chains are not simulated." }
    },
    icestorm: {
        id: "icestorm",
        name: "Icestorm",
        category: "Perk",
        description: "Landing 10 hits in a short timeframe creates an ice storm to orbit around you, which inflicts Slow and does Magic and Water Damage.",
        "source": {
            "cardId": "69214b9731723704c1eda468",
            "cardUrl": "https://trello.com/c/F0tSuvN4"
        },
        damageScalings: { "Magic": 1, "Water": 1 }, damageTypes: { "Magic": 0.5, "Water": 0.5 },
        getPerkDamageInfo(amount) { if (!positivePerk(amount))
            return null; if (!selected(this, "icestorm_active"))
            return null; return activation("icestorm", 3 + amount, "Perk", 0); },
        support: { "status": "Partial", "details": "Select Icestorm Active for one orbit hit: 3 + perk amount base, Magic/Water scaling, and split output, with no proc coefficient. Hit-based buildup, duration, and Slow application are manual. This is an independent activation preview, not automatic DPS. Trigger rolls, cooldowns, area/target counts, and unspecified proc/crit rules are not simulated." }
    },
    ichor_spark: {
        id: "ichor_spark",
        name: "Ichor Spark",
        category: "Perk",
        description: "Gain a chance to create red chain lightning that does Physical and Air Damage alongside lifestealing. Additionally, allows you to hold RMB to charge and fire a large slash attack.",
        "source": {
            "cardId": "69214b9831723704c1edacc6",
            "cardUrl": "https://trello.com/c/nkkR2mvi"
        },
    },
    infection: {
        onStatCalculation(amount) { if (positivePerk(amount))
            addPotency(this, "poisonpotency", amount); },
        previewInputs: ["poisonTickDamage"],
        getMechanicsPreview(amount) { const tick = input(this, "poisonTickDamage"); return [row("Stored Poison potency contributed", .1 * amount), row("Spread Hex damage from one tick", tick === undefined ? undefined : 2 * tick), row("Condition", "Your Poison tick and a nearby non-poisoned recipient")]; },
        support: { "status": "Partial", "details": "Adds +0.1 stored Poison potency per perk under the user grant convention, and previews Hex spread damage equal to twice an entered Poison tick, not multiplied by perk stacks. Spread range, recipient defenses, application potency/duration, and automatic spreading are held." },
        id: "infection",
        name: "Infection",
        category: "Perk",
        description: "When Poison inflicted by you ticks down, it deals slight Hex Damage and applies Poison to a nearby, non-poisoned opponent. Grants Poison Potency.",
        "source": {
            "cardId": "69214b9831723704c1edaf20",
            "cardUrl": "https://trello.com/c/Qk2ZR46v"
        },
    },
    inhuman_swings: {
        id: "inhuman_swings",
        name: "Inhuman Swings",
        category: "Perk",
        description: "Your LMB/RMB attack speed scales with the average of your dexterity boost and physical boost.",
        "source": {
            "cardId": "69214b9731723704c1eda3fe",
            "cardUrl": "https://trello.com/c/G89Ri2Oo"
        },
        attackSpeedFactor(amount) { if (!positivePerk(amount))
            return 1; const denominator = 350 - 50 * amount; return denominator > 0 ? Math.max(0, 1 + Math.min(3, ((this.stats.DexterityBoost || 0) + (this.stats.PhysicalBoost || 0)) / denominator)) : 1; },
        support: { "status": "Partial", "details": "Weapon speed multiplies by 1 + min(3, (Dexterity Boost + Physical Boost) / (350 - 50 * perk amount)), floored at zero speed. Uses final selected stats after percentage-to-flat conversion and Kitsune. At perk amount >= 7 the documented denominator is invalid/nonpositive, so this factor is held at 1 pending a verified rule. No Rune/Weapon Art cast-speed inference." }
    },
    inoculation: {
        previewInputs: ["preReductionDamage"],
        getMechanicsPreview(amount) { const damage = input(this, "preReductionDamage"); return [row("Self-hit healing before healing modifiers", damage === undefined ? undefined : (.3 * damage + .1) * amount), row("Eligibility", "Self-inflicted direct damage only; self debuffs do not qualify")]; },
        support: { "status": "Partial", "details": "Previews (0.3 * self-hit damage before all defenses/reductions + 0.1) * perk amount healing. Explicit input prevents using post-defense HP damage or a self-inflicted DoT, both excluded by the card. Preview only; no HP mutation, recursive self-heal, or invented healing-modifier ordering." },
        id: "inoculation",
        name: "Inoculation",
        category: "Perk",
        description: "Taking self inflicted damage heals you for a portion of the damage taken along with flat healing.",
        "source": {
            "cardId": "69214b9831723704c1edaed4",
            "cardUrl": "https://trello.com/c/9WoP9L4r"
        },
    },
    inspiration: {
        id: "inspiration",
        name: "Inspiration",
        category: "Perk",
        description: "Landing m1s/m2s releases pulses that slightly heal and give a damage boost to yourself and nearby allies. The heal is more effective on summons.",
        onDmgBonusMultiplier(amount) {
            return positivePerk(amount) && hasBuff(this, "inspired") ? 0.075 * amount : null;
        },
        support: { "status": "Partial", "details": "Select Inspired for 7.5% self damage per equipped perk. Healing pulses, ally application, and duration are manual; an unknown Inspired potency formula is not invented." },
        "source": {
            "cardId": "69214b9831723704c1edace0",
            "cardUrl": "https://trello.com/c/DLCdQ0RQ"
        }
    },
    investigator: {
        id: "investigator",
        name: "Investigator",
        category: "Perk",
        description: "Makes you really good at investigating.",
        "source": {
            "cardId": "69214b9731723704c1eda3b4",
            "cardUrl": "https://trello.com/c/A2CVoa5j"
        },
    },
    iron_bounce: {
        id: "iron_bounce",
        name: "Iron Bounce",
        category: "Perk",
        description: "Have a chance to gain Bounce on LMB's and RMB's. Additionally, gain Reinforce when gaining Bounce.",
        getSourcePotencies(amount) { return { bouncepotency: 0.3 * amount, reinforcepotency: 0.2 * amount }; },
        support: { "status": "Partial", "details": "Offers 0.3 * perk amount Bounce and 0.2 * perk amount Reinforce sources for manual selection. Weapon-hit chance, Bounce-to-Reinforce activation, and duration are not simulated." },
        "source": {
            "cardId": "69214b9731723704c1edaa06",
            "cardUrl": "https://trello.com/c/iarJ7Tf6"
        }
    },
    iron_slayer_spirit: {
        getMechanicsPreview() { return [row("Enhanced active Rage", "+0.2 potency; double duration"), row("Activation", "Select Iron Slayer enhancement on the affected Rage")]; },
        support: { "status": "Partial", "details": "Select Iron Slayer enhancement on an existing Rage to add a fixed 0.2 potency and double its duration. Enhancement is fixed, not multiplied by perk count, and final manual potency remains final. Charge buildup, roar Weakness potency, and automatic activation are unknown/manual." },
        id: "iron_slayer_spirit",
        name: "Iron Slayer Spirit",
        category: "Perk",
        description: "Upon reaching max stacks of spiritual energy gaining rage causes an iron slayer to  roar enhances your rage.",
        "source": {
            "cardId": "69214b9831723704c1edac96",
            "cardUrl": "https://trello.com/c/jO7w0PKD"
        },
    },
    juggernaut: {
        id: "juggernaut",
        name: "Juggernaut",
        category: "Perk",
        description: "Gain stun resistance, damage boost, and knockback resistance based on your negative speed stats.",
        onDmgBonusMultiplier(amount) {
            return positivePerk(amount) ? (getNegativeStatValue(this.stats.SpeedBoost) + getNegativeStatValue(this.stats.AttackSpeed)) * amount / 200 : null;
        },
        support: { "status": "Partial", "details": "Adds damage equal to half the magnitude of negative Speed Boost and Attack Speed stats per perk. Positive speed never penalizes damage. Stun and knockback resistance are not simulated." },
        "source": {
            "cardId": "69214b9731723704c1eda998",
            "cardUrl": "https://trello.com/c/rqrxBBeH"
        }
    },
    kama_blades: {
        id: "kama_blades",
        name: "Kama Blades",
        category: "Perk",
        description: "If your using a dagger then the weapon type becomes dual kamas or if equipped to a pole your weapon becomes a single scythe.",
        "source": {
            "cardId": "69214b9831723704c1edacc0",
            "cardUrl": "https://trello.com/c/eCUCiY6y"
        },
        weaponPriority: 20,
        modifyWeaponConstruction(amount, data, base) {
            if (!positivePerk(amount))
                return;
            if (base.handle === "pole") {
                data.constructionType = "Scythe";
                data.weaponFamily = "scythe";
                data.m1 = [[7.5, 1]];
                data.m2 = [[5, 3]];
            }
            else if (base.weaponType === "dagger") {
                data.constructionType = "Dual Kamas";
                data.weaponFamily = "dual_kamas";
                data.m1 = [[4, 1], [4, 1], [3, 3]];
                data.m2 = [[5.5, 1]];
            }
        },
        support: { "status": "Partial", "details": "Dagger becomes Dual Kamas (4, 4, 3x3 LMB; 5.5 RMB), including the explicitly documented override of Dual Wielding. A Pole becomes Scythe (7.5 LMB; 5x3 RMB). Other base weapons stay unchanged. Construction is resolved after existing stances. Conflicts with other replacement perks use documented builder priority, pending in-game verification; animation, knockback, and automatic applications are not simulated." }
    },
    kindling: {
        id: "kindling",
        name: "Kindling",
        category: "Perk",
        description: "Your Burn potency is multiplied by 50%, but has a much shorter duration.",
        onDmgBonusMultiplier(amount, args) {
            return positivePerk(amount) && args?.baseDamageData?.sourceType === "Status" && args.baseDamageData.source === "burn" ? 0.5 * amount : null;
        },
        support: { "status": "Partial", "details": "Burn status packets are multiplied by 1 + 0.5 * perk amount; direct Fire hits and other DoTs are unaffected. This changes damage rather than the shared additive potency stat. Duration shortening is not simulated." },
        "source": {
            "cardId": "69214b9731723704c1eda3be",
            "cardUrl": "https://trello.com/c/biuQhgpJ"
        }
    },
    lance: {
        id: "lance",
        name: "Lance",
        category: "Perk",
        description: "If you’re using a greatsword or unbalanced sword, then your weapon changes into a lance.",
        "source": {
            "cardId": "69214b9831723704c1edad1a",
            "cardUrl": "https://trello.com/c/KK5A6Gja"
        },
        weaponPriority: 40,
        modifyWeaponConstruction(amount, data) { if (positivePerk(amount) && ["greatsword", "unbalanced_sword"].includes(data.weaponFamily || "")) {
            data.constructionType = "Lance (LMB preview)";
            data.weaponFamily = "lance";
            data.m1 = [[6, 1]];
        } },
        support: { "status": "Partial", "details": "Greatsword/Unbalanced Sword LMB becomes the documented 6-base Lance thrust. RMB retains its prior preview because the hold-dependent ~6.8-20 range and hit count do not establish an exact packet. Construction is resolved after existing stances. Conflicts with other replacement perks use documented builder priority, pending in-game verification; animation, knockback, and automatic applications are not simulated." }
    },
    life_drinker: {
        previewInputs: ["damageDealt"],
        getMechanicsPreview(amount) { const damage = input(this, "damageDealt"); return [row("DoT lifesteal before healing modifiers", damage === undefined ? undefined : .01 * damage * amount + .1), row("Condition", "One of your DoT ticks; duration increase has no coefficient")]; },
        support: { "status": "Partial", "details": "Shows one eligible DoT tick lifesteal as 0.01 * damageDealt * perk amount + 0.1. The flat 0.1 is added once. Enter actual damage of a tick, including Caustic Slow/Melting Slime if applicable. Life Drinker duration coefficient is absent and remains held. No automatic HP mutation, tick timeline, or undocumented healing modifiers." },
        id: "life_drinker",
        name: "Life Drinker",
        category: "Perk",
        description: "Gain lifesteal on DoTs and increase the duration of DoTs.",
        "source": {
            "cardId": "69214b9831723704c1edaebc",
            "cardUrl": "https://trello.com/c/kCLCqnVT"
        },
    },
    lifesteal: {
        previewInputs: ["damageDealt"],
        getMechanicsPreview(amount) { const damage = input(this, "damageDealt"); return [row("Direct-hit lifesteal before healing modifiers", damage === undefined ? undefined : (.005 * damage + .1) * amount), row("Condition", "Direct damage only; DoTs excluded")]; },
        support: { "status": "Partial", "details": "Shows direct-hit healing as (0.005 * damageDealt + 0.1) * perk amount, using the card's per-perk interpretation. DoTs are excluded. Lifesteal and Heal Boost are now explicitly excluded from Cursed/Perk Effectiveness as their source cards require. Preview does not mutate HP or assert undocumented healing interactions." },
        id: "lifesteal",
        name: "Lifesteal",
        category: "Perk",
        description: "Heal for a portion of damage dealt.",
        "source": {
            "cardId": "69214b9731723704c1eda33e",
            "cardUrl": "https://trello.com/c/YvAb4yEj"
        },
    },
    light_bearer: {
        getMechanicsPreview(amount) { return [row("M1 / M2 heal base chance", chance(50 * amount), "%"), row("Healing amount", "Not documented; no fabricated heal value")]; },
        support: { "status": "Partial", "details": "Displays 50% base chance per perk for a heal on an M1/M2 hit, bounded to 100%. Proc coefficient and other eligibility still require the actual attack; this is a base-chance preview only. Missing heal amount/scaling is not fabricated, and no automatic heal or HP update is applied." },
        id: "light_bearer",
        name: "Light Bearer",
        category: "Perk",
        description: "Hitting an opponent with an LMB or RMB has a chance to release a heal.",
        "source": {
            "cardId": "69214b9731723704c1eda434",
            "cardUrl": "https://trello.com/c/ef1VIfPi"
        },
    },
    lithic_veil: {
        id: "lithic_veil",
        name: "Lithic Veil",
        category: "Perk",
        description: "Healing yourself and others gives temporary protection and stun resistance.",
        "source": {
            "cardId": "69214b9731723704c1edaba0",
            "cardUrl": "https://trello.com/c/nQQ1tNKd"
        },
        onFlatDamageTakenReduction(amount, args) { return positivePerk(amount) && selected(this, "lithic_veil") && args?.outputType === "Physical" ? 0.2 * amount : null; },
        support: { "status": "Partial", "details": "Select Lithic Veil on its perk holder for 0.2 flat Physical reduction per perk, after defense and per hit/output. Dexterity/Summon output are not assumed Physical constituents. Transferred potency, stun resistance, healing triggers, and duration remain manual." }
    },
    locked_and_loaded: {
        id: "locked_and_loaded",
        name: "Locked And Loaded",
        category: "Perk",
        description: "Changes your RMB to now shoot a gun instead of swinging your weapon.",
        "source": {
            "cardId": "69214b9731723704c1eda446",
            "cardUrl": "https://trello.com/c/ZpzpCd4i"
        },
    },
    lodestone_barrage: {
        id: "lodestone_barrage",
        name: "Lodestone Barrage",
        category: "Perk",
        description: "Using a Rune fires a barrage of rocks that deals Earth and Magic Damage at nearby opponents. The amount of rocks fired scales on the Cooldown.",
        "source": {
            "cardId": "69214b9731723704c1eda418",
            "cardUrl": "https://trello.com/c/3VOQH5gn"
        },
        damageScalings: { "Magic": 0.5, "Earth": 0.5, "Dexterity": 0.5 }, damageTypes: { "Earth": 0.5, "Magic": 0.5 },
        getPerkDamageInfo(amount) { if (!positivePerk(amount))
            return null; return activation("lodestone_barrage", 1.5 + 0.3 * amount, "Perk"); },
        support: { "status": "Partial", "details": "One rock: 1.5 + 0.3 * perk amount base, 0.5 Magic/Earth/Dexterity scaling. Equal Earth/Magic output is an inference because the split is unstated. Rock-count rounding and the ambiguous 20%-per-perk count increase are held. Independent activation preview; trigger rolls, timing, area/target counts, and automatic proc chains are not simulated." }
    },
    lucky: {
        id: "lucky",
        name: "Lucky",
        category: "Perk",
        description: "Dramatically increase the chance of many chance based combat effects but add negative warding, protection, and tenacity to your character.",
        statPriority: 120,
        onStatCalculation(amount) {
            if (!positivePerk(amount))
                return;
            addStat(this, "Warding", -25 * amount);
            addStat(this, "Protection", -6 * amount);
            addStat(this, "Tenacity", -0.1 * amount);
        },
        support: { "status": "Partial", "details": "Adds -25 Warding, -6 Protection, and -0.1 Tenacity per perk before Righted Wrongs and derived stats. Rerolls and chance-based activations are not simulated." },
        "source": {
            "cardId": "69214b9731723704c1eda4b0",
            "cardUrl": "https://trello.com/c/ElHijWTj"
        }
    },
    luminescent_fervor: {
        id: "luminescent_fervor",
        name: "Luminescent Fervor",
        category: "Perk",
        description: "Healing an ally gives a buff that makes them deal holy damage that counts as your damage on hit.",
        "source": {
            "cardId": "69214b9831723704c1edac36",
            "cardUrl": "https://trello.com/c/se1uG8r0"
        },
        getSourcePotencies(amount) { return { fervorpotency: amount / 10 }; },
        support: { "status": "Partial", "details": "Offers Luminescent Fervor at perk amount / 10 potency. Its shared buff adds 0.5 * effective game potency Holy output to direct packets only. Ally application, original-caster kill credit, healing triggers, and duration are not simulated." }
    },
    mage_rage: {
        id: "mage_rage",
        name: "Mage Rage",
        category: "Perk",
        description: "Rage now applies on Pure-Magic Type Damage, grants Rune Cooldown Reduction and increases potency.",
        onStatCalculation(perkAmount) {
            addRagePotency(this, perkAmount);
        },
        "source": {
            "cardId": "69214b9731723704c1edabb4",
            "cardUrl": "https://trello.com/c/HRZEyoIi"
        },
        cooldown: { "sources": ["Rune"], "ratePerPerk": 0.1, "requiredBuff": "rage" },
        support: { "status": "Partial", "details": "Rage gains Magic output eligibility; caster Rage potency scales with perk amount. Selected Rage grants 10% diminishing-return Rune CDR per perk in the reviewed cooldown preview. Application and duration are manual." }
    },
    mageling_spirit: {
        id: "mageling_spirit",
        name: "Mageling Spirit",
        category: "Perk",
        description: "Release your Spiritual Energy by using a Rune or Weapon Art, which resets the cooldown of the activator and envelopes your character in a protective Mageling that Blocks attacks and performs its Radial Burst.",
        "source": {
            "cardId": "69214b9831723704c1edac86",
            "cardUrl": "https://trello.com/c/ksLE0q3V"
        },
        damageScalings: { "Magic": 1 }, damageTypes: { "Magic": 1 },
        getPerkDamageInfo(amount) { if (!positivePerk(amount))
            return null; return activation("mageling_spirit", 27.5, "Rune"); },
        support: { "status": "Partial", "details": "One 27.5-base radial burst, 1 Magic scaling/output. Counts as Rune even if a Weapon Art triggers it, per the card. Cooldown reset, automatic blocking, guardbreak cancellation, and Spiritual Energy are manual. Independent activation preview; trigger rolls, timing, area/target counts, and automatic proc chains are not simulated." }
    },
    magic_circuit: {
        id: "magic_circuit",
        name: "Magic Circuit",
        category: "Perk",
        description: "Hitting with a Rune creates chain lightning that does Magic and Air Damage. The strength of the lightning scales on the Cooldown.",
        "source": {
            "cardId": "69214b9731723704c1edaa44",
            "cardUrl": "https://trello.com/c/yp755O8x"
        },
        damageScalings: { "Air": 0.5, "Magic": 0.5 }, damageTypes: { "Air": 0.5, "Magic": 0.5 },
        getPerkDamageInfo(amount) { if (!positivePerk(amount))
            return null; const cooldown = this.mainArmor.rune?.cooldown; if (cooldown === undefined || !Number.isFinite(cooldown) || cooldown < 0)
            return null; return activation("magic_circuit", (1 + 0.75 * amount) * (1 + 0.05 * cooldown), "Perk"); },
        support: { "status": "Partial", "details": "One chain hit uses (1 + 0.75 * perk amount) * (1 + 0.05 * selected Rune base cooldown), with half Air/Magic scaling and output. Base rather than adjusted cooldown is an explicit convention pending verification; chain target count is not multiplied. This is an independent activation preview, not automatic DPS. Trigger rolls, cooldowns, area/target counts, and unspecified proc/crit rules are not simulated." }
    },
    magic_guard: {
        getMechanicsPreview(amount) { return [row("Blocking shockwave base damage", 15 + 15 * amount), row("Cooldown", 15, "s"), row("Output", "Magic; scaling and proc coefficient amounts undocumented")]; },
        support: { "status": "Partial", "details": "Calculates the blocking shockwave base damage and fixed 15s cooldown. Magic scaling and proc coefficient are unnamed numerically, so final damage, proc rolls, and blocking activation are held." },
        id: "magic_guard",
        name: "Magic Guard",
        category: "Perk",
        description: "Release a shockwave of high Magic Damage when you Block an attack. Has a Proc Coefficient and a Cooldown.",
        "source": {
            "cardId": "69214b9731723704c1eda3a2",
            "cardUrl": "https://trello.com/c/OD9O0R6r"
        },
    },
    mark_of_the_dragon: {
        id: "mark_of_the_dragon",
        name: "Mark Of The Dragon",
        category: "Perk",
        description: "Placeholder for the passive of the dragonsoul set.",
        "source": {
            "cardId": "69214b9731723704c1eda3e2",
            "cardUrl": "https://trello.com/c/TlYpX2dp"
        },
    },
    marsh_flow: {
        id: "marsh_flow",
        name: "Marsh Flow",
        category: "Perk",
        description: "Each individual hit of a Finisher has a chance to grant Regeneration. Additionally, Being under the effects of Regeneration grants a Damage Buff.",
        sourcepotencies: { regenpotency: 1 },
        onDmgBonusMultiplier(amount) {
            return positivePerk(amount) && hasBuff(this, "regen") ? 0.2 * amount : null;
        },
        support: { "status": "Partial", "details": "Selected Regen grants 20% damage per perk. Offers its fixed 1-potency Regen source; finisher rolls and duration are manual." },
        "source": {
            "cardId": "69214b9731723704c1eda49c",
            "cardUrl": "https://trello.com/c/e6lgq8HQ"
        }
    },
    melting_shred: {
        id: "melting_shred",
        name: "Melting Shred",
        outputPriority: 100,
        statusEffects: ["anti_heal"],
        onOutputCalculation(amount, args) {
            const packet = args?.baseDamageData;
            if (!positivePerk(amount) || !packet || !(packet.sourceType === "Status" || packet.tags?.includes("DoT")) || !this.deBuffs.some(status => !!status.getDamageInfo))
                return;
            addOutput(this, "True", 0.1 * amount);
        },
        support: { status: "Partial", details: "User-authorized placeholder: +0.1 True output per perk on this applicant's DoT ticks while the applicant carries a selected damaging status (Bleed, Burn, or Poison). Preserves the DoT's existing profile and stacks with selected Wound. Anti-Heal is a separate manually selected debuff and does not require a self DoT; its healing reduction and duration are unknown. Actual game coefficients and zero-damage/status-specific exceptions remain unverified." },
        category: "Perk",
        description: "Gain additional true damage on DoTs and apply an anti healing debuff while under the effect of a DoT",
        "source": {
            "cardId": "69214b9831723704c1edaebe",
            "cardUrl": "https://trello.com/c/FZfjkqoc"
        },
    },
    minature: {
        id: "minature",
        name: "Minature",
        category: "Perk",
        description: "compressor ring isnt obtainable the description is a mystery",
        "source": {
            "cardId": "69214b9831723704c1edadd4",
            "cardUrl": "https://trello.com/c/oHAZUTAp"
        },
    },
    mine: {
        id: "mine",
        name: "Mine",
        category: "Perk",
        description: "Your RMB gets replaced with a pickaxe attack that can be held down for multiple strong attacks.",
        "source": {
            "cardId": "69214b9831723704c1edad3a",
            "cardUrl": "https://trello.com/c/a0AQAx3n"
        },
        weaponPriority: 70,
        modifyWeaponConstruction(amount, data) { if (positivePerk(amount)) {
            data.constructionType += " + Mine";
            data.m2 = [[5, 1], [10, 1], [15, 1]];
        } },
        support: { "status": "Partial", "details": "Uses the construction formula card's three held-RMB stages: 5, 10, 15 base. Each row is a separate stage, not a summed cast. The formula card warns some bases may be outdated; Shatter amount is unknown. Construction is resolved after existing stances. Conflicts with other replacement perks use documented builder priority, pending in-game verification; animation, knockback, and automatic applications are not simulated." }
    },
    money_smart: {
        id: "money_smart",
        name: "Money Smart",
        category: "Perk",
        description: "Gain extra voxos on kill and gain dmg boost scaling on how many voxos you have.",
        "source": {
            "cardId": "69214b9831723704c1edac72",
            "cardUrl": "https://trello.com/c/YpzDpSho"
        },
        onDmgBonusMultiplier(amount) { return positivePerk(amount) && selected(this, "maximum_voxos") ? 0.2 * amount : null; },
        support: { "status": "Partial", "details": "Select Maximum Voxos for the documented cap bonus of 20% damage per perk. Intermediate currency scaling and Voxos gains are not calculated." }
    },
    mortal_will: {
        id: "mortal_will",
        name: "Mortal Will",
        category: "Perk",
        description: "Your finisher deals extra holy dmg type and has increased holy scaling.",
        "source": {
            "cardId": "69214b9731723704c1eda3c8",
            "cardUrl": "https://trello.com/c/kGt8abkV"
        },
        outputPriority: 100,
        onOutputCalculation(amount, args) {
            if (!positivePerk(amount) || !isFinisher(args))
                return;
            addOutput(this, "Holy", 0.1 * amount);
            this.damageScalings.Holy = roundPerkValue((this.damageScalings.Holy || 0) + 0.15 * amount);
        },
        support: { "status": "Partial", "details": "Tagged finishers gain 0.1 Holy output and 0.15 Holy scaling per perk. Works with overlapping Weapon Art/Finisher tags. Current weapon packets tag M2 as finishers; unclassified M1 finishers are not inferred." }
    },
    mounted_defense: {
        id: "mounted_defense",
        name: "Mounted Defense",
        category: "Perk",
        description: "While mounted on the Glacial Snapper specifically, you gain Damage Reduction.",
        onDmgReducedMultiplier(amount) {
            return positivePerk(amount) && mount(this) === "glacial_snapper" ? 0.2 * amount : null;
        },
        support: { "status": "Partial", "details": "Only Mounted: Glacial Snapper enables 20% diminishing-return damage reduction per perk. Other mounts do not qualify." },
        "source": {
            "cardId": "69214b9831723704c1edadfa",
            "cardUrl": "https://trello.com/c/nNcCVWEa"
        }
    },
    mycotic_bloom: {
        id: "mycotic_bloom",
        name: "Mycotic Bloom",
        category: "Perk",
        description: "Enemies you have Poisoned are inflicted with Slow over 50%. Enemies below 50% take more Poison damage.",
        onDmgBonusMultiplier(amount, args) {
            const ratio = healthRatio(this.target), packet = args?.baseDamageData;
            return positivePerk(amount) && ratio !== undefined && ratio < 0.5 && packet?.sourceType === "Status" && packet.source === "poison" ? 0.25 * amount : null;
        },
        support: { "status": "Partial", "details": "This applicant's Poison ticks gain 25% damage per perk when the recipient is strictly below 50% HP. Exactly 50% does not qualify. Above-half Slow application is manual and its unspecified potency is not inferred." },
        "source": {
            "cardId": "69214b9831723704c1edadc0",
            "cardUrl": "https://trello.com/c/9nA8O7Im"
        }
    },
    oceans_rage: {
        id: "oceans_rage",
        name: "Oceans Rage",
        category: "Perk",
        description: "Rage now applies on Water Type Damage and grants bonus healing, and increases potency.",
        onStatCalculation(perkAmount) {
            addRagePotency(this, perkAmount);
        },
        support: { "status": "Partial", "details": "Rage gains Water output eligibility; self-applied Rage potency scales with the caster. Bonus healing is not calculated." },
        "source": {
            "cardId": "69214b9831723704c1edae28",
            "cardUrl": "https://trello.com/c/9LR5ulW3"
        },
    },
    ocean_song: {
        getMechanicsPreview(amount) { const cd = this.weaponart?.coolDown; return [...healRows(this, "Ocean Song", cd === undefined ? undefined : (1 + .1 * amount) * (1 + cd / 30), { Water: 1, Dexterity: 1 }), row("Cooldown interpretation", "Uses base Weapon Art cooldown per Stats; description conflicts about Rune cooldown")]; },
        support: { "status": "Partial", "details": "Previews (1+0.1p) base healing with 1 Water/Dexterity scaling and a 1+base Weapon Art cooldown/30 factor. Uses the Stats section's Weapon Art cooldown, while the description conflicts by naming Rune cooldown; flagged as an interpretation. Reduced-vs-base cooldown is unverified. No automatic cleanse, ally targeting, or undocumented level/recipient effects." },
        id: "ocean_song",
        name: "Ocean Song",
        category: "Perk",
        description: "Using your Weapon Art creates a brief area around yourself that cleanses and heals Allies. Scales on Water, Dexterity, and the cooldown of your Rune.",
        "source": {
            "cardId": "69214b9731723704c1eda492",
            "cardUrl": "https://trello.com/c/McwSVZiW"
        },
    },
    old_gods_might: {
        id: "old_gods_might",
        name: "Old Gods Might",
        category: "Perk",
        description: "You have two stances. Using your rune will use a variant of your weapon art instead and will cause you to go into the defense stance. However using your weapon art causes you to go into the attack stance.",
        "source": {
            "cardId": "69214b9731723704c1eda4ba",
            "cardUrl": "https://trello.com/c/27UtR6dS"
        },
    },
    packaged_power: {
        id: "packaged_power",
        name: "Packaged Power",
        category: "Perk",
        description: "Gain bonus damage scaling and healing based on how full your inventory is",
        "source": {
            "cardId": "69214b9731723704c1eda342",
            "cardUrl": "https://trello.com/c/u4gDE0wT"
        },
        onDmgBonusMultiplier(amount) { return positivePerk(amount) && selected(this, "inventory_bonus_capped") ? 0.15 * amount : null; },
        support: { "status": "Partial", "details": "Select Inventory Bonus Capped at 250/300 inventory or above for 15% damage per perk. Intermediate inventory scaling and outgoing healing are not calculated." }
    },
    pain_distribution: {
        id: "pain_distribution",
        name: "Pain Distribution",
        category: "Perk",
        description: "A portion of your damage taken is divided between all your summons. Your summons also have increased HP.",
        "source": {
            "cardId": "69214b9731723704c1eda3ce",
            "cardUrl": "https://trello.com/c/VkKfeBEX"
        },
        onDmgReducedMultiplier(amount) { return positivePerk(amount) && selected(this, "active_summons") ? 0.1 * amount : null; },
        support: { "status": "Partial", "details": "Select Active Summons for 10% damage resistance per perk. Uses the builder's diminishing-return convention because the card does not specify stacking. Summon HP, shared damage distribution, and summon deaths are not simulated." }
    },
    parry: {
        id: "parry",
        name: "Parry",
        category: "Perk",
        description: "Add a parry to your block. Increase block cooldown on missing a parry. Parries can block guard breaks",
        "source": {
            "cardId": "69214b9731723704c1eda3a4",
            "cardUrl": "https://trello.com/c/E8dV0GFm"
        },
        statusEffects: ["parry_hit"],
        support: { "status": "Partial", "details": "Select Parried Hit on the recipient for the documented fixed 90% reduction of that direct hit. The scenario is manual; does not negate status ticks or trigger on-block/guardbreak effects, and cooldown/stun are not simulated." }
    },
    penance: {
        id: "penance",
        name: "Penance",
        category: "Perk",
        description: "Gain a Damage Boost scaling on how little HP you have left, which maxes out at 25%. Additionally, whilst at 25% or lower, all hits have a 50% chance to inflict Bleed.",
        "source": {
            "cardId": "69214b9731723704c1edabb0",
            "cardUrl": "https://trello.com/c/mPpoJZEF"
        },
        onDmgBonusMultiplier(amount) { const hp = healthRatio(this); return positivePerk(amount) && hp !== undefined && hp <= 0.35 ? 0.25 * amount : null; },
        support: { "status": "Partial", "details": "At 35% HP or less, applies the documented maximum 25% damage per perk. Intermediate above-threshold scaling is unknown and is not calculated. Bleed rolls/application and duration are manual." }
    },
    phalanx_stab: {
        id: "phalanx_stab",
        name: "Phalanx Stab",
        category: "Perk",
        description: "Finisher attacks are faster and cause a stab that has a chance to apply bleed.",
        "source": {
            "cardId": "69214b9831723704c1edae9c",
            "cardUrl": "https://trello.com/c/eNRFFXzK"
        },
    },
    phantom_pain: {
        id: "phantom_pain",
        name: "Phantom Pain",
        category: "Perk",
        description: "Deal an echo of damage a couple seconds after initial impact.",
        "source": {
            "cardId": "69214b9731723704c1edaa50",
            "cardUrl": "https://trello.com/c/T3EpcFwm"
        },
    },
    photosynthesis: {
        id: "photosynthesis",
        name: "Photosynthesis",
        category: "Perk",
        description: "Gain a boost to your Holy Damage and Healing whilst standing in sunlight.",
        onSpecificDmgBonusMultiplier(amount, args) {
            return positivePerk(amount) && lighting(this) === "sunlight" && (args?.outputType === "Holy" || args?.outputType === "Earth") ? 0.2 * amount : null;
        },
        support: { "status": "Partial", "details": "In Sunlight grants 20% damage per perk to Holy and Earth portions only. Healing is not calculated." },
        "source": {
            "cardId": "69214b9731723704c1eda3ea",
            "cardUrl": "https://trello.com/c/XCDTt8fa"
        }
    },
    piercer: {
        outputPriority: -250,
        onOutputCalculation(amount, args) { if (!positivePerk(amount) || !isFinisher(args) || args?.baseDamageData?.sourceType !== "Weapon" || !piercerFamily(this.weaponFamily))
            return; const total = Object.values(this.damageTypes).reduce((sum, value) => sum + (value || 0), 0); this.damageTypes = { True: total + .1 * amount }; },
        onDmgBonusMultiplier(amount, args) { return positivePerk(amount) && isFinisher(args) && args?.baseDamageData?.sourceType === "Weapon" ? (piercerFamily(this.weaponFamily) ? .2 : .1) * amount : null; },
        support: { "status": "Partial", "details": "Compatible weapon finishers (one-handed sword, spear, dagger, fists, rapier) convert their output entirely to True and add 0.1 True output per perk, plus 20% damage per perk. Other weapon families get the documented halved 10% bonus without the compatible-only conversion. M2 is classified automatically; unclassified M1 finishers and ability exceptions remain held. Conversion ordering after earlier output conversions is a builder convention." },
        id: "piercer",
        name: "Piercer",
        category: "Perk",
        description: "The Finishers of one handed swords, spear, dagger, fists, and rapiers specifically gains a Damage Boost and has their output converted entirely to True Damage",
        "source": {
            "cardId": "69214b9731723704c1eda42e",
            "cardUrl": "https://trello.com/c/NFUcwTLW"
        },
    },
    poison_acceleration: {
        id: "poison_acceleration",
        name: "Poison Acceleration",
        category: "Perk",
        description: "Being Poisoned grants a hefty Attack Speed Boost alongside a Weapon Art and Rune Cooldown Reduction.",
        statPriority: -10,
        onStatCalculation(amount) {
            if (positivePerk(amount) && hasDebuff(this, "poison"))
                addStat(this, "AttackSpeed", 20 * amount);
        },
        "source": {
            "cardId": "69214b9831723704c1edad16",
            "cardUrl": "https://trello.com/c/rsFKJevO"
        },
        cooldown: { "sources": ["Rune", "WeaponArt"], "ratePerPerk": 0.2, "requiredDebuff": "poison" },
        support: { "status": "Partial", "details": "Selected self Poison grants 20 Attack Speed points and 20% diminishing-return Rune/Weapon Art CDR per perk. The movement-speed magnitude is unspecified and remains unimplemented." }
    },
    poisonous: {
        id: "poisonous",
        name: "Poisonous",
        category: "Perk",
        description: "Gain a small chance to inflict Poison and deal bonus Hex Damage on hit.",
        getSourcePotencies(amount) { return { poisonpotency: 0.3 * amount }; },
        support: { "status": "Partial", "details": "Offers 0.3 innate Poison potency per perk for the shared Poison DoT calculation. Random application, bonus Hex hit, and duration scaling are not simulated." },
        "source": {
            "cardId": "69214b9731723704c1eda3d0",
            "cardUrl": "https://trello.com/c/uPlSBhdo"
        }
    },
    possession: {
        id: "possession",
        name: "Possession",
        category: "Perk",
        description: "Hitting an enemy with a Weapon Art or Rune marks them for Possession. If the enemy is killed with the mark, and you possess enough of a combination of this perk and Summon Boost, they can revive as your minion.",
        "source": {
            "cardId": "69214b9731723704c1eda42c",
            "cardUrl": "https://trello.com/c/hxxvjZfA"
        },
    },
    power_inhale: {
        id: "power_inhale",
        name: "Power Inhale",
        category: "Perk",
        description: "You can hold your weapon art to speed up your weapon art if held to completion dash into and deal damage to the closest enemy infront of you.",
        "source": {
            "cardId": "69214b9831723704c1edaec2",
            "cardUrl": "https://trello.com/c/ejIfHxaz"
        },
        damageScalings: { "Air": 1 }, damageTypes: { "Air": 1 },
        getPerkDamageInfo(amount) { if (!positivePerk(amount))
            return null; return activation("power_inhale", 20 * amount, "WeaponArt"); },
        support: { "status": "Partial", "details": "One completed charge deals 20 * perk amount base with Air scaling/output and counts as Weapon Art damage. Completion/target eligibility are manual. This is an independent activation preview, not automatic DPS. Trigger rolls, cooldowns, area/target counts, and unspecified proc/crit rules are not simulated." }
    },
    power_surge: {
        previewInputs: ["remainingRune"],
        getMechanicsPreview(amount) { const remaining = input(this, "remainingRune"); return [row("Rune seconds removed per M1/M2 hit", .5 + .5 * amount, "s"), row("Rune cooldown after one hit", remaining === undefined ? undefined : Math.max(0, remaining - .5 - .5 * amount), "s")]; },
        support: { "status": "Partial", "details": "Separate current Rune cooldown preview subtracts 0.5+0.5p seconds for one M1/M2 hit, floored at zero. It does not incorrectly change base cooldown, trigger on Rune/WA damage, or invent an internal cooldown. Hit detection and elapsed time are manual." },
        id: "power_surge",
        name: "Power Surge",
        category: "Perk",
        description: "Hitting enemies with LMB's and RMB's lowers your Rune Cooldown.",
        "source": {
            "cardId": "69214b9731723704c1eda92a",
            "cardUrl": "https://trello.com/c/PcGE0Dho"
        },
    },
    primal: {
        id: "primal",
        name: "Primal",
        category: "Perk",
        description: "Heavily reduce crit chance. But crit chance is additionally converted into raw Damage Multiplier.",
        "source": {
            "cardId": "69214b9731723704c1eda9e2",
            "cardUrl": "https://trello.com/c/vzWGUk5s"
        },
    },
    propelling_fun: {
        id: "propelling_fun",
        name: "Propelling Fun",
        category: "Perk",
        description: "Jumping creates a small whirlwind that grants all Allies the ''Cloudpush'' buff briefly. ''Cloudpush'' grants additional Air Damage Type that counts as your damage for Kill Credit. Whilst Burning, activate a variant of the above effect that instead grants Fire Damage type, titled ''Cinderpull''.",
        "source": {
            "cardId": "69214b9831723704c1edaea6",
            "cardUrl": "https://trello.com/c/gzKoVlYZ"
        },
        getSourcePotencies(amount) { return { cloudpushpotency: amount / 10, cinderpullpotency: amount / 10 }; },
        getPerkDamageInfo(amount) {
            if (!positivePerk(amount))
                return null;
            return { ...activation("propelling_fun", 5 + 4 * amount), damageScalings: { Air: 1 }, damageTypes: hasDebuff(this, "burn") ? { Fire: 1 } : { Air: 1 } };
        },
        support: { "status": "Partial", "details": "Offers Cloudpush and Cinderpull at perk amount / 10 potency; their separate shared buffs add 7.5% Air/Fire output per 0.1 potency and can stack. Also previews a whirlwind with 5 + 4 * perk amount base and 1 Air scaling, using Fire output while Burning. The card's ambiguous extra Fire scaling/output parenthetical remains unimplemented. Original-applicant kill credit, jumping, and duration are manual." }
    },
    protector_spirit: {
        onFinalDamageTakenMultiplier(amount) {
            const ratio = healthRatio(this);
            return positivePerk(amount) && selected(this, "protector_guard_ready") && (amount >= 2 || ratio !== undefined && ratio < .5) ? Math.max(0, 1 - .2 * amount) : null;
        },
        getMechanicsPreview(amount) { const ratio = healthRatio(this), assist = amount >= 2 || ratio !== undefined && ratio > .5; return [row("Assist available", assist ? "Yes" : "No"), row("Assist base damage", .4 + .1 * amount), row("Earth / Magic scaling", .5), row("Defensive reduction", Math.min(100, 20 * amount), "%"), row("Approximate defensive cooldown", 3, "s")]; },
        support: { "status": "Partial", "details": "Selected Protector Guard Ready applies direct 20% damage reduction per perk below half HP, or at any HP with two or more perks, clamped to zero damage. Assist availability/base damage and 0.5 Earth/Magic scaling are displayed; its output type is undocumented so assist final damage is held. Cooldown/activation, stun, and simultaneous assist attacks are manual." },
        id: "protector_spirit",
        name: "Protector Spirit",
        category: "Perk",
        description: "Gain a miniature Bastion Spirit that assists with LMB and RMB damage at above half, but instead reduces incoming Damage and Stun with a Cooldown when below.",
        "source": {
            "cardId": "69214b9731723704c1edaba8",
            "cardUrl": "https://trello.com/c/FmE8jZG8"
        },
    },
    proto_tech: {
        getMechanicsPreview(amount) { return [row("Poison lightning chance per second", chance(10 * amount), "%")]; },
        support: { "status": "Partial", "details": "Shows 10% per perk per-second chance capped at 100%. Base lightning damage, output/scaling, Poison potency, and continuous rolls are undocumented; no per-hit proc is invented." },
        id: "proto_tech",
        name: "Proto Tech",
        category: "Perk",
        description: "Ocassionally emit poison chain lightning from your character.",
        "source": {
            "cardId": "69214b9831723704c1edad26",
            "cardUrl": "https://trello.com/c/CDJxz3Ru"
        },
    },
    pure_rot: {
        id: "pure_rot",
        name: "Pure Rot",
        category: "Perk",
        description: "No longer remove debuffs when purifying, but allow people you purify to apply poison for you.",
        "source": {
            "cardId": "69214b9731723704c1eda3d4",
            "cardUrl": "https://trello.com/c/LtBiZA2N"
        },
        onDmgBonusMultiplier(amount, args) { return positivePerk(amount) && selected(this, "pure_rot_poison") && args?.baseDamageData?.sourceType === "Status" && args.baseDamageData.source === "poison" ? 0.1 * amount : null; },
        support: { "status": "Partial", "details": "Select Poison via Pure Rot on the original applicant only for a Poison preview created via this perk: +10% Poison damage per perk. Ordinary Poison and direct Hex hits stay unchanged when the control is off. Poison transfer/credit, Rotted source potency, purifying, and duration are not inferred." }
    },
    pursuit: {
        id: "pursuit",
        name: "Pursuit",
        category: "Perk",
        description: "Removes your finisher and knockback from your m1 combo and replaces it with the first attack of the combo without any recovery time.",
        "source": {
            "cardId": "69214b9831723704c1edae76",
            "cardUrl": "https://trello.com/c/35mGGKLm"
        },
        weaponPriority: 150,
        modifyWeaponPackets(amount, packets) { if (positivePerk(amount))
            for (const packet of packets.m1)
                packet.damage *= Math.max(0, 0.6 + 0.2 * amount); },
        support: { "status": "Partial", "details": "Generated LMB packets receive the verified x (0.6 + 0.2 * perk amount) damage factor. RMB is unchanged. M1 finisher replacement is held because legacy constructions lack reliable per-step finisher metadata; recovery time and knockback are not simulated." }
    },
    pyre_bloom: {
        id: "pyre_bloom",
        name: "Pyre Bloom",
        category: "Perk",
        description: "Upon using a Weapon Art, summon a stationary Pyrebloom that shoots fireballs at nearby enemies. Their damage counts as Weapon Art damage, and shares the same Buffs as you. Grants Burn potency.",
        "source": {
            "cardId": "69214b9831723704c1edae32",
            "cardUrl": "https://trello.com/c/XHQ7jYcv"
        },
        onStatCalculation(amount) { if (positivePerk(amount))
            addPotency(this, "burnpotency", amount); },
        damageScalings: { Fire: 1, Summon: 1 }, damageTypes: { Fire: 1 },
        getPerkDamageInfo(amount) {
            const cooldown = this.weaponart?.coolDown;
            return positivePerk(amount) && cooldown !== undefined && Number.isFinite(cooldown) && cooldown >= 0 ? activation("pyre_bloom", (1.5 + 0.325 * amount) * (1 + cooldown / 120), "WeaponArt") : null;
        },
        support: { "status": "Partial", "details": "One fireball uses (1.5 + 0.325 * perk amount) * (1 + selected Weapon Art base cooldown / 120), with Fire/Summon scaling, Fire output, and Weapon Art classification. Adds one additive Burn potency point per perk from its potency source card. Ammo, plants, firing rate, targets, Burn application, and duration are manual." }
    },
    quake: {
        id: "quake",
        name: "Quake",
        category: "Perk",
        description: "Gain a small chance to create an Earth shockwave around the enemy you hit, dealing additional Earth damage and Stun alongside Knockback.",
        "source": {
            "cardId": "69214b9731723704c1eda35e",
            "cardUrl": "https://trello.com/c/A3c7WDYY"
        },
        damageScalings: { "Earth": 1 }, damageTypes: { "Earth": 1 },
        getPerkDamageInfo(amount) { if (!positivePerk(amount))
            return null; return activation("quake", 2.5 + 2.5 * amount); },
        support: { "status": "Partial", "details": "One shockwave deals 2.5 + 2.5 * perk amount base with 1 Earth scaling; Earth output is inferred from the description. The 30 + 5 * perk amount percent chance is not averaged into this activation. Separate activation preview; trigger rolls, cooldowns, area/target counts, and recursive procs are not simulated. Unspecified proc coefficients and crit eligibility use the existing direct-packet defaults." }
    },
    quarry: {
        id: "quarry",
        name: "Quarry",
        category: "Perk",
        description: "Hitting an enemy builds up an invisible neutral status on them. At maximum stacks of this status, deal a burst of Holy and Physical Damage. Has a Cooldown per enemy.",
        "source": {
            "cardId": "69214b9831723704c1edacd8",
            "cardUrl": "https://trello.com/c/yNxjT0Qy"
        },
        damageScalings: { "Holy": 1, "Physical": 1 }, damageTypes: { "Holy": 0.5, "Physical": 0.5 },
        getPerkDamageInfo(amount) { if (!positivePerk(amount))
            return null; return activation("quarry", 20 * amount, "Perk"); },
        support: { "status": "Partial", "details": "One Hidden Treasure burst deals 20 * perk amount base with Holy/Physical scaling and split output. Four-stack buildup and per-enemy cooldown are manual. This is an independent activation preview, not automatic DPS. Trigger rolls, cooldowns, area/target counts, and unspecified proc/crit rules are not simulated." }
    },
    queen_bumblz_spirit: {
        getMechanicsPreview() { return [row("Base damage per honey blast", 8), row("Shots per activation", 9), row("Volley base damage", 72), row("Approximate duration", 15, "s"), row("Applied Sticky duration", 5, "s"), row("Scaling", "Holy / Magic / Summon coefficients and output undocumented")]; },
        support: { "status": "Partial", "details": "Displays fixed 8 base per shot, nine shots/72 total base over approximately 15s, and 5s Sticky. Holy/Magic/Summon scaling coefficients, output type, targeting/range, and Spiritual Energy activation are held. The queen is not treated as a summon." },
        id: "queen_bumblz_spirit",
        name: "Queen Bumblz Spirit",
        category: "Perk",
        description: "Upon reaching max stacks of spiritual energy summoning conjures a queen bee that follows you shooting honey blasts at nearby enemies.",
        "source": {
            "cardId": "69214b9831723704c1edacae",
            "cardUrl": "https://trello.com/c/NrmzTU98"
        },
    },
    queen_s_guard: {
        id: "queen_s_guard",
        name: "Queen's Guard",
        category: "Perk",
        description: "Increase HP and speed of summons and when you summon gain reinforce.",
        getSourcePotencies(amount) { return { reinforcepotency: 0.5 + 0.1 * amount }; },
        support: { "status": "Partial", "details": "Offers 0.5 + 0.1 * perk amount Reinforce potency after summoning. Summon HP/speed bonuses, automatic activation, and duration are not calculated." },
        "source": {
            "cardId": "69214b9731723704c1eda47c",
            "cardUrl": "https://trello.com/c/L6QUW33j"
        }
    },
    queen_s_power: {
        id: "queen_s_power",
        name: "Queen's Power",
        category: "Perk",
        description: "After using a summon you gain a buff that gives attack speed and makes your LMBs scale slightly off of summon boost.",
        "source": {
            "cardId": "69214b9731723704c1eda486",
            "cardUrl": "https://trello.com/c/iXRhniBw"
        },
        getSourcePotencies(amount) { return { queenspowerpotency: amount / 10 }; },
        support: { "status": "Partial", "details": "Offers Queen's Power at perk amount / 10 potency. Its shared buff adds 20 + 100 * game potency Attack Speed points and 2 * game potency Summon scaling to M1/M2. Summoning, automatic application, and duration are manual. Status stats run after reviewed perk stat conversions." }
    },
    quick_witted: {
        id: "quick_witted",
        name: "Quick Witted",
        category: "Perk",
        description: "Increases your Dexterity Boost scaling off of your Speed Boost.",
        statPriority: 45,
        onStatCalculation(amount) {
            if (positivePerk(amount))
                addStat(this, "DexterityBoost", 0.25 * (this.stats.SpeedBoost || 0) * amount);
        },
        support: { "status": "Implemented", "details": "Adds 25% of Speed Boost per perk to Dexterity Boost, after Whirl Foot and before Swift Guard. Derived-stat ordering is explicit and does not repeat to create a feedback loop." },
        "source": {
            "cardId": "69214b9731723704c1eda470",
            "cardUrl": "https://trello.com/c/73dSCsCt"
        }
    },
    quickcast: {
        getMechanicsPreview() { return [row("Stun reduction during Weapon Art", .2, "s"), row("Cast speed", "Faster; no numerical speed multiplier documented")]; },
        support: { "status": "Partial", "details": "Shows the fixed 0.2s Weapon Art stun reduction, independent of stack count. Cast-time speed and combination with other stun modifiers are undocumented; no Rune/Weapon Art cooldown change is invented." },
        id: "quickcast",
        name: "Quickcast",
        category: "Perk",
        description: "Casting weapon arts is much faster and take slightly reduced stun while using weapon arts.",
        "source": {
            "cardId": "69214b9831723704c1edadbc",
            "cardUrl": "https://trello.com/c/g2viQpA0"
        },
    },
    quickdraw: {
        id: "quickdraw",
        name: "Quickdraw",
        category: "Perk",
        description: "Upon equipping your weapon gain a high damage boost for weapon arts and runes for a short period of time.",
        onDmgBonusMultiplier(amount, args) {
            return positivePerk(amount) && selected(this, "quickdraw") && isRuneOrWeaponArtHit(args) ? 0.3 * amount : null;
        },
        support: { "status": "Partial", "details": "Select the neutral Quickdraw state for 30% Rune/Weapon Art damage per perk. It does not count as a game buff. Weapon-equipping detection and five-second expiration are manual." },
        "source": {
            "cardId": "69214b9731723704c1eda3d6",
            "cardUrl": "https://trello.com/c/hWCUSZTd"
        }
    },
    quicksand: {
        id: "quicksand",
        name: "Quicksand",
        category: "Perk",
        description: "Using your Weapon Art creates a pool of quicksand, which deals Air and Earth Damage. Has a reduced Proc Coefficient.",
        "source": {
            "cardId": "69214b9731723704c1eda43a",
            "cardUrl": "https://trello.com/c/65ejRzni"
        },
        damageScalings: { "Air": 1, "Earth": 1 }, damageTypes: { "Air": 0.5, "Earth": 0.5 },
        getPerkDamageInfo(amount) { if (!positivePerk(amount))
            return null; return activation("quicksand", 0.3, selected(this, "quicksand_weapon_art_tick") ? "WeaponArt" : "Perk", 0.2); },
        support: { "status": "Partial", "details": "One pool tick, 0.3 base, 1 Air/Earth scaling, half Air/Earth output, base proc coefficient 0.2. Select Quicksand Weapon Art Tick for the half of ticks classified Weapon Art; other ticks remain Perk. Tick count is crossed out on the card and is not guessed. Independent activation preview; trigger rolls, timing, area/target counts, and automatic proc chains are not simulated." }
    },
    rabbits_foot: {
        getMechanicsPreview(amount) { return [row("Incoming dodge chance", chance(amount), "%"), row("Roll invincibility multiplier", 1 + .5 * amount, "x"), row("Dodge consequence", "A successful dodge also prevents that attack's DoT application; no random dodge roll is simulated")]; },
        support: { "status": "Partial", "details": "Displays 1% dodge chance per perk and 50% additional roll invincibility per perk, retaining fractional amounts and capping displayed chance at 100%. Does not turn chance into unconditional damage reduction or multiply all incoming damage by an expectation. Successful dodges and status-application prevention remain manual." },
        id: "rabbits_foot",
        name: "Rabbits Foot",
        category: "Perk",
        description: "Small chance to dodge incoming Damage, and also increases Iframes on rolls.",
        "source": {
            "cardId": "69214b9731723704c1eda340",
            "cardUrl": "https://trello.com/c/PMeIQVxz"
        },
    },
    radiance: {
        previewInputs: ["baseHeal"], damageTypes: { Holy: 1 }, damageScalings: { Holy: 10 },
        getPerkDamageInfo(amount) { const heal = input(this, "baseHeal"); return !positivePerk(amount) || heal === undefined ? null : activation("radiance", 1 + heal * (1 + .1 * Math.max(0, this.perks.heal_boost || 0)) * (4 / 45) * amount); },
        getMechanicsPreview() { return [row("Condition", "Enter pure base healing of a compatible heal; excludes recipient healing-received and critical healing"), row("Holy scaling", 10), row("Higher stacks", "Uses the card's literal formula; stacking note remains unverified")]; },
        support: { "status": "Partial", "details": "Manual compatible-heal activation uses 1 + base healing * (1 + Heal Boost) * (4/45) * perk amount, with 10 Holy scaling/output. Recipient healing-received and critical-healing bonuses are excluded. Uses literal formula despite the card flagging higher stacks as untested. Heal compatibility, area, and automatic heal-trigger chains are manual." },
        id: "radiance",
        name: "Radiance",
        category: "Perk",
        description: "Most heals now deal Holy Damage in a radius, scaling only off of their base strength.",
        "source": {
            "cardId": "69214b9731723704c1eda3c2",
            "cardUrl": "https://trello.com/c/dOR4MMik"
        },
    },
    raging_bounce: {
        id: "raging_bounce",
        name: "Raging Bounce",
        category: "Perk",
        description: "Gain a universal Damage Boost when under the effects of Bounce, scaling off of its potency.",
        onDmgBonusMultiplier(amount) {
            return positivePerk(amount) ? 0.7 * amount * selectedBuffPotency(this, "bounce") : null;
        },
        support: { "status": "Implemented", "details": "All damage gains a multiplier of 1 + 0.7 * perk amount * effective selected Bounce potency, using the status applicant and override." },
        "source": {
            "cardId": "69214b9731723704c1eda370",
            "cardUrl": "https://trello.com/c/CSv4bCK2"
        }
    },
    reinforced_block: {
        id: "reinforced_block",
        name: "Reinforced Block",
        category: "Perk",
        description: "Decreases chip damage when blocking attacks.",
        "source": {
            "cardId": "69214b9731723704c1eda390",
            "cardUrl": "https://trello.com/c/8IqoxhuL"
        },
        onDmgReducedMultiplier(amount) { return positivePerk(amount) && selected(this, "scenario_blocking") ? 1 + 0.5 * amount : null; },
        support: { "status": "Partial", "details": "Select Blocking for diminishing-return reduction: divide incoming damage by 2 + 0.5 * perk amount. Blocking effectiveness from unreviewed systems, guard breaks, and chip eligibility are manual." }
    },
    rejuvenating_flame: {
        id: "rejuvenating_flame",
        name: "Rejuvenating Flame",
        category: "Perk",
        description: "Passively heal other Allies around you scaling on perk amount and Fire Boost. Additionally those who you heal gain a buff that grants bonus fire damage type. The effectiveness is multiplied if you're Burning.",
        "source": {
            "cardId": "69214b9731723704c1eda392",
            "cardUrl": "https://trello.com/c/U7SwdI8y"
        },
        getSourcePotencies(amount, applicant) { return { cindersurgepotency: 0.05 * amount * (hasDebuff(applicant, "burn") ? 2 : 1) }; },
        support: { "status": "Partial", "details": "Offers Cinder Surge at 0.05 * perk amount potency, doubled if the applicant is Burning when the source is selected. Its shared buff adds that effective potency as Fire output. Re-select the source to represent aura reapplication after Burn changes. Healing, range, and duration are manual." }
    },
    revel_in_death: {
        previewInputs: ["summonBaseHP"],
        getMechanicsPreview(amount) { const hp = input(this, "summonBaseHP"); return [...healRows(this, "Summon death (before unknown level scaling)", hp === undefined ? undefined : .1 * hp * amount), ...healRows(this, "Summon despawn (before unknown level scaling)", hp === undefined ? undefined : .01 * hp * amount)]; },
        support: { "status": "Partial", "details": "Previews 10% of natural summon base HP per perk on death, or 1% on despawn. Uses natural base HP rather than scaled summon max HP. Heal Boost and a separate generic critical branch are displayed, but level scaling and whether this source can critically heal remain unverified; no death detection or HP mutation." },
        id: "revel_in_death",
        name: "Revel In Death",
        category: "Perk",
        description: "Whenever a minion of yours dies, gain a small heal.",
        "source": {
            "cardId": "69214b9731723704c1eda3ba",
            "cardUrl": "https://trello.com/c/0Jo2ySfO"
        },
    },
    roaring_heads: {
        id: "roaring_heads",
        name: "Roaring Heads",
        category: "Perk",
        description: "Gain a high chance on hit to self inflict a variety of Debuffs. Each unique Debuff grants an Attack Speed Bonus, and every tenth self inflicted Debuff releases a roar that deals damage and Stuns. Additionally, gain a large amount of negative Warding, but reduce the effects of Weakeness and Shatter.",
        "source": {
            "cardId": "69214b9831723704c1edaf04",
            "cardUrl": "https://trello.com/c/DOxZoBsS"
        },
        statPriority: 120,
        onStatCalculation(amount) { if (positivePerk(amount)) {
            addStat(this, "Warding", -50 * amount);
            addStat(this, "AttackSpeed", 5 * getDebuffCount(this));
        } },
        sourcepotencies: { shatterpotency: 0.3, weakeningpotency: 0.3 },
        damageScalings: { Hex: 1 }, damageTypes: { Hex: 1 },
        getPerkDamageInfo(amount) { return positivePerk(amount) ? activation("roaring_heads", 5 + 2.5 * amount) : null; },
        support: { "status": "Partial", "details": "Adds -50 Warding per perk and +5 Attack Speed points per distinct self debuff. Received Weakness/Shatter potency is multiplied by max(0, 1 - 0.33 * perk amount); outgoing potency is unchanged and final manual overrides bypass reduction. Offers fixed 0.3 sources and a separate roar activation preview. Chance rolls, tenth-debuff counting, Anti Heal, and stun are manual." }
    },
    rocky_body: {
        id: "rocky_body",
        name: "Rocky Body",
        category: "Perk",
        description: "Increases your Physical Defense scaling off of your Earth Boost.",
        statPriority: 40,
        onStatCalculation(amount) { if (positivePerk(amount))
            addStat(this, "PhysicalDefense", 0.5 * (this.stats.EarthBoost || 0) * amount); },
        support: { "status": "Partial", "details": "Adds 0.5 * Earth Boost * perk amount Physical Defense after conversion. The card itself labels the formula as probable; it remains flagged for in-game confirmation." },
        "source": {
            "cardId": "69214b9731723704c1edabbe",
            "cardUrl": "https://trello.com/c/o0OgPMRa"
        }
    },
    roguent_spirit: {
        getMechanicsPreview() { return [row("Spirit charge consumed per use", 50), row("Critical chance of splinters", 100, "%"), row("Condition", "Must reach full charge before using; base damage and scaling unknown")]; },
        support: { "status": "Partial", "details": "Shows fixed 50 spirit charge per use and guaranteed critical splinters, with the full-charge prerequisite. Damage/scaling/output, charge gain, and automatic spirit consumption remain held; guaranteed crit is not applied to ordinary weapon attacks." },
        id: "roguent_spirit",
        name: "Roguent Spirit",
        category: "Perk",
        description: "Upon reaching max stacks of spiritual energy right clicking throws splinters forewards.",
        "source": {
            "cardId": "69214b9831723704c1edaca4",
            "cardUrl": "https://trello.com/c/z9QPnUZt"
        },
    },
    roll_back: {
        id: "roll_back",
        name: "Roll Back",
        category: "Perk",
        description: "Roll Back",
        "source": {
            "cardId": "69214b9731723704c1eda3e4",
            "cardUrl": "https://trello.com/c/nYGBkhWU"
        },
    },
    rotating_blades: {
        id: "rotating_blades",
        name: "Rotating Blades",
        category: "Perk",
        description: "Your weapon m1s/m2s hit twice as much but deal reduced damage.",
        "source": {
            "cardId": "69214b9831723704c1edac4a",
            "cardUrl": "https://trello.com/c/RtJsuD74"
        },
        weaponPriority: 200,
        modifyWeaponPackets(amount, packets) { if (!positivePerk(amount))
            return; for (const packet of [...packets.m1, ...packets.m2]) {
            packet.damage *= 0.5 * (1 + 0.2 * amount);
            packet.hitAmount *= 2;
            packet.procCoefficient = (packet.procCoefficient ?? 1) * 0.7;
        } },
        support: { "status": "Partial", "details": "Generated weapon packets have twice the hit count, per-hit damage x 0.5 * (1 + 0.2 * perk amount), and proc coefficient x0.7. Applies once after replacements, preserving their profiles. Independent Rune/Weapon Art/Perk activations are unaffected. Displayed totals include every hit; no automatic perk-proc chain is added." }
    },
    royal_finisher: {
        id: "royal_finisher",
        name: "Royal Finisher",
        category: "Perk",
        description: "Release a magic wave when you use a finisher.",
        "source": {
            "cardId": "69214b9731723704c1eda398",
            "cardUrl": "https://trello.com/c/GR94krv6"
        },
        damageScalings: { "Magic": 1 }, damageTypes: { "Magic": 1 },
        getPerkDamageInfo(amount) { if (!positivePerk(amount))
            return null; return activation("royal_finisher", 3 + amount); },
        support: { "status": "Partial", "details": "One finisher wave, 3 + perk amount base and 1 Magic scaling. Magic output is inferred from the description; the wave itself is a Perk packet, not a weapon finisher. Separate activation preview; trigger rolls, cooldowns, area/target counts, and recursive procs are not simulated. Unspecified proc coefficients and crit eligibility use the existing direct-packet defaults." }
    },
    royal_parry: {
        id: "royal_parry",
        name: "Royal Parry",
        category: "Perk",
        description: "Whenever you land a parry you gain a bonus that makes your next attack always crit and deal bonus damage.",
        "source": {
            "cardId": "69214b9731723704c1eda45c",
            "cardUrl": "https://trello.com/c/7rLtzchF"
        },
        critical: { requiredBuff: "guaranteed_crit", fixedHitMultiplier: 1.5 },
        support: { "status": "Partial", "details": "Selected Guaranteed Crit enables a fixed 1.5 multiplier on the critical branch only, even when that buff came from another source. Natural crit chance or perk-only guaranteed crit does not enable it. Buff consumption, buff-vs-natural crit attribution at already-100% chance, and duration remain manual." }
    },
    ruler_of_the_sands: {
        getMechanicsPreview(amount) { const luck = selected(this, "kings_luck"); const rate = (cd) => luck ? 100 : cd === undefined ? undefined : chance((1 + .9 * cd) * amount); return [row("Sandstorm chance · Rune", rate(this.mainArmor.rune?.cooldown), "%"), row("Sandstorm chance · Weapon Art", rate(this.weaponart?.coolDown), "%"), row("Chance basis", luck ? "King's Luck guarantees activation" : "Base ability cooldown; ignores CDR"), row("Sandstorm duration", "approximately 5s; damage coefficients missing")]; },
        support: { "status": "Partial", "details": "Displays sandstorm chance (1+0.9*base ability cooldown)*p percent separately for Rune/WA, unaffected by CDR. Selected King's Luck guarantees activation as its source interaction specifies. Missing damage/scaling coefficients and stacking duration are not invented; proc rolls and multiple sandstorms remain manual." },
        id: "ruler_of_the_sands",
        name: "Ruler Of The Sands",
        category: "Perk",
        description: "Using a weapon art or rune has a chance to summon a sandstorm.",
        "source": {
            "cardId": "69214b9731723704c1eda3cc",
            "cardUrl": "https://trello.com/c/Mhw4xIbL"
        },
    },
    runic_blades: {
        getMechanicsPreview(amount) { return [row("Base damage per blade", 3.5), row("Approximate mark duration", 6.5 * amount, "s"), row("Approximate trigger cooldown", "0.05–0.1 seconds"), row("Scaling / output", "Undocumented; blade damage is independent of the triggering hit")]; },
        support: { "status": "Partial", "details": "Shows fixed 3.5 base blade damage, approximately 6.5s mark duration per perk, and 0.05\u20130.1s trigger cooldown. No invented scaling/output, reduced proc coefficient, automatic marking, or hit-generated blades." },
        id: "runic_blades",
        name: "Runic Blades",
        category: "Perk",
        description: "Runes or weapon arts mark the opponent with a debuff that launches blades at them when hit.",
        "source": {
            "cardId": "69214b9831723704c1edac6c",
            "cardUrl": "https://trello.com/c/BfKe6Lxp"
        },
    },
    runic_winds: {
        id: "runic_winds",
        name: "Runic Winds",
        category: "Perk",
        description: "Using a Rune grants you Tailwind.",
        getSourcePotencies(amount) { return { tailwindpotency: 0.1 * amount }; },
        cooldown: { sources: ["Rune"], ratePerPerk: 0.1, requiredBuff: "tailwind" },
        support: { "status": "Partial", "details": "Offers 0.1 * perk amount Tailwind as a manual source. Selected Tailwind grants 10% diminishing-return Rune CDR per perk, independent of potency. Rune activation and duration are manual." },
        "source": {
            "cardId": "69214b9731723704c1eda362",
            "cardUrl": "https://trello.com/c/xvseWOc5"
        }
    },
    sacred_grounds: {
        id: "sacred_grounds",
        name: "Sacred Grounds",
        category: "Perk",
        description: "Using a Rune causes a holy cross to fall after a short delay, which slightly heals and grants Reinforce.",
        getSourcePotencies(amount) { return { reinforcepotency: 0.2 * amount }; },
        support: { "status": "Partial", "details": "Offers 0.2 * perk amount Reinforce potency after a Rune. The holy cross, delayed activation, healing, and duration are not simulated." },
        "source": {
            "cardId": "69214b9731723704c1eda438",
            "cardUrl": "https://trello.com/c/hiETbRAL"
        }
    },
    sacrificial_summoning: {
        id: "sacrificial_summoning",
        name: "Sacrificial Summoning",
        category: "Perk",
        description: "Summoning applies poison to you and summons longer lasting minions. Additionally taking hex damage restores a small precentage of your summon’s base hp.",
        "source": {
            "cardId": "69214b9731723704c1eda38a",
            "cardUrl": "https://trello.com/c/6l6zNB5w"
        },
        sourcepotencies: { poisonpotency: 2 },
        support: { "status": "Partial", "details": "Offers the documented displayed potency 2 self-Poison source on summoning. Select Poison with Applied by Self; source innate potency stays separate from additive gear potency. Summon decay, HP restoration, automatic application, and seven-tick duration are not simulated." }
    },
    sandy_wounds: {
        getMechanicsPreview() { return [row("Bleed scaling", "Transfers existing Physical scaling to Earth, Dexterity to Air"), row("Additional outputs / duration", "Amounts unknown; not added")]; },
        support: { "status": "Partial", "details": "Applicant-owned Bleed transfers its existing Physical/Dexterity scaling coefficients to Earth/Air as a stated builder convention. Status source ownership and manual potency inputs are retained. Extra Earth/Air output coefficients and longer duration are undocumented and held." },
        id: "sandy_wounds",
        name: "Sandy Wounds",
        category: "Perk",
        description: "Bleed now instead scales on Air and Earth, gains additional Earth/Air damage based on Earth/Air boost, and has a longer duration.",
        "source": {
            "cardId": "69214b9731723704c1eda974",
            "cardUrl": "https://trello.com/c/qq92CeKg"
        },
    },
    savage_combo: {
        weaponPriority: 100,
        modifyWeaponPackets(amount, packets) { if (positivePerk(amount))
            packets.m1.forEach((packet, index) => { packet.comboStep = index + 1; }); },
        onDmgBonusMultiplier(amount, args) { if (!positivePerk(amount) || args?.baseDamageData?.sourceType !== "Weapon" || args.baseDamageData.sourceDamageType !== "M1")
            return null; const index = args.baseDamageData.comboStep ?? this.buff?.find(status => status.id === "savage_combo_step")?.stacks; return index && Number.isFinite(index) ? .15 * (Math.max(1, Math.floor(index)) - 1) : null; },
        getMechanicsPreview() { return [row("M1 combo ramp", "First 0%, second +15%, third +30%, etc.; shown in each attack column"), row("Reset", "Original combo resets automatically in the table; manual single-hit snapshots can use Savage Combo Step")]; },
        support: { "status": "Partial", "details": "Original M1 packets carry their attack number, giving no ramp on the first attack and +15% per previous M1 in each table column, independent of hit count or perk stacks. Rune/M2/status packets do not qualify. The original combo resets when recalculated. Savage Combo Step remains a fallback for manual single-hit snapshots; unmodelled continuous attack loops and the first-attack baseline are explicit conventions." },
        id: "savage_combo",
        name: "Savage Combo",
        category: "Perk",
        description: "Hitting an opponent with consecutive m1's gives ramping damage. Resets after the the m1 combo ends.",
        "source": {
            "cardId": "69214b9731723704c1eda42a",
            "cardUrl": "https://trello.com/c/mIKy8JIv"
        },
    },
    saw_heart: {
        id: "saw_heart",
        name: "Saw Heart",
        category: "Perk",
        description: "If you are using a basic fist weapon type your hands become chainsaws changing your fighting style that has a chance to apply armor break and bleed.",
        "source": {
            "cardId": "69214b9831723704c1edac54",
            "cardUrl": "https://trello.com/c/09qOIev2"
        },
        weaponPriority: 30,
        modifyWeaponConstruction(amount, data) { if (positivePerk(amount) && data.weaponFamily === "fist") {
            data.constructionType = "Saw Fists";
            data.weaponFamily = "saw_fists";
            data.m1 = [[3.5, 2], [3.5, 2], [3.5, 2]];
            data.m2 = [[2.6, 7]];
        } },
        support: { "status": "Partial", "details": "Basic Fist becomes Saw Fists: three 3.5x2 LMB steps and 2.6x7 RMB. Does not replace Dual Guns or another resolved stance. Bleed/Shatter potency and proc chance are unknown. Construction is resolved after existing stances. Conflicts with other replacement perks use documented builder priority, pending in-game verification; animation, knockback, and automatic applications are not simulated." }
    },
    saw_stance: {
        id: "saw_stance",
        name: "Saw Stance",
        category: "Perk",
        description: "Two Handed Swords change into a different fighting stance that has a chance to apply armor break and bleed on hit.",
        "source": {
            "cardId": "69214b9831723704c1edac4e",
            "cardUrl": "https://trello.com/c/XaAX73uX"
        },
    },
    screeching_sound: {
        id: "screeching_sound",
        name: "Screeching Sound",
        category: "Perk",
        description: "Blocking an Attack has a chance to create a small shockwave of Air that deals slight Damage, Stuns, and Taunts nearby enemies.",
        "source": {
            "cardId": "69214b9731723704c1edaa10",
            "cardUrl": "https://trello.com/c/rlZxlEzw"
        },
        damageScalings: { "Air": 1 }, damageTypes: { "Air": 1 },
        getPerkDamageInfo(amount) { if (!positivePerk(amount))
            return null; return activation("screeching_sound", 1); },
        support: { "status": "Partial", "details": "One block-triggered shockwave deals fixed 1 base with 1 Air scaling; Air output is inferred from the description. Poise, stun, and Taunt are not simulated. Separate activation preview; trigger rolls, cooldowns, area/target counts, and recursive procs are not simulated. Unspecified proc coefficients and crit eligibility use the existing direct-packet defaults." }
    },
    seismic_momentum: {
        id: "seismic_momentum",
        name: "Seismic Momentum",
        category: "Perk",
        description: "Your crit chance scales on your earth boost instead of dex boost.",
        critical: { chancePerBoost: { EarthBoost: 0.00075 }, damagePerBoost: { EarthBoost: 0.00075 }, replacesDexterityChance: true },
        support: { "status": "Partial", "details": "Replaces the default Dexterity crit-chance contribution with 0.075% per Earth Boost per perk and adds equal crit damage. Other crit sources still stack. Dexterity's separate damage bonus is retained because the card only replaces chance; that distinction needs in-game confirmation." },
        "source": {
            "cardId": "69214b9731723704c1eda48c",
            "cardUrl": "https://trello.com/c/yJt9lFvu"
        }
    },
    serrated_edge: {
        id: "serrated_edge",
        name: "Serrated Edge",
        category: "Perk",
        description: "Finishers gain a Damage Boost and inflicts Bleed.",
        "source": {
            "cardId": "69214b9731723704c1eda3a6",
            "cardUrl": "https://trello.com/c/EXxrHQii"
        },
        onDmgBonusMultiplier(amount, args) {
            return positivePerk(amount) && isFinisher(args) ? 0.2 * amount : null;
        },
        onStatCalculation(amount) { if (positivePerk(amount))
            this.potencies.bleedpotency = roundPerkValue((this.potencies.bleedpotency || 0) + 2 * amount); },
        support: { "status": "Partial", "details": "Tagged finishers gain 20% damage at one perk and +0.2 additive Bleed potency per perk. Linear damage stacking beyond one perk is provisional because the source only specifies damage at one. Bleed application/duration are manual; unclassified M1 finishers are not inferred." }
    },
    shamanic_flow: {
        previewInputs: ["remainingWeaponArt"],
        getMechanicsPreview(amount) { const remaining = input(this, "remainingWeaponArt"); return [row("WA seconds removed per weapon hit", .3 * amount, "s"), row("WA cooldown after one hit", remaining === undefined ? undefined : Math.max(0, remaining - .3 * amount), "s")]; },
        support: { "status": "Partial", "details": "Separate current Weapon Art cooldown preview subtracts 0.3 seconds per perk for one landed weapon hit, floored at zero. Static/base cooldown stays intact. The result is one manual event snapshot rather than an automatic countdown or an unconditional permanent cooldown bonus." },
        id: "shamanic_flow",
        name: "Shamanic Flow",
        category: "Perk",
        description: "Landing weapon hits lowers weapon art cooldown slightly.",
        "source": {
            "cardId": "69214b9731723704c1eda404",
            "cardUrl": "https://trello.com/c/G1FPIsxT"
        },
    },
    sharp_claws: {
        id: "sharp_claws",
        name: "Sharp Claws",
        category: "Perk",
        description: "Apply bleed and wound on attacks that guard break. Wound makes bleed apply slight stun and additionally adds additional true damage to bleed. Grants bleed potency.",
        "source": {
            "cardId": "69214b9731723704c1eda348",
            "cardUrl": "https://trello.com/c/HPVgS8Ti"
        },
        getSourcePotencies(amount) { return { bleedpotency: amount }; },
        onStatCalculation(amount) { if (positivePerk(amount))
            addPotency(this, "bleedpotency", amount); },
        support: { "status": "Partial", "details": "Offers innate Bleed potency equal to perk amount for guard-breaking attacks and adds the separate additive Bleed potency point per perk from the Bleed Potency source card. Select the separate Wound debuff to add the user-authorized placeholder 0.1 True output to Bleed; this is not a verified game coefficient. Wound stun remains uncalculated; application and duration are manual." }
    },
    sharp_crits: {
        id: "sharp_crits",
        name: "Sharp Crits",
        category: "Perk",
        description: "Physical boost contributes to your crit chance along with making crits ignore some resistances.",
        critical: { "chancePerBoost": { "PhysicalBoost": 0.00075 }, "armorPenPerPerk": 20 },
        "source": {
            "cardId": "69214b9731723704c1eda3a8",
            "cardUrl": "https://trello.com/c/B2vQ7N6J"
        },
    },
    sharpshooter: {
        id: "sharpshooter",
        name: "Sharpshooter",
        category: "Perk",
        description: "Increase damage dealt when hitting opponents from range.",
        "source": {
            "cardId": "69214b9831723704c1edaea0",
            "cardUrl": "https://trello.com/c/joVhTK4K"
        },
        onDmgBonusMultiplier(amount, args) { return positivePerk(amount) && selected(this, "sharpshooter_range") && isProcHit(args) ? 0.2 * amount : null; },
        support: { "status": "Partial", "details": "Select Sharpshooter Range for 20% damage per perk on proc-capable direct packets. No numeric range is invented from the source image. Range detection and projectile travel are manual." }
    },
    shattering_justice: {
        id: "shattering_justice",
        name: "Shattering Justice",
        category: "Perk",
        description: "Guardbreaking opponents applies a defense debuff and grants heavily increased stun.",
        sourcepotencies: {
            shatterpotency: 0.2,
        },
        "source": {
            "cardId": "69214b9731723704c1eda38e",
            "cardUrl": "https://trello.com/c/kvuHFbVy"
        },
    },
    sickly_sweetness: {
        id: "sickly_sweetness",
        name: "Sickly Sweetness",
        category: "Perk",
        description: "Getting hit has a chance to apply sticky to the opponent. Additionally you take less dmg from opponents with sticky.",
        "source": {
            "cardId": "69214b9731723704c1eda488",
            "cardUrl": "https://trello.com/c/LTM2Zzkq"
        },
    },
    sickness: {
        id: "sickness",
        name: "Sickness",
        category: "Perk",
        description: "You have a chance to sneeze randomly dealing hex damage, earth damage and applying sticky that additionally increases hex damage taken by 20% infront of your character.",
        "source": {
            "cardId": "69214b9731723704c1edaaf2",
            "cardUrl": "https://trello.com/c/FamRjoPX"
        },
        statusEffects: ["sticky_sickness_variant"],
        support: { "status": "Partial", "details": "Keep one normal Sticky debuff selected and add Sticky: Sickness Variant on the recipient. That neutral qualifier adds the documented +20% Hex vulnerability; normal Sticky retains its existing +20% pure Magic vulnerability. It does not create/count a second Sticky. Sneeze base damage, application, random timing, and the 0.75 Hex/Earth scaling without a base are held." }
    },
    siphoning_rot: {
        getMechanicsPreview(amount) { const poison = this.target?.deBuffs?.find(status => status.id === "poison" && status.getSourceBuild(this.target) === this); return [row("Healing per enemy Poison tick before modifiers", poison ? amount : 0), row("Eligibility", poison ? "Your Poison on selected opponent; use an enemy, not a teammate" : "Needs your Poison on selected opponent")]; },
        support: { "status": "Partial", "details": "Displays one HP healed per perk for each selected enemy Poison tick actually owned by the applying build, including fractional perk amounts. Self Poison does not qualify. Target must represent an enemy, not a teammate. Other healing modifiers, tick timing, spreading, and automatic HP updates are not invented." },
        id: "siphoning_rot",
        name: "Siphoning Rot",
        category: "Perk",
        description: "Heal when others take damage from your poison. Grants poison potency.",
        "source": {
            "cardId": "69214b9731723704c1eda374",
            "cardUrl": "https://trello.com/c/I07xodii"
        },
    },
    slayer_rage: {
        getSourcePotencies(amount, applicant) { const ticks = Math.min(20, Math.max(0, Math.floor(applicant?.buff?.find(status => status.id === "slayer_rage_ticks")?.stacks || 0))), rune = applicant?.mainArmor.rune; if (rune?.id === "rage_rune")
            return { ragepotency: (rune.sourcepotencies?.ragepotency || 0) + .01 * amount * ticks, weakeningpotency: .2 }; if (rune?.id === "weakening_roar_rune")
            return { ragepotency: .2, weakeningpotency: (rune.sourcepotencies?.weakeningpotency || 0) + .005 * amount * ticks }; return {}; },
        getMechanicsPreview(amount) { const ticks = Math.min(20, Math.max(0, Math.floor(this.buff?.find(status => status.id === "slayer_rage_ticks")?.stacks || 0))); return [row("Selected channel ticks", ticks), row("Rage-rune potency added", .01 * amount * ticks), row("Weakening-roar potency added", .005 * amount * ticks), row("Status source", "Select Slayer Rage on Rage / Weakness after setting ticks; source is an application snapshot")]; },
        support: { "status": "Partial", "details": "Selectable Slayer Rage sources combine the equipped Rage/Weakening Roar Rune's base innate potency with 0.01p / 0.005p per selected channel tick, capped at 20 ticks. Rage Rune also offers fixed 0.2 Weakness; Weakening Roar offers fixed 0.2 Rage. Re-select to snapshot a new tick count. Every-second-hit Weakness application, damage base, self HP drain, and channel timeline remain held." },
        id: "slayer_rage",
        name: "Slayer Rage",
        category: "Perk",
        description: "You can now hold down rage rune or weakening roar rune to drain HP, and deal hex damage around yourself additionally gain ramping rage potency or ramping weaken potency depending on which rune is equipped.",
        "source": {
            "cardId": "69214b9831723704c1edaef2",
            "cardUrl": "https://trello.com/c/3VKML2lH"
        },
    },
    slow_leak: {
        // Same +0.1-per-perk stored potency convention used for Blood Thirsty.
        onStatCalculation(amount) { if (positivePerk(amount))
            addPotency(this, "bleedpotency", amount); },
        getMechanicsPreview(amount) { return [row("Bleed duration vs enemy mobs", 1 + .5 * amount, "x"), row("Condition", "Select Enemy Mob on the Bleed recipient; players do not qualify")]; },
        support: { "status": "Partial", "details": "Adds one stored Bleed potency point (+0.1 displayed) per perk, following the user's Blood Thirsty potency convention; Trello names the bonus without an amount. Increases applicant-owned Bleed duration by 50% per perk only on a recipient explicitly selected as Enemy Mob. Players and self-Bleed do not qualify for the duration bonus; duration is a preview." },
        id: "slow_leak",
        name: "Slow Leak",
        category: "Perk",
        description: "Bleed lasts much longer. Grants bleed potency.",
        "source": {
            "cardId": "69214b9731723704c1eda4a2",
            "cardUrl": "https://trello.com/c/WUx9x3Bq"
        },
    },
    smoldering: {
        id: "smoldering",
        name: "Smoldering",
        category: "Perk",
        description: "When you use your weapon art light on fire. While on fire gain bonus damage.",
        onDmgBonusMultiplier(amount) {
            return positivePerk(amount) && hasDebuff(this, "burn") ? 0.2 * amount : null;
        },
        support: { "status": "Partial", "details": "Selected self Burn grants 20% damage per perk. Weapon Art self-application, duration, and unspecified innate Burn potency are manual." },
        "source": {
            "cardId": "69214b9731723704c1eda498",
            "cardUrl": "https://trello.com/c/GY9cpb7j"
        }
    },
    snoeman_spirit: {
        id: "snoeman_spirit",
        name: "Snoeman Spirit",
        category: "Perk",
        description: "Upon reaching max stacks of spiritual energy right clicking creates an empowered massive icestorm around yourself.",
        "source": {
            "cardId": "69214b9831723704c1edaca2",
            "cardUrl": "https://trello.com/c/9DpcrFKP"
        },
    },
    solar_light: {
        id: "solar_light",
        name: "Solar Light",
        category: "Perk",
        description: "Converts Lesser Heal into a strong holdable beam of light from the sun. The strength of the beam increases if you are in sunlight. It targets the ally closest to your mouse aside summons.",
        "source": {
            "cardId": "69214b9831723704c1edaed8",
            "cardUrl": "https://trello.com/c/uE3mmdYz"
        },
    },
    spell_piercer: {
        id: "spell_piercer",
        name: "Spell Piercer",
        category: "Perk",
        description: "Upon Critting with a Weapon Art or Rune, deal bonus Damage and ignore 100% of the enemy's Defenses.",
        critical: { "sources": ["Rune", "WeaponArt"], "bypassArmor": true, "hitDamagePerPerk": 0.2 },
        "source": {
            "cardId": "69214b9731723704c1eda464",
            "cardUrl": "https://trello.com/c/4MmcGPD8"
        },
    },
    spell_slinger: {
        id: "spell_slinger",
        name: "Spell Slinger",
        category: "Perk",
        description: "Magic boost contributes to your crit chance.",
        critical: { chancePerBoost: { MagicBoost: 0.00075 }, damagePerBoost: { MagicBoost: 0.00075 } },
        "source": {
            "cardId": "69214b9731723704c1eda474",
            "cardUrl": "https://trello.com/c/d6RG18Fa"
        },
    },
    spirit_commune: {
        previewInputs: ["baseSpiritGain"],
        getMechanicsPreview(amount) {
            const base = input(this, "baseSpiritGain"), speed = (this.stats.AttackSpeed || 0) / 100;
            const gain = base === undefined ? undefined : speed >= 0 ? base / (1 + speed) : base * (1 - speed);
            return [row("Fist M1 charge before weapon-speed adjustment", gain), row("RMB charge before weapon-speed adjustment", gain === undefined ? undefined : 2 * gain), row("Dual Guns M1 charge before weapon-speed adjustment", gain === undefined ? undefined : 1.3 * gain), row("Glove stat multiplier (unverified source note)", 1 + .25 * Math.max(0, amount - 1), "x"), row("Additional associated glove perk (unverified)", Math.max(0, amount - 1))];
        },
        support: { "status": "Partial", "details": "Applies the documented positive/negative Attack Speed stat charge-gain curve to a manually entered base gain; shows doubled RMB and 1.3x Dual Guns M1 gains. Missing weapon base-speed adjustment and spirit-specific rates remain held. Source calls glove-stat/perk scaling probable, so those formulas are labelled previews rather than silently changing equipped stats." },
        id: "spirit_commune",
        name: "Spirit Commune",
        category: "Perk",
        description: "Attacking gains stacks of spiritual energy and upon reaching max stacks gain the ability to use your gloves spiritual ability.",
        "source": {
            "cardId": "69214b9731723704c1eda49a",
            "cardUrl": "https://trello.com/c/XZ1bQmyb"
        },
    },
    spirit_winds: {
        id: "spirit_winds",
        name: "Spirit Winds",
        category: "Perk",
        description: "During tailwind convert a portion of wind damage to magic damage and boost damage based on the strength of the tailwind.",
        outputPriority: -100,
        onDmgBonusMultiplier(amount) {
            return positivePerk(amount) && hasBuff(this, "tailwind") ? 0.2 / 3 * (5 * selectedBuffPotency(this, "tailwind") + 2 * amount) : null;
        },
        onOutputCalculation(amount) {
            if (!positivePerk(amount) || !hasBuff(this, "tailwind"))
                return;
            const converted = Math.max(0, this.damageTypes.Air || 0) * Math.min(1, 0.1 * amount);
            addOutput(this, "Air", -converted);
            addOutput(this, "Magic", converted);
        },
        support: { "status": "Partial", "details": "Selected Tailwind grants the separate (0.2/3)*(5*effective Tailwind potency + 2*perk amount) damage fraction and converts up to 100% of Air output to Magic at 10% per perk. Conversion runs after additive outputs and Dark Magic; cross-perk conversion order is an explicit builder convention." },
        "source": {
            "cardId": "69214b9731723704c1eda37c",
            "cardUrl": "https://trello.com/c/Cs2JybzB"
        }
    },
    splinter: {
        id: "splinter",
        name: "Splinter",
        category: "Perk",
        description: "Crits apply bleed and have increased stun. Grants bleed potency.",
        "source": {
            "cardId": "69214b9731723704c1eda4a4",
            "cardUrl": "https://trello.com/c/nCZV51YK"
        },
        onStatCalculation(amount) { if (positivePerk(amount))
            addPotency(this, "bleedpotency", amount); },
        support: { "status": "Partial", "details": "Adds the verified additive Bleed potency point per perk. Crit-triggered Bleed innate potency and stun bonus are unspecified; apply a separately established Bleed source manually." }
    },
    spore_burst: {
        id: "spore_burst",
        name: "Spore Burst",
        category: "Perk",
        description: "Using a finisher poisons yourself and deals a burst of poison around youself, additionally you take much less poison damage. Grants poison potency.",
        "source": {
            "cardId": "69214b9731723704c1eda4c0",
            "cardUrl": "https://trello.com/c/LT3dMrYa"
        },
        sourcepotencies: { poisonpotency: 1 },
        onStatCalculation(amount) { if (positivePerk(amount))
            addPotency(this, "poisonpotency", amount); },
        support: { "status": "Partial", "details": "Offers the fixed 1 innate potency self-Poison source and adds one separate additive Poison potency point per perk from the Poison Potency source card. Select Poison with Applied by Self. Burst damage and the amount of Poison resistance are unspecified; neither is guessed." }
    },
    spore_trooper: {
        previewInputs: ["storedCount"],
        getMechanicsPreview(amount) { const n = input(this, "storedCount"), cap = Math.floor(2 + amount); return [row("Stored Sporeling cap", cap), row("Sporelings selected", n === undefined ? undefined : Math.min(cap, Math.floor(n))), row("Approximate time per stored Sporeling", 5, "s"), row("Sporeling size", amount >= 2 ? "Big" : "Normal")]; },
        support: { "status": "Partial", "details": "Shows 2 + perk amount stored capacity (whole-count floor convention), clamps an entered stored count, and displays approximately 5s per stored Sporeling and Big prefix at two perks. No automatic timer, summon damage/stat table, or Echo Blast chain." },
        id: "spore_trooper",
        name: "Spore Trooper",
        category: "Perk",
        description: "Over time gain the Stored Sporelings Status which you can throw out using your RMB. The Sporelings grow in size the more of this perk you have.",
        "source": {
            "cardId": "69214b9731723704c1eda4be",
            "cardUrl": "https://trello.com/c/hGUuvJ4u"
        },
    },
    spring_powered: {
        id: "spring_powered",
        name: "Spring Powered",
        category: "Perk",
        description: "Grants increased damage based on your jump boost. Additionally using your roll gives you bounce.",
        onDmgBonusMultiplier(amount) {
            return positivePerk(amount) ? 0.005 * (this.stats.JumpBoost || 0) * amount : null;
        },
        getSourcePotencies(amount) { return { bouncepotency: 0.1 * amount }; },
        support: { "status": "Partial", "details": "Adds 0.5% damage per Jump Boost per perk and offers a 0.1 * perk amount Bounce source. Roll activation and duration are manual." },
        "source": {
            "cardId": "69214b9831723704c1edaedc",
            "cardUrl": "https://trello.com/c/4uEh794y"
        }
    },
    spring_step: {
        id: "spring_step",
        name: "Spring Step",
        category: "Perk",
        description: "Increases jump height after using a weapon art.",
        getSourcePotencies(amount) { return { bouncepotency: amount / 5 }; },
        support: { "status": "Partial", "details": "Offers perk amount / 5 Bounce potency for manual selection after a Weapon Art. Automatic cast activation and duration are not simulated." },
        "source": {
            "cardId": "69214b9731723704c1eda36e",
            "cardUrl": "https://trello.com/c/wpTVMn3G"
        }
    },
    springblast: {
        id: "springblast",
        name: "Springblast",
        category: "Perk",
        description: "Bounce makes your finishers cause an explosion. Blocking hits has a chance to grant bounce.",
        "source": {
            "cardId": "69214b9731723704c1edaa0a",
            "cardUrl": "https://trello.com/c/DqfOAy87"
        },
        getSourcePotencies(amount) { return { bouncepotency: amount / 10 }; },
        support: { "status": "Partial", "details": "Offers perk amount / 10 Bounce potency after a blocking proc. Its shared Bounce status can be selected manually. Explosion base damage beyond one perk is untested; finisher-hit counts, proc rolls, and duration are not simulated." }
    },
    standoff: {
        id: "standoff",
        name: "Standoff",
        category: "Perk",
        description: "Whilst standing still, gain Regeneration on hit and a Damage Boost that scales off of the aforementioned Regeneration.",
        sourcepotencies: {
            regenpotency: 0.2,
        },
        "source": {
            "cardId": "69214b9831723704c1edade6",
            "cardUrl": "https://trello.com/c/3pNDKl4K"
        },
    },
    star_barrage: {
        id: "star_barrage",
        name: "Star Barrage",
        category: "Perk",
        description: "Using a weapon art increases your attack speed for a short period of time",
        statPriority: -10,
        onStatCalculation(amount) {
            if (positivePerk(amount) && hasBuff(this, "star_barrage"))
                addStat(this, "AttackSpeed", 20 + 25 * amount);
        },
        support: { "status": "Partial", "details": "Select Star Barrage to add 20 + 25 * perk amount Attack Speed percentage points. Uses the equipped perk for a self-buff preview; activation, duration, and transferred buffs are manual." },
        "source": {
            "cardId": "69214b9731723704c1eda3ec",
            "cardUrl": "https://trello.com/c/xrX4I7k4"
        }
    },
    star_friendship: {
        id: "star_friendship",
        name: "Star Friendship",
        category: "Perk",
        description: "When you heal an ally grant them weapon art cooldown reduction.",
        "source": {
            "cardId": "69214b9731723704c1eda400",
            "cardUrl": "https://trello.com/c/Ln0JZU0u"
        },
        getSourcePotencies(amount) { return { friendshippotency: amount / 10 }; },
        support: { "status": "Partial", "details": "Offers Friendship at perk amount / 10 potency. Its shared buff adds 50% diminishing-return Weapon Art CDR per 0.1 effective potency, using the applicant and final overrides. The explicit coefficient/formula takes precedence over the inconsistent 0.3-potency example on the card. Healing triggers and removal after the next cast are manual." }
    },
    star_struck: {
        id: "star_struck",
        name: "Star Struck",
        category: "Perk",
        description: "LMB's and RMB's that lands has a very high chance to shoot a star of varying Damage Types and Scalings at the enemy. Has a lowered Proc Coefficient.",
        "source": {
            "cardId": "69214b9731723704c1eda472",
            "cardUrl": "https://trello.com/c/y4pCb8ES"
        },
    },
    static_buildup: {
        previewInputs: ["preOutputHitDamage", "storedCount"],
        getMechanicsPreview(amount) {
            const hit = input(this, "preOutputHitDamage"), n = input(this, "storedCount"), charge = n === undefined ? undefined : Math.min(20, Math.floor(n));
            const strikes = charge === undefined ? undefined : amount === 1 && charge === 3 || amount === 2 && charge === 3 ? 1 : amount === 1 && charge === 20 ? 3 : amount === 2 && charge === 10 ? 2 : amount === 2 && charge === 20 ? 5 : undefined;
            return [row("Lightning damage before its own modifiers", hit === undefined ? undefined : 3 + .15 * hit), row("Charges selected", charge), row("Maximum charges", 20), row("Strikes at selected tested breakpoint", strikes === undefined ? "Unknown for this charge / perk combination" : strikes)];
        },
        support: { "status": "Partial", "details": "Calculates 3 + 15% of entered noncritical RMB damage before post-output modifiers per lightning strike. Clamps charge to 20 and shows only the documented 1/2-perk charge breakpoints; no interpolation for the explicitly unknown strike-count formula. Scaling, output, and automatic charge buildup are held." },
        id: "static_buildup",
        name: "Static Buildup",
        category: "Perk",
        description: "On hit build up charge on your weapon then when you use a RMB you strike them with lightning that and the amount released scales with the charge.",
        "source": {
            "cardId": "69214b9731723704c1eda450",
            "cardUrl": "https://trello.com/c/yZYvzNU4"
        },
    },
    stealth: {
        id: "stealth",
        name: "Stealth",
        category: "Perk",
        description: "Lower NPC detection range, gain a chance not to swap aggro, and hitting opponents that aren't targeting you increase your damage.",
        "source": {
            "cardId": "69214b9731723704c1eda350",
            "cardUrl": "https://trello.com/c/0bVkfnHv"
        },
        onDmgBonusMultiplier(amount) { return positivePerk(amount) && selected(this, "stealth_advantage") ? 0.1 * amount : null; },
        support: { "status": "Partial", "details": "Select Stealth Advantage for an NPC/target dummy or an opponent not targeting you: 10% damage per perk. Detection range and aggro rolls are not simulated." }
    },
    steam_charge: {
        id: "steam_charge",
        name: "Steam Charge",
        category: "Perk",
        description: "Inflicting Burn on either yourself or an enemy ramps up the neutral status ''Steam Buildup''. At max stacks, your RMB is instead replaced with a blast of steam that counts as a Finisher.",
        "source": {
            "cardId": "69214b9831723704c1edaef6",
            "cardUrl": "https://trello.com/c/IK4uFapU"
        },
        weaponPriority: 100,
        modifyWeaponConstruction(amount, data) { if (positivePerk(amount) && selected(this, "steam_buildup_ready")) {
            data.constructionType += " + Steam Charge";
            data.m2 = [[6, 10]];
        } },
        modifyWeaponPackets(amount, packets) { if (positivePerk(amount) && selected(this, "steam_buildup_ready"))
            for (const packet of packets.m2) {
                packet.damageTypes = { Fire: 0.5, Air: 0.5 };
                packet.damageScalings = { Fire: 1, Air: 1 };
                packet.source = "steam_charge";
            } },
        support: { "status": "Partial", "details": "Select Steam Buildup Ready at 8 / perk amount stacks to replace RMB with 10 hits of 6 base, half Fire/Air output, 1 Fire/Air scaling, and M2/Finisher tags. Buildup and consumption are manual. Runs after other reviewed replacements; that combined-perk priority is a builder convention. Construction is resolved after existing stances. Conflicts with other replacement perks use documented builder priority, pending in-game verification; animation, knockback, and automatic applications are not simulated." }
    },
    steam_powered: {
        id: "steam_powered",
        name: "Steam Powered",
        category: "Perk",
        description: "Gain a universal Damage Boost scaling off of your Air Boost, but in turn gain a chance to take minor Fire Damage and set yourself on fire upon dealing any.",
        onDmgBonusMultiplier(amount) {
            return positivePerk(amount) ? (2 / 15) * (this.stats.AirBoost || 0) * amount / 100 : null;
        },
        sourcepotencies: { burnpotency: 1 },
        support: { "status": "Partial", "details": "Applies the separate universal (2/15 * Air Boost * perk amount)% damage bonus. Offers the documented fixed 1-potency self-Burn source. Chance, self-hit damage, and automatic application are not simulated." },
        "source": {
            "cardId": "69214b9731723704c1eda4ae",
            "cardUrl": "https://trello.com/c/xkEv6XS5"
        }
    },
    sticky_guard: {
        id: "sticky_guard",
        name: "Sticky Guard",
        category: "Perk",
        description: "Gain reinforce when hitting a sticky opponent.",
        "source": {
            "cardId": "69214b9731723704c1eda480",
            "cardUrl": "https://trello.com/c/mxB5qpj1"
        },
        getSourcePotencies(amount) { return { reinforcepotency: 0.2 * amount }; },
        support: { "status": "Partial", "details": "Offers 0.2 * perk amount Reinforce after hitting a Sticky opponent. Select Reinforce with this source for its existing shared diminishing-return reduction. Hit application and ten-second expiration are manual." }
    },
    sticky_summons: {
        getMechanicsPreview(amount) { return [row("Summon Magic Defense bonus", 30 * amount, "%"), row("Summon Sticky chance", 25, "%"), row("Recipient", "Summons only; player Magic Defense is unchanged")]; },
        support: { "status": "Partial", "details": "Displays +30% Magic Defense per perk for summons and fixed 25% Sticky proc chance independent of perk count. The player's own Magic Defense is not changed. Without separate summon actors, automatic Sticky application, summon defenses in combat, and innate Sticky potency remain manual." },
        id: "sticky_summons",
        name: "Sticky Summons",
        category: "Perk",
        description: "Your minions have a chance to apply sticky and gives your summons magic defense.",
        "source": {
            "cardId": "69214b9731723704c1eda47e",
            "cardUrl": "https://trello.com/c/RxSlo2Wz"
        },
    },
    sticky_swings: {
        id: "sticky_swings",
        name: "Sticky Swings",
        category: "Perk",
        description: "A chance to apply sticky on hit which increases pure magic damage taken and slows the opponent. Deal additional damage to opponents with sticky. Also makes all slows become sticky instead.",
        onDmgBonusMultiplier(amount) {
            return positivePerk(amount) && hasDebuff(this.target, "sticky") ? 0.15 * amount : null;
        },
        support: { "status": "Partial", "details": "Adds 15% damage per perk against selected Sticky, separately from Sticky's own Magic vulnerability. Random application and Slow conversion are manual." },
        "source": {
            "cardId": "69214b9731723704c1eda47a",
            "cardUrl": "https://trello.com/c/Vau2WfCJ"
        }
    },
    stoneskin: {
        id: "stoneskin",
        name: "Stoneskin",
        category: "Perk",
        description: "Gain high Damage Reduction and become immune to Stun whilst casting a Weapon Art, and for a short duration afterwards.",
        "source": {
            "cardId": "69214b9731723704c1eda43c",
            "cardUrl": "https://trello.com/c/1XTUhwjd"
        },
        onFinalDamageTakenMultiplier(amount) { return positivePerk(amount) && selected(this, "stoneskin_active") ? Math.max(0.2, 1 - 0.3 * amount) : null; },
        support: { "status": "Partial", "details": "Select Stoneskin Active during a Weapon Art or its aftermath for direct damage reduction of 30% per perk, capped at 80%. Stun/knockback immunity and expiration are not simulated." }
    },
    stored_corruption: {
        id: "stored_corruption",
        name: "Stored Corruption",
        category: "Perk",
        description: "Take more damage and increase debuff duration on yourself, but in turn the debuffs you inflict last longer.",
        "source": {
            "cardId": "69214b9731723704c1eda94a",
            "cardUrl": "https://trello.com/c/IpTbECa3"
        },
        onFinalDamageTakenMultiplier(amount) { return positivePerk(amount) ? 1 + 0.05 * amount : null; },
        support: { "status": "Partial", "details": "Incoming damage is multiplied by 1 + 0.05 * perk amount without a cap. Debuff durations and their application timeline are not calculated." }
    },
    storm_caster: {
        previewInputs: ["preOutputHitDamage"],
        modifyWeaponPackets(_amount, packets) { for (const packet of packets.m2)
            packet.procCoefficient = .6; },
        getMechanicsPreview() { const hit = input(this, "preOutputHitDamage"); return [row("Lightning on original target before its own modifiers", hit === undefined ? undefined : .66 * hit), row("Lightning on one chained target before its own modifiers", hit === undefined ? undefined : .33 * hit), row("RMB proc coefficient", .6)]; },
        support: { "status": "Partial", "details": "Applies the documented 0.6 proc coefficient to RMB packets and previews 66%/33% original/chained-target lightning from entered source damage. Replacement weapon damage/scaling, independent chain crits, chain timing, and half-rate finisher procs are held; original combo damage remains labelled by its construction." },
        id: "storm_caster",
        name: "Storm Caster",
        category: "Perk",
        description: "Your LMB's and RMB's are replaced with chain lightning.",
        "source": {
            "cardId": "69214b9731723704c1eda926",
            "cardUrl": "https://trello.com/c/dfvWeth1"
        },
    },
    storm_rend: {
        id: "storm_rend",
        name: "Storm Rend",
        category: "Perk",
        description: "A chance to create chain lightning on hit and apply a debuff that reduces armor and increases stun taken.",
        "source": {
            "cardId": "69214b9731723704c1eda44c",
            "cardUrl": "https://trello.com/c/idtrv53q"
        },
        getSourcePotencies(amount) { return { electricalrendpotency: amount / 10 }; },
        support: { "status": "Partial", "details": "Offers Electrical Rend at perk amount / 10 potency: its shared debuff grants 10 penetration per 0.1 potency, separate from Shatter. The chain lightning's base damage, proc chance progression, stun, and special resistance to perk modifiers remain unverified/manual." }
    },
    stormcaller: {
        id: "stormcaller",
        name: "Stormcaller",
        category: "Perk",
        description: "Rare chance to strike enemies with lightning on hit.",
        "source": {
            "cardId": "69214b9731723704c1eda3c0",
            "cardUrl": "https://trello.com/c/GFZMcUhT"
        },
        damageScalings: { "Air": 1, "Magic": 1 }, damageTypes: { "Air": 0.5, "Magic": 0.5 },
        getPerkDamageInfo(amount) { if (!positivePerk(amount))
            return null; return activation("stormcaller", 24); },
        support: { "status": "Partial", "details": "One lightning strike deals fixed 24 base damage with Air/Magic scaling and half Air/Magic output. Does not multiply by its fixed 2.5% chance or recursively trigger itself. Separate activation preview; trigger rolls, cooldowns, area/target counts, and recursive procs are not simulated. Unspecified proc coefficients and crit eligibility use the existing direct-packet defaults." }
    },
    stratos_winds: {
        id: "stratos_winds",
        name: "Stratos Winds",
        category: "Perk",
        description: "Your LMB's and RMB's are replaced with Tornadoes.",
        "source": {
            "cardId": "69214b9731723704c1eda920",
            "cardUrl": "https://trello.com/c/IlUN0PxJ"
        },
    },
    sunburn: {
        id: "sunburn",
        name: "Sunburn",
        category: "Perk",
        description: "Holy damage can inflict burning and deal extra damage to burning opponents and additional if you hit them with holy damage. Grants burn potency.",
        onDmgBonusMultiplier(perkAmount) {
            if (!perkAmount || perkAmount <= 0 || !hasDebuff(this.target, "burn"))
                return null;
            // Holy anywhere in this packet upgrades the bonus for every output component.
            return ((this.damageTypes.Holy || 0) > 0 ? 0.15 : 0.1) * perkAmount;
        },
        support: { "status": "Partial", "details": "Damage bonus against a Burning target, including DoTs. A Holy component upgrades the whole packet bonus. Burn application is not simulated." },
        "source": {
            "cardId": "69214b9731723704c1eda3fa",
            "cardUrl": "https://trello.com/c/Su7Wd4pK"
        },
    },
    swarm: {
        getMechanicsPreview(amount) { return [row("Summon cap without Trusty Servant", 15 + amount), row("Spawn count multiplier", 2, "x"), row("Summon HP / damage at exactly one perk", amount === 1 ? "0.5x / 0.5x" : "Only the one-perk penalty (0.5x each) is documented"), row("Trusty Servant interaction", this.perks.trusty_servant > 0 ? "Cap conflict unresolved; no combined cap asserted" : "No conflicting cap")]; },
        support: { "status": "Partial", "details": "Displays default summon cap 15 plus one per perk, with a fixed doubled spawn count that does not keep increasing with extra perks. Shows halved summon HP/damage only at the documented one-perk case. Fractional cap rounding, higher-stack penalties, and cap precedence with Trusty Servant are unresolved and explicitly held; player HP/damage is unchanged." },
        id: "swarm",
        name: "Swarm",
        category: "Perk",
        description: "Increase your summon cap and summoning skills summon an additional minion but your minions are weaker",
        "source": {
            "cardId": "69214b9731723704c1eda384",
            "cardUrl": "https://trello.com/c/vE2nFmKE"
        },
    },
    sweet_tooth: {
        id: "sweet_tooth",
        name: "Sweet Tooth",
        category: "Perk",
        description: "Your minions have a chance to apply sticky and hits against enemy with sticky consumes it on hit dealing bonus damage and restoring a small precentage of the summons HP.",
        "source": {
            "cardId": "69214b9831723704c1edae3c",
            "cardUrl": "https://trello.com/c/fmSbuMuu"
        },
    },
    swift_guard: {
        id: "swift_guard",
        name: "Swift Guard",
        category: "Perk",
        description: "Gain Reinforce when you Dodge an Attack. Additionally, increases your Physical Defense scaling off of your Dexterity Boost.",
        statPriority: 40,
        onStatCalculation(amount) {
            if (positivePerk(amount))
                addStat(this, "PhysicalDefense", 0.1 * (this.stats.DexterityBoost || 0) * amount);
        },
        getSourcePotencies(amount) { return { reinforcepotency: 0.2 * amount }; },
        support: { "status": "Partial", "details": "Adds 10% of Dexterity Boost per perk to Physical Defense after redistribution and Quick Witted. Select its 0.2 * perk amount Reinforce source after a successful dodge; automatic dodges are not simulated." },
        "source": {
            "cardId": "69214b9731723704c1eda368",
            "cardUrl": "https://trello.com/c/IM6fJaTL"
        }
    },
    tailwind: {
        id: "tailwind",
        name: "Tailwind",
        category: "Perk",
        description: "Using your Weapon Art grants Tailwind. Tailwind multiplies movespeed.",
        "source": {
            "cardId": "69214b9731723704c1eda364",
            "cardUrl": "https://trello.com/c/GEos2u2J"
        },
        getSourcePotencies(amount) { return { tailwindpotency: 0.1 * amount }; },
        support: { "status": "Partial", "details": "Offers 0.1 Tailwind potency per perk and adds a fixed 0.1 to all Tailwind applied by this build, including its own source. Final manual overrides bypass additive source bonuses. Weapon Art application, duration, and movement are manual." }
    },
    tectonic_heat: {
        id: "tectonic_heat",
        name: "Tectonic Heat",
        category: "Perk",
        description: "Gain a chance on hit to spout a magma ball out of the enemy. Guaranteed on a Guardbreaking Attack.",
        "source": {
            "cardId": "69214b9731723704c1eda408",
            "cardUrl": "https://trello.com/c/BWDgvozQ"
        },
        damageScalings: { "Fire": 1, "Earth": 1 }, damageTypes: { "Fire": 0.5, "Earth": 0.5 },
        getPerkDamageInfo(amount) { if (!positivePerk(amount))
            return null; return activation("tectonic_heat", 2.5 + 2.5 * amount, "Perk"); },
        support: { "status": "Partial", "details": "One magma ball, 2.5 + 2.5 * perk amount base, 1 Fire/Earth scaling. Equal Fire/Earth output is an inference because the split is unstated. No Burn or guardbreak is added. Independent activation preview; trigger rolls, timing, area/target counts, and automatic proc chains are not simulated." }
    },
    thief_training: {
        id: "thief_training",
        name: "Thief Training",
        category: "Perk",
        description: "Damage dealt whilst standing behind an enemy will always Crit and gain an additional Damage Boost, but Crits deal less damage than usual when below 3 of this perk. If an attack would've Crit regardless, gain yet another Damage Boost. Additionally half your roll cooldown and increase the distance it covers.",
        "source": {
            "cardId": "69214b9731723704c1eda3ac",
            "cardUrl": "https://trello.com/c/Xx0CiDui"
        },
    },
    thorns: {
        id: "thorns",
        name: "Thorns",
        category: "Perk",
        description: "Gain a chance to deal light Damage and inflict Bleed against said enemy when hit. Grants Bleed potency.",
        "source": {
            "cardId": "69214b9731723704c1eda352",
            "cardUrl": "https://trello.com/c/cscyrY4S"
        },
        damageScalings: { "Dexterity": 1 }, damageTypes: { "Physical": 1 },
        getPerkDamageInfo(amount) { if (!positivePerk(amount))
            return null; return activation("thorns", amount, "Perk"); },
        onStatCalculation(amount) { if (positivePerk(amount))
            addPotency(this, "bleedpotency", amount); },
        support: { "status": "Partial", "details": "One retaliation hit, perk amount base and 1 Dexterity scaling. Physical output is inferred because the card leaves output unstated. Adds one additive Bleed potency point per perk from the primary potency-stat card; innate Bleed application is not guessed. Independent activation preview; trigger rolls, timing, area/target counts, and automatic proc chains are not simulated." }
    },
    toadzerker_spirit: {
        id: "toadzerker_spirit",
        name: "Toadzerker Spirit",
        category: "Perk",
        description: "Release your Spiritual Energy with an RMB, which conjurers a Spiritual Toadzerker that leaps into the air before slamming down in a large AoE.",
        sourcepotencies: { bouncepotency: 0.2, ragepotency: 0.2 },
        support: { "status": "Partial", "details": "Offers fixed 0.2 Bounce and Rage sources after spirit activation. The summon/slam damage, spiritual energy, and duration are not simulated." },
        "source": {
            "cardId": "69214b9831723704c1edac8c",
            "cardUrl": "https://trello.com/c/JUK2ys4d"
        }
    },
    torpedo_barrage: {
        getMechanicsPreview(amount) { return [row("Base damage per torpedo", 1.5 + .4 * amount), row("Approximate proc coefficient", .65), row("Output", "Physical / Water; split and scaling coefficients undocumented"), row("Condition", "Store from non-Rune / non-Weapon-Art hits; release on Rune / Weapon Art hit")]; },
        support: { "status": "Partial", "details": "Calculates 1.5 + 0.4 per perk base damage per torpedo and shows approximate 0.65 proc coefficient. Missing Physical/Water split, scaling and stored-count curve prevent a final damage packet. Storage and release are manual." },
        id: "torpedo_barrage",
        name: "Torpedo Barrage",
        category: "Perk",
        description: "Gain torpedos when hitting an opponent. Upon hitting an opponent with a weapon art or rune unleash the torpedos at them dealing physical/water damage.",
        "source": {
            "cardId": "69214b9831723704c1edacdc",
            "cardUrl": "https://trello.com/c/H2IlmKc7"
        },
    },
    toxin_caster: {
        id: "toxin_caster",
        name: "Toxin Caster",
        category: "Perk",
        description: "Magic Damage from Weapon Arts or Runes Poisons the enemy. Additionally, Weapon Arts and Runes gains a Damage Boost scaling off of your Poison potency.",
        onDmgBonusMultiplier(amount, args) {
            if (!positivePerk(amount) || !isRuneOrWeaponArtHit(args) || (this.damageTypes.Magic || 0) <= 0)
                return null;
            return 0.05 * (this.potencies.poisonpotency || 0) * amount;
        },
        support: { "status": "Partial", "details": "Rune/Weapon Art packets containing pure Magic gain 5% damage per additive Poison Potency point per perk, boosting the whole packet. Target Poison is not required. Poison application and unspecified innate potency remain manual." },
        "source": {
            "cardId": "69214b9731723704c1eda34c",
            "cardUrl": "https://trello.com/c/RuchhWoQ"
        }
    },
    toxin_transfer: {
        id: "toxin_transfer",
        name: "Toxin Transfer",
        category: "Perk",
        description: "Hitting someone when poisoned does bonus hex damage and poisons them. Grants poison potency.",
        outputPriority: 100,
        onOutputCalculation(amount, args) {
            if (positivePerk(amount) && hasDebuff(this, "poison") && isProcHit(args))
                addOutput(this, "Hex", 0.05 * amount);
        },
        support: { "status": "Partial", "details": "Proc-capable direct hits while self-Poisoned gain 0.05 Hex output per perk and do not consume your Poison. Applying target Poison before Curse Rip remains manual; no unknown innate potency is invented." },
        "source": {
            "cardId": "69214b9731723704c1eda4a6",
            "cardUrl": "https://trello.com/c/KqD6pP2y"
        }
    },
    trickster: {
        previewInputs: ["reflectedPotency"],
        getMechanicsPreview(amount) { const potency = input(this, "reflectedPotency"); return [row("Reflection base chance", chance(75 * amount), "%"), row("Reflected potency", potency === undefined ? undefined : potency + amount / 10 * (1 + potency)), row("Eligibility", "Also supports reflecting self-inflicted debuffs back onto self; apply the result manually")]; },
        support: { "status": "Partial", "details": "Previews reflected potency original + (p/10)*(1+original), with 75% base proc chance per perk bounded to 100%. Original is the base potency specified by the card; no automatic re-application, reflection chain, or assumed debuff eligibility. Supports manually testing self-reflection. Missing extra global potency grants are not invented." },
        id: "trickster",
        name: "Trickster",
        category: "Perk",
        description: "A high chance to reflect debuffs at an increased intensity. Grants poison, burn, and bleed potency.",
        "source": {
            "cardId": "69214b9731723704c1eda3e8",
            "cardUrl": "https://trello.com/c/VSmkSK2H"
        },
    },
    trophy_hunter: {
        id: "trophy_hunter",
        name: "Trophy Hunter",
        category: "Perk",
        description: "Removes equipment from enemy drops, making it easier to obtain crafting materials.",
        "source": {
            "cardId": "69214b9731723704c1eda366",
            "cardUrl": "https://trello.com/c/FOAsqfty"
        },
    },
    true_balance: {
        id: "true_balance",
        name: "True Balance",
        category: "Perk",
        description: "Your Hex and Holy Boosts are averaged out and increased by 66%. All healing now has additional Hex Scaling, and all Damage has additional Holy Scaling. Additionally, applying a Debuff grants you a corresponding Buff at a low duration and potency.",
        statPriority: 70,
        onStatCalculation(amount) {
            if (!positivePerk(amount))
                return;
            const value = roundPerkValue(((this.stats.HexBoost || 0) + (this.stats.HolyBoost || 0)) / 2 * 1.66);
            this.stats.HexBoost = value;
            this.stats.HolyBoost = value;
        },
        onDmgBonusMultiplier(amount) {
            return positivePerk(amount) ? 3 / 25 * amount * (this.stats.HolyBoost || 0) / 100 : null;
        },
        getSourcePotencies(amount) {
            return { ragepotency: 0.1 * amount, regenpotency: 0.1 * amount, reinforcepotency: 0.1 * amount, tailwindpotency: 0.1 * amount };
        },
        support: { "status": "Partial", "details": "Averages Hex/Holy Boost and increases both by the card's fixed 66%, then grants (3/25 * perk amount * Holy Boost)% separate damage. Offers manual Rage/Regen/Reinforce/Tailwind sources. Healing, Inspired, automatic debuff-to-buff mapping, and unverified cross-conversion order are outside this calculation." },
        "source": {
            "cardId": "69214b9731723704c1eda4b4",
            "cardUrl": "https://trello.com/c/vpNISefp"
        }
    },
    true_moon: {
        id: "true_moon",
        name: "True Moon",
        category: "Perk",
        description: "Converts a portion of your magic damage to true damage. Additionall you have a chance to create a tiny magical moon to crash into your opponent.",
        "source": {
            "cardId": "69214b9831723704c1edad0e",
            "cardUrl": "https://trello.com/c/EPjAtlTP"
        },
        outputPriority: -200,
        onOutputCalculation(amount, args) {
            if (!positivePerk(amount) || args?.baseDamageData?.sourceType !== "Weapon")
                return;
            const converted = Math.max(0, this.damageTypes.Magic || 0) * Math.min(1, 0.3 * amount);
            addOutput(this, "Magic", -converted);
            addOutput(this, "True", converted);
        },
        damageScalings: { Magic: 1 }, damageTypes: { Magic: 1 },
        getPerkDamageInfo(amount) { return positivePerk(amount) ? activation("true_moon", 2.5 * amount) : null; },
        support: { "status": "Partial", "details": "Converts up to 100% of a weapon packet's Magic output to True at 30% per perk; Rune/Weapon Art and status packets are unaffected. Conversion runs after additive outputs and Spirit Winds as a builder convention. Also previews one moon at 2.5 * perk amount base and 1 Magic scaling; Magic output is inferred, and its unspecified reduced proc coefficient/chance are not simulated." }
    },
    trusty_servant: {
        previewInputs: ["summonBaseHP"],
        getMechanicsPreview(amount) { const hp = input(this, "summonBaseHP"); return [row("Summon cap", this.perks.swarm > 0 ? "Conflict with Swarm unresolved" : 1), row("Summon HP at exactly one perk", amount === 1 ? hp === undefined ? undefined : hp * 3 : "Higher-stack HP multiplier unspecified"), row("Decay", "Disabled"), row("Damage / Tenacity", "Increases, but numeric coefficients missing")]; },
        support: { "status": "Partial", "details": "Displays one summon cap, no decay, and tripled entered natural summon HP at exactly one perk. Higher-stack HP/damage/Tenacity coefficients and interactions with other summon HP modifiers are not invented. Swarm cap precedence is flagged instead of silently choosing a cap. No player stats or live summon simulation are altered." },
        id: "trusty_servant",
        name: "Trusty Servant",
        category: "Perk",
        description: "Summons do not decay, summons become stronger, summons gain triple hp, and increased tenacity, but you can only have one summon at a time. Having 2 or more of this perk makes your summons larger.",
        "source": {
            "cardId": "69214b9731723704c1eda430",
            "cardUrl": "https://trello.com/c/XCnDwmTB"
        },
    },
    undying_rot: {
        onStatCalculation(amount) { if (positivePerk(amount))
            addPotency(this, "poisonpotency", amount); },
        getMechanicsPreview(amount) { return [row("Stored Poison potency contributed", .1 * amount), row("Poison remains a debuff", "Yes"), row("Healing / defense", "Poison-potency dependent; coefficients undocumented")]; },
        support: { "status": "Partial", "details": "Adds +0.1 stored Poison potency per perk using the user grant convention. Poison stays a debuff and continues its ordinary damage. Healing and defense amounts are undocumented, so no guessed immunity, defense, or regeneration is applied." },
        id: "undying_rot",
        name: "Undying Rot",
        category: "Perk",
        description: "Heal and gain defense while Poisoned. Grants Poison Potency.",
        "source": {
            "cardId": "69214b9731723704c1eda36a",
            "cardUrl": "https://trello.com/c/NdFZIRLt"
        },
    },
    unmoving: {
        id: "unmoving",
        name: "Unmoving",
        category: "Perk",
        description: "Attackers take Stun and Poise Damage based off of your Tenacity. Additionally, constantly inflict yourself with Slow.",
        "source": {
            "cardId": "69214b9831723704c1edaefe",
            "cardUrl": "https://trello.com/c/Z0kLf1bS"
        },
        sourcepotencies: { slowpotency: 0.3 },
        support: { "status": "Partial", "details": "Offers manual self Slow at 0.3 potency. All received Slow is forced to 0.3 while this perk is equipped, including a manual override. Movement slowing, continuous reapplication, reflected stun/poise damage, and duration are not calculated." }
    },
    untethered: {
        id: "untethered",
        name: "Untethered",
        category: "Perk",
        description: "Reduce all movement speed penalties when using weapon arts or attacking.",
        "source": {
            "cardId": "69214b9831723704c1edae6e",
            "cardUrl": "https://trello.com/c/5ertQIfb"
        },
    },
    valor: {
        id: "valor",
        name: "Valor",
        category: "Perk",
        description: "Gain a shield if you are using a one handed weapon which further reduces damage taken when blocking. Additionally weapon arts taunt enemies. Hitting taunted enemies causes you to deal bonus damage.",
        onDmgBonusMultiplier(amount) {
            return positivePerk(amount) && hasDebuff(this.target, "taunt") ? 0.0666 * amount : null;
        },
        support: { "status": "Partial", "details": "Selected target Taunt grants 6.66% damage per perk. Weapon Art Taunt application and the one-handed shield/blocking behavior are not simulated." },
        "source": {
            "cardId": "69214b9731723704c1eda95e",
            "cardUrl": "https://trello.com/c/WbuVXjxJ"
        }
    },
    vampire: {
        id: "vampire",
        name: "Vampire",
        category: "Perk",
        description: "Gain bonus Damage and Defense in the shadows but lose them and deal even less in sunlight. Additionally, lose the ability to heal in inns and receive less healing overall, but gain the ability to heal on Kill and Posture Breaking.",
        onDmgBonusMultiplier(amount) {
            const light = lighting(this);
            return positivePerk(amount) && light ? 0.0666 * amount * (light === "sunlight" ? 0.5 : 1) : null;
        },
        onDmgReducedMultiplier(amount) {
            return positivePerk(amount) && lighting(this) === "shadow" ? 0.0333 * amount : null;
        },
        support: { "status": "Partial", "details": "In Shadows grants 6.66% damage and 3.33% diminishing-return reduction per perk. In Sunlight halves that damage bonus and removes reduction. Unknown lighting grants neither. Healing penalties, kill healing, and inn restrictions are not simulated." },
        "source": {
            "cardId": "69214b9731723704c1eda3e0",
            "cardUrl": "https://trello.com/c/O7ET7Qs9"
        }
    },
    vapor_aegis: {
        id: "vapor_aegis",
        name: "Vapor Aegis",
        category: "Perk",
        description: "Having reinforce makes you take 90% less water and fire damage. Increases reinforce duration.",
        onFinalDamageTakenMultiplier(perkAmount, args) {
            if (!perkAmount || perkAmount <= 0 || !hasBuff(this, "reinforce"))
                return null;
            return args?.outputType === "Water" || args?.outputType === "Fire" ? 0.1 : null;
        },
        support: { "status": "Partial", "details": "Selected Reinforce grants a direct 90% Fire/Water reduction, including DoTs. Duration changes are not simulated." },
        "source": {
            "cardId": "69214b9731723704c1eda3ee",
            "cardUrl": "https://trello.com/c/5gx8lj0F"
        },
    },
    vassals_croak: {
        id: "vassals_croak",
        name: "Vassals Croak",
        category: "Perk",
        description: "Gain a Damage Boost scaling on the amount of active minions. When your minions die, gain a stack of the neutral status ''Last Croak''. ''Last Croak'' grants Rage to you on consumption.",
        sourcepotencies: {
            ragepotency: 0.1,
        },
        "source": {
            "cardId": "69214b9831723704c1edaf24",
            "cardUrl": "https://trello.com/c/908nOpYl"
        },
    },
    venom_eater: {
        id: "venom_eater",
        name: "Venom Eater",
        category: "Perk",
        description: "If you hit a poisoned opponent that was poisoned by you remove the poison, crit, deal bonus damage, and heal slightly. But reduces crit damage at low amounts. Grants poison potency.",
        // One stored potency point (+0.1 displayed) per perk, per the user's game value.
        onStatCalculation(amount) { if (positivePerk(amount))
            addPotency(this, "poisonpotency", amount); },
        onDmgBonusMultiplier(perkAmount) {
            return perkAmount && perkAmount > 0 && this.activeProcs?.includes("venom_eater") ? 0.1 * perkAmount : null;
        },
        onCritRateCalculation() {
            return this.activeProcs?.includes("venom_eater") ? 1 : null;
        },
        onCritDamageCalculation(perkAmount) {
            // Replace the ordinary +50% base with +20%, then add +10% per perk.
            return perkAmount && perkAmount > 0 ? -0.3 + 0.1 * perkAmount : null;
        },
        support: { "status": "Partial", "details": "Adds one stored Poison potency point (+0.1 displayed) per perk using the user's game value; Trello names the bonus without an amount. Base crit damage is 1.2x + 0.1x per perk. Select Venom Eater Proc with attacker-owned Poison for guaranteed crit and 10% damage per perk. Poison ordering is a manual preview choice; healing and automatic triggers are not calculated." },
        "source": {
            "cardId": "69214b9731723704c1eda3f8",
            "cardUrl": "https://trello.com/c/jwcQQv1k"
        },
    },
    venom_spitter: {
        id: "venom_spitter",
        name: "Venom Spitter",
        category: "Perk",
        description: "Deal more damage to poisoned opponents additionally your finishers shoot out a blast of poisonous venom.",
        onDmgBonusMultiplier(amount) {
            return positivePerk(amount) && hasDebuff(this.target, "poison") ? 0.1 * amount : null;
        },
        getSourcePotencies(amount) { return { poisonpotency: 0.1 * amount }; },
        support: { "status": "Partial", "details": "Adds 10% damage per perk against selected Poison and offers 0.1 innate Poison potency per perk. Finisher projectiles, hit decay, and automatic application are not simulated." },
        "source": {
            "cardId": "69214b9731723704c1eda476",
            "cardUrl": "https://trello.com/c/4yuZf0wL"
        }
    },
    vile_presence: {
        id: "vile_presence",
        name: "Vile Presence",
        category: "Perk",
        description: "Passively deal Hex Damage to nearby enemies.",
        "source": {
            "cardId": "69214b9731723704c1eda3ae",
            "cardUrl": "https://trello.com/c/619cSwkY"
        },
        damageScalings: { Hex: 1 }, damageTypes: { Hex: 1 },
        getPerkDamageInfo(amount) { return positivePerk(amount) ? activation("vile_presence", 1.2 * amount, "Perk", 0) : null; },
        support: { "status": "Partial", "details": "One aura tick deals 1.2 * perk amount base Hex damage with 1 Hex scaling. Explicitly not a DoT and cannot proc effects. Tick frequency, range, target counts, and crit eligibility remain unverified/manual." }
    },
    virulent_core: {
        id: "virulent_core",
        name: "Virulent Core",
        category: "Perk",
        description: "Your LMB’s and RMB’s are replaced with poisonous blasts. Grants poison potency.",
        "source": {
            "cardId": "69214b9831723704c1edad24",
            "cardUrl": "https://trello.com/c/UATBZ9I5"
        },
        onStatCalculation(amount) { if (positivePerk(amount))
            addPotency(this, "poisonpotency", amount); },
        support: { "status": "Partial", "details": "Adds the verified additive Poison potency point per perk. Poisonous-blast weapon bases, scaling/output, and source potency are missing, so its weapon replacement remains held." }
    },
    vital_mist: {
        id: "vital_mist",
        name: "Vital Mist",
        category: "Perk",
        description: "All lifesteal is absorbed to build up a healing aura. When your vital mist charge is above 50 gain increased aoe, grant tailwind on heal, and double the consumtion of the meter. Blocking also doubles the consumtion.",
        "source": {
            "cardId": "69214b9831723704c1edacb6",
            "cardUrl": "https://trello.com/c/bgEf9hA0"
        },
        getSourcePotencies(amount) { return { tailwindpotency: 0.15 + amount / 10 }; },
        support: { "status": "Partial", "details": "Offers 0.15 + perk amount / 10 Tailwind potency for the above-50-meter on-heal state. Select Tailwind with this source. Lifesteal absorption, meter buildup/consumption, healing, radius, and duration are manual." }
    },
    void_contract: {
        id: "void_contract",
        name: "Void Contract",
        category: "Perk",
        description: "Occasionally mark a random enemy nearby, which expires after a short period or a couple of hits. Can only be consumed by the applicant, but counts as a Debuff for others.",
        "source": {
            "cardId": "69214b9831723704c1edac64",
            "cardUrl": "https://trello.com/c/qKhzP8SE"
        },
        getSourcePotencies(amount) { return { voidcontractpotency: amount / 10 }; },
        support: { "status": "Partial", "details": "Offers Void Contract at perk amount / 10 potency. Its shared target debuff increases direct damage by 30% per source perk only for its applicant, and does not affect DoTs. Mark application, remaining-hit limit, expiration, and removal after consumption are manual; a multi-hit preview assumes the mark stays active." }
    },
    void_root_spirit: {
        id: "void_root_spirit",
        name: "Void Root Spirit",
        category: "Perk",
        description: "Upon reaching max stacks of spiritual energy right clicking conjures a void root to release a barrage of bites that debuff.",
        "source": {
            "cardId": "69214b9831723704c1edaca0",
            "cardUrl": "https://trello.com/c/UzlKlKyS"
        },
    },
    volatile_shell: {
        damageTypes: { Hex: 1 }, damageScalings: { Hex: 1, Protection: .1 },
        getPerkDamageInfo(amount) { return positivePerk(amount) ? activation("volatile_shell", 25 + 20 * amount) : null; },
        getMechanicsPreview(amount) { return [row("Protection damage absorption", amount === 1 ? "85% at one perk; other amounts unverified" : "Only the one-perk value (85%) is documented"), row("Explosion Poison duration", "approximately 5s; potency missing")]; },
        support: { "status": "Partial", "details": "Separate shield-break explosion uses 25+20p base damage, 1 Hex output, 1 Hex and 0.1 Protection scaling. Protection scaling reads the flat Protection stat. Does not automatically deplete a shield or apply Poison; Poison potency and shield absorption stacking beyond the documented 85% at one perk are held. No cooldown is invented." },
        id: "volatile_shell",
        name: "Volatile Shell",
        category: "Perk",
        description: "Upon your shield breaking retaliate in a large poison explosion the damage scales on Hex Boost and Protection. Additionally shield now absorbs a larger percentage of damage taken.",
        "source": {
            "cardId": "69214b9831723704c1edaecc",
            "cardUrl": "https://trello.com/c/ebkshx2s"
        },
    },
    warden_of_many: {
        id: "warden_of_many",
        name: "Warden Of Many",
        category: "Perk",
        description: "Gaining reinforce gives your summons autoblock.",
        "source": {
            "cardId": "69214b9831723704c1edad02",
            "cardUrl": "https://trello.com/c/CgzFjR9b"
        },
    },
    warding_tides: {
        id: "warding_tides",
        name: "Warding Tides",
        category: "Perk",
        description: "Using an ability that can cleanse debuffs applies reinforce when used.",
        getSourcePotencies(amount) { return { reinforcepotency: 0.2 * amount }; },
        support: { "status": "Partial", "details": "Offers a 0.2 * perk amount Reinforce source for manual selection after a cleansing ability. Automatic ability detection/application is not simulated." },
        "source": {
            "cardId": "69214b9731723704c1eda396",
            "cardUrl": "https://trello.com/c/k5KWGJHo"
        }
    },
    wave_rider: {
        cooldown: { sources: ["WeaponArt"], ratePerPerk: .5, requiredBuff: "wave_rider_ready" },
        getMechanicsPreview(amount) { return [row("Normal Gathering Tide gain", Math.round(3 + 2 * amount), "per second"), row("After cleanse · first tick", Math.round(3 + 8 * amount)), row("After cleanse · next three ticks", Math.round(3 + 6 * amount)), row("After cleanse · fifth tick", Math.round(3 + 4 * amount)), row("Empowered M2 / WA base damage", "40 / 35; output split not stated, full damage held"), ...healRows(this, "Empowered M2 healing", 8, { Water: 1 }), ...healRows(this, "Empowered WA healing", 7, { Water: 1 }), row("Empowered WA", "Select Wave Rider Ready only for the next empowered WA; remove after use")]; },
        support: { "status": "Partial", "details": "Displays rounded Gathering Tide gains 3+2p per second, with only the 2p portion multiplied by 4/3/2 over five post-cleanse ticks. At selected Wave Rider Ready, the next empowered WA gains 50% diminishing CDR per perk. Shows base damage 40/35 and Water-scaled healing 8/7; missing damage output split and self-hit interaction stay held. Readiness consumption and charge timeline are manual." },
        id: "wave_rider",
        name: "Wave Rider",
        category: "Perk",
        description: "Gain the \"Wave Rider\" status, which passively stacks up to 100. Healing allies with a cleansing heal accelerates stack gain. At maximum stacks, you can consume them to either perform a powerful M2 Wave Attack, or unleash a large burst of healing and damage when using a Weapon Art, also reducing its cooldown.",
        "source": {
            "cardId": "69214b9731723704c1eda40a",
            "cardUrl": "https://trello.com/c/6YH8N4NP"
        },
    },
    weakening: {
        id: "weakening",
        name: "Weakening",
        category: "Perk",
        description: "Small chance to apply weakness on hit.",
        getSourcePotencies(amount) { return { weakeningpotency: amount / 5 }; },
        support: { "status": "Partial", "details": "Offers perk amount / 5 innate Weakness potency. The selected status uses the shared 1/(1+potency) damage formula. Chance rolls and hit application are manual." },
        "source": {
            "cardId": "69214b9731723704c1eda356",
            "cardUrl": "https://trello.com/c/eh8FjtrX"
        }
    },
    weighty_slam: {
        id: "weighty_slam",
        name: "Weighty Slam",
        category: "Perk",
        description: "Changes the slam weapon art into a meaty slam",
        "source": {
            "cardId": "69214b9731723704c1eda37e",
            "cardUrl": "https://trello.com/c/iT7KR1Gh"
        },
    },
    whirl_foot: {
        id: "whirl_foot",
        name: "Whirl Foot",
        category: "Perk",
        description: "Increases your Speed Boost scaling off your Air Boost. Additionally gain dodge chance based on your movement speed and when dodging gain tailwind.",
        statPriority: 50,
        onStatCalculation(amount) {
            if (positivePerk(amount))
                addStat(this, "SpeedBoost", 0.05 * (this.stats.AirBoost || 0) * amount);
        },
        getSourcePotencies(amount) { return { tailwindpotency: amount / 10 }; },
        support: { "status": "Partial", "details": "Adds 5% of Air Boost per perk to Speed Boost. Offers perk amount / 10 Tailwind as a manually selected post-dodge source; dodge chance and automatic application are not simulated." },
        "source": {
            "cardId": "69214b9831723704c1edae96",
            "cardUrl": "https://trello.com/c/bvtL5MFR"
        }
    },
    whirlwind: {
        id: "whirlwind",
        name: "Whirlwind",
        category: "Perk",
        description: "Tailwind gets converted to whirlwind which gives jump boost, speed boost, lowers weapon art and rune cooldown, and has a longer duration. Additionally using a weapon art or a rune causes a aoe wind blade to be released that applies bleed.",
        sourcepotencies: {
            bleedpotency: 1,
        },
        "source": {
            "cardId": "69214b9731723704c1eda43e",
            "cardUrl": "https://trello.com/c/CpAFyjQu"
        },
    },
    wild_bolt: {
        modifyWeaponArtPacket(_amount, packet) {
            if (packet.source !== "laser")
                return;
            const types = ["Fire", "Water", "Holy", "Hex", "Earth", "Air"].filter(id => selected(this, "wild_bolt_" + id.toLowerCase()));
            if (types.length === 1)
                packet.damageTypes = { [types[0]]: 1 };
        },
        getMechanicsPreview() { return [row("Laser output", "Select exactly one Wild Bolt element in Buffs; ambiguous selection leaves Laser unchanged"), row("Random debuff", "Use the appropriate target debuff; no random roll or source potency inferred")]; },
        support: { "status": "Partial", "details": "Changes selected Laser output to exactly one manually selected Fire/Water/Holy/Hex/Earth/Air element, retaining base damage and scaling. Multiple or no element selectors leave Laser unchanged. Random selection, debuff application/potency, size, and range are manual." },
        id: "wild_bolt",
        name: "Wild Bolt",
        category: "Perk",
        description: "Modifies the laser weapon art to become a random damage type, enhances the attributes, and makes laser apply random debuffs.",
        "source": {
            "cardId": "69214b9831723704c1edacf4",
            "cardUrl": "https://trello.com/c/JWUmlhsi"
        },
    },
    wind_drill: {
        id: "wind_drill",
        name: "Wind Drill",
        category: "Perk",
        description: "Replaces your roll with a air dash that deals damage.",
        "source": {
            "cardId": "69214b9831723704c1edae92",
            "cardUrl": "https://trello.com/c/uRZXu2rt"
        },
    },
    wind_walker: {
        id: "wind_walker",
        name: "Wind Walker",
        category: "Perk",
        description: "While under the effects of Tailwind, your Weapon Arts deal increased Knockback and gains Armor Penetration. Additionally, Tailwind lasts longer.",
        outputPriority: 100,
        onOutputCalculation(amount, args) {
            if (positivePerk(amount) && hasBuff(this, "tailwind") && args?.baseDamageData?.sourceType === "WeaponArt")
                addOutput(this, "Air", 0.15 * amount);
        },
        onArmorPenCalculation(amount, args) {
            return positivePerk(amount) && hasBuff(this, "tailwind") && args?.baseDamageData?.sourceType === "WeaponArt" ? 10 * amount : null;
        },
        support: { "status": "Partial", "details": "With selected Tailwind, Weapon Arts gain 0.15 Air output and 10 penetration per perk, regardless of Tailwind potency. Knockback and Tailwind duration are not simulated." },
        "source": {
            "cardId": "69214b9731723704c1eda46c",
            "cardUrl": "https://trello.com/c/2VtmfMab"
        }
    },
    winter_woof_spirit: {
        id: "winter_woof_spirit",
        name: "Winter Woof Spirit",
        category: "Perk",
        description: "Upon reaching max stacks of spiritual energy right clicking unleashes your winter woof spirits to fight alongside you.",
        "source": {
            "cardId": "69214b9831723704c1edac8a",
            "cardUrl": "https://trello.com/c/JrCM1W6l"
        },
        sourcepotencies: { shatterpotency: 0.2 },
        support: { "status": "Partial", "details": "Offers the initial roar's fixed 0.2 innate Shatter source, including fractional perk amounts. Use the shared target Shatter debuff. Spirit attacks' bases, scaling coefficients, Bleed source potency, summoning, and ten-second mark duration are not established/manual." }
    },
    woof_spirit: {
        id: "woof_spirit",
        name: "Woof Spirit",
        category: "Perk",
        description: "Release your Spiritual Energy as a large howl on RMB., which inflicts Weaken.",
        sourcepotencies: { weakeningpotency: 0.5 },
        support: { "status": "Partial", "details": "Offers fixed 0.5 Weakness potency after the spirit howl. The howl attack, healing, spiritual energy, and duration are not simulated." },
        "source": {
            "cardId": "69214b9831723704c1edac84",
            "cardUrl": "https://trello.com/c/0AykNlOE"
        }
    },
    wrathful_crits: {
        id: "wrathful_crits",
        name: "Wrathful Crits",
        category: "Perk",
        description: "When you Crit, gain Rage for a brief duration.",
        getSourcePotencies(amount) { return { ragepotency: 0.1 * amount }; },
        support: { "status": "Partial", "details": "Offers a 0.1 * perk amount Rage source after a crit. Select Rage manually; automatic critical-hit activation and duration are not simulated." },
        "source": {
            "cardId": "69214b9731723704c1eda382",
            "cardUrl": "https://trello.com/c/WPLSJfQR"
        }
    },
    ascended_enchant_perks: {
        id: "ascended_enchant_perks",
        name: "Ascended Enchant Perks",
        category: "Perk",
        description: "Ascended Enchant Perks",
        "source": {
            "cardId": "69214b9731723704c1edaa7e",
            "cardUrl": "https://trello.com/c/BVpWuaTL"
        },
    },
    armor_penetration: {
        id: "armor_penetration",
        name: "Armor Penetration",
        category: "Perk",
        description: "Gain armor penetration.",
        "source": {
            "cardId": "69214b9731723704c1edaa80",
            "cardUrl": "https://trello.com/c/JnqZ3ih2"
        },
    },
    contained: {
        getMechanicsPreview(amount) { return [row("Buff / debuff duration factor", 1 + .33 * amount, "x")]; },
        support: { "status": "Partial", "details": "Increases selected source-applied buff and debuff duration previews by 33% per perk. This applicant-side interpretation and multiplicative stacking with other duration perks are builder conventions pending source clarification. Reference durations are editable; no expiration timeline is simulated." },
        id: "contained",
        name: "Contained",
        category: "Perk",
        description: "Both debuff and buff duration are increased.",
        "source": {
            "cardId": "69214b9731723704c1edaa9a",
            "cardUrl": "https://trello.com/c/rEz99ZWw"
        },
    },
    ferocity: {
        id: "ferocity",
        name: "Ferocity",
        category: "Perk",
        description: "Tenacity increases damage dealt.",
        "source": {
            "cardId": "69214b9731723704c1edaa8e",
            "cardUrl": "https://trello.com/c/mQcZDH0s"
        },
        onDmgBonusMultiplier(amount) { return positivePerk(amount) ? 0.155 * amount * diminishedTenacity(this.stats.Tenacity || 0) : null; },
        support: { "status": "Partial", "details": "Adds 15.5% damage per perk per diminished Tenacity, using whole harmonic units plus the fractional remainder divided by the next unit. Zero and integer Tenacity remain finite; negative Tenacity contributes zero because its behavior is undocumented." }
    },
    frenzy: {
        id: "frenzy",
        name: "Frenzy",
        category: "Perk",
        description: "Rage grants a Movement Speed and Universal Damage Multiplier, but reduces healing recieved and also multiplies Damage taken.",
        "source": {
            "cardId": "69214b9731723704c1edaaa6",
            "cardUrl": "https://trello.com/c/XdrbSgVW"
        },
        onDmgBonusMultiplier(amount) { return positivePerk(amount) && hasBuff(this, "rage") ? amount * (5 + 100 / 6 * selectedBuffPotency(this, "rage")) / 100 : null; },
        onFinalDamageTakenMultiplier(amount) { return positivePerk(amount) && hasBuff(this, "rage") ? 1.3 : null; },
        support: { "status": "Partial", "details": "Selected Rage grants the separate universal damage multiplier 1 + perk amount * (5 + 100/6 * effective Rage potency)/100 and a fixed 1.3 incoming multiplier. Does not create another buff. Summon transfer, movement, healing penalties, and duration are not calculated." }
    },
    hex_shield: {
        id: "hex_shield",
        name: "Hex Shield",
        category: "Perk",
        description: "Gain a stack of neutral Hex Shield. Hex Shield nullifies the next Debuff you receive, granting a heal and a Damage Boost afterwards for a short duration.",
        "source": {
            "cardId": "69214b9731723704c1edaa96",
            "cardUrl": "https://trello.com/c/xqCMsx9X"
        },
        getSourcePotencies(amount) { return { convertedenergypotency: amount / 10 }; },
        support: { "status": "Partial", "details": "Offers Converted Energy at perk amount / 10 potency after Hex Shield activates. Its shared real buff grants 10% damage per 0.1 effective potency and works for recipients without the perk. Shield charge buildup, debuff blocking, consumption, healing, and duration are manual." }
    },
    magic_surge: {
        previewInputs: ["failedResets"],
        getMechanicsPreview(amount) { const failures = Math.floor(input(this, "failedResets") ?? 0); const rate = chance(5 + 10 * amount); return [row("Initial reset chance", rate, "%"), row("Reset chance after selected failures", chance(rate + 10 * failures), "%"), row("Extra casts ignoring failure ramp", rate >= 100 ? "Unbounded at 100%" : rate / (100 - rate)), row("Lucky", "No effect on this reset chance")]; },
        support: { "status": "Partial", "details": "Displays Weapon Art reset chance 5+10p percent, plus 10 percentage points per explicitly entered consecutive failure, bounded to 100%. Shows chance/(1-chance) additional casts only for the initial chance, explicitly ignoring failure ramp. Lucky does not modify this. Does not replace base cooldown with expected cooldown or simulate reset history." },
        id: "magic_surge",
        name: "Magic Surge",
        category: "Perk",
        description: "You have a chance to reset your Weapon Art cooldown on Weapon Art usage.",
        "source": {
            "cardId": "69214b9731723704c1edaaac",
            "cardUrl": "https://trello.com/c/4IWzZwHn"
        },
    },
    minion_absorption: {
        id: "minion_absorption",
        name: "Minion Absorption",
        category: "Perk",
        description: "Summons are instantly consumed if you are not buffed by this passive, you are healed and buffed based on the strength of the summon.",
        "source": {
            "cardId": "69214b9731723704c1edaa8a",
            "cardUrl": "https://trello.com/c/LjisLTST"
        },
        getSourcePotencies(amount, applicant) { return { minionabsorbedpotency: Math.max(0, 0.002 * (applicant?.stats.SummonBoost || 0) * amount) }; },
        support: { "status": "Partial", "details": "Offers Minion Absorbed with damage fraction 0.002 * applicant Summon Boost * perk amount, captured on application. Its shared buff grants that damage bonus to the recipient. Cursed and Perk Effectiveness do not modify this perk. Unknown summon-strength healing/duration and consumption are manual; negative computed bonus floors at zero." }
    },
    rainstorm: {
        getMechanicsPreview(amount) { return [row("Chance per eligible hit", chance(10 * amount), "%"), row("Size", 4 * amount, "studs"), row("Water scaling", 2), row("Damage / healing", "Base values and per-enemy cooldown are undocumented")]; },
        support: { "status": "Partial", "details": "Calculates 10% proc chance and four-stud size per perk with the documented 2 Water scaling shown. Base damage/healing and cooldown are unavailable, so neither final damage nor healing is guessed." },
        id: "rainstorm",
        name: "Rainstorm",
        category: "Perk",
        description: "Hitting opponents has a chance to create a raindrop that heals and damages opponents.",
        "source": {
            "cardId": "69214b9731723704c1edaab4",
            "cardUrl": "https://trello.com/c/NezR4CnE"
        },
    },
    stone_weapon: {
        id: "stone_weapon",
        name: "Stone Weapon",
        category: "Perk",
        description: "Grants a hefty amount of Earth Damage Type on your Weapon, but reduces Attack Speed accordingly.",
        "source": {
            "cardId": "69214b9731723704c1edaaaa",
            "cardUrl": "https://trello.com/c/whDhtayi"
        },
        outputPriority: 100,
        onOutputCalculation(amount, args) { if (positivePerk(amount) && args?.baseDamageData?.sourceType === "Weapon")
            addOutput(this, "Earth", 0.3 * amount); },
        support: { "status": "Partial", "details": "Weapon packets gain 0.3 Earth output per perk. Rune/Weapon Art inheritance from weapon output and the card's explicitly probable attack-speed penalty are not calculated." }
    },
    tempest: {
        id: "tempest",
        name: "Tempest",
        category: "Perk",
        description: "Launch a tornado on finishers.",
        "source": {
            "cardId": "69214b9731723704c1edaaa8",
            "cardUrl": "https://trello.com/c/2K6SqVTl"
        },
        damageScalings: { "Air": 1 }, damageTypes: { "Air": 1 },
        getPerkDamageInfo(amount) { if (!positivePerk(amount))
            return null; const number = finisherProcNumber(this); return activation("tempest", (0.8 + 0.2667 * amount) * 0.75 ** (number - 1), "Perk", 0.3); },
        support: { "status": "Partial", "details": "One tornado at Finisher Proc Number (default 1), (0.8 + 0.2667 * perk amount) * 0.75^(number - 1) base and Air scaling/output. Base proc coefficient 0.3; weapon-coefficient inheritance, alternating eligible hits, and sequence reset are manual. Independent activation preview; trigger rolls, timing, area/target counts, and automatic proc chains are not simulated." }
    },
    turtle: {
        getMechanicsPreview(amount) { return [row("Passive block chance", chance(20 * amount), "%"), row("Block behavior", "Can be guardbroken; select actual block-related state manually")]; },
        support: { "status": "Partial", "details": "Displays passive block chance at 20% per perk, bounded to 100%, including fractional perk amounts. Does not pretend every hit is blocked or invent chip damage, block effectiveness, or guardbreak rules. Actual blocking and block-trigger activations remain selected snapshots." },
        id: "turtle",
        name: "Turtle",
        category: "Perk",
        description: "Passive chance to block any hit.",
        "source": {
            "cardId": "69214b9731723704c1edaa68",
            "cardUrl": "https://trello.com/c/B3X1Z4ZC"
        },
    },
    undead_might: {
        id: "undead_might",
        name: "Undead Might",
        category: "Perk",
        description: "Weapon arts and runes gain bonus damage but you take self damage when hitting an opponent with a rune or weapon art.",
        onDmgBonusMultiplier(amount, args) {
            return positivePerk(amount) && isRuneOrWeaponArtHit(args) ? 0.25 * amount : null;
        },
        support: { "status": "Partial", "details": "Rune and Weapon Art packets gain 25% damage per perk. Self-damage and multi-enemy self-damage reduction are not simulated." },
        "source": {
            "cardId": "69214b9731723704c1edaab0",
            "cardUrl": "https://trello.com/c/DiNCzYsD"
        }
    },
    wall: {
        id: "wall",
        name: "Wall",
        category: "Perk",
        description: "While blocking give nearby allies a buff that redirects some of the damage they take to you",
        "source": {
            "cardId": "69214b9731723704c1edaab2",
            "cardUrl": "https://trello.com/c/hIribjZ3"
        },
        getSourcePotencies(amount) { return { redirectpotency: amount / 10 }; },
        support: { "status": "Partial", "details": "Offers Redirect at 0.1 potency per perk. Its shared buff multiplies recipient incoming damage by max(0, 1 - effective game potency), except Explosive Charge self-damage. Redirected damage to the applicant, ally proximity, application, and expiration are not calculated. The exception checks both the explosion packet source and actual self-damage identity." }
    },
    wildfire: {
        id: "wildfire",
        name: "Wildfire",
        category: "Perk",
        description: "DoTs deals its damage in an AoE.",
        "source": {
            "cardId": "69214b9731723704c1edaa98",
            "cardUrl": "https://trello.com/c/3rup1PEy"
        },
    },
    "scalar": {
        "id": "scalar",
        "name": "Scalar",
        "description": "Referenced by equipment; no dedicated perk rules were found in this board export.",
        "source": {
            "cardId": "69214b9831723704c1edadaa",
            "cardUrl": "https://trello.com/c/ADgIZfWw"
        }
    },
    "life_steal": {
        "id": "life_steal",
        "name": "Life Steal",
        "description": "Referenced by equipment; no dedicated perk rules were found in this board export.",
        "source": {
            "cardId": "69214b9731723704c1eda7b4",
            "cardUrl": "https://trello.com/c/poMjwa3R"
        }
    },
};
