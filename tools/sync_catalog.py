"""Validate normalized Trello data and build the application's existing data tables."""
from __future__ import annotations
import argparse
from collections import Counter, defaultdict
import hashlib
import json
import math
from pathlib import Path
import re
import sys
import unicodedata

ROOT=Path(__file__).resolve().parent.parent
CATEGORIES={"Handles":"handle","Blades":"blade","Fist Gloves":"glove","Fist Essence":"essence","Rings":"ring","Runes":"rune"}
PERK_ALIASES={"immovable":"immoveable","berserking_strength":"berserkingstrength","frequent_flyer":"frequent_flier","glyth_conduit":"glyph_conduit","queens_guard":"queen_s_guard","queens_power":"queen_s_power"}
STAT_NAMES={f"{x}Boost" for x in ["Physical","Magic","Fire","Water","Air","Earth","Holy","Hex","Dexterity","Summon"]} | {f"{x}Defense" for x in ["Physical","Magic","Fire","Water","Air","Earth","Holy","Hex"]} | {"AttackSpeed","SpeedBoost","JumpBoost","CritRate","CritDamage","HeatResistance","ColdResistance","Protection","Warding","Tenacity","ArmorPenetration"}
SCALES={"Physical","Magic","Fire","Water","Air","Earth","Holy","Hex","Dexterity","Summon","True"}
POTENCIES={x+"potency" for x in ["bounce","bleed","burn","poison","rage","reinforce","guaranteedcrit","regen","shatter","lightningcloak","taunt","weakening"]}

def slug(value):return re.sub(r"[^a-z0-9]+","_",value.casefold()).strip("_")
def identity(value):return re.sub(r"[^a-z0-9]","",unicodedata.normalize('NFKD',value).casefold())
def perk_id(value):return PERK_ALIASES.get(slug(value),slug(value))
def fingerprint(value):return hashlib.sha256(json.dumps(value,sort_keys=True,ensure_ascii=False).encode()).hexdigest()
def numeric(value):return isinstance(value,(float,int)) and not isinstance(value,bool) and math.isfinite(value)
def runtime_source(source):return {key:source[key] for key in ['cardId','cardUrl']}

def fields_for_piece(record,piece):
    start=piece['sectionIndex'];sections=[]
    for index in range(start,len(record['sections'])):
        section=record['sections'][index]
        if index>start and section['level']<=2:break
        sections.append(section)
    return [field for section in sections for field in section.get('fields',[])], '\n'.join(section['content'] for section in sections)

