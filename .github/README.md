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

This template replaces the Remix asset server with a Vite build, so the app runs in the Cloudflare Workers runtime and the browser code is built ahead of time.

If you are comparing this template with the [official Remix template](https://github.com/remix-run/remix/tree/remix%403.2.0/template), or migrating an app from that template to Cloudflare, here are the main changes.

### 1. Replace the Node server with a Worker entrypoint

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

Then create a [`wrangler.jsonc`](../wrangler.jsonc) with `main: "./server.ts"`, and delete `hmr.ts`.

### 2. Build the browser entry with Vite

Add a [`vite.config.ts`](../vite.config.ts) with `@cloudflare/vite-plugin`, and build `app/actions/public/entry.ts` to `assets/entry.js`:

```ts
export default defineConfig({
  environments: {
    client: {
      build: {
        rollupOptions: {
          input: fileURLToPath(new URL('./app/actions/public/entry.ts', import.meta.url)),
          output: {
            entryFileNames: 'assets/entry.js',
            chunkFileNames: 'assets/[name]-[hash].js',
          },
        },
      },
    },
  },
  plugins: [clientEntryIds(), cloudflare()],
})
```

Copy `clientEntryIds()` from [`vite.config.ts`](../vite.config.ts) too. In a deployed Worker, `import.meta.url` doesn't point at the component's source file, so the plugin rewrites `clientEntry(import.meta.url, ...)` to the component's path, for example `'/app/actions/public/prompt-button.tsx#PromptButton'`. Components keep using `import.meta.url` as in the Remix docs.

### 3. Load client entries with `import.meta.glob()`

In [`app/actions/public/entry.ts`](../app/actions/public/entry.ts), look up each client entry in an `import.meta.glob()` map instead of importing it by URL:

```ts
import { run } from 'remix/component'

const modules = import.meta.glob<Record<string, unknown>>('/app/**/public/**/*.{ts,tsx}')

run({
  async loadModule(moduleUrl, exportName) {
    let load = modules[moduleUrl]
    if (!load) {
      throw new Error(`Unknown client entry module: ${moduleUrl}. Move it into a public/ folder.`)
    }
    let Component = (await load())[exportName]
    if (typeof Component !== 'function') {
      throw new Error(`Unknown component: ${moduleUrl}#${exportName}`)
    }
    return Component
  },
})
```

Only modules in `public/` folders, and what they import, reach the browser. Keep `clientEntry()` components there, as the official template already does.

### 4. Replace the asset server

Replace [`app/assets.ts`](../app/assets.ts) with a static script entry. Vite serves the source in dev and builds it to `assets/entry.js`:

```ts
export const scriptEntry = {
  href: import.meta.env?.DEV ? '/app/actions/public/entry.ts' : '/assets/entry.js',
  importMap: {},
  preloads: [],
}
```

Keep an `assets` export with a `getScriptEntry()` for `render({ assets })`. Only `npm test` reaches it, because tests run without Vite. Then remove the `assets` route from `app/routes.ts` and its action from `app/actions/controller.tsx`.

### 5. Let Workers Assets serve `public/`

Remove `staticFiles()` from [`app/router.ts`](../app/router.ts). Workers Assets serves `public/` and the built `assets/` files before requests reach the Worker.

### 6. Update the project config

- In [`tsconfig.json`](../tsconfig.json), replace `remix/assets/types/hmr` with `vite/client` in `types`.
- In [`package.json`](../package.json), use the Vite and Wrangler scripts (`dev`, `build`, `preview`, `deploy`), and add `@cloudflare/vite-plugin`, `vite` and `wrangler` as dev dependencies.
