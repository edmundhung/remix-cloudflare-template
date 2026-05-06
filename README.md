# Remix Cloudflare Template

A minimal Remix application starter with a home page and an auth page, configured for Cloudflare Workers deployment through the Cloudflare Vite plugin.

## Starter Shape

- `app/controllers/home.tsx` owns the home page.
- `app/controllers/auth.tsx` owns the auth page.
- `app/routes.ts` defines the route contract.
- `app/router.ts` wires routes to handlers.
- `app/ui/` holds the shared document and layout wrappers.
- `app/utils/render.tsx` centralizes HTML response rendering.

## Growing The App

- Start with flat route files and only introduce route folders when a route needs multiple actions or route-owned modules.
- Add directories like `app/data/`, `app/middleware/`, `public/`, or `test/` when the app actually needs them.
- Move shared UI into `app/ui/` once more than one route needs it.

## Commands

```sh
npm i
npm run dev
npm run preview
npm run deploy
```
