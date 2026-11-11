import { reconcileTools } from '@professional-wiki/mediawiki-mcp-server/dist/runtime/reconcile.js';
import {
	allTools,
	registerAllTools,
} from '@professional-wiki/mediawiki-mcp-server/dist/tools/index.js';
import { extensionPacks } from '@professional-wiki/mediawiki-mcp-server/dist/tools/extensions/index.js';

import { textResult } from './external.js';

interface ToolRegistryResult {
	tools: Map<string, unknown>;
	applyGates: () => Promise<void>;
	reconcile: () => Promise<void>;
}

/**
 * Two independent sliding-window rate limiters (package-owned constants).
 * wikiLimiter: per MediaWiki tool call at registration seam.
 * externalLimiter: per HTTP request via callHttp.
 * Over budget: waits up to 10s, then fails with RateLimitError.
 */

const WINDOW_MS = 60_000;
const MAX_WAIT_MS = 10_000;
const WIKI_MAX_REQUESTS = 30;
const EXTERNAL_MAX_REQUESTS = 30;

export class RateLimitError extends Error {}

function sleep(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

class SlidingWindowLimiter {
	private readonly maxRequests: number;
	private readonly windowMs: number;
	private readonly maxWaitMs: number;
	private readonly label: string;
	private readonly stamps: number[] = [];

	constructor(maxRequests: number, windowMs: number, maxWaitMs: number, label: string) {
		this.maxRequests = maxRequests;
		this.windowMs = windowMs;
		this.maxWaitMs = maxWaitMs;
		this.label = label;
	}

	#prune(now: number): void {
		while (this.stamps.length > 0 && this.stamps[0] + this.windowMs <= now) {
			this.stamps.shift();
		}
	}

	async acquire(): Promise<void> {
		for (;;) {
			const now = Date.now();
			this.#prune(now);
			if (this.stamps.length < this.maxRequests) {
				this.stamps.push(now);
				return;
			}
			const waitMs = this.stamps[0] + this.windowMs - now + 1;
			if (waitMs > this.maxWaitMs) {
				throw new RateLimitError(
					`${this.label} rate limit reached ` +
						`(${this.maxRequests} requests per ${Math.round(this.windowMs / 1000)}s). ` +
						`Retry in ~${Math.ceil(waitMs / 1000)}s.`,
				);
			}
			await sleep(waitMs);
		}
	}
}

const wikiLimiter = new SlidingWindowLimiter(
	WIKI_MAX_REQUESTS,
	WINDOW_MS,
	MAX_WAIT_MS,
	'MediaWiki API',
);

export const externalLimiter = new SlidingWindowLimiter(
	EXTERNAL_MAX_REQUESTS,
	WINDOW_MS,
	MAX_WAIT_MS,
	'External API',
);

function createToolRegistry(
	server: { registerTool: (name: string, config: unknown, callback?: (...args: unknown[]) => Promise<unknown>) => unknown },
	ctx: { wikis: unknown; auth: { transport: string }; wikiProbe: unknown },
): ToolRegistryResult {
	const tools = new Map<string, unknown>();

	const applyGates = () =>
		reconcileTools(tools, {
			wikiRegistry: ctx.wikis,
			transport: ctx.auth.transport,
			wikiProbe: ctx.wikiProbe,
			extensionPacks,
			descriptors: allTools,
		});

	// Extension probes can flip tools after initial gate; re-gate and notify.
	const reconcile = (): Promise<void> => {
		const promise = (async (): Promise<void> => {
			await applyGates();
			await (server as { sendResourceListChanged?: () => Promise<void> }).sendResourceListChanged?.();
		})();
		return promise;
	};

	// Rate-limit each upstream MediaWiki tool call at registration seam.
	// Must wrap before upstream's register() collects RegisteredTool objects.
	const baseRegisterTool = server.registerTool.bind(server);
	server.registerTool = (name: string, config: unknown, callback?: (...args: unknown[]) => Promise<unknown>) => {
		if (typeof callback !== 'function') {
			return baseRegisterTool(name, config);
		}
		return baseRegisterTool(name, config, async (...callbackArgs: unknown[]) => {
			try {
				await wikiLimiter.acquire();
			} catch (error) {
				if (error instanceof RateLimitError) {
					return textResult(error.message, true);
				}
				throw error;
			}
			return callback(...callbackArgs);
		});
	};

	const registered = registerAllTools(server, reconcile, ctx);
	server.registerTool = baseRegisterTool;
	for (const [name, tool] of registered) {
		tools.set(name, tool);
	}

	return { tools, applyGates, reconcile } as ToolRegistryResult;
}