def build_catalog_update(dataset,baseline,issues):
    if dataset.get('schemaVersion')!=2 or not isinstance(dataset.get('records'),list):raise ValueError('Expected normalized catalog schema version 2.')
    if not dataset.get('boardId'):raise ValueError('Catalog has no board identity.')
    records=dataset['records'];seen=set()
    for record in records:
        if record['id'] in seen:raise ValueError('Duplicate source record identity.')
        seen.add(record['id'])
        if record['source']['boardId']!=dataset['boardId']:raise ValueError('Source record belongs to another board.')
    by_name=defaultdict(list)
    for item in baseline['items']:by_name[(item['storeCategory'],identity(item['name']))].append(item)
    baseline_perks={identity(perk['name']):perk['id'] for perk in baseline['perks']}
    perk_sources={perk['source']['cardId']:perk['id'] for perk in baseline['perks'] if perk.get('source')}
    blocked={issue['recordId'] for issue in issues if issue['code'] in {'duplicate_armor_slot','unresolved_armor_pieces','unknown_field','correction_not_applied'} and 'recordId' in issue}
    equipment=defaultdict(dict);perks={};bindings=[];held=[];changes=[];referenced={};candidates=[]
    for record in records:
        if record['category']=='Perks':
            pid=PERK_ALIASES.get(record['slug']) or perk_sources.get(record['source']['cardId']) or baseline_perks.get(identity(record['name'])) or record['slug']
            summary=next((s['heading'] for s in record['sections'] if s['heading'] and s['heading'].casefold() not in {'stats','notes','preview','explanation'}),record['name'])
            perks[pid]={'id':pid,'name':record['name'],'description':summary,'source':{**runtime_source(record['source'])}}
        if record['category']=='Armor Sets':
            if record.get('recordKind')!='equipment':continue
            for piece in record.get('armorPieces',[]):
                fields,description=fields_for_piece(record,piece)
                candidates.append((record,piece['slot'],piece['name'],fields,description,piece['id']))
        elif record['category'] in CATEGORIES:
            fields=[f for section in record['sections'] if section['heading'].casefold() not in {'obtainment','obtained','notes','requirements','sources','preview'} for f in section.get('fields',[])]
            candidates.append((record,CATEGORIES[record['category']],record['name'],fields,record['rawDescription'],record['id']))
    for record,category,name,fields,description,source_key in candidates:
        if category not in {'helmet','chestplate','legging',*CATEGORIES.values()}:raise ValueError('Unknown equipment category.')
        if any(field['kind']=='unknown' for field in fields):
            held.append({'name':name,'category':category,'recordId':record['id'],'reason':'Unknown equipment field requires review.'});continue
        if record['id'] in blocked:
            held.append({'name':name,'category':category,'recordId':record['id'],'reason':'Unresolved source structure or field; legacy definition retained.'});continue
        maps={kind:{} for kind in ['stat','perk','potency','sourcePotency','scaling','output']};warnings=[]
        for field in fields:
            kind=field['kind'];value=field.get('value');key=field['id']
            if kind not in maps:continue
            if not numeric(value):
                warnings.append(f'{field["name"]} is not an unambiguous numeric value.');continue
            if kind=='stat' and key not in STAT_NAMES:raise ValueError(f'Unknown stat ID: {key}')
            if kind in {'scaling','output'} and key not in SCALES:raise ValueError(f'Unknown scaling/output ID: {key}')
            if kind in {'potency','sourcePotency'} and key not in POTENCIES:raise ValueError(f'Unknown potency ID: {key}')
            if kind=='perk':key=perk_id(key);referenced.setdefault(key,(field['name'],record['source']))
            if key in maps[kind] and maps[kind][key]!=value:warnings.append(f'Conflicting values for {field["name"]}.')
            maps[kind][key]=value
        if warnings:
            held.append({'name':name,'category':category,'recordId':record['id'],'reason':' '.join(warnings)});continue
        # A tree overview or a card containing only obtainment text is not equipment.
        if not any(maps.values()) and not any(f['kind']=='weaponSpeed' for f in fields):continue
        legacy_matches=by_name[(category,identity(name))]
        definition={'name':name,'stats':maps['stat'],'perks':maps['perk'],'potencies':maps['potency'],
                    'source':{**runtime_source(record['source']),'sectionId':source_key}}
        if maps['sourcePotency']:definition['sourcepotencies']=maps['sourcePotency']
        if maps['scaling']:definition['damageScalings']=maps['scaling']
        if maps['output']:definition['damageTypes']=maps['output']
        for field in fields:
            if field['kind']=='weaponSpeed' and numeric(field.get('value')):definition['attackSpeed']=field['value']
        if not legacy_matches:
            new_id=slug(name)
            if new_id in {x['id'] for x in baseline['items']}:
                held.append({'name':name,'category':category,'recordId':record['id'],'reason':'New item ID conflicts with an existing saved-build ID.'});continue
            definition['category']='Armor' if category in {'helmet','chestplate','legging'} else category.capitalize()
            if category in {'helmet','chestplate','legging'}:definition['type']={'helmet':'Helmet','chestplate':'Chestplate','legging':'Legging'}[category]
            else:
                overview=[f for s in record['sections'] if s['heading'].casefold()=='overview' for f in s.get('fields',[])]
                type_field=next((f for f in overview if f['id']=='type'),None)
                if type_field:definition['type']=type_field['rawValue'].strip('*_`')
            legacy_matches=[{'id':new_id,'storeCategory':category}]
        for legacy in legacy_matches:
            item_id=legacy['id']
            if item_id in equipment[category] and equipment[category][item_id]['source']['sectionId']!=source_key:
                raise ValueError(f'Multiple source records map to item {item_id}; review the mapping.')
            equipment[category][item_id]={'id':item_id,**definition}
            previous=legacy
            changed={key:{'before':previous.get(key),'after':value} for key,value in definition.items() if key!='source' and (previous.get(key) or {} if isinstance(value,dict) else previous.get(key))!=value}
            if changed:changes.append({'category':category,'id':item_id,'name':name,'changes':changed})
            bindings.append({'category':category,'id':item_id,'sourceKey':source_key,'name':name})
    for pid,(name,source) in referenced.items():
        if pid not in perks and not any(p['id']==pid for p in baseline['perks']):
            perks[pid]={'id':pid,'name':name,'description':'Referenced by equipment; no dedicated perk rules were found in this board export.','source':{**runtime_source(source)}}
    return dict(equipment),perks,{'boardId':dataset['boardId'],'boardName':dataset['boardName'],'sourceHash':fingerprint(dataset),'counts':{category:len(values) for category,values in equipment.items()},'perkDefinitions':len(perks),'newItems':sum(c['id'] not in {i['id'] for i in baseline['items']} for c in changes),'updatedItems':sum(c['id'] in {i['id'] for i in baseline['items']} for c in changes),'held':held,'changes':changes,'bindings':bindings}

