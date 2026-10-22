# Enchantment reworks and Vicious Edge

The copied board contains fifty individual enchant cards. All fifty are now synchronized into the original `src/data/Enchantments.ts` table, including twenty missing entries. The two overview/rate cards are excluded. No raw catalog is loaded by the browser.

Acidic now grants +3% Hex Boost, +3% Earth Boost, and Melting Shred 1, with no Poison potency. Quenched now grants +5% Physical Boost and Life Drinker 1, with no Bleed potency. Existing gear potency remains intact. Refined uses x1.35 positive stats, and Ferocious correctly grants Ferocity rather than the unrelated Ferocious perk.

## Vicious Edge finding

Reproduced the exact Serrated Handle + Dark Steel Mace setup at http://localhost:3000. With target Bleed selected, the existing calculator correctly shows Vicious Edge Boost 20% and Hemorrhage Boost 20%. The normal Physical M1 row increases from 6.8 to 9.8 and M2 from 23.2 to 33.4 at level 1 with no armor. Hemorrhage also adds True damage. Vicious Edge is a conditional multiplier, so it has no separate Perk Activation Damage row. No Vicious Edge damage-rule change was needed; an exact-loadout regression test now covers this path. The user's original browser tab was unavailable to automation, so an old loaded script or another selected proc in the full build has not been established as the cause. Refresh the original tab to load the rebuilt modules.

## Calculation and import changes

- Enchants are included in the ordinary catalog sync, with source links, fixed stat/perk maps, and explicit stat-transform data. A repeat sync has zero changed items/files. Unknown transforms fail validation.
- Source right-to-left order is honored, including each enchant's own additions. Legendary/Wet keys now match their lowercase saved IDs. Enchantment lookup during save restoration is category-scoped.
- Transform metadata replaces the fifteen obsolete duplicated callbacks. It handles signed stats, individual boost multipliers, defenses, removal of item perks, and Warped's item-stat removal. Original armor definitions are cloned before changes.
- Ascended perk protection tracks actual surviving grants after transformations. Mythical cannot leave a removed enchant grant protecting a matching perk elsewhere. Ordinary Vampiric perks are not incorrectly treated as ascended. Lifesteal separately ignores Cursed/Perk Effectiveness because its own source card excludes those modifiers.
- Turtle King's positive-base-defense rule is represented as an increment from the original armor's positive defense values before other enchant additions. This interpretation and combined-enchant arithmetic should be verified in game when exact upgrade/rounding behavior matters. Transform calculations retain the builder's four-decimal precision; existing armor-upgrade placement is unchanged.
- Importing a perk grant does not implement missing perk mechanics. Life Drinker and Melting Shred retain their existing support limitations.

## Reviewed definitions

