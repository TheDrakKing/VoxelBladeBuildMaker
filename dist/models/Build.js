import * as ItemModule from "../models/Item.js";
import * as BuffModule from "../models/Buffs.js";
let damageModifications = {
    damage_bonus_mods: {},
    damage_reduced_mods: {},
    output_mods: {},
    type_specific_mods: {},
    crit_mods: {},
    armor_mods: {},
    special_mods: {},
};
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
        this.m1 = [];
        this.m2 = [];
    }
    calculateUpgrade(stats, upgrade) {
        if (!stats)
            return stats;
        let multiplier = (upgrade / 10);
        for (const [key, value] of Object.entries(stats)) {
            if (value === undefined || !stats[key])
                continue;
            let statAmount = value >= 0 ? value : value * -1;
            stats[key] += Math.trunc((statAmount * multiplier) * 10) / 10;
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
                            let args = [1, stats];
                            enchantment.onArmorStatModified.apply(this, args);
                        }
                    }
                }
                //Adds the stats to the Build
                for (const [key, value] of Object.entries(stats)) {
                    // key is a string, value is a number or undefined
                    if (value === undefined)
                        continue;
                    let amount = value;
                    let previousValue = this.stats[key];
                    if (isInfuse)
                        amount = value / 2;
                    this.stats[key] = previousValue ? previousValue + amount : amount;
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
                    this.damageScalings[key] = previousValue ? previousValue + value : value;
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
        //this.resetBuild();
    }
    removeBuffToBuild(buffToFind, category) {
        if (buffToFind instanceof BuffModule.Buff) {
            buffToFind = buffToFind.id;
        }
        let buff = findBuffInBuild(buffToFind, category);
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
        //this.resetBuild();
    }
    addItemToBuild(item, section, key, enchantIndex, htmlElement) {
        if (section !== "enchantments") {
            if (typeof item == "string") {
                key = item.toLowerCase();
            }
            else if (item instanceof ItemModule.Item) {
                key = item.category === "Armor" ? item.type?.toLowerCase() : item.category?.toLowerCase();
            }
        }
        if (!key || item instanceof ItemModule.Item === false)
            return;
        if (key == "blade" || key == "handle" || key == "weaponArt") {
            this[key] = item;
            imgHolders[key].src = item.img ? item.img : "";
            imgHolders[key].alt = item.name;
        }
        else if (section) {
            if (section === "infuseArmor" || section === "mainArmor") {
                build[section][key] = item;
                if (section === "infuseArmor") {
                    infusionImgHolders[key].src = item.img ? item.img : "";
                    infusionImgHolders[key].alt = item.name;
                }
                else {
                    imgHolders[key].src = item.img ? item.img : "";
                    imgHolders[key].alt = item.name;
                }
            }
            else if (section === "enchantments" && enchantIndex != undefined) {
                if (!this.enchantments[key])
                    this.enchantments[key] = [];
                this.enchantments[key][enchantIndex] = item;
                if (htmlElement) {
                    htmlElement.children[0].innerHTML = item.name;
                }
            }
        }
        this.resetBuild();
    }
    resetBuild(item) {
        ////////////////////////////////////////////////wipe the Html Elements to make way for the updates ///////////////////////////////////////////////////
        //wipeStatHolders();
        this.totEffBoost = 0;
        ////////////////////////////////////////////////Add the Item stats, perks etc to the stat containers///////////////////////////////////////////////////
        if (this.blade)
            this.addItemStatsToBuild(this.blade);
        if (this.handle)
            this.addItemStatsToBuild(this.handle);
        if (this.weaponArt)
            this.addItemStatsToBuild(this.weaponArt);
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
        this.addItemStatsToBuild(); // incase none of the others did run
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
        //displayStats();
        //////////////////////// Damage Calcautuons ////////////////////////
        //Run the damage calculation
        this.constructionType = undefined;
    }
}
;