import { USER_AGENT } from './env.js';

export const SERVER_NAME = 'osrs-wiki-mcp-server';
export const SERVER_VERSION = '1.0.0';
const SERVER_TITLE = 'OSRS Wiki MCP Server';
const SERVER_DESCRIPTION = 'MCP server for the Old School RuneScape Wiki: the full MediaWiki MCP tool surface against a pinned read-only wiki.';
const BASE_USER_AGENT = `osrs-wiki-mcp-server/1.0.0 (https://github.com/mistereman22/osrs-wiki-mcp-server)`;

const OSRS_WIKI = Object.freeze({
	key: 'oldschool.runescape.wiki',
	sitename: 'Old School RuneScape Wiki',
	server: 'https://oldschool.runescape.wiki',
	articlepath: '/wiki',
	scriptpath: '',
});

// Cache hint: lists change only when wiki probe flips; don't share across deployments.
const CACHE_HINT = { ttlMs: 60_000, cacheScope: 'private' as const };

const SERVER_INSTRUCTIONS = [
	'Tools and resources for the Old School RuneScape Wiki at ' + OSRS_WIKI.server + ', served by ' + SERVER_NAME + '.',
	'The wiki target is fixed by the package: no tool can add, remove, or switch wikis.',
	'Deployment is read-only and anonymous. Outbound calls use User-Agent `' + BASE_USER_AGENT + ' <MCP_CONTACT>\`.',
	'MediaWiki tools follow upstream behavior from @professional-wiki/mediawiki-mcp-server.',
	'',
	'TOOL SELECTION — DECIDE FIRST, THEN READ THE RELEVANT RESOURCE:',
	'',
	'| If the user asks for... | Use this tool | Read this resource first |',
	'|-------------------------|---------------|--------------------------|',
	'| Structured data: item stats, GE metadata, monster stats, drop rates, quest requirements, gear recommendations, varbits, shop info | bucket-query | context://bucket-catalog (find bucket + fields), then context://bucket-query-guide (usage patterns) |',
	'| **Rendered values (live GE price, alch values, drop values)** | parse-wikitext | context://template-reference (verified templates with inputs/returns) |',
	'| Canonical lists: all bosses, all quests, all items, all updates, all monsters in category | get-category-members | context://namespace-category-guide (category structure, namespace IDs) |',
	'| Pages in a custom namespace (e.g., Update: game updates) | get-site-info + get-category-members | context://namespace-category-guide (DPL/template discovery workflow) |',
	'| Unstructured content: lore, mechanics, walkthroughs, guides | search-page / get-page | context://search-guide (broad-first, canonical page heuristic) |',
	'| Exact page title known | get-page | context://search-guide (section discovery) |',
	'| Backlinks / transclusions / file usage | get-links-here | context://namespace-category-guide |',
	'',
	'START HERE: Read context://tool-selection first for the complete decision tree and quick patterns.',
	'',
	'MANDATORY: Read the relevant resource BEFORE using each tool:',
	'',
	'For search-page, search-page-by-prefix:',
	'  1. context://search-guide — tool selection, broad-first search, canonical page heuristic, rate limits',
	'',
	'For get-page:',
	'  1. context://search-guide — section discovery via metadata=true + section=N',
	'',
	'For get-category-members, get-site-info, get-links-here:',
	'  1. context://namespace-category-guide — category structure, namespace IDs, DPL/template discovery workflow',
	'',
	'For bucket-query:',
	'  1. context://bucket-catalog — find correct bucket name and fields (costs no API traffic)',
	'  2. context://bucket-query-guide — mandatory best practices, exact-match rules, common patterns, limitations',
	'',
	'For parse-wikitext (rendered values like live GE prices):',
	'  1. context://template-reference — verified data-retrieval templates with inputs and returns',
	'',
	'PREFER TEMPLATES OVER BARE #invoke: Call templates like {{GEPrice|<item>}} rather than {{#invoke:Exchange|...}} — templates handle argument parsing; bare #invoke requires frame:getParent().args and is error-prone.',
	'',
	'VIEW-PAGE RULE: If get-page returns source that is mostly {{...}} transclusions (transclusion soup), do NOT parse the raw wikitext — render it with parse-wikitext instead.',
	'',
	'SIZE CHECK: Before fetching full page content, call get-page "<title>" metadata=true. If page size >75KB, use section-based reading (section=N) instead of full fetch.',
	'',
	'DO NOT search Template: or Module: namespaces unless you are explicitly looking for template/module documentation — these contain plumbing, not data.',
	'',
	'FIELD SEMANTICS: A bucket field named "value" is the item static Value stat (from the infobox), NOT its live GE price. When a value looks wrong, render the canonical page (parse-wikitext "{{GEPrice|<item>}}" or get-page "Exchange:<item>") and match the number to its labeled row.',
	'',
	'Check context://bucket-catalog for field names before querying — all known buckets are listed there. Only fetch Bucket:<name> schema if the bucket is not listed or you need type info.',
	'',
	'CRITICAL: ALWAYS use .select() and .where() in bucket-query. NEVER run unfiltered queries - they return thousands of rows, bloat context, and strain the wiki. ALWAYS use .select("field1","field2") to limit columns and .where("field","value") to filter rows. Use .limit(N) for pagination.',
	'bucket-query uses EXACT MATCH ONLY - no wildcards. To find exact values: 1) search-page for the term, 2) use exact result in bucket-query. Example: "Bob\'s Axe Shop" -> search-page "bob axe" -> gets "Bob\'s Brilliant Axes" -> bucket("infobox_shop").where("shop_name","Bob\'s Brilliant Axes")',
	'If a bucket query returns 0 rows: FIRST suspect name variant (e.g., "Obligator (uncharged)" vs "Obligator"), THEN check field names in context://bucket-catalog. If a value looks wrong, render the canonical page and match the number to its labeled row.',
	'Common bucket-query patterns (ALWAYS include .select() and .where()):',
	'  * Gear -> bucket("recommended_equipment").select("item","slot").where("activity","hydra").run()',
	'  * GE metadata -> bucket("exchange").select("name","value","high_alch").where("name","Abyssal whip").run() (value = static Value stat)',
	'  * LIVE GE price -> parse-wikitext "{{GEPrice|<exact item name>}}" (see context://template-reference)',
	'  * Monster stats -> bucket("infobox_monster").select("name","combat_level","hitpoints").where("name","Hydra").run()',
	'  * Item stats -> bucket("infobox_item").select("item_name","value","high_alch").where("item_name","Abyssal whip").run()',
	'  * Drop sources for an item -> bucket("dropsline").select("item_name","drop_json").where("item_name","Abyssal whip").run() (drop_json contains "Dropped from" as JSON text)',
	'  * What drops from a source (boss/chest/activity) -> bucket CANNOT do this; use get-page on the source page directly (see context://bucket-query-guide for patterns)',
	'  * Money making at a boss/method -> search-page "money making <boss>" -> get-page "Money making guide/..." (bucket not queryable by method name)',
	'  * Quest requirements -> parse-wikitext "{{Questreq|<quest>|quests}}" + "{{Questreq|<quest>|skills}}" (or get-page on the quest page)',
	'  * Varbits -> bucket("varbit").select("name","value").where("name","hydra_task").run()',
	'  * Shop lookup -> bucket("infobox_shop").select("shop_name","location","owner").where("shop_name","Bob\'s Brilliant Axes").run()',
	'Use page reads (\'get-page\', \'search-page\') ONLY for unstructured content: lore, mechanics, walkthroughs.',
	'For large pages: first call get-page with metadata=true to get section outline, then fetch only the relevant section with section=N. Avoid full-page reads.',
	'Outbound traffic is rate-limited; calls over budget wait or return rate-limit error.',
].join(' ');

