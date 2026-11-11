# Template Reference

Templates are wikitext macros that render values via `parse-wikitext`. Prefer templates over bare `{{#invoke:...}}` — they handle argument parsing and formatting for you.

**How to call**: `parse-wikitext` with wikitext like `{{GEPrice|Abyssal whip}}`. Use `content="html"` if you need rendered HTML; default text output is usually sufficient for values.

**Full list of Lua-backed templates**: `Category:Lua-based templates` (~350 members). Only data-retrieval templates are listed here.

---

## Grand Exchange Prices

All take an item name as the first argument.

| Template | Returns | Example |
|---|---|---|
| `{{GEPrice\|<item>}}` | Live price with commas | `666,162` |
| `{{GEP\|<item>}}` | Live price, raw number (for math) | `666162` |
| `{{GEPT\|<item>}}` | Price after 2% GE tax | `652839` |
| `{{GEDiff\|<item>}}` | Price change since last update | `0` |
| `{{GELimit\|<item>}}` | 4-hour buy limit | `70` |
| `{{GEVolume\|<item>}}` | Daily trade volume | `116` |
| `{{GEId\|<item>}}` | Jagex GE database item ID | `4151` |

**GEPrice extras**: `{{GEPrice|<item>|<multiplier>}}` multiplies the price. `round=N` rounds to N decimal places. `dflt=<value>` returns that instead of erroring for non-GE items.

**GEItem**: `{{GEItem|<item>}}` renders a full HTML table row (price, change, alch values, limit, volume, members, age). Use `content="html"`.

---

## GEInfo — Raw Field Access

`{{GEInfo|<item>|<field>}}` returns a single stored field. Numbers are **not** comma-formatted.

| Field | Returns |
|---|---|
| `itemId` | GE item ID |
| `examine` | Examine text |
| `value` | Static Value stat |
| `limit` | Buy limit |
| `members` | `1` (members) or `0` (F2P) |
| `volume` | Daily trade volume |
| `last` | Previous price |
| `date` | Price timestamp |
| `lastDate` | Previous price timestamp |
| `icon` | Icon filename |
| `hialch` | High alchemy value |
| `lowalch` | Low alchemy value |

**Does NOT work**: `price` (returns empty — use `{{GEPrice}}` or `{{GEP}}` instead).

---

## Alchemy Values

| Template | Returns | Formula |
|---|---|---|
| `{{HA\|<item>}}` | High alch value | `floor(ItemValue × 0.6)` |
| `{{LA\|<item>}}` | Low alch value | `floor(ItemValue × 0.4)` |
| `{{ItemValue\|<item>}}` | Static Value stat | Raw from infobox |

---

## Price Comparison

| Template | Returns |
|---|---|
| `{{MaxPrice\|<item1>\|<item2>\|...}}` | Most expensive item + price |
| `{{MinPrice\|<item1>\|<item2>\|...}}` | Cheapest item + price |

Options: `coins=y/n/f` (format), `link=n/p/plp` (linking), `format=bracket/wikitable/item/price/none`.

---

## Currency Formatting

| Template | Returns | Notes |
|---|---|---|
| `{{Coins\|<amount>}}` | Formatted with coin icon | For wikitables |
| `{{NoCoins\|<amount>}}` | Colored text, no icon | For body text |
| `{{Currency\|<type>\|<amount>}}` | Any currency with image | e.g. `{{Currency\|Tokkul\|1000}}` |

---

## Quest Requirements

| Template | Returns |
|---|---|
| `{{Questreq\|<quest>\|quests}}` | Collapsible list of required quests |
| `{{Questreq\|<quest>\|skills}}` | List of skill/quest point requirements |

Optional third arg: indentation limit. Fourth: `open` to expand by default.

---

## Drop Tables

| Template | Returns |
|---|---|
| `{{Drop sources\|<item>}}` | HTML table of monsters/skilling that drop the item |
| `{{Drop table sources\|<table>}}` | Pages that transclude a given drop table |
| `{{Average drop value\|mob=<monster>}}` | Average value of one kill |

**Average drop value options**: `raw=y` (number only), `round=y` (integer), `alch=y` (use alch values), `category=<cat>` / `exclude=<cat>` (filter by category), `mobname=<text>` (override display name). Sub-versions: `mob=Ankou#Wilderness Slayer Cave`.

---

## Bucket Rendering

| Template | Returns |
|---|---|
| `{{BucketShow\|<bucket>\|<field>\|<args>}}` | Renders a single bucket field as wikitext |

Example: `{{BucketShow|exchange|value|name=Abyssal whip}}` → `120001`.

---

## Player Hiscores

| Template | Returns |
|---|---|
| `{{User hiscores\|name=<player>}}` | Full hiscores table (skills, KC, etc.) |

Options: `api=main/iron/hardcore/ultimate/skiller/pure`, `style=round/sleek`, `virtual=yes/no`, `minxp=<millions>`.

---

## Skill Info Boxes

`{{Skill info|...}}` is a general-purpose skill info box requiring named parameters (`skill1name`, `skill1lvl`, `skill1exp`, `loc`, `tool`, etc.). Skill-specific variants exist: `{{Agility info}}`, `{{Fishing info}}`, `{{Mining info}}`, `{{Woodcutting info}}`, `{{Hunter info}}`, `{{Thieving info}}`, `{{Prayer info}}`, `{{Firemaking info}}`, `{{Slayer info}}`.

These render HTML infoboxes — use `content="html"` and parse the output.

---

## Not Useful for Data Retrieval

- **Citation templates** (`{{CiteNews}}`, `{{CitePoll}}`, etc.) — reference formatting only
- **Infobox templates** (`{{Infobox Item}}`, `{{Infobox Monster}}`) — page construction; read the page source or use buckets instead
- **Formatting templates** (`{{T}}`, `{{,}}`, `{{SCP}}`) — wiki plumbing
- **`{{GEChart}}`**, **`{{ExcgData}}`** — chart rendering, not data values
- **`{{Quest details}}`** — requires named params matching a quest page; not a data lookup

---

## Quick Decision

```
Need a number?        → {{GEP}}, {{GELimit}}, {{GEVolume}}, {{HA}}, {{LA}}, {{ItemValue}}
Need formatted text?  → {{GEPrice}}, {{Coins}}, {{NoCoins}}
Need a specific field?→ {{GEInfo|<item>|<field>}}
Need who drops it?    → {{Drop sources|<item>}}
Need quest reqs?      → {{Questreq|<quest>|quests|skills}}
Need kill value?      → {{Average drop value|mob=<monster>}}
Need compare prices?  → {{MaxPrice|...}} / {{MinPrice|...}}
```
