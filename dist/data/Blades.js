let images = "../image/blades/";
export const Blades = {
    basic_blade: {
        id: "basic_blade",
        name: "Basic Blade",
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
    },
    greatsword_blade: {
        id: "greatsword_blade",
        name: "Greatsword Blade",
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
    },
    sharp_blade: {
        id: "sharp_blade",
        name: "Sharp Blade",
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
    },
    dagger_blade: {
        id: "dagger_blade",
        name: "Dagger Blade",
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
    },
    mage_blade: {
        id: "mage_blade",
        name: "Mage Blade",
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
    },
    holy_blade: {
        id: "holy_blade",
        name: "Holy Blade",
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
    },
    hex_blade: {
        id: "hex_blade",
        name: "Hex Blade",
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
    },
    air_blade: {
        id: "air_blade",
        name: "Air Blade",
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
    },
    fire_blade: {
        id: "fire_blade",
        name: "Fire Blade",
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
    },
    water_blade: {
        id: "water_blade",
        name: "Water Blade",
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
    },
    earth_blade: {
        id: "earth_blade",
        name: "Earth Blade",
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
    },
    executioners_blade: {
        id: "executioners_blade",
        name: "Executioners Blade",
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
    },
    iron_hammer: {
        id: "iron_hammer",
        name: "Iron Hammer",
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
    },
    katana_blade: {
        id: "katana_blade",
        name: "Katana Blade",
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
    },
    jagged_blade: {
        id: "jagged_blade",
        name: "Jagged Blade",
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
            bleed_potency: 4,
        },
        img: "",
    },
    sharp_dagger_blade: {
        id: "sharp_dagger_blade",
        name: "Sharp Dagger Blade",
        category: "Blade",
        type: "Small Blade",
        attackSpeed: 1.1,
        stats: {
            DexterityBoost: 10,
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
    },
    agile_blade: {
        id: "agile_blade",
        name: "Agile Blade",
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
    },
    great_mage_blade: {
        id: "great_mage_blade",
        name: "Great Mage Blade",
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
    },
    enchanted_blade: {
        id: "enchanted_blade",
        name: "Enchanted Blade",
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
    },
    radiant_edge: {
        id: "radiant_edge",
        name: "Radiant Edge",
        category: "Blade",
        type: "Small Blade",
        attackSpeed: 1.1,
        stats: {
            HolyBoost: 10,
            DexterityBoost: 5,
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
    },
    pure_blade: {
        id: "pure_blade",
        name: "Pure Blade",
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
    },
    skull_hammer: {
        id: "skull_hammer",
        name: "Skull Hammer",
        category: "Blade",
        type: "Hammer Blade",
        attackSpeed: 1,
        stats: {
            PhysicalDefense: 8,
            HexBoost: 10,
        },
        damageScalings: {
            Hex: 0.35,
            Physical: 0.35,
        },
        damageTypes: {
            Hex: 0.5,
            Physical: 0.5,
        },
        perks: {
            revel_in_death: 1,
        },
        img: "",
    },
    hexing_cleaver_blade: {
        id: "hexing_cleaver_blade",
        name: "Hexing Cleaver Blade",
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
    },
    gust_blade: {
        id: "gust_blade",
        name: "Gust Blade",
        category: "Blade",
        type: "Small Blade",
        attackSpeed: 1.1,
        stats: {
            DexterityBoost: 7,
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
    },
    storm_razor: {
        id: "storm_razor",
        name: "Storm Razor",
        category: "Blade",
        type: "Medium Blade",
        attackSpeed: 1.1,
        stats: {
            MagicBoost: 4,
            DexterityBoost: 4,
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
    },
    flame_dagger: {
        id: "flame_dagger",
        name: "Flame Dagger",
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
    },
    flame_greatblade: {
        id: "flame_greatblade",
        name: "Flame Greatblade",
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
    },
    ocean_blade: {
        id: "ocean_blade",
        name: "Ocean Blade",
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
    },
    ice_blade: {
        id: "ice_blade",
        name: "Ice Blade",
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
    },
    enchanted_lodestone_hammer: {
        id: "enchanted_lodestone_hammer",
        name: "Enchanted Lodestone Hammer",
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
    },
    earth_greatblade: {
        id: "earth_greatblade",
        name: "Earth Greatblade",
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
    },
    scourgers_blade: {
        id: "scourgers_blade",
        name: "Scourgers Blade",
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
    },
    zweihander_blade: {
        id: "zweihander_blade",
        name: "Zweihander Blade",
        category: "Blade",
        type: "Heavy Blade",
        attackSpeed: 0.8,
        stats: {
            Protection: 5,
            PhysicalDefense: 3,
            PhysicalBoost: 10,
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
    },
    gilded_hammer: {
        id: "gilded_hammer",
        name: "Gilded Hammer",
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
    },
    dark_steel_mace: {
        id: "dark_steel_mace",
        name: "Dark Steel Mace",
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
            bleed_potency: 3,
        },
        img: "../image/blades/dark_steel_mace.png",
    },
    serrated_blade: {
        id: "serrated_blade",
        name: "Serrated Blade",
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
            bleed_potency: 3,
        },
        img: "../image/blades/serrated_blade.png",
    },
    bloodied_needle: {
        id: "bloodied_needle",
        name: "Bloodied Needle",
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
            bleed_potency: 3,
        },
        img: "../image/blades/bloodied_needle.png",
    },
    bejeweled_blade: {
        id: "bejeweled_blade",
        name: "Bejeweled Blade",
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
    },
    shadow_blade: {
        id: "shadow_blade",
        name: "Shadow Blade",
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
    },
    kings_dagger_blade: {
        id: "kings_dagger_blade",
        name: "Kings Dagger Blade",
        category: "Blade",
        type: "Small Blade",
        attackSpeed: 1.1,
        stats: {
            DexterityBoost: 15,
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
    },
    beastial_dagger_blade: {
        id: "beastial_dagger_blade",
        name: "Beastial Dagger Blade",
        category: "Blade",
        type: "Small Blade",
        attackSpeed: 1.1,
        stats: {
            DexterityBoost: 10,
            JumpBoost: 2,
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
    },
    duelists_needle: {
        id: "duelists_needle",
        name: "Duelists Needle",
        category: "Blade",
        type: "Medium Blade",
        attackSpeed: 1,
        stats: {
            DexterityBoost: 15,
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
    },
    crude_blade: {
        id: "crude_blade",
        name: "Crude Blade",
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
    },
    grandmagic_greatblade: {
        id: "grandmagic_greatblade",
        name: "Grandmagic Greatblade",
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
    },
    great_mage_core: {
        id: "great_mage_core",
        name: "Great Mage Core",
        category: "Blade",
        type: "Hammer Blade",
        attackSpeed: 1.1,
        stats: {
            MagicBoost: 15,
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
    },
    spellbinder_rapier: {
        id: "spellbinder_rapier",
        name: "Spellbinder Rapier",
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
    },
    curved_magic_blade: {
        id: "curved_magic_blade",
        name: "Curved Magic Blade",
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
    },
    divine_edge: {
        id: "divine_edge",
        name: "Divine Edge",
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
    },
    radiant_hammer: {
        id: "radiant_hammer",
        name: "Radiant Hammer",
        category: "Blade",
        type: "Hammer Blade",
        attackSpeed: 0.9,
        stats: {
            HolyBoost: 10,
            Warding: 20,
        },
        damageScalings: {
            Holy: 0.5,
            Physical: 0.5,
        },
        damageTypes: {
            Holy: 0.7,
            Physical: 0.3,
        },
        perks: {
            divine_intervention: 1,
        },
        img: "",
    },
    hallowed_blade: {
        id: "hallowed_blade",
        name: "Hallowed Blade",
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
    },
    angels_blade: {
        id: "angels_blade",
        name: "Angels Blade",
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
    },
    skull_mace: {
        id: "skull_mace",
        name: "Skull Mace",
        category: "Blade",
        type: "Hammer Blade",
        attackSpeed: 1,
        stats: {
            HexBoost: 10,
            PhysicalDefense: 10,
        },
        damageScalings: {
            Hex: 0.5,
            Physical: 0.5,
        },
        damageTypes: {
            Hex: 0.5,
            Physical: 0.5,
        },
        perks: {
            trusty_servant: 1,
        },
        img: "",
    },
    possessed_blade: {
        id: "possessed_blade",
        name: "Possessed Blade",
        category: "Blade",
        type: "Medium Blade",
        attackSpeed: 1,
        stats: {
            HexBoost: 12,
        },
        damageScalings: {
            Hex: 0.5,
            Magic: 0.5,
        },
        damageTypes: {
            Hex: 1,
        },
        perks: {
            possession: 1,
        },
        img: "",
    },
    cursed_greatsword_blade: {
        id: "cursed_greatsword_blade",
        name: "Cursed Greatsword Blade",
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
    },
    cursed_dagger_blade: {
        id: "cursed_dagger_blade",
        name: "Cursed Dagger Blade",
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
    },
    gale_blade: {
        id: "gale_blade",
        name: "Gale Blade",
        category: "Blade",
        type: "Small Blade",
        attackSpeed: 1.1,
        stats: {
            DexterityBoost: 7,
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
    },
    windiron_needle: {
        id: "windiron_needle",
        name: "Windiron Needle",
        category: "Blade",
        type: "Medium Blade",
        attackSpeed: 1.2,
        stats: {
            DexterityBoost: 7,
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
    },
    storm_splitter: {
        id: "storm_splitter",
        name: "Storm Splitter",
        category: "Blade",
        type: "Medium Blade",
        attackSpeed: 1.1,
        stats: {
            MagicBoost: 8,
            DexterityBoost: 12,
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
    },
    lightning_hammer: {
        id: "lightning_hammer",
        name: "Lightning Hammer",
        category: "Blade",
        type: "Hammer Blade",
        attackSpeed: 1.1,
        stats: {
            MagicBoost: 6,
            PhysicalDefense: 5,
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
    },
    steel_flame_dagger: {
        id: "steel_flame_dagger",
        name: "Steel Flame Dagger",
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
    },
    dragon_flame_dagger: {
        id: "dragon_flame_dagger",
        name: "Dragon Flame Dagger",
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
        perks: {
            dragon_breath: 1,
            burn_potency: 2,
        },
        img: "",
    },
    blue_flame_greatblade: {
        id: "blue_flame_greatblade",
        name: "Blue Flame Greatblade",
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
            burn_potency: 3,
        },
        img: "",
    },
    cragstone_hammer: {
        id: "cragstone_hammer",
        name: "Cragstone Hammer",
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
    },
    wave_blade: {
        id: "wave_blade",
        name: "Wave Blade",
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
    },
    golden_trident: {
        id: "golden_trident",
        name: "Golden Trident",
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
    },
    icicle: {
        id: "icicle",
        name: "Icicle",
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
            bleed_potency: 3,
        },
        img: "",
    },
    sculpted_blade: {
        id: "sculpted_blade",
        name: "Sculpted Blade",
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
    },
    gravitational_greatblade: {
        id: "gravitational_greatblade",
        name: "Gravitational Greatblade",
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
    },
    gravitational_core: {
        id: "gravitational_core",
        name: "Gravitational Core",
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
    },
    earth_spirit_greatblade: {
        id: "earth_spirit_greatblade",
        name: "Earth Spirit Greatblade",
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
    },
    sand_glaive: {
        id: "sand_glaive",
        name: "Sand Glaive",
        category: "Blade",
        type: "Medium Blade",
        attackSpeed: 1.1,
        stats: {
            EarthBoost: 8,
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
    },
    prism_blade: {
        id: "prism_blade",
        name: "Prism Blade",
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
    },
    starlight_greatblade: {
        id: "starlight_greatblade",
        name: "Starlight Greatblade",
        category: "Blade",
        type: "Heavy Blade",
        attackSpeed: 1,
        stats: {
            HolyBoost: 5,
            HexBoost: 5,
            MagicBoost: 5,
            FireBoost: 5,
            WaterBoost: 5,
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
    },
    swaxe: {
        id: "swaxe",
        name: "Swaxe",
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
    },
    bloodiron_sawblade: {
        id: "bloodiron_sawblade",
        name: "Bloodiron Sawblade",
        category: "Blade",
        type: "Medium Blade",
        attackSpeed: 1,
        stats: {
            PhysicalBoost: 5,
        },
        damageScalings: {
            Physical: 0.7,
        },
        damageTypes: {
            Physical: 1,
        },
        perks: {
            rotating_blades: 1,
            bleed_potency: 3,
        },
        img: "",
    },
    dragonslayer_blade: {
        id: "dragonslayer_blade",
        name: "Dragonslayer Blade",
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
    },
    murky_blade: {
        id: "murky_blade",
        name: "Murky Blade",
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
            poison_potency: 2,
        },
        img: "",
    },
    spectral_blade: {
        id: "spectral_blade",
        name: "Spectral Blade",
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
            poison_potency: 2,
        },
        img: "../image/blades/spectralblade.png",
    },
    poisonous_blade: {
        id: "poisonous_blade",
        name: "Poisonous Blade",
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
            poison_potency: 3,
        },
        img: "",
    },
    venomous_blade: {
        id: "venomous_blade",
        name: "Venomous Blade",
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
            poison_potency: 2,
        },
        img: "",
    },
    honeycomb_greatblade: {
        id: "honeycomb_greatblade",
        name: "Honeycomb Greatblade",
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
    },
    honeysteel_greatblade: {
        id: "honeysteel_greatblade",
        name: "Honeysteel Greatblade",
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
    },
    honey_bumblz_mace: {
        id: "honey_bumblz_mace",
        name: "Honey Bumblz Mace",
        category: "Blade",
        type: "Hammer",
        attackSpeed: 1,
        stats: {
            MagicBoost: 4,
            PhysicalBoost: 4,
        },
        damageScalings: {
            Magic: 0.35,
            Physical: 0.35,
        },
        damageTypes: {
            Magic: 0.5,
            Physical: 0.5,
        },
        perks: {
            queens_guard: 1,
        },
        img: "",
    },
    queen_bumblz_core: {
        id: "queen_bumblz_core",
        name: "Queen Bumblz Core",
        category: "Blade",
        type: "Hammer",
        attackSpeed: 1,
        stats: {
            MagicBoost: 5,
            HolyBoost: 5,
            PhysicalBoost: 5,
        },
        damageScalings: {
            Magic: 0.4,
            Physical: 0.4,
            Holy: 0.4,
        },
        damageTypes: {
            Physical: 0.3,
            Magic: 0.35,
            Holy: 0.35,
        },
        perks: {
            reinforced_block: 1,
            queens_power: 1,
        },
        img: "",
    },
    magic_great_hammer: {
        id: "magic_great_hammer",
        name: "Magic Great Hammer",
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
    },
    dynamite_stick: {
        id: "dynamite_stick",
        name: "Dynamite Stick",
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
    },
    dynamite_bundle: {
        id: "dynamite_bundle",
        name: "Dynamite Bundle",
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
    },
    timed_dynamite_bundle: {
        id: "timed_dynamite_bundle",
        name: "Timed Dynamite Bundle",
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
    },
    stratos_core: {
        id: "stratos_core",
        name: "Stratos Core",
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
    },
    lightning_stratos_core: {
        id: "lightning_stratos_core",
        name: "Lightning Stratos Core",
        category: "Blade",
        type: "Hammer Blade",
        attackSpeed: 1,
        stats: {
            MagicBoost: 10,
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
    },
    caci_blade: {
        id: "caci_blade",
        name: "Caci Blade",
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
    },
    caci_kings_blade: {
        id: "caci_kings_blade",
        name: "Caci Kings Blade",
        category: "Blade",
        type: "Medium Blade",
        attackSpeed: 1.1,
        stats: {
            DexterityBoost: 5,
            PhysicalBoost: 5,
            EarthBoost: 5,
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
            bleed_potency: 2,
        },
        img: "",
    },
    buni_prince_hammer: {
        id: "buni_prince_hammer",
        name: "Buni Prince Hammer",
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
    },
    buni_prince_cannon: {
        id: "buni_prince_cannon",
        name: "Buni Prince Cannon",
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
    },
    ancient_mallet: {
        id: "ancient_mallet",
        name: "Ancient Mallet",
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
    },
    bastion_greatswaxe_blade: {
        id: "bastion_greatswaxe_blade",
        name: "Bastion Greatswaxe Blade",
        category: "Blade",
        type: "Heavy Blade",
        attackSpeed: 1.1,
        stats: {
            EarthBoost: 8,
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
    },
    relic_short_blade: {
        id: "relic_short_blade",
        name: "Relic Short Blade",
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
    },
    bastion_relic_blade: {
        id: "bastion_relic_blade",
        name: "Bastion Relic Blade",
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
    },
    vaen_kama: {
        id: "vaen_kama",
        name: "Vaen Kama",
        category: "Blade",
        type: "Small Blade",
        attackSpeed: 1.1,
        stats: {
            PhysicalBoost: 5,
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
    },
    lord_vaen_blade: {
        id: "lord_vaen_blade",
        name: "Lord Vaen Blade",
        category: "Blade",
        type: "Small Blade",
        attackSpeed: 1.1,
        stats: {
            PhysicalBoost: 10,
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
            bleed_potency: 3,
        },
        img: "",
    },
    mungal_mallet: {
        id: "mungal_mallet",
        name: "Mungal Mallet",
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
            poison_potency: 3,
        },
        img: "",
    },
    mungus_core: {
        id: "mungus_core",
        name: "Mungus Core",
        category: "Blade",
        type: "Hammer",
        attackSpeed: 1,
        stats: {
            EarthBoost: 5,
            MagicBoost: 5,
            HexBoost: 5,
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
    },
    spider_fang_blade: {
        id: "spider_fang_blade",
        name: "Spider Fang Blade",
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
            poison_potency: 2,
        },
        img: "",
    },
    omega_lance_blade: {
        id: "omega_lance_blade",
        name: "Omega Lance Blade",
        category: "Blade",
        type: "Heavy Blade",
        attackSpeed: 1,
        stats: {
            DexterityBoost: 5,
            PhysicalBoost: 5,
            FireBoost: 5,
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
    },
    bronze_frozen_pick: {
        id: "bronze_frozen_pick",
        name: "Bronze Frozen Pick",
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
    },
    frozen_pickaxe_head: {
        id: "frozen_pickaxe_head",
        name: "Frozen Pickaxe Head",
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
    },
};