function buildWikiConfig(): Record<string, unknown> {
	return {
		defaultWiki: OSRS_WIKI.key,
		allowWikiManagement: false,
		uploadDirs: [],
		wikis: {
			[OSRS_WIKI.key]: {
				sitename: OSRS_WIKI.sitename,
				server: OSRS_WIKI.server,
				articlepath: OSRS_WIKI.articlepath,
				scriptpath: OSRS_WIKI.scriptpath,
				readOnly: true,
				token: null,
				private: false,
			},
		},
	};
}

/**
 * Assembles the MCP server: upstream MediaWiki tools wired to pinned OSRS wiki.
 */
import './env.js';

import { McpServer } from '@modelcontextprotocol/server';
import { createAppState } from '@professional-wiki/mediawiki-mcp-server/dist/wikis/state.js';
import { createSharedContext } from '@professional-wiki/mediawiki-mcp-server/dist/runtime/createContext.js';
import { logger } from '@professional-wiki/mediawiki-mcp-server/dist/runtime/logger.js';
import { readAuthPolicy } from '@professional-wiki/mediawiki-mcp-server/dist/runtime/authShape.js';
import { StdioSignIn } from '@professional-wiki/mediawiki-mcp-server/dist/auth/stdioSignIn.js';
import { readMetrics } from '@professional-wiki/mediawiki-mcp-server/dist/runtime/metrics.js';

