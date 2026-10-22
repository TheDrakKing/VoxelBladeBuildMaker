import type { Build } from "./Build.js";
import { potencyAliases } from "./Item.js";
import type { potency } from "./Item.js";

/** Stored build potency only. Activation-specific modifiers belong to the selected status. */
export function getPotencyPreview(build: Build) {
  return (Object.entries(build.potencies) as [potency, number][])
    .filter(([, value]) => Number.isFinite(value) && value !== 0)
    .map(([id, value]) => ({ label: potencyAliases[id].trim(), value: Math.round(value / 10 * 10000) / 10000 }));
}
