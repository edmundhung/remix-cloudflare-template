import chevronUpIcon from '~/assets/chevron-up.svg';
import chevronRightIcon from '~/assets/chevron-right.svg';
import remixLetterLogo from '~/assets/remix-letter-light.svg';
import { Link, useLocation } from '@remix-run/react';
import { Fragment, useEffect, useLayoutEffect, useRef } from 'react';

export interface Menu {
	title: string;
	links: Array<{
		title: string;
		to: string;
	}>;
}

export const useSafeLayoutEffect =
	typeof document === 'undefined' ? useEffect : useLayoutEffect;

export function Breadcrumbs({
	locationKey,
	trails,
	children,
}: {
	locationKey: string;
	trails: string[];
	children: React.ReactNode;
}) {
	const detailsRef = useRef<HTMLDetailsElement>(null);

	useSafeLayoutEffect(() => {
		if (detailsRef.current) {
			detailsRef.current.open = false;
		}
	}, [locationKey]);

	return (
		<>
			<details
				id="breadcrumbs"
				ref={detailsRef}
				className="group peer h-12 border-t bg-white open:bg-neutral-100 hover:bg-neutral-100 lg:hidden"
			>
				<summary className="h-full cursor-pointer select-none px-2 marker:content-none">
					<div className="mx-auto flex h-full max-w-screen-sm flex-row items-center gap-2">
						<img
							src={chevronRightIcon}
							className="block h-4 w-4 group-open:hidden"
							alt="expand"
							aria-hidden
						/>
						<img
							src={chevronUpIcon}
							className="hidden h-4 w-4 group-open:block"
							alt="collapse"
							aria-hidden
						/>
						<div className="truncate">
							{trails.map((trail, index) => (
								<Fragment key={index}>
									{index > 0 ? (
										<span className="px-2 text-zinc-500">/</span>
									) : null}
									<span>{trail}</span>
								</Fragment>
							))}
						</div>
					</div>
				</summary>
			</details>
			<div className="fixed inset-x-0 bottom-12 top-0 hidden max-h-[calc(100vh-3rem)] flex-1 overflow-y-auto border-t bg-white peer-open:block lg:relative lg:inset-x-auto lg:bottom-auto lg:flex lg:max-h-none">
				{children}
			</div>
		</>
	);
}

export function MainNavigation({ menus }: { menus: Menu[] }) {
	const location = useLocation();
	const trails = menus.reduce<string[]>((result, menu) => {
		if (result.length === 0) {
			const link = menu.links.find(link => link.to === location.pathname);

			if (link) {
				return [menu.title, link.title];
			}
		}

		return result;
	}, []);

	return (
		<div className="flex flex-col lg:h-screen">
			<Breadcrumbs locationKey={location.key} trails={trails}>
				<nav className="mx-auto flex max-w-screen-sm flex-1 flex-col px-5 py-5 lg:py-10">
					<header className="px-2 pb-8 pt-1">
						<Link to="/" className="inline-block">
							<div className="flex items-center gap-2">
								<img
									className="inline-block h-8 w-8"
									src={remixLetterLogo}
									alt="Remix logo"
								/>
								<span className="text-lg">Cloudflare Template</span>
							</div>
						</Link>
					</header>
					<div className="-ml-5 flex-1 space-y-4 overflow-y-auto">
						{menus.map(menu => (
							<div key={menu.title} className="px-2 ">
								<div className="sticky top-0 bg-white pb-2 pl-5 font-bold">
									{menu.title}
								</div>
								<ul>
									{menu.links.map(link => (
										<li key={link.to}>
											<Link
												className="group flex flex-row items-center gap-2 py-2 text-sm"
												to={link.to}
											>
												<img
													src={chevronRightIcon}
													className={`h-3 w-3 group-hover:visible ${link.to === location.pathname ? 'visible' : 'invisible'}`}
													alt="current page indicator"
													aria-hidden
												/>
												{link.title}
											</Link>
										</li>
									))}
								</ul>
							</div>
						))}
					</div>
					<footer className="hidden pt-5 lg:block">
						📜 All-in-one remix starter template for Cloudflare Pages
					</footer>
				</nav>
			</Breadcrumbs>
		</div>
	);
}

export function Layout({
	children,
	menus,
}: {
	children?: React.ReactNode;
	menus: Menu[];
}) {
	return (
		<div className="mx-auto lg:container">
			<div className="flex flex-col-reverse lg:flex-row">
				<section className="sticky bottom-0 flex-1 lg:relative lg:bottom-auto">
					<div className="lg:sticky lg:top-0">
						<MainNavigation menus={menus} />
					</div>
				</section>
				<main className="flex-1">
					<div className="px-5 py-5 lg:py-10">{children}</div>
				</main>
			</div>
		</div>
	);
}

export function ErrorLayout({
	title,
	description,
}: {
	title?: string;
	description?: string;
}) {
	return (
		<div className="flex h-screen items-center">
			<div className="mx-auto p-5">
				<h2 className="text-xl">{title}</h2>
				<p className="py-2">{description}</p>
			</div>
		</div>
	);
}
