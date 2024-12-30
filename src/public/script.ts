import * as ItemModule from "../models/Item.js";
import * as BuffModule from "../models/Buffs.js";
import * as WeaponTypes from "../models/WeaponTypes.js";
import * as Build from "../models/Build.js";
import * as helper from "./helper.js";
import * as targets from "./targets.js";
import { Socket } from "node:dgram";

//Buttons
const infuseGearButtons =  document.querySelectorAll<HTMLButtonElement>('.infuseGear');
const mainGearButtons =  document.querySelectorAll<HTMLButtonElement>('.mainGear');
const weaponMakeUpButtons =  document.querySelectorAll<HTMLButtonElement>('.weaponMakeUp');

const clearItemButtons =  document.querySelectorAll<HTMLButtonElement>('.clear_button');
const infuseClearButtons =  document.querySelectorAll<HTMLButtonElement>('.infuse_clear_button');
const weaponClearButtons =  document.querySelectorAll<HTMLButtonElement>('.weapon_clear_button');

const showInfusions = document.getElementById("showInfusions") as HTMLButtonElement;
const showMainGear = document.getElementById("showMainGear") as HTMLButtonElement;

//Level, Hp and Weapon Txt
const weaponTypeText = document.getElementById("weapon_type_text") as HTMLSpanElement;
const healthInput = document.getElementById("hpValue") as HTMLInputElement;
const levelInput = document.getElementById("levelValue") as HTMLInputElement;

//Containers
const infusionsContentDiv = document.getElementById("infusions_gear") as HTMLDivElement;
const mainGearContentDiv = document.getElementById("main_gear") as HTMLDivElement;
const weaponContentDiv = document.getElementById("weaponDiv") as HTMLDivElement;

const items_selector = document.getElementById("itemsSelectorDiv") as HTMLDivElement;
const SelectorClose = document.getElementById("close_items_selector") as HTMLButtonElement;

const items_container = document.getElementById("itemsContainer") as HTMLDivElement;

const buffs_container = document.getElementById("buffs_container") as HTMLDivElement;
const debuffs_container = document.getElementById("debuffs_container") as HTMLDivElement;

//template
const selectItem_template = document.getElementById("selectItem_template") as HTMLDivElement;
const statHolder_template = document.getElementById("statHolder_template") as HTMLDivElement;
const buff_template = document.getElementById("buff_template") as HTMLDivElement;

//Armor
const headDiv = document.getElementById("headDiv") as HTMLDivElement;
const chestplateDiv = document.getElementById("chestplateDiv") as HTMLDivElement;
const leggingsDiv = document.getElementById("leggingsDiv") as HTMLDivElement;
const runeDiv = document.getElementById("runeDiv") as HTMLDivElement;
const ringDiv = document.getElementById("ringDiv") as HTMLDivElement;

//Weapon
const bladeDiv = document.getElementById("bladeDiv") as HTMLDivElement;
const handleDiv = document.getElementById("handleDiv") as HTMLDivElement;
const weaponArtDiv = document.getElementById("weaponArtDiv") as HTMLDivElement;

//Infuse Armor
const infuseHeadDiv = document.getElementById("infuse_headDiv") as HTMLDivElement;
const infuseChestplateDiv = document.getElementById("infuse_chestplateDiv") as HTMLDivElement;
const infuseLeggingsDiv = document.getElementById("infuse_leggingsDiv") as HTMLDivElement;
const infuseRuneDiv = document.getElementById("infuse_runeDiv") as HTMLDivElement;
const infuseRingDiv = document.getElementById("infuse_ringDiv") as HTMLDivElement;

//stats Display divs
const statsContainerDiv = document.getElementById("stats") as HTMLDivElement;
const perksContainerDiv = document.getElementById("perks") as HTMLDivElement;
const potenciesContainerDiv = document.getElementById("potencies") as HTMLDivElement;
const damageScalingsContainerDiv = document.getElementById("damageScalings") as HTMLDivElement;
const damageTypesContainerDiv = document.getElementById("damageTypes") as HTMLDivElement;

