export const WeaponArts: import("../models/WeaponArt").weaponArtDataTable = {
  lunge: {
    id: "lunge",
    name: "Lunge",
    description: "Lunge forwards with your sword!",
    coolDown: 12,
    baseDamage: 3.21,
  },
  spin: {
    id: "spin",
    name: "Spin",
    description: "Spin with your weapon to quickly chop up the opponent!",
    coolDown: 10,
    baseDamage: 27,
    totalHits: 6,
    weaponTypeRequirements: [
      "TwoHanded sword",
      "Greatsword",
      "Unbalanced Sword",
    ],
  },
  rapid_stabs: {
    id: "rapid_stabs",
    name: "Rapid Stabs",
    description: "Preform three fast stabs that deal low damage and reset your M1 combo.!",
    coolDown: 10,
    baseDamage: 8.75,
    weaponTypeRequirements: [
      "Dagger",
      "OneHanded sword",
      "Spear",
    ],
    scalingRequirements: {
      Dexterity: 0.5,
    },
  },
  javelin: {
    id: "javelin",
    name: "Javelin",
    description: "Throw your spear like a javelin and apply bleed!",
    coolDown: 15,
    baseDamage: 27,
    weaponTypeRequirements: [
      "Spear",
      "Great Spear",
    ],
  },
  rend: {
    id: "rend",
    name: "Rend",
    description: "Release a slow strong slash that gains size and speed on each enemy hit and critically strikes the first enemy hit.",
    coolDown: 20,
    baseDamage: 20,
    weaponTypeRequirements: [
      "Greatsword",
    ],
  },
  slam: {
    id: "slam",
    name: "Slam",
    description: "Slam your sword into the floor!",
    coolDown: 20,
    baseDamage: 30,
    weaponTypeRequirements: [
      "Greatsword",
      "Unbalanced Sword",
      "Great Spear",
      "Spear",
      "Mallet",
      "Warhammer",
    ],
    scalingRequirements: {
      Physical: 0.5,
    },
  },
  dagger_throw: {
    id: "dagger_throw",
    name: "Dagger Throw",
    description: "Throw three poisonous daggers downwards.",
    coolDown: 15,
    baseDamage: 7.5*3,
    weaponTypeRequirements: [
      "Dagger",
    ],
    scalingRequirements: {
      Dexterity: 0.7,
    },
  },
  cross_slash: {
    id: "cross_slash",
    name: "Cross Slash",
    description: "Slash in a cross weakening the opponents defenses.",
    coolDown: 20,
    baseDamage: 12*2,
    sourcepotencies: {
        shatterpotency: 0.3
    },
    weaponTypeRequirements: [
      "OneHanded sword",
      "TwoHanded sword",
      "Greatsword",
      "Unbalanced Sword",
    ],
    scalingRequirements: {
      Dexterity: 0.5,
      Physical: 0.5,
    },
  },
  impale: {
    id: "impale",
    name: "Impale",
    description: "Stab though the opponent in a critical spot and then throw them aside.",
    coolDown: 12,
    baseDamage: 10.5*2,
    weaponTypeRequirements: [
      "OneHanded sword",
      "TwoHanded sword",
      "Greatsword",
      "Unbalanced Sword",
      "Spear",
    ],
  },
  warrior_stomp: {
    id: "warrior_stomp",
    name: "Warrior Stomp",
    description: "Stomp the floor giving yourself rage and taunting everyone around you.",
    coolDown: 20,
    baseDamage: 3,
    sourcepotencies: {
      ragepotency: 0.3,
    },
    statsRequirements: {
      PhysicalDefense: 5,
    },
  },
  barrage: {
    id: "barrage",
    name: "Barrage",
    description: "Barrage with a flurry of punches!",
    coolDown: 10,
    baseDamage: 24,
    guildRequirements: [
      "monk",
    ],
  },
  shatter: {
    id: "shatter",
    name: "Shatter",
    description: "Wind back your fist and release a brutal punch sundering the opponents defenses!",
    coolDown: 30,
    baseDamage: 37.5,
    sourcepotencies: {
      shatterpotency: 0.3,
    },
    guildRequirements: [
      "monk",
    ],
    scalingRequirements: {
      Physical: 0.6,
    },
  },
  focus: {
    id: "focus",
    name: "Focus",
    description: "Predict an incoming attack to enter a flow state where you retaliate any hit with a punch!",
    coolDown: 25,
    baseDamage: 8,
    guildRequirements: [
      "monk",
    ],
    scalingRequirements: {
      Dexterity: 0.6,
    },
  },
  retaliate: {
    id: "retaliate",
    name: "Retaliate",
    description: "Absorb pre mitigation damage and then release it back at the opponent.",
    coolDown: 20,
    baseDamage: 175,
    damageTypes: {
      Physical: 0.5,
      True: 0.5,
    },
    statsRequirements: {
      Tenacity: 0.1,
    },
  },
  laser: {
    id: "laser",
    name: "Laser",
    description: "Shoot a laser from the tip of your sword!",
    coolDown: 6,
    baseDamage: 19.5,
    scalingRequirements: {
      Magic: 0.3,
    },
  },
  mines: {
    id: "mines",
    name: "Mines",
    description: "Throw 5 mines on the floor that explode when touched!",
    coolDown: 20,
    baseDamage: 10,
    scalingRequirements: {
      Magic: 0.5,
    },
  },
  mage_bomb: {
    id: "mage_bomb",
    name: "Mage Bomb",
    description: "Release a giant bomb of energy that deals high damage!",
    coolDown: 25,
    baseDamage: 45,
    statsRequirements: {
      MagicBoost: 11,
    },
  },
  magical_ray: {
    id: "magical_ray",
    name: "Magical Ray",
    description: "Shoot out a continous ray of magic that keeps opponents at bay.",
    coolDown: 15,
    baseDamage: 2.25*15,
    statsRequirements: {
      MagicBoost: 21,
    },
  },
  condensed_star: {
    id: "condensed_star",
    name: "Condensed Star",
    description: "Release a star of condensed energy that amplifies proc chance of chance based effects/perks",
    coolDown: 8,
    baseDamage: 4,
    damageScalings: {
      Magic: 1,
      Dexterity: 1,
    },
    damageTypes: {
      True: 1,
    },
  },
  mage_bomber_summon: {
    id: "mage_bomber_summon",
    name: "Mage Bomber Summon",
    description: "Summon 2 mage bombers to explode the enemy!",
    coolDown: 10,
    baseDamage: 25,
    scalingRequirements: {
      Magic: 0.3,
    },
    statsRequirements: {
      SummonBoost: 10,
    },
  },
  blessedlings_summon: {
    id: "blessedlings_summon",
    name: "Blessedlings Summon",
    description: "Summon 2 Blessedlings to help fight!",
    coolDown: 20,
    scalingRequirements: {
      Holy: 0.3,
    },
    statsRequirements: {
      SummonBoost: 10,
    },
  },
  toaladin_summon: {
    id: "toaladin_summon",
    name: "Toaladin Summon",
    description: "Summon a toaladin and grant yourself rage!",
    coolDown: 40,
    scalingRequirements: {
      Holy: 0,
    },
    statsRequirements: {
      SummonBoost: 20,
    },
  },
  undead_buni_summon: {
    id: "undead_buni_summon",
    name: "Undead Buni Summon",
    description: "Summon undead bunis!",
    coolDown: 10,
    scalingRequirements: {
      Hex: 0.3,
    },
    statsRequirements: {
      SummonBoost: 7,
    },
  },
  skeletal_woof_summon: {
    id: "skeletal_woof_summon",
    name: "Skeletal Woof Summon",
    description: "Summon a skeletal woof!",
    coolDown: 25,
    scalingRequirements: {
      Hex: 0.3,
    },
    statsRequirements: {
      SummonBoost: 20,
    },
  },
  lesser_heal: {
    id: "lesser_heal",
    name: "Lesser Heal",
    description: "Heal in a small area around yourself!",
    coolDown: 60,
    damageScalings: {
      Holy: 0.7,
      Magic: 0.3,
    },
    scalingRequirements: {
      Holy: 0.3,
    },
  },
  holy_phalanx: {
    id: "holy_phalanx",
    name: "Holy Phalanx",
    description: "Raise a shield and rapidly stab holy spears through it.",
    coolDown: 15,
    totalHits: 21,
    baseDamage: 5,
    damageTypes: {
        Holy: 1.0
    },
    weaponTypeRequirements: [
      "Great Spear",
      "Spear",
    ],
    scalingRequirements: {
      Holy: 0.4,
    },
  },
  holy_shrine: {
    id: "holy_shrine",
    name: "Holy Shrine",
    description: "Radiate holy energy from your character that heals allies and deals slight holy damage!",
    coolDown: 60,
    baseDamage: 2*6,
    damageTypes: {
        Holy: 0.1
    },
    damageScalings: {
      Holy: 0.7,
    },
    scalingRequirements: {
      Holy: 0.8,
    },
    statsRequirements: {
      HolyBoost: 15,
    },
  },
  cursed_ground: {
    id: "cursed_ground",
    name: "Cursed Ground",
    description: "Stab the floor weakening all nearby opponents with hex energy!",
    coolDown: 15,
    baseDamage: 26.25,
    sourcepotencies: {
      weakeningpotency: 1,
    },
    damageTypes: {
      Hex: 1,
    },
    scalingRequirements: {
      Hex: 0.3,
    },
  },
  jinx: {
    id: "jinx",
    name: "Jinx",
    description: "Detonate all debuffs around yourself dealing bonus damage based on how many debuffs they have!",
    coolDown: 15,
    baseDamage: 8.25,
    damageTypes: {
      Hex: 1,
    },
    scalingRequirements: {
      Hex: 0.6,
    },
  },
  dark_tentacle: {
    id: "dark_tentacle",
    name: "Dark Tentacle",
    description: "Conjure dark forces to summon a hex tentacle. Quickly repeated casts increase the amount of tentacles summoned but also put a toll on your body.",
    coolDown: 2,
    baseDamage: 5.5,
    damageScalings: {
      Hex: 1,
    },
    damageTypes: {
      Hex: 1,
    },
    scalingRequirements: {
      Hex: 0.8,
    },
  },
  curse_flame_ray: {
    id: "curse_flame_ray",
    name: "Curse Flame Ray",
    description: "Use your eyes to blast out a ray of cursed flames but take damage in return!",
    coolDown: 20,
    baseDamage: 42,
    damageTypes: {
      Fire: 0.5,
      Hex: 0.5,
    },
    scalingRequirements: {
      Hex: 0.4,
      Fire: 0.4,
    },
  },
  gale_assault: {
    id: "gale_assault",
    name: "Gale Assault",
    description: "Dash though your opponent and deal a moderate amount of damage.",
    coolDown: 15,
    baseDamage: 19.5,
    scalingRequirements: {
      Air: 0.3,
    },
  },
  storm_stomp: {
    id: "storm_stomp",
    name: "Storm Stomp",
    description: "Stomp with immense force to create a brutal tornado.",
    coolDown: 20,
    baseDamage: 13*2,
    damageTypes: {
      Air: 1,
    },
    scalingRequirements: {
      Air: 0.5,
    },
  },
  lightning_cloak: {
    id: "lightning_cloak",
    name: "Lightning Cloak",
    description: "Gain chain lightning on hit, aswell as a 20% speed boost.",
    coolDown: 50,
    sourcepotencies: {
        lightningcloakpotency: 0.3,
    },
    scalingRequirements: {
      Air: 0.5,
      Magic: 0.5,
    },
  },
  flame_slash: {
    id: "flame_slash",
    name: "Flame Slash",
    description: "Send a blade of fire though the air!",
    coolDown: 15,
    baseDamage: 22.5,
    sourcepotencies: {
      burnpotency: 0.5,
    },
    damageTypes: {
      Fire: 1,
    },
    scalingRequirements: {
      Fire: 0.3,
    },
  },
  flamethrower: {
    id: "flamethrower",
    name: "Flamethrower",
    description: "Blast a stream of flames out the end of your sword.",
    coolDown: 15,
    baseDamage: 45,
    damageTypes: {
      Fire: 1,
    },
    scalingRequirements: {
      Fire: 0.6,
    },
  },
  erupt: {
    id: "erupt",
    name: "Erupt",
    description: "Krakatoa!! Explode and launch a bunch of magma balls around yourself!",
    coolDown: 20,
    baseDamage: 45,
    damageTypes: {
      Fire: 1,
    },  
    scalingRequirements: {
      Fire: 0.3,
      Earth: 0.3,
    },
  },
  cleanse: {
    id: "cleanse",
    name: "Cleanse",
    description: "Cleanse debuffs around yourself and perform a weak heal.",
    coolDown: 30,
    damageScalings: {
      Water: 0.7,
      Magic: 0.3,
    },
    scalingRequirements: {
      Water: 0.3,
    },
  },
  splash: {
    id: "splash",
    name: "Splash",
    description: "Crash down a orb of water around yourself.",
    coolDown: 20,
    baseDamage: 30,
    damageTypes: {
      Physical: 0.5,
      Water: 0.5,
    },
    scalingRequirements: {
      Water: 0.6,
    },
  },
  waterfall: {
    id: "waterfall",
    name: "Waterfall",
    description: "Crash down a orb of water infront of yourself.",
    coolDown: 20,
    baseDamage: 33,
    damageTypes: {
      Water: 1,
    },
    scalingRequirements: {
      Water: 0.8,
    },
  },
  icicle_wave: {
    id: "icicle_wave",
    name: "Icicle Wave",
    description: "Stab your sword into the ground and create a wave of icicles.",
    coolDown: 20,
    baseDamage: 36,
    damageTypes: {
      Water: 0.5,
      Physical: 0.5,
    },
    scalingRequirements: {
      Water: 0.5,
    },
    statsRequirements: {
      HeatResistance: 50,
    },
  },
  earthquake: {
    id: "earthquake",
    name: "Earthquake",
    description: "Stab your sword into the floor and create an Earthquake.",
    coolDown: 10,
    baseDamage: 6*  5,
    damageTypes: {
      Earth: 1,
    },
    scalingRequirements: {
      Earth: 0.3,
    },
  },
  grand_quake: {
    id: "grand_quake",
    name: "Grand Quake",
    description: "Slam your sword into the floor and create a super powerful earthquake!",
    coolDown: 30,
    baseDamage: 75,
    totalHits: 31,  
    damageTypes: {
      Earth: 1,
    },
    scalingRequirements: {
      Earth: 0.8,
    },
  },
  earth_slam: {
    id: "earth_slam",
    name: "Earth Slam",
    description: "Slam your sword into the floor and send out a wave of earth.",
    coolDown: 20,
    baseDamage: 42,
    damageTypes: {
      Earth: 0.5,
      Physical: 0.5,
    },
    scalingRequirements: {
      Earth: 0.5,
      Physical: 0.5,
    },
  },
  black_hole: {
    id: "black_hole",
    name: "Black Hole",
    description: "Pull opponents in and stun them for a long duration.",
    coolDown: 25,
    baseDamage: 10,
    damageTypes: {
      Magic: 0.5,
      Earth: 0.5,
    },
    scalingRequirements: {
      Magic: 0.3,
      Earth: 0.3,
    },
  },
  starstream: {
    id: "starstream",
    name: "Starstream",
    description: "Call forth a powerful stream of stars!!",
    coolDown: 25,
    baseDamage: 360,
    totalHits: 75,
    damageScalings: {
        Air: 1.0,
        Dexterity: 1.0,
        Earth: 1.0,
        Fire: 1.0,
        Hex: 1.0,
        Holy: 1.0,
        Magic: 1.0,
        Physical: 1.0,
        True: 0.5,
        Water: 1.0,
    },
    damageTypes: {
        Air: 1.0,
        Dexterity: 1.0,
        Earth: 1.0,
        Fire: 1.0,
        Hex: 1.0,
        Holy: 1.0,
        Magic: 1.0,
        Physical: 1.0,
        True: 0.5,
        Water: 1.0,
    },
    weaponRequirements: {
        blade: "starlight_greatblade",
        handle: "starlight_handle"
    }
  },
};
