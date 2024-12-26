export const Blades = {
    basic_blade: {
        id: "basic_blade",
        name: "Basic Blade",
        category: "Blade",
        type: "Medium Blade",
        stats: {
            AttackSpeed: 1,
        },
        damageScalings: {
            Physical: 0.15,
            Dexterity: 0.15,
        },
        damageTypes: {
            Physical: 1,
        },
        img: "image/blades/basicblade.png",
    },
    scourgers_blade: {
        id: "scourgers_blade",
        name: "Scourgers Blade",
        category: "Blade",
        type: "Heavy Blade",
        stats: {
            AttackSpeed: 0.8,
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
        img: "/blades/scourgers_blade.png",
    },
    zweihander_blade: {
        id: "zweihander_blade",
        name: "Zweihander Blade",
        category: "Blade",
        type: "Heavy Blade",
        stats: {
            AttackSpeed: 0.8,
            PhysicalBoost: 10,
            PhysicalDefense: 3,
            SpeedBoost: 2,
            Protection: 5,
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
        img: "/blades/zweihander_blade.png",
    },
    dark_steel_mace: {
        id: "dark_steel_mace",
        name: "Dark Steel Mace",
        category: "Blade",
        type: "Hammer Blade",
        stats: {
            AttackSpeed: 1,
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
        img: "/blades/dark_steel_mace.png",
    },
    serrated_blade: {
        id: "serrated_blade",
        name: "Serrated Blade",
        category: "Blade",
        type: "Heavy Blade",
        stats: {
            AttackSpeed: 0.9,
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
        img: "/blades/serrated_blade.png",
    },
    bloodied_needle: {
        id: "bloodied_needle",
        name: "Bloodied Needle",
        category: "Blade",
        type: "Medium Blade",
        stats: {
            AttackSpeed: 1.1,
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
        img: "/blades/bloodied_needle.png",
    },
    beastial_dagger_blade: {
        id: "beastial_dagger_blade",
        name: "Beastial Dagger Blade",
        category: "Blade",
        type: "Small Blade",
        stats: {
            AttackSpeed: 1.1,
            DexterityBoost: 10,
            JumpBoost: 2,
            SpeedBoost: 7,
        },
        damageScalings: {
            Physical: 0.55,
            Dexterity: 0.55,
        },
        damageTypes: {
            Physical: 1,
        },
        perks: {
            beastial_rage: 1,
        },
        img: "/blades/beastial_dagger_blade.png",
    },
    omega_lance_blade: {
        id: "omega_lance_blade",
        name: "Omega Lance Blade",
        category: "Blade",
        type: "Heavy Blade",
        stats: {
            AttackSpeed: 1,
            DexterityBoost: 5,
            PhysicalBoost: 5,
            FireBoost: 5,
            AirBoost: 5,
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
        img: "/blades/omegalanceblade.png",
    },
};
