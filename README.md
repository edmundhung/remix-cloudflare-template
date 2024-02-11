# remix-cloudflare-template

Learn more about [Remix Stacks](https://remix.run/stacks).

```
npx create-remix@latest --template edmundhung/remix-cloudflare-template
```

What's included?

- Development with [Vite](https://vitejs.dev)
- [Github Actions](https://github.com/features/actions) for CI/CD
- [Markdoc](https://markdoc.dev) for rendering markdown
- Styling with [Tailwind](https://tailwindcss.com/)
- End-to-end testing with [Playwright](playwright.dev/)
- Local third party request mocking with [MSW](https://mswjs.io/)
- Code formatting with [Prettier](https://prettier.io)
- Linting with [ESLint](https://eslint.org)
- Static Types with [TypeScript](https://typescriptlang.org)

## Development

Before start, copy `wrangler.toml.example` and name it `wrangler.toml`. This
file will be used to configure the development environment and define all the
environment variables that you need for your application.

```sh
cp wrangler.toml.example wrangler.toml
```

To starts the vite dev server:

```sh
npm run dev
```

You can also start the Playwright UI mode to test your application. You will
find all the tests defined in the [/tests/e2e](./tests/e2e/) directory.

```sh
npm run test
```

To test your application on the workerd runtime, you can start the wrangler dev
server with:

```sh
npm run build && npm run start
```

### New environment variable

To add a new environment variable, you can update the **var** section on the
[wrangler.toml](./wrangler.toml) file with the new variable:

```toml
[vars]
NEW_VARIABLE = "..."
```

The variable will be available from the `env` object in the context.

### Setup a KV Namespace

To setup a new KV namespace on the **development environment**, update
[wrangler.toml](./wrangler.toml) with another object similar to the cache
namespace as shown below:

```toml
kv_namespaces = [
  { binding = "cache", id = "cache" },
  { binding = "new_namespace", id = "new_namespace" }
]
```

Note that the `id` has no effect on the dev environment. You can use the same
name for both `id` and `binding`. The namespace will be available form the `env`
object in the context.

### Improving types

You can improve the types of the `env` object by updating
[env.d.ts](./env.d.ts).

## Deployment

Before your first deployment, make sure all the environment variables and
bindings are set properly on the
[Cloudlfare Dashboard](https://dash.cloudflare.com/login).

### Creating a new application

To create a new application on the Cloudflare Dashboard, select **Workers and
Pages** from the menu and click on **Create Application**. You can then follow
the instructions based on your needs.

### Setting up environment variables

To set up environment variables, select **Workers and Pages** from the menu and
look for the application details. You will find the **environment variables**
section under the **Settings** tab.

### Setting up KV namespaces

To set up a new KV namespaces, you need to create a new namespace first through
the **KV** menu under **Workers and Pages** and click **Create a namespace**.

After creating the namespace, you can bind the namespace to the application from
the application details page. You can find the setting from the **Functions**
section under the **Settings** tab.

### Debugging

If your application is not working properly, you can find the real-time logs in
the **Functions** tab from the deployment details page.
