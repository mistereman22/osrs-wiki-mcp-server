/**
 * Generic resource loader - registers all static file resources.
 * Add new resources to the RESOURCES array below.
 */
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

interface ResourceConfig {
	name: string;
	uri: string;
	file: string;
	title: string;
	description: string;
	mimeType: string;
}

const RESOURCES: ResourceConfig[] = [
	{
		name: 'tool-selection',
		uri: 'context://tool-selection',
		file: fileURLToPath(new URL('../../resources/tool-selection.md', import.meta.url)),
		title: 'Tool Selection Guide',
		description:
			'Top-level routing: which tool to use for each question type. Decision tree mapping queries to tools + required resources. Read this FIRST.',
		mimeType: 'text/markdown',
	},
	{
		name: 'bucket-catalog',
		uri: 'context://bucket-catalog',
		file: fileURLToPath(new URL('../../resources/bucket-catalog.md', import.meta.url)),
		title: 'Bucket Catalog',
		description:
			'Complete reference list of all known Bucket buckets on the OSRS Wiki with query names, page titles, and contents. For usage patterns, see bucket-query-guide.',
		mimeType: 'text/markdown',
	},
	{
		name: 'bucket-query-guide',
		uri: 'context://bucket-query-guide',
		file: fileURLToPath(new URL('../../resources/bucket-query-guide.md', import.meta.url)),
		title: 'Bucket Query Guide',
		description:
			'How to use bucket-query effectively: when to use it, mandatory best practices, exact-match rules, common patterns, limitations, and troubleshooting.',
		mimeType: 'text/markdown',
	},
	{
		name: 'namespace-category-guide',
		uri: 'context://namespace-category-guide',
		file: fileURLToPath(new URL('../../resources/namespace-category-guide.md', import.meta.url)),
		title: 'Namespace & Category Guide',
		description:
			'Category structure, namespace IDs, DPL/template discovery workflow for get-category-members, get-site-info, get-links-here. When to use category vs search.',
		mimeType: 'text/markdown',
	},
	{
		name: 'search-guide',
		uri: 'context://search-guide',
		file: fileURLToPath(new URL('../../resources/search-guide.md', import.meta.url)),
		title: 'Search Guide',
		description:
			'Tool selection, broad-first search strategy, canonical page heuristic, section discovery for search-page, search-page-by-prefix, get-page. Includes decision tree and fallback chain.',
		mimeType: 'text/markdown',
	},
	{
		name: 'page-structure',
		uri: 'context://page-structure',
		file: fileURLToPath(new URL('../../resources/page-structure.md', import.meta.url)),
		title: 'Page Structure Guide',
		description:
			'Page types, key sections, infobox-to-bucket mapping for get-page. Redirects, disambiguation, large page strategy, common prefixes.',
		mimeType: 'text/markdown',
	},
];

import type { McpServer } from '@modelcontextprotocol/server';
import { logger } from '@professional-wiki/mediawiki-mcp-server/dist/runtime/logger.js';

export function registerResources(server: McpServer): void {
	for (const resource of RESOURCES) {
		logger.debug(`Registering resource: ${resource.name} -> ${resource.file}`);
		server.registerResource(
			resource.name,
			resource.uri,
			{
				title: resource.title,
				description: resource.description,
				mimeType: resource.mimeType,
			},
			async (uri: string | URL) => {
				try {
					const text = await readFile(resource.file, 'utf8');
					const href = typeof uri === 'string' ? uri : uri.href;
					return {
						contents: [{ uri: href, mimeType: resource.mimeType, text }],
					};
				} catch (error) {
					logger.error(`Failed to read resource ${resource.name} from ${resource.file}: ${error instanceof Error ? error.message : String(error)}`);
					throw error;
				}
			},
		);
	}
}