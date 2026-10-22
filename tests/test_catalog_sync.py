import copy
import importlib.util
import math
from pathlib import Path
import unittest

spec=importlib.util.spec_from_file_location('catalog_sync',Path(__file__).resolve().parents[1]/'tools/sync_catalog.py')
sync=importlib.util.module_from_spec(spec);spec.loader.exec_module(sync)

def example():
    source={'boardId':'copy','boardName':'Copy','cardId':'armor1','cardUrl':'https://trello.com/c/armor1','listId':'armor','listName':'Armor Sets','retrievedAt':'now'}
    fields=[{'kind':'stat','id':'AirBoost','name':'Air Boost','value':14,'rawValue':'+14%'},{'kind':'perk','id':'flowing_crits','name':'Flowing Crits','value':1,'rawValue':'+1'}]
    item={'id':'armor1','name':'Fancy','category':'Armor Sets','recordKind':'equipment','source':source,'rawDescription':'source rules','sections':[{'heading':'Fancy Cap','level':2,'content':'cap rules','fields':fields}],'armorPieces':[{'name':'Fancy Cap','slot':'helmet','sectionIndex':0,'id':'armor1:section:0'}]}
    perk={'id':'perk1','name':'Flowing Crits','slug':'flowing_crits','category':'Perks','source':{**source,'cardId':'perk1'},'rawDescription':'0.0875% chance','sections':[{'heading':'Air contributes to crit','level':1,'content':'','fields':[]}]}
    baseline={'items':[{'id':'ExistingCaseID','name':'Fancy Cap','storeCategory':'helmet','stats':{'AirBoost':7}}],'perks':[{'id':'flowing_crits','name':'Flowing Crits'}]}
    return {'schemaVersion':2,'boardId':'copy','boardName':'Copy','records':[item,perk]},baseline

class CatalogSyncTests(unittest.TestCase):
    def test_perk_card_identity_wins_over_similar_names(self):
        data,baseline=example()
        baseline['perks']=[{'id':'flowing_crits','name':'Flowing Crits','source':{'cardId':'perk1'}},
                           {'id':'different_reference','name':'FlowingCrits','source':{'cardId':'equipment-card'}}]
        _,perks,_=sync.build_catalog_update(data,baseline,[])
        self.assertIn('flowing_crits',perks)
        self.assertNotIn('different_reference',perks)

    def test_existing_saved_id_is_retained_with_numeric_update(self):
        data,baseline=example();items,perks,review=sync.build_catalog_update(data,baseline,[])
        self.assertEqual(items['helmet']['ExistingCaseID']['stats']['AirBoost'],14)
        self.assertEqual(review['bindings'][0]['id'],'ExistingCaseID')
        self.assertEqual(perks['flowing_crits']['source'],{'cardId':'perk1','cardUrl':'https://trello.com/c/armor1'})

    def test_review_compares_against_existing_data_tables(self):
        data,baseline=example();first=sync.build_catalog_update(data,baseline,[])
        baseline['items']=[{**item,'storeCategory':category} for category,table in first[0].items() for item in table.values()]
        _,_,review=sync.build_catalog_update(data,baseline,[])
        self.assertEqual(review['changes'],[])

    def test_ambiguous_source_is_held_without_overwriting_legacy(self):
        data,baseline=example();items,_,review=sync.build_catalog_update(data,baseline,[{'recordId':'armor1','code':'duplicate_armor_slot'}])
        self.assertFalse(items);self.assertEqual(len(review['held']),1)
        self.assertEqual(baseline['items'][0]['stats']['AirBoost'],7)

    def test_nonfinite_mechanics_are_held(self):
        data,baseline=example();data['records'][0]['sections'][0]['fields'][0]['value']=math.nan
        items,_,review=sync.build_catalog_update(data,baseline,[])
        self.assertFalse(items);self.assertIn('numeric',review['held'][0]['reason'])

    def test_unclassified_equipment_field_is_held_even_with_an_empty_report(self):
        data,baseline=example();data['records'][0]['sections'][0]['fields'][0]['kind']='unknown'
        items,_,review=sync.build_catalog_update(data,baseline,[])
        self.assertFalse(items);self.assertIn('Unknown equipment field',review['held'][0]['reason'])

    def test_unknown_stat_ids_are_rejected(self):
        data,baseline=example();data['records'][0]['sections'][0]['fields'][0]['id']='InventedBoost'
        with self.assertRaises(ValueError):sync.build_catalog_update(data,baseline,[])

    def test_duplicate_and_mixed_board_sources_are_rejected(self):
        data,baseline=example();data['records'].append(copy.deepcopy(data['records'][0]))
        with self.assertRaises(ValueError):sync.build_catalog_update(data,baseline,[])
        data,baseline=example();data['records'][0]['source']['boardId']='someone-else'
        with self.assertRaises(ValueError):sync.build_catalog_update(data,baseline,[])

    def test_retrieval_time_does_not_change_generated_application_data(self):
        data,baseline=example();first=sync.build_catalog_update(data,baseline,[])
        data['records'][0]['source']['retrievedAt']='later'
        second=sync.build_catalog_update(data,baseline,[])
        self.assertEqual(first[:2],second[:2])

    def test_output_coefficients_above_one_are_preserved(self):
        data,baseline=example();data['records'][0]['sections'][0]['fields'] += [{'kind':'output','id':'Physical','name':'Physical','value':1,'rawValue':'1'},{'kind':'output','id':'True','name':'True','value':.5,'rawValue':'.5'}]
        items,_,_=sync.build_catalog_update(data,baseline,[])
        self.assertEqual(items['helmet']['ExistingCaseID']['damageTypes'],{'Physical':1,'True':.5})

    def test_multiple_legacy_aliases_can_retain_one_source_binding(self):
        old={'boardId':'copy','bindings':[{'category':'helmet','sourceKey':'card:piece','id':name} for name in ['old_alias','canonical']]}
        sync.validate_bindings(old,copy.deepcopy(old))
        changed=copy.deepcopy(old);changed['bindings'][0]['id']='unreviewed_new_id'
        with self.assertRaises(ValueError):sync.validate_bindings(old,changed)

