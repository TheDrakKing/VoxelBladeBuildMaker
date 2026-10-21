# Snapshot combat calculations

The builder remains a manually configured scenario calculator. Choose equipment, current HP, and the buffs/debuffs on each side. A calculation does not consume statuses, advance time, or pretend that proc chains have already happened.

## Modules

- `src/models/Build.ts`: equipment aggregation, static stat hooks, and saved loadouts.
- `src/models/CombatTypes.ts`: the actual context available to damage callbacks.
- `src/models/Combat.ts`: damage packet creation, output conversions, ordered damage calculation, and snapshot resolution.
- `src/public/helper.ts`: compatibility exports and default-target adapters for the existing UI.
- `src/models/Perk.ts`: definitions, store, and visible implementation support.

`resolveDamage(packet, attacker, target, attackerOverrides?, targetOverrides?)` returns outputs, per-hit and whole-packet totals, hit count, effective boosts, and modifier diagnostics. It copies both sides' numeric maps and selected statuses and does not mutate the input builds. `runDamage` is the legacy display adapter that also updates the UI's diagnostic fields.

Combat callbacks receive `CombatContext`, not an object falsely typed as Build. Static equipment callbacks still receive Build. HP and max HP are explicit, and target contexts are linked for target-dependent perks.

## Hits and tags

Packet `damage` is per hit. `hitAmount` is the number of equal base hits; the result includes the whole-packet total. Most statuses remain fixed across a snapshot. Selected Blood Thirsty and Venom Eater procs consume their qualifying status on the first eligible hit, then recalculate the remaining hits without it. `perHit` is the average per hit when this changes conditions, and modifier diagnostics describe the first hit. Separate weapon-combo rows remain independent snapshots. Other triggers and status durations are not advanced.

Weapon arts can declare `damageBasis: "cast"` when the existing baseDamage is already the entire cast's damage. These totals are divided before hit count is applied, preventing double multiplication. Spin and Grand Quake use documented cast totals. Rapid Stabs has three hits tagged as both WeaponArt and Finisher. Legacy estimates, including unknown per-hit distributions, still need individual data review.

Tags can overlap. Status/DoT packets cannot crit and have zero proc coefficient. Reaper explicitly excludes DoT. Scaling and output profiles remain separate, and output coefficients can sum above one.

Damage stages are scaling/level/general modifiers, output split, specific modifiers, crit, armor, then special/direct damage-taken multipliers. Human's low-HP reduction uses a direct 0.8 multiplier rather than ordinary diminishing-return defense.

## Manual state and saves

Status cards with a potency type expose an optional effective potency field in game units. Blank uses the existing source-plus-build calculation; a value overrides effective potency for the selected scenario. Static Charge exposes a hit count used by the Voltaic Body preview's exponent. The preview assumes a charged hit; charge activation and rune cooldown changes are not simulated.

Saved-build version 2 retains selected status sources, direct potency, effective-potency overrides, and stack values. Version 1 status-ID lists remain readable. Weapon arts restore through WeaponArtStore. Existing item IDs remain stable, with explicit perk aliases for known spelling mismatches.

## Coverage and next work

Perks display Implemented, Partial, or Unsupported. A description alone does not imply that its effect is calculated. The statuses describe the current snapshot calculator, not full game simulation. Some baseline race stats are stored in Races rather than in the corresponding perk definition; those labels need more detailed per-effect coverage as the catalog is reviewed.

Run `npm test`, `npm run check`, and `npm run build`. Tests compile source in memory, so stale browser output cannot hide regressions.

Reviewed Trello values are stored directly in the existing files under `src/data`. Item and perk stores read those tables without a generated overlay. See `tools/README.md` for import review, stable ID mappings, held definitions, and re-sync commands. Equipment and perk tooltips use a compact source link; raw Trello rules remain in `generated_json_v2`; source-only perks remain unsupported until their behavior is implemented. Future batches should preserve individual source contributions through aggregation and extend manually selected state for more complex perks. Adaptive Plate's remembered damage combination and Air Pressure's stored potency still need explicit state and interaction rules. A time-based event queue is optional future work, not a prerequisite for useful manual snapshots.


