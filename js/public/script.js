import * as ItemModule from "../models/Item.js";
import * as BuffModule from "../models/Buffs.js";
import * as Build from "../models/Build.js";
import * as helper from "./helper.js";
import * as Perk from "../models/Perk.js";
import * as GuildModule from "../models/Guild.js";
//Buttons
const infuseGearButtons = document.querySelectorAll('.infuseGear');
const mainGearButtons = document.querySelectorAll('.mainGear');
const weaponMakeUpButtons = document.querySelectorAll('.weaponMakeUp');
const clearItemButtons = document.querySelectorAll('.clear_button');
const infuseClearButtons = document.querySelectorAll('.infuse_clear_button');
const weaponClearButtons = document.querySelectorAll('.weapon_clear_button');
const guildSelector = document.getElementById("guild_selector");
const promotionSelector = document.getElementById("guild_promotion");
const showInfusions = document.getElementById("showInfusions");
const showMainGear = document.getElementById("showMainGear");
const theme_Selector_input = document.getElementById("theme_Selector_input");
//Level, Hp and Weapon Txt
const weaponTypeText = document.getElementById("weapon_type_text");
const healthInput = document.getElementById("hpValue");
const levelInput = document.getElementById("levelValue");
//Containers
const infusionsContentDiv = document.getElementById("infusions_gear");
const mainGearContentDiv = document.getElementById("main_gear");
const weaponContentDiv = document.getElementById("weaponDiv");
const items_selector = document.getElementById("itemsSelectorDiv");
const SelectorClose = document.getElementById("close_items_selector");
const items_container = document.getElementById("itemsContainer");
const dmgModContainer = document.getElementById("damageModifications");
const buffs_container = document.getElementById("buffs_container");
const debuffs_container = document.getElementById("debuffs_container");
const targetBuffs_container = document.getElementById("target_buffs_container");
const targetDeBuffs_container = document.getElementById("target_debuffs_container");
//template 
const selectItem_template = document.getElementById("selectItem_template");
const statHolder_template = document.getElementById("statHolder_template");
const buff_template = document.getElementById("buff_template");
//Armor
const headDiv = document.getElementById("headDiv");
const chestplateDiv = document.getElementById("chestplateDiv");
const leggingsDiv = document.getElementById("leggingsDiv");
const runeDiv = document.getElementById("runeDiv");
const ringDiv = document.getElementById("ringDiv");
//Weapon
const guildDiv = document.getElementById("guildDiv");
const bladeDiv = document.getElementById("bladeDiv");
const handleDiv = document.getElementById("handleDiv");
const weaponArtDiv = document.getElementById("weaponArtDiv");
//Infuse Armor
const infuseHeadDiv = document.getElementById("infuse_headDiv");
const infuseChestplateDiv = document.getElementById("infuse_chestplateDiv");
const infuseLeggingsDiv = document.getElementById("infuse_leggingsDiv");
const infuseRuneDiv = document.getElementById("infuse_runeDiv");
const infuseRingDiv = document.getElementById("infuse_ringDiv");
//stats Display divs
const statsContainerDiv = document.getElementById("stats");
const perksContainerDiv = document.getElementById("perks");
const potenciesContainerDiv = document.getElementById("potencies");
const damageScalingsContainerDiv = document.getElementById("damageScalings");
const damageTypesContainerDiv = document.getElementById("damageTypes");
//Table
const m1DamageTable = document.getElementById("m1_damage_table");
const m2DamageTable = document.getElementById("m2_damage_table");
const damageHeaderTemplate = document.getElementById("damage_header");
const damageRowTemplate = document.getElementById("damage_row_template");
//images
let PlusSymbol = "/VoxelBladeBuildMaker/image/plus_symbol_white.png";
let CloseSymbol = "/VoxelBladeBuildMaker/image/close_X_white.png";
let target = new Build.Build();
//target.stats.PhysicalDefense = -50;
// Create the build object
let build = new Build.Build();
build.target = target;
let infusionImgHolders = {
    helmet: infuseHeadDiv.children[1].children[0].children[0],
    chestplate: infuseChestplateDiv.children[1].children[0].children[0],
    legging: infuseLeggingsDiv.children[1].children[0].children[0],
    rune: infuseRuneDiv.children[1].children[0].children[0],
    ring: infuseRingDiv.children[1].children[0].children[0],
};
let imgHolders = {
    guild: guildDiv.children[1].children[0].children[0],
    blade: bladeDiv.children[1].children[0].children[0],
    handle: handleDiv.children[1].children[0].children[0],
    helmet: headDiv.children[2].children[0].children[0],
    chestplate: chestplateDiv.children[2].children[0].children[0],
    legging: leggingsDiv.children[2].children[0].children[0],
    rune: runeDiv.children[2].children[0].children[0],
    ring: ringDiv.children[2].children[0].children[0],
    weaponArt: weaponArtDiv.children[1].children[0].children[0],
};
let m1Rows = {};
let m2Rows = {};
const selectItemDivs = [];

