import { test, expect } from './setup';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

/**
 * You can interact with the page or browser through the page / queries
 */
test('if the page shows the package name', async ({ queries }) => {
  const elements = await queries.queryAllByText('remix-worker-template', {
    exact: false,
  });

  expect(elements).toBeTruthy();
});

/**
 * You can interact with the miniflare instance as well
 * Like reading KV values saved with `mf.getKVNamespace('...')`
 * Or even interacting with the DO by `mf.getDurableObjectNamespace(...)`
 */
test('if the binding are set properly', async ({ mf }) => {
  const bindings = await mf.getBindings();

  expect(bindings).toEqual({
    __STATIC_CONTENT: expect.anything(),
    __STATIC_CONTENT_MANIFEST: expect.anything(),
  });
});

/**
 * You can also mock the requests sent out from the workers
 * @see https://github.com/nodejs/undici/blob/main/docs/api/MockAgent.md
 */
test('if the request is sent', async ({ mockAgent }) => {
  const client = mockAgent.get('http://example.com');

  client
    .intercept({
      method: 'GET',
      path: '/hello-world',
    })
    .reply(200, {
      foo: 'bar',
    });

  // expect() something happens
});
