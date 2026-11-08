/**
 * MCP_CONTACT gate + User-Agent composition.
 * Must be imported first - upstream reads MCP_USER_AGENT at module evaluation time.
 */
import process from 'node:process';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const pkg = createRequire(import.meta.url)(fileURLToPath(new URL('../package.json', import.meta.url))) as {
	version?: string;
	description?: string;
	repository?: { url?: string };
};

const SERVER_NAME = 'osrs-wiki-mcp-server';
const SERVER_VERSION = pkg.version ?? '1.0.0';
const SERVER_REPO =
	typeof pkg.repository?.url === 'string'
		? pkg.repository.url.replace(/^git\+/, '').replace(/\.git$/, '')
		: 'https://github.com/mistereman22/osrs-wiki-mcp-server';
const BASE_USER_AGENT = `${SERVER_NAME}/${SERVER_VERSION} (${SERVER_REPO})`;

export const CONTACT = process.env.MCP_CONTACT?.trim();

if (!CONTACT) {
	console.error(
		'[osrs-wiki-mcp-server] MCP_CONTACT is required but not set.\n' +
			'Your contact is appended to the server User-Agent so anyone\n' +
			'seeing our requests can reach you, e.g.\n' +
			'  MCP_CONTACT="you@example.com"\n' +
			`Base User-Agent: ${BASE_USER_AGENT}\n` +
			`Repository: ${SERVER_REPO}`,
	);
	process.exit(1);
}

export const USER_AGENT = `${BASE_USER_AGENT} ${CONTACT}`;

// Upstream reads MCP_USER_AGENT at import time - set it before other imports load.
process.env.MCP_USER_AGENT = USER_AGENT;