# Updating the existing data files

Equipment lives in `src/data/Helmets.ts`, `Leggings.ts`, `Runes.ts`, and the other existing category files. Perks live in `src/data/Perks.ts`. These are the application's single definitions; there is no runtime import overlay.

Each accepted definition can carry a small `source` reference containing its Trello card ID, URL, and equipment section ID. Raw Markdown, original fields, timestamps, and import history remain in the external `generated_json_v2` archive. Formulas are reference data and are never executed.

1. Run `python main.py` in your Trello scraper folder to refresh your copied board.
2. From this project, prepare a review:

   ```powershell
   npm run catalog:sync -- --catalog "C:\Users\Blitz\BotNet\DiscordBots\generated_json_v2\catalog.json"
   ```

3. Inspect `tools/catalog-review.json`. `changes` compares source values with the current data files, and `held` lists ambiguous records. The command also reports which files would change. This step does not edit application definitions.
4. Apply the reviewed values directly to the existing data files:

   ```powershell
   npm run catalog:sync -- --catalog "C:\Users\Blitz\BotNet\DiscordBots\generated_json_v2\catalog.json" --write
   npm test
   npm run test:catalog
   npm run check
   npm run build
   ```

The writer uses TypeScript's parser to patch literal fields. It preserves custom callbacks, image expressions, comments, existing IDs, and unrelated definitions. It validates every destination before writing, rejects dynamic tables, and leaves identical files unchanged. Review the Git diff before committing; `--write` accepts reviewed source values over local numeric edits.

`catalog-map.json` protects established source/slot-to-item IDs. A board copy has different card IDs and requires a reviewed mapping migration. `catalog-aliases.json` records reviewed obsolete IDs; the corresponding runtime save compatibility rule currently handles the old Bowldur leg-slot mistake in `Item.ts`.

Cindersoul's Essence slot remains flagged and its set retains existing definitions. Croakernaut Rune's distance-dependent Reinforce potency is held; use the manual effective-potency control for the chosen scenario. The builder retains these review warnings directly on the affected items.

Source descriptions do not implement perk mechanics. Critical Master's damage bonus works while its Guardbreak chains remain Partial. Future interactions should be added as explicit reviewed behavior.

Python 3.10+ and the existing TypeScript dependency are used. Set `PYTHON` for another Python executable. The Node/Python boundary uses UTF-8 explicitly.


## Perk coverage inventory

Run `npm run audit:perks -- --catalog "C:\Users\Blitz\BotNet\DiscordBots\generated_json_v2\catalog.json"` to regenerate `docs/perk-coverage.md`. Pass `--output` for a different report path. This inventories code and support labels without changing application data. The report distinguishes source perk cards from extra race, legacy, and equipment-reference definitions. Review the scoped limitations: having a callback does not prove full source accuracy.
