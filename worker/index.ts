import * as build from '../build/index.js';
import {
  createFetchHandler,
  createWorkerAssetHandler,
  // createPageAssetHandler,
} from './adapter';

const handleFetch = createFetchHandler({
  /**
   * Required: Remix build files
   */
  build,

  /**
   * Optional: Setup Cache for the responses from Remix
   * No cache will be set if the function is not defined
   * or if the function returns undefined or null
   * @returns Cache
   */
  getCache() {
    return caches.open(process.env.VERSION);
  },

  /**
   * Optional: Context to be available on `loader` or `action`, default to `undefined` if not defined
   * @param request Request
   * @param env Variables defined for the environment
   * @param ctx Exectuion context, i.e. ctx.waitUntil() or ctx.passThroughOnException();
   * @returns Context
   */
  getLoadContext(request, env, ctx) {
    return { env, ctx };
  },

  /**
   * Required: Setup how the assets are served
   * 1) Call `createWorkerAssetHandler(build)` when using Worker Site
   * 2) Call `createPageAssetHandler()` when using Pages
   */
  handleAsset: createWorkerAssetHandler(build),
});

const worker: ExportedHandler = {
  fetch: handleFetch,
};

export default worker;