//Table
const m1DamageTable = document.getElementById("m1_damage_table") as HTMLDivElement;
const m2DamageTable = document.getElementById("m2_damage_table") as HTMLDivElement;
const damageHeaderTemplate = document.getElementById("damage_header") as HTMLDivElement;
const damageRowTemplate = document.getElementById("damage_row_template") as HTMLDivElement;

// Create the build object
let build: Build.Build = {
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
 m1:[],
 m2:[]
};

let target: Build.Build = {
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
  m2: [],
};

let infusionImgHolders = {
  helmet: infuseHeadDiv.children[1].children[0].children[0] as HTMLImageElement,
  chestplate: infuseChestplateDiv.children[1].children[0].children[0] as HTMLImageElement,
  legging: infuseLeggingsDiv.children[1].children[0].children[0] as HTMLImageElement,
  rune: infuseRuneDiv.children[1].children[0].children[0] as HTMLImageElement,
  ring: infuseRingDiv.children[1].children[0].children[0] as HTMLImageElement,
};

let imgHolders = {
  blade: bladeDiv.children[1].children[0].children[0] as HTMLImageElement,
  handle: handleDiv.children[1].children[0].children[0] as HTMLImageElement,
  helmet: headDiv.children[2].children[0].children[0] as HTMLImageElement,
  chestplate: chestplateDiv.children[2].children[0].children[0] as HTMLImageElement,
  legging: leggingsDiv.children[2].children[0].children[0] as HTMLImageElement,
  rune: runeDiv.children[2].children[0].children[0] as HTMLImageElement,
  ring: ringDiv.children[2].children[0].children[0] as HTMLImageElement,
  weaponArt: weaponArtDiv.children[1].children[0].children[0] as HTMLImageElement,
};

type damageholderRows = { [k in ItemModule.damageType]?: HTMLElement };

let m1Rows:damageholderRows = {}
let m2Rows: damageholderRows = {};

const selectItemDivs: [HTMLElement, ItemModule.Item | BuffModule.Buff][] = [];