## Direct critical modifiers

`CriticalEffects.ts` collects declarative chance, damage, source restrictions, target conditions, and crit-only armor effects. The current family implements Vital Strikes, Spark (target Burn), Flowing Crits, Sharp Crits, Golden Crits, Spell Slinger, Spell Piercer, and Critical Master's damage bonus. Critical Master's Guardbreak chains remain Partial; other crit-triggered/history effects still need their own state and rules.

Dexterity contributes 1% crit chance and 1% crit damage per 10% Dexterity Boost. Chance is capped after adding stats, selected statuses, and perk contributions. Normal and critical branches resolve armor separately, then expected damage weights their final values. Sharp Crits' penetration applies only to critical hits. Spell Piercer applies only to Rune/WeaponArt critical hits and bypasses armor on that branch. DoTs exclude all of these crit effects.

Golden Crits uses the source card's explicit 40% proc note (its introduction says 30%). Its displayed critical damage is the conditional expected value, including the 40% chance of bonus crit damage. No proc roll, status consumption, or combat history is simulated. Imported formulas remain reference text; only reviewed coefficients are encoded as behavior.

Run `npm run test:catalog` for the data bridge tests in addition to the checks above. The Trello importer has its own `python -m unittest -v test_import_board` suite.


## Status and potency interaction batch

Statuses with potency expose **Applied by: Self / Opponent**. This selects whose additive potency is used. Self and Opponent are relative to the build carrying that status. Legacy buffs default to Self; legacy debuffs default to Opponent. Applicant identity is saved with version 2 statuses, and an explicit effective-potency override still takes precedence. Changing the applicant resets the old source selection and offers the new applicant's available sources.

Mage Rage, Oceans Rage, and Gladiatorial Rage add 0.1 effective Rage potency per perk to the applying build. The first two stack additively. The recipient needs Mage Rage for the Magic output bonus and Oceans Rage for Water; receiving Rage does not inherit those damage-type extensions from its caster. Physical is always eligible, and Scourge additionally permits True damage. The potency addition uses perk amounts after Cursed / Perk Effectiveness and is not multiplied a second time. Healing, cooldown reduction, kill-based duration, and Gladiatorial Rage's penetration remain unimplemented.

Weakness now divides damage by `1 + effectivePotency`. For bosses, manually select half potency; no boss classification is inferred. Reinforce uses the same diminishing-return form. Vapor Aegis applies a separate 0.1 multiplier on incoming Fire/Water while Reinforce is selected, independent of perk amount above zero; it also works on Burn DoTs. Barbskin's documented general reduction while Bleeding uses `1 / (1 + 0.2 * perkAmount)`; its additional Bleed-specific resistance has no verified numeric coefficient and remains unimplemented.

Frostbite's perk bonus requires selected Slow and is separate from the Frostbite debuff. Sunburn requires target Burn, grants 10% per perk, and upgrades the entire packet to 15% when any Holy output exists; it applies to DoTs. Reaper counts distinct pre-existing target debuffs for direct hits and preserves fractional perk amounts.

Scourge's 20%-per-perk proc damage is no longer always active. Select **Scourge Proc** in Buffs to inspect a proc hit; its bonus is excluded from DoTs. Rage eligibility for True damage works independently. Guardbreak effects, random rolls, and proc chains are not simulated. These perks remain explicitly Partial where duration, healing, triggering, or unverified mechanics are outside the calculation.

Generate `docs/perk-coverage.md` with `npm run audit:perks -- --catalog <normalized catalog.json>`. The report inventories all source perk cards, linked calculations, support details, and next-review hints, with a separate list of race/legacy/reference definitions. It is a structural inventory plus explicit reviewed coverage for tested mechanics, not a claim that every old hook has been validated against every source formula.

`resolveStatusDamage` uses the selected applicant for both potency and offensive stats. Self-inflicted DoTs retain the other combatant as the source of received statuses such as Weakness. The damage table labels target self-inflicted effects explicitly.


## Bleed and Poison batch

