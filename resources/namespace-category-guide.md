# Namespace & Category Guide

> Category structure, namespace IDs, and DPL/template discovery workflow for `get-category-members`, `get-site-info`, `get-links-here`.

## Namespaces

| Namespace ID | Prefix | Purpose |
|--------------|--------|---------|
| 0 | (none) | Main content pages (items, monsters, quests, bosses, mechanics) |
| 1 | Talk: | Discussion pages |
| 2 | User: | User pages |
| 6 | File: | Images/media |
| 10 | Template: | Templates |
| 14 | Category: | Category listings |
| 9592 | Bucket: | Bucket extension schemas (use `context://bucket-catalog` first) |
| 1198 | Update: | Game updates (DPL-driven lists) |
| 1199 | Update_talk: | Update discussion |
| 1200 | Calculator: | Calculators |
| 828 | Module: | Lua modules |

> **Tip**: Run `get-site-info` for the full namespace map — custom namespaces vary by wiki.

## Category Structure (Key Categories)

### Items
- `Category:Items` → subcategories: `Weapons`, `Armour`, `Food`, `Potions`, `Runes`, `Ammunition`, `Tools`, `Quest items`, etc.
- `Category:Tradeable items` / `Category:Untradeable items`
- `Category:Grand Exchange items`

### Monsters/NPCs
- `Category:Monsters` → subcategories: `Bosses`, `Slayer monsters`, `Dungeon monsters`, `Wilderness monsters`
- `Category:Aggressive monsters`, `Category:Poisonous monsters`

### Content
- `Category:Quests` → `Free-to-play quests`, `Members quests`, `Novice/Intermediate/Experienced/Master/Grandmaster quests`
- `Category:Achievement Diaries`, `Category:Combat Achievements`
- `Category:Minigames`, `Category:Raids`, `Category:Activities`
- `Category:Locations`, `Category:Dungeons`, `Category:Cities`

### Data
- `Category:Exchange` (GE price pages)
- `Category:Drop tables`

## When to Use get-category-members vs search-page

| Use `get-category-members` when... | Use `search-page` when... |
|------------------------------------|---------------------------|
| You want *all* pages in a category | You want pages *about* a topic |
| The category is the canonical list | You don't know the category |
| You need namespace filtering (e.g., Update: pages) | You need full-text matching |
| Example: "list all bosses" | Example: "hydra gear setup" |

## Tool Routing

| Goal | Tool | Parameters |
|------|------|------------|
| **All bosses** | `get-category-members` | `category="Bosses"` |
| **All quests** | `get-category-members` | `category="Quests"` |
| **All items** | `get-category-members` | `category="Items"` |
| **All game updates** | `get-category-members` | `category="Updates" namespaces=[1198]` |
| **All calculators** | `get-category-members` | `category="Calculators" namespaces=[1200]` |
| **All GE-tracked items** | `get-category-members` | `category="Grand Exchange items"` |
| **Pages in custom namespace** | `get-site-info` → `get-category-members` | See DPL workflow below |
| **Backlinks to page** | `get-links-here` | `type="wikilinks"` / `transclusions` / `fileusage` |
| **Category members (as page list)** | `get-page "Category:Name"` | Returns wikitext list |

## Dynamic Content Patterns

### DPL (`<dpl>` tags) — Presentation, Not Data

When `get-page` returns wikitext containing `<dpl>` tags, **the data does not exist in that page**. DPL (DynamicPageList) is a presentation-layer extension that queries categories/namespaces at render time. The API **does not execute DPL**.

| Instead of... | Do this |
|---------------|---------|
| Reading the DPL page | `get-category-members` with the category + namespace DPL uses |
| Parsing `<dpl>` params | Check the DPL tag for `category=`, `namespace=`, `notcategory=` |

**Example**: `Game updates` page uses `<dpl category="Updates" namespace="1198" order=descending>`.
- Don't read `Game updates` for the list
- Do: `get-category-members "Updates" namespaces=[1198]`

### Template Transclusion

Main pages often just include templates (e.g., `{{RecentUpdates}}`, `{{Updates}}`). The content lives in the **template page**, not the main page.

| Pattern | Action |
|---------|--------|
| `{{TemplateName}}` in page source | `get-page "Template:TemplateName"` |
| `{{#invoke:ModuleName|function}}` | `get-page "Module:ModuleName"` |

### Namespaces as Content Types

Custom namespaces often map 1:1 to content types.

| OSRS Namespace | Content Type | Query Via |
|----------------|--------------|-----------|
| `Update:` (1198) | Game updates | `get-category-members "Updates" namespaces=[1198]` |
| `Calculator:` | Calculators | `get-category-members "Calculators" namespaces=[1200]` |
| `Module:` | Lua modules | `get-page "Module:Name"` |

### Categories as Canonical Indexes

**The category often IS the list; the page is just a view.**

- `Category:Updates` + namespace 1198 = all game updates
- `Category:Bosses` = all boss pages
- `Category:Grand Exchange items` = all GE-tracked items

## Discovery Workflow for DPL/Template Pages

```
1. get-page "Page Name"              → see <dpl> or {{Template}} in source
2. get-site-info                     → find relevant namespace ID(s)
3. get-category-members              → with that namespace + category
4. get-pages                         → for individual item details
```

This applies to any wiki using DPL/Category-based lists, not just OSRS updates.

## Example: Get All 2026 Game Updates

```bash
# 1. Check namespace for game updates
get-site-info

# 2. Get all updates (Update: namespace 1198, category "Updates")
get-category-members "Updates" namespaces=[1198]

# 3. Filter for 2026 client-side, or fetch individual pages
#    Results include page titles like "Game update 2026-01-01"
```

## Example: Find All Calculators

```bash
# Calculator namespace is 1200
get-category-members "Calculators" namespaces=[1200]
```

## get-links-here Usage

| Type | Use Case |
|------|----------|
| `wikilinks` (default) | Pages that link to target |
| `transclusions` | Pages that embed target (templates) |
| `fileusage` | Pages that display target (files) |

```bash
# Pages linking to "Abyssal whip"
get-links-here "Abyssal whip" type="wikilinks"

# Pages using Template:Infobox item
get-links-here "Template:Infobox item" type="transclusions"
```