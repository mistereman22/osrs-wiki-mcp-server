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
	`Tools and resources for the Old School RuneScape Wiki at ${OSRS_WIKI.server}, served by ${SERVER_NAME}.`,
	'The wiki target is fixed by the package: no tool can add, remove, or switch wikis.',
	`Deployment is read-only and anonymous. Outbound calls use User-Agent \`${BASE_USER_AGENT} <MCP_CONTACT>\`.`,
	'MediaWiki tools follow upstream behavior from @professional-wiki/mediawiki-mcp-server.',
	'For structured data prefer `bucket-query`; use `context://bucket-index` to discover buckets, fall back to runtime discovery.',
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