/////////////////////////////////////// Create HTML Elements ///////////////////////////////////////
function createStatHolder(name:string, value:number, ContainerDiv:HTMLElement): HTMLElement | null {
  if (statHolder_template == null) return null;

  const clonedDiv = statHolder_template.cloneNode(true) as HTMLElement;

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

function createItemBox(item: ItemModule.Item | BuffModule.Buff): HTMLElement | null {
  if (selectItem_template == null) return null;

  const clonedDiv = selectItem_template.cloneNode(true) as HTMLElement;

  // Optionally, update the cloned div (e.g., clear input fields)
  const inputs = clonedDiv.querySelectorAll("input");
  inputs.forEach((input) => (input.value = ""));

  clonedDiv.style.display = "flex";

  var itemBoxImg = clonedDiv.children[0].children[0].children[0] as HTMLImageElement;
  itemBoxImg.src = item.img ? item.img : "";
  itemBoxImg.alt = item.name ? item.name : "";

  var itemBoxspan = clonedDiv.children[0].children[0].children[1] as HTMLSpanElement;
  itemBoxspan.innerHTML = item.name ? item.name : "";

  if (!item.img) {itemBoxImg.style.display = "none"} else {itemBoxspan.style.display = "none"} ;

  // Create a clickable link for each game
  items_container?.appendChild(clonedDiv);
  return clonedDiv;
}

function createBuffBox(buff: BuffModule.Buff, ContainerDiv:HTMLElement): HTMLElement | null {
  if (buff_template == null) return null;

  const clonedDiv = buff_template.cloneNode(true) as HTMLElement;

  // Optionally, update the cloned div (e.g., clear input fields)
  const inputs = clonedDiv.querySelectorAll("input");
  inputs.forEach((input) => (input.value = ""));

  clonedDiv.style.display = "flex";

  var itemBoxImg = clonedDiv.children[0].children[0].children[0] as HTMLImageElement;
  itemBoxImg.src = buff.img ? buff.img : "";
  itemBoxImg.alt = buff.name ? buff.name : "";

  var itemBoxspan = clonedDiv.children[0].children[0].children[1] as HTMLSpanElement;
  itemBoxspan.innerHTML = buff.name ? buff.name : "";

  var itemButton = clonedDiv.children[0].children[0] as HTMLButtonElement;

  if (!buff.img) {itemBoxImg.style.display = "none"} else {itemBoxspan.style.display = "none"} ;

  itemButton?.addEventListener("click", () => {
    removeBuffToBuild(buff, buff.category);
  });

  // Create a clickable link for each game
  ContainerDiv?.appendChild(clonedDiv);
  return clonedDiv;
}

function addHeaderToTable(atkSource:  Build.outputDamage[], holderRows:damageholderRows, ContainerDiv:HTMLElement) {
  if (damageHeaderTemplate == null) return null;

  for (let index = 0; index < atkSource.length; index++) {
    const headerCell = damageHeaderTemplate.cloneNode(true) as HTMLElement;
    headerCell.children[0].innerHTML = (index + 1).toString();
    // Create a clickable link for each game
    ContainerDiv?.children[0].children[0].appendChild(headerCell);
    //add the da
    for (const [key, value] of Object.entries(atkSource[index]) as [ ItemModule.damageType, number?][]) {
      if (value === undefined) continue;
      addDamageToTable(key, value, holderRows, ContainerDiv);
    }
  }
  
}

function addDamageToTable(name: ItemModule.damageType, value:number, holderRows:damageholderRows, ContainerDiv: HTMLElement) {
  if (damageRowTemplate == null) return null;

  let clonedDiv: HTMLElement;

  if (holderRows[name]) {
    clonedDiv = holderRows[name];
  } else {
    clonedDiv = damageRowTemplate.cloneNode(true) as HTMLElement;
    clonedDiv.style.display = "";
    clonedDiv.id = name;
    clonedDiv.children[0].innerHTML = name;
    ContainerDiv?.children[0].appendChild(clonedDiv);
    holderRows[name] = clonedDiv;
  }

  const headerRowCell = clonedDiv?.children[0] as HTMLTableCellElement;

  const damageValueCell = headerRowCell.cloneNode(true) as HTMLElement;
  damageValueCell.innerHTML = value.toString();

  clonedDiv?.appendChild(damageValueCell);
}

function displayStats(){
  //Create the stat Holder for reach stat
  statsContainerDiv.innerHTML = "";
  for (const [key, value] of Object.entries(build.stats) as [
    ItemModule.stat,
    number?
  ][]) {
    if (value === undefined) continue;
    createStatHolder(key, value, statsContainerDiv);
  }

  perksContainerDiv.innerHTML = "";
  for (const [key, value] of Object.entries(build.perks) as [
    string,
    number?
  ][]) {
    if (value === undefined) continue;
    createStatHolder(key, value, perksContainerDiv);
  }

  potenciesContainerDiv.innerHTML = "";
  for (const [key, value] of Object.entries(build.potencies) as [
    ItemModule.potency,
    number?
  ][]) {
    if (value === undefined) continue;
    createStatHolder(
      ItemModule.potencyAliases[key],
      value,
      potenciesContainerDiv
    );
  }

  damageScalingsContainerDiv.innerHTML = "";
  for (const [key, value] of Object.entries(build.damageScalings) as [
    ItemModule.scale,
    number?
  ][]) {
    if (value === undefined) continue;
    createStatHolder(key, value, damageScalingsContainerDiv);
  }

  damageTypesContainerDiv.innerHTML = "";
  for (const [key, value] of Object.entries(build.damageTypes) as [
    ItemModule.scale,
    number?
  ][]) {
    if (value === undefined) continue;
    createStatHolder(key, value, damageTypesContainerDiv);
  }

  let div = document.getElementById("selectbuff");

  //Wipe Buff
  buffs_container.innerHTML = "";
  let cloneDiv = div?.cloneNode(true) as HTMLDivElement;
  buffs_container.appendChild(cloneDiv);

  //add the new ones
  if (build.buff) {
    for (let index = 0; index < build.buff.length; index++) {
      const buff = build.buff[index];
      //console.log(buff);
      if (!buff) continue;
      createBuffBox(buff, buffs_container);
    }
  }

  //Wipe deBuff
  debuffs_container.innerHTML = "";
  cloneDiv = div?.cloneNode(true) as HTMLDivElement;
  cloneDiv.id = "selectdebuff";
  cloneDiv.children[0].children[0].id = "addDeBuff";
  debuffs_container.appendChild(cloneDiv);

  //add the new ones
  if (build.deBuffs) {
    for (let index = 0; index < build.deBuffs.length; index++) {
      const buff = build.deBuffs[index];
      if (!buff) continue;
      createBuffBox(buff, debuffs_container);
    }
  }

  setBuffEvents();
}

/////////////////////////////////////// Functions ///////////////////////////////////////

function addItemStatsToBuild(item?: ItemModule.Item, isInfuse?:boolean, key?:keyof Build.Armor) {
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
            if (!build.enchantments[key][index]) continue;
            const enchantment = build.enchantments[key][index] as ItemModule.Item;
            if (!enchantment.onArmorStatModified) continue;
            let args: [number?, Build.stats?] = [1, stats];
            enchantment.onArmorStatModified.apply(build, args);
          }
        }
      }

      //Adds the stats to the Build
      for (const [key, value] of Object.entries(stats) as [ItemModule.stat,number?][]) {
        // key is a string, value is a number or undefined
        if (value === undefined) continue;
        let amount = value;
        let previousValue = build.stats[key];
        if (isInfuse) amount = value / 2;
        build.stats[key] = previousValue ? previousValue + amount : amount;
      }
    }

    if (item.perks) {
      for (const [key, value] of Object.entries(item.perks) as [
        string,
        number?
      ][]) {
        // key is a string, value is a number or undefined
        if (value === undefined) continue;
        let previousValue = build.perks[key];
        build.perks[key] = previousValue ? previousValue + value : value;
      }
    }

    if (item.potencies) {
      for (const [key, value] of Object.entries(item.potencies) as [
        ItemModule.potency,
        number?
      ][]) {
        // key is a string, value is a number or undefined
        if (value === undefined) continue;
        let previousValue = build.potencies[key];
        build.potencies[key] = previousValue ? previousValue + value : value;
      }
    }

    if (item.damageScalings) {
      for (const [key, value] of Object.entries(item.damageScalings) as [
        ItemModule.scale,
        number?
      ][]) {
        // key is a string, value is a number or undefined
        if (value === undefined) continue;
        let previousValue = build.damageScalings[key];
        build.damageScalings[key] = previousValue ? previousValue + value : value;
      }
    }

    if (item.damageTypes) {
      for (const [key, value] of Object.entries(item.damageTypes) as [
        ItemModule.damageType,
        number?
      ][]) {
        // key is a string, value is a number or undefined
        if (value === undefined) continue;
        let previousValue = build.damageTypes[key];
        build.damageTypes[key] = previousValue ? previousValue + value : value;
      }
    }
  }
}

