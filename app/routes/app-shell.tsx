import { Outlet } from "react-router";

import { Header } from "~/components/Layout/Header/Header";

export default function AppShell() {
	return (
		<div className="flex min-h-svh w-full flex-col">
			<Header />
			<main className="flex py-5">
				<div className="flex-1 max-w-7xl mx-auto px-2">
					<Outlet />
				</div>
			</main>
		</div>
	);
}
