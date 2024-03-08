import type { PlatformProxy } from 'wrangler';

// You can generate the ENV type based on `wrangler.toml` and `.dev.vars`
// by running `npm run typegen`
type Cloudflare = Omit<PlatformProxy<Env>, 'dispose'>;
type LoadContext = {
	cloudflare: Cloudflare;
};

declare module '@remix-run/cloudflare' {
	interface AppLoadContext {
		env: Cloudflare['env'];
		cf: Cloudflare['cf'];
		ctx: Cloudflare['ctx'];
		cache: Cloudflare['caches'];
	}
}

export function getLoadContext({
	context,
}: {
	request: Request;
	context: LoadContext;
}) {
	return {
		env: context.cloudflare.env,
		cf: context.cloudflare.cf,
		ctx: context.cloudflare.ctx,
		cache: context.cloudflare.caches,
	};
}
