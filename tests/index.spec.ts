import { test, expect } from './setup';

test.describe('Index', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('if it shows the package name', async ({ queries }) => {
    const elements = await queries.queryAllByText('remix-worker-template', {
      exact: false,
    });

    expect(elements).toBeTruthy();
  });
});
