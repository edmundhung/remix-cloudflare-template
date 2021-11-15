import type { MetaFunction, LinksFunction, LoaderFunction } from 'remix';
import { useLoaderData } from 'remix';

export let meta: MetaFunction = () => {
  return {
    title: 'remix-worker-template',
    description:
      'Starter template for setting up a Remix app on Cloudflare Workers',
  };
};

export let links: LinksFunction = () => {
  return [];
};

export let loader: LoaderFunction = async ({ request }) => {
  return {
    message: 'Why Remix on Cloudflare Workers?',
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

      <details className="p-2 my-4 border cursor-pointer">
        <summary>🚀 Blazing fast react app rendered on the edge</summary>
      </details>

      <details className="p-2 my-4 border cursor-pointer">
        <summary>
          🗺️ Showing localized content based on your user Geolocation
        </summary>
      </details>

      <details className="p-2 my-4 border cursor-pointer">
        <summary>
          ⚡ Customizing the CDN Cache within the worker for best performance
        </summary>
      </details>

      <details className="p-2 my-4 border cursor-pointer">
        <summary>
          📡 Serving your data with a low-latency key-value store
        </summary>
      </details>
    </div>
  );
}
