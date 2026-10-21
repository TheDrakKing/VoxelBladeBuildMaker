# Race passive audit

All ten existing race IDs are retained. Scope: static stats, selected combat conditions, and isolated race-only cooldown previews. Seven passives are Implemented for that scope; three remain Partial.

| Race / saved ID | Support | Calculated data and limitations | Source |
| --- | --- | --- | --- |
| Human / human | Implemented | Below 50% HP, outgoing damage gains 20% and incoming damage gets a direct x0.8 multiplier. The boundary itself does not qualify. | [Trello](https://trello.com/c/K6A7nUIn) |
| Half-Ork / half_ork | Implemented | Race stats grant a fixed 10 Armor Penetration; True damage does not benefit from penetration. | [Trello](https://trello.com/c/H21hd8fF) |
| Elf / elf | Implemented | Rune cooldown is multiplied by 0.6 in the race-only preview. Other cooldown perks and cast timing are outside that preview. | [Trello](https://trello.com/c/k9Bk1WcF) |
| Dark Elf / dark_elf | Partial | Select the result manually after an 8% random-debuff proc. Armor Break and Bleed/Burn/Poison have documented 0.2 source potency; Weakness potency is unspecified. No random rolls or automatic applications. | [Trello](https://trello.com/c/W16ggAzA) |
| Dragon Blooded / dragon | Implemented | Race stats grant 50 Warding, 10 Protection, and 100 Heat/Cold Resistance. These are fixed race bonuses. | [Trello](https://trello.com/c/sv8XLjVw) |
| Ork / ork | Implemented | Fixed 10 WeaponArt-only penetration, 0.2 base Tenacity, and 0.1 Tenacity per distinct selected game buff. Manual proc selectors and the Static Charge counter do not count as buffs. | [Trello](https://trello.com/c/ufhlTnQg) |
| High Elf / high_elf | Implemented | Weapon Art cooldown is multiplied by 0.75 in the race-only preview. Other cooldown perks and cast timing are outside that preview. | [Trello](https://trello.com/c/VJuStVeo) |
| Arborian / arborian | Partial | Race stats grant -50 Fire Defense and +15 Protection. Sunlight regeneration, Entangle chance/damage/poise, and guild interactions are not simulated. | [Trello](https://trello.com/c/xd5qLFxt) |
| Kitsune / kitsune | Implemented | Race stats grant +2 Jump Boost, +10 Movement Speed, and a flat +0.1 attack speed after converting percentage attack-speed points to their numeric bonus. | [Trello](https://trello.com/c/Nuv9nzVj) |
| Bunikin / bunikin | Partial | Race stats grant +5 Jump Boost. Select Guaranteed Crit to preview a post-dodge hit. The dodge-chance formula is unverified, and automatic dodging/status consumption are not simulated. | [Trello](https://trello.com/c/WmcRb815) |

Kitsune attack-speed stacking follows the user's clarification: percentage attack speed converts to a flat numeric bonus, then the +0.1 race bonus is added. Base speed 1.5 plus 20% and Kitsune is 1.8.

Cooldown displays apply the race modifier only. They do not include other cooldown perks or simulate casting. Dark Elf outcomes are selected manually; unknown Weakness potency is not guessed. Bunikin dodge chance remains unverified. Arborian regeneration/Entangle remain outside the calculation.

Race perks are listed separately from the copied board's Perks list in the broader perk inventory, so its source-card counts do not include these ten race entries.

The later conditions/output batch adds a reviewed cooldown preview with eligible perk modifiers. The race factors above remain unchanged; the isolated race-only helper is still available. See docs/conditions-output.md for current preview scope.
