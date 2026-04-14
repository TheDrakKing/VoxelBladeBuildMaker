let images = "../image/runes/";
export const Runes = {
    enchanted_sword_rune: {
        id: "enchanted_sword_rune",
        name: "Enchanted Sword Rune",
        category: "Rune",
        description: "Conjure a magical weapon, holding down the rune key will change the weapon type and effects but also increase the cooldown.",
        stats: {
            MagicBoost: 10,
        },
        img: "",
    },
    ancient_cleric_rune: {
        id: "ancient_cleric_rune",
        name: "Ancient Cleric Rune",
        category: "Rune",
        description: "Consume buffs that you have applied to nearby allies and convert them into a shield.",
        stats: {
            HolyBoost: 7,
            EarthBoost: 7,
        },
        damageScalings: {
            Holy: 0.5,
            Earth: 0.5,
        },
        img: "",
    },
    beenade_rune: {
        id: "beenade_rune",
        name: "Beenade Rune",
        category: "Rune",
        description: "this is actually the description",
        stats: {
            MagicBoost: 5,
            HolyBoost: 5,
        },
        perks: {
            bomber_satchel: 1,
        },
        baseDamage: 11,
        damageScalings: {
            Holy: 1,
            Magic: 1,
        },
        img: "",
    },
    boostshroom_rune: {
        id: "boostshroom_rune",
        name: "Boostshroom Rune",
        category: "Rune",
        description: "Cast to summon a bouncy mushroom!",
        stats: {
            Warding: 20,
            JumpBoost: 5,
        },
        img: "",
    },
    bounce_rune: {
        id: "bounce_rune",
        name: "Bounce Rune",
        category: "Rune",
        description: "Cast to become bouncy!",
        sourcepotencies: {
            bouncepotency: 0.3,
        },
        stats: {
            JumpBoost: 5,
        },
        img: "../image/runes/bouncerune.png",
    },
    brainblast_rune: {
        id: "brainblast_rune",
        name: "Brainblast Rune",
        category: "Rune",
        description: "Release a psionic magmatic blast!",
        stats: {
            FireBoost: 4,
            MagicBoost: 4,
            EarthBoost: 4,
        },
        damageScalings: {
            Fire: 1,
            Earth: 1,
            Magic: 1,
        },
        damageTypes: {
            Fire: 0.33,
            Magic: 0.33,
            Earth: 0.33,
        },
        img: "",
    },
    caci_rune: {
        id: "caci_rune",
        name: "Caci Rune",
        category: "Rune",
        description: "Summons Caci that headbutt the floor!",
        stats: {
            SummonBoost: 20,
        },
        baseDamage: 53,
        img: "",
    },
    cacitrops_rune: {
        id: "cacitrops_rune",
        name: "Cacitrops Rune",
        category: "Rune",
        description: "Dash backwards and drop spikes on the floor!",
        stats: {
            DexterityBoost: 8,
            PhysicalBoost: 8,
        },
        damageScalings: {
            Physical: 1,
            Dexterity: 1,
        },
        img: "",
    },
    combat_roll_rune: {
        id: "combat_roll_rune",
        name: "Combat Roll Rune",
        category: "Rune",
        description: "Roll to dodge incoming attacks!",
        stats: {
            DexterityBoost: 10,
            SpeedBoost: 6,
        },
        img: "",
    },
    croakernaut_rune: {
        id: "croakernaut_rune",
        name: "Croakernaut Rune",
        category: "Rune",
        description: "Cast to summon a Croakernaut.",
        stats: {
            PhysicalDefense: 5,
            SummonBoost: 5,
        },
        img: "",
    },
    demonic_step_rune: {
        id: "demonic_step_rune",
        name: "Demonic Step Rune",
        category: "Rune",
        description: "An upgraded rune created using the mechanisms of the rolling rune as a base.",
        stats: {
            Tenacity: 0.2,
        },
        img: "",
    },
    false_sun_rune: {
        id: "false_sun_rune",
        name: "False Sun Rune",
        category: "Rune",
        description: "Cast to create a small sun that grants a buff that activates daylight required perks and deals fire and holy damage.",
        stats: {
            FireBoost: 5,
            HolyBoost: 5,
        },
        baseDamage: 1,
        damageTypes: {
            Fire: 0.5,
            Holy: 0.5,
        },
        img: "",
    },
    fireball_rune: {
        id: "fireball_rune",
        name: "Fireball Rune",
        category: "Rune",
        description: "Cast a fireball that burns enemies over time.",
        stats: {
            FireBoost: 10,
        },
        baseDamage: 15,
        img: "",
    },
    foot_dive_rune: {
        id: "foot_dive_rune",
        name: "Foot Dive Rune",
        category: "Rune",
        description: "A perfected form of the buni kick. Propell forewards using your sword and kick the opponent. The cooldown is reduced if it hits an opponent",
        stats: {
            DexterityBoost: 5,
            PhysicalBoost: 5,
        },
        baseDamage: 18,
        damageScalings: {
            Dexterity: 1,
            Physical: 1,
        },
        img: "",
    },
    gastric_tempest_rune: {
        id: "gastric_tempest_rune",
        name: "Gastric Tempest Rune",
        category: "Rune",
        description: "An upgraded form of the Gastric Winds Rune, forged by ancient craftsmen.",
        stats: {
            HexBoost: 13,
            AirBoost: 1,
        },
        img: "",
    },
    gastric_winds_rune: {
        id: "gastric_winds_rune",
        name: "Gastric Winds Rune",
        category: "Rune",
        description: "Channel your gastric power by using this rune!",
        stats: {
            HexBoost: 13,
            AirBoost: 1,
        },
        img: "",
    },
    glacial_shell_rune: {
        id: "glacial_shell_rune",
        name: "Glacial Shell Rune",
        category: "Rune",
        description: "Surround yourself in ice restoring shield and increasing max shield temporarily!",
        stats: {
            ColdResistance: 200,
            Protection: 10,
        },
        img: "",
    },
    healing_rune: {
        id: "healing_rune",
        name: "Healing Rune",
        category: "Rune",
        description: "Cast a weak healing spell.",
        stats: {
            HolyBoost: 10,
        },
        img: "",
    },
    hex_web_rune: {
        id: "hex_web_rune",
        name: "Hex Web Rune",
        category: "Rune",
        description: "Toss a hex web up in the air that lands on the closest enemy to you.",
        stats: {
            HexBoost: 10,
        },
        damageScalings: {
            Hex: 1,
        },
        damageTypes: {
            Hex: 1,
        },
        img: "",
    },
    jetstream_rune: {
        id: "jetstream_rune",
        name: "Jetstream Rune",
        category: "Rune",
        description: "Activate to move as fast as you can for a moment, though youll become exhausted afterwards.",
        stats: {
            AirBoost: 10,
        },
        img: "",
    },
    launch_rune: {
        id: "launch_rune",
        name: "Launch Rune",
        category: "Rune",
        description: "Cast to launch yourself into the air.",
        stats: {
            AirBoost: 10,
        },
        img: "",
    },
    magic_missile_rune: {
        id: "magic_missile_rune",
        name: "Magic Missile Rune",
        category: "Rune",
        description: "Cast to fire a couple magic missles.",
        stats: {
            MagicBoost: 10,
        },
        baseDamage: 63,
        img: "",
    },
    pack_leader_rune: {
        id: "pack_leader_rune",
        name: "Pack Leader Rune",
        category: "Rune",
        description: "Cast to summon 2 Winter Woofs.",
        stats: {
            PhysicalBoost: 5,
            SummonBoost: 5,
        },
        img: "",
    },
    plan_bee_rune: {
        id: "plan_bee_rune",
        name: "Plan Bee Rune",
        category: "Rune",
        description: "Its good to always have a plan bee! Grant yourself shield based on missing HP and grant regen below 20%",
        sourcepotencies: {
            regenpotency: 0.5,
        },
        stats: {
            PhysicalDefense: 5,
            MagicDefense: 5,
        },
        img: "",
    },
    proto_grappler_rune: {
        id: "proto_grappler_rune",
        name: "Proto Grappler Rune",
        category: "Rune",
        description: "Using will launch the grapple hook in the direction your facing. Hold down to aim the grapple hook.",
        stats: {
            PhysicalDefense: 8,
            MagicDefense: 8,
        },
        baseDamage: 7,
        damageScalings: {
            Hex: 0.5,
            Physical: 0.5,
            Dexterity: 0.5,
        },
        damageTypes: {
            Hex: 0.5,
            Physical: 0.5,
        },
        img: "",
    },
    rage_rune: {
        id: "rage_rune",
        name: "Rage Rune",
        category: "Rune",
        description: "Become enraged and deal more damage!",
        sourcepotencies: {
            ragepotency: 0.3,
        },
        stats: {
            PhysicalBoost: 10,
        },
        img: "",
    },
    reinforce_rune: {
        id: "reinforce_rune",
        name: "Reinforce Rune",
        category: "Rune",
        description: "Cast to reduce incoming damage!",
        sourcepotencies: {
            reinforcepotency: 0.5,
        },
        stats: {
            MagicDefense: 10,
        },
        img: "",
    },
    rocky_tail_rune: {
        id: "rocky_tail_rune",
        name: "Rocky Tail Rune",
        category: "Rune",
        description: "Use this rune to grow a tail from your back which restores shield on hit. Holding will continue to slap with the tail but instead of restoring shield it consumes it to make your tail bigger.",
        stats: {
            HeatResistance: 100,
            EarthBoost: 5,
            Protection: 10,
        },
        baseDamage: 8,
        damageScalings: {
            Earth: 1,
        },
        img: "",
    },
    rubble_rune: {
        id: "rubble_rune",
        name: "Rubble Rune",
        category: "Rune",
        description: "Toss a handful of rocks at the opponent.",
        stats: {
            EarthBoost: 10,
        },
        baseDamage: 18,
        damageScalings: {
            Earth: 0.7,
            Physical: 0.3,
        },
        damageTypes: {
            Earth: 1,
        },
        img: "",
    },
    rune_of_cleansing: {
        id: "rune_of_cleansing",
        name: "Rune of Cleansing",
        category: "Rune",
        description: "Cast to cleanse debuffs.",
        stats: {
            WaterBoost: 10,
        },
        img: "",
    },
    sanguine_bolt_rune: {
        id: "sanguine_bolt_rune",
        name: "Sanguine Bolt Rune",
        category: "Rune",
        description: "Expend health to cast a blood bolt! The rune button can be held down to continue channeling for a bit.",
        stats: {
            MagicBoost: 4,
            PhysicalBoost: 4,
            AirBoost: 4,
        },
        img: "",
    },
    snarl_rune: {
        id: "snarl_rune",
        name: "Snarl Rune",
        category: "Rune",
        description: "Snarl at your opponents applying a debuff that allows you to heal by hitting them!",
        stats: {
            PhysicalBoost: 10,
        },
        img: "",
    },
    snoeball_rune: {
        id: "snoeball_rune",
        name: "Snoeball Rune",
        category: "Rune",
        description: "Gather a large snoeball then throw it to cause a massive explosion that applies frost.",
        stats: {
            MagicBoost: 5,
            WaterBoost: 5,
        },
        baseDamage: 30,
        damageScalings: {
            Magic: 1,
            Water: 1,
        },
        img: "",
    },
    sporeling_toss_rune: {
        id: "sporeling_toss_rune",
        name: "Sporeling Toss Rune",
        category: "Rune",
        description: "Cast to throw 2 sporelings and additionally any sporelings you've summoned!",
        stats: {
            HexBoost: 5,
            PhysicalBoost: 5,
            SummonBoost: 5,
        },
        baseDamage: 3.5,
        img: "",
    },
    static_field_rune: {
        id: "static_field_rune",
        name: "Static Field Rune",
        category: "Rune",
        description: "Create a static field to parry away your enemies attacks automatically!",
        stats: {
            MagicBoost: 8,
            AirBoost: 8,
        },
        img: "",
    },
    swarm_rune: {
        id: "swarm_rune",
        name: "Swarm Rune",
        category: "Rune",
        description: "Cast to summon a swarm of Bumblz.",
        stats: {
            SummonBoost: 10,
        },
        img: "",
    },
    taunting_rune: {
        id: "taunting_rune",
        name: "Taunting Rune",
        category: "Rune",
        description: "Taunt nearby enemies!",
        stats: {
            PhysicalDefense: 10,
        },
        perks: {
            dominating: 1,
        },
        img: "",
    },
    thunderous_charge_rune: {
        id: "thunderous_charge_rune",
        name: "Thunderous Charge Rune",
        category: "Rune",
        description: "Turn into a lightning form and dash through your enemies! Hold and let go of the rune key right as you hit an enemy to strengthen it.",
        stats: {
            MagicBoost: 8,
            AirBoost: 8,
        },
        baseDamage: 20,
        damageScalings: {
            Air: 1,
            Magic: 1,
        },
        img: "",
    },
    toad_slam_rune: {
        id: "toad_slam_rune",
        name: "Toad Slam Rune",
        category: "Rune",
        description: "Slam into the floor and become enraged!",
        sourcepotencies: {
            ragepotency: 0.2,
        },
        stats: {
            PhysicalBoost: 5,
            JumpBoost: 5,
        },
        img: "",
    },
    toadzerker_rune_unobtainable: {
        id: "toadzerker_rune_unobtainable",
        name: "Toadzerker Rune (UNOBTAINABLE)",
        category: "Rune",
        description: "Cast to summon a Toadzerker!",
        stats: {
            PhysicalDefense: 5,
            SummonBoost: 5,
        },
        img: "",
    },
    weakening_roar_rune: {
        id: "weakening_roar_rune",
        name: "Weakening Roar Rune",
        category: "Rune",
        description: "Unleash a mighty roar to weaken those around you!",
        sourcepotencies: {
            weakeningpotency: 0.5,
        },
        stats: {
            HexBoost: 10,
        },
        baseDamage: 10,
        img: "",
    },
    slizard_mount_rune: {
        id: "slizard_mount_rune",
        name: "Slizard Mount Rune",
        category: "Rune",
        description: "Cast to mount a slizard. Your LMBs and weapon art is modified while riding.",
        stats: {
            SummonBoost: 10,
        },
        img: "",
    },
    winter_woof_mount_rune: {
        id: "winter_woof_mount_rune",
        name: "Winter Woof Mount Rune",
        category: "Rune",
        description: "Cast to mount a winter woof. Your LMBs and weapon art is modified while riding.",
        stats: {
            SummonBoost: 10,
        },
        img: "",
    },
    glacial_snapper_mount_rune: {
        id: "glacial_snapper_mount_rune",
        name: "Glacial Snapper Mount Rune",
        category: "Rune",
        description: "Cast to mount a glacial snapper. Gain additional defense and your LMBs and weapon art are modified while riding.",
        stats: {
            SummonBoost: 10,
        },
        img: "",
    },
    voxlmas_glacial_snapper_mount_rune: {
        id: "voxlmas_glacial_snapper_mount_rune",
        name: "Voxlmas Glacial Snapper Mount Rune",
        category: "Rune",
        description: "Cast to mount a glacial snapper. Gain additional defense and your LMBs and weapon art are modified while riding.",
        stats: {
            SummonBoost: 10,
        },
        img: "",
    },
};
