# Perk coverage audit

Source: **Voxel Board Copy**, 367 perk cards. Application registry: 381 definitions.

Source-card coverage: **11 Implemented**, **41 Partial**, **315 Unsupported**.

This is a repeatable inventory of registered behavior and support labels. Hook presence is evidence of code, not proof that the full source rule is correct. The status/potency batch has explicit reviewed details and regression tests. Older Partial entries still need formula-by-formula review.

Trigger/timing and scenario tags are triage hints from the source text. They do not enable effects. Source-only potency definitions identify possible status sources; they do not simulate application. Race stats and guild behavior can live outside Perks.ts.

Unmapped source cards: none.

## Implemented

| Perk / ID | Registered calculations | Scope / limitations | Next review |
| --- | --- | --- | --- |
| [Cut Down](https://trello.com/c/8do67qok) — `cut_down` | onDmgBonusMultiplier | Calculated for the selected HP and status conditions. | Regression coverage / source review |
| [Extra Layers](https://trello.com/c/nHNAxaEf) — `extra_layers` | onStatCalculation | Calculated for the selected HP and status conditions. | Regression coverage / source review |
| [Flowing Crits](https://trello.com/c/nfMHFCbQ) — `flowing_crits` | critical | Calculated for the selected HP and status conditions. | Regression coverage / source review |
| [Golden Crits](https://trello.com/c/8MTSUxds) — `golden_crits` | critical | Crit damage is the expected value using the documented 40% proc chance. | Regression coverage / source review |
| [Sharp Crits](https://trello.com/c/B2vQ7N6J) — `sharp_crits` | critical | Calculated for the selected HP and status conditions. | Regression coverage / source review |
| [Spark](https://trello.com/c/A1Ij3xmy) — `spark` | critical | Calculated for the selected HP and status conditions. | Regression coverage / source review |
| [Spell Piercer](https://trello.com/c/4MmcGPD8) — `spell_piercer` | critical | Calculated for the selected HP and status conditions. | Regression coverage / source review |
| [Spell Slinger](https://trello.com/c/d6RG18Fa) — `spell_slinger` | critical | Calculated for the selected HP and status conditions. | Regression coverage / source review |
| [Spellshield](https://trello.com/c/AIl5dW6s) — `spellshield` | onStatCalculation | Calculated for the selected HP and status conditions. | Regression coverage / source review |
| [Strong Tides](https://trello.com/c/kVHlE4aD) — `strong_tides` | onStatCalculation | Calculated for the selected HP and status conditions. | Regression coverage / source review |
| [Vital Strikes](https://trello.com/c/RDORU0kV) — `vital_strikes` | critical | Calculated for the selected HP and status conditions. | Regression coverage / source review |

## Partial

| Perk / ID | Registered calculations | Scope / limitations | Next review |
| --- | --- | --- | --- |
| [Barbskin](https://trello.com/c/SI3Za8qa) — `barbskin` | onDmgReducedMultiplier | General damage reduction while this build is Bleeding. Extra Bleed-specific resistance has no verified coefficient; self-application is not simulated. | Status / potency; Trigger / timing |
| [Blessing](https://trello.com/c/LyegnYns) — `blessing` | sourcepotencies | Some effects are calculated. Trigger timing and the complete interaction rules are not implemented. | Status / potency; Trigger / timing; Additional scenario state |
| [Blood Thirsty](https://trello.com/c/feVgtQT7) — `blood_thirsty` | onDmgBonusMultiplier | Some effects are calculated. Trigger timing and the complete interaction rules are not implemented. | Status / potency |
| [Brawny](https://trello.com/c/kMRPcJza) — `brawny` | onStatCalculation | Some effects are calculated. Trigger timing and the complete interaction rules are not implemented. | Formula / behavior review |
| [Critical Master](https://trello.com/c/rmIA1Ef1) — `critical_master` | critical | The critical damage bonus is calculated; automatic Guardbreak-triggered perk chains require selected state. | Formula / behavior review |
| [Cursed](https://trello.com/c/8dEVh9Lg) — `cursed` | onPerkMod | Some effects are calculated. Trigger timing and the complete interaction rules are not implemented. | Status / potency; Trigger / timing |
| [Cursed Experiment](https://trello.com/c/z7h9nzc4) — `cursed_experiment` | sourcepotencies | Some effects are calculated. Trigger timing and the complete interaction rules are not implemented. | Status / potency; Trigger / timing |
| [Dark One](https://trello.com/c/QDz1amvn) — `dark_one` | onDmgBonusMultiplier | Some effects are calculated. Trigger timing and the complete interaction rules are not implemented. | Status / potency; Trigger / timing |
| [Deathmist Slash](https://trello.com/c/gbbaaKXJ) — `deathmist_slash` | baseDamage | Some effects are calculated. Trigger timing and the complete interaction rules are not implemented. | Additional scenario state |
| [Directive](https://trello.com/c/WerWoOmd) — `directive` | sourcepotencies | Some effects are calculated. Trigger timing and the complete interaction rules are not implemented. | Status / potency; Trigger / timing; Additional scenario state |
| [Dual Wielding](https://trello.com/c/4HpJrVH7) — `dual_wielding` | None | Weapon construction is calculated. Other effects and automatic triggers are not simulated. | Formula / behavior review |
| [Duelist Stance](https://trello.com/c/4vIJ4XNj) — `duelist_stance` | None | Weapon construction is calculated. Other effects and automatic triggers are not simulated. | Formula / behavior review |
| [Emergency Exit](https://trello.com/c/lEAAS9gu) — `emergency_exit` | sourcepotencies | Some effects are calculated. Trigger timing and the complete interaction rules are not implemented. | Status / potency; Trigger / timing; Additional scenario state |
| [Fragrant Flesh](https://trello.com/c/BGDSjTof) — `fragrant_flesh` | sourcepotencies | Some effects are calculated. Trigger timing and the complete interaction rules are not implemented. | Status / potency; Trigger / timing |
| [Frostbite](https://trello.com/c/8tt6hyuQ) — `frostbite` | onDmgBonusMultiplier | Damage bonus against a target already selected as Slow. Applying Slow on hit is not simulated; the Frostbite debuff is separate. | Status / potency; Trigger / timing |
| [Gladiatorial Rage](https://trello.com/c/7vMRpUp1) — `gladiatorial_rage` | onStatCalculation | Adds 0.1 Rage potency per perk to statuses this build applies. Cooldown, duration on kill, and highest-boost penetration are not calculated. | Status / potency; Trigger / timing |
| [Hemorrhage](https://trello.com/c/WSK9ClTj) — `hemorrhage` | onDmgBonusMultiplier, onOutputCalculation | Some effects are calculated. Trigger timing and the complete interaction rules are not implemented. | Status / potency; Additional scenario state |
| [Highlander](https://trello.com/c/pSwngnkL) — `highlander` | onDmgBonusMultiplier, onArmorPenCalculation | Some effects are calculated. Trigger timing and the complete interaction rules are not implemented. | Formula / behavior review |
| [Ignition](https://trello.com/c/wIQIIdr1) — `ignition` | sourcepotencies | Some effects are calculated. Trigger timing and the complete interaction rules are not implemented. | Status / potency; Trigger / timing |
| [Immovable](https://trello.com/c/ji6sl9DN) — `immoveable` | onStatCalculation | Some effects are calculated. Trigger timing and the complete interaction rules are not implemented. | Formula / behavior review |
| [Locked And Loaded](https://trello.com/c/ZpzpCd4i) — `locked_and_loaded` | None | Weapon construction is calculated. Other effects and automatic triggers are not simulated. | Trigger / timing; Additional scenario state |
| [Mage Rage](https://trello.com/c/HRZEyoIi) — `mage_rage` | onStatCalculation | Rage gains Magic output eligibility; self-applied Rage potency scales with the caster. Rune cooldown reduction is not calculated. | Status / potency; Trigger / timing |
| [Marsh Flow](https://trello.com/c/e6lgq8HQ) — `marsh_flow` | sourcepotencies | Some effects are calculated. Trigger timing and the complete interaction rules are not implemented. | Status / potency; Trigger / timing; Additional scenario state |
| [Melting Slime](https://trello.com/c/hpXdNvCc) — `melting_slime` | onIncreaseSpecificDmgTaken | Some effects are calculated. Trigger timing and the complete interaction rules are not implemented. | Status / potency; Trigger / timing |
| [Oceans Rage](https://trello.com/c/9LR5ulW3) — `oceans_rage` | onStatCalculation | Rage gains Water output eligibility; self-applied Rage potency scales with the caster. Bonus healing is not calculated. | Status / potency; Trigger / timing |
| [Perk Effectiveness](https://trello.com/c/SezUllD8) — `perk_effectiveness` | onPerkMod | Some effects are calculated. Trigger timing and the complete interaction rules are not implemented. | Status / potency; Trigger / timing |
| [Reaper](https://trello.com/c/wt4E74Nw) — `reaper` | onDmgBonusMultiplier | Counts distinct target debuffs already present for direct hits. Debuff application timing is manual and DoTs are excluded. | Status / potency |
| [Righted Wrongs](https://trello.com/c/AIF47yPZ) — `righted_wrongs` | onStatCalculation | Some effects are calculated. Trigger timing and the complete interaction rules are not implemented. | Formula / behavior review |
| [Saw Stance](https://trello.com/c/XaAX73uX) — `saw_stance` | None | Weapon construction is calculated. Other effects and automatic triggers are not simulated. | Status / potency; Trigger / timing |
| [Scourge](https://trello.com/c/U9ETYYxu) — `scourge` | onDmgBonusMultiplier | Rage can boost True damage. Select Scourge Proc for its bonus-damage hit; random rolls and Guardbreak chains are not simulated. | Status / potency; Trigger / timing |
| [Shattering Justice](https://trello.com/c/kvuHFbVy) — `shattering_justice` | sourcepotencies | Some effects are calculated. Trigger timing and the complete interaction rules are not implemented. | Status / potency; Additional scenario state |
| [Spring Powered](https://trello.com/c/4uEh794y) — `spring_powered` | sourcepotencies | Some effects are calculated. Trigger timing and the complete interaction rules are not implemented. | Status / potency; Trigger / timing; Additional scenario state |
| [Standoff](https://trello.com/c/3pNDKl4K) — `standoff` | sourcepotencies | Some effects are calculated. Trigger timing and the complete interaction rules are not implemented. | Status / potency; Trigger / timing |
| [Sunburn](https://trello.com/c/Su7Wd4pK) — `sunburn` | onDmgBonusMultiplier | Damage bonus against a Burning target, including DoTs. A Holy component upgrades the whole packet bonus. Burn application is not simulated. | Status / potency; Trigger / timing |
| [Swift Guard](https://trello.com/c/IM6fJaTL) — `swift_guard` | sourcepotencies | Some effects are calculated. Trigger timing and the complete interaction rules are not implemented. | Status / potency; Trigger / timing; Additional scenario state |
| [Vapor Aegis](https://trello.com/c/5gx8lj0F) — `vapor_aegis` | onFinalDamageTakenMultiplier | Selected Reinforce grants a direct 90% Fire/Water reduction, including DoTs. Duration changes are not simulated. | Status / potency; Trigger / timing |
| [Vassals Croak](https://trello.com/c/908nOpYl) — `vassals_croak` | sourcepotencies | Some effects are calculated. Trigger timing and the complete interaction rules are not implemented. | Status / potency; Trigger / timing; Additional scenario state |
| [Voltaic Body](https://trello.com/c/aMxLHAtO) — `voltaic_body` | getPerkDamageInfo | Charged-hit damage preview. Select Static Charge to choose hit count; activation and cooldown are not simulated. | Status / potency; Trigger / timing |
| [Weight Distribution](https://trello.com/c/w0LwsFfF) — `weight_distribution` | onStatCalculation | Some effects are calculated. Trigger timing and the complete interaction rules are not implemented. | Trigger / timing; Additional scenario state |
| [Whirlwind](https://trello.com/c/CpAFyjQu) — `whirlwind` | sourcepotencies | Some effects are calculated. Trigger timing and the complete interaction rules are not implemented. | Status / potency; Trigger / timing; Additional scenario state |
| [Wrathful Crits](https://trello.com/c/WPLSJfQR) — `wrathful_crits` | sourcepotencies | Some effects are calculated. Trigger timing and the complete interaction rules are not implemented. | Status / potency; Trigger / timing |

## Unsupported

| Perk / ID | Registered calculations | Scope / limitations | Next review |
| --- | --- | --- | --- |
| [Adaptive Plate](https://trello.com/c/OasQAMbT) — `adaptive_plate` | None | Listed for reference; this perk's effects are not currently calculated. | Trigger / timing; Additional scenario state |
| [Aggressive Personality](https://trello.com/c/pYAHsw6B) — `aggressive_personality` | None | Listed for reference; this perk's effects are not currently calculated. | Trigger / timing |
| [Air Barrier](https://trello.com/c/pokbRdbn) — `air_barrier` | None | Listed for reference; this perk's effects are not currently calculated. | Trigger / timing; Additional scenario state |
| [Air Pressure](https://trello.com/c/TbdQ5OOI) — `air_pressure` | None | Listed for reference; this perk's effects are not currently calculated. | Status / potency; Trigger / timing |
| [Apollo Boost](https://trello.com/c/URitSpQK) — `apollo_boost` | None | Listed for reference; this perk's effects are not currently calculated. | Trigger / timing; Additional scenario state |
| [Armor Penetration](https://trello.com/c/JnqZ3ih2) — `armor_penetration` | None | Listed for reference; this perk's effects are not currently calculated. | Formula / behavior review |
| [Artillery Mage](https://trello.com/c/fYve18wA) — `artillery_mage` | None | Listed for reference; this perk's effects are not currently calculated. | Formula / behavior review |
| [Ascended Enchant Perks](https://trello.com/c/BVpWuaTL) — `ascended_enchant_perks` | None | Listed for reference; this perk's effects are not currently calculated. | Formula / behavior review |
| [Barbed Flurry](https://trello.com/c/3Bg08Epj) — `barbed_flurry` | None | Listed for reference; this perk's effects are not currently calculated. | Status / potency; Trigger / timing |
| [Basic Spirit](https://trello.com/c/hLPfb773) — `basic_spirit` | None | Listed for reference; this perk's effects are not currently calculated. | Trigger / timing |
| [Bastion Ballista](https://trello.com/c/d1v1bK6T) — `bastion_ballista` | None | Listed for reference; this perk's effects are not currently calculated. | Trigger / timing |
| [Bastion Bless](https://trello.com/c/QHl1kv28) — `bastion_bless` | None | Listed for reference; this perk's effects are not currently calculated. | Status / potency; Trigger / timing; Additional scenario state |
| [Beastial Rage](https://trello.com/c/8LBFjFic) — `beastial_rage` | None | Listed for reference; this perk's effects are not currently calculated. | Status / potency; Trigger / timing |
| [Bellowing Ember](https://trello.com/c/7FkUd60a) — `bellowing_ember` | None | Listed for reference; this perk's effects are not currently calculated. | Status / potency; Trigger / timing |
| [Berserking Strength](https://trello.com/c/rRhFyA3j) — `berserkingstrength` | None | Listed for reference; this perk's effects are not currently calculated. | Formula / behavior review |
| [Blastshield](https://trello.com/c/VtQLoFxu) — `blastshield` | None | Listed for reference; this perk's effects are not currently calculated. | Trigger / timing |
| [Blazing Finisher](https://trello.com/c/IRzuD1Kj) — `blazing_finisher` | None | Listed for reference; this perk's effects are not currently calculated. | Status / potency; Trigger / timing |
| [Blood Lust](https://trello.com/c/zBPM5Pnx) — `blood_lust` | None | Listed for reference; this perk's effects are not currently calculated. | Status / potency; Trigger / timing |
| [Blood Rush](https://trello.com/c/qFgisICX) — `blood_rush` | None | Listed for reference; this perk's effects are not currently calculated. | Status / potency; Additional scenario state |
| [Blub Blub](https://trello.com/c/sKT0Zeoy) — `blub_blub` | None | Listed for reference; this perk's effects are not currently calculated. | Trigger / timing |
| [Bombardier](https://trello.com/c/eRKaaUsG) — `bombardier` | None | Listed for reference; this perk's effects are not currently calculated. | Trigger / timing |
| [Bomber Charge](https://trello.com/c/7Lll3C6C) — `bomber_charge` | None | Listed for reference; this perk's effects are not currently calculated. | Formula / behavior review |
| [Bomber Satchel](https://trello.com/c/uEglpUBj) — `bomber_satchel` | None | Listed for reference; this perk's effects are not currently calculated. | Trigger / timing |
| [Bomber Spirit](https://trello.com/c/0aEoqDe8) — `bomber_spirit` | None | Listed for reference; this perk's effects are not currently calculated. | Status / potency; Trigger / timing |
| [Bounce Momentum](https://trello.com/c/mp3UwOsc) — `bounce_momentum` | None | Listed for reference; this perk's effects are not currently calculated. | Status / potency; Trigger / timing; Additional scenario state |
| [Bowldur Spirit](https://trello.com/c/oXnQwZCf) — `bowldur_spirit` | None | Listed for reference; this perk's effects are not currently calculated. | Trigger / timing |
| [Bowlers Roll](https://trello.com/c/dvRyra6W) — `bowlers_roll` | None | Listed for reference; this perk's effects are not currently calculated. | Formula / behavior review |
| [Buckler](https://trello.com/c/3L9g2O2d) — `buckler` | None | Listed for reference; this perk's effects are not currently calculated. | Formula / behavior review |
| [Bulfrogg Spirit](https://trello.com/c/rMK8aYbO) — `bulfrogg_spirit` | None | Listed for reference; this perk's effects are not currently calculated. | Trigger / timing |
| [Bulwark](https://trello.com/c/TR3r3ZHO) — `bulwark` | None | Listed for reference; this perk's effects are not currently calculated. | Trigger / timing |
| [Bumblz Spirit](https://trello.com/c/rdFDqeyl) — `bumblz_spirit` | None | Listed for reference; this perk's effects are not currently calculated. | Trigger / timing; Additional scenario state |
| [Buni Spirit](https://trello.com/c/oPZnLHoU) — `buni_spirit` | None | Listed for reference; this perk's effects are not currently calculated. | Trigger / timing; Additional scenario state |
| [Caci King Spirit](https://trello.com/c/Q2MKbZhm) — `caci_king_spirit` | None | Listed for reference; this perk's effects are not currently calculated. | Status / potency; Trigger / timing; Additional scenario state |
| [Caci Spirit](https://trello.com/c/BaNYOPmt) — `caci_spirit` | None | Listed for reference; this perk's effects are not currently calculated. | Status / potency; Trigger / timing |
| [Cannonball](https://trello.com/c/uehJXat7) — `cannonball` | None | Listed for reference; this perk's effects are not currently calculated. | Trigger / timing; Additional scenario state |
| [Carapace](https://trello.com/c/YF2qDXA9) — `carapace` | None | Listed for reference; this perk's effects are not currently calculated. | Additional scenario state |
| [Carrying Winds](https://trello.com/c/fLKoazAe) — `carrying_winds` | None | Listed for reference; this perk's effects are not currently calculated. | Trigger / timing; Additional scenario state |
| [Caster](https://trello.com/c/bNACVMcB) — `caster` | None | Listed for reference; this perk's effects are not currently calculated. | Trigger / timing |
| [Caustic Slow](https://trello.com/c/ui2vFOBz) — `caustic_slow` | None | Listed for reference; this perk's effects are not currently calculated. | Status / potency |
| [Cauterize](https://trello.com/c/LPSC2zXY) — `cauterize` | None | Listed for reference; this perk's effects are not currently calculated. | Status / potency |
| [Channeled Depths](https://trello.com/c/bp27uuZ2) — `channeled_depths` | None | Listed for reference; this perk's effects are not currently calculated. | Status / potency |
| [Channeled Weapon](https://trello.com/c/Cu6Kzi1Z) — `channeled_weapon` | None | Listed for reference; this perk's effects are not currently calculated. | Trigger / timing |
| [Cinder Soul](https://trello.com/c/TMue1p2w) — `cinder_soul` | None | Listed for reference; this perk's effects are not currently calculated. | Status / potency |
| [Civilian](https://trello.com/c/llhxquuy) — `civilian` | None | Listed for reference; this perk's effects are not currently calculated. | Trigger / timing |
| [Cleansed Blade](https://trello.com/c/KAChfnOD) — `cleansed_blade` | None | Listed for reference; this perk's effects are not currently calculated. | Status / potency; Trigger / timing; Additional scenario state |
| [Cleave](https://trello.com/c/bKFIKrFD) — `cleave` | None | Listed for reference; this perk's effects are not currently calculated. | Status / potency; Trigger / timing; Additional scenario state |
| [Colossus](https://trello.com/c/Nlx5Zfld) — `colossus` | None | Listed for reference; this perk's effects are not currently calculated. | Trigger / timing; Additional scenario state |
| [Concealed Edge](https://trello.com/c/nGoxB9AM) — `concealed_edge` | None | Listed for reference; this perk's effects are not currently calculated. | Additional scenario state |
| [Concussion](https://trello.com/c/e5WgT8RN) — `concussion` | None | Listed for reference; this perk's effects are not currently calculated. | Formula / behavior review |
| [Conquerer](https://trello.com/c/NmYis80y) — `conquerer` | None | Listed for reference; this perk's effects are not currently calculated. | Status / potency |
| [Contained](https://trello.com/c/rEz99ZWw) — `contained` | None | Listed for reference; this perk's effects are not currently calculated. | Status / potency; Trigger / timing |
| [Cosmic Ray](https://trello.com/c/ZS6gvenU) — `cosmic_ray` | None | Listed for reference; this perk's effects are not currently calculated. | Formula / behavior review |
| [Counting Sheep](https://trello.com/c/wxSbJKwK) — `counting_sheep` | None | Listed for reference; this perk's effects are not currently calculated. | Additional scenario state |
| [Crimson Tithe](https://trello.com/c/YymDDmmN) — `crimson_tithe` | None | Listed for reference; this perk's effects are not currently calculated. | Trigger / timing; Additional scenario state |
| [Critical Healing](https://trello.com/c/uCZ5UuSy) — `critical_healing` | None | Listed for reference; this perk's effects are not currently calculated. | Trigger / timing |
| [Croakernaut Spirit](https://trello.com/c/wczMlNo3) — `croakernaut_spirit` | None | Listed for reference; this perk's effects are not currently calculated. | Status / potency; Trigger / timing; Additional scenario state |
| [Crushing Pressure](https://trello.com/c/G7uxNYkI) — `crushing_pressure` | None | Listed for reference; this perk's effects are not currently calculated. | Formula / behavior review |
| [Cryo Engine](https://trello.com/c/gcnekmwY) — `cryo_engine` | None | Listed for reference; this perk's effects are not currently calculated. | Status / potency; Trigger / timing; Additional scenario state |
| [Curse Rip](https://trello.com/c/J5kPDe3y) — `curse_rip` | None | Listed for reference; this perk's effects are not currently calculated. | Status / potency |
| [Cursed Bark](https://trello.com/c/R9Ua8FaJ) — `cursed_bark` | None | Listed for reference; this perk's effects are not currently calculated. | Status / potency; Trigger / timing; Additional scenario state |
| [Cursed Flames](https://trello.com/c/9SLLJiPB) — `cursed_flames` | None | Listed for reference; this perk's effects are not currently calculated. | Status / potency; Trigger / timing |
| [Dark Harvest](https://trello.com/c/0m1Y9ru4) — `dark_harvest` | None | Listed for reference; this perk's effects are not currently calculated. | Trigger / timing |
| [Dark Magic](https://trello.com/c/mgNRFUsc) — `dark_magic` | None | Listed for reference; this perk's effects are not currently calculated. | Additional scenario state |
| [Darkening Hex](https://trello.com/c/RCi9GMQG) — `darkening_hex` | None | Listed for reference; this perk's effects are not currently calculated. | Status / potency; Trigger / timing; Additional scenario state |
| [Deep Spider Spirit](https://trello.com/c/epRyrAAG) — `deep_spider_spirit` | None | Listed for reference; this perk's effects are not currently calculated. | Status / potency; Trigger / timing; Additional scenario state |
| [Deepcrystal Calling](https://trello.com/c/CeebgPXn) — `deepcrystal_calling` | None | Listed for reference; this perk's effects are not currently calculated. | Trigger / timing; Additional scenario state |
| [Defensive Stance](https://trello.com/c/0PXUJlbQ) — `defensive_stance` | None | Listed for reference; this perk's effects are not currently calculated. | Status / potency; Additional scenario state |
| [Delta Drill](https://trello.com/c/Szy3MKSH) — `delta_drill` | None | Listed for reference; this perk's effects are not currently calculated. | Formula / behavior review |
| [Deltabit](https://trello.com/c/HOIhXp9a) — `deltabit` | None | Listed for reference; this perk's effects are not currently calculated. | Trigger / timing; Additional scenario state |
| [Dire Buni Spirit](https://trello.com/c/qBlTxuLs) — `dire_buni_spirit` | None | Listed for reference; this perk's effects are not currently calculated. | Trigger / timing; Additional scenario state |
| [Divine Crash](https://trello.com/c/yTMXYt04) — `divine_crash` | None | Listed for reference; this perk's effects are not currently calculated. | Trigger / timing |
| [Divine Intervention](https://trello.com/c/AW93Cuu3) — `divine_intervention` | None | Listed for reference; this perk's effects are not currently calculated. | Status / potency; Trigger / timing; Additional scenario state |
| [Divinity](https://trello.com/c/5H07OAEZ) — `divinity` | None | Listed for reference; this perk's effects are not currently calculated. | Trigger / timing |
| [Dominating](https://trello.com/c/yzimqjId) — `dominating` | None | Listed for reference; this perk's effects are not currently calculated. | Status / potency; Additional scenario state |
| [Draconic Blood](https://trello.com/c/GtEdo60J) — `draconic_blood` | None | Listed for reference; this perk's effects are not currently calculated. | Status / potency; Trigger / timing; Additional scenario state |
| [Draconic Runes](https://trello.com/c/ryqD3r8n) — `draconic_runes` | None | Listed for reference; this perk's effects are not currently calculated. | Formula / behavior review |
| [Dragigator Spirit](https://trello.com/c/BHeSYSAo) — `dragigator_spirit` | None | Listed for reference; this perk's effects are not currently calculated. | Status / potency; Trigger / timing; Additional scenario state |
| [Dragon Breath](https://trello.com/c/KkTA2Oq0) — `dragon_breath` | None | Listed for reference; this perk's effects are not currently calculated. | Status / potency; Trigger / timing |
| [Dragon State](https://trello.com/c/sAG0j9u3) — `dragon_state` | None | Listed for reference; this perk's effects are not currently calculated. | Formula / behavior review |
| [Drone](https://trello.com/c/dmygvfPS) — `drone` | None | Listed for reference; this perk's effects are not currently calculated. | Additional scenario state |
| [Echo Blast](https://trello.com/c/pImd8rfP) — `echo_blast` | None | Listed for reference; this perk's effects are not currently calculated. | Additional scenario state |
| [Echo Incineration](https://trello.com/c/7s5VmIol) — `echo_incineration` | None | Listed for reference; this perk's effects are not currently calculated. | Status / potency; Trigger / timing; Additional scenario state |
| [Emotional](https://trello.com/c/qzmBIYkD) — `emotional` | None | Listed for reference; this perk's effects are not currently calculated. | Status / potency; Trigger / timing |
| [Endless Despair](https://trello.com/c/DmG6mFg8) — `endless_despair` | None | Listed for reference; this perk's effects are not currently calculated. | Status / potency; Trigger / timing; Additional scenario state |
| [Energize](https://trello.com/c/tknW6gsB) — `energize` | None | Listed for reference; this perk's effects are not currently calculated. | Trigger / timing |
| [Engine](https://trello.com/c/kNRHFv5d) — `engine` | None | Listed for reference; this perk's effects are not currently calculated. | Status / potency |
| [Equipment Farmer](https://trello.com/c/jfBO8V77) — `equipment_farmer` | None | Listed for reference; this perk's effects are not currently calculated. | Formula / behavior review |
| [Erosion](https://trello.com/c/iCWTWoVH) — `erosion` | None | Listed for reference; this perk's effects are not currently calculated. | Status / potency; Trigger / timing |
| [Essence Ray](https://trello.com/c/DHbtUgdt) — `essence_ray` | None | Listed for reference; this perk's effects are not currently calculated. | Trigger / timing |
| [Essence Totem](https://trello.com/c/MHtATsn2) — `essence_totem` | None | Listed for reference; this perk's effects are not currently calculated. | Trigger / timing |
| [Executioner](https://trello.com/c/vrmvJPnI) — `executioner` | None | Listed for reference; this perk's effects are not currently calculated. | Formula / behavior review |
| [Exhaust](https://trello.com/c/2pUwMZxy) — `exhaust` | None | Listed for reference; this perk's effects are not currently calculated. | Status / potency; Trigger / timing |
| [Explosive Charge](https://trello.com/c/wdF608Pd) — `explosive_charge` | None | Listed for reference; this perk's effects are not currently calculated. | Formula / behavior review |
| [Explosive Honey](https://trello.com/c/DzUd6F24) — `explosive_honey` | None | Listed for reference; this perk's effects are not currently calculated. | Formula / behavior review |
| [Extinguish](https://trello.com/c/5lI1gM4c) — `extinguish` | None | Listed for reference; this perk's effects are not currently calculated. | Additional scenario state |
| [Fell Rush](https://trello.com/c/v7Akzybg) — `fell_rush` | None | Listed for reference; this perk's effects are not currently calculated. | Status / potency; Trigger / timing; Additional scenario state |
| [Ferocity](https://trello.com/c/mQcZDH0s) — `ferocity` | None | Listed for reference; this perk's effects are not currently calculated. | Status / potency |
| [Fiery Pursuit](https://trello.com/c/39iFQqea) — `fiery_pursuit` | None | Listed for reference; this perk's effects are not currently calculated. | Status / potency |
| [Final Act](https://trello.com/c/l83Hkyfa) — `final_act` | None | Listed for reference; this perk's effects are not currently calculated. | Additional scenario state |
| [Flash Strike](https://trello.com/c/ge4rmWRD) — `flash_strike` | None | Listed for reference; this perk's effects are not currently calculated. | Status / potency; Trigger / timing |
| [Forgotten Chivalry](https://trello.com/c/em0Wta94) — `forgotten_chivalry` | None | Listed for reference; this perk's effects are not currently calculated. | Status / potency; Trigger / timing |
| [Fractured Energy](https://trello.com/c/WO4IValE) — `fractured_energy` | None | Listed for reference; this perk's effects are not currently calculated. | Trigger / timing |
| [Fragrance Aura](https://trello.com/c/pcFpdK1s) — `fragrance_aura` | None | Listed for reference; this perk's effects are not currently calculated. | Status / potency; Trigger / timing; Additional scenario state |
| [Frenzy](https://trello.com/c/XdrbSgVW) — `frenzy` | None | Listed for reference; this perk's effects are not currently calculated. | Status / potency; Trigger / timing; Additional scenario state |
| [Frequent Flier](https://trello.com/c/AYAygnuB) — `frequent_flier` | None | Listed for reference; this perk's effects are not currently calculated. | Additional scenario state |
| [Frozen Heart](https://trello.com/c/QGlNl7Tp) — `frozen_heart` | None | Listed for reference; this perk's effects are not currently calculated. | Formula / behavior review |
| [Frozen Waste](https://trello.com/c/XUFjA3Oy) — `frozen_waste` | None | Listed for reference; this perk's effects are not currently calculated. | Trigger / timing; Additional scenario state |
| [Fungal Prototype](https://trello.com/c/oygo9Pw2) — `fungal_prototype` | None | Listed for reference; this perk's effects are not currently calculated. | Status / potency |
| [Fury](https://trello.com/c/PYbZH8vH) — `fury` | None | Listed for reference; this perk's effects are not currently calculated. | Status / potency; Trigger / timing |
| [Future Sight](https://trello.com/c/zqgTEn7j) — `future_sight` | None | Listed for reference; this perk's effects are not currently calculated. | Status / potency; Trigger / timing; Additional scenario state |
| [Gale Bursts](https://trello.com/c/82Gmhs7I) — `gale_bursts` | None | Listed for reference; this perk's effects are not currently calculated. | Formula / behavior review |
| [Gaseous Smash](https://trello.com/c/nHQ9Tm6K) — `gaseous_smash` | None | Listed for reference; this perk's effects are not currently calculated. | Status / potency |
| [Gelid Lance](https://trello.com/c/g2VKZtET) — `gelid_lance` | None | Listed for reference; this perk's effects are not currently calculated. | Status / potency; Additional scenario state |
| [Ghastly Rot](https://trello.com/c/hugPFrtw) — `ghastly_rot` | None | Listed for reference; this perk's effects are not currently calculated. | Status / potency; Trigger / timing; Additional scenario state |
| [Glacial Buildup](https://trello.com/c/M0EtSSrb) — `glacial_buildup` | None | Listed for reference; this perk's effects are not currently calculated. | Trigger / timing |
| [Glyph Conduit](https://trello.com/c/9p6RpgS3) — `glyph_conduit` | None | Listed for reference; this perk's effects are not currently calculated. | Trigger / timing; Additional scenario state |
| [Gnawing Poison](https://trello.com/c/OZUTZhKH) — `gnawing_poison` | None | Listed for reference; this perk's effects are not currently calculated. | Status / potency; Trigger / timing |
| [Golem Guillotine](https://trello.com/c/S2yxgcVa) — `golem_guillotine` | None | Listed for reference; this perk's effects are not currently calculated. | Formula / behavior review |
| [Gorecast](https://trello.com/c/7HK2pKpv) — `gorecast` | None | Listed for reference; this perk's effects are not currently calculated. | Status / potency; Additional scenario state |
| [Grandmagic Guard](https://trello.com/c/n1JqetL7) — `grandmagic_guard` | None | Listed for reference; this perk's effects are not currently calculated. | Additional scenario state |
| [Gravitational Enforcer](https://trello.com/c/r9LM8Qcs) — `gravitational_enforcer` | None | Listed for reference; this perk's effects are not currently calculated. | Status / potency; Trigger / timing |
| [Gravity Well](https://trello.com/c/4ZoUZs3u) — `gravity_well` | None | Listed for reference; this perk's effects are not currently calculated. | Formula / behavior review |
| [Gremlin Spirit](https://trello.com/c/fHkTpUJx) — `gremlin_spirit` | None | Listed for reference; this perk's effects are not currently calculated. | Status / potency; Trigger / timing |
| [Grounded Despair](https://trello.com/c/KfRmwoqr) — `grounded_despair` | None | Listed for reference; this perk's effects are not currently calculated. | Status / potency; Trigger / timing; Additional scenario state |
| [Guardian Spin](https://trello.com/c/FMywHsbl) — `guardian_spin` | None | Listed for reference; this perk's effects are not currently calculated. | Formula / behavior review |
| [Guiding Winds](https://trello.com/c/PXHDPKRY) — `guiding_winds` | None | Listed for reference; this perk's effects are not currently calculated. | Status / potency; Trigger / timing; Additional scenario state |
| [Hardened Will](https://trello.com/c/Bhvtoq8g) — `hardened_will` | None | Listed for reference; this perk's effects are not currently calculated. | Trigger / timing |
| [Heal Boost](https://trello.com/c/CrkBe44p) — `heal_boost` | None | Listed for reference; this perk's effects are not currently calculated. | Formula / behavior review |
| [Healing Arts](https://trello.com/c/rgXca0Xl) — `healing_arts` | None | Listed for reference; this perk's effects are not currently calculated. | Trigger / timing |
| [Heat Drill](https://trello.com/c/FQqNb1IV) — `heat_drill` | None | Listed for reference; this perk's effects are not currently calculated. | Status / potency; Trigger / timing |
| [Heavy Gravitate](https://trello.com/c/JJWBwgYQ) — `heavy_gravitate` | None | Listed for reference; this perk's effects are not currently calculated. | Status / potency; Trigger / timing |
| [Heavy Slate](https://trello.com/c/BCycQTfD) — `heavy_slate` | None | Listed for reference; this perk's effects are not currently calculated. | Trigger / timing |
| [Heightened Reflexes](https://trello.com/c/1KBNIjet) — `heightened_reflexes` | None | Listed for reference; this perk's effects are not currently calculated. | Status / potency; Trigger / timing; Additional scenario state |
| [Hex Ray](https://trello.com/c/aFvDz28k) — `hex_ray` | None | Listed for reference; this perk's effects are not currently calculated. | Status / potency; Trigger / timing |
| [Hex Shield](https://trello.com/c/xqCMsx9X) — `hex_shield` | None | Listed for reference; this perk's effects are not currently calculated. | Status / potency; Trigger / timing |
| [Holy Tides](https://trello.com/c/BlP2SvSq) — `holy_tides` | None | Listed for reference; this perk's effects are not currently calculated. | Status / potency; Trigger / timing; Additional scenario state |
| [Honey Arts](https://trello.com/c/FQiQ6BgC) — `honey_arts` | None | Listed for reference; this perk's effects are not currently calculated. | Trigger / timing; Additional scenario state |
| [Honey Gather](https://trello.com/c/rEJrT3Pq) — `honey_gather` | None | Listed for reference; this perk's effects are not currently calculated. | Formula / behavior review |
| [Hypnotist](https://trello.com/c/Mte3unIP) — `hypnotist` | None | Listed for reference; this perk's effects are not currently calculated. | Status / potency; Trigger / timing |
| [Ice Barge](https://trello.com/c/3mFguLrj) — `ice_barge` | None | Listed for reference; this perk's effects are not currently calculated. | Status / potency; Trigger / timing; Additional scenario state |
| [Ice Burst](https://trello.com/c/cKbJP0nj) — `ice_burst` | None | Listed for reference; this perk's effects are not currently calculated. | Status / potency; Trigger / timing |
| [Icestorm](https://trello.com/c/F0tSuvN4) — `icestorm` | None | Listed for reference; this perk's effects are not currently calculated. | Trigger / timing |
| [Ichor Spark](https://trello.com/c/nkkR2mvi) — `ichor_spark` | None | Listed for reference; this perk's effects are not currently calculated. | Status / potency; Trigger / timing; Additional scenario state |
| [Infection](https://trello.com/c/Qk2ZR46v) — `infection` | None | Listed for reference; this perk's effects are not currently calculated. | Status / potency; Additional scenario state |
| [Inhuman Swings](https://trello.com/c/G89Ri2Oo) — `inhuman_swings` | None | Listed for reference; this perk's effects are not currently calculated. | Status / potency |
| [Inoculation](https://trello.com/c/9WoP9L4r) — `inoculation` | None | Listed for reference; this perk's effects are not currently calculated. | Status / potency |
| [Inspiration](https://trello.com/c/DLCdQ0RQ) — `inspiration` | None | Listed for reference; this perk's effects are not currently calculated. | Status / potency; Trigger / timing; Additional scenario state |
| [Investigator](https://trello.com/c/A2CVoa5j) — `investigator` | None | Listed for reference; this perk's effects are not currently calculated. | Additional scenario state |
| [Iron Bounce](https://trello.com/c/iarJ7Tf6) — `iron_bounce` | None | Listed for reference; this perk's effects are not currently calculated. | Status / potency; Trigger / timing; Additional scenario state |
| [Iron Slayer Spirit](https://trello.com/c/jO7w0PKD) — `iron_slayer_spirit` | None | Listed for reference; this perk's effects are not currently calculated. | Status / potency; Trigger / timing |
| [Juggernaut](https://trello.com/c/rqrxBBeH) — `juggernaut` | None | Listed for reference; this perk's effects are not currently calculated. | Formula / behavior review |
| [Kama Blades](https://trello.com/c/eCUCiY6y) — `kama_blades` | None | Listed for reference; this perk's effects are not currently calculated. | Formula / behavior review |
| [Kindling](https://trello.com/c/biuQhgpJ) — `kindling` | None | Listed for reference; this perk's effects are not currently calculated. | Status / potency; Trigger / timing |
| [Lance](https://trello.com/c/KK5A6Gja) — `lance` | None | Listed for reference; this perk's effects are not currently calculated. | Formula / behavior review |
| [Life Drinker](https://trello.com/c/kCLCqnVT) — `life_drinker` | None | Listed for reference; this perk's effects are not currently calculated. | Trigger / timing |
| [Lifesteal](https://trello.com/c/YvAb4yEj) — `lifesteal` | None | Listed for reference; this perk's effects are not currently calculated. | Formula / behavior review |
| [Light Bearer](https://trello.com/c/ef1VIfPi) — `light_bearer` | None | Listed for reference; this perk's effects are not currently calculated. | Trigger / timing |
| [Lithic Veil](https://trello.com/c/nQQ1tNKd) — `lithic_veil` | None | Listed for reference; this perk's effects are not currently calculated. | Trigger / timing |
| [Lodestone Barrage](https://trello.com/c/3VOQH5gn) — `lodestone_barrage` | None | Listed for reference; this perk's effects are not currently calculated. | Status / potency; Trigger / timing; Additional scenario state |
| [Lucky](https://trello.com/c/ElHijWTj) — `lucky` | None | Listed for reference; this perk's effects are not currently calculated. | Trigger / timing; Additional scenario state |
| [Luminescent Fervor](https://trello.com/c/se1uG8r0) — `luminescent_fervor` | None | Listed for reference; this perk's effects are not currently calculated. | Status / potency; Trigger / timing; Additional scenario state |
| [Mageling Spirit](https://trello.com/c/ksLE0q3V) — `mageling_spirit` | None | Listed for reference; this perk's effects are not currently calculated. | Trigger / timing; Additional scenario state |
| [Magic Circuit](https://trello.com/c/yp755O8x) — `magic_circuit` | None | Listed for reference; this perk's effects are not currently calculated. | Trigger / timing |
| [Magic Guard](https://trello.com/c/OD9O0R6r) — `magic_guard` | None | Listed for reference; this perk's effects are not currently calculated. | Trigger / timing |
| [Magic Surge](https://trello.com/c/4IWzZwHn) — `magic_surge` | None | Listed for reference; this perk's effects are not currently calculated. | Status / potency; Trigger / timing |
| [Mark Of The Dragon](https://trello.com/c/TlYpX2dp) — `mark_of_the_dragon` | None | Listed for reference; this perk's effects are not currently calculated. | Formula / behavior review |
| [Melting Shred](https://trello.com/c/FZfjkqoc) — `melting_shred` | None | Listed for reference; this perk's effects are not currently calculated. | Status / potency |
| [Minature](https://trello.com/c/oHAZUTAp) — `minature` | None | Listed for reference; this perk's effects are not currently calculated. | Formula / behavior review |
| [Mine](https://trello.com/c/a0AQAx3n) — `mine` | None | Listed for reference; this perk's effects are not currently calculated. | Status / potency |
| [Minion Absorption](https://trello.com/c/LjisLTST) — `minion_absorption` | None | Listed for reference; this perk's effects are not currently calculated. | Status / potency; Additional scenario state |
| [Money Smart](https://trello.com/c/YpzDpSho) — `money_smart` | None | Listed for reference; this perk's effects are not currently calculated. | Formula / behavior review |
| [Mortal Will](https://trello.com/c/kGt8abkV) — `mortal_will` | None | Listed for reference; this perk's effects are not currently calculated. | Status / potency |
| [Mounted Defense](https://trello.com/c/nNcCVWEa) — `mounted_defense` | None | Listed for reference; this perk's effects are not currently calculated. | Additional scenario state |
| [Mycotic Bloom](https://trello.com/c/9nA8O7Im) — `mycotic_bloom` | None | Listed for reference; this perk's effects are not currently calculated. | Status / potency |
| [Ocean Song](https://trello.com/c/McwSVZiW) — `ocean_song` | None | Listed for reference; this perk's effects are not currently calculated. | Trigger / timing; Additional scenario state |
| [Old Gods Might](https://trello.com/c/27UtR6dS) — `old_gods_might` | None | Listed for reference; this perk's effects are not currently calculated. | Formula / behavior review |
| [Packaged Power](https://trello.com/c/u4gDE0wT) — `packaged_power` | None | Listed for reference; this perk's effects are not currently calculated. | Formula / behavior review |
| [Pain Distribution](https://trello.com/c/VkKfeBEX) — `pain_distribution` | None | Listed for reference; this perk's effects are not currently calculated. | Additional scenario state |
| [Parry](https://trello.com/c/E8dV0GFm) — `parry` | None | Listed for reference; this perk's effects are not currently calculated. | Status / potency; Trigger / timing; Additional scenario state |
| [Penance](https://trello.com/c/mPpoJZEF) — `penance` | None | Listed for reference; this perk's effects are not currently calculated. | Status / potency; Trigger / timing; Additional scenario state |
| [Phalanx Stab](https://trello.com/c/eNRFFXzK) — `phalanx_stab` | None | Listed for reference; this perk's effects are not currently calculated. | Status / potency; Trigger / timing |
| [Phantom Pain](https://trello.com/c/T3EpcFwm) — `phantom_pain` | None | Listed for reference; this perk's effects are not currently calculated. | Status / potency; Trigger / timing |
| [Photosynthesis](https://trello.com/c/XCDTt8fa) — `photosynthesis` | None | Listed for reference; this perk's effects are not currently calculated. | Additional scenario state |
| [Piercer](https://trello.com/c/NFUcwTLW) — `piercer` | None | Listed for reference; this perk's effects are not currently calculated. | Additional scenario state |
| [Poison Acceleration](https://trello.com/c/rsFKJevO) — `poison_acceleration` | None | Listed for reference; this perk's effects are not currently calculated. | Status / potency; Trigger / timing |
| [Poisonous](https://trello.com/c/uPlSBhdo) — `poisonous` | None | Listed for reference; this perk's effects are not currently calculated. | Status / potency; Trigger / timing |
| [Possession](https://trello.com/c/hxxvjZfA) — `possession` | None | Listed for reference; this perk's effects are not currently calculated. | Status / potency; Additional scenario state |
| [Potion Chugger](https://trello.com/c/IRk76Iyz) — `potion_chugger` | None | Listed for reference; this perk's effects are not currently calculated. | Status / potency |
| [Power Inhale](https://trello.com/c/ejIfHxaz) — `power_inhale` | None | Listed for reference; this perk's effects are not currently calculated. | Formula / behavior review |
| [Power Surge](https://trello.com/c/PcGE0Dho) — `power_surge` | None | Listed for reference; this perk's effects are not currently calculated. | Trigger / timing |
| [Primal](https://trello.com/c/vzWGUk5s) — `primal` | None | Listed for reference; this perk's effects are not currently calculated. | Status / potency; Trigger / timing; Additional scenario state |
| [Propelling Fun](https://trello.com/c/gzKoVlYZ) — `propelling_fun` | None | Listed for reference; this perk's effects are not currently calculated. | Status / potency; Trigger / timing; Additional scenario state |
| [Protector Spirit](https://trello.com/c/FmE8jZG8) — `protector_spirit` | None | Listed for reference; this perk's effects are not currently calculated. | Trigger / timing; Additional scenario state |
| [Proto Tech](https://trello.com/c/CDJxz3Ru) — `proto_tech` | None | Listed for reference; this perk's effects are not currently calculated. | Status / potency; Trigger / timing; Additional scenario state |
| [Pulverizing Rush](https://trello.com/c/oys9mYRq) — `pulverizing_rush` | None | Listed for reference; this perk's effects are not currently calculated. | Trigger / timing; Additional scenario state |
| [Pure Rot](https://trello.com/c/LtBiZA2N) — `pure_rot` | None | Listed for reference; this perk's effects are not currently calculated. | Status / potency; Trigger / timing |
| [Pursuit](https://trello.com/c/35mGGKLm) — `pursuit` | None | Listed for reference; this perk's effects are not currently calculated. | Formula / behavior review |
| [Pyre Bloom](https://trello.com/c/XHQ7jYcv) — `pyre_bloom` | None | Listed for reference; this perk's effects are not currently calculated. | Status / potency; Trigger / timing; Additional scenario state |
| [Quake](https://trello.com/c/A3c7WDYY) — `quake` | None | Listed for reference; this perk's effects are not currently calculated. | Trigger / timing |
| [Quarry](https://trello.com/c/yNxjT0Qy) — `quarry` | None | Listed for reference; this perk's effects are not currently calculated. | Trigger / timing |
| [Queen Bumblz Spirit](https://trello.com/c/NrmzTU98) — `queen_bumblz_spirit` | None | Listed for reference; this perk's effects are not currently calculated. | Trigger / timing; Additional scenario state |
| [Queen's Guard](https://trello.com/c/L6QUW33j) — `queen_s_guard` | None | Listed for reference; this perk's effects are not currently calculated. | Status / potency; Trigger / timing; Additional scenario state |
| [Queen's Power](https://trello.com/c/iXRhniBw) — `queen_s_power` | None | Listed for reference; this perk's effects are not currently calculated. | Status / potency; Trigger / timing; Additional scenario state |
| [Quick Witted](https://trello.com/c/73dSCsCt) — `quick_witted` | None | Listed for reference; this perk's effects are not currently calculated. | Formula / behavior review |
| [Quickcast](https://trello.com/c/g2viQpA0) — `quickcast` | None | Listed for reference; this perk's effects are not currently calculated. | Trigger / timing |
| [Quickdraw](https://trello.com/c/hWCUSZTd) — `quickdraw` | None | Listed for reference; this perk's effects are not currently calculated. | Trigger / timing |
| [Quicksand](https://trello.com/c/65ejRzni) — `quicksand` | None | Listed for reference; this perk's effects are not currently calculated. | Formula / behavior review |
| [Rabbits Foot](https://trello.com/c/PMeIQVxz) — `rabbits_foot` | None | Listed for reference; this perk's effects are not currently calculated. | Trigger / timing |
| [Radiance](https://trello.com/c/dOR4MMik) — `radiance` | None | Listed for reference; this perk's effects are not currently calculated. | Status / potency; Additional scenario state |
| [Raging Bounce](https://trello.com/c/CSv4bCK2) — `raging_bounce` | None | Listed for reference; this perk's effects are not currently calculated. | Status / potency |
| [Rainstorm](https://trello.com/c/NezR4CnE) — `rainstorm` | None | Listed for reference; this perk's effects are not currently calculated. | Trigger / timing |
| [Reinforced Block](https://trello.com/c/8IqoxhuL) — `reinforced_block` | None | Listed for reference; this perk's effects are not currently calculated. | Trigger / timing; Additional scenario state |
| [Rejuvenating Flame](https://trello.com/c/U7SwdI8y) — `rejuvenating_flame` | None | Listed for reference; this perk's effects are not currently calculated. | Status / potency; Trigger / timing; Additional scenario state |
| [Revel In Death](https://trello.com/c/0Jo2ySfO) — `revel_in_death` | None | Listed for reference; this perk's effects are not currently calculated. | Trigger / timing; Additional scenario state |
| [Rider](https://trello.com/c/iEoLKdcK) — `rider` | None | Listed for reference; this perk's effects are not currently calculated. | Trigger / timing; Additional scenario state |
| [Roaring Heads](https://trello.com/c/DOxZoBsS) — `roaring_heads` | None | Listed for reference; this perk's effects are not currently calculated. | Status / potency; Trigger / timing; Additional scenario state |
| [Rocky Body](https://trello.com/c/o0OgPMRa) — `rocky_body` | None | Listed for reference; this perk's effects are not currently calculated. | Formula / behavior review |
| [Roguent Spirit](https://trello.com/c/z9QPnUZt) — `roguent_spirit` | None | Listed for reference; this perk's effects are not currently calculated. | Trigger / timing |
| [Roll Back](https://trello.com/c/nYGBkhWU) — `roll_back` | None | Listed for reference; this perk's effects are not currently calculated. | Formula / behavior review |
| [Rotating Blades](https://trello.com/c/RtJsuD74) — `rotating_blades` | None | Listed for reference; this perk's effects are not currently calculated. | Formula / behavior review |
| [Royal Finisher](https://trello.com/c/GR94krv6) — `royal_finisher` | None | Listed for reference; this perk's effects are not currently calculated. | Formula / behavior review |
| [Royal Parry](https://trello.com/c/7rLtzchF) — `royal_parry` | None | Listed for reference; this perk's effects are not currently calculated. | Status / potency; Trigger / timing |
| [Ruler Of The Sands](https://trello.com/c/Mhw4xIbL) — `ruler_of_the_sands` | None | Listed for reference; this perk's effects are not currently calculated. | Trigger / timing; Additional scenario state |
| [Runic Blades](https://trello.com/c/BfKe6Lxp) — `runic_blades` | None | Listed for reference; this perk's effects are not currently calculated. | Status / potency; Trigger / timing |
| [Runic Winds](https://trello.com/c/xvseWOc5) — `runic_winds` | None | Listed for reference; this perk's effects are not currently calculated. | Status / potency; Trigger / timing |
| [Sacred Grounds](https://trello.com/c/hiETbRAL) — `sacred_grounds` | None | Listed for reference; this perk's effects are not currently calculated. | Status / potency; Trigger / timing |
| [Sacrificial Summoning](https://trello.com/c/6l6zNB5w) — `sacrificial_summoning` | None | Listed for reference; this perk's effects are not currently calculated. | Status / potency; Additional scenario state |
| [Sandy Wounds](https://trello.com/c/qq92CeKg) — `sandy_wounds` | None | Listed for reference; this perk's effects are not currently calculated. | Status / potency; Trigger / timing |
| [Savage Combo](https://trello.com/c/mIKy8JIv) — `savage_combo` | None | Listed for reference; this perk's effects are not currently calculated. | Trigger / timing |
| [Saw Heart](https://trello.com/c/09qOIev2) — `saw_heart` | None | Listed for reference; this perk's effects are not currently calculated. | Status / potency; Trigger / timing |
| [Screeching Sound](https://trello.com/c/rlZxlEzw) — `screeching_sound` | None | Listed for reference; this perk's effects are not currently calculated. | Trigger / timing; Additional scenario state |
| [Seismic Momentum](https://trello.com/c/yJt9lFvu) — `seismic_momentum` | None | Listed for reference; this perk's effects are not currently calculated. | Trigger / timing |
| [Serrated Edge](https://trello.com/c/EXxrHQii) — `serrated_edge` | None | Listed for reference; this perk's effects are not currently calculated. | Status / potency; Trigger / timing |
| [Shamanic Flow](https://trello.com/c/G1FPIsxT) — `shamanic_flow` | None | Listed for reference; this perk's effects are not currently calculated. | Trigger / timing |
| [Sharp Claws](https://trello.com/c/HPVgS8Ti) — `sharp_claws` | None | Listed for reference; this perk's effects are not currently calculated. | Status / potency; Trigger / timing; Additional scenario state |
| [Sharpshooter](https://trello.com/c/joVhTK4K) — `sharpshooter` | None | Listed for reference; this perk's effects are not currently calculated. | Formula / behavior review |
| [Shielding Gong](https://trello.com/c/HwIUTqNd) — `shielding_gong` | None | Listed for reference; this perk's effects are not currently calculated. | Status / potency; Trigger / timing; Additional scenario state |
| [Sickly Sweetness](https://trello.com/c/LTM2Zzkq) — `sickly_sweetness` | None | Listed for reference; this perk's effects are not currently calculated. | Trigger / timing; Additional scenario state |
| [Sickness](https://trello.com/c/FamRjoPX) — `sickness` | None | Listed for reference; this perk's effects are not currently calculated. | Trigger / timing; Additional scenario state |
| [Siphoning Rot](https://trello.com/c/I07xodii) — `siphoning_rot` | None | Listed for reference; this perk's effects are not currently calculated. | Status / potency |
| [Slayer Rage](https://trello.com/c/3VKML2lH) — `slayer_rage` | None | Listed for reference; this perk's effects are not currently calculated. | Status / potency; Trigger / timing; Additional scenario state |
| [Slow Leak](https://trello.com/c/WUx9x3Bq) — `slow_leak` | None | Listed for reference; this perk's effects are not currently calculated. | Status / potency; Trigger / timing |
| [Smoldering](https://trello.com/c/GY9cpb7j) — `smoldering` | None | Listed for reference; this perk's effects are not currently calculated. | Status / potency; Trigger / timing |
| [Snoeman Spirit](https://trello.com/c/9DpcrFKP) — `snoeman_spirit` | None | Listed for reference; this perk's effects are not currently calculated. | Trigger / timing |
| [Solar Light](https://trello.com/c/uE3mmdYz) — `solar_light` | None | Listed for reference; this perk's effects are not currently calculated. | Trigger / timing; Additional scenario state |
| [Spirit Commune](https://trello.com/c/XZ1bQmyb) — `spirit_commune` | None | Listed for reference; this perk's effects are not currently calculated. | Trigger / timing |
| [Spirit Winds](https://trello.com/c/Cs2JybzB) — `spirit_winds` | None | Listed for reference; this perk's effects are not currently calculated. | Status / potency |
| [Splinter](https://trello.com/c/nCZV51YK) — `splinter` | None | Listed for reference; this perk's effects are not currently calculated. | Status / potency |
| [Spore Burst](https://trello.com/c/LT3dMrYa) — `spore_burst` | None | Listed for reference; this perk's effects are not currently calculated. | Status / potency; Additional scenario state |
| [Spore Trooper](https://trello.com/c/hGUuvJ4u) — `spore_trooper` | None | Listed for reference; this perk's effects are not currently calculated. | Status / potency; Trigger / timing; Additional scenario state |
| [Spring Step](https://trello.com/c/wpTVMn3G) — `spring_step` | None | Listed for reference; this perk's effects are not currently calculated. | Status / potency; Trigger / timing; Additional scenario state |
| [Springblast](https://trello.com/c/DqfOAy87) — `springblast` | None | Listed for reference; this perk's effects are not currently calculated. | Status / potency; Trigger / timing; Additional scenario state |
| [Star Barrage](https://trello.com/c/xrX4I7k4) — `star_barrage` | None | Listed for reference; this perk's effects are not currently calculated. | Trigger / timing |
| [Star Friendship](https://trello.com/c/Ln0JZU0u) — `star_friendship` | None | Listed for reference; this perk's effects are not currently calculated. | Status / potency; Trigger / timing; Additional scenario state |
| [Star Struck](https://trello.com/c/y4pCb8ES) — `star_struck` | None | Listed for reference; this perk's effects are not currently calculated. | Trigger / timing |
| [Static Buildup](https://trello.com/c/yZYvzNU4) — `static_buildup` | None | Listed for reference; this perk's effects are not currently calculated. | Trigger / timing |
| [Stealth](https://trello.com/c/0bVkfnHv) — `stealth` | None | Listed for reference; this perk's effects are not currently calculated. | Trigger / timing |
| [Steam Charge](https://trello.com/c/IK4uFapU) — `steam_charge` | None | Listed for reference; this perk's effects are not currently calculated. | Status / potency; Trigger / timing |
| [Steam Powered](https://trello.com/c/xkEv6XS5) — `steam_powered` | None | Listed for reference; this perk's effects are not currently calculated. | Status / potency; Trigger / timing; Additional scenario state |
| [Sticky Guard](https://trello.com/c/mxB5qpj1) — `sticky_guard` | None | Listed for reference; this perk's effects are not currently calculated. | Status / potency; Trigger / timing |
| [Sticky Summons](https://trello.com/c/RxSlo2Wz) — `sticky_summons` | None | Listed for reference; this perk's effects are not currently calculated. | Trigger / timing; Additional scenario state |
| [Sticky Swings](https://trello.com/c/Vau2WfCJ) — `sticky_swings` | None | Listed for reference; this perk's effects are not currently calculated. | Trigger / timing |
| [Stone Weapon](https://trello.com/c/whDhtayi) — `stone_weapon` | None | Listed for reference; this perk's effects are not currently calculated. | Formula / behavior review |
| [Stoneskin](https://trello.com/c/1XTUhwjd) — `stoneskin` | None | Listed for reference; this perk's effects are not currently calculated. | Trigger / timing |
| [Stored Corruption](https://trello.com/c/IpTbECa3) — `stored_corruption` | None | Listed for reference; this perk's effects are not currently calculated. | Status / potency; Trigger / timing; Additional scenario state |
| [Storm Caster](https://trello.com/c/dfvWeth1) — `storm_caster` | None | Listed for reference; this perk's effects are not currently calculated. | Trigger / timing |
| [Storm Rend](https://trello.com/c/idtrv53q) — `storm_rend` | None | Listed for reference; this perk's effects are not currently calculated. | Status / potency; Trigger / timing |
| [Stormcaller](https://trello.com/c/GFZMcUhT) — `stormcaller` | None | Listed for reference; this perk's effects are not currently calculated. | Trigger / timing |
| [Stratos Winds](https://trello.com/c/IlUN0PxJ) — `stratos_winds` | None | Listed for reference; this perk's effects are not currently calculated. | Formula / behavior review |
| [Swarm](https://trello.com/c/vE2nFmKE) — `swarm` | None | Listed for reference; this perk's effects are not currently calculated. | Additional scenario state |
| [Sweet Tooth](https://trello.com/c/fmSbuMuu) — `sweet_tooth` | None | Listed for reference; this perk's effects are not currently calculated. | Trigger / timing; Additional scenario state |
| [Tailwind](https://trello.com/c/GEos2u2J) — `tailwind` | None | Listed for reference; this perk's effects are not currently calculated. | Status / potency; Trigger / timing |
| [Tectonic Heat](https://trello.com/c/BWDgvozQ) — `tectonic_heat` | None | Listed for reference; this perk's effects are not currently calculated. | Status / potency; Trigger / timing |
| [Tempest](https://trello.com/c/2K6SqVTl) — `tempest` | None | Listed for reference; this perk's effects are not currently calculated. | Trigger / timing |
| [Thief Training](https://trello.com/c/Xx0CiDui) — `thief_training` | None | Listed for reference; this perk's effects are not currently calculated. | Trigger / timing; Additional scenario state |
| [Thorns](https://trello.com/c/cscyrY4S) — `thorns` | None | Listed for reference; this perk's effects are not currently calculated. | Status / potency; Trigger / timing; Additional scenario state |
| [Toadzerker Spirit](https://trello.com/c/JUK2ys4d) — `toadzerker_spirit` | None | Listed for reference; this perk's effects are not currently calculated. | Status / potency; Trigger / timing |
| [Torpedo Barrage](https://trello.com/c/H2IlmKc7) — `torpedo_barrage` | None | Listed for reference; this perk's effects are not currently calculated. | Trigger / timing |
| [Toxin Caster](https://trello.com/c/RuchhWoQ) — `toxin_caster` | None | Listed for reference; this perk's effects are not currently calculated. | Status / potency; Additional scenario state |
| [Toxin Transfer](https://trello.com/c/KqD6pP2y) — `toxin_transfer` | None | Listed for reference; this perk's effects are not currently calculated. | Status / potency; Trigger / timing |
| [Trickster](https://trello.com/c/VSmkSK2H) — `trickster` | None | Listed for reference; this perk's effects are not currently calculated. | Status / potency; Trigger / timing |
| [Trophy Hunter](https://trello.com/c/FOAsqfty) — `trophy_hunter` | None | Listed for reference; this perk's effects are not currently calculated. | Formula / behavior review |
| [True Balance](https://trello.com/c/vpNISefp) — `true_balance` | None | Listed for reference; this perk's effects are not currently calculated. | Status / potency; Trigger / timing; Additional scenario state |
| [True Moon](https://trello.com/c/EPjAtlTP) — `true_moon` | None | Listed for reference; this perk's effects are not currently calculated. | Trigger / timing |
| [Trusty Servant](https://trello.com/c/XCnDwmTB) — `trusty_servant` | None | Listed for reference; this perk's effects are not currently calculated. | Additional scenario state |
| [Turtle](https://trello.com/c/B3X1Z4ZC) — `turtle` | None | Listed for reference; this perk's effects are not currently calculated. | Trigger / timing |
| [Undead Might](https://trello.com/c/DiNCzYsD) — `undead_might` | None | Listed for reference; this perk's effects are not currently calculated. | Formula / behavior review |
| [Undying Rot](https://trello.com/c/NdFZIRLt) — `undying_rot` | None | Listed for reference; this perk's effects are not currently calculated. | Status / potency |
| [Unmoving](https://trello.com/c/Z0kLf1bS) — `unmoving` | None | Listed for reference; this perk's effects are not currently calculated. | Status / potency; Trigger / timing; Additional scenario state |
| [Untethered](https://trello.com/c/5ertQIfb) — `untethered` | None | Listed for reference; this perk's effects are not currently calculated. | Additional scenario state |
| [Valor](https://trello.com/c/WbuVXjxJ) — `valor` | None | Listed for reference; this perk's effects are not currently calculated. | Trigger / timing; Additional scenario state |
| [Vampire](https://trello.com/c/O7ET7Qs9) — `vampire` | None | Listed for reference; this perk's effects are not currently calculated. | Additional scenario state |
| [Venom Eater](https://trello.com/c/jwcQQv1k) — `venom_eater` | None | Listed for reference; this perk's effects are not currently calculated. | Status / potency |
| [Venom Spitter](https://trello.com/c/4yuZf0wL) — `venom_spitter` | None | Listed for reference; this perk's effects are not currently calculated. | Status / potency; Trigger / timing; Additional scenario state |
| [Vicious Edge](https://trello.com/c/rmogzK5p) — `vicious_edge` | None | Listed for reference; this perk's effects are not currently calculated. | Status / potency; Trigger / timing |
| [Vile Presence](https://trello.com/c/619cSwkY) — `vile_presence` | None | Listed for reference; this perk's effects are not currently calculated. | Additional scenario state |
| [Virulent Core](https://trello.com/c/UATBZ9I5) — `virulent_core` | None | Listed for reference; this perk's effects are not currently calculated. | Status / potency |
| [Vital Mist](https://trello.com/c/bgEf9hA0) — `vital_mist` | None | Listed for reference; this perk's effects are not currently calculated. | Status / potency; Trigger / timing; Additional scenario state |
| [Void Contract](https://trello.com/c/qKhzP8SE) — `void_contract` | None | Listed for reference; this perk's effects are not currently calculated. | Status / potency; Trigger / timing; Additional scenario state |
| [Void Rage](https://trello.com/c/pKAeIvmZ) — `void_rage` | None | Listed for reference; this perk's effects are not currently calculated. | Status / potency; Trigger / timing; Additional scenario state |
| [Void Root Spirit](https://trello.com/c/UzlKlKyS) — `void_root_spirit` | None | Listed for reference; this perk's effects are not currently calculated. | Status / potency; Trigger / timing |
| [Volatile Shell](https://trello.com/c/ebkshx2s) — `volatile_shell` | None | Listed for reference; this perk's effects are not currently calculated. | Status / potency; Trigger / timing; Additional scenario state |
| [Wall](https://trello.com/c/hIribjZ3) — `wall` | None | Listed for reference; this perk's effects are not currently calculated. | Status / potency; Trigger / timing; Additional scenario state |
| [Warden Of Many](https://trello.com/c/CgzFjR9b) — `warden_of_many` | None | Listed for reference; this perk's effects are not currently calculated. | Status / potency; Additional scenario state |
| [Warding Tides](https://trello.com/c/k5KWGJHo) — `warding_tides` | None | Listed for reference; this perk's effects are not currently calculated. | Status / potency |
| [Wave Rider](https://trello.com/c/6YH8N4NP) — `wave_rider` | None | Listed for reference; this perk's effects are not currently calculated. | Trigger / timing; Additional scenario state |
| [Weakening](https://trello.com/c/eh8FjtrX) — `weakening` | None | Listed for reference; this perk's effects are not currently calculated. | Status / potency; Trigger / timing; Additional scenario state |
| [Weighty Slam](https://trello.com/c/iT7KR1Gh) — `weighty_slam` | None | Listed for reference; this perk's effects are not currently calculated. | Formula / behavior review |
| [Whirl Foot](https://trello.com/c/bvtL5MFR) — `whirl_foot` | None | Listed for reference; this perk's effects are not currently calculated. | Status / potency; Trigger / timing; Additional scenario state |
| [Wild Bolt](https://trello.com/c/JWUmlhsi) — `wild_bolt` | None | Listed for reference; this perk's effects are not currently calculated. | Status / potency |
| [Wildfire](https://trello.com/c/3rup1PEy) — `wildfire` | None | Listed for reference; this perk's effects are not currently calculated. | Formula / behavior review |
| [Wind Drill](https://trello.com/c/uRZXu2rt) — `wind_drill` | None | Listed for reference; this perk's effects are not currently calculated. | Trigger / timing |
| [Wind Walker](https://trello.com/c/2VtmfMab) — `wind_walker` | None | Listed for reference; this perk's effects are not currently calculated. | Status / potency; Trigger / timing; Additional scenario state |
| [Winter Woof Spirit](https://trello.com/c/JrCM1W6l) — `winter_woof_spirit` | None | Listed for reference; this perk's effects are not currently calculated. | Status / potency; Trigger / timing |
| [Woof Spirit](https://trello.com/c/0AykNlOE) — `woof_spirit` | None | Listed for reference; this perk's effects are not currently calculated. | Status / potency; Trigger / timing |

## Additional application definitions

These definitions have no dedicated card in the copied board’s Perks list. They include races, legacy definitions, and equipment-only references. Baseline race stats are called out separately.

| Perk / ID | Support | Registered calculations | Scope / limitations |
| --- | --- | --- | --- |
| Arborian — arborian | Unsupported | None | Listed for reference; this perk's effects are not currently calculated. |
| Bloodlust — bloodlust | Unsupported | None | Listed for reference; this perk's effects are not currently calculated. |
| Bunikin — bunikin | Unsupported | None | Listed for reference; this perk's effects are not currently calculated. |
| Dark Elf — dark_elf | Unsupported | None | Listed for reference; this perk's effects are not currently calculated. |
| Dragon — dragon | Unsupported | None | Listed for reference; this perk's effects are not currently calculated. Baseline stats also exist in Races.ts. |
| Elf — elf | Unsupported | None | Listed for reference; this perk's effects are not currently calculated. |
| Ferocious — ferocious | Partial | onDmgBonusMultiplier | Some effects are calculated. Trigger timing and the complete interaction rules are not implemented. |
| Half-Ork — half_ork | Unsupported | None | Listed for reference; this perk's effects are not currently calculated. |
| High Elf — high_elf | Unsupported | None | Listed for reference; this perk's effects are not currently calculated. |
| Human — human | Implemented | onDmgBonusMultiplier, onFinalDamageTakenMultiplier | Calculated for the selected HP and status conditions. |
| Kitsune — kitsune | Unsupported | None | Listed for reference; this perk's effects are not currently calculated. |
| Life Steal — life_steal | Unsupported | None | Listed for reference; this perk's effects are not currently calculated. |
| Ork — ork | Unsupported | None | Listed for reference; this perk's effects are not currently calculated. |
| Scalar — scalar | Unsupported | None | Listed for reference; this perk's effects are not currently calculated. |
