import * as build from '../build/index.js';
import { createRequestHandler, handleAsset } from './adapter';

const handleRequest = createRequestHandler<Env>({
  build,
  getLoadContext(request, env, ctx) {
    return { env, ctx };
  },
});

const worker: ExportedHandler<Env> = {
  async fetch(request, env, ctx): Promise<Response> {
    try {
      let response = await handleAsset(request, env, ctx);

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
