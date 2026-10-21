# Forty-perk stat and condition batch

Forty existing perk definitions now have reviewed calculation or manually selected status-source behavior. Seven are Implemented within the supported calculation scope; 33 are Partial because the remaining triggers, healing, timing, or unverified coefficients are not simulated. This is not a claim that forty complete in-game passives have been simulated.

Definitions remain in `src/data/Perks.ts`; equipment remains in the original data files. No raw catalog layer is loaded by the builder.

| Perk | Support | Calculated behavior and limits |
| --- | --- | --- |
| [Brawny](https://trello.com/c/kMRPcJza) | Partial | Converts up to 100% of other positive offensive boosts into Physical Boost, removing the converted portion. Attack Speed and negative boosts are untouched. Conversion runs once before redistribution; cross-perk conversion order is a documented builder convention. |
| [Weight Distribution](https://trello.com/c/w0LwsFfF) | Partial | Averages Physical and Dexterity Boost, then multiplies both by 1 + 0.1 * perk amount, after Brawny. Movement penalties during attacks are not simulated; cross-perk conversion order remains a builder convention. |
| [Righted Wrongs](https://trello.com/c/AIF47yPZ) | Partial | Uses the card formula before derived-stat perks: 2c/21 * (d + (2p/10 + t)/5 + 2o), with Speed equal to 10% of gained Dexterity. Physical/Magic Defense are signed terms exactly as written on the card; that unusual rule and cross-perk order still need in-game confirmation. |
| [Immovable](https://trello.com/c/ji6sl9DN) | Partial | Adds 30 * Tenacity * perk amount Physical Defense after Ork adds conditional Tenacity. Knockback is not simulated. |
| [Frozen Heart](https://trello.com/c/QGlNl7Tp) | Implemented | Adds (0.022222 + 0.022222 * perk amount) * Cold Resistance to Physical Defense, Magic Defense, and Warding. Extra Layers applies afterwards. |
| [Quick Witted](https://trello.com/c/73dSCsCt) | Implemented | Adds 25% of Speed Boost per perk to Dexterity Boost, after Whirl Foot and before Swift Guard. Derived-stat ordering is explicit and does not repeat to create a feedback loop. |
| [Whirl Foot](https://trello.com/c/bvtL5MFR) | Partial | Adds 5% of Air Boost per perk to Speed Boost. Offers perk amount / 10 Tailwind as a manually selected post-dodge source; dodge chance and automatic application are not simulated. |
| [Swift Guard](https://trello.com/c/IM6fJaTL) | Partial | Adds 10% of Dexterity Boost per perk to Physical Defense after redistribution and Quick Witted. Select its 0.2 * perk amount Reinforce source after a successful dodge; automatic dodges are not simulated. |
| [Carapace](https://trello.com/c/YF2qDXA9) | Partial | Adds 0.05 * Earth Boost * perk amount Protection. Select Protection Shield Active while shield remains for 15% diminishing-return damage reduction per perk. Shield depletion and stun immunity are not simulated. |
| [Engine](https://trello.com/c/kNRHFv5d) | Implemented | Adds (0.25 * Speed Boost + 30 * effective Tailwind potency) * perk amount to the Attack Speed stat. Uses the Tailwind applicant and explicit potency override; stacks additively with static attack-speed bonuses. |
| [Spring Powered](https://trello.com/c/4uEh794y) | Partial | Adds 0.5% damage per Jump Boost per perk and offers a 0.1 * perk amount Bounce source. Roll activation and duration are manual. |
| [Juggernaut](https://trello.com/c/rqrxBBeH) | Partial | Adds damage equal to half the magnitude of negative Speed Boost and Attack Speed stats per perk. Positive speed never penalizes damage. Stun and knockback resistance are not simulated. |
| [Steam Powered](https://trello.com/c/xkEv6XS5) | Partial | Applies the separate universal (2/15 * Air Boost * perk amount)% damage bonus. Offers the documented fixed 1-potency self-Burn source. Chance, self-hit damage, and automatic application are not simulated. |
| [True Balance](https://trello.com/c/vpNISefp) | Partial | Averages Hex/Holy Boost and increases both by the card's fixed 66%, then grants (3/25 * perk amount * Holy Boost)% separate damage. Offers manual Rage/Regen/Reinforce/Tailwind sources. Healing, Inspired, automatic debuff-to-buff mapping, and unverified cross-conversion order are outside this calculation. |
| [Crushing Pressure](https://trello.com/c/G7uxNYkI) | Implemented | For each non-True output with positive matching target Defense, adds (15% of that Defense + 10) penetration per perk. Zero or negative matching Defense does not activate it; never changes the global penetration stat. |
| [Highlander](https://trello.com/c/pSwngnkL) | Implemented | Rune and Weapon Art packets gain 20% damage and 10 penetration per perk, retaining fractional amounts. Weapon hits and status ticks do not qualify. |
| [Executioner](https://trello.com/c/vrmvJPnI) | Implemented | Scales from 0% bonus at full target HP to 50% per perk at zero target HP, clamping the selected health ratio to 0–1. |
| [Curse Rip](https://trello.com/c/J5kPDe3y) | Partial | Direct proc-capable hits gain 5% damage per distinct target debuff per perk. Consumed statuses no longer count. Healing coefficients are unknown and are not inferred. |
| [Cursed Bark](https://trello.com/c/R9Ua8FaJ) | Partial | Incoming damage is reduced with diminishing returns by 5% per distinct debuff on the attacker per perk. Offers documented fixed Shatter/Weakness sources; random application and unspecified DoT source potencies are not inferred. |
| [Dark One](https://trello.com/c/QDz1amvn) | Partial | Adds 6.66% damage per distinct self debuff per perk, preserving fractional amounts. Debuff duration changes are not simulated. |
| [Bellowing Ember](https://trello.com/c/7FkUd60a) | Partial | At or below (40 + 5 * perk amount)% self HP, grants 10% damage per perk, or 23% to the whole packet when it contains Fire. Struck-through burn chance/potency values are unverified and not implemented. |
| [Marsh Flow](https://trello.com/c/e6lgq8HQ) | Partial | Selected Regen grants 20% damage per perk. Offers its fixed 1-potency Regen source; finisher rolls and duration are manual. |
| [Smoldering](https://trello.com/c/GY9cpb7j) | Partial | Selected self Burn grants 20% damage per perk. Weapon Art self-application, duration, and unspecified innate Burn potency are manual. |
| [Gelid Lance](https://trello.com/c/g2VKZtET) | Partial | Adds 10% damage per perk against selected Bleed. Slow-to-Bleed application and the undocumented Water-scaling coefficient are not inferred; the card says it grants no additive Bleed potency. |
| [Dragon Breath](https://trello.com/c/KkTA2Oq0) | Partial | Adds 10% damage per perk against selected Burn. Finisher projectiles, their hit decay, proc timing, and Burn application are outside this calculation. |
| [Venom Spitter](https://trello.com/c/4yuZf0wL) | Partial | Adds 10% damage per perk against selected Poison and offers 0.1 innate Poison potency per perk. Finisher projectiles, hit decay, and automatic application are not simulated. |
| [Sticky Swings](https://trello.com/c/Vau2WfCJ) | Partial | Adds 15% damage per perk against selected Sticky, separately from Sticky's own Magic vulnerability. Random application and Slow conversion are manual. |
| [Explosive Honey](https://trello.com/c/DzUd6F24) | Partial | Adds the documented 10% damage against selected Sticky; no perk-amount scaling is specified for this bonus. Finisher honey burst and application are not simulated. |
| [Undead Might](https://trello.com/c/DiNCzYsD) | Partial | Rune and Weapon Art packets gain 25% damage per perk. Self-damage and multi-enemy self-damage reduction are not simulated. |
| [Toxin Caster](https://trello.com/c/RuchhWoQ) | Partial | Rune/Weapon Art packets containing pure Magic gain 5% damage per additive Poison Potency point per perk, boosting the whole packet. Target Poison is not required. Poison application and unspecified innate potency remain manual. |
| [Raging Bounce](https://trello.com/c/CSv4bCK2) | Implemented | All damage gains a multiplier of 1 + 0.7 * perk amount * effective selected Bounce potency, using the status applicant and override. |
| [Poison Acceleration](https://trello.com/c/rsFKJevO) | Partial | Selected self Poison grants 20 Attack Speed percentage points per perk. The documented cooldown reduction is not included in race-only cooldown previews; movement-speed magnitude is unspecified. |
| [Ice Barge](https://trello.com/c/3mFguLrj) | Partial | Selected Slow grants 15% diminishing-return damage reduction per perk. Stun/movement behavior and automatic block-triggered Slow are not simulated. |
| [Cleave](https://trello.com/c/bKFIKrFD) | Partial | Selected target Shatter grants a fixed 20% damage bonus regardless of perk amount. Offers its fixed 0.1 Shatter source; finisher application and hitboxes are manual. |
| [Valor](https://trello.com/c/WbuVXjxJ) | Partial | Selected target Taunt grants 6.66% damage per perk. Weapon Art Taunt application and the one-handed shield/blocking behavior are not simulated. |
| [Warding Tides](https://trello.com/c/k5KWGJHo) | Partial | Offers a 0.2 * perk amount Reinforce source for manual selection after a cleansing ability. Automatic ability detection/application is not simulated. |
| [Weakening](https://trello.com/c/eh8FjtrX) | Partial | Offers perk amount / 5 innate Weakness potency. The selected status uses the shared 1/(1+potency) damage formula. Chance rolls and hit application are manual. |
| [Poisonous](https://trello.com/c/uPlSBhdo) | Partial | Offers 0.3 innate Poison potency per perk for the shared Poison DoT calculation. Random application, bonus Hex hit, and duration scaling are not simulated. |
| [Wrathful Crits](https://trello.com/c/WPLSJfQR) | Partial | Offers a 0.1 * perk amount Rage source after a crit. Select Rage manually; automatic critical-hit activation and duration are not simulated. |
| [Iron Bounce](https://trello.com/c/iarJ7Tf6) | Partial | Offers 0.3 * perk amount Bounce and 0.2 * perk amount Reinforce sources for manual selection. Weapon-hit chance, Bounce-to-Reinforce activation, and duration are not simulated. |

## Stat order and precision

All item/race stats are accumulated first, then perk amounts are adjusted. The stat pass is deterministic and runs once: Ork conditional Tenacity; Righted Wrongs; Strong Tides; Brawny; True Balance; Weight Distribution; Whirl Foot; Quick Witted; defense/Protection readers; existing default-priority modifiers such as Extra Layers and Spellshield; final Attack Speed readers. Strong Tides preceding Brawny is documented by the source. Other cross-conversion ordering is an explicit builder convention and still requires in-game verification. No repeated feedback loop is solved.

Brawny removes the positive portion it transfers. Percentage attack-speed bonuses remain additive stat points and are converted to numeric speed before Kitsune adds its flat 0.1. Four decimal places are retained during stat accumulation and derived calculations; this also fixes premature truncation in Extra Layers. Damage output keeps the existing final rounding.

Righted Wrongs follows the literal card formula, including the signed Physical/Magic Defense terms. That unusual part remains flagged for in-game confirmation. True Balance applies the card’s fixed 66% after averaging; no unlisted perk-amount scaling is invented. Explosive Honey uses the documented fixed 10% Sticky bonus; Cleave explicitly uses a fixed 20%.

## Selecting status effects

Equip the perk, add the relevant buff/debuff on the correct combatant, and select that perk as the source. Source choices use the equipped fractional perk amount, including Cursed/Perk Effectiveness adjustments. Innate source potency remains separate from additive potency. Existing saved status sources remain snapshots of the chosen application; changing equipment does not silently rewrite them. Re-select a source to model a fresh application.

Tailwind now has an explicit potency type, enabling Whirl Foot and True Balance source choices and Engine’s documented Tailwind contribution. Its movement-speed formula is not invented.

For Carapace, select Protection Shield Active while shield capacity remains. It is a manual scenario control, does not count toward Ork’s active buffs, and survives save/reload. Shield capacity/depletion and stun immunity are not simulated.

Conditional damage checks use the selected statuses. Existing Blood Thirsty/Venom Eater consumption removes the consumed status before later eligible bonuses and remaining hits as configured. No automatic proc rolls or combat timeline are added. The later conditions/output batch adds a reviewed cooldown preview including Poison Acceleration; see docs/conditions-output.md for the current scope.
