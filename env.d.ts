import 'vite/client';
import '@remix-run/cloudflare';
import '@cloudflare/workers-types';

interface Env {
	ENVIRONMENT?: 'development';
	GITHUB_TOKEN?: string;
	CACHE: KVNamespace<string>;
}

declare module '@remix-run/cloudflare' {
	export interface AppLoadContext {
		env: Env;
		waitUntil(promise: Promise<void>): void;
	}
}
