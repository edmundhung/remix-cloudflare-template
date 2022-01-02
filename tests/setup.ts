import { test as base, expect } from '@playwright/test';
import {
  fixtures,
  TestingLibraryFixtures,
} from '@playwright-testing-library/test/fixture';
import { Miniflare } from 'miniflare';
import { MockAgent, setGlobalDispatcher } from 'undici';

interface TestFixtures extends TestingLibraryFixtures {
  mockAgent: MockAgent;
}

interface WorkerFixtures {
  mf: Miniflare;
  port: number;
}

export { expect };

export const test = base.extend<TestFixtures, WorkerFixtures>({
  // Setup queries from playwright-testing-library
  ...fixtures,

  // Assign a unique "port" for each worker process
  port: [
    // eslint-disable-next-line no-empty-pattern
    async ({}, use, workerInfo) => {
      await use(3001 + workerInfo.workerIndex);
    },
    { scope: 'worker' },
  ],

  // Ensure visits works with relative path
  baseURL: ({ port }, use) => {
    use(`http://localhost:${port}`);
  },

  // Setup mock client for requests initiated by the Worker
  mockAgent:
    // eslint-disable-next-line no-empty-pattern
    async ({}, use) => {
      const mockAgent = new MockAgent();

      // Optional: This makes all the request fails if no matching mock is found
      // mockAgent.disableNetConnect();

      setGlobalDispatcher(mockAgent);

      await use(mockAgent);
    },

  // Miniflare instance
  mf: [
    async ({ port }, use) => {
      const mf = new Miniflare({
        wranglerConfigPath: true,
        buildCommand: undefined,
        bindings: {},
        port,
      });

      // Start the server.
      let server = await mf.startServer();

      // Use the server in the tests.
      await use(mf);

      // Cleanup.
      await new Promise<void>((resolve, reject) => {
        server.close((error) => (error ? reject(error) : resolve()));
      });
    },
    { scope: 'worker', auto: true },
  ],
});
