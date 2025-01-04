export const Perks = {
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
            if (!perkAmount || !this.target || !this.target.deBuffs)
                return null;
            let bleed = this.target.deBuffs.find((deBuffs) => deBuffs?.id === "bleed");
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
        description: "Tenacity increases damage dealt.",
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
            this.damageTypes["True"] = previousValue ? previousValue + outputMultiplier : outputMultiplier;
            return null;
        },
    },
    vicious_edge: {
        id: "vicious_edge",
        name: "Vicious Edge",
        category: "",
        description: "Tenacity increases damage dealt.",
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
};
