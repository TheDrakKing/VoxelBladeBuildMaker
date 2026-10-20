let images = "../image/runes/";
export const Runes = {
    enchanted_sword_rune: {
        id: "enchanted_sword_rune",
        name: "Enchanted Sword Rune",
        category: "Rune",
        description: "Conjure a magical weapon, holding down the rune key will change the weapon type and effects but also increase the cooldown.",
        cooldown: 10,
        stats: {
            MagicBoost: 10,
        },
        img: "",
        "perks": {},
        "potencies": {},
        "source": {
            "cardId": "69214b9831723704c1edaea2",
            "cardUrl": "https://trello.com/c/tHmSbLdA",
            "sectionId": "69214b9831723704c1edaea2"
        },
    },
    ancient_cleric_rune: {
        id: "ancient_cleric_rune",
        name: "Ancient Cleric Rune",
        category: "Rune",
        description: "Consume buffs that you have applied to nearby allies and convert them into a shield.",
        cooldown: 20,
        stats: {
            HolyBoost: 7,
            EarthBoost: 7,
        },
        damageScalings: {
            Holy: 0.5,
            Earth: 0.5,
        },
        img: "",
        "perks": {},
        "potencies": {},
        "source": {
            "cardId": "69214b9831723704c1edaf18",
            "cardUrl": "https://trello.com/c/JoTChu37",
            "sectionId": "69214b9831723704c1edaf18"
        },
    },
    beenade_rune: {
        id: "beenade_rune",
        name: "Beenade Rune",
        category: "Rune",
        description: "this is actually the description",
        cooldown: 5,
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
        "potencies": {},
        "source": {
            "cardId": "69214b9831723704c1edaeae",
            "cardUrl": "https://trello.com/c/Oinv3OA5",
            "sectionId": "69214b9831723704c1edaeae"
        },
    },
    boostshroom_rune: {
        id: "boostshroom_rune",
        name: "Boostshroom Rune",
        category: "Rune",
        description: "Cast to summon a bouncy mushroom!",
        cooldown: 20,
        duration: 20,
        stats: {
            Warding: 20,
            JumpBoost: 5,
        },
        img: "",
        "perks": {},
        "potencies": {},
        "source": {
            "cardId": "69214b9831723704c1edaec4",
            "cardUrl": "https://trello.com/c/8h8GRZSm",
            "sectionId": "69214b9831723704c1edaec4"
        },
    },
    bounce_rune: {
        id: "bounce_rune",
        name: "Bounce Rune",
        category: "Rune",
        description: "Cast to become bouncy!",
        cooldown: 25,
        duration: 10,
        sourcepotencies: {
            bouncepotency: 0.3,
        },
        stats: {
            JumpBoost: 5,
        },
        img: "../image/runes/bouncerune.png",
        "perks": {},
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1edaa24",
            "cardUrl": "https://trello.com/c/eLFrTG8P",
            "sectionId": "69214b9731723704c1edaa24"
        },
    },
    brainblast_rune: {
        id: "brainblast_rune",
        name: "Brainblast Rune",
        category: "Rune",
        description: "Release a psionic magmatic blast!",
        cooldown: 15,
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
        "perks": {},
        "potencies": {},
        "source": {
            "cardId": "69214b9831723704c1edaf00",
            "cardUrl": "https://trello.com/c/VU744wdG",
            "sectionId": "69214b9831723704c1edaf00"
        },
    },
    caci_rune: {
        id: "caci_rune",
        name: "Caci Rune",
        category: "Rune",
        description: "Summons Caci that headbutt the floor!",
        cooldown: 10,
        stats: {
            SummonBoost: 20,
        },
        baseDamage: 5 * 3,
        img: "",
        "perks": {},
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda796",
            "cardUrl": "https://trello.com/c/FNTyJYUT",
            "sectionId": "69214b9731723704c1eda796"
        },
    },
    cacitrops_rune: {
        id: "cacitrops_rune",
        name: "Cacitrops Rune",
        category: "Rune",
        description: "Dash backwards and drop spikes on the floor!",
        cooldown: 15,
        stats: {
            DexterityBoost: 8,
            PhysicalBoost: 8,
        },
        damageScalings: {
            Physical: 1,
            Dexterity: 1,
        },
        img: "",
        "perks": {},
        "potencies": {},
        "source": {
            "cardId": "69214b9831723704c1edaeea",
            "cardUrl": "https://trello.com/c/0zfL8pK1",
            "sectionId": "69214b9831723704c1edaeea"
        },
    },
    combat_roll_rune: {
        id: "combat_roll_rune",
        name: "Combat Roll Rune",
        category: "Rune",
        description: "Roll to dodge incoming attacks!",
        cooldown: 10,
        stats: {
            DexterityBoost: 10,
            SpeedBoost: 6,
        },
        img: "",
        "perks": {},
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda52e",
            "cardUrl": "https://trello.com/c/KbXGgBBx",
            "sectionId": "69214b9731723704c1eda52e"
        },
    },
    croakernaut_rune: {
        id: "croakernaut_rune",
        name: "Croakernaut Rune",
        category: "Rune",
        description: "Cast to summon a Croakernaut.",
        cooldown: 100,
        stats: {
            PhysicalDefense: 5,
            SummonBoost: 5,
        },
        img: "",
        "source": {
            "cardId": "69214b9731723704c1edaae2",
            "cardUrl": "https://trello.com/c/CF1pfIRH"
        },
        "dataWarnings": [
            "Potency depends on the selected situation; use the manual status potency control. Original item data is retained."
        ],
    },
    demonic_step_rune: {
        id: "demonic_step_rune",
        name: "Demonic Step Rune",
        category: "Rune",
        description: "An upgraded rune created using the mechanisms of the rolling rune as a base.",
        cooldown: 0,
        stats: {
            Tenacity: 0.2,
        },
        img: "",
        "perks": {},
        "potencies": {},
        "source": {
            "cardId": "69214b9831723704c1edad98",
            "cardUrl": "https://trello.com/c/px9F5jZb",
            "sectionId": "69214b9831723704c1edad98"
        },
    },
    false_sun_rune: {
        id: "false_sun_rune",
        name: "False Sun Rune",
        category: "Rune",
        description: "Cast to create a small sun that grants a buff that activates daylight required perks and deals fire and holy damage.",
        cooldown: 50,
        duration: 20,
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
        "perks": {},
        "potencies": {},
        "source": {
            "cardId": "69214b9831723704c1edae2a",
            "cardUrl": "https://trello.com/c/TEGPNlJR",
            "sectionId": "69214b9831723704c1edae2a"
        },
    },
    fireball_rune: {
        id: "fireball_rune",
        name: "Fireball Rune",
        category: "Rune",
        description: "Cast a fireball that burns enemies over time.",
        cooldown: 15,
        duration: 4,
        stats: {
            FireBoost: 10,
        },
        baseDamage: 15,
        img: "",
        "perks": {},
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda52a",
            "cardUrl": "https://trello.com/c/NAX9kE4b",
            "sectionId": "69214b9731723704c1eda52a"
        },
    },
    foot_dive_rune: {
        id: "foot_dive_rune",
        name: "Foot Dive Rune",
        category: "Rune",
        description: "A perfected form of the buni kick. Propell forewards using your sword and kick the opponent. The cooldown is reduced if it hits an opponent",
        cooldown: 25,
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
        "perks": {},
        "potencies": {},
        "source": {
            "cardId": "69214b9831723704c1edaeb2",
            "cardUrl": "https://trello.com/c/CLW7ZPxU",
            "sectionId": "69214b9831723704c1edaeb2"
        },
    },
    gastric_tempest_rune: {
        id: "gastric_tempest_rune",
        name: "Gastric Tempest Rune",
        category: "Rune",
        description: "An upgraded form of the Gastric Winds Rune, forged by ancient craftsmen.",
        cooldown: 10,
        stats: {
            HexBoost: 13,
            AirBoost: 1,
        },
        img: "",
        "perks": {},
        "potencies": {},
        "source": {
            "cardId": "69214b9831723704c1edad96",
            "cardUrl": "https://trello.com/c/oGJ7wSf6",
            "sectionId": "69214b9831723704c1edad96"
        },
    },
    gastric_winds_rune: {
        id: "gastric_winds_rune",
        name: "Gastric Winds Rune",
        category: "Rune",
        description: "Channel your gastric power by using this rune!",
        cooldown: 10,
        stats: {
            HexBoost: 13,
            AirBoost: 1,
        },
        img: "",
        "perks": {},
        "potencies": {},
        "source": {
            "cardId": "69214b9831723704c1edac66",
            "cardUrl": "https://trello.com/c/I3WQXGrR",
            "sectionId": "69214b9831723704c1edac66"
        },
    },
    glacial_shell_rune: {
        id: "glacial_shell_rune",
        name: "Glacial Shell Rune",
        category: "Rune",
        description: "Surround yourself in ice restoring shield and increasing max shield temporarily!",
        cooldown: 40,
        duration: 20,
        stats: {
            ColdResistance: 200,
            Protection: 10,
        },
        img: "",
        "perks": {},
        "potencies": {},
        "source": {
            "cardId": "69214b9831723704c1edaf26",
            "cardUrl": "https://trello.com/c/75fSURzL",
            "sectionId": "69214b9831723704c1edaf26"
        },
    },
    healing_rune: {
        id: "healing_rune",
        name: "Healing Rune",
        category: "Rune",
        description: "Cast a weak healing spell.",
        cooldown: 40,
        stats: {
            HolyBoost: 10,
        },
        img: "",
        "perks": {},
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda5ca",
            "cardUrl": "https://trello.com/c/RKMmDESr",
            "sectionId": "69214b9731723704c1eda5ca"
        },
    },
    hex_web_rune: {
        id: "hex_web_rune",
        name: "Hex Web Rune",
        category: "Rune",
        description: "Toss a hex web up in the air that lands on the closest enemy to you.",
        cooldown: 20,
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
        "perks": {},
        "potencies": {},
        "source": {
            "cardId": "69214b9831723704c1edaf0c",
            "cardUrl": "https://trello.com/c/060gMnqX",
            "sectionId": "69214b9831723704c1edaf0c"
        },
    },
    jetstream_rune: {
        id: "jetstream_rune",
        name: "Jetstream Rune",
        category: "Rune",
        description: "Activate to move as fast as you can for a moment, though youll become exhausted afterwards.",
        cooldown: 15,
        duration: 5,
        stats: {
            AirBoost: 10,
        },
        img: "",
        "perks": {},
        "potencies": {},
        "source": {
            "cardId": "69214b9831723704c1edaede",
            "cardUrl": "https://trello.com/c/FyQH3Tfj",
            "sectionId": "69214b9831723704c1edaede"
        },
    },
    launch_rune: {
        id: "launch_rune",
        name: "Launch Rune",
        category: "Rune",
        description: "Cast to launch yourself into the air.",
        cooldown: 15,
        stats: {
            AirBoost: 10,
        },
        img: "",
        "perks": {},
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda98c",
            "cardUrl": "https://trello.com/c/Dnaqs5KM",
            "sectionId": "69214b9731723704c1eda98c"
        },
    },
    magic_missile_rune: {
        id: "magic_missile_rune",
        name: "Magic Missile Rune",
        category: "Rune",
        description: "Cast to fire a couple magic missles.",
        cooldown: 10,
        stats: {
            MagicBoost: 10,
        },
        baseDamage: 6 * 3,
        img: "",
        "perks": {},
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda78e",
            "cardUrl": "https://trello.com/c/YZ0XRNzZ",
            "sectionId": "69214b9731723704c1eda78e"
        },
    },
    pack_leader_rune: {
        id: "pack_leader_rune",
        name: "Pack Leader Rune",
        category: "Rune",
        description: "Cast to summon 2 Winter Woofs.",
        cooldown: 120,
        stats: {
            PhysicalBoost: 5,
            SummonBoost: 5,
        },
        img: "",
        "perks": {},
        "potencies": {},
        "source": {
            "cardId": "69214b9831723704c1edaeb8",
            "cardUrl": "https://trello.com/c/IaWku9bx",
            "sectionId": "69214b9831723704c1edaeb8"
        },
    },
    plan_bee_rune: {
        id: "plan_bee_rune",
        name: "Plan Bee Rune",
        category: "Rune",
        description: "Its good to always have a plan bee! Grant yourself shield based on missing HP and grant regen below 20%",
        cooldown: 30,
        duration: 10,
        sourcepotencies: {
            regenpotency: 0.5,
        },
        stats: {
            PhysicalDefense: 5,
            MagicDefense: 5,
        },
        img: "",
        "perks": {},
        "potencies": {},
        "source": {
            "cardId": "69214b9831723704c1edaf0e",
            "cardUrl": "https://trello.com/c/CQDA4Wlg",
            "sectionId": "69214b9831723704c1edaf0e"
        },
    },
    proto_grappler_rune: {
        id: "proto_grappler_rune",
        name: "Proto Grappler Rune",
        category: "Rune",
        description: "Using will launch the grapple hook in the direction your facing. Hold down to aim the grapple hook.",
        cooldown: 15,
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
        "perks": {},
        "potencies": {},
        "source": {
            "cardId": "69214b9831723704c1edaf0a",
            "cardUrl": "https://trello.com/c/qs6KtSRB",
            "sectionId": "69214b9831723704c1edaf0a"
        },
    },
    rage_rune: {
        id: "rage_rune",
        name: "Rage Rune",
        category: "Rune",
        description: "Become enraged and deal more damage!",
        cooldown: 60,
        duration: 10,
        sourcepotencies: {
            ragepotency: 0.3,
        },
        stats: {
            PhysicalBoost: 10,
        },
        img: "",
        "perks": {},
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda79c",
            "cardUrl": "https://trello.com/c/H2D2i57a",
            "sectionId": "69214b9731723704c1eda79c"
        },
    },
    reinforce_rune: {
        id: "reinforce_rune",
        name: "Reinforce Rune",
        category: "Rune",
        description: "Cast to reduce incoming damage!",
        cooldown: 40,
        duration: 20,
        sourcepotencies: {
            reinforcepotency: 0.5,
        },
        stats: {
            MagicDefense: 10,
        },
        img: "",
        "perks": {},
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda798",
            "cardUrl": "https://trello.com/c/8gBAagAD",
            "sectionId": "69214b9731723704c1eda798"
        },
    },
    rocky_tail_rune: {
        id: "rocky_tail_rune",
        name: "Rocky Tail Rune",
        category: "Rune",
        description: "Use this rune to grow a tail from your back which restores shield on hit. Holding will continue to slap with the tail but instead of restoring shield it consumes it to make your tail bigger.",
        cooldown: 20,
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
        "perks": {},
        "potencies": {},
        "source": {
            "cardId": "69214b9831723704c1edaf06",
            "cardUrl": "https://trello.com/c/HpRd9rRS",
            "sectionId": "69214b9831723704c1edaf06"
        },
    },
    rubble_rune: {
        id: "rubble_rune",
        name: "Rubble Rune",
        category: "Rune",
        description: "Toss a handful of rocks at the opponent.",
        cooldown: 15,
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
        "perks": {},
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1edab4a",
            "cardUrl": "https://trello.com/c/FSRgjMgf",
            "sectionId": "69214b9731723704c1edab4a"
        },
    },
    rune_of_cleansing: {
        id: "rune_of_cleansing",
        name: "Rune of Cleansing",
        category: "Rune",
        description: "Cast to cleanse debuffs.",
        cooldown: 20,
        stats: {
            WaterBoost: 10,
        },
        img: "",
        "perks": {},
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda694",
            "cardUrl": "https://trello.com/c/gSAawmwy",
            "sectionId": "69214b9731723704c1eda694"
        },
    },
    sanguine_bolt_rune: {
        id: "sanguine_bolt_rune",
        name: "Sanguine Bolt Rune",
        category: "Rune",
        description: "Expend health to cast a blood bolt! The rune button can be held down to continue channeling for a bit.",
        cooldown: 15,
        stats: {
            MagicBoost: 4,
            PhysicalBoost: 4,
            AirBoost: 4,
        },
        img: "",
        "perks": {},
        "potencies": {},
        "source": {
            "cardId": "69214b9831723704c1edacb2",
            "cardUrl": "https://trello.com/c/tuR9dP54",
            "sectionId": "69214b9831723704c1edacb2"
        },
    },
    snarl_rune: {
        id: "snarl_rune",
        name: "Snarl Rune",
        category: "Rune",
        description: "Snarl at your opponents applying a debuff that allows you to heal by hitting them!",
        cooldown: 30,
        duration: 10,
        stats: {
            PhysicalBoost: 10,
        },
        img: "",
        "perks": {},
        "potencies": {},
        "source": {
            "cardId": "69214b9831723704c1edaeac",
            "cardUrl": "https://trello.com/c/6CLiCMlc",
            "sectionId": "69214b9831723704c1edaeac"
        },
    },
    snoeball_rune: {
        id: "snoeball_rune",
        name: "Snoeball Rune",
        category: "Rune",
        description: "Gather a large snoeball then throw it to cause a massive explosion that applies frost.",
        cooldown: 25,
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
        "perks": {},
        "potencies": {},
        "source": {
            "cardId": "69214b9831723704c1edaf28",
            "cardUrl": "https://trello.com/c/BqraE59E",
            "sectionId": "69214b9831723704c1edaf28"
        },
    },
    sporeling_toss_rune: {
        id: "sporeling_toss_rune",
        name: "Sporeling Toss Rune",
        category: "Rune",
        description: "Cast to throw 2 sporelings and additionally any sporelings you've summoned!",
        cooldown: 45,
        stats: {
            HexBoost: 5,
            PhysicalBoost: 5,
            SummonBoost: 5,
        },
        baseDamage: 3.5,
        img: "",
        "perks": {},
        "potencies": {},
        "source": {
            "cardId": "69214b9831723704c1edaec8",
            "cardUrl": "https://trello.com/c/c75VINKQ",
            "sectionId": "69214b9831723704c1edaec8"
        },
    },
    static_field_rune: {
        id: "static_field_rune",
        name: "Static Field Rune",
        category: "Rune",
        description: "Create a static field to parry away your enemies attacks automatically!",
        cooldown: 35,
        duration: 5,
        stats: {
            MagicBoost: 8,
            AirBoost: 8,
        },
        img: "",
        "perks": {},
        "potencies": {},
        "source": {
            "cardId": "69214b9831723704c1edaec6",
            "cardUrl": "https://trello.com/c/G4YMghRa",
            "sectionId": "69214b9831723704c1edaec6"
        },
    },
    swarm_rune: {
        id: "swarm_rune",
        name: "Swarm Rune",
        category: "Rune",
        description: "Cast to summon a swarm of Bumblz.",
        cooldown: 30,
        stats: {
            SummonBoost: 10,
        },
        img: "",
        "perks": {},
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda79a",
            "cardUrl": "https://trello.com/c/vZQOdehU",
            "sectionId": "69214b9731723704c1eda79a"
        },
    },
    taunting_rune: {
        id: "taunting_rune",
        name: "Taunting Rune",
        category: "Rune",
        description: "Taunt nearby enemies!",
        cooldown: 20,
        duration: 10,
        sourcepotencies: {
            tauntpotency: 0.3,
        },
        stats: {
            PhysicalDefense: 10,
        },
        perks: {
            dominating: 1,
        },
        img: "",
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda78c",
            "cardUrl": "https://trello.com/c/G9LWueS2",
            "sectionId": "69214b9731723704c1eda78c"
        },
    },
    thunderous_charge_rune: {
        id: "thunderous_charge_rune",
        name: "Thunderous Charge Rune",
        category: "Rune",
        description: "Turn into a lightning form and dash through your enemies! Hold and let go of the rune key right as you hit an enemy to strengthen it.",
        cooldown: 25,
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
        "perks": {},
        "potencies": {},
        "source": {
            "cardId": "69214b9831723704c1edaf08",
            "cardUrl": "https://trello.com/c/1jEETr61",
            "sectionId": "69214b9831723704c1edaf08"
        },
    },
    toad_slam_rune: {
        id: "toad_slam_rune",
        name: "Toad Slam Rune",
        category: "Rune",
        description: "Slam into the floor and become enraged!",
        cooldown: 40,
        duration: 10,
        sourcepotencies: {
            ragepotency: 0.2,
        },
        stats: {
            PhysicalBoost: 5,
            JumpBoost: 5,
        },
        img: "",
        "perks": {},
        "potencies": {},
        "source": {
            "cardId": "69214b9831723704c1edae98",
            "cardUrl": "https://trello.com/c/Yso54Qyw",
            "sectionId": "69214b9831723704c1edae98"
        },
    },
    toadzerker_rune_unobtainable: {
        id: "toadzerker_rune_unobtainable",
        name: "Toadzerker Rune (UNOBTAINABLE)",
        category: "Rune",
        description: "Cast to summon a Toadzerker!",
        cooldown: 120,
        stats: {
            PhysicalDefense: 5,
            SummonBoost: 5,
        },
        img: "",
        "perks": {},
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda794",
            "cardUrl": "https://trello.com/c/j5UaAUiC",
            "sectionId": "69214b9731723704c1eda794"
        },
    },
    weakening_roar_rune: {
        id: "weakening_roar_rune",
        name: "Weakening Roar Rune",
        category: "Rune",
        description: "Unleash a mighty roar to weaken those around you!",
        cooldown: 20,
        duration: 15,
        sourcepotencies: {
            weakeningpotency: 0.5,
        },
        stats: {
            HexBoost: 10,
        },
        baseDamage: 10,
        img: "",
        "perks": {},
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda790",
            "cardUrl": "https://trello.com/c/KXVCPQ05",
            "sectionId": "69214b9731723704c1eda790"
        },
    },
    slizard_mount_rune: {
        id: "slizard_mount_rune",
        name: "Slizard Mount Rune",
        category: "Rune",
        description: "Cast to mount a slizard. Your LMBs and weapon art is modified while riding.",
        cooldown: 10,
        stats: {
            SummonBoost: 10,
        },
        img: "",
        "perks": {},
        "potencies": {},
        "source": {
            "cardId": "69214b9731723704c1eda792",
            "cardUrl": "https://trello.com/c/X1dL6q63",
            "sectionId": "69214b9731723704c1eda792"
        },
    },
    winter_woof_mount_rune: {
        id: "winter_woof_mount_rune",
        name: "Winter Woof Mount Rune",
        category: "Rune",
        description: "Cast to mount a winter woof. Your LMBs and weapon art is modified while riding.",
        cooldown: 10,
        stats: {
            SummonBoost: 10,
        },
        img: "",
        "perks": {},
        "potencies": {
            "shatterpotency": 0.2
        },
        "source": {
            "cardId": "69214b9731723704c1edac14",
            "cardUrl": "https://trello.com/c/PiKAN1NB",
            "sectionId": "69214b9731723704c1edac14"
        },
    },
    glacial_snapper_mount_rune: {
        id: "glacial_snapper_mount_rune",
        name: "Glacial Snapper Mount Rune",
        category: "Rune",
        description: "Cast to mount a glacial snapper. Gain additional defense and your LMBs and weapon art are modified while riding.",
        cooldown: 10,
        stats: {
            SummonBoost: 10,
        },
        img: "",
        "perks": {
            "mounted_defense": 1
        },
        "potencies": {},
        "source": {
            "cardId": "69214b9831723704c1edadee",
            "cardUrl": "https://trello.com/c/VeomovtI",
            "sectionId": "69214b9831723704c1edadee"
        },
    },
    voxlmas_glacial_snapper_mount_rune: {
        id: "voxlmas_glacial_snapper_mount_rune",
        name: "Voxlmas Glacial Snapper Mount Rune",
        category: "Rune",
        description: "Cast to mount a glacial snapper. Gain additional defense and your LMBs and weapon art are modified while riding.",
        cooldown: 10,
        stats: {
            SummonBoost: 10,
        },
        img: "",
        "perks": {
            "mounted_defense": 1
        },
        "potencies": {},
        "source": {
            "cardId": "69214b9831723704c1edae0c",
            "cardUrl": "https://trello.com/c/FmJX4wOF",
            "sectionId": "69214b9831723704c1edae0c"
        },
    },
    "spooky_woof_mount_rune": {
        "id": "spooky_woof_mount_rune",
        "name": "Spooky Woof Mount Rune",
        "stats": {
            "SummonBoost": 10
        },
        "perks": {},
        "potencies": {
            "shatterpotency": 0.2
        },
        "source": {
            "cardId": "69214b9831723704c1edaf48",
            "cardUrl": "https://trello.com/c/8OGE0b3g",
            "sectionId": "69214b9831723704c1edaf48"
        },
        "category": "Rune"
    },
};
