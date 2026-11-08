# Bucket Index (hint list)

> On-demand hints for `bucket-query` on the Old School RuneScape Wiki.
> **This index is not authoritative.** Purpose descriptions are best-effort
> summaries; fields always come from the schema page. If nothing here fits
> your need, or a name fails at runtime, fall back to discovery:
> `search-page-by-prefix` in the `Bucket:` namespace (id 9592), then
> `get-page` on `Bucket:<Name>` to see exact fields and a data preview.
>
> Naming rule: pass the page title lowercased with spaces as underscores
> (`Bucket:Clue equipment` -> `bucket("clue_equipment")`). All bucket and
> field names are lowercase; fields are verified on the schema page, never
> guessed from this file.

## Known buckets

| Query as | Page | Holds |
| --- | --- | --- |
| `bucket("bountytaskline")` | Bucket:Bountytaskline | Bounty Hunter task line entries |
| `bucket("clue_equipment")` | Bucket:Clue equipment | Equipment associated with clue scroll steps |
| `bucket("clue_info")` | Bucket:Clue info | Clue scroll metadata/step info |
| `bucket("collection_log_source")` | Bucket:Collection log source | Sources for collection log slots |
| `bucket("combat_achievement")` | Bucket:Combat achievement | Combat achievement tasks, tiers, requirements |
| `bucket("couriertaskline")` | Bucket:Couriertaskline | Courier activity task line entries |
| `bucket("demonicpactleaguetask")` | Bucket:Demonicpactleaguetask | Demonic Pact league task entries |
| `bucket("dependency_list")` | Bucket:Dependency list | Item/object dependency relations |
| `bucket("drop_table_sources")` | Bucket:Drop table sources | Which activities/NPCs use which drop tables |
| `bucket("dropsline")` | Bucket:Dropsline | Drop table line entries per source |
| `bucket("exchange")` | Bucket:Exchange | Grand Exchange prices (name, value, high/low, volumes) |
| `bucket("feedback")` | Bucket:Feedback | Wiki feedback entries (site-internal) |
| `bucket("ge_index_header")` | Bucket:Ge index header | Grand Exchange index header/snapshot metadata |
| `bucket("infobox_activity")` | Bucket:Infobox activity | Skilling/activity infobox data |
| `bucket("infobox_bonuses")` | Bucket:Infobox bonuses | Equipment combat stats and bonuses |
| `bucket("infobox_construction")` | Bucket:Infobox construction | Construction object/buildable data |
| `bucket("infobox_grid_master_unlock")` | Bucket:Infobox grid master unlock | Grid Master unlock data |
| `bucket("infobox_item")` | Bucket:Infobox item | Core item data: id, name, examine, flags, stats |
| `bucket("infobox_location")` | Bucket:Infobox location | Location/area data |
| `bucket("infobox_monster")` | Bucket:Infobox monster | Monster combat stats: level, hitpoints, max hit |
| `bucket("infobox_npc")` | Bucket:Infobox npc | NPC data: id, combat level, examine |
| `bucket("infobox_pure")` | Bucket:Infobox pure | Pure-entity infobox data (verify schema) |
| `bucket("infobox_scenery")` | Bucket:Infobox scenery | Scenery/object entity data |
| `bucket("infobox_ship_part")` | Bucket:Infobox ship part | Ship part data |
| `bucket("infobox_shop")` | Bucket:Infobox shop | Shop stock and prices |
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
| `bucket("recommended_equipment")` | Bucket:Recommended equipment | Recommended gear setups by activity/slot |
| `bucket("seachart")` | Bucket:Seachart | Sea chart/naval data |
| `bucket("sound_effect")` | Bucket:Sound effect | Sound effect metadata |
| `bucket("soundtrack")` | Bucket:Soundtrack | Soundtrack track data |
| `bucket("storeline")` | Bucket:Storeline | Store line entries |
| `bucket("testing_bucket")` | Bucket:Testing bucket | Wiki-internal testing data (not real content) |
| `bucket("transcript")` | Bucket:Transcript | NPC/dialogue transcripts |
| `bucket("update")` | Bucket:Update | Game update records: dates, summaries |
| `bucket("varbit")` | Bucket:Varbit | Varbit id to meaning mappings |

## Query reminders

- Query must end in `.run()`; `limit` max 500, paginate with `continueFrom`.
- Equality: `where("field","value")`; operators: `where({"field",">",value})`
  with `=`, `!=`, `>`, `<`, `>=`, `<=`; compose with `Bucket.And/Or/Not`.
- Example: `bucket("infobox_item").select("item_id","examine").where("item_name","Raw lobster").run()`
- Full Lua reference: https://meta.weirdgloop.org/w/Extension:Bucket/Usage
