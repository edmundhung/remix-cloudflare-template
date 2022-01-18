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

  /**
   * Optional: Enable cache for response from the Remix request handler, no cache by default
   * Experimental feature - Let me know if you run into problems with cache enabled
   */
  enableCache: false,
});

const worker: ExportedHandler = {
  fetch: handleFetch,
};

export default worker;
