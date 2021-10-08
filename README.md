# remix-worker-template

> The current starter template is based on Remix 0.19.0 and requires no patches anymore.

- [Remix Docs](https://docs.remix.run)
- [Customer Dashboard](https://remix.run/dashboard)

## Give it a try

> The deploy button will guide you through the setup for CF_API_TOKEN and CF_ACCOUNT_ID on the UI. But you are still required to provide the REMIX_TOKEN as a repository secret yourself for the deploy action to work properly.

[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/edmundhung/remix-worker-template)

## Development

To starts your app in development mode, rebuilding assets on file changes, the recommended approach is:

```sh
npm run dev
```

This will run your remix app using miniflare in dev mode together with the Cypress test runner opened.

## Deployment

First, preview your app with:

```sh
npx wrangler preview
```

When confirmed everythings works, deploy the worker with Wrangler using:

```sh
npm run deploy
```
