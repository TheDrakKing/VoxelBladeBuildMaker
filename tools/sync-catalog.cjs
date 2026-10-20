const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
require('../tests/register.cjs');
const { TABLES, prepareUpdates } = require('./apply-catalog.cjs');
const root = path.resolve(__dirname, '..');
const items = [];
for (const [storeCategory, [file, tableName]] of Object.entries(TABLES)) {
  const table = require('../src/data/' + file + '.ts')[tableName];
  for (const [key, item] of Object.entries(table)) items.push({key, ...item, storeCategory});
}
const { Perks } = require('../src/data/Perks.ts');
const result = spawnSync(process.env.PYTHON || 'python', [path.join(__dirname, 'sync_catalog.py'), ...process.argv.slice(2)], {
  input: JSON.stringify({items, perks: Object.values(Perks)}), encoding: 'utf8',
  env: {...process.env, PYTHONUTF8: '1'}, maxBuffer: 16 * 1024 * 1024,
});
if (result.error || result.status !== 0) {
  console.error(result.error?.message || result.stderr || 'Catalog validation failed.');
  process.exitCode = result.status || 1;
} else {
  try {
    const payload = JSON.parse(result.stdout);
    const aliases = JSON.parse(fs.readFileSync(path.join(__dirname, 'catalog-aliases.json'), 'utf8'));
    const updates = prepareUpdates(root, payload, aliases);
    const write = process.argv.includes('--write');
    if (write) {
      // Validate every table before writing. Literal updates preserve callbacks and images.
      for (const update of updates) if (fs.readFileSync(update.target, 'utf8') !== update.before) throw new Error('A data file changed during review; run sync again.');
      for (const update of updates) fs.writeFileSync(update.target, update.after);
      const mapping = path.join(__dirname, 'catalog-map.json');
      const content = JSON.stringify(payload.mapping, null, 2) + '\n';
      if (!fs.existsSync(mapping) || fs.readFileSync(mapping, 'utf8') !== content) fs.writeFileSync(mapping, content);
    }
    console.log(JSON.stringify({...payload.summary, applied: write, changedFiles: updates.map(update => path.relative(root, update.target))}));
  } catch (error) {
    console.error('Catalog sync failed:', error.message);
    process.exitCode = 1;
  }
}
