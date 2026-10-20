export const Buffs = {
    scourge_proc: {
        id: "scourge_proc", name: "Scourge Proc", category: "Buff", baseDuration: 0,
    },
    static_charge: {
        id: "static_charge", name: "Static Charge", category: "Buff", baseDuration: 0, stacks: 1,
    },
    bounce: {
        id: "bounce",
        name: "Bounce",
        category: "Buff",
        baseDuration: 5,
        potencyId: "bouncepotency",
        img: "",
    },
    guaranteed_crit: {
        id: "guaranteed_crit",
        name: "Guaranteed Crit",
        category: "Buff",
        baseDuration: 5,
        potencyId: "guaranteedcritpotency",
        onCritRateCalculation() {
            return 1;
        },
        img: "",
    },
    rage: {
        id: "rage",
        name: "Rage",
        category: "Buff",
        baseDuration: 5,
        potencyId: "ragepotency",
        onSpecificDmgBonusMultiplier(potency, args) {
            if (!potency || !args?.outputType)
                return null;
            const type = args.outputType;
            const eligible = type === "Physical" || (type === "True" && (this.perks.scourge || 0) > 0) ||
                (type === "Magic" && (this.perks.mage_rage || 0) > 0) ||
                (type === "Water" && (this.perks.oceans_rage || 0) > 0);
            return eligible ? potency / 10 : null;
        },
        img: "",
    },
    regen: {
        id: "regen",
        name: "Regen",
        category: "Buff",
        baseDuration: 5,
        potencyId: "regenpotency",
        img: "",
    },
    reinforce: {
        id: "reinforce",
        name: "Reinforce",
        category: "Buff",
        baseDuration: 5,
        potencyId: "reinforcepotency",
        onDmgReducedMultiplier(potency) {
            return potency ? potency / 10 : null;
        },
        img: "",
    },
    tailwind: {
        id: "tailwind",
        name: "Tailwind",
        category: "Buff",
        baseDuration: 5,
        img: "",
    },
    draconic_infusion: {
        id: "draconic_infusion",
        name: "Draconic Infusion",
        category: "Buff",
        baseDuration: 5,
        img: "",
    },
    lightning_cloak: {
        id: "lightning_cloak",
        name: "Lightning Cloak",
        category: "Buff",
        baseDuration: 5,
        potencyId: "lightningcloakpotency",
        img: "",
    },
};