function wipeStatHolders(){
  Object.keys(build.potencies).forEach((key) => delete build.potencies[key as ItemModule.potency]);
  Object.keys(build.stats).forEach((key) => delete build.stats[key as ItemModule.stat]);
  Object.keys(build.effectiveBoosts).forEach((key) => delete build.effectiveBoosts[key as ItemModule.stat]);
  Object.keys(build.perks).forEach((key) => delete build.perks[key as ItemModule.potency]);
  Object.keys(build.damageScalings).forEach((key) => delete build.damageScalings[key as ItemModule.scale]);
  Object.keys(build.damageTypes).forEach((key) => delete build.damageTypes[key as ItemModule.damageType]);
}

function wipeDamages(
  atkSource: Build.outputDamage[],
  holderRows: damageholderRows,
  ContainerDiv: HTMLElement
) {
  ContainerDiv.children[0].children[0].innerHTML = "";

  const damageheader = damageHeaderTemplate.cloneNode(true) as HTMLElement;
  damageheader.id = "damage_header";
  ContainerDiv?.children[0].children[0].appendChild(damageheader);

  Object.keys(holderRows).forEach((key) => {
    holderRows[key as ItemModule.damageType]?.remove();
    delete holderRows[key as ItemModule.damageType];
  });

  atkSource.forEach((outputDamage: Build.outputDamage) => {
    Object.keys(outputDamage).forEach(
      (key) => delete outputDamage[key as ItemModule.damageType]
    );
  });

  atkSource.length = 0;
}

