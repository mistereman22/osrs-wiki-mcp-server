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
| `bucket("collection_log_source")` | Bucket:Collection log source | Collection log sources per item: item_id, item_name, sources (repeated wikilinks), rates, kinds. **Only queryable by item_name** - cannot filter by source. To find "what drops from X", use the source page directly. |
| `bucket("combat_achievement")` | Bucket:Combat achievement | Combat achievement tasks, tiers, requirements |
| `bucket("couriertaskline")` | Bucket:Couriertaskline | Courier activity task line entries |
| `bucket("demonicpactleaguetask")` | Bucket:Demonicpactleaguetask | Demonic Pact league task entries |
| `bucket("dependency_list")` | Bucket:Dependency list | Item/object dependency relations |
| `bucket("drop_table_sources")` | Bucket:Drop table sources | Shared drop tables (rare drop table, gem drop table, herb drop table) and their roll/rarity data. Not specific monster/boss drop tables. |
| `bucket("dropsline")` | Bucket:Dropsline | Drop table line entries: item_name, drop_json (JSON text with "Dropped from", rarity, quantity), rare_drop_table. **Only queryable by item_name** - cannot filter by source. To find "what drops from X", use the source page (boss/chest/activity) directly. |
| `bucket("exchange")` | Bucket:Exchange | Grand Exchange prices (name, value, high/low, volumes) |
| `bucket("feedback")` | Bucket:Feedback | Wiki feedback entries (site-internal) |
| `bucket("ge_index_header")` | Bucket:Ge index header | Grand Exchange index header/snapshot metadata |
| `bucket("infobox_activity")` | Bucket:Infobox activity | Skilling/activity infobox data |
| `bucket("infobox_bonuses")` | Bucket:Infobox bonuses | Equipment combat stats and bonuses |
| `bucket("infobox_construction")` | Bucket:Infobox construction | Construction object/buildable data |
| `bucket("infobox_grid_master_unlock")` | Bucket:Infobox grid master unlock | Grid Master unlock data |
| `bucket("infobox_item")` | Bucket:Infobox item | Core item data: item_name, item_id, examine, high_alchemy_value, value, weight, buy_limit, is_members_only, tradeable, image, league_region, release_date, removal_date, value, weight, high_alchemy_value, buy_limit, default_version, quest, version_anchor, is_members_only, tradeable |
| `bucket("infobox_location")` | Bucket:Infobox location | Location/area data |
| `bucket("infobox_monster")` | Bucket:Infobox monster | Monster combat stats: name, combat_level, hitpoints, max_hit, slayer_level, slayer_experience, slayer_category, assigned_by, attack/defence bonuses (stab/slash/crush/magic/range), attack_speed, hitpoints, max_hit, poisonous, attribute, attack_style, attack_speed, respawn_time, experience_bonus, flat_armour, magic_resistance, size, attack/strength/defence/ranged/magic levels, attack_bonus, strength_bonus, range_strength_bonus, magic_damage_bonus, poison/venom/freeze/burn/cannon/thrall resistance, elemental_weakness, elemental_weakness_percent |
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

## Query reminders

- Query must end in `.run()`; `limit` max 500, paginate with `continueFrom`.
- Equality: `where("field","value")`; operators: `where({"field",">",value})`
  with `=`, `!=`, `>`, `<`, `>=`, `<=`; compose with `Bucket.And/Or/Not`.
- Example: `bucket("infobox_item").select("item_id","examine").where("item_name","Raw lobster").run()`
- Full Lua reference: https://meta.weirdgloop.org/w/Extension:Bucket/Usage

## Best Practices (MANDATORY)

- **ALWAYS use `.select("field1","field2")`** - only fetch needed columns
- **ALWAYS use `.where("field","value")`** - filter rows, never fetch all
- **Use `.limit(N)`** - cap results (max 500)
- **Chain filters** with `Bucket.And/Or/Not` for complex conditions
- **NEVER** run `.run()` without `.select()` and `.where()`

### Exact Match Only - No Wildcards

bucket-query uses **exact match only**. To find exact values:
1. `search-page` for the term → get exact name
2. Use exact name in bucket query

Example: "Bob's Axe Shop" → `search-page "bob axe"` → "Bob's Brilliant Axes" → `bucket("infobox_shop").where("shop_name","Bob's Brilliant Axes")`

### Example Patterns

✅ Good:
```
bucket("exchange").select("name","value","high_alch").where("name","Abyssal whip").run()
bucket("infobox_shop").select("shop_name","location").where("location","Lumbridge").limit(5).run()
```

❌ Bad (causes context bloat):
```
bucket("infobox_shop").run()
bucket("exchange").select("*").run()
```

### Pagination
```lua
bucket("infobox_shop").select("shop_name","location").limit(50).continueFrom("cursor").run()
```

### Common Bucket Patterns (Always use .select() and .where())

| Task | Bucket Query |
|------|--------------|
| GE prices | `bucket("exchange").select("name","value","high_alch").where("name","Abyssal whip").run()` |
| Monster stats | `bucket("infobox_monster").select("name","combat_level","hitpoints").where("name","Hydra").run()` |
| Item stats | `bucket("infobox_item").select("item_name","value","high_alch").where("item_name","Abyssal whip").run()` |
| Drop sources | `bucket("dropsline").select("source","quantity").where("item","Abyssal whip").run()` |
| Quest requirements | `bucket("quest").select("name","requirements").where("name","Dragon Slayer I").run()` |
| Varbits | `bucket("varbit").select("name","value").where("name","hydra_task").run()` |
| Shop lookup | `bucket("infobox_shop").select("shop_name","location","owner").where("shop_name","Bob's Brilliant Axes").run()` |
| Gear recommendations | `bucket("recommended_equipment").select("item","slot").where("activity","hydra").run()` |

### Workflow: Find Exact Values First

1. **search-page** for term → get exact name
2. Use exact name in `bucket-query` with `.where()`

Example: "best gear for hydra" → `bucket("recommended_equipment").select("item","slot").where("activity","hydra").run()`

### Raid/Group Drop Patterns (use get-page, NOT buckets)

No bucket supports "what drops from source" queries. For raid/group content, use `get-page` on individual source pages:

| Content | Query |
|---------|-------|
| Tombs of Amascut (ToA) | `get-page "Chest (Tombs of Amascut)"` then `get-page "Tumeken's Warden"`, `get-page "Akkha"`, etc. |
| Chambers of Xeric (CoX) | `get-page "Chambers of Xeric"` then individual boss pages (Olm, Great Olm, etc.) |
| Theatre of Blood (ToB) | `get-page "Theatre of Blood"` then individual boss pages (Maiden, Bloat, Nylocas, Sotetseg, Xarpus, Verzik) |
| General boss drops | `get-page "<Boss Name>"` (e.g., "Zulrah", "Vorkath", "Phantom Muspah") |

For large pages: `get-page "<Title>" metadata=true` → get section outline → `get-page "<Title>" section=N` for drops section.

Use page reads (`get-page`, `search-page`) ONLY for unstructured content: lore, mechanics, walkthroughs.
