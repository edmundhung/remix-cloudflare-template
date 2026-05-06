# Remix Cloudflare Template

A minimal Remix 3 starter for Cloudflare Workers.

## Quick Start

```sh
npm install
# Start vite dev server with the Cloudflare Vite plugin
npm run dev
# Preview the production build locally
npm run preview
# Deploy to Cloudflare
npm run deploy
```

## Migrating to Cloudflare

This template replaces the default Remix Assets Server with a Vite-based setup that runs in the Cloudflare Workers runtime and produces the client build for deployment.

If you are comparing this template with the [official Remix template](https://github.com/remix-run/remix/tree/a077a838d91b95b081802f1765dd0e6a21d8d8d6/template), or migrating an app from that template to Cloudflare, here are the main changes.

### 1. Replace the Node server wrapper with a Worker entrypoint

Update [`./server.ts`](../server.ts) to export a `fetch()` handler:

```ts
import { router } from './app/router.ts'

export default {
  async fetch(request: Request) {
    try {
      return await router.fetch(request)
    } catch (error) {
      console.error(error)
      return new Response('Internal Server Error', { status: 500 })
    }
  },
}
```

Then create a `wrangler.jsonc` with `main: "./server.ts"`.

### 2. Move the client entry to the root and make it Vite-friendly

Move the browser entry to [`./client.ts`](../client.ts), then resolve app modules through `import.meta.glob(...)`. Vite automatically includes those client modules in both dev and production builds.

```ts
import { run } from 'remix/ui'

const clientModules = import.meta.glob(['/app/**/*.{ts,tsx}', '!/app/**/*.server.*'])

run({
  async loadModule(moduleUrl, exportName) {
    let load = clientModules[moduleUrl]

    if (!load) {
      throw new Error(`Unknown client entry module: ${moduleUrl}`)
    }

    let mod = await load()

    if (!mod || typeof mod !== 'object') {
      throw new Error(`Invalid client entry module: ${moduleUrl}`)
    }

    let entry = Reflect.get(mod, exportName)

    if (typeof entry !== 'function') {
      throw new Error(`Missing client entry export ${exportName} in ${moduleUrl}`)
    }

    return entry
  },
  async resolveFrame(src, signal, target) {
    // ... no change here
  },
})
```

### 3. Configure Vite to build a client entry

Add a `vite.config.ts` with `@cloudflare/vite-plugin`, then tell Vite to build `client.ts` to `assets/client.js`:

```ts
export default defineConfig({
  environments: {
    client: {
      build: {
        rollupOptions: {
          input: fileURLToPath(new URL('./client.ts', import.meta.url)),
          output: {
            entryFileNames: 'assets/client.js',
            chunkFileNames: 'assets/[name]-[hash].js',
          },
        },
      },
    },
  },
  plugins: [cloudflare()],
})
```

Make sure the document script points to `/client.ts` in dev and `/assets/client.js` in production:

```ts
const CLIENT_ENTRY_SRC = import.meta.env.DEV ? '/client.ts' : '/assets/client.js'
<script type="module" src={CLIENT_ENTRY_SRC}></script>
```
