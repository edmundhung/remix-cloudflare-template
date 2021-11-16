import { createFetchHandler } from './adapter';
import manifestJSON from '__STATIC_CONTENT_MANIFEST';
import * as build from '../build/index.js';
import { Counter } from './counter';

const manifest = JSON.parse(manifestJSON);

function createCounter(namespace: DurableObjectNamespace) {
  function getCounter(name: string): Counter {
    const id = namespace.idFromName(name);
    const obj = namespace.get(id);

    return obj;
  }

  return {
    async getCount(name: string): Promise<Number> {
      const counter = getCounter(name);
      const response = await counter.fetch('/');
      const count = await response.text();

      return Number(count);
    },
    async increment(name: string): Promise<Number> {
      const counter = getCounter(name);
      const response = await counter.fetch('/increment');
      const count = await response.text();

      return Number(count);
    },
  };
}

const handleFetch = createFetchHandler({
  build,
  manifest,
  getLoadContext(request, env, ctx) {
    return {
      counter: createCounter(env.COUNTER),
    };
  },
});

const worker = {
  async fetch(request, env, ctx) {
    return handleFetch(request, env, ctx);
  },
};

export default worker;

export { Counter };
