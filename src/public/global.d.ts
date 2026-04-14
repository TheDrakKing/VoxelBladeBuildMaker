export {};

declare global {
    type sourceType = "Weapon" | "Perk" | "Rune" | "WeaponArt" | "normal" | "Status";
    
    export interface baseDamageData {
        /**
         * The dmaage amount
         */
        damage: number;
        /**
         * The amount of times the dmage should be repeated
         */
        hitAmount: number;
        /**
         * What specifically gave the damage
         * if status you would put the status that did the damage
         * if it a wepaon you would put what weapon type caused it
         * if it a Perk you would put what Perk cased it, e.g volticBody
         */
        source: string;
        /**
         * What type does the source belong to
         * exmaple, weapon, status, Perk
         */
        sourceType: sourceType;
        /**
         * the damage type that was done
         * if status you would just put  "Status"
         * if weapon you put either M1 OR M2
         * if Perk you put what the Perk belongs to if any
         */
        sourceDamageType: string;
        /**
         * All the damages types that was done
         */
        outputDamages?: { [key in scale]?: number };
        /**
         * the totalDamage, which is the rounded "damage" amount
         */
        totalDamage?: number;
    }
}