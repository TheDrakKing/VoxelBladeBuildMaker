# Wound, Melting Shred, and Dominating placeholders

The user explicitly selected the numeric placeholders below. They are not verified game coefficients.

| Effect | Selected calculation |
| --- | --- |
| Wound | Separate selectable debuff. Adds a fixed 0.1 True output to incoming Bleed ticks, retaining existing output and the Bleed applicant's scaling. |
| Melting Shred | Adds 0.1 True output per perk to the applicant's DoT ticks while that applicant carries a selected damaging status (currently Bleed, Burn, or Poison). Stacks with Wound on Bleed. |
| Dominating | Adds 20% poise damage per perk only when the selected target has Taunt. Shown separately as a poise multiplier; never changes HP damage. |

Wound's approximately six-second duration is listed by Sharp Claws; application and expiration remain manual, and its undocumented stun is not calculated. Wound counts separately for debuff-count effects and remains when Blood Thirsty consumes Bleed. Wound does not require Sharp Claws on either selected actor. Its fixed placeholder has no potency scaling, including Darkening Hex.

Melting Shred's Anti-Heal is selectable as a separate debuff marker. The source says its application does not require its applicant to carry a DoT. Its healing-reduction coefficient and exact duration are unknown, so neither is invented. The marker counts for debuff-count effects but performs no healing calculation.

The Poise Damage panel displays Dominating's condition, placeholder label, and multiplier. For example, one perk against Taunt gives 1.2x and two give 1.4x. Base attack poise damage and stagger thresholds are unavailable, so no absolute poise value or stagger prediction is displayed.

True output is an additional damage-type coefficient, not flat HP damage. A Bleed packet with Physical 1 and no True output becomes Physical 1 / True 0.1 with Wound. With two active Melting Shred perks, it becomes Physical 1 / True 0.3. Each output then follows its normal defenses and damage modifiers. No automatic DoT application, healing prevention, or stagger timeline is simulated.

Fifteen focused regression tests cover output isolation, original applicant ownership, preserving existing True output, combined placeholders, separate debuff counts, Blood Thirsty consumption, serialization, and conditional poise without HP damage changes. All 435 Node calculator tests pass, alongside 15 Python catalog tests.

Browser validation at localhost:3000 used the imported Monk build with five Melting Shred perks, self-Poison, target Bleed/Wound, and Taunting Rune. The Bleed preview shows 111.54 Physical and 51.48 True, while Dominating shows +20% / 1.2x. Removing target Taunt gives 1x with the same 99.4 M2 HP damage. Reload preserves the statuses and previews; no runtime errors were observed.
