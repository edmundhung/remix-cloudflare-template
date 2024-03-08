import { test as baseTest, expect as baseExpect } from '@playwright/test';
import { type ViteDevServer, createServer } from 'vite';
import { type SetupServer, setupServer } from 'msw/node';
import { type PlatformProxy, getPlatformProxy } from 'wrangler';

interface TestFixtures {}

interface WorkerFixtures {
	port: number;
	wrangler: PlatformProxy<Env>;
	server: ViteDevServer;
	msw: SetupServer;
}

export async function clearKV(namespace: KVNamespace): Promise<void> {
	const result = await namespace.list();

	await Promise.all(result.keys.map(key => namespace.delete(key.name)));
}

export const expect = baseExpect.extend({});

export const test = baseTest.extend<TestFixtures, WorkerFixtures>({
	// Assign a unique "port" for each worker process
	port: [
		// eslint-disable-next-line no-empty-pattern
		async ({}, use, workerInfo) => {
			await use(3515 + workerInfo.workerIndex);
		},
		{ scope: 'worker' },
	],

	// Ensure visits works with relative path
	baseURL: ({ port }, use) => {
		use(`http://localhost:${port}`);
	},

	// Start a Vite dev server for each worker
	// This allows MSW to intercept requests properly
	server: [
		async ({ port }, use) => {
			const server = await createServer({
				configFile: './vite.config.ts',
			});

			await server.listen(port);

			await use(server);

			await server.close();
		},
		{ scope: 'worker', auto: true },
	],

	msw: [
		// eslint-disable-next-line no-empty-pattern
		async ({}, use) => {
			const server = setupServer();

			server.listen();

			await use(server);

			server.close();
		},
		{ scope: 'worker', auto: true },
	],

	// To access wrangler bindings similar to Remix / Vite
	wrangler: [
		// eslint-disable-next-line no-empty-pattern
		async ({}, use) => {
			const wrangler = await getPlatformProxy<Env>();

			// To access bindings in the tests.
			await use(wrangler);

			// Ensure all cachees are cleaned up
			await clearKV(wrangler.env.cache);

			await wrangler.dispose();
		},
		{ scope: 'worker', auto: true },
	],
});

test.beforeEach(({ msw }) => {
	msw.resetHandlers();
});
