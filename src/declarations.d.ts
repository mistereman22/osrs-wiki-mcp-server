// Type declarations for @professional-wiki/mediawiki-mcp-server
declare module '@professional-wiki/mediawiki-mcp-server/dist/runtime/logger.js' {
	export const logger: {
		info: (msg: string) => void;
		error: (msg: string) => void;
		warn: (msg: string) => void;
		debug: (msg: string) => void;
	};
}

declare module '@professional-wiki/mediawiki-mcp-server/dist/runtime/shutdown.js' {
	export function registerShutdownHandlers(options: {
		transport: string;
		graceMs: number;
		stdioTransport: unknown;
	}): void;
}

declare module '@professional-wiki/mediawiki-mcp-server/dist/runtime/reconcile.js' {
	export function reconcileTools(
		tools: Map<string, unknown>,
		options: {
			wikiRegistry: unknown;
			transport: string;
			wikiProbe: unknown;
			extensionPacks: unknown;
			descriptors: unknown;
		}
	): void;
}

declare module '@professional-wiki/mediawiki-mcp-server/dist/tools/index.js' {
	export const allTools: unknown[];
	export function registerAllTools(
		server: unknown,
		reconcile: () => Promise<void>,
		ctx: unknown
	): Map<string, unknown>;
}

declare module '@professional-wiki/mediawiki-mcp-server/dist/tools/extensions/index.js' {
	export const extensionPacks: unknown;
}

declare module '@professional-wiki/mediawiki-mcp-server/dist/wikis/state.js' {
	export function createAppState(config: Record<string, unknown>): unknown;
}

declare module '@professional-wiki/mediawiki-mcp-server/dist/runtime/createContext.js' {
	export function createSharedContext(options: {
		logger: unknown;
		state: unknown;
		auth: unknown;
		metrics: unknown;
	}): unknown;
}

declare module '@professional-wiki/mediawiki-mcp-server/dist/runtime/authShape.js' {
	export function readAuthPolicy(
		env: Record<string, string | undefined>,
		transport: string,
		uploadDir: string | null,
		signIn: unknown
	): unknown;
}

declare module '@professional-wiki/mediawiki-mcp-server/dist/auth/stdioSignIn.js' {
	export class StdioSignIn {}
}

declare module '@professional-wiki/mediawiki-mcp-server/dist/runtime/metrics.js' {
	export function readMetrics(env: Record<string, string | undefined>, transport: string): unknown;
}