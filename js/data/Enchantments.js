export const Enchantments = {
    Legendary: {
        id: "legendary",
        name: "Legendary",
        category: "Enchantment",
        description: "Times all Positive Stats by x1.5",
        onStatCalculation(perkAmount, outputType, stats) {
            if (!stats)
                return;
            for (const [key, value] of Object.entries(stats)) {
                // key is a string, value is a number or undefined
                if (!value || value <= 0)
                    continue;
                stats[key] = Math.trunc(value * 1.5 * 10) / 10;
            }
        },
    },
    refined: {
        id: "refined",
        name: "Refined",
        category: "Enchantment",
        description: "Times all Positive Stats by x1.2 and half Negative stats",
        onArmorStatModified(perkAmount, outputType, stats) {
            if (!stats)
                return;
            for (const [key, value] of Object.entries(stats)) {
                // key is a string, value is a number or undefined
                if (value === undefined)
                    continue;
                if (value > 0) {
                    stats[key] = Math.trunc(value * 1.2 * 10) / 10;
                }
                else if (value < 0) {
                    stats[key] = Math.trunc(value * 0.5 * 10) / 10;
                }
            }
        },
    },
    strengthened: {
        id: "strengthened",
        name: "Strengthened",
        category: "Enchantment",
        description: "Times Positive Physical Boost by x1.2",
        stats: {
            PhysicalBoost: 10,
        },
        onStatCalculation(perkAmount) {
            if (!this.stats || !this.stats.PhysicalBoost)
                return;
            this.stats.PhysicalBoost =
                Math.trunc(this.stats.PhysicalBoost * 1.2 * 10) / 10;
        },
    },
    dexterous: {
        id: "dexterous",
        name: "Dexterous",
        category: "Enchantment",
        description: "Times Positive Dexterity Boost by x1.2",
        stats: {
            DexterityBoost: 10,
            JumpBoost: 2,
            SpeedBoost: 5,
        },
        onStatCalculation(perkAmount) {
            if (!this.stats || !this.stats.DexterityBoost)
                return;
            this.stats.DexterityBoost =
                Math.trunc(this.stats.DexterityBoost * 1.2 * 10) / 10;
        },
    },
    burning: {
        id: "burning",
        name: "Burning",
        category: "Enchantment",
        description: "Times Positive Fire Boost by x1.2",
        stats: {
            FireBoost: 10,
        },
        onStatCalculation(perkAmount) {
            if (!this.stats || !this.stats.FireBoost)
                return;
            this.stats.FireBoost = Math.trunc(this.stats.FireBoost * 1.2 * 10) / 10;
        },
    },
    Wet: {
        id: "wet",
        name: "Wet",
        category: "Enchantment",
        description: "Times Positive Water Boost by x1.2",
        stats: {
            WaterBoost: 10,
        },
        onStatCalculation(perkAmount) {
            if (!this.stats || !this.stats.WaterBoost)
                return;
            this.stats.WaterBoost = Math.trunc(this.stats.WaterBoost * 1.2 * 10) / 10;
        },
    },
    earthen: {
        id: "earthen",
        name: "Earthen",
        category: "Enchantment",
        description: "Times Positive Earth Boost by x1.2",
        stats: {
            EarthBoost: 10,
        },
        onStatCalculation(perkAmount) {
            if (!this.stats || !this.stats.EarthBoost)
                return;
            this.stats.EarthBoost = Math.trunc(this.stats.EarthBoost * 1.2 * 10) / 10;
        },
    },
    magical: {
        id: "magical",
        name: "Magical",
        category: "Enchantment",
        description: "Times Positive Magic Boost by x1.2",
        stats: {
            MagicBoost: 10,
        },
        onStatCalculation(perkAmount) {
            if (!this.stats || !this.stats.MagicBoost)
                return;
            this.stats.MagicBoost = Math.trunc(this.stats.MagicBoost * 1.2 * 10) / 10;
        },
    },
    cursed: {
        id: "cursed",
        name: "Cursed",
        category: "Enchantment",
        description: "Times Positive Hex Boost by x1.2",
        stats: {
            HexBoost: 10,
        },
        onStatCalculation(perkAmount) {
            if (!this.stats || !this.stats.HexBoost)
                return;
            this.stats.HexBoost = Math.trunc(this.stats.HexBoost * 1.2 * 10) / 10;
        },
    },
    windy: {
        id: "windy",
        name: "Windy",
        category: "Enchantment",
        description: "Times Positive Air Boost by x1.2",
        stats: {
            AirBoost: 10,
        },
        onStatCalculation(perkAmount) {
            if (!this.stats || !this.stats.AirBoost)
                return;
            this.stats.AirBoost = Math.trunc(this.stats.AirBoost * 1.2 * 10) / 10;
        },
    },
    enlightened: {
        id: "enlightened",
        name: "Enlightened",
        category: "Enchantment",
        description: "Times Positive Holy Boost by x1.2",
        stats: {
            HolyBoost: 10,
        },
        onStatCalculation(perkAmount) {
            if (!this.stats || !this.stats.HolyBoost)
                return;
            this.stats.HolyBoost = Math.trunc(this.stats.HolyBoost * 1.2 * 10) / 10;
        },
    },
    summoner: {
        id: "summoner",
        name: "Summoner's",
        category: "Enchantment",
        description: "Times Positive Summon Boost by x1.2",
        stats: {
            SummonBoost: 10,
        },
        onStatCalculation(perkAmount) {
            if (!this.stats || !this.stats.SummonBoost)
                return;
            this.stats.SummonBoost =
                Math.trunc(this.stats.SummonBoost * 1.2 * 10) / 10;
        },
    },
    hardened: {
        id: "magical",
        name: "Magical",
        category: "Enchantment",
        description: "Give Extra Protection",
        stats: {
            Protection: 7.5,
        },
    },
    warded: {
        id: "warded",
        name: "Warded",
        category: "Enchantment",
        description: "Gives Warded",
        stats: {
            Warding: 30,
        },
    },
    tenacious: {
        id: "tenacious",
        name: "Tenacious",
        category: "Enchantment",
        description: "Adds Tenacity",
        stats: {
            Tenacity: 0.1,
        },
    },
    insulated: {
        id: "insulated",
        name: "Insulated",
        category: "Enchantment",
        description: "Added resistance to Heat and Cold dot damage",
        stats: {
            ColdResistance: 100,
            HeatResistance: 100,
        },
    },
    vampiric: {
        id: "vampiric",
        name: "Vampiric",
        category: "Enchantment",
        description: "Suck",
        stats: {
            HolyDefense: -40,
        },
        perks: {
            Lifesteal: 1,
        },
    },
    tanky: {
        id: "tanky",
        name: "Tanky",
        category: "Enchantment",
        description: "Times Positive Magic Boost by x1.2",
        stats: {
            PhysicalDefense: 10,
            SpeedBoost: -5,
        },
        onStatCalculation(perkAmount) {
            if (!this.stats)
                return;
            for (const [key, value] of Object.entries(this.stats)) {
                // key is a string, value is a number or undefined
                if (value === undefined || !key.endsWith("Defense"))
                    continue;
                console.log(key);
                if (value > 0) {
                    this.stats[key] = Math.trunc(value * 1.5 * 10) / 10;
                }
                else if (value < 0) {
                    this.stats[key] = Math.trunc(value * 0.5 * 10) / 10;
                }
            }
        },
    },
    ////////////////ACD Enchantment ///////////////////////////
    ferocious: {
        id: "ferocious",
        name: "Ferocious",
        category: "Enchantment",
        description: "Gives ferocious",
        stats: {
            Tenacity: 0.05,
        },
        perks: {
            ferocious: 1,
        },
    },
    quenched: {
        id: "quenched",
        name: "Quenched",
        category: "Enchantment",
        description: "Adds Bleed Potency",
        potencies: {
            bleedpotency: 3,
        },
    },
    acidic: {
        id: "acidic",
        name: "Acidic",
        category: "Enchantment",
        description: "Adds Poison Potency",
        potencies: {
            poisonpotency: 3,
        },
    },
    piercing: {
        id: "piercing",
        name: "Piercing",
        category: "Enchantment",
        description: "Adds Armor Penetration",
        stats: {
            ArmorPenetration: 10,
        },
    },
    warped: {
        id: "warped",
        name: "Warped",
        category: "Enchantment",
        description: "removes stats but adds perk_effectiveness",
        perks: {
            perk_effectiveness: 1,
        },
    },
};
