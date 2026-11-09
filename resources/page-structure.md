# Page Structure Guide

> Page types, key sections, infobox→bucket mapping for `get-page`.

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

| Page Type | Bucket | Key Fields |
|-----------|--------|------------|
| Items | `bucket("infobox_item")` | item_name, item_id, examine, high_alchemy_value, value, weight, buy_limit, is_members_only, tradeable, image, release_date |
| Items (GE) | `bucket("exchange")` | name, value, high_alch, low_alch, buy_volume, sell_volume |
| Monsters | `bucket("infobox_monster")` | name, combat_level, hitpoints, max_hit, slayer_level, slayer_experience, slayer_category, assigned_by, attack/defence bonuses, attack_speed, poisonous, attribute, attack_style, respawn_time, elemental_weakness |
| Shops | `bucket("infobox_shop")` | shop_name, location, owner, specialty, shop_version, is_members_only |
| NPCs | `bucket("infobox_npc")` | id, combat_level, examine |
| Quests | `bucket("quest")` | name, requirements, rewards, difficulty, length, series |
| Spells | `bucket("infobox_spell")` | name, level, rune_cost, effect, description |

**Rule**: If you need infobox data → use the bucket, not the page.

## Redirects

Many pages redirect (e.g., "Abby whip" → "Abyssal whip"). `get-page` follows redirects by default. If you need the redirect target without following, use `followRedirects=false`.

## Disambiguation

Common disambiguation patterns:
- `Item Name (disambiguation)` — rare
- `Item Name (item)` vs `Item Name (monster)` — e.g., "Dragon (item)" vs "Dragon (monster)"
- Use `search-page` to find the correct variant

## Large Page Strategy

For pages with many sections:

1. `get-page "Title" metadata=true` — get section outline
2. Identify needed section number
3. `get-page "Title" section=N` — fetch only that section

Example:
```bash
get-page "Chest (Tombs of Amascut)" metadata=true
# Returns sections: Lead, Rewards, Unique drops, Standard drops, Supply drops
get-page "Chest (Tombs of Amascut)" section=3  # Standard drops
```

## Quick Reference: Common Prefixes

| Looking for... | Try prefix search |
|----------------|-------------------|
| Weapon variants | `search-page-by-prefix "Dragon "` |
| Armour sets | `search-page-by-prefix "Bandos "` |
| Potions | `search-page-by-prefix "Prayer "` |
| Bosses | `search-page-by-prefix "Phantom "` |
| Quests | `search-page-by-prefix "Recipe for "` |