# remix-worker-template

[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/edmundhung/remix-worker-template)

> The current starter template is based on Remix 1.1.1

- [Repository](https://github.com/remix-run/remix)
- [Remix Docs](https://remix.run/docs)

## Differences with the Official CF Workers template

While the official template provides the bare minimums for you to kickstart a Remix app running on Cloudflare Workers, this starter template adds a few extra tools that are common for development and let you be productive right away. These tools include:

- Tailwind
- Playwright
- ESLint
- Prettier

In addition, it is now setup using a custom adapter based on the official **Cloudflare Pages adapter**. This allows us running a module worker with supports of `Durable Objects`. This is a temporay workaround until an official update is landed on the CF Worker adapter.

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

These values could be found / created on your Cloudflare Dashboard. If your project is bootstrapped with the deploy button above, both should be already set in the repository.

Alternatively, **CF_ACCOUNT_ID** can be set as `account_id` on the [wrangler.toml](./wrangler.toml).
