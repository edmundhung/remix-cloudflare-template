import type { MetaFunction, LinksFunction, LoaderFunction } from "remix";
import { useLoaderData, Link } from "remix";

export let meta: MetaFunction = () => {
  return {
    title: "remix-worker-template",
    description: "Starter template for setting up a remix app on Cloudflare Workers"
  };
};

export let links: LinksFunction = () => {
  return [];
};

export let loader: LoaderFunction = async () => {
  return { message: "this is awesome 😎" };
};

export default function Index() {
  let data = useLoaderData();

  return (
    <div>
      <h2>Welcome to Remix!</h2>
      <p className="py-3">
        <a className="underline" href="https://docs.remix.run" target="_blank" rel="noopener noreferrer">Check out the docs</a> to get started.
      </p>
      <p className="py-3">Message from the loader: <span className="inline-block">{data.message}</span></p>
      <p className="py-3">
        Clicking this link will land you in your root CatchBoundary component: <Link className="inline-block underline" to="not-found">Link to 404 not found page.</Link>
      </p>
    </div>
  );
}
