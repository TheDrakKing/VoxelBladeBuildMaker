export const Guilds = {
    scholar: {
        id: "Scholar",
        name: "Scholar",
        category: "Guild",
        description: "Guild for mages",
        promotions: [
            {
                stats: {
                    MagicDefense: 20,
                    Warding: 10,
                },
                perks: {
                    channeled_weapon: +1,
                    quickcast: +1,
                    caster: +1,
                },
            },
            {
                stats: {
                    MagicDefense: 25,
                    Warding: 12.5,
                },
                perks: {
                    channeled_weapon: +2,
                    quickcast: +2,
                    caster: +1,
                },
            },
            {
                stats: {
                    MagicDefense: 30,
                    Warding: 15,
                },
                perks: {
                    channeled_weapon: +3,
                    quickcast: +3,
                    caster: +1,
                },
            },
        ],
    },
    cleric: {
        id: "cleric",
        name: "Cleric",
        category: "Guild",
        description: "Guild for Healers",
        promotions: [
            {
                stats: {
                    HexDefense: +20,
                    HolyDefense: +15,
                },
                perks: {
                    blessing: +2,
                    heal_boost: +2,
                    luminescent_fervor: +1,
                },
            },
            {
                stats: {
                    HexDefense: +25,
                    HolyDefense: +18.75,
                },
                perks: {
                    blessing: +2,
                    heal_boost: +4,
                    luminescent_fervor: +2,
                },
            },
            {
                stats: {
                    HexDefense: +30,
                    HolyDefense: +22.5,
                },
                perks: {
                    blessing: +2,
                    heal_boost: +6,
                    luminescent_fervor: +3,
                },
            },
        ],
    },
    knight: {
        id: "knight",
        name: "Knight",
        category: "Guild",
        description: "Guild for mages",
        promotions: [
            {
                stats: {
                    ColdResistance: +100,
                    Warding: +20,
                    Tenacity: +0.4,
                    Protection: +10,
                    PhysicalDefense: +2,
                    MagicDefense: +20,
                },
                perks: {
                    valor: +1,
                    hardened_will: +1,
                },
            },
            {
                stats: {
                    ColdResistance: +125,
                    Warding: +25,
                    Tenacity: +0.5,
                    Protection: +12.5,
                    PhysicalDefense: +25,
                    MagicDefense: +25,
                },
                perks: {
                    valor: +2,
                    hardened_will: +2,
                },
            },
            {
                stats: {
                    ColdResistance: +150,
                    Warding: +30,
                    Tenacity: +0.6,
                    Protection: +15,
                    PhysicalDefense: +30,
                    MagicDefense: +30,
                },
                perks: {
                    valor: +3,
                    hardened_will: +3,
                },
            },
        ],
    },
    thief: {
        id: "thief",
        name: "Thief",
        category: "Guild",
        description: "Guild for thief",
        promotions: [
            {
                stats: {
                    JumpBoost: +3,
                    SpeedBoost: +10,
                    Protection: -10,
                },
                perks: {
                    stealth: +1,
                    backstab: +1,
                },
            },
            {
                stats: {
                    JumpBoost: +3.75,
                    SpeedBoost: +2.5,
                    Protection: -10,
                },
                perks: {
                    stealth: +1,
                    backstab: +2,
                },
            },
            {
                stats: {
                    JumpBoost: +4.5,
                    SpeedBoost: +15,
                    Protection: -10,
                },
                perks: {
                    stealth: +1,
                    backstab: +3,
                },
            },
        ],
    },
    gladiator: {
        id: "gladiator",
        name: "Gladiator",
        category: "Guild",
        description: "Guild for Warriors",
        promotions: [
            {
                stats: {
                    SpeedBoost: +5,
                    PhysicalDefense: +10,
                    HeatResistance: +50,
                },
                perks: {
                    fury: +1,
                    gladiatorial_rage: +1,
                },
            },
            {
                stats: {
                    SpeedBoost: +6.25,
                    PhysicalDefense: +12.5,
                    HeatResistance: +62.5,
                },
                perks: {
                    fury: +2,
                    gladiatorial_rage: +2,
                },
            },
            {
                stats: {
                    SpeedBoost: +7.5,
                    PhysicalDefense: +15,
                    HeatResistance: +75,
                },
                perks: {
                    fury: +3,
                    gladiatorial_rage: +3,
                },
            },
        ],
    },
    monk: {
        id: "monk",
        name: "Monk",
        category: "Guild",
        description: "Guild for Monks",
        promotions: [
            {
                stats: {
                    ColdResistance: +150,
                    Warding: +10,
                    Protection: +5,
                    SpeedBoost: +5,
                    HeatResistance: +150,
                },
                perks: {
                    spirit_commune: +1,
                },
            },
            {
                stats: {
                    ColdResistance: +187.5,
                    Warding: +12.5,
                    Protection: +6.25,
                    SpeedBoost: +6.25,
                    HeatResistance: +187.5,
                },
                perks: {
                    spirit_commune: +2,
                },
            },
            {
                stats: {
                    ColdResistance: +225,
                    Warding: +15,
                    Protection: +7.5,
                    SpeedBoost: +7.5,
                    HeatResistance: +225,
                },
                perks: {
                    spirit_commune: +3,
                },
            },
        ],
    },
    vampire: {
        id: "vampire",
        name: "Vampire",
        category: "Guild",
        description: "Guild for Carti Fan's",
        promotions: [
            {
                stats: {
                    HexDefense: +20,
                    ColdResistance: +50,
                    JumpBoost: +1,
                    SpeedBoost: +6,
                    PhysicalDefense: +3,
                    HolyDefense: -100,
                },
                perks: {
                    lifesteal: +1,
                    vampire: +1,
                },
            },
            {
                stats: {
                    HexDefense: +25,
                    ColdResistance: +62.5,
                    JumpBoost: +1.25,
                    SpeedBoost: +7.5,
                    PhysicalDefense: +3.75,
                    HolyDefense: -100,
                },
                perks: {
                    lifesteal: +1,
                    vampire: +2,
                },
            },
            {
                stats: {
                    HexDefense: +30,
                    ColdResistance: +75,
                    JumpBoost: +1.5,
                    SpeedBoost: +9,
                    PhysicalDefense: +4.5,
                    HolyDefense: -100,
                },
                perks: {
                    lifesteal: +2,
                    vampire: +3,
                },
            },
        ],
    },
    cursed: {
        id: "cursed",
        name: "Cursed",
        category: "Guild",
        description: "Guild for Wackos",
        promotions: [
            {
                stats: {
                    HexDefense: -50,
                },
                perks: {
                    Cursed: +1,
                },
            },
            {
                stats: {
                    HexDefense: -50,
                },
                perks: {
                    Cursed: +2,
                },
            },
            {
                stats: {
                    HexDefense: -50,
                },
                perks: {
                    Cursed: +3,
                },
            },
        ],
    },
    draconic: {
        id: "draconic",
        name: "Draconic",
        category: "Guild",
        description: "Guild for Dragons",
        promotions: [
            {
                stats: {
                    ColdResistance: +200,
                    HeatResistance: +200,
                    Tenacity: +0.2,
                },
                perks: {
                    draconic_blood: +1,
                    draconic_runes: +1,
                },
            },
            {
                stats: {
                    ColdResistance: +250,
                    HeatResistance: +250,
                    Tenacity: +0.25,
                },
                perks: {
                    draconic_blood: +2,
                    draconic_runes: +2,
                },
            },
            {
                stats: {
                    ColdResistance: +300,
                    HeatResistance: +300,
                    Tenacity: +0.3,
                },
                perks: {
                    draconic_blood: +3,
                    draconic_runes: +3,
                },
            },
        ],
    },
};