/////////////////////////////////////// Create HTML Elements ///////////////////////////////////////
function createStatHolder(name, value, ContainerDiv) {
    if (statHolder_template == null)
        return null;
    const clonedDiv = statHolder_template.cloneNode(true);
    // Optionally, update the cloned div (e.g., clear input fields)
    const inputs = clonedDiv.querySelectorAll("input");
    inputs.forEach((input) => (input.value = ""));
    clonedDiv.style.display = "";
    clonedDiv.children[0].textContent = name + ":";
    clonedDiv.children[1].textContent = typeof value === "number" ? value.toString() : value;
    // Create a clickable link for each game
    ContainerDiv?.appendChild(clonedDiv);
    return clonedDiv;
}
function createItemBox(item) {
    if (selectItem_template == null)
        return null;
    const clonedDiv = selectItem_template.cloneNode(true);
    // Optionally, update the cloned div (e.g., clear input fields)
    const inputs = clonedDiv.querySelectorAll("input");
    inputs.forEach((input) => (input.value = ""));
    clonedDiv.style.display = "flex";
    var itemBoxImg = clonedDiv.children[0].children[0].children[0];
    itemBoxImg.src = item.img ? item.img : "";
    itemBoxImg.alt = item.name ? item.name : "";
    var itemBoxspan = clonedDiv.children[0].children[0].children[1];
    itemBoxspan.innerHTML = item.name ? item.name : "";
    if (!item.img) {
        itemBoxImg.style.display = "none";
    }
    else {
        itemBoxspan.style.display = "none";
    }
    ;
    // Create a clickable link for each game
    items_container?.appendChild(clonedDiv);
    return clonedDiv;
}
function createBuffBox(buff, ContainerDiv, source) {
    if (buff_template == null)
        return null;
    const clonedDiv = buff_template.cloneNode(true);
    // Optionally, update the cloned div (e.g., clear input fields)
    const inputs = clonedDiv.querySelectorAll("input");
    inputs.forEach((input) => (input.value = ""));
    clonedDiv.style.display = "flex";
    var itemBoxImg = clonedDiv.children[0].children[0].children[0];
    itemBoxImg.src = buff.img ? buff.img : "";
    itemBoxImg.alt = buff.name ? buff.name : "";
    var itemBoxspan = clonedDiv.children[0].children[0].children[1];
    itemBoxspan.innerHTML = buff.name ? buff.name : "";
    var itemButton = clonedDiv.children[0].children[0];
    if (!buff.img) {
        itemBoxImg.style.display = "none";
    }
    else {
        itemBoxspan.style.display = "none";
    }
    ;
    itemButton?.addEventListener("click", () => {
        if (source) {
            source.removeBuffToBuild(buff, buff.category);
        }
        else {
            build.removeBuffToBuild(buff, buff.category);
        }
        console.log("Resetting Debuff");
        resetPage();
    });
    // Create a clickable link for each game
    ContainerDiv?.appendChild(clonedDiv);
    return clonedDiv;
}
function addHeaderToTable(atkSource, holderRows, ContainerDiv) {
    if (damageHeaderTemplate == null)
        return null;
    for (let index = 0; index < atkSource.length; index++) {
        const headerCell = damageHeaderTemplate.cloneNode(true);
        headerCell.children[0].innerHTML = (index + 1).toString();
        // Create a clickable link for each game
        ContainerDiv?.children[0].children[0].appendChild(headerCell);
        //add the da
        for (const [key, value] of Object.entries(atkSource[index])) {
            if (value === undefined)
                continue;
            addDamageToTable(key, value, holderRows, ContainerDiv);
        }
    }
}
function addDamageToTable(name, value, holderRows, ContainerDiv) {
    if (damageRowTemplate == null)
        return null;
    let clonedDiv;
    if (holderRows[name]) {
        clonedDiv = holderRows[name];
    }
    else {
        clonedDiv = damageRowTemplate.cloneNode(true);
        clonedDiv.style.display = "";
        clonedDiv.id = name;
        clonedDiv.children[0].innerHTML = name;
        ContainerDiv?.children[0].appendChild(clonedDiv);
        holderRows[name] = clonedDiv;
    }
    const headerRowCell = clonedDiv?.children[0];
    const damageValueCell = headerRowCell.cloneNode(true);
    damageValueCell.innerHTML = value.toString();
    clonedDiv?.appendChild(damageValueCell);
}
function displayStats() {
    //Create the stat Holder for reach stat
    statsContainerDiv.innerHTML = "";
    for (const [key, value] of Object.entries(build.stats)) {
        if (value === undefined)
            continue;
        createStatHolder(key, value + "%", statsContainerDiv);
    }
    perksContainerDiv.innerHTML = "";
    for (const [key, value] of Object.entries(build.perks)) {
        if (value === undefined)
            continue;
        let name = Perk.PerkStore.getByID(key)?.name || key;
        createStatHolder(name, value, perksContainerDiv);
    }
    potenciesContainerDiv.innerHTML = "";
    for (const [key, value] of Object.entries(build.potencies)) {
        if (value === undefined)
            continue;
        createStatHolder(ItemModule.potencyAliases[key], value, potenciesContainerDiv);
    }
    damageScalingsContainerDiv.innerHTML = "";
    for (const [key, value] of Object.entries(build.damageScalings)) {
        if (value === undefined)
            continue;
        createStatHolder(key, value, damageScalingsContainerDiv);
    }
    damageTypesContainerDiv.innerHTML = "";
    for (const [key, value] of Object.entries(build.damageTypes)) {
        if (value === undefined)
            continue;
        createStatHolder(key, value, damageTypesContainerDiv);
    }
    dmgModContainer.innerHTML = "";
    for (const [key, value] of Object.entries(build.damageModifications.damage_bonus_mods)) {
        createStatHolder(key + " Boost", (value * 100) + "%", dmgModContainer);
    }
    ;
    ////////////////////////////////////////////////Add the users Buffs and Debuffs to the page////////////////////////////////////////////////
    let div = document.getElementById("selectbuff");
    //Wipe Buff
    buffs_container.innerHTML = "";
    let cloneDiv = div?.cloneNode(true);
    buffs_container.appendChild(cloneDiv);
    //add the new ones
    if (build.buff) {
        for (let index = 0; index < build.buff.length; index++) {
            const buff = build.buff[index];
            //console.log(buff);
            if (!buff)
                continue;
            createBuffBox(buff, buffs_container);
        }
    }
    //Wipe deBuff
    debuffs_container.innerHTML = "";
    cloneDiv = div?.cloneNode(true);
    cloneDiv.id = "selectdebuff";
    cloneDiv.children[0].children[0].id = "addDeBuff";
    debuffs_container.appendChild(cloneDiv);
    //add the new ones
    if (build.deBuffs) {
        for (let index = 0; index < build.deBuffs.length; index++) {
            const buff = build.deBuffs[index];
            if (!buff)
                continue;
            createBuffBox(buff, debuffs_container);
        }
    }
    ////////////////////////////////////////////////Target Buffs and Debuffs to the page////////////////////////////////////////////////
    //Wipe Buff
    targetBuffs_container.innerHTML = "";
    cloneDiv = div?.cloneNode(true);
    cloneDiv.id = "selectTargetBuff";
    cloneDiv.children[0].children[0].id = "addDeBuff";
    targetBuffs_container.appendChild(cloneDiv);
    //add the new ones
    if (target.buff) {
        for (let index = 0; index < target.buff.length; index++) {
            const buff = target.buff[index];
            //console.log(buff);
            if (!buff)
                continue;
            createBuffBox(buff, targetBuffs_container, target);
        }
    }
    //Wipe deBuff
    targetDeBuffs_container.innerHTML = "";
    cloneDiv = div?.cloneNode(true);
    cloneDiv.id = "selectTargetDebuff";
    cloneDiv.children[0].children[0].id = "addDeBuff";
    targetDeBuffs_container.appendChild(cloneDiv);
    //add the new ones
    if (target.deBuffs) {
        for (let index = 0; index < target.deBuffs.length; index++) {
            const buff = target.deBuffs[index];
            if (!buff)
                continue;
            createBuffBox(buff, targetDeBuffs_container, target);
        }
    }
    setBuffEvents();
}
/////////////////////////////////////// Functions ///////////////////////////////////////
function wipeStatHolders() {
    Object.keys(build.potencies).forEach((key) => delete build.potencies[key]);
    Object.keys(build.stats).forEach((key) => delete build.stats[key]);
    Object.keys(build.effectiveBoosts).forEach((key) => delete build.effectiveBoosts[key]);
    Object.keys(build.perks).forEach((key) => delete build.perks[key]);
    Object.keys(build.damageScalings).forEach((key) => delete build.damageScalings[key]);
    Object.keys(build.damageTypes).forEach((key) => delete build.damageTypes[key]);
}
function wipeDamages(atkSource, holderRows, ContainerDiv) {
    ContainerDiv.children[0].children[0].innerHTML = "";
    const damageheader = damageHeaderTemplate.cloneNode(true);
    damageheader.id = "damage_header";
    ContainerDiv?.children[0].children[0].appendChild(damageheader);
    Object.keys(holderRows).forEach((key) => {
        holderRows[key]?.remove();
        delete holderRows[key];
    });
    atkSource.forEach((outputDamage) => {
        Object.keys(outputDamage).forEach((key) => delete outputDamage[key]);
    });
    atkSource.length = 0;
}
function removeFromBuild(key, section, enchantIndex, htmlElement) {
    if (htmlElement) {
        htmlElement.children[0].innerHTML = "Choose an enchantment";
    }
    build.removeFromBuild(key, section, enchantIndex);
    resetPage();
}
function addItemToPage(item, section, key, enchantIndex, htmlElement) {
    // //Clear out the selectItemDivs and there listeners
    // selectItemDivs.forEach(([div]) => div.remove());
    // // Clear the selectItemDivs array
    // selectItemDivs.length = 0;
    // items_selector.style.display = "none";
    build.addItemToBuild(item, section, key, enchantIndex);
    if (htmlElement) {
        htmlElement.children[0].innerHTML = item.name;
    }
    resetPage();
}
function resetPage(item) {
    ////////////////////////////////////////////////wipe the Html Elements to make way for the updates ///////////////////////////////////////////////////
    wipeStatHolders();
    //reset the Build
    build.resetBuild();
    //////////////////////// add the images to the Html pages for the item ////////////////////////
    for (const [key, element] of Object.entries(imgHolders)) {
        if (!element)
            continue;
        let parentDiv = element.parentElement;
        let spanElement = parentDiv?.children[1];
        let img = PlusSymbol;
        let name = "";
        if (key === "blade" || key == "handle" || key == "weaponArt" || key == "guild") {
            if (build[key]) {
                img = build[key].img || "";
                name = build[key].name || "";
            }
        }
        else {
            if (build.mainArmor[key]) {
                img = build.mainArmor[key].img || "";
                name = build.mainArmor[key].name || "";
            }
        }
        element.src = img;
        element.alt = name;
        spanElement.innerHTML = name;
        if (!img) {
            element.style.display = "none";
            spanElement.style.display = "block";
        }
        else {
            element.style.display = "block";
            spanElement.style.display = "none";
        }
    }
    for (const [key, element] of Object.entries(infusionImgHolders)) {
        if (!element)
            continue;
        if (!element || key === "blade" || key == "handle" || key == "weaponArt" || key == "guild")
            continue;
        element.src == build.infuseArmor[key]?.img || "";
        element.alt = build.infuseArmor[key]?.name || "";
        let parentDiv = element.parentElement;
        let spanElement = parentDiv?.children[1];
        let img = PlusSymbol;
        let name = "";
        if (build.infuseArmor[key]) {
            img = build.infuseArmor[key].img || "";
            name = build.infuseArmor[key].name || "";
        }
        element.src = img;
        element.alt = name;
        spanElement.innerHTML = name;
        if (!img) {
            element.style.display = "none";
            spanElement.style.display = "block";
        }
        else {
            element.style.display = "block";
            spanElement.style.display = "none";
        }
    }
    //////////////////////// Damage Calcautuons ////////////////////////
    //Clears the damage from the tables
    wipeDamages(build.m1, m1Rows, m1DamageTable);
    wipeDamages(build.m2, m2Rows, m2DamageTable);
    //Run the damage calculation
    helper.runDamageCalculation(build, target);
    if (build.constructionType) {
        weaponTypeText.innerHTML = "Weapon Type: " + build.constructionType;
    }
    else {
        weaponTypeText.innerHTML = "Weapon Type: None";
    }
    //////////////////////// Run the displayStats() to add show the build stats ////////////////////////
    displayStats();
    //Displays the Damages to the table
    addHeaderToTable(build.m1, m1Rows, m1DamageTable);
    addHeaderToTable(build.m2, m2Rows, m2DamageTable);
}
function loadSelectorPage(build, source, category, section, index, htmlElement) {
    //Set a Dummy Item to act has a remove
    let blankItem = new ItemModule.Item();
    blankItem.name = "none";
    blankItem.id = "none";
    blankItem.img = CloseSymbol;
    let removeItemBox = createItemBox(blankItem);
    selectItemDivs.push([removeItemBox, blankItem]);
    let key = category.toLowerCase();
    removeItemBox?.children[0].children[0].addEventListener("click", () => {
        //Clear out the selectItemDivs and there listeners
        selectItemDivs.forEach(([div]) => div.remove());
        // Clear the selectItemDivs array
        selectItemDivs.length = 0;
        //reset the items selector element to none
        items_selector.style.display = "none";
        removeFromBuild(key, section, index, htmlElement);
    });
    //Get the actual items
    let items;
    if (source == "Items") {
        if (section === "enchantments") {
            items = ItemModule.ItemStore.getByCategory("Enchantment");
        }
        else {
            items = ItemModule.ItemStore.getByCategory(category);
        }
    }
    else if (source == "Buffs") {
        items = BuffModule.BuffStore.getByCategory(category);
    }
    else if (source == "Guilds") {
        items = GuildModule.GuildStore.all();
    }
    items?.forEach((item) => {
        let itemBox = createItemBox(item);
        if (!itemBox)
            return;
        selectItemDivs.push([itemBox, item]);
    });
    selectItemDivs.forEach(([itemBox, item]) => {
        if (itemBox != removeItemBox) {
            var itemBoxButton = itemBox.children[0].children[0];
            itemBoxButton.addEventListener("click", () => {
                //Clear out the selectItemDivs and there listeners
                selectItemDivs.forEach(([div]) => div.remove());
                // Clear the selectItemDivs array
                selectItemDivs.length = 0;
                items_selector.style.display = "none";
                if (item instanceof ItemModule.Item || item instanceof GuildModule.Guild) {
                    addItemToPage(item, section, key, index, htmlElement);
                }
                else if (item instanceof BuffModule.Buff) {
                    build.addBuffToBuild(item);
                    resetPage();
                }
            });
        }
    });
    items_selector.style.display = "flex";
}

///////////////////////////////////////Button & input Listeners///////////////////////////////////////
SelectorClose.addEventListener("click", () => {
    selectItemDivs.forEach(([div]) => div.remove());
    // Clear the selectItemDivs array
    selectItemDivs.length = 0;
    items_selector.style.display = "none";
});
showInfusions.addEventListener("click", () => {
    mainGearContentDiv.style.display = "none";
    infusionsContentDiv.style.display = "flex";
});
showMainGear.addEventListener("click", () => {
    infusionsContentDiv.style.display = "none";
    mainGearContentDiv.style.display = "flex";
});

levelInput.addEventListener("change", () => {
    let level = Number(levelInput.value);
    level = Math.floor(level);
    if (level > 80) {
        level = 80;
    }
    else if (level < 1) {
        level = 1;
    }
    levelInput.value = level.toString();
    build.level = level;
    resetPage();
});

theme_Selector_input.addEventListener("change", () => {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    if (newTheme === "dark") {
        PlusSymbol = "/VoxelBladeBuildMaker/image/plus_symbol_white.png";
        CloseSymbol = "/VoxelBladeBuildMaker/image/close_X_white.png";
    }
    else {
        PlusSymbol = "/VoxelBladeBuildMaker/image/plus_symbol_black.png";
        CloseSymbol = "/VoxelBladeBuildMaker/image/close_X_black.png";
    }
    document.documentElement.setAttribute("data-theme", newTheme);
    setItemButtonImage();
    resetPage();
});

promotionSelector.addEventListener("change", () => {
    let promotion = Number(promotionSelector.value);
    build.guildPromotion = Number(promotion - 1);
    resetPage();
});


///////////////////////////////////////Add the Items///////////////////////////////////////
function setItemButtonImage() {
    mainGearButtons.forEach((itembutton) => {
        let buttonImage = itembutton.children[0];
        buttonImage.src = PlusSymbol;
    });
    infuseGearButtons.forEach((itembutton) => {
        let buttonImage = itembutton.children[0];
        buttonImage.src = PlusSymbol;
    });
    weaponMakeUpButtons.forEach((itembutton) => {
        let buttonImage = itembutton.children[0];
        buttonImage.src = PlusSymbol;
    });
    let guildImage = guildSelector.children[0];
    guildImage.src = PlusSymbol;
}

mainGearButtons.forEach((itembutton) => {
    let buttonImage = itembutton.children[0];
    buttonImage.src = PlusSymbol;
    itembutton.addEventListener("click", () => {
        loadSelectorPage(build, "Items", itembutton.name, "mainArmor");
    });
    let itemBox = itembutton.parentElement?.parentElement;
    let enchantmentsContainer = itemBox.children[1];
    for (let index = 0; index < enchantmentsContainer.children.length; index++) {
        const enchantSelector = enchantmentsContainer.children[index];
        enchantSelector.addEventListener("click", () => {
            loadSelectorPage(build, "Items", enchantSelector.name, "enchantments", index, enchantSelector);
        });
    }
    let showEnchantments = itemBox.children[0].children[2];
    showEnchantments.addEventListener("click", () => {
        if (enchantmentsContainer.style.display === "flex") {
            enchantmentsContainer.style.display = "none";
            itemBox.children[2].style.display = "flex";
        }
        else {
            itemBox.children[2].style.display = "none";
            enchantmentsContainer.style.display = "flex";
        }
    });
    let upgradeSelector = itemBox.children[0].children[3];
    upgradeSelector.addEventListener("change", (event) => {
        let upgradeNumber = upgradeSelector.value;
        let key = upgradeSelector.name.toLowerCase();
        if (!key || !upgradeNumber || !build.mainArmor[key])
            return;
        build.mainArmor[key].upgrade = Number(upgradeNumber);
        resetPage();
    });
});

infuseGearButtons.forEach((itembutton) => {
    let buttonImage = itembutton.children[0];
    buttonImage.src = PlusSymbol;
    itembutton.addEventListener("click", () => {
        loadSelectorPage(build, "Items", itembutton.name, "infuseArmor");
    });
});
weaponMakeUpButtons.forEach((itembutton) => {
    let buttonImage = itembutton.children[0];
    buttonImage.src = PlusSymbol;
    itembutton.addEventListener("click", () => {
        loadSelectorPage(build, "Items", itembutton.name);
    });
});
guildSelector.addEventListener("click", () => {
    loadSelectorPage(build, "Guilds", "Guild");
});

//////////////////////////Set the add buff/Debuff buttons//////////////////////////
function setBuffEvents() {
    const selectBuff = document.getElementById("selectbuff");
    const selectDebuff = document.getElementById("selectdebuff");
    const selectTargetBuff = document.getElementById("selectTargetBuff");
    const selectTargetDebuff = document.getElementById("selectTargetDebuff");
    selectBuff.children[0].children[0].children[0].src = PlusSymbol;
    selectBuff?.addEventListener("click", () => {loadSelectorPage(build, "Buffs", "Buff");});
    selectDebuff.children[0].children[0].children[0].src = PlusSymbol;
    selectDebuff?.addEventListener("click", () => {loadSelectorPage(build, "Buffs", "Debuff");});
    selectTargetBuff.children[0].children[0].children[0].src = PlusSymbol;
    selectTargetBuff?.addEventListener("click", () => {loadSelectorPage(target, "Buffs", "Buff");});
    selectTargetDebuff.children[0].children[0].children[0].src = PlusSymbol;
    selectTargetDebuff?.addEventListener("click", () => {loadSelectorPage(target, "Buffs", "Debuff");});
}
///////////////////////////////////////Clear out the items///////////////////////////////////////
infuseClearButtons.forEach((clearbutton) => {
    clearbutton.addEventListener("click", () => {
        removeFromBuild(clearbutton.name, "infuseArmor");
    });
});
clearItemButtons.forEach((clearbutton) => {
    clearbutton.addEventListener("click", () => {
        removeFromBuild(clearbutton.name, "mainArmor");
    });
});
weaponClearButtons.forEach((clearbutton) => {
    clearbutton.addEventListener("click", () => {
        removeFromBuild(clearbutton.name, undefined);
    });
});
document.getElementById("guild_clear_button")?.addEventListener("click", () => {
    removeFromBuild("guild", undefined);
});
setItemButtonImage();
setBuffEvents();
