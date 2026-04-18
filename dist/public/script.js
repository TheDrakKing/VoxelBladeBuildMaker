import * as ItemModule from "../models/Item.js";
import * as BuffModule from "../models/Buffs.js";
import * as Build from "../models/Build.js";
import * as helper from "./helper.js";
import * as Perk from "../models/Perk.js";
import * as GuildModule from "../models/Guild.js";
import * as RaceModule from "../models/Race.js";
import * as WeaponArtModule from "../models/WeaponArt.js";
//Buttons
const infuseGearButtons = document.querySelectorAll('.infuseGear');
const mainGearButtons = document.querySelectorAll('.mainGear');
const weaponMakeUpButtons = document.querySelectorAll('.weaponMakeUp');
const clearItemButtons = document.querySelectorAll('.clear_button');
const infuseClearButtons = document.querySelectorAll('.infuse_clear_button');
const weaponClearButtons = document.querySelectorAll('.weapon_clear_button');
const guildSelector = document.getElementById("guild_selector");
const promotionSelector = document.getElementById("guild_promotion");
const raceSelector = document.getElementById("race_selector");
const clearBuildButton = document.getElementById("clear_build_button");
const importBuildButton = document.getElementById("import_build_button");
const exportBuildButton = document.getElementById("export_build_button");
const importBuildInput = document.getElementById("import_build_input");
const showInfusions = document.getElementById("showInfusions");
const showMainGear = document.getElementById("showMainGear");
const theme_Selector_input = document.getElementById("theme_Selector_input");
//Level, Hp and Weapon Txt
const weaponTypeText = document.getElementById("weapon_type_text");
const healthInput = document.getElementById("hpValue");
const levelInput = document.getElementById("levelValue");
const atkSpeInput = document.getElementById("atkSpeValue");
//Containers
const infusionsContentDiv = document.getElementById("infusions_gear");
const mainGearContentDiv = document.getElementById("main_gear");
const weaponContentDiv = document.getElementById("weaponDiv");
const items_selector = document.getElementById("itemsSelectorDiv");
const SelectorClose = document.getElementById("close_items_selector");
const itemsSelectorTitle = items_selector.querySelector(".items_selector_top h3");
const itemsSearchInput = document.getElementById("items_search_input");
const items_container = document.getElementById("itemsContainer");
const dmgModContainer = document.getElementById("damageModifications");
const dmgReducedModContainer = document.getElementById("damageReducedModifications");
const specificDmgBonusContainer = document.getElementById("specificDamageBonusModifications");
const specificDmgReducedContainer = document.getElementById("specificDamageReducedModifications");
const critModContainer = document.getElementById("critModifications");
const specialModContainer = document.getElementById("specialModifications");
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
const perkDamageContainerDiv = document.getElementById("perk_damage");
const runeDamageContainerDiv = document.getElementById("rune_damage");
const weaponArtDamageContainerDiv = document.getElementById("weaponart_damage");
//Table
const m1DamageTable = document.getElementById("m1_damage_table");
const m2DamageTable = document.getElementById("m2_damage_table");
const damageHeaderTemplate = document.getElementById("damage_header");
const damageRowTemplate = document.getElementById("damage_row_template");
//images
const appRootUrl = new URL("../", window.location.href);
function resolveAssetPath(path) {
    if (!path)
        return "";
    if (/^(?:[a-z]+:)?\/\//i.test(path) || path.startsWith("data:"))
        return path;
    const normalizedPath = path
        .replace(/^\/+/, "")
        .replace(/^(\.\.\/)+/, "");
    return new URL(normalizedPath, appRootUrl).href;
}
let PlusSymbol = resolveAssetPath("image/plus_symbol_white.png");
let CloseSymbol = resolveAssetPath("image/close_X_white.png");
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
    weaponart: weaponArtDiv.children[1].children[0].children[0],
};
let m1Rows = {};
let m2Rows = {};
const selectItemDivs = [];
let activeSelectorContext = null;
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
function displayDamageModificationGroup(modifications, container, suffix) {
    container.innerHTML = "";
    for (const [key, value] of Object.entries(modifications)) {
        const label = suffix ? `${key} ${suffix}` : key;
        createStatHolder(label, (value * 100) + "%", container);
    }
}
function createNonWeaponDamageSection(title, containerDiv) {
    const sectionDiv = document.createElement("div");
    sectionDiv.className = "non_weapon_damage_section";
    const titleSpan = document.createElement("span");
    titleSpan.className = "non_weapon_damage_section_title";
    titleSpan.textContent = title;
    sectionDiv.appendChild(titleSpan);
    containerDiv.appendChild(sectionDiv);
    return sectionDiv;
}
function createNonWeaponDamageCard(entry, containerDiv) {
    const cardDiv = document.createElement("div");
    cardDiv.className = "non_weapon_damage_card";
    const cardTitle = document.createElement("span");
    cardTitle.className = "non_weapon_damage_card_title";
    cardTitle.textContent = entry.source;
    cardDiv.appendChild(cardTitle);
    const damageTable = document.createElement("div");
    damageTable.className = "non_weapon_damage_table";
    const headerRow = document.createElement("div");
    headerRow.className = "non_weapon_damage_row non_weapon_damage_row_header";
    const typeHeader = document.createElement("span");
    typeHeader.textContent = "Damage Type";
    const valueHeader = document.createElement("span");
    valueHeader.textContent = "Damage";
    headerRow.appendChild(typeHeader);
    headerRow.appendChild(valueHeader);
    damageTable.appendChild(headerRow);
    for (const [damageType, value] of Object.entries(entry.outputs)) {
        if (value === undefined)
            continue;
        const damageRow = document.createElement("div");
        damageRow.className = "non_weapon_damage_row";
        const typeSpan = document.createElement("span");
        typeSpan.textContent = damageType;
        const valueSpan = document.createElement("span");
        valueSpan.textContent = value.toString();
        damageRow.appendChild(typeSpan);
        damageRow.appendChild(valueSpan);
        damageTable.appendChild(damageRow);
    }
    const totalRow = document.createElement("div");
    totalRow.className = "non_weapon_damage_row non_weapon_damage_total_row";
    const totalLabel = document.createElement("span");
    totalLabel.textContent = "Total";
    const totalValue = document.createElement("span");
    totalValue.textContent = entry.total.toString();
    totalRow.appendChild(totalLabel);
    totalRow.appendChild(totalValue);
    damageTable.appendChild(totalRow);
    cardDiv.appendChild(damageTable);
    containerDiv.appendChild(cardDiv);
}
function renderNonWeaponDamages(entries) {
    perkDamageContainerDiv.innerHTML = "";
    const perkEntries = entries.filter((entry) => entry.category === "Perk");
    const debuffEntries = entries.filter((entry) => entry.category === "Debuff");
    if (perkEntries.length) {
        const perkSection = createNonWeaponDamageSection("Perk Damages", perkDamageContainerDiv);
        perkEntries.forEach((entry) => createNonWeaponDamageCard(entry, perkSection));
    }
    if (debuffEntries.length) {
        const debuffSection = createNonWeaponDamageSection("Debuff Damages", perkDamageContainerDiv);
        debuffEntries.forEach((entry) => createNonWeaponDamageCard(entry, debuffSection));
    }
}
function renderDirectDamagePanel(item, damageResult, options) {
    options.containerDiv.innerHTML = "";
    if (!item) {
        createStatHolder("Status", options.emptyMessage, options.containerDiv);
        return;
    }
    if (damageResult) {
        const cardEntry = {
            source: item.name || options.title,
            outputs: damageResult.outputs,
            total: damageResult.total,
            category: options.category,
        };
        createNonWeaponDamageCard(cardEntry, options.containerDiv);
        return;
    }
    createStatHolder(options.title, item.name || options.title, options.containerDiv);
    createStatHolder("Description", item.description || options.noDamageMessage, options.containerDiv);
}
function renderRunePanel(rune, damageResult) {
    renderDirectDamagePanel(rune, damageResult, {
        category: "Rune",
        containerDiv: runeDamageContainerDiv,
        emptyMessage: "No rune selected",
        noDamageMessage: "This rune does not have direct damage data.",
        title: "Rune",
    });
}
function renderWeaponArtPanel(weaponArt, damageResult) {
    renderDirectDamagePanel(weaponArt, damageResult, {
        category: "WeaponArt",
        containerDiv: weaponArtDamageContainerDiv,
        emptyMessage: "No weapon art selected",
        noDamageMessage: "This weapon art does not deal direct damage.",
        title: "Weapon Art",
    });
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
    itemBoxImg.src = item.img ? resolveAssetPath(item.img) : "";
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
function setSelectorItemHover(button, item) {
    button.addEventListener("mouseenter", () => {
        if ("id" in item && item.id === "none")
            return;
        if (item instanceof BuffModule.Buff) {
            buffHover(item);
        }
        else if (item instanceof WeaponArtModule.WeaponArt) {
            weaponArtHover(item);
        }
        else if (item instanceof GuildModule.Guild) {
            guildHover(item);
        }
        else {
            mouseHover(item);
        }
    });
    button.addEventListener("mouseleave", () => {
        mouseLeave();
    });
}
function createSourceOptionBox(sourceId, sourceData) {
    if (selectItem_template == null)
        return null;
    const clonedDiv = selectItem_template.cloneNode(true);
    clonedDiv.style.display = "flex";
    clonedDiv.classList.add("source_option_box");
    const itemBoxImg = clonedDiv.children[0].children[0].children[0];
    itemBoxImg.style.display = "none";
    const itemBoxspan = clonedDiv.children[0].children[0].children[1];
    itemBoxspan.style.display = "block";
    itemBoxspan.innerHTML = `
    <span class="source_option_name">${sourceData.sourceName}</span>
    <span class="source_option_meta">${sourceData.type}</span>
    <span class="source_option_meta">Innate Potency: ${sourceData.inatePotency}</span>
  `;
    items_container?.appendChild(clonedDiv);
    return clonedDiv;
}
function clearSelectorItems() {
    selectItemDivs.forEach(([div]) => div.remove());
    selectItemDivs.length = 0;
}
function hideSelector() {
    clearSelectorItems();
    activeSelectorContext = null;
    itemsSearchInput.value = "";
    itemsSearchInput.style.display = "";
    itemsSelectorTitle.textContent = "Select an Item";
    document.body.classList.remove("selector-open");
    document.body.classList.remove("selector-tooltip-visible");
    items_selector.style.display = "none";
}
function normalizeFilterValue(value) {
    return value.toLowerCase().trim().replace(/[\s-]+/g, "_");
}
function exportCurrentBuild() {
    const buildJson = build.buildToJson();
    const buildBlob = new Blob([buildJson], { type: "application/json" });
    const buildUrl = URL.createObjectURL(buildBlob);
    const downloadLink = document.createElement("a");
    const date = new Date().toISOString().slice(0, 10);
    downloadLink.href = buildUrl;
    downloadLink.download = `voxel-build-${date}.json`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(buildUrl);
}
async function importBuildFromFile(file) {
    if (!file)
        return;
    try {
        const fileText = await file.text();
        const parsedBuild = JSON.parse(fileText);
        build = Build.Build.dictToBuild(parsedBuild);
        build.target = target;
        hideSelector();
        resetPage();
    }
    catch (error) {
        console.error("Could not import build", error);
        window.alert("Could not import that build file.");
    }
    finally {
        importBuildInput.value = "";
    }
}
function showBuffSourceSelector(buff, sourceOptions, sourceBuild) {
    clearSelectorItems();
    activeSelectorContext = null;
    itemsSearchInput.value = "";
    itemsSearchInput.style.display = "none";
    itemsSelectorTitle.textContent = `Select a Source for ${buff.name}`;
    Object.entries(sourceOptions).forEach(([sourceId, sourceData]) => {
        const sourceOption = {
            sourceName: sourceData.sourceName,
            type: sourceData.type,
            inatePotency: sourceData.inatePotency,
        };
        const sourceBox = createSourceOptionBox(sourceId, sourceOption);
        if (!sourceBox)
            return;
        selectItemDivs.push([sourceBox, sourceOption]);
        const sourceButton = sourceBox.children[0].children[0];
        sourceButton.addEventListener("click", () => {
            buff.setSourceData(sourceId, sourceData.type, sourceData.inatePotency);
            sourceBuild.addBuffToBuild(buff);
            hideSelector();
            resetPage();
        });
    });
    items_selector.style.display = "flex";
    document.body.classList.add("selector-open");
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
    itemBoxImg.src = buff.img ? resolveAssetPath(buff.img) : "";
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
        mouseLeave();
        console.log("Resetting Debuff");
        resetPage();
    });
    itemButton?.addEventListener("mouseenter", () => {
        buffHover(buff);
    });
    itemButton?.addEventListener("mouseleave", () => {
        mouseLeave();
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
function mouseHover(item, itemType) {
    const itemHoverInfoDiv = document.getElementById("itemHoverInfoDiv");
    if (!itemHoverInfoDiv)
        return;
    let itemName = itemHoverInfoDiv.children[0];
    itemName.innerHTML = item.name;
    let hoverDescription = itemHoverInfoDiv.children[1];
    hoverDescription.innerHTML = item.description || "";
    if (item.attackSpeed) {
        createStatHolder("AttackSpeed", item.attackSpeed.toString(), hoverDescription);
    }
    let hoverDmgScaleDiv = itemHoverInfoDiv.children[2];
    hoverDmgScaleDiv.style.display = "none";
    hoverDmgScaleDiv.innerHTML = "";
    if (item.damageScalings) {
        for (const [key, value] of Object.entries(item.damageScalings)) {
            if (value === undefined)
                continue;
            hoverDmgScaleDiv.style.display = "block";
            createStatHolder(key, value, hoverDmgScaleDiv);
        }
    }
    let hoverDmgTypeDiv = itemHoverInfoDiv.children[3];
    hoverDmgTypeDiv.style.display = "none";
    hoverDmgTypeDiv.innerHTML = "";
    if (item.damageTypes) {
        for (const [key, value] of Object.entries(item.damageTypes)) {
            if (value === undefined)
                continue;
            hoverDmgTypeDiv.style.display = "block";
            createStatHolder(key, value, hoverDmgTypeDiv);
        }
    }
    let hoverStatsDiv = itemHoverInfoDiv.children[4];
    hoverStatsDiv.style.display = "none";
    hoverStatsDiv.innerHTML = "";
    if (item.stats) {
        for (const [key, value] of Object.entries(item.stats)) {
            if (value === undefined)
                continue;
            hoverStatsDiv.style.display = "block";
            createStatHolder(key, value + "%", hoverStatsDiv);
        }
    }
    let hoverPerksDiv = itemHoverInfoDiv.children[5];
    hoverPerksDiv.style.display = "none";
    hoverPerksDiv.innerHTML = "";
    if (item.perks) {
        for (const [key, value] of Object.entries(item.perks)) {
            if (value === undefined)
                continue;
            hoverPerksDiv.style.display = "block";
            let name = Perk.PerkStore.getByID(key)?.name || key;
            createStatHolder(name, value, hoverPerksDiv);
        }
    }
    let hoverPotenciesDiv = itemHoverInfoDiv.children[6];
    hoverPotenciesDiv.style.display = "none";
    hoverPotenciesDiv.innerHTML = "";
    if (item.potencies) {
        for (const [key, value] of Object.entries(item.potencies)) {
            if (value === undefined)
                continue;
            hoverPotenciesDiv.style.display = "block";
            createStatHolder(ItemModule.potencyAliases[key], value, hoverPotenciesDiv);
        }
    }
    document.body.classList.add("selector-tooltip-visible");
    itemHoverInfoDiv.style.display = "flex";
}
function perkHover(perk, value) {
    const itemHoverInfoDiv = document.getElementById("itemHoverInfoDiv");
    if (!itemHoverInfoDiv)
        return;
    let itemName = itemHoverInfoDiv.children[0];
    itemName.innerHTML = perk.name || "";
    let hoverDescription = itemHoverInfoDiv.children[1];
    hoverDescription.innerHTML = perk.description || "";
    let hoverDmgScaleDiv = itemHoverInfoDiv.children[2];
    hoverDmgScaleDiv.style.display = "none";
    hoverDmgScaleDiv.innerHTML = "";
    let hoverDmgTypeDiv = itemHoverInfoDiv.children[3];
    hoverDmgTypeDiv.style.display = "none";
    hoverDmgTypeDiv.innerHTML = "";
    let hoverStatsDiv = itemHoverInfoDiv.children[4];
    hoverStatsDiv.style.display = "none";
    hoverStatsDiv.innerHTML = "";
    if (value !== undefined) {
        hoverStatsDiv.style.display = "block";
        createStatHolder("Perk Level", value, hoverStatsDiv);
    }
    let hoverPerksDiv = itemHoverInfoDiv.children[5];
    hoverPerksDiv.style.display = "none";
    hoverPerksDiv.innerHTML = "";
    let hoverPotenciesDiv = itemHoverInfoDiv.children[6];
    hoverPotenciesDiv.style.display = "none";
    hoverPotenciesDiv.innerHTML = "";
    document.body.classList.add("selector-tooltip-visible");
    itemHoverInfoDiv.style.display = "flex";
}
function buffHover(buff) {
    const itemHoverInfoDiv = document.getElementById("itemHoverInfoDiv");
    if (!itemHoverInfoDiv)
        return;
    let itemName = itemHoverInfoDiv.children[0];
    itemName.innerHTML = buff.name || "";
    let hoverDescription = itemHoverInfoDiv.children[1];
    hoverDescription.innerHTML = buff.category || "";
    let hoverDmgScaleDiv = itemHoverInfoDiv.children[2];
    hoverDmgScaleDiv.style.display = "none";
    hoverDmgScaleDiv.innerHTML = "";
    if (buff.damageScalings) {
        for (const [key, value] of Object.entries(buff.damageScalings)) {
            if (value === undefined)
                continue;
            hoverDmgScaleDiv.style.display = "block";
            createStatHolder(key, value, hoverDmgScaleDiv);
        }
    }
    let hoverDmgTypeDiv = itemHoverInfoDiv.children[3];
    hoverDmgTypeDiv.style.display = "none";
    hoverDmgTypeDiv.innerHTML = "";
    if (buff.damageTypes) {
        for (const [key, value] of Object.entries(buff.damageTypes)) {
            if (value === undefined)
                continue;
            hoverDmgTypeDiv.style.display = "block";
            createStatHolder(key, value, hoverDmgTypeDiv);
        }
    }
    let hoverStatsDiv = itemHoverInfoDiv.children[4];
    hoverStatsDiv.style.display = "none";
    hoverStatsDiv.innerHTML = "";
    hoverStatsDiv.style.display = "block";
    createStatHolder("Base Duration", buff.baseDuration, hoverStatsDiv);
    if (buff.potencyId) {
        createStatHolder("Potency Type", ItemModule.potencyAliases[buff.potencyId] || buff.potencyId, hoverStatsDiv);
    }
    if (buff.potency !== undefined && buff.potency !== null) {
        createStatHolder("Potency", buff.potency, hoverStatsDiv);
    }
    let hoverPerksDiv = itemHoverInfoDiv.children[5];
    hoverPerksDiv.style.display = "none";
    hoverPerksDiv.innerHTML = "";
    let hoverPotenciesDiv = itemHoverInfoDiv.children[6];
    hoverPotenciesDiv.style.display = "none";
    hoverPotenciesDiv.innerHTML = "";
    if (buff.sourceData) {
        hoverPotenciesDiv.style.display = "block";
        createStatHolder("Source", buff.sourceData.source, hoverPotenciesDiv);
        createStatHolder("Source Type", buff.sourceData.sourceType, hoverPotenciesDiv);
        createStatHolder("Source Potency", buff.sourceData.sourceInatePotency, hoverPotenciesDiv);
    }
    document.body.classList.add("selector-tooltip-visible");
    itemHoverInfoDiv.style.display = "flex";
}
function guildHover(guild) {
    const itemHoverInfoDiv = document.getElementById("itemHoverInfoDiv");
    if (!itemHoverInfoDiv)
        return;
    let itemName = itemHoverInfoDiv.children[0];
    itemName.innerHTML = guild.name || "";
    let hoverDescription = itemHoverInfoDiv.children[1];
    hoverDescription.innerHTML = guild.description || "";
    let hoverDmgScaleDiv = itemHoverInfoDiv.children[2];
    hoverDmgScaleDiv.style.display = "none";
    hoverDmgScaleDiv.innerHTML = "";
    let hoverDmgTypeDiv = itemHoverInfoDiv.children[3];
    hoverDmgTypeDiv.style.display = "none";
    hoverDmgTypeDiv.innerHTML = "";
    let hoverStatsDiv = itemHoverInfoDiv.children[4];
    hoverStatsDiv.style.display = "none";
    hoverStatsDiv.innerHTML = "";
    let hoverPerksDiv = itemHoverInfoDiv.children[5];
    hoverPerksDiv.style.display = "none";
    hoverPerksDiv.innerHTML = "";
    if (guild.promotions?.length) {
        hoverStatsDiv.style.display = "block";
        hoverPerksDiv.style.display = "block";
        guild.promotions.forEach((promotion, index) => {
            if (promotion.stats && Object.keys(promotion.stats).length) {
                createStatHolder(`Promotion Stats`, index + 1, hoverStatsDiv);
                for (const [stat, value] of Object.entries(promotion.stats)) {
                    createStatHolder(stat, value, hoverStatsDiv);
                }
            }
            if (promotion.perks && Object.keys(promotion.perks).length) {
                createStatHolder(`Promotion Perks`, index + 1, hoverPerksDiv);
                for (const [perk, value] of Object.entries(promotion.perks)) {
                    createStatHolder(perk, value, hoverPerksDiv);
                }
            }
        });
    }
    let hoverPotenciesDiv = itemHoverInfoDiv.children[6];
    hoverPotenciesDiv.style.display = "none";
    hoverPotenciesDiv.innerHTML = "";
    document.body.classList.add("selector-tooltip-visible");
    itemHoverInfoDiv.style.display = "flex";
}
function weaponArtHover(weaponArt) {
    const itemHoverInfoDiv = document.getElementById("itemHoverInfoDiv");
    if (!itemHoverInfoDiv)
        return;
    let itemName = itemHoverInfoDiv.children[0];
    itemName.innerHTML = weaponArt.name || "";
    let hoverDescription = itemHoverInfoDiv.children[1];
    hoverDescription.innerHTML = weaponArt.description || "";
    let hoverDmgScaleDiv = itemHoverInfoDiv.children[2];
    hoverDmgScaleDiv.style.display = "none";
    hoverDmgScaleDiv.innerHTML = "";
    if (weaponArt.damageScalings) {
        for (const [key, value] of Object.entries(weaponArt.damageScalings)) {
            if (value === undefined)
                continue;
            hoverDmgScaleDiv.style.display = "block";
            createStatHolder(key, value, hoverDmgScaleDiv);
        }
    }
    let hoverDmgTypeDiv = itemHoverInfoDiv.children[3];
    hoverDmgTypeDiv.style.display = "none";
    hoverDmgTypeDiv.innerHTML = "";
    if (weaponArt.damageTypes) {
        for (const [key, value] of Object.entries(weaponArt.damageTypes)) {
            if (value === undefined)
                continue;
            hoverDmgTypeDiv.style.display = "block";
            createStatHolder(key, value, hoverDmgTypeDiv);
        }
    }
    let hoverStatsDiv = itemHoverInfoDiv.children[4];
    hoverStatsDiv.style.display = "none";
    hoverStatsDiv.innerHTML = "";
    hoverStatsDiv.style.display = "block";
    createStatHolder("Cooldown", weaponArt.coolDown || 1, hoverStatsDiv);
    if (weaponArt.baseDamage !== undefined) {
        createStatHolder("Base Damage", weaponArt.baseDamage, hoverStatsDiv);
    }
    if (weaponArt.totalHits !== undefined) {
        createStatHolder("Total Hits", weaponArt.totalHits, hoverStatsDiv);
    }
    let hoverPerksDiv = itemHoverInfoDiv.children[5];
    hoverPerksDiv.style.display = "none";
    hoverPerksDiv.innerHTML = "";
    if (weaponArt.weaponTypeRequirements?.length) {
        hoverPerksDiv.style.display = "block";
        createStatHolder("Weapon Types", weaponArt.weaponTypeRequirements.join(", "), hoverPerksDiv);
    }
    if (weaponArt.guildRequirements?.length) {
        hoverPerksDiv.style.display = "block";
        createStatHolder("Guilds", weaponArt.guildRequirements.join(", "), hoverPerksDiv);
    }
    let hoverPotenciesDiv = itemHoverInfoDiv.children[6];
    hoverPotenciesDiv.style.display = "none";
    hoverPotenciesDiv.innerHTML = "";
    if (weaponArt.sourcepotencies) {
        for (const [key, value] of Object.entries(weaponArt.sourcepotencies)) {
            if (value === undefined)
                continue;
            hoverPotenciesDiv.style.display = "block";
            createStatHolder(ItemModule.potencyAliases[key] || key, value, hoverPotenciesDiv);
        }
    }
    document.body.classList.add("selector-tooltip-visible");
    itemHoverInfoDiv.style.display = "flex";
}
function mouseLeave() {
    const itemHoverInfoDiv = document.getElementById("itemHoverInfoDiv");
    if (!itemHoverInfoDiv)
        return;
    let itemName = itemHoverInfoDiv.children[0];
    itemName.innerHTML = "";
    let hoverDescription = itemHoverInfoDiv.children[1];
    hoverDescription.innerHTML = "";
    let hoverDmgScaleDiv = itemHoverInfoDiv.children[2];
    hoverDmgScaleDiv.style.display = "none";
    hoverDmgScaleDiv.innerHTML = "";
    let hoverDmgTypeDiv = itemHoverInfoDiv.children[3];
    hoverDmgTypeDiv.style.display = "none";
    hoverDmgTypeDiv.innerHTML = "";
    let hoverStatsDiv = itemHoverInfoDiv.children[4];
    hoverStatsDiv.style.display = "none";
    hoverStatsDiv.innerHTML = "";
    let hoverPerksDiv = itemHoverInfoDiv.children[5];
    hoverPerksDiv.style.display = "none";
    hoverPerksDiv.innerHTML = "";
    let hoverPotenciesDiv = itemHoverInfoDiv.children[6];
    hoverPotenciesDiv.style.display = "none";
    hoverPotenciesDiv.innerHTML = "";
    document.body.classList.remove("selector-tooltip-visible");
    itemHoverInfoDiv.style.display = "none";
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
        let perk = Perk.PerkStore.getByID(key);
        let name = perk?.name || key;
        let perkHolder = createStatHolder(name, value, perksContainerDiv);
        perkHolder?.addEventListener("mouseenter", () => {
            perkHover(perk, value);
        });
        perkHolder?.addEventListener("mouseleave", () => {
            mouseLeave();
        });
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
    displayDamageModificationGroup(build.damageModifications.damage_bonus_mods, dmgModContainer, "Boost");
    displayDamageModificationGroup(build.damageModifications.damage_reduced_mods, dmgReducedModContainer, "Reduction");
    displayDamageModificationGroup(build.damageModifications.specific_bonus_mods, specificDmgBonusContainer);
    displayDamageModificationGroup(build.damageModifications.specific_reduced_mods, specificDmgReducedContainer);
    displayDamageModificationGroup(build.damageModifications.crit_mods, critModContainer);
    displayDamageModificationGroup(build.damageModifications.special_mods, specialModContainer);
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
    //add the current hp and max hp
    healthInput.value = `${build.hp.toString()}/${build.maxHp.toString()}`;
    levelInput.value = build.level.toString();
    promotionSelector.value = (build.guildPromotion + 1).toString();
    raceSelector.value = build.race?.id || "";
    //////////////////////// add the images to the Html pages for the item ////////////////////////
    for (const [key, element] of Object.entries(imgHolders)) {
        if (!element)
            continue;
        let parentDiv = element.parentElement;
        let spanElement = parentDiv?.children[1];
        let img = PlusSymbol;
        let name = "";
        if (key === "blade" || key == "handle" || key == "weaponart" || key == "guild" || key === "race") {
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
        element.src = resolveAssetPath(img);
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
        if (!element || key === "blade" || key == "handle" || key == "weaponart" || key == "guild" || key === "race")
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
        element.src = resolveAssetPath(img);
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
    wipeDamages(build.weapon.m1, m1Rows, m1DamageTable);
    wipeDamages(build.weapon.m2, m2Rows, m2DamageTable);
    //Run the weapon damage calculation
    helper.runWeaponDamageCalculation(build, target);
    let runeDamageResult;
    let weaponArtDamageResult;
    // Run rune damage calculation when the selected rune has direct damage data.
    if (typeof build.mainArmor.rune?.baseDamage === "number") {
        const baseDamageInfo = {
            damage: build.mainArmor.rune.baseDamage,
            hitAmount: 1,
            source: build.mainArmor.rune.id,
            sourceDamageType: "Rune",
            sourceType: "Rune",
        };
        const attackerBuild = {
            damageScalings: build.mainArmor.rune.damageScalings,
            damageTypes: build.mainArmor.rune.damageTypes,
        };
        runeDamageResult = helper.runNonWeaponDamageCalculation(baseDamageInfo, build, target, attackerBuild);
    }
    renderRunePanel(build.mainArmor.rune, runeDamageResult);
    //Run WeaponArt Damage calculation
    if (typeof build.weaponart?.baseDamage === "number") {
        const baseDamageInfo = {
            damage: build.weaponart.baseDamage,
            hitAmount: build.weaponart.totalHits || 1,
            source: build.weaponart.id,
            sourceDamageType: "WeaponArt",
            sourceType: "WeaponArt",
        };
        const attackerBuild = {
            damageScalings: build.weaponart.damageScalings,
            damageTypes: build.weaponart.damageTypes,
        };
        weaponArtDamageResult = helper.runNonWeaponDamageCalculation(baseDamageInfo, build, target, attackerBuild);
    }
    renderWeaponArtPanel(build.weaponart, weaponArtDamageResult);
    const nonWeaponDamages = [];
    //run perk damages
    for (const [perk, amount] of Object.entries(build.perks)) {
        if (!Perk.PerkStore.getByID(perk))
            continue;
        let perkData = Perk.PerkStore.getByID(perk);
        let callBack = perkData.getPerkDamageInfo;
        if (!callBack)
            continue;
        const baseDamageInfo = callBack.apply(build, [amount]);
        if (!baseDamageInfo)
            continue;
        const attackerBuild = {
            damageScalings: perkData.damageScalings,
            damageTypes: perkData.damageTypes,
        };
        const results = helper.runNonWeaponDamageCalculation(baseDamageInfo, build, target, attackerBuild);
        nonWeaponDamages.push({
            source: perkData.name || baseDamageInfo.source || perk,
            outputs: results.outputs,
            total: results.total,
            category: "Perk",
        });
    }
    //Status damages
    for (const [status, debuff] of Object.entries(target.deBuffs || [])) {
        if (!debuff)
            continue;
        let StatusData = debuff;
        let callBack = StatusData.getDamageInfo;
        if (!callBack)
            continue;
        const baseDamageInfo = callBack.apply(build, [0.3]);
        if (!baseDamageInfo)
            continue;
        const attackerBuild = {
            damageScalings: StatusData.damageScalings,
            damageTypes: StatusData.damageTypes,
        };
        const results = helper.runNonWeaponDamageCalculation(baseDamageInfo, build, target, attackerBuild);
        nonWeaponDamages.push({
            source: StatusData.name || baseDamageInfo.source || status,
            outputs: results.outputs,
            total: results.total,
            category: "Debuff",
        });
    }
    if (build.weapon.constructionType) {
        weaponTypeText.innerHTML = "Weapon Type: " + build.weapon.constructionType;
    }
    else {
        weaponTypeText.innerHTML = "Weapon Type: None";
    }
    if (build.weapon.attackSpeed) {
        atkSpeInput.value = build.weapon.attackSpeed.toString();
    }
    else {
        atkSpeInput.value = "0";
    }
    mainGearButtons.forEach((itembutton) => {
        const key = itembutton.name.toLowerCase();
        const itemBox = itembutton.parentElement?.parentElement;
        const enchantmentsContainer = itemBox.children[1];
        for (let index = 0; index < enchantmentsContainer.children.length; index++) {
            const enchantSelector = enchantmentsContainer.children[index];
            const enchantment = build.enchantments[key]?.[index];
            enchantSelector.children[0].innerHTML = enchantment?.name || "Choose an enchantment";
        }
        const upgradeSelector = itemBox.children[0].children[3];
        if (upgradeSelector) {
            upgradeSelector.value = (build.mainArmor[key]?.upgrade || 0).toString();
        }
    });
    //////////////////////// Run the displayStats() to add show the build stats ////////////////////////
    displayStats();
    renderNonWeaponDamages(nonWeaponDamages);
    //Displays the Damages to the table
    addHeaderToTable(build.weapon.m1, m1Rows, m1DamageTable);
    addHeaderToTable(build.weapon.m2, m2Rows, m2DamageTable);
}
function loadSelectorPage(build, source, category, section, index, htmlElement, filter) {
    //Set a Dummy Item to act has a remove
    let blankItem = new ItemModule.Item();
    blankItem.name = "none";
    blankItem.id = "none";
    blankItem.img = CloseSymbol;
    activeSelectorContext = {
        build,
        source,
        category,
        section,
        index,
        htmlElement,
    };
    itemsSearchInput.value = filter || "";
    itemsSearchInput.style.display = "";
    itemsSelectorTitle.textContent = "Select an Item";
    clearSelectorItems();
    let removeItemBox = createItemBox(blankItem);
    selectItemDivs.push([removeItemBox, blankItem]);
    let key = category.toLowerCase();
    removeItemBox?.children[0].children[0].addEventListener("click", () => {
        hideSelector();
        removeFromBuild(key, section, index, htmlElement);
    });
    setSelectorItemHover(removeItemBox?.children[0].children[0], blankItem);
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
    else if (source == "WeaponArts") {
        items = WeaponArtModule.WeaponArtStore.getWeaponArtsForBuild(build);
    }
    const normalizedFilter = normalizeFilterValue(filter || "");
    items?.forEach((item) => {
        if (normalizedFilter) {
            const normalizedName = normalizeFilterValue(item.name || "");
            const normalizedId = normalizeFilterValue(item.id || "");
            // //stats
            // const Itemstats = Object.entries(((item as any)["stats"] as {[key in ItemModule.stat]: number}) || {}) as [ItemModule.stat, number][]
            // const normalizedStats = Itemstats.map(element => {
            //   return normalizeFilterValue(element[0]);
            // });
            // //scale
            // const ItemScales = Object.entries(((item as any)["damageScalings"] as {[key in ItemModule.scale]: number}) || {}) as [ItemModule.scale, number][]
            // const normalizedScales = ItemScales.map(element => {
            //   return normalizeFilterValue(element[0]);
            // });
            //  //scale
            // const ItemDmgTypes = Object.entries(((item as any)["damageTypes"] as {[key in ItemModule.scale]: number}) || {}) as [ItemModule.scale, number][]
            // const normalizedTypes = ItemDmgTypes.map(element => {
            //   return normalizeFilterValue(element[0]);
            // });
            let matchesFilter = normalizedName.includes(normalizedFilter) ||
                normalizedId.includes(normalizedFilter) ||
                normalizedFilter.includes(normalizedName) ||
                normalizedFilter.includes(normalizedId);
            //stats
            if (matchesFilter === false) {
                const Itemstats = Object.entries(item["stats"] || {});
                Itemstats.map(element => {
                    const normalizeStat = normalizeFilterValue(element[0]);
                    matchesFilter =
                        normalizeStat.includes(normalizedFilter) ||
                            normalizedFilter.includes(normalizeStat);
                });
            }
            //scale
            if (matchesFilter === false) {
                const ItemScales = Object.entries(item["damageScalings"] || {});
                ItemScales.map(element => {
                    const normalizeScale = normalizeFilterValue(element[0]);
                    matchesFilter =
                        normalizeScale.includes(normalizedFilter) ||
                            normalizedFilter.includes(normalizeScale);
                });
            }
            //damageTypes
            if (matchesFilter === false) {
                const ItemDmgTypes = Object.entries(item["damageTypes"] || {});
                ItemDmgTypes.map(element => {
                    const normalizeScale = normalizeFilterValue(element[0]);
                    matchesFilter =
                        normalizeScale.includes(normalizedFilter) ||
                            normalizedFilter.includes(normalizeScale);
                });
            }
            //damageTypes
            if (matchesFilter === false) {
                const ItemPerks = Object.entries(item["perks"] || {});
                ItemPerks.map(element => {
                    const normalizePerk = normalizeFilterValue(element[0]);
                    matchesFilter =
                        normalizePerk.includes(normalizedFilter) ||
                            normalizedFilter.includes(normalizePerk);
                });
            }
            if (!matchesFilter)
                return;
        }
        let itemBox = createItemBox(item);
        if (!itemBox)
            return;
        setSelectorItemHover(itemBox.children[0].children[0], item);
        selectItemDivs.push([itemBox, item]);
    });
    selectItemDivs.forEach(([itemBox, item]) => {
        if (itemBox != removeItemBox) {
            var itemBoxButton = itemBox.children[0].children[0];
            itemBoxButton.addEventListener("click", () => {
                if (item instanceof ItemModule.Item || item instanceof GuildModule.Guild || item instanceof WeaponArtModule.WeaponArt) {
                    hideSelector();
                    addItemToPage(item, section, key, index, htmlElement);
                }
                else if (item instanceof BuffModule.Buff) {
                    const source = item.potencyId ? build.getSourcesForBuff(item.potencyId) : {};
                    //Buff will now bring up a new UI, for adding a buff to a build
                    // all buffs must have a soruce, so based on user build we can see if the have any sources for his buff
                    // if they don't we can auto add it still but the buff will have potency of 0.1 and source Type will be default
                    if (Object.keys(source).length === 0) {
                        item.setSourceData();
                        hideSelector();
                        build.addBuffToBuild(item);
                    }
                    else {
                        showBuffSourceSelector(item, source, build);
                    }
                    resetPage();
                }
            });
        }
    });
    items_selector.style.display = "flex";
    document.body.classList.add("selector-open");
}
///////////////////////////////////////Button & input Listeners///////////////////////////////////////
SelectorClose.addEventListener("click", () => {
    hideSelector();
});
clearBuildButton.addEventListener("click", () => {
    build = new Build.Build();
    build.target = target;
    hideSelector();
    resetPage();
});
exportBuildButton.addEventListener("click", () => {
    exportCurrentBuild();
});
importBuildButton.addEventListener("click", () => {
    importBuildInput.click();
});
importBuildInput.addEventListener("change", async () => {
    await importBuildFromFile(importBuildInput.files?.[0]);
});
itemsSearchInput.addEventListener("input", () => {
    if (!activeSelectorContext)
        return;
    loadSelectorPage(activeSelectorContext.build, activeSelectorContext.source, activeSelectorContext.category, activeSelectorContext.section, activeSelectorContext.index, activeSelectorContext.htmlElement, itemsSearchInput.value);
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
healthInput.addEventListener("change", () => {
    let health = Number(healthInput.value);
    health = Math.floor(health);
    if (health < 1) {
        health = 1;
    }
    if (health > build.maxHp) {
        health = build.maxHp;
    }
    healthInput.value = `${health.toString()}/${build.maxHp.toString()}`;
    build.hp = health;
    resetPage();
});
//add the current hp and max hp
healthInput.value = `${build.hp.toString()}/${build.maxHp.toString()}`;
theme_Selector_input.addEventListener("change", () => {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    if (newTheme === "dark") {
        PlusSymbol = resolveAssetPath("image/plus_symbol_white.png");
        CloseSymbol = resolveAssetPath("image/close_X_white.png");
    }
    else {
        PlusSymbol = resolveAssetPath("image/plus_symbol_black.png");
        CloseSymbol = resolveAssetPath("image/close_X_black.png");
    }
    document.documentElement.setAttribute("data-theme", newTheme);
    setItemButtonImage();
    resetPage();
});
raceSelector.addEventListener("change", (event) => {
    const selectedValue = event.target.value;
    console.log('User picked:', selectedValue);
    //add it to the build
    if (!RaceModule.RaceStore.get(selectedValue))
        return;
    addItemToPage(RaceModule.RaceStore.get(selectedValue), "race", "race");
});
//aad the races to the selector
RaceModule.RaceStore.all()?.forEach((race) => {
    const option = document.createElement("option");
    option.value = race.id;
    option.textContent = race.name;
    raceSelector.appendChild(option);
});
promotionSelector.addEventListener("change", () => {
    let promotion = Number(promotionSelector.value);
    build.guildPromotion = Number(promotion - 1);
    resetPage();
});
;
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
    itembutton.addEventListener("mouseenter", () => {
        let item = build.mainArmor[itembutton.name.toLowerCase()];
        if (!item)
            return;
        mouseHover(item);
    });
    itembutton.addEventListener("mouseleave", () => {
        mouseLeave();
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
    itembutton.addEventListener("mouseenter", () => {
        let item = build.infuseArmor[itembutton.name.toLowerCase()];
        if (!item)
            return;
        console.log(item);
        mouseHover(item);
    });
    itembutton.addEventListener("mouseleave", () => {
        mouseLeave();
    });
});
weaponMakeUpButtons.forEach((itembutton) => {
    let buttonImage = itembutton.children[0];
    buttonImage.src = PlusSymbol;
    const type = itembutton.name === "WeaponArt" ? "WeaponArts" : "Items";
    itembutton.addEventListener("click", () => {
        loadSelectorPage(build, type, itembutton.name);
    });
    itembutton.addEventListener("mouseenter", () => {
        let itemName = itembutton.name.toLowerCase();
        if (itemName == "blade" || itemName == "handle") {
            let item = build[itemName];
            if (!item)
                return;
            mouseHover(item);
        }
        else if (itemName == "weaponart") {
            let item = build[itemName];
            if (!item)
                return;
            weaponArtHover(item);
        }
    });
    itembutton.addEventListener("mouseleave", () => {
        mouseLeave();
    });
});
guildSelector.addEventListener("click", () => {
    loadSelectorPage(build, "Guilds", "Guild");
});
guildSelector.addEventListener("mouseenter", () => {
    let item = build.guild;
    if (!item)
        return;
    guildHover(item);
});
guildSelector.addEventListener("mouseleave", () => {
    mouseLeave();
});
//////////////////////////Set the add buff/Debuff buttons//////////////////////////
/**
 * Sets up event listeners for buff/debuff selector buttons
 * Gets references to the buff/debuff buttons for both build and target
 * Adds plus symbol images and click handlers to load appropriate selector pages
 */
function setBuffEvents() {
    // Define button configurations
    const buffButtons = [
        { id: "selectbuff", target: build, type: "Buff" },
        { id: "selectdebuff", target: build, type: "Debuff" },
        { id: "selectTargetBuff", target: target, type: "Buff" },
        { id: "selectTargetDebuff", target: target, type: "Debuff" }
    ];
    // Set up each button
    buffButtons.forEach(({ id, target, type }) => {
        const button = document.getElementById(id);
        if (!button)
            return;
        // Set plus symbol
        const imageElement = button.querySelector('img');
        if (imageElement) {
            imageElement.src = PlusSymbol;
        }
        // Add click handler
        button.addEventListener("click", () => {
            loadSelectorPage(target, "Buffs", type);
        });
    });
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
