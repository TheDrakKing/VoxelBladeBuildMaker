import * as ItemModule from "../models/Item.js";
import * as PerkModule from "../models/Perk.js";
import * as BuffModule from "../models/Buffs.js";
import { GuildStore } from "./Guild.js";
import { RaceStore } from "./Race.js";
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
        this.hp = 100;
        this.maxHp = 100;
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
        this.resetBuild();
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
    getHp() {
        let Boost = (1 + (this.level / 80));
        const hpBoost = Math.ceil(Boost * 120);
        return hpBoost;
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
                            let args = [1, {
                                    stat: stats
                                }];
                            //enchantment.onArmorStatModified.apply(this, args);
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
                    //certain perks carry hidden stats
                    const perk = PerkModule.PerkStore.get(key);
                    if (perk && perk.stats !== undefined) {
                        let perkstats = new ItemModule.Item({ id: perk.id, stats: perk.stats });
                        this.addItemStatsToBuild(perkstats);
                    }
                }
            }
            // only potency from item.potencies are assumed to be addtive potencies, mean they get added to a soruce potency
            if (item.potencies) {
                for (const [key, value] of Object.entries(item.potencies)) {
                    // key is a string, value is a number or undefined
                    if (!value)
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
    getSourcesForBuff(inatePotency) {
        const sources = {};
        //look Though perks
        for (const [perkId, amount] of Object.entries(this.perks)) {
            const perk = PerkModule.PerkStore.get(perkId);
            if (!perk || !perk.sourcepotencies || !perk.sourcepotencies[inatePotency])
                continue;
            sources[perkId] = {
                sourceName: perk.name,
                type: "Perk",
                inatePotency: perk.sourcepotencies[inatePotency],
            };
        }
        //look at rune
        if (this.mainArmor.rune && this.mainArmor.rune.sourcepotencies && this.mainArmor.rune.sourcepotencies[inatePotency]) {
            sources[this.mainArmor.rune.id] = {
                sourceName: this.mainArmor.rune.name,
                type: "Rune",
                inatePotency: this.mainArmor.rune.sourcepotencies[inatePotency],
            };
        }
        //look at WeaponArt
        if (this.weaponart && this.weaponart.sourcepotencies && this.weaponart.sourcepotencies[inatePotency]) {
            sources[this.weaponart.id] = {
                sourceName: this.weaponart.name,
                type: "WeaponArt",
                inatePotency: this.weaponart.sourcepotencies[inatePotency],
            };
        }
        return sources;
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
        //defult call setSourceData just incase the we forgot layer, so it fill in it
        //buff.setSourceData()
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
        if (section !== "enchantments" && key !== "guild" && key !== "race" && key !== "weaponart") {
            if (item instanceof ItemModule.Item) {
                key = item.category === "Armor" ? item.type?.toLowerCase() : item.category?.toLowerCase();
            }
        }
        if (!key)
            return;
        if (key == "blade" || key == "handle" || key == "weaponart" || key == "guild" || key == "race") {
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
        if (key == "blade" || key == "handle" || key == "weaponart" || key == "guild" || key == "race") {
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
        //if (this.weaponArt) this.addItemStatsToBuild(this.weaponArt);
        if (this.guild && this.guild.promotions) {
            let promotion = this.guild.promotions[this.guildPromotion];
            let guild = new ItemModule.Item({ id: this.guild.id, stats: Object.assign({}, promotion.stats), perks: Object.assign({}, promotion.perks) });
            this.addItemStatsToBuild(guild);
        }
        if (this.race) {
            let race = new ItemModule.Item({ id: this.race.id, stats: Object.assign({}, this.race.stats), perks: Object.assign({}, this.race.perks) });
            this.addItemStatsToBuild(race);
        }
        // for (const [key, value] of Object.entries(this.enchantments) as [
        //   keyof Armor, []
        // ][]) {
        //   // key is a string, value is a number or undefined
        //   if (value === undefined) continue;
        //   for (let index = 0; index < value.length; index++) {
        //     const enchantment = value[index] as ItemModule.Item;
        //     this.addItemStatsToBuild(enchantment);
        //   }
        // }
        for (const [key, value] of Object.entries(this.infuseArmor)) {
            if (value === undefined)
                continue;
            this.addItemStatsToBuild(value, true);
        }
        for (const [key, value] of Object.entries(this.mainArmor)) {
            if (value === undefined)
                continue;
            let item = new ItemModule.Item({
                id: value.id, stats: {}, perks: {}, potencies: {},
            });
            Object.assign(item.stats, value.stats);
            Object.assign(item.perks, value.perks);
            Object.assign(item.potencies, value.potencies);
            //////////////////////// Enchants activation ////////////////////////
            const armorEnchantments = this.enchantments[key];
            if (armorEnchantments) {
                for (let index = 0; index < armorEnchantments.length; index++) {
                    if (!armorEnchantments[index])
                        continue;
                    const enchantment = armorEnchantments[index];
                    if (enchantment.onStatCalculation) {
                        enchantment.onStatCalculation.apply(this, [undefined, { item }]);
                    }
                    ;
                    // add the stats from the enchantment to the item 
                    for (const [stat, amount] of Object.entries(enchantment.stats || {})) {
                        if (!item.stats)
                            item.stats = {};
                        if (item.stats[stat]) {
                            item.stats[stat] += amount;
                        }
                        else {
                            item.stats[stat] = amount;
                        }
                    }
                    // add the perk from the enchantment to the item 
                    for (const [perk, amount] of Object.entries(enchantment.perks || {})) {
                        if (!item.perks)
                            item.perks = {};
                        if (item.perks[perk]) {
                            item.perks[perk] += amount;
                        }
                        else {
                            item.perks[perk] = amount;
                        }
                    }
                    //add Potencys
                    for (const [potency, amount] of Object.entries(enchantment.potencies || {})) {
                        if (!item.potencies)
                            item.potencies = {};
                        if (item.potencies[potency]) {
                            item.potencies[potency] += amount;
                        }
                        else {
                            item.potencies[potency] = amount;
                        }
                    }
                }
            }
            // when add enchment bounus they go on the armor not the overall build by them slef
            this.addItemStatsToBuild(item, false, key);
        }
        //////////////////////// Enchants activation ////////////////////////
        // for (const [key, value] of Object.entries(this.enchantments) as [keyof Armor, []
        // ][]) {
        //   // key is a string, value is a number or undefined
        //   if (value === undefined) continue;
        //   for (let index = 0; index < value.length; index++) {
        //     if (!value[index]) continue;
        //     const enchantment = value[index] as ItemModule.Item;
        //     if (!enchantment.onStatCalculation || !this.mainArmor[key]) continue;
        //     enchantment.onStatCalculation.apply(this);
        //   }
        // }
        //////////////////////// Perk activation ////////////////////////
        //////////////////////// Run the displayStats() to add show the build stats ////////////////////////
        const oldMaxHp = this.maxHp;
        this.maxHp = this.getHp();
        if (this.hp > this.maxHp)
            this.hp = this.maxHp;
        if (this.hp === oldMaxHp) {
            this.hp = this.maxHp;
        }
        this.constructionType = undefined;
    }
    static itemToSavedSlot(item) {
        if (!item?.id)
            return undefined;
        return {
            id: item.id,
            upgrade: item.upgrade || 0,
        };
    }
    static savedSlotToItem(slot) {
        if (!slot?.id)
            return undefined;
        const item = ItemModule.ItemStore.getByID(slot.id);
        item.upgrade = slot.upgrade || 0;
        return item;
    }
    buildToJson() {
        const saveData = {
            version: 1,
            level: this.level,
            hp: this.hp,
            maxHp: this.maxHp,
            guildPromotion: this.guildPromotion,
            bladeId: this.blade?.id,
            handleId: this.handle?.id,
            weaponArtId: this.weaponart?.id,
            guildId: this.guild?.id,
            raceId: this.race?.id,
            buffIds: this.buff?.map((buff) => buff.id).filter(Boolean),
            deBuffIds: this.deBuffs?.map((buff) => buff.id).filter(Boolean),
            mainArmor: {
                helmet: Build.itemToSavedSlot(this.mainArmor.helmet),
                chestplate: Build.itemToSavedSlot(this.mainArmor.chestplate),
                legging: Build.itemToSavedSlot(this.mainArmor.legging),
                rune: Build.itemToSavedSlot(this.mainArmor.rune),
                ring: Build.itemToSavedSlot(this.mainArmor.ring),
            },
            infuseArmor: {
                helmet: Build.itemToSavedSlot(this.infuseArmor.helmet),
                chestplate: Build.itemToSavedSlot(this.infuseArmor.chestplate),
                legging: Build.itemToSavedSlot(this.infuseArmor.legging),
                rune: Build.itemToSavedSlot(this.infuseArmor.rune),
                ring: Build.itemToSavedSlot(this.infuseArmor.ring),
            },
            enchantments: {
                helmet: this.enchantments.helmet?.map((item) => item?.id || null),
                chestplate: this.enchantments.chestplate?.map((item) => item?.id || null),
                legging: this.enchantments.legging?.map((item) => item?.id || null),
                rune: this.enchantments.rune?.map((item) => item?.id || null),
                ring: this.enchantments.ring?.map((item) => item?.id || null),
            },
        };
        return JSON.stringify(saveData, null, 2);
    }
    static dictToBuild(data) {
        const build = new Build();
        build.level = data.level || 1;
        build.hp = data.hp || 100;
        build.maxHp = data.maxHp || build.getHp();
        build.guildPromotion = data.guildPromotion || 0;
        if (data.bladeId)
            build.blade = ItemModule.ItemStore.getByID(data.bladeId);
        if (data.handleId)
            build.handle = ItemModule.ItemStore.getByID(data.handleId);
        if (data.weaponArtId)
            build.weaponart = ItemModule.ItemStore.getByID(data.weaponArtId);
        if (data.guildId)
            build.guild = GuildStore.getByID(data.guildId);
        if (data.raceId)
            build.race = RaceStore.getByID(data.raceId);
        build.mainArmor = {
            helmet: Build.savedSlotToItem(data.mainArmor?.helmet),
            chestplate: Build.savedSlotToItem(data.mainArmor?.chestplate),
            legging: Build.savedSlotToItem(data.mainArmor?.legging),
            rune: Build.savedSlotToItem(data.mainArmor?.rune),
            ring: Build.savedSlotToItem(data.mainArmor?.ring),
        };
        build.infuseArmor = {
            helmet: Build.savedSlotToItem(data.infuseArmor?.helmet),
            chestplate: Build.savedSlotToItem(data.infuseArmor?.chestplate),
            legging: Build.savedSlotToItem(data.infuseArmor?.legging),
            rune: Build.savedSlotToItem(data.infuseArmor?.rune),
            ring: Build.savedSlotToItem(data.infuseArmor?.ring),
        };
        const armorKeys = ["helmet", "chestplate", "legging", "rune", "ring"];
        armorKeys.forEach((key) => {
            const savedEnchantments = data.enchantments?.[key];
            if (!savedEnchantments?.length)
                return;
            build.enchantments[key] = savedEnchantments.map((id) => {
                if (!id)
                    return undefined;
                return ItemModule.ItemStore.getByID(id);
            });
        });
        build.buff = data.buffIds
            ?.map((id) => BuffModule.BuffStore.getByID(id))
            .filter((buff) => !!buff.id);
        build.deBuffs = data.deBuffIds
            ?.map((id) => BuffModule.BuffStore.getByID(id))
            .filter((buff) => !!buff.id);
        build.resetBuild();
        return build;
    }
}
;
