import type { Endpoints } from '@octokit/types';
import type { AppLoadContext } from '@remix-run/cloudflare';

export const metadata = {
	repo: 'remix-cloudflare-template',
	owner: 'edmundhung',
};

export function getHeaders(auth: string | undefined) {
	const headers = new Headers({
		Accept: 'application/vnd.github+json',
		'User-Agent': 'Conform Guide',
	});

	if (auth) {
		headers.set('Authorization', `Bearer ${auth}`);
	}

	return headers;
}

export async function getFileContent(options: {
	auth?: string;
	ref?: string;
	path: string;
	owner: string;
	repo: string;
}): Promise<string> {
	const searchParams = new URLSearchParams();

	if (options.ref) {
		searchParams.set('ref', options.ref);
	}

	const url = `https://api.github.com/repos/${options.owner}/${options.repo}/contents/${options.path}?${searchParams}`;
	const resposne = await fetch(url, {
		headers: getHeaders(options.auth),
	});

	if (resposne.status === 404) {
		throw resposne;
	}

	const file: Endpoints['GET /repos/{owner}/{repo}/contents/{path}']['response']['data'] =
		await resposne.json();

	if (Array.isArray(file) || file.type !== 'file') {
		throw new Response('Not found', { status: 404 });
	}

	return atob(file.content);
}

export async function getFileContentWithCache(
	context: AppLoadContext,
	path: string,
): Promise<string> {
	const key = `github/${path}`;
	const cache = await context.env.CACHE.get(key);

	if (cache) {
		return cache;
	}

	const content = await getFileContent({
		auth: context.env.GITHUB_TOKEN,
		owner: metadata.owner,
		repo: metadata.repo,
		path,
	});

	// Update the cache
	// TODO: Use `waitUntil` to update the cache in the background
	await context.env.CACHE.put(key, content, { expirationTtl: 60 * 60 });

	return content;
}