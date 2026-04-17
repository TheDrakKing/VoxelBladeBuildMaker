export const Enchantments = {
    Legendary: {
        id: "legendary",
        name: "Legendary",
        category: "Enchantment",
        description: "Times all Positive Stats by x1.5",
        onStatCalculation(perkAmount, args) {
            const item = args?.item;
            if (!item || !item.stats)
                return;
            for (const [key, value] of Object.entries(item.stats)) {
                // key is a string, value is a number or undefined
                if (!value || value <= 0)
                    continue;
                item.stats[key] = Math.trunc(value * 1.5 * 10) / 10;
            }
        },
    },
    refined: {
        id: "refined",
        name: "Refined",
        category: "Enchantment",
        description: "Times all Positive Stats by x1.2 and half Negative stats",
        onStatCalculation(perkAmount, args) {
            const item = args?.item;
            if (!item || !item.stats)
                return;
            for (const [key, value] of Object.entries(item.stats)) {
                // key is a string, value is a number or undefined
                if (value === undefined)
                    continue;
                if (value > 0) {
                    item.stats[key] = Math.trunc(value * 1.2 * 10) / 10;
                }
                else if (value < 0) {
                    item.stats[key] = Math.trunc(value * 0.5 * 10) / 10;
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
        onStatCalculation(perkAmount, args) {
            const item = args?.item;
            if (!item || !item.stats || !item.stats.PhysicalBoost)
                return;
            item.stats.PhysicalBoost =
                Math.trunc(item.stats.PhysicalBoost * 1.2 * 10) / 10;
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
        onStatCalculation(perkAmount, args) {
            const item = args?.item;
            if (!item || !item.stats || !item.stats.DexterityBoost)
                return;
            item.stats.DexterityBoost =
                Math.trunc(item.stats.DexterityBoost * 1.2 * 10) / 10;
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
        onStatCalculation(perkAmount, args) {
            const item = args?.item;
            if (!item || !item.stats || !item.stats.FireBoost)
                return;
            item.stats.FireBoost = Math.trunc(item.stats.FireBoost * 1.2 * 10) / 10;
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
        onStatCalculation(perkAmount, args) {
            const item = args?.item;
            if (!item || !item.stats || !item.stats.WaterBoost)
                return;
            item.stats.WaterBoost = Math.trunc(item.stats.WaterBoost * 1.2 * 10) / 10;
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
        onStatCalculation(perkAmount, args) {
            const item = args?.item;
            if (!item || !item.stats || !item.stats.EarthBoost)
                return;
            item.stats.EarthBoost = Math.trunc(item.stats.EarthBoost * 1.2 * 10) / 10;
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
        onStatCalculation(perkAmount, args) {
            const item = args?.item;
            if (!item || !item.stats || !item.stats.MagicBoost)
                return;
            item.stats.MagicBoost = Math.trunc(item.stats.MagicBoost * 1.2 * 10) / 10;
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
        onStatCalculation(perkAmount, args) {
            const item = args?.item;
            if (!item || !item.stats || !item.stats.HexBoost)
                return;
            item.stats.HexBoost = Math.trunc(item.stats.HexBoost * 1.2 * 10) / 10;
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
        onStatCalculation(perkAmount, args) {
            const item = args?.item;
            if (!item || !item.stats || !item.stats.AirBoost)
                return;
            item.stats.AirBoost = Math.trunc(item.stats.AirBoost * 1.2 * 10) / 10;
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
        onStatCalculation(perkAmount, args) {
            const item = args?.item;
            if (!item || !item.stats || !item.stats.HolyBoost)
                return;
            item.stats.HolyBoost = Math.trunc(item.stats.HolyBoost * 1.2 * 10) / 10;
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
        onStatCalculation(perkAmount, args) {
            const item = args?.item;
            if (!item || !item.stats || !item.stats.SummonBoost)
                return;
            item.stats.SummonBoost =
                Math.trunc(item.stats.SummonBoost * 1.2 * 10) / 10;
        },
    },
    hardened: {
        id: "hardened",
        name: "Hardened",
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
        onStatCalculation(perkAmount, args) {
            const item = args?.item;
            if (!item || !item.stats)
                return;
            for (const [key, value] of Object.entries(item.stats)) {
                // key is a string, value is a number or undefined
                if (value === undefined || !key.endsWith("Defense"))
                    continue;
                console.log(key);
                if (value > 0) {
                    item.stats[key] = Math.trunc(value * 1.5 * 10) / 10;
                }
                else if (value < 0) {
                    item.stats[key] = Math.trunc(value * 0.5 * 10) / 10;
                }
            }
        },
    },
    corroded: {
        id: "corroded",
        name: "Corroded",
        category: "Enchantment",
        description: "reduces warding",
        stats: {
            Warding: -20,
        },
    },
    corrupt: {
        id: "corrupt",
        name: "Corrupt",
        category: "Enchantment",
        description: "invert and doubles Negative stats, and remove Positive stats",
    },
    ////////////////ACD Enchantment ///////////////////////////
    quick: {
        id: "quick",
        name: "Quick",
        category: "Enchantment",
        description: "You Feel Quick",
        stats: {
            AttackSpeed: 10,
        },
    },
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
