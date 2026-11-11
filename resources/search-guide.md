# Search Guide

> Broad-first search, canonical page heuristic, section discovery for `search-page`, `search-page-by-prefix`, `get-page`.

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

- Use specific keywords with context: `"hydra gear setup"` not `"hydra"`, `"prayer flicking technique"` not `"prayer"`
- Use quotes for exact phrases: `"/roll"` or `"drop rate"`
- Avoid single generic words: `"item"`, `"boss"`, `"quest"`
- Check snippets to verify relevance; namespace 0 = main content
- `search-page-by-prefix`: use when you know the prefix (`"Abyssal "`, `"Dragon "`); returns titles only (no snippets)

## get-page for Section Discovery

### Size check (do this first for unknown pages):
```bash
get-page "Chest (Tombs of Amascut)" metadata=true
```
If page size >75KB, use section-based reading (below) instead of full fetch.

### Then get section outline:

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

- 30 calls/min across all MediaWiki tools; prefer bucket-query for structured data
- Use `metadata=true` + `section=N` to minimize page reads; don't re-search within a conversation

## Dynamic Content (DPL / Templates / Rendered Values)

If `get-page` returns `<dpl>` tags or `{{...}}` transclusions — the data isn't in that page:
- **DPL / template discovery workflow** → `context://namespace-category-guide`
- **Rendered values (live GE prices, etc.)** → `context://template-reference`
- **View-page rule**: if source is mostly `{{...}}` soup, render with `parse-wikitext` instead of parsing raw wikitext
- **Don't search `Template:` or `Module:` namespaces** unless looking for template/module documentation

## Fallback Chain

1. **bucket-query** (if structured/static data exists) → check `context://bucket-catalog`
2. **parse-wikitext** (if you need a rendered value) → see `context://template-reference`
3. **search-page-by-prefix** (if you know title prefix)
4. **search-page** (general topic)
5. **get-page + metadata** (large page, need specific section)
6. **get-page** (full page, last resort)