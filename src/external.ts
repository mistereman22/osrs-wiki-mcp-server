/**
 * HTTP utilities for external API tools (rate-limited, fixed User-Agent, https-only).
 * Add tools to API_TOOLS array below; each uses callHttp internally.
 */
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

import { externalLimiter, RateLimitError } from './server.js';
import { USER_AGENT } from './env.js';

const HTTP_TIMEOUT_MS = 30_000;
const HTTP_MIN_TIMEOUT_MS = 1_000;
const HTTP_MAX_TIMEOUT_MS = 300_000;
const HTTP_MAX_BODY_BYTES = 5 * 1024 * 1024;
const HTTP_MAX_BODY_CHARS = 100_000;

export class HttpToolError extends Error {}

interface CallHttpResult {
	status: number;
	statusText: string;
	finalUrl: string;
	elapsedMs: number;
	headerLines: string[];
	body: string;
	truncated: boolean;
	shownBody: string;
}

interface CallHttpRequest {
	url: unknown;
	method?: string;
	headers?: Record<string, string>;
	params?: Record<string, unknown>;
	data?: unknown;
	timeout_ms?: number;
}

export function errorMessage(error: unknown): string {
	if (error instanceof Error) return error.message;
	return String(error);
}

export function textResult(text: string, isError = false): { content: { type: 'text'; text: string }[]; isError: boolean } {
	return { content: [{ type: 'text', text }], isError };
}

function normalizeTimeout(raw: unknown): number {
	if (raw === undefined || raw === null) return HTTP_TIMEOUT_MS;
	const parsed = Number(raw);
	if (!Number.isFinite(parsed)) return HTTP_TIMEOUT_MS;
	return Math.min(Math.max(parsed, HTTP_MIN_TIMEOUT_MS), HTTP_MAX_TIMEOUT_MS);
}

function normalizeBody(raw: unknown): { data?: string; jsonBody: boolean } {
	if (raw === undefined || raw === null) return { jsonBody: false };
	if (typeof raw === 'object') return { data: JSON.stringify(raw), jsonBody: true };
	if (typeof raw === 'string') return { data: raw, jsonBody: false };
	return { data: String(raw), jsonBody: true };
}

function parseHttpUrl(rawUrl: unknown): string {
	const trimmed = typeof rawUrl === 'string' ? rawUrl.trim() : '';
	if (trimmed === '') throw new HttpToolError('Missing required argument: "url".');
	let parsed: URL;
	try {
		parsed = new URL(trimmed);
	} catch {
		throw new HttpToolError(`Invalid URL: ${trimmed}`);
	}
	if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
		throw new HttpToolError(
			`Unsupported protocol "${parsed.protocol}" in ${trimmed}. Only http: and https: allowed.`,
		);
	}
	return trimmed;
}

function hasHeader(headers: Record<string, string>, name: string): boolean {
	return Object.keys(headers).some((key) => key.toLowerCase() === name);
}

export async function callHttp(request: CallHttpRequest): Promise<CallHttpResult> {
	const url = parseHttpUrl(request.url);
	try {
		await externalLimiter.acquire();
	} catch (error: unknown) {
		if (error instanceof RateLimitError) {
			throw new HttpToolError(error.message);
		}
		throw error;
	}
	const method = request.method ?? 'GET';
	const headers = { ...(request.headers ?? {}) };
	if (!hasHeader(headers, 'user-agent')) {
		headers['user-agent'] = USER_AGENT;
	}
	const params = { ...(request.params ?? {}) };
	const { data, jsonBody } = normalizeBody(request.data);
	if (jsonBody && !hasHeader(headers, 'content-type')) {
		headers['content-type'] = 'application/json';
	}
	const timeout = normalizeTimeout(request.timeout_ms);

	const startedAt = Date.now();
	let response: AxiosResponse<string>;
	try {
		response = await axios.request({
			url,
			method,
			headers,
			params,
			data,
			timeout,
			maxRedirects: 5,
			maxContentLength: HTTP_MAX_BODY_BYTES,
			responseType: 'text',
			validateStatus: () => true,
			transformResponse: [(body) => body],
		} as AxiosRequestConfig);
	} catch (error: unknown) {
		const axiosError = error as { code?: string };
		const code = typeof axiosError.code === 'string' ? `${axiosError.code}: ` : '';
		throw new HttpToolError(
			`Request to ${url} failed - ${code}${errorMessage(error)}`,
		);
	}
	const elapsedMs = Date.now() - startedAt;
	const body =
		typeof response.data === 'string'
			? response.data
			: response.data === undefined || response.data === null
				? ''
				: String(response.data);
	const truncated = body.length > HTTP_MAX_BODY_CHARS;
	const shownBody = truncated ? body.slice(0, HTTP_MAX_BODY_CHARS) : body;

	const headerLines: string[] = [];
	for (const [key, value] of Object.entries(response.headers ?? {})) {
		headerLines.push(
			`  ${key}: ${Array.isArray(value) ? value.join(', ') : String(value)}`,
		);
	}
	const finalUrl =
		response.request?.res?.responseUrl ??
		response.request?.responseURL ??
		url;

	return {
		status: response.status,
		statusText: response.statusText ?? '',
		finalUrl,
		elapsedMs,
		headerLines,
		body,
		truncated,
		shownBody,
	};
}

export function formatHttpResponse(result: CallHttpResult): string {
	const sections = [
		`Status: ${result.status} ${result.statusText}`.trimEnd(),
		`Final URL: ${result.finalUrl}`,
		`Elapsed: ${result.elapsedMs}ms`,
		`Response headers:\n${result.headerLines.length > 0 ? result.headerLines.join('\n') : '  (none)'}`,
		result.truncated
			? `Body (${result.body.length} characters, truncated to ${HTTP_MAX_BODY_CHARS}):\n${result.shownBody}`
			: `Body:\n${result.shownBody === '' ? '(empty)' : result.shownBody}`,
	];
	return sections.join('\n\n');
}

interface ApiTool {
	name: string;
	title?: string;
	description: string;
	inputSchema: any;
	annotations?: Record<string, unknown>;
	call: (args: unknown) => Promise<{ content: { type: 'text'; text: string }[]; isError: boolean }>;
}

export const API_TOOLS: ApiTool[] = [
	// ▸▸▸ EXTERNAL API TOOL DEFINITIONS GO HERE ◂◂◂
];

import type { McpServer } from '@modelcontextprotocol/server';

export function registerExternalApiTools(server: McpServer): void {
	for (const tool of API_TOOLS) {
		server.registerTool(
			tool.name,
			{
				title: tool.title ?? tool.name,
				description: tool.description,
				inputSchema: tool.inputSchema,
				...(tool.annotations ? { annotations: tool.annotations } : {}),
			},
			tool.call,
		);
	}
}