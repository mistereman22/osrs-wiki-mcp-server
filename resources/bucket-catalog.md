# Bucket Catalog (Reference)

> Complete list of known buckets on OSRS Wiki. For usage patterns, see `context://bucket-query-guide`.

## Bucket Index

| Query as | Page | Holds |
| --- | --- | --- |
| `bucket("bountytaskline")` | Bucket:Bountytaskline | Fields: level, xp, notice_board, monster, monster_alt, item, qty, rarity, task_id, transcript, guaranteed |
| `bucket("clue_equipment")` | Bucket:Clue equipment | Fields: clue_id, set_id, group_id, item, base_item, price_items, price_quantities, is_alternate |
| `bucket("clue_info")` | Bucket:Clue info | Fields: id, tier, emote, location, reference |
| `bucket("collection_log_source")` | Bucket:Collection log source | Fields: item_id, item_name, sources, rates, kinds. Only queryable by item_name |
| `bucket("combat_achievement")` | Bucket:Combat achievement | Fields: name, tier, description |
| `bucket("couriertaskline")` | Bucket:Couriertaskline | Fields: level, xp, notice_board, cargo_location, destination, item, qty, task_id, transcript |
| `bucket("demonicpactleaguetask")` | Bucket:Demonicpactleaguetask | Fields: name, description, skill, other, tier, region, pact_task, id, completion |
| `bucket("dependency_list")` | Bucket:Dependency list | Fields: require, load_data |
| `bucket("drop_table_sources")` | Bucket:Drop table sources | Fields: table_name, quantity, rolls, rarity, approx, drop_level, drop_type |
| `bucket("dropsline")` | Bucket:Dropsline | Fields: item_name, drop_json (JSON with "Dropped from", rarity, quantity). Only queryable by item_name |
| `bucket("exchange")` | Bucket:Exchange | Fields: name, value (= static Value stat), high_alch, low_alch, limit, json |
| `bucket("feedback")` | Bucket:Feedback | Fields: id, comment, resolved, category, timestamp |
| `bucket("ge_index_header")` | Bucket:Ge index header | Fields: change_date, ge_index_name, ge_index_sub, add_quantity, remove_quantity, divisor, change_items |
| `bucket("infobox_activity")` | Bucket:Infobox activity | Fields: image, is_members_only, default_version |
| `bucket("infobox_bonuses")` | Bucket:Infobox bonuses | Fields: stab_attack_bonus, slash_attack_bonus, crush_attack_bonus, range_attack_bonus, magic_attack_bonus, stab_defence_bonus, slash_defence_bonus, crush_defence_bonus, range_defence_bonus, magic_defence_bonus, strength_bonus, ranged_strength_bonus, prayer_bonus, magic_damage_bonus, equipment_slot, weapon_attack_speed, weapon_attack_range, combat_style |
| `bucket("infobox_construction")` | Bucket:Infobox construction | Fields: default_version, image, icon, item_id, object_id, level, experience, uses_skill |
| `bucket("infobox_grid_master_unlock")` | Bucket:Infobox grid master unlock | Fields: image, difficulty, row, column |
| `bucket("infobox_item")` | Bucket:Infobox item | Fields: item_name, item_id, examine, high_alchemy_value, value, weight, buy_limit, is_members_only, tradeable, image, league_region, release_date, removal_date, quest, version_anchor |
| `bucket("infobox_location")` | Bucket:Infobox location | Fields: is_members_only |
| `bucket("infobox_monster")` | Bucket:Infobox monster | Fields: name, combat_level, hitpoints, max_hit, slayer_level, slayer_experience, slayer_category, assigned_by, attack/defence bonuses, attack_speed, poisonous, attribute, attack_style, respawn_time, experience_bonus, flat_armour, magic_resistance, size, attack/strength/defence/ranged/magic levels, attack_bonus, strength_bonus, range_strength_bonus, magic_damage_bonus, poison/venom/freeze/burn/cannon/thrall resistance, elemental_weakness, elemental_weakness_percent |
| `bucket("infobox_npc")` | Bucket:Infobox npc | Fields: id, combat_level, examine |
| `bucket("infobox_pure")` | Bucket:Infobox pure | Fields: name, image, is_members_only, type, max_hit, combat_level, hitpoints, attack_level, strength_level, defence_level, ranged_level, magic_level, prayer_level, attack_style, all_attack_style |
| `bucket("infobox_scenery")` | Bucket:Infobox scenery | Fields: default_version, image, is_members_only, league_region, release, object_id, npc_id |
| `bucket("infobox_ship_part")` | Bucket:Infobox ship part | Fields: image, icon, item_id, object_id |
| `bucket("infobox_shop")` | Bucket:Infobox shop | Fields: shop_name, location, owner, specialty, shop_version, is_members_only |
| `bucket("infobox_spell")` | Bucket:Infobox spell | Fields: image, is_members_only, spellbook, uses_material, json |
| `bucket("interface")` | Bucket:Interface | Fields: name, id |
| `bucket("item_id")` | Bucket:Item id | Fields: id (maps item name to id) |
| `bucket("locline")` | Bucket:Locline | Fields: members, mapid, plane, coordinates, leagueregion |
| `bucket("logs")` | Bucket:Logs | Fields: module, message |
| `bucket("map")` | Bucket:Map | Fields: features, options, is_historic |
| `bucket("mine")` | Bucket:Mine | Fields: is_members_only, json |
| `bucket("mmg_output")` | Bucket:Mmg output | Fields: item, qty_per_hour |
| `bucket("money_making_guide")` | Bucket:Money making guide | Fields: value, recurring, json. Not queryable by method name — use search-page → get-page instead |
| `bucket("music")` | Bucket:Music | Fields: title, sort_name, number, duration, tempo, composer, unlock_hint, track, release_date, release_update, is_members_only, is_jingle, is_event, unlock_detail, cacheid |
| `bucket("music_file")` | Bucket:Music file | Fields: name, id |
| `bucket("music_map")` | Bucket:Music map | Fields: location_json, music_tracks, is_historic |
| `bucket("music_versions")` | Bucket:Music versions | Fields: track, version, date, change |
| `bucket("npc_id")` | Bucket:Npc id | Fields: id (maps NPC name to id) |
| `bucket("object_id")` | Bucket:Object id | Fields: id (maps object/scenery name to id) |
| `bucket("quest")` | Bucket:Quest | Fields: description, requirements, items_required, enemies_to_defeat, ironman_concerns, official_difficulty, official_length, start_point, json. Not queryable by quest name — use Questreq templates instead |
| `bucket("recipe")` | Bucket:Recipe | Fields: uses_material, uses_tool, uses_facility, is_members_only, is_boostable, uses_skill, source_template, production_json |
| `bucket("recommended_equipment")` | Bucket:Recommended equipment | Fields: json (queryable by activity name via json field) |
| `bucket("seachart")` | Bucket:Seachart | Fields: description, id, level, type, sea, ocean, location, location2, hazard, xp |
| `bucket("sound_effect")` | Bucket:Sound effect | Fields: name, id |
| `bucket("soundtrack")` | Bucket:Soundtrack | Fields: title, release_date, cover, link_tidal, link_bandcamp, link_qobuz, link_itunes, link_spotify, link_youtube, link_amazon, link_deezer, link_soundcloud |
| `bucket("storeline")` | Bucket:Storeline | Fields: sold_by, sold_item, sold_item_image, store_buy_price, store_sell_price, store_currency, store_delta, store_stock, store_buy_multiplier, store_sell_multiplier, restock_time, store_notes, sold_item_json |
| `bucket("testing_bucket")` | Bucket:Testing bucket | Fields: PAGE_NR, PAGE_R, TEXT_NR, TEXT_R, INTEGER_NR, INTEGER_R, DOUBLE_NR, DOUBLE_R, BOOLEAN_NR, BOOLEAN_R (wiki-internal testing, not real content) |
| `bucket("transcript")` | Bucket:Transcript | Fields: npcs |
| `bucket("update")` | Bucket:Update | Fields: date, date_rev, type, year, month, day, year_rev, month_rev, day_rev, patch_parent |
| `bucket("varbit")` | Bucket:Varbit | Fields: content, name, index |

