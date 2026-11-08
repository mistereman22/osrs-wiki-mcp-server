# @mistereman22/osrs-wiki-mcp-server

MCP server for the Old School RuneScape Wiki (`https://oldschool.runescape.wiki`). Serves the full tool surface of [`@professional-wiki/mediawiki-mcp-server`](https://github.com/ProfessionalWiki/MediaWiki-MCP-Server) against a pinned, read-only wiki definition.

```
Client (Claude Code / OpenCode / Cursor)
        |  MCP over stdio
        v
src/index.js (server name "osrs-wiki-mcp-server")
        |-- upstream MediaWiki tools -> OSRS wiki API (read-only)
```

## What you get

| Capability | Details |
| --- | --- |
| MediaWiki tools | Full upstream tool surface (page reads, search, watchlists, siteinfo, ...) with wiki fixed to `oldschool.runescape.wiki`. Write and wiki-management tools gated off (`readOnly: true`, `allowWikiManagement: false`). |
| `context://bucket-index` | On-demand hint list of known Bucket buckets for `bucket-query`; read fresh per request with runtime discovery as fallback. |

## Requirements

- **Node.js >= 22.19.0** (required by upstream `undici` dependency)
- `npm install` in this directory

## Configuration

| Variable | Required | Meaning |
| --- | --- | --- |
| `MCP_CONTACT` | **Yes** | Your contact (email or name + URL), appended to the server's base User-Agent on every OSRS wiki request. Example: `you@example.com`. Server fails fast at startup if missing. |

No config file, no wiki selection - the target (`oldschool.runescape.wiki`, article path `/wiki`, anonymous, read-only) is part of the package.

## Run directly (any MCP client)

```sh
npm install
MCP_CONTACT="you@example.com" node src/index.js
```

Composed User-Agent:
```
osrs-wiki-mcp-server/1.0.0 (https://github.com/mistereman22/osrs-wiki-mcp-server) you@example.com
```

## OpenCode

Add to global config (`~/.config/opencode/opencode.json`):

```json
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "servers": {
      "osrs-wiki": {
        "type": "local",
        "command": ["npx", "@mistereman22/osrs-wiki-mcp-server"],
        "environment": { "MCP_CONTACT": "you@example.com" }
      }
    }
  }
}
```

Or via CLI:
```sh
opencode mcp add --global osrs-wiki \
  --env MCP_CONTACT="you@example.com" \
  -- npx @mistereman22/osrs-wiki-mcp-server
```

## Cursor

Create `~/.cursor/mcp.json` (user) or `.cursor/mcp.json` (project):

```json
{
  "mcpServers": {
    "osrs-wiki": {
      "command": "npx",
      "args": ["@mistereman22/osrs-wiki-mcp-server"],
      "env": { "MCP_CONTACT": "you@example.com" }
    }
  }
}
```

## Claude Code (marketplace)

```sh
/plugin marketplace add mistereman22/osrs-wiki-mcp-server
/plugin install osrs-wiki-mcp-server@osrs-wiki-mcp-server
```

On install, Claude Code prompts for `MCP_CONTACT` and injects it automatically.

## Rate limits

Two independent sliding-window budgets (tuned in `src/rateLimit.js`):

| Surface | Budget | Counted per |
| --- | --- | --- |
| MediaWiki API | 30 requests / 60 s | each upstream tool call |
| External APIs | 30 requests / 60 s | each HTTP request by external API tool |

Over budget: waits up to 10s for a slot, then returns rate-limit error with retry hint.

## Lifecycle

- Wiki identity probed lazily via siteinfo; extension-gated tools enabled after initial reconcile
- Read-only rule permanently removes write tools from `tools/list`
- `SIGINT`/`SIGTERM` drain in-flight work, close stdio, exit cleanly
- Startup fails fast if `MCP_CONTACT` unset

## Repository layout

```
.
+-- src/
|   +-- index.js          # Entry point: env gate, stdio transport, lifecycle
|   +-- env.js            # MCP_CONTACT fail-fast gate + User-Agent composition
|   +-- meta.js           # Package identity (name, version, repo, base User-Agent)
|   +-- rateLimit.js      # Sliding-window budgets for both surfaces
|   +-- server.js         # McpServer assembly + tool gating + wiki config
|   +-- resources.js      # Generic resource loader (bucket-index)
|   +-- tools/
|       +-- external.js   # HTTP utilities (callHttp) for future external APIs
+-- resources/
|   +-- bucket-index.md   # Bucket hint list for context://bucket-index
+-- .claude-plugin/
|   +-- marketplace.json  # Claude Code marketplace manifest
+-- package.json
+-- opencode.json         # OpenCode config example
+-- README.md
+-- LICENSE
```

## Contact

Base User-Agent in every request points here:
- Maintainer: [github.com/mistereman22](https://github.com/mistereman22)
- Issues: [github.com/mistereman22/osrs-wiki-mcp-server/issues](https://github.com/mistereman22/osrs-wiki-mcp-server/issues)

## License

[MIT](LICENSE)