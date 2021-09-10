import { getAssetFromKV, MethodNotAllowedError, NotFoundError } from "@cloudflare/kv-asset-handler";
import type { ServerBuild } from "remix";
import { createRequestHandler } from "./remix-cloudflare-workers";
import build from "./build/index.js";

async function handleAsset(event: FetchEvent): Promise<Response> {
  try {
    if (process.env.NODE_ENV === 'development') {
      return await getAssetFromKV(event, {
        cacheControl: {
          bypassCache: true,
        },
      });
    }

    return await getAssetFromKV(event);
  } catch (error) {
    if (error instanceof MethodNotAllowedError || error instanceof NotFoundError) {
      return new Response('Not Found', { status: 404 });
    }

    throw error;
  }
};

function createEventHandler(build: ServerBuild): (event: FetchEvent) => void {
  const handleRequest = createRequestHandler({
    build,
  });

  const handleEvent = async (event: FetchEvent): Promise<Response> => {
    let response = await handleRequest(event.request);

    if (response.status === 404) {
      response = await handleAsset(event);
    }

    return response;
  };

  return (event: FetchEvent): void => {
    try {
      event.respondWith(handleEvent(event));
    } catch (e) {
      if (process.env.NODE_ENV === 'development') {
        event.respondWith(
          new Response(e.message || e.toString(), {
            status: 500,
          })
        );
        return;
      }

      event.respondWith(new Response('Internal Error', { status: 500 }));
    };
  };
}

addEventListener('fetch', createEventHandler(build));