## Quick Reference: Common Tasks → Bucket

| Task | Bucket |
|------|--------|
| GE metadata (name, Value stat, alch values) | `bucket("exchange")` — for live prices, see context://template-reference |
| Item stats (examine, weight, alch, buy limit) | `bucket("infobox_item")` |
| Monster stats (HP, max hit, combat level, weaknesses) | `bucket("infobox_monster")` |
| Drop sources for item | `bucket("dropsline")` |
| Quest requirements/rewards | Use `parse-wikitext "{{Questreq\|<quest>\|quests}}"` + `{{Questreq\|<quest>\|skills}}"` (bucket not queryable by quest name) |
| Gear for activity | `bucket("recommended_equipment")` |
| Varbit values | `bucket("varbit")` |
| Shop info | `bucket("infobox_shop")` |
| Item/NPC/Object ID lookups | `bucket("item_id")`, `bucket("npc_id")`, `bucket("object_id")` |
| Combat achievements | `bucket("combat_achievement")` |
| Equipment bonuses | `bucket("infobox_bonuses")` |
| Money making methods | Use `search-page "money making <boss>"` → `get-page "Money making guide/..."` (bucket not queryable by method name) |

## Discovery

All known buckets are listed above with their fields. If a bucket isn't listed:
1. `search-page-by-prefix "Bucket:"` (namespace 9592)
2. `get-page "Bucket:<Name>"` for schema + preview