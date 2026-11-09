# Bucket Catalog (Reference)

> Complete list of known buckets on OSRS Wiki. For usage patterns, see `context://bucket-query-guide`.

## Bucket Index

| Query as | Page | Holds |
| --- | --- | --- |
| `bucket("bountytaskline")` | Bucket:Bountytaskline | Bounty Hunter task line entries |
| `bucket("clue_equipment")` | Bucket:Clue equipment | Equipment associated with clue scroll steps |
| `bucket("clue_info")` | Bucket:Clue info | Clue scroll metadata/step info |
| `bucket("collection_log_source")` | Bucket:Collection log source | Collection log sources per item: item_id, item_name, sources, rates, kinds. **Only queryable by item_name** |
| `bucket("combat_achievement")` | Bucket:Combat achievement | Combat achievement tasks, tiers, requirements |
| `bucket("couriertaskline")` | Bucket:Couriertaskline | Courier activity task line entries |
| `bucket("demonicpactleaguetask")` | Bucket:Demonicpactleaguetask | Demonic Pact league task entries |
| `bucket("dependency_list")` | Bucket:Dependency list | Item/object dependency relations |
| `bucket("drop_table_sources")` | Bucket:Drop table sources | Shared drop tables (rare, gem, herb) and roll/rarity data |
| `bucket("dropsline")` | Bucket:Dropsline | Drop table line entries: item_name, drop_json (JSON with "Dropped from", rarity, quantity). **Only queryable by item_name** |
| `bucket("exchange")` | Bucket:Exchange | Grand Exchange prices (name, value, high/low, volumes) |
| `bucket("feedback")` | Bucket:Feedback | Wiki feedback entries (site-internal) |
| `bucket("ge_index_header")` | Bucket:Ge index header | GE index header/snapshot metadata |
| `bucket("infobox_activity")` | Bucket:Infobox activity | Skilling/activity infobox data |
| `bucket("infobox_bonuses")` | Bucket:Infobox bonuses | Equipment combat stats and bonuses |
| `bucket("infobox_construction")` | Bucket:Infobox construction | Construction object/buildable data |
| `bucket("infobox_grid_master_unlock")` | Bucket:Infobox grid master unlock | Grid Master unlock data |
| `bucket("infobox_item")` | Bucket:Infobox item | Core item data: item_name, item_id, examine, high_alchemy_value, value, weight, buy_limit, is_members_only, tradeable, image, league_region, release_date, removal_date, quest, version_anchor |
| `bucket("infobox_location")` | Bucket:Infobox location | Location/area data |
| `bucket("infobox_monster")` | Bucket:Infobox monster | Monster combat stats: name, combat_level, hitpoints, max_hit, slayer_level, slayer_experience, slayer_category, assigned_by, attack/defence bonuses, attack_speed, poisonous, attribute, attack_style, respawn_time, experience_bonus, flat_armour, magic_resistance, size, attack/strength/defence/ranged/magic levels, attack_bonus, strength_bonus, range_strength_bonus, magic_damage_bonus, poison/venom/freeze/burn/cannon/thrall resistance, elemental_weakness, elemental_weakness_percent |
| `bucket("infobox_npc")` | Bucket:Infobox npc | NPC data: id, combat level, examine |
| `bucket("infobox_pure")` | Bucket:Infobox pure | Pure-entity infobox data (verify schema) |
| `bucket("infobox_scenery")` | Bucket:Infobox scenery | Scenery/object entity data |
| `bucket("infobox_ship_part")` | Bucket:Infobox ship part | Ship part data |
| `bucket("infobox_shop")` | Bucket:Infobox shop | Shop data: shop_name, location, owner, specialty, shop_version, is_members_only |
| `bucket("infobox_spell")` | Bucket:Infobox spell | Spell data: requirements, effects, costs |
| `bucket("interface")` | Bucket:Interface | Game interface definitions |
| `bucket("item_id")` | Bucket:Item id | Item name to id mappings |
| `bucket("locline")` | Bucket:Locline | Location line entries |
| `bucket("logs")` | Bucket:Logs | Woodcutting log/tree data |
| `bucket("map")` | Bucket:Map | Map marker/region data |
| `bucket("mine")` | Bucket:Mine | Mining node/rock data |
| `bucket("mmg_output")` | Bucket:Mmg output | Money making guide output calculations |
| `bucket("money_making_guide")` | Bucket:Money making guide | Money making methods: profit, requirements |
| `bucket("music")` | Bucket:Music | Music track unlock data |
| `bucket("music_file")` | Bucket:Music file | Music file metadata |
| `bucket("music_map")` | Bucket:Music map | Music tracks by region/map area |
| `bucket("music_versions")` | Bucket:Music versions | Music version/history entries |
| `bucket("npc_id")` | Bucket:Npc id | NPC name to id mappings |
| `bucket("object_id")` | Bucket:Object id | Object/scenery id mappings |
| `bucket("quest")` | Bucket:Quest | Quest data: requirements, rewards, difficulty |
| `bucket("recipe")` | Bucket:Recipe | Creation/processing recipes: inputs, outputs, skills |
| `bucket("recommended_equipment")` | Bucket:Recommended equipment | Recommended gear setups by activity/slot (schema not available on page - use runtime discovery) |
| `bucket("seachart")` | Bucket:Seachart | Sea chart/naval data |
| `bucket("sound_effect")` | Bucket:Sound effect | Sound effect metadata |
| `bucket("soundtrack")` | Bucket:Soundtrack | Soundtrack track data |
| `bucket("storeline")` | Bucket:Storeline | Store line entries |
| `bucket("testing_bucket")` | Bucket:Testing bucket | Wiki-internal testing data (not real content) |
| `bucket("transcript")` | Bucket:Transcript | NPC/dialogue transcripts |
| `bucket("update")` | Bucket:Update | Game update records: dates, summaries |
| `bucket("varbit")` | Bucket:Varbit | Varbit id to meaning mappings |

## Quick Reference: Common Tasks → Bucket

| Task | Bucket |
|------|--------|
| GE prices | `bucket("exchange")` |
| Item stats (examine, weight, alch, buy limit) | `bucket("infobox_item")` |
| Monster stats (HP, max hit, combat level, weaknesses) | `bucket("infobox_monster")` |
| Drop sources for item | `bucket("dropsline")` |
| Quest requirements/rewards | `bucket("quest")` |
| Gear for activity | `bucket("recommended_equipment")` |
| Varbit values | `bucket("varbit")` |
| Shop info | `bucket("infobox_shop")` |
| Item/NPC/Object ID lookups | `bucket("item_id")`, `bucket("npc_id")`, `bucket("object_id")` |
| Combat achievements | `bucket("combat_achievement")` |
| Equipment bonuses | `bucket("infobox_bonuses")` |
| Money making methods | `bucket("money_making_guide")` |

## Discovery

If a bucket isn't listed here:
1. `search-page-by-prefix "Bucket:"` (namespace 9592)
2. `get-page "Bucket:<Name>"` for schema + preview