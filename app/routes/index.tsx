import { MetaFunction, LinksFunction, LoaderFunction, Form } from 'remix';
import { useLoaderData } from 'remix';

export let meta: MetaFunction = () => {
  return {
    title: 'remix-worker-template',
    description:
      'Starter template for setting up a Remix app on Cloudflare Workers',
  };
};

export let action: ActionFunction = async ({ request, context }) => {
  const formData = new URLSearchParams(await request.text());

  await context.counter.increment(formData.get('name'));

  return null;
};

export let links: LinksFunction = () => {
  return [];
};

export let loader: LoaderFunction = async ({ request, context }) => {
  const counters = ['🚀', '🗺️', '⚡', '📡'];
  const counts = await Promise.all(
    counters.map(async (name) => [name, await context.counter.getCount(name)])
  );

  return {
    message: 'Why Remix on Cloudflare Workers?',
    counts: Object.fromEntries(counts),
  };
};

export default function Index() {
  let data = useLoaderData();

  return (
    <div>
      <h2>Welcome to Remix! 💿</h2>
      <p className="py-3">
        <a
          className="underline"
          href="https://docs.remix.run"
          target="_blank"
          rel="noopener noreferrer"
        >
          Check out the docs
        </a>{' '}
        to get started
      </p>

      <h3 className="mt-10 font-bold">{data.message}</h3>

      <div className="max-w-3xl">
        <Form method="post">
          <input type="hidden" name="name" value="🚀" />
          <button
            type="submit"
            className="block w-full flex flex-row items-center justify-between p-2 my-4 border cursor-pointer hover:border-red-500"
          >
            <span className="text-left">
              Blazing fast react app rendered on the edge
            </span>
            <span className="whitespace-nowrap">🚀 {data.counts['🚀']}</span>
          </button>
        </Form>

        <Form method="post">
          <input type="hidden" name="name" value="🗺️" />
          <button
            type="submit"
            className="block w-full flex flex-row items-center justify-between p-2 my-4 border cursor-pointer hover:border-blue-500"
          >
            <span className="text-left">
              Showing localized content based on your user Geo-location
            </span>
            <span className="whitespace-nowrap">🗺️ {data.counts['🗺️']}</span>
          </button>
        </Form>

        <Form method="post">
          <input type="hidden" name="name" value="⚡" />
          <button
            type="submit"
            className="block w-full flex flex-row items-center justify-between p-2 my-4 border cursor-pointer hover:border-yellow-500"
          >
            <span className="text-left">
              Customizing the CDN Cache within the worker for best performance
            </span>
            <span className="whitespace-nowrap">⚡ {data.counts['⚡']}</span>
          </button>
        </Form>

        <Form method="post">
          <input type="hidden" name="name" value="📡" />
          <button
            type="submit"
            className="block w-full flex flex-row items-center justify-between p-2 my-4 border cursor-pointer hover:border-purple-500"
          >
            <span className="text-left">
              Serving your data with a low-latency key-value store
            </span>
            <span className="whitespace-nowrap">📡 {data.counts['📡']}</span>
          </button>
        </Form>
      </div>
    </div>
  );
}