Select **Blood Thirsty Proc** or **Venom Eater Proc** in Buffs to preview the corresponding consuming hit. The matching perk must be equipped, and the target's qualifying status must be applied by the attacking build. With two actors, this is `Applied by: Opponent` on the target. Target-self-applied statuses do not qualify. A third independent caster is outside this ownership model.

Blood Thirsty consumes the attacker's Bleed before the modeled Bleed bonuses and grants 20% damage per perk. Hemorrhage gains `(10 + 10 * perkAmount)%` damage and `0.1 * perkAmount` additional True output while Bleed remains; it grants no Bleed potency. Vicious Edge gains 20% damage per perk against existing Bleed. These hit effects require a proc-capable direct packet; DoTs and zero-proc packets do not trigger them. Vicious Edge's DoT applicability remains unverified. Stun, healing, and automatic Bleed application are not calculated. Blood Thirsty's special interaction with Curse Rip is also unfinished.

Venom Eater changes base critical damage to `1.2x + 0.1x * perkAmount`, retaining Dexterity, crit stats, and other additive crit bonuses. Its selected proc consumes attacker-owned Poison, adds 10% damage per perk, and guarantees a crit on a crit-capable hit. The source does not establish its order relative to other Poison-conditioned bonuses. **Consume: After hit / Before hit** is therefore a manual scenario choice; After hit is the default, not a verified game priority. Healing is not calculated.

Consumption occurs on cloned calculation state. Saved status selections stay intact so every preview remains repeatable. Within a multi-hit packet, the status is consumed once and remaining hits are recalculated; totals are rounded after summing. A result exposes `statusConsumptions` for inspection. No new statuses are applied between those hits.

### Shared DoT formula

The board's DoT formula separates additive equipment potency `dP` from the selected source's innate potency `sP`:

- With `p = dP / 10` below 1: `(1 + sP) * (1 + p) ** (1 + p)`.
- With `p` at least 1: `(1 + sP) * (1 + p) ** 2`.

The same helper serves Bleed, Poison, and Burn. Zero additive potency still deals base damage. The **DoT potency** field overrides only the additive portion in game units; the selected source multiplier remains separate. Earlier version-2 saves keep their numeric override values, now interpreted as additive DoT potency; review saved DoT scenarios created before this correction. Rage and other non-DoT potency controls retain their effective-potency meaning.

The builder currently selects one innate source per status. The board's more general product of multiple unique source contributions is not inferred. The board also marks portions of its DoT-source formula as awaiting further testing. Sources: [DoT formula card](https://trello.com/c/AiCHrtpB) in the copied catalog; perk links are listed in the coverage report.


## Race passives and baseline stats

All ten existing race IDs are retained. The official Dragon Blooded display name uses the existing `dragon` ID, so saved selections stay compatible. Race and passive tooltips link to the reviewed race cards.

Half-Ork now supplies 10 Armor Penetration. Ork supplies 0.2 base Tenacity and 0.1 per distinct selected game buff, with 10 penetration on WeaponArt packets only. Its conditional Tenacity is added before Immovable reads the stat. Proc selectors and the Static Charge counter are scenario controls, not additional game buffs. Fixed racial bonuses are not multiplied by the displayed perk amount.

Dragon Blooded retains its verified 50 Warding, 10 Protection, and 100 Heat/Cold Resistance, applied once through Races.ts. Arborian gains -50 Fire Defense and +15 Protection. Kitsune gains +2 Jump Boost and +10 Movement Speed; Bunikin gains +5 Jump Boost.

Attack speed now follows the user's game clarification: `average weapon-part speed + AttackSpeed stat / 100 + flat race bonus`. Percentage attack-speed points convert to a flat numeric bonus. Kitsune adds 0.1 after that conversion. For example, base 1.5 with 20% attack speed and Kitsune is 1.8. The flat race bonus is absent without a valid weapon construction.

Elf's passive description is corrected to 40% Rune cooldown reduction. Its isolated preview is `baseCooldown * 0.6`; High Elf uses `baseCooldown * 0.75` for Weapon Arts. Panels and tooltips explicitly label this **Cooldown (race only)**. Other cooldown perks and cast timing are not included. Unknown cooldowns are shown as undocumented, rather than inventing a one-second value; zero cooldown remains zero.

