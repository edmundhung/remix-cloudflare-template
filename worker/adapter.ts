// Required for installGlobals();
import '@remix-run/cloudflare-workers';

// Required for custom adapters
import type { AppLoadContext } from '@remix-run/cloudflare';
import { createRequestHandler as createRemixRequestHandler } from '@remix-run/cloudflare';

// Required only for Worker Site
import {
  getAssetFromKV,
  MethodNotAllowedError,
  NotFoundError,
} from '@cloudflare/kv-asset-handler';

// @ts-expect-error External JSON only available on CF runtime / Miniflare
import manifest from '__STATIC_CONTENT_MANIFEST';

export interface GetLoadContextFunction<Env = unknown> {
  (request: Request, env: Env, ctx: ExecutionContext): AppLoadContext;
}

export type RequestHandler = ReturnType<typeof createRequestHandler>;

export function createRequestHandler<Env>({
  /**
   * Remix build files
   */
  build,

  /**
   * Optional: Context to be available on `loader` or `action`, default to `undefined` if not defined
   * @param request Request
   * @param env Variables defined for the environment
   * @param ctx Exectuion context, i.e. ctx.waitUntil() or ctx.passThroughOnException();
   * @returns Context
   */
  getLoadContext,
}: {
  build: any; // ServerBuild
  getLoadContext?: GetLoadContextFunction<Env>;
}): ExportedHandlerFetchHandler<Env> {
  let handleRequest = createRemixRequestHandler(build, process.env.NODE_ENV);

  return (request: Request, env: Env, ctx: ExecutionContext) => {
    let loadContext =
      typeof getLoadContext === 'function'
        ? getLoadContext(request, env, ctx)
        : undefined;

    return handleRequest(request, loadContext);
  };
}

export async function handleKvAsset<Env>(
  request: Request,
  env: Env,
  ctx: ExecutionContext
): Promise<Response> {
  try {
    return await getAssetFromKV(
      {
        request,
        waitUntil(promise: Promise<any>) {
          return ctx.waitUntil(promise);
        },
      },
      {
        cacheControl(request) {
          const url = new URL(request.url);

          if (url.pathname.startsWith('/build')) {
            return {
              browserTTL: 60 * 60 * 24 * 365,
              edgeTTL: 60 * 60 * 24 * 365,
            };
          }

          return {
            browserTTL: 60 * 10,
            edgeTTL: 60 * 10,
          };
        },
        ASSET_NAMESPACE: (env as any).__STATIC_CONTENT,
        ASSET_MANIFEST: JSON.parse(manifest),
      }
    );
  } catch (error) {
    if (
      error instanceof MethodNotAllowedError ||
      error instanceof NotFoundError
    ) {
      return new Response('Not Found', { status: 404 });
    }

    throw error;
  }
}

export async function handlePageAsset<Env>(
  request: Request,
  env: Env & { ASSETS: { fetch: typeof fetch } }
): Promise<Response> {
  return await env.ASSETS.fetch(request.url, request);
}
