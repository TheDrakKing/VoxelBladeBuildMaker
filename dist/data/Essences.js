let images = "../image/essences/";
export const Essences = {
    basic_essence: {
        id: "basic_essence",
        name: "Basic Essence",
        tier: 1,
        category: "Essence",
        type: "Essence",
        attackSpeed: 1,
        damageScalings: {
            Physical: 0.15,
            Dexterity: 0.15,
        },
        img: "",
        "stats": {},
        "perks": {},
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda6a6",
            "cardUrl": "https://trello.com/c/pkUctg0L",
            "sectionId": "69214b9731723704c1eda6a6"
        },
    },
    greatsword_essence: {
        id: "greatsword_essence",
        name: "Greatsword Essence",
        tier: 2,
        category: "Essence",
        type: "Essence",
        attackSpeed: 1,
        stats: {
            PhysicalBoost: 5,
        },
        damageScalings: {
            Physical: 0.4,
        },
        img: "",
        "perks": {},
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda70e",
            "cardUrl": "https://trello.com/c/ogUKR0IQ",
            "sectionId": "69214b9731723704c1eda70e"
        },
    },
    sharp_essence: {
        id: "sharp_essence",
        name: "Sharp Essence",
        tier: 2,
        category: "Essence",
        type: "Essence",
        attackSpeed: 1,
        stats: {
            PhysicalBoost: 5,
        },
        damageScalings: {
            Physical: 0.3,
            Dexterity: 0.3,
        },
        img: "",
        "perks": {},
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda710",
            "cardUrl": "https://trello.com/c/jGnRjP86",
            "sectionId": "69214b9731723704c1eda710"
        },
    },
    agile_essence: {
        id: "agile_essence",
        name: "Agile Essence",
        tier: 2,
        category: "Essence",
        type: "Essence",
        attackSpeed: 1.1,
        stats: {
            DexterityBoost: 5,
        },
        damageScalings: {
            Physical: 0.3,
            Dexterity: 0.3,
        },
        img: "",
        "perks": {},
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda712",
            "cardUrl": "https://trello.com/c/UBAbQ2BO",
            "sectionId": "69214b9731723704c1eda712"
        },
    },
    mage_essence: {
        id: "mage_essence",
        name: "Mage Essence",
        tier: 2,
        category: "Essence",
        type: "Essence",
        attackSpeed: 1,
        stats: {
            MagicBoost: 5,
        },
        damageScalings: {
            Magic: 0.4,
        },
        img: "",
        "perks": {},
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda714",
            "cardUrl": "https://trello.com/c/4DTPKGAg",
            "sectionId": "69214b9731723704c1eda714"
        },
    },
    holy_essence: {
        id: "holy_essence",
        name: "Holy Essence",
        tier: 2,
        category: "Essence",
        type: "Essence",
        attackSpeed: 1,
        stats: {
            HolyBoost: 5,
            MagicBoost: 5,
        },
        damageScalings: {
            Magic: 0.3,
            Holy: 0.3,
        },
        perks: {
            blessing: 1,
        },
        img: "",
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda71a",
            "cardUrl": "https://trello.com/c/JKITSarA",
            "sectionId": "69214b9731723704c1eda71a"
        },
    },
    cursed_essence: {
        id: "cursed_essence",
        name: "Cursed Essence",
        tier: 2,
        category: "Essence",
        type: "Essence",
        attackSpeed: 1,
        stats: {
            MagicBoost: 5,
            HexBoost: 5,
        },
        damageScalings: {
            Magic: 0.3,
            Hex: 0.3,
        },
        perks: {
            weakening: 1,
        },
        img: "",
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda718",
            "cardUrl": "https://trello.com/c/oYdrvpHS",
            "sectionId": "69214b9731723704c1eda718"
        },
    },
    wind_essence: {
        id: "wind_essence",
        name: "Wind Essence",
        tier: 2,
        category: "Essence",
        type: "Essence",
        attackSpeed: 1.1,
        stats: {
            "AirBoost": 5,
            "DexterityBoost": 5
        },
        damageScalings: {
            Dexterity: 0.3,
            Air: 0.3,
        },
        perks: {
            tailwind: 1,
        },
        img: "",
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda71c",
            "cardUrl": "https://trello.com/c/JYSjfUwE",
            "sectionId": "69214b9731723704c1eda71c"
        },
    },
    blaze_essence: {
        id: "blaze_essence",
        name: "Blaze Essence",
        tier: 2,
        category: "Essence",
        type: "Essence",
        attackSpeed: 1,
        stats: {
            MagicBoost: 5,
            FireBoost: 5,
        },
        damageScalings: {
            Magic: 0.3,
            Fire: 0.3,
        },
        perks: {
            ignition: 1,
        },
        img: "",
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda716",
            "cardUrl": "https://trello.com/c/t7F14HSm",
            "sectionId": "69214b9731723704c1eda716"
        },
    },
    water_essence: {
        id: "water_essence",
        name: "Water Essence",
        tier: 2,
        category: "Essence",
        type: "Essence",
        attackSpeed: 1.1,
        stats: {
            WaterBoost: 5,
            MagicBoost: 5,
        },
        damageScalings: {
            Water: 0.3,
            Magic: 0.3,
        },
        perks: {
            extinguish: 1,
        },
        img: "",
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda71e",
            "cardUrl": "https://trello.com/c/evgih1Xj",
            "sectionId": "69214b9731723704c1eda71e"
        },
    },
    earth_essence: {
        id: "earth_essence",
        name: "Earth Essence",
        tier: 2,
        category: "Essence",
        type: "Essence",
        attackSpeed: 0.85,
        stats: {
            EarthBoost: 5,
            PhysicalBoost: 5,
        },
        damageScalings: {
            Earth: 0.35,
            Physical: 0.35,
        },
        perks: {
            quake: 1,
        },
        img: "",
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda720",
            "cardUrl": "https://trello.com/c/X1267obj",
            "sectionId": "69214b9731723704c1eda720"
        },
    },
    executioners_essence: {
        id: "executioners_essence",
        name: "Executioners Essence",
        tier: 3,
        category: "Essence",
        type: "Essence",
        attackSpeed: 0.8,
        stats: {
            PhysicalBoost: 8,
            PhysicalDefense: 5,
        },
        damageScalings: {
            Physical: 0.5,
        },
        damageTypes: {
            Physical: 0.1,
        },
        perks: {
            executioner: 1,
        },
        img: "",
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda7da",
            "cardUrl": "https://trello.com/c/WKoi9Gsp",
            "sectionId": "69214b9731723704c1eda7da"
        },
    },
    hammer_essence: {
        id: "hammer_essence",
        name: "Hammer Essence",
        tier: 3,
        category: "Essence",
        type: "Essence",
        attackSpeed: 1,
        stats: {
            Tenacity: 0.2,
            PhysicalDefense: 8,
        },
        damageScalings: {
            Physical: 0.5,
        },
        perks: {
            shattering_justice: 1,
        },
        img: "",
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda7dc",
            "cardUrl": "https://trello.com/c/mrgGPKNM",
            "sectionId": "69214b9731723704c1eda7dc"
        },
    },
    katana_essence: {
        id: "katana_essence",
        name: "Katana Essence",
        tier: 3,
        category: "Essence",
        type: "Essence",
        attackSpeed: 1.2,
        stats: {
            DexterityBoost: 5,
            PhysicalBoost: 5,
        },
        damageScalings: {
            Physical: 0.4,
            Dexterity: 0.4,
        },
        perks: {
            parry: 1,
            flash_strike: 1,
        },
        img: "",
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda7de",
            "cardUrl": "https://trello.com/c/YghqDyNB",
            "sectionId": "69214b9731723704c1eda7de"
        },
    },
    jagged_essence: {
        id: "jagged_essence",
        name: "Jagged Essence",
        tier: 3,
        category: "Essence",
        type: "Essence",
        attackSpeed: 1,
        stats: {
            PhysicalBoost: 10,
        },
        damageScalings: {
            Physical: 0.5,
        },
        damageTypes: {
            Physical: 0.1,
        },
        perks: {
            "serrated_edge": 1
        },
        img: "",
        "potencies": {
            "bleedpotency": 4
        },
        "source": {
            "cardId": "69214b9731723704c1eda7e0",
            "cardUrl": "https://trello.com/c/VCeCMTFr",
            "sectionId": "69214b9731723704c1eda7e0"
        },
    },
    noble_essence: {
        id: "noble_essence",
        name: "Noble Essence",
        tier: 3,
        category: "Essence",
        type: "Essence",
        attackSpeed: 1.1,
        stats: {
            "DexterityBoost": 10,
            "SpeedBoost": 5
        },
        damageScalings: {
            Dexterity: 0.5,
        },
        perks: {
            vital_strikes: 1,
        },
        img: "",
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda7e2",
            "cardUrl": "https://trello.com/c/KHwCPvmz",
            "sectionId": "69214b9731723704c1eda7e2"
        },
    },
    graceful_essence: {
        id: "graceful_essence",
        name: "Graceful Essence",
        tier: 3,
        category: "Essence",
        type: "Essence",
        attackSpeed: 1.2,
        stats: {
            DexterityBoost: 5,
            PhysicalBoost: 5,
        },
        damageScalings: {
            Physical: 0.4,
            Dexterity: 0.4,
        },
        perks: {
            sharp_crits: 1,
        },
        img: "",
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda7e4",
            "cardUrl": "https://trello.com/c/fpSqY7dv",
            "sectionId": "69214b9731723704c1eda7e4"
        },
    },
    greatmage_essence: {
        id: "greatmage_essence",
        name: "Greatmage Essence",
        tier: 3,
        category: "Essence",
        type: "Essence",
        attackSpeed: 0.9,
        stats: {
            MagicBoost: 7,
            PhysicalDefense: 5,
        },
        damageScalings: {
            Magic: 0.5,
        },
        perks: {
            magic_guard: 1,
        },
        img: "",
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda7e6",
            "cardUrl": "https://trello.com/c/cBeI4hmi",
            "sectionId": "69214b9731723704c1eda7e6"
        },
    },
    enchanted_essence: {
        id: "enchanted_essence",
        name: "Enchanted Essence",
        tier: 3,
        category: "Essence",
        type: "Essence",
        attackSpeed: 1,
        stats: {
            MagicBoost: 10,
        },
        damageScalings: {
            Magic: 0.5,
        },
        damageTypes: {
            Magic: 0.2,
        },
        perks: {
            royal_finisher: 1,
        },
        img: "",
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda7e8",
            "cardUrl": "https://trello.com/c/UmUvC6vX",
            "sectionId": "69214b9731723704c1eda7e8"
        },
    },
    radiant_essence: {
        id: "radiant_essence",
        name: "Radiant Essence",
        tier: 3,
        category: "Essence",
        type: "Essence",
        attackSpeed: 1,
        stats: {
            "SummonBoost": 5,
            "HolyBoost": 6,
            "DexterityBoost": 6
        },
        damageScalings: {
            Holy: 0.4,
            Dexterity: 0.4,
        },
        perks: {
            radiance: 1,
        },
        img: "",
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda7ea",
            "cardUrl": "https://trello.com/c/rlobiDrR",
            "sectionId": "69214b9731723704c1eda7ea"
        },
    },
    pure_essence: {
        id: "pure_essence",
        name: "Pure Essence",
        tier: 3,
        category: "Essence",
        type: "Essence",
        attackSpeed: 1,
        stats: {
            HolyBoost: 10,
        },
        damageScalings: {
            Holy: 0.4,
            Magic: 0.4,
        },
        perks: {
            blessing: 2,
        },
        img: "",
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda7ec",
            "cardUrl": "https://trello.com/c/cFORH2tQ",
            "sectionId": "69214b9731723704c1eda7ec"
        },
    },
    summoning_essence: {
        id: "summoning_essence",
        name: "Summoning Essence",
        tier: 3,
        category: "Essence",
        type: "Essence",
        attackSpeed: 1,
        stats: {
            "SummonBoost": 10,
            "PhysicalDefense": 4,
            "HexBoost": 8
        },
        damageScalings: {
            Hex: 0.35,
            Physical: 0.35,
            Summon: 0.1,
        },
        perks: {
            revel_in_death: 1,
        },
        img: "",
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda2ce",
            "cardUrl": "https://trello.com/c/E2kPAbmv",
            "sectionId": "69214b9731723704c1eda2ce"
        },
    },
    hex_cleaver_essence: {
        id: "hex_cleaver_essence",
        name: "Hex Cleaver Essence",
        tier: 3,
        category: "Essence",
        type: "Essence",
        attackSpeed: 1,
        stats: {
            MagicBoost: 5,
            HexBoost: 10,
        },
        damageScalings: {
            Magic: 0.4,
            Hex: 0.4,
        },
        damageTypes: {
            Hex: 0.1,
        },
        perks: {
            weakening: 2,
        },
        img: "",
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda2d0",
            "cardUrl": "https://trello.com/c/JuAY9Uco",
            "sectionId": "69214b9731723704c1eda2d0"
        },
    },
    refined_wind_essence: {
        id: "refined_wind_essence",
        name: "Refined Wind Essence",
        tier: 3,
        category: "Essence",
        type: "Essence",
        attackSpeed: 1.1,
        stats: {
            "DexterityBoost": 7,
            "SpeedBoost": 5,
            "AirBoost": 7
        },
        damageScalings: {
            Air: 0.4,
            Dexterity: 0.4,
        },
        perks: {
            tailwind: 2,
        },
        img: "",
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda7f0",
            "cardUrl": "https://trello.com/c/mv7TcAjh",
            "sectionId": "69214b9731723704c1eda7f0"
        },
    },
    stormwood_essence: {
        id: "stormwood_essence",
        name: "Stormwood Essence",
        tier: 3,
        category: "Essence",
        type: "Essence",
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
        perks: {
            stormcaller: 1,
        },
        img: "",
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda7ee",
            "cardUrl": "https://trello.com/c/cZuU2mkM",
            "sectionId": "69214b9731723704c1eda7ee"
        },
    },
    kindlewood_essence: {
        id: "kindlewood_essence",
        name: "Kindlewood Essence",
        tier: 3,
        category: "Essence",
        type: "Essence",
        attackSpeed: 1,
        stats: {
            DexterityBoost: 5,
            FireBoost: 5,
        },
        damageScalings: {
            Fire: 0.4,
            Dexterity: 0.4,
        },
        perks: {
            kindling: 1,
        },
        img: "",
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda7f2",
            "cardUrl": "https://trello.com/c/eIzX8Arf",
            "sectionId": "69214b9731723704c1eda7f2"
        },
    },
    greatflame_essence: {
        id: "greatflame_essence",
        name: "Greatflame Essence",
        tier: 3,
        category: "Essence",
        type: "Essence",
        attackSpeed: 0.9,
        stats: {
            MagicBoost: 5,
            FireBoost: 5,
            PhysicalDefense: 5,
        },
        damageScalings: {
            Fire: 0.4,
            Magic: 0.4,
        },
        perks: {
            ignition: 2,
        },
        img: "",
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda7f4",
            "cardUrl": "https://trello.com/c/u1sP0wvJ",
            "sectionId": "69214b9731723704c1eda7f4"
        },
    },
    sunken_essence: {
        id: "sunken_essence",
        name: "Sunken Essence",
        tier: 3,
        category: "Essence",
        type: "Essence",
        attackSpeed: 1.1,
        stats: {
            MagicBoost: 5,
            WaterBoost: 10,
        },
        damageScalings: {
            Water: 0.4,
            Magic: 0.4,
        },
        perks: {
            extinguish: 2,
        },
        img: "",
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda7f6",
            "cardUrl": "https://trello.com/c/tzj0HLn1",
            "sectionId": "69214b9731723704c1eda7f6"
        },
    },
    frozen_essence: {
        id: "frozen_essence",
        name: "Frozen Essence",
        tier: 3,
        category: "Essence",
        type: "Essence",
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
        perks: {
            frostbite: 1,
        },
        img: "",
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda7f8",
            "cardUrl": "https://trello.com/c/zu6V44TF",
            "sectionId": "69214b9731723704c1eda7f8"
        },
    },
    gravity_mallet_essence: {
        id: "gravity_mallet_essence",
        name: "Gravity Mallet Essence",
        tier: 3,
        category: "Essence",
        type: "Essence",
        attackSpeed: 0.9,
        stats: {
            EarthBoost: 5,
            MagicBoost: 5,
        },
        damageScalings: {
            Earth: 0.55,
            Magic: 0.55,
        },
        perks: {
            gravity_well: 1,
        },
        img: "",
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda7fc",
            "cardUrl": "https://trello.com/c/n4NP0UzB",
            "sectionId": "69214b9731723704c1eda7fc"
        },
    },
    bedrock_essence: {
        id: "bedrock_essence",
        name: "Bedrock Essence",
        tier: 3,
        category: "Essence",
        type: "Essence",
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
        perks: {
            quake: 2,
        },
        img: "",
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda7fa",
            "cardUrl": "https://trello.com/c/u21FiTs9",
            "sectionId": "69214b9731723704c1eda7fa"
        },
    },
    scourgers_essence: {
        id: "scourgers_essence",
        name: "Scourgers Essence",
        tier: 4,
        category: "Essence",
        type: "Essence",
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
            True: 0.1,
        },
        perks: {
            scourge: 1,
        },
        img: "",
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda800",
            "cardUrl": "https://trello.com/c/r7FHjEk0",
            "sectionId": "69214b9731723704c1eda800"
        },
    },
    zweihander_essence: {
        id: "zweihander_essence",
        name: "Zweihander Essence",
        tier: 4,
        category: "Essence",
        type: "Essence",
        attackSpeed: 1,
        stats: {
            "PhysicalBoost": 10,
            "PhysicalDefense": 3,
            "SpeedBoost": 2,
            "Protection": 5
        },
        damageScalings: {
            Physical: 0.55,
            Dexterity: 0.55,
        },
        perks: {
            highlander: 1,
        },
        img: "",
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda7fe",
            "cardUrl": "https://trello.com/c/udDw8MoO",
            "sectionId": "69214b9731723704c1eda7fe"
        },
    },
    gilded_essence: {
        id: "gilded_essence",
        name: "Gilded Essence",
        tier: 4,
        category: "Essence",
        type: "Essence",
        attackSpeed: 0.8,
        stats: {
            Tenacity: 0.2,
            PhysicalDefense: 10,
            PhysicalBoost: 4,
        },
        damageScalings: {
            Physical: 0.8,
        },
        perks: {
            reinforced_block: 3,
        },
        img: "",
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda804",
            "cardUrl": "https://trello.com/c/KenYJVZV",
            "sectionId": "69214b9731723704c1eda804"
        },
    },
    dark_steel_essence: {
        id: "dark_steel_essence",
        name: "Dark Steel Essence",
        tier: 4,
        category: "Essence",
        type: "Essence",
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
        perks: {
            "hemorrhage": 1
        },
        img: "",
        "potencies": {
            "bleedpotency": 3
        },
        "source": {
            "cardId": "69214b9731723704c1eda806",
            "cardUrl": "https://trello.com/c/mwxU5IBI",
            "sectionId": "69214b9731723704c1eda806"
        },
    },
    serrated_essence: {
        id: "serrated_essence",
        name: "Serrated Essence",
        tier: 4,
        category: "Essence",
        type: "Essence",
        attackSpeed: 0.9,
        stats: {
            PhysicalBoost: 10,
            DexterityBoost: 2,
            Protection: 5,
        },
        damageScalings: {
            Physical: 0.7,
        },
        perks: {
            "vicious_edge": 1
        },
        img: "",
        "potencies": {
            "bleedpotency": 3
        },
        "source": {
            "cardId": "69214b9731723704c1eda630",
            "cardUrl": "https://trello.com/c/u9NUyRde",
            "sectionId": "69214b9731723704c1eda630"
        },
    },
    bloodied_essence: {
        id: "bloodied_essence",
        name: "Bloodied Essence",
        tier: 4,
        category: "Essence",
        type: "Essence",
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
        perks: {
            "blood_lust": 1
        },
        img: "",
        "potencies": {
            "bleedpotency": 3
        },
        "source": {
            "cardId": "69214b9731723704c1eda802",
            "cardUrl": "https://trello.com/c/MWG0fTXN",
            "sectionId": "69214b9731723704c1eda802"
        },
    },
    bejeweled_essence: {
        id: "bejeweled_essence",
        name: "Bejeweled Essence",
        tier: 4,
        category: "Essence",
        type: "Essence",
        attackSpeed: 1.2,
        stats: {
            DexterityBoost: 15,
            PhysicalBoost: 5,
        },
        damageScalings: {
            Dexterity: 0.55,
            Physical: 0.55,
        },
        perks: {
            royal_parry: 1,
            parry: 1,
        },
        img: "",
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda58a",
            "cardUrl": "https://trello.com/c/Kh3VLXLi",
            "sectionId": "69214b9731723704c1eda58a"
        },
    },
    shadow_essence: {
        id: "shadow_essence",
        name: "Shadow Essence",
        tier: 4,
        category: "Essence",
        type: "Essence",
        attackSpeed: 1.2,
        stats: {
            PhysicalBoost: 13,
            DexterityBoost: 10,
        },
        damageScalings: {
            Physical: 0.55,
            Dexterity: 0.55,
        },
        perks: {
            phantom_pain: 2,
        },
        img: "",
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda808",
            "cardUrl": "https://trello.com/c/yWHpfjuh",
            "sectionId": "69214b9731723704c1eda808"
        },
    },
    kings_essence: {
        id: "kings_essence",
        name: "Kings Essence",
        tier: 4,
        category: "Essence",
        type: "Essence",
        attackSpeed: 1.1,
        stats: {
            "DexterityBoost": 15,
            "SpeedBoost": 5
        },
        damageScalings: {
            Dexterity: 0.7,
        },
        perks: {
            golden_crits: 1,
        },
        img: "",
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda80a",
            "cardUrl": "https://trello.com/c/3oI6D9OD",
            "sectionId": "69214b9731723704c1eda80a"
        },
    },
    beastial_essence: {
        id: "beastial_essence",
        name: "Beastial Essence",
        tier: 4,
        category: "Essence",
        type: "Essence",
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
        perks: {
            beastial_rage: 1,
        },
        img: "",
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda80c",
            "cardUrl": "https://trello.com/c/vSJqkxIs",
            "sectionId": "69214b9731723704c1eda80c"
        },
    },
    duelist_essence: {
        id: "duelist_essence",
        name: "Duelist Essence",
        tier: 4,
        category: "Essence",
        type: "Essence",
        attackSpeed: 1,
        stats: {
            "DexterityBoost": 15,
            "SpeedBoost": 5
        },
        damageScalings: {
            Dexterity: 0.7,
        },
        perks: {
            piercer: 1,
        },
        img: "",
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda80e",
            "cardUrl": "https://trello.com/c/eq7OhQJJ",
            "sectionId": "69214b9731723704c1eda80e"
        },
    },
    crude_essence: {
        id: "crude_essence",
        name: "Crude Essence",
        tier: 4,
        category: "Essence",
        type: "Essence",
        attackSpeed: 1.1,
        stats: {
            PhysicalBoost: 10,
            DexterityBoost: 10,
        },
        damageScalings: {
            Dexterity: 0.55,
            Physical: 0.55,
        },
        perks: {
            savage_combo: 1,
        },
        img: "",
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda810",
            "cardUrl": "https://trello.com/c/8nBNXUwS",
            "sectionId": "69214b9731723704c1eda810"
        },
    },
    grandmagic_great_essence: {
        id: "grandmagic_great_essence",
        name: "Grandmagic Great Essence",
        tier: 4,
        category: "Essence",
        type: "Essence",
        attackSpeed: 0.9,
        stats: {
            MagicBoost: 10,
            PhysicalDefense: 5,
            Warding: 20,
        },
        damageScalings: {
            Magic: 0.7,
        },
        perks: {
            grandmagic_guard: 1,
        },
        img: "",
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda814",
            "cardUrl": "https://trello.com/c/geLMVvrc",
            "sectionId": "69214b9731723704c1eda814"
        },
    },
    mage_core_essence: {
        id: "mage_core_essence",
        name: "Mage Core Essence",
        tier: 4,
        category: "Essence",
        type: "Essence",
        attackSpeed: 1.1,
        stats: {
            "MagicBoost": 15,
            "SpeedBoost": 2
        },
        damageScalings: {
            Magic: 0.7,
        },
        perks: {
            "artillery_mage": 1,
            "glyph_conduit": 1
        },
        img: "",
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda812",
            "cardUrl": "https://trello.com/c/sinRDTme",
            "sectionId": "69214b9731723704c1eda812"
        },
    },
    spellbinder_essence: {
        id: "spellbinder_essence",
        name: "Spellbinder Essence",
        tier: 4,
        category: "Essence",
        type: "Essence",
        attackSpeed: 1,
        stats: {
            MagicBoost: 15,
            DexterityBoost: 5,
        },
        damageScalings: {
            Magic: 0.55,
            Dexterity: 0.55,
        },
        perks: {
            spell_piercer: 1,
        },
        img: "",
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda816",
            "cardUrl": "https://trello.com/c/ByVwpVnV",
            "sectionId": "69214b9731723704c1eda816"
        },
    },
    dual_magic_essence: {
        id: "dual_magic_essence",
        name: "Dual Magic Essence",
        tier: 4,
        category: "Essence",
        type: "Essence",
        attackSpeed: 1,
        stats: {
            MagicBoost: 20,
        },
        damageScalings: {
            Magic: 0.7,
        },
        perks: {
            royal_finisher: 1,
            runic_blades: 1,
        },
        img: "",
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda818",
            "cardUrl": "https://trello.com/c/13knFxng",
            "sectionId": "69214b9731723704c1eda818"
        },
    },
    divine_essence: {
        id: "divine_essence",
        name: "Divine Essence",
        tier: 4,
        category: "Essence",
        type: "Essence",
        attackSpeed: 1.1,
        stats: {
            HolyBoost: 15,
            DexterityBoost: 10,
        },
        damageScalings: {
            Dexterity: 0.55,
            Holy: 0.55,
        },
        perks: {
            radiance: 1,
            divinity: 1,
        },
        img: "",
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda81a",
            "cardUrl": "https://trello.com/c/YFxUiUbw",
            "sectionId": "69214b9731723704c1eda81a"
        },
    },
    radiant_hammer_essence: {
        id: "radiant_hammer_essence",
        name: "Radiant Hammer Essence",
        tier: 4,
        category: "Essence",
        type: "Essence",
        attackSpeed: 0.9,
        stats: {
            "SummonBoost": 10,
            "HolyBoost": 10,
            "Warding": 20
        },
        damageScalings: {
            Physical: 0.5,
            Holy: 0.5,
            Summon: 0.2,
        },
        perks: {
            divine_intervention: 1,
        },
        img: "",
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda81c",
            "cardUrl": "https://trello.com/c/eliukXLc",
            "sectionId": "69214b9731723704c1eda81c"
        },
    },
    hallowed_essence: {
        id: "hallowed_essence",
        name: "Hallowed Essence",
        tier: 4,
        category: "Essence",
        type: "Essence",
        attackSpeed: 1,
        stats: {
            HolyBoost: 15,
            Warding: 20,
        },
        damageScalings: {
            Holy: 0.5,
        },
        perks: {
            blessing: 1,
            light_bearer: 1,
        },
        img: "",
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda81e",
            "cardUrl": "https://trello.com/c/dNiQoeEl",
            "sectionId": "69214b9731723704c1eda81e"
        },
    },
    angels_essence: {
        id: "angels_essence",
        name: "Angels Essence",
        tier: 4,
        category: "Essence",
        type: "Essence",
        attackSpeed: 1,
        stats: {
            HolyBoost: 15,
            MagicBoost: 10,
        },
        damageScalings: {
            Holy: 0.55,
            Magic: 0.55,
        },
        perks: {
            sacred_grounds: 1,
        },
        img: "",
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda820",
            "cardUrl": "https://trello.com/c/XnrY1M2x",
            "sectionId": "69214b9731723704c1eda820"
        },
    },
    skull_essence: {
        id: "skull_essence",
        name: "Skull Essence",
        tier: 4,
        category: "Essence",
        type: "Essence",
        attackSpeed: 1,
        stats: {
            "SummonBoost": 15,
            "HexBoost": 10,
            "PhysicalDefense": 10
        },
        damageScalings: {
            Hex: 0.5,
            Physical: 0.5,
            Summon: 0.2,
        },
        perks: {
            trusty_servant: 1,
        },
        img: "",
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda2d2",
            "cardUrl": "https://trello.com/c/BbOOgoKI",
            "sectionId": "69214b9731723704c1eda2d2"
        },
    },
    possessed_essence: {
        id: "possessed_essence",
        name: "Possessed Essence",
        tier: 4,
        category: "Essence",
        type: "Essence",
        attackSpeed: 1,
        stats: {
            "SummonBoost": 12,
            "HexBoost": 12
        },
        damageScalings: {
            Hex: 0.5,
            Magic: 0.5,
            Summon: 0.2,
        },
        perks: {
            possession: 1,
        },
        img: "",
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda822",
            "cardUrl": "https://trello.com/c/CHVlzCFk",
            "sectionId": "69214b9731723704c1eda822"
        },
    },
    cursed_greatsword_essence: {
        id: "cursed_greatsword_essence",
        name: "Cursed Greatsword Essence",
        tier: 4,
        category: "Essence",
        type: "Essence",
        attackSpeed: 0.9,
        stats: {
            HexBoost: 15,
        },
        damageScalings: {
            Hex: 0.7,
        },
        perks: {
            weakening: 2,
            endless_despair: 1,
        },
        img: "",
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda824",
            "cardUrl": "https://trello.com/c/ljsIcWz5",
            "sectionId": "69214b9731723704c1eda824"
        },
    },
    cursed_dagger_essence: {
        id: "cursed_dagger_essence",
        name: "Cursed Dagger Essence",
        tier: 4,
        category: "Essence",
        type: "Essence",
        attackSpeed: 1,
        stats: {
            DexterityBoost: 10,
            HexBoost: 10,
        },
        damageScalings: {
            Hex: 0.55,
            Dexterity: 0.55,
        },
        perks: {
            curse_rip: 1,
        },
        img: "",
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda826",
            "cardUrl": "https://trello.com/c/BAdEJMFE",
            "sectionId": "69214b9731723704c1eda826"
        },
    },
    gale_essence: {
        id: "gale_essence",
        name: "Gale Essence",
        tier: 4,
        category: "Essence",
        type: "Essence",
        attackSpeed: 1.1,
        stats: {
            "DexterityBoost": 7,
            "AirBoost": 7
        },
        damageScalings: {
            Air: 0.55,
            Dexterity: 0.55,
        },
        perks: {
            whirlwind: 1,
            tailwind: 1,
        },
        img: "",
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda828",
            "cardUrl": "https://trello.com/c/2NtxuKnp",
            "sectionId": "69214b9731723704c1eda828"
        },
    },
    windiron_needle_essence: {
        id: "windiron_needle_essence",
        name: "Windiron Needle Essence",
        tier: 4,
        category: "Essence",
        type: "Essence",
        attackSpeed: 1.2,
        stats: {
            "DexterityBoost": 7,
            "AirBoost": 7
        },
        damageScalings: {
            Air: 0.55,
            Dexterity: 0.55,
        },
        perks: {
            gale_bursts: 1,
            tailwind: 1,
        },
        img: "",
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda82a",
            "cardUrl": "https://trello.com/c/r54jtlxP",
            "sectionId": "69214b9731723704c1eda82a"
        },
    },
    storm_splitter_essence: {
        id: "storm_splitter_essence",
        name: "Storm Splitter Essence",
        tier: 4,
        category: "Essence",
        type: "Essence",
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
        perks: {
            storm_rend: 1,
        },
        img: "",
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda82c",
            "cardUrl": "https://trello.com/c/8vRsnpuj",
            "sectionId": "69214b9731723704c1eda82c"
        },
    },
    lightning_essence: {
        id: "lightning_essence",
        name: "Lightning Essence",
        tier: 4,
        category: "Essence",
        type: "Essence",
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
        perks: {
            static_buildup: 1,
        },
        img: "",
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda82e",
            "cardUrl": "https://trello.com/c/hmCc06GE",
            "sectionId": "69214b9731723704c1eda82e"
        },
    },
    steel_flame_dagger_essence: {
        id: "steel_flame_dagger_essence",
        name: "Steel Flame Dagger Essence",
        tier: 4,
        category: "Essence",
        type: "Essence",
        attackSpeed: 1.1,
        stats: {
            DexterityBoost: 10,
            FireBoost: 10,
        },
        damageScalings: {
            Dexterity: 0.55,
            Fire: 0.55,
        },
        perks: {
            spark: 1,
        },
        img: "",
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda836",
            "cardUrl": "https://trello.com/c/xcgnHeMn",
            "sectionId": "69214b9731723704c1eda836"
        },
    },
    dragon_flame_essence: {
        id: "dragon_flame_essence",
        name: "Dragon Flame Essence",
        tier: 4,
        category: "Essence",
        type: "Essence",
        attackSpeed: 1,
        stats: {
            DexterityBoost: 8,
            FireBoost: 12,
        },
        damageScalings: {
            Dexterity: 0.55,
            Fire: 0.55,
        },
        perks: {
            "dragon_breath": 1
        },
        img: "",
        "potencies": {
            "burnpotency": 2
        },
        "source": {
            "cardId": "69214b9731723704c1eda834",
            "cardUrl": "https://trello.com/c/P0nxkB5r",
            "sectionId": "69214b9731723704c1eda834"
        },
    },
    blue_flame_essence: {
        id: "blue_flame_essence",
        name: "Blue Flame Essence",
        tier: 4,
        category: "Essence",
        type: "Essence",
        attackSpeed: 1,
        stats: {
            FireBoost: 15,
            FireDefense: 15,
        },
        damageScalings: {
            Fire: 0.7,
        },
        perks: {
            "cauterize": 1
        },
        img: "",
        "potencies": {
            "burnpotency": 3
        },
        "source": {
            "cardId": "69214b9731723704c1eda830",
            "cardUrl": "https://trello.com/c/rtclQ4NP",
            "sectionId": "69214b9731723704c1eda830"
        },
    },
    cragstone_essence: {
        id: "cragstone_essence",
        name: "Cragstone Essence",
        tier: 4,
        category: "Essence",
        type: "Essence",
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
        perks: {
            tectonic_heat: 1,
        },
        img: "",
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda832",
            "cardUrl": "https://trello.com/c/QBorpOvo",
            "sectionId": "69214b9731723704c1eda832"
        },
    },
    wave_essence: {
        id: "wave_essence",
        name: "Wave Essence",
        tier: 4,
        category: "Essence",
        type: "Essence",
        attackSpeed: 1.2,
        stats: {
            MagicDefense: 5,
            PhysicalDefense: -5,
            WaterBoost: 10,
        },
        damageScalings: {
            Water: 0.7,
        },
        perks: {
            wave_rider: 1,
        },
        img: "",
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda838",
            "cardUrl": "https://trello.com/c/OqDHJEOh",
            "sectionId": "69214b9731723704c1eda838"
        },
    },
    golden_trident_essence: {
        id: "golden_trident_essence",
        name: "Golden Trident Essence",
        tier: 4,
        category: "Essence",
        type: "Essence",
        attackSpeed: 1,
        stats: {
            HolyBoost: 10,
            WaterBoost: 12,
        },
        damageScalings: {
            Water: 0.55,
            Holy: 0.55,
        },
        perks: {
            holy_tides: 1,
        },
        img: "",
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda83a",
            "cardUrl": "https://trello.com/c/aO1PbZ5a",
            "sectionId": "69214b9731723704c1eda83a"
        },
    },
    icicle_essence: {
        id: "icicle_essence",
        name: "Icicle Essence",
        tier: 4,
        category: "Essence",
        type: "Essence",
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
        perks: {
            "frostbite": 1,
            "gelid_lance": 1
        },
        img: "",
        "potencies": {
            "bleedpotency": 3
        },
        "source": {
            "cardId": "69214b9731723704c1eda83c",
            "cardUrl": "https://trello.com/c/hKKxBmYY",
            "sectionId": "69214b9731723704c1eda83c"
        },
    },
    sculpted_essence: {
        id: "sculpted_essence",
        name: "Sculpted Essence",
        tier: 4,
        category: "Essence",
        type: "Essence",
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
        perks: {
            frozen_waste: 1,
            frostbite: 1,
        },
        img: "",
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda83e",
            "cardUrl": "https://trello.com/c/coOgDUNf",
            "sectionId": "69214b9731723704c1eda83e"
        },
    },
    gravity_greatsword_essence: {
        id: "gravity_greatsword_essence",
        name: "Gravity Greatsword Essence",
        tier: 4,
        category: "Essence",
        type: "Essence",
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
        perks: {
            gravitational_enforcer: 1,
        },
        img: "",
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda840",
            "cardUrl": "https://trello.com/c/pGlS3V2S",
            "sectionId": "69214b9731723704c1eda840"
        },
    },
    gravity_staff_essence: {
        id: "gravity_staff_essence",
        name: "Gravity Staff Essence",
        tier: 4,
        category: "Essence",
        type: "Essence",
        attackSpeed: 1,
        stats: {
            MagicBoost: 15,
            EarthBoost: 10,
        },
        damageScalings: {
            Magic: 0.55,
            Earth: 0.55,
        },
        perks: {
            gravity_well: 1,
            cosmic_ray: 1,
        },
        img: "",
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda842",
            "cardUrl": "https://trello.com/c/seqXNNEw",
            "sectionId": "69214b9731723704c1eda842"
        },
    },
    earth_spirit_essence: {
        id: "earth_spirit_essence",
        name: "Earth Spirit Essence",
        tier: 4,
        category: "Essence",
        type: "Essence",
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
        perks: {
            quake: 1,
            stoneskin: 1,
        },
        img: "",
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda844",
            "cardUrl": "https://trello.com/c/LwfWihoO",
            "sectionId": "69214b9731723704c1eda844"
        },
    },
    sand_essence: {
        id: "sand_essence",
        name: "Sand Essence",
        tier: 4,
        category: "Essence",
        type: "Essence",
        attackSpeed: 1.1,
        stats: {
            "AirBoost": 5,
            "EarthBoost": 5
        },
        damageScalings: {
            Air: 0.55,
            Earth: 0.55,
        },
        perks: {
            quicksand: 1,
        },
        img: "",
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda846",
            "cardUrl": "https://trello.com/c/vXJJ8Mk8",
            "sectionId": "69214b9731723704c1eda846"
        },
    },
    prism_essence: {
        id: "prism_essence",
        name: "Prism Essence",
        tier: 5,
        category: "Essence",
        type: "Essence",
        attackSpeed: 1.1,
        damageScalings: {
            Physical: 0.15,
            Magic: 0.15,
        },
        damageTypes: {
            True: 0.1,
        },
        img: "",
        "stats": {},
        "perks": {},
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda848",
            "cardUrl": "https://trello.com/c/urpylJoP",
            "sectionId": "69214b9731723704c1eda848"
        },
    },
    starlight_essence: {
        id: "starlight_essence",
        name: "Starlight Essence",
        tier: 5,
        category: "Essence",
        type: "Essence",
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
            True: 0.1,
        },
        perks: {
            star_struck: 1,
        },
        img: "",
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda84a",
            "cardUrl": "https://trello.com/c/SbIgSptZ",
            "sectionId": "69214b9731723704c1eda84a"
        },
    },
    swaxe_essence: {
        id: "swaxe_essence",
        name: "Swaxe Essence",
        tier: 5,
        category: "Essence",
        type: "Essence",
        attackSpeed: 0.9,
        stats: {
            PhysicalBoost: 10,
        },
        damageScalings: {
            Physical: 0.5,
        },
        perks: {
            cleave: 1,
        },
        img: "",
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda9b2",
            "cardUrl": "https://trello.com/c/xGfumios",
            "sectionId": "69214b9731723704c1eda9b2"
        },
    },
    sawblade_essence: {
        id: "sawblade_essence",
        name: "Sawblade Essence",
        tier: 5,
        category: "Essence",
        type: "Essence",
        attackSpeed: 1,
        stats: {
            "SpeedBoost": 5,
            "PhysicalBoost": 5
        },
        damageScalings: {
            Physical: 0.7,
        },
        perks: {
            "saw_heart": 1
        },
        img: "",
        "potencies": {
            "bleedpotency": 3
        },
        "source": {
            "cardId": "69214b9831723704c1edac52",
            "cardUrl": "https://trello.com/c/UeusZcXX",
            "sectionId": "69214b9831723704c1edac52"
        },
    },
    dragonslayer_essence: {
        id: "dragonslayer_essence",
        name: "Dragonslayer Essence",
        tier: 5,
        category: "Essence",
        type: "Essence",
        attackSpeed: 0.9,
        stats: {
            PhysicalBoost: 5,
            DexterityBoost: 5,
        },
        damageScalings: {
            Dexterity: 0.33,
            Physical: 0.33,
        },
        perks: {
            weight_distribution: 1,
        },
        img: "",
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda84c",
            "cardUrl": "https://trello.com/c/hadq5qwn",
            "sectionId": "69214b9731723704c1eda84c"
        },
    },
    murkwater_essence: {
        id: "murkwater_essence",
        name: "Murkwater Essence",
        tier: 5,
        category: "Essence",
        type: "Essence",
        attackSpeed: 0.9,
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
        perks: {
            "pure_rot": 1
        },
        img: "",
        "potencies": {
            "poisonpotency": 2
        },
        "source": {
            "cardId": "69214b9731723704c1eda850",
            "cardUrl": "https://trello.com/c/OpCGUzru",
            "sectionId": "69214b9731723704c1eda850"
        },
    },
    spectral_essence: {
        id: "spectral_essence",
        name: "Spectral Essence",
        tier: 5,
        category: "Essence",
        type: "Essence",
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
        perks: {
            "ghastly_rot": 1
        },
        img: "",
        "potencies": {
            "poisonpotency": 2
        },
        "source": {
            "cardId": "69214b9731723704c1eda852",
            "cardUrl": "https://trello.com/c/1mIG4m8v",
            "sectionId": "69214b9731723704c1eda852"
        },
    },
    rot_essence: {
        id: "rot_essence",
        name: "Rot Essence",
        tier: 5,
        category: "Essence",
        type: "Essence",
        attackSpeed: 1,
        stats: {
            DexterityBoost: 4,
            EarthBoost: 4,
            HexBoost: 4,
        },
        damageScalings: {
            Earth: 0.35,
            Dexterity: 0.35,
            Hex: 0.35,
        },
        perks: {
            "poisonous": 1
        },
        img: "",
        "potencies": {
            "poisonpotency": 3
        },
        "source": {
            "cardId": "69214b9731723704c1eda854",
            "cardUrl": "https://trello.com/c/Q6rOGscD",
            "sectionId": "69214b9731723704c1eda854"
        },
    },
    venomous_essence: {
        id: "venomous_essence",
        name: "Venomous Essence",
        tier: 5,
        category: "Essence",
        type: "Essence",
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
        perks: {
            "venom_spitter": 1
        },
        img: "",
        "potencies": {
            "poisonpotency": 2
        },
        "source": {
            "cardId": "69214b9731723704c1eda856",
            "cardUrl": "https://trello.com/c/D6JBQaAX",
            "sectionId": "69214b9731723704c1eda856"
        },
    },
    honeycomb_essence: {
        id: "honeycomb_essence",
        name: "Honeycomb Essence",
        tier: 5,
        category: "Essence",
        type: "Essence",
        attackSpeed: 0.9,
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
        perks: {
            sticky_swings: 1,
        },
        img: "",
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda85e",
            "cardUrl": "https://trello.com/c/y0X1GHK1",
            "sectionId": "69214b9731723704c1eda85e"
        },
    },
    honeysteel_essence: {
        id: "honeysteel_essence",
        name: "Honeysteel Essence",
        tier: 5,
        category: "Essence",
        type: "Essence",
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
        perks: {
            explosive_honey: 1,
        },
        img: "",
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda85a",
            "cardUrl": "https://trello.com/c/CEjCvV9w",
            "sectionId": "69214b9731723704c1eda85a"
        },
    },
    honey_bumblz_essence: {
        id: "honey_bumblz_essence",
        name: "Honey Bumblz Essence",
        tier: 5,
        category: "Essence",
        type: "Essence",
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
        perks: {
            "queen_s_guard": 1
        },
        img: "",
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda85c",
            "cardUrl": "https://trello.com/c/v8ahny9U",
            "sectionId": "69214b9731723704c1eda85c"
        },
    },
    queen_bumblz_essence: {
        id: "queen_bumblz_essence",
        name: "Queen Bumblz Essence",
        tier: 5,
        category: "Essence",
        type: "Essence",
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
        perks: {
            "queen_s_power": 1
        },
        img: "",
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda858",
            "cardUrl": "https://trello.com/c/cJfBV9W6",
            "sectionId": "69214b9731723704c1eda858"
        },
    },
    magic_great_hammer_essence: {
        id: "magic_great_hammer_essence",
        name: "Magic Great Hammer Essence",
        tier: 5,
        category: "Essence",
        type: "Essence",
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
            Magic: 0.2,
        },
        perks: {
            energize: 1,
        },
        img: "",
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda84e",
            "cardUrl": "https://trello.com/c/RsmbdJdV",
            "sectionId": "69214b9731723704c1eda84e"
        },
    },
    dynamite_stick_essence: {
        id: "dynamite_stick_essence",
        name: "Dynamite Stick Essence",
        tier: 5,
        category: "Essence",
        type: "Essence",
        attackSpeed: 1.1,
        stats: {
            DexterityBoost: 5,
            PhysicalBoost: 5,
        },
        damageScalings: {
            Dexterity: 0.3,
            Physical: 0.3,
        },
        perks: {
            explosive_charge: 1,
        },
        img: "",
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda99a",
            "cardUrl": "https://trello.com/c/aTZgw5EE",
            "sectionId": "69214b9731723704c1eda99a"
        },
    },
    dynamite_bundle_essence: {
        id: "dynamite_bundle_essence",
        name: "Dynamite Bundle Essence",
        tier: 5,
        category: "Essence",
        type: "Essence",
        attackSpeed: 1,
        stats: {
            DexterityBoost: 10,
            PhysicalBoost: 12,
        },
        damageScalings: {
            Dexterity: 0.4,
            Physical: 0.4,
        },
        perks: {
            explosive_charge: 2,
        },
        img: "",
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda99c",
            "cardUrl": "https://trello.com/c/G9YIWEsO",
            "sectionId": "69214b9731723704c1eda99c"
        },
    },
    timed_dynamite_bundle_essence: {
        id: "timed_dynamite_bundle_essence",
        name: "Timed Dynamite Bundle Essence",
        tier: 5,
        category: "Essence",
        type: "Essence",
        attackSpeed: 0.9,
        stats: {
            DexterityBoost: 10,
            PhysicalBoost: 14,
        },
        damageScalings: {
            Dexterity: 0.55,
            Physical: 0.55,
        },
        perks: {
            explosive_charge: 3,
        },
        img: "",
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda99e",
            "cardUrl": "https://trello.com/c/AEqlH6GL",
            "sectionId": "69214b9731723704c1eda99e"
        },
    },
    stratos_essence: {
        id: "stratos_essence",
        name: "Stratos Essence",
        tier: 5,
        category: "Essence",
        type: "Essence",
        attackSpeed: 0.9,
        damageScalings: {
            Air: 0.55,
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
            "cardId": "69214b9731723704c1eda922",
            "cardUrl": "https://trello.com/c/8BR08E83",
            "sectionId": "69214b9731723704c1eda922"
        },
    },
    lightning_stratos_essence: {
        id: "lightning_stratos_essence",
        name: "Lightning Stratos Essence",
        tier: 5,
        category: "Essence",
        type: "Essence",
        attackSpeed: 1,
        stats: {
            "AirBoost": 13,
            "MagicBoost": 10
        },
        damageScalings: {
            Air: 0.55,
            Magic: 0.55,
        },
        perks: {
            storm_caster: 1,
            power_surge: 1,
        },
        img: "",
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda92c",
            "cardUrl": "https://trello.com/c/JkRuZZ5e",
            "sectionId": "69214b9731723704c1eda92c"
        },
    },
    caci_essence: {
        id: "caci_essence",
        name: "Caci Essence",
        tier: 5,
        category: "Essence",
        type: "Essence",
        attackSpeed: 1,
        stats: {
            DexterityBoost: 5,
            PhysicalBoost: 5,
        },
        damageScalings: {
            Dexterity: 0.4,
            Physical: 0.4,
        },
        perks: {
            barbed_flurry: 1,
            thorns: 2,
        },
        img: "",
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda970",
            "cardUrl": "https://trello.com/c/JTwi391u",
            "sectionId": "69214b9731723704c1eda970"
        },
    },
    caci_kings_essence: {
        id: "caci_kings_essence",
        name: "Caci Kings Essence",
        tier: 5,
        category: "Essence",
        type: "Essence",
        attackSpeed: 1.1,
        stats: {
            "DexterityBoost": 5,
            "PhysicalBoost": 5,
            "EarthBoost": 3,
            "AirBoost": 3
        },
        damageScalings: {
            Dexterity: 0.45,
            Physical: 0.45,
            Earth: 0.45,
            Air: 0.45,
        },
        perks: {
            "sandy_wounds": 1
        },
        img: "",
        "potencies": {
            "bleedpotency": 2
        },
        "source": {
            "cardId": "69214b9731723704c1eda97e",
            "cardUrl": "https://trello.com/c/kOZf5ukW",
            "sectionId": "69214b9731723704c1eda97e"
        },
    },
    buni_prince_essence: {
        id: "buni_prince_essence",
        name: "Buni Prince Essence",
        tier: 5,
        category: "Essence",
        type: "Essence",
        attackSpeed: 1,
        stats: {
            PhysicalDefense: 5,
            PhysicalBoost: 10,
        },
        damageScalings: {
            Physical: 0.5,
        },
        perks: {
            iron_bounce: 1,
        },
        img: "",
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1edaa08",
            "cardUrl": "https://trello.com/c/kiAg0eah",
            "sectionId": "69214b9731723704c1edaa08"
        },
    },
    buni_prince_cannon_essence: {
        id: "buni_prince_cannon_essence",
        name: "Buni Prince Cannon Essence",
        tier: 5,
        category: "Essence",
        type: "Essence",
        attackSpeed: 1,
        stats: {
            PhysicalDefense: 5,
            PhysicalBoost: 15,
        },
        damageScalings: {
            Physical: 0.7,
        },
        perks: {
            springblast: 1,
        },
        img: "",
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1edaa04",
            "cardUrl": "https://trello.com/c/x1iyQF7m",
            "sectionId": "69214b9731723704c1edaa04"
        },
    },
    ancient_mallet_essence: {
        id: "ancient_mallet_essence",
        name: "Ancient Mallet Essence",
        tier: 5,
        category: "Essence",
        type: "Essence",
        attackSpeed: 1,
        stats: {
            EarthBoost: 8,
            PhysicalDefense: 5,
        },
        damageScalings: {
            Earth: 0.5,
        },
        perks: {
            rocky_body: 1,
        },
        img: "",
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1edabbc",
            "cardUrl": "https://trello.com/c/b3AXK16z",
            "sectionId": "69214b9731723704c1edabbc"
        },
    },
    bastion_greatswaxe_essence: {
        id: "bastion_greatswaxe_essence",
        name: "Bastion Greatswaxe Essence",
        tier: 5,
        category: "Essence",
        type: "Essence",
        attackSpeed: 1.1,
        stats: {
            "EarthBoost": 8,
            "SpeedBoost": 5
        },
        damageScalings: {
            Earth: 0.8,
        },
        perks: {
            golem_guillotine: 1,
        },
        img: "",
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1edabf4",
            "cardUrl": "https://trello.com/c/5lyfTyU8",
            "sectionId": "69214b9731723704c1edabf4"
        },
    },
    relic_dagger_essence: {
        id: "relic_dagger_essence",
        name: "Relic Dagger Essence",
        tier: 5,
        category: "Essence",
        type: "Essence",
        attackSpeed: 1.1,
        stats: {
            EarthBoost: 6,
            HolyBoost: 6,
        },
        damageScalings: {
            Earth: 0.4,
            Holy: 0.4,
        },
        perks: {
            bastion_bless: 1,
        },
        img: "",
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1edabf0",
            "cardUrl": "https://trello.com/c/Rgsipm6Z",
            "sectionId": "69214b9731723704c1edabf0"
        },
    },
    bastion_relic_essence: {
        id: "bastion_relic_essence",
        name: "Bastion Relic Essence",
        tier: 5,
        category: "Essence",
        type: "Essence",
        attackSpeed: 1,
        stats: {
            EarthBoost: 8,
            HolyBoost: 8,
        },
        damageScalings: {
            Earth: 0.55,
            Holy: 0.55,
        },
        perks: {
            essence_totem: 1,
        },
        img: "",
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1edabf6",
            "cardUrl": "https://trello.com/c/hhXouCNX",
            "sectionId": "69214b9731723704c1edabf6"
        },
    },
    vaen_kama_essence: {
        id: "vaen_kama_essence",
        name: "Vaen Kama Essence",
        tier: 5,
        category: "Essence",
        type: "Essence",
        attackSpeed: 1.1,
        stats: {
            "AirBoost": 5,
            "PhysicalBoost": 5
        },
        damageScalings: {
            Air: 0.4,
            Physical: 0.4,
        },
        perks: {
            crimson_tithe: 1,
        },
        img: "",
        "potencies": {},
        "source": {
            "cardId": "69214b9831723704c1edacca",
            "cardUrl": "https://trello.com/c/BAeXOwDr",
            "sectionId": "69214b9831723704c1edacca"
        },
    },
    lord_vaen_scythe_essence: {
        id: "lord_vaen_scythe_essence",
        name: "Lord Vaen Scythe Essence",
        tier: 5,
        category: "Essence",
        type: "Essence",
        attackSpeed: 1.1,
        stats: {
            "AirBoost": 10,
            "PhysicalBoost": 10
        },
        damageScalings: {
            Air: 0.55,
            Physical: 0.55,
        },
        perks: {
            "ichor_spark": 1
        },
        img: "",
        "potencies": {
            "bleedpotency": 3
        },
        "source": {
            "cardId": "69214b9831723704c1edaccc",
            "cardUrl": "https://trello.com/c/vyx1Deou",
            "sectionId": "69214b9831723704c1edaccc"
        },
    },
    mungal_essence: {
        id: "mungal_essence",
        name: "Mungal Essence",
        tier: 5,
        category: "Essence",
        type: "Essence",
        attackSpeed: 1,
        stats: {
            HexBoost: 4,
            EarthBoost: 4,
            PhysicalBoost: 4,
        },
        damageScalings: {
            Hex: 0.35,
            Physical: 0.35,
            Earth: 0.35,
        },
        perks: {
            "gaseous_smash": 1
        },
        img: "",
        "potencies": {
            "poisonpotency": 3
        },
        "source": {
            "cardId": "69214b9831723704c1edad3e",
            "cardUrl": "https://trello.com/c/5KKWyfYk",
            "sectionId": "69214b9831723704c1edad3e"
        },
    },
    proto_essence: {
        id: "proto_essence",
        name: "Proto Essence",
        tier: 5,
        category: "Essence",
        type: "Essence",
        attackSpeed: 1,
        stats: {
            "EarthBoost": 5,
            "SpeedBoost": 2,
            "MagicBoost": 5,
            "HexBoost": 5
        },
        damageScalings: {
            Earth: 0.45,
            Magic: 0.45,
            Hex: 0.45,
        },
        perks: {
            virulent_core: 1,
            proto_tech: 1,
        },
        img: "",
        "potencies": {},
        "source": {
            "cardId": "69214b9831723704c1edad68",
            "cardUrl": "https://trello.com/c/Maks7mC4",
            "sectionId": "69214b9831723704c1edad68"
        },
    },
    spider_essence: {
        id: "spider_essence",
        name: "Spider Essence",
        tier: 5,
        category: "Essence",
        type: "Essence",
        attackSpeed: 1.1,
        stats: {
            HexDefense: 10,
            DexterityBoost: 10,
        },
        damageScalings: {
            Dexterity: 0.5,
        },
        perks: {
            "poison_acceleration": 1
        },
        img: "",
        "potencies": {
            "poisonpotency": 2
        },
        "source": {
            "cardId": "69214b9831723704c1edad4a",
            "cardUrl": "https://trello.com/c/mSFAU9kr",
            "sectionId": "69214b9831723704c1edad4a"
        },
    },
    omega_lance_essence: {
        id: "omega_lance_essence",
        name: "Omega Lance Essence",
        tier: 5,
        category: "Essence",
        type: "Essence",
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
        perks: {
            heat_drill: 1,
        },
        img: "",
        "potencies": {},
        "source": {
            "cardId": "69214b9831723704c1edad48",
            "cardUrl": "https://trello.com/c/lW6kW9jz",
            "sectionId": "69214b9831723704c1edad48"
        },
    },
    freezing_bronze_essence: {
        id: "freezing_bronze_essence",
        name: "Freezing Bronze Essence",
        tier: 5,
        category: "Essence",
        type: "Essence",
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
        perks: {
            glacial_buildup: 1,
        },
        img: "",
        "potencies": {},
        "source": {
            "cardId": "69214b9831723704c1edad40",
            "cardUrl": "https://trello.com/c/MREuuMLH",
            "sectionId": "69214b9831723704c1edad40"
        },
    },
    pickaxe_essence: {
        id: "pickaxe_essence",
        name: "Pickaxe Essence",
        tier: 5,
        category: "Essence",
        type: "Essence",
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
        perks: {
            ice_burst: 1,
        },
        img: "",
        "potencies": {},
        "source": {
            "cardId": "69214b9831723704c1edad42",
            "cardUrl": "https://trello.com/c/sfTBd5s1",
            "sectionId": "69214b9831723704c1edad42"
        },
    },
};
