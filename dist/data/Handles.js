let images = "../image/handles/";
export const Handles = {
    basic_handle: {
        id: "basic_handle",
        name: "Basic Handle",
        category: "Handle",
        type: "Medium Handle",
        attackSpeed: 1,
        damageScalings: {
            Physical: 0.15,
            Dexterity: 0.15,
        },
        img: "../image/handles/basichandle.png",
    },
    long_handle: {
        id: "long_handle",
        name: "Long Handle",
        category: "Handle",
        type: "Long Handle",
        attackSpeed: 0.8,
        stats: {
            PhysicalDefense: 5,
        },
        damageScalings: {
            Physical: 0.4,
        },
        img: "",
    },
    reinforced_handle: {
        id: "reinforced_handle",
        name: "Reinforced Handle",
        category: "Handle",
        type: "Medium Handle",
        attackSpeed: 1,
        stats: {
            PhysicalBoost: 5,
        },
        damageScalings: {
            Physical: 0.3,
            Dexterity: 0.3,
        },
        img: "",
    },
    agile_handle: {
        id: "agile_handle",
        name: "Agile Handle",
        category: "Handle",
        type: "Medium Handle",
        attackSpeed: 1.1,
        stats: {
            DexterityBoost: 5,
        },
        damageScalings: {
            Physical: 0.3,
            Dexterity: 0.3,
        },
        img: "",
    },
    magewood_handle: {
        id: "magewood_handle",
        name: "Magewood Handle",
        category: "Handle",
        type: "Medium Handle",
        attackSpeed: 1,
        stats: {
            MagicBoost: 5,
        },
        damageScalings: {
            Magic: 0.4,
        },
        img: "",
    },
    holywood_handle: {
        id: "holywood_handle",
        name: "Holywood Handle",
        category: "Handle",
        type: "Medium Handle",
        attackSpeed: 1,
        stats: {
            MagicBoost: 5,
            HolyBoost: 5,
        },
        damageScalings: {
            Magic: 0.3,
            Holy: 0.3,
        },
        img: "",
    },
    cursewood_handle: {
        id: "cursewood_handle",
        name: "Cursewood Handle",
        category: "Handle",
        type: "Medium Handle",
        attackSpeed: 1,
        stats: {
            MagicBoost: 5,
            HexBoost: 5,
        },
        damageScalings: {
            Magic: 0.3,
            Hex: 0.3,
        },
        img: "",
    },
    windiron_handle: {
        id: "windiron_handle",
        name: "Windiron Handle",
        category: "Handle",
        type: "Medium Handle",
        attackSpeed: 1.1,
        stats: {
            DexterityBoost: 5,
            AirBoost: 5,
        },
        damageScalings: {
            Dexterity: 0.3,
            Air: 0.3,
        },
        img: "",
    },
    blazewood_handle: {
        id: "blazewood_handle",
        name: "Blazewood Handle",
        category: "Handle",
        type: "Medium Handle",
        attackSpeed: 1,
        stats: {
            MagicBoost: 5,
            FireBoost: 5,
        },
        damageScalings: {
            Magic: 0.3,
            Fire: 0.3,
        },
        img: "",
    },
    aquasteel_handle: {
        id: "aquasteel_handle",
        name: "Aquasteel Handle",
        category: "Handle",
        type: "Medium Handle",
        attackSpeed: 1.1,
        stats: {
            WaterBoost: 5,
            MagicBoost: 5,
        },
        damageScalings: {
            Magic: 0.3,
            Water: 0.3,
        },
        img: "",
    },
    brass_handle: {
        id: "brass_handle",
        name: "Brass Handle",
        category: "Handle",
        type: "Medium Handle",
        attackSpeed: 0.85,
        stats: {
            EarthBoost: 5,
            PhysicalBoost: 5,
        },
        damageScalings: {
            Earth: 0.35,
            Physical: 0.35,
        },
        img: "",
    },
    executioners_handle: {
        id: "executioners_handle",
        name: "Executioners Handle",
        category: "Handle",
        type: "Long Handle",
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
    },
    reinforced_pole: {
        id: "reinforced_pole",
        name: "Reinforced Pole",
        category: "Handle",
        type: "Pole",
        attackSpeed: 1,
        stats: {
            PhysicalDefense: 4,
            PhysicalBoost: 4,
        },
        damageScalings: {
            Physical: 0.5,
        },
        perks: {
            reinforced_block: 1,
        },
        img: "",
    },
    katana_handle: {
        id: "katana_handle",
        name: "Katana Handle",
        category: "Handle",
        type: "Long Handle",
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
    },
    jagged_handle: {
        id: "jagged_handle",
        name: "Jagged Handle",
        category: "Handle",
        type: "Medium Handle",
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
            serrated_edge: 1,
            bleed_potency: 4,
        },
        img: "",
    },
    noble_handle: {
        id: "noble_handle",
        name: "Noble Handle",
        category: "Handle",
        type: "Medium Handle",
        attackSpeed: 1.1,
        stats: {
            DexterityBoost: 10,
        },
        damageScalings: {
            Dexterity: 0.5,
        },
        perks: {
            vital_strikes: 1,
        },
        img: "",
    },
    graceful_handle: {
        id: "graceful_handle",
        name: "Graceful Handle",
        category: "Handle",
        type: "Medium Handle",
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
    },
    magewood_long_handle: {
        id: "magewood_long_handle",
        name: "Magewood Long Handle",
        category: "Handle",
        type: "Long Handle",
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
    },
    enchantwood_handle: {
        id: "enchantwood_handle",
        name: "Enchantwood Handle",
        category: "Handle",
        type: "Medium Handle",
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
    },
    gilded_pole: {
        id: "gilded_pole",
        name: "Gilded Pole",
        category: "Handle",
        type: "Pole",
        attackSpeed: 1,
        stats: {
            HolyBoost: 6,
            DexterityBoost: 6,
        },
        damageScalings: {
            Holy: 0.4,
            Dexterity: 0.4,
        },
        perks: {
            reinforced_block: 1,
        },
        img: "",
    },
    purewood_handle: {
        id: "purewood_handle",
        name: "Purewood Handle",
        category: "Handle",
        type: "Medium Handle",
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
    },
    summoning_pole: {
        id: "summoning_pole",
        name: "Summoning Pole",
        category: "Handle",
        type: "Pole",
        attackSpeed: 1,
        stats: {
            PhysicalDefense: 4,
            HexBoost: 8,
        },
        damageScalings: {
            Hex: 0.35,
            Physical: 0.35,
        },
        perks: {
            revel_in_death: 1,
        },
        img: "",
    },
    hexsteel_handle: {
        id: "hexsteel_handle",
        name: "Hexsteel Handle",
        category: "Handle",
        type: "Medium Handle",
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
    },
    refined_windiron_handle: {
        id: "refined_windiron_handle",
        name: "Refined Windiron Handle",
        category: "Handle",
        type: "Medium Handle",
        attackSpeed: 1.1,
        stats: {
            DexterityBoost: 7,
        },
        damageScalings: {
            Air: 0.4,
            Dexterity: 0.4,
        },
        perks: {
            tailwind: 2,
        },
        img: "",
    },
    stormwood_handle: {
        id: "stormwood_handle",
        name: "Stormwood Handle",
        category: "Handle",
        type: "Long Handle",
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
        perks: {
            parry: 1,
            stormcaller: 1,
        },
        img: "",
    },
    kindlewood_handle: {
        id: "kindlewood_handle",
        name: "Kindlewood Handle",
        category: "Handle",
        type: "Medium Handle",
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
    },
    cragflame_handle: {
        id: "cragflame_handle",
        name: "Cragflame Handle",
        category: "Handle",
        type: "Long Handle",
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
    },
    sunkenwood_handle: {
        id: "sunkenwood_handle",
        name: "Sunkenwood Handle",
        category: "Handle",
        type: "Medium Handle",
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
    },
    frozen_handle: {
        id: "frozen_handle",
        name: "Frozen Handle",
        category: "Handle",
        type: "Medium Handle",
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
    },
    enchanted_stone_handle: {
        id: "enchanted_stone_handle",
        name: "Enchanted Stone Handle",
        category: "Handle",
        type: "Medium Handle",
        attackSpeed: 0.9,
        stats: {
            EarthBoost: 5,
            MagicBoost: 5,
        },
        damageScalings: {
            Earth: 0.4,
            Magic: 0.4,
        },
        perks: {
            gravity_well: 1,
        },
        img: "",
    },
    bedrock_handle: {
        id: "bedrock_handle",
        name: "Bedrock Handle",
        category: "Handle",
        type: "Long Handle",
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
    },
    scourgers_Handle: {
        id: "scourgers_Handle",
        name: "Scourgers Handle",
        category: "Handle",
        type: "Long Handle",
        attackSpeed: 0.8,
        stats: {
            PhysicalBoost: 15,
            PhysicalDefense: 5,
            Warding: 20,
        },
        damageScalings: {
            Physical: 0.7,
        },
        perks: {
            scourge: 1,
        },
        img: "../image/handles/scourgers_handle.png",
    },
    zweihander_handle: {
        id: "zweihander_handle",
        name: "Zweihander Handle",
        category: "Handle",
        type: "Long Handle",
        attackSpeed: 1,
        stats: {
            PhysicalBoost: 10,
            PhysicalDefense: 3,
            Protection: 5,
        },
        damageScalings: {
            Physical: 0.55,
            Dexterity: 0.55,
        },
        perks: {
            highlander: 1,
        },
        img: "../image/handles/zweihander_handle.png",
    },
    reinforced_gilded_pole: {
        id: "reinforced_gilded_pole",
        name: "Reinforced Gilded Pole",
        category: "Handle",
        type: "Pole",
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
            reinforced_block: 2,
            aggressive_personality: 1,
        },
        img: "",
    },
    spike_pole: {
        id: "spike_pole",
        name: "Spike Pole",
        category: "Handle",
        type: "Pole",
        attackSpeed: 1.1,
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
            hemorrhage: 1,
            bleed_potency: 3,
        },
        img: "../image/handles/spike_pole.png",
    },
    serrated_handle: {
        id: "serrated_handle",
        name: "Serrated Handle",
        category: "Handle",
        type: "Long Handle",
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
            Physical: 0.1,
        },
        perks: {
            vicious_edge: 1,
            bleed_potency: 3,
        },
        img: "../image/handles/serrated_handle.png",
    },
    bloodied_guard: {
        id: "bloodied_guard",
        name: "Bloodied Guard",
        category: "Handle",
        type: "Medium Handle",
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
            duelist_stance: 1,
            bloodlust: 1,
            bleed_potency: 3,
        },
        img: "../image/handles/bloodied_guard.png",
    },
    bejeweled_handle: {
        id: "bejeweled_handle",
        name: "Bejeweled Handle",
        category: "Handle",
        type: "Long Handle",
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
    },
    shadow_handle: {
        id: "shadow_handle",
        name: "Shadow Handle",
        category: "Handle",
        type: "Medium Handle",
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
            Physical: 0.1,
        },
        perks: {
            dual_wielding: 1,
            phantom_pain: 1,
        },
        img: "",
    },
    kings_handle: {
        id: "kings_handle",
        name: "Kings Handle",
        category: "Handle",
        type: "Medium Handle",
        attackSpeed: 1.1,
        stats: {
            DexterityBoost: 15,
        },
        damageScalings: {
            Dexterity: 0.7,
        },
        perks: {
            golden_crits: 1,
        },
        img: "",
    },
    beastial_handle: {
        id: "beastial_handle",
        name: "Beastial Handle",
        category: "Handle",
        type: "Medium Handle",
        attackSpeed: 1,
        stats: {
            DexterityBoost: 10,
            JumpBoost: 2,
        },
        damageScalings: {
            Dexterity: 0.55,
            Physical: 0.55,
        },
        damageTypes: {
            Physical: 0.1,
        },
        perks: {
            beastial_rage: 1,
        },
        img: "../image/handles/beastial_handle.png",
    },
    duelists_handle: {
        id: "duelists_handle",
        name: "Duelists Handle",
        category: "Handle",
        type: "Medium Handle",
        attackSpeed: 1,
        stats: {
            DexterityBoost: 15,
        },
        damageScalings: {
            Dexterity: 0.7,
        },
        perks: {
            duelist_stance: 1,
            piercer: 1,
        },
        img: "",
    },
    sturdy_handle: {
        id: "sturdy_handle",
        name: "Sturdy Handle",
        category: "Handle",
        type: "Medium Handle",
        attackSpeed: 1.1,
        stats: {
            PhysicalBoost: 10,
            DexterityBoost: 10,
        },
        damageScalings: {
            Physical: 0.55,
            Dexterity: 0.55,
        },
        perks: {
            dual_wielding: 1,
            savage_combo: 1,
        },
        img: "",
    },
    grandmagic_long_handle: {
        id: "grandmagic_long_handle",
        name: "Grandmagic Long Handle",
        category: "Handle",
        type: "Long Handle",
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
    },
    reinforced_magewood_pole: {
        id: "reinforced_magewood_pole",
        name: "Reinforced Magewood Pole",
        category: "Handle",
        type: "Pole",
        attackSpeed: 1.1,
        stats: {
            MagicBoost: 15,
        },
        damageScalings: {
            Magic: 0.7,
        },
        damageTypes: {
            Magic: 0.1,
        },
        perks: {
            reinforced_block: 1,
            glyph_conduit: 1,
        },
        img: "",
    },
    spellbinderguard: {
        id: "spellbinderguard",
        name: "Spellbinder Guard",
        category: "Handle",
        type: "Medium Handle",
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
            Magic: 0.2,
        },
        perks: {
            spell_piercer: 1,
            duelist_stance: 1,
        },
        img: "",
    },
    crude_magic_handle: {
        id: "crude_magic_handle",
        name: "Crude Magic Handle",
        category: "Handle",
        type: "Medium Handle",
        attackSpeed: 1,
        stats: {
            MagicBoost: 20,
        },
        damageScalings: {
            Magic: 0.7,
        },
        perks: {
            dual_wielding: 1,
            runic_blades: 1,
        },
        img: "",
    },
    blessed_pole: {
        id: "blessed_pole",
        name: "Blessed Pole",
        category: "Handle",
        type: "Pole",
        attackSpeed: 1,
        stats: {
            HolyBoost: 15,
            DexterityBoost: 10,
        },
        damageScalings: {
            Holy: 0.55,
            Dexterity: 0.55,
        },
        perks: {
            radiance: 1,
            divinity: 1,
        },
        img: "",
    },
    sacred_pole: {
        id: "sacred_pole",
        name: "Sacred Pole",
        category: "Handle",
        type: "Pole",
        attackSpeed: 1,
        stats: {
            HolyBoost: 10,
            Warding: 20,
        },
        damageScalings: {
            Holy: 0.5,
            Physical: 0.5,
        },
        perks: {
            reinforced_block: 1,
            divine_intervention: 1,
        },
        img: "",
    },
    hallowedwood_handle: {
        id: "hallowedwood_handle",
        name: "Hallowedwood Handle",
        category: "Handle",
        type: "Long Handle",
        attackSpeed: 1,
        stats: {
            HolyBoost: 10,
            Warding: 20,
        },
        damageScalings: {
            Holy: 0.7,
        },
        perks: {
            blessing: 1,
            light_bearer: 1,
        },
        img: "",
    },
    angelwood_handle: {
        id: "angelwood_handle",
        name: "Angelwood Handle",
        category: "Handle",
        type: "Medium Handle",
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
    },
    skull_summoners_pole: {
        id: "skull_summoners_pole",
        name: "Skull Summoners Pole",
        category: "Handle",
        type: "Pole",
        attackSpeed: 1,
        stats: {
            HexBoost: 10,
            PhysicalDefense: 4,
        },
        damageScalings: {
            Hex: 0.5,
            Physical: 0.5,
        },
        perks: {
            trusty_servant: 1,
            reinforced_block: 1,
        },
        img: "",
    },
    necrotic_handle: {
        id: "necrotic_handle",
        name: "Necrotic Handle",
        category: "Handle",
        type: "Medium Handle",
        attackSpeed: 1,
        stats: {
            HexBoost: 10,
        },
        damageScalings: {
            Hex: 0.5,
            Magic: 0.5,
        },
        perks: {
            possession: 1,
        },
        img: "",
    },
    cursed_handle: {
        id: "cursed_handle",
        name: "Cursed Handle",
        category: "Handle",
        type: "Long Handle",
        attackSpeed: 0.9,
        stats: {
            HexBoost: 15,
            MagicDefense: 5,
        },
        damageScalings: {
            Hex: 0.7,
        },
        damageTypes: {
            Hex: 0.1,
        },
        perks: {
            weakening: 1,
            endless_despair: 1,
        },
        img: "",
    },
    cursesteel_handle: {
        id: "cursesteel_handle",
        name: "Cursesteel Handle",
        category: "Handle",
        type: "Medium Handle",
        attackSpeed: 1.1,
        stats: {
            HexBoost: 10,
            DexterityBoost: 10,
        },
        damageScalings: {
            Hex: 0.55,
            Dexterity: 0.55,
        },
        perks: {
            weakening: 1,
            curse_rip: 1,
        },
        img: "",
    },
    gustiron_handle: {
        id: "gustiron_handle",
        name: "Gustiron Handle",
        category: "Handle",
        type: "Medium Handle",
        attackSpeed: 1.1,
        stats: {
            DexterityBoost: 7,
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
    },
    gilded_windiron_guard: {
        id: "gilded_windiron_guard",
        name: "Gilded Windiron Guard",
        category: "Handle",
        type: "Medium Handle",
        attackSpeed: 1.1,
        stats: {
            DexterityBoost: 15,
        },
        damageScalings: {
            Air: 0.55,
            Dexterity: 0.55,
        },
        perks: {
            duelist_stance: 1,
            gale_bursts: 1,
            tailwind: 1,
        },
        img: "",
    },
    lightningstruck_pole: {
        id: "lightningstruck_pole",
        name: "Lightningstruck Pole",
        category: "Handle",
        type: "Pole",
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
        perks: {
            storm_rend: 1,
        },
        img: "",
    },
    thunderwood_handle: {
        id: "thunderwood_handle",
        name: "Thunderwood Handle",
        category: "Handle",
        type: "Long Handle",
        attackSpeed: 1.1,
        stats: {
            MagicBoost: 6,
            PhysicalDefense: 5,
        },
        damageScalings: {
            Air: 0.55,
            Magic: 0.55,
        },
        perks: {
            static_buildup: 1,
        },
        img: "",
    },
    steel_flame_handle: {
        id: "steel_flame_handle",
        name: "Steel Flame Handle",
        category: "Handle",
        type: "Medium Handle",
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
    },
    dragonwood_pole: {
        id: "dragonwood_pole",
        name: "Dragonwood Pole",
        category: "Handle",
        type: "Pole",
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
            dragon_breath: 1,
            burn_potency: 2,
        },
        img: "",
    },
    exhaust_handle: {
        id: "exhaust_handle",
        name: "Exhaust Handle",
        category: "Handle",
        type: "Long Handle",
        attackSpeed: 1,
        stats: {
            PhysicalDefense: 5,
            FireBoost: 10,
        },
        damageScalings: {
            Fire: 0.7,
        },
        perks: {
            exhaust: 1,
            burn_potency: 3,
        },
        img: "",
    },
    cragstone_pole: {
        id: "cragstone_pole",
        name: "Cragstone Pole",
        category: "Handle",
        type: "Pole",
        attackSpeed: 1,
        stats: {
            EarthBoost: 5,
            FireBoost: 5,
            PhysicalDefense: 5,
        },
        damageScalings: {
            Fire: 0.55,
            Earth: 0.55,
        },
        damageTypes: {
            Fire: 0.1,
        },
        perks: {
            tectonic_heat: 1,
        },
        img: "",
    },
    wave_great_handle: {
        id: "wave_great_handle",
        name: "Wave Great Handle",
        category: "Handle",
        type: "Long Handle",
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
            extinguish: 1,
        },
        img: "",
    },
    ornate_pole: {
        id: "ornate_pole",
        name: "Ornate Pole",
        category: "Handle",
        type: "Pole",
        attackSpeed: 1.2,
        stats: {
            PhysicalDefense: 5,
            HolyBoost: 2.5,
            WaterBoost: 7.5,
        },
        damageScalings: {
            Water: 0.55,
            Holy: 0.55,
        },
        perks: {
            holy_tides: 1,
            reinforced_block: 1,
        },
        img: "",
    },
    frozen_guard: {
        id: "frozen_guard",
        name: "Frozen Guard",
        category: "Handle",
        type: "Medium Handle",
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
            frostbite: 1,
            duelist_stance: 1,
            gelid_lance: 1,
            bleed_potency: 3,
        },
        img: "",
    },
    sculpted_handle: {
        id: "sculpted_handle",
        name: "Sculpted Handle",
        category: "Handle",
        type: "Medium Handle",
        attackSpeed: 1,
        stats: {
            HeatResistance: 50,
            WaterBoost: 8.5,
            PhysicalBoost: 8.5,
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
    },
    gravitational_handle: {
        id: "gravitational_handle",
        name: "Gravitational Handle",
        category: "Handle",
        type: "Long Handle",
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
    },
    gravitational_pole: {
        id: "gravitational_pole",
        name: "Gravitational Pole",
        category: "Handle",
        type: "Pole",
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
            gravity_well: 2,
        },
        img: "",
    },
    earth_spirit_handle: {
        id: "earth_spirit_handle",
        name: "Earth Spirit Handle",
        category: "Handle",
        type: "Long Handle",
        attackSpeed: 0.8,
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
            stoneskin: 1,
        },
        img: "",
    },
    sandstone_handle: {
        id: "sandstone_handle",
        name: "Sandstone Handle",
        category: "Handle",
        type: "Pole",
        attackSpeed: 1.1,
        stats: {
            EarthBoost: 8,
        },
        damageScalings: {
            Air: 0.55,
            Earth: 0.55,
        },
        perks: {
            quicksand: 1,
        },
        img: "",
    },
    prism_handle: {
        id: "prism_handle",
        name: "Prism Handle",
        category: "Handle",
        type: "Medium Handle",
        attackSpeed: 1.1,
        damageScalings: {
            Physical: 0.15,
            Magic: 0.15,
        },
        img: "",
    },
    starlight_handle: {
        id: "starlight_handle",
        name: "Starlight Handle",
        category: "Handle",
        type: "Long Handle",
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
        perks: {
            star_struck: 1,
        },
        img: "",
    },
    bloodengine_handle: {
        id: "bloodengine_handle",
        name: "Bloodengine Handle",
        category: "Handle",
        type: "Long Handle",
        attackSpeed: 1,
        stats: {
            PhysicalBoost: 5,
        },
        damageScalings: {
            Physical: 0.7,
        },
        perks: {
            saw_stance: 1,
            bleed_potency: 3,
        },
        img: "",
    },
    enchained_handle: {
        id: "enchained_handle",
        name: "Enchained Handle",
        category: "Handle",
        type: "Medium Handle",
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
    },
    murkwater_handle: {
        id: "murkwater_handle",
        name: "Murkwater Handle",
        category: "Handle",
        type: "Medium Handle",
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
            pure_rot: 1,
            poison_potency: 2,
        },
        img: "",
    },
    spectral_handle: {
        id: "spectral_handle",
        name: "Spectral Handle",
        category: "Handle",
        type: "Medium Handle",
        attackSpeed: 0.9,
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
            ghastly_rot: 1,
            poison_potency: 2,
        },
        img: "../image/handles/spectralhandle.png",
    },
    rotwood_pole: {
        id: "rotwood_pole",
        name: "Rotwood Pole",
        category: "Handle",
        type: "Pole",
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
            reinforced_block: 1,
            poisonous: 1,
            poison_potency: 4,
        },
        img: "",
    },
    snake_venom_pole: {
        id: "snake_venom_pole",
        name: "Snake Venom Pole",
        category: "Handle",
        type: "Pole",
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
            reinforced_block: 1,
            venom_spitter: 1,
            poison_potency: 4,
        },
        img: "",
    },
    honeycomb_handle: {
        id: "honeycomb_handle",
        name: "Honeycomb Handle",
        category: "Handle",
        type: "Large Handle",
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
    },
    honeysteel_handle: {
        id: "honeysteel_handle",
        name: "Honeysteel Handle",
        category: "Handle",
        type: "Large Handle",
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
    },
    honey_bumblz_pole: {
        id: "honey_bumblz_pole",
        name: "Honey Bumblz Pole",
        category: "Handle",
        type: "Pole",
        attackSpeed: 1,
        stats: {
            MagicBoost: 4,
            PhysicalBoost: 4,
        },
        damageScalings: {
            Magic: 0.35,
            Physical: 0.35,
        },
        perks: {
            reinforced_block: 1,
            queens_guard: 1,
        },
        img: "",
    },
    queen_bumblz_pole: {
        id: "queen_bumblz_pole",
        name: "Queen Bumblz Pole",
        category: "Handle",
        type: "Pole",
        attackSpeed: 1,
        stats: {
            MagicBoost: 5,
            HolyBoost: 5,
            PhysicalBoost: 5,
        },
        damageScalings: {
            Physical: 0.4,
            Magic: 0.4,
            Holy: 0.4,
        },
        perks: {
            reinforced_block: 1,
            queens_power: 1,
        },
        img: "",
    },
    magic_great_hammer_pole: {
        id: "magic_great_hammer_pole",
        name: "Magic Great Hammer Pole",
        category: "Handle",
        type: "Pole",
        attackSpeed: 0.8,
        stats: {
            MagicBoost: 7,
            PhysicalDefense: 5,
            Warding: 20,
        },
        damageScalings: {
            Magic: 0.8,
        },
        damageTypes: {
            Magic: 0.2,
        },
        perks: {
            energize: 1,
            reinforced_block: 1,
        },
        img: "",
    },
    stratos_pole: {
        id: "stratos_pole",
        name: "Stratos Pole",
        category: "Handle",
        type: "Pole",
        attackSpeed: 1,
        damageScalings: {
            Air: 0.55,
        },
        perks: {
            reinforced_block: 1,
            air_barrier: 1,
        },
        img: "",
    },
    lightning_stratos_pole: {
        id: "lightning_stratos_pole",
        name: "Lightning Stratos Pole",
        category: "Handle",
        type: "Pole",
        attackSpeed: 1,
        stats: {
            MagicBoost: 13,
        },
        damageScalings: {
            Air: 0.55,
            Magic: 0.55,
        },
        perks: {
            reinforced_block: 1,
            power_surge: 1,
        },
        img: "",
    },
    caci_handle: {
        id: "caci_handle",
        name: "Caci Handle",
        category: "Handle",
        type: "Medium Handle",
        attackSpeed: 1.1,
        stats: {
            DexterityBoost: 5,
            PhysicalBoost: 5,
        },
        damageScalings: {
            Dexterity: 0.4,
            Physical: 0.4,
        },
        perks: {
            thorns: 2,
            dual_wielding: 1,
        },
        img: "",
    },
    caci_kings_handle: {
        id: "caci_kings_handle",
        name: "Caci Kings Handle",
        category: "Handle",
        type: "Medium Handle",
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
        perks: {
            dual_wielding: 1,
            sandy_wounds: 1,
            bleed_potency: 2,
        },
        img: "",
    },
    buni_prince_pole: {
        id: "buni_prince_pole",
        name: "Buni Prince Pole",
        category: "Handle",
        type: "Pole",
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
            reinforced_block: 1,
        },
        img: "",
    },
    buni_prince_cannon_pole: {
        id: "buni_prince_cannon_pole",
        name: "Buni Prince Cannon Pole",
        category: "Handle",
        type: "Pole",
        attackSpeed: 1,
        stats: {
            PhysicalDefense: 10,
            PhysicalBoost: 15,
        },
        damageScalings: {
            Physical: 0.7,
        },
        perks: {
            springblast: 1,
            reinforced_block: 1,
        },
        img: "",
    },
    ancient_handle: {
        id: "ancient_handle",
        name: "Ancient Handle",
        category: "Handle",
        type: "Medium Handle",
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
    },
    bastion_greatswaxe_handle: {
        id: "bastion_greatswaxe_handle",
        name: "Bastion Greatswaxe Handle",
        category: "Handle",
        type: "Medium Handle",
        attackSpeed: 1.1,
        stats: {
            EarthBoost: 8,
        },
        damageScalings: {
            Earth: 0.8,
        },
        perks: {
            golem_guillotine: 1,
        },
        img: "",
    },
    relic_handle: {
        id: "relic_handle",
        name: "Relic Handle",
        category: "Handle",
        type: "Medium Handle",
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
    },
    bastion_relic_handle: {
        id: "bastion_relic_handle",
        name: "Bastion Relic Handle",
        category: "Handle",
        type: "Long Handle",
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
    },
    vaen_handle: {
        id: "vaen_handle",
        name: "Vaen Handle",
        category: "Handle",
        type: "Medium Handle",
        attackSpeed: 1.1,
        stats: {
            PhysicalBoost: 5,
        },
        damageScalings: {
            Air: 0.4,
            Physical: 0.4,
        },
        perks: {
            crimson_tithe: 1,
        },
        img: "",
    },
    lord_vaen_scythe_pole: {
        id: "lord_vaen_scythe_pole",
        name: "Lord Vaen Scythe Pole",
        category: "Handle",
        type: "Pole",
        attackSpeed: 1.1,
        stats: {
            PhysicalBoost: 10,
        },
        damageScalings: {
            Air: 0.55,
            Physical: 0.55,
        },
        perks: {
            ichor_spark: 1,
            bleed_potency: 3,
        },
        img: "",
    },
    mungal_handle: {
        id: "mungal_handle",
        name: "Mungal Handle",
        category: "Handle",
        type: "Medium Handle",
        attackSpeed: 1,
        stats: {
            HexBoost: 4,
            PhysicalBoost: 4,
            EarthBoost: 4,
        },
        damageScalings: {
            Hex: 0.35,
            Physical: 0.35,
            Earth: 0.35,
        },
        perks: {
            gaseous_smash: 1,
            dual_wielding: 1,
            poison_potency: 3,
        },
        img: "",
    },
    mungal_pole: {
        id: "mungal_pole",
        name: "Mungal Pole",
        category: "Handle",
        type: "Pole",
        attackSpeed: 1,
        stats: {
            HexBoost: 5,
            MagicBoost: 5,
            EarthBoost: 5,
        },
        damageScalings: {
            Earth: 0.5,
            Magic: 0.5,
            Hex: 0.5,
        },
        perks: {
            reinforced_block: 1,
            proto_tech: 1,
        },
        img: "../image/handles/mungalpole.png",
    },
    spider_handle: {
        id: "spider_handle",
        name: "Spider Handle",
        category: "Handle",
        type: "Medium Handle",
        attackSpeed: 1.1,
        stats: {
            HexDefense: 10,
            DexterityBoost: 10,
        },
        damageScalings: {
            Dexterity: 0.5,
        },
        perks: {
            poison_acceleration: 1,
            poison_potency: 2,
        },
        img: "",
    },
    omega_lance_handle: {
        id: "omega_lance_handle",
        name: "Omega Lance Handle",
        category: "Handle",
        type: "Long Handle",
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
        perks: {
            heat_drill: 1,
        },
        img: "../image/handles/omegalancehandle.png",
    },
    freezing_bronze_handle: {
        id: "freezing_bronze_handle",
        name: "Freezing Bronze Handle",
        category: "Handle",
        type: "Medium Handle",
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
    },
    icewood_pole: {
        id: "icewood_pole",
        name: "Icewood Pole",
        category: "Handle",
        type: "Pole",
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
    },
};
