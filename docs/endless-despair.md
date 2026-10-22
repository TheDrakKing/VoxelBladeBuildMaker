# Endless Despair: measured behavior and remaining limits

The user tested the game on 2026-10-21 and reported stronger, longer enemy Poison with Endless Despair, but no effect on debuffs inflicted on the user by their own perks. Enemy status potency is not visible in game, so the exact post-combination damage rule cannot be established from those observations. The supplied self-Poison image shows a decimal status potency; it is not used to infer an unknown source coefficient or enemy potency.

## Implemented

- Potencies shows only stored build potency as a compact name/number list. Endless Despair does not modify those stored numbers.
- Ordinary potency-bearing enemy debuffs combine selected source potency and stored additive potency, then apply the card's `base * (1 + 0.35 * perk amount) + 0.1` rule. The flat addition occurs once. Final manual potency overrides remain final.
- Enemy application-duration previews use `base seconds * (1 + 0.75 * perk amount)`, with selected Contained/Slow Leak and other reviewed duration modifiers kept separate. Reference base seconds remain editable.
- Self-inflicted statuses receive no Endless Despair potency or duration bonus. This is enforced even if an older save manually opted in; the self-status eligibility selector is disabled. Explicit enemy exclusions remain supported.
- Cursed Flames retains its separately documented enemy-Burn weakening formula when eligible. Self-Burn no longer accepts the earlier ED opt-in.

## DoT damage

The copied [Damage over Time formula card](https://trello.com/c/AiCHrtpB) explicitly uses `dP / 10` for stored DoT potency points. The current builder therefore retains its existing conversion of one internal additive point to 0.1 in the displayed decimal units. This matches the source formula, rather than being derived from the screenshots.

That card combines the selected innate source and stored potency through:

`(1 + sourcePotency) * (1 + dP/10) ** (dP/10 < 1 ? 1 + dP/10 : 2)`

This is a nonlinear combination, not a simple source-plus-stored sum. The card says this formula covers source and stored stats only; it does not establish where Endless Despair enters. The user's qualitative test establishes enemy benefit/self exclusion, but cannot distinguish the candidate numerical placements.

The previous additive-only ED DoT adjustment was removed. The replacement now provides an explicitly provisional **ED estimate** after the source/stat combination, so the eligibility control changes enemy damage as well as duration. First evaluate the unchanged documented DoT multiplier M. Since the base damage is 1, the builder treats M-1 as combined strength above that base, applies the percentage and single flat addition, then restores the base:

`estimated base tick = 1 + (M - 1) * (1 + 0.35 * ED amount) + 0.1`

This mapping of combined strength to potency is a builder assumption, not an independently verified game formula. The card's 35% and flat 0.1 coefficients are reused; the post-combination interpretation still needs quantitative in-game damage tests. The estimate runs before offensive scaling, output additions, and defenses, so every output follows the same adjusted tick base. Selecting Does not qualify restores the exact unmodified tick; Qualifies/eligible Auto activates the estimate. Zero-damage Cauterize Burn remains zero. No new source coefficient or stored-unit conversion is introduced.

Stored Potencies remain unchanged. Self-inflicted statuses cannot receive the estimate or duration bonus, including legacy saved opt-ins. Manual DoT potency fields retain their additive-component meaning and therefore feed the source/stat curve before the estimate. Ordinary final-potency overrides keep their previous semantics. Damage cards say **ED estimate** only while an eligible equipped ED is active; self-debuffs retain their self-inflicted label.

The [Endless Despair card](https://trello.com/c/DmG6mFg8) says some strictly classified self-afflicted statuses qualify. The user's current test found no benefit on their own perk-inflicted debuff. The builder follows the user's requested self exclusion; other self-source exceptions remain unverified. Linear percentage stacking at multiple ED stacks also remains a builder convention.

## Verification

510 Node tests pass, including original-applicant ownership, forced self exclusion for legacy saves, enemy eligibility toggles, raw stored values, fractional perk amounts, manual additive inputs, explicit estimate coefficients, multi-output ticks, repeatability, and zero-damage Cauterize isolation. These tests verify the builder's stated estimate and control behavior, not numerical agreement with the game. The exact enemy ED DoT damage mapping remains Partial.
