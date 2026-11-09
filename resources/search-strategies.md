# Search Strategies

> When and how to use each search tool effectively.

## Tool Comparison

| Tool | Use Case | Returns |
|------|----------|---------|
| `search-page` | General topic, keyword, phrase | Page titles + snippets (full-text) |
| `search-page-by-prefix` | Known prefix, autocomplete | Page titles only (no snippets) |
| `get-page` (metadata) | Get section outline of known page | Section headings + numbers |

## Decision Tree

```
Need to find a page?
│
├─ Know exact title? → get-page "Exact Title"
│
├─ Know start of title? → search-page-by-prefix "Prefix"
│
├─ General topic / keywords? → search-page "keywords"
│
└─ Want to browse a category? → get-page "Category:Name"
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

## Rate Limit Awareness

- Each search tool call counts toward MediaWiki rate limit (30/min)
- Prefer bucket-query for structured data (same limit, but returns exact data)
- Use `metadata=true` + `section=N` to minimize page read calls
- Cache results mentally within a conversation - don't re-search

## Fallback Chain

1. **bucket-query** (if structured data exists) → check `context://bucket-index`
2. **search-page-by-prefix** (if you know title prefix)
3. **search-page** (general topic)
4. **get-page + metadata** (large page, need specific section)
5. **get-page** (full page, last resort)