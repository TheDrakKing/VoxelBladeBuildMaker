function hasDebuff(build, debuffId) {
    return !!build?.deBuffs?.find((debuff) => debuff?.id === debuffId);
}
function getDebuffCount(build) {
    return new Set((build?.deBuffs || []).filter(Boolean).map((status) => status.id).filter(Boolean)).size;
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
    build.stats[statId] = Math.trunc((previousValue + amount) * 100) / 100;
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
    const ignoredIds = new Set(ignore.map(normalizePotencyId));
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
export const Perks = {
    /** Race Perks Here */
    human: {
        id: "human",
        name: "Human",
        category: "Race",
        description: "Gain 20% damage reduction and damage boost when below 50% HP..",
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
    },
    half_ork: {
        id: "half_ork",
        name: "Half-Ork",
        category: "",
        description: "Gain 10 armor penetration on all attacks.",
    },
    elf: {
        id: "elf",
        name: "Elf",
        category: "",
        description: "Gain 25% lower Weapon Art cooldown.",
    },
    dark_elf: {
        id: "dark_elf",
        name: "Dark Elf",
        category: "",
        description: "An 8% chance to apply a random debuff to the opponent when hitting them.",
    },
    dragon: {
        id: "dragon",
        name: "Dragon",
        category: "",
        description: "Gain 50% Warding and 10 Protection alongside 100% Heat and Cold Resistance.",
    },
    ork: {
        id: "ork",
        name: "Ork",
        category: "",
        description: "Weapon arts gain 10 armor penetration. +0.2 Tenacity and for each active buff you gain an additional +0.1 tenacity.",
    },
    high_elf: {
        id: "high_elf",
        name: "High Elf",
        category: "",
        description: "Gain 25% lower Weapon Art cooldown.",
    },
    arborian: {
        id: "arborian",
        name: "Arborian",
        category: "",
        description: "The Arborians are druidic in nature. They are trees made of tough bark and use their power to protect all life.",
    },
    kitsune: {
        id: "kitsune",
        name: "Kitsune",
        category: "",
        description: "The Kitsune are a nomadic race travelling alone or in packs rarely staying in one place to long. They posess incredible speed and reflex and are not often caught by surprise",
    },
    bunikin: {
        id: "bunikin",
        name: "Bunikin",
        category: "",
        description: "The mysterious bunikin are being of mystical whimsy and are rarely seen anywhere in the world.",
    },
    /** Guild only Perks here */
    /** Other Perks */
    ferocious: {
        id: "ferocious",
        name: "Ferocious",
        category: "",
        description: "Tenacity increases damage dealt.",
        onDmgBonusMultiplier(perkAmount) {
            if (!perkAmount)
                return null;
            let t = this.stats.Tenacity;
            if (!t)
                return null;
            let floorT = Math.floor(t);
            let summation = function () {
                let sum = 0;
                for (let k = 1; k <= t; k++) {
                    sum += 1 / k;
                }
                return sum;
            };
            let diminishedTenacity = summation() + (t - Math.floor(t)) / Math.ceil(t);
            let FerocityDmgBoost = diminishedTenacity * 1.55 * (perkAmount / 10);
            return Math.trunc(FerocityDmgBoost * 100) / 100;
        },
    },
    cursed: {
        id: "cursed",
        name: "Cursed",
        category: "Perk",
        description: "All perk potency is increased. You also gain the ability to absorb binded corruptions by destroying them in your inventory.",
        onPerkMod(perkAmount) {
            if (!perkAmount)
                return;
            const ignore = ["cursed", "perk_effectiveness"];
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
            const ignore = ["cursed", "perk_effectiveness"];
            mutatePerkAmounts(this, perkAmount, ignore);
            mutatePotencyAmounts(this, perkAmount, ignore);
        },
        "source": {
            "cardId": "69214b9731723704c1edaaa4",
            "cardUrl": "https://trello.com/c/SezUllD8"
        },
    },
    potion_chugger: {
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
        "source": {
            "cardId": "69214b9731723704c1edac12",
            "cardUrl": "https://trello.com/c/iEoLKdcK"
        },
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
    },
    blood_thirsty: {
        id: "blood_thirsty",
        name: "Blood Thirsty",
        category: "Perk",
        description: "If you hit a bleeding opponent bleeding by you remove the bleed, deal bonus damage, and heal. Grants bleed potency.",
        onDmgBonusMultiplier(perkAmount) {
            if (!perkAmount || !hasDebuff(this.target, "bleed"))
                return null;
            return Math.trunc((0.2 * perkAmount) * 100) / 100;
        },
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
        "source": {
            "cardId": "69214b9831723704c1edadc2",
            "cardUrl": "https://trello.com/c/HwIUTqNd"
        },
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
        "source": {
            "cardId": "69214b9731723704c1eda35a",
            "cardUrl": "https://trello.com/c/pKAeIvmZ"
        },
    },
    echo_incineration: {
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
        onDmgBonusMultiplier(perkAmount, args) {
            if (!perkAmount || !isRuneOrWeaponArtHit(args))
                return null;
            return Math.trunc((0.2 * perkAmount) * 100) / 100;
        },
        onArmorPenCalculation(perkAmount, args) {
            if (!perkAmount || !isRuneOrWeaponArtHit(args))
                return null;
            return 10 * perkAmount;
        },
        "source": {
            "cardId": "69214b9731723704c1eda454",
            "cardUrl": "https://trello.com/c/pSwngnkL"
        },
    },
    hemorrhage: {
        id: "hemorrhage",
        name: "Hemorrhage",
        category: "Perk",
        description: "Hitting a Bleeding opponent adds bonus Damage, Stun, and a small amount of True Damage Type. Grants Bleed potency.",
        onDmgBonusMultiplier(perkAmount) {
            if (!perkAmount || !hasDebuff(this.target, "bleed"))
                return null;
            const multiplier = (10 + 10 * perkAmount) / 100;
            return Math.trunc(multiplier * 100) / 100;
        },
        onOutputCalculation(perkAmount) {
            if (!perkAmount || !hasDebuff(this.target, "bleed"))
                return null;
            const outputMultiplier = 0.1 * perkAmount;
            let previousValue = this.damageTypes["True"];
            this.damageTypes["True"] = previousValue
                ? previousValue + outputMultiplier
                : outputMultiplier;
            return null;
        },
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
            this.stats.Warding = Math.trunc(((this.stats.Warding || 0) * multiplier) * 100) / 100;
            this.stats.Protection = Math.trunc(((this.stats.Protection || 0) * multiplier) * 100) / 100;
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
        onDmgBonusMultiplier(perkAmount) {
            if (!perkAmount)
                return null;
            const selfDebuffs = getDebuffCount(this);
            if (!selfDebuffs)
                return null;
            return Math.trunc((0.0666 * selfDebuffs * perkAmount) * 10000) / 10000;
        },
        "source": {
            "cardId": "69214b9731723704c1edaa86",
            "cardUrl": "https://trello.com/c/QDz1amvn"
        },
    },
    brawny: {
        id: "brawny",
        name: "Brawny",
        category: "Perk",
        description: "Converts a portion of all positive boosts to physical boost.",
        statPriority: 1,
        onStatCalculation(perkAmount) {
            if (!perkAmount)
                return;
            const conversionMultiplier = Math.min(1, 0.2 * perkAmount);
            const offensiveStats = [
                "MagicBoost",
                "EarthBoost",
                "FireBoost",
                "WaterBoost",
                "HolyBoost",
                "HexBoost",
                "AirBoost",
                "DexterityBoost",
                "SummonBoost",
            ];
            let convertedBoost = 0;
            for (const statId of offensiveStats) {
                const statValue = this.stats[statId] || 0;
                if (statValue <= 0)
                    continue;
                convertedBoost += statValue * conversionMultiplier;
            }
            addStat(this, "PhysicalBoost", convertedBoost);
        },
        "source": {
            "cardId": "69214b9731723704c1edaa82",
            "cardUrl": "https://trello.com/c/kMRPcJza"
        },
    },
    weight_distribution: {
        id: "weight_distribution",
        name: "Weight Distribution",
        category: "Perk",
        description: "Your dexterity and physical boost is added together and distributed evenly. Additionally makes M1/M2s slow less while attacking.",
        onStatCalculation(perkAmount) {
            if (!perkAmount)
                return;
            const combinedBoost = (this.stats.PhysicalBoost || 0) + (this.stats.DexterityBoost || 0);
            if (!combinedBoost)
                return;
            const distributedBoost = (combinedBoost / 2) * (1 + (0.1 * perkAmount));
            this.stats.PhysicalBoost = Math.round(distributedBoost * 100) / 100;
            this.stats.DexterityBoost = Math.round(distributedBoost * 100) / 100;
        },
        "source": {
            "cardId": "69214b9731723704c1eda3fc",
            "cardUrl": "https://trello.com/c/w0LwsFfF"
        },
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
        "source": {
            "cardId": "69214b9731723704c1eda458",
            "cardUrl": "https://trello.com/c/8LBFjFic"
        },
    },
    heat_drill: {
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
        onStatCalculation(perkAmount) {
            if (!perkAmount)
                return;
            const stats = this.stats;
            const d = getNegativeStatValue(stats.EarthDefense) +
                getNegativeStatValue(stats.FireDefense) +
                getNegativeStatValue(stats.WaterDefense) +
                getNegativeStatValue(stats.HolyDefense) +
                getNegativeStatValue(stats.HexDefense) +
                getNegativeStatValue(stats.AirDefense) +
                getNegativeStatValue(stats.Warding);
            const p = getNegativeStatValue(stats.Protection);
            const t = getNegativeStatValue(stats.Tenacity);
            const o = getNegativeStatValue(stats.MagicBoost) +
                getNegativeStatValue(stats.PhysicalBoost) +
                getNegativeStatValue(stats.EarthBoost) +
                getNegativeStatValue(stats.FireBoost) +
                getNegativeStatValue(stats.WaterBoost) +
                getNegativeStatValue(stats.HolyBoost) +
                getNegativeStatValue(stats.HexBoost) +
                getNegativeStatValue(stats.AirBoost) +
                getNegativeStatValue(stats.JumpBoost) +
                getNegativeStatValue(stats.DexterityBoost) +
                getNegativeStatValue(stats.SpeedBoost) +
                getNegativeStatValue(stats.SummonBoost) +
                getNegativeStatValue(stats.AttackSpeed) +
                getNegativeStatValue(stats.CritRate) +
                getNegativeStatValue(stats.CritDamage) +
                getNegativeStatValue(stats.HeatResistance) +
                getNegativeStatValue(stats.ColdResistance) +
                getNegativeStatValue(stats.ArmorPenetration) +
                (stats.PhysicalDefense || 0) +
                (stats.MagicDefense || 0);
            const dexterityBoost = (2 * perkAmount / 21) * (d + ((2 * p / 10) + t) / 5 + (2 * o));
            const speedBoost = dexterityBoost / 10;
            addStat(this, "DexterityBoost", dexterityBoost);
            addStat(this, "SpeedBoost", speedBoost);
        },
        "source": {
            "cardId": "69214b9731723704c1eda4c2",
            "cardUrl": "https://trello.com/c/AIF47yPZ"
        },
    },
    immoveable: {
        id: "immoveable",
        name: "Immovable",
        category: "Perk",
        description: "Reduce knockback and increase physical defense based on your tenacity stat.",
        onStatCalculation(perkAmount) {
            if (!perkAmount)
                return;
            const tenacity = this.stats.Tenacity || 0;
            if (!tenacity)
                return;
            addStat(this, "PhysicalDefense", 30 * tenacity * perkAmount);
        },
        "source": {
            "cardId": "69214b9731723704c1eda4b2",
            "cardUrl": "https://trello.com/c/ji6sl9DN"
        },
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
        "source": {
            "cardId": "69214b9731723704c1edabc4",
            "cardUrl": "https://trello.com/c/QHl1kv28"
        },
    },
    bellowing_ember: {
        id: "bellowing_ember",
        name: "Bellowing Ember",
        category: "Perk",
        description: "Grant a chance to light the opponent on fire with fire damage and deal extra damage to opponents and additional if you hit them with fire damage at low hp",
        "source": {
            "cardId": "69214b9731723704c1eda372",
            "cardUrl": "https://trello.com/c/7FkUd60a"
        },
    },
    blastshield: {
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
        "source": {
            "cardId": "69214b9731723704c1eda416",
            "cardUrl": "https://trello.com/c/zBPM5Pnx"
        },
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
    },
    blub_blub: {
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
    },
    bomber_charge: {
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
    },
    bulfrogg_spirit: {
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
    },
    bumblz_spirit: {
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
    },
    caci_king_spirit: {
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
        "source": {
            "cardId": "69214b9731723704c1eda358",
            "cardUrl": "https://trello.com/c/YF2qDXA9"
        },
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
    },
    caster: {
        id: "caster",
        name: "Caster",
        category: "Perk",
        description: "Gain rune and weapon art cooldown reduction",
        "source": {
            "cardId": "69214b9731723704c1eda344",
            "cardUrl": "https://trello.com/c/bNACVMcB"
        },
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
    },
    channeled_weapon: {
        id: "channeled_weapon",
        name: "Channeled Weapon",
        category: "Perk",
        description: "Adds slight magic damage type to all attacks and reduces weapon art cooldown.",
        "source": {
            "cardId": "69214b9731723704c1eda3b6",
            "cardUrl": "https://trello.com/c/Cu6Kzi1Z"
        },
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
    },
    civilian: {
        id: "civilian",
        name: "Civilian",
        category: "Perk",
        description: "Not having your weapon out for more than 3 seconds heavily boosts rune damage and allows you to block without a weapon out.",
        "source": {
            "cardId": "69214b9731723704c1eda9f2",
            "cardUrl": "https://trello.com/c/llhxquuy"
        },
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
    },
    cleave: {
        id: "cleave",
        name: "Cleave",
        category: "Perk",
        description: "Widen the Hitbox of all your Finishers. Additionally, Finishers inflict Armor Break.",
        "source": {
            "cardId": "69214b9731723704c1eda406",
            "cardUrl": "https://trello.com/c/bKFIKrFD"
        },
    },
    colossus: {
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
        "source": {
            "cardId": "69214b9731723704c1eda45e",
            "cardUrl": "https://trello.com/c/nGoxB9AM"
        },
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
    },
    counting_sheep: {
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
        "source": {
            "cardId": "69214b9831723704c1edac9a",
            "cardUrl": "https://trello.com/c/wczMlNo3"
        },
    },
    crushing_pressure: {
        id: "crushing_pressure",
        name: "Crushing Pressure",
        category: "Perk",
        description: "Gain corresponding Armor Penetration scaling off of said specific Defenses of the enemy.",
        "source": {
            "cardId": "69214b9731723704c1edaa14",
            "cardUrl": "https://trello.com/c/G7uxNYkI"
        },
    },
    cryo_engine: {
        id: "cryo_engine",
        name: "Cryo Engine",
        category: "Perk",
        description: "Gain a chance to inflict frostbite on hits as well as converting all your slows to it. Frostbite slows the opponent but additionally increases Air and Water Damage taken by a flat amount. Applying Frostbite grants you Tailwind.",
        "source": {
            "cardId": "69214b9731723704c1eda494",
            "cardUrl": "https://trello.com/c/gcnekmwY"
        },
    },
    curse_rip: {
        id: "curse_rip",
        name: "Curse Rip",
        category: "Perk",
        description: "Hits against a Debuffed opponent gains Lifesteal as well as a Damage Boost that scales on the amount of unique ones on them.",
        "source": {
            "cardId": "69214b9731723704c1eda448",
            "cardUrl": "https://trello.com/c/J5kPDe3y"
        },
    },
    cursed_bark: {
        id: "cursed_bark",
        name: "Cursed Bark",
        category: "Perk",
        description: "Gain a small chance to inflict a random, unmodified Debuff against said enemy when hit. Gain Damage Reduction against Enemies with Debuffs that scales on the amount of unique ones on them.",
        "source": {
            "cardId": "69214b9731723704c1eda48e",
            "cardUrl": "https://trello.com/c/R9Ua8FaJ"
        },
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
    },
    dark_magic: {
        id: "dark_magic",
        name: "Dark Magic",
        category: "Perk",
        description: "you take some self damage when you hit people with magic damage. Additionally all attacks that deal magic damage deal bonus hex damage.",
        "source": {
            "cardId": "69214b9731723704c1eda4aa",
            "cardUrl": "https://trello.com/c/mgNRFUsc"
        },
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
    },
    deepcrystal_calling: {
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
    },
    delta_drill: {
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
    },
    dire_buni_spirit: {
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
        category: "Perk",
        description: "Enemies are more vulnerable to your poise damage afflicted with the Taunt Debuff.",
        "source": {
            "cardId": "69214b9831723704c1edaeba",
            "cardUrl": "https://trello.com/c/yzimqjId"
        },
    },
    draconic_blood: {
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
        "source": {
            "cardId": "69214b9731723704c1eda41c",
            "cardUrl": "https://trello.com/c/KkTA2Oq0"
        },
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
        "source": {
            "cardId": "69214b9731723704c1eda4b8",
            "cardUrl": "https://trello.com/c/qzmBIYkD"
        },
    },
    endless_despair: {
        id: "endless_despair",
        name: "Endless Despair",
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
        "source": {
            "cardId": "69214b9731723704c1eda44e",
            "cardUrl": "https://trello.com/c/tknW6gsB"
        },
    },
    engine: {
        id: "engine",
        name: "Engine",
        category: "Perk",
        description: "Your Speed Boost stat as well as the Tailwind Buff increases your Attack Speed.",
        "source": {
            "cardId": "69214b9731723704c1eda4b6",
            "cardUrl": "https://trello.com/c/kNRHFv5d"
        },
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
        "source": {
            "cardId": "69214b9731723704c1edab4c",
            "cardUrl": "https://trello.com/c/iCWTWoVH"
        },
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
    },
    essence_totem: {
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
        "source": {
            "cardId": "69214b9731723704c1eda394",
            "cardUrl": "https://trello.com/c/vrmvJPnI"
        },
    },
    exhaust: {
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
        "source": {
            "cardId": "69214b9731723704c1eda484",
            "cardUrl": "https://trello.com/c/DzUd6F24"
        },
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
    },
    flash_strike: {
        id: "flash_strike",
        name: "Flash Strike",
        category: "Perk",
        description: "Parrying an attack grants a buff called Flash Strike granting extreme attack speed momentarily.",
        "source": {
            "cardId": "69214b9831723704c1edae6a",
            "cardUrl": "https://trello.com/c/ge4rmWRD"
        },
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
    },
    fractured_energy: {
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
        "source": {
            "cardId": "69214b9831723704c1edaeaa",
            "cardUrl": "https://trello.com/c/pcFpdK1s"
        },
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
        "source": {
            "cardId": "69214b9731723704c1eda4c4",
            "cardUrl": "https://trello.com/c/AYAygnuB"
        },
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
        "source": {
            "cardId": "69214b9731723704c1eda452",
            "cardUrl": "https://trello.com/c/QGlNl7Tp"
        },
    },
    frozen_waste: {
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
    },
    gaseous_smash: {
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
        "source": {
            "cardId": "69214b9731723704c1eda918",
            "cardUrl": "https://trello.com/c/g2VKZtET"
        },
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
        support: { "status": "Partial", "details": "Adds 0.1 Rage potency per perk to statuses this build applies. Cooldown, duration on kill, and highest-boost penetration are not calculated." },
        "source": {
            "cardId": "69214b9731723704c1eda428",
            "cardUrl": "https://trello.com/c/7vMRpUp1"
        },
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
    },
    gremlin_spirit: {
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
        "source": {
            "cardId": "69214b9831723704c1edad06",
            "cardUrl": "https://trello.com/c/KfRmwoqr"
        },
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
    },
    heightened_reflexes: {
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
    },
    honey_arts: {
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
    },
    ice_barge: {
        id: "ice_barge",
        name: "Ice Barge",
        category: "Perk",
        description: "Speed reductions from Slowing effects and Stuns are reduced, and gain Damage Reduction whilst inflicted with them. Additionally, your run is not cancelled by Stuns.",
        "source": {
            "cardId": "69214b9731723704c1eda496",
            "cardUrl": "https://trello.com/c/3mFguLrj"
        },
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
    },
    inoculation: {
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
        "source": {
            "cardId": "69214b9831723704c1edace0",
            "cardUrl": "https://trello.com/c/DLCdQ0RQ"
        },
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
        "source": {
            "cardId": "69214b9731723704c1edaa06",
            "cardUrl": "https://trello.com/c/iarJ7Tf6"
        },
    },
    iron_slayer_spirit: {
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
        "source": {
            "cardId": "69214b9731723704c1eda998",
            "cardUrl": "https://trello.com/c/rqrxBBeH"
        },
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
    },
    kindling: {
        id: "kindling",
        name: "Kindling",
        category: "Perk",
        description: "Your Burn potency is multiplied by 50%, but has a much shorter duration.",
        "source": {
            "cardId": "69214b9731723704c1eda3be",
            "cardUrl": "https://trello.com/c/biuQhgpJ"
        },
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
    },
    life_drinker: {
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
    },
    lucky: {
        id: "lucky",
        name: "Lucky",
        category: "Perk",
        description: "Dramatically increase the chance of many chance based combat effects but add negative warding, protection, and tenacity to your character.",
        "source": {
            "cardId": "69214b9731723704c1eda4b0",
            "cardUrl": "https://trello.com/c/ElHijWTj"
        },
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
    },
    mage_rage: {
        id: "mage_rage",
        name: "Mage Rage",
        category: "Perk",
        description: "Rage now applies on Pure-Magic Type Damage, grants Rune Cooldown Reduction and increases potency.",
        onStatCalculation(perkAmount) {
            addRagePotency(this, perkAmount);
        },
        support: { "status": "Partial", "details": "Rage gains Magic output eligibility; self-applied Rage potency scales with the caster. Rune cooldown reduction is not calculated." },
        "source": {
            "cardId": "69214b9731723704c1edabb4",
            "cardUrl": "https://trello.com/c/HRZEyoIi"
        },
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
    },
    magic_guard: {
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
        sourcepotencies: {
            regenpotency: 1,
        },
        "source": {
            "cardId": "69214b9731723704c1eda49c",
            "cardUrl": "https://trello.com/c/e6lgq8HQ"
        },
    },
    melting_shred: {
        id: "melting_shred",
        name: "Melting Shred",
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
    },
    mounted_defense: {
        id: "mounted_defense",
        name: "Mounted Defense",
        category: "Perk",
        description: "While mounted on the Glacial Snapper specifically, you gain Damage Reduction.",
        "source": {
            "cardId": "69214b9831723704c1edadfa",
            "cardUrl": "https://trello.com/c/nNcCVWEa"
        },
    },
    mycotic_bloom: {
        id: "mycotic_bloom",
        name: "Mycotic Bloom",
        category: "Perk",
        description: "Enemies you have Poisoned are inflicted with Slow over 50%. Enemies below 50% take more Poison damage.",
        "source": {
            "cardId": "69214b9831723704c1edadc0",
            "cardUrl": "https://trello.com/c/9nA8O7Im"
        },
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
        "source": {
            "cardId": "69214b9731723704c1eda3ea",
            "cardUrl": "https://trello.com/c/XCDTt8fa"
        },
    },
    piercer: {
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
        "source": {
            "cardId": "69214b9831723704c1edad16",
            "cardUrl": "https://trello.com/c/rsFKJevO"
        },
    },
    poisonous: {
        id: "poisonous",
        name: "Poisonous",
        category: "Perk",
        description: "Gain a small chance to inflict Poison and deal bonus Hex Damage on hit.",
        "source": {
            "cardId": "69214b9731723704c1eda3d0",
            "cardUrl": "https://trello.com/c/uPlSBhdo"
        },
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
    },
    power_surge: {
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
    },
    protector_spirit: {
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
    },
    queen_bumblz_spirit: {
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
        "source": {
            "cardId": "69214b9731723704c1eda47c",
            "cardUrl": "https://trello.com/c/L6QUW33j"
        },
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
    },
    quick_witted: {
        id: "quick_witted",
        name: "Quick Witted",
        category: "Perk",
        description: "Increases your Dexterity Boost scaling off of your Speed Boost.",
        "source": {
            "cardId": "69214b9731723704c1eda470",
            "cardUrl": "https://trello.com/c/73dSCsCt"
        },
    },
    quickcast: {
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
        "source": {
            "cardId": "69214b9731723704c1eda3d6",
            "cardUrl": "https://trello.com/c/hWCUSZTd"
        },
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
    },
    rabbits_foot: {
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
        "source": {
            "cardId": "69214b9731723704c1eda370",
            "cardUrl": "https://trello.com/c/CSv4bCK2"
        },
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
    },
    revel_in_death: {
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
    },
    rocky_body: {
        id: "rocky_body",
        name: "Rocky Body",
        category: "Perk",
        description: "Increases your Physical Defense scaling off of your Earth Boost.",
        "source": {
            "cardId": "69214b9731723704c1edabbe",
            "cardUrl": "https://trello.com/c/o0OgPMRa"
        },
    },
    roguent_spirit: {
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
    },
    ruler_of_the_sands: {
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
        "source": {
            "cardId": "69214b9731723704c1eda362",
            "cardUrl": "https://trello.com/c/xvseWOc5"
        },
    },
    sacred_grounds: {
        id: "sacred_grounds",
        name: "Sacred Grounds",
        category: "Perk",
        description: "Using a Rune causes a holy cross to fall after a short delay, which slightly heals and grants Reinforce.",
        "source": {
            "cardId": "69214b9731723704c1eda438",
            "cardUrl": "https://trello.com/c/hiETbRAL"
        },
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
    },
    sandy_wounds: {
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
    },
    seismic_momentum: {
        id: "seismic_momentum",
        name: "Seismic Momentum",
        category: "Perk",
        description: "Your crit chance scales on your earth boost instead of dex boost.",
        "source": {
            "cardId": "69214b9731723704c1eda48c",
            "cardUrl": "https://trello.com/c/yJt9lFvu"
        },
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
    },
    shamanic_flow: {
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
    },
    siphoning_rot: {
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
        "source": {
            "cardId": "69214b9731723704c1eda498",
            "cardUrl": "https://trello.com/c/GY9cpb7j"
        },
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
        "source": {
            "cardId": "69214b9731723704c1eda37c",
            "cardUrl": "https://trello.com/c/Cs2JybzB"
        },
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
    },
    spore_trooper: {
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
        sourcepotencies: {
            bouncepotency: 0.1,
        },
        "source": {
            "cardId": "69214b9831723704c1edaedc",
            "cardUrl": "https://trello.com/c/4uEh794y"
        },
    },
    spring_step: {
        id: "spring_step",
        name: "Spring Step",
        category: "Perk",
        description: "Increases jump height after using a weapon art.",
        "source": {
            "cardId": "69214b9731723704c1eda36e",
            "cardUrl": "https://trello.com/c/wpTVMn3G"
        },
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
        "source": {
            "cardId": "69214b9731723704c1eda3ec",
            "cardUrl": "https://trello.com/c/xrX4I7k4"
        },
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
    },
    steam_powered: {
        id: "steam_powered",
        name: "Steam Powered",
        category: "Perk",
        description: "Gain a universal Damage Boost scaling off of your Air Boost, but in turn gain a chance to take minor Fire Damage and set yourself on fire upon dealing any.",
        "source": {
            "cardId": "69214b9731723704c1eda4ae",
            "cardUrl": "https://trello.com/c/xkEv6XS5"
        },
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
    },
    sticky_summons: {
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
        "source": {
            "cardId": "69214b9731723704c1eda47a",
            "cardUrl": "https://trello.com/c/Vau2WfCJ"
        },
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
    },
    storm_caster: {
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
        sourcepotencies: {
            reinforcepotency: 0.2,
        },
        "source": {
            "cardId": "69214b9731723704c1eda368",
            "cardUrl": "https://trello.com/c/IM6fJaTL"
        },
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
    },
    toadzerker_spirit: {
        id: "toadzerker_spirit",
        name: "Toadzerker Spirit",
        category: "Perk",
        description: "Release your Spiritual Energy with an RMB, which conjurers a Spiritual Toadzerker that leaps into the air before slamming down in a large AoE.",
        "source": {
            "cardId": "69214b9831723704c1edac8c",
            "cardUrl": "https://trello.com/c/JUK2ys4d"
        },
    },
    torpedo_barrage: {
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
        "source": {
            "cardId": "69214b9731723704c1eda34c",
            "cardUrl": "https://trello.com/c/RuchhWoQ"
        },
    },
    toxin_transfer: {
        id: "toxin_transfer",
        name: "Toxin Transfer",
        category: "Perk",
        description: "Hitting someone when poisoned does bonus hex damage and poisons them. Grants poison potency.",
        "source": {
            "cardId": "69214b9731723704c1eda4a6",
            "cardUrl": "https://trello.com/c/KqD6pP2y"
        },
    },
    trickster: {
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
        "source": {
            "cardId": "69214b9731723704c1eda4b4",
            "cardUrl": "https://trello.com/c/vpNISefp"
        },
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
    },
    trusty_servant: {
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
        "source": {
            "cardId": "69214b9731723704c1eda95e",
            "cardUrl": "https://trello.com/c/WbuVXjxJ"
        },
    },
    vampire: {
        id: "vampire",
        name: "Vampire",
        category: "Perk",
        description: "Gain bonus Damage and Defense in the shadows but lose them and deal even less in sunlight. Additionally, lose the ability to heal in inns and receive less healing overall, but gain the ability to heal on Kill and Posture Breaking.",
        "source": {
            "cardId": "69214b9731723704c1eda3e0",
            "cardUrl": "https://trello.com/c/O7ET7Qs9"
        },
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
        "source": {
            "cardId": "69214b9731723704c1eda476",
            "cardUrl": "https://trello.com/c/4yuZf0wL"
        },
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
        "source": {
            "cardId": "69214b9731723704c1eda396",
            "cardUrl": "https://trello.com/c/k5KWGJHo"
        },
    },
    wave_rider: {
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
        "source": {
            "cardId": "69214b9731723704c1eda356",
            "cardUrl": "https://trello.com/c/eh8FjtrX"
        },
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
        "source": {
            "cardId": "69214b9831723704c1edae96",
            "cardUrl": "https://trello.com/c/bvtL5MFR"
        },
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
        "source": {
            "cardId": "69214b9731723704c1eda46c",
            "cardUrl": "https://trello.com/c/2VtmfMab"
        },
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
    },
    woof_spirit: {
        id: "woof_spirit",
        name: "Woof Spirit",
        category: "Perk",
        description: "Release your Spiritual Energy as a large howl on RMB., which inflicts Weaken.",
        "source": {
            "cardId": "69214b9831723704c1edac84",
            "cardUrl": "https://trello.com/c/0AykNlOE"
        },
    },
    wrathful_crits: {
        id: "wrathful_crits",
        name: "Wrathful Crits",
        category: "Perk",
        description: "When you Crit, gain Rage for a brief duration.",
        sourcepotencies: {
            ragepotency: 0.1,
        },
        "source": {
            "cardId": "69214b9731723704c1eda382",
            "cardUrl": "https://trello.com/c/WPLSJfQR"
        },
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
    },
    magic_surge: {
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
    },
    rainstorm: {
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
    },
    turtle: {
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
        "source": {
            "cardId": "69214b9731723704c1edaab0",
            "cardUrl": "https://trello.com/c/DiNCzYsD"
        },
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