import { registerResources } from './resources.js';
import { registerExternalApiTools } from './external.js';

export async function buildServer(): Promise<McpServer> {
	logger.info(
		`${SERVER_NAME} ${SERVER_VERSION} starting - wiki ${OSRS_WIKI.server}, ` +
			`read-only, user agent ${JSON.stringify(USER_AGENT)}`,
	);

	const state = createAppState(buildWikiConfig());
	const auth = readAuthPolicy(process.env, 'stdio', null, new StdioSignIn());
	const ctx = createSharedContext({
		logger,
		state,
		auth,
		metrics: readMetrics(process.env, 'stdio'),
	});

	const server = new McpServer(
		{
			name: SERVER_NAME,
			title: SERVER_TITLE,
			version: SERVER_VERSION,
			description: SERVER_DESCRIPTION,
		},
		{
			capabilities: {
				resources: { listChanged: true },
				tools: { listChanged: true },
			},
			instructions: SERVER_INSTRUCTIONS,
			cacheHints: {
				'tools/list': CACHE_HINT,
				'resources/list': CACHE_HINT,
				'resources/templates/list': CACHE_HINT,
				'resources/read': CACHE_HINT,
				'server/discover': CACHE_HINT,
			},
		},
	);

	const { applyGates } = createToolRegistry(server as { registerTool: (name: string, config: unknown, callback?: (...args: unknown[]) => Promise<unknown>) => unknown }, ctx as { wikis: unknown; auth: { transport: string }; wikiProbe: unknown });
	registerResources(server);

	// Package tools registered outside upstream tool map; never gated.
	registerExternalApiTools(server);

	// Extension-gated tools enabled after initial reconcile once wiki probe completes.
	await applyGates();

	return server;
}