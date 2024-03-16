import { http } from 'msw';
import { test, expect } from '../playwright';

/**
 * You can interact with browser through the page instance
 */
test('shows the package name', async ({ page }) => {
	await page.goto('/');

	const title = page.getByRole('heading', {
		name: 'remix-cloudflare-template',
		level: 1,
	});

	await expect(title).toBeVisible();
});

/**
 * You can interact with the wrangler binding similar to the remix app
 */
test('cache the README in KV', async ({ page, wrangler }) => {
	await wrangler.env.cache.put('github/README.md', '# cached-readme');
	await page.goto('/');

	const title = page.getByRole('heading', {
		name: 'cached-readme',
		level: 1,
	});

	await expect(title).toBeVisible();
});

/**
 * You can also mock the requests with MSW
 */
test('fetch README from GitHub if not cached', async ({
	page,
	wrangler,
	msw,
}) => {
	// Mock request
	msw.use(
		http.get(
			'https://api.github.com/repos/edmundhung/remix-cloudflare-template/contents/README.md',
			() => {
				return Response.json({
					type: 'file',
					content: btoa('# testing'),
				});
			},
		),
	);

	// Clear cache
	await wrangler.env.cache.delete('github/README.md');

	await page.goto('/');

	const title = page.getByRole('heading', {
		name: 'testing',
		level: 1,
	});

	await expect(title).toBeVisible();
});
