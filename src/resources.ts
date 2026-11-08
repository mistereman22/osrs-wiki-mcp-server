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
		name: 'bucket-index',
		uri: 'context://bucket-index',
		file: fileURLToPath(new URL('../../resources/bucket-index.md', import.meta.url)),
		title: 'Bucket Index',
		description:
			'Curated hint list of known Bucket buckets on the OSRS wiki (names, query forms, purposes). Not authoritative - if nothing matches, fall back to discovery via search-page-by-prefix in the Bucket: namespace.',
		mimeType: 'text/markdown',
	},
	// Add more resources here:
	// {
	// 	name: 'my-resource',
	// 	uri: 'context://my-resource',
	// 	file: fileURLToPath(new URL('../../resources/my-file.txt', import.meta.url)),
	// 	title: 'My Resource',
	// 	description: 'Description for the model',
	// 	mimeType: 'text/plain',
	// },
];

import type { McpServer } from '@modelcontextprotocol/server';

export function registerResources(server: McpServer): void {
	for (const resource of RESOURCES) {
		server.registerResource(
			resource.name,
			resource.uri,
			{
				title: resource.title,
				description: resource.description,
				mimeType: resource.mimeType,
			},
			async (uri: string | URL) => {
				const text = await readFile(resource.file, 'utf8');
				const href = typeof uri === 'string' ? uri : uri.href;
				return {
					contents: [{ uri: href, mimeType: resource.mimeType, text }],
				};
			},
		);
	}
}