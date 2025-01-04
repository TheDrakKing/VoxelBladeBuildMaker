import * as ItemModule from "../models/Item.js";
import * as BuffModule from "../models/Buffs.js";
import * as Build from "../models/Build.js";
import * as helper from "./helper.js";
import * as Perk from "../models/Perk.js";
import * as GuildModule from "../models/Guild.js";


//Buttons
const infuseGearButtons =  document.querySelectorAll<HTMLButtonElement>('.infuseGear');
const mainGearButtons =  document.querySelectorAll<HTMLButtonElement>('.mainGear');
const weaponMakeUpButtons =  document.querySelectorAll<HTMLButtonElement>('.weaponMakeUp');

const clearItemButtons =  document.querySelectorAll<HTMLButtonElement>('.clear_button');
const infuseClearButtons =  document.querySelectorAll<HTMLButtonElement>('.infuse_clear_button');
const weaponClearButtons =  document.querySelectorAll<HTMLButtonElement>('.weapon_clear_button');
const guildSelector = document.getElementById("guild_selector") as HTMLButtonElement;
const promotionSelector = document.getElementById("guild_promotion") as HTMLButtonElement;

const showInfusions = document.getElementById("showInfusions") as HTMLButtonElement;
const showMainGear = document.getElementById("showMainGear") as HTMLButtonElement;

const theme_Selector_input = document.getElementById("theme_Selector_input") as HTMLInputElement;

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
const dmgModContainer = document.getElementById("damageModifications") as HTMLDivElement;

const buffs_container = document.getElementById("buffs_container") as HTMLDivElement;
const debuffs_container = document.getElementById("debuffs_container") as HTMLDivElement;

const targetBuffs_container = document.getElementById("target_buffs_container") as HTMLDivElement;
const targetDeBuffs_container = document.getElementById("target_debuffs_container") as HTMLDivElement;

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
const guildDiv = document.getElementById("guildDiv") as HTMLDivElement;
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

//images
let PlusSymbol = "/image/plus_symbol_white.png";
let CloseSymbol = "/image/close_X_white.png";


let target = new Build.Build();
//target.stats.PhysicalDefense = -50;

// Create the build object
let build = new Build.Build();
build.target = target;

let infusionImgHolders = {
  helmet: infuseHeadDiv.children[1].children[0].children[0] as HTMLImageElement,
  chestplate: infuseChestplateDiv.children[1].children[0].children[0] as HTMLImageElement,
  legging: infuseLeggingsDiv.children[1].children[0].children[0] as HTMLImageElement,
  rune: infuseRuneDiv.children[1].children[0].children[0] as HTMLImageElement,
  ring: infuseRingDiv.children[1].children[0].children[0] as HTMLImageElement,
};

