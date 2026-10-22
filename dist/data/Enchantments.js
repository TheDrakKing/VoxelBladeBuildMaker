export const Enchantments = {
    legendary: {
        id: "legendary",
        name: "Legendary",
        category: "Enchantment",
        description: "- **Positive Stats:** x1.5",
        "stats": {},
        "perks": {},
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda22c",
            "cardUrl": "https://trello.com/c/cDW5yaJR",
            "sectionId": "69214b9731723704c1eda22c"
        },
        "enchantmentTransforms": [
            {
                "scope": "positive_stats",
                "factor": 1.5
            }
        ],
        "ascended": false
    },
    refined: {
        id: "refined",
        name: "Refined",
        category: "Enchantment",
        description: "- **Positive Stats:** x1.35\n- **Negative Stats:** x0.5",
        "stats": {},
        "perks": {},
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda4d2",
            "cardUrl": "https://trello.com/c/f0eyBw7l",
            "sectionId": "69214b9731723704c1eda4d2"
        },
        "enchantmentTransforms": [
            {
                "scope": "positive_stats",
                "factor": 1.35
            },
            {
                "scope": "negative_stats",
                "factor": 0.5
            }
        ],
        "ascended": false
    },
    strengthened: {
        id: "strengthened",
        name: "Strengthened",
        category: "Enchantment",
        description: "- **Physical Boost:** x1.2\n- **Physical Boost:** +10%",
        stats: {
            PhysicalBoost: 10,
        },
        "perks": {},
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda22e",
            "cardUrl": "https://trello.com/c/f8UpTMpe",
            "sectionId": "69214b9731723704c1eda22e"
        },
        "enchantmentTransforms": [
            {
                "scope": "stat",
                "stat": "PhysicalBoost",
                "factor": 1.2
            }
        ],
        "ascended": false
    },
    dexterous: {
        id: "dexterous",
        name: "Dexterous",
        category: "Enchantment",
        description: "- **Dexterity Boost:** x1.2\n- **Dexterity Boost:** +10%\n- **Jump Boost:** +2\n- **Speed Boost:** +5%",
        stats: {
            DexterityBoost: 10,
            JumpBoost: 2,
            SpeedBoost: 5,
        },
        "perks": {},
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda27a",
            "cardUrl": "https://trello.com/c/25eEQWrG",
            "sectionId": "69214b9731723704c1eda27a"
        },
        "enchantmentTransforms": [
            {
                "scope": "stat",
                "stat": "DexterityBoost",
                "factor": 1.2
            }
        ],
        "ascended": false
    },
    burning: {
        id: "burning",
        name: "Burning",
        category: "Enchantment",
        description: "- **Fire Boost:** x1.2\n- **Fire Boost:** +10%",
        stats: {
            FireBoost: 10,
        },
        "perks": {},
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda1f6",
            "cardUrl": "https://trello.com/c/nsfRV5aC",
            "sectionId": "69214b9731723704c1eda1f6"
        },
        "enchantmentTransforms": [
            {
                "scope": "stat",
                "stat": "FireBoost",
                "factor": 1.2
            }
        ],
        "ascended": false
    },
    wet: {
        id: "wet",
        name: "Wet",
        category: "Enchantment",
        description: "- **Water Boost:** x1.2\n- **Water Boost:** +10%",
        stats: {
            WaterBoost: 10,
        },
        "perks": {},
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda278",
            "cardUrl": "https://trello.com/c/SSgCaQeN",
            "sectionId": "69214b9731723704c1eda278"
        },
        "enchantmentTransforms": [
            {
                "scope": "stat",
                "stat": "WaterBoost",
                "factor": 1.2
            }
        ],
        "ascended": false
    },
    earthen: {
        id: "earthen",
        name: "Earthen",
        category: "Enchantment",
        description: "- **Earth Boost:** x1.2\n- **Earth Boost:** +10%",
        stats: {
            EarthBoost: 10,
        },
        "perks": {},
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda2cc",
            "cardUrl": "https://trello.com/c/d7ErmaSh",
            "sectionId": "69214b9731723704c1eda2cc"
        },
        "enchantmentTransforms": [
            {
                "scope": "stat",
                "stat": "EarthBoost",
                "factor": 1.2
            }
        ],
        "ascended": false
    },
    magical: {
        id: "magical",
        name: "Magical",
        category: "Enchantment",
        description: "- **Magic Boost:** x1.2\n- **Magic Boost:** +10%",
        stats: {
            MagicBoost: 10,
        },
        "perks": {},
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda27c",
            "cardUrl": "https://trello.com/c/svAgg9vR",
            "sectionId": "69214b9731723704c1eda27c"
        },
        "enchantmentTransforms": [
            {
                "scope": "stat",
                "stat": "MagicBoost",
                "factor": 1.2
            }
        ],
        "ascended": false
    },
    cursed: {
        id: "cursed",
        name: "Cursed",
        category: "Enchantment",
        description: "- **Hex Boost:** x1.2\n- **Hex Boost:** +10%",
        stats: {
            HexBoost: 10,
        },
        "perks": {},
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda4e0",
            "cardUrl": "https://trello.com/c/12qbKv75",
            "sectionId": "69214b9731723704c1eda4e0"
        },
        "enchantmentTransforms": [
            {
                "scope": "stat",
                "stat": "HexBoost",
                "factor": 1.2
            }
        ],
        "ascended": false
    },
    windy: {
        id: "windy",
        name: "Windy",
        category: "Enchantment",
        description: "- **Air Boost:** x1.2\n- **Air Boost:** +10%",
        stats: {
            AirBoost: 10,
        },
        "perks": {},
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda4e4",
            "cardUrl": "https://trello.com/c/oztOUCDS",
            "sectionId": "69214b9731723704c1eda4e4"
        },
        "enchantmentTransforms": [
            {
                "scope": "stat",
                "stat": "AirBoost",
                "factor": 1.2
            }
        ],
        "ascended": false
    },
    enlightened: {
        id: "enlightened",
        name: "Enlightened",
        category: "Enchantment",
        description: "- **Holy Boost:** x1.2\n- **Holy Boost:** +10%",
        stats: {
            HolyBoost: 10,
        },
        "perks": {},
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda4de",
            "cardUrl": "https://trello.com/c/kmPZw6dH",
            "sectionId": "69214b9731723704c1eda4de"
        },
        "enchantmentTransforms": [
            {
                "scope": "stat",
                "stat": "HolyBoost",
                "factor": 1.2
            }
        ],
        "ascended": false
    },
    summoner: {
        id: "summoner",
        name: "Summoner's",
        category: "Enchantment",
        description: "- **Summon Boost:** x1.2\n- **Summon Boost:** +10%",
        stats: {
            SummonBoost: 10,
        },
        "perks": {},
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda4d6",
            "cardUrl": "https://trello.com/c/eip3YLdQ",
            "sectionId": "69214b9731723704c1eda4d6"
        },
        "enchantmentTransforms": [
            {
                "scope": "stat",
                "stat": "SummonBoost",
                "factor": 1.2
            }
        ],
        "ascended": false
    },
    hardened: {
        id: "hardened",
        name: "Hardened",
        category: "Enchantment",
        description: "- **Protection:** +7.5",
        stats: {
            Protection: 7.5,
        },
        "perks": {},
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda4d8",
            "cardUrl": "https://trello.com/c/jwJK1Db7",
            "sectionId": "69214b9731723704c1eda4d8"
        },
        "enchantmentTransforms": [],
        "ascended": false,
    },
    warded: {
        id: "warded",
        name: "Warded",
        category: "Enchantment",
        description: "- **Warding:** +30%",
        stats: {
            Warding: 30,
        },
        "perks": {},
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda4e6",
            "cardUrl": "https://trello.com/c/CGS3D5j3",
            "sectionId": "69214b9731723704c1eda4e6"
        },
        "enchantmentTransforms": [],
        "ascended": false,
    },
    tenacious: {
        id: "tenacious",
        name: "Tenacious",
        category: "Enchantment",
        description: "- **Tenacity:** +0.1",
        stats: {
            Tenacity: 0.1,
        },
        "perks": {},
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda4e2",
            "cardUrl": "https://trello.com/c/2nKwvNyw",
            "sectionId": "69214b9731723704c1eda4e2"
        },
        "enchantmentTransforms": [],
        "ascended": false,
    },
    insulated: {
        id: "insulated",
        name: "Insulated",
        category: "Enchantment",
        description: "- **Cold Resistance:** +100%\n- **Heat Resistance:** +100%",
        stats: {
            ColdResistance: 100,
            HeatResistance: 100,
        },
        "perks": {},
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda29c",
            "cardUrl": "https://trello.com/c/7pXjlDyX",
            "sectionId": "69214b9731723704c1eda29c"
        },
        "enchantmentTransforms": [],
        "ascended": false,
    },
    vampiric: {
        id: "vampiric",
        name: "Vampiric",
        category: "Enchantment",
        description: "- **Holy Defense:** -40%\n- **Lifesteal:** +1",
        stats: {
            HolyDefense: -40,
        },
        perks: {
            "lifesteal": 1
        },
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda292",
            "cardUrl": "https://trello.com/c/uYNdpQWx",
            "sectionId": "69214b9731723704c1eda292"
        },
        "enchantmentTransforms": [],
        "ascended": false,
    },
    tanky: {
        id: "tanky",
        name: "Tanky",
        category: "Enchantment",
        description: "- **Defense Boosts:** x1.5\n- **Physical Defense:** +10%\n- **Speed Boost:** -5%",
        stats: {
            PhysicalDefense: 10,
            SpeedBoost: -5,
        },
        "perks": {},
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda4d4",
            "cardUrl": "https://trello.com/c/jRIohuSp",
            "sectionId": "69214b9731723704c1eda4d4"
        },
        "enchantmentTransforms": [
            {
                "scope": "defense_boosts",
                "factor": 1.5
            }
        ],
        "ascended": false
    },
    fragile: {
        id: "fragile",
        name: "Fragile",
        category: "Enchantment",
        description: "- **Physical Defense:** -20%",
        stats: {
            PhysicalDefense: -20,
        },
        "perks": {},
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda230",
            "cardUrl": "https://trello.com/c/oETl20vu",
            "sectionId": "69214b9731723704c1eda230"
        },
        "enchantmentTransforms": [],
        "ascended": false,
    },
    worthless: {
        id: "worthless",
        name: "Worthless",
        category: "Enchantment",
        description: "- **Positive Stats:** x0.5\n- **Negative Stats:** x2",
        stats: {},
        "perks": {},
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda1f8",
            "cardUrl": "https://trello.com/c/23qnnvTL",
            "sectionId": "69214b9731723704c1eda1f8"
        },
        "enchantmentTransforms": [
            {
                "scope": "positive_stats",
                "factor": 0.5
            },
            {
                "scope": "negative_stats",
                "factor": 2
            }
        ],
        "ascended": false
    },
    thirsty: {
        id: "thirsty",
        name: "Thirsty",
        category: "Enchantment",
        description: "- **Physical Defense:** -5%",
        stats: {
            PhysicalDefense: -5,
        },
        "perks": {},
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda280",
            "cardUrl": "https://trello.com/c/QMFUd1i7",
            "sectionId": "69214b9731723704c1eda280"
        },
        "enchantmentTransforms": [],
        "ascended": false,
    },
    corroded: {
        id: "corroded",
        name: "Corroded",
        category: "Enchantment",
        description: "- **Warding:** -20%",
        stats: {
            Warding: -20,
        },
        "perks": {},
        "potencies": {},
        "source": {
            "cardId": "69214b9831723704c1edad10",
            "cardUrl": "https://trello.com/c/dF14LVAB",
            "sectionId": "69214b9831723704c1edad10"
        },
        "enchantmentTransforms": [],
        "ascended": false,
    },
    corrupt: {
        id: "corrupt",
        name: "Corrupt",
        category: "Enchantment",
        description: "- **Positive Stats:** x0\n- **Negative Stats:** x-2",
        "stats": {},
        "perks": {},
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda4da",
            "cardUrl": "https://trello.com/c/uwg7mcBG",
            "sectionId": "69214b9731723704c1eda4da"
        },
        "enchantmentTransforms": [
            {
                "scope": "positive_stats",
                "factor": 0
            },
            {
                "scope": "negative_stats",
                "factor": -2
            }
        ],
        "ascended": false
    },
    ////////////////ACD Enchantment ///////////////////////////
    quick: {
        id: "quick",
        name: "Quick",
        category: "Enchantment",
        description: "- **Speed Boost:** +5%\n- **Jump Boost:** +2\n- **Attack Speed:** +10%",
        stats: {
            AttackSpeed: 10,
            SpeedBoost: 5,
            JumpBoost: 2,
        },
        "perks": {},
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1edaab6",
            "cardUrl": "https://trello.com/c/TXocLP8g",
            "sectionId": "69214b9731723704c1edaab6"
        },
        "enchantmentTransforms": [],
        "ascended": true,
    },
    ferocious: {
        id: "ferocious",
        name: "Ferocious",
        category: "Enchantment",
        description: "- **Tenacity:** +0.05\n- **Ferocity:** +1",
        stats: {
            Tenacity: 0.05,
        },
        perks: {
            "ferocity": 1
        },
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1edaa8c",
            "cardUrl": "https://trello.com/c/CKVuJOVb",
            "sectionId": "69214b9731723704c1edaa8c"
        },
        "enchantmentTransforms": [],
        "ascended": true,
    },
    quenched: {
        id: "quenched",
        name: "Quenched",
        category: "Enchantment",
        description: "- **Physical Boost:** +5%\n- **Life Drinker:** +1",
        potencies: {},
        "stats": {
            "PhysicalBoost": 5
        },
        "perks": {
            "life_drinker": 1
        },
        "source": {
            "cardId": "69214b9731723704c1edaa78",
            "cardUrl": "https://trello.com/c/R3xf5FmX",
            "sectionId": "69214b9731723704c1edaa78"
        },
        "enchantmentTransforms": [],
        "ascended": true,
    },
    acidic: {
        id: "acidic",
        name: "Acidic",
        category: "Enchantment",
        description: "- **Hex Boost:** +3%\n- **Earth Boost:** +3%\n- **Melting Shred:** +1",
        potencies: {},
        "stats": {
            "HexBoost": 3,
            "EarthBoost": 3
        },
        "perks": {
            "melting_shred": 1
        },
        "source": {
            "cardId": "69214b9831723704c1edad12",
            "cardUrl": "https://trello.com/c/7rj8cq39",
            "sectionId": "69214b9831723704c1edad12"
        },
        "enchantmentTransforms": [],
        "ascended": true,
    },
    piercing: {
        id: "piercing",
        name: "Piercing",
        category: "Enchantment",
        description: "- **Armor Penetration:** +10",
        stats: {
            ArmorPenetration: 10,
        },
        "perks": {},
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1edaa7c",
            "cardUrl": "https://trello.com/c/vhMAAXz0",
            "sectionId": "69214b9731723704c1edaa7c"
        },
        "enchantmentTransforms": [],
        "ascended": true,
    },
    brawny: {
        id: "brawny",
        name: "Brawny",
        category: "Enchantment",
        description: "- **Physical Boost:** +5%\n- **Brawny:** +1",
        stats: {
            PhysicalBoost: 5,
        },
        perks: {
            brawny: 1,
        },
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1edaa64",
            "cardUrl": "https://trello.com/c/vSWjykOb",
            "sectionId": "69214b9731723704c1edaa64"
        },
        "enchantmentTransforms": [],
        "ascended": true,
    },
    warped: {
        id: "warped",
        name: "Warped",
        category: "Enchantment",
        description: "- **Overall Stats**: x0\n- **Perk Effectiveness:** +1",
        perks: {
            perk_effectiveness: 1,
        },
        "stats": {},
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1edaa60",
            "cardUrl": "https://trello.com/c/DTFLXyXn",
            "sectionId": "69214b9731723704c1edaa60"
        },
        "enchantmentTransforms": [
            {
                "scope": "overall_stats",
                "factor": 0
            }
        ],
        "ascended": true,
    },
    "berserking": {
        "id": "berserking",
        "name": "Berserking",
        "stats": {
            "PhysicalBoost": 20,
            "Protection": -10
        },
        "perks": {},
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda4dc",
            "cardUrl": "https://trello.com/c/08ndmdun",
            "sectionId": "69214b9731723704c1eda4dc"
        },
        "enchantmentTransforms": [
            {
                "scope": "stat",
                "stat": "PhysicalBoost",
                "factor": 1.2
            },
            {
                "scope": "positive_defenses",
                "factor": 0.5
            },
            {
                "scope": "negative_defenses",
                "factor": 2
            }
        ],
        "ascended": false,
        "description": "- **Physical Boost:** x1.2\n- **Physical Boost:** +20%\n- **Protection:** -10\n- **Positive Defenses:** x0.5\n- **Negative Defenses:** x2",
        "category": "Enchantment"
    },
    "sweet": {
        "id": "sweet",
        "name": "Sweet",
        "stats": {
            "MagicBoost": 5,
            "HolyBoost": 5,
            "SummonBoost": 5,
            "SpeedBoost": -7
        },
        "perks": {},
        "potencies": {},
        "source": {
            "cardId": "69214b9831723704c1edae38",
            "cardUrl": "https://trello.com/c/RYGPqb5J",
            "sectionId": "69214b9831723704c1edae38"
        },
        "enchantmentTransforms": [
            {
                "scope": "stat",
                "stat": "MagicBoost",
                "factor": 1.1
            },
            {
                "scope": "stat",
                "stat": "HolyBoost",
                "factor": 1.1
            },
            {
                "scope": "stat",
                "stat": "SummonBoost",
                "factor": 1.1
            }
        ],
        "ascended": false,
        "description": "- **Magic Boost:** x1.1\n- **Magic Boost:** +5%\n- **Holy Boost:** x1.1\n- **Holy Boost:** +5%\n- **Summon Boost:** x1.1\n- **Summon Boost:** +5%\n- **Speed Boost:** -7%",
        "category": "Enchantment"
    },
    "mythical": {
        "id": "mythical",
        "name": "Mythical",
        "stats": {},
        "perks": {},
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1edaa6c",
            "cardUrl": "https://trello.com/c/L2sYbjIz",
            "sectionId": "69214b9731723704c1edaa6c"
        },
        "enchantmentTransforms": [
            {
                "scope": "positive_stats",
                "factor": 2
            },
            {
                "scope": "negative_stats",
                "factor": 1.2
            },
            {
                "scope": "perks",
                "factor": 0
            }
        ],
        "ascended": true,
        "description": "- **Positive Stats:** x2\n- **Negative Stats:** x1.2\n- **Perks:** x0",
        "category": "Enchantment"
    },
    "flawless": {
        "id": "flawless",
        "name": "Flawless",
        "stats": {
            "JumpBoost": 1,
            "SpeedBoost": 2
        },
        "perks": {},
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1edaa74",
            "cardUrl": "https://trello.com/c/w71Fvekk",
            "sectionId": "69214b9731723704c1edaa74"
        },
        "enchantmentTransforms": [
            {
                "scope": "negative_stats",
                "factor": 0
            },
            {
                "scope": "positive_stats",
                "factor": 1.1
            }
        ],
        "ascended": true,
        "description": "- **Negative Stats:** x0\n- **Positive Stats:** x1.1\n- **Jump Boost:** +1\n- **Speed Boost:** +2%",
        "category": "Enchantment"
    },
    "blazing": {
        "id": "blazing",
        "name": "Blazing",
        "stats": {
            "FireBoost": 5
        },
        "perks": {
            "wildfire": 1
        },
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1edaaa2",
            "cardUrl": "https://trello.com/c/gxVvrIFu",
            "sectionId": "69214b9731723704c1edaaa2"
        },
        "enchantmentTransforms": [],
        "ascended": true,
        "description": "- **Fire Boost:** +5%\n- **Wildfire:** +1",
        "category": "Enchantment"
    },
    "raining": {
        "id": "raining",
        "name": "Raining",
        "stats": {
            "WaterBoost": 5
        },
        "perks": {
            "rainstorm": 1
        },
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1edaa6a",
            "cardUrl": "https://trello.com/c/VJHyGN7G",
            "sectionId": "69214b9731723704c1edaa6a"
        },
        "enchantmentTransforms": [],
        "ascended": true,
        "description": "- **Water Boost:** +5%\n- **Rainstorm:** +1",
        "category": "Enchantment"
    },
    "stone": {
        "id": "stone",
        "name": "Stone",
        "stats": {
            "EarthBoost": 5,
            "SpeedBoost": -5
        },
        "perks": {
            "stone_weapon": 1
        },
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1edaa66",
            "cardUrl": "https://trello.com/c/ZW8380f8",
            "sectionId": "69214b9731723704c1edaa66"
        },
        "enchantmentTransforms": [],
        "ascended": true,
        "description": "- **Earth Boost:** +5%\n- **Speed Boost:** -5%\n- **Stone Weapon:** +1",
        "category": "Enchantment"
    },
    "surging": {
        "id": "surging",
        "name": "Surging",
        "stats": {
            "MagicBoost": 5
        },
        "perks": {
            "magic_surge": 1
        },
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1edaa6e",
            "cardUrl": "https://trello.com/c/P4WXWyls",
            "sectionId": "69214b9731723704c1edaa6e"
        },
        "enchantmentTransforms": [],
        "ascended": true,
        "description": "- **Magic Boost:** +5%\n- **Magic Surge:** +1",
        "category": "Enchantment"
    },
    "eldritch": {
        "id": "eldritch",
        "name": "Eldritch",
        "stats": {},
        "perks": {
            "dark_one": 1
        },
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1edaa84",
            "cardUrl": "https://trello.com/c/I8i834oD",
            "sectionId": "69214b9731723704c1edaa84"
        },
        "enchantmentTransforms": [],
        "ascended": true,
        "description": "- **Dark One:** +1",
        "category": "Enchantment"
    },
    "tempestuous": {
        "id": "tempestuous",
        "name": "Tempestuous",
        "stats": {
            "AirBoost": 5
        },
        "perks": {
            "tempest": 1
        },
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1edaa70",
            "cardUrl": "https://trello.com/c/tqVRZHU5",
            "sectionId": "69214b9731723704c1edaa70"
        },
        "enchantmentTransforms": [],
        "ascended": true,
        "description": "- **Air Boost:** +5%\n- **Tempest:** +1",
        "category": "Enchantment"
    },
    "blessed": {
        "id": "blessed",
        "name": "Blessed",
        "stats": {
            "HolyBoost": 5,
            "WaterBoost": 5
        },
        "perks": {
            "heal_boost": 1
        },
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1edaaa0",
            "cardUrl": "https://trello.com/c/8hlq1lUx",
            "sectionId": "69214b9731723704c1edaaa0"
        },
        "enchantmentTransforms": [],
        "ascended": true,
        "description": "- **Heal Boost:** +1\n- **Holy Boost:** +5%\n- **Water Boost:** +5%",
        "category": "Enchantment"
    },
    "sacrificial": {
        "id": "sacrificial",
        "name": "Sacrificial",
        "stats": {
            "SummonBoost": 5
        },
        "perks": {
            "minion_absorption": 1
        },
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1edaa92",
            "cardUrl": "https://trello.com/c/19Un7Fm7",
            "sectionId": "69214b9731723704c1edaa92"
        },
        "enchantmentTransforms": [
            {
                "scope": "stat",
                "stat": "SummonBoost",
                "factor": 1.1
            }
        ],
        "ascended": true,
        "description": "- **Summon Boost:** 1.1x\n- **Summon Boost:** +5%\n- **Minion Absorption:** +1",
        "category": "Enchantment"
    },
    "wall_of": {
        "id": "wall_of",
        "name": "Wall of",
        "stats": {},
        "perks": {
            "wall": 1
        },
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1edaa90",
            "cardUrl": "https://trello.com/c/fwBGKVh3",
            "sectionId": "69214b9731723704c1edaa90"
        },
        "enchantmentTransforms": [],
        "ascended": true,
        "description": "- **Wall:** +1",
        "category": "Enchantment"
    },
    "spell_proof": {
        "id": "spell_proof",
        "name": "Spell Proof",
        "stats": {},
        "perks": {
            "hex_shield": 1
        },
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1edaa94",
            "cardUrl": "https://trello.com/c/qy4SKQ6X",
            "sectionId": "69214b9731723704c1edaa94"
        },
        "enchantmentTransforms": [],
        "ascended": true,
        "description": "- **Hex Shield:** +1",
        "category": "Enchantment"
    },
    "contained": {
        "id": "contained",
        "name": "Contained",
        "stats": {
            "ColdResistance": 20,
            "HeatResistance": 20
        },
        "perks": {
            "contained": 1
        },
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1edaa72",
            "cardUrl": "https://trello.com/c/FneO4uL1",
            "sectionId": "69214b9731723704c1edaa72"
        },
        "enchantmentTransforms": [],
        "ascended": true,
        "description": "- **Cold Resistance:** +20%\n- **Heat Resistance:** +20%\n- **Contained:** +1",
        "category": "Enchantment"
    },
    "necrotic": {
        "id": "necrotic",
        "name": "Necrotic",
        "stats": {
            "EarthDefense": 20,
            "HexDefense": 20
        },
        "perks": {
            "undead_might": 1
        },
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1edaaae",
            "cardUrl": "https://trello.com/c/cKOAElko",
            "sectionId": "69214b9731723704c1edaaae"
        },
        "enchantmentTransforms": [],
        "ascended": true,
        "description": "- **Earth Defense:** +20%\n- **Hex Defense:** +20%\n- **Undead Might:** +1",
        "category": "Enchantment"
    },
    "turtle_king_s": {
        "id": "turtle_king_s",
        "name": "Turtle King's",
        "stats": {
            "PhysicalDefense": 5,
            "MagicDefense": 5
        },
        "perks": {
            "turtle": 1
        },
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1edaaba",
            "cardUrl": "https://trello.com/c/oQ7Tpcpt",
            "sectionId": "69214b9731723704c1edaaba"
        },
        "enchantmentTransforms": [
            {
                "scope": "positive_base_defense_stats",
                "factor": 1.2
            }
        ],
        "ascended": true,
        "description": "- **Positive Base Defense Stats:** x1.2\n- **Physical Defense:** +5%\n- **Magic Defense:** +5%\n- **Turtle:** +1",
        "category": "Enchantment"
    },
    "frenzied": {
        "id": "frenzied",
        "name": "Frenzied",
        "stats": {
            "Protection": -2
        },
        "perks": {
            "frenzy": 1
        },
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1edaa88",
            "cardUrl": "https://trello.com/c/iCVRFXWv",
            "sectionId": "69214b9731723704c1edaa88"
        },
        "enchantmentTransforms": [],
        "ascended": true,
        "description": "- **Protection:** -2\n- **Frenzy:** +1",
        "category": "Enchantment"
    },
    "restored": {
        "id": "restored",
        "name": "Restored",
        "stats": {},
        "perks": {},
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1edaa7a",
            "cardUrl": "https://trello.com/c/8YQT6OvE",
            "sectionId": "69214b9731723704c1edaa7a"
        },
        "enchantmentTransforms": [
            {
                "scope": "negative_stats",
                "factor": -1
            }
        ],
        "ascended": true,
        "description": "- **Negative Stats**: x-1",
        "category": "Enchantment"
    },
    "candied": {
        "id": "candied",
        "name": "Candied",
        "stats": {
            "SummonBoost": 5
        },
        "perks": {
            "sweet_tooth": 1
        },
        "potencies": {},
        "source": {
            "cardId": "69214b9831723704c1edae3a",
            "cardUrl": "https://trello.com/c/MEXtsk0z",
            "sectionId": "69214b9831723704c1edae3a"
        },
        "enchantmentTransforms": [
            {
                "scope": "stat",
                "stat": "SummonBoost",
                "factor": 1.2
            }
        ],
        "ascended": true,
        "description": "- **Summon Boost:** x1.2\n- **Summon Boost:** +5%\n- **Sweet Tooth:** +1",
        "category": "Enchantment"
    },
};
