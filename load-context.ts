import { type PlatformProxy } from 'wrangler';

declare module '@remix-run/cloudflare' {
	// eslint-disable-next-line @typescript-eslint/no-empty-interface
	interface AppLoadContext extends ReturnType<typeof getLoadContext> {
		// This will merge the result of `getLoadContext` into the `AppLoadContext`
	}
}

export function getLoadContext({
	context,
}: {
	request: Request;
	context: {
		cloudflare: Omit<
			PlatformProxy<Env, IncomingRequestCfProperties>,
			'dispose' | 'caches'
		> & {
			caches:
				| PlatformProxy<Env, IncomingRequestCfProperties>['caches']
				| CacheStorage;
		};
	};
}) {
	return {
		env: context.cloudflare.env,
		cf: context.cloudflare.cf,
		ctx: context.cloudflare.ctx,
		cache: context.cloudflare.caches,
	};
}
