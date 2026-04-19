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
const shrineBalanceToggle = document.getElementById("shrine_balance_toggle");
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
const targetHealthInput = document.getElementById("targetHpValue");
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
const itemHoverInfoDiv = document.getElementById("itemHoverInfoDiv");
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
const bladeLabelSpan = bladeDiv.children[0].children[1].children[0];
const handleLabelSpan = handleDiv.children[0].children[1].children[0];
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
const perkDamageScalingsContainerDiv = document.getElementById("perkDamageScalings");
const perkDamageTypesContainerDiv = document.getElementById("perkDamageTypes");
const perkDamageContainerDiv = document.getElementById("perk_damage");
const statusDamageContainerDiv = document.getElementById("status_damage");
const runeDamageContainerDiv = document.getElementById("rune_damage");
const weaponArtDamageContainerDiv = document.getElementById("weaponart_damage");
//Table
const m1DamageTable = document.getElementById("m1_damage_table");
const m2DamageTable = document.getElementById("m2_damage_table");
const m1CritDamageTable = document.getElementById("m1_crit_damage_table");
const m2CritDamageTable = document.getElementById("m2_crit_damage_table");
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
target.target = build;
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
let m1CritRows = {};
let m2CritRows = {};
const selectItemDivs = [];
let activeSelectorContext = null;
function isMonkBuild(currentBuild) {
    return currentBuild.guild?.id === "monk";
}
function getWeaponSlotLabel(currentBuild, slot) {
    if (!isMonkBuild(currentBuild))
        return slot;
    return slot === "Handle" ? "Glove" : "Essence";
}
function getSelectorItemCategory(currentBuild, category) {
    if (category === "Handle" || category === "Blade") {
        return getWeaponSlotLabel(currentBuild, category);
    }
    return category;
}
function getSelectorTitle(currentBuild, source, category) {
    if (source === "Guilds")
        return "Select a Guild";
    if (source === "WeaponArts")
        return "Select a Weapon Art";
    if (source === "Buffs")
        return `Select a ${category}`;
    if (category === "Handle" || category === "Blade") {
        return `Select a ${getWeaponSlotLabel(currentBuild, category)}`;
    }
    return `Select a ${category}`;
}
function getOpposingBuild(currentBuild) {
    return currentBuild.target || (currentBuild === build ? target : build);
}
function getBuffSourceBuild(currentBuild, buff) {
    if (buff.category === "Debuff") {
        return getOpposingBuild(currentBuild);
    }
    return currentBuild;
}
function getBuffEffectivePotency(currentBuild, buff) {
    return buff.getEffectivePotency(getBuffSourceBuild(currentBuild, buff));
}
function updateWeaponSlotLabels() {
    handleLabelSpan.textContent = getWeaponSlotLabel(build, "Handle");
    bladeLabelSpan.textContent = getWeaponSlotLabel(build, "Blade");
}
/////////////////////////////////////// Create HTML Elements ///////////////////////////////////////
function formatDisplayNumber(value, decimals = 4) {
    const roundedValue = Math.round((value + Number.EPSILON) * 10 ** decimals) / 10 ** decimals;
    return Number.isInteger(roundedValue)
        ? roundedValue.toString()
        : roundedValue.toString();
}
function createStatHolder(name, value, ContainerDiv) {
    if (statHolder_template == null)
        return null;
    const clonedDiv = statHolder_template.cloneNode(true);
    // Optionally, update the cloned div (e.g., clear input fields)
    const inputs = clonedDiv.querySelectorAll("input");
    inputs.forEach((input) => (input.value = ""));
    clonedDiv.style.display = "";
    clonedDiv.children[0].textContent = name + ":";
    clonedDiv.children[1].textContent = typeof value === "number" ? formatDisplayNumber(value) : value;
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
function formatDamageNumber(value) {
    return Math.round(value * 100) / 100;
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
    const normalHeader = document.createElement("span");
    normalHeader.textContent = "No Crit";
    const critHeader = document.createElement("span");
    critHeader.textContent = "Crit";
    const averageHeader = document.createElement("span");
    averageHeader.textContent = "Avg";
    headerRow.appendChild(typeHeader);
    headerRow.appendChild(normalHeader);
    headerRow.appendChild(critHeader);
    headerRow.appendChild(averageHeader);
    damageTable.appendChild(headerRow);
    for (const [damageType, value] of Object.entries(entry.outputs)) {
        if (value === undefined)
            continue;
        const damageRow = document.createElement("div");
        damageRow.className = "non_weapon_damage_row";
        const typeSpan = document.createElement("span");
        typeSpan.textContent = damageType;
        const normalValue = document.createElement("span");
        normalValue.textContent = formatDamageNumber(value.normal).toString();
        const critValue = document.createElement("span");
        critValue.textContent = formatDamageNumber(value.crit).toString();
        const averageValue = document.createElement("span");
        averageValue.textContent = formatDamageNumber(value.average).toString();
        damageRow.appendChild(typeSpan);
        damageRow.appendChild(normalValue);
        damageRow.appendChild(critValue);
        damageRow.appendChild(averageValue);
        damageTable.appendChild(damageRow);
    }
    const totalRow = document.createElement("div");
    totalRow.className = "non_weapon_damage_row non_weapon_damage_total_row";
    const totalLabel = document.createElement("span");
    totalLabel.textContent = "Total";
    const totalNormal = document.createElement("span");
    totalNormal.textContent = formatDamageNumber(entry.total.normal).toString();
    const totalCrit = document.createElement("span");
    totalCrit.textContent = formatDamageNumber(entry.total.crit).toString();
    const totalAverage = document.createElement("span");
    totalAverage.textContent = formatDamageNumber(entry.total.average).toString();
    totalRow.appendChild(totalLabel);
    totalRow.appendChild(totalNormal);
    totalRow.appendChild(totalCrit);
    totalRow.appendChild(totalAverage);
    damageTable.appendChild(totalRow);
    cardDiv.appendChild(damageTable);
    containerDiv.appendChild(cardDiv);
}
function renderNonWeaponDamages(entries) {
    perkDamageContainerDiv.innerHTML = "";
    statusDamageContainerDiv.innerHTML = "";
    const perkEntries = entries.filter((entry) => entry.category === "Perk");
    const statusEntries = entries.filter((entry) => entry.category === "Debuff" || entry.category === "Buff");
    if (perkEntries.length) {
        perkEntries.forEach((entry) => createNonWeaponDamageCard(entry, perkDamageContainerDiv));
    }
    else {
        createStatHolder("Status", "No perk damage detected", perkDamageContainerDiv);
    }
    if (statusEntries.length) {
        statusEntries.forEach((entry) => createNonWeaponDamageCard(entry, statusDamageContainerDiv));
    }
    else {
        createStatHolder("Status", "No debuff or buff damage detected", statusDamageContainerDiv);
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
        target.target = build;
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
function addHeaderToTable(atkSource, holderRows, ContainerDiv, mode) {
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
            addDamageToTable(key, value, holderRows, ContainerDiv, mode);
        }
    }
}
function addDamageToTable(name, value, holderRows, ContainerDiv, mode) {
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
    damageValueCell.textContent = formatDamageNumber(value[mode]).toString();
    clonedDiv?.appendChild(damageValueCell);
}
function createHoverInfoText(className, text) {
    const element = document.createElement("div");
    element.className = className;
    element.textContent = text;
    return element;
}
function createHoverInfoSection(title) {
    const sectionDiv = document.createElement("div");
    sectionDiv.className = "item_hoverinfo_section";
    const titleSpan = document.createElement("span");
    titleSpan.className = "item_hoverinfo_section_title";
    titleSpan.textContent = title;
    const bodyDiv = document.createElement("div");
    bodyDiv.className = "item_hoverinfo_section_body";
    sectionDiv.appendChild(titleSpan);
    sectionDiv.appendChild(bodyDiv);
    itemHoverInfoDiv.appendChild(sectionDiv);
    return bodyDiv;
}
function getHoverRows(values, options) {
    const rows = [];
    if (!values)
        return rows;
    for (const [key, value] of Object.entries(values)) {
        if (value === undefined || value === null || value === "")
            continue;
        rows.push({
            label: options?.labelFormatter ? options.labelFormatter(key, value) : key,
            value: options?.valueFormatter ? options.valueFormatter(value, key) : value,
        });
    }
    return rows;
}
function renderHoverInfo(options) {
    if (!itemHoverInfoDiv)
        return;
    itemHoverInfoDiv.replaceChildren();
    itemHoverInfoDiv.appendChild(createHoverInfoText("item_hoverinfo_name", options.name || ""));
    if (options.description) {
        itemHoverInfoDiv.appendChild(createHoverInfoText("item_hoverinfo_description", options.description));
    }
    options.sections?.forEach((section) => {
        if (!section.rows.length)
            return;
        const bodyDiv = createHoverInfoSection(section.title);
        section.rows.forEach((row) => createStatHolder(row.label, row.value, bodyDiv));
    });
    document.body.classList.add("selector-tooltip-visible");
    itemHoverInfoDiv.style.display = "flex";
}
function mouseHover(item) {
    const statRows = getHoverRows(item.stats, {
        valueFormatter: (value) => typeof value === "number" ? `${value}%` : value,
    });
    if (item.attackSpeed !== undefined) {
        statRows.unshift({ label: "AttackSpeed", value: item.attackSpeed });
    }
    renderHoverInfo({
        name: item.name || "",
        description: item.description || "",
        sections: [
            { title: "Damage Scale", rows: getHoverRows(item.damageScalings) },
            { title: "Damage Type", rows: getHoverRows(item.damageTypes) },
            { title: "Stats", rows: statRows },
            {
                title: "Perks",
                rows: getHoverRows(item.perks, {
                    labelFormatter: (key) => Perk.PerkStore.getByID(key)?.name || key,
                }),
            },
            {
                title: "Potencies",
                rows: getHoverRows(item.potencies, {
                    labelFormatter: (key) => ItemModule.potencyAliases[key] || key,
                    valueFormatter: (value) => typeof value === "number" ? value / 10 : value,
                }),
            },
        ],
    });
}
function perkHover(perk, value) {
    const statRows = [];
    if (value !== undefined) {
        statRows.push({ label: "Perk Level", value });
    }
    renderHoverInfo({
        name: perk.name || "",
        description: perk.description || "",
        sections: [
            { title: "Stats", rows: statRows },
        ],
    });
}
function buffHover(buff) {
    const statRows = [];
    const sourceRows = [];
    if (typeof buff.baseDuration === "number") {
        statRows.push({ label: "Base Duration", value: buff.baseDuration });
    }
    if (buff.potencyId) {
        statRows.push({
            label: "Potency Type",
            value: ItemModule.potencyAliases[buff.potencyId] || buff.potencyId,
        });
    }
    if (typeof buff.potency === "number") {
        statRows.push({ label: "Potency", value: buff.potency });
    }
    if (buff.sourceData) {
        sourceRows.push({ label: "Source", value: buff.sourceData.source });
        sourceRows.push({ label: "Source Type", value: buff.sourceData.sourceType });
        sourceRows.push({ label: "Source Potency", value: buff.sourceData.sourceInatePotency });
    }
    renderHoverInfo({
        name: buff.name || "",
        description: buff.category || "",
        sections: [
            { title: "Damage Scale", rows: getHoverRows(buff.damageScalings) },
            { title: "Damage Type", rows: getHoverRows(buff.damageTypes) },
            { title: "Stats", rows: statRows },
            { title: "Source", rows: sourceRows },
        ],
    });
}
function guildHover(guild) {
    const promotionStatRows = [];
    const promotionPerkRows = [];
    if (guild.promotions?.length) {
        guild.promotions.forEach((promotion, index) => {
            if (promotion.stats && Object.keys(promotion.stats).length) {
                promotionStatRows.push({ label: "Promotion Stats", value: index + 1 });
                for (const [stat, value] of Object.entries(promotion.stats)) {
                    promotionStatRows.push({ label: stat, value });
                }
            }
            if (promotion.perks && Object.keys(promotion.perks).length) {
                promotionPerkRows.push({ label: "Promotion Perks", value: index + 1 });
                for (const [perk, value] of Object.entries(promotion.perks)) {
                    promotionPerkRows.push({
                        label: Perk.PerkStore.getByID(perk)?.name || perk,
                        value,
                    });
                }
            }
        });
    }
    renderHoverInfo({
        name: guild.name || "",
        description: guild.description || "",
        sections: [
            { title: "Promotion Stats", rows: promotionStatRows },
            { title: "Promotion Perks", rows: promotionPerkRows },
        ],
    });
}
function weaponArtHover(weaponArt) {
    const statRows = [
        { label: "Cooldown", value: weaponArt.coolDown || 1 },
    ];
    const requirementRows = [];
    if (weaponArt.baseDamage !== undefined) {
        statRows.push({ label: "Base Damage", value: weaponArt.baseDamage });
    }
    if (weaponArt.totalHits !== undefined) {
        statRows.push({ label: "Total Hits", value: weaponArt.totalHits });
    }
    if (weaponArt.weaponTypeRequirements?.length) {
        requirementRows.push({
            label: "Weapon Types",
            value: weaponArt.weaponTypeRequirements.join(", "),
        });
    }
    if (weaponArt.guildRequirements?.length) {
        requirementRows.push({
            label: "Guilds",
            value: weaponArt.guildRequirements.join(", "),
        });
    }
    renderHoverInfo({
        name: weaponArt.name || "",
        description: weaponArt.description || "",
        sections: [
            { title: "Damage Scale", rows: getHoverRows(weaponArt.damageScalings) },
            { title: "Damage Type", rows: getHoverRows(weaponArt.damageTypes) },
            { title: "Stats", rows: statRows },
            { title: "Requirements", rows: requirementRows },
            {
                title: "Potencies",
                rows: getHoverRows(weaponArt.sourcepotencies, {
                    labelFormatter: (key) => ItemModule.potencyAliases[key] || key,
                }),
            },
        ],
    });
}
function mouseLeave() {
    if (!itemHoverInfoDiv)
        return;
    itemHoverInfoDiv.replaceChildren();
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
        createStatHolder(ItemModule.potencyAliases[key], value / 10, potenciesContainerDiv);
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
    const perkOutputPreview = helper.getActivePerkOutputPreview(build, target);
    perkDamageScalingsContainerDiv.innerHTML = "";
    for (const [key, value] of Object.entries(perkOutputPreview.damageScalings)) {
        createStatHolder(key, value, perkDamageScalingsContainerDiv);
    }
    perkDamageTypesContainerDiv.innerHTML = "";
    for (const [key, value] of Object.entries(perkOutputPreview.damageTypes)) {
        createStatHolder(key, value, perkDamageTypesContainerDiv);
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
    build.target = target;
    target.target = build;
    //reset the Build
    build.resetBuild();
    target.resetBuild();
    //add the current hp and max hp
    healthInput.value = `${build.hp.toString()}/${build.maxHp.toString()}`;
    targetHealthInput.value = `${target.hp.toString()}/${target.maxHp.toString()}`;
    levelInput.value = build.level.toString();
    promotionSelector.value = (build.guildPromotion + 1).toString();
    raceSelector.value = build.race?.id || "";
    shrineBalanceToggle.checked = build.shrineOfBalance;
    updateWeaponSlotLabels();
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
    wipeDamages(build.weapon.m1, m1CritRows, m1CritDamageTable);
    wipeDamages(build.weapon.m2, m2CritRows, m2CritDamageTable);
    //Run the weapon damage calculation
    helper.runWeaponDamageCalculation(build, target);
    let runeDamageResult;
    let weaponArtDamageResult;
    // Run rune damage calculation when the selected rune has direct damage data.
    const rune = build.mainArmor.rune;
    const runeBaseDamageInfo = helper.getRuneBaseDamagePacket(rune);
    if (rune && runeBaseDamageInfo) {
        const attackerBuild = {
            damageScalings: rune.damageScalings,
            damageTypes: rune.damageTypes,
        };
        runeDamageResult = helper.runNonWeaponDamageCalculation(runeBaseDamageInfo, build, target, attackerBuild);
    }
    renderRunePanel(build.mainArmor.rune, runeDamageResult);
    //Run WeaponArt Damage calculation
    const weaponArt = build.weaponart;
    const weaponArtBaseDamageInfo = helper.getWeaponArtBaseDamagePacket(weaponArt);
    if (weaponArt && weaponArtBaseDamageInfo) {
        const attackerBuild = {
            damageScalings: weaponArt.damageScalings,
            damageTypes: weaponArt.damageTypes,
        };
        weaponArtDamageResult = helper.runNonWeaponDamageCalculation(weaponArtBaseDamageInfo, build, target, attackerBuild);
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
        const baseDamageInfo = helper.normalizeBaseDamagePacket(callBack.apply(build, [amount]));
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
        const baseDamageInfo = helper.normalizeBaseDamagePacket(callBack.apply(target, [getBuffEffectivePotency(target, StatusData)]));
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
    addHeaderToTable(build.weapon.m1, m1Rows, m1DamageTable, "normal");
    addHeaderToTable(build.weapon.m2, m2Rows, m2DamageTable, "normal");
    addHeaderToTable(build.weapon.m1, m1CritRows, m1CritDamageTable, "crit");
    addHeaderToTable(build.weapon.m2, m2CritRows, m2CritDamageTable, "crit");
}
function loadSelectorPage(build, source, category, section, index, htmlElement, filter, selectorTitle) {
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
        selectorTitle,
    };
    itemsSearchInput.value = filter || "";
    itemsSearchInput.style.display = "";
    itemsSelectorTitle.textContent = selectorTitle || getSelectorTitle(build, source, category);
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
            const selectorCategory = getSelectorItemCategory(build, category);
            items = ItemModule.ItemStore.getByCategory(selectorCategory);
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
                    const sourceBuild = getBuffSourceBuild(build, item);
                    const source = item.potencyId ? sourceBuild.getSourcesForBuff(item.potencyId) : {};
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
    requestAnimationFrame(() => {
        itemsSearchInput.focus();
        const cursorPosition = itemsSearchInput.value.length;
        itemsSearchInput.setSelectionRange(cursorPosition, cursorPosition);
    });
}
///////////////////////////////////////Button & input Listeners///////////////////////////////////////
SelectorClose.addEventListener("click", () => {
    hideSelector();
});
clearBuildButton.addEventListener("click", () => {
    build = new Build.Build();
    build.target = target;
    target.target = build;
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
    loadSelectorPage(activeSelectorContext.build, activeSelectorContext.source, activeSelectorContext.category, activeSelectorContext.section, activeSelectorContext.index, activeSelectorContext.htmlElement, itemsSearchInput.value, activeSelectorContext.selectorTitle);
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
targetHealthInput.addEventListener("change", () => {
    let health = Number(targetHealthInput.value);
    health = Math.floor(health);
    if (health < 1) {
        health = 1;
    }
    if (health > target.maxHp) {
        health = target.maxHp;
    }
    targetHealthInput.value = `${health.toString()}/${target.maxHp.toString()}`;
    target.hp = health;
    resetPage();
});
//add the current hp and max hp
healthInput.value = `${build.hp.toString()}/${build.maxHp.toString()}`;
targetHealthInput.value = `${target.hp.toString()}/${target.maxHp.toString()}`;
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
shrineBalanceToggle.addEventListener("change", () => {
    build.shrineOfBalance = shrineBalanceToggle.checked;
    resetPage();
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
        loadSelectorPage(build, type, itembutton.name, undefined, undefined, undefined, undefined, getSelectorTitle(build, type, itembutton.name));
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
