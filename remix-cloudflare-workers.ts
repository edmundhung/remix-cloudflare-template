import type {
  AppLoadContext,
  ServerBuild,
  ServerPlatform
} from "@remix-run/server-runtime";
import { createRequestHandler as createRemixRequestHandler } from "@remix-run/server-runtime";
import { installGlobals } from "@remix-run/node";

// Setup sign & unsign functions only
installGlobals();

export interface GetLoadContextFunction {
  (request: Request): AppLoadContext;
}

// Standard platform-specific `createRequestHandler`
export function createRequestHandler({
  build,
  getLoadContext,
  mode
}: {
  build: ServerBuild;
  getLoadContext?: GetLoadContextFunction;
  mode?: string;
}) {
  let platform: ServerPlatform = {};
  let handleRequest = createRemixRequestHandler(build, platform, mode);

  return (request: Request) => {
    let loadContext =
      typeof getLoadContext === "function" ? getLoadContext(request) : undefined;

    return handleRequest(request, loadContext);
  };
}
