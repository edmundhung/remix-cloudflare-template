# remix-worker-template

Learn more about [Remix Stacks](https://remix.run/stacks).

```
npx create-remix --template edmundhung/remix-worker-template
```

What's included?

- Deploying to [Cloudflare Workers](https://workers.cloudflare.com/)
- Supporting [Durable objects](https://developers.cloudflare.com/workers/learning/using-durable-objects) with [module workers](https://developers.cloudflare.com/workers/learning/migrating-to-module-workers/)
- CI/CD through [Github Actions](https://github.com/features/actions)
- Styling with [Tailwind](https://tailwindcss.com/)
- Testing with [Playwright](playwright.dev/) with _undici_ mocking support
- Code formatting with [Prettier](https://prettier.io)
- Linting with [ESLint](https://eslint.org)
- Static Types with [TypeScript](https://typescriptlang.org)

## Node Version

Please make sure the node version is **>= 16.7**. If you are using `nvm`, just run:

```sh
nvm use
```

This allows [miniflare](https://github.com/cloudflare/miniflare) to serve a development environment as close to the actual worker runtime as possibile.

## Development

To starts your app in development mode, rebuilding assets on file changes, the recommended approach is:

```sh
npm run dev
```

This will run your remix app in dev mode using miniflare.

## Testing

Before running the tests, please ensure the worker is built:

```sh
npm run build && npm run test
```

## Deployment

To deploy your Remix app, simply do it with Wrangler using:

```sh
npx wrangler publish
```

## CI/CD

The template ships a [development workflow](./.github/workflows/development.yml) which is triggered whenever new changes are pushed.

To allow GitHub deploying the worker for you, following variables are required:

- CF_API_TOKEN
- CF_ACCOUNT_ID

These values could be found / created on your Cloudflare Dashboard
