# Second forty-perk batch

Forty previously Unsupported perk definitions now have calculation or selected-source behavior. Caster is Implemented for the documented cooldown formula; the other 39 remain Partial where timing, healing, summons, or unspecified formulas are not simulated. This report describes the calculated portions, not forty complete combat simulations.

| Perk | Support | Calculated behavior and limits |
| --- | --- | --- |
| [Rocky Body](https://trello.com/c/o0OgPMRa) | Partial | Adds 0.5 * Earth Boost * perk amount Physical Defense after conversion. The card itself labels the formula as probable; it remains flagged for in-game confirmation. |
| [Lucky](https://trello.com/c/ElHijWTj) | Partial | Adds -25 Warding, -6 Protection, and -0.1 Tenacity per perk before Righted Wrongs and derived stats. Rerolls and chance-based activations are not simulated. |
| [Star Barrage](https://trello.com/c/xrX4I7k4) | Partial | Select Star Barrage to add 20 + 25 * perk amount Attack Speed percentage points. Uses the equipped perk for a self-buff preview; activation, duration, and transferred buffs are manual. |
| [Flash Strike](https://trello.com/c/ge4rmWRD) | Partial | Select Flash Strike after a parry to add 75 Attack Speed percentage points per equipped perk. Activation, duration, and transferred buffs are manual. |
| [Blood Lust](https://trello.com/c/zBPM5Pnx) | Partial | Select Blood Lust and enter its current effective potency: Attack Speed gains 20 * potency percentage points. Source starts at zero charge. Automatic weapon-hit buildup, cap scaling beyond the documented 2.5 at one perk, expiration, and proc-coefficient reduction are not simulated. |
| [Inspiration](https://trello.com/c/DLCdQ0RQ) | Partial | Select Inspired for 7.5% self damage per equipped perk. Healing pulses, ally application, and duration are manual; an unknown Inspired potency formula is not invented. |
| [Grounded Despair](https://trello.com/c/KfRmwoqr) | Partial | Offers 0.1 * perk amount Despair potency. Select Despair with Applied by Self for its shared +8.5% damage per 0.1 effective potency. Jump/landing shockwave and timing are not simulated. |
| [Quickdraw](https://trello.com/c/hWCUSZTd) | Partial | Select the neutral Quickdraw state for 30% Rune/Weapon Art damage per perk. It does not count as a game buff. Weapon-equipping detection and five-second expiration are manual. |
| [Energize](https://trello.com/c/tknW6gsB) | Partial | Select Energize Charged to preview 50% bonus Weapon Art damage per perk. This previews a charged packet; buildup, charge consumption, and the cast timeline are manual. |
| [Civilian](https://trello.com/c/llhxquuy) | Partial | Select Civilian Ready once the weapon has been stowed for more than three seconds: Rune damage gains 40% per perk. Weapon/blocking state and automatic activation are not simulated. |
| [Frequent Flier](https://trello.com/c/AYAygnuB) | Partial | Select Airborne for 20% damage per perk, including while mounted. Slow-fall movement is not simulated. |
| [Rider](https://trello.com/c/iEoLKdcK) | Partial | Select Mounted or Mounted: Glacial Snapper for 20% damage per perk. Stun resistance has no verified coefficient and is not inferred. |
| [Mounted Defense](https://trello.com/c/nNcCVWEa) | Partial | Only Mounted: Glacial Snapper enables 20% diminishing-return damage reduction per perk. Other mounts do not qualify. |
| [Vampire](https://trello.com/c/O7ET7Qs9) | Partial | In Shadows grants 6.66% damage and 3.33% diminishing-return reduction per perk. In Sunlight halves that damage bonus and removes reduction. Unknown lighting grants neither. Healing penalties, kill healing, and inn restrictions are not simulated. |
| [Photosynthesis](https://trello.com/c/XCDTt8fa) | Partial | In Sunlight grants 20% damage per perk to Holy and Earth portions only. Healing is not calculated. |
| [Concealed Edge](https://trello.com/c/nGoxB9AM) | Partial | In Shadows adds 0.25 Hex output per perk to the current packet, explicitly including DoTs. Does not change the saved damage profile; weapon range is not simulated. |
| [Channeled Weapon](https://trello.com/c/Cu6Kzi1Z) | Partial | Direct packets gain 0.05 Magic output per perk. Weapon Art cooldown gets the direct multiplier max(0, 0.8 - 0.05 * perk amount), after grouped diminishing-return CDR. DoT applicability and cross-conversion order are not verified. |
| [Dark Magic](https://trello.com/c/mgNRFUsc) | Partial | Direct packets containing Magic gain 0.2 Hex output per perk. Runs before Spirit Winds converts Air, so Magic introduced only by Spirit Winds cannot trigger it. Self damage and DoT applicability are not calculated. |
| [Void Rage](https://trello.com/c/pKAeIvmZ) | Partial | Selected Rage adds 0.1 Hex output per perk, including DoT packets. It remains the existing Rage buff and is independent of Rage potency. Summon transfer and stun resistance are not simulated. |
| [Toxin Transfer](https://trello.com/c/KqD6pP2y) | Partial | Proc-capable direct hits while self-Poisoned gain 0.05 Hex output per perk and do not consume your Poison. Applying target Poison before Curse Rip remains manual; no unknown innate potency is invented. |
| [Emotional](https://trello.com/c/qzmBIYkD) | Partial | Only real buffs: Weapon Arts gain 0.2 Hex output and 50% diminishing-return CDR per perk. Only debuffs: direct packets gain 0.2 Fire output and +20 Attack Speed points per perk. Neutral/scenario controls do not count. Mixed-state healing and DoT output applicability are not calculated. |
| [Spirit Winds](https://trello.com/c/Cs2JybzB) | Partial | Selected Tailwind grants the separate (0.2/3)*(5*effective Tailwind potency + 2*perk amount) damage fraction and converts up to 100% of Air output to Magic at 10% per perk. Conversion runs after additive outputs and Dark Magic; cross-perk conversion order is an explicit builder convention. |
| [Wind Walker](https://trello.com/c/2VtmfMab) | Partial | With selected Tailwind, Weapon Arts gain 0.15 Air output and 10 penetration per perk, regardless of Tailwind potency. Knockback and Tailwind duration are not simulated. |
| [Mycotic Bloom](https://trello.com/c/9nA8O7Im) | Partial | This applicant's Poison ticks gain 25% damage per perk when the recipient is strictly below 50% HP. Exactly 50% does not qualify. Above-half Slow application is manual and its unspecified potency is not inferred. |
| [Kindling](https://trello.com/c/biuQhgpJ) | Partial | Burn status packets are multiplied by 1 + 0.5 * perk amount; direct Fire hits and other DoTs are unaffected. This changes damage rather than the shared additive potency stat. Duration shortening is not simulated. |
| [Seismic Momentum](https://trello.com/c/yJt9lFvu) | Partial | Replaces the default Dexterity crit-chance contribution with 0.075% per Earth Boost per perk and adds equal crit damage. Other crit sources still stack. Dexterity's separate damage bonus is retained because the card only replaces chance; that distinction needs in-game confirmation. |
| [Caster](https://trello.com/c/bNACVMcB) | Implemented | Adds 15% diminishing-return Rune/Weapon Art CDR per perk. Preview divides by 1 plus the summed reviewed CDR rates, then applies direct race/perk factors. Grouped stacking order is a documented builder convention. |
| [Runic Winds](https://trello.com/c/xvseWOc5) | Partial | Offers 0.1 * perk amount Tailwind as a manual source. Selected Tailwind grants 10% diminishing-return Rune CDR per perk, independent of potency. Rune activation and duration are manual. |
| [Spring Step](https://trello.com/c/wpTVMn3G) | Partial | Offers perk amount / 5 Bounce potency for manual selection after a Weapon Art. Automatic cast activation and duration are not simulated. |
| [Sacred Grounds](https://trello.com/c/hiETbRAL) | Partial | Offers 0.2 * perk amount Reinforce potency after a Rune. The holy cross, delayed activation, healing, and duration are not simulated. |
| [Shielding Gong](https://trello.com/c/HwIUTqNd) | Partial | Offers 0.1 * perk amount Reinforce potency after a finisher with nearby allies. Ally range, automatic application, knockback resistance, and duration are not simulated. |
| [Queen's Guard](https://trello.com/c/L6QUW33j) | Partial | Offers 0.5 + 0.1 * perk amount Reinforce potency after summoning. Summon HP/speed bonuses, automatic activation, and duration are not calculated. |
| [Bastion Bless](https://trello.com/c/QHl1kv28) | Partial | Offers fixed 0.5 Regen/Reinforce sources and increases effective potency of actual potency-bearing buffs applied by this build by 10% per perk. Final manual potency overrides bypass this multiplier. Unknown potency formulas for other buffs, healing rolls, and automatic application remain manual. |
| [Beastial Rage](https://trello.com/c/8LBFjFic) | Partial | Offers 0.3 * perk amount Rage potency after a kill. Kill healing, cleansing, automatic application, and the unspecified movement-speed bonus are not calculated. |
| [Erosion](https://trello.com/c/iCWTWoVH) | Partial | Offers 0.1 + 0.1 * perk amount Shatter potency after an Earth-damage proc. Chance rolls and hit application are manual. |
| [Cryo Engine](https://trello.com/c/gcnekmwY) | Partial | Offers 0.2 + 0.1 * perk amount Tailwind after Frostbite application. Select Frostbite on the target for its existing fixed 10% Air/Water vulnerability. Slow conversion, rolls, and durations are manual. |
| [Fragrance Aura](https://trello.com/c/pcFpdK1s) | Partial | Offers 0.2 * perk amount Regen potency for the aura's allies. Fragrance buildup, Poison application, Water pulses, healing, and duration are not simulated. |
| [Toadzerker Spirit](https://trello.com/c/JUK2ys4d) | Partial | Offers fixed 0.2 Bounce and Rage sources after spirit activation. The summon/slam damage, spiritual energy, and duration are not simulated. |
| [Croakernaut Spirit](https://trello.com/c/wczMlNo3) | Partial | Offers fixed 0.5 Reinforce potency from the spirit Croakernauts. Spirit summoning, spiritual energy, and duration are not simulated. |
| [Woof Spirit](https://trello.com/c/0AykNlOE) | Partial | Offers fixed 0.5 Weakness potency after the spirit howl. The howl attack, healing, spiritual energy, and duration are not simulated. |

## Manual conditions and statuses

Use the existing Buffs selector for In Sunlight, In Shadows, Airborne, Mounted, Mounted: Glacial Snapper, Civilian Ready, and Energize Charged. These controls and the neutral Quickdraw status do not count as real buffs for Ork or Emotional. Selecting a lighting or mount condition replaces the conflicting condition. Unknown lighting applies neither a sunlight nor shadow bonus; contradictory imported conditions grant neither environmental bonus. Conditions survive save/reload.

Star Barrage, Flash Strike, Blood Lust, and Inspired are real buffs. Their self-buff previews require the corresponding equipped perk. Blood Lust uses its current manually selected potency, with zero starting charge and +20 Attack Speed percentage points per effective potency. Hit-based buildup, expiration, and unverified cap scaling are not simulated.

Despair is a real debuff, with a documented 0.1 * Grounded Despair amount source and +8.5% damage per 0.1 effective potency. Select Applied by Self for Grounded Despair. Other sources/ownership can be selected manually. Inspired has no verified shared potency formula, so its implementation is explicitly limited to the self-buff from equipped Inspiration. True Balance’s Inspired outcome remains unsupported.

## Output ordering and status damage

Output changes apply to cloned packet profiles. Additive outputs run first, Dark Magic then checks for a Magic component, and Spirit Winds converts Air last. This prevents Magic introduced only by Spirit Winds from activating Dark Magic, matching the source incompatibility. Apart from that documented incompatibility, the order of interacting additions/conversions remains an explicit builder convention. Results do not depend on equipment/perk insertion order. Conversion is capped at 100% and preserves the converted coefficient.

Concealed Edge and Void Rage explicitly affect DoTs. Kindling multiplies Burn packets rather than changing the shared potency stat. Mycotic Bloom reads the actual Poison applicant and recipient HP, qualifying only strictly below 50%. Channeled Weapon, Dark Magic, and Emotional output changes are limited to direct packets where DoT applicability is unverified. Toxin Transfer requires a proc-capable hit and does not consume self Poison; target application before Curse Rip remains manual.

Seismic Momentum replaces the default Dexterity crit-chance contribution and adds Earth-based chance/damage. Other chance sources still stack. The card only states that chance is replaced, so the separate default Dexterity damage bonus is retained and explicitly flagged for in-game verification. Rocky Body’s coefficient is also marked probable by the source.

## Reviewed cooldown preview

Rune and Weapon Art panels/tooltips now show Cooldown (reviewed effects). Caster, Channeled Weapon, Runic Winds, and Emotional are part of this batch. Already-reviewed Mage Rage, Poison Acceleration, Gladiatorial Rage, and Voltaic Body are also connected, alongside Elf/High Elf factors. Those four supporting updates are not counted again in the forty new definitions.

Reviewed diminishing-return rates are added into one denominator: base cooldown / (1 + sum of eligible rates). Direct race/perk factors multiply separately. This grouped stacking rule is a documented builder convention pending in-game confirmation. Channeled Weapon’s direct factor is clamped at zero to avoid negative cooldown; Gladiatorial Rage’s half-cooldown factor applies only to Rage Rune. The preview provides a modifier trace, preserves zero, and leaves undocumented cooldowns unknown. Triggered cooldown resets, elapsed-cooldown reductions, cast timing, and unreviewed effects are not included. The older race-only helper remains available for isolated comparisons.

## Buff potency and data layout

Bastion Bless increases effective potency of real potency-bearing buffs applied by the source build by 10% per perk, after combining innate/additive/direct potency. A final manual effective-potency override bypasses that multiplier. Debuffs and scenario/neutral controls are excluded. Unknown potency formulas for Star Barrage, Flash Strike, and Inspired are not invented.

Innate source values remain selected-application snapshots; additive bonuses and applying-build modifiers use the existing current-build model. Re-select a source to model a new application. Definitions stay in the original src/data files; Conditions.ts and Cooldowns.ts contain calculation code, not another raw catalog.

The UI flushes pending workspace autosaves on page exit, including immediate reload, so the latest selected condition is not lost during the autosave debounce.