Dark Elf offers its documented Armor Break and Bleed/Burn/Poison outcomes as manually chosen 0.2-potency sources, without adding global potency or applying random statuses. Weakness potency is unspecified and remains manual. Arborian regeneration/Entangle and Bunikin's uncertain dodge-chance formula remain unimplemented. Select the existing Guaranteed Crit status to inspect a single post-dodge Bunikin hit; automatic dodging and consuming that buff are outside this batch.

The race audit is recorded in `docs/race-coverage.md`. Seven passives are implemented for the stated static/snapshot scope; Dark Elf, Arborian, and Bunikin remain Partial.

Flat Jump Boost, Protection, Tenacity, and Armor Penetration now display without a percent sign; percentage stats keep their units.

## Forty-perk stat and condition batch

The next batch reviews forty existing definitions, adding calculation or manual status-source behavior to thirty previously unsupported perks and extending or correcting ten existing definitions. The complete per-perk formulas and remaining limits are in `docs/simple-perks.md`.

Stat calculation now has explicit phases for conversion and dependent bonuses. Strong Tides precedes Brawny as documented by the source. Brawny transfers positive offensive boosts; True Balance and Weight Distribution then redistribute; Whirl Foot and Quick Witted feed defense and final Attack Speed readers. Each pass runs once, avoiding feedback loops. The other cross-conversion ordering remains a builder convention pending game verification. Four decimal places are retained through accumulation and derived-stat math, including Extra Layers.

Perks can provide innate status sources using `getSourcePotencies(perkAmount)`, evaluated after perk-amount modifiers. Tailwind has a potency type for source selection and Engine. Saved source data remains an application snapshot, separate from additive potency; re-select a source to represent a new application at different equipment/perk amounts. Chance rolls and application timelines remain manual.

Carapace uses the new Protection Shield Active scenario selector for its conditional damage reduction. This selector does not count as another active game buff for Ork, and it does not simulate shield depletion. Perk tooltips display available innate sources and readable coverage paragraphs. Cooldown previews still apply race modifiers only.

## Second forty-perk batch: conditions, outputs, and cooldowns

Forty additional formerly Unsupported definitions now have reviewed calculation or manual-source behavior; details and source links are in `docs/conditions-output.md`. New explicit conditions cover lighting, airborne movement, mounts, Civilian readiness, Quickdraw, and charged Energize. Scenario/neutral controls do not count as game buffs for Ork or Emotional. Lighting and mount selections are exclusive, and unknown/contradictory conditions confer neither environmental bonus.

Packet output changes run in explicit priority order on cloned state: additive output, Dark Magic eligibility, then Spirit Winds conversion. This implements the documented Dark Magic/Spirit Winds incompatibility and avoids equipment insertion-order effects. Other cross-perk output ordering remains a builder convention. Concealed Edge and Void Rage apply to DoTs; Kindling scales Burn packets; Mycotic Bloom checks the actual Poison applicant and a strictly-below-half recipient HP condition.

Cooldown panels now show **Cooldown (reviewed effects)**, replacing the earlier race-only UI scope. The shared preview combines eligible Caster, Channeled Weapon, Runic Winds, Emotional, Mage Rage, Poison Acceleration, Gladiatorial Rage, Voltaic Body, and race effects. Reviewed diminishing-return rates share an additive denominator, while direct factors multiply separately. That stacking convention is explicit and pending in-game verification. Triggered resets, elapsed-cooldown changes, and unreviewed effects remain excluded. The isolated race-only method is retained.

Bastion Bless increases effective potency of actual potency-bearing buffs from their applying build; final overrides remain final and debuffs/neutral controls are excluded. Seismic Momentum replaces default Dexterity chance with Earth-based chance while retaining the separately calculated Dexterity damage bonus, a source ambiguity marked Partial. Rocky Body's coefficient also remains flagged as probable by the card.

Pending workspace autosaves are flushed on `pagehide`, preventing an immediate reload from losing the last selected condition before the debounce fires. New conditions and source ownership continue to use the existing saved-status format and IDs.
