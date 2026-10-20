const test=require('node:test'),assert=require('node:assert/strict');
const {buildAudit,renderAudit}=require('../tools/audit-perks.cjs');
const source=(id,name)=>({id,name,category:'Perks',source:{cardUrl:'https://trello.com/c/'+id},rawDescription:'On hit, gain Rage potency.'});
const support=perk=>perk.onDmgBonusMultiplier?{status:'Partial',details:'Damage works; application needs state.'}:{status:'Unsupported',details:'Description only.'};
test('perk audit counts source cards separately from legacy and equipment references',()=>{
 const audit=buildAudit({schemaVersion:2,boardName:'Copy',records:[source('one','One'),source('two','Two')]},
  {one:{id:'one',name:'One',source:{cardId:'one'},onDmgBonusMultiplier(){}},extra:{id:'extra',name:'Reference'}},support);
 assert.deepEqual(audit.counts,{Implemented:0,Partial:1,Unsupported:1});assert.equal(audit.extras.length,1);
 assert.deepEqual(audit.unmapped,['Two']);assert.deepEqual(audit.rows[0].calculations,['onDmgBonusMultiplier']);
});
test('perk audit never promotes descriptions to behavior and escapes Markdown cells',()=>{
 const audit=buildAudit({schemaVersion:2,boardName:'Copy',records:[source('one','One | two')]},{one:{id:'one',name:'One',source:{cardId:'one'}}},support);
 assert.equal(audit.counts.Unsupported,1);const document=renderAudit(audit);
 assert.ok(document.includes('One \\| two'));assert.ok(document.includes('Status / potency; Trigger / timing'));
 assert.equal(renderAudit(audit),document);
});
test('perk audit rejects unrelated input formats',()=>{
 assert.throws(()=>buildAudit({records:[]},{},support),/schema version 2/);
});
