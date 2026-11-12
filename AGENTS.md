# Remix Cloudflare Template Agent Guide

This app was scaffolded with `remix new`. Use these conventions when continuing to build it out.

## Commands

```sh
npm i
npm run dev
npm run build
npm run preview
npm run deploy
npm test
npm run typecheck
```

`npm run dev` runs the app in the Workers runtime through the Cloudflare Vite plugin. `npm run preview` builds the app and serves the production output locally. `npm test` runs without Vite, in plain Node.

## Building Features

Refer to ./.agents/skills/remix/SKILL.md for the Remix mental model and how to find guides and API READMEs through `node_modules/remix/INDEX.md`.

## Platform Features

Refer to ./.agents/skills/cloudflare/SKILL.md for Cloudflare bindings, storage, and deployment.

## Starter Layout

- `app/routes.ts` defines the shared route contract used by server and browser modules for type-safe hrefs
- `app/router.ts` wires routes to controllers and installs the standard Remix component renderer used by actions
- Put top-level route actions in `app/actions/controller.tsx`; add `app/actions/<route-key>/controller.tsx` for nested route maps. `app/actions/controller.test.ts` is the root controller's router smoke test
- `app/actions/home-page.tsx` and `app/actions/document.tsx` render the route-owned starter UI
- `app/actions/public/` contains the browser runtime entry and interactive prompt button. Only modules in `public/` folders, and what they import, reach the browser, so keep `clientEntry()` components there
- `app/assets.ts` points the document at the browser entry that Vite serves in dev and builds for production
- Root `public/` contains static files that Workers Assets serves unchanged from the app root
- `vite.config.ts` rewrites `clientEntry(import.meta.url, ...)` to `/app/...` IDs, because `import.meta.url` doesn't point at the source file in a deployed Worker
- `server.ts` is the Worker entrypoint and `wrangler.jsonc` configures it; add bindings there

This starter intentionally begins small; add directories like `app/data/`, `app/middleware/`, `app/ui/`, and `test/` only when you need them.
