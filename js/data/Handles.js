export const Handles = {
    basic_handle: {
        id: "basic_handle",
        name: "Basic Handle",
        category: "Handle",
        type: "Medium Handle",
        stats: {
            AttackSpeed: 1,
        },
        damageScalings: {
            Physical: 0.15,
            Dexterity: 0.15,
        },
        img: "VoxelBladeBuildMaker/image/handles/basichandle.png",
    },
    scourgers_Handle: {
        id: "scourgers_Handle",
        name: "Scourgers Handle",
        category: "Handle",
        type: "Long Handle",
        stats: {
            AttackSpeed: 0.8,
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
        img: "VoxelBladeBuildMaker/image/handles/scourgers_handle.png",
    },
    zweihander_handle: {
        id: "zweihander_handle",
        name: "Zweihander Handle",
        category: "Handle",
        type: "Long Handle",
        stats: {
            AttackSpeed: 1,
            PhysicalBoost: 10,
            PhysicalDefense: 3,
            SpeedBoost: 2,
            Protection: 5,
        },
        damageScalings: {
            Physical: 0.55,
            Dexterity: 0.55,
        },
        perks: {
            highlander: 1,
        },
        img: "VoxelBladeBuildMaker/image/handles/zweihander_handle.png",
    },
    spike_pole: {
        id: "spike_pole",
        name: "Spike Pole",
        category: "Handle",
        type: "Pole",
        stats: {
            AttackSpeed: 1.1,
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
        },
        img: "VoxelBladeBuildMaker/image/handles/spike_pole.png",
    },
    serrated_handle: {
        id: "serrated_handle",
        name: "Serrated Handle",
        category: "Handle",
        type: "Long Handle",
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
            Physical: 0.1,
        },
        perks: {
            vicious_edge: 1,
        },
        img: "VoxelBladeBuildMaker/image/handles/serrated_handle.png",
    },
    bloodied_guard: {
        id: "bloodied_guard",
        name: "Bloodied Guard",
        category: "Handle",
        type: "Medium Handle",
        stats: {
            AttackSpeed: 1.1,
            PhysicalBoost: 10,
            DexterityBoost: 10,
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
        },
        img: "VoxelBladeBuildMaker/image/handles/bloodied_guard.png",
    },
    beastial_handle: {
        id: "beastial_handle",
        name: "Beastial Handle",
        category: "Handle",
        type: "Medium Handle",
        stats: {
            AttackSpeed: 1,
            DexterityBoost: 10,
            JumpBoost: 2,
            SpeedBoost: 7,
        },
        damageScalings: {
            Physical: 0.15,
            Dexterity: 0.15,
        },
        damageTypes: {
            Physical: 0.1,
        },
        perks: {
            beastial_rage: 1,
        },
        img: "VoxelBladeBuildMaker/image/handles/beastial_handle.png",
    },
    omega_lance_handle: {
        id: "omega_lance_handle",
        name: "Omega Lance Handle",
        category: "Handle",
        type: "Long Handle",
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
        perks: {
            heat_drill: 1,
        },
        img: "VoxelBladeBuildMaker/image/handles/omegalancehandle.png",
    },
};
