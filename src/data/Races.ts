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
        source: {"cardId": "69214b9731723704c1eda160", "cardUrl": "https://trello.com/c/K6A7nUIn"},
        img: ""
    },
    half_ork: {
        id: "half_ork",
        name: "Half-Ork",
        category: "",
        description: "Half-Orks are known to be ill tempered and renowned for their strength. Many have since learned their manners nowadays.",
        racepassive: "Gain 10 armor penetration on all attacks.",
        stats: { ArmorPenetration: 10 },
        perks: {
            half_ork: 1
        },
        source: {"cardId": "69214b9731723704c1eda162", "cardUrl": "https://trello.com/c/H21hd8fF"},
        img: ""
    },
    elf: {
        id: "elf",
        name: "Elf",
        category: "",
        description: "Elves are the royalty and high class, they make up a small percentage of the population. Known widely for their magical prowess.",
        racepassive: "40% lower Rune cooldown, applied as base cooldown x0.6.",
        stats: {},
        perks: {
            elf: 1
        },
        source: {"cardId": "69214b9731723704c1eda164", "cardUrl": "https://trello.com/c/k9Bk1WcF"},
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
        source: {"cardId": "69214b9731723704c1eda166", "cardUrl": "https://trello.com/c/W16ggAzA"},
        img: ""
    },
    dragon: {
        id: "dragon",
        name: "Dragon Blooded",
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
        source: {"cardId": "69214b9731723704c1eda168", "cardUrl": "https://trello.com/c/sv8XLjVw"},
        img: ""
    },
    ork: {
        id: "ork",
        name: "Ork",
        category: "",
        description: "Orks are a very secluded race consisted of only the strong. Many Orks are viewed as impulsive and are disliked by many.",
        racepassive: "Weapon arts gain 10 armor penetration. +0.2 Tenacity and for each active buff you gain an additional +0.1 tenacity.",
        stats: { Tenacity: 0.2 },
        perks: {
            ork: 1
        },
        source: {"cardId": "69214b9731723704c1eda16a", "cardUrl": "https://trello.com/c/ufhlTnQg"},
        img: ""
    },
    high_elf: {
        id: "high_elf",
        name: "High Elf",
        category: "",
        description: "The High Elves are consisted of the upper echelon of the elven tribes, They are known to be rude and respect only those who are the same status. Known widely for their vast knowledge.",
        racepassive: "25% lower Weapon Art cooldown, applied as base cooldown x0.75.",
        stats: {},
        perks: {
            high_elf: 1
        },
        source: {"cardId": "69214b9731723704c1eda16c", "cardUrl": "https://trello.com/c/VJuStVeo"},
        img: ""
    },
    arborian: {
        id: "arborian",
        name: "Arborian",
        category: "",
        description: "The Arborians are druidic in nature. They are trees made of tough bark and use their power to protect all life",
        racepassive: "-50% Fire Defense and +15 Protection. Regenerate 0.41% HP per second in sunlight, less in darkness. Attacks can Entangle.",
        stats: { FireDefense: -50, Protection: 15 },
        perks: {
            arborian: 1
        },
        source: {"cardId": "69214b9731723704c1eda16e", "cardUrl": "https://trello.com/c/xd5qLFxt"},
        img: ""
    },
    kitsune: {
        id: "kitsune",
        name: "Kitsune",
        category: "",
        description: "The Kitsune are a nomadic race travelling alone or in packs rarely staying in one place to long. They posess incredible speed and reflex and are not often caught by surprise",
        racepassive: "Gain +2 Jump Boost and 10% Movement Speed and +0.1 to your attack speed.",
        stats: { JumpBoost: 2, SpeedBoost: 10 },
        perks: {
            kitsune: 1
        },
        flatAttackSpeed: 0.1,
        source: {"cardId": "69214b9731723704c1eda170", "cardUrl": "https://trello.com/c/Nuv9nzVj"},
        img: ""
    },
    bunikin: {
        id: "bunikin",
        name: "Bunikin",
        category: "",
        description: "The mysterious bunikin are being of mystical whimsy and are rarely seen anywhere in the world.",
        racepassive: "+5 Jump Boost. Dodge chance scales with Jump Boost (exact formula unverified); dodging grants Guaranteed Crit for one attack.",
        stats: { JumpBoost: 5 },
        perks: {
            bunikin: 1
        },
        source: {"cardId": "69214b9731723704c1edaa58", "cardUrl": "https://trello.com/c/WmcRb815"},
        img: ""

    }
}