let imgHolders = {
  guild: guildDiv.children[1].children[0].children[0] as HTMLImageElement,
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

const selectItemDivs: [HTMLElement, ItemModule.Item | BuffModule.Buff | GuildModule.Guild][] = [];

/////////////////////////////////////// Create HTML Elements ///////////////////////////////////////
function createStatHolder(name:string, value:number | string, ContainerDiv:HTMLElement): HTMLElement | null {
  if (statHolder_template == null) return null;

  const clonedDiv = statHolder_template.cloneNode(true) as HTMLElement;

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

function createBuffBox(buff: BuffModule.Buff, ContainerDiv:HTMLElement, source?: Build.Build): HTMLElement | null {
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
    if(source) {
      source.removeBuffToBuild(buff, buff.category);
    }else{
      build.removeBuffToBuild(buff, buff.category);
    }
    console.log("Resetting Debuff")
    resetPage();
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
  for (const [key, value] of Object.entries(build.stats) as [ItemModule.stat,number?][]) {
    if (value === undefined) continue;
    createStatHolder(key, value + "%", statsContainerDiv);
  }

  perksContainerDiv.innerHTML = "";
  for (const [key, value] of Object.entries(build.perks) as [string, number?][]) {
    if (value === undefined) continue;
    let name = Perk.PerkStore.getByID(key)?.name || key;
    createStatHolder(name, value, perksContainerDiv);
  }

  potenciesContainerDiv.innerHTML = "";
  for (const [key, value] of Object.entries(build.potencies) as [ItemModule.potency, number? ][]) {
    if (value === undefined) continue;
    createStatHolder(ItemModule.potencyAliases[key], value,potenciesContainerDiv);
  }

  damageScalingsContainerDiv.innerHTML = "";
  for (const [key, value] of Object.entries(build.damageScalings) as [ItemModule.scale, number?][]) {
    if (value === undefined) continue;
    createStatHolder(key, value, damageScalingsContainerDiv);
  }

  damageTypesContainerDiv.innerHTML = "";
  for (const [key, value] of Object.entries(build.damageTypes) as [ItemModule.scale, number?][]) {
    if (value === undefined) continue;
    createStatHolder(key, value, damageTypesContainerDiv);
  }

  dmgModContainer.innerHTML = "";
  for (const [key, value] of Object.entries(build.damageModifications.damage_bonus_mods) as [string, number][]) {
    createStatHolder(key + " Boost", (value * 100) + "%", dmgModContainer);
  };

  ////////////////////////////////////////////////Add the users Buffs and Debuffs to the page////////////////////////////////////////////////

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

  ////////////////////////////////////////////////Target Buffs and Debuffs to the page////////////////////////////////////////////////

  //Wipe Buff
  targetBuffs_container.innerHTML = "";
  cloneDiv = div?.cloneNode(true) as HTMLDivElement;
  cloneDiv.id = "selectTargetBuff";
  cloneDiv.children[0].children[0].id = "addDeBuff";
  targetBuffs_container.appendChild(cloneDiv);

  //add the new ones
  if (target.buff) {
    for (let index = 0; index < target.buff.length; index++) {
      const buff = target.buff[index];
      //console.log(buff);
      if (!buff) continue;
      createBuffBox(buff, targetBuffs_container, target);
    }
  }

  //Wipe deBuff
  targetDeBuffs_container.innerHTML = "";
  cloneDiv = div?.cloneNode(true) as HTMLDivElement;
  cloneDiv.id = "selectTargetDebuff";
  cloneDiv.children[0].children[0].id = "addDeBuff";
  targetDeBuffs_container.appendChild(cloneDiv);

  //add the new ones
  if (target.deBuffs) {
    for (let index = 0; index < target.deBuffs.length; index++) {
      const buff = target.deBuffs[index];
      if (!buff) continue;
      createBuffBox(buff, targetDeBuffs_container, target);
    }
  }

  setBuffEvents();
}

/////////////////////////////////////// Functions ///////////////////////////////////////

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
  if (htmlElement) {
    htmlElement.children[0].innerHTML = "Choose an enchantment";
  }
  
  build.removeFromBuild(key, section, enchantIndex);

  resetPage();
}

function addItemToPage(item: ItemModule.Item | GuildModule.Guild, section?: keyof Build.Build, key?:Build.gear, enchantIndex?:number, htmlElement?:HTMLElement):boolean | void {
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

function resetPage(item?: ItemModule.Item | string):boolean | void {
  ////////////////////////////////////////////////wipe the Html Elements to make way for the updates ///////////////////////////////////////////////////
  wipeStatHolders();

  //reset the Build
  build.resetBuild()

  //////////////////////// add the images to the Html pages for the item ////////////////////////

  for(const [key, element] of Object.entries(imgHolders) as [Build.gear, HTMLImageElement?][]) {
    if (!element) continue;
    let parentDiv = element.parentElement;
    let spanElement = parentDiv?.children[1] as HTMLSpanElement;

    let img = PlusSymbol;
    let name = "";

    if (key === "blade" || key == "handle" || key == "weaponArt" || key == "guild"){
      if(build[key]) {        
        img = build[key].img || "";
        name = build[key].name || "";
      }
    }else{
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
    } else {
      element.style.display = "block";
      spanElement.style.display = "none";
    }
    
  }

  for(const [key, element] of Object.entries(infusionImgHolders) as [Build.gear, HTMLImageElement?][]) {
    if (!element) continue;

    if (!element || key === "blade" || key == "handle" || key == "weaponArt" || key == "guild") continue;
    element.src == build.infuseArmor[key]?.img || "";
    element.alt = build.infuseArmor[key]?.name || "";

    let parentDiv = element.parentElement;
    let spanElement = parentDiv?.children[1] as HTMLSpanElement;

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
    } else {
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
  } else {
    weaponTypeText.innerHTML = "Weapon Type: None";
  }

  //////////////////////// Run the displayStats() to add show the build stats ////////////////////////
  displayStats();

  //Displays the Damages to the table
  addHeaderToTable(build.m1, m1Rows, m1DamageTable);
  addHeaderToTable(build.m2, m2Rows, m2DamageTable);
}

function loadSelectorPage(build:Build.Build, source:string, category: string, section?: keyof Build.Build, index?:number, htmlElement?:HTMLElement):string | void {
  //Set a Dummy Item to act has a remove
  let blankItem = new ItemModule.Item()
  blankItem.name = "none";
  blankItem.id = "none";
  blankItem.img = CloseSymbol;

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
  } else if (source == "Guilds") {
    items = GuildModule.GuildStore.all();
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
        //Clear out the selectItemDivs and there listeners
        selectItemDivs.forEach(([div]) => div.remove());
        // Clear the selectItemDivs array
        selectItemDivs.length = 0;

        items_selector.style.display = "none";

        if (item instanceof ItemModule.Item || item instanceof GuildModule.Guild) {
          addItemToPage(item, section, key, index, htmlElement);
        } else if (item instanceof BuffModule.Buff) {
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
    level = 80
  }else if (level < 1) {
    level = 1
  }

  levelInput.value = level.toString();

  build.level = level;

  resetPage();
});

theme_Selector_input.addEventListener("change", () => {
  const currentTheme = document.documentElement.getAttribute("data-theme");
  const newTheme = currentTheme === "dark" ? "light" : "dark";
  if(newTheme === "dark") {
    PlusSymbol = "/image/plus_symbol_white.png";
    CloseSymbol = "/image/close_X_white.png";
  }else{
    PlusSymbol = "/image/plus_symbol_black.png";
    CloseSymbol = "/image/close_X_black.png";
  }
  document.documentElement.setAttribute("data-theme", newTheme);
  setItemButtonImage();
  resetPage()
});

promotionSelector.addEventListener("change", () => {
  let promotion = Number(promotionSelector.value);
  build.guildPromotion = Number(promotion - 1);
  resetPage();
});;

///////////////////////////////////////Add the Items///////////////////////////////////////
function setItemButtonImage() {
  mainGearButtons.forEach((itembutton: HTMLButtonElement) => {
    let buttonImage = itembutton.children[0] as HTMLImageElement;
    buttonImage.src = PlusSymbol;
  });

  infuseGearButtons.forEach((itembutton: HTMLButtonElement) => {
    let buttonImage = itembutton.children[0] as HTMLImageElement;
    buttonImage.src = PlusSymbol;
  });

  weaponMakeUpButtons.forEach((itembutton: HTMLButtonElement) => {
    let buttonImage = itembutton.children[0] as HTMLImageElement;
    buttonImage.src = PlusSymbol;
  });

  let guildImage = guildSelector.children[0] as HTMLImageElement;
  guildImage.src = PlusSymbol;
}

mainGearButtons.forEach((itembutton: HTMLButtonElement) => {
  let buttonImage = itembutton.children[0] as HTMLImageElement;
  buttonImage.src = PlusSymbol;

  itembutton.addEventListener("click", () => {
    loadSelectorPage(build, "Items", itembutton.name, "mainArmor");
  });

  let itemBox = itembutton.parentElement?.parentElement as HTMLDivElement;

  let enchantmentsContainer = itemBox.children[1] as HTMLDivElement;

  for (let index = 0; index < enchantmentsContainer.children.length; index++) {
    const enchantSelector = enchantmentsContainer.children[
      index
    ] as HTMLButtonElement;

    enchantSelector.addEventListener("click", () => {
      loadSelectorPage(
        build,
        "Items",
        enchantSelector.name,
        "enchantments",
        index,
        enchantSelector
      );
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

  upgradeSelector.addEventListener("change", (event) => {
    let upgradeNumber = upgradeSelector.value;
    let key = upgradeSelector.name.toLowerCase() as keyof Build.Armor;
    if (!key || !upgradeNumber || !build.mainArmor[key]) return;
    build.mainArmor[key].upgrade = Number(upgradeNumber);
    resetPage();
  });
});

infuseGearButtons.forEach((itembutton: HTMLButtonElement) => {
  let buttonImage = itembutton.children[0] as HTMLImageElement;
  buttonImage.src = PlusSymbol;
  itembutton.addEventListener("click", () => {
    loadSelectorPage(build, "Items", itembutton.name, "infuseArmor");
  });
});

weaponMakeUpButtons.forEach((itembutton: HTMLButtonElement) => {
  let buttonImage = itembutton.children[0] as HTMLImageElement;
  buttonImage.src = PlusSymbol;
  itembutton.addEventListener("click", () => {
    loadSelectorPage(build, "Items", itembutton.name);
  });
});

guildSelector.addEventListener("click", () => {
  loadSelectorPage(build, "Guilds", "Guild");
});
//////////////////////////Set the add buff/Debuff buttons//////////////////////////
function setBuffEvents(){
  const selectBuff = document.getElementById("selectbuff") as HTMLButtonElement;
  const selectDebuff = document.getElementById("selectdebuff") as HTMLButtonElement;

  const selectTargetBuff = document.getElementById("selectTargetBuff") as HTMLButtonElement;
  const selectTargetDebuff = document.getElementById("selectTargetDebuff") as HTMLButtonElement;

  (selectBuff.children[0].children[0].children[0] as HTMLImageElement).src = PlusSymbol;
  selectBuff?.addEventListener("click", () => {
    loadSelectorPage(build,"Buffs", "Buff");
  });

  (selectDebuff.children[0].children[0].children[0] as HTMLImageElement).src = PlusSymbol;
  selectDebuff?.addEventListener("click", () => {
    loadSelectorPage(build, "Buffs", "Debuff");
  });

  (selectTargetBuff.children[0].children[0].children[0] as HTMLImageElement).src = PlusSymbol;
  selectTargetBuff?.addEventListener("click", () => {
    loadSelectorPage(target, "Buffs", "Buff");
  });

  (selectTargetDebuff.children[0].children[0].children[0] as HTMLImageElement).src = PlusSymbol;
  selectTargetDebuff?.addEventListener("click", () => {
    loadSelectorPage(target, "Buffs", "Debuff");
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

document.getElementById("guild_clear_button")?.addEventListener("click", () => {
  removeFromBuild("guild", undefined);
});
setItemButtonImage();
setBuffEvents();