def pending_items(dataset,baseline,held):
    records={record['id']:record for record in dataset['records']};pending=defaultdict(dict)
    for item in held:
        for legacy in baseline['items']:
            if legacy['storeCategory']==item['category'] and identity(legacy['name'])==identity(item['name']):
                source=records[item['recordId']]
                message='Armor slot needs review; the original item definition is retained.' if item['category'] in {'helmet','chestplate','legging'} else 'Potency depends on the selected situation; use the manual status potency control. Original item data is retained.'
                pending[item['category']][legacy['id']]={'source':{**runtime_source(source['source'])},'messages':[message]}
    return dict(pending)

def validate_bindings(old,review):
    if old['boardId']!=review['boardId']:raise ValueError('The application mapping belongs to another board. Review and migrate the mapping explicitly.')
    prior=defaultdict(set)
    for binding in old['bindings']:prior[(binding['category'],binding['sourceKey'])].add(binding['id'])
    for binding in review['bindings']:
        key=(binding['category'],binding['sourceKey'])
        if key in prior and binding['id'] not in prior[key]:raise ValueError('A source binding would change a saved-build ID.')

def main(argv=None):
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--catalog',type=Path,required=True)
    parser.add_argument('--report',type=Path,help='Import report; defaults beside catalog.json.')
    parser.add_argument('--write',action='store_true',help='Prepare validated changes for the existing data tables; without this only the review report is written.')
    args=parser.parse_args(argv)
    try:
        if hasattr(sys.stdin,'reconfigure'):sys.stdin.reconfigure(encoding='utf-8')
        baseline=json.load(sys.stdin)
        dataset=json.loads(args.catalog.read_text(encoding='utf-8-sig'))
        report_path=args.report or args.catalog.with_name('import-report.json')
        report=json.loads(report_path.read_text(encoding='utf-8-sig'))
        if report.get('boardId') and report['boardId']!=dataset['boardId']:raise ValueError('Import report belongs to another board.')
        equipment,perks,review=build_catalog_update(dataset,baseline,report['issues'])
        manifest=ROOT/'tools/catalog-map.json'
        if manifest.exists():
            old=json.loads(manifest.read_text(encoding='utf8'))
            validate_bindings(old,review)
        review_path=ROOT/'tools/catalog-review.json'
        review_path.write_text(json.dumps(review,indent=2,ensure_ascii=False)+'\n',encoding='utf8')
        payload={'summary':{'applied':False,'items':sum(review['counts'].values()),'perks':len(perks),'changedItems':len(review['changes']),'heldItems':len(review['held']),'review':str(review_path)},
                 'equipment':equipment,'perks':perks,'pending':pending_items(dataset,baseline,review['held']),
                 'mapping':{k:review[k] for k in ['boardId','boardName','bindings']}}
        print(json.dumps(payload,ensure_ascii=False))
        return 0
    except (ValueError,OSError,KeyError,TypeError) as error:
        print(f'Catalog sync failed: {error}',file=sys.stderr);return 1

if __name__=='__main__':raise SystemExit(main())
