let images = "/image/runes/";

export const Runes: import("../models/Item").ItemDataTable = {
  bounce_rune: {
    id: "bounce_rune",
    name: "Bounce Rune",
    category: "Rune",
    description: "Cast to become bouncy!.",
    // potencies: {
    //   bouncepotency: 0.3,
    // },
    stats: {
      JumpBoost: 5,
    },
    img: images + "bouncerune.png",
  },
  rage_rune: {
    id: "rage_rune",
    name: "Rage Rune",
    category: "Rune",
    description: "Become enraged and deal more damage!",
    // potencies: {
    //   ragepotency: 0.3,
    // },
    stats: {
      PhysicalBoost: 10,
    },
    img: "",
  },
  reinforce_rune: {
    id: "reinforce_rune",
    name: "Reinforce Rune",
    category: "Rune",
    description: "Cast to reduce incoming damage!.",
    // potencies: {
    //   reinforcepotency: 0.5,
    // },
    stats: {
      MagicDefense: 10,
    },
    img: "",
  },
  weakening_roar_rune: {
    id: "weakening_roar_rune",
    name: "Weakening Roar Rune",
    category: "Rune",
    description: "Unleash a mighty roar to weaken those around you!.",
    // potencies: {
    //   weakeningpotency: 0.5,
    // },
    stats: {
      HexBoost: 10,
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
    img: "",
  },
  taunting_rune: {
    id: "taunting_rune",
    name: "Taunting Rune",
    category: "Rune",
    description: "Taunt nearby enemies!.",
    stats: {
      PhysicalDefense: 10,
    },
    img: "",
  },
};
