import type { Options as KvAssetHandlerOptions } from '@cloudflare/kv-asset-handler';
import {
  getAssetFromKV,
  MethodNotAllowedError,
  NotFoundError,
} from '@cloudflare/kv-asset-handler';
import type {
  AppLoadContext,
  ServerBuild,
  ServerPlatform,
} from '@remix-run/server-runtime';
import { createRequestHandler as createRemixRequestHandler } from '@remix-run/server-runtime';

export interface GetLoadContextFunction {
  (request: Request, env: any, ctx: any): AppLoadContext;
}

export type RequestHandler = ReturnType<typeof createRequestHandler>;

export function createRequestHandler({
  build,
  getLoadContext,
  mode,
}: {
  build: ServerBuild;
  getLoadContext?: GetLoadContextFunction;
  mode?: string;
}) {
  let platform: ServerPlatform = {};
  let handleRequest = createRemixRequestHandler(build, platform, mode);

  return (request: Request, env: any, ctx: any) => {
    let loadContext =
      typeof getLoadContext === 'function'
        ? getLoadContext(request, env, ctx)
        : undefined;

    return handleRequest(request, loadContext);
  };
}

export function createAssetHandler({
  build,
  manifest,
  kvAssetHandlerOptions,
}: {
  build: ServerBuild;
  manifest: any;
  kvAssetHandlerOptions?: Partial<KvAssetHandlerOptions>;
}) {
  const assetpath = build.assets.url.split('/').slice(0, -1).join('/');

  return async (request: Request, env: any, ctx: any) => {
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
        ASSET_MANIFEST: manifest,
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

export function createFetchHandler({
  build,
  getLoadContext,
  mode,
  manifest,
  kvAssetHandlerOptions,
}: {
  build: ServerBuild;
  getLoadContext?: GetLoadContextFunction;
  mode?: string;
  manifest: any;
  kvAssetHandlerOptions?: Partial<KvAssetHandlerOptions>;
}) {
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

  return async (request: Request, env: any, ctx: any) => {
    try {
      let response = await handleAsset(request, env, ctx);

      if (!response) {
        response = await handleRequest(request, env, ctx);
      }

      return response;
    } catch (e: any) {
      if (process.env.NODE_ENV === 'development') {
        return new Response(e.message || e.toString(), {
          status: 500,
        });
      }

      return new Response('Internal Error', { status: 500 });
    }
  };
}
