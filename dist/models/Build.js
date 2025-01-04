import * as ItemModule from "../models/Item.js";
import * as BuffModule from "../models/Buffs.js";
let damageMultiplier = {
    // damageMultiplier is the total of damage modification of a type
    damage_bonus_multiplier: {},
    damage_reduced_multiplier: {},
    output_multiplier: {},
    type_specific_multiplier: {},
    crit_multiplier: {},
    armor_multiplier: {},
    special_multiplier: {},
};
export class Build {
    constructor() {
        this.mainArmor = {};
        this.infuseArmor = {};
        this.enchantments = {};
        this.level = 1;
        this.potencies = {};
        this.stats = {};
        this.effectiveBoosts = {};
        this.perks = {};
        this.damageScalings = {};
        this.damageTypes = {};
        this.totEffBoost = 0;
        this.guildPromotion = 0;
        this.damageModifications = {
            damage_bonus_mods: {},
            damage_reduced_mods: {},
            specific_bonus_mods: {},
            specific_reduced_mods: {},
            crit_mods: {},
            armor_mods: {},
            special_mods: {},
        };
        this.m1 = [];
        this.m2 = [];
    }
    calculateUpgrade(stats, upgrade) {
        if (!stats)
            return stats;
        let multiplier = upgrade / 10;
        for (const [key, value] of Object.entries(stats)) {
            if (value === undefined || !stats[key])
                continue;
            let statAmount = value >= 0 ? value : value * -1;
            stats[key] += Math.trunc(statAmount * multiplier * 10) / 10;
        }
        return stats;
    }
    addItemStatsToBuild(item, isInfuse, key) {
        // Loop through the stats using Object.entries
        if (item) {
            if (item.stats) {
                let stats = Object.assign({}, item.stats);
                //Assign the upgrade to the armor
                stats = this.calculateUpgrade(stats, item?.upgrade || 0);
                //Add armor Enchantments Before add to over build
                if (item.category == "Armor" && key && !isInfuse) {
                    if (this.enchantments[key]) {
                        for (let index = 0; index < this.enchantments[key].length; index++) {
                            if (!this.enchantments[key][index])
                                continue;
                            const enchantment = this.enchantments[key][index];
                            if (!enchantment.onArmorStatModified)
                                continue;
                            let args = [1, undefined, stats];
                            enchantment.onArmorStatModified.apply(this, args);
                        }
                    }
                }
                //Adds the stats to the Build
                for (const [key, value] of Object.entries(stats)) {
                    // key is a string, value is a number or undefined
                    if (!value)
                        continue;
                    let amount = value;
                    let previousValue = this.stats[key];
                    if (isInfuse) {
                        amount = value / 2;
                    }
                    this.stats[key] = previousValue ? previousValue + amount : amount;
                    this.stats[key] = Math.trunc(this.stats[key] * 100) / 100;
                }
            }
            if (item.perks) {
                for (const [key, value] of Object.entries(item.perks)) {
                    // key is a string, value is a number or undefined
                    if (value === undefined)
                        continue;
                    let previousValue = this.perks[key];
                    this.perks[key] = previousValue ? previousValue + value : value;
                }
            }
            if (item.potencies) {
                for (const [key, value] of Object.entries(item.potencies)) {
                    // key is a string, value is a number or undefined
                    if (value === undefined)
                        continue;
                    let previousValue = this.potencies[key];
                    this.potencies[key] = previousValue ? previousValue + value : value;
                }
            }
            if (item.damageScalings) {
                for (const [key, value] of Object.entries(item.damageScalings)) {
                    // key is a string, value is a number or undefined
                    if (value === undefined)
                        continue;
                    let previousValue = this.damageScalings[key];
                    this.damageScalings[key] = previousValue
                        ? previousValue + value
                        : value;
                }
            }
            if (item.damageTypes) {
                for (const [key, value] of Object.entries(item.damageTypes)) {
                    // key is a string, value is a number or undefined
                    if (value === undefined)
                        continue;
                    let previousValue = this.damageTypes[key];
                    this.damageTypes[key] = previousValue ? previousValue + value : value;
                }
            }
        }
    }
    findBuffInBuild(buffToFind, category) {
        let array;
        if (category == "Buff") {
            if (!this.buff)
                return null;
            array = this.buff;
        }
        else {
            if (!this.deBuffs)
                return null;
            array = this.deBuffs;
        }
        let buff = array.find((buff) => buff?.id === buffToFind);
        return buff;
    }
    addBuffToBuild(buff) {
        if (this.findBuffInBuild(buff.id, buff.category))
            return; // that buff is already in the build
        if (buff.category == "Buff") {
            if (!this.buff)
                this.buff = [];
            this.buff.push(buff);
        }
        else {
            if (!this.deBuffs)
                this.deBuffs = [];
            this.deBuffs.push(buff);
        }
        // console.log(this.buff);
        // console.log(this.buff?.length);
        this.resetBuild();
    }
    removeBuffToBuild(buffToFind, category) {
        if (buffToFind instanceof BuffModule.Buff) {
            buffToFind = buffToFind.id;
        }
        let buff = this.findBuffInBuild(buffToFind, category);
        if (!buff)
            return;
        let array;
        if (category == "Buff") {
            if (!this.buff)
                return;
            let indexToFind = this.buff.indexOf(buff);
            delete this.buff[indexToFind];
            this.buff = this.buff.filter((_, index) => index !== indexToFind); // Remove element at index 0
        }
        else {
            if (!this.deBuffs)
                return;
            let indexToFind = this.deBuffs.indexOf(buff);
            delete this.deBuffs[indexToFind];
            this.deBuffs = this.deBuffs.filter((_, index) => index !== indexToFind); // Remove element at index 0
        }
        // console.log(this.buff);
        // console.log(this.buff?.length);
        this.resetBuild();
    }
    addItemToBuild(item, section, key, enchantIndex) {
        if (section !== "enchantments" || key !== "guild") {
            if (item instanceof ItemModule.Item) {
                key = item.category === "Armor" ? item.type?.toLowerCase() : item.category?.toLowerCase();
            }
        }
        if (!key)
            return;
        if (key == "blade" || key == "handle" || key == "weaponArt" || key == "guild") {
            this[key] = item;
        }
        else if (section) {
            if (section === "infuseArmor" || section === "mainArmor") {
                this[section][key] = item;
            }
            else if (section === "enchantments" && enchantIndex != undefined) {
                if (!this.enchantments[key])
                    this.enchantments[key] = [];
                this.enchantments[key][enchantIndex] = item;
            }
        }
        //this.resetBuild();
    }
    removeFromBuild(key, section, enchantIndex) {
        if (section !== "enchantments") {
            key = key.toLowerCase();
        }
        if (key == "blade" || key == "handle" || key == "weaponArt" || key == "guild") {
            delete this[key];
        }
        else if (section) {
            if (section == "infuseArmor" || section == "mainArmor") {
                delete this[section][key];
            }
            else if (section === "enchantments" && enchantIndex != undefined) {
                if (!this.enchantments[key])
                    return;
                delete this.enchantments[key][enchantIndex];
            }
        }
        else {
            return;
        }
        //this.resetBuild();
    }
    resetBuild(item) {
        ////////////////////////////////////////////////wipe the Html Elements to make way for the updates ///////////////////////////////////////////////////
        //wipeStatHolders();
        this.totEffBoost = 0;
        this.damageModifications = {
            damage_bonus_mods: {},
            damage_reduced_mods: {},
            specific_bonus_mods: {},
            specific_reduced_mods: {},
            crit_mods: {},
            armor_mods: {},
            special_mods: {},
        };
        ////////////////////////////////////////////////Add the Item stats, perks etc to the stat containers///////////////////////////////////////////////////
        if (this.blade)
            this.addItemStatsToBuild(this.blade);
        if (this.handle)
            this.addItemStatsToBuild(this.handle);
        if (this.weaponArt)
            this.addItemStatsToBuild(this.weaponArt);
        if (this.guild && this.guild.promotions) {
            let promotion = this.guild.promotions[this.guildPromotion];
            let guild = new ItemModule.Item({ id: this.guild.id, stats: promotion.stats, perks: promotion.perks });
            console.log(guild);
            this.addItemStatsToBuild(guild);
        }
        for (const [key, value] of Object.entries(this.enchantments)) {
            // key is a string, value is a number or undefined
            if (value === undefined)
                continue;
            for (let index = 0; index < value.length; index++) {
                const enchantment = value[index];
                this.addItemStatsToBuild(enchantment);
            }
        }
        for (const [key, value] of Object.entries(this.infuseArmor)) {
            if (value === undefined)
                continue;
            this.addItemStatsToBuild(value, true);
        }
        for (const [key, value] of Object.entries(this.mainArmor)) {
            if (value === undefined)
                continue;
            this.addItemStatsToBuild(value, false, key);
        }
        //////////////////////// Enchants activation ////////////////////////
        for (const [key, value] of Object.entries(this.enchantments)) {
            // key is a string, value is a number or undefined
            if (value === undefined)
                continue;
            for (let index = 0; index < value.length; index++) {
                if (!value[index])
                    continue;
                const enchantment = value[index];
                if (!enchantment.onStatCalculation || !this.mainArmor[key])
                    continue;
                enchantment.onStatCalculation.apply(this);
            }
        }
        //////////////////////// Perk activation ////////////////////////
        //////////////////////// Run the displayStats() to add show the build stats ////////////////////////
        this.constructionType = undefined;
    }
}
;
