# Wiki Navigation Guide

> How to find pages on the Old School RuneScape Wiki using the available tools.

## Namespaces

| Namespace ID | Prefix | Purpose |
|--------------|--------|---------|
| 0 | (none) | Main content pages (items, monsters, quests, bosses, mechanics) |
| 1 | Talk: | Discussion pages |
| 2 | User: | User pages |
| 6 | File: | Images/media |
| 10 | Template: | Templates |
| 14 | Category: | Category listings |
| 9592 | Bucket: | Bucket extension schemas (use `context://bucket-index` first) |

## Category Structure (Key Categories)

**Items:**
- `Category:Items` → subcategories: `Weapons`, `Armour`, `Food`, `Potions`, `Runes`, `Ammunition`, `Tools`, `Quest items`, etc.
- `Category:Tradeable items` / `Category:Untradeable items`
- `Category:Grand Exchange items`

**Monsters/NPCs:**
- `Category:Monsters` → subcategories by type: `Bosses`, `Slayer monsters`, `Dungeon monsters`, `Wilderness monsters`
- `Category:Aggressive monsters`, `Category:Poisonous monsters`

**Content:**
- `Category:Quests` → `Free-to-play quests`, `Members quests`, `Novice/Intermediate/Experienced/Master/Grandmaster quests`
- `Category:Achievement Diaries`, `Category:Combat Achievements`
- `Category:Minigames`, `Category:Raids`, `Category:Activities`
- `Category:Locations`, `Category:Dungeons`, `Category:Cities`

**Data:**
- `Category:Exchange` (GE price pages)
- `Category:Drop tables`

## Finding Pages - Strategy

### 0. Search hit a canonical index page? Fetch it.
```bash
search-page "2026 game updates"
# Result: "Game updates" - snippet shows chronological list
get-page "Game updates"   # ← Do this first
```

### 1. Known exact title? Use `get-page` directly
```bash
get-page "Abyssal whip"
get-page "Tumeken's Warden"
```

### 2. Know approximate title? Use `search-page-by-prefix`
```bash
search-page-by-prefix "Abyssal"        # "Abyssal whip", "Abyssal dagger", etc.
search-page-by-prefix "Tumeken"        # "Tumeken's Warden"
search-page-by-prefix "Chest (Tombs"   # "Chest (Tombs of Amascut)"
```

### 3. General topic? Use `search-page` (full-text)
```bash
search-page "hydra gear recommendations"
search-page "prayer flicking guide"
search-page "slayer task weights"
```

### 4. Browse via categories (when you don't know titles)
```bash
get-page "Category:Bosses"        # Lists all boss pages
get-page "Category:Slayer monsters"  # Lists all slayer monsters
get-page "Category:Grand Exchange items"  # Lists all GE-tracked items
```

## Redirects

Many pages redirect (e.g., "Abby whip" → "Abyssal whip"). `get-page` follows redirects by default. If you need the redirect target without following, use `followRedirects=false`.

## Disambiguation

Common disambiguation patterns:
- `Item Name (disambiguation)` - rare
- `Item Name (item)` vs `Item Name (monster)` - e.g., "Dragon (item)" vs "Dragon (monster)"
- Use `search-page` to find the correct variant

## Page Structure by Type

| Page Type | Key Sections |
|-----------|--------------|
| **Items** | Infobox (stats), Obtaining, Usage, Changes |
| **Monsters** | Infobox (stats), Drops, Strategies, Locations |
| **Bosses** | Infobox, Mechanics, Strategies, Drops, Hard mode |
| **Quests** | Infobox, Requirements, Walkthrough, Rewards, Quick guide |
| **Locations** | Map, Features, NPCs, Monsters, Shops |
| **Raids** | Overview, Entry requirements, Rooms/Bosses, Rewards, Strategies |

## Infobox Fields (Semantic Data → Use Buckets)

Most structured data lives in infoboxes and is available via buckets:
- Items → `bucket("infobox_item")` or `bucket("exchange")`
- Monsters → `bucket("infobox_monster")`
- Shops → `bucket("infobox_shop")`
- NPCs → `bucket("infobox_npc")`

## Quick Reference: Common Prefixes

| Looking for... | Try prefix search |
|----------------|-------------------|
| Weapon variants | `search-page-by-prefix "Dragon "` |
| Armour sets | `search-page-by-prefix "Bandos "` |
| Potions | `search-page-by-prefix "Prayer "` |
| Bosses | `search-page-by-prefix "Phantom "` |
| Quests | `search-page-by-prefix "Recipe for "` |