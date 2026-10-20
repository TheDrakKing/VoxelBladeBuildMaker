/** Explicit aliases preserve existing equipment and saved-build identifiers. */
const perkAliases = {
    immovable: "immoveable",
    frequent_flyer: "frequent_flier",
    glyth_conduit: "glyph_conduit",
    berserking_strength: "berserkingstrength",
    queen_s_guard: "queen_s_guard",
    queens_guard: "queen_s_guard",
    queens_power: "queen_s_power",
};
export function toPerkID(value) {
    const id = value.trim().toLowerCase().replace(/[’']/g, "_").replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
    return perkAliases[id] || id;
}
