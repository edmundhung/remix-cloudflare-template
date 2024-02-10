import type { MetaFunction, LoaderFunctionArgs } from '@remix-run/cloudflare';
import { useLoaderData } from '@remix-run/react';

export const meta: MetaFunction = () => {
  return [
    { title: 'remix-worker-template' },
    { description: 'All-in-one remix starter template for Cloudflare Workers' },
  ];
};

export function loader({ request }: LoaderFunctionArgs) {
  return {
    title: 'remix-worker-template',
  };
}

export default function Index() {
  const { title } = useLoaderData<typeof loader>();

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
    </div>
  );
}
