# remix-cloudflare-template

Learn more about [Remix Stacks](https://remix.run/stacks).

```
npx create-remix --template edmundhung/remix-cloudflare-template
```

What's included?

- Deploying to [Cloudflare Page](https://workers.cloudflare.com/)
- CI on [Github Actions](https://github.com/features/actions)
- Styling with [Tailwind](https://tailwindcss.com/)
- Testing using [Playwright](playwright.dev/) with _undici_ mocking support
- Code formatting with [Prettier](https://prettier.io)
- Linting with [ESLint](https://eslint.org)
- Static Types with [TypeScript](https://typescriptlang.org)

## Node Version

Please make sure the node version is **>= 18**.

## Development

To starts your app with the vite dev server, run the following command:

```sh
npm run dev
```

## Testing

Before running the tests, please ensure the app is built:

```sh
npm run build && npm run test
```

## CI/CD

The template ships a [CI workflow](./.github/workflows/ci.yml) which is triggered whenever new changes are pushed.
