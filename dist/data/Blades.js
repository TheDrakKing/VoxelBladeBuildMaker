let images = "../image/blades/";
export const Blades = {
    basic_blade: {
        id: "basic_blade",
        name: "Basic Blade",
        tier: 1,
        category: "Blade",
        type: "Medium Blade",
        description: "First Blade",
        attackSpeed: 1,
        damageScalings: {
            Physical: 0.15,
            Dexterity: 0.15,
        },
        damageTypes: {
            Physical: 1,
        },
        img: "../image/blades/basicblade.png",
        "stats": {},
        "perks": {},
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda180",
            "cardUrl": "https://trello.com/c/EWVXCGC2",
            "sectionId": "69214b9731723704c1eda180"
        },
    },
    greatsword_blade: {
        id: "greatsword_blade",
        name: "Greatsword Blade",
        tier: 2,
        category: "Blade",
        type: "Heavy Blade",
        attackSpeed: 0.9,
        stats: {
            PhysicalBoost: 5,
        },
        damageScalings: {
            Physical: 0.4,
        },
        damageTypes: {
            Physical: 1,
        },
        img: "",
        "perks": {},
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda18e",
            "cardUrl": "https://trello.com/c/5CzAwUqC",
            "sectionId": "69214b9731723704c1eda18e"
        },
    },
    sharp_blade: {
        id: "sharp_blade",
        name: "Sharp Blade",
        tier: 2,
        category: "Blade",
        type: "Medium Blade",
        attackSpeed: 1,
        stats: {
            PhysicalBoost: 5,
        },
        damageScalings: {
            Physical: 0.3,
            Dexterity: 0.3,
        },
        damageTypes: {
            Physical: 1,
        },
        img: "",
        "perks": {},
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda192",
            "cardUrl": "https://trello.com/c/PXiuED3J",
            "sectionId": "69214b9731723704c1eda192"
        },
    },
    dagger_blade: {
        id: "dagger_blade",
        name: "Dagger Blade",
        tier: 2,
        category: "Blade",
        type: "Small Blade",
        attackSpeed: 1.1,
        stats: {
            DexterityBoost: 5,
        },
        damageScalings: {
            Physical: 0.3,
            Dexterity: 0.3,
        },
        damageTypes: {
            Physical: 1,
        },
        img: "",
        "perks": {},
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda194",
            "cardUrl": "https://trello.com/c/Eb4EN3M2",
            "sectionId": "69214b9731723704c1eda194"
        },
    },
    mage_blade: {
        id: "mage_blade",
        name: "Mage Blade",
        tier: 2,
        category: "Blade",
        type: "Medium Blade",
        attackSpeed: 1,
        stats: {
            MagicBoost: 5,
        },
        damageScalings: {
            Magic: 0.4,
        },
        damageTypes: {
            Magic: 1,
        },
        img: "",
        "perks": {},
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda190",
            "cardUrl": "https://trello.com/c/4pRSnqlo",
            "sectionId": "69214b9731723704c1eda190"
        },
    },
    holy_blade: {
        id: "holy_blade",
        name: "Holy Blade",
        tier: 2,
        category: "Blade",
        type: "Medium Blade",
        attackSpeed: 1,
        stats: {
            HolyBoost: 10,
        },
        damageScalings: {
            Magic: 0.3,
            Holy: 0.3,
        },
        damageTypes: {
            Magic: 0.3,
            Holy: 0.7,
        },
        perks: {
            blessing: 1,
        },
        img: "",
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda23e",
            "cardUrl": "https://trello.com/c/GrEjXzcG",
            "sectionId": "69214b9731723704c1eda23e"
        },
    },
    hex_blade: {
        id: "hex_blade",
        name: "Hex Blade",
        tier: 2,
        category: "Blade",
        type: "Medium Blade",
        attackSpeed: 1,
        stats: {
            HexBoost: 10,
        },
        damageScalings: {
            Magic: 0.3,
            Hex: 0.3,
        },
        damageTypes: {
            Magic: 0.3,
            Hex: 0.7,
        },
        perks: {
            weakening: 1,
        },
        img: "",
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda4ec",
            "cardUrl": "https://trello.com/c/ppEHp44S",
            "sectionId": "69214b9731723704c1eda4ec"
        },
    },
    air_blade: {
        id: "air_blade",
        name: "Air Blade",
        tier: 2,
        category: "Blade",
        type: "Medium Blade",
        attackSpeed: 1.1,
        damageScalings: {
            Dexterity: 0.3,
            Air: 0.3,
        },
        damageTypes: {
            Air: 0.7,
            Magic: 0.3,
        },
        perks: {
            tailwind: 1,
        },
        img: "",
        "stats": {
            "AirBoost": 10
        },
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda2a8",
            "cardUrl": "https://trello.com/c/0aV2BY7x",
            "sectionId": "69214b9731723704c1eda2a8"
        },
    },
    fire_blade: {
        id: "fire_blade",
        name: "Fire Blade",
        tier: 2,
        category: "Blade",
        type: "Medium Blade",
        attackSpeed: 1,
        stats: {
            FireBoost: 10,
        },
        damageScalings: {
            Magic: 0.3,
            Fire: 0.3,
        },
        damageTypes: {
            Magic: 0.3,
            Fire: 0.7,
        },
        perks: {
            ignition: 1,
        },
        img: "",
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda2ee",
            "cardUrl": "https://trello.com/c/jhM2bIMv",
            "sectionId": "69214b9731723704c1eda2ee"
        },
    },
    water_blade: {
        id: "water_blade",
        name: "Water Blade",
        tier: 2,
        category: "Blade",
        type: "Medium Blade",
        attackSpeed: 1.1,
        stats: {
            WaterBoost: 10,
        },
        damageScalings: {
            Magic: 0.3,
            Water: 0.3,
        },
        damageTypes: {
            Magic: 0.3,
            Water: 0.7,
        },
        perks: {
            extinguish: 1,
        },
        img: "",
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda554",
            "cardUrl": "https://trello.com/c/ShcOBWDH",
            "sectionId": "69214b9731723704c1eda554"
        },
    },
    earth_blade: {
        id: "earth_blade",
        name: "Earth Blade",
        tier: 2,
        category: "Blade",
        type: "Medium Blade",
        attackSpeed: 0.85,
        stats: {
            EarthBoost: 10,
        },
        damageScalings: {
            Earth: 0.35,
            Physical: 0.35,
        },
        damageTypes: {
            Earth: 0.7,
            Physical: 0.3,
        },
        perks: {
            quake: 1,
        },
        img: "",
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda552",
            "cardUrl": "https://trello.com/c/kPV3BKA2",
            "sectionId": "69214b9731723704c1eda552"
        },
    },
    executioners_blade: {
        id: "executioners_blade",
        name: "Executioners Blade",
        tier: 3,
        category: "Blade",
        type: "Heavy Blade",
        attackSpeed: 0.85,
        stats: {
            PhysicalBoost: 8,
            PhysicalDefense: 5,
        },
        damageScalings: {
            Physical: 0.5,
        },
        damageTypes: {
            Physical: 1.1,
        },
        perks: {
            executioner: 1,
        },
        img: "",
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda592",
            "cardUrl": "https://trello.com/c/Fi20AnxQ",
            "sectionId": "69214b9731723704c1eda592"
        },
    },
    iron_hammer: {
        id: "iron_hammer",
        name: "Iron Hammer",
        tier: 3,
        category: "Blade",
        type: "Hammer Blade",
        attackSpeed: 0.9,
        stats: {
            Tenacity: 0.2,
            PhysicalDefense: 8,
        },
        damageScalings: {
            Physical: 0.5,
        },
        damageTypes: {
            Physical: 1,
        },
        perks: {
            shattering_justice: 1,
        },
        img: "",
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda594",
            "cardUrl": "https://trello.com/c/BA9hrQJ8",
            "sectionId": "69214b9731723704c1eda594"
        },
    },
    katana_blade: {
        id: "katana_blade",
        name: "Katana Blade",
        tier: 3,
        category: "Blade",
        type: "Medium Blade",
        attackSpeed: 1.2,
        stats: {
            PhysicalBoost: 5,
            DexterityBoost: 5,
        },
        damageScalings: {
            Physical: 0.4,
            Dexterity: 0.4,
        },
        damageTypes: {
            Physical: 1,
        },
        perks: {
            parry: 1,
            flash_strike: 1,
        },
        img: "",
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda4e8",
            "cardUrl": "https://trello.com/c/jWsgnjwo",
            "sectionId": "69214b9731723704c1eda4e8"
        },
    },
    jagged_blade: {
        id: "jagged_blade",
        name: "Jagged Blade",
        tier: 3,
        category: "Blade",
        type: "Medium Blade",
        attackSpeed: 1,
        stats: {
            PhysicalBoost: 10,
        },
        damageScalings: {
            Physical: 0.5,
        },
        damageTypes: {
            Physical: 1,
        },
        perks: {
            serrated_edge: 1,
        },
        potencies: {
            bleedpotency: 4,
        },
        img: "",
        "source": {
            "cardId": "69214b9731723704c1eda4f2",
            "cardUrl": "https://trello.com/c/g2VWkLyt",
            "sectionId": "69214b9731723704c1eda4f2"
        },
    },
    sharp_dagger_blade: {
        id: "sharp_dagger_blade",
        name: "Sharp Dagger Blade",
        tier: 3,
        category: "Blade",
        type: "Small Blade",
        attackSpeed: 1.1,
        stats: {
            "DexterityBoost": 10,
            "SpeedBoost": 5
        },
        damageScalings: {
            Dexterity: 0.5,
        },
        damageTypes: {
            Physical: 1,
        },
        perks: {
            vital_strikes: 1,
        },
        img: "",
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda596",
            "cardUrl": "https://trello.com/c/u0Q9vWfN",
            "sectionId": "69214b9731723704c1eda596"
        },
    },
    agile_blade: {
        id: "agile_blade",
        name: "Agile Blade",
        tier: 3,
        category: "Blade",
        type: "Medium Blade",
        attackSpeed: 1.2,
        stats: {
            DexterityBoost: 5,
            PhysicalBoost: 5,
        },
        damageScalings: {
            Dexterity: 0.4,
            Physical: 0.4,
        },
        damageTypes: {
            Physical: 1,
        },
        perks: {
            sharp_crits: 1,
        },
        img: "",
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda598",
            "cardUrl": "https://trello.com/c/6mfkhmzs",
            "sectionId": "69214b9731723704c1eda598"
        },
    },
    great_mage_blade: {
        id: "great_mage_blade",
        name: "Great Mage Blade",
        tier: 3,
        category: "Blade",
        type: "Heavy Blade",
        attackSpeed: 0.9,
        stats: {
            MagicBoost: 7,
            PhysicalDefense: 5,
        },
        damageScalings: {
            Magic: 0.5,
        },
        damageTypes: {
            Magic: 1,
        },
        perks: {
            magic_guard: 1,
        },
        img: "",
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda58e",
            "cardUrl": "https://trello.com/c/bO4myUFv",
            "sectionId": "69214b9731723704c1eda58e"
        },
    },
    enchanted_blade: {
        id: "enchanted_blade",
        name: "Enchanted Blade",
        tier: 3,
        category: "Blade",
        type: "Medium Blade",
        attackSpeed: 1,
        stats: {
            MagicBoost: 10,
        },
        damageScalings: {
            Magic: 0.5,
        },
        damageTypes: {
            Magic: 1,
        },
        perks: {
            royal_finisher: 1,
        },
        img: "",
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda590",
            "cardUrl": "https://trello.com/c/f9ac0aJa",
            "sectionId": "69214b9731723704c1eda590"
        },
    },
    radiant_edge: {
        id: "radiant_edge",
        name: "Radiant Edge",
        tier: 3,
        category: "Blade",
        type: "Small Blade",
        attackSpeed: 1.1,
        stats: {
            "SummonBoost": 5,
            "HolyBoost": 10,
            "DexterityBoost": 5
        },
        damageScalings: {
            Holy: 0.4,
            Dexterity: 0.4,
        },
        damageTypes: {
            Holy: 0.7,
            Magic: 0.3,
        },
        perks: {
            radiance: 1,
        },
        img: "",
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda59a",
            "cardUrl": "https://trello.com/c/248W9p2p",
            "sectionId": "69214b9731723704c1eda59a"
        },
    },
    pure_blade: {
        id: "pure_blade",
        name: "Pure Blade",
        tier: 3,
        category: "Blade",
        type: "Medium Blade",
        attackSpeed: 1,
        stats: {
            HolyBoost: 15,
        },
        damageScalings: {
            Holy: 0.4,
            Magic: 0.4,
        },
        damageTypes: {
            Holy: 1,
        },
        perks: {
            blessing: 2,
        },
        img: "",
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda59c",
            "cardUrl": "https://trello.com/c/BWvSKFbM",
            "sectionId": "69214b9731723704c1eda59c"
        },
    },
    skull_hammer: {
        id: "skull_hammer",
        name: "Skull Hammer",
        tier: 3,
        category: "Blade",
        type: "Hammer Blade",
        attackSpeed: 1,
        stats: {
            "SummonBoost": 10,
            "PhysicalDefense": 8,
            "HexBoost": 10
        },
        damageScalings: {
            Hex: 0.35,
            Physical: 0.35,
            Summon: 0.1,
        },
        damageTypes: {
            Hex: 0.5,
            Physical: 0.5,
        },
        perks: {
            revel_in_death: 1,
        },
        img: "",
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda59e",
            "cardUrl": "https://trello.com/c/M1kTI0gX",
            "sectionId": "69214b9731723704c1eda59e"
        },
    },
    hexing_cleaver_blade: {
        id: "hexing_cleaver_blade",
        name: "Hexing Cleaver Blade",
        tier: 3,
        category: "Blade",
        type: "Medium Blade",
        attackSpeed: 1,
        stats: {
            MagicBoost: 5,
            HexBoost: 10,
        },
        damageScalings: {
            Hex: 0.4,
            Magic: 0.4,
        },
        damageTypes: {
            Hex: 0.7,
            Magic: 0.3,
        },
        perks: {
            weakening: 2,
        },
        img: "",
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda5a0",
            "cardUrl": "https://trello.com/c/1dUlO2Ri",
            "sectionId": "69214b9731723704c1eda5a0"
        },
    },
    gust_blade: {
        id: "gust_blade",
        name: "Gust Blade",
        tier: 3,
        category: "Blade",
        type: "Small Blade",
        attackSpeed: 1.1,
        stats: {
            "DexterityBoost": 7,
            "AirBoost": 7
        },
        damageScalings: {
            Air: 0.4,
            Dexterity: 0.4,
        },
        damageTypes: {
            Air: 0.7,
            Magic: 0.3,
        },
        perks: {
            tailwind: 2,
        },
        img: "",
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda2aa",
            "cardUrl": "https://trello.com/c/V63toHAW",
            "sectionId": "69214b9731723704c1eda2aa"
        },
    },
    storm_razor: {
        id: "storm_razor",
        name: "Storm Razor",
        tier: 3,
        category: "Blade",
        type: "Medium Blade",
        attackSpeed: 1.1,
        stats: {
            "MagicBoost": 4,
            "DexterityBoost": 4,
            "AirBoost": 4
        },
        damageScalings: {
            Air: 0.35,
            Magic: 0.35,
            Dexterity: 0.35,
        },
        damageTypes: {
            Air: 0.5,
            Magic: 0.5,
        },
        perks: {
            stormcaller: 1,
        },
        img: "",
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda2ac",
            "cardUrl": "https://trello.com/c/GPOU9495",
            "sectionId": "69214b9731723704c1eda2ac"
        },
    },
    flame_dagger: {
        id: "flame_dagger",
        name: "Flame Dagger",
        tier: 3,
        category: "Blade",
        type: "Small Blade",
        attackSpeed: 1,
        stats: {
            FireBoost: 10,
            DexterityBoost: 10,
        },
        damageScalings: {
            Fire: 0.4,
            Dexterity: 0.4,
        },
        damageTypes: {
            Fire: 0.7,
            Magic: 0.3,
        },
        perks: {
            ignition: 1,
            kindling: 1,
        },
        img: "",
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda5a2",
            "cardUrl": "https://trello.com/c/liDTNyvr",
            "sectionId": "69214b9731723704c1eda5a2"
        },
    },
    flame_greatblade: {
        id: "flame_greatblade",
        name: "Flame Greatblade",
        tier: 3,
        category: "Blade",
        type: "Heavy Blade",
        attackSpeed: 1,
        stats: {
            FireBoost: 10,
            MagicBoost: 5,
        },
        damageScalings: {
            Fire: 0.4,
            Magic: 0.4,
        },
        damageTypes: {
            Fire: 0.7,
            Magic: 0.3,
        },
        perks: {
            ignition: 2,
        },
        img: "",
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda5a4",
            "cardUrl": "https://trello.com/c/arZ0uOHB",
            "sectionId": "69214b9731723704c1eda5a4"
        },
    },
    ocean_blade: {
        id: "ocean_blade",
        name: "Ocean Blade",
        tier: 3,
        category: "Blade",
        type: "Medium Blade",
        attackSpeed: 1.1,
        stats: {
            MagicBoost: 5,
            WaterBoost: 10,
        },
        damageScalings: {
            Water: 0.4,
            Magic: 0.4,
        },
        damageTypes: {
            Water: 0.7,
            Magic: 0.3,
        },
        perks: {
            extinguish: 2,
        },
        img: "",
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda5a8",
            "cardUrl": "https://trello.com/c/nXnLQdJm",
            "sectionId": "69214b9731723704c1eda5a8"
        },
    },
    ice_blade: {
        id: "ice_blade",
        name: "Ice Blade",
        tier: 3,
        category: "Blade",
        type: "Medium Blade",
        attackSpeed: 1,
        stats: {
            HeatResistance: 50,
            WaterBoost: 7,
            PhysicalBoost: 7,
        },
        damageScalings: {
            Water: 0.4,
            Physical: 0.4,
        },
        damageTypes: {
            Water: 0.5,
            Physical: 0.5,
        },
        perks: {
            frostbite: 1,
        },
        img: "",
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda5a6",
            "cardUrl": "https://trello.com/c/XO5tqnE1",
            "sectionId": "69214b9731723704c1eda5a6"
        },
    },
    enchanted_lodestone_hammer: {
        id: "enchanted_lodestone_hammer",
        name: "Enchanted Lodestone Hammer",
        tier: 3,
        category: "Blade",
        type: "Hammer Blade",
        attackSpeed: 0.9,
        stats: {
            EarthBoost: 10,
            MagicBoost: 8,
        },
        damageScalings: {
            Earth: 0.55,
            Magic: 0.55,
        },
        damageTypes: {
            Earth: 0.5,
            Magic: 0.5,
        },
        perks: {
            gravity_well: 1,
        },
        img: "",
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda5aa",
            "cardUrl": "https://trello.com/c/NrNSoGWm",
            "sectionId": "69214b9731723704c1eda5aa"
        },
    },
    earth_greatblade: {
        id: "earth_greatblade",
        name: "Earth Greatblade",
        tier: 3,
        category: "Blade",
        type: "Heavy Blade",
        attackSpeed: 0.8,
        stats: {
            PhysicalDefense: 5,
            EarthBoost: 5,
            PhysicalBoost: 5,
        },
        damageScalings: {
            Earth: 0.45,
            Physical: 0.45,
        },
        damageTypes: {
            Earth: 0.7,
            Physical: 0.3,
        },
        perks: {
            quake: 2,
        },
        img: "",
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda5ac",
            "cardUrl": "https://trello.com/c/DJRyhAkt",
            "sectionId": "69214b9731723704c1eda5ac"
        },
    },
    scourgers_blade: {
        id: "scourgers_blade",
        name: "Scourgers Blade",
        tier: 4,
        category: "Blade",
        type: "Heavy Blade",
        attackSpeed: 0.8,
        stats: {
            PhysicalDefense: 5,
            PhysicalBoost: 15,
            Warding: 20,
        },
        damageScalings: {
            Physical: 0.7,
        },
        damageTypes: {
            Physical: 0.9,
            True: 0.3,
        },
        perks: {
            scourge: 1,
        },
        img: "../image/blades/scourgers_blade.png",
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda5f2",
            "cardUrl": "https://trello.com/c/A6bt8Vib",
            "sectionId": "69214b9731723704c1eda5f2"
        },
    },
    zweihander_blade: {
        id: "zweihander_blade",
        name: "Zweihander Blade",
        tier: 4,
        category: "Blade",
        type: "Heavy Blade",
        attackSpeed: 0.8,
        stats: {
            "Protection": 5,
            "PhysicalDefense": 3,
            "PhysicalBoost": 10,
            "SpeedBoost": 2
        },
        damageScalings: {
            Physical: 0.55,
            Dexterity: 0.55,
        },
        damageTypes: {
            Physical: 1,
        },
        perks: {
            highlander: 1,
        },
        img: "../image/blades/zweihander_blade.png",
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda5f0",
            "cardUrl": "https://trello.com/c/nI176T4e",
            "sectionId": "69214b9731723704c1eda5f0"
        },
    },
    gilded_hammer: {
        id: "gilded_hammer",
        name: "Gilded Hammer",
        tier: 4,
        category: "Blade",
        type: "Hammer Blade",
        attackSpeed: 0.8,
        stats: {
            Tenacity: 0.2,
            PhysicalDefense: 10,
            PhysicalBoost: 4,
        },
        damageScalings: {
            Physical: 0.8,
        },
        damageTypes: {
            Physical: 1,
        },
        perks: {
            aggressive_personality: 1,
        },
        img: "",
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda5f6",
            "cardUrl": "https://trello.com/c/v886wIvh",
            "sectionId": "69214b9731723704c1eda5f6"
        },
    },
    dark_steel_mace: {
        id: "dark_steel_mace",
        name: "Dark Steel Mace",
        tier: 4,
        category: "Blade",
        type: "Hammer Blade",
        attackSpeed: 1,
        stats: {
            PhysicalDefense: 5,
            DexterityBoost: 5,
            PhysicalBoost: 5,
        },
        damageScalings: {
            Dexterity: 0.55,
            Physical: 0.55,
        },
        damageTypes: {
            Physical: 1,
        },
        perks: {
            hemorrhage: 1,
        },
        potencies: {
            bleedpotency: 3,
        },
        img: "../image/blades/dark_steel_mace.png",
        "source": {
            "cardId": "69214b9731723704c1eda5f4",
            "cardUrl": "https://trello.com/c/orruy01N",
            "sectionId": "69214b9731723704c1eda5f4"
        },
    },
    serrated_blade: {
        id: "serrated_blade",
        name: "Serrated Blade",
        tier: 4,
        category: "Blade",
        type: "Heavy Blade",
        attackSpeed: 0.9,
        stats: {
            PhysicalBoost: 10,
            DexterityBoost: 2,
            Protection: 5,
        },
        damageScalings: {
            Physical: 0.7,
        },
        damageTypes: {
            Physical: 1.1,
        },
        perks: {
            vicious_edge: 1,
        },
        potencies: {
            bleedpotency: 3,
        },
        img: "../image/blades/serrated_blade.png",
        "source": {
            "cardId": "69214b9731723704c1eda4f0",
            "cardUrl": "https://trello.com/c/sPPflHll",
            "sectionId": "69214b9731723704c1eda4f0"
        },
    },
    bloodied_needle: {
        id: "bloodied_needle",
        name: "Bloodied Needle",
        tier: 4,
        category: "Blade",
        type: "Medium Blade",
        attackSpeed: 1.1,
        stats: {
            PhysicalBoost: 5,
            DexterityBoost: 5,
            MagicBoost: 5,
        },
        damageScalings: {
            Physical: 0.45,
            Dexterity: 0.45,
            Magic: 0.45,
        },
        damageTypes: {
            Physical: 0.6,
            Magic: 0.4,
        },
        perks: {
            bloodlust: 1,
        },
        potencies: {
            bleedpotency: 3,
        },
        img: "../image/blades/bloodied_needle.png",
        "source": {
            "cardId": "69214b9731723704c1eda4f4",
            "cardUrl": "https://trello.com/c/HbIcZSoI",
            "sectionId": "69214b9731723704c1eda4f4"
        },
    },
    bejeweled_blade: {
        id: "bejeweled_blade",
        name: "Bejeweled Blade",
        tier: 4,
        category: "Blade",
        type: "Medium Blade",
        attackSpeed: 1.2,
        stats: {
            DexterityBoost: 15,
            PhysicalBoost: 5,
        },
        damageScalings: {
            Dexterity: 0.55,
            Physical: 0.55,
        },
        damageTypes: {
            Physical: 1,
        },
        perks: {
            royal_parry: 1,
            parry: 1,
        },
        img: "",
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda5ec",
            "cardUrl": "https://trello.com/c/qOyrvLaZ",
            "sectionId": "69214b9731723704c1eda5ec"
        },
    },
    shadow_blade: {
        id: "shadow_blade",
        name: "Shadow Blade",
        tier: 4,
        category: "Blade",
        type: "Medium Blade",
        attackSpeed: 1.1,
        stats: {
            PhysicalBoost: 13,
            DexterityBoost: 10,
        },
        damageScalings: {
            Physical: 0.55,
            Dexterity: 0.55,
        },
        damageTypes: {
            Physical: 1,
        },
        perks: {
            concealed_edge: 1,
        },
        img: "",
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda5ee",
            "cardUrl": "https://trello.com/c/UxM5MVSz",
            "sectionId": "69214b9731723704c1eda5ee"
        },
    },
    kings_dagger_blade: {
        id: "kings_dagger_blade",
        name: "Kings Dagger Blade",
        tier: 4,
        category: "Blade",
        type: "Small Blade",
        attackSpeed: 1.1,
        stats: {
            "DexterityBoost": 15,
            "SpeedBoost": 5
        },
        damageScalings: {
            Dexterity: 0.7,
        },
        damageTypes: {
            Physical: 1,
        },
        perks: {
            golden_crits: 1,
        },
        img: "",
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda5f8",
            "cardUrl": "https://trello.com/c/dUVeptFk",
            "sectionId": "69214b9731723704c1eda5f8"
        },
    },
    beastial_dagger_blade: {
        id: "beastial_dagger_blade",
        name: "Beastial Dagger Blade",
        tier: 4,
        category: "Blade",
        type: "Small Blade",
        attackSpeed: 1.1,
        stats: {
            "DexterityBoost": 10,
            "JumpBoost": 2,
            "SpeedBoost": 7
        },
        damageScalings: {
            Dexterity: 0.55,
            Physical: 0.55,
        },
        damageTypes: {
            Physical: 1,
        },
        perks: {
            beastial_rage: 1,
        },
        img: "../image/blades/beastial_dagger_blade.png",
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda5fa",
            "cardUrl": "https://trello.com/c/qIq0NtPO",
            "sectionId": "69214b9731723704c1eda5fa"
        },
    },
    duelists_needle: {
        id: "duelists_needle",
        name: "Duelists Needle",
        tier: 4,
        category: "Blade",
        type: "Medium Blade",
        attackSpeed: 1,
        stats: {
            "DexterityBoost": 15,
            "SpeedBoost": 5
        },
        damageScalings: {
            Dexterity: 0.7,
        },
        damageTypes: {
            Physical: 1,
        },
        perks: {
            piercer: 1,
        },
        img: "",
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda5fe",
            "cardUrl": "https://trello.com/c/5w6hWyec",
            "sectionId": "69214b9731723704c1eda5fe"
        },
    },
    crude_blade: {
        id: "crude_blade",
        name: "Crude Blade",
        tier: 4,
        category: "Blade",
        type: "Medium Blade",
        attackSpeed: 1.1,
        stats: {
            PhysicalBoost: 10,
            DexterityBoost: 10,
        },
        damageScalings: {
            Physical: 0.55,
            Dexterity: 0.55,
        },
        damageTypes: {
            Physical: 1,
        },
        perks: {
            savage_combo: 1,
        },
        img: "",
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda5fc",
            "cardUrl": "https://trello.com/c/gvrBaCWN",
            "sectionId": "69214b9731723704c1eda5fc"
        },
    },
    grandmagic_greatblade: {
        id: "grandmagic_greatblade",
        name: "Grandmagic Greatblade",
        tier: 4,
        category: "Blade",
        type: "Heavy Blade",
        attackSpeed: 0.9,
        stats: {
            MagicBoost: 10,
            PhysicalDefense: 5,
            Warding: 20,
        },
        damageScalings: {
            Magic: 0.7,
        },
        damageTypes: {
            Magic: 1,
        },
        perks: {
            grandmagic_guard: 1,
        },
        img: "",
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda600",
            "cardUrl": "https://trello.com/c/DWb0XQhJ",
            "sectionId": "69214b9731723704c1eda600"
        },
    },
    great_mage_core: {
        id: "great_mage_core",
        name: "Great Mage Core",
        tier: 4,
        category: "Blade",
        type: "Hammer Blade",
        attackSpeed: 1.1,
        stats: {
            "MagicBoost": 15,
            "SpeedBoost": 2
        },
        damageScalings: {
            Magic: 0.7,
        },
        damageTypes: {
            Magic: 1,
        },
        perks: {
            artillery_mage: 1,
            glyph_conduit: 1,
        },
        img: "",
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda602",
            "cardUrl": "https://trello.com/c/eyTHtPq4",
            "sectionId": "69214b9731723704c1eda602"
        },
    },
    spellbinder_rapier: {
        id: "spellbinder_rapier",
        name: "Spellbinder Rapier",
        tier: 4,
        category: "Blade",
        type: "Medium Blade",
        attackSpeed: 1,
        stats: {
            MagicBoost: 15,
            DexterityBoost: 5,
        },
        damageScalings: {
            Magic: 0.55,
            Dexterity: 0.55,
        },
        damageTypes: {
            Magic: 1,
        },
        perks: {
            spell_piercer: 1,
        },
        img: "",
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda604",
            "cardUrl": "https://trello.com/c/WA9Jt5Bv",
            "sectionId": "69214b9731723704c1eda604"
        },
    },
    curved_magic_blade: {
        id: "curved_magic_blade",
        name: "Curved Magic Blade",
        tier: 4,
        category: "Blade",
        type: "Medium Blade",
        attackSpeed: 1,
        stats: {
            MagicBoost: 20,
        },
        damageScalings: {
            Magic: 0.7,
        },
        damageTypes: {
            Magic: 1,
        },
        perks: {
            royal_finisher: 1,
            runic_blades: 1,
        },
        img: "",
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda606",
            "cardUrl": "https://trello.com/c/4OitWw65",
            "sectionId": "69214b9731723704c1eda606"
        },
    },
    divine_edge: {
        id: "divine_edge",
        name: "Divine Edge",
        tier: 4,
        category: "Blade",
        type: "Small Blade",
        attackSpeed: 1.1,
        stats: {
            HolyBoost: 15,
            DexterityBoost: 10,
        },
        damageScalings: {
            Holy: 0.55,
            Dexterity: 0.55,
        },
        damageTypes: {
            Holy: 0.7,
            Magic: 0.3,
        },
        perks: {
            radiance: 1,
            divinity: 1,
        },
        img: "",
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda5ae",
            "cardUrl": "https://trello.com/c/gRTTu2cr",
            "sectionId": "69214b9731723704c1eda5ae"
        },
    },
    radiant_hammer: {
        id: "radiant_hammer",
        name: "Radiant Hammer",
        tier: 4,
        category: "Blade",
        type: "Hammer Blade",
        attackSpeed: 0.9,
        stats: {
            "SummonBoost": 10,
            "HolyBoost": 10,
            "Warding": 20
        },
        damageScalings: {
            Holy: 0.5,
            Physical: 0.5,
            Summon: 0.2,
        },
        damageTypes: {
            Holy: 0.7,
            Physical: 0.3,
        },
        perks: {
            divine_intervention: 1,
        },
        img: "",
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda5b0",
            "cardUrl": "https://trello.com/c/nxZXbIvU",
            "sectionId": "69214b9731723704c1eda5b0"
        },
    },
    hallowed_blade: {
        id: "hallowed_blade",
        name: "Hallowed Blade",
        tier: 4,
        category: "Blade",
        type: "Heavy Blade",
        attackSpeed: 1,
        stats: {
            HolyBoost: 15,
            Warding: 20,
        },
        damageScalings: {
            Holy: 0.7,
        },
        damageTypes: {
            Holy: 1,
        },
        perks: {
            blessing: 1,
            light_bearer: 1,
        },
        img: "",
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda5b2",
            "cardUrl": "https://trello.com/c/CJBJiIKA",
            "sectionId": "69214b9731723704c1eda5b2"
        },
    },
    angels_blade: {
        id: "angels_blade",
        name: "Angels Blade",
        tier: 4,
        category: "Blade",
        type: "Medium Blade",
        attackSpeed: 1,
        stats: {
            HolyBoost: 15,
            MagicBoost: 10,
        },
        damageScalings: {
            Holy: 0.55,
            Magic: 0.55,
        },
        damageTypes: {
            Holy: 0.5,
            Magic: 0.5,
        },
        perks: {
            sacred_grounds: 1,
        },
        img: "",
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda5b4",
            "cardUrl": "https://trello.com/c/8HGfJzLg",
            "sectionId": "69214b9731723704c1eda5b4"
        },
    },
    skull_mace: {
        id: "skull_mace",
        name: "Skull Mace",
        tier: 4,
        category: "Blade",
        type: "Hammer Blade",
        attackSpeed: 1,
        stats: {
            "HexBoost": 10,
            "PhysicalDefense": 10,
            "SummonBoost": 15
        },
        damageScalings: {
            Hex: 0.5,
            Physical: 0.5,
            Summon: 0.2,
        },
        damageTypes: {
            Hex: 0.5,
            Physical: 0.5,
        },
        perks: {
            trusty_servant: 1,
        },
        img: "",
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda5b6",
            "cardUrl": "https://trello.com/c/VtwVGQDW",
            "sectionId": "69214b9731723704c1eda5b6"
        },
    },
    possessed_blade: {
        id: "possessed_blade",
        name: "Possessed Blade",
        tier: 4,
        category: "Blade",
        type: "Medium Blade",
        attackSpeed: 1,
        stats: {
            "HexBoost": 12,
            "SummonBoost": 12
        },
        damageScalings: {
            Hex: 0.5,
            Magic: 0.5,
            Summon: 0.2,
        },
        damageTypes: {
            Hex: 1,
        },
        perks: {
            possession: 1,
        },
        img: "",
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda5b8",
            "cardUrl": "https://trello.com/c/3CLgrxSl",
            "sectionId": "69214b9731723704c1eda5b8"
        },
    },
    cursed_greatsword_blade: {
        id: "cursed_greatsword_blade",
        name: "Cursed Greatsword Blade",
        tier: 4,
        category: "Blade",
        type: "Heavy Blade",
        attackSpeed: 0.9,
        stats: {
            HexBoost: 15,
        },
        damageScalings: {
            Hex: 0.7,
        },
        damageTypes: {
            Hex: 0.8,
            Magic: 0.2,
        },
        perks: {
            weakening: 2,
            endless_despair: 1,
        },
        img: "",
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda5ba",
            "cardUrl": "https://trello.com/c/2SlSVXje",
            "sectionId": "69214b9731723704c1eda5ba"
        },
    },
    cursed_dagger_blade: {
        id: "cursed_dagger_blade",
        name: "Cursed Dagger Blade",
        tier: 4,
        category: "Blade",
        type: "Small Blade",
        attackSpeed: 1,
        stats: {
            HexBoost: 10,
            DexterityBoost: 10,
        },
        damageScalings: {
            Hex: 0.55,
            Dexterity: 0.55,
        },
        damageTypes: {
            Hex: 0.7,
            Magic: 0.3,
        },
        perks: {
            curse_rip: 1,
        },
        img: "",
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda5bc",
            "cardUrl": "https://trello.com/c/VKDHaa5M",
            "sectionId": "69214b9731723704c1eda5bc"
        },
    },
    gale_blade: {
        id: "gale_blade",
        name: "Gale Blade",
        tier: 4,
        category: "Blade",
        type: "Small Blade",
        attackSpeed: 1.1,
        stats: {
            "AirBoost": 7,
            "DexterityBoost": 7
        },
        damageScalings: {
            Air: 0.55,
            Dexterity: 0.55,
        },
        damageTypes: {
            Air: 0.7,
            Magic: 0.3,
        },
        perks: {
            whirlwind: 1,
            tailwind: 1,
        },
        img: "",
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda2f0",
            "cardUrl": "https://trello.com/c/e3cKdR5S",
            "sectionId": "69214b9731723704c1eda2f0"
        },
    },
    windiron_needle: {
        id: "windiron_needle",
        name: "Windiron Needle",
        tier: 4,
        category: "Blade",
        type: "Medium Blade",
        attackSpeed: 1.2,
        stats: {
            "AirBoost": 7,
            "DexterityBoost": 7
        },
        damageScalings: {
            Air: 0.55,
            Dexterity: 0.55,
        },
        damageTypes: {
            Air: 0.7,
            Magic: 0.3,
        },
        perks: {
            gale_bursts: 1,
            tailwind: 1,
        },
        img: "",
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda2f2",
            "cardUrl": "https://trello.com/c/esd3pbeI",
            "sectionId": "69214b9731723704c1eda2f2"
        },
    },
    storm_splitter: {
        id: "storm_splitter",
        name: "Storm Splitter",
        tier: 4,
        category: "Blade",
        type: "Medium Blade",
        attackSpeed: 1.1,
        stats: {
            "MagicBoost": 8,
            "DexterityBoost": 12,
            "AirBoost": 8
        },
        damageScalings: {
            Air: 0.45,
            Magic: 0.45,
            Dexterity: 0.45,
        },
        damageTypes: {
            Air: 0.5,
            Magic: 0.5,
        },
        perks: {
            storm_rend: 1,
        },
        img: "",
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda5be",
            "cardUrl": "https://trello.com/c/22glZ6nS",
            "sectionId": "69214b9731723704c1eda5be"
        },
    },
    lightning_hammer: {
        id: "lightning_hammer",
        name: "Lightning Hammer",
        tier: 4,
        category: "Blade",
        type: "Hammer Blade",
        attackSpeed: 1.1,
        stats: {
            "MagicBoost": 6,
            "PhysicalDefense": 5,
            "AirBoost": 6
        },
        damageScalings: {
            Air: 0.55,
            Magic: 0.55,
        },
        damageTypes: {
            Air: 0.5,
            Magic: 0.5,
        },
        perks: {
            static_buildup: 1,
        },
        img: "",
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda5c0",
            "cardUrl": "https://trello.com/c/Or6EOXKz",
            "sectionId": "69214b9731723704c1eda5c0"
        },
    },
    steel_flame_dagger: {
        id: "steel_flame_dagger",
        name: "Steel Flame Dagger",
        tier: 4,
        category: "Blade",
        type: "Small Blade",
        attackSpeed: 1.1,
        stats: {
            DexterityBoost: 10,
            FireBoost: 10,
        },
        damageScalings: {
            Dexterity: 0.55,
            Fire: 0.55,
        },
        damageTypes: {
            Physical: 0.3,
            Fire: 0.7,
        },
        perks: {
            spark: 1,
        },
        img: "",
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda5d4",
            "cardUrl": "https://trello.com/c/nkZKmjGc",
            "sectionId": "69214b9731723704c1eda5d4"
        },
    },
    dragon_flame_dagger: {
        id: "dragon_flame_dagger",
        name: "Dragon Flame Dagger",
        tier: 4,
        category: "Blade",
        type: "Small Blade",
        attackSpeed: 1,
        stats: {
            DexterityBoost: 8,
            FireBoost: 12,
        },
        damageScalings: {
            Dexterity: 0.55,
            Fire: 0.55,
        },
        damageTypes: {
            Magic: 0.3,
            Fire: 0.7,
        },
        potencies: {
            burnpotency: 2,
        },
        perks: {
            dragon_breath: 1,
        },
        img: "",
        "source": {
            "cardId": "69214b9731723704c1eda5d6",
            "cardUrl": "https://trello.com/c/TIdgEJkh",
            "sectionId": "69214b9731723704c1eda5d6"
        },
    },
    blue_flame_greatblade: {
        id: "blue_flame_greatblade",
        name: "Blue Flame Greatblade",
        tier: 4,
        category: "Blade",
        type: "Heavy Blade",
        attackSpeed: 1,
        stats: {
            FireBoost: 15,
            FireDefense: 15,
        },
        damageScalings: {
            Fire: 0.7,
        },
        damageTypes: {
            Fire: 0.7,
            Magic: 0.3,
        },
        perks: {
            cauterize: 1,
        },
        potencies: {
            burnpotency: 3,
        },
        img: "",
        "source": {
            "cardId": "69214b9731723704c1eda5d8",
            "cardUrl": "https://trello.com/c/0iUpkHGE",
            "sectionId": "69214b9731723704c1eda5d8"
        },
    },
    cragstone_hammer: {
        id: "cragstone_hammer",
        name: "Cragstone Hammer",
        tier: 4,
        category: "Blade",
        type: "Hammer Blade",
        attackSpeed: 1,
        stats: {
            FireBoost: 4,
            EarthBoost: 4,
            PhysicalBoost: 4,
            PhysicalDefense: 5,
            Tenacity: 0.1,
        },
        damageScalings: {
            Fire: 0.55,
            Earth: 0.55,
        },
        damageTypes: {
            Fire: 0.5,
            Earth: 0.5,
        },
        perks: {
            tectonic_heat: 1,
        },
        img: "",
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda5da",
            "cardUrl": "https://trello.com/c/VSb7Wkv1",
            "sectionId": "69214b9731723704c1eda5da"
        },
    },
    wave_blade: {
        id: "wave_blade",
        name: "Wave Blade",
        tier: 4,
        category: "Blade",
        type: "Heavy Blade",
        attackSpeed: 1.2,
        stats: {
            MagicDefense: 5,
            PhysicalDefense: -5,
            WaterBoost: 10,
        },
        damageScalings: {
            Water: 0.7,
        },
        damageTypes: {
            Water: 1,
        },
        perks: {
            wave_rider: 1,
            extinguish: 1,
        },
        img: "",
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda5e0",
            "cardUrl": "https://trello.com/c/6MXKGoBN",
            "sectionId": "69214b9731723704c1eda5e0"
        },
    },
    golden_trident: {
        id: "golden_trident",
        name: "Golden Trident",
        tier: 4,
        category: "Blade",
        type: "Small Blade",
        attackSpeed: 1,
        stats: {
            HolyBoost: 10,
            WaterBoost: 12,
        },
        damageScalings: {
            Water: 0.55,
            Holy: 0.55,
        },
        damageTypes: {
            Water: 0.8,
            Holy: 0.2,
        },
        perks: {
            holy_tides: 1,
        },
        img: "",
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda5e2",
            "cardUrl": "https://trello.com/c/D6K5q39e",
            "sectionId": "69214b9731723704c1eda5e2"
        },
    },
    icicle: {
        id: "icicle",
        name: "Icicle",
        tier: 4,
        category: "Blade",
        type: "Medium Blade",
        attackSpeed: 1.1,
        stats: {
            WaterBoost: 10,
            HeatResistance: 50,
            DexterityBoost: 10,
        },
        damageScalings: {
            Water: 0.55,
            Dexterity: 0.55,
        },
        damageTypes: {
            Water: 0.5,
            Physical: 0.5,
        },
        perks: {
            frostbite: 1,
            gelid_lance: 1,
        },
        potencies: {
            bleedpotency: 3,
        },
        img: "",
        "source": {
            "cardId": "69214b9731723704c1eda5dc",
            "cardUrl": "https://trello.com/c/zFmbaMRu",
            "sectionId": "69214b9731723704c1eda5dc"
        },
    },
    sculpted_blade: {
        id: "sculpted_blade",
        name: "Sculpted Blade",
        tier: 4,
        category: "Blade",
        type: "Medium Blade",
        attackSpeed: 1,
        stats: {
            HeatResistance: 50,
            WaterBoost: 9,
            PhysicalBoost: 9,
        },
        damageScalings: {
            Water: 0.55,
            Physical: 0.55,
        },
        damageTypes: {
            Water: 0.5,
            Physical: 0.5,
        },
        perks: {
            frozen_waste: 1,
            frostbite: 1,
        },
        img: "",
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda5de",
            "cardUrl": "https://trello.com/c/tQJJH7t8",
            "sectionId": "69214b9731723704c1eda5de"
        },
    },
    gravitational_greatblade: {
        id: "gravitational_greatblade",
        name: "Gravitational Greatblade",
        tier: 4,
        category: "Blade",
        type: "Heavy Blade",
        attackSpeed: 1,
        stats: {
            MagicBoost: 5,
            PhysicalDefense: 5,
            EarthBoost: 10,
        },
        damageScalings: {
            Magic: 0.55,
            Earth: 0.55,
        },
        damageTypes: {
            Earth: 0.5,
            Magic: 0.5,
        },
        perks: {
            gravitational_enforcer: 1,
        },
        img: "",
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda5e4",
            "cardUrl": "https://trello.com/c/a4hS6UEZ",
            "sectionId": "69214b9731723704c1eda5e4"
        },
    },
    gravitational_core: {
        id: "gravitational_core",
        name: "Gravitational Core",
        tier: 4,
        category: "Blade",
        type: "Hammer Blade",
        attackSpeed: 1,
        stats: {
            MagicBoost: 15,
            EarthBoost: 10,
        },
        damageScalings: {
            Magic: 0.55,
            Earth: 0.55,
        },
        damageTypes: {
            Earth: 0.5,
            Magic: 0.5,
        },
        perks: {
            gravity_well: 1,
            cosmic_ray: 1,
        },
        img: "",
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda5e6",
            "cardUrl": "https://trello.com/c/ySsbubAT",
            "sectionId": "69214b9731723704c1eda5e6"
        },
    },
    earth_spirit_greatblade: {
        id: "earth_spirit_greatblade",
        name: "Earth Spirit Greatblade",
        tier: 4,
        category: "Blade",
        type: "Heavy Blade",
        attackSpeed: 0.9,
        stats: {
            Tenacity: 0.1,
            PhysicalDefense: 5,
            EarthBoost: 10,
            PhysicalBoost: 5,
        },
        damageScalings: {
            Earth: 0.55,
            Physical: 0.55,
        },
        damageTypes: {
            Earth: 0.7,
            Physical: 0.3,
        },
        perks: {
            quake: 1,
            stoneskin: 1,
        },
        img: "",
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda5e8",
            "cardUrl": "https://trello.com/c/K4JtHQTa",
            "sectionId": "69214b9731723704c1eda5e8"
        },
    },
    sand_glaive: {
        id: "sand_glaive",
        name: "Sand Glaive",
        tier: 4,
        category: "Blade",
        type: "Medium Blade",
        attackSpeed: 1.1,
        stats: {
            "AirBoost": 8,
            "EarthBoost": 8
        },
        damageScalings: {
            Air: 0.55,
            Earth: 0.55,
        },
        damageTypes: {
            Earth: 0.6,
            Air: 0.4,
        },
        perks: {
            quicksand: 1,
        },
        img: "",
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda5ea",
            "cardUrl": "https://trello.com/c/cfLCFpBP",
            "sectionId": "69214b9731723704c1eda5ea"
        },
    },
    prism_blade: {
        id: "prism_blade",
        name: "Prism Blade",
        tier: 1,
        category: "Blade",
        type: "Medium Blade",
        attackSpeed: 1.1,
        damageScalings: {
            Physical: 0.15,
            Magic: 0.15,
        },
        damageTypes: {
            True: 1,
        },
        img: "",
        "stats": {},
        "perks": {},
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda640",
            "cardUrl": "https://trello.com/c/dQ69H5c0",
            "sectionId": "69214b9731723704c1eda640"
        },
    },
    starlight_greatblade: {
        id: "starlight_greatblade",
        name: "Starlight Greatblade",
        tier: 4,
        category: "Blade",
        type: "Heavy Blade",
        attackSpeed: 1,
        stats: {
            "HolyBoost": 5,
            "HexBoost": 5,
            "MagicBoost": 5,
            "FireBoost": 5,
            "WaterBoost": 5,
            "AirBoost": 5
        },
        damageScalings: {
            Holy: 0.4,
            Hex: 0.4,
            Magic: 0.4,
            Fire: 0.4,
            Water: 0.4,
            Air: 0.4,
        },
        damageTypes: {
            True: 1.2,
        },
        perks: {
            star_struck: 1,
        },
        img: "",
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda642",
            "cardUrl": "https://trello.com/c/AUZicZki",
            "sectionId": "69214b9731723704c1eda642"
        },
    },
    swaxe: {
        id: "swaxe",
        name: "Swaxe",
        tier: 3,
        category: "Blade",
        type: "Medium Blade",
        attackSpeed: 0.9,
        stats: {
            PhysicalBoost: 10,
        },
        damageScalings: {
            Physical: 0.5,
        },
        damageTypes: {
            Physical: 1,
        },
        perks: {
            cleave: 1,
        },
        img: "",
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda64e",
            "cardUrl": "https://trello.com/c/jlcUHCw4",
            "sectionId": "69214b9731723704c1eda64e"
        },
    },
    bloodiron_sawblade: {
        id: "bloodiron_sawblade",
        name: "Bloodiron Sawblade",
        tier: 4,
        category: "Blade",
        type: "Medium Blade",
        attackSpeed: 1,
        stats: {
            "SpeedBoost": 5,
            "PhysicalBoost": 5
        },
        damageScalings: {
            Physical: 0.7,
        },
        damageTypes: {
            Physical: 1,
        },
        perks: {
            rotating_blades: 1,
        },
        potencies: {
            bleedpotency: 3,
        },
        img: "",
        "source": {
            "cardId": "69214b9831723704c1edac48",
            "cardUrl": "https://trello.com/c/yzsUIBmb",
            "sectionId": "69214b9831723704c1edac48"
        },
    },
    dragonslayer_blade: {
        id: "dragonslayer_blade",
        name: "Dragonslayer Blade",
        tier: 3,
        category: "Blade",
        type: "Heavy Blade",
        attackSpeed: 0.5,
        stats: {
            PhysicalBoost: 5,
            DexterityBoost: 5,
        },
        damageScalings: {
            Physical: 0.33,
            Dexterity: 0.33,
        },
        damageTypes: {
            Physical: 1,
        },
        perks: {
            inhuman_swings: 1,
        },
        img: "",
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda66a",
            "cardUrl": "https://trello.com/c/rGk75VnM",
            "sectionId": "69214b9731723704c1eda66a"
        },
    },
    murky_blade: {
        id: "murky_blade",
        name: "Murky Blade",
        tier: 3,
        category: "Blade",
        type: "Medium Blade",
        attackSpeed: 1,
        stats: {
            HexBoost: 4,
            EarthBoost: 4,
            WaterBoost: 4,
        },
        damageScalings: {
            Earth: 0.35,
            Water: 0.35,
            Hex: 0.35,
        },
        damageTypes: {
            Water: 0.7,
            Hex: 0.3,
        },
        perks: {
            pure_rot: 1,
        },
        potencies: {
            poisonpotency: 2,
        },
        img: "",
        "source": {
            "cardId": "69214b9731723704c1eda6d8",
            "cardUrl": "https://trello.com/c/FoSfeCOn",
            "sectionId": "69214b9731723704c1eda6d8"
        },
    },
    spectral_blade: {
        id: "spectral_blade",
        name: "Spectral Blade",
        tier: 4,
        category: "Blade",
        type: "Medium Blade",
        attackSpeed: 1,
        stats: {
            HexBoost: 5,
            EarthBoost: 5,
            WaterBoost: 10,
        },
        damageScalings: {
            Earth: 0.45,
            Water: 0.45,
            Hex: 0.45,
        },
        damageTypes: {
            Hex: 0.5,
            Water: 0.5,
        },
        perks: {
            ghastly_rot: 1,
        },
        potencies: {
            poisonpotency: 2,
        },
        img: "../image/blades/spectralblade.png",
        "source": {
            "cardId": "69214b9731723704c1eda6da",
            "cardUrl": "https://trello.com/c/fLMP1v9O",
            "sectionId": "69214b9731723704c1eda6da"
        },
    },
    poisonous_blade: {
        id: "poisonous_blade",
        name: "Poisonous Blade",
        tier: 3,
        category: "Blade",
        type: "Small Blade",
        attackSpeed: 1,
        stats: {
            DexterityBoost: 4,
            EarthBoost: 4,
            HexBoost: 4,
        },
        damageScalings: {
            Hex: 0.35,
            Dexterity: 0.35,
            Earth: 0.35,
        },
        damageTypes: {
            Hex: 0.2,
            Physical: 1,
        },
        perks: {
            poisonous: 1,
        },
        potencies: {
            poisonpotency: 3,
        },
        img: "",
        "source": {
            "cardId": "69214b9731723704c1eda6e0",
            "cardUrl": "https://trello.com/c/FWXo3GrD",
            "sectionId": "69214b9731723704c1eda6e0"
        },
    },
    venomous_blade: {
        id: "venomous_blade",
        name: "Venomous Blade",
        tier: 4,
        category: "Blade",
        type: "Small Blade",
        attackSpeed: 1.1,
        stats: {
            DexterityBoost: 10,
            EarthBoost: 5,
            HexBoost: 5,
        },
        damageScalings: {
            Earth: 0.45,
            Dexterity: 0.45,
            Hex: 0.45,
        },
        damageTypes: {
            Hex: 0.5,
            Physical: 0.5,
        },
        perks: {
            venom_spitter: 1,
        },
        potencies: {
            poisonpotency: 2,
        },
        img: "",
        "source": {
            "cardId": "69214b9731723704c1eda6e6",
            "cardUrl": "https://trello.com/c/szUr3r38",
            "sectionId": "69214b9731723704c1eda6e6"
        },
    },
    honeycomb_greatblade: {
        id: "honeycomb_greatblade",
        name: "Honeycomb Greatblade",
        tier: 3,
        category: "Blade",
        type: "Heavy Blade",
        attackSpeed: 1,
        stats: {
            MagicBoost: 4,
            MagicDefense: 2,
            Tenacity: 0.1,
            PhysicalBoost: 4,
        },
        damageScalings: {
            Magic: 0.4,
            Physical: 0.4,
        },
        damageTypes: {
            Magic: 0.5,
            Physical: 0.5,
        },
        perks: {
            sticky_swings: 1,
        },
        img: "",
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda6ec",
            "cardUrl": "https://trello.com/c/ulFeKCTT",
            "sectionId": "69214b9731723704c1eda6ec"
        },
    },
    honeysteel_greatblade: {
        id: "honeysteel_greatblade",
        name: "Honeysteel Greatblade",
        tier: 4,
        category: "Blade",
        type: "Heavy Blade",
        attackSpeed: 0.9,
        stats: {
            MagicBoost: 6,
            MagicDefense: 10,
            Tenacity: 0.1,
            PhysicalBoost: 6,
        },
        damageScalings: {
            Magic: 0.55,
            Physical: 0.55,
        },
        damageTypes: {
            Magic: 0.5,
            Physical: 0.5,
        },
        perks: {
            explosive_honey: 1,
        },
        img: "",
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda6ee",
            "cardUrl": "https://trello.com/c/Ddk5nwBN",
            "sectionId": "69214b9731723704c1eda6ee"
        },
    },
    honey_bumblz_mace: {
        id: "honey_bumblz_mace",
        name: "Honey Bumblz Mace",
        tier: 3,
        category: "Blade",
        type: "Hammer",
        attackSpeed: 1,
        stats: {
            "MagicBoost": 4,
            "SummonBoost": 10,
            "PhysicalBoost": 4
        },
        damageScalings: {
            Magic: 0.35,
            Physical: 0.35,
            Summon: 0.1,
        },
        damageTypes: {
            Magic: 0.5,
            Physical: 0.5,
        },
        perks: {
            "queen_s_guard": 1
        },
        img: "",
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda6f6",
            "cardUrl": "https://trello.com/c/yy2s4nMl",
            "sectionId": "69214b9731723704c1eda6f6"
        },
    },
    queen_bumblz_core: {
        id: "queen_bumblz_core",
        name: "Queen Bumblz Core",
        tier: 4,
        category: "Blade",
        type: "Hammer",
        attackSpeed: 1,
        stats: {
            "MagicBoost": 5,
            "SummonBoost": 10,
            "HolyBoost": 5,
            "PhysicalBoost": 5
        },
        damageScalings: {
            Magic: 0.4,
            Physical: 0.4,
            Holy: 0.4,
            Summon: 0.2,
        },
        damageTypes: {
            Physical: 0.3,
            Magic: 0.35,
            Holy: 0.35,
        },
        perks: {
            "reinforced_block": 1,
            "queen_s_power": 1
        },
        img: "",
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda6f4",
            "cardUrl": "https://trello.com/c/ytARjfxe",
            "sectionId": "69214b9731723704c1eda6f4"
        },
    },
    magic_great_hammer: {
        id: "magic_great_hammer",
        name: "Magic Great Hammer",
        tier: 4,
        category: "Blade",
        type: "Hammer",
        attackSpeed: 0.8,
        stats: {
            MagicBoost: 7,
            PhysicalDefense: 5,
            Warding: 30,
        },
        damageScalings: {
            Magic: 0.8,
        },
        damageTypes: {
            Magic: 1.2,
        },
        perks: {
            energize: 1,
        },
        img: "",
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda6d6",
            "cardUrl": "https://trello.com/c/q5tIaFYV",
            "sectionId": "69214b9731723704c1eda6d6"
        },
    },
    dynamite_stick: {
        id: "dynamite_stick",
        name: "Dynamite Stick",
        tier: 2,
        category: "Blade",
        type: "Small Blade",
        attackSpeed: 1.1,
        stats: {
            DexterityBoost: 5,
            PhysicalBoost: 5,
        },
        damageScalings: {
            Dexterity: 0.3,
            Physical: 0.3,
        },
        damageTypes: {
            Physical: 1,
        },
        perks: {
            explosive_charge: 1,
        },
        img: "",
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda7c8",
            "cardUrl": "https://trello.com/c/8KXpRDoy",
            "sectionId": "69214b9731723704c1eda7c8"
        },
    },
    dynamite_bundle: {
        id: "dynamite_bundle",
        name: "Dynamite Bundle",
        tier: 3,
        category: "Blade",
        type: "Small Blade",
        attackSpeed: 1,
        stats: {
            DexterityBoost: 10,
            PhysicalBoost: 12,
        },
        damageScalings: {
            Dexterity: 0.4,
            Physical: 0.4,
        },
        damageTypes: {
            Physical: 1,
        },
        perks: {
            explosive_charge: 2,
        },
        img: "",
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda7ca",
            "cardUrl": "https://trello.com/c/q6tPcRUS",
            "sectionId": "69214b9731723704c1eda7ca"
        },
    },
    timed_dynamite_bundle: {
        id: "timed_dynamite_bundle",
        name: "Timed Dynamite Bundle",
        tier: 4,
        category: "Blade",
        type: "Small Blade",
        attackSpeed: 0.9,
        stats: {
            DexterityBoost: 10,
            PhysicalBoost: 14,
        },
        damageScalings: {
            Dexterity: 0.55,
            Physical: 0.55,
        },
        damageTypes: {
            Physical: 1,
        },
        perks: {
            explosive_charge: 3,
        },
        img: "",
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda7cc",
            "cardUrl": "https://trello.com/c/xvNevOil",
            "sectionId": "69214b9731723704c1eda7cc"
        },
    },
    stratos_core: {
        id: "stratos_core",
        name: "Stratos Core",
        tier: 3,
        category: "Blade",
        type: "Hammer Blade",
        attackSpeed: 1,
        damageScalings: {
            Air: 0.55,
        },
        damageTypes: {
            Air: 1,
        },
        perks: {
            stratos_winds: 1,
        },
        img: "",
        "stats": {
            "AirBoost": 10
        },
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda91e",
            "cardUrl": "https://trello.com/c/6DVAn4Ss",
            "sectionId": "69214b9731723704c1eda91e"
        },
    },
    lightning_stratos_core: {
        id: "lightning_stratos_core",
        name: "Lightning Stratos Core",
        tier: 4,
        category: "Blade",
        type: "Hammer Blade",
        attackSpeed: 1,
        stats: {
            "MagicBoost": 10,
            "AirBoost": 13
        },
        damageScalings: {
            Air: 0.55,
            Magic: 0.55,
        },
        damageTypes: {
            Air: 0.5,
            Magic: 0.5,
        },
        perks: {
            storm_caster: 1,
            power_surge: 1,
        },
        img: "",
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda924",
            "cardUrl": "https://trello.com/c/ZpK8vsPt",
            "sectionId": "69214b9731723704c1eda924"
        },
    },
    caci_blade: {
        id: "caci_blade",
        name: "Caci Blade",
        tier: 3,
        category: "Blade",
        type: "Small Blade",
        attackSpeed: 1,
        stats: {
            DexterityBoost: 5,
            PhysicalBoost: 5,
        },
        damageScalings: {
            Dexterity: 0.4,
            Physical: 0.4,
        },
        damageTypes: {
            Physical: 1,
        },
        perks: {
            barbed_flurry: 1,
            thorns: 1,
        },
        img: "",
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda96c",
            "cardUrl": "https://trello.com/c/ITvft4E8",
            "sectionId": "69214b9731723704c1eda96c"
        },
    },
    caci_kings_blade: {
        id: "caci_kings_blade",
        name: "Caci Kings Blade",
        tier: 4,
        category: "Blade",
        type: "Medium Blade",
        attackSpeed: 1.1,
        stats: {
            "DexterityBoost": 5,
            "PhysicalBoost": 5,
            "EarthBoost": 5,
            "AirBoost": 5
        },
        damageScalings: {
            Dexterity: 0.45,
            Physical: 0.45,
            Earth: 0.45,
            Air: 0.45,
        },
        damageTypes: {
            Physical: 1,
        },
        perks: {
            barbed_flurry: 1,
            sandy_wounds: 1,
        },
        potencies: {
            bleedpotency: 2,
        },
        img: "",
        "source": {
            "cardId": "69214b9731723704c1eda976",
            "cardUrl": "https://trello.com/c/ftYtuWFe",
            "sectionId": "69214b9731723704c1eda976"
        },
    },
    buni_prince_hammer: {
        id: "buni_prince_hammer",
        name: "Buni Prince Hammer",
        tier: 3,
        category: "Blade",
        type: "Hammer Blade",
        attackSpeed: 1,
        stats: {
            PhysicalDefense: 5,
            PhysicalBoost: 10,
        },
        damageScalings: {
            Physical: 0.5,
        },
        damageTypes: {
            Physical: 1,
        },
        perks: {
            iron_bounce: 1,
        },
        img: "",
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1edaa26",
            "cardUrl": "https://trello.com/c/aiP8bTpx",
            "sectionId": "69214b9731723704c1edaa26"
        },
    },
    buni_prince_cannon: {
        id: "buni_prince_cannon",
        name: "Buni Prince Cannon",
        tier: 4,
        category: "Blade",
        type: "Hammer Blade",
        attackSpeed: 1,
        stats: {
            PhysicalDefense: 5,
            PhysicalBoost: 15,
        },
        damageScalings: {
            Physical: 0.7,
        },
        damageTypes: {
            Physical: 1,
        },
        perks: {
            springblast: 1,
        },
        img: "",
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1edaa28",
            "cardUrl": "https://trello.com/c/KA07xwzz",
            "sectionId": "69214b9731723704c1edaa28"
        },
    },
    ancient_mallet: {
        id: "ancient_mallet",
        name: "Ancient Mallet",
        tier: 3,
        category: "Blade",
        type: "Hammer Blade",
        attackSpeed: 1,
        stats: {
            EarthBoost: 8,
            PhysicalDefense: 5,
        },
        damageScalings: {
            Earth: 0.5,
        },
        damageTypes: {
            Earth: 1,
        },
        perks: {
            rocky_body: 1,
        },
        img: "",
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1edabc0",
            "cardUrl": "https://trello.com/c/qYOtOU0A",
            "sectionId": "69214b9731723704c1edabc0"
        },
    },
    bastion_greatswaxe_blade: {
        id: "bastion_greatswaxe_blade",
        name: "Bastion Greatswaxe Blade",
        tier: 4,
        category: "Blade",
        type: "Heavy Blade",
        attackSpeed: 1.1,
        stats: {
            "EarthBoost": 8,
            "SpeedBoost": 5
        },
        damageScalings: {
            Earth: 0.8,
        },
        damageTypes: {
            Earth: 1,
        },
        perks: {
            golem_guillotine: 1,
        },
        img: "",
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1edabc8",
            "cardUrl": "https://trello.com/c/6PdIafqa",
            "sectionId": "69214b9731723704c1edabc8"
        },
    },
    relic_short_blade: {
        id: "relic_short_blade",
        name: "Relic Short Blade",
        tier: 3,
        category: "Blade",
        type: "Small Blade",
        attackSpeed: 1.1,
        stats: {
            EarthBoost: 4,
            HolyBoost: 4,
        },
        damageScalings: {
            Earth: 0.4,
            Holy: 0.4,
        },
        damageTypes: {
            Earth: 0.7,
            Holy: 0.3,
        },
        perks: {
            bastion_bless: 1,
        },
        img: "",
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1edabc6",
            "cardUrl": "https://trello.com/c/eUV56976",
            "sectionId": "69214b9731723704c1edabc6"
        },
    },
    bastion_relic_blade: {
        id: "bastion_relic_blade",
        name: "Bastion Relic Blade",
        tier: 4,
        category: "Blade",
        type: "Medium Blade",
        attackSpeed: 1,
        stats: {
            EarthBoost: 8,
            HolyBoost: 8,
        },
        damageScalings: {
            Earth: 0.55,
            Holy: 0.55,
        },
        damageTypes: {
            Earth: 0.5,
            Holy: 0.5,
        },
        perks: {
            essence_totem: 1,
        },
        img: "",
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1edabce",
            "cardUrl": "https://trello.com/c/W4ubvmOa",
            "sectionId": "69214b9731723704c1edabce"
        },
    },
    vaen_kama: {
        id: "vaen_kama",
        name: "Vaen Kama",
        tier: 3,
        category: "Blade",
        type: "Small Blade",
        attackSpeed: 1.1,
        stats: {
            "AirBoost": 5,
            "PhysicalBoost": 5
        },
        damageScalings: {
            Air: 0.4,
            Physical: 0.4,
        },
        damageTypes: {
            Air: 0.5,
            Physical: 0.5,
        },
        perks: {
            crimson_tithe: 1,
            kama_blades: 1,
        },
        img: "",
        "potencies": {},
        "source": {
            "cardId": "69214b9831723704c1edacbc",
            "cardUrl": "https://trello.com/c/IJeAYftT",
            "sectionId": "69214b9831723704c1edacbc"
        },
    },
    lord_vaen_blade: {
        id: "lord_vaen_blade",
        name: "Lord Vaen Blade",
        tier: 4,
        category: "Blade",
        type: "Small Blade",
        attackSpeed: 1.1,
        stats: {
            "AirBoost": 10,
            "PhysicalBoost": 10
        },
        damageScalings: {
            Air: 0.55,
            Physical: 0.55,
        },
        damageTypes: {
            Air: 0.5,
            Physical: 0.5,
        },
        perks: {
            ichor_spark: 1,
            kama_blades: 1,
        },
        potencies: {
            bleedpotency: 3,
        },
        img: "",
        "source": {
            "cardId": "69214b9831723704c1edacbe",
            "cardUrl": "https://trello.com/c/raV0zYbR",
            "sectionId": "69214b9831723704c1edacbe"
        },
    },
    mungal_mallet: {
        id: "mungal_mallet",
        name: "Mungal Mallet",
        tier: 3,
        category: "Blade",
        type: "Hammer Blade",
        attackSpeed: 1,
        stats: {
            HexBoost: 4,
            EarthBoost: 4,
            PhysicalBoost: 4,
        },
        damageScalings: {
            Hex: 0.35,
            Earth: 0.35,
            Physical: 0.35,
        },
        damageTypes: {
            Earth: 0.5,
            Hex: 0.5,
        },
        perks: {
            gaseous_smash: 1,
        },
        potencies: {
            poisonpotency: 3,
        },
        img: "",
        "source": {
            "cardId": "69214b9831723704c1edad2a",
            "cardUrl": "https://trello.com/c/vsUS4b2M",
            "sectionId": "69214b9831723704c1edad2a"
        },
    },
    mungus_core: {
        id: "mungus_core",
        name: "Mungus Core",
        tier: 4,
        category: "Blade",
        type: "Hammer",
        attackSpeed: 1,
        stats: {
            "EarthBoost": 5,
            "MagicBoost": 5,
            "HexBoost": 5,
            "SpeedBoost": 2
        },
        damageScalings: {
            Earth: 0.45,
            Magic: 0.45,
            Hex: 0.45,
        },
        damageTypes: {
            Hex: 0.6,
            Magic: 0.5,
        },
        perks: {
            virulent_core: 1,
            proto_tech: 1,
        },
        img: "../image/blades/munguscore.png",
        "potencies": {},
        "source": {
            "cardId": "69214b9831723704c1edad22",
            "cardUrl": "https://trello.com/c/DdGPdmsr",
            "sectionId": "69214b9831723704c1edad22"
        },
    },
    spider_fang_blade: {
        id: "spider_fang_blade",
        name: "Spider Fang Blade",
        tier: 3,
        category: "Blade",
        type: "Small Blade",
        attackSpeed: 1.1,
        stats: {
            HexDefense: 10,
            DexterityBoost: 10,
        },
        damageScalings: {
            Dexterity: 0.5,
        },
        damageTypes: {
            Hex: 0.2,
            Physical: 0.8,
        },
        perks: {
            poison_acceleration: 1,
        },
        potencies: {
            poisonpotency: 2,
        },
        img: "",
        "source": {
            "cardId": "69214b9831723704c1edad14",
            "cardUrl": "https://trello.com/c/9zoETRLr",
            "sectionId": "69214b9831723704c1edad14"
        },
    },
    omega_lance_blade: {
        id: "omega_lance_blade",
        name: "Omega Lance Blade",
        tier: 4,
        category: "Blade",
        type: "Heavy Blade",
        attackSpeed: 1,
        stats: {
            "DexterityBoost": 5,
            "PhysicalBoost": 5,
            "FireBoost": 5,
            "AirBoost": 5
        },
        damageScalings: {
            Dexterity: 0.45,
            Physical: 0.45,
            Fire: 0.45,
            Air: 0.45,
        },
        damageTypes: {
            Physical: 1,
        },
        perks: {
            lance: 1,
            heat_drill: 1,
        },
        img: "../image/blades/omegalanceblade.png",
        "potencies": {},
        "source": {
            "cardId": "69214b9831723704c1edad18",
            "cardUrl": "https://trello.com/c/J4uEttmj",
            "sectionId": "69214b9831723704c1edad18"
        },
    },
    bronze_frozen_pick: {
        id: "bronze_frozen_pick",
        name: "Bronze Frozen Pick",
        tier: 3,
        category: "Blade",
        type: "Small Blade",
        attackSpeed: 1,
        stats: {
            HeatResistance: 50,
            WaterBoost: 5,
            PhysicalBoost: 5,
        },
        damageScalings: {
            Water: 0.4,
            Physical: 0.4,
        },
        damageTypes: {
            Water: 0.5,
            Physical: 0.5,
        },
        perks: {
            glacial_buildup: 1,
            kama_blades: 1,
        },
        img: "",
        "potencies": {},
        "source": {
            "cardId": "69214b9831723704c1edad34",
            "cardUrl": "https://trello.com/c/txXR1Bfd",
            "sectionId": "69214b9831723704c1edad34"
        },
    },
    frozen_pickaxe_head: {
        id: "frozen_pickaxe_head",
        name: "Frozen Pickaxe Head",
        tier: 4,
        category: "Blade",
        type: "Hammer Blade",
        attackSpeed: 1.2,
        stats: {
            HeatResistance: 50,
            PhysicalBoost: 5,
            WaterBoost: 5,
        },
        damageScalings: {
            Water: 0.55,
            Physical: 0.55,
        },
        damageTypes: {
            Water: 0.5,
            Physical: 0.5,
        },
        perks: {
            mine: 1,
            ice_burst: 1,
        },
        img: "",
        "potencies": {},
        "source": {
            "cardId": "69214b9831723704c1edad36",
            "cardUrl": "https://trello.com/c/MRhAix7d",
            "sectionId": "69214b9831723704c1edad36"
        },
    },
};
