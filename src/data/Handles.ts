let images = "../image/handles/";

export const Handles: import("../models/Item").ItemDataTable = {
  basic_handle: {
    id: "basic_handle",
    name: "Basic Handle",
    tier: 1,
    category: "Handle",
    type: "Medium Handle",
    attackSpeed: 1,
    damageScalings: {
      Physical: 0.15,
      Dexterity: 0.15,
    },
    img: "../image/handles/basichandle.png",

    "stats": {},
    "perks": {},
    "potencies": {},
    "source": {
      "cardId": "69214b9731723704c1eda17e",
      "cardUrl": "https://trello.com/c/w4MQPhBg",
      "sectionId": "69214b9731723704c1eda17e"
    },
  },
  long_handle: {
    id: "long_handle",
    name: "Long Handle",
    tier: 2,
    category: "Handle",
    type: "Long Handle",
    attackSpeed: 0.8,
    stats: {
      PhysicalDefense: 5,
    },
    damageScalings: {
      Physical: 0.4,
    },
    img: "",

    "perks": {},
    "potencies": {},
    "source": {
      "cardId": "69214b9731723704c1eda542",
      "cardUrl": "https://trello.com/c/gYDMLZtl",
      "sectionId": "69214b9731723704c1eda542"
    },
  },
  reinforced_handle: {
    id: "reinforced_handle",
    name: "Reinforced Handle",
    tier: 2,
    category: "Handle",
    type: "Medium Handle",
    attackSpeed: 1,
    stats: {
      PhysicalBoost: 5,
    },
    damageScalings: {
      Physical: 0.3,
      Dexterity: 0.3,
    },
    img: "",

    "perks": {},
    "potencies": {},
    "source": {
      "cardId": "69214b9731723704c1eda546",
      "cardUrl": "https://trello.com/c/xXLI6mET",
      "sectionId": "69214b9731723704c1eda546"
    },
  },
  agile_handle: {
    id: "agile_handle",
    name: "Agile Handle",
    tier: 2,
    category: "Handle",
    type: "Medium Handle",
    attackSpeed: 1.1,
    stats: {
      DexterityBoost: 5,
    },
    damageScalings: {
      Physical: 0.3,
      Dexterity: 0.3,
    },
    img: "",

    "perks": {},
    "potencies": {},
    "source": {
      "cardId": "69214b9731723704c1eda548",
      "cardUrl": "https://trello.com/c/1EDsK2LZ",
      "sectionId": "69214b9731723704c1eda548"
    },
  },
  magewood_handle: {
    id: "magewood_handle",
    name: "Magewood Handle",
    tier: 2,
    category: "Handle",
    type: "Medium Handle",
    attackSpeed: 1,
    stats: {
      MagicBoost: 5,
    },
    damageScalings: {
      Magic: 0.4,
    },
    img: "",

    "perks": {},
    "potencies": {},
    "source": {
      "cardId": "69214b9731723704c1eda544",
      "cardUrl": "https://trello.com/c/lhxZt8og",
      "sectionId": "69214b9731723704c1eda544"
    },
  },
  holywood_handle: {
    id: "holywood_handle",
    name: "Holywood Handle",
    tier: 2,
    category: "Handle",
    type: "Medium Handle",
    attackSpeed: 1,
    stats: {
      MagicBoost: 5,
      HolyBoost: 5,
    },
    damageScalings: {
      Magic: 0.3,
      Holy: 0.3,
    },
    img: "",

    "perks": {},
    "potencies": {},
    "source": {
      "cardId": "69214b9731723704c1eda23c",
      "cardUrl": "https://trello.com/c/FcAFWtc8",
      "sectionId": "69214b9731723704c1eda23c"
    },
  },
  cursewood_handle: {
    id: "cursewood_handle",
    name: "Cursewood Handle",
    tier: 2,
    category: "Handle",
    type: "Medium Handle",
    attackSpeed: 1,
    stats: {
      MagicBoost: 5,
      HexBoost: 5,
    },
    damageScalings: {
      Magic: 0.3,
      Hex: 0.3,
    },
    img: "",

    "perks": {},
    "potencies": {},
    "source": {
      "cardId": "69214b9731723704c1eda4ea",
      "cardUrl": "https://trello.com/c/xhwrdTi5",
      "sectionId": "69214b9731723704c1eda4ea"
    },
  },
  windiron_handle: {
    id: "windiron_handle",
    name: "Windiron Handle",
    tier: 2,
    category: "Handle",
    type: "Medium Handle",
    attackSpeed: 1.1,
    stats: {
      DexterityBoost: 5,
      AirBoost: 5,
    },
    damageScalings: {
      Dexterity: 0.3,
      Air: 0.3,
    },
    img: "",

    "perks": {},
    "potencies": {},
    "source": {
      "cardId": "69214b9731723704c1eda2a6",
      "cardUrl": "https://trello.com/c/rWyKbens",
      "sectionId": "69214b9731723704c1eda2a6"
    },
  },
  blazewood_handle: {
    id: "blazewood_handle",
    name: "Blazewood Handle",
    tier: 2,
    category: "Handle",
    type: "Medium Handle",
    attackSpeed: 1,
    stats: {
      MagicBoost: 5,
      FireBoost: 5,
    },
    damageScalings: {
      Magic: 0.3,
      Fire: 0.3,
    },
    img: "",

    "perks": {},
    "potencies": {},
    "source": {
      "cardId": "69214b9731723704c1eda2ec",
      "cardUrl": "https://trello.com/c/6Oe689qN",
      "sectionId": "69214b9731723704c1eda2ec"
    },
  },
  aquasteel_handle: {
    id: "aquasteel_handle",
    name: "Aquasteel Handle",
    tier: 2,
    category: "Handle",
    type: "Medium Handle",
    attackSpeed: 1.1,
    stats: {
      WaterBoost: 5,
      MagicBoost: 5,
    },
    damageScalings: {
      Magic: 0.3,
      Water: 0.3,
    },
    img: "",

    "perks": {},
    "potencies": {},
    "source": {
      "cardId": "69214b9731723704c1eda54a",
      "cardUrl": "https://trello.com/c/f5GXfh3p",
      "sectionId": "69214b9731723704c1eda54a"
    },
  },
  brass_handle: {
    id: "brass_handle",
    name: "Brass Handle",
    tier: 2,
    category: "Handle",
    type: "Medium Handle",
    attackSpeed: 0.85,
    stats: {
      EarthBoost: 5,
      PhysicalBoost: 5,
    },
    damageScalings: {
      Earth: 0.35,
      Physical: 0.35,
    },
    img: "",

    "perks": {},
    "potencies": {},
    "source": {
      "cardId": "69214b9731723704c1eda54c",
      "cardUrl": "https://trello.com/c/PBRkbRdP",
      "sectionId": "69214b9731723704c1eda54c"
    },
  },
  executioners_handle: {
    id: "executioners_handle",
    name: "Executioners Handle",
    tier: 3,
    category: "Handle",
    type: "Long Handle",
    attackSpeed: 0.8,
    stats: {
      PhysicalBoost: 8,
      PhysicalDefense: 5,
    },
    damageScalings: {
      Physical: 0.5,
    },
    damageTypes: {
      Physical: 0.1,
    },
    perks: {
      executioner: 1,
    },
    img: "",

    "potencies": {},
    "source": {
      "cardId": "69214b9731723704c1eda614",
      "cardUrl": "https://trello.com/c/noYUVk5V",
      "sectionId": "69214b9731723704c1eda614"
    },
  },
  reinforced_pole: {
    id: "reinforced_pole",
    name: "Reinforced Pole",
    tier: 3,
    category: "Handle",
    type: "Pole",
    attackSpeed: 1,
    stats: {
      PhysicalDefense: 4,
      PhysicalBoost: 4,
    },
    damageScalings: {
      Physical: 0.5,
    },
    perks: {
      reinforced_block: 1,
    },
    img: "",

    "potencies": {},
    "source": {
      "cardId": "69214b9731723704c1eda612",
      "cardUrl": "https://trello.com/c/ItNTIjqK",
      "sectionId": "69214b9731723704c1eda612"
    },
  },
  katana_handle: {
    id: "katana_handle",
    name: "Katana Handle",
    tier: 3,
    category: "Handle",
    type: "Long Handle",
    attackSpeed: 1.2,
    stats: {
      DexterityBoost: 5,
      PhysicalBoost: 5,
    },
    damageScalings: {
      Physical: 0.4,
      Dexterity: 0.4,
    },
    perks: {
      parry: 1,
      flash_strike: 1,
    },
    img: "",

    "potencies": {},
    "source": {
      "cardId": "69214b9731723704c1eda616",
      "cardUrl": "https://trello.com/c/8PDkFm0M",
      "sectionId": "69214b9731723704c1eda616"
    },
  },
  jagged_handle: {
    id: "jagged_handle",
    name: "Jagged Handle",
    tier: 3,
    category: "Handle",
    type: "Medium Handle",
    attackSpeed: 1,
    stats: {
      PhysicalBoost: 10,
    },
    damageScalings: {
      Physical: 0.5,
    },
    damageTypes: {
      Physical: 0.1,
    },
    perks: {
      serrated_edge: 1,
    },
    potencies: {
      bleedpotency: 4,
    },
    img: "",

    "source": {
      "cardId": "69214b9731723704c1eda618",
      "cardUrl": "https://trello.com/c/PBywizMV",
      "sectionId": "69214b9731723704c1eda618"
    },
  },
  noble_handle: {
    id: "noble_handle",
    name: "Noble Handle",
    tier: 3,
    category: "Handle",
    type: "Medium Handle",
    attackSpeed: 1.1,
    stats: {
      "DexterityBoost": 10,
      "SpeedBoost": 5
    },
    damageScalings: {
      Dexterity: 0.5,
    },
    perks: {
      vital_strikes: 1,
    },
    img: "",

    "potencies": {},
    "source": {
      "cardId": "69214b9731723704c1eda54e",
      "cardUrl": "https://trello.com/c/kUeqjOno",
      "sectionId": "69214b9731723704c1eda54e"
    },
  },
  graceful_handle: {
    id: "graceful_handle",
    name: "Graceful Handle",
    tier: 3,
    category: "Handle",
    type: "Medium Handle",
    attackSpeed: 1.2,
    stats: {
      DexterityBoost: 5,
      PhysicalBoost: 5,
    },
    damageScalings: {
      Physical: 0.4,
      Dexterity: 0.4,
    },
    perks: {
      sharp_crits: 1,
    },
    img: "",

    "potencies": {},
    "source": {
      "cardId": "69214b9731723704c1eda550",
      "cardUrl": "https://trello.com/c/riQ963ry",
      "sectionId": "69214b9731723704c1eda550"
    },
  },
  magewood_long_handle: {
    id: "magewood_long_handle",
    name: "Magewood Long Handle",
    tier: 3,
    category: "Handle",
    type: "Long Handle",
    attackSpeed: 0.9,
    stats: {
      MagicBoost: 7,
      PhysicalDefense: 5,
    },
    damageScalings: {
      Magic: 0.5,
    },
    perks: {
      magic_guard: 1,
    },
    img: "",

    "potencies": {},
    "source": {
      "cardId": "69214b9731723704c1eda61a",
      "cardUrl": "https://trello.com/c/6Sp9C7hk",
      "sectionId": "69214b9731723704c1eda61a"
    },
  },
  enchantwood_handle: {
    id: "enchantwood_handle",
    name: "Enchantwood Handle",
    tier: 3,
    category: "Handle",
    type: "Medium Handle",
    attackSpeed: 1,
    stats: {
      MagicBoost: 10,
    },
    damageScalings: {
      Magic: 0.5,
    },
    damageTypes: {
      Magic: 0.2,
    },
    perks: {
      royal_finisher: 1,
    },
    img: "",

    "potencies": {},
    "source": {
      "cardId": "69214b9731723704c1eda61c",
      "cardUrl": "https://trello.com/c/nrqY2ZvP",
      "sectionId": "69214b9731723704c1eda61c"
    },
  },
  gilded_pole: {
    id: "gilded_pole",
    name: "Gilded Pole",
    tier: 3,
    category: "Handle",
    type: "Pole",
    attackSpeed: 1,
    stats: {
      "SummonBoost": 5,
      "HolyBoost": 6,
      "DexterityBoost": 6
    },
    damageScalings: {
      Holy: 0.4,
      Dexterity: 0.4,
    },
    perks: {
      reinforced_block: 1,
    },
    img: "",

    "potencies": {},
    "source": {
      "cardId": "69214b9731723704c1eda648",
      "cardUrl": "https://trello.com/c/LZhc9EoG",
      "sectionId": "69214b9731723704c1eda648"
    },
  },
  purewood_handle: {
    id: "purewood_handle",
    name: "Purewood Handle",
    tier: 3,
    category: "Handle",
    type: "Medium Handle",
    attackSpeed: 1,
    stats: {
      HolyBoost: 10,
    },
    damageScalings: {
      Holy: 0.4,
      Magic: 0.4,
    },
    perks: {
      blessing: 2,
    },
    img: "",

    "potencies": {},
    "source": {
      "cardId": "69214b9731723704c1eda646",
      "cardUrl": "https://trello.com/c/n6dfX3eD",
      "sectionId": "69214b9731723704c1eda646"
    },
  },
  summoning_pole: {
    id: "summoning_pole",
    name: "Summoning Pole",
    tier: 3,
    category: "Handle",
    type: "Pole",
    attackSpeed: 1,
    stats: {
      "SummonBoost": 10,
      "PhysicalDefense": 4,
      "HexBoost": 8
    },
    damageScalings: {
      Hex: 0.35,
      Physical: 0.35,
      Summon: 0.1,
    },
    perks: {
      revel_in_death: 1,
    },
    img: "",

    "potencies": {},
    "source": {
      "cardId": "69214b9731723704c1eda66e",
      "cardUrl": "https://trello.com/c/NhmM3GLu",
      "sectionId": "69214b9731723704c1eda66e"
    },
  },
  hexsteel_handle: {
    id: "hexsteel_handle",
    name: "Hexsteel Handle",
    tier: 3,
    category: "Handle",
    type: "Medium Handle",
    attackSpeed: 1,
    stats: {
      MagicBoost: 5,
      HexBoost: 10,
    },
    damageScalings: {
      Magic: 0.4,
      Hex: 0.4,
    },
    damageTypes: {
      Hex: 0.1,
    },
    perks: {
      weakening: 2,
    },
    img: "",

    "potencies": {},
    "source": {
      "cardId": "69214b9731723704c1eda66c",
      "cardUrl": "https://trello.com/c/M4vJanYc",
      "sectionId": "69214b9731723704c1eda66c"
    },
  },
  refined_windiron_handle: {
    id: "refined_windiron_handle",
    name: "Refined Windiron Handle",
    tier: 3,
    category: "Handle",
    type: "Medium Handle",
    attackSpeed: 1.1,
    stats: {
      "DexterityBoost": 7,
      "SpeedBoost": 5,
      "AirBoost": 7
    },
    damageScalings: {
      Air: 0.4,
      Dexterity: 0.4,
    },
    perks: {
      tailwind: 2,
    },
    img: "",

    "potencies": {},
    "source": {
      "cardId": "69214b9731723704c1eda4ce",
      "cardUrl": "https://trello.com/c/i6DBVTZJ",
      "sectionId": "69214b9731723704c1eda4ce"
    },
  },
  stormwood_handle: {
    id: "stormwood_handle",
    name: "Stormwood Handle",
    tier: 3,
    category: "Handle",
    type: "Long Handle",
    attackSpeed: 1.1,
    stats: {
      "MagicBoost": 4,
      "DexterityBoost": 4,
      "AirBoost": 4
    },
    damageScalings: {
      Air: 0.35,
      Magic: 0.35,
      Dexterity: 0.35,
    },
    perks: {
      parry: 1,
      stormcaller: 1,
    },
    img: "",

    "potencies": {},
    "source": {
      "cardId": "69214b9731723704c1eda4d0",
      "cardUrl": "https://trello.com/c/hhAeWa88",
      "sectionId": "69214b9731723704c1eda4d0"
    },
  },
  kindlewood_handle: {
    id: "kindlewood_handle",
    name: "Kindlewood Handle",
    tier: 3,
    category: "Handle",
    type: "Medium Handle",
    attackSpeed: 1,
    stats: {
      DexterityBoost: 5,
      FireBoost: 5,
    },
    damageScalings: {
      Fire: 0.4,
      Dexterity: 0.4,
    },
    perks: {
      kindling: 1,
    },
    img: "",

    "potencies": {},
    "source": {
      "cardId": "69214b9731723704c1eda634",
      "cardUrl": "https://trello.com/c/u1nRDndZ",
      "sectionId": "69214b9731723704c1eda634"
    },
  },
  cragflame_handle: {
    id: "cragflame_handle",
    name: "Cragflame Handle",
    tier: 3,
    category: "Handle",
    type: "Long Handle",
    attackSpeed: 0.9,
    stats: {
      MagicBoost: 5,
      FireBoost: 5,
      PhysicalDefense: 5,
    },
    damageScalings: {
      Fire: 0.4,
      Magic: 0.4,
    },
    perks: {
      ignition: 2,
    },
    img: "",

    "potencies": {},
    "source": {
      "cardId": "69214b9731723704c1eda632",
      "cardUrl": "https://trello.com/c/thpWn3Ge",
      "sectionId": "69214b9731723704c1eda632"
    },
  },
  sunkenwood_handle: {
    id: "sunkenwood_handle",
    name: "Sunkenwood Handle",
    tier: 3,
    category: "Handle",
    type: "Medium Handle",
    attackSpeed: 1.1,
    stats: {
      MagicBoost: 5,
      WaterBoost: 10,
    },
    damageScalings: {
      Water: 0.4,
      Magic: 0.4,
    },
    perks: {
      extinguish: 2,
    },
    img: "",

    "potencies": {},
    "source": {
      "cardId": "69214b9731723704c1eda67c",
      "cardUrl": "https://trello.com/c/MQL1lbU0",
      "sectionId": "69214b9731723704c1eda67c"
    },
  },
  frozen_handle: {
    id: "frozen_handle",
    name: "Frozen Handle",
    tier: 3,
    category: "Handle",
    type: "Medium Handle",
    attackSpeed: 1,
    stats: {
      HeatResistance: 50,
      WaterBoost: 7,
      PhysicalBoost: 7,
    },
    damageScalings: {
      Water: 0.4,
      Physical: 0.4,
    },
    perks: {
      frostbite: 1,
    },
    img: "",

    "potencies": {},
    "source": {
      "cardId": "69214b9731723704c1eda67a",
      "cardUrl": "https://trello.com/c/7sIVSi2C",
      "sectionId": "69214b9731723704c1eda67a"
    },
  },
  enchanted_stone_handle: {
    id: "enchanted_stone_handle",
    name: "Enchanted Stone Handle",
    tier: 3,
    category: "Handle",
    type: "Medium Handle",
    attackSpeed: 0.9,
    stats: {
      EarthBoost: 5,
      MagicBoost: 5,
    },
    damageScalings: {
      Earth: 0.4,
      Magic: 0.4,
    },
    perks: {
      gravity_well: 1,
    },
    img: "",

    "potencies": {},
    "source": {
      "cardId": "69214b9731723704c1eda67e",
      "cardUrl": "https://trello.com/c/oNreCsak",
      "sectionId": "69214b9731723704c1eda67e"
    },
  },
  bedrock_handle: {
    id: "bedrock_handle",
    name: "Bedrock Handle",
    tier: 3,
    category: "Handle",
    type: "Long Handle",
    attackSpeed: 0.8,
    stats: {
      PhysicalDefense: 5,
      EarthBoost: 5,
      PhysicalBoost: 5,
    },
    damageScalings: {
      Earth: 0.45,
      Physical: 0.45,
    },
    perks: {
      quake: 2,
    },
    img: "",

    "potencies": {},
    "source": {
      "cardId": "69214b9731723704c1eda680",
      "cardUrl": "https://trello.com/c/a2kP1wxp",
      "sectionId": "69214b9731723704c1eda680"
    },
  },
  scourgers_Handle: {
    id: "scourgers_Handle",
    name: "Scourgers Handle",
    tier: 4,
    category: "Handle",
    type: "Long Handle",
    attackSpeed: 0.8,
    stats: {
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
    img: "../image/handles/scourgers_handle.png",

    "potencies": {},
    "source": {
      "cardId": "69214b9731723704c1eda664",
      "cardUrl": "https://trello.com/c/4On9pazZ",
      "sectionId": "69214b9731723704c1eda664"
    },
  },
  zweihander_handle: {
    id: "zweihander_handle",
    name: "Zweihander Handle",
    tier: 4,
    category: "Handle",
    type: "Long Handle",
    attackSpeed: 1,
    stats: {
      "PhysicalBoost": 10,
      "PhysicalDefense": 3,
      "SpeedBoost": 2,
      "Protection": 5
    },
    damageScalings: {
      Physical: 0.55,
      Dexterity: 0.55,
    },
    perks: {
      highlander: 1,
    },
    img: "../image/handles/zweihander_handle.png",

    "potencies": {},
    "source": {
      "cardId": "69214b9731723704c1eda666",
      "cardUrl": "https://trello.com/c/GEkijmgs",
      "sectionId": "69214b9731723704c1eda666"
    },
  },
  reinforced_gilded_pole: {
    id: "reinforced_gilded_pole",
    name: "Reinforced Gilded Pole",
    tier: 4,
    category: "Handle",
    type: "Pole",
    attackSpeed: 0.8,
    stats: {
      Tenacity: 0.2,
      PhysicalDefense: 10,
      PhysicalBoost: 4,
    },
    damageScalings: {
      Physical: 0.8,
    },
    perks: {
      reinforced_block: 2,
      aggressive_personality: 1,
    },
    img: "",

    "potencies": {},
    "source": {
      "cardId": "69214b9731723704c1eda608",
      "cardUrl": "https://trello.com/c/14yTVmvj",
      "sectionId": "69214b9731723704c1eda608"
    },
  },
  spike_pole: {
    id: "spike_pole",
    name: "Spike Pole",
    tier: 4,
    category: "Handle",
    type: "Pole",
    attackSpeed: 1.1,
    stats: {
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
    potencies: {
      bleedpotency: 3,
    },
    img: "../image/handles/spike_pole.png",

    "source": {
      "cardId": "69214b9731723704c1eda670",
      "cardUrl": "https://trello.com/c/40478f5O",
      "sectionId": "69214b9731723704c1eda670"
    },
  },
  serrated_handle: {
    id: "serrated_handle",
    name: "Serrated Handle",
    tier: 4,
    category: "Handle",
    type: "Long Handle",
    attackSpeed: 0.9,
    stats: {
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
    potencies: {
      bleedpotency: 3,
    },
    img: "../image/handles/serrated_handle.png",

    "source": {
      "cardId": "69214b9731723704c1eda68a",
      "cardUrl": "https://trello.com/c/nYkqG4d3",
      "sectionId": "69214b9731723704c1eda68a"
    },
  },
  bloodied_guard: {
    id: "bloodied_guard",
    name: "Bloodied Guard",
    tier: 4,
    category: "Handle",
    type: "Medium Handle",
    attackSpeed: 1.1,
    stats: {
      PhysicalBoost: 5,
      DexterityBoost: 5,
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
    potencies: {
      bleedpotency: 3,
    },
    img: "../image/handles/bloodied_guard.png",

    "source": {
      "cardId": "69214b9731723704c1eda688",
      "cardUrl": "https://trello.com/c/DZPopTo2",
      "sectionId": "69214b9731723704c1eda688"
    },
  },
  bejeweled_handle: {
    id: "bejeweled_handle",
    name: "Bejeweled Handle",
    tier: 4,
    category: "Handle",
    type: "Long Handle",
    attackSpeed: 1.2,
    stats: {
      DexterityBoost: 15,
      PhysicalBoost: 5,
    },
    damageScalings: {
      Dexterity: 0.55,
      Physical: 0.55,
    },
    perks: {
      royal_parry: 1,
      parry: 1,
    },
    img: "",

    "potencies": {},
    "source": {
      "cardId": "69214b9731723704c1eda686",
      "cardUrl": "https://trello.com/c/lhUexpxw",
      "sectionId": "69214b9731723704c1eda686"
    },
  },
  shadow_handle: {
    id: "shadow_handle",
    name: "Shadow Handle",
    tier: 4,
    category: "Handle",
    type: "Medium Handle",
    attackSpeed: 1.1,
    stats: {
      PhysicalBoost: 13,
      DexterityBoost: 10,
    },
    damageScalings: {
      Physical: 0.55,
      Dexterity: 0.55,
    },
    damageTypes: {
      Physical: 0.1,
    },
    perks: {
      dual_wielding: 1,
      phantom_pain: 1,
    },
    img: "",

    "potencies": {},
    "source": {
      "cardId": "69214b9731723704c1eda61e",
      "cardUrl": "https://trello.com/c/jIJehNhx",
      "sectionId": "69214b9731723704c1eda61e"
    },
  },
  kings_handle: {
    id: "kings_handle",
    name: "Kings Handle",
    tier: 4,
    category: "Handle",
    type: "Medium Handle",
    attackSpeed: 1.1,
    stats: {
      "DexterityBoost": 15,
      "SpeedBoost": 5
    },
    damageScalings: {
      Dexterity: 0.7,
    },
    perks: {
      golden_crits: 1,
    },
    img: "",

    "potencies": {},
    "source": {
      "cardId": "69214b9731723704c1eda684",
      "cardUrl": "https://trello.com/c/V0XTxXAu",
      "sectionId": "69214b9731723704c1eda684"
    },
  },
  beastial_handle: {
    id: "beastial_handle",
    name: "Beastial Handle",
    tier: 4,
    category: "Handle",
    type: "Medium Handle",
    attackSpeed: 1,
    stats: {
      "DexterityBoost": 10,
      "JumpBoost": 2,
      "SpeedBoost": 7
    },
    damageScalings: {
      Dexterity: 0.55,
      Physical: 0.55,
    },
    damageTypes: {
      Physical: 0.1,
    },
    perks: {
      beastial_rage: 1,
    },
    img: "../image/handles/beastial_handle.png",

    "potencies": {},
    "source": {
      "cardId": "69214b9731723704c1eda682",
      "cardUrl": "https://trello.com/c/lxkPd6Av",
      "sectionId": "69214b9731723704c1eda682"
    },
  },
  duelists_handle: {
    id: "duelists_handle",
    name: "Duelists Handle",
    tier: 4,
    category: "Handle",
    type: "Medium Handle",
    attackSpeed: 1,
    stats: {
      "DexterityBoost": 15,
      "SpeedBoost": 5
    },
    damageScalings: {
      Dexterity: 0.7,
    },
    perks: {
      duelist_stance: 1,
      piercer: 1,
    },
    img: "",

    "potencies": {},
    "source": {
      "cardId": "69214b9731723704c1eda636",
      "cardUrl": "https://trello.com/c/RE5Kqmn8",
      "sectionId": "69214b9731723704c1eda636"
    },
  },
  sturdy_handle: {
    id: "sturdy_handle",
    name: "Sturdy Handle",
    tier: 4,
    category: "Handle",
    type: "Medium Handle",
    attackSpeed: 1.1,
    stats: {
      PhysicalBoost: 10,
      DexterityBoost: 10,
    },
    damageScalings: {
      Physical: 0.55,
      Dexterity: 0.55,
    },
    perks: {
      dual_wielding: 1,
      savage_combo: 1,
    },
    img: "",

    "potencies": {},
    "source": {
      "cardId": "69214b9731723704c1eda638",
      "cardUrl": "https://trello.com/c/sYKzHJzn",
      "sectionId": "69214b9731723704c1eda638"
    },
  },
  grandmagic_long_handle: {
    id: "grandmagic_long_handle",
    name: "Grandmagic Long Handle",
    tier: 4,
    category: "Handle",
    type: "Long Handle",
    attackSpeed: 0.9,
    stats: {
      MagicBoost: 10,
      PhysicalDefense: 5,
      Warding: 20,
    },
    damageScalings: {
      Magic: 0.7,
    },
    perks: {
      grandmagic_guard: 1,
    },
    img: "",

    "potencies": {},
    "source": {
      "cardId": "69214b9731723704c1eda6a8",
      "cardUrl": "https://trello.com/c/gstKo3RU",
      "sectionId": "69214b9731723704c1eda6a8"
    },
  },
  reinforced_magewood_pole: {
    id: "reinforced_magewood_pole",
    name: "Reinforced Magewood Pole",
    tier: 4,
    category: "Handle",
    type: "Pole",
    attackSpeed: 1.1,
    stats: {
      "MagicBoost": 15,
      "SpeedBoost": 2
    },
    damageScalings: {
      Magic: 0.7,
    },
    damageTypes: {
      Magic: 0.1,
    },
    perks: {
      reinforced_block: 1,
      glyph_conduit: 1,
    },
    img: "",

    "potencies": {},
    "source": {
      "cardId": "69214b9731723704c1eda6aa",
      "cardUrl": "https://trello.com/c/QjiyOdeO",
      "sectionId": "69214b9731723704c1eda6aa"
    },
  },
  spellbinderguard: {
    id: "spellbinderguard",
    name: "Spellbinder Guard",
    tier: 4,
    category: "Handle",
    type: "Medium Handle",
    attackSpeed: 1,
    stats: {
      MagicBoost: 15,
      DexterityBoost: 5,
    },
    damageScalings: {
      Magic: 0.55,
      Dexterity: 0.55,
    },
    damageTypes: {
      Magic: 0.2,
    },
    perks: {
      spell_piercer: 1,
      duelist_stance: 1,
    },
    img: "",

    "potencies": {},
    "source": {
      "cardId": "69214b9731723704c1eda6ae",
      "cardUrl": "https://trello.com/c/P4ooTvci",
      "sectionId": "69214b9731723704c1eda6ae"
    },
  },
  crude_magic_handle: {
    id: "crude_magic_handle",
    name: "Crude Magic Handle",
    tier: 4,
    category: "Handle",
    type: "Medium Handle",
    attackSpeed: 1,
    stats: {
      MagicBoost: 20,
    },
    damageScalings: {
      Magic: 0.7,
    },
    perks: {
      dual_wielding: 1,
      runic_blades: 1,
    },
    img: "",

    "potencies": {},
    "source": {
      "cardId": "69214b9731723704c1eda6ac",
      "cardUrl": "https://trello.com/c/7GfkbxRo",
      "sectionId": "69214b9731723704c1eda6ac"
    },
  },
  blessed_pole: {
    id: "blessed_pole",
    name: "Blessed Pole",
    tier: 4,
    category: "Handle",
    type: "Pole",
    attackSpeed: 1,
    stats: {
      HolyBoost: 15,
      DexterityBoost: 10,
    },
    damageScalings: {
      Holy: 0.55,
      Dexterity: 0.55,
    },
    perks: {
      radiance: 1,
      divinity: 1,
    },
    img: "",

    "potencies": {},
    "source": {
      "cardId": "69214b9731723704c1eda6b0",
      "cardUrl": "https://trello.com/c/Ww4zdfwT",
      "sectionId": "69214b9731723704c1eda6b0"
    },
  },
  sacred_pole: {
    id: "sacred_pole",
    name: "Sacred Pole",
    tier: 4,
    category: "Handle",
    type: "Pole",
    attackSpeed: 1,
    stats: {
      "SummonBoost": 10,
      "HolyBoost": 10,
      "Warding": 20
    },
    damageScalings: {
      Holy: 0.5,
      Physical: 0.5,
      Summon: 0.2,
    },
    perks: {
      reinforced_block: 1,
      divine_intervention: 1,
    },
    img: "",

    "potencies": {},
    "source": {
      "cardId": "69214b9731723704c1eda6b2",
      "cardUrl": "https://trello.com/c/iLbeo6B0",
      "sectionId": "69214b9731723704c1eda6b2"
    },
  },
  hallowedwood_handle: {
    id: "hallowedwood_handle",
    name: "Hallowedwood Handle",
    tier: 4,
    category: "Handle",
    type: "Long Handle",
    attackSpeed: 1,
    stats: {
      HolyBoost: 10,
      Warding: 20,
    },
    damageScalings: {
      Holy: 0.7,
    },
    perks: {
      blessing: 1,
      light_bearer: 1,
    },
    img: "",

    "potencies": {},
    "source": {
      "cardId": "69214b9731723704c1eda64a",
      "cardUrl": "https://trello.com/c/si3I9X6x",
      "sectionId": "69214b9731723704c1eda64a"
    },
  },
  angelwood_handle: {
    id: "angelwood_handle",
    name: "Angelwood Handle",
    tier: 4,
    category: "Handle",
    type: "Medium Handle",
    attackSpeed: 1,
    stats: {
      HolyBoost: 15,
      MagicBoost: 10,
    },
    damageScalings: {
      Holy: 0.55,
      Magic: 0.55,
    },
    perks: {
      sacred_grounds: 1,
    },
    img: "",

    "potencies": {},
    "source": {
      "cardId": "69214b9731723704c1eda64c",
      "cardUrl": "https://trello.com/c/yqj2hnA8",
      "sectionId": "69214b9731723704c1eda64c"
    },
  },
  skull_summoners_pole: {
    id: "skull_summoners_pole",
    name: "Skull Summoners Pole",
    tier: 4,
    category: "Handle",
    type: "Pole",
    attackSpeed: 1,
    stats: {
      "HexBoost": 10,
      "PhysicalDefense": 4,
      "SummonBoost": 15
    },
    damageScalings: {
      Hex: 0.5,
      Physical: 0.5,
      Summon: 0.2,
    },
    perks: {
      trusty_servant: 1,
      reinforced_block: 1,
    },
    img: "",

    "potencies": {},
    "source": {
      "cardId": "69214b9731723704c1eda68e",
      "cardUrl": "https://trello.com/c/ukrG76xR",
      "sectionId": "69214b9731723704c1eda68e"
    },
  },
  necrotic_handle: {
    id: "necrotic_handle",
    name: "Necrotic Handle",
    tier: 4,
    category: "Handle",
    type: "Medium Handle",
    attackSpeed: 1,
    stats: {
      "HexBoost": 10,
      "SummonBoost": 12
    },
    damageScalings: {
      Hex: 0.5,
      Magic: 0.5,
      Summon: 0.2,
    },
    perks: {
      possession: 1,
    },
    img: "",

    "potencies": {},
    "source": {
      "cardId": "69214b9731723704c1eda68c",
      "cardUrl": "https://trello.com/c/lXzPeo9K",
      "sectionId": "69214b9731723704c1eda68c"
    },
  },
  cursed_handle: {
    id: "cursed_handle",
    name: "Cursed Handle",
    tier: 4,
    category: "Handle",
    type: "Long Handle",
    attackSpeed: 0.9,
    stats: {
      HexBoost: 15,
      MagicDefense: 5,
    },
    damageScalings: {
      Hex: 0.7,
    },
    damageTypes: {
      Hex: 0.1,
    },
    perks: {
      weakening: 1,
      endless_despair: 1,
    },
    img: "",

    "potencies": {},
    "source": {
      "cardId": "69214b9731723704c1eda692",
      "cardUrl": "https://trello.com/c/Z4zjFsat",
      "sectionId": "69214b9731723704c1eda692"
    },
  },
  cursesteel_handle: {
    id: "cursesteel_handle",
    name: "Cursesteel Handle",
    tier: 4,
    category: "Handle",
    type: "Medium Handle",
    attackSpeed: 1.1,
    stats: {
      HexBoost: 10,
      DexterityBoost: 10,
    },
    damageScalings: {
      Hex: 0.55,
      Dexterity: 0.55,
    },
    perks: {
      weakening: 1,
      curse_rip: 1,
    },
    img: "",

    "potencies": {},
    "source": {
      "cardId": "69214b9731723704c1eda690",
      "cardUrl": "https://trello.com/c/hDVjnMiz",
      "sectionId": "69214b9731723704c1eda690"
    },
  },
  gustiron_handle: {
    id: "gustiron_handle",
    name: "Gustiron Handle",
    tier: 4,
    category: "Handle",
    type: "Medium Handle",
    attackSpeed: 1.1,
    stats: {
      "AirBoost": 7,
      "DexterityBoost": 7,
      "SpeedBoost": 5
    },
    damageScalings: {
      Air: 0.55,
      Dexterity: 0.55,
    },
    perks: {
      whirlwind: 1,
      tailwind: 1,
    },
    img: "",

    "potencies": {},
    "source": {
      "cardId": "69214b9731723704c1eda6b4",
      "cardUrl": "https://trello.com/c/7Wef5X5o",
      "sectionId": "69214b9731723704c1eda6b4"
    },
  },
  gilded_windiron_guard: {
    id: "gilded_windiron_guard",
    name: "Gilded Windiron Guard",
    tier: 4,
    category: "Handle",
    type: "Medium Handle",
    attackSpeed: 1.1,
    stats: {
      "AirBoost": 10,
      "DexterityBoost": 15
    },
    damageScalings: {
      Air: 0.55,
      Dexterity: 0.55,
    },
    perks: {
      duelist_stance: 1,
      gale_bursts: 1,
      tailwind: 1,
    },
    img: "",

    "potencies": {},
    "source": {
      "cardId": "69214b9731723704c1eda6b8",
      "cardUrl": "https://trello.com/c/Zw4uV73N",
      "sectionId": "69214b9731723704c1eda6b8"
    },
  },
  lightningstruck_pole: {
    id: "lightningstruck_pole",
    name: "Lightningstruck Pole",
    tier: 4,
    category: "Handle",
    type: "Pole",
    attackSpeed: 1.1,
    stats: {
      "MagicBoost": 8,
      "DexterityBoost": 12,
      "AirBoost": 8
    },
    damageScalings: {
      Air: 0.45,
      Magic: 0.45,
      Dexterity: 0.45,
    },
    perks: {
      storm_rend: 1,
    },
    img: "",

    "potencies": {},
    "source": {
      "cardId": "69214b9731723704c1eda6b6",
      "cardUrl": "https://trello.com/c/jBF4idL4",
      "sectionId": "69214b9731723704c1eda6b6"
    },
  },
  thunderwood_handle: {
    id: "thunderwood_handle",
    name: "Thunderwood Handle",
    tier: 4,
    category: "Handle",
    type: "Long Handle",
    attackSpeed: 1.1,
    stats: {
      "MagicBoost": 6,
      "PhysicalDefense": 5,
      "AirBoost": 6
    },
    damageScalings: {
      Air: 0.55,
      Magic: 0.55,
    },
    perks: {
      static_buildup: 1,
    },
    img: "",

    "potencies": {},
    "source": {
      "cardId": "69214b9731723704c1eda6ba",
      "cardUrl": "https://trello.com/c/6Ivzf2LJ",
      "sectionId": "69214b9731723704c1eda6ba"
    },
  },
  steel_flame_handle: {
    id: "steel_flame_handle",
    name: "Steel Flame Handle",
    tier: 4,
    category: "Handle",
    type: "Medium Handle",
    attackSpeed: 1.1,
    stats: {
      DexterityBoost: 10,
      FireBoost: 10,
    },
    damageScalings: {
      Dexterity: 0.55,
      Fire: 0.55,
    },
    perks: {
      spark: 1,
    },
    img: "",

    "potencies": {},
    "source": {
      "cardId": "69214b9731723704c1eda6be",
      "cardUrl": "https://trello.com/c/VCGUR3TJ",
      "sectionId": "69214b9731723704c1eda6be"
    },
  },
  dragonwood_pole: {
    id: "dragonwood_pole",
    name: "Dragonwood Pole",
    tier: 4,
    category: "Handle",
    type: "Pole",
    attackSpeed: 1,
    stats: {
      DexterityBoost: 8,
      FireBoost: 12,
    },
    damageScalings: {
      Dexterity: 0.55,
      Fire: 0.55,
    },
    perks: {
      dragon_breath: 1,
    },
    potencies: {
      burnpotency: 2,
    },
    img: "",

    "source": {
      "cardId": "69214b9731723704c1eda6bc",
      "cardUrl": "https://trello.com/c/xfw6k39N",
      "sectionId": "69214b9731723704c1eda6bc"
    },
  },
  exhaust_handle: {
    id: "exhaust_handle",
    name: "Exhaust Handle",
    tier: 4,
    category: "Handle",
    type: "Long Handle",
    attackSpeed: 1,
    stats: {
      PhysicalDefense: 5,
      FireBoost: 10,
    },
    damageScalings: {
      Fire: 0.7,
    },
    perks: {
      exhaust: 1,
    },
    potencies: {
      burnpotency: 3,
    },
    img: "",

    "source": {
      "cardId": "69214b9731723704c1eda6c0",
      "cardUrl": "https://trello.com/c/6rmTU6ux",
      "sectionId": "69214b9731723704c1eda6c0"
    },
  },
  cragstone_pole: {
    id: "cragstone_pole",
    name: "Cragstone Pole",
    tier: 4,
    category: "Handle",
    type: "Pole",
    attackSpeed: 1,
    stats: {
      EarthBoost: 5,
      FireBoost: 5,
      PhysicalDefense: 5,
    },
    damageScalings: {
      Fire: 0.55,
      Earth: 0.55,
    },
    damageTypes: {
      Fire: 0.1,
    },
    perks: {
      tectonic_heat: 1,
    },
    img: "",

    "potencies": {},
    "source": {
      "cardId": "69214b9731723704c1eda6c2",
      "cardUrl": "https://trello.com/c/VfXvRTDj",
      "sectionId": "69214b9731723704c1eda6c2"
    },
  },
  wave_great_handle: {
    id: "wave_great_handle",
    name: "Wave Great Handle",
    tier: 4,
    category: "Handle",
    type: "Long Handle",
    attackSpeed: 1.2,
    stats: {
      MagicDefense: 5,
      PhysicalDefense: -5,
      WaterBoost: 10,
    },
    damageScalings: {
      Water: 0.7,
    },
    perks: {
      wave_rider: 1,
      extinguish: 1,
    },
    img: "",

    "potencies": {},
    "source": {
      "cardId": "69214b9731723704c1eda6c8",
      "cardUrl": "https://trello.com/c/2OU8sZED",
      "sectionId": "69214b9731723704c1eda6c8"
    },
  },
  ornate_pole: {
    id: "ornate_pole",
    name: "Ornate Pole",
    tier: 4,
    category: "Handle",
    type: "Pole",
    attackSpeed: 1.2,
    stats: {
      PhysicalDefense: 5,
      HolyBoost: 2.5,
      WaterBoost: 7.5,
    },
    damageScalings: {
      Water: 0.55,
      Holy: 0.55,
    },
    perks: {
      holy_tides: 1,
      reinforced_block: 1,
    },
    img: "",

    "potencies": {},
    "source": {
      "cardId": "69214b9731723704c1eda6ca",
      "cardUrl": "https://trello.com/c/5Em8C9P0",
      "sectionId": "69214b9731723704c1eda6ca"
    },
  },
  frozen_guard: {
    id: "frozen_guard",
    name: "Frozen Guard",
    tier: 4,
    category: "Handle",
    type: "Medium Handle",
    attackSpeed: 1.1,
    stats: {
      WaterBoost: 10,
      HeatResistance: 50,
      DexterityBoost: 10,
    },
    damageScalings: {
      Water: 0.55,
      Dexterity: 0.55,
    },
    perks: {
      frostbite: 1,
      duelist_stance: 1,
      gelid_lance: 1,
    },
    potencies: {
      bleedpotency: 3,
    },
    img: "",

    "source": {
      "cardId": "69214b9731723704c1eda6c4",
      "cardUrl": "https://trello.com/c/8NriKWdz",
      "sectionId": "69214b9731723704c1eda6c4"
    },
  },
  sculpted_handle: {
    id: "sculpted_handle",
    name: "Sculpted Handle",
    tier: 4,
    category: "Handle",
    type: "Medium Handle",
    attackSpeed: 1,
    stats: {
      HeatResistance: 50,
      WaterBoost: 8.5,
      PhysicalBoost: 8.5,
    },
    damageScalings: {
      Water: 0.55,
      Physical: 0.55,
    },
    perks: {
      frozen_waste: 1,
      frostbite: 1,
    },
    img: "",

    "potencies": {},
    "source": {
      "cardId": "69214b9731723704c1eda6c6",
      "cardUrl": "https://trello.com/c/r5P51Dk9",
      "sectionId": "69214b9731723704c1eda6c6"
    },
  },
  gravitational_handle: {
    id: "gravitational_handle",
    name: "Gravitational Handle",
    tier: 4,
    category: "Handle",
    type: "Long Handle",
    attackSpeed: 1,
    stats: {
      MagicBoost: 5,
      PhysicalDefense: 5,
      EarthBoost: 10,
    },
    damageScalings: {
      Magic: 0.55,
      Earth: 0.55,
    },
    perks: {
      gravitational_enforcer: 1,
    },
    img: "",

    "potencies": {},
    "source": {
      "cardId": "69214b9731723704c1eda6cc",
      "cardUrl": "https://trello.com/c/PkwxIawO",
      "sectionId": "69214b9731723704c1eda6cc"
    },
  },
  gravitational_pole: {
    id: "gravitational_pole",
    name: "Gravitational Pole",
    tier: 4,
    category: "Handle",
    type: "Pole",
    attackSpeed: 1,
    stats: {
      MagicBoost: 15,
      EarthBoost: 10,
    },
    damageScalings: {
      Magic: 0.55,
      Earth: 0.55,
    },
    perks: {
      gravity_well: 2,
    },
    img: "",

    "potencies": {},
    "source": {
      "cardId": "69214b9731723704c1eda6ce",
      "cardUrl": "https://trello.com/c/6XgRUVEx",
      "sectionId": "69214b9731723704c1eda6ce"
    },
  },
  earth_spirit_handle: {
    id: "earth_spirit_handle",
    name: "Earth Spirit Handle",
    tier: 4,
    category: "Handle",
    type: "Long Handle",
    attackSpeed: 0.8,
    stats: {
      Tenacity: 0.1,
      PhysicalDefense: 5,
      EarthBoost: 10,
      PhysicalBoost: 5,
    },
    damageScalings: {
      Earth: 0.55,
      Physical: 0.55,
    },
    perks: {
      stoneskin: 1,
    },
    img: "",

    "potencies": {},
    "source": {
      "cardId": "69214b9731723704c1eda6d0",
      "cardUrl": "https://trello.com/c/a3Us2gu4",
      "sectionId": "69214b9731723704c1eda6d0"
    },
  },
  sandstone_handle: {
    id: "sandstone_handle",
    name: "Sandstone Handle",
    tier: 4,
    category: "Handle",
    type: "Pole",
    attackSpeed: 1.1,
    stats: {
      "AirBoost": 8,
      "EarthBoost": 8
    },
    damageScalings: {
      Air: 0.55,
      Earth: 0.55,
    },
    perks: {
      quicksand: 1,
    },
    img: "",

    "potencies": {},
    "source": {
      "cardId": "69214b9731723704c1eda6d2",
      "cardUrl": "https://trello.com/c/lieUGmP6",
      "sectionId": "69214b9731723704c1eda6d2"
    },
  },
  prism_handle: {
    id: "prism_handle",
    name: "Prism Handle",
    tier: 5,
    category: "Handle",
    type: "Medium Handle",
    attackSpeed: 1.1,
    damageScalings: {
      Physical: 0.15,
      Magic: 0.15,
    },
    img: "",

    "stats": {},
    "perks": {},
    "potencies": {},
    "source": {
      "cardId": "69214b9731723704c1eda63e",
      "cardUrl": "https://trello.com/c/UggGlXst",
      "sectionId": "69214b9731723704c1eda63e"
    },
  },
  starlight_handle: {
    id: "starlight_handle",
    name: "Starlight Handle",
    tier: 5,
    category: "Handle",
    type: "Long Handle",
    attackSpeed: 1,
    stats: {
      "HolyBoost": 5,
      "HexBoost": 5,
      "MagicBoost": 5,
      "FireBoost": 5,
      "WaterBoost": 5,
      "AirBoost": 5
    },
    damageScalings: {
      Holy: 0.4,
      Hex: 0.4,
      Magic: 0.4,
      Fire: 0.4,
      Water: 0.4,
      Air: 0.4,
    },
    perks: {
      star_struck: 1,
    },
    img: "",

    "potencies": {},
    "source": {
      "cardId": "69214b9731723704c1eda644",
      "cardUrl": "https://trello.com/c/aQI8BiAL",
      "sectionId": "69214b9731723704c1eda644"
    },
  },
  bloodengine_handle: {
    id: "bloodengine_handle",
    name: "Bloodengine Handle",
    tier: 5,
    category: "Handle",
    type: "Long Handle",
    attackSpeed: 1,
    stats: {
      "SpeedBoost": 5,
      "PhysicalBoost": 5
    },
    damageScalings: {
      Physical: 0.7,
    },
    perks: {
      saw_stance: 1,
    },
    potencies: {
      bleedpotency: 3,
    },
    img: "",

    "source": {
      "cardId": "69214b9831723704c1edac4c",
      "cardUrl": "https://trello.com/c/tfSOvTEN",
      "sectionId": "69214b9831723704c1edac4c"
    },
  },
  enchained_handle: {
    id: "enchained_handle",
    name: "Enchained Handle",
    tier: 5,
    category: "Handle",
    type: "Medium Handle",
    attackSpeed: 0.9,
    stats: {
      PhysicalBoost: 5,
      DexterityBoost: 5,
    },
    damageScalings: {
      Dexterity: 0.33,
      Physical: 0.33,
    },
    perks: {
      weight_distribution: 1,
    },
    img: "",

    "potencies": {},
    "source": {
      "cardId": "69214b9731723704c1eda668",
      "cardUrl": "https://trello.com/c/tU5IairI",
      "sectionId": "69214b9731723704c1eda668"
    },
  },
  murkwater_handle: {
    id: "murkwater_handle",
    name: "Murkwater Handle",
    tier: 5,
    category: "Handle",
    type: "Medium Handle",
    attackSpeed: 0.9,
    stats: {
      HexBoost: 4,
      EarthBoost: 4,
      WaterBoost: 4,
    },
    damageScalings: {
      Earth: 0.35,
      Water: 0.35,
      Hex: 0.35,
    },
    perks: {
      pure_rot: 1,
    },
    potencies: {
      poisonpotency: 2,
    },
    img: "",

    "source": {
      "cardId": "69214b9731723704c1eda6dc",
      "cardUrl": "https://trello.com/c/haEhJAf0",
      "sectionId": "69214b9731723704c1eda6dc"
    },
  },
  spectral_handle: {
    id: "spectral_handle",
    name: "Spectral Handle",
    tier: 5,
    category: "Handle",
    type: "Medium Handle",
    attackSpeed: 0.9,
    stats: {
      HexBoost: 5,
      EarthBoost: 5,
      WaterBoost: 10,
    },
    damageScalings: {
      Earth: 0.45,
      Water: 0.45,
      Hex: 0.45,
    },
    perks: {
      ghastly_rot: 1,
    },
    potencies: {
      poisonpotency: 2,
    },
    img: "../image/handles/spectralhandle.png",

    "source": {
      "cardId": "69214b9731723704c1eda6de",
      "cardUrl": "https://trello.com/c/HKzovbsD",
      "sectionId": "69214b9731723704c1eda6de"
    },
  },
  rotwood_pole: {
    id: "rotwood_pole",
    name: "Rotwood Pole",
    tier: 5,
    category: "Handle",
    type: "Pole",
    attackSpeed: 1,
    stats: {
      DexterityBoost: 4,
      EarthBoost: 4,
      HexBoost: 4,
    },
    damageScalings: {
      Earth: 0.35,
      Dexterity: 0.35,
      Hex: 0.35,
    },
    perks: {
      reinforced_block: 1,
      poisonous: 1,
    },
    potencies: {
      poisonpotency: 4,
    },
    img: "",

    "source": {
      "cardId": "69214b9731723704c1eda6e2",
      "cardUrl": "https://trello.com/c/q2F954ve",
      "sectionId": "69214b9731723704c1eda6e2"
    },
  },
  snake_venom_pole: {
    id: "snake_venom_pole",
    name: "Snake Venom Pole",
    tier: 5,
    category: "Handle",
    type: "Pole",
    attackSpeed: 1.1,
    stats: {
      DexterityBoost: 10,
      EarthBoost: 5,
      HexBoost: 5,
    },
    damageScalings: {
      Earth: 0.45,
      Dexterity: 0.45,
      Hex: 0.45,
    },
    perks: {
      reinforced_block: 1,
      venom_spitter: 1,
    },
    potencies: {
      poisonpotency: 4,
    },
    img: "",

    "source": {
      "cardId": "69214b9731723704c1eda6e4",
      "cardUrl": "https://trello.com/c/lCqUSaoC",
      "sectionId": "69214b9731723704c1eda6e4"
    },
  },
  honeycomb_handle: {
    id: "honeycomb_handle",
    name: "Honeycomb Handle",
    tier: 5,
    category: "Handle",
    type: "Large Handle",
    attackSpeed: 0.9,
    stats: {
      MagicBoost: 4,
      MagicDefense: 2,
      Tenacity: 0.1,
      PhysicalBoost: 4,
    },
    damageScalings: {
      Magic: 0.4,
      Physical: 0.4,
    },
    perks: {
      sticky_swings: 1,
    },
    img: "",

    "potencies": {},
    "source": {
      "cardId": "69214b9731723704c1eda6e8",
      "cardUrl": "https://trello.com/c/kgjr93E0",
      "sectionId": "69214b9731723704c1eda6e8"
    },
  },
  honeysteel_handle: {
    id: "honeysteel_handle",
    name: "Honeysteel Handle",
    tier: 5,
    category: "Handle",
    type: "Large Handle",
    attackSpeed: 0.9,
    stats: {
      MagicBoost: 6,
      MagicDefense: 10,
      Tenacity: 0.1,
      PhysicalBoost: 6,
    },
    damageScalings: {
      Magic: 0.55,
      Physical: 0.55,
    },
    perks: {
      explosive_honey: 1,
    },
    img: "",

    "potencies": {},
    "source": {
      "cardId": "69214b9731723704c1eda6ea",
      "cardUrl": "https://trello.com/c/ZhhAHWtS",
      "sectionId": "69214b9731723704c1eda6ea"
    },
  },
  honey_bumblz_pole: {
    id: "honey_bumblz_pole",
    name: "Honey Bumblz Pole",
    tier: 5,
    category: "Handle",
    type: "Pole",
    attackSpeed: 1,
    stats: {
      "MagicBoost": 4,
      "SummonBoost": 10,
      "PhysicalBoost": 4
    },
    damageScalings: {
      Magic: 0.35,
      Physical: 0.35,
      Summon: 0.1,
    },
    perks: {
      "reinforced_block": 1,
      "queen_s_guard": 1
    },
    img: "",

    "potencies": {},
    "source": {
      "cardId": "69214b9731723704c1eda6f0",
      "cardUrl": "https://trello.com/c/UD7jAgZH",
      "sectionId": "69214b9731723704c1eda6f0"
    },
  },
  queen_bumblz_pole: {
    id: "queen_bumblz_pole",
    name: "Queen Bumblz Pole",
    tier: 5,
    category: "Handle",
    type: "Pole",
    attackSpeed: 1,
    stats: {
      "MagicBoost": 5,
      "SummonBoost": 10,
      "HolyBoost": 5,
      "PhysicalBoost": 5
    },
    damageScalings: {
      Physical: 0.4,
      Magic: 0.4,
      Holy: 0.4,
      Summon: 0.2,
    },
    perks: {
      "reinforced_block": 1,
      "queen_s_power": 1
    },
    img: "",

    "potencies": {},
    "source": {
      "cardId": "69214b9731723704c1eda6f2",
      "cardUrl": "https://trello.com/c/LzXlCHsv",
      "sectionId": "69214b9731723704c1eda6f2"
    },
  },
  magic_great_hammer_pole: {
    id: "magic_great_hammer_pole",
    name: "Magic Great Hammer Pole",
    tier: 5,
    category: "Handle",
    type: "Pole",
    attackSpeed: 0.8,
    stats: {
      MagicBoost: 7,
      PhysicalDefense: 5,
      Warding: 20,
    },
    damageScalings: {
      Magic: 0.8,
    },
    damageTypes: {
      Magic: 0.2,
    },
    perks: {
      energize: 1,
      reinforced_block: 1,
    },
    img: "",

    "potencies": {},
    "source": {
      "cardId": "69214b9731723704c1eda6d4",
      "cardUrl": "https://trello.com/c/nylFjrNA",
      "sectionId": "69214b9731723704c1eda6d4"
    },
  },
  stratos_pole: {
    id: "stratos_pole",
    name: "Stratos Pole",
    tier: 5,
    category: "Handle",
    type: "Pole",
    attackSpeed: 1,
    damageScalings: {
      Air: 0.55,
    },
    perks: {
      reinforced_block: 1,
      air_barrier: 1,
    },
    img: "",

    "stats": {
      "AirBoost": 10
    },
    "potencies": {},
    "source": {
      "cardId": "69214b9731723704c1eda91a",
      "cardUrl": "https://trello.com/c/O21xr9Ko",
      "sectionId": "69214b9731723704c1eda91a"
    },
  },
  lightning_stratos_pole: {
    id: "lightning_stratos_pole",
    name: "Lightning Stratos Pole",
    tier: 5,
    category: "Handle",
    type: "Pole",
    attackSpeed: 1,
    stats: {
      "AirBoost": 10,
      "MagicBoost": 13
    },
    damageScalings: {
      Air: 0.55,
      Magic: 0.55,
    },
    perks: {
      reinforced_block: 1,
      power_surge: 1,
    },
    img: "",

    "potencies": {},
    "source": {
      "cardId": "69214b9731723704c1eda928",
      "cardUrl": "https://trello.com/c/nIHe5Wb9",
      "sectionId": "69214b9731723704c1eda928"
    },
  },
  caci_handle: {
    id: "caci_handle",
    name: "Caci Handle",
    tier: 5,
    category: "Handle",
    type: "Medium Handle",
    attackSpeed: 1.1,
    stats: {
      DexterityBoost: 5,
      PhysicalBoost: 5,
    },
    damageScalings: {
      Dexterity: 0.4,
      Physical: 0.4,
    },
    perks: {
      thorns: 2,
      dual_wielding: 1,
    },
    img: "",

    "potencies": {},
    "source": {
      "cardId": "69214b9731723704c1eda96a",
      "cardUrl": "https://trello.com/c/hQkahzwz",
      "sectionId": "69214b9731723704c1eda96a"
    },
  },
  caci_kings_handle: {
    id: "caci_kings_handle",
    name: "Caci Kings Handle",
    tier: 5,
    category: "Handle",
    type: "Medium Handle",
    attackSpeed: 1.1,
    stats: {
      "DexterityBoost": 5,
      "PhysicalBoost": 5,
      "AirBoost": 5,
      "EarthBoost": 5
    },
    damageScalings: {
      Dexterity: 0.45,
      Physical: 0.45,
      Earth: 0.45,
      Air: 0.45,
    },
    perks: {
      dual_wielding: 1,
      sandy_wounds: 1,
    },
    potencies: {
      bleedpotency: 2,
    },
    img: "",

    "source": {
      "cardId": "69214b9731723704c1eda972",
      "cardUrl": "https://trello.com/c/yjTkbQnE",
      "sectionId": "69214b9731723704c1eda972"
    },
  },
  buni_prince_pole: {
    id: "buni_prince_pole",
    name: "Buni Prince Pole",
    tier: 5,
    category: "Handle",
    type: "Pole",
    attackSpeed: 1,
    stats: {
      PhysicalDefense: 5,
      PhysicalBoost: 10,
    },
    damageScalings: {
      Physical: 0.5,
    },
    perks: {
      iron_bounce: 1,
      reinforced_block: 1,
    },
    img: "",

    "potencies": {},
    "source": {
      "cardId": "69214b9731723704c1edaa30",
      "cardUrl": "https://trello.com/c/R5ejTHzN",
      "sectionId": "69214b9731723704c1edaa30"
    },
  },
  buni_prince_cannon_pole: {
    id: "buni_prince_cannon_pole",
    name: "Buni Prince Cannon Pole",
    tier: 5,
    category: "Handle",
    type: "Pole",
    attackSpeed: 1,
    stats: {
      PhysicalDefense: 10,
      PhysicalBoost: 15,
    },
    damageScalings: {
      Physical: 0.7,
    },
    perks: {
      springblast: 1,
      reinforced_block: 1,
    },
    img: "",

    "potencies": {},
    "source": {
      "cardId": "69214b9731723704c1edaa32",
      "cardUrl": "https://trello.com/c/uahl0gtU",
      "sectionId": "69214b9731723704c1edaa32"
    },
  },
  ancient_handle: {
    id: "ancient_handle",
    name: "Ancient Handle",
    tier: 5,
    category: "Handle",
    type: "Medium Handle",
    attackSpeed: 1,
    stats: {
      EarthBoost: 8,
      PhysicalDefense: 5,
    },
    damageScalings: {
      Earth: 0.5,
    },
    perks: {
      rocky_body: 1,
    },
    img: "",

    "potencies": {},
    "source": {
      "cardId": "69214b9731723704c1edabcc",
      "cardUrl": "https://trello.com/c/TsE3FzT4",
      "sectionId": "69214b9731723704c1edabcc"
    },
  },
  bastion_greatswaxe_handle: {
    id: "bastion_greatswaxe_handle",
    name: "Bastion Greatswaxe Handle",
    tier: 5,
    category: "Handle",
    type: "Medium Handle",
    attackSpeed: 1.1,
    stats: {
      "EarthBoost": 8,
      "SpeedBoost": 5
    },
    damageScalings: {
      Earth: 0.8,
    },
    perks: {
      golem_guillotine: 1,
    },
    img: "",

    "potencies": {},
    "source": {
      "cardId": "69214b9731723704c1edabf2",
      "cardUrl": "https://trello.com/c/ryhjQJrT",
      "sectionId": "69214b9731723704c1edabf2"
    },
  },
  relic_handle: {
    id: "relic_handle",
    name: "Relic Handle",
    tier: 5,
    category: "Handle",
    type: "Medium Handle",
    attackSpeed: 1.1,
    stats: {
      EarthBoost: 6,
      HolyBoost: 6,
    },
    damageScalings: {
      Earth: 0.4,
      Holy: 0.4,
    },
    perks: {
      bastion_bless: 1,
    },
    img: "",

    "potencies": {},
    "source": {
      "cardId": "69214b9731723704c1edabc2",
      "cardUrl": "https://trello.com/c/ZeRVjzOy",
      "sectionId": "69214b9731723704c1edabc2"
    },
  },
  bastion_relic_handle: {
    id: "bastion_relic_handle",
    name: "Bastion Relic Handle",
    tier: 5,
    category: "Handle",
    type: "Long Handle",
    attackSpeed: 1,
    stats: {
      EarthBoost: 8,
      HolyBoost: 8,
    },
    damageScalings: {
      Earth: 0.55,
      Holy: 0.55,
    },
    perks: {
      essence_totem: 1,
    },
    img: "",

    "potencies": {},
    "source": {
      "cardId": "69214b9731723704c1edabd2",
      "cardUrl": "https://trello.com/c/C9rJZkCI",
      "sectionId": "69214b9731723704c1edabd2"
    },
  },
  vaen_handle: {
    id: "vaen_handle",
    name: "Vaen Handle",
    tier: 5,
    category: "Handle",
    type: "Medium Handle",
    attackSpeed: 1.1,
    stats: {
      "AirBoost": 5,
      "PhysicalBoost": 5
    },
    damageScalings: {
      Air: 0.4,
      Physical: 0.4,
    },
    perks: {
      crimson_tithe: 1,
    },
    img: "",

    "potencies": {},
    "source": {
      "cardId": "69214b9831723704c1edacc4",
      "cardUrl": "https://trello.com/c/bBBt9GEY",
      "sectionId": "69214b9831723704c1edacc4"
    },
  },
  lord_vaen_scythe_pole: {
    id: "lord_vaen_scythe_pole",
    name: "Lord Vaen Scythe Pole",
    tier: 5,
    category: "Handle",
    type: "Pole",
    attackSpeed: 1.1,
    stats: {
      "AirBoost": 10,
      "PhysicalBoost": 10
    },
    damageScalings: {
      Air: 0.55,
      Physical: 0.55,
    },
    perks: {
      ichor_spark: 1,
    },
    potencies: {
      bleedpotency: 3,
    },
    img: "",

    "source": {
      "cardId": "69214b9831723704c1edacc8",
      "cardUrl": "https://trello.com/c/oTIzZ5aJ",
      "sectionId": "69214b9831723704c1edacc8"
    },
  },
  mungal_handle: {
    id: "mungal_handle",
    name: "Mungal Handle",
    tier: 5,
    category: "Handle",
    type: "Medium Handle",
    attackSpeed: 1,
    stats: {
      HexBoost: 4,
      PhysicalBoost: 4,
      EarthBoost: 4,
    },
    damageScalings: {
      Hex: 0.35,
      Physical: 0.35,
      Earth: 0.35,
    },
    perks: {
      gaseous_smash: 1,
      dual_wielding: 1,
    },
    potencies: {
      poisonpotency: 3,
    },
    img: "",

    "source": {
      "cardId": "69214b9831723704c1edad1e",
      "cardUrl": "https://trello.com/c/RmCEfD2M",
      "sectionId": "69214b9831723704c1edad1e"
    },
  },
  mungal_pole: {
    id: "mungal_pole",
    name: "Mungal Pole",
    tier: 5,
    category: "Handle",
    type: "Pole",
    attackSpeed: 1,
    stats: {
      "HexBoost": 5,
      "MagicBoost": 5,
      "EarthBoost": 5,
      "SpeedBoost": 2
    },
    damageScalings: {
      Earth: 0.5,
      Magic: 0.5,
      Hex: 0.5,
    },
    perks: {
      reinforced_block: 1,
      proto_tech: 1,
    },
    img: "../image/handles/mungalpole.png",

    "potencies": {},
    "source": {
      "cardId": "69214b9831723704c1edad44",
      "cardUrl": "https://trello.com/c/EvxKu0Et",
      "sectionId": "69214b9831723704c1edad44"
    },
  },
  spider_handle: {
    id: "spider_handle",
    name: "Spider Handle",
    tier: 5,
    category: "Handle",
    type: "Medium Handle",
    attackSpeed: 1.1,
    stats: {
      HexDefense: 10,
      DexterityBoost: 10,
    },
    damageScalings: {
      Dexterity: 0.5,
    },
    perks: {
      poison_acceleration: 1,
    },
    potencies: {
      poisonpotency: 2,
    },
    img: "",

    "source": {
      "cardId": "69214b9831723704c1edad28",
      "cardUrl": "https://trello.com/c/mbY2Gwat",
      "sectionId": "69214b9831723704c1edad28"
    },
  },
  omega_lance_handle: {
    id: "omega_lance_handle",
    name: "Omega Lance Handle",
    tier: 5,
    category: "Handle",
    type: "Long Handle",
    attackSpeed: 1,
    stats: {
      "DexterityBoost": 5,
      "PhysicalBoost": 5,
      "FireBoost": 5,
      "AirBoost": 5
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
    img: "../image/handles/omegalancehandle.png",

    "potencies": {},
    "source": {
      "cardId": "69214b9831723704c1edad46",
      "cardUrl": "https://trello.com/c/6HqDIU9F",
      "sectionId": "69214b9831723704c1edad46"
    },
  },
  freezing_bronze_handle: {
    id: "freezing_bronze_handle",
    name: "Freezing Bronze Handle",
    tier: 5,
    category: "Handle",
    type: "Medium Handle",
    attackSpeed: 1,
    stats: {
      HeatResistance: 50,
      WaterBoost: 5,
      PhysicalBoost: 5,
    },
    damageScalings: {
      Water: 0.4,
      Physical: 0.4,
    },
    perks: {
      glacial_buildup: 1,
    },
    img: "",

    "potencies": {},
    "source": {
      "cardId": "69214b9831723704c1edad4c",
      "cardUrl": "https://trello.com/c/gYX7BLcn",
      "sectionId": "69214b9831723704c1edad4c"
    },
  },
  icewood_pole: {
    id: "icewood_pole",
    name: "Icewood Pole",
    tier: 5,
    category: "Handle",
    type: "Pole",
    attackSpeed: 1.2,
    stats: {
      HeatResistance: 50,
      PhysicalBoost: 5,
      WaterBoost: 5,
    },
    damageScalings: {
      Water: 0.55,
      Physical: 0.55,
    },
    perks: {
      ice_burst: 1,
    },
    img: "",

    "potencies": {},
    "source": {
      "cardId": "69214b9831723704c1edad4e",
      "cardUrl": "https://trello.com/c/UXVLFOwP",
      "sectionId": "69214b9831723704c1edad4e"
    },
  },
};