function removeFromBuild(key:Build.gear, section?: keyof Build.Build, enchantIndex?:number, htmlElement?:HTMLElement):boolean | void {
  if (section !== "enchantments") {
    key = key.toLowerCase() as Build.gear;
  }
  
  if (key == "blade" || key == "handle" || key == "weaponArt") {
    delete build[key];
    imgHolders[key].src = "/Plus_symbol.png";
    imgHolders[key].alt = "add Item";
  } else if (section) {
    if (section == "infuseArmor" || section == "mainArmor") {
      delete build[section][key];
      if (section == "infuseArmor") {
        infusionImgHolders[key].src = "/Plus_symbol.png";
        infusionImgHolders[key].alt = "add Item";
      } else {
        imgHolders[key].src = "/Plus_symbol.png";
        imgHolders[key].alt = "add Item";
      }
    } else if (section === "enchantments" && enchantIndex != undefined) {
      if (!build.enchantments[key]) return;
      delete build.enchantments[key]![enchantIndex];
      if (htmlElement) {
        htmlElement.children[0].innerHTML = "Choose an enchantment";
      }
    }
  } else {
    return;
  }

  resetBuild();
}

function addItemToBuild(item: ItemModule.Item | string, section?: keyof Build.Build, key?:Build.gear, enchantIndex?:number, htmlElement?:HTMLElement):boolean | void {
  //Clear out the selectItemDivs and there listeners
  selectItemDivs.forEach(([div]) => div.remove());
  // Clear the selectItemDivs array
  selectItemDivs.length = 0;

  items_selector.style.display = "none";

  if (section !== "enchantments") {
    if (typeof item == "string") {
      key = item.toLowerCase() as Build.gear;
    } else if (item instanceof ItemModule.Item) {
      key = item.category === "Armor" ? (item.type?.toLowerCase()! as Build.gear) : (item.category?.toLowerCase() as Build.gear);
    }
  }

  if (!key || item instanceof ItemModule.Item === false) return;

  if (key == "blade" || key == "handle" || key == "weaponArt") {
    build[key] = item;
    imgHolders[key].src = item.img ? item.img : "";
    imgHolders[key].alt = item.name;
  } else if (section) {
    if (section === "infuseArmor" || section === "mainArmor") {
      build[section][key] = item;
      if (section === "infuseArmor") {
        infusionImgHolders[key].src = item.img ? item.img : "";
        infusionImgHolders[key].alt = item.name;
      } else {
        imgHolders[key].src = item.img ? item.img : "";
        imgHolders[key].alt = item.name;
      }
    } else if (section === "enchantments" && enchantIndex != undefined) {
      if (!build.enchantments[key]) build.enchantments[key] = [];
      build.enchantments[key]![enchantIndex] = item;
      if (htmlElement) {
        htmlElement.children[0].innerHTML = item.name;
      }
    }
  }

  resetBuild();
}

function findBuffInBuild(buffToFind: string, category: string): BuffModule.Buff | null | undefined {
  let array: Build.buffs | undefined;

  if (category == "Buff") {
    if (!build.buff) return null;
    array = build.buff;
  } else {
    if (!build.deBuffs) return null;
    array = build.deBuffs;
  }

  let buff = array.find((buff) => buff?.id === buffToFind);
  return buff;
}

function removeBuffToBuild(buffToFind: string | BuffModule.Buff, category:string) {
  if (buffToFind instanceof BuffModule.Buff) {
    buffToFind = buffToFind.id;
  }

  let buff = findBuffInBuild(buffToFind, category);

  if (!buff) return;

  let array: Build.buffs | undefined;

  if (category == "Buff") {
    if (!build.buff) return;
    let indexToFind = build.buff.indexOf(buff);
    delete build.buff[indexToFind];
    build.buff = build.buff.filter((_, index) => index !== indexToFind); // Remove element at index 0
  } else {
    if (!build.deBuffs) return;
    let indexToFind = build.deBuffs.indexOf(buff);
    delete build.deBuffs[indexToFind];
    build.deBuffs = build.deBuffs.filter((_, index) => index !== indexToFind); // Remove element at index 0
  }

  // console.log(build.buff);
  // console.log(build.buff?.length);

  resetBuild();
}

