# Search Guide

> Tool selection, broad-first search, canonical page heuristic, section discovery for `search-page`, `search-page-by-prefix`, `get-page`.

## Tool Selection Decision Tree (START HERE)

```
User asks a question
│
├─ Structured data? (stats, prices, drops, requirements, gear, varbits)
│   → bucket-query (read context://bucket-query-guide)
│
├─ Canonical list? (all bosses, all quests, all items, all updates)
│   → get-category-members (read context://namespace-category-guide)
│
├─ Custom namespace list? (game updates in Update:, calculators)
│   → get-site-info + get-category-members (read context://namespace-category-guide)
│
├─ Exact page title known?
│   → get-page directly
│
├─ Know start of title? (e.g., "Abyssal ", "Dragon ")
│   → search-page-by-prefix "Prefix"
│
└─ General topic / keywords / unstructured content?
    → search-page with BROAD query + high limit (50-100)
      → Check results for canonical index page → get-page that page
```

## Tool Comparison

| Tool | Use Case | Returns |
|------|----------|---------|
| `search-page` | General topic, keyword, phrase | Page titles + snippets (full-text) |
| `search-page-by-prefix` | Known prefix, autocomplete | Page titles only (no snippets) |
| `get-page` (metadata) | Get section outline of known page | Section headings + numbers |

## Broad-First Search Strategy

**Start with a broad query + high limit to find the canonical page, then narrow.**

| Approach | Query | Limit | Why |
|----------|-------|-------|-----|
| ❌ Too specific | `"2026 game updates"` | 10 | Misses "Game updates" page |
| ✅ Broad first | `"game updates"` | 50-100 | Finds canonical page immediately |
| ✅ Broad first | `"updates"` | 50 | Even broader, catches "Game updates" |

### Why this works
- `search-page` max limit = **100** (default 10). One broad call with `limit=100` costs same as narrow call.
- Canonical index pages (e.g., "Game updates", "Quest list") rank high for broad terms.
- Snippets in broad results reveal structure → you pick the right page → one `get-page`.

### Workflow
```
1. search-page "updates" limit=100
   → #2: "Game updates" (snippet: "chronological list of all game updates")
2. get-page "Game updates"          ← canonical page, has everything
3. (if needed) get-page "Game updates" section=3  ← specific year
```

### Anti-pattern
```
search-page "2026 game updates" limit=10  → misses canonical page
search-page "Easter 2026 update"          → too narrow, fragments context
search-page "Cow Boss update"             → too narrow
```

## search-page Best Practices

### Do:
- Use specific keywords: `"hydra gear setup"` not `"hydra"`
- Include context: `"prayer flicking technique"` not `"prayer"`
- Use quotes for exact phrases: `"/roll"` or `"drop rate"`

### Don't:
- Use single generic words: `"item"`, `"boss"`, `"quest"`
- Overuse - check bucket-index first for structured data

### Result Interpretation:
- Snippet shows match context - verify it's the right page
- Page ID/size/timestamp help gauge relevance
- Namespace 0 = main content (what you want)

## search-page-by-prefix Best Practices

### Do:
- Use when you know the prefix: `"Abyssal "`, `"Dragon "`, `"Barbarian "`
- Short prefixes return more results: `"Dra"` vs `"Dragon "`
- Combine with namespace filter for categories: `namespace: 14`

### Don't:
- Use for general topics (use `search-page`)
- Expect snippets - only titles returned

## get-page for Section Discovery

### Before reading a large page:
```bash
get-page "Chest (Tombs of Amascut)" metadata=true
```

### Returns:
```json
{
  "sections": [
    {"index": 0, "title": "Lead"},
    {"index": 1, "title": "Rewards"},
    {"index": 2, "title": "Unique drops"},
    {"index": 3, "title": "Standard drops"},
    {"index": 4, "title": "Supply drops"}
  ]
}
```

### Then fetch only what you need:
```bash
get-page "Chest (Tombs of Amascut)" section=3   # Standard drops
get-page "Chest (Tombs of Amascut)" section=2   # Unique drops
```

### Section 0 = Lead (intro text)
### Section N = Heading N in the article

## Common Search Patterns

| Goal | Tool | Query |
|------|------|-------|
| Item stats/price | bucket-query | `bucket("exchange").select(...).where("name","...")` |
| Monster stats | bucket-query | `bucket("infobox_monster").select(...).where("name","...")` |
| Where item drops from | bucket-query | `bucket("dropsline").select(...).where("item_name","...")` |
| What boss drops | get-page + metadata | `get-page "Boss Name" metadata=true` → `section=N` |
| Quest requirements | bucket-query | `bucket("quest").select(...).where("name","...")` |
| Gear for activity | bucket-query | `bucket("recommended_equipment").select(...).where("activity","...")` |
| Shop location/items | bucket-query | `bucket("infobox_shop").select(...).where("shop_name","...")` |
| General mechanic/guide | search-page | `search-page "prayer flicking"` |
| Browse category | get-page | `get-page "Category:Bosses"` |
| Find exact title variant | search-page-by-prefix | `search-page-by-prefix "Tumeken"` |

## Canonical Page Heuristic

### When search returns an obvious index/list page → FETCH IT IMMEDIATELY

If a search result's **title** and **snippet** together indicate it's the canonical aggregation page for your topic, stop searching and `get-page` it.

| Signal | Example |
|--------|---------|
| Title = plural/category name | `"Game updates"`, `"Quest list"`, `"Item sets"` |
| Snippet shows dated/structured entries | `"lists Easter 2026, Cow Boss, Getting Around Poll in chronological order"` |
| Title matches your query intent exactly | Search `"2026 updates"` → result `"Game updates"` |

### Anti-pattern to avoid
```
search-page "Game update 2026"
  → result: "Game updates" (snippet: "lists Easter 2026, Cow Boss...")
  → ❌ KEEP SEARCHING for "2026 update" "Easter 2026" etc.
  → ✅ get-page "Game updates"  ← canonical page, has everything
```

### Why this works
- Wiki index pages (Game updates, Quest list, Monster drop tables) are **curated, complete, and maintained**
- Search snippets often reveal the exact structure (chronological, by tier, by category)
- One `get-page` > 5+ `search-page` calls (rate limit, context, accuracy)

### Quick test
> "Does this result look like *the* page a human would bookmark for this topic?" → Yes → `get-page`

## Rate Limit Awareness

- Each search tool call counts toward MediaWiki rate limit (30/min)
- Prefer bucket-query for structured data (same limit, but returns exact data)
- Use `metadata=true` + `section=N` to minimize page read calls
- Cache results mentally within a conversation - don't re-search

## DPL / Template Pages

If `get-page` returns `<dpl>` tags or `{{Template}}` transclusions — **the data isn't there**. See `context://namespace-category-guide` → "Dynamic Content Patterns" for the workflow:

1. `get-site-info` → find namespace ID
2. `get-category-members` with category + namespace
3. `get-pages` for details

Common on OSRS: Game updates (`Update:` namespace 1198), calculators, module outputs.

## Fallback Chain

1. **bucket-query** (if structured data exists) → check `context://bucket-catalog`
2. **search-page-by-prefix** (if you know title prefix)
3. **search-page** (general topic)
4. **get-page + metadata** (large page, need specific section)
5. **get-page** (full page, last resort)