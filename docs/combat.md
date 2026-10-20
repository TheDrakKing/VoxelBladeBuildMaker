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

Packet `damage` is per hit. `hitAmount` is the number of equal hits; the result includes the whole-packet total. A snapshot applies the same selected conditions to those hits: it does not automatically remove bleed or consume a guaranteed crit after the first hit. Use an explicit sequence model later for changing conditions.

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
