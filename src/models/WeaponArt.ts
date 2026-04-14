import * as Item from "./Item.js";
import * as Build from "./Build.js";
import { WeaponArts } from "../data/WeaponArts.js";

export type weaponArtDataTable = { [id: string]: WeaponArt };
const weaponArtTable: weaponArtDataTable = WeaponArts;

export class WeaponArt {
  id: string;
  name: string;
  category?: string;
  description?: string;
  coolDown?: number;
  baseDamage?: number;
  totalHits?: number;
  /**
   * For addtive potecny that get applied to the over build, and can be added to soruce potency
   */
  potencies?: { [k in Item.potency]?: number };
  /**
   * source potencies don't get added to the build, they are for exmaple rage run which has base 0.3 potency when actvited
   */
  sourcepotencies?: { [k in Item.potency]?: number };
  /**
   * WeaponArt damageScalings are only for that WeaponArt when it doing damage
   * when a weapon art has undefined for scaling that means it's gonna use the build scaling when caling damage
   */
  damageScalings?: { [k in Item.scale]?: number };
  /**
   * WeaponArt damageTypes are only for that WeaponArt when it doing damage
   * when a weapon art has undefined for damageTypes that means it's gonna use the build damageTypes when caling damage
   */
  damageTypes?: { [k in Item.damageType]?: number };
  /**
   * What weapon type can use this weapon Art,
   * Some wepon art have no Requirements on weaponType
   */
  weaponTypeRequirements?: string[]
  /**
   * if the weapon art need specific guilds to work
   */
  guildRequirements?: string[]
  /**
   * what scales does the user build need to use this weaponArt
   * Some wepon art have no Requirements on scales
   */
  scalingRequirements?: { [k in Item.scale]?: number };
  /**
   * what stats does the user build need to use this weaponArt
   * Some wepon art have no Requirements on stats
   */
  statsRequirements?: { [k in Item.stat]?: number };
  img?:string;

  constructor(data?: any) {
    this.id = data?.id || undefined;
    this.name = data?.name || "";
    this.category = data?.category || "WeaponArt";
    this.description = data?.description || "";
    this.coolDown = data?.coolDown || 1;
    this.baseDamage = data?.baseDamage || undefined;
    this.totalHits = data?.totalHits || undefined;
    this.potencies = data?.potencies || undefined;
    this.scalingRequirements = data?.scalingRequirements || undefined;
    this.damageScalings = data?.damageScalings || undefined;
    this.damageTypes = data?.damageTypes || undefined;
    this.weaponTypeRequirements = data?.weaponTypeRequirements || undefined;
    this.guildRequirements = data?.guildRequirements || undefined;
    this.scalingRequirements = data?.scalingRequirements || undefined;
    this.statsRequirements = data?.statsRequirements || undefined;
    this.img = data?.img || "";
  }
}

export class WeaponArtStore {
  static readonly weaponArtCache = new Map<string, WeaponArt>();
  static allCache: readonly WeaponArt[] | null = null;
  static weaponArtNames: readonly string[] = [];

  constructor() {}

  static get(name?: string | WeaponArt): WeaponArt {
    if (name && typeof name !== "string") return name;

    name = (name || "").trim();
    const id = Item.toID(name);
    return this.getByID(id);
  }

  static getByID(id: string): WeaponArt {
    let weaponArt = this.weaponArtCache.get(id);
    if (weaponArt) return Object.assign(new WeaponArt(), weaponArt) as WeaponArt;

    let Data = weaponArtTable[id];

    if (!Data) {
      return new WeaponArt({ id });
    }

    weaponArt = new WeaponArt({ ...Data });

    weaponArt = Object.freeze(weaponArt);
    this.weaponArtCache.set(id, weaponArt);

    return Object.assign(new WeaponArt(), weaponArt) as WeaponArt;
  }

  static getWeaponArtsForBuild(build: Build.Build): WeaponArt[] {
    //get all weaponArts
    const weaponArts = WeaponArtStore.all();

    const result = weaponArts.map((weaponArt) => {
      //check weapontype Requirement
      let weaponType = true;
      if (weaponArt.weaponTypeRequirements) {
        if (!build.constructionType || !weaponArt.weaponTypeRequirements.includes(build.constructionType)) {
          weaponType = false;
        }
      }

      //check guild Requirement
      let guild = true;
      if (weaponArt.guildRequirements) {
        if (!build.guild || !weaponArt.guildRequirements.includes(build.guild.id)) {
          guild = false;
        }
      }

      //check scaling Requirement
      let scaling = true;
      if (weaponArt.scalingRequirements) {
        for (const [scale, value] of Object.entries(weaponArt.scalingRequirements) as [Item.scale, number][]) {
          if (!build.damageScalings[scale] || build.damageScalings[scale] !== value) {
            scaling = false
            break;
          }
        }
      }

      //check scaling Requirement
      let stats = true;
      if (weaponArt.statsRequirements) {
        for (const [stat, value] of Object.entries(weaponArt.statsRequirements) as [Item.stat, number][]) {
          if (!build.stats[stat] || build.stats[stat] !== value) {
            stats = false
            break;
          }
        }
      }

      if (weaponType && guild && scaling && stats) return weaponArt
    })

    return result as WeaponArt[];
  }

  static all(): readonly WeaponArt[] {
    if (this.allCache) return this.allCache;
    const races = [];
    const weaponArtNames: string[] = [];
    for (const id in weaponArtTable) {
      let item = this.getByID(id as string);
      races.push(item);
      weaponArtNames.push(item.name);
    }
    this.allCache = Object.freeze(races);
    this.weaponArtNames = Object.freeze(weaponArtNames);
    return this.allCache;
  }
}
