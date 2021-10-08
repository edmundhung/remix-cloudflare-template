import { getAssetFromKV, MethodNotAllowedError, NotFoundError } from "@cloudflare/kv-asset-handler";
import { createEventHandler } from "@remix-run/cloudflare-workers";
import * as build from "../build/index.js";

addEventListener('fetch', createEventHandler({ build }));
