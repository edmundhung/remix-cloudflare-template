import * as build from '../build/index.js';
import { createRequestHandler, handleKvAsset } from './adapter';

interface Env {
  // Declare the types of your environment variables here
}

const handleRequest = createRequestHandler<Env>({
  build,
  getLoadContext(request, env, ctx) {
    return { env, ctx };
  },
});

const worker: ExportedHandler<Env> = {
  async fetch(request, env, ctx): Promise<Response> {
    try {
      /**
       * Check if there is any asset matching the request URL first.
       * 1) Use `handleKvAsset` for Worker Site
       * 2) Use `handlePageAsset` for Pages
       */
      let response = await handleKvAsset(request, env, ctx);

      if (response.status === 404) {
        response = await handleRequest(request, env, ctx);
      }

      return response;
    } catch (exception) {
      if (process.env.NODE_ENV === 'development') {
        return new Response(`${exception}`, { status: 500 });
      }

      return new Response('Internal Server Error', { status: 500 });
    }
  },
};

export default worker;
