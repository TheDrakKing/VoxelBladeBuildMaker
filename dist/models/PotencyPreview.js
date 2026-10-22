import { potencyAliases } from "./Item.js";
/** Stored build potency only. Activation-specific modifiers belong to the selected status. */
export function getPotencyPreview(build) {
    return Object.entries(build.potencies)
        .filter(([, value]) => Number.isFinite(value) && value !== 0)
        .map(([id, value]) => ({ label: potencyAliases[id].trim(), value: Math.round(value / 10 * 10000) / 10000 }));
}
