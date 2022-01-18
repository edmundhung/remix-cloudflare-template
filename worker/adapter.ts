// Required for installGlobals();
import '@remix-run/cloudflare-pages';

// Required for custom adapters
import type {
  AppLoadContext,
  ServerBuild,
  ServerPlatform,
} from '@remix-run/server-runtime';
import { createRequestHandler as createRemixRequestHandler } from '@remix-run/server-runtime';

// Required only for Worker Site
import type { Options as KvAssetHandlerOptions } from '@cloudflare/kv-asset-handler';
import {
  getAssetFromKV,
  MethodNotAllowedError,
  NotFoundError,
} from '@cloudflare/kv-asset-handler';
import manifest from '__STATIC_CONTENT_MANIFEST';

export interface GetLoadContextFunction<Env = unknown> {
  (request: Request, env: Env, ctx: ExecutionContext): AppLoadContext;
}

export type RequestHandler = ReturnType<typeof createRequestHandler>;

export function createRequestHandler<Env>({
  build,
  getLoadContext,
  mode,
}: {
  build: ServerBuild;
  getLoadContext?: GetLoadContextFunction<Env>;
  mode?: string;
}): ExportedHandlerFetchHandler<Env> {
  let platform: ServerPlatform = {};
  let handleRequest = createRemixRequestHandler(build, platform, mode);

  return (request: Request, env: Env, ctx: ExecutionContext) => {
    let loadContext =
      typeof getLoadContext === 'function'
        ? getLoadContext(request, env, ctx)
        : undefined;

    return handleRequest(request, loadContext);
  };
}

export function createFetchHandler<Env>({
  build,
  getLoadContext,
  handleAsset,
  enableCache,
  mode,
}: {
  build: ServerBuild;
  getLoadContext?: GetLoadContextFunction<Env>;
  handleAsset: (
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ) => Promise<Response>;
  enableCache?: boolean;
  mode?: string;
}): ExportedHandlerFetchHandler<Env> {
  const handleRequest = createRequestHandler<Env>({
    build,
    getLoadContext,
    mode,
  });

  return async (request: Request, env: Env, ctx: ExecutionContext) => {
    try {
      let isHeadOrGetRequest =
        request.method === 'HEAD' || request.method === 'GET';
      let cache = enableCache ? await caches.open(build.assets.version) : null;
      let response: Response | undefined;

      if (isHeadOrGetRequest) {
        response = await handleAsset(request.clone(), env, ctx);
      }

      if (response && response.status >= 200 && response.status < 400) {
        return response;
      }

      if (cache && isHeadOrGetRequest) {
        response = await cache?.match(request);
      }

      if (!response || !response.ok) {
        response = await handleRequest(request.clone(), env, ctx);

        if (cache && isHeadOrGetRequest && response.ok) {
          ctx.waitUntil(cache?.put(request, response.clone()));
        }
      }

      return response;
    } catch (e: any) {
      console.log('Error caught', e.message, e);

      if (process.env.NODE_ENV === 'development' && e instanceof Error) {
        return new Response(e.message || e.toString(), {
          status: 500,
        });
      }

      return new Response('Internal Error', { status: 500 });
    }
  };
}

export function createWorkerAssetHandler(build: ServerBuild) {
  async function handleAsset<Env>(
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {
    try {
      const event = {
        request,
        waitUntil(promise: Promise<any>) {
          return ctx.waitUntil(promise);
        },
      };
      const options: Partial<KvAssetHandlerOptions> = {
        ASSET_NAMESPACE: (env as any).__STATIC_CONTENT,
        ASSET_MANIFEST: JSON.parse(manifest),
      };

      const assetpath = build.assets.url.split('/').slice(0, -1).join('/');
      const requestpath = new URL(request.url).pathname
        .split('/')
        .slice(0, -1)
        .join('/');

      if (requestpath.startsWith(assetpath)) {
        options.cacheControl = {
          bypassCache: false,
          edgeTTL: 31536000,
          browserTTL: 31536000,
        };
      }

      if (process.env.NODE_ENV === 'development') {
        options.cacheControl = {
          bypassCache: true,
        };
      }

      return await getAssetFromKV(event, options);
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

  return handleAsset;
}

export function createPageAssetHandler() {
  async function handleAsset<Env>(
    request: Request,
    env: Env
  ): Promise<Response> {
    if (process.env.NODE_ENV === 'development') {
      request.headers.delete('if-none-match');
    }

    let response = await (env as any).ASSETS.fetch(request.url, request);

    if (process.env.NODE_ENV === 'development') {
      response = new Response(response.body, response);
    }

    return response;
  }

  return handleAsset;
}