class EnchantmentSyncTests(unittest.TestCase):
    def record(self,fields):
        data,_=example();source=data['records'][0]['source']
        return {'id':'enchant','slug':'acidic','name':'Acidic','category':'Enchants','source':{**source,'cardId':'enchant'},'rawDescription':'Obtained from upgrading Corroded','sections':[{'heading':'Stat Boosts','level':1,'content':'','fields':fields}]}

    def test_rework_replaces_obsolete_potency_and_preserves_existing_save_id(self):
        data,baseline=example();data['records']=[self.record([{'kind':'stat','id':'HexBoost','name':'Hex Boost','rawValue':'+3%','value':3,'rawLine':'Hex +3%'},{'kind':'perk','id':'melting_shred','name':'Melting Shred','rawValue':'+1','value':1,'rawLine':'Melting Shred +1'}])]
        baseline['items']=[{'id':'acidic','name':'Acidic','storeCategory':'enchantment','potencies':{'poisonpotency':3}}]
        items,_,review=sync.build_catalog_update(data,baseline,[]);enchant=items['enchantment']['acidic']
        self.assertEqual(enchant['potencies'],{});self.assertEqual(enchant['stats'],{'HexBoost':3});self.assertEqual(enchant['perks'],{'melting_shred':1});self.assertTrue(enchant['ascended']);self.assertEqual(review['newItems'],0)

    def test_multipliers_are_kept_separate_from_additive_fields(self):
        record=self.record([{'kind':'stat','id':'SummonBoost','name':'Summon Boost','rawValue':'1.1x','value':None,'rawLine':'Summon x1.1'},{'kind':'stat','id':'SummonBoost','name':'Summon Boost','rawValue':'+5%','value':5,'rawLine':'Summon +5%'}])
        result=sync.enchantment_data(record,sync.STAT_NAMES,sync.perk_id)
        self.assertEqual(result['stats'],{'SummonBoost':5});self.assertEqual(result['enchantmentTransforms'],[{'scope':'stat','stat':'SummonBoost','factor':1.1}])

    def test_unknown_transform_never_gets_silently_imported(self):
        record=self.record([{'kind':'transform','id':'mystery','name':'Mystery','rawValue':'x2','value':None,'rawLine':'Mystery x2'}])
        with self.assertRaisesRegex(ValueError,'Unknown enchant transform'):sync.enchantment_data(record,sync.STAT_NAMES,sync.perk_id)

    def test_overview_cards_do_not_become_enchantments(self):
        data,baseline=example();record=self.record([]);record['name']='Ascended Enchants';data['records']=[record]
        items,_,_=sync.build_catalog_update(data,baseline,[]);self.assertNotIn('enchantment',items)

if __name__=='__main__':unittest.main()
