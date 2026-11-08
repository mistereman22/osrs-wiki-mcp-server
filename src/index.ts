#!/usr/bin/env node
/**
 * MCP server for the Old School RuneScape Wiki.
 * Serves the full MediaWiki tool surface against a pinned, read-only wiki.
 * Transport: stdio (newline-delimited JSON-RPC).
 */

// Must be first: composes User-Agent from MCP_CONTACT before upstream modules
// evaluate it at import time.
import './env.js';

import { serveStdio } from '@modelcontextprotocol/server/stdio';
import { logger } from '@professional-wiki/mediawiki-mcp-server/dist/runtime/logger.js';
import { registerShutdownHandlers } from '@professional-wiki/mediawiki-mcp-server/dist/runtime/shutdown.js';

import { SERVER_NAME, SERVER_VERSION } from './server.js';
import { errorMessage } from './external.js';
import { buildServer } from './server.js';

async function main(): Promise<void> {
	process.on('uncaughtException', (error: unknown) => {
		const stack = error instanceof Error ? error.stack : undefined;
		logger.error(`Uncaught exception: ${stack ?? errorMessage(error)}`);
		process.exit(1);
	});
	process.on('unhandledRejection', (reason: unknown) => {
		logger.error(`Unhandled rejection: ${errorMessage(reason)}`);
	});

	const server = await buildServer();
	logger.info(`${SERVER_NAME} ${SERVER_VERSION} serving over stdio`);

	const handle = serveStdio(() => server, {
		onerror: (error: Error) => logger.error(`stdio serving error: ${error.message}`),
	});
	registerShutdownHandlers({
		transport: 'stdio',
		graceMs: 0,
		stdioTransport: handle,
	});
}

main().catch((error: unknown) => {
	const stack = error instanceof Error ? error.stack : undefined;
	console.error(
		`[${SERVER_NAME}] fatal error:`,
		stack ?? errorMessage(error),
	);
	process.exit(1);
});

export { main };