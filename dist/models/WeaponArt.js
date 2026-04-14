import * as Item from "./Item.js";
import { WeaponArts } from "../data/WeaponArts.js";
const weaponArtTable = WeaponArts;
export class WeaponArt {
    constructor(data) {
        this.id = data?.id || undefined;
        this.name = data?.name || "";
        this.category = data?.category || "WeaponArt";
        this.description = data?.description || "";
        this.coolDown = data?.coolDown || 1;
        this.baseDamage = data?.baseDamage || undefined;
        this.totalHits = data?.totalHits || undefined;
        this.potencies = data?.potencies || undefined;
        this.sourcepotencies = data?.sourcepotencies || undefined;
        this.scalingRequirements = data?.scalingRequirements || undefined;
        this.damageScalings = data?.damageScalings || undefined;
        this.damageTypes = data?.damageTypes || undefined;
        this.weaponTypeRequirements = data?.weaponTypeRequirements || undefined;
        this.guildRequirements = data?.guildRequirements || undefined;
        this.scalingRequirements = data?.scalingRequirements || undefined;
        this.statsRequirements = data?.statsRequirements || undefined;
        this.weaponRequirements = data?.weaponRequirements || undefined;
        this.img = data?.img || "";
    }
}
export class WeaponArtStore {
    constructor() { }
    static get(name) {
        if (name && typeof name !== "string")
            return name;
        name = (name || "").trim();
        const id = Item.toID(name);
        return this.getByID(id);
    }
    static getByID(id) {
        let weaponArt = this.weaponArtCache.get(id);
        if (weaponArt)
            return Object.assign(new WeaponArt(), weaponArt);
        let Data = weaponArtTable[id];
        if (!Data) {
            return new WeaponArt({ id });
        }
        weaponArt = new WeaponArt({ ...Data });
        weaponArt = Object.freeze(weaponArt);
        this.weaponArtCache.set(id, weaponArt);
        return Object.assign(new WeaponArt(), weaponArt);
    }
    static getWeaponArtsForBuild(build) {
        //get all weaponArts
        const weaponArts = WeaponArtStore.all();
        let result = weaponArts.map((weaponArt) => {
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
                for (const [scale, value] of Object.entries(weaponArt.scalingRequirements)) {
                    let scaleTotal = 0;
                    if (build.blade && build.blade.damageScalings?.[scale])
                        scaleTotal += build.blade.damageScalings[scale];
                    if (build.handle && build.handle.damageScalings?.[scale])
                        scaleTotal += build.handle.damageScalings[scale];
                    if (scaleTotal < value) {
                        scaling = false;
                        break;
                    }
                }
            }
            //check scaling Requirement
            let stats = true;
            if (weaponArt.statsRequirements) {
                for (const [stat, value] of Object.entries(weaponArt.statsRequirements)) {
                    let statTotal = 0;
                    if (build.blade && build.blade.stats?.[stat])
                        statTotal += build.blade.stats[stat];
                    if (build.handle && build.handle.stats?.[stat])
                        statTotal += build.handle.stats[stat];
                    if (statTotal < value) {
                        stats = false;
                        break;
                    }
                }
            }
            //check scaling Requirement
            let weapon = true;
            if (weaponArt.weaponRequirements) {
                if (weaponArt.weaponRequirements.blade && (!build.blade || build.blade.id != weaponArt.weaponRequirements.blade)) {
                    weapon = false;
                }
                if (weaponArt.weaponRequirements.handle && (!build.handle || build.handle.id != weaponArt.weaponRequirements.handle)) {
                    weapon = false;
                }
            }
            if (weaponType && guild && scaling && stats && weapon)
                return weaponArt;
        });
        result = result.filter((weaponArt) => weaponArt != undefined);
        return result;
    }
    static all() {
        if (this.allCache)
            return this.allCache;
        const races = [];
        const weaponArtNames = [];
        for (const id in weaponArtTable) {
            let item = this.getByID(id);
            races.push(item);
            weaponArtNames.push(item.name);
        }
        this.allCache = Object.freeze(races);
        this.weaponArtNames = Object.freeze(weaponArtNames);
        return this.allCache;
    }
}
WeaponArtStore.weaponArtCache = new Map();
WeaponArtStore.allCache = null;
WeaponArtStore.weaponArtNames = [];
