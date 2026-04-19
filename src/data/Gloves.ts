let images = "../image/gloves/";

export const Gloves: import("../models/Item").ItemDataTable = {
  basic_gloves: {
    id: "basic_gloves",
    name: "Basic Gloves",
    tier: 1,
    category: "Glove",
    type: "Gloves",
    attackSpeed: 1,
    stats: {
      DexterityBoost: 10,
      PhysicalBoost: 10,
    },
    damageScalings: {
      Physical: 0.15,
      Dexterity: 0.15,
    },
    damageTypes: {
      Physical: 1,
    },
    perks: {
      basic_spirit: 1,
      marsh_flow: 1,
    },
    img: "",
  },
  woof_fang_fist: {
    id: "woof_fang_fist",
    name: "Woof Fang Fist",
    tier: 2,
    category: "Glove",
    type: "Gloves",
    attackSpeed: 1,
    stats: {
      PhysicalDefense: 10,
      ColdResistance: 100,
      PhysicalBoost: 10,
    },
    damageScalings: {
      Physical: 0.4,
    },
    damageTypes: {
      Physical: 1,
    },
    perks: {
      woof_spirit: 1,
      sharp_claws: 1,
    },
    img: "",
  },
  mageling_gloves: {
    id: "mageling_gloves",
    name: "Mageling Gloves",
    tier: 2,
    category: "Glove",
    type: "Gloves",
    attackSpeed: 1,
    stats: {
      MagicBoost: 10,
      MagicDefense: 10,
      Warding: 20,
    },
    damageScalings: {
      Magic: 0.4,
    },
    damageTypes: {
      Magic: 1,
    },
    perks: {
      mageling_spirit: 1,
      caster: 2,
    },
    img: "",
  },
  buni_gloves: {
    id: "buni_gloves",
    name: "Buni Gloves",
    tier: 2,
    category: "Glove",
    type: "Gloves",
    attackSpeed: 1,
    stats: {
      DexterityBoost: 10,
      JumpBoost: 3,
    },
    damageScalings: {
      Dexterity: 0.4,
    },
    damageTypes: {
      Physical: 1,
    },
    perks: {
      rabbits_foot: 1,
      buni_spirit: 1,
    },
    img: "",
  },
  toadzerker_gloves: {
    id: "toadzerker_gloves",
    name: "Toadzerker Gloves",
    tier: 3,
    category: "Glove",
    type: "Gloves",
    attackSpeed: 1,
    stats: {
      PhysicalDefense: 15,
      JumpBoost: 4,
      PhysicalBoost: 15,
    },
    damageScalings: {
      Physical: 0.5,
    },
    damageTypes: {
      Physical: 1,
    },
    perks: {
      toadzerker_spirit: 1,
      raging_bounce: 1,
      spring_step: 1,
    },
    img: "",
  },
  winter_woof_gloves: {
    id: "winter_woof_gloves",
    name: "Winter Woof Gloves",
    tier: 3,
    category: "Glove",
    type: "Gloves",
    attackSpeed: 1,
    stats: {
      PhysicalDefense: 10,
      DexterityBoost: 10,
      MagicDefense: 10,
      PhysicalBoost: 10,
    },
    damageScalings: {
      Physical: 0.4,
      Dexterity: 0.4,
    },
    damageTypes: {
      Physical: 1,
    },
    perks: {
      blood_thirsty: 1,
      winter_woof_spirit: 1,
    },
    img: "",
  },
  bumblz_gloves: {
    id: "bumblz_gloves",
    name: "Bumblz Gloves",
    tier: 3,
    category: "Glove",
    type: "Gloves",
    attackSpeed: 1,
    stats: {
      MagicBoost: 10,
      JumpBoost: 5,
    },
    damageScalings: {
      Magic: 0.5,
      Summon: 0.1,
    },
    damageTypes: {
      Magic: 0.5,
      Physical: 0.5,
    },
    perks: {
      swarm: 1,
      bumblz_spirit: 1,
    },
    img: "",
  },
  bulfrogg_gloves: {
    id: "bulfrogg_gloves",
    name: "Bulfrogg Gloves",
    tier: 3,
    category: "Glove",
    type: "Gloves",
    attackSpeed: 1,
    stats: {
      MagicBoost: 10,
      WaterBoost: 10,
      JumpBoost: 5,
    },
    damageScalings: {
      Water: 0.4,
      Magic: 0.4,
    },
    damageTypes: {
      Water: 0.7,
      Magic: 0.3,
    },
    perks: {
      spring_step: 1,
      bulfrogg_spirit: 1,
      bounce_momentum: 1,
    },
    img: "",
  },
  dire_buni_gloves: {
    id: "dire_buni_gloves",
    name: "Dire Buni Gloves",
    tier: 3,
    category: "Glove",
    type: "Gloves",
    attackSpeed: 1,
    stats: {
      DexterityBoost: 15,
    },
    damageScalings: {
      Dexterity: 0.5,
    },
    damageTypes: {
      Physical: 1,
    },
    perks: {
      rabbits_foot: 1,
      quick_witted: 1,
      dire_buni_spirit: 1,
    },
    img: "",
  },
  caci_gloves: {
    id: "caci_gloves",
    name: "Caci Gloves",
    tier: 3,
    category: "Glove",
    type: "Gloves",
    attackSpeed: 1,
    stats: {
      Protection: 15,
      DexterityBoost: 15,
      PhysicalBoost: 15,
    },
    damageScalings: {
      Dexterity: 0.4,
      Physical: 0.4,
    },
    damageTypes: {
      Physical: 1,
    },
    perks: {
      caci_spirit: 1,
      thorns: 1,
    },
    img: "",
  },
  croakernaut_shield: {
    id: "croakernaut_shield",
    name: "Croakernaut Shield",
    tier: 4,
    category: "Glove",
    type: "Shield",
    attackSpeed: 1,
    stats: {
      MagicDefense: 15,
      PhysicalDefense: 15,
      Protection: 10,
      Warding: 40,
      Tenacity: 0.2,
    },
    damageScalings: {
      Physical: 0.7,
    },
    damageTypes: {
      Physical: 1,
    },
    perks: {
      shielding_gong: 1,
      reinforced_block: 1,
      defensive_stance: 1,
      croakernaut_spirit: 1,
    },
    img: "",
  },
  dragigator_gloves: {
    id: "dragigator_gloves",
    name: "Dragigator Gloves",
    tier: 4,
    category: "Glove",
    type: "Gloves",
    attackSpeed: 1,
    stats: {
      FireBoost: 10,
      PhysicalBoost: 10,
      PhysicalDefense: 10,
      Warding: 20,
    },
    damageScalings: {
      Fire: 0.55,
      Physical: 0.55,
    },
    damageTypes: {
      Fire: 0.6,
      Physical: 0.4,
    },
    perks: {
      bellowing_ember: 1,
      smoldering: 1,
      dragigator_spirit: 1,
    },
    img: "",
  },
  bowldur_gloves: {
    id: "bowldur_gloves",
    name: "Bowldur Gloves",
    tier: 4,
    category: "Glove",
    type: "Gloves",
    attackSpeed: 1,
    stats: {
      EarthBoost: 20,
      PhysicalBoost: 15,
    },
    damageScalings: {
      Earth: 0.55,
      Physical: 0.55,
    },
    damageTypes: {
      Earth: 0.6,
      Physical: 0.4,
    },
    perks: {
      seismic_momentum: 1,
      bowldur_spirit: 1,
    },
    img: "",
  },
  iron_slayer_gloves: {
    id: "iron_slayer_gloves",
    name: "Iron Slayer Gloves",
    tier: 4,
    category: "Glove",
    type: "Gloves",
    attackSpeed: 0.8,
    stats: {
      Protection: 30,
      PhysicalDefense: 15,
      PhysicalBoost: 20,
    },
    damageScalings: {
      Physical: 0.7,
    },
    damageTypes: {
      Physical: 1.2,
    },
    perks: {
      void_rage: 1,
      iron_slayer_spirit: 1,
      fury: 2,
    },
    img: "",
  },
  bomber_gloves: {
    id: "bomber_gloves",
    name: "Bomber Gloves",
    tier: 4,
    category: "Glove",
    type: "Gloves",
    attackSpeed: 0.9,
    stats: {
      HolyBoost: 10,
      MagicBoost: 10,
      Protection: 20,
      Tenacity: 0.2,
    },
    damageScalings: {
      Magic: 0.55,
      Holy: 0.55,
    },
    damageTypes: {
      Magic: 0.5,
      Holy: 0.5,
    },
    perks: {
      bomber_charge: 1,
      bombardier: 2,
      bomber_spirit: 1,
    },
    img: "",
  },
  queen_bumblz_gloves: {
    id: "queen_bumblz_gloves",
    name: "Queen Bumblz Gloves",
    tier: 4,
    category: "Glove",
    type: "Gloves",
    attackSpeed: 1,
    stats: {
      HolyBoost: 15,
      MagicBoost: 15,
    },
    damageScalings: {
      Magic: 0.5,
      Holy: 0.5,
      Summon: 0.2,
    },
    damageTypes: {
      Magic: 0.5,
      Holy: 0.5,
    },
    perks: {
      sticky_summons: 1,
      queens_power: 1,
      queen_bumblz_spirit: 1,
    },
    img: "",
  },
  snoeman_gloves: {
    id: "snoeman_gloves",
    name: "Snoeman Gloves",
    tier: 4,
    category: "Glove",
    type: "Gloves",
    attackSpeed: 1,
    stats: {
      MagicBoost: 10,
      WaterBoost: 10,
      MagicDefense: 10,
      Tenacity: 0.2,
      HeatResistance: 150,
    },
    damageScalings: {
      Water: 0.55,
      Magic: 0.55,
    },
    damageTypes: {
      Water: 0.5,
      Magic: 0.5,
    },
    perks: {
      icestorm: 1,
      frostbite: 1,
      snoeman_spirit: 1,
    },
    img: "",
  },
  void_root_gloves: {
    id: "void_root_gloves",
    name: "Void Root Gloves",
    tier: 4,
    category: "Glove",
    type: "Gloves",
    attackSpeed: 1,
    stats: {
      HexBoost: 10,
      PhysicalBoost: 10,
      Warding: 30,
      Tenacity: 0.1,
    },
    damageScalings: {
      Hex: 0.55,
      Physical: 0.55,
    },
    damageTypes: {
      Hex: 0.6,
      Physical: 0.4,
    },
    perks: {
      cursed_bark: 1,
      endless_despair: 1,
      void_root_spirit: 1,
    },
    img: "",
  },
  roguent_gloves: {
    id: "roguent_gloves",
    name: "Roguent Gloves",
    tier: 4,
    category: "Glove",
    type: "Gloves",
    attackSpeed: 1.1,
    stats: {
      DexterityBoost: 20,
    },
    damageScalings: {
      Dexterity: 0.7,
    },
    damageTypes: {
      Physical: 1,
    },
    perks: {
      splinter: 1,
      roguent_spirit: 1,
    },
    img: "",
  },
  deep_spider_gloves: {
    id: "deep_spider_gloves",
    name: "Deep Spider Gloves",
    tier: 4,
    category: "Glove",
    type: "Gloves",
    attackSpeed: 1.2,
    stats: {
      DexterityBoost: 15,
      HexDefense: 25,
    },
    damageScalings: {
      Dexterity: 0.7,
    },
    damageTypes: {
      Physical: 1,
    },
    perks: {
      toxin_transfer: 1,
      deep_spider_spirit: 1,
    },
    img: "",
  },
  caci_king_gloves: {
    id: "caci_king_gloves",
    name: "Caci King Gloves",
    tier: 4,
    category: "Glove",
    type: "Gloves",
    attackSpeed: 1,
    stats: {
      EarthBoost: 15,
    },
    damageScalings: {
      Air: 0.55,
      Earth: 0.55,
    },
    damageTypes: {
      Air: 0.5,
      Earth: 0.5,
    },
    perks: {
      ruler_of_the_sands: 1,
      caci_king_spirit: 1,
    },
    img: "",
  },
  gremlin_gloves: {
    id: "gremlin_gloves",
    name: "Gremlin Gloves",
    tier: 4,
    category: "Glove",
    type: "Gloves",
    attackSpeed: 1.3,
    stats: {
      DexterityBoost: 10,
      Warding: 20,
      PhysicalBoost: 10,
    },
    damageScalings: {
      Dexterity: 0.55,
      Physical: 0.55,
    },
    damageTypes: {
      Physical: 1,
    },
    perks: {
      gremlin_spirit: 1,
      sharp_claws: 4,
      slow_leak: 1,
    },
    img: "",
  },
};