function addBuffToBuild(buff: BuffModule.Buff) {
  //Clear out the selectItemDivs and there listeners
  selectItemDivs.forEach(([div]) => div.remove());
  // Clear the selectItemDivs array
  selectItemDivs.length = 0;
  //reset the items selector element to none
  items_selector.style.display = "none";

  if (findBuffInBuild(buff.id, buff.category)) return; // that buff is already in the build

  if (buff.category == "Buff") {
    if (!build.buff) build.buff = [];
    build.buff.push(buff);
  } else {
    if (!build.deBuffs) build.deBuffs = [];
    build.deBuffs.push(buff);
  }

  // console.log(build.buff);
  // console.log(build.buff?.length);

  resetBuild();
}

function resetBuild(item?: ItemModule.Item | string):boolean | void {
  ////////////////////////////////////////////////wipe the Html Elements to make way for the updates ///////////////////////////////////////////////////
  wipeStatHolders();
  build.totEffBoost = 0;

  ////////////////////////////////////////////////Add the Item stats, perks etc to the stat containers///////////////////////////////////////////////////
  if (build.blade) addItemStatsToBuild(build.blade);
  if (build.handle) addItemStatsToBuild(build.handle);
  if (build.weaponArt) addItemStatsToBuild(build.weaponArt);

  for (const [key, value] of Object.entries(build.enchantments) as [
    keyof Build.Armor,
    []
  ][]) {
    // key is a string, value is a number or undefined
    if (value === undefined) continue;
    for (let index = 0; index < value.length; index++) {
      const enchantment = value[index] as ItemModule.Item;
      addItemStatsToBuild(enchantment);
    }
  }

  for (const [key, value] of Object.entries(build.infuseArmor) as [
    string,
    ItemModule.Item?
  ][]) {
    if (value === undefined) continue;
    addItemStatsToBuild(value, true);
  }

  for (const [key, value] of Object.entries(build.mainArmor) as [
    keyof Build.Armor,
    ItemModule.Item?
  ][]) {
    if (value === undefined) continue;
    addItemStatsToBuild(value, false, key);
  }

  addItemStatsToBuild(); // incase none of the others did run

  //////////////////////// Enchants activation ////////////////////////

  for (const [key, value] of Object.entries(build.enchantments) as [
    keyof Build.Armor,
    []
  ][]) {
    // key is a string, value is a number or undefined
    if (value === undefined) continue;
    for (let index = 0; index < value.length; index++) {
      if (!value[index]) continue;
      const enchantment = value[index] as ItemModule.Item;
      if (!enchantment.onStatCalculation || !build.mainArmor[key]) continue;
      enchantment.onStatCalculation.apply(build);
    }
  }

  //////////////////////// Perk activation ////////////////////////

  //////////////////////// Run the displayStats() to add show the build stats ////////////////////////
  displayStats();

  //////////////////////// Damage Calcautuons ////////////////////////
  //Clears the damage from the tables
  wipeDamages(build.m1, m1Rows, m1DamageTable);
  wipeDamages(build.m2, m2Rows, m2DamageTable);
  //Rune the damage calculation

  build.constructionType = undefined;

  helper.runDamageCalculation(build, target);

  if (build.constructionType) {
    weaponTypeText.innerHTML = "Weapon Type: " + build.constructionType;
  } else {
    weaponTypeText.innerHTML = "Weapon Type: None";
  }

  //Displays the Damages to the table
  addHeaderToTable(build.m1, m1Rows, m1DamageTable);
  addHeaderToTable(build.m2, m2Rows, m2DamageTable);
}

