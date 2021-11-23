import type { MetaFunction, LinksFunction, LoaderFunction } from 'remix';
import { useLoaderData } from 'remix';

export let meta: MetaFunction = () => {
  return {
    title: 'remix-worker-template',
    description: 'All-in-one remix starter template for Cloudflare Workers',
  };
};

export let links: LinksFunction = () => {
  return [];
};

export let loader: LoaderFunction = async ({ request }) => {
  return {
    title: 'remix-worker-template',
  };
};

export default function Index() {
  let { title } = useLoaderData();

  return (
    <div>
      <div className="sm:px-10 p-5">
        <h2 className="mt-6 text-xl">{title}</h2>
        <p className="py-2">
          All-in-one remix starter template for Cloudflare Workers
        </p>

        <a
          className="inline-block border hover:border-black px-4 py-2 mt-2"
          href="https://github.com/edmundhung/remix-worker-template"
          target="_blank"
          rel="noopener noreferrer"
        >
          Github Repository
        </a>
      </div>
      <section className="mt-10">
        <h3 className="sticky top-20 border-b bg-white px-5 sm:px-10 py-2 font-bold">
          Why should I try running Remix on Cloudflare Workers?
        </h3>
        <div className="px-5 sm:px-10">
          <div className="p-4 my-4 border">
            🚀 Blazing fast react app rendered on the edge
          </div>

          <div className="p-4 my-4 border">
            🗺️ Showing localized content based on your user Geolocation
          </div>

          <div className="p-4 my-4 border">
            ⚡ Customizing the CDN Cache within the worker for best performance
          </div>

          <div className="p-4 my-4 border">
            📡 Serving your data with a low-latency key-value store
          </div>
        </div>
      </section>
    </div>
  );
}
