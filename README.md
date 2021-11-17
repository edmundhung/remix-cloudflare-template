# remix-worker-template

[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/edmundhung/remix-worker-template)

> The current starter template is based on Remix 0.21.0

- [Remix Docs](https://docs.remix.run)
- [Customer Dashboard](https://remix.run/dashboard)

## Differences with the Remix CF Workers template

While the official template provides the bare minimums for you to kickstart a Remix app running on Cloudflare Workers, this starter template adds a few extra tools that are common for development and let you be productive right away. These tools include:

- Tailwind
- ESLint
- Prettier
- Cypress

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

This will run your remix app in dev mode using miniflare with the Cypress test runner opened.

## Deployment

First, preview your app with:

```sh
npx wrangler preview
```

When confirmed everythings works, deploy the worker with Wrangler using:

```sh
npx wrangler publish
```

## CI/CD

The template ships a basic [deploy workflow](./.github/workflows/deploy.yml) which is triggered when new changes are pushed to the `main` branch.

To setup the CI environment, following variables are required:

- CF_API_TOKEN
- CF_ACCOUNT_ID

These values could be found / created on your Cloudflare Dashboard. If your project is bootstrapped with the deploy button above, both should be already set in the repository.

Alternatively, **CF_ACCOUNT_ID** can be set as `account_id` on the [wrangler.toml](./wrangler.toml).