| Enchantment | Additive stats | Perks | Transform rules |
| --- | --- | --- | --- |
| [Legendary](https://trello.com/c/cDW5yaJR) | — | — | positive_stats × 1.5 |
| [Refined](https://trello.com/c/f0eyBw7l) | — | — | positive_stats × 1.35, negative_stats × 0.5 |
| [Strengthened](https://trello.com/c/f8UpTMpe) | PhysicalBoost: 10 | — | PhysicalBoost × 1.2 |
| [Dexterous](https://trello.com/c/25eEQWrG) | DexterityBoost: 10, JumpBoost: 2, SpeedBoost: 5 | — | DexterityBoost × 1.2 |
| [Burning](https://trello.com/c/nsfRV5aC) | FireBoost: 10 | — | FireBoost × 1.2 |
| [Wet](https://trello.com/c/SSgCaQeN) | WaterBoost: 10 | — | WaterBoost × 1.2 |
| [Earthen](https://trello.com/c/d7ErmaSh) | EarthBoost: 10 | — | EarthBoost × 1.2 |
| [Magical](https://trello.com/c/svAgg9vR) | MagicBoost: 10 | — | MagicBoost × 1.2 |
| [Cursed](https://trello.com/c/12qbKv75) | HexBoost: 10 | — | HexBoost × 1.2 |
| [Windy](https://trello.com/c/oztOUCDS) | AirBoost: 10 | — | AirBoost × 1.2 |
| [Enlightened](https://trello.com/c/kmPZw6dH) | HolyBoost: 10 | — | HolyBoost × 1.2 |
| [Summoner's](https://trello.com/c/eip3YLdQ) | SummonBoost: 10 | — | SummonBoost × 1.2 |
| [Hardened](https://trello.com/c/jwJK1Db7) | Protection: 7.5 | — | — |
| [Warded](https://trello.com/c/CGS3D5j3) | Warding: 30 | — | — |
| [Tenacious](https://trello.com/c/2nKwvNyw) | Tenacity: 0.1 | — | — |
| [Insulated](https://trello.com/c/7pXjlDyX) | ColdResistance: 100, HeatResistance: 100 | — | — |
| [Vampiric](https://trello.com/c/uYNdpQWx) | HolyDefense: -40 | lifesteal: 1 | — |
| [Tanky](https://trello.com/c/jRIohuSp) | PhysicalDefense: 10, SpeedBoost: -5 | — | defense_boosts × 1.5 |
| [Fragile](https://trello.com/c/oETl20vu) | PhysicalDefense: -20 | — | — |
| [Worthless](https://trello.com/c/23qnnvTL) | — | — | positive_stats × 0.5, negative_stats × 2 |
| [Thirsty](https://trello.com/c/QMFUd1i7) | PhysicalDefense: -5 | — | — |
| [Corroded](https://trello.com/c/dF14LVAB) | Warding: -20 | — | — |
| [Corrupt](https://trello.com/c/uwg7mcBG) | — | — | positive_stats × 0, negative_stats × -2 |
| [Quick](https://trello.com/c/TXocLP8g) | AttackSpeed: 10, SpeedBoost: 5, JumpBoost: 2 | — | — |
| [Ferocious](https://trello.com/c/CKVuJOVb) | Tenacity: 0.05 | ferocity: 1 | — |
| [Quenched](https://trello.com/c/R3xf5FmX) | PhysicalBoost: 5 | life_drinker: 1 | — |
| [Acidic](https://trello.com/c/7rj8cq39) | HexBoost: 3, EarthBoost: 3 | melting_shred: 1 | — |
| [Piercing](https://trello.com/c/vhMAAXz0) | ArmorPenetration: 10 | — | — |
| [Brawny](https://trello.com/c/vSWjykOb) | PhysicalBoost: 5 | brawny: 1 | — |
| [Warped](https://trello.com/c/DTFLXyXn) | — | perk_effectiveness: 1 | overall_stats × 0 |
| [Berserking](https://trello.com/c/08ndmdun) | PhysicalBoost: 20, Protection: -10 | — | PhysicalBoost × 1.2, positive_defenses × 0.5, negative_defenses × 2 |
| [Sweet](https://trello.com/c/RYGPqb5J) | MagicBoost: 5, HolyBoost: 5, SummonBoost: 5, SpeedBoost: -7 | — | MagicBoost × 1.1, HolyBoost × 1.1, SummonBoost × 1.1 |
| [Mythical](https://trello.com/c/L2sYbjIz) | — | — | positive_stats × 2, negative_stats × 1.2, perks × 0 |
| [Flawless](https://trello.com/c/w71Fvekk) | JumpBoost: 1, SpeedBoost: 2 | — | negative_stats × 0, positive_stats × 1.1 |
| [Blazing](https://trello.com/c/gxVvrIFu) | FireBoost: 5 | wildfire: 1 | — |
| [Raining](https://trello.com/c/VJHyGN7G) | WaterBoost: 5 | rainstorm: 1 | — |
| [Stone](https://trello.com/c/ZW8380f8) | EarthBoost: 5, SpeedBoost: -5 | stone_weapon: 1 | — |
| [Surging](https://trello.com/c/P4WXWyls) | MagicBoost: 5 | magic_surge: 1 | — |
| [Eldritch](https://trello.com/c/I8i834oD) | — | dark_one: 1 | — |
| [Tempestuous](https://trello.com/c/tqVRZHU5) | AirBoost: 5 | tempest: 1 | — |
| [Blessed](https://trello.com/c/8hlq1lUx) | HolyBoost: 5, WaterBoost: 5 | heal_boost: 1 | — |
| [Sacrificial](https://trello.com/c/19Un7Fm7) | SummonBoost: 5 | minion_absorption: 1 | SummonBoost × 1.1 |
| [Wall of](https://trello.com/c/fwBGKVh3) | — | wall: 1 | — |
| [Spell Proof](https://trello.com/c/qy4SKQ6X) | — | hex_shield: 1 | — |
| [Contained](https://trello.com/c/FneO4uL1) | ColdResistance: 20, HeatResistance: 20 | contained: 1 | — |
| [Necrotic](https://trello.com/c/cKOAElko) | EarthDefense: 20, HexDefense: 20 | undead_might: 1 | — |
| [Turtle King's](https://trello.com/c/oQ7Tpcpt) | PhysicalDefense: 5, MagicDefense: 5 | turtle: 1 | positive_base_defense_stats × 1.2 |
| [Frenzied](https://trello.com/c/iCVRFXWv) | Protection: -2 | frenzy: 1 | — |
| [Restored](https://trello.com/c/8YQT6OvE) | — | — | negative_stats × -1 |
| [Candied](https://trello.com/c/MEXtsk0z) | SummonBoost: 5 | sweet_tooth: 1 | SummonBoost × 1.2 |

## Validation

- 21 new calculator regression tests and four new catalog tests. All 420 Node tests and all 15 Python catalog tests pass.
- TypeScript check/build and diff whitespace checks pass. Catalog sync includes 957 items (907 equipment + 50 enchants), with zero changes after synchronization and the original four held equipment entries.
- Existing Vicious Edge damage is verified in the browser using the reported weapon pair and selected target Bleed. Enchantment changes are verified in the rebuilt localhost UI, including reload persistence.
