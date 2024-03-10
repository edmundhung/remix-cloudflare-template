import type {
	LinksFunction,
	LoaderFunctionArgs,
	MetaFunction,
} from '@remix-run/cloudflare';
import * as React from 'react';
import {
	Links,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
	isRouteErrorResponse,
	json,
	useLoaderData,
	useRouteError,
} from '@remix-run/react';
import stylesUrl from '~/styles.css?url';
import { type Menu, ErrorLayout, Layout } from './layout';

export const links: LinksFunction = () => {
	return [{ rel: 'stylesheet', href: stylesUrl }];
};

export const meta: MetaFunction = () => {
	return [
		{ charset: 'utf-8' },
		{ name: 'viewport', content: 'width=device-width, initial-scale=1' },
		{ title: 'remix-cloudlfare-template' },
	];
};

export function loader({ context }: LoaderFunctionArgs) {
	const menus: Menu[] = [
		{
			title: 'Docs',
			links: [
				{
					title: 'Overview',
					to: '/',
				},
			],
		},
		{
			title: 'Useful links',
			links: [
				{
					title: 'GitHub',
					to: `https://github.com/${context.env.GITHUB_OWNER}/${context.env.GITHUB_REPO}`,
				},
				{
					title: 'Remix docs',
					to: 'https://remix.run/docs',
				},
				{
					title: 'Cloudflare docs',
					to: 'https://developers.cloudflare.com/pages',
				},
			],
		},
	];

	return json({
		menus,
	});
}

export default function App() {
	const { menus } = useLoaderData<typeof loader>();

	return (
		<Document>
			<Layout menus={menus}>
				<Outlet />
			</Layout>
		</Document>
	);
}

function Document({
	children,
	title,
}: {
	children: React.ReactNode;
	title?: string;
}) {
	return (
		<html lang="en">
			<head>
				<meta charSet="utf-8" />
				{title ? <title>{title}</title> : null}
				<Meta />
				<Links />
			</head>
			<body>
				{children}
				<ScrollRestoration />
				<Scripts />
			</body>
		</html>
	);
}

export function ErrorBoundary() {
	const error = useRouteError();

	// Log the error to the console
	console.error(error);

	if (isRouteErrorResponse(error)) {
		const title = `${error.status} ${error.statusText}`;

		let message;
		switch (error.status) {
			case 401:
				message =
					'Oops! Looks like you tried to visit a page that you do not have access to.';
				break;
			case 404:
				message =
					'Oops! Looks like you tried to visit a page that does not exist.';
				break;
			default:
				message = JSON.stringify(error.data, null, 2);
				break;
		}

		return (
			<Document title={title}>
				<ErrorLayout title={title} description={message} />
			</Document>
		);
	}

	return (
		<Document title="Error!">
			<ErrorLayout title="There was an error" description={`${error}`} />
		</Document>
	);
}
