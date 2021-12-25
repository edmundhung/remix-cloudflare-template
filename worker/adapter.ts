import type { Options as KvAssetHandlerOptions } from '@cloudflare/kv-asset-handler';
import {
  getAssetFromKV,
  MethodNotAllowedError,
  NotFoundError,
} from '@cloudflare/kv-asset-handler';
import '@remix-run/cloudflare-pages'; // Required for installGlobals
import type {
  AppLoadContext,
  ServerBuild,
  ServerPlatform,
} from '@remix-run/server-runtime';
import { createRequestHandler as createRemixRequestHandler } from '@remix-run/server-runtime';

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
  getLoadContext?: GetLoadContextFunction;
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

export function createAssetHandler<Env>({
  build,
  manifest,
  kvAssetHandlerOptions,
}: {
  build: ServerBuild;
  manifest: string;
  kvAssetHandlerOptions?: Partial<KvAssetHandlerOptions>;
}): ExportedHandlerFetchHandler<Env> {
  const assetpath = build.assets.url.split('/').slice(0, -1).join('/');

  return async (request: Request, env: Env, ctx: ExecutionContext) => {
    try {
      const event = {
        request,
        waitUntil(promise) {
          return ctx.waitUntil(promise);
        },
      };
      const options: KvAssetHandlerOptions = {
        ...kvAssetHandlerOptions,
        ASSET_NAMESPACE: env.__STATIC_CONTENT,
        ASSET_MANIFEST: JSON.parse(manifest),
      };

      if (process.env.NODE_ENV === 'development') {
        return await getAssetFromKV(event, {
          ...options,
          // Ignore the options and bypass cache in development
          cacheControl: {
            bypassCache: true,
          },
        });
      }

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

      return await getAssetFromKV(event, options);
    } catch (error) {
      if (
        error instanceof MethodNotAllowedError ||
        error instanceof NotFoundError
      ) {
        return null;
      }

      throw error;
    }
  };
}

export function createFetchHandler<Env>({
  build,
  getLoadContext,
  mode,
  manifest,
  getCache,
  kvAssetHandlerOptions,
}: {
  build: ServerBuild;
  getLoadContext?: GetLoadContextFunction<Env>;
  mode?: string;
  manifest: string;
  getCache?: Promise<Cache>;
  kvAssetHandlerOptions?: Partial<KvAssetHandlerOptions>;
}): ExportedHandlerFetchHandler<Env> {
  const handleRequest = createRequestHandler({
    build,
    getLoadContext,
    mode,
  });

  const handleAsset = createAssetHandler({
    build,
    manifest,
    kvAssetHandlerOptions,
  });

  return async (request: Request, env: Env, ctx: ExecutionContext) => {
    try {
      let isHeadOrGetRequest =
        request.method === 'HEAD' || request.method === 'GET';
      let cache = await getCache?.();
      let response;

      if (isHeadOrGetRequest) {
        response = await handleAsset(request, env, ctx);
      }

      if (response) {
        return response;
      }

      if (isHeadOrGetRequest) {
        response = await cache?.match(request);
      }

      if (!response) {
        response = await handleRequest(request, env, ctx);
      }

      if (isHeadOrGetRequest) {
        ctx.waitUntil(cache?.put(request, response.clone()));
      }

      return response;
    } catch (e: any) {
      if (process.env.NODE_ENV === 'development' && e instanceof Error) {
        return new Response(e.message || e.toString(), {
          status: 500,
        });
      }

      return new Response('Internal Error', { status: 500 });
    }
  };
}
