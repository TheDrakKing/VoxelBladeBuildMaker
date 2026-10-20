// Compatibility exports for the existing UI. Combat rules live in the model layer.
export * from "../models/Combat.js";
import * as Combat from "../models/Combat.js";
import * as targets from "./targets.js";
export function runWeaponDamageCalculation(build, target) {
    if (!build.blade || !build.handle)
        return;
    Combat.getWeaponDamages(build, target || targets.Dummy);
}
export function runNonWeaponDamageCalculation(packet, build, target, attackerBuild, targetBuild) {
    const [outputs, total] = Combat.runDamage(packet, build, target || targets.Dummy, attackerBuild, targetBuild);
    return { outputs, total };
}
