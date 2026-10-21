import type { Buff } from "./Buffs.js";

export interface StatusSnapshot { buff?: Buff[]; deBuffs?: Buff[]; }
export function selected(snapshot: StatusSnapshot, id: string): boolean {
  return !!snapshot.buff?.some(status => status?.id === id);
}
export function lighting(snapshot: StatusSnapshot): "sunlight" | "shadow" | undefined {
  const sun = selected(snapshot, "scenario_sunlight"), shadow = selected(snapshot, "scenario_shadow");
  return sun === shadow ? undefined : sun ? "sunlight" : "shadow";
}
export function mount(snapshot: StatusSnapshot): "other" | "glacial_snapper" | undefined {
  const other = selected(snapshot, "scenario_mounted"), glacial = selected(snapshot, "scenario_glacial_snapper");
  return other === glacial ? undefined : glacial ? "glacial_snapper" : "other";
}
export function disposition(snapshot: StatusSnapshot) {
  const buffs = !!snapshot.buff?.some(status => status?.category === "Buff" && status.countsAsBuff !== false);
  const debuffs = !!snapshot.deBuffs?.some(status => status?.category === "Debuff");
  return { buffsOnly: buffs && !debuffs, debuffsOnly: debuffs && !buffs, mixed: buffs && debuffs };
}
