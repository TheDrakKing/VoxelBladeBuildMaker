export const Perks = {
    /** Race Perks Here */
    human: {
        id: "human",
        name: "Human",
        category: "Race",
        description: "Gain 20% damage reduction and damage boost when below 50% HP..",
        onDmgBonusMultiplier(perkAmount) {
            if (!perkAmount)
                return null;
            //check if hp is below 50% in the function where this is called and only then call this function
            if (this.hp > 50)
                return null;
            let baseMultiplier = 20;
            let multiplier = (baseMultiplier) / 100;
            return Math.trunc(multiplier * 100) / 100;
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
    half_elf: {
        id: "half_elf",
        name: "Half Elf",
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
    potion_chugger: {
        id: "potion_chugger",
        name: "Potion Chugger",
        category: "",
        description: "Tenacity increases damage dealt.",
    },
    rider: {
        id: "rider",
        name: "Rider",
        category: "",
        description: "Tenacity increases damage dealt.",
    },
    berserkingstrength: {
        id: "berserkingstrength",
        name: "BerserkingStrength",
        category: "",
        description: "Tenacity increases damage dealt.",
    },
    blood_thirsty: {
        id: "blood_thirsty",
        name: "Blood Thirsty",
        category: "",
        description: "If you hit a bleeding opponent bleeding by you remove the bleed, deal bonus damage, and heal. Grants bleed potency.",
        onDmgBonusMultiplier(perkAmount) {
            if (!perkAmount || !this.target || !this.target.deBuffs) {
                return null;
            }
            ;
            let bleed = this.target.deBuffs.find((deBuff) => deBuff?.id === "bleed");
            if (!bleed)
                return null;
            let baseMultiplier = 20;
            let multiplier = (baseMultiplier * perkAmount) / 100;
            return Math.trunc(multiplier * 100) / 100;
        },
    },
    shielding_gong: {
        id: "shielding_gong",
        name: "Shielding Gong",
        category: "",
        description: "Tenacity increases damage dealt.",
    },
    barbskin: {
        id: "barbskin",
        name: "Barbskin",
        category: "",
        description: "Tenacity increases damage dealt.",
    },
    pulverizing_rush: {
        id: "pulverizing_rush",
        name: "Pulverizing Rush",
        category: "",
        description: "Using a finisher that hits a target while allies are nearby create a burst that grants reinforce to nearby allies. Additionally having reinforce grants knockback resistance.",
    },
    fury: {
        id: "fury",
        name: "Fury",
        category: "",
        description: "Tenacity increases damage dealt.",
    },
    void_rage: {
        id: "void_rage",
        name: "Void Rage",
        category: "",
        description: "Tenacity increases damage dealt.",
    },
    echo_incineration: {
        id: "echo_incineration",
        name: "Echo Incineration",
        category: "",
        description: "Tenacity increases damage dealt.",
    },
    strong_tides: {
        id: "strong_tides",
        name: "Strong Tides",
        category: "",
        description: "Tenacity increases damage dealt.",
    },
    reaper: {
        id: "reaper",
        name: "Reaper",
        category: "",
        description: "Tenacity increases damage dealt.",
        onDmgBonusMultiplier(perkAmount) {
            if (!perkAmount)
                return null;
            if (!this.target || !this.target.deBuffs)
                return null;
            let baseMultiplier = 5;
            let targetDebuff = this.target.deBuffs.length || 0;
            let multiplier = (baseMultiplier * targetDebuff * perkAmount) / 100;
            return Math.trunc(multiplier * 100) / 100;
        },
    },
    scourge: {
        id: "scourge",
        name: "Scourge",
        category: "",
        description: "True damage can be affected by rage. Also all hits have a chance to count as a guard break and deal bonus damage.",
        onDmgBonusMultiplier(perkAmount) {
            if (!perkAmount)
                return null;
            let baseMultiplier = 20;
            let multiplier = (baseMultiplier * perkAmount) / 100;
            return Math.trunc(multiplier * 100) / 100;
        },
    },
    highlander: {
        id: "highlander",
        name: "Highlander",
        category: "",
        description: "Tenacity increases damage dealt.",
    },
    hemorrhage: {
        id: "hemorrhage",
        name: "Hemorrhage",
        category: "",
        description: "Hitting a bleeding opponent adds bonus damage, bonus true damage and increases stun. Grants bleed potency.",
        onDmgBonusMultiplier(perkAmount) {
            if (!perkAmount || !this.target || !this.target.deBuffs)
                return null;
            let bleed = this.target.deBuffs.find((deBuffs) => deBuffs?.id === "bleed");
            if (!bleed)
                return null;
            let baseMultiplier = 10 + 10 * perkAmount;
            let multiplier = baseMultiplier / 100;
            //console.log(multiplier);
            return Math.trunc(multiplier * 100) / 100;
        },
        onOutputCalculation(perkAmount) {
            if (!perkAmount || !this.target || !this.target.deBuffs)
                return null;
            let bleed = this.target.deBuffs.find((deBuffs) => deBuffs?.id === "bleed");
            if (!bleed)
                return null;
            let outputMultiplier = 0.1;
            let previousValue = this.damageTypes["True"];
            this.damageTypes["True"] = previousValue
                ? previousValue + outputMultiplier
                : outputMultiplier;
            return null;
        },
    },
    vicious_edge: {
        id: "vicious_edge",
        name: "Vicious Edge",
        category: "",
        description: "Tenacity increases damage dealt.",
    },
    voltaic_body: {
        id: "voltaic_body",
        name: "Voltaic Body",
        category: "",
        description: "Using your weapon art gives you a static charge that causes your targets to be struck  by lightning when you hit them with your rune, but your rune has an increased cooldown..",
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
            const baseDamage = (8 + 4 * perkAmount) * (0.85 ^ 1);
            return {
                damage: baseDamage,
                hitAmount: 1,
                source: "voltaic_body",
                sourceDamageType: "Perk",
                sourceType: "Perk"
            };
        }
    },
    duelist_stance: {
        id: "duelist_stance",
        name: "Duelist Stance",
        category: "",
        description: "Tenacity increases damage dealt.",
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
        description: "Tenacity increases damage dealt.",
    },
    heat_drill: {
        id: "heat_drill",
        name: "Heat Drill",
        category: "",
        description: "Tenacity increases damage dealt.",
    },
    ignition: {
        id: "ignition",
        name: "Ignition",
        category: "",
        description: "Tenacity increases damage dealt.",
    },
    immoveable: {
        id: "immoveable",
        name: "Immoveable",
        category: "Perk",
        description: "Your tenacity Boost now affects your physical defense",
        onStatCalculation(perkAmount) {
            if (!this.stats || !this.stats.Tenacity)
                return;
            let preDefense = this.stats.PhysicalDefense || 0;
        },
    },
};
