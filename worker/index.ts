import { createFetchHandler } from './adapter';
import manifestJSON from '__STATIC_CONTENT_MANIFEST';
import * as build from '../build/index.js';

const manifest = JSON.parse(manifestJSON);
const handleFetch = createFetchHandler({ build, manifest });

const worker = {
  async fetch(request, environment, context) {
    return handleFetch(request, environment, context);
  },
};

export default worker;