function loadSelectorPage(source:string, category: string, section?: keyof Build.Build, index?:number, htmlElement?:HTMLElement):string | void {
  //Set a Dummy Item to act has a remove
  let blankItem = new ItemModule.Item()
  blankItem.name = "none";
  blankItem.id = "none";
  blankItem.img = "/close_X.png";

  let removeItemBox = createItemBox(blankItem);
  selectItemDivs.push([removeItemBox!, blankItem]);

  let key = category.toLowerCase() as Build.gear;

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
    } else {
      items = ItemModule.ItemStore.getByCategory(category);
    }
  } else if (source == "Buffs") {
    items = BuffModule.BuffStore.getByCategory(category);
  }

  items?.forEach((item) => {
    let itemBox = createItemBox(item);
    if (!itemBox) return;
    selectItemDivs.push([itemBox, item]);
  });

  selectItemDivs.forEach(([itemBox, item]) => {
    if (itemBox != removeItemBox) {
       var itemBoxButton = itemBox.children[0].children[0] as HTMLButtonElement;
       itemBoxButton.addEventListener("click", () => {
        if (item instanceof ItemModule.Item) {
          addItemToBuild(item, section, key, index, htmlElement);
        }else if (item instanceof BuffModule.Buff) {
          addBuffToBuild(item);
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
    level = 80
  }else if (level < 1) {
    level = 1
  }

  levelInput.value = level.toString();

  build.level = level;

  resetBuild();
});

///////////////////////////////////////Add the Items///////////////////////////////////////
mainGearButtons.forEach((itembutton: HTMLButtonElement) => {
  itembutton.addEventListener("click", () => {
    loadSelectorPage("Items", itembutton.name, "mainArmor");
  });

  let itemBox = itembutton.parentElement?.parentElement as HTMLDivElement;

  let enchantmentsContainer = itemBox.children[1] as HTMLDivElement;

  for (let index = 0; index < enchantmentsContainer.children.length; index++) {
    const enchantSelector = enchantmentsContainer.children[index] as HTMLButtonElement;

    enchantSelector.addEventListener("click", () => {
      loadSelectorPage("Items", enchantSelector.name, "enchantments", index, enchantSelector);
    });
  }

  let showEnchantments = itemBox.children[0].children[2] as HTMLButtonElement;

  showEnchantments.addEventListener("click", () => {
    if (enchantmentsContainer.style.display === "flex") {
      enchantmentsContainer.style.display = "none";
      (itemBox.children[2] as HTMLDivElement).style.display = "flex";
    } else {
      (itemBox.children[2] as HTMLDivElement).style.display = "none";
      enchantmentsContainer.style.display = "flex";
    }
  });

  let upgradeSelector = itemBox.children[0].children[3] as HTMLButtonElement;

  upgradeSelector.addEventListener('change', (event) => {
    let upgradeNumber = upgradeSelector.value;
    let key = upgradeSelector.name.toLowerCase() as keyof Build.Armor;
    if (!key || !upgradeNumber || !build.mainArmor[key]) return;
    build.mainArmor[key].upgrade = Number(upgradeNumber);
    resetBuild();
  });
});

infuseGearButtons.forEach((itembutton: HTMLButtonElement) => {
  itembutton.addEventListener("click", () => {
    loadSelectorPage("Items", itembutton.name, "infuseArmor");
  });
});

weaponMakeUpButtons.forEach((itembutton: HTMLButtonElement) => {
  itembutton.addEventListener("click", () => {
    loadSelectorPage("Items",itembutton.name);
  });
});

function setBuffEvents(){
  const selectBuff = document.getElementById("selectbuff") as HTMLButtonElement;
  const selectDebuff = document.getElementById("selectdebuff") as HTMLButtonElement;

  const selectTargetBuff = document.getElementById("selectTargetBuff") as HTMLButtonElement;
  const selectTargetDebuff = document.getElementById("selectTargetDebuff") as HTMLButtonElement;

  selectBuff?.addEventListener("click", () => {
    loadSelectorPage("Buffs", "Buff");
  });

  selectDebuff?.addEventListener("click", () => {
    loadSelectorPage("Buffs", "Debuff");
  });
}

///////////////////////////////////////Clear out the items///////////////////////////////////////
infuseClearButtons.forEach((clearbutton: HTMLButtonElement) => {
  clearbutton.addEventListener("click", () => {
    removeFromBuild(clearbutton.name as Build.gear, "infuseArmor");
  });
});

clearItemButtons.forEach((clearbutton: HTMLButtonElement) => {
  clearbutton.addEventListener("click", () => {
    removeFromBuild(clearbutton.name as Build.gear, "mainArmor");
  });
});

weaponClearButtons.forEach((clearbutton: HTMLButtonElement) => {
  clearbutton.addEventListener("click", () => {
    removeFromBuild(clearbutton.name as Build.gear, undefined);
  });
});

setBuffEvents();