// Patch literal data fields in the existing tables; preserve functions and surrounding code.
const fs = require('node:fs');
const path = require('node:path');
const ts = require(process.env.VOXL_TYPESCRIPT_PATH || 'typescript');
const TABLES = {
  enchantment: ['Enchantments', 'Enchantments'],
  helmet: ['Helmets', 'Helmets'], chestplate: ['Chestplates', 'Chestplate'],
  legging: ['Leggings', 'Leggings'], blade: ['Blades', 'Blades'],
  handle: ['Handles', 'Handles'], glove: ['Gloves', 'Gloves'],
  essence: ['Essences', 'Essences'], ring: ['Rings', 'Rings'], rune: ['Runes', 'Runes'],
};
function literal(node) {
  if (ts.isStringLiteral(node) || ts.isNumericLiteral(node)) return ts.isNumericLiteral(node) ? Number(node.text) : node.text;
  if (node.kind === ts.SyntaxKind.TrueKeyword) return true;
  if (node.kind === ts.SyntaxKind.FalseKeyword) return false;
  if (node.kind === ts.SyntaxKind.NullKeyword) return null;
  if (ts.isPrefixUnaryExpression(node) && node.operator === ts.SyntaxKind.MinusToken) return -literal(node.operand);
  if (ts.isArrayLiteralExpression(node)) return node.elements.map(literal);
  if (ts.isObjectLiteralExpression(node)) {
    const value = {};
    for (const prop of node.properties) {
      if (!ts.isPropertyAssignment(prop)) return undefined;
      value[prop.name.text] = literal(prop.initializer);
    }
    return value;
  }
}
function canonical(value) {
  return JSON.stringify(value && typeof value === 'object' && !Array.isArray(value)
    ? Object.fromEntries(Object.keys(value).sort().map(key => [key, JSON.parse(canonical(value[key]) ?? 'null')])) : value);
}
function patchTable(text, tableName, definitions, removedIds = []) {
  const file = ts.createSourceFile('data.ts', text, ts.ScriptTarget.Latest, true);
  let table;
  for (const statement of file.statements) if (ts.isVariableStatement(statement)) {
    table = statement.declarationList.declarations.find(d => d.name.getText(file) === tableName)?.initializer || table;
  }
  if (!table || !ts.isObjectLiteralExpression(table)) throw new Error(`Expected literal table ${tableName}`);
  const edits = [];
  const serialize = (value, indent) => JSON.stringify(value, null, 2).replace(/\n/g, '\n' + indent);
  function patchObject(object, values, indent) {
    const additions = [];
    for (const [key, value] of Object.entries(values)) {
      const property = object.properties.find(p => p.name?.text === key);
      if (property) {
        if (!ts.isPropertyAssignment(property)) throw new Error(`Refusing to replace non-data field ${key}`);
        if (canonical(literal(property.initializer)) !== canonical(value)) edits.push({
          start: property.initializer.getStart(file), end: property.initializer.end, text: serialize(value, indent),
        });
      } else additions.push(`${indent}${JSON.stringify(key)}: ${serialize(value, indent)}`);
    }
    if (additions.length) {
      const last = object.properties.at(-1);
      const lineStart = text.lastIndexOf('\n', object.end - 1) + 1;
      const ownLine = /^\s*$/.test(text.slice(lineStart, object.end - 1));
      const needsComma = last && !text.slice(last.end, object.end - 1).includes(',');
      const start = ownLine ? lineStart : object.end - 1;
      const prefix = needsComma && last.end === start ? ',' : '';
      if (needsComma && !prefix) edits.push({start:last.end, end:last.end, text:','});
      edits.push({start: ownLine ? lineStart : object.end - 1, end: object.end - 1,
        text: `${prefix}${ownLine ? '' : '\n'}${additions.join(',\n')},\n${indent.slice(0, -2)}`});
    }
  }
  const additions = {};
  for (const [id, definition] of Object.entries(definitions)) {
    const prop = table.properties.find(p => p.name?.text === id);
    if (!prop) additions[id] = definition;
    else {
      if (!ts.isPropertyAssignment(prop) || !ts.isObjectLiteralExpression(prop.initializer)) throw new Error(`Expected literal item ${id}`);
      patchObject(prop.initializer, definition, '    ');
    }
  }
  for (const id of removedIds) {
    const prop = table.properties.find(p => p.name?.text === id);
    if (prop) edits.push({start: prop.getFullStart(), end: prop.end + (text[prop.end] === ',' ? 1 : 0), text: ''});
  }
  patchObject(table, additions, '  ');
  for (const edit of edits.sort((a,b) => b.start - a.start)) text = text.slice(0,edit.start) + edit.text + text.slice(edit.end);
  const parsed = ts.createSourceFile('data.ts', text, ts.ScriptTarget.Latest, true);
  if (parsed.parseDiagnostics.length) throw new Error(`Invalid generated syntax in ${tableName}`);
  return text;
}
function prepareUpdates(root, payload, aliases) {
  const updates = [];
  for (const [category, [filename, tableName]] of Object.entries(TABLES)) {
    const definitions = {...payload.equipment[category]};
    for (const [id, pending] of Object.entries(payload.pending?.[category] || {})) {
      definitions[id] = {...definitions[id], source: pending.source, dataWarnings: pending.messages};
    }
    const target = path.join(root, 'src/data', filename + '.ts');
    const before = fs.readFileSync(target, 'utf8');
    const after = patchTable(before, tableName, definitions, Object.keys(aliases[category] || {}));
    if (after !== before) updates.push({target, before, after});
  }
  const target = path.join(root, 'src/data/Perks.ts');
  const before = fs.readFileSync(target, 'utf8');
  const after = patchTable(before, 'Perks', payload.perks);
  if (after !== before) updates.push({target, before, after});
  return updates;
}
module.exports = {TABLES, patchTable, prepareUpdates};
