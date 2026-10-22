const fs=require('node:fs');
const path=require('node:path');
function signals(definition) {
  const result=Object.entries(definition).filter(([,value])=>typeof value==='function').map(([name])=>name);
  for(const key of ['critical','stats','potencies','sourcepotencies','cooldown','statusEffects','poise']) if(definition[key]&&Object.keys(definition[key]).length) result.push(key);
  if(definition.baseDamage)result.push('baseDamage');
  return result;
}
function triage(text) {
  const flags=[];
  if(/potency|reinforce|rage|burn|bleed|poison|debuff|buff/i.test(text))flags.push('Status / potency');
  if(/chance|on hit|upon|after|whenever|cooldown|duration|seconds|stacks|spiritual energy/i.test(text))flags.push('Trigger / timing');
  if(/blocking|mounted|shadow|sunlight|airborne|jump|summon|ally|allies|nearby/i.test(text))flags.push('Additional scenario state');
  return flags.length?flags.join('; '):'Formula / behavior review';
}
function buildAudit(dataset,definitions,supportFor,races={}) {
  if(dataset.schemaVersion!==2||!Array.isArray(dataset.records))throw new Error('Expected catalog schema version 2.');
  const cards=dataset.records.filter(record=>record.category==='Perks');
  const cardIds=new Set(cards.map(card=>card.id));
  const entries=Object.values(definitions);
  const rows=cards.map(card=>{
    const matches=entries.filter(perk=>perk.source?.cardId===card.id);
    const supports=matches.map(supportFor);
    const statuses=new Set(supports.map(s=>s.status));
    const status=statuses.size===1?[...statuses][0]:matches.length?'Partial':'Unsupported';
    return {name:card.name,ids:matches.map(p=>p.id),status,
      calculations:[...new Set(matches.flatMap(signals))],
      details:matches.length?[...new Set(supports.map(s=>s.details))].join(' '):'No application definition maps to this source card.',
      next:status==='Implemented'?'Regression coverage / source review':triage(card.rawDescription||''),
      url:card.source.cardUrl};
  }).sort((a,b)=>a.name.localeCompare(b.name,'en'));
  const extras=entries.filter(perk=>!cardIds.has(perk.source?.cardId)).map(perk=>({
    name:perk.name,ids:[perk.id],...supportFor(perk),calculations:signals(perk),
    details:supportFor(perk).details+(races[perk.id]?.stats&&Object.keys(races[perk.id].stats).length?' Baseline stats also exist in Races.ts.':''),
    url:perk.source?.cardUrl,
  })).sort((a,b)=>a.name.localeCompare(b.name,'en'));
  const counts=rows.reduce((result,row)=>(result[row.status]++,result),{Implemented:0,Partial:0,Unsupported:0});
  return {boardName:dataset.boardName,boardId:dataset.boardId,counts,rows,extras,registeredDefinitions:entries.length,
    unmapped:rows.filter(row=>!row.ids.length).map(row=>row.name)};
}
function renderAudit(audit) {
  const esc=value=>String(value??'').replace(/\|/g,'\\|').replace(/[\r\n]+/g,' ');
  const lines=['# Perk coverage audit','',`Source: **${esc(audit.boardName)}**, ${audit.rows.length} perk cards. Application registry: ${audit.registeredDefinitions} definitions.`,
    '',`Source-card coverage: **${audit.counts.Implemented} Implemented**, **${audit.counts.Partial} Partial**, **${audit.counts.Unsupported} Unsupported**.`,
    '', 'This is a repeatable inventory of registered behavior and support labels. Hook presence is evidence of code, not proof that the full source rule is correct. Status/potency, Bleed/Poison, races, and the reviewed forty-perk batches have explicit scope details and regression tests. Older Partial entries still need formula-by-formula review.',
    '', 'Trigger/timing and scenario tags are triage hints from the source text. They do not enable effects. Source-only potency definitions identify possible status sources; they do not simulate application. Race stats and guild behavior can live outside Perks.ts.',
    '', `Unmapped source cards: ${audit.unmapped.length?audit.unmapped.map(esc).join(', '):'none'}.`];
  for(const status of ['Implemented','Partial','Unsupported']){
    lines.push('',`## ${status}`,'','| Perk / ID | Registered calculations | Scope / limitations | Next review |','| --- | --- | --- | --- |');
    for(const row of audit.rows.filter(row=>row.status===status))lines.push(`| [${esc(row.name)}](${row.url}) — ${row.ids.map(id=>'`'+esc(id)+'`').join(', ')||'unmapped'} | ${row.calculations.map(esc).join(', ')||'None'} | ${esc(row.details)} | ${esc(row.next)} |`);
  }
  lines.push('','## Additional application definitions','','These definitions have no dedicated card in the copied board’s Perks list. They include races, legacy definitions, and equipment-only references. Baseline race stats are called out separately.','','| Perk / ID | Support | Registered calculations | Scope / limitations |','| --- | --- | --- | --- |');
  for(const row of audit.extras)lines.push(`| ${esc(row.name)} — ${row.ids.map(esc).join(', ')} | ${row.status} | ${row.calculations.map(esc).join(', ')||'None'} | ${esc(row.details)} |`);
  return lines.join('\n')+'\n';
}
function main(args) {
  const option=name=>{const i=args.indexOf(name);return i<0?undefined:args[i+1];};
  const catalog=option('--catalog');if(!catalog)throw new Error('Pass --catalog with the normalized catalog.json path.');
  require('../tests/register.cjs');
  const {Perks}=require('../src/data/Perks.ts');
  const {Perk,getPerkSupport}=require('../src/models/Perk.ts');
  const {Races}=require('../src/data/Races.ts');
  const audit=buildAudit(JSON.parse(fs.readFileSync(catalog,'utf8').replace(/^\uFEFF/,'')),Perks,definition=>getPerkSupport(new Perk(definition)),Races);
  const output=path.resolve(option('--output')||path.join(__dirname,'../docs/perk-coverage.md'));
  const content=renderAudit(audit);fs.mkdirSync(path.dirname(output),{recursive:true});
  if(!fs.existsSync(output)||fs.readFileSync(output,'utf8')!==content)fs.writeFileSync(output,content);
  console.log(JSON.stringify({sourceCards:audit.rows.length,registeredDefinitions:audit.registeredDefinitions,...audit.counts,unmapped:audit.unmapped.length,output}));
}
if(require.main===module)try{main(process.argv.slice(2));}catch(error){console.error('Perk audit failed:',error.message);process.exitCode=1;}
module.exports={buildAudit,renderAudit};
