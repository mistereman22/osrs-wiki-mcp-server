# Tool Selection Guide (READ FIRST)

> Decide which tool to use, then read the corresponding guide.

## Decision Tree

```
User asks a question
│
├─ Structured data? (stats, prices, drops, requirements, gear, varbits, IDs)
│   → bucket-query
│   → Read: context://bucket-query-guide
│
├─ Canonical list? (all bosses, all quests, all items, all updates)
│   → get-category-members
│   → Read: context://namespace-category-guide
│
├─ Custom namespace list? (game updates, calculators)
│   → get-site-info + get-category-members
│   → Read: context://namespace-category-guide
│
├─ Exact title known?
│   → get-page
│
├─ Know title prefix? (e.g., "Abyssal ", "Dragon ")
│   → search-page-by-prefix
│   → Read: context://search-guide
│
└─ General topic / unstructured content? (lore, mechanics, guides)
    → search-page (broad query + high limit)
    → Check for canonical page → get-page
    → Read: context://search-guide
```

## Quick Tool → Resource Map

| Tool | Primary Resource | Secondary |
|------|------------------|-----------|
| `bucket-query` | `context://bucket-query-guide` | `context://bucket-catalog` |
| `get-category-members` | `context://namespace-category-guide` | — |
| `get-site-info` | `context://namespace-category-guide` | — |
| `get-page` | `context://search-guide` (section discovery) | `context://page-structure` |
| `search-page` | `context://search-guide` | — |
| `search-page-by-prefix` | `context://search-guide` | — |
| `get-links-here` | `context://namespace-category-guide` | — |

## Most Common Patterns (Copy-Paste)

### Bucket Query (structured data)
```lua
-- Item price/stats
bucket("exchange").select("name","value","high_alch").where("name","Abyssal whip").run()
bucket("infobox_item").select("item_name","value","high_alch","weight").where("item_name","Abyssal whip").run()

-- Monster stats
bucket("infobox_monster").select("name","combat_level","hitpoints","max_hit").where("name","Hydra").run()

-- Drop sources for item
bucket("dropsline").select("item_name","drop_json").where("item_name","Abyssal whip").run()

-- Quest requirements
bucket("quest").select("name","requirements").where("name","Dragon Slayer I").run()

-- Gear for activity
bucket("recommended_equipment").select("item","slot").where("activity","hydra").run()

-- Varbit
bucket("varbit").select("name","value").where("name","hydra_task").run()

-- Shop
bucket("infobox_shop").select("shop_name","location","owner").where("shop_name","Bob's Brilliant Axes").run()
```

### Category Members (canonical lists)
```bash
# All bosses
get-category-members "Bosses"

# All quests
get-category-members "Quests"

# All game updates (Update: namespace 1198)
get-category-members "Updates" namespaces=[1198]

# All GE items
get-category-members "Grand Exchange items"
```

### Search (unstructured content)
```bash
# Broad first → canonical page → section
search-page "updates" limit=100
get-page "Game updates"
get-page "Game updates" section=3

# Section discovery
get-page "Chest (Tombs of Amascut)" metadata=true
get-page "Chest (Tombs of Amascut)" section=3
```