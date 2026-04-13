export const Races: import("../models/Race").raceDataTable = {
    human: {
        id: "human",
        name: "Human",
        category: "",
        description: "Humans are the most common race, generally seen as weak by others. However, their strong will as well as their desire for money and prestige keeps them alive.",
        racepassive: "Gain 20% damage reduction and damage boost when below 50% HP.",
        stats: {},
        perks: {
            human: 1
        },
        img: ""
    },
    half_ork: {
        id: "half_ork",
        name: "Half-Ork",
        category: "",
        description: "Half-Orks are known to be ill tempered and renowned for their strength. Many have since learned their manners nowadays.",
        racepassive: "Gain 10 armor penetration on all attacks.",
        stats: {},
        perks: {
            half_ork: 1
        },
        img: ""
    },
    elf: {
        id: "elf",
        name: "Elf",
        category: "",
        description: "Elves are the royalty and high class, they make up a small percentage of the population. Known widely for their magical prowess.",
        racepassive: "Gain 40% rune cooldown reduction.",
        stats: {},
        perks: {
            elf: 1
        },
        img: ""
    },
    dark_elf: {
        id: "dark_elf",
        name: "Dark Elf",
        category: "",
        description: "Dark Elf origins are shrowded in mystery. However some believe an elf was charged with hex energy and when he had his kids, they too had hex energy within them.",
        racepassive: "An 8% chance to apply a random debuff to the opponent when hitting them.",
        stats: {},
        perks: {
            dark_elf: 1
        },
        img: ""
    },
    dragon: {
        id: "dragon",
        name: "Dragon",
        category: "",
        description: "The Dragon-Blooded are descendents of the ancient race known as Dracos. They possess incredible power but the draco blood within them gets weaker through every generation.",
        racepassive: "Gain 50% Warding and 10 Protection alongside 100% Heat and Cold Resistance.",
        stats: {
            Warding: 50,
            Protection: 10,
            HeatResistance: 100,
            ColdResistance: 100
        },
        perks: {
            dragon: 1
        },
        img: ""
    },
    ork: {
        id: "ork",
        name: "Ork",
        category: "",
        description: "Orks are a very secluded race consisted of only the strong. Many Orks are viewed as impulsive and are disliked by many.",
        racepassive: "Weapon arts gain 10 armor penetration. +0.2 Tenacity and for each active buff you gain an additional +0.1 tenacity.",
        stats: {},
        perks: {
            ork: 1
        },
        img: ""
    },
    half_elf: {
        id: "half_elf",
        name: "Half Elf",
        category: "",
        description: "The High Elves are consisted of the upper echelon of the elven tribes, They are known to be rude and respect only those who are the same status. Known widely for their vast knowledge.",
        racepassive: "25% lower Weapon Art cooldown.",
        stats: {},
        perks: {
            half_elf: 1
        },
        img: ""
    },
    arborian: {
        id: "arborian",
        name: "Arborian",
        category: "",
        description: "The Arborians are druidic in nature. They are trees made of tough bark and use their power to protect all life",
        racepassive: "-50 Fire Defense and +15 Protection. passive regen that is boosted in the sun, and a 5% chance to entangle enemies for 1 second.",
        stats: {},
        perks: {
            arborian: 1
        },
        img: ""
    },
    kitsune: {
        id: "kitsune",
        name: "Kitsune",
        category: "",
        description: "The Kitsune are a nomadic race travelling alone or in packs rarely staying in one place to long. They posess incredible speed and reflex and are not often caught by surprise",
        racepassive: "Gain +2 Jump Boost and 10% Movement Speed and +0.1 to your attack speed.",
        stats: {},
        perks: {
            kitsune: 1
        },
        img: ""
    },
    bunikin: {
        id: "bunikin",
        name: "Bunikin",
        category: "",
        description: "The mysterious bunikin are being of mystical whimsy and are rarely seen anywhere in the world.",
        racepassive: "Gain +5 Jump Boost and Gain dodge chance based on Jump Boost, when you dodge with the passive gain a 100% critical strike chance.",
        stats: {},
        perks: {
            bunikin: 1
        },
        img: ""

    }
}