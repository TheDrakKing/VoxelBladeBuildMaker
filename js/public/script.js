import * as ItemModule from "../models/Item.js";
import * as helper from "./helper.js";
//Buttons
const infuseGearButtons = document.querySelectorAll('.infuseGear');
const mainGearButtons = document.querySelectorAll('.mainGear');
const weaponMakeUpButtons = document.querySelectorAll('.weaponMakeUp');
const clearItemButtons = document.querySelectorAll('.clear_button');
const infuseClearButtons = document.querySelectorAll('.infuse_clear_button');
const weaponClearButtons = document.querySelectorAll('.weapon_clear_button');
const showInfusions = document.getElementById("showInfusions");
const showMainGear = document.getElementById("showMainGear");
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
const selectItem_template = document.getElementById("selectItem_template");
const statHolder_template = document.getElementById("statHolder_template");
//Armor
const headDiv = document.getElementById("headDiv");
const chestplateDiv = document.getElementById("chestplateDiv");
const leggingsDiv = document.getElementById("leggingsDiv");
const runeDiv = document.getElementById("runeDiv");
const ringDiv = document.getElementById("ringDiv");
//Weapon
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
// Create the build object
let build = {
    mainArmor: {},
    infuseArmor: {},
    enchantments: {},
    level: 1,
    potencies: {},
    stats: {},
    effectiveBoosts: {},
    perks: {},
    damageScalings: {},
    damageTypes: {},
    totEffBoost: 0,
    m1: [],
    m2: []
};
let infusionImgHolders = {
    helmet: infuseHeadDiv.children[1].children[0].children[0],
    chestplate: infuseChestplateDiv.children[1].children[0].children[0],
    legging: infuseLeggingsDiv.children[1].children[0].children[0],
    rune: infuseRuneDiv.children[1].children[0].children[0],
    ring: infuseRingDiv.children[1].children[0].children[0],
};
let imgHolders = {
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
    clonedDiv.children[1].textContent = value.toString();
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
    itemBoxImg.alt = item.name;
    // Create a clickable link for each game
    items_container?.appendChild(clonedDiv);
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
        createStatHolder(key, value, statsContainerDiv);
    }
    perksContainerDiv.innerHTML = "";
    for (const [key, value] of Object.entries(build.perks)) {
        if (value === undefined)
            continue;
        createStatHolder(key, value, perksContainerDiv);
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
}
/////////////////////////////////////// Functions ///////////////////////////////////////
function addItemToBuild(item, isInfuse, key) {
    // Loop through the stats using Object.entries
    if (item) {
        if (item.stats) {
            let stats = Object.assign({}, item.stats);
            //Assign the upgrade to the armor
            stats = helper.calculateUpgrade(stats, item?.upgrade || 0);
            //Add armor Enchantments Before add to over build
            if (item.category == "Armor" && key && !isInfuse) {
                if (build.enchantments[key]) {
                    for (let index = 0; index < build.enchantments[key].length; index++) {
                        if (!build.enchantments[key][index])
                            continue;
                        const enchantment = build.enchantments[key][index];
                        if (!enchantment.onArmorStatModified)
                            continue;
                        let args = [1, stats];
                        enchantment.onArmorStatModified.apply(build, args);
                    }
                }
            }
            //Adds the stats to the Build
            for (const [key, value] of Object.entries(stats)) {
                // key is a string, value is a number or undefined
                if (value === undefined)
                    continue;
                let amount = value;
                let previousValue = build.stats[key];
                if (isInfuse)
                    amount = value / 2;
                build.stats[key] = previousValue ? previousValue + amount : amount;
            }
        }
        if (item.perks) {
            for (const [key, value] of Object.entries(item.perks)) {
                // key is a string, value is a number or undefined
                if (value === undefined)
                    continue;
                let previousValue = build.perks[key];
                build.perks[key] = previousValue ? previousValue + value : value;
            }
        }
        if (item.potencies) {
            for (const [key, value] of Object.entries(item.potencies)) {
                // key is a string, value is a number or undefined
                if (value === undefined)
                    continue;
                let previousValue = build.potencies[key];
                build.potencies[key] = previousValue ? previousValue + value : value;
            }
        }
        if (item.damageScalings) {
            for (const [key, value] of Object.entries(item.damageScalings)) {
                // key is a string, value is a number or undefined
                if (value === undefined)
                    continue;
                let previousValue = build.damageScalings[key];
                build.damageScalings[key] = previousValue ? previousValue + value : value;
            }
        }
        if (item.damageTypes) {
            for (const [key, value] of Object.entries(item.damageTypes)) {
                // key is a string, value is a number or undefined
                if (value === undefined)
                    continue;
                let previousValue = build.damageTypes[key];
                build.damageTypes[key] = previousValue ? previousValue + value : value;
            }
        }
    }
}
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
function updateBuild(item, section, action, key, enchantIndex, htmlElement) {
    //Clear out the selectItemDivs and there listeners
    selectItemDivs.forEach(([div]) => div.remove());
    // Clear the selectItemDivs array
    selectItemDivs.length = 0;
    items_selector.style.display = "none";
    if (section !== "enchantments") {
        if (typeof item == "string") {
            key = item.toLowerCase();
        }
        else if (item instanceof ItemModule.Item) {
            key = item.category === "Armor" ? item.type?.toLowerCase() : item.category?.toLowerCase();
        }
    }
    if (action == "remove" && key) {
        if (key == "blade" || key == "handle" || key == "weaponArt") {
            delete build[key];
            imgHolders[key].src = "/image/Plus_symbol.png";
            imgHolders[key].alt = "add Item";
        }
        else if (section) {
            if (section == "infuseArmor" || section == "mainArmor") {
                delete build[section][key];
                if (section == "infuseArmor") {
                    infusionImgHolders[key].src = "/image/Plus_symbol.png";
                    infusionImgHolders[key].alt = "add Item";
                }
                else {
                    imgHolders[key].src = "/image/Plus_symbol.png";
                    imgHolders[key].alt = "add Item";
                }
            }
            else if (section === "enchantments" && enchantIndex != undefined) {
                if (!build.enchantments[key])
                    return;
                delete build.enchantments[key][enchantIndex];
                if (htmlElement) {
                    htmlElement.children[0].innerHTML = "Choose an enchantment";
                }
            }
        }
        else {
            return;
        }
    }
    else if (item && key) {
        if (item instanceof ItemModule.Item) {
            if (key == "blade" || key == "handle" || key == "weaponArt") {
                build[key] = item;
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
                    if (!build.enchantments[key])
                        build.enchantments[key] = [];
                    build.enchantments[key][enchantIndex] = item;
                    if (htmlElement) {
                        htmlElement.children[0].innerHTML = item.name;
                    }
                }
            }
        }
        else {
            return;
        }
    }
    wipeStatHolders();
    build.totEffBoost = 0;
    ////////////////////////////////////////////////Add the Item stats, perks etc to the stat containers///////////////////////////////////////////////////
    if (build.blade)
        addItemToBuild(build.blade);
    if (build.handle)
        addItemToBuild(build.handle);
    if (build.weaponArt)
        addItemToBuild(build.weaponArt);
    for (const [key, value] of Object.entries(build.enchantments)) {
        // key is a string, value is a number or undefined
        if (value === undefined)
            continue;
        for (let index = 0; index < value.length; index++) {
            const enchantment = value[index];
            addItemToBuild(enchantment);
        }
    }
    for (const [key, value] of Object.entries(build.infuseArmor)) {
        if (value === undefined)
            continue;
        addItemToBuild(value, true);
    }
    for (const [key, value] of Object.entries(build.mainArmor)) {
        if (value === undefined)
            continue;
        addItemToBuild(value, false, key);
    }
    addItemToBuild(); // incase none of the others did run
    //////////////////////// Enchants activation ////////////////////////
    for (const [key, value] of Object.entries(build.enchantments)) {
        // key is a string, value is a number or undefined
        if (value === undefined)
            continue;
        for (let index = 0; index < value.length; index++) {
            if (!value[index])
                continue;
            const enchantment = value[index];
            if (!enchantment.onStatCalculation || !build.mainArmor[key])
                continue;
            enchantment.onStatCalculation.apply(build);
        }
    }
    //////////////////////// Perk activation ////////////////////////
    displayStats();
    //Clears the damage from the tables
    wipeDamages(build.m1, m1Rows, m1DamageTable);
    wipeDamages(build.m2, m2Rows, m2DamageTable);
    //Rune the damage calculation
    build.constructionType = undefined;
    helper.runDamageCalculation(build);
    if (build.constructionType) {
        weaponTypeText.innerHTML = "Weapon Type: " + build.constructionType;
    }
    else {
        weaponTypeText.innerHTML = "Weapon Type: None";
    }
    ;
    //Displays the Damages to the table
    addHeaderToTable(build.m1, m1Rows, m1DamageTable);
    addHeaderToTable(build.m2, m2Rows, m2DamageTable);
}
function loadSelectorPage(category, section, index, htmlElement) {
    let items;
    if (section === "enchantments") {
        items = ItemModule.ItemStore.getByCategory("Enchantment");
    }
    else {
        items = ItemModule.ItemStore.getByCategory(category);
    }
    let blankItem = new ItemModule.Item();
    blankItem.name = "none";
    blankItem.id = "none";
    blankItem.img = "image/Plus_symbol.png";

    let removeItemBox = createItemBox(blankItem);
    selectItemDivs.push([removeItemBox, blankItem]);
    let key = category.toLowerCase();
    removeItemBox?.children[0].children[0].addEventListener("click", () => {
        updateBuild(category, section, "remove", key, index, htmlElement);
    });
    items.forEach((item) => {
        let itemBox = createItemBox(item);
        if (!itemBox)
            return;
        selectItemDivs.push([itemBox, item]);
    });
    selectItemDivs.forEach(([itemBox, item]) => {
        if (itemBox != removeItemBox) {
            var itemBoxButton = itemBox.children[0].children[0];
            itemBoxButton.addEventListener("click", () => {
                updateBuild(item, section, undefined, key, index, htmlElement);
            });
        }
    });
    items_selector.style.display = "flex";
}
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
    updateBuild();
});
///////////////////////////////////////Add the Items///////////////////////////////////////
mainGearButtons.forEach((itembutton) => {
    itembutton.addEventListener("click", () => {
        loadSelectorPage(itembutton.name, "mainArmor");
    });
    let itemBox = itembutton.parentElement?.parentElement;
    let enchantmentsContainer = itemBox.children[1];
    for (let index = 0; index < enchantmentsContainer.children.length; index++) {
        const enchantSelector = enchantmentsContainer.children[index];
        enchantSelector.addEventListener("click", () => {
            loadSelectorPage(enchantSelector.name, "enchantments", index, enchantSelector);
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
    upgradeSelector.addEventListener('change', (event) => {
        let upgradeNumber = upgradeSelector.value;
        let key = upgradeSelector.name.toLowerCase();
        if (!key || !upgradeNumber || !build.mainArmor[key])
            return;
        build.mainArmor[key].upgrade = Number(upgradeNumber);
        updateBuild();
    });
});
infuseGearButtons.forEach((itembutton) => {
    itembutton.addEventListener("click", () => {
        loadSelectorPage(itembutton.name, "infuseArmor");
    });
});
weaponMakeUpButtons.forEach((itembutton) => {
    itembutton.addEventListener("click", () => {
        loadSelectorPage(itembutton.name);
    });
});
///////////////////////////////////////Clear out the items///////////////////////////////////////
infuseClearButtons.forEach((clearbutton) => {
    clearbutton.addEventListener("click", () => {
        updateBuild(clearbutton.name, "infuseArmor", "remove");
    });
});
clearItemButtons.forEach((clearbutton) => {
    clearbutton.addEventListener("click", () => {
        updateBuild(clearbutton.name, "mainArmor", "remove");
    });
});
weaponClearButtons.forEach((clearbutton) => {
    clearbutton.addEventListener("click", () => {
        updateBuild(clearbutton.name, undefined, "remove");
    });
});
