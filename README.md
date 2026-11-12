# Remix Cloudflare Template

A minimal Remix application starter with a home page, configured for Cloudflare Workers deployment through the Cloudflare Vite plugin.

## Starter Shape

- `app/actions/controller.tsx` owns the top-level route actions.
- `app/actions/home-page.tsx` and `app/actions/document.tsx` render the route-owned starter UI.
- `app/actions/public/` contains the browser runtime entry and interactive prompt button. Keep `clientEntry()` components in a `public/` folder so the browser can load them.
- `app/routes.ts` defines the shared route contract used by server and browser modules for type-safe hrefs.
- `app/router.ts` wires routes to handlers and installs the standard Remix component renderer used by actions.
- `app/assets.ts` points the document at the browser entry that Vite serves in dev and builds for production.
- Root `public/` contains static files that Workers Assets serves unchanged from the app root.
- `vite.config.ts` builds the browser entry and gives `clientEntry()` components IDs that work in a deployed Worker.
- `server.ts` is the Worker entrypoint, configured in `wrangler.jsonc`.

## Growing The App

- Put top-level route actions in `app/actions/controller.tsx`.
- Add `app/actions/<route-key>/controller.tsx` when a nested route map needs its own actions or middleware.
- Add directories like `app/data/` or `test/` when the app actually needs them.
- Move shared UI into `app/ui/` once more than one route needs it.

## Commands

```sh
npm i
npm run dev
npm run preview
npm run deploy
npm test
npm run typecheck
```
