let images = "/image/rings/";
export const Rings = {
    fire_ring: {
        id: "fire_ring",
        name: "Fire Ring",
        category: "Ring",
        description: "Fire magic becomes stronger when using this ring.",
        stats: {
            FireBoost: 10,
        },
        perks: {
            ignition: 1,
        },
        img: images + "firering.png",
    },
    sharp_ring: {
        id: "sharp_ring",
        name: "Sharp Ring",
        category: "Ring",
        description: "This ring makes you feel stronger.",
        stats: {
            PhysicalBoost: 10,
        },
        perks: {
            sharp_claws: 1,
        },
        img: "",
    },
    earthen_ring: {
        id: "earthen_ring",
        name: "Earthen Ring",
        category: "Ring",
        description: "A tough and sturdy ring that channels the power of the earth.",
        stats: {
            EarthBoost: 10,
        },
        perks: {
            erosion: 1,
        },
        img: "",
    },
    wind_ring: {
        id: "wind_ring",
        name: "Wind Ring",
        category: "Ring",
        description: "Air magic becomes stronger when using this ring.",
        stats: {
            AirBoost: 10,
        },
        perks: {
            tailwind: 1,
        },
        img: "",
    },
    water_ring: {
        id: "water_ring",
        name: "Water Ring",
        category: "Ring",
        description: "Water magic becomes stronger when using this ring.",
        stats: {
            WaterBoost: 10,
        },
        perks: {
            extinguish: 1,
        },
        img: "",
    },
    void_contract_ring: {
        id: "void_contract_ring",
        name: "Void Contract Ring",
        category: "Ring",
        description: "Painful thorns bind this ring to the assassin until the contract is complete. Commonly used by void cultists outsourcing ''work''",
        stats: {
            AttackSpeed: 2,
            PhysicalDefense: 2,
        },
        perks: {
            void_contract: 1,
        },
        img: "",
    },
    stone_giant_ring: {
        id: "stone_giant_ring",
        name: "Stone Giant Ring",
        category: "Ring",
        description: "A crackled and dishevelled ring carved out of stone that was once living.",
        stats: {
            PhysicalBoost: 5,
            SpeedBoost: -5,
        },
        perks: {
            colossus: 1,
        },
        img: "",
    },
};
