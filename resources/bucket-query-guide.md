# Bucket Query Guide

> How to use bucket-query effectively. Read `context://bucket-catalog` first to find the right bucket.

## When to Use bucket-query

**Use bucket-query for structured/semantic data. Use search-page/get-page for unstructured content.**

| Use bucket-query for... | Use search-page/get-page for... |
|-------------------------|--------------------------------|
| Item stats (price, high alch, weight, examine, buy limit) | Lore, mechanics, walkthroughs |
| Monster stats (HP, max hit, combat level, weaknesses, slayer info) | "How do I..." guides |
| Grand Exchange prices | General explanations |
| Drop sources for a specific item | Narrative content |
| Quest requirements, rewards, difficulty | |
| Gear recommendations for an activity/boss | |
| Varbit values/meanings | |
| Shop info (location, owner, stock) | |
| Item/NPC/Object ID mappings | |

**Key distinction**: Buckets return *structured rows* (semantic data). Pages return *wikitext/HTML* (unstructured content).

## Mandatory Best Practices

- **ALWAYS use `.select("field1","field2")`** — only fetch needed columns
- **ALWAYS use `.where("field","value")`** — filter rows, never fetch all
- **Use `.limit(N)`** — cap results (max 500)
- **Chain filters** with `Bucket.And/Or/Not` for complex conditions
- **NEVER run `.run()` without `.select()` and `.where()`**

```lua
-- ✅ Good
bucket("exchange").select("name","value","high_alch").where("name","Abyssal whip").run()
bucket("infobox_shop").select("shop_name","location").where("location","Lumbridge").limit(100).run()

-- ❌ Bad (causes context bloat)
bucket("infobox_shop").run()
bucket("exchange").select("*").run()
```

## Exact Match Only — No Wildcards

bucket-query uses **exact match only**. To find exact values:

1. `search-page` for the term → get exact name
2. Use exact name in bucket query with `.where()`

```bash
# Example: "Bob's Axe Shop"
search-page "bob axe"  →  "Bob's Brilliant Axes"
bucket("infobox_shop").where("shop_name","Bob's Brilliant Axes")
```

## Query Syntax

```lua
-- Equality
.where("field","value")

-- Operators
.where({"field",">",value})
.where({"field","<",value})
.where({"field",">=",value})
.where({"field","<=",value})
.where({"field","!=",value})

-- Composition
Bucket.And({where1, where2})
Bucket.Or({where1, where2})
Bucket.Not(where1)

-- Pagination
.limit(200).continueFrom("cursor")
```

Full Lua reference: https://meta.weirdgloop.org/w/Extension:Bucket/Usage

## Common Patterns (Always use .select() and .where())

| Task | Query |
|------|-------|
| GE prices | `bucket("exchange").select("name","value","high_alch").where("name","Abyssal whip").run()` |
| Monster stats | `bucket("infobox_monster").select("name","combat_level","hitpoints","max_hit").where("name","Hydra").run()` |
| Item stats | `bucket("infobox_item").select("item_name","value","high_alch","weight","buy_limit").where("item_name","Abyssal whip").run()` |
| Drop sources for item | `bucket("dropsline").select("item_name","drop_json").where("item_name","Abyssal whip").run()` |
| Quest requirements | `bucket("quest").select("name","requirements","rewards").where("name","Dragon Slayer I").run()` |
| Varbits | `bucket("varbit").select("name","value").where("name","hydra_task").run()` |
| Shop lookup | `bucket("infobox_shop").select("shop_name","location","owner").where("shop_name","Bob's Brilliant Axes").run()` |
| Gear recommendations | `bucket("recommended_equipment").select("item","slot").where("activity","hydra").run()` |
| Equipment bonuses | `bucket("infobox_bonuses").select("name","slot","stab","slash","crush","magic","range").where("name","Bandos chestplate").run()` |
| Combat achievements | `bucket("combat_achievement").select("name","tier","description").where("name","Perfect Fire Cape").run()` |

## Workflow: Find Exact Values First

1. **search-page** for term → get exact name
2. Use exact name in `bucket-query` with `.where()`

```bash
# "best gear for hydra"
search-page "hydra gear"  →  exact activity name "Hydra"
bucket("recommended_equipment").select("item","slot").where("activity","Hydra").run()
```

## What Buckets CANNOT Do

| Limitation | Workaround |
|------------|------------|
| `dropsline` only queryable by `item_name`, not by source | Use `get-page` on source page (boss/chest/activity) |
| "What drops from boss X" | `get-page "Boss Name"` → `metadata=true` → `section=N` for drops |
| Raid/group drops (ToA, CoX, ToB) | Individual boss/chest pages via `get-page` |

## Raid/Group Drop Patterns (use get-page, NOT buckets)

| Content | Query |
|---------|-------|
| Tombs of Amascut (ToA) | `get-page "Chest (Tombs of Amascut)"` then `get-page "Tumeken's Warden"`, `get-page "Akkha"`, etc. |
| Chambers of Xeric (CoX) | `get-page "Chambers of Xeric"` then individual boss pages (Olm, Great Olm, etc.) |
| Theatre of Blood (ToB) | `get-page "Theatre of Blood"` then individual boss pages (Maiden, Bloat, Nylocas, Sotetseg, Xarpus, Verzik) |
| General boss drops | `get-page "<Boss Name>"` (e.g., "Zulrah", "Vorkath", "Phantom Muspah") |

For large pages: `get-page "<Title>" metadata=true` → get section outline → `get-page "<Title>" section=N` for drops section.

## Troubleshooting

| Issue | Fix |
|-------|-----|
| No results | Check schema: `get-page "Bucket:<Name>"` — wrong field name or wrong exact value |
| Too many results | Add more `.where()` filters, use `.limit()` |
| Schema not available | Use `search-page-by-prefix "Bucket:"` → find schema page |
| Field name unknown | Read bucket schema page for exact field names |

## Pagination Example

```lua
-- First page
bucket("infobox_shop").select("shop_name","location").limit(200).run()

-- Subsequent pages
bucket("infobox_shop").select("shop_name","location").limit(200).continueFrom("cursor_from_previous").run